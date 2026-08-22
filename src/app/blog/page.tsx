import type { Metadata } from "next";
import Container from "@/components/Container";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import PageSummary from "@/components/PageSummary";

export const metadata: Metadata = {
  title: "Fitness & Health API Blog",
  description:
    "Product breakdowns, API deep-dives, and playbooks for builders in health, wellness, and fitness tech.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <Container className="py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)]">
          Blog
        </h1>
        <PageSummary path="/blog" name="AIFitnessAPI blog" className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Product breakdowns, API deep-dives, and playbooks for builders in
          health, wellness, and fitness tech.
        </PageSummary>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">No posts yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
