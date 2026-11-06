import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import HistoryFilter from "@/components/HistoryFilter";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import {
  HISTORY_DESCRIPTION,
  HISTORY_FAQS as FAQS,
  HISTORY_H1,
  HISTORY_PATH,
  HISTORY_PNG,
  HISTORY_SVG,
  HISTORY_TITLE,
  fmtDate,
  history,
  historyAsOf,
  historyCapsule,
  historyInlineSvg,
  historyMethodLines,
  kindLabel,
} from "@/lib/historyView";

/**
 * /history — the visual history of fitness and health APIs
 * (ops/VIRAL-20-2026-11-06.md item 10). Not a second graveyard or tracker:
 * /graveyard owns "which APIs were shut down" and /changes owns "what changed
 * and what is due", each entry with its quote. This page draws both records
 * on one time axis and owns only the long view: what happened when, across
 * vendors. The drawing is server HTML; HistoryFilter hides marks by their
 * data attributes and keeps the filter in the address.
 */

export const metadata: Metadata = {
  title: { absolute: HISTORY_TITLE },
  description: HISTORY_DESCRIPTION,
  alternates: pageMirrorAlternates(HISTORY_PATH),
  openGraph: { type: "website", title: HISTORY_TITLE, description: HISTORY_DESCRIPTION, url: HISTORY_PATH },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";
const ROOT_ID = "history-timeline";

export default function HistoryPage() {
  const h = history();
  const asOf = historyAsOf();
  const url = absoluteUrl(HISTORY_PATH);
  const byYear = new Map<number, typeof h.marks>();
  for (const m of h.marks) {
    const y = Number(m.date.slice(0, 4));
    byYear.set(y, [...(byYear.get(y) ?? []), m]);
  }
  const total = h.marks.length + h.undated.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: HISTORY_TITLE,
        description: HISTORY_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: orgRef(),
        dateModified: asOf,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
        primaryImageOfPage: { "@id": `${url}#poster` },
        relatedLink: [absoluteUrl("/graveyard"), absoluteUrl("/changes")],
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#poster`,
        contentUrl: absoluteUrl(HISTORY_PNG),
        encodingFormat: "image/png",
        name: HISTORY_H1,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: orgRef(),
        dateModified: asOf,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: FAQS.map((f, i) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Fitness API history", path: HISTORY_PATH },
          ]}
        />
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{HISTORY_H1}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {historyCapsule()}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href={HISTORY_PNG} download className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-500" data-cta="history-png">
            Download the poster (PNG)
          </a>
          <a href={HISTORY_SVG} download className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400" data-cta="history-svg">
            Download SVG
          </a>
          <Link href="/graveyard" className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            The API graveyard
          </Link>
          <Link href="/changes" className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            Changes and deadlines
          </Link>
        </div>

        <div id={ROOT_ID}>
          <HistoryFilter rootId={ROOT_ID} vendors={h.vendors} kinds={h.kinds} total={total} />

          <figure className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
            <div className="min-w-[760px]" dangerouslySetInnerHTML={{ __html: historyInlineSvg() }} />
            <figcaption className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]">
              Each mark links its source. The same events follow as a list.
            </figcaption>
          </figure>

          <section className="mt-14">
            <h2 className={H2}>Every event, as a list</h2>
            <ol className="fh-list mt-6 space-y-8">
              {[...byYear.entries()].map(([year, marks]) => (
                <li key={year} data-year={year}>
                  <h3 className="text-lg font-semibold text-[var(--fg)]">{year}</h3>
                  <ul className="mt-3 space-y-3">
                    {marks.map((m) => (
                      <li key={m.id} data-id={m.id} data-vendor={m.vendorId} data-kind={m.kind} className="text-sm leading-relaxed">
                        <span className="font-mono text-xs text-[var(--muted)]">{fmtDate(m.date)}</span>{" "}
                        <span className="text-[var(--fg)]">{m.title}</span>{" "}
                        <span className="text-[var(--muted)]">
                          ({m.vendorLabel} · {kindLabel(m.kind)}
                          {m.kind === "change" ? `, ${m.status}` : m.kind === "end" ? `, ${m.status}` : ""}) ·{" "}
                        </span>
                        {m.external ? (
                          <a href={m.href} rel="noopener" className={linkCls}>
                            Source: {m.hrefLabel}
                          </a>
                        ) : (
                          <Link href={m.href} className={linkCls}>
                            {m.hrefLabel}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {h.undated.length > 0 && (
                <li data-year="undated">
                  <h3 className="text-lg font-semibold text-[var(--fg)]">No end date given by the vendor</h3>
                  <ul className="mt-3 space-y-3">
                    {h.undated.map((m) => (
                      <li key={m.id} data-id={m.id} data-vendor={m.vendorId} data-kind={m.kind} className="text-sm leading-relaxed">
                        <span className="text-[var(--fg)]">{m.title}</span>{" "}
                        <span className="text-[var(--muted)]">
                          ({m.vendorLabel} · {kindLabel(m.kind)}, {m.status}) ·{" "}
                        </span>
                        <a href={m.href} rel="noopener" className={linkCls}>
                          Source: {m.hrefLabel}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ol>
          </section>
        </div>

        <section className="mt-14">
          <h2 className={H2}>How the timeline is made</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {historyMethodLines().map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Free to print and share under CC BY 4.0: credit {site.name} and link {url}.
          </p>
        </section>

        <section className="mt-14">
          <h2 className={H2}>Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          Week by week instead:{" "}
          <Link href="/weekly" className={linkCls}>
            the weekly roundup
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
