"use client";

import { useState, type ReactNode } from "react";

/**
 * A fenced code block with a copy button. The raw text is extracted on the
 * server and passed as a prop rather than read back out of the DOM, so the
 * button copies exactly what was written — no highlighting markup, no
 * whitespace surprises. The wrapper is a plain div so the prose styles that
 * target descendant <pre> elements still apply.
 */
export default function CodeBlock({
  raw,
  children,
}: {
  raw: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      {raw && (
        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(raw).then(
              () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              },
              () => setCopied(false),
            )
          }
          className="absolute right-2 top-2 z-10 rounded-md border border-[var(--border)] bg-[var(--bg)]/90 px-2 py-1 text-xs font-medium text-[var(--muted)] opacity-0 transition hover:border-brand-400 hover:text-[var(--fg)] focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}
      {children}
    </div>
  );
}
