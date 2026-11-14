#!/usr/bin/env node
/**
 * The change judge: did the changes the daily content automation made
 * help? It reads the changes logged with a `measure` block in
 * ops/content-log.jsonl, finds the ones whose whole current Search Console
 * window ran under the change, and compares the page's row in the current
 * pull with the `before` row logged at the time. The rules live in
 * scripts/lib/judge-changes.mjs:
 *
 *   new-page      shown, or not-shown (no impression in the window)
 *   other kinds   gone (no impression), thin (under 50 impressions before
 *                 or after), better (click-through over the position curve
 *                 up 25% or more and at least 2 more clicks), worse (down to
 *                 60% or less, from at least 3 clicks), otherwise flat
 *   action        revert for a worse retitle (the log line's `previous`
 *                 holds the old title and description), keep otherwise
 *
 * Reads:
 *   ops/content-log.jsonl   one JSON object per line (blank lines skipped)
 *   data/gsc/latest.json    the current pull (scripts/search-pull.mjs);
 *                           byPage merged by path, as build-ops-queue reads it
 *
 * Writes nothing unless --record is given; then it appends one line per due
 * entry to ops/content-log.jsonl:
 *   {"date", "action":"judge", "cluster", "slug", "signal", "notes",
 *    "ref":{"date","path"}, "verdict"}
 * and the entry is not due again.
 *
 * Usage:
 *   node scripts/judge-changes.mjs                  # table of due entries and verdicts
 *   node scripts/judge-changes.mjs --json
 *   node scripts/judge-changes.mjs --record         # also append the judge lines
 *   node scripts/judge-changes.mjs --before /pricing/garmin-api-pricing
 *                                                   # the "before" JSON for a path, from the current pull
 *   node scripts/judge-changes.mjs --today 2026-11-14
 *
 * Exits 0 always, except when data/gsc/latest.json is missing.
 */
import fs from "node:fs";
import { mergeByPath, normalisePath } from "./lib/gsc-sections.mjs";
import { due, verdict, beforeBlock, parseLog } from "./lib/judge-changes.mjs";

const LOG = "ops/content-log.jsonl";
const LATEST = "data/gsc/latest.json";

const argv = process.argv.slice(2);
const arg = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};
const today = arg("--today") ?? new Date().toISOString().slice(0, 10);

if (!fs.existsSync(LATEST)) {
  console.error(`judge-changes: ${LATEST} is missing (run NODE_USE_ENV_PROXY=1 node scripts/search-pull.mjs first).`);
  process.exit(1);
}
const latest = JSON.parse(fs.readFileSync(LATEST, "utf8"));
const range = latest.range;
const byPath = new Map(mergeByPath(latest.byPage).map((r) => [r.path, r]));

if (arg("--before") !== undefined) {
  const p = normalisePath(arg("--before"));
  process.stdout.write(JSON.stringify(beforeBlock(byPath.get(p) ?? null, range)) + "\n");
  process.exit(0);
}

const text = fs.existsSync(LOG) ? fs.readFileSync(LOG, "utf8") : "";
const { entries, bad } = parseLog(text);
if (bad.length) console.warn(`judge-changes: skipped unparseable lines ${bad.join(", ")} of ${LOG}`);

const results = due(entries, range).map(({ entry }) => {
  const m = entry.measure;
  const p = normalisePath(m.path);
  const after = byPath.get(p) ?? null;
  return { date: entry.date, path: p, kind: m.kind, cluster: entry.cluster, slug: entry.slug, after: after ? beforeBlock(after, range) : null, ...verdict(m.kind, m.before, after) };
});

if (argv.includes("--json")) {
  process.stdout.write(JSON.stringify({ range, due: results }, null, 2) + "\n");
} else if (!results.length) {
  console.log(`judge-changes: nothing due (current window ${range.start} to ${range.end}).`);
} else {
  const esc = (s) => String(s).replace(/\|/g, "\\|");
  console.log(`judge-changes: ${results.length} due against ${range.start} to ${range.end}`);
  console.log("");
  console.log("| Logged | Page | Kind | Verdict | Action | Why |");
  console.log("|---|---|---|---|---|---|");
  for (const r of results) console.log(`| ${r.date} | \`${esc(r.path)}\` | ${r.kind} | ${r.verdict} | ${r.action} | ${esc(r.why)} |`);
}

if (argv.includes("--record") && results.length) {
  const lines = results.map((r) =>
    JSON.stringify({
      date: today,
      action: "judge",
      cluster: r.cluster,
      slug: r.slug,
      signal: `${r.kind} on ${r.path} logged ${r.date}, judged against Google ${range.start} to ${range.end}`,
      notes: `${r.verdict}, ${r.action}: ${r.why}`,
      ref: { date: r.date, path: r.path },
      verdict: r.verdict,
    }),
  );
  const sep = text && !text.endsWith("\n") ? "\n" : "";
  fs.appendFileSync(LOG, sep + lines.join("\n") + "\n");
  console.log(`judge-changes: recorded ${lines.length} judge lines in ${LOG}.`);
}
