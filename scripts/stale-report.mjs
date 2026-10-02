#!/usr/bin/env node
/**
 * Which pages are overdue a re-verification, oldest first.
 *
 * The daily content routine needs a priority order, and "whatever I thought
 * of" is not one. This ranks every dated page by the age of its stamp so the
 * routine spends its verification budget on the pages most likely to have
 * gone wrong, rather than on whichever cluster is top of mind.
 *
 * What it reads:
 *   - src/data/*.entries.ts      every authored entry's `"updated"` stamp
 *   - content/posts/*.mdx        each published post's frontmatter `updated`
 *                                (falling back to `date`, as lib/posts does)
 *   - the event hubs             the page-local `const UPDATED` on /changes,
 *                                /fitbit-api-shutdown and /google-fit-shutdown
 *
 * Usage:
 *   node scripts/stale-report.mjs                 # summary + the 20 oldest
 *   node scripts/stale-report.mjs --all           # every entry
 *   node scripts/stale-report.mjs --json          # machine-readable
 *   node scripts/stale-report.mjs --over 90       # only entries at least N days old
 *   node scripts/stale-report.mjs --weight [path] # within each 30-day age band,
 *                                                 # most search impressions first
 *                                                 # (default data/gsc/latest.json)
 *
 * Exits 0 always. This informs work; it does not block a commit. A hard fail
 * would be unactionable in an environment that cannot reach vendor docs, and
 * a gate you cannot satisfy is a gate people learn to bypass. Data it cannot
 * trust — a partially stamped file — is printed loudly instead, and left out.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = "src/data";
const POSTS_DIR = "content/posts";
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const showAll = args.includes("--all");
const overIdx = args.indexOf("--over");
const overDays = overIdx !== -1 ? Number(args[overIdx + 1]) : null;
const weightIdx = args.indexOf("--weight");
const weightPath =
  weightIdx === -1
    ? null
    : args[weightIdx + 1] && !args[weightIdx + 1].startsWith("--")
      ? args[weightIdx + 1]
      : "data/gsc/latest.json";

/**
 * The re-verification target, and it must match the one readers see.
 * ContentAge flags a page from day 90 onward (`days < staleAfterDays` is the
 * only unflagged case), with ages counted between UTC midnights. A report
 * that called day 90 fine while the page called it due would send the
 * routine past exactly the pages that are already showing an amber badge.
 */
const STALE_AFTER_DAYS = 90;
/** Width of the age bands --weight sorts within. Three bands to the target. */
const BAND_DAYS = 30;

const today = new Date();
const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
const ageOf = (iso) => Math.round((todayUtc - Date.parse(`${iso}T00:00:00Z`)) / 86_400_000);

/** Things worth shouting about. Printed last, to stderr, so they are the
 *  final lines on screen rather than scrolled away above the table. */
const problems = [];
/** Files that carry slugs but no stamps at all: outside the freshness system
 *  by construction, not broken. Listed so nobody mistakes absence for zero. */
const unstamped = [];
const rows = [];

/**
 * The URL base for an entries file, read from the module that imports it
 * rather than guessed from the file name. testing.entries.ts serves /test,
 * data.entries.ts is imported by healthData.ts, and the standalone HealthKit
 * pages live at the root — a name-derived URL is wrong often enough to break
 * the --weight join silently. A module with no path constant serves its
 * slugs at the root, which is exactly the standalone-page case.
 */
const modules = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".entries.ts"))
  .map((f) => fs.readFileSync(path.join(DIR, f), "utf8"));
function basePathFor(cluster) {
  const owner = modules.find((src) => src.includes(`from "./${cluster}.entries"`));
  if (!owner) return `/${cluster}`;
  return owner.match(/^export const \w+ = "(\/[a-z0-9/-]*)";/m)?.[1] ?? "";
}

// ── Authored entries ──────────────────────────────────────────────────
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".entries.ts"))) {
  const src = fs.readFileSync(path.join(DIR, file), "utf8");
  const cluster = file.replace(".entries.ts", "");
  // Entries are JSON-in-TS, so slug and updated appear in document order and
  // pair up positionally. Guard that assumption rather than assuming it.
  const slugs = [...src.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
  const updated = [...src.matchAll(/"updated":\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
  if (updated.length === 0) {
    // No stamps at all is a state, not a parse failure: the file's pages are
    // simply not tracked yet. Until 2026-09 this branch was an exit 1, which
    // made the whole report unusable for a month over two unstamped files.
    if (slugs.length > 0) unstamped.push({ file, slugs: slugs.length });
    continue;
  }
  if (slugs.length !== updated.length) {
    // Some but not all: someone stamped part of a file, or a stamp moved
    // inside a nested object. Positional pairing would hang the wrong date on
    // the wrong page, so the file is left out — and said so loudly.
    problems.push(
      `${file}: ${slugs.length} slugs but ${updated.length} updated stamps — cannot pair them reliably, so none of its entries are ranked.`,
    );
    continue;
  }
  const base = basePathFor(cluster);
  slugs.forEach((slug, i) =>
    rows.push({ cluster, slug, url: `${base}/${slug}`, updated: updated[i], staleAfterDays: STALE_AFTER_DAYS }),
  );
}

// ── Blog posts ────────────────────────────────────────────────────────
// Same fallback as lib/posts.ts: `updated`, else `date`. Drafts are not
// published, so they are not on anyone's queue.
if (fs.existsSync(POSTS_DIR)) {
  for (const file of fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f))) {
    const slug = file.replace(/\.mdx?$/, "");
    const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"))?.[1] ?? "";
    if (/^draft:\s*true\b/m.test(front)) continue;
    const field = (k) => new RegExp(`^${k}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, "m").exec(front)?.[1];
    const stamp = field("updated") ?? field("date");
    if (!stamp) {
      unstamped.push({ file: `${POSTS_DIR}/${file}`, slugs: 1 });
      continue;
    }
    rows.push({ cluster: "blog", slug, url: `/blog/${slug}`, updated: stamp, staleAfterDays: STALE_AFTER_DAYS });
  }
}

// ── Event hubs ────────────────────────────────────────────────────────
// Pages whose claims expire on a calendar. Each keeps its stamp in a
// page-local constant, and its threshold is whatever it hands ContentAge, so
// the report flags a hub on the same day the page starts showing the badge.
const EVENT_HUBS = ["/changes", "/fitbit-api-shutdown", "/google-fit-shutdown"];
for (const route of EVENT_HUBS) {
  const file = `src/app${route}/page.tsx`;
  let src = "";
  try {
    src = fs.readFileSync(file, "utf8");
  } catch {
    problems.push(`${file}: event hub page not found — it has dropped out of the queue.`);
    continue;
  }
  const stamp = /const UPDATED\s*=\s*"(\d{4}-\d{2}-\d{2})"/.exec(src)?.[1];
  if (!stamp) {
    problems.push(`${file}: no \`const UPDATED = "YYYY-MM-DD"\` — the event hub has dropped out of the queue.`);
    continue;
  }
  const threshold = Number(/<ContentAge\s+date=\{UPDATED\}\s+staleAfterDays=\{(\d+)\}/.exec(src)?.[1] ?? STALE_AFTER_DAYS);
  rows.push({ cluster: "event", slug: route.slice(1), url: route, updated: stamp, staleAfterDays: threshold });
}

for (const r of rows) {
  r.ageDays = ageOf(r.updated);
  r.due = r.ageDays >= r.staleAfterDays;
}

// ── Demand weighting ──────────────────────────────────────────────────
// Age decides the band; within a band, the page people actually find goes
// first. A page with 400 impressions that drifted wrong misleads more readers
// than one with none, and re-verifying it first is the better use of a day.
// Impressions are summed per path across hosts — Search Console splits www
// and apex into separate rows for what is one page.
let weight = null;
if (weightPath) {
  try {
    const snap = JSON.parse(fs.readFileSync(weightPath, "utf8"));
    const byPath = new Map();
    for (const r of snap.byPage ?? []) {
      let p;
      try {
        p = new URL(r.keys[0]).pathname.replace(/(.)\/+$/, "$1");
      } catch {
        continue;
      }
      byPath.set(p, (byPath.get(p) ?? 0) + (Number(r.impressions) || 0));
    }
    weight = { path: weightPath, range: snap.range ?? null, byPath };
    for (const r of rows) r.impressions = byPath.get(r.url) ?? 0;
  } catch (e) {
    problems.push(`--weight ${weightPath}: could not read impressions (${e.message}) — ranked by age alone.`);
  }
}

const band = (r) => Math.floor(r.ageDays / BAND_DAYS);
rows.sort((a, b) =>
  weight
    ? band(b) - band(a) || b.impressions - a.impressions || b.ageDays - a.ageDays || a.url.localeCompare(b.url)
    : b.ageDays - a.ageDays || a.url.localeCompare(b.url),
);
const overValid = overDays !== null && Number.isFinite(overDays);
if (overDays !== null && !overValid) problems.push(`--over needs a number of days; ignoring it.`);
const filtered = overValid ? rows.filter((r) => r.ageDays >= overDays) : rows;

const flushProblems = () => {
  if (!problems.length) return;
  console.error(`\n✗ ${problems.length} problem${problems.length === 1 ? "" : "s"}:`);
  for (const p of problems) console.error(`  ✗ ${p}`);
};

// No process.exit() anywhere below: on a pipe, stdout drains asynchronously,
// and exiting straight after console.log cuts the JSON off at the first 64 KB
// — which this report now exceeds. Letting the script end flushes it.
if (asJson) {
  console.log(
    JSON.stringify(
      {
        generatedOn: new Date().toISOString().slice(0, 10),
        total: rows.length,
        staleAfterDays: STALE_AFTER_DAYS,
        weightedBy: weight ? { path: weight.path, range: weight.range } : null,
        entries: filtered,
        unstamped,
        problems,
      },
      null,
      2,
    ),
  );
  flushProblems();
} else {
  printReport();
  flushProblems();
}

function printReport() {
  const buckets = [
    ["0-29 days", (d) => d < 30],
    ["30-59", (d) => d >= 30 && d < 60],
    ["60-89", (d) => d >= 60 && d < STALE_AFTER_DAYS],
    [`${STALE_AFTER_DAYS}+ due`, (d) => d >= STALE_AFTER_DAYS],
  ];
  console.log(`${rows.length} entries across ${new Set(rows.map((r) => r.cluster)).size} clusters\n`);
  for (const [label, test] of buckets) {
    const n = rows.filter((r) => test(r.ageDays)).length;
    const bar = "█".repeat(rows.length ? Math.round((n / rows.length) * 40) : 0);
    console.log(`  ${label.padEnd(10)} ${String(n).padStart(4)}  ${bar}`);
  }

  const byCluster = {};
  for (const r of rows) {
    byCluster[r.cluster] ??= [];
    byCluster[r.cluster].push(r.ageDays);
  }
  console.log("\nOldest entry per cluster:");
  for (const [c, ages] of Object.entries(byCluster).sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]))) {
    console.log(`  ${c.padEnd(16)} ${String(Math.max(...ages)).padStart(4)}d`);
  }

  // Event hubs flag on their own, shorter clock, so a 40-day hub is overdue
  // while sitting in a band the list below treats as young. Name them here.
  const hubsDue = rows.filter((r) => r.cluster === "event" && r.due);
  if (hubsDue.length) {
    console.log(`\nEvent hubs past their own threshold:`);
    for (const r of hubsDue) console.log(`  ${String(r.ageDays).padStart(4)}d  ${r.updated}  ${r.url}  (flags at ${r.staleAfterDays}d)`);
  }

  if (unstamped.length) {
    console.log(`\nUnstamped — outside the freshness system, not ranked:`);
    for (const u of unstamped) console.log(`  ${u.file} (${u.slugs} slug${u.slugs === 1 ? "" : "s"}, no stamps)`);
  }

  const show = showAll ? filtered : filtered.slice(0, 20);
  const how = weight
    ? `, by ${BAND_DAYS}-day age band then impressions${weight.range ? ` ${weight.range.start}→${weight.range.end}` : ""}`
    : "";
  console.log(`\n${showAll ? "All" : "Oldest"} ${show.length}${overValid ? ` (${overDays}+ days)` : ""}${how}:`);
  for (const r of show) {
    const impr = weight ? `${String(r.impressions).padStart(6)} impr  ` : "";
    console.log(`  ${String(r.ageDays).padStart(4)}d  ${r.updated}  ${impr}${r.url}${r.due ? "  · due" : ""}`);
  }
}
