"use client";

import { useState } from "react";

/**
 * A copy-to-clipboard button for text the server already rendered beside it.
 * The text stays selectable by hand when the clipboard API is unavailable;
 * the button is the convenience, never the only way to get the text.
 */
export default function CopyButton({
  text,
  label,
  copied = "Copied",
  failed = "Copy failed — select the text",
  className,
}: {
  text: string;
  label: string;
  copied?: string;
  failed?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("copied");
        } catch {
          setState("failed");
        }
        setTimeout(() => setState("idle"), 2000);
      }}
      className={
        className ??
        "rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
      }
    >
      <span aria-live="polite">{state === "copied" ? copied : state === "failed" ? failed : label}</span>
    </button>
  );
}
