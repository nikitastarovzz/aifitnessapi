"use client";

import { useMemo, useState } from "react";
import type { SupportRow } from "@/data/libraryDataTypes";

/**
 * The filterable list of HealthKit identifiers and Health Connect record
 * classes one wrapper library maps, on /libraries/<slug>. Rows come from the
 * generated src/data/healthLibrarySupport.ts through supportRows(): each links
 * to this site's page for the type and to the line of the library's source it
 * was read from, at the pinned commit, with that line beside it.
 */

const FAMILY_LABEL: Record<string, string> = {
  quantity: "Quantity",
  category: "Category",
  characteristic: "Characteristic",
  record: "Record",
};

export default function LibrarySupportTable({ rows }: { rows: SupportRow[] }) {
  const [q, setQ] = useState("");
  const [store, setStore] = useState<string>("all");
  const [family, setFamily] = useState<string>("all");

  const stores = [...new Set(rows.map((r) => r.s))];
  const families = [...new Set(rows.filter((r) => store === "all" || r.s === store).map((r) => r.f))];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (store !== "all" && r.s !== store) return false;
      if (family !== "all" && r.f !== family) return false;
      if (!needle) return true;
      return r.n.toLowerCase().includes(needle) || (r.o ?? "").toLowerCase().includes(needle) || r.q.toLowerCase().includes(needle);
    });
  }, [rows, q, store, family]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3">
        <label className="min-w-0 flex-1 basis-56">
          <span className="sr-only">Filter data types</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter — try “heart”, “sleep” or “dietary”"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]"
          />
        </label>
        {stores.length > 1 && (
          <label className="min-w-0">
            <span className="sr-only">Filter by platform</span>
            <select
              value={store}
              onChange={(e) => {
                setStore(e.target.value);
                setFamily("all");
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
            >
              <option value="all">HealthKit &amp; Health Connect</option>
              <option value="hk">HealthKit only ({rows.filter((r) => r.s === "hk").length})</option>
              <option value="hc">Health Connect only ({rows.filter((r) => r.s === "hc").length})</option>
            </select>
          </label>
        )}
        {families.length > 1 && (
          <label className="min-w-0">
            <span className="sr-only">Filter by kind</span>
            <select
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
            >
              <option value="all">Every kind</option>
              {families.map((f) => (
                <option key={f} value={f}>
                  {FAMILY_LABEL[f] ?? f}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">
        Showing {filtered.length} of {rows.length}.
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th scope="col" className="py-2 pr-4 font-semibold">Type</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Kind</th>
              <th scope="col" className="py-2 font-semibold">Read from</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={`${r.s}-${r.n}`} className="border-b border-[var(--border)] align-top">
                <td className="py-3 pr-4">
                  <a href={r.p} className="break-all font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500">
                    {r.n}
                  </a>
                  {r.o && <span className="mt-0.5 block break-all font-mono text-[11px] text-[var(--muted)]">{r.o}</span>}
                </td>
                <td className="py-3 pr-4 text-xs text-[var(--muted)]">
                  {r.s === "hk" ? "HealthKit" : "Health Connect"} · {FAMILY_LABEL[r.f] ?? r.f}
                </td>
                <td className="py-3">
                  <a
                    href={r.u}
                    className="break-all font-mono text-[11px] text-brand-600 hover:text-brand-500"
                    rel="nofollow noreferrer"
                    target="_blank"
                  >
                    {r.w}
                  </a>
                  <code className="mt-1 block break-all font-mono text-[11px] text-[var(--muted)]">{r.q}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
          Nothing in this library&rsquo;s list matches that filter. HealthKit names types by what they measure
          (&ldquo;bodyMass&rdquo;, not &ldquo;weight&rdquo;); Health Connect names a record class
          (&ldquo;WeightRecord&rdquo;).
        </p>
      )}
    </div>
  );
}
