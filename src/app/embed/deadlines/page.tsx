import type { Metadata } from "next";
import EmbedFrame from "@/components/EmbedFrame";
import UpcomingDeadlines, { DeadlinesLabel, type DatedNode } from "@/components/UpcomingDeadlines";
import { changesSorted, type ChangeStatus } from "@/data/changes";
import { absoluteUrl } from "@/lib/site";

/**
 * Embeddable copy of the dated deadline list from /changes.
 *
 * The grading is the point of this widget, not decoration: "confirmed" means a
 * vendor's own words are quoted on the linked page, "reported" means notices
 * we could not confirm on an official page. A deadline countdown that hides
 * which of those it is would be worse than no widget, so the status label
 * renders on every row.
 *
 * Not indexable: it duplicates /changes, which is the page that should rank.
 */
export const metadata: Metadata = {
  title: { absolute: "Fitness API Deadlines (embed widget)" },
  description:
    "Embeddable widget: the next dated fitness-API deadlines, each graded confirmed or reported and linked to its source. Canonical page: /changes.",
  robots: { index: false },
  alternates: { canonical: "/changes" },
  // og:url follows the canonical: a share of the iframe URL should resolve to
  // the page that ranks, not to a chromeless widget.
  openGraph: {
    type: "website",
    title: "Fitness API Deadlines (embed widget)",
    description:
      "Embeddable widget: the next dated fitness-API deadlines, each graded confirmed or reported and linked to its source. Canonical page: /changes.",
    url: "/changes",
    images: ["/opengraph-image"],
  },
};

const STATUS_STYLES: Record<ChangeStatus, string> = {
  confirmed: "border-brand-400 bg-brand-500/10 text-[var(--fg)]",
  reported: "border-amber-400/50 bg-amber-500/10 text-[var(--fg)]",
  watch: "border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Keeps the precision of the source date — never sharpens "2026-09" to a day. */
function fmtDate(d: string): string {
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const mn = MONTHS[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}

const MAX_ITEMS = 5;

export default function EmbedDeadlines() {
  // Static page, so "today" here would be the build date — and a widget on
  // someone else's site can outlive a build by months. Which entries are still
  // ahead is decided in the reader's browser (UpcomingDeadlines); the server
  // HTML claims nothing about past or future and says which build it is from.
  // The heading is a plain string prop of EmbedFrame, so it stays neutral and
  // the intro line carries the verdict.
  const buildDate = new Date().toISOString().slice(0, 10);
  const all = changesSorted();
  // An entry already past at build can never be ahead later, so ship only the
  // entries ahead at build plus the latest MAX_ITEMS of the rest (shown once
  // everything has passed). `all` is latest first, so that is a prefix.
  const aheadAtBuild = all.filter((e) => e.sortDate >= buildDate).length;
  const items: DatedNode[] = all.slice(0, aheadAtBuild + MAX_ITEMS).map((e) => ({
    key: `${e.sortDate}-${e.title}`,
    sortDate: e.sortDate,
    node: (
      <li className="rounded-xl border border-[var(--border)] p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-[var(--fg)]">{fmtDate(e.date)}</span>
          <span
            className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[e.status]}`}
          >
            {e.status}
          </span>
        </div>
        <p className="mt-1 text-xs font-bold leading-snug tracking-tight text-[var(--fg)]">
          {e.title}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed">
          <a
            href={absoluteUrl(e.page.href)}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            {e.page.label} &rarr;
          </a>{" "}
          <span className="text-[var(--muted)]">&middot; checked {fmtDate(e.verifiedOn)}</span>
        </p>
      </li>
    ),
  }));

  return (
    <EmbedFrame
      heading="Fitness API changes & deadlines"
      canonicalPath="/changes"
      ctaLabel="Full tracker with sources on aifitnessapi.com/changes"
    >
      <p className="text-[11px] text-[var(--muted)]">
        <DeadlinesLabel
          dates={items.map((i) => i.sortDate)}
          asOf={`Dated entries from the tracker as of ${fmtDate(buildDate)}, latest date first.`}
          ahead="Dated changes still ahead of today."
          recent="No dated change is still ahead — showing the most recent entries."
        />{" "}
        <strong className="font-semibold text-[var(--fg)]">confirmed</strong> = the vendor&rsquo;s own
        words, quoted on the linked page. <strong className="font-semibold text-[var(--fg)]">reported</strong>{" "}
        = consistent notices with no official page we could verify.
      </p>

      <ol className="mt-2.5 space-y-2">
        <UpcomingDeadlines items={items} limit={MAX_ITEMS} />
      </ol>
    </EmbedFrame>
  );
}
