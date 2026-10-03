"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type PermissionRow = {
  /** Fragment id, stable across renders (perm-read-steps). */
  id: string;
  value: string;
  constant: string;
  access: "Read" | "Write" | "—";
  records: { className: string; href: string }[];
  availability: string | null;
  protectionLevel: string | null;
  description: string | null;
};

type SortKey = "value" | "availability";

/**
 * A filterable, sortable permission table. Every row is in the server HTML
 * (the initial state shows all of them, in the order given), so crawlers and
 * readers without JavaScript get the complete list; the filter and sort only
 * narrow or reorder what is already there.
 */
export default function PermissionTable({ rows, label }: { rows: PermissionRow[]; label: string }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("value");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? rows.filter(
          (r) =>
            r.value.toLowerCase().includes(needle) ||
            r.records.some((x) => x.className.toLowerCase().includes(needle)) ||
            (r.description ?? "").toLowerCase().includes(needle),
        )
      : rows;
    if (sort === "value") return filtered;
    const api = (s: string | null) => Number(s?.match(/API (\d+)/)?.[1] ?? s?.match(/version (\d+)/)?.[1] ?? 999);
    return [...filtered].sort((a, b) => api(a.availability) - api(b.availability) || a.value.localeCompare(b.value));
  }, [rows, q, sort]);

  return (
    <div className="mt-4">
      {rows.length > 8 && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex-1">
            <span className="sr-only">Filter {label}</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Filter ${rows.length} strings (e.g. STEPS, SleepSessionRecord)`}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]"
            />
          </label>
          <label className="text-sm text-[var(--muted)]">
            Sort{" "}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--fg)]"
            >
              <option value="value">A–Z</option>
              <option value="availability">By API level</option>
            </select>
          </label>
        </div>
      )}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th scope="col" className="py-2 pr-4 font-semibold">Permission string</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Access</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Record</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Available</th>
              <th scope="col" className="py-2 font-semibold">Google&rsquo;s description</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} id={r.id} data-hc-permission={r.value} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                <td className="py-2 pr-4">
                  <code className="break-all font-mono text-[13px] text-[var(--fg)]">{r.value}</code>
                  <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">HealthPermissions.{r.constant}</span>
                </td>
                <td className="py-2 pr-4 text-[var(--muted)]">{r.access}</td>
                <td className="py-2 pr-4">
                  {r.records.length ? (
                    r.records.map((x) => (
                      <Link
                        key={x.className}
                        href={x.href}
                        className="block font-mono text-[12px] text-brand-600 hover:text-brand-500"
                      >
                        {x.className}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--muted)]">—</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                  {r.availability ?? "—"}
                  {r.protectionLevel && r.protectionLevel !== "dangerous" && (
                    <span className="mt-0.5 block">protection: {r.protectionLevel}</span>
                  )}
                </td>
                <td className="py-2 text-[var(--muted)]">{r.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="mt-3 text-sm text-[var(--muted)]">No string matches that filter.</p>}
      </div>
    </div>
  );
}
