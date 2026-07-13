/**
 * Cluster 6 — "What is <X>" concept explainers (informational/definitional).
 * The learn-the-term layer: definitional pages that feed the how-to and
 * comparison clusters. Reuses the shared cluster template; these are Article +
 * FAQPage (no `steps`, so no HowTo) — definition-first, not step-by-step.
 */
import { learnEntries } from "./learn.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const LEARN_PATH = "/learn";
export const LEARN_CONFIG = { basePath: LEARN_PATH, hubLabel: "Concepts" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_LEARN = new Set<string>([
  "what-is-a-fitness-api",
  "what-is-a-health-data-aggregator",
  "on-device-vs-cloud-health-data",
  "what-is-oauth-for-health-data",
  "what-are-webhooks",
  "what-is-pose-estimation",
  "what-is-hrv",
  "what-is-vo2-max",
  "what-are-sleep-stages",
  "how-fitness-apps-estimate-calories",
]);

export const allLearn: ClusterEntry[] = learnEntries;

export function releasedLearn(): ClusterEntry[] {
  return allLearn.filter((e) => RELEASED_LEARN.has(e.slug));
}

export function getLearn(slug: string): ClusterEntry | undefined {
  return releasedLearn().find((e) => e.slug === slug);
}
