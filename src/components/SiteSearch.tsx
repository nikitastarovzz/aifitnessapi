"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Site-wide search. Dependency-free: fetches /search-index.json (~200
 * records) on first open and scores with simple token matching — at this
 * corpus size that beats shipping a search library. Cmd/Ctrl-K to open,
 * arrows + enter to navigate.
 */

type Rec = [path: string, title: string, desc: string, extra: string];

function score(rec: Rec, tokens: string[]): number {
  const title = rec[1].toLowerCase();
  const desc = rec[2].toLowerCase();
  const extra = rec[3].toLowerCase();
  let total = 0;
  for (const t of tokens) {
    if (title.includes(t)) total += title.startsWith(t) ? 5 : 3;
    else if (extra.includes(t)) total += 2;
    else if (desc.includes(t)) total += 1;
    else return 0; // every token must match somewhere
  }
  return total;
}

export default function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [index, setIndex] = useState<Rec[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    if (index) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((d: Rec[]) => setIndex(d))
      .catch(() => setIndex([]));
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        load();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [load]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else {
      setQ("");
      setSel(0);
    }
  }, [open]);

  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results =
    index && tokens.length
      ? index
          .map((r) => [score(r, tokens), r] as const)
          .filter(([s]) => s > 0)
          .sort((a, b) => b[0] - a[0])
          .slice(0, 8)
          .map(([, r]) => r)
      : [];

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          load();
        }}
        aria-label="Search the site"
        className="flex items-center gap-2 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden rounded border border-[var(--border)] px-1 text-[10px] md:inline">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] bg-black/40 p-4 pt-[12vh] backdrop-blur-sm sm:pt-[18vh]"
          onClick={() => setOpen(false)}
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
              onChange={(e) => {
                setQ(e.target.value);
                setSel(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSel((s) => Math.min(s + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSel((s) => Math.max(s - 1, 0));
                } else if (e.key === "Enter" && results[sel]) {
                  go(results[sel][0]);
                }
              }}
              placeholder="Search 195 pages — try “fitbit 401”, “dedupe”, “pose model”…"
              className="w-full border-b border-[var(--border)] bg-transparent px-5 py-4 text-base text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none"
            />
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {q && index && results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-[var(--muted)]">
                  Nothing matches — try fewer words, or browse the{" "}
                  <a href="/site-index" className="underline">site index</a>.
                </li>
              )}
              {results.map((r, i) => (
                <li key={r[0]}>
                  <button
                    type="button"
                    onClick={() => go(r[0])}
                    onMouseEnter={() => setSel(i)}
                    className={`block w-full rounded-xl px-3 py-2.5 text-left ${
                      i === sel ? "bg-brand-500/10" : ""
                    }`}
                  >
                    <span className="block text-sm font-semibold text-[var(--fg)]">{r[1]}</span>
                    <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                      {r[2] || r[0]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
