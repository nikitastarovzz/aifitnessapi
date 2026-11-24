/**
 * Challenge 2.0 on /challenge: push-ups and lunges on the rep counter, the
 * plank hold timer, and the "Beat my score" link, all through the module the
 * page runs (src/lib/repCounter.mjs).
 *
 *   node --test scripts/challenge-exercises.test.mjs
 *
 * Every sequence is synthetic (angles or poses at 30 frames per second).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BEAT_MAX,
  CHALLENGES,
  EXERCISES,
  LANDMARKS as L,
  PLANK,
  beatLine,
  challengeLink,
  countSequence,
  createHold,
  heldSeconds,
  parseChallengeLink,
  plankReading,
  plankShareLine,
  stepHold,
} from "../src/lib/repCounter.mjs";
import { FORM_RULES } from "../src/data/formRules.ts";

const DT = 1000 / 30;
const PUSHUP = EXERCISES["push-up"];
const LUNGE = EXERCISES.lunge;

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
    for (let i = 0; i < frames; i++) push(bottom + ((top - bottom) * (1 + Math.cos((i / frames) * 2 * Math.PI))) / 2);
  }
  for (let i = 0; i < holdMs / DT; i++) push(top);
  return out;
}

test("push-up zones are Ultralytics' defaults as the form-rules dataset records them", () => {
  const top = FORM_RULES.find((r) => r.id === "push-up-elbow-top-ultralytics");
  const bottom = FORM_RULES.find((r) => r.id === "push-up-elbow-bottom-ultralytics");
  assert.equal(top.comparison, ">");
  assert.equal(top.value, PUSHUP.rest.above);
  assert.equal(bottom.comparison, "<");
  assert.equal(bottom.value, PUSHUP.active.below);
  assert.equal(top.quote, "up_angle: float = 145.0");
  assert.equal(bottom.quote, "down_angle: float = 90.0");
  // The defaults stay defaults only while the dataset states no number.
  assert.equal(FORM_RULES.find((r) => r.id === "lunge-rep-count-null").value, null);
  assert.equal(FORM_RULES.find((r) => r.id === "plank-hold-null").value, null);
  const range = FORM_RULES.find((r) => r.id === "lunge-knee-bottom-range-exercise-correction");
  assert.ok(LUNGE.active.below > range.value && LUNGE.active.below <= range.value2);
});

test("push-ups and lunges count full cycles and ignore shallow ones", () => {
  assert.equal(countSequence(PUSHUP, cycles(6, 170, 70)).reps, 6);
  assert.equal(countSequence(PUSHUP, cycles(6, 170, 95)).reps, 0, "never below 90° is not a push-up");
  assert.equal(countSequence(PUSHUP, cycles(6, 140, 60)).reps, 0, "never back above 145° is not a push-up");
  assert.equal(countSequence(LUNGE, cycles(5, 175, 90, 2200)).reps, 5);
  assert.equal(countSequence(LUNGE, cycles(5, 175, 120, 2200)).reps, 0, "a half lunge is not counted");
  const fast = countSequence(PUSHUP, cycles(5, 170, 70, 400));
  assert.equal(fast.reps + fast.rejected <= 5, true);
  assert.ok(fast.rejected > 0, "cycles under minCycleMs are rejected");
});

/** A side-on pose: shoulders, hips and ankles on a line at `tiltDeg` from level, hips dropped by `sag`. */
function pose({ tiltDeg = 0, sag = 0, vis = 0.9 } = {}) {
  const pts = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, z: 0, visibility: 0.1 }));
  const r = (tiltDeg * Math.PI) / 180;
  const at = (d) => ({ x: 0.2 + d * Math.cos(r), y: 0.5 + d * Math.sin(r), z: 0, visibility: vis });
  for (const [s, h, a] of [
    [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_ANKLE],
    [L.RIGHT_SHOULDER, L.RIGHT_HIP, L.RIGHT_ANKLE],
  ]) {
    pts[s] = at(0);
    pts[h] = { ...at(0.3), y: at(0.3).y + sag };
    pts[a] = at(0.6);
  }
  return pts;
}

test("plankReading: straight and level passes; sagging, piked or standing does not", () => {
  const flat = plankReading(pose(), null, 1);
  assert.ok(flat.ok, JSON.stringify(flat));
  assert.ok(Math.abs(flat.line - 180) < 1 && flat.tilt < 1);
  assert.equal(plankReading(pose({ tiltDeg: 15 }), null, 1).ok, true, "a slight incline is still a plank");
  assert.equal(plankReading(pose({ sag: 0.08 }), null, 1).ok, false, "hips sagging bend the body line");
  assert.equal(plankReading(pose({ sag: -0.08 }), null, 1).ok, false, "hips piked up bend it too");
  assert.equal(plankReading(pose({ tiltDeg: 85 }), null, 1).ok, false, "standing straight is not level");
  assert.deepEqual(plankReading(pose({ vis: 0.2 }), null, 1), { line: null, tilt: null, ok: null }, "nothing visible, no reading");
  assert.deepEqual(plankReading(null, null, 1), { line: null, tilt: null, ok: null });
});

function runHold(frames, start = 0) {
  let s = createHold(start);
  let t = start;
  for (const ok of frames) {
    s = stepHold(s, ok, t);
    t += DT;
    if (s.phase === "over") break;
  }
  return s;
}
const repeat = (v, ms) => Array.from({ length: Math.round(ms / DT) }, () => v);

test("the plank timer starts on a held position, pauses on short breaks and ends after the grace time", () => {
  const steady = runHold([...repeat(true, 10_000), ...repeat(false, PLANK.GRACE_MS + 200)]);
  assert.equal(steady.phase, "over");
  assert.ok(heldSeconds(steady) >= 9 && heldSeconds(steady) <= 10, `${heldSeconds(steady)} s`);
  assert.equal(steady.breaks, 1);

  const shortBreak = runHold([...repeat(true, 5000), ...repeat(false, 800), ...repeat(true, 5000), ...repeat(false, 2000)]);
  assert.equal(shortBreak.phase, "over");
  assert.ok(heldSeconds(shortBreak) >= 9 && heldSeconds(shortBreak) <= 10, "the break is not counted, the rest is");
  assert.equal(shortBreak.breaks, 2);

  const flicker = runHold([...repeat(true, 200), ...repeat(false, 200), ...repeat(true, 200), ...repeat(false, 200)]);
  assert.equal(flicker.phase, "waiting", "under ENTER_MS of position never starts the clock");
  assert.equal(flicker.heldMs, 0);

  const never = runHold(repeat(false, PLANK.START_WINDOW_MS + 500));
  assert.equal(never.phase, "over");
  assert.equal(heldSeconds(never), 0, "no position within the window ends at 0");

  const noReading = runHold([...repeat(true, 3000), ...repeat(null, PLANK.GRACE_MS + 100)]);
  assert.equal(noReading.phase, "over", "no reading counts as out of position");

  const capped = runHold(repeat(true, (PLANK.MAX_SECONDS + 5) * 1000));
  assert.equal(capped.phase, "over");
  assert.equal(heldSeconds(capped), PLANK.MAX_SECONDS);

  const s0 = createHold(0);
  const frozen = JSON.stringify(s0);
  stepHold(s0, true, 0);
  assert.equal(JSON.stringify(s0), frozen, "stepHold does not modify its input");
});

test("a Beat my score link carries a known exercise and a whole number, nothing else", () => {
  assert.deepEqual(parseChallengeLink("?ex=pushups&beat=17"), { id: "push-up", slug: "pushups", kind: "reps", beat: 17 });
  assert.deepEqual(parseChallengeLink("ex=plank&beat=42"), { id: "plank", slug: "plank", kind: "hold", beat: 42 });
  assert.deepEqual(parseChallengeLink("?ex=lunges"), { id: "lunge", slug: "lunges", kind: "reps", beat: null });
  for (const c of CHALLENGES) assert.equal(parseChallengeLink(`?ex=${c.slug}&beat=3`).id, c.id);
  const noBeat = ["?ex=squats&beat=0", "?ex=squats&beat=-3", "?ex=squats&beat=1.5", "?ex=squats&beat=017", "?ex=squats&beat=abc", "?ex=squats&beat=1e3", `?ex=squats&beat=${BEAT_MAX.reps + 1}`, `?ex=plank&beat=${BEAT_MAX.hold + 1}`, "?ex=squats&beat=5&beat=6", "?ex=squats&beat=%3Cb%3E"];
  for (const q of noBeat) assert.equal(parseChallengeLink(q)?.beat, null, q);
  for (const q of ["", "?beat=17", "?ex=burpees&beat=17", "?ex=PUSHUPS&beat=17", "?ex=push-up&beat=17", "?ex=pushups&ex=squats&beat=1", "?ex=%3Cscript%3E", null, 42]) {
    assert.equal(parseChallengeLink(q), null, String(q));
  }
});

test("the share link, its line and the banner", () => {
  assert.equal(challengeLink("push-up", 17), "https://aifitnessapi.com/challenge?ex=pushups&beat=17");
  assert.equal(challengeLink("plank", 42), "https://aifitnessapi.com/challenge?ex=plank&beat=42");
  assert.equal(challengeLink("squat", 0), "https://aifitnessapi.com/challenge?ex=squats", "a zero carries no score");
  assert.equal(challengeLink("jumping-jack", 999), `https://aifitnessapi.com/challenge?ex=jumping-jacks&beat=${BEAT_MAX.reps}`);
  assert.throws(() => challengeLink("burpee", 3));
  for (const c of CHALLENGES) {
    const back = parseChallengeLink(new URL(challengeLink(c.id, 9)).search);
    assert.equal(back.id, c.id);
    assert.equal(back.beat, 9);
  }
  assert.equal(beatLine("push-up", 17), "Beat 17 push-ups");
  assert.equal(beatLine("lunge", 1), "Beat 1 lunge");
  assert.equal(beatLine("plank", 42), "Beat a 42-second plank");
  assert.equal(plankShareLine({ seconds: 42, url: "aifitnessapi.com/challenge?ex=plank&beat=42" }), "🧱 Plank challenge: held 42 seconds aifitnessapi.com/challenge?ex=plank&beat=42");
});
