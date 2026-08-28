#!/usr/bin/env node
/**
 * Which pages are overdue a re-verification, oldest first.
 *
 * The daily content routine needs a priority order, and "whatever I thought
 * of" is not one. This ranks every entry by the age of its `updated` stamp so
 * the routine spends its verification budget on the pages most likely to have
 * gone wrong, rather than on whichever cluster is top of mind.
 *
 * Usage:
 *   node scripts/stale-report.mjs            # summary + the 20 oldest
 *   node scripts/stale-report.mjs --all      # every entry
 *   node scripts/stale-report.mjs --json     # machine-readable
 *   node scripts/stale-report.mjs --over 120 # only entries older than N days
 *
 * Exits 0 always. This informs work; it does not block a commit. A hard fail
 * would be unactionable in an environment that cannot reach vendor docs, and
 * a gate you cannot satisfy is a gate people learn to bypass.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = "src/data";
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const showAll = args.includes("--all");
const overIdx = args.indexOf("--over");
const overDays = overIdx !== -1 ? Number(args[overIdx + 1]) : null;

const today = new Date();
const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
const ageOf = (iso) => Math.round((todayUtc - Date.parse(`${iso}T00:00:00Z`)) / 86_400_000);

const rows = [];
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".entries.ts"))) {
  const src = fs.readFileSync(path.join(DIR, file), "utf8");
  const cluster = file.replace(".entries.ts", "");
  // Entries are JSON-in-TS, so slug and updated appear in document order and
  // pair up positionally. Guard that assumption rather than assuming it.
  const slugs = [...src.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
  const updated = [...src.matchAll(/"updated":\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
  if (slugs.length !== updated.length) {
    console.error(
      `✗ ${file}: ${slugs.length} slugs but ${updated.length} updated stamps — cannot pair them reliably.`,
    );
    process.exit(1);
  }
  slugs.forEach((slug, i) => rows.push({ cluster, slug, updated: updated[i], ageDays: ageOf(updated[i]) }));
}

rows.sort((a, b) => b.ageDays - a.ageDays);
const filtered = overDays === null ? rows : rows.filter((r) => r.ageDays > overDays);

if (asJson) {
  console.log(JSON.stringify({ generatedOn: new Date().toISOString().slice(0, 10), total: rows.length, entries: filtered }, null, 2));
  process.exit(0);
}

const buckets = [
  ["0-30 days", (d) => d <= 30],
  ["31-60", (d) => d > 30 && d <= 60],
  ["61-90", (d) => d > 60 && d <= 90],
  ["over 90", (d) => d > 90],
];
console.log(`${rows.length} entries across ${new Set(rows.map((r) => r.cluster)).size} clusters\n`);
for (const [label, test] of buckets) {
  const n = rows.filter((r) => test(r.ageDays)).length;
  const bar = "█".repeat(Math.round((n / rows.length) * 40));
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

const show = showAll ? filtered : filtered.slice(0, 20);
console.log(`\n${showAll ? "All" : "Oldest"} ${show.length}${overDays !== null ? ` (over ${overDays} days)` : ""}:`);
for (const r of show) {
  console.log(`  ${String(r.ageDays).padStart(4)}d  ${r.updated}  /${r.cluster === "fitnessApis" ? "fitness-apis" : r.cluster === "watchApps" ? "watch-apps" : r.cluster === "testing" ? "test" : r.cluster}/${r.slug}`);
}
