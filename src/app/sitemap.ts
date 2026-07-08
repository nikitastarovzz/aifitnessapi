import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const spokes = releasedEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(PILLAR_PATH), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/site-index"), changeFrequency: "monthly", priority: 0.3 },
  ];

  const spokeRoutes: MetadataRoute.Sitemap = spokes.map((e) => ({
    url: absoluteUrl(`${PILLAR_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...spokeRoutes, ...postRoutes];
}
