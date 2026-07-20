import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import { Mdx } from "@/components/mdx";
import {
  getAllPosts,
  getPostBySlug,
  formatDate,
} from "@/lib/posts";
import { site, absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = absoluteUrl(`/blog/${post.slug}`);
  // Fall back to the site-wide branded OG card when a post has no cover image.
  const ogImage = post.image ? absoluteUrl(post.image) : absoluteUrl("/opengraph-image");

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    keywords: post.tags.join(", "),
    ...(post.image ? { image: absoluteUrl(post.image) } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="mx-auto max-w-2xl">
        <nav className="mb-6 text-sm text-[var(--muted)]">
          <Link href="/blog" className="hover:text-[var(--fg)]">
            ← Back to blog
          </Link>
        </nav>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden>·</span>
            <span>{post.author}</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 text-lg text-[var(--muted)]">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
          <Mdx source={post.content} />
        </div>
      </article>
    </Container>
  );
}
