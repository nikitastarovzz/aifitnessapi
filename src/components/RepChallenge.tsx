"use client";

import { useEffect, useRef, useState } from "react";
import ShareCard from "@/components/ShareCard";
import { localDate } from "@/lib/shareCard";
import { BENCH_MODELS, TASKS_VISION_BUNDLE, TASKS_VISION_VERSION, TASKS_VISION_WASM, mib } from "@/lib/poseBenchmark";
import {
  CHALLENGE_SECONDS,
  COUNTDOWN_SECONDS,
  EXERCISES,
  SKELETON,
  VISIBILITY_MIN,
  bucketReps,
  createCounter,
  describeZone,
  exerciseAngle,
  paceSquares,
  shareLine,
  step,
} from "@/lib/repCounter.mjs";

/**
 * The 30-second webcam rep challenge.
 *
 * The camera feed goes from the <video> element into MediaPipe Pose
 * Landmarker (lite) running in WebAssembly in this tab; each frame's
 * landmarks become one angle (src/lib/repCounter.mjs), and the rep state
 * machine in that module counts. No frame is recorded, stored or sent: the
 * network traffic is the download of the runtime from cdn.jsdelivr.net and of
 * the model from storage.googleapis.com, the same files and URLs
 * /tools/pose-benchmark loads (src/lib/poseBenchmark.ts), plus the runtime's
 * own usage report to Google (TASKS_VISION_USAGE_LOG_URL there: timings, no
 * images).
 */

type ExerciseId = keyof typeof EXERCISES;
type Stage = "idle" | "loading" | "ready" | "countdown" | "running" | "done";
type Counter = ReturnType<typeof createCounter>;

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

type Result = { exercise: ExerciseId; reps: number; buckets: number[]; rejected: number; date: string };

export default function RepChallenge() {
  const [exerciseId, setExerciseId] = useState<ExerciseId>("squat");
  const [stage, setStage] = useState<Stage>("idle");
  const [status, setStatus] = useState("");
  const [angle, setAngle] = useState<number | null>(null);
  const [phase, setPhase] = useState<Counter["phase"]>("waiting");
  const [reps, setReps] = useState(0);
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
  const exRef = useRef<ExerciseId>("squat");
  const counterRef = useRef<Counter>(createCounter(EXERCISES.squat));
  const tRef = useRef({ countdownEnd: 0, start: 0, end: 0 });
  const loopingRef = useRef(false);
  const fpsRef = useRef({ since: 0, frames: 0 });

  const ex = EXERCISES[exerciseId];

  function go(s: Stage) {
    stageRef.current = s;
    setStage(s);
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      lmRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function pick(id: ExerciseId) {
    setExerciseId(id);
    exRef.current = id;
    counterRef.current = createCounter(EXERCISES[id]);
    setPhase("waiting");
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
    setStatus("Step back until your whole body is in the frame, then press Go.");
    counterRef.current = createCounter(EXERCISES[exRef.current]);
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
    setClock(null);
    go("idle");
  }

  function countdown() {
    tRef.current.countdownEnd = performance.now() + COUNTDOWN_SECONDS * 1000;
    setResult(null);
    setReps(0);
    go("countdown");
    resume();
  }

  function finish(c: Counter) {
    const { start } = tRef.current;
    setResult({
      exercise: exRef.current,
      reps: c.reps,
      buckets: bucketReps(c.repTimes, start),
      rejected: c.rejected,
      date: localDate(),
    });
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
      const exercise = EXERCISES[exRef.current];
      const lms = res?.landmarks[0];
      const world = res?.worldLandmarks?.[0];
      const a = lms ? exerciseAngle(exercise, lms, world, v.videoWidth / (v.videoHeight || 1)) : null;
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
          setReps(0);
          go("running");
        } else {
          // Practice the phases during the countdown; the count resets at Go.
          counterRef.current = step(counterRef.current, a, now);
        }
      } else if (s === "running") {
        counterRef.current = step(counterRef.current, a, now);
        setReps(counterRef.current.reps);
        const left = tRef.current.end - now;
        setClock(Math.max(0, Math.ceil(left / 1000)));
        if (left <= 0) finish(counterRef.current);
      } else {
        counterRef.current = step(counterRef.current, a, now);
      }
      setPhase(counterRef.current.phase);
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
  const phaseName =
    phase === "waiting" ? `waiting for ${ex.restName}` : phase === "rest" ? ex.restName : ex.activeName;
  const camOn = stage !== "idle" && stage !== "loading";
  const resEx = result ? EXERCISES[result.exercise] : ex;

  return (
    <div className={`mt-8 ${box}`}>
      <fieldset disabled={busy}>
        <legend className="text-sm font-semibold text-[var(--fg)]">Exercise</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(EXERCISES) as ExerciseId[]).map((id) => (
            <label key={id} className={chip}>
              <input type="radio" name="challenge-exercise" checked={exerciseId === id} onChange={() => pick(id)} />
              {EXERCISES[id].label}
            </label>
          ))}
        </div>
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
            {ex.angleName}: {angle === null ? "no reading" : `${Math.round(angle)}°`}
          </div>
          <div>phase: {phaseName}</div>
          <div data-challenge-fps>{fps === null ? "" : `${fps.toFixed(0)} frames/s`}</div>
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-2 text-right text-white">
          <div className="text-xs uppercase tracking-wider">reps</div>
          <div data-challenge-reps className="text-3xl font-bold tabular-nums">
            {stage === "running" || stage === "done" ? reps : "–"}
          </div>
        </div>
        {(stage === "countdown" || stage === "running") && clock !== null && (
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
          Counting {ex.plural}: a rep is {ex.angleName} {describeZone(ex.active)} and back {describeZone(ex.rest)}.
          Model: {LITE.name}, {delegate || "…"} delegate, in this tab.
        </p>
      )}

      {result && (
        <div data-challenge-result className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Your result</p>
          <p className="mt-2 text-4xl font-extrabold text-[var(--fg)]">
            {result.reps} {result.reps === 1 ? resEx.noun : resEx.plural}{" "}
            <span className="text-lg font-medium text-[var(--muted)]">in {CHALLENGE_SECONDS} seconds</span>
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Pace by 5-second slice: <span className="text-base">{paceSquares(result.buckets)}</span> ({result.buckets.join(" · ")})
            {result.rejected > 0
              ? `. ${result.rejected} cycle${result.rejected === 1 ? " was" : "s were"} faster than ${resEx.minCycleMs} ms and not counted.`
              : "."}
          </p>
          <ShareCard
            filename={`rep-challenge-${result.exercise}-${result.date}.png`}
            text={shareLine({ exercise: resEx, reps: result.reps, buckets: result.buckets })}
            spec={{
              eyebrow: `${CHALLENGE_SECONDS}-second rep challenge`,
              headline: `${result.reps} ${result.reps === 1 ? resEx.noun : resEx.plural}`,
              lines: [
                `${resEx.label} in ${CHALLENGE_SECONDS} seconds, counted by a pose model in my browser`,
                `Pace ${result.buckets.join(" · ")}`,
              ],
              url: "aifitnessapi.com/challenge",
              stamp: result.date,
            }}
          />
        </div>
      )}
    </div>
  );
}
