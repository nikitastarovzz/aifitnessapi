#!/usr/bin/env node
/**
 * The food-database test: the same 50 generic foods looked up in USDA
 * FoodData Central and in Open Food Facts, and where the two disagree on
 * energy, protein, fat and carbohydrate per 100 g.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-food-test.mjs [--offline]
 *     --offline reparses .cache/food-test without fetching.
 *   node scripts/fetch-food-test.mjs --seed <job-log> --run <run id>
 *     writes the cache from a .github/workflows/source-snapshot.yml job log
 *     (print_chars on) that fetched the exact URLs this script builds, then
 *     stops; run again with --offline to parse.
 *   It writes its own public files (public/food-test/); they are ODbL, so they
 *   stay out of `npm run datasets` (public/datasets is CC BY 4.0).
 *
 * Reads, and nothing else:
 *   USDA FoodData Central API, GET /v1/foods with the 50 pinned fdcIds below,
 *     20 per request, format=abridged, nutrients 203, 204, 205, 208, 957, 958.
 *     The key is FDC_API_KEY from the environment, else DEMO_KEY, which
 *     api.data.gov documents for light use (30 requests per IP per hour, 50
 *     per day); this script makes 3 requests. A key is never written to the
 *     cache, the output or a log.
 *   Open Food Facts API v2, GET /api/v2/search, one request per food: the
 *     food's category tag, sort_by=unique_scans_n, page_size=10, the fields
 *     the comparison needs. Open Food Facts documents 10 search requests per
 *     minute per IP, so live requests are spaced 7 seconds apart, and a 429
 *     or 503 is retried with a doubling wait, three times at most.
 *
 * api.nal.usda.gov and world.openfoodfacts.org are blocked from the dev
 * environment; there the cache holds the bodies source-snapshot.yml printed
 * (--seed), and meta.json names the run. On a GitHub runner they fetch
 * directly. A cached file is reused, so delete .cache/food-test to re-read.
 *
 * How a food is matched, and why it is biased (the page says the same):
 *   USDA: one record per food, chosen by hand from FoodData Central's own
 *     search results and Foundation Foods list, and pinned here by fdcId with
 *     its description. Foundation Foods where it has the food with all four
 *     values, SR Legacy otherwise (raisins: Foundation's record states none
 *     of the four; corn flakes: no Foundation record); where Foundation lists
 *     only named varieties, one variety, named in the label. The script fails if a pinned record
 *     is missing or its description changed (FoodData Central gives a food a
 *     new fdcId whenever its record changes).
 *   Open Food Facts: the category tag from its taxonomy, and the products the
 *     search returns on its first page in the order Open Food Facts returns
 *     them for sort_by=unique_scans_n (the search decides category membership:
 *     a product filed under a synonym, such as xx:tofu for en:tofu, is in).
 *     A product counts when it states all four values per 100 g; the Open Food Facts value for the food is the
 *     median of the products that count, and the first of them is recorded as
 *     the most-scanned match. Open Food Facts is crowd-sourced packaged food,
 *     so a category holds whatever contributors filed there: brands, dried
 *     or cooked forms, label values per 100 ml, mistakes.
 *
 * Energy: USDA records carry kcal as nutrient 208 (Energy) or, on newer
 * Foundation records, as 958 (Atwater Specific Factors) or 957 (Atwater
 * General Factors). The script takes 208, then 958, then 957, and records
 * which. Open Food Facts energy is energy-kcal_100g; a product with kJ only
 * does not count (nothing is converted).
 *
 * A short parse fails: 50 foods, 50 USDA records with all four values, and
 * at least MIN_OFF_MATCHED foods with an Open Food Facts value, or the script
 * exits non-zero and writes nothing.
 *
 * Writes src/data/foodDatabaseTest.ts.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const CACHE = ".cache/food-test";
const META = join(CACHE, "meta.json");
const OUT = "src/data/foodDatabaseTest.ts";
const args = process.argv.slice(2);
const OFFLINE = args.includes("--offline");
const argOf = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const SEED = argOf("--seed");
const RUN = argOf("--run");

const UA = "aifitnessapi-food-test/1.0 (+https://aifitnessapi.com/methodology)";
const FDC_API = "https://api.nal.usda.gov/fdc/v1";
const OFF_API = "https://world.openfoodfacts.org/api/v2/search";
const OFF_FIELDS = "code,product_name,brands,nutriments,unique_scans_n,categories_tags,countries_tags,nutrition_data_per";
const NUTRIENTS = ["203", "204", "205", "208", "957", "958"];
const CHUNK = 20;

export const EXPECTED_FOODS = 50;
export const MIN_OFF_MATCHED = 40;

/**
 * The 50 foods. `usda` is the pinned FoodData Central record (fdcId and its
 * description, verbatim from the API); `off` is the Open Food Facts category
 * tag, each checked against taxonomies/food/categories.txt in the
 * openfoodfacts-server repository on 2026-11-24. The records were picked from
 * FoodData Central's search results (source-snapshot runs 45496725792 and
 * 45496729477) and its Foundation Foods list (/v1/foods/list, run
 * 45506458632), all 2026-11-24.
 */
export const FOODS = [
  { id: "banana-raw", label: "Banana, raw", group: "fruit", usda: { fdcId: 1105314, description: "Bananas, ripe and slightly ripe, raw" }, off: "en:bananas" },
  { id: "apple-raw", label: "Apple (Fuji), raw, with skin", group: "fruit", usda: { fdcId: 1750340, description: "Apples, fuji, with skin, raw" }, off: "en:apples" },
  { id: "orange-raw", label: "Orange (navel), raw", group: "fruit", usda: { fdcId: 746771, description: "Oranges, raw, navels" }, off: "en:oranges" },
  { id: "strawberries-raw", label: "Strawberries, raw", group: "fruit", usda: { fdcId: 2346409, description: "Strawberries, raw" }, off: "en:strawberries" },
  { id: "blueberries-raw", label: "Blueberries, raw", group: "fruit", usda: { fdcId: 2346411, description: "Blueberries, raw" }, off: "en:blueberries" },
  { id: "grapes-raw", label: "Grapes, green, seedless, raw", group: "fruit", usda: { fdcId: 2346413, description: "Grapes, green, seedless, raw" }, off: "en:grapes" },
  { id: "avocado-raw", label: "Avocado (Hass), raw", group: "fruit", usda: { fdcId: 2710824, description: "Avocado, Hass, peeled, raw" }, off: "en:avocados" },
  { id: "raisins", label: "Raisins, seedless", group: "fruit", usda: { fdcId: 168165, description: "Raisins, dark, seedless (Includes foods for USDA's Food Distribution Program)" }, off: "en:raisins" },
  { id: "kiwifruit-raw", label: "Kiwifruit, green, raw", group: "fruit", usda: { fdcId: 327046, description: "Kiwifruit, green, raw" }, off: "en:kiwifruits" },
  { id: "mango-raw", label: "Mango (Tommy Atkins), raw", group: "fruit", usda: { fdcId: 2710833, description: "Mango, Tommy Atkins, peeled, raw" }, off: "en:mangoes" },
  { id: "tomato-raw", label: "Tomato (roma), raw", group: "vegetable", usda: { fdcId: 1999634, description: "Tomato, roma" }, off: "en:tomatoes" },
  { id: "carrot-raw", label: "Carrot, raw", group: "vegetable", usda: { fdcId: 2258586, description: "Carrots, mature, raw" }, off: "en:carrots" },
  { id: "broccoli-raw", label: "Broccoli, raw", group: "vegetable", usda: { fdcId: 747447, description: "Broccoli, raw" }, off: "en:broccoli" },
  { id: "spinach-raw", label: "Spinach, raw", group: "vegetable", usda: { fdcId: 1999633, description: "Spinach, mature" }, off: "en:spinachs" },
  { id: "sweet-potato-raw", label: "Sweet potato, raw", group: "vegetable", usda: { fdcId: 2346404, description: "Sweet potatoes, orange flesh, without skin, raw" }, off: "en:sweet-potatoes" },
  { id: "onion-raw", label: "Onion (yellow), raw", group: "vegetable", usda: { fdcId: 790646, description: "Onions, yellow, raw" }, off: "en:onions" },
  { id: "cucumber-raw", label: "Cucumber, raw", group: "vegetable", usda: { fdcId: 2346406, description: "Cucumber, with peel, raw" }, off: "en:cucumbers" },
  { id: "cauliflower-raw", label: "Cauliflower, raw", group: "vegetable", usda: { fdcId: 2685573, description: "Cauliflower, raw" }, off: "en:cauliflowers" },
  { id: "mushrooms-raw", label: "Mushrooms (white button), raw", group: "vegetable", usda: { fdcId: 1999629, description: "Mushrooms, white button" }, off: "en:mushrooms" },
  { id: "white-rice-dry", label: "White rice, dry", group: "grain", usda: { fdcId: 2512381, description: "Rice, white, long grain, unenriched, raw" }, off: "en:white-rices" },
  { id: "rolled-oats", label: "Rolled oats, dry", group: "grain", usda: { fdcId: 2346396, description: "Oats, whole grain, rolled, old fashioned" }, off: "en:rolled-oats" },
  { id: "pasta-dry", label: "Pasta (spaghetti), dry", group: "grain", usda: { fdcId: 2758998, description: "Pasta, dry, enriched, spaghetti" }, off: "en:dry-pastas" },
  { id: "white-bread", label: "White bread", group: "grain", usda: { fdcId: 2758993, description: "Bread, white, commercial" }, off: "en:white-breads" },
  { id: "wholemeal-bread", label: "Whole-wheat bread", group: "grain", usda: { fdcId: 2758994, description: "Bread, 100% whole wheat, commercial" }, off: "en:wholemeal-breads" },
  { id: "corn-flakes", label: "Corn flakes", group: "grain", usda: { fdcId: 174648, description: "Cereals ready-to-eat, RALSTON Corn Flakes" }, off: "en:corn-flakes" },
  { id: "egg-whole-raw", label: "Egg, whole, raw", group: "protein", usda: { fdcId: 748967, description: "Eggs, Grade A, Large, egg whole" }, off: "en:chicken-eggs" },
  { id: "chicken-breast-raw", label: "Chicken breast, raw", group: "protein", usda: { fdcId: 2646170, description: "Chicken, breast, boneless, skinless, raw" }, off: "en:chicken-breasts" },
  { id: "ground-beef-raw", label: "Ground beef (80% lean), raw", group: "protein", usda: { fdcId: 2514744, description: "Beef, ground, 80% lean meat / 20% fat, raw" }, off: "en:ground-beef-meats" },
  { id: "salmon-raw", label: "Atlantic salmon (farmed), raw", group: "protein", usda: { fdcId: 2684441, description: "Fish, salmon, Atlantic, farm raised, raw" }, off: "en:salmons" },
  { id: "tuna-canned", label: "Tuna, canned in water", group: "protein", usda: { fdcId: 334194, description: "Fish, tuna, light, canned in water, drained solids" }, off: "en:canned-tunas" },
  { id: "lentils-dry", label: "Lentils, dry", group: "protein", usda: { fdcId: 2644283, description: "Lentils, dry" }, off: "en:lentils" },
  { id: "black-beans-canned", label: "Black beans, canned", group: "protein", usda: { fdcId: 2644285, description: "Beans, black, canned, sodium added, drained and rinsed" }, off: "en:canned-black-beans" },
  { id: "whole-milk", label: "Whole milk", group: "dairy", usda: { fdcId: 746782, description: "Milk, whole, 3.25% milkfat, with added vitamin D" }, off: "en:whole-milks" },
  { id: "skim-milk", label: "Skim milk", group: "dairy", usda: { fdcId: 746776, description: "Milk, nonfat, fluid, with added vitamin A and vitamin D (fat free or skim)" }, off: "en:skimmed-milks" },
  { id: "plain-yogurt", label: "Plain yogurt, whole milk", group: "dairy", usda: { fdcId: 2259793, description: "Yogurt, plain, whole milk" }, off: "en:plain-yogurts" },
  { id: "greek-yogurt", label: "Greek yogurt, plain, whole milk", group: "dairy", usda: { fdcId: 2259794, description: "Yogurt, Greek, plain, whole milk" }, off: "en:greek-style-yogurts" },
  { id: "cheddar", label: "Cheddar cheese", group: "dairy", usda: { fdcId: 328637, description: "Cheese, cheddar" }, off: "en:cheddar-cheese" },
  { id: "mozzarella", label: "Mozzarella", group: "dairy", usda: { fdcId: 329370, description: "Cheese, mozzarella, low moisture, part-skim" }, off: "en:mozzarella" },
  { id: "cottage-cheese", label: "Cottage cheese, full fat", group: "dairy", usda: { fdcId: 2346384, description: "Cottage cheese, full fat, large or small curd" }, off: "en:cottage-cheeses" },
  { id: "cream-cheese", label: "Cream cheese, full fat", group: "dairy", usda: { fdcId: 2346385, description: "Cream cheese, full fat, block" }, off: "en:cream-cheeses" },
  { id: "parmesan", label: "Parmesan", group: "dairy", usda: { fdcId: 325036, description: "Cheese, parmesan, grated" }, off: "en:parmigiano-reggiano" },
  { id: "almonds", label: "Almonds, raw", group: "fat", usda: { fdcId: 2346393, description: "Nuts, almonds, whole, raw" }, off: "en:almonds" },
  { id: "walnuts", label: "Walnuts, raw", group: "fat", usda: { fdcId: 2346394, description: "Nuts, walnuts, English, halves, raw" }, off: "en:walnuts" },
  { id: "cashews", label: "Cashews, raw", group: "fat", usda: { fdcId: 2515374, description: "Nuts, cashew nuts, raw" }, off: "en:cashew-nuts" },
  { id: "sunflower-seeds", label: "Sunflower seeds, raw", group: "fat", usda: { fdcId: 2515381, description: "Seeds, sunflower seed, kernel, raw" }, off: "en:sunflower-seeds" },
  { id: "coconut-oil", label: "Coconut oil", group: "fat", usda: { fdcId: 330458, description: "Oil, coconut" }, off: "en:coconut-oils" },
  { id: "white-sugar", label: "White sugar", group: "sweet", usda: { fdcId: 746784, description: "Sugars, granulated" }, off: "en:white-sugars" },
  { id: "orange-juice", label: "Orange juice", group: "drink", usda: { fdcId: 2003597, description: "Orange juice, no pulp, not fortified, not from concentrate, refrigerated" }, off: "en:orange-juices" },
  { id: "hummus", label: "Hummus", group: "other", usda: { fdcId: 321358, description: "Hummus, commercial" }, off: "en:hummus" },
  { id: "ketchup", label: "Ketchup", group: "other", usda: { fdcId: 747693, description: "Ketchup, restaurant" }, off: "en:ketchup" },
];

/* ── pure helpers (exported for scripts/food-test.test.mjs) ─────────────── */

export const fdcFoodsUrl = (ids, key = "DEMO_KEY") =>
  `${FDC_API}/foods?fdcIds=${ids.join(",")}&format=abridged&nutrients=${NUTRIENTS.join(",")}&api_key=${key}`;

export const offSearchUrl = (tag) =>
  `${OFF_API}?categories_tags=${encodeURIComponent(tag)}&states_tags=en%3Anutrition-facts-completed&sort_by=unique_scans_n&page_size=10&fields=${OFF_FIELDS}`;

export const chunks = (list, n = CHUNK) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : null);

/** Median of numbers; null for none. */
export function median(xs) {
  const a = xs.filter((x) => x !== null).sort((p, q) => p - q);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

export const round = (x, d = 1) => (x === null ? null : Math.round(x * 10 ** d) / 10 ** d);

/** The four values of an abridged USDA record, with the energy nutrient used. */
export function usdaValues(food) {
  const by = new Map((food.foodNutrients ?? []).map((n) => [String(n.number ?? n.nutrientNumber), n]));
  const amt = (k) => {
    const n = by.get(k);
    return n ? num(n.amount ?? n.value) : null;
  };
  let energyNutrient = null;
  let energyKcal = null;
  for (const k of ["208", "958", "957"]) {
    const n = by.get(k);
    if (n && String(n.unitName).toLowerCase() === "kcal" && amt(k) !== null) {
      energyNutrient = { number: k, name: n.name };
      energyKcal = amt(k);
      break;
    }
  }
  return { energyKcal, energyNutrient, protein: amt("203"), fat: amt("204"), carbohydrate: amt("205") };
}

/** One Open Food Facts product's four values per 100 g; null where absent. */
export function offValues(p) {
  const n = p.nutriments ?? {};
  return {
    energyKcal: num(n["energy-kcal_100g"]),
    protein: num(n.proteins_100g),
    fat: num(n.fat_100g),
    carbohydrate: num(n.carbohydrates_100g),
  };
}

export const KEYS = ["energyKcal", "protein", "fat", "carbohydrate"];
export const complete = (v) => KEYS.every((k) => v[k] !== null);

/** Percent difference of OFF from USDA; null when USDA is 0 or either is missing. */
export function pctDiff(off, usda) {
  if (off === null || usda === null || usda === 0) return null;
  return ((off - usda) / usda) * 100;
}

/** The Open Food Facts side of one food from its search response. */
export function offSide(body) {
  const products = (body.products ?? []).map((p) => ({
    code: String(p.code ?? ""),
    name: String(p.product_name ?? "").replace(/\s+/g, " ").trim() || null,
    brands: String(p.brands ?? "").replace(/\s+/g, " ").trim() || null,
    per: p.nutrition_data_per ?? null,
    countries: Array.isArray(p.countries_tags) ? p.countries_tags.filter((c) => /^en:[a-z-]+$/.test(c)) : [],
    values: offValues(p),
  }));
  const counted = products.filter((p) => complete(p.values) && p.code);
  const med = Object.fromEntries(KEYS.map((k) => [k, median(counted.map((p) => p.values[k]))]));
  const range = Object.fromEntries(
    KEYS.map((k) => [k, counted.length ? [Math.min(...counted.map((p) => p.values[k])), Math.max(...counted.map((p) => p.values[k]))] : null]),
  );
  return {
    categoryCount: num(body.count),
    productsRead: products.length,
    counted,
    median: med,
    range,
    per100ml: counted.filter((p) => p.per === "100ml").length,
  };
}

/** The three countries tagged on the most counted products (a product may carry several). */
export function topCountries(products, n = 3) {
  const count = new Map();
  for (const p of products) for (const c of new Set(p.countries)) count.set(c, (count.get(c) ?? 0) + 1);
  return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([country, products]) => ({ country, products }));
}

/* ── fetching ────────────────────────────────────────────────────────────── */

const sha256 = (s) => createHash("sha256").update(s).digest("hex");
const fail = (m) => {
  console.error(`\n✗ fetch-food-test: ${m}\n`);
  process.exit(1);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const redact = (u) => u.replace(/api_key=[^&]+/, "api_key=KEY");

function requests() {
  const usda = chunks(FOODS.map((f) => f.usda.fdcId)).map((ids, i) => ({ file: `usda-${i + 1}.json`, kind: "usda", url: fdcFoodsUrl(ids) }));
  const off = FOODS.map((f) => ({ file: `off-${f.id}.json`, kind: "off", url: offSearchUrl(f.off) }));
  return [...usda, ...off];
}

function loadMeta() {
  return existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
}

function seed(logFile, run) {
  if (!run || !/^\d+$/.test(run)) fail("--seed needs --run <source-snapshot run id>");
  mkdirSync(CACHE, { recursive: true });
  const meta = loadMeta();
  const lines = readFileSync(logFile, "utf8").split("\n").map((l) => l.replace(/^\d{4}-\d\d-\d\dT[\d:.]+Z ?/, ""));
  const want = new Map(requests().map((r) => [r.url, r]));
  let cur = null;
  let buf = [];
  let wrote = 0;
  for (const l of lines) {
    const m = /^===== SNAPSHOT (\S+) \| status (\d+) \| fetched (\S+) \|/.exec(l);
    if (m) {
      cur = { url: m[1], status: Number(m[2]), fetchedAt: m[3] };
      buf = [];
      continue;
    }
    if (cur && l === `===== END ${cur.url}`) {
      const r = want.get(cur.url);
      const body = buf.join("\n").replace(/\n\[\.\.\. \d+ more characters in the artifact\]$/, "");
      if (r && cur.status === 200) {
        try {
          JSON.parse(body);
          writeFileSync(join(CACHE, r.file), body);
          meta[r.file] = { url: redact(r.url), fetchedAt: cur.fetchedAt, sha256: sha256(body), via: `source-snapshot run ${run}` };
          wrote++;
        } catch {
          console.log(`  skipped ${r.file}: body is not complete JSON (raise print_chars)`);
        }
      }
      cur = null;
      continue;
    }
    if (cur) buf.push(l);
  }
  writeFileSync(META, JSON.stringify(meta, null, 2) + "\n");
  console.log(`fetch-food-test: seeded ${wrote} cache files from ${logFile} (run ${run})`);
}

async function read(r, meta, lastOff) {
  const file = join(CACHE, r.file);
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  if (OFFLINE) fail(`offline and ${file} is not cached`);
  const key = process.env.FDC_API_KEY || "DEMO_KEY";
  const url = r.kind === "usda" ? r.url.replace("api_key=DEMO_KEY", `api_key=${encodeURIComponent(key)}`) : r.url;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (r.kind === "off") {
      const wait = lastOff.t + 7000 - Date.now();
      if (wait > 0) await sleep(wait);
      lastOff.t = Date.now();
    }
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(60_000) });
    const text = await res.text();
    if (res.ok) {
      JSON.parse(text);
      mkdirSync(CACHE, { recursive: true });
      writeFileSync(file, text);
      meta[r.file] = { url: redact(r.url), fetchedAt: new Date().toISOString(), sha256: sha256(text), via: "direct" };
      writeFileSync(META, JSON.stringify(meta, null, 2) + "\n");
      return JSON.parse(text);
    }
    if (r.kind === "usda" || ![429, 503].includes(res.status) || attempt === 3) fail(`${res.status} for ${redact(url)}`);
    await sleep(10_000 * 2 ** attempt);
  }
}

/* ── licenses and the published files ────────────────────────────────────── */

/**
 * The terms each source states, verbatim, with where they were read. They
 * are also rows of ops/sources/evidence/fitness-apis-nutrition-apis.json, so
 * source-quotes.yml re-checks them against the live pages.
 */
export const TERMS = {
  usda: {
    name: "USDA FoodData Central",
    license: "CC0 1.0 Universal (public domain)",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    url: "https://fdc.nal.usda.gov/api-guide",
    quote:
      "USDA FoodData Central data are in the public domain and they are not copyrighted. They are published under CC0 1.0 Universal (CC0 1.0)",
    request: "No permission is needed for their use, but we request that users list FoodData Central as the source of the data",
  },
  off: {
    name: "Open Food Facts",
    license: "Open Database License (ODbL) 1.0; individual contents under the Database Contents License (DbCL) 1.0",
    licenseUrl: "https://opendatacommons.org/licenses/odbl/1-0/",
    contentsLicenseUrl: "https://opendatacommons.org/licenses/dbcl/1-0/",
    url: "https://world.openfoodfacts.org/terms-of-use",
    quote: "The Open Food Facts database is available under the Open Database License",
    attribution:
      "have to mention the licence and to attribute the authorship to Open Food Facts with a link to https://openfoodfacts.org",
    shareAlike: "Derivative works must be shared under the same conditions.",
    accuracy: "Open Food Facts does not guarantee the accuracy of the information and data present on the site and in the database",
  },
};

/** The ODbL 4.3 notice (its example text, with the database named and linked). */
export const ODBL_NOTICE =
  "Contains information from Open Food Facts (https://openfoodfacts.org), which is made available here under the Open Database License (ODbL) (https://opendatacommons.org/licenses/odbl/1-0/).";

export const PUBLIC_DIR = "public/food-test";
export const PUBLIC_SLUG = "food-database-test-2026";

export const CSV_COLUMNS = [
  "id", "label", "group",
  "usdaFdcId", "usdaDescription", "usdaDataType", "usdaPublicationDate", "usdaEnergyNutrient",
  "usdaEnergyKcal", "usdaProtein", "usdaFat", "usdaCarbohydrate",
  "offCategory", "offCategoryCount", "offProductsRead", "offProductsCounted", "offPer100ml",
  "offMedianEnergyKcal", "offMedianProtein", "offMedianFat", "offMedianCarbohydrate",
  "offMinEnergyKcal", "offMaxEnergyKcal",
  "offTopCode", "offTopName", "offTopBrands", "offProductCodes",
  "diffPctEnergyKcal", "diffPctProtein", "diffPctFat", "diffPctCarbohydrate",
  "usdaFetchedAt", "offFetchedAt",
];

export function csvRow(r) {
  const m = r.off.median;
  return {
    id: r.id, label: r.label, group: r.group,
    usdaFdcId: r.usda.fdcId, usdaDescription: r.usda.description, usdaDataType: r.usda.dataType,
    usdaPublicationDate: r.usda.publicationDate, usdaEnergyNutrient: `${r.usda.energyNutrient.number} ${r.usda.energyNutrient.name}`,
    usdaEnergyKcal: r.usda.values.energyKcal, usdaProtein: r.usda.values.protein, usdaFat: r.usda.values.fat, usdaCarbohydrate: r.usda.values.carbohydrate,
    offCategory: r.off.category, offCategoryCount: r.off.categoryCount, offProductsRead: r.off.productsRead, offProductsCounted: r.off.productsCounted, offPer100ml: r.off.per100ml,
    offMedianEnergyKcal: m?.energyKcal ?? null, offMedianProtein: m?.protein ?? null, offMedianFat: m?.fat ?? null, offMedianCarbohydrate: m?.carbohydrate ?? null,
    offMinEnergyKcal: r.off.range?.energyKcal[0] ?? null, offMaxEnergyKcal: r.off.range?.energyKcal[1] ?? null,
    offTopCode: r.off.top?.code ?? null, offTopName: r.off.top?.name ?? null, offTopBrands: r.off.top?.brands ?? null,
    offProductCodes: r.off.products.length ? r.off.products.map((p) => p.code).join(" ") : null,
    diffPctEnergyKcal: r.diffPct.energyKcal, diffPctProtein: r.diffPct.protein, diffPctFat: r.diffPct.fat, diffPctCarbohydrate: r.diffPct.carbohydrate,
    usdaFetchedAt: r.usda.fetchedAt, offFetchedAt: r.off.fetchedAt,
  };
}

/** RFC 4180, as public/datasets: every non-null cell quoted, nulls empty. */
export function toCsv(rows) {
  const cell = (v) => (v === null || v === undefined ? "" : `"${String(v).replace(/"/g, '""')}"`);
  return [CSV_COLUMNS.join(","), ...rows.map((r) => CSV_COLUMNS.map((c) => cell(r[c])).join(","))].join("\n") + "\n";
}

/** "source-snapshot runs 1, 2" and/or "fetched directly", from the cache meta's `via` values. */
export function describeRuns(runs) {
  const snap = runs.filter((r) => r.startsWith("source-snapshot run ")).map((r) => r.slice("source-snapshot run ".length));
  const parts = [];
  if (snap.length) parts.push(`${snap.length === 1 ? "source-snapshot run" : "source-snapshot runs"} ${snap.join(", ")}`);
  if (runs.includes("direct")) parts.push("fetched directly");
  return parts.join("; ");
}

function writePublic(rows, summary, fetched, runs) {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  const [first, last] = [fetched[0]?.slice(0, 10), fetched.at(-1)?.slice(0, 10)];
  const readOn = first === last ? `on ${first}` : `${first} to ${last}`;
  const doc = {
    name: "Food Database Test 2026: 50 generic foods in USDA FoodData Central and Open Food Facts",
    version: "2026.1",
    publisher: "AIFitnessAPI (aifitnessapi.com)",
    license: "ODbL 1.0",
    licenseUrl: TERMS.off.licenseUrl,
    licenseNote:
      "This file holds Open Food Facts data (product codes, names, brands and nutrient values), so it is published under the Open Database License 1.0, as the Open Food Facts terms require of derivative works. The USDA FoodData Central values in it are public domain (CC0 1.0) and stay so. The derived columns (medians, ranges, differences) are this site's.",
    notice: ODBL_NOTICE,
    sourceTerms: TERMS,
    sourceReadOn: readOn,
    readVia: runs,
    generatedFrom: "scripts/fetch-food-test.mjs (writes src/data/foodDatabaseTest.ts and this file)",
    page: "https://aifitnessapi.com/fitness-apis/nutrition-apis#food-database-test",
    methodology:
      "One USDA FoodData Central record per food, chosen by hand and pinned by fdcId: Foundation Foods where it has the food with all four values, SR Legacy otherwise; where Foundation lists only named varieties (apples, mangoes, onions), one variety, named in the label. For Open Food Facts, the first page (10 products) its v2 search returns for the food's category tag with sort_by=unique_scans_n; a product counts when it states energy-kcal, proteins, fat and carbohydrates per 100 g, and the food's Open Food Facts value is the median of the products that count. Differences are (Open Food Facts median minus USDA) divided by USDA, in percent. Open Food Facts is crowd-sourced packaged food: a category holds whatever contributors filed there, and some products state values per 100 ml.",
    summary,
    items: rows,
  };
  const json = JSON.stringify(doc, null, 2) + "\n";
  const csv = toCsv(rows.map(csvRow));
  const card = [
    `# ${doc.name}`,
    "",
    "<!-- Generated by scripts/fetch-food-test.mjs. Do not edit by hand. -->",
    "",
    `Version ${doc.version}. ${rows.length} rows, one per food. Sources read ${readOn}: ${describeRuns(runs)}.`,
    "",
    `Files: [${PUBLIC_SLUG}.json](https://aifitnessapi.com/food-test/${PUBLIC_SLUG}.json), [${PUBLIC_SLUG}.csv](https://aifitnessapi.com/food-test/${PUBLIC_SLUG}.csv). Read it as a page: ${doc.page}`,
    "",
    "## License",
    "",
    ODBL_NOTICE,
    "",
    doc.licenseNote,
    "",
    `- ${TERMS.off.name}: "${TERMS.off.quote}" ${TERMS.off.url}`,
    `- ${TERMS.off.name} on re-use: "${TERMS.off.attribution}". "${TERMS.off.shareAlike}"`,
    `- ${TERMS.usda.name}: "${TERMS.usda.quote}" ${TERMS.usda.url}. "${TERMS.usda.request}"`,
    "",
    "Source: U.S. Department of Agriculture, Agricultural Research Service. FoodData Central. fdc.nal.usda.gov. Each row names the record (fdcId) and its publication date.",
    "",
    "## Method",
    "",
    doc.methodology,
    "",
    "## Columns (CSV)",
    "",
    ...CSV_COLUMNS.map((c) => `- \`${c}\``),
    "",
    "The JSON carries the same rows with every counted Open Food Facts product and its four values. A null means the source does not state the value; it is never a guess.",
    "",
  ].join("\n");
  writeFileSync(join(PUBLIC_DIR, `${PUBLIC_SLUG}.json`), json);
  writeFileSync(join(PUBLIC_DIR, `${PUBLIC_SLUG}.csv`), csv);
  writeFileSync(join(PUBLIC_DIR, `${PUBLIC_SLUG}.md`), card);
}

/* ── run ─────────────────────────────────────────────────────────────────── */

async function main() {
  if (FOODS.length !== EXPECTED_FOODS) fail(`${FOODS.length} foods in the list, expected ${EXPECTED_FOODS}`);
  const ids = new Set(FOODS.map((f) => f.id));
  if (ids.size !== FOODS.length) fail("duplicate food id");
  if (new Set(FOODS.map((f) => f.usda.fdcId)).size !== FOODS.length) fail("duplicate fdcId");
  if (SEED) return seed(SEED, RUN);

  const meta = loadMeta();
  const lastOff = { t: 0 };
  const body = {};
  for (const r of requests()) body[r.file] = await read(r, meta, lastOff);

  const usdaById = new Map();
  for (const r of requests().filter((x) => x.kind === "usda")) {
    if (!Array.isArray(body[r.file])) fail(`${r.file} is not an array of foods`);
    for (const f of body[r.file]) usdaById.set(f.fdcId, f);
  }

  const rows = FOODS.map((food) => {
    const u = usdaById.get(food.usda.fdcId);
    if (!u) fail(`${food.id}: fdcId ${food.usda.fdcId} not returned by FoodData Central`);
    if (u.description !== food.usda.description) fail(`${food.id}: fdcId ${food.usda.fdcId} is now "${u.description}", pinned "${food.usda.description}"`);
    const uv = usdaValues(u);
    for (const k of KEYS) if (uv[k] === null) fail(`${food.id}: USDA record ${u.fdcId} has no ${k}`);
    const offFile = `off-${food.id}.json`;
    const o = offSide(body[offFile]);
    const matched = o.counted.length > 0;
    const top = matched ? o.counted[0] : null;
    const diff = Object.fromEntries(KEYS.map((k) => [k, matched ? round(pctDiff(o.median[k], uv[k]), 1) : null]));
    const absDiff = Object.fromEntries(KEYS.map((k) => [k, matched ? round(o.median[k] - uv[k], 2) : null]));
    return {
      id: food.id,
      label: food.label,
      group: food.group,
      usda: {
        fdcId: u.fdcId,
        description: u.description,
        dataType: u.dataType,
        publicationDate: u.publicationDate ?? null,
        ndbNumber: u.ndbNumber ?? null,
        energyNutrient: uv.energyNutrient,
        values: Object.fromEntries(KEYS.map((k) => [k, uv[k]])),
        fetchedAt: meta[`usda-${Math.floor(FOODS.indexOf(food) / CHUNK) + 1}.json`]?.fetchedAt ?? null,
      },
      off: {
        category: food.off,
        categoryCount: o.categoryCount,
        productsRead: o.productsRead,
        productsCounted: o.counted.length,
        per100ml: o.per100ml,
        median: matched ? Object.fromEntries(KEYS.map((k) => [k, round(o.median[k], 2)])) : null,
        range: matched ? o.range : null,
        top: top ? { code: top.code, name: top.name, brands: top.brands } : null,
        products: o.counted.map((p) => ({ code: p.code, name: p.name, brands: p.brands, per: p.per, countries: p.countries, values: p.values })),
        fetchedAt: meta[offFile]?.fetchedAt ?? null,
      },
      diffPct: diff,
      diffAbs: absDiff,
    };
  });

  const matched = rows.filter((r) => r.off.productsCounted > 0);
  if (matched.length < MIN_OFF_MATCHED) fail(`${matched.length} foods with an Open Food Facts value, expected at least ${MIN_OFF_MATCHED}`);

  const summary = {
    foods: rows.length,
    matched: matched.length,
    unmatched: rows.filter((r) => r.off.productsCounted === 0).map((r) => r.id),
    medianAbsPct: Object.fromEntries(KEYS.map((k) => [k, round(median(matched.map((r) => r.diffPct[k]).filter((x) => x !== null).map(Math.abs)), 1)])),
    within10PctEnergy: matched.filter((r) => r.diffPct.energyKcal !== null && Math.abs(r.diffPct.energyKcal) <= 10).length,
    over25PctEnergy: matched.filter((r) => r.diffPct.energyKcal !== null && Math.abs(r.diffPct.energyKcal) > 25).length,
    biggestEnergyGaps: [...matched]
      .filter((r) => r.diffPct.energyKcal !== null)
      .sort((a, b) => Math.abs(b.diffPct.energyKcal) - Math.abs(a.diffPct.energyKcal) || a.id.localeCompare(b.id))
      .slice(0, 5)
      .map((r) => r.id),
    usdaDataTypes: Object.fromEntries([...new Set(rows.map((r) => r.usda.dataType))].sort().map((t) => [t, rows.filter((r) => r.usda.dataType === t).length])),
    usdaEnergyNutrients: Object.fromEntries(
      [...new Set(rows.map((r) => r.usda.energyNutrient.number))].sort().map((n) => [n, rows.filter((r) => r.usda.energyNutrient.number === n).length]),
    ),
    offProductsCounted: matched.reduce((s, r) => s + r.off.productsCounted, 0),
    offPer100ml: matched.reduce((s, r) => s + r.off.per100ml, 0),
    offTopCountries: topCountries(rows.flatMap((r) => r.off.products)),
  };

  const fetched = Object.values(meta).map((m) => m.fetchedAt).filter(Boolean).sort();
  const runs = [...new Set(Object.values(meta).map((m) => m.via))].sort();
  const out = `/**
 * The food-database test: 50 generic foods in USDA FoodData Central and Open Food Facts.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-food-test.mjs
 * (see the script header for the matching rule and its bias).
 *
 * Read ${fetched[0]?.slice(0, 10)} to ${fetched.at(-1)?.slice(0, 10)}: ${describeRuns(runs)}.
 * USDA FoodData Central data: public domain, CC0 1.0. Open Food Facts data: Open Database
 * License (ODbL) 1.0, individual contents under the Database Contents License 1.0; every row
 * below that holds Open Food Facts data is that database's content.
 */

export type FoodTestValues = { energyKcal: number | null; protein: number | null; fat: number | null; carbohydrate: number | null };

export type FoodTestRow = {
  id: string;
  label: string;
  group: string;
  usda: {
    fdcId: number;
    description: string;
    dataType: string;
    publicationDate: string | null;
    ndbNumber: string | null;
    energyNutrient: { number: string; name: string };
    values: FoodTestValues;
    fetchedAt: string | null;
  };
  off: {
    category: string;
    categoryCount: number | null;
    productsRead: number;
    productsCounted: number;
    per100ml: number;
    median: FoodTestValues | null;
    range: Record<keyof FoodTestValues, [number, number]> | null;
    top: { code: string; name: string | null; brands: string | null } | null;
    products: { code: string; name: string | null; brands: string | null; per: string | null; countries: string[]; values: FoodTestValues }[];
    fetchedAt: string | null;
  };
  diffPct: FoodTestValues;
  diffAbs: FoodTestValues;
};

export const FOOD_TEST_READ_ON = ${JSON.stringify(fetched.at(-1)?.slice(0, 10) ?? null)};
export const FOOD_TEST_RUNS: string[] = ${JSON.stringify(runs)};

export type FoodTestSummary = {
  foods: number;
  matched: number;
  unmatched: string[];
  medianAbsPct: FoodTestValues;
  within10PctEnergy: number;
  over25PctEnergy: number;
  biggestEnergyGaps: string[];
  usdaDataTypes: Record<string, number>;
  usdaEnergyNutrients: Record<string, number>;
  offProductsCounted: number;
  offPer100ml: number;
  offTopCountries: { country: string; products: number }[];
};

export const FOOD_TEST_SUMMARY: FoodTestSummary = ${JSON.stringify(summary, null, 2)};

export const FOOD_TEST_ROWS: FoodTestRow[] = ${JSON.stringify(rows, null, 1)};
`;
  writeFileSync(OUT, out);
  writePublic(rows, summary, fetched, runs);
  console.log(
    `fetch-food-test: ${rows.length} foods, ${matched.length} with an Open Food Facts value (${summary.offProductsCounted} products); median |Δ| energy ${summary.medianAbsPct.energyKcal}% → ${OUT}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
