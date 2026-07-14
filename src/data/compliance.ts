/**
 * Cluster 8 — "Health-data compliance & privacy for fitness apps" (YMYL /
 * decision). Which rules apply (HIPAA, GDPR, FDA), what counts as health data,
 * and how to build for consent, storage, retention, and platform policy. Reuses
 * the shared cluster template; Article + FAQPage (no `steps`, no HowTo). Uses
 * the "legal" disclaimer variant (not legal advice).
 */
import { complianceEntries } from "./compliance.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const COMPLIANCE_PATH = "/compliance";
export const COMPLIANCE_CONFIG = {
  basePath: COMPLIANCE_PATH,
  hubLabel: "Compliance",
  disclaimer: "legal" as const,
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_COMPLIANCE = new Set<string>([
  "hipaa-compliance-fitness-app",
  "gdpr-fitness-app",
  "is-fitness-data-phi",
  "fda-fitness-app-regulation",
  "app-store-health-data-rules",
  "google-play-health-data-policy",
  "store-health-data-securely",
  "health-data-user-consent",
  "health-app-privacy-policy",
  "health-data-retention-deletion",
]);

export const allCompliance: ClusterEntry[] = complianceEntries;

export function releasedCompliance(): ClusterEntry[] {
  return allCompliance.filter((e) => RELEASED_COMPLIANCE.has(e.slug));
}

export function getCompliance(slug: string): ClusterEntry | undefined {
  return releasedCompliance().find((e) => e.slug === slug);
}
