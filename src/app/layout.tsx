import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site, absoluteUrl } from "@/lib/site";
import SiteInstrumentation from "@/components/SiteInstrumentation";
import { organizationNode, searchActionNode, ORG_ID, WEBSITE_ID } from "@/lib/schema";

/**
 * Device chrome. `colorScheme` lets the browser theme native controls,
 * scrollbars and form widgets to match the page instead of rendering a light
 * scrollbar against a dark page; `themeColor` tints the mobile browser's
 * address bar per scheme. Zoom is deliberately not restricted.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name }],
  keywords: [
    "fitness API",
    "health tech",
    "wellness API",
    "fitness app development",
    "AI fitness",
    "health and wellness startups",
  ],
  // Nothing below may name one page. Every route inherits this object, so a
  // canonical, og:url or og:/twitter: title set here lands on any route that
  // forgets its own: canonical "/" asks Google to fold that page into the
  // homepage, and og:url makes its share card resolve to the homepage. Only
  // what is true of every page lives here — feeds, site name, locale, default
  // card image. Pages state their own canonical and og:url; the routes that
  // state none (/s, which is noindex, and the 404) emit no canonical at all.
  // Where a page omits og:/twitter: title or description, Next fills them
  // from that page's own <title> and description.
  alternates: {
    types: {
      "application/rss+xml": [
        { url: absoluteUrl("/feed.xml"), title: `${site.name} — blog` },
        { url: absoluteUrl("/changes.xml"), title: `${site.name} — API changes & deadlines` },
      ],
      "application/feed+json": absoluteUrl("/feed.json"),
      "text/markdown": absoluteUrl("/index.md"),
    },
  },
  // A page that sets its own `openGraph` replaces this whole object — Next
  // does not merge it key by key — so such a page must restate `type` and
  // `images` or it loses og:image.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // One @graph tying the site together: a stable Organization @id referenced as
  // the WebSite publisher, and reused as author/publisher on every article (§7).
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": ORG_ID },
        potentialAction: searchActionNode(),
      },
    ],
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {/* Machine-readable surfaces. `describedby` points at the llms.txt
            that documents every convention this site follows; React hoists
            these into <head>. */}
        <link rel="describedby" type="text/plain" href={absoluteUrl("/llms.txt")} />
        <link
          rel="alternate"
          type="application/json"
          href={absoluteUrl("/answers.json")}
          title="Structured answer index"
        />
        {/* Adding the site as a browser search engine. The descriptor points
            at /search, which is a real page that works from its URL alone. */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          href="/opensearch.xml"
          title={site.name}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <SiteInstrumentation />
      </body>
    </html>
  );
}
