"use client";

import { useEffect, useRef, useState } from "react";
import ShareCard from "@/components/ShareCard";
import { localDate } from "@/lib/shareCard";
import {
  BENCH_MODELS,
  TASKS_VISION_BUNDLE,
  TASKS_VISION_VERSION,
  TASKS_VISION_WASM,
  mib,
  type BenchModel,
} from "@/lib/poseBenchmark";

/**
 * The in-browser pose benchmark.
 *
 * Nothing about this component is a claim. It loads Google's published
 * Pose Landmarker runtime and model files at the moment the reader presses
 * Run, times them on the reader's own device, and prints what it measured.
 * There are no reference numbers in the code to compare against, and that is
 * deliberate: the only honest latency figure for a pose model is the one taken
 * on the hardware it will run on.
 *
 * No frame leaves the tab. Frames go from the camera (or a canvas the page
 * draws itself) straight into the WebAssembly runtime; the network traffic
 * is the download of the runtime from cdn.jsdelivr.net and of the model file
 * from storage.googleapis.com, the same requests any app using the library
 * makes, plus the runtime's own usage report to Google
 * (TASKS_VISION_USAGE_LOG_URL in src/lib/poseBenchmark.ts: timings, no images).
 *
 * The runtime is imported from the CDN at run time, not bundled: the site
 * adds no npm dependency for it and a reader who never presses Run downloads
 * none of it.
 */

type Delegate = "GPU" | "CPU";
type Source = "camera" | "synthetic";

type Row = {
  model: string;
  delegate: Delegate;
  status: "ok" | "error";
  error?: string;
  loadMs?: number;
  frames?: number;
  medianMs?: number;
  p95Ms?: number;
  meanMs?: number;
  minMs?: number;
  loopFps?: number;
  poseFrames?: number;
};

type Device = {
  userAgent: string;
  platform: string;
  cores: string;
  memory: string;
  gpu: string;
  webgl2: string;
  webgpu: string;
  pixelRatio: string;
};

/* The subset of @mediapipe/tasks-vision this page calls. Typed by hand from
 * the package's vision.d.ts so the site does not depend on the package. */
type PoseResult = { landmarks: unknown[][] };
type Landmarker = {
  detectForVideo(frame: HTMLVideoElement | HTMLCanvasElement, timestamp: number): PoseResult;
  close(): void;
};
type VisionModule = {
  FilesetResolver: { forVisionTasks(basePath: string): Promise<unknown> };
  PoseLandmarker: {
    createFromOptions(
      fileset: unknown,
      options: {
        baseOptions: { modelAssetPath: string; delegate: Delegate };
        runningMode: "VIDEO";
        numPoses: number;
      },
    ): Promise<Landmarker>;
  };
};

const WARMUP_FRAMES = 10;
const FRAME_CHOICES = [50, 100, 300];
const SYNTH_W = 640;
const SYNTH_H = 480;

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

const ms = (n: number | undefined) => (n === undefined || Number.isNaN(n) ? "—" : n.toFixed(1));
const fps = (n: number | undefined) => (n === undefined || Number.isNaN(n) ? "—" : n.toFixed(1));

function readDevice(): Device {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    gpu?: unknown;
    userAgentData?: { platform?: string; mobile?: boolean };
  };
  let gpu = "not reported";
  let webgl2 = "no";
  try {
    const c = document.createElement("canvas");
    const gl2 = c.getContext("webgl2");
    webgl2 = gl2 ? "yes" : "no";
    const gl = (gl2 ?? c.getContext("webgl")) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      if (typeof r === "string" && r) gpu = r;
    }
  } catch {
    /* a browser that hides the renderer reports "not reported" */
  }
  const platform = nav.userAgentData?.platform
    ? `${nav.userAgentData.platform}${nav.userAgentData.mobile ? " (mobile)" : ""}`
    : "not reported";
  return {
    userAgent: navigator.userAgent,
    platform,
    cores: navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : "not reported",
    memory: nav.deviceMemory ? `${nav.deviceMemory} GB (browser-rounded)` : "not reported",
    gpu,
    webgl2,
    webgpu: "gpu" in nav && nav.gpu ? "exposed" : "not exposed",
    pixelRatio: String(window.devicePixelRatio ?? 1),
  };
}

/** A moving test pattern for readers without a camera. It is not a photo of a
 *  person, so the model may find no pose in it; it still runs the full
 *  inference path, which is what the timing measures. */
function drawSynthetic(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = "#e9edf2";
  ctx.fillRect(0, 0, SYNTH_W, SYNTH_H);
  const cx = SYNTH_W / 2 + Math.sin(t / 700) * 40;
  const swing = Math.sin(t / 300) * 0.6;
  ctx.strokeStyle = "#334155";
  ctx.lineCap = "round";
  ctx.lineWidth = 18;
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.arc(cx, 110, 34, 0, Math.PI * 2);
  ctx.fill();
  const seg = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  seg(cx, 150, cx, 290); // torso
  seg(cx, 170, cx - 80 * Math.cos(swing), 170 + 80 * Math.sin(swing)); // arms
  seg(cx, 170, cx + 80 * Math.cos(swing), 170 + 80 * Math.sin(swing));
  seg(cx, 290, cx - 45, 420); // legs
  seg(cx, 290, cx + 45, 420);
}

function toMarkdown(rows: Row[], device: Device | null, input: string, when: string): string {
  const lines = [
    `Pose Landmarker benchmark — ${when}`,
    "",
    `- Runtime: @mediapipe/tasks-vision ${TASKS_VISION_VERSION} (WebAssembly), VIDEO running mode, numPoses 1`,
    `- Input: ${input}`,
  ];
  if (device) {
    lines.push(
      `- Browser: ${device.userAgent}`,
      `- Platform: ${device.platform}; logical cores: ${device.cores}; memory: ${device.memory}`,
      `- GPU (WebGL renderer): ${device.gpu}; WebGL2: ${device.webgl2}; WebGPU: ${device.webgpu}`,
    );
  }
  lines.push(
    "",
    "| Model | Delegate | Load (ms) | Median (ms) | p95 (ms) | Mean (ms) | 1000/mean (fps) | Loop (fps) | Frames | Pose found |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  );
  for (const r of rows) {
    if (r.status === "error") {
      lines.push(`| ${r.model} | ${r.delegate} | failed: ${r.error ?? "unknown error"} | | | | | | | |`);
    } else {
      lines.push(
        `| ${r.model} | ${r.delegate} | ${ms(r.loadMs)} | ${ms(r.medianMs)} | ${ms(r.p95Ms)} | ${ms(r.meanMs)} | ${fps(r.meanMs ? 1000 / r.meanMs : undefined)} | ${fps(r.loopFps)} | ${r.frames} | ${r.poseFrames} |`,
      );
    }
  }
  lines.push("", "Measured in the browser with https://aifitnessapi.com/tools/pose-benchmark — one device, one run; not a reference figure.");
  return lines.join("\n");
}

/** The row a share card leads with: the fastest median among lite runs, or
 *  among any model if lite was not run or failed. */
function headlineRow(rows: Row[]): Row | undefined {
  const ok = rows.filter((r) => r.status === "ok" && r.medianMs !== undefined && !Number.isNaN(r.medianMs));
  const lite = ok.filter((r) => r.model === BENCH_MODELS[0].name);
  const pool = lite.length ? lite : ok;
  return [...pool].sort((a, b) => (a.medianMs ?? 0) - (b.medianMs ?? 0))[0];
}

export default function PoseBenchmark() {
  const [device, setDevice] = useState<Device | null>(null);
  const [source, setSource] = useState<Source>("camera");
  const [models, setModels] = useState<Record<BenchModel["id"], boolean>>({ lite: true, full: true, heavy: false });
  const [delegates, setDelegates] = useState<Record<Delegate, boolean>>({ GPU: true, CPU: true });
  const [frames, setFrames] = useState(100);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [input, setInput] = useState("");
  const [when, setWhen] = useState("");
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopRef = useRef(false);
  const visionRef = useRef<{ mod: VisionModule; fileset: unknown } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Read in an effect, not during render: the server has no navigator, and a
  // value that differs between server and client would break hydration.
  useEffect(() => {
    setDevice(readDevice());
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  async function loadRuntime(): Promise<{ mod: VisionModule; fileset: unknown }> {
    if (visionRef.current) return visionRef.current;
    const url = TASKS_VISION_BUNDLE;
    // A runtime URL, so neither bundler tries to resolve or inline it.
    const mod = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)) as VisionModule;
    const fileset = await mod.FilesetResolver.forVisionTasks(TASKS_VISION_WASM);
    visionRef.current = { mod, fileset };
    return visionRef.current;
  }

  async function openSource(): Promise<{ el: HTMLVideoElement | HTMLCanvasElement; label: string }> {
    const canvas = canvasRef.current!;
    if (source === "camera" && navigator.mediaDevices?.getUserMedia) {
      try {
        if (!streamRef.current) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          });
        }
        const video = videoRef.current!;
        video.srcObject = streamRef.current;
        await video.play();
        if (video.readyState < 2) {
          await new Promise<void>((res) => video.addEventListener("loadeddata", () => res(), { once: true }));
        }
        return { el: video, label: `camera, ${video.videoWidth}×${video.videoHeight}` };
      } catch (e) {
        setStatus(`Camera unavailable (${(e as Error).message || "permission denied"}), using the synthetic frame instead.`);
      }
    }
    canvas.width = SYNTH_W;
    canvas.height = SYNTH_H;
    return { el: canvas, label: `synthetic test frame, ${SYNTH_W}×${SYNTH_H} (not a person; pose may not be found)` };
  }

  async function benchOne(
    vision: { mod: VisionModule; fileset: unknown },
    model: BenchModel,
    delegate: Delegate,
    el: HTMLVideoElement | HTMLCanvasElement,
  ): Promise<Row> {
    const base = { model: model.name, delegate };
    let lm: Landmarker | null = null;
    const t0 = performance.now();
    try {
      lm = await vision.mod.PoseLandmarker.createFromOptions(vision.fileset, {
        baseOptions: { modelAssetPath: model.url, delegate },
        runningMode: "VIDEO",
        numPoses: 1,
      });
    } catch (e) {
      return { ...base, status: "error", error: String((e as Error)?.message ?? e).slice(0, 140) };
    }
    const loadMs = performance.now() - t0;
    const ctx = el instanceof HTMLCanvasElement ? el.getContext("2d") : null;
    const times: number[] = [];
    let poseFrames = 0;
    let lastTs = 0;
    let loopStart = 0;
    const total = WARMUP_FRAMES + frames;
    try {
      for (let i = 0; i < total && !stopRef.current; i++) {
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        if (ctx) drawSynthetic(ctx, performance.now());
        // VIDEO mode needs strictly increasing timestamps.
        const ts = Math.max(lastTs + 1, Math.round(performance.now()));
        lastTs = ts;
        if (i === WARMUP_FRAMES) loopStart = performance.now();
        const s = performance.now();
        const res = lm.detectForVideo(el, ts);
        const d = performance.now() - s;
        if (i >= WARMUP_FRAMES) {
          times.push(d);
          if (res.landmarks.length > 0) poseFrames++;
        }
        if (i % 10 === 0) setStatus(`${model.name} · ${delegate}: frame ${i + 1} of ${total}`);
      }
    } catch (e) {
      lm.close();
      return { ...base, status: "error", loadMs, error: String((e as Error)?.message ?? e).slice(0, 140) };
    }
    const loopMs = performance.now() - loopStart;
    lm.close();
    const sorted = [...times].sort((a, b) => a - b);
    const mean = times.reduce((a, b) => a + b, 0) / (times.length || 1);
    return {
      ...base,
      status: "ok",
      loadMs,
      frames: times.length,
      medianMs: quantile(sorted, 0.5),
      p95Ms: quantile(sorted, 0.95),
      meanMs: mean,
      minMs: sorted[0],
      loopFps: times.length > 1 ? (times.length / loopMs) * 1000 : undefined,
      poseFrames,
    };
  }

  async function run() {
    stopRef.current = false;
    setRunning(true);
    setRows([]);
    setCopied(false);
    setWhen(new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC");
    try {
      const { el, label } = await openSource();
      setInput(label);
      setStatus(`Loading the MediaPipe runtime (${TASKS_VISION_VERSION}) from cdn.jsdelivr.net…`);
      let vision: { mod: VisionModule; fileset: unknown };
      try {
        vision = await loadRuntime();
      } catch (e) {
        setStatus(`Could not load the MediaPipe runtime: ${(e as Error).message}. A blocker or a network policy may be stopping cdn.jsdelivr.net.`);
        return;
      }
      const picked = BENCH_MODELS.filter((m) => models[m.id]);
      const dels = (["GPU", "CPU"] as Delegate[]).filter((d) => delegates[d]);
      const out: Row[] = [];
      for (const m of picked) {
        for (const d of dels) {
          if (stopRef.current) break;
          setStatus(`Loading ${m.name} (${mib(m.bytes)}) with the ${d} delegate…`);
          const row = await benchOne(vision, m, d, el);
          out.push(row);
          setRows([...out]);
        }
      }
      setStatus(stopRef.current ? "Stopped." : "Done. Results are below; no frame was sent anywhere.");
    } finally {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setRunning(false);
    }
  }

  async function copy() {
    const md = toMarkdown(rows, device, input, when);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
    } catch {
      // Clipboard refused (permissions, insecure context): select the text instead.
      const ta = document.getElementById("pose-bench-md") as HTMLTextAreaElement | null;
      ta?.select();
    }
  }

  // Rows exist only after a run in the browser, so reading the clock here
  // cannot differ between server and client renders.
  const top = headlineRow(rows);
  const share = top ? { ...top, date: localDate() } : null;
  const nothingPicked =!Object.values(models).some(Boolean) || !Object.values(delegates).some(Boolean);
  const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";
  const chip = "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)]";

  return (
    <div className={`mt-8 ${box}`}>
      <fieldset disabled={running}>
        <legend className="text-sm font-semibold text-[var(--fg)]">Input</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["camera", "My camera"],
              ["synthetic", "Synthetic test frame (no camera)"],
            ] as [Source, string][]
          ).map(([v, label]) => (
            <label key={v} className={chip}>
              <input type="radio" name="pose-bench-source" checked={source === v} onChange={() => setSource(v)} />
              {label}
            </label>
          ))}
        </div>

        <p className="mt-5 text-sm font-semibold text-[var(--fg)]">Models</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BENCH_MODELS.map((m) => (
            <label key={m.id} className={chip}>
              <input
                type="checkbox"
                checked={models[m.id]}
                onChange={(e) => setModels({ ...models, [m.id]: e.target.checked })}
              />
              {m.id} <span className="text-xs text-[var(--muted)]">{mib(m.bytes)}</span>
            </label>
          ))}
        </div>

        <p className="mt-5 text-sm font-semibold text-[var(--fg)]">Delegate</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["GPU", "CPU"] as Delegate[]).map((d) => (
            <label key={d} className={chip}>
              <input
                type="checkbox"
                checked={delegates[d]}
                onChange={(e) => setDelegates({ ...delegates, [d]: e.target.checked })}
              />
              {d}
            </label>
          ))}
          <label className={chip}>
            Frames
            <select
              value={frames}
              onChange={(e) => setFrames(Number(e.target.value))}
              className="rounded border border-[var(--border)] bg-[var(--bg)] px-1 text-sm"
            >
              {FRAME_CHOICES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={running || nothingPicked}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
        >
          {running ? "Running…" : "Run benchmark"}
        </button>
        {running && (
          <button
            type="button"
            onClick={() => (stopRef.current = true)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400"
          >
            Stop
          </button>
        )}
        <p role="status" aria-live="polite" data-bench-status className="text-sm text-[var(--muted)]">
          {status}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <video
          ref={videoRef}
          muted
          playsInline
          className={`w-full rounded-lg bg-black ${source === "camera" && running ? "" : "hidden"}`}
        />
        <canvas
          ref={canvasRef}
          width={SYNTH_W}
          height={SYNTH_H}
          className={`w-full rounded-lg ${source === "synthetic" || (running && input.startsWith("synthetic")) ? "" : "hidden"}`}
        />
      </div>

      {rows.length > 0 && (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table data-bench-results className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-3">Model</th>
                  <th className="py-2 pr-3">Delegate</th>
                  <th className="py-2 pr-3 text-right">Load ms</th>
                  <th className="py-2 pr-3 text-right">Median ms</th>
                  <th className="py-2 pr-3 text-right">p95 ms</th>
                  <th className="py-2 pr-3 text-right">1000/mean fps</th>
                  <th className="py-2 pr-3 text-right">Loop fps</th>
                  <th className="py-2 text-right">Pose found</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.model}-${r.delegate}`} className="border-t border-[var(--border)] text-[var(--fg)]">
                    <td className="py-2 pr-3">{r.model}</td>
                    <td className="py-2 pr-3">{r.delegate}</td>
                    {r.status === "error" ? (
                      <td colSpan={6} className="py-2 text-[var(--muted)]">
                        Failed: {r.error}
                      </td>
                    ) : (
                      <>
                        <td className="py-2 pr-3 text-right font-mono">{ms(r.loadMs)}</td>
                        <td data-median className="py-2 pr-3 text-right font-mono">{ms(r.medianMs)}</td>
                        <td className="py-2 pr-3 text-right font-mono">{ms(r.p95Ms)}</td>
                        <td className="py-2 pr-3 text-right font-mono">{fps(r.meanMs ? 1000 / r.meanMs : undefined)}</td>
                        <td className="py-2 pr-3 text-right font-mono">{fps(r.loopFps)}</td>
                        <td className="py-2 text-right font-mono">
                          {r.poseFrames}/{r.frames}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {copied ? "Copied" : "Copy as markdown"}
            </button>
            <span className="text-xs text-[var(--muted)]">Input: {input}</span>
          </div>
          <textarea
            id="pose-bench-md"
            readOnly
            value={toMarkdown(rows, device, input, when)}
            aria-label="Results as markdown"
            className="mt-3 h-40 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--fg)]"
          />
          {!running && share && (
            <ShareCard
              filename={`pose-benchmark-${share.date}.png`}
              text={`⚡ ${share.model} runs at ${ms(share.medianMs)} ms per frame on my device (median of ${share.frames}, ${share.delegate} delegate) aifitnessapi.com/tools/pose-benchmark`}
              spec={{
                eyebrow: `${share.model} on my device`,
                headline: `${ms(share.medianMs)} ms per frame`,
                lines: [
                  `Median of ${share.frames} frames, ${share.delegate} delegate, p95 ${ms(share.p95Ms)} ms`,
                  `@mediapipe/tasks-vision ${TASKS_VISION_VERSION} in the browser · one device, one run`,
                ],
                url: "aifitnessapi.com/tools/pose-benchmark",
                stamp: share.date,
              }}
            />
          )}
        </div>
      )}

      <dl className="mt-6 grid gap-x-4 gap-y-1 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)] sm:grid-cols-[max-content_1fr]">
        <dt className="font-semibold text-[var(--fg)]">This device, as the browser reports it</dt>
        <dd />
        {device ? (
          <>
            <dt>GPU (WebGL renderer)</dt>
            <dd className="font-mono">{device.gpu}</dd>
            <dt>WebGL2 / WebGPU</dt>
            <dd className="font-mono">
              {device.webgl2} / {device.webgpu}
            </dd>
            <dt>Logical cores</dt>
            <dd className="font-mono">{device.cores}</dd>
            <dt>Memory</dt>
            <dd className="font-mono">{device.memory}</dd>
            <dt>Platform</dt>
            <dd className="font-mono">{device.platform}</dd>
            <dt>Pixel ratio</dt>
            <dd className="font-mono">{device.pixelRatio}</dd>
            <dt>User agent</dt>
            <dd className="break-all font-mono">{device.userAgent}</dd>
          </>
        ) : (
          <dd>Reading…</dd>
        )}
      </dl>
    </div>
  );
}
