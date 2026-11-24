"use client";

import { useEffect, useRef, useState } from "react";
import { localDate } from "@/lib/shareCard";
import { BENCH_MODELS, MOVENET_MODELS, TFJS_BACKEND, mib } from "@/lib/poseBenchmark";
import {
  loadTf,
  loadVision,
  type Delegate,
  type Landmarker,
  type MnKeypoint,
  type MpLandmark,
  type PoseDetector,
} from "@/lib/poseRuntime";
import {
  ARENA_H,
  ARENA_W,
  CAPTION_H,
  DRAW_SCORE_MIN,
  FRAME_H,
  FRAME_W,
  PANEL_H,
  PANEL_W,
  RECORD_MS,
  captionLines,
  createMeter,
  fitContain,
  fpsLabel,
  pickRecorderType,
  recordingName,
} from "@/lib/poseArena.mjs";

/**
 * The pose arena: MediaPipe Pose Landmarker and MoveNet on the same frames,
 * side by side, with each model's own keypoints and a live rate.
 *
 * Every frame of the reader's camera or local video is drawn once into one
 * 640×480 canvas, and that same canvas is handed to both models, so they see
 * identical pixels. Model loading is the benchmark's (src/lib/poseRuntime.ts,
 * URLs and versions in src/lib/poseBenchmark.ts). The two load in parallel
 * and each panel joins when its model is ready; a model that cannot load
 * (MoveNet's weights are on tfhub.dev, which blockers and some networks
 * refuse) says so in its own panel while the other keeps running.
 *
 * "Record 5 seconds" captures the arena canvas with MediaRecorder into a
 * local file the reader downloads. The caption with the model names, rates
 * and this page's address is drawn on the canvas itself, so it is in every
 * frame of the recording. Nothing is uploaded.
 */

type Source = "camera" | "file";
type ModelState = { state: "off" | "loading" | "ready" | "error"; message: string };
type Bones = { mediapipe: [number, number][]; movenet: [number, number][] };

const MP_COLOR = "#38bdf8";
const MN_COLOR = "#f97316";

function drawPoints(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number; s: number }[],
  bones: [number, number][],
  color: string,
) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.85;
  for (const [a, b] of bones) {
    const p = pts[a];
    const q = pts[b];
    if (!p || !q || p.s < DRAW_SCORE_MIN || q.s < DRAW_SCORE_MIN) continue;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  for (const p of pts) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    if (p.s >= DRAW_SCORE_MIN) {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }
}

function panelMessage(ctx: CanvasRenderingContext2D, x: number, text: string) {
  ctx.fillStyle = "rgba(15,23,42,0.78)";
  ctx.fillRect(x + 16, PANEL_H / 2 - 40, PANEL_W - 32, 80);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  // Wrap to the panel width.
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > PANEL_W - 56 && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 4);
  shown.forEach((l, i) => ctx.fillText(l, x + PANEL_W / 2, PANEL_H / 2 - (shown.length - 1) * 9 + i * 18 + 5));
  ctx.textAlign = "left";
}

export default function PoseArena({ bones }: { bones: Bones }) {
  const [source, setSource] = useState<Source>("camera");
  const [mpId, setMpId] = useState<(typeof BENCH_MODELS)[number]["id"]>("lite");
  const [mnId, setMnId] = useState<(typeof MOVENET_MODELS)[number]["id"]>("lightning");
  const [delegate, setDelegate] = useState<Delegate>("GPU");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [mp, setMp] = useState<ModelState>({ state: "off", message: "" });
  const [mn, setMn] = useState<ModelState>({ state: "off", message: "" });
  const [recording, setRecording] = useState(false);
  const [clip, setClip] = useState<{ url: string; name: string; bytes: number } | null>(null);
  const [recordNote, setRecordNote] = useState("");
  const [fileName, setFileName] = useState("");

  const arenaRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileUrlRef = useRef<string | null>(null);
  const stopRef = useRef(true);
  // Incremented by every Start; a model that finishes loading after its run
  // was stopped (or replaced) is closed instead of joining the next run.
  const runRef = useRef(0);
  const lmRef = useRef<Landmarker | null>(null);
  const detRef = useRef<PoseDetector | null>(null);
  // Mirrors of the two states for the render loop, which outlives a render.
  const mpStateRef = useRef<ModelState>(mp);
  const mnStateRef = useRef<ModelState>(mn);
  const metersRef = useRef({ mp: createMeter(), mn: createMeter() });

  const mpModel = BENCH_MODELS.find((m) => m.id === mpId)!;
  const mnModel = MOVENET_MODELS.find((m) => m.id === mnId)!;
  const names = useRef({ mp: mpModel.name, mn: mnModel.name });
  names.current = { mp: mpModel.name, mn: mnModel.name };

  const setMpState = (s: ModelState) => {
    mpStateRef.current = s;
    setMp(s);
  };
  const setMnState = (s: ModelState) => {
    mnStateRef.current = s;
    setMn(s);
  };

  function release() {
    stopRef.current = true;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.srcObject = null;
      v.removeAttribute("src");
    }
    lmRef.current?.close();
    lmRef.current = null;
    detRef.current?.dispose();
    detRef.current = null;
  }

  useEffect(
    () => () => {
      release();
      if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
    },
    [],
  );

  // Idle arena: the empty panels and the caption, redrawn when a model changes.
  useEffect(() => {
    if (!running) drawArena(null, [], []);
  });

  useEffect(() => () => {
    if (clip) URL.revokeObjectURL(clip.url);
  }, [clip]);

  function drawArena(
    frame: HTMLCanvasElement | null,
    mpPts: { x: number; y: number; s: number }[],
    mnPts: { x: number; y: number; s: number }[],
  ) {
    const canvas = arenaRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, ARENA_W, ARENA_H);
    const sx = PANEL_W / FRAME_W;
    const sy = PANEL_H / FRAME_H;
    const panels = [
      { x: 0, pts: mpPts, bones: bones.mediapipe, color: MP_COLOR, st: mpStateRef.current, meter: metersRef.current.mp, name: names.current.mp },
      { x: PANEL_W, pts: mnPts, bones: bones.movenet, color: MN_COLOR, st: mnStateRef.current, meter: metersRef.current.mn, name: names.current.mn },
    ];
    for (const p of panels) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(p.x, 0, PANEL_W, PANEL_H);
      ctx.clip();
      if (frame) ctx.drawImage(frame, p.x, 0, PANEL_W, PANEL_H);
      ctx.translate(p.x, 0);
      drawPoints(
        ctx,
        p.pts.map((q) => ({ x: q.x * sx, y: q.y * sy, s: q.s })),
        p.bones,
        p.color,
      );
      ctx.restore();
      // Header: model name and its rate.
      ctx.fillStyle = "rgba(15,23,42,0.72)";
      ctx.fillRect(p.x, 0, PANEL_W, 28);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + 10, 9, 10, 10);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.fillText(p.name, p.x + 28, 19);
      const right =
        p.st.state === "ready"
          ? `${Number.isFinite(p.meter.meanMs) ? p.meter.meanMs.toFixed(1) : "—"} ms · ${fpsLabel(p.meter.fps)}`
          : p.st.state === "loading"
            ? "loading…"
            : p.st.state === "error"
              ? "failed"
              : "";
      ctx.font = "13px ui-monospace, monospace";
      ctx.textAlign = "right";
      ctx.fillText(right, p.x + PANEL_W - 10, 19);
      ctx.textAlign = "left";
      if (p.st.state === "error") panelMessage(ctx, p.x, p.st.message);
      else if (!frame) panelMessage(ctx, p.x, running ? "Waiting for the first frame…" : "Press Start to open your camera or a video file.");
    }
    // Divider and caption.
    ctx.fillStyle = "#334155";
    ctx.fillRect(PANEL_W - 1, 0, 2, PANEL_H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, PANEL_H, ARENA_W, CAPTION_H);
    const [l1, l2] = captionLines(
      { name: names.current.mp, fps: metersRef.current.mp.fps, state: mpStateRef.current.state },
      { name: names.current.mn, fps: metersRef.current.mn.fps, state: mnStateRef.current.state },
    );
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 14px system-ui, sans-serif";
    ctx.fillText(l1, 12, PANEL_H + 22);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(l2, 12, PANEL_H + 43);
  }

  async function openSource(): Promise<HTMLVideoElement> {
    const video = videoRef.current!;
    if (source === "camera") {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("this browser offers no camera API on this page");
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      video.srcObject = streamRef.current;
    } else {
      const f = fileRef.current?.files?.[0];
      if (!f) throw new Error("choose a video file first");
      if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
      fileUrlRef.current = URL.createObjectURL(f);
      video.srcObject = null;
      video.src = fileUrlRef.current;
      video.loop = true;
    }
    video.muted = true;
    await video.play();
    if (video.readyState < 2) {
      await new Promise<void>((res) => video.addEventListener("loadeddata", () => res(), { once: true }));
    }
    return video;
  }

  const stale = (run: number) => run !== runRef.current || stopRef.current;

  async function loadMediaPipe(run: number) {
    setMpState({ state: "loading", message: "" });
    try {
      const vision = await loadVision();
      const lm = await vision.mod.PoseLandmarker.createFromOptions(vision.fileset, {
        baseOptions: { modelAssetPath: mpModel.url, delegate },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      if (stale(run)) {
        lm.close();
        return;
      }
      lmRef.current = lm;
      setMpState({ state: "ready", message: "" });
    } catch (e) {
      setMpState({
        state: "error",
        message: `${mpModel.name} could not load (${String((e as Error)?.message ?? e).slice(0, 120)}). A blocker or a network policy may be stopping cdn.jsdelivr.net or storage.googleapis.com.`,
      });
    }
  }

  async function loadMoveNet(run: number) {
    setMnState({ state: "loading", message: "" });
    const backend = TFJS_BACKEND[delegate];
    let lib;
    try {
      lib = await loadTf(delegate === "CPU");
    } catch (e) {
      setMnState({
        state: "error",
        message: `TensorFlow.js could not load (${String((e as Error)?.message ?? e).slice(0, 100)}). A blocker or a network policy may be stopping cdn.jsdelivr.net.`,
      });
      return;
    }
    try {
      const ok = await lib.tf.setBackend(backend);
      await lib.tf.ready();
      if (!ok || lib.tf.getBackend() !== backend) throw new Error(`TF.js could not start its ${backend} backend`);
    } catch (e) {
      setMnState({ state: "error", message: `${String((e as Error)?.message ?? e).slice(0, 140)} in this browser.` });
      return;
    }
    try {
      const det = await lib.pd.createDetector(lib.pd.SupportedModels.MoveNet, {
        modelType: mnModel.modelType,
        modelUrl: mnModel.url,
      });
      if (stale(run)) {
        det.dispose();
        return;
      }
      detRef.current = det;
      setMnState({ state: "ready", message: "" });
    } catch (e) {
      setMnState({
        state: "error",
        message: `${mnModel.name} could not download its weights from ${new URL(mnModel.url).host} (${String((e as Error)?.message ?? e).slice(0, 90)}). A blocker or a network policy may be stopping that host. MediaPipe keeps running.`,
      });
    }
  }

  async function start() {
    const run = ++runRef.current;
    stopRef.current = false;
    setRunning(true);
    setClip(null);
    setRecordNote("");
    metersRef.current.mp.reset();
    metersRef.current.mn.reset();
    setStatus(source === "camera" ? "Asking for your camera…" : "Opening the video file…");
    let video: HTMLVideoElement;
    try {
      video = await openSource();
    } catch (e) {
      setStatus(`Could not open the ${source === "camera" ? "camera" : "video"}: ${(e as Error).message || "permission denied"}.`);
      release();
      setRunning(false);
      return;
    }
    if (!frameRef.current) {
      frameRef.current = document.createElement("canvas");
      frameRef.current.width = FRAME_W;
      frameRef.current.height = FRAME_H;
    }
    const frame = frameRef.current;
    const fctx = frame.getContext("2d", { willReadFrequently: false })!;
    setStatus("Loading both models; each panel starts when its model is ready.");
    // Both load at once; neither waits for the other.
    void Promise.allSettled([loadMediaPipe(run), loadMoveNet(run)]).then(() => {
      if (!stale(run)) setStatus("Running. Frames stay in this tab.");
    });

    let lastTs = 0;
    let mpPts: { x: number; y: number; s: number }[] = [];
    let mnPts: { x: number; y: number; s: number }[] = [];
    const loop = async () => {
      if (stale(run)) return;
      const box = fitContain(video.videoWidth, video.videoHeight, FRAME_W, FRAME_H);
      fctx.fillStyle = "#000";
      fctx.fillRect(0, 0, FRAME_W, FRAME_H);
      fctx.drawImage(video, box.x, box.y, box.w, box.h);
      const ts = Math.max(lastTs + 1, Math.round(performance.now()));
      lastTs = ts;
      const lm = lmRef.current;
      if (lm) {
        try {
          const t0 = performance.now();
          const res = lm.detectForVideo(frame, ts);
          metersRef.current.mp.push(performance.now() - t0);
          const first: MpLandmark[] = res.landmarks[0] ?? [];
          mpPts = first.map((p) => ({ x: p.x * FRAME_W, y: p.y * FRAME_H, s: p.visibility ?? 1 }));
        } catch (e) {
          lmRef.current = null;
          setMpState({ state: "error", message: `${names.current.mp} stopped: ${String((e as Error)?.message ?? e).slice(0, 120)}` });
        }
      }
      const det = detRef.current;
      if (det) {
        try {
          const t0 = performance.now();
          const poses = await det.estimatePoses(frame, undefined, ts);
          metersRef.current.mn.push(performance.now() - t0);
          const kps: MnKeypoint[] = poses[0]?.keypoints ?? [];
          mnPts = kps.map((k) => ({ x: k.x, y: k.y, s: k.score ?? 1 }));
        } catch (e) {
          detRef.current = null;
          setMnState({ state: "error", message: `${names.current.mn} stopped: ${String((e as Error)?.message ?? e).slice(0, 120)}` });
        }
      }
      drawArena(frame, mpPts, mnPts);
      requestAnimationFrame(() => void loop());
    };
    requestAnimationFrame(() => void loop());
  }

  function stop() {
    release();
    setRunning(false);
    setStatus("Stopped. The camera is off.");
  }

  function record() {
    const canvas = arenaRef.current;
    if (!canvas || typeof MediaRecorder === "undefined" || !("captureStream" in canvas)) {
      setRecordNote("This browser cannot record a canvas, so there is nothing to download.");
      return;
    }
    const type = pickRecorderType((t) => MediaRecorder.isTypeSupported(t));
    if (!type) {
      setRecordNote("This browser supports none of the WebM or MP4 recording formats.");
      return;
    }
    const stream = canvas.captureStream(30);
    let rec: MediaRecorder;
    try {
      rec = new MediaRecorder(stream, { mimeType: type.mimeType });
    } catch (e) {
      setRecordNote(`Recording could not start: ${(e as Error).message}`);
      return;
    }
    const chunks: Blob[] = [];
    rec.ondataavailable = (ev) => {
      if (ev.data.size) chunks.push(ev.data);
    };
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: type.mimeType.split(";")[0] });
      setRecording(false);
      if (!blob.size) {
        setRecordNote("The recording came back empty.");
        return;
      }
      setClip({ url: URL.createObjectURL(blob), name: recordingName(localDate(), type.ext), bytes: blob.size });
      setRecordNote("");
    };
    setClip(null);
    setRecording(true);
    rec.start(250);
    window.setTimeout(() => rec.state !== "inactive" && rec.stop(), RECORD_MS);
  }

  const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";
  const chip = "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)]";
  const btn = "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
  const btn2 = "rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400 disabled:opacity-50";
  const sel = "rounded border border-[var(--border)] bg-[var(--bg)] px-1 text-sm";
  const anyReady = mp.state === "ready" || mn.state === "ready";

  return (
    <div className={`mt-6 ${box}`}>
      <fieldset disabled={running} className="flex flex-wrap gap-2">
        <legend className="mb-2 text-sm font-semibold text-[var(--fg)]">Input and models</legend>
        <label className={chip}>
          <input type="radio" name="pose-arena-source" checked={source === "camera"} onChange={() => setSource("camera")} />
          My camera
        </label>
        <label className={chip}>
          <input type="radio" name="pose-arena-source" checked={source === "file"} onChange={() => setSource("file")} />
          A video file
        </label>
        {source === "file" && (
          <label className={chip}>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              data-arena-file
              className="max-w-[12rem] text-xs"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        )}
        <label className={chip}>
          <span style={{ color: MP_COLOR }}>●</span> MediaPipe
          <select value={mpId} onChange={(e) => setMpId(e.target.value as typeof mpId)} className={sel} aria-label="MediaPipe model">
            {BENCH_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} ({mib(m.bytes)})
              </option>
            ))}
          </select>
        </label>
        <label className={chip}>
          <span style={{ color: MN_COLOR }}>●</span> MoveNet
          <select value={mnId} onChange={(e) => setMnId(e.target.value as typeof mnId)} className={sel} aria-label="MoveNet model">
            {MOVENET_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} ({m.input}×{m.input})
              </option>
            ))}
          </select>
        </label>
        <label className={chip}>
          Delegate
          <select value={delegate} onChange={(e) => setDelegate(e.target.value as Delegate)} className={sel} aria-label="Delegate">
            <option value="GPU">GPU (MoveNet: webgl)</option>
            <option value="CPU">CPU (MoveNet: wasm)</option>
          </select>
        </label>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!running ? (
          <button type="button" onClick={start} disabled={source === "file" && !fileName} data-arena-start className={btn}>
            Start
          </button>
        ) : (
          <button type="button" onClick={stop} className={btn2}>
            Stop
          </button>
        )}
        <button type="button" onClick={record} disabled={!running || recording || !anyReady} data-arena-record className={btn2}>
          {recording ? "Recording…" : "Record 5 seconds"}
        </button>
        <p role="status" aria-live="polite" data-arena-status className="text-sm text-[var(--muted)]">
          {status}
        </p>
      </div>

      <canvas
        ref={arenaRef}
        width={ARENA_W}
        height={ARENA_H}
        data-arena-canvas
        aria-label="MediaPipe keypoints on the left, MoveNet keypoints on the right, on the same frame"
        className="mt-4 h-auto w-full rounded-lg"
      />
      <video ref={videoRef} muted playsInline className="hidden" />

      <ul className="mt-3 space-y-1 text-xs text-[var(--muted)]" data-arena-models>
        <li data-arena-mp={mp.state}>
          <span style={{ color: MP_COLOR }}>●</span> {mpModel.name}: {mp.state === "off" ? "not loaded" : mp.state}
          {mp.state === "error" ? `: ${mp.message}` : ""}
        </li>
        <li data-arena-mn={mn.state}>
          <span style={{ color: MN_COLOR }}>●</span> {mnModel.name}: {mn.state === "off" ? "not loaded" : mn.state}
          {mn.state === "error" ? `: ${mn.message}` : ""}
        </li>
      </ul>

      {(clip || recordNote) && (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 text-sm">
          {clip ? (
            <>
              <a
                href={clip.url}
                download={clip.name}
                data-cta="pose-arena-download"
                data-cta-source="pose-arena"
                data-arena-download
                className="inline-block rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500"
              >
                Download {clip.name} ({(clip.bytes / 1048576).toFixed(1)} MiB)
              </a>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Made in this tab from the arena canvas; it has not been uploaded anywhere. The caption with both model
                names, their rates and this page&rsquo;s address is part of every frame.
              </p>
            </>
          ) : (
            <p className="text-[var(--muted)]">{recordNote}</p>
          )}
        </div>
      )}
    </div>
  );
}
