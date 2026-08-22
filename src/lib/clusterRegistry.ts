import type { ClusterEntry } from "./cluster";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";
import { releasedGuides, GUIDES_PATH } from "@/data/guides";
import { releasedBuilds, BUILD_PATH } from "@/data/build";
import { releasedIntegrations, INTEGRATE_PATH } from "@/data/integrate";
import { releasedFixes, FIX_PATH } from "@/data/fix";
import { releasedLearn, LEARN_PATH } from "@/data/learn";
import { releasedAlternatives, ALTERNATIVES_PATH } from "@/data/alternatives";
import { releasedCompliance, COMPLIANCE_PATH } from "@/data/compliance";
import { releasedMigrate, MIGRATE_PATH } from "@/data/migrate";
import { releasedPricing, PRICING_PATH } from "@/data/pricing";
import { releasedCompare, COMPARE_PATH } from "@/data/compare";
import { releasedData, DATA_PATH } from "@/data/healthData";
import { releasedMotion, MOTION_PATH } from "@/data/motion";
import { releasedAi, AI_PATH } from "@/data/ai";
import { releasedArchitecture, ARCHITECTURE_PATH } from "@/data/architecture";
import { releasedTesting, TEST_PATH } from "@/data/testing";
import { releasedCookbook, COOKBOOK_PATH } from "@/data/cookbook";
import { releasedDevices, DEVICES_PATH } from "@/data/devices";
import { releasedEngagement, ENGAGEMENT_PATH } from "@/data/engagement";
import { releasedWatchApps, WATCH_PATH } from "@/data/watchApps";
import { releasedAccessibility, A11Y_PATH } from "@/data/accessibility";
import { FITNESS_APIS_CONFIG } from "@/data/fitnessApis";
import { GUIDES_CONFIG } from "@/data/guides";
import { BUILD_CONFIG } from "@/data/build";
import { INTEGRATE_CONFIG } from "@/data/integrate";
import { FIX_CONFIG } from "@/data/fix";
import { LEARN_CONFIG } from "@/data/learn";
import { ALTERNATIVES_CONFIG } from "@/data/alternatives";
import { COMPLIANCE_CONFIG } from "@/data/compliance";
import { MIGRATE_CONFIG } from "@/data/migrate";
import { PRICING_CONFIG } from "@/data/pricing";
import { COMPARE_CONFIG } from "@/data/compare";
import { DATA_CONFIG } from "@/data/healthData";
import { MOTION_CONFIG } from "@/data/motion";
import { AI_CONFIG } from "@/data/ai";
import { ARCHITECTURE_CONFIG } from "@/data/architecture";
import { TEST_CONFIG } from "@/data/testing";
import { COOKBOOK_CONFIG } from "@/data/cookbook";
import { DEVICES_CONFIG } from "@/data/devices";
import { ENGAGEMENT_CONFIG } from "@/data/engagement";
import { WATCH_CONFIG } from "@/data/watchApps";
import { A11Y_CONFIG } from "@/data/accessibility";

/**
 * basePath → released entries, for anything that needs to see a cluster's
 * siblings without threading them through 16 route files (prev/next nav,
 * the search index's future needs). Server-side only.
 */
const REGISTRY: Record<string, () => ClusterEntry[]> = {
  [PILLAR_PATH]: releasedEntries,
  [GUIDES_PATH]: releasedGuides,
  [BUILD_PATH]: releasedBuilds,
  [INTEGRATE_PATH]: releasedIntegrations,
  [FIX_PATH]: releasedFixes,
  [LEARN_PATH]: releasedLearn,
  [ALTERNATIVES_PATH]: releasedAlternatives,
  [COMPLIANCE_PATH]: releasedCompliance,
  [MIGRATE_PATH]: releasedMigrate,
  [PRICING_PATH]: releasedPricing,
  [COMPARE_PATH]: releasedCompare,
  [DATA_PATH]: releasedData,
  [MOTION_PATH]: releasedMotion,
  [AI_PATH]: releasedAi,
  [ARCHITECTURE_PATH]: releasedArchitecture,
  [TEST_PATH]: releasedTesting,
  [COOKBOOK_PATH]: releasedCookbook,
  [DEVICES_PATH]: releasedDevices,
  [ENGAGEMENT_PATH]: releasedEngagement,
  [WATCH_PATH]: releasedWatchApps,
  [A11Y_PATH]: releasedAccessibility,
};

/** All clusters as basePath → released entries. */
export function clusterMap(): Record<string, ClusterEntry[]> {
  const out: Record<string, ClusterEntry[]> = {};
  for (const [base, fn] of Object.entries(REGISTRY)) out[base] = fn();
  return out;
}

/** Previous/next released sibling of a slug within its cluster, in the
 *  cluster's curated order. Ends of the list return null on that side. */
export function clusterNeighbors(
  basePath: string,
  slug: string,
): { prev: ClusterEntry | null; next: ClusterEntry | null } {
  const list = REGISTRY[basePath]?.() ?? [];
  const i = list.findIndex((e) => e.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null };
}

/**
 * basePath → human label for the cluster, sourced from each cluster's own
 * ClusterConfig so the hub label can never disagree with the breadcrumb.
 * Consumed by the markdown mirrors, llms.txt and the answer index.
 */
export const CLUSTER_LABELS: Record<string, string> = Object.fromEntries(
  [
    FITNESS_APIS_CONFIG,
    GUIDES_CONFIG,
    BUILD_CONFIG,
    INTEGRATE_CONFIG,
    FIX_CONFIG,
    LEARN_CONFIG,
    ALTERNATIVES_CONFIG,
    COMPLIANCE_CONFIG,
    MIGRATE_CONFIG,
    PRICING_CONFIG,
    COMPARE_CONFIG,
    DATA_CONFIG,
    MOTION_CONFIG,
    AI_CONFIG,
    ARCHITECTURE_CONFIG,
    TEST_CONFIG,
    COOKBOOK_CONFIG,
    DEVICES_CONFIG,
    ENGAGEMENT_CONFIG,
    WATCH_CONFIG,
    A11Y_CONFIG,
  ].map((c) => [c.basePath, c.hubLabel]),
);

/** All released spokes as (basePath, entry) pairs, in registry order. */
export function allSpokes(): { basePath: string; entry: ClusterEntry }[] {
  return Object.entries(clusterMap()).flatMap(([basePath, entries]) =>
    entries.map((entry) => ({ basePath, entry })),
  );
}
