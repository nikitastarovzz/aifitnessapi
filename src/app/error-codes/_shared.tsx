import { absoluteUrl, site } from "@/lib/site";
import { orgRef, publishedDate, WEBSITE_ID } from "@/lib/schema";

/**
 * Shared scaffolding for the generated error-code references and the Health
 * Connect release tracker: the JSON-LD graph (TechArticle + WebPage, the
 * pattern /healthkit-status uses), the FAQPage node, and the FAQ section.
 * BreadcrumbList is NOT built here — <Breadcrumbs> is its single source.
 *
 * Not a route: Next only treats page/layout/route/opengraph-image files as
 * route segments.
 */

export type Faq = { q: string; a: string };

export const faqId = (i: number) => `faq-${i + 1}`;

/** "1, 2 and 3" — for capsules that list computed names. */
export function listOf(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

/** n with its noun, pluralised. */
export function count(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function articleGraph({
  path,
  title,
  description,
  modified,
  section,
  pageType = "WebPage",
  parts,
}: {
  path: string;
  title: string;
  description: string;
  /** The data date (the generator's FETCHED_ON). */
  modified: string;
  section: string;
  pageType?: "WebPage" | "CollectionPage";
  /** For a hub: the pages it collects. */
  parts?: { name: string; path: string }[];
}) {
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: title,
        description,
        // A new page has no row in the git-derived map yet, so this falls
        // back to the data date — never a date later than dateModified.
        datePublished: publishedDate(path.replace(/^\//, ""), modified),
        dateModified: modified,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: section,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": pageType,
        "@id": pageId,
        url,
        name: title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: modified,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${url}/opengraph-image` },
        ...(parts?.length
          ? {
              hasPart: parts.map((p) => ({ "@type": "WebPage", name: p.name, url: absoluteUrl(p.path) })),
            }
          : {}),
      },
    ],
  };
}

export function faqGraph(path: string, faqs: Faq[]) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#${faqId(i)}`,
      url: `${url}#${faqId(i)}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
      <div className="mt-5 space-y-5">
        {faqs.map((f, i) => (
          <div key={f.q} id={faqId(i)} className="scroll-mt-24 rounded-xl border border-[var(--border)] p-5">
            <h3 className="font-bold text-[var(--fg)]">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export const CAPSULE =
  "speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6";
export const LINK = "font-medium text-brand-600 hover:text-brand-500";
export const TH = "py-2 pr-4 font-semibold text-[var(--fg)]";

export { site };
