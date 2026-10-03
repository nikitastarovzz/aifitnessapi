import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import {
  ERROR_CODES_FETCHED_ON,
  HC_CLIENT_EXCEPTIONS,
  HC_ERROR_CONSTANTS,
  HK_ERROR_CODES,
} from "@/data/errorCodes";
import { HC_ERROR_FIX_SLUGS, HK_ERROR_FIX_SLUGS, fixHref } from "@/data/errorCodesEditorial";
import { HC_RELEASES, HC_RELEASES_FETCHED_ON } from "@/data/hcReleases";
import { CAPSULE, FaqSection, JsonLd, LINK, articleGraph, count, faqGraph, type Faq } from "./_shared";

/**
 * Hub for the generated error-code references. Every count is computed from
 * src/data/errorCodes.ts; nothing here is typed by hand.
 */

const PATH = "/error-codes";
const TITLE = "HealthKit & Health Connect Error Codes";
const FETCHED = ERROR_CODES_FETCHED_ON;

const HK = HK_ERROR_CODES;
const HC = HC_ERROR_CONSTANTS;
const HK_WITH_FIX = HK.filter((r) => fixHref(HK_ERROR_FIX_SLUGS, r.case)).length;
const HC_WITH_FIX = HC.filter((r) => fixHref(HC_ERROR_FIX_SLUGS, r.name)).length;
const HK_WITH_VALUE = HK.filter((r) => r.declarations.some((d) => /=\s*-?\d/.test(d.text))).length;
const HC_WITH_VALUE = HC.filter((r) => r.value !== null).length;
const LATEST_STABLE = HC_RELEASES.filter((r) => r.stage === "stable").sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))[0];

const DESCRIPTION = `Every platform error code for HealthKit (${HK.length} HKError.Code cases) and Health Connect (${HC.length} HealthConnectException constants), read from the vendors' docs.`;

const PAGES = [
  {
    path: "/healthkit-errors",
    name: "Every HealthKit error code",
    blurb: `All ${count(HK.length, "HKError.Code case")} with Apple's wording, why a denied read raises no error at all, and a fix guide for ${HK_WITH_FIX}.`,
  },
  {
    path: "/error-codes/health-connect",
    name: "Health Connect error codes",
    blurb: `${count(HC.length, "HealthConnectException constant")} with value and API level, plus the ${count(HC_CLIENT_EXCEPTIONS.length, "exception type")} the Jetpack HealthConnectClient reference documents.`,
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS: Faq[] = [
  {
    q: "Where do HealthKit and Health Connect define their error codes?",
    a: `HealthKit's are the cases of HKError.Code — ${HK.length} of them on Apple's enum page as read on ${FETCHED}. Health Connect's platform API defines ${HC.length} ERROR_* integer constants on android.health.connect.HealthConnectException. Apps using the Jetpack library meet a different surface: the HealthConnectClient reference documents ${count(HC_CLIENT_EXCEPTIONS.length, "standard exception type")} rather than those constants.`,
  },
  {
    q: "Which platform publishes the numbers behind its error codes?",
    a: `Google prints an integer value for ${HC_WITH_VALUE === HC.length ? `all ${HC.length}` : `${HC_WITH_VALUE} of the ${HC.length}`} Health Connect constants. ${
      HK_WITH_VALUE === 0
        ? `Apple's pages carry no value for any of the ${HK.length} HKError.Code cases, so a HealthKit code number seen in a log cannot be looked up in Apple's documentation, while a Health Connect one can.`
        : `Apple's pages carry a value for ${HK_WITH_VALUE} of the ${HK.length} HKError.Code cases; for the rest, a code number seen in a log cannot be looked up in Apple's documentation.`
    }`,
  },
  {
    q: "How current is this error code reference?",
    a: `The error tables were last read from Apple's and Google's documentation on ${FETCHED}, and the Health Connect release list on ${HC_RELEASES_FETCHED_ON}. Each page prints its read date and how long ago that was. The tables are produced by scripts that refuse to publish if a source parses to fewer rows than the last verified read.`,
  },
];

export default function ErrorCodesHub() {
  return (
    <Container className="py-14">
      <JsonLd
        data={articleGraph({
          path: PATH,
          title: TITLE,
          description: DESCRIPTION,
          modified: FETCHED,
          section: "Error codes",
          pageType: "CollectionPage",
          parts: PAGES.map((p) => ({ name: p.name, path: p.path })),
        })}
      />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Error codes", path: PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          HealthKit and Health Connect error codes
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {HK.length + HC.length} platform error codes · last fetched {FETCHED}
          <ContentAge date={FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          HealthKit reports failures as one of {HK.length} <code className="font-mono text-base">HKError.Code</code>{" "}
          cases; Health Connect&rsquo;s platform API uses {HC.length}{" "}
          <code className="font-mono text-base">HealthConnectException</code> constants. Both references below are
          generated from the vendors&rsquo; own documentation, carry the vendor&rsquo;s wording verbatim, and link to a
          fix guide where this site has one — {HK_WITH_FIX + HC_WITH_FIX} codes so far.
        </p>

        <ul className="mt-10 space-y-4">
          {PAGES.map((p) => (
            <li key={p.path} className="rounded-xl border border-[var(--border)] p-5">
              <Link href={p.path} className="text-lg font-bold text-[var(--fg)] hover:text-brand-600">
                {p.name}
              </Link>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{p.blurb}</p>
            </li>
          ))}
        </ul>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Related</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
            <li>
              <Link href="/health-connect-releases" className={LINK}>
                Health Connect SDK releases
              </Link>{" "}
              — all {HC_RELEASES.length} connect-client releases
              {LATEST_STABLE ? `; the latest stable is ${LATEST_STABLE.version}` : ""}.
            </li>
            <li>
              <Link href="/tools/error-diagnoser" className={LINK}>
                Error diagnoser
              </Link>{" "}
              — paste an error string and match it against the codes and fix guides.
            </li>
            <li>
              <Link href="/fix" className={LINK}>
                Troubleshooting
              </Link>{" "}
              — every fix guide on the site.
            </li>
          </ul>
        </section>

        <FaqSection faqs={FAQS} />
      </div>
    </Container>
  );
}
