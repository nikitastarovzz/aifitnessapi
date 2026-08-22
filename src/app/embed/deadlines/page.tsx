import type { Metadata } from "next";
import EmbedFrame from "@/components/EmbedFrame";
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
  // Static page: this resolves at build time, which is exactly the honest
  // frame for an embed — "as of the last build", stated on the widget.
  const today = new Date().toISOString().slice(0, 10);
  const all = changesSorted();
  const ahead = all.filter((e) => e.sortDate >= today).sort((a, b) => (a.sortDate < b.sortDate ? -1 : 1));
  const upcoming = ahead.length > 0;
  const items = (upcoming ? ahead : all).slice(0, MAX_ITEMS);

  return (
    <EmbedFrame
      heading={upcoming ? "Fitness API deadlines ahead" : "Fitness API changes — most recent"}
      canonicalPath="/changes"
      ctaLabel="Full tracker with sources on aifitnessapi.com/changes"
    >
      <p className="text-[11px] text-[var(--muted)]">
        {upcoming
          ? `Dated changes still ahead as of ${fmtDate(today)}.`
          : `No dated change is ahead of ${fmtDate(today)} — showing the most recent entries.`}{" "}
        <strong className="font-semibold text-[var(--fg)]">confirmed</strong> = the vendor&rsquo;s own
        words, quoted on the linked page. <strong className="font-semibold text-[var(--fg)]">reported</strong>{" "}
        = consistent notices with no official page we could verify.
      </p>

      <ol className="mt-2.5 space-y-2">
        {items.map((e) => (
          <li
            key={`${e.sortDate}-${e.title}`}
            className="rounded-xl border border-[var(--border)] p-2.5"
          >
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
        ))}
      </ol>
    </EmbedFrame>
  );
}
