"use client";

import { useMemo, useState } from "react";

/**
 * The filterable table behind /healthkit-identifiers.
 *
 * The page ships a trimmed row (no evidence sentences, one platform version
 * instead of six) because the full dataset is ~3x the size and the extra
 * fields are only needed server-side for the prose and the JSON-LD. The
 * complete record stays available in the downloadable dataset.
 */

export type HkRow = {
  c: string;  // Swift case
  o: string;  // Objective-C constant
  g: string;  // group
  a: string;  // abstract
  agg: "cumulative" | "discrete" | null;
  u: string | null;  // unit family
  ios: string | null;  // iOS introducedAt
};

const AGG_STYLE: Record<string, string> = {
  cumulative: "border-brand-400/60 bg-brand-500/10",
  discrete: "border-amber-400/50 bg-amber-500/10",
};

export default function HkIdentifierTable({ rows, groups }: { rows: HkRow[]; groups: string[] }) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string>("all");
  const [agg, setAgg] = useState<string>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (group !== "all" && r.g !== group) return false;
      if (agg !== "all" && (r.agg ?? "unstated") !== agg) return false;
      if (!needle) return true;
      return (
        r.c.toLowerCase().includes(needle) ||
        r.o.toLowerCase().includes(needle) ||
        r.a.toLowerCase().includes(needle) ||
        (r.u ?? "").includes(needle)
      );
    });
  }, [rows, q, group, agg]);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        <label className="min-w-0 flex-1 basis-56">
          <span className="sr-only">Filter identifiers</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter — try “energy”, “sleep”, or “cadence”"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]"
          />
        </label>
        <label className="min-w-0">
          <span className="sr-only">Filter by group</span>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
          >
            <option value="all">All groups</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="min-w-0">
          <span className="sr-only">Filter by aggregation style</span>
          <select
            value={agg}
            onChange={(e) => setAgg(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
          >
            <option value="all">Cumulative &amp; discrete</option>
            <option value="cumulative">Cumulative only</option>
            <option value="discrete">Discrete only</option>
            <option value="unstated">Not stated by Apple</option>
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">
        Showing {filtered.length} of {rows.length} identifiers.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th scope="col" className="py-2 pr-4 font-semibold">Identifier</th>
              <th scope="col" className="py-2 pr-4 font-semibold">What it measures</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Aggregation</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Units</th>
              <th scope="col" className="py-2 font-semibold">iOS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.c} id={`id-${r.c.toLowerCase()}`} className="border-b border-[var(--border)] align-top">
                <td className="py-3 pr-4">
                  <code className="font-mono text-[13px] font-semibold text-[var(--fg)]">{r.c}</code>
                  <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">{r.o}</span>
                </td>
                <td className="py-3 pr-4 text-[var(--muted)]">
                  {r.a || <span className="italic">Apple documents this type with no description.</span>}
                </td>
                <td className="py-3 pr-4">
                  {r.agg ? (
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${AGG_STYLE[r.agg]}`}>
                      {r.agg}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--muted)]">not stated</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-[var(--muted)]">{r.u ?? "—"}</td>
                <td className="py-3 tabular-nums text-[var(--muted)]">{r.ios ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
          No identifier matches that filter. Apple names types by what they measure, not by the
          product feature — try “energy” rather than “calories”, or “distance” rather than “miles”.
        </p>
      )}
    </div>
  );
}
