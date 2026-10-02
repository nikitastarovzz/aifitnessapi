import Link from "next/link";
import { otherLookups } from "@/lib/toolRegistry";

/**
 * The sibling nav at the foot of a tool page.
 *
 * Every tool linked back to the hub and nothing else, so the six of them sat
 * in a star with /tools at the centre: a reader who arrived at the identifier
 * translator from a search had one way onward, and the translator itself was
 * down to two inbound links site-wide. These tools answer adjacent questions —
 * the aggregation checker and the query generator disagree about the same
 * quantity type for a reason — so the useful move is sideways, not up.
 *
 * Lookups only, and the anchor is each tool's own name, which is distinct per
 * tool by construction. The planners are named in the trailing line rather
 * than carded, because a nine-card block at the foot of a tool is a link farm.
 */
export default function MoreTools({ path }: { path: string }) {
  const tools = otherLookups(path);
  if (tools.length === 0) return null;

  return (
    <nav aria-label="Other tools" className="mt-14 border-t border-[var(--border)] pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        The other {tools.length} tools
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {tools.map((t) => (
          <li key={t.path}>
            <Link
              href={t.path}
              className="group block h-full rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              <span className="block text-sm font-semibold text-[var(--fg)] group-hover:text-brand-600">
                {t.name} →
              </span>
              <span className="mt-1 block text-sm text-[var(--muted)]">{t.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-[var(--muted)]">
        The planners and demos — the API picker, the cost planner, the side-by-side comparison and
        the day-boundary demo — are listed with these on{" "}
        <Link href="/tools" className="font-medium text-brand-600 hover:text-brand-500">
          free tools for health-app builders
        </Link>
        .
      </p>
    </nav>
  );
}
