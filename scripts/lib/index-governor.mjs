/**
 * Pure functions behind scripts/index-governor.mjs, the gate that decides how
 * many new pages the daily content automation may publish. No file system,
 * no network, no clock: every input is passed in, so
 * scripts/index-governor.test.mjs can pin them.
 *
 * The question it answers: is Google still showing this site's new pages
 * within a week of publication? In normal times most new pages draw their
 * first Search Console impression inside seven days. When that stops (pages
 * published from Oct 22, 2026 mostly drew none), publishing more pages only
 * adds to the unindexed pile, so the automation slows down until a probe page
 * shows the index has reopened.
 *
 * Inputs, as the CLI builds them:
 *   published   Map(path -> YYYY-MM-DD) from src/data/published.ts
 *               (parsePublished in scripts/lib/gsc-sections.mjs)
 *   firstSeen   { path: YYYY-MM-DD }, the first day each path drew a Google
 *               impression (data/gsc/first-seen.json)
 *   asOf        the latest date with any Search Console row in the read
 *   today       the run's date
 *
 * A first impression is not proof of indexing, and its absence is not proof
 * of the opposite: a page can be indexed and never shown. It is the closest
 * signal the environment's read-only Search Analytics credential can reach.
 */
import { normalisePath } from "./gsc-sections.mjs";

const DAY = 86400000;
export const START_DATE = "2026-07-01";
export const SHOWN_DAYS = 7;
export const MIN_SAMPLE = 5;
export const ALLOWANCE = { open: 7, throttled: 2, closed: 1 };
export const REQUEST_CAP = 10;
export const RELIST_DAYS = 14;
export const SECTION_PRIORITY = [
  "/alternatives",
  "/pricing",
  "/compare",
  "/fix",
  "/integrate",
  "/motion",
  "/fitness-apis",
  "/compliance",
];

export function addDays(date, n) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);

const sortObject = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
const round4 = (x) => (x === null ? null : Math.round(x * 10000) / 10000);

/**
 * Search Analytics rows with dimensions ["date", "page"] -> the earliest date
 * each normalised path appears, and `asOf`, the latest date with any row.
 * A row with zero impressions (the API never sends one) is ignored.
 */
export function firstSeenFromRows(rows) {
  const firstSeen = {};
  let asOf = null;
  for (const r of rows ?? []) {
    const [date, url] = r.keys ?? [];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || !url || !(r.impressions > 0)) continue;
    const p = normalisePath(url);
    if (!firstSeen[p] || date < firstSeen[p]) firstSeen[p] = date;
    if (!asOf || date > asOf) asOf = date;
  }
  return { asOf, firstSeen: sortObject(firstSeen) };
}

/**
 * Merge a read into the ledger. A ledger date only ever moves earlier and a
 * path is never removed; asOf is the later of the two.
 */
export function mergeLedger(ledger, read) {
  const out = { ...(ledger?.firstSeen ?? {}) };
  for (const [p, d] of Object.entries(read?.firstSeen ?? {})) {
    if (!out[p] || d < out[p]) out[p] = d;
  }
  const dates = [ledger?.asOf, read?.asOf].filter(Boolean).sort();
  return { asOf: dates.at(-1) ?? null, firstSeen: sortObject(out) };
}

/** Shown within `days` of publication; a first-seen date before publication counts. */
export function shownWithin(first, published, days) {
  return Boolean(first) && first <= addDays(published, days);
}

/** Pages published from `from` to `to` inclusive, as [path, date]. */
function publishedBetween(published, from, to) {
  return [...published].filter(([, d]) => d >= from && d <= to);
}

function shareOf(pages, firstSeen, days = SHOWN_DAYS) {
  const shown = pages.filter(([p, d]) => shownWithin(firstSeen[p], d, days)).length;
  return { sample: pages.length, shown, share: pages.length ? shown / pages.length : null };
}

/**
 * The verdict. Judged cohort: pages published from asOf - 21 to asOf - 7
 * (each has had its full seven days); widened to asOf - 35 when that holds
 * fewer than five pages; `throttled` with reason "no recent sample" when even
 * that is too few. open at share >= 0.5, throttled at 0.2 <= share < 0.5,
 * closed below 0.2.
 */
export function judge({ published, firstSeen, asOf }) {
  const to = addDays(asOf, -SHOWN_DAYS);
  let from = addDays(asOf, -21);
  let pages = publishedBetween(published, from, to);
  let widened = false;
  if (pages.length < MIN_SAMPLE) {
    from = addDays(asOf, -35);
    pages = publishedBetween(published, from, to);
    widened = true;
  }
  const { sample, shown, share } = shareOf(pages, firstSeen);
  const window = { from, to };
  if (sample < MIN_SAMPLE) {
    return { verdict: "throttled", reason: "no recent sample", share: round4(share), sample, shownWithin7: shown, window, widened };
  }
  const verdict = share >= 0.5 ? "open" : share >= 0.2 ? "throttled" : "closed";
  const reason = `${shown} of ${sample} pages published ${from} to ${to} were shown in Google within ${SHOWN_DAYS} days`;
  return { verdict, reason, share: round4(share), sample, shownWithin7: shown, window, widened };
}

/** The same seven-day share over pages published from asOf - 120 to asOf - 22. */
export function baseline({ published, firstSeen, asOf }) {
  const { sample, share } = shareOf(publishedBetween(published, addDays(asOf, -120), addDays(asOf, -22)), firstSeen);
  return { share: round4(share), sample };
}

/**
 * Weekly allowance minus the pages published in the seven days ending today,
 * floored at 0. At most one new page per run.
 */
export function budget({ verdict, published, today }) {
  const allowance = ALLOWANCE[verdict];
  const from = addDays(today, -6);
  const publishedLast7 = [...published.values()].filter((d) => d >= from && d <= today).length;
  const left = Math.max(0, allowance - publishedLast7);
  return { allowance, publishedLast7, budget: left, newPagesToday: left >= 1 ? 1 : 0 };
}

/** One row per publish date: pages, shown within 7 and 14 days, ever, age at asOf. */
export function cohorts({ published, firstSeen, asOf }) {
  const by = new Map();
  for (const [p, d] of published) {
    const c = by.get(d) ?? { date: d, pages: 0, within7: 0, within14: 0, ever: 0, ageDays: daysBetween(d, asOf) };
    c.pages++;
    if (shownWithin(firstSeen[p], d, 7)) c.within7++;
    if (shownWithin(firstSeen[p], d, 14)) c.within14++;
    if (firstSeen[p]) c.ever++;
    by.set(d, c);
  }
  return [...by.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** Section rank: the priority list in order, then everything else, then /pt-br. */
export function sectionRank(p) {
  if (p === "/pt-br" || p.startsWith("/pt-br/")) return SECTION_PRIORITY.length + 1;
  const i = SECTION_PRIORITY.findIndex((s) => p === s || p.startsWith(`${s}/`));
  return i >= 0 ? i : SECTION_PRIORITY.length;
}

/**
 * Pages published at least seven days before asOf that have never drawn an
 * impression, filtered to `indexable` (a Set of paths) when one is given,
 * ordered by section rank, oldest first, then path.
 */
export function neverSeen({ published, firstSeen, asOf, indexable = null }) {
  const cutoff = addDays(asOf, -SHOWN_DAYS);
  return [...published]
    .filter(([p, d]) => d <= cutoff && !firstSeen[p] && (!indexable || indexable.has(p)))
    .map(([path, d]) => ({ path, published: d, ageDays: daysBetween(d, asOf) }))
    .sort((a, b) => sectionRank(a.path) - sectionRank(b.path) || (a.published < b.published ? -1 : a.published > b.published ? 1 : 0) || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

/**
 * The request-indexing list: up to ten never-seen pages. A path listed in
 * the 14 days before today (a listing dated today is this run's own, so a
 * rerun stays identical) is skipped unless skipping would leave fewer than
 * ten; then the skipped ones fill the list in rank order. `listed` keeps the
 * date each path was first listed, and drops paths that are no longer
 * never-seen pages of published.ts (they have been shown, or were removed).
 */
export function requestList({ published, firstSeen, asOf, today, indexable = null, listed = {} }) {
  const pool = neverSeen({ published, firstSeen, asOf, indexable });
  const recentFrom = addDays(today, -RELIST_DAYS);
  const recent = (p) => listed[p] && listed[p] >= recentFrom && listed[p] < today;
  const fresh = pool.filter((r) => !recent(r.path));
  const pick = fresh.slice(0, REQUEST_CAP);
  if (pick.length < REQUEST_CAP) pick.push(...pool.filter((r) => recent(r.path)).slice(0, REQUEST_CAP - pick.length));
  const next = {};
  for (const [p, d] of Object.entries(listed)) if (published.has(p) && !firstSeen[p]) next[p] = d;
  for (const r of pick) if (!next[r.path]) next[r.path] = today;
  return { requestIndexing: pick, listed: sortObject(next), neverSeenCount: pool.length };
}

/**
 * Paths that were in the never-seen set at `previousAsOf` (published at
 * least seven days before it, no impression on or before it) and now have a
 * first-seen date. Empty when there is no previous run to compare with.
 */
export function recovered({ published, firstSeen, previousAsOf }) {
  if (!previousAsOf) return [];
  const cutoff = addDays(previousAsOf, -SHOWN_DAYS);
  return [...published]
    .filter(([p, d]) => d <= cutoff && firstSeen[p] && firstSeen[p] > previousAsOf)
    .map(([p]) => p)
    .sort();
}

/**
 * The whole state file, with a fixed key order so that the same inputs give
 * byte-identical JSON. `previous` is the last state file (or null): its
 * asOf is the comparison point for `recovered`, and a rerun on the same asOf
 * keeps comparing against the point the first run used.
 */
export function buildState({ published, ledger, today, indexable = null, previous = null }) {
  const { asOf, firstSeen } = ledger;
  const j = judge({ published, firstSeen, asOf });
  const b = budget({ verdict: j.verdict, published, today });
  const r = requestList({ published, firstSeen, asOf, today, indexable, listed: previous?.listed ?? {} });
  const previousAsOf = previous?.asOf && previous.asOf < asOf ? previous.asOf : (previous?.previousAsOf ?? null);
  return {
    generatedOn: today,
    asOf,
    verdict: j.verdict,
    reason: j.reason,
    share: j.share,
    sample: j.sample,
    shownWithin7: j.shownWithin7,
    window: { from: j.window.from, to: j.window.to },
    baseline: baseline({ published, firstSeen, asOf }),
    allowance: b.allowance,
    publishedLast7: b.publishedLast7,
    budget: b.budget,
    newPagesToday: b.newPagesToday,
    requestIndexing: r.requestIndexing.map(({ path, published: d, ageDays }) => ({ path, published: d, ageDays })),
    listed: r.listed,
    recovered: recovered({ published, firstSeen, previousAsOf }),
    previousAsOf,
    neverSeenCount: r.neverSeenCount,
    cohorts: cohorts({ published, firstSeen, asOf }),
  };
}

export const stateJson = (state) => JSON.stringify(state, null, 2) + "\n";
export const ledgerJson = (ledger) => JSON.stringify({ asOf: ledger.asOf, firstSeen: sortObject(ledger.firstSeen) }, null, 2) + "\n";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** 2026-10-24 -> "Oct 24". */
export const shortDate = (d) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}`;
const pct = (x) => (x === null ? "n/a" : `${Math.round(x * 100)}%`);
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * ops/INDEX.md from the state. `site` is the origin for the request list;
 * `indexableFrom` names where the indexable set came from, or null when the
 * list was not filtered by a sitemap.
 */
export function renderMarkdown(state, { site = "https://aifitnessapi.com", indexableFrom = null, cohortDays = 60 } = {}) {
  const s = state;
  const L = [];
  L.push("# Index governor");
  L.push("");
  L.push("_Generated by `node scripts/index-governor.mjs`. Do not edit by hand._");
  L.push("");
  const span = `${shortDate(s.window.from)} to ${shortDate(s.window.to)}`;
  const base = `the baseline (pages published ${shortDate(addDays(s.asOf, -120))} to ${shortDate(addDays(s.asOf, -22))}) is ${pct(s.baseline.share)} of ${s.baseline.sample}`;
  if (s.reason === "no recent sample") {
    L.push(`**${cap(s.verdict)}: no recent sample. Only ${s.sample} pages were published ${span}, fewer than ${MIN_SAMPLE}, so there is nothing to judge; ${base}.**`);
  } else {
    L.push(`**${cap(s.verdict)}: ${s.shownWithin7} of ${s.sample} pages published ${span} were shown in Google within ${SHOWN_DAYS} days (${pct(s.share)}); ${base}.**`);
  }
  L.push("");
  L.push(`Search Console data runs to ${s.asOf}; this file was generated on ${s.generatedOn}. Thresholds: open at 50% or more, throttled from 20% to under 50%, closed under 20%.`);
  L.push("");
  L.push("## What the automation may do today");
  L.push("");
  const why =
    s.newPagesToday === 1
      ? `the ${s.verdict} allowance is ${plural(s.allowance, "new page")} a week and ${s.publishedLast7} ${s.publishedLast7 === 1 ? "was" : "were"} published in the 7 days ending ${s.generatedOn}, so ${s.budget} remain`
      : `the ${s.verdict} allowance is ${plural(s.allowance, "new page")} a week and ${s.publishedLast7} ${s.publishedLast7 === 1 ? "was" : "were"} already published in the 7 days ending ${s.generatedOn}`;
  L.push(`New pages today: **${s.newPagesToday}**. Why: ${why}. Never more than one new page per run.`);
  if (s.verdict === "closed") L.push("", "Under `closed` the one page a week is a probe: if Google shows it within a week, the next cohorts can reopen the index.");
  L.push("");
  L.push("## Request indexing");
  L.push("");
  L.push(
    `${s.requestIndexing.length} of ${s.neverSeenCount} pages published at least ${SHOWN_DAYS} days before ${s.asOf} with no Google impression ever. Paste each into Search Console's URL Inspection and choose "Request indexing". ` +
      (indexableFrom ? `Filtered to the sitemap at ${indexableFrom}.` : "The list was not filtered by the sitemap (no built sitemap and no --sitemap-url), so a noindexed page can appear in it."),
  );
  L.push("");
  if (s.requestIndexing.length) {
    L.push("```");
    for (const r of s.requestIndexing) L.push(`${site}${r.path}`);
    L.push("```");
    L.push("");
    L.push("| Page | Published | Age (days) |");
    L.push("|---|---|---|");
    for (const r of s.requestIndexing) L.push(`| \`${r.path}\` | ${r.published} | ${r.ageDays} |`);
  } else L.push("None.");
  L.push("");
  L.push("## Recovered");
  L.push("");
  if (!s.previousAsOf) L.push("No earlier run to compare with.");
  else if (!s.recovered.length) L.push(`No page that was never shown as of ${s.previousAsOf} has been shown since.`);
  else {
    L.push(`Pages never shown as of ${s.previousAsOf} that Google has shown since:`);
    L.push("");
    for (const p of s.recovered) L.push(`- \`${p}\``);
  }
  L.push("");
  L.push(`## Cohorts, last ${cohortDays} days`);
  L.push("");
  L.push("| Published | Pages | Shown within 7 days | Within 14 | Ever | Age at " + s.asOf + " |");
  L.push("|---|---|---|---|---|---|");
  const from = addDays(s.asOf, -cohortDays);
  for (const c of [...s.cohorts].filter((c) => c.date >= from).reverse()) {
    L.push(`| ${c.date} | ${c.pages} | ${c.within7} | ${c.within14} | ${c.ever} | ${c.ageDays} |`);
  }
  L.push("");
  L.push("## The limit of this signal");
  L.push("");
  L.push(
    "Everything here is inferred from Search Console's Search Analytics impressions: a page counts as shown on the first day it drew one. That is not the same as indexed. A page can be indexed and never shown, because no one searched for what it answers, and a page can drop out of the index after it was shown. The URL Inspection API would say what Google has indexed, but the environment's read-only credential cannot reach it, so the verdict reads the nearest signal it can.",
  );
  L.push("");
  return L.join("\n");
}
