/**
 * rep-counter.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   Two things a camera fitness feature needs and that are usually written
 *   badly together:
 *
 *   1. A rep-counting finite state machine over a smoothed joint-angle stream.
 *      EMA smoothing with an injectable alpha, hysteresis (separate entry
 *      thresholds for the up and down phases, so jitter at one boundary cannot
 *      double-fire), a minimum phase duration, a minimum amplitude gate, a
 *      confidence gate, and rep events emitted with timestamps.
 *
 *   2. A scorer that treats the counter as a classifier: predicted rep
 *      timestamps matched one-to-one and greedily against labelled ground truth
 *      inside a tolerance window, producing precision and recall PER CLIP.
 *      There is deliberately no aggregate-count comparison and no F-score,
 *      because both let a miss and a phantom cancel each other out.
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/motion/how-rep-counting-works   (the state machine)
 *   https://aifitnessapi.com/test/rep-counting               (the scoring gate)
 *   https://aifitnessapi.com/cookbook/rep-counter            (this recipe)
 *
 * Node 20+. Zero runtime dependencies. No timers and no clock reads: every
 * frame carries its own timestamp, so a recorded keypoint sequence replays
 * deterministically.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

// ---------------------------------------------------------------------------
// Smoothing
// ---------------------------------------------------------------------------

/**
 * Exponential moving average. `alpha` is the weight of the newest sample:
 * 1 means no smoothing at all, small values mean heavy smoothing and more lag.
 *
 * Smoothing is not optional — never run threshold logic on raw keypoints — but
 * it is a trade, so the constant is injected rather than baked in.
 */
export function createEmaSmoother({ alpha }) {
  if (!(alpha > 0 && alpha <= 1)) throw new RangeError("alpha must be in (0, 1]");
  let value = null;
  return {
    get value() {
      return value;
    },
    push(x) {
      value = value === null ? x : alpha * x + (1 - alpha) * value;
      return value;
    },
    reset() {
      value = null;
    },
  };
}

// ---------------------------------------------------------------------------
// The state machine
// ---------------------------------------------------------------------------

export const PHASE = Object.freeze({ DOWN: "down", UP: "up" });

/**
 * A rep counter for one exercise on one joint angle.
 *
 * Convention follows the curl worked through on /motion/how-rep-counting-works:
 * a large angle is the extended, resting position (`down`) and a small angle is
 * the contracted position (`up`). A rep is counted on the COMPLETED cycle — the
 * moment the signal returns past `enterDownAbove` — not on either crossing
 * alone. For an exercise where the extremes are the other way round, feed in
 * the negated angle or an angle measured at the opposite joint; the state
 * machine does not care what the number means.
 *
 * @param {object} cfg
 * @param {number} cfg.enterUpBelow      cross below this to enter the up phase
 * @param {number} cfg.enterDownAbove    cross above this to complete the rep
 * @param {number} [cfg.alpha=0.4]       EMA smoothing weight
 * @param {number} [cfg.minPhaseMs=0]    debounce. The down phase must have lasted this long
 *   before it may end, and a cycle whose up phase was shorter than this is rejected as a
 *   spike rather than merely delayed — a delayed count is still a wrong count.
 * @param {number} [cfg.minAmplitude=0]  the cycle must span at least this much smoothed range
 * @param {number} [cfg.minConfidence=0] frames below this are skipped entirely
 */
export function createRepCounter(cfg) {
  const {
    enterUpBelow,
    enterDownAbove,
    alpha = 0.4,
    minPhaseMs = 0,
    minAmplitude = 0,
    minConfidence = 0,
  } = cfg;

  if (!Number.isFinite(enterUpBelow) || !Number.isFinite(enterDownAbove)) {
    throw new TypeError("enterUpBelow and enterDownAbove are required numbers");
  }
  if (!(enterUpBelow < enterDownAbove)) {
    // A single threshold, or an inverted pair, is the double-counting bug.
    // Refuse at construction time rather than miscount in the field.
    throw new RangeError(
      "enterUpBelow must be strictly below enterDownAbove; the gap between them is the hysteresis",
    );
  }

  const ema = createEmaSmoother({ alpha });

  let phase = null;
  let phaseStartT = null;
  let phaseMin = Infinity;
  let phaseMax = -Infinity;
  let count = 0;
  let skipped = 0;
  const events = [];
  const rejected = [];

  function beginPhase(next, t, seed) {
    phase = next;
    phaseStartT = t;
    phaseMin = seed;
    phaseMax = seed;
  }

  return {
    get count() {
      return count;
    },
    get phase() {
      return phase;
    },
    /** Rep events emitted so far: `{ index, t, amplitude, peakAngle, troughAngle }`. */
    get events() {
      return events.slice();
    },
    /** Frames dropped by the confidence gate. Worth surfacing to the user. */
    get skippedFrames() {
      return skipped;
    },
    /** Cycles the gates threw away: `{ t, reason, upPhaseMs, amplitude }`. */
    get rejected() {
      return rejected.slice();
    },
    /** Predicted rep timestamps, the shape the scorer below wants. */
    repTimestamps() {
      return events.map((e) => e.t);
    },

    /**
     * Feed one frame.
     * @param {{t: number, angle: number, confidence?: number}} frame
     * @returns {Array<object>} rep events emitted by THIS frame (0 or 1)
     */
    push({ t, angle, confidence = 1 }) {
      if (!Number.isFinite(t) || !Number.isFinite(angle)) {
        throw new TypeError("frame needs a finite t and angle");
      }
      if (confidence < minConfidence) {
        // Occluded or low-confidence joints produce a garbage angle. Skipping
        // the frame is right; feeding it to the smoother is not.
        skipped += 1;
        return [];
      }

      const s = ema.push(angle);

      if (phase === null) {
        beginPhase(s <= enterUpBelow ? PHASE.UP : PHASE.DOWN, t, s);
        return [];
      }

      if (s < phaseMin) phaseMin = s;
      if (s > phaseMax) phaseMax = s;

      const phaseMs = t - phaseStartT;

      if (phase === PHASE.DOWN) {
        // Hysteresis: only a crossing of the LOW threshold opens a new cycle,
        // so jitter around the high one cannot re-fire. The time gate is a
        // debounce against re-entering immediately after a counted rep.
        if (s < enterUpBelow && phaseMs >= minPhaseMs) beginPhase(PHASE.UP, t, s);
        return [];
      }

      // phase === UP: the rep completes only on the return crossing, which is
      // the moment the counter is contractually supposed to increment. Label
      // your ground truth at the same moment or every match is luck.
      if (s > enterDownAbove) {
        const amplitude = s - phaseMin;
        const trough = phaseMin;
        beginPhase(PHASE.DOWN, t, s);

        if (phaseMs < minPhaseMs) {
          rejected.push({ t, reason: "phase_too_short", upPhaseMs: phaseMs, amplitude });
          return [];
        }
        if (amplitude < minAmplitude) {
          rejected.push({ t, reason: "amplitude_too_small", upPhaseMs: phaseMs, amplitude });
          return [];
        }

        count += 1;
        const event = Object.freeze({
          index: count,
          t,
          amplitude,
          peakAngle: s,
          troughAngle: trough,
        });
        events.push(event);
        return [event];
      }
      return [];
    },

    /**
     * Drain a whole recorded sequence. Replaying captured keypoints is the
     * cheap way to regression-test the state machine; scoring the pose model
     * against its own output is not a test at all.
     */
    pushAll(frames) {
      for (const f of frames) this.push(f);
      return this.events;
    },

    reset() {
      ema.reset();
      phase = null;
      phaseStartT = null;
      phaseMin = Infinity;
      phaseMax = -Infinity;
      count = 0;
      skipped = 0;
      events.length = 0;
      rejected.length = 0;
    },
  };
}

// ---------------------------------------------------------------------------
// Scoring — the counter is a classifier, so score it like one
// ---------------------------------------------------------------------------

/**
 * Guard the tolerance window against being wide enough to be meaningless.
 *
 * If the window exceeds half the closest gap between two labelled reps, one
 * prediction sits within range of two labels and the score stops measuring
 * anything. This is the check that stops your fastest clip — the one you most
 * want in the corpus — going quietly unscoreable the day someone widens the
 * window to make a flaky clip go green.
 *
 * @throws {RangeError}
 */
export function assertToleranceIsMeaningful(truth, toleranceMs) {
  const ordered = [...truth].sort((a, b) => a - b);
  for (let i = 1; i < ordered.length; i++) {
    const gap = ordered[i] - ordered[i - 1];
    if (gap <= 2 * toleranceMs) {
      throw new RangeError(
        `tolerance ${toleranceMs}ms exceeds half the closest labelled rep pair (${gap}ms apart); ` +
          "one prediction could satisfy two labels and the score would be meaningless",
      );
    }
  }
  return true;
}

/**
 * One-to-one greedy nearest matching of predicted rep events to labelled ones.
 *
 * Walks the labels in time order; for each, takes the nearest unmatched
 * prediction inside the window and consumes it. Consuming is what makes a
 * double-count show up as a false positive instead of vanishing.
 *
 * @param {number[]} truth      labelled rep timestamps (ms)
 * @param {number[]} predicted  rep timestamps your counter emitted (ms)
 * @param {{toleranceMs: number}} opts
 * @returns {{tp:number, fp:number, fn:number, precision:number, recall:number,
 *            matches: Array<{truth:number, predicted:number, errorMs:number}>,
 *            falsePositives:number[], falseNegatives:number[]}}
 */
export function scoreRepEvents(truth, predicted, { toleranceMs }) {
  if (!Number.isFinite(toleranceMs) || toleranceMs < 0) {
    throw new TypeError("toleranceMs must be a non-negative number");
  }
  assertToleranceIsMeaningful(truth, toleranceMs);

  const unmatched = [...predicted].sort((a, b) => a - b);
  const matches = [];
  const falseNegatives = [];

  for (const t of [...truth].sort((a, b) => a - b)) {
    let bestIdx = -1;
    let bestErr = Infinity;
    for (let i = 0; i < unmatched.length; i++) {
      const err = Math.abs(unmatched[i] - t);
      if (err <= toleranceMs && err < bestErr) {
        bestErr = err;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) {
      falseNegatives.push(t);
    } else {
      const [hit] = unmatched.splice(bestIdx, 1);
      matches.push({ truth: t, predicted: hit, errorMs: hit - t });
    }
  }

  const tp = matches.length;
  const fp = unmatched.length;
  const fn = falseNegatives.length;
  return {
    tp,
    fp,
    fn,
    // An empty denominator is "no evidence", not "perfect". Report null.
    precision: tp + fp === 0 ? null : tp / (tp + fp),
    recall: tp + fn === 0 ? null : tp / (tp + fn),
    matches,
    falsePositives: unmatched,
    falseNegatives,
  };
}

/**
 * Score a whole corpus. Per clip, and only per clip.
 *
 * There is no aggregate here on purpose: a pooled precision figure is dominated
 * by whichever exercise you filmed most of, and a change that breaks two clips
 * while fixing two others leaves it perfectly still.
 *
 * @param {Array<{clip: string, exercise?: string, tags?: string[],
 *                truth: number[], predicted: number[]}>} clips
 * @param {{toleranceMs: number}} opts
 */
export function scoreCorpus(clips, { toleranceMs }) {
  const results = {};
  for (const c of clips) {
    const s = scoreRepEvents(c.truth, c.predicted, { toleranceMs });
    results[c.clip] = {
      clip: c.clip,
      exercise: c.exercise ?? null,
      tags: c.tags ?? [],
      tp: s.tp,
      fp: s.fp,
      fn: s.fn,
      precision: s.precision,
      recall: s.recall,
    };
  }
  return results;
}

/**
 * The gate. Compare per-clip results against a committed baseline and report
 * every clip whose tp/fp/fn moved in EITHER direction.
 *
 * An improvement failing the build is the point: accepting it means updating
 * the baseline in the same pull request, which makes the diff the review
 * artifact and forces whoever widened the hysteresis gap to say which clips
 * moved and why the trade was worth it.
 *
 * @returns {{ok: boolean, changed: Array<object>, missing: string[], added: string[]}}
 */
export function compareToBaseline(results, baseline) {
  const changed = [];
  const missing = [];
  const added = [];

  for (const clip of Object.keys(baseline)) {
    if (!(clip in results)) {
      missing.push(clip);
      continue;
    }
    const a = baseline[clip];
    const b = results[clip];
    const delta = { tp: b.tp - a.tp, fp: b.fp - a.fp, fn: b.fn - a.fn };
    if (delta.tp || delta.fp || delta.fn) {
      changed.push({
        clip,
        baseline: { tp: a.tp, fp: a.fp, fn: a.fn },
        current: { tp: b.tp, fp: b.fp, fn: b.fn },
        delta,
        // "regressed" only in the narrow sense of more errors; the reviewer
        // still has to look. Both directions fail the gate.
        regressed: delta.fp > 0 || delta.fn > 0,
      });
    }
  }
  for (const clip of Object.keys(results)) if (!(clip in baseline)) added.push(clip);

  return { ok: changed.length === 0 && missing.length === 0 && added.length === 0, changed, missing, added };
}

/**
 * ANTI-PATTERN — DO NOT GATE ON THIS. Exported so a test can demonstrate that
 * it passes on a counter that is wrong twice. A miss and a phantom cancel, the
 * totals agree, and the suite reports coverage it does not have.
 */
export function totalsAgreeAntiPattern(truth, predicted) {
  return truth.length === predicted.length;
}
