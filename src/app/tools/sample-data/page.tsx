import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import MoreTools from "@/components/tools/MoreTools";
import SampleDataGenerator, { type ClientSpec } from "@/components/tools/SampleDataGenerator";
import * as hk from "@/data/healthkitIdentifiers";
import * as hkMeta from "@/data/healthkitMetadataKeys";
import * as hc from "@/data/healthConnectRecords";
import * as gh from "@/data/googleHealthApi";
import * as wt from "@/data/workoutTypes";
import { buildSampleSpecs, MAX_DAYS, type SamplePlatform, type SampleSpec } from "@/lib/sampleData.mjs";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * Synthetic test-data generator.
 *
 * A thin server shell, like the permission builder: buildSampleSpecs reads the
 * generated datasets at build time and returns one small spec per offered
 * type, and only those specs (minus the reference tables, which render here
 * as HTML) reach the browser. The identifier, record and discovery corpora
 * never ship to the client, and the tool cannot name a field the datasets do
 * not carry — a renamed field fails the build inside buildSampleSpecs.
 */

const PATH = "/tools/sample-data";
const UPDATED = "2026-10-31";
const TITLE = "Synthetic Health Data Generator";
const DESCRIPTION =
  "Seeded synthetic HealthKit, Health Connect and Google Health API test data as JSON or CSV, with field names and UTC offsets from each platform's docs.";

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

const { specs: SPECS, sources: SOURCES } = buildSampleSpecs({ ...hk, ...hkMeta, ...hc, ...gh, ...wt });

const CLIENT_SPECS: ClientSpec[] = SPECS.map(({ fields: _f, omitted: _o, ...rest }) => rest);

const PLATFORM_META: { id: SamplePlatform; name: string; hub: string; hubLabel: string; source: string }[] = [
  {
    id: "healthkit",
    name: "Apple HealthKit",
    hub: "/healthkit-identifiers",
    hubLabel: "every HealthKit type identifier",
    source: `Apple's documentation JSON, read ${SOURCES.healthkit.fetchedOn} (metadata keys ${hkMeta.HK_METADATA_KEYS_FETCHED_ON})`,
  },
  {
    id: "health-connect",
    name: "Android Health Connect",
    hub: "/health-connect",
    hubLabel: "every Health Connect record type",
    source: `Google's Jetpack record references, read ${hc.HC_FETCHED_ON}`,
  },
  {
    id: "google-health-api",
    name: "Google Health API",
    hub: "/google-health-api",
    hubLabel: "the Google Health API reference",
    source: `Google's v4 discovery document (revision ${gh.GHAPI_DISCOVERY.revision}), read ${gh.GHAPI_FETCHED_ON}`,
  },
];

const count = (p: SamplePlatform) => SPECS.filter((s) => s.platform === p).length;

const ANSWER = `Pick a platform, the record types, a date range, a time zone and a seed, and this generates synthetic fixtures in your browser: ${count("healthkit")} HealthKit types, ${count("health-connect")} Health Connect record classes and ${count("google-health-api")} Google Health API data types, downloadable as JSON or CSV. Every field name comes from this site's generated copies of Apple's and Google's own references, and each record carries the UTC offset in force at its own instant, so a range across a daylight-saving change produces records whose start and end offsets differ. The values are synthetic and illustrative, not real or physiologically validated.`;

/** Types a reader will look for and not find, with the reason in the dataset's terms. */
const SKIPPED: Record<SamplePlatform, { name: string; reason: string }[]> = {
  healthkit: [
    {
      name: "HKCategoryTypeIdentifierSleepAnalysis",
      reason:
        "a category sample is decoded by HKCategoryValueSleepAnalysis, and the identifier dataset names that enum but not its cases, so there is no value this tool could write without inventing one.",
    },
    {
      name: "HKQuantityTypeIdentifierOxygenSaturation",
      reason:
        "Apple's prose puts it in the percent family but does not state the scale a percent quantity is written in, and a fixture that guesses 0–1 against 0–100 is wrong by a factor of a hundred.",
    },
    {
      name: "HKWorkout's duration, energy and distance",
      reason: "HKWorkout's own properties are not in this site's generated datasets; workouts carry an activity type and an interval only.",
    },
  ],
  "health-connect": [
    {
      name: "HeartRateRecord (and the other Series records)",
      reason:
        "a series record holds a list of HeartRateRecord.Sample, and the dataset carries that nested class's name and one-line description but not its fields. Resting heart rate, an instantaneous record with a stated field, is offered instead.",
    },
    {
      name: "SleepSessionRecord stages",
      reason:
        "the STAGE_TYPE_* constants are in the dataset, but SleepSessionRecord.Stage's fields are not, so sessions are written with stages = [], the constructor's own default.",
    },
    {
      name: "Metadata",
      reason: "every constructor requires one, but Metadata's fields are not in the dataset, so it is left out of every record.",
    },
  ],
  "google-health-api": [
    {
      name: "civilStartTime, civilEndTime, civilTime",
      reason: "the discovery document marks them Output only — the server computes them from the instant and the offset, so a fixture you send should not carry them.",
    },
    {
      name: "the DataPoint wrapper (name, dataSource)",
      reason: "only the data-type member of DataPoint's union is generated; the wrapper's schema is not in this site's extract.",
    },
  ],
};

function SpecTable({ spec }: { spec: SampleSpec }) {
  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] p-4">
      <h4 className="text-sm font-bold text-[var(--fg)]">
        {spec.label} ·{" "}
        {spec.docUrl ? (
          <a href={spec.docUrl} className="font-mono font-medium text-brand-600 hover:text-brand-500" rel="noopener">
            {spec.typeLabel}
          </a>
        ) : (
          <span className="font-mono">{spec.typeLabel}</span>
        )}
      </h4>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[var(--muted)]">
            <tr>
              <th className="py-1 pr-3 font-semibold">Field</th>
              <th className="py-1 pr-3 font-semibold">Type, as the source prints it</th>
              <th className="py-1 font-semibold">How it is written</th>
            </tr>
          </thead>
          <tbody className="align-top text-[var(--fg)]">
            {spec.fields.map((f) => (
              <tr key={f.name} className="border-t border-[var(--border)]">
                <td className="py-1 pr-3 font-mono">{f.name}</td>
                <td className="py-1 pr-3 font-mono">{f.type}</td>
                <td className="py-1 text-[var(--muted)]">{f.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {spec.omitted.length > 0 ? (
        <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
          {spec.omitted.map((o) => (
            <li key={o.name}>
              <span className="font-semibold text-[var(--fg)]">Not generated: </span>
              <span className="font-mono">{o.name}</span> — {o.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const A = "font-medium text-brand-600 hover:text-brand-500";

export default function SampleDataPage() {
  const graphJsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "healthkit health connect google health api test data generator",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: TITLE, path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{TITLE}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {SPECS.length} types across three platforms · shapes read from HealthKit ({hk.HK_FETCHED_ON}), Health
          Connect ({hc.HC_FETCHED_ON}) and Google Health API ({gh.GHAPI_FETCHED_ON}) sources · synthetic values only
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </p>

        <section data-tool="sample-data" aria-label="Synthetic health data generator" className="mt-10">
          <SampleDataGenerator specs={CLIENT_SPECS} maxDays={MAX_DAYS} />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Time zones are the part fixtures get wrong</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The three platforms record the user&rsquo;s zone three different ways, and the generator writes each
            one the way its own reference describes. <strong className="text-[var(--fg)]">Health Connect</strong>{" "}
            puts a nullable <code className="font-mono text-sm">ZoneOffset?</code> beside every{" "}
            <code className="font-mono text-sm">Instant</code> (<code className="font-mono text-sm">startZoneOffset</code>,{" "}
            <code className="font-mono text-sm">endZoneOffset</code>, or <code className="font-mono text-sm">zoneOffset</code>{" "}
            on an instantaneous record), and you can untick offsets to get the null case.{" "}
            <strong className="text-[var(--fg)]">The Google Health API</strong> marks{" "}
            <code className="font-mono text-sm">startUtcOffset</code>, <code className="font-mono text-sm">endUtcOffset</code>{" "}
            and <code className="font-mono text-sm">utcOffset</code> Required, written as a duration in seconds the way
            Google’s own list example prints <code className="font-mono text-sm">&quot;0s&quot;</code>; its Daily
            types are keyed by a civil <code className="font-mono text-sm">Date</code> instead.{" "}
            <strong className="text-[var(--fg)]">HealthKit</strong> stores absolute dates and carries the zone only as
            optional metadata: Apple documents <code className="font-mono text-sm">HKMetadataKeyTimeZone</code> as
            “{hkMeta.HK_METADATA_KEYS.find((k) => k.swiftName === "HKMetadataKeyTimeZone")?.valueTypeEvidence}”
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Each offset is resolved for its own record&rsquo;s instant through your browser&rsquo;s time-zone
            database, never once per file. The default range, 31 October to 2 November 2026 in New York, crosses the
            end of daylight saving time, so the night of 31 October starts at −04:00 and ends at −05:00. That is the
            record that breaks a &ldquo;today&rdquo; computed as a fixed UTC window; the{" "}
            <Link href="/day-boundaries" className={A}>
              day-boundary demo
            </Link>{" "}
            shows why, and the{" "}
            <Link href="/cookbook/day-boundary-rollup" className={A}>
              day-boundary rollup recipe
            </Link>{" "}
            is tested code that handles it.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What each type is built from</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Neither HealthKit nor Health Connect has a JSON wire format; both are native APIs. For those two the file
            is this tool&rsquo;s JSON encoding of the native object, with the field names the reference uses and every
            encoding choice stated in the table and in the file&rsquo;s <code className="font-mono text-sm">_synthetic</code>{" "}
            block. The Google Health API is a REST API, so its file is shaped like the list method&rsquo;s response.
          </p>
          {PLATFORM_META.map((p) => (
            <div key={p.id} className="mt-8">
              <h3 className="text-lg font-bold text-[var(--fg)]">{p.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                From {p.source}; the full set is on{" "}
                <Link href={p.hub} className={A}>
                  {p.hubLabel}
                </Link>
                .
              </p>
              {SPECS.filter((s) => s.platform === p.id).map((s) => (
                <SpecTable key={s.typeName} spec={s} />
              ))}
              <h4 className="mt-5 text-sm font-bold text-[var(--fg)]">Not offered, and why</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                {SKIPPED[p.id].map((k) => (
                  <li key={k.name}>
                    <span className="font-mono text-[var(--fg)]">{k.name}</span>: {k.reason}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
            Workout activities are six of the ones the{" "}
            <Link href="/workout-types" className={A}>
              workout-type crosswalk
            </Link>{" "}
            names identically on all three platforms (read {SOURCES.workouts.fetchedOn}), so the same seed gives the same
            activity on each. Heart rate variability is generated from one stream but labelled per platform: HealthKit
            stores SDNN and Health Connect and Google store RMSSD, and the{" "}
            <Link href="/matrix" className={A}>
              cross-platform matrix
            </Link>{" "}
            explains why those are not interconvertible — do not read the synthetic numbers as a conversion.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The values are synthetic</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Every number is drawn from a seeded generator inside a conservative, illustrative range — hourly steps
            between 0 and 900 over waking hours, heart rate between about 50 and 90 bpm, nights of six and a half to eight and a
            half hours — and then dropped if it falls outside the validation range the platform&rsquo;s reference
            states. That is why a Health Connect file has fewer step records than the Google one for the same seed:
            Google allows a count of 0, and <code className="font-mono text-sm">StepsRecord</code>&rsquo;s count starts
            at 1. None of it is real data, none of it is physiologically validated, and it is not fit for research or
            clinical use. Use it to exercise parsing, storage, rollups and edge cases.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            For loading fixtures into a running app, see{" "}
            <Link href="/test/health-connect-test-data" className={A}>
              Health Connect test data
            </Link>
            ,{" "}
            <Link href="/test/healthkit-integration" className={A}>
              testing a HealthKit integration
            </Link>{" "}
            and{" "}
            <Link href="/test/mock-wearable-data" className={A}>
              mocking wearable data
            </Link>{" "}
            in the{" "}
            <Link href="/test" className={A}>
              testing guides
            </Link>
            ; the{" "}
            <Link href="/cookbook/dedupe-health-samples" className={A}>
              deduplication recipe
            </Link>{" "}
            is a good first consumer of a generated file.
          </p>
        </section>

        <details className="mt-12 rounded-xl border border-[var(--border)] p-5">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
            Where this output comes from, and where it runs
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything runs client-side. The generator loads when you first press Generate, builds the files in
              your browser and hands them to the download; nothing is sent to a server and nothing is stored.
            </p>
            <p>
              The type names, field names, Kotlin and discovery types, validation ranges, enum values and
              constructor signatures are read at build time from this site&rsquo;s generated datasets — the same
              ones behind{" "}
              <Link href="/healthkit-identifiers" className={A}>
                the HealthKit identifiers
              </Link>
              ,{" "}
              <Link href="/healthkit-metadata-keys" className={A}>
                the metadata keys
              </Link>
              ,{" "}
              <Link href="/health-connect" className={A}>
                the Health Connect records
              </Link>{" "}
              and{" "}
              <Link href="/google-health-api" className={A}>
                the Google Health API reference
              </Link>
              . If a regeneration renames a field this tool writes, the build fails rather than shipping a fixture
              with a stale name. Units in HealthKit files are this tool&rsquo;s choice inside the family Apple
              states; see{" "}
              <Link href="/healthkit-units" className={A}>
                HealthKit unit families
              </Link>{" "}
              before you build an <code className="font-mono">HKUnit</code>.
            </p>
            <p>
              The same seed and settings give the same file, provided the browser&rsquo;s time-zone rules agree.
              The offsets come from the browser&rsquo;s own tz database, so a zone whose rules changed recently can
              differ between an old browser and a new one.
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Shapes read from the vendors&rsquo; published references; the machine-readable
          exports of those references are on{" "}
          <Link href="/datasets" className={A}>
            datasets
          </Link>
          .
        </p>

        <MoreTools path={PATH} />
      </div>
    </Container>
  );
}
