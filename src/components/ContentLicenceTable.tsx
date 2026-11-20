"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LicenceColumnId, LicenceKind } from "@/data/contentLicences";
import type { ResolvedRow } from "@/lib/contentLicences";

/**
 * The sortable, filterable table of "Can I ship it?" (ContentLicences). Sorting
 * is the reader's: by name, or by a column's values in the order the data
 * module lists them, documented answers first and "Not stated" last. It is a
 * sort of what the pages say, not a ranking of the sources. The server renders
 * the page's own kind (exercise or nutrition) and the default name order, and
 * the first client render matches it.
 */

type Column = { id: LicenceColumnId; label: string; values: string[] };
type SortKey = "name" | LicenceColumnId;

const KIND_LABEL: Record<"all" | LicenceKind, string> = { all: "All", exercise: "Exercise data", nutrition: "Food and nutrition data" };

/** Optional filters, each a plain reading of one column. */
const FILTERS: { id: string; label: string; test: (r: ResolvedRow) => boolean }[] = [
  { id: "free", label: "Has a free tier", test: (r) => r.cells.free.value === "yes" },
  { id: "commercial", label: "Commercial use stated as allowed", test: (r) => r.cells.commercial.value.startsWith("allowed") },
  { id: "copy", label: "Can self-host or keep a copy", test: (r) => r.cells.copy.value === "yes" || r.cells.copy.value === "on some plans" },
  { id: "media", label: "Images or video", test: (r) => r.cells.media.value === "yes" },
];

function shortDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** The badge word for a value; a stated price, "free" or licence shows its text instead. */
function valueLabel(v: string): string {
  if (v === "price" || v === "free" || v === "stated") return "";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function tone(col: LicenceColumnId, v: string, notStated: string): string {
  if (v === notStated) return "text-[var(--muted)]";
  if (v === "no" || v === "not allowed" || v === "trial only") return "text-amber-700 dark:text-amber-400";
  if (v === "sources disagree" || v === "allowed with conditions" || v === "on some plans" || v === "separate deal")
    return "text-[var(--fg)]";
  if (col === "attribution" && v === "required") return "text-[var(--fg)]";
  return "text-emerald-700 dark:text-emerald-400";
}

export default function ContentLicenceTable({
  columns,
  rows,
  sources,
  initialKind,
  notStated,
  currentPath,
}: {
  columns: Column[];
  rows: ResolvedRow[];
  /** Each source's URL by number; the quotes themselves are listed under the table by the server. */
  sources: { n: number; url: string; host: string }[];
  initialKind: LicenceKind;
  notStated: string;
  /** The page rendering the table, whose own row link is left out. */
  currentPath: string;
}) {
  const [kind, setKind] = useState<"all" | LicenceKind>(initialKind);
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });

  const shown = useMemo(() => {
    const rank = (r: ResolvedRow, key: SortKey): number | string => {
      if (key === "name") return r.name.toLowerCase();
      const col = columns.find((c) => c.id === key)!;
      return col.values.indexOf(r.cells[key].value);
    };
    return rows
      .filter((r) => kind === "all" || r.kind === kind)
      .filter((r) => FILTERS.every((f) => !on[f.id] || f.test(r)))
      .sort((a, b) => {
        const x = rank(a, sort.key);
        const y = rank(b, sort.key);
        const c = x < y ? -1 : x > y ? 1 : 0;
        return c * sort.dir || a.name.localeCompare(b.name);
      });
  }, [rows, columns, kind, on, sort]);

  const inKind = rows.filter((r) => kind === "all" || r.kind === kind).length;
  const sortBy = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  const ariaSort = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none");
  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : "");

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Which sources to show">
        {(["exercise", "nutrition", "all"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => setKind(k)}
            className={`min-h-[36px] rounded-full border px-3 py-1 text-xs transition-colors ${
              kind === k ? "border-brand-500 bg-brand-500/10 text-[var(--fg)]" : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400"
            }`}
          >
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
        {FILTERS.map((f) => (
          <label key={f.id} className="inline-flex min-h-[32px] cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={!!on[f.id]} onChange={(e) => setOn((o) => ({ ...o, [f.id]: e.target.checked }))} />
            {f.label}
          </label>
        ))}
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]" aria-live="polite">{`Showing ${shown.length} of ${inKind}`}</p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)]">
        <table className="w-full min-w-[920px] border-collapse text-left text-xs">
          <caption className="sr-only">
            Free tier, starting price, commercial use, attribution, media, self-hosting and license for each exercise and nutrition data source, with sources
          </caption>
          <thead>
            <tr className="bg-[var(--surface)] align-bottom">
              <th scope="col" aria-sort={ariaSort("name")} className="p-2.5 font-semibold text-[var(--fg)]">
                <button type="button" onClick={() => sortBy("name")} className="text-left hover:text-brand-600">
                  {`Source${arrow("name")}`}
                </button>
              </th>
              {columns.map((c) => (
                <th key={c.id} scope="col" aria-sort={ariaSort(c.id)} className="p-2.5 font-semibold text-[var(--fg)]">
                  <button type="button" onClick={() => sortBy(c.id)} className="text-left hover:text-brand-600">
                    {`${c.label}${arrow(c.id)}`}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} id={`ship-${r.id}`} data-licence-row={r.id} className="scroll-mt-24 border-t border-[var(--border)] align-top">
                <th scope="row" className="min-w-[150px] p-2.5 font-medium text-[var(--fg)]">
                  {r.name}
                  {r.page.href !== currentPath && (
                    <Link href={r.page.href} className="mt-1 block font-normal text-brand-600 hover:text-brand-500">
                      {r.page.label}
                    </Link>
                  )}
                  <span className="mt-1 block font-normal text-[var(--muted)]">
                    {r.checked.from === r.checked.to
                      ? `Read ${shortDate(r.checked.from)}`
                      : `Read ${shortDate(r.checked.from)} to ${shortDate(r.checked.to)}`}
                  </span>
                </th>
                {columns.map((c) => {
                  const cell = r.cells[c.id];
                  const word = valueLabel(cell.value);
                  return (
                    <td key={c.id} data-licence-cell={c.id} data-value={cell.value} className="min-w-[110px] p-2.5 text-[var(--muted)]">
                      {word && <span className={`block font-semibold ${tone(c.id, cell.value, notStated)}`}>{word}</span>}
                      {cell.text && <span className={word ? "mt-0.5 block" : "block text-[var(--fg)]"}>{cell.text}</span>}
                      {cell.sources.length > 0 && (
                        <span className="mt-0.5 block">
                          {cell.sources.map((n) => {
                            const s = sources[n - 1];
                            return (
                              <a
                                key={n}
                                href={s.url}
                                rel="nofollow noreferrer"
                                aria-label={`Source ${n}: ${s.host}`}
                                className="mr-1 text-[10px] text-brand-600 hover:text-brand-500"
                              >
                                {`[${n}]`}
                              </a>
                            );
                          })}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center text-[var(--muted)]">
                  No source here matches every filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
