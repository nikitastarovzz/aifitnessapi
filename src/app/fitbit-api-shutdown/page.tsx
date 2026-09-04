import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { Mdx } from "@/components/mdx";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * Event hub: the Fitbit Web API retirement (reported ~September 2026).
 * Deliberately separate from /google-fit-shutdown — two deprecations, two
 * timelines. Every date on this page is hedged to match the sourced pages;
 * the confirmed-vs-reported table is the product. On-site synthesis only.
 */

const PAGE_PATH = "/fitbit-api-shutdown";
const UPDATED = "2026-08-11";

const RELATED: { href: string; label: string }[] = [
  {
    "href": "/migrate/fitbit-web-api-to-google-health",
    "label": "Migrate the Fitbit Web API to Google Health"
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
  description: "The legacy Fitbit Web API is reported to shut down around September 2026; no official day is confirmed. What is verified, what is not, where you migrate.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "article",
    title: "Fitbit Web API Retirement: Deadlines and the Migration Path",
    description: "The legacy Fitbit Web API is reported to shut down around September 2026; no official day is confirmed. What is verified, what is not, where you migrate.",
    url: PAGE_PATH,
    images: ["/opengraph-image"],
  },
};

const ANSWER = "Google is retiring the legacy Fitbit Web API and replacing it with the cloud Google Health API, which uses Google OAuth 2.0, a new developer console, and a new bundled-data-type schema. The turndown is widely reported to land around September 2026, and some third-party transition guides name September 30, 2026, but no official day is confirmed on a page we could verify, so treat every date as provisional. The part that is consistent across every source is not the date: existing Fitbit access and refresh tokens are reported not to transfer, so every user must re-sign-in with a Google Account and re-grant permissions. This is a separate event from the Google Fit shutdown, which Google documents as supported until the end of 2026 and which has different migration targets.";

const FAQS: { q: string; a: string }[] = [
  {
    "q": "Is the Fitbit Web API retirement the same event as the Google Fit shutdown?",
    "a": "No. They are two deprecations with two timelines and two sets of migration targets. Google Fit is a separate product whose APIs Google documents as supported until the end of 2026, and where you migrate depends on how you used Fit: Health Connect for on-device reads, Health Services for Wear OS, or the cloud Google Health API for server-side reads. The legacy Fitbit Web API is a different surface with a single announced destination, the Google Health API, on a timeline reported as around September 2026. The one place the two roads meet is that Google Health API destination, which is also why people conflate them. Note that the Google Health API is not Health Connect either: Health Connect is an on-device Android store with no server endpoint."
  },
  {
    "q": "Has Google published an official Fitbit Web API retirement date we can plan against?",
    "a": "Not one we could verify. The retirement itself is announced, but the specific dates circulating come from vendor and community notices and third-party transition guides rather than from an official page we were able to reach. The reported shape is a Google Account consolidation requirement around mid-May 2026, a side-by-side window running into late September 2026, and the legacy Web API turndown around September 2026, with some guides naming September 30, 2026. Treat all of those as provisional. Anyone stating the day with confidence is over-reading the evidence, and a plan that only works if the exact date holds is not a plan."
  },
  {
    "q": "Which comes first, the Google Account requirement or the legacy API turndown?",
    "a": "The account requirement, according to the reported timeline. Users are reported to need their Fitbit login consolidated into a Google Account by roughly mid-May 2026, and users still on legacy Fitbit-only logins reportedly cannot use the successor API at all until they do. The legacy Web API turndown is reported later, around September 2026. The practical consequence is that account consolidation is a gate on your migration, not a detail inside it: a user who has not consolidated cannot complete your re-consent flow no matter how good the UX is, so surface that step explicitly in your messaging. Verify both dates against current notices before scheduling."
  },
  {
    "q": "We only have a few months of engineering time left. What is the smallest safe migration?",
    "a": "Do three things in order and skip the rest. First, put an abstraction layer over your health-data service so the legacy Fitbit path and the successor path can both run behind one internal interface. Second, ship a re-consent flow and start moving users in cohorts, keeping the legacy path live for anyone who has not reconnected, because tokens are reported not to transfer and re-consent is the long pole. Third, preserve the history you already hold rather than assuming you can re-pull it, since back-fill depth on any new source is capped by the underlying provider. Endpoint-by-endpoint schema polish can wait; lost user connections and lost history cannot."
  },
  {
    "q": "Will moving to an aggregator let us skip the re-consent campaign?",
    "a": "It reduces the engineering, not the user action. An aggregator that supports both the legacy Fitbit Web API and the Google Health API can absorb the OAuth provider change and the schema rewrite on its side, so you keep one integration instead of rebuilding yours. Vendors reported to be preparing for this include Terra, Validic, Thryve/Sahha, Fitabase and Rook, though readiness varies and you should confirm your provider's current status. What no aggregator removes is the grant itself: when the underlying authorization provider changes, users still reconnect. Budget for the reconnection churn either way, and treat the aggregator as insulation against the next deprecation rather than an escape from this one."
  }
];

const BODY = `
Two Google-owned fitness platforms are being turned down on overlapping timelines, and the single most expensive mistake a team can make this year is assuming they are the same project. They are not. This page is about the Fitbit one — the legacy Fitbit Web API that your backend calls with a Bearer token today.

## Two shutdowns, not one

People arrive here having read something about "Google shutting down its fitness API" and cannot tell which one hit them. The two events are genuinely separate: different products, different published language, different successors.

| | Google Fit turndown | Fitbit Web API retirement |
| --- | --- | --- |
| What is going away | All Google Fit API surfaces — Android SDK, REST API, BLE APIs | The legacy Fitbit Web API (the roughly 100-plus endpoint REST surface at api.fitbit.com) |
| Date language | Google's own documentation says Fit APIs "will be supported until the end of 2026" — verified against developer.android.com on July 31, 2026 | Reported as around September 2026, with no official day we could verify. See the confirmed-versus-reported table below |
| Where you migrate | Depends on how you used Fit: Health Connect on-device, Health Services on Wear OS, or the cloud Google Health API for server-side reads | One destination: the cloud Google Health API, or an aggregator sitting in front of it |
| What happens to auth | Fit consent does not carry to Health Connect; Android users re-grant through OS-level permissions | Fitbit tokens are reported to be non-portable; users re-sign-in with a Google Account through Google OAuth 2.0 |
| Extra gate | New Fit developer signups closed on May 1, 2024 | Users on legacy Fitbit-only logins reportedly cannot use the successor until they consolidate into a Google Account |

The confusion is understandable, because the two roads meet at one point: the **Google Health API** is a destination for both a Fit REST integration and a Fitbit Web API integration. But it is not the only Fit destination, and it is not Health Connect. Health Connect is an on-device Android store with no server endpoint; the Google Health API is a cloud REST API your backend calls. If you are here for the Fit side, [the Google Fit shutdown hub](/google-fit-shutdown) owns that event and [the Google Fit deprecation triage page](/fix/google-fit-api-deprecated) owns the symptom. Everything below is Fitbit-only.

## What is confirmed, what is reported

This is the section to read twice, because most of the panic content circulating about this deadline states a date with more confidence than the evidence supports.

| Claim | Status | Where it comes from |
| --- | --- | --- |
| The legacy Fitbit Web API is being retired in favour of the cloud Google Health API | Announced by Google as "the next phase of the Fitbit Web API"; recorded in our [Fitbit integration guide](/integrate/fitbit-api), reviewed July 2026 | Vendor announcement |
| Existing Fitbit access and refresh tokens do not transfer | Reported, and consistent across every source we hold | Vendor and community notices |
| Every user must re-sign-in with a Google Account and re-grant permissions | Reported, consistent | Vendor and community notices |
| Turndown lands around September 2026 | **Reported. Not confirmed on any official page we could verify.** | Community and vendor notices |
| Specifically September 30, 2026 | **Reported by third-party transition guides only.** Weaker than the "around September" claim, not stronger | Third-party transition guides |
| Fitbit logins must consolidate to a Google Account by roughly mid-May 2026 | Reported | Community and vendor notices |
| New integrations should target the Google Health API by around end of May 2026 | Reported | Third-party transition guides |
| A side-by-side window runs into late September 2026 | Reported | Community and vendor notices |
| Google Health API pricing and quota model | Could not verify — not clearly public as of this review | — |

Two hygiene notes that matter more than the calendar. First, a plan that depends on the exact shutoff day has already failed; build a plan that is safe whether the door closes in August or December. Second, do not import figures from the enterprise Google Cloud Healthcare API, which publishes per-request pricing, as if they described the consumer Google Health API — [our Fitbit pricing page](/pricing/fitbit-api-pricing) explains why those are different products.

Verify the current dates against Google's and Fitbit's own developer notices before you schedule anything. We could not reach those pages during this review, and we would rather say so than invent a date.

## Your migration path by integration shape

The work is not the same for everyone. Find your shape first; the destination follows from it.

### Shape 1: a server-side Fitbit Web API consumer

Your backend holds refresh tokens, mints eight-hour access tokens (the commonly documented \`expires_in\` value is 28800 seconds), and polls api.fitbit.com on a schedule. This is the shape with the most exposure, because every piece of it changes: new developer console, Google OAuth 2.0 instead of Fitbit's authorization server, and roughly 100-plus individual endpoints collapsing into bundled data types with a new response format.

Treat it as a re-integration, not a version bump. [The Fitbit Web API to Google Health playbook](/migrate/fitbit-web-api-to-google-health) is the step-by-step: audit your endpoint and scope usage, register on the new console, build an old-endpoint to new-data-type mapping table, put an abstraction layer over your health-data service so both paths can run at once, then move users in cohorts. If the OAuth provider swap is the unfamiliar part, [what OAuth means for health data](/learn/what-is-oauth-for-health-data) covers the grant model you are replacing. And while you are still on the legacy path, [Fitbit error code 401](/fix/fitbit-error-code-401) and [the Fitbit 429 rate limit page](/fix/fitbit-api-429-rate-limit) cover the two failures that will keep firing right up until turndown.

### Shape 2: a mobile app reading Fitbit through an aggregator or a platform store

If Fitbit reaches you through a health-data aggregator, the retirement may be largely absorbed for you: an aggregator that supports both the legacy Web API and the Google Health API can take the OAuth and schema change on its side while you keep one integration. Vendors reported to be preparing for this include Terra, Validic, Thryve/Sahha, Fitabase and Rook — readiness varies, so confirm your provider's current status rather than assuming. [The aggregator category roundup](/fitness-apis/health-data-aggregator-apis) explains how the insulation works, and [consolidating wearables behind an aggregator](/migrate/consolidate-wearables-with-aggregator) is the move itself if you were juggling Fitbit alongside three other direct integrations.

One caveat that no aggregator removes: it caps the engineering to one integration, but it does not erase the user reconnect step. If the underlying grant changes provider, your users still act.

If instead you read Fitbit data that the user has synced into Apple HealthKit or Google Health Connect, you are on the on-device path and this retirement touches you least — but you also have no server-side read, so [the Health Connect integration guide](/integrate/google-health-connect) and [the data-type reference](/matrix) are where the real constraints live.

### Shape 3: analytics and history, not live sync

If Fitbit is a research or reporting input — cohort dashboards, longitudinal analysis, a data warehouse — your risk is not the endpoint, it is the history. Back-fill depth on any new source is capped by the underlying provider, not by you, and the caps vary sharply between providers. Plan to preserve what you already hold rather than assuming you can re-pull it later: [historical backfill](/architecture/historical-backfill) and [incremental sync](/architecture/incremental-sync) cover doing that without corrupting the series you have. If a whole cohort silently fails to reconnect, the gap in your analysis outlives the migration by years, which is why [keeping users connected during a migration](/migrate/keep-users-connected-during-migration) matters as much here as it does for a live product.

Still deciding whether the successor is even the right destination? [Fitbit API alternatives](/alternatives/fitbit-api-alternatives) weighs the Google Health API against aggregators and other single-vendor APIs, and [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) covers the standardize-on-one-device option.

## A dated action checklist

Dated deliberately, because the reported window is short and the reported dates are the only ones anyone has.

**This month, whatever the date turns out to be.** Inventory every Fitbit endpoint, scope and data type you consume, plus your user volume and where refresh tokens live — the inventory is what turns the rest of this into a lookup instead of a scavenger hunt. Subscribe to Fitbit's and Google's official developer notices and record every date you find with a "verify" flag. Put an abstraction layer over your health-data service now, before you need it, so the legacy and successor paths can coexist. Register on the Google Health API console and confirm what data-type coverage actually exists for the types you depend on; parity is still evolving and is not guaranteed.

**Before the reported date.** Stand up the successor path in parallel and dual-read, comparing values against the legacy path rather than trusting the new one on faith. Ship the re-consent flow as a first-class piece of UX, not a cleanup task, and surface the Google Account consolidation step in your messaging, since un-consolidated users are reportedly locked out entirely. Instrument per-user connection status and data freshness so you can see which cohorts have actually moved. Then migrate in waves with a rollback path, chasing stragglers with reminders. Aim to finish comfortably early — a migration executed under deadline pressure is where data gets lost.

**After the legacy path stops answering.** Expect a long tail of users who never saw the prompt; keep the reconnect flow alive for them and keep reporting the gap honestly rather than backfilling around it. Reconcile your history against what you captured before cutover and document what could not be recovered. Only then retire the legacy Fitbit code. The reusable version of this whole sequence, for the next provider that does this to you, is [migrating off a deprecated fitness API](/migrate/migrate-off-a-deprecated-fitness-api).

## How this page was sourced

Every fact above is drawn from our own reviewed pages on the Fitbit and Google Fit transitions, each of which carries its own verification date. The one directly quoted vendor line is Google's statement that Fit APIs "will be supported until the end of 2026", verified against developer.android.com on July 31, 2026. We could not reach Fitbit's or Google's developer documentation while writing this, so nothing here is presented as a freshly confirmed vendor date, and the September 2026 shutoff in particular is reported rather than official. Check the current notices before you commit a schedule.
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
          Fitbit Web API Retirement: Deadlines and the Migration Path
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Updated 11 August 2026 — dates re-checked against our sourced pages; verify current vendor notices before scheduling.</p>

        {/* Answer-first capsule — quotable, speakable, correctly hedged. */}
        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </div>

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

        <ClusterCta pitch="The Fitbit turndown date is reported, not published, and reported dates move. We track the Fitbit and Google Fit timelines as the notices change — subscribe and we'll flag the confirmed date and the re-consent requirements before your integration stops answering." source="pillar-inline" id="cta-fitbit-api-shutdown" />

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
          By {site.name}. Sourcing: our reviewed Fitbit and Google Fit pages, each with its own verification date — nothing on this page is a freshly confirmed vendor date.
        </p>
      </article>
    </Container>
  );
}
