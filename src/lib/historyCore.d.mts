/** Types for src/lib/historyCore.mjs. */
export type HistoryKind = "launch" | "change" | "milestone" | "end";
export type HistoryMark = {
  id: string;
  kind: HistoryKind;
  status: string;
  /** At the source's precision; null only for undated graveyard entries. */
  date: string | null;
  title: string;
  short: string;
  href: string;
  hrefLabel: string;
  external: boolean;
  page: string;
  vendorId: string;
  vendorLabel: string;
  graveId?: string;
  quote?: string;
};
export type HistoryModel = {
  marks: (HistoryMark & { date: string })[];
  undated: HistoryMark[];
  vendors: { id: string; label: string; count: number }[];
  kinds: { id: HistoryKind; label: string; count: number }[];
  years: number[];
  asOf: string;
  graveyardCount: number;
};
export type HistoryFilter = { vendor: string | null; kinds: string[] };

export const HISTORY_VENDORS: { id: string; label: string; terms: string[] }[];
export const OTHER_VENDOR: { id: string; label: string };
export const HISTORY_KINDS: { id: HistoryKind; label: string }[];
export function vendorOf(...texts: (string | undefined)[]): { id: string; label: string };
export function precisionOf(d: unknown): "day" | "month" | "year" | null;
export function yearSpan(d: string): [number, number];
export function fmtDate(d: string): string;
export function historyModel(input: { graveyard: readonly object[]; changes: readonly object[] }): HistoryModel;
export function esc(s: unknown): string;
export function layoutYear(marks: HistoryMark[]): { placed: unknown[]; lanes: number };
export function historySvg(model: HistoryModel, opts?: { poster?: boolean; url?: string; site?: string }): string;
export function parseFilter(search: string, model: Pick<HistoryModel, "vendors">): HistoryFilter;
export function passes(m: Pick<HistoryMark, "vendorId" | "kind">, f: HistoryFilter): boolean;
