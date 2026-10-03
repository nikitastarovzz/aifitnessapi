import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import CodeBlock from "@/components/CodeBlock";
import { HC_CATEGORIES, HC_FETCHED_ON, HC_DATA_TYPES_URL } from "@/data/healthConnectRecords";
import {
  HC_BASE,
  HC_AGGREGATES_PATH,
  HC_PUBLISHED,
  hcModified,
  recordsInCategory,
  orderedRecords,
  recordPath,
  aggregateAnchor,
  categorySlug,
  hcTotals,
  GUIDE_QUOTES,
  READ_DATA_GUIDE,
} from "@/data/hcPages";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

/**
 * Every AggregateMetric constant across the Health Connect record classes,
 * with Google's description and the value type from Google's own
 * AggregateMetric<T> signature. The one table that answers "is there a
 * metric for X, and what comes back".
 */

const T = hcTotals();
const PATH = HC_AGGREGATES_PATH;
const TITLE = "Health Connect Aggregate Metrics: Every AggregateMetric";
const DESCRIPTION = `All ${T.aggregates} Health Connect aggregate metrics (StepsRecord.COUNT_TOTAL, HeartRateRecord.BPM_AVG…) with Google's description and value type.`;
const META_TITLE = TITLE;

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: META_TITLE,
    description: DESCRIPTION,
    url: PATH,
    publishedTime: HC_PUBLISHED,
    modifiedTime: hcModified(),
  },
  twitter: { card: "summary_large_image", title: META_TITLE, description: DESCRIPTION },
};

const SNIPPET = `val response = healthConnectClient.aggregate(
    AggregateRequest(
        metrics = setOf(StepsRecord.COUNT_TOTAL, HeartRateRecord.BPM_AVG),
        timeRangeFilter = TimeRangeFilter.between(startTime, endTime),
    )
)
// get() is declared as returning T? — nullable.
val steps: Long? = response[StepsRecord.COUNT_TOTAL]
val avgBpm: Long? = response[HeartRateRecord.BPM_AVG]`;

function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-[13px] text-[var(--fg)]">{children}</code>;
}

export default function HcAggregatesPage() {
  const url = absoluteUrl(PATH);
  const pageId = `${url}#webpage`;
  const faqId = (i: number) => `faq-${i + 1}`;
  const records = orderedRecords();
  const without = records.filter((r) => r.aggregateMetrics.length === 0);
  const byType = new Map<string, number>();
  for (const r of records) for (const a of r.aggregateMetrics) byType.set(a.valueType, (byType.get(a.valueType) ?? 0) + 1);
  const types = [...byType.entries()].sort((a, b) => b[1] - a[1]);
  const hr = records.find((r) => r.className === "HeartRateRecord");
  const steps = records.find((r) => r.className === "StepsRecord");
  const bpmAvg = hr?.aggregateMetrics.find((a) => a.name === "BPM_AVG");
  const countTotal = steps?.aggregateMetrics.find((a) => a.name === "COUNT_TOTAL");
  const nutrition = records.find((r) => r.className === "NutritionRecord");

  const faqs: { q: string; a: string }[] = [
    {
      q: "Which Health Connect records have no aggregate metrics?",
      a: `As read on ${HC_FETCHED_ON}, Google's Jetpack reference defines no AggregateMetric constants on ${without.length} of the ${T.records} record classes: ${without
        .map((r) => r.className)
        .join(", ")}. Read those with readRecords and summarise them yourself.`,
    },
    {
      q: "What value types do Health Connect aggregate metrics return?",
      a: `The T in each metric's AggregateMetric<T> signature. Across the ${T.aggregates} metrics: ${types
        .map(([t, n]) => `${n} ${t}`)
        .join(", ")}. Types such as Energy, Mass, Length or Duration are objects, not bare numbers — Google's data-types table links the unit ones to classes in androidx.health.connect.client.units.`,
    },
    {
      q: "Why does AggregationResult return null for a metric?",
      a: "Because Google's AggregationResult reference declares the get operator as returning T? (nullable), so the type system makes you handle a missing value. Google's own steps example in the read-data guide falls back with ?: 0L; whether zero is the right fallback for an average or a maximum is a decision for your app.",
    },
  ];
  const most = [...records].sort((a, b) => b.aggregateMetrics.length - a.aggregateMetrics.length)[0];
  if (nutrition?.aggregateMetrics.length) {
    faqs.push({
      q: "How many aggregate metrics does NutritionRecord have?",
      a: `${nutrition.aggregateMetrics.length}${most?.className === "NutritionRecord" ? ", more than any other record" : ""} — from ${
        nutrition.aggregateMetrics[0].name
      } to ${nutrition.aggregateMetrics[nutrition.aggregateMetrics.length - 1].name}. Google describes each one as the metric identifier to retrieve "the total" of that nutrient from the AggregationResult.`,
    });
  }

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: "Every Health Connect aggregate metric",
        alternativeHeadline: "Health Connect AggregateMetric constants",
        description: DESCRIPTION,
        datePublished: HC_PUBLISHED,
        dateModified: hcModified(),
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "Health Connect reference",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        citation: [
          { "@type": "TechArticle", url: HC_DATA_TYPES_URL, name: "Google — Health Connect data types" },
          { "@type": "TechArticle", url: READ_DATA_GUIDE, name: "Google — Read raw data" },
          {
            "@type": "TechArticle",
            url: "https://developer.android.com/reference/kotlin/androidx/health/connect/client/aggregate/AggregationResult",
            name: "Google — AggregationResult",
          },
        ],
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: META_TITLE,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: HC_FETCHED_ON,
        reviewedBy: orgRef(),
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#${faqId(i)}`,
      url: `${url}#${faqId(i)}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Health Connect", path: HC_BASE },
            { name: "Aggregate metrics", path: PATH },
          ]}
        />
        <ClusterHero label="Health Connect reference" seed={stringSeed("health-connect-aggregates")} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Every Health Connect aggregate metric
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {T.aggregates} metrics on {T.recordsWithAggregates} records · read from Google&rsquo;s Jetpack reference on{" "}
          {HC_FETCHED_ON}
          <ContentAge date={HC_FETCHED_ON} />
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Health Connect aggregates through companion constants of type <Code>{"AggregateMetric<T>"}</Code> on each record
          class — {countTotal ? <Code>StepsRecord.COUNT_TOTAL</Code> : null}
          {countTotal && bpmAvg ? ", " : null}
          {bpmAvg ? <Code>HeartRateRecord.BPM_AVG</Code> : null} and {T.aggregates - (countTotal ? 1 : 0) - (bpmAvg ? 1 : 0)}{" "}
          more across {T.recordsWithAggregates} of the {T.records} records. Pass them in an <Code>AggregateRequest</Code> and
          read each back from the <Code>AggregationResult</Code>; Google&rsquo;s guide says the aggregation API also handles
          duplicate records.
        </p>

        <figure className="mt-8">
          <figcaption className="mb-2 text-xs uppercase tracking-wide text-[var(--muted)]">Kotlin — two metrics, one request</figcaption>
          <CodeBlock raw={SNIPPET}>
            <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[13px] leading-relaxed">
              <code>{SNIPPET}</code>
            </pre>
          </CodeBlock>
        </figure>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Google&rsquo;s{" "}
          <a href={READ_DATA_GUIDE} className="text-brand-600 hover:text-brand-500" rel="noopener">
            read-data guide
          </a>
          : &ldquo;{GUIDE_QUOTES.aggregateOverRead.text}&rdquo; and &ldquo;{GUIDE_QUOTES.dedup.text}&rdquo;
        </p>

        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2 text-sm">
          {HC_CATEGORIES.map((c) => {
            const n = recordsInCategory(c.name).reduce((k, r) => k + r.aggregateMetrics.length, 0);
            if (!n) return null;
            return (
              <a
                key={c.name}
                href={`#${categorySlug(c.name)}`}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
              >
                {c.name} <span className="font-semibold tabular-nums text-[var(--fg)]">{n}</span>
              </a>
            );
          })}
        </nav>

        {HC_CATEGORIES.map((c) => {
          const rs = recordsInCategory(c.name).filter((r) => r.aggregateMetrics.length);
          if (!rs.length) return null;
          return (
            <section key={c.name} id={categorySlug(c.name)} className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{c.name}</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                      <th scope="col" className="py-2 pr-4 font-semibold">Metric</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Value type</th>
                      <th scope="col" className="py-2 font-semibold">Google&rsquo;s description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rs.flatMap((r) =>
                      r.aggregateMetrics.map((a) => (
                        <tr
                          key={`${r.className}.${a.name}`}
                          id={aggregateAnchor(r.className, a.name)}
                          data-hc-metric={`${r.className}.${a.name}`}
                          className="scroll-mt-24 border-b border-[var(--border)] align-top"
                        >
                          <td className="py-2 pr-4">
                            <Link href={`${recordPath(r)}#aggregate`} className="break-all font-mono text-[13px] text-brand-600 hover:text-brand-500">
                              {r.className}.{a.name}
                            </Link>
                          </td>
                          <td className="py-2 pr-4">
                            <Code>{a.valueType}</Code>
                          </td>
                          <td className="py-2 text-[var(--muted)]">{a.description ?? <em>Google gives no description.</em>}</td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="Subscribe and we'll tell you when Google adds a Health Connect aggregate metric, with its value type."
          source="spoke-inline"
          id="cta-hc-aggregates"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Metric names, value types and descriptions are copied from each record&rsquo;s Jetpack reference page, read{" "}
          {HC_FETCHED_ON} by {site.name}&rsquo;s generator; Google&rsquo;s{" "}
          <a href={HC_DATA_TYPES_URL} className="text-brand-600 hover:text-brand-500" rel="noopener">
            data-types table
          </a>{" "}
          lists the same set. Every record is on the{" "}
          <Link href={HC_BASE} className="font-medium text-brand-600 hover:text-brand-500">
            Health Connect reference
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
