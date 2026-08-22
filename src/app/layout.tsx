import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import CtaTracker from "@/components/CtaTracker";
import { site, absoluteUrl } from "@/lib/site";
import WebVitals from "@/components/WebVitals";
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
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: absoluteUrl("/feed.xml"), title: `${site.name} — blog` },
        { url: absoluteUrl("/changes.xml"), title: `${site.name} — API changes & deadlines` },
      ],
      "application/feed+json": absoluteUrl("/feed.json"),
      "text/markdown": absoluteUrl("/index.md"),
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: site.locale,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
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
        <CtaTracker />
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
        <Analytics />
        <WebVitals />
      </body>
    </html>
  );
}
