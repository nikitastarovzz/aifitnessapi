"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { translate, type RosettaTable } from "@/lib/codeRosetta.mjs";

/**
 * The code mode of /tools/identifier-translator: paste a HealthKit query in
 * Swift and get the Health Connect call in Kotlin, or the reverse. The
 * parser and templates are src/lib/codeRosetta.mjs; the pair table is built
 * on the server from the site's data and passed in. The pasted code never
 * leaves the page: there is no request, and nothing is stored.
 */

type Direction = "auto" | "swift" | "kotlin";

const EXAMPLES: { label: string; code: string }[] = [
  {
    label: "Swift: weekly steps (HKStatisticsCollectionQuery)",
    code: `let interval = DateComponents(day: 7)
let stepType = HKQuantityType(.stepCount)
let query = HKStatisticsCollectionQuery(quantityType: stepType,
                                        quantitySamplePredicate: nil,
                                        options: .cumulativeSum,
                                        anchorDate: anchorDate,
                                        intervalComponents: interval)
query.initialResultsHandler = { query, results, error in
    results?.enumerateStatistics(from: startDate, to: endDate) { statistics, stop in }
}
healthStore.execute(query)`,
  },
  {
    label: "Swift: heart rate samples (HKSampleQuery)",
    code: `let today = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
let sortByDate = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
let query = HKSampleQuery(sampleType: HKQuantityType(.heartRate),
                          predicate: today,
                          limit: HKObjectQueryNoLimit,
                          sortDescriptors: [sortByDate]) { query, results, error in }
healthStore.execute(query)`,
  },
  {
    label: "Swift: average weight (HKStatisticsQuery)",
    code: `let bodyMass = HKQuantityType.quantityType(forIdentifier: .bodyMass)!
let range = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])
let query = HKStatisticsQuery(quantityType: bodyMass, quantitySamplePredicate: range, options: .discreteAverage) { query, statistics, error in }
healthStore.execute(query)`,
  },
  {
    label: "Swift: HRV SDNN (refused)",
    code: `let query = HKSampleQuery(sampleType: HKQuantityType(.heartRateVariabilitySDNN), predicate: nil, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, results, error in }`,
  },
  {
    label: "Kotlin: step total (aggregate)",
    code: `val response = healthConnectClient.aggregate(
    AggregateRequest(
        metrics = setOf(StepsRecord.COUNT_TOTAL),
        timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
    )
)
val totalSteps = response[StepsRecord.COUNT_TOTAL] ?: 0L`,
  },
  {
    label: "Kotlin: steps per minute (aggregateGroupByDuration)",
    code: `val response = healthConnectClient.aggregateGroupByDuration(
    AggregateGroupByDurationRequest(
        metrics = setOf(StepsRecord.COUNT_TOTAL),
        timeRangeFilter = TimeRangeFilter.between(startTime, endTime),
        timeRangeSlicer = Duration.ofMinutes(1L)
    )
)`,
  },
  {
    label: "Kotlin: sleep sessions (readRecords)",
    code: `val response = healthConnectClient.readRecords(
    ReadRecordsRequest(
        SleepSessionRecord::class,
        timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
    )
)`,
  },
  {
    label: "Kotlin: weight changes (getChangesToken)",
    code: `val changesToken = healthConnectClient.getChangesToken(
    ChangesTokenRequest(recordTypes = setOf(WeightRecord::class))
)`,
  },
];

const LANG = { swift: "Swift", kotlin: "Kotlin" } as const;

export default function CodeRosetta({ table }: { table: RosettaTable }) {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [dir, setDir] = useState<Direction>("auto");
  const result = useMemo(() => (code.trim() ? translate(code, table, dir === "auto" ? undefined : dir) : null), [code, dir, table]);
  const translatable = table.pairs.filter((p) => p.status === "pair");

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm font-semibold text-[var(--fg)]">
          Translate from
          <select
            value={dir}
            onChange={(e) => setDir(e.target.value as Direction)}
            className="ml-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm font-normal text-[var(--fg)]"
          >
            <option value="auto">Detect the language</option>
            <option value="swift">Swift (HealthKit) to Kotlin</option>
            <option value="kotlin">Kotlin (Health Connect) to Swift</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-[var(--fg)]">
          Example
          <select
            value=""
            onChange={(e) => {
              const ex = EXAMPLES[Number(e.target.value)];
              if (ex) {
                setCode(ex.code);
                setDir("auto");
              }
            }}
            className="ml-2 max-w-[16rem] rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm font-normal text-[var(--fg)]"
          >
            <option value="">Load an example…</option>
            {EXAMPLES.map((ex, i) => (
              <option key={ex.label} value={i}>
                {ex.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label htmlFor="rosetta-input" className="mt-4 block text-sm font-semibold text-[var(--fg)]">
        Your query
      </label>
      <textarea
        id="rosetta-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={10}
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-[13px] leading-relaxed text-[var(--fg)]"
      />
      <p className="mt-1 text-xs text-[var(--muted)]">
        Runs in this tab: the code you paste is not sent anywhere. Types it writes code for:{" "}
        {translatable.map((p, i) => (
          <span key={p.hk.case}>
            {i > 0 && ", "}
            <code className="font-mono">{p.hk.case}</code> ↔ <code className="font-mono">{p.hc.className}</code>
          </span>
        ))}
        .
      </p>

      <div aria-live="polite" className="mt-5">
        {result && (
          <div data-copy-scope className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {result.from && result.to ? `${LANG[result.from]} → ${LANG[result.to]}` : "Not translated"}
                {result.shape ? ` · ${result.shape}` : ""}
                {result.ok ? "" : " · no code written"}
              </p>
              <span data-cta="code-rosetta-copy" data-cta-source="identifier-translator">
                <CopyButton label="Copy the output" />
              </span>
            </div>
            <pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre text-[12px] leading-relaxed text-[var(--fg)]">
              <code>{result.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
