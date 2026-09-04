"use client";

import { useRef, useState } from "react";

/**
 * "Copy as Markdown" for any rendered table: serializes the nearest <table>
 * inside the same wrapper to GFM at click time, from the DOM the reader is
 * looking at. Reading the rendered table rather than re-deriving from data
 * means the copy can never disagree with the page — filters, sort order and
 * all.
 */
export default function CopyTableMarkdown({ label = "Copy table as Markdown" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  function serialize(table: HTMLTableElement): string {
    const rows = [...table.querySelectorAll("tr")].map((tr) =>
      [...tr.querySelectorAll("th,td")].map((c) =>
        (c.textContent ?? "").replace(/\s+/g, " ").trim().replace(/\|/g, "\\|"),
      ),
    );
    if (rows.length === 0) return "";
    const width = Math.max(...rows.map((r) => r.length));
    const pad = (r: string[]) => [...r, ...Array(width - r.length).fill("")];
    const line = (r: string[]) => `| ${pad(r).join(" | ")} |`;
    const out = [line(rows[0]), `|${Array(width).fill(" --- ").join("|")}|`, ...rows.slice(1).map(line)];
    out.push("", `Source: ${window.location.href.split("#")[0]}`);
    return out.join("\n");
  }

  async function copy() {
    // The button lives beside the table inside a shared wrapper; walk up
    // until a container that holds a table, then take its first one.
    let node: HTMLElement | null = ref.current;
    let table: HTMLTableElement | null = null;
    while (node && !table) {
      table = node.querySelector("table");
      node = node.parentElement;
    }
    if (!table) return setState("fail");
    try {
      await navigator.clipboard.writeText(serialize(table));
      setState("done");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <div ref={ref} className="inline-block">
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
      >
        {state === "done" ? "Copied ✓" : state === "fail" ? "Copy failed — select manually" : label}
      </button>
    </div>
  );
}
