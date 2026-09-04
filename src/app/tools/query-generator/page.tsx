import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import QueryGenerator, { type QueryOption } from "@/components/tools/QueryGenerator";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * HKStatisticsQuery generator.
 *
 * A server shell over the same generated identifier dataset the reference
 * pages render, trimmed to the quantity and category types and handed to the
 * client tool. The aggregation option is read from Apple's prose rather than
 * chosen by the tool, and where Apple's prose does not state it the tool
 * declines to generate at all — which is the whole reason this exists rather
 * than a snippet you copy from a search result.
 */

const PATH = "/tools/query-generator";
const UPDATED = "2026-09-04";
const TITLE = "HealthKit Query Generator";
const DESCRIPTION =
  "Pick a HealthKit quantity type and a window; get the HKStatisticsQuery with the aggregation option Apple's own prose states — or an honest refusal.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const QUANTITY = HK_IDENTIFIERS.filter((r) => r.family === "quantity");
const UNSTATED = QUANTITY.filter((r) => r.aggregation === null);

const ANSWER =
  "Pick one HealthKit quantity type and a time window and this returns the HKStatisticsQuery for it, with the aggregation option taken from what Apple's own documentation says about that type: .cumulativeSum where Apple describes the values as cumulative, .discreteAverage where it describes them as discrete. For the three quantity types Apple never states it for, the tool refuses to generate anything, because the wrong option does not throw — it returns a plausible, wrong number. Category types get a refusal too: a category sample carries an enum case, not a value to aggregate.";

const OPTIONS: QueryOption[] = HK_IDENTIFIERS.filter(
  (r) => r.family === "quantity" || r.family === "category",
).map((r) => ({
  case: r.case,
  family: r.family === "quantity" ? "quantity" : "category",
  group: r.group,
  abstract: r.abstract,
  aggregation: r.aggregation,
  aggregationEvidence: r.aggregationEvidence,
  unitFamily: r.unitFamily,
  valueEnum: r.valueEnum,
}));

export default function QueryGeneratorPage() {
  const url = absoluteUrl(PATH);
  const pageId = `${url}#webpage`;

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: TITLE,
        alternativeHeadline: "hkstatisticsquery example generator",
        description: DESCRIPTION,
        datePublished: UPDATED,
        dateModified: UPDATED,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "HealthKit",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: TITLE,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: UPDATED,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}/opengraph-image` },
      },
    ],
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: TITLE, path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {QUANTITY.length} quantity types, {UNSTATED.length} of them with no aggregation style
          stated · read from Apple&rsquo;s documentation on {HK_FETCHED_ON}
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </p>

        <section data-tool="query-generator" aria-label="HealthKit statistics query generator" className="mt-10">
          <QueryGenerator options={OPTIONS} />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Why the refusal is the feature
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Apple states whether a quantity type accumulates or is measured point-in-time inside the
            type&rsquo;s discussion prose, not as a property you can read at compile time. The
            distinction decides which <code className="font-mono text-sm">HKStatisticsQuery</code>{" "}
            option is correct: cumulative types are summed with{" "}
            <code className="font-mono text-sm">.cumulativeSum</code>, discrete types are reduced
            with <code className="font-mono text-sm">.discreteAverage</code>,{" "}
            <code className="font-mono text-sm">.discreteMin</code> or{" "}
            <code className="font-mono text-sm">.discreteMax</code>.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Pick the wrong one and nothing throws. You get a number, it renders in your UI, and it
            is wrong — a summed week of heart rate reads in the tens of thousands and looks like a
            bug in someone else&rsquo;s code. That is why, for the{" "}
            {UNSTATED.length} quantity types Apple&rsquo;s wording does not cover
            {UNSTATED.length > 0 ? ` — ${UNSTATED.map((r) => r.case).join(", ")} — ` : " "}
            this tool emits nothing at all. A generator that guesses is worse than no generator.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/healthkit-status"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                What Apple leaves undocumented &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — the beta, undocumented and deprecated edges of the catalogue.
              </span>
            </li>
            <li>
              <Link
                href="/healthkit-category-values"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                Every HealthKit category value enum &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — what to read instead when the type is a category type.
              </span>
            </li>
            <li>
              <Link
                href="/healthkit-units"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                HealthKit unit families &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — which <code className="font-mono">HKUnit</code> a type will actually accept.
              </span>
            </li>
            <li>
              <Link
                href="/integrate/healthkit"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                How to integrate Apple HealthKit &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — the guide this query shape comes from, including authorization.
              </span>
            </li>
          </ul>
        </section>

        <details className="mt-12 rounded-xl border border-[var(--border)] p-5">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
            Where this output comes from, and where it runs
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything on this page runs client-side. Your selection never leaves the browser:
              there is no request to a server, nothing is stored, and no health data is involved —
              you are picking a type <em>name</em>, not data.
            </p>
            <p>
              The identifiers, their aggregation style and their unit family are parsed from
              Apple&rsquo;s developer documentation on {HK_FETCHED_ON} and published in full at{" "}
              <Link
                href="/healthkit-identifiers"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                every HealthKit type identifier
              </Link>
              . Aggregation and unit family are the only derived fields in that dataset, and the
              Apple sentence each was derived from is stored beside it — which is the sentence this
              tool quotes back at you under the verdict.
            </p>
            <p>
              The query shape is the one published in the{" "}
              <Link
                href="/integrate/healthkit"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                HealthKit integration guide
              </Link>
              . <code className="font-mono">HKQuantityType(.case)</code> is the iOS 16+ initializer;
              on older targets build the same type with{" "}
              <code className="font-mono">HKObjectType.quantityType(forIdentifier:)</code>.{" "}
              <code className="font-mono">HKUnit.count()</code> is the only unit constructor this
              site has verified, so it is emitted only for count-family types and every other family
              gets a comment naming the family instead of a guessed constructor. Date arithmetic
              beyond <code className="font-mono">Calendar.current.startOfDay(for:)</code> is left to
              you for the same reason — and because{" "}
              <Link
                href="/day-boundaries"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                where a day starts
              </Link>{" "}
              is a decision, not a default. Verify every signature against Apple&rsquo;s current
              documentation before you ship.
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Data read from Apple&rsquo;s published documentation on{" "}
          {HK_FETCHED_ON}; the machine-readable export is on{" "}
          <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
            datasets
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
