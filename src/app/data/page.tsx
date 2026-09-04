import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getDataPage, releasedData, DATA_PATH, DATA_CONFIG } from "@/data/healthData";

const UPDATED = "2026-07-24";

/** Every FAQ answer in this cluster, counted from the same data the
 *  /questions index is built from so the two can never disagree. */
const QUESTION_COUNT = releasedData().reduce((n, e) => n + e.faqs.length, 0);

export const metadata: Metadata = {
  title: "Health Data by Metric: Which API for Each",
  description:
    "Which API gives you each health metric — heart rate, steps, sleep, calories, HRV, VO2 max, SpO2, GPS — how to access it, and measured vs estimated.",
  alternates: { canonical: DATA_PATH },
  openGraph: {
    type: "website",
    title: "Health Data by Metric: Which API for Each",
    description:
      "Get a specific health metric into your app — the sources that expose it, how to access it, whether it's measured or estimated, and the best pick.",
    url: DATA_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Cardio & recovery",
    blurb: "The signals from the heart — measured and estimated.",
    slugs: ["heart-rate-api", "hrv-api", "vo2-max-api", "blood-oxygen-api"],
  },
  {
    title: "Activity & movement",
    blurb: "What the body does — steps, workouts, routes, energy.",
    slugs: ["step-counting-api", "workout-detection-api", "gps-activity-api", "calorie-tracking-api"],
  },
  {
    title: "Sleep & body",
    blurb: "Overnight staging and body measurements.",
    slugs: ["sleep-tracking-api", "body-composition-api"],
  },
  {
    title: "Vitals & reproductive health",
    blurb: "The sensitive end of the store — sourced, typed, and privacy-first.",
    slugs: ["blood-pressure-api", "blood-glucose-api", "respiratory-rate-api", "menstrual-cycle-api"],
  },
];

const FAQS = [
  {
    q: "Where does health data actually come from?",
    a: "For most metrics you have three routes: the on-device platform stores (Apple HealthKit on iOS, Android Health Connect), a specific wearable's cloud API (Fitbit, Garmin, Oura, WHOOP, Strava), or a health-data aggregator that normalizes many of them behind one integration. Which route is best depends on the metric — some are nearly universal (steps, heart rate), others need specific hardware (body composition needs a smart scale).",
  },
  {
    q: "Is the data measured or estimated?",
    a: "It varies by metric, and it matters. Heart rate and HRV are measured; steps are counted (algorithmically); calorie burn, VO2 max, and sleep stages are modeled estimates, not clinical measurements. Each page here is explicit about which, because presenting an estimate as a measurement is both misleading and, for health features, a compliance risk. Treat consumer-device data as a wellness signal, not a diagnosis.",
  },
  {
    q: "Do I need a wearable for every metric?",
    a: "No. Steps, basic activity, and GPS can come from the phone itself. But recovery and physiology metrics (HRV, VO2 max, blood oxygen, sleep stages) generally require a wearable, and body composition needs a smart scale or manual entry. Each page notes what hardware, if any, the user must have.",
  },
];

export default function DataPillar() {
  const url = absoluteUrl(DATA_PATH);
  const released = releasedData();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Health Data by Metric: Which API for Each",
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
      url: absoluteUrl(`${DATA_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath="/data" description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Health Data", path: DATA_PATH }]} />

        <ClusterHero label="Health Data" seed={heroSeed(DATA_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health Data by Metric: Which API for Each
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Need a specific health metric in your app? Each page below takes one — heart rate, steps, sleep,
          calories, HRV, VO2 max, and more — and answers the practical questions: which sources expose it
          via an API, how to access it, whether it&rsquo;s measured or a modeled estimate, and the best
          pick for your build. Organized by the data you need, not by provider.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Want the provider view instead? Compare by category in{" "}
            <Link href="/fitness-apis">the fitness API landscape</Link>, or read up on the concepts
            behind the numbers in <Link href="/learn">the explainers</Link>. When you know the source,
            the <Link href="/integrate">integration guides</Link> take it from there.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getDataPage(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${DATA_PATH}/${e!.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)]">{e!.h1}</span>
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
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/questions/data" className="text-brand-600 hover:text-brand-500">
              All {QUESTION_COUNT} questions in {DATA_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterCta
          pitch="We track which sources expose which health metrics — and when a device or API changes what it reports. Get the data-availability updates that affect what your app can show."
          source="pillar-inline"
          id="cta-data-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
