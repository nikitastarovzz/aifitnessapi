import { site } from "@/lib/site";

/**
 * MVP subscribe block. For now it opens a pre-filled email to the site owner.
 * To wire a real provider (Buttondown, ConvertKit, Resend Audiences, etc.),
 * replace the mailto link with a form that POSTs to /api/subscribe.
 */
export default function Newsletter() {
  const subject = encodeURIComponent("Subscribe me to AIFitnessAPI");
  const body = encodeURIComponent(
    "Hi — I'd like to get AIFitnessAPI posts by email.",
  );
  const href = `mailto:${site.newsletterMailto}?subject=${subject}&body=${body}`;

  return (
    <section
      id="subscribe"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-center sm:px-12"
    >
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Build the future of fitness &amp; wellness
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-brand-50/90">
        Product breakdowns, API deep-dives, and playbooks for founders and
        engineers in health tech. No fluff, no spam.
      </p>
      <div className="mt-7 flex justify-center">
        <a
          href={href}
          className="rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-sm transition-transform hover:scale-[1.02]"
        >
          Subscribe by email
        </a>
      </div>
    </section>
  );
}
