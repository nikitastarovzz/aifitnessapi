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
}: {
  pitch: string;
  source: CtaSource;
  id: string;
}) {
  return (
    <aside className="not-prose my-12 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-6 sm:p-8">
      <p className="text-base text-[var(--fg)]">{pitch}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <CtaLink
          href="/#subscribe"
          source={source}
          id={id}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          Get the newsletter →
        </CtaLink>
        <span className="text-xs text-[var(--muted)]">
          New API breakdowns for builders. No spam, unsubscribe anytime.
        </span>
      </div>
    </aside>
  );
}
