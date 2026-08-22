import { site, absoluteUrl } from "@/lib/site";

/**
 * OpenSearch description document — lets a browser add this site as a search
 * engine, so someone who reads here often can type a keyword in the address
 * bar and jump straight in. Chrome and Firefox both pick it up from the
 * `<link rel="search">` tag in the document head.
 *
 * It points at /search, which reads `q` from the URL and searches the
 * published index in the browser — so the template below resolves to a page
 * that actually answers the query rather than a landing page the reader then
 * has to search again. The same URL shape backs the sitelinks SearchAction in
 * the WebSite node, so the two can never describe different search entry
 * points.
 */
export const dynamic = "force-static";

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

export function GET(): Response {
  // OpenSearch caps ShortName at 16 characters; "AIFitnessAPI" is 12, so the
  // site name fits as-is and there is nothing to truncate.
  const shortName = site.name;
  const description =
    "Search the AIFitnessAPI index of fitness, wearable, health-data, nutrition and AI motion API guides.";

  // {searchTerms} is an OpenSearch template token, not a URL parameter we are
  // inventing — the browser substitutes the typed query before navigating.
  const template = `${absoluteUrl("/search")}?q={searchTerms}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                       xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>${escapeXml(shortName)}</ShortName>
  <Description>${escapeXml(description)}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="64" height="64" type="image/svg+xml">${absoluteUrl("/icon.svg")}</Image>
  <Url type="text/html" method="get" template="${escapeXml(template)}" />
  <moz:SearchForm>${absoluteUrl("/search")}</moz:SearchForm>
</OpenSearchDescription>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/opensearchdescription+xml; charset=utf-8",
    },
  });
}
