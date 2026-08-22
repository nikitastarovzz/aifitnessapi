import { accessibilityEntries } from "./accessibility.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * Cluster 21 — accessibility for fitness and health apps.
 *
 * WHY THIS CLUSTER EXISTS. Accessibility writing on the web is either generic
 * ("add alt text") or legal. Neither helps somebody building a workout screen,
 * because a fitness product breaks accessibility in ways a news site never
 * does: the user is moving, their hands are occupied, their eyes are on the
 * floor or the road, the phone is on a bike mount, music is already playing
 * through the only audio channel you have, and the number on screen changes
 * four times a second. Every page here is about one of those moments.
 *
 * BOUNDARY RULES, because five clusters are adjacent:
 * - /compliance owns law, regulation and store policy. This cluster is
 *   engineering guidance and says so; it makes no legal claims at all.
 * - /watch-apps owns building the watch app. Watch facts appear here only
 *   where the wrist changes the answer.
 * - /engagement owns notifications and re-engagement surfaces.
 * - /motion owns pose estimation and rep counting as algorithms.
 * - /test owns test strategy; the testing page here is accessibility-specific.
 *
 * EVIDENCE RULES (ops/GEO.md; enforced by the cluster verifier):
 * - Every platform claim traces to Apple's or Google's own documentation,
 *   fetched 2026-08-22 into the session fact sheet.
 * - NO WCAG citations anywhere. w3.org was unreachable from our research
 *   environment, so no criterion, level or number in that standard could be
 *   verified, and an unverifiable standards citation is worse than none.
 * - No legal or regulatory claims, and no statistics about disabled people:
 *   we had no primary source for either.
 * - Keep the platforms' own verbs. Apple writes "strive to meet"; Google
 *   writes "we recommend". Neither says "must", so neither do we.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const A11Y_PATH = "/accessibility";
export const A11Y_CONFIG: ClusterConfig = {
  basePath: A11Y_PATH,
  hubLabel: "Accessibility",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_A11Y = new Set<string>([
  "voiceover-live-workout-metrics",
  "talkback-workout-screens",
  "labelling-exercises-and-sets",
  "dynamic-type-workout-screens",
  "touch-targets-during-a-workout",
  "colour-contrast-outdoors",
  "reduced-motion-coaching-ui",
  "accessible-health-charts",
  "haptics-when-audio-is-busy",
  "captions-for-workout-video",
  "gestures-and-hands-free-control",
  "testing-accessibility-fitness-app",
]);

export const allAccessibility: ClusterEntry[] = accessibilityEntries;

export function releasedAccessibility(): ClusterEntry[] {
  return allAccessibility.filter((e) => RELEASED_A11Y.has(e.slug));
}

export function getAccessibility(slug: string): ClusterEntry | undefined {
  return releasedAccessibility().find((e) => e.slug === slug);
}
