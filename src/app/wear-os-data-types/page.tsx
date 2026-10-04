import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import {
  HS_DATA_TYPES,
  HS_DATA_TYPES_FETCHED_ON,
  HS_DATA_TYPES_SOURCES,
  HS_DATA_TYPES_SOURCE_UPDATED,
  HS_DATA_TYPE_ARTIFACT,
  HS_DATA_TYPE_CLASS_ADDED_IN,
  HS_DATA_TYPE_CLASS_DESCRIPTION,
  HS_DATA_TYPE_SUBCLASSES,
  HS_PERMISSION_LIST,
  HS_PERMISSION_ROWS,
  HS_PERMISSION_TABLE_LINK_MISMATCHES,
  HS_PERMISSION_TABLE_NON_CONSTANTS,
  type HsDataType,
} from "@/data/healthServicesDataTypes";
import { absoluteUrl } from "@/lib/site";
import { CAPSULE, FaqSection, JsonLd, LINK, TH, articleGraph, count, faqGraph, listOf, site, type Faq } from "../error-codes/_shared";

/**
 * Every Wear OS Health Services DataType companion constant, with the
 * permission Google's permissions table lists for it.
 *
 * Generated from src/data/healthServicesDataTypes.ts
 * (scripts/fetch-health-services-data-types.mjs). Every number in the copy is
 * computed from the data. The type class is read from the declared Kotlin
 * type; the permission is shown only where Google's table names the constant.
 */

const PATH = "/wear-os-data-types";
const TITLE = "Wear OS Health Services Data Types";
const FETCHED = HS_DATA_TYPES_FETCHED_ON;

const TYPES = HS_DATA_TYPES;
const DELTA = TYPES.filter((t) => t.dataTypeClass === "DeltaDataType");
const AGGREGATE = TYPES.filter((t) => t.dataTypeClass === "AggregateDataType");
const byPoint = (p: string) => TYPES.filter((t) => t.dataPointClass === p);
const SAMPLE = byPoint("SampleDataPoint");
const INTERVAL = byPoint("IntervalDataPoint");
const CUMULATIVE = byPoint("CumulativeDataPoint");
const STATISTICAL = byPoint("StatisticalDataPoint");
const WITH_PERMISSION = TYPES.filter((t) => t.permission);
const PERMISSIONS = [...new Set(WITH_PERMISSION.map((t) => t.permission as string))]
  .map((p) => ({ permission: p, types: WITH_PERMISSION.filter((t) => t.permission === p) }))
  .sort((a, b) => b.types.length - a.types.length);
const AGGREGATE_WITH_PERMISSION = AGGREGATE.filter((t) => t.permission);
const WITH_ADDED_IN = TYPES.filter((t) => t.addedIn);
const DAILY = TYPES.filter((t) => t.name.endsWith("_DAILY"));
const VALUE_TYPES = [...new Set(TYPES.map((t) => t.valueType))]
  .map((v) => ({ v, n: TYPES.filter((t) => t.valueType === v).length }))
  .sort((a, b) => b.n - a.n);
/** Delta constants whose name has an aggregate sibling (NAME_TOTAL or NAME_STATS) on the reference. */
const AGG_SIBLING = (t: HsDataType) =>
  AGGREGATE.find((a) => a.name === `${t.name}_TOTAL` || a.name === `${t.name}_STATS`) ?? null;
const DELTA_WITH_SIBLING = DELTA.filter((t) => AGG_SIBLING(t));
const DELTA_WITHOUT_SIBLING = DELTA.filter((t) => !AGG_SIBLING(t));
const subclassText = (name: string) => HS_DATA_TYPE_SUBCLASSES.find((s) => s.name === name)?.description ?? null;

const typeId = (t: HsDataType) => `type-${t.name.toLowerCase()}`;
/** "Delta · sample" — the two classes the declaration names, shortened for the table. */
const typeLabel = (t: HsDataType) =>
  `${t.dataTypeClass.replace(/DataType$/, "")} · ${t.dataPointClass.replace(/DataPoint$/, "").toLowerCase()}`;

const DESCRIPTION = `All ${TYPES.length} Wear OS Health Services DataType constants with Google's description, declared Kotlin type and the permission Google's table lists.`;

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
    q: "What is the difference between DeltaDataType and AggregateDataType on Wear OS?",
    a: `Google's reference describes DeltaDataType as “${subclassText("DeltaDataType")}” and AggregateDataType as “${subclassText("AggregateDataType")}” Of the ${TYPES.length} constants on DataType as read on ${FETCHED}, ${DELTA.length} are delta types (${SAMPLE.length} delivering SampleDataPoint, ${INTERVAL.length} IntervalDataPoint) and ${AGGREGATE.length} are aggregate types (${CUMULATIVE.length} CumulativeDataPoint, ${STATISTICAL.length} StatisticalDataPoint). The class is in the declaration of every constant, e.g. ${TYPES.find((t) => t.name === "HEART_RATE_BPM")?.kotlinType ?? DELTA[0]?.kotlinType}.`,
  },
  {
    q: "Which Android permission does each Health Services data type require?",
    a: `Google's permissions table names ${count(WITH_PERMISSION.length, "DataType constant")}: ${PERMISSIONS.map(
      (p) => `${p.permission} for ${p.types.length === 1 ? p.types[0].name : `${p.types.length} of them`}`,
    ).join(", ")}. It names no permission for the other ${TYPES.length - WITH_PERMISSION.length}, including ${
      AGGREGATE_WITH_PERMISSION.length === 0
        ? `all ${AGGREGATE.length} aggregate types`
        : `${AGGREGATE.length - AGGREGATE_WITH_PERMISSION.length} of the ${AGGREGATE.length} aggregate types (it lists only ${listOf(AGGREGATE_WITH_PERMISSION.map((t) => t.name))})`
    }, so this reference leaves those blank rather than extending the table by analogy.${
      HS_PERMISSION_LIST.some((p) => p.startsWith("BODY_SENSORS"))
        ? ` The list above the table adds the BODY_SENSORS rules by Wear OS version: ${HS_PERMISSION_LIST.filter((p) => p.startsWith("BODY_SENSORS")).join("; ")}.`
        : ""
    }`,
  },
  {
    q: "Does every Wear OS delta data type have a _TOTAL or _STATS aggregate?",
    a: `No. ${DELTA_WITH_SIBLING.length} of the ${DELTA.length} delta constants have an aggregate constant named NAME_TOTAL or NAME_STATS on the same reference. The ${DELTA_WITHOUT_SIBLING.length} without one are ${listOf(DELTA_WITHOUT_SIBLING.map((t) => t.name))}.`,
  },
  {
    q: "Which Health Services data types count over a calendar day?",
    a: `${count(DAILY.length, "constant")} end in _DAILY: ${listOf(DAILY.map((t) => t.name))}. All are ${[...new Set(DAILY.map((t) => `${t.dataTypeClass} with ${t.dataPointClass}`))].join(" or ")}. Google's description of STEPS_DAILY: “${TYPES.find((t) => t.name === "STEPS_DAILY")?.description ?? ""}”`,
  },
  {
    q: "Which Health Services library version added these data types?",
    a: `Google's reference prints “Added in ${HS_DATA_TYPE_CLASS_ADDED_IN ?? "?"}” for the DataType class${HS_DATA_TYPE_ARTIFACT ? ` in ${HS_DATA_TYPE_ARTIFACT}` : ""}. ${
      WITH_ADDED_IN.length
        ? `${WITH_ADDED_IN.length} of the ${TYPES.length} constants print their own version.`
        : `None of the ${TYPES.length} constants prints a version of its own, so the reference does not say whether any of them arrived after ${HS_DATA_TYPE_CLASS_ADDED_IN ?? "the class"}; the androidx health release notes are where that would be recorded.`
    }`,
  },
];

export default function WearOsDataTypesPage() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd data={articleGraph({ path: PATH, title: TITLE, description: DESCRIPTION, modified: FETCHED, section: "Wear OS" })} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Watch apps", path: "/watch-apps" },
            { name: "Wear OS data types", path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Wear OS Health Services data types
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {count(TYPES.length, "data type")} · {count(WITH_PERMISSION.length, "with a listed permission")} · last fetched
          from Google&rsquo;s reference on {FETCHED}
          <ContentAge date={FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          <code className="font-mono text-base">androidx.health.services.client.data.DataType</code> defines{" "}
          {TYPES.length} constants: {DELTA.length} <code className="font-mono text-base">DeltaDataType</code> (
          {SAMPLE.length} sample, {INTERVAL.length} interval) and {AGGREGATE.length}{" "}
          <code className="font-mono text-base">AggregateDataType</code> ({CUMULATIVE.length} cumulative,{" "}
          {STATISTICAL.length} statistical). Google&rsquo;s permissions table assigns a permission to{" "}
          {WITH_PERMISSION.length} of them —{" "}
          {listOf(PERMISSIONS.map((p) => `${p.types.length} ${p.permission}`))} — and names none for the other{" "}
          {TYPES.length - WITH_PERMISSION.length}.
        </p>

        <PageActions path={PATH} url={url} title={TITLE} updated={FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          Which client delivers which types is introduced on{" "}
          <Link href="/devices/wear-os-health-services" className={LINK}>
            Wear OS Health Services
          </Link>
          . The workout path is{" "}
          <Link href="/watch-apps/wear-os-exerciseclient-kotlin" className={LINK}>
            ExerciseClient in Kotlin
          </Link>
          , and the background and spot-reading paths are{" "}
          <Link href="/watch-apps/wear-os-passive-monitoring-measureclient" className={LINK}>
            PassiveMonitoringClient and MeasureClient
          </Link>
          .
        </p>

        <section id="types" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">DataType constants ({TYPES.length})</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            In the reference&rsquo;s order
            {HS_DATA_TYPES_SOURCE_UPDATED.dataType && ` (the page's footer says it was last updated ${HS_DATA_TYPES_SOURCE_UPDATED.dataType})`}
            . Type is read from each constant&rsquo;s declaration — the data-type class, then the data-point class — and
            the full declared type is printed under it. Descriptions are Google&rsquo;s, verbatim. Permission is filled
            only where Google&rsquo;s permissions table names the constant.
            {WITH_ADDED_IN.length === 0 &&
              ` The reference prints “Added in ${HS_DATA_TYPE_CLASS_ADDED_IN ?? "?"}” for the class and no version for any individual constant, so there is no per-row version column.`}
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Constant</th>
                  <th className={TH}>Type</th>
                  <th className={TH}>Google&rsquo;s description</th>
                  {WITH_ADDED_IN.length > 0 && <th className={TH}>Added in</th>}
                  <th className="py-2 font-semibold text-[var(--fg)]">Permission</th>
                </tr>
              </thead>
              <tbody>
                {TYPES.map((t) => (
                  <tr key={t.name} id={typeId(t)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                    <td className="py-3 pr-4">
                      <a href={t.docUrl} rel="nofollow" className="break-all font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                        {t.name}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[var(--muted)]">
                      <span className="whitespace-nowrap text-[var(--fg)]">{typeLabel(t)}</span>
                      <span className="mt-0.5 block break-all font-mono text-[11px]">{t.kotlinType}</span>
                    </td>
                    <td className="py-3 pr-4 text-[var(--muted)]">
                      <span className="text-[var(--fg)]">{t.description ?? <em>No description.</em>}</span>
                      {t.detail && <span className="mt-1 block text-xs leading-relaxed">{t.detail}</span>}
                      {t.deprecated && <span className="mt-1 block text-xs text-amber-700 dark:text-amber-400">Deprecated</span>}
                    </td>
                    {WITH_ADDED_IN.length > 0 && <td className="py-3 pr-4 text-xs text-[var(--muted)]">{t.addedIn ?? ""}</td>}
                    <td className="py-3 font-mono text-xs text-[var(--muted)]">
                      {t.permission ? <span className="text-[var(--fg)]">{t.permission}</span> : <span className="font-sans">Not in table</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="permissions" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Google&rsquo;s permissions table</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            As printed on &ldquo;Declare appropriate permissions&rdquo;
            {HS_DATA_TYPES_SOURCE_UPDATED.permissions && ` (last updated ${HS_DATA_TYPES_SOURCE_UPDATED.permissions})`}.
            {HS_PERMISSION_TABLE_NON_CONSTANTS.length > 0 &&
              ` The table also lists ${listOf(HS_PERMISSION_TABLE_NON_CONSTANTS)}, which are classes rather than DataType constants.`}
            {HS_PERMISSION_TABLE_LINK_MISMATCHES.length > 0 &&
              ` In the table, ${listOf(HS_PERMISSION_TABLE_LINK_MISMATCHES.map((m) => `the ${m.shown} link points to #${m.linksTo}`))}; this page goes by the name printed.`}
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Permission</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">Data types Google lists</th>
                </tr>
              </thead>
              <tbody>
                {HS_PERMISSION_ROWS.map((r) => (
                  <tr key={r.permission} className="border-b border-[var(--border)] align-top">
                    <td className="py-3 pr-4 font-mono text-xs font-semibold text-[var(--fg)]">{r.permission}</td>
                    <td className="py-3 font-mono text-[11px] leading-relaxed text-[var(--muted)]">{r.dataTypes.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 leading-relaxed text-[var(--muted)]">
            Above the table, the same page lists the permissions Health Services uses, verbatim:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
            {HS_PERMISSION_LIST.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section id="about-datatype" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What Google says a DataType is</h2>
          <div className="mt-3 space-y-3 leading-relaxed text-[var(--muted)]">
            {HS_DATA_TYPE_CLASS_DESCRIPTION.map((p) => (
              <p key={p}>&ldquo;{p}&rdquo;</p>
            ))}
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Value types across the {TYPES.length} constants: {listOf(VALUE_TYPES.map((v) => `${v.n} ${v.v}`))}.
          </p>
        </section>

        <FaqSection faqs={FAQS} />

        <p className="mt-12 text-sm text-[var(--muted)]">
          Read on {FETCHED} from Google&rsquo;s{" "}
          <a href={HS_DATA_TYPES_SOURCES.dataType} rel="nofollow" className={LINK}>
            DataType
          </a>{" "}
          reference and{" "}
          <a href={HS_DATA_TYPES_SOURCES.permissions} rel="nofollow" className={LINK}>
            Health Services permissions
          </a>{" "}
          guide by <code className="font-mono text-xs">scripts/fetch-health-services-data-types.mjs</code>. Compiled by{" "}
          {site.name}; Google&rsquo;s documentation remains the authority.
        </p>
      </div>
    </Container>
  );
}
