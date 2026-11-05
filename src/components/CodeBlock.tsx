import type { ReactNode } from "react";
import CopyButton from "./CopyButton";

/**
 * A fenced code block with a copy button. A server component; only the
 * button hydrates, and it copies the textContent of the <pre> beside it —
 * the string the server rendered into it, with no highlighting markup and
 * no whitespace surprises. `raw` decides only whether a button is offered
 * (an empty block gets none): it used to be a client prop, which shipped
 * every code block's text a second time in the page's RSC payload
 * (ops/MORE-30-2026-11-05.md item 24). The wrapper is a plain div so the
 * prose styles that target descendant <pre> elements still apply.
 */
export default function CodeBlock({
  raw,
  children,
}: {
  raw: string;
  children: ReactNode;
}) {
  return (
    <div className="group relative" data-copy-scope>
      {raw && (
        // A refused copy fell back to "Copy" before, and still does.
        <CopyButton label="Copy" failed="Copy" resetMs={1600} variant="overlay" />
      )}
      {children}
    </div>
  );
}
