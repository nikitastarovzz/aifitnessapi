"use client";

import { useMemo, useState } from "react";
import type { ResolvedMatrix, CellValue, ResolvedCell } from "@/lib/evidenceMatrix";
import { rankRows } from "@/lib/evidenceMatrixCore.mjs";

/**
 * The interactive half of /tools/gym-software-api-matrix and
 * /tools/research-platform-chooser. Takes a matrix whose cells already carry
 * their quotes (src/lib/evidenceMatrix.ts resolves them at build time), lets
 * the reader require features, and orders the rows by how many of those the
 * vendors' own pages document. The server render is the full table with no
 * filter, so the page reads the same without JavaScript.
 */

const BADGE: Record<CellValue, string> = {
  yes: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  no: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  unknown: "bg-[var(--surface)] text-[var(--muted)]",
};
const WORD: Record<CellValue, string> = { yes: "Documented", no: "No", unknown: "Not stated" };

function Cell({ cell, feature }: { cell: ResolvedCell; feature: boolean }) {
  return (
    <div>
      {feature ? (
        <span className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold ${BADGE[cell.value]}`}>{WORD[cell.value]}</span>
      ) : null}
      <span className={`block ${feature ? "mt-1" : ""} ${cell.value === "unknown" && cell.sources.length === 0 ? "text-[var(--muted)]" : ""}`}>{cell.text}</span>
      {cell.sources.length > 0 ? (
        <details className="mt-1">
          <summary className="cursor-pointer text-[11px] text-brand-600">
            {cell.sources.length === 1 ? "Source quote" : `${cell.sources.length} source quotes`}
          </summary>
          <ul className="mt-1 space-y-1">
            {cell.sources.map((s, i) => (
              <li key={i} className="text-[11px] text-[var(--muted)]">
                <q>{s.quote}</q>{" "}
                <a href={s.url} rel="noopener" className="break-all text-brand-600 hover:text-brand-500">
                  {new URL(s.url).hostname}
                </a>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

export default function EvidenceMatrixTool({ matrix, rowLabel }: { matrix: ResolvedMatrix; rowLabel: string }) {
  const features = matrix.columns.filter((c) => c.kind === "feature");
  const [required, setRequired] = useState<string[]>([]);
  const ranked = useMemo(() => rankRows(matrix.rows, required), [matrix.rows, required]);
  const toggle = (id: string) => setRequired((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  const need = (id: string) => features.find((f) => f.id === id)?.need ?? id;

  return (
    <div data-evidence-matrix={matrix.id}>
      <fieldset className="mt-8 rounded-xl border border-[var(--border)] p-4">
        <legend className="px-1 text-sm font-semibold text-[var(--fg)]">What do you need?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {features.map((f) => (
            <label key={f.id} className="flex items-start gap-2 text-sm text-[var(--fg)]">
              <input type="checkbox" className="mt-1" checked={required.includes(f.id)} onChange={() => toggle(f.id)} />
              <span>{f.need}</span>
            </label>
          ))}
        </div>
        {required.length > 0 ? (
          <button type="button" onClick={() => setRequired([])} className="mt-3 text-xs font-medium text-brand-600 hover:text-brand-500">
            Clear
          </button>
        ) : null}
      </fieldset>

      {required.length > 0 ? (
        <ol className="mt-6 space-y-2" aria-live="polite">
          {ranked.map(({ row, met, missing }) => (
            <li key={row.id} className="rounded-lg border border-[var(--border)] p-3 text-sm">
              <span className="font-semibold text-[var(--fg)]">{row.name}</span>{" "}
              <span className="text-[var(--muted)]">
                documents {met} of {required.length}
                {missing.length ? ` · not documented: ${missing.map(need).join(", ")}` : ""}
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-xs">
          <thead className="uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-2 pr-3 align-bottom">{rowLabel}</th>
              {matrix.columns.map((c) => (
                <th key={c.id} className={`py-2 pr-3 align-bottom ${required.includes(c.id) ? "text-brand-600" : ""}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map(({ row }) => (
              <tr key={row.id} id={row.id} className="scroll-mt-20 border-t border-[var(--border)] align-top text-[var(--fg)]">
                <th scope="row" className="py-3 pr-3 text-sm font-semibold">
                  {row.page ? (
                    <a href={row.page.href} className="text-brand-600 hover:text-brand-500">
                      {row.name}
                    </a>
                  ) : (
                    row.name
                  )}
                </th>
                {matrix.columns.map((c) => (
                  <td key={c.id} className="min-w-[140px] py-3 pr-3">
                    <Cell cell={row.cells[c.id]} feature={c.kind === "feature"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
