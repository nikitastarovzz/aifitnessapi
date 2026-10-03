import { healthkitQueriesEntries } from "./healthkitQueries.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * Cluster 23 — HealthKit query classes, one per page.
 *
 * WHY THIS CLUSTER EXISTS. Search Console shows that exact developer strings —
 * a class name, a method signature — reach page one for this site where
 * generic phrasing does not. A developer stuck on HealthKit pastes
 * "HKStatisticsCollectionQuery" or "predicateForSamples(withStart:end:options:)"
 * into a search box, and the answer they need is narrow: how this one class
 * behaves and where it bites. Each page owns one class (or one tightly bound
 * pair, such as HKObserverQuery with enableBackgroundDelivery) and its
 * primaryQuery is that exact string.
 *
 * BOUNDARY RULES, because four clusters are adjacent:
 * - /integrate/healthkit owns setup: capability, Info.plist keys,
 *   entitlements and the authorization flow. Pages here link to it and do not
 *   repeat it.
 * - /fix owns error strings and "X is not working" diagnoses (background
 *   delivery not firing, no data, authorization denied, database
 *   inaccessible). Pages here explain the mechanism and link to the fix.
 * - /architecture and /cookbook own sync design and tested implementations
 *   (incremental sync, background sync, dedupe, day boundaries).
 * - /healthkit/<group> owns the identifiers; link rows as
 *   /healthkit/<group>#id-<lowercased case>.
 *   This cluster owns "how does class X work, and what are its traps".
 *
 * EVIDENCE RULES (ops/GEO.md, CLAUDE.md):
 * - Every claim traces to Apple's HealthKit documentation JSON fetched on
 *   2026-10-03 (class pages, initializers, handler properties and the
 *   "Executing ... Queries" articles). Quoted spans are Apple's words.
 * - Availability is the introducedAt in Apple's documentation data. Many
 *   older class pages carry none; the pages say so rather than supplying a
 *   version from memory.
 * - Where Apple's pages are silent (how a boundary-straddling sample counts
 *   in a sum, what isPaused means, how cancelling a descriptor's Task ends
 *   the query), the page says "Apple does not document" and stops.
 * - Swift sketches use only initializers and methods documented on those
 *   pages; helper calls such as apply() and save() are marked as your code.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const HKQ_PATH = "/healthkit-queries";
export const HKQ_CONFIG: ClusterConfig = {
  basePath: HKQ_PATH,
  hubLabel: "HealthKit Queries",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_HKQ = new Set<string>([
  "hksamplequery",
  "healthkit-query-predicates",
  "hkstatisticsquery",
  "hkstatisticscollectionquery",
  "hkanchoredobjectquery",
  "hkobserverquery-background-delivery",
  "healthkit-async-query-descriptors",
  "hkworkoutroutequery",
  "hkactivitysummaryquery",
]);

export const allHealthkitQueries: ClusterEntry[] = healthkitQueriesEntries;

export function releasedHealthkitQueries(): ClusterEntry[] {
  return allHealthkitQueries.filter((e) => RELEASED_HKQ.has(e.slug));
}

export function getHealthkitQuery(slug: string): ClusterEntry | undefined {
  return releasedHealthkitQueries().find((e) => e.slug === slug);
}
