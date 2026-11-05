import { sitemapChildXml, sitemapSections } from "@/lib/sitemap";

/**
 * One section's sitemap, at /sitemaps/<section>.xml, listed by the index at
 * /sitemap.xml. The `.xml` suffix is part of the param, as in /feeds: a
 * crawler expects a path ending in .xml, and generateStaticParams is what
 * makes these the only addresses that exist.
 */
export const dynamic = "force-static";
// Anything not generated 404s instead of rendering a body for any name.
export const dynamicParams = false;

export function generateStaticParams(): { file: string }[] {
  // An empty section has no child: a sitemap with no <url> is an error to
  // Search Console, and the index leaves it out too.
  return sitemapSections()
    .filter((s) => s.rows.length > 0)
    .map((s) => ({ file: `${s.id}.xml` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }): Promise<Response> {
  const { file } = await params;
  const xml = sitemapChildXml(file.replace(/\.xml$/, ""));
  if (xml === null) return new Response("Not found", { status: 404 });
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
