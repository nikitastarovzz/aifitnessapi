import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { getAllPosts } from "@/lib/posts";

/** Hub social card with the page's own title and a line computed from the
 *  data, in place of the site-wide card (ops/SERP-30-2026-10-12.md #25). */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Research Notes on Fitness & Health APIs";

export default function Image() {
  const posts = getAllPosts();
  const latest = posts.map((p) => p.date).sort().pop();
  const line = `${posts.length} posts${latest ? `, latest ${latest}` : ""}`;
  return new ImageResponse(ogCard({ eyebrow: "Blog", title: "Research Notes on Fitness & Health APIs", line }), { ...OG_SIZE });
}
