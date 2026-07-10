/**
 * Cluster 5 — "Fitness & health API troubleshooting" (conversational/error-first).
 * Symptom -> likely causes -> fix, for the errors builders actually hit. The
 * failure-side companion to /integrate. Reuses the shared cluster template; each
 * page carries `steps` (a fix checklist) for HowTo JSON-LD.
 */
import { fixEntries } from "./fix.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const FIX_PATH = "/fix";
export const FIX_CONFIG = { basePath: FIX_PATH, hubLabel: "Troubleshooting" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_FIX = new Set<string>([
  "fitbit-api-429-rate-limit",
  "healthkit-no-data",
  "strava-webhook-not-firing",
  "fitness-api-401-unauthorized",
  "oauth-redirect-uri-mismatch",
  "google-fit-api-deprecated",
  "health-connect-no-data",
  "wearable-data-delayed",
  "garmin-api-approval",
  "refresh-token-not-working",
]);

export const allFixes: ClusterEntry[] = fixEntries;

export function releasedFixes(): ClusterEntry[] {
  return allFixes.filter((e) => RELEASED_FIX.has(e.slug));
}

export function getFix(slug: string): ClusterEntry | undefined {
  return releasedFixes().find((e) => e.slug === slug);
}
