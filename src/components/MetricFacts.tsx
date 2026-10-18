import Link from "next/link";
import { ROWS, type Row } from "@/data/matrix";
import { HK_IDENTIFIERS, HK_FETCHED_ON, type HkIdentifier } from "@/data/healthkitIdentifiers";
import { HC_FETCHED_ON } from "@/data/healthConnectRecords";
import { metricMapForGuide } from "@/data/metricTypeMap";
import { resolveMetricType } from "@/data/metricTypePages";
import { appleCases } from "@/lib/appleCases";

export { appleCases };

/**
 * The verified platform facts for one metric, rendered on its /data guide.
 *
 * Why this is a component and not prose in the entry body: the /data cluster
 * carries the site's highest-intent pages ("heart rate API", "sleep tracking
 * API") and was its thinnest — a median of 703 words. The facts that belong
 * there are exactly the ones we already hold as data: which HealthKit type
 * names the metric, whether it can be summed, what unit it comes back in,
 * and what Health Connect calls it. Writing those into the prose would mean
 * 14 copies to maintain by hand and 14 chances to drift. Deriving them means
 * regenerating the identifier dataset updates every guide at once.
 *
 * Nothing here is authored. Every cell traces to src/data/matrix.ts (verified
 * against Apple's and Google's docs) joined to the identifiers read from
 * Apple's own documentation JSON.
 */

/** The matrix row whose guide is this path, if any. */
export function metricForPath(path: string): Row | undefined {
  return ROWS.find((r) => r.href === path);
}

const byCase = new Map(HK_IDENTIFIERS.map((r) => [r.case, r]));

/**
 * Guides with no matrix row: /data pages whose HealthKit identifiers this
 * block renders and whose Health Connect side comes from the metric map.
 *
 * src/data/matrix.ts is deliberately restricted to metrics confirmed against
 * both Apple's and Google's documentation, and when this block was written
 * Google's docs were not reachable from the build environment, so these four
 * guides got the Apple half and a note that the Android side was unconfirmed.
 * developer.android.com is reachable now, and src/data/healthConnectRecords.ts
 * is generated from it. The Android records shown for these guides are the
 * Health Connect rows of src/data/metricTypeMap.ts, each listed there with
 * Google's own description of the record naming the metric, which qa.mjs
 * re-checks against the generated file (METRIC-MAP-EVIDENCE). They are not
 * added to matrix.ts: a matrix row is a hand-verified pairing that also feeds
 * the HealthKit identifier pages' thin-page rule and the type-matrix dataset,
 * and a record that describes the same metric is not by that fact a pairing.
 */
const NO_MATRIX_ROW: Record<string, { label: string; cases: string[] }> = {
  "/data/blood-glucose-api": { label: "Blood glucose", cases: ["bloodGlucose"] },
  "/data/blood-pressure-api": { label: "Blood pressure", cases: ["bloodPressureSystolic", "bloodPressureDiastolic"] },
  "/data/respiratory-rate-api": { label: "Respiratory rate", cases: ["respiratoryRate"] },
  "/data/menstrual-cycle-api": { label: "Menstrual cycle", cases: ["menstrualFlow"] },
};

/** Every identifier this component will try to render, for the qa gate. */
export function allReferencedCases(): { source: string; cases: string[] }[] {
  return [
    ...ROWS.map((r) => ({ source: r.href, cases: appleCases(r.apple) })),
    ...Object.entries(NO_MATRIX_ROW).map(([href, v]) => ({ source: href, cases: v.cases })),
  ];
}

/** The Health Connect records the metric map lists for a guide, resolved to their pages. */
function mappedHealthConnect(path: string) {
  const slug = path.replace(/^\/data\//, "");
  return (metricMapForGuide(slug)?.types ?? []).filter((t) => t.family === "health-connect").map(resolveMetricType);
}

/** Resolved identifier records for a matrix row — the join this page renders. */
export function resolvedIdentifiers(row: Row): { name: string; record: HkIdentifier | undefined }[] {
  return appleCases(row.apple).map((name) => ({ name, record: byCase.get(name) }));
}

export default function MetricFacts({ path }: { path: string }) {
  const row = metricForPath(path);
  const unmatrixed = row ? undefined : NO_MATRIX_ROW[path];
  if (!row && !unmatrixed) return null;

  const label = row?.label ?? unmatrixed!.label;
  const cases = row ? appleCases(row.apple) : unmatrixed!.cases;
  const android = row ? [] : mappedHealthConnect(path);
  const known = cases.map((name) => ({ name, record: byCase.get(name) })).filter((r) => r.record);
  if (known.length === 0) return null;

  const cumulative = known.filter((r) => r.record!.aggregation === "cumulative");
  const discrete = known.filter((r) => r.record!.aggregation === "discrete");

  return (
    <section
      data-metric-facts={row ? "full" : android.length ? "described" : "apple-only"}
      className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">
        {label} {row || android.length ? "on the platform stores" : "in Apple HealthKit"}
      </h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Read from Apple&rsquo;s documentation on {HK_FETCHED_ON}
        {row ? (
          <>
            {" "}
            and from our verified{" "}
            <Link href="/matrix" className="hover:text-[var(--fg)]">
              cross-platform reference
            </Link>
          </>
        ) : android.length ? (
          <>{` and from Google's Health Connect reference on ${HC_FETCHED_ON}`}</>
        ) : null}
        . Not hand-written — regenerated with the dataset.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th scope="col" className="py-2 pr-4 font-semibold">Apple HealthKit</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Aggregate with</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Unit</th>
              <th scope="col" className="py-2 font-semibold">iOS</th>
            </tr>
          </thead>
          <tbody>
            {known.map(({ name, record }) => (
              <tr key={name} className="border-b border-[var(--border)] align-top">
                <td className="py-2 pr-4">
                  <Link
                    href={`/healthkit-identifiers#id-${name.toLowerCase()}`}
                    className="font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                  >
                    {name}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">
                  {record!.aggregation === "cumulative" ? (
                    <code className="font-mono text-xs">.cumulativeSum</code>
                  ) : record!.aggregation === "discrete" ? (
                    <code className="font-mono text-xs">.discreteAverage</code>
                  ) : record!.family === "quantity" ? (
                    "not stated by Apple"
                  ) : (
                    <>n/a — {record!.valueEnum ?? "category type"}</>
                  )}
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">{record!.unitFamily ?? "—"}</td>
                <td className="py-2 tabular-nums text-[var(--muted)]">
                  {record!.platforms.find((p) => p.name === "iOS")?.introducedAt ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Android Health Connect
          </dt>
          <dd className="mt-1 text-[13px] text-[var(--fg)]">
            {row ? (
              <span className="font-mono">{row.android}</span>
            ) : android.length ? (
              <>
                {android.map((r, i) => (
                  <span key={r.id}>
                    {i > 0 ? ", " : ""}
                    <Link href={r.href} className="font-mono text-brand-600 hover:text-brand-500">
                      {r.label}
                    </Link>
                  </span>
                ))}
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {"Listed because Google's own description of each record names this metric, quoted under By platform " +
                    "above. Not a row of the verified matrix, which pairs types one to one."}
                </span>
              </>
            ) : (
              <span className="text-[var(--muted)]">No Health Connect record is listed for this metric.</span>
            )}
          </dd>
        </div>
        {(cumulative.length > 0 || discrete.length > 0) && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Query shape
            </dt>
            <dd className="mt-1 text-sm text-[var(--muted)]">
              {cumulative.length > 0 && discrete.length > 0 ? (
                <>
                  Mixed — sum{" "}
                  {cumulative.map((c) => c.name).join(", ")} but average{" "}
                  {discrete.map((d) => d.name).join(", ")}. Do not treat them alike.
                </>
              ) : cumulative.length > 0 ? (
                <>Cumulative: sum the samples over your interval.</>
              ) : (
                <>Discrete: average or take min/max. Summing these produces a meaningless number.</>
              )}
            </dd>
          </div>
        )}
      </dl>

      {row?.watchOut && (
        <p className="mt-4 rounded-lg border border-amber-400/40 bg-amber-500/5 p-3 text-sm text-[var(--fg)]">
          <strong className="font-semibold">Watch out:</strong> {row.watchOut}
        </p>
      )}

      <p className="mt-4 text-xs text-[var(--muted)]">
        Full set:{" "}
        <Link href="/healthkit-identifiers" className="font-medium text-brand-600 hover:text-brand-500">
          every HealthKit type identifier
        </Link>{" "}
        ·{" "}
        <Link href="/healthkit-errors" className="font-medium text-brand-600 hover:text-brand-500">
          every HealthKit error code
        </Link>
      </p>
    </section>
  );
}
