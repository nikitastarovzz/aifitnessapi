"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ShareRow from "@/components/ShareRow";
import {
  COVERAGE_METRICS,
  DELIVERY_LABELS,
  KIND_LABELS,
  cellState,
  coverageStateToSearch,
  filterVendors,
  parseCoverageState,
  visibleMetrics,
  type CoverageState,
  type CoverageVendor,
} from "@/lib/vendorCoverage.mjs";

/**
 * The filterable coverage matrix. Everything it shows is passed in from the
 * server page (lib/vendorCoverage.mjs plus the generated Google Health API
 * column), so the full table is in the prerendered HTML and the filters only
 * hide rows and columns.
 *
 * Filter state lives in the query string (?q=&m=&v=&push=1) so a filtered view
 * can be shared; it is read from window.location on the client, as ApiCompare
 * does, so the route stays prerendered with one canonical.
 */

const EMPTY: CoverageState = { q: "", metrics: [], vendors: [], push: false };
const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const chip = (on: boolean) =>
  `rounded-full border px-3 py-1 text-xs font-medium ${
    on ? "border-brand-500 bg-brand-600 text-white" : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
  }`;

export default function CoverageMatrix({ vendors, checked }: { vendors: CoverageVendor[]; checked: Record<string, string> }) {
  const [state, setState] = useState<CoverageState>(EMPTY);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ids = useMemo(() => vendors.map((v) => v.id), [vendors]);

  const readUrl = useCallback(() => setState(parseCoverageState(window.location.search, ids)), [ids]);
  useEffect(() => {
    readUrl();
    window.addEventListener("popstate", readUrl);
    return () => window.removeEventListener("popstate", readUrl);
  }, [readUrl]);

  useEffect(() => {
    const next = `${pathname}${coverageStateToSearch(state)}`;
    if (window.location.pathname + window.location.search !== next) router.replace(next, { scroll: false });
  }, [state, pathname, router]);

  const shown = filterVendors(vendors, state);
  const metrics = visibleMetrics(state);
  const toggle = (key: "metrics" | "vendors", id: string) =>
    setState((s) => ({ ...s, [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id] }));

  return (
    <div>
      <div className="mt-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="block text-sm font-medium text-[var(--fg)]">
          Search vendors and documented cells
          <input
            type="search"
            value={state.q}
            onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
            placeholder="e.g. glucose, 5-minute, Polar"
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
          />
        </label>
        <fieldset>
          <legend className="text-sm font-medium text-[var(--fg)]">Must document every metric picked</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {COVERAGE_METRICS.map((m) => (
              <button key={m.id} type="button" aria-pressed={state.metrics.includes(m.id)} className={chip(state.metrics.includes(m.id))} onClick={() => toggle("metrics", m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium text-[var(--fg)]">Only these vendors</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {vendors.map((v) => (
              <button key={v.id} type="button" aria-pressed={state.vendors.includes(v.id)} className={chip(state.vendors.includes(v.id))} onClick={() => toggle("vendors", v.id)}>
                {v.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2 text-[var(--fg)]">
            <input type="checkbox" checked={state.push} onChange={(e) => setState((s) => ({ ...s, push: e.target.checked }))} />
            Documents a webhook or push
          </label>
          <button type="button" className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400" onClick={() => setState(EMPTY)}>
            Clear filters
          </button>
          <button
            type="button"
            className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-500"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href).then(
                () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                },
                () => setCopied(false),
              );
            }}
          >
            {copied ? "Link copied" : "Copy link to this view"}
          </button>
          <span className="text-[var(--muted)]" aria-live="polite">
            {shown.length} of {vendors.length} vendors
          </span>
        </div>
        <ShareRow place="api-coverage-matrix" text="Which wearable APIs document which health metrics, at what resolution, by webhook or pull:" label="Share this view" />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm" data-coverage-matrix>
          <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="sticky left-0 bg-[var(--bg)] py-2 pr-3">Vendor</th>
              {metrics.map((m) => (
                <th key={m.id} className="px-1.5 py-2 text-center align-bottom normal-case tracking-normal">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((v) => (
              <tr key={v.id} className="border-t border-[var(--border)]">
                <th scope="row" className="sticky left-0 bg-[var(--bg)] py-2 pr-3 font-semibold text-[var(--fg)]">
                  <a href={`#vendor-${v.id}`} className="hover:text-brand-500">
                    {v.name}
                  </a>
                  <span className="block text-[11px] font-normal text-[var(--muted)]">{KIND_LABELS[v.kind]}</span>
                </th>
                {metrics.map((m) => {
                  const { state: st, cell } = cellState(v, m.id);
                  if (st === "unknown")
                    return (
                      <td key={m.id} className="px-1.5 py-2 text-center">
                        <Link href={v.guide} className="text-[var(--muted)] hover:text-[var(--fg)]" title={`Not stated in the ${v.name} pages read; see the guide for what was read`} aria-label={`${m.label}: not stated for ${v.name}`}>
                          ?
                        </Link>
                      </td>
                    );
                  return (
                    <td key={m.id} className="px-1.5 py-2 text-center" data-cell={`${v.id}:${m.id}:${st}`}>
                      <a
                        href={cell!.src.url}
                        rel="noopener"
                        title={`${cell!.note}${cell!.res ? ` · ${cell!.res}` : ""} — ${cell!.src.table ? cell!.src.quote : `“${cell!.src.quote}”`}`}
                        aria-label={`${m.label}: ${st === "yes" ? "documented" : "documented as not available"} for ${v.name}`}
                        className={st === "yes" ? "font-bold text-emerald-600 hover:text-emerald-500" : "font-bold text-rose-600 hover:text-rose-500"}
                      >
                        {st === "yes" ? "✓" : "✗"}
                      </a>
                      {cell!.res ? <span className="block text-[10px] leading-tight text-[var(--muted)]">{cell!.res}</span> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 ? <p className="mt-4 text-sm text-[var(--muted)]">No vendor documents every metric picked. Remove a filter.</p> : null}
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        ✓ documented (links to the vendor page) · ✗ the vendor says it is not available · ? not stated in the pages read (links to
        our guide). Hover a mark for the vendor&rsquo;s words.
      </p>

      <div className="mt-10 space-y-6">
        {shown.map((v) => {
          const resolution = [
            ...COVERAGE_METRICS.flatMap((m) => {
              const c = v.cells[m.id];
              return c?.res ? [{ note: `${m.label}: ${c.res}`, src: c.src }] : [];
            }),
            ...(v.resolution ?? []),
          ];
          return (
            <article key={v.id} id={`vendor-${v.id}`} className="scroll-mt-20 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5" data-coverage-vendor={v.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[var(--fg)]">{v.name}</h3>
                <span className="text-xs text-[var(--muted)]">
                  {KIND_LABELS[v.kind]} · sources read {checked[v.id] ?? "—"} ·{" "}
                  <Link href={v.guide} className={linkCls}>
                    guide
                  </Link>
                </span>
              </div>
              <FactList title="Delivery" items={v.delivery.map((d) => ({ note: `${DELIVERY_LABELS[d.mode]}: ${d.note}`, src: d.src }))} empty="Not stated in the pages read." />
              <FactList title="History and backfill" items={v.history} empty="Not stated in the pages read." />
              <FactList title="Data resolution" items={resolution} empty="Not stated in the pages read." />
              <FactList
                title="Metrics"
                items={COVERAGE_METRICS.flatMap((m) => {
                  const { state: st, cell } = cellState(v, m.id);
                  return cell ? [{ note: `${m.label}${st === "no" ? " (not available)" : ""}: ${cell.note}`, src: cell.src }] : [];
                })}
                empty="None stated."
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}

function FactList({ title, items, empty }: { title: string; items: { note: string; src: { url: string; quote: string; table?: boolean } }[]; empty: string }) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-bold text-[var(--fg)]">{title}</h4>
      {items.length === 0 ? (
        <p className="mt-1 text-sm text-[var(--muted)]">{empty}</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-[var(--fg)]">
          {items.map((f, i) => (
            <li key={i}>
              {f.note} —{" "}
              <span className="font-mono text-[11.5px] text-[var(--muted)]">
                {f.src.table ? `Google's table: ${f.src.quote}` : `“${f.src.quote}”`}
              </span>{" "}
              (
              <a href={f.src.url} rel="noopener" className="text-xs font-medium text-brand-600 hover:text-brand-500">
                source
              </a>
              )
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
