"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_PARAMS,
  INTERVAL_RANGE,
  REPLAY_LABEL,
  REPLAY_TRUE_STEPS,
  THRESHOLD_RANGE,
  detectSteps,
  magnitude,
  replayTrace,
  shareText,
  type Sample,
} from "@/lib/stepDetector.mjs";

/**
 * The step lab: the phone's accelerometer, a visible step detector over it,
 * and two sliders that change what counts as a step.
 *
 * Everything runs in this tab. Motion samples go from the browser's
 * `devicemotion` event into an array in memory and are drawn on a canvas; they
 * are never stored, sent or recorded, and reloading the page discards them.
 * The share card is drawn here too and saved by the reader's own browser.
 *
 * The detector is src/lib/stepDetector.mjs, the module the node tests run.
 * On every animation frame the whole recording is re-run through it with the
 * current slider values, which is what lets a slider change the count of a
 * walk that has already happened.
 */

type Mode = "idle" | "live" | "replay" | "done";

const PAGE_URL = "https://aifitnessapi.com/tools/step-lab";
const LIVE_WINDOW_MS = 8000;
const STOPPED_WINDOW_MS = 60000;
// About 16 minutes at 60 Hz. Recording stops there rather than dropping old
// samples, so the count never changes because history fell off the end.
const MAX_SAMPLES = 60000;
const NO_DATA_MS = 3000;

type Colors = { fg: string; muted: string; border: string; surface: string; bg: string; brand: string; accent: string };

function readColors(el: Element): Colors {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    fg: v("--fg", "#0a0a0a"),
    muted: v("--muted", "#6b7280"),
    border: v("--border", "#e5e7eb"),
    surface: v("--surface", "#f9fafb"),
    bg: v("--bg", "#ffffff"),
    brand: v("--color-brand-600", "#059669"),
    accent: "#f59e0b",
  };
}

/** Draw the trace of `samples` that falls in the last `windowMs` into a box. */
function drawTrace(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  samples: Sample[],
  res: ReturnType<typeof detectSteps>,
  threshold: number,
  windowMs: number,
  c: Colors,
  scale: number,
) {
  const { x, y, w, h } = box;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (samples.length < 2) {
    ctx.fillStyle = c.muted;
    ctx.font = `${13 * scale}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("No samples yet", x + 10 * scale, y + h / 2);
    ctx.restore();
    return;
  }
  const tEnd = samples[samples.length - 1].t;
  const tStart = Math.max(samples[0].t, tEnd - windowMs);
  let i0 = samples.length - 1;
  while (i0 > 0 && samples[i0 - 1].t >= tStart) i0--;
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = i0; i < samples.length; i++) {
    lo = Math.min(lo, samples[i].m, res.baseline[i]);
    hi = Math.max(hi, samples[i].m, res.baseline[i] + threshold);
  }
  const pad = Math.max(0.5, (hi - lo) * 0.08);
  lo -= pad;
  hi += pad;
  const span = Math.max(tEnd - tStart, 1);
  const px = (t: number) => x + ((t - tStart) / span) * w;
  const py = (m: number) => y + h - ((m - lo) / (hi - lo)) * h;

  // Grid: one line per m/s² step that keeps the count of lines small.
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 1 * scale;
  ctx.fillStyle = c.muted;
  ctx.font = `${10 * scale}px ui-monospace, monospace`;
  const stepM = hi - lo > 12 ? 4 : hi - lo > 6 ? 2 : 1;
  for (let m = Math.ceil(lo / stepM) * stepM; m <= hi; m += stepM) {
    ctx.beginPath();
    ctx.moveTo(x, py(m));
    ctx.lineTo(x + w, py(m));
    ctx.stroke();
    ctx.fillText(`${m}`, x + 3 * scale, py(m) - 2 * scale);
  }

  const line = (vals: (i: number) => number, color: string, width: number, dash: number[] = []) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width * scale;
    ctx.setLineDash(dash.map((d) => d * scale));
    ctx.beginPath();
    for (let i = i0; i < samples.length; i++) {
      const X = px(samples[i].t);
      const Y = py(vals(i));
      if (i === i0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };
  ctx.globalAlpha = 0.45;
  line((i) => samples[i].m, c.muted, 1);
  ctx.globalAlpha = 1;
  line((i) => res.baseline[i] + threshold, c.accent, 1.25, [5, 4]);
  line((i) => res.filtered[i], c.brand, 2);

  ctx.fillStyle = c.fg;
  for (const s of res.steps) {
    if (s.t < tStart) continue;
    const X = px(s.t);
    const Y = py(s.value);
    ctx.beginPath();
    ctx.arc(X, Y, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(X - 0.75 * scale, y, 1.5 * scale, 6 * scale);
  }
  ctx.restore();
}

export default function StepLab() {
  const [mode, setMode] = useState<Mode>("idle");
  const [source, setSource] = useState<"live" | "replay" | null>(null);
  const [status, setStatus] = useState("Tap Start on a phone and walk, or replay the synthetic walk.");
  const [threshold, setThreshold] = useState<number>(DEFAULT_PARAMS.threshold);
  const [minInterval, setMinInterval] = useState<number>(DEFAULT_PARAMS.minIntervalMs);
  const [count, setCount] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const [sensorInfo, setSensorInfo] = useState<string | null>(null);
  const [walked, setWalked] = useState("");
  const [copied, setCopied] = useState(false);
  const [cardUrl, setCardUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samplesRef = useRef<Sample[]>([]);
  const paramsRef = useRef({ threshold, minInterval });
  const modeRef = useRef<Mode>("idle");
  const listenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const replayRef = useRef<{ trace: Sample[]; startedAt: number; cursor: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const watchdogRef = useRef<number | null>(null);
  const firstEventRef = useRef(false);

  paramsRef.current = { threshold, minInterval };

  const setModeBoth = (m: Mode) => {
    modeRef.current = m;
    setMode(m);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const cssW = canvas.clientWidth || 340;
    const cssH = canvas.clientHeight || 220;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = readColors(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = c.surface;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const samples = samplesRef.current;
    const { threshold: th, minInterval: iv } = paramsRef.current;
    const res = detectSteps(samples, { threshold: th, minIntervalMs: iv });
    const running = modeRef.current === "live" || modeRef.current === "replay";
    drawTrace(
      ctx,
      { x: 0, y: 0, w: canvas.width, h: canvas.height },
      samples,
      res,
      th,
      running ? LIVE_WINDOW_MS : STOPPED_WINDOW_MS,
      c,
      dpr,
    );
    setCount((prev) => (prev === res.count ? prev : res.count));
    setSampleCount((prev) => (prev === samples.length ? prev : samples.length));
  }, []);

  const loop = useCallback(() => {
    const r = replayRef.current;
    if (modeRef.current === "replay" && r) {
      const elapsed = performance.now() - r.startedAt;
      while (r.cursor < r.trace.length && r.trace[r.cursor].t <= elapsed) {
        samplesRef.current.push(r.trace[r.cursor]);
        r.cursor++;
      }
      if (r.cursor >= r.trace.length) {
        setModeBoth("done");
        setStatus("Replay finished. Move the sliders: the count is recomputed over the whole trace.");
      }
    }
    draw();
    if (modeRef.current === "live" || modeRef.current === "replay") {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      rafRef.current = null;
    }
  }, [draw]);

  const startLoop = useCallback(() => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const removeListener = () => {
    if (listenerRef.current) {
      window.removeEventListener("devicemotion", listenerRef.current);
      listenerRef.current = null;
    }
    if (watchdogRef.current !== null) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  };

  const stop = useCallback(() => {
    removeListener();
    replayRef.current = null;
    if (modeRef.current === "live" || modeRef.current === "replay") {
      setModeBoth("done");
      setStatus(
        samplesRef.current.length
          ? "Stopped. Move the sliders: the count is recomputed over the whole recording."
          : "Stopped before any sample arrived.",
      );
    }
    requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    draw();
    return () => {
      window.removeEventListener("resize", onResize);
      removeListener();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  // A slider moved while stopped: redraw once with the new values.
  useEffect(() => {
    if (modeRef.current !== "live" && modeRef.current !== "replay") draw();
  }, [threshold, minInterval, draw]);

  const reset = () => {
    samplesRef.current = [];
    firstEventRef.current = false;
    setCardUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return null;
    });
    setCopied(false);
    setSensorInfo(null);
  };

  // Must stay a direct tap handler: on iOS, DeviceMotionEvent.requestPermission()
  // needs transient activation, so it is the first thing awaited here.
  const startLive = async () => {
    stop();
    if (typeof window === "undefined" || typeof window.DeviceMotionEvent === "undefined") {
      setStatus("This browser has no DeviceMotionEvent. Use the synthetic replay instead.");
      return;
    }
    const DME = window.DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DME.requestPermission === "function") {
      try {
        const answer = await DME.requestPermission();
        if (answer !== "granted") {
          setStatus("Motion access was denied, so nothing was recorded. Use the synthetic replay, or allow motion access and tap Start again.");
          return;
        }
      } catch {
        setStatus("The browser refused the motion permission request. Tap Start again directly, or use the synthetic replay.");
        return;
      }
    }
    reset();
    setSource("live");
    setModeBoth("live");
    setStatus("Recording. Walk with the phone in your hand or pocket, then tap Stop.");

    const onMotion = (e: DeviceMotionEvent) => {
      if (modeRef.current !== "live") return;
      const g = e.accelerationIncludingGravity;
      const a = e.acceleration;
      let m: number | null = null;
      let which = "";
      if (g && g.x !== null && g.y !== null && g.z !== null) {
        m = magnitude(g.x, g.y, g.z);
        which = "accelerationIncludingGravity";
      } else if (a && a.x !== null && a.y !== null && a.z !== null) {
        m = magnitude(a.x, a.y, a.z);
        which = "acceleration";
      }
      if (m === null || !Number.isFinite(m)) return;
      if (!firstEventRef.current) {
        firstEventRef.current = true;
        const iv = typeof e.interval === "number" && e.interval > 0 ? `, reported interval ${e.interval} ms` : "";
        setSensorInfo(`Reading ${which}${iv}.`);
      }
      const buf = samplesRef.current;
      if (buf.length >= MAX_SAMPLES) {
        stop();
        setStatus("Stopped at the recording limit. Move the sliders to recount it.");
        return;
      }
      buf.push({ t: performance.now(), m });
    };
    listenerRef.current = onMotion;
    window.addEventListener("devicemotion", onMotion);
    watchdogRef.current = window.setTimeout(() => {
      watchdogRef.current = null;
      if (modeRef.current === "live" && samplesRef.current.length === 0) {
        removeListener();
        setModeBoth("idle");
        setSource(null);
        setStatus("No motion data arrived in 3 seconds: this browser or device is not reporting an accelerometer here. The synthetic replay shows the same detector.");
      }
    }, NO_DATA_MS);
    startLoop();
  };

  const startReplay = () => {
    stop();
    reset();
    setSource("replay");
    replayRef.current = { trace: replayTrace(), startedAt: performance.now(), cursor: 0 };
    setModeBoth("replay");
    setStatus("Replaying a synthetic walk in real time.");
    startLoop();
  };

  const finishReplay = () => {
    if (modeRef.current !== "replay" || !replayRef.current) return;
    samplesRef.current = replayRef.current.trace.slice();
    replayRef.current = null;
    setModeBoth("done");
    setStatus("Replay finished. Move the sliders: the count is recomputed over the whole trace.");
    requestAnimationFrame(draw);
  };

  const walkedN = source === "replay" ? REPLAY_TRUE_STEPS : Math.max(0, Math.floor(Number(walked) || 0));
  const text = shareText({
    mode: source === "replay" ? "replay" : "live",
    walked: walkedN,
    counted: count,
    threshold,
    minIntervalMs: minInterval,
    url: PAGE_URL,
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setStatus("The clipboard was not available; select the text below and copy it.");
    }
  };

  const makeCard = () => {
    const W = 1200;
    const H = 630;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const c: Colors = {
      fg: "#0a0a0a",
      muted: "#6b7280",
      border: "#e5e7eb",
      surface: "#f9fafb",
      bg: "#ffffff",
      brand: "#059669",
      accent: "#f59e0b",
    };
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = c.brand;
    ctx.fillRect(0, 0, W, 10);
    ctx.fillStyle = c.muted;
    ctx.font = "600 26px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(source === "replay" ? "STEP LAB · SYNTHETIC REPLAY" : "STEP LAB", 60, 70);
    ctx.fillStyle = c.fg;
    ctx.font = "800 120px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(String(count), 60, 205);
    const countW = ctx.measureText(String(count)).width;
    ctx.font = "600 38px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(
      walkedN ? `counted, of ${walkedN} ${source === "replay" ? "generated" : "walked"}` : "steps counted",
      60 + countW + 24,
      200,
    );
    ctx.fillStyle = c.muted;
    ctx.font = "28px ui-monospace, monospace";
    ctx.fillText(`threshold ${threshold.toFixed(1)} m/s²  ·  min interval ${Math.round(minInterval)} ms`, 60, 255);
    const samples = samplesRef.current;
    const res = detectSteps(samples, { threshold, minIntervalMs: minInterval });
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 290, W - 120, 250);
    drawTrace(ctx, { x: 61, y: 291, w: W - 122, h: 248 }, samples, res, threshold, STOPPED_WINDOW_MS, c, 2);
    ctx.fillStyle = c.muted;
    ctx.font = "24px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("Same walk, different settings, different count. aifitnessapi.com/tools/step-lab", 60, 585);
    cv.toBlob((blob) => {
      if (!blob) return;
      setCardUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
    }, "image/png");
  };

  const running = mode === "live" || mode === "replay";
  const hasData = sampleCount > 0;
  const btn =
    "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
  const btn2 =
    "rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400 disabled:opacity-50";

  return (
    <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6" data-step-mode={mode}>
      <p className="text-sm text-[var(--muted)]">
        Motion data never leaves your device: samples stay in this tab&rsquo;s memory, nothing is
        uploaded, and reloading the page discards them.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!running ? (
          <>
            <button type="button" onClick={startLive} className={btn} data-step-start>
              Start (phone)
            </button>
            <button type="button" onClick={startReplay} className={btn2} data-step-replay>
              Replay synthetic walk
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={stop} className={btn} data-step-stop>
              Stop
            </button>
            {mode === "replay" && (
              <button type="button" onClick={finishReplay} className={btn2}>
                Skip to end
              </button>
            )}
          </>
        )}
      </div>
      <p role="status" aria-live="polite" data-step-status className="mt-3 text-sm text-[var(--muted)]">
        {status}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Steps counted</p>
          <p data-step-count className="font-mono text-5xl font-bold text-[var(--fg)]">
            {count}
          </p>
        </div>
        <p className="text-right text-xs text-[var(--muted)]">
          <span data-step-samples>{sampleCount}</span> samples
          {source === "replay" ? (
            <>
              <br />
              synthetic replay
            </>
          ) : sensorInfo ? (
            <>
              <br />
              {sensorInfo}
            </>
          ) : null}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        data-step-canvas
        role="img"
        aria-label={`Acceleration magnitude trace with ${count} detected steps marked`}
        className="mt-3 h-56 w-full rounded-lg border border-[var(--border)]"
      />
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
        <span>
          <span className="inline-block h-0.5 w-4 align-middle bg-[var(--muted)] opacity-50" /> raw magnitude, m/s²
        </span>
        <span>
          <span className="inline-block h-0.5 w-4 align-middle bg-brand-600" /> low-pass filtered
        </span>
        <span>
          <span className="inline-block w-4 border-t border-dashed border-amber-500 align-middle" /> baseline + threshold
        </span>
        <span>
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--fg)] align-middle" /> counted step
        </span>
      </p>
      {source === "replay" && (
        <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400" data-step-synthetic>
          {REPLAY_LABEL}
        </p>
      )}

      <fieldset className="mt-6 space-y-5">
        <legend className="text-sm font-semibold text-[var(--fg)]">Detector settings</legend>
        <label className="block text-sm text-[var(--fg)]">
          <span className="flex justify-between">
            <span>Threshold above baseline</span>
            <span className="font-mono" data-step-threshold>
              {threshold.toFixed(1)} m/s²
            </span>
          </span>
          <input
            type="range"
            min={THRESHOLD_RANGE.min}
            max={THRESHOLD_RANGE.max}
            step={THRESHOLD_RANGE.step}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-brand-600)]"
            aria-label="Threshold above baseline in metres per second squared"
          />
          <span className="text-xs text-[var(--muted)]">
            How far the filtered signal must rise above its running baseline to be a step. Higher misses soft
            steps; lower counts bumps that are not steps.
          </span>
        </label>
        <label className="block text-sm text-[var(--fg)]">
          <span className="flex justify-between">
            <span>Minimum interval between steps</span>
            <span className="font-mono" data-step-interval>
              {Math.round(minInterval)} ms
            </span>
          </span>
          <input
            type="range"
            min={INTERVAL_RANGE.min}
            max={INTERVAL_RANGE.max}
            step={INTERVAL_RANGE.step}
            value={minInterval}
            onChange={(e) => setMinInterval(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-brand-600)]"
            aria-label="Minimum interval between steps in milliseconds"
          />
          <span className="text-xs text-[var(--muted)]">
            A peak sooner than this after the last step is ignored. Longer merges a double impact into one
            step, and past your step period it drops every other step.
          </span>
        </label>
        <button
          type="button"
          onClick={() => {
            setThreshold(DEFAULT_PARAMS.threshold);
            setMinInterval(DEFAULT_PARAMS.minIntervalMs);
          }}
          className="text-xs font-medium text-brand-600 hover:text-brand-500"
        >
          Reset to {DEFAULT_PARAMS.threshold.toFixed(1)} m/s² and {DEFAULT_PARAMS.minIntervalMs} ms
        </button>
      </fieldset>

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <p className="text-sm font-semibold text-[var(--fg)]">Share the result</p>
        {source !== "replay" && (
          <label className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--fg)]">
            Steps you actually walked (count them yourself)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={walked}
              onChange={(e) => setWalked(e.target.value)}
              placeholder="50"
              className="w-24 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 font-mono text-sm"
            />
          </label>
        )}
        <textarea
          readOnly
          value={text}
          aria-label="Share text"
          data-step-share-text
          className="mt-3 h-24 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--fg)]"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={copy} className={btn2} disabled={!hasData}>
            {copied ? "Copied" : "Copy text"}
          </button>
          <button type="button" onClick={makeCard} className={btn2} disabled={!hasData || running} data-step-make-card>
            Make a share card
          </button>
          {cardUrl && (
            <a href={cardUrl} download="step-lab.png" className="text-sm font-medium text-brand-600 hover:text-brand-500" data-step-card-link>
              Download step-lab.png
            </a>
          )}
        </div>
        {cardUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cardUrl} alt="Share card: steps counted, settings and the trace" className="mt-3 w-full rounded-lg border border-[var(--border)]" data-step-card />
        )}
      </div>
    </div>
  );
}
