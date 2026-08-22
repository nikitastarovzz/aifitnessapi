import type { ReactNode } from "react";
import { absoluteUrl, site } from "@/lib/site";

/**
 * Shell for the iframe widgets under /embed. Everything an embed needs and
 * nothing it doesn't: a heading, the widget body, and a visible attribution
 * line pointing back at the canonical page here.
 *
 * Constraints these widgets live under (they render on other people's sites):
 * - No fixed heights. The host picks the iframe height; if the content is
 *   taller it must be reachable by scrolling the iframe, never clipped by us.
 * - Readable at 320px. Padding stays small, type stays small, and any wide
 *   child scrolls inside its own container rather than the document.
 * - Links open in a new tab with rel="noreferrer" — the widget is inside
 *   someone else's page and must never navigate their frame.
 */
export default function EmbedFrame({
  heading,
  canonicalPath,
  ctaLabel,
  children,
}: {
  heading: string;
  /** Path of the human page this widget summarises, e.g. "/matrix". */
  canonicalPath: string;
  ctaLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h1 className="text-sm font-bold tracking-tight text-[var(--fg)]">{heading}</h1>
        <span className="text-[11px] text-[var(--muted)]">aifitnessapi.com</span>
      </div>

      <div className="mt-2.5">{children}</div>

      <p className="mt-3 border-t border-[var(--border)] pt-2 text-[11px] leading-relaxed text-[var(--muted)]">
        <a
          href={absoluteUrl(canonicalPath)}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-600 hover:text-brand-500"
        >
          {ctaLabel} &#8599;
        </a>{" "}
        &mdash; a free reference from {site.name}. This widget shows whatever the source page says
        today, so it changes when we update it.
      </p>
    </div>
  );
}
