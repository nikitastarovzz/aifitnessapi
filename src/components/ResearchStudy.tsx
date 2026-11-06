import type { ReactNode } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { RESEARCH_PATH, datasetUrl, studyCitation, type Study } from "@/lib/researchPages";

/**
 * The template the three /research studies share: capsule, the headline
 * figures (each a data-research-stat element qa recomputes from the published
 * dataset), method, the study's own findings (children), limits, download,
 * how to cite, FAQ and related links. Server-rendered; the charts are inline
 * SVG. The markdown mirrors (src/lib/pageMirrors/research.ts) carry the same
 * text from src/lib/researchPages.ts.
 */
export default function ResearchStudy({
  study,
  rows,
  children,
  disclosure,
}: {
  study: Study;
  rows: number;
  children: ReactNode;
  disclosure?: ReactNode;
}) {
  const url = absoluteUrl(study.path);
  const cite = studyCitation(study);
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: study.h1,
    description: study.description,
    url,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    dateModified: study.dataDate,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    isBasedOn: absoluteUrl(datasetUrl(study.dataset, "json")),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: study.faqs.map((f, i) => ({
      "@type": "Question",
      name: f.q,
      url: `${url}#faq-${i + 1}`,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };
  const link = "font-medium text-brand-600 hover:text-brand-500";

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Research", path: RESEARCH_PATH },
            { name: study.h1, path: study.path },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{study.h1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {study.dataDateLabel} · {rows.toLocaleString("en-US")} rows in the dataset · every figure recomputed from it at
          each build
        </p>

        <AnswerCapsule>{study.capsule}</AnswerCapsule>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Headline figures">
          {study.headlines.map((h) => (
            <li
              key={h.id}
              id={h.id}
              className="scroll-mt-24 rounded-2xl border border-[var(--border)] p-5"
              data-research-stat={h.id}
              data-research-value={h.value}
            >
              <p className="text-3xl font-bold tracking-tight text-[var(--fg)]">{h.value}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{h.label}</p>
            </li>
          ))}
        </ul>

        {disclosure}

        <section className="mt-12" id="method">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Method</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            {study.method.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {children}

        <section className="mt-12" id="limits">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What this method cannot see</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {study.limits.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12" id="download">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Download the data</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The rows behind every figure on this page, CC BY 4.0:{" "}
            <a href={datasetUrl(study.dataset, "json")} className={link}>
              {study.dataset}.json
            </a>
            ,{" "}
            <a href={datasetUrl(study.dataset, "csv")} className={link}>
              {study.dataset}.csv
            </a>{" "}
            and the{" "}
            <a href={datasetUrl(study.dataset, "md")} className={link}>
              dataset card
            </a>{" "}
            that describes every column. All of this site&rsquo;s datasets are on{" "}
            <Link href="/datasets" className={link}>
              the open datasets page
            </Link>
            .
          </p>
        </section>

        <section id="how-to-cite" className="mt-12 scroll-mt-24 rounded-2xl border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How to cite</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Quote a figure with the date its data was read and link this page; each headline figure has its own
            anchor, such as {`${url}#${study.headlines[0].id}`}.
          </p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs" data-cite="plain">
            {cite.plain}
          </pre>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs" data-cite="bibtex">
            {cite.bibtex}
          </pre>
          <p className="mt-3 text-sm text-[var(--muted)]">
            More citable counts about this site and the ecosystem it tracks are on{" "}
            <Link href="/press" className={link}>
              the press page
            </Link>
            .
          </p>
        </section>

        <section className="mt-14" id="faq">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {study.faqs.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Related</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {study.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
