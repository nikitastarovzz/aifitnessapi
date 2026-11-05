"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Small pieces the three planning tools share: a toggle chip, a labeled
 * select, a download, a copy-link button, and the URL-state hook that reads
 * the query string once after hydration and writes it back on every change.
 * The server renders each tool with its default answers, so the first paint
 * and the static HTML agree; a shared link then replaces them in the browser.
 */

export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3 py-1.5 text-left text-sm transition-colors ${
        on
          ? "border-brand-400 bg-brand-500/10 font-medium text-[var(--fg)]"
          : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}

export function Field({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="text-sm font-semibold text-[var(--fg)]">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <label className="mt-5 block text-sm">
      <span className="font-semibold text-[var(--fg)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)]"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

export function toggle(list: string[], v: string, order: string[]): string[] {
  const s = new Set(list);
  if (s.has(v)) s.delete(v);
  else s.add(v);
  return order.filter((x) => s.has(x));
}

export function downloadText(name: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const btn =
  "rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--bg)]";
export const btnPrimary = "rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-500";

export function CopyLink({ path }: { path: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  return (
    <button
      type="button"
      className={btn}
      onClick={() => {
        const url = `${window.location.origin}${path}`;
        if (!navigator.clipboard?.writeText) return setState("failed");
        navigator.clipboard.writeText(url).then(
          () => setState("done"),
          () => setState("failed"),
        );
      }}
    >
      {state === "done" ? "Link copied" : state === "failed" ? "Copy from the address bar" : "Copy share link"}
    </button>
  );
}

/**
 * Answers kept in the query string. `decode` runs once after mount (the
 * server rendered `initial`); every later change is written back with
 * replaceState, so a copied address reproduces the result.
 */
export function useUrlState<T>(initial: T, decode: (search: string) => T, encode: (v: T) => string): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  const ready = useRef(false);
  // The writer is declared first so its run in the first commit (ready still
  // false) cannot overwrite a shared query before the reader below sees it.
  useEffect(() => {
    if (!ready.current) return;
    const q = encode(value);
    const next = `${window.location.pathname}${q}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, "", next);
    }
  }, [value, encode]);
  useEffect(() => {
    if (window.location.search) setValue(decode(window.location.search));
    ready.current = true;
    // decode is stable for the page's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [value, setValue];
}
