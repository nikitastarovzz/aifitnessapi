import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import HcRecordNames from "@/components/hc/HcRecordNames";
import {
  HK_FETCHED_ON,
  HK_METADATA_KEYS_FETCHED_ON,
  HK_ID_BASE,
  hkPageIdentifiers,
  getHkIdentifierPage,
  hkSlug,
  hkIdentifierPath,
  hkIdentifierPagePath,
  hkPageTitle,
  hkPageH1,
  hkPageDescription,
  hkPageCapsule,
  hkPageFaqs,
  hkFacts,
  hkUnitEvidence,
  hkReadOnlyEvidence,
  hkMatrixMatch,
  hkMetadataTies,
  hkGroupRowHref,
  hkGroupName,
  hkPageModified,
  hkFamilyNoun,
  hkFamilyIndexUrl,
  iosEntry,
} from "@/data/hkIdentifierPages";
import type { HkIdentifier } from "@/data/healthkitIdentifiers";
import { pagesLinkingHkIdentifier } from "@/data/typePagesRelated";
import { hkVersionPages, hubAnchor, versionH1 } from "@/lib/hkVersions";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, publishedDate, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

/**
 * One page per HealthKit identifier that clears the thin-page rule in
 * src/data/hkIdentifierPages.ts — the query is the Swift case
 * ("activeEnergyBurned") or its Objective-C constant, so both lead.
 *
 * Every block is a field of the generated identifier dataset or a row of
 * another generated file, rendered as-is: Apple's abstract and sentences
 * quoted verbatim, availability straight from Apple's platform entries, the
 * Android side only where the verified matrix names the identifier. Each
 * block that counts toward the thin-page rule carries data-fact, and qa's
 * TYPE-PAGE-EVIDENCE checks the rendered evidence behind every one.
 *
 * No markdown mirror exists for this section, so no text/markdown alternate.
 */

export const dynamicParams = false;

type Params = { case: string };

export function generateStaticParams(): Params[] {
  return hkPageIdentifiers().map((id) => ({ case: hkSlug(id.case) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { case: slug } = await params;
  const id = getHkIdentifierPage(slug);
  if (!id) return {};
  const canonical = hkIdentifierPath(id);
  const title = hkPageTitle(id);
  const description = hkPageDescription(id);
  const modified = hkPageModified(id);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: publishedDate(canonical.slice(1), modified),
      modifiedTime: modified,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const LINK = "font-medium text-brand-600 hover:text-brand-500";

function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-[13px] text-[var(--fg)]">{children}</code>;
}

/** /healthkit-units' own anchor formula for a unit family's section. */
function unitAnchor(family: string): string {
  return `unit-${family.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

/** Apple's sentences keep their text but not their links; where a link was,
 *  the generator leaves "( )" or a dangling "described in". */
function hasDroppedLinks(s: string | null): boolean {
  return !!s && /\(\s*\)|\b(?:in|see)\s*[.)]/.test(s);
}

function Facts({ id }: { id: HkIdentifier }) {
  const group = hkGroupName(id);
  const groupHref = hkGroupRowHref(id);
  const rows: [string, React.ReactNode][] = [
    ["Swift", <Code key="s">{`${id.familyType}.${id.case}`}</Code>],
    ["Objective-C", <Code key="o">{id.objc}</Code>],
    ["Family", <Code key="f">{id.familyType}</Code>],
    ["Apple's topic group", id.group],
  ];
  if (group && groupHref) {
    rows.push([
      "Group page",
      <Link key="g" href={groupHref} className={LINK}>
        {group}
      </Link>,
    ]);
  }
  rows.push([
    "Apple's reference",
    <a key="d" href={id.docUrl} className={LINK} rel="noopener">
      {id.case} on developer.apple.com
    </a>,
  ]);
  return (
    <dl className="mt-5 grid gap-x-6 gap-y-3 rounded-2xl border border-[var(--border)] p-5 text-sm sm:grid-cols-[11rem_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-semibold text-[var(--fg)]">{k}</dt>
          <dd className="min-w-0 text-[var(--muted)]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Evidence({ fact, children }: { fact: string; children: string }) {
  return (
    <blockquote
      data-evidence={fact}
      className="mt-3 border-l-4 border-brand-400/60 pl-4 text-[var(--fg)]"
    >
      {children}
    </blockquote>
  );
}

export default async function HkIdentifierPage({ params }: { params: Promise<Params> }) {
  const { case: slug } = await params;
  const id = getHkIdentifierPage(slug);
  if (!id) notFound();

  const path = hkIdentifierPath(id);
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;
  const title = hkPageTitle(id);
  const h1 = hkPageH1(id);
  const description = hkPageDescription(id);
  const capsule = hkPageCapsule(id);
  const faqs = hkPageFaqs(id);
  const faqId = (i: number) => `faq-${i + 1}`;
  const facts = hkFacts(id);
  const modified = hkPageModified(id);
  const published = publishedDate(path.slice(1), modified);
  const noun = hkFamilyNoun(id);
  const isQuantity = id.family === "quantity";
  const unitEv = hkUnitEvidence(id);
  const readOnly = hkReadOnlyEvidence(id);
  const matrix = hkMatrixMatch(id);
  const ties = hkMetadataTies(id);
  const ios = iosEntry(id);
  const major = ios?.introducedAt ? Number(ios.introducedAt.split(".")[0]) : null;
  const versionPage = hkVersionPages().find((g) => g.major === major) ?? null;
  const versionHref = versionPage ? versionPage.path : ios?.introducedAt ? hubAnchor(ios.introducedAt) : null;
  const related = pagesLinkingHkIdentifier(id.case, path);
  const groupHref = hkGroupRowHref(id);
  const group = hkGroupName(id);
  const all = hkPageIdentifiers();
  const at = all.findIndex((x) => x.case === id.case);
  const prev = at > 0 ? all[at - 1] : null;
  const next = at >= 0 ? (all[at + 1] ?? null) : null;
  const replacementLinks = (id.deprecation?.replacements ?? []).map((r) => ({ name: r, href: hkIdentifierPagePath(r) }));

  const sources = [
    { name: `Apple — ${id.familyType}.${id.case}`, url: id.docUrl, read: HK_FETCHED_ON },
    { name: `Apple — ${id.familyType}`, url: hkFamilyIndexUrl(id), read: HK_FETCHED_ON },
    ...ties.map((t) => ({ name: `Apple — ${t.key.swiftName}`, url: t.key.docUrl, read: HK_METADATA_KEYS_FETCHED_ON })),
  ];

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": articleId,
        headline: h1,
        alternativeHeadline: id.objc,
        description,
        datePublished: published,
        dateModified: modified,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "HealthKit reference",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        about: { "@type": "Thing", name: `${id.familyType}.${id.case}`, sameAs: id.docUrl },
        citation: sources.map((s) => ({ "@type": "TechArticle", url: s.url, name: s.name })),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: modified,
        reviewedBy: orgRef(),
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

  const toc: [string, string][] = [
    ["#apple", "Apple's description"],
    ["#availability", "Availability"],
    [isQuantity ? "#aggregation" : "#values", isQuantity ? "Sum or average" : "Values"],
    ["#writing", "Writing samples"],
    ["#android", "Android"],
    ...(ties.length ? ([["#metadata", "Metadata keys"]] as [string, string][]) : []),
    ["#related", "On this site"],
    ["#faq", "Questions"],
  ];

  const tools: { href: string; name: string }[] = [
    { href: "/tools/aggregation-checker", name: "Sum it or average it? — the aggregation checker" },
    ...(isQuantity ? [{ href: "/tools/query-generator", name: "HealthKit statistics query generator" }] : []),
    ...(matrix ? [{ href: "/tools/identifier-translator", name: "HealthKit to Health Connect translator" }] : []),
    { href: "/tools/permission-builder", name: "HealthKit permission set builder" },
  ];

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-4xl" data-hk-identifier={id.case} data-type-facts={facts.join(" ")}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "HealthKit identifiers", path: HK_ID_BASE },
            { name: id.case, path },
          ]}
        />

        <ClusterHero label="HealthKit reference" seed={stringSeed(id.case)} />

        <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {h1}
        </h1>
        <p className="mt-3 break-words text-sm text-[var(--muted)]">
          <code className="font-mono text-[13px]">{id.objc}</code> · read from Apple&rsquo;s documentation on{" "}
          {HK_FETCHED_ON}
          <ContentAge date={HK_FETCHED_ON} />
        </p>

        <p
          id="answer"
          className="speakable mt-6 break-words rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {capsule}
        </p>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2 text-sm">
          {toc.map(([href, text]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {text}
            </a>
          ))}
        </nav>

        <section id="apple" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What Apple says {id.case} is</h2>
          <blockquote data-evidence="abstract" className="mt-4 border-l-4 border-brand-400/60 pl-5 text-lg text-[var(--fg)]">
            {id.abstract}
          </blockquote>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Apple&rsquo;s abstract, quoted from its{" "}
            <a href={id.docUrl} className={LINK} rel="noopener">
              {id.case} reference page
            </a>
            , read {HK_FETCHED_ON}. Apple&rsquo;s discussion of the type runs {id.discussionWords}{" "}
            {id.discussionWords === 1 ? "word" : "words"}.
          </p>
          <Facts id={id} />
        </section>

        <section id="availability" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Availability</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            The versions Apple&rsquo;s documentation data gives for {id.case}, platform by platform, as read on{" "}
            {HK_FETCHED_ON}.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-4 font-semibold">Platform</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Introduced</th>
                  <th scope="col" className="py-2 font-semibold">Deprecated</th>
                </tr>
              </thead>
              <tbody>
                {id.platforms.map((p) => (
                  <tr key={p.name} className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4 text-[var(--fg)]">{p.name}</td>
                    <td className="py-2 pr-4 tabular-nums text-[var(--muted)]">
                      {p.introducedAt ?? "not stated"}
                      {p.beta ? " (beta)" : ""}
                    </td>
                    <td className="py-2 tabular-nums text-[var(--muted)]">
                      {p.deprecatedAt ?? (p.deprecated ? "yes, no version given" : "—")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {id.deprecated && (
            <div
              data-fact={facts.includes("deprecation") ? "deprecation" : undefined}
              className="mt-5 rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm text-[var(--fg)]"
            >
              <p className="font-semibold">Apple marks {id.case} deprecated.</p>
              {id.deprecation?.message ? (
                <Evidence fact="deprecation">{id.deprecation.message}</Evidence>
              ) : (
                <p className="mt-1">Apple gives no deprecation note.</p>
              )}
              {replacementLinks.length > 0 && (
                <p className="mt-2">
                  Apple&rsquo;s note points to{" "}
                  {replacementLinks.map((r, i) => (
                    <span key={r.name}>
                      {i > 0 ? ", " : ""}
                      {r.href ? (
                        <Link href={r.href} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                          {r.name}
                        </Link>
                      ) : (
                        <Code>{r.name}</Code>
                      )}
                    </span>
                  ))}
                  {id.deprecation?.renamedTo ? (
                    <>
                      , and its platform entries record the rename target <Code>{id.deprecation.renamedTo}</Code>
                    </>
                  ) : null}
                  .
                </p>
              )}
            </div>
          )}
          {versionHref && ios?.introducedAt && (
            <p className="mt-4 text-sm text-[var(--muted)]">
              The rest of that release:{" "}
              <Link href={versionHref} className={LINK}>
                {versionPage ? versionH1(versionPage) : `iOS ${ios.introducedAt} on the HealthKit version timeline`}
              </Link>
              .
            </p>
          )}
        </section>

        {isQuantity ? (
          <section id="aggregation" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Sum or average, and in which units</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Apple states both of these in the prose of the type&rsquo;s discussion, not as properties, so they are derived
              from Apple&rsquo;s sentence and the sentence is shown with each.
            </p>

            <div data-fact={facts.includes("aggregation") ? "aggregation" : undefined} className="mt-6">
              <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">Aggregation style</h3>
              {id.aggregation && id.aggregationEvidence ? (
                <>
                  <p className="mt-2 text-[var(--muted)]">
                    <strong className="text-[var(--fg)]">{id.aggregation}</strong> — in an{" "}
                    <code className="font-mono text-sm">HKStatisticsQuery</code>, use{" "}
                    {id.aggregation === "cumulative" ? (
                      <code className="font-mono text-sm">.cumulativeSum</code>
                    ) : (
                      <>
                        <code className="font-mono text-sm">.discreteAverage</code>,{" "}
                        <code className="font-mono text-sm">.discreteMin</code> or{" "}
                        <code className="font-mono text-sm">.discreteMax</code>
                      </>
                    )}
                    . Apple&rsquo;s sentence:
                  </p>
                  <Evidence fact="aggregation">{id.aggregationEvidence}</Evidence>
                </>
              ) : (
                <p className="mt-2 text-[var(--muted)]">Apple does not state it in this type&rsquo;s documentation.</p>
              )}
            </div>

            <div data-fact={facts.includes("unit-family") ? "unit-family" : undefined} className="mt-6">
              <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">Unit family</h3>
              {id.unitFamily ? (
                <>
                  <p className="mt-2 text-[var(--muted)]">
                    <strong className="text-[var(--fg)]">{id.unitFamily}</strong>
                    {" — "}every type in this family is on{" "}
                    <Link href={`/healthkit-units#${unitAnchor(id.unitFamily)}`} className={LINK}>
                      the HKUnit reference
                    </Link>
                    .{unitEv && unitEv !== id.aggregationEvidence ? " Apple's sentence:" : ""}
                  </p>
                  {unitEv ? (
                    unitEv === id.aggregationEvidence ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Apple states it in the same sentence as the aggregation style, quoted above.
                      </p>
                    ) : (
                      <Evidence fact="unit-family">{unitEv}</Evidence>
                    )
                  ) : (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      The generator read this unit family from a sentence of Apple&rsquo;s discussion that the dataset does
                      not store — it keeps one sentence per type, and for {id.case} that sentence states the aggregation,
                      not the unit — so it cannot be quoted here.{" "}
                      <a href={id.docUrl} className={LINK} rel="noopener">
                        Apple&rsquo;s page
                      </a>{" "}
                      has it.
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-2 text-[var(--muted)]">Apple does not state it in this type&rsquo;s documentation.</p>
              )}
            </div>
            {(hasDroppedLinks(id.aggregationEvidence) || hasDroppedLinks(unitEv)) && (
              <p className="mt-4 text-xs text-[var(--muted)]">
                Empty parentheses and a dangling &ldquo;described in&rdquo; mark links in Apple&rsquo;s sentence to other
                documentation pages: the generator keeps the sentence&rsquo;s text, not its links, and the quote is left
                as stored rather than repaired.
              </p>
            )}
          </section>
        ) : (
          <section id="values" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What a sample holds</h2>
            {id.family === "category" && (
              <div data-fact={facts.includes("value-enum") ? "value-enum" : undefined} className="mt-4">
                <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">Value enum</h3>
                {id.valueEnum ? (
                  <p className="mt-2 text-[var(--muted)]">
                    <code data-evidence="value-enum" className="font-mono text-sm text-[var(--fg)]">
                      {id.valueEnum}
                    </code>{" "}
                    — the enum Apple&rsquo;s page for {id.case} names
                    {id.valueEnum === "HKCategoryValue" ? ": the generic one, not one of its own" : ""}. Every category
                    type&rsquo;s enum is on{" "}
                    <Link href={`/healthkit-category-values#id-${id.case.toLowerCase()}`} className={LINK}>
                      the HKCategoryValue reference
                    </Link>
                    .
                  </p>
                ) : (
                  <p className="mt-2 text-[var(--muted)]">Apple&rsquo;s page names no enum the generator could match.</p>
                )}
              </div>
            )}
            <p className="mt-4 text-sm text-[var(--muted)]">
              Aggregation style and unit family apply only to quantity types. For a {noun} the dataset records neither,
              because the concept does not apply — not because Apple declined to say.
            </p>
          </section>
        )}

        <section id="writing" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Can apps write {id.case}?</h2>
          {readOnly ? (
            <div data-fact="read-only">
              <p className="mt-2 text-[var(--muted)]">
                No. Apple&rsquo;s documentation states that these samples are read-only:
              </p>
              <Evidence fact="read-only">{readOnly}</Evidence>
            </div>
          ) : (
            <p className="mt-2 text-[var(--muted)]">
              Apple&rsquo;s documentation for {id.case} does not state that its samples are read-only. Apple states
              read-only status only in prose, and its silence is not a statement either way, so this page makes no claim
              that apps can save it.
            </p>
          )}
        </section>

        <section id="android" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">On Android Health Connect</h2>
          {matrix ? (
            <div data-fact="cross-platform" className="mt-3 text-[var(--muted)]">
              <p>
                {matrix.oneToOne ? (
                  <>
                    The{" "}
                    <Link href={`/matrix#${matrix.row.id}`} className={LINK}>
                      verified cross-platform matrix
                    </Link>{" "}
                    pairs {id.case} with{" "}
                    <span className="font-mono text-[13px]">
                      <HcRecordNames text={matrix.row.android} />
                    </span>{" "}
                    in its <strong className="text-[var(--fg)]">{matrix.row.label}</strong> row.
                  </>
                ) : (
                  <>
                    {id.case} sits in the{" "}
                    <Link href={`/matrix#${matrix.row.id}`} className={LINK}>
                      verified cross-platform matrix
                    </Link>
                    &rsquo;s <strong className="text-[var(--fg)]">{matrix.row.label}</strong> row, which names{" "}
                    <Code>{matrix.row.apple}</Code> on Apple and{" "}
                    <span className="font-mono text-[13px]">
                      <HcRecordNames text={matrix.row.android} />
                    </span>{" "}
                    on Android. The row groups the metric; it does not pair each Apple type with one Android record.
                  </>
                )}
              </p>
              {matrix.row.watchOut && (
                <div className="mt-3 rounded-xl border border-[var(--border)] p-4 text-sm">
                  <strong className="text-[var(--fg)]">The matrix&rsquo;s caveat for this row:</strong>
                  <Evidence fact="cross-platform">{matrix.row.watchOut}</Evidence>
                </div>
              )}
              <p className="mt-3 text-sm">
                The metric guide for this row:{" "}
                <Link href={matrix.row.href} className={LINK}>
                  {matrix.row.label} on every platform
                </Link>
                .
              </p>
            </div>
          ) : (
            <p className="mt-3 text-[var(--muted)]">
              No verified Health Connect counterpart. The{" "}
              <Link href="/matrix" className={LINK}>
                cross-platform matrix
              </Link>{" "}
              pairs only metrics checked against both Apple&rsquo;s and Google&rsquo;s documentation, and {id.case} is
              not among them. A similarly named{" "}
              <Link href="/health-connect" className={LINK}>
                Health Connect record
              </Link>{" "}
              may exist, but a name match is not a verified mapping.
            </p>
          )}
        </section>

        {ties.length > 0 && (
          <section id="metadata" data-fact="metadata-key" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Metadata keys Apple ties to it</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The HKMetadataKey constants whose own Apple text names {id.case}, with the sentence that does, from
              Apple&rsquo;s metadata-key pages read {HK_METADATA_KEYS_FETCHED_ON}.
            </p>
            <ul className="mt-4 space-y-4">
              {ties.map((t) => (
                <li key={t.key.swiftName} className="rounded-xl border border-[var(--border)] p-4 text-sm">
                  <Link
                    href={`/healthkit-metadata-keys#key-${t.key.swiftName.toLowerCase()}`}
                    className="break-all font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                  >
                    {t.key.swiftName}
                  </Link>
                  {t.key.valueType ? (
                    <span className="ml-2 text-xs text-[var(--muted)]">value: {t.key.valueType}</span>
                  ) : null}
                  {t.sentences.map((s) => (
                    <Evidence key={s} fact="metadata-key">
                      {s}
                    </Evidence>
                  ))}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="related" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{id.case} on this site</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {groupHref && group && (
              <li>
                <Link href={groupHref} className={LINK}>
                  {group}
                </Link>{" "}
                <span className="text-[var(--muted)]">— its group page, with every type beside it</span>
              </li>
            )}
            <li>
              <Link href={`${HK_ID_BASE}#id-${id.case.toLowerCase()}`} className={LINK}>
                Every HealthKit type identifier
              </Link>{" "}
              <span className="text-[var(--muted)]">— its row in the full table</span>
            </li>
            {related.map((r) => (
              <li key={r.path}>
                <Link href={r.path} className={LINK}>
                  {r.title}
                </Link>{" "}
                <span className="text-[var(--muted)]">— {r.section}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Tools that read it</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {tools.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 break-words text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="These pages are generated from Apple's documentation and re-published when it changes. Subscribe to hear when a HealthKit type is added, deprecated or finally documented."
          source="spoke-inline"
          id={`cta-hk-id-${hkSlug(id.case)}`}
        />

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Sources checked</h2>
          <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="text-brand-600 hover:text-brand-500" rel="noopener">
                  {s.name}
                </a>{" "}
                · read {s.read}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Apple&rsquo;s abstract and sentences are quoted for identification; the page layout, the capsule and the
            cross-platform pairing are {site.name}&rsquo;s. Generated from Apple&rsquo;s documentation by{" "}
            <code className="font-mono text-xs">scripts/fetch-healthkit-identifiers.mjs</code>, not typed by hand — the
            same data as{" "}
            <Link href={HK_ID_BASE} className={LINK}>
              the full identifier table
            </Link>
            .
          </p>
        </section>

        {(prev || next) && (
          <nav aria-label="More HealthKit identifiers" className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={hkIdentifierPath(prev)}
                className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Previous identifier</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {prev.case}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={hkIdentifierPath(next)}
                className="group rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Next identifier →</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {next.case}
                </span>
              </Link>
            )}
          </nav>
        )}

        <p className="mt-8 text-sm">
          <Link href={HK_ID_BASE} className="text-brand-600 hover:text-brand-500">
            ← All HealthKit type identifiers
          </Link>
          {groupHref && group && (
            <>
              {" · "}
              <Link href={groupHref.split("#")[0]} className="text-brand-600 hover:text-brand-500">
                {group}
              </Link>
            </>
          )}
        </p>
      </div>
    </Container>
  );
}
