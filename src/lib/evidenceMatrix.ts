import gymEvidence from "../../ops/sources/evidence/fitness-apis-gym-management-software-apis.json";
import researchEvidence from "../../ops/sources/evidence/fitness-apis-wearable-research-data-platforms.json";
import { resolveWith } from "./evidenceMatrixCore.mjs";

/**
 * Evidence-backed comparison matrices (ops/AUDIENCE-30-2026-11-05.md items 28
 * and 29): /tools/gym-software-api-matrix and /tools/research-platform-chooser.
 *
 * A matrix adds no facts. Each cell names, by index, the rows of an existing
 * page's evidence file (ops/sources/evidence/<file>.json: claim, url and a
 * verbatim quote) that support it, and the page prints those quotes beside
 * the cell. The evidence files are the ones the roundup pages
 * /fitness-apis/gym-management-software-apis and
 * /fitness-apis/wearable-research-data-platforms were written from; every
 * quote in both was found again in its live source by source-quotes.yml run
 * 42082822142 on 2026-11-05. Logic: src/lib/evidenceMatrixCore.mjs.
 */

export type EvidenceRow = { claim: string; url: string; quote: string };

export const EVIDENCE_FILES = {
  "fitness-apis-gym-management-software-apis": gymEvidence as EvidenceRow[],
  "fitness-apis-wearable-research-data-platforms": researchEvidence as EvidenceRow[],
} as const;
export type EvidenceFile = keyof typeof EVIDENCE_FILES;

export type CellValue = "yes" | "no" | "unknown";
export type MatrixCell = { value: CellValue; text: string; ev: number[] };
export type MatrixColumn = {
  id: string;
  label: string;
  /** "feature" columns are yes/no/unknown and can be required in the filter; "text" columns describe. */
  kind: "feature" | "text";
  /** The filter's wording for a feature column. */
  need?: string;
};
export type MatrixRow = { id: string; name: string; page?: { href: string; label: string }; cells: Record<string, MatrixCell> };

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
  return resolveWith(m, EVIDENCE_FILES[m.evidenceFile]) as ResolvedMatrix;
}

/** "yes 7 · no 1 · unknown 12" counts for a feature column. */
export function columnCounts(m: EvidenceMatrix, colId: string): Record<CellValue, number> {
  const out: Record<CellValue, number> = { yes: 0, no: 0, unknown: 0 };
  for (const r of m.rows) out[r.cells[colId].value]++;
  return out;
}
