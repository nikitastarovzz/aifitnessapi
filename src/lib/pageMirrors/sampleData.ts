import * as hk from "@/data/healthkitIdentifiers";
import * as hkMeta from "@/data/healthkitMetadataKeys";
import * as hc from "@/data/healthConnectRecords";
import * as gh from "@/data/googleHealthApi";
import { ANSWER, PLATFORM_META, SKIPPED, SOURCES, SPECS } from "@/lib/sampleDataPage";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, table, type MirrorDoc } from "./core";

const PATH = "/tools/sample-data";
const UPDATED = "2026-10-31";

/** /tools/sample-data.md — mirrors src/app/tools/sample-data/page.tsx, with every
 *  type's field table from the same specs the generator runs on. */
export function sampleDataMirror(): MirrorDoc {
  const tzEvidence = hkMeta.HK_METADATA_KEYS.find((k) => k.swiftName === "HKMetadataKeyTimeZone")?.valueTypeEvidence;
  const platforms = PLATFORM_META.flatMap((p) => [
    `### ${p.name}`,
    "",
    `From ${p.source}; the full set is on ${link(p.hubLabel, p.hub)}.`,
    "",
    ...SPECS.filter((s) => s.platform === p.id).flatMap((s) => [
      `#### ${s.label} · ${s.docUrl ? link(s.typeLabel, s.docUrl) : s.typeLabel}`,
      "",
      ...table(["Field", "Type, as the source prints it", "How it is written"], s.fields.map((f) => [f.name, f.type, f.note])),
      ...s.omitted.map((o) => `- Not generated: ${o.name} — ${o.reason}`),
      "",
    ]),
    "#### Not offered, and why",
    "",
    ...SKIPPED[p.id].map((k) => `- ${k.name}: ${k.reason}`),
    "",
  ]);

  return {
    path: PATH,
    title: "Synthetic Health Data Generator",
    description:
      "Seeded synthetic HealthKit, Health Connect and Google Health API test data as JSON or CSV, with field names and UTC offsets from each platform's docs.",
    updated: UPDATED,
    type: "tool",
    capsule: ANSWER,
    body: [
      `${SPECS.length} types across three platforms · shapes read from HealthKit (${hk.HK_FETCHED_ON}), Health Connect (${hc.HC_FETCHED_ON}) and Google Health API (${gh.GHAPI_FETCHED_ON}) sources · synthetic values only`,
      "",
      interactiveNote(PATH, "the fixture generator"),
      "",
      "## Time zones are the part fixtures get wrong",
      "",
      `The three platforms record the user’s zone three different ways, and the generator writes each one the way its own reference describes. **Health Connect** puts a nullable \`ZoneOffset?\` beside every \`Instant\` (\`startZoneOffset\`, \`endZoneOffset\`, or \`zoneOffset\` on an instantaneous record), and you can untick offsets to get the null case. **The Google Health API** marks \`startUtcOffset\`, \`endUtcOffset\` and \`utcOffset\` Required, written as a duration in seconds the way Google’s own list example prints \`"0s"\`; its Daily types are keyed by a civil \`Date\` instead. **HealthKit** stores absolute dates and carries the zone only as optional metadata: Apple documents \`HKMetadataKeyTimeZone\` as “${tzEvidence ?? ""}”`,
      "",
      `Each offset is resolved for its own record’s instant through your browser’s time-zone database, never once per file. The default range, 31 October to 2 November 2026 in New York, crosses the end of daylight saving time, so the night of 31 October starts at −04:00 and ends at −05:00. That is the record that breaks a “today” computed as a fixed UTC window; the ${link("day-boundary demo", "/day-boundaries")} shows why, and the ${link("day-boundary rollup recipe", "/cookbook/day-boundary-rollup")} is tested code that handles it.`,
      "",
      "## What each type is built from",
      "",
      "Neither HealthKit nor Health Connect has a JSON wire format; both are native APIs. For those two the file is this tool’s JSON encoding of the native object, with the field names the reference uses and every encoding choice stated in the table and in the file’s `_synthetic` block. The Google Health API is a REST API, so its file is shaped like the list method’s response.",
      "",
      ...platforms,
      `Workout activities are six of the ones the ${link("workout-type crosswalk", "/workout-types")} names identically on all three platforms (read ${SOURCES.workouts.fetchedOn}), so the same seed gives the same activity on each. Heart rate variability is generated from one stream but labeled per platform: HealthKit stores SDNN and Health Connect and Google store RMSSD, and the ${link("cross-platform matrix", "/matrix")} explains why those are not interconvertible — do not read the synthetic numbers as a conversion.`,
      "",
      "## The values are synthetic",
      "",
      "Every number is drawn from a seeded generator inside a conservative, illustrative range — hourly steps between 0 and 900 over waking hours, heart rate between about 50 and 90 bpm, nights of six and a half to eight and a half hours — and then dropped if it falls outside the validation range the platform’s reference states. That is why a Health Connect file has fewer step records than the Google one for the same seed: Google allows a count of 0, and `StepsRecord`’s count starts at 1. None of it is real data, none of it is physiologically validated, and it is not fit for research or clinical use. Use it to exercise parsing, storage, rollups and edge cases.",
      "",
      `For loading fixtures into a running app, see ${link("Health Connect test data", "/test/health-connect-test-data")}, ${link("testing a HealthKit integration", "/test/healthkit-integration")} and ${link("mocking wearable data", "/test/mock-wearable-data")} in the ${link("testing guides", "/test")}; the ${link("deduplication recipe", "/cookbook/dedupe-health-samples")} is a good first consumer of a generated file.`,
      "",
      "## Where this output comes from, and where it runs",
      "",
      "Everything runs client-side. The generator loads when you first press Generate, builds the files in your browser and hands them to the download; nothing is sent to a server and nothing is stored.",
      "",
      `The type names, field names, Kotlin and discovery types, validation ranges, enum values and constructor signatures are read at build time from this site’s generated datasets — the same ones behind ${link("the HealthKit identifiers", "/healthkit-identifiers")}, ${link("the metadata keys", "/healthkit-metadata-keys")}, ${link("the Health Connect records", "/health-connect")} and ${link("the Google Health API reference", "/google-health-api")}. If a regeneration renames a field this tool writes, the build fails rather than shipping a fixture with a stale name. Units in HealthKit files are this tool’s choice inside the family Apple states; see ${link("HealthKit unit families", "/healthkit-units")} before you build an \`HKUnit\`.`,
      "",
      "The same seed and settings give the same file, provided the browser’s time-zone rules agree. The offsets come from the browser’s own tz database, so a zone whose rules changed recently can differ between an old browser and a new one.",
      "",
      `A free tool from ${site.name}. Shapes read from the vendors’ published references; the machine-readable exports of those references are on ${link("datasets", "/datasets")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
