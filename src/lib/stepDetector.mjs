/**
 * The /tools/step-lab detector: a deliberately simple, fully visible step
 * counter over accelerometer magnitude.
 *
 * It is not any platform's algorithm and does not imitate one. It exists to
 * show the three choices every step counter makes somewhere — how much to
 * smooth the signal, how big a bump counts, and how soon after one step the
 * next may come — so a reader can move them and watch the count change.
 *
 * Pipeline, per sample (t in ms, m = |acceleration| in m/s²):
 *   1. low-pass: an exponential filter with a cutoff of `cutoffHz`, so
 *      hand tremor and vibration above a walking rhythm are smoothed away;
 *   2. baseline: a much slower exponential average (`baselineSeconds`), so
 *      the detector works with or without gravity in the signal and with the
 *      phone in any orientation;
 *   3. peak: a local maximum of the filtered signal (rising, then not rising);
 *   4. accept: the peak rises at least `threshold` m/s² above the baseline and
 *      comes at least `minIntervalMs` after the last accepted step.
 *
 * Pure: no DOM, no clock, no randomness except the seeded generator used for
 * the synthetic traces, so the page and `scripts/step-detector.test.mjs` run
 * exactly the same code.
 */

export const DEFAULT_PARAMS = Object.freeze({
  threshold: 1.2, // m/s² above the running baseline
  minIntervalMs: 300,
  cutoffHz: 3,
  baselineSeconds: 1.5,
});

export const THRESHOLD_RANGE = Object.freeze({ min: 0.2, max: 4, step: 0.1 });
export const INTERVAL_RANGE = Object.freeze({ min: 100, max: 1000, step: 10 });

/** Standard gravity, used only to build the synthetic traces. */
export const G = 9.80665;

export function magnitude(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * A streaming detector. `push(t, m)` returns the processed sample:
 * { t, raw, filtered, baseline, step } where `step` is null or the accepted
 * step { t, value, index } — the peak one sample back, so a step is reported
 * one sample after it happened.
 */
export function createStepDetector(params = {}) {
  const p = { ...DEFAULT_PARAMS, ...params };
  const rc = 1 / (2 * Math.PI * p.cutoffHz);
  let n = 0;
  let lastT = null;
  let filtered = 0;
  let baseline = 0;
  let prev = null; // { t, filtered, baseline }
  let prevPrevFiltered = null;
  let lastStepT = -Infinity;
  let count = 0;

  function push(t, m) {
    let step = null;
    if (lastT === null) {
      filtered = m;
      baseline = m;
    } else {
      const dt = Math.max(0, (t - lastT) / 1000);
      const a = dt / (rc + dt);
      filtered += a * (m - filtered);
      const b = dt / (p.baselineSeconds + dt);
      baseline += b * (filtered - baseline);
    }
    lastT = t;

    // Peak test on the previous sample: it rose from the one before and the
    // current sample does not rise above it.
    if (prev && prevPrevFiltered !== null && prev.filtered > prevPrevFiltered && filtered <= prev.filtered) {
      const height = prev.filtered - prev.baseline;
      if (height >= p.threshold && prev.t - lastStepT >= p.minIntervalMs) {
        lastStepT = prev.t;
        count += 1;
        step = { t: prev.t, value: prev.filtered, index: n - 1 };
      }
    }
    prevPrevFiltered = prev ? prev.filtered : null;
    prev = { t, filtered, baseline };
    n += 1;
    return { t, raw: m, filtered, baseline, step };
  }

  return {
    push,
    get count() {
      return count;
    },
    params: p,
  };
}

/** Run the detector over a whole trace of { t, m } samples. */
export function detectSteps(samples, params = {}) {
  const d = createStepDetector(params);
  const filtered = new Array(samples.length);
  const baseline = new Array(samples.length);
  const steps = [];
  for (let i = 0; i < samples.length; i++) {
    const r = d.push(samples[i].t, samples[i].m);
    filtered[i] = r.filtered;
    baseline[i] = r.baseline;
    if (r.step) steps.push(r.step);
  }
  return { filtered, baseline, steps, count: steps.length, params: d.params };
}

/** mulberry32: small, seeded, deterministic. */
export function seeded(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand) {
  const u = Math.max(rand(), 1e-12);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** One step's impact as a smooth bump centred on 0 (ms), height 1. */
function bump(dtMs, widthMs) {
  const x = dtMs / widthMs;
  return Math.exp(-0.5 * x * x);
}

/**
 * A synthetic trace: magnitude samples around gravity, built from a list of
 * labelled events. Every value is invented by this function; the page labels
 * any trace from here as synthetic.
 *
 *   events: [{ at: ms, kind: "step", amp, widthMs? } | { at, until, kind: "jitter", amp, hz }]
 */
export function synthesize({ durationMs, rateHz = 50, events = [], noise = 0.15, seed = 1 }) {
  const rand = seeded(seed);
  const dt = 1000 / rateHz;
  const out = [];
  for (let t = 0; t <= durationMs; t += dt) {
    let m = G + noise * gaussian(rand);
    for (const e of events) {
      if (e.kind === "jitter") {
        if (t >= e.at && t <= e.until) m += e.amp * Math.sin((2 * Math.PI * e.hz * t) / 1000);
      } else {
        const w = e.widthMs ?? 70;
        const d = t - e.at;
        if (Math.abs(d) < w * 4) {
          // Impact peak, then the small dip of the body rising over the foot.
          m += e.amp * bump(d, w) - 0.35 * e.amp * bump(d - w * 2.2, w * 1.3);
        }
      }
    }
    out.push({ t: Math.round(t * 1000) / 1000, m });
  }
  return out;
}

/** Steps at a steady cadence, with a little timing and force variation. */
export function walkEvents({ steps, startMs = 500, cadenceHz = 1.8, amp = 3, seed = 7 }) {
  const rand = seeded(seed);
  const period = 1000 / cadenceHz;
  const events = [];
  for (let i = 0; i < steps; i++) {
    events.push({
      kind: "step",
      at: startMs + i * period + (rand() - 0.5) * 0.08 * period,
      amp: amp * (0.85 + 0.3 * rand()),
    });
  }
  return events;
}

/**
 * The replay trace on the page: 50 synthetic steps, of which a few are soft
 * (a shuffle the default threshold misses) and one has a double impact (a
 * small hop the minimum interval merges), with a stretch of hand jitter in
 * the middle. Ground truth is TRUE_STEPS by construction.
 */
export const REPLAY_TRUE_STEPS = 50;
export const REPLAY_LABEL = "Synthetic trace: 50 generated steps at 1.8 per second, with three soft steps, one double impact and a jitter burst. Not a recording.";

export function replayTrace() {
  const events = walkEvents({ steps: REPLAY_TRUE_STEPS, startMs: 800, cadenceHz: 1.8, amp: 3, seed: 11 });
  // Soft steps: well under the default threshold.
  for (const i of [17, 18, 41]) events[i].amp = 0.9;
  // A double impact on step 30: a second bump 220 ms after the first.
  events.push({ kind: "step", at: events[30].at + 220, amp: events[30].amp * 0.8 });
  const last = events[REPLAY_TRUE_STEPS - 1].at;
  // Jitter between steps 24 and 27: hand shake at 9 Hz, above the cutoff.
  events.push({ kind: "jitter", at: events[24].at, until: events[27].at, amp: 1.6, hz: 9 });
  return synthesize({ durationMs: Math.ceil(last + 1200), rateHz: 50, events, noise: 0.15, seed: 23 });
}

/** The copy line the share buttons use. */
export function shareText({ mode, walked, counted, threshold, minIntervalMs, url }) {
  const params = `threshold ${threshold.toFixed(1)} m/s², min interval ${Math.round(minIntervalMs)} ms`;
  const head =
    mode === "replay"
      ? `Synthetic replay: ${walked} generated steps; this detector counted ${counted} at ${params}.`
      : walked
        ? `I walked ${walked} steps; this detector counted ${counted} at ${params}.`
        : `This detector counted ${counted} steps at ${params}.`;
  return `${head} Why two step counters disagree: ${url}`;
}
