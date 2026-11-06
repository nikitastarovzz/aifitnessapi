import { site, absoluteUrl } from "@/lib/site";
import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";
import { WEEKLY_FEED_PATH, WEEKLY_PATH, weekDataDate, weekHeading, weekPath, weekText, weeks } from "@/lib/weekly";

/**
 * /weekly/feed.xml — one RSS item per week of the roundup
 * (ops/VIRAL-20-2026-11-06.md item 9). Static, the machine-file cache policy.
 * pubDate is the newest record the week holds, never the build time, so a
 * rebuild with the same records writes the same feed. A week still running at
 * build time keeps one guid and grows in place.
 */
export const dynamic = "force-static";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;",
  );
}

export function GET(): Response {
  const items = weeks()
    .map((w) => {
      const url = absoluteUrl(weekPath(w.id));
      return `    <item>
      <title>${escapeXml(`${weekHeading(w)} (${w.range})`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${weekDataDate(w)}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(weekText(w))}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — Weekly fitness API roundup`)}</title>
    <link>${absoluteUrl(WEEKLY_PATH)}</link>
    <atom:link href="${absoluteUrl(WEEKLY_FEED_PATH)}" rel="self" type="application/rss+xml" />
    <description>Each ISO week in fitness and health APIs: tracked changes, graveyard dates, SDK and library releases, and new pages, generated from the site's records. Only records dated to the day are placed in a week.</description>
    <language>en</language>
    <docs>${absoluteUrl(WEEKLY_PATH)}</docs>
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
