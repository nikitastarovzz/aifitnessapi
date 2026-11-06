import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ToolNextStep from "@/components/ToolNextStep";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { formatDate } from "@/lib/posts";
import {
  CELL_MARK,
  checkCounts,
  hostOf,
  opennessCapsule,
  opennessCardPath,
  opennessFaqs,
  opennessVendors,
  OPENNESS_DESCRIPTION,
  OPENNESS_METHOD,
  OPENNESS_TABLE_NOTE,
  OPENNESS_META_TITLE,
  OPENNESS_TITLE,
  OPENNESS_UPDATED,
} from "@/lib/openness";
import {
  cellAnchor,
  OPENNESS_CHECKS,
  OPENNESS_NOT_SCORED,
  OPENNESS_PATH,
  OPENNESS_VENDORS,
  scoreText,
  STATUS_LABEL,
  vendorAnchor,
} from "@/lib/opennessIndex.mjs";
import { badgeMarkdown, opennessBadge, opennessBadgeAlt, opennessBadgePath } from "@/lib/statusBadges.mjs";

/**
 * /openness-index — which developer basics each wearable and aggregator API
 * documents (ops/VIRAL-20-2026-11-06.md item 4).
 *
 * The page adds no facts. Every cell is computed by src/lib/opennessIndex.mjs
 * from modules the site already sources (the OAuth playground, the webhook
 * library and verifier, the rate-limit calculator, the generated Google
 * Health API module) and, for four basics, from quotes copied out of existing
 * evidence files. qa's OPENNESS-* gates re-derive every cell, check every
 * quote against its evidence file, and check each cell renders here with the
 * state it derives.
 */

const PATH = OPENNESS_PATH;

export const metadata: Metadata = {
  title: OPENNESS_META_TITLE,
  description: OPENNESS_DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: OPENNESS_TITLE,
    description: `Eight developer basics, ${OPENNESS_VENDORS.length} wearable and health-data APIs, every mark linked to the vendor's own sentence. A plain count, no rank.`,
    url: PATH,
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

const MARK_CLS: Record<string, string> = {
  documented: "font-bold text-emerald-700 dark:text-emerald-400",
  absent: "font-bold text-rose-700 dark:text-rose-400",
  "not-documented": "text-xs text-[var(--muted)]",
  "n/a": "text-xs text-[var(--muted)]",
};

export default function OpennessIndexPage() {
  const vendors = opennessVendors();
  const counts = checkCounts(vendors);
  const faqs = opennessFaqs(vendors);
  const capsule = opennessCapsule(vendors);
  const url = absoluteUrl(PATH);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: OPENNESS_TITLE,
        description: OPENNESS_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: orgRef(),
        lastReviewed: OPENNESS_UPDATED,
        reviewedBy: orgRef(),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
        mainEntity: { "@id": `${url}#dataset` },
      },
      {
        "@type": "Dataset",
        "@id": `${url}#dataset`,
        name: "Fitness API openness index",
        description: capsule,
        url,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: orgRef(),
        publisher: orgRef(),
        dateModified: OPENNESS_UPDATED,
        isAccessibleForFree: true,
        variableMeasured: OPENNESS_CHECKS.map((c) => c.label),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((f, i) => ({
          "@type": "Question",
          name: f.q,
          url: `${url}#faq-${i + 1}`,
          acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
        })),
      },
    ],
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Openness index", path: PATH },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{OPENNESS_TITLE}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Compiled {formatDate(OPENNESS_UPDATED)} · {vendors.length} APIs · {OPENNESS_CHECKS.length} checks · CC BY 4.0
        </p>

        <p id="answer" className="speakable mt-6 max-w-3xl text-lg leading-relaxed text-[var(--fg)]">
          {capsule}
        </p>

        <section className="mt-10" aria-labelledby="openness-table">
          <h2 id="openness-table" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The index
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">{OPENNESS_TABLE_NOTE}</p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--surface)] text-left text-xs text-[var(--muted)]">
                  <th scope="col" className="sticky left-0 bg-[var(--surface)] px-3 py-2 font-semibold">
                    API
                  </th>
                  {OPENNESS_CHECKS.map((c) => (
                    <th key={c.id} scope="col" className="px-2 py-2 text-center font-semibold">
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-2 text-center font-semibold">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-t border-[var(--border)]">
                    <th scope="row" className="sticky left-0 bg-[var(--bg)] px-3 py-2 text-left font-semibold text-[var(--fg)]">
                      <a href={`#${vendorAnchor(v.id)}`} className="hover:text-brand-600">
                        {v.name}
                      </a>
                    </th>
                    {OPENNESS_CHECKS.map((c) => {
                      const cell = v.cells[c.id];
                      const m = CELL_MARK[cell.status];
                      const label = `${v.name}, ${c.label}: ${STATUS_LABEL[cell.status as keyof typeof STATUS_LABEL]}`;
                      return (
                        <td key={c.id} className="px-2 py-2 text-center" data-cell={`${v.id}:${c.id}:${cell.status}`}>
                          <a href={`#${cellAnchor(v.id, c.id)}`} className={MARK_CLS[cell.status]} title={label}>
                            <span aria-hidden="true">{m.mark}</span>
                            <span className="sr-only">{label}</span>
                          </a>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center font-semibold text-[var(--fg)]" data-score={`${v.id}:${v.documented}/${v.applicable}`}>
                      {v.documented}/{v.applicable}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--muted)]">
                  <th scope="row" className="sticky left-0 bg-[var(--surface)] px-3 py-2 text-left font-semibold">
                    Documented by
                  </th>
                  {counts.map((x) => (
                    <td key={x.check.id} className="px-2 py-2 text-center" data-check-count={`${x.check.id}:${x.documented}/${x.applies}`}>
                      {x.documented} of {x.applies}
                    </td>
                  ))}
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <ul className="mt-4 grid gap-1 text-sm text-[var(--muted)] sm:grid-cols-2">
            {Object.entries(CELL_MARK).map(([k, m]) => (
              <li key={k}>
                <span className={`${MARK_CLS[k]} mr-1`}>{m.mark}</span> {m.meaning}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What each check asks</h2>
          <dl className="mt-5 space-y-4">
            {OPENNESS_CHECKS.map((c) => (
              <div key={c.id}>
                <dt className="font-semibold text-[var(--fg)]">{c.label}</dt>
                <dd className="mt-1 leading-relaxed text-[var(--muted)]">
                  {c.question} {c.rule}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Each API, check by check</h2>
          <div className="mt-6 space-y-12">
            {vendors.map((v) => {
              const b = opennessBadge(v);
              return (
                <article key={v.id} id={vendorAnchor(v.id)} className="scroll-mt-24" data-vendor={v.id}>
                  <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
                    {v.name}: {scoreText(v)}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    <Link href={v.guide} className={linkCls}>
                      The {v.name} guide
                    </Link>{" "}
                    lists every page read. Share:{" "}
                    <a href={opennessCardPath(v.id)} className={linkCls}>
                      card (PNG)
                    </a>{" "}
                    ·{" "}
                    <a href={`#${vendorAnchor(v.id)}`} className={linkCls}>
                      link to this row
                    </a>
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-sm">
                      <thead>
                        <tr className="text-left text-xs text-[var(--muted)]">
                          <th scope="col" className="w-40 py-2 pr-3 font-semibold">Check</th>
                          <th scope="col" className="w-44 py-2 pr-3 font-semibold">State</th>
                          <th scope="col" className="py-2 font-semibold">What the vendor&rsquo;s page says</th>
                        </tr>
                      </thead>
                      <tbody>
                        {OPENNESS_CHECKS.map((c) => {
                          const cell = v.cells[c.id];
                          return (
                            <tr key={c.id} id={cellAnchor(v.id, c.id)} className="scroll-mt-24 border-t border-[var(--border)] align-top">
                              <th scope="row" className="py-3 pr-3 text-left font-semibold text-[var(--fg)]">
                                {c.label}
                              </th>
                              <td className="py-3 pr-3">
                                <span className={MARK_CLS[cell.status]}>{CELL_MARK[cell.status].mark}</span>{" "}
                                <span className="text-[var(--fg)]">{STATUS_LABEL[cell.status as keyof typeof STATUS_LABEL]}</span>
                              </td>
                              <td className="py-3 leading-relaxed text-[var(--muted)]">
                                <p>{cell.note}</p>
                                {cell.src && (
                                  <blockquote className="mt-2 border-l-2 border-[var(--border)] pl-3 text-[var(--fg)]">
                                    <p data-quote={`${v.id}:${c.id}`}>{cell.src.quote}</p>
                                    <footer className="mt-1 text-xs text-[var(--muted)]">
                                      <a href={cell.src.url} className={linkCls} rel="noopener">
                                        {hostOf(cell.src.url)}
                                      </a>
                                    </footer>
                                  </blockquote>
                                )}
                                {cell.caveat && (
                                  <div className="mt-2">
                                    <p>{cell.caveat.text}</p>
                                    <blockquote className="mt-1 border-l-2 border-[var(--border)] pl-3 text-[var(--fg)]">
                                      <p>{cell.caveat.src.quote}</p>
                                      <footer className="mt-1 text-xs text-[var(--muted)]">
                                        <a href={cell.caveat.src.url} className={linkCls} rel="noopener">
                                          {hostOf(cell.caveat.src.url)}
                                        </a>
                                      </footer>
                                    </blockquote>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-[var(--muted)]">README badge:</p>
                  <p className="mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={opennessBadgePath(v.id)} alt={opennessBadgeAlt(v)} height={20} loading="lazy" />
                  </p>
                  <pre
                    aria-label={`Markdown for the ${v.name} openness badge`}
                    className="mt-2 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--fg)]"
                  >
                    <code>{badgeMarkdown(opennessBadgeAlt(v), opennessBadgePath(v.id), `${PATH}#${vendorAnchor(v.id)}`)}</code>
                  </pre>
                  <p className="sr-only">
                    Badge text: {b.label}: {b.value}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How the index is built</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-[var(--muted)]">
            {OPENNESS_METHOD.map((para, i) => (
              <p key={i}>
                {para.map((s, j) =>
                  typeof s === "string" ? (
                    <span key={j}>{s}</span>
                  ) : (
                    <Link key={j} href={s.href} className={linkCls}>
                      {s.label}
                    </Link>
                  ),
                )}
              </p>
            ))}
          </div>
          <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">Not scored</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {OPENNESS_NOT_SCORED.map((n) => (
              <li key={n.name}>
                <Link href={n.href} className={linkCls}>
                  {n.name}
                </Link>
                : {n.reason}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[var(--muted)]">
            Every vendor&rsquo;s count is also a README badge, and every API in the graveyard has a status badge:{" "}
            <Link href="/badges#status-badges" className={linkCls}>
              embeds and badges
            </Link>
            .
          </p>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {faqs.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <ToolNextStep path={PATH} />

        <p className="mt-8 max-w-3xl text-sm text-[var(--muted)]">
          By {site.name}. Cite as: {site.name}, &ldquo;{OPENNESS_TITLE},&rdquo; {url}, compiled {formatDate(OPENNESS_UPDATED)}.
        </p>
      </div>
    </Container>
  );
}
