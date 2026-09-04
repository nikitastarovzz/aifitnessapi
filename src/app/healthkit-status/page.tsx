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
 * The lifecycle edges of the HealthKit catalogue: what is still beta, what
 * Apple ships with no prose at all, and what is deprecated — with the
 * distinction between Apple's deprecated *group* and the per-platform
 * deprecated *flag* kept visible, because they do not agree.
 */

const SLUG = "healthkit-status";
const PATH = `/${SLUG}`;
const PROSE =
  "prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]";

const BETA = HK_IDENTIFIERS.filter((r) => r.platforms.some((p) => p.beta));
const UNDOCUMENTED = HK_IDENTIFIERS.filter((r) => r.undocumented);
const DEPRECATED_GROUP = HK_IDENTIFIERS.filter((r) => r.group === "Deprecated activity types");
const FLAG_DEPRECATED = HK_IDENTIFIERS.filter((r) => r.platforms.some((p) => p.deprecated));

function iosVersion(r: HkIdentifier): string | null {
  return r.platforms.find((p) => p.name === "iOS")?.introducedAt ?? null;
}

function anchorFor(id: HkIdentifier): string {
  return `/healthkit-identifiers#id-${id.case.toLowerCase()}`;
}

function StatusTable({ rows }: { rows: HkIdentifier[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left">
            <th className="py-2 pr-4 font-semibold text-[var(--fg)]">Identifier</th>
            <th className="py-2 pr-4 font-semibold text-[var(--fg)]">Family</th>
            <th className="py-2 pr-4 font-semibold text-[var(--fg)]">iOS</th>
            <th className="py-2 font-semibold text-[var(--fg)]">Apple&rsquo;s abstract</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.case} className="border-b border-[var(--border)] align-top">
              <td className="py-2 pr-4">
                <Link
                  href={anchorFor(r)}
                  className="font-mono text-xs text-brand-600 hover:text-brand-500"
                >
                  {r.case}
                </Link>
              </td>
              <td className="py-2 pr-4 text-[var(--muted)]">{r.family}</td>
              <td className="py-2 pr-4 tabular-nums text-[var(--muted)]">
                {iosVersion(r) ?? "—"}
              </td>
              <td className="py-2 text-[var(--muted)]">
                {r.abstract ? r.abstract : <em>Apple publishes no abstract for this type.</em>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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

export default function HealthKitStatusPage() {
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
          {BETA.length} beta · {UNDOCUMENTED.length} undocumented · {DEPRECATED_GROUP.length}{" "}
          deprecated activity types · read from Apple&rsquo;s documentation on {HK_FETCHED_ON}
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
                Status by status
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

        <section id="table" data-hk-status="" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The four status edges of the catalogue
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Every count below is read from Apple&rsquo;s documentation for the{" "}
            {HK_IDENTIFIERS.length} identifiers on {HK_FETCHED_ON}. Beta and deprecation are
            per-platform facts in Apple&rsquo;s availability data; &ldquo;undocumented&rdquo; means
            Apple ships the declaration with neither an abstract nor a discussion.
          </p>

          <section id="status-beta" className="mt-10">
            <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              Beta — {BETA.length} {BETA.length === 1 ? "identifier" : "identifiers"}
            </h3>
            {BETA.length === 0 ? (
              <p className="mt-3 leading-relaxed text-[var(--muted)]">
                No identifier is marked beta on any platform in this read.
              </p>
            ) : (
              <>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">
                  Marked beta on at least one platform. A beta identifier compiles against the beta
                  SDK and can be renamed or withdrawn before release, so shipping against one ties
                  your release train to Apple&rsquo;s.
                </p>
                <StatusTable rows={BETA} />
              </>
            )}
          </section>

          <section id="status-undocumented" className="mt-10">
            <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              No abstract — {UNDOCUMENTED.length}{" "}
              {UNDOCUMENTED.length === 1 ? "identifier" : "identifiers"}
            </h3>
            {UNDOCUMENTED.length === 0 ? (
              <p className="mt-3 leading-relaxed text-[var(--muted)]">
                Every identifier carries at least an abstract in this read.
              </p>
            ) : (
              <>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">
                  Apple ships these with a declaration and nothing else — no abstract, no
                  discussion. The types exist and compile; what they contain and how Apple derives
                  them is simply not stated, so anything you infer from observed values is
                  unverified.
                </p>
                <StatusTable rows={UNDOCUMENTED} />
              </>
            )}
          </section>

          <section id="status-deprecated-group" className="mt-10">
            <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              Apple&rsquo;s deprecated group — {DEPRECATED_GROUP.length}{" "}
              {DEPRECATED_GROUP.length === 1 ? "identifier" : "identifiers"}
            </h3>
            {DEPRECATED_GROUP.length === 0 ? (
              <p className="mt-3 leading-relaxed text-[var(--muted)]">
                Apple&rsquo;s documentation lists no deprecated activity types in this read.
              </p>
            ) : (
              <>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">
                  Apple files these under a topic group literally named &ldquo;Deprecated activity
                  types&rdquo;. That grouping is the only deprecation signal they carry — see the
                  next section.
                </p>
                <StatusTable rows={DEPRECATED_GROUP} />
              </>
            )}
          </section>

          <section id="status-flag-deprecated" className="mt-10">
            <h3 className="text-xl font-bold tracking-tight text-[var(--fg)]">
              Platform-flag deprecated — {FLAG_DEPRECATED.length}
            </h3>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              {FLAG_DEPRECATED.length === 0 ? (
                <>
                  Zero identifiers carry a deprecation flag on any platform. Not &ldquo;none we
                  listed&rdquo; — none at all: across all {HK_IDENTIFIERS.length} identifiers and
                  every platform Apple publishes availability for, the deprecated flag is false
                  everywhere as of {HK_FETCHED_ON}. So the{" "}
                  {DEPRECATED_GROUP.length > 0
                    ? `${DEPRECATED_GROUP.length} types in Apple's deprecated group are deprecated by editorial grouping only`
                    : "deprecated grouping above is editorial only"}
                  ; nothing in the machine-readable availability data marks them, and neither the
                  compiler nor a deprecation warning will tell you.
                </>
              ) : (
                <>
                  {FLAG_DEPRECATED.length} identifiers carry a deprecation flag on at least one
                  platform in Apple&rsquo;s availability data — a machine-readable signal the
                  compiler can act on, unlike the editorial grouping above.
                </>
              )}
            </p>
            {FLAG_DEPRECATED.length > 0 && <StatusTable rows={FLAG_DEPRECATED} />}
          </section>
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
