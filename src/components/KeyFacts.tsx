import type { KeyFact } from "@/lib/keyFacts";
import { PT_UI } from "@/lib/translations";

/**
 * The "Key facts" block under a money page's answer capsule. Facts come from
 * src/lib/keyFacts.ts — verbatim quotes from the page's checked sources — so
 * this component only lays them out. Renders nothing for an empty list.
 *
 * Markup contract qa reads (KEY-FACTS-SOURCED): the block carries
 * `data-key-facts`; each line is an <li data-key-fact> whose `data-source`
 * is the source URL, whose <q> holds the quote, and whose link points at
 * that same URL.
 */
export default function KeyFacts({
  facts,
  locale,
  attached = false,
}: {
  facts: KeyFact[];
  locale?: "pt-BR";
  /** Joined to the answer capsule above it, as the bottom half of one card. */
  attached?: boolean;
}) {
  if (facts.length === 0) return null;
  const pt = locale === "pt-BR";
  return (
    <section
      data-key-facts
      aria-labelledby="key-facts"
      className={
        attached
          ? "rounded-b-2xl border border-t-0 border-brand-400/30 p-5 sm:p-6"
          : "mt-6 rounded-2xl border border-[var(--border)] p-5 sm:p-6"
      }
    >
      <h2 id="key-facts" className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        {pt ? PT_UI.keyFacts : "Key facts"}
      </h2>
      <ul className="mt-3 space-y-2.5 text-[var(--fg)]">
        {facts.map((f) => (
          <li key={f.quote} data-key-fact data-source={f.url} className="leading-relaxed">
            <q lang="en">{f.quote}</q>{" "}
            <span className="text-sm text-[var(--muted)]">
              —{" "}
              <a
                href={f.url}
                rel="nofollow"
                className="underline decoration-[var(--border)] underline-offset-2 hover:text-brand-600"
              >
                {f.host}
              </a>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--muted)]">
        {pt
          ? PT_UI.keyFactsNote
          : "Quoted word for word from the sources this page was checked against; each line links the page that states it."}
      </p>
    </section>
  );
}
