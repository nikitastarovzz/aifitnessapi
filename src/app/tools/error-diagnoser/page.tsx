import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ErrorDiagnoser, { type ErrorHint, type FixHint } from "@/components/tools/ErrorDiagnoser";
import { HK_ERRORS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { fixEntries } from "@/data/fix.entries";
import { RELEASED_FIX } from "@/data/fix";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * "What is this error?" — the question a developer asks at the moment
 * something has already failed, answered from two datasets and nothing else.
 *
 * The matching runs in the browser, but the indexing runs here: the full
 * identifier dataset (332 KB) and the troubleshooting corpus (200 KB) never
 * reach the client, only the case names, Apple's own sentences, and each
 * guide's metaDescription.
 *
 * The keyword map below is the only authored part of the tool, and it maps
 * strings to PAGES, never to diagnoses. Nothing here tells a reader what is
 * wrong with their code; it tells them which reference already covers the
 * string they pasted.
 */

const PATH = "/tools/error-diagnoser";
const TITLE = "Diagnose a HealthKit or OAuth Error";
const DESCRIPTION =
  "Paste an error string and get the matching HKError.Code case in Apple's own wording plus the guide that covers it. Runs client-side, nothing invented.";

export const metadata: Metadata = {
  // Plain, not `absolute` — the layout template appends the site suffix and
  // every title here is inside 45 characters for exactly that.
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Match an error string against every HKError.Code case Apple documents and every troubleshooting guide here — client-side, from the published dataset.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

/* ---------------------------------------------------------------------- *
 * Index building — module scope, server only.
 * ---------------------------------------------------------------------- */

/** Lowercase, strip punctuation, collapse whitespace. Mirrors the client. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Words too common across health-API prose to discriminate between pages. */
const STOP = new Set(
  ("the that this with your you and for from into only also more most other than then them they their there these those any all some such about after before during over under has have had will would should could may might must can cant does doesnt when where which what how why not none only very each both same because while been being are was were its it's app apps data user users system error errors occurs occur value values method methods call calls returns return request requests response responses").split(
    /\s+/,
  ),
);

function contentWords(s: string): string[] {
  return [
    ...new Set(
      normalize(s)
        .split(" ")
        .filter((w) => w.length >= 4 && !STOP.has(w) && !/^\d+$/.test(w)),
    ),
  ];
}

/** Document frequency across the error corpus — a word in half the cases
 *  cannot tell them apart, so it is dropped from the index. */
const DF = new Map<string, number>();
for (const e of HK_ERRORS) {
  for (const w of contentWords(`${e.abstract} ${e.discussion ?? ""}`)) {
    DF.set(w, (DF.get(w) ?? 0) + 1);
  }
}

const ERROR_HINTS: ErrorHint[] = HK_ERRORS.map((e) => ({
  c: e.case,
  a: e.abstract,
  d: e.discussion,
  // /healthkit-errors renders id={`err-${case.toLowerCase()}`} for every case,
  // documented and undocumented alike, so this anchor always exists.
  anchor: `err-${e.case.toLowerCase()}`,
  doc: e.docUrl,
  kw: contentWords(`${e.abstract} ${e.discussion ?? ""}`).filter((w) => (DF.get(w) ?? 0) <= 5),
}));

/**
 * Authored keyword -> troubleshooting page map.
 *
 * Phrases only, in the words that actually appear in an error string, a
 * status line, or a provider's error body. A slug missing from fixEntries or
 * not yet released is dropped rather than linked into a 404.
 */
const FIX_KEYWORDS: Record<string, string[]> = {
  "fitness-api-401-unauthorized": [
    "401",
    "unauthorized",
    "invalid_token",
    "www-authenticate",
    "bearer",
    "expired token",
    "access token expired",
  ],
  "fitbit-error-code-401": ["fitbit", "expired_token", "errortype"],
  "strava-api-401-unauthorized": ["strava", "authorization error", "access_token"],
  "oauth-redirect-uri-mismatch": [
    "redirect_uri",
    "redirect uri mismatch",
    "invalid redirect",
    "callback url mismatch",
    "redirect_uri_mismatch",
  ],
  "refresh-token-not-working": [
    "refresh token",
    "refresh_token",
    "invalid_grant",
    "token rotation",
    "grant_type",
  ],
  "fitbit-api-429-rate-limit": [
    "429",
    "rate limit",
    "too many requests",
    "quota exceeded",
    "retry-after",
  ],
  "healthkit-no-data": [
    "errornodata",
    "no data",
    "empty result",
    "hkstatisticsquery",
    "hksamplequery",
    "returns nothing",
  ],
  "health-connect-no-data": ["health connect", "healthconnectclient", "readrecords"],
  "strava-webhook-not-firing": [
    "webhook",
    "not firing",
    "subscription",
    "hub.challenge",
    "callback not firing",
    "push subscription",
  ],
  "wearable-data-delayed": ["delayed", "stale data", "out of date", "sync lag", "not syncing"],
  "garmin-api-approval": ["garmin", "partner program", "access approval", "api approval"],
  "google-fit-api-deprecated": ["google fit", "fitness api deprecated", "sunset", "shutting down"],
  "oura-personal-access-token-deprecated": ["oura", "personal access token"],
  "healthkit-authorization-denied": [
    "errorauthorizationdenied",
    "errorauthorizationnotdetermined",
    "errorrequiredauthorizationdenied",
    "authorization denied",
    "not determined",
    "requestauthorization",
    "com.apple.healthkit",
  ],
  "healthkit-background-delivery-not-working": [
    "background delivery",
    "hkobserverquery",
    "observer query",
    "enablebackgrounddelivery",
    "never fires",
  ],
};

const FIX_HINTS: FixHint[] = fixEntries
  .filter((e) => RELEASED_FIX.has(e.slug) && FIX_KEYWORDS[e.slug])
  .map((e) => ({
    slug: e.slug,
    h1: e.h1,
    desc: e.metaDescription,
    updated: e.updated,
    kw: [
      ...new Set(
        [...FIX_KEYWORDS[e.slug], e.primaryQuery, e.slug.replace(/-/g, " ")]
          .map(normalize)
          .filter((k) => k.length >= 3),
      ),
    ],
  }));

export default function ErrorDiagnoserPage() {
  const url = absoluteUrl(PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: TITLE,
    description: DESCRIPTION,
    url,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    author: orgRef(),
    publisher: orgRef(),
    dateModified: HK_FETCHED_ON,
    lastReviewed: HK_FETCHED_ON,
    reviewedBy: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Error diagnoser", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={4} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Which error is this?
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Paste an error string — an <code className="font-mono text-sm">NSError</code> description,
          an HTTP status line, a chunk of log — and this matches it against the{" "}
          {HK_ERRORS.length} <code className="font-mono text-sm">HKError.Code</code> cases read from
          Apple&rsquo;s documentation on {HK_FETCHED_ON}, and against the {FIX_HINTS.length}{" "}
          troubleshooting guides published on this site. It shows Apple&rsquo;s own wording for a
          matched case and each guide&rsquo;s own summary — it does not write a diagnosis, and when
          nothing matches it says so.
        </p>

        <section data-tool="error-diagnoser" aria-label="HealthKit and OAuth error diagnoser">
          <ErrorDiagnoser errors={ERROR_HINTS} fixes={FIX_HINTS} fetchedOn={HK_FETCHED_ON} />
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything runs client-side from this site&rsquo;s published dataset. There is no API
              call, no upload, and no model: the text you paste stays in your browser and is matched
              by string overlap against two indexes built at build time.
            </p>
            <p>
              The first index is every <code className="font-mono text-xs">HKError.Code</code> case
              Apple documents, with the abstract and discussion quoted verbatim — the generator{" "}
              <code className="font-mono text-xs">scripts/fetch-healthkit-identifiers.mjs</code> read
              them from Apple&rsquo;s documentation on {HK_FETCHED_ON}. The second is an authored map
              of error strings to the troubleshooting guides on this site; the sentence shown for
              each guide is that guide&rsquo;s own summary, not a re-description of your problem.
            </p>
            <p>
              Apple does not publish the numeric raw values behind{" "}
              <code className="font-mono text-xs">HKError.Code</code>, so a bare{" "}
              <code className="font-mono text-xs">Code=5</code> cannot be resolved to a name from
              anything Apple states publicly, and this tool will not guess one. The underlying data
              is downloadable —{" "}
              <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
                open datasets, CC BY 4.0
              </Link>
              .
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. The full references are{" "}
          <Link href="/healthkit-errors" className="font-medium text-brand-600 hover:text-brand-500">
            every HealthKit error code
          </Link>{" "}
          and{" "}
          <Link href="/fix" className="font-medium text-brand-600 hover:text-brand-500">
            fitness &amp; health API troubleshooting
          </Link>
          . More at{" "}
          <Link href="/tools" className="font-medium text-brand-600 hover:text-brand-500">
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
