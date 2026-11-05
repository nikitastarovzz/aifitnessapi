import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import MoreTools from "@/components/tools/MoreTools";
import ToolNextStep from "@/components/ToolNextStep";
import SchemaConverter from "@/components/tools/SchemaConverter";
import { UNIFIED_CONVERTER, UNIFIED_RECORDS, UNIFIED_SCHEMA_FILES, UNIFIED_SLEEP_STAGE_MAPS, UNIFIED_READ_ON } from "@/data/unifiedSchema";
import { buildSamples, SYNTHETIC_NOTE } from "@/lib/converterSamples.mjs";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { CONVERTER_COUNTS, CONVERTER_DESCRIPTION, CONVERTER_TITLE, converterCapsule } from "@/lib/schemaToolsText";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * Paste a platform payload, get unified health-data records
 * (ops/AUDIENCE-30-2026-11-05.md item 2). The converter is
 * src/lib/unifiedConvert.mjs; its lookups come from the generated schema
 * (public/schema/v1/mappings.json, fetched by the page), and its tests are
 * scripts/unified-convert.test.mjs. The samples are built here, on the
 * server, from the same mappings, so their field names are the platforms'.
 */

const PATH = "/tools/schema-converter";

export const metadata: Metadata = {
  title: CONVERTER_TITLE,
  description: CONVERTER_DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: CONVERTER_TITLE,
    description: "Convert HealthKit, Health Connect and Google Health API payloads to one unified schema in the browser, with each field's source and conversion shown.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const SAMPLES = buildSamples({ records: UNIFIED_RECORDS, sleepStageMaps: UNIFIED_SLEEP_STAGE_MAPS, converter: UNIFIED_CONVERTER });
const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-sm";

export default function SchemaConverterPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: CONVERTER_TITLE,
    alternativeHeadline: "HealthKit, Health Connect and Google Health API payloads to one unified schema",
    description: CONVERTER_DESCRIPTION,
    dateModified: UNIFIED_READ_ON,
    webPage: { lastReviewed: UNIFIED_READ_ON },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Schema converter", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={8} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health data schema converter: three platforms in, one shape out
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {converterCapsule()}
        </p>

        <section data-tool="schema-converter" aria-label="Health data schema converter">
          <SchemaConverter samples={SAMPLES} mappingsUrl={UNIFIED_SCHEMA_FILES.mappings} schemaUrl={UNIFIED_SCHEMA_FILES.schema} />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What it reads</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">HealthKit export.xml rows.</strong> <code className={code}>&lt;Record&gt;</code> and{" "}
              <code className={code}>&lt;Workout&gt;</code> start tags from the file the iPhone Health app exports, read with the{" "}
              <Link href="/tools/apple-health-explorer" className={linkCls}>
                Apple Health export explorer
              </Link>
              ’s scanner. Apple does not publish the file’s attribute names, so the converter reads the ones the file carries (type, unit, value,
              startDate, endDate). It maps {CONVERTER_COUNTS.healthkitTypes} type identifiers; sleep rows are grouped into one session.
            </li>
            <li>
              <strong className="text-[var(--fg)]">HealthKit JSON</strong> in the{" "}
              <Link href="/tools/sample-data" className={linkCls}>
                synthetic data generator
              </Link>
              ’s encoding. HealthKit has no JSON wire format, so this is that tool’s documented encoding; a zone name in{" "}
              <code className={code}>HKMetadataKeyTimeZone</code> becomes an offset through your browser’s own time-zone database.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Health Connect records</strong>, keyed by class (<code className={code}>{"{ \"StepsRecord\": [ … ] }"}</code>
              ), in the same generator’s encoding of the Kotlin classes: Instants as ISO 8601, ZoneOffsets as +HH:MM, Mass and Length as{" "}
              <code className={code}>{"{ value, unit }"}</code>. {CONVERTER_COUNTS.healthConnectClasses} classes are mapped.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Google Health API data points</strong>, one (<code className={code}>{"{ \"heartRate\": { … } }"}</code>) or a
              list response (<code className={code}>{"{ \"dataPoints\": [ … ] }"}</code>). int64 values arrive as strings and are parsed; offsets are
              google-duration seconds. {CONVERTER_COUNTS.googleProperties} data types are mapped.
            </li>
            <li>
              <strong className="text-[var(--fg)]">A whole sample-data download</strong>, which the converter recognizes by its <code className={code}>_synthetic</code>{" "}
              block.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What it refuses to guess</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>A HealthKit percent above 1.0: Apple states percent is 0.0 to 1.0, so 97 is either already scaled or wrong, and the converter will not pick.</li>
            <li>A unit with no sourced factor (feet, stone): pounds and inches use the factors Google’s migration guide prints; anything else is refused.</li>
            <li>
              A Google <code className={code}>standardDeviationMilliseconds</code> as SDNN: Google describes it as the deviation of the measurement, so only the
              RMSSD field converts.
            </li>
            <li>A type the schema does not cover: it is listed as not converted, never dropped without a word.</li>
          </ul>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and the samples</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              The page fetches two static files once, the{" "}
              <a href={UNIFIED_SCHEMA_FILES.mappings} className={linkCls}>
                mappings
              </a>{" "}
              and the{" "}
              <a href={UNIFIED_SCHEMA_FILES.schema} className={linkCls}>
                JSON Schema
              </a>
              , and converts in this tab. There is no server code behind it and nothing is stored. Every rule it applies is a cell on the{" "}
              <Link href="/schema" className={linkCls}>
                unified schema page
              </Link>
              , with the platform sentence it rests on.
            </p>
            <p>{SYNTHETIC_NOTE} The type names, field names and enum values in them are read from the mappings when the page is built.</p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. The schema itself, with every mapping and gap, is at{" "}
          <Link href="/schema" className={linkCls}>
            the unified health-data schema
          </Link>
          . More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
        <MoreTools path={PATH} />
        <ToolNextStep path={PATH} />
      </div>
    </Container>
  );
}
