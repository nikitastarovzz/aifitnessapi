import Link from "next/link";
import { breadcrumbNode } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/**
 * Renders the visual breadcrumb trail AND emits the BreadcrumbList JSON-LD.
 * This is the single source of BreadcrumbList — pages must NOT hand-roll another
 * one (§7: don't duplicate BreadcrumbList).
 */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--muted)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbNode(trail)) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-[var(--fg)]">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.path} className="hover:text-[var(--fg)]">
                    {crumb.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
