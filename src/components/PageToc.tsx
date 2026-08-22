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

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
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
    </>
  );
}
