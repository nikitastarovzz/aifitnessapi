import Link from "next/link";
import { HEAD_TERMS } from "@/data/headTerms";

/**
 * One line naming the page that owns each of the site's head terms
 * (src/data/headTerms.ts), for the hubs and indexes Search Console showed
 * ranking for those terms instead of their owners (ops/MORE-30-2026-11-05.md
 * items 1-4). The anchor text is the term itself, so each link says which page
 * answers it. The current page's own term is left out.
 */
export default function HeadTermLinks({ path, className = "mt-5" }: { path: string; className?: string }) {
  const terms = HEAD_TERMS.filter((t) => t.owner !== path);
  if (!terms.length) return null;
  return (
    <p data-head-term-links className={`${className} text-sm text-[var(--muted)]`}>
      Looking for a whole category rather than one product? Each has one page here:{" "}
      {terms.map((t, i) => (
        <span key={t.term}>
          {i > 0 && (i === terms.length - 1 ? " and " : ", ")}
          <Link href={t.owner} className="text-brand-600 underline hover:text-brand-500">
            {t.label}
          </Link>
        </span>
      ))}
      .
    </p>
  );
}
