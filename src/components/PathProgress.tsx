"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PathStep } from "@/data/readingPaths";

/**
 * A reading path's step list, with per-step completion kept in the browser.
 *
 * No accounts and no server: ticking a step writes to localStorage and
 * nothing leaves the device. That is a deliberate ceiling on the feature —
 * progress does not follow you to another browser, and the empty state says
 * so rather than implying a sync that does not exist.
 *
 * The steps themselves are rendered here rather than by the server page so
 * the checkbox can sit inside the card, but this component is still
 * server-rendered on first paint: the links are in the HTML for a crawler
 * with no JavaScript, and the ticks are layered on afterwards. Every storage
 * access is wrapped — a browser with site data blocked throws on the
 * `localStorage` getter itself, and the page must still work there. In that
 * case ticks simply do not persist.
 */

const KEY = "afa:path-progress";

type Store = Record<string, string[]>;

function readStore(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
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
    /* private mode, quota, or site data blocked — the UI stays correct for
       this session and simply forgets on reload. */
  }
}

export default function PathProgress({ slug, steps }: { slug: string; steps: PathStep[] }) {
  // `null` until the browser has been read, so the server HTML and the first
  // client render agree (nothing ticked, no counter).
  const [done, setDone] = useState<string[] | null>(null);

  useEffect(() => {
    setDone(readStore()[slug] ?? []);
  }, [slug]);

  const toggle = useCallback(
    (href: string) => {
      setDone((current) => {
        const list = current ?? [];
        const next = list.includes(href) ? list.filter((h) => h !== href) : [...list, href];
        const store = readStore();
        if (next.length) store[slug] = next;
        else delete store[slug];
        writeStore(store);
        return next;
      });
    },
    [slug],
  );

  const reset = useCallback(() => {
    const store = readStore();
    delete store[slug];
    writeStore(store);
    setDone([]);
  }, [slug]);

  const isDone = (href: string) => done !== null && done.includes(href);
  const count = done === null ? 0 : steps.filter((s) => done.includes(s.href)).length;
  const complete = done !== null && count === steps.length;

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {done === null ? (
          <span className="text-[var(--muted)]">{steps.length} steps</span>
        ) : (
          <>
            <span
              className={
                complete
                  ? "rounded-full border border-brand-400/40 bg-brand-500/10 px-2.5 py-0.5 font-medium text-brand-600"
                  : "text-[var(--muted)]"
              }
            >
              {complete ? `All ${steps.length} steps done` : `${count} of ${steps.length} done`}
            </span>
            {count > 0 && (
              <button
                type="button"
                onClick={reset}
                className="text-xs text-[var(--muted)] underline underline-offset-2 hover:text-[var(--fg)]"
              >
                Reset
              </button>
            )}
          </>
        )}
      </div>

      <ol className="mt-5 space-y-3">
        {steps.map((step, i) => {
          const ticked = isDone(step.href);
          return (
            <li key={step.href}>
              <div
                className={`flex gap-4 rounded-2xl border p-4 transition-colors sm:p-5 ${
                  ticked
                    ? "border-brand-400/40 bg-brand-500/5"
                    : "border-[var(--border)] hover:border-brand-400"
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={ticked}
                  onClick={() => toggle(step.href)}
                  title={ticked ? "Mark as not read" : "Mark as read"}
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors ${
                    ticked
                      ? "border-brand-500 bg-brand-600 text-white"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400"
                  }`}
                >
                  {ticked ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  ) : (
                    <span aria-hidden>{i + 1}</span>
                  )}
                  <span className="sr-only">
                    Step {i + 1}: {step.label}
                  </span>
                </button>
                <div className="min-w-0">
                  <Link
                    href={step.href}
                    className={`text-base font-semibold text-[var(--fg)] hover:text-brand-600 ${
                      ticked ? "line-through decoration-[var(--border)]" : ""
                    }`}
                  >
                    {step.label}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--muted)]">{step.why}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
