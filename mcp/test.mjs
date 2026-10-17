/**
 * One assertion list, two transports.
 *
 *   node mcp/test.mjs                                  # stdio: spawns src/index.js
 *   node mcp/test.mjs --url http://localhost:3000/mcp  # Streamable HTTP (next start)
 *   node mcp/test.mjs --url https://aifitnessapi.com/mcp
 *
 * The hosted endpoint and the stdio package share src/tools.js, so the same
 * expectations must hold over both; running this against a URL is how a deploy
 * is checked.
 */
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const urlArg = process.argv.indexOf("--url");
const url = urlArg === -1 ? null : process.argv[urlArg + 1];
if (urlArg !== -1 && !url) {
  console.error("usage: node mcp/test.mjs [--url <mcp endpoint>]");
  process.exit(2);
}

// Resolved against this file, not the working directory, so the test runs the
// same from the repository root and from mcp/.
const serverPath = fileURLToPath(new URL("./src/index.js", import.meta.url));
const transport = url
  ? new StreamableHTTPClientTransport(new URL(url))
  : new StdioClientTransport({ command: process.execPath, args: [serverPath] });

const client = new Client({ name: "smoke", version: "0" }, { capabilities: {} });
await client.connect(transport);
console.log(`transport: ${url ? `streamable-http ${url}` : "stdio"}`);
const info = client.getServerVersion();
console.log(`server: ${info?.name} ${info?.version}`);

let failures = 0;
const record = (ok, label, got) => {
  if (!ok) failures++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok && got !== undefined) console.log("    got:", String(got).slice(0, 300).replace(/\n/g, " | "));
};

const tools = await client.listTools();
console.log("tools:", tools.tools.map((t) => t.name).join(", "));
record(tools.tools.length === 4, "four tools listed", tools.tools.length);
record(tools.tools.every((t) => t.annotations?.readOnlyHint === true), "every tool is annotated read-only");

async function check(name, args, expectations, { isError = false } = {}) {
  const res = await client.callTool({ name, arguments: args });
  const out = res.content.map((c) => c.text).join("\n");
  record(Boolean(res.isError) === isError, `${name} — ${isError ? "reports an error" : "succeeds"}`, out);
  for (const [label, re] of expectations) record(re.test(out), `${name} — ${label}`, out);
}

console.log("\n-- aggregation correctness (the whole point) --");
await check("healthkit_type", { query: "stepCount" }, [
  ["cumulative", /CUMULATIVE/],
  ["says sum it", /\.cumulativeSum/],
  ["cites the site", /aifitnessapi\.com\/healthkit-identifiers/],
  ["names the published dataset", /aifitnessapi\.com\/datasets\/healthkit-type-identifiers-2026\.json/],
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

console.log("\n-- input checks --");
await check("healthkit_type", {}, [["names the missing argument", /Missing required argument "query"/]], { isError: true });
await check("healthkit_type", { query: "   " }, [["refuses an empty query", /must not be empty/]], { isError: true });
await check("healthkit_type", { query: "!!!" }, [["refuses a query that matches everything", /letter or digit/]], { isError: true });
await check("healthkit_type", { query: "steps", family: "bogus" }, [["refuses an unknown family", /must be one of/]], { isError: true });
await check("no_such_tool", {}, [["unknown tool", /Unknown tool/]], { isError: true });

await client.close();
console.log(failures === 0 ? "\n✓ all assertions passed" : `\n✗ ${failures} assertion(s) failed`);
process.exit(failures === 0 ? 0 : 1);
