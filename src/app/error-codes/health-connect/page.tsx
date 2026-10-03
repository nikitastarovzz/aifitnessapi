import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import {
  ERROR_CODES_FETCHED_ON,
  ERROR_CODES_SOURCES,
  ERROR_CODES_SOURCE_UPDATED,
  HC_CLIENT_EXCEPTIONS,
  HC_CLIENT_NAMES_HEALTHCONNECTEXCEPTION,
  HC_ERROR_CONSTANTS,
  HC_EXCEPTION_API_LEVEL,
} from "@/data/errorCodes";
import { HC_CLIENT_FIX_SLUGS, HC_ERROR_FIX_SLUGS, fixHref } from "@/data/errorCodesEditorial";
import { absoluteUrl } from "@/lib/site";
import { CAPSULE, FaqSection, JsonLd, LINK, TH, articleGraph, count, faqGraph, listOf, site, type Faq } from "../_shared";

/**
 * Health Connect's error codes, from two Google references:
 *
 *  - android.health.connect.HealthConnectException (the platform API): every
 *    ERROR_* constant with its printed value, description and API level.
 *  - androidx.health.connect.client.HealthConnectClient (the Jetpack
 *    library): the exception types its Throws tables document, with Google's
 *    wording and how many methods each appears on.
 *
 * Generated from src/data/errorCodes.ts (scripts/fetch-error-codes.mjs).
 * Every number in the copy is computed from the data.
 */

const PATH = "/error-codes/health-connect";
const TITLE = "Health Connect Error Codes";
const FETCHED = ERROR_CODES_FETCHED_ON;

const CONSTANTS = HC_ERROR_CONSTANTS;
const CLIENT = HC_CLIENT_EXCEPTIONS;
const VALUES = CONSTANTS.map((c) => c.value).filter((v): v is number => v !== null);
const LEVELS = [...new Set(CONSTANTS.map((c) => c.apiLevel))].sort((a, b) => a - b);
const SIMILAR = CONSTANTS.filter((c) => c.similarTo);
/** Constants whose own wording says a later attempt may work. */
const RETRY_WORDING = /\b(again|repeated)\b/i;
const RETRYABLE = CONSTANTS.filter((c) => RETRY_WORDING.test(`${c.description ?? ""} ${c.detail ?? ""}`));
const retrySentence = (c: (typeof CONSTANTS)[number]) =>
  `${c.description ?? ""} ${c.detail ?? ""}`
    .split(/(?<=[.!?])\s+/)
    .find((s) => RETRY_WORDING.test(s))
    ?.trim() ?? "";

const levelText = LEVELS.length === 1 ? `API level ${LEVELS[0]}` : `API levels ${listOf(LEVELS.map(String))}`;
const DESCRIPTION = `All ${CONSTANTS.length} HealthConnectException error codes with values, Google's descriptions and API level, plus the ${CLIENT.length} exceptions HealthConnectClient documents.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS: Faq[] = [
  {
    q: "What does each Health Connect error code number mean?",
    a: `HealthConnectException.getErrorCode() returns one of ${CONSTANTS.length} constants. As Google's reference printed them on ${FETCHED}: ${CONSTANTS.map(
      (c) => `${c.value} is ${c.name} (“${c.description}”)`,
    ).join("; ")}.`,
  },
  {
    q: "Which Health Connect errors does Google say may succeed on a later attempt?",
    a: RETRYABLE.length
      ? `${count(RETRYABLE.length, "constant")}, going by Google's own wording: ${RETRYABLE.map((c) => `${c.name} — “${retrySentence(c)}”`).join("; ")} The reference says nothing about retrying the others, so treat a retry of those as your own decision, and bound it.`
      : `None of the ${CONSTANTS.length} descriptions in the ${FETCHED} read says a repeated call may succeed.`,
  },
  {
    q: "Does the Jetpack HealthConnectClient reference mention HealthConnectException?",
    a: HC_CLIENT_NAMES_HEALTHCONNECTEXCEPTION
      ? `Yes — the class name appears on the HealthConnectClient reference page. Its Throws tables, read on ${FETCHED}, document ${count(CLIENT.length, "exception type")}: ${listOf(CLIENT.map((e) => e.exception))}.`
      : `No. In the ${FETCHED} read the HealthConnectClient reference page does not name HealthConnectException at all. Its Throws tables document ${count(CLIENT.length, "exception type")} instead: ${listOf(
          CLIENT.map((e) => e.exception),
        )}. HealthConnectException belongs to the android.health.connect platform API; the second table on this page lists what the Jetpack reference documents.`,
  },
  {
    q: "Which Health Connect error codes does Google compare to standard exceptions?",
    a: SIMILAR.length
      ? `${count(SIMILAR.length, "constant")} carry Google's sentence “This error may be considered similar to …”: ${SIMILAR.map((c) => `${c.name} to ${c.similarTo}`).join(", ")}. The other ${CONSTANTS.length - SIMILAR.length} have no such comparison.`
      : `None of the ${CONSTANTS.length} constants carries a comparison to a standard exception in the ${FETCHED} read.`,
  },
  {
    q: "Which Android API level added HealthConnectException?",
    a: `Google's reference prints “Added in API level ${HC_EXCEPTION_API_LEVEL ?? "?"}” for the class${
      CONSTANTS[0]?.extension ? `, also available in ${CONSTANTS[0].extension}` : ""
    }. All ${CONSTANTS.length} ERROR_* constants were added at ${levelText}, so none of them is newer than the class.`,
  },
];

export default function HealthConnectErrorCodesPage() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd
        data={articleGraph({ path: PATH, title: TITLE, description: DESCRIPTION, modified: FETCHED, section: "Health Connect" })}
      />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Error codes", path: "/error-codes" },
            { name: "Health Connect", path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health Connect error codes and exceptions
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {count(CONSTANTS.length, "error code")} · {count(CLIENT.length, "Jetpack exception type")} · last fetched from
          Google&rsquo;s reference on {FETCHED}
          <ContentAge date={FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          <code className="font-mono text-base">android.health.connect.HealthConnectException</code> defines{" "}
          {CONSTANTS.length} error codes, values {Math.min(...VALUES)} to {Math.max(...VALUES)}, all added at {levelText}.
          {SIMILAR.length > 0 && ` Google likens ${SIMILAR.length} of them to an existing exception class.`} The Jetpack{" "}
          <code className="font-mono text-base">HealthConnectClient</code> reference documents{" "}
          {count(CLIENT.length, "exception type")} in its Throws tables —{" "}
          {listOf(CLIENT.map((e) => e.exception))}
          {HC_CLIENT_NAMES_HEALTHCONNECTEXCEPTION ? "." : " — and does not name HealthConnectException at all."}
        </p>

        <PageActions path={PATH} url={url} title={TITLE} updated={FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          The iOS counterpart is{" "}
          <Link href="/healthkit-errors" className={LINK}>
            every HealthKit error code
          </Link>
          . Release-by-release changes to the Jetpack library are tracked on{" "}
          <Link href="/health-connect-releases" className={LINK}>
            Health Connect SDK releases
          </Link>
          , and an empty read with no error at all is worked through in{" "}
          <Link href="/fix/health-connect-no-data" className={LINK}>
            Health Connect returns no data
          </Link>
          .
        </p>

        <section id="constants" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            HealthConnectException constants ({CONSTANTS.length})
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            By value, as printed under &ldquo;Constant Value&rdquo; on Google&rsquo;s reference
            {ERROR_CODES_SOURCE_UPDATED.healthConnectException &&
              ` (the page's own footer says it was last updated ${ERROR_CODES_SOURCE_UPDATED.healthConnectException})`}
            . Descriptions are Google&rsquo;s, verbatim. &ldquo;Similar to&rdquo; is copied from Google&rsquo;s sentence
            and is blank where Google draws no comparison.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Value</th>
                  <th className={TH}>Constant</th>
                  <th className={TH}>Google&rsquo;s description</th>
                  <th className={TH}>Similar to</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">Added</th>
                </tr>
              </thead>
              <tbody>
                {CONSTANTS.map((c) => {
                  const fix = fixHref(HC_ERROR_FIX_SLUGS, c.name);
                  return (
                    <tr key={c.name} id={`code-${c.name.toLowerCase()}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                      <td className="py-3 pr-4 tabular-nums text-[var(--fg)]">
                        {c.value ?? "—"}
                        {c.hex && <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">{c.hex}</span>}
                      </td>
                      <td className="py-3 pr-4">
                        <a href={c.docUrl} rel="nofollow" className="font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                          {c.name}
                        </a>
                        {fix && (
                          <Link href={fix} className="mt-1 block text-[11px] text-brand-600 hover:text-brand-500">
                            Fix guide
                          </Link>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-[var(--muted)]">
                        <span className="text-[var(--fg)]">{c.description ?? <em>No description.</em>}</span>
                        {c.detail && <span className="mt-1 block text-xs leading-relaxed">{c.detail}</span>}
                        {c.deprecated && (
                          <span className="mt-1 block text-xs text-amber-700 dark:text-amber-400">{c.deprecationNote}</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-[var(--muted)]">{c.similarTo ?? ""}</td>
                      <td className="py-3 text-xs tabular-nums text-[var(--muted)]">
                        API {c.apiLevel}
                        {c.extension && <span className="mt-0.5 block text-[11px]">{c.extension}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="jetpack" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            What HealthConnectClient documents ({CLIENT.length})
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Every exception named in a &ldquo;Throws&rdquo; table on the Jetpack{" "}
            <code className="font-mono text-sm">HealthConnectClient</code> reference, grouped by class, with each distinct
            wording Google uses and the methods it appears on. Ordered by how many methods document it. This is what the
            reference states, not a list of everything a call can raise at runtime.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Exception</th>
                  <th className={TH}>Google&rsquo;s wording</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">Documented on</th>
                </tr>
              </thead>
              <tbody>
                {CLIENT.map((e) => {
                  const fix = fixHref(HC_CLIENT_FIX_SLUGS, e.exception);
                  return (
                    <tr
                      key={e.exception}
                      id={`exception-${e.exception.toLowerCase()}`}
                      className="scroll-mt-24 border-b border-[var(--border)] align-top"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs font-semibold text-[var(--fg)]">{e.exception}</span>
                        {e.writtenAs.some((w) => w !== e.exception) && (
                          <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">
                            {e.writtenAs.filter((w) => w !== e.exception).join(", ")}
                          </span>
                        )}
                        {fix && (
                          <Link href={fix} className="mt-1 block text-[11px] text-brand-600 hover:text-brand-500">
                            Fix guide
                          </Link>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-[var(--muted)]">
                        <ul className="space-y-1.5">
                          {e.wordings.map((w) => (
                            <li key={w.text}>
                              <span className="text-[var(--fg)]">&ldquo;{w.text}&rdquo;</span>{" "}
                              <span className="text-xs">({count(w.methods.length, "method")})</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 text-xs text-[var(--muted)]">
                        {count(e.methodCount, "method")}:{" "}
                        <span className="font-mono text-[11px]">
                          {[...new Set(e.wordings.flatMap((w) => w.methods))].join(", ")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <FaqSection faqs={FAQS} />

        <p className="mt-12 text-sm text-[var(--muted)]">
          Read on {FETCHED} from Google&rsquo;s{" "}
          <a href={ERROR_CODES_SOURCES.healthConnectException} rel="nofollow" className={LINK}>
            HealthConnectException
          </a>{" "}
          and{" "}
          <a href={ERROR_CODES_SOURCES.healthConnectClient} rel="nofollow" className={LINK}>
            HealthConnectClient
          </a>{" "}
          references by <code className="font-mono text-xs">scripts/fetch-error-codes.mjs</code>. Compiled by {site.name};
          Google&rsquo;s documentation remains the authority. All platforms&rsquo; error codes are indexed at{" "}
          <Link href="/error-codes" className={LINK}>
            error codes
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
