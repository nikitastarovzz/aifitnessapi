import { site, absoluteUrl } from "@/lib/site";
import { changesSorted } from "@/data/changes";

/**
 * RSS feed for the changes & deadlines tracker.
 *
 * The blog feed carries our writing; this one carries the ecosystem's dated
 * record — deprecations, deadlines, term changes — which is the part of this
 * site with a genuine reason to be polled. Each item states its grading
 * (confirmed vs reported) in the title suffix and the description, so a
 * consumer that only ever reads the feed still inherits the honesty rule.
 */
export const dynamic = "force-static";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;",
  );
}

export function GET(): Response {
  const events = changesSorted();

  const items = events
    .map((e) => {
      const url = absoluteUrl(e.page.href);
      // sortDate is a full ISO date even when `date` is fuzzy ("2026-09"),
      // so the feed always has a valid pubDate without sharpening the claim.
      const pub = new Date(`${e.sortDate}T00:00:00Z`).toUTCString();
      const desc = `[${e.status.toUpperCase()}] ${e.summary} (Stated date: ${e.date}. Last checked: ${e.verifiedOn}.)`;
      return `    <item>
      <title>${escapeXml(`${e.date} — ${e.title}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">${escapeXml(`${e.sortDate}-${e.title}`)}</guid>
      <pubDate>${pub}</pubDate>
      <category>${escapeXml(e.status)}</category>
      <description>${escapeXml(desc)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — Fitness API Changes &amp; Deadlines`)}</title>
    <link>${absoluteUrl("/changes")}</link>
    <atom:link href="${absoluteUrl("/changes.xml")}" rel="self" type="application/rss+xml" />
    <description>Dated ecosystem changes for fitness and health APIs: deprecations, deadlines, and term changes, each graded confirmed (vendor's own words, quoted) or reported (consistent notices we could not confirm on an official page).</description>
    <language>en</language>
    <docs>${absoluteUrl("/changes")}</docs>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
