import Link from "next/link";
import ContentLicenceTable from "@/components/ContentLicenceTable";
import { CONTENT_LICENCE_PAGES, resolvedLicences } from "@/lib/contentLicences";
import { formatDate } from "@/lib/posts";

const PRICING_PATH = "/pricing/exercise-database-api-pricing";

/**
 * "Can I ship it?" under the body of the English exercise and nutrition
 * pages listed in src/lib/contentLicences.ts: is each source free, what does
 * it cost, may a commercial app use it. Every stated cell links the source
 * whose verbatim quote supports it (numbered below the table), and "Not
 * stated" means the passages read do not say. Renders nothing on any other
 * page, and ClusterPage never renders it on a translation: the table is
 * English, and the translated page's text is held to the English entry, not
 * to this block (it sits outside data-article-body).
 *
 * The data and its sourcing rules: src/data/contentLicences.ts.
 */
export default function ContentLicences({ path }: { path: string }) {
  const scope = CONTENT_LICENCE_PAGES[path];
  if (!scope) return null;
  const data = resolvedLicences();
  // The quotes behind the rows the page opens on (and, on the exercise pages,
  // the ExerciseDB note). A row of the other kind, shown by the filter, still
  // links each of its sources directly.
  const cited = new Set([
    ...data.rows.filter((r) => r.kind === scope).flatMap((r) => Object.values(r.cells).flatMap((c) => c.sources)),
    ...(scope === "exercise" ? data.notes.flatMap((n) => n.sources) : []),
  ]);
  const sources = data.sources.filter((s) => cited.has(s.n));

  return (
    <section
      id="can-i-ship-it"
      data-content-licences={scope}
      className="mt-12 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">Can I ship it? Free tiers and commercial terms, source by source</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {"Each cell is what a vendor or project page says, and each number links the page it says it on; the quotes are listed under the table. " +
          "\"Not stated\" means the passages this site read do not say, not that the answer is no. These are terms as published, not legal advice: " +
          "read the live terms before you ship."}
      </p>

      <ContentLicenceTable
        columns={data.columns}
        rows={data.rows}
        sources={data.sources.map((s) => ({ n: s.n, url: s.url, host: new URL(s.url).hostname }))}
        initialKind={scope}
        notStated={data.notStated}
        currentPath={path}
      />

      {scope === "exercise" && (
        <div data-exercisedb-variants className="mt-6 border-t border-[var(--border)] pt-5">
          <h3 className="text-sm font-semibold text-[var(--fg)]">Which ExerciseDB is this?</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--muted)]">
            {data.notes.map((n) => (
              <li key={n.text}>
                {n.text}
                {n.sources.map((s) => {
                  const src = data.sources[s - 1];
                  return (
                    <a
                      key={s}
                      href={src.url}
                      rel="nofollow noreferrer"
                      title={src.quote}
                      className="ml-0.5 align-super text-[10px] text-brand-600 hover:text-brand-500"
                    >
                      {`[${s}]`}
                    </a>
                  );
                })}
              </li>
            ))}
          </ul>
          {path !== PRICING_PATH && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              {"Plans and prices for each: "}
              <Link href={PRICING_PATH} className="text-brand-600 hover:text-brand-500">
                exercise database API pricing
              </Link>
              {"."}
            </p>
          )}
        </div>
      )}

      <details className="mt-6 text-sm text-[var(--muted)]">
        <summary className="cursor-pointer select-none hover:text-[var(--fg)]">
          {`The ${sources.length} quotes behind the ${scope} rows${scope === "exercise" ? " and the note" : ""}`}
        </summary>
        <ol className="mt-2 space-y-1.5 border-l border-[var(--border)] pl-4">
          {sources.map((s) => (
            <li key={s.n} id={`ship-src-${s.n}`} className="scroll-mt-24">
              <span className="font-mono text-xs">{`[${s.n}] `}</span>
              <span className="text-[var(--fg)]">{`“${s.quote}”`}</span>
              {" — "}
              <a href={s.url} rel="nofollow noreferrer" className="break-words underline decoration-[var(--border)] underline-offset-2 hover:text-brand-600">
                {s.url.replace(/^https?:\/\//, "")}
              </a>
              <span className="text-xs">{` · checked ${formatDate(s.checked)}`}</span>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
