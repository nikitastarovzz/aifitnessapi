"use client";

import { useEffect } from "react";
import { track, markHandled } from "@/lib/track";

/**
 * Delegated backstop: catches clicks on ANY element carrying a data-cta
 * attribute, even ones that didn't go through <CtaLink>. Mounted once in the
 * root layout. Runs in the bubble phase so <CtaLink>'s own onClick (which marks
 * the event handled) fires first — markHandled() then dedupes, so any given
 * click is counted exactly once.
 */
export default function CtaTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest("[data-cta]");
      if (!el) return;
      if (!markHandled(e)) return;
      track(el.getAttribute("data-cta") ?? "unknown", el.getAttribute("data-cta-source") ?? "unknown");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
