"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { scoreRec, reportMiss, type Rec } from "@/lib/searchScore";

/**
 * Site-wide command palette. Dependency-free: fetches /search-index.json on
 * first open and scores with simple token matching — at this corpus size that
 * beats shipping a search library. ⌘K / Ctrl-K toggles it from anywhere, "/"
 * opens it when you are not already typing, arrows + enter navigate, escape
 * closes and hands focus back to whatever had it.
 *
 * The index carries one record per page AND one per FAQ answer, so a typed
 * question can match the answer itself rather than the title of the page
 * that happens to contain it. Matched answers are shown inline — for a lot
 * of queries the palette IS the answer, and making somebody load a page to
 * read two sentences they already had is a worse product.
 *
 * Three matching passes, in order, each only reached when the one before it
 * finds nothing site-wide:
 *
 *  1. `scoreRec` — the exact-substring scorer shared with the /search page,
 *     so the palette and the results page can never disagree about the best
 *     answer for a query that matches plainly.
 *  2. The same scorer over de-camelCased tokens, because somebody debugging
 *     types the identifier — `stepCount`, `errorNoData`, `HKUnit` — and our
 *     prose spells it out in words.
 *  3. A subsequence pass, so a typo or a half-remembered word still lands.
 *
 * On top of whichever pass matched, a record whose title carries the reader's
 * identifier *verbatim, case included* is boosted hard. `HKUnit` typed with
 * those capitals is not a guess about the topic; it is the name of a thing,
 * and the page named after it should be first.
 */

/** Is this token an identifier rather than a word? `stepCount` (lower→upper)
 *  or `HKUnit` (an initialism butted against a word) both qualify. */
function isIdentifier(t: string): boolean {
  return /^[A-Za-z][A-Za-z0-9.]*$/.test(t) && (/[a-z][A-Z]/.test(t) || /[A-Z]{2}[a-z]/.test(t));
}

/** `stepCount` → `step count`, `HKUnit` → `hk unit`. */
function decamel(t: string): string {
  return t
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase();
}

/**
 * Subsequence match: every character of `t` appears in `hay` in order.
 * Scored so a tight, early, few-gaps match beats a match scattered across the
 * string — otherwise every long description matches every short query.
 */
function subseq(t: string, hay: string): number {
  let i = 0;
  let start = -1;
  let prev = -2;
  let runs = 0;
  for (let h = 0; h < hay.length && i < t.length; h++) {
    if (hay[h] === t[i]) {
      if (start < 0) start = h;
      if (h !== prev + 1) runs++;
      prev = h;
      i++;
    }
  }
  if (i < t.length) return 0;
  const span = prev - start + 1;
  return (t.length / span) * (1 / runs) * (start === 0 ? 1.4 : 1);
}

function fuzzyScore(rec: Rec, tokens: string[]): number {
  const title = rec[1].toLowerCase();
  const rest = `${rec[2].toLowerCase()} ${(rec[3] ?? "").toLowerCase()}`;
  let total = 0;
  for (const t of tokens) {
    // One- and two-letter tokens are a subsequence of nearly everything, so
    // fuzzing them turns the palette into noise.
    if (t.length < 3) return 0;
    const inTitle = subseq(t, title);
    const score = inTitle > 0 ? inTitle * 2 : subseq(t, rest) * 0.6;
    if (score === 0) return 0;
    total += score;
  }
  return total;
}

/** Verbatim, case-sensitive identifier hit — the strongest signal we have. */
function identifierBoost(rec: Rec, raw: string[]): number {
  let boost = 0;
  for (const t of raw) {
    if (!isIdentifier(t)) continue;
    if (rec[1].includes(t)) boost += 6;
    else if (rec[2].includes(t) || (rec[3] ?? "").includes(t)) boost += 3;
  }
  return boost;
}

/** Passes 1 and 2: plain substring matching, then the same over spelled-out
 *  identifiers. Zero means "this record does not plainly match". */
function strictScore(rec: Rec, raw: string[], lower: string[], spelled: string[]): number {
  let s = scoreRec(rec, lower);
  if (s === 0 && spelled !== lower) s = scoreRec(rec, spelled);
  return s === 0 ? 0 : s + identifierBoost(rec, raw);
}

/**
 * How far below the best fuzzy hit a fuzzy hit may be and still be shown.
 * Subsequence matching finds *something* in almost every record, so without
 * this the one page you meant arrives with seven pages of coincidence behind
 * it — and a palette whose eighth row is noise trains people not to read past
 * the first.
 */
const FUZZY_CUTOFF = 0.35;
const FUZZY_MAX = 6;

/** The index, fetched once per page load and kept across opens — the
 *  palette unmounts when it closes, the module (and this) does not. */
let cachedIndex: Rec[] | null = null;
let pendingIndex: Promise<Rec[]> | null = null;
function loadIndex(): Promise<Rec[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  pendingIndex ??= fetch("/search-index.json")
    .then((r) => r.json())
    .then((d: Rec[]) => (cachedIndex = d))
    .catch(() => (cachedIndex = []));
  return pendingIndex;
}

/**
 * The open palette. Loaded on first open by SiteSearch (next/dynamic,
 * ssr:false), so the scorer, the matching passes and this markup stay out of
 * the JavaScript every page downloads; SiteSearch keeps the button and the
 * keyboard shortcuts, and owns open/close and focus return.
 */
export default function SearchPalette({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [index, setIndex] = useState<Rec[] | null>(cachedIndex);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let live = true;
    loadIndex().then((d) => {
      if (live) setIndex(d);
    });
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, []);

  const raw = useMemo(() => q.split(/\s+/).filter(Boolean), [q]);
  const results = useMemo(() => {
    if (!index || raw.length === 0) return [];
    const lower = raw.map((t) => t.toLowerCase());
    const spelled = raw.some(isIdentifier)
      ? raw.map((t) => (isIdentifier(t) ? decamel(t) : t.toLowerCase()))
      : lower;

    const strict = index
      .map((r) => [strictScore(r, raw, lower, spelled), r] as const)
      .filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0]);
    if (strict.length) return strict.slice(0, 8).map(([, r]) => r);

    // Nothing matched plainly — only now is a typo the likeliest explanation.
    const fuzzy = index
      .map((r) => [fuzzyScore(r, lower) + identifierBoost(r, raw), r] as const)
      .filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0]);
    if (!fuzzy.length) return [];
    const floor = fuzzy[0][0] * FUZZY_CUTOFF;
    return fuzzy
      .filter(([s]) => s >= floor)
      .slice(0, FUZZY_MAX)
      .map(([, r]) => r);
  }, [index, raw]);

  // Keep the highlighted row on screen when the arrows walk past the fold.
  useEffect(() => {
    const el = listRef.current?.children[sel];
    if (el instanceof HTMLElement) el.scrollIntoView({ block: "nearest" });
  }, [sel]);

  // A query that matches nothing is a content request; log the words.
  const missed = useRef<string>("");
  useEffect(() => {
    if (!index || raw.length === 0 || results.length > 0 || missed.current === q) return;
    const t = setTimeout(() => {
      missed.current = q;
      reportMiss(q);
    }, 1400);
    return () => clearTimeout(t);
  }, [index, raw.length, results.length, q]);

  const go = onNavigate;
  const optionId = (i: number) => `site-search-option-${i}`;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/40 p-4 pt-[12vh] backdrop-blur-sm sm:pt-[18vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <div
        className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={q}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="site-search-results"
          aria-activedescendant={results[sel] ? optionId(sel) : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((s) => (results.length ? (s + 1) % results.length : 0));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((s) => (results.length ? (s - 1 + results.length) % results.length : 0));
            } else if (e.key === "Home" && results.length) {
              e.preventDefault();
              setSel(0);
            } else if (e.key === "End" && results.length) {
              e.preventDefault();
              setSel(results.length - 1);
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (results[sel]) go(results[sel][0]);
              else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
            }
          }}
          placeholder="Search pages and answers — try “fitbit 401”, “dedupe”, “stepCount”…"
          className="w-full border-b border-[var(--border)] bg-transparent px-5 py-4 text-base text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none"
        />
        <ul
          id="site-search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[50vh] overflow-y-auto p-2"
        >
          {q && index && results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-[var(--muted)]">
              Nothing matches — try fewer words, or browse the{" "}
              <a href="/site-index" className="underline">site index</a>.
            </li>
          )}
          {results.map((r, i) => (
            <li key={r[0]} id={optionId(i)} role="option" aria-selected={i === sel}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => go(r[0])}
                onMouseEnter={() => setSel(i)}
                className={`block w-full rounded-xl px-3 py-2.5 text-left ${
                  i === sel ? "bg-brand-500/10" : ""
                }`}
              >
                {r[4] === "faq" && (
                  <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                    Answer
                  </span>
                )}
                <span className="block text-sm font-semibold text-[var(--fg)]">{r[1]}</span>
                <span
                  className={`mt-0.5 block text-xs text-[var(--muted)] ${
                    r[4] === "faq" ? "" : "truncate"
                  }`}
                >
                  {r[2] || r[0]}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] px-4 py-2.5 text-xs text-[var(--muted)]">
          {q ? (
            <button
              type="button"
              className="text-brand-600 hover:text-brand-500"
              onClick={() => go(`/search?q=${encodeURIComponent(q)}`)}
            >
              See all results for “{q}” →
            </button>
          ) : (
            <span>Type an error, a question, or a HealthKit identifier.</span>
          )}
          <span className="hidden sm:inline">↑↓ to move · ↵ to open · esc to close</span>
        </div>
      </div>
    </div>
  );
}
