"use client";

import { useMemo, useState } from "react";

/**
 * Interactive day-boundary explorer. Everything is computed in the browser
 * from the platform's own IANA tz database via Intl.DateTimeFormat — no data
 * we ship, no numbers we assert, so it cannot go stale or be wrong about a
 * zone. It demonstrates the bug the /architecture/timezones page describes:
 * "today" is a civil-date question, DST days are not 24 hours, and a UTC
 * range is the wrong tool for a daily total.
 */

const ZONES = [
  "America/Los_Angeles",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

// Offset (minutes east of UTC) for an instant in a zone, from the platform tzdb.
function offsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(dtf.formatToParts(date).map((p) => [p.type, p.value]));
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour === "24" ? "0" : parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

// Local civil midnight (as a UTC instant) that starts the local day containing `date`.
function localMidnightUTC(date: Date, timeZone: string): Date {
  const off = offsetMinutes(date, timeZone);
  const local = new Date(date.getTime() + off * 60000);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const d = local.getUTCDate();
  // Re-resolve the offset at local midnight itself (it can differ on a DST day).
  let guess = new Date(Date.UTC(y, m, d, 0, 0, 0) - off * 60000);
  const off2 = offsetMinutes(guess, timeZone);
  if (off2 !== off) guess = new Date(Date.UTC(y, m, d, 0, 0, 0) - off2 * 60000);
  return guess;
}

const fmt = (d: Date, tz: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);

const fmtUTC = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d) + " UTC";

export default function DayBoundaryDemo() {
  const [zone, setZone] = useState("America/Los_Angeles");
  // A date guaranteed to contain a DST transition somewhere — default to a
  // spring-forward window; the user can also probe "now".
  const [probe, setProbe] = useState<"dst" | "now">("dst");

  const result = useMemo(() => {
    // Pick an instant: a US spring-forward Sunday afternoon, or now.
    const instant =
      probe === "now"
        ? new Date()
        : // 2026-03-08 is the US spring-forward date; 18:00 UTC lands mid-day US.
          new Date(Date.UTC(2026, 2, 8, 18, 0, 0));

    const dayStart = localMidnightUTC(instant, zone);
    // Next local midnight = start of the following civil day.
    const nextGuess = new Date(dayStart.getTime() + 26 * 3600 * 1000);
    const dayEnd = localMidnightUTC(nextGuess, zone);
    const hours = Math.round((dayEnd.getTime() - dayStart.getTime()) / 3600000);

    const offStart = offsetMinutes(dayStart, zone);
    const offEnd = offsetMinutes(new Date(dayEnd.getTime() - 60000), zone);
    const dstShift = offEnd - offStart;

    return { instant, dayStart, dayEnd, hours, offStart, offEnd, dstShift };
  }, [zone, probe]);

  const offLabel = (min: number) => {
    const sign = min >= 0 ? "+" : "−";
    const a = Math.abs(min);
    return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
  };

  return (
    <div className="not-prose rounded-2xl border border-[var(--border)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-[var(--fg)]">
          User&rsquo;s timezone:
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="ml-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm"
          >
            {ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </label>
        <div className="inline-flex overflow-hidden rounded-lg border border-[var(--border)] text-sm">
          <button
            type="button"
            onClick={() => setProbe("dst")}
            className={`px-3 py-1 ${probe === "dst" ? "bg-brand-500/15 font-semibold text-brand-600" : "text-[var(--muted)]"}`}
          >
            A DST changeover day
          </button>
          <button
            type="button"
            onClick={() => setProbe("now")}
            className={`px-3 py-1 ${probe === "now" ? "bg-brand-500/15 font-semibold text-brand-600" : "text-[var(--muted)]"}`}
          >
            Today
          </button>
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[var(--muted)]">Local day starts</dt>
          <dd className="font-medium text-[var(--fg)]">{fmt(result.dayStart, zone)}</dd>
          <dd className="text-xs text-[var(--muted)]">= {fmtUTC(result.dayStart)}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Local day ends</dt>
          <dd className="font-medium text-[var(--fg)]">{fmt(result.dayEnd, zone)}</dd>
          <dd className="text-xs text-[var(--muted)]">= {fmtUTC(result.dayEnd)}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">UTC offset that day</dt>
          <dd className="font-medium text-[var(--fg)]">
            {offLabel(result.offStart)}
            {result.dstShift !== 0 && ` → ${offLabel(result.offEnd)}`}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Length of this civil day</dt>
          <dd
            className={`text-lg font-bold ${result.hours === 24 ? "text-[var(--fg)]" : "text-brand-600"}`}
          >
            {result.hours} hours
            {result.hours !== 24 && (
              <span className="ml-1 text-xs font-normal text-[var(--muted)]">
                (not 24 — DST {result.dstShift > 0 ? "spring forward" : "fall back"})
              </span>
            )}
          </dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-[var(--border)] pt-4 text-sm leading-relaxed text-[var(--muted)]">
        {result.hours === 24 ? (
          <>
            Today this zone is a clean 24 hours — but pick a DST changeover day and watch the number
            change. A query that sums &ldquo;today&rsquo;s steps&rdquo; over a fixed 24-hour UTC
            window will silently include or drop an hour of activity on the days it moves.
          </>
        ) : (
          <>
            This civil day is <strong>{result.hours} hours long</strong>, not 24. If your daily total
            queries a fixed <code>[midnight, midnight+24h)</code> UTC range, you just{" "}
            {result.dstShift > 0 ? "dropped" : "double-counted"} an hour of this user&rsquo;s data —
            the classic bug that makes step counts and streaks wrong twice a year. Store the local
            civil date, not just the instant.
          </>
        )}
      </p>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Computed live in your browser from its own IANA timezone database — nothing here is a number
        we hardcoded.
      </p>
    </div>
  );
}
