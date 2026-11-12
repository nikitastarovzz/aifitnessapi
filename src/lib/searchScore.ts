/**
 * One implementation of search relevance, shared by the ⌘K palette and the
 * /search page so the two can never disagree about what the best answer is.
 * Pure functions — no React, no DOM beyond the fetch in `reportMiss`.
 */
export type Rec = [
  path: string,
  title: string,
  desc: string,
  extra: string,
  kind?: string,
];

export function scoreRec(rec: Rec, tokens: string[]): number {
  const title = rec[1].toLowerCase();
  const desc = rec[2].toLowerCase();
  const extra = (rec[3] ?? "").toLowerCase();
  let total = 0;
  for (const t of tokens) {
    if (title.includes(t)) total += title.startsWith(t) ? 5 : 3;
    else if (extra.includes(t)) total += 2;
    else if (desc.includes(t)) total += 1;
    else return 0; // every token must match somewhere
  }
  // A question that literally asks what was typed is usually the answer.
  return rec[4] === "faq" ? total + 1 : total;
}

/**
 * Report a query that found nothing. A miss is the most specific content
 * request a reader can make, so the words are worth keeping — and only the
 * words: the endpoint stores the query and a timestamp, nothing else.
 */
export function reportMiss(q: string) {
  if (q.trim().length < 3) return;
  void fetch("/api/search-miss", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ q: q.trim().slice(0, 120) }),
  }).catch(() => {
    /* best effort — a reader never sees this fail */
  });
}

/**
 * Postel's law, the robustness principle: be liberal in what you accept.
 * Turn what a reader typed into tokens the scorer can match, instead of
 * requiring them to type the way the index is written. "health-connect",
 * "HealthKit?", "sleep/HRV" and "Garmin's API" all match their pages; before
 * 2026-11-12 the hyphen, the question mark, the slash and the possessive each
 * made the query match nothing.
 */
export function queryTokens(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[’']s\b/g, "")
    .replace(/[\u2010-\u2015\-_/\\,;:!?()[\]{}"“”'’`|<>]+/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter(Boolean);
}

/** Optimal string alignment distance (Levenshtein plus adjacent swaps),
 *  stopping early once it cannot come in at or under `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev2: number[] = new Array(b.length + 1).fill(0);
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev2[j] = prev[j];
    prev = cur;
  }
  return prev[b.length];
}

/** How many typos a token may carry: none under four letters (too many
 *  short words sit one letter apart), one up to seven, two from eight. */
function allowedTypos(t: string): number {
  return t.length < 4 ? 0 : t.length < 8 ? 1 : 2;
}

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/**
 * The typo pass, reached only when no record matches plainly. Every token
 * must still land somewhere: exactly as a substring (scored as scoreRec
 * does), or within its allowed edit distance of a whole word, swapped
 * letters included ("helathkit", "graamin", "webhok"). A typo hit scores
 * below an exact hit in the same field, so a correctly spelled match always
 * wins.
 */
export function typoScore(rec: Rec, tokens: string[]): number {
  const title = rec[1].toLowerCase();
  const extra = (rec[3] ?? "").toLowerCase();
  const desc = rec[2].toLowerCase();
  let titleWords: string[] | null = null;
  let extraWords: string[] | null = null;
  let total = 0;
  let typos = 0;
  for (const t of tokens) {
    if (title.includes(t)) {
      total += 3;
      continue;
    }
    if (extra.includes(t)) {
      total += 2;
      continue;
    }
    if (desc.includes(t)) {
      total += 1;
      continue;
    }
    const max = allowedTypos(t);
    if (max === 0) return 0;
    titleWords ??= words(title);
    if (titleWords.some((w) => editDistance(t, w, max) <= max)) {
      total += 2;
      typos++;
      continue;
    }
    extraWords ??= words(extra);
    if (extraWords.some((w) => editDistance(t, w, max) <= max)) {
      total += 1;
      typos++;
      continue;
    }
    return 0;
  }
  // Among equally close typo hits, a page outranks an FAQ answer inside one:
  // a misspelled single word is far more often a topic than a question.
  return typos > 0 ? total + (rec[4] === "faq" ? 0 : 0.5) : 0;
}
