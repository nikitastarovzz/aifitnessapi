import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import AggregationChecker, { type AggRow } from "@/components/tools/AggregationChecker";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { HK_READONLY } from "@/data/healthkitWritability";
import { GROUP_TO_SLUG, hkGroupLabel } from "@/data/hkGroupPages";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * ".cumulativeSum or .discreteAverage?" for one identifier at a time.
 *
 * This is the highest-consequence question in the identifier dataset and the
 * one Apple answers only in prose: choose wrong and HKStatisticsQuery returns
 * a plausible, wrong number rather than an error. The reference page answers
 * it for all 240 at once; this answers it for the one you are about to query,
 * with Apple's own sentence as the evidence.
 *
 * Rows are trimmed here rather than in the client component so the 332 KB
 * identifier dataset stays server-side.
 */

const PATH = "/tools/aggregation-checker";
const TITLE = "Sum or Average? Check 120 HealthKit Types";
const DESCRIPTION =
  "Type a HealthKit identifier and see whether Apple describes it as cumulative or discrete, with the sentence that says so — and where Apple is silent.";

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
      "Pick a HealthKit quantity or category type and get its aggregation style, unit family, value enum and read-only status, quoted from Apple's wording.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const READONLY_EVIDENCE = new Map(HK_READONLY.map((r) => [r.case, r.evidence]));

const ROWS: AggRow[] = HK_IDENTIFIERS.filter(
  (r) => r.family === "quantity" || r.family === "category",
).map((r) => {
  const gs = GROUP_TO_SLUG[r.group] ?? "";
  return {
    c: r.case,
    o: r.objc,
    f: r.family === "quantity" ? "quantity" : "category",
    a: r.abstract,
    agg: r.aggregation,
    ev: r.aggregationEvidence,
    u: r.unitFamily,
    ve: r.valueEnum,
    gs,
    gl: gs ? hkGroupLabel(gs) : r.group,
    ro: READONLY_EVIDENCE.get(r.case) ?? null,
  };
});

const QUANTITY = ROWS.filter((r) => r.f === "quantity");
const CUMULATIVE = QUANTITY.filter((r) => r.agg === "cumulative").length;
const DISCRETE = QUANTITY.filter((r) => r.agg === "discrete").length;
const UNSTATED = QUANTITY.filter((r) => !r.agg).length;

export default function AggregationCheckerPage() {
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
            { name: "Aggregation checker", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={7} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Sum it or average it?
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Apple states whether a quantity type accumulates or is measured point-in-time in the
          type&rsquo;s prose, not as a property you can read — so the wrong{" "}
          <code className="font-mono text-sm">HKStatisticsQuery</code> option returns a plausible,
          wrong number instead of an error. Type an identifier below and this returns the answer for
          it, with Apple&rsquo;s own sentence as the evidence. Of the {QUANTITY.length} quantity
          types read from Apple&rsquo;s documentation on {HK_FETCHED_ON}, {CUMULATIVE} are described
          as cumulative and {DISCRETE} as discrete; for {UNSTATED} Apple&rsquo;s wording does not say
          and neither does this tool.
        </p>

        <section data-tool="aggregation-checker" aria-label="HealthKit aggregation checker">
          <AggregationChecker rows={ROWS} fetchedOn={HK_FETCHED_ON} />
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything runs client-side from this site&rsquo;s published dataset — no API call and
              no lookup service. The {ROWS.length} rows behind the type-ahead were read from
              Apple&rsquo;s documentation on {HK_FETCHED_ON} by{" "}
              <code className="font-mono text-xs">scripts/fetch-healthkit-identifiers.mjs</code>.
            </p>
            <p>
              Aggregation style and unit family are the only derived fields in that dataset: Apple
              states both in prose rather than as machine-readable properties, so the sentence each
              was derived from is stored beside it and shown here verbatim. Where Apple&rsquo;s
              wording does not state a value, the field is null and this tool renders{" "}
              <em>not stated</em> rather than a guess. The read-only flag works the same way — it is
              set only where Apple explicitly says the samples cannot be saved, and its evidence
              sentence sits behind the chip.
            </p>
            <p>
              The whole dataset is downloadable as JSON and CSV —{" "}
              <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
                open datasets, CC BY 4.0
              </Link>
              .
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. The full table is{" "}
          <Link
            href="/healthkit-identifiers"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            every HealthKit type identifier
          </Link>
          ; the enums that decode a category sample are at{" "}
          <Link
            href="/healthkit-category-values"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            every HKCategoryValue enum
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
