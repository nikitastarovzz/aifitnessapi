/**
 * Cluster 9 — "How to migrate from [X] to [Y]" (procedural / high-intent).
 * Step-by-step playbooks for moving an existing fitness/health integration:
 * field mapping, historical data, user re-consent, and cut-over. Reuses the
 * shared cluster template; Article + HowTo (`steps`) + FAQPage. Links to the
 * /alternatives decision and /integrate target guide rather than duplicating.
 */
import { migrateEntries } from "./migrate.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const MIGRATE_PATH = "/migrate";
export const MIGRATE_CONFIG = { basePath: MIGRATE_PATH, hubLabel: "Migrations" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_MIGRATE = new Set<string>([
  "google-fit-to-health-connect",
  "fitbit-web-api-to-google-health",
  "add-android-to-healthkit-app",
  "consolidate-wearables-with-aggregator",
  "aggregator-to-direct-integration",
  "between-health-data-aggregators",
  "polling-to-webhooks",
  "adapt-to-strava-api-changes",
  "keep-users-connected-during-migration",
  "migrate-off-a-deprecated-fitness-api",
]);

export const allMigrate: ClusterEntry[] = migrateEntries;

export function releasedMigrate(): ClusterEntry[] {
  return allMigrate.filter((e) => RELEASED_MIGRATE.has(e.slug));
}

export function getMigration(slug: string): ClusterEntry | undefined {
  return releasedMigrate().find((e) => e.slug === slug);
}
