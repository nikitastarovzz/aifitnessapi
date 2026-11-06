"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ShareRow from "@/components/ShareRow";
import {
  BOUNDS,
  DEFAULT_INPUTS,
  calcStateToSearch,
  evaluateAll,
  parseCalcState,
  totals,
  windowLabel,
  type CalcInputs,
  type RateLimitVendor,
} from "@/lib/rateLimitCalc.mjs";

/**
 * The calculator. All arithmetic is lib/rateLimitCalc.mjs (unit-tested in
 * scripts/rate-limit-calc.test.mjs); this component holds the inputs, keeps
 * them in the query string so a scenario can be shared, and renders the
 * result. The vendors and their quoted limits are passed in from the server
 * page, so the limits table is in the prerendered HTML.
 */

const fmt = (n: number, digits = 0) =>
  Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: digits }) : "no ceiling";
const pct = (u: number) => `${u < 0.001 ? "<0.1" : fmt(u * 100, u < 0.1 ? 1 : 0)}%`;
const SYNC_PRESETS = [
  { label: "Once a day", value: 1 },
  { label: "Every 6 hours", value: 4 },
  { label: "Hourly", value: 24 },
  { label: "Every 15 minutes", value: 96 },
  { label: "Every 5 minutes", value: 288 },
  { label: "Every minute", value: 1440 },
];
const SCOPE: Record<string, string> = { app: "whole app", user: "per user", unstated: "scope not stated; applied to whole app" };
const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function RateLimitCalculator({ vendors }: { vendors: RateLimitVendor[] }) {
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULT_INPUTS);
  const [tiers, setTiers] = useState<Record<string, string>>({});
  const router = useRouter();
  const pathname = usePathname();

  const readUrl = useCallback(() => {
    const s = parseCalcState(window.location.search, vendors);
    setInputs(s.inputs);
    setTiers(s.tiers);
  }, [vendors]);
  useEffect(() => {
    readUrl();
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, [readUrl]);
  useEffect(() => {
    const next = `${pathname}${calcStateToSearch({ inputs, tiers })}`;
    if (window.location.pathname + window.location.search !== next) router.replace(next, { scroll: false });
  }, [inputs, tiers, pathname, router]);

  const set = (k: keyof CalcInputs, v: string | number) =>
    setInputs((s) => {
      if (k === "timing") return { ...s, timing: v === "aligned" ? "aligned" : "spread" };
      const [lo, hi] = BOUNDS[k as keyof typeof BOUNDS];
      const n = Math.round(Number(v));
      return { ...s, [k]: Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : s[k] };
    });

  const results = evaluateAll(vendors, inputs, tiers);
  const t = totals(inputs);
  const field = "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]";

  return (
    <div>
      <div className="mt-6 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-[var(--fg)]">
          Active users
          <input type="number" min={BOUNDS.users[0]} max={BOUNDS.users[1]} value={inputs.users} onChange={(e) => set("users", e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Syncs per user per day
          <input type="number" min={BOUNDS.syncsPerDay[0]} max={BOUNDS.syncsPerDay[1]} value={inputs.syncsPerDay} onChange={(e) => set("syncsPerDay", e.target.value)} className={field} />
          <span className="mt-1 flex flex-wrap gap-1.5">
            {SYNC_PRESETS.map((p) => (
              <button key={p.value} type="button" onClick={() => set("syncsPerDay", p.value)} className={`rounded-full border px-2 py-0.5 text-[11px] ${inputs.syncsPerDay === p.value ? "border-brand-500 text-brand-600" : "border-[var(--border)] text-[var(--muted)]"}`}>
                {p.label}
              </button>
            ))}
          </span>
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Endpoints (requests) per sync
          <input type="number" min={BOUNDS.endpointsPerSync[0]} max={BOUNDS.endpointsPerSync[1]} value={inputs.endpointsPerSync} onChange={(e) => set("endpointsPerSync", e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          When users sync
          <select value={inputs.timing} onChange={(e) => set("timing", e.target.value)} className={field}>
            <option value="spread">Spread evenly over the day</option>
            <option value="aligned">All at once, on a schedule (cron)</option>
          </select>
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Days of data per request <span className="font-normal text-[var(--muted)]">(Terra counts these)</span>
          <input type="number" min={BOUNDS.daysPerRequest[0]} max={BOUNDS.daysPerRequest[1]} value={inputs.daysPerRequest} onChange={(e) => set("daysPerRequest", e.target.value)} className={field} />
        </label>
        <div className="text-sm text-[var(--muted)]" aria-live="polite">
          <p className="font-medium text-[var(--fg)]">Your traffic</p>
          <p className="mt-1">
            {fmt(t.perDay)} requests a day · {fmt(t.perMinuteAverage, 1)} a minute on average
            {inputs.timing === "aligned" ? ` · ${fmt(t.perMinutePeak)} in the minute a scheduled sync runs` : ""}
          </p>
        </div>
      </div>

      <ShareRow place="rate-limit-calculator" text="Will my app hit wearable API rate limits? My numbers, against every documented limit:" />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm" data-rate-results>
          <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-2 pr-3">API and tier</th>
              <th className="py-2 pr-3">Binds first</th>
              <th className="py-2 pr-3">You use</th>
              <th className="py-2 pr-3">Share</th>
              <th className="py-2">Most users at this pattern</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.vendor.id} className="border-t border-[var(--border)] align-top">
                <td className="py-3 pr-3">
                  <a href={`#limits-${r.vendor.id}`} className="font-semibold text-[var(--fg)] hover:text-brand-500">
                    {r.vendor.name}
                  </a>
                  {r.vendor.tiers.length > 1 ? (
                    <select
                      aria-label={`${r.vendor.name} tier`}
                      value={r.tier.id}
                      onChange={(e) => setTiers((s) => ({ ...s, [r.vendor.id]: e.target.value }))}
                      className="mt-1 block rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 text-xs text-[var(--fg)]"
                    >
                      {r.vendor.tiers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="block text-xs text-[var(--muted)]">{r.tier.label}</span>
                  )}
                </td>
                <td className="py-3 pr-3">
                  {fmt(r.binding.capacity, 1)} {r.binding.limit.unit === "days" ? "requested days" : "requests"} per {windowLabel(r.binding.limit.window)}
                  <span className="block text-xs text-[var(--muted)]">
                    {r.binding.limit.label} · {SCOPE[r.binding.limit.scope]} ·{" "}
                    <a href={r.binding.limit.src.url} rel="noopener" className={linkCls} title={`“${r.binding.limit.src.quote}”`}>
                      source
                    </a>
                  </span>
                </td>
                <td className="py-3 pr-3">{fmt(r.binding.demand, 1)}</td>
                <td className={`py-3 pr-3 font-semibold ${r.binding.utilization > 1 ? "text-rose-600" : r.binding.utilization > 0.8 ? "text-amber-600" : "text-emerald-600"}`}>
                  {pct(r.binding.utilization)}
                  {r.binding.utilization > 1 ? <span className="block text-xs font-normal">over the limit</span> : null}
                  {r.warnings.includes("span") ? <span className="block text-xs font-normal">one request may not span over five years</span> : null}
                </td>
                <td className="py-3">{fmt(r.binding.maxUsers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-10 text-lg font-bold text-[var(--fg)]">Every limit, at your numbers</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm" data-rate-all-limits>
          <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-2 pr-3">API</th>
              <th className="py-2 pr-3">Limit</th>
              <th className="py-2 pr-3">Allowed</th>
              <th className="py-2 pr-3">You use</th>
              <th className="py-2">Share</th>
            </tr>
          </thead>
          <tbody>
            {results.flatMap((r) =>
              r.rows.map((row) => (
                <tr key={`${r.vendor.id}-${row.limit.label}`} className="border-t border-[var(--border)]">
                  <td className="py-1.5 pr-3">{r.vendor.name}</td>
                  <td className="py-1.5 pr-3">
                    <a href={row.limit.src.url} rel="noopener" className={linkCls} title={`“${row.limit.src.quote}”`}>
                      {row.limit.label}
                    </a>
                  </td>
                  <td className="py-1.5 pr-3">{fmt(row.capacity, 1)}</td>
                  <td className="py-1.5 pr-3">{fmt(row.demand, 1)}</td>
                  <td className={`py-1.5 ${row.utilization > 1 ? "font-semibold text-rose-600" : ""}`}>{pct(row.utilization)}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
