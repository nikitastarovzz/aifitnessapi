#!/usr/bin/env node
/**
 * The index governor: how many new pages the daily content automation may
 * publish today, judged by whether Google is still showing this site's new
 * pages within a week of publication.
 *
 * Why it exists. In normal times most new pages draw their first Search
 * Console impression within seven days (pages published Oct 17, 2026: 50 of
 * 56). From Oct 22 that stopped (Nov 5: 1 of 21). Publishing into an index
 * that has stopped taking new pages only grows the unindexed pile, so this
 * script slows the automation down and reopens it when a probe page is shown
 * again. The rules live in scripts/lib/index-governor.mjs:
 *
 *   judged cohort  pages published asOf - 21 to asOf - 7 (widened to
 *                  asOf - 35 under five pages); share shown within 7 days
 *   verdict        open >= 50%, throttled 20% to under 50%, closed < 20%,
 *                  throttled when there is no recent sample
 *   allowance      new pages a week: open 7, throttled 2, closed 1 (the probe)
 *   today          allowance minus pages published in the last 7 days,
 *                  floored at 0; at most one new page per run
 *
 * Reads:
 *   Search Console Search Analytics (dimensions date + page, dataState all),
 *     the endpoint scripts/search-pull.mjs reads, with the same two auth
 *     paths (scripts/lib/gsc-auth.mjs): GSC_SERVICE_ACCOUNT_JSON when set,
 *     otherwise no header and the aifitnessapi environment's proxy credential
 *   src/data/published.ts        first-published date per page
 *   data/gsc/first-seen.json     the ledger, when it exists
 *   data/gsc/index-state.json    the last run, for `listed` and `recovered`
 *   the sitemap, for the indexable set: the build's (.next/server/app) when
 *     there is one, else --sitemap-url (an index, so each child is fetched)
 *
 * Writes:
 *   data/gsc/first-seen.json     { asOf, firstSeen: { path: date } }: the
 *                                first day each path drew a Google
 *                                impression. A ledger: a date only moves
 *                                earlier and a path is never removed.
 *   data/gsc/index-state.json    the verdict, budget, request list and
 *                                cohorts, for the automation to read
 *   ops/INDEX.md                 the same for the owner, with the
 *                                request-indexing URLs ready to paste
 *
 * A live run with a ledger reads from the ledger's asOf minus 45 days (late
 * rows land on earlier dates) to today and merges; without one, or with
 * --full, it reads from 2026-07-01.
 *
 * Usage:
 *   NODE_USE_ENV_PROXY=1 node scripts/index-governor.mjs   # live read, write the three files
 *   node scripts/index-governor.mjs --offline              # no network: recompute from the ledger
 *   node scripts/index-governor.mjs --full                 # read from 2026-07-01
 *   node scripts/index-governor.mjs --today 2026-11-14     # for tests and reruns
 *   node scripts/index-governor.mjs --sitemap-url https://aifitnessapi.com/sitemap.xml
 *   node scripts/index-governor.mjs --json | --stdout      # print state or INDEX.md, write nothing
 *
 * House rule (CLAUDE.md, generated data): a short or failed read exits
 * non-zero and writes nothing. A full read must name at least 300 pages, an
 * incremental one at least 100. A missing or empty published.ts also exits
 * non-zero. Everything else exits 0.
 */
import fs from "node:fs";
import { normalisePath, parsePublished, parseSitemap } from "./lib/gsc-sections.mjs";
import { readBuiltSitemap, SITE as SITE_ORIGIN } from "./lib/sitemap-files.mjs";
import { serviceAccountToken } from "./lib/gsc-auth.mjs";
import { START_DATE, addDays, firstSeenFromRows, mergeLedger, buildState, stateJson, ledgerJson, renderMarkdown } from "./lib/index-governor.mjs";

const SITE = "sc-domain:aifitnessapi.com";
const GSC = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
const PUBLISHED = "src/data/published.ts";
const LEDGER = "data/gsc/first-seen.json";
const STATE = "data/gsc/index-state.json";
const OUT = "ops/INDEX.md";
const PAGE_SIZE = 25000;
const LOOKBACK_DAYS = 45;
const MIN_PAGES_FULL = 300;
const MIN_PAGES_INCREMENTAL = 100;

const argv = process.argv.slice(2);
const arg = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};
const has = (flag) => argv.includes(flag);

function fail(msg) {
  console.error(`index-governor: ${msg}`);
  process.exit(1);
}

const today = arg("--today") ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) fail(`--today must be YYYY-MM-DD, got ${today}.`);
const offline = has("--offline");
const printOnly = has("--json") || has("--stdout");

// ── Published dates ──────────────────────────────────────────────────────
if (!fs.existsSync(PUBLISHED)) fail(`${PUBLISHED} is missing; run node scripts/backfill-published.mjs.`);
const published = parsePublished(fs.readFileSync(PUBLISHED, "utf8"));
if (!published.size) fail(`${PUBLISHED} has no rows.`);

const readJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null);
const oldLedger = readJson(LEDGER);
const previous = readJson(STATE);

// ── Search Console read ──────────────────────────────────────────────────
async function readSearchConsole(startDate, endDate) {
  let sa;
  try {
    sa = await serviceAccountToken();
  } catch (e) {
    fail(e.message);
  }
  const headers = { "Content-Type": "application/json" };
  if (sa) headers.Authorization = `Bearer ${sa.token}`;
  const rows = [];
  for (let startRow = 0; ; startRow += PAGE_SIZE) {
    const res = await fetch(GSC, {
      method: "POST",
      headers,
      body: JSON.stringify({ startDate, endDate, dimensions: ["date", "page"], dataState: "all", rowLimit: PAGE_SIZE, startRow }),
    }).catch((e) => fail(`Search Console could not be reached (${e.cause?.code ?? e.message}).`));
    if (res.status === 401 || res.status === 403) {
      fail(
        sa
          ? `Search Console answered ${res.status} to ${sa.account}. Add that address as a user of ${SITE} and enable the Search Console API in its Google Cloud project. Nothing written.`
          : `Search Console answered ${res.status}: the credential is missing. With no GSC_SERVICE_ACCOUNT_JSON set, this script relies on the read-only ` +
              `credential the aifitnessapi cloud environment's proxy injects; run it there (with NODE_USE_ENV_PROXY=1). Nothing written.`,
      );
    }
    if (res.status !== 200) fail(`Search Console answered HTTP ${res.status} at startRow ${startRow}. Nothing written.`);
    const page = (await res.json()).rows ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

let ledger;
let readNote;
if (offline) {
  if (!oldLedger?.asOf) fail(`--offline needs ${LEDGER}; run once without --offline first.`);
  ledger = mergeLedger(oldLedger, null);
  readNote = `offline: recomputed from ${LEDGER} (asOf ${ledger.asOf})`;
} else {
  const full = has("--full") || !oldLedger?.asOf;
  const startDate = full ? START_DATE : addDays(oldLedger.asOf, -LOOKBACK_DAYS);
  const rows = await readSearchConsole(startDate, today);
  const read = firstSeenFromRows(rows);
  const pages = new Set(rows.map((r) => normalisePath(r.keys?.[1]))).size;
  const floor = full ? MIN_PAGES_FULL : MIN_PAGES_INCREMENTAL;
  if (pages < floor) fail(`${full ? "full" : "incremental"} read ${startDate} to ${today} returned ${pages} distinct pages (${rows.length} rows), under ${floor}; refusing to write.`);
  // Even a full read merges into the ledger: a path is never removed.
  ledger = mergeLedger(oldLedger, read);
  readNote = `${full ? "full" : "incremental"} read ${startDate} to ${today}: ${rows.length} rows, ${pages} pages, data to ${read.asOf}`;
}

// ── Indexable set ────────────────────────────────────────────────────────
async function sitemapFromUrl(url) {
  const seen = new Set();
  const locs = [];
  const fetchXml = async (u) => {
    if (seen.has(u) || seen.size > 50) return;
    seen.add(u);
    const res = await fetch(u);
    if (!res.ok) throw new Error(`${u}: HTTP ${res.status}`);
    const xml = await res.text();
    const found = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    if (/<sitemapindex\b/.test(xml)) for (const child of found) await fetchXml(child);
    else locs.push(...found);
  };
  await fetchXml(url);
  return locs.map(normalisePath);
}

let indexable = null;
let indexableFrom = null;
const built = readBuiltSitemap();
if (built.index && built.xml) {
  indexable = new Set(parseSitemap(built.xml));
  indexableFrom = "the build (.next/server/app)";
} else if (arg("--sitemap-url") && !offline) {
  try {
    const paths = await sitemapFromUrl(arg("--sitemap-url"));
    if (paths.length) {
      indexable = new Set(paths);
      indexableFrom = arg("--sitemap-url");
    }
  } catch (e) {
    console.warn(`index-governor: sitemap not read (${e.message}); the request list is not filtered.`);
  }
}

// ── Verdict and output ───────────────────────────────────────────────────
const state = buildState({ published, ledger, today, indexable, previous });
const md = renderMarkdown(state, { site: SITE_ORIGIN, indexableFrom });

if (has("--json")) process.stdout.write(stateJson(state));
else if (has("--stdout")) process.stdout.write(md);
if (printOnly) process.exit(0);

fs.mkdirSync("data/gsc", { recursive: true });
fs.writeFileSync(LEDGER, ledgerJson(ledger));
fs.writeFileSync(STATE, stateJson(state));
fs.writeFileSync(OUT, md);
console.log(`index-governor: ${readNote}`);
console.log(`  ${state.verdict}: ${state.reason} (${state.share === null ? "n/a" : `${Math.round(state.share * 100)}%`}); baseline ${state.baseline.share === null ? "n/a" : `${Math.round(state.baseline.share * 100)}%`} of ${state.baseline.sample}`);
console.log(`  new pages today: ${state.newPagesToday} (allowance ${state.allowance}, published in the last 7 days ${state.publishedLast7})`);
console.log(`  request indexing: ${state.requestIndexing.length} of ${state.neverSeenCount} never-seen pages${indexableFrom ? "" : " (not filtered by a sitemap)"}; recovered ${state.recovered.length}`);
console.log(`  wrote ${LEDGER} (${Object.keys(ledger.firstSeen).length} paths), ${STATE}, ${OUT}`);
