"use client";

import { useEffect, useState } from "react";

/**
 * Days remaining until a dated ecosystem event.
 *
 * This is a static site, so "how long have I got" cannot be baked at build
 * time — a page built in August would still claim 40 days in October. The
 * count is therefore computed in the browser.
 *
 * Hydration: the server and the first client render both emit `null`, and the
 * number only appears in the effect. Computing it during render would make
 * the server's HTML (build date) disagree with the client's (today) and React
 * would throw a mismatch.
 *
 * Honesty: `fuzzy` events have no confirmed day (src/data/changes.ts grades
 * "2026-09" as a reported month). For those we render "~N days" and the
 * caller supplies the hedge in the surrounding copy — we never present an
 * inferred day as a countdown to a commitment.
 */
export default function Countdown({ date, fuzzy = false }: { date: string; fuzzy?: boolean }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = Date.parse(`${date}T00:00:00Z`);
    if (Number.isNaN(target)) return;
    const now = new Date();
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    setDays(Math.round((target - todayUtc) / 86_400_000));
  }, [date]);

  if (days === null || days < 0) return null;

  const label =
    days === 0 ? "today" : days === 1 ? "in 1 day" : `in ${fuzzy ? "~" : ""}${days} days`;

  return (
    <span
      className="rounded-full border border-brand-400/50 bg-brand-500/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--fg)]"
      title={fuzzy ? "No confirmed day — counted to the reported month for planning only" : undefined}
    >
      {label}
    </span>
  );
}
