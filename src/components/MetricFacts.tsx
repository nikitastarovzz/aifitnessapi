import Link from "next/link";
import { ROWS, type Row } from "@/data/matrix";
import { HK_IDENTIFIERS, HK_FETCHED_ON, type HkIdentifier } from "@/data/healthkitIdentifiers";

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

/**
 * Pull the HKQuantityTypeIdentifier / HKCategoryTypeIdentifier case names out
 * of a matrix `apple` cell.
 *
 * The cells are written for humans and use a shorthand the parser has to
 * honour: "HKQuantityTypeIdentifier.heartRate, .restingHeartRate" means two
 * identifiers, the second continuing the first's type. A trailing
 * parenthetical ("(values: inBed, awake…)") is prose about the enum and must
 * not be read as more cases.
 */
export function appleCases(apple: string): string[] {
  const withoutParens = apple.replace(/\([^)]*\)/g, " ");
  const out: string[] = [];
  for (const m of withoutParens.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

const byCase = new Map(HK_IDENTIFIERS.map((r) => [r.case, r]));

/**
 * Apple-only guides: /data pages whose HealthKit identifiers we can verify but
 * whose Health Connect counterpart we have NOT.
 *
 * src/data/matrix.ts is deliberately restricted to metrics confirmed against
 * both Apple's and Google's documentation, and Google's docs are not reachable
 * from the build environment. Rather than leave these four guides with no
 * platform facts at all, they get the Apple half — which is verified — and the
 * block says plainly that the Android side is unconfirmed. Adding a guessed
 * Health Connect record type here would be the exact failure matrix.ts exists
 * to prevent, so these stay half-filled until Google's side can be checked.
 */
const APPLE_ONLY: Record<string, { label: string; cases: string[] }> = {
  "/data/blood-glucose-api": { label: "Blood glucose", cases: ["bloodGlucose"] },
  "/data/blood-pressure-api": { label: "Blood pressure", cases: ["bloodPressureSystolic", "bloodPressureDiastolic"] },
  "/data/respiratory-rate-api": { label: "Respiratory rate", cases: ["respiratoryRate"] },
  "/data/menstrual-cycle-api": { label: "Menstrual cycle", cases: ["menstrualFlow"] },
};

/** Every identifier this component will try to render, for the qa gate. */
export function allReferencedCases(): { source: string; cases: string[] }[] {
  return [
    ...ROWS.map((r) => ({ source: r.href, cases: appleCases(r.apple) })),
    ...Object.entries(APPLE_ONLY).map(([href, v]) => ({ source: href, cases: v.cases })),
  ];
}

/** Resolved identifier records for a matrix row — the join this page renders. */
export function resolvedIdentifiers(row: Row): { name: string; record: HkIdentifier | undefined }[] {
  return appleCases(row.apple).map((name) => ({ name, record: byCase.get(name) }));
}

export default function MetricFacts({ path }: { path: string }) {
  const row = metricForPath(path);
  const appleOnly = row ? undefined : APPLE_ONLY[path];
  if (!row && !appleOnly) return null;

  const label = row?.label ?? appleOnly!.label;
  const cases = row ? appleCases(row.apple) : appleOnly!.cases;
  const known = cases.map((name) => ({ name, record: byCase.get(name) })).filter((r) => r.record);
  if (known.length === 0) return null;

  const cumulative = known.filter((r) => r.record!.aggregation === "cumulative");
  const discrete = known.filter((r) => r.record!.aggregation === "discrete");

  return (
    <section data-metric-facts={row ? "full" : "apple-only"} className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">
        {label} {row ? "on the platform stores" : "in Apple HealthKit"}
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
            ) : (
              <span className="text-[var(--muted)]">
                Not verified. Health Connect very likely names an equivalent record type, but we
                could not confirm it against Google&rsquo;s documentation, so we do not print one.
              </span>
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
