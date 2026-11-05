import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import AppleHealthExplorer, { type HkLookup } from "@/components/tools/AppleHealthExplorer";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { hkGroupRowHref, hkIdentifierPagePath } from "@/data/hkIdentifierPages";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * /tools/apple-health-explorer — open an iPhone Health export in the browser
 * (ops/AUDIENCE-30-2026-11-05.md item 12).
 *
 * Fact discipline. Apple's iPhone User Guide (read 2026-11-05) gives the
 * export steps and says the export is XML; it publishes no schema for the
 * file. So this page states what the reader does (which elements and
 * attributes it reads, by name) as the tool's own behavior, not as Apple's
 * format documentation. Type names come from the generated
 * src/data/healthkitIdentifiers.ts (Apple's documentation JSON), and each
 * type links to its identifier page or its group-page row.
 */

const PATH = "/tools/apple-health-explorer";
const UPDATED = "2026-11-05";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Apple Health Export Explorer (No Upload)";
const DESCRIPTION =
  "Open your iPhone Health export.zip or export.xml in the browser: record types, counts, date ranges, sources, a daily chart and CSV per type. No upload.";
const APPLE_GUIDE = "https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/ios";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Read a Health app export on your own computer: every record type with counts and dates, sources and devices, a daily chart, and a CSV per type.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

/** Objective-C constant (as written in export.xml) → name, abstract and site page. */
function buildLookup(): HkLookup {
  const out: HkLookup = {};
  for (const id of HK_IDENTIFIERS) {
    out[id.objc] = {
      name: id.case,
      abstract: id.abstract,
      href: hkIdentifierPagePath(id.case) ?? hkGroupRowHref(id),
      aggregation: id.aggregation,
    };
  }
  return out;
}

export default function AppleHealthExplorerPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "read an iPhone Health export without uploading it",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });
  const lookup = buildLookup();

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Apple Health export explorer", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={7} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Apple Health export explorer
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          This tool opens the file the iPhone Health app makes when you tap Export All Health Data, in your
          browser, without uploading it. Pick the export.zip or the export.xml inside it: a background worker
          reads it in chunks, so a file of hundreds of megabytes does not have to fit in memory, and lists every
          record type with its count, first and last date, units and sources, plus the devices that wrote them,
          a daily chart for the type you pick and a CSV download per type. Each type identifier links to its
          entry in this site&rsquo;s HealthKit reference. A synthetic sample lets you try it with no data of your
          own.
        </p>

        <section data-tool="apple-health-explorer" aria-label="Apple Health export explorer">
          <AppleHealthExplorer lookup={lookup} />
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Making the export</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Apple&rsquo;s{" "}
            <a href={APPLE_GUIDE} className={linkCls} rel="noopener">
              iPhone User Guide
            </a>{" "}
            gives the steps: in the Health app, tap Summary, then your picture or initials, then Export All
            Health Data, and choose a method for sharing. Apple says this exports{" "}
            <q>all of your health and fitness data from Health in XML format</q>. Send it to a computer with whichever sharing method suits you, then open it here. The full how-to, and the equivalents for Health Connect, Garmin, Fitbit,
            Oura and others, is at{" "}
            <Link href="/own-your-data/apple-health-export" className={linkCls}>
              how to export Apple Health data
            </Link>
            .
          </p>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the explorer reads, and what it does not</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Apple&rsquo;s guide says the export is XML and stops there; Apple publishes no schema for the file
            that this site could find. So what follows describes this tool, not Apple&rsquo;s format:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              It reads start tags named <code className="font-mono text-sm">Record</code>,{" "}
              <code className="font-mono text-sm">Workout</code>,{" "}
              <code className="font-mono text-sm">ActivitySummary</code> and{" "}
              <code className="font-mono text-sm">ExportDate</code>, and their attributes by name:{" "}
              <code className="font-mono text-sm">type</code>, <code className="font-mono text-sm">unit</code>,{" "}
              <code className="font-mono text-sm">value</code>, <code className="font-mono text-sm">sourceName</code>,{" "}
              <code className="font-mono text-sm">device</code>, <code className="font-mono text-sm">startDate</code>,{" "}
              <code className="font-mono text-sm">endDate</code>, and for workouts{" "}
              <code className="font-mono text-sm">workoutActivityType</code> and{" "}
              <code className="font-mono text-sm">duration</code>. Every other element is skipped, including the
              one holding date of birth and sex, which is never read.
            </li>
            <li>
              In a ZIP it reads the central directory and inflates only the entry named export.xml, with the
              browser&rsquo;s own DecompressionStream; any other file in the archive is not opened. If your browser cannot unzip in the page, unzip it yourself and pick export.xml.
            </li>
            <li>
              Days are the calendar date written at the start of each record&rsquo;s start time, the day where it
              happened. Nothing is converted to UTC, which would move late-evening samples to the next day.
            </li>
            <li>
              The chart&rsquo;s default comes from Apple&rsquo;s own description of each type in{" "}
              <Link href="/healthkit-identifiers" className={linkCls}>
                the HealthKit identifier reference
              </Link>{" "}
              (read from Apple&rsquo;s documentation on {HK_FETCHED_ON}): a daily total for a type Apple calls
              cumulative, such as steps, and a daily mean for a discrete one, such as heart rate. A daily total adds
              every source, so if a phone and a watch both counted the same walk, both are in it. The type table
              shows how many sources wrote each type, and every CSV row keeps its source so you can filter.
            </li>
            <li>
              Every <code className="font-mono text-sm">Record</code> element is counted where it appears, including
              any nested inside another element.
            </li>
          </ul>
        </section>

        <details className="mt-14 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Nothing is uploaded. The file you pick stays a local file handle: it is passed to a Web Worker in
              this tab, read with <code className="font-mono">Blob.stream()</code>, and reduced to the summary you
              see. A CSV is a second pass over the same local file, built in memory and saved by your browser.
              The page has no server code, stores nothing and logs nothing; reloading discards everything. If the
              browser cannot start the worker, the same code runs on the page itself, slower.
            </p>
            <p>
              The only network request the tool can make is the one you trigger with &ldquo;Try the synthetic
              sample&rdquo;, which downloads{" "}
              <a href="/samples/apple-health-export-synthetic.zip" className={linkCls} download>
                apple-health-export-synthetic.zip
              </a>{" "}
              from this site. It is generated by{" "}
              <code className="font-mono">scripts/build-own-data-samples.mjs</code>{" "}from a fixed seed: 120 days of
              made-up steps, heart rate, sleep stages, weight and workouts from a &ldquo;Synthetic Watch&rdquo;, a{" "}
              &ldquo;Synthetic Phone&rdquo; and a &ldquo;Synthetic Scale App&rdquo;. It is not anyone&rsquo;s data and
              says nothing about real exports beyond using the same element names this reader looks for.
            </p>
            <p>
              The reader is two small modules with no dependencies,{" "}
              <code className="font-mono">src/lib/appleHealthExport.mjs</code> and{" "}
              <code className="font-mono">src/lib/appleHealthRead.mjs</code>, tested in{" "}
              <code className="font-mono">scripts/apple-health-export.test.mjs</code>: a tag split at any chunk
              boundary parses the same, entities decode, the skipped elements stay skipped, and the CSV row count
              matches the summary. For the same job in Python, see the{" "}
              <Link href="/own-your-data#notebooks" className={linkCls}>
                Apple Health notebook
              </Link>
              .
            </p>
          </div>
        </details>

        <p className="mt-8 max-w-3xl text-sm text-[var(--muted)]">
          A free tool from {site.name}. Exporting from every other platform is at{" "}
          <Link href="/own-your-data" className={linkCls}>
            export your own health and fitness data
          </Link>
          . More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
