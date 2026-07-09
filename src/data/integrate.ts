/**
 * Cluster 4 — "How to integrate <provider>" (per-provider integration tutorials).
 * The funnel middle: you've picked an API (see /fitness-apis) — now connect it.
 * OAuth/auth setup, fetching data, webhooks/refresh, per provider. Reuses the
 * shared cluster template/route/schema; each guide carries `steps` (HowTo).
 */
import { integrateEntries } from "./integrate.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const INTEGRATE_PATH = "/integrate";
export const INTEGRATE_CONFIG = { basePath: INTEGRATE_PATH, hubLabel: "Integration Guides" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_INTEGRATE = new Set<string>([
  "healthkit",
  "google-health-connect",
  "fitbit-api",
  "strava-api",
  "garmin-api",
  "oura-api",
  "whoop-api",
  "terra-api",
  "nutritionix-api",
  "exercisedb-api",
]);

export const allIntegrations: ClusterEntry[] = integrateEntries;

export function releasedIntegrations(): ClusterEntry[] {
  return allIntegrations.filter((e) => RELEASED_INTEGRATE.has(e.slug));
}

export function getIntegration(slug: string): ClusterEntry | undefined {
  return releasedIntegrations().find((e) => e.slug === slug);
}
