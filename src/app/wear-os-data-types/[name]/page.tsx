import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import {
  HS_DATA_TYPES_SOURCES,
  HS_DATA_TYPES_SOURCE_UPDATED,
  HS_DATA_TYPE_ARTIFACT,
  HS_DATA_TYPE_CLASS_ADDED_IN,
  HS_PERMISSION_LIST,
  type HsDataType,
} from "@/data/healthServicesDataTypes";
import {
  HS_BASE,
  HS_DATA_TYPES_FETCHED_ON,
  hsPageTypes,
  getHsDataTypePage,
  hsSlug,
  hsRowAnchor,
  hsDataTypePath,
  hsDataTypePagePath,
  hsPageTitle,
  hsPageH1,
  hsPageDescription,
  hsPageCapsule,
  hsPageFaqs,
  hsFacts,
  hsCounterpart,
  hsClassDescription,
  hsTableMismatches,
  hsPermissionRow,
  hsPageModified,
} from "@/data/hsDataTypePages";
import { pagesUsingHsDataType } from "@/data/typePagesRelated";
import { metricGuidesForType } from "@/data/metricTypeMap";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, publishedDate, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";
import { robotsFor } from "@/data/noindex";

/**
 * One page per Wear OS Health Services DataType constant that clears the
 * thin-page rule in src/data/hsDataTypePages.ts — the query is the constant
 * ("HEART_RATE_BPM", "DataType.STEPS"), so it leads the title, the H1 and the
 * capsule.
 *
 * Every block is the generated dataset (healthServicesDataTypes.ts) rendered
 * as-is: Google's description verbatim, the declared Kotlin type, the
 * permission only where Google's permissions table names the constant — with
 * the table row it was read from — and the table quirk the generator
 * recorded. Blocks that count toward the thin-page rule carry data-fact, and
 * qa's TYPE-PAGE-EVIDENCE checks the evidence rendered for each.
 *
 * No markdown mirror exists for this section, so no text/markdown alternate.
 */

export const dynamicParams = false;

type Params = { name: string };

export function generateStaticParams(): Params[] {
  return hsPageTypes().map((t) => ({ name: hsSlug(t.name) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { name } = await params;
  const t = getHsDataTypePage(name);
  if (!t) return {};
  const canonical = hsDataTypePath(t);
  const title = hsPageTitle(t);
  const description = hsPageDescription(t);
  const modified = hsPageModified();
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    ...robotsFor(canonical),
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

function Evidence({ fact, children }: { fact: string; children: string }) {
  return (
    <blockquote data-evidence={fact} className="mt-3 border-l-4 border-brand-400/60 pl-4 text-[var(--fg)]">
      {children}
    </blockquote>
  );
}

/** The constant's own page when it has one, else its row on the table page. */
function typeHref(t: Pick<HsDataType, "name">): string {
  return hsDataTypePagePath(t.name) ?? `${HS_BASE}#${hsRowAnchor(t)}`;
}

export default async function HsDataTypePage({ params }: { params: Promise<Params> }) {
  const { name } = await params;
  const t = getHsDataTypePage(name);
  if (!t) notFound();

  const path = hsDataTypePath(t);
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;
  const title = hsPageTitle(t);
  const h1 = hsPageH1(t);
  const description = hsPageDescription(t);
  const capsule = hsPageCapsule(t);
  const faqs = hsPageFaqs(t);
  const faqId = (i: number) => `faq-${i + 1}`;
  const facts = hsFacts(t);
  const modified = hsPageModified();
  const published = publishedDate(path.slice(1), modified);
  const counterpart = hsCounterpart(t);
  const classText = hsClassDescription(t);
  const mismatches = hsTableMismatches(t);
  const row = hsPermissionRow(t);
  const guides = metricGuidesForType("wear-os", t.name);
  const related = pagesUsingHsDataType(t.name, path).filter((r) => !guides.some((g) => g.href === r.path));
  const all = hsPageTypes();
  const at = all.findIndex((x) => x.name === t.name);
  const prev = at > 0 ? all[at - 1] : null;
  const next = at >= 0 ? (all[at + 1] ?? null) : null;

  const sources = [
    {
      name: `Google — DataType.${t.name} (Health Services reference)`,
      url: t.docUrl,
      note: HS_DATA_TYPES_SOURCE_UPDATED.dataType ? `last updated ${HS_DATA_TYPES_SOURCE_UPDATED.dataType}` : null,
    },
    {
      name: "Google — Health Services permissions",
      url: HS_DATA_TYPES_SOURCES.permissions,
      note: HS_DATA_TYPES_SOURCE_UPDATED.permissions ? `last updated ${HS_DATA_TYPES_SOURCE_UPDATED.permissions}` : null,
    },
  ];

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": articleId,
        headline: h1,
        alternativeHeadline: `DataType.${t.name}`,
        description,
        datePublished: published,
        dateModified: modified,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "Wear OS Health Services reference",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        about: { "@type": "Thing", name: `androidx.health.services.client.data.DataType.${t.name}`, sameAs: t.docUrl },
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
    ["#google", "Google's description"],
    ["#type", "Declared type"],
    ["#permission", "Permission"],
    ...(counterpart ? ([["#counterpart", "Counterpart"]] as [string, string][]) : []),
    ["#cross-platform", "Health Connect and HealthKit"],
    ["#related", "On this site"],
    ["#faq", "Questions"],
  ];

  const typeRows: [string, React.ReactNode][] = [
    ["Constant", <Code key="c">{`androidx.health.services.client.data.DataType.${t.name}`}</Code>],
    ["Declared type", <Code key="k">{t.kotlinType}</Code>],
    [
      "Data-type class",
      <span key="d">
        <Code>{t.dataTypeClass}</Code>
        {classText ? <span className="mt-1 block">Google: &ldquo;{classText}&rdquo;</span> : null}
      </span>,
    ],
    ["Value type", <Code key="v">{t.valueType}</Code>],
    ["Data-point class", <Code key="p">{t.dataPointClass}</Code>],
    [
      "Added in",
      t.addedIn ? (
        <Code key="a">{t.addedIn}</Code>
      ) : (
        <span key="a">
          not printed for this constant; Google&rsquo;s reference prints &ldquo;Added in{" "}
          {HS_DATA_TYPE_CLASS_ADDED_IN ?? "?"}&rdquo; for the DataType class
          {HS_DATA_TYPE_ARTIFACT ? (
            <>
              {" "}in <Code>{HS_DATA_TYPE_ARTIFACT}</Code>
            </>
          ) : null}
        </span>
      ),
    ],
    ["Deprecated", t.deprecated ? "yes, per Google's reference" : "not marked deprecated in Google's reference"],
  ];

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-4xl" data-wear-datatype={t.name} data-type-facts={facts.join(" ")}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Watch apps", path: "/watch-apps" },
            { name: "Wear OS data types", path: HS_BASE },
            { name: t.name, path },
          ]}
        />

        <ClusterHero label="Wear OS reference" seed={stringSeed(t.name)} />

        <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {h1}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Read from Google&rsquo;s documentation on {HS_DATA_TYPES_FETCHED_ON}
          <ContentAge date={HS_DATA_TYPES_FETCHED_ON} />
          {HS_DATA_TYPES_SOURCE_UPDATED.dataType && (
            <> · Google&rsquo;s DataType reference last updated {HS_DATA_TYPES_SOURCE_UPDATED.dataType}</>
          )}
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

        <section id="google" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What Google says DataType.{t.name} is</h2>
          <blockquote data-evidence="description" className="mt-4 border-l-4 border-brand-400/60 pl-5 text-lg text-[var(--fg)]">
            {t.description ?? ""}
          </blockquote>
          {t.detail && (
            <div data-fact={facts.includes("detail") ? "detail" : undefined}>
              <Evidence fact="detail">{t.detail}</Evidence>
            </div>
          )}
          <p className="mt-3 text-sm text-[var(--muted)]">
            Quoted from Google&rsquo;s{" "}
            <a href={t.docUrl} className={LINK} rel="noopener">
              DataType reference
            </a>
            {HS_DATA_TYPES_SOURCE_UPDATED.dataType ? `, last updated ${HS_DATA_TYPES_SOURCE_UPDATED.dataType}` : ""}, read{" "}
            {HS_DATA_TYPES_FETCHED_ON}.
          </p>
        </section>

        <section id="type" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Declared type</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Read from the constant&rsquo;s declaration in Google&rsquo;s reference: the data-type class, then the value
            type and the data-point class it delivers.
          </p>
          <dl className="mt-4 grid gap-x-6 gap-y-3 rounded-2xl border border-[var(--border)] p-5 text-sm sm:grid-cols-[11rem_1fr]">
            {typeRows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-semibold text-[var(--fg)]">{k}</dt>
                <dd className="min-w-0 text-[var(--muted)]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="permission" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Permission</h2>
          {row ? (
            <div data-fact="permission">
              <p className="mt-2 text-[var(--muted)]">
                Google&rsquo;s Health Services permissions table lists DataType.{t.name} under{" "}
                <Code>{row.permission}</Code>. The row as printed, read {HS_DATA_TYPES_FETCHED_ON}:
              </p>
              <Evidence fact="permission">{row.text}</Evidence>
            </div>
          ) : (
            <p className="mt-2 text-[var(--muted)]">
              Google&rsquo;s Health Services permissions table does not name DataType.{t.name}, so this page states no
              permission for it rather than extending the table by analogy.
            </p>
          )}
          {mismatches.length > 0 && (
            <div
              data-fact="table-mismatch"
              className="mt-4 rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm text-[var(--fg)]"
            >
              <p className="font-semibold">Google&rsquo;s table links this name somewhere else.</p>
              {mismatches.map((m) => (
                <p key={m.linksTo} data-evidence="table-mismatch" className="mt-1">
                  In the table, the link on {m.shown} points to #{m.linksTo}. This page, like the generator, goes by the
                  name printed.
                </p>
              ))}
            </div>
          )}
          <p className="mt-4 text-sm text-[var(--muted)]">
            Above the table, the same page lists the permissions Health Services uses, verbatim:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
            {HS_PERMISSION_LIST.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        {counterpart && (
          <section id="counterpart" data-fact="counterpart" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              {t.dataTypeClass === "DeltaDataType" ? "Its aggregate counterpart" : "Its delta counterpart"}
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              By Google&rsquo;s naming on the same reference (a delta constant NAME beside an aggregate NAME_TOTAL or
              NAME_STATS):{" "}
              <Link href={typeHref(counterpart)} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                {counterpart.name}
              </Link>
              , declared <Code>{counterpart.kotlinType}</Code>. Google describes it as:
            </p>
            <Evidence fact="counterpart">{counterpart.description ?? ""}</Evidence>
          </section>
        )}

        <section id="cross-platform" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Health Connect and HealthKit</h2>
          {guides.length > 0 ? (
            <p className="mt-2 text-[var(--muted)]">
              No one-to-one pairing. This site&rsquo;s{" "}
              <Link href="/matrix" className={LINK}>
                cross-platform matrix
              </Link>{" "}
              pairs HealthKit types with Health Connect records only, so this page names no counterpart. What it does have
              is a metric guide:{" "}
              {guides.map((g, i) => (
                <span key={g.href}>
                  {i > 0 ? " and " : ""}
                  <Link href={g.href} className={LINK}>
                    {g.h1}
                  </Link>
                </span>
              ))}{" "}
              {`${guides.length > 1 ? "list" : "lists"} DataType.${t.name} beside the types on the other platforms this site covers whose own descriptions name the same metric, each quoted, so you can see where they differ rather than assume they match.`}
            </p>
          ) : (
            <p className="mt-2 text-[var(--muted)]">
              No verified mapping. This site&rsquo;s{" "}
              <Link href="/matrix" className={LINK}>
                cross-platform matrix
              </Link>{" "}
              pairs HealthKit types with Health Connect records only, and no data here maps a Health Services constant to
              either, so this page names no counterpart rather than matching by name. The record types themselves are in{" "}
              <Link href="/health-connect" className={LINK}>
                the Health Connect record reference
              </Link>{" "}
              and{" "}
              <Link href="/healthkit-identifiers" className={LINK}>
                the HealthKit identifier reference
              </Link>
              .
            </p>
          )}
        </section>

        <section id="related" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">DataType.{t.name} on this site</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href={`${HS_BASE}#${hsRowAnchor(t)}`} className={LINK}>
                Every Wear OS Health Services data type
              </Link>{" "}
              <span className="text-[var(--muted)]">— its row in the full table</span>
            </li>
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className={LINK} data-metric-guide={g.slug}>
                  {g.h1}
                </Link>{" "}
                <span className="text-[var(--muted)]">{`— ${g.metric} on every platform this site covers`}</span>
              </li>
            ))}
            {related.map((r) => (
              <li key={r.path}>
                <Link href={r.path} className={LINK}>
                  {r.title}
                </Link>{" "}
                <span className="text-[var(--muted)]">— {r.section}, which uses it</span>
              </li>
            ))}
            {!related.some((r) => r.path === "/devices/wear-os-health-services") && (
              <li>
                <Link href="/devices/wear-os-health-services" className={LINK}>
                  Wear OS Health Services
                </Link>{" "}
                <span className="text-[var(--muted)]">— which client delivers which data</span>
              </li>
            )}
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
          pitch="These pages are generated from Google's Health Services reference and re-published when it changes. Subscribe to hear when a Wear OS data type gains a permission rule or a new constant appears."
          source="spoke-inline"
          id={`cta-wear-${hsSlug(t.name)}`}
        />

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Sources checked</h2>
          <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="text-brand-600 hover:text-brand-500" rel="noopener">
                  {s.name}
                </a>
                {s.note ? ` — ${s.note}` : ""} · read {HS_DATA_TYPES_FETCHED_ON}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Google&rsquo;s descriptions are quoted for identification; the page layout and the capsule are{" "}
            {site.name}&rsquo;s. Generated by{" "}
            <code className="font-mono text-xs">scripts/fetch-health-services-data-types.mjs</code>, not typed by hand —
            the same data as{" "}
            <Link href={HS_BASE} className={LINK}>
              the full data-type table
            </Link>
            .
          </p>
        </section>

        {(prev || next) && (
          <nav aria-label="More Wear OS data types" className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={hsDataTypePath(prev)}
                className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Previous data type</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {prev.name}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={hsDataTypePath(next)}
                className="group rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Next data type →</span>
                <span className="mt-1 block break-all font-mono text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">
                  {next.name}
                </span>
              </Link>
            )}
          </nav>
        )}

        <p className="mt-8 text-sm">
          <Link href={HS_BASE} className="text-brand-600 hover:text-brand-500">
            ← All Wear OS Health Services data types
          </Link>
        </p>
      </div>
    </Container>
  );
}
