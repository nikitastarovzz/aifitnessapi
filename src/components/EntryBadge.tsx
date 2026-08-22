import { formatDate } from "@/lib/posts";

/**
 * The freshness line on a hub card: when the page was last verified, and a
 * pill when that was recent.
 *
 * "Recent" is measured against build time, which on this site means deploy
 * time — the pages are static and rebuild on every deploy, so the badge
 * cannot rot into claiming something is new a year later. Thirty days is the
 * window; anything older just states its date, which is the honest default.
 */
const NEW_DAYS = 30;

export default function EntryBadge({ updated }: { updated: string }) {
  const then = Date.parse(updated);
  const days = Number.isNaN(then) ? Infinity : (Date.now() - then) / 86_400_000;
  const isNew = days >= 0 && days <= NEW_DAYS;
  return (
    <span className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
      {isNew && (
        <span className="rounded-full border border-brand-400/40 bg-brand-500/10 px-2 py-0.5 font-medium text-brand-600">
          Updated
        </span>
      )}
      <span>Verified {formatDate(updated)}</span>
    </span>
  );
}
