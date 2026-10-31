import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import MigrationWizard from "@/components/MigrationWizard";
import VendorHubMenu from "@/components/VendorHubMenu";
import { Mdx } from "@/components/mdx";
import { PAGE_H1 } from "@/data/pageTitles";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * Event hub: the Fitbit Web API retirement. Deliberately separate from
 * /google-fit-shutdown — two deprecations, two timelines. The
 * confirmed-vs-reported table is the product.
 *
 * On 2026-10-12 Google's Google Health API pages became readable to us and
 * publish the timeline: end of support 2026-09-30, turn-off 2026-11-02
 * (developers.google.com/health/about), plus token transfer, re-consent and
 * account linking (developers.google.com/health/migration). Those claims are
 * quoted and marked confirmed; everything still sourced only to community
 * notices stays "reported". UPDATED stays at the last full review, because
 * the rest of the page (the Fit side, the aggregator list, the checklists)
 * was not re-checked that day; the header line names the partial re-check.
 *
 * On 2026-10-17 Google's Quotas and Rate Limits page
 * (developers.google.com/health/rate-limits, last updated 2026-05-18) was read
 * for the default quotas, so the old "pricing and quota model" row is split:
 * quotas confirmed, pricing still could-not-verify. UPDATED still stays put.
 */

const PAGE_PATH = "/fitbit-api-shutdown";
const UPDATED = "2026-08-11";

const RELATED: { href: string; label: string }[] = [
  {
    "href": "/migrate/fitbit-web-api-to-google-health",
    "label": "Migrate the Fitbit Web API to Google Health"
  },
  {
    "href": "/google-health-api",
    "label": "Google Health API reference"
  },
  {
    "href": "/google-fit-shutdown",
    "label": "Google Fit shutdown: the other deadline"
  },
  {
    "href": "/alternatives/fitbit-api-alternatives",
    "label": "Fitbit API alternatives"
  },
  {
    "href": "/migrate/keep-users-connected-during-migration",
    "label": "Keep users connected during a migration"
  }
];

export const metadata: Metadata = {
  title: { absolute: "Fitbit API Shutdown: What's Confirmed for 2026" },
  description: "Google has published the dates: Fitbit Web API support ended Sept 30, 2026, and the API turns off Nov 2, 2026. What is confirmed, and where to migrate.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "article",
    title: "Fitbit Web API Retirement: Deadlines and the Migration Path",
    description: "Google has published the dates: Fitbit Web API support ended Sept 30, 2026, and the API turns off Nov 2, 2026. What is confirmed, and where to migrate.",
    url: PAGE_PATH,
    images: ["/opengraph-image"],
  },
};

const ANSWER = "Google is retiring the legacy Fitbit Web API in favour of the cloud Google Health API, which uses Google OAuth 2.0, a new developer console, and a new bundled-data-type schema. Google's Google Health API page, read on October 31, 2026, gives the timeline: support ended on September 30, 2026, after which the API kept operating without bug fixes or support, and on November 2, 2026 the Fitbit Web API will be turned off and will no longer function or sync data. Google's migration guide says existing access and refresh tokens cannot be transferred, so every user has to re-consent through Google OAuth, after first linking Google Health to their Google Account in the Google Health app. This is a separate event from the Google Fit shutdown, which Google documents as supported until the end of 2026 and which has different migration targets.";

const FAQS: { q: string; a: string }[] = [
  {
    "q": "Is the Fitbit Web API retirement the same event as the Google Fit shutdown?",
    "a": "No. They are two deprecations with two timelines and two sets of migration targets. Google Fit is a separate product whose APIs Google documents as supported until the end of 2026, and where you migrate depends on how you used Fit: Google's Fit migration guide recommends the cloud Google Health API for cloud-based integrations, Health Connect for step tracking and mobile-first apps, and Health Services on Wear OS. The legacy Fitbit Web API is a different surface with a single announced destination, the Google Health API, and a published timeline: end of support on September 30, 2026 and turn-off on November 2, 2026. The one place the two roads meet is that Google Health API destination, which is also why people conflate them. Note that the Google Health API is not Health Connect either: Health Connect is an on-device Android store with no server endpoint."
  },
  {
    "q": "Has Google published an official Fitbit Web API retirement date we can plan against?",
    "a": "Yes. Google's Google Health API page, read on October 31, 2026, lists September 30, 2026 as end of support, when the API keeps operating but Google stops fixing bugs or providing support, and November 2, 2026 as the turn-off, after which the Fitbit Web API no longer functions or syncs data. Before Google published that page, the dates circulated only through vendor and community notices; the September 30 date some third-party guides named turned out to be end of support, not the switch-off. Google says every current integration must migrate as soon as possible, and its migration guide advises making re-consent mandatory only after several weeks of warnings, coinciding with the official deadlines."
  },
  {
    "q": "Which came first, the Google Account requirement or the legacy API turndown?",
    "a": "The account requirement, according to the reported timeline: users were reported to need their Fitbit login consolidated into a Google Account by roughly mid-May 2026, a date no official page we read confirms. Google's migration guide does confirm the gate itself: a user must sign in to the Google Health mobile app to link Google Health to their Google Account before your app can sync their data, and calls made before that fail with ACCOUNT_NOT_LINKED. The legacy Web API's end of support came on September 30, 2026, with the turn-off on November 2. The practical consequence is that account linking is a gate on your migration, not a detail inside it, so surface that step explicitly in your messaging."
  },
  {
    "q": "We have not migrated off the Fitbit Web API yet. What is the smallest safe migration?",
    "a": "Do three things in order and skip the rest. First, put an abstraction layer over your health-data service so the legacy Fitbit path, for as long as it still answers, and the successor path can both run behind one internal interface. Second, ship a re-consent flow and move users in cohorts, keeping the legacy path live for anyone who has not reconnected only while it still answers, because Google's migration guide says tokens cannot be transferred and re-consent is the long pole. Third, preserve the history you already hold rather than assuming you can re-pull it, since back-fill depth on any new source is capped by the underlying provider. Endpoint-by-endpoint schema polish can wait; lost user connections and lost history cannot."
  },
  {
    "q": "Will moving to an aggregator let us skip the re-consent campaign?",
    "a": "It reduces the engineering, not the user action. An aggregator that supports both the legacy Fitbit Web API and the Google Health API can absorb the OAuth provider change and the schema rewrite on its side, so you keep one integration instead of rebuilding yours. Vendors reported to have been preparing for this included Terra, Validic, Thryve, Fitabase and Rook, though readiness varies and you should confirm your provider's current status; Sahha, a separate company from Thryve, says Fitbit data on Android reaches its SDK through Health Connect. What no aggregator removes is the grant itself: when the underlying authorization provider changes, users still reconnect. Budget for the reconnection churn either way, and treat the aggregator as insulation against the next deprecation rather than an escape from this one."
  }
];

const BODY = `
Google announced the end of two of its fitness developer platforms on overlapping timelines, and the single most expensive mistake a team can make is assuming they are the same project. They are not. This page is about the Fitbit one — the legacy Fitbit Web API that backends call with a Bearer token.

## Two shutdowns, not one

People arrive here having read something about "Google shutting down its fitness API" and cannot tell which one hit them. The two events are genuinely separate: different products, different published language, different successors.

| | Google Fit turndown | Fitbit Web API retirement |
| --- | --- | --- |
| What is going away | Support for the Google Fit APIs, including the REST API | The legacy Fitbit Web API (the roughly 100-plus endpoint REST surface at api.fitbit.com) |
| Date language | Google's own documentation says the Fit APIs "will be supported until the end of 2026" — verified against developer.android.com on July 31, 2026 and again on October 2, 2026. End of support, with no switch-off date | Google's Google Health API page, read October 31, 2026: end of support on September 30, 2026, when the API keeps operating without bug fixes or support, and turn-off on November 2, 2026, after which it no longer functions or syncs data |
| Where you migrate | Depends on how you used Fit: Google's migration guide points the Fit History and Session APIs at the cloud Google Health API, step reading at Health Connect, and Wear OS apps at Health Services | One destination: the cloud Google Health API, or an aggregator sitting in front of it |
| What happens to auth | Fit consent does not carry to Health Connect; Android users re-grant through OS-level permissions | Google's migration guide: existing tokens cannot be transferred, so users re-consent through Google OAuth 2.0 |
| Extra gate | Google's documentation stated, when we checked on July 31, 2026, that new Fit developer sign-ups closed on May 1, 2024; the current migration guide no longer repeats it | Google's migration guide: a user must link Google Health to their Google Account in the Google Health mobile app before an app can sync their data; all Google Health API scopes are Restricted and need a privacy and security review |

The confusion is understandable, because the two roads meet at one point: the **Google Health API** is a destination for both a Fit REST integration and a Fitbit Web API integration. But it is not the only Fit destination, and it is not Health Connect. Health Connect is an on-device Android store with no server endpoint; the Google Health API is a cloud REST API your backend calls. If you are here for the Fit side, [the Google Fit shutdown hub](/google-fit-shutdown) owns that event and [the Google Fit deprecation triage page](/fix/google-fit-api-deprecated) owns the symptom. Everything below is Fitbit-only.

## What is confirmed, what is reported

This is the section to read twice. For months the dates circulated with more confidence than the evidence supported; on October 12, 2026 we could finally read Google's own Health API pages, and the table below marks what they confirm. We re-read the timeline on October 31, 2026, after Google moved the turn-off from October 30 to November 2.

| Claim | Status | Where it comes from |
| --- | --- | --- |
| Google announced the legacy Fitbit Web API's retirement in favour of the cloud Google Health API | Announced by Google as "the next phase of the Fitbit Web API"; recorded in our [Fitbit API integration guide](/integrate/fitbit-api) | Vendor announcement |
| The Google Health API is the recommended path for Fitbit Web API integrations | **Confirmed.** Google's Fit migration guide (updated September 10, 2026) lists it for "Fitbit Web API" integrations and marks it Available; checked on developer.android.com on October 2, 2026 | Google's Fit migration guide |
| Existing Fitbit access and refresh tokens do not transfer | **Confirmed.** Google's migration guide: they "cannot be transferred, requiring users to re-consent"; read October 12, 2026 | Google's Health API migration guide |
| Every user must sign in again with a Google Account and re-grant permissions | **Confirmed** by the same guide, which adds that a user must first link Google Health to their Google Account in the Google Health mobile app | Google's Health API migration guide |
| End of support on September 30, 2026 | **Confirmed.** "Support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support." | Google's Google Health API page |
| Turn-off on November 2, 2026 | **Confirmed.** "The Fitbit Web API and Fitbit OAuth endpoints will be turned off and will no longer function or sync data to or from Fitbit users. Requests to these endpoints will fail and return an HTTP \`410 Gone\` status code." Read October 31, 2026; when we first read the page on October 12 it gave October 30, and Google moved the date in an update to the page dated October 23 | Google's Google Health API page |
| September 30, 2026 as the shutoff day | **Superseded.** Third-party guides named it before Google published the timeline; Google makes it the end of support, with the turn-off a month later | Third-party guides, then Google's page |
| Successor access needs a review | **Confirmed.** "All Google Health API scopes are categorized as Restricted, necessitating a privacy and security review for access." | Google's Google Health API page |
| Fitbit logins to consolidate to a Google Account by roughly mid-May 2026 | Reported. Google's migration guide confirms the account-linking gate but gives no date | Community and vendor notices |
| New integrations to target the Google Health API by around end of May 2026 | Reported | Third-party transition guides |
| Legacy and successor APIs running side by side | **Confirmed, ending later than reported.** The legacy API keeps operating without support until the November 2 turn-off, and the migration guide has apps support both login methods while it is active | Google's Health API pages |
| Google Health API pricing | Could not verify — none of the twelve Google Health API documentation pages we read on October 17, 2026 states a price | — |
| Google Health API default quotas | **Confirmed.** 86.4M requests a day and 120,000 a minute per project, 300 a minute per user, and unverified apps capped at 100 users; read October 17, 2026, and tabled on [our Google Health API access and limits page](/google-health-api/access-and-limits) | Google's Quotas and Rate Limits page |

Two hygiene notes. First, the dates are now published and close: if a user has not re-consented by the November 2, 2026 turn-off, Google's migration guide says their data stays available as long as they keep syncing their device to the Google Health app, and you can backfill it once they re-authenticate, so plan for a gap you can fill rather than a seamless cutover. Second, do not import figures from the enterprise Google Cloud Healthcare API, which publishes per-request pricing, as if they described the consumer Google Health API — [our Fitbit pricing page](/pricing/fitbit-api-pricing) explains why those are different products.

Google's Health API pages are the ones to watch: Google notes that the API "is actively evolving" and that changes may require updates on your end. We could not reach Fitbit's own developer pages, most recently on October 12, 2026.

## Your migration path by integration shape

The work is not the same for everyone. Find your shape first; the destination follows from it.

### Shape 1: a server-side Fitbit Web API consumer

Your backend holds refresh tokens, mints eight-hour access tokens (the commonly documented \`expires_in\` value is 28800 seconds), and polls api.fitbit.com on a schedule. This is the shape with the most exposure, because every piece of it changes: new developer console, Google OAuth 2.0 instead of Fitbit's authorization server, and roughly 100-plus individual endpoints collapsing into bundled data types with a new response format.

Treat it as a re-integration, not a version bump. [The Fitbit Web API to Google Health playbook](/migrate/fitbit-web-api-to-google-health) is the step-by-step: audit your endpoint and scope usage, register on the new console, build an old-endpoint to new-data-type mapping table, put an abstraction layer over your health-data service so both paths can run at once, then move users in cohorts. For the mapping table, [the Google Health API reference](/google-health-api) lists every data type on Google's data-types page with its operations and scopes, and [its Fitbit Web API mapping](/google-health-api/fitbit-web-api-mapping) carries Google's own tables from Fitbit data types, scopes and endpoints to their replacements. If the OAuth provider swap is the unfamiliar part, [what OAuth means for health data](/learn/what-is-oauth-for-health-data) covers the grant model you are replacing. And while you are still on the legacy path, [Fitbit error code 401](/fix/fitbit-error-code-401) and [the Fitbit 429 rate limit page](/fix/fitbit-api-429-rate-limit) cover the two failures you will keep seeing for as long as the legacy path answers.

### Shape 2: a mobile app reading Fitbit through an aggregator or a platform store

If Fitbit reaches you through a health-data aggregator, the retirement may be largely absorbed for you: an aggregator that supports both the legacy Web API and the Google Health API can take the OAuth and schema change on its side while you keep one integration. Vendors reported to have been preparing for this included Terra, Validic, Thryve, Fitabase and Rook — readiness varies, so confirm your provider's current status rather than assuming. Sahha, a separate company from Thryve, says Fitbit data on Android reaches its SDK through Health Connect. [The aggregator category roundup](/fitness-apis/health-data-aggregator-apis) explains how the insulation works, and [consolidating wearables behind an aggregator](/migrate/consolidate-wearables-with-aggregator) is the move itself if you were juggling Fitbit alongside three other direct integrations.

One caveat that no aggregator removes: it caps the engineering to one integration, but it does not erase the user reconnect step. If the underlying grant changes provider, your users still act.

If instead you read Fitbit data that the user has synced into Apple HealthKit or Google Health Connect, you are on the on-device path and this retirement touches you least — but you also have no server-side read, so [the Health Connect API integration guide](/integrate/google-health-connect) and [the data-type reference](/matrix) are where the real constraints live.

### Shape 3: analytics and history, not live sync

If Fitbit is a research or reporting input — cohort dashboards, longitudinal analysis, a data warehouse — your risk is not the endpoint, it is the history. Back-fill depth on any new source is capped by the underlying provider, not by you, and the caps vary sharply between providers. Plan to preserve what you already hold rather than assuming you can re-pull it later: [historical backfill](/architecture/historical-backfill) and [incremental sync](/architecture/incremental-sync) cover doing that without corrupting the series you have. If a whole cohort silently fails to reconnect, the gap in your analysis outlives the migration by years, which is why [keeping users connected during a migration](/migrate/keep-users-connected-during-migration) matters as much here as it does for a live product. If those users are research participants, [Fitbit data for research studies after the turndown](/migrate/fitbit-research-studies-after-turndown) covers what Google's research policy adds on top.

Still deciding whether the successor is even the right destination? [Fitbit API alternatives](/alternatives/fitbit-api-alternatives) weighs the Google Health API against aggregators and other single-vendor APIs, and [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) covers the standardize-on-one-device option.

## An action checklist

Per Google's Health API page, support ended on September 30, 2026 and the turn-off is November 2, 2026, so this checklist is ordered by where your migration stands. Until the turn-off your legacy calls still answer, without support; after it they will not.

**If you have not started.** Inventory every Fitbit endpoint, scope and data type you consume, plus your user volume and where refresh tokens live — the inventory is what turns the rest of this into a lookup instead of a scavenger hunt. Subscribe to Fitbit's and Google's official developer notices and record every date you find with a "verify" flag. Put an abstraction layer over your health-data service so the legacy and successor paths can coexist for as long as both answer. Register on the Google Health API console and confirm what data-type coverage actually exists for the types you depend on; parity is not guaranteed.

**If you have not migrated yet and the legacy path still answers.** Stand up the successor path in parallel and dual-read, comparing values against the legacy path rather than trusting the new one on faith. Ship the re-consent flow as a first-class piece of UX, not a cleanup task, and surface the Google Health account-linking step in your messaging, since Google's migration guide says calls for users who have not linked fail with ACCOUNT_NOT_LINKED. Instrument per-user connection status and data freshness so you can see which cohorts have actually moved. Then migrate in waves with a rollback path, chasing stragglers with reminders. Move as fast as the re-consent flow allows: Google's page says the legacy path stops on November 2, 2026, and a migration executed under that kind of pressure is where data gets lost.

**Once the legacy path stops answering.** Expect a long tail of users who never saw the prompt; keep the reconnect flow alive for them and keep reporting the gap honestly rather than backfilling around it. Reconcile your history against what you captured before cutover and document what could not be recovered. Only then retire the legacy Fitbit code. The reusable version of this whole sequence, for the next provider that does this to you, is [migrating off a deprecated fitness API](/migrate/migrate-off-a-deprecated-fitness-api).

## How this page was sourced

Most facts above are drawn from our own reviewed pages on the Fitbit and Google Fit transitions, each of which carries its own verification date. Vendor statements checked directly: on October 2, 2026, Google's statement on developer.android.com that the Fit APIs "will be supported until the end of 2026", and the table in Google's Fit migration guide (updated September 10, 2026) that lists the Google Health API as the recommended path for Fitbit Web API integrations; on October 31, 2026, [Google's Google Health API page](https://developers.google.com/health/about) for the end-of-support and turn-off dates and the Restricted-scope review, and [Google's Health API migration guide](https://developers.google.com/health/migration) for token transfer, re-consent, account linking and backfill; on October 17, 2026, [Google's Quotas and Rate Limits page](https://developers.google.com/health/rate-limits) (last updated May 18, 2026) for the default quotas. We could not reach Fitbit's own developer documentation. Check the current notices before you commit a schedule.
`;

export default function FitbitApiShutdownPage() {
  const url = absoluteUrl(PAGE_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fitbit Web API Retirement: Deadlines and the Migration Path",
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

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Fitbit API Shutdown", path: PAGE_PATH }]} />

        <ClusterHero label="Deadline Watch" seed={8} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {PAGE_H1[PAGE_PATH]}
        </h1>
        {/* A deadline page's claims expire on a calendar, not on a 90-day
            review cycle, so it flags at 30 days, as /changes does. */}
        {/* UPDATED stays at the last full review; the October line names the
            partial re-checks, so the age badge keeps telling the truth. */}
        <p className="mt-3 text-sm text-[var(--muted)]">Updated 11 August 2026<ContentAge date={UPDATED} staleAfterDays={30} /> — dates re-checked against our sourced pages. On 12 October 2026 we read Google&rsquo;s Health API pages, which publish the timeline: end of support 30 September 2026, turn-off 2 November 2026. On 17 October 2026 we read Google&rsquo;s rate-limits page for the default quotas. Verify current vendor notices before scheduling.</p>

        {/* Answer-first capsule — quotable, speakable, correctly hedged. */}
        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </div>

        {/* Read 2026-10-31 on developers.google.com/health/about (last updated
            2026-10-23). The rest of the page still carries the October 12
            reading; a separate change moves those dates. */}
        <aside
          id="http-410"
          className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5 text-sm leading-relaxed text-[var(--fg)]"
        >
          <p className="font-semibold">Getting HTTP 410 from a Fitbit endpoint?</p>
          <p className="mt-2 text-[var(--muted)]">
            Google&rsquo;s Google Health API page (last updated October 23, 2026, read October 31, 2026) gives
            November 2, 2026 as the turn-off: &ldquo;The Fitbit Web API and Fitbit OAuth endpoints will be turned
            off and will no longer function or sync data to or from Fitbit users. Requests to these endpoints will
            fail and return an HTTP 410 Gone status code.&rdquo; So after November 2, 2026 a 410 from a Fitbit Web
            API or Fitbit OAuth endpoint means the turn-off, not a malformed request, and retrying will not bring it
            back.
          </p>
          <p className="mt-2 text-[var(--muted)]">
            The fix is the migration itself. Move each user to the Google Health API with Google OAuth 2.0: Google&rsquo;s
            migration guide says existing tokens &ldquo;cannot be transferred, requiring users to re-consent&rdquo;, and
            that a user must link Google Health to their Google Account in the Google Health app first. For users who
            reconnect late, the same guide says their data stays available &ldquo;as long as they continue syncing
            their device to the Google Health app&rdquo;, so you can backfill the gap once they re-authenticate.{" "}
            <Link href="/migrate/fitbit-web-api-to-google-health" className="underline hover:text-[var(--fg)]">
              The migration playbook
            </Link>{" "}
            has the steps, and{" "}
            <Link href="/google-health-api/errors" className="underline hover:text-[var(--fg)]">
              the Google Health API errors page
            </Link>{" "}
            covers what the new API returns instead.
          </p>
        </aside>

        <section className="mt-10" id="migration-wizard" aria-labelledby="migration-wizard-h">
          <h2 id="migration-wizard-h" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Find your migration path in four questions
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Fitbit Web API, Google Fit or both: the answer quotes Google&rsquo;s migration pages for every rule, and
            its link can be shared with your team.
          </p>
          <div className="mt-5">
            <MigrationWizard first="fitbit-web" currentPath={PAGE_PATH} />
          </div>
        </section>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left">
          <Mdx source={BODY} />
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <VendorHubMenu path={PAGE_PATH} placement="end" />

        <ClusterCta pitch="Google has published the Fitbit Web API dates: support ended September 30, 2026 and the API turns off November 2, 2026. We track the Fitbit and Google Fit timelines as the notices change — subscribe and we'll flag any change to the dates or the re-consent requirements." source="pillar-inline" id="cta-fitbit-api-shutdown" />

        <section className="mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Keep reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {RELATED.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          By {site.name}. Sourcing: our reviewed Fitbit and Google Fit pages, each with its own verification date, Google&rsquo;s Fit migration guide (re-checked 2 October 2026), Google&rsquo;s Health API pages (read 12 October 2026), which publish the Fitbit dates, and Google&rsquo;s rate-limits page (read 17 October 2026) for the default quotas.
        </p>
      </article>
    </Container>
  );
}
