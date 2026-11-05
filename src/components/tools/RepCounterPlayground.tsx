"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BENCH_MODELS, TASKS_VISION_BUNDLE, TASKS_VISION_VERSION, TASKS_VISION_WASM, mib } from "@/lib/poseBenchmark";
import { SKELETON } from "@/lib/repCounter.mjs";
import {
  DEFAULT_CONFIG,
  JOINTS,
  JOINT_IDS,
  SIDES,
  configFromPreset,
  configJson,
  countTrace,
  frameAngles,
  parseConfig,
  sideAngle,
  syntheticFrames,
  validateConfig,
} from "@/lib/repPlayground.mjs";
import { FORM_RULES, FORM_RULE_PRESETS, FORM_RULE_SOURCES } from "@/data/formRules";

/**
 * The rep-counting playground.
 *
 * A local video file (or the webcam) goes into MediaPipe Pose Landmarker
 * running in WebAssembly in this tab. Each frame's landmarks become every
 * joint angle the page can trace (src/lib/repPlayground.mjs, frameAngles),
 * kept in memory, and the counter from /challenge (src/lib/repCounter.mjs)
 * recounts that whole recording whenever a threshold moves, so tuning never
 * reruns the model. Nothing is uploaded: the file is read with an object URL
 * and never leaves the tab; the network traffic is the runtime from
 * cdn.jsdelivr.net and the model from storage.googleapis.com, the same files
 * /tools/pose-benchmark loads, plus the runtime's own usage report to Google
 * (TASKS_VISION_USAGE_LOG_URL in src/lib/poseBenchmark.ts: timings, no images).
 */

type JointId = "knee" | "hip" | "elbow" | "shoulder";
type Side = "left" | "right" | "either" | "best";
type Config = {
  $schema: string;
  joint: JointId;
  side: Side;
  coordinates: "image" | "world";
  startAt: "high" | "low";
  top: number;
  bottom: number;
  minFrames: number;
  minCycleMs: number;
  smoothingMs: number;
  visibilityMin: number;
  source: null | { preset: string; topRule: string; bottomRule: string; dataset: string };
};
type Angles = ReturnType<typeof frameAngles>;
type Frame = { t: number; angles: Angles | null };
type Trace = {
  reps: number;
  rejected: number;
  missing: number;
  phase: string;
  events: { t: number; kind: "rep" | "rejected"; n: number }[];
  series: { t: number; raw: number | null; smoothed: number | null; phase: string }[];
};
type Checked = { ok: true; config: Config; defaulted: string[] } | { ok: false; errors: string[] };

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
type Source = "video" | "camera" | "demo";
type Stage = "idle" | "loading" | "running" | "done";

const MODELS = BENCH_MODELS.filter((m) => m.id !== "heavy");
const COLORS: Record<JointId, string> = {
  knee: "var(--rcp-knee)",
  hip: "var(--rcp-hip)",
  elbow: "var(--rcp-elbow)",
  shoulder: "var(--rcp-shoulder)",
};
const W = 720;
const H = 260;
const PAD = { l: 34, r: 64, t: 18, b: 24 };

const presetLabel = (id: string) => {
  const p = FORM_RULE_PRESETS.find((x) => x.id === id);
  if (!p) return id;
  const s = FORM_RULE_SOURCES.find((x) => x.id === p.sourceId);
  return `${p.exerciseName}: ${p.joint} ${p.top}° / ${p.bottom}° (${s?.name ?? p.sourceId})`;
};

function fmtTime(ms: number) {
  const s = ms / 1000;
  return s < 60 ? `${s.toFixed(1)} s` : `${Math.floor(s / 60)}:${(s % 60).toFixed(0).padStart(2, "0")}`;
}

/** Segments of a series, broken where the angle is missing. */
function segments(points: { x: number; y: number | null }[]) {
  const out: string[] = [];
  let cur: string[] = [];
  for (const p of points) {
    if (p.y === null) {
      if (cur.length > 1) out.push(cur.join(" "));
      cur = [];
    } else cur.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  if (cur.length > 1) out.push(cur.join(" "));
  return out;
}

function TraceChart({ frames, config, trace, show }: { frames: Frame[]; config: Config; trace: Trace; show: Record<JointId, boolean> }) {
  const [hover, setHover] = useState<number | null>(null);
  const tMax = Math.max(1000, frames.length ? frames[frames.length - 1].t : 0);
  const x = (t: number) => PAD.l + (t / tMax) * (W - PAD.l - PAD.r);
  const y = (a: number) => PAD.t + (1 - a / 180) * (H - PAD.t - PAD.b);
  const stride = Math.max(1, Math.ceil(frames.length / 1500));
  const idx = frames.map((_, i) => i).filter((i) => i % stride === 0 || i === frames.length - 1);
  const others = JOINT_IDS.filter((j) => j !== config.joint && show[j]) as JointId[];
  const lastY = (vals: (number | null)[]) => {
    for (let i = vals.length - 1; i >= 0; i--) if (vals[i] !== null) return vals[i];
    return null;
  };

  const otherSeries = others.map((j) => {
    const c = { ...config, joint: j };
    const vals = idx.map((i) => (frames[i].angles ? (sideAngle(frames[i].angles, c) as number | null) : null));
    return { j, vals };
  });
  const counted = idx.map((i) => trace.series[i]?.smoothed ?? null);
  const raw = idx.map((i) => trace.series[i]?.raw ?? null);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!frames.length) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const t = ((px - PAD.l) / (W - PAD.l - PAD.r)) * tMax;
    let lo = 0;
    let hi = frames.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (frames[mid].t < t) lo = mid + 1;
      else hi = mid;
    }
    setHover(Math.max(0, Math.min(frames.length - 1, lo)));
  }

  const h = hover !== null ? frames[hover] : null;
  const label = (a: number | null) => (a === null ? "no reading" : `${Math.round(a)}°`);
  const repEvents = trace.events.filter((e) => e.kind === "rep");
  const labelEvery = repEvents.length > 24 ? 5 : 1;

  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-lg border border-[var(--border)] bg-[var(--bg)]"
        role="img"
        aria-label={`${JOINTS[config.joint].label} angle over time with the top and bottom thresholds and ${trace.reps} counted reps`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        data-rep-chart
      >
        {[0, 45, 90, 135, 180].map((a) => (
          <g key={a}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(a)} y2={y(a)} stroke="var(--border)" strokeWidth={1} />
            <text x={PAD.l - 6} y={y(a) + 3} textAnchor="end" fontSize={10} fill="var(--muted)">
              {a}°
            </text>
          </g>
        ))}
        <text x={PAD.l} y={H - 6} fontSize={10} fill="var(--muted)">
          0 s
        </text>
        <text x={W - PAD.r} y={H - 6} fontSize={10} fill="var(--muted)" textAnchor="end">
          {fmtTime(tMax)}
        </text>
        {/* Thresholds */}
        {(
          [
            ["top", config.top],
            ["bottom", config.bottom],
          ] as const
        ).map(([name, a]) => (
          <g key={name}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(a)} y2={y(a)} stroke="var(--fg)" strokeDasharray="5 4" strokeWidth={1} opacity={0.6} />
            <text x={W - PAD.r + 4} y={y(a) + 3} fontSize={10} fill="var(--fg)">
              {name} {a}°
            </text>
          </g>
        ))}
        {/* Rep and rejected markers */}
        {trace.events.map((e, i) => (
          <g key={i}>
            <line
              x1={x(e.t)}
              x2={x(e.t)}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke={e.kind === "rep" ? "var(--fg)" : "var(--muted)"}
              strokeWidth={1}
              strokeDasharray={e.kind === "rep" ? undefined : "2 3"}
              opacity={e.kind === "rep" ? 0.35 : 0.6}
            />
            {e.kind === "rep" && e.n % labelEvery === 0 ? (
              <text x={x(e.t)} y={PAD.t - 5} fontSize={10} textAnchor="middle" fill="var(--fg)">
                {e.n}
              </text>
            ) : null}
          </g>
        ))}
        {otherSeries.map(({ j, vals }) =>
          segments(idx.map((i, k) => ({ x: x(frames[i].t), y: vals[k] === null ? null : y(vals[k] as number) }))).map((pts, k) => (
            <polyline key={`${j}-${k}`} points={pts} fill="none" stroke={COLORS[j]} strokeWidth={1.5} opacity={0.75} />
          )),
        )}
        {segments(idx.map((i, k) => ({ x: x(frames[i].t), y: raw[k] === null ? null : y(raw[k] as number) }))).map((pts, k) => (
          <polyline key={`raw-${k}`} points={pts} fill="none" stroke={COLORS[config.joint]} strokeWidth={1} opacity={0.3} />
        ))}
        {segments(idx.map((i, k) => ({ x: x(frames[i].t), y: counted[k] === null ? null : y(counted[k] as number) }))).map((pts, k) => (
          <polyline key={`c-${k}`} points={pts} fill="none" stroke={COLORS[config.joint]} strokeWidth={2} />
        ))}
        {/* Direct labels at the end of each line */}
        {[{ j: config.joint, v: lastY(counted) }, ...otherSeries.map((s) => ({ j: s.j, v: lastY(s.vals) }))].map(({ j, v }) =>
          v === null ? null : (
            <text key={`lbl-${j}`} x={W - PAD.r + 4} y={y(v) + 14} fontSize={10} fill="var(--muted)">
              {JOINTS[j].label.toLowerCase()}
            </text>
          ),
        )}
        {h ? (
          <line x1={x(h.t)} x2={x(h.t)} y1={PAD.t} y2={H - PAD.b} stroke="var(--fg)" strokeWidth={1} opacity={0.8} />
        ) : null}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)]" aria-live="polite">
        {[config.joint, ...others].map((j) => (
          <span key={j} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ background: COLORS[j as JointId], height: j === config.joint ? 3 : 2 }} />
            {JOINTS[j as JointId].label}
            {j === config.joint ? " (counted, smoothed; faint line is unsmoothed)" : ""}
          </span>
        ))}
        <span>dashed: thresholds · solid ticks: counted reps · dotted ticks: cycles rejected as too fast</span>
        {h ? (
          <span data-rep-hover className="font-mono text-[var(--fg)]">
            {fmtTime(h.t)}: {[config.joint, ...others].map((j) => `${j} ${label(h.angles ? (sideAngle(h.angles, { ...config, joint: j }) as number | null) : null)}`).join(" · ")}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
}) {
  return (
    <label className="block text-sm text-[var(--fg)]">
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-xs text-[var(--muted)]">
          {value}
          {unit}
        </span>
      </span>
      <span className="mt-1 flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand-600" />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 font-mono text-xs"
        />
      </span>
      {hint ? <span className="mt-0.5 block text-xs text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

export default function RepCounterPlayground() {
  const [source, setSource] = useState<Source>("video");
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG as Config);
  const [configNote, setConfigNote] = useState("");
  const [frames, setFrames] = useState<Frame[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [status, setStatus] = useState("");
  const [modelId, setModelId] = useState<"lite" | "full">("lite");
  const [rate, setRate] = useState(1);
  const [fileName, setFileName] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [delegate, setDelegate] = useState("");
  const [show, setShow] = useState<Record<JointId, boolean>>({ knee: true, hip: false, elbow: false, shoulder: false });
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [presetId, setPresetId] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const visionRef = useRef<{ mod: VisionModule; fileset: unknown } | null>(null);
  const lmRef = useRef<{ id: string; lm: Landmarker } | null>(null);
  const framesRef = useRef<Frame[]>([]);
  const tsRef = useRef(0);
  const baseRef = useRef(0);
  const stopRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef(0);
  const flushRef = useRef(0);
  const camStartRef = useRef(0);
  const configRef = useRef(config);
  configRef.current = config;

  const trace = useMemo(() => countTrace(config, frames) as Trace, [config, frames]);

  function apply(next: Partial<Config>) {
    // A change to what the rule measures or its thresholds detaches the
    // config from the dataset row it was loaded from; timing changes do not.
    const touchesRule = ["joint", "side", "startAt", "top", "bottom", "coordinates"].some((k) => k in next);
    const merged = { ...config, ...next, source: touchesRule ? null : config.source };
    const checked = validateConfig(merged) as Checked;
    if (!checked.ok) {
      setConfigNote(`Not applied: ${checked.errors.join("; ")}`);
      return;
    }
    setConfig(checked.config);
    if (touchesRule && config.source) {
      setPresetId("");
      setConfigNote("Edited by hand: the rule is no longer the dataset's.");
    }
  }

  function loadPreset(id: string) {
    setPresetId(id);
    const p = FORM_RULE_PRESETS.find((x) => x.id === id);
    if (!p) return;
    const { config: c } = configFromPreset(p) as { config: Config; fromSource: string[]; ours: string[] };
    setConfig(c);
    setShow((s) => ({ ...s, [c.joint]: true }));
    const src = FORM_RULE_SOURCES.find((s) => s.id === p.sourceId);
    const extra = p.others.length ? ` The source also requires ${p.others.map((r) => FORM_RULES.find((x) => x.id === r)?.meaning.split(":")[0].toLowerCase() ?? r).join(", ")}, which this single-angle counter does not apply.` : "";
    setConfigNote(
      `Loaded from ${src?.name ?? p.sourceId} (${src?.license ?? "license unknown"}): joint, side and the ${p.top}° / ${p.bottom}° thresholds are the source's; frames, cycle time and smoothing are this page's defaults.${extra}`,
    );
  }

  // ?preset=<id> from /tools/exercise-form-rules. Read after mount: the
  // static page has no query string at build time.
  useEffect(() => {
    try {
      const id = new URLSearchParams(window.location.search).get("preset");
      if (id && FORM_RULE_PRESETS.some((p) => p.id === id)) loadPreset(id);
    } catch {
      /* no query string support: start from the defaults */
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      lmRef.current?.lm.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(f));
    setFileName(`${f.name} (${(f.size / 1048576).toFixed(1)} MiB, read in this tab only)`);
    setFrames([]);
    framesRef.current = [];
    setStage("idle");
    setStatus("");
  }

  async function ensureLandmarker(): Promise<Landmarker | null> {
    const model = MODELS.find((m) => m.id === modelId)!;
    if (lmRef.current?.id === model.id) return lmRef.current.lm;
    lmRef.current?.lm.close();
    lmRef.current = null;
    try {
      if (!visionRef.current) {
        setStatus(`Loading the MediaPipe runtime (${TASKS_VISION_VERSION}) from cdn.jsdelivr.net…`);
        const url = TASKS_VISION_BUNDLE;
        const mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)) as VisionModule;
        visionRef.current = { mod, fileset: await mod.FilesetResolver.forVisionTasks(TASKS_VISION_WASM) };
      }
    } catch (e) {
      setStatus(`Could not load the MediaPipe runtime: ${(e as Error).message}. A blocker or network policy may be stopping cdn.jsdelivr.net.`);
      return null;
    }
    setStatus(`Loading ${model.name} (${mib(model.bytes)}) from storage.googleapis.com…`);
    for (const d of ["GPU", "CPU"] as const) {
      try {
        const lm = await visionRef.current.mod.PoseLandmarker.createFromOptions(visionRef.current.fileset, {
          baseOptions: { modelAssetPath: model.url, delegate: d },
          runningMode: "VIDEO",
          numPoses: 1,
        });
        lmRef.current = { id: model.id, lm };
        setDelegate(d);
        return lm;
      } catch {
        /* try the next delegate */
      }
    }
    setStatus("The pose model could not start in this browser with either the GPU or the CPU delegate.");
    return null;
  }

  function draw(lms: Lm[] | undefined) {
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
    const cfg = configRef.current;
    const hot = [...JOINTS[cfg.joint].left, ...JOINTS[cfg.joint].right];
    const P = (i: number) => [lms[i].x * c.width, lms[i].y * c.height] as const;
    const seen = (i: number) => (lms[i]?.visibility ?? 1) >= cfg.visibilityMin;
    ctx.lineWidth = Math.max(2, c.width / 220);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    for (const [a, b] of SKELETON) {
      if (!seen(a) || !seen(b)) continue;
      ctx.beginPath();
      ctx.moveTo(...P(a));
      ctx.lineTo(...P(b));
      ctx.stroke();
    }
    for (const i of new Set(SKELETON.flat())) {
      if (!seen(i)) continue;
      ctx.fillStyle = hot.includes(i) ? "#10b981" : "#ffffff";
      ctx.beginPath();
      ctx.arc(...P(i), hot.includes(i) ? ctx.lineWidth * 2 : ctx.lineWidth * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /** Run the model on the video element's current frame, recorded at tMs. */
  function processFrame(lm: Landmarker, v: HTMLVideoElement, tMs: number) {
    const ts = Math.max(tsRef.current + 1, Math.round(baseRef.current + tMs));
    tsRef.current = ts;
    let res: PoseResult | null = null;
    try {
      res = lm.detectForVideo(v, ts);
    } catch {
      res = null;
    }
    const lms = res?.landmarks[0];
    const world = res?.worldLandmarks?.[0];
    framesRef.current.push({ t: Math.round(tMs), angles: lms ? frameAngles(lms, world, v.videoWidth / (v.videoHeight || 1)) : null });
    draw(lms);
    const now = performance.now();
    if (now - flushRef.current > 250) {
      flushRef.current = now;
      setFrames([...framesRef.current]);
    }
  }

  function finish(msg: string) {
    cancelAnimationFrame(rafRef.current);
    setFrames([...framesRef.current]);
    setStage("done");
    setStatus(msg);
  }

  async function analyzeVideo() {
    const v = videoRef.current;
    if (!v || !videoUrl) return;
    stopRef.current = false;
    setStage("loading");
    const lm = await ensureLandmarker();
    if (!lm) {
      setStage("idle");
      return;
    }
    framesRef.current = [];
    setFrames([]);
    baseRef.current = tsRef.current + 1;
    v.srcObject = null;
    if (v.src !== videoUrl) v.src = videoUrl;
    v.muted = true;
    if (v.readyState < 1) await new Promise<void>((r) => v.addEventListener("loadedmetadata", () => r(), { once: true }));
    v.currentTime = 0;
    v.playbackRate = rate;
    setStage("running");
    setStatus(`Analyzing at ${rate}× speed with ${MODELS.find((m) => m.id === modelId)!.name}. The video stays in this tab.`);
    const done = () => finish(`Done: ${framesRef.current.length} frames analyzed. Move the thresholds to recount; the model does not run again.`);
    v.onended = done;
    const rvfc = (v as HTMLVideoElement & { requestVideoFrameCallback?: (cb: (now: number, meta: { mediaTime: number }) => void) => number }).requestVideoFrameCallback;
    try {
      await v.play();
    } catch (e) {
      setStatus(`This browser could not play the file: ${(e as Error).message}. Try an MP4 (H.264) or WebM file.`);
      setStage("idle");
      return;
    }
    if (rvfc) {
      const cb = (_now: number, meta: { mediaTime: number }) => {
        if (stopRef.current) {
          v.pause();
          return finish("Stopped. The frames analyzed so far are kept.");
        }
        processFrame(lm, v, meta.mediaTime * 1000);
        if (!v.ended) rvfc.call(v, cb);
      };
      rvfc.call(v, cb);
    } else {
      let last = -1;
      const loop = () => {
        if (stopRef.current) {
          v.pause();
          return finish("Stopped. The frames analyzed so far are kept.");
        }
        if (v.currentTime !== last && v.readyState >= 2) {
          last = v.currentTime;
          processFrame(lm, v, v.currentTime * 1000);
        }
        if (!v.ended) rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }
  }

  async function startCamera() {
    stopRef.current = false;
    setStage("loading");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("this browser has no camera API");
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
    } catch (e) {
      setStatus(`No camera: ${(e as Error).message || "permission denied"}. A video file works without one.`);
      setStage("idle");
      return;
    }
    const lm = await ensureLandmarker();
    const v = videoRef.current;
    if (!lm || !v) {
      stopCamera();
      setStage("idle");
      return;
    }
    v.removeAttribute("src");
    v.srcObject = streamRef.current;
    v.muted = true;
    await v.play();
    framesRef.current = [];
    setFrames([]);
    baseRef.current = tsRef.current + 1;
    camStartRef.current = performance.now();
    setStage("running");
    setStatus("Recording angles from the camera. Frames are not stored or sent; only the angles are kept, in this tab.");
    const loop = () => {
      if (stopRef.current) {
        stopCamera();
        return finish("Camera off. The angles recorded are kept; move the thresholds to recount.");
      }
      if (v.readyState >= 2) processFrame(lm, v, performance.now() - camStartRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function runDemo() {
    const f = syntheticFrames(config.joint, 6) as Frame[];
    framesRef.current = f;
    setFrames(f);
    setStage("done");
    setStatus(`Synthetic demo: six generated ${config.joint} cycles with noise and a short dropout, not a recording of a person. No model was loaded.`);
  }

  async function copyConfig() {
    try {
      await navigator.clipboard.writeText(configJson(config));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      (document.getElementById("rcp-config") as HTMLTextAreaElement | null)?.select();
    }
  }

  function download(name: string, text: string, type: string) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function traceCsv() {
    const head = ["t_ms", ...JOINT_IDS.flatMap((j) => [`${j}_left`, `${j}_right`]), "counted_smoothed", "phase"];
    const lines = frames.map((f, i) => {
      const a = f.angles?.[config.coordinates === "world" && f.angles?.world ? "world" : "image"];
      const cells = JOINT_IDS.flatMap((j) => (a ? a[j].map((v) => (v === null ? "" : String(v))) : ["", ""]));
      const s = trace.series[i];
      return [f.t, ...cells, s?.smoothed === null || s?.smoothed === undefined ? "" : s.smoothed.toFixed(1), s?.phase ?? ""].join(",");
    });
    return [head.join(","), ...lines].join("\n") + "\n";
  }

  function importConfig() {
    const r = parseConfig(importText) as Checked;
    if (!r.ok) {
      setImportMsg(`Not loaded: ${r.errors.join("; ")}`);
      return;
    }
    setConfig(r.config);
    setPresetId("");
    setImportMsg(r.defaulted.length ? `Loaded. Not in the JSON, so left at the defaults: ${r.defaulted.filter((k) => k !== "source").join(", ") || "none"}.` : "Loaded.");
  }

  const busy = stage === "loading" || stage === "running";
  const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";
  const chip = "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)]";
  const primary = "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
  const secondary = "rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400 disabled:opacity-50";
  const high = config.startAt === "high";
  const videoVisible = (source === "video" && videoUrl) || (source === "camera" && busy);

  return (
    <div className={`rcp-root mt-8 ${box}`}>
      <style>{`
        .rcp-root { --rcp-knee:#2a78d6; --rcp-hip:#eb6834; --rcp-elbow:#1baf7a; --rcp-shoulder:#eda100; }
        @media (prefers-color-scheme: dark) { .rcp-root { --rcp-knee:#3987e5; --rcp-hip:#d95926; --rcp-elbow:#199e70; --rcp-shoulder:#c98500; } }
      `}</style>

      <fieldset disabled={busy}>
        <legend className="text-sm font-semibold text-[var(--fg)]">Input</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["video", "A video file"],
              ["camera", "My camera"],
              ["demo", "Synthetic demo (no model)"],
            ] as [Source, string][]
          ).map(([v, label]) => (
            <label key={v} className={chip}>
              <input type="radio" name="rcp-source" checked={source === v} onChange={() => setSource(v)} />
              {label}
            </label>
          ))}
        </div>
        {source === "video" && (
          <div className="mt-3">
            <input
              type="file"
              accept="video/*"
              data-rcp-file
              onChange={(e) => pickFile(e.target.files?.[0])}
              className="block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-md file:border file:border-[var(--border)] file:bg-[var(--bg)] file:px-3 file:py-1.5 file:text-sm file:text-[var(--fg)]"
            />
            {fileName ? <p className="mt-1 text-xs text-[var(--muted)]">{fileName}</p> : null}
          </div>
        )}
        {source !== "demo" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {MODELS.map((m) => (
              <label key={m.id} className={chip}>
                <input type="radio" name="rcp-model" checked={modelId === m.id} onChange={() => setModelId(m.id as "lite" | "full")} />
                {m.name} <span className="text-xs text-[var(--muted)]">{mib(m.bytes)}</span>
              </label>
            ))}
            {source === "video" && (
              <label className={chip}>
                Speed
                <select value={rate} onChange={(e) => setRate(Number(e.target.value))} className="rounded border border-[var(--border)] bg-[var(--bg)] px-1 text-sm">
                  {[0.25, 0.5, 1].map((r) => (
                    <option key={r} value={r}>
                      {r}×
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {source === "video" && (
          <button type="button" className={primary} onClick={analyzeVideo} disabled={busy || !videoUrl} data-rcp-analyze>
            {stage === "loading" ? "Loading…" : stage === "running" ? "Analyzing…" : "Analyze video"}
          </button>
        )}
        {source === "camera" && (
          <button type="button" className={primary} onClick={startCamera} disabled={busy}>
            {stage === "loading" ? "Starting…" : "Start camera"}
          </button>
        )}
        {source === "demo" && (
          <button type="button" className={primary} onClick={runDemo} data-rcp-demo>
            Load synthetic demo
          </button>
        )}
        {busy && (
          <button type="button" className={secondary} onClick={() => (stopRef.current = true)}>
            Stop
          </button>
        )}
        <p role="status" aria-live="polite" data-rcp-status className="text-sm text-[var(--muted)]">
          {status}
        </p>
      </div>
      {source === "video" && !videoUrl ? (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Pick a clip of one person doing one exercise, filmed from the side or at an angle with the whole body in frame. The file is
          read in this tab and is never uploaded.
        </p>
      ) : null}

      <div className={`relative mt-4 overflow-hidden rounded-xl bg-black ${videoVisible ? "" : "hidden"}`}>
        <div className={`relative ${source === "camera" ? "-scale-x-100" : ""}`}>
          <video ref={videoRef} muted playsInline controls={source === "video" && !busy} className="block h-auto max-h-[60vh] w-full" src={source === "video" && videoUrl ? videoUrl : undefined} />
          <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-2 text-right text-white">
          <div className="text-xs uppercase tracking-wider">reps</div>
          <div className="text-3xl font-bold tabular-nums">{trace.reps}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Reps counted</p>
          <p data-rcp-count className="font-mono text-5xl font-bold text-[var(--fg)]">
            {trace.reps}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {frames.length} frames · {trace.rejected} cycle{trace.rejected === 1 ? "" : "s"} rejected as faster than {config.minCycleMs} ms ·{" "}
            {trace.missing} frame{trace.missing === 1 ? "" : "s"} with no reading{delegate && source !== "demo" ? ` · ${delegate} delegate` : ""}
          </p>
        </div>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Joints to trace</legend>
          {JOINT_IDS.map((j) => (
            <label key={j} className={chip}>
              <input type="checkbox" checked={show[j as JointId] || config.joint === j} disabled={config.joint === j} onChange={(e) => setShow({ ...show, [j]: e.target.checked })} />
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[j as JointId] }} />
              {JOINTS[j as JointId].label}
            </label>
          ))}
        </fieldset>
      </div>

      <TraceChart frames={frames} config={config} trace={trace} show={show} />
      {frames.length === 0 ? (
        <p className="mt-2 text-xs text-[var(--muted)]">The trace appears here as frames are analyzed. No reading yet.</p>
      ) : null}

      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-sm font-semibold text-[var(--fg)]">Counter settings</p>
        <label className="mt-3 block text-sm text-[var(--fg)]">
          <span className="font-medium">Start from a rule in the form-rules dataset</span>
          <select
            value={presetId}
            onChange={(e) => loadPreset(e.target.value)}
            data-rcp-preset
            className="mt-1 block w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm"
          >
            <option value="">Defaults (this page&rsquo;s own uncalibrated values)</option>
            {FORM_RULE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {presetLabel(p.id)}
              </option>
            ))}
          </select>
        </label>
        {configNote ? (
          <p data-rcp-note className="mt-2 text-xs text-[var(--muted)]">
            {configNote}
          </p>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-[var(--fg)]">
            <span className="font-medium">Joint</span>
            <select value={config.joint} onChange={(e) => apply({ joint: e.target.value as JointId })} className="mt-1 block w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm">
              {JOINT_IDS.map((j) => (
                <option key={j} value={j}>
                  {JOINTS[j as JointId].label} ({JOINTS[j as JointId].points})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-[var(--fg)]">
            <span className="font-medium">Side</span>
            <select value={config.side} onChange={(e) => apply({ side: e.target.value as Side })} className="mt-1 block w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm">
              {Object.entries(SIDES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-[var(--fg)]">
            <span className="font-medium">A rep starts and ends</span>
            <select value={config.startAt} onChange={(e) => apply({ startAt: e.target.value as "high" | "low" })} className="mt-1 block w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm">
              <option value="high">With the joint open, above the top (squat, push-up, curl)</option>
              <option value="low">With the joint closed, below the bottom (a press from the shoulders)</option>
            </select>
          </label>
          <label className="block text-sm text-[var(--fg)]">
            <span className="font-medium">Angles measured on</span>
            <select value={config.coordinates} onChange={(e) => apply({ coordinates: e.target.value as "image" | "world" })} className="mt-1 block w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm">
              <option value="image">The image, in 2D (as the dataset&rsquo;s sources do)</option>
              <option value="world">The model&rsquo;s 3D world landmarks</option>
            </select>
          </label>
          <Num label="Top" unit="°" value={config.top} min={1} max={180} onChange={(v) => apply({ top: v })} hint={high ? "The rep ends when the angle is back above this." : "The angle must pass this at the top of the rep."} />
          <Num label="Bottom" unit="°" value={config.bottom} min={0} max={179} onChange={(v) => apply({ bottom: v })} hint={high ? "The angle must pass below this at the bottom of the rep." : "The rep ends when the angle is back below this."} />
          <Num label="Minimum frames in a zone" value={config.minFrames} min={1} max={30} onChange={(v) => apply({ minFrames: Math.round(v) })} hint="Consecutive frames the angle must stay past a threshold before the phase changes." />
          <Num label="Minimum cycle time" unit=" ms" value={config.minCycleMs} min={0} max={5000} step={50} onChange={(v) => apply({ minCycleMs: v })} hint="A cycle faster than this is rejected, not counted." />
          <Num label="Smoothing time constant" unit=" ms" value={config.smoothingMs} min={0} max={500} step={10} onChange={(v) => apply({ smoothingMs: v })} hint="Exponential moving average; 0 turns it off." />
          <Num label="Minimum landmark visibility" value={config.visibilityMin} min={0} max={1} step={0.05} onChange={(v) => apply({ visibilityMin: v })} hint="A side is read only when all three of its points are at least this visible." />
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Gap between the thresholds: {config.top - config.bottom}°. That gap is the hysteresis: jitter inside it cannot complete a rep.
        </p>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <p className="text-sm font-semibold text-[var(--fg)]">Export</p>
        <textarea
          id="rcp-config"
          readOnly
          value={configJson(config)}
          aria-label="Counter config as JSON"
          data-rcp-config
          className="mt-2 h-56 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--fg)]"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className={secondary} onClick={copyConfig}>
            {copied ? "Copied" : "Copy config JSON"}
          </button>
          <button type="button" className={secondary} onClick={() => download("rep-counter-config.json", configJson(config), "application/json")}>
            Download config
          </button>
          <button type="button" className={secondary} disabled={frames.length === 0} onClick={() => download("rep-counter-angles.csv", traceCsv(), "text/csv")}>
            Download angle trace (CSV)
          </button>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-[var(--muted)]">Load a config from JSON</summary>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            aria-label="Paste a config JSON"
            className="mt-2 h-32 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--fg)]"
          />
          <button type="button" className={`${secondary} mt-2`} onClick={importConfig}>
            Load config
          </button>
          {importMsg ? <p className="mt-2 text-xs text-[var(--muted)]">{importMsg}</p> : null}
        </details>
      </div>
    </div>
  );
}
