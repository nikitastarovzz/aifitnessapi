import type { Metadata } from "next";
import EmbedFrame from "@/components/EmbedFrame";
import { absoluteUrl } from "@/lib/site";
import {
  fmtGraveDate,
  GRAVEYARD_PATH,
  graveyardSorted,
  STATUS_LABEL,
  type GraveStatus,
} from "@/data/graveyard";

/**
 * Embeddable copy of /graveyard: every entry as one compact row with its
 * status, end date and replacement, linking to its stone on the page.
 *
 * No client JS and no countdown: a widget inside someone else's article should
 * render the same for every reader and cost them nothing to load, and a
 * countdown frozen at build time would be wrong by the next day. The full
 * quote stays on the page; the row names whose words the date comes from.
 *
 * Not indexable: it duplicates /graveyard, which is the page that should rank.
 */
export const metadata: Metadata = {
  title: { absolute: "The Fitness API Graveyard (embed widget)" },
  description:
    "Embeddable widget: shut-down, dying and deprecated fitness and health APIs with end dates and replacements. Canonical page: /graveyard.",
  robots: { index: false },
  alternates: { canonical: GRAVEYARD_PATH },
  openGraph: {
    type: "website",
    title: "The Fitness API Graveyard (embed widget)",
    description:
      "Embeddable widget: shut-down, dying and deprecated fitness and health APIs with end dates and replacements. Canonical page: /graveyard.",
    url: GRAVEYARD_PATH,
    images: ["/opengraph-image"],
  },
};

const STATUS_STYLE: Record<GraveStatus, string> = {
  dead: "border-zinc-400/60 bg-zinc-500/15",
  dying: "border-amber-500/60 bg-amber-500/15",
  deprecated: "border-sky-500/50 bg-sky-500/10",
};

export default function EmbedGraveyard() {
  const entries = graveyardSorted();
  return (
    <EmbedFrame
      heading="The Fitness API Graveyard"
      canonicalPath={GRAVEYARD_PATH}
      ctaLabel="Every entry with the vendor's own words on aifitnessapi.com/graveyard"
    >
      <p className="text-[11px] text-[var(--muted)]">
        {entries.length}{" "}fitness and health APIs, SDKs and endpoints their vendors shut down, scheduled to shut down
        or deprecated. Dates keep the vendor&rsquo;s precision.
      </p>
      <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {entries.map((e) => (
          <li
            key={e.id}
            data-grave={e.id}
            className="min-w-0 rounded-t-2xl rounded-b-lg border border-[var(--border)] p-2.5"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--fg)] ${STATUS_STYLE[e.status]}`}>
                {STATUS_LABEL[e.status]}
              </span>
              <span className="text-[11px] font-semibold text-[var(--fg)]">
                {e.endLabel}: {fmtGraveDate(e.end)}
              </span>
            </div>
            <a
              href={absoluteUrl(`${GRAVEYARD_PATH}#${e.id}`)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-words text-xs font-bold text-[var(--fg)] hover:text-brand-600"
            >
              {e.name}
            </a>
            <p className="text-[11px] text-[var(--muted)]">
              {e.vendor} · {e.replacedBy.length ? `→ ${e.replacedBy.map((r) => r.label).join("; ")}` : "no replacement named"}
            </p>
          </li>
        ))}
      </ul>
    </EmbedFrame>
  );
}
