import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import { site, absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getEntry, releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";

const UPDATED = "2026-07-08";

export const metadata: Metadata = {
  title: "Best Fitness & Workout APIs (2026)",
  description:
    "A builder's guide to fitness and workout APIs — exercise data, wearables, aggregators, nutrition, and AI motion tracking, and how to choose between them.",
  alternates: { canonical: PILLAR_PATH },
  openGraph: {
    type: "website",
    title: "Best Fitness & Workout APIs (2026): The Builder's Guide",
    description:
      "Exercise data, wearables, aggregators, nutrition, and AI motion tracking — the fitness API landscape, mapped for builders.",
    url: PILLAR_PATH,
    images: ["/opengraph-image"],
  },
};

// The hub topology: each group links down to its spokes (§4). Short labels +
// one-line blurbs are curated here; if a slug isn't released yet it's skipped.
const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Browse by category",
    blurb: "Pick the kind of data or capability you need.",
    slugs: [
      "exercise-database-apis",
      "wearable-data-apis",
      "health-data-aggregator-apis",
      "ai-workout-tracking-apis",
      "nutrition-apis",
    ],
  },
  {
    title: "Compare head-to-head",
    blurb: "Two options, side by side, when you've narrowed it down.",
    slugs: [
      "apple-healthkit-vs-google-health-connect",
      "terra-vs-vital",
      "fitbit-api-vs-garmin-api",
    ],
  },
  {
    title: "Start free, or build your own",
    blurb: "Ship on a budget, or decide whether to build in-house at all.",
    slugs: ["free-fitness-apis", "fitness-api-vs-build-your-own"],
  },
];

const FAQS = [
  {
    q: "What is a fitness API?",
    a: "A fitness API is a service that gives your app fitness or health data and capabilities without you building them from scratch — for example an exercise/movement library, a way to read a user's wearable metrics (steps, heart rate, sleep), nutrition data, or AI-powered workout and form tracking.",
  },
  {
    q: "Which fitness API is best?",
    a: "There is no single best fitness API — it depends on what you are building. Need exercise content, use an exercise-database API; need wearable metrics from many devices, use a health-data aggregator; need real-time coaching, use an AI motion-tracking API. Match the category to your job first, then compare options within it.",
  },
  {
    q: "Are there free fitness APIs?",
    a: "Yes. Open datasets and free/open-source projects exist for exercise content (for example wger and public exercise datasets) and nutrition (USDA FoodData Central and Open Food Facts). Most commercial platform and wearable APIs also have free developer tiers, though production access often requires approval. Verify current limits in each provider's documentation.",
  },
];

export default function FitnessApisPillar() {
  const url = absoluteUrl(PILLAR_PATH);
  const released = releasedEntries();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Fitness & Workout APIs (2026): The Builder's Guide",
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
      url: absoluteUrl(`${PILLAR_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Fitness APIs", path: PILLAR_PATH }]} />

        <ClusterHero label="Fitness APIs" seed={heroSeed(PILLAR_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Best Fitness &amp; Workout APIs for Builders (2026)
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          There is no single &ldquo;best&rdquo; fitness API — the right one depends on what you&rsquo;re
          building. Fitness APIs fall into five jobs: exercise/workout content, wearable &amp; device
          data, health-data aggregators, nutrition data, and AI motion tracking. Decide which job you
          need first, then compare the options within that category. This guide maps all five and
          links a focused comparison for each.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>Start with the job, not the brand</h2>
          <p>
            The most common mistake when picking a fitness API is comparing products that don&rsquo;t
            actually do the same thing. An exercise-content API and a wearable-data API both get
            called &ldquo;fitness APIs,&rdquo; but they solve different problems. Name your job first:
          </p>
          <ul>
            <li>
              <strong>Exercise &amp; workout content</strong> — you need a library of movements with
              metadata (muscles, equipment, difficulty) and media. See{" "}
              <Link href={`${PILLAR_PATH}/exercise-database-apis`}>exercise database APIs</Link>.
            </li>
            <li>
              <strong>Wearable &amp; device data</strong> — you need a user&rsquo;s steps, heart rate,
              sleep, or workouts from their watch or ring. See{" "}
              <Link href={`${PILLAR_PATH}/wearable-data-apis`}>wearable data APIs</Link>, or compare{" "}
              <Link href={`${PILLAR_PATH}/fitbit-api-vs-garmin-api`}>Fitbit vs Garmin</Link>.
            </li>
            <li>
              <strong>Health-data aggregators</strong> — you want one integration that covers many
              wearables at once. See{" "}
              <Link href={`${PILLAR_PATH}/health-data-aggregator-apis`}>health-data aggregators</Link>,
              or <Link href={`${PILLAR_PATH}/terra-vs-vital`}>Terra vs Vital</Link>.
            </li>
            <li>
              <strong>Nutrition &amp; food data</strong> — you need food lookup, macros, or barcodes.
              See <Link href={`${PILLAR_PATH}/nutrition-apis`}>nutrition APIs</Link>.
            </li>
            <li>
              <strong>AI motion tracking</strong> — you want real-time rep counting or form feedback
              from the camera. See{" "}
              <Link href={`${PILLAR_PATH}/ai-workout-tracking-apis`}>AI workout tracking APIs</Link>.
            </li>
          </ul>
          <p>
            Cross-platform mobile apps also have to reason about the OS health stores —{" "}
            <Link href={`${PILLAR_PATH}/apple-healthkit-vs-google-health-connect`}>
              Apple HealthKit vs Google Health Connect
            </Link>{" "}
            — since those are how data gets on and off the device in the first place.
          </p>

          <h2>Then evaluate within the category</h2>
          <p>
            Once you know the job, the questions that decide it are consistent: does the data model fit
            your product, how much intelligence do you actually need, is &ldquo;real-time&rdquo; truly
            real-time, what does it cost at 10&times; your scale, and how painful is the integration
            path? We walk through that decision in{" "}
            <Link href="/blog/how-to-choose-a-fitness-api">how to choose a fitness API</Link>. If
            you&rsquo;re still deciding whether to use one at all, see{" "}
            <Link href={`${PILLAR_PATH}/fitness-api-vs-build-your-own`}>
              fitness API vs building your own
            </Link>
            . On a tight budget, start with{" "}
            <Link href={`${PILLAR_PATH}/free-fitness-apis`}>free &amp; open-source fitness APIs</Link>.
          </p>
        </div>

        {/* Hub: crawlable index linking down to every released spoke, grouped. */}
        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getEntry(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${PILLAR_PATH}/${e!.slug}`}
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
          pitch="We publish hands-on breakdowns of these APIs — the latency, pricing, and privacy details that don't show up on the pricing page. Get the next one in your inbox."
          source="pillar-inline"
          id="cta-fitness-apis-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
