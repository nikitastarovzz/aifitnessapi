import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getArchitecture, releasedArchitecture, ARCHITECTURE_PATH } from "@/data/architecture";

const UPDATED = "2026-07-27";

export const metadata: Metadata = {
  title: "Health Data Architecture for Fitness Apps",
  description:
    "Pipelines, storage and data quality for multi-source health data: dedupe, normalization, timezones, sync, backfill, and monitoring.",
  alternates: { canonical: ARCHITECTURE_PATH },
  openGraph: {
    type: "website",
    title: "Health Data Architecture for Fitness Apps",
    description:
      "The stage after the integration works — deduplicating overlapping sources, normalizing units and schemas, getting day boundaries right, and keeping a health data pipeline trustworthy at scale.",
    url: ARCHITECTURE_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Getting data in",
    blurb: "Ingestion and sync — the read model on both sides of the wire.",
    slugs: [
      "incremental-sync",
      "historical-backfill",
      "background-sync",
      "webhook-ingestion",
      "identity-and-account-linking",
    ],
  },
  {
    title: "Making it trustworthy",
    blurb: "Reconciliation and data quality — where most of the real work is.",
    slugs: [
      "deduplicate-health-data",
      "normalize-wearable-data",
      "timezones-and-day-boundaries",
      "missing-data-and-gaps",
    ],
  },
  {
    title: "Storing and serving",
    blurb: "Schema decisions that are expensive to reverse later.",
    slugs: ["time-series-storage", "caching-fitness-api-responses", "offline-first-conflict-resolution", "metric-versioning-and-recompute"],
  },
  {
    title: "Running it in production",
    blurb: "Knowing it broke before your users tell you.",
    slugs: ["data-quality-monitoring", "data-deletion-and-export"],
  },
];

const FAQS = [
  {
    q: "Why does the same workout show up two or three times?",
    a: "Because several apps and devices write to the same health store and nothing reconciles them for you. On iOS, HealthKit performs no automatic deduplication of the raw samples you read — merging happens only inside statistics query results, only for quantity types, so overlapping workouts get no help at all. On Android, Health Connect deduplicates only Activity and Sleep, only through its aggregate API, and the source priority order is controlled by the user in Health Connect settings rather than by your app. Resolution is a layer you own, and it has to be designed rather than discovered.",
  },
  {
    q: "Should I build this pipeline or buy an aggregator?",
    a: "For most teams, buy. Deduplication, unit normalization, token refresh, per-provider quirks and backfill are exactly what health data aggregators sell, and rebuilding them in-house is months of work that is invisible to users when it goes right and embarrassing when it goes wrong. Build it yourself when you need data an aggregator does not expose, when per-user aggregator pricing does not survive your unit economics at scale, when data residency or a compliance posture forbids a third party holding the data, or when the integration surface is small enough that the abstraction costs more than it saves.",
  },
  {
    q: "What is the single most common architectural mistake here?",
    a: "Treating health samples as an append-only log. They are not. A watch syncs hours late, a user edits yesterday's workout, a provider revises last night's sleep after further processing, and a device backfills a week after a trip. Any design that computes a daily total once and considers it final will silently serve wrong history. The durable shape is to treat incoming changes as a signal about which days are now dirty, then recompute those days from the current state of the store, rather than incrementally adding what just arrived to a running total.",
  },
];

export default function ArchitecturePillar() {
  const url = absoluteUrl(ARCHITECTURE_PATH);
  const released = releasedArchitecture();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Health Data Architecture for Fitness Apps",
    description: metadata.description,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: released.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.h1,
      url: absoluteUrl(`${ARCHITECTURE_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath="/architecture" description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Architecture", path: ARCHITECTURE_PATH }]} />

        <ClusterHero label="Architecture" seed={heroSeed(ARCHITECTURE_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health Data Architecture for Fitness Apps
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Connecting a wearable API is the easy part. The hard part starts once data is flowing: the
          same walk arrives three times from three sources, one provider reports sleep in local time
          and steps in UTC, yesterday&rsquo;s total changes after a watch syncs late, and
          &ldquo;today&rdquo; means something different for a user who flew overnight. This hub covers
          the layer that makes multi-source health data trustworthy — ingestion, reconciliation,
          storage, and the monitoring that tells you it broke before your users do.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Two things worth saying before you read further. First, a large share of readers should{" "}
            <strong>buy rather than build</strong> — most of what follows is precisely what{" "}
            <Link href="/fitness-apis/health-data-aggregator-apis">health data aggregators</Link> sell,
            and rebuilding it is months of work that users never see when it goes right. These pages
            say so where it applies, and say what would make us build instead. Second, this cluster is
            about <em>design</em>. When something is already broken and you need it fixed today, start
            at <Link href="/fix">troubleshooting</Link> instead; each page here links down to the
            relevant symptom rather than restating it.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getArchitecture(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${ARCHITECTURE_PATH}/${e!.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e!.metaDescription}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="Platform sync semantics shift quietly — a permission window changes, a dedupe rule moves, a background delivery budget tightens. We track the ones that corrupt data rather than throw errors. Get the heads-up."
          source="pillar-inline"
          id="cta-architecture-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
