export const ROSETTA_READ_ON: string;
export const REFERENCES: { swift: Record<string, string>; kotlin: Record<string, string> };

export type RosettaMetric = { name: string; valueType: string; description: string | null; kind: string | null };

export type RosettaPair = {
  status: "pair" | "different-measure";
  matrixRow: string;
  matrixLabel: string;
  how: "row" | "unified";
  unifiedId: string | null;
  note: string | null;
  watchOut: string | null;
  measures: { healthkit: string; healthConnect: string } | null;
  field: string | null;
  hk: {
    case: string;
    objc: string;
    family: string;
    familyType: string;
    typeClass: "HKQuantityType" | "HKCategoryType";
    sampleClass: "HKQuantitySample" | "HKCategorySample";
    aggregation: "cumulative" | "discrete" | null;
    aggregationEvidence: string | null;
    unitFamily: string | null;
    valueEnum: string | null;
    unit: string | null;
    percent: boolean;
    docUrl: string;
  };
  hc: {
    className: string;
    shape: string | null;
    readPermissions: string[];
    sourceUrl: string;
    metrics: RosettaMetric[];
    properties: { name: string; type: string }[];
    value: { samples: boolean; field: string; accessor: string | null } | null;
  };
};

export type RosettaTable = {
  pairs: RosettaPair[];
  rows: { id: string; label: string; apple: string[]; android: string[]; watchOut: string | null }[];
  hkRow: Record<string, string>;
  hcRow: Record<string, string>;
  hkNames: { c: string; o: string; f: string }[];
  hcNames: string[];
};

export function metricKind(description: string | null | undefined): string | null;
export function buildPairs(d: {
  unifiedRecords: unknown[];
  matrixRows: unknown[];
  hkIdentifiers: unknown[];
  hcRecords: unknown[];
}): RosettaTable;
export function detectLanguage(code: string): "swift" | "kotlin" | null;
export function translate(
  code: string,
  table: RosettaTable,
  force?: "swift" | "kotlin",
): { from: "swift" | "kotlin" | null; to: "swift" | "kotlin" | null; ok: boolean; shape: string | null; code: string };
