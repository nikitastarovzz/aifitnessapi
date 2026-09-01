import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ClusterHero from "@/components/ClusterHero";
import { Mdx } from "@/components/mdx";
import {
  getAllPosts,
  getPostBySlug,
  formatDate,
} from "@/lib/posts";
import { site, absoluteUrl } from "@/lib/site";
import { postGraph, markdownUrl } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

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
    dateModified: post.updated,
    author:
      post.author === site.name
        ? { "@type": "Organization", name: site.name, url: site.url }
        : { "@type": "Person", name: post.author },
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

  // FAQPage markup only when the post actually declares Q&A. An empty FAQPage
  // is a structured-data error, not a neutral omission.
  const faqJsonLd = post.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const graph = postGraph({
    slug: post.slug,
    title: post.title,
    description: post.description,
    published: post.date,
    updated: post.updated,
    author: post.author,
    tags: post.tags,
    words: post.content.split(/\s+/).filter(Boolean).length,
  });

  // Read next: posts sharing the most tags, newest first as the tiebreak.
  const readNext = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ post: p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.shared - a.shared || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, 3)
    .map((x) => x.post);


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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <link rel="alternate" type="text/markdown" href={markdownUrl(`/blog/${post.slug}`)} />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="mx-auto max-w-2xl">
        <nav className="mb-6 text-sm text-[var(--muted)]">
          <Link href="/blog" className="hover:text-[var(--fg)]">
            ← Back to blog
          </Link>
        </nav>

        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt=""
            className="mb-8 aspect-[16/7] w-full rounded-2xl border border-[var(--border)] object-cover"
          />
        ) : (
          <ClusterHero label={post.tags[0] ?? "Article"} seed={stringSeed(post.slug)} />
        )}

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
            <p id="answer" className="speakable mt-4 text-lg text-[var(--muted)]">
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

        {post.faqs.length > 0 && (
          <section data-post-faq className="mt-14 border-t border-[var(--border)] pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Frequently asked questions
            </h2>
            <dl className="mt-6 divide-y divide-[var(--border)]">
              {post.faqs.map((f, i) => (
                <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                  <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                  <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {readNext.length > 0 && (
          <section data-post-readnext className="mt-14 border-t border-[var(--border)] pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Read next</h2>
            <ul className="mt-5 grid gap-4">
              {readNext.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="flex flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                  >
                    <span className="font-semibold text-[var(--fg)]">{p.title}</span>
                    <span className="mt-2 text-sm text-[var(--muted)]">{p.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12 text-sm text-[var(--muted)]">
          Last verified{" "}
          <time dateTime={post.updated}>{formatDate(post.updated)}</time>. Figures come
          from this site&rsquo;s own{" "}
          <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
            published datasets
          </Link>
          ; see{" "}
          <Link href="/methodology" className="font-medium text-brand-600 hover:text-brand-500">
            how we verify
          </Link>
          .
        </p>
      </article>
    </Container>
  );
}
