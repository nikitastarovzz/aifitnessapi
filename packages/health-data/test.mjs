/** Assertions on the published contract, not just on it loading. */
import * as m from "./src/index.js";
let fail = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : ` — got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
};

eq("240 identifiers", m.healthkitIdentifiers.length, 240);
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

const undoc = m.healthkitIdentifiers.filter((r) => r.appleDocumented === "no");
eq("undocumented types are flagged, not dropped", undoc.length > 0, true);
eq("every row has a family", m.healthkitIdentifiers.every((r) => r.family), true);

console.log(fail === 0 ? "\n✓ all assertions passed" : `\n✗ ${fail} failed`);
process.exit(fail ? 1 : 0);
