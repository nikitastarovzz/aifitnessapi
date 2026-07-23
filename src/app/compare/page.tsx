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
import { getComparison, releasedCompare, COMPARE_PATH } from "@/data/compare";

const UPDATED = "2026-07-23";

export const metadata: Metadata = {
  title: "Fitness & Health API Comparisons",
  description:
    "Head-to-head comparisons for developers: Oura vs WHOOP, Fitbit vs Apple Watch, Terra vs Rook, and more — by data, API access, cost, and which fits your build.",
  alternates: { canonical: COMPARE_PATH },
  openGraph: {
    type: "website",
    title: "Fitness & Health API Comparisons",
    description:
      "Two products, head to head, through the developer lens — what data each exposes via its API, the access model, cost, and which one fits your app.",
    url: COMPARE_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Wearable data sources",
    blurb: "Which device data to build on.",
    slugs: [
      "oura-vs-whoop",
      "fitbit-vs-apple-watch",
      "strava-vs-garmin-connect",
      "fitbit-vs-oura",
      "whoop-vs-garmin",
    ],
  },
  {
    title: "Health-data aggregators",
    blurb: "One integration, many devices — which broker.",
    slugs: ["terra-vs-rook", "terra-vs-spike"],
  },
  {
    title: "Nutrition & exercise content",
    blurb: "Food databases and exercise libraries.",
    slugs: ["nutritionix-vs-edamam", "edamam-vs-spoonacular", "exercisedb-vs-wger"],
  },
];

const FAQS = [
  {
    q: "How should a developer compare two fitness APIs?",
    a: "Look past the consumer marketing and compare on what matters for a build: what data each exposes through its API, the access model (free-to-call vs approval-gated, OAuth vs on-device), what the end user must have (a specific device or a paid membership), data freshness and webhooks, and licensing or cost. Each comparison here is framed that way, not as a buyer's review of the hardware.",
  },
  {
    q: "Is a head-to-head the same as an alternatives page?",
    a: "Not quite. A comparison weighs two specific products against each other for a fresh decision; an alternatives page is anchored on one product you're considering replacing and lists the realistic options. If you're evaluating exactly two, start with the comparison; if you're leaving a specific provider, start with its alternatives page.",
  },
  {
    q: "Do these comparisons pick a single winner?",
    a: "No — the right choice depends on your build. Each page recommends by use-case (for example, deep sleep and recovery data vs broad mainstream reach, or one aggregator's coverage vs another's regional strength), and links to the integration guide for whichever you pick.",
  },
];

export default function ComparePillar() {
  const url = absoluteUrl(COMPARE_PATH);
  const released = releasedCompare();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness & Health API Comparisons",
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
      url: absoluteUrl(`${COMPARE_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Comparisons", path: COMPARE_PATH }]} />

        <ClusterHero label="Comparisons" seed={heroSeed(COMPARE_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; Health API Comparisons
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Deciding between two options? These head-to-heads compare fitness and health data sources
          through the developer lens — what data each exposes via its API, the access model, what your
          users must have, cost, and which one fits your build. Each page recommends by use-case rather
          than crowning a single winner, and links to the integration guide for whichever you choose.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Not weighing two specific products? Browse the{" "}
            <Link href="/fitness-apis">full API landscape</Link> to choose by category, or the{" "}
            <Link href="/alternatives">alternatives</Link> pages if you&rsquo;re replacing one provider.
            Costs come up throughout — the <Link href="/pricing">pricing</Link> pages go deeper.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getComparison(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${COMPARE_PATH}/${e!.slug}`}
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
          pitch="We compare the fitness and health data sources builders actually choose between — and track when the data, access, or terms shift. Get the comparisons that matter, as they change."
          source="pillar-inline"
          id="cta-compare-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
