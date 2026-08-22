"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { scoreRec, reportMiss, type Rec } from "@/lib/searchScore";

/**
 * The full-page search results view behind /search?q=…
 *
 * It exists for three reasons the ⌘K palette cannot serve: a shareable URL
 * for a query, a real target for the sitelinks SearchAction and the
 * OpenSearch descriptor (both of which need a page, not a dialog), and room
 * to show FAQ answers inline instead of eight truncated titles.
 *
 * Same index, same scoring as the palette — one implementation of relevance,
 * so the two can never disagree about what the best answer is.
 */

export default function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [index, setIndex] = useState<Rec[] | null>(null);
  const reported = useRef<string>("");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((d: Rec[]) => setIndex(d))
      .catch(() => setIndex([]));
  }, []);

  const tokens = useMemo(() => q.toLowerCase().split(/\s+/).filter(Boolean), [q]);
  const results = useMemo(() => {
    if (!index || tokens.length === 0) return [];
    return index
      .map((r) => [scoreRec(r, tokens), r] as const)
      .filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 40)
      .map(([, r]) => r);
  }, [index, tokens]);

  useEffect(() => {
    if (!index || tokens.length === 0 || results.length > 0) return;
    if (reported.current === q) return;
    reported.current = q;
    const t = setTimeout(() => reportMiss(q), 1200);
    return () => clearTimeout(t);
  }, [index, tokens, results, q]);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
        }}
      >
        <label htmlFor="q" className="sr-only">
          Search AIFitnessAPI
        </label>
        <input
          id="q"
          name="q"
          value={q}
          autoFocus
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search every page — try “fitbit 401”, “dedupe steps”, “rep counting”…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-base text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-brand-400 focus:outline-none"
        />
      </form>

      {index === null && <p className="mt-6 text-sm text-[var(--muted)]">Loading the index…</p>}

      {index !== null && tokens.length > 0 && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          {results.length === 0
            ? "Nothing matches."
            : `${results.length}${results.length === 40 ? "+" : ""} result${results.length === 1 ? "" : "s"}`}
        </p>
      )}

      {index !== null && tokens.length > 0 && results.length === 0 && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Try fewer words, or browse the{" "}
          <Link href="/site-index" className="text-brand-600 underline">
            site index
          </Link>
          . We log searches that find nothing (the query only — nothing about you) and
          write the pages they ask for.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {results.map((r) => (
          <li key={r[0]}>
            <Link
              href={r[0]}
              className="block rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              {r[4] === "faq" && (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                  Answer
                </span>
              )}
              <span className="block text-sm font-semibold text-[var(--fg)]">{r[1]}</span>
              <span className="mt-1 block text-sm text-[var(--muted)]">{r[2]}</span>
              <span className="mt-1 block text-xs text-[var(--muted)]">{r[0]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
