// Tests for src/lib/researchStats.mjs, the figures of the /research studies,
// and for the published datasets they are recomputed from.
// Run: npm run test:research
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  daysBetween,
  driftStats,
  headlines,
  median,
  minusDays,
  noticeStats,
  pct,
  pricingStats,
} from "../src/lib/researchStats.mjs";

const g = (o) => ({
  file: "a.json",
  source: "example.com",
  writtenOn: "2026-10-01",
  writtenCommit: "aaaaaaa",
  endedOn: null,
  endedCommit: null,
  endKind: null,
  cause: null,
  kind: null,
  statement: null,
  rows: 1,
  ...o,
});

test("date helpers count whole UTC days across a month end", () => {
  assert.equal(daysBetween("2026-06-01", "2026-09-01"), 92);
  assert.equal(daysBetween("2021-10-01", "2021-11-01"), 31);
  assert.equal(daysBetween("2011-06-24", "2012-01-01"), 191);
  assert.equal(minusDays("2026-11-05", 14), "2026-10-22");
  assert.equal(minusDays("2026-03-01", 1), "2026-02-28");
});

test("median and pct", () => {
  assert.equal(median([]), null);
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 10]), 2.5);
  assert.equal(pct(1, 3), "33%");
  assert.equal(pct(0, 0), "0%");
});

test("drift: a source change counts once per host per commit, rows are weighted", () => {
  const items = [
    g({ rows: 10 }),
    g({ source: "a.com", rows: 3, endedOn: "2026-10-05", endedCommit: "c1", endKind: "quote", cause: "source-changed", kind: "fact" }),
    g({ source: "a.com", file: "b.json", rows: 2, endedOn: "2026-10-05", endedCommit: "c1", endKind: "removed", cause: "source-changed", kind: "fact" }),
    g({ source: "b.com", rows: 1, endedOn: "2026-10-20", endedCommit: "c2", endKind: "url", cause: "source-changed", kind: null }),
    g({ source: "c.com", rows: 4, endedOn: "2026-10-05", endedCommit: "c1", endKind: "url", cause: "our-change" }),
  ];
  const s = driftStats(items, "2026-10-31");
  assert.equal(s.rows, 20);
  assert.equal(s.driftRows, 6);
  assert.equal(s.driftEvents, 2, "a.com in c1 is one event though it spans two files");
  assert.equal(s.driftSources, 2);
  assert.equal(s.byCause["our-change"], 4);
  assert.deepEqual(s.kinds, { fact: 1, wording: 0, mixed: 0, "not stated": 1 });
  // 14-day window: rows written by 2026-10-17 (all of them), changed within 14 days: a.com's 5 rows (4 days); b.com took 19 days.
  const w14 = s.windows.find((w) => w.days === 14);
  assert.equal(w14.base, 20);
  assert.equal(w14.changed, 5);
  assert.equal(w14.share, "25%");
  // Median age at drift over the 6 drift rows: five at 4 days, one at 19.
  assert.equal(s.medianDaysToDrift, 4);
  assert.equal(s.bySource[0].source, "a.com");
});

test("drift: rows written after the window cutoff are not in its base", () => {
  const items = [g({ writtenOn: "2026-10-30", rows: 50 }), g({ writtenOn: "2026-10-01", rows: 5 })];
  const s = driftStats(items, "2026-10-31");
  assert.equal(s.windows.find((w) => w.days === 14).base, 5);
});

test("notice: only rows with a computed noticeDays are measured; reasons are tallied", () => {
  const rows = [
    { id: "a", noticeDays: 92, exclusion: null },
    { id: "b", noticeDays: 31, exclusion: null },
    { id: "c", noticeDays: null, exclusion: "no end date" },
    { id: "d", noticeDays: null, exclusion: "no end date" },
    { id: "e", noticeDays: null, exclusion: "end date given only as a year" },
  ];
  const s = noticeStats(rows);
  assert.equal(s.measured, 2);
  assert.equal(s.median, 61.5);
  assert.equal(s.min, 31);
  assert.equal(s.max, 92);
  assert.deepEqual(s.reasons, { "no end date": 2, "end date given only as a year": 1 });
  assert.deepEqual(s.list.map((r) => r.id), ["b", "a"]);
});

test("pricing: excluded rows are listed but never counted", () => {
  const rows = [
    { vendor: "A", category: "w", categoryLabel: "W", class: "free" },
    { vendor: "B", category: "w", categoryLabel: "W", class: "published-price", unpricedTier: "x" },
    { vendor: "C", category: "a", categoryLabel: "A", class: "no-published-price", freeEntry: "y" },
    { vendor: "D", category: "a", categoryLabel: "A", class: null, excluded: "reason" },
  ];
  const s = pricingStats(rows);
  assert.equal(s.included, 3);
  assert.equal(s.excluded, 1);
  assert.deepEqual(s.byClass, { "published-price": 1, "no-published-price": 1, free: 1 });
  assert.equal(s.publishedWithUnpricedTier, 1);
  assert.equal(s.withFreeEntry, 1);
  assert.equal(s.byCategory.find((c) => c.category === "a").total, 1);
  const h = headlines("pricing-transparency", rows);
  assert.equal(h.find((x) => x.id === "pricing-published").value, "1 of 3");
});

test("headlines reject an unknown study", () => {
  assert.throws(() => headlines("nope", []));
});

// The published datasets: the invariants the pages' figures depend on.
const load = (slug) => JSON.parse(fs.readFileSync(`public/datasets/${slug}.json`, "utf8"));

test("published docs-drift rows: causes only on ended rows, statements only with a cause", () => {
  const d = load("fitness-api-docs-drift-2026");
  assert.match(d.historyThrough, /^\d{4}-\d{2}-\d{2}$/);
  for (const i of d.items) {
    assert.ok(i.rows >= 1);
    if (i.endedOn === null) assert.equal(i.cause, null);
    else assert.ok(["source-changed", "our-change", "source-unreachable", "not-stated"].includes(i.cause));
    if (i.cause === "not-stated") assert.equal(i.statement, null);
    if (i.endedOn) assert.ok(i.endedOn >= i.writtenOn);
  }
  assert.equal(d.items.reduce((n, i) => n + i.rows, 0), d.stats.evidenceRows);
});

test("published shutdown-notice rows: notice only where both dates are to the day", () => {
  const d = load("fitness-api-shutdown-notice-2026");
  for (const i of d.items) {
    if (i.noticeDays !== null) {
      assert.match(i.announced, /^\d{4}-\d{2}-\d{2}$/);
      assert.match(i.end, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(i.noticeDays, daysBetween(i.announced, i.end));
      assert.ok(i.announcementQuote && i.announcementUrl);
    } else assert.ok(i.exclusion);
  }
});

test("published pricing rows: each counted line is quoted in its evidence file at its URL", () => {
  const d = load("fitness-api-pricing-transparency-2026");
  for (const r of d.items.filter((x) => x.class)) {
    const ev = JSON.parse(fs.readFileSync(r.evidenceFile, "utf8"));
    assert.ok(ev.some((e) => e.url === r.url && e.quote.includes(r.line)), `${r.vendor}: line not in ${r.evidenceFile}`);
    for (const extra of [r.freeEntry, r.unpricedTier].filter(Boolean)) {
      assert.ok(ev.some((e) => e.quote.includes(extra)), `${r.vendor}: "${extra}" not in ${r.evidenceFile}`);
    }
  }
  assert.ok(d.items.find((r) => r.vendor === "KinesteX")?.excluded, "KinesteX is listed and not counted");
});
