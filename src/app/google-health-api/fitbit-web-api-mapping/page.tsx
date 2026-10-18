import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import PageActions from "@/components/PageActions";
import {
  GHAPI_DATA_TYPE_MAPPING,
  GHAPI_ENDPOINT_MAPPING,
  GHAPI_FETCHED_ON,
  GHAPI_FLAGS,
  GHAPI_SCOPE_MAPPING,
} from "@/data/googleHealthApi";
import { GHAPI_BASE, GHAPI_PATHS, fitDescription, fitTitle, getType, joinList, quote, source, typePath } from "@/data/ghapiPages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, faqGraph, type Faq } from "../../error-codes/_shared";
import { CAPSULE, Code, FetchedLine, FlagList, GoogleSection, H2, Inline, LINK, SourcesChecked, TH, TopicNav, ghapiGraph } from "../_shared";

/**
 * Google's own Fitbit Web API → Google Health API tables (data types, scopes,
 * endpoints) and the "Calculations" rules that changed, from the migration
 * API-specifications page. The migration how-to is owned by
 * /migrate/fitbit-web-api-to-google-health; this page is Google's tables,
 * joined to the data-type pages.
 */

const PATH = GHAPI_PATHS.mapping;
const ROWS = GHAPI_DATA_TYPE_MAPPING;
const IN_TABLE = ROWS.filter((r) => getType(r.googleDataType));
const NOT_IN_TABLE = ROWS.filter((r) => !getType(r.googleDataType));
const MAPPING_FLAGS = GHAPI_FLAGS.filter((f) => f.kind === "mapping-type-not-in-table");
const SPEC = source("apiSpecifications");

const TITLE = fitTitle(["Fitbit Web API to Google Health API: Google's Mapping", "Fitbit Web API to Google Health API Mapping"]);
const H1 = "Fitbit Web API to Google Health API: Google’s mapping tables";
const DESCRIPTION = fitDescription([
  `Google's tables mapping ${ROWS.length} Fitbit Web API data types, ${GHAPI_SCOPE_MAPPING.length} scopes and ${GHAPI_ENDPOINT_MAPPING.length} endpoint types to the Google Health API, plus the calculation rules that changed.`,
  `Google's Fitbit Web API to Google Health API tables: data types, scopes and endpoints, plus the calculation rules that changed.`,
]);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const SPO2 = quote("apiSpecifications", "oxygen-saturation-filtering", "returns fewer");
const SEDENTARY = quote("apiSpecifications", "sedentary-sleep", "Sedentary minutes don't include sleep time");
const SEDENTARY_FORMULA = quote("apiSpecifications", "sedentary-sleep", "Sedentary Minutes =");
const BMI = quote("apiSpecifications", "body-mass-index", "does not expose a built-in BMI data type");
const BMR = quote("apiSpecifications", "basal-metabolic-rate", "does not expose a built-in BMR data type");
const intraday = GHAPI_ENDPOINT_MAPPING.find((r) => /Intraday/.test(r.fitbitEndpointType));
const plain = (s: string) => s.replace(/`/g, "");

const FAQS: Faq[] = [
  {
    q: "How do Fitbit Web API scopes map to Google Health API scopes?",
    a: `Google's migration specification maps ${GHAPI_SCOPE_MAPPING.length} Fitbit Web API scopes: ${GHAPI_SCOPE_MAPPING.map(
      (m) => `${m.fitbitScope} to ${m.googleScopes.join(" and ")}`,
    ).join("; ")}. Each Google scope is the suffix of a full URL under https://www.googleapis.com/auth/googlehealth.`,
  },
  {
    q: "Why does the Google Health API return fewer SpO2 readings than the Fitbit Web API?",
    a: `Because of stricter filtering, per Google's migration specification: "${plain(SPO2)}" ${plain(
      quote("apiSpecifications", "oxygen-saturation-filtering", "only excluded SpO2 samples with a sentinel value"),
    )}`,
  },
  {
    q: "How does the Google Health API count sedentary minutes?",
    a: `Google's migration specification: "${plain(SEDENTARY)}" Its formula for daily rollups: ${plain(SEDENTARY_FORMULA)}`,
  },
  {
    q: "Does the Google Health API have a BMI or BMR data type?",
    a: `Not according to Google's migration specification: "${plain(BMI)}" and "${plain(BMR)}" It gives the formulas instead.${
      MAPPING_FLAGS.length ? ` One of its own mapping rows complicates that: ${plain(MAPPING_FLAGS.map((f) => f.summary).join(" "))}` : ""
    }`,
  },
  ...(intraday
    ? [
        {
          q: "Which Google Health API method replaces the Fitbit Web API's intraday endpoints?",
          a: `Google's endpoint-mapping table: ${plain(intraday.fitbitEndpointType)} maps to the ${plain(intraday.googleHealthApi)}. The full table is on this page.`,
        },
      ]
    : []),
];

export default function GhapiMappingPage() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd data={ghapiGraph({ path: PATH, title: TITLE, headline: H1, description: DESCRIPTION, sources: ["apiSpecifications", "dataTypes", "discoveryV4"] })} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Google Health API", path: GHAPI_BASE },
            { name: "Fitbit Web API mapping", path: PATH },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <FetchedLine extra={<> · Google’s API-specifications page last updated {SPEC.lastUpdated}</>} />

        <p id="answer" className={CAPSULE}>
          Google’s Fitbit migration API specification maps {ROWS.length} Fitbit Web API data types to Google Health API
          dataType ids, {GHAPI_SCOPE_MAPPING.length} Fitbit scopes to Google Health API scopes and{" "}
          {GHAPI_ENDPOINT_MAPPING.length} Fitbit endpoint types to Google Health API methods. {IN_TABLE.length} of the mapped
          data types are in Google’s data-types table
          {NOT_IN_TABLE.length ? `; ${joinList(NOT_IN_TABLE.map((r) => r.googleDataType))} is not` : ""}. Its Calculations
          section says how SpO2 filtering, activity levels, sedentary minutes, BMI and BMR differ from the Fitbit Web API.
        </p>

        <PageActions path={PATH} url={url} title={H1} updated={GHAPI_FETCHED_ON} markdown={false} />
        <TopicNav current={PATH} />

        <section id="data-types" className="mt-12 scroll-mt-24">
          <h2 className={H2}>Data types</h2>
          <p className="mt-2 text-[var(--muted)]">
            Google’s table, row for row: the Fitbit Web API data type as Google names it, the Google Health API data type
            (linked where it has a page here), and Google’s description where the row has one.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Fitbit Web API
                  </th>
                  <th scope="col" className={TH}>
                    Google Health API
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Google’s description
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => {
                  const t = getType(r.googleDataType);
                  return (
                    <tr key={`${r.fitbitDataType}-${r.googleDataType}`} id={`map-${i + 1}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4 text-[var(--fg)]">
                        <Inline text={r.fitbitDataType} />
                      </td>
                      <td className="py-2 pr-4">
                        {t ? (
                          <Link href={typePath(t)} className="font-medium text-brand-600 hover:text-brand-500">
                            {r.googleName}
                          </Link>
                        ) : (
                          <span className="text-[var(--fg)]">{r.googleName}</span>
                        )}
                        <span className="block font-mono text-[11px] text-[var(--muted)]">{r.googleDataType}</span>
                        {!t && <span className="block text-xs text-amber-700 dark:text-amber-400">not in the data-types table</span>}
                      </td>
                      <td className="py-2 text-[var(--muted)]">{r.description ? <Inline text={r.description} /> : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <FlagList flags={MAPPING_FLAGS} />
        </section>

        <section id="scope-mapping" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Scopes</h2>
          <p className="mt-2 text-[var(--muted)]">
            Google’s Fitbit Web API → Google Health API scope table. Every Google Health API scope here is the suffix of
            a URL under <Code>https://www.googleapis.com/auth/googlehealth</Code>;{" "}
            <Link href={GHAPI_PATHS.scopes} className={LINK}>
              every scope with its consent text
            </Link>
            .
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Fitbit Web API scope
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Google Health API scopes
                  </th>
                </tr>
              </thead>
              <tbody>
                {GHAPI_SCOPE_MAPPING.map((m) => (
                  <tr key={m.fitbitScope} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4">
                      <Code>{m.fitbitScope}</Code>
                    </td>
                    <td className="py-2">
                      {m.googleScopes.map((g, i) => (
                        <span key={g}>
                          {i > 0 ? ", " : ""}
                          <Code>{g}</Code>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="endpoints" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Endpoints</h2>
          <GoogleSection page="apiSpecifications" id="endpoints" heading="Google’s endpoint conventions" childIds={["endpoint_mappings"]} />
          <p className="mt-3 text-sm text-[var(--muted)]">
            Each data type’s methods and documented path templates are on its page, starting from{" "}
            <Link href={`${GHAPI_BASE}#methods`} className={LINK}>
              the methods overview
            </Link>
            .
          </p>
        </section>

        <section id="calculations" className="mt-14 scroll-mt-24">
          <h2 className={H2}>Calculations that changed</h2>
          <p className="mt-2 text-[var(--muted)]">Google’s Calculations section, verbatim.</p>
          <GoogleSection page="apiSpecifications" id="oxygen-saturation-filtering" />
          <GoogleSection page="apiSpecifications" id="activity-thresholds" />
          <GoogleSection page="apiSpecifications" id="sedentary-sleep" />
          <GoogleSection page="apiSpecifications" id="body-mass-index" />
          <GoogleSection page="apiSpecifications" id="basal-metabolic-rate" childIds={["tdee"]} />
        </section>

        <p className="mt-10 text-[var(--muted)]">
          The migration itself — re-consent, identity mapping, dual-linking, backfill — step by step:{" "}
          <Link href="/migrate/fitbit-web-api-to-google-health" className={LINK}>
            migrating from the Fitbit Web API to the Google Health API
          </Link>
          . The deadlines:{" "}
          <Link href="/fitbit-api-shutdown" className={LINK}>
            the Fitbit Web API retirement
          </Link>
          .
        </p>

        <FaqSection faqs={FAQS} />

        <ClusterCta
          pitch="Generated from Google's Fitbit migration specification by a script. Subscribe to hear when Google adds a mapping row or changes a calculation rule."
          source="spoke-inline"
          id="cta-ghapi-mapping"
        />

        <SourcesChecked keys={["apiSpecifications", "dataTypes", "discoveryV4"]} />
      </div>
    </Container>
  );
}
