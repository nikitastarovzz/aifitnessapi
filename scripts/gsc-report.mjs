/**
 * Search performance report. Google + Bing.
 *
 * Reads two sources, because the site holds two and the old version only
 * knew about one:
 *   - data/gsc/latest.json  — Search Console API snapshot (byQuery, byPage,
 *     byQueryPage). This is where the real data has been living. The previous
 *     version of this script never looked at it, so `npm run gsc` reported
 *     "no data" while 116 KB of it sat in the repo.
 *   - ops/gsc/*.csv         — manual exports. `google-*.csv` and `bing-*.csv`
 *     are kept apart: Bing's CTR curve is not Google's and averaging them
 *     produces a number that describes neither engine.
 *
 * Jobs:
 *   1. Opportunity ranking by modelled clicks left on the table.
 *   2. --cohorts   title-length buckets against the built HTML.
 *   3. --compare   two snapshots, page by page: what moved since when. When
 *      ops/gsc/retitled.txt exists, the movement is also split into retitled
 *      pages vs untouched pages (the control), so a title wave's effect can be
 *      told apart from a recovery that lifts every page at once.
 *   4. --snapshot  archive today's read into data/gsc/snapshots/ so there is
 *      a time series instead of a single file that each export overwrites.
 *   5. GEO citation proxy: queries that quote the site's own sentences
 *      (ops/GEO.md → Measurement). Always runs when the API snapshot exists.
 *   6. Weekly health checks (ops/NEXT-10-2026-11-04.md item 3): CTR
 *      anomalies on page one, cannibalised queries, decay against an earlier
 *      snapshot at a stable position, and sitemap URLs with no impressions.
 *      Always runs; the logic is in scripts/lib/gsc-sections.mjs (tested by
 *      scripts/gsc-sections.test.mjs). Options:
 *        --current <date>   snapshot to judge (default: the snapshot whose
 *                           window matches data/gsc/latest.json, else
 *                           latest.json's own page rows)
 *        --previous <date>  baseline for decay (default: the newest older
 *                           snapshot whose window differs)
 *        --sitemap <file>   a sitemap <urlset> XML file (default: the
 *                           build's sitemap index and every child sitemap
 *                           it lists, under .next/server/app; skipped
 *                           without a build)
 *
 * Methodology note, and the reason this file was rewritten:
 *
 * The old scoring ranked pages by `impressions × (siteCTR − pageCTR)`. On a
 * site whose overall CTR is 0.76%, that benchmark says a page sitting at
 * position 5 with 2% CTR has *negative* opportunity — it is already beating
 * the site average. That is backwards. A page at position 5 should be earning
 * around 6%, and the gap between what a position pays and what the page
 * actually takes is the whole point of the report.
 *
 * So the benchmark is now position-aware. The curve (scripts/lib/gsc-sections.mjs) is a public
 * composite and is approximate by nature; it is used only to *rank* pages
 * against each other, never reported as a target. Two pages at the same
 * position are still compared like for like, which is all the ranking needs.
 */
import fs from "node:fs";
import path from "node:path";
import { readBuiltSitemap } from "./lib/sitemap-files.mjs";
import {
  CTR_CURVE,
  expectedCtr,
  mergeByPath,
  ctrAnomalies,
  cannibalisation,
  decay,
  parseSitemap,
  parsePublished,
  indexLag,
  overlapDays,
} from "./lib/gsc-sections.mjs";

const CSV_DIR = "ops/gsc";
const JSON_SNAPSHOT = "data/gsc/latest.json";
const SNAP_DIR = "data/gsc/snapshots";
const RETITLED_FILE = "ops/gsc/retitled.txt";
const ENTRIES_DIR = "src/data";
const POSTS_DIR = "content/posts";

// The position → expected-CTR curve lives in scripts/lib/gsc-sections.mjs,
// shared with the weekly health checks below so the two cannot drift apart.

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cell += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell.trim()); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") cell += ch;
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows;
}

/** GSC exports percentages as "3.2%" and positions with a locale decimal. */
function num(v) {
  if (v == null) return 0;
  const s = String(v).replace(/%/g, "").replace(/\s/g, "").replace(/,(\d{1,2})$/, ".$1").replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function pathOf(url) {
  try {
    const u = new URL(url);
    // www and apex are the same page. Google indexed 142 www URLs on this
    // site while the canonical is the apex, so keying on the host would split
    // every row in two.
    return u.pathname || "/";
  } catch {
    return String(url || "/");
  }
}

/** One engine's page-level rows, merged from every source that has them. */
function emptyEngine() {
  return { pages: new Map(), queries: new Map(), sources: [], range: null };
}

function addPage(engine, url, { clicks, impressions, position }) {
  const p = pathOf(url);
  const cur = engine.pages.get(p) ?? { clicks: 0, impressions: 0, posWeighted: 0 };
  cur.clicks += clicks;
  cur.impressions += impressions;
  // Position must be weighted by impressions — averaging raw positions lets a
  // 1-impression row at position 3 outvote a 400-impression row at position 9.
  cur.posWeighted += (position || 0) * impressions;
  engine.pages.set(p, cur);
}

function addQuery(engine, q, { clicks, impressions, position }) {
  const cur = engine.queries.get(q) ?? { clicks: 0, impressions: 0, posWeighted: 0 };
  cur.clicks += clicks;
  cur.impressions += impressions;
  cur.posWeighted += (position || 0) * impressions;
  engine.queries.set(q, cur);
}

const engines = { google: emptyEngine(), bing: emptyEngine() };

// ---- source 1: the API snapshot -------------------------------------------
// Kept at module scope for the GEO section, which needs byQueryPage.
let apiSnap = null;
if (fs.existsSync(JSON_SNAPSHOT)) {
  const snap = JSON.parse(fs.readFileSync(JSON_SNAPSHOT, "utf8"));
  apiSnap = snap;
  const g = engines.google;
  for (const r of snap.byPage ?? []) {
    addPage(g, r.keys[0], { clicks: r.clicks, impressions: r.impressions, position: r.position });
  }
  for (const r of snap.byQuery ?? []) {
    addQuery(g, r.keys[0], { clicks: r.clicks, impressions: r.impressions, position: r.position });
  }
  g.range = snap.range ?? null;
  g.sources.push(`${JSON_SNAPSHOT} (${snap.range?.start ?? "?"} → ${snap.range?.end ?? "?"})`);
}

// ---- source 1b: Bing queries from the live pull ---------------------------
// scripts/search-pull.mjs writes Bing's query rows beside the page CSV. Bing
// names the query behind almost every click, where Google withholds most, so
// its queries are read as their own evidence (ops/DAILY-CONTENT.md §2).
const BING_JSON = "data/gsc/bing-latest.json";
if (fs.existsSync(BING_JSON)) {
  const b = JSON.parse(fs.readFileSync(BING_JSON, "utf8"));
  for (const r of b.byQuery ?? []) {
    addQuery(engines.bing, r.keys[0], { clicks: r.clicks, impressions: r.impressions, position: r.position });
  }
  engines.bing.range = b.range ?? null;
  engines.bing.sources.push(`${BING_JSON} queries (${b.range?.start ?? "?"} → ${b.range?.end ?? "?"})`);
}

// ---- source 2: manual CSV exports ------------------------------------------
// Newest file per engine only. scripts/search-pull.mjs writes a dated
// bing-YYYY-MM-DD.csv every week; summing them would count each page once per
// pull. Filenames sort by date, so the last one per engine is the newest.
const csvFiles = (() => {
  const all = fs.existsSync(CSV_DIR) ? fs.readdirSync(CSV_DIR).filter((f) => f.endsWith(".csv")).sort() : [];
  const newest = new Map();
  for (const f of all) newest.set(/^bing/i.test(f) ? "bing" : "google", f);
  return [...newest.values()];
})();

for (const f of csvFiles) {
  const engineKey = /^bing/i.test(f) ? "bing" : "google";
  const engine = engines[engineKey];
  const rows = parseCsv(fs.readFileSync(path.join(CSV_DIR, f), "utf8"));
  if (rows.length < 2) { console.error(`gsc-report: ${f} is empty — skipped.`); continue; }
  const head = rows[0].map((h) => h.toLowerCase());
  const iUrl = head.findIndex((h) => /page|url|address/.test(h));
  const iClicks = head.findIndex((h) => /click/.test(h));
  const iImp = head.findIndex((h) => /impression/.test(h));
  const iPos = head.findIndex((h) => /position|rank/.test(h));
  if (iUrl < 0 || iClicks < 0 || iImp < 0) {
    console.error(`gsc-report: ${f} headers not recognised (${rows[0].join(", ")}) — skipped.`);
    continue;
  }
  let n = 0;
  for (const r of rows.slice(1)) {
    if (!r[iUrl]) continue;
    addPage(engine, r[iUrl], {
      clicks: num(r[iClicks]),
      impressions: num(r[iImp]),
      position: iPos >= 0 ? num(r[iPos]) : 0,
    });
    n++;
  }
  engine.sources.push(`${f} (${n} rows)`);
}

function finalise(engine) {
  const rows = [...engine.pages.entries()].map(([p, v]) => {
    const position = v.impressions ? v.posWeighted / v.impressions : 0;
    const ctr = v.impressions ? v.clicks / v.impressions : 0;
    const exp = expectedCtr(position);
    return {
      path: p,
      clicks: v.clicks,
      impressions: v.impressions,
      position,
      ctr,
      expected: exp,
      // Modelled clicks left on the table. Negative means over-performing.
      gap: v.impressions * exp - v.clicks,
    };
  });
  rows.sort((a, b) => b.gap - a.gap);
  return rows;
}

const hasAny = Object.values(engines).some((e) => e.pages.size > 0);
if (!hasAny) {
  console.log(
    "gsc-report: no data.\n" +
      `  Looked for: ${JSON_SNAPSHOT} and ${CSV_DIR}/*.csv\n` +
      "  See ops/gsc/README.md for what to export.",
  );
  process.exit(0);
}

const report = {};
for (const [name, engine] of Object.entries(engines)) {
  if (engine.pages.size === 0) continue;
  const rows = finalise(engine);
  report[name] = rows;

  const totImp = rows.reduce((n, r) => n + r.impressions, 0);
  const totClicks = rows.reduce((n, r) => n + r.clicks, 0);
  const label = name === "bing" ? "Bing" : "Google";

  console.log(`\n${"=".repeat(68)}\n${label}\n${"=".repeat(68)}`);
  for (const s of engine.sources) console.log(`  source: ${s}`);
  console.log(
    `\n  ${rows.length} pages · ${totImp} impressions · ${totClicks} clicks · CTR ${(totImp ? (totClicks / totImp) * 100 : 0).toFixed(2)}%`,
  );

  // US desktop distorts every click-through number on this site: in the
  // 28 days to 2026-10-10 it was 39% of impressions at 0.26% CTR
  // (GROWTH-30 #24). Property-level rows can be split by country and device
  // without losing the withheld queries; page-level rows cannot, so this line
  // is the honest check before reading any page's CTR as a leak.
  if (name === "google" && apiSnap?.byCountryDevice?.length) {
    const cd = apiSnap.byCountryDevice;
    const isUsDesktop = (r) => r.keys[0] === "usa" && r.keys[1] === "DESKTOP";
    const tot = (rs) => rs.reduce((a, r) => [a[0] + r.clicks, a[1] + r.impressions], [0, 0]);
    const pct = ([c, i]) => (i ? ((c / i) * 100).toFixed(2) : "0.00");
    const all = tot(cd);
    const us = tot(cd.filter(isUsDesktop));
    const rest = tot(cd.filter((r) => !isUsDesktop(r)));
    console.log(
      `  property CTR ${pct(all)}% · excluding US desktop ${pct(rest)}% · US desktop alone ${pct(us)}% ` +
        `(${us[1]} impressions, ${all[1] ? ((us[1] / all[1]) * 100).toFixed(0) : 0}% of all)`,
    );
  }

  // `www.` URLs still in Google's data. www 308s to the apex and every
  // canonical names the apex, so this should shrink pull over pull; a rise
  // means the redirect or a canonical broke (ops/SERP-30-2026-10-12.md #9).
  if (name === "google" && apiSnap?.byPage?.length) {
    const www = apiSnap.byPage.filter((r) => {
      try {
        return new URL(r.keys[0]).hostname.startsWith("www.");
      } catch {
        return false;
      }
    });
    const wImp = www.reduce((n, r) => n + r.impressions, 0);
    const aImp = apiSnap.byPage.reduce((n, r) => n + r.impressions, 0);
    console.log(
      `  www. URLs still in Google: ${www.length} pages, ${wImp} impressions (${aImp ? ((wImp / aImp) * 100).toFixed(0) : 0}% of all), ` +
        `${www.reduce((n, r) => n + r.clicks, 0)} clicks`,
    );
  }

  // Page-one pages earning nothing: the clearest statement of a CTR problem,
  // and invisible under the old site-average benchmark.
  const pageOne = rows.filter((r) => r.position > 0 && r.position <= 10);
  const dead = pageOne.filter((r) => r.clicks === 0);
  if (pageOne.length) {
    const pImp = pageOne.reduce((n, r) => n + r.impressions, 0);
    const pClk = pageOne.reduce((n, r) => n + r.clicks, 0);
    console.log(
      `  page one (pos ≤10): ${pageOne.length} pages · ${pImp} impressions · ${pClk} clicks · CTR ${(pImp ? (pClk / pImp) * 100 : 0).toFixed(2)}%`,
    );
    if (dead.length) {
      const dImp = dead.reduce((n, r) => n + r.impressions, 0);
      console.log(`  of those, ${dead.length} pages have ZERO clicks across ${dImp} impressions`);
    }
  }

  const recoverable = rows.reduce((n, r) => n + Math.max(0, r.gap), 0);
  console.log(
    `  modelled clicks left on the table: ${recoverable.toFixed(0)} (vs ${totClicks} actual) — ranking device, not a forecast`,
  );

  console.log(`\n  Top opportunities (impressions × CTR gap for their position):`);
  console.log(
    `  ${"page".padEnd(50)} ${"imp".padStart(6)} ${"clk".padStart(4)} ${"ctr%".padStart(6)} ${"exp%".padStart(6)} ${"pos".padStart(6)} ${"gap".padStart(6)}`,
  );
  for (const r of rows.slice(0, 25)) {
    if (r.gap < 0.5) break;
    console.log(
      `  ${r.path.padEnd(50).slice(0, 50)} ${String(r.impressions).padStart(6)} ${String(r.clicks).padStart(4)} ` +
        `${(r.ctr * 100).toFixed(1).padStart(6)} ${(r.expected * 100).toFixed(1).padStart(6)} ` +
        `${r.position.toFixed(1).padStart(6)} ${r.gap.toFixed(1).padStart(6)}`,
    );
  }

  // Underperformance, named. Distinct from a regression: this compares a
  // page against what its CURRENT position should pay, which needs no
  // history and is available on the first export. A true regression — this
  // page got worse than it was — needs two points in time and lives under
  // --compare. Blurring the two would let "we never earned these clicks"
  // read as "we lost them".
  const under = rows.filter((r) => r.impressions >= 20 && r.ctr < r.expected / 2);
  if (under.length) {
    console.log(`\n  Earning under half what their position should pay (${under.length} pages, ≥20 impressions):`);
    for (const r of under.slice(0, 15)) {
      console.log(
        `  ${r.path.padEnd(50).slice(0, 50)} ${String(r.impressions).padStart(6)} imp  ` +
          `ctr ${(r.ctr * 100).toFixed(1).padStart(5)}% vs ${(r.expected * 100).toFixed(1)}% at pos ${r.position.toFixed(1)}`,
      );
    }
    if (under.length > 15) console.log(`  …and ${under.length - 15} more`);
  }

  if (engine.queries.size) {
    const qrows = [...engine.queries.entries()]
      .map(([q, v]) => {
        const position = v.impressions ? v.posWeighted / v.impressions : 0;
        return { q, ...v, position, ctr: v.impressions ? v.clicks / v.impressions : 0, gap: v.impressions * expectedCtr(position) - v.clicks };
      })
      .sort((a, b) => b.gap - a.gap);
    console.log(`\n  Queries ranking well and earning nothing:`);
    let shown = 0;
    for (const r of qrows) {
      if (r.gap < 0.5 || shown >= 12) break;
      console.log(
        `  ${r.q.padEnd(50).slice(0, 50)} ${String(r.impressions).padStart(6)} ${String(r.clicks).padStart(4)} ${r.position.toFixed(1).padStart(6)}`,
      );
      shown++;
    }
    if (shown === 0) console.log("    (none above threshold)");
  }
}

if (!report.bing) {
  console.log(
    `\nNo Bing data. Bing Webmaster Tools → Search Performance → Pages → Export,\n` +
      `saved as ${CSV_DIR}/bing-YYYY-MM-DD.csv. Bing is a separate index with its own\n` +
      `curve; nothing here estimates it from Google's numbers.`,
  );
}

// ---- GEO citation proxy: queries that quote our own sentences ---------------
//
// ops/GEO.md (Measurement) counts a query that reproduces one of the site's
// own sentences as the best available sign that someone pasted our text —
// usually out of an AI answer — into Google. The first confirmed case,
//   "personal access tokens were deprecated in december 2025" oura
// is a sentence from src/data/integrate.entries.ts and fitnessApis.entries.ts,
// and earlier planning misread it as a vendor developer string. This makes
// the check mechanical instead of a judgement call.
//
// Candidates: queries (byQuery ∪ byQueryPage) with ≥5 words or a quoted
// segment. The phrase tested is each quoted segment, or the whole query when
// it has no usable quote. Both sides are normalised the same way — lowercase,
// every run of non-letter/digit characters collapsed to one space, markdown
// link targets dropped — and the phrase must sit on word boundaries inside a
// single string of the site's text, so it cannot straddle two fields.
//
// Corpus, built once: the string values of src/data/*.entries.ts (the arrays
// are JSON literals, so they are parsed rather than scraped) and the bodies of
// content/posts/*.mdx plus their front-matter description and FAQ answers.
// Title-ish fields (slug, primaryQuery, h1, metaTitle, FAQ questions, post
// titles) are left out: they are written in searcher phrasing on purpose, so
// a query matching one is SEO working, not somebody quoting a sentence.
//
// Two filters, both there because the unfiltered run produced false positives:
//   - a phrase needs ≥4 words. A short quoted fragment ("x-app-id", a product
//     name) matches half the site and quotes nobody's sentence.
//   - a query containing a code-ish token — a domain, a path, a dotted or
//     snake_case identifier — is a vendor string (an endpoint, a model file, a
//     constant). Our guides quote those in code samples, so they match, but
//     nobody is pasting our prose. They are listed separately, not dropped
//     silently, so the reader can overrule the filter.
const GEO_MIN_PHRASE_WORDS = 4;
const GEO_TITLE_KEYS = new Set(["slug", "primaryQuery", "h1", "metaTitle", "q"]);
const GEO_CODEISH = /\p{L}\.\p{L}|[\p{L}\p{N}]_[\p{L}\p{N}]|\p{L}\/|\/\p{L}/u;

function normText(s) {
  return String(s)
    .toLowerCase()
    .replace(/\]\([^)\s]*\)/g, "]") // [text](/url) → [text]
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Every searchable unit of site text: one per cluster entry, one per post. */
function buildSiteCorpus() {
  const units = [];
  const counts = { files: 0, entries: 0, posts: 0 };
  const unit = (file, label, parts) => units.push({ file, label, text: ` ${parts.join(" \u0001 ")} ` });

  const entryFiles = fs.existsSync(ENTRIES_DIR)
    ? fs.readdirSync(ENTRIES_DIR).filter((n) => n.endsWith(".entries.ts")).sort()
    : [];
  for (const f of entryFiles) {
    const file = path.join(ENTRIES_DIR, f);
    const src = fs.readFileSync(file, "utf8");
    counts.files++;
    let entries = null;
    const eq = src.search(/=\s*\[/);
    if (eq >= 0) {
      try {
        entries = JSON.parse(src.slice(src.indexOf("[", eq)).replace(/;\s*$/, ""));
      } catch {
        entries = null;
      }
    }
    if (!Array.isArray(entries)) {
      // The file stopped being a plain JSON array. Scan its string literals so
      // matches are not lost, and say so — title fields are included this way.
      console.error(`gsc-report: ${file} is not a JSON array literal — scanned its string literals instead.`);
      const parts = [];
      for (const m of src.matchAll(/"((?:[^"\\\n]|\\.)*)"/g)) {
        let v;
        try { v = JSON.parse(`"${m[1]}"`); } catch { v = m[1]; }
        parts.push(normText(v));
      }
      unit(file, null, parts);
      continue;
    }
    for (const e of entries) {
      const parts = [];
      (function walk(v, key) {
        if (typeof v === "string") {
          if (!GEO_TITLE_KEYS.has(key)) parts.push(normText(v));
        } else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
        else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
      })(e, "");
      unit(file, e?.slug ?? null, parts);
      counts.entries++;
    }
  }

  const postFiles = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((n) => n.endsWith(".mdx")).sort()
    : [];
  for (const f of postFiles) {
    const file = path.join(POSTS_DIR, f);
    const src = fs.readFileSync(file, "utf8");
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    const parts = [normText(fm ? src.slice(fm[0].length) : src)];
    if (fm) {
      for (const m of fm[1].matchAll(/^\s*(?:-\s*)?(?:description|a):\s*(.+)$/gm)) parts.push(normText(m[1]));
    }
    unit(file, null, parts);
    counts.posts++;
  }
  return { units, counts };
}

function geoCitationSection(snap) {
  const byQuery = snap.byQuery ?? [];
  const byQP = snap.byQueryPage ?? [];
  const isCandidate = (q) => q.includes('"') || q.trim().split(/\s+/).length >= 5;
  const candidates = [...new Set([...byQuery, ...byQP].map((r) => r.keys[0]).filter(isCandidate))];

  console.log(`\n${"=".repeat(68)}\nQueries quoting our own sentences (GEO citation proxy)\n${"=".repeat(68)}`);
  if (!candidates.length) {
    console.log("  no query with ≥5 words or quotes in this export.");
    return;
  }

  const { units, counts } = buildSiteCorpus();
  const cache = new Map();
  const unitsContaining = (n) => {
    if (!cache.has(n)) cache.set(n, units.filter((u) => u.text.includes(` ${n} `)));
    return cache.get(n);
  };

  const hits = [];
  const skipped = [];
  for (const q of candidates) {
    const quoted = [...q.matchAll(/"([^"]+)"/g)].map((m) => normText(m[1]));
    let phrases = quoted.filter((n) => n.split(" ").length >= GEO_MIN_PHRASE_WORDS);
    const fromQuotes = phrases.length > 0;
    if (!fromQuotes) {
      const whole = normText(q);
      phrases = whole.split(" ").length >= 5 ? [whole] : [];
    }
    const matched = new Set();
    for (const n of phrases) for (const u of unitsContaining(n)) matched.add(u);
    if (!matched.size) continue;
    (GEO_CODEISH.test(q) ? skipped : hits).push({ q, quoted: fromQuotes, units: [...matched] });
  }

  const queryStats = new Map(byQuery.map((r) => [r.keys[0], r]));
  // Landing pages per query, merged by path (www and apex rows are one page).
  const landings = (q) => {
    const byPath = new Map();
    for (const r of byQP) {
      if (r.keys[0] !== q) continue;
      const p = pathOf(r.keys[1]);
      const cur = byPath.get(p) ?? { path: p, impressions: 0, posWeighted: 0 };
      cur.impressions += r.impressions;
      cur.posWeighted += (r.position || 0) * r.impressions;
      byPath.set(p, cur);
    }
    return [...byPath.values()]
      .map((v) => ({ ...v, position: v.impressions ? v.posWeighted / v.impressions : 0 }))
      .sort((a, b) => b.impressions - a.impressions);
  };
  const impOf = (h) => queryStats.get(h.q)?.impressions ?? landings(h.q).reduce((n, r) => n + r.impressions, 0);
  const whereText = (list) => {
    const byFile = new Map();
    for (const u of list) {
      const s = byFile.get(u.file) ?? new Set();
      if (u.label) s.add(u.label);
      byFile.set(u.file, s);
    }
    const out = [...byFile].map(([f, s]) => (s.size ? `${f} (${[...s].join(", ")})` : f));
    return out.length > 4 ? `${out.slice(0, 4).join(", ")} +${out.length - 4} more` : out.join(", ");
  };

  console.log(
    `  ${candidates.length} candidate queries (≥5 words or quoted) checked against ` +
      `${counts.entries} entries in ${counts.files} files + ${counts.posts} posts (prose fields only)`,
  );

  if (!hits.length) {
    console.log("  none this window.");
  } else {
    hits.sort((a, b) => impOf(b) - impOf(a));
    for (const h of hits) {
      const qs = queryStats.get(h.q);
      const total = qs ? ` · ${qs.impressions} imp · pos ${qs.position.toFixed(1)} overall` : "";
      console.log(`\n  ${h.q}\n      ${h.quoted ? "matched on the quoted phrase" : "matched on the whole query"}${total}`);
      const lp = landings(h.q);
      if (!lp.length) console.log("      landing: (not in byQueryPage — Google withheld the page row)");
      for (const r of lp) {
        console.log(
          `      landing: ${r.path.padEnd(44)} ${String(r.impressions).padStart(5)} imp  pos ${r.position.toFixed(1)}`,
        );
      }
      console.log(`      matched: ${whereText(h.units)}`);
    }
  }

  if (skipped.length) {
    console.log("\n  Skipped as vendor strings (domain/path/identifier tokens; they match our code samples, not our prose):");
    for (const h of skipped.sort((a, b) => impOf(b) - impOf(a))) {
      console.log(`    ${h.q.padEnd(60).slice(0, 60)} ${String(impOf(h)).padStart(4)} imp  → ${whereText(h.units)}`);
    }
  }
  console.log(
    "\n  A proxy, not telemetry: a match says someone searched a sentence this site published,\n" +
      "  not where they copied it from. Report it as a proxy (ops/GEO.md → Measurement).",
  );
}

if (apiSnap) geoCitationSection(apiSnap);

// ---- Tracked queries --------------------------------------------------------
// The brand and the 30 "fitness api" queries from the search-results study
// (ops/SERP-30-2026-10-12.md #10), read from each engine's own query report.
// Google withholds rare queries, so a dash there means "not disclosed", not
// "not shown"; the two engines are printed side by side and never combined.
const TRACKED_FILE = "ops/gsc/tracked-queries.txt";
if (fs.existsSync(TRACKED_FILE)) {
  const tracked = fs
    .readFileSync(TRACKED_FILE, "utf8")
    .split("\n")
    .map((l) => l.trim().toLowerCase())
    .filter((l) => l && !l.startsWith("#"));
  const cell = (engine, q) => {
    const r = engine.queries.get(q);
    if (!r || !r.impressions) return "—".padStart(14);
    return `${String(r.impressions).padStart(4)}i ${String(r.clicks).padStart(2)}c @${(r.posWeighted / r.impressions).toFixed(1).padStart(5)}`;
  };
  console.log(`\n${"=".repeat(68)}\nTracked queries (${TRACKED_FILE})\n${"=".repeat(68)}`);
  console.log(`  ${"query".padEnd(48)} ${"Google".padStart(14)} ${"Bing".padStart(14)}`);
  for (const q of tracked) {
    console.log(`  ${q.padEnd(48).slice(0, 48)} ${cell(engines.google, q)} ${cell(engines.bing, q)}`);
  }
}

// ---- Weekly health checks ---------------------------------------------------
// ops/NEXT-10-2026-11-04.md item 3. Four lists that each point at pages to
// open, not verdicts; the logic and thresholds live in
// scripts/lib/gsc-sections.mjs so they can be tested without a pull.
function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function loadSnapshot(date) {
  const file = path.join(SNAP_DIR, `${date}.json`);
  if (!fs.existsSync(file)) {
    const have = fs.existsSync(SNAP_DIR) ? fs.readdirSync(SNAP_DIR).map((f) => f.replace(/\.json$/, "")).sort() : [];
    console.error(`gsc-report: no snapshot ${file}. Have: ${have.join(", ") || "none"}`);
    process.exit(1);
  }
  return { date, ...JSON.parse(fs.readFileSync(file, "utf8")) };
}

function healthChecks() {
  const snapDates = fs.existsSync(SNAP_DIR)
    ? fs.readdirSync(SNAP_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map((f) => f.slice(0, 10)).sort()
    : [];
  const sameRange = (a, b) => a?.start && a.start === b?.start && a.end === b?.end;

  // Current: an explicit snapshot, or the one matching latest.json, or
  // latest.json's own page rows.
  let current = null;
  if (argValue("--current")) current = loadSnapshot(argValue("--current"));
  else {
    const match = [...snapDates].reverse().map(loadSnapshot).find((s) => sameRange(s.range, apiSnap?.range));
    if (match) current = match;
    else if (apiSnap?.byPage?.length) current = { date: "latest.json", range: apiSnap.range, engines: { google: apiSnap.byPage } };
  }
  if (!current?.engines?.google?.length) return;

  // Previous: explicit, or the newest earlier snapshot with a different window.
  let previous = null;
  if (argValue("--previous")) previous = loadSnapshot(argValue("--previous"));
  else {
    const older = snapDates.filter((d) => current.date === "latest.json" || d < current.date).reverse();
    previous = older.map(loadSnapshot).find((s) => !sameRange(s.range, current.range)) ?? null;
  }

  const g = mergeByPath(current.engines.google);
  const b = mergeByPath(current.engines.bing ?? []);
  const rng = (r) => (r ? `${r.start} → ${r.end}` : "?");
  const pct = (x, d = 1) => `${(x * 100).toFixed(d)}%`;
  const col = (s, n) => String(s).padEnd(n).slice(0, n);
  const LIMIT = 15;

  console.log(`\n${"=".repeat(68)}\nWeekly health checks — current ${current.date} (${rng(current.range)})\n${"=".repeat(68)}`);

  // (a) CTR anomaly.
  console.log(
    `\n  (a) CTR anomalies: Google pages at position ≤10 with ≥50 impressions earning under half\n` +
      `  the curve's CTR for their rounded position. Curve, positions 1–10 (%): ` +
      `${CTR_CURVE.map((x) => Number((x * 100).toFixed(1))).join(", ")}\n` +
      `  — a rounded composite of published click-curve studies. A heuristic for ordering pages,\n` +
      `  not a target: SERP features, brand and intent move real CTR far from any curve.`,
  );
  const anomalies = ctrAnomalies(g);
  if (!anomalies.length) console.log("    none.");
  else {
    console.log(`    ${col("page", 52)} ${"imp".padStart(6)} ${"clk".padStart(4)} ${"pos".padStart(5)} ${"ctr".padStart(6)} ${"exp".padStart(6)} ${"short".padStart(6)}`);
    for (const r of anomalies.slice(0, LIMIT)) {
      console.log(
        `    ${col(r.path, 52)} ${String(r.impressions).padStart(6)} ${String(r.clicks).padStart(4)} ${r.position.toFixed(1).padStart(5)} ` +
          `${pct(r.ctr).padStart(6)} ${pct(r.expected).padStart(6)} ${r.shortfall.toFixed(1).padStart(6)}`,
      );
    }
    if (anomalies.length > LIMIT) console.log(`    …and ${anomalies.length - LIMIT} more (${anomalies.length} in all)`);
  }

  // (b) Cannibalisation, from the query→page join. Only latest.json carries
  // it, so it describes latest.json's window, which may not be current's.
  console.log(`\n  (b) Cannibalisation: queries with ≥10 impressions split across 2+ of our pages (query→page join).`);
  const joins = [["Google", apiSnap?.byQueryPage, apiSnap?.range]];
  const BING_JSON_FILE = "data/gsc/bing-latest.json";
  if (fs.existsSync(BING_JSON_FILE)) {
    const bj = JSON.parse(fs.readFileSync(BING_JSON_FILE, "utf8"));
    joins.push(["Bing", bj.byQueryPage, bj.range]);
  }
  for (const [label, rows, range] of joins) {
    if (!Array.isArray(rows)) {
      console.log(`    ${label}: no query→page rows (Bing writes null when its lookups failed).`);
      continue;
    }
    const note = sameRange(range, current.range) ? "" : `  NOTE: window ${rng(range)}, not the current snapshot's`;
    const split = cannibalisation(rows);
    console.log(`    ${label} (${rng(range)}): ${split.length} queries${note}`);
    for (const c of split.slice(0, label === "Google" ? LIMIT : 5)) {
      const pages = c.pages
        .slice(0, 3)
        .map((p) => `${p.path} ${p.impressions}i @${p.position.toFixed(1)}`)
        .join(" | ");
      const more = c.pages.length > 3 ? ` +${c.pages.length - 3}` : "";
      console.log(`      ${col(c.query, 40)} ${String(c.impressions).padStart(5)}i ${String(c.pages.length).padStart(2)}p top ${pct(c.topShare, 0).padStart(4)}  ${pages}${more}`);
    }
  }
  if (apiSnap?.byQueryPage) {
    console.log("    Google withholds rare queries from the join, so these are a floor; a split is a lead to check, not proof two pages compete.");
  }

  // (c) Decay against an earlier snapshot.
  console.log(`\n  (c) Decay: impressions down ≥30% at a stable position (±1.5), ≥20 impressions before.`);
  if (!previous) console.log("    no earlier snapshot with a different window — nothing to compare yet.");
  else {
    const shared = overlapDays(previous.range, current.range);
    console.log(`    against ${previous.date} (${rng(previous.range)})${shared ? `; the windows share ${shared} days, which damps every change` : ""}`);
    for (const [label, now, before] of [
      ["Google", current.engines.google, previous.engines?.google],
      ["Bing", current.engines.bing, previous.engines?.bing],
    ]) {
      if (!now?.length || !before?.length) continue;
      const { decayed, vanished } = decay(now, before);
      console.log(`    ${label}: ${decayed.length} decayed, ${vanished.length} with no impressions now (position unknown, so not called decay)`);
      for (const d of decayed.slice(0, label === "Google" ? LIMIT : 5)) {
        console.log(
          `      ${col(d.path, 52)} ${String(d.before.impressions).padStart(5)} → ${String(d.after.impressions).padEnd(5)} ` +
            `${pct(d.change, 0).padStart(5)}  pos ${d.before.position.toFixed(1)} → ${d.after.position.toFixed(1)}`,
        );
      }
    }
  }

  // (d) Index lag: sitemap URLs with no impressions.
  // /sitemap.xml is an index; the rows are in the children it lists.
  const smArg = argValue("--sitemap");
  const smXml = smArg ? (fs.existsSync(smArg) ? fs.readFileSync(smArg, "utf8") : null) : (() => {
    const built = readBuiltSitemap(".next/server/app");
    return built.index === null ? null : built.xml;
  })();
  console.log(`\n  (d) Index lag: sitemap URLs with no Google impressions in ${rng(current.range)}.`);
  if (smXml === null) {
    console.log(`    no sitemap at ${smArg ?? ".next/server/app/sitemap.xml.body"} — run npm run build first, or pass --sitemap <file>.`);
  } else {
    const sitemap = parseSitemap(smXml);
    const published = fs.existsSync("src/data/published.ts") ? parsePublished(fs.readFileSync("src/data/published.ts", "utf8")) : new Map();
    const seenG = new Set(g.filter((r) => r.impressions > 0).map((r) => r.path));
    const seenB = new Set(b.filter((r) => r.impressions > 0).map((r) => r.path));
    const lag = indexLag(sitemap, seenG, published, current.range);
    const none = lag.lagging.length + lag.partial.length + lag.tooNew.length + lag.unknown.length;
    console.log(
      `    ${sitemap.length} sitemap URLs, ${none} without Google impressions: ${lag.lagging.length} published before the window, ` +
        `${lag.partial.length} inside it, ${lag.tooNew.length} after it, ${lag.unknown.length} with no date in src/data/published.ts`,
    );
    if (lag.lagging.length) {
      console.log(`    Oldest first (published before the window opened, so the whole window was available):`);
      for (const r of lag.lagging.slice(0, LIMIT)) {
        console.log(`      ${col(r.path, 56)} published ${r.published} (${String(r.ageDays).padStart(3)} days at window end)${seenB.has(r.path) ? "  · has Bing impressions" : ""}`);
      }
      if (lag.lagging.length > LIMIT) console.log(`      …and ${lag.lagging.length - LIMIT} more`);
    }
    if (lag.unknown.length) {
      const shown = lag.unknown.slice(0, 8).map((r) => r.path).join(", ");
      console.log(`    No first-published date: ${shown}${lag.unknown.length > 8 ? ` +${lag.unknown.length - 8} more` : ""}`);
    }
    console.log("    No impressions is not proof a page is unindexed: it may be indexed and never shown. Check URL Inspection before acting.");
  }
}

healthChecks();

// ---- --snapshot: build the time series ------------------------------------
if (process.argv.includes("--snapshot")) {
  fs.mkdirSync(SNAP_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const out = path.join(SNAP_DIR, `${stamp}.json`);
  const payload = {
    takenAt: new Date().toISOString(),
    range: engines.google.range,
    engines: Object.fromEntries(
      Object.entries(report).map(([name, rows]) => [
        name,
        rows.map((r) => ({ path: r.path, clicks: r.clicks, impressions: r.impressions, position: Number(r.position.toFixed(2)) })),
      ]),
    ),
  };
  fs.writeFileSync(out, JSON.stringify(payload, null, 2));
  console.log(`\nSnapshot written: ${out}`);
  console.log(`Compare later with: npm run gsc -- --compare ${stamp}`);
}

// ---- --compare: did the work move anything? --------------------------------
const cmpIdx = process.argv.indexOf("--compare");
if (cmpIdx >= 0) {
  const which = process.argv[cmpIdx + 1];
  const file = path.join(SNAP_DIR, `${which}.json`);
  if (!which || !fs.existsSync(file)) {
    const have = fs.existsSync(SNAP_DIR) ? fs.readdirSync(SNAP_DIR).map((f) => f.replace(/\.json$/, "")) : [];
    console.error(
      `\n--compare needs a snapshot date. Have: ${have.length ? have.join(", ") : "none yet — run with --snapshot first"}`,
    );
    process.exit(1);
  }
  const before = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`\n${"=".repeat(68)}\nChange since ${which}\n${"=".repeat(68)}`);
  for (const [name, rows] of Object.entries(report)) {
    const prev = new Map((before.engines?.[name] ?? []).map((r) => [r.path, r]));
    if (prev.size === 0) continue;
    const moves = rows
      .map((r) => {
        const p = prev.get(r.path);
        if (!p) return { ...r, isNew: true, dImp: r.impressions, dClk: r.clicks, dPos: 0 };
        return { ...r, isNew: false, dImp: r.impressions - p.impressions, dClk: r.clicks - p.clicks, dPos: r.position - p.position };
      })
      .sort((a, b) => Math.abs(b.dImp) - Math.abs(a.dImp));

    const tot = moves.reduce((a, m) => ({ imp: a.imp + m.dImp, clk: a.clk + m.dClk }), { imp: 0, clk: 0 });
    console.log(`\n  ${name}: impressions ${tot.imp >= 0 ? "+" : ""}${tot.imp}, clicks ${tot.clk >= 0 ? "+" : ""}${tot.clk}`);
    console.log(`  ${"page".padEnd(50)} ${"Δimp".padStart(7)} ${"Δclk".padStart(5)} ${"Δpos".padStart(7)}`);
    // True regressions: CTR fell against its own past, not against a curve.
    const regressed = moves.filter((m) => {
      const p = prev.get(m.path);
      if (!p || p.impressions < 20 || m.impressions < 20) return false;
      const was = p.clicks / p.impressions;
      return was > 0 && m.ctr < was * 0.5;
    });
    if (regressed.length) {
      console.log(`\n  CTR REGRESSIONS — more than halved against ${which} (≥20 impressions both windows):`);
      for (const m of regressed.slice(0, 12)) {
        const p = prev.get(m.path);
        console.log(
          `  ${m.path.padEnd(50).slice(0, 50)} ${((p.clicks / p.impressions) * 100).toFixed(1)}% → ${(m.ctr * 100).toFixed(1)}%  (pos ${p.position.toFixed(1)} → ${m.position.toFixed(1)})`,
        );
      }
    }

    for (const m of moves.slice(0, 20)) {
      const tag = m.isNew ? " (new)" : "";
      console.log(
        `  ${m.path.padEnd(50).slice(0, 50)} ${String(m.dImp >= 0 ? "+" + m.dImp : m.dImp).padStart(7)} ` +
          `${String(m.dClk >= 0 ? "+" + m.dClk : m.dClk).padStart(5)} ` +
          `${(m.dPos >= 0 ? "+" : "") + m.dPos.toFixed(1)}`.padStart(8) + tag,
      );
    }
  }

  const cohort = loadRetitled();
  if (cohort) printCohortSplit(before, which, cohort);
}

// ---- --compare, continued: retitled pages against an untouched control -----
//
// A recovery (the post-outage climb, a core update) lifts every page at once,
// so "the retitled pages gained impressions" proves nothing on its own. The
// pages nobody touched are the control: whatever they did is the tide, and
// only the retitled group's movement *beyond* it is attributable to the
// titles. ops/gsc/retitled.txt lists the treated paths, one per line; a line
// ending in `*` is a prefix (`/apis/*` = every page under /apis/, not the /apis
// hub itself); `#` starts a comment.
function normPath(p) {
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

function loadRetitled() {
  if (!fs.existsSync(RETITLED_FILE)) return null;
  const exact = new Set();
  const prefixes = [];
  for (const raw of fs.readFileSync(RETITLED_FILE, "utf8").split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    if (line.endsWith("*")) prefixes.push(line.slice(0, -1));
    else exact.add(normPath(line));
  }
  const has = (p) => {
    const n = normPath(p);
    return exact.has(n) || prefixes.some((pre) => n.startsWith(pre) && n.length > pre.length);
  };
  return { exact, prefixes, has };
}

function printCohortSplit(before, which, cohort) {
  const signed = (n, d = 0, unit = "") => {
    const s = n.toFixed(d);
    return `${s.startsWith("-") && Number(s) !== 0 ? s : `+${s.replace(/^-/, "")}`}${unit}`;
  };
  const pct = (a, b) => (a ? signed(((b - a) / a) * 100, 1, "%") : b ? "new" : "—");
  const days = (r) => (r?.start && r?.end ? Math.round((Date.parse(r.end) - Date.parse(r.start)) / 86400000) + 1 : null);

  console.log(
    `\n  Retitled vs untouched (control) — ${RETITLED_FILE}: ${cohort.exact.size} paths + ${cohort.prefixes.length} pattern(s)`,
  );
  const rb = before.range, rn = engines.google.range;
  if (rb?.start && rn?.start && rb.start === rn.start && rb.end === rn.end) {
    console.log(`  NOTE: ${which} and latest.json cover the same window (${rn.start} → ${rn.end}); nothing below measures change until a fresh export lands.`);
  } else if (days(rb) && days(rn) && days(rb) !== days(rn)) {
    console.log(
      `  WARNING: windows differ (${days(rb)} days in ${which} vs ${days(rn)} now) — raw impression and click changes are not like for like; read CTR and position.`,
    );
  }

  const seen = new Set();
  for (const [name, rows] of Object.entries(report)) {
    const prevRows = before.engines?.[name] ?? [];
    if (!prevRows.length) continue;
    const now = new Map(rows.map((r) => [r.path, r]));
    const prev = new Map(prevRows.map((r) => [r.path, r]));
    const blank = () => ({ pages: 0, impA: 0, clkA: 0, posA: 0, impB: 0, clkB: 0, posB: 0 });
    const groups = { retitled: blank(), "untouched (control)": blank() };
    // Union of both snapshots: a page missing on one side counts as 0 there,
    // so a page that vanished still drags its group down.
    for (const p of new Set([...now.keys(), ...prev.keys()])) {
      const treated = cohort.has(p);
      if (treated) seen.add(normPath(p));
      const g = groups[treated ? "retitled" : "untouched (control)"];
      const a = prev.get(p), b = now.get(p);
      g.pages++;
      if (a) { g.impA += a.impressions; g.clkA += a.clicks; g.posA += (a.position || 0) * a.impressions; }
      if (b) { g.impB += b.impressions; g.clkB += b.clicks; g.posB += (b.position || 0) * b.impressions; }
    }

    console.log(
      `\n  ${name.padEnd(20)} ${"pages".padStart(5)} ${"imp before→now".padStart(16)} ${"Δimp".padStart(8)} ` +
        `${"clk before→now".padStart(15)} ${"CTR before→now".padStart(16)} ${"ΔCTR".padStart(9)} ${"pos before→now".padStart(15)}`,
    );
    const stat = {};
    for (const [label, g] of Object.entries(groups)) {
      const ctrA = g.impA ? (g.clkA / g.impA) * 100 : 0;
      const ctrB = g.impB ? (g.clkB / g.impB) * 100 : 0;
      const posA = g.impA ? g.posA / g.impA : 0;
      const posB = g.impB ? g.posB / g.impB : 0;
      stat[label] = { g, ctrA, ctrB, posA, posB };
      console.log(
        `  ${label.padEnd(20)} ${String(g.pages).padStart(5)} ${`${g.impA} → ${g.impB}`.padStart(16)} ${pct(g.impA, g.impB).padStart(8)} ` +
          `${`${g.clkA} → ${g.clkB}`.padStart(15)} ${`${ctrA.toFixed(2)}% → ${ctrB.toFixed(2)}%`.padStart(16)} ` +
          `${signed(ctrB - ctrA, 2, "pp").padStart(9)} ${`${posA.toFixed(1)} → ${posB.toFixed(1)}`.padStart(15)}`,
      );
    }
    const t = stat.retitled, c = stat["untouched (control)"];
    if (t.g.impA && c.g.impA) {
      const growth = (s) => ((s.g.impB - s.g.impA) / s.g.impA) * 100;
      console.log(
        `  retitled minus control: impressions ${signed(growth(t) - growth(c), 1, " pts")}, ` +
          `CTR ${signed(t.ctrB - t.ctrA - (c.ctrB - c.ctrA), 2, "pp")}, ` +
          `position ${signed(t.posB - t.posA - (c.posB - c.posA), 1)} (negative = moved up)`,
      );
      console.log(
        `  Crude difference-in-differences: no significance test, and ${t.g.pages} treated pages is a small sample.`,
      );
    } else {
      console.log("  (one group had no impressions in the earlier snapshot — no difference computed)");
    }
  }

  const missing = [...cohort.exact].filter((p) => !seen.has(p));
  const emptyPatterns = cohort.prefixes.filter((pre) => ![...seen].some((p) => p.startsWith(pre)));
  if (missing.length || emptyPatterns.length) {
    console.log(
      `  retitled.txt lines with no page in either snapshot (typo, or no impressions): ` +
        [...missing, ...emptyPatterns.map((p) => `${p}*`)].join(", "),
    );
  }
}

// ---- --cohorts: title length against performance ---------------------------
if (process.argv.includes("--cohorts")) {
  const ROOT = ".next/server/app";
  const titleOf = new Map();
  (function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".html")) {
        const m = fs.readFileSync(p, "utf8").match(/<title>([^<]*)<\/title>/);
        if (!m) continue;
        let r = p.slice(ROOT.length).replace(/\.html$/, "");
        if (r.endsWith("/index")) r = r.slice(0, -6);
        titleOf.set(r || "/", m[1]);
      }
    }
  })(ROOT);
  if (titleOf.size === 0) {
    console.error("\n--cohorts needs a build (.next missing). Run npm run build first.");
    process.exit(1);
  }
  for (const [name, rows] of Object.entries(report)) {
    const buckets = { "under 40": [], "40-49": [], "50-60": [], "over 60": [] };
    for (const r of rows) {
      const t = titleOf.get(r.path);
      if (!t) continue;
      const b = t.length < 40 ? "under 40" : t.length < 50 ? "40-49" : t.length <= 60 ? "50-60" : "over 60";
      buckets[b].push(r);
    }
    console.log(`\nTitle-length cohorts — ${name} (today's titles vs the export window):`);
    for (const [bname, list] of Object.entries(buckets)) {
      const imp = list.reduce((n, r) => n + r.impressions, 0);
      const cl = list.reduce((n, r) => n + r.clicks, 0);
      console.log(
        `  ${bname.padEnd(9)} ${String(list.length).padStart(4)} pages  ${String(imp).padStart(8)} impressions  CTR ${(imp ? (cl / imp) * 100 : 0).toFixed(2)}%`,
      );
    }
  }
  console.log(
    "\nNOTE: cohorts join TODAY'S titles to the export window's traffic. After a title\n" +
      "pass, the window has to be re-exported before this means anything.",
  );
}
