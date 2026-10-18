import Link from "next/link";
import type { WtCounterpart, WtFlag, WtSource } from "@/data/workoutTypes";
import {
  activityPageForKey,
  activityPath,
  constantHref,
  flagLabel,
  platform,
  printedNumber,
  qualified,
  source,
} from "@/data/workoutTypePages";

/**
 * Shared pieces for the workout-type reference: inline code from the
 * generator's backtick convention, the "same name on" cell, the flag list and
 * the source list. Not a route: Next only treats page/layout/route/
 * opengraph-image files as route segments.
 */

export const LINK = "font-medium text-brand-600 hover:text-brand-500";
export const TH = "py-2 pr-4 font-semibold text-[var(--fg)]";
export const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";
export const CAPSULE =
  "speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6";
export const PILL =
  "inline-block rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]";

export function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-[13px] text-[var(--fg)]">{children}</code>;
}

/** A source's sentence with its `code` spans rendered as code. */
export function SourceText({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="break-words rounded bg-[var(--surface)] px-1 font-mono text-[0.85em] text-[var(--fg)]">
            {part}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** One counterpart: the platform, the constant (linked to its row) and its printed number. */
export function Counterpart({ c }: { c: WtCounterpart }) {
  const n = printedNumber(c);
  return (
    <span className="block">
      <span className="text-[var(--muted)]">{platform(c.platform).short}: </span>
      <Link href={constantHref(c)} className={LINK}>
        <code className="break-all font-mono text-xs">{c.name}</code>
      </Link>
      {n !== null && <span className="text-[var(--muted)]"> ({n})</span>}
    </span>
  );
}

/** The "same name on" cell of a list-page row. */
export function Counterparts({ items, rowKey }: { items: WtCounterpart[]; rowKey: string }) {
  if (!items.length) return <span className="text-[var(--muted)]">No same-name constant</span>;
  const page = activityPageForKey(rowKey);
  return (
    <>
      {items.map((c) => (
        <Counterpart key={`${c.platform}-${c.name}`} c={c} />
      ))}
      {page && (
        <Link href={activityPath(page)} className={`${LINK} mt-1 block text-xs`}>
          Side by side →
        </Link>
      )}
    </>
  );
}

/** Where two sources disagree: the summary, then each text with where it came from. */
export function FlagList({ flags }: { flags: WtFlag[] }) {
  if (!flags.length) return null;
  return (
    <ul className="mt-4 space-y-3">
      {flags.map((f) => (
        <li
          key={`${f.kind}-${f.subject}`}
          data-wt-flag={f.kind}
          className="rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm leading-relaxed text-[var(--fg)]"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">{flagLabel(f.kind)}</span>
          <span className="mt-1 block font-mono text-xs">{f.subject}</span>
          <span className="mt-2 block">
            <SourceText text={f.summary} />
          </span>
          {f.evidence.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
              {f.evidence.map((e, i) => {
                const s = sourceOrNull(e.sourceId);
                return (
                  <li key={i} className="border-l-2 border-amber-400/60 pl-3">
                    “<SourceText text={e.text} />”{" "}
                    {s ? (
                      <>
                        (
                        <a href={s.page} rel="nofollow" className={LINK}>
                          {s.title}
                        </a>
                        )
                      </>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/** A source id from the generator, or null for the per-case Apple pages it names by case. */
function sourceOrNull(id: string): WtSource | null {
  try {
    return source(id.startsWith("hkCase-") ? "hkCases" : id);
  } catch {
    return null;
  }
}

/** The sources list at the foot of a page. */
export function SourceList({ sources, note }: { sources: WtSource[]; note?: string }) {
  return (
    <section id="sources" className="mt-14">
      <h2 className={H2}>Sources ({sources.length})</h2>
      {note && <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{note}</p>}
      <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
        {sources.map((s) => (
          <li key={s.id} className="break-words">
            <a href={s.page} rel="nofollow" className={LINK}>
              {s.title}
            </a>
            {s.branch ? ` · ${s.repo}, branch ${s.branch}` : ""} · read {s.fetchedOn}
            {s.sourceUpdated ? ` · page last updated ${s.sourceUpdated}` : ""}
            <span className="font-mono text-[11px]"> · sha256 {s.sha256.slice(0, 12)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** How a constant is written in code, as inline code. */
export function Qualified({ c }: { c: WtCounterpart }) {
  return <Code>{qualified(c)}</Code>;
}
