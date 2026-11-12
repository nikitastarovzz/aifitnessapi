"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * One titled group of footer links, folded on phones.
 *
 * Hick's law (Hick 1952, Hyman 1953): the time to choose grows with the
 * number of choices in view, and the footer showed about ninety links as one
 * flat cloud, 1,700px tall on a phone. Five titled groups cut the first
 * glance to five choices; a reader unfolds the one they want. On wider
 * screens every group is open as a plain column, the layout readers expect
 * from a footer (Jakob's law), and the summary is just the heading.
 *
 * Served open: crawlers and readers without JavaScript see every link, and
 * qa's inbound-link count reads the same HTML. After hydration a phone folds
 * the groups; the footer is below the fold on load, so nothing in view moves.
 */
export default function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  // On wider screens the summary is the column's heading, not a control:
  // out of the tab order too, so Enter on it cannot fold a column.
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setPhone(phone.matches);
      setOpen(!phone.matches);
    };
    sync();
    phone.addEventListener("change", sync);
    return () => phone.removeEventListener("change", sync);
  }, []);

  return (
    <details className="footer-group" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary tabIndex={phone ? 0 : -1} className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--fg)] [&::-webkit-details-marker]:hidden md:pointer-events-none md:min-h-0 md:py-0">
        <span>{title}</span>
        <svg
          className="footer-group-chevron h-4 w-4 shrink-0 text-[var(--muted)] transition-transform md:hidden"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      {children}
    </details>
  );
}
