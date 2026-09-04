import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterHero from "@/components/ClusterHero";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";

const PATH = "/google-fit-shutdown";
const UPDATED = "2026-07-31";

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
 * Every date here is verified against developer.android.com (2026-07-31):
 * "Google Fit APIs will be supported until the end of 2026." Google has not
 * published a more specific date; we do not invent one.
 */

const FAQS = [
  {
    q: "When exactly does Google Fit stop working?",
    a: "Google's documentation says Fit APIs 'will be supported until the end of 2026' — that is the most specific commitment published, verified against developer.android.com as of July 2026. There is no announced day or month. Treat the end of support as the point after which breakage goes unfixed rather than a guaranteed switch-off date, and plan to be off Fit well before December 2026, because a migration under deadline pressure is where data gets lost.",
  },
  {
    q: "Does the Google Fit app on my phone stop too?",
    a: "This page is about the developer APIs — the Android SDK and the REST API that apps integrate. Google has communicated app-side changes separately, and the app is outside our scope as a developer site. What is documented for developers is that all Fit API surfaces, including the REST API, are supported only until the end of 2026, and that new developer signups already closed on May 1, 2024.",
  },
  {
    q: "Which Google Fit successor applies to which integration?",
    a: "Match the successor to where your integration runs, not to feature lists. An Android app reading on the device moves to Health Connect. A backend calling the Fit REST API has no URL-swap option, because Health Connect has no server endpoint — it moves to Google's newer cloud surface, to an aggregator in front of the devices, or to an app-reads-locally-and-syncs design. Wear OS capture moves to Health Services. Multi-vendor products should consider consolidating behind one aggregator instead of migrating Fit in isolation.",
  },
  {
    q: "We built on Fit years ago and it still works. Can we wait?",
    a: "You can, but the economics get worse every month. The platform is frozen — no new signups since May 2024 means no new provider features, and after support ends, anything that breaks stays broken. Teams that migrate early do it calmly with both systems running in parallel; teams that migrate in November 2026 do it under pressure with users watching. Our migration guide covers running the old and new paths side by side so nothing is lost.",
  },
];

const PATHS: { who: string; go: string; how: React.ReactNode }[] = [
  {
    who: "Android app reading fitness data on the device",
    go: "Google Health Connect",
    how: (
      <>
        The documented successor for on-device reads. Follow{" "}
        <Link href="/migrate/google-fit-to-health-connect">the migration playbook</Link> and{" "}
        <Link href="/integrate/google-health-connect">the Health Connect integration guide</Link>.
        Budget for the semantic differences — permissions, the limited read-history window, and
        changed data types; <Link href="/matrix">the type reference</Link> maps them.
      </>
    ),
  },
  {
    who: "Backend calling the Fit REST API",
    go: "Google's newer Health API surface, or an aggregator",
    how: (
      <>
        The hard case: Health Connect has no server endpoint, so there is no URL swap. Either move
        to Google&rsquo;s cloud-side successor for account-level data, or put{" "}
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
        Google&rsquo;s documented path for watch-side capture. Then decide separately how watch data
        reaches your backend — that is the same on-device-store problem as above, not a Fit-specific
        one.
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
        retirement on a reported ~September 2026 timeline — <Link href="/fitbit-api-shutdown">the
        Fitbit API shutdown page</Link> keeps the two events apart.
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
          Google documents that all Google Fit APIs — including the REST API — are supported only{" "}
          <strong>until the end of 2026</strong>, and new developer signups closed on May 1, 2024.
          There is no drop-in replacement: where you migrate depends on how you used Fit. On-device
          reads go to Health Connect, server-side REST usage needs Google&rsquo;s newer cloud surface
          or an aggregator, and Wear OS capture goes to Health Services.
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The verified timeline</h2>
          <ol className="mt-6 space-y-4 border-l-2 border-brand-400/40 pl-6">
            <li>
              <p className="font-semibold text-[var(--fg)]">May 1, 2024 — signups closed</p>
              <p className="text-sm text-[var(--muted)]">
                No new developer projects can onboard to Fit. Existing projects keep working.
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
                Google&rsquo;s exact words: Fit APIs &ldquo;will be supported until the end of
                2026.&rdquo; No day or month is published — and a plan that depends on the exact
                date has already failed. (Verified against developer.android.com, July 2026.)
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
          Timeline facts verified against Google&rsquo;s developer documentation on July 31, 2026.
          Deprecation communications change — check{" "}
          <a href="https://developer.android.com/health-and-fitness/guides/health-connect/migrate/comparison-guide" className="underline hover:text-[var(--fg)]" rel="nofollow">
            Google&rsquo;s current guidance
          </a>{" "}
          before committing a migration plan.
        </p>
      </div>
    </Container>
  );
}
