import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import { Mdx } from "@/components/mdx";
import { formatDate } from "@/lib/posts";
import { site, absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.h1,
    description: entry.metaDescription,
    datePublished: entry.updated,
    dateModified: entry.updated,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [`#${capsuleId}`],
    },
  };

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

  const faqJsonLd = entry.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entry.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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

      <article className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: hubLabel, path: basePath },
            { name: entry.h1, path: `${basePath}/${entry.slug}` },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          {entry.h1}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Updated {formatDate(entry.updated)}
        </p>

        {/* Answer-first capsule — the block voice assistants read and LLMs quote. */}
        <div
          id={capsuleId}
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {entry.answer}
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
          <Mdx source={entry.body} />
        </div>

        {entry.faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Frequently asked questions
            </h2>
            <dl className="mt-6 divide-y divide-[var(--border)]">
              {entry.faqs.map((f) => (
                <div key={f.q} className="py-5">
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
