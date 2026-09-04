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
  /** Markdown. The synthesis above the derived table. */
  intro: string;
  /** Markdown. Rendered under "What will bite you". */
  traps: string;
  faqs: { q: string; a: string }[];
};

/** The authored entry for a standalone page, or undefined when unwritten. */
export function getStandalone(slug: string): HkStandaloneEntry | undefined {
  return hkStandaloneEntries.find((e) => e.slug === slug);
}
