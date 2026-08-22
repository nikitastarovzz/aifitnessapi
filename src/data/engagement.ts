import { engagementEntries } from "./engagement.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * Cluster 19 — engagement and retention for fitness apps. The layer after the
 * integration works and the data is correct: whether anyone comes back.
 *
 * Boundary rule: general growth and CRM content is mature and abundant, so
 * every page here must be anchored in something fitness-specific — a workout
 * session on the wrist, a streak that has to survive a DST day, a leaderboard
 * constrained by a provider's display terms, a camera coach that gives
 * feedback mid-rep. A page that would read identically for a to-do app does
 * not belong in this cluster.
 *
 * Evidence rule (stricter than the site default): no engagement or retention
 * percentages, from anyone. No public dataset ranks fitness SDKs by retention
 * lift, and vendor case studies are marketing. Pages describe mechanisms and
 * teach measurement with a holdout instead of quoting outcomes.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const ENGAGEMENT_PATH = "/engagement";
export const ENGAGEMENT_CONFIG: ClusterConfig = {
  basePath: ENGAGEMENT_PATH,
  hubLabel: "Engagement & Retention",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_ENGAGEMENT = new Set<string>([
  "push-notifications-fitness-app",
  "live-activities-workout-tracking",
  "widgets-and-complications",
  "wear-os-ongoing-activity",
  "engagement-sdks-compared",
  "streaks-and-habit-loops",
  "leaderboards-and-challenges",
  "social-features-fitness-app",
  "gamification-in-fitness-apps",
  "camera-coaching-engagement",
  "measuring-retention-fitness-app",
  "ab-testing-engagement-features",
  "engagement-metrics-that-matter",
  "notification-fatigue-and-optout",
]);

export const allEngagement: ClusterEntry[] = engagementEntries;

export function releasedEngagement(): ClusterEntry[] {
  return allEngagement.filter((e) => RELEASED_ENGAGEMENT.has(e.slug));
}

export function getEngagement(slug: string): ClusterEntry | undefined {
  return releasedEngagement().find((e) => e.slug === slug);
}
