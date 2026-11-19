/**
 * Tests for the wrapper-library support dataset: the parser and the
 * exact-match rule in scripts/fetch-health-library-support.mjs, and the
 * generated src/data/healthLibrarySupport.ts it wrote.
 *
 * Run: npm run test:health-library-support
 *
 * The fixtures are lines copied from the libraries' own sources as the
 * generator read them on 2026-11-19 (file named above each). The data checks
 * re-derive every published row from the rule, so a hand edit of the
 * generated file, or a generator that starts matching loosely, fails here.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const gen = await import(new URL("./fetch-health-library-support.mjs", import.meta.url).href);
const data = await import(new URL("../src/data/healthLibrarySupport.ts", import.meta.url).href);
const hk = await import(new URL("../src/data/healthkitIdentifiers.ts", import.meta.url).href);
const hc = await import(new URL("../src/data/healthConnectRecords.ts", import.meta.url).href);
const libs = await import(new URL("../src/data/libraries.ts", import.meta.url).href);

const canon = gen.canonical(hk.HK_IDENTIFIERS, hc.HC_RECORDS);
const run = (src, scan) => gen.extract(gen.codeLines(src), { patterns: [], ...scan });
const resolved = (src, scan) => run(src, scan).map((h) => gen.resolve(h, canon)?.[h.store === "healthkit" ? "objc" : "className"] ?? null);

test("codeLines drops line and block comments, keeps strings that contain //", () => {
  const lines = gen.codeLines(
    [
      "dataTypes['distance'] = 'HKQuantityTypeIdentifierDistanceWalkingRunning'; // and HKQuantityTypeIdentifierDistanceCycling",
      "/* HKQuantityTypeIdentifierStepCount",
      "   still a comment */ x = 'https://example.com/a'",
    ].join("\n"),
  );
  assert.equal(lines[0].code.trim(), "dataTypes['distance'] = 'HKQuantityTypeIdentifierDistanceWalkingRunning';");
  assert.equal(lines[1].code, "");
  assert.equal(lines[2].code.trim(), "x = 'https://example.com/a'");
  assert.equal(lines[0].n, 1);
  assert.equal(lines[2].n, 3);
});

test("hk-objc: Objective-C constants (react-native-health TypesAndPermissions.m)", () => {
  const src = "        return [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierPeakExpiratoryFlowRate];";
  assert.deepEqual(resolved(src, { patterns: ["hk-objc"] }), ["HKQuantityTypeIdentifierPeakExpiratoryFlowRate"]);
});

test("hk-objc: TypeScript union members (kingstinct healthkit.generated.ts) and a trailing comment is not read (cordova www/ios/health.js)", () => {
  assert.deepEqual(resolved("  | 'HKQuantityTypeIdentifierAppleExerciseTime'", { patterns: ["hk-objc"] }), ["HKQuantityTypeIdentifierAppleExerciseTime"]);
  const cordova = "dataTypes['calories'] = 'HKQuantityTypeIdentifierActiveEnergyBurned'; // and HKQuantityTypeIdentifierBasalEnergyBurned";
  assert.deepEqual(resolved(cordova, { patterns: ["hk-objc"] }), ["HKQuantityTypeIdentifierActiveEnergyBurned"]);
});

test("hk-objc: a bare family name is not an identifier (kingstinct core/ios/TypeIdentifiers.swift)", () => {
  assert.deepEqual(run('public let quantityTypeIdentifierPrefix = "HKQuantityTypeIdentifier"', { patterns: ["hk-objc"] }), []);
});

test("hk-swift: qualified case, typed call and HKQuantityType(.case) init", () => {
  // perfood ios/Plugin/CapacitorHealthkitPlugin.swift
  const perfood = "            return HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.stepCount)!";
  const hits = run(perfood, { patterns: ["hk-swift"] });
  assert.equal(hits.length, 1, "a qualified case inside a typed call is one token");
  assert.equal(gen.resolve(hits[0], canon).objc, "HKQuantityTypeIdentifierStepCount");
  // capacitor-health ios/Sources/HealthPluginPlugin/HealthPlugin.swift
  assert.deepEqual(resolved("            return [HKObjectType.categoryType(forIdentifier: .mindfulSession)!].compactMap{$0}", { patterns: ["hk-swift"] }), [
    "HKCategoryTypeIdentifierMindfulSession",
  ]);
  assert.deepEqual(resolved("let t = HKQuantityType(.vo2Max)", { patterns: ["hk-swift"] }), ["HKQuantityTypeIdentifierVO2Max"]);
});

test("bare members need a scan that fixes their family (carp HealthConstants.swift NUTRITION_KEYS)", () => {
  const src = [
    "    static let NUTRITION_KEYS: [String: HKQuantityTypeIdentifier] = [",
    '        "calories": .dietaryEnergyConsumed,',
    '        // "fat_trans_monoenoic": .dietaryFatTransMonoenoic,',
    '        "fiber": .dietaryFiber,',
    "    ]",
  ].join("\n");
  const bare = { re: /:\s*\.([a-z][A-Za-z0-9]*)\s*,?\s*$/g, familyType: "HKQuantityTypeIdentifier", typedBy: "x" };
  assert.deepEqual(resolved(src, { bare }), ["HKQuantityTypeIdentifierDietaryEnergyConsumed", "HKQuantityTypeIdentifierDietaryFiber"]);
  assert.deepEqual(run(src, { patterns: ["hk-swift"] }), [], "without the scan's bare pattern nothing is read");
});

test("familyCall: the package's own factory (health_connector HealthDataTypeMapper.swift)", () => {
  const scan = {
    familyCall: { re: /\bHK(Quantity|Category|Correlation|Characteristic)Type\.make\(\s*from:\s*\.([a-z][A-Za-z0-9]*)\s*\)/g, declaredIn: "x", typedBy: [] },
  };
  const hits = run(["            try HKCategoryType.make(from: .sleepAnalysis)", "            try HKCorrelationType.make(from: .bloodPressure)"].join("\n"), scan);
  assert.equal(gen.resolve(hits[0], canon).objc, "HKCategoryTypeIdentifierSleepAnalysis");
  assert.equal(gen.resolve(hits[1], canon), null, "correlation types are not in the site's identifier list");
});

test("hc-import and hc-class: Kotlin and Java (capgo HealthDataType.kt, cordova HealthPlugin.java)", () => {
  assert.deepEqual(resolved('    STEPS("steps", StepsRecord::class, "count"),', { patterns: ["hc-class"] }), ["StepsRecord"]);
  assert.deepEqual(resolved("import androidx.health.connect.client.records.SkinTemperatureRecord;", { patterns: ["hc-import"] }), ["SkinTemperatureRecord"]);
  assert.deepEqual(run("import androidx.health.connect.client.records.metadata.Metadata;", { patterns: ["hc-import"] }), []);
  assert.deepEqual(run("import androidx.health.connect.client.records.*", { patterns: ["hc-import"] }), []);
});

test("exact match only: near misses are unmatched, never mapped to a neighbour", () => {
  const near = [
    ["hk-objc", "'HKQuantityTypeIdentifierStepcount'"],
    ["hk-objc", "'HKCategoryTypeIdentifierHeadache'"], // a real Apple type the site's list does not hold
    ["hk-swift", "HKCategoryTypeIdentifier.stepCount"], // right case, wrong family
    ["hc-class", "SleepStageRecord::class"], // flutter_health_connect Consts.kt; not a current record class
    ["hc-class", "StepRecord::class"],
  ];
  for (const [p, src] of near) {
    const hits = run(src, { patterns: [p] });
    assert.equal(hits.length, 1, src);
    assert.equal(gen.resolve(hits[0], canon), null, src);
  }
});

test("regionOf: exact start and end lines; a missing end is a problem, not a partial read", () => {
  const lines = gen.codeLines(["a", "val m = mapOf(", "  x to StepsRecord::class,", ")", "b"].join("\n"));
  const r = gen.regionOf(lines, { start: "val m = mapOf(", end: ")" });
  assert.equal(r.problem, null);
  assert.deepEqual(r.lines.map((l) => l.n), [2, 3, 4]);
  assert.match(gen.regionOf(lines, { start: "val m = mapOf(", end: "]" }).problem, /region end not found/);
  assert.match(gen.regionOf(lines, { start: "val n = mapOf(", end: ")" }).problem, /region start not found/);
});

test("short parse: fewer matches than the floor is a problem in either store", () => {
  assert.deepEqual(gen.countProblems("x", { healthkit: 80, healthConnect: 0 }, { healthkit: 80, healthConnect: 0 }), []);
  assert.deepEqual(gen.countProblems("x", { healthkit: 81, healthConnect: 0 }, { healthkit: 80, healthConnect: 0 }), []);
  assert.equal(gen.countProblems("x", { healthkit: 79, healthConnect: 0 }, { healthkit: 80, healthConnect: 0 }).length, 1);
  assert.equal(gen.countProblems("x", { healthkit: 80, healthConnect: 3 }, { healthkit: 80, healthConnect: 4 }).length, 1);
  assert.equal(gen.countProblems("x", { healthkit: 1, healthConnect: 1 }, undefined).length, 1);
});

test("pickTag: the release tag peeled to its commit, else null (head pin)", () => {
  const refs = new Map([
    ["HEAD", "h"],
    ["refs/tags/v1.19.0", "tagobj"],
    ["refs/tags/v1.19.0^{}", "commit"],
    ["refs/tags/@kingstinct/react-native-healthkit@16.2.0", "k"],
    ["refs/tags/health_connector-v3.14.1", "hc"],
  ]);
  assert.deepEqual(gen.pickTag(refs, "1.19.0", "react-native-health"), { tag: "v1.19.0", sha: "commit" });
  assert.deepEqual(gen.pickTag(refs, "16.2.0", "@kingstinct/react-native-healthkit"), { tag: "@kingstinct/react-native-healthkit@16.2.0", sha: "k" });
  assert.deepEqual(gen.pickTag(refs, "3.14.1", "health_connector"), { tag: "health_connector-v3.14.1", sha: "hc" });
  assert.equal(gen.pickTag(refs, "13.3.2", "health"), null);
});

/* ─────────────────────── the generated file ──────────────────────── */

/** Every pattern, plus the scan-specific ones the library declares for that file (a file can have a bare scan and a factory scan). */
function scanFor(slug, path) {
  const scans = gen.LIBS[slug].scans.filter((x) => x.path === path);
  return {
    patterns: ["hk-objc", "hk-swift", "hc-import", "hc-class"],
    bare: scans.find((x) => x.bare)?.bare,
    familyCall: scans.find((x) => x.familyCall)?.familyCall,
  };
}

test("every mobile library in libraries.ts is covered or left out with a reason", () => {
  const mobile = libs.LIBRARIES.filter((l) => l.group !== "python").map((l) => l.slug).sort();
  const seen = [...data.HEALTH_LIBRARY_SUPPORT.map((l) => l.slug), ...data.HEALTH_LIBRARY_SUPPORT_EXCLUDED.map((l) => l.slug)].sort();
  assert.deepEqual(seen, mobile);
  for (const e of data.HEALTH_LIBRARY_SUPPORT_EXCLUDED) assert.ok(e.reason.length > 20, e.slug);
});

test("published counts are at or above the floors and match the rows", () => {
  for (const l of data.HEALTH_LIBRARY_SUPPORT) {
    assert.equal(l.counts.healthkit, l.healthkit.length, l.slug);
    assert.equal(l.counts.healthConnect, l.healthConnect.length, l.slug);
    assert.equal(l.counts.unmatched, l.unmatched.length, l.slug);
    assert.deepEqual(gen.countProblems(l.slug, l.counts, gen.EXPECTED[l.slug]), [], l.slug);
    assert.ok(l.healthkit.length + l.healthConnect.length > 0, l.slug);
  }
});

test("every row re-derives: exact canonical match, its token on its quoted line, a link to that line at the pinned commit", () => {
  for (const l of data.HEALTH_LIBRARY_SUPPORT) {
    assert.match(l.ref.sha, /^[0-9a-f]{40}$/, l.slug);
    assert.equal(l.ref.kind === "tag", l.ref.tag !== null, l.slug);
    for (const it of [...l.healthkit, ...l.healthConnect, ...l.unmatched]) {
      assert.equal(it.url, `${l.repoUrl}/blob/${l.ref.sha}/${it.path}#L${it.line}`, `${l.slug} ${it.token}`);
      assert.ok(it.quote.includes(it.token), `${l.slug}: token ${it.token} is not on its line: ${it.quote}`);
      assert.ok(l.files.some((f) => f.path === it.path), `${l.slug}: ${it.path} is not a read file`);
      const hits = gen.extract(gen.codeLines(it.quote), scanFor(l.slug, it.path));
      assert.ok(hits.some((h) => h.token === it.token), `${l.slug}: the quoted line does not yield ${it.token}`);
    }
    for (const it of l.healthkit) {
      const row = canon.hkByObjc.get(it.id);
      assert.ok(row, `${l.slug}: ${it.id} is not in healthkitIdentifiers.ts`);
      assert.equal(it.name, row.case);
      assert.equal(it.family, row.family);
    }
    for (const it of l.healthConnect) assert.ok(canon.hcByClass.has(it.id), `${l.slug}: ${it.id} is not in healthConnectRecords.ts`);
    for (const u of l.unmatched) {
      const hits = gen.extract(gen.codeLines(u.quote), scanFor(l.slug, u.path));
      const h = hits.find((x) => x.token === u.token);
      assert.ok(h, `${l.slug}: unmatched ${u.token} not on its line`);
      assert.equal(gen.resolve(h, canon), null, `${l.slug}: ${u.token} matches exactly, so it is not unmatched`);
    }
    const ids = [...l.healthkit, ...l.healthConnect].map((i) => i.id);
    assert.equal(new Set(ids).size, ids.length, `${l.slug}: duplicate rows`);
  }
});

test("a negative statement is allowed only when nothing that could map the store was left out", () => {
  const blocking = data.HEALTH_LIBRARY_SUPPORT_EXCLUDED.some((e) => e.affectsCompleteness);
  assert.equal(data.HEALTH_LIBRARY_SUPPORT_COMPLETE.healthkit, !blocking);
  assert.equal(data.HEALTH_LIBRARY_SUPPORT_COMPLETE.healthConnect, !blocking);
});
