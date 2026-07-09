import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { getAllPosts } from "@/lib/posts";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";
import { releasedGuides, GUIDES_PATH } from "@/data/guides";
import { releasedBuilds, BUILD_PATH } from "@/data/build";

export const metadata: Metadata = {
  title: "Site index",
  description: "Every page on AIFitnessAPI — guides, comparisons, and posts.",
  alternates: { canonical: "/site-index" },
};

/**
 * A crawlable HTML map linking every hub, spoke, and post (§4). Linked from the
 * footer so no page is more than ~2 clicks from anywhere.
 */
export default function SiteIndex() {
  const posts = getAllPosts();
  const spokes = releasedEntries();
  const guides = releasedGuides();
  const builds = releasedBuilds();

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">Site index</h1>
        <p className="mt-3 text-[var(--muted)]">Every page on {`AIFitnessAPI`}, in one place.</p>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Main</h2>
          <ul className="mt-4 space-y-2">
            <li><Link href="/" className="text-brand-600 hover:text-brand-500">Home</Link></li>
            <li><Link href="/blog" className="text-brand-600 hover:text-brand-500">Blog</Link></li>
            <li><Link href="/about" className="text-brand-600 hover:text-brand-500">About</Link></li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Fitness &amp; workout APIs
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href={PILLAR_PATH} className="text-brand-600 hover:text-brand-500">
                Best Fitness &amp; Workout APIs (guide + hub)
              </Link>
            </li>
            {spokes.map((e) => (
              <li key={e.slug}>
                <Link href={`${PILLAR_PATH}/${e.slug}`} className="text-brand-600 hover:text-brand-500">
                  {e.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Guides — adding AI workout tracking
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href={GUIDES_PATH} className="text-brand-600 hover:text-brand-500">
                How to Add AI Workout Tracking to Your App (guide + hub)
              </Link>
            </li>
            {guides.map((e) => (
              <li key={e.slug}>
                <Link href={`${GUIDES_PATH}/${e.slug}`} className="text-brand-600 hover:text-brand-500">
                  {e.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Build guides — by app type
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href={BUILD_PATH} className="text-brand-600 hover:text-brand-500">
                How to Build a Workout App (guide + hub)
              </Link>
            </li>
            {builds.map((e) => (
              <li key={e.slug}>
                <Link href={`${BUILD_PATH}/${e.slug}`} className="text-brand-600 hover:text-brand-500">
                  {e.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {posts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Posts</h2>
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
