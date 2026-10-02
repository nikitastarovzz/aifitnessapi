/**
 * dedupe-health-samples.test.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   The test contract for dedupe-health-samples.mjs. The fixtures are the
 *   worked example on /architecture/deduplicate-health-data, number for
 *   number: Watch at priority 1, Phone at priority 2, four samples on
 *   2026-07-26. A naive sum says 7,500, letting the watch win the day says
 *   2,500, and interval-wise resolution says 6,000 — with the same five
 *   sub-interval contributions the page's table shows. If the page and this
 *   file ever disagree, one of them is wrong.
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/architecture/deduplicate-health-data
 *   https://aifitnessapi.com/cookbook/dedupe-health-samples
 *
 * Pure functions, so no fakes are needed. Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  EXCLUSION,
  checkResolution,
  createSourcePriority,
  dedupeRedeliveries,
  naiveSumAntiPattern,
  resolveOverlaps,
  wholeDayWinnerAntiPattern,
} from "./dedupe-health-samples.mjs";

/** "09:15" on the worked example's civil date, as epoch ms. */
function at(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return Date.UTC(2026, 6, 26, h, m);
}

function sample(id, source, from, to, value, extra = {}) {
  return { id, source, start: at(from), end: at(to), value, ...extra };
}

/** The four samples from the page's worked-example table. */
function workedExample() {
  return [
    sample("W1", "watch", "09:00", "09:30", 1400),
    sample("W2", "watch", "09:30", "10:00", 1100),
    sample("P1", "phone", "09:15", "10:15", 2000),
    sample("P2", "phone", "14:00", "15:00", 3000),
  ];
}

const WATCH_FIRST = createSourcePriority(["watch", "phone"]);

// ---------------------------------------------------------------------------
// The page's worked example
// ---------------------------------------------------------------------------

test("worked example: naive sum 7,500, whole-day winner 2,500, resolved 6,000", () => {
  const samples = workedExample();
  assert.equal(naiveSumAntiPattern(samples), 7500);
  assert.equal(
    wholeDayWinnerAntiPattern(samples, WATCH_FIRST),
    2500,
    "the watch wins the day and the afternoon walk disappears",
  );
  assert.equal(resolveOverlaps(samples, WATCH_FIRST).total, 6000);
});

test("worked example: the boundaries and the five sub-interval contributions match the page", () => {
  const result = resolveOverlaps(workedExample(), WATCH_FIRST);

  assert.deepEqual(
    result.boundaries,
    ["09:00", "09:15", "09:30", "10:00", "10:15", "14:00", "15:00"].map(at),
  );
  assert.deepEqual(
    result.segments.map((s) => ({ start: s.start, end: s.end, winner: s.winner, contribution: s.contribution })),
    [
      { start: at("09:00"), end: at("09:15"), winner: "watch:W1", contribution: 700 },
      { start: at("09:15"), end: at("09:30"), winner: "watch:W1", contribution: 700 },
      { start: at("09:30"), end: at("10:00"), winner: "watch:W2", contribution: 1100 },
      { start: at("10:00"), end: at("10:15"), winner: "phone:P1", contribution: 500 },
      { start: at("14:00"), end: at("15:00"), winner: "phone:P2", contribution: 3000 },
    ],
  );
  // 10:15 to 14:00 is a real gap: nobody recorded it, so it is not a segment.
  assert.ok(!result.segments.some((s) => s.start === at("10:15")));
  assert.deepEqual(
    result.segments.find((s) => s.start === at("09:15")).coveredBy,
    ["phone:P1", "watch:W1"],
    "the overlap is visible, not just its outcome",
  );
});

test("worked example: the 1,500 removed is the phone's 45 overlapped minutes, and the invariant holds", () => {
  const result = resolveOverlaps(workedExample(), WATCH_FIRST);
  const check = checkResolution(result);
  assert.equal(check.ok, true);
  assert.equal(check.naiveSum, 7500);
  assert.equal(check.removed, 1500);
  assert.equal(check.removed, 2000 * (45 / 60), "P1 pro rata over 09:15-10:00, where the watch already counted");

  // A sweep that counted some interval twice would land above the naive sum.
  const broken = { ...result, total: result.naiveSum + 700 };
  assert.equal(checkResolution(broken).ok, false);
});

// ---------------------------------------------------------------------------
// Boundaries and determinism
// ---------------------------------------------------------------------------

test("touching samples do not overlap: half-open intervals, no zero-width segments", () => {
  const result = resolveOverlaps(workedExample(), WATCH_FIRST);
  for (const s of result.segments) assert.ok(s.end > s.start, "no zero-width segment");
  // W1 ends at 09:30 and W2 starts there. W1 must not cover 09:30-10:00.
  const after = result.segments.find((s) => s.start === at("09:30"));
  assert.ok(!after.coveredBy.includes("watch:W1"));
});

test("input order does not change the answer", () => {
  const forward = resolveOverlaps(workedExample(), WATCH_FIRST);
  const reversed = resolveOverlaps(workedExample().reverse(), WATCH_FIRST);
  const shuffled = resolveOverlaps(
    [2, 0, 3, 1].map((i) => workedExample()[i]),
    WATCH_FIRST,
  );
  assert.deepEqual(reversed, forward);
  assert.deepEqual(shuffled, forward);
});

test("equal priority ties go to the shorter sample, then to a stable key", () => {
  const priority = createSourcePriority(["watch"]);
  const result = resolveOverlaps(
    [
      sample("long", "watch", "09:00", "10:00", 600),
      sample("short", "watch", "09:00", "09:10", 200),
    ],
    priority,
  );
  assert.equal(result.segments[0].winner, "watch:short", "finer granularity smears less");
  assert.equal(result.total, 700, "200 from the short sample, then 600 x 50/60 = 500 from the long one");

  const tied = [sample("b", "ring", "09:00", "09:30", 300), sample("a", "ring", "09:00", "09:30", 900)];
  const ring = createSourcePriority(["ring"]);
  assert.equal(resolveOverlaps(tied, ring).segments[0].winner, "ring:a");
  assert.equal(resolveOverlaps(tied.reverse(), ring).segments[0].winner, "ring:a");
});

// ---------------------------------------------------------------------------
// Priority is an input, per (user, metric)
// ---------------------------------------------------------------------------

test("a user override reorders the priority and changes the number, so the table must be stored", () => {
  const phoneFirst = createSourcePriority(["phone", "watch"]);
  const result = resolveOverlaps(workedExample(), phoneFirst);
  // 09:00-09:15 watch only (700), then the phone wins every overlap:
  // 500 + 1,000 for 09:15-10:00, its own tail 500, the afternoon 3,000.
  assert.equal(result.total, 5700);
  assert.notEqual(result.total, resolveOverlaps(workedExample(), WATCH_FIRST).total);
});

test("the resolved total may legitimately fall below the largest single source", () => {
  const result = resolveOverlaps(
    [sample("w", "watch", "09:00", "10:00", 500), sample("p", "phone", "09:00", "10:00", 3000)],
    WATCH_FIRST,
  );
  assert.equal(result.total, 500, "resolution picks a winner per interval, not the largest value");
  assert.equal(checkResolution(result).ok, true, "and that is not an invariant violation");
});

test("an alias keeps one device that changed source keys from competing against itself", () => {
  const samples = [
    sample("s1", "tracker-app", "09:00", "10:00", 1000),
    // The same phone, recorded under its newer source key.
    sample("p1", "phone:device-key-2026", "09:00", "10:00", 1200),
  ];
  const without = createSourcePriority(["watch", "phone", "tracker-app"]);
  const withAlias = createSourcePriority(["watch", "phone", "tracker-app"], {
    aliases: { "phone:device-key-2026": "phone" },
  });

  const unaliased = resolveOverlaps(samples, without);
  assert.equal(unaliased.total, 1000, "the unrecognised key ranks last and loses");
  assert.deepEqual(unaliased.unrankedSources, ["phone:device-key-2026"], "and the gap in the table is reported");

  const aliased = resolveOverlaps(samples, withAlias);
  assert.equal(aliased.total, 1200);
  assert.equal(aliased.segments[0].source, "phone");
  assert.deepEqual(aliased.unrankedSources, []);
});

test("a malformed priority table is rejected rather than guessed at", () => {
  assert.throws(() => createSourcePriority([]), TypeError);
  assert.throws(() => createSourcePriority(["watch", "watch"]), TypeError);
  assert.throws(() => createSourcePriority(["watch"], { aliases: { old: "phone" } }), TypeError);
  assert.throws(() => createSourcePriority(["watch", "old"], { aliases: { old: "watch" } }), TypeError);
});

// ---------------------------------------------------------------------------
// What never enters the sweep
// ---------------------------------------------------------------------------

test("a redelivered sample is counted once, and a higher version replaces it", () => {
  const samples = [...workedExample(), sample("P2", "phone", "14:00", "15:00", 3000)];
  const result = resolveOverlaps(samples, WATCH_FIRST);
  assert.equal(result.total, 6000, "the replayed afternoon walk does not double");
  assert.deepEqual(result.redelivered, ["phone:P2"]);

  const edited = dedupeRedeliveries([
    sample("P2", "phone", "14:00", "15:00", 3000, { version: 1 }),
    sample("P2", "phone", "14:00", "15:00", 3200, { version: 2 }),
    sample("P2", "phone", "14:00", "15:00", 3000, { version: 1 }),
  ]);
  assert.equal(edited.unique.length, 1);
  assert.equal(edited.unique[0].value, 3200, "a late copy of v1 does not undo v2");
});

test("instantaneous samples are set aside, never divided by zero", () => {
  const scale = [
    { id: "s1", source: "scale-a", start: at("07:00"), end: at("07:00"), value: 81.4 },
    { id: "s2", source: "scale-b", start: at("07:00") + 3000, end: at("07:00") + 3000, value: 81.4 },
  ];
  const result = resolveOverlaps([...workedExample(), ...scale], createSourcePriority(["watch", "phone"]));
  assert.equal(result.total, 6000);
  assert.ok(Number.isFinite(result.total));
  assert.deepEqual(
    result.excluded.map((e) => [e.key, e.reason]),
    [
      ["scale-a:s1", EXCLUSION.INSTANTANEOUS],
      ["scale-b:s2", EXCLUSION.INSTANTANEOUS],
    ],
  );
});

test("manual entries do not compete with a sensor, and are returned rather than dropped", () => {
  const typed = sample("M1", "watch", "14:00", "15:00", 9000, { manual: true });
  const result = resolveOverlaps([...workedExample(), typed], WATCH_FIRST);
  assert.equal(result.total, 6000, "a typed 9,000 at priority 1 does not beat the phone's measured 3,000");
  assert.equal(result.excluded.length, 1);
  assert.equal(result.excluded[0].reason, EXCLUSION.MANUAL_ENTRY);
  assert.equal(result.excluded[0].sample.value, 9000, "the user's row survives for export and the UI");
});

test("bad input fails loudly instead of producing a number", () => {
  assert.throws(() => resolveOverlaps([{ source: "watch", start: 0, end: 1, value: 1 }], WATCH_FIRST), TypeError);
  assert.throws(() => resolveOverlaps([sample("x", "watch", "10:00", "09:00", 1)], WATCH_FIRST), RangeError);
  assert.throws(() => resolveOverlaps([sample("x", "watch", "09:00", "10:00", -5)], WATCH_FIRST), RangeError);
  assert.throws(() => resolveOverlaps(workedExample(), { ranked: ["watch"] }), TypeError);
});

test("a day nobody recorded resolves to null, not to a zero that was never observed", () => {
  assert.equal(resolveOverlaps([], WATCH_FIRST).total, null);
  const onlyTyped = resolveOverlaps([sample("M1", "watch", "14:00", "15:00", 900, { manual: true })], WATCH_FIRST);
  assert.equal(onlyTyped.total, null, "no sensor covered the day; the typed entry is returned for its own path");
  assert.equal(onlyTyped.excluded.length, 1);
  assert.equal(checkResolution(onlyTyped).ok, true);
});
