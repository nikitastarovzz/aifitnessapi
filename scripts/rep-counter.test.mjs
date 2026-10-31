/**
 * The /challenge rep counter, tested through the same module the page runs
 * (src/lib/repCounter.mjs).
 *
 *   node --test scripts/rep-counter.test.mjs     (npm run test:reps)
 *
 * Every sequence is synthetic: angles in degrees at 30 frames per second,
 * shaped like the movement (a cosine between two extremes) with noise and
 * glitches added where a case needs them. They pin the rules the page prints:
 * hysteresis, the start-in-rest requirement, the hold time, the minimum
 * cycle time, missing frames and the both-sides rule for jumping jacks.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EXERCISES,
  LANDMARKS,
  MIN_HOLD_MS,
  VISIBILITY_MIN,
  bucketReps,
  countSequence,
  createCounter,
  exerciseAngle,
  jointAngle,
  paceSquares,
  shareLine,
  step,
} from "../src/lib/repCounter.mjs";

const SQUAT = EXERCISES.squat;
const JACK = EXERCISES["jumping-jack"];
const FPS = 30;
const DT = 1000 / FPS;

/** n reps between `top` and `bottom`, each `periodMs` long, starting at top,
 *  preceded and followed by `holdMs` at the top. */
function cycles(n, top, bottom, periodMs = 2000, holdMs = 500) {
  const out = [];
  let t = 0;
  const push = (a) => {
    out.push([t, a]);
    t += DT;
  };
  for (let i = 0; i < holdMs / DT; i++) push(top);
  for (let r = 0; r < n; r++) {
    const frames = Math.round(periodMs / DT);
    for (let i = 0; i < frames; i++) {
      const phase = (i / frames) * 2 * Math.PI;
      push(bottom + ((top - bottom) * (1 + Math.cos(phase))) / 2);
    }
  }
  for (let i = 0; i < holdMs / DT; i++) push(top);
  return out;
}

/** Deterministic noise, so a failure reproduces. */
function noisy(samples, amp, seed = 7) {
  let x = seed;
  const rnd = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648) * 2 - 1;
  return samples.map(([t, a]) => [t, a + rnd() * amp]);
}

test("jointAngle: right angle, straight line, folded", () => {
  assert.equal(Math.round(jointAngle({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 })), 90);
  assert.equal(Math.round(jointAngle({ x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 })), 180);
  assert.ok(jointAngle({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 0.0001 }) < 0.01);
  assert.equal(jointAngle({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }), null);
  // Near 180 degrees atan2 still resolves a small bend.
  const a = jointAngle({ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0.01 });
  assert.ok(a < 180 && a > 179, `got ${a}`);
});

test("squat: clean reps are counted once each", () => {
  const s = countSequence(SQUAT, cycles(5, 172, 85));
  assert.equal(s.reps, 5);
  assert.equal(s.rejected, 0);
  assert.equal(s.phase, "rest");
});

test("squat: noise of ±6 degrees does not add reps", () => {
  const s = countSequence(SQUAT, noisy(cycles(8, 172, 85), 6));
  assert.equal(s.reps, 8);
});

test("squat: shallow reps that never reach the bottom zone count nothing", () => {
  const s = countSequence(SQUAT, cycles(6, 172, 115));
  assert.equal(s.reps, 0);
  assert.equal(s.phase, "rest");
});

test("squat: jitter across the bottom threshold is one rep, not several", () => {
  const seq = cycles(0, 172, 172, 2000, 500);
  let t = seq.at(-1)[0] + DT;
  // Descend, then hover at the bottom boundary, crossing it back and forth.
  for (let a = 170; a > 100; a -= 5) seq.push([(t += DT), a]);
  for (let i = 0; i < 60; i++) seq.push([(t += DT), i % 2 ? 97 : 103]);
  for (let a = 100; a <= 172; a += 5) seq.push([(t += DT), a]);
  for (let i = 0; i < 15; i++) seq.push([(t += DT), 172]);
  assert.equal(countSequence(SQUAT, seq).reps, 1);
});

test("squat: jitter across the top threshold is one rep, not several", () => {
  const seq = cycles(1, 172, 85);
  let t = seq.at(-1)[0];
  for (let i = 0; i < 60; i++) seq.push([(t += DT), i % 2 ? 157 : 163]);
  assert.equal(countSequence(SQUAT, seq).reps, 1);
});

test("squat: starting at the bottom is not half a rep", () => {
  const seq = [];
  let t = 0;
  for (let i = 0; i < 20; i++) seq.push([(t += DT), 80]); // already squatting
  for (let a = 80; a <= 172; a += 4) seq.push([(t += DT), a]); // stand up
  for (let i = 0; i < 15; i++) seq.push([(t += DT), 172]);
  const s = countSequence(SQUAT, seq);
  assert.equal(s.reps, 0);
  assert.equal(s.phase, "rest");
});

test("squat: a one-frame glitch into the bottom zone is ignored", () => {
  const seq = cycles(0, 172, 172, 2000, 1000);
  const mid = Math.floor(seq.length / 2);
  seq[mid] = [seq[mid][0], 60];
  const s = countSequence(SQUAT, seq);
  assert.equal(s.reps, 0);
  assert.equal(s.phase, "rest");
});

test("hold: a zone must last MIN_HOLD_MS of frames (two at 30 fps, one at 15 fps)", () => {
  assert.equal(MIN_HOLD_MS, 60);
  let s = createCounter(SQUAT);
  s = step(s, 175, 0);
  assert.equal(s.phase, "waiting");
  s = step(s, 175, DT);
  assert.equal(s.phase, "rest");
  assert.equal(s.event, "phase");
  let slow = createCounter(SQUAT);
  slow = step(slow, 175, 0);
  slow = step(slow, 175, 1000 / 15);
  assert.equal(slow.phase, "rest");
});

test("frame rate: the same reps count at 30, 15 and 10 fps", () => {
  for (const fps of [30, 15, 10]) {
    const dt = 1000 / fps;
    const seq = [];
    let t = 0;
    for (let i = 0; i < 10; i++) seq.push([(t += dt), 172]);
    for (let r = 0; r < 8; r++) {
      const f = Math.round(1000 / dt);
      for (let i = 0; i < f; i++) seq.push([(t += dt), 85 + (87 * (1 + Math.cos((i / f) * 2 * Math.PI))) / 2]);
    }
    for (let i = 0; i < 10; i++) seq.push([(t += dt), 172]);
    assert.equal(countSequence(SQUAT, seq).reps, 8, `${fps} fps`);
  }
});

test("squat: missing frames mid-rep hold the phase and the rep still counts", () => {
  const seq = cycles(3, 172, 85).map(([t, a], i) => [t, i % 7 === 3 ? null : a]);
  const s = countSequence(SQUAT, seq);
  assert.equal(s.reps, 3);
  assert.ok(s.missing > 0);
});

test("squat: a body that leaves the frame entirely counts nothing more", () => {
  const seq = cycles(2, 172, 85);
  let t = seq.at(-1)[0];
  for (let i = 0; i < 120; i++) seq.push([(t += DT), null]);
  assert.equal(countSequence(SQUAT, seq).reps, 2);
});

test("cycles faster than minCycleMs are rejected, not counted", () => {
  // 0.5 s squats are faster than the 0.6 s floor.
  const s = countSequence(SQUAT, cycles(6, 172, 60, 500));
  assert.ok(s.rejected > 0, "some fast cycles rejected");
  assert.ok(s.reps < 6, `counted ${s.reps}`);
  // Every counted rep is at least minCycleMs after the previous one.
  for (let i = 1; i < s.repTimes.length; i++) assert.ok(s.repTimes[i] - s.repTimes[i - 1] >= SQUAT.minCycleMs);
});

test("jumping jacks: arm-angle cycles from 20 to 170 degrees", () => {
  const s = countSequence(JACK, noisy(cycles(10, 20, 170, 700, 300), 5));
  assert.equal(s.reps, 10);
});

test("jumping jacks: arms only to shoulder height count nothing", () => {
  const s = countSequence(JACK, cycles(6, 20, 100, 700));
  assert.equal(s.reps, 0);
});

/** A frontal pose in image coordinates (y down), arms at `armDeg` from the
 *  torso, standing straight. */
function pose(armDeg, { hideLeftArm = false } = {}) {
  const lm = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, z: 0, visibility: 0.99 }));
  const set = (i, x, y) => (lm[i] = { x, y, z: 0, visibility: 0.99 });
  set(LANDMARKS.LEFT_SHOULDER, 0.6, 0.3);
  set(LANDMARKS.RIGHT_SHOULDER, 0.4, 0.3);
  set(LANDMARKS.LEFT_HIP, 0.6, 0.55);
  set(LANDMARKS.RIGHT_HIP, 0.4, 0.55);
  set(LANDMARKS.LEFT_KNEE, 0.6, 0.72);
  set(LANDMARKS.RIGHT_KNEE, 0.4, 0.72);
  set(LANDMARKS.LEFT_ANKLE, 0.6, 0.9);
  set(LANDMARKS.RIGHT_ANKLE, 0.4, 0.9);
  // Shoulder to hip points straight down; rotate the arm outward by armDeg.
  const r = (armDeg * Math.PI) / 180;
  set(LANDMARKS.LEFT_WRIST, 0.6 + 0.2 * Math.sin(r), 0.3 + 0.2 * Math.cos(r));
  set(LANDMARKS.RIGHT_WRIST, 0.4 - 0.2 * Math.sin(r), 0.3 + 0.2 * Math.cos(r));
  if (hideLeftArm) lm[LANDMARKS.LEFT_WRIST].visibility = VISIBILITY_MIN - 0.1;
  return lm;
}

test("exerciseAngle: reads the arm angle from both sides", () => {
  assert.equal(Math.round(exerciseAngle(JACK, pose(30))), 30);
  assert.equal(Math.round(exerciseAngle(JACK, pose(160))), 160);
});

test("exerciseAngle: jumping jacks need both arms visible", () => {
  assert.equal(exerciseAngle(JACK, pose(160, { hideLeftArm: true })), null);
});

test("exerciseAngle: a squat reads from one visible leg", () => {
  const lm = pose(20);
  lm[LANDMARKS.LEFT_ANKLE].visibility = 0.1;
  assert.equal(Math.round(exerciseAngle(SQUAT, lm)), 180);
  assert.equal(exerciseAngle(SQUAT, null), null);
});

test("exerciseAngle: world landmarks are used when given", () => {
  const image = pose(20);
  const world = image.map((p) => ({ ...p }));
  // Bend the left knee to 90 degrees in world space only.
  world[LANDMARKS.LEFT_ANKLE] = { x: world[LANDMARKS.LEFT_KNEE].x, y: world[LANDMARKS.LEFT_KNEE].y, z: 0.3, visibility: 0.99 };
  world[LANDMARKS.RIGHT_ANKLE] = { x: world[LANDMARKS.RIGHT_KNEE].x, y: world[LANDMARKS.RIGHT_KNEE].y, z: 0.3, visibility: 0.99 };
  assert.equal(Math.round(exerciseAngle(SQUAT, image, world)), 90);
});

test("step does not modify its input state", () => {
  const s0 = createCounter(SQUAT);
  const frozen = JSON.stringify(s0);
  step(s0, 175, 0);
  assert.equal(JSON.stringify(s0), frozen);
});

test("buckets, pace squares and the share line", () => {
  const b = bucketReps([500, 1000, 4000, 6000, 12000, 29999, 30000, 31000], 0);
  assert.deepEqual(b, [3, 1, 1, 0, 0, 2]);
  assert.equal(paceSquares([4, 3, 2, 1, 0, 4]), "🟩🟩🟨🟥⬛🟩");
  assert.equal(paceSquares([0, 0, 0, 0, 0, 0]), "⬛⬛⬛⬛⬛⬛");
  const line = shareLine({ exercise: SQUAT, reps: 1, buckets: [1, 0, 0, 0, 0, 0] });
  assert.equal(line, "🦵 30-second squat challenge: 1 squat 🟩⬛⬛⬛⬛⬛ aifitnessapi.com/challenge");
  assert.ok(!line.includes("\n"));
  assert.match(shareLine({ exercise: JACK, reps: 12, buckets: [2, 2, 2, 2, 2, 2] }), /: 12 jumping jacks 🟩{6} /u);
});
