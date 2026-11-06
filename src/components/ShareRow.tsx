"use client";

import { useEffect, useState } from "react";
import { shareCtaId, shareIntents } from "@/lib/shareIntents.mjs";
import { site } from "@/lib/site";

/**
 * "Share this result": copy the link, or post it to X, LinkedIn, Bluesky or
 * Reddit through each network's plain compose URL (src/lib/shareIntents.mjs).
 * No SDK and no network script; nothing leaves the page until the reader
 * presses Post on the network's own page.
 *
 * `url` omitted means "this page as it is now": the tools keep their state in
 * the address, so the link is read from window.location at the moment of the
 * click, after every change the reader made.
 *
 * Clicks are counted by the sitewide delegated listener (CtaTracker) through
 * `data-cta="share-<place>-<target>"`, a fixed id that never carries the
 * answers or the stack (ops/MEASUREMENT.md). `track={false}` drops the
 * attributes, for /my-stack, which promises to send no events.
 */
export default function ShareRow({
  place,
  text,
  url,
  track = true,
  label = "Share this result",
}: {
  /** Fixed id for the analytics event, lowercase words and hyphens. */
  place: string;
  /** One line that goes with the link. */
  text: string;
  /** Absolute URL to share; defaults to the current address. */
  url?: string;
  track?: boolean;
  label?: string;
}) {
  const [here, setHere] = useState(url ?? "");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  useEffect(() => {
    if (!url) setHere(window.location.href);
  }, [url]);

  const current = () => url ?? window.location.href;
  const cta = (target: Parameters<typeof shareCtaId>[1]) =>
    track ? { "data-cta": shareCtaId(place, target), "data-cta-source": "share-row" } : {};

  async function copy() {
    try {
      await navigator.clipboard.writeText(current());
      setCopied("done");
      setTimeout(() => setCopied("idle"), 1800);
    } catch {
      setCopied("failed");
    }
  }

  const btn =
    "inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400";

  return (
    <div data-share-row={place} className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={copy} className={btn} {...cta("copy")}>
          {copied === "done" ? "Link copied" : copied === "failed" ? "Copy from the address bar" : "Copy link"}
        </button>
        {shareIntents({ url: here || site.url, text }).map((t) => (
          <a
            key={t.id}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            className={btn}
            {...cta(t.id)}
            onClick={(e) => {
              // The address may have changed since render: send the current one.
              const fresh = shareIntents({ url: current(), text }).find((x) => x.id === t.id);
              if (fresh) e.currentTarget.href = fresh.href;
            }}
          >
            {t.label}
          </a>
        ))}
      </div>
    </div>
  );
}
