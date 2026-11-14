import fs from "node:fs";
import path from "node:path";
import type { ClusterEntry } from "@/lib/cluster";

/**
 * "Key facts" for a money page (ops/NEXT-10-2026-11-04.md item 6): three to
 * five atomic lines an assistant can quote whole, each carrying a number and
 * a link to the page that states it.
 *
 * NOTHING here is written or inferred. A key fact is a row of the page's own
 * evidence file, `ops/sources/evidence/<cluster>-<slug>.json` — the
 * claim/url/quote records that `.github/workflows/source-quotes.yml`
 * re-checks against the live source on every pull request and every
 * Wednesday — and the line rendered is that row's `quote`: the source's own
 * words, verbatim. A row qualifies only when
 *
 * - its `url` is in the entry's `sources` (the pages the page's last full
 *   re-verification checked), so the fact is covered by the date the page
 *   shows — which also means a stale translation, whose sources list is
 *   dropped, shows none;
 * - its quote states a number — a digit that is not the tail of a word, so
 *   "Concept2" is a name, not a figure — since the point is a figure a
 *   reader can quote without paraphrasing;
 * - it is not a Wayback Machine capture (those quote what a vendor USED to
 *   say, which is history, not a current fact) and not the funder's own page
 *   (ops/GEO.md: KinesteX is never promoted, and its marketing is quoted as
 *   marketing in the body, where the context says so);
 * - it reads as a whole sentence: 6–40 words, opening with a capital or a
 *   digit and ending in . ! or ? — which keeps out table rows, headings and
 *   clauses cut from the middle of a sentence — and not leaning on the
 *   sentence before it ("It provides…", "Yes.", "After that…"), since a key
 *   fact is read alone.
 *
 * At most two rows per source URL, so one long price list cannot fill the
 * block, in the evidence file's order (which follows the page). Fewer than
 * three qualifying rows → no block at all. qa's KEY-FACTS-SOURCED re-reads
 * the evidence file and holds every rendered line to a row of it whose URL
 * is in the entry's sources.
 */

export const KEY_FACTS_CLUSTERS = [
  "/pricing",
  "/alternatives",
  "/compare",
  "/integrate",
  "/fix",
  "/fitness-apis",
  "/motion",
] as const;

export const KEY_FACTS_MIN = 3;
export const KEY_FACTS_MAX = 5;
const PER_URL = 2;
/** A digit not preceded by a letter: "1 and 4 weeks", "OAuth 2.0", not "Concept2". */
export const STATES_NUMBER = /(?<![A-Za-z])\d/;
/** Openings that only make sense after the sentence the source put before them. */
const LEANS_ON_CONTEXT = /^(It|Its|They|Their|This|These|That|Those|Yes|No|After that|Once|Then|However|But|And|Also)\b/;

export type KeyFact = { quote: string; url: string; host: string };
type EvidenceRow = { claim?: string; url?: string; quote?: string };

/** Same identity rule schema.ts uses for citations: no fragment, no trailing
 *  slash, and no `hl` language parameter. Evidence rows on Google hosts carry
 *  `?hl=en` so the checker is not redirected to a machine-translated edition
 *  (ops/MORE-20-2026-11-14.md item 4); the page's `sources` name the same
 *  document without it, and both are one source. */
export function urlKey(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    u.searchParams.delete("hl");
    return decodeURI(u.href).replace(/\/$/, "");
  } catch {
    return url;
  }
}

const EVIDENCE_DIR = path.join(process.cwd(), "ops/sources/evidence");

function readEvidence(enPath: string): EvidenceRow[] {
  const file = path.join(EVIDENCE_DIR, `${enPath.slice(1).replace("/", "-")}.json`);
  if (!fs.existsSync(file)) return [];
  const rows = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(rows) ? rows : [];
}

/**
 * The key facts for an English page path (`/<cluster>/<slug>`), given the
 * entry as rendered. Empty when the page is outside the money clusters, has
 * no evidence file, or fewer than KEY_FACTS_MIN rows qualify.
 */
export function keyFacts(enPath: string, entry: Pick<ClusterEntry, "sources">): KeyFact[] {
  const cluster = `/${enPath.split("/")[1]}`;
  if (!(KEY_FACTS_CLUSTERS as readonly string[]).includes(cluster)) return [];
  const sources = new Set((entry.sources ?? []).map((s) => urlKey(s.url)));
  if (sources.size === 0) return [];

  const out: KeyFact[] = [];
  const perUrl = new Map<string, number>();
  const seen = new Set<string>();
  for (const r of readEvidence(enPath)) {
    if (out.length >= KEY_FACTS_MAX) break;
    if (typeof r.url !== "string" || typeof r.quote !== "string") continue;
    const quote = r.quote.trim();
    const key = urlKey(r.url);
    let host: string;
    try {
      host = new URL(r.url).hostname.replace(/^www\./, "");
    } catch {
      continue;
    }
    if (!sources.has(key)) continue;
    if (host === "web.archive.org" || /(^|\.)kinestex\.com$/.test(host)) continue;
    if (!STATES_NUMBER.test(quote)) continue;
    const words = quote.split(/\s+/).length;
    if (words < 6 || words > 40 || !/^[A-Z0-9"“$€£]/.test(quote) || !/[.!?]["”)]?$/.test(quote)) continue;
    if (LEANS_ON_CONTEXT.test(quote)) continue;
    if (seen.has(quote)) continue;
    if ((perUrl.get(key) ?? 0) >= PER_URL) continue;
    seen.add(quote);
    perUrl.set(key, (perUrl.get(key) ?? 0) + 1);
    // Verbatim, less a dangling comma or semicolon where the quoted passage
    // stops mid-sentence (qa strips the same before comparing).
    out.push({ quote: quote.replace(/[,;:]$/, ""), url: r.url, host });
  }
  return out.length >= KEY_FACTS_MIN ? out : [];
}
