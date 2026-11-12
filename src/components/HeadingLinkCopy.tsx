"use client";

import { useEffect, useState } from "react";

/**
 * Tap a section's "#" and its link is on the clipboard (Tesler's law,
 * 2026-11-12).
 *
 * Tesler: every task has a core of complexity that someone has to carry, and
 * the system should carry as much of it as it can. Sharing one section of a
 * long page used to mean finding the hover-only "#", long-pressing it and
 * picking "Copy link" from the browser's menu, which on a phone was
 * effectively impossible. One delegated listener for every heading anchor on
 * the site: it still moves the address bar to the section, and it copies the
 * full URL. A modified click (new tab, new window) and a browser without the
 * Clipboard API keep the default behaviour.
 */
export default function HeadingLinkCopy() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = (text: string) => {
      setMessage(text);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 1800);
    };
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      const a = target?.closest<HTMLAnchorElement>("a.heading-anchor");
      if (!a || !navigator.clipboard?.writeText) return;
      const url = new URL(a.getAttribute("href") ?? "", window.location.href).toString();
      // Capture phase, and the event stops here: the anchor renders through
      // next/link (components/mdx), whose own handler would otherwise take
      // the click first and leave nothing on the clipboard.
      e.preventDefault();
      e.stopPropagation();
      window.history.replaceState(null, "", url);
      a.closest("h2, h3, h4")?.scrollIntoView({ block: "start" });
      navigator.clipboard.writeText(url).then(
        () => show("Link to this section copied"),
        () => show("The section link is in the address bar"),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex justify-center px-4">
      {message && (
        <span className="rounded-full bg-[var(--fg)] px-4 py-2 text-sm font-medium text-[var(--bg)] shadow-lg">{message}</span>
      )}
    </div>
  );
}
