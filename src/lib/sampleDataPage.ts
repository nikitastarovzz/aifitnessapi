import * as hk from "@/data/healthkitIdentifiers";
import * as hkMeta from "@/data/healthkitMetadataKeys";
import * as hc from "@/data/healthConnectRecords";
import * as gh from "@/data/googleHealthApi";
import * as wt from "@/data/workoutTypes";
import { buildSampleSpecs, type SamplePlatform } from "@/lib/sampleData.mjs";

/**
 * The server-side copy of /tools/sample-data: the specs the generator is built
 * from and the prose that describes them. Shared by the page and its markdown
 * mirror (src/lib/pageMirrors/sampleData.ts) so the two cannot describe
 * different fixtures.
 */
export const { specs: SPECS, sources: SOURCES } = buildSampleSpecs({ ...hk, ...hkMeta, ...hc, ...gh, ...wt });


export const PLATFORM_META: { id: SamplePlatform; name: string; hub: string; hubLabel: string; source: string }[] = [
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

export const ANSWER = `Pick a platform, the record types, a date range, a time zone and a seed, and this generates synthetic fixtures in your browser: ${count("healthkit")} HealthKit types, ${count("health-connect")} Health Connect record classes and ${count("google-health-api")} Google Health API data types, downloadable as JSON or CSV. Every field name comes from this site's generated copies of Apple's and Google's own references, and each record carries the UTC offset in force at its own instant, so a range across a daylight-saving change produces records whose start and end offsets differ. The values are synthetic and illustrative, not real or physiologically validated.`;

/** Types a reader will look for and not find, with the reason in the dataset's terms. */
export const SKIPPED: Record<SamplePlatform, { name: string; reason: string }[]> = {
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

