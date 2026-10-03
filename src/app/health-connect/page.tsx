import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import PageSummary from "@/components/PageSummary";
import ContentAge from "@/components/ContentAge";
import StatCard from "@/components/StatCard";
import {
  HC_CATEGORIES,
  HC_FETCHED_ON,
  HC_DATA_TYPES_URL,
  HC_DATA_TYPES_UPDATED,
  HC_SDK_NOTE,
  HC_FW_PERMISSIONS_URL,
} from "@/data/healthConnectRecords";
import {
  HC_BASE,
  HC_PERMISSIONS_PATH,
  HC_AGGREGATES_PATH,
  orderedRecords,
  recordsInCategory,
  recordPath,
  categorySlug,
  shortPermission,
  hcTotals,
  hkCounterpart,
} from "@/data/hcPages";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

/**
 * The hub for the Health Connect record reference: every record class on
 * Google's data-types page, grouped by Google's own seven categories, each
 * linked to its page. Counts are computed from the generated dataset so the
 * prose cannot go stale against it.
 *
 * Integration how-to is owned by /integrate/google-health-connect; this
 * section is the reference and links there rather than competing with it.
 *
 * No markdown mirror exists for this section, so the CollectionPage carries
 * no `encoding` and there is no text/markdown alternate.
 */

const T = hcTotals();
/** First sentence of Google's note above its table (the rest points at a
 *  legacy page by link text, which reads oddly without the link). */
const SDK_NOTE = HC_SDK_NOTE ? (HC_SDK_NOTE.match(/^[^.]*\d+\.\d+\.\d+[^.]*\./)?.[0] ?? HC_SDK_NOTE.split(". ")[0] + ".") : null;
const TITLE = `Health Connect Record Types: All ${T.records} Records`;
const DESCRIPTION = `Every Health Connect record class (${T.records}) with fields, ranges, read/write permission strings and aggregate metrics, from Google's Jetpack reference.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: HC_BASE },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: HC_BASE,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function HealthConnectHub() {
  const url = absoluteUrl(HC_BASE);
  const records = orderedRecords();
  const paired = records.filter((r) => hkCounterpart(r)).length;
  const alpha = records.map((r) => r.className).sort();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Health Connect record reference",
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    lastReviewed: HC_FETCHED_ON,
    reviewedBy: orgRef(),
    citation: [
      { "@type": "TechArticle", url: HC_DATA_TYPES_URL, name: "Google — Health Connect data types" },
      { "@type": "TechArticle", url: HC_FW_PERMISSIONS_URL, name: "Google — HealthPermissions" },
    ],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: records.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: records.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: r.className,
        url: absoluteUrl(recordPath(r)),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Health Connect", path: HC_BASE }]} />

        <ClusterHero label="Health Connect reference" seed={stringSeed("health-connect")} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health Connect record types, every one
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {T.records} records in Google&rsquo;s {T.categories} categories · read from Google&rsquo;s documentation on{" "}
          {HC_FETCHED_ON}
          <ContentAge date={HC_FETCHED_ON} />
          {HC_DATA_TYPES_UPDATED && <> · Google&rsquo;s data-types page last updated {HC_DATA_TYPES_UPDATED}</>}
        </p>

        <PageSummary path={HC_BASE} name="Health Connect record reference" updated={HC_FETCHED_ON}>
          Android Health Connect stores health and fitness data as typed record classes —{" "}
          {alpha[0]} through {alpha[alpha.length - 1]}, alphabetically. Google documents {T.records} of them on
          its data-types page, in {T.categories} categories. Each page here takes one class and puts in one place what
          Google spreads across three pages: its fields and allowed ranges, the exact read and write permission strings,
          and the aggregate metrics it supports, with a Kotlin read example.
        </PageSummary>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={String(T.records)}
            label="record classes on Google's data-types page"
            claim={`Google's Health Connect data-types page lists ${T.records} Jetpack record classes, as read on ${HC_FETCHED_ON}.`}
            anchor={url}
          />
          <StatCard
            value={String(T.aggregates)}
            label={`aggregate metrics across ${T.recordsWithAggregates} records`}
            claim={`Google's Jetpack reference defines ${T.aggregates} AggregateMetric constants across ${T.recordsWithAggregates} Health Connect record classes, as read on ${HC_FETCHED_ON}.`}
            anchor={absoluteUrl(HC_AGGREGATES_PATH)}
          />
          <StatCard
            value={String(T.recordPermissionStrings)}
            label="read/write strings declared for these records"
            claim={`Google's Health Connect data-types table declares ${T.recordPermissionStrings} distinct read and write permission strings for its ${T.records} record classes, as read on ${HC_FETCHED_ON}.`}
            anchor={absoluteUrl(HC_PERMISSIONS_PATH)}
          />
          <StatCard
            value={String(T.frameworkPermissions)}
            label="android.permission.health strings in the framework reference"
            claim={`The android.health.connect.HealthPermissions reference defines ${T.frameworkPermissions} permission constants, as read on ${HC_FETCHED_ON}.`}
            anchor={absoluteUrl(HC_PERMISSIONS_PATH)}
          />
        </div>

        <nav aria-label="Categories" className="mt-10 flex flex-wrap gap-2 text-sm">
          {HC_CATEGORIES.map((c) => (
            <a
              key={c.name}
              href={`#${categorySlug(c.name)}`}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {c.name} <span className="font-semibold tabular-nums text-[var(--fg)]">{recordsInCategory(c.name).length}</span>
            </a>
          ))}
        </nav>

        {HC_CATEGORIES.map((c) => {
          const rs = recordsInCategory(c.name);
          if (!rs.length) return null;
          return (
            <section key={c.name} id={categorySlug(c.name)} className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
                {c.name}{" "}
                <span className="ml-1 text-base font-normal tabular-nums text-[var(--muted)]">{rs.length}</span>
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Google: &ldquo;{c.description}&rdquo;</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {rs.map((r) => (
                  <li key={r.className}>
                    <Link
                      href={recordPath(r)}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="break-all font-mono text-[15px] font-semibold text-[var(--fg)]">{r.className}</span>
                      <span className="mt-1 text-sm text-[var(--muted)]">
                        {r.dataTypeLabel} · {r.recordShape ?? "—"}
                        {r.unitClass ? ` · ${r.unitClass}` : ""}
                      </span>
                      <span className="mt-2 break-all font-mono text-[11px] text-[var(--muted)]">
                        {r.readPermissions.map(shortPermission).join(", ")}
                      </span>
                      <span className="mt-2 text-xs tabular-nums text-[var(--muted)]">
                        {r.properties.length} fields
                        {r.aggregateMetrics.length ? ` · ${r.aggregateMetrics.length} aggregate metric${r.aggregateMetrics.length === 1 ? "" : "s"}` : ""}
                        {r.constants.length ? ` · ${r.constants.length} constants` : ""}
                        {r.featureFlag ? " · feature-gated" : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Across all records</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              {
                href: HC_PERMISSIONS_PATH,
                label: "Every Health Connect permission string",
                blurb: `All ${T.frameworkPermissions} android.permission.health strings Google's framework reference defines — record, background, history, route, medical and symptom — each with what it unlocks.`,
              },
              {
                href: HC_AGGREGATES_PATH,
                label: "Every aggregate metric",
                blurb: `All ${T.aggregates} AggregateMetric constants (StepsRecord.COUNT_TOTAL, HeartRateRecord.BPM_AVG…) with Google's description and value type.`,
              },
              {
                href: "/error-codes/health-connect",
                label: "Health Connect error codes",
                blurb: "Every HealthConnectException ERROR_* constant from Android's platform reference, and the exception types the Jetpack client documents.",
              },
              {
                href: "/health-connect-releases",
                label: "Health Connect SDK releases",
                blurb: "Every androidx.health.connect:connect-client release from Google's Jetpack release notes: version, date, stage and what changed.",
              },
              {
                href: "/integrate/google-health-connect",
                label: "Integrate Health Connect",
                blurb: "The how-to: client setup, the permission flow and what Google requires before you publish.",
              },
              {
                href: "/healthkit",
                label: "The iOS twin: HealthKit, mapped",
                blurb: "Every HealthKit identifier, grouped, with units and aggregation style from Apple's documentation.",
              },
              {
                href: "/matrix",
                label: "HealthKit ↔ Health Connect matrix",
                blurb: `The pairings verified against both vendors' documentation — ${paired} of the ${T.records} records here sit in a verified row.`,
              },
            ].map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="font-semibold text-[var(--fg)]">{p.label}</span>
                  <span className="mt-2 text-sm text-[var(--muted)]">{p.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ClusterCta
          pitch="These pages are generated from Google's own reference pages. Subscribe and you'll hear when a record type, permission or metric is added."
          source="pillar-inline"
          id="cta-health-connect-hub"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Generated by {site.name} from{" "}
          <a href={HC_DATA_TYPES_URL} className="text-brand-600 hover:text-brand-500" rel="noopener">
            Google&rsquo;s Health Connect data-types page
          </a>
          , each record&rsquo;s Jetpack reference page and the{" "}
          <a href={HC_FW_PERMISSIONS_URL} className="text-brand-600 hover:text-brand-500" rel="noopener">
            HealthPermissions reference
          </a>
          , all read {HC_FETCHED_ON}. {SDK_NOTE ? <>Google notes above its table: &ldquo;{SDK_NOTE}&rdquo;</> : null}{" "}
          Google&rsquo;s descriptions are quoted for identification; the grouping is Google&rsquo;s own.
        </p>
      </div>
    </Container>
  );
}
