"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FgRow, FgStatus } from "@/lib/fitbitGoogleMap";

/**
 * The searchable half of /tools/fitbit-to-google-health. Rows are built at
 * build time (src/lib/fitbitGoogleMap.ts) and filtered here; nothing is
 * fetched.
 */

const STATUS: Record<FgStatus, { label: string; cls: string }> = {
  mapped: { label: "Mapped", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  partial: { label: "Data only", cls: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  "name-match": { label: "Name match", cls: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  unmapped: { label: "Not in Google's tables", cls: "bg-amber-500/15 text-amber-800 dark:text-amber-300" },
};
const code = "font-mono text-[0.85em]";
const linkCls = "font-medium text-brand-600 hover:text-brand-500";

function Method({ m }: { m: { label: string; httpMethod: string | null; path: string | null } }) {
  return (
    <li>
      <code className={code}>{m.label}</code>
      {m.httpMethod && m.path && (
        <span className="block break-all text-xs text-[var(--muted)]">
          {m.httpMethod} {m.path}
        </span>
      )}
    </li>
  );
}

export default function FitbitGoogleMap({ rows, categories }: { rows: FgRow[]; categories: { slug: string; title: string }[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState<"all" | FgStatus>("all");
  const shown = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (status !== "all" && r.status !== status) return false;
      if (!terms.length) return true;
      const hay = [r.title, r.description, r.categoryTitle, r.scope ?? "", ...r.paths, ...r.dataTypes.flatMap((d) => [d.fitbitName, d.googleName, d.googleDataType]), ...r.googleScopes]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [rows, q, cat, status]);

  return (
    <div className="mt-8">
      <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="text-sm font-medium text-[var(--fg)]">
          Search endpoints, paths, data types
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="heart rate, /1.2/user, spo2, sleep…"
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
            name="q"
          />
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Section
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]">
            <option value="all">All sections</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-[var(--fg)]">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as "all" | FgStatus)} className="mt-1.5 block w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]">
            <option value="all">Any status</option>
            {(Object.keys(STATUS) as FgStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS[s].label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">
        {shown.length} of {rows.length} endpoints
      </p>

      <ul className="mt-4 space-y-4">
        {shown.map((r) => (
          <li key={r.id} id={r.id.replace("/", "--")} className="scroll-mt-24 rounded-2xl border border-[var(--border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[var(--fg)]">
                  <a href={r.url} className="hover:text-brand-600" rel="noopener">
                    {r.title}
                  </a>
                </h3>
                <p className="text-xs text-[var(--muted)]">{r.categoryTitle}</p>
                {r.notice && <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">Fitbit: “{r.notice}”</p>}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[r.status].cls}`}>{STATUS[r.status].label}</span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0 text-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Fitbit Web API</div>
                {r.paths.map((p) => (
                  <code key={p} className={`${code} mt-1 block break-all text-[var(--fg)]`}>
                    {r.method ? `${r.method} ` : ""}
                    {p}
                  </code>
                ))}
                {r.scope && <p className="mt-1 text-xs text-[var(--muted)]">Scope: {r.scope}</p>}
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{r.description}</p>
              </div>
              <div className="min-w-0 text-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Google Health API</div>
                {r.dataTypes.length > 0 && (
                  <ul className="mt-1 space-y-2">
                    {r.dataTypes.map((d) => (
                      <li key={d.googleDataType}>
                        {d.href ? (
                          <Link href={d.href} className={linkCls}>
                            {d.googleName}
                          </Link>
                        ) : (
                          <span className="font-medium text-[var(--fg)]">{d.googleName}</span>
                        )}{" "}
                        <code className={`${code} text-[var(--muted)]`}>{d.googleDataType}</code>
                        <span className="block text-xs text-[var(--muted)]">
                          Google&rsquo;s row: &ldquo;{d.fitbitName}&rdquo;. On Fitbit&rsquo;s page: <code className={code}>{d.term}</code>
                        </span>
                        {d.googleNote && <span className="block text-xs text-[var(--muted)]">{d.googleNote}</span>}
                        {!d.inDataTypesTable && (
                          <span className="mt-1 block text-xs text-amber-800 dark:text-amber-300">
                            Google&rsquo;s migration table names {d.googleDataType}, but Google&rsquo;s data-types table does not list it, so its methods and scopes are unknown here.
                          </span>
                        )}
                        {d.methods.length > 0 && <ul className="mt-1 space-y-1">{d.methods.map((m) => <Method key={m.label} m={m} />)}</ul>}
                        {d.missing.length > 0 && (
                          <span className="mt-1 block text-xs text-amber-800 dark:text-amber-300">
                            Google&rsquo;s endpoint table names {d.missing.join(", ")}, which Google&rsquo;s data-types table does not list for {d.googleDataType}.
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {r.methods.length > 0 && <ul className="mt-1 space-y-1">{r.methods.map((m) => <Method key={m.label} m={m} />)}</ul>}
                {r.nameMatch && (
                  <ul className="mt-1 space-y-1">
                    <Method m={r.nameMatch} />
                  </ul>
                )}
                {r.kind && (
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    Endpoint type: &ldquo;{r.kind.fitbit}&rdquo; → {r.kind.google.replace(/`/g, "")}
                  </p>
                )}
                {r.googleScopes.length > 0 && (
                  <p className="mt-1 break-words text-xs text-[var(--muted)]">
                    Scopes: {r.googleScopes.map((s) => <code key={s} className={`${code} mr-1 break-all`}>{s}</code>)}
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-[var(--fg)]">{r.why}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
