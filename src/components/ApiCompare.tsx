"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Side-by-side of two directory entries, from verified fields only.
 *
 * Deliberately a tool and not a page generator. Twenty-four products make 276
 * pairs, and publishing 276 pages assembled from four fields each would be
 * thin content that also competes with the hand-written comparisons in
 * /compare. A tool answers the same question, shares by URL, and ranks
 * nothing.
 *
 * There is no verdict here and there will not be one: these fields describe
 * how you get access, not which product is better, and a scoring rule over
 * "has an approval gate" would be a judgement dressed as arithmetic.
 */
export type CompareItem = {
  id: string;
  label: string;
  short: string;
  category: string;
  devCost: string;
  userSideCost: string | null;
  approvalGate: string | null;
  effort: string;
  pages: number;
  sourceHref: string;
};

const NONE = "None documented.";

export default function ApiCompare({ items }: { items: CompareItem[] }) {
  const [a, setA] = useState<string>(items[0]?.id ?? "");
  const [b, setB] = useState<string>(items[1]?.id ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const qa = q.get("a");
    const qb = q.get("b");
    if (qa && items.some((i) => i.id === qa)) setA(qa);
    if (qb && items.some((i) => i.id === qb)) setB(qb);
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined" || !a || !b) return;
    const next = `${window.location.pathname}?a=${a}&b=${b}`;
    if (window.location.pathname + window.location.search !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [a, b]);

  const left = items.find((i) => i.id === a);
  const right = items.find((i) => i.id === b);

  const rows: { label: string; get: (i: CompareItem) => string; note?: string }[] = [
    { label: "Category", get: (i) => i.category },
    { label: "How it bills developers", get: (i) => i.devCost },
    { label: "What each end user needs", get: (i) => i.userSideCost ?? NONE },
    { label: "What gates your launch", get: (i) => i.approvalGate ?? NONE },
    {
      label: "Integration effort",
      get: (i) => i.effort,
      note: "our rough judgement, not a vendor fact",
    },
    { label: "Pages here covering it", get: (i) => `${i.pages}` },
  ];

  const select = (
    value: string,
    onChange: (v: string) => void,
    label: string,
  ) => (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] focus:border-brand-400 focus:outline-none"
      >
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {select(a, setA, "Compare")}
        {select(b, setB, "With")}
      </div>

      {left && right && (
        <>
          {left.id === right.id ? (
            <p className="mt-8 text-sm text-[var(--muted)]">
              Pick two different products.
            </p>
          ) : (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-40 border-b border-[var(--border)] pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Field
                    </th>
                    <th className="border-b border-[var(--border)] pb-3 text-left font-semibold text-[var(--fg)]">
                      <Link href={`/apis/${left.id}`} className="hover:text-brand-600">
                        {left.label}
                      </Link>
                    </th>
                    <th className="border-b border-[var(--border)] pb-3 text-left font-semibold text-[var(--fg)]">
                      <Link href={`/apis/${right.id}`} className="hover:text-brand-600">
                        {right.label}
                      </Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="align-top">
                      <th className="border-b border-[var(--border)] py-3 pr-4 text-left text-xs font-semibold text-[var(--fg)]">
                        {r.label}
                        {r.note && (
                          <span className="block font-normal italic text-[var(--muted)]">
                            ({r.note})
                          </span>
                        )}
                      </th>
                      <td className="border-b border-[var(--border)] py-3 pr-4 text-[var(--muted)]">
                        {r.get(left)}
                      </td>
                      <td className="border-b border-[var(--border)] py-3 text-[var(--muted)]">
                        {r.get(right)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard
                  .writeText(`${window.location.origin}/compare-apis?a=${a}&b=${b}`)
                  .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  })
                  .catch(() => setCopied(false));
              }}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
            >
              {copied ? "Link copied" : "Copy link to this comparison"}
            </button>
            <Link
              href={`/apis/${left.id}`}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
            >
              {left.short} in full
            </Link>
            <Link
              href={`/apis/${right.id}`}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
            >
              {right.short} in full
            </Link>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
            Both columns come from the same provenance-tracked model, where every value is
            backed by a sentence already published here —{" "}
            <Link href={left.sourceHref} className="text-brand-600 hover:text-brand-500">
              {left.short}
            </Link>{" "}
            and{" "}
            <Link href={right.sourceHref} className="text-brand-600 hover:text-brand-500">
              {right.short}
            </Link>
            . &ldquo;None documented&rdquo; means we did not find one, which is not the same
            as there not being one.
          </p>
        </>
      )}
    </div>
  );
}
