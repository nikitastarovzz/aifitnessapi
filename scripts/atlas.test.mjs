/**
 * Tests for scripts/lib/atlas.mjs, the model and drawing behind /atlas.
 *
 * Run: npm run test:atlas
 *
 * Runs on the real datasets and graveyard: every directory product must be
 * placed once, in its own category, with its own billing label; every
 * graveyard entry must be on the poster; the date must be an input's date;
 * and drawing twice must give the same bytes. The committed SVG must be the
 * one the current data draws (rerun node scripts/build-atlas.mjs if not).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { atlasModel, atlasSvg, esc, wrap } from "./lib/atlas.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { GRAVEYARD } = await import(new URL("../src/data/graveyard.ts", import.meta.url).href);
const { API_ENTRIES } = await import(new URL("../src/data/apis.ts", import.meta.url).href).catch(() => ({ API_ENTRIES: null }));
const dir = JSON.parse(fs.readFileSync(path.join(ROOT, "public/datasets/fitness-apis-2026.json"), "utf8"));
const changes = JSON.parse(fs.readFileSync(path.join(ROOT, "public/datasets/fitness-api-changes-2026.json"), "utf8"));
const model = atlasModel({ root: ROOT, graveyard: GRAVEYARD });
const svg = atlasSvg(model);

test("every directory product is placed once, in its category, with its billing", () => {
  const placed = model.categories.flatMap((c) => c.items.map((i) => ({ ...i, category: c.id })));
  assert.equal(new Set(placed.map((p) => p.id)).size, placed.length);
  assert.equal(placed.length, model.total);
  for (const p of placed) {
    const src = dir.items.find((i) => i.id === p.id);
    assert.ok(src, p.id);
    assert.equal(src.category, p.category);
    assert.equal(src.devCost, p.devCost);
    assert.equal(Boolean(src.approvalGate), p.gated);
  }
  // The directory's own exclusions (categories, not products) stay off.
  assert.ok(!placed.some((p) => p.id === "llm-apis"));
  if (API_ENTRIES) assert.equal(placed.length, API_ENTRIES.length);
});

test("every graveyard entry and product name is on the poster, escaped", () => {
  for (const g of GRAVEYARD) assert.ok(svg.includes(esc(g.name)), g.name);
  for (const c of model.categories) for (const i of c.items) assert.ok(svg.includes(esc(i.label)), i.label);
});

test("the date is the newest input date, not today", () => {
  const dates = [...GRAVEYARD.map((g) => g.source.checkedOn), ...changes.items.map((c) => c.verifiedOn)].sort();
  assert.equal(model.asOf, dates.at(-1));
});

test("recent changes are confirmed and within the twelve months before the data date", () => {
  const floor = `${Number(model.asOf.slice(0, 4)) - 1}${model.asOf.slice(4)}`;
  const expect = changes.items.filter((c) => c.status === "confirmed" && c.sortDate > floor).map((c) => c.title);
  assert.deepEqual(model.recent.map((r) => r.title), expect);
});

test("drawing is deterministic and the committed SVG is current", () => {
  assert.equal(atlasSvg(model), svg);
  assert.equal(fs.readFileSync(path.join(ROOT, "public/atlas/fitness-api-atlas.svg"), "utf8"), svg);
});

test("wrap never splits words and esc escapes markup", () => {
  assert.deepEqual(wrap("Open Wearables adds a paid Pro plan and ships outbound webhooks", 20), ["Open Wearables adds", "a paid Pro plan and", "ships outbound", "webhooks"]);
  assert.equal(esc(`a<b & "c"`), "a&lt;b &amp; &quot;c&quot;");
});
