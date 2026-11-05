"use client";

import { useRef, useState } from "react";

const DEFAULT =
  "rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--fg)] transition-colors hover:border-brand-400";
const OVERLAY =
  "absolute right-2 top-2 z-10 rounded-md border border-[var(--border)] bg-[var(--bg)]/90 px-2 py-1 text-xs font-medium text-[var(--muted)] opacity-0 transition hover:border-brand-400 hover:text-[var(--fg)] focus-visible:opacity-100 group-hover:opacity-100";

/**
 * A copy-to-clipboard button for text the server already rendered beside it:
 * it copies the textContent of the <pre> inside its nearest
 * [data-copy-scope] (CiteBox, CodeBlock). Reading the text back out of the
 * page, rather than taking it as a prop, means it is not shipped a second
 * time in the page's RSC payload beside the copy already in the <pre>
 * (ops/MORE-30-2026-11-05.md item 24). The text stays selectable by hand
 * when the clipboard API is unavailable; the button is the convenience,
 * never the only way to get the text.
 */
export default function CopyButton({
  label,
  copied = "Copied",
  failed = "Copy failed — select the text",
  className,
  variant,
  resetMs = 2000,
}: {
  label: string;
  copied?: string;
  /** Shown when the clipboard refuses. Pass `label` to fall back silently. */
  failed?: string;
  className?: string;
  /** "overlay": the corner button over a code block (CodeBlock). Named
   *  rather than passed as a className so the long class string lives in
   *  this module, not once per code block in the page payload. */
  variant?: "overlay";
  resetMs?: number;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      onClick={async () => {
        const pre = ref.current?.closest("[data-copy-scope]")?.querySelector("pre");
        try {
          if (!pre) throw new Error("nothing to copy");
          await navigator.clipboard.writeText(pre.textContent ?? "");
          setState("copied");
        } catch {
          setState("failed");
        }
        setTimeout(() => setState("idle"), resetMs);
      }}
      className={className ?? (variant === "overlay" ? OVERLAY : DEFAULT)}
    >
      <span aria-live="polite">{state === "copied" ? copied : state === "failed" ? failed : label}</span>
    </button>
  );
}
