import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import ContentAge from "@/components/ContentAge";
import { HK_IDENTIFIERS, type HkIdentifier } from "@/data/healthkitIdentifiers";
import { getStandalone } from "@/data/hkStandalone";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import {
  HK_FETCHED_ON,
  HK_VERSIONS_PATH,
  HK_VERSION_MIN_MEMBERS,
  HK_VERSION_PAGES_PUBLISHED,
  familyNoun,
  getHkVersionPage,
  hkGroupHref,
  hkRowHref,
  hkVersionPages,
  hubAnchor,
  iosDeprecatedAt,
  iosIntroduced,
  skippedBetween,
  versionCapsule,
  versionDescription,
  versionFaqs,
  versionH1,
  versionPrimaryQuery,
  versionTitle,
  type HkMajor,
} from "@/lib/hkVersions";
import { hkGroupLabel, hkGroupSlugOf } from "@/data/hkGroupPages";

/**
 * One page per iOS major release: the HealthKit type identifiers that
 * release introduced. The inverse of Apple's per-identifier availability,
 * at the grain a deployment-target decision is made.
 *
 * Nothing on this page is authored. Which majors get a page (any that
 * introduced at least HK_VERSION_MIN_MEMBERS identifiers), every row, every
 * count, the capsule and the FAQs are computed from the generated identifier
 * dataset at build time (see src/lib/hkVersions.ts). A dataset refresh moves
 * the pages, adds a new major's page, or drops one, without an edit here.
 */

export const dynamicParams = false;

type Params = { version: string };

export function generateStaticParams(): Params[] {
  return hkVersionPages().map((g) => ({ version: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { version } = await params;
  const g = getHkVersionPage(version);
  if (!g) return {};
  const title = versionTitle(g);
  const description = versionDescription(g);
  return {
    title,
    description,
    alternates: { canonical: g.path },
    openGraph: {
      type: "article",
      title,
      description,
      url: g.path,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

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

function CountTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string;
  rows: { key: string; label: ReactNode; count: number }[];
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <caption className="mb-2 text-left text-sm font-semibold text-[var(--fg)]">{caption}</caption>
      <thead>
        <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
          <th scope="col" className="py-2 pr-4 font-semibold">{head}</th>
          <th scope="col" className="py-2 text-right font-semibold">Identifiers</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} className="border-b border-[var(--border)]">
            <td className="py-1.5 pr-4 text-[var(--muted)]">{r.label}</td>
            <td className="py-1.5 text-right tabular-nums text-[var(--fg)]">{r.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function IdList({ rows }: { rows: HkIdentifier[] }) {
  return (
    <>
      {rows.map((r, i) => (
        <span key={r.case}>
          {i > 0 && (i === rows.length - 1 ? " and " : ", ")}
          <Link href={hkRowHref(r)} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
            {r.case}
          </Link>
        </span>
      ))}
    </>
  );
}

function Neighbour({ g, dir }: { g: HkMajor; dir: "prev" | "next" }) {
  return (
    <Link
      href={g.path}
      rel={dir}
      className={`rounded-xl border border-[var(--border)] p-4 hover:border-brand-400/60 ${dir === "next" ? "sm:text-right" : ""}`}
    >
      <span className="block text-xs uppercase tracking-wide text-[var(--muted)]">
        {dir === "prev" ? "← Earlier release" : "Later release →"}
      </span>
      <span className="mt-1 block font-semibold text-[var(--fg)]">
        iOS {g.major} — {g.members.length} identifiers
      </span>
    </Link>
  );
}

export default async function HkVersionPage({ params }: { params: Promise<Params> }) {
  const { version } = await params;
  const g = getHkVersionPage(version);
  if (!g) notFound();

  const hub = getStandalone("healthkit-versions");
  const hubTitle = hub?.title ?? "HealthKit Types by iOS Version";

  const title = versionTitle(g);
  const h1 = versionH1(g);
  const description = versionDescription(g);
  const capsule = versionCapsule(g);
  const faqs = versionFaqs(g);

  const url = absoluteUrl(g.path);
  const pageId = `${url}#webpage`;
  const faqId = (i: number) => `faq-${i + 1}`;

  const pages = hkVersionPages();
  const at = pages.findIndex((p) => p.major === g.major);
  const prev = at > 0 ? pages[at - 1] : null;
  const next = at >= 0 ? (pages[at + 1] ?? null) : null;
  const skippedBefore = prev ? skippedBetween(prev.major, g.major) : [];
  const skippedAfter = next ? skippedBetween(g.major, next.major) : [];
  const skipped = [...skippedBefore, ...skippedAfter];

  // Page dates and data date kept apart, as on the hub: datePublished and
  // dateModified are this page's own; HK_FETCHED_ON, the date the dataset
  // read Apple's documentation, is lastReviewed and the visible date line.
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: h1,
        alternativeHeadline: versionPrimaryQuery(g),
        description,
        datePublished: HK_VERSION_PAGES_PUBLISHED,
        dateModified: HK_VERSION_PAGES_PUBLISHED,
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
        name: title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: HK_FETCHED_ON,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}/opengraph-image` },
      },
    ],
  };

  const faqJsonLd = {
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

  const familyRows = g.families.map((f) => ({
    key: f.family,
    label: familyNoun(f.family, f.count),
    count: f.count,
  }));
  const pageRows = g.sitePages.map((c) => ({
    key: c.key || "unmapped",
    label: c.key ? (
      <Link href={`/healthkit/${c.key}`} className="text-brand-600 hover:text-brand-500">
        {c.label}
      </Link>
    ) : (
      c.label
    ),
    count: c.count,
  }));
  const appleGroupRows = g.appleGroups.map((c) => ({ key: c.key, label: c.label, count: c.count }));

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "HealthKit", path: "/healthkit" },
            { name: hubTitle, path: HK_VERSIONS_PATH },
            { name: `iOS ${g.major}`, path: g.path },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {h1}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {g.members.length} of {HK_IDENTIFIERS.length} identifiers · read from Apple&rsquo;s
          documentation on {HK_FETCHED_ON}
          <ContentAge date={HK_FETCHED_ON} />
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {capsule}
        </p>

        <nav aria-label="On this page" className="mt-8 text-sm">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[var(--muted)]">
            <li>
              <a href="#counts" className="hover:text-[var(--fg)]">
                Counts
              </a>
            </li>
            <li>
              <a href="#status" className="hover:text-[var(--fg)]">
                Deprecated and undocumented
              </a>
            </li>
            <li>
              <a href="#identifiers" className="hover:text-[var(--fg)]">
                Every identifier
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[var(--fg)]">
                Questions
              </a>
            </li>
          </ul>
        </nav>

        <section id="counts" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            iOS {g.major} by family and group
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {g.minors.length === 1 ? (
              <>
                All {g.members.length} were introduced in iOS {g.minors[0].version}.
              </>
            ) : (
              <>
                Introduced across {g.minors.length} point releases:{" "}
                {g.minors.map((m, i) => (
                  <span key={m.version}>
                    {i > 0 && (i === g.minors.length - 1 ? " and " : ", ")}
                    <a href={hubAnchor(m.version)} className="text-brand-600 hover:text-brand-500">
                      iOS {m.version}
                    </a>{" "}
                    ({m.count})
                  </span>
                ))}
                .
              </>
            )}{" "}
            The version is Apple&rsquo;s iOS availability for each identifier; other platforms carry
            their own.
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <CountTable caption="By identifier family" head="Family" rows={familyRows} />
            <CountTable caption="By this site's group page" head="Group page" rows={pageRows} />
            <CountTable caption="By Apple's topic group" head="Apple group" rows={appleGroupRows} />
          </div>
          {g.quantity.total > 0 && (
            <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
              Of the {g.quantity.total} {familyNoun("quantity", g.quantity.total)}, Apple&rsquo;s
              prose describes {g.quantity.cumulative} as cumulative and {g.quantity.discrete} as
              discrete
              {g.quantity.unstated.length > 0 && (
                <>
                  , and states no aggregation style for {g.quantity.unstated.length}
                </>
              )}
              . Unit families:{" "}
              {g.units.map((u, i) => (
                <span key={u.key || "none"}>
                  {i > 0 && ", "}
                  {u.label} ({u.count})
                </span>
              ))}
              .
            </p>
          )}
        </section>

        <section id="status" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Deprecated, beta and undocumented in iOS {g.major}
          </h2>
          <ul className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Deprecated:</strong>{" "}
              {g.deprecated.length === 0 ? (
                <>none of the {g.members.length}.</>
              ) : (
                <>
                  {g.deprecated.length} —{" "}
                  {g.deprecated.map((r, i) => {
                    const dep = iosDeprecatedAt(r);
                    return (
                      <span key={r.case}>
                        {i > 0 && "; "}
                        <Link
                          href={hkRowHref(r)}
                          className="font-mono text-[13px] text-brand-600 hover:text-brand-500"
                        >
                          {r.case}
                        </Link>
                        {dep ? ` (iOS ${dep})` : ""}
                        {r.deprecation?.message ? `: “${r.deprecation.message}”` : ""}
                      </span>
                    );
                  })}
                  . Read from the <code>deprecatedAt</code> version on Apple&rsquo;s platform entries.
                </>
              )}
            </li>
            <li>
              <strong className="text-[var(--fg)]">Beta:</strong>{" "}
              {g.beta.length === 0 ? (
                <>none, as of {HK_FETCHED_ON}.</>
              ) : (
                <>
                  <IdList rows={g.beta} />.
                </>
              )}
            </li>
            <li>
              <strong className="text-[var(--fg)]">No abstract and no discussion:</strong>{" "}
              {g.undocumented.length === 0 ? (
                <>none.</>
              ) : (
                <>
                  <IdList rows={g.undocumented} />.
                </>
              )}
            </li>
            {g.noAbstract.length > g.undocumented.length && (
              <li>
                <strong className="text-[var(--fg)]">No abstract (discussion present):</strong>{" "}
                <IdList rows={g.noAbstract.filter((r) => !r.undocumented)} />.
              </li>
            )}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Every deprecated, beta and undocumented identifier across all releases is on{" "}
            <Link href="/healthkit-status" className="font-medium text-brand-600 hover:text-brand-500">
              HealthKit deprecated and beta types
            </Link>
            .
          </p>
        </section>

        <section id="identifiers" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Every identifier introduced in iOS {g.major}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Sorted by family, then name. Each name links to its row on its group page, where the
            Android equivalent and read-only flag sit beside it.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-4 font-semibold">Identifier</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Family</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Group</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Apple&rsquo;s abstract</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Aggregate</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Unit</th>
                  <th scope="col" className="py-2 font-semibold">iOS</th>
                </tr>
              </thead>
              <tbody>
                {g.members.map((r) => {
                  const groupHref = hkGroupHref(r);
                  const slug = hkGroupSlugOf(r);
                  const dep = iosDeprecatedAt(r);
                  const beta = r.platforms.some((p) => p.beta);
                  return (
                    <tr key={r.case} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4">
                        <Link
                          href={hkRowHref(r)}
                          className="font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                        >
                          {r.case}
                        </Link>
                        <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">
                          {r.objc}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">{familyNoun(r.family, 1)}</td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                        {groupHref && slug ? (
                          <Link href={groupHref} className="hover:text-[var(--fg)]">
                            {hkGroupLabel(slug)}
                          </Link>
                        ) : (
                          r.group
                        )}
                        {slug && hkGroupLabel(slug) !== r.group && (
                          <span className="mt-0.5 block text-[11px]">Apple: {r.group}</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-[var(--muted)]">
                        {r.abstract ? r.abstract : <em>no abstract</em>}
                      </td>
                      <td className="py-2 pr-4 text-[var(--muted)]">
                        <AggregateCell m={r} />
                      </td>
                      <td className="py-2 pr-4 text-[var(--muted)]">
                        <span className="text-xs">
                          {r.unitFamily ?? (r.family === "quantity" ? "not stated" : "—")}
                        </span>
                      </td>
                      <td className="py-2 text-[var(--muted)]">
                        <span className="text-xs">
                          {iosIntroduced(r)}
                          {beta ? " (beta)" : ""}
                        </span>
                        {r.deprecated && (
                          <span className="mt-0.5 block text-[11px]">
                            {dep ? `deprecated in ${dep}` : "deprecated"}
                          </span>
                        )}
                        {r.undocumented && <span className="mt-0.5 block text-[11px]">undocumented</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="faq" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <div className="mt-5 space-y-5">
            {faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-bold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {(prev || next) && (
          <nav aria-label="Other iOS releases" className="mt-12 grid gap-3 sm:grid-cols-2">
            {prev ? <Neighbour g={prev} dir="prev" /> : <span />}
            {next ? <Neighbour g={next} dir="next" /> : <span />}
          </nav>
        )}
        {skipped.length > 0 && (
          <p className="mt-4 text-sm text-[var(--muted)]">
            {skipped.map((s, i) => (
              <span key={s.major}>
                {i > 0 && "; "}
                iOS {s.major} introduced {s.members.length}{" "}
                {s.members.length === 1 ? "identifier" : "identifiers"} (
                {s.minors.map((m, j) => (
                  <span key={m.version}>
                    {j > 0 && ", "}
                    <a href={hubAnchor(m.version)} className="text-brand-600 hover:text-brand-500">
                      {m.version}
                    </a>
                  </span>
                ))}
                )
              </span>
            ))}
            , under the {HK_VERSION_MIN_MEMBERS} a release needs for a page of its own, so{" "}
            {skipped.length === 1 ? "it is" : "they are"} listed only on the full table.
          </p>
        )}

        <p className="mt-12 text-sm text-[var(--muted)]">
          Computed by {site.name} from Apple&rsquo;s published documentation, read {HK_FETCHED_ON}.
          Every release on one page is at{" "}
          <Link href={HK_VERSIONS_PATH} className="font-medium text-brand-600 hover:text-brand-500">
            {hubTitle}
          </Link>
          ; the whole set with value enums is at{" "}
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
