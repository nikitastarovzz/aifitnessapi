import { track as vercelTrack } from "@vercel/analytics";

/**
 * One tracking entry point. Fires to Vercel Web Analytics (the provider the
 * site mounts, via window.va) and to Plausible or a GTM dataLayer if either is
 * ever present, and is a safe no-op otherwise. A per-event flag dedupes the
 * direct onClick against the delegated backstop listener, so a single click
 * counts once.
 *
 * Event names and properties are listed in ops/MEASUREMENT.md. Properties are
 * flat strings only, and never carry a person's data: page paths, fixed
 * labels, CTA ids.
 */
const HANDLED = "__ctaTracked";

export function markHandled(e: Event): boolean {
  const ev = e as unknown as Record<string, unknown>;
  if (ev[HANDLED]) return false;
  ev[HANDLED] = true;
  return true;
}

export type EventProps = Record<string, string>;

/** Send one named event with flat string properties to every provider present. */
export function trackEvent(name: string, props: EventProps) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    plausible?: (e: string, o?: unknown) => void;
    dataLayer?: unknown[];
  };
  try {
    vercelTrack(name, props);
  } catch {
    /* analytics must never break navigation */
  }
  try {
    w.plausible?.(name, { props });
    w.dataLayer?.push({ event: name, ...props });
  } catch {
    /* analytics must never break navigation */
  }
}

/** A data-cta click: which CTA, from which placement, on which page. */
export function track(id: string, source: string) {
  if (typeof window === "undefined") return;
  trackEvent("cta_click", { id, source, page: window.location.pathname });
}
