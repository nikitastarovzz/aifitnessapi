"use client";

import { useState } from "react";

/**
 * A quotable statistic: the number, what it counts, and a copy button that
 * yields the sentence WITH its citation attached. The point is to make the
 * cited form the easiest thing to paste — a bare number travels without its
 * provenance; this hands over the provenance in the same motion.
 */
export default function StatCard({
  value,
  label,
  claim,
  anchor,
}: {
  /** The number, exactly as the dataset states it. */
  value: string;
  /** What it counts, one line. */
  label: string;
  /** The full quotable sentence (must match what the page itself asserts). */
  claim: string;
  /** Absolute URL (with fragment where one exists) backing the claim. */
  anchor: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`"${claim}" — AIFitnessAPI, ${anchor}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the visible text is still selectable */
    }
  }
  return (
    <figure
      data-stat-card
      className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <span className="text-3xl font-bold tracking-tight text-[var(--fg)]">{value}</span>
      <figcaption className="mt-1 text-sm text-[var(--muted)]">{label}</figcaption>
      <button
        type="button"
        onClick={copy}
        className="mt-3 self-start rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
      >
        {copied ? "Copied with citation ✓" : "Copy with citation"}
      </button>
    </figure>
  );
}
