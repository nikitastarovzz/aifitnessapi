/**
 * Tests for scripts/build-ai-rules.mjs, the AI coding-assistant rule packs
 * in public/kit/ai-rules/.
 *
 * Run: npm run test:ai-rules   (also part of npm test)
 *
 * Freshness first: the committed files must be exactly what the generated
 * data renders today (ignoring the date on the header line), so a
 * regeneration of any input that is not followed by
 * `node scripts/build-ai-rules.mjs` fails here and in qa's AI-RULES-STALE.
 * Then the formats: each flavor carries the front matter its tool's docs
 * describe, stays under Cursor's 500 lines, and names only identifiers the
 * generated data holds.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const build = await import(new URL("./build-ai-rules.mjs", import.meta.url).href);
const src = new URL("../src/", import.meta.url);
const hk = await import(new URL("data/healthkitIdentifiers.ts", src).href);
const hc = await import(new URL("data/healthConnectRecords.ts", src).href);
const pose = await import(new URL("data/poseKeypoints.ts", src).href);

const dir = path.join(ROOT, "public/kit/ai-rules");
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");

test("public/kit/ai-rules is current (build-ai-rules.mjs --check)", async () => {
  const problems = await build.checkAiRules();
  assert.deepEqual(problems, [], `run node scripts/build-ai-rules.mjs:\n${problems.join("\n")}`);
});

test("every topic ships in all three flavors, listed in the manifest", () => {
  const manifest = JSON.parse(read("manifest.json"));
  for (const t of build.TOPICS) {
    for (const f of build.FLAVORS) {
      const file = f.file(t.slug);
      assert.ok(fs.existsSync(path.join(dir, file)), `${file} missing`);
      const m = manifest.files.find((x) => x.file === file);
      assert.ok(m, `${file} not in manifest`);
      assert.equal(m.installAs, f.installAs(t.slug));
      assert.match(m.generatedOn, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
  assert.equal(manifest.formats.length, 3);
});

test("each flavor has the front matter its tool documents", () => {
  for (const t of build.TOPICS) {
    const cursor = read(`${t.slug}.mdc`);
    assert.match(cursor, /^---\ndescription: .+\nalwaysApply: false\n---\n/, `${t.slug}.mdc front matter`);
    const copilot = read(`${t.slug}.instructions.md`);
    assert.match(copilot, /^---\napplyTo: "\*\*"\n---\n/, `${t.slug}.instructions.md front matter`);
    const claude = read(`${t.slug}.md`);
    assert.match(claude, /^# /, `${t.slug}.md starts with its heading (loaded at launch from .claude/rules/)`);
  }
});

test("the header line names the source, the generation date and the site URL", () => {
  for (const t of build.TOPICS) {
    const text = read(`${t.slug}.md`);
    assert.match(text, /^> Generated \d{4}-\d{2}-\d{2} by https:\/\/aifitnessapi\.com from .+ on \d{4}-\d{2}-\d{2} \(https:\/\/aifitnessapi\.com\/[a-z-]+\)/m);
  }
});

test("every file stays under Cursor's 500-line limit", () => {
  for (const f of fs.readdirSync(dir).filter((x) => x !== "manifest.json")) {
    const lines = read(f).split("\n").length;
    assert.ok(lines <= build.MAX_LINES, `${f}: ${lines} lines`);
  }
});

test("HealthKit pack: every quantity type with its aggregation and Apple's sentence", () => {
  const text = read("healthkit.md");
  for (const r of hk.HK_IDENTIFIERS.filter((x) => x.family === "quantity")) {
    const row = text.split("\n").find((l) => l.startsWith(`| [\`${r.case}\`]`));
    assert.ok(row, `${r.case} has no row`);
    assert.ok(row.includes(`| ${r.aggregation ?? "not stated"} |`), `${r.case}: aggregation`);
    if (r.aggregationEvidence) assert.ok(row.includes(r.aggregationEvidence.replace(/\s+/g, " ").trim()), `${r.case}: evidence`);
  }
  assert.match(text, /cumulative → `HKStatisticsOptions\.cumulativeSum`/);
});

test("Health Connect pack: every record with its exact permission strings and metrics", () => {
  const text = read("health-connect.md");
  for (const r of hc.HC_RECORDS) {
    const row = text.split("\n").find((l) => l.startsWith(`| [\`${r.className}\`]`));
    assert.ok(row, `${r.className} has no row`);
    for (const p of [...r.readPermissions, ...r.writePermissions]) assert.ok(row.includes(`\`${p}\``), `${r.className}: ${p}`);
    for (const m of r.aggregateMetrics) assert.ok(row.includes(`\`${m.name}\``), `${r.className}: ${m.name}`);
  }
});

test("pose pack: every scheme's points, indexed exactly as the source numbers them", () => {
  const text = read("pose-keypoints.md");
  for (const s of pose.POSE_SCHEMES) {
    assert.ok(text.includes(`### ${s.name}`), s.name);
    for (const p of s.points) {
      const token = s.indexed ? `${p.index} \`${p.name}\`` : `\`${p.name}\``;
      assert.ok(text.includes(token), `${s.slug}: ${token}`);
    }
  }
});

test("backticked HealthKit and Health Connect type names are all in the generated data", () => {
  const hkNames = new Set(hk.HK_IDENTIFIERS.flatMap((r) => [r.case, r.objc, r.valueEnum].filter(Boolean)));
  const hcNames = new Set(hc.HC_RECORDS.map((r) => r.className));
  for (const t of ["healthkit", "health-connect"]) {
    const text = read(`${t}.md`);
    for (const m of text.matchAll(/`([A-Z][A-Za-z0-9]*Record)`/g)) assert.ok(hcNames.has(m[1]), `${t}: ${m[1]} is not a Health Connect record`);
    for (const m of text.matchAll(/`HK(?:Quantity|Category)TypeIdentifier\.(\w+)`/g)) assert.ok(hkNames.has(m[1]), `${t}: ${m[1]} is not a HealthKit identifier`);
  }
});
