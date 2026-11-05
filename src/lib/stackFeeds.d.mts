/** Types for src/lib/stackFeeds.mjs. */
export type TrackerEvent = {
  date: string;
  sortDate: string;
  title: string;
  summary: string;
  status: string;
  page: { href: string; label: string };
  verifiedOn: string;
};

export function escapeIcs(s: string): string;
export function foldIcs(line: string): string;
export function icsStamp(isoDate: string): string;
export function icsNextDay(isoDate: string): string;
export function isExactDate(date: string): boolean;
export function icsUid(e: TrackerEvent): string;
export function icsEvent(e: TrackerEvent, url: string, dtstamp: string): string[];
export function buildCalendar(o: {
  events: TrackerEvent[];
  absolute: (path: string) => string;
  name: string;
  description: string;
  caldesc: string;
  fallbackDay: string;
  refresh?: boolean;
}): string;
export function escapeXml(s: string): string;
export function rfc822(day: string): string;
export function rssItem(e: TrackerEvent, url: string): string;
export function buildRss(o: {
  events: TrackerEvent[];
  absolute: (path: string) => string;
  title: string;
  link: string;
  description: string;
}): string;
export function buildOpml(o: { title: string; feeds: { title: string; xmlUrl: string; htmlUrl: string }[] }): string;
export function parseStack(value: string | null | undefined, validIds: string[]): string[];
export function stackQuery(ids: string[]): string;
export function endOfPeriod(d: string): string;
export function countdownTarget(date: string): string;
export function countdownParts(
  day: string,
  nowMs: number,
): { past: boolean; days: number; hours: number; minutes: number; seconds: number } | null;
export function daysBetween(todayIso: string, day: string): number;
export function pickNext<T extends { target: string }>(
  items: T[],
  todayIso: string,
): { ahead: boolean; item: T; rest: T[] } | null;
export function fmtStatedDate(d: string): string;
export function periodWords(d: string): string;
