import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { getAlternative, releasedAlternatives, ALTERNATIVES_PATH } from "@/data/alternatives";

const UPDATED = "2026-07-09";

export const metadata: Metadata = {
  title: "Fitness & Health API Alternatives",
  description:
    "Considering a switch? Alternatives to Fitbit, Google Fit, Garmin, Strava, Oura, WHOOP, HealthKit, Terra, Nutritionix, and ExerciseDB — why teams move and what to use.",
  alternates: { canonical: ALTERNATIVES_PATH },
  openGraph: {
    type: "website",
    title: "Fitness & Health API Alternatives (2026)",
    description:
      "Why teams replace a given fitness/health API and the realistic alternatives — for wearables, platforms, aggregators, and content APIs.",
    url: ALTERNATIVES_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Wearable & activity APIs",
    blurb: "When cost, approval, or a migration pushes you to look around.",
    slugs: [
      "fitbit-api-alternatives",
      "garmin-api-alternatives",
      "strava-api-alternatives",
      "oura-api-alternatives",
      "whoop-api-alternatives",
    ],
  },
  {
    title: "Platforms & aggregators",
    blurb: "Deprecations and cross-platform gaps.",
    slugs: ["google-fit-api-alternatives", "healthkit-alternatives", "terra-alternatives"],
  },
  {
    title: "Content & nutrition",
    blurb: "Exercise libraries and food databases.",
    slugs: ["exercisedb-alternatives", "nutritionix-alternatives"],
  },
];

const FAQS = [
  {
    q: "Why do teams switch fitness APIs?",
    a: "The usual triggers are a deprecation or migration (Google Fit is winding down; the legacy Fitbit Web API is moving to the Google Health API), an access barrier (Garmin's developer program is partner-approval-only and reportedly paused for new signups), cost or a membership requirement (Oura, WHOOP), missing data or platform coverage, or wanting one integration instead of many. Each alternatives page below walks the specific trigger and the realistic options.",
  },
  {
    q: "What's the fastest way to cover many wearables at once?",
    a: "Use a health-data aggregator (Terra, Junction/ex-Vital, Rook, Spike): one integration and one webhook normalizes data from many devices, so you don't build and maintain a separate integration per provider. The trade-off is a recurring cost, and for some providers you still register your own developer credentials.",
  },
  {
    q: "Are these alternatives drop-in replacements?",
    a: "Rarely. Different providers expose different data, auth models, and access requirements, so a switch usually means re-doing OAuth, re-mapping fields, and asking users to reconnect. The alternatives pages flag where a move is genuinely easy versus where it's a real re-integration.",
  },
];

export default function AlternativesPillar() {
  const url = absoluteUrl(ALTERNATIVES_PATH);
  const released = releasedAlternatives();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness & Health API Alternatives (2026)",
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
      url: absoluteUrl(`${ALTERNATIVES_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Alternatives", path: ALTERNATIVES_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; Health API Alternatives
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Teams replace a fitness or health API for a few recurring reasons: a deprecation or migration,
          an access-approval barrier, cost or a membership requirement, missing data, or wanting one
          integration instead of many. Each page below is anchored on a specific product — why builders
          look for an alternative, the realistic options, and which one fits — with links to the full
          side-by-side comparisons.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Not replacing a specific product, just choosing for the first time? Start with{" "}
            <Link href="/fitness-apis">the fitness API landscape</Link> to compare by category, or read{" "}
            <Link href="/blog/how-to-choose-a-fitness-api">how to choose a fitness API</Link>. Each page
            here links to the relevant comparison and to the{" "}
            <Link href="/integrate">integration guide</Link> for whichever alternative you pick.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getAlternative(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${ALTERNATIVES_PATH}/${e!.slug}`}
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
          pitch="We track migrations, deprecations, and access changes across the fitness API world — so you hear about a switch worth making before it's forced on you. Get the next update."
          source="pillar-inline"
          id="cta-alternatives-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
