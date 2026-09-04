import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import PageSummary from "@/components/PageSummary";
import {
  HK_BASE,
  hkGroupLabel,
  buildHkGroups,
  releasedHkGroups,
  HK_FETCHED_ON,
} from "@/data/hkGroupPages";
import { HK_IDENTIFIERS } from "@/data/healthkitIdentifiers";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

/**
 * The hub for the HealthKit group pages.
 *
 * /healthkit-identifiers stays the flagship — all 240 identifiers on one URL,
 * ranking for the set. This hub is the map of the middle layer: one page per
 * group, each an anchor surface for the exact identifier strings developers
 * paste into a search box.
 *
 * No markdown mirror exists for this section, so the CollectionPage node
 * carries no `encoding`, and there is no `text/markdown` alternate link.
 */

const GROUPS = buildHkGroups();
const GROUP_COUNT = GROUPS.size;

const DESCRIPTION = `All ${HK_IDENTIFIERS.length} HealthKit identifiers, grouped into ${GROUP_COUNT} pages — units, aggregation style and iOS availability, read from Apple's docs on ${HK_FETCHED_ON}.`;

export const metadata: Metadata = {
  title: "HealthKit, Mapped",
  description: DESCRIPTION,
  alternates: { canonical: HK_BASE },
  openGraph: {
    type: "website",
    title: "HealthKit, Mapped",
    description: DESCRIPTION,
    url: HK_BASE,
    images: ["/opengraph-image"],
  },
};

/** Reference pages that exist today. Anything not on this list is named in
 *  prose below rather than linked — a link to a page we have not published
 *  yet is a 404, and the QA gate fails the build for it. */
const REFERENCE_PAGES: { href: string; label: string; blurb: string }[] = [
  {
    href: "/healthkit-identifiers",
    label: "Every HealthKit type identifier",
    blurb: `All ${HK_IDENTIFIERS.length} identifiers in one filterable table — the whole set on one URL, across every group below.`,
  },
  {
    href: "/healthkit-errors",
    label: "Every HealthKit error code",
    blurb: "The full HKError.Code set, what each actually means, and why a denied read never raises one at all.",
  },
  {
    href: "/healthkit-versions",
    label: "HealthKit by iOS version",
    blurb: "Which identifiers each iOS release introduced, from the 127 that shipped in iOS 8.0 to the iOS 27 beta pair.",
  },
  {
    href: "/healthkit-status",
    label: "Deprecated, beta and undocumented",
    blurb: "What is actually deprecated (nothing, at the platform level), what is in beta, and what ships with no documentation.",
  },
  {
    href: "/healthkit-category-values",
    label: "Category value enums",
    blurb: "The enum that decodes each of the 30 category types — 28 resolved, 2 honest nulls.",
  },
  {
    href: "/healthkit-units",
    label: "Unit families",
    blurb: "Every quantity type by unit family, and the four Apple leaves unstated.",
  },
  {
    href: "/health-connect-records",
    label: "Health Connect records, verified",
    blurb: "The 10 metrics checked against both platforms' documentation — and only those.",
  },
];

export default function HealthKitHub() {
  const url = absoluteUrl(HK_BASE);
  const released = releasedHkGroups();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "HealthKit, mapped",
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    lastReviewed: HK_FETCHED_ON,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: released.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: released.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: e.title,
        description: e.metaDescription,
        url: absoluteUrl(`${HK_BASE}/${e.slug}`),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "HealthKit", path: HK_BASE }]} />

        <ClusterHero label="HealthKit reference" seed={stringSeed("healthkit")} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          HealthKit, mapped
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {HK_IDENTIFIERS.length} identifiers in {GROUP_COUNT} groups · read from Apple&rsquo;s
          documentation on {HK_FETCHED_ON}
        </p>

        <PageSummary path={HK_BASE} name="HealthKit, mapped" updated={HK_FETCHED_ON}>
          Apple documents each HealthKit identifier on its own page and never as a set, so the
          questions you hit while building — can I sum this one, what unit does it come back in, does
          it exist on Android — are the ones the reference cannot answer. These {GROUP_COUNT} pages
          take the {HK_IDENTIFIERS.length} identifiers a group at a time and answer all three, with
          every field joined from Apple&rsquo;s own documentation rather than restated from memory.
        </PageSummary>

        {released.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              The {released.length === 1 ? "group" : `${released.length} groups`}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {released.map((e) => {
                const count = GROUPS.get(e.slug)?.length ?? 0;
                return (
                  <li key={e.slug}>
                    <Link
                      href={`${HK_BASE}/${e.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                        {hkGroupLabel(e.slug)}
                      </span>
                      <span className="mt-1 font-semibold text-[var(--fg)]">{e.title}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e.metaDescription}</span>
                      <span className="mt-3 text-xs tabular-nums text-[var(--muted)]">
                        {count} identifier{count === 1 ? "" : "s"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The groups</h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              The per-group pages are being written and are not published yet. Until they are, the
              whole set is on one URL —{" "}
              <Link
                href="/healthkit-identifiers"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                every HealthKit type identifier
              </Link>{" "}
              — filterable by group, family and unit.
            </p>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The rest of the reference
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {REFERENCE_PAGES.map((p) => (
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
          pitch="We re-read Apple's documentation and re-publish these tables when they change. Subscribe and you'll hear when a type is added, deprecated, or finally documented."
          source="pillar-inline"
          id="cta-healthkit-hub"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Compiled by {site.name} from Apple&rsquo;s published documentation, read {HK_FETCHED_ON}.
          Apple&rsquo;s abstracts are quoted for identification; the grouping and the analysis are
          ours. The same data is downloadable as JSON and CSV from{" "}
          <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
            the datasets
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
