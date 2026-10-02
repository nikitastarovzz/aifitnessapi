/**
 * dedupe-health-samples.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   Interval-wise resolution of overlapping health samples written by several
 *   sources, for one (user, metric, civil date) at a time:
 *     1. Redelivery is removed first, on a stable identity (source + id),
 *        keeping the highest version. The same sample twice is one sample.
 *     2. Instantaneous samples (start === end) are set aside. They have no
 *        duration to pro-rate, and two scales reporting three seconds apart
 *        is a coincidence-window problem, not a coverage problem.
 *     3. Manual entries are excluded from the ranking and returned, never
 *        dropped. They are the user's data; they just do not compete with a
 *        sensor for the same interval.
 *     4. The day is cut at every sample boundary. Over each atomic
 *        sub-interval the highest-priority covering source wins; ties go to
 *        the shorter sample, then to a stable key.
 *     5. The winner's value is attributed pro rata to the sub-interval, and
 *        the sub-intervals are summed. Per-source totals are never summed.
 *   Priority is per (user, metric), carries aliases so one device that
 *   appears under two source keys stays one source, and is an input: the same
 *   samples and the same table always produce the same number.
 *
 *   The two anti-patterns (sum everything; let one device win the whole day)
 *   are exported too, so the tests can show what each gets wrong on the same
 *   samples.
 *
 * WHEN NOT TO USE IT
 *   On iOS, for quantity types, ask HealthKit instead. Apple documents that
 *   statistics queries (HKStatisticsQuery, HKStatisticsCollectionQuery)
 *   "automatically merge the data from all of your data sources before
 *   performing the calculations". This file is for what no platform merges:
 *   workouts, cross-provider totals on your server, and Health Connect types
 *   outside Activity and Sleep.
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/architecture/deduplicate-health-data
 *   https://aifitnessapi.com/cookbook/dedupe-health-samples
 *
 * Node 20+. Zero runtime dependencies. Pure functions: no I/O, no clock.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

/** Why a sample did not enter the overlap sweep. Each is returned, not lost. */
export const EXCLUSION = Object.freeze({
  INSTANTANEOUS: "instantaneous",
  MANUAL_ENTRY: "manual_entry",
});

// ---------------------------------------------------------------------------
// Source priority — per (user, metric), with aliases
// ---------------------------------------------------------------------------

/**
 * Build the priority table for ONE (user, metric). Never global, never per
 * user alone: a chest strap is the best heart-rate source a user owns and a
 * nonexistent step source.
 *
 * `ranked` lists source keys highest priority first. `aliases` maps an extra
 * key onto a ranked one, so a physical device that changed its source key
 * mid-history competes as one source instead of against itself. A source
 * missing from the table ranks after every listed source and is reported, so
 * an incomplete table is visible rather than silently decisive.
 *
 * @param {string[]} ranked
 * @param {{aliases?: Record<string, string>}} [opts]
 */
export function createSourcePriority(ranked, { aliases = {} } = {}) {
  if (!Array.isArray(ranked) || ranked.length === 0) {
    throw new TypeError("ranked must be a non-empty array of source keys");
  }
  const rank = new Map();
  ranked.forEach((key, i) => {
    if (rank.has(key)) throw new TypeError(`source ${key} is ranked twice`);
    rank.set(key, i);
  });
  const alias = new Map();
  for (const [from, to] of Object.entries(aliases)) {
    if (rank.has(from)) throw new TypeError(`alias ${from} is also ranked; pick one`);
    if (!rank.has(to)) throw new TypeError(`alias ${from} points at unranked source ${to}`);
    alias.set(from, to);
  }
  return {
    ranked: ranked.slice(),
    /** The key a source competes under after aliasing. */
    canonical(source) {
      return alias.get(source) ?? source;
    },
    /** 0 is the highest priority. Unlisted sources get ranked.length. */
    rankOf(source) {
      return rank.get(alias.get(source) ?? source) ?? ranked.length;
    },
    isRanked(source) {
      return rank.has(alias.get(source) ?? source);
    },
  };
}

// ---------------------------------------------------------------------------
// Validation and redelivery
// ---------------------------------------------------------------------------

/** Stable identity of one sample from one writer. */
export function sampleKey(sample) {
  return `${sample.source}:${sample.id}`;
}

function assertSample(s) {
  if (!s || typeof s.source !== "string" || s.source === "") {
    throw new TypeError("every sample needs a source key");
  }
  if (s.id === undefined || s.id === null || s.id === "") {
    throw new TypeError(`sample from ${s.source} has no id; redelivery cannot be detected without one`);
  }
  if (!Number.isFinite(s.start) || !Number.isFinite(s.end)) {
    throw new TypeError(`sample ${sampleKey(s)} needs finite start and end (epoch ms)`);
  }
  if (s.end < s.start) throw new RangeError(`sample ${sampleKey(s)} ends before it starts`);
  if (!Number.isFinite(s.value) || s.value < 0) {
    throw new RangeError(`sample ${sampleKey(s)} needs a finite, non-negative value`);
  }
}

/**
 * Remove redelivered copies: the same (source, id) seen more than once — an
 * anchored query replayed after a reinstall, a retried webhook, a backfill
 * overlapping live ingest. The highest `version` wins; on a tie the first one
 * seen stays, so the result does not depend on how often it was redelivered.
 *
 * @returns {{unique: object[], redelivered: string[]}}
 */
export function dedupeRedeliveries(samples) {
  const byKey = new Map();
  const redelivered = [];
  for (const s of samples) {
    assertSample(s);
    const key = sampleKey(s);
    const held = byKey.get(key);
    if (!held) {
      byKey.set(key, s);
      continue;
    }
    redelivered.push(key);
    if ((s.version ?? 0) > (held.version ?? 0)) byKey.set(key, s);
  }
  return { unique: [...byKey.values()], redelivered };
}

// ---------------------------------------------------------------------------
// The sweep
// ---------------------------------------------------------------------------

/**
 * Deterministic winner order: priority, then shorter sample (finer granularity
 * smears less), then source key, then id. A non-deterministic tie-break means
 * a re-run on unchanged data returns a different number, which turns a
 * recompute into a support ticket.
 */
function compareCandidates(a, b, priority) {
  const byRank = priority.rankOf(a.source) - priority.rankOf(b.source);
  if (byRank !== 0) return byRank;
  const byDuration = a.end - a.start - (b.end - b.start);
  if (byDuration !== 0) return byDuration;
  if (a.source !== b.source) return a.source < b.source ? -1 : 1;
  const ai = String(a.id);
  const bi = String(b.id);
  return ai === bi ? 0 : ai < bi ? -1 : 1;
}

/**
 * Resolve one (user, metric, civil date). The caller scopes the samples: the
 * civil date is a per-user question, not a UTC range, and it is decided
 * upstream of this function.
 *
 * Intervals are half-open, [start, end). A sample that ends at 09:30 and one
 * that starts at 09:30 touch; they do not overlap, and no zero-width segment
 * is ever produced.
 *
 * @param {Array<{id: string, source: string, start: number, end: number,
 *   value: number, manual?: boolean, version?: number}>} samples
 * @param {ReturnType<typeof createSourcePriority>} priority
 * @returns {{total: number|null, naiveSum: number, segments: object[],
 *   boundaries: number[], excluded: object[], redelivered: string[],
 *   unrankedSources: string[]}} `total` is null when no sample entered the sweep.
 */
export function resolveOverlaps(samples, priority) {
  if (!priority || typeof priority.rankOf !== "function") {
    throw new TypeError("priority must come from createSourcePriority()");
  }
  const { unique, redelivered } = dedupeRedeliveries(samples);

  const excluded = [];
  const candidates = [];
  for (const s of unique) {
    if (s.end === s.start) excluded.push({ key: sampleKey(s), reason: EXCLUSION.INSTANTANEOUS, sample: s });
    else if (s.manual === true) excluded.push({ key: sampleKey(s), reason: EXCLUSION.MANUAL_ENTRY, sample: s });
    else candidates.push(s);
  }

  const unrankedSources = [
    ...new Set(candidates.filter((s) => !priority.isRanked(s.source)).map((s) => s.source)),
  ].sort();

  // Every start and end, sorted and unique. Consecutive pairs are the atomic
  // sub-intervals over which the set of covering samples does not change.
  const boundaries = [...new Set(candidates.flatMap((s) => [s.start, s.end]))].sort((a, b) => a - b);

  const byStart = candidates.slice().sort((a, b) => a.start - b.start);
  const segments = [];
  let active = [];
  let next = 0;

  for (let i = 0; i < boundaries.length - 1; i++) {
    const segStart = boundaries[i];
    const segEnd = boundaries[i + 1];
    while (next < byStart.length && byStart[next].start <= segStart) active.push(byStart[next++]);
    // Half-open: a sample ending exactly at segStart does not cover what follows.
    active = active.filter((s) => s.end > segStart);
    if (active.length === 0) continue; // nobody recorded this stretch; it contributes nothing

    let winner = active[0];
    for (const s of active) if (compareCandidates(s, winner, priority) < 0) winner = s;

    segments.push({
      start: segStart,
      end: segEnd,
      winner: sampleKey(winner),
      source: priority.canonical(winner.source),
      coveredBy: active.map(sampleKey).sort(),
      // Pro rata assumes the rate is uniform inside the sample. Harmless for a
      // 10-minute sample, wrong for a 90-minute one covering a sprint and a rest.
      contribution: (winner.value * (segEnd - segStart)) / (winner.end - winner.start),
    });
  }

  // No candidate at all means nobody recorded anything: that is missing data,
  // not a measured zero, and the caller decides how absence is stored.
  const total = candidates.length === 0 ? null : segments.reduce((n, seg) => n + seg.contribution, 0);
  const naiveSum = candidates.reduce((n, s) => n + s.value, 0);
  return { total, naiveSum, segments, boundaries, excluded, redelivered, unrankedSources };
}

// ---------------------------------------------------------------------------
// The invariant worth monitoring, and the two anti-patterns
// ---------------------------------------------------------------------------

/**
 * The resolved total must never exceed the naive sum of the samples that
 * entered the sweep. If it does, some interval is being counted twice.
 *
 * Deliberately NOT checked: that the resolved total is at least the largest
 * single source's total. That is false on correct data — a priority-1 watch
 * with 500 steps beats a priority-2 phone with 3,000 for the same hour.
 */
export function checkResolution(result) {
  // Pro rata division is floating point; allow for rounding, not for a bug.
  const tolerance = 1e-9 * Math.max(1, result.naiveSum);
  const resolved = result.total ?? 0;
  return {
    ok: resolved <= result.naiveSum + tolerance,
    resolved: result.total,
    naiveSum: result.naiveSum,
    removed: result.naiveSum - resolved,
  };
}

/** Sum every sample. Counts every overlapped minute once per writer. */
export function naiveSumAntiPattern(samples) {
  return samples.reduce((n, s) => n + s.value, 0);
}

/**
 * Let the highest-priority source present that day win the whole day.
 * Deletes every stretch the winner did not record — the watch on its charger,
 * the shower, the phone that kept counting.
 */
export function wholeDayWinnerAntiPattern(samples, priority) {
  if (samples.length === 0) return 0;
  const best = Math.min(...samples.map((s) => priority.rankOf(s.source)));
  return samples.filter((s) => priority.rankOf(s.source) === best).reduce((n, s) => n + s.value, 0);
}
