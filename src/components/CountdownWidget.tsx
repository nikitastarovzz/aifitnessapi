"use client";

import { useEffect, useState } from "react";
import { countdownParts, daysBetween, fmtStatedDate, periodWords, pickNext } from "@/lib/stackFeeds.mjs";
import type { DeadlineItem } from "@/lib/vendorDeadlines";

/**
 * The live part of /embed/countdown/<id> (ops/AUDIENCE-30-2026-11-05.md item 26).
 *
 * A static widget cannot know today's date, and one embedded on somebody's
 * page outlives the build by months. So the server HTML (crawlers, no-JS
 * readers, the first client render) makes no ahead-or-past claim: it lists
 * the dated items as the source states them. After mount, the reader's clock
 * picks the next item still ahead and the count ticks every second.
 *
 * What the count means is printed under it, because the sources give days,
 * not times: an exact day is counted to 00:00 UTC on that day, and a stated
 * month or year to the last day of that period. A fuzzy date is never shown
 * as a precise moment, and is never said to have passed before its whole
 * period has (src/data/graveyard.ts, "never sharpen").
 */

const pad = (n: number) => String(n).padStart(2, "0");

function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function gradeNote(i: DeadlineItem): string {
  if (i.source === "change") {
    return i.grade === "confirmed"
      ? "confirmed: the vendor's own words are quoted on the linked page"
      : "reported: consistent notices, no official page we could verify";
  }
  return `${i.grade} in the Fitness API Graveyard, from ${i.publisher ?? "the vendor"}'s own page`;
}

function Meaning({ i }: { i: DeadlineItem }) {
  return (
    <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
      {i.exact
        ? `Counted to 00:00 UTC on ${fmtStatedDate(i.date)}. The source names a day, not a time.`
        : `The source states ${fmtStatedDate(i.date)} and no day, so this counts to ${periodWords(i.date)}.`}
    </p>
  );
}

function ItemLine({ i, abs }: { i: DeadlineItem; abs: (p: string) => string }) {
  return (
    <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--muted)]">
      <a href={abs(i.href)} target="_blank" rel="noreferrer" className="font-medium text-brand-600 hover:text-brand-500">
        {i.label}{" "}&rarr;
      </a>{" "}
      &middot; {gradeNote(i)} &middot; checked {fmtStatedDate(i.checkedOn)}
    </p>
  );
}

export default function CountdownWidget({
  name,
  kind,
  items,
  origin,
}: {
  name: string;
  kind: "vendor" | "entry";
  /** Latest target first. */
  items: DeadlineItem[];
  origin: string;
}) {
  const now = useNow();
  const abs = (p: string) => `${origin}${p}`;

  if (now === null) {
    // Server HTML: the dated items as stated, no verdict about today.
    return (
      <div data-countdown-static="">
        <p className="text-[11px] text-[var(--muted)]">
          {kind === "vendor"
            ? `Dated items for ${name} in this site's changes tracker and graveyard, latest first. The countdown starts when the page loads.`
            : "The countdown starts when the page loads."}
        </p>
        <ul className="mt-2 space-y-2">
          {items.slice(0, 4).map((i) => (
            <li key={i.key} className="rounded-xl border border-[var(--border)] p-2.5" data-countdown-item={i.date}>
              <p className="text-xs font-semibold text-[var(--fg)]">
                {fmtStatedDate(i.date)} &middot; {i.title}
              </p>
              <ItemLine i={i} abs={abs} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const today = new Date(now).toISOString().slice(0, 10);
  const pick = pickNext(items, today);
  if (!pick) return null;
  const { item, ahead, rest } = pick;
  const parts = countdownParts(item.target, now);

  return (
    <div aria-live="off">
      <p className="text-xs font-bold leading-snug tracking-tight text-[var(--fg)]">{item.title}</p>
      {ahead && parts ? (
        <>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums text-[var(--fg)]">
            <span>
              <span className="text-3xl font-bold tracking-tight">{parts.days}</span>{" "}
              <span className="text-xs text-[var(--muted)]">{parts.days === 1 ? "day" : "days"}</span>
            </span>
            <span className="text-lg font-semibold">
              {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
            </span>
          </p>
          <Meaning i={item} />
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--fg)]">
          {kind === "vendor" ? (
            <>
              No dated item for {name} is still ahead in the tracker. The latest, {fmtStatedDate(item.date)}, was{" "}
              {Math.max(0, -daysBetween(today, item.target))} days ago.
            </>
          ) : (
            <>
              This date, {fmtStatedDate(item.date)}, passed {Math.max(0, -daysBetween(today, item.target))} days ago.
              The status below is what the source said when it was last read.
            </>
          )}
        </p>
      )}
      {item.quote && (
        <blockquote className="mt-2 border-l-2 border-[var(--border)] pl-2 text-[11px] italic leading-relaxed text-[var(--muted)]">
          &ldquo;{item.quote.length > 320 ? `${item.quote.slice(0, 319).trimEnd()}…` : item.quote}&rdquo;
          {item.publisher ? ` — ${item.publisher}` : ""}
        </blockquote>
      )}
      <ItemLine i={item} abs={abs} />
      {rest.length > 0 && (
        <ul className="mt-2.5 space-y-1 border-t border-[var(--border)] pt-2 text-[11px] text-[var(--muted)]">
          {rest.slice(0, 3).map((r) => (
            <li key={r.key}>
              Then: {fmtStatedDate(r.date)} &middot; {r.title} &middot; in{" "}
              {r.exact ? "" : "~"}
              {daysBetween(today, r.target)} days
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
