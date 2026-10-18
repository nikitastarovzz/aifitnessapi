/**
 * Resolves the rows of src/data/metricTypeMap.ts against the generated
 * reference data: the page each mapped type lives on, the name it is shown
 * under, and a few facts about how it is read, all taken from the generated
 * modules. Rendered by components/MetricPlatforms ("By platform") on every
 * /data guide the map covers.
 *
 * Kept apart from metricTypeMap.ts so the map itself imports nothing but the
 * guide list: ghapiPages and the type-page routes read it, and this file
 * reads them.
 *
 * Nothing here is authored prose. Each fact is a field of the type's
 * generated record (record type, unit, aggregation, operations, permission,
 * UUID), phrased as a label, never paraphrased into a claim.
 */
import { GHAPI_DATA_TYPES, GHAPI_FETCHED_ON } from "./googleHealthApi";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "./healthkitIdentifiers";
import { HC_RECORDS, HC_FETCHED_ON } from "./healthConnectRecords";
import { HS_DATA_TYPES, HS_DATA_TYPES_FETCHED_ON } from "./healthServicesDataTypes";
import { BT_CHARACTERISTICS, BT_GATT_FETCHED_ON } from "./bluetoothGatt";
import { typePath } from "./ghapiPages";
import { hkIdentifierPagePath, hkReadOnlyEvidence } from "./hkIdentifierPages";
import { recordPath } from "./hcPages";
import { hsDataTypePagePath } from "./hsDataTypePages";
import { btPath } from "./btPages";
import { METRIC_FAMILIES, type MetricFamily, type MetricGuideMap, type MetricTypeMapping } from "./metricTypeMap";

/** The date each family's generated module was read from its source. */
export const METRIC_FAMILY_READ_ON: Record<MetricFamily, string> = {
  "google-health-api": GHAPI_FETCHED_ON,
  healthkit: HK_FETCHED_ON,
  "health-connect": HC_FETCHED_ON,
  "wear-os": HS_DATA_TYPES_FETCHED_ON,
  bluetooth: BT_GATT_FETCHED_ON,
};

/** Whose words the quote is, for the attribution under it. */
export const METRIC_FAMILY_SOURCE: Record<MetricFamily, string> = {
  "google-health-api": "Google",
  healthkit: "Apple",
  "health-connect": "Google",
  "wear-os": "Google",
  bluetooth: "Bluetooth SIG",
};

export type ResolvedMetricType = MetricTypeMapping & {
  /** The type's reference page on this site. */
  href: string;
  /** The name the type is shown under (its identifier as developers write it). */
  label: string;
  /** Short facts from the generated record, in reading order. */
  facts: string[];
};

const join = (xs: string[]) => xs.filter(Boolean).join(", ");

/** One mapped type, resolved; throws when the generated data has no page for it,
 *  which qa.mjs reports as METRIC-MAP-NO-PAGE before a build ever gets here. */
export function resolveMetricType(m: MetricTypeMapping): ResolvedMetricType {
  const fail = (why: string): never => {
    throw new Error(`metricTypeMap: ${m.family}:${m.id} ${why}`);
  };
  switch (m.family) {
    case "google-health-api": {
      const t = GHAPI_DATA_TYPES.find((x) => x.dataType === m.id) ?? fail("is not in googleHealthApi.ts");
      const facts = [
        `${t.recordType} record`,
        t.storageResolution ? `${t.storageResolution} storage resolution` : "",
        `operations: ${join(t.operations.map((o) => o.op))}`,
        t.webhookSupport ? "webhook support" : "no webhook support in Google's table",
        t.channel === "v4beta" ? "v4beta (preview channel)" : "",
      ];
      return { ...m, href: typePath(t), label: t.dataType, facts: facts.filter(Boolean) };
    }
    case "healthkit": {
      const id = HK_IDENTIFIERS.find((x) => x.case === m.id) ?? fail("is not in healthkitIdentifiers.ts");
      const href = hkIdentifierPagePath(id.case) ?? fail("has no identifier page (the thin-page rule holds it back)");
      const ios = id.platforms.find((p) => p.name === "iOS")?.introducedAt;
      const facts =
        id.family === "quantity"
          ? [
              id.aggregation ? `${id.aggregation} values` : "aggregation not stated by Apple",
              id.unitFamily ? `${id.unitFamily} units` : "",
            ]
          : [`category type`, id.valueEnum ? `values from ${id.valueEnum}` : ""];
      if (ios) facts.push(`iOS ${ios}+`);
      if (hkReadOnlyEvidence(id)) facts.push("read-only");
      return { ...m, href, label: id.case, facts: facts.filter(Boolean) };
    }
    case "health-connect": {
      const r = HC_RECORDS.find((x) => x.className === m.id) ?? fail("is not in healthConnectRecords.ts");
      const facts = [
        r.recordShape ? `${r.recordShape} record` : "",
        r.category ? `${r.category} category` : "",
        r.unitClass ? `${r.unitClass} unit` : "",
        r.aggregateMetrics.length ? `aggregates: ${join(r.aggregateMetrics.map((a) => a.name))}` : "no aggregate metrics",
        r.featureFlag ? `behind ${r.featureFlag}` : "",
      ];
      return { ...m, href: recordPath(r), label: r.className, facts: facts.filter(Boolean) };
    }
    case "wear-os": {
      const t = HS_DATA_TYPES.find((x) => x.name === m.id) ?? fail("is not in healthServicesDataTypes.ts");
      const href = hsDataTypePagePath(t.name) ?? fail("has no data-type page (the thin-page rule holds it back)");
      const facts = [
        t.dataTypeClass,
        `${t.dataPointClass}<${t.valueType}>`,
        t.permission ? `permission ${t.permission}` : "no permission in Google's table",
      ];
      return { ...m, href, label: `DataType.${t.name}`, facts };
    }
    case "bluetooth": {
      const c = BT_CHARACTERISTICS.find((x) => x.id === m.id) ?? fail("is not in bluetoothGatt.ts");
      if (!c.hasPage || !c.gss) fail("has no byte-layout page");
      const n = c.gss!.structure.length;
      const facts = [c.uuid, `${n} ${n === 1 ? "field" : "fields"}`, c.gss!.flagsFields.length ? "flags-dependent layout" : ""];
      return { ...m, href: btPath(c), label: c.name, facts: facts.filter(Boolean) };
    }
  }
}

export type MetricPlatform = {
  family: MetricFamily;
  label: string;
  readOn: string;
  source: string;
  types: ResolvedMetricType[];
};

/** Every family in display order, with the guide's mapped types resolved (possibly none). */
export function metricPlatforms(map: MetricGuideMap): MetricPlatform[] {
  return METRIC_FAMILIES.map(({ family, label }) => ({
    family,
    label,
    readOn: METRIC_FAMILY_READ_ON[family],
    source: METRIC_FAMILY_SOURCE[family],
    types: map.types.filter((t) => t.family === family).map(resolveMetricType),
  }));
}
