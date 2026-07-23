/**
 * Cluster 10 — "Fitness & health API pricing" (commercial / high-intent).
 * Per-product cost pages plus budgeting overviews. The honest angle: most
 * first-party wearable APIs are free to call; the real costs are aggregators,
 * content/nutrition APIs, user device/membership, and your own infra. Reuses the
 * shared cluster template; Article + FAQPage (no `steps`, no HowTo).
 */
import { pricingEntries } from "./pricing.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const PRICING_PATH = "/pricing";
export const PRICING_CONFIG = { basePath: PRICING_PATH, hubLabel: "Pricing" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_PRICING = new Set<string>([
  "fitbit-api-pricing",
  "garmin-api-pricing",
  "strava-api-pricing",
  "oura-api-pricing",
  "whoop-api-pricing",
  "health-data-aggregator-pricing",
  "nutrition-api-pricing",
  "exercise-database-api-pricing",
  "are-fitness-apis-free",
  "how-much-does-a-fitness-api-cost",
]);

export const allPricing: ClusterEntry[] = pricingEntries;

export function releasedPricing(): ClusterEntry[] {
  return allPricing.filter((e) => RELEASED_PRICING.has(e.slug));
}

export function getPricing(slug: string): ClusterEntry | undefined {
  return releasedPricing().find((e) => e.slug === slug);
}
