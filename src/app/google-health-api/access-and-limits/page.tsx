import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import PageActions from "@/components/PageActions";
import { GHAPI_ERRORS, GHAPI_FETCHED_ON, GHAPI_FLAGS, GHAPI_PAGES, GHAPI_RATE_LIMITS } from "@/data/googleHealthApi";
import { GHAPI_BASE, GHAPI_PATHS, fitDescription, fitTitle, quote, source } from "@/data/ghapiPages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, faqGraph, type Faq } from "../../error-codes/_shared";
import { Blocks, CAPSULE, Code, FetchedLine, FlagList, GoogleSection, H2, Inline, LINK, QuotedFrom, SourcesChecked, TH, TopicNav, ghapiGraph } from "../_shared";

/**
 * What stands between a Google Health API app and its users: OAuth app
 * verification, the annual CASA security assessment, the 100-user cap on
 * unverified apps, the default quotas and what Google says to do on a 429.
 * Every sentence about Google's process is quoted from Google's pages.
 */

const PATH = GHAPI_PATHS.access;
const TITLE = fitTitle(["Google Health API Verification, Quotas and Rate Limits", "Google Health API Verification and Rate Limits"]);
const H1 = "Google Health API access: verification, the 100-user cap and rate limits";
const DESCRIPTION = fitDescription([
  "Google Health API app verification, the annual CASA security assessment, the 100-user cap on unverified apps, the default quotas and 429 handling, quoted from Google.",
  "Google Health API verification, CASA, the 100-user cap on unverified apps, default quotas and 429 handling, quoted from Google's pages.",
]);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const plain = (s: string) => s.replace(/`/g, "");
const CAP = quote("appVerification", null, "limited to 100 users");
const PLAY = quote("appVerification", null, "might be listed on the Google Play store");
const CASA = quote("appVerification", "security_assessment_casa", "annual");
const TWO_PARTS = quote("appVerification", null, "The verification process has two parts");
const RATE_429 = quote("rateLimits", "handle_rate_limit_errors", "429 Too Many Requests", true);
const QUOTA = quote("rateLimits", "request_a_quota_increase", "Google Cloud Console");
const RETRIES = quote("endpoints", "resilient-error-handling-smart-retries", "exponential backoff", true);
const exhausted = GHAPI_ERRORS.find((e) => e.httpStatus === 429);
const RESTRICTED_FLAGS = GHAPI_FLAGS.filter((f) => f.kind === "restricted-scope-wording");
const limitsSentence = GHAPI_RATE_LIMITS.map((r) => `${r.metric}: ${r.defaultLimit}`).join("; ");

const FAQS: Faq[] = [
  {
    q: "How many users can an unverified Google Health API app have?",
    a: `100. Google's app-verification page: "${plain(CAP)}" It adds: "${plain(PLAY)}" The rate-limits page also caps unverified applications in its per-user row: "${plain(
      GHAPI_RATE_LIMITS.find((r) => /Unverified/.test(r.qpsImpact))?.qpsImpact.split("\n").find((l) => /Unverified/.test(l)) ?? "",
    )}"`,
  },
  {
    q: "What are the Google Health API rate limits?",
    a: `Google's default limits, from its rate-limits page (last updated ${source("rateLimits").lastUpdated}): ${limitsSentence}. ${plain(
      quote("rateLimits", "default_limits_and_impact_analysis", "evaluated across"),
    )}`,
  },
  {
    q: "Does a Google Health API app need a CASA security assessment?",
    a: `Yes, if it uses restricted scopes. Google's app-verification page: "${plain(CASA)}" ${plain(
      quote("appVerification", "security_assessment_casa", "Letter of Validation"),
    )}`,
  },
  {
    q: "What should an app do when the Google Health API returns 429?",
    a: `Back off and retry. Google's rate-limits page: "${plain(RATE_429)}" Its endpoints guide: "${plain(RETRIES)}"${
      exhausted ? ` The v4 error catalog lists ${exhausted.reason} with HTTP ${exhausted.httpStatus}: "${exhausted.description}"` : ""
    }`,
  },
  {
    q: "Can you raise the Google Health API quota?",
    a: `Yes, by request. Google's rate-limits page: "${plain(QUOTA)}"`,
  },
];

export default function GhapiAccessPage() {
  const url = absoluteUrl(PATH);
  const rl = source("rateLimits");
  return (
    <Container className="py-14">
      <JsonLd
        data={ghapiGraph({ path: PATH, title: TITLE, headline: H1, description: DESCRIPTION, sources: ["appVerification", "rateLimits", "about", "endpoints", "errors"] })}
      />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Google Health API", path: GHAPI_BASE },
            { name: "Access and rate limits", path: PATH },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <FetchedLine extra={<> · Google’s app-verification page last updated {source("appVerification").lastUpdated}</>} />

        <p id="answer" className={CAPSULE}>
          Google’s app-verification page: “{plain(CAP)}” {plain(TWO_PARTS)} OAuth app verification by Google’s Trust and
          Safety team, and an annual third-party security assessment. Google’s default quotas are {limitsSentence}; an app
          over a limit gets 429 Too Many Requests and should back off and retry.
        </p>

        <PageActions path={PATH} url={url} title={H1} updated={GHAPI_FETCHED_ON} markdown={false} />
        <TopicNav current={PATH} />

        <section id="verification" className="mt-12 scroll-mt-24">
          <h2 className={H2}>App verification</h2>
          <div className="mt-2 text-[var(--muted)]">
            <Blocks blocks={GHAPI_PAGES.appVerification.intro} />
          </div>
          <QuotedFrom page="appVerification" />
          {RESTRICTED_FLAGS.length > 0 && (
            <>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Google’s About page words the scope rule more strictly than this page does:
              </p>
              <FlagList flags={RESTRICTED_FLAGS} />
            </>
          )}
          <GoogleSection page="appVerification" id="oauth_app_verification" childIds={["in-app_disclosure_requirements"]} />
          <GoogleSection page="appVerification" id="security_assessment_casa" heading="Security assessment (CASA)" />
          <GoogleSection page="appVerification" id="escalations" />
        </section>

        <section id="rate-limits" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Rate limits</h2>
          <p className="mt-2 text-[var(--muted)]">
            <Inline text={quote("rateLimits", null, "enforces rate limits")} /> Google’s table, verbatim:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm" data-ghapi-rate-limits>
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Metric
                  </th>
                  <th scope="col" className={TH}>
                    Default limit
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Google’s QPS impact analysis
                  </th>
                </tr>
              </thead>
              <tbody>
                {GHAPI_RATE_LIMITS.map((r) => (
                  <tr key={r.metric} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4 text-[var(--fg)]">{r.metric}</td>
                    <td className="py-2 pr-4 tabular-nums text-[var(--fg)]">{r.defaultLimit}</td>
                    <td className="py-2 text-[var(--muted)]">
                      <Inline text={r.qpsImpact} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            From{" "}
            <a href={rl.url} className={LINK} rel="noopener">
              Google’s rate-limits page
            </a>
            , last updated {rl.lastUpdated}, read {rl.fetchedOn}.
          </p>
          <GoogleSection page="rateLimits" id="handle_rate_limit_errors" heading="Handling a 429" />
          <GoogleSection page="rateLimits" id="request_a_quota_increase" heading="Asking for more quota" />
          <GoogleSection page="endpoints" id="query-historical-data" heading="Querying history within the limits" childIds={["phased-data-sync-hot-versus-cold-load", "query-chunking-for-aggregation", "resilient-error-handling-smart-retries"]} />
          {exhausted && (
            <p className="mt-6 text-[var(--muted)]">
              In the v4 error catalog the status is <Code>{exhausted.reason}</Code> (HTTP {exhausted.httpStatus}): “
              {exhausted.description}”{" "}
              <Link href={`${GHAPI_PATHS.errors}#error-${exhausted.reason.toLowerCase()}`} className={LINK}>
                every error reason
              </Link>
              .
            </p>
          )}
        </section>

        <p className="mt-10 text-[var(--muted)]">
          Which scopes are restricted, and what each covers:{" "}
          <Link href={GHAPI_PATHS.scopes} className={LINK}>
            Google Health API scopes
          </Link>
          . What the Fitbit Web API’s own limits were:{" "}
          <Link href="/fix/fitbit-api-429-rate-limit" className={LINK}>
            the Fitbit 429 rate-limit page
          </Link>
          .
        </p>

        <FaqSection faqs={FAQS} />

        <ClusterCta
          pitch="Quoted from Google's verification and rate-limit pages, which carry their own last-updated dates. Subscribe to hear when Google changes a quota or the verification process."
          source="spoke-inline"
          id="cta-ghapi-access"
        />

        <SourcesChecked keys={["appVerification", "rateLimits", "about", "endpoints", "errors"]} />
      </div>
    </Container>
  );
}
