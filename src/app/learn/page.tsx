import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { getLearn, releasedLearn, LEARN_PATH } from "@/data/learn";

const UPDATED = "2026-07-09";

export const metadata: Metadata = {
  title: "Fitness & Health API Concepts Explained",
  description:
    "Plain-English explainers for health-tech builders: fitness APIs, OAuth, webhooks, aggregators, pose estimation, HRV, VO2 max, and sleep stages.",
  alternates: { canonical: LEARN_PATH },
  openGraph: {
    type: "website",
    title: "Fitness & Health API Concepts Explained (2026)",
    description:
      "The vocabulary of health-tech, explained for builders: APIs, OAuth, webhooks, aggregators, pose estimation, and the metrics inside your data.",
    url: LEARN_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Core API concepts",
    blurb: "The building blocks of a health-tech integration.",
    slugs: ["what-is-a-fitness-api", "what-is-a-health-data-aggregator", "on-device-vs-cloud-health-data"],
  },
  {
    title: "Auth & data delivery",
    blurb: "How access and data actually move.",
    slugs: ["what-is-oauth-for-health-data", "what-are-webhooks"],
  },
  {
    title: "AI & motion",
    blurb: "The tech behind camera-based coaching.",
    slugs: ["what-is-pose-estimation"],
  },
  {
    title: "The metrics in your data",
    blurb: "What the numbers from wearables actually mean.",
    slugs: ["what-is-hrv", "what-is-vo2-max", "what-are-sleep-stages", "how-fitness-apps-estimate-calories"],
  },
];

const FAQS = [
  {
    q: "What is a fitness API in simple terms?",
    a: "A fitness API is a service that lets your app use fitness or health data and features without building them yourself — for example an exercise library, a user's wearable metrics (steps, heart rate, sleep), nutrition data, or camera-based motion tracking. Your app calls the API over the internet (or, for on-device stores, through the operating system) and gets structured data back.",
  },
  {
    q: "What do I need to understand before integrating a health API?",
    a: "A few concepts recur across almost every provider: OAuth 2.0 (how a user grants your app access), webhooks (how you're notified of new data), the difference between on-device stores and cloud APIs, and what the metrics in the data actually mean. These explainers cover each, then link to the hands-on integration guides.",
  },
  {
    q: "Is health data from a fitness API medical-grade?",
    a: "Usually not. Consumer wearables and their APIs are designed for wellness and fitness, and many metrics (calorie burn, sleep stages, VO2 max estimates) are modeled estimates, not clinical measurements. Treat them as directional signals, and don't present them as medical assessments unless you have the evidence and regulatory basis to do so.",
  },
];

export default function LearnPillar() {
  const url = absoluteUrl(LEARN_PATH);
  const released = releasedLearn();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness & Health API Concepts Explained (2026)",
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
      url: absoluteUrl(`${LEARN_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Concepts", path: LEARN_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; Health API Concepts, Explained
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Building in health-tech means learning a specific vocabulary: what a fitness API is, how OAuth
          and webhooks work, the difference between on-device stores and cloud aggregators, pose
          estimation, and what metrics like HRV and VO2 max actually mean. These plain-English
          explainers define each concept, then point you to the hands-on guides.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            New to the space? Start with{" "}
            <Link href={`${LEARN_PATH}/what-is-a-fitness-api`}>what a fitness API is</Link>, then read up
            on the two concepts that show up in almost every integration —{" "}
            <Link href={`${LEARN_PATH}/what-is-oauth-for-health-data`}>OAuth for health data</Link> and{" "}
            <Link href={`${LEARN_PATH}/what-are-webhooks`}>webhooks</Link>. When you&rsquo;re ready to
            build, the <Link href="/integrate">integration guides</Link> and{" "}
            <Link href="/fitness-apis">API comparisons</Link> take it from there.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getLearn(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${LEARN_PATH}/${e!.slug}`}
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
          pitch="We turn one health-tech concept into a plain-English explainer most weeks, then show how it plays out in real APIs. Get the next one in your inbox."
          source="pillar-inline"
          id="cta-learn-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
