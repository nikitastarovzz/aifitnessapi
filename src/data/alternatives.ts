/**
 * Cluster 7 — "[Product] alternatives" (commercial/decision, anchored on one
 * product). Why you'd replace X, the realistic alternatives, and which fits —
 * links to the /fitness-apis comparisons rather than duplicating them. Reuses
 * the shared cluster template; Article + FAQPage (no `steps`, no HowTo).
 */
import { alternativesEntries } from "./alternatives.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const ALTERNATIVES_PATH = "/alternatives";
export const ALTERNATIVES_CONFIG = { basePath: ALTERNATIVES_PATH, hubLabel: "Alternatives" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_ALTERNATIVES = new Set<string>([
  "fitbit-api-alternatives",
  "google-fit-api-alternatives",
  "garmin-api-alternatives",
  "strava-api-alternatives",
  "oura-api-alternatives",
  "whoop-api-alternatives",
  "healthkit-alternatives",
  "terra-alternatives",
  "nutritionix-alternatives",
  "exercisedb-alternatives",
]);

export const allAlternatives: ClusterEntry[] = alternativesEntries;

export function releasedAlternatives(): ClusterEntry[] {
  return allAlternatives.filter((e) => RELEASED_ALTERNATIVES.has(e.slug));
}

export function getAlternative(slug: string): ClusterEntry | undefined {
  return releasedAlternatives().find((e) => e.slug === slug);
}
