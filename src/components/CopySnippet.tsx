"use client";

import { useState } from "react";

/**
 * A code snippet with a copy button. The snippet is server-rendered in a
 * <pre>, so it can be selected and copied by hand where the clipboard API is
 * unavailable (an insecure context, an old browser); the button is the
 * convenience, not the only way.
 */
export default function CopySnippet({ code, label }: { code: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <div className="mt-3">
      <pre
        aria-label={label}
        className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-[var(--fg)]"
      >
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setState("copied");
          } catch {
            setState("failed");
          }
          setTimeout(() => setState("idle"), 2000);
        }}
        className="mt-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--fg)] transition-colors hover:border-brand-400"
      >
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed — select the code above" : "Copy embed code"}
      </button>
    </div>
  );
}
