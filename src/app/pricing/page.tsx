import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getPricing, releasedPricing, PRICING_PATH } from "@/data/pricing";

const UPDATED = "2026-07-23";

export const metadata: Metadata = {
  title: "Fitness & Health API Pricing",
  description:
    "What fitness and health APIs actually cost: most first-party wearable APIs are free to call — the real costs are aggregators, nutrition/exercise APIs, and your own infra.",
  alternates: { canonical: PRICING_PATH },
  openGraph: {
    type: "website",
    title: "Fitness & Health API Pricing",
    description:
      "A clear-eyed look at fitness/health API costs — which APIs are free to call, which are paid, and what actually drives your bill.",
    url: PRICING_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "First-party wearable APIs",
    blurb: "Usually free to call — the cost is elsewhere.",
    slugs: [
      "fitbit-api-pricing",
      "garmin-api-pricing",
      "strava-api-pricing",
      "oura-api-pricing",
      "whoop-api-pricing",
    ],
  },
  {
    title: "Paid data services",
    blurb: "Aggregators and content APIs that do charge.",
    slugs: [
      "health-data-aggregator-pricing",
      "nutrition-api-pricing",
      "exercise-database-api-pricing",
    ],
  },
  {
    title: "Budgeting",
    blurb: "The honest overview and what drives cost.",
    slugs: ["are-fitness-apis-free", "how-much-does-a-fitness-api-cost"],
  },
];

const FAQS = [
  {
    q: "Are fitness APIs free?",
    a: "Many are. Most first-party wearable APIs — Fitbit, Garmin, Strava, Oura, WHOOP — don't charge a per-call fee to access the API itself; you register (often applying for approval) and call it for free. The costs that actually add up are health-data aggregators (usually priced per connected user or tier), some nutrition and exercise-content APIs (freemium or tiered), the user needing to own the device or a membership (Oura, WHOOP), and your own infrastructure. Verify current terms with each provider.",
  },
  {
    q: "What drives the cost of a fitness API integration?",
    a: "Rarely the API access fee. The bigger drivers are the pricing model of any paid service you use (per-monthly-active-user or per-connection for aggregators, tiered quotas for content APIs), the engineering and infrastructure to store and process the data, ongoing maintenance as providers change, and the approval effort for gated programs. Build-vs-buy matters too: an aggregator trades a recurring fee for far less integration work.",
  },
  {
    q: "Do these prices change often?",
    a: "Yes — API pricing, tiers, and access terms change frequently, and many vendors don't list prices publicly at all. Treat every figure on these pages as a starting point to verify against the provider's current documentation or a sales conversation, not a quote.",
  },
];

export default function PricingPillar() {
  const url = absoluteUrl(PRICING_PATH);
  const released = releasedPricing();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness & Health API Pricing",
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
      url: absoluteUrl(`${PRICING_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Pricing", path: PRICING_PATH }]} />

        <ClusterHero label="Pricing" seed={heroSeed(PRICING_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; Health API Pricing
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The surprising part of fitness API pricing: most first-party wearable APIs — Fitbit, Garmin,
          Strava, Oura, WHOOP — are free to call. You don&rsquo;t pay the provider a per-call fee for API
          access. The costs that actually add up are health-data aggregators, some nutrition and exercise
          APIs, the user owning the device or a membership, and your own infrastructure. Each page below
          breaks down one product&rsquo;s real cost — verify current pricing before you commit.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Choosing by cost is only half the picture — pair these with the{" "}
            <Link href="/fitness-apis">API comparisons</Link> to weigh coverage and fit, or the{" "}
            <Link href="/fitness-apis/free-fitness-apis">free &amp; open-source options</Link> if budget is
            the main constraint. Pricing changes often; always confirm against the provider&rsquo;s live
            documentation.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getPricing(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${PRICING_PATH}/${e!.slug}`}
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
          pitch="Fitness API pricing and access terms shift constantly. We track the changes that hit your bill — so you're not surprised by a new per-user fee or a pricing-page rewrite. Get the updates."
          source="pillar-inline"
          id="cta-pricing-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
