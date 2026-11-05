/**
 * The decision-kit block on /pricing and /alternatives pages
 * (ops/MORE-30-2026-11-05.md item 29). A reader comparing a vendor's price or
 * its replacements is doing exactly what the kit's checklist and scorecard
 * are for, so the block names the vendor and links the files themselves.
 *
 * No gate: the kit's files are public under /kit (scripts/build-kit.mjs), and
 * these links download them directly; the signup page (the footer's "Free
 * decision kit") offers the same files after a form, and this block does not
 * route through it. Plain anchors with data-cta: the delegated listener in
 * CtaTracker sends cta_click, so the block adds no client JavaScript. Ids are
 * listed in ops/MEASUREMENT.md.
 */

/** Pages about camera-based motion SDKs get the motion-SDK scorecard. */
const MOTION = /\b(quickpose|sency|mediapipe|openpose|kinestex|movenet|pose)\b/i;

/**
 * The vendor a pricing or alternatives page is about, read from its own H1
 * ("The Best Fitbit API Alternatives (2026)" → "Fitbit"); null when the H1
 * names no single vendor ("How Much Does a Fitness API Cost?", or a category
 * such as "Health data aggregator API pricing").
 */
export function comparedVendor(h1: string): string | null {
  const m = /^(?:The Best )?(.+?)(?: \([^)]*\))? (?:API )?(?:Alternatives|Pricing)\b/i.exec(h1);
  if (!m) return null;
  const full = m[1].replace(/ \([^)]*\)$/, "").trim();
  // "Human API" is the product's name; elsewhere "API" is the page's word.
  const name = full === "Human API" ? full : full.replace(/ API$/, "");
  // A lower-case word after the first, or "Database", is a category, not a product.
  if (/^[A-Z][a-z]+ [a-z]/.test(name) || /\bDatabase\b/.test(name)) return null;
  return name;
}

const link = "font-medium text-brand-600 underline underline-offset-2 hover:text-brand-500";

export default function DecisionKitCta({ h1, slug }: { h1: string; slug: string }) {
  const vendor = comparedVendor(h1);
  const motion = MOTION.test(`${slug} ${h1}`);
  return (
    <aside
      data-decision-kit
      className="not-prose mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <h2 className="text-base font-semibold text-[var(--fg)]">
        {vendor ? `Comparing ${vendor}?` : "Comparing fitness APIs?"} Get the{" "}
        {motion ? "scorecard and checklist" : "checklist"}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {motion
          ? "Score each motion SDK on the same clips and devices, and check each candidate against the same questions before you sign."
          : "Check each candidate against the same questions before you commit: approval gates, billing units, user-side costs and data access."}{" "}
        Free downloads from the Fitness API Decision Kit, no signup needed.
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {motion && (
          <li>
            <a href="/kit/motion-sdk-scorecard.csv" download data-cta="kit-scorecard" data-cta-source="money-kit" className={link}>
              Motion-SDK scorecard (.csv)
            </a>
          </li>
        )}
        <li>
          <a href="/kit/api-selection-checklist.md" data-cta="kit-checklist" data-cta-source="money-kit" className={link}>
            API selection checklist (.md)
          </a>
        </li>
        <li>
          <a href="/kit/fitness-api-decision-kit.zip" download data-cta="kit-zip" data-cta-source="money-kit" className={link}>
            The whole kit (.zip)
          </a>
        </li>
      </ul>
    </aside>
  );
}
