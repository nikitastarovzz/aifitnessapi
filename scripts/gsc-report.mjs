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
 *   3. --compare   two snapshots, page by page: what moved since when.
 *   4. --snapshot  archive today's read into data/gsc/snapshots/ so there is
 *      a time series instead of a single file that each export overwrites.
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
 * So the benchmark is now position-aware. The curve below is a public
 * composite and is approximate by nature; it is used only to *rank* pages
 * against each other, never reported as a target. Two pages at the same
 * position are still compared like for like, which is all the ranking needs.
 */
import fs from "node:fs";
import path from "node:path";

const CSV_DIR = "ops/gsc";
const JSON_SNAPSHOT = "data/gsc/latest.json";
const SNAP_DIR = "data/gsc/snapshots";

/**
 * Position → expected CTR. A public composite of several published
 * click-curve studies, rounded; treat as an ordering device, not a forecast.
 * Deliberately conservative past page one, where the curve flattens and the
 * differences stop being meaningful.
 */
const CTR_CURVE = [0.28, 0.15, 0.11, 0.08, 0.06, 0.05, 0.04, 0.035, 0.03, 0.025];
function expectedCtr(position) {
  if (!Number.isFinite(position) || position < 1) return 0.28;
  if (position <= 10) return CTR_CURVE[Math.max(0, Math.round(position) - 1)];
  if (position <= 20) return 0.012;
  if (position <= 30) return 0.006;
  return 0.003;
}

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
if (fs.existsSync(JSON_SNAPSHOT)) {
  const snap = JSON.parse(fs.readFileSync(JSON_SNAPSHOT, "utf8"));
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

// ---- source 2: manual CSV exports ------------------------------------------
const csvFiles = fs.existsSync(CSV_DIR)
  ? fs.readdirSync(CSV_DIR).filter((f) => f.endsWith(".csv")).sort()
  : [];

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
    for (const m of moves.slice(0, 20)) {
      const tag = m.isNew ? " (new)" : "";
      console.log(
        `  ${m.path.padEnd(50).slice(0, 50)} ${String(m.dImp >= 0 ? "+" + m.dImp : m.dImp).padStart(7)} ` +
          `${String(m.dClk >= 0 ? "+" + m.dClk : m.dClk).padStart(5)} ` +
          `${(m.dPos >= 0 ? "+" : "") + m.dPos.toFixed(1)}`.padStart(8) + tag,
      );
    }
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
