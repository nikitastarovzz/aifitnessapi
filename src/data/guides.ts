/**
 * Cluster 2 — "How to add AI workout tracking to your app" (developer how-to).
 * Reuses the shared cluster template/route/schema; how-to pages carry `steps`
 * for HowTo JSON-LD.
 */
import { guideEntries } from "./guides.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const GUIDES_PATH = "/guides";
export const GUIDES_CONFIG = { basePath: GUIDES_PATH, hubLabel: "Guides" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_GUIDES = new Set<string>([
  "add-rep-counting",
  "add-form-feedback",
  "camera-pose-tracking",
  "track-workouts-without-wearables",
  "ai-workout-tracking-ios-swift",
  "ai-workout-tracking-android-kotlin",
  "ai-workout-tracking-react-native",
  "ai-workout-tracking-flutter",
  "ai-workout-tracking-web",
  "improve-pose-detection-accuracy",
]);

export const allGuides: ClusterEntry[] = guideEntries;

export function releasedGuides(): ClusterEntry[] {
  return allGuides.filter((e) => RELEASED_GUIDES.has(e.slug));
}

export function getGuide(slug: string): ClusterEntry | undefined {
  return releasedGuides().find((e) => e.slug === slug);
}
