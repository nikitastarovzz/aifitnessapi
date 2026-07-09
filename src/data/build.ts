/**
 * Cluster 3 — "How to build a workout app" (use-case / app-type guides).
 * Product-build guides: define scope, pick features, choose APIs (links into the
 * fitness-apis + guides clusters for the pieces), ship an MVP. Reuses the shared
 * cluster template/route/schema; each guide carries `steps` (a build roadmap) for
 * HowTo JSON-LD.
 */
import { buildEntries } from "./build.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const BUILD_PATH = "/build";
export const BUILD_CONFIG = { basePath: BUILD_PATH, hubLabel: "Build Guides" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_BUILD = new Set<string>([
  "personal-training-app",
  "home-workout-app",
  "ai-fitness-coaching-app",
  "rehab-physical-therapy-app",
  "yoga-app",
  "corporate-wellness-app",
  "strength-training-app",
  "running-app",
  "nutrition-tracking-app",
  "fitness-app-tech-stack",
]);

export const allBuilds: ClusterEntry[] = buildEntries;

export function releasedBuilds(): ClusterEntry[] {
  return allBuilds.filter((e) => RELEASED_BUILD.has(e.slug));
}

export function getBuild(slug: string): ClusterEntry | undefined {
  return releasedBuilds().find((e) => e.slug === slug);
}
