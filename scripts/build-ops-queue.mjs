#!/usr/bin/env node
/**
 * The weekly ops queue: ops/QUEUE.md, the 20 page actions most worth doing
 * next, each with the numbers that put it there. ops/MORE-30-2026-11-05.md
 * item 10.
 *
 * Four lists already exist and each answers a different question; read
 * separately they compete for attention and the busiest list wins. This
 * script puts them on one scale, the Google clicks at stake per 28-day
 * window, and ranks the pages by the sum:
 *
 *   CTR anomaly   page one, under half the curve's CTR (gsc-report (a)).
 *                 At stake: the clicks the curve expects minus the clicks
 *                 it got. Action: rewrite the title and description.
 *   Decay         impressions down 30%+ at a stable position (gsc-report
 *                 (c)). At stake: the lost impressions at the curve's CTR
 *                 for the page's position. Action: check demand and snippet.
 *   Stale         `updated` stamp 90+ days old (npm run stale). At stake:
 *                 every click the page's impressions are worth at the
 *                 curve, since a wrong page loses all of them. Action:
 *                 re-verify against the sources, then move the stamp.
 *   Index lag     in the sitemap, published before the window, no Google
 *                 impression in it (gsc-report (d)). Nothing is measured,
 *                 so it is scored one click, two for a page past 90 days:
 *                 enough to surface the oldest, never enough to outrank a
 *                 page with measured traffic. Action: URL Inspection.
 *
 * The curve is the one in scripts/lib/gsc-sections.mjs, a heuristic for
 * ordering pages, not a forecast; QUEUE.md says so.
 *
 * Held pages. A page retitled on or after the current window's first day
 * (ops/gsc/retitled.txt) has not had a full window under its new title, so
 * its CTR anomaly and decay are not actionable yet: they are listed as held,
 * with the date, and kept out of the ranking. Re-verification is not a
 * retitle, so a held page's stale stamp still ranks.
 *
 * Pages that ask not to be indexed are left out of every list except stale
 * (src/data/noindex.ts, src/data/indexDemand.ts, and static routes whose
 * page.tsx sets robots index: false).
 *
 * Usage:
 *   node scripts/build-ops-queue.mjs                       # write ops/QUEUE.md
 *   node scripts/build-ops-queue.mjs --current 2026-11-03 --previous 2026-10-27
 *   node scripts/build-ops-queue.mjs --sitemap <file>      # default: the build's
 *   node scripts/build-ops-queue.mjs --sitemap-url https://aifitnessapi.com/sitemap.xml
 *   node scripts/build-ops-queue.mjs --stdout              # print, write nothing
 *
 * Reads only files in the repo (plus the sitemap URL when given). Writes
 * ops/QUEUE.md. Exits non-zero only when there is no Google snapshot to read.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  CTR_CURVE,
  expectedCtr,
  mergeByPath,
  ctrAnomalies,
  decay,
  parseSitemap,
  parsePublished,
  indexLag,
  normalisePath,
} from "./lib/gsc-sections.mjs";

const SNAP_DIR = "data/gsc/snapshots";
const LATEST = "data/gsc/latest.json";
const RETITLED = "ops/gsc/retitled.txt";
const OUT = "ops/QUEUE.md";
const TOP = 20;

const argv = process.argv.slice(2);
const arg = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};

// ── Snapshots: the same choice gsc-report's health checks make ───────────
const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const snapDates = fs.existsSync(SNAP_DIR)
  ? fs.readdirSync(SNAP_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map((f) => f.slice(0, 10)).sort()
  : [];
const loadSnap = (date) => {
  const f = path.join(SNAP_DIR, `${date}.json`);
  if (!fs.existsSync(f)) {
    console.error(`build-ops-queue: no snapshot ${f}. Have: ${snapDates.join(", ") || "none"}`);
    process.exit(1);
  }
  return { date, ...readJson(f) };
};
const latest = fs.existsSync(LATEST) ? readJson(LATEST) : null;
const sameRange = (a, b) => a?.start && a.start === b?.start && a.end === b?.end;

let current = arg("--current") ? loadSnap(arg("--current")) : null;
if (!current) current = [...snapDates].reverse().map(loadSnap).find((s) => sameRange(s.range, latest?.range)) ?? null;
if (!current && latest?.byPage?.length) current = { date: "latest.json", range: latest.range, engines: { google: latest.byPage } };
if (!current?.engines?.google?.length) {
  console.error("build-ops-queue: no Google page rows in data/gsc (run scripts/search-pull.mjs first).");
  process.exit(1);
}
let previous = arg("--previous") ? loadSnap(arg("--previous")) : null;
if (!previous) {
  previous =
    snapDates
      .filter((d) => current.date === "latest.json" || d < current.date)
      .reverse()
      .map(loadSnap)
      .find((s) => !sameRange(s.range, current.range)) ?? null;
}

const google = mergeByPath(current.engines.google);
const byPath = new Map(google.map((r) => [r.path, r]));

// Top queries per page, from the query→page join (latest.json only carries it).
const queriesOf = new Map();
if (latest?.byQueryPage && sameRange(latest.range, current.range)) {
  for (const r of latest.byQueryPage) {
    const p = normalisePath(r.keys?.[1]);
    const list = queriesOf.get(p) ?? [];
    list.push({ q: r.keys[0], impressions: r.impressions, position: r.position });
    queriesOf.set(p, list);
  }
  for (const list of queriesOf.values()) list.sort((a, b) => b.impressions - a.impressions);
}

// ── Held pages: ops/gsc/retitled.txt, with the date of each block ─────────
const retitledOn = new Map(); // path or prefix* → newest block date
if (fs.existsSync(RETITLED)) {
  let date = null;
  for (const line of fs.readFileSync(RETITLED, "utf8").split("\n")) {
    const head = /^#\s*(\d{4}-\d{2}-\d{2})\b/.exec(line);
    if (head) {
      date = head[1];
      continue;
    }
    // A page retitled again is sometimes noted in a comment rather than
    // listed twice: "# /pricing/strava-api-pricing was retitled again" (the
    // block's date) or "# /x was last retitled 2026-10-18" (that date).
    const again = /^#\s*(\/\S+) was (?:last )?retitled(?: again)?(?: (\d{4}-\d{2}-\d{2}))?/.exec(line);
    if (again && (again[2] || date)) {
      const d = again[2] ?? date;
      if (!retitledOn.has(again[1]) || retitledOn.get(again[1]) < d) retitledOn.set(again[1], d);
      continue;
    }
    const p = line.trim();
    if (!p || p.startsWith("#") || !date) continue;
    if (!retitledOn.has(p) || retitledOn.get(p) < date) retitledOn.set(p, date);
  }
}
const lastRetitle = (p) => {
  let best = null;
  for (const [k, d] of retitledOn) {
    const hit = k.endsWith("*") ? p.startsWith(k.slice(0, -1)) : k === p;
    if (hit && (!best || d > best)) best = d;
  }
  return best;
};
const heldSince = (p) => {
  const d = lastRetitle(p);
  return d && d >= current.range.start ? d : null;
};

// ── Noindex pages ──────────────────────────────────────────────────────────
const noindex = new Set();
{
  const src = fs.existsSync("src/data/noindex.ts") ? fs.readFileSync("src/data/noindex.ts", "utf8") : "";
  const block = /export const NOINDEX_PAGES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(src)?.[1] ?? "";
  for (const m of block.matchAll(/"(\/[^"]+)"/g)) noindex.add(m[1]);
  const dem = fs.existsSync("src/data/indexDemand.ts") ? fs.readFileSync("src/data/indexDemand.ts", "utf8") : "";
  for (const m of dem.matchAll(/"path":\s*"([^"]+)"[^}]*?"decision":\s*"noindex"/g)) noindex.add(m[1]);
  (function walk(dir, route) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name.startsWith("[") || e.name.startsWith("_") || e.name.startsWith("(")) continue;
      const sub = path.join(dir, e.name);
      const r = `${route}/${e.name}`;
      const page = path.join(sub, "page.tsx");
      if (fs.existsSync(page) && /robots:\s*\{\s*index:\s*false/.test(fs.readFileSync(page, "utf8"))) noindex.add(r);
      walk(sub, r);
    }
  })("src/app", "");
}

// ── Stale stamps: npm run stale, as JSON ─────────────────────────────────
let stale = [];
let staleNote = "";
try {
  const out = execFileSync(process.execPath, ["scripts/stale-report.mjs", "--json", "--over", "90"], { encoding: "utf8" });
  const j = JSON.parse(out);
  stale = j.entries.filter((e) => e.due);
  staleNote = `npm run stale on ${j.generatedOn}: ${stale.length} of ${j.total} dated pages at 90 days or more`;
} catch (e) {
  staleNote = `npm run stale failed (${e.message.split("\n")[0]}); stale stamps are missing from this queue`;
}

// ── Sitemap for index lag ──────────────────────────────────────────────────
async function sitemapPaths() {
  const url = arg("--sitemap-url");
  if (url) {
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
    return { paths: locs.map(normalisePath), from: url };
  }
  const file = arg("--sitemap") ?? ".next/server/app/sitemap.xml.body";
  if (!fs.existsSync(file)) return { paths: null, from: file };
  return { paths: parseSitemap(fs.readFileSync(file, "utf8")), from: file };
}

// ── Collect and score ────────────────────────────────────────────────────
const pct = (x, d = 1) => `${(x * 100).toFixed(d)}%`;
const actions = new Map(); // path → { path, score, kinds: [], evidence: [] }
const held = [];
const add = (p, kind, score, evidence, todo) => {
  const a = actions.get(p) ?? { path: p, score: 0, kinds: [], evidence: [], todo: [] };
  a.score += score;
  a.kinds.push(kind);
  a.evidence.push(evidence);
  a.todo.push(todo);
  actions.set(p, a);
};
const topQueries = (p, n = 3) =>
  (queriesOf.get(p) ?? [])
    .slice(0, n)
    .map((q) => `"${q.q}" ${q.impressions}i @${q.position.toFixed(1)}`)
    .join(", ");

const anomalies = ctrAnomalies(google).filter((r) => !noindex.has(r.path));
for (const r of anomalies) {
  const ev = `CTR ${pct(r.ctr)} vs ${pct(r.expected)} expected at position ${r.position.toFixed(1)}; ${r.impressions} impressions, ${r.clicks} clicks`;
  const h = heldSince(r.path);
  if (h) {
    held.push({ path: r.path, since: h, why: `CTR anomaly: ${ev}` });
    continue;
  }
  const q = topQueries(r.path);
  add(r.path, "CTR anomaly", r.shortfall, `${ev}${q ? `; top queries ${q}` : "; no query rows in the join"}`, "rewrite title and description to answer the top queries with a fact the page sources");
}

let decayNote = "no earlier snapshot with a different window";
if (previous?.engines?.google?.length) {
  const { decayed } = decay(current.engines.google, previous.engines.google);
  decayNote = `${decayed.length} pages against ${previous.date} (${previous.range.start} to ${previous.range.end})`;
  for (const d of decayed) {
    if (noindex.has(d.path)) continue;
    const ev = `impressions ${d.before.impressions} → ${d.after.impressions} (${pct(d.change, 0)}) at position ${d.before.position.toFixed(1)} → ${d.after.position.toFixed(1)}`;
    const h = heldSince(d.path);
    if (h) {
      held.push({ path: d.path, since: h, why: `decay: ${ev}` });
      continue;
    }
    add(d.path, "Decay", d.lost * expectedCtr(d.after.position), ev, "check whether demand fell (the queries) or the snippet lost to a rival; refresh the capsule if the facts moved");
  }
}

for (const e of stale) {
  const g = byPath.get(e.url);
  const at = g ? g.impressions * expectedCtr(g.position) : 0;
  const ev = `updated ${e.updated}, ${e.ageDays} days old${g ? `; ${g.impressions} impressions at position ${g.position.toFixed(1)}` : "; no Google impressions"}`;
  add(e.url, "Stale", at, ev, "re-verify every claim against its primary sources, then move the stamp (never the stamp alone)");
}

const sm = await sitemapPaths().catch((e) => ({ paths: null, from: `${arg("--sitemap-url")} (${e.message})` }));
let lagNote = `not computed: no sitemap at ${sm.from} (run npm run build, or pass --sitemap / --sitemap-url)`;
if (sm.paths) {
  const published = fs.existsSync("src/data/published.ts") ? parsePublished(fs.readFileSync("src/data/published.ts", "utf8")) : new Map();
  const seen = new Set(google.filter((r) => r.impressions > 0).map((r) => r.path));
  const lag = indexLag(sm.paths, seen, published, current.range);
  lagNote = `${lag.lagging.length} of ${sm.paths.length} sitemap URLs (${sm.from}) published before the window with no Google impression`;
  for (const r of lag.lagging) {
    if (noindex.has(r.path)) continue;
    add(r.path, "Index lag", r.ageDays >= 90 ? 2 : 1, `in the sitemap, published ${r.published} (${r.ageDays} days at window end), no Google impression in the window`, "URL Inspection in Search Console; if not indexed, link it from a page that is");
  }
}

const ranked = [...actions.values()].sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
const top = ranked.slice(0, TOP);

// ── Write ────────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/\|/g, "\\|");
const counts = ranked.reduce((m, a) => {
  for (const k of a.kinds) m[k] = (m[k] ?? 0) + 1;
  return m;
}, {});
const lines = [];
lines.push("# Ops queue");
lines.push("");
lines.push(
  `_Generated by \`node scripts/build-ops-queue.mjs\` (weekly in .github/workflows/search-snapshot.yml). Do not edit by hand: the next run overwrites it._`,
);
lines.push("");
lines.push(`- Google window: ${current.range.start} to ${current.range.end} (snapshot ${current.date})`);
lines.push(`- CTR anomalies: ${anomalies.length} pages at position 10 or better earning under half the curve, ${anomalies.length - held.filter((h) => h.why.startsWith("CTR")).length} actionable`);
lines.push(`- Decay: ${decayNote}`);
lines.push(`- Stale: ${staleNote}`);
lines.push(`- Index lag: ${lagNote}`);
lines.push(`- Held (retitled on or after ${current.range.start}, so no full window yet): ${held.length} signals on ${new Set(held.map((h) => h.path)).size} pages, listed at the end`);
lines.push("");
lines.push(
  "Score: Google clicks at stake per window, summed over a page's signals. A CTR anomaly counts the clicks the curve expects minus the clicks it got; decay the lost impressions at the curve's CTR; a stale stamp every click the page's impressions are worth; index lag one click (two past 90 days), because nothing was measured. " +
    `The curve (positions 1-10: ${CTR_CURVE.map((x) => Number((x * 100).toFixed(1))).join(", ")}%) is a rounded public composite used to order pages, not a forecast.`,
);
lines.push("");
lines.push(`## Top ${top.length} of ${ranked.length} pages with an action`);
lines.push("");
lines.push("| # | Page | Signals | Score | Do | Evidence |");
lines.push("|---|---|---|---|---|---|");
top.forEach((a, i) => {
  lines.push(
    `| ${i + 1} | \`${esc(a.path)}\` | ${a.kinds.join(" + ")} | ${a.score.toFixed(1)} | ${esc([...new Set(a.todo)].join("; "))} | ${esc(a.evidence.join(" · "))} |`,
  );
});
lines.push("");
lines.push(`All ranked pages by signal: ${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(", ") || "none"}.`);
lines.push("");
lines.push("## Held");
lines.push("");
if (!held.length) lines.push("None.");
else {
  lines.push("Signals on pages retitled inside the current window. Read them at the first pull whose window starts after the retitle.");
  lines.push("");
  for (const h of held.sort((a, b) => a.since.localeCompare(b.since) || a.path.localeCompare(b.path))) {
    lines.push(`- \`${h.path}\` (retitled ${h.since}): ${h.why}`);
  }
}
lines.push("");
const md = lines.join("\n");

if (argv.includes("--stdout")) process.stdout.write(md);
else {
  fs.writeFileSync(OUT, md);
  console.log(`build-ops-queue: wrote ${OUT}: top ${top.length} of ${ranked.length} pages; ${held.length} held signals.`);
}
