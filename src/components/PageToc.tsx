"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/toc";

/**
 * On-page navigation for long articles: a reading-progress bar under the
 * sticky header everywhere, and a section list beside the article on screens
 * wide enough to have room for one (below that the article is the whole
 * screen and a floating list would be in the way).
 *
 * Both are scroll-driven, so they cost nothing while the page sits still —
 * the listener is passive and coalesced into one rAF per frame, and no
 * animation runs on idle (see the motion doctrine in globals.css).
 */
export default function PageToc({ headings }: { headings: Heading[] }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const ticking = useRef(false);
  // The phone contents control (minimize target distance, 2026-11-12). Below
  // xl the section list had no place on screen, so on a 17,000px spoke the
  // only way to another section was a long scroll back to the top. A button
  // in the thumb zone, bottom right, opens the same list as a bottom sheet:
  // the target sits where the thumb already is, and every section is one tap
  // from anywhere on the page. It appears once the reader has scrolled past
  // the opening screen, where the top of the page is still in reach.
  const [sheet, setSheet] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        setShowButton(window.scrollY > window.innerHeight * 0.75);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((e): e is HTMLElement => e !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [headings]);

  useEffect(() => {
    if (!sheet) return;
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  function closeSheet(returnFocus = true) {
    setSheet(false);
    if (returnFocus) buttonRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <div
        aria-hidden
        className="fixed left-0 top-0 z-[60] h-0.5 origin-left bg-brand-500"
        style={{ width: "100%", transform: `scaleX(${progress})` }}
      />
      {headings.length >= 3 && (
        <nav
          aria-label="On this page"
          className="fixed top-32 hidden max-h-[60vh] w-52 overflow-y-auto xl:block"
          style={{ left: "max(1rem, calc(50vw - 36rem))" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            On this page
          </p>
          <ul className="mt-3 space-y-1.5 border-l border-[var(--border)]">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={`-ml-px block border-l py-0.5 text-xs leading-snug transition-colors ${
                    h.depth === 3 ? "pl-6" : "pl-3"
                  } ${
                    active === h.id
                      ? "border-brand-500 text-brand-600"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {headings.length >= 3 && (
        <>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setSheet(true)}
            aria-expanded={sheet}
            aria-controls="page-contents-sheet"
            aria-hidden={!showButton}
            tabIndex={showButton ? 0 : -1}
            className={`fixed right-4 z-50 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 text-sm font-medium text-[var(--fg)] shadow-lg transition-[opacity,transform] duration-200 xl:hidden ${
              showButton ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
            }`}
            style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M4 6h16M4 12h10M4 18h13" />
            </svg>
            Contents
          </button>
          {sheet && (
            <div className="fixed inset-0 z-[80] xl:hidden" role="dialog" aria-modal="true" aria-label="Contents">
              <div className="absolute inset-0 bg-black/30" onClick={() => closeSheet()} aria-hidden />
              <div
                ref={sheetRef}
                id="page-contents-sheet"
                className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-[var(--border)] bg-[var(--bg)] px-4 pt-3 shadow-2xl"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">On this page</p>
                  <button
                    type="button"
                    onClick={() => closeSheet()}
                    aria-label="Close contents"
                    className="grid h-11 w-11 place-items-center rounded-md text-[var(--muted)] hover:text-[var(--fg)]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                      <path d="M5 5l14 14M19 5L5 19" />
                    </svg>
                  </button>
                </div>
                <ul className="mt-1">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        onClick={() => closeSheet(false)}
                        className={`flex min-h-[44px] items-center rounded-lg py-2 text-sm leading-snug ${
                          h.depth === 3 ? "pl-6 pr-2" : "px-2"
                        } ${active === h.id ? "bg-brand-500/10 font-medium text-brand-700 dark:text-brand-300" : "text-[var(--fg)]"}`}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    closeSheet(false);
                    window.scrollTo({ top: 0 });
                  }}
                  className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[var(--border)] text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  Back to top
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
