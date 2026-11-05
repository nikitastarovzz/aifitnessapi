import Link from "next/link";
import CopySnippet from "@/components/CopySnippet";
import { countdownSnippet } from "@/lib/countdownSnippet";
import { countdownPath, countdownTargetById } from "@/lib/vendorDeadlines";

/**
 * The "Embed a countdown" control: a closed <details> with the iframe code
 * for one /embed/countdown/<id> widget (ops/AUDIENCE-30-2026-11-05.md item 26).
 * Server-rendered and closed, so it takes one line until opened.
 * `data-embed-countdown` names the widget it offers; qa holds every control to
 * a built widget and every built widget to at least one control
 * (COUNTDOWN-EMBED-*).
 */
export default function CountdownEmbed({ id, label, className = "" }: { id: string; label?: string; className?: string }) {
  const t = countdownTargetById(id);
  if (!t) throw new Error(`CountdownEmbed: no countdown widget for "${id}" (lib/vendorDeadlines.ts)`);
  const route = countdownPath(id);
  const summary = label ?? (t.kind === "vendor" ? `Embed a countdown to the next ${t.name} deadline` : `Embed a countdown: ${t.name}`);
  return (
    <details data-embed-countdown={route} className={`not-prose group text-sm ${className}`}>
      <summary className="w-fit cursor-pointer list-none select-none rounded-full border border-[var(--border)] px-3 py-0.5 text-xs text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)] [&::-webkit-details-marker]:hidden">
        {summary}
        <span aria-hidden className="ml-1 inline-block transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-2 rounded-xl border border-[var(--border)] p-3 text-[var(--muted)]">
        <p className="text-xs leading-relaxed">
          Free to embed with attribution. The frame counts down on the reader&rsquo;s clock, says what the date is
          counted to (the sources give days, not times), and links back to the page that sources it.{" "}
          <Link href={route} target="_blank" className="text-brand-600 hover:text-brand-500">
            Preview
          </Link>{" "}
          ·{" "}
          <Link href="/badges#countdowns" className="text-brand-600 hover:text-brand-500">
            Terms
          </Link>
        </p>
        <CopySnippet code={countdownSnippet(t)} label={`Embed code for the ${t.name} countdown`} trackId="embed_countdown_copy" />
      </div>
    </details>
  );
}
