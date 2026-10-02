import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterHero from "@/components/ClusterHero";
import ContentAge from "@/components/ContentAge";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";

const PATH = "/google-fit-shutdown";
const UPDATED = "2026-10-02";
/** Google's Fit migration guide — the primary source for this page's timeline and paths. */
const GUIDE_URL = "https://developer.android.com/health-and-fitness/health-connect/migration/fit";

export const metadata: Metadata = {
  title: { absolute: "Google Fit Shutdown: the 2026 Timeline, Verified" },
  description:
    "Google Fit APIs are supported only until the end of 2026. What is shutting down, who is affected, and where each kind of integration migrates.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: "Google Fit Is Shutting Down: What to Do Before the End of 2026",
    description:
      "The verified timeline, who is affected, and the migration path for each way you used Fit — on-device, REST, or Wear OS.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

/**
 * Event hub for the Google Fit turndown. The /fix page owns the symptom
 * ("I hit a deprecation notice"), the /migrate page owns the step-by-step
 * playbook; this page owns the EVENT — timeline, blast radius, and which
 * path applies to which team — and hands down to both.
 *
 * Re-checked 2026-10-02 against Google's Fit migration guide (GUIDE_URL,
 * "Last updated 2026-09-10 UTC"): "The Google Fit APIs will be supported
 * until the end of 2026", the caution recommending the Google Health API for
 * cloud-based integrations and Health Connect for step tracking and
 * mobile-first apps, and the per-API successor tables. That is END OF
 * SUPPORT — Google publishes no switch-off date and we do not invent one.
 * The May 1, 2024 sign-up closure is no longer on the guide, so it is stated
 * as of the 2026-07-31 check that read it, never as a current documented fact.
 */

const FAQS = [
  {
    q: "When exactly does Google Fit stop working?",
    a: "Google's Fit migration guide says the Fit APIs 'will be supported until the end of 2026' — that is the most specific commitment published, re-checked on developer.android.com on October 2, 2026 (the guide was last updated September 10, 2026). There is no announced day or month, and no switch-off date. Treat it as end of support: the point after which Google has committed to nothing, rather than a date on which requests are guaranteed to fail. Plan to be off Fit well before December 2026, because a migration under deadline pressure is where data gets lost.",
  },
  {
    q: "Does the Google Fit app on my phone stop too?",
    a: "This page is about the developer APIs that apps integrate, and the consumer app is outside our scope as a developer site. Google's Fit migration guide gives no date for the app. It says apps that let users connect to the Google Fit app can keep maintaining that integration for current users, and that Google will update that section with information on when to deprecate it. What it documents for developers is that the Google Fit API, including the REST API, will only be supported until the end of 2026.",
  },
  {
    q: "Which Google Fit successor applies to which integration?",
    a: "Match the successor to how your integration uses Fit, not to feature lists. Google's Fit migration guide recommends the Google Health API for cloud-based integrations, and lists it for the Fit History and Session APIs. Reading mobile steps through the Recording API moves to Health Connect, which the guide describes as on-device storage with no OAuth. Fit on Wear OS moves to Health Services. The Goals API has no replacement API. Multi-vendor products should also consider consolidating behind one aggregator instead of migrating Fit in isolation.",
  },
  {
    q: "We built on Fit years ago and it still works. Can we wait?",
    a: "You can until the end of 2026, but the economics get worse every month. Google's guide recommends migrating and states support only until the end of 2026; after that, assume anything that breaks stays broken, because Google has not said otherwise. Teams that migrate early do it calmly with both systems running in parallel; teams that migrate in November 2026 do it under pressure with users watching. Our migration guide covers running the old and new paths side by side so nothing is lost.",
  },
];

const PATHS: { who: string; go: string; how: React.ReactNode }[] = [
  {
    who: "Step tracking or a mobile-first Android app",
    go: "Google Health Connect",
    how: (
      <>
        Google&rsquo;s recommended path for step tracking and mobile-first apps, and the listed
        successor for reading mobile steps through the Fit Recording API. Follow{" "}
        <Link href="/migrate/google-fit-to-health-connect">the migration playbook</Link> and{" "}
        <Link href="/integrate/google-health-connect">the Health Connect integration guide</Link>.
        Budget for the semantic differences — manifest permissions instead of OAuth scopes, a default
        read window that Google&rsquo;s Health Connect docs put at 30 days before permission was first
        granted unless you request the history permission, and changed data types;{" "}
        <Link href="/matrix">the type reference</Link> maps them.
      </>
    ),
  },
  {
    who: "Cloud or backend integration (Fit History, Session or REST API)",
    go: "The Google Health API, or an aggregator",
    how: (
      <>
        Google&rsquo;s recommended path for cloud-based integrations, and the listed successor for the
        Fit History and Session APIs: a cloud API on a Google Cloud project with web-application OAuth.
        Health Connect is not the server-side answer, because Google describes its storage as
        on-device. If you would rather not rebuild against the Google Health API, put{" "}
        <Link href="/fitness-apis/health-data-aggregator-apis">a health-data aggregator</Link> in
        front of the devices you care about, or have your app read Health Connect locally and sync
        to your backend — <Link href="/architecture/incremental-sync">the sync architecture
        guides</Link> cover doing that without corrupting history.
      </>
    ),
  },
  {
    who: "Wear OS app",
    go: "Health Services",
    how: (
      <>
        Google&rsquo;s listed path for the Fit API on Wear OS. Then decide separately how watch data
        reaches your backend — that is the same on-device-store problem as above, not a Fit-specific
        one.
      </>
    ),
  },
  {
    who: "App using the Goals, Sensor or BLE APIs",
    go: "No direct replacement",
    how: (
      <>
        Google lists these as features without a direct API replacement. For the Goals API its words
        are &ldquo;No replacement API available&rdquo;, on phone and Wear: manage goal tracking and
        daily targets in your own app logic. For the Sensor API it points to the Android Sensors
        framework or the Fused Location Provider API, and for the BLE API to the Android Bluetooth
        APIs directly.
      </>
    ),
  },
  {
    who: "Multi-vendor product (Fit was one of several sources)",
    go: "Consolidate behind an aggregator",
    how: (
      <>
        If you were juggling Fit alongside Fitbit, Garmin or Oura integrations, the turndown is the
        natural moment to <Link href="/migrate/consolidate-wearables-with-aggregator">consolidate
        behind one aggregator</Link> instead of migrating one integration and keeping four. And if
        one of those sources is the legacy Fitbit Web API, note that it has its own, separate
        retirement: a turndown was reported for around September 2026, and as of October 2, 2026 we
        could not confirm on an official page whether it has happened. Google&rsquo;s Fit guide lists
        the Google Health API as its path too — <Link href="/fitbit-api-shutdown">the Fitbit API
        shutdown page</Link> keeps the two events apart.
      </>
    ),
  },
];

export default function GoogleFitShutdownPage() {
  const url = absoluteUrl(PATH);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Google Fit Shutdown: Timeline and Migration Paths",
    description: metadata.description,
    datePublished: "2026-07-31",
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

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Google Fit Shutdown", path: PATH }]} />
        <ClusterHero label="Migration Event" seed={4} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Google Fit Is Shutting Down
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Google documents that the Google Fit APIs — including the REST API — will be supported
          only <strong>until the end of 2026</strong>. That is end of support: Google publishes no
          switch-off date. There is no drop-in replacement: Google&rsquo;s Fit migration guide
          recommends the Google Health API for cloud-based integrations, Health Connect for step
          tracking and mobile-first apps, and Health Services for Wear OS, and lists no replacement
          for the Goals API. When we checked on July 31, 2026, Google&rsquo;s documentation stated
          that new developer sign-ups closed on May 1, 2024; the current guide no longer repeats it.
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The verified timeline</h2>
          <ol className="mt-6 space-y-4 border-l-2 border-brand-400/40 pl-6">
            <li>
              <p className="font-semibold text-[var(--fg)]">May 1, 2024 — sign-ups closed</p>
              <p className="text-sm text-[var(--muted)]">
                As Google&rsquo;s documentation stated it when we checked on July 31, 2026: no new
                developer projects could onboard to Fit, and existing projects kept working. The
                migration guide as updated on September 10, 2026 no longer mentions the date.
              </p>
            </li>
            <li>
              <p className="font-semibold text-[var(--fg)]">Now — the parallel-running window</p>
              <p className="text-sm text-[var(--muted)]">
                The time to migrate calmly: run Fit and its successor side by side, reconcile the
                data, and cut over when the numbers agree. This window shrinks every week.
              </p>
            </li>
            <li>
              <p className="font-semibold text-[var(--fg)]">End of 2026 — support ends</p>
              <p className="text-sm text-[var(--muted)]">
                Google&rsquo;s caution in its{" "}
                <a href={GUIDE_URL} className="underline hover:text-[var(--fg)]" rel="nofollow">
                  Fit migration guide
                </a>{" "}
                (updated September 10, 2026): &ldquo;The Google Fit API (including the REST API) will
                only be supported until the end of 2026. We recommend migrating to the Google Health
                API for cloud-based integrations or Health Connect for step tracking and mobile-first
                apps.&rdquo; No day or month is published, and no switch-off date — and a plan that
                depends on an exact date has already failed. (Re-checked on developer.android.com,
                October 2, 2026.)
              </p>
            </li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Where you migrate depends on how you used Fit
          </h2>
          <div className="mt-6 space-y-5">
            {PATHS.map((p) => (
              <div key={p.who} className="rounded-2xl border border-[var(--border)] p-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">{p.who}</p>
                <p className="mt-1 font-bold text-[var(--fg)]">→ {p.go}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{p.how}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>Two pages to go deeper</h2>
          <p>
            If you landed here from a deprecation notice and want the immediate triage, start with{" "}
            <Link href="/fix/google-fit-api-deprecated">the Google Fit deprecation fix page</Link>.
            When you&rsquo;re ready to execute,{" "}
            <Link href="/migrate/google-fit-to-health-connect">the step-by-step migration
            playbook</Link> covers the parallel-run, reconciliation, and cutover — including{" "}
            <Link href="/migrate/keep-users-connected-during-migration">keeping users connected
            while you move</Link>.
          </p>
        </div>

        <section className="mt-12">
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
          pitch="Platform turndowns rarely announce their exact final day — they just stop answering. We track the Fit timeline and every other fitness API deprecation as they move. Get the heads-up before your integration becomes the news."
          source="pillar-inline"
          id="cta-google-fit-shutdown"
        />

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted)]">
          {/* The page's only date line. A shutdown timeline expires on a
              calendar, so it flags at 30 days, as /changes does. */}
          The end-of-2026 support line and the successor paths were re-checked against Google&rsquo;s
          Fit migration guide (last updated September 10, 2026) on October 2, 2026
          <ContentAge date={UPDATED} staleAfterDays={30} />, and the 30-day Health Connect read
          window against Google&rsquo;s Health Connect read-data guide the same day. The May 1, 2024 sign-up
          date is as Google&rsquo;s documentation stated it on July 31, 2026. Deprecation
          communications change — check{" "}
          <a href={GUIDE_URL} className="underline hover:text-[var(--fg)]" rel="nofollow">
            Google&rsquo;s current guidance
          </a>{" "}
          before committing a migration plan.
        </p>
      </div>
    </Container>
  );
}
