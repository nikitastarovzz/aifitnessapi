/** Types for src/lib/weeklyCore.mjs. */
export type WeeklyKind = "change" | "graveyard" | "release" | "page";
export type WeeklyItemBase = { kind: WeeklyKind; date: string; key: string };
export type WeekBucket<T extends WeeklyItemBase> = {
  id: string;
  start: string;
  end: string;
  inProgress: boolean;
  items: T[];
  counts: Record<WeeklyKind, number>;
};

export const WEEKLY_MIN_ITEMS: number;
export const WEEKLY_KINDS: WeeklyKind[];
export function isDay(d: unknown): d is string;
export function isoWeek(day: string): { year: number; week: number; id: string };
export function weekBounds(id: string): { start: string; end: string };
export function weekRangeLabel(id: string): string;
export function weekLabel(id: string): string;
export function buildWeeks<T extends WeeklyItemBase>(items: T[], asOf: string): WeekBucket<T>[];
export function weekSummaryParts(counts: Record<WeeklyKind, number>): string[];
export function joinList(xs: string[]): string;
