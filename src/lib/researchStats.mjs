/**
 * The figures of the three /research studies (ops/VIRAL-20-2026-11-06.md
 * items 1-3), computed from the rows of their published datasets. Pure: no
 * imports, no I/O. The pages call these on the rows in
 * src/data/researchStudies.ts; scripts/qa.mjs calls the same functions on
 * public/datasets/*.json and fails (RESEARCH-DRIFT) when a figure the page
 * prints differs from what the published file gives. So a number on a
 * research page is never typed by hand and cannot drift from the download.
 */

const DAY = 86400000;

/** Whole days from a to b (YYYY-MM-DD each). */
export function daysBetween(a, b) {
  const t = (d) => Date.UTC(Number(d.slice(0, 4)), Number(d.slice(5, 7)) - 1, Number(d.slice(8, 10)));
  return Math.round((t(b) - t(a)) / DAY);
}

/** YYYY-MM-DD minus n days. */
export function minusDays(d, n) {
  const t = Date.UTC(Number(d.slice(0, 4)), Number(d.slice(5, 7)) - 1, Number(d.slice(8, 10))) - n * DAY;
  return new Date(t).toISOString().slice(0, 10);
}

/** Median of a list of numbers; null for an empty list. */
export function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** A percentage with no decimals, as text ("12%"); "0%" for an empty base. */
export function pct(n, of) {
  return of ? `${Math.round((n / of) * 100)}%` : "0%";
}

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Oct 22, 2026" for 2026-10-22. */
export function fmtDay(d) {
  return `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}, ${d.slice(0, 4)}`;
}

const num = (x) => x.toLocaleString("en-US");

/* ───────────────────────────── 1. Docs drift ───────────────────────────── */

/**
 * items: the docs-drift dataset rows, one per group of evidence rows that
 * share a file, source, write commit and end (field `rows` counts them).
 * through: the date of the last commit the history was read to.
 */
export function driftStats(items, through, windows = [7, 14]) {
  const rows = sum(items.map((i) => i.rows));
  const sources = new Set(items.map((i) => i.source));
  const files = new Set(items.map((i) => i.file));
  const drift = items.filter((i) => i.cause === "source-changed");
  const driftRows = sum(drift.map((i) => i.rows));
  const events = new Map();
  for (const i of drift) {
    const k = `${i.endedCommit}\u0000${i.source}`;
    const e = events.get(k) ?? { commit: i.endedCommit, date: i.endedOn, source: i.source, kind: i.kind ?? null, rows: 0 };
    e.rows += i.rows;
    events.set(k, e);
  }
  const ev = [...events.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.source < b.source ? -1 : 1));
  const byCause = {};
  for (const i of items.filter((x) => x.endedOn)) byCause[i.cause] = (byCause[i.cause] ?? 0) + i.rows;
  const ended = sum(items.filter((i) => i.endedOn).map((i) => i.rows));

  const win = windows.map((n) => {
    const cutoff = minusDays(through, n);
    const eligible = items.filter((i) => i.writtenOn <= cutoff);
    const base = sum(eligible.map((i) => i.rows));
    const changed = sum(
      eligible.filter((i) => i.cause === "source-changed" && daysBetween(i.writtenOn, i.endedOn) <= n).map((i) => i.rows),
    );
    return { days: n, cutoff, base, changed, share: pct(changed, base) };
  });

  const ages = [];
  for (const i of drift) for (let k = 0; k < i.rows; k++) ages.push(daysBetween(i.writtenOn, i.endedOn));

  const kinds = { fact: 0, wording: 0, mixed: 0, "not stated": 0 };
  for (const e of ev) kinds[e.kind ?? "not stated"]++;

  const perSource = new Map();
  for (const i of items) {
    const s = perSource.get(i.source) ?? { source: i.source, rows: 0, driftRows: 0, driftEvents: 0 };
    s.rows += i.rows;
    if (i.cause === "source-changed") s.driftRows += i.rows;
    perSource.set(i.source, s);
  }
  for (const e of ev) perSource.get(e.source).driftEvents++;
  const bySource = [...perSource.values()]
    .filter((s) => s.driftEvents > 0)
    .sort((a, b) => b.driftEvents - a.driftEvents || b.driftRows - a.driftRows || (a.source < b.source ? -1 : 1));

  const byDate = new Map();
  for (const e of ev) {
    const d = byDate.get(e.commit) ?? { date: e.date, events: 0, rows: 0, commit: e.commit };
    d.events++;
    d.rows += e.rows;
    byDate.set(e.commit, d);
  }

  return {
    rows,
    sources: sources.size,
    files: files.size,
    ended,
    byCause,
    driftRows,
    driftEvents: ev.length,
    driftSources: bySource.length,
    driftCommits: new Set(ev.map((e) => e.commit)).size,
    windows: win,
    medianDaysToDrift: median(ages),
    kinds,
    events: ev,
    bySource,
    byDate: [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.commit < b.commit ? -1 : 1)),
  };
}

/* ─────────────────────────── 2. Shutdown notice ────────────────────────── */

/** items: the shutdown-notice dataset rows, one per graveyard entry. */
export function noticeStats(items) {
  const measured = items.filter((i) => typeof i.noticeDays === "number").sort((a, b) => a.noticeDays - b.noticeDays);
  const days = measured.map((i) => i.noticeDays);
  const reasons = {};
  for (const i of items.filter((x) => x.noticeDays === null)) reasons[i.exclusion] = (reasons[i.exclusion] ?? 0) + 1;
  return {
    entries: items.length,
    measured: measured.length,
    excluded: items.length - measured.length,
    median: median(days),
    min: days.length ? days[0] : null,
    max: days.length ? days[days.length - 1] : null,
    list: measured,
    reasons,
  };
}

/* ───────────────────────── 3. Pricing transparency ─────────────────────── */

export const PRICING_CLASS_ORDER = ["published-price", "no-published-price", "free"];

/** items: the pricing-transparency dataset rows, one per vendor. */
export function pricingStats(items) {
  const included = items.filter((i) => i.class);
  const byClass = Object.fromEntries(PRICING_CLASS_ORDER.map((c) => [c, included.filter((i) => i.class === c).length]));
  const cats = [...new Set(included.map((i) => i.category))];
  const byCategory = cats.map((c) => ({
    category: c,
    label: included.find((i) => i.category === c).categoryLabel,
    total: included.filter((i) => i.category === c).length,
    ...Object.fromEntries(PRICING_CLASS_ORDER.map((k) => [k, included.filter((i) => i.category === c && i.class === k).length])),
  }));
  const published = included.filter((i) => i.class === "published-price");
  return {
    vendors: items.length,
    included: included.length,
    excluded: items.length - included.length,
    byClass,
    byCategory,
    publishedWithUnpricedTier: published.filter((i) => i.unpricedTier).length,
    withFreeEntry: included.filter((i) => i.class !== "free" && i.freeEntry).length,
  };
}

/* ─────────────────────────────── Headlines ─────────────────────────────── */

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * The figures each page prints as its headline row, as text. qa recomputes
 * these from the published dataset files and compares them with the page's
 * data-research-stat elements, value for value.
 */
export function headlines(study, items, meta = {}) {
  if (study === "docs-drift") {
    const s = driftStats(items, meta.historyThrough);
    const w14 = s.windows.find((w) => w.days === 14);
    return [
      { id: "drift-events", value: String(s.driftEvents), label: `source changes under this site's quotes, counted once per host per commit, on ${plural(s.driftSources, "host")}` },
      { id: "drift-rows", value: `${num(s.driftRows)} of ${num(s.rows)}`, label: "evidence rows replaced because their source changed" },
      { id: "drift-14-days", value: w14.share, label: `of evidence rows written by ${fmtDay(w14.cutoff)} had their source change within 14 days` },
      { id: "drift-median-age", value: `${s.medianDaysToDrift} days`, label: "median age of an evidence row when its source changed" },
    ];
  }
  if (study === "shutdown-notice") {
    const s = noticeStats(items);
    return [
      { id: "notice-measured", value: `${s.measured} of ${s.entries}`, label: "graveyard entries with a dated vendor announcement and an end date to the day" },
      { id: "notice-median", value: s.median === null ? "none" : `${s.median} days`, label: "median notice between announcement and end" },
      { id: "notice-range", value: s.min === null ? "none" : `${s.min} to ${s.max} days`, label: "shortest and longest notice measured" },
    ];
  }
  if (study === "pricing-transparency") {
    const s = pricingStats(items);
    return [
      { id: "pricing-published", value: `${s.byClass["published-price"]} of ${s.included}`, label: "vendors publish a price for a paid developer plan" },
      { id: "pricing-unpublished", value: `${s.byClass["no-published-price"]} of ${s.included}`, label: "name a paid plan or commercial terms with no price" },
      { id: "pricing-free", value: `${s.byClass.free} of ${s.included}`, label: "say developer access costs nothing and name no paid plan" },
      { id: "pricing-custom-top", value: `${s.publishedWithUnpricedTier} of ${s.byClass["published-price"]}`, label: "price-publishing vendors also name a top tier with no price" },
    ];
  }
  throw new Error(`headlines: unknown study ${study}`);
}
