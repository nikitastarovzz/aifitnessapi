/**
 * Cluster 16 — testing health and fitness apps. The assertion layer: /fix is
 * "it is broken now", /architecture is "a design that prevents a class of
 * breakage", and this cluster is "the test that proves the design holds".
 *
 * Boundary rule: every page must name the specific health-or-camera failure it
 * exists to catch, and must be worthless to a team with no sensor, no camera
 * and no third-party health provider. Generic testing content is mature and
 * excellent; we link to it rather than re-explaining it.
 * Article + FAQPage (no HowTo).
 */
import { testingEntries } from "./testing.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const TEST_PATH = "/test";
export const TEST_CONFIG: ClusterConfig = { basePath: TEST_PATH, hubLabel: "Testing" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_TEST = new Set<string>([
  "healthkit-integration",
  "health-connect-test-data",
  "mock-wearable-data",
  "background-sync",
  "oauth-flows",
  "provider-sandboxes",
  "webhooks-locally",
  "rate-limits-and-outages",
  "camera-features-without-a-device",
  "pose-detection-accuracy",
  "rep-counting",
  "device-lab-and-ci",
  "offline-sync",
  "data-deletion",
]);

export const allTesting: ClusterEntry[] = testingEntries;

export function releasedTesting(): ClusterEntry[] {
  return allTesting.filter((e) => RELEASED_TEST.has(e.slug));
}

export function getTesting(slug: string): ClusterEntry | undefined {
  return releasedTesting().find((e) => e.slug === slug);
}
