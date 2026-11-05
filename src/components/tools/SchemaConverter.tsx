"use client";

import { useEffect, useMemo, useState } from "react";
import { convert, detectFormat, FORMATS } from "@/lib/unifiedConvert.mjs";
import { validate } from "@/lib/miniJsonSchema.mjs";

/**
 * The interactive half of /tools/schema-converter.
 *
 * Everything runs in this tab. The mappings and the JSON Schema are the two
 * static files the schema page publishes (/schema/v1/mappings.json and
 * /schema/v1/unified-health-data.schema.json), fetched once; the converter
 * is src/lib/unifiedConvert.mjs and the validator src/lib/miniJsonSchema.mjs,
 * the same files scripts/unified-convert.test.mjs runs. What you paste is
 * never sent anywhere.
 */

type Sample = { id: string; label: string; format: string; text: string };
type Spec = Parameters<typeof convert>[1];
type Out = ReturnType<typeof convert>;
type Step = { field: string; value: unknown; from: string | null; raw: unknown; rule: string | null; evidence: { quote: string; url: string } | null };

const field =
  "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[13px] text-[var(--fg)] placeholder:font-sans placeholder:text-[var(--muted)]";
const code = "font-mono text-[0.85em]";

const show = (v: unknown) => (v === null || v === undefined ? "null" : typeof v === "string" ? v : JSON.stringify(v));

export default function SchemaConverter({ samples, mappingsUrl, schemaUrl }: { samples: Sample[]; mappingsUrl: string; schemaUrl: string }) {
  const [spec, setSpec] = useState<Spec | null>(null);
  const [schema, setSchema] = useState<Record<string, unknown> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [text, setText] = useState(samples[0]?.text ?? "");
  const [format, setFormat] = useState<string>("auto");
  const [out, setOut] = useState<Out | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([fetch(mappingsUrl).then((r) => r.json()), fetch(schemaUrl).then((r) => r.json())])
      .then(([m, s]) => {
        if (!live) return;
        setSpec(m as Spec);
        setSchema(s);
      })
      .catch((e) => live && setLoadError(String(e)));
    return () => {
      live = false;
    };
  }, [mappingsUrl, schemaUrl]);

  // Convert the first sample as soon as the mappings arrive, so the page shows a result.
  useEffect(() => {
    if (spec && !out) setOut(convert(text, spec));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec]);

  const detected = useMemo(() => (spec ? detectFormat(text, spec) : null), [text, spec]);
  const run = () => spec && setOut(convert(text, spec, format === "auto" ? {} : { format }));
  const errorCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of out?.errors ?? []) {
      const k = e.replace(/\[\d+\]/g, "[n]");
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m];
  }, [out]);

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-[var(--fg)]">Synthetic samples:</span>
          {samples.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setText(s.text);
                setFormat("auto");
                if (spec) setOut(convert(s.text, spec));
              }}
              className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-[var(--fg)] hover:border-brand-500"
              data-cta={`converter-sample-${s.id}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium text-[var(--fg)]">
          Payload
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={14} spellCheck={false} name="payload" className={field} placeholder='<Record type="HKQuantityTypeIdentifierHeartRate" … />  or  { "dataPoints": [ … ] }' />
        </label>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium text-[var(--fg)]">
            Format
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-1.5 block rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]">
              <option value="auto">Detect{detected ? ` (${FORMATS[detected as keyof typeof FORMATS]})` : ""}</option>
              {Object.entries(FORMATS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={run} disabled={!spec} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50" data-cta="converter-run">
            {spec ? "Convert" : "Loading mappings…"}
          </button>
        </div>
        {loadError && <p className="mt-3 text-sm text-red-600">Could not load the mappings: {loadError}</p>}
        <p className="mt-3 text-xs text-[var(--muted)]">Runs in this tab. Nothing you paste leaves your browser.</p>
      </div>

      {out && (
        <div aria-live="polite" className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            {out.format ? `Read as ${FORMATS[out.format as keyof typeof FORMATS]}. ` : ""}
            {out.results.length} unified record{out.results.length === 1 ? "" : "s"}
            {out.errors.length ? `, ${out.errors.length} item${out.errors.length === 1 ? "" : "s"} not converted` : ""}.
          </p>
          {errorCounts.length > 0 && (
            <ul className="space-y-1 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-[var(--fg)]">
              {errorCounts.map(([e, n]) => (
                <li key={e}>
                  {e}
                  {n > 1 ? ` (×${n})` : ""}
                </li>
              ))}
            </ul>
          )}
          {out.results.slice(0, 25).map((r, i) => {
            const errs = schema ? validate(schema, r.record) : [];
            return (
              <article key={i} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-[var(--fg)]">
                    {r.title} <code className={`${code} text-[var(--muted)]`}>{r.recordId}</code>
                  </h3>
                  {schema && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${errs.length ? "bg-red-500/15 text-red-700 dark:text-red-400" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"}`}>
                      {errs.length ? `${errs.length} schema error${errs.length === 1 ? "" : "s"}` : "Valid against v1"}
                    </span>
                  )}
                </div>
                <pre className="mt-3 overflow-x-auto rounded-xl bg-[var(--surface)] p-3 text-xs text-[var(--fg)]">{JSON.stringify(r.record, null, 2)}</pre>
                {errs.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-red-700 dark:text-red-400">
                    {errs.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                )}
                {r.warnings.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-amber-800 dark:text-amber-300">
                    {(r.warnings as string[]).map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                )}
                <details className="mt-3" open={i === 0}>
                  <summary className="cursor-pointer text-sm font-medium text-[var(--fg)]">Field by field</summary>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full min-w-[40rem] border-collapse text-left text-xs">
                      <thead className="text-[var(--muted)]">
                        <tr>
                          <th scope="col" className="p-2">Unified field</th>
                          <th scope="col" className="p-2">From</th>
                          <th scope="col" className="p-2">Raw</th>
                          <th scope="col" className="p-2">Value</th>
                          <th scope="col" className="p-2">Rule and source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(r.steps as Step[]).map((s) => (
                          <tr key={s.field} className="border-t border-[var(--border)] align-top">
                            <td className="p-2">
                              <code className={code}>{s.field}</code>
                            </td>
                            <td className="p-2 text-[var(--muted)]">{s.from ? <code className={`${code} break-all`}>{s.from}</code> : "—"}</td>
                            <td className="max-w-[12rem] break-all p-2 font-mono">{show(s.raw)}</td>
                            <td className="max-w-[12rem] break-all p-2 font-mono text-[var(--fg)]">{show(s.value)}</td>
                            <td className="p-2 text-[var(--muted)]">
                              {s.rule ?? "unchanged"}
                              {s.evidence && (
                                <div className="mt-1">
                                  <q>{s.evidence.quote}</q>{" "}
                                  <a href={s.evidence.url} className="font-medium text-brand-600 hover:text-brand-500" rel="noopener">
                                    source
                                  </a>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </article>
            );
          })}
          {out.results.length > 25 && <p className="text-sm text-[var(--muted)]">Showing the first 25 of {out.results.length} records.</p>}
          {out.results.length > 0 && (
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-500"
              onClick={() => navigator.clipboard?.writeText(JSON.stringify(out.results.map((r) => r.record), null, 2))}
              data-cta="converter-copy"
            >
              Copy all records as JSON
            </button>
          )}
        </div>
      )}
    </div>
  );
}
