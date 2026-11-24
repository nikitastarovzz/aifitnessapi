"use client";

import { useState } from "react";
import ShareRow from "@/components/ShareRow";
import { factSharePath } from "@/lib/factCardCore.mjs";
import { site } from "@/lib/site";

/**
 * "Share this fact" beside one Key facts line (components/KeyFacts, English
 * pages only). The share address /s?t=fact&id=<id> is built here, in the
 * browser, after a click, like the picker's: the noindex share route stays
 * unlinked from server-rendered HTML, so crawlers reading the page do not fan
 * out into a dynamic route. The button opens a share row (copy the link, or
 * post it through each network's plain compose URL) and a link to the fact's
 * own card; nothing is sent until the reader posts it.
 *
 * Clicks are counted by the delegated CtaTracker through fixed ids:
 * `fact-share` (this button), `fact-card-open` and `share-fact-<target>`
 * (the row), never the fact id (ops/MEASUREMENT.md).
 */
export default function FactShareLink({ id, text }: { id: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {" "}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-cta="fact-share"
        data-cta-source="key-facts"
        className="text-xs font-medium text-[var(--muted)] underline decoration-dotted underline-offset-2 hover:text-brand-600"
      >
        Share this fact
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 pb-3">
          <ShareRow place="fact" url={factSharePath(id, site.url)} text={text} label="Share this fact" />
          <a
            href={factSharePath(id)}
            data-cta="fact-card-open"
            data-cta-source="key-facts"
            className="mt-2 inline-block text-xs font-medium text-brand-600 hover:text-brand-500"
          >
            Open its card
          </a>
        </div>
      )}
    </>
  );
}
