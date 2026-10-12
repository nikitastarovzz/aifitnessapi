/**
 * Live weekly search pull: Google Search Console + Bing Webmaster Tools.
 * ops/GROWTH-30-2026-10-12.md #25.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/search-pull.mjs
 *
 * Writes:
 *   data/gsc/latest.json             the shape `npm run gsc` already reads
 *                                    (byQuery, byPage, byQueryPage), plus
 *                                    byCountryDevice for the US-desktop split
 *   data/gsc/snapshots/<date>.json   a dated copy in --snapshot's format, so
 *                                    `npm run gsc -- --compare <date>` works
 *   data/gsc/bing-latest.json        Bing byQuery and byPage, same window, and
 *                                    byQueryPage for queries with 2+ impressions
 *   ops/gsc/bing-<date>.csv          Bing page rows for `npm run gsc`
 *
 * Credentials never live in this repo (it is public):
 *   - Search Console: run inside the aifitnessapi cloud environment, whose
 *     egress proxy injects a read-only service-account credential for
 *     https://www.googleapis.com/webmasters/v3/. Send no Authorization header.
 *     Anywhere else the API answers 401/403 and this script says so.
 *   - Bing: BING_WEBMASTER_API_KEY from the environment. Never printed.
 *
 * Window: the last 28 days of final data. Search Console finalises with a
 * delay of about three days, so the window ends three days before today.
 *
 * House rule (CLAUDE.md, generated data): a short or failed read exits
 * non-zero and writes nothing, rather than replacing good data with a
 * truncated pull.
 */
import fs from "node:fs";
import path from "node:path";

const SITE = "sc-domain:aifitnessapi.com";
const BING_SITE = "https://aifitnessapi.com/";
const GSC = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
const BING = "https://ssl.bing.com/webmaster/api.svc/json";

const day = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 3));
const start = new Date(end);
start.setUTCDate(end.getUTCDate() - 27);
const range = { start: day(start), end: day(end) };
const stamp = day(today);

function fail(msg) {
  console.error(`search-pull: ${msg}`);
  process.exit(1);
}

async function gsc(dimensions, rowLimit = 25000) {
  const res = await fetch(GSC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startDate: range.start, endDate: range.end, dimensions, rowLimit }),
  });
  if (res.status === 401 || res.status === 403) {
    fail(
      `Search Console answered ${res.status}. This script relies on the read-only credential the ` +
        `aifitnessapi cloud environment's proxy injects; run it there (with NODE_USE_ENV_PROXY=1).`,
    );
  }
  if (!res.ok) fail(`Search Console ${dimensions.join("+")} answered HTTP ${res.status}.`);
  const json = await res.json();
  return json.rows ?? [];
}

/** Bing returns dates as "/Date(1784246400000)/". */
const bingDate = (s) => day(new Date(Number(/-?\d+/.exec(s)?.[0] ?? NaN)));

async function bing(method) {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) fail("BING_WEBMASTER_API_KEY is not set; Bing cannot be read.");
  const url = `${BING}/${method}?siteUrl=${encodeURIComponent(BING_SITE)}&apikey=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  // The key is in the URL, so errors report the method only, never the URL.
  if (!res.ok) fail(`Bing ${method} answered HTTP ${res.status}.`);
  const json = await res.json();
  if (!Array.isArray(json.d)) fail(`Bing ${method} returned no rows array.`);
  return json.d;
}

/** Sum Bing's weekly rows inside the window into one row per key. */
function bingWindow(rows) {
  const agg = new Map();
  for (const r of rows) {
    const d = bingDate(r.Date);
    if (d < range.start || d > range.end) continue;
    const k = r.Query;
    const cur = agg.get(k) ?? { clicks: 0, impressions: 0, posWeighted: 0 };
    cur.clicks += r.Clicks;
    cur.impressions += r.Impressions;
    // Impression-weighted, so a 1-impression week cannot outvote a busy one.
    cur.posWeighted += (r.AvgImpressionPosition > 0 ? r.AvgImpressionPosition : 0) * r.Impressions;
    agg.set(k, cur);
  }
  return [...agg.entries()]
    .map(([k, v]) => ({
      keys: [k],
      clicks: v.clicks,
      impressions: v.impressions,
      ctr: v.impressions ? v.clicks / v.impressions : 0,
      position: v.impressions ? v.posWeighted / v.impressions : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);
}

const csvCell = (s) => (/[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));

const [byQuery, byPage, byQueryPage, byCountryDevice] = await Promise.all([
  gsc(["query"]),
  gsc(["page"]),
  gsc(["query", "page"]),
  gsc(["country", "device"]),
]);
// A property with hundreds of pages in Google never returns a near-empty page
// list for 28 days; if it does, the read went wrong and must not be written.
if (byPage.length < 50) fail(`Search Console returned only ${byPage.length} page rows for ${range.start} → ${range.end}; refusing to write.`);

const [bingPagesRaw, bingQueriesRaw] = await Promise.all([bing("GetPageStats"), bing("GetQueryStats")]);
const bingPages = bingWindow(bingPagesRaw);
const bingQueries = bingWindow(bingQueriesRaw);

// Bing's bulk query report names no page, so the page behind each query is a
// second call per query (GetQueryPageStats, whose rows carry the page URL in
// their Query field). Only queries with at least two impressions in the
// window are looked up: below that a query is noise, and the call count stays
// near two hundred a week. Bing throttles bursts ("ThrottleHost"), so the
// calls go one at a time with a pause, backing off when throttled.
// The result has the shape of Google's byQueryPage, but it is partial by
// nature: on 2026-10-12 Bing named a page for 16 of 188 queries, with no call
// failing, and its per-query rows lag its own query totals. Absent pairs mean
// Bing did not say, never that no page ranked.
const BING_PAIR_FLOOR = 2;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function bingPagesFor(query) {
  const key = process.env.BING_WEBMASTER_API_KEY;
  const url = `${BING}/GetQueryPageStats?siteUrl=${encodeURIComponent(BING_SITE)}&query=${encodeURIComponent(query)}&apikey=${encodeURIComponent(key)}`;
  for (const wait of [5000, 15000, 45000, null]) {
    const res = await fetch(url).catch(() => null);
    if (res?.ok) {
      const json = await res.json().catch(() => null);
      if (Array.isArray(json?.d)) return json.d;
    }
    if (wait === null) break;
    await sleep(wait);
  }
  return null;
}
const pairQueries = bingQueries.filter((r) => r.impressions >= BING_PAIR_FLOOR).map((r) => r.keys[0]);
let bingQueryPage = [];
let pairFailures = 0;
for (const q of pairQueries) {
  const rows = await bingPagesFor(q);
  if (!rows) pairFailures++;
  else for (const r of bingWindow(rows)) bingQueryPage.push({ ...r, keys: [q, r.keys[0]] });
  await sleep(1000);
}
// A few lost lookups only drop those queries' pages. Losing more than one in
// ten would publish a pair list that silently misses pages, so the pairs are
// written as null instead; the Google data and Bing's own totals still land,
// and anything built from the pairs (scripts/build-api-demand.mjs) refuses to
// run on null rather than on a partial list.
const pairsComplete = pairFailures <= pairQueries.length / 10;
if (!pairsComplete) {
  console.warn(`search-pull: Bing GetQueryPageStats failed for ${pairFailures} of ${pairQueries.length} queries; byQueryPage is written as null.`);
  bingQueryPage = null;
}

// The repository is public, and Bing reports nearly every query verbatim,
// including the odd one a person pasted with their own credentials in it (an
// OAuth URL carrying a client_id and a private redirect showed up in the
// first pull). Before anything is written, the text of any query carrying a
// URL parameter with a value, an email address or a long identifier is
// withheld; its numbers stay, so totals still add up.
const WITHHELD = "(withheld: the query carried a URL parameter, an email address or an identifier)";
const sensitive = (q) =>
  /[?&][a-z_]+=[^&\s.]{4,}|[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}|\b[0-9a-f]{24,}\b|\b\d{9,}\b/i.test(q);
const scrub = (rows) => rows && rows.map((r) => (sensitive(r.keys[0]) ? { ...r, keys: [WITHHELD, ...r.keys.slice(1)] } : r));
const withheld = [byQuery, byQueryPage, bingQueries, bingQueryPage].flatMap((rows) => rows ?? []).filter((r) => sensitive(r.keys[0])).length;

const exportedAt = new Date().toISOString();
fs.mkdirSync("data/gsc/snapshots", { recursive: true });
fs.mkdirSync("ops/gsc", { recursive: true });

fs.writeFileSync(
  "data/gsc/latest.json",
  JSON.stringify(
    { exportedAt, range, source: "scripts/search-pull.mjs", byQuery: scrub(byQuery), byPage, byQueryPage: scrub(byQueryPage), byCountryDevice },
    null,
    2,
  ) + "\n",
);

// The same dated format --snapshot writes, so --compare reads either.
const pathOf = (u) => {
  try {
    return new URL(u).pathname.replace(/\/$/, "") || "/";
  } catch {
    return u;
  }
};
fs.writeFileSync(
  `data/gsc/snapshots/${stamp}.json`,
  JSON.stringify(
    {
      takenAt: exportedAt,
      range,
      engines: {
        google: byPage.map((r) => ({ path: pathOf(r.keys[0]), clicks: r.clicks, impressions: r.impressions, position: Number(r.position.toFixed(2)) })),
        bing: bingPages.map((r) => ({ path: pathOf(r.keys[0]), clicks: r.clicks, impressions: r.impressions, position: Number(r.position.toFixed(2)) })),
      },
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  "data/gsc/bing-latest.json",
  JSON.stringify(
    {
      exportedAt,
      range,
      source: "scripts/search-pull.mjs (Bing GetPageStats, GetQueryStats, GetQueryPageStats)",
      byPage: bingPages,
      byQuery: scrub(bingQueries),
      byQueryPage: scrub(bingQueryPage),
    },
    null,
    2,
  ) + "\n",
);

// One Bing CSV per pull; `npm run gsc` reads only the newest one per engine,
// so weekly files do not add up into a double count.
const csv = ["Page,Clicks,Impressions,Position", ...bingPages.map((r) => [r.keys[0], r.clicks, r.impressions, r.position.toFixed(2)].map(csvCell).join(","))];
fs.writeFileSync(`ops/gsc/bing-${stamp}.csv`, csv.join("\n") + "\n");

const sum = (rows, k) => rows.reduce((n, r) => n + r[k], 0);
console.log(`search-pull: ${range.start} → ${range.end}`);
console.log(`  Google: ${byPage.length} pages, ${byQuery.length} queries, ${byQueryPage.length} query-page pairs, ${byCountryDevice.length} country-device rows; ${sum(byPage, "clicks")} clicks, ${sum(byPage, "impressions")} impressions (page level)`);
console.log(`  Bing:   ${bingPages.length} pages, ${bingQueries.length} queries; ${sum(bingPages, "clicks")} clicks, ${sum(bingPages, "impressions")} impressions`);
console.log(`          ${bingQueryPage ? bingQueryPage.length : "no"} query-page pairs for the ${pairQueries.length} queries with ${BING_PAIR_FLOOR}+ impressions (${pairFailures} lookups failed)`);
console.log(`  withheld the text of ${withheld} query rows (URL parameters, email addresses, identifiers)`);
console.log(`  wrote data/gsc/latest.json, data/gsc/snapshots/${stamp}.json, data/gsc/bing-latest.json, ops/gsc/bing-${stamp}.csv`);
