import type { ClusterConfig, ClusterEntry } from "./cluster";
import { releasedEntries, FITNESS_APIS_CONFIG } from "@/data/fitnessApis";
import { releasedGuides, GUIDES_CONFIG } from "@/data/guides";
import { releasedBuilds, BUILD_CONFIG } from "@/data/build";
import { releasedIntegrations, INTEGRATE_CONFIG } from "@/data/integrate";
import { releasedFixes, FIX_CONFIG } from "@/data/fix";
import { releasedLearn, LEARN_CONFIG } from "@/data/learn";
import { releasedAlternatives, ALTERNATIVES_CONFIG } from "@/data/alternatives";
import { releasedCompliance, COMPLIANCE_CONFIG } from "@/data/compliance";
import { releasedMigrate, MIGRATE_CONFIG } from "@/data/migrate";
import { releasedPricing, PRICING_CONFIG } from "@/data/pricing";
import { releasedCompare, COMPARE_CONFIG } from "@/data/compare";
import { releasedData, DATA_CONFIG } from "@/data/healthData";
import { releasedMotion, MOTION_CONFIG } from "@/data/motion";
import { releasedAi, AI_CONFIG } from "@/data/ai";
import { releasedArchitecture, ARCHITECTURE_CONFIG } from "@/data/architecture";
import { releasedTesting, TEST_CONFIG } from "@/data/testing";
import { releasedCookbook, COOKBOOK_CONFIG } from "@/data/cookbook";
import { releasedDevices, DEVICES_CONFIG } from "@/data/devices";
import { releasedEngagement, ENGAGEMENT_CONFIG } from "@/data/engagement";
import { releasedWatchApps, WATCH_CONFIG } from "@/data/watchApps";
import { releasedAccessibility, A11Y_CONFIG } from "@/data/accessibility";
import { releasedAudioCoaching, AUDIO_CONFIG } from "@/data/audioCoaching";
import { releasedHealthkitQueries, HKQ_CONFIG } from "@/data/healthkitQueries";
import { releasedPhoneSensors, SENSORS_CONFIG } from "@/data/phoneSensors";
import { releasedHealthConnectApi, HCAPI_CONFIG } from "@/data/healthConnectApi";
import { releasedOwnYourData, OWN_DATA_CONFIG } from "@/data/ownYourData";

/**
 * Every cluster, once: its ClusterConfig (basePath, hub label) and its
 * released-entries function. REGISTRY and CLUSTER_LABELS are derived from
 * this list, so the order here is the registry order everything iterates in.
 */
export const CLUSTERS: { config: ClusterConfig; released: () => ClusterEntry[] }[] = [
  { config: FITNESS_APIS_CONFIG, released: releasedEntries },
  { config: GUIDES_CONFIG, released: releasedGuides },
  { config: BUILD_CONFIG, released: releasedBuilds },
  { config: INTEGRATE_CONFIG, released: releasedIntegrations },
  { config: FIX_CONFIG, released: releasedFixes },
  { config: LEARN_CONFIG, released: releasedLearn },
  { config: ALTERNATIVES_CONFIG, released: releasedAlternatives },
  { config: COMPLIANCE_CONFIG, released: releasedCompliance },
  { config: MIGRATE_CONFIG, released: releasedMigrate },
  { config: PRICING_CONFIG, released: releasedPricing },
  { config: COMPARE_CONFIG, released: releasedCompare },
  { config: DATA_CONFIG, released: releasedData },
  { config: MOTION_CONFIG, released: releasedMotion },
  { config: AI_CONFIG, released: releasedAi },
  { config: ARCHITECTURE_CONFIG, released: releasedArchitecture },
  { config: TEST_CONFIG, released: releasedTesting },
  { config: COOKBOOK_CONFIG, released: releasedCookbook },
  { config: DEVICES_CONFIG, released: releasedDevices },
  { config: ENGAGEMENT_CONFIG, released: releasedEngagement },
  { config: WATCH_CONFIG, released: releasedWatchApps },
  { config: A11Y_CONFIG, released: releasedAccessibility },
  { config: AUDIO_CONFIG, released: releasedAudioCoaching },
  { config: HKQ_CONFIG, released: releasedHealthkitQueries },
  { config: SENSORS_CONFIG, released: releasedPhoneSensors },
  { config: HCAPI_CONFIG, released: releasedHealthConnectApi },
  { config: OWN_DATA_CONFIG, released: releasedOwnYourData },
];

/**
 * basePath → released entries, for anything that needs to see a cluster's
 * siblings without threading them through 26 route files (prev/next nav,
 * the search index's future needs). Server-side only.
 */
const REGISTRY: Record<string, () => ClusterEntry[]> = Object.fromEntries(
  CLUSTERS.map((c) => [c.config.basePath, c.released]),
);

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
  CLUSTERS.map((c) => [c.config.basePath, c.config.hubLabel]),
);

/** All released spokes as (basePath, entry) pairs, in registry order. */
export function allSpokes(): { basePath: string; entry: ClusterEntry }[] {
  return Object.entries(clusterMap()).flatMap(([basePath, entries]) =>
    entries.map((entry) => ({ basePath, entry })),
  );
}
