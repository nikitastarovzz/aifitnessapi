"use client";

import { useEffect, useState } from "react";

/**
 * How long ago a page's facts were last checked against a source.
 *
 * This site's whole claim is that it tracks a moving ecosystem, which makes a
 * bare "Last verified 9 July" quietly misleading — it reads as provenance
 * when what a reader needs is currency. At the time of writing, 147 of 252
 * pages carried a July stamp. Printing the age turns a date nobody computes
 * into a fact they can act on, and it puts visible pressure on us to
 * re-verify rather than letting old pages look indefinitely current.
 *
 * Client-side on purpose. Age computed at build time freezes: a page built in
 * August still claims "3 weeks ago" in December. The date in the server HTML
 * stays authoritative for crawlers; this only appends the elapsed time.
 *
 * Hydration: the server and first client render both emit null, so the
 * server's HTML cannot disagree with the client's.
 */
export default function ContentAge({ date, staleAfterDays = 90 }: { date: string; staleAfterDays?: number }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const then = Date.parse(`${date}T00:00:00Z`);
    if (Number.isNaN(then)) return;
    const now = new Date();
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    setDays(Math.max(0, Math.round((todayUtc - then) / 86_400_000)));
  }, [date]);

  if (days === null) return null;

  const label =
    days === 0 ? "today" : days === 1 ? "yesterday" : days < 60 ? `${days} days ago` : `${Math.round(days / 30)} months ago`;

  if (days < staleAfterDays) return <> ({label})</>;

  return (
    <>
      {" "}
      <span
        className="rounded-full border border-amber-400/50 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-[var(--fg)]"
        title="Older than our re-verification target. The sourced claims were true when checked; the ecosystem may have moved."
      >
        {label} — due a re-check
      </span>
    </>
  );
}
