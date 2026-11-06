/**
 * The pure half of the weekly roundup (/weekly, ops/VIRAL-20-2026-11-06.md
 * item 9): ISO weeks and the bucketing rule. src/lib/weekly.ts gathers the
 * dated records from the data modules and hands them here;
 * scripts/weekly.test.mjs tests this file directly.
 *
 * Rules this file keeps:
 * - A record is placed in a week only when its source dates it to the day.
 *   "2026-10" or "2026" cannot be put in a week without sharpening it, so
 *   those records stay in the monthly digest and the tracker and are left
 *   out here — never moved to a guessed day.
 * - Nothing dated after the build day is placed: a roundup reports what
 *   happened, and a scheduled date belongs to the countdowns.
 * - A week gets a page only with WEEKLY_MIN_ITEMS records, at least one of
 *   them from the ecosystem (a change, a graveyard date or a release). A week
 *   that is only this site's own new pages is site news, not a roundup.
 */

export const WEEKLY_MIN_ITEMS = 3;

/** The kinds of record a week can hold, in the order a week prints them. */
export const WEEKLY_KINDS = ["change", "graveyard", "release", "page"];

const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function isDay(d) {
  return typeof d === "string" && DAY.test(d) && !Number.isNaN(Date.parse(`${d}T00:00:00Z`));
}

const toDate = (d) => new Date(`${d}T00:00:00Z`);
const iso = (t) => t.toISOString().slice(0, 10);

/**
 * ISO 8601 week of a day: weeks start on Monday and week 1 holds the year's
 * first Thursday, so 2026-01-01 (a Thursday) is in 2026-W01 and 2027-01-01
 * (a Friday) is in 2026-W53.
 * @returns {{ year: number, week: number, id: string }} id is "2026-w45"
 */
export function isoWeek(day) {
  if (!isDay(day)) throw new Error(`isoWeek: not a day: ${day}`);
  const t = toDate(day);
  const dow = (t.getUTCDay() + 6) % 7; // Monday = 0
  t.setUTCDate(t.getUTCDate() - dow + 3); // the Thursday of this week
  const year = t.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Thu = new Date(jan4);
  jan4Thu.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7) + 3);
  const week = 1 + Math.round((t.getTime() - jan4Thu.getTime()) / (7 * 86_400_000));
  return { year, week, id: `${year}-w${String(week).padStart(2, "0")}` };
}

/** "2026-w45" → { start: Monday, end: Sunday }, both "YYYY-MM-DD". */
export function weekBounds(id) {
  const m = /^(\d{4})-w(\d{2})$/.exec(id);
  if (!m) throw new Error(`weekBounds: not a week id: ${id}`);
  const year = Number(m[1]);
  const week = Number(m[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const monday1 = new Date(jan4);
  monday1.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const start = new Date(monday1);
  start.setUTCDate(monday1.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const out = { start: iso(start), end: iso(end) };
  if (isoWeek(out.start).id !== id) throw new Error(`weekBounds: ${id} does not exist`);
  return out;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (d) => {
  const [y, m, day] = d.split("-");
  return { y, m: MONTHS[Number(m) - 1], d: Number(day) };
};

/** "Nov 2–8, 2026", "Sep 28 – Oct 4, 2026", "Dec 28, 2026 – Jan 3, 2027". */
export function weekRangeLabel(id) {
  const { start, end } = weekBounds(id);
  const a = fmt(start);
  const b = fmt(end);
  if (a.y !== b.y) return `${a.m} ${a.d}, ${a.y} – ${b.m} ${b.d}, ${b.y}`;
  if (a.m !== b.m) return `${a.m} ${a.d} – ${b.m} ${b.d}, ${b.y}`;
  return `${a.m} ${a.d}–${b.d}, ${b.y}`;
}

/** "2026-w45" → "Week 45, 2026". */
export function weekLabel(id) {
  const m = /^(\d{4})-w(\d{2})$/.exec(id);
  if (!m) throw new Error(`weekLabel: not a week id: ${id}`);
  return `Week ${Number(m[2])}, ${m[1]}`;
}

/**
 * Buckets dated records into ISO weeks.
 *
 * @param {{ kind: string, date: string, key: string }[]} items  every record, any precision
 * @param {string} asOf  the build day; later records are not placed
 * @returns {{ id: string, start: string, end: string, inProgress: boolean, items: object[], counts: Record<string, number> }[]}
 *          weeks that qualify, newest first; items newest first, then by kind order
 */
export function buildWeeks(items, asOf) {
  if (!isDay(asOf)) throw new Error(`buildWeeks: asOf is not a day: ${asOf}`);
  const byWeek = new Map();
  const seen = new Set();
  for (const it of items) {
    if (!WEEKLY_KINDS.includes(it.kind)) throw new Error(`buildWeeks: unknown kind ${it.kind}`);
    if (!isDay(it.date) || it.date > asOf) continue;
    if (seen.has(it.key)) continue;
    seen.add(it.key);
    const id = isoWeek(it.date).id;
    const list = byWeek.get(id) ?? [];
    list.push(it);
    byWeek.set(id, list);
  }
  const order = (k) => WEEKLY_KINDS.indexOf(k);
  const weeks = [];
  for (const [id, list] of byWeek) {
    const ecosystem = list.filter((i) => i.kind !== "page").length;
    if (list.length < WEEKLY_MIN_ITEMS || ecosystem === 0) continue;
    list.sort((a, b) => order(a.kind) - order(b.kind) || (a.date < b.date ? 1 : a.date > b.date ? -1 : 0) || a.key.localeCompare(b.key));
    const counts = Object.fromEntries(WEEKLY_KINDS.map((k) => [k, list.filter((i) => i.kind === k).length]));
    const { start, end } = weekBounds(id);
    weeks.push({ id, start, end, inProgress: end > asOf, items: list, counts });
  }
  return weeks.sort((a, b) => (a.id < b.id ? 1 : -1));
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The one-line summary: the page description, the feed item and the OG line. */
export function weekSummaryParts(counts) {
  const parts = [];
  if (counts.change) parts.push(plural(counts.change, "tracked change"));
  if (counts.graveyard) parts.push(plural(counts.graveyard, "graveyard date"));
  if (counts.release) parts.push(plural(counts.release, "SDK or library release"));
  if (counts.page) parts.push(plural(counts.page, "new page"));
  return parts;
}

export function joinList(xs) {
  return xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`;
}
