import Link from "next/link";

/**
 * "Recently re-verified" strip for a cluster hub.
 *
 * A hub already prints a verification date on every card. What it cannot show
 * is movement: a reader who came back this week has no way to tell which
 * three pages were re-checked since their last visit without reading twenty
 * dates. This is that one line.
 *
 * It renders nothing at all when nothing is recent, which is the point — an
 * always-present "recently updated" strip that quietly falls back to
 * six-month-old pages is the thing this must not become. `new Date()` is read
 * at render, and these pages are static, so the window is measured from the
 * deploy that built them. That is the same convention <EntryBadge> uses, and
 * it is honest for the same reason: the site rebuilds on every deploy, so the
 * strip cannot rot into claiming something is fresh a year later.
 */

const WINDOW_DAYS = 14;
const MAX_SHOWN = 3;

type Entry = { slug: string; updated: string; h1?: string };

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export default function HubFreshness({
  entries,
  basePath,
}: {
  entries: Entry[];
  basePath: string;
}) {
  const now = Date.now();
  const recent = entries
    .map((e) => ({ entry: e, at: Date.parse(`${e.updated}T00:00:00Z`) }))
    .filter(({ at }) => !Number.isNaN(at) && at <= now && now - at <= WINDOW_DAYS * 86_400_000)
    .sort((a, b) => b.at - a.at)
    .slice(0, MAX_SHOWN);

  if (recent.length === 0) return null;

  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-[var(--muted)]">
      <span className="font-medium text-[var(--fg)]">Recently re-verified:</span>
      {recent.map(({ entry }, i) => (
        <span key={entry.slug}>
          <Link
            href={`${basePath}/${entry.slug}`}
            className="text-brand-600 hover:text-brand-500"
          >
            {entry.h1 ?? entry.slug}
          </Link>{" "}
          <span className="text-xs">({shortDate(entry.updated)})</span>
          {i < recent.length - 1 ? "," : ""}
        </span>
      ))}
    </p>
  );
}
