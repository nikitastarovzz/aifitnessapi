"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/**
 * HKStatisticsQuery generator.
 *
 * Pick one quantity type and a window; get the statistics query in the shape
 * this site's verified HealthKit integration guide publishes, with the
 * aggregation option chosen from what Apple's own prose says about that type
 * rather than from a guess.
 *
 * The refusal is the point. Apple states aggregation style in a type's
 * discussion, not as a property, and for three quantity types it does not
 * state it at all. Emitting `.cumulativeSum` for one of those would produce a
 * plausible, wrong number — the worst failure mode there is, because nothing
 * throws. So the generator declines and says why. Category types get the same
 * treatment for a different reason: a category sample carries an enum case,
 * not a number, so there is nothing for a statistics query to aggregate.
 *
 * Unit handling follows the same rule. HKUnit.count() is the only unit
 * constructor this site has verified, so it is emitted only for the count
 * family; every other family gets a comment naming the family and pointing at
 * the unit reference instead of an invented constructor.
 */

export type QueryFamily = "quantity" | "category";

export type QueryOption = {
  /** Swift case name, e.g. "stepCount". */
  case: string;
  family: QueryFamily;
  /** Apple's topic grouping. */
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Derived from Apple's prose; null where Apple does not state it. */
  aggregation: "cumulative" | "discrete" | null;
  /** The sentence `aggregation` was derived from. */
  aggregationEvidence: string | null;
  /** Derived from Apple's prose; null where unstated. */
  unitFamily: string | null;
  /** For category types: the enum that decodes the sample. */
  valueEnum: string | null;
};

type WindowChoice = "today" | "last7" | "custom";

const GEN_LINE =
  "Generated from aifitnessapi.com/tools/query-generator — verify against current Apple docs before shipping.";

const WINDOWS: { value: WindowChoice; label: string; hint: string }[] = [
  { value: "today", label: "Today", hint: "Midnight to now, the shape in the integration guide" },
  { value: "last7", label: "Last 7 days", hint: "One aggregate over the window, not seven daily ones" },
  { value: "custom", label: "Custom", hint: "You supply start and end" },
];

function upperFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function windowLines(w: WindowChoice): string[] {
  if (w === "today") {
    return [
      "    let startOfDay = Calendar.current.startOfDay(for: Date())",
      "    let predicate = HKQuery.predicateForSamples(",
      "        withStart: startOfDay, end: Date(), options: .strictStartDate)",
    ];
  }
  if (w === "last7") {
    return [
      "    let startOfDay = Calendar.current.startOfDay(for: Date())",
      "    // Window start: the start of the day seven days back. Derive it with your own",
      "    // Calendar arithmetic — this site has not verified a date-arithmetic snippet, and",
      "    // where the day starts is a decision: aifitnessapi.com/day-boundaries",
      "    let start = startOfDay   // <- replace with your seven-days-back date",
      "    let predicate = HKQuery.predicateForSamples(",
      "        withStart: start, end: Date(), options: .strictStartDate)",
    ];
  }
  return [
    "    // Custom window: supply both ends yourself.",
    "    let start = Calendar.current.startOfDay(for: Date())   // <- replace",
    "    let end = Date()                                       // <- replace",
    "    let predicate = HKQuery.predicateForSamples(",
    "        withStart: start, end: end, options: .strictStartDate)",
  ];
}

function unitLines(unitFamily: string | null): string[] {
  if (unitFamily === "count") {
    return ["        let value = quantity.doubleValue(for: HKUnit.count())"];
  }
  if (unitFamily === null) {
    return [
      "        // unit: not stated in Apple's prose for this type — see /healthkit-units",
      "        let value = quantity.doubleValue(for: unit)   // `unit`: the HKUnit you verified",
    ];
  }
  return [
    `        // unit: ${unitFamily} — pick the HKUnit for your locale; see /healthkit-units`,
    `        let value = quantity.doubleValue(for: unit)   // \`unit\`: your HKUnit in the ${unitFamily} family`,
  ];
}

function buildSwift(o: QueryOption, w: WindowChoice): string {
  const option = o.aggregation === "cumulative" ? ".cumulativeSum" : ".discreteAverage";
  const accessor = o.aggregation === "cumulative" ? "sumQuantity()" : "averageQuantity()";
  const label =
    w === "today" ? "today" : w === "last7" ? "last 7 days" : "your window";

  const lines: string[] = [
    "import HealthKit",
    "",
    "let healthStore = HKHealthStore()",
    "",
    `func read${upperFirst(o.case)}() {`,
    `    let quantityType = HKQuantityType(.${o.case})   // iOS 16+ initializer`,
    ...windowLines(w),
    "",
    "    let query = HKStatisticsQuery(",
    "        quantityType: quantityType,",
    "        quantitySamplePredicate: predicate,",
    `        options: ${option}`,
    "    ) { _, statistics, error in",
    `        guard let quantity = statistics?.${accessor} else {`,
    "            // Empty == no data OR read permission not granted (indistinguishable).",
    "            return",
    "        }",
    ...unitLines(o.unitFamily),
    `        print("${o.case} ${label}: \\(value)")`,
    "    }",
    "    healthStore.execute(query)",
    "}",
    `// ${GEN_LINE}`,
  ];
  return lines.join("\n");
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={() =>
        navigator.clipboard.writeText(text).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          },
          () => setCopied(false),
        )
      }
      className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Verdict({ tone, children }: { tone: "ok" | "stop"; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        tone === "ok"
          ? "border-brand-400 bg-brand-500/10 text-[var(--fg)]"
          : "border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]"
      }`}
    >
      {children}
    </span>
  );
}

export default function QueryGenerator({ options }: { options: QueryOption[] }) {
  const [query, setQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [range, setRange] = useState<WindowChoice>("today");

  const selected = useMemo(
    () => options.find((o) => o.case === selectedCase) ?? null,
    [options, selectedCase],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const starts: QueryOption[] = [];
    const contains: QueryOption[] = [];
    for (const o of options) {
      const name = o.case.toLowerCase();
      if (name.startsWith(q)) starts.push(o);
      else if (name.includes(q) || o.abstract.toLowerCase().includes(q)) contains.push(o);
    }
    return [...starts, ...contains].slice(0, 10);
  }, [query, options]);

  function pick(o: QueryOption) {
    setSelectedCase(o.case);
    setQuery("");
  }

  const swift =
    selected && selected.family === "quantity" && selected.aggregation
      ? buildSwift(selected, range)
      : null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <label htmlFor="query-search" className="block text-sm font-semibold text-[var(--fg)]">
        Which type do you want to aggregate?
      </label>
      <p className="mt-1 text-xs text-[var(--muted)]">
        One at a time, from the {options.length} quantity and category identifiers Apple documents.
      </p>

      <input
        id="query-search"
        type="text"
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls="query-suggestions"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && suggestions.length > 0) {
            e.preventDefault();
            pick(suggestions[0]);
          }
        }}
        placeholder="stepCount, heartRate, activeEnergyBurned…"
        className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-brand-400"
      />

      {suggestions.length > 0 && (
        <ul
          id="query-suggestions"
          className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)]"
        >
          {suggestions.map((o) => (
            <li key={o.case} className="border-b border-[var(--border)] last:border-b-0">
              <button
                type="button"
                onClick={() => pick(o)}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-[var(--surface)]"
              >
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-[13px] font-semibold text-brand-600 dark:text-brand-300">
                    {o.case}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
                    {o.family} · {o.group}
                  </span>
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {o.abstract || "Apple publishes no abstract for this type."}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected === null ? (
        <p className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
          Nothing picked yet. Choose a type and this returns either a statistics query with the
          correct aggregation option, or the reason it will not write one for you.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-3 border-t border-[var(--border)] pt-5">
            <div>
              <p className="font-mono text-sm font-semibold text-[var(--fg)]">{selected.case}</p>
              <p className="mt-1 max-w-xl text-xs text-[var(--muted)]">
                {selected.abstract || "Apple publishes no abstract for this type."}
              </p>
            </div>
            {selected.family === "category" ? (
              <Verdict tone="stop">Category type — no statistics query</Verdict>
            ) : selected.aggregation === "cumulative" ? (
              <Verdict tone="ok">Cumulative → .cumulativeSum</Verdict>
            ) : selected.aggregation === "discrete" ? (
              <Verdict tone="ok">Discrete → .discreteAverage</Verdict>
            ) : (
              <Verdict tone="stop">Aggregation not stated — refusing</Verdict>
            )}
          </div>

          {/* Category types: a statistics query has nothing to aggregate. */}
          {selected.family === "category" && (
            <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
              <h3 className="text-sm font-bold text-[var(--fg)]">
                Statistics queries do not apply to category types
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                A category sample carries an enum case over an interval, not a number.{" "}
                {selected.valueEnum ? (
                  <>
                    <code className="font-mono text-xs">{selected.case}</code> is decoded with{" "}
                    <code className="font-mono text-xs">{selected.valueEnum}</code>, and the value
                    only means anything through that enum.
                  </>
                ) : (
                  <>
                    This site records no value enum for{" "}
                    <code className="font-mono text-xs">{selected.case}</code>, so the interval
                    itself is what the sample tells you.
                  </>
                )}{" "}
                There is no sum and no average to take, so no{" "}
                <code className="font-mono text-xs">HKStatisticsQuery</code> option is correct here.
                Read the samples and interpret the cases.
              </p>
              <p className="mt-3 text-sm">
                <Link
                  href="/healthkit-category-values"
                  className="font-medium text-brand-600 hover:text-brand-500"
                >
                  Every HealthKit category value enum &rarr;
                </Link>
              </p>
            </div>
          )}

          {/* Quantity types Apple does not describe as cumulative or discrete. */}
          {selected.family === "quantity" && selected.aggregation === null && (
            <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
              <h3 className="text-sm font-bold text-[var(--fg)]">
                This tool will not generate a query for {selected.case}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Apple states aggregation style inside a type&rsquo;s discussion prose rather than as
                a property, and for this one it does not state it at all. Guessing between{" "}
                <code className="font-mono text-xs">.cumulativeSum</code> and{" "}
                <code className="font-mono text-xs">.discreteAverage</code> would not fail loudly:
                you would get a number, it would render, and it would be wrong. So the honest output
                here is nothing.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                If you know from testing which behaviour this type has, write the query by hand and
                comment why. Do not take the answer from a generator that does not have it.
              </p>
              <p className="mt-3 text-sm">
                <Link
                  href="/healthkit-status"
                  className="font-medium text-brand-600 hover:text-brand-500"
                >
                  What Apple leaves undocumented &rarr;
                </Link>
              </p>
            </div>
          )}

          {/* The generated query. */}
          {swift && (
            <>
              <fieldset className="mt-5">
                <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Window
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {WINDOWS.map((w) => (
                    <button
                      key={w.value}
                      type="button"
                      onClick={() => setRange(w.value)}
                      title={w.hint}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        range === w.value
                          ? "border-brand-400 bg-brand-500/10 text-[var(--fg)]"
                          : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {WINDOWS.find((w) => w.value === range)?.hint}
                </p>
              </fieldset>

              {selected.aggregationEvidence && (
                <blockquote className="mt-5 border-l-2 border-brand-400 pl-4 text-xs leading-relaxed text-[var(--muted)]">
                  <strong className="text-[var(--fg)]">Why that option:</strong> Apple&rsquo;s
                  sentence, verbatim — <q className="italic">{selected.aggregationEvidence}</q>
                </blockquote>
              )}

              {selected.aggregation === "discrete" && (
                <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                  Discrete types are reduced, not summed.{" "}
                  <code className="font-mono">.discreteAverage</code> is emitted here;{" "}
                  <code className="font-mono">.discreteMin</code> and{" "}
                  <code className="font-mono">.discreteMax</code> are the other two options, and the
                  accessor has to match the option you chose — Apple&rsquo;s rule is that a query
                  created with <code className="font-mono">discreteAverage</code> must be read with{" "}
                  <code className="font-mono">averageQuantity()</code>.
                </p>
              )}

              <div className="mt-5 flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold tracking-tight text-[var(--fg)]">
                  HKStatisticsQuery
                </h3>
                <CopyButton text={swift} label="the generated query" />
              </div>
              <pre className="mt-2 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-[12.5px] leading-relaxed text-[var(--fg)]">
                <code className="font-mono">{swift}</code>
              </pre>

              <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                {selected.unitFamily === "count" ? (
                  <>
                    <code className="font-mono">HKUnit.count()</code> is emitted because Apple
                    describes this type in the count family. It is the only unit constructor this
                    site has verified.
                  </>
                ) : (
                  <>
                    No unit constructor is emitted: this type is in the{" "}
                    {selected.unitFamily ? (
                      <strong className="text-[var(--fg)]">{selected.unitFamily}</strong>
                    ) : (
                      "unstated"
                    )}{" "}
                    family, and HKQuantity converts silently between compatible units — reading
                    metres and rendering miles is a wrong number, not a crash. Pick the unit
                    deliberately at{" "}
                    <Link
                      href="/healthkit-units"
                      className="font-medium text-brand-600 hover:text-brand-500"
                    >
                      HealthKit unit families
                    </Link>
                    .
                  </>
                )}
              </p>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setSelectedCase(null);
              setQuery("");
            }}
            className="mt-6 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
          >
            ↺ Pick another type
          </button>
        </>
      )}
    </div>
  );
}
