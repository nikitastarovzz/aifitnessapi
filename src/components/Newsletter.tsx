import SignupForm from "./SignupForm";

/**
 * The signup block (anchor target for every "Get the newsletter" CTA across
 * the site — keep id="subscribe"). Replaced the old mailto placeholder with
 * the real form posting to /api/signup.
 */
export default function Newsletter() {
  return (
    <section
      id="subscribe"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-[var(--border)]"
    >
      <div className="gradient-pan bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center sm:px-12">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Get the Fitness API Decision Kit — free
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-50/90">
          Sign up and the downloads appear instantly: the API selection
          checklist, the launch compliance checklist, the motion-SDK scorecard,
          and the full 2026 dataset. After that, one email when something
          actually changes — a deadline, a term, a deprecation. No fluff, no
          spam.
        </p>
        <ul className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-white/90">
          <li>✓ API selection checklist</li>
          <li>✓ Launch compliance checklist</li>
          <li>✓ Motion-SDK scorecard (CSV)</li>
          <li>✓ Fitness APIs 2026 dataset</li>
        </ul>
      </div>
      <div className="bg-[var(--bg)] px-6 py-8 sm:px-12">
        <SignupForm source="homepage-subscribe" />
      </div>
    </section>
  );
}
