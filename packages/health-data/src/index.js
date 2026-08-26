/**
 * Typed reference data for health and fitness APIs.
 *
 * Read from Apple's own documentation and from this site's verified datasets,
 * shipped as plain JSON so it works anywhere — no network, no runtime.
 *
 * The library deliberately has no "best guess" behaviour. Lookups return
 * undefined rather than a nearest match, and fields Apple does not state are
 * null rather than inferred. Code that needs to branch on a fact should be
 * able to tell "Apple says discrete" from "nobody knows".
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const load = (slug) => require(`../data/${slug}.json`);

const hkDoc = load("healthkit-type-identifiers-2026");
const matrixDoc = load("health-data-type-matrix-2026");
const changesDoc = load("fitness-api-changes-2026");
const glossaryDoc = load("fitness-api-glossary-2026");

/** Every HealthKit identifier across all four families. */
export const healthkitIdentifiers = hkDoc.items;
/** Verified HealthKit ↔ Health Connect metric mappings. */
export const crossPlatformTypes = matrixDoc.items;
/** Dated ecosystem changes, each graded confirmed or reported. */
export const apiChanges = changesDoc.items;
/** Domain glossary. */
export const glossary = glossaryDoc.items;

/** Provenance for every dataset, including the date each source was read. */
export const meta = {
  healthkitIdentifiers: { ...hkDoc, items: undefined },
  crossPlatformTypes: { ...matrixDoc, items: undefined },
  apiChanges: { ...changesDoc, items: undefined },
  glossary: { ...glossaryDoc, items: undefined },
};

const byIdentifier = new Map(healthkitIdentifiers.map((r) => [r.identifier.toLowerCase(), r]));
const byObjc = new Map(healthkitIdentifiers.map((r) => [r.objcConstant.toLowerCase(), r]));

/**
 * Look up one HealthKit identifier by Swift case or Objective-C constant.
 * Returns undefined for an unknown name — never a nearest match, because a
 * silently wrong type is worse here than no answer.
 */
export function healthkitIdentifier(name) {
  const k = String(name ?? "").toLowerCase();
  return byIdentifier.get(k) ?? byObjc.get(k);
}

/**
 * The correct HKStatisticsQuery option family for an identifier.
 *
 * Returns "cumulativeSum" | "discrete" | null. null means either the name is
 * unknown, the type is not a quantity type, or Apple's documentation does not
 * state an aggregation style — all three of which mean "do not guess", so
 * they are not distinguished in the return value. Check the record itself if
 * you need to tell them apart.
 */
export function aggregationFor(name) {
  const r = healthkitIdentifier(name);
  if (!r || r.family !== "HKQuantityTypeIdentifier") return null;
  return r.aggregation === "cumulative" ? "cumulativeSum" : r.aggregation === "discrete" ? "discrete" : null;
}

/** The verified cross-platform mapping for a metric id, or undefined. */
export function crossPlatform(metricId) {
  const k = String(metricId ?? "").toLowerCase();
  return crossPlatformTypes.find((r) => r.id.toLowerCase() === k || r.label.toLowerCase() === k);
}
