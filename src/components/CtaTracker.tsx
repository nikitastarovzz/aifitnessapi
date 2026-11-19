"use client";

import { useEffect } from "react";
import { track, trackEvent, markHandled, withPersonaProp, withPickerProp } from "@/lib/track";
import { classifySource, isFunderUrl } from "@/lib/measure.mjs";

const LANDED = "aifa_landed";

/**
 * The once-per-session landing event: where this visit came from, reduced to
 * a bucket (ai_assistant, search, other, direct, internal) and a short label
 * by src/lib/measure.mjs, plus the path it landed on and that path's persona
 * (a fixed label, personaOf in measure.mjs). The full referrer and
 * query string never leave the browser. sessionStorage holds only a "sent"
 * flag; when it is unavailable (private mode, blocked storage) the event may
 * fire once per page view instead, which inflates landings but not the split.
 */
function sendLanding() {
  try {
    if (window.sessionStorage.getItem(LANDED)) return;
    window.sessionStorage.setItem(LANDED, "1");
  } catch {
    /* storage blocked: send anyway */
  }
  const params = new URLSearchParams(window.location.search);
  const { source_class, source } = classifySource({
    referrer: document.referrer,
    utmSource: params.get("utm_source"),
    siteHost: window.location.hostname,
  });
  const landing_path = window.location.pathname;
  trackEvent("landing", withPersonaProp({ source_class, source, landing_path }, landing_path));
}

/**
 * Delegated backstop: catches clicks on ANY element carrying a data-cta
 * attribute, even ones that didn't go through <CtaLink>, and every link to
 * the funder's site (funder_click, with the data-funder placement or
 * "citation" for a source link). Both carry `persona`, the page path's
 * audience label, and `picker`, the last picker answer this session reached,
 * when there is one (src/lib/track.ts). Mounted once in the root layout, outside
 * /embed. Runs in the bubble phase so <CtaLink>'s own onClick (which marks
 * the event handled) fires first — markHandled() then dedupes, so any given
 * click is counted exactly once.
 */
export default function CtaTracker() {
  useEffect(() => {
    sendLanding();
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const funder = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (funder && isFunderUrl(funder.href)) {
        if (!markHandled(e)) return;
        const page = window.location.pathname;
        trackEvent(
          "funder_click",
          withPickerProp(
            withPersonaProp({ placement: funder.getAttribute("data-funder") ?? "citation", page }, page),
          ),
        );
        return;
      }
      const el = target?.closest("[data-cta]");
      if (!el) return;
      if (!markHandled(e)) return;
      track(el.getAttribute("data-cta") ?? "unknown", el.getAttribute("data-cta-source") ?? "unknown");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
