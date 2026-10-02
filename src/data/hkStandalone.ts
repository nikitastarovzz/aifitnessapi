/**
 * Standalone HealthKit reference pages — one URL each, outside the
 * /healthkit/<group> set.
 *
 * These five pages slice the generated identifier dataset along axes Apple
 * never publishes as a set: by iOS version introduced, by documentation
 * status, by category value enum, by unit family, and against Health
 * Connect. Each answers a question the per-identifier reference cannot,
 * which is the only reason a page here earns a URL.
 *
 * Same split as the group pages: the derived half (the tables) is computed
 * from the generated dataset at render time so it cannot drift, and the
 * authored half (intro, traps, FAQs) lives in hkStandalone.entries.ts. A
 * page with no entry calls notFound() rather than shipping a table with no
 * synthesis around it — a bare dump of generated rows is exactly the thin
 * content this site refuses to publish.
 *
 * The type is deliberately duplicated from HkGroupEntry rather than shared:
 * these pages have their own lifecycle, and a shared type would couple two
 * page sets that only happen to look alike today.
 */
import { hkStandaloneEntries } from "./hkStandalone.entries";

export type HkStandaloneEntry = {
  slug: string;
  /** ≤45 chars — the layout appends the site suffix. */
  title: string;
  metaDescription: string;
  primaryQuery: string;
  /**
   * The date of the data this page renders — never the writing date, never
   * later than its source. For the four pages sliced from Apple's corpus
   * that is the HK_FETCHED_ON their numbers were checked against. For
   * health-connect-records it is the date the matrix rows were verified
   * against both platforms' documentation (2026-07-26, matrix.ts's only
   * commit, which is also the /matrix page's stamp), because those rows are
   * what the page renders. A literal "YYYY-MM-DD" in the entries file:
   * stale-report parses it with a regex, not an import.
   */
  updated: string;
  /** Markdown. The synthesis above the derived table. */
  intro: string;
  /** Markdown. Rendered under "What will bite you". */
  traps: string;
  faqs: { q: string; a: string }[];
};

/**
 * The pages' own dates, as distinct from the data date in `updated`.
 *
 * All five were first published in 35bc67c on 2026-09-04, after the data
 * each renders was read, and their content did not change again until the
 * 2026-10-02 corpus re-read (earlier edits added the age display and these
 * stamps, not claims). Putting
 * `updated` in dateModified would say a page changed before it existed, and
 * lifting it to the publish date with a max() would be a rule for
 * manufacturing freshness.
 * So structured data and the sitemap carry these, and the reader sees the
 * data date with its age beside it. When a page's content changes, give it
 * its own date in HK_STANDALONE_MODIFIED_BY_SLUG rather than moving this
 * shared one; a re-verification that changes nothing moves `updated` only.
 */
export const HK_STANDALONE_PUBLISHED = "2026-09-04";
export const HK_STANDALONE_MODIFIED = "2026-09-04";

/**
 * Pages whose authored content changed after HK_STANDALONE_MODIFIED.
 * 2026-10-02: the corpus re-read added heartRateVariabilityRMSSD and cleared
 * the two iOS 27.0 beta flags, which four pages' prose contradicted; the same
 * day the generator began reading Apple's `deprecatedAt`, and healthkit-status
 * was rewritten around the four deprecated identifiers it found.
 * health-connect-records' prose did not change.
 */
const HK_STANDALONE_MODIFIED_BY_SLUG: Record<string, string> = {
  "healthkit-versions": "2026-10-02",
  "healthkit-status": "2026-10-02",
  "healthkit-category-values": "2026-10-02",
  "healthkit-units": "2026-10-02",
};

/** A standalone page's own dateModified (JSON-LD and sitemap use this, never `updated`). */
export function hkStandaloneModified(slug: string): string {
  return HK_STANDALONE_MODIFIED_BY_SLUG[slug] ?? HK_STANDALONE_MODIFIED;
}

/** The authored entry for a standalone page, or undefined when unwritten. */
export function getStandalone(slug: string): HkStandaloneEntry | undefined {
  return hkStandaloneEntries.find((e) => e.slug === slug);
}
