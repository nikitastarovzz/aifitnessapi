/** Assertions on the published contract, not just on it loading. */
import * as m from "./src/index.js";
let fail = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : ` — got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
};

// Apple's docs JSON listed 241 identifiers on 2026-10-02 (heartRateVariabilityRMSSD
// added in iOS 27.0); move with a re-bundle of a regenerated dataset only.
eq("241 identifiers", m.healthkitIdentifiers.length, 241);
eq("cumulative -> cumulativeSum", m.aggregationFor("stepCount"), "cumulativeSum");
eq("discrete -> discrete", m.aggregationFor("heartRate"), "discrete");
eq("category type has no aggregation", m.aggregationFor("sleepAnalysis"), null);
eq("workout activity has no aggregation", m.aggregationFor("running"), null);
eq("unknown name is null, not a guess", m.aggregationFor("stepCounts"), null);
eq("unknown lookup is undefined", m.healthkitIdentifier("nope"), undefined);
eq("objc constant resolves", m.healthkitIdentifier("HKQuantityTypeIdentifierStepCount")?.identifier, "stepCount");
eq("category carries its value enum", m.healthkitIdentifier("sleepAnalysis")?.valueEnum, "HKCategoryValueSleepAnalysis");
eq("quantity carries no value enum", m.healthkitIdentifier("stepCount")?.valueEnum, null);
eq("cross-platform hrv resolves", Boolean(m.crossPlatform("hrv")?.watchOut), true);
eq("provenance date present", typeof m.meta.healthkitIdentifiers.sourceReadOn, "string");

// Apple marks a deprecation with a per-platform deprecatedAt version and leaves
// its deprecated boolean false; these four carried deprecatedAt on 2026-10-02.
const deprecated = m.healthkitIdentifiers.filter((r) => r.deprecated === "yes").map((r) => r.identifier);
eq(
  "deprecation read from deprecatedAt",
  ["audioExposureEvent", "dance", "danceInspiredTraining", "mixedMetabolicCardioTraining"].every((c) => deprecated.includes(c)),
  true,
);
eq("deprecated carries its iOS version", m.healthkitIdentifier("dance")?.iosDeprecated, "14.0");
eq("deprecated carries Apple's note", m.healthkitIdentifier("dance")?.deprecationNote, "Use HKWorkoutActivityType.cardioDance or HKWorkoutActivityType.socialDance instead.");
eq("renamed target carried", m.healthkitIdentifier("audioExposureEvent")?.renamedTo, "HKCategoryTypeIdentifier.environmentalAudioExposureEvent");
eq("current type has no deprecation note", m.healthkitIdentifier("stepCount")?.deprecationNote, null);
eq("category links to its own family's page", m.healthkitIdentifier("sleepAnalysis")?.appleDocs, "https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier/sleepanalysis");
eq("every Apple link sits under its family path", m.healthkitIdentifiers.every((r) => r.appleDocs.includes(`/${r.family.toLowerCase()}/`)), true);

const undoc = m.healthkitIdentifiers.filter((r) => r.appleDocumented === "no");
eq("undocumented types are flagged, not dropped", undoc.length > 0, true);
eq("every row has a family", m.healthkitIdentifiers.every((r) => r.family), true);

console.log(fail === 0 ? "\n✓ all assertions passed" : `\n✗ ${fail} failed`);
process.exit(fail ? 1 : 0);
