import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import PageActions from "@/components/PageActions";
import { GHAPI_ERRORS, GHAPI_ERRORS_INTRO, GHAPI_FETCHED_ON } from "@/data/googleHealthApi";
import { GHAPI_BASE, GHAPI_PATHS, fitDescription, fitTitle, joinList, quote, section, source } from "@/data/ghapiPages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, faqGraph, type Faq } from "../../error-codes/_shared";
import { Blocks, CAPSULE, Code, FetchedLine, GoogleSection, H2, Inline, LINK, QuotedFrom, SourcesChecked, TH, TopicNav, ghapiGraph } from "../_shared";

/**
 * Every reason in Google's Google Health API v4 error catalog, grouped by
 * HTTP status, then Google's troubleshooting tables, then ACCOUNT_NOT_LINKED
 * in full — the error a Fitbit Web API migration meets first.
 */

const PATH = GHAPI_PATHS.errors;
const STATUSES = [...new Set(GHAPI_ERRORS.map((e) => e.httpStatus))].sort((a, b) => a - b);
const TITLE = fitTitle(["Google Health API Error Codes and Troubleshooting", "Google Health API Error Codes"]);
const H1 = "Google Health API errors: the v4 error catalog and troubleshooting";
const DESCRIPTION = fitDescription([
  `All ${GHAPI_ERRORS.length} reasons in Google's Google Health API v4 error catalog by HTTP status, Google's troubleshooting tables, and ACCOUNT_NOT_LINKED in full.`,
  `All ${GHAPI_ERRORS.length} Google Health API v4 error reasons by HTTP status, Google's troubleshooting tables and ACCOUNT_NOT_LINKED.`,
]);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const plain = (s: string) => s.replace(/`/g, "");
const byReason = (r: string) => GHAPI_ERRORS.find((e) => e.reason === r);
const notLinked = byReason("ACCOUNT_NOT_LINKED");
const sleepExists = byReason("SLEEP_ALREADY_EXISTS");
const NOT_LINKED_WHEN = quote("troubleshooting", "412-precondition-failed", "If a user completes Google OAuth consent");
const NOT_LINKED_FIX = quote("troubleshooting", "412-precondition-failed", "immediately call", true);
const UBERMINT = quote("troubleshooting", "403_forbidden", "Could not mint UberMint from GaiaMint", true);
const NOT_FOUND = quote("troubleshooting", "404-not-found", "was not found on this server", true);
const PROJECT_NUMBER = quote("troubleshooting", "400-bad-request", "Invalid project number in resource name", true);
const INCOMPLETE = quote("errors", "error-codes", "not a complete list");
/** The "message" in Google's ACCOUNT_NOT_LINKED example response. */
const NOT_LINKED_MESSAGE =
  section("troubleshooting", "412-precondition-failed")
    .blocks.map((b) => (b.kind === "code" ? /"message":\s*"([^"]+)"/.exec(b.text)?.[1] : undefined))
    .find(Boolean) ?? null;

const FAQS: Faq[] = [
  {
    q: "What does ACCOUNT_NOT_LINKED mean in the Google Health API?",
    a: `The user's Google Account is not linked to Google Health yet. ${plain(NOT_LINKED_WHEN)} Google's fix: ${plain(NOT_LINKED_FIX)}${
      notLinked ? ` The v4 error catalog's own description of ${notLinked.reason} (HTTP ${notLinked.httpStatus}) reads: "${notLinked.description}"` : ""
    }`,
  },
  {
    q: "What does \"Could not mint UberMint from GaiaMint\" mean in the Google Health API?",
    a: `Google's troubleshooting guide lists it under 403 Forbidden: ${plain(UBERMINT).replace(/\s*\|\s*/g, " — ")}`,
  },
  {
    q: "Why does a Google Health API dataPoints request return 404 Not Found?",
    a: `Google's troubleshooting guide: ${plain(NOT_FOUND).replace(/\s*\|\s*/g, " — ")}`,
  },
  {
    q: "Why does a Google Health API subscriber call fail with \"Invalid project number in resource name\"?",
    a: `Google's troubleshooting guide: ${plain(PROJECT_NUMBER).replace(/\s*\|\s*/g, " — ")}`,
  },
  ...(sleepExists
    ? [
        {
          q: "What does SLEEP_ALREADY_EXISTS mean in the Google Health API?",
          a: `Google's v4 error catalog lists ${sleepExists.reason} with HTTP ${sleepExists.httpStatus}: "${sleepExists.description}"`,
        },
      ]
    : []),
];

export default function GhapiErrorsPage() {
  const url = absoluteUrl(PATH);
  const errors = source("errors");
  return (
    <Container className="py-14">
      <JsonLd data={ghapiGraph({ path: PATH, title: TITLE, headline: H1, description: DESCRIPTION, sources: ["errors", "troubleshooting", "migration", "webhooks"] })} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Google Health API", path: GHAPI_BASE },
            { name: "Errors", path: PATH },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <FetchedLine extra={<> · Google’s error catalog last updated {errors.lastUpdated}</>} />

        <p id="answer" className={CAPSULE}>
          Google’s v4 error catalog lists {GHAPI_ERRORS.length} reasons across HTTP {joinList(STATUSES.map(String))}, and
          adds: “{plain(INCOMPLETE).replace(/^Note: /, "")}” The one a Fitbit Web API migration meets first is{" "}
          {notLinked?.reason ?? "ACCOUNT_NOT_LINKED"}: HTTP {notLinked?.httpStatus ?? 400} with status FAILED_PRECONDITION,
          when a user consents before their Google Account is linked to Google Health. Google says to call users.getIdentity
          right after the OAuth exchange and send the user to the Google Health app to link.
        </p>

        <PageActions path={PATH} url={url} title={H1} updated={GHAPI_FETCHED_ON} markdown={false} />
        <TopicNav current={PATH} />

        <section id="account-not-linked" className="mt-12 scroll-mt-24">
          <h2 className={H2}>ACCOUNT_NOT_LINKED</h2>
          <GoogleSection page="troubleshooting" id="412-precondition-failed" heading="Handle unlinked Google Accounts" />
          {notLinked && NOT_LINKED_MESSAGE && NOT_LINKED_MESSAGE !== notLinked.description && (
            <p className="mt-4 text-sm text-[var(--muted)]">
              The catalog describes <Code>{notLinked.reason}</Code> as “{notLinked.description}”; the example response
              above carries the message “{NOT_LINKED_MESSAGE}”. Both are Google’s text. Our suggestion: match on the reason,
              not the message.
            </p>
          )}
        </section>

        <section id="catalog" className="mt-14 scroll-mt-24">
          <h2 className={H2}>The v4 error catalog</h2>
          <div className="text-[var(--muted)]">
            <Blocks blocks={GHAPI_ERRORS_INTRO} />
          </div>
          {STATUSES.map((status) => {
            const rows = GHAPI_ERRORS.filter((e) => e.httpStatus === status);
            return (
              <div key={status} id={`status-${status}`} className="mt-8 scroll-mt-24">
                <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">
                  HTTP {status} <span className="text-sm font-normal text-[var(--muted)]">({rows.length})</span>
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[36rem] border-collapse text-left text-sm" data-ghapi-errors>
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th scope="col" className={TH}>
                          Reason
                        </th>
                        <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                          Google’s description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((e) => (
                        <tr key={e.reason} id={`error-${e.reason.toLowerCase()}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                          <td className="py-2 pr-4">
                            <Code>{e.reason}</Code>
                          </td>
                          <td className="py-2 text-[var(--muted)]">{e.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          <QuotedFrom page="errors" id="error-codes" />
        </section>

        <section id="troubleshooting" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Google’s troubleshooting tables</h2>
          <GoogleSection page="troubleshooting" id="400-bad-request" />
          <GoogleSection page="troubleshooting" id="401_unauthorized" />
          <GoogleSection page="troubleshooting" id="403_forbidden" />
          <GoogleSection page="troubleshooting" id="404-not-found" />
        </section>

        <section id="support" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Supporting a user</h2>
          <GoogleSection page="troubleshooting" id="retrieve_a_fitbit_user_id" />
          <GoogleSection page="troubleshooting" id="revoke-consent" />
          <GoogleSection page="troubleshooting" id="device-sync-delays" />
        </section>

        <p className="mt-10 text-[var(--muted)]">
          Errors from webhook subscriber calls are on{" "}
          <Link href={`${GHAPI_PATHS.webhooks}#recovery`} className={LINK}>
            the webhooks page
          </Link>
          ; 429 and quota handling on{" "}
          <Link href={GHAPI_PATHS.access} className={LINK}>
            access and rate limits
          </Link>
          . The Fitbit Web API’s own errors:{" "}
          <Link href="/fix/fitbit-error-code-401" className={LINK}>
            Fitbit error code 401
          </Link>
          .
        </p>

        <FaqSection faqs={FAQS} />

        <ClusterCta
          pitch="Generated from Google's error catalog and troubleshooting guide by a script. Subscribe to hear when Google adds an error reason or changes the account-linking flow."
          source="spoke-inline"
          id="cta-ghapi-errors"
        />

        <SourcesChecked keys={["errors", "troubleshooting", "migration", "webhooks"]} />
      </div>
    </Container>
  );
}
