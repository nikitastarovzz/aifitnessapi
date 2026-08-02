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
