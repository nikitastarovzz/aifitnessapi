import type { ReactNode } from "react";

/** A plain, horizontally scrollable data table for the /research pages. */
export default function ResearchTable({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[520px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-[var(--surface)] text-xs uppercase tracking-wider text-[var(--muted)]">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] text-[var(--fg)]">
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, k) => (
                <td key={k} className="px-3 py-2">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
