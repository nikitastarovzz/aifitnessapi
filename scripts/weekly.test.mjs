/**
 * Tests for src/lib/weeklyCore.mjs, the week arithmetic and bucketing rule
 * behind /weekly (ops/VIRAL-20-2026-11-06.md item 9).
 *
 * Run: npm run test:weekly
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWeeks, isoWeek, weekBounds, weekLabel, weekRangeLabel, weekSummaryParts, WEEKLY_MIN_ITEMS } from "../src/lib/weeklyCore.mjs";

test("ISO weeks: Monday start, week 1 holds the first Thursday", () => {
  assert.equal(isoWeek("2026-11-02").id, "2026-w45"); // Monday
  assert.equal(isoWeek("2026-11-08").id, "2026-w45"); // Sunday
  assert.equal(isoWeek("2026-11-09").id, "2026-w46");
  assert.equal(isoWeek("2026-01-01").id, "2026-w01"); // Thursday
  assert.equal(isoWeek("2027-01-01").id, "2026-w53"); // Friday: last week of 2026
  assert.equal(isoWeek("2024-12-30").id, "2025-w01"); // Monday of 2025's first week
  assert.equal(isoWeek("2021-01-03").id, "2020-w53");
  assert.throws(() => isoWeek("2026-11"));
});

test("week bounds round-trip and labels", () => {
  assert.deepEqual(weekBounds("2026-w45"), { start: "2026-11-02", end: "2026-11-08" });
  assert.deepEqual(weekBounds("2026-w53"), { start: "2026-12-28", end: "2027-01-03" });
  assert.throws(() => weekBounds("2025-w53")); // 2025 has 52 weeks
  for (let d = Date.UTC(2024, 0, 1); d < Date.UTC(2028, 0, 1); d += 86_400_000) {
    const day = new Date(d).toISOString().slice(0, 10);
    const { start, end } = weekBounds(isoWeek(day).id);
    assert.ok(start <= day && day <= end, day);
  }
  assert.equal(weekRangeLabel("2026-w45"), "Nov 2–8, 2026");
  assert.equal(weekRangeLabel("2026-w40"), "Sep 28 – Oct 4, 2026");
  assert.equal(weekRangeLabel("2026-w53"), "Dec 28, 2026 – Jan 3, 2027");
  assert.equal(weekLabel("2026-w05"), "Week 5, 2026");
});

const it = (kind, date, key) => ({ kind, date, key: key ?? `${kind}:${date}:${Math.random()}` });

test("only day-dated records on or before the build day are placed", () => {
  const items = [
    it("change", "2026-11-03", "a"),
    it("change", "2026-11", "month"), // month precision: never placed
    it("change", "2026", "year"),
    it("release", "2026-11-04", "b"),
    it("page", "2026-11-05", "c"),
    it("graveyard", "2026-11-07", "future"), // after asOf
  ];
  const weeks = buildWeeks(items, "2026-11-06");
  assert.equal(weeks.length, 1);
  assert.deepEqual(weeks[0].items.map((i) => i.key).sort(), ["a", "b", "c"]);
  assert.equal(weeks[0].inProgress, true);
  assert.deepEqual(weeks[0].counts, { change: 1, graveyard: 0, release: 1, page: 1 });
});

test(`a week needs ${WEEKLY_MIN_ITEMS} records and one from outside the site`, () => {
  const onlyPages = [it("page", "2026-10-12"), it("page", "2026-10-13"), it("page", "2026-10-14"), it("page", "2026-10-15")];
  assert.equal(buildWeeks(onlyPages, "2026-11-06").length, 0);
  const two = [it("change", "2026-10-12"), it("release", "2026-10-13")];
  assert.equal(buildWeeks(two, "2026-11-06").length, 0);
  const ok = [...two, it("page", "2026-10-14")];
  const w = buildWeeks(ok, "2026-11-06");
  assert.equal(w.length, 1);
  assert.equal(w[0].id, "2026-w42");
  assert.equal(w[0].inProgress, false);
});

test("duplicate keys count once; weeks newest first; kinds in order", () => {
  const items = [
    it("page", "2026-10-14", "p"),
    it("release", "2026-10-13", "r"),
    it("release", "2026-10-13", "r"),
    it("change", "2026-10-12", "c"),
    it("change", "2026-11-03", "c2"),
    it("release", "2026-11-03", "r2"),
    it("graveyard", "2026-11-02", "g2"),
  ];
  const w = buildWeeks(items, "2026-11-06");
  assert.deepEqual(w.map((x) => x.id), ["2026-w45", "2026-w42"]);
  assert.deepEqual(w[1].items.map((i) => i.key), ["c", "r", "p"]);
  assert.deepEqual(w[0].items.map((i) => i.kind), ["change", "graveyard", "release"]);
  assert.throws(() => buildWeeks([it("rumor", "2026-10-12")], "2026-11-06"));
});

test("summary parts pluralize and skip empty kinds", () => {
  assert.deepEqual(weekSummaryParts({ change: 1, graveyard: 0, release: 3, page: 12 }), ["1 tracked change", "3 SDK or library releases", "12 new pages"]);
});

test("the real records: every placed record is day-dated and not after the build day", async () => {
  const R = new URL("../src/data/", import.meta.url).href;
  const { CHANGE_EVENTS } = await import(`${R}changes.ts`);
  const items = CHANGE_EVENTS.filter((e) => e.status !== "watch").map((e) => ({ kind: "change", date: e.date, key: e.title }));
  const asOf = "2026-11-06";
  for (const w of buildWeeks([...items, ...items.map((i) => ({ ...i, kind: "page", key: `p${i.key}` })), ...items.map((i) => ({ ...i, kind: "release", key: `r${i.key}` }))], asOf)) {
    for (const i of w.items) {
      assert.match(i.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(i.date <= asOf && i.date >= w.start && i.date <= w.end);
    }
  }
});
