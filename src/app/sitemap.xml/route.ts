import { sitemapIndexXml } from "@/lib/sitemap";

/**
 * /sitemap.xml — a sitemap index over one child per section of the site
 * (src/lib/sitemap.ts; the children are src/app/sitemaps/[file]/route.ts).
 *
 * The URL stays the one robots.txt advertises and Search Console and Bing
 * Webmaster Tools were given, so nothing outside the repo has to change.
 * Hand-rendered rather than Next's sitemap.ts convention: with
 * generateSitemaps that convention serves the children at /sitemap/<n>.xml
 * and no longer answers /sitemap.xml at all.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(sitemapIndexXml(), {
    headers: { "content-type": "application/xml" },
  });
}
