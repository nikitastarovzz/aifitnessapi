import Link from "next/link";
import Container from "@/components/Container";
import PostCard from "@/components/PostCard";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/** The eight content clusters, surfaced from the homepage so the highest-
 *  authority page links directly to every pillar hub (discovery + link equity). */
const CLUSTERS: { href: string; title: string; blurb: string }[] = [
  { href: "/fitness-apis", title: "Fitness & workout APIs", blurb: "Compare and choose an API by the job — exercise content, wearables, aggregators, nutrition, or AI motion tracking." },
  { href: "/guides", title: "Add AI workout tracking", blurb: "The capture → pose → interpret pipeline: camera pose, rep counting, form feedback, and per-platform wiring." },
  { href: "/build", title: "Build a workout app", blurb: "End-to-end build playbooks by app type — home workout, coaching, strength, running, rehab, and more." },
  { href: "/integrate", title: "Integration guides", blurb: "Register, OAuth, fetch, and webhooks — a hands-on guide per provider, from HealthKit to Terra." },
  { href: "/fix", title: "Troubleshooting", blurb: "Symptom-to-fix for the common errors: 401s, rate limits, empty data, dead webhooks, and OAuth snags." },
  { href: "/learn", title: "Concepts explained", blurb: "Plain-English explainers for the health-tech vocabulary — OAuth, aggregators, HRV, VO2 max, and more." },
  { href: "/alternatives", title: "Alternatives", blurb: "Anchored on one product: why teams look to switch, and the realistic options — with links to the comparisons." },
  { href: "/compliance", title: "Compliance & privacy", blurb: "Which rules apply — HIPAA, GDPR, FDA, app-store policy — and how to build for consent, storage, and deletion." },
];

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

      {/* What we cover — links to all eight cluster hubs */}
      <Container className="py-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            What we cover
          </h2>
          <Link href="/site-index" className="text-sm font-medium text-brand-600 hover:text-brand-500">
            Full site index →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CLUSTERS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              <span className="font-semibold text-[var(--fg)]">{c.title}</span>
              <span className="mt-2 text-sm text-[var(--muted)]">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="pb-16">
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
