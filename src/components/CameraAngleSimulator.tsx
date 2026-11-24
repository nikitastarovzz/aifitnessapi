"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BONES,
  DEFAULT_VIEW,
  EXERCISES,
  EXERCISE_IDS,
  IMAGE_H,
  IMAGE_W,
  KEYPOINTS,
  LIMITS,
  PRESETS,
  THRESHOLDS,
  countsOnView,
  lookAt,
  orbitCamera,
  project,
  repSummary,
  view,
} from "@/lib/cameraAngleSim.mjs";

/**
 * The interactive half of the camera-angle simulator. Geometry only: every
 * number it prints is computed by src/lib/cameraAngleSim.mjs from a drawn
 * stick figure and a pinhole camera, and none of it describes a pose model.
 */

type Names = Record<string, { index: number; name: string }>;
type Counter = { top: number; bottom: number; exercise: string };
type Cam = ReturnType<typeof orbitCamera>;

const SCENE_W = 400;
const SCENE_H = 300;
const RULE_COLOR = "#7c3aed";
const BODY_COLOR = "#334155";
const HIDDEN_COLOR = "#dc2626";
const SEEN_COLOR = "#0284c7";
const REP_MS = 2400;

const deg = (n: number) => (Number.isFinite(n) ? `${Math.round(n)}°` : "—");
const clamp = (v: number, [lo, hi]: number[]) => Math.min(hi, Math.max(lo, v));

/** The director's view: a fixed camera above and to the side, showing the figure and where the phone is. */
function director(target: number[], phoneDistance: number): Cam {
  const az = (30 * Math.PI) / 180;
  const el = (55 * Math.PI) / 180;
  // Far enough to keep the whole orbit, and so the phone, in the picture.
  const d = 2 + phoneDistance * 2.4;
  const pos = [target[0] + d * Math.sin(az) * Math.cos(el), d * Math.sin(el), target[2] + d * Math.cos(az) * Math.cos(el)];
  return lookAt(pos, [target[0], 0, target[2]], 50, SCENE_W, SCENE_H) as Cam;
}

export default function CameraAngleSimulator({ names, counter }: { names: Names; counter: Counter }) {
  const [exercise, setExercise] = useState<string>(DEFAULT_VIEW.exercise);
  const [az, setAz] = useState(DEFAULT_VIEW.azimuthDeg);
  const [el, setEl] = useState(DEFAULT_VIEW.elevationDeg);
  const [dist, setDist] = useState(DEFAULT_VIEW.distance);
  const [fov, setFov] = useState(DEFAULT_VIEW.fovDeg);
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useState(0.5);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const phoneRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0.5);

  const ex = EXERCISES[exercise as keyof typeof EXERCISES];
  const cam = useMemo(
    () => orbitCamera({ target: ex.target, azimuthDeg: az, elevationDeg: el, distance: dist, fovDeg: fov }) as Cam,
    [ex, az, el, dist, fov],
  );
  const summary = useMemo(() => repSummary(exercise, cam), [exercise, cam]);

  // Start paused for readers who asked for less motion.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  // The animation clock: only the phase moves; everything else is derived.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let lastState = 0;
    const tick = (now: number) => {
      phaseRef.current = (phaseRef.current + (now - last) / REP_MS) % 1;
      last = now;
      draw(phaseRef.current);
      // The readouts re-render ten times a second, not every frame.
      if (now - lastState > 100) {
        lastState = now;
        setPhase(phaseRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, exercise, cam]);

  // Paused: draw on every change.
  useEffect(() => {
    if (!playing) draw(phaseRef.current);
  }, [playing, exercise, cam, phase]);

  function draw(ph: number) {
    const v = view(exercise, ph, cam);
    drawPhone(v);
    drawScene(v);
  }

  function drawPhone(v: ReturnType<typeof view>) {
    const ctx = phoneRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, IMAGE_W, IMAGE_H);
    // Floor grid, for depth.
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      for (const [a, b] of [
        [[i, 0, -3], [i, 0, 3]],
        [[-3, 0, i], [3, 0, i]],
      ]) {
        const pa = project(cam, a);
        const pb = project(cam, b);
        if (!pa || !pb) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
    // Bones far to near, so a near limb is drawn over a far one.
    const segs = BONES.map(([a, b]) => ({ a: v.points[a].img, b: v.points[b].img })).filter((s) => s.a && s.b) as {
      a: { x: number; y: number; depth: number };
      b: { x: number; y: number; depth: number };
    }[];
    segs.sort((p, q) => q.a.depth + q.b.depth - (p.a.depth + p.b.depth));
    for (const s of segs) {
      ctx.strokeStyle = BODY_COLOR;
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(2, (cam.focal * 0.09) / ((s.a.depth + s.b.depth) / 2));
      ctx.beginPath();
      ctx.moveTo(s.a.x, s.a.y);
      ctx.lineTo(s.b.x, s.b.y);
      ctx.stroke();
    }
    const head = project(cam, v.pose.head);
    if (head) {
      ctx.fillStyle = BODY_COLOR;
      ctx.beginPath();
      ctx.arc(head.x, head.y, Math.max(3, (cam.focal * 0.1) / head.depth), 0, Math.PI * 2);
      ctx.fill();
    }
    const ruleKeys = new Set(Object.values(ex.rule.sides).flat());
    for (const key of KEYPOINTS) {
      const p = v.points[key];
      if (!p.img) continue;
      const r = ruleKeys.has(key) ? 5 : 3.5;
      ctx.beginPath();
      ctx.arc(p.img.x, p.img.y, r, 0, Math.PI * 2);
      if (p.hiddenBy) {
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = HIDDEN_COLOR;
        ctx.stroke();
      } else {
        ctx.fillStyle = ruleKeys.has(key) ? RULE_COLOR : SEEN_COLOR;
        ctx.fill();
      }
    }
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, IMAGE_W - 2, IMAGE_H - 2);
  }

  function drawScene(v: ReturnType<typeof view>) {
    const ctx = sceneRef.current?.getContext("2d");
    if (!ctx) return;
    const d = director(ex.target, dist);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, SCENE_W, SCENE_H);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      for (const [a, b] of [
        [[i, 0, -6], [i, 0, 6]],
        [[-6, 0, i], [6, 0, i]],
      ]) {
        const pa = project(d, a);
        const pb = project(d, b);
        if (!pa || !pb) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
    // The phone's orbit at its current distance, on the floor.
    const radius = Math.hypot(cam.pos[0] - ex.target[0], cam.pos[2] - ex.target[2]);
    ctx.strokeStyle = "#bae6fd";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const q = project(d, [ex.target[0] + radius * Math.sin(a), 0, ex.target[2] + radius * Math.cos(a)]);
      if (!q) continue;
      if (i === 0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();
    // The figure.
    ctx.strokeStyle = BODY_COLOR;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (const [a, b] of BONES) {
      const pa = project(d, v.points[a].world);
      const pb = project(d, v.points[b].world);
      if (!pa || !pb) continue;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }
    const h = project(d, v.pose.head);
    if (h) {
      ctx.fillStyle = BODY_COLOR;
      ctx.beginPath();
      ctx.arc(h.x, h.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    // The phone: a dot, its line of sight, and a short frustum.
    const c = project(d, cam.pos);
    const t = project(d, cam.target);
    const g = project(d, [cam.pos[0], 0, cam.pos[2]]);
    if (c && t) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = SEEN_COLOR;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
      if (g) {
        ctx.strokeStyle = "#94a3b8";
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(g.x, g.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = SEEN_COLOR;
      ctx.fillRect(c.x - 5, c.y - 7, 10, 14);
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText("phone", c.x + 8, c.y - 6);
    }
  }

  const v = view(exercise, phase, cam);
  const hidden = KEYPOINTS.filter((k) => v.points[k].hiddenBy);
  const outside = KEYPOINTS.filter((k) => !v.points[k].inFrame);
  const label = (k: string) => (names[k] ? `${names[k].name} (#${names[k].index})` : k);
  const isCounterExercise = exercise === counter.exercise;

  function applyPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setAz(p.azimuthDeg);
    setEl(p.elevationDeg);
    setDist(p.distance);
  }

  const chip = "rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)] hover:border-brand-400";
  const sliderRow = "grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-sm text-[var(--fg)]";

  return (
    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" data-camera-sim>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-semibold text-[var(--fg)]" htmlFor="cam-sim-exercise">
          Exercise
        </label>
        <select
          id="cam-sim-exercise"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm text-[var(--fg)]"
        >
          {EXERCISE_IDS.map((id) => (
            <option key={id} value={id}>
              {EXERCISES[id as keyof typeof EXERCISES].label}
            </option>
          ))}
        </select>
        <button type="button" className={chip} onClick={() => setPlaying(!playing)} aria-pressed={playing}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Phone position presets">
        {PRESETS.map((p) => (
          <button key={p.id} type="button" className={chip} onClick={() => applyPreset(p.id)} data-sim-preset={p.id}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {(
          [
            ["Azimuth", az, setAz, LIMITS.azimuthDeg, 5, "°", "0° in front, 90° the figure's left side, 180° behind"],
            ["Elevation", el, setEl, LIMITS.elevationDeg, 1, "°", "above or below the figure's middle"],
            ["Distance", dist, setDist, LIMITS.distance, 0.1, " m", "from the figure's middle"],
            ["Field of view", fov, setFov, LIMITS.fovDeg, 1, "°", "vertical, portrait frame"],
          ] as [string, number, (n: number) => void, number[], number, string, string][]
        ).map(([name, value, set, lim, step, unit, hint]) => (
          <label key={name} className={sliderRow} title={hint}>
            <span>{name}</span>
            <input
              type="range"
              min={lim[0]}
              max={lim[1]}
              step={step}
              value={value}
              onChange={(e) => set(clamp(Number(e.target.value), lim))}
              aria-label={`${name}, ${hint}`}
              data-sim-slider={name.toLowerCase().replace(/ /g, "-")}
            />
            <span className="text-right font-mono text-xs">
              {step < 1 ? value.toFixed(1) : value}
              {unit}
            </span>
          </label>
        ))}
        {!playing && (
          <label className={sliderRow}>
            <span>Rep position</span>
            <input
              type="range"
              min={0}
              max={0.99}
              step={0.01}
              value={phase}
              onChange={(e) => {
                phaseRef.current = Number(e.target.value);
                setPhase(phaseRef.current);
              }}
              aria-label="Position in the rep"
            />
            <span className="text-right font-mono text-xs">{Math.round(phase * 100)}%</span>
          </label>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
        <figure className="m-0">
          <canvas
            ref={sceneRef}
            width={SCENE_W}
            height={SCENE_H}
            className="h-auto w-full rounded-lg border border-[var(--border)]"
            aria-label="The figure and the phone's position, seen from above and to the side"
            data-sim-scene
          />
          <figcaption className="mt-1 text-xs text-[var(--muted)]">
            Where the phone is (blue) on its orbit, seen from above and in front of the figure.
          </figcaption>
        </figure>
        <figure className="m-0 justify-self-center">
          <canvas
            ref={phoneRef}
            width={IMAGE_W}
            height={IMAGE_H}
            className="h-auto w-[240px] max-w-full rounded-lg"
            aria-label="What the phone's camera sees, with hidden keypoints ringed in red"
            data-sim-phone
          />
          <figcaption className="mt-1 max-w-[240px] text-xs text-[var(--muted)]">
            What the phone sees. Purple: the joints the {ex.rule.name} uses. Red ring: hidden by the body.
          </figcaption>
        </figure>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2" data-sim-readout>
        {(["left", "right"] as const).map((side) => {
          const r = v.rule[side];
          const s = summary.sides[side];
          const counts = isCounterExercise ? countsOnView(s, counter.top, counter.bottom) : null;
          return (
            <div key={side} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3" data-sim-side={side}>
              <p className="font-semibold text-[var(--fg)]">
                {side === "left" ? "Left" : "Right"} {ex.rule.name}
              </p>
              <p className="mt-1 text-[var(--muted)]">
                Now: true <span className="font-mono text-[var(--fg)]">{deg(r.true)}</span>, in the picture{" "}
                <span className="font-mono text-[var(--fg)]">{deg(r.seen)}</span>{" "}
                {r.foreshortened ? (
                  <span className="font-semibold text-[#b91c1c]" data-sim-flag="foreshortened">
                    foreshortened ({deg(r.off)} off)
                  </span>
                ) : (
                  <span>({deg(r.off)} off)</span>
                )}
              </p>
              {r.hidden.length > 0 && (
                <p className="mt-1 text-[#b91c1c]" data-sim-flag="hidden">
                  Not visible: {r.hidden.map((k) => `${label(k)}${v.points[k].hiddenBy ? ` behind the ${v.points[k].hiddenBy}` : ", out of frame"}`).join("; ")}
                </p>
              )}
              <p className="mt-1 text-[var(--muted)]">
                Over the rep: true {deg(s.trueMin)}&ndash;{deg(s.trueMax)}, in the picture {deg(s.seenMin)}&ndash;{deg(s.seenMax)};
                a joint of this angle is hidden in {s.hiddenFrames} of {summary.samples} moments.
              </p>
              {counts !== null && (
                <p className="mt-1 text-[var(--fg)]" data-sim-counts={counts ? "yes" : "no"}>
                  A {counter.top}&deg;/{counter.bottom}&deg; knee counter reading this side {counts ? "sees the rep" : "misses the rep"} on
                  this view{s.hiddenFrames > 0 ? ", if the model reports the hidden joints at all" : ""}.
                </p>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]" data-sim-hidden-count={hidden.length}>
        Right now {hidden.length} of {KEYPOINTS.length} keypoints are hidden behind the body
        {hidden.length ? ` (${hidden.map(label).join(", ")})` : ""}
        {outside.length ? `, and ${outside.length} are outside the frame` : ""}; at most {summary.maxHidden} at once during the rep.
        Thresholds: a joint is hidden when the line of sight crosses a limb that does not end at it, more than{" "}
        {Math.round(THRESHOLDS.HEAD_M * 100)} cm of the head, or more than {Math.round(THRESHOLDS.TORSO_OTHER_M * 100)} cm of the torso block (
        {Math.round(THRESHOLDS.TORSO_CORNER_M * 100)} cm for a shoulder or hip, which sit inside it); an angle is foreshortened when the
        picture is more than {THRESHOLDS.FORESHORTEN_DEG}&deg; off the true angle.
      </p>
    </div>
  );
}
