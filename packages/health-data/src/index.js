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
const hcRecordsDoc = load("health-connect-records-2026");
const hcPermissionsDoc = load("health-connect-permissions-2026");
const hkMetadataDoc = load("healthkit-metadata-keys-2026");
const wearOsDoc = load("wear-os-health-services-data-types-2026");

/** Every HealthKit identifier across all four families. */
export const healthkitIdentifiers = hkDoc.items;
/** Verified HealthKit ↔ Health Connect metric mappings. */
export const crossPlatformTypes = matrixDoc.items;
/** Dated ecosystem changes, each graded confirmed or reported. */
export const apiChanges = changesDoc.items;
/** Domain glossary. */
export const glossary = glossaryDoc.items;
/** Every Health Connect record class in Google's data-types table. */
export const healthConnectRecords = hcRecordsDoc.items;
/** Every android.permission.health string on Google's HealthPermissions reference. */
export const healthConnectPermissions = hcPermissionsDoc.items;
/** Every HKMetadataKey constant on Apple's Metadata Keys collection. */
export const healthkitMetadataKeys = hkMetadataDoc.items;
/** Every Wear OS Health Services DataType constant on Google's Jetpack reference. */
export const wearOsDataTypes = wearOsDoc.items;

/** Provenance for every dataset, including the date each source was read. */
export const meta = {
  healthkitIdentifiers: { ...hkDoc, items: undefined },
  crossPlatformTypes: { ...matrixDoc, items: undefined },
  apiChanges: { ...changesDoc, items: undefined },
  glossary: { ...glossaryDoc, items: undefined },
  healthConnectRecords: { ...hcRecordsDoc, items: undefined },
  healthConnectPermissions: { ...hcPermissionsDoc, items: undefined },
  healthkitMetadataKeys: { ...hkMetadataDoc, items: undefined },
  wearOsDataTypes: { ...wearOsDoc, items: undefined },
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

const byHcClass = new Map(healthConnectRecords.map((r) => [r.className.toLowerCase(), r]));
const byHcQualified = new Map(healthConnectRecords.map((r) => [r.qualifiedName.toLowerCase(), r]));

/**
 * Look up one Health Connect record class by its simple or fully qualified
 * name. Returns undefined for an unknown name — never a nearest match.
 */
export function healthConnectRecord(name) {
  const k = String(name ?? "").toLowerCase();
  return byHcClass.get(k) ?? byHcQualified.get(k);
}

const byHcPermission = new Map(
  healthConnectPermissions.flatMap((p) => [
    [p.permission.toLowerCase(), p],
    [p.constant.toLowerCase(), p],
  ]),
);

/**
 * Look up one permission by manifest string ("android.permission.health.READ_STEPS")
 * or constant ("READ_STEPS"). Returns undefined for an unknown name.
 */
export function healthConnectPermission(name) {
  return byHcPermission.get(String(name ?? "").toLowerCase());
}

const byMetadataKey = new Map(
  healthkitMetadataKeys.flatMap((k) => [
    [k.swiftName.toLowerCase(), k],
    ...(k.objcName ? [[k.objcName.toLowerCase(), k]] : []),
  ]),
);

/**
 * Look up one HealthKit metadata key by its Swift or Objective-C name
 * ("HKMetadataKeyExternalUUID"). valueType is null where Apple does not state
 * it. Returns undefined for an unknown name.
 */
export function healthkitMetadataKey(name) {
  return byMetadataKey.get(String(name ?? "").toLowerCase());
}

const byWearOsType = new Map(wearOsDataTypes.map((t) => [t.name.toLowerCase(), t]));

/**
 * Look up one Wear OS Health Services data type by its DataType constant
 * ("HEART_RATE_BPM"). permission is null where Google's permissions table does
 * not name the constant. Returns undefined for an unknown name.
 */
export function wearOsDataType(name) {
  return byWearOsType.get(String(name ?? "").toLowerCase());
}
