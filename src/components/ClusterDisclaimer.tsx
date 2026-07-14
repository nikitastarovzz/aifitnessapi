import { formatDate } from "@/lib/posts";

/**
 * Trust line for cluster content (§9). Two variants:
 *  - "comparison" (default): states the freshness of the facts, points readers
 *    to primary docs for volatile specifics (pricing, limits), and handles
 *    third-party trademarks nominatively — we're not affiliated, we don't
 *    disparage.
 *  - "legal": the not-legal-advice line for the compliance cluster (YMYL).
 *    Regulations vary by jurisdiction and change; this is general engineering
 *    guidance, not legal or regulatory advice.
 */
export default function ClusterDisclaimer({
  updated,
  variant = "comparison",
}: {
  updated: string;
  variant?: "comparison" | "legal";
}) {
  if (variant === "legal") {
    return (
      <p className="not-prose mt-12 border-t border-[var(--border)] pt-6 text-xs leading-relaxed text-[var(--muted)]">
        General engineering guidance, last reviewed {formatDate(updated)}. This is
        not legal, medical, or regulatory advice. Health-data laws (HIPAA, GDPR,
        state privacy laws) and platform policies vary by jurisdiction and change
        often, and how they apply depends on your specific product, users, and
        data. Confirm your obligations with a qualified attorney or compliance
        professional and check the current official sources before you ship.
      </p>
    );
  }
  return (
    <p className="not-prose mt-12 border-t border-[var(--border)] pt-6 text-xs leading-relaxed text-[var(--muted)]">
      Independent comparison, last reviewed {formatDate(updated)}. Pricing, rate
      limits, and feature availability change often — confirm current details in
      each provider&rsquo;s official documentation before you commit. Product and
      company names are trademarks of their respective owners; AIFitnessAPI is not
      affiliated with, endorsed by, or sponsored by any product listed here.
    </p>
  );
}
