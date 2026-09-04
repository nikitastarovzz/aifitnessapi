import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { Mdx } from "@/components/mdx";
import { HK_BASE, hkGroupLabel, releasedHkGroups, getHkGroup, HK_FETCHED_ON } from "@/data/hkGroupPages";
import type { HkFamily, HkIdentifier } from "@/data/healthkitIdentifiers";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { HK_READONLY_SET } from "@/data/healthkitWritability";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

/**
 * One page per HealthKit group — the middle layer between the flagship
 * /healthkit-identifiers table (the whole set, one URL) and Apple's own
 * per-identifier pages (a median of 23 words of discussion each).
 *
 * The authored half — intro, traps, FAQs — comes from hkGroupPages.entries.ts.
 * Everything in the table below is joined out of the generated identifier
 * dataset and the verified matrix at render time, so it cannot drift from the
 * reference pages and cannot state anything those pages do not. Android names
 * come ONLY from matrix.ts, which is restricted to metrics confirmed against
 * both platforms' documentation.
 *
 * There is no markdown mirror for these pages, so no `text/markdown`
 * alternate link and no `encoding` node in the graph.
 */

export const dynamicParams = false;

type Params = { group: string };

const FAMILY_ORDER: Record<HkFamily, number> = {
  quantity: 0,
  category: 1,
  characteristic: 2,
  workoutActivity: 3,
};

/** Identifiers our HealthKit ↔ Health Connect matrix already maps to Android.
 *  Built exactly as AppStack builds it — same source, same regex, so the two
 *  surfaces can never disagree about what is verified. */
const androidFor = new Map<string, string>();
for (const row of MATRIX_ROWS) {
  for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    androidFor.set(m[1], row.android);
  }
}

function anchorSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortMembers(members: HkIdentifier[]): HkIdentifier[] {
  return [...members].sort(
    (a, b) => FAMILY_ORDER[a.family] - FAMILY_ORDER[b.family] || a.case.localeCompare(b.case),
  );
}

export function generateStaticParams(): Params[] {
  return releasedHkGroups().map((e) => ({ group: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { group } = await params;
  const found = getHkGroup(group);
  if (!found) return {};
  const { entry } = found;
  const canonical = `${HK_BASE}/${entry.slug}`;
  return {
    // Plain, not `absolute` — the layout template appends the site suffix and
    // the writers kept every title inside 45 characters for exactly that.
    title: entry.title,
    description: entry.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: entry.title,
      description: entry.metaDescription,
      url: canonical,
      images: ["/opengraph-image"],
    },
  };
}

/** The aggregation cell. Only quantity types have an aggregation style at
 *  all; a category type carries an enum value instead, and the remaining two
 *  families carry neither. */
function AggregateCell({ m }: { m: HkIdentifier }) {
  if (m.family === "quantity") {
    if (m.aggregation === "cumulative") return <code className="font-mono text-xs">.cumulativeSum</code>;
    if (m.aggregation === "discrete") return <code className="font-mono text-xs">.discreteAverage</code>;
    return <span className="text-xs">not stated</span>;
  }
  if (m.family === "category") {
    return <span className="text-xs">enum — {m.valueEnum ?? "unresolved"}</span>;
  }
  return <span className="text-xs">—</span>;
}

function IdentifierTable({ members }: { members: HkIdentifier[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <th scope="col" className="py-2 pr-4 font-semibold">Identifier</th>
            <th scope="col" className="py-2 pr-4 font-semibold">What it is</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Aggregate</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Unit</th>
            <th scope="col" className="py-2 pr-4 font-semibold">iOS</th>
            <th scope="col" className="py-2 font-semibold">Android</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const ios = m.platforms.find((p) => p.name === "iOS");
            const beta = m.platforms.some((p) => p.beta);
            const android = androidFor.get(m.case);
            return (
              <tr
                key={m.case}
                id={`id-${m.case.toLowerCase()}`}
                className="scroll-mt-24 border-b border-[var(--border)] align-top"
              >
                <td className="py-2 pr-4">
                  <Link
                    href={`/healthkit-identifiers#id-${m.case.toLowerCase()}`}
                    className="font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                  >
                    {m.case}
                  </Link>
                  {HK_READONLY_SET.has(m.case) && (
                    <span
                      className="ml-2 rounded-full border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]"
                      title="Apple's documentation states these samples are read-only"
                    >
                      read-only
                    </span>
                  )}
                  <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">{m.objc}</span>
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">
                  {m.undocumented ? (
                    <em>No abstract published.</em>
                  ) : (
                    m.abstract
                  )}
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">
                  <AggregateCell m={m} />
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">
                  <span className="text-xs">{m.unitFamily ?? "—"}</span>
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">
                  <span className="text-xs">
                    {ios?.introducedAt ?? "—"}
                    {beta ? " (beta)" : ""}
                  </span>
                  {m.group === "Deprecated activity types" && (
                    <span className="mt-0.5 block text-[11px] text-[var(--muted)]">deprecated group</span>
                  )}
                </td>
                <td className="py-2 text-[var(--muted)]">
                  {android ? (
                    <span className="font-mono text-[12px]">{android}</span>
                  ) : (
                    <span className="text-xs">not verified</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function HkGroupPage({ params }: { params: Promise<Params> }) {
  const { group } = await params;
  const found = getHkGroup(group);
  if (!found) notFound();
  const { entry, members } = found;

  const label = hkGroupLabel(entry.slug);
  const path = `${HK_BASE}/${entry.slug}`;
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;
  const sorted = sortMembers(members);

  // Apple's own subgroups, in the order they first appear after sorting. The
  // two big pages (workout activities, nutrition) are unreadable as one flat
  // table of 60-odd rows; every other page has exactly one subgroup and gets
  // the flat table it wants. No configuration — the data decides.
  const subgroups: { name: string; rows: HkIdentifier[] }[] = [];
  for (const m of sorted) {
    const bucket = subgroups.find((s) => s.name === m.group);
    if (bucket) bucket.rows.push(m);
    else subgroups.push({ name: m.group, rows: [m] });
  }
  const grouped = subgroups.length > 1;

  const faqId = (i: number) => `faq-${i + 1}`;

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": articleId,
        headline: entry.title,
        alternativeHeadline: entry.primaryQuery,
        description: entry.metaDescription,
        datePublished: HK_FETCHED_ON,
        dateModified: HK_FETCHED_ON,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "HealthKit reference",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#answer"],
        },
      },
      {
        // `lastReviewed` / `reviewedBy` are WebPage properties in the
        // schema.org vocabulary, so they live here and not on the article.
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: entry.title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: HK_FETCHED_ON,
        reviewedBy: orgRef(),
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
            { name: "HealthKit", path: HK_BASE },
            { name: label, path },
          ]}
        />

        <ClusterHero label="HealthKit reference" seed={stringSeed(entry.slug)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {members.length} identifiers · read from Apple&rsquo;s documentation on {HK_FETCHED_ON}
        </p>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {entry.metaDescription}
        </div>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2 text-sm">
          {[
            ["#overview", "Overview"],
            ["#identifiers", "The identifiers"],
            ["#traps", "What will bite you"],
            ["#faq", "Questions"],
          ].map(([href, text]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {text}
            </a>
          ))}
        </nav>

        <section id="overview" className="scroll-mt-24">
          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
            <Mdx source={entry.intro} />
          </div>
        </section>

        <section id="identifiers" data-hk-group-table className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The {members.length} identifiers in {label.toLowerCase()}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Every field is joined from Apple&rsquo;s documentation. Aggregation style and unit family
            are the two Apple states only in prose — where its wording does not state one, this table
            says so rather than guessing. Android names appear only where the mapping is{" "}
            <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
              verified on both platforms
            </Link>
            .
          </p>

          {grouped ? (
            <>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                {subgroups.map((s) => (
                  <li key={s.name}>
                    <a
                      href={`#g-${anchorSlug(s.name)}`}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
                    >
                      {s.name}{" "}
                      <span className="font-semibold tabular-nums text-[var(--fg)]">{s.rows.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {subgroups.map((s) => (
                <div key={s.name} id={`g-${anchorSlug(s.name)}`} className="mt-10 scroll-mt-24">
                  <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">
                    {s.name}{" "}
                    <span className="ml-1 text-sm font-normal tabular-nums text-[var(--muted)]">
                      {s.rows.length}
                    </span>
                  </h3>
                  <IdentifierTable members={s.rows} />
                </div>
              ))}
            </>
          ) : (
            <IdentifierTable members={sorted} />
          )}
        </section>

        <section id="traps" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What will bite you</h2>
          <div className="prose prose-neutral mt-4 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
            <Mdx source={entry.traps} />
          </div>
        </section>

        {entry.faqs.length > 0 && (
          <section id="faq" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
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

        <ClusterCta
          pitch="We re-read Apple's documentation and re-publish these tables when they change. Subscribe and you'll hear when a type in this group is added, deprecated, or finally documented."
          source="spoke-inline"
          id={`cta-hk-${entry.slug}`}
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          All {members.length} identifiers above were read from Apple&rsquo;s documentation on{" "}
          {HK_FETCHED_ON}. See{" "}
          <Link href="/healthkit-identifiers" className="font-medium text-brand-600 hover:text-brand-500">
            the full 240-identifier table
          </Link>{" "}
          for every group at once, or{" "}
          <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
            the datasets
          </Link>{" "}
          for the same data as JSON and CSV. Apple&rsquo;s abstracts are quoted for identification; the
          grouping, the aggregation split and the cross-platform mapping are {site.name}&rsquo;s.
        </p>

        <p className="mt-8 text-sm">
          <Link href={HK_BASE} className="text-brand-600 hover:text-brand-500">
            ← All HealthKit groups
          </Link>
        </p>
      </div>
    </Container>
  );
}
