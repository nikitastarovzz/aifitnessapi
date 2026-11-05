/**
 * Cluster 17 — Cookbook (see cookbook.entries.ts header for the boundary
 * rule). Article + FAQPage; no HowTo steps — the code is the procedure.
 */
import { cookbookEntries } from "./cookbook.entries";
import { cookbookIntegratorEntries } from "./cookbook.integrator.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const COOKBOOK_PATH = "/cookbook";
export const COOKBOOK_CONFIG = { basePath: COOKBOOK_PATH, hubLabel: "Cookbook" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_COOKBOOK = new Set<string>([
  "refresh-rotation",
  "webhook-receiver",
  "rate-limit-fetcher",
  "day-boundary-rollup",
  "rep-counter",
  "backfill-checkpointer",
  "dedupe-health-samples",
  "incremental-sync-anchor",
  // Integrator recipes (ops/AUDIENCE-30-2026-11-05.md item 9).
  "vendor-webhook-signatures",
  "webhook-handshakes",
  "cursor-pagination",
  "multi-window-rate-pacer",
  "pkce-authorize-url",
  "token-vault",
  "workout-type-crosswalk",
  "health-connect-error-policy",
  "ble-heart-rate-parser",
  "withings-notification-router",
]);

export const allCookbook: ClusterEntry[] = [...cookbookEntries, ...cookbookIntegratorEntries];

export function releasedCookbook(): ClusterEntry[] {
  return allCookbook.filter((e) => RELEASED_COOKBOOK.has(e.slug));
}

export function getRecipe(slug: string): ClusterEntry | undefined {
  return releasedCookbook().find((e) => e.slug === slug);
}
