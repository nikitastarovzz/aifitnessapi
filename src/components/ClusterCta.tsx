import CtaLink, { type CtaSource } from "./CtaLink";

/**
 * The contextual CTA (§5). The `pitch` references THIS page's situation, so the
 * same product (the newsletter) gets a page-specific pitch. Value first — this
 * renders after the useful content, framed as "and to keep up, …", never as an
 * interruption.
 */
export default function ClusterCta({
  pitch,
  source,
  id,
  locale,
}: {
  pitch: string;
  source: CtaSource;
  id: string;
  /** "pt-BR" on a translated page. The newsletter itself is in English, and says so. */
  locale?: "pt-BR";
}) {
  const pt = locale === "pt-BR";
  return (
    <aside className="not-prose my-12 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-6 sm:p-8">
      <p className="text-base text-[var(--fg)]">{pitch}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <CtaLink
          href="/#subscribe"
          source={source}
          id={id}
          className="group rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          {pt ? "Assine a newsletter (em inglês)" : "Get the newsletter"}{" "}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </CtaLink>
        <span className="text-xs text-[var(--muted)]">
          {pt
            ? "Análises de APIs para quem desenvolve. Sem spam; cancele quando quiser."
            : "New API breakdowns for builders. No spam, unsubscribe anytime."}
        </span>
      </div>
    </aside>
  );
}
