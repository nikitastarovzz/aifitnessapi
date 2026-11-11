"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

/**
 * The header's search button and the site-wide shortcuts: ⌘K / Ctrl-K
 * toggles the palette from anywhere, "/" opens it when you are not already
 * typing, escape closes it and hands focus back to whatever had it.
 *
 * The palette itself — the index fetch, the three matching passes and the
 * results list — is SearchPalette, loaded on first open. Every page renders
 * this button, and almost no page view opens search, so the scorer stays out
 * of the JavaScript the layout ships (ops/MORE-30-2026-11-05.md item 24).
 * See SearchPalette.tsx for how matching works.
 */
const SearchPalette = dynamic(() => import("./SearchPalette"), { ssr: false });

export default function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Server-rendered as "/" so the first client render matches; swapped for the
  // platform chord once we know which platform this is.
  const [chord, setChord] = useState("/");
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
    setChord(mac ? "⌘K" : "Ctrl K");
  }, []);

  const show = useCallback(() => {
    restoreTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    restoreTo.current?.focus();
    restoreTo.current = null;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl-K from anywhere, including from inside another input.
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) hide();
        else show();
        return;
      }
      // "/" is the convention on documentation sites — but only when the
      // reader is not already typing into something.
      const el = e.target as HTMLElement | null;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        show();
      }
      if (e.key === "Escape" && open) hide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, show, hide]);

  const go = useCallback(
    (path: string) => {
      setOpen(false);
      restoreTo.current = null;
      router.push(path);
    },
    [router],
  );

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label="Search the site"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden rounded border border-[var(--border)] px-1 text-[10px] md:inline">{chord}</kbd>
      </button>

      {open && <SearchPalette onClose={hide} onNavigate={go} />}
    </>
  );
}
