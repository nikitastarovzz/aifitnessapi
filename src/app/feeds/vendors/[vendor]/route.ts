import { site, absoluteUrl } from "@/lib/site";
import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";
import { vendorChangesPath, vendorFeedPath, vendorTimeline, vendorTimelines, timelineCheckedOn } from "@/lib/vendorChanges";

/**
 * Per-vendor RSS for the changes tracker, at /feeds/vendors/<id>.xml: the
 * entries of one vendor's timeline (/changes/<id>), in the same shape as
 * /changes.xml, so a team that depends on one API can subscribe to that API
 * alone. Only vendors with a timeline page have a feed (lib/vendorChanges.ts
 * sets the floor), and the channel <link> is that page.
 *
 * Addressing follows /feeds/<cluster>.xml: the `.xml` suffix is part of the
 * dynamic param, and generateStaticParams is the whole list of addresses.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { vendor: string }[] {
  return vendorTimelines().map((t) => ({ vendor: `${t.api.id}.xml` }));
}

/** The same escaping rule as /changes.xml and the cluster feeds. */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;",
  );
}

const rfc822 = (day: string) => new Date(`${day}T00:00:00Z`).toUTCString();

export async function GET(_req: Request, { params }: { params: Promise<{ vendor: string }> }): Promise<Response> {
  const { vendor } = await params;
  const t = vendorTimeline(vendor.replace(/\.xml$/, ""));
  if (!t || !vendor.endsWith(".xml")) return new Response("Not found", { status: 404 });

  const { api, events } = t;
  const items = events
    .map((e) => {
      const desc = `[${e.status.toUpperCase()}] ${e.summary} (Stated date: ${e.date}. Last checked: ${e.verifiedOn}.)`;
      return `    <item>
      <title>${escapeXml(`${e.date} — ${e.title}`)}</title>
      <link>${absoluteUrl(e.page.href)}</link>
      <guid isPermaLink="false">${escapeXml(`${e.sortDate}-${e.title}`)}</guid>
      <pubDate>${rfc822(e.sortDate)}</pubDate>
      <category>${escapeXml(e.status)}</category>
      <description>${escapeXml(desc)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — ${api.short} API changes & deadlines`)}</title>
    <link>${absoluteUrl(vendorChangesPath(api.id))}</link>
    <atom:link href="${absoluteUrl(vendorFeedPath(api.id))}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(
      `The ${events.length} dated entries on the ${site.name} changes tracker that name ${api.label}, newest first, each graded confirmed (vendor's own words, quoted) or reported (consistent notices we could not confirm on an official page).`,
    )}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(timelineCheckedOn(t))}</lastBuildDate>
    <docs>${absoluteUrl("/changes")}</docs>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": MACHINE_CACHE_CONTROL,
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
