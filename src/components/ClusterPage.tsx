import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import { Mdx } from "@/components/mdx";
import PageActions from "@/components/PageActions";
import PageToc from "@/components/PageToc";
import FaqJump from "@/components/FaqJump";
import NextSteps from "@/components/NextSteps";
import MetricFacts from "@/components/MetricFacts";
import ContentAge from "@/components/ContentAge";
import ReferenceCallout from "@/components/ReferenceCallout";
import KinestexNote from "@/components/KinestexNote";
import AppStack from "@/components/AppStack";
import Feedback from "@/components/Feedback";
import { formatDate } from "@/lib/posts";
import { site, absoluteUrl } from "@/lib/site";
import { spokeGraph, markdownUrl } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { clusterNeighbors } from "@/lib/clusterRegistry";
import { relatedAcrossSite } from "@/lib/related";
import { apisOnPage } from "@/lib/apiCoverage";
import { APIS_PATH } from "@/data/apis";
import { autolinkGlossary } from "@/lib/autolink";
import { headings } from "@/lib/toc";
import readingTime from "reading-time";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * The fixed spoke anatomy (§3), top to bottom:
 * breadcrumbs → H1 → answer capsule (speakable) → body → FAQ → related → CTA →
 * disclaimer. Plus Article (and HowTo when the entry has steps) + FAQPage
 * JSON-LD. BreadcrumbList is emitted by the <Breadcrumbs> component only.
 * Shared across clusters via `config` (base path + hub label).
 */
export default function ClusterPage({
  entry,
  config,
}: {
  entry: ClusterEntry;
  config: ClusterConfig;
}) {
  const { basePath, hubLabel } = config;
  const url = absoluteUrl(`${basePath}/${entry.slug}`);
  const capsuleId = "answer";

  const path = `${basePath}/${entry.slug}`;
  const mdUrl = markdownUrl(path);
  // First mention of each glossary concept becomes a link (never inside code
  // or an existing link — see lib/autolink), so the vocabulary is navigable
  // without a writer remembering to wire it.
  const body = autolinkGlossary(entry.body, path);
  const toc = headings(entry.body);
  const minutes = Math.max(1, Math.round(readingTime(entry.body).minutes));
  const alsoRead = relatedAcrossSite(basePath, entry.slug);
  // The products this page actually discusses, linked to their directory
  // entries — access terms, gates and everything else we have written about
  // each one, without the reader having to search for the name.
  const products = apisOnPage(basePath, entry.slug);

  // TechArticle + WebPage graph (review metadata, glossary `about` links,
  // citations, markdown encoding). Built centrally so every spoke agrees.
  const graphJsonLd = spokeGraph({ entry, basePath, hubLabel, capsuleId });

  // Emit HowTo alongside Article for step-based how-to pages (§7).
  const howToJsonLd = entry.steps?.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: entry.h1,
        description: entry.metaDescription,
        step: entry.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      }
    : null;

  // Each FAQ gets a stable anchor so an assistant can deep-link the exact
  // answer it quoted, rather than the top of a long page.
  const faqId = (i: number) => `faq-${i + 1}`;
  const faqJsonLd = entry.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entry.faqs.map((f, i) => ({
          "@type": "Question",
          "@id": `${url}#${faqId(i)}`,
          url: `${url}#${faqId(i)}`,
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
        })),
      }
    : null;

  return (
    <Container className="py-14">
      {/* Markdown mirror of this page, discoverable per the llms.txt
          convention. React hoists these into <head>. */}
      <link rel="alternate" type="text/markdown" href={mdUrl} />
      <link rel="describedby" type="text/plain" href={absoluteUrl("/llms.txt")} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <PageToc headings={toc} />

      <article className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: hubLabel, path: basePath },
            { name: entry.h1, path: `${basePath}/${entry.slug}` },
          ]}
        />

        <ClusterHero label={hubLabel} seed={heroSeed(basePath)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          {entry.h1}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Last verified {formatDate(entry.updated)}
          <ContentAge date={entry.updated} /> · {minutes} min read
        </p>

        {entry.firstParty && (
          <aside
            role="note"
            className="mt-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
          >
            <strong>Disclosure:</strong> this page covers KinesteX, the product
            of the company that funds this site. Facts below come from public
            repositories, competitor strengths are stated, and anything we
            could not verify is labeled — see{" "}
            <Link href="/methodology" className="text-brand-600 underline hover:text-brand-500">
              how we verify
            </Link>
            .
          </aside>
        )}

        {/* Answer-first capsule — the block voice assistants read and LLMs quote. */}
        <div
          id={capsuleId}
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {entry.answer}
        </div>

        <PageActions path={path} url={url} title={entry.h1} updated={entry.updated} />

        <FaqJump questions={entry.faqs.map((f) => f.q)} />

        {products.length > 0 && (
          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
            <span>Covered here:</span>
            {products.map((p) => (
              <Link
                key={p.id}
                href={`${APIS_PATH}/${p.id}`}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--fg)] transition-colors hover:border-brand-400"
              >
                {p.short}
              </Link>
            ))}
          </p>
        )}

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
          <Mdx source={body} />
        </div>

        {entry.faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Frequently asked questions
            </h2>
            <dl className="mt-6 divide-y divide-[var(--border)]">
              {entry.faqs.map((f, i) => (
                <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                  <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                  <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <ClusterCta pitch={entry.cta.pitch} source="spoke-inline" id={`cta-${entry.slug}`} />

        {entry.related.length > 0 && (
          <section className="mt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Keep reading
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {entry.related.map((r) => (
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
        )}

        {(() => {
          const { prev, next } = clusterNeighbors(basePath, entry.slug);
          if (!prev && !next) return null;
          return (
            <nav aria-label="More in this section" className="mt-10 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`${basePath}/${prev.slug}`}
                  className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Previous in {hubLabel}</span>
                  <span className="mt-1 block text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">{prev.h1}</span>
                </Link>
              ) : (
                <span aria-hidden className="hidden sm:block" />
              )}
              {next && (
                <Link
                  href={`${basePath}/${next.slug}`}
                  className="group rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Next in {hubLabel} →</span>
                  <span className="mt-1 block text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">{next.h1}</span>
                </Link>
              )}
            </nav>
          );
        })()}

        {/* Verified platform facts, on the guides that have a matrix row.
            Renders nothing everywhere else. */}
        <MetricFacts path={path} />
        <AppStack path={path} />
        <ReferenceCallout path={path} />
        <KinestexNote path={path} />

        {alsoRead.length > 0 && (
          <section className="defer-paint mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Elsewhere on the site
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Pages that share this one&rsquo;s concepts and sources, from other sections.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {alsoRead.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex h-full flex-col rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                  >
                    <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                      {r.clusterLabel}
                    </span>
                    <span className="mt-1 text-sm font-medium text-[var(--fg)]">{r.h1}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <NextSteps />

        <Feedback path={path} title={entry.h1} repo={site.social.github || undefined} />

        <ClusterDisclaimer updated={entry.updated} variant={config.disclaimer} />

        <p className="mt-8 text-sm">
          <Link href={basePath} className="text-brand-600 hover:text-brand-500">
            ← All {hubLabel.toLowerCase()}
          </Link>{" "}
          <span className="text-[var(--muted)]">· by {site.name}</span>
        </p>
      </article>
    </Container>
  );
}
