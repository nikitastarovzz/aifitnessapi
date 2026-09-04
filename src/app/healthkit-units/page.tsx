import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import { Mdx } from "@/components/mdx";
import { HK_IDENTIFIERS, HK_FETCHED_ON, type HkIdentifier } from "@/data/healthkitIdentifiers";
import { getStandalone } from "@/data/hkStandalone";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * Quantity types grouped by the unit family Apple's prose states.
 *
 * HKQuantity converts freely between compatible units and throws only on
 * incompatible ones — so reading metres and rendering miles is a silent
 * wrong number, not a crash. Knowing which family a type belongs to before
 * you pick an HKUnit is the whole defence, and Apple never lists the
 * families as a set.
 */

const SLUG = "healthkit-units";
const PATH = `/${SLUG}`;
const PROSE =
  "prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]";

const QUANTITY = HK_IDENTIFIERS.filter((r) => r.family === "quantity");

/** Unit families, largest first; the types Apple leaves unstated go last. */
const BY_FAMILY: { family: string | null; members: HkIdentifier[] }[] = (() => {
  const m = new Map<string, HkIdentifier[]>();
  const none: HkIdentifier[] = [];
  for (const r of QUANTITY) {
    if (!r.unitFamily) {
      none.push(r);
      continue;
    }
    const list = m.get(r.unitFamily) ?? [];
    list.push(r);
    m.set(r.unitFamily, list);
  }
  const named = [...m.entries()]
    .map(([family, members]) => ({
      family: family as string | null,
      members: [...members].sort((a, b) => a.case.localeCompare(b.case)),
    }))
    .sort((a, b) => b.members.length - a.members.length || String(a.family).localeCompare(String(b.family)));
  return none.length > 0
    ? [...named, { family: null, members: [...none].sort((a, b) => a.case.localeCompare(b.case)) }]
    : named;
})();

const NAMED_FAMILIES = BY_FAMILY.filter((g) => g.family !== null).length;
const STATED = QUANTITY.filter((r) => r.unitFamily).length;

function familyAnchor(family: string | null): string {
  return family === null
    ? "unit-unstated"
    : `unit-${family.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

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

export default function HealthKitUnitsPage() {
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
          {QUANTITY.length} quantity types across {NAMED_FAMILIES} unit families · read from
          Apple&rsquo;s documentation on {HK_FETCHED_ON}
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
                Family by family
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

        <section id="table" data-hk-units="" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Quantity types by unit family
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Apple states a unit family in prose for {STATED} of the {QUANTITY.length} quantity
            types. The family is derived from that sentence, never guessed — where the wording does
            not state one the type is listed under &ldquo;no unit family stated&rdquo; rather than
            assigned a plausible family. The family names are Apple&rsquo;s own words, which is why
            near-synonyms such as separate percentage and distance-per-time spellings appear as
            distinct groups.
          </p>

          <div className="mt-8 space-y-8">
            {BY_FAMILY.map((g) => (
              <section key={familyAnchor(g.family)} id={familyAnchor(g.family)} className="scroll-mt-24">
                <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">
                  {g.family === null ? "No unit family stated" : g.family} —{" "}
                  <span className="tabular-nums">{g.members.length}</span>{" "}
                  {g.members.length === 1 ? "type" : "types"}
                </h3>
                {g.family === null && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    Apple&rsquo;s prose for these types names no unit family. Read the type&rsquo;s
                    own documentation before choosing an HKUnit.
                  </p>
                )}
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.members.map((r) => (
                    <li key={r.case}>
                      <Link
                        href={`/healthkit-identifiers#id-${r.case.toLowerCase()}`}
                        className="inline-block rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--muted)] hover:text-[var(--fg)]"
                      >
                        {r.case}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
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
          Derived by {site.name} from Apple&rsquo;s published documentation, read {HK_FETCHED_ON}.
          The full table with units, aggregation and value enums is at{" "}
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
