/**
 * Tests for src/lib/codeRosetta.mjs, the code mode of
 * /tools/identifier-translator.
 *
 * Run: npm run test:code-rosetta   (node --test; Node strips the data modules' types)
 *
 * The snippets are the vendors' own code samples, copied from the pages
 * named above each one (read 2026-11-24), plus short hand-written variants
 * of the same shapes. The checks run against the real generated data, so a
 * regeneration that changes a pair, an aggregation or a metric description
 * is caught here too:
 *   - every pair the tool can translate sits in one row of the verified
 *     matrix (the identifier translator's only source);
 *   - every identifier the output writes is a name from the generated data,
 *     a name in REFERENCES (each read from a vendor reference page), a
 *     language keyword, or a local the output itself declares;
 *   - the statistics option and the Health Connect metric agree with
 *     HealthKit's aggregation evidence and Google's metric description.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const src = new URL("../src/", import.meta.url);
const [unified, matrix, hk, hc, lib] = await Promise.all([
  import(new URL("data/unifiedSchema.ts", src).href),
  import(new URL("data/matrix.ts", src).href),
  import(new URL("data/healthkitIdentifiers.ts", src).href),
  import(new URL("data/healthConnectRecords.ts", src).href),
  import(new URL("lib/codeRosetta.mjs", src).href),
]);

const TABLE = lib.buildPairs({
  unifiedRecords: unified.UNIFIED_RECORDS,
  matrixRows: matrix.ROWS,
  hkIdentifiers: hk.HK_IDENTIFIERS,
  hcRecords: hc.HC_RECORDS,
});
const tr = (code) => lib.translate(code, TABLE);

// ── Snippets ───────────────────────────────────────────────────────────────

// https://developer.apple.com/documentation/healthkit/executing-statistics-collection-queries
const APPLE_COLLECTION = `let calendar = Calendar.current

// Create a 1-week interval.
let interval = DateComponents(day: 7)

guard let quantityType = HKObjectType.quantityType(forIdentifier: .stepCount) else {
    fatalError("*** Unable to create a step count type ***")
}

// Create the query.
let query = HKStatisticsCollectionQuery(quantityType: quantityType,
                                        quantitySamplePredicate: nil,
                                        options: .cumulativeSum,
                                        anchorDate: anchorDate,
                                        intervalComponents: interval)

statsCollection.enumerateStatistics(from: startDate, to: endDate)
{ (statistics, stop) in
    if let quantity = statistics.sumQuantity() {
        let value = quantity.doubleValue(for: .count())
    }
}`;

// https://developer.apple.com/documentation/healthkit/executing-anchored-object-queries
const APPLE_ANCHORED = `guard let stepCountType = HKObjectType.quantityType(forIdentifier: .stepCount) else {
    // This should never fail when using a defined constant.
    fatalError("*** Unable to get the step count type ***")
}
let query = HKAnchoredObjectQuery(type: stepCountType,
                                  predicate: nil,
                                  anchor: myAnchor,
                                  limit: HKObjectQueryNoLimit)
{ (query, samplesOrNil, deletedObjectsOrNil, newAnchor, errorOrNil) in
    myAnchor = newAnchor
}
store.execute(query)`;

// https://developer.apple.com/documentation/healthkit/executing-sample-queries (an unpaired type)
const APPLE_SAMPLE_UNPAIRED = `guard let sampleType = HKSampleType.quantityType(forIdentifier: HKQuantityTypeIdentifier.dietaryEnergyConsumed) else {
    fatalError("*** This method should never fail ***")
}
let query = HKSampleQuery(sampleType: sampleType, predicate: nil, limit: Int(HKObjectQueryNoLimit), sortDescriptors: nil) {
    query, results, error in
}
store.execute(query)`;

// The same article's filtered query, on a paired type.
const SWIFT_SAMPLE_HR = `let heartRateType = HKQuantityType(.heartRate)
let today = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
let sortByDate = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
let query = HKSampleQuery(sampleType: heartRateType,
                          predicate: today,
                          limit: 50,
                          sortDescriptors: [sortByDate]) {
    query, results, error in
}`;

// https://developer.apple.com/documentation/healthkit/executing-statistical-queries, on a paired discrete type.
const SWIFT_STATS_WEIGHT = `let bodyMass = HKQuantityType.quantityType(forIdentifier: .bodyMass)!
let today = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
let query = HKStatisticsQuery(quantityType: bodyMass, quantitySamplePredicate: today, options: [.discreteAverage, .discreteMax]) { (query, statisticsOrNil, errorOrNil) in
}
store.execute(query)`;

const SWIFT_STATS_WRONG = `let hr = HKQuantityType(.heartRate)
let query = HKStatisticsQuery(quantityType: hr, quantitySamplePredicate: nil, options: .cumulativeSum) { _, stats, _ in }`;

const SWIFT_HRV = `let query = HKSampleQuery(sampleType: HKQuantityType(.heartRateVariabilitySDNN), predicate: nil, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, _, _ in }`;

const SWIFT_ROW_NOT_ONE_TO_ONE = `let query = HKStatisticsQuery(quantityType: HKQuantityType(.activeEnergyBurned), quantitySamplePredicate: nil, options: .cumulativeSum) { _, _, _ in }`;

const SWIFT_HOURLY = `var interval = DateComponents()
interval.hour = 1
let query = HKStatisticsCollectionQuery(quantityType: HKQuantityType(.heartRate),
    quantitySamplePredicate: nil, options: .discreteAverage, anchorDate: anchor, intervalComponents: interval)`;

// https://developer.android.com/health-and-fitness/health-connect/read-data
const GOOGLE_READ = `val response = healthConnectClient . readRecords (
    ReadRecordsRequest (
        HeartRateRecord :: class ,
        timeRangeFilter = TimeRangeFilter . between ( startTime , endTime )
    )
)
response . records . forEach { record ->
    /* Process records */
}`;

// https://developer.android.com/health-and-fitness/health-connect/read-data
const GOOGLE_AGG_STEPS = `suspend fun readStepsAggregate(startTime: Instant, endTime: Instant): Long {
    val response = healthConnectClient.aggregate(
        AggregateRequest(
            metrics = setOf(StepsRecord.COUNT_TOTAL),
            timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
        )
    )
    return response[StepsRecord.COUNT_TOTAL] ?: 0L
}`;

// https://developer.android.com/health-and-fitness/health-connect/aggregate-data
const GOOGLE_AGG_HR = `suspend fun readHeartRateAggregate(startTime: Instant, endTime: Instant): Pair<Long, Long> {
    val response = healthConnectClient.aggregate(
        AggregateRequest(
            metrics = setOf(HeartRateRecord.BPM_MAX, HeartRateRecord.BPM_MIN),
            timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
        )
    )
    val minimumHeartRate = response[HeartRateRecord.BPM_MIN] ?: 0L
    val maximumHeartRate = response[HeartRateRecord.BPM_MAX] ?: 0L
    return maximumHeartRate to minimumHeartRate
}`;

// https://developer.android.com/health-and-fitness/health-connect/aggregate-data
const GOOGLE_BY_DURATION = `suspend fun aggregateStepsIntoMinutes(
    healthConnectClient: HealthConnectClient,
    startTime: LocalDateTime,
    endTime: LocalDateTime
) {
    try {
        val response =
            healthConnectClient.aggregateGroupByDuration(
                AggregateGroupByDurationRequest(
                    metrics = setOf(StepsRecord.COUNT_TOTAL),
                    timeRangeFilter = TimeRangeFilter.between(startTime, endTime),
                    timeRangeSlicer = Duration.ofMinutes(1L)
                )
            )
        for (durationResult in response) {
            // The result may be null if no data is available in the time range
            val totalSteps = durationResult.result[StepsRecord.COUNT_TOTAL] ?: 0L
        }
    } catch (e: Exception) {
        // Run error handling here
    }
}`;

// https://developer.android.com/health-and-fitness/health-connect/aggregate-data
const GOOGLE_BY_PERIOD = `val response =
    healthConnectClient.aggregateGroupByPeriod(
        AggregateGroupByPeriodRequest(
            metrics = setOf(StepsRecord.COUNT_TOTAL),
            timeRangeFilter = TimeRangeFilter.between(startTime, endTime),
            timeRangeSlicer = Period.ofMonths(1)
        )
    )`;

// https://developer.android.com/health-and-fitness/health-connect/sync-data
const GOOGLE_CHANGES = `val changesToken = healthConnectClient.getChangesToken(
    ChangesTokenRequest(recordTypes = setOf(WeightRecord::class))
)`;

// https://developer.android.com/health-and-fitness/health-connect/aggregate-data (a record with no verified pair)
const GOOGLE_DISTANCE = `suspend fun readDistanceAggregate(startTime: Instant, endTime: Instant): Number {
    val response = healthConnectClient.aggregate(
        AggregateRequest(
            metrics = setOf(DistanceRecord.DISTANCE_TOTAL),
            timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
        )
    )
    return response[DistanceRecord.DISTANCE_TOTAL]?.inMeters ?: 0L
}`;

const KOTLIN_SLEEP_AGG = `val r = healthConnectClient.aggregate(AggregateRequest(metrics = setOf(SleepSessionRecord.SLEEP_DURATION_TOTAL), timeRangeFilter = TimeRangeFilter.between(a, b)))`;

const KOTLIN_READ_WEIGHT = `val response = healthConnectClient.readRecords(
    ReadRecordsRequest(recordType = WeightRecord::class, timeRangeFilter = TimeRangeFilter.between(from, to), ascendingOrder = false, pageSize = 20)
)`;

// ── The vocabulary check ───────────────────────────────────────────────────

const SWIFT_KW = new Set("let var guard else return for in if nil true false func self as try await".split(" "));
const KOTLIN_KW = new Set("val var for in if else when is do while return true false null fun suspend as class".split(" "));

/** Identifiers in code, outside comments and string literals. */
function identifiers(code) {
  const body = code
    .split("\n")
    .map((l) => l.replace(/\/\/.*$/, ""))
    .join("\n")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""');
  // (?<!\w) skips a numeric literal's suffix, the L of 1L.
  return [...body.matchAll(/(?<!\w)[A-Za-z_][A-Za-z0-9_]*/g)].map((m) => m[0]);
}

/** Names the output declares itself: let/val/var, closure parameters, loop variables. */
function locals(code) {
  const out = new Set(["healthConnectClient", "healthStore", "startTime", "endTime", "startDate", "endDate", "context"]);
  for (const m of code.matchAll(/\b(?:let|val|var)\s+([A-Za-z_]\w*)/g)) out.add(m[1]);
  for (const m of code.matchAll(/\bfor\s*\(?\s*([A-Za-z_]\w*)\s+in\b/g)) out.add(m[1]);
  for (const m of code.matchAll(/\{\s*([A-Za-z_][\w,\s]*)\s+in\b/g)) for (const p of m[1].split(",")) out.add(p.trim());
  return out;
}

const DATA_NAMES = new Set([
  ...hk.HK_IDENTIFIERS.flatMap((r) => [r.case, r.objc, r.valueEnum].filter(Boolean)),
  ...hc.HC_RECORDS.flatMap((r) => [r.className, ...r.aggregateMetrics.map((m) => m.name), ...r.properties.map((p) => p.name)]),
]);

function assertVocabulary(result, inputCode) {
  const lang = result.to;
  const ref = lib.REFERENCES[lang];
  const kw = lang === "swift" ? SWIFT_KW : KOTLIN_KW;
  const loc = locals(result.code);
  // Variable names carried over from the input (startDate, today …) are the reader's own.
  const fromInput = new Set(identifiers(inputCode));
  for (const t of identifiers(result.code)) {
    const ok = kw.has(t) || Object.hasOwn(ref, t) || DATA_NAMES.has(t) || loc.has(t) || fromInput.has(t);
    assert.ok(ok, `${lang} output writes "${t}", which is in neither the generated data nor REFERENCES:\n${result.code}`);
  }
}

// ── Pairs ──────────────────────────────────────────────────────────────────

test("every pair sits in one row of the verified matrix", () => {
  assert.ok(TABLE.pairs.length >= 5, `only ${TABLE.pairs.length} pairs`);
  for (const p of TABLE.pairs) {
    const row = matrix.ROWS.find((r) => r.id === p.matrixRow);
    assert.ok(row, `${p.hk.case}: no matrix row ${p.matrixRow}`);
    assert.match(row.apple, new RegExp(`\\.${p.hk.case}\\b`), `${p.hk.case} is not in row ${row.id}'s Apple cell`);
    assert.match(row.android, new RegExp(`\\b${p.hc.className}\\b`), `${p.hc.className} is not in row ${row.id}'s Android cell`);
  }
});

test("no HealthKit identifier or Health Connect record is paired twice", () => {
  const hkSeen = TABLE.pairs.map((p) => p.hk.case);
  const hcSeen = TABLE.pairs.map((p) => p.hc.className);
  assert.equal(new Set(hkSeen).size, hkSeen.length);
  assert.equal(new Set(hcSeen).size, hcSeen.length);
});

test("HRV (SDNN vs RMSSD) is refused as a different measure, from the unified schema's tags", () => {
  const p = TABLE.pairs.find((x) => x.hk.case === "heartRateVariabilitySDNN");
  assert.ok(p);
  assert.equal(p.status, "different-measure");
  assert.match(p.measures.healthkit, /sdnn/);
  assert.match(p.measures.healthConnect, /rmssd/);
});

test("metric kinds are read from Google's descriptions", () => {
  assert.equal(lib.metricKind("Metric identifier to retrieve the total steps count from AggregationResult."), "total");
  assert.equal(lib.metricKind("Metric identifier to retrieve the average heart rate from AggregationResult."), "average");
  assert.equal(lib.metricKind("Metric identifier to retrieve the number of heart rate measurements from AggregationResult."), null);
});

// ── Swift → Kotlin ─────────────────────────────────────────────────────────

test("HKStatisticsCollectionQuery (Apple's weekly step sample) → aggregateGroupByPeriod with COUNT_TOTAL", () => {
  const r = tr(APPLE_COLLECTION);
  assert.equal(r.from, "swift");
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /healthConnectClient\.aggregateGroupByPeriod\(/);
  assert.match(r.code, /AggregateGroupByPeriodRequest\(/);
  assert.match(r.code, /metrics = setOf\(StepsRecord\.COUNT_TOTAL\)/);
  assert.match(r.code, /timeRangeSlicer = Period\.ofWeeks\(1\)/);
  assert.match(r.code, /TimeRangeFilter\.between\(startDate, endDate\)/);
  assert.match(r.code, /not using the Instant class/);
  assert.match(r.code, /android\.permission\.health\.READ_STEPS/);
  assertVocabulary(r, APPLE_COLLECTION);
});

test("HKStatisticsCollectionQuery with interval.hour = 1 → aggregateGroupByDuration(Duration.ofHours(1L)) with BPM_AVG", () => {
  const r = tr(SWIFT_HOURLY);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /aggregateGroupByDuration\(/);
  assert.match(r.code, /timeRangeSlicer = Duration\.ofHours\(1L\)/);
  assert.match(r.code, /HeartRateRecord\.BPM_AVG/);
  assertVocabulary(r, SWIFT_HOURLY);
});

test("HKStatisticsQuery with discrete options → aggregate with the matching WeightRecord metrics", () => {
  const r = tr(SWIFT_STATS_WEIGHT);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /healthConnectClient\.aggregate\(/);
  assert.match(r.code, /setOf\(WeightRecord\.WEIGHT_AVG, WeightRecord\.WEIGHT_MAX\)/);
  assert.match(r.code, /TimeRangeFilter\.between\(startDate, endDate\)/);
  assert.doesNotMatch(r.code, /WARNING/);
  assertVocabulary(r, SWIFT_STATS_WEIGHT);
});

test(".cumulativeSum on a discrete type is flagged with Apple's own sentence", () => {
  const r = tr(SWIFT_STATS_WRONG);
  const ev = hk.HK_IDENTIFIERS.find((x) => x.case === "heartRate").aggregationEvidence;
  assert.match(r.code, /WARNING: \.cumulativeSum needs a cumulative type/);
  assert.ok(r.code.includes(ev), "the warning quotes the aggregationEvidence sentence");
  assert.doesNotMatch(r.code, /val \w+ = response\[HeartRateRecord\.BPM_/, "no metric is described as the total");
});

test("HKSampleQuery on heart rate → readRecords with samples, descending, pageSize", () => {
  const r = tr(SWIFT_SAMPLE_HR);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /healthConnectClient\.readRecords\(/);
  assert.match(r.code, /recordType = HeartRateRecord::class/);
  assert.match(r.code, /ascendingOrder = false/);
  assert.match(r.code, /pageSize = 50/);
  assert.match(r.code, /for \(sample in record\.samples\)/);
  assert.match(r.code, /sample\.beatsPerMinute/);
  assertVocabulary(r, SWIFT_SAMPLE_HR);
});

test("HKAnchoredObjectQuery (Apple's sample) → getChangesToken / getChanges on StepsRecord", () => {
  const r = tr(APPLE_ANCHORED);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /getChangesToken\(\n\s+ChangesTokenRequest\(recordTypes = setOf\(StepsRecord::class\)\)/);
  assert.match(r.code, /is UpsertionChange ->/);
  assert.match(r.code, /is DeletionChange ->/);
  assert.match(r.code, /while \(response\.hasMore\)/);
  assertVocabulary(r, APPLE_ANCHORED);
});

test("an identifier with no verified pair returns the gap, and no Kotlin call", () => {
  const r = tr(APPLE_SAMPLE_UNPAIRED);
  assert.equal(r.ok, false);
  assert.match(r.code, /No verified pair for HKQuantityTypeIdentifier \.dietaryEnergyConsumed/);
  assert.doesNotMatch(r.code, /readRecords|Record::class/);
});

test("a matrix row that is not one-to-one names the row and writes no code", () => {
  const r = tr(SWIFT_ROW_NOT_ONE_TO_ONE);
  assert.equal(r.ok, false);
  assert.match(r.code, /matrix row "Calories"/);
  assert.doesNotMatch(r.code, /aggregate\(/);
});

test("HRV SDNN is refused rather than turned into RMSSD", () => {
  const r = tr(SWIFT_HRV);
  assert.equal(r.ok, false);
  assert.match(r.code, /not the same measurement/);
  assert.doesNotMatch(r.code, /readRecords/);
});

test("an identifier that is not in Apple's list is not guessed", () => {
  const r = tr("let q = HKSampleQuery(sampleType: HKQuantityType(.stepsCount), predicate: nil, limit: 1, sortDescriptors: nil) { _, _, _ in }");
  assert.equal(r.ok, false);
  assert.match(r.code, /"stepsCount" is not an identifier in this site's HealthKit list/);
});

test("an unsupported query class says so", () => {
  const r = tr("let q = HKObserverQuery(sampleType: HKQuantityType(.stepCount), predicate: nil) { _, _, _ in }");
  assert.equal(r.ok, false);
  assert.match(r.code, /HKObserverQuery is not one of the shapes/);
});

// ── Kotlin → Swift ─────────────────────────────────────────────────────────

test("readRecords (Google's heart-rate sample) → HKSampleQuery with HKQuantityType(.heartRate) and count/min", () => {
  const r = tr(GOOGLE_READ);
  assert.equal(r.from, "kotlin");
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /let sampleType = HKQuantityType\(\.heartRate\)/);
  assert.match(r.code, /HKQuery\.predicateForSamples\(withStart: startTime, end: endTime, options: \[\]\)/);
  assert.match(r.code, /HKSampleQuery\(sampleType: sampleType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil\)/);
  assert.match(r.code, /results as\? \[HKQuantitySample\]/);
  assert.match(r.code, /doubleValue\(for: HKUnit\(from: "count\/min"\)\)/);
  assert.match(r.code, /healthStore\.execute\(query\)/);
  assertVocabulary(r, GOOGLE_READ);
});

test("readRecords with ascendingOrder = false and pageSize → sort descriptor and limit", () => {
  const r = tr(KOTLIN_READ_WEIGHT);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /HKQuantityType\(\.bodyMass\)/);
  assert.match(r.code, /NSSortDescriptor\(key: HKSampleSortIdentifierStartDate, ascending: false\)/);
  assert.match(r.code, /limit: 20/);
  assert.match(r.code, /HKUnit\(from: "kg"\)/);
  assertVocabulary(r, KOTLIN_READ_WEIGHT);
});

test("aggregate COUNT_TOTAL (Google's step sample) → HKStatisticsQuery .cumulativeSum, with Apple's evidence", () => {
  const r = tr(GOOGLE_AGG_STEPS);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /HKStatisticsQuery\(quantityType: quantityType, quantitySamplePredicate: predicate, options: \.cumulativeSum\)/);
  assert.match(r.code, /statistics\.sumQuantity\(\)\?\.doubleValue\(for: HKUnit\(from: "count"\)\)/);
  const ev = hk.HK_IDENTIFIERS.find((x) => x.case === "stepCount").aggregationEvidence;
  assert.ok(r.code.includes(ev));
  assertVocabulary(r, GOOGLE_AGG_STEPS);
});

test("aggregate BPM_MAX + BPM_MIN (Google's heart-rate sample) → [.discreteMax, .discreteMin]", () => {
  const r = tr(GOOGLE_AGG_HR);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /options: \[\.discreteMax, \.discreteMin\]/);
  assert.match(r.code, /maximumQuantity\(\)/);
  assert.match(r.code, /minimumQuantity\(\)/);
  assertVocabulary(r, GOOGLE_AGG_HR);
});

test("aggregateGroupByDuration (Google's per-minute step sample) → HKStatisticsCollectionQuery with DateComponents(minute: 1)", () => {
  const r = tr(GOOGLE_BY_DURATION);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /let interval = DateComponents\(minute: 1\)/);
  assert.match(r.code, /HKStatisticsCollectionQuery\(quantityType: quantityType, quantitySamplePredicate: predicate, options: \.cumulativeSum, anchorDate: startTime, intervalComponents: interval\)/);
  assert.match(r.code, /query\.initialResultsHandler = /);
  assert.match(r.code, /collection\.enumerateStatistics\(from: startTime, to: endTime\)/);
  assertVocabulary(r, GOOGLE_BY_DURATION);
});

test("aggregateGroupByPeriod (Google's monthly step sample) → DateComponents(month: 1)", () => {
  const r = tr(GOOGLE_BY_PERIOD);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /DateComponents\(month: 1\)/);
  assertVocabulary(r, GOOGLE_BY_PERIOD);
});

test("getChangesToken (Google's sync sample) → HKAnchoredObjectQuery on .bodyMass", () => {
  const r = tr(GOOGLE_CHANGES);
  assert.equal(r.ok, true, r.code);
  assert.match(r.code, /HKAnchoredObjectQuery\(type: HKQuantityType\(\.bodyMass\), predicate: nil, anchor: anchor, limit: HKObjectQueryNoLimit\)/);
  assert.match(r.code, /deleted\.uuid/);
  assert.match(r.code, /query\.updateHandler = /);
  assertVocabulary(r, GOOGLE_CHANGES);
});

test("a record with no verified pair (Google's distance sample) returns the gap", () => {
  const r = tr(GOOGLE_DISTANCE);
  assert.equal(r.ok, false);
  assert.match(r.code, /No verified pair for DistanceRecord/);
  assert.doesNotMatch(r.code, /HKStatisticsQuery\(/);
});

test("a category type has no statistics query", () => {
  const r = tr(KOTLIN_SLEEP_AGG);
  assert.equal(r.ok, false);
  assert.match(r.code, /HKCategoryType\(\.sleepAnalysis\) is a category type/);
  assert.doesNotMatch(r.code, /HKStatisticsQuery\(/);
});

test("an unknown record class is not guessed", () => {
  const r = tr("val r = healthConnectClient.readRecords(ReadRecordsRequest(recordType = StepRecord::class, timeRangeFilter = TimeRangeFilter.between(a, b)))");
  assert.equal(r.ok, false);
  assert.match(r.code, /StepRecord is not a record class in this site's Health Connect list/);
});

test("round trip: Swift → Kotlin → Swift keeps the type and the statistics option", () => {
  const k = tr(SWIFT_STATS_WEIGHT);
  const s = tr(k.code);
  assert.equal(s.from, "kotlin");
  assert.equal(s.ok, true, s.code);
  assert.match(s.code, /HKQuantityType\(\.bodyMass\)/);
  assert.match(s.code, /\[\.discreteAverage, \.discreteMax\]/);
});

test("undetectable input asks for a snippet", () => {
  assert.equal(tr("hello world").ok, false);
  assert.equal(tr("hello world").from, null);
});
