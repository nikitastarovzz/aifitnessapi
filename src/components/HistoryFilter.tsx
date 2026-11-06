"use client";

import { useEffect, useState } from "react";

/**
 * The filters of /history. The timeline and its list are server HTML; this
 * only hides the marks and rows that do not match, by their data-vendor and
 * data-kind attributes, and keeps the choice in the address (?vendor=&kind=)
 * so a filtered view is a link. Without JavaScript every event shows.
 */
export default function HistoryFilter({
  rootId,
  vendors,
  kinds,
  total,
}: {
  rootId: string;
  vendors: { id: string; label: string; count: number }[];
  kinds: { id: string; label: string; count: number }[];
  total: number;
}) {
  const [vendor, setVendor] = useState<string>("");
  const [picked, setPicked] = useState<string[]>([]);
  const [shown, setShown] = useState(total);
  const [copied, setCopied] = useState(false);

  // Read the deep link once.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const v = q.get("vendor");
    if (v && vendors.some((x) => x.id === v)) setVendor(v);
    const k = (q.get("kind") ?? "").split(",").filter((x) => kinds.some((y) => y.id === x));
    if (k.length) setPicked(k);
  }, [vendors, kinds]);

  // Apply and write the address.
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    let n = 0;
    const seen = new Set<string>();
    root.querySelectorAll<HTMLElement | SVGElement>("[data-vendor][data-kind]").forEach((el) => {
      const ok = (!vendor || el.dataset.vendor === vendor) && (!picked.length || picked.includes(el.dataset.kind ?? ""));
      el.classList.toggle("fh-hidden", !ok);
      if (ok && el.dataset.id && !seen.has(el.dataset.id)) {
        seen.add(el.dataset.id);
        n++;
      }
    });
    // A year with nothing left to show folds away, in the drawing and the list.
    root.querySelectorAll<HTMLElement | SVGElement>("[data-year]").forEach((row) => {
      const any = row.querySelector("[data-vendor]:not(.fh-hidden)");
      row.classList.toggle("fh-dim", !any);
    });
    setShown(n);
    const q = new URLSearchParams(window.location.search);
    if (vendor) q.set("vendor", vendor);
    else q.delete("vendor");
    if (picked.length) q.set("kind", picked.join(","));
    else q.delete("kind");
    const s = q.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${s ? `?${s}` : ""}${window.location.hash}`);
  }, [rootId, vendor, picked]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-3 rounded-xl border border-[var(--border)] p-4 text-sm">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Vendor</span>
        <select
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[var(--fg)]"
        >
          <option value="">All vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} ({v.count})
            </option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Kind</legend>
        {kinds.map((k) => (
          <label key={k.id} className="flex items-center gap-1.5 text-[var(--fg)]">
            <input type="checkbox" checked={picked.includes(k.id)} onChange={() => toggle(k.id)} />
            {k.label} ({k.count})
          </label>
        ))}
      </fieldset>
      <div className="flex items-center gap-3">
        <span aria-live="polite" className="text-[var(--muted)]">
          Showing {shown} of {total}
        </span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href).then(
              () => setCopied(true),
              () => setCopied(false),
            );
          }}
          className="rounded-lg border border-[var(--border)] px-2.5 py-1 font-medium text-[var(--fg)] hover:border-brand-400"
        >
          {copied ? "Link copied" : "Copy link to this view"}
        </button>
      </div>
    </div>
  );
}
