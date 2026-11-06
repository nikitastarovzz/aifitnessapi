// Tests for the deprecation scanner (ops/VIRAL-20-2026-11-06.md items 14–15):
// the engine src/lib/deprecationScan.mjs, the generated rule bundle, and the
// GitHub Action's runner over its fixtures.
//
//   npm run test:deprecation-scan
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  IGNORE_MARKER,
  annotation,
  compileRules,
  describeHits,
  escapeData,
  escapeProperty,
  fileContext,
  guessContext,
  hitMessage,
  scanText,
  severityOf,
  summarize,
} from "../src/lib/deprecationScan.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const ACTION = path.join(ROOT, "actions/fitness-api-deprecation-check");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const bundle = JSON.parse(read("src/data/deprecationRules.json"));
const compiled = compileRules(bundle);
const ids = (text, opts = {}) => scanText(text, { compiled, ...opts }).map((h) => h.ruleId);
const rule = (id) => bundle.rules.find((r) => r.id === id);

test("the Action ships the same rules and engine the site runs", () => {
  assert.equal(fs.readFileSync(path.join(ACTION, "dist/rules.json"), "utf8"), read("src/data/deprecationRules.json"));
  const copy = fs.readFileSync(path.join(ACTION, "dist/scan.mjs"), "utf8");
  assert.ok(copy.endsWith(read("src/lib/deprecationScan.mjs")), "dist/scan.mjs is not a copy of src/lib/deprecationScan.mjs");
  execFileSync(process.execPath, ["scripts/build-deprecation-rules.mjs", "--check"], { cwd: ROOT, stdio: "pipe" });
});

test("every rule finds its own example, and the example is claimed by that rule", () => {
  for (const r of bundle.rules) {
    const got = ids(r.example, { context: r.contexts?.[0] ?? "code" });
    assert.ok(got.includes(r.id), `${r.id}: ${JSON.stringify(r.example)} → ${got.join(", ") || "nothing"}`);
  }
});

test("every rule points at a graveyard entry and states where its pattern comes from", () => {
  const grave = read("src/data/graveyard.ts");
  for (const r of bundle.rules) {
    const e = bundle.entries[r.entry];
    assert.ok(e, `${r.id}: no entry ${r.entry}`);
    assert.ok(grave.includes(`id: "${r.entry}"`), `${r.entry} is not a graveyard id`);
    assert.ok(r.basis.length > 0, `${r.id}: no basis`);
    for (const b of r.basis) {
      assert.match(b.url, /^https:\/\//, `${r.id}: basis url`);
      // A registry package's name is the registry page's own address.
      assert.ok(b.quote.includes(b.literal) || b.url.includes(b.literal), `${r.id}: literal ${b.literal} in neither quote nor url`);
      assert.match(b.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    }
    assert.ok(e.quote.length > 12 && e.url.startsWith("https://"), `${r.entry}: entry quote`);
  }
});

test("every graveyard entry is scanned or says why not", () => {
  const grave = [...read("src/data/graveyard.ts").matchAll(/^    id: "([^"]+)",$/gm)].map((m) => m[1]);
  assert.ok(grave.length >= 14);
  const scanned = new Set(bundle.rules.map((r) => r.entry));
  const why = new Set(bundle.notScanned.map((n) => n.entry));
  for (const id of grave) assert.ok(scanned.has(id) || why.has(id), `${id} neither scanned nor explained`);
});

test("every Fitbit Web API endpoint is covered by a rule", () => {
  const n = bundle.rules.filter((r) => r.id.startsWith("fitbit:") && r.endpoints).reduce((a, r) => a + r.endpoints.length, 0);
  assert.ok(n >= bundle.counts.fitbitEndpoints, `${n} endpoint slots for ${bundle.counts.fitbitEndpoints} endpoints`);
  assert.equal(bundle.counts.fitbitEndpoints, 121);
});

test("Fitbit: the most specific endpoint wins, and the host steps aside", () => {
  assert.deepEqual(ids('get("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json")'), ["fitbit:heartrate-timeseries/get-heartrate-timeseries-by-date"]);
  const [timed] = ids("`${base}/1/user/${id}/activities/heart/date/${d}/1d/1sec/time/08:00/09:00.json`");
  assert.ok(rule(timed).label.includes("/1d/[detail-level]/time/[start-time]/[end-time].json") && /Heart Rate Intraday/i.test(rule(timed).label), timed);
  // The bare host still reports when nothing more specific is on the line.
  assert.deepEqual(ids('const HOST = "api.fitbit.com"'), ["fitbit:host"]);
  // A path prefix alone only counts in a file that names Fitbit.
  assert.deepEqual(ids('url = BASE + "/1/user/" + uid'), []);
  assert.deepEqual(ids('url = BASE + "/1/user/" + uid  # fitbit'), ["fitbit:path-prefix"]);
});

test("Fitbit: replacements come from Google's migration tables, or say there is none", () => {
  const steps = rule("fitbit:activity-timeseries/get-activity-timeseries-by-date");
  assert.ok(steps.replacement.some((r) => /Steps \(steps\)/.test(r.label) && r.href === "/google-health-api/steps"));
  assert.ok(steps.more.href.startsWith("/tools/fitbit-to-google-health#"));
  const auth = rule("fitbit:authorization/authorize");
  assert.equal(auth.replacement.length, 0);
  assert.match(auth.replacementNote, /Google OAuth 2\.0/);
  // OAuth paths only match on a Fitbit host: /oauth2/token is everywhere.
  assert.deepEqual(ids('post("https://oauth2.googleapis.com/oauth2/token")'), []);
  assert.deepEqual(ids('post("https://api.fitbit.com/oauth2/token")'), ["fitbit:authorization/client-credentials"]);
});

test("look-alikes that are not deprecated are not reported", () => {
  const clean = [
    'import { PoseLandmarker } from "@mediapipe/tasks-vision";',
    'import * as pd from "@tensorflow-models/pose-detection";',
    '"@mediapipe/pose-landmarker": "1.0.0"',
    "https://api.ouraring.com/v2/usercollection/sleep",
    "https://api.prod.whoop.com/developer/v2/activity/sleep",
    "https://api.prod.whoop.com/developer/v1/activity-mapping/123",
    "https://www.strava.com/api/v3/clubs/42",
    "https://access.tryterra.co/api/widget/session",
    "https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints",
    'implementation("androidx.health.connect:connect-client:1.1.0")',
    "import com.samsung.android.sdk.health.data.HealthDataStore",
    "x = mp.solutions.pose_landmarks_style",
    "https://api.github.com/1/user/repos",
  ];
  for (const line of clean) assert.deepEqual(ids(line), [], line);
});

test("packages: PyPI names only in Python manifests, npm names in code and package.json", () => {
  assert.deepEqual(ids("fitbit==0.3.1", { context: "pypi-manifest" }), ["library:pypi:fitbit"]);
  assert.deepEqual(ids('  "fitbit>=0.3",', { context: "pypi-manifest" }), ["library:pypi:fitbit"]);
  assert.deepEqual(ids('fitbit = "^0.3"', { context: "pypi-manifest" }), ["library:pypi:fitbit"]);
  assert.deepEqual(ids("python-fitbit==1.0", { context: "pypi-manifest" }), []);
  assert.deepEqual(ids("import fitbit", { context: "code" }), []);
  assert.deepEqual(ids('"react-native-google-fit": "^0.19.1",', { context: "npm-manifest" }), ["library:npm:react-native-google-fit"]);
  assert.deepEqual(ids('"react-native-google-fit-extra": "1"', { context: "npm-manifest" }), []);
});

test("file and pasted-text contexts", () => {
  assert.equal(fileContext("a/b/package.json"), "npm-manifest");
  assert.equal(fileContext("requirements-dev.txt"), "pypi-manifest");
  assert.equal(fileContext("pyproject.toml"), "pypi-manifest");
  assert.equal(fileContext("app/build.gradle.kts"), "gradle");
  assert.equal(fileContext("ios/Podfile"), "podfile");
  assert.equal(fileContext("pubspec.yaml"), "pubspec");
  assert.equal(fileContext("src/x.ts"), "code");
  assert.equal(guessContext('{\n "dependencies": {"a": "1"}\n}'), "npm-manifest");
  assert.equal(guessContext("requests==2.0\nfitbit>=0.3\n# c\n"), "pypi-manifest");
  assert.equal(guessContext('dependencies {\n implementation("x:y:1")\n}'), "gradle");
  assert.equal(guessContext("platform :ios, '16.0'\npod 'A'"), "podfile");
  assert.equal(guessContext("const a = 1;"), "code");
  // Pasted requirements are scanned as a manifest without being told.
  assert.deepEqual(ids("requests==2.0\nfitbit==0.3.1"), ["library:pypi:fitbit"]);
});

test("the ignore marker skips a line", () => {
  assert.deepEqual(ids(`"https://api.fitbit.com/1/user/-/profile.json" // ${IGNORE_MARKER}`), []);
});

test("severity keeps the source's precision", () => {
  const e = (o) => ({ status: "dying", end: null, endLast: null, ...o });
  assert.equal(severityOf(e({ status: "dead" }), "2026-01-01").level, "error");
  assert.equal(severityOf(e({ end: "2026-11-02", endLast: "2026-11-02" }), "2026-11-02").level, "warning");
  assert.equal(severityOf(e({ end: "2026-11-02", endLast: "2026-11-02" }), "2026-11-03").level, "error");
  // "2026" is not past until 2026 is.
  assert.equal(severityOf(e({ end: "2026", endLast: "2026-12-31" }), "2026-11-06").level, "warning");
  assert.equal(severityOf(e({ end: "2026", endLast: "2026-12-31" }), "2027-01-01").level, "error");
  // A deprecated entry's date is when it was deprecated, not an end.
  assert.equal(severityOf(e({ status: "deprecated", end: "2025-07-31", endLast: "2025-07-31" }), "2026-11-06").level, "warning");
  assert.equal(bundle.entries["google-fit-apis"].endText, "2026");
});

test("messages and annotations", () => {
  const [d] = describeHits(scanText("Fitness.getGoalsClient(ctx, acct)", { compiled }), bundle, "2026-11-06");
  const msg = hitMessage(d);
  assert.match(msg, /Google Fit Goals API/);
  assert.match(msg, /The vendor names no replacement\./);
  assert.ok(msg.includes(bundle.entries["google-fit-goals-api"].quote));
  const a = annotation(d, "app/src/A,b.kt", "https://aifitnessapi.com");
  assert.match(a, /^::warning file=app\/src\/A%2Cb\.kt,line=1,col=1,title=/);
  assert.ok(!/\n/.test(a));
  assert.equal(escapeData("50%\nx"), "50%25%0Ax");
  assert.equal(escapeProperty("a:b,c"), "a%3Ab%2Cc");
  assert.deepEqual(summarize([d]), { total: 1, errors: 0, warnings: 1, entries: { "google-fit-goals-api": 1 } });
});

test("every replacement and migration link is a page this site serves", () => {
  const entrySlugs = (cluster) => {
    const files = fs.readdirSync(path.join(ROOT, "src/data")).filter((f) => f.endsWith(".entries.ts"));
    return files.some((f) => read(`src/data/${f}`).match(new RegExp(`"?slug"?: "${cluster.slug}"`)) && read(`src/data/${f}`).length);
  };
  const exists = (href) => {
    const p = href.split("#")[0];
    if (fs.existsSync(path.join(ROOT, "src/app", p, "page.tsx"))) return true;
    const [, cluster, slug] = p.split("/");
    if (cluster === "google-health-api") return fs.existsSync(path.join(ROOT, "src/app/google-health-api/[dataType]")) || read("src/data/googleHealthApi.ts").includes(`"${slug}"`);
    if (cluster === "libraries") return read("src/data/libraries.ts").includes(`"slug": "${slug}"`);
    return fs.existsSync(path.join(ROOT, "src/app", cluster, "[slug]", "page.tsx")) && entrySlugs({ slug });
  };
  const hrefs = new Set();
  for (const r of bundle.rules) {
    for (const x of r.replacement) if (x.href) hrefs.add(x.href);
    if (r.more) hrefs.add(r.more.href);
  }
  for (const e of Object.values(bundle.entries)) if (e.migrate) hrefs.add(e.migrate.href);
  for (const h of hrefs) assert.ok(exists(h), `no page for ${h}`);
});

test("the Action's runner reports exactly the expected hits on its fixtures", () => {
  const expected = JSON.parse(fs.readFileSync(path.join(ACTION, "test/expected.json"), "utf8"));
  const out = execFileSync(process.execPath, [path.join(ACTION, "run.mjs"), "test/fixtures", "--fail-on", "never", "--json"], {
    cwd: ACTION,
    env: { ...process.env, GITHUB_ACTIONS: "", GITHUB_STEP_SUMMARY: "", GITHUB_OUTPUT: "", FADC_TODAY: expected.today },
  }).toString();
  const j = JSON.parse(out);
  const got = j.hits.map((h) => [h.file.replace(/^test\/fixtures\//, ""), h.line, h.rule]);
  assert.deepEqual(got, expected.hits);
  assert.equal(j.errors, expected.errors);
  assert.equal(j.warnings, expected.warnings);
});

test("the runner's exit code follows fail-on", () => {
  const run = (args) => {
    try {
      execFileSync(process.execPath, [path.join(ACTION, "run.mjs"), ...args], { cwd: ACTION, stdio: "pipe", env: { ...process.env, GITHUB_ACTIONS: "", GITHUB_STEP_SUMMARY: "", GITHUB_OUTPUT: "", FADC_TODAY: "2026-11-06" } });
      return 0;
    } catch (e) {
      return e.status;
    }
  };
  assert.equal(run(["test/fixtures/clean", "--fail-on", "warning"]), 0);
  assert.equal(run(["test/fixtures/android", "--fail-on", "error"]), 0); // warnings only (Google Fit's end is "2026")
  assert.equal(run(["test/fixtures/android", "--fail-on", "warning"]), 1);
  assert.equal(run(["test/fixtures/server", "--fail-on", "error"]), 1);
  assert.equal(run(["test/fixtures/server", "--fail-on", "never"]), 0);
});

test("the job summary and outputs are written in GitHub Actions", () => {
  const dir = fs.mkdtempSync(path.join(ROOT, ".tmp-dscan-"));
  try {
    const summary = path.join(dir, "summary.md");
    const output = path.join(dir, "output.txt");
    execFileSync(process.execPath, [path.join(ACTION, "run.mjs")], {
      cwd: ACTION,
      stdio: "pipe",
      env: { ...process.env, GITHUB_ACTIONS: "true", GITHUB_STEP_SUMMARY: summary, GITHUB_OUTPUT: output, FADC_PATH: "test/fixtures/web", FADC_FAIL_ON: "never", FADC_TODAY: "2026-11-06" },
    });
    const md = fs.readFileSync(summary, "utf8");
    assert.match(md, /^## Fitness API deprecation check/);
    assert.match(md, /\| `test\/fixtures\/web\/connect\.ts:5` \|/);
    assert.equal(fs.readFileSync(output, "utf8"), "hits=6\nerrors=1\nwarnings=5\n");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
