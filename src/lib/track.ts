/**
 * One tracking entry point. Fires to whichever analytics provider is present
 * (Plausible or a GTM dataLayer) and is a safe no-op otherwise — so we keep the
 * "every CTA is tracked" contract now and wire a provider later with zero page
 * edits. A per-event flag dedupes the direct onClick against the delegated
 * backstop listener, so a single click counts once.
 */
const HANDLED = "__ctaTracked";

export function markHandled(e: Event): boolean {
  const ev = e as unknown as Record<string, unknown>;
  if (ev[HANDLED]) return false;
  ev[HANDLED] = true;
  return true;
}

export function track(id: string, source: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    plausible?: (e: string, o?: unknown) => void;
    dataLayer?: unknown[];
  };
  try {
    w.plausible?.("cta_click", { props: { id, source } });
    w.dataLayer?.push({ event: "cta_click", cta_id: id, cta_source: source });
  } catch {
    /* analytics must never break navigation */
  }
}
