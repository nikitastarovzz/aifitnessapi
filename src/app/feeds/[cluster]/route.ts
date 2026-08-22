import { clusterMap, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { site, absoluteUrl } from "@/lib/site";

/**
 * Per-cluster RSS — one feed per content cluster, at `/feeds/<cluster>.xml`.
 *
 * `/feed.xml` carries the blog and `/changes.xml` carries the dated ecosystem
 * record; neither tells you that the Troubleshooting cluster gained a page.
 * Someone integrating Health Connect wants the /fix and /integrate pages, not
 * the whole site; a narrow feed is the one they will actually keep subscribed
 * to. Generated from the same data modules as the HTML (GEO §4), so a feed
 * cannot claim a page the site does not have.
 *
 * Addressing: the `.xml` suffix is part of the dynamic param, not a file
 * extension Next adds — `/feeds/devices.xml` arrives here as
 * `params.cluster === "devices.xml"`. That keeps the address the shape feed
 * readers and validators expect (a path ending in .xml) without a second route
 * segment, and `generateStaticParams` below is what makes those the only
 * addresses that exist.
 */
export const dynamic = "force-static";
// Anything not in generateStaticParams must 404 outright rather than invoking
// the handler and being cached as a rendered body. Same rule as /md: these are
// mirrors of clusters that exist, not a catch-all that answers for any name.
export const dynamicParams = false;

export function generateStaticParams(): { cluster: string }[] {
  // A cluster with no released pages gets no feed. An empty feed is a promise
  // with nothing behind it, and the cluster's hub 404s anyway — a feed whose
  // channel <link> is a 404 is worse than no feed.
  return Object.entries(clusterMap())
    .filter(([, entries]) => entries.length > 0)
    .map(([base]) => ({ cluster: `${base.slice(1)}.xml` }));
}

/** Copied from /feed.xml deliberately: one escaping rule for the whole site's
 *  RSS, so a fix in how we handle `&` never lands in one feed and not another. */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Wrap a capsule in CDATA. Answer capsules are prose we want readers to render
 * as-is, and CDATA keeps them readable in the raw feed instead of a wall of
 * &amp;. The only sequence CDATA cannot contain is its own terminator, so split
 * any `]]>` across two sections — the parsed text is identical either way.
 */
function cdata(text: string): string {
  return `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cluster: string }> },
): Promise<Response> {
  const { cluster } = await params;
  // "devices.xml" → "/devices". The registry is keyed by basePath, which is the
  // same string the hub and the sitemap use, so there is nothing to keep in sync.
  const base = `/${cluster.replace(/\.xml$/, "")}`;
  const entries = clusterMap()[base];

  // Unreachable while dynamicParams is false, but the empty-cluster rule is
  // load-bearing enough to state twice rather than depend on one config line.
  if (!entries || entries.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const label = CLUSTER_LABELS[base] ?? base.slice(1);
  const hubUrl = absoluteUrl(base);
  const selfUrl = absoluteUrl(`/feeds/${cluster}`);

  // Feed order is recency, not the hub's curated reading order: a subscriber
  // wants what changed, and `updated` is the field the sitemap and the markdown
  // mirrors already treat as the page's review date.
  const newestFirst = [...entries].sort((a, b) => (a.updated < b.updated ? 1 : -1));
  // Dates are plain YYYY-MM-DD review dates; pin them to UTC midnight so every
  // consumer reads the same day regardless of where it parses the feed.
  const rfc822 = (day: string) => new Date(`${day}T00:00:00Z`).toUTCString();

  const items = newestFirst
    .map((e) => {
      const url = absoluteUrl(`${base}/${e.slug}`);
      return `    <item>
      <title>${escapeXml(e.h1)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(e.updated)}</pubDate>
      <description>${cdata(e.answer)}</description>
    </item>`;
    })
    .join("\n");

  // The channel description is generated rather than copied from the hub page's
  // metadata: hub descriptions live in twenty separate page modules, and a
  // hand-copied table here would be exactly the drift GEO §4 exists to prevent.
  // What it promises instead is verifiable from the data — the count, the order,
  // and what each item's description actually contains.
  const description =
    `Every released page in the ${label} cluster on ${site.name} — ${entries.length} pages, newest first. ` +
    `Each item's description is that page's answer capsule: the direct answer the page opens with.`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — ${label}`)}</title>
    <link>${hubUrl}</link>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(newestFirst[0].updated)}</lastBuildDate>
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
