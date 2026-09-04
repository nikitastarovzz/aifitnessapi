"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * The two-way lookup behind /tools/identifier-translator.
 *
 * Apple identifier in, Health Connect record out — and back the other way.
 * The only source is the verified matrix, which is deliberately small: it
 * holds the metrics that were confirmed against BOTH vendors' documentation.
 * When an identifier is not in it the tool says there is no verified
 * counterpart and stops. It never derives an Android name from an Apple one
 * by transliterating it, because "sounds right" is how HRV gets mapped SDNN
 * to RMSSD.
 */

export type TRow = {
  id: string;
  label: string;
  /** Our per-metric guide. */
  href: string;
  /** Apple HealthKit type(s), verbatim from the matrix. */
  apple: string;
  /** Android Health Connect record type(s), verbatim from the matrix. */
  android: string;
  watchOut: string | null;
};

export type AppleName = {
  c: string;
  f: string;
};

type Suggestion = { value: string; side: "Apple" | "Android"; mapped: boolean };

type Result =
  | { kind: "mapped"; row: TRow; from: "Apple" | "Android"; term: string }
  | { kind: "unmapped"; term: string; family: string }
  | { kind: "unknown"; term: string };

const MAX_SUGGESTIONS = 8;

export default function IdentifierTranslator({
  rows,
  appleNames,
}: {
  rows: TRow[];
  appleNames: AppleName[];
}) {
  const index = useMemo(() => {
    // Same parse as src/components/AppStack.tsx: pull the case name out of
    // ".heartRate" or "HKQuantityTypeIdentifier.heartRate".
    const appleToRow = new Map<string, TRow>();
    const androidToRow = new Map<string, TRow>();
    const appleTokens: string[] = [];
    const androidTokens: string[] = [];
    for (const row of rows) {
      for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
        if (!appleToRow.has(m[1].toLowerCase())) appleTokens.push(m[1]);
        appleToRow.set(m[1].toLowerCase(), row);
      }
      for (const m of row.android.matchAll(/\b([A-Z][A-Za-z0-9]*(?:Record|Route))\b/g)) {
        if (!androidToRow.has(m[1].toLowerCase())) androidTokens.push(m[1]);
        androidToRow.set(m[1].toLowerCase(), row);
      }
    }
    const byApple = new Map(appleNames.map((n) => [n.c.toLowerCase(), n]));
    const covered = appleNames.filter((n) => appleToRow.has(n.c.toLowerCase())).length;
    const suggestions: Suggestion[] = [
      ...appleTokens.map((v) => ({ value: v, side: "Apple" as const, mapped: true })),
      ...androidTokens.map((v) => ({ value: v, side: "Android" as const, mapped: true })),
      ...appleNames
        .filter((n) => !appleToRow.has(n.c.toLowerCase()))
        .map((n) => ({ value: n.c, side: "Apple" as const, mapped: false })),
    ];
    return { appleToRow, androidToRow, byApple, covered, suggestions, total: appleNames.length };
  }, [rows, appleNames]);

  const [q, setQ] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const starts: Suggestion[] = [];
    const contains: Suggestion[] = [];
    for (const s of index.suggestions) {
      const v = s.value.toLowerCase();
      if (v.startsWith(needle)) starts.push(s);
      else if (v.includes(needle)) contains.push(s);
    }
    return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
  }, [q, index]);

  function resolve(raw: string) {
    // Accept a pasted "HKQuantityTypeIdentifier.stepCount" as well as a bare case.
    const term = raw.trim().replace(/^HK\w*TypeIdentifier\./, "").replace(/^\./, "");
    const key = term.toLowerCase();
    setQ(term);
    setOpen(false);
    if (!term) {
      setResult(null);
      return;
    }
    const appleRow = index.appleToRow.get(key);
    if (appleRow) {
      setResult({ kind: "mapped", row: appleRow, from: "Apple", term });
      return;
    }
    const androidRow = index.androidToRow.get(key);
    if (androidRow) {
      setResult({ kind: "mapped", row: androidRow, from: "Android", term });
      return;
    }
    const known = index.byApple.get(key);
    if (known) {
      setResult({ kind: "unmapped", term: known.c, family: known.f });
      return;
    }
    setResult({ kind: "unknown", term });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && suggestions.length > 0) resolve(suggestions[Math.min(active, suggestions.length - 1)].value);
      else resolve(q);
      return;
    }
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
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="mt-8">
      <label htmlFor="xlate-input" className="block text-sm font-semibold text-[var(--fg)]">
        Apple identifier or Android record name
      </label>
      <div className="relative mt-2">
        <input
          id="xlate-input"
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="xlate-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            open && suggestions.length > 0 ? `xlate-opt-${Math.min(active, suggestions.length - 1)}` : undefined
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
          placeholder="heartRateVariabilitySDNN or HeartRateVariabilityRmssdRecord"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--fg)] placeholder:font-sans placeholder:text-[var(--muted)]"
        />
        {open && suggestions.length > 0 && (
          <ul
            id="xlate-listbox"
            role="listbox"
            aria-label="Matching identifiers and record types"
            className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg"
          >
            {suggestions.map((s, i) => (
              <li
                key={`${s.side}-${s.value}`}
                id={`xlate-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  resolve(s.value);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 ${
                  i === active ? "bg-brand-500/10" : ""
                }`}
              >
                <code className="font-mono text-[13px] text-[var(--fg)]">{s.value}</code>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                  {s.side}
                  {s.mapped ? "" : " · unmapped"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        {index.covered} of {index.total} Apple identifiers have a counterpart verified against both
        vendors&rsquo; documentation, across {rows.length} metrics.
      </p>

      <div aria-live="polite" className="mt-6">
        {!result ? (
          <p className="text-sm text-[var(--muted)]">
            Type a name and press Enter. Nothing here is transliterated: a counterpart appears only
            where both vendors&rsquo; own documentation was checked.
          </p>
        ) : result.kind === "mapped" ? (
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {result.row.label} · matched on the {result.from} side
            </p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Apple HealthKit
                </dt>
                <dd className="mt-1.5 font-mono text-[13px] leading-relaxed text-[var(--fg)]">
                  {result.row.apple}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Android Health Connect
                </dt>
                <dd className="mt-1.5 font-mono text-[13px] leading-relaxed text-[var(--fg)]">
                  {result.row.android}
                </dd>
              </div>
            </dl>
            {result.row.watchOut && (
              <p className="mt-4 rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm leading-relaxed text-[var(--fg)]">
                <span className="font-semibold">Watch out: </span>
                {result.row.watchOut}
              </p>
            )}
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href={result.row.href} className="font-medium text-brand-600 hover:text-brand-500">
                The {result.row.label.toLowerCase()} guide
              </Link>
              <Link
                href={`/matrix#${result.row.id}`}
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                This row in the matrix
              </Link>
            </p>
          </article>
        ) : result.kind === "unmapped" ? (
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-mono text-sm font-bold text-[var(--fg)]">{result.term}</code>
              <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                {result.family} type
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg)]">
              No verified Android counterpart. This site maps only what it has checked against both
              vendors&rsquo; documentation — {index.covered} of {index.total} identifiers so far.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              That is a gap in this site&rsquo;s verification, not proof that Health Connect lacks
              the record. Check the Android record list yourself rather than guessing a name from
              the Apple one.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link
                href="/health-connect-records"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                Every Health Connect record type
              </Link>
              <Link
                href={`/healthkit-identifiers#id-${result.term.toLowerCase()}`}
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                This identifier on the Apple reference
              </Link>
            </p>
          </article>
        ) : (
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-[var(--fg)]">
              <code className="font-mono">{result.term}</code> is not an Apple identifier in this
              site&rsquo;s dataset, and not a Health Connect record name in the verified matrix.
              Nothing is guessed from a near-miss spelling.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link
                href="/healthkit-identifiers"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                Every HealthKit type identifier
              </Link>
              <Link
                href="/health-connect-records"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                Every Health Connect record type
              </Link>
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
