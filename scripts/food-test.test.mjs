/**
 * Tests for the food-database test: the matching and arithmetic in
 * scripts/fetch-food-test.mjs, and the generated src/data/foodDatabaseTest.ts
 * and public/food-test/ files it wrote.
 *
 * Run: npm run test:food-test
 *
 * The data checks recompute every median, difference and summary figure from
 * the rows' own product values, so a hand edit of the generated module, or a
 * generator change that stops using the published rule, fails here.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const gen = await import(new URL("./fetch-food-test.mjs", import.meta.url).href);
const data = await import(new URL("../src/data/foodDatabaseTest.ts", import.meta.url).href);
const { FOOD_TEST_ROWS: rows, FOOD_TEST_SUMMARY: summary } = data;

test("median: odd, even, empty, nulls ignored", () => {
  assert.equal(gen.median([3, 1, 2]), 2);
  assert.equal(gen.median([4, 1, 3, 2]), 2.5);
  assert.equal(gen.median([]), null);
  assert.equal(gen.median([null, 5]), 5);
});

test("pctDiff: relative to USDA, null when USDA is 0 or a value is missing", () => {
  assert.equal(gen.pctDiff(110, 100), 10);
  assert.equal(gen.pctDiff(90, 100), -10);
  assert.equal(gen.pctDiff(1, 0), null);
  assert.equal(gen.pctDiff(null, 10), null);
});

test("usdaValues: 208 first, then 958, then 957; kcal only", () => {
  const f = (ns) => ({ foodNutrients: ns.map(([number, amount, unitName, name = "x"]) => ({ number, amount, unitName, name })) });
  const base = [["203", 1, "g"], ["204", 2, "g"], ["205", 3, "g"]];
  assert.equal(gen.usdaValues(f([...base, ["958", 60, "kcal"], ["208", 61, "kcal"]])).energyNutrient.number, "208");
  assert.equal(gen.usdaValues(f([...base, ["957", 59, "kcal"], ["958", 60, "kcal"]])).energyKcal, 60);
  assert.equal(gen.usdaValues(f([...base, ["957", 59, "kcal"]])).energyNutrient.number, "957");
  assert.equal(gen.usdaValues(f([...base, ["208", 250, "kJ"]])).energyKcal, null);
});

test("offSide: a product counts only with all four values per 100 g, kcal not converted from kJ", () => {
  const p = (code, n) => ({ code, categories_tags: ["en:x"], nutriments: n });
  const full = { "energy-kcal_100g": 100, proteins_100g: 1, fat_100g: 2, carbohydrates_100g: 3 };
  const side = gen.offSide({
    count: 3,
    products: [p("1", full), p("2", { ...full, fat_100g: undefined }), p("3", { ...full, "energy-kcal_100g": 200 }), p("4", { ...full, "energy-kcal_100g": undefined, "energy-kj_100g": 418 })],
  });
  assert.equal(side.productsRead, 4);
  assert.deepEqual(side.counted.map((x) => x.code), ["1", "3"]);
  assert.equal(side.median.energyKcal, 150);
  assert.deepEqual(side.range.energyKcal, [100, 200]);
});

test("request URLs: the USDA key is a parameter, never in the cache meta; OFF asks for the first page only", () => {
  assert.match(gen.fdcFoodsUrl([1, 2]), /fdcIds=1,2&format=abridged&nutrients=203,204,205,208,957,958&api_key=DEMO_KEY$/);
  assert.match(gen.offSearchUrl("en:bananas"), /categories_tags=en%3Abananas&.*sort_by=unique_scans_n&page_size=10/);
  assert.equal(gen.chunks([1, 2, 3, 4, 5], 2).length, 3);
});

test("the list: 50 foods, unique ids and fdcIds, every food has a category tag", () => {
  assert.equal(gen.FOODS.length, gen.EXPECTED_FOODS);
  assert.equal(new Set(gen.FOODS.map((f) => f.id)).size, gen.FOODS.length);
  assert.equal(new Set(gen.FOODS.map((f) => f.usda.fdcId)).size, gen.FOODS.length);
  for (const f of gen.FOODS) assert.match(f.off, /^en:[a-z0-9-]+$/, f.id);
});

test("generated rows follow the list and the rule", () => {
  assert.equal(rows.length, gen.FOODS.length);
  rows.forEach((r, i) => {
    const f = gen.FOODS[i];
    assert.equal(r.id, f.id);
    assert.equal(r.usda.fdcId, f.usda.fdcId);
    assert.equal(r.usda.description, f.usda.description);
    for (const k of gen.KEYS) assert.notEqual(r.usda.values[k], null, `${r.id} USDA ${k}`);
    assert.equal(r.off.productsCounted, r.off.products.length);
    for (const p of r.off.products) assert.ok(gen.complete(p.values), `${r.id} ${p.code} incomplete`);
    if (r.off.productsCounted === 0) {
      assert.equal(r.off.median, null);
      for (const k of gen.KEYS) assert.equal(r.diffPct[k], null);
      return;
    }
    assert.equal(r.off.top.code, r.off.products[0].code);
    for (const k of gen.KEYS) {
      const med = gen.median(r.off.products.map((p) => p.values[k]));
      assert.equal(r.off.median[k], gen.round(med, 2), `${r.id} median ${k}`);
      assert.equal(r.diffPct[k], gen.round(gen.pctDiff(med, r.usda.values[k]), 1), `${r.id} diff ${k}`);
    }
  });
});

test("summary figures recompute from the rows", () => {
  const matched = rows.filter((r) => r.off.productsCounted > 0);
  assert.ok(matched.length >= gen.MIN_OFF_MATCHED);
  assert.equal(summary.matched, matched.length);
  assert.deepEqual(summary.unmatched, rows.filter((r) => r.off.productsCounted === 0).map((r) => r.id));
  for (const k of gen.KEYS) {
    const m = gen.median(matched.map((r) => r.diffPct[k]).filter((x) => x !== null).map(Math.abs));
    assert.equal(summary.medianAbsPct[k], gen.round(m, 1), k);
  }
  assert.equal(summary.within10PctEnergy, matched.filter((r) => Math.abs(r.diffPct.energyKcal) <= 10).length);
  assert.equal(summary.over25PctEnergy, matched.filter((r) => Math.abs(r.diffPct.energyKcal) > 25).length);
});

test("published files carry the ODbL notice and match the module", () => {
  const dir = new URL(`../${gen.PUBLIC_DIR}/`, import.meta.url);
  const doc = JSON.parse(readFileSync(new URL(`${gen.PUBLIC_SLUG}.json`, dir), "utf8"));
  assert.equal(doc.license, "ODbL 1.0");
  assert.equal(doc.notice, gen.ODBL_NOTICE);
  assert.deepEqual(doc.items, JSON.parse(JSON.stringify(rows)));
  const csv = readFileSync(new URL(`${gen.PUBLIC_SLUG}.csv`, dir), "utf8").trim().split("\n");
  assert.equal(csv[0], gen.CSV_COLUMNS.join(","));
  assert.equal(csv.length, rows.length + 1);
  const card = readFileSync(new URL(`${gen.PUBLIC_SLUG}.md`, dir), "utf8");
  assert.ok(card.includes(gen.ODBL_NOTICE));
  assert.ok(card.includes(gen.TERMS.usda.quote));
});
