import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { hubGraph, markdownUrl } from "@/lib/schema";
import PageSummary from "@/components/PageSummary";

// The <title> leads with what this page is for (ops/SERP-30-2026-10-12.md #3);
// TITLE stays the section name for the H1 and the structured data.
//
// 2026-10-27 (ops/SEO-10-2026-10-27.md item 8): Google showed this index for
// "fitness api" and "workout api" at positions 55 to 60 in the 28 days to
// 2026-10-24. The title and description now say it is an index of research
// notes, and the summary hands API searches to the roundups that own them.
const META_TITLE = "Blog Index: Research Notes on Fitness & Health APIs";
const TITLE = "Fitness & Health API Blog";
const DESCRIPTION =
  "An index of dated research notes counted from this site's datasets: what is in HealthKit, where the platforms disagree, what APIs cost, what is changing.";

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: META_TITLE,
    description: DESCRIPTION,
    url: "/blog",
  },
};

/**
 * Themed groups for the index. A flat reverse-chronological grid stops being
 * navigable once the archive is more than a screen tall — a reader arriving
 * from search wants the neighbouring posts on their topic, not the newest
 * post about something else. Anything not listed here falls through to
 * "Everything else", so a new post is never dropped from the page.
 */
const GROUPS: { title: string; blurb: string; tags: string[] }[] = [
  {
    title: "What is actually in HealthKit",
    blurb: "Counted out of Apple's own documentation, not from memory.",
    tags: ["healthkit"],
  },
  {
    title: "Where the two platforms disagree",
    blurb: "The places an Apple type and an Android record stop meaning the same thing.",
    tags: ["health-connect", "android"],
  },
  {
    title: "What the APIs really cost",
    blurb: "Approval gates, engineering effort, and the bill your users pay.",
    tags: ["cost", "api", "wearables"],
  },
  {
    title: "What is changing",
    blurb: "Dated deprecations, wind-downs, and how to tell a confirmed date from a rumour.",
    tags: ["deprecation", "ecosystem"],
  },
  {
    title: "How this site works",
    blurb: "The verification rules, and the times we got the data wrong.",
    tags: ["methodology"],
  },
];

export default function BlogIndex() {
  const posts = getAllPosts();
  const taken = new Set<string>();
  const grouped = GROUPS.map((g) => {
    const items = posts.filter(
      (p) => !taken.has(p.slug) && p.tags.some((t) => g.tags.includes(t)),
    );
    for (const p of items) taken.add(p.slug);
    return { ...g, items };
  }).filter((g) => g.items.length > 0);
  const rest = posts.filter((p) => !taken.has(p.slug));

  // Same collection markup every cluster hub carries: a model that reads this
  // one page learns the whole archive without crawling twenty URLs.
  const graph = hubGraph({
    basePath: "/blog",
    name: `${"AIFitnessAPI"} blog`,
    description:
      "Findings counted out of this site's own published datasets: what is actually in HealthKit, where the two platforms disagree, what the APIs cost, and what is changing.",
    updated: posts.map((p) => p.updated).sort().at(-1) ?? "",
    entries: posts.map((p) => ({ slug: p.slug, h1: p.title, metaDescription: p.description })),
  });

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <link rel="alternate" type="text/markdown" href={markdownUrl("/blog")} />
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)]">
          Blog
        </h1>
        <PageSummary path="/blog" name="AIFitnessAPI blog" className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          An index of dated research notes for builders in health, wellness and
          fitness tech, grouped by topic and counted out of this site&rsquo;s own
          datasets. Looking for an API to use? The roundups compare them:{" "}
          <Link href="/fitness-apis/wearable-data-apis" className="text-brand-600 underline hover:text-brand-500">
            wearable data APIs
          </Link>
          ,{" "}
          <Link href="/fitness-apis/exercise-database-apis" className="text-brand-600 underline hover:text-brand-500">
            exercise database APIs
          </Link>{" "}
          and{" "}
          <Link href="/fitness-apis/exercise-video-apis" className="text-brand-600 underline hover:text-brand-500">
            exercise APIs with demonstration videos
          </Link>
          .
        </PageSummary>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">No posts yet — check back soon.</p>
      ) : (
        <>
          {grouped.map((g) => (
            <section key={g.title} className="mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{g.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{g.blurb}</p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {g.items.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ))}
          {rest.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Everything else</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </Container>
  );
}
