import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

/**
 * Per-post OG card. The description IS the finding on these posts (every
 * description leads with the counted number), so putting it on the card gives
 * the share the number rather than a generic brand tile.
 */
export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return new ImageResponse(
    ogCard({
      eyebrow: "From the blog",
      title: post?.title ?? "AIFitnessAPI",
      line: post?.description,
    }),
    { ...OG_SIZE },
  );
}
