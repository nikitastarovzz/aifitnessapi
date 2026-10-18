import Link from "next/link";
import { metricMapForGuide } from "@/data/metricTypeMap";
import { metricPlatforms } from "@/data/metricTypePages";

/**
 * "By platform" on a /data guide: the type that carries the guide's metric on
 * each platform this site keeps a generated reference for, each linked to its
 * page, with the platform's own description of it quoted as the reason it is
 * listed. Read from src/data/metricTypeMap.ts — the same list every type page
 * reads to link back here, so the two directions cannot drift apart — and
 * resolved against the generated modules by src/data/metricTypePages.ts.
 *
 * Renders nothing on a page the map does not cover. qa.mjs (METRIC-MAP-LINK)
 * checks that the block links every mapped type page and nothing else, using
 * the data-metric-platforms and data-metric-type markers below.
 */
export default function MetricPlatforms({ path }: { path: string }) {
  const slug = /^\/data\/([a-z0-9-]+)$/.exec(path)?.[1];
  const map = slug ? metricMapForGuide(slug) : undefined;
  if (!map) return null;
  const platforms = metricPlatforms(map);

  return (
    <section
      id="by-platform"
      data-metric-platforms={map.guide}
      className="mt-12 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">{map.metric}, by platform</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        {"Each type links its reference page on this site. The quote is the platform's own description of the type, " +
          "copied from the generated reference data, and it is the reason the type is listed: nothing here is paired by " +
          "name. A platform with nothing listed has no type with a page here whose description names this metric."}
      </p>

      <div className="mt-5 space-y-6">
        {platforms.map((p) => (
          <div key={p.family} data-metric-family={p.family}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {p.label}
              <span className="font-normal normal-case">{` · read ${p.readOn}`}</span>
            </h3>
            {p.types.length > 0 ? (
              <ul className="mt-2 space-y-3">
                {p.types.map((t) => (
                  <li key={t.id} className="text-sm">
                    <Link
                      href={t.href}
                      data-metric-type={`${t.family}:${t.id}`}
                      className="break-words font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                    >
                      {t.label}
                    </Link>
                    <span className="text-[var(--muted)]">{` — ${t.facts.join(" · ")}`}</span>
                    <blockquote className="mt-1 border-l-2 border-brand-400/50 pl-3 text-[13px] text-[var(--fg)]">
                      {`“${t.quote}”`}
                      <span className="text-[var(--muted)]">{` — ${p.source}`}</span>
                      {t.matrixRow ? (
                        <span className="text-[var(--muted)]">
                          {" · also a row of the "}
                          <Link href={`/matrix#${t.matrixRow}`} className="text-brand-600 hover:text-brand-500">
                            verified HealthKit–Health Connect matrix
                          </Link>
                        </span>
                      ) : null}
                    </blockquote>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted)]">Nothing listed.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
