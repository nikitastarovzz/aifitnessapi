import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import { Mdx } from "@/components/mdx";
import { HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ROWS } from "@/data/matrix";
import { getStandalone } from "@/data/hkStandalone";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * HealthKit types against their Android Health Connect record types.
 *
 * The rows come from the verified cross-platform matrix — every pairing was
 * confirmed against Apple's and Google's own documentation. The point of the
 * page is the mismatches: a pairing that looks equivalent and is not (Apple
 * stores HRV as SDNN, Health Connect stores RMSSD) is worse than no pairing
 * at all, because it gets normalised into one field and silently corrupts a
 * dataset.
 */

const SLUG = "health-connect-records";
const PATH = `/${SLUG}`;
const PROSE =
  "prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]";

const WITH_WARNING = ROWS.filter((r) => r.watchOut);

export function generateMetadata(): Metadata {
  const entry = getStandalone(SLUG);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.metaDescription,
    alternates: { canonical: PATH },
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.metaDescription,
      url: PATH,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.metaDescription,
    },
  };
}

export default function HealthConnectRecordsPage() {
  const entry = getStandalone(SLUG);
  if (!entry) notFound();

  const url = absoluteUrl(PATH);
  const pageId = `${url}#webpage`;
  const faqId = (i: number) => `faq-${i + 1}`;

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: entry.title,
        alternativeHeadline: entry.primaryQuery,
        description: entry.metaDescription,
        datePublished: HK_FETCHED_ON,
        dateModified: HK_FETCHED_ON,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "HealthKit",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: entry.title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: HK_FETCHED_ON,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}/opengraph-image` },
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "HealthKit", path: "/healthkit" },
            { name: entry.title, path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {ROWS.length} metrics verified on both platforms · {WITH_WARNING.length} carry a
          cross-platform caveat · HealthKit side read {HK_FETCHED_ON}
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {entry.metaDescription}
        </p>

        <nav aria-label="On this page" className="mt-8 text-sm">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[var(--muted)]">
            <li>
              <a href="#overview" className="hover:text-[var(--fg)]">
                Overview
              </a>
            </li>
            <li>
              <a href="#table" className="hover:text-[var(--fg)]">
                Type to record
              </a>
            </li>
            <li>
              <a href="#traps" className="hover:text-[var(--fg)]">
                What will bite you
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[var(--fg)]">
                Questions
              </a>
            </li>
          </ul>
        </nav>

        <section id="overview" className={`mt-10 ${PROSE}`}>
          <Mdx source={entry.intro} />
        </section>

        <section id="table" data-hc-records="" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            HealthKit type → Health Connect record
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {ROWS.length} metrics, each confirmed against Apple&rsquo;s and Google&rsquo;s own
            documentation. A pairing here means the two platforms expose the same metric — not that
            the values are interchangeable, which is what the caveat column is for.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-2 pr-4 font-semibold text-[var(--fg)]">Metric</th>
                  <th className="py-2 pr-4 font-semibold text-[var(--fg)]">Apple HealthKit</th>
                  <th className="py-2 pr-4 font-semibold text-[var(--fg)]">Android Health Connect</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">Watch out</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr
                    key={r.id}
                    id={r.id}
                    className="border-b border-[var(--border)] align-top scroll-mt-24"
                  >
                    <td className="py-2 pr-4">
                      <Link
                        href={r.href}
                        className="font-medium text-brand-600 hover:text-brand-500"
                      >
                        {r.label}
                      </Link>
                    </td>
                    <td className="py-2 pr-4">
                      <code className="font-mono text-xs text-[var(--fg)]">{r.apple}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code className="font-mono text-xs text-[var(--fg)]">{r.android}</code>
                    </td>
                    <td className="py-2 text-[var(--muted)]">
                      {r.watchOut ? r.watchOut : <span aria-hidden>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="traps" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What will bite you</h2>
          <div className={`mt-4 ${PROSE}`}>
            <Mdx source={entry.traps} />
          </div>
        </section>

        <section id="faq" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <div className="mt-5 space-y-5">
            {entry.faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-bold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-sm text-[var(--muted)]">
          Compiled by {site.name}; the HealthKit side was read from Apple&rsquo;s published
          documentation on {HK_FETCHED_ON}. Every HealthKit identifier with units, aggregation and
          value enums is at{" "}
          <Link href="/healthkit-identifiers" className="font-medium text-brand-600 hover:text-brand-500">
            every HealthKit type identifier
          </Link>
          , and the machine-readable export is on{" "}
          <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
            datasets
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
