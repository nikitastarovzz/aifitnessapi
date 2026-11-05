/**
 * What /schema, its markdown mirror and the llms surfaces say about the
 * unified health-data schema — one module, so the three cannot drift.
 * Every number is counted from src/data/unifiedSchema.ts (generated).
 */
import {
  UNIFIED_RECORDS,
  UNIFIED_SCHEMA_VERSION,
  UNIFIED_SCHEMA_FILES,
  UNIFIED_READ_ON,
  UNIFIED_STAGES,
  UNIFIED_SOURCES,
  type UsPlatform,
} from "@/data/unifiedSchema";

export const SCHEMA_PATH = "/schema";
export const CONVERTER_PATH = "/tools/schema-converter";

export const US_PLATFORMS: { key: UsPlatform; label: string }[] = [
  { key: "healthkit", label: "HealthKit" },
  { key: "health-connect", label: "Health Connect" },
  { key: "google-health-api", label: "Google Health API" },
  { key: "wear-os", label: "Wear OS Health Services" },
];

/** Counts for prose: records, mapped and not-mapped cells per platform. */
export function schemaCounts() {
  const perPlatform = Object.fromEntries(
    US_PLATFORMS.map(({ key }) => {
      let mapped = 0;
      let notMapped = 0;
      for (const r of UNIFIED_RECORDS) {
        for (const c of Object.values(r.platforms[key].fields)) {
          if (c.status === "mapped") mapped++;
          else notMapped++;
        }
      }
      const recordsMapped = UNIFIED_RECORDS.filter((r) => r.platforms[key].type.status === "mapped").length;
      return [key, { mapped, notMapped, recordsMapped }];
    }),
  ) as Record<UsPlatform, { mapped: number; notMapped: number; recordsMapped: number }>;
  return { records: UNIFIED_RECORDS.length, stages: UNIFIED_STAGES.length, perPlatform };
}

export const SCHEMA_TITLE = "Unified Health Data Schema (JSON Schema + TS)";
export const SCHEMA_DESCRIPTION =
  "JSON Schema and TypeScript types for heart rate, steps, sleep, workouts, weight, HRV and SpO2, each field mapped to HealthKit, Health Connect and Google.";

export function schemaCapsule(): string {
  const c = schemaCounts();
  const hs = c.perPlatform["wear-os"].recordsMapped;
  return `A vendor-neutral JSON Schema (draft 2020-12) and TypeScript types for ${c.records} common health records — heart rate, steps, sleep sessions with stages, workouts, weight, body fat, height, heart rate variability and SpO2 — with each field mapped, or marked not mapped, for Apple HealthKit, Android Health Connect, the Google Health API and Wear OS Health Services. Each mapping quotes the platform's own documentation, each unit conversion names the sentence that states it (HealthKit's percent is 0.0 to 1.0, Google stores weight in grams), and each gap says why: Wear OS covers ${hs} of the ${c.records}, and HealthKit's SDNN is never relabeled as RMSSD. Version ${UNIFIED_SCHEMA_VERSION}, CC BY 4.0.`;
}

export const SCHEMA_FAQS: { q: string; a: string }[] = [
  {
    q: "Is there a common schema for HealthKit, Health Connect and Google Health API data?",
    a: `Not from the platforms: each publishes its own types. This site publishes one, version ${UNIFIED_SCHEMA_VERSION}, as a JSON Schema and TypeScript types at ${UNIFIED_SCHEMA_FILES.schema} and ${UNIFIED_SCHEMA_FILES.types}, generated from its datasets of the platforms' own documentation so every field mapping carries the sentence it rests on.`,
  },
  {
    q: "Why does the unified HRV record carry a metric field instead of one number?",
    a: "Because the platforms publish different statistics. HealthKit's type is heartRateVariabilitySDNN, the standard deviation of heartbeat intervals; Health Connect's record and the Google Health API's field are RMSSD. They are different measures of the same heartbeat series, and no formula converts one into the other, so the record says which one it is.",
  },
  {
    q: "How do I convert HealthKit oxygen saturation to the same scale as Health Connect?",
    a: "Multiply by 100. Apple's HKUnit.percent() documentation says percent measures a value between 0.0 and 1.0, while Health Connect's OxygenSaturationRecord.percentage and the Google Health API's percentage field state a 0 to 100 range. The unified record holds 0 to 100.",
  },
  {
    q: "Can I use the unified schema in my own product?",
    a: "Yes, under CC BY 4.0, the same license as this site's datasets: attribute aifitnessapi.com. The vendor sentences quoted as evidence in mappings.json remain their publishers' text. The schema is versioned in its URL, so v1 stays where it is when a later version changes a shape.",
  },
];

export const SCHEMA_SOURCES_LINE = (): string =>
  Object.values(UNIFIED_SOURCES)
    .map((s) => `${s.name} (read ${s.readOn})`)
    .join(", ");

export { UNIFIED_READ_ON };
