"use client";

import { useEffect, useRef, useState } from "react";
import ShareCard from "@/components/ShareCard";
import { localDate } from "@/lib/shareCard";
import { BENCH_MODELS, TASKS_VISION_BUNDLE, TASKS_VISION_VERSION, TASKS_VISION_WASM, mib } from "@/lib/poseBenchmark";
import {
  CHALLENGES,
  CHALLENGE_SECONDS,
  COUNTDOWN_SECONDS,
  EXERCISES,
  PLANK,
  SKELETON,
  VISIBILITY_MIN,
  beatLine,
  bucketReps,
  challengeLink,
  createCounter,
  createHold,
  describeZone,
  exerciseAngle,
  heldSeconds,
  paceSquares,
  parseChallengeLink,
  plankReading,
  plankShareLine,
  shareLine,
  step,
  stepHold,
} from "@/lib/repCounter.mjs";

/**
 * The webcam rep challenge: 30 seconds of squats, jumping jacks, push-ups or
 * lunges, or a plank held as long as you can.
 *
 * The camera feed goes from the <video> element into MediaPipe Pose
 * Landmarker (lite) running in WebAssembly in this tab; each frame's
 * landmarks become one angle (src/lib/repCounter.mjs), and the rep state
 * machine in that module counts, or the plank hold timer in the same module
 * times. No frame is recorded, stored or sent: the network traffic is the
 * download of the runtime from cdn.jsdelivr.net and of the model from
 * storage.googleapis.com, the same files and URLs /tools/pose-benchmark loads
 * (src/lib/poseBenchmark.ts), plus the runtime's own usage report to Google
 * (TASKS_VISION_USAGE_LOG_URL there: timings, no images).
 *
 * "Beat my score": the result's share link is /challenge?ex=<slug>&beat=<n>.
 * Opening one preselects the exercise and shows the score to beat; the link
 * is read by parseChallengeLink, which accepts a known slug and a whole
 * number and nothing else, so no text from the address reaches the page.
 */

type RepId = keyof typeof EXERCISES;
type ChallengeId = RepId | "plank";
type Stage = "idle" | "loading" | "ready" | "countdown" | "running" | "done";
type Counter = ReturnType<typeof createCounter>;
type Hold = ReturnType<typeof createHold>;

/* The subset of @mediapipe/tasks-vision used here, typed by hand from the
 * package's vision.d.ts so the site does not depend on the package. */
type Lm = { x: number; y: number; z: number; visibility?: number };
type PoseResult = { landmarks: Lm[][]; worldLandmarks?: Lm[][] };
type Landmarker = { detectForVideo(v: HTMLVideoElement, ts: number): PoseResult; close(): void };
type VisionModule = {
  FilesetResolver: { forVisionTasks(basePath: string): Promise<unknown> };
  PoseLandmarker: {
    createFromOptions(
      fileset: unknown,
      options: {
        baseOptions: { modelAssetPath: string; delegate: "GPU" | "CPU" };
        runningMode: "VIDEO";
        numPoses: number;
      },
    ): Promise<Landmarker>;
  };
};

const LITE = BENCH_MODELS.find((m) => m.id === "lite")!;
const SITE = "https://aifitnessapi.com/challenge";

type Result = { exercise: ChallengeId; score: number; buckets: number[]; rejected: number; breaks: number; date: string };

const isPlank = (id: ChallengeId): id is "plank" => id === "plank";
const labelOf = (id: ChallengeId) => (isPlank(id) ? PLANK.label : EXERCISES[id].label);

/** Where to put the camera, per exercise. */
const SETUP: Record<ChallengeId, string> = {
  squat: "Face the camera, whole body in frame.",
  "jumping-jack": "Face the camera, whole body and both arms in frame.",
  "push-up": "Camera at floor level, side-on, so it sees your shoulder, elbow and wrist.",
  lunge: "Side-on or facing the camera, whole body in frame; alternate legs as you like.",
  plank: "Camera at floor level, side-on, shoulders to ankles in frame.",
};

export default function RepChallenge() {
  const [exerciseId, setExerciseId] = useState<ChallengeId>("squat");
  const [target, setTarget] = useState<{ id: ChallengeId; beat: number } | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [status, setStatus] = useState("");
  const [angle, setAngle] = useState<number | null>(null);
  const [tilt, setTilt] = useState<number | null>(null);
  const [phase, setPhase] = useState<string>("waiting");
  const [score, setScore] = useState(0);
  const [clock, setClock] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [delegate, setDelegate] = useState("");
  const [fps, setFps] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lmRef = useRef<Landmarker | null>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const stageRef = useRef<Stage>("idle");
  const exRef = useRef<ChallengeId>("squat");
  const counterRef = useRef<Counter>(createCounter(EXERCISES.squat));
  const holdRef = useRef<Hold>(createHold());
  const tRef = useRef({ countdownEnd: 0, start: 0, end: 0 });
  const loopingRef = useRef(false);
  const fpsRef = useRef({ since: 0, frames: 0 });

  const plank = isPlank(exerciseId);
  const ex = plank ? null : EXERCISES[exerciseId];

  function go(s: Stage) {
    stageRef.current = s;
    setStage(s);
  }

  // A "Beat my score" link: preselect its exercise and show its score.
  useEffect(() => {
    const link = parseChallengeLink(window.location.search);
    if (!link) return;
    pick(link.id as ChallengeId);
    if (link.beat !== null) setTarget({ id: link.id as ChallengeId, beat: link.beat });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      lmRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function resetCounters(id: ChallengeId) {
    if (isPlank(id)) holdRef.current = createHold();
    else counterRef.current = createCounter(EXERCISES[id]);
    setPhase("waiting");
  }

  function pick(id: ChallengeId) {
    setExerciseId(id);
    exRef.current = id;
    resetCounters(id);
  }

  async function start() {
    go("loading");
    setResult(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("this browser has no camera API");
      setStatus("Asking for the camera. Frames stay in this tab.");
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
    } catch (e) {
      setStatus(`No camera: ${(e as Error).message || "permission denied"}. The challenge needs one; nothing else on the page does.`);
      go("idle");
      return;
    }
    const video = videoRef.current!;
    video.srcObject = streamRef.current;
    await video.play();
    if (video.readyState < 2) await new Promise<void>((r) => video.addEventListener("loadeddata", () => r(), { once: true }));

    let mod: VisionModule;
    let fileset: unknown;
    try {
      setStatus(`Loading the MediaPipe runtime (${TASKS_VISION_VERSION}) from cdn.jsdelivr.net…`);
      const url = TASKS_VISION_BUNDLE;
      mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)) as VisionModule;
      fileset = await mod.FilesetResolver.forVisionTasks(TASKS_VISION_WASM);
    } catch (e) {
      setStatus(`Could not load the MediaPipe runtime: ${(e as Error).message}. A blocker or network policy may be stopping cdn.jsdelivr.net.`);
      stopCamera();
      return;
    }
    setStatus(`Loading ${LITE.name} (${mib(LITE.bytes)})…`);
    for (const d of ["GPU", "CPU"] as const) {
      try {
        lmRef.current = await mod.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: LITE.url, delegate: d },
          runningMode: "VIDEO",
          numPoses: 1,
        });
        setDelegate(d);
        break;
      } catch {
        /* try the next delegate */
      }
    }
    if (!lmRef.current) {
      setStatus("The pose model could not start on this browser with either the GPU or the CPU delegate.");
      stopCamera();
      return;
    }
    setStatus(`${SETUP[exRef.current]} Then press Go.`);
    resetCounters(exRef.current);
    go("ready");
    resume();
  }

  function resume() {
    if (loopingRef.current) return;
    loopingRef.current = true;
    fpsRef.current = { since: 0, frames: 0 };
    rafRef.current = requestAnimationFrame(loop);
  }

  function stopCamera() {
    cancelAnimationFrame(rafRef.current);
    loopingRef.current = false;
    lmRef.current?.close();
    lmRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setAngle(null);
    setTilt(null);
    setClock(null);
    go("idle");
  }

  function countdown() {
    tRef.current.countdownEnd = performance.now() + COUNTDOWN_SECONDS * 1000;
    setResult(null);
    setScore(0);
    go("countdown");
    resume();
  }

  function finish() {
    const id = exRef.current;
    const { start } = tRef.current;
    if (isPlank(id)) {
      const h = holdRef.current;
      setResult({ exercise: id, score: heldSeconds(h), buckets: [], rejected: 0, breaks: h.breaks, date: localDate() });
    } else {
      const c = counterRef.current;
      setResult({ exercise: id, score: c.reps, buckets: bucketReps(c.repTimes, start), rejected: c.rejected, breaks: 0, date: localDate() });
    }
    setClock(null);
    setStatus("Done. Detection is paused until you press Go again; no frame was recorded or sent.");
    go("done");
  }

  function draw(lms: Lm[] | undefined, joints: number[]) {
    const c = overlayRef.current;
    const v = videoRef.current;
    if (!c || !v) return;
    if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
      c.width = v.videoWidth || 640;
      c.height = v.videoHeight || 480;
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!lms) return;
    const P = (i: number) => [lms[i].x * c.width, lms[i].y * c.height] as const;
    const seen = (i: number) => (lms[i]?.visibility ?? 1) >= VISIBILITY_MIN;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    for (const [a, b] of SKELETON) {
      if (!seen(a) || !seen(b)) continue;
      ctx.beginPath();
      ctx.moveTo(...P(a));
      ctx.lineTo(...P(b));
      ctx.stroke();
    }
    for (const [a, b] of SKELETON) {
      for (const i of [a, b]) {
        if (!seen(i)) continue;
        const hot = joints.includes(i);
        ctx.fillStyle = hot ? "#10b981" : "#ffffff";
        ctx.beginPath();
        ctx.arc(...P(i), hot ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /** One frame for the plank: reading, timer, end of round. */
  function plankFrame(lms: Lm[] | undefined, world: Lm[] | undefined, aspect: number, now: number) {
    const r = lms ? plankReading(lms, world, aspect) : { line: null, tilt: null, ok: null };
    draw(lms, PLANK.sides.flat());
    setAngle(r.line);
    setTilt(r.tilt);
    const s = stageRef.current;
    if (s === "countdown") {
      const left = tRef.current.countdownEnd - now;
      setClock(Math.ceil(left / 1000));
      if (left <= 0) {
        holdRef.current = createHold(now);
        tRef.current.start = now;
        setScore(0);
        go("running");
      }
    } else if (s === "running") {
      holdRef.current = stepHold(holdRef.current, r.ok, now);
      setScore(heldSeconds(holdRef.current));
      if (holdRef.current.phase === "over") finish();
    }
    setPhase(s === "running" ? holdRef.current.phase : r.ok ? "in position" : "not in position");
  }

  function loop() {
    const v = videoRef.current;
    const lm = lmRef.current;
    if (!v || !lm) {
      loopingRef.current = false;
      return;
    }
    const now = performance.now();
    const f = fpsRef.current;
    if (!f.since) f.since = now;
    f.frames++;
    if (now - f.since >= 1000) {
      setFps((f.frames * 1000) / (now - f.since));
      f.since = now;
      f.frames = 0;
    }
    if (v.readyState >= 2) {
      const ts = Math.max(lastTsRef.current + 1, Math.round(now));
      lastTsRef.current = ts;
      let res: PoseResult | null = null;
      try {
        res = lm.detectForVideo(v, ts);
      } catch {
        res = null;
      }
      const id = exRef.current;
      const lms = res?.landmarks[0];
      const world = res?.worldLandmarks?.[0];
      const aspect = v.videoWidth / (v.videoHeight || 1);
      if (isPlank(id)) {
        plankFrame(lms, world, aspect, now);
      } else {
        const exercise = EXERCISES[id];
        const a = lms ? exerciseAngle(exercise, lms, world, aspect) : null;
        draw(lms, exercise.sides.flat());
        setAngle(a);
        const s = stageRef.current;
        if (s === "countdown") {
          const left = tRef.current.countdownEnd - now;
          setClock(Math.ceil(left / 1000));
          if (left <= 0) {
            counterRef.current = createCounter(exercise);
            tRef.current.start = now;
            tRef.current.end = now + CHALLENGE_SECONDS * 1000;
            setScore(0);
            go("running");
          } else {
            // Practice the phases during the countdown; the count resets at Go.
            counterRef.current = step(counterRef.current, a, now);
          }
        } else if (s === "running") {
          counterRef.current = step(counterRef.current, a, now);
          setScore(counterRef.current.reps);
          const left = tRef.current.end - now;
          setClock(Math.max(0, Math.ceil(left / 1000)));
          if (left <= 0) finish();
        } else {
          counterRef.current = step(counterRef.current, a, now);
        }
        setPhase(counterRef.current.phase);
      }
    }
    // After the result, stop running the model: the card and buttons should
    // not compete with inference for a slow device's main thread.
    if (stageRef.current === "done") {
      loopingRef.current = false;
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }

  const busy = stage === "loading" || stage === "countdown" || stage === "running";
  const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";
  const chip = "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)]";
  const primary =
    "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
  const secondary =
    "rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400 disabled:opacity-50";
  const phaseName = plank
    ? phase
    : phase === "waiting"
      ? `waiting for ${ex!.restName}`
      : phase === "rest"
        ? ex!.restName
        : ex!.activeName;
  const camOn = stage !== "idle" && stage !== "loading";
  // The score from a "Beat my score" link, for its own exercise only.
  const beat = target && target.id === exerciseId ? target.beat : null;
  const resultText = (r: Result) => {
    if (isPlank(r.exercise)) return `${r.score} ${r.score === 1 ? "second" : "seconds"}`;
    const e = EXERCISES[r.exercise];
    return `${r.score} ${r.score === 1 ? e.noun : e.plural}`;
  };

  return (
    <div className={`mt-8 ${box}`}>
      {beat !== null && (
        <p data-challenge-beat className="mb-5 rounded-xl border border-brand-400/40 bg-brand-500/10 px-4 py-3 text-lg font-bold text-[var(--fg)]">
          {beatLine(exerciseId, beat)}
          <span className="block text-sm font-normal text-[var(--muted)]">
            The score from the link you opened. Start the camera and press Go to try.
          </span>
        </p>
      )}
      <fieldset disabled={busy}>
        <legend className="text-sm font-semibold text-[var(--fg)]">Exercise</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CHALLENGES.map((c) => (
            <label key={c.id} className={chip}>
              <input
                type="radio"
                name="challenge-exercise"
                value={c.slug}
                checked={exerciseId === c.id}
                onChange={() => pick(c.id as ChallengeId)}
              />
              {labelOf(c.id as ChallengeId)}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]" data-challenge-setup>
          {SETUP[exerciseId]}{" "}
          {plank
            ? `Hold it as long as you can, up to ${PLANK.MAX_SECONDS / 60} minutes.`
            : `As many as you can in ${CHALLENGE_SECONDS} seconds.`}
        </p>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {stage === "idle" || stage === "loading" ? (
          <button type="button" onClick={start} disabled={stage === "loading"} className={primary}>
            {stage === "loading" ? "Starting…" : "Start camera"}
          </button>
        ) : (
          <>
            <button type="button" onClick={countdown} disabled={busy} className={primary}>
              {stage === "done" ? "Go again" : "Go"}
            </button>
            <button type="button" onClick={stopCamera} className={secondary}>
              Camera off
            </button>
          </>
        )}
        <p role="status" aria-live="polite" data-challenge-status className="text-sm text-[var(--muted)]">
          {status}
        </p>
      </div>

      <div className={`relative mt-5 overflow-hidden rounded-xl bg-black ${camOn ? "" : "hidden"}`}>
        {/* Mirrored like a selfie view; the overlay is mirrored with it. */}
        <div className="relative -scale-x-100">
          <video ref={videoRef} muted playsInline className="block h-auto w-full" />
          <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-2 font-mono text-sm text-white">
          <div data-challenge-angle>
            {plank ? "body line" : ex!.angleName}: {angle === null ? "no reading" : `${Math.round(angle)}°`}
          </div>
          {plank && <div>tilt: {tilt === null ? "no reading" : `${Math.round(tilt)}°`}</div>}
          <div>phase: {phaseName}</div>
          <div data-challenge-fps>{fps === null ? "" : `${fps.toFixed(0)} frames/s`}</div>
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-2 text-right text-white">
          <div className="text-xs uppercase tracking-wider">{plank ? "seconds" : "reps"}</div>
          <div data-challenge-reps className="text-3xl font-bold tabular-nums">
            {stage === "running" || stage === "done" ? score : "–"}
          </div>
        </div>
        {(stage === "countdown" || (stage === "running" && !plank)) && clock !== null && (
          <div
            data-challenge-clock
            className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-5xl font-extrabold text-white drop-shadow"
          >
            {stage === "countdown" ? clock : `${clock}s`}
          </div>
        )}
      </div>

      {camOn && (
        <p className="mt-3 text-xs text-[var(--muted)]">
          {plank
            ? `Timing a plank: the hip angle between shoulder and ankle above ${PLANK.STRAIGHT_MIN}° and the body within ${PLANK.TILT_MAX}° of level; out of position for ${PLANK.GRACE_MS / 1000} s ends it.`
            : `Counting ${ex!.plural}: a rep is ${ex!.angleName} ${describeZone(ex!.active)} and back ${describeZone(ex!.rest)}.`}{" "}
          Model: {LITE.name}, {delegate || "…"} delegate, in this tab.
        </p>
      )}

      {result && (
        <ResultCard result={result} beat={result.exercise === exerciseId ? beat : null} text={resultText(result)} />
      )}
    </div>
  );
}

function ResultCard({ result, beat, text }: { result: Result; beat: number | null; text: string }) {
  const plank = isPlank(result.exercise);
  const link = challengeLink(result.exercise, result.score);
  const linkNoScheme = link.replace(/^https:\/\//, "");
  const shareText = plank
    ? plankShareLine({ seconds: result.score, url: linkNoScheme })
    : shareLine({ exercise: EXERCISES[result.exercise as RepId], reps: result.score, buckets: result.buckets, url: linkNoScheme });
  const label = labelOf(result.exercise);
  return (
    <div data-challenge-result className="mt-8 border-t border-[var(--border)] pt-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Your result</p>
      <p className="mt-2 text-4xl font-extrabold text-[var(--fg)]">
        {text}{" "}
        <span className="text-lg font-medium text-[var(--muted)]">
          {plank ? "of plank" : `in ${CHALLENGE_SECONDS} seconds`}
        </span>
      </p>
      {beat !== null && (
        <p data-challenge-beat-result className="mt-2 text-sm font-semibold text-[var(--fg)]">
          {result.score > beat ? `You beat ${beat}.` : result.score === beat ? `A tie with ${beat}.` : `${beat} to beat; ${beat - result.score} to go.`}
        </p>
      )}
      {plank ? (
        <p className="mt-2 text-sm text-[var(--muted)]">
          {result.breaks > 0
            ? `You dropped out of position ${result.breaks} ${result.breaks === 1 ? "time" : "times"} for less than ${PLANK.GRACE_MS / 1000} s; those moments are not counted.`
            : "Held without dropping out of position."}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Pace by 5-second slice: <span className="text-base">{paceSquares(result.buckets)}</span> ({result.buckets.join(" · ")})
          {result.rejected > 0
            ? `. ${result.rejected} cycle${result.rejected === 1 ? " was" : "s were"} faster than ${EXERCISES[result.exercise as RepId].minCycleMs} ms and not counted.`
            : "."}
        </p>
      )}
      <ShareCard
        filename={`rep-challenge-${result.exercise}-${result.date}.png`}
        text={shareText}
        spec={{
          eyebrow: plank ? "Plank challenge" : `${CHALLENGE_SECONDS}-second rep challenge`,
          headline: text,
          lines: [
            plank
              ? "Plank held, timed by a pose model in my browser"
              : `${label} in ${CHALLENGE_SECONDS} seconds, counted by a pose model in my browser`,
            plank ? `Can you beat it? ${linkNoScheme}` : `Pace ${result.buckets.join(" · ")}`,
          ],
          url: linkNoScheme,
          stamp: result.date,
        }}
        intents={{ place: "challenge", url: link }}
      />
      <p className="mt-2 text-xs text-[var(--muted)]">
        The link carries the exercise and your score, so whoever opens it sees the number to beat. Nothing else is in
        it, and nothing about your attempt is stored anywhere.
      </p>
    </div>
  );
}
