/**
 * day-boundary-rollup.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   Civil-date daily rollups for health samples. Every sample is stored as
 *   { utcInstant, utcOffsetMinutes, civilDate } where `civilDate` is computed
 *   from instant + offset at WRITE time and is never re-derived at read time.
 *   The rollup groups strictly on the stored `civilDate`, so it is correct
 *   across DST transitions (a civil day is 23, 24 or 25 hours long) and across
 *   travel (each sample carries the offset the user actually experienced).
 *
 *   Also included, deliberately, is the anti-pattern: a rollup that buckets on
 *   a fixed 24-hour UTC window. It is exported so tests can show precisely
 *   which samples it drops and which it double-counts.
 *
 * WHICH aifitnessapi.com PAGE DOCUMENTS THE PATTERN
 *   https://aifitnessapi.com/architecture/timezones-and-day-boundaries
 *   https://aifitnessapi.com/day-boundaries  (interactive demo of the same bug)
 *   https://aifitnessapi.com/cookbook/day-boundary-rollup  (this recipe)
 *
 * Node 20+. Zero runtime dependencies. No I/O, no clock reads: the store and
 * the offset series are injected.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;

/**
 * Day-rule identifiers. The rule that produced a `civilDate` is stored on the
 * row, because you will change the rule at least once and you need to know
 * which rows were written under the old one.
 */
export const DAY_RULE = Object.freeze({
  /** The zone offset in effect at each sample's own timestamp. The default. */
  SAMPLE_OFFSET: "sample-offset/v1",
  /** A fixed home or profile zone applied to every sample. */
  FIXED_HOME_ZONE: "fixed-home-zone/v1",
});

/** How the offset on a sample was obtained. Confidence, not correctness. */
export const OFFSET_SOURCE = Object.freeze({
  PROVIDER: "provider",
  DEVICE_REPORTED: "device-reported",
  INFERRED: "inferred",
});

// ---------------------------------------------------------------------------
// Civil-date arithmetic
// ---------------------------------------------------------------------------

function pad2(n) {
  return String(n).padStart(2, "0");
}

/**
 * Format the UTC calendar date of an instant as YYYY-MM-DD.
 * @param {number} instantMs
 * @returns {string}
 */
export function utcDateOf(instantMs) {
  const d = new Date(instantMs);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/**
 * The civil (local) date a sample belongs to, from its instant and the UTC
 * offset in effect at that instant. This is the only place the derivation
 * happens; callers store the result rather than recomputing it.
 *
 * @param {number} instantMs epoch milliseconds
 * @param {number} utcOffsetMinutes minutes east of UTC (e.g. -300 for EST)
 * @returns {string} YYYY-MM-DD
 */
export function civilDateFrom(instantMs, utcOffsetMinutes) {
  if (!Number.isFinite(instantMs)) throw new TypeError("instantMs must be a finite number");
  if (!Number.isFinite(utcOffsetMinutes)) {
    // Never default a missing offset to UTC. A guessed offset rewrites the
    // user's travel history and there is no way to tell later that you guessed.
    throw new TypeError("utcOffsetMinutes must be a finite number; refuse to default it");
  }
  return utcDateOf(instantMs + utcOffsetMinutes * MS_PER_MINUTE);
}

/** Midnight UTC of a YYYY-MM-DD string, in epoch milliseconds. */
export function utcMidnightOf(civilDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(civilDate);
  if (!m) throw new TypeError(`not a YYYY-MM-DD civil date: ${civilDate}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** The civil date after this one. Successor arithmetic, never "+ 24 hours". */
export function nextCivilDate(civilDate) {
  return utcDateOf(utcMidnightOf(civilDate) + MS_PER_DAY);
}

// ---------------------------------------------------------------------------
// Offset series — a piecewise-constant model of one zone's UTC offset
// ---------------------------------------------------------------------------

/**
 * Build an offset series. This is a deliberately tiny stand-in for a tz
 * database: enough to reason about a specific transition in a test, not a
 * replacement for the real rules. Production code resolves offsets from the
 * platform (Intl / ZoneRules / the provider's own field) and stores the result.
 *
 * @param {Array<{from: number|null, offsetMinutes: number}>} segments
 *   `from` is the instant the offset takes effect; `null` means "since forever".
 *   Segments are sorted ascending internally.
 */
export function createOffsetSeries(segments) {
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new TypeError("offset series needs at least one segment");
  }
  const sorted = segments
    .map((s) => ({ from: s.from == null ? -Infinity : s.from, offsetMinutes: s.offsetMinutes }))
    .sort((a, b) => a.from - b.from);
  if (sorted[0].from !== -Infinity) sorted[0] = { ...sorted[0], from: -Infinity };

  return {
    segments: sorted,
    /** Offset in effect at an instant. Transitions are inclusive of `from`. */
    offsetAt(instantMs) {
      let out = sorted[0].offsetMinutes;
      for (const seg of sorted) {
        if (instantMs >= seg.from) out = seg.offsetMinutes;
        else break;
      }
      return out;
    },
    /** Distinct offsets that ever apply. */
    offsets() {
      return [...new Set(sorted.map((s) => s.offsetMinutes))];
    },
    /** Transition instants (excluding the -Infinity sentinel). */
    transitions() {
      return sorted.map((s) => s.from).filter((f) => Number.isFinite(f));
    },
  };
}

/**
 * The first instant of a civil date under an offset series.
 *
 * Normally this is `utcMidnight(date) - offset`, checked against the offset
 * actually in effect there. Where a zone shifts its clocks at midnight itself,
 * local midnight may not exist; then the day starts at the transition instant.
 *
 * @returns {number} epoch milliseconds
 */
export function startOfCivilDayUtc(civilDate, series) {
  const base = utcMidnightOf(civilDate);
  const candidates = [];
  for (const offsetMinutes of series.offsets()) {
    const t = base - offsetMinutes * MS_PER_MINUTE;
    if (series.offsetAt(t) === offsetMinutes) candidates.push(t);
  }
  if (candidates.length > 0) return Math.min(...candidates);

  // Local midnight was skipped by a transition. The day begins at the first
  // transition instant that already reads as this civil date.
  for (const t of series.transitions().sort((a, b) => a - b)) {
    if (civilDateFrom(t, series.offsetAt(t)) === civilDate) return t;
  }
  throw new RangeError(`civil date ${civilDate} does not occur in this offset series`);
}

/**
 * How long a civil day actually lasts, in hours. 23 on a spring-forward day,
 * 25 on a fall-back day, 24 the rest of the year — and 16 or 32 on a travel
 * day, if you feed it a series built from one user's real offset history.
 */
export function civilDayLengthHours(civilDate, series) {
  const start = startOfCivilDayUtc(civilDate, series);
  const end = startOfCivilDayUtc(nextCivilDate(civilDate), series);
  return (end - start) / MS_PER_HOUR;
}

/** `{ civilDate, startUtc, endUtc, hours }` — the half-open bounds of a civil day. */
export function civilDayBoundsUtc(civilDate, series) {
  const startUtc = startOfCivilDayUtc(civilDate, series);
  const endUtc = startOfCivilDayUtc(nextCivilDate(civilDate), series);
  return { civilDate, startUtc, endUtc, hours: (endUtc - startUtc) / MS_PER_HOUR };
}

// ---------------------------------------------------------------------------
// Write path — civilDate is stamped here, once
// ---------------------------------------------------------------------------

/** Minimal injectable store. Swap for your real table; the writer only calls put(). */
export function createMemorySampleStore() {
  const rows = [];
  const seen = new Set();
  return {
    /** Idempotent on (provider, externalId): a replayed window is a no-op. */
    put(record) {
      const key = `${record.provider} ${record.externalId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      rows.push(record);
      return true;
    },
    all() {
      return rows.slice();
    },
    get size() {
      return rows.length;
    },
  };
}

/**
 * A writer that computes the civil date once, at ingest, and refuses to store
 * a sample whose offset it does not know.
 *
 * @param {{store: {put: Function}, dayRule?: string}} deps
 */
export function createSampleWriter({ store, dayRule = DAY_RULE.SAMPLE_OFFSET }) {
  if (!store || typeof store.put !== "function") throw new TypeError("store.put is required");

  return {
    dayRule,
    /**
     * @param {{
     *   provider: string, externalId: string, metric: string, value: number,
     *   utcInstant: number|string|Date, utcOffsetMinutes: number,
     *   zoneId?: string, offsetSource?: string
     * }} sample
     */
    write(sample) {
      const utcInstant =
        sample.utcInstant instanceof Date
          ? sample.utcInstant.getTime()
          : typeof sample.utcInstant === "string"
            ? Date.parse(sample.utcInstant)
            : sample.utcInstant;

      const record = Object.freeze({
        provider: sample.provider,
        externalId: sample.externalId,
        metric: sample.metric,
        value: sample.value,
        // Three columns, not one. All written here.
        utcInstant,
        utcOffsetMinutes: sample.utcOffsetMinutes,
        civilDate: civilDateFrom(utcInstant, sample.utcOffsetMinutes),
        zoneId: sample.zoneId ?? null,
        offsetSource: sample.offsetSource ?? OFFSET_SOURCE.PROVIDER,
        dayRule,
      });

      store.put(record);
      return record;
    },
  };
}

// ---------------------------------------------------------------------------
// Read path — group on the stored civil date, recompute, never increment
// ---------------------------------------------------------------------------

/**
 * The correct rollup. Groups strictly on the stored `civilDate`; it will throw
 * rather than re-derive a missing one, because re-deriving at read time is the
 * bug this recipe exists to prevent.
 *
 * Pure function of its input: recompute a cell to answer "is this number
 * right?", never increment a counter.
 *
 * @param {Array<object>} records
 * @returns {Array<{civilDate: string, total: number, count: number, sampleIds: string[]}>}
 */
export function rollupByCivilDate(records) {
  const buckets = new Map();
  for (const r of records) {
    if (typeof r.civilDate !== "string") {
      throw new TypeError(
        `sample ${r.externalId} has no stored civilDate; the rollup will not derive one at read time`,
      );
    }
    bump(buckets, r.civilDate, r);
  }
  return finish(buckets);
}

/**
 * ANTI-PATTERN — DO NOT SHIP. Included only so a test can measure the damage.
 *
 * Buckets samples into fixed 24-hour UTC windows, i.e. `date(utcInstant)`. This
 * is what a `time_bucket('1 day', ts)` continuous aggregate does, and what any
 * "group by date(timestamp)" query does. It is wrong for every user outside
 * UTC, every day; on DST days it drops or double-counts a whole hour; and for
 * a traveller it files activity under the day they were not living in.
 *
 * @returns {Array<{civilDate: string, total: number, count: number, sampleIds: string[]}>}
 */
export function rollupByFixedUtcWindowAntiPattern(records) {
  const buckets = new Map();
  for (const r of records) bump(buckets, utcDateOf(r.utcInstant), r);
  return finish(buckets);
}

function bump(buckets, key, r) {
  let b = buckets.get(key);
  if (!b) {
    b = { civilDate: key, total: 0, count: 0, sampleIds: [] };
    buckets.set(key, b);
  }
  b.total += r.value;
  b.count += 1;
  b.sampleIds.push(r.externalId);
}

function finish(buckets) {
  return [...buckets.values()].sort((a, b) => (a.civilDate < b.civilDate ? -1 : 1));
}

/**
 * Every sample the anti-pattern files under a date the user did not experience.
 * @returns {Array<{externalId: string, civilDate: string, utcBucket: string}>}
 */
export function misfiledByUtcWindow(records) {
  const out = [];
  for (const r of records) {
    const utcBucket = utcDateOf(r.utcInstant);
    if (utcBucket !== r.civilDate) {
      out.push({ externalId: r.externalId, civilDate: r.civilDate, utcBucket });
    }
  }
  return out;
}

/**
 * Line up the correct rollup against the anti-pattern one.
 *
 * `delta` is anti − correct: positive means the UTC window double-counted
 * activity into that date, negative means it dropped activity out of it.
 */
export function compareRollups(correct, antiPattern) {
  const byDate = new Map();
  for (const b of correct) {
    byDate.set(b.civilDate, {
      civilDate: b.civilDate,
      correctTotal: b.total,
      correctCount: b.count,
      antiTotal: 0,
      antiCount: 0,
    });
  }
  for (const b of antiPattern) {
    const row = byDate.get(b.civilDate) ?? {
      civilDate: b.civilDate,
      correctTotal: 0,
      correctCount: 0,
      antiTotal: 0,
      antiCount: 0,
    };
    row.antiTotal = b.total;
    row.antiCount = b.count;
    byDate.set(b.civilDate, row);
  }
  return [...byDate.values()]
    .sort((a, b) => (a.civilDate < b.civilDate ? -1 : 1))
    .map((r) => ({ ...r, delta: r.antiTotal - r.correctTotal }));
}
