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
