/**
 * Code Rosetta: a HealthKit read in Swift → the Health Connect read in
 * Kotlin, and the common Kotlin shapes back to Swift. The "code" mode of
 * /tools/identifier-translator; tests in scripts/code-rosetta.test.mjs.
 *
 * A small parser, not a model. It recognises the query shapes below by
 * their API names, pulls out the type, the statistics options, the bucket
 * size and the date range, and writes the other platform's call from a
 * template. Anything it cannot place is said in a comment, never guessed.
 *
 *   Swift HKSampleQuery                  ↔ Kotlin readRecords(ReadRecordsRequest)
 *   Swift HKStatisticsQuery              ↔ Kotlin aggregate(AggregateRequest)
 *   Swift HKStatisticsCollectionQuery    ↔ Kotlin aggregateGroupByDuration / aggregateGroupByPeriod
 *   Swift HKAnchoredObjectQuery          ↔ Kotlin getChangesToken / getChanges
 *
 * Which types translate. Only the one-to-one pairs `buildPairs` derives from
 * the site's data: a HealthKit identifier and a Health Connect record that
 * sit in the same row of the verified matrix (src/data/matrix.ts, the
 * identifier translator's only source), where either the row holds exactly
 * one of each or the generated unified schema (src/data/unifiedSchema.ts)
 * maps the two to the same record with field-level evidence. A pair the
 * unified schema tags with different measures (HRV: sdnn vs rmssd) is
 * refused. Everything else gets a "no verified pair" comment.
 *
 * Sum or average. The statistics option (.cumulativeSum vs .discreteAverage
 * and friends) and the Health Connect metric come from the data, never from
 * a name: HealthKit's `aggregation` and its `aggregationEvidence` sentence
 * (src/data/healthkitIdentifiers.ts), and the Health Connect metric whose
 * own description in src/data/healthConnectRecords.ts says "total",
 * "average", "minimum" or "maximum".
 *
 * Every API name this module writes is a field of the generated data
 * (identifier, record, metric, property, permission) or one of the names in
 * REFERENCES, each read from the page listed there on 2026-11-24:
 *
 * Apple (developer.apple.com/tutorials/data/documentation/healthkit/<page>.json):
 *   https://developer.apple.com/documentation/healthkit/hksamplequery
 *   https://developer.apple.com/documentation/healthkit/hkstatisticsquery
 *   https://developer.apple.com/documentation/healthkit/hkstatisticscollectionquery
 *   https://developer.apple.com/documentation/healthkit/hkanchoredobjectquery
 *   https://developer.apple.com/documentation/healthkit/hkstatisticsoptions
 *   https://developer.apple.com/documentation/healthkit/hkstatistics
 *   https://developer.apple.com/documentation/healthkit/hkstatisticscollection
 *   https://developer.apple.com/documentation/healthkit/hkquery
 *   https://developer.apple.com/documentation/healthkit/hkquery/predicateforsamples(withstart:end:options:)
 *   https://developer.apple.com/documentation/healthkit/hkqueryoptions
 *   https://developer.apple.com/documentation/healthkit/hkhealthstore
 *   https://developer.apple.com/documentation/healthkit/hkhealthstore/execute(_:)
 *   https://developer.apple.com/documentation/healthkit/hkquantitytype
 *   https://developer.apple.com/documentation/healthkit/hkcategorytype
 *   https://developer.apple.com/documentation/healthkit/hkobjecttype
 *   https://developer.apple.com/documentation/healthkit/hkquantity
 *   https://developer.apple.com/documentation/healthkit/hkquantitysample
 *   https://developer.apple.com/documentation/healthkit/hkcategorysample
 *   https://developer.apple.com/documentation/healthkit/hksample
 *   https://developer.apple.com/documentation/healthkit/hkunit
 *   https://developer.apple.com/documentation/healthkit/hkunit/init(from:)-9qont
 *   https://developer.apple.com/documentation/healthkit/hkdeletedobject
 *   https://developer.apple.com/documentation/healthkit/hkqueryanchor
 *   https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis
 *   https://developer.apple.com/documentation/healthkit/executing-sample-queries
 *   https://developer.apple.com/documentation/healthkit/executing-statistical-queries
 *   https://developer.apple.com/documentation/healthkit/executing-statistics-collection-queries
 *   https://developer.apple.com/documentation/healthkit/executing-anchored-object-queries
 * Android (developer.android.com, ?hl=en):
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/request/ReadRecordsRequest
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/response/ReadRecordsResponse
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/time/TimeRangeFilter
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/request/AggregateRequest
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/request/AggregateGroupByDurationRequest
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/request/AggregateGroupByPeriodRequest
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/aggregate/AggregationResult
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/aggregate/AggregationResultGroupedByDuration
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/aggregate/AggregationResultGroupedByPeriod
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/request/ChangesTokenRequest
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/response/ChangesResponse
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/changes/UpsertionChange
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/changes/DeletionChange
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/HeartRateRecord.Sample
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/units/Mass
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/units/Length
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/units/Percentage
 *   https://developer.android.com/reference/java/time/Duration
 *   https://developer.android.com/reference/java/time/Period
 *   https://developer.android.com/reference/java/time/Instant
 *   https://developer.android.com/health-and-fitness/health-connect/read-data
 *   https://developer.android.com/health-and-fitness/health-connect/aggregate-data
 *   https://developer.android.com/health-and-fitness/health-connect/sync-data
 *
 * Nothing leaves the browser: the tool runs this module on the pasted text
 * in the page.
 */

export const ROSETTA_READ_ON = "2026-11-24";

const A = "https://developer.apple.com/documentation/healthkit/";
const G = "https://developer.android.com/reference/kotlin/androidx/health/connect/client/";

/**
 * Every platform API name the emitters write, with the page it was read
 * from. The test holds every emitted identifier to this list plus the
 * generated data, so a template that drifts from a fetched name fails.
 */
export const REFERENCES = {
  swift: {
    HKSampleQuery: `${A}hksamplequery`,
    sampleType: `${A}hksamplequery/init(sampletype:predicate:limit:sortdescriptors:resultshandler:)`,
    predicate: `${A}hksamplequery/init(sampletype:predicate:limit:sortdescriptors:resultshandler:)`,
    limit: `${A}hksamplequery/limit`,
    sortDescriptors: `${A}hksamplequery/sortdescriptors`,
    HKObjectQueryNoLimit: `${A}hkobjectquerynolimit`,
    HKStatisticsQuery: `${A}hkstatisticsquery`,
    quantityType: `${A}hkstatisticsquery/init(quantitytype:quantitysamplepredicate:options:completionhandler:)`,
    quantitySamplePredicate: `${A}hkstatisticsquery/init(quantitytype:quantitysamplepredicate:options:completionhandler:)`,
    options: `${A}hkstatisticsoptions`,
    HKStatisticsCollectionQuery: `${A}hkstatisticscollectionquery`,
    anchorDate: `${A}hkstatisticscollectionquery/anchordate`,
    intervalComponents: `${A}hkstatisticscollectionquery/intervalcomponents`,
    initialResultsHandler: `${A}hkstatisticscollectionquery/initialresultshandler`,
    enumerateStatistics: `${A}hkstatisticscollection/enumeratestatistics(from:to:with:)`,
    to: `${A}hkstatisticscollection/enumeratestatistics(from:to:with:)`,
    HKAnchoredObjectQuery: `${A}hkanchoredobjectquery`,
    type: `${A}hkanchoredobjectquery/init(type:predicate:anchor:limit:resultshandler:)`,
    anchor: `${A}hkanchoredobjectquery/init(type:predicate:anchor:limit:resultshandler:)`,
    updateHandler: `${A}hkanchoredobjectquery/updatehandler`,
    HKQueryAnchor: `${A}hkqueryanchor`,
    HKDeletedObject: `${A}hkdeletedobject`,
    uuid: `${A}hkdeletedobject/uuid`,
    cumulativeSum: `${A}hkstatisticsoptions/cumulativesum`,
    discreteAverage: `${A}hkstatisticsoptions/discreteaverage`,
    discreteMin: `${A}hkstatisticsoptions/discretemin`,
    discreteMax: `${A}hkstatisticsoptions/discretemax`,
    sumQuantity: `${A}hkstatistics/sumquantity()`,
    averageQuantity: `${A}hkstatistics/averagequantity()`,
    minimumQuantity: `${A}hkstatistics/minimumquantity()`,
    maximumQuantity: `${A}hkstatistics/maximumquantity()`,
    HKQuery: `${A}hkquery`,
    predicateForSamples: `${A}hkquery/predicateforsamples(withstart:end:options:)`,
    withStart: `${A}hkquery/predicateforsamples(withstart:end:options:)`,
    end: `${A}hkquery/predicateforsamples(withstart:end:options:)`,
    execute: `${A}hkhealthstore/execute(_:)`,
    HKQuantityType: `${A}hkquantitytype`,
    HKCategoryType: `${A}hkcategorytype`,
    HKQuantitySample: `${A}hkquantitysample`,
    HKCategorySample: `${A}hkcategorysample`,
    quantity: `${A}hkquantitysample/quantity`,
    value: `${A}hkcategorysample/value`,
    doubleValue: `${A}hkquantity/doublevalue(for:)`,
    HKUnit: `${A}hkunit`,
    percent: `${A}hkunit/percent()`,
    from: `${A}hkunit/init(from:)-9qont`,
    rawValue: `${A}hkcategoryvaluesleepanalysis/init(rawvalue:)`,
    NSSortDescriptor: `${A}hksamplequery/init(sampletype:predicate:limit:sortdescriptors:resultshandler:)`,
    key: `${A}executing-sample-queries`,
    ascending: `${A}executing-sample-queries`,
    HKSampleSortIdentifierStartDate: `${A}hksamplesortidentifierstartdate`,
    DateComponents: `${A}hkstatisticscollectionquery/init(quantitytype:quantitysamplepredicate:options:anchordate:intervalcomponents:)`,
    day: `${A}executing-statistics-collection-queries`,
    hour: `${A}executing-statistics-collection-queries`,
    minute: `${A}executing-statistics-collection-queries`,
    second: `${A}executing-statistics-collection-queries`,
    month: `${A}executing-sample-queries`,
  },
  kotlin: {
    HealthConnectClient: `${G}HealthConnectClient`,
    readRecords: `${G}HealthConnectClient#readRecords(androidx.health.connect.client.request.ReadRecordsRequest)`,
    aggregate: `${G}HealthConnectClient#aggregate(androidx.health.connect.client.request.AggregateRequest)`,
    aggregateGroupByDuration: `${G}HealthConnectClient#aggregateGroupByDuration(androidx.health.connect.client.request.AggregateGroupByDurationRequest)`,
    aggregateGroupByPeriod: `${G}HealthConnectClient#aggregateGroupByPeriod(androidx.health.connect.client.request.AggregateGroupByPeriodRequest)`,
    getChangesToken: `${G}HealthConnectClient#getChangesToken(androidx.health.connect.client.request.ChangesTokenRequest)`,
    getChanges: `${G}HealthConnectClient#getChanges(kotlin.String)`,
    ReadRecordsRequest: `${G}request/ReadRecordsRequest`,
    recordType: `${G}request/ReadRecordsRequest`,
    timeRangeFilter: `${G}request/ReadRecordsRequest`,
    ascendingOrder: `${G}request/ReadRecordsRequest`,
    pageSize: `${G}request/ReadRecordsRequest`,
    pageToken: `${G}response/ReadRecordsResponse#pageToken()`,
    records: `${G}response/ReadRecordsResponse#records()`,
    TimeRangeFilter: `${G}time/TimeRangeFilter`,
    between: `${G}time/TimeRangeFilter#between(java.time.Instant,java.time.Instant)`,
    AggregateRequest: `${G}request/AggregateRequest`,
    metrics: `${G}request/AggregateRequest`,
    // Kotlin's standard setOf, as Google's own samples build the metrics and record-type sets.
    setOf: "https://developer.android.com/health-and-fitness/health-connect/aggregate-data",
    AggregateGroupByDurationRequest: `${G}request/AggregateGroupByDurationRequest`,
    AggregateGroupByPeriodRequest: `${G}request/AggregateGroupByPeriodRequest`,
    timeRangeSlicer: `${G}request/AggregateGroupByDurationRequest`,
    result: `${G}aggregate/AggregationResultGroupedByDuration#result()`,
    ChangesTokenRequest: `${G}request/ChangesTokenRequest`,
    recordTypes: `${G}request/ChangesTokenRequest`,
    changes: `${G}response/ChangesResponse#changes()`,
    nextChangesToken: `${G}response/ChangesResponse#nextChangesToken()`,
    hasMore: `${G}response/ChangesResponse#hasMore()`,
    UpsertionChange: `${G}changes/UpsertionChange`,
    record: `${G}changes/UpsertionChange#record()`,
    DeletionChange: `${G}changes/DeletionChange`,
    recordId: `${G}changes/DeletionChange#recordId()`,
    samples: `${G}records/HeartRateRecord#samples()`,
    beatsPerMinute: `${G}records/HeartRateRecord.Sample#beatsPerMinute()`,
    inKilograms: `${G}units/Mass#inKilograms()`,
    inMeters: `${G}units/Length#inMeters()`,
    value: `${G}units/Percentage#value()`,
    Duration: "https://developer.android.com/reference/java/time/Duration",
    ofDays: "https://developer.android.com/reference/java/time/Duration#ofDays(long)",
    ofHours: "https://developer.android.com/reference/java/time/Duration#ofHours(long)",
    ofMinutes: "https://developer.android.com/reference/java/time/Duration#ofMinutes(long)",
    ofSeconds: "https://developer.android.com/reference/java/time/Duration#ofSeconds(long)",
    Period: "https://developer.android.com/reference/java/time/Period",
    ofWeeks: "https://developer.android.com/reference/java/time/Period#ofWeeks(int)",
    ofMonths: "https://developer.android.com/reference/java/time/Period#ofMonths(int)",
  },
};

/** Sentences quoted from the pages above, so the emitted comments carry the source's words. */
const QUOTES = {
  timeRange: "use between for a closed-ended time range, inclusive-exclusive", // TimeRangeFilter
  aggregateNull: "The result may be null if no data is available in the time range", // aggregate-data guide
  sparse: "Note that the list can be sparse, so a bucket is not included in the list if it doesn't contain any data.", // aggregate-data guide
  periodInstant:
    "When running bucket aggregates per period, make sure that the start and end times set are not using the Instant class. Otherwise, the app returns an IllegalStateException.", // aggregate-data guide
  slicer:
    "timeRangeFilter will be sliced into several equal-sized time buckets (except for the last one).", // AggregateGroupByDurationRequest
  pageToken:
    "an optional page token to use for androidx.health.connect.client.request.ReadRecordsRequest.pageToken in the next request if more records can be fetched; contains value null if no more pages.", // ReadRecordsResponse
  tokenExpiry: "Since an unused Changes token expires within 30 days, you must use a sync strategy that avoids losing information in such a case.", // sync-data guide
  noLimit: "HKObjectQueryNoLimit", // HKSampleQuery
  percent: "The percent unit measures a value between 0.0 and 1.0.", // HKUnit init(from:)
};

const SITE = "https://aifitnessapi.com";

// ── Pairs, from the site's data ────────────────────────────────────────────

const HK_TOKEN = /(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g; // same parse as the identifier translator
const HC_TOKEN = /\b([A-Z][A-Za-z0-9]*(?:Record|Route))\b/g;

/** The kind a Health Connect metric's own description names, or null. */
export function metricKind(description) {
  const m = /\b(total|average|maximum|minimum)\b/i.exec(description ?? "");
  return m ? m[1].toLowerCase() : null;
}

/** HKStatisticsOptions ↔ the metric kind, and which HealthKit aggregation each needs. */
const OPTION_KIND = {
  cumulativeSum: { kind: "total", aggregation: "cumulative", getter: "sumQuantity" },
  discreteAverage: { kind: "average", aggregation: "discrete", getter: "averageQuantity" },
  discreteMin: { kind: "minimum", aggregation: "discrete", getter: "minimumQuantity" },
  discreteMax: { kind: "maximum", aggregation: "discrete", getter: "maximumQuantity" },
};
const KIND_OPTION = Object.fromEntries(Object.entries(OPTION_KIND).map(([o, v]) => [v.kind, o]));
const STAT_OPTIONS = ["cumulativeSum", "discreteAverage", "discreteMin", "discreteMax", "mostRecent", "duration", "separateBySource"];

/** "read with doubleValue(for:) in count/min" → "count/min"; the unit string Apple's HKUnit(from:) takes. */
function unitFromConversion(conversion) {
  const m = /\bin (\S+)$/.exec(conversion ?? "");
  return m ? m[1] : null;
}

/**
 * Build the pair table the tool and the tests use.
 *
 * @param {{ unifiedRecords: any[], matrixRows: any[], hkIdentifiers: any[], hcRecords: any[] }} d
 */
export function buildPairs({ unifiedRecords, matrixRows, hkIdentifiers, hcRecords }) {
  const hkByCase = new Map(hkIdentifiers.map((r) => [r.case.toLowerCase(), r]));
  const hcByClass = new Map(hcRecords.map((r) => [r.className, r]));

  const rows = matrixRows.map((row) => {
    const apple = [...new Set([...row.apple.matchAll(HK_TOKEN)].map((m) => m[1]))].filter((c) => {
      const r = hkByCase.get(c.toLowerCase());
      return r && (r.family === "quantity" || r.family === "category");
    });
    const android = [...new Set([...row.android.matchAll(HC_TOKEN)].map((m) => m[1]))].filter((c) => hcByClass.has(c));
    return { row, apple, android };
  });

  const unified = new Map();
  for (const u of unifiedRecords) {
    const hkType = u.platforms?.healthkit?.type;
    const hcType = u.platforms?.["health-connect"]?.type;
    if (hkType?.status !== "mapped" || hcType?.status !== "mapped") continue;
    const hkCase = /TypeIdentifier\.(\w+)$/.exec(hkType.type ?? "")?.[1];
    if (!hkCase) continue;
    unified.set(`${hkCase.toLowerCase()}|${hcType.type}`, u);
  }

  const pairs = [];
  const seen = new Set();
  for (const { row, apple, android } of rows) {
    const candidates = [];
    if (apple.length === 1 && android.length === 1) candidates.push([apple[0], android[0], "row"]);
    for (const a of apple) for (const b of android) if (unified.has(`${a.toLowerCase()}|${b}`)) candidates.push([a, b, "unified"]);
    for (const [a, b, how] of candidates) {
      const key = `${a.toLowerCase()}|${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const hk = hkByCase.get(a.toLowerCase());
      const hc = hcByClass.get(b);
      const u = unified.get(key) ?? null;
      pairs.push(makePair(row, hk, hc, u, how));
    }
  }

  const rowOf = new Map();
  for (const { row, apple, android } of rows) {
    for (const a of apple) rowOf.set(`hk:${a.toLowerCase()}`, row);
    for (const b of android) rowOf.set(`hc:${b}`, row);
  }
  const rowsOut = rows.map(({ row, apple, android }) => ({ id: row.id, label: row.label, apple, android, watchOut: row.watchOut ?? null }));
  const hkRow = Object.fromEntries([...rowOf].filter(([k]) => k.startsWith("hk:")).map(([k, r]) => [k.slice(3), r.id]));
  const hcRow = Object.fromEntries([...rowOf].filter(([k]) => k.startsWith("hc:")).map(([k, r]) => [k.slice(3), r.id]));

  return {
    pairs,
    rows: rowsOut,
    hkRow,
    hcRow,
    // Quantity and category identifiers only: the families a query reads.
    hkNames: hkIdentifiers.filter((r) => r.family === "quantity" || r.family === "category").map((r) => ({ c: r.case, o: r.objc, f: r.family })),
    hcNames: hcRecords.map((r) => r.className),
  };
}

function makePair(row, hk, hc, u, how) {
  const hkMetric = u?.platforms?.healthkit?.fields?.metric?.conversion ?? null;
  const hcMetric = u?.platforms?.["health-connect"]?.fields?.metric?.conversion ?? null;
  const differentMeasure = Boolean(hkMetric && hcMetric && hkMetric !== hcMetric);

  // Value fields, only where the unified schema maps them with evidence.
  let hkUnit = null;
  let hkPercent = false;
  let hcValue = null;
  let fieldName = null;
  if (u) {
    const valueField = (u.valueFields ?? []).find((f) => !["time", "utcOffset", "startTime", "endTime", "startUtcOffset", "endUtcOffset", "metric"].includes(f.name));
    if (valueField) {
      fieldName = valueField.name;
      const hkf = u.platforms.healthkit.fields[valueField.name];
      const hcf = u.platforms["health-connect"].fields[valueField.name];
      if (hkf?.status === "mapped") {
        hkUnit = unitFromConversion(hkf.conversion);
        hkPercent = /percent unit family/.test(hkf.platformType ?? "");
      }
      if (hcf?.status === "mapped" && hcf.field) {
        const samples = /^samples\[\]\.(\w+)$/.exec(hcf.field);
        const accessor = /\((in[A-Z]\w*)\)/.exec(hcf.conversion ?? "")?.[1] ?? (hcf.platformType === "Percentage" ? "value" : null);
        if (samples) hcValue = { samples: true, field: samples[1], accessor: null };
        else if (/^\w+$/.test(hcf.field)) hcValue = { samples: false, field: hcf.field, accessor };
        else if (/^stages\[\]/.test(hcf.field)) hcValue = { samples: false, field: "stages", accessor: null };
      }
    }
  }

  return {
    status: differentMeasure ? "different-measure" : "pair",
    matrixRow: row.id,
    matrixLabel: row.label,
    how,
    unifiedId: u?.id ?? null,
    note: (u?.notes ?? []).find(Boolean) ?? null,
    watchOut: row.watchOut ?? null,
    measures: differentMeasure ? { healthkit: hkMetric, healthConnect: hcMetric } : null,
    field: fieldName,
    hk: {
      case: hk.case,
      objc: hk.objc,
      family: hk.family,
      familyType: hk.familyType,
      typeClass: hk.family === "category" ? "HKCategoryType" : "HKQuantityType",
      sampleClass: hk.family === "category" ? "HKCategorySample" : "HKQuantitySample",
      aggregation: hk.aggregation,
      aggregationEvidence: hk.aggregationEvidence,
      unitFamily: hk.unitFamily,
      valueEnum: hk.valueEnum,
      unit: hkUnit,
      percent: hkPercent,
      docUrl: hk.docUrl,
    },
    hc: {
      className: hc.className,
      shape: hc.recordShape,
      readPermissions: hc.readPermissions,
      sourceUrl: hc.sourceUrl,
      metrics: hc.aggregateMetrics.map((m) => ({ name: m.name, valueType: m.valueType, description: m.description, kind: metricKind(m.description) })),
      properties: hc.properties
        .filter((p) => !["metadata", "startTime", "endTime", "startZoneOffset", "endZoneOffset", "time", "zoneOffset"].includes(p.name))
        .map((p) => ({ name: p.name, type: p.type })),
      value: hcValue,
    },
  };
}

// ── Parsing ────────────────────────────────────────────────────────────────

function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, "");
}

/** "swift" | "kotlin" | null, from the API names in the text. */
export function detectLanguage(code) {
  const c = stripComments(code);
  const swift = /\bHK[A-Z]\w*|\blet\s+\w+\s*=|\bguard\s+let\b/.test(c);
  const kotlin = /\b(?:readRecords|aggregateGroupByDuration|aggregateGroupByPeriod|aggregate|getChangesToken|getChanges)\s*\(|::class|\bval\s+\w+|\bsuspend\s+fun\b/.test(c);
  if (swift && !kotlin) return "swift";
  if (kotlin && !swift) return "kotlin";
  if (swift && kotlin) return /\bHK(?:Sample|Statistics|StatisticsCollection|AnchoredObject)Query\b/.test(c) ? "swift" : "kotlin";
  return null;
}

const SIMPLE = /^[A-Za-z_][A-Za-z0-9_]*$/;

function parseSwift(code) {
  const c = stripComments(code);
  const shape = /\bHKStatisticsCollectionQuery\s*\(/.test(c)
    ? "HKStatisticsCollectionQuery"
    : /\bHKStatisticsQuery\s*\(/.test(c)
      ? "HKStatisticsQuery"
      : /\bHKAnchoredObjectQuery\s*\(/.test(c)
        ? "HKAnchoredObjectQuery"
        : /\bHKSampleQuery\s*\(/.test(c)
          ? "HKSampleQuery"
          : null;
  const other = /\b(HK\w*Query(?:Descriptor)?)\b/.exec(c)?.[1] ?? null;

  const ids = [];
  const push = (name, how) => {
    if (!ids.some((x) => x.name.toLowerCase() === name.toLowerCase())) ids.push({ name, how });
  };
  const patterns = [
    [/\bHK(?:Quantity|Category)TypeIdentifier\.([A-Za-z]\w*)/g, "swift"],
    [/\bHK(?:Quantity|Category)TypeIdentifier([A-Z]\w*)/g, "objc"],
    [/\b(?:quantityType|categoryType)\s*\(\s*forIdentifier\s*:\s*\.([A-Za-z]\w*)/g, "swift"],
    [/\bHK(?:Quantity|Category)Type\s*\(\s*\.([A-Za-z]\w*)\s*\)/g, "swift"],
  ];
  const hits = [];
  for (const [re, how] of patterns) for (const m of c.matchAll(re)) hits.push({ at: m.index, name: m[1], how });
  hits.sort((a, b) => a.at - b.at);
  for (const h of hits) push(h.name, h.how);

  const options = [];
  for (const m of c.matchAll(/\boptions\s*:\s*(\[[^\]]*\]|(?:HKStatisticsOptions)?\.[A-Za-z]+)/g)) {
    for (const w of m[1].matchAll(/\.([A-Za-z]+)/g)) if (STAT_OPTIONS.includes(w[1]) && !options.includes(w[1])) options.push(w[1]);
  }

  let interval = null;
  const dc = /\bDateComponents\s*\(\s*(day|hour|minute|second|weekOfYear|month|year)\s*:\s*(\d+)\s*\)/.exec(c);
  if (dc) interval = { unit: dc[1], n: Number(dc[2]) };
  else {
    const set = /\.(day|hour|minute|second|weekOfYear|month|year)\s*=\s*(\d+)/.exec(c);
    if (set) interval = { unit: set[1], n: Number(set[2]) };
  }

  let range = null;
  const p = /\bpredicateForSamples\s*\(\s*withStart\s*:\s*([^,]+?)\s*,\s*end\s*:\s*([^,]+?)\s*,/.exec(c);
  if (p) range = { start: p[1], end: p[2] };
  const en = /\benumerateStatistics\s*\(\s*from\s*:\s*([^,]+?)\s*,\s*to\s*:\s*([^)]+?)\s*\)/.exec(c);
  if (!range && en) range = { start: en[1], end: en[2] };

  const limitM = /\blimit\s*:\s*(?:Int\s*\(\s*)?(HKObjectQueryNoLimit|\d+)/.exec(c);
  const limit = limitM && limitM[1] !== "HKObjectQueryNoLimit" ? Number(limitM[1]) : null;
  const ascM = /\bascending\s*:\s*(true|false)/.exec(c);
  const ascending = ascM ? ascM[1] === "true" : null;
  return { shape, other, ids, options, interval, range, limit, ascending };
}

function parseKotlin(code) {
  const c = stripComments(code);
  const shape = /\baggregateGroupByDuration\s*\(/.test(c)
    ? "aggregateGroupByDuration"
    : /\baggregateGroupByPeriod\s*\(/.test(c)
      ? "aggregateGroupByPeriod"
      : /\baggregate\s*\(/.test(c)
        ? "aggregate"
        : /\bgetChangesToken\s*\(/.test(c) || /\bgetChanges\s*\(/.test(c)
          ? "getChanges"
          : /\breadRecords\s*\(/.test(c)
            ? "readRecords"
            : null;
  const classes = [];
  for (const m of c.matchAll(/\b([A-Z][A-Za-z0-9]*Record)\b/g)) if (!classes.includes(m[1])) classes.push(m[1]);
  const metrics = [];
  for (const m of c.matchAll(/\b([A-Z][A-Za-z0-9]*Record)\.([A-Z][A-Z0-9_]+)\b/g)) {
    if (!metrics.some((x) => x.record === m[1] && x.name === m[2])) metrics.push({ record: m[1], name: m[2] });
  }
  let slicer = null;
  const d = /\bDuration\s*\.\s*of(Days|Hours|Minutes|Seconds)\s*\(\s*(\d+)L?\s*\)/.exec(c);
  if (d) slicer = { kind: "duration", unit: d[1].toLowerCase(), n: Number(d[2]) };
  const pe = /\bPeriod\s*\.\s*of(Days|Weeks|Months|Years)\s*\(\s*(\d+)\s*\)/.exec(c);
  if (pe) slicer = { kind: "period", unit: pe[1].toLowerCase(), n: Number(pe[2]) };
  let range = null;
  const b = /\bTimeRangeFilter\s*\.\s*between\s*\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)/.exec(c);
  if (b) range = { start: b[1], end: b[2] };
  const asc = /\bascendingOrder\s*=\s*(true|false)/.exec(c);
  const ps = /\bpageSize\s*=\s*(\d+)/.exec(c);
  return { shape, classes, metrics, slicer, range, ascending: asc ? asc[1] === "true" : null, pageSize: ps ? Number(ps[1]) : null };
}

// ── Lookup ─────────────────────────────────────────────────────────────────

function lookupHk(table, name, how) {
  const key = how === "objc" ? null : name.toLowerCase();
  const known = table.hkNames.find((n) => (how === "objc" ? n.o === `HKQuantityTypeIdentifier${name}` || n.o === `HKCategoryTypeIdentifier${name}` : n.c.toLowerCase() === key));
  const pair = known ? table.pairs.find((p) => p.hk.case === known.c) : null;
  return { known, pair };
}

function noPairForHk(table, known, name) {
  const lines = [];
  if (!known) {
    lines.push(`// No verified pair: "${name}" is not an identifier in this site's HealthKit list.`);
    lines.push(`// Nothing is guessed from the spelling. Every identifier: ${SITE}/healthkit-identifiers`);
    return lines;
  }
  const rowId = table.hkRow[known.c.toLowerCase()];
  const row = rowId ? table.rows.find((r) => r.id === rowId) : null;
  lines.push(`// No verified pair for HKQuantityTypeIdentifier/HKCategoryTypeIdentifier .${known.c}.`.replace("HKQuantityTypeIdentifier/HKCategoryTypeIdentifier", known.f === "category" ? "HKCategoryTypeIdentifier" : "HKQuantityTypeIdentifier"));
  if (row) {
    lines.push(`// This site's matrix row "${row.label}" lists ${row.apple.map((a) => `.${a}`).join(", ")} with ${row.android.join(", ")},`);
    lines.push(`// but not as a one-to-one pair, so this tool writes no code for it.`);
    if (row.watchOut) lines.push(`// The row's note: ${row.watchOut}`);
  } else {
    lines.push(`// It is in this site's HealthKit list, but no Health Connect record has been verified against it.`);
    lines.push(`// That is a gap in this site's checking, not proof that Health Connect lacks one.`);
  }
  lines.push(`// Check the record list yourself rather than guessing a name: ${SITE}/health-connect`);
  return lines;
}

function noPairForHc(table, name) {
  const lines = [];
  if (!table.hcNames.includes(name)) {
    lines.push(`// No verified pair: ${name} is not a record class in this site's Health Connect list.`);
    lines.push(`// Every record: ${SITE}/health-connect`);
    return lines;
  }
  const rowId = table.hcRow[name];
  const row = rowId ? table.rows.find((r) => r.id === rowId) : null;
  lines.push(`// No verified pair for ${name}.`);
  if (row) {
    lines.push(`// This site's matrix row "${row.label}" lists ${row.android.join(", ")} with ${row.apple.map((a) => `.${a}`).join(", ")},`);
    lines.push(`// but not as a one-to-one pair, so this tool writes no code for it.`);
    if (row.watchOut) lines.push(`// The row's note: ${row.watchOut}`);
  } else {
    lines.push(`// It is in this site's Health Connect list, but no HealthKit identifier has been verified against it.`);
    lines.push(`// That is a gap in this site's checking, not proof that HealthKit lacks one.`);
  }
  lines.push(`// Check the identifier list yourself rather than guessing a name: ${SITE}/healthkit-identifiers`);
  return lines;
}

function differentMeasure(pair) {
  return [
    `// No verified pair: .${pair.hk.case} and ${pair.hc.className} are not the same measurement.`,
    `// This site's unified schema tags them "${pair.measures.healthkit}" and "${pair.measures.healthConnect}".`,
    ...(pair.watchOut ? [`// The matrix row's note: ${pair.watchOut}`] : []),
    ...(pair.note ? [`// ${pair.note}`] : []),
    `// No code is written, because a translation would turn one statistic into another.`,
  ];
}

function header(pair, from, to) {
  const why =
    pair.how === "unified"
      ? `matrix row "${pair.matrixLabel}" and unified schema record "${pair.unifiedId}"`
      : `matrix row "${pair.matrixLabel}", one type on each side`;
  return [
    `// ${from} → ${to}, written by ${SITE}/tools/identifier-translator from this site's data.`,
    `// Verified pair: HealthKit .${pair.hk.case} ↔ Health Connect ${pair.hc.className} (${why}).`,
    `// Apple: ${pair.hk.docUrl}`,
    `// Google: ${pair.hc.sourceUrl}`,
  ];
}

const ident = (s, fallback) => (s && SIMPLE.test(s.trim()) ? s.trim() : fallback);

// ── Swift → Kotlin ─────────────────────────────────────────────────────────

function kotlinValueLines(pair, indent) {
  const v = pair.hc.value;
  const pad = " ".repeat(indent);
  if (!v) {
    const props = pair.hc.properties.map((p) => `${p.name} (${p.type})`).join(", ");
    return [`${pad}// Fields Google lists on ${pair.hc.className}: ${props || "none besides time and metadata"}.`, `${pad}// This site has no field-level mapping for this pair, so no value line is written.`];
  }
  if (v.samples) {
    return [`${pad}for (sample in record.samples) {`, `${pad}    val ${v.field} = sample.${v.field}`, `${pad}}`];
  }
  if (v.field === "stages") {
    return [`${pad}val stages = record.stages`, `${pad}// Stage vocabularies differ between the platforms: ${SITE}/healthkit-category-values`];
  }
  const out = [`${pad}val ${pair.field ?? v.field} = record.${v.field}${v.accessor ? `.${v.accessor}` : ""}`];
  if (pair.hk.percent) out.push(`${pad}// ${pair.note ?? `HealthKit: "${QUOTES.percent}"`}`);
  return out;
}

function permissionLine(pair) {
  const p = pair.hc.readPermissions;
  return p.length ? `// Read permission: ${p.join(", ")} (declare it in the manifest and request it before reading).` : `// Google's data-types table lists no read permission for ${pair.hc.className}.`;
}

function aggregationCheck(pair, options) {
  const out = [];
  for (const o of options) {
    const want = OPTION_KIND[o];
    if (!want) continue;
    if (pair.hk.aggregation && pair.hk.aggregation !== want.aggregation) {
      out.push(`// WARNING: .${o} needs a ${want.aggregation} type, but Apple states .${pair.hk.case} is ${pair.hk.aggregation}: "${pair.hk.aggregationEvidence}"`);
    }
  }
  return out;
}

/** The statistics options to translate: what the code says, or, when it says none, what Apple's aggregation implies. */
function chosenOptions(pair, parsed, notes) {
  const opts = parsed.options.filter((o) => OPTION_KIND[o]);
  for (const o of parsed.options) if (!OPTION_KIND[o]) notes.push(`// .${o}: this tool has no verified Health Connect metric for it; not translated.`);
  if (opts.length) return opts;
  if (pair.hk.aggregation === "cumulative") {
    notes.push(`// No statistics option found; Apple states .${pair.hk.case} is cumulative ("${pair.hk.aggregationEvidence}"), so .cumulativeSum.`);
    return ["cumulativeSum"];
  }
  if (pair.hk.aggregation === "discrete") {
    notes.push(`// No statistics option found; Apple states .${pair.hk.case} is discrete ("${pair.hk.aggregationEvidence}"), so .discreteAverage.`);
    return ["discreteAverage"];
  }
  notes.push(`// No statistics option found, and Apple states no aggregation style for .${pair.hk.case}; nothing to aggregate.`);
  return [];
}

function metricsFor(pair, options, notes) {
  const out = [];
  for (const o of options) {
    const kind = OPTION_KIND[o].kind;
    const m = pair.hc.metrics.find((x) => x.kind === kind);
    if (m) out.push({ option: o, metric: m });
    else {
      const listed = pair.hc.metrics.map((x) => x.name).join(", ");
      notes.push(
        listed
          ? `// .${o}: none of the metrics Google lists on ${pair.hc.className} (${listed}) is described as the ${kind}; not translated.`
          : `// .${o}: Google lists no aggregate metric on ${pair.hc.className}; read the records and compute it yourself.`,
      );
    }
  }
  return out;
}

const KOTLIN_SLICER = {
  minute: (n) => ["aggregateGroupByDuration", "AggregateGroupByDurationRequest", `Duration.ofMinutes(${n}L)`],
  hour: (n) => ["aggregateGroupByDuration", "AggregateGroupByDurationRequest", `Duration.ofHours(${n}L)`],
  second: (n) => ["aggregateGroupByDuration", "AggregateGroupByDurationRequest", `Duration.ofSeconds(${n}L)`],
  day: (n) => (n % 7 === 0 ? ["aggregateGroupByPeriod", "AggregateGroupByPeriodRequest", `Period.ofWeeks(${n / 7})`] : ["aggregateGroupByPeriod", "AggregateGroupByPeriodRequest", `Period.ofDays(${n})`]),
  weekOfYear: (n) => ["aggregateGroupByPeriod", "AggregateGroupByPeriodRequest", `Period.ofWeeks(${n})`],
  month: (n) => ["aggregateGroupByPeriod", "AggregateGroupByPeriodRequest", `Period.ofMonths(${n})`],
};

function swiftToKotlin(parsed, table) {
  const out = [];
  if (!parsed.shape) {
    return {
      ok: false,
      shape: parsed.other,
      code: [
        parsed.other
          ? `// ${parsed.other} is not one of the shapes this tool translates (HKSampleQuery, HKStatisticsQuery, HKStatisticsCollectionQuery, HKAnchoredObjectQuery).`
          : "// No HealthKit query found. Paste an HKSampleQuery, HKStatisticsQuery, HKStatisticsCollectionQuery or HKAnchoredObjectQuery.",
      ].join("\n"),
    };
  }
  if (!parsed.ids.length) {
    return { ok: false, shape: parsed.shape, code: `// ${parsed.shape} found, but no HealthKit type identifier in it (HKQuantityType(.stepCount), quantityType(forIdentifier: .stepCount) or HKQuantityTypeIdentifier.stepCount).` };
  }
  const first = parsed.ids[0];
  const { known, pair } = lookupHk(table, first.name, first.how);
  const extra = parsed.ids.slice(1).map((x) => x.name);
  const tail = extra.length ? [`// Also named in the snippet, not translated (paste one query at a time): ${extra.join(", ")}`] : [];
  if (!pair) return { ok: false, shape: parsed.shape, code: [...noPairForHk(table, known, first.name), ...tail].join("\n") };
  if (pair.status === "different-measure") return { ok: false, shape: parsed.shape, code: [...differentMeasure(pair), ...tail].join("\n") };

  const rc = pair.hc.className;
  const start = ident(parsed.range?.start, "startTime");
  const end = ident(parsed.range?.end, "endTime");
  out.push(...header(pair, parsed.shape, "Health Connect"), permissionLine(pair));
  out.push("// healthConnectClient: HealthConnectClient.getOrCreate(context), after getSdkStatus.");
  if (parsed.shape !== "HKAnchoredObjectQuery") {
    out.push(
      parsed.range
        ? `// ${start} / ${end}: java.time.Instant values here (Swift used Date). TimeRangeFilter: "${QUOTES.timeRange}".`
        : `// The Swift query had no date predicate, and Health Connect requires a TimeRangeFilter: set startTime and endTime.`,
    );
  }

  if (parsed.shape === "HKSampleQuery") {
    const args = [`        recordType = ${rc}::class,`, `        timeRangeFilter = TimeRangeFilter.between(${start}, ${end}),`];
    if (parsed.ascending === false) args.push("        ascendingOrder = false,");
    if (parsed.limit) args.push(`        pageSize = ${parsed.limit},`);
    args[args.length - 1] = args[args.length - 1].replace(/,$/, "");
    if (parsed.limit) out.push(`// pageSize caps one page; HKSampleQuery's limit capped the whole result. Follow pageToken for more.`);
    out.push("val response = healthConnectClient.readRecords(", "    ReadRecordsRequest(", ...args, "    )", ")");
    out.push("for (record in response.records) {", ...kotlinValueLines(pair, 4), "}");
    out.push(`// response.pageToken: "${QUOTES.pageToken}"`);
  } else if (parsed.shape === "HKStatisticsQuery" || parsed.shape === "HKStatisticsCollectionQuery") {
    const notes = [];
    const opts = chosenOptions(pair, parsed, notes);
    notes.push(...aggregationCheck(pair, opts));
    const ms = metricsFor(pair, opts, notes);
    out.push(...notes);
    if (!ms.length) return { ok: false, shape: parsed.shape, code: [...out, ...tail].join("\n") };
    const set = `setOf(${ms.map((x) => `${rc}.${x.metric.name}`).join(", ")})`;
    for (const x of ms) out.push(`// ${rc}.${x.metric.name}: "${x.metric.description}"`);
    if (parsed.shape === "HKStatisticsQuery") {
      out.push(
        "val response = healthConnectClient.aggregate(",
        "    AggregateRequest(",
        `        metrics = ${set},`,
        `        timeRangeFilter = TimeRangeFilter.between(${start}, ${end})`,
        "    )",
        ")",
        `// "${QUOTES.aggregateNull}" (Google).`,
        ...ms.map((x) => `val ${x.metric.kind} = response[${rc}.${x.metric.name}]`),
      );
    } else {
      const iv = parsed.interval;
      const mk = iv && KOTLIN_SLICER[iv.unit];
      if (!mk) {
        out.push(`// No interval this tool can translate was found (DateComponents(day:), (hour:), (minute:), (second:), (weekOfYear:) or (month:)); set timeRangeSlicer yourself.`);
        return { ok: false, shape: parsed.shape, code: [...out, ...tail].join("\n") };
      }
      const [fn, req, slicer] = mk(iv.n);
      if (fn === "aggregateGroupByPeriod") out.push(`// "${QUOTES.periodInstant}" (Google): pass LocalDateTime values.`);
      else out.push(`// "${QUOTES.slicer}" (Google). HealthKit's anchorDate aligned the buckets; start the range there.`);
      out.push(
        `val response = healthConnectClient.${fn}(`,
        `    ${req}(`,
        `        metrics = ${set},`,
        `        timeRangeFilter = TimeRangeFilter.between(${start}, ${end}),`,
        `        timeRangeSlicer = ${slicer}`,
        "    )",
        ")",
        `// "${QUOTES.sparse}" (Google).`,
        "for (bucket in response) {",
        ...ms.map((x) => `    val ${x.metric.kind} = bucket.result[${rc}.${x.metric.name}]`),
        "}",
      );
    }
  } else if (parsed.shape === "HKAnchoredObjectQuery") {
    out.push(
      "// Health Connect's documented way to get inserts, updates and deletions since a saved point is a Changes token;",
      "// it is the counterpart of HealthKit's anchor here, not the same API.",
      `// "${QUOTES.tokenExpiry}" (Google). Handling an expired token: ${SITE}/fix/health-connect-changes-token-expired`,
      "val changesToken = healthConnectClient.getChangesToken(",
      `    ChangesTokenRequest(recordTypes = setOf(${rc}::class))`,
      ")",
      "var nextChangesToken = changesToken",
      "do {",
      "    val response = healthConnectClient.getChanges(nextChangesToken)",
      "    for (change in response.changes) {",
      "        when (change) {",
      `            is UpsertionChange -> {`,
      `                val record = change.record as ${rc}`,
      ...kotlinValueLines(pair, 16),
      "            }",
      "            is DeletionChange -> {",
      "                val deletedId = change.recordId",
      "            }",
      "        }",
      "    }",
      "    nextChangesToken = response.nextChangesToken",
      "} while (response.hasMore)",
    );
  }
  return { ok: true, shape: parsed.shape, code: [...out, ...tail].join("\n") };
}

// ── Kotlin → Swift ─────────────────────────────────────────────────────────

function swiftUnit(pair) {
  if (pair.hk.percent) return "HKUnit.percent()";
  if (pair.hk.unit) return `HKUnit(from: "${pair.hk.unit}")`;
  return null;
}

function swiftValueLines(pair, indent, sampleVar) {
  const pad = " ".repeat(indent);
  if (pair.hk.family === "category") {
    return pair.hk.valueEnum
      ? [`${pad}let value = ${pair.hk.valueEnum}(rawValue: ${sampleVar}.value)`]
      : [`${pad}let value = ${sampleVar}.value`];
  }
  const unit = swiftUnit(pair);
  if (!unit) return [`${pad}// Apple states the "${pair.hk.unitFamily ?? "unstated"}" unit family for .${pair.hk.case}; this site maps no unit for this pair, so pick an HKUnit of that family.`];
  const name = pair.field ?? "value";
  const out = [`${pad}let ${name} = ${sampleVar}.quantity.doubleValue(for: ${unit})`];
  if (pair.hk.percent) out.push(`${pad}// "${QUOTES.percent}" (Apple). ${pair.note ?? ""}`.trimEnd());
  return out;
}

function swiftTypeExpr(pair) {
  return `${pair.hk.typeClass}(.${pair.hk.case})`;
}

const SWIFT_INTERVAL = {
  duration: { minutes: (n) => `DateComponents(minute: ${n})`, hours: (n) => `DateComponents(hour: ${n})`, days: (n) => `DateComponents(day: ${n})`, seconds: (n) => `DateComponents(second: ${n})` },
  period: { days: (n) => `DateComponents(day: ${n})`, weeks: (n) => `DateComponents(day: ${7 * n})`, months: (n) => `DateComponents(month: ${n})` },
};

function kotlinToSwift(parsed, table) {
  if (!parsed.shape) {
    return { ok: false, shape: null, code: "// No Health Connect call found. Paste a readRecords, aggregate, aggregateGroupByDuration, aggregateGroupByPeriod or getChangesToken call." };
  }
  const name = parsed.metrics[0]?.record ?? parsed.classes.find((x) => table.hcNames.includes(x)) ?? parsed.classes[0];
  if (!name) return { ok: false, shape: parsed.shape, code: `// ${parsed.shape} found, but no record class in it (StepsRecord::class or StepsRecord.COUNT_TOTAL).` };
  const pair = table.pairs.find((p) => p.hc.className === name);
  const extra = parsed.classes.filter((x) => x !== name);
  const tail = extra.length ? [`// Also named in the snippet, not translated (paste one call at a time): ${extra.join(", ")}`] : [];
  if (!pair) return { ok: false, shape: parsed.shape, code: [...noPairForHc(table, name), ...tail].join("\n") };
  if (pair.status === "different-measure") return { ok: false, shape: parsed.shape, code: [...differentMeasure(pair), ...tail].join("\n") };

  const out = [...header(pair, parsed.shape, "HealthKit")];
  out.push(`// Read authorization: put ${swiftTypeExpr(pair)} in the read set of requestAuthorization(toShare:read:) first.`);
  out.push("// healthStore: your HKHealthStore.");
  const start = ident(parsed.range?.start, "startDate");
  const end = ident(parsed.range?.end, "endDate");
  if (parsed.shape !== "getChanges") {
    out.push(
      parsed.range
        ? `// ${start} / ${end}: Date values here. HKQueryOptions .strictStartDate / .strictEndDate narrow the match; TimeRangeFilter.between was "${QUOTES.timeRange}".`
        : "// No TimeRangeFilter.between found: set startDate and endDate.",
    );
  }

  if (parsed.shape === "readRecords") {
    const sort = parsed.ascending === false;
    out.push(`let sampleType = ${swiftTypeExpr(pair)}`);
    out.push(`let predicate = HKQuery.predicateForSamples(withStart: ${start}, end: ${end}, options: [])`);
    if (sort) out.push("let sortDescriptors = [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]");
    if (parsed.pageSize) out.push(`// pageSize capped one page of ${parsed.pageSize}; HKSampleQuery's limit caps the whole result.`);
    out.push(
      `let query = HKSampleQuery(sampleType: sampleType, predicate: predicate, limit: ${parsed.pageSize ?? QUOTES.noLimit}, sortDescriptors: ${sort ? "sortDescriptors" : "nil"}) { query, results, error in`,
      `    guard let samples = results as? [${pair.hk.sampleClass}] else { return }`,
      "    for sample in samples {",
      ...swiftValueLines(pair, 8, "sample"),
      "    }",
      "}",
      "healthStore.execute(query)",
    );
  } else if (parsed.shape === "aggregate" || parsed.shape === "aggregateGroupByDuration" || parsed.shape === "aggregateGroupByPeriod") {
    if (pair.hk.family !== "quantity") {
      out.push(`// ${pair.hk.typeClass}(.${pair.hk.case}) is a category type, and HKStatisticsQuery takes an HKQuantityType: there is no statistics query to write.`);
      out.push("// Read the samples with HKSampleQuery and add up their durations yourself.");
      return { ok: false, shape: parsed.shape, code: [...out, ...tail].join("\n") };
    }
    const notes = [];
    const opts = [];
    const getters = [];
    for (const m of parsed.metrics.filter((x) => x.record === name)) {
      const metric = pair.hc.metrics.find((x) => x.name === m.name);
      if (!metric) {
        notes.push(`// ${name}.${m.name} is not an aggregate metric Google lists on ${name}; not translated.`);
        continue;
      }
      const option = metric.kind ? KIND_OPTION[metric.kind] : null;
      if (!option) {
        notes.push(`// ${name}.${m.name} ("${metric.description}") names no total, average, minimum or maximum; not translated.`);
        continue;
      }
      const want = OPTION_KIND[option];
      if (pair.hk.aggregation !== want.aggregation) {
        notes.push(
          pair.hk.aggregation
            ? `// ${name}.${m.name} is a ${metric.kind}, but Apple states .${pair.hk.case} is ${pair.hk.aggregation} ("${pair.hk.aggregationEvidence}"), so .${option} does not apply; not translated.`
            : `// Apple states no aggregation style for .${pair.hk.case}; .${option} is not written.`,
        );
        continue;
      }
      notes.push(`// ${name}.${m.name} ("${metric.description}") → .${option}; Apple: "${pair.hk.aggregationEvidence}"`);
      opts.push(option);
      getters.push({ getter: want.getter, kind: metric.kind });
    }
    out.push(...notes);
    if (!opts.length) {
      if (!parsed.metrics.length) out.push("// No aggregate metric found (for example StepsRecord.COUNT_TOTAL).");
      return { ok: false, shape: parsed.shape, code: [...out, ...tail].join("\n") };
    }
    const unit = swiftUnit(pair);
    const optExpr = opts.length === 1 ? `.${opts[0]}` : `[${opts.map((o) => `.${o}`).join(", ")}]`;
    const valueLine = (g, pad) =>
      unit
        ? `${pad}let ${g.kind} = statistics.${g.getter}()?.doubleValue(for: ${unit})`
        : `${pad}let ${g.kind} = statistics.${g.getter}()  // this site maps no unit for this pair: Apple states the "${pair.hk.unitFamily ?? "unstated"}" family`;
    out.push(`let quantityType = ${swiftTypeExpr(pair)}`);
    out.push(`let predicate = HKQuery.predicateForSamples(withStart: ${start}, end: ${end}, options: [])`);
    if (parsed.shape === "aggregate") {
      out.push(
        `let query = HKStatisticsQuery(quantityType: quantityType, quantitySamplePredicate: predicate, options: ${optExpr}) { query, statistics, error in`,
        "    guard let statistics = statistics else { return }",
        ...getters.map((g) => valueLine(g, "    ")),
        "}",
        "healthStore.execute(query)",
      );
    } else {
      const sl = parsed.slicer;
      const mk = sl && SWIFT_INTERVAL[sl.kind]?.[sl.unit];
      if (!mk) {
        out.push("// No timeRangeSlicer this tool can translate (Duration.ofMinutes/ofHours/ofDays/ofSeconds, Period.ofDays/ofWeeks/ofMonths); set intervalComponents yourself.");
        return { ok: false, shape: parsed.shape, code: [...out, ...tail].join("\n") };
      }
      out.push(
        `let interval = ${mk(sl.n)}`,
        `let query = HKStatisticsCollectionQuery(quantityType: quantityType, quantitySamplePredicate: predicate, options: ${optExpr}, anchorDate: ${start}, intervalComponents: interval)`,
        "query.initialResultsHandler = { query, collection, error in",
        "    guard let collection = collection else { return }",
        `    collection.enumerateStatistics(from: ${start}, to: ${end}) { statistics, stop in`,
        ...getters.map((g) => valueLine(g, "        ")),
        "    }",
        "}",
        "healthStore.execute(query)",
      );
    }
  } else if (parsed.shape === "getChanges") {
    out.push(
      "// HealthKit's documented way to get new samples and deletions since a saved point is an anchored object query;",
      "// it is the counterpart of a Changes token here, not the same API. Persist the anchor between launches.",
      "var anchor: HKQueryAnchor? = nil",
      `let query = HKAnchoredObjectQuery(type: ${swiftTypeExpr(pair)}, predicate: nil, anchor: anchor, limit: HKObjectQueryNoLimit) { query, samples, deletedObjects, newAnchor, error in`,
      "    anchor = newAnchor",
      `    for sample in (samples as? [${pair.hk.sampleClass}]) ?? [] {`,
      ...swiftValueLines(pair, 8, "sample"),
      "    }",
      "    for deleted in deletedObjects ?? [] {",
      "        let deletedId = deleted.uuid",
      "    }",
      "}",
      "query.updateHandler = { query, samples, deletedObjects, newAnchor, error in",
      "    anchor = newAnchor",
      "}",
      "healthStore.execute(query)",
    );
  }
  return { ok: true, shape: parsed.shape, code: [...out, ...tail].join("\n") };
}

/**
 * Translate a pasted snippet. `table` is buildPairs()'s result.
 * @returns {{ from: "swift" | "kotlin" | null, to: "swift" | "kotlin" | null, ok: boolean, shape: string | null, code: string }}
 */
export function translate(code, table, force) {
  const from = force ?? detectLanguage(code);
  if (from === "swift") return { from, to: "kotlin", ...swiftToKotlin(parseSwift(code), table) };
  if (from === "kotlin") return { from, to: "swift", ...kotlinToSwift(parseKotlin(code), table) };
  return {
    from: null,
    to: null,
    ok: false,
    shape: null,
    code: "// Could not tell Swift from Kotlin. Paste a HealthKit query (HKSampleQuery …) or a Health Connect call (readRecords …).",
  };
}

export { parseSwift as _parseSwift, parseKotlin as _parseKotlin };
