"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper. SEO/no-JS safe by construction: the server HTML is
 * fully visible, and only when JS runs — and only for elements still below
 * the fold — do we hide (.reveal-pending) and transition in (.reveal-in).
 * Reduced-motion users and browsers without IntersectionObserver never see
 * the pending state at all.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** transition-delay in ms, for staggering siblings. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen (or close) → don't hide what the user can see.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    if (delay) el.style.transitionDelay = `${delay}ms`;
    el.classList.add("reveal-pending");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("reveal-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
