import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-400">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingTime}</span>
        {post.draft && (
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-medium text-amber-600">
            Draft
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
        <Link href={`/blog/${post.slug}`}>
          <span className="absolute inset-0" aria-hidden />
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
        {post.description}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
