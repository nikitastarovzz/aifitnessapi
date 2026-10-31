// Every MigrationWizard path → destination, checked against the decision
// table below (each row's basis is the Google sentence named beside it; the
// sentences themselves live in src/lib/migrationWizard.ts as Q.*).
//
//   node --test scripts/migration-wizard.test.mjs
//
// Loads the .ts module through Node's type stripping (Node 22.18+).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  API_OPTIONS,
  DATA_OPTIONS,
  MODE_OPTIONS,
  READING,
  RUNTIME_OPTIONS,
  SOURCES,
  Q,
  GHA_OPERATIONS,
  fromQuery,
  isComplete,
  resolve,
  toQuery,
} from "../src/lib/migrationWizard.ts";

const ROOT = path.resolve(import.meta.dirname, "..");

// api → runtime → mode → destinations. "*" = same for both modes.
const TABLE = {
  "fit-recording": { phone: { "*": ["health-connect"] }, watch: { "*": ["health-services"] }, backend: { "*": ["unstated"] } },
  "fit-history": { phone: { "*": ["google-health-api"] }, watch: { "*": ["health-connect"] }, backend: { "*": ["unstated"] } },
  "fit-session": {
    phone: { read: ["google-health-api"], write: ["google-health-api", "health-connect"] },
    watch: { "*": ["health-services", "health-connect"] },
    backend: { "*": ["unstated"] },
  },
  "fit-sensor": { phone: { "*": ["android-sensors"] }, watch: { "*": ["health-services", "android-sensors"] }, backend: { "*": ["unstated"] } },
  "fit-goals": { phone: { "*": ["no-replacement"] }, watch: { "*": ["no-replacement"] }, backend: { "*": ["unstated"] } },
  "fit-ble": { phone: { "*": ["android-bluetooth"] }, watch: { "*": ["android-bluetooth"] }, backend: { "*": ["unstated"] } },
  "fit-rest": {
    phone: { "*": ["health-connect", "google-health-api"] },
    watch: { "*": ["health-services"] },
    backend: { "*": ["google-health-api"] },
  },
  "fit-app": { phone: { "*": ["health-connect", "google-health-api"] }, watch: { "*": ["health-connect", "google-health-api"] }, backend: { "*": ["health-connect", "google-health-api"] } },
  "fitbit-web": { phone: { "*": ["google-health-api"] }, watch: { "*": ["google-health-api"] }, backend: { "*": ["google-health-api"] } },
  "health-connect": { phone: { "*": ["keep-health-connect"] }, watch: { "*": ["keep-health-connect"] }, backend: { "*": ["keep-health-connect"] } },
};

const DATA = DATA_OPTIONS.map((o) => o.value);
const subsets = [];
for (let m = 1; m < 1 << DATA.length; m++) subsets.push(DATA.filter((_, i) => m & (1 << i)));

function* everyAnswer() {
  for (const { value: api } of API_OPTIONS)
    for (const { value: runtime } of RUNTIME_OPTIONS)
      for (const { value: mode } of MODE_OPTIONS) for (const data of subsets) yield { api, runtime, mode, data };
}

const quoteTexts = new Set(Object.values(Q).map((q) => q.text));
const readingHrefs = new Set(Object.values(READING).map((l) => l.href));

test("the decision table covers every option", () => {
  assert.deepEqual(Object.keys(TABLE).sort(), API_OPTIONS.map((o) => o.value).sort());
  for (const api of Object.keys(TABLE))
    assert.deepEqual(Object.keys(TABLE[api]).sort(), RUNTIME_OPTIONS.map((o) => o.value).sort(), api);
});

test("every answer resolves to the table's destination, with quotes, steps and reading", () => {
  let n = 0;
  for (const a of everyAnswer()) {
    const r = resolve(a);
    const row = TABLE[a.api][a.runtime];
    const want = row[a.mode] ?? row["*"];
    const label = JSON.stringify(a);
    assert.deepEqual(r.destinations, want, label);
    assert.ok(r.summary.length > 20, label);
    assert.ok(r.rule.length >= 1, `${label}: no rule quote`);
    for (const q of [...r.rule, ...r.notes.flatMap((x) => (x.quote ? [x.quote] : [])), ...(r.deadline.quote ? [r.deadline.quote] : [])]) {
      assert.ok(quoteTexts.has(q.text), `${label}: quote not from Q`);
      assert.ok(r.sources.includes(q.source), `${label}: ${q.source} quoted but not listed as a source`);
    }
    assert.ok(r.steps.length >= 3 && r.steps.length <= 6, `${label}: ${r.steps.length} steps`);
    assert.ok(r.reading.length >= 2, `${label}: reading`);
    for (const l of r.reading) assert.ok(readingHrefs.has(l.href), `${label}: ${l.href} not in READING`);
    for (const k of r.sources) assert.ok(SOURCES[k], label);
    n++;
  }
  assert.equal(n, API_OPTIONS.length * RUNTIME_OPTIONS.length * MODE_OPTIONS.length * subsets.length);
});

test("deadlines: Fitbit is the November 2, 2026 turn-off; Fit APIs end of 2026; unstated where Google gives none", () => {
  for (const a of everyAnswer()) {
    const r = resolve(a);
    if (a.api === "fitbit-web") {
      assert.match(r.deadline.label, /November 2, 2026/);
      assert.equal(r.deadline.quote, Q.fitbitTurnOff);
      assert.match(r.deadline.quote.text, /HTTP 410 Gone/);
    } else if (a.api === "health-connect") {
      assert.equal(r.deadline.quote, null);
      assert.match(r.deadline.detail, /Google doesn't state this/);
    } else if (a.api === "fit-app") {
      assert.equal(r.deadline.quote, Q.fitAppNoDate);
    } else {
      assert.match(r.deadline.label, /End of 2026/);
      assert.equal(r.deadline.quote, Q.fitCaution);
    }
  }
});

test("unstated combinations say so instead of guessing", () => {
  for (const a of everyAnswer()) {
    const r = resolve(a);
    if (r.destinations.includes("unstated")) assert.match(r.summary, /Google doesn't state this/);
  }
  const watchFitbit = resolve({ api: "fitbit-web", runtime: "watch", data: ["steps"], mode: "read" });
  assert.ok(watchFitbit.notes.some((n) => /Google doesn't state this/.test(n.text)));
});

test("Google Health API write notes follow Google's operations list", () => {
  const r = resolve({ api: "fitbit-web", runtime: "backend", data: ["steps", "sleep"], mode: "write" });
  const steps = r.notes.find((n) => n.text.startsWith("Google Health API, Steps"));
  const sleep = r.notes.find((n) => n.text.startsWith("Google Health API, Sleep"));
  assert.ok(!GHA_OPERATIONS.steps.ops.includes("create"));
  assert.match(steps.text, /Create is not listed/);
  assert.match(sleep.text, /Create is listed/);
  assert.ok(r.sources.includes("dataTypes"));
});

test("the shareable query string round-trips and ignores junk", () => {
  for (const a of everyAnswer()) {
    const back = fromQuery(toQuery(a));
    assert.ok(isComplete(back));
    assert.deepEqual(back, a);
  }
  assert.deepEqual(fromQuery("?from=nope&on=phone&data=steps,bogus&op=x"), { runtime: "phone", data: ["steps"] });
  assert.equal(isComplete(fromQuery("?from=fit-rest&on=backend")), false);
});

test("every reading link points at a route that exists in the app", () => {
  const dataText = fs
    .readdirSync(path.join(ROOT, "src/data"))
    .filter((f) => f.endsWith(".ts"))
    .map((f) => fs.readFileSync(path.join(ROOT, "src/data", f), "utf8"))
    .join("\n");
  for (const href of readingHrefs) {
    const segs = href.slice(1).split("/");
    const staticDir = path.join(ROOT, "src/app", ...segs);
    if (fs.existsSync(path.join(staticDir, "page.tsx"))) continue;
    assert.equal(segs.length, 2, `${href}: no static page`);
    assert.ok(fs.existsSync(path.join(ROOT, "src/app", segs[0])), `${href}: no ${segs[0]} route`);
    assert.ok(dataText.includes(`"slug": "${segs[1]}"`), `${href}: slug ${segs[1]} not found in src/data`);
  }
});
