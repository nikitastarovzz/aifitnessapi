import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { getIntegration, releasedIntegrations, INTEGRATE_PATH } from "@/data/integrate";

const UPDATED = "2026-07-09";

export const metadata: Metadata = {
  title: "How to Integrate a Fitness or Health API",
  description:
    "Step-by-step integration guides for fitness and health APIs: OAuth, fetching data, and webhooks for HealthKit, Fitbit, Strava, Garmin, Oura, and Terra.",
  alternates: { canonical: INTEGRATE_PATH },
  openGraph: {
    type: "website",
    title: "How to Integrate a Fitness or Health API (2026)",
    description:
      "Per-provider integration guides: OAuth, data endpoints, and webhooks for HealthKit, Fitbit, Strava, Garmin, Oura, WHOOP, Terra, and more.",
    url: INTEGRATE_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Platform health stores",
    blurb: "On-device, per-OS permission (not OAuth).",
    slugs: ["healthkit", "google-health-connect"],
  },
  {
    title: "Wearables & activity",
    blurb: "OAuth 2.0, per-user consent, often partner approval.",
    slugs: ["fitbit-api", "strava-api", "garmin-api", "oura-api", "whoop-api"],
  },
  {
    title: "Aggregators",
    blurb: "One integration, many devices.",
    slugs: ["terra-api"],
  },
  {
    title: "Content & nutrition",
    blurb: "API-key REST — the simplest to start.",
    slugs: ["exercisedb-api", "nutritionix-api"],
  },
];

const FAQS = [
  {
    q: "How do you integrate a fitness API?",
    a: "Most fitness data APIs follow the same shape: register a developer app to get credentials, send the user through an OAuth 2.0 consent flow to get an access token, call the data endpoints with that token, and refresh the token when it expires. Many providers also offer webhooks so you're notified of new data instead of polling. The on-device platform stores (Apple HealthKit, Google Health Connect) are the exception — they use per-data-type OS permissions, not OAuth.",
  },
  {
    q: "Do fitness APIs use OAuth?",
    a: "Most cloud/wearable APIs (Fitbit, Strava, Garmin, Oura, WHOOP) use OAuth 2.0 with per-user consent. Aggregators like Terra broker that OAuth for many providers behind one integration. Apple HealthKit and Google Health Connect are on-device and use OS permission prompts rather than OAuth. Content APIs (ExerciseDB) and some nutrition APIs use a simple API key.",
  },
  {
    q: "Which fitness API is easiest to integrate?",
    a: "API-key REST services (exercise content, some nutrition APIs) are the quickest to get a first call working. OAuth wearable APIs add a consent flow and token refresh, and several (Garmin, WHOOP, Fitbit) require you to apply for production access. On-device stores need platform-specific native code. Pick based on the data you need, not just integration ease.",
  },
];

export default function IntegratePillar() {
  const url = absoluteUrl(INTEGRATE_PATH);
  const released = releasedIntegrations();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Integrate a Fitness or Health API (2026)",
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
      url: absoluteUrl(`${INTEGRATE_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Integration Guides", path: INTEGRATE_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          How to Integrate a Fitness or Health API
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Most fitness data APIs follow one pattern: register a developer app, send the user through an
          OAuth 2.0 consent flow for an access token, call the data endpoints with it, and refresh the
          token when it expires — with webhooks for new-data notifications. The on-device platform
          stores (Apple HealthKit, Google Health Connect) are the exception, using OS permissions
          instead. These guides walk each provider end to end.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>The shared integration pattern</h2>
          <p>
            Before the per-provider specifics, it helps to see the shape almost all of them share:
          </p>
          <ol>
            <li>
              <strong>Register a developer app</strong> with the provider to get a client ID/secret (and,
              for several, apply for production access).
            </li>
            <li>
              <strong>Run the OAuth 2.0 flow</strong> — redirect the user to consent, receive an
              authorization code, exchange it for an access + refresh token.
            </li>
            <li>
              <strong>Call the data endpoints</strong> with the access token to read activity, heart
              rate, sleep, workouts, and so on.
            </li>
            <li>
              <strong>Handle refresh and webhooks</strong> — refresh expiring tokens, and subscribe to
              webhooks so you react to new data instead of polling.
            </li>
          </ol>
          <p>
            Not sure which provider to integrate in the first place? Start with{" "}
            <Link href="/fitness-apis">the fitness API landscape</Link> to choose by category, or the
            head-to-heads like{" "}
            <Link href="/fitness-apis/fitbit-api-vs-garmin-api">Fitbit vs Garmin</Link>. If you want
            camera-based tracking rather than device data, see the{" "}
            <Link href="/guides">AI workout tracking guides</Link> instead.
          </p>
          <p className="text-sm text-[var(--muted)]">
            Auth flows, scopes, endpoints, and access requirements change — and some providers are
            mid-migration. Each guide notes this; always confirm the current details in the provider&rsquo;s
            official documentation before you ship.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getIntegration(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${INTEGRATE_PATH}/${e!.slug}`}
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
          pitch="We publish a new integration walkthrough most weeks — OAuth gotchas, webhook setup, and the access-approval fine print. Get the next one in your inbox."
          source="pillar-inline"
          id="cta-integrate-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
