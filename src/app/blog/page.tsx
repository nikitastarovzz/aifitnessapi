import type { Metadata } from "next";
import Container from "@/components/Container";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
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
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Product breakdowns, API deep-dives, and playbooks for builders in
          health, wellness, and fitness tech.
        </p>
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
