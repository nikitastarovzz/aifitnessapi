"use client";

import { useMemo, useRef, useState } from "react";
import { matchExercises } from "@/lib/exerciseNameMatch.mjs";

/**
 * The search box on /tools/exercise-taxonomy-crosswalk#normalize. It fetches
 * the published Open Exercises file from this site the first time the reader
 * focuses or types, then matches in the browser with src/lib/exerciseNameMatch.mjs.
 * What the reader types is never sent anywhere and nothing is reported to
 * analytics.
 */

type Row = {
  id: string;
  name: string;
  category: string;
  equipment: string | null;
  level: string;
  primaryMuscles: string | null;
  secondaryMuscles: string | null;
  healthkitWorkoutType: string | null;
  healthConnectExerciseType: string | null;
  healthConnectSegmentType: string | null;
  crosswalkBasis: "exercise-name" | "category" | null;
  source: string;
};
type Exercise = Row & { primary: string[]; secondary: string[] };
type Reason = { query: string; via: string | null; field: string; matched: string; how: string };

const split = (s: string | null) => (s ? s.split("; ") : []);
const EXAMPLES = ["DB incline press", "RDL", "lat pulldown wide", "kb swing", "pull down"];
const BASIS: Record<string, string> = {
  "exercise-name": "by its own name",
  category: "by its category",
};

function reasonText(r: Reason): string {
  const from = r.via ? `${r.query} → ${r.via}` : r.query;
  if (r.field !== "name") return `${from} (its ${r.field})`;
  if (r.how === "joined") return `${from} = ${r.matched}`;
  if (r.how === "split") return `${from} = ${r.matched}`;
  return from;
}

export default function ExerciseNameNormalizer({ dataUrl, typeLinks }: { dataUrl: string; typeLinks: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Exercise[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const load = () => {
    if (started.current) return;
    started.current = true;
    fetch(dataUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((doc: { items: Row[] }) => setData(doc.items.map((i) => ({ ...i, primary: split(i.primaryMuscles), secondary: split(i.secondaryMuscles) }))))
      .catch((e: Error) => setError(`The exercise file did not load (${e.message}). Use the download links above instead.`));
  };
  // The matcher reads muscles as lists; the file holds them "; "-joined.
  const pool = useMemo(() => (data ? data.map((e) => ({ ...e, primaryMuscles: e.primary, secondaryMuscles: e.secondary })) : null), [data]);
  const result = useMemo(() => (pool && q.trim() ? matchExercises(q, pool, { limit: 8 }) : null), [pool, q]);

  const typeList = (value: string | null, label: string) =>
    value ? (
      split(value).map((t) => (
        <span key={t} className="block">
          {typeLinks[t] ? (
            <a href={typeLinks[t]} className="break-all font-mono text-brand-600 hover:text-brand-500">
              {t}
            </a>
          ) : (
            <span className="break-all font-mono">{t}</span>
          )}{" "}
          <span className="text-[var(--muted)]">({label})</span>
        </span>
      ))
    ) : null;

  return (
    <div data-exercise-normalizer className="mt-5">
      <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="exercise-name-input">
        Exercise name
      </label>
      <input
        id="exercise-name-input"
        type="search"
        autoComplete="off"
        spellCheck={false}
        value={q}
        onFocus={load}
        onChange={(e) => {
          load();
          setQ(e.target.value);
        }}
        placeholder="DB incline press"
        className="mt-1 w-full max-w-xl rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
      />
      <p className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        <span>Try:</span>
        {EXAMPLES.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => {
              load();
              setQ(x);
            }}
            className="rounded border border-[var(--border)] px-2 py-0.5 hover:border-brand-400 hover:text-[var(--fg)]"
          >
            {x}
          </button>
        ))}
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {q.trim() && !data && !error && <p className="mt-3 text-sm text-[var(--muted)]">Loading the exercise list…</p>}
      {result && result.terms.length > 0 && (
        <p className="mt-3 text-xs text-[var(--muted)]">
          {"Words matched: "}
          {result.terms.map((t) => (t.from ? `${t.from} → ${t.word}` : t.word)).join(", ")}
        </p>
      )}
      {result && result.results.length === 0 && (
        <p className="mt-3 text-sm text-[var(--muted)]">No exercise name, equipment, category or muscle has any of these words.</p>
      )}
      {result && result.results.length > 0 && (
        <ol className="mt-3 space-y-3">
          {result.results.map(({ exercise: e, reasons, matchedTerms }) => {
            const ex = e as unknown as Exercise;
            return (
              <li key={ex.id} className="rounded-xl border border-[var(--border)] p-4 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-[var(--fg)]">{ex.name}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {`matched ${matchedTerms} of ${result.terms.length} words: `}
                    {(reasons as Reason[]).map(reasonText).join(", ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {[ex.category, ex.equipment ?? "no equipment listed", ex.level].join(" · ")}
                </p>
                <p className="mt-2 text-[var(--fg)]">
                  <span className="text-[var(--muted)]">Primary: </span>
                  {ex.primary.join(", ") || "none listed"}
                  {ex.secondary.length > 0 && (
                    <>
                      <span className="text-[var(--muted)]">{" · Secondary: "}</span>
                      {ex.secondary.join(", ")}
                    </>
                  )}
                </p>
                <div className="mt-2 text-xs text-[var(--fg)]">
                  {ex.crosswalkBasis ? (
                    <>
                      <span className="text-[var(--muted)]">{`Crosswalk, ${BASIS[ex.crosswalkBasis]}: `}</span>
                      {typeList(ex.healthkitWorkoutType, "HealthKit")}
                      {typeList(ex.healthConnectExerciseType, "Health Connect exercise type")}
                      {typeList(ex.healthConnectSegmentType, "Health Connect segment type")}
                      {!ex.healthkitWorkoutType && <span className="block text-[var(--muted)]">No HealthKit type has the same name.</span>}
                    </>
                  ) : (
                    <span className="text-[var(--muted)]">No HealthKit or Health Connect type has the same name as this exercise or its category.</span>
                  )}
                </div>
                <a href={ex.source} rel="noopener" className="mt-2 inline-block text-xs text-brand-600 hover:text-brand-500">
                  {`${ex.id}.json on GitHub`}
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
