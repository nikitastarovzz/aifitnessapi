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
 * HealthKit identifiers by the iOS version that introduced them.
 *
 * Apple documents availability per identifier page; nobody publishes the
 * inverse — "what became available in iOS 16" — which is the question you
 * actually ask when you pick a deployment target. Grouping is derived from
 * the generated dataset at render time, so a dataset refresh moves the rows
 * without an edit here.
 */

const SLUG = "healthkit-versions";
const PATH = `/${SLUG}`;
/** Above this many members a version gets a count and a collapsed list, not
 *  a table — iOS 8.0 alone carries over half the catalogue. */
const BIG = 20;

function iosVersion(r: HkIdentifier): string | null {
  return r.platforms.find((p) => p.name === "iOS")?.introducedAt ?? null;
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => Number(n) || 0);
  const pb = b.split(".").map((n) => Number(n) || 0);
  return (pa[0] ?? 0) - (pb[0] ?? 0) || (pa[1] ?? 0) - (pb[1] ?? 0);
}

function anchorFor(id: HkIdentifier): string {
  return `/healthkit-identifiers#id-${id.case.toLowerCase()}`;
}

function clip(s: string, n = 90): string {
  if (!s) return "";
  return s.length <= n ? s : `${s.slice(0, n).trimEnd()}…`;
}

const BY_VERSION: { version: string; members: HkIdentifier[] }[] = (() => {
  const m = new Map<string, HkIdentifier[]>();
  for (const id of HK_IDENTIFIERS) {
    const v = iosVersion(id);
    if (!v) continue;
    const list = m.get(v) ?? [];
    list.push(id);
    m.set(v, list);
  }
  return [...m.entries()]
    .sort((a, b) => compareVersions(a[0], b[0]))
    .map(([version, members]) => ({
      version,
      members: [...members].sort((x, y) => x.case.localeCompare(y.case)),
    }));
})();

const UNSTATED = HK_IDENTIFIERS.filter((r) => !iosVersion(r));

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

export default function HealthKitVersionsPage() {
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
          {HK_IDENTIFIERS.length} identifiers across {BY_VERSION.length} iOS releases · read from
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
                Release by release
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

        <section id="overview" className="mt-10 prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
          <Mdx source={entry.intro} />
        </section>

        <section id="table" data-hk-versions="" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Every identifier, by the iOS release that introduced it
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Grouped on the iOS availability Apple publishes per identifier. Other platforms carry
            their own — an identifier available since iOS 8.0 arrived on watchOS in 2.0 and on
            macOS in 13.0 — so treat this as the iOS deployment-target axis only.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {BY_VERSION.map((g) => (
              <li key={g.version}>
                <a
                  href={`#ios-${g.version.replace(".", "-")}`}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  iOS {g.version}{" "}
                  <span className="font-semibold tabular-nums text-[var(--fg)]">
                    {g.members.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {BY_VERSION.map((g) => (
            <section key={g.version} id={`ios-${g.version.replace(".", "-")}`} className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">
                iOS {g.version} — {g.members.length}{" "}
                {g.members.length === 1 ? "identifier" : "identifiers"}
              </h2>

              {g.members.length > BIG ? (
                <>
                  <p className="mt-3 leading-relaxed text-[var(--muted)]">
                    {g.members.length} identifiers — over{" "}
                    {Math.round((g.members.length / HK_IDENTIFIERS.length) * 100)}% of the whole
                    catalogue — date from this release. They are the baseline every app already
                    has, so they are collapsed here rather than listed as a table you would scroll
                    past.
                  </p>
                  <details className="mt-4 rounded-xl border border-[var(--border)] p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
                      Show all {g.members.length} identifiers introduced in iOS {g.version}
                    </summary>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {g.members.map((r) => (
                        <li key={r.case}>
                          <Link
                            href={anchorFor(r)}
                            className="rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--muted)] hover:text-[var(--fg)]"
                          >
                            {r.case}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-left">
                        <th className="py-2 pr-4 font-semibold text-[var(--fg)]">Identifier</th>
                        <th className="py-2 pr-4 font-semibold text-[var(--fg)]">Family</th>
                        <th className="py-2 font-semibold text-[var(--fg)]">Apple&rsquo;s abstract</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.members.map((r) => (
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
                          <td className="py-2 text-[var(--muted)]">
                            {r.abstract ? (
                              clip(r.abstract)
                            ) : (
                              <em>no abstract published</em>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          {UNSTATED.length > 0 && (
            <p className="mt-8 text-sm text-[var(--muted)]">
              {UNSTATED.length} identifiers carry no iOS availability in Apple&rsquo;s
              documentation and are not grouped above.
            </p>
          )}
        </section>

        <section id="traps" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What will bite you</h2>
          <div className="mt-4 prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
            <Mdx source={entry.traps} />
          </div>
        </section>

        <section id="faq" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <div className="mt-5 space-y-5">
            {entry.faqs.map((f, i) => (
              <div
                key={f.q}
                id={faqId(i)}
                className="rounded-xl border border-[var(--border)] p-5"
              >
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
