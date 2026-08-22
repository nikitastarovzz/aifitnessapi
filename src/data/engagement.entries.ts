import type { ClusterEntry } from "@/lib/cluster";

/**
 * Engagement-cluster entries. Platform claims (ActivityKit, WidgetKit,
 * GameKit, notification authorization, POST_NOTIFICATIONS, Wear OS Ongoing
 * Activity, Play Games leaderboards, Glance) are verified against Apple's and
 * Google's own documentation. No engagement or retention figures appear
 * anywhere in this cluster by policy — see the header of ./engagement.ts.
 */
export const engagementEntries: ClusterEntry[] = [];
