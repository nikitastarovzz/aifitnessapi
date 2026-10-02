"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";

/**
 * Which tracker entries are still ahead — decided in the reader's browser.
 *
 * Every page here is built statically, so a server-side `sortDate >= today`
 * freezes "today" at the last deploy. A build from early September kept
 * listing the mid-September Fitbit events under "next deadlines" after both
 * had passed — on the page whose whole promise is honest dates. The
 * upcoming/past split therefore happens here, after mount, on the reader's
 * clock.
 *
 * Server HTML (crawlers, no-JS readers, the first client render) makes no
 * upcoming-or-past claim at all: the caller passes a neutral `asOf` label, and
 * the list renders in the order it was given — latest date first, the
 * tracker's own order — which stays true on whatever day it is read. Server
 * and first client render take that same path, so hydration cannot mismatch;
 * the swap happens in the effect, as in ContentAge and Countdown.
 *
 * Dates compare as UTC calendar days, the rule Countdown counts with, so no
 * entry can show a countdown while being listed as past, or the reverse.
 *
 * The markup stays with the caller: items arrive as server-rendered nodes and
 * this file only chooses which of them to show, and in what order.
 */

/** One server-rendered entry; `sortDate` is ChangeEvent.sortDate (full ISO). */
export type DatedNode = { key: string; sortDate: string; node: ReactNode };

type Mode = "asOf" | "ahead" | "recent";

/** Today as a UTC "YYYY-MM-DD", or null until mounted (server, no-JS). */
function useTodayUtc(): string | null {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);
  return today;
}

/**
 * `items` arrive latest date first (changesSorted order).
 * - before mount: the first `limit` as given, labelled only "as of" the build;
 * - entries on or after today: the soonest `limit`, soonest first;
 * - none ahead: the `limit` most recent — and the label says so, rather than
 *   keeping a "next deadlines" heading over dates that have passed.
 */
function pick<T extends { sortDate: string }>(
  items: T[],
  today: string | null,
  limit: number,
): { mode: Mode; items: T[] } {
  if (today === null) return { mode: "asOf", items: items.slice(0, limit) };
  const ahead = items
    .filter((i) => i.sortDate >= today)
    .sort((a, b) => (a.sortDate < b.sortDate ? -1 : a.sortDate > b.sortDate ? 1 : 0));
  if (ahead.length > 0) return { mode: "ahead", items: ahead.slice(0, limit) };
  return { mode: "recent", items: items.slice(0, limit) };
}

/** The entries to show; the caller supplies the list/grid wrapper. */
export default function UpcomingDeadlines({ items, limit }: { items: DatedNode[]; limit: number }) {
  const today = useTodayUtc();
  return (
    <>
      {pick(items, today, limit).items.map((i) => (
        <Fragment key={i.key}>{i.node}</Fragment>
      ))}
    </>
  );
}

/**
 * The heading or intro line that frames an UpcomingDeadlines list. Given the
 * same dates, it reaches the same verdict as the list beside it: `asOf` in the
 * server HTML, then `ahead` or `recent` once the browser knows the date.
 */
export function DeadlinesLabel({
  dates,
  asOf,
  ahead,
  recent,
}: {
  dates: string[];
  asOf: ReactNode;
  ahead: ReactNode;
  recent: ReactNode;
}) {
  const today = useTodayUtc();
  const { mode } = pick(
    dates.map((sortDate) => ({ sortDate })),
    today,
    1,
  );
  return <>{mode === "ahead" ? ahead : mode === "recent" ? recent : asOf}</>;
}

/**
 * Renders `children` only once the browser has confirmed `date` (a full ISO
 * day) is today or later — for decoration that implies "still ahead", like
 * the pulsing dot on /changes. Nothing in the server HTML.
 */
export function WhenUpcoming({ date, children }: { date: string; children: ReactNode }) {
  const today = useTodayUtc();
  if (today === null || date < today) return null;
  return <>{children}</>;
}
