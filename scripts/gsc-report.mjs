/**
 * Search performance report over exported CSVs in ops/gsc/.
 *
 * Two jobs:
 *  1. Opportunity ranking — pages ordered by impressions × CTR gap, i.e.
 *     where the next click is cheapest to earn.
 *  2. Title-length cohorts (--cohorts) — joins each URL against the built
 *     HTML's <title> and buckets by length, so the title-width work can be
 *     judged against a baseline instead of vibes.
 *
 * It reads only what the user exported. No API, no invented numbers; with an
 * empty directory it explains itself and exits.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = "ops/gsc";
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".csv")) : [];
if (files.length === 0) {
  console.log("gsc-report: no CSVs in ops/gsc/ yet. See ops/gsc/README.md for what to export.");
  process.exit(0);
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

const pages = new Map(); // path -> {clicks, impressions}
for (const f of files) {
  const rows = parseCsv(fs.readFileSync(path.join(DIR, f), "utf8"));
  const head = rows[0].map((h) => h.toLowerCase());
  const iUrl = head.findIndex((h) => /page|url/.test(h));
  const iClicks = head.findIndex((h) => /clicks/.test(h));
  const iImp = head.findIndex((h) => /impressions/.test(h));
  if (iUrl < 0 || iClicks < 0 || iImp < 0) {
    console.error(`gsc-report: ${f} headers not recognised (${rows[0].join(", ")}) — skipped.`);
    continue;
  }
  for (const r of rows.slice(1)) {
    if (!r[iUrl]) continue;
    let p;
    try { p = new URL(r[iUrl]).pathname; } catch { p = r[iUrl]; }
    const cur = pages.get(p) ?? { clicks: 0, impressions: 0 };
    cur.clicks += Number(String(r[iClicks]).replace(/[,.]/g, "")) || 0;
    cur.impressions += Number(String(r[iImp]).replace(/[,.]/g, "")) || 0;
    pages.set(p, cur);
  }
  console.log(`read ${f}: ${rows.length - 1} rows`);
}

const rows = [...pages.entries()].map(([p, v]) => ({
  path: p,
  ...v,
  ctr: v.impressions ? v.clicks / v.impressions : 0,
}));
const totImp = rows.reduce((n, r) => n + r.impressions, 0);
const totClicks = rows.reduce((n, r) => n + r.clicks, 0);
const siteCtr = totImp ? totClicks / totImp : 0;
console.log(`\n${rows.length} pages, ${totImp} impressions, ${totClicks} clicks, site CTR ${(siteCtr * 100).toFixed(2)}%`);

if (process.argv.includes("--cohorts")) {
  // Join against built titles. Requires a build.
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
    console.error("--cohorts needs a build (.next missing). Run npm run build first.");
    process.exit(1);
  }
  const buckets = { "under 40": [], "40-49": [], "50-60": [], "over 60": [] };
  for (const r of rows) {
    const t = titleOf.get(r.path);
    if (!t) continue;
    const b = t.length < 40 ? "under 40" : t.length < 50 ? "40-49" : t.length <= 60 ? "50-60" : "over 60";
    buckets[b].push(r);
  }
  console.log("\nTitle-length cohorts (current titles vs exported performance):");
  for (const [name, list] of Object.entries(buckets)) {
    const imp = list.reduce((n, r) => n + r.impressions, 0);
    const cl = list.reduce((n, r) => n + r.clicks, 0);
    console.log(`  ${name.padEnd(9)} ${String(list.length).padStart(4)} pages  ${String(imp).padStart(9)} impressions  CTR ${(imp ? (cl / imp) * 100 : 0).toFixed(2)}%`);
  }
  console.log("\nNOTE: cohorts reflect TODAY'S titles against the export window's traffic — after a title pass, re-export a fresh window before drawing conclusions.");
}

console.log("\nTop opportunities (impressions × CTR gap vs site CTR):");
const opp = rows
  .filter((r) => r.impressions > 0)
  .map((r) => ({ ...r, score: r.impressions * Math.max(0, siteCtr - r.ctr) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 30);
for (const r of opp) {
  console.log(
    `  ${r.path.padEnd(56).slice(0, 56)} imp ${String(r.impressions).padStart(7)}  ctr ${(r.ctr * 100).toFixed(2).padStart(5)}%  score ${r.score.toFixed(1)}`,
  );
}
