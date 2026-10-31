"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { derive, shortDate, type Derived, type IndexRow } from "@/lib/ecosystemDerive";

/**
 * The /fitness-api-index table: raw signals per product, sortable, with no
 * score. Sorting is the only ordering, it is the reader's, and the position
 * column just numbers the current sort.
 *
 * The funder's row (KinesteX) is pulled out of every sort and pinned below
 * the ranked rows with its label instead of a position. It is still shown,
 * with the same columns computed the same way, because hiding it would hide
 * a fact; ranking it would put the site's funder in a league table the site
 * publishes.
 *
 * Dates are data; windows and ages are relative to a day. The server renders
 * them as of the build (`buildDate`) and the first client render does the
 * same, so the two agree; an effect then moves `asOf` to today, which is what
 * keeps a page built weeks ago truthful about "the last 12 months".
 */

type Key =
  | "product"
  | "billing"
  | "gate"
  | "userCost"
  | "pricingPage"
  | "sdk12"
  | "sdkLatest"
  | "packages"
  | "packageLatest"
  | "changes12"
  | "changeLatest"
  | "pages"
  | "verified";

type Col = { key: Key; label: string; hint?: string; value: (r: IndexRow, d: Derived) => number | string | null };

const BILLING_ORDER: Record<string, number> = { free: 0, "free-tier-then-paid": 1, "usage-based": 2, "contact-sales": 3 };

const COLS: Col[] = [
  { key: "product", label: "Product", value: (r) => r.label.toLowerCase() },
  { key: "billing", label: "Billing", value: (r) => BILLING_ORDER[r.devCost] },
  { key: "gate", label: "Approval gate", value: (r) => (r.approvalGate ? 1 : 0) },
  { key: "userCost", label: "User-side cost", value: (r) => (r.userSideCost ? 1 : 0) },
  { key: "pricingPage", label: "Pricing page here", value: (r) => (r.pricingPage ? 1 : 0) },
  { key: "sdk12", label: "Vendor SDK releases, 12 mo", value: (_, d) => d.sdkReleases12 },
  { key: "sdkLatest", label: "Last vendor SDK release", value: (_, d) => d.sdkLatest },
  { key: "packages", label: "Packages tracked (released, 12 mo)", value: (_, d) => (d.packageCount ? d.packageCount : null) },
  { key: "packageLatest", label: "Newest package release", value: (_, d) => d.packageLatest },
  { key: "changes12", label: "Tracked changes, 12 mo", value: (_, d) => d.changes12 },
  { key: "changeLatest", label: "Latest tracked change", value: (_, d) => d.changeLatest?.sortDate ?? null },
  { key: "pages", label: "Pages here", value: (r) => r.pages },
  { key: "verified", label: "Last verified (age)", value: (_, d) => d.verifiedAge },
];

const NA = <span className="text-[var(--muted)]">—</span>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ApiIndexTable({
  rows,
  buildDate,
  categories,
}: {
  rows: IndexRow[];
  buildDate: string;
  categories: string[];
}) {
  const [asOf, setAsOf] = useState(buildDate);
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: "changes12", dir: -1 });
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setAsOf(today());
  }, []);

  const derived = useMemo(() => new Map(rows.map((r) => [r.id, derive(r, asOf)])), [rows, asOf]);

  const col = COLS.find((c) => c.key === sort.key) ?? COLS[0];
  const visible = rows.filter((r) => category === "all" || r.categoryLabel === category);
  const ranked = visible
    .filter((r) => !r.firstParty)
    .sort((a, b) => {
      const va = col.value(a, derived.get(a.id)!);
      const vb = col.value(b, derived.get(b.id)!);
      // Missing values sort last in both directions: "not tracked" is not a zero.
      if (va === null && vb === null) return a.label.localeCompare(b.label);
      if (va === null) return 1;
      if (vb === null) return -1;
      if (va === vb) return a.label.localeCompare(b.label);
      return (va < vb ? -1 : 1) * sort.dir;
    });
  const unranked = visible.filter((r) => r.firstParty);

  const onSort = (key: Key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "product" ? 1 : -1 }));

  const th = "whitespace-nowrap px-2 py-2 text-left align-bottom text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]";
  const td = "px-2 py-2 align-top";

  const row = (r: IndexRow, position: number | null) => {
    const d = derived.get(r.id)!;
    return (
      <tr
        key={r.id}
        data-index-row={r.id}
        {...(r.firstParty ? { "data-unranked": "" } : {})}
        className={`border-t border-[var(--border)] ${r.firstParty ? "bg-amber-500/5" : ""}`}
      >
        <td className={`${td} text-right tabular-nums text-[var(--muted)]`}>
          {position ?? (
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-[var(--fg)]">
              not ranked
            </span>
          )}
        </td>
        <th scope="row" className={`${td} min-w-[11rem] text-left font-normal`}>
          <Link href={r.href} className="font-semibold text-[var(--fg)] hover:text-brand-600">
            {r.label}
          </Link>
          <span className="block text-[11px] text-[var(--muted)]">{r.categoryLabel}</span>
          {r.firstParty && (
            <span className="mt-0.5 block text-[11px] font-medium text-[var(--fg)]">Funds this site — not ranked</span>
          )}
        </th>
        <td className={`${td} whitespace-nowrap`}>
          {r.devCostLabel}
          {r.quoteOnly && <span className="block text-[11px] text-[var(--muted)]">no public price</span>}
        </td>
        <td className={td}>{r.approvalGate ? "Yes" : <span className="text-[var(--muted)]">None documented</span>}</td>
        <td className={td}>{r.userSideCost ? "Yes" : <span className="text-[var(--muted)]">None documented</span>}</td>
        <td className={td}>
          {r.pricingPage ? (
            <Link href={r.pricingPage.href} className="text-brand-600 hover:text-brand-500">
              Yes
            </Link>
          ) : (
            NA
          )}
        </td>
        <td className={`${td} tabular-nums`}>
          {d.sdkReleases12 === null ? <span className="text-[var(--muted)]">not tracked</span> : d.sdkReleases12}
        </td>
        <td className={`${td} whitespace-nowrap tabular-nums`}>
          {d.sdkLatest ? shortDate(d.sdkLatest) : NA}
          {r.officialSdk?.latestVersion && (
            <span className="block text-[11px] text-[var(--muted)]">{r.officialSdk.latestVersion}</span>
          )}
        </td>
        <td className={`${td} whitespace-nowrap tabular-nums`}>
          {d.packageCount ? (
            <>
              {d.packageCount} <span className="text-[var(--muted)]">({d.packagesActive12})</span>
            </>
          ) : (
            NA
          )}
        </td>
        <td className={`${td} whitespace-nowrap tabular-nums`}>{d.packageLatest ? shortDate(d.packageLatest) : NA}</td>
        <td className={`${td} whitespace-nowrap tabular-nums`}>
          {d.changes12}
          {d.changesAhead > 0 && <span className="block text-[11px] text-[var(--muted)]">+{d.changesAhead} dated ahead</span>}
        </td>
        <td className={`${td} whitespace-nowrap tabular-nums`}>{d.changeLatest ? shortDate(d.changeLatest.date) : NA}</td>
        <td className={`${td} tabular-nums`}>{r.pages}</td>
        <td className={`${td} whitespace-nowrap tabular-nums`}>
          {r.verified ? (
            <>
              <Link href={r.verified.href} className="text-[var(--fg)] hover:text-brand-600">
                {shortDate(r.verified.date)}
              </Link>
              <span
                className={`block text-[11px] ${d.verifiedAge !== null && d.verifiedAge > 90 ? "font-semibold text-amber-600 dark:text-amber-400" : "text-[var(--muted)]"}`}
              >
                {d.verifiedAge} days{d.verifiedAge !== null && d.verifiedAge > 90 ? " · over 90" : ""}
              </span>
            </>
          ) : (
            <span className="text-[var(--muted)]">not recorded</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div data-api-index>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <label className="flex items-center gap-2 text-[var(--muted)]">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm text-[var(--fg)]"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-[var(--muted)]" aria-live="polite">
          Windows and ages as of <strong className="text-[var(--fg)]">{shortDate(asOf)}</strong>
          {asOf !== buildDate ? ` (page built ${shortDate(buildDate)})` : " (build date)"} · sorted by{" "}
          {col.label.toLowerCase()}, {sort.dir === -1 ? "high to low" : "low to high"}
        </span>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[68rem] border-collapse text-sm text-[var(--fg)]">
          <caption className="sr-only">
            Fitness API ecosystem signals per product. Column headers sort the table. KinesteX funds this site and
            is listed below the ranked rows, unranked.
          </caption>
          <thead className="bg-[var(--surface)]">
            <tr>
              <th scope="col" className={`${th} text-right`}>
                #
              </th>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                  className={th}
                >
                  <button
                    type="button"
                    onClick={() => onSort(c.key)}
                    className={`inline-flex items-end gap-1 whitespace-normal text-left uppercase hover:text-[var(--fg)] ${sort.key === c.key ? "text-[var(--fg)]" : ""}`}
                  >
                    {c.label}
                    <span aria-hidden="true">{sort.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : "↕"}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => row(r, i + 1))}
            {unranked.length > 0 && (
              <tr className="border-t-2 border-[var(--border)]">
                <td colSpan={COLS.length + 1} className="px-2 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Not ranked — funds this site
                </td>
              </tr>
            )}
            {unranked.map((r) => row(r, null))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
