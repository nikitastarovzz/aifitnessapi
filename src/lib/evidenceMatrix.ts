import gymEvidence from "../../ops/sources/evidence/fitness-apis-gym-management-software-apis.json";
import researchEvidence from "../../ops/sources/evidence/fitness-apis-wearable-research-data-platforms.json";
import aggregatorEvidence from "../../ops/sources/evidence/fitness-apis-health-data-aggregator-apis.json";
import aggregatorPricingEvidence from "../../ops/sources/evidence/pricing-health-data-aggregator-pricing.json";
import sahhaPricingEvidence from "../../ops/sources/evidence/pricing-sahha-api-pricing.json";
import rookPricingEvidence from "../../ops/sources/evidence/pricing-rook-api-pricing.json";
import junctionPricingEvidence from "../../ops/sources/evidence/pricing-junction-api-pricing.json";
import terraVsOpenWearablesEvidence from "../../ops/sources/evidence/compare-terra-vs-open-wearables.json";
import terraVsRookEvidence from "../../ops/sources/evidence/compare-terra-vs-rook.json";
import terraVsSahhaEvidence from "../../ops/sources/evidence/compare-terra-vs-sahha.json";
import terraVsSpikeEvidence from "../../ops/sources/evidence/compare-terra-vs-spike.json";
import terraVsThryveEvidence from "../../ops/sources/evidence/compare-terra-vs-thryve.json";
import rookVsSpikeEvidence from "../../ops/sources/evidence/compare-rook-vs-spike.json";
import rookAlternativesEvidence from "../../ops/sources/evidence/alternatives-rook-alternatives.json";
import { filesCited, resolveWith } from "./evidenceMatrixCore.mjs";

/**
 * Evidence-backed comparison matrices (ops/AUDIENCE-30-2026-11-05.md items 28
 * and 29, ops/VIRAL-20-2026-11-06.md item 16): /tools/gym-software-api-matrix,
 * /tools/research-platform-chooser and /tools/aggregator-chooser.
 *
 * A matrix adds no facts. Each cell names the rows of existing pages'
 * evidence files (ops/sources/evidence/<file>.json: claim, url and a verbatim
 * quote) that support it, and the page prints those quotes beside the cell:
 * a bare index is a row of the matrix's own `evidenceFile`, "<file>#<index>"
 * a row of another file listed here. Every quote in these files is re-checked
 * against its live source by source-quotes.yml. Logic:
 * src/lib/evidenceMatrixCore.mjs.
 */

export type EvidenceRow = { claim: string; url: string; quote: string };

export const EVIDENCE_FILES = {
  "fitness-apis-gym-management-software-apis": gymEvidence as EvidenceRow[],
  "fitness-apis-wearable-research-data-platforms": researchEvidence as EvidenceRow[],
  "fitness-apis-health-data-aggregator-apis": aggregatorEvidence as EvidenceRow[],
  "pricing-health-data-aggregator-pricing": aggregatorPricingEvidence as EvidenceRow[],
  "pricing-sahha-api-pricing": sahhaPricingEvidence as EvidenceRow[],
  "pricing-rook-api-pricing": rookPricingEvidence as EvidenceRow[],
  "pricing-junction-api-pricing": junctionPricingEvidence as EvidenceRow[],
  "compare-terra-vs-open-wearables": terraVsOpenWearablesEvidence as EvidenceRow[],
  "compare-terra-vs-rook": terraVsRookEvidence as EvidenceRow[],
  "compare-terra-vs-sahha": terraVsSahhaEvidence as EvidenceRow[],
  "compare-terra-vs-spike": terraVsSpikeEvidence as EvidenceRow[],
  "compare-terra-vs-thryve": terraVsThryveEvidence as EvidenceRow[],
  "compare-rook-vs-spike": rookVsSpikeEvidence as EvidenceRow[],
  "alternatives-rook-alternatives": rookAlternativesEvidence as EvidenceRow[],
} as const;
export type EvidenceFile = keyof typeof EVIDENCE_FILES;

export type CellValue = "yes" | "no" | "unknown";
/** A bare index into the matrix's own evidence file, or "<file>#<index>". */
export type EvRef = number | string;
export type MatrixCell = { value: CellValue; text: string; ev: EvRef[] };
export type MatrixColumn = {
  id: string;
  label: string;
  /** "feature" columns are yes/no/unknown and can be required in the filter; "text" columns describe. */
  kind: "feature" | "text";
  /** The filter's wording for a feature column. */
  need?: string;
};
export type MatrixRow = {
  id: string;
  name: string;
  page?: { href: string; label: string };
  /** When set, every quote the row cites must come from one of these hosts. */
  hosts?: string[];
  cells: Record<string, MatrixCell>;
};

export type EvidenceMatrix = {
  id: string;
  evidenceFile: EvidenceFile;
  /** The roundup page the evidence file belongs to. */
  roundup: { href: string; label: string };
  /** The date and run that re-found every quote in its live source. */
  checkedOn: string;
  checkRun: string;
  columns: MatrixColumn[];
  rows: MatrixRow[];
};

export type ResolvedCell = MatrixCell & { sources: { url: string; quote: string }[] };
export type ResolvedRow = Omit<MatrixRow, "cells"> & { cells: Record<string, ResolvedCell> };
export type ResolvedMatrix = Omit<EvidenceMatrix, "rows"> & { rows: ResolvedRow[] };

export function resolveMatrix(m: EvidenceMatrix): ResolvedMatrix {
  return resolveWith(m, EVIDENCE_FILES[m.evidenceFile], EVIDENCE_FILES) as ResolvedMatrix;
}

/** The evidence files a matrix cites, its own first. */
export function matrixFiles(m: EvidenceMatrix): string[] {
  return filesCited(m);
}

/** "yes 7 · no 1 · unknown 12" counts for a feature column. */
export function columnCounts(m: EvidenceMatrix, colId: string): Record<CellValue, number> {
  const out: Record<CellValue, number> = { yes: 0, no: 0, unknown: 0 };
  for (const r of m.rows) out[r.cells[colId].value]++;
  return out;
}
