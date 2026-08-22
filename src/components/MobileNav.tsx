"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * The phone-width navigation. The inline link row does not fit under about
 * 700px — it used to push the document 233px wider than the viewport on every
 * page, so every phone got a horizontally scrolling site.
 *
 * Behavior: a disclosure panel that closes on navigation, on Escape, and on
 * an outside tap. Links are full-width rows so the touch target is the row,
 * not the glyph.
 */
const LINKS = [
  { href: "/fitness-apis", label: "Fitness APIs" },
  { href: "/integrate", label: "Integration guides" },
  { href: "/devices", label: "Connected devices" },
  { href: "/picker", label: "API Picker" },
  { href: "/engagement", label: "Engagement" },
  { href: "/cookbook", label: "Cookbook" },
  { href: "/changes", label: "Changes & deadlines" },
  { href: "/blog", label: "Blog" },
  { href: "/site-index", label: "All topics" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const wrap = useRef<HTMLDivElement>(null);

  // Close whenever the route changes — client-side nav keeps the component
  // mounted, so nothing else would dismiss it.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-10 w-10 place-items-center rounded-md border border-[var(--border)] text-[var(--fg)] transition-colors hover:border-brand-400"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          {open ? (
            <path d="M5 5l14 14M19 5L5 19" />
          ) : (
            <>
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-16 z-50 border-b border-[var(--border)] bg-[var(--bg)] shadow-lg"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded-md px-2 py-3 text-base text-[var(--fg)] transition-colors hover:bg-[var(--surface)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
