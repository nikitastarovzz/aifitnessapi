import Link from "next/link";
import Container from "@/components/Container";
import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";

/**
 * A 404 that tries to finish the job. Most 404s here are a mistyped or moved
 * URL, and the reader still wants the thing they came for — so this offers
 * the search box, the busiest tools, and every section with its page count,
 * instead of a dead end and a "back home" button.
 */
export default function NotFound() {
  const map = clusterMap();
  const sections = Object.entries(map)
    .filter(([, entries]) => entries.length > 0)
    .map(([path, entries]) => ({
      path,
      label: CLUSTER_LABELS[path] ?? path,
      count: entries.length,
    }));

  const tools = [
    { href: "/picker", label: "Which fitness API should I use?" },
    { href: "/cost-planner", label: "Cost planner" },
    { href: "/matrix", label: "HealthKit ↔ Health Connect types" },
    { href: "/changes", label: "Changes & deadlines" },
    { href: "/glossary", label: "Glossary" },
    { href: "/site-index", label: "Every page, in one list" },
  ];

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--fg)]">
          That page isn&rsquo;t here
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          It may have moved, or the URL may have a typo. Search finds pages and the
          individual answers inside them — press <kbd className="rounded border border-[var(--border)] px-1 text-xs">/</kbd>{" "}
          anywhere on the site, or start here:
        </p>

        <form action="/search" method="get" role="search" className="mt-6 flex gap-2">
          <label htmlFor="nf-q" className="sr-only">
            Search AIFitnessAPI
          </label>
          <input
            id="nf-q"
            name="q"
            placeholder="Search every page…"
            className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-base text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-brand-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Search
          </button>
        </form>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Most-used pages
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {tools.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="block rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Every section
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.path}>
                <Link href={s.path} className="py-1 text-brand-600 hover:text-brand-500">
                  {s.label}{" "}
                  <span className="text-[var(--muted)]">({s.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
