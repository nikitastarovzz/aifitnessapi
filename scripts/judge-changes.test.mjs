// node --test scripts/judge-changes.test.mjs
// Pins the change judge in scripts/lib/judge-changes.mjs: every verdict at
// its boundary, the due rule and the before block. Synthetic fixtures only.
import test from "node:test";
import assert from "node:assert/strict";
import { due, verdict, beforeBlock, parseLog, curveRatio, MIN_IMPRESSIONS } from "./lib/judge-changes.mjs";
import { expectedCtr } from "./lib/gsc-sections.mjs";

// Position 5 throughout, so the curve's CTR (6%) is the same before and after
// and the ratio test is a plain CTR test.
const row = (impressions, clicks, position = 5) => ({ impressions, clicks, position });

// ── verdict ──────────────────────────────────────────────────────────────
test("verdict: no row or zero impressions is gone, or not-shown for a new page", () => {
  assert.equal(verdict("retitle", row(100, 5), null).verdict, "gone");
  assert.equal(verdict("faq", row(100, 5), row(0, 0)).verdict, "gone");
  assert.equal(verdict("new-page", row(0, 0), null).verdict, "not-shown");
  assert.equal(verdict("new-page", row(0, 0), row(0, 0)).verdict, "not-shown");
});

test("verdict: a new page with any impression is shown, whatever the count", () => {
  const v = verdict("new-page", row(0, 0), row(1, 0, 40));
  assert.equal(v.verdict, "shown");
  assert.equal(v.action, "keep");
});

test("verdict: under 50 impressions before or after is thin", () => {
  assert.equal(MIN_IMPRESSIONS, 50);
  assert.equal(verdict("section", row(49, 10), row(500, 50)).verdict, "thin");
  assert.equal(verdict("section", row(500, 10), row(49, 10)).verdict, "thin");
  assert.match(verdict("section", row(49, 10), row(500, 50)).why, /^too few impressions to judge/);
  assert.notEqual(verdict("section", row(50, 3), row(50, 3)).verdict, "thin");
});

test("verdict: better needs the ratio up 25% and two more clicks", () => {
  // before 100 impressions, 8 clicks (8%); after 100 impressions, 10 clicks (10%): ratio x1.25, +2 clicks
  assert.equal(verdict("faq", row(100, 8), row(100, 10)).verdict, "better");
  // x1.25 but only +1 click: 4 -> 5 at 100 impressions
  assert.equal(verdict("faq", row(100, 4), row(100, 5)).verdict, "flat");
  // +2 clicks but the ratio is up under 25%: 10/100 -> 12/100 is x1.2
  assert.equal(verdict("faq", row(100, 10), row(100, 12)).verdict, "flat");
  // From zero clicks: any ratio is >= 1.25 x 0, so two clicks is better
  assert.equal(verdict("faq", row(100, 0), row(100, 2)).verdict, "better");
  assert.equal(verdict("faq", row(100, 0), row(100, 1)).verdict, "flat");
});

test("verdict: worse needs the ratio at 60% or less from at least 3 clicks", () => {
  // 10/100 -> 6/100 is exactly 0.6
  const w = verdict("retitle", row(100, 10), row(100, 6));
  assert.equal(w.verdict, "worse");
  assert.equal(w.action, "revert");
  // 0.61: flat
  assert.equal(verdict("retitle", row(100, 100), row(100, 61)).verdict, "flat");
  // 3 clicks before, none after: worse
  assert.equal(verdict("retitle", row(100, 3), row(100, 0)).verdict, "worse");
  // 2 clicks before, none after: too few clicks to call it worse
  assert.equal(verdict("retitle", row(100, 2), row(100, 0)).verdict, "flat");
});

test("verdict: only a worse retitle is reverted", () => {
  assert.equal(verdict("faq", row(100, 10), row(100, 6)).action, "keep");
  assert.equal(verdict("section", row(100, 10), row(100, 6)).action, "keep");
  assert.equal(verdict("retitle", row(100, 8), row(100, 10)).action, "keep");
  assert.equal(verdict("retitle", null, null).action, "keep");
});

test("verdict reads click-through against the curve at each position", () => {
  // Same 5% CTR, but at position 1 after (curve 28%) instead of position 10
  // before (curve 2.5%): the ratio collapses, so it is worse, not flat.
  const before = row(200, 10, 10);
  const after = row(200, 10, 1);
  assert.ok(curveRatio(after) < 0.6 * curveRatio(before));
  assert.equal(verdict("retitle", before, after).verdict, "worse");
  assert.equal(curveRatio(row(100, 6, 5)), 0.06 / expectedCtr(5));
});

// ── due ──────────────────────────────────────────────────────────────────
const RANGE = { start: "2026-11-15", end: "2026-12-12" };
const m = (path, kind = "retitle") => ({ path, kind, before: row(100, 5) });

test("due: measured entries dated strictly before the window start", () => {
  const entries = [
    { date: "2026-11-14", action: "update", measure: m("/a") },
    { date: "2026-11-15", action: "update", measure: m("/b") },
    { date: "2026-11-10", action: "update" },
    { date: "2026-11-01", action: "new-page", measure: m("/c", "new-page") },
  ];
  assert.deepEqual(due(entries, RANGE).map((d) => d.entry.measure.path), ["/a", "/c"]);
});

test("due: an entry with a later judge line naming its date and path is skipped", () => {
  const entries = [
    { date: "2026-11-01", action: "update", measure: m("/a") },
    { date: "2026-11-01", action: "update", measure: m("/b") },
    { date: "2026-11-02", action: "update", measure: m("/c") },
    { date: "2026-12-14", action: "judge", ref: { date: "2026-11-01", path: "/a" }, verdict: "flat" },
    { date: "2026-12-14", action: "judge", ref: { date: "2026-10-01", path: "/b" }, verdict: "flat" }, // other date
    { date: "2026-12-14", action: "judge", ref: { date: "2026-11-02", path: "/c/" }, verdict: "flat" }, // same page
  ];
  assert.deepEqual(due(entries, RANGE).map((d) => d.entry.measure.path), ["/b"]);
});

test("due: a judge line before the entry does not count", () => {
  const entries = [
    { date: "2026-11-01", action: "judge", ref: { date: "2026-11-01", path: "/a" }, verdict: "flat" },
    { date: "2026-11-01", action: "update", measure: m("/a") },
  ];
  assert.equal(due(entries, RANGE).length, 1);
});

test("parseLog: tolerates a space after the colon, skips blank lines, reports bad ones", () => {
  const { entries, bad } = parseLog('{"date": "2026-11-01", "action": "spoke"}\n\n{"date":"2026-11-02","action":"x"}\n{oops\n');
  assert.equal(entries.length, 2);
  assert.deepEqual(bad, [4]);
});

// ── beforeBlock ──────────────────────────────────────────────────────────
test("beforeBlock: the page's row with position to one decimal, or zeros", () => {
  const range = { start: "2026-10-15", end: "2026-11-11" };
  assert.deepEqual(beforeBlock({ path: "/a", impressions: 371, clicks: 14, position: 6.96 }, range), {
    start: "2026-10-15",
    end: "2026-11-11",
    impressions: 371,
    clicks: 14,
    position: 7,
  });
  assert.deepEqual(beforeBlock({ impressions: 10, clicks: 0, position: 12.349 }, range).position, 12.3);
  assert.deepEqual(beforeBlock(null, range), { start: "2026-10-15", end: "2026-11-11", impressions: 0, clicks: 0, position: 0 });
});
