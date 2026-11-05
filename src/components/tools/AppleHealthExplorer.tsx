"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * The Apple Health export explorer.
 *
 * The reader picks export.zip or export.xml from their own disk. The File
 * handle goes to a Web Worker (src/lib/appleHealthExplorer.worker.mjs), which
 * streams it through src/lib/appleHealthExport.mjs and posts back a summary;
 * a CSV for one type is a second streaming pass over the same local file.
 * Nothing is uploaded: there is no server code behind this page, and the only
 * network request it can make is fetching the site's own synthetic sample
 * when the reader asks for it.
 *
 * If the browser cannot start a module worker, the same modules run on the
 * main thread instead (slower, and the page may stutter on a large file).
 */

export type HkLookup = Record<string, { name: string; abstract: string; href: string | null; aggregation: "cumulative" | "discrete" | null }>;

type DayRow = [day: string, sum: number, n: number, min: number | null, max: number | null, minutes: number];
type TypeSummary = {
  type: string;
  kind: "record" | "workout";
  count: number;
  first: string | null;
  last: string | null;
  units: { unit: string; count: number }[];
  sources: { name: string; count: number }[];
  numeric: number;
  days: Record<string, DayRow[]>;
};
type Summary = {
  exportDate: string | null;
  records: number;
  workouts: number;
  activitySummaries: number;
  activitySummaryRange: [string, string] | null;
  types: TypeSummary[];
  sources: { name: string; records: number; types: number }[];
  devices: { name: string | null; model: string | null; hardware: string | null; manufacturer: string | null; records: number }[];
  elements: number;
  leftover: number;
  entryName: string;
};

type Metric = "sum" | "mean" | "count" | "minutes" | "max";
const METRIC_LABEL: Record<Metric, string> = {
  sum: "Daily total",
  mean: "Daily mean",
  max: "Daily maximum",
  count: "Samples per day",
  minutes: "Minutes per day",
};

const SAMPLE_URL = "/samples/apple-health-export-synthetic.zip";

type Msg = { cmd: "scan" | "csv"; file: File; type?: string; kind?: string };
type Job = { msg: Msg; resolve: (v: Record<string, unknown>) => void; reject: (e: Error) => void; onProgress: (f: number) => void };

/** The same work on the main thread: the fallback when no worker runs. */
async function runOnMainThread(msg: Msg, onProgress: (f: number) => void): Promise<Record<string, unknown>> {
  const [{ createAggregator, createCsvCollector }, { scanExport }] = await Promise.all([
    import("@/lib/appleHealthExport.mjs"),
    import("@/lib/appleHealthRead.mjs"),
  ]);
  if (msg.cmd === "scan") {
    const agg = createAggregator();
    const stats = await scanExport(msg.file, [agg], onProgress);
    return { summary: { ...agg.result(), ...stats } };
  }
  const col = createCsvCollector(msg.type ?? "", msg.kind ?? "record");
  await scanExport(msg.file, [col], onProgress);
  const { rows, chunks } = col.result();
  return { rows, blob: new Blob(chunks, { type: "text/csv" }) };
}

function useExportWorker() {
  const workerRef = useRef<Worker | null>(null);
  const jobs = useRef(new Map<number, Job>());
  const nextId = useRef(1);
  const [mode, setMode] = useState<"worker" | "main">("worker");

  useEffect(() => {
    let w: Worker | null = null;
    const pending = jobs.current;
    const fallBack = () => {
      // The worker failed to load or crashed: finish its jobs here instead.
      workerRef.current = null;
      setMode("main");
      for (const [id, job] of pending) {
        pending.delete(id);
        runOnMainThread(job.msg, job.onProgress).then(job.resolve, job.reject);
      }
    };
    try {
      w = new Worker(new URL("../../lib/appleHealthExplorer.worker.mjs", import.meta.url), { type: "module" });
      w.onmessage = (ev: MessageEvent) => {
        const d = ev.data as { id: number; progress?: number; ok?: boolean; error?: string } & Record<string, unknown>;
        const job = pending.get(d.id);
        if (!job) return;
        if (typeof d.progress === "number") return job.onProgress(d.progress);
        pending.delete(d.id);
        if (d.ok) job.resolve(d);
        else job.reject(new Error(d.error ?? "The file could not be read."));
      };
      w.onerror = (ev) => {
        ev.preventDefault();
        fallBack();
      };
      workerRef.current = w;
    } catch {
      fallBack();
    }
    return () => {
      w?.terminate();
      pending.clear();
    };
  }, []);

  const run = useCallback((msg: Msg, onProgress: (f: number) => void): Promise<Record<string, unknown>> => {
    const w = workerRef.current;
    if (!w) return runOnMainThread(msg, onProgress);
    const id = nextId.current++;
    return new Promise((resolve, reject) => {
      jobs.current.set(id, { msg, resolve, reject, onProgress });
      w.postMessage({ ...msg, id });
    });
  }, []);

  return { run, mode };
}

const fmt = (n: number) => n.toLocaleString("en-US");

function shortType(t: string): string {
  return t
    .replace(/^HKQuantityTypeIdentifier/, "")
    .replace(/^HKCategoryTypeIdentifier/, "")
    .replace(/^HKWorkoutActivityType/, "")
    .replace(/^HKDataType/, "");
}

function defaultMetric(t: TypeSummary, lookup: HkLookup): Metric {
  if (t.kind === "workout") return "minutes";
  if (t.numeric === 0) return t.days[""]?.some((d) => d[5] > 0) ? "minutes" : "count";
  const agg = lookup[t.type]?.aggregation;
  if (agg === "cumulative") return "sum";
  if (agg === "discrete") return "mean";
  return "count";
}

function metricValue(d: DayRow, m: Metric): number | null {
  switch (m) {
    case "sum":
      return d[1];
    case "mean":
      return d[2] ? d[1] / d[2] : null;
    case "max":
      return d[4];
    case "count":
      return d[2];
    case "minutes":
      return d[5];
  }
}

function DailyChart({ rows, metric, unit }: { rows: DayRow[]; metric: Metric; unit: string }) {
  const points = rows
    .map((r) => ({ day: r[0], v: metricValue(r, metric) }))
    .filter((p): p is { day: string; v: number } => p.v !== null && Number.isFinite(p.v));
  if (points.length === 0) return <p className="mt-4 text-sm text-[var(--muted)]">No numeric values to chart for this choice.</p>;
  const W = 720;
  const H = 220;
  const padL = 56;
  const padB = 28;
  const padT = 10;
  const padR = 10;
  const first = Date.parse(points[0].day);
  const last = Date.parse(points[points.length - 1].day);
  const span = Math.max(1, last - first);
  const max = Math.max(...points.map((p) => p.v));
  const min = Math.min(0, ...points.map((p) => p.v));
  const range = max - min || 1;
  const x = (day: string) => padL + ((Date.parse(day) - first) / span) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / range) * (H - padT - padB);
  const dayCount = Math.round(span / 86400000) + 1;
  const barW = Math.max(1, Math.min(14, ((W - padL - padR) / dayCount) * 0.7));
  const label = (v: number) => (Math.abs(v) >= 1000 ? fmt(Math.round(v)) : String(Math.round(v * 100) / 100));
  const unitLabel = metric === "count" ? "samples" : metric === "minutes" ? "min" : unit || "value";
  return (
    <figure className="mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${METRIC_LABEL[metric]} by day, ${points.length} days`}>
        <line x1={padL} x2={W - padR} y1={y(min)} y2={y(min)} stroke="var(--border)" />
        <line x1={padL} x2={W - padR} y1={y(max)} y2={y(max)} stroke="var(--border)" strokeDasharray="3 4" />
        <text x={padL - 6} y={y(max) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
          {label(max)}
        </text>
        <text x={padL - 6} y={y(min) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
          {label(min)}
        </text>
        {points.map((p) => (
          <rect key={p.day} x={x(p.day) - barW / 2} y={y(p.v)} width={barW} height={Math.max(0.5, y(min) - y(p.v))} className="fill-brand-600" rx={barW > 4 ? 1.5 : 0}>
            <title>{`${p.day}: ${label(p.v)} ${unitLabel}`}</title>
          </rect>
        ))}
        <text x={padL} y={H - 8} fontSize="11" fill="var(--muted)">
          {points[0].day}
        </text>
        <text x={W - padR} y={H - 8} textAnchor="end" fontSize="11" fill="var(--muted)">
          {points[points.length - 1].day}
        </text>
      </svg>
      <figcaption className="mt-1 text-xs text-[var(--muted)]">
        {METRIC_LABEL[metric]} in {unitLabel}, one bar per calendar day as written on each record&rsquo;s start date
        ({points.length} days with data). Hover a bar for its value.
      </figcaption>
    </figure>
  );
}

export default function AppleHealthExplorer({ lookup }: { lookup: HkLookup }) {
  const { run, mode } = useExportWorker();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>("");
  const [metric, setMetric] = useState<Metric>("count");
  const [filter, setFilter] = useState("");
  const [csvBusy, setCsvBusy] = useState<string | null>(null);
  const started = useRef(0);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const scan = useCallback(
    async (f: File, sample: boolean) => {
      setFile(f);
      setIsSample(sample);
      setStatus("reading");
      setProgress(0);
      setError(null);
      setSummary(null);
      setSelected(null);
      started.current = performance.now();
      try {
        const res = await run({ cmd: "scan", file: f }, setProgress);
        const s = res.summary as Summary;
        setSummary(s);
        setElapsed((performance.now() - started.current) / 1000);
        setStatus("done");
        const firstChartable = s.types.find((t) => t.kind === "record" && t.numeric > 0) ?? s.types[0];
        if (firstChartable) choose(firstChartable);
      } catch (e) {
        setError((e as Error).message);
        setStatus("error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run],
  );

  const choose = (t: TypeSummary) => {
    setSelected(t.type);
    const units = Object.keys(t.days);
    const best = t.units.find((u) => units.includes(u.unit))?.unit ?? units[0] ?? "";
    setUnit(best);
    setMetric(defaultMetric(t, lookup));
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) scan(f, false);
  };

  const loadSample = async () => {
    setStatus("reading");
    setError(null);
    try {
      const r = await fetch(SAMPLE_URL);
      if (!r.ok) throw new Error(`The sample could not be loaded (HTTP ${r.status}).`);
      const blob = await r.blob();
      scan(new File([blob], "apple-health-export-synthetic.zip", { type: "application/zip" }), true);
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const downloadCsv = async (t: TypeSummary) => {
    if (!file) return;
    setCsvBusy(t.type);
    try {
      const res = await run({ cmd: "csv", file, type: t.type, kind: t.kind }, () => {});
      const url = URL.createObjectURL(res.blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${shortType(t.type) || "records"}${isSample ? "-synthetic" : ""}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCsvBusy(null);
    }
  };

  const types = useMemo(() => {
    if (!summary) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return summary.types;
    return summary.types.filter((t) => t.type.toLowerCase().includes(q) || (lookup[t.type]?.name ?? "").toLowerCase().includes(q));
  }, [summary, filter, lookup]);

  const current = summary?.types.find((t) => t.type === selected) ?? null;
  const range = useMemo(() => {
    if (!summary) return null;
    const firsts = summary.types.map((t) => t.first).filter(Boolean) as string[];
    const lasts = summary.types.map((t) => t.last).filter(Boolean) as string[];
    if (!firsts.length) return null;
    return [firsts.reduce((a, b) => (a < b ? a : b)).slice(0, 10), lasts.reduce((a, b) => (a > b ? a : b)).slice(0, 10)];
  }, [summary]);

  const metrics: Metric[] = current
    ? current.kind === "workout"
      ? ["minutes", "count"]
      : current.numeric > 0
        ? ["sum", "mean", "max", "count"]
        : ["count", "minutes"]
    : [];

  return (
    <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6" data-explorer-status={status}>
      <p className="text-sm text-[var(--muted)]">
        Pick the <strong className="text-[var(--fg)]">export.zip</strong> the Health app made, or the{" "}
        <strong className="text-[var(--fg)]">export.xml</strong> inside it. The file is read on this computer and is
        never uploaded.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">
          Choose export file
          <input type="file" accept=".zip,.xml,application/zip,text/xml,application/xml" className="sr-only" onChange={onPick} data-explorer-input />
        </label>
        <button
          type="button"
          onClick={loadSample}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:border-brand-400"
          data-explorer-sample
        >
          Try the synthetic sample
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-3 text-sm text-[var(--muted)]" data-explorer-progress>
        {status === "reading" && `Reading${file ? ` ${file.name}` : ""}… ${Math.round(progress * 100)}%`}
        {status === "done" && summary && `Read ${fmt(summary.elements)} elements from ${summary.entryName}${elapsed !== null ? ` in ${elapsed.toFixed(1)} s` : ""}${mode === "main" ? " (on the main thread: this browser could not start a worker)" : ""}.`}
        {status === "error" && <span className="text-red-700 dark:text-red-400">{error}</span>}
      </p>
      {status === "reading" && (
        <div className="mt-2 h-2 w-full overflow-hidden rounded bg-[var(--border)]">
          <div className="h-full bg-brand-600 transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}

      {summary && (
        <div className="mt-6" data-explorer-summary>
          {isSample && (
            <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-medium text-amber-800 dark:text-amber-300" data-explorer-synthetic>
              Synthetic sample: generated data from a fixed seed, not anyone&rsquo;s health record.
            </p>
          )}
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              ["Records", fmt(summary.records)],
              ["Workouts", fmt(summary.workouts)],
              ["Types", fmt(summary.types.length)],
              ["Sources", fmt(summary.sources.length)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-[var(--border)] p-3">
                <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">{k}</dt>
                <dd className="font-mono text-xl font-bold text-[var(--fg)]">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-[var(--muted)]">
            {range && `Samples from ${range[0]} to ${range[1]}. `}
            {summary.exportDate && `Export date in the file: ${summary.exportDate}. `}
            {summary.activitySummaries > 0 &&
              `${fmt(summary.activitySummaries)} daily activity summaries${summary.activitySummaryRange ? ` (${summary.activitySummaryRange[0]} to ${summary.activitySummaryRange[1]})` : ""}. `}
            {summary.leftover > 0 && "The file ended partway through a tag; everything before it was read."}
          </p>

          {current && (
            <section className="mt-8">
              <h3 className="text-lg font-semibold text-[var(--fg)]">
                {lookup[current.type]?.name ?? shortType(current.type)}{" "}
                <span className="font-mono text-xs font-normal text-[var(--muted)]">{current.type}</span>
              </h3>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <label className="flex items-center gap-2 text-[var(--muted)]">
                  Show
                  <select value={metric} onChange={(e) => setMetric(e.target.value as Metric)} className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[var(--fg)]">
                    {metrics.map((m) => (
                      <option key={m} value={m}>
                        {METRIC_LABEL[m]}
                      </option>
                    ))}
                  </select>
                </label>
                {Object.keys(current.days).length > 1 && (
                  <label className="flex items-center gap-2 text-[var(--muted)]">
                    Unit
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[var(--fg)]">
                      {Object.keys(current.days).map((u) => (
                        <option key={u} value={u}>
                          {u || "(none)"}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <DailyChart rows={current.days[unit] ?? []} metric={metric} unit={unit} />
              {lookup[current.type]?.aggregation && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Apple describes this type as {lookup[current.type]!.aggregation}, so the default view is the daily{" "}
                  {lookup[current.type]!.aggregation === "cumulative" ? "total" : "mean"}.
                  {lookup[current.type]!.aggregation === "cumulative" &&
                    " A daily total adds every source, so if a phone and a watch both counted the same walk, both counts are in it."}
                </p>
              )}
            </section>
          )}

          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-lg font-semibold text-[var(--fg)]">Record types</h3>
              <input
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter types"
                className="w-48 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm text-[var(--fg)]"
                aria-label="Filter record types"
              />
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm" data-explorer-types>
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                    <th className="py-2 pr-3 font-medium">Type</th>
                    <th className="py-2 pr-3 text-right font-medium">Count</th>
                    <th className="py-2 pr-3 font-medium">First</th>
                    <th className="py-2 pr-3 font-medium">Last</th>
                    <th className="py-2 pr-3 font-medium">Units</th>
                    <th className="py-2 pr-3 font-medium">Top source</th>
                    <th className="py-2 font-medium">Export</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t) => {
                    const info = lookup[t.type];
                    return (
                      <tr key={t.type} className={`border-b border-[var(--border)] align-top ${t.type === selected ? "bg-brand-500/5" : ""}`}>
                        <td className="py-2 pr-3">
                          <button type="button" onClick={() => choose(t)} className="text-left font-medium text-brand-600 hover:text-brand-500">
                            {info?.name ?? shortType(t.type)}
                          </button>
                          {t.kind === "workout" && <span className="ml-1 text-xs text-[var(--muted)]">workout</span>}
                          <div className="font-mono text-[11px] text-[var(--muted)] [overflow-wrap:anywhere]">
                            {info?.href ? (
                              <a href={info.href} className="hover:text-brand-500" title={info.abstract}>
                                {t.type}
                              </a>
                            ) : (
                              t.type
                            )}
                          </div>
                        </td>
                        <td className="py-2 pr-3 text-right font-mono">{fmt(t.count)}</td>
                        <td className="py-2 pr-3 font-mono text-xs">{t.first?.slice(0, 10) ?? "–"}</td>
                        <td className="py-2 pr-3 font-mono text-xs">{t.last?.slice(0, 10) ?? "–"}</td>
                        <td className="py-2 pr-3 font-mono text-xs">{t.units.map((u) => u.unit || "–").join(", ")}</td>
                        <td className="py-2 pr-3 text-xs">
                          {t.sources[0]?.name}
                          {t.sources.length > 1 ? ` +${t.sources.length - 1}` : ""}
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => downloadCsv(t)}
                            disabled={csvBusy !== null}
                            className="rounded border border-[var(--border)] px-2 py-0.5 text-xs font-semibold text-[var(--fg)] hover:border-brand-400 disabled:opacity-50"
                          >
                            {csvBusy === t.type ? "…" : "CSV"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <section>
              <h3 className="text-lg font-semibold text-[var(--fg)]">Sources</h3>
              <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                {summary.sources.map((s) => (
                  <li key={s.name}>
                    <span className="text-[var(--fg)]">{s.name}</span>: {fmt(s.records)} rows across {s.types} type{s.types === 1 ? "" : "s"}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-lg font-semibold text-[var(--fg)]">Devices</h3>
              {summary.devices.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--muted)]">No device attributes in this file.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {summary.devices.map((d) => (
                    <li key={`${d.name}|${d.model}|${d.hardware}|${d.manufacturer}`}>
                      <span className="text-[var(--fg)]">{d.name ?? "(unnamed)"}</span>
                      {d.hardware ? ` (${d.hardware})` : d.model ? ` (${d.model})` : ""}: {fmt(d.records)} rows
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
