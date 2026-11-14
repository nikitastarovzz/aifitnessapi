/**
 * Pure functions behind scripts/judge-changes.mjs, which reads back the
 * changes the daily content automation logged in ops/content-log.jsonl and
 * says whether each one helped. No file system, no network, no clock, so
 * scripts/judge-changes.test.mjs can pin them.
 *
 * A log line that wants judging carries a `measure` block:
 *
 *   "measure": { "path": "/pricing/garmin-api-pricing",
 *                "kind": "retitle" | "faq" | "section" | "new-page" | "reverify",
 *                "before": { "start", "end", "impressions", "clicks", "position" },
 *                "previous": { "metaTitle", "metaDescription" } }   (retitle only)
 *
 * `before` is the page's row in the Search Console pull that was current
 * when the change was made (beforeBlock builds it). The change is judged
 * against the first pull whose whole window ran under it, and a judgment is
 * logged back as an "action":"judge" line whose `ref` names the entry.
 *
 * The comparison is click-through against the position curve in
 * scripts/lib/gsc-sections.mjs, so a page that moved up or down the results
 * is read at its new position instead of being credited or blamed for the
 * move. It is a heuristic over 28-day windows, not an experiment: demand
 * moves on its own, and the verdict says what the numbers did, not why.
 */
import { expectedCtr, normalisePath } from "./gsc-sections.mjs";

export const MIN_IMPRESSIONS = 50;
const EPS = 1e-9;

/** Click-through over the curve's expectation at the row's position. */
export const curveRatio = (row) => (row.impressions ? row.clicks / row.impressions : 0) / expectedCtr(row.position);

const refKey = (date, p) => `${date}\u0000${normalisePath(p)}`;

/**
 * Entries with a `measure` whose date is strictly before the current
 * window's start (so the whole window ran under the change) and with no
 * later "judge" line whose ref names the same date and path. Returns
 * { index, entry } pairs in log order.
 */
export function due(entries, latestRange) {
  const judgedAfter = new Map(); // ref key -> index of the last judge line
  entries.forEach((e, i) => {
    if (e?.action === "judge" && e.ref?.date && e.ref?.path) judgedAfter.set(refKey(e.ref.date, e.ref.path), i);
  });
  const out = [];
  entries.forEach((e, i) => {
    if (!e?.measure?.path || !e.date || e.action === "judge") return;
    if (!(e.date < latestRange.start)) return;
    const j = judgedAfter.get(refKey(e.date, e.measure.path));
    if (j !== undefined && j > i) return;
    out.push({ index: i, entry: e });
  });
  return out;
}

const pct = (x) => `${(x * 100).toFixed(1)}%`;
const describe = (r) =>
  `${r.impressions} impressions, ${r.clicks} clicks, CTR ${pct(r.impressions ? r.clicks / r.impressions : 0)} at position ${Number(r.position).toFixed(1)} (${curveRatio(r).toFixed(2)} of the curve)`;

/**
 * The verdict for one change. `after` is the page's row in the current pull,
 * or null. Returns { verdict, why, action }: action is "revert" for a worse
 * retitle and "keep" otherwise.
 */
export function verdict(kind, before, after) {
  const out = (v, why) => ({ verdict: v, why, action: v === "worse" && kind === "retitle" ? "revert" : "keep" });
  if (!after || !(after.impressions > 0)) {
    return kind === "new-page" ? out("not-shown", "no Google impression in the current window") : out("gone", "the page drew no Google impression in the current window");
  }
  if (kind === "new-page") return out("shown", `shown in Google: ${describe(after)}`);
  if (!before || before.impressions < MIN_IMPRESSIONS || after.impressions < MIN_IMPRESSIONS) {
    return out("thin", `too few impressions to judge (before ${before?.impressions ?? 0}, after ${after.impressions}; ${MIN_IMPRESSIONS} each needed)`);
  }
  const rb = curveRatio(before);
  const ra = curveRatio(after);
  const why = `before ${describe(before)}; after ${describe(after)}`;
  if (ra >= 1.25 * rb - EPS && after.clicks >= before.clicks + 2) return out("better", why);
  if (ra <= 0.6 * rb + EPS && before.clicks >= 3) return out("worse", why);
  return out("flat", why);
}

/** The `before` block for a page from the current pull's merged row (or zeros). */
export function beforeBlock(pageRow, range) {
  return {
    start: range.start,
    end: range.end,
    impressions: pageRow?.impressions ?? 0,
    clicks: pageRow?.clicks ?? 0,
    position: pageRow?.impressions ? Math.round(pageRow.position * 10) / 10 : 0,
  };
}

/** ops/content-log.jsonl text -> entries; blank lines skipped, a bad line reported. */
export function parseLog(text) {
  const entries = [];
  const bad = [];
  String(text)
    .split("\n")
    .forEach((line, i) => {
      if (!line.trim()) return;
      try {
        entries.push(JSON.parse(line));
      } catch {
        bad.push(i + 1);
      }
    });
  return { entries, bad };
}
