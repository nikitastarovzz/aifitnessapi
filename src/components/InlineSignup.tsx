import SignupForm from "./SignupForm";

/**
 * The newsletter on the money pages: pricing, alternatives, compare and
 * integrate (ops/MORE-30-2026-11-05.md item 28). It takes ClusterCta's place
 * after the article, with the page's own pitch, but the button opens the
 * existing SignupForm in place instead of sending the reader to the homepage.
 *
 * Unobtrusive by construction: a native <details>, closed by default, so the
 * page reads exactly as before until someone asks for the form. The summary's
 * data-cta is counted by the delegated listener in CtaTracker (cta_click), and
 * a completed signup is credited to `money-<section>` by the form itself.
 *
 * Imported only by the four money routes and passed to ClusterPage as a slot,
 * never imported by ClusterPage: a client component reached from ClusterPage
 * ships in the bundle of every cluster page, and the form's script belongs on
 * these four sections only. Ids are listed in ops/MEASUREMENT.md.
 */
export default function InlineSignup({ pitch, section }: { pitch: string; section: string }) {
  return (
    <aside className="not-prose my-12 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-6 sm:p-8">
      <p className="text-base text-[var(--fg)]">{pitch}</p>
      <details id="subscribe" data-signup-inline={section} className="group/signup mt-5 scroll-mt-24">
        <summary
          data-cta={`newsletter-${section}`}
          data-cta-source="money-newsletter"
          className="flex cursor-pointer list-none flex-wrap items-center gap-3 [&::-webkit-details-marker]:hidden"
        >
          <span className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500">
            Get the newsletter{" "}
            <span aria-hidden className="inline-block transition-transform group-open/signup:rotate-90">
              →
            </span>
          </span>
          <span className="text-xs text-[var(--muted)]">
            New API breakdowns for builders. No spam, unsubscribe anytime.
          </span>
        </summary>
        <div className="mt-6">
          <SignupForm source={`money-${section}`} />
        </div>
      </details>
    </aside>
  );
}
