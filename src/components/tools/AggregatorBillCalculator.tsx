"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ShareRow from "@/components/ShareRow";
import {
  BOUNDS,
  DEFAULT_INPUTS,
  billAll,
  billHash,
  clampInputs,
  money,
  parseBillHash,
  type BillInputs,
  type BillResult,
  type BillSource,
} from "@/lib/aggregatorBill.mjs";

/**
 * The aggregator bill calculator. All arithmetic and every quoted price is
 * lib/aggregatorBill.mjs (unit-tested in scripts/aggregator-bill.test.mjs);
 * this component holds the four inputs, keeps them in the address hash
 * (#users=…&sources=…&months=…&billing=…) so a scenario can be shared, and
 * renders the result. Nothing is sent anywhere: the hash never reaches a
 * server, and the share row's clicks carry a fixed id only.
 */

const field = "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]";
const linkCls = "font-medium text-brand-600 hover:text-brand-500";

function Quote({ src }: { src: BillSource }) {
  return (
    <li className="mt-2">
      <blockquote className="border-l-2 border-brand-400 pl-3 text-xs text-[var(--muted)]">{src.quote}</blockquote>
      <a href={src.url} rel="noopener" className={`text-xs ${linkCls}`}>
        {src.url.replace(/^https:\/\//, "")}
      </a>
    </li>
  );
}

function Detail({ r, months }: { r: BillResult; months: number }) {
  if (!r.computable) {
    return (
      <ul className="list-none">
        {r.sources.map((s) => (
          <Quote key={s.quote} src={s} />
        ))}
      </ul>
    );
  }
  const seen = new Set<string>();
  const quotes: BillSource[] = [];
  for (const o of r.options)
    for (const u of o.uses) {
      if (seen.has(u.src.quote)) continue;
      seen.add(u.src.quote);
      quotes.push(u.src);
    }
  return (
    <div className="space-y-3">
      {r.options.map((o) => (
        <div key={o.plan}>
          <p className="text-xs font-semibold text-[var(--fg)]">
            {o.plan}: {money(o.monthly, r.vendor.currency)} a month
            {o.conditional ? ` (${o.conditional})` : ""}
          </p>
          <ul className="mt-1 list-disc pl-5 text-xs text-[var(--muted)]">
            {o.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
            <li>
              × 12 = {money(o.monthly * 12, r.vendor.currency)} a year; × {months} = {money(o.monthly * months, r.vendor.currency)} over {months} month
              {months === 1 ? "" : "s"}
            </li>
          </ul>
        </div>
      ))}
      <div>
        <p className="text-xs font-semibold text-[var(--fg)]">Every number above, in the vendor&apos;s words</p>
        <ul className="list-none">
          {quotes.map((s) => (
            <Quote key={s.quote} src={s} />
          ))}
          {r.options.map((o) => (o.conditionalSrc ? <Quote key={o.conditionalSrc.quote} src={o.conditionalSrc} /> : null))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold text-[var(--fg)]">Assumptions</p>
        <ul className="list-none">
          {r.notes.map((nt) => (
            <li key={nt.text} className="mt-2 text-xs text-[var(--muted)]">
              {nt.text}
              <ul className="list-none">
                <Quote src={nt.src} />
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AggregatorBillCalculator() {
  const [inputs, setInputs] = useState<BillInputs>(DEFAULT_INPUTS);
  const touched = useRef(false);

  const readHash = useCallback(() => {
    const s = parseBillHash(window.location.hash);
    if (s) setInputs(s);
  }, []);
  useEffect(() => {
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [readHash]);
  // Write the hash only after the reader changes something, so arriving on
  // another anchor (#faq-2, #case-labs) is never rewritten.
  useEffect(() => {
    if (!touched.current) return;
    const next = billHash(inputs);
    if (window.location.hash !== next) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
  }, [inputs]);

  const set = (k: keyof BillInputs, v: string) => {
    touched.current = true;
    setInputs((s) => clampInputs({ ...s, [k]: v }));
  };

  const results = billAll(inputs);

  return (
    <div data-bill-calculator>
      <div className="mt-6 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-[var(--fg)]">
          Active users
          <input type="number" min={BOUNDS.users[0]} max={BOUNDS.users[1]} value={inputs.users} onChange={(e) => set("users", e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Connected sources per user
          <input type="number" min={BOUNDS.sources[0]} max={BOUNDS.sources[1]} value={inputs.sources} onChange={(e) => set("sources", e.target.value)} className={field} />
          <span className="mt-1 block text-xs font-normal text-[var(--muted)]">A watch and a ring are two. Only Terra bills per source.</span>
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Months
          <input type="number" min={BOUNDS.months[0]} max={BOUNDS.months[1]} value={inputs.months} onChange={(e) => set("months", e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Billing period
          <select value={inputs.billing} onChange={(e) => set("billing", e.target.value)} className={field}>
            <option value="annual">Annual, where offered</option>
            <option value="monthly">Monthly, where offered</option>
          </select>
          <span className="mt-1 block text-xs font-normal text-[var(--muted)]">Terra publishes both; Sahha only annual prices; the rest one price.</span>
        </label>
      </div>

      <ShareRow place="aggregator-bill" text="What each health-data aggregator would bill at my user count, computed only from their published price sheets:" />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm" data-bill-results>
          <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-2 pr-3">Aggregator</th>
              <th className="py-2 pr-3">Plan</th>
              <th className="py-2 pr-3">Per month</th>
              <th className="py-2 pr-3">Per year</th>
              <th className="py-2">
                Over {inputs.months} month{inputs.months === 1 ? "" : "s"}
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.vendor.id} className="border-t border-[var(--border)] align-top" data-bill-row={`${r.vendor.id}:${r.computable ? "computed" : "not-computable"}`}>
                <td className="py-3 pr-3 font-semibold text-[var(--fg)]">
                  {r.vendor.page ? (
                    <Link href={r.vendor.page.href} className={linkCls}>
                      {r.vendor.name}
                    </Link>
                  ) : (
                    r.vendor.name
                  )}
                  <span className="mt-1 block text-xs font-normal text-[var(--muted)]">Billed on {r.vendor.unit}</span>
                </td>
                {r.computable ? (
                  <>
                    <td className="py-3 pr-3 text-[var(--fg)]">
                      {r.pick.plan}
                      {r.options.length > 1 ? (
                        <span className="mt-1 block text-xs text-[var(--muted)]">
                          {r.options
                            .filter((o) => o !== r.pick)
                            .map((o) => `${o.plan}: ${money(o.monthly, r.vendor.currency)}${o.conditional ? ` (${o.conditional.toLowerCase()})` : ""}`)
                            .join("; ")}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3 font-semibold text-[var(--fg)]">{money(r.monthly, r.vendor.currency)}</td>
                    <td className="py-3 pr-3 text-[var(--fg)]">{money(r.annual, r.vendor.currency)}</td>
                    <td className="py-3 text-[var(--fg)]">{money(r.total, r.vendor.currency)}</td>
                  </>
                ) : (
                  <td colSpan={4} className="py-3 text-[var(--fg)]">
                    <span className="font-semibold">Not computable from published pricing.</span>{" "}
                    <span className="text-[var(--muted)]">{r.reason}</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2">
        {results.map((r) => (
          <details key={r.vendor.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--fg)]">
              {r.vendor.name}: {r.computable ? "the formula and its sources" : "why it is not computable"}
            </summary>
            <div className="mt-3">
              <Detail r={r} months={inputs.months} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
