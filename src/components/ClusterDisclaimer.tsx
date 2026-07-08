import { formatDate } from "@/lib/posts";

/**
 * Trust line for comparison content (§9). States the freshness of the facts,
 * points readers to primary docs for volatile specifics (pricing, limits), and
 * handles third-party trademarks nominatively — we're not affiliated and we
 * don't disparage.
 */
export default function ClusterDisclaimer({ updated }: { updated: string }) {
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
