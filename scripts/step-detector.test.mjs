/**
 * The /tools/step-lab detector, tested through the same module the page
 * imports (src/lib/stepDetector.mjs), over synthetic traces only.
 *
 *   node --test scripts/step-detector.test.mjs     (npm run test:step-lab)
 *
 * The traces are generated, seeded and labelled synthetic; nothing here is a
 * recording of a person walking, and no assertion is a claim about how well
 * this detector counts real steps. What is pinned is behaviour the page
 * describes: a clean walk counts exactly, jitter above the cutoff and a phone
 * at rest count nothing, the minimum interval merges a double impact, the
 * threshold drops soft steps, and the replay trace the page ships has the
 * ground truth it claims.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PARAMS,
  G,
  REPLAY_TRUE_STEPS,
  createStepDetector,
  detectSteps,
  magnitude,
  replayTrace,
  shareText,
  synthesize,
  walkEvents,
} from "../src/lib/stepDetector.mjs";

test("magnitude is orientation-free", () => {
  assert.equal(magnitude(0, 0, 9.8).toFixed(3), magnitude(9.8, 0, 0).toFixed(3));
  assert.equal(magnitude(3, 4, 0), 5);
});

test("regular walk: 50 steps at 1.8 per second count 50", () => {
  for (const seed of [1, 2, 3, 4, 5]) {
    const trace = synthesize({ durationMs: 30000, events: walkEvents({ steps: 50, seed }), seed: seed + 100 });
    assert.equal(detectSteps(trace).count, 50, `seed ${seed}`);
  }
});

test("regular walk without gravity in the signal (acceleration, not accelerationIncludingGravity) still counts 50", () => {
  const trace = synthesize({ durationMs: 30000, events: walkEvents({ steps: 50 }), seed: 9 }).map((s) => ({
    t: s.t,
    m: s.m - G,
  }));
  assert.equal(detectSteps(trace).count, 50);
});

test("phone at rest counts nothing", () => {
  const trace = synthesize({ durationMs: 20000, events: [], noise: 0.3, seed: 5 });
  assert.equal(detectSteps(trace).count, 0);
});

test("jitter: 9 Hz hand shake above the low-pass cutoff counts nothing", () => {
  const trace = synthesize({
    durationMs: 20000,
    events: [{ kind: "jitter", at: 0, until: 20000, amp: 1.6, hz: 9 }],
    noise: 0.3,
    seed: 6,
  });
  assert.equal(detectSteps(trace).count, 0);
});

test("jitter on top of a walk does not add steps", () => {
  const events = walkEvents({ steps: 30, seed: 4 });
  events.push({ kind: "jitter", at: 3000, until: 9000, amp: 1.6, hz: 9 });
  const trace = synthesize({ durationMs: 19000, events, seed: 8 });
  assert.equal(detectSteps(trace).count, 30);
});

test("a hop: impact and rebound 220 ms apart count once at the default interval, twice at 100 ms", () => {
  const trace = synthesize({
    durationMs: 3000,
    events: [
      { kind: "step", at: 1000, amp: 6 },
      { kind: "step", at: 1220, amp: 4.5 },
    ],
    seed: 9,
  });
  assert.equal(DEFAULT_PARAMS.minIntervalMs, 300);
  assert.equal(detectSteps(trace).count, 1);
  assert.equal(detectSteps(trace, { minIntervalMs: 100 }).count, 2);
});

test("raising the threshold never adds steps on a walk", () => {
  const trace = replayTrace();
  let prev = Infinity;
  for (let th = 0.8; th <= 4; th += 0.1) {
    const c = detectSteps(trace, { threshold: th }).count;
    assert.ok(c <= prev, `threshold ${th.toFixed(1)}: ${c} > ${prev}`);
    prev = c;
  }
  assert.equal(detectSteps(trace, { threshold: 4 }).count, 0);
});

test("a minimum interval longer than the step period halves the walk", () => {
  const trace = synthesize({ durationMs: 30000, events: walkEvents({ steps: 50 }), seed: 3 });
  const c = detectSteps(trace, { minIntervalMs: 600 }).count; // period is ~556 ms
  assert.ok(c >= 24 && c <= 27, `got ${c}`);
});

test("replay trace: default settings count 47 of the 50 generated steps", () => {
  assert.equal(REPLAY_TRUE_STEPS, 50);
  const trace = replayTrace();
  assert.equal(detectSteps(trace).count, 47); // three soft steps under the threshold
  assert.ok(detectSteps(trace, { threshold: 0.4, minIntervalMs: 100 }).count > 50); // the double impact splits
});

test("streaming and batch agree, and steps are reported at a peak", () => {
  const trace = replayTrace();
  const d = createStepDetector();
  const streamed = [];
  for (const s of trace) {
    const r = d.push(s.t, s.m);
    if (r.step) streamed.push(r.step.t);
  }
  const batch = detectSteps(trace);
  assert.deepEqual(streamed, batch.steps.map((s) => s.t));
  for (const s of batch.steps) {
    assert.ok(batch.filtered[s.index] >= batch.filtered[s.index - 1]);
    assert.ok(batch.filtered[s.index] >= batch.filtered[s.index + 1]);
  }
  // Accepted steps respect the interval.
  for (let i = 1; i < batch.steps.length; i++) {
    assert.ok(batch.steps[i].t - batch.steps[i - 1].t >= DEFAULT_PARAMS.minIntervalMs);
  }
});

test("share text names the mode, both counts and the parameters", () => {
  const url = "https://aifitnessapi.com/tools/step-lab";
  assert.equal(
    shareText({ mode: "live", walked: 50, counted: 47, threshold: 1.2, minIntervalMs: 300, url }),
    `I walked 50 steps; this detector counted 47 at threshold 1.2 m/s², min interval 300 ms. Why two step counters disagree: ${url}`,
  );
  assert.match(shareText({ mode: "replay", walked: 50, counted: 47, threshold: 1.2, minIntervalMs: 300, url }), /^Synthetic replay: 50 generated steps/);
  assert.match(shareText({ mode: "live", walked: 0, counted: 12, threshold: 1, minIntervalMs: 250, url }), /^This detector counted 12 steps/);
});
