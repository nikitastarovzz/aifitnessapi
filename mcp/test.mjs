import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "smoke", version: "0" }, { capabilities: {} });
await client.connect(new StdioClientTransport({ command: "node", args: ["src/index.js"] }));

const tools = await client.listTools();
console.log("tools:", tools.tools.map((t) => t.name).join(", "));

let failures = 0;
async function check(name, args, expectations) {
  const res = await client.callTool({ name, arguments: args });
  const out = res.content.map((c) => c.text).join("\n");
  for (const [label, re] of expectations) {
    const ok = re.test(out);
    if (!ok) failures++;
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name} — ${label}`);
    if (!ok) console.log("    got:", out.slice(0, 300).replace(/\n/g, " | "));
  }
}

console.log("\n-- aggregation correctness (the whole point) --");
await check("healthkit_type", { query: "stepCount" }, [
  ["cumulative", /CUMULATIVE/],
  ["says sum it", /\.cumulativeSum/],
  ["cites the site", /aifitnessapi\.com\/healthkit-identifiers/],
]);
await check("healthkit_type", { query: "heartRate" }, [
  ["discrete", /DISCRETE/],
  ["warns not to sum", /Do not sum it/],
]);
await check("healthkit_type", { query: "workoutEffortScore" }, [
  ["flags undocumented", /no abstract and no discussion/],
  ["refuses to guess", /NOT STATED/],
]);

console.log("\n-- search + honest misses --");
await check("healthkit_type", { query: "energy" }, [["finds matches", /activeEnergyBurned/]]);
await check("healthkit_type", { query: "zzzznope" }, [
  ["honest miss", /No HealthKit identifier matches/],
]);

console.log("\n-- other families --");
await check("healthkit_type", { query: "sleepAnalysis" }, [
  ["is a category type", /CATEGORY type/],
  ["names the decoding enum", /HKCategoryValueSleepAnalysis/],
  ["does not claim an aggregation", /^(?!.*(CUMULATIVE|DISCRETE —))/s],
]);
await check("healthkit_type", { query: "bloodType" }, [
  ["is a characteristic", /CHARACTERISTIC/],
  ["says read-only", /never write/],
]);
await check("healthkit_type", { query: "running", family: "workoutActivity" }, [
  ["is a workout activity", /WORKOUT ACTIVITY TYPE/],
]);
await check("healthkit_type", { query: "sleep", family: "quantity" }, [
  ["family filter excludes category sleep", /^(?!.*sleepAnalysis)/s],
]);

console.log("\n-- cross-platform --");
await check("health_data_cross_platform", { metric: "hrv" }, [
  ["names SDNN", /SDNN/], ["names RMSSD", /RMSSD/], ["warns", /interconvertible|WATCH OUT/],
]);

console.log("\n-- changes --");
await check("fitness_api_changes", { product: "fitbit" }, [
  ["finds Fitbit", /Fitbit/], ["carries grading", /Grading: (CONFIRMED|REPORTED|WATCH)/],
]);
await check("fitness_api_changes", { product: "nonexistentvendor" }, [["honest miss", /No tracked change matches/]]);

console.log("\n-- glossary --");
await check("fitness_api_glossary", { term: "RMSSD" }, [["defines it", /RMSSD/]]);

await client.close();
console.log(failures === 0 ? "\n✓ all assertions passed" : `\n✗ ${failures} assertion(s) failed`);
process.exit(failures === 0 ? 0 : 1);
