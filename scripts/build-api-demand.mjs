/**
 * What developers search for about each product in the API directory, built
 * from the committed live search pull. ops/GROWTH-30-2026-10-12.md #17.
 *
 *   node scripts/build-api-demand.mjs
 *
 * Reads data/gsc/latest.json (Google byQuery, byQueryPage) and
 * data/gsc/bing-latest.json (Bing byQuery, byQueryPage), both written by
 * scripts/search-pull.mjs for the same 28-day window, and writes
 * src/data/apiDemand.ts. Run it after every pull.
 *
 * Per product:
 *   - google, bing: impressions of the disclosed queries that name the
 *     product, per engine. Never added together: Google withholds most
 *     queries and Bing reports nearly all, so a sum would mean nothing.
 *   - pages: the pages on this site those queries surfaced, each with up to
 *     three of the queries. A query is credited to the page that took most of
 *     its impressions on that engine. Pages are ranked within each engine by
 *     the impressions credited to them and the two rankings are interleaved,
 *     so neither engine's numbers are mixed into the other's.
 *
 * Never published: a query carrying a URL, a domain, an email address, an
 * identifier, a quoted code fragment, or characters outside printable ASCII;
 * and the machine-written evaluation prompts that surface as queries
 * ("evaluate … (whoop prompts)"). These are dropped before ranking, not
 * redacted. Only queries with two or more impressions in the window appear.
 *
 * Pages moved by a permanent redirect in next.config.ts are credited to the
 * destination. The directory itself, the home page and the product's own
 * directory page are never listed: they are not where an answer lives.
 *
 * House rule (CLAUDE.md, generated data): a short read fails. A product in
 * the directory with no matcher here, fewer than 100 Google queries, or
 * Bing's pairs missing (search-pull writes null when its lookups failed)
 * exits non-zero and leaves the previous file in place.
 */
import fs from "node:fs";

const OUT = "src/data/apiDemand.ts";
const MAX_PAGES = 6;
const MAX_QUERIES = 3;
const MIN_IMPRESSIONS = 2;

function fail(msg) {
  console.error(`build-api-demand: ${msg}`);
  process.exit(1);
}

/** Which queries name which product, matched on the lowercased query. */
const MATCH = {
  fitbit: /\bfitbit\b/,
  garmin: /\bgarmin\b/,
  oura: /\boura\b/,
  whoop: /\bwhoop\b/,
  strava: /\bstrava\b/,
  polar: /\bpolar\b(?! coordinates?)/,
  healthkit: /\bhealth ?kit\b|\bhk[a-z]{4,}/,
  "health-connect": /\bhealth ?connect\b/,
  terra: /\bterra\b/,
  // Junction is "formerly Vital" (as the site says) and still searched by that name.
  junction: /\bjunction\b|\b(try)?vital\b(?! signs?)/,
  rook: /\brook\b/,
  spike: /\bspike\b/,
  nutritionix: /\bnutritionix\b/,
  edamam: /\bedamam\b/,
  "usda-fdc": /\bfooddata\b|\busda\b/,
  "open-food-facts": /\bopen ?food ?facts\b|\bopenfoodfacts\b/,
  exercisedb: /\bexercise ?db\b/,
  wger: /\bwger\b/,
  kinestex: /\bkinestex\b/,
  sency: /\bsency\b|\bsmkit\b/,
  quickpose: /\bquick ?pose\b/,
  mediapipe: /\bmedia ?pipe\b|\bblazepose\b/,
  movenet: /\bmove ?net\b/,
  "apple-vision": /\bapple vision\b|\bvndetecthumanbodypose|\bvnhumanbodypose/,
};
/** Same name, different product. */
const EXCLUDE = {
  healthkit: /\bhuawei\b/, // Huawei ships its own "HealthKit"
};

const publishable = (q) =>
  q.length <= 100 &&
  /^[\x20-\x7e]+$/.test(q) &&
  !/https?:|www\.|:\/\/|\.(com|dev|io|net|org|app)\b|[@=%`^{}<>\\|"]|\/\//.test(q) &&
  !/\d{6,}|[0-9a-f]{8}-[0-9a-f]{4}/i.test(q) &&
  !/\bprompts?\)|\bevaluate\b/.test(q);

const norm = (q) => q.toLowerCase().replace(/\s+/g, " ").trim();

// The directory's products, read from the module that defines them, so a
// product added there without a matcher here fails loudly.
const apisSrc = fs.readFileSync("src/data/apis.ts", "utf8");
const aliasBlock = /const ALIASES[^=]*=\s*\{([\s\S]*?)\n\};/.exec(apisSrc)?.[1];
if (!aliasBlock) fail("could not find ALIASES in src/data/apis.ts");
const ids = [...aliasBlock.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*\[/gm)].map((m) => m[1]);
if (ids.length < 20) fail(`read only ${ids.length} products from src/data/apis.ts`);
const unmatched = ids.filter((id) => !MATCH[id]);
if (unmatched.length) fail(`no matcher for ${unmatched.join(", ")}`);

// Permanent redirects without parameters: a page that moved is credited to
// where it went.
const configSrc = fs.readFileSync("next.config.ts", "utf8");
const REDIRECT = new Map(
  [...configSrc.matchAll(/\{\s*source:\s*"([^"]+)",\s*destination:\s*"([^"]+)",\s*permanent:\s*true\s*\}/g)]
    .filter((m) => !m[1].includes(":"))
    .map((m) => [m[1], m[2]]),
);
function resolve(path) {
  for (let i = 0; i < 5 && REDIRECT.has(path); i++) path = REDIRECT.get(path);
  return path;
}
const pathOf = (u) => {
  try {
    return new URL(u).pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
};

const google = JSON.parse(fs.readFileSync("data/gsc/latest.json", "utf8"));
const bing = JSON.parse(fs.readFileSync("data/gsc/bing-latest.json", "utf8"));
if ((google.byQuery?.length ?? 0) < 100) fail(`data/gsc/latest.json has ${google.byQuery?.length ?? 0} Google queries; expected 100+`);
if (!Array.isArray(google.byQueryPage)) fail("data/gsc/latest.json has no byQueryPage");
if (!Array.isArray(bing.byQuery)) fail("data/gsc/bing-latest.json has no byQuery");
if (!Array.isArray(bing.byQueryPage)) fail("data/gsc/bing-latest.json has no byQueryPage; rerun scripts/search-pull.mjs");
if (google.range?.start !== bing.range?.start || google.range?.end !== bing.range?.end) {
  fail("the Google and Bing files cover different windows; rerun scripts/search-pull.mjs");
}

/** query → the page that took most of its impressions, per engine. */
function topPages(pairs, skip) {
  const best = new Map();
  for (const r of pairs) {
    const [q, url] = r.keys;
    const p = pathOf(url);
    if (!p) continue;
    const path = resolve(p);
    if (skip(path)) continue;
    const cur = best.get(q);
    if (!cur || r.impressions > cur.impressions || (r.impressions === cur.impressions && r.position < cur.position)) {
      best.set(q, { path, impressions: r.impressions, position: r.position });
    }
  }
  return best;
}

/** Pages for one product on one engine, best first, each with its queries. */
function rankPages(rows, pages) {
  const byPage = new Map();
  for (const r of rows) {
    const q = r.keys[0];
    if (r.impressions < MIN_IMPRESSIONS || !publishable(q)) continue;
    const top = pages.get(q);
    if (!top) continue;
    const cur = byPage.get(top.path) ?? { path: top.path, impressions: 0, queries: [] };
    cur.impressions += r.impressions;
    cur.queries.push({ q, impressions: r.impressions });
    byPage.set(top.path, cur);
  }
  for (const p of byPage.values()) p.queries.sort((a, b) => b.impressions - a.impressions);
  return [...byPage.values()].sort((a, b) => b.impressions - a.impressions);
}

function interleave(a, b) {
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

const result = {};
for (const id of ids) {
  const re = MATCH[id];
  const ex = EXCLUDE[id];
  const names = (q) => re.test(q.toLowerCase()) && !(ex && ex.test(q.toLowerCase()));
  const skip = (path) => path === "/" || path === "/apis" || path.startsWith("/apis/");

  const gRows = google.byQuery.filter((r) => names(r.keys[0]));
  const bRows = bing.byQuery.filter((r) => names(r.keys[0]));
  const gPages = rankPages(gRows, topPages(google.byQueryPage.filter((r) => names(r.keys[0])), skip));
  const bPages = rankPages(bRows, topPages(bing.byQueryPage.filter((r) => names(r.keys[0])), skip));

  const order = [];
  for (const p of interleave(gPages, bPages)) if (!order.includes(p.path)) order.push(p.path);

  const pages = order.slice(0, MAX_PAGES).map((path) => {
    const g = gPages.find((p) => p.path === path)?.queries ?? [];
    const b = bPages.find((p) => p.path === path)?.queries ?? [];
    const seen = new Map();
    for (const { q } of interleave(g, b)) {
      const k = norm(q);
      if (seen.has(k)) continue;
      const inG = g.some((x) => norm(x.q) === k);
      const inB = b.some((x) => norm(x.q) === k);
      seen.set(k, { q, engine: inG && inB ? "Google and Bing" : inG ? "Google" : "Bing" });
    }
    return { href: path, queries: [...seen.values()].slice(0, MAX_QUERIES) };
  });

  result[id] = {
    google: gRows.reduce((n, r) => n + r.impressions, 0),
    bing: bRows.reduce((n, r) => n + r.impressions, 0),
    pages,
  };
}

const header = `/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/build-api-demand.mjs
 * after scripts/search-pull.mjs (the weekly live pull).
 *
 * What developers searched for about each product in the API directory, in
 * the 28 days ${google.range.start} to ${google.range.end}: impressions of the
 * disclosed queries naming the product, per engine and never added together,
 * and the pages on this site those queries surfaced, with up to three of the
 * queries each. Selection and filtering rules are in the script's header.
 * ${ids.length} products.
 */`;

const body = `${header}

export type DemandEngine = "Google" | "Bing" | "Google and Bing";
export type DemandPage = { href: string; queries: { q: string; engine: DemandEngine }[] };
export type ApiDemand = { google: number; bing: number; pages: DemandPage[] };

export const API_DEMAND_RANGE = ${JSON.stringify(google.range)} as const;

export const API_DEMAND: Record<string, ApiDemand> = ${JSON.stringify(result, null, 2)};
`;
fs.writeFileSync(OUT, body);

// The index decision itself is not made here: it is NOINDEX_APIS in
// src/data/apis.ts, held steady between reviews so a page near the bar does
// not flip in and out of the index week to week. Each run prints where this
// pull disagrees with it, for the next review.
const noindexBlock = /NOINDEX_APIS[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(apisSrc)?.[1];
if (noindexBlock === undefined) fail("could not find NOINDEX_APIS in src/data/apis.ts");
const noindex = new Set([...noindexBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));
const meetsBar = (r) => (r.google >= 20 || r.bing >= 10) && r.pages.length > 0;

console.log(`build-api-demand: ${google.range.start} → ${google.range.end}, ${ids.length} products → ${OUT}`);
for (const id of ids) {
  const r = result[id];
  const listed = noindex.has(id) ? "noindex" : "indexed";
  const drift = meetsBar(r) === noindex.has(id) ? `  ← this pull says ${meetsBar(r) ? "index" : "noindex"}` : "";
  console.log(`  ${id.padEnd(16)} Google ${String(r.google).padStart(4)}  Bing ${String(r.bing).padStart(4)}  ${r.pages.length} pages  ${listed}${drift}`);
}
