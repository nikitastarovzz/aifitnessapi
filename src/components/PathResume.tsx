"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * "Step 3 of 7" on a page that belongs to a reading path (Zeigarnik effect,
 * 2026-11-12).
 *
 * Zeigarnik: people remember an unfinished task better than a finished one,
 * and a visible "3 of 7" is the cue that keeps it in mind. The progress lived
 * only on /paths, so a reader who followed step 3 from there landed on a page
 * that never said it was step 3, or where step 4 was. The step, the path and
 * the next page are server-rendered for everyone; a reader who has started
 * the path also gets their progress and a "Mark this step done" button, from
 * the same browser-local store as PathProgress (afa:path-progress). Nothing
 * leaves the device.
 */
const KEY = "afa:path-progress";
type Store = Record<string, string[]>;
export type PathHere = { slug: string; title: string; steps: { href: string; label: string }[] };

function readStore(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Store = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(v)) out[k] = v.filter((x): x is string => typeof x === "string");
    }
    return out;
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* site data blocked: the tick holds for this view only */
  }
}

export default function PathResume({ current, paths }: { current: string; paths: PathHere[] }) {
  const [store, setStore] = useState<Store | null>(null);
  useEffect(() => setStore(readStore()), []);
  if (paths.length === 0) return null;

  const markDone = (slug: string) => {
    const next = readStore();
    const list = next[slug] ?? [];
    if (!list.includes(current)) next[slug] = [...list, current];
    writeStore(next);
    setStore(next);
  };

  return (
    <section aria-label="Reading path" className="defer-paint not-prose mt-12 space-y-3">
      {paths.map((p) => {
        const at = p.steps.findIndex((s) => s.href === current);
        const done = new Set((store?.[p.slug] ?? []).filter((h) => p.steps.some((s) => s.href === h)));
        const started = done.size > 0;
        const here = done.has(current);
        // The next page: the first unread step after this one, else the first
        // unread step anywhere, else (path finished) none.
        const after = p.steps.slice(at + 1).find((s) => !done.has(s.href));
        const next = after ?? p.steps.find((s) => !done.has(s.href) && s.href !== current);
        const complete = started && done.size === p.steps.length;
        return (
          <div key={p.slug} className="rounded-2xl border border-[var(--border)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Reading path · step {at + 1} of {p.steps.length}
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--fg)]">
              <Link href={`/paths#${p.slug}`} className="hover:text-brand-600">
                {p.title}
              </Link>
            </p>
            <ol aria-hidden className="mt-3 flex gap-1">
              {p.steps.map((s, i) => (
                <li
                  key={s.href}
                  className={`h-1.5 flex-1 rounded-full ${
                    done.has(s.href) ? "bg-brand-500" : i === at ? "bg-brand-500/40" : "bg-[var(--border)]"
                  }`}
                />
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {started && (
                <span className="text-[var(--muted)]" aria-live="polite">
                  {complete ? `All ${p.steps.length} steps done` : `${done.size} of ${p.steps.length} done`}
                </span>
              )}
              {store !== null && !here && (
                <button
                  type="button"
                  onClick={() => markDone(p.slug)}
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--border)] px-3 text-sm text-[var(--fg)] transition-colors hover:border-brand-400 sm:min-h-[36px]"
                >
                  Mark this step done
                </button>
              )}
              {next && (
                <Link
                  href={next.href}
                  className="inline-flex min-h-[44px] items-center font-medium text-brand-600 hover:text-brand-500 sm:min-h-[36px]"
                >
                  Next: {next.label} →
                </Link>
              )}
              {!started && (
                <Link href={`/paths#${p.slug}`} className="inline-flex min-h-[44px] items-center text-[var(--muted)] hover:text-[var(--fg)] sm:min-h-[36px]">
                  See the whole path
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
