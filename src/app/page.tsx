import Link from "next/link";
import Container from "@/components/Container";
import PostCard from "@/components/PostCard";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const recent = rest.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.18),transparent)]"
        />
        <Container className="py-20 sm:py-28 text-center">
          <span className="inline-flex items-center rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-300">
            Health · Wellness · Fitness Tech
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-6xl">
            {site.tagline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
            {site.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/blog"
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500"
            >
              Read the blog
            </Link>
            <Link
              href="/#subscribe"
              className="rounded-xl border border-[var(--border)] px-6 py-3 font-semibold text-[var(--fg)] transition-colors hover:bg-[var(--surface)]"
            >
              Subscribe
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        {posts.length === 0 ? (
          <p className="text-center text-[var(--muted)]">
            No posts yet — check back soon.
          </p>
        ) : (
          <>
            {featured && (
              <div className="mb-14">
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Latest
                </h2>
                <PostCard post={featured} />
              </div>
            )}

            {recent.length > 0 && (
              <div className="mb-16">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                    More reading
                  </h2>
                  <Link
                    href="/blog"
                    className="text-sm font-medium text-brand-600 hover:text-brand-500"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {recent.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Newsletter />
      </Container>
    </>
  );
}
