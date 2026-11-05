"use client";

import { useMemo, useState } from "react";

/**
 * The filterable term table on /tools/exercise-taxonomy-crosswalk. The server
 * render shows every term; filtering hides rows in the browser and changes
 * nothing about what is mapped.
 */

export type TaxonomyRow = {
  id: string;
  database: string;
  databaseName: string;
  facet: string;
  facetLabel: string;
  term: string;
  alias: string | null;
  status: "mapped" | "unmapped";
  reason: string;
  exact: { label: string; href: string; name: string }[];
  contains: { label: string; href: string; name: string }[];
};

const sel = "rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm text-[var(--fg)]";

export default function TaxonomyTable({ rows }: { rows: TaxonomyRow[] }) {
  const [db, setDb] = useState("all");
  const [facet, setFacet] = useState("all");
  const [show, setShow] = useState("all");
  const [q, setQ] = useState("");
  const dbs = useMemo(() => [...new Map(rows.map((r) => [r.database, r.databaseName])).entries()], [rows]);
  const facets = useMemo(() => [...new Map(rows.map((r) => [r.facet, r.facetLabel])).entries()], [rows]);
  const needle = q.trim().toLowerCase();
  const visible = rows.filter(
    (r) =>
      (db === "all" || r.database === db) &&
      (facet === "all" || r.facet === facet) &&
      (show === "all" || (show === "mapped" ? r.status === "mapped" : r.contains.length > 0)) &&
      (!needle || `${r.term} ${r.alias ?? ""}`.toLowerCase().includes(needle)),
  );

  const links = (xs: TaxonomyRow["exact"]) =>
    xs.map((x) => (
      <span key={x.href} className="block">
        <a href={x.href} className="break-all font-mono text-brand-600 hover:text-brand-500">
          {x.name}
        </a>{" "}
        <span className="text-[var(--muted)]">({x.label})</span>
      </span>
    ));

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-xs text-[var(--muted)]">
          Database
          <select className={`${sel} mt-1 block`} value={db} onChange={(e) => setDb(e.target.value)}>
            <option value="all">All three</option>
            {dbs.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-[var(--muted)]">
          Facet
          <select className={`${sel} mt-1 block`} value={facet} onChange={(e) => setFacet(e.target.value)}>
            <option value="all">All facets</option>
            {facets.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-[var(--muted)]">
          Show
          <select className={`${sel} mt-1 block`} value={show} onChange={(e) => setShow(e.target.value)}>
            <option value="all">Every term</option>
            <option value="mapped">Mapped only</option>
            <option value="contains">With a name-contains hint</option>
          </select>
        </label>
        <label className="text-xs text-[var(--muted)]">
          Search
          <input className={`${sel} mt-1 block`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="kettlebell" />
        </label>
        <span className="text-xs text-[var(--muted)]" aria-live="polite">
          {visible.length} of {rows.length} terms
        </span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-2 pr-3">Term</th>
              <th className="py-2 pr-3">Database</th>
              <th className="py-2 pr-3">Facet</th>
              <th className="py-2 pr-3">Same name (mapped)</th>
              <th className="py-2">Name contains it (not a mapping)</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} id={r.id} className="scroll-mt-20 border-t border-[var(--border)] align-top text-[var(--fg)]">
                <td className="py-2 pr-3">
                  <span className="font-medium">{r.term}</span>
                  {r.alias ? <span className="block text-xs text-[var(--muted)]">English name: {r.alias}</span> : null}
                </td>
                <td className="py-2 pr-3 text-xs">{r.databaseName}</td>
                <td className="py-2 pr-3 text-xs">{r.facetLabel}</td>
                <td className="py-2 pr-3 text-xs">{r.exact.length ? links(r.exact) : <span className="text-[var(--muted)]">{r.reason}</span>}</td>
                <td className="py-2 text-xs">{r.contains.length ? links(r.contains) : <span className="text-[var(--muted)]">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
