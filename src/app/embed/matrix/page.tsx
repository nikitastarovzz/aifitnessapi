import type { Metadata } from "next";
import EmbedFrame from "@/components/EmbedFrame";
import { ROWS } from "@/data/matrix";
import { absoluteUrl } from "@/lib/site";

/**
 * Embeddable copy of the HealthKit ↔ Health Connect type reference (/matrix).
 * Same rows, same source data — nothing here is restated or re-worded, it is
 * rendered straight from src/data/matrix.ts.
 *
 * Not indexable: an iframe target competing with /matrix in search would be
 * the site duplicating itself, so it is noindex and canonicals to /matrix.
 */
export const metadata: Metadata = {
  title: { absolute: "HealthKit ↔ Health Connect Table (embed)" },
  description:
    "Embeddable widget: Apple HealthKit and Android Health Connect type identifiers side by side, with the cross-platform gotchas. Canonical page: /matrix.",
  robots: { index: false },
  alternates: { canonical: "/matrix" },
};

export default function EmbedMatrix() {
  return (
    <EmbedFrame
      heading="HealthKit ↔ Health Connect type reference"
      canonicalPath="/matrix"
      ctaLabel="Full reference, notes and sources on aifitnessapi.com/matrix"
    >
      {/* The site rule: a wide table scrolls inside its own container, never
          the document. min-w keeps the three columns legible while scrolling
          instead of collapsing them into unreadable slivers at 320px. */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[560px] border-collapse text-left text-xs">
          <caption className="sr-only">
            Apple HealthKit and Android Health Connect type identifiers for {ROWS.length} common
            health metrics
          </caption>
          <thead>
            <tr className="bg-[var(--surface)]">
              <th scope="col" className="p-2 font-semibold text-[var(--fg)]">
                Metric
              </th>
              <th scope="col" className="p-2 font-semibold text-[var(--fg)]">
                Apple HealthKit (iOS)
              </th>
              <th scope="col" className="p-2 font-semibold text-[var(--fg)]">
                Health Connect (Android)
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="border-t border-[var(--border)] align-top">
                <th scope="row" className="p-2 font-medium">
                  <a
                    href={absoluteUrl(r.href)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:text-brand-500"
                  >
                    {r.label}
                  </a>
                </th>
                <td className="p-2">
                  <code className="break-words text-[11px] text-[var(--fg)]">{r.apple}</code>
                </td>
                <td className="p-2">
                  <code className="break-words text-[11px] text-[var(--fg)]">{r.android}</code>
                  {r.watchOut && (
                    <span className="mt-1.5 block text-[11px] leading-relaxed text-[var(--muted)]">
                      <strong className="font-semibold text-[var(--fg)]">Watch out:</strong>{" "}
                      {r.watchOut}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted)]">
        Both stores are on-device — there is no server endpoint to call. Type identifiers change:
        confirm against Apple&rsquo;s and Google&rsquo;s live docs before you build.
      </p>
    </EmbedFrame>
  );
}
