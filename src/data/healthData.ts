/**
 * Cluster 12 — "[metric] API" pages (data-acquisition / high-intent). Organized
 * by the DATA a builder needs — heart rate, steps, sleep, calories, VO2 max, … —
 * not by provider (that's /fitness-apis) or concept (that's /learn). For each
 * metric: which sources expose it via API, measured vs estimated, gotchas, and
 * the best pick. Reuses the shared cluster template; Article + FAQPage.
 */
import { dataEntries } from "./data.entries";
import type { ClusterEntry } from "@/lib/cluster";

export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const DATA_PATH = "/data";
export const DATA_CONFIG = { basePath: DATA_PATH, hubLabel: "Health Data" };

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_DATA = new Set<string>([
  "heart-rate-api",
  "hrv-api",
  "vo2-max-api",
  "blood-oxygen-api",
  "sleep-tracking-api",
  "step-counting-api",
  "workout-detection-api",
  "gps-activity-api",
  "calorie-tracking-api",
  "body-composition-api",
]);

export const allData: ClusterEntry[] = dataEntries;

export function releasedData(): ClusterEntry[] {
  return allData.filter((e) => RELEASED_DATA.has(e.slug));
}

export function getDataPage(slug: string): ClusterEntry | undefined {
  return releasedData().find((e) => e.slug === slug);
}
