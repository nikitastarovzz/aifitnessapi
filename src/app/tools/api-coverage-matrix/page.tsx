import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import MoreTools from "@/components/tools/MoreTools";
import ToolNextStep from "@/components/ToolNextStep";
import CoverageMatrix from "@/components/tools/CoverageMatrix";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";
import {
  ALL_COVERAGE_VENDORS,
  COVERAGE_CHECKED,
  COVERAGE_PATH,
  COVERAGE_UPDATED,
  RATE_LIMIT_PATH,
  coverageCapsule,
} from "@/lib/coverageView";

/**
 * Which wearable and fitness APIs document which metrics — the vendor-side
 * companion to /matrix, which pairs HealthKit and Health Connect type
 * identifiers and owns that question. This page owns "which vendor API exposes
 * metric X, at what resolution, how far back, pushed or pulled", and links
 * /matrix for the platform type names rather than repeating them.
 *
 * Every mark comes from lib/vendorCoverage.mjs (quotes copied from the
 * integration guides' evidence files, checked by scripts/api-coverage.test.mjs
 * and qa's COVERAGE-EVIDENCE gate) or, for the Google Health API, from the
 * generated src/data/googleHealthApi.ts. Nothing is inferred from silence:
 * a metric no page we read mentions is "?" and links the guide.
 */

const TITLE = "Wearable API Coverage Matrix by Metric";
const DESCRIPTION =
  "Which wearable and fitness APIs document heart rate, HRV, sleep, SpO2, glucose and more, at what resolution, how far back, and by webhook or pull. Sourced.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(COVERAGE_PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Fourteen wearable and fitness APIs by thirteen metrics: every mark linked to the vendor page that states it, unknown where no page says.",
    url: COVERAGE_PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function ApiCoverageMatrixPage() {
  const jsonLd = toolGraph({
    path: COVERAGE_PATH,
    name: TITLE,
    alternativeHeadline: "which wearable APIs expose which health metrics",
    description: DESCRIPTION,
    datePublished: COVERAGE_UPDATED,
    dateModified: COVERAGE_UPDATED,
    webPage: { lastReviewed: COVERAGE_UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "API coverage matrix", path: COVERAGE_PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={9} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Which wearable APIs expose which metrics
        </h1>

        <p id="answer" className="speakable mt-4 max-w-3xl leading-relaxed text-[var(--muted)]">
          {coverageCapsule()}
        </p>

        <section data-tool="api-coverage-matrix" aria-label="Wearable API coverage matrix">
          <CoverageMatrix vendors={ALL_COVERAGE_VENDORS} checked={COVERAGE_CHECKED} />
        </section>

        <div className="mx-auto max-w-3xl">
          <section className="mt-14" aria-labelledby="read">
            <h2 id="read" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              How to read it
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
              <li>
                A ✓ means the vendor&rsquo;s own page names the metric; it links that page, and the vendor&rsquo;s
                words are in the card below the table. It says nothing about which devices record it or which plan
                unlocks it: Oura&rsquo;s SpO2 is Gen 3 only, Garmin&rsquo;s beat-to-beat interval is an Enterprise
                item, and COROS&rsquo;s daily metrics come through its MCP rather than the Partner API.
              </li>
              <li>
                A ? means none of the pages read for that vendor&rsquo;s{" "}
                <Link href="/integrate" className={linkCls}>
                  integration guide
                </Link>{" "}
                mentions it. The vendor may well offer it; this table will not say so until a page does.
              </li>
              <li>
                Resolution is shown only where the vendor states an interval or grouping, such as Oura&rsquo;s and
                Polar&rsquo;s 5-minute heart rate or the storage resolution in Google&rsquo;s data-types table. A
                daily summary and a per-second stream are not interchangeable, so check the cell before you plan a
                chart.
              </li>
              <li>
                History is the most volatile column and the least documented: Polar returns 28 or 30 days, Garmin
                Starter none, COROS three months, Dexcom 30 days per request; several vendors state no depth at all.
              </li>
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="platforms">
            <h2 id="platforms" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              HealthKit and Health Connect
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              The two on-device stores are not columns here: your app reads them on the phone, and the question
              there is which type identifier to ask for, which is the{" "}
              <Link href="/matrix" className={linkCls}>
                HealthKit ↔ Health Connect type reference
              </Link>
              . Each metric chip above maps to a row there where one exists. How hard you can call each cloud API
              is a separate question, answered by the{" "}
              <Link href={RATE_LIMIT_PATH} className={linkCls}>
                rate-limit calculator
              </Link>
              .
            </p>
          </section>

          <section className="mt-14" aria-labelledby="built">
            <h2 id="built" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              How this is built
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
              <li>
                Every mark, delivery note and history note quotes a vendor page already cited by that vendor&rsquo;s
                integration guide, copied from the guide&rsquo;s evidence file. A test fails the build if a quote is
                not in that file under the same URL, and a weekly job re-checks the evidence against the live pages.
              </li>
              <li>
                The Google Health API column is built from Google&rsquo;s data-types table as the site&rsquo;s
                generator last fetched it, so its resolution and webhook flags are Google&rsquo;s, row by row.
              </li>
              <li>
                The &ldquo;sources read&rdquo; date on each card is the date its guide was last verified. The Fitbit
                Web API is not listed: Google&rsquo;s timeline sets its turn-off for November 2, 2026, with the
                Google Health API as its successor.
              </li>
            </ul>
          </section>

          <p className="mt-8 text-sm text-[var(--muted)]">
            A free tool from {site.name}. Comparing two APIs on access and cost instead:{" "}
            <Link href="/compare-apis" className={linkCls}>
              compare two fitness APIs side by side
            </Link>
            . More at{" "}
            <Link href="/tools" className={linkCls}>
              free tools for health-app builders
            </Link>
            .
          </p>

          <MoreTools path={COVERAGE_PATH} />
          <ToolNextStep path={COVERAGE_PATH} />
        </div>
      </div>
    </Container>
  );
}
