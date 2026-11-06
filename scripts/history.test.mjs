/**
 * Tests for src/lib/historyCore.mjs, the model and drawing behind /history
 * and the poster in public/history/ (ops/VIRAL-20-2026-11-06.md item 10).
 *
 * Run: npm run test:history
 *
 * Runs on the real graveyard and changes records: every dated record is
 * placed once at its own precision, every mark links a source, filters and
 * deep links behave, drawing twice gives the same bytes, and the committed
 * poster is the one the current records draw (rerun node
 * scripts/build-history.mjs if not).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fmtDate, historyModel, historySvg, layoutYear, parseFilter, passes, precisionOf, vendorOf, yearSpan } from "../src/lib/historyCore.mjs";

const { GRAVEYARD } = await import(new URL("../src/data/graveyard.ts", import.meta.url).href);
const { CHANGE_EVENTS } = await import(new URL("../src/data/changes.ts", import.meta.url).href);
const model = historyModel({ graveyard: GRAVEYARD, changes: CHANGE_EVENTS });

test("precision is kept: a day is a point, a month or a year a span", () => {
  assert.equal(precisionOf("2026-11-02"), "day");
  assert.equal(precisionOf("2026-10"), "month");
  assert.equal(precisionOf("2026"), "year");
  assert.equal(precisionOf(null), null);
  const [a, b] = yearSpan("2026-11-02");
  assert.equal(a, b);
  assert.deepEqual(yearSpan("2026-10"), [9 / 12, 10 / 12]);
  assert.deepEqual(yearSpan("2026"), [0, 1]);
  assert.equal(fmtDate("2026-11-02"), "November 2, 2026");
  assert.equal(fmtDate("2025-12"), "December 2025");
  assert.equal(fmtDate("2026"), "2026");
});

test("vendor is the company the title names first, as a whole word", () => {
  assert.equal(vendorOf("Thryve deprecates its Fitbit data source").id, "thryve");
  assert.equal(vendorOf("Fitbit accounts: Google Account consolidation gate").id, "fitbit");
  assert.equal(vendorOf("Fitbit Web API turn-off moves to November 2, 2026").id, "fitbit");
  assert.equal(vendorOf("MediaPipe Pose (Legacy Solution)").id, "google");
  assert.equal(vendorOf("ANT+ membership and certification programs").id, "ant-plus");
  assert.equal(vendorOf("Terraform things").id, "other");
  assert.equal(vendorOf("no name here", "Google (Fitbit)").id, "google");
});

test("every dated graveyard date and tracker entry is placed once, or merged with its graveyard twin", () => {
  const ids = new Set(model.marks.map((m) => m.id));
  assert.equal(ids.size, model.marks.length);
  for (const g of GRAVEYARD) {
    if (g.end) assert.ok(ids.has(`${g.id}--end`), g.id);
    else assert.ok(model.undated.some((u) => u.id === `${g.id}--end`), g.id);
    for (const m of g.milestones ?? []) assert.ok(ids.has(`${g.id}--${m.date}`), `${g.id} ${m.date}`);
    if (g.launched) assert.ok(ids.has(`${g.id}--launch`), g.id);
  }
  const graveDays = new Set(model.marks.filter((m) => m.kind !== "change").map((m) => `${m.date}|${m.page}`));
  for (const c of CHANGE_EVENTS.filter((e) => e.status !== "watch")) {
    const drawn = model.marks.some((m) => m.kind === "change" && m.title === c.title && m.date === c.date);
    assert.ok(drawn || graveDays.has(`${c.date}|${c.page.href}`), c.title);
  }
});

test("every mark links a source and keeps its source date verbatim", () => {
  for (const m of [...model.marks, ...model.undated]) {
    assert.ok(m.href && (m.href.startsWith("https://") || m.href.startsWith("/")), m.id);
    if (m.kind !== "change") assert.ok(m.external, `${m.id} should link the vendor's page`);
  }
  const datesIn = new Set([...GRAVEYARD.flatMap((g) => [g.end, g.launched?.date, ...(g.milestones ?? []).map((x) => x.date)]), ...CHANGE_EVENTS.map((c) => c.date)]);
  for (const m of model.marks) assert.ok(datesIn.has(m.date), m.id);
  assert.ok(model.marks.every((m, i, a) => i === 0 || Number(a[i - 1].date.slice(0, 4)) <= Number(m.date.slice(0, 4))));
});

test("the drawing has one link per mark, with filter attributes, and is deterministic", () => {
  const svg = historySvg(model);
  for (const m of [...model.marks, ...model.undated]) {
    assert.ok(svg.includes(`data-id="${m.id}" data-vendor="${m.vendorId}" data-kind="${m.kind}"`), m.id);
  }
  assert.equal((svg.match(/<a class="fh-mark"/g) ?? []).length, model.marks.length + model.undated.length);
  assert.equal(svg, historySvg(model));
  assert.ok(!/NaN|undefined/.test(svg));
  assert.ok(svg.length < 2 * 1024 * 1024);
});

test("lanes never overlap", () => {
  const byYear = new Map();
  for (const m of model.marks) byYear.set(m.date.slice(0, 4), [...(byYear.get(m.date.slice(0, 4)) ?? []), m]);
  for (const marks of byYear.values()) {
    const { placed, lanes } = layoutYear(marks);
    assert.equal(placed.length, marks.length);
    assert.ok(lanes >= 1);
  }
});

test("deep links: unknown values are dropped; filters combine", () => {
  const f = parseFilter("?vendor=google&kind=end,bogus", model);
  assert.deepEqual(f, { vendor: "google", kinds: ["end"] });
  assert.deepEqual(parseFilter("?vendor=nobody", model), { vendor: null, kinds: [] });
  const shown = model.marks.filter((m) => passes(m, f));
  assert.ok(shown.length > 0);
  assert.ok(shown.every((m) => m.vendorId === "google" && m.kind === "end"));
  assert.equal(model.marks.filter((m) => passes(m, { vendor: null, kinds: [] })).length, model.marks.length);
});

test("the committed poster is what the current records draw", () => {
  const file = new URL("../public/history/fitness-api-history.svg", import.meta.url);
  assert.equal(fs.readFileSync(file, "utf8"), historySvg(model, { poster: true }), "rerun node scripts/build-history.mjs");
  assert.ok(fs.statSync(new URL("../public/history/fitness-api-history.png", import.meta.url)).size > 10_000);
});
