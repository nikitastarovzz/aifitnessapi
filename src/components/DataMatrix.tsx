import Link from "next/link";
import CopyTableMarkdown from "@/components/CopyTableMarkdown";
import { ROWS, PLATFORM_NOTES, SOURCES } from "@/data/matrix";

/**
 * HealthKit ↔ Health Connect data-type reference table. Deliberately a server
 * component: it's a lookup table, so there is nothing to hydrate and no reason
 * to ship JS for it. The table scrolls horizontally on narrow screens.
 */
export default function DataMatrix() {
  return (
    <div>
      <div className="mb-2 flex justify-end"><CopyTableMarkdown /></div>
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Apple HealthKit and Android Health Connect type identifiers for ten common health metrics
          </caption>
          <thead>
            <tr className="bg-[var(--surface)]">
              <th scope="col" className="p-3 font-semibold text-[var(--fg)]">Metric</th>
              <th scope="col" className="p-3 font-semibold text-[var(--fg)]">Apple HealthKit (iOS)</th>
              <th scope="col" className="p-3 font-semibold text-[var(--fg)]">Health Connect (Android)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              // The row id is a published citation target: /answers.json
              // addresses each fact as /matrix#<id>, and the qa gate fails if
              // one of those fragments stops resolving.
              <tr key={r.id} id={r.id} className="border-t border-[var(--border)] align-top scroll-mt-24">
                <th scope="row" className="p-3 font-medium text-[var(--fg)]">
                  <Link href={r.href} className="text-brand-600 hover:text-brand-500">
                    {r.label}
                  </Link>
                </th>
                <td className="p-3">
                  <code className="break-words text-xs text-[var(--fg)]">{r.apple}</code>
                </td>
                <td className="p-3">
                  <code className="break-words text-xs text-[var(--fg)]">{r.android}</code>
                  {r.watchOut && (
                    <span className="mt-2 block text-xs leading-relaxed text-[var(--muted)]">
                      <strong className="font-semibold text-[var(--fg)]">Watch out:</strong> {r.watchOut}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {PLATFORM_NOTES.map((p) => (
          <section key={p.platform} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="font-semibold text-[var(--fg)]">{p.platform}</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                  {/* Flex children default to min-width:auto too, so the long
                      type identifiers in these notes need an explicit floor. */}
                  <span className="min-w-0">{pt}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-[var(--border)] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Sources</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Every row above was checked against Apple&rsquo;s and Google&rsquo;s own documentation as of 2026.
          Type identifiers change — confirm against the live docs before you build.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:text-brand-500"
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
