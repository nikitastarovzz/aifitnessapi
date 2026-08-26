import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageSummary from "@/components/PageSummary";
import { getAllPosts } from "@/lib/posts";
import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";

export const metadata: Metadata = {
  title: "Site index",
  description:
    "Every page on AIFitnessAPI in one crawlable list: 20 sections of guides, comparisons, integrations and troubleshooting, plus the tools and the blog.",
  alternates: { canonical: "/site-index" },
};

/** Standalone pages that are not part of any cluster. */
const MAIN = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search every page and answer" },
  { href: "/apis", label: "Fitness & health API directory" },
  { href: "/compare-apis", label: "Compare two APIs side by side" },
  { href: "/picker", label: "Which fitness API should I use? (picker)" },
  { href: "/cost-planner", label: "Fitness API cost planner" },
  { href: "/matrix", label: "HealthKit ↔ Health Connect type reference" },
  { href: "/healthkit-identifiers", label: "Every HealthKit quantity type identifier" },
  { href: "/day-boundaries", label: "Why “today’s steps” is a bug (live demo)" },
  { href: "/changes", label: "Changes & deadlines tracker" },
  { href: "/alerts", label: "API change alerts — watch what you depend on" },
  { href: "/digest", label: "Monthly digest archive" },
  { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
  { href: "/ai-fitness-app", label: "How to build an AI fitness app" },
  { href: "/no-code-fitness-app", label: "Build a fitness app with no code, just APIs" },
  { href: "/google-fit-shutdown", label: "Google Fit shutdown centre" },
  { href: "/fitbit-api-shutdown", label: "Fitbit Web API retirement centre" },
  { href: "/datasets", label: "Open datasets (CC BY 4.0)" },
  { href: "/badges", label: "Embeds & badges for your site" },
  { href: "/glossary", label: "Glossary" },
  { href: "/blog", label: "Blog" },
  { href: "/methodology", label: "How we verify" },
  { href: "/about", label: "About" },
  { href: "/signup", label: "Newsletter" },
  { href: "/privacy", label: "Privacy" },
];

/**
 * A crawlable HTML map linking every hub, spoke, and post (§4). Linked from
 * the footer so no page is more than ~2 clicks from anywhere.
 *
 * Sections are derived from the cluster registry rather than listed by hand.
 * The hand-written version silently fell four clusters behind — the pages
 * existed, the index that promises "every page" did not know about them —
 * and an index that can go stale is worse than no index, because nothing
 * about it looks wrong.
 */
export default function SiteIndex() {
  const posts = getAllPosts();
  const clusters = Object.entries(clusterMap()).filter(([, entries]) => entries.length > 0);
  const total = clusters.reduce((n, [, entries]) => n + entries.length, 0);

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">Site index</h1>
        <PageSummary path="/site-index" name="Site index" className="mt-3 text-[var(--muted)]">
          Every page on AIFitnessAPI in one place: {total} pages across {clusters.length}{" "}
          sections, plus the tools and the blog. Generated from the same data the pages
          are, so it cannot fall behind them.
        </PageSummary>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Main
          </h2>
          <ul className="mt-4 space-y-2">
            {MAIN.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className="text-brand-600 hover:text-brand-500">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {clusters.map(([basePath, entries]) => (
          <section key={basePath} className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              {CLUSTER_LABELS[basePath] ?? basePath}{" "}
              <span className="font-normal normal-case tracking-normal">
                ({entries.length} pages)
              </span>
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={basePath} className="text-brand-600 hover:text-brand-500">
                  {CLUSTER_LABELS[basePath] ?? basePath} — section index
                </Link>
              </li>
              {entries.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`${basePath}/${e.slug}`}
                    className="text-brand-600 hover:text-brand-500"
                  >
                    {e.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {posts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Posts
            </h2>
            <ul className="mt-4 space-y-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="text-brand-600 hover:text-brand-500">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Container>
  );
}
