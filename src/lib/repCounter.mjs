/**
 * The rep counter behind /challenge.
 *
 * One module, imported by the page, its client component and
 * scripts/rep-counter.test.mjs, so the test runs exactly the rules a reader's
 * browser runs. Plain ESM, no dependencies, no DOM, no clock: every function
 * takes the frame's numbers and its timestamp and returns new values, so a
 * synthetic angle sequence replays the same way every time.
 *
 * The method is the one /motion/how-rep-counting-works describes, kept small
 * on purpose so the page can print every rule it applies:
 *
 *  1. Reduce the pose to one angle per frame (exerciseAngle). Each side's
 *     angle is read only when its three landmarks are visible enough; the
 *     sides that pass are averaged.
 *  2. Smooth it with an exponential moving average whose time constant is
 *     SMOOTHING_MS, so it lags by about the same time at any frame rate.
 *  3. Run a two-phase state machine with hysteresis (step): the angle has to
 *     enter the "rest" zone, then the "active" zone, then the rest zone again
 *     to count one rep. The zones are separated by a gap, so jitter around
 *     either boundary cannot complete a cycle on its own. A zone has to hold
 *     for MIN_HOLD_MS of consecutive frames before the phase changes, and a
 *     cycle faster than the exercise's minCycleMs is rejected, not counted.
 *
 * The thresholds are starting values, not calibrated ones. The squat values
 * are the example definition /motion/squat-detection-pose-estimation reports
 * from a 2026 study; the jumping-jack values are this site's own choice,
 * because the studies that page read give none. Both are stated as such on
 * the page.
 */

/** BlazePose 33 indices (MediaPipe Pose Landmarker). The page checks these
 *  names against the generated keypoint dataset at build time, so a wrong
 *  index fails the build instead of counting the wrong joint. */
export const LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

const L = LANDMARKS;

/** Bones drawn on the overlay. */
export const SKELETON = [
  [L.LEFT_SHOULDER, L.RIGHT_SHOULDER],
  [L.LEFT_SHOULDER, L.LEFT_ELBOW],
  [L.LEFT_ELBOW, L.LEFT_WRIST],
  [L.RIGHT_SHOULDER, L.RIGHT_ELBOW],
  [L.RIGHT_ELBOW, L.RIGHT_WRIST],
  [L.LEFT_SHOULDER, L.LEFT_HIP],
  [L.RIGHT_SHOULDER, L.RIGHT_HIP],
  [L.LEFT_HIP, L.RIGHT_HIP],
  [L.LEFT_HIP, L.LEFT_KNEE],
  [L.LEFT_KNEE, L.LEFT_ANKLE],
  [L.RIGHT_HIP, L.RIGHT_KNEE],
  [L.RIGHT_KNEE, L.RIGHT_ANKLE],
];

/** A landmark's three points are used only if each reports at least this
 *  visibility. Our choice; tune it on your own recordings. */
export const VISIBILITY_MIN = 0.5;
/** Time constant of the moving average: the newest frame's weight is
 *  1 - e^(-dt / SMOOTHING_MS), about 0.5 at 30 frames per second. */
export const SMOOTHING_MS = 50;
/** How long, counted in whole frames, a zone must hold before the phase
 *  changes: two frames at 30 fps, one at 15 fps or slower. */
export const MIN_HOLD_MS = 60;
/** The frame interval assumed for the first frame, and the cap on a gap. */
const FIRST_DT = 1000 / 30;
const MAX_DT = 250;
export const CHALLENGE_SECONDS = 30;
export const COUNTDOWN_SECONDS = 3;

/**
 * @typedef {{ below?: number, above?: number }} Zone
 * @typedef {{
 *   id: "squat" | "jumping-jack",
 *   label: string, noun: string, plural: string, emoji: string,
 *   angleName: string, vertex: string,
 *   sides: [number, number, number][],
 *   requireBothSides: boolean,
 *   rest: Zone, active: Zone,
 *   restName: string, activeName: string,
 *   minCycleMs: number,
 * }} Exercise
 */

/** @type {Record<"squat" | "jumping-jack", Exercise>} */
export const EXERCISES = {
  squat: {
    id: "squat",
    label: "Squats",
    noun: "squat",
    plural: "squats",
    emoji: "🦵",
    angleName: "knee angle",
    vertex: "hip, knee and ankle",
    sides: [
      [L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE],
      [L.RIGHT_HIP, L.RIGHT_KNEE, L.RIGHT_ANKLE],
    ],
    requireBothSides: false,
    rest: { above: 160 },
    active: { below: 100 },
    restName: "standing",
    activeName: "bottom",
    minCycleMs: 600,
  },
  "jumping-jack": {
    id: "jumping-jack",
    label: "Jumping jacks",
    noun: "jumping jack",
    plural: "jumping jacks",
    emoji: "⭐",
    angleName: "arm angle",
    vertex: "hip, shoulder and wrist",
    sides: [
      [L.LEFT_HIP, L.LEFT_SHOULDER, L.LEFT_WRIST],
      [L.RIGHT_HIP, L.RIGHT_SHOULDER, L.RIGHT_WRIST],
    ],
    requireBothSides: true,
    rest: { below: 45 },
    active: { above: 135 },
    restName: "arms down",
    activeName: "arms up",
    minCycleMs: 300,
  },
};

/** Angle at b between the rays b→a and b→c, in degrees (0–180). atan2 of the
 *  cross and dot products stays accurate near 0 and 180, where acos does not. */
export function jointAngle(a, b, c) {
  const ux = a.x - b.x, uy = a.y - b.y, uz = (a.z ?? 0) - (b.z ?? 0);
  const vx = c.x - b.x, vy = c.y - b.y, vz = (c.z ?? 0) - (b.z ?? 0);
  const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
  const cross = Math.hypot(cx, cy, cz);
  const dot = ux * vx + uy * vy + uz * vz;
  if (cross === 0 && dot === 0) return null; // a point sits on the vertex
  return (Math.atan2(cross, dot) * 180) / Math.PI;
}

/**
 * The exercise's angle for one frame, or null when the body is not visible
 * enough to read it.
 *
 * `image` is the normalized landmark list (it carries the visibility scores);
 * `world`, when given, is the same pose in metres, which is what the angle is
 * computed from because it does not depend on where the person stands in the
 * frame. Without it the image points are used, with x scaled by `aspect`
 * (width / height) so a degree means the same thing on both axes.
 */
export function exerciseAngle(exercise, image, world, aspect = 1) {
  if (!image) return null;
  const pts = world && world.length === image.length ? world : image.map((p) => ({ x: p.x * aspect, y: p.y, z: 0 }));
  const angles = [];
  for (const [a, b, c] of exercise.sides) {
    const ok = [a, b, c].every((i) => image[i] && (image[i].visibility ?? 1) >= VISIBILITY_MIN);
    if (!ok) continue;
    const deg = jointAngle(pts[a], pts[b], pts[c]);
    if (deg !== null) angles.push(deg);
  }
  if (angles.length === 0) return null;
  if (exercise.requireBothSides && angles.length < exercise.sides.length) return null;
  return angles.reduce((s, x) => s + x, 0) / angles.length;
}

function inZone(zone, angle) {
  if (zone.below !== undefined && !(angle < zone.below)) return false;
  if (zone.above !== undefined && !(angle > zone.above)) return false;
  return true;
}

/**
 * @typedef {{
 *   exercise: Exercise,
 *   phase: "waiting" | "rest" | "active",
 *   smoothed: number | null,
 *   held: number,
 *   lastT: number | null,
 *   reps: number,
 *   rejected: number,
 *   missing: number,
 *   repTimes: number[],
 *   lastRepAt: number,
 *   event: null | "phase" | "rep" | "rejected",
 * }} CounterState
 */

/** @returns {CounterState} */
export function createCounter(exercise) {
  return {
    exercise,
    phase: "waiting",
    smoothed: null,
    held: 0,
    lastT: null,
    reps: 0,
    rejected: 0,
    missing: 0,
    repTimes: [],
    lastRepAt: -Infinity,
    event: null,
  };
}

/**
 * Feed one frame. `angle` is exerciseAngle's result (null for no reading),
 * `t` the frame's time in milliseconds. Returns the next state; the input is
 * not modified. `event` says what this frame did.
 *
 * Phases: "waiting" until the angle first holds in the rest zone (so someone
 * who starts at the bottom is not credited with half a rep), then "rest" and
 * "active" in turn. A rep is the return from active to rest.
 *
 * @param {CounterState} s
 * @param {number | null} angle
 * @param {number} t
 * @returns {CounterState}
 */
export function step(s, angle, t) {
  const dt = s.lastT === null ? FIRST_DT : Math.min(MAX_DT, Math.max(1, t - s.lastT));
  if (angle === null || !Number.isFinite(angle)) {
    // No reading: hold the phase, but a zone has to be re-established.
    return { ...s, held: 0, lastT: t, missing: s.missing + 1, event: null };
  }
  const w = 1 - Math.exp(-dt / SMOOTHING_MS);
  const smoothed = s.smoothed === null ? angle : w * angle + (1 - w) * s.smoothed;
  const ex = s.exercise;
  const base = { ...s, smoothed, lastT: t, event: null };
  const target = s.phase === "rest" ? ex.active : ex.rest;
  if (!inZone(target, smoothed)) return { ...base, held: 0 };
  // A frame stands for the interval since the previous one.
  const held = s.held + dt;
  if (held < MIN_HOLD_MS) return { ...base, held };

  if (s.phase === "waiting") return { ...base, held: 0, phase: "rest", event: "phase" };
  if (s.phase === "rest") return { ...base, held: 0, phase: "active", event: "phase" };
  // active → rest completes a cycle.
  if (t - s.lastRepAt < ex.minCycleMs) {
    return { ...base, held: 0, phase: "rest", rejected: s.rejected + 1, event: "rejected" };
  }
  return {
    ...base,
    held: 0,
    phase: "rest",
    reps: s.reps + 1,
    repTimes: [...s.repTimes, t],
    lastRepAt: t,
    event: "rep",
  };
}

/** Run a whole sequence of [t, angle] samples; for tests and replays. */
export function countSequence(exercise, samples) {
  let s = createCounter(exercise);
  for (const [t, angle] of samples) s = step(s, angle, t);
  return s;
}

/** Reps per equal slice of the challenge window (six 5-second slices). */
export function bucketReps(repTimes, startMs, durationMs = CHALLENGE_SECONDS * 1000, buckets = 6) {
  const out = new Array(buckets).fill(0);
  const width = durationMs / buckets;
  for (const t of repTimes) {
    const i = Math.floor((t - startMs) / width);
    if (i >= 0 && i < buckets) out[i]++;
    else if (i === buckets && t - startMs === durationMs) out[buckets - 1]++;
  }
  return out;
}

/** One square per slice, coloured against the best slice: green at three
 *  quarters of it or more, yellow at 40 percent or more, red below, black for
 *  none. It shows the pacing, not the video. */
export function paceSquares(buckets) {
  const best = Math.max(0, ...buckets);
  return buckets
    .map((n) => {
      if (n === 0 || best === 0) return "⬛";
      const r = n / best;
      return r >= 0.75 ? "🟩" : r >= 0.4 ? "🟨" : "🟥";
    })
    .join("");
}

/** The copyable result: one line, no image, nothing about the person. */
export function shareLine({ exercise, reps, buckets, url = "aifitnessapi.com/challenge" }) {
  const unit = reps === 1 ? exercise.noun : exercise.plural;
  return `${exercise.emoji} ${CHALLENGE_SECONDS}-second ${exercise.noun} challenge: ${reps} ${unit} ${paceSquares(buckets)} ${url}`;
}

/** Plain-language form of a zone, for the page: "above 160°". */
export function describeZone(zone) {
  const parts = [];
  if (zone.above !== undefined) parts.push(`above ${zone.above}°`);
  if (zone.below !== undefined) parts.push(`below ${zone.below}°`);
  return parts.join(" and ");
}
