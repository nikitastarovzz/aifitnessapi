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
import { getMigration, releasedMigrate, MIGRATE_PATH } from "@/data/migrate";

const UPDATED = "2026-07-20";

export const metadata: Metadata = {
  title: "Fitness & Health API Migration Guides",
  description:
    "Step-by-step playbooks for moving a fitness or health integration: Google Fit to Health Connect, Fitbit to Google, direct-to-aggregator, polling to webhooks, and more.",
  alternates: { canonical: MIGRATE_PATH },
  openGraph: {
    type: "website",
    title: "Fitness & Health API Migration Guides",
    description:
      "How to migrate an existing fitness/health integration without breaking users: field mapping, historical data, re-consent, and cut-over — one playbook per move.",
    url: MIGRATE_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Platform & deprecation moves",
    blurb: "Forced migrations off winding-down APIs.",
    slugs: [
      "google-fit-to-health-connect",
      "fitbit-web-api-to-google-health",
      "add-android-to-healthkit-app",
      "migrate-off-a-deprecated-fitness-api",
    ],
  },
  {
    title: "Architecture moves",
    blurb: "Change how you source and receive data.",
    slugs: [
      "consolidate-wearables-with-aggregator",
      "aggregator-to-direct-integration",
      "between-health-data-aggregators",
      "polling-to-webhooks",
    ],
  },
  {
    title: "Adapt & keep users connected",
    blurb: "Ride out API changes without losing connections.",
    slugs: ["adapt-to-strava-api-changes", "keep-users-connected-during-migration"],
  },
];

const FAQS = [
  {
    q: "Is migrating a fitness API integration hard?",
    a: "It's usually a real re-integration, not a config change. Different providers expose different data shapes, auth models, and access rules, so a migration typically means re-mapping fields, standing up a new OAuth flow (or on-device permission), handling historical data, and asking users to reconnect. The playbooks here break each move into steps and flag where the effort actually lands.",
  },
  {
    q: "How do I migrate without losing user data or connections?",
    a: "Plan for continuity: keep the old integration reading while you stand up the new one, back-fill historical data where the new source allows it, and run a re-consent flow so users authorize the new connection before you cut over. Where possible, migrate users in waves and keep a rollback path. The 'keep users connected' playbook covers the sequencing.",
  },
  {
    q: "Should I move to an aggregator or integrate directly?",
    a: "An aggregator (Terra, Junction, Rook, Spike) gives you one integration across many devices, which cuts per-vendor work — at a recurring cost and some loss of control. Direct integrations mean more maintenance but no middleman and full access to each provider's data. The direct-to-aggregator and aggregator-to-direct playbooks walk both directions so you can decide by trade-off.",
  },
];

export default function MigratePillar() {
  const url = absoluteUrl(MIGRATE_PATH);
  const released = releasedMigrate();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness & Health API Migration Guides",
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
      url: absoluteUrl(`${MIGRATE_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Migrations", path: MIGRATE_PATH }]} />

        <ClusterHero label="Migrations" seed={heroSeed(MIGRATE_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; Health API Migration Guides
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Migrating a fitness or health integration is usually a real re-integration: you re-map data
          fields, stand up new auth, deal with historical data, and ask users to reconnect. Each playbook
          below takes one move — a deprecation, a switch to or from an aggregator, or an architecture
          change — and walks it step by step, with links to the decision and integration guides.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Still deciding <em>whether</em> to move or <em>what</em> to move to? Start with the{" "}
            <Link href="/alternatives">alternatives</Link> pages for the decision, or{" "}
            <Link href="/fix">troubleshooting</Link> if an API just broke. Once you know the target, each
            playbook here links to its <Link href="/integrate">integration guide</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getMigration(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${MIGRATE_PATH}/${e!.slug}`}
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
          pitch="We track the deprecations and API changes that force migrations across the fitness world — so the next forced move doesn't catch you by surprise. Get the heads-up."
          source="pillar-inline"
          id="cta-migrate-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
