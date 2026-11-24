/**
 * The camera-angle simulator on /guides/improve-pose-detection-accuracy:
 * pure geometry, no DOM and no clock, so scripts/camera-angle-sim.test.mjs
 * runs exactly what the browser draws.
 *
 * A stick figure with the 17 COCO keypoints (names checked against the
 * generated keypoint dataset where the section renders) does one of four
 * scripted exercises. A pinhole "phone" orbits it. For every frame the module
 * returns what that phone sees: each keypoint projected to the image, whether
 * it is out of frame, whether the line of sight to it passes through the
 * figure's own body (self-occlusion), and how far the 2D joint angle a rule
 * would measure in the picture is from the true 3D angle (foreshortening).
 *
 * Everything here is geometry of a drawn body. The segment lengths, radii and
 * motions are this file's choices for the drawing, not anthropometric data,
 * and nothing in it says how any pose model behaves: a real model can guess a
 * hidden joint, or miss a visible one.
 *
 * Coordinates are meters. y is up, the floor is y = 0, the figure faces +z
 * (for the push-up, +z is where its head points) and +x is the figure's left.
 */

/* ── small vector kit ───────────────────────────────────────────────────── */
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => {
  const l = len(a);
  return l > 1e-12 ? mul(a, 1 / l) : [0, 0, 0];
};
const lerp = (a, b, t) => add(a, mul(sub(b, a), t));
const DEG = Math.PI / 180;

/* ── the drawn body ─────────────────────────────────────────────────────── */

/** Segment lengths and half-widths, meters. The drawing's own proportions. */
export const BODY = {
  ankleHeight: 0.08,
  shank: 0.43,
  thigh: 0.43,
  hipHalf: 0.1,
  torso: 0.5,
  shoulderHalf: 0.19,
  upperArm: 0.29,
  forearm: 0.26,
  neck: 0.25,
  headRadius: 0.1,
  /** Half the torso block's front-to-back depth. */
  torsoHalfDepth: 0.11,
};

/** Limb thickness for the occlusion test, meters (capsule radii). */
export const LIMB_RADIUS = { upperArm: 0.05, forearm: 0.04, thigh: 0.075, shank: 0.055 };

/**
 * Occlusion and foreshortening thresholds. Stated on the page.
 *  - A shoulder or hip sits inside the torso block, so it is hidden only when
 *    the line of sight crosses more than TORSO_CORNER_M of the block; any
 *    other joint is hidden by more than TORSO_OTHER_M of it.
 *  - Any joint is hidden when the line of sight crosses more than HEAD_M of
 *    the head, or passes through a limb that does not end at that joint.
 *  - A rule angle is flagged foreshortened when the angle measured in the
 *    picture differs from the true 3D angle by more than FORESHORTEN_DEG.
 */
export const THRESHOLDS = {
  TORSO_CORNER_M: 0.16,
  TORSO_OTHER_M: 0.03,
  HEAD_M: 0.03,
  /** The sight line stops this short of the joint, so a limb that merely touches it does not count. */
  JOINT_MARGIN_M: 0.04,
  FORESHORTEN_DEG: 15,
};

/** The 17 COCO keypoints by the keypoint dataset's normalized key, in COCO order. */
export const KEYPOINTS = [
  "nose",
  "lefteye",
  "righteye",
  "leftear",
  "rightear",
  "leftshoulder",
  "rightshoulder",
  "leftelbow",
  "rightelbow",
  "leftwrist",
  "rightwrist",
  "lefthip",
  "righthip",
  "leftknee",
  "rightknee",
  "leftankle",
  "rightankle",
];

/** Lines drawn between keypoints: the stick figure's own, not a model's skeleton. */
export const BONES = [
  ["leftshoulder", "rightshoulder"],
  ["leftshoulder", "leftelbow"],
  ["leftelbow", "leftwrist"],
  ["rightshoulder", "rightelbow"],
  ["rightelbow", "rightwrist"],
  ["leftshoulder", "lefthip"],
  ["rightshoulder", "righthip"],
  ["lefthip", "righthip"],
  ["lefthip", "leftknee"],
  ["leftknee", "leftankle"],
  ["righthip", "rightknee"],
  ["rightknee", "rightankle"],
];

/** Capsules for the occlusion test: [from, to, radius, label]. */
const LIMBS = [
  ["leftshoulder", "leftelbow", LIMB_RADIUS.upperArm, "left upper arm"],
  ["leftelbow", "leftwrist", LIMB_RADIUS.forearm, "left forearm"],
  ["rightshoulder", "rightelbow", LIMB_RADIUS.upperArm, "right upper arm"],
  ["rightelbow", "rightwrist", LIMB_RADIUS.forearm, "right forearm"],
  ["lefthip", "leftknee", LIMB_RADIUS.thigh, "left thigh"],
  ["leftknee", "leftankle", LIMB_RADIUS.shank, "left shin"],
  ["righthip", "rightknee", LIMB_RADIUS.thigh, "right thigh"],
  ["rightknee", "rightankle", LIMB_RADIUS.shank, "right shin"],
];

/**
 * The middle joint of a two-segment limb from its two ends: the knee from hip
 * and ankle, the elbow from shoulder and wrist. `pole` is the direction the
 * joint bends toward.
 */
export function solveTwoBone(root, end, l1, l2, pole) {
  const d0 = len(sub(end, root));
  const d = Math.min(Math.max(d0, Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4);
  const u = d0 > 1e-9 ? norm(sub(end, root)) : [0, -1, 0];
  const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  let v = sub(pole, mul(u, dot(pole, u)));
  if (len(v) < 1e-9) v = Math.abs(u[1]) < 0.9 ? cross(u, [0, 1, 0]) : cross(u, [1, 0, 0]);
  return add(add(root, mul(u, along)), mul(norm(v), h));
}

/** Shoulders, hips and the five face points from the torso's frame. */
function trunk(hipCenter, up, facing) {
  const T = norm(up);
  const F = norm(sub(facing, mul(T, dot(facing, T))));
  const L = cross(T, F); // the figure's left
  const sC = add(hipCenter, mul(T, BODY.torso));
  const head = add(add(sC, mul(T, BODY.neck)), mul(F, 0.02));
  const r = BODY.headRadius;
  const onHead = (dir) => add(head, mul(norm(dir), r));
  return {
    T,
    F,
    L,
    head,
    p: {
      leftshoulder: add(sC, mul(L, BODY.shoulderHalf)),
      rightshoulder: add(sC, mul(L, -BODY.shoulderHalf)),
      lefthip: add(hipCenter, mul(L, BODY.hipHalf)),
      righthip: add(hipCenter, mul(L, -BODY.hipHalf)),
      nose: onHead(F),
      lefteye: onHead(add(add(mul(F, 0.8), mul(T, 0.35)), mul(L, 0.45))),
      righteye: onHead(add(add(mul(F, 0.8), mul(T, 0.35)), mul(L, -0.45))),
      leftear: onHead(add(L, mul(F, -0.1))),
      rightear: onHead(add(mul(L, -1), mul(F, -0.1))),
    },
  };
}

/** 0 at the start of a rep, 1 at the far end of the movement, back to 0. */
export const depthAt = (phase) => (1 - Math.cos(2 * Math.PI * phase)) / 2;

/**
 * The four scripted exercises. Each `pose(s)` takes the movement depth s in
 * [0, 1] and returns every keypoint in 3D plus the torso frame. `rule` is
 * the joint angle a counter for that exercise would read, per side.
 */
export const EXERCISES = {
  squat: {
    id: "squat",
    label: "Squat",
    rule: { name: "knee angle", joint: "knee", sides: { left: ["lefthip", "leftknee", "leftankle"], right: ["righthip", "rightknee", "rightankle"] } },
    target: [0, 0.8, 0],
    pose(s) {
      const hip = [0, 0.93 - 0.43 * s, -0.02 - 0.23 * s];
      const lean = (5 + 35 * s) * DEG;
      const t = trunk(hip, [0, Math.cos(lean), Math.sin(lean)], [0, 0, 1]);
      const p = t.p;
      p.leftankle = [0.15, BODY.ankleHeight, 0];
      p.rightankle = [-0.15, BODY.ankleHeight, 0];
      p.leftknee = solveTwoBone(p.leftankle, p.lefthip, BODY.shank, BODY.thigh, [0.3, 0, 1]);
      p.rightknee = solveTwoBone(p.rightankle, p.righthip, BODY.shank, BODY.thigh, [-0.3, 0, 1]);
      for (const [sh, el, wr] of [["leftshoulder", "leftelbow", "leftwrist"], ["rightshoulder", "rightelbow", "rightwrist"]]) {
        p[wr] = add(p[sh], mul(norm([0, -0.1, 1]), 0.53));
        p[el] = solveTwoBone(p[sh], p[wr], BODY.upperArm, BODY.forearm, [0, -1, 0]);
      }
      return { points: p, head: t.head, frame: t };
    },
  },
  "push-up": {
    id: "push-up",
    label: "Push-up",
    rule: { name: "elbow angle", joint: "elbow", sides: { left: ["leftshoulder", "leftelbow", "leftwrist"], right: ["rightshoulder", "rightelbow", "rightwrist"] } },
    target: [0, 0.3, -0.55],
    pose(s) {
      const sC = [0, 0.56 - 0.24 * s, 0.04 * s];
      const ankleC = [0, 0.1, -1.24];
      const up = norm(sub(sC, ankleC));
      const hip = lerp(ankleC, sC, (BODY.shank + BODY.thigh) / len(sub(sC, ankleC)));
      // Rebuild from the hip so the torso keeps its length; facing the floor.
      const t = trunk(hip, up, [0, -1, 0]);
      const p = t.p;
      p.leftankle = add(ankleC, mul(t.L, BODY.hipHalf));
      p.rightankle = add(ankleC, mul(t.L, -BODY.hipHalf));
      p.leftknee = lerp(p.leftankle, p.lefthip, 0.5);
      p.rightknee = lerp(p.rightankle, p.righthip, 0.5);
      p.leftwrist = [0.24, 0.03, 0];
      p.rightwrist = [-0.24, 0.03, 0];
      p.leftelbow = solveTwoBone(p.leftshoulder, p.leftwrist, BODY.upperArm, BODY.forearm, add(add(mul(t.L, 0.6), mul(t.T, -0.8)), [0, 0.3, 0]));
      p.rightelbow = solveTwoBone(p.rightshoulder, p.rightwrist, BODY.upperArm, BODY.forearm, add(add(mul(t.L, -0.6), mul(t.T, -0.8)), [0, 0.3, 0]));
      return { points: p, head: t.head, frame: t };
    },
  },
  "bent-over-row": {
    id: "bent-over-row",
    label: "Bent-over row",
    rule: { name: "elbow angle", joint: "elbow", sides: { left: ["leftshoulder", "leftelbow", "leftwrist"], right: ["rightshoulder", "rightelbow", "rightwrist"] } },
    target: [0, 0.8, 0.05],
    pose(s) {
      const hip = [0, 0.86, -0.12];
      const hinge = 50 * DEG;
      const t = trunk(hip, [0, Math.cos(hinge), Math.sin(hinge)], [0, 0, 1]);
      const p = t.p;
      p.leftankle = [0.12, BODY.ankleHeight, 0];
      p.rightankle = [-0.12, BODY.ankleHeight, 0];
      p.leftknee = solveTwoBone(p.leftankle, p.lefthip, BODY.shank, BODY.thigh, [0, 0, 1]);
      p.rightknee = solveTwoBone(p.rightankle, p.righthip, BODY.shank, BODY.thigh, [0, 0, 1]);
      for (const [sh, el, wr, side] of [["leftshoulder", "leftelbow", "leftwrist", 1], ["rightshoulder", "rightelbow", "rightwrist", -1]]) {
        const hang = add(p[sh], [0, -0.53, 0]);
        const pulled = add(p[sh], [0, -0.1, -0.25]);
        p[wr] = lerp(hang, pulled, s);
        p[el] = solveTwoBone(p[sh], p[wr], BODY.upperArm, BODY.forearm, add([0, 0.6, -0.8], mul(t.L, 0.3 * side)));
      }
      return { points: p, head: t.head, frame: t };
    },
  },
  lunge: {
    id: "lunge",
    label: "Lunge",
    rule: { name: "knee angle", joint: "knee", sides: { left: ["lefthip", "leftknee", "leftankle"], right: ["righthip", "rightknee", "rightankle"] } },
    target: [0, 0.7, 0],
    pose(s) {
      const hip = [0, 0.79 - 0.34 * s, 0];
      const t = trunk(hip, [0, 1, 0], [0, 0, 1]);
      const p = t.p;
      p.leftankle = [0.1, BODY.ankleHeight, 0.45];
      p.rightankle = [-0.1, 0.14, -0.45];
      p.leftknee = solveTwoBone(p.leftankle, p.lefthip, BODY.shank, BODY.thigh, [0, 0, 1]);
      p.rightknee = solveTwoBone(p.rightankle, p.righthip, BODY.shank, BODY.thigh, [0, -1, 0.3]);
      for (const [sh, el, wr, side] of [["leftshoulder", "leftelbow", "leftwrist", 1], ["rightshoulder", "rightelbow", "rightwrist", -1]]) {
        p[wr] = add(p[sh], [0.06 * side, -0.52, 0.05]);
        p[el] = solveTwoBone(p[sh], p[wr], BODY.upperArm, BODY.forearm, [0, 0, -1]);
      }
      return { points: p, head: t.head, frame: t };
    },
  },
};
export const EXERCISE_IDS = Object.keys(EXERCISES);

/* ── the phone ──────────────────────────────────────────────────────────── */

/** Portrait frame, 3:4, in image pixels. */
export const IMAGE_W = 300;
export const IMAGE_H = 400;

/**
 * The camera for an orbit around the exercise's target point.
 * azimuth 0° is in front of the figure, 90° its left side, 180° behind;
 * elevation is the angle above the target's height; the phone never goes
 * below 5 cm off the floor.
 */
export function orbitCamera({ target, azimuthDeg, elevationDeg, distance, fovDeg }) {
  const az = azimuthDeg * DEG;
  const el = elevationDeg * DEG;
  let pos = add(target, mul([Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], distance));
  if (pos[1] < 0.05) pos = [pos[0], 0.05, pos[2]];
  return lookAt(pos, target, fovDeg, IMAGE_W, IMAGE_H);
}

/** A pinhole camera at `pos` looking at `target`, world-up y, no roll. */
export function lookAt(pos, target, fovDeg, width, height) {
  const f = norm(sub(target, pos));
  let r = cross(f, [0, 1, 0]);
  if (len(r) < 1e-9) r = [1, 0, 0];
  r = norm(r);
  const u = cross(r, f);
  const focal = height / 2 / Math.tan((fovDeg * DEG) / 2);
  return { pos, target, f, r, u, focal, width, height };
}

/** World point → { x, y } in image pixels and its depth along the view, or null behind the camera. */
export function project(cam, p) {
  const d = sub(p, cam.pos);
  const z = dot(d, cam.f);
  if (z <= 0.05) return null;
  return { x: cam.width / 2 + (cam.focal * dot(d, cam.r)) / z, y: cam.height / 2 - (cam.focal * dot(d, cam.u)) / z, depth: z };
}

/* ── occlusion ──────────────────────────────────────────────────────────── */

/** Closest distance between segments p0-p1 and q0-q1. */
function segSegDistance(p0, p1, q0, q1) {
  const d1 = sub(p1, p0);
  const d2 = sub(q1, q0);
  const r = sub(p0, q0);
  const a = dot(d1, d1);
  const e = dot(d2, d2);
  const f = dot(d2, r);
  let s;
  let t;
  if (a <= 1e-12 && e <= 1e-12) return len(r);
  if (a <= 1e-12) {
    s = 0;
    t = Math.min(Math.max(f / e, 0), 1);
  } else {
    const c = dot(d1, r);
    if (e <= 1e-12) {
      t = 0;
      s = Math.min(Math.max(-c / a, 0), 1);
    } else {
      const b = dot(d1, d2);
      const den = a * e - b * b;
      s = den > 1e-12 ? Math.min(Math.max((b * f - c * e) / den, 0), 1) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = Math.min(Math.max(-c / a, 0), 1);
      } else if (t > 1) {
        t = 1;
        s = Math.min(Math.max((b - c) / a, 0), 1);
      }
    }
  }
  return len(sub(add(p0, mul(d1, s)), add(q0, mul(d2, t))));
}

/** Length of segment a→b inside the sphere (center c, radius r). */
function insideSphere(a, b, c, r) {
  const d = sub(b, a);
  const m = sub(a, c);
  const A = dot(d, d);
  const B = 2 * dot(m, d);
  const C = dot(m, m) - r * r;
  const disc = B * B - 4 * A * C;
  if (A < 1e-12 || disc <= 0) return 0;
  const sq = Math.sqrt(disc);
  const t1 = Math.max((-B - sq) / (2 * A), 0);
  const t2 = Math.min((-B + sq) / (2 * A), 1);
  return t2 > t1 ? (t2 - t1) * Math.sqrt(A) : 0;
}

/** The torso block as six outward planes { q, n }. */
function torsoPlanes(p, F) {
  const dd = BODY.torsoHalfDepth;
  const sL = p.leftshoulder;
  const sR = p.rightshoulder;
  const hL = p.lefthip;
  const hR = p.righthip;
  const center = mul(add(add(sL, sR), add(hL, hR)), 0.25);
  const plane = (q, n) => {
    const nn = norm(n);
    return dot(nn, sub(center, q)) > 0 ? { q, n: mul(nn, -1) } : { q, n: nn };
  };
  return [
    plane(add(sL, mul(F, dd)), F),
    plane(add(sL, mul(F, -dd)), mul(F, -1)),
    plane(sL, cross(sub(sR, sL), F)),
    plane(hL, cross(sub(hR, hL), F)),
    plane(sL, cross(sub(hL, sL), F)),
    plane(sR, cross(sub(hR, sR), F)),
  ];
}

/** Length of segment a→b inside the convex block (Cyrus–Beck clipping). */
function insideBlock(a, b, planes) {
  const d = sub(b, a);
  let t0 = 0;
  let t1 = 1;
  for (const { q, n } of planes) {
    const num = dot(n, sub(a, q));
    const den = dot(n, d);
    if (Math.abs(den) < 1e-12) {
      if (num > 0) return 0;
      continue;
    }
    const t = -num / den;
    if (den < 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
    if (t0 > t1) return 0;
  }
  return (t1 - t0) * len(d);
}

const TORSO_CORNERS = new Set(["leftshoulder", "rightshoulder", "lefthip", "righthip"]);

/**
 * What hides keypoint `key` from `camPos`, or null when nothing does.
 * Returns a short label ("torso", "head", "left forearm").
 */
export function occluder(pose, key, camPos, planes = torsoPlanes(pose.points, pose.frame.F)) {
  const J = pose.points[key];
  const toJ = sub(J, camPos);
  const dist = len(toJ);
  const stop = add(camPos, mul(toJ, Math.max(0, 1 - THRESHOLDS.JOINT_MARGIN_M / dist)));
  const torso = insideBlock(camPos, J, planes);
  if (torso > (TORSO_CORNERS.has(key) ? THRESHOLDS.TORSO_CORNER_M : THRESHOLDS.TORSO_OTHER_M)) return "torso";
  if (insideSphere(camPos, J, pose.head, BODY.headRadius) > THRESHOLDS.HEAD_M) return "head";
  for (const [a, b, r, label] of LIMBS) {
    if (a === key || b === key) continue;
    if (segSegDistance(camPos, stop, pose.points[a], pose.points[b]) < r) return label;
  }
  return null;
}

/* ── angles ─────────────────────────────────────────────────────────────── */

/** Angle at b, degrees, between b→a and b→c (works for 2D or 3D arrays). */
export function angleAt(a, b, c) {
  const u = a.map((v, i) => v - b[i]);
  const w = c.map((v, i) => v - b[i]);
  const lu = Math.hypot(...u);
  const lw = Math.hypot(...w);
  if (lu < 1e-9 || lw < 1e-9) return NaN;
  const cos = u.reduce((s, v, i) => s + v * w[i], 0) / (lu * lw);
  return Math.acos(Math.min(1, Math.max(-1, cos))) / DEG;
}

/**
 * Everything the phone sees at one moment.
 * @returns {{
 *   points: Record<string, { world: number[], img: { x: number, y: number, depth: number } | null, inFrame: boolean, hiddenBy: string | null }>,
 *   rule: Record<"left" | "right", { true: number, seen: number, off: number, foreshortened: boolean, hidden: string[] }>,
 *   pose: { points: Record<string, number[]>, head: number[], frame: { T: number[], F: number[], L: number[] } },
 * }}
 */
export function view(exerciseId, phase, cam) {
  const ex = EXERCISES[exerciseId];
  const pose = ex.pose(depthAt(phase));
  const planes = torsoPlanes(pose.points, pose.frame.F);
  const points = {};
  for (const key of KEYPOINTS) {
    const world = pose.points[key];
    const img = project(cam, world);
    const inFrame = !!img && img.x >= 0 && img.x <= cam.width && img.y >= 0 && img.y <= cam.height;
    points[key] = { world, img, inFrame, hiddenBy: occluder(pose, key, cam.pos, planes) };
  }
  const rule = {};
  for (const [side, [a, b, c]] of Object.entries(ex.rule.sides)) {
    const t = angleAt(pose.points[a], pose.points[b], pose.points[c]);
    const ia = points[a].img;
    const ib = points[b].img;
    const ic = points[c].img;
    const seen = ia && ib && ic ? angleAt([ia.x, ia.y], [ib.x, ib.y], [ic.x, ic.y]) : NaN;
    const off = Math.abs(seen - t);
    rule[side] = {
      true: t,
      seen,
      off,
      foreshortened: !(off <= THRESHOLDS.FORESHORTEN_DEG),
      hidden: [a, b, c].filter((k) => points[k].hiddenBy || !points[k].inFrame),
    };
  }
  return { points, rule, pose };
}

/**
 * The rule angle over one whole rep, sampled `n` times: the true range, the
 * range the picture shows, the worst gap between them, and the most
 * keypoints hidden at once. This is what decides whether a threshold counter
 * on this view can see the rep at all.
 */
/**
 * @typedef {{ trueMin: number, trueMax: number, seenMin: number, seenMax: number, worstOff: number, hiddenFrames: number }} SideSummary
 * @returns {{ sides: Record<"left" | "right", SideSummary>, maxHidden: number, samples: number }}
 */
export function repSummary(exerciseId, cam, n = 48) {
  /** @type {Record<string, SideSummary>} */
  const out = {};
  let maxHidden = 0;
  for (let i = 0; i < n; i++) {
    const v = view(exerciseId, i / n, cam);
    maxHidden = Math.max(maxHidden, KEYPOINTS.filter((k) => v.points[k].hiddenBy).length);
    for (const [side, r] of Object.entries(v.rule)) {
      const o = (out[side] ??= { trueMin: Infinity, trueMax: -Infinity, seenMin: Infinity, seenMax: -Infinity, worstOff: 0, hiddenFrames: 0 });
      o.trueMin = Math.min(o.trueMin, r.true);
      o.trueMax = Math.max(o.trueMax, r.true);
      if (Number.isFinite(r.seen)) {
        o.seenMin = Math.min(o.seenMin, r.seen);
        o.seenMax = Math.max(o.seenMax, r.seen);
        o.worstOff = Math.max(o.worstOff, r.off);
      }
      if (r.hidden.length) o.hiddenFrames++;
    }
  }
  return { sides: out, maxHidden, samples: n };
}

/**
 * Would a two-threshold counter see this rep in the picture? True when the
 * seen angle goes above `top` and below `bottom` within one rep.
 */
export function countsOnView(summarySide, top, bottom) {
  return summarySide.seenMax > top && summarySide.seenMin < bottom;
}

/** The phone's presets the page offers. */
export const PRESETS = [
  { id: "front", label: "Front", azimuthDeg: 0, elevationDeg: 5, distance: 3 },
  { id: "side", label: "Side", azimuthDeg: 90, elevationDeg: 5, distance: 3 },
  { id: "diagonal", label: "45° diagonal", azimuthDeg: 45, elevationDeg: 5, distance: 3 },
  { id: "behind", label: "Behind", azimuthDeg: 180, elevationDeg: 5, distance: 3 },
  { id: "floor", label: "Phone on the floor", azimuthDeg: 20, elevationDeg: -10, distance: 2.2 },
  { id: "high", label: "High shelf", azimuthDeg: 30, elevationDeg: 40, distance: 2.5 },
];
export const DEFAULT_VIEW = { exercise: "squat", azimuthDeg: 0, elevationDeg: 5, distance: 3, fovDeg: 60 };
export const LIMITS = { azimuthDeg: [-180, 180], elevationDeg: [-10, 60], distance: [1.5, 6], fovDeg: [40, 90] };
