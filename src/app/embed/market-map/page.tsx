import type { Metadata } from "next";
import EmbedFrame from "@/components/EmbedFrame";
import { absoluteUrl } from "@/lib/site";
import { CATEGORIES, MARKET_MAP_PATH, marketMapItems } from "@/lib/ecosystemSignals";

/**
 * Embeddable copy of /market-map: every directory product as a compact tile,
 * grouped by category, each linking to its directory page in a new tab.
 *
 * No filters and no client JS: a widget inside someone else's article should
 * render the same for every reader and cost them nothing to load. The
 * funder's tile carries its marker here too — an embed travels without the
 * page's disclosure, so the marker has to travel with it.
 *
 * Not indexable: it duplicates /market-map, which is the page that should rank.
 */
export const metadata: Metadata = {
  title: { absolute: "Fitness & Health API Market Map (embed widget)" },
  description:
    "Embeddable widget: every fitness and health API in the aifitnessapi.com directory, grouped by category. Canonical page: /market-map.",
  robots: { index: false },
  alternates: { canonical: MARKET_MAP_PATH },
  openGraph: {
    type: "website",
    title: "Fitness & Health API Market Map (embed widget)",
    description:
      "Embeddable widget: every fitness and health API in the aifitnessapi.com directory, grouped by category. Canonical page: /market-map.",
    url: MARKET_MAP_PATH,
    images: ["/opengraph-image"],
  },
};

const DOT: Record<string, string> = {
  free: "bg-emerald-500",
  "free-tier-then-paid": "bg-sky-500",
  "usage-based": "bg-violet-500",
  "contact-sales": "bg-amber-500",
};

export default function EmbedMarketMap() {
  const items = marketMapItems();
  return (
    <EmbedFrame
      heading="Fitness & health API market map"
      canonicalPath={MARKET_MAP_PATH}
      ctaLabel="Filterable map with sources on aifitnessapi.com/market-map"
    >
      <p className="text-[11px] text-[var(--muted)]">
        {items.length} products from the directory, grouped by category, in directory order — not ranked. Dot =
        how each bills developers:{" "}
        <span className="inline-flex items-center gap-1"><span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT.free}`} />free</span>,{" "}
        <span className="inline-flex items-center gap-1"><span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT["free-tier-then-paid"]}`} />free tier</span>,{" "}
        <span className="inline-flex items-center gap-1"><span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT["usage-based"]}`} />usage-based</span>,{" "}
        <span className="inline-flex items-center gap-1"><span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT["contact-sales"]}`} />contact sales</span>.
      </p>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {CATEGORIES.map((c) => {
          const list = items.filter((i) => i.category === c.id);
          return (
            <section key={c.id} className="min-w-0 rounded-xl border border-[var(--border)] p-2.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {c.label} <span className="font-normal">· {list.length}</span>
              </h2>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {list.map((i) => (
                  <li
                    key={i.id}
                    data-map-tile={i.id}
                    className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-[11px]"
                  >
                    <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${DOT[i.devCost]}`} aria-label={i.devCostLabel} />
                    <a
                      href={absoluteUrl(i.href)}
                      target="_blank"
                      rel="noreferrer"
                      className="break-words font-semibold text-[var(--fg)] hover:text-brand-600"
                    >
                      {i.short}
                    </a>
                    {i.firstParty && <span className="italic text-[var(--muted)]">· funds aifitnessapi.com</span>}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </EmbedFrame>
  );
}
