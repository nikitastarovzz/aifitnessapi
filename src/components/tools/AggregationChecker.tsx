"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

/**
 * The type-ahead behind /tools/aggregation-checker.
 *
 * Picking .cumulativeSum where Apple describes a discrete type does not throw
 * — HKStatisticsQuery returns a plausible, wrong number. This answers the
 * question for one identifier at a time, and where Apple's wording does not
 * state an aggregation style it says "not stated" rather than filling the gap.
 *
 * Rows are trimmed server-side (the full identifier dataset is 332 KB) but
 * every field below is copied from it verbatim, including the evidence
 * sentence each derived value came from.
 */

export type AggRow = {
  /** Swift case. */
  c: string;
  /** Objective-C constant. */
  o: string;
  f: "quantity" | "category";
  /** Apple's abstract, verbatim. */
  a: string;
  agg: "cumulative" | "discrete" | null;
  /** The sentence `agg` was derived from; null where Apple does not state it. */
  ev: string | null;
  /** Unit family; null where Apple's wording does not state one. */
  u: string | null;
  /** Category value enum. */
  ve: string | null;
  /** Group page slug and label. */
  gs: string;
  gl: string;
  /** Apple's read-only evidence sentence, or null when not flagged read-only. */
  ro: string | null;
};

const MAX_SUGGESTIONS = 8;

export default function AggregationChecker({
  rows,
  fetchedOn,
}: {
  rows: AggRow[];
  fetchedOn: string;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<AggRow | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const starts: AggRow[] = [];
    const contains: AggRow[] = [];
    for (const r of rows) {
      const c = r.c.toLowerCase();
      if (c.startsWith(needle)) starts.push(r);
      else if (c.includes(needle) || r.o.toLowerCase().includes(needle) || r.a.toLowerCase().includes(needle))
        contains.push(r);
    }
    return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
  }, [q, rows]);

  function choose(r: AggRow) {
    setSelected(r);
    setQ(r.c);
    setOpen(false);
    setActive(0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === "ArrowDown") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(suggestions[Math.min(active, suggestions.length - 1)]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const quantityCount = rows.filter((r) => r.f === "quantity").length;
  const categoryCount = rows.length - quantityCount;

  return (
    <div className="mt-8">
      <label htmlFor="agg-input" className="block text-sm font-semibold text-[var(--fg)]">
        Type an identifier
      </label>
      <div className="relative mt-2">
        <input
          id="agg-input"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="agg-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            open && suggestions.length > 0 ? `agg-opt-${Math.min(active, suggestions.length - 1)}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="stepCount, heartRate, sleepAnalysis…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--fg)] placeholder:font-sans placeholder:text-[var(--muted)]"
        />
        {open && suggestions.length > 0 && (
          <ul
            id="agg-listbox"
            role="listbox"
            aria-label="Matching HealthKit identifiers"
            className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg"
          >
            {suggestions.map((r, i) => (
              <li
                key={r.c}
                id={`agg-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(r);
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-3 py-2 ${i === active ? "bg-brand-500/10" : ""}`}
              >
                <code className="font-mono text-[13px] font-semibold text-[var(--fg)]">{r.c}</code>
                <span className="ml-2 text-[11px] uppercase tracking-wide text-[var(--muted)]">{r.f}</span>
                <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{r.a}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        {quantityCount} quantity types and {categoryCount} category types, read from Apple&rsquo;s
        documentation on {fetchedOn}. Arrow keys to move, Enter to pick, Escape to close.
      </p>

      <div aria-live="polite" className="mt-6">
        {!selected ? (
          <p className="text-sm text-[var(--muted)]">
            Pick an identifier to see whether Apple describes it as cumulative or discrete — and the
            sentence that says so.
          </p>
        ) : (
          <Verdict row={selected} />
        )}
      </div>
    </div>
  );
}

function Verdict({ row }: { row: AggRow }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <code className="font-mono text-sm font-bold text-[var(--fg)]">{row.c}</code>
        {row.ro && (
          <details className="inline-block">
            <summary className="cursor-pointer list-none rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
              read-only
            </summary>
            <span className="mt-1 block max-w-md text-xs text-[var(--muted)]">
              Apple&rsquo;s wording: <q>{row.ro}</q>
            </span>
          </details>
        )}
      </div>
      <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">{row.o}</p>
      <p className="mt-2 text-sm text-[var(--fg)]">{row.a}</p>

      {row.f === "quantity" ? (
        <>
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Aggregate with
            </p>
            <p className="mt-1.5">
              {row.agg === "cumulative" ? (
                <code className="rounded-lg border border-brand-400/60 bg-brand-500/10 px-2.5 py-1 font-mono text-base font-semibold text-[var(--fg)]">
                  .cumulativeSum
                </code>
              ) : row.agg === "discrete" ? (
                <code className="rounded-lg border border-amber-400/50 bg-amber-500/10 px-2.5 py-1 font-mono text-base font-semibold text-[var(--fg)]">
                  .discreteAverage
                </code>
              ) : (
                <span className="text-base font-semibold text-[var(--fg)]">not stated</span>
              )}
            </p>
            {row.ev ? (
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                <span className="font-semibold">Apple&rsquo;s wording: </span>
                <q>{row.ev}</q>
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Apple&rsquo;s documentation does not state an aggregation style for this type, so
                this site does not assign one. Treat any behaviour you observe as unverified —{" "}
                <Link href="/healthkit-status" className="font-medium text-brand-600 hover:text-brand-500">
                  the status page
                </Link>{" "}
                lists the types Apple ships without documentation.
              </p>
            )}
          </div>

          <p className="mt-4 text-sm text-[var(--muted)]">
            <span className="font-semibold text-[var(--fg)]">Unit family: </span>
            {row.u ? (
              <code className="font-mono text-xs">{row.u}</code>
            ) : (
              <span>not stated by Apple</span>
            )}
          </p>
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Category type
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg)]">
            Category types carry an enum, not a number — there is no aggregation style to pick,
            because there is nothing to sum or average. The sample is decoded through its value
            enum.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            <span className="font-semibold text-[var(--fg)]">Value enum: </span>
            {row.ve ? (
              <code className="font-mono text-xs">{row.ve}</code>
            ) : (
              <span>not stated by Apple for this identifier</span>
            )}
          </p>
          <p className="mt-3 text-sm">
            <Link
              href="/healthkit-category-values"
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              Every HKCategoryValue enum
            </Link>
          </p>
        </div>
      )}

      <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link
          href={`/healthkit-identifiers#id-${row.c.toLowerCase()}`}
          className="font-medium text-brand-600 hover:text-brand-500"
        >
          This row on the full reference
        </Link>
        <Link href={`/healthkit/${row.gs}`} className="font-medium text-brand-600 hover:text-brand-500">
          {row.gl} types
        </Link>
      </p>
    </article>
  );
}
