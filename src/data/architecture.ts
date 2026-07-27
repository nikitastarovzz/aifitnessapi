/**
 * Cluster 15 — health data architecture. The stage after the integration
 * works: ingestion, reconciliation, storage, and data quality for multi-source
 * health data. The boundary that keeps this cluster honest is that every page
 * must be false or useless for a non-health app — if it would read the same
 * for an e-commerce backend, it does not belong here.
 * Article + FAQPage (no HowTo).
 */
import { architectureEntries } from "./architecture.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const ARCHITECTURE_PATH = "/architecture";
export const ARCHITECTURE_CONFIG: ClusterConfig = {
  basePath: ARCHITECTURE_PATH,
  hubLabel: "Architecture",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_ARCHITECTURE = new Set<string>([
  "incremental-sync",
  "historical-backfill",
  "background-sync",
  "webhook-ingestion",
  "identity-and-account-linking",
  "deduplicate-health-data",
  "normalize-wearable-data",
  "timezones-and-day-boundaries",
  "missing-data-and-gaps",
  "time-series-storage",
  "offline-first-conflict-resolution",
  "metric-versioning-and-recompute",
  "data-quality-monitoring",
  "data-deletion-and-export",
]);

export const allArchitecture: ClusterEntry[] = architectureEntries;

export function releasedArchitecture(): ClusterEntry[] {
  return allArchitecture.filter((e) => RELEASED_ARCHITECTURE.has(e.slug));
}

export function getArchitecture(slug: string): ClusterEntry | undefined {
  return releasedArchitecture().find((e) => e.slug === slug);
}
