#!/usr/bin/env node
/**
 * Build src/data/fitbitWebApi.ts and its evidence file from source-snapshot
 * text of Fitbit's Web API reference (ops/AUDIENCE-30-2026-11-05.md item 10).
 *
 * dev.fitbit.com is blocked from the dev environment, so the pages are read
 * through .github/workflows/source-snapshot.yml (print_chars > 0) and the job
 * logs are saved to .cache/fitbit-web-api/*.txt — never committed, as
 * CLAUDE.md requires of snapshots. This script parses those logs:
 *
 *   - the reference index (the category list and each category's sentence),
 *   - each category page (its endpoint list, one sentence per endpoint),
 *   - each endpoint page: its title, its opening paragraph, its "Scope:"
 *     line, and the HTTP method and path(s) in its Request table.
 *
 * and writes, for every endpoint, those fields verbatim plus two things this
 * site adds, both kept apart from Fitbit's text:
 *
 *   - `kind`: the row of Google's endpoint-type table ("GET (Intraday) …",
 *     "DELETE Logs" …, in GHAPI_ENDPOINT_MAPPING) the endpoint falls under,
 *     classified from its title by the rules in kindOf() below — this site's
 *     reading, shown as such on the page;
 *   - `rows`: the rows of Google's Fitbit → Google Health API data-type table
 *     (GHAPI_DATA_TYPE_MAPPING) the endpoint carries, from the hand-written
 *     MAPPING table below. Every pairing names a `term` that must appear on
 *     the endpoint's own Fitbit page (a field or resource name); the script
 *     fails when it does not, and the line it appears in is written to the
 *     evidence file. A row name that is not in Google's table fails too.
 *
 * ops/sources/evidence/tools-fitbit-to-google-health.json gets one quote per
 * fact (path, scope, title, each term line), so
 * .github/workflows/source-quotes.yml re-reads every page on each PR.
 *
 * A short parse fails: EXPECTED_MIN_ENDPOINTS is the count of the verified
 * 2026-11-05 read.
 *
 * Usage: node scripts/build-fitbit-web-api.mjs [snapshot-log.txt ...]
 *   (default: every .txt in .cache/fitbit-web-api)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://dev.fitbit.com/build/reference/web-api/";
const CACHE = ".cache/fitbit-web-api";
const OUT = "src/data/fitbitWebApi.ts";
const EVIDENCE = "ops/sources/evidence/tools-fitbit-to-google-health.json";
const GHAPI = "src/data/googleHealthApi.ts";

// The 2026-11-05 read: 22 categories on the index, 121 endpoint pages.
const EXPECTED_MIN_CATEGORIES = 22;
const EXPECTED_MIN_ENDPOINTS = 121;

function fail(msg) {
  console.error(`build-fitbit-web-api: ${msg}`);
  process.exit(1);
}

const args = process.argv.slice(2).filter((a) => a.endsWith(".txt"));
const files = args.length ? args : existsSync(CACHE) ? readdirSync(CACHE).filter((f) => f.endsWith(".txt")).map((f) => join(CACHE, f)) : [];
if (!files.length) fail(`no snapshot logs (pass paths, or save job logs to ${CACHE}/*.txt)`);

/** url -> { fetched, text } from the "===== SNAPSHOT … ===== END" blocks. */
const pages = new Map();
for (const f of files) {
  const t = readFileSync(f, "utf8");
  const re = /===== SNAPSHOT (\S+) \| status (\d+) \| fetched (\S+) \| final (\S+)\n([\s\S]*?)\n===== END \1/g;
  for (const m of t.matchAll(re)) {
    const [, url, status, fetched, finalUrl, body] = m;
    if (Number(status) !== 200 || finalUrl !== url) continue;
    const [text, linkBlock = ""] = body.split(/\nLINKS \(\d+\):\n/);
    const links = linkBlock.split("\n").filter((l) => l.startsWith("https://"));
    const prev = pages.get(url);
    if (!prev || prev.fetched < fetched) pages.set(url, { fetched: fetched.slice(0, 10), text, links });
  }
}

const squash = (s) => s.replace(/\s+/g, " ").trim();
const slugOf = (url) => url.slice(BASE.length).replace(/\/$/, "");

// ── Index: categories ────────────────────────────────────────────────────
const index = pages.get(BASE) ?? fail(`index ${BASE} not in the snapshots`);
const catLinks = index.links.filter((l) => l.startsWith(BASE) && /^[a-z0-9-]+\/$/.test(l.slice(BASE.length)));
const SKIP = new Set(["developer-guide", "troubleshooting-guide", "help", "explore"]);
const categories = [];
for (const url of catLinks) {
  const slug = slugOf(url);
  if (SKIP.has(slug)) continue;
  const p = pages.get(url);
  if (!p) fail(`category page ${url} not in the snapshots`);
  const title = /^#{1,2} (.+)$/m.exec(p.text)?.[1].trim() ?? fail(`${url}: no title`);
  categories.push({ slug, title, url, fetchedOn: p.fetched });
}
if (categories.length < EXPECTED_MIN_CATEGORIES) fail(`${categories.length} categories, expected at least ${EXPECTED_MIN_CATEGORIES}`);

// ── Endpoint pages ───────────────────────────────────────────────────────
const endpoints = [];
for (const [url, p] of pages) {
  if (!url.startsWith(BASE)) continue;
  const rest = slugOf(url);
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(rest)) continue;
  const [category] = rest.split("/");
  const cat = categories.find((c) => c.slug === category);
  if (!cat) continue;
  const t = p.text;
  const title = /^#{1,2} (.+)$/m.exec(t)?.[1].trim() ?? fail(`${url}: no title`);
  const afterTitle = t.slice(t.indexOf(title) + title.length).trim();
  const description = squash(afterTitle.split(/\n\n/)[0]);
  const scope = /^Scopes?: (.+)$/m.exec(t)?.[1].trim() ?? null;
  const reqStart = t.indexOf("## Request");
  const req = reqStart === -1 ? "" : t.slice(reqStart).split(/\n(?:URI Arguments|Query Parameters|Request Headers|Body Parameters|POST Parameters|Form Parameters|Examples|## (?!Request))/)[0];
  const method = /\b(GET|POST|DELETE|PUT|PATCH)\b/.exec(req)?.[1] ?? null;
  const paths = [...req.matchAll(/(\/(?:\d(?:\.\d)?|oauth2)\/[^\s|]*)/g)].map((m) => m[1]);
  if (!paths.length) fail(`${url}: no request path`);
  endpoints.push({ id: rest, category, categoryTitle: cat.title, title, description, url, fetchedOn: p.fetched, method, paths, scope });
}
endpoints.sort((a, b) => a.id.localeCompare(b.id));
if (endpoints.length < EXPECTED_MIN_ENDPOINTS) fail(`${endpoints.length} endpoint pages, expected at least ${EXPECTED_MIN_ENDPOINTS}`);

// ── Google's tables (read as text, like scripts/qa.mjs does) ─────────────
const gSrc = readFileSync(GHAPI, "utf8");
const jsonArray = (name) => {
  const m = new RegExp(`export const ${name}: [^=]+= `).exec(gSrc);
  if (!m) fail(`${name} not in ${GHAPI}`);
  const open = m.index + m[0].length;
  return JSON.parse(gSrc.slice(open, gSrc.indexOf("\n];", open) + 2));
};
const G_ROWS = jsonArray("GHAPI_DATA_TYPE_MAPPING");
const G_KINDS = jsonArray("GHAPI_ENDPOINT_MAPPING");
const G_METHODS = jsonArray("GHAPI_METHODS");

// ── Kind: which row of Google's endpoint-type table ──────────────────────
const KIND = {
  single: "GET (Log | Summary | Daily Summary) where you are requesting a single day of data",
  intraday: "GET (Intraday) where you are requesting granular data",
  series: "GET (Time Series) by Date or Interval",
  logList: "GET (Log List)",
  write: "CREATE & UPDATE Logs",
  remove: "DELETE Logs",
  getProfile: "GET Profile",
  updateProfile: "UPDATE Profile",
  devices: "Get Devices",
  subCreate: "Create Subscriptions",
  subDelete: "Delete Subscriptions",
  subList: "Get Subscriptions List",
};
for (const k of Object.values(KIND)) if (!G_KINDS.some((r) => r.fitbitEndpointType === k)) fail(`Google's endpoint table no longer has "${k}"`);

/**
 * This site's classification of a Fitbit endpoint title into one of Google's
 * endpoint types. Only data endpoints (those with a row in MAPPING) get a data
 * kind; the named ones (profile, devices, subscriptions) are matched by id.
 */
function kindOf(e, mapped) {
  const named = {
    "user/get-profile": KIND.getProfile,
    "user/update-profile": KIND.updateProfile,
    "devices/get-devices": KIND.devices,
    "subscription/create-subscription": KIND.subCreate,
    "subscription/delete-subscription": KIND.subDelete,
    "subscription/get-subscription-list": KIND.subList,
  };
  if (named[e.id]) return named[e.id];
  if (!mapped) return null;
  const t = e.title;
  if (/\bIntraday\b/.test(t)) return KIND.intraday;
  if (/\bLog List\b|\bAlerts List\b/.test(t)) return KIND.logList;
  if (/^(Create|Update)\b.*\bLog$/.test(t)) return KIND.write;
  if (/^Delete\b.*\bLog$/.test(t)) return KIND.remove;
  if (/\bTime Series\b|\bby (Interval|Date Range)\b/.test(t)) return KIND.series;
  if (/^Get\b.*(\bby Date|\bLog|Daily Activity Summary)$/.test(t)) return KIND.single;
  return null;
}

// ── The mapping: endpoint → Google's data-type rows ──────────────────────
// Hand-written. Each pairing: the row's Fitbit name exactly as Google's
// migration table prints it, and a term the endpoint's own page must carry.
// An endpoint absent here is reported unmapped, with nothing guessed.
const r = (google, term) => ({ google, term });
const AZM = [r("Active Zone Minutes", "active-zone-minutes")];
const ACT_SERIES = [
  r("Steps", "steps"),
  r("Distance", "distance"),
  r("Floors", "floors"),
  r("Elevation", "elevation"),
  r("Activity Calories", "activityCalories"),
  r("Activity `caloriesBMR`", "caloriesBMR"),
  r("Activity time series minutes sedentary", "minutesSedentary"),
  r("Activity time series swimming strokes", "swimming-strokes"),
];
const ACT_INTRADAY = [r("Steps", "steps"), r("Distance", "distance"), r("Floors", "floors"), r("Elevation", "elevation")];
const MAPPING = {
  "active-zone-minutes-timeseries/get-azm-timeseries-by-date": AZM,
  "active-zone-minutes-timeseries/get-azm-timeseries-by-interval": AZM,
  "intraday/get-azm-intraday-by-date": AZM,
  "intraday/get-azm-intraday-by-interval": AZM,
  "activity-timeseries/get-activity-timeseries-by-date": ACT_SERIES,
  "activity-timeseries/get-activity-timeseries-by-date-range": ACT_SERIES,
  "intraday/get-activity-intraday-by-date": ACT_INTRADAY,
  "intraday/get-activity-intraday-by-interval": ACT_INTRADAY,
  "activity/get-daily-activity-summary": [
    r("Activity `caloriesOut`", "caloriesOut"),
    r("Activity `caloriesBMR`", "caloriesBMR"),
    r("Activity Calories", "activityCalories"),
    r("Steps", "steps"),
    r("Floors", "floors"),
    r("Elevation", "elevation"),
    r("Resting heart rate", "restingHeartRate"),
  ],
  "activity/get-activity-log-list": [r("Recorded activity", "activityName")],
  "activity/create-activity-log": [r("Recorded activity", "activityName")],
  "activity/delete-activity-log": [r("Recorded activity", "activity-log-id")],
  "blood-glucose/get-blood-glucose-by-interval": [r("Blood Glucose", "glucose")],
  "body-timeseries/get-body-timeseries-by-date": [r("Weight", "weight"), r("Body fat", "fat")],
  "body-timeseries/get-body-timeseries-by-date-range": [r("Weight", "weight"), r("Body fat", "fat")],
  "body-timeseries/get-bodyfat-timeseries-by-date": [r("Body fat", "fat")],
  "body-timeseries/get-bodyfat-timeseries-by-date-range": [r("Body fat", "fat")],
  "body-timeseries/get-weight-timeseries-by-date": [r("Weight", "weight")],
  "body-timeseries/get-weight-timeseries-by-date-range": [r("Weight", "weight")],
  "body/create-bodyfat-log": [r("Body fat", "fat")],
  "body/delete-bodyfat-log": [r("Body fat", "body-fat-log-id")],
  "body/get-bodyfat-log": [r("Body fat", "fat")],
  "body/create-weight-log": [r("Weight", "weight")],
  "body/delete-weight-log": [r("Weight", "weight-log-id")],
  "body/get-weight-log": [r("Weight", "weight")],
  "cardio-fitness-score/get-vo2max-summary-by-date": [r("VO2 Max value", "vo2Max")],
  "cardio-fitness-score/get-vo2max-summary-by-interval": [r("VO2 Max value", "vo2Max")],
  "electrocardiogram/get-ecg-log-list": [r("Electrocardiogram (ECG)", "ECG")],
  "heartrate-timeseries/get-heartrate-timeseries-by-date": [
    r("Resting heart rate", "restingHeartRate"),
    r("`caloriesOut` in each heart rate zone", "caloriesOut"),
  ],
  "heartrate-timeseries/get-heartrate-timeseries-by-date-range": [
    r("Resting heart rate", "restingHeartRate"),
    r("`caloriesOut` in each heart rate zone", "caloriesOut"),
  ],
  "intraday/get-heartrate-intraday-by-date": [r("Heart Rate", "heart")],
  "intraday/get-heartrate-intraday-by-interval": [r("Heart Rate", "heart")],
  "heartrate-variability/get-hrv-summary-by-date": [r("HRV summary", "dailyRmssd")],
  "heartrate-variability/get-hrv-summary-by-interval": [r("HRV summary", "dailyRmssd")],
  "intraday/get-hrv-intraday-by-date": [r("HRV Intraday", "rmssd")],
  "intraday/get-hrv-intraday-by-interval": [r("HRV Intraday", "rmssd")],
  "irregular-rhythm-notifications/get-irn-alerts-list": [r("Irregular Rhythm Notifications (IRN)", "IRN")],
  "nutrition/create-food-log": [r("Food Log", "foodId")],
  "nutrition/get-food-log": [r("Food Log", "foods")],
  "nutrition/update-food-log": [r("Food Log", "food-log-id")],
  "nutrition/delete-food-log": [r("Food Log", "food-log-id")],
  "nutrition/get-food": [r("Food", "food-id")],
  "nutrition/get-food-units": [r("Food Measurement Unit", "units")],
  "sleep/create-sleep-log": [r("Sleep", "sleep")],
  "sleep/delete-sleep-log": [r("Sleep", "sleep")],
  "sleep/get-sleep-log-by-date": [r("Sleep", "levels")],
  "sleep/get-sleep-log-by-date-range": [r("Sleep", "levels")],
  "sleep/get-sleep-log-list": [r("Sleep", "levels")],
  "spo2/get-spo2-summary-by-date": [r("SpO2 summary", "avg")],
  "spo2/get-spo2-summary-by-interval": [r("SpO2 summary", "avg")],
  "intraday/get-spo2-intraday-by-date": [r("SpO2 Intraday", "minutes")],
  "intraday/get-spo2-intraday-by-interval": [r("SpO2 Intraday", "minutes")],
  "temperature/get-temperature-core-summary-by-date": [r("Temperature (Core)", "core")],
  "temperature/get-temperature-core-summary-by-interval": [r("Temperature (Core)", "core")],
  "temperature/get-temperature-skin-summary-by-date": [r("Skin temperature", "nightlyRelative")],
  "temperature/get-temperature-skin-summary-by-interval": [r("Skin temperature", "nightlyRelative")],
};

/**
 * Discovery-document methods named after a Fitbit endpoint that Google's
 * migration tables do not list. Shown separately and labelled as this site's
 * name match: the method exists in Google's discovery document, but Google
 * has not said it replaces the endpoint.
 */
const NAME_MATCHES = {
  "activity/get-activity-tcx": "health.users.dataTypes.dataPoints.exportExerciseTcx",
  "irregular-rhythm-notifications/get-irn-profile": "health.users.getIrnProfile",
};
for (const id of Object.values(NAME_MATCHES)) if (!G_METHODS.some((m) => m.id === id)) fail(`${id} not in the discovery methods`);

// ── Evidence ─────────────────────────────────────────────────────────────
const evidence = [];
/** The text line of `t` containing `needle`, cleaned to quotable running text. */
function lineWith(t, needle) {
  for (const raw of t.split("\n")) {
    if (!raw.includes(needle)) continue;
    const line = squash(raw.replace(/\|/g, " ").replace(/^#{1,6}\s+/, "").replace(/^-\s+/, ""));
    if (line.length >= 12 && !/[`*]/.test(line)) return line.length > 240 ? line.slice(0, 240).replace(/\s\S*$/, "") : line;
  }
  // A short line: take the paragraph around it.
  const i = t.indexOf(needle);
  const para = squash(t.slice(Math.max(0, t.lastIndexOf("\n\n", i)), t.indexOf("\n\n", i) === -1 ? undefined : t.indexOf("\n\n", i)).replace(/\|/g, " "));
  return para.length >= 12 ? para.slice(0, 240) : null;
}

const allIds = new Set(endpoints.map((e) => e.id));
for (const id of [...Object.keys(MAPPING), ...Object.keys(NAME_MATCHES)]) if (!allIds.has(id)) fail(`MAPPING names ${id}, which is not an endpoint page`);

for (const e of endpoints) {
  const t = pages.get(e.url).text;
  const rows = (MAPPING[e.id] ?? []).map(({ google, term }) => {
    const g = G_ROWS.find((x) => x.fitbitDataType === google);
    if (!g) fail(`${e.id}: "${google}" is not a row of Google's data-type table`);
    if (!t.includes(term)) fail(`${e.id}: term "${term}" is not on the endpoint's page`);
    const quote = lineWith(t, term);
    if (!quote) fail(`${e.id}: no quotable line for "${term}"`);
    evidence.push({ claim: `${e.title} carries ${google} data (the page names ${term}), so it maps to Google's "${google}" row.`, url: e.url, quote });
    return { google, googleDataType: g.googleDataType, term, termEvidence: quote };
  });
  e.rows = rows;
  e.kind = kindOf(e, rows.length > 0);
  e.nameMatch = NAME_MATCHES[e.id] ?? null;
  evidence.push({ claim: `${e.title}: ${e.method ?? "(method not printed)"} ${e.paths[0]}`, url: e.url, quote: e.paths[0] });
  if (e.scope) evidence.push({ claim: `${e.title} needs the ${e.scope} scope.`, url: e.url, quote: `Scope: ${e.scope}` });
  if (e.description.length >= 12) evidence.push({ claim: `${e.title}, in Fitbit's words.`, url: e.url, quote: e.description.length > 240 ? e.description.slice(0, 240).replace(/\s\S*$/, "") : e.description });
}
for (const c of categories) {
  const t = pages.get(c.url).text;
  const intro = squash(t.slice(t.indexOf(c.title) + c.title.length).trim().split(/\n\n/)[0]);
  const quote = c.title.length >= 12 ? c.title : intro.length > 240 ? intro.slice(0, 240).replace(/\s\S*$/, "") : intro;
  evidence.push({ claim: `Fitbit's Web API reference has a ${c.title} section.`, url: c.url, quote });
}
// Drop evidence rows whose quote is too short to count, rather than ship one
// the checker would reject; the claim still stands on the path quote.
const kept = evidence.filter((x) => x.quote && x.quote.length >= 12);

const fetchedOn = [...new Set(endpoints.map((e) => e.fetchedOn))].sort();
const head = `// GENERATED by scripts/build-fitbit-web-api.mjs from source-snapshot text of
// Fitbit's Web API reference (${BASE}), read ${fetchedOn.join(", ")}.
// Do not edit by hand: re-snapshot the pages, save the job logs to
// ${CACHE}/, and rerun. Fitbit's text is verbatim; \`kind\`, \`rows\` and
// \`nameMatch\` are this site's mapping onto Google's migration tables
// (src/data/googleHealthApi.ts), explained in the script header.

export type FitbitCategory = { slug: string; title: string; url: string; fetchedOn: string };

export type FitbitEndpoint = {
  /** "<category>/<page>", the page's path under the reference. */
  id: string;
  category: string;
  categoryTitle: string;
  /** The page's title, verbatim. */
  title: string;
  /** The page's opening paragraph, verbatim (whitespace collapsed). */
  description: string;
  url: string;
  fetchedOn: string;
  method: string | null;
  /** Every path in the page's Request table, verbatim. */
  paths: string[];
  /** The page's "Scope:" line, verbatim; null where it prints none. */
  scope: string | null;
  /** Google's endpoint-type row this endpoint falls under (this site's classification); null for none. */
  kind: string | null;
  /** Rows of Google's data-type table, each with the term on Fitbit's page it rests on. */
  rows: { google: string; googleDataType: string; term: string; termEvidence: string }[];
  /** A discovery method named after the endpoint that Google's tables do not list. */
  nameMatch: string | null;
};
`;
const body =
  head +
  `\nexport const FITBIT_REFERENCE_URL = ${JSON.stringify(BASE)};\n` +
  `export const FITBIT_FETCHED_ON = ${JSON.stringify(fetchedOn[fetchedOn.length - 1])};\n\n` +
  `export const FITBIT_CATEGORIES: FitbitCategory[] = ${JSON.stringify(categories, null, 2)};\n\n` +
  `export const FITBIT_ENDPOINTS: FitbitEndpoint[] = ${JSON.stringify(endpoints, null, 2)};\n`;
writeFileSync(OUT, body);
writeFileSync(EVIDENCE, JSON.stringify(kept, null, 2) + "\n");
const mapped = endpoints.filter((e) => e.rows.length || e.kind).length;
console.log(`build-fitbit-web-api: ${categories.length} categories, ${endpoints.length} endpoints (${mapped} mapped to Google's tables, ${endpoints.filter((e) => e.nameMatch).length} name matches) → ${OUT}; ${kept.length} quotes → ${EVIDENCE}`);
