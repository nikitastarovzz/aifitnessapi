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
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center sm:px-12">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Build the future of fitness &amp; wellness
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-50/90">
          Product breakdowns, API deep-dives, and playbooks for founders and
          engineers in health tech — matched to what you tell us you&rsquo;re
          building. No fluff, no spam.
        </p>
      </div>
      <div className="bg-[var(--bg)] px-6 py-8 sm:px-12">
        <SignupForm source="homepage-subscribe" />
      </div>
    </section>
  );
}
