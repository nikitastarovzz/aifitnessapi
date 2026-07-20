import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { getFix, releasedFixes, FIX_PATH } from "@/data/fix";

const UPDATED = "2026-07-09";

export const metadata: Metadata = {
  title: "Fitness & Health API Troubleshooting",
  description:
    "Fixes for common fitness and health API errors: 401s, 429 rate limits, OAuth redirect mismatches, empty HealthKit/Health Connect data, and dead webhooks.",
  alternates: { canonical: FIX_PATH },
  openGraph: {
    type: "website",
    title: "Fitness & Health API Troubleshooting (2026)",
    description:
      "Symptom → cause → fix for the errors builders actually hit: auth failures, rate limits, empty platform-store data, webhook and sync problems.",
    url: FIX_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Auth & tokens",
    blurb: "OAuth failures, unauthorized responses, refresh problems.",
    slugs: ["fitness-api-401-unauthorized", "oauth-redirect-uri-mismatch", "refresh-token-not-working"],
  },
  {
    title: "Rate limits",
    blurb: "Too many requests, throttling, backoff.",
    slugs: ["fitbit-api-429-rate-limit"],
  },
  {
    title: "Empty platform-store data",
    blurb: "HealthKit and Health Connect returning nothing.",
    slugs: ["healthkit-no-data", "health-connect-no-data"],
  },
  {
    title: "Webhooks & sync",
    blurb: "Events not firing, data missing or delayed.",
    slugs: ["strava-webhook-not-firing", "wearable-data-delayed"],
  },
  {
    title: "Access & migration",
    blurb: "Can't get approved, or the API is going away.",
    slugs: ["garmin-api-approval", "google-fit-api-deprecated"],
  },
];

const FAQS = [
  {
    q: "Why is my fitness API call returning no data?",
    a: "The three usual causes are permissions, scope, and timing. For OAuth APIs, confirm the access token has the right scope and hasn't expired. For on-device stores (HealthKit, Health Connect), confirm the user granted the specific data type — and remember HealthKit can't tell you a read was denied, so empty results can mean either no permission or no data. For webhook/aggregator data, the data may simply not have synced yet.",
  },
  {
    q: "How do I debug a fitness API integration?",
    a: "Work outside-in: check the HTTP status first (401 = auth, 403 = scope/permission, 429 = rate limit), then the response body for an error code, then your token's scope and expiry, then the provider's status/approval requirements. Reproduce with a raw curl before blaming your app code, and check whether the provider is mid-migration.",
  },
  {
    q: "What HTTP status codes do fitness APIs use for errors?",
    a: "Commonly: 400 (bad request), 401 (missing/expired/invalid token), 403 (valid token but missing scope or unapproved access), 429 (rate limited — check Retry-After), and 5xx (provider-side). OAuth token endpoints also return a JSON error like invalid_grant or redirect_uri_mismatch that's more specific than the status code.",
  },
];

export default function FixPillar() {
  const url = absoluteUrl(FIX_PATH);
  const released = releasedFixes();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitness & Health API Troubleshooting (2026)",
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
      url: absoluteUrl(`${FIX_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Troubleshooting", path: FIX_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness &amp; Health API Troubleshooting
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Most fitness API failures fall into five buckets: auth and tokens (401, redirect mismatch,
          refresh), rate limits (429), empty on-device data (HealthKit and Health Connect permissions),
          webhooks and sync (events not firing, data delayed), and access or migration (approval gates,
          deprecated APIs). Start from the HTTP status, then the error body, then scope and timing. Each
          guide below is a symptom-to-fix for one specific problem.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>Debug outside-in</h2>
          <p>Before diving into any specific error, triage in this order — it usually points at the bucket fast:</p>
          <ol>
            <li>
              <strong>HTTP status:</strong> 401 = auth, 403 = scope or unapproved access, 429 = rate
              limit, 5xx = provider-side.
            </li>
            <li>
              <strong>Error body:</strong> OAuth endpoints return a specific code (invalid_grant,
              redirect_uri_mismatch) that says more than the status.
            </li>
            <li>
              <strong>Token:</strong> is it expired, is the scope right, is it the correct grant?
            </li>
            <li>
              <strong>Timing &amp; status:</strong> has the data synced yet, and is the provider
              mid-migration or gating access?
            </li>
          </ol>
          <p>
            If you&rsquo;re setting up the integration in the first place (not just fixing it), the{" "}
            <Link href="/integrate">integration guides</Link> walk each provider end to end, and{" "}
            <Link href="/fitness-apis">the fitness API landscape</Link> covers which to pick.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getFix(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${FIX_PATH}/${e!.slug}`}
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
          pitch="We publish a new fix like these most weeks — the errors builders actually hit, with the cause and the one-line fix. Get the next one in your inbox."
          source="pillar-inline"
          id="cta-fix-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} />
      </div>
    </Container>
  );
}
