/**
 * The camera-angle simulator on /guides/improve-pose-detection-accuracy
 * (src/lib/cameraAngleSim.mjs). Geometry checks only: the drawn body keeps
 * its segment lengths, a camera square to a limb's plane sees its true angle,
 * an edge-on camera does not, and the far side of the body is hidden from the
 * side and not from the front.
 *
 *   node --test scripts/camera-angle-sim.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { POSE_SCHEMES } from "../src/data/poseKeypoints.ts";
import { EXERCISES as COUNTER } from "../src/lib/repCounter.mjs";
import {
  BODY,
  EXERCISES,
  EXERCISE_IDS,
  IMAGE_H,
  IMAGE_W,
  KEYPOINTS,
  THRESHOLDS,
  angleAt,
  countsOnView,
  depthAt,
  orbitCamera,
  project,
  repSummary,
  solveTwoBone,
  view,
} from "../src/lib/cameraAngleSim.mjs";

const cam = (ex, azimuthDeg, elevationDeg = 5, distance = 3) =>
  orbitCamera({ target: EXERCISES[ex].target, azimuthDeg, elevationDeg, distance, fovDeg: 60 });
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

test("the keypoints are COCO 17, in the dataset's order", () => {
  const coco = POSE_SCHEMES.find((s) => s.slug === "coco-17");
  assert.deepEqual(KEYPOINTS, coco.points.map((p) => p.key));
});

test("every exercise keeps its limb lengths through the rep", () => {
  const limbs = [
    ["leftknee", "leftankle", BODY.shank],
    ["rightknee", "rightankle", BODY.shank],
    ["lefthip", "leftknee", BODY.thigh],
    ["righthip", "rightknee", BODY.thigh],
    ["leftshoulder", "leftelbow", BODY.upperArm],
    ["rightshoulder", "rightelbow", BODY.upperArm],
    ["leftelbow", "leftwrist", BODY.forearm],
    ["rightelbow", "rightwrist", BODY.forearm],
  ];
  for (const id of EXERCISE_IDS) {
    for (let i = 0; i <= 10; i++) {
      const { points } = EXERCISES[id].pose(i / 10);
      for (const [a, b, l] of limbs) assert.ok(Math.abs(dist(points[a], points[b]) - l) < 1e-3, `${id} ${a}-${b} at ${i / 10}`);
      for (const k of KEYPOINTS) assert.ok(points[k].every(Number.isFinite), `${id} ${k}`);
    }
  }
});

test("two-bone solve, angles and projection", () => {
  const mid = solveTwoBone([0, 0, 0], [0, 1, 0], 0.6, 0.6, [0, 0, 1]);
  assert.ok(Math.abs(dist(mid, [0, 0, 0]) - 0.6) < 1e-9 && mid[2] > 0);
  assert.equal(Math.round(angleAt([1, 0, 0], [0, 0, 0], [0, 1, 0])), 90);
  assert.equal(Math.round(angleAt([1, 0], [0, 0], [-1, 0])), 180);
  const c = cam("squat", 0);
  const centre = project(c, EXERCISES.squat.target);
  assert.ok(Math.abs(centre.x - IMAGE_W / 2) < 1e-6 && Math.abs(centre.y - IMAGE_H / 2) < 1e-6);
  assert.equal(depthAt(0), 0);
  assert.equal(depthAt(0.5), 1);
});

test("a squat seen side-on keeps the near knee angle; seen from the front it does not", () => {
  const side = repSummary("squat", cam("squat", 90)).sides.left;
  assert.ok(side.worstOff < 5, `side view off by ${side.worstOff}`);
  const front = repSummary("squat", cam("squat", 0)).sides.left;
  assert.ok(front.worstOff > THRESHOLDS.FORESHORTEN_DEG, `front view off by ${front.worstOff}`);
  // The /challenge thresholds see the rep from the side and miss it from the front.
  const top = COUNTER.squat.rest.above;
  const bottom = COUNTER.squat.active.below;
  assert.ok(side.trueMax > top && side.trueMin < bottom, "the scripted squat itself crosses both thresholds");
  assert.equal(countsOnView(side, top, bottom), true);
  assert.equal(countsOnView(front, top, bottom), false);
  const v = view("squat", 0.5, cam("squat", 0));
  assert.equal(v.rule.left.foreshortened, true);
});

test("self-occlusion: the far side hides from the side view, nothing hides standing in front", () => {
  const standing = view("lunge", 0, cam("lunge", 0));
  assert.deepEqual(KEYPOINTS.filter((k) => standing.points[k].hiddenBy), []);
  // The squat holds its arms out toward a front camera, in front of the shoulders.
  const arms = view("squat", 0, cam("squat", 0));
  assert.equal(arms.points.leftshoulder.hiddenBy, "left forearm");
  const side = view("squat", 0, cam("squat", 90));
  assert.equal(side.points.leftear.hiddenBy, null);
  assert.equal(side.points.rightear.hiddenBy, "head");
  assert.equal(side.points.leftshoulder.hiddenBy, null);
  const behind = view("squat", 0, cam("squat", 180));
  assert.equal(behind.points.nose.hiddenBy, "head");
  // Push-up seen from in front of the head: the legs are behind the torso.
  const pushup = view("push-up", 0.5, cam("push-up", 0));
  assert.equal(pushup.points.leftankle.hiddenBy, "torso");
});

test("the phone never goes under the floor", () => {
  const c = orbitCamera({ target: [0, 0.3, 0], azimuthDeg: 0, elevationDeg: -60, distance: 6, fovDeg: 60 });
  assert.ok(c.pos[1] >= 0.05);
});
