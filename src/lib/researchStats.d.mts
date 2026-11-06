/** Types for researchStats.mjs (the figures of the /research studies). */

export type DriftCause = "source-changed" | "our-change" | "source-unreachable" | "not-stated";
export type DriftKind = "fact" | "wording" | "mixed" | null;

export type DriftGroup = {
  file: string;
  source: string;
  writtenOn: string;
  writtenCommit: string;
  endedOn: string | null;
  endedCommit: string | null;
  endKind: "quote" | "url" | "url-and-quote" | "claim-reworded" | "removed" | null;
  cause: DriftCause | null;
  kind: DriftKind;
  statement: string | null;
  rows: number;
};

export type DriftEvent = { commit: string; date: string; source: string; kind: DriftKind; rows: number };

export type DriftStats = {
  rows: number;
  sources: number;
  files: number;
  ended: number;
  byCause: Record<string, number>;
  driftRows: number;
  driftEvents: number;
  driftSources: number;
  driftCommits: number;
  windows: { days: number; cutoff: string; base: number; changed: number; share: string }[];
  medianDaysToDrift: number | null;
  kinds: { fact: number; wording: number; mixed: number; "not stated": number };
  events: DriftEvent[];
  bySource: { source: string; rows: number; driftRows: number; driftEvents: number }[];
  byDate: { date: string; events: number; rows: number; commit: string }[];
};

export type NoticeRow = {
  id: string;
  name: string;
  vendor: string;
  status: string;
  end: string | null;
  endPrecision: "day" | "month" | "year" | null;
  endLabel: string;
  announced: string | null;
  noticeDays: number | null;
  exclusion: string | null;
  note: string | null;
  how: string | null;
  announcementUrl: string | null;
  announcementQuote: string | null;
  endUrl: string;
  endQuote: string;
  changesEntries: string | null;
  page: string;
};

export type NoticeStats = {
  entries: number;
  measured: number;
  excluded: number;
  median: number | null;
  min: number | null;
  max: number | null;
  list: NoticeRow[];
  reasons: Record<string, number>;
};

export type PricingClass = "published-price" | "no-published-price" | "free";

export type PricingRow = {
  vendor: string;
  category: string;
  categoryLabel: string;
  class: PricingClass | null;
  classLabel: string | null;
  line: string | null;
  url: string | null;
  evidenceFile: string | null;
  freeEntry: string | null;
  unpricedTier: string | null;
  excluded: string | null;
  pricingPage: string;
};

export type PricingStats = {
  vendors: number;
  included: number;
  excluded: number;
  byClass: Record<PricingClass, number>;
  byCategory: ({ category: string; label: string; total: number } & Record<PricingClass, number>)[];
  publishedWithUnpricedTier: number;
  withFreeEntry: number;
};

export type Headline = { id: string; value: string; label: string };

export declare const PRICING_CLASS_ORDER: PricingClass[];
export declare function fmtDay(d: string): string;
export declare function daysBetween(a: string, b: string): number;
export declare function minusDays(d: string, n: number): string;
export declare function median(xs: number[]): number | null;
export declare function pct(n: number, of: number): string;
export declare function driftStats(items: DriftGroup[], through: string, windows?: number[]): DriftStats;
export declare function noticeStats(items: NoticeRow[]): NoticeStats;
export declare function pricingStats(items: PricingRow[]): PricingStats;
export declare function headlines(
  study: "docs-drift" | "shutdown-notice" | "pricing-transparency",
  items: unknown[],
  meta?: { historyThrough?: string },
): Headline[];
