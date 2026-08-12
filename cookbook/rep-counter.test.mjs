/**
 * rep-counter.test.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   The test contract for rep-counter.mjs. A clean sinusoid counts exactly N.
 *   Jitter parked on a threshold counts once, because of the hysteresis gap.
 *   A rep abandoned halfway counts zero. And the scorer catches the
 *   compensating-error case that a final-count assertion cannot: one miss plus
 *   one phantom gives the right total and a precision and recall both below 1.
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/motion/how-rep-counting-works
 *   https://aifitnessapi.com/test/rep-counting
 *   https://aifitnessapi.com/cookbook/rep-counter
 *
 * No camera and no network: every case is a synthetic angle stream with
 * explicit timestamps. Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  PHASE,
  assertToleranceIsMeaningful,
  compareToBaseline,
  createEmaSmoother,
  createRepCounter,
  scoreCorpus,
  scoreRepEvents,
  totalsAgreeAntiPattern,
} from "./rep-counter.mjs";

/** Elbow-angle thresholds for a curl: 180 is a straight arm, 40 is fully curled. */
const CURL = { enterUpBelow: 60, enterDownAbove: 140 };

/** Frames from a list of angles at a fixed frame interval. */
function frames(angles, { fps = 30, startT = 0 } = {}) {
  const step = 1000 / fps;
  return angles.map((angle, i) => ({ t: startT + i * step, angle }));
}

/** N clean reps as a cosine between 40 and 170 degrees. */
function sinusoidReps({ reps, fps = 30, periodFrames = 60 }) {
  const mid = 105;
  const amp = 65;
  const out = [];
  for (let k = 0; k <= reps * periodFrames; k++) {
    out.push({
      t: (k * 1000) / fps,
      angle: mid + amp * Math.cos((2 * Math.PI * k) / periodFrames),
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// The state machine
// ---------------------------------------------------------------------------

test("a single threshold is refused at construction time", () => {
  assert.throws(() => createRepCounter({ enterUpBelow: 100, enterDownAbove: 100 }), RangeError);
  assert.throws(() => createRepCounter({ enterUpBelow: 140, enterDownAbove: 60 }), RangeError);
  assert.throws(() => createEmaSmoother({ alpha: 0 }), RangeError);
  assert.throws(() => createEmaSmoother({ alpha: 1.5 }), RangeError);
});

test("a clean sinusoid counts exactly N", () => {
  for (const reps of [1, 5, 8, 12]) {
    const counter = createRepCounter({ ...CURL, alpha: 0.5, minPhaseMs: 250 });
    counter.pushAll(sinusoidReps({ reps }));
    assert.equal(counter.count, reps, `${reps} clean reps`);
    assert.equal(counter.rejected.length, 0);
    assert.equal(counter.phase, PHASE.DOWN, "the set ends back at the extended position");

    // Every rep lands near the top of its cycle: k = reps * 60 frames, 2s apart.
    const spacing = counter.repTimestamps().slice(1).map((t, i) => t - counter.repTimestamps()[i]);
    for (const gap of spacing) assert.ok(Math.abs(gap - 2000) < 100, `rep spacing ${gap}ms`);
  }
});

test("jitter parked on a threshold counts once, not many times", () => {
  // alpha = 1 disables smoothing, so the raw jitter reaches the state machine
  // and hysteresis is the only thing standing between it and a double-count.
  const counter = createRepCounter({ ...CURL, alpha: 1, minPhaseMs: 0 });

  const stream = [
    170, 170, 170, 170, // extended, resting
    150, 120, 90, 70, 58, // descend past the low threshold -> up phase
    62, 57, 63, 55, 64, 58, 61, 59, 62, 56, // eight seconds of noise sitting on 60
    90, 120, 150, 170, // extend -> the one and only rep
    138, 142, 137, 145, 139, 143, // now noise sitting on the HIGH threshold
    170, 170,
  ];
  counter.pushAll(frames(stream));

  assert.equal(counter.count, 1, "one deliberate swing, one rep");
  assert.equal(counter.rejected.length, 0);
  assert.equal(counter.phase, PHASE.DOWN);

  // Nine separate crossings of 60 and six of 140 produced exactly one event.
  const crossings60 = stream.filter((a, i) => i > 0 && (stream[i - 1] < 60) !== (a < 60)).length;
  const crossings140 = stream.filter((a, i) => i > 0 && (stream[i - 1] > 140) !== (a > 140)).length;
  assert.ok(crossings60 >= 8 && crossings140 >= 6, "the raw signal really does cross a lot");
});

test("an abandoned half-rep counts zero", () => {
  // Descends most of the way into the curl, changes their mind, extends again.
  // The signal traces most of a cycle and never reaches the low threshold.
  const aborted = createRepCounter({ ...CURL, alpha: 0.6, minPhaseMs: 200 });
  aborted.pushAll(frames([170, 170, 155, 130, 105, 88, 75, 72, 74, 90, 120, 150, 170, 170]));
  assert.equal(aborted.count, 0);
  assert.equal(aborted.phase, PHASE.DOWN, "never left the down phase");

  // The mirror case: goes all the way down, never fully re-extends. Also zero,
  // and the counter is honest that it is still mid-rep.
  const unfinished = createRepCounter({ ...CURL, alpha: 0.6, minPhaseMs: 200 });
  unfinished.pushAll(frames([170, 170, 140, 100, 60, 45, 42, 60, 90, 115, 128, 130, 129]));
  assert.equal(unfinished.count, 0);
  assert.equal(unfinished.phase, PHASE.UP, "still waiting for the return crossing");
});

test("gates reject a twitch rather than delaying it into a count", () => {
  // A spike: full range travelled in 66ms. Blocking the transition would still
  // count the rep 250ms later, so the gate rejects the cycle outright.
  const counter = createRepCounter({ ...CURL, alpha: 1, minPhaseMs: 400 });
  const rest = new Array(20).fill(170); // 633ms at rest, long enough to open a cycle
  counter.pushAll(frames([...rest, 50, ...new Array(10).fill(170)]));
  assert.equal(counter.count, 0);
  assert.deepEqual(
    counter.rejected.map((r) => r.reason),
    ["phase_too_short"],
  );
  assert.ok(counter.rejected[0].upPhaseMs < 400);
});

test("low-confidence frames are skipped, not smoothed in", () => {
  const counter = createRepCounter({ ...CURL, alpha: 0.5, minPhaseMs: 250, minConfidence: 0.5 });
  const clean = sinusoidReps({ reps: 3 });
  // Occlusion: every seventh frame comes back as a garbage angle at low confidence.
  const occluded = clean.map((f, i) =>
    i % 7 === 3 ? { ...f, angle: 12, confidence: 0.1 } : { ...f, confidence: 0.9 },
  );
  counter.pushAll(occluded);
  assert.equal(counter.count, 3, "the garbage angles never reach the smoother");
  assert.ok(counter.skippedFrames > 20);
});

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

test("the scorer catches the compensating-error case a total-count assertion cannot", () => {
  const truth = [1000, 2000, 3000, 4000];
  const predicted = [1010, 1990, 4020, 7000]; // rep 3 missed, phantom at 7000

  // This is the assertion the /test/rep-counting page tells you to stop writing.
  assert.equal(totalsAgreeAntiPattern(truth, predicted), true, "the totals agree — and it is wrong twice");

  const s = scoreRepEvents(truth, predicted, { toleranceMs: 200 });
  assert.equal(s.tp, 3);
  assert.equal(s.fp, 1);
  assert.equal(s.fn, 1);
  assert.equal(s.precision, 0.75);
  assert.equal(s.recall, 0.75);
  assert.ok(s.precision < 1 && s.recall < 1);
  assert.deepEqual(s.falseNegatives, [3000]);
  assert.deepEqual(s.falsePositives, [7000]);
});

test("matching is one-to-one and greedy, so a double-count is a false positive", () => {
  // The counter fired twice for one rep. Only the nearer prediction matches.
  const s = scoreRepEvents([1000, 3000], [980, 1060, 2990], { toleranceMs: 100 });
  assert.equal(s.tp, 2);
  assert.equal(s.fp, 1);
  assert.equal(s.fn, 0);
  assert.equal(s.precision, 2 / 3);
  assert.equal(s.recall, 1);
  assert.deepEqual(s.falsePositives, [1060]);
  assert.deepEqual(
    s.matches.map((m) => [m.truth, m.predicted]),
    [
      [1000, 980],
      [3000, 2990],
    ],
  );
});

test("a tolerance window wider than half the closest rep gap is refused", () => {
  const fastClip = [0, 700, 1400, 2100]; // 700ms apart: a fast set
  assert.equal(assertToleranceIsMeaningful(fastClip, 300), true);
  assert.throws(() => assertToleranceIsMeaningful(fastClip, 400), RangeError);
  assert.throws(() => scoreRepEvents(fastClip, [0, 700], { toleranceMs: 400 }), RangeError);

  // At the legal maximum a single prediction can still only ever satisfy one
  // label, which is the property the guard is protecting.
  const nearFirst = scoreRepEvents([0, 700], [340], { toleranceMs: 349 });
  assert.equal(nearFirst.tp, 1);
  assert.equal(nearFirst.fn, 1);
  assert.equal(nearFirst.fp, 0);
  assert.deepEqual(nearFirst.falseNegatives, [700]);

  const deadCentre = scoreRepEvents([0, 700], [350], { toleranceMs: 349 });
  assert.equal(deadCentre.tp, 0, "exactly between two labels, it matches neither");
  assert.equal(deadCentre.fp, 1);
  assert.equal(deadCentre.fn, 2);
});

test("an empty prediction set scores recall 0 and precision null, not 100%", () => {
  const s = scoreRepEvents([1000, 2000], [], { toleranceMs: 100 });
  assert.equal(s.recall, 0);
  assert.equal(s.precision, null, "no evidence is not the same as perfect");

  const negativeClip = scoreRepEvents([], [], { toleranceMs: 100 });
  assert.equal(negativeClip.precision, null);
  assert.equal(negativeClip.recall, null);
  assert.equal(negativeClip.fp, 0, "a clip of someone not exercising: zero is the right answer");
});

test("the corpus gate fails on a per-clip move the aggregate hides", () => {
  const toleranceMs = 250;
  const baseline = scoreCorpus(
    [
      { clip: "pushup_offframe_wrists_011", truth: [1000, 2000, 3000], predicted: [1000, 2000, 3000] },
      { clip: "bench_partner_walks_through_004", truth: [1000, 2000], predicted: [1000, 2000] },
      { clip: "curl_tempo_fatigue_027", truth: [1000, 2000], predicted: [1000, 2000] },
    ],
    { toleranceMs },
  );

  // A threshold tweak: one clip loses a rep, another gains a phantom.
  const after = scoreCorpus(
    [
      { clip: "pushup_offframe_wrists_011", truth: [1000, 2000, 3000], predicted: [1000, 2000] },
      { clip: "bench_partner_walks_through_004", truth: [1000, 2000], predicted: [1000, 2000, 5000] },
      { clip: "curl_tempo_fatigue_027", truth: [1000, 2000], predicted: [1000, 2000] },
    ],
    { toleranceMs },
  );

  // Pooled over the corpus, seven predicted and seven true reps either way.
  const pool = (r) => Object.values(r).reduce((n, c) => n + c.tp + c.fp, 0);
  assert.equal(pool(baseline), pool(after), "the aggregate did not move");

  const gate = compareToBaseline(after, baseline);
  assert.equal(gate.ok, false);
  assert.equal(gate.changed.length, 2);
  assert.deepEqual(
    gate.changed.map((c) => [c.clip, c.delta]),
    [
      ["pushup_offframe_wrists_011", { tp: -1, fp: 0, fn: 1 }],
      ["bench_partner_walks_through_004", { tp: 0, fp: 1, fn: 0 }],
    ],
  );
  assert.ok(gate.changed.every((c) => c.regressed));

  // An improvement fails the gate too: accept it by updating the baseline.
  const improved = compareToBaseline(baseline, after);
  assert.equal(improved.ok, false);
  assert.ok(improved.changed.every((c) => !c.regressed));

  // A clip that vanished from the run is a failure, not a silent pass.
  assert.deepEqual(compareToBaseline({}, baseline).missing.length, 3);
});

test("end to end: label at the moment the counter is contracted to increment", () => {
  const counter = createRepCounter({ ...CURL, alpha: 0.5, minPhaseMs: 250 });
  counter.pushAll(sinusoidReps({ reps: 6 }));
  const predicted = counter.repTimestamps();
  assert.equal(predicted.length, 6);

  // This state machine increments on the return crossing of enterDownAbove,
  // not at the peak. For the synthetic cosine that crossing is analytic.
  const crossingFrame = 60 - (60 / (2 * Math.PI)) * Math.acos((140 - 105) / 65);
  const truth = [1, 2, 3, 4, 5, 6].map((n) => ((60 * (n - 1) + crossingFrame) * 1000) / 30);

  const s = scoreRepEvents(truth, predicted, { toleranceMs: 150 });
  assert.equal(s.tp, 6);
  assert.equal(s.fp, 0);
  assert.equal(s.fn, 0);
  assert.equal(s.precision, 1);
  assert.equal(s.recall, 1);
  // EMA lag is systematic, not noise: every match is late by the same ~52ms.
  assert.ok(s.matches.every((m) => m.errorMs > 0 && m.errorMs < 150));

  // The convention trap: label the peak instead and a perfect counter scores 0.
  const wrongConvention = scoreRepEvents(
    [1, 2, 3, 4, 5, 6].map((n) => n * 2000),
    predicted,
    { toleranceMs: 150 },
  );
  assert.equal(wrongConvention.tp, 0);
  assert.equal(wrongConvention.precision, 0);
  assert.equal(wrongConvention.recall, 0);
});
