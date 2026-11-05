/**
 * The logic behind /tools/rep-counter-playground.
 *
 * Plain ESM with no DOM and no clock, imported by the page's client
 * component and by scripts/rep-playground.test.mjs, so the tests run exactly
 * the rules the reader's browser runs. It reuses the /challenge counter in
 * src/lib/repCounter.mjs (the same smoothing, hysteresis, hold and minimum
 * cycle rules) and adds what a playground needs on top:
 *
 *  - every joint angle of every frame is recorded once (frameAngles), so a
 *    different joint, side or threshold recounts the whole recording at once
 *    without running the pose model again (countTrace);
 *  - the thresholds are a config the reader tunes and exports as JSON
 *    (CONFIG_SCHEMA, validateConfig, configJson);
 *  - a rule set from the exercise form-rules dataset (src/data/formRules.ts)
 *    can be loaded as the starting config (configFromPreset).
 *
 * Angles are the interior angle at the middle point, 0 to 180 degrees, the
 * same definition the open-source projects in the form-rules dataset use.
 * By default they are measured on the image (x scaled by the frame's aspect
 * ratio), as those projects do; "world" uses the model's 3D world landmarks.
 */
import { LANDMARKS, VISIBILITY_MIN, createCounter, jointAngle, step } from "./repCounter.mjs";

const L = LANDMARKS;

/** The four joints the playground traces, as [first, vertex, last] BlazePose
 *  indices per side. The page checks these names against the generated
 *  keypoint dataset at build time. */
export const JOINTS = {
  knee: {
    label: "Knee",
    points: "hip, knee, ankle",
    left: [L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE],
    right: [L.RIGHT_HIP, L.RIGHT_KNEE, L.RIGHT_ANKLE],
  },
  hip: {
    label: "Hip",
    points: "shoulder, hip, knee",
    left: [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE],
    right: [L.RIGHT_SHOULDER, L.RIGHT_HIP, L.RIGHT_KNEE],
  },
  elbow: {
    label: "Elbow",
    points: "shoulder, elbow, wrist",
    left: [L.LEFT_SHOULDER, L.LEFT_ELBOW, L.LEFT_WRIST],
    right: [L.RIGHT_SHOULDER, L.RIGHT_ELBOW, L.RIGHT_WRIST],
  },
  shoulder: {
    label: "Shoulder",
    points: "hip, shoulder, elbow",
    left: [L.LEFT_HIP, L.LEFT_SHOULDER, L.LEFT_ELBOW],
    right: [L.RIGHT_HIP, L.RIGHT_SHOULDER, L.RIGHT_ELBOW],
  },
};

export const JOINT_IDS = /** @type {("knee"|"hip"|"elbow"|"shoulder")[]} */ (Object.keys(JOINTS));

export const SIDES = {
  left: "Left side only",
  right: "Right side only",
  either: "Average of the visible sides",
  best: "The more visible side, per frame",
};

export const CONFIG_SCHEMA = "https://aifitnessapi.com/tools/rep-counter-playground#config-v1";

/** Starting values. Ours, not calibrated: the page says so. The angles are
 *  those of the /challenge squat so a reader moving between the two pages
 *  sees the same rule. */
export const DEFAULT_CONFIG = {
  $schema: CONFIG_SCHEMA,
  joint: "knee",
  side: "either",
  coordinates: "image",
  startAt: "high",
  top: 160,
  bottom: 100,
  minFrames: 2,
  minCycleMs: 600,
  smoothingMs: 50,
  visibilityMin: VISIBILITY_MIN,
  source: null,
};

const LIMITS = {
  top: [1, 180],
  bottom: [0, 179],
  minFrames: [1, 30],
  minCycleMs: [0, 10000],
  smoothingMs: [0, 1000],
  visibilityMin: [0, 1],
};

/**
 * Check a config (as parsed from JSON or the form) and return a clean copy,
 * or the reasons it is not usable. Unknown keys are dropped; missing keys
 * take the defaults, and the caller is told which.
 */
export function validateConfig(input) {
  const errors = [];
  const defaulted = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, errors: ["a config is a JSON object"] };
  const out = { ...DEFAULT_CONFIG };
  for (const k of Object.keys(DEFAULT_CONFIG)) {
    if (k === "$schema") continue;
    if (!(k in input)) {
      defaulted.push(k);
      continue;
    }
    out[k] = input[k];
  }
  if (!JOINT_IDS.includes(out.joint)) errors.push(`joint must be one of ${JOINT_IDS.join(", ")}`);
  if (!(out.side in SIDES)) errors.push(`side must be one of ${Object.keys(SIDES).join(", ")}`);
  if (out.coordinates !== "image" && out.coordinates !== "world") errors.push("coordinates must be image or world");
  if (out.startAt !== "high" && out.startAt !== "low") errors.push("startAt must be high or low");
  for (const [k, [lo, hi]] of Object.entries(LIMITS)) {
    const v = out[k];
    if (typeof v !== "number" || !Number.isFinite(v) || v < lo || v > hi) errors.push(`${k} must be a number from ${lo} to ${hi}`);
  }
  if (!Number.isInteger(out.minFrames)) errors.push("minFrames must be a whole number");
  if (typeof out.top === "number" && typeof out.bottom === "number" && !(out.top > out.bottom)) {
    errors.push("top must be above bottom: the gap between them is the hysteresis");
  }
  if (out.source !== null && (typeof out.source !== "object" || Array.isArray(out.source))) errors.push("source must be null or an object");
  return errors.length ? { ok: false, errors } : { ok: true, config: out, defaulted };
}

/** Parse pasted JSON into a validated config. */
export function parseConfig(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { ok: false, errors: [`not valid JSON: ${e.message}`] };
  }
  return validateConfig(data);
}

/** The export: stable key order, two-space indent, trailing newline. */
export function configJson(config) {
  const ordered = {};
  for (const k of Object.keys(DEFAULT_CONFIG)) ordered[k] = k === "$schema" ? CONFIG_SCHEMA : config[k];
  return JSON.stringify(ordered, null, 2) + "\n";
}

/**
 * A config as the /challenge counter's exercise object. "high" starts at the
 * top: rest is above `top`, the active zone below `bottom` (squat, curl,
 * push-up). "low" is the reverse (a press from the shoulders).
 */
export function configToExercise(config) {
  const high = config.startAt === "high";
  return {
    id: "playground",
    label: JOINTS[config.joint].label,
    noun: "rep",
    plural: "reps",
    emoji: "",
    angleName: `${config.joint} angle`,
    vertex: JOINTS[config.joint].points,
    sides: [JOINTS[config.joint].left, JOINTS[config.joint].right],
    requireBothSides: false,
    rest: high ? { above: config.top } : { below: config.bottom },
    active: high ? { below: config.bottom } : { above: config.top },
    restName: high ? "top" : "bottom",
    activeName: high ? "bottom" : "top",
    minCycleMs: config.minCycleMs,
    minHoldFrames: config.minFrames,
    smoothingMs: config.smoothingMs,
  };
}

/**
 * Every joint angle of one frame, both sides, plus each side's weakest
 * visibility. `image` is the normalized landmark list (it carries
 * visibility), `world` the same pose in meters or undefined, `aspect` the
 * frame's width / height. A side whose three points are not all at least
 * `visibilityFloor` visible is recorded as null, so a later, stricter floor
 * can still be applied (sideAngle compares against the config's own).
 *
 * @returns {{ image: Record<string, [number|null, number|null]>, world: Record<string, [number|null, number|null]> | null, vis: Record<string, [number, number]> }}
 */
export function frameAngles(image, world, aspect = 1, visibilityFloor = 0) {
  const img = image.map((p) => ({ x: p.x * aspect, y: p.y, z: 0 }));
  const hasWorld = Array.isArray(world) && world.length === image.length;
  const out = { image: {}, world: hasWorld ? {} : null, vis: {} };
  for (const id of JOINT_IDS) {
    const j = JOINTS[id];
    out.image[id] = [null, null];
    if (hasWorld) out.world[id] = [null, null];
    out.vis[id] = [0, 0];
    [j.left, j.right].forEach((tri, s) => {
      const v = Math.min(...tri.map((i) => (image[i] ? (image[i].visibility ?? 1) : 0)));
      out.vis[id][s] = v;
      if (v < visibilityFloor || tri.some((i) => !image[i])) return;
      const a = jointAngle(img[tri[0]], img[tri[1]], img[tri[2]]);
      out.image[id][s] = a === null ? null : round1(a);
      if (hasWorld) {
        const w = jointAngle(world[tri[0]], world[tri[1]], world[tri[2]]);
        out.world[id][s] = w === null ? null : round1(w);
      }
    });
  }
  return out;
}

const round1 = (x) => Math.round(x * 10) / 10;

/** The one angle a config reads from a recorded frame, or null. */
export function sideAngle(frame, config) {
  if (!frame) return null;
  const set = config.coordinates === "world" && frame.world ? frame.world : frame.image;
  const [l, r] = set[config.joint];
  const [vl, vr] = frame.vis[config.joint];
  const okL = l !== null && vl >= config.visibilityMin;
  const okR = r !== null && vr >= config.visibilityMin;
  switch (config.side) {
    case "left":
      return okL ? l : null;
    case "right":
      return okR ? r : null;
    case "best":
      if (okL && okR) return vl >= vr ? l : r;
      return okL ? l : okR ? r : null;
    default:
      if (okL && okR) return (l + r) / 2;
      return okL ? l : okR ? r : null;
  }
}

/**
 * Count a whole recording under a config. `frames` is [{ t, angles }] with
 * angles from frameAngles (or null for a frame with no pose). Returns the
 * per-frame series the chart draws and the counter's verdicts.
 */
export function countTrace(config, frames) {
  let s = createCounter(configToExercise(config));
  const series = [];
  const events = [];
  for (const f of frames) {
    const raw = f.angles ? sideAngle(f.angles, config) : null;
    s = step(s, raw, f.t);
    series.push({ t: f.t, raw, smoothed: raw === null ? null : s.smoothed, phase: s.phase });
    if (s.event === "rep" || s.event === "rejected") events.push({ t: f.t, kind: s.event, n: s.reps });
  }
  return { reps: s.reps, rejected: s.rejected, missing: s.missing, phase: s.phase, repTimes: s.repTimes, events, series };
}

/** Count a plain [t, angle] sequence, for tests and the synthetic demo. */
export function countAngles(config, samples) {
  const id = config.joint;
  const frames = samples.map(([t, a]) => ({
    t,
    angles: a === null ? null : { image: { ...emptyAngles(), [id]: [a, a] }, world: null, vis: { ...emptyVis(), [id]: [1, 1] } },
  }));
  return countTrace(config, frames);
}

function emptyAngles() {
  return Object.fromEntries(JOINT_IDS.map((j) => [j, [null, null]]));
}
function emptyVis() {
  return Object.fromEntries(JOINT_IDS.map((j) => [j, [0, 0]]));
}

/**
 * A starting config from a form-rules preset (FORM_RULE_PRESETS in
 * src/data/formRules.ts). The angles, joint, side and direction come from
 * the preset; the timing values are not in any source read and stay ours,
 * and the result says which is which.
 */
export function configFromPreset(preset, base = DEFAULT_CONFIG) {
  const config = {
    ...base,
    joint: preset.joint,
    side: preset.side,
    startAt: preset.startAt,
    top: preset.top,
    bottom: preset.bottom,
    coordinates: "image",
    source: { preset: preset.id, topRule: preset.topRuleId, bottomRule: preset.bottomRuleId, dataset: "exercise-form-rules-2026" },
  };
  const checked = validateConfig(config);
  if (!checked.ok) throw new Error(`preset ${preset.id}: ${checked.errors.join("; ")}`);
  return { config: checked.config, fromSource: ["joint", "side", "startAt", "top", "bottom"], ours: ["minFrames", "minCycleMs", "smoothingMs", "visibilityMin"] };
}

/** A synthetic recording for readers without a video: `n` reps between two
 *  angles on one joint, with a little deterministic noise and a dropout. It
 *  is labeled synthetic wherever it is shown. */
export function syntheticFrames(joint = "knee", n = 5, top = 172, bottom = 82, fps = 30) {
  const dt = 1000 / fps;
  const out = [];
  let t = 0;
  let x = 11;
  const rnd = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648) * 2 - 1;
  const push = (a) => {
    const angle = a === null ? null : round1(a + rnd() * 3);
    out.push({
      t: Math.round(t),
      angles: angle === null ? null : { image: { ...emptyAngles(), [joint]: [angle, round1(angle + rnd())] }, world: null, vis: { ...emptyVis(), [joint]: [0.9, 0.9] } },
    });
    t += dt;
  };
  for (let i = 0; i < 20; i++) push(top);
  for (let r = 0; r < n; r++) {
    const frames = Math.round((1800 + r * 150) / dt);
    for (let i = 0; i < frames; i++) push(bottom + ((top - bottom) * (1 + Math.cos((i / frames) * 2 * Math.PI))) / 2);
    if (r === 2) for (let i = 0; i < 6; i++) push(null); // the person leaves the frame for a moment
  }
  for (let i = 0; i < 20; i++) push(top);
  return out;
}
