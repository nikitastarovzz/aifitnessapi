import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import HubFreshness from "@/components/HubFreshness";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import {
  getHealthkitQuery,
  releasedHealthkitQueries,
  HKQ_PATH,
  HKQ_CONFIG,
} from "@/data/healthkitQueries";

const UPDATED = "2026-10-03";

/** Every FAQ answer in this cluster, counted from the same data the
 *  /questions index is built from so the two can never disagree. */
const QUESTION_COUNT = releasedHealthkitQueries().reduce((n, e) => n + e.faqs.length, 0);

const TITLE = "HealthKit Query Classes Explained";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "HKSampleQuery, HKStatisticsCollectionQuery, HKAnchoredObjectQuery, HKObserverQuery and the async descriptors: one page per HealthKit query class.",
  alternates: { canonical: HKQ_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "How each HealthKit query class works and where it bites, from Apple's own documentation: predicates, statistics, anchors, observers, routes and rings.",
    url: HKQ_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Reading what is stored right now",
    blurb:
      "A one-time snapshot of matching samples, and the predicate that decides what matches. Most HealthKit code starts here.",
    slugs: ["hksamplequery", "healthkit-query-predicates"],
  },
  {
    title: "Numbers instead of samples",
    blurb:
      "Let the store compute the sum, average or extreme, once for a window or once per day, instead of adding up samples yourself.",
    slugs: ["hkstatisticsquery", "hkstatisticscollectionquery"],
  },
  {
    title: "Keeping up with changes",
    blurb:
      "What changed since last time, including deletions, and how HealthKit tells you something changed while your app is in the background.",
    slugs: ["hkanchoredobjectquery", "hkobserverquery-background-delivery"],
  },
  {
    title: "Swift concurrency",
    blurb: "The async/await descriptors that wrap the classes above and type their results.",
    slugs: ["healthkit-async-query-descriptors"],
  },
  {
    title: "Special-purpose reads",
    blurb: "The GPS points behind a workout, and the daily activity rings.",
    slugs: ["hkworkoutroutequery", "hkactivitysummaryquery"],
  },
];

const FAQS = [
  {
    q: "Which HealthKit query class should I use to read data?",
    a: "It depends on the shape of the answer you want. For the samples themselves, once, use HKSampleQuery. For one total or average over a window, use HKStatisticsQuery, and for one value per day or hour, HKStatisticsCollectionQuery. To read only what changed since your last read, including deletions, use HKAnchoredObjectQuery, and to be told that something changed, HKObserverQuery. Workout routes need HKWorkoutRouteQuery and activity rings need HKActivitySummaryQuery. On iOS 15.4 and later, every one of these except HKObserverQuery also has an async/await query descriptor.",
  },
  {
    q: "What is the difference between HKStatisticsQuery and HKStatisticsCollectionQuery?",
    a: "The number of results. Apple's article on statistics collection queries puts it in one line: HKStatisticsQuery calculates a single value over all matching samples, while HKStatisticsCollectionQuery partitions the samples into time intervals and calculates a value for each interval. Both take the same HKStatisticsOptions and both work on quantity samples only. The collection query also needs an anchor date and interval components, and can keep running to deliver updates.",
  },
  {
    q: "Which HealthKit queries keep running after they return their first results?",
    a: "HKObserverQuery always does. HKAnchoredObjectQuery, HKStatisticsCollectionQuery and HKActivitySummaryQuery do when you assign their update handler before executing them; without one, Apple documents that they stop once the initial results are delivered. A long-running query continues until you pass it to the health store's stop(_:) method, so a screen that starts one should stop it when it goes away. HKSampleQuery and HKStatisticsQuery always finish after one result.",
  },
];

export default function HealthkitQueriesPillar() {
  const released = releasedHealthkitQueries();
  // A hub with nothing behind it is a thin page and a promise we have not
  // kept. Until the cluster has released pages, this route does not exist.
  if (released.length === 0) notFound();
  const url = absoluteUrl(HKQ_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
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
    mainEntity: FAQS.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath={HKQ_PATH} description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "HealthKit Queries", path: HKQ_PATH }]} />

        <ClusterHero label="HealthKit Queries" seed={heroSeed(HKQ_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          HealthKit Queries
        </h1>

        <HubFreshness entries={released} basePath={HKQ_PATH} />

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          HealthKit has a query class for each shape of answer: HKSampleQuery for the samples
          themselves, HKStatisticsQuery and HKStatisticsCollectionQuery for totals and averages,
          HKAnchoredObjectQuery for what changed since last time, HKObserverQuery for being told
          that something changed, plus dedicated classes for workout routes and activity rings.
          Each page here covers one class: what Apple documents it does, the initializer and
          handlers, a short Swift sketch built from documented calls, and the traps that return a
          wrong answer without an error. Every claim comes from Apple&rsquo;s own HealthKit
          documentation, and where Apple is silent the page says so.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            These pages explain how each query behaves. Setting HealthKit up (the capability,
            Info.plist keys, entitlements and authorization) is covered in the{" "}
            <Link href="/integrate/healthkit">HealthKit integration guide</Link>. Specific failures,
            such as{" "}
            <Link href="/fix/healthkit-background-delivery-not-working">
              background delivery not firing
            </Link>{" "}
            or <Link href="/fix/healthkit-no-data">a read that returns nothing</Link>, have their own
            troubleshooting pages. The data types themselves are listed in the{" "}
            <Link href="/healthkit-identifiers">HealthKit identifier reference</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getHealthkitQuery(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${HKQ_PATH}/${e!.slug}`}
                      className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="break-words font-semibold text-[var(--fg)]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e!.metaDescription}</span>
                      <EntryBadge updated={e!.updated} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/questions/healthkit-queries" className="text-brand-600 hover:text-brand-500">
              All {QUESTION_COUNT} questions in {HKQ_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="HealthKit's query APIs change between OS releases: multi-type initializers in iOS 15.0, async descriptors in iOS 15.4, options renamed and goal properties deprecated. We track the changes that alter code you have already shipped."
          source="pillar-inline"
          id="cta-healthkit-queries"
        />
      </div>
    </Container>
  );
}
