/**
 * Cluster 11 — "X vs Y" developer comparisons (commercial / decision). Two
 * products head-to-head through the API/developer lens: what data each exposes,
 * the API access model, cost, and which fits which build. Distinct from
 * /alternatives (anchored on replacing one product). Reuses the shared cluster
 * template; Article + FAQPage (no `steps`, no HowTo).
 */
import { compareEntries } from "./compare.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const COMPARE_PATH = "/compare";
export const COMPARE_CONFIG = { basePath: COMPARE_PATH, hubLabel: "Comparisons" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_COMPARE = new Set<string>([
  "oura-vs-whoop",
  "fitbit-vs-apple-watch",
  "strava-vs-garmin-connect",
  "fitbit-vs-oura",
  "whoop-vs-garmin",
  "terra-vs-rook",
  "terra-vs-spike",
  "nutritionix-vs-edamam",
  "edamam-vs-spoonacular",
  "exercisedb-vs-wger",
]);

export const allCompare: ClusterEntry[] = compareEntries;

export function releasedCompare(): ClusterEntry[] {
  return allCompare.filter((e) => RELEASED_COMPARE.has(e.slug));
}

export function getComparison(slug: string): ClusterEntry | undefined {
  return releasedCompare().find((e) => e.slug === slug);
}
