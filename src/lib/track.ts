import { track as vercelTrack } from "@vercel/analytics";
import { PICKER_KEY, parsePickerId, withPersona, withPicker } from "@/lib/measure.mjs";

/**
 * One tracking entry point. Fires to Vercel Web Analytics (the provider the
 * site mounts, via window.va) and to Plausible or a GTM dataLayer if either is
 * ever present, and is a safe no-op otherwise. A per-event flag dedupes the
 * direct onClick against the delegated backstop listener, so a single click
 * counts once.
 *
 * Event names and properties are listed in ops/MEASUREMENT.md. Properties are
 * flat strings only, and never carry a person's data: page paths, fixed
 * labels (persona among them), CTA ids.
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

const inEmbed = () => window.location.pathname.startsWith("/embed/");

/**
 * Remember the picker answer this session reached (an id from
 * pickerAnswerId() in src/lib/measure.mjs), so later cta_click and
 * funder_click events can name it. The latest answer wins. A no-op under
 * /embed and when storage is blocked: the clicks then go without `picker`.
 */
export function rememberPicker(id: string | null) {
  if (typeof window === "undefined" || inEmbed()) return;
  const valid = parsePickerId(id);
  if (!valid) return;
  try {
    window.sessionStorage.setItem(PICKER_KEY, valid);
  } catch {
    /* storage blocked: clicks go without the picker property */
  }
}

/** Props plus `picker` when this session reached a picker answer. */
export function withPickerProp(props: EventProps): EventProps {
  if (typeof window === "undefined" || inEmbed()) return props;
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(PICKER_KEY);
  } catch {
    /* storage blocked */
  }
  return withPicker(props, raw);
}

/** Props plus `persona`, the fixed audience label of the page path
 *  (personaOf() in src/lib/measure.mjs). Nothing is added under /embed. */
export function withPersonaProp(props: EventProps, pathname: string): EventProps {
  if (typeof window === "undefined" || inEmbed()) return props;
  return withPersona(props, pathname);
}

/** A data-cta click: which CTA, from which placement, on which page, the
 *  page's persona, and the picker answer reached earlier in the session, if
 *  any. */
export function track(id: string, source: string) {
  if (typeof window === "undefined") return;
  const page = window.location.pathname;
  trackEvent("cta_click", withPickerProp(withPersonaProp({ id, source, page }, page)));
}
