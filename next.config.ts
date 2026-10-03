import type { NextConfig } from "next";

/**
 * Cluster base paths that have markdown mirrors. Kept as a literal because
 * next.config cannot import the TS data modules; `scripts/qa.mjs` asserts this
 * list matches the cluster registry, so it cannot silently drift.
 */
const CLUSTERS = [
  "fitness-apis",
  "guides",
  "build",
  "integrate",
  "fix",
  "learn",
  "alternatives",
  "compliance",
  "migrate",
  "pricing",
  "compare",
  "data",
  "motion",
  "ai",
  "architecture",
  "test",
  "cookbook",
  "devices",
  "engagement",
  "watch-apps",
  "accessibility",
  "audio-coaching",
  "healthkit-queries",
  "phone-sensors",
];

const SITE = "https://aifitnessapi.com";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No page imports next/image (every image is a plain <img>, a route-served
  // SVG or a next/og ImageResponse), so the optimizer had nothing of ours to
  // serve. What it did do: the old `remotePatterns: [{ hostname: "**" }]` let
  // /_next/image?url=<any https URL> fetch, resize and cache images from any
  // host on the internet, billed to us — unbounded compute anyone could drive,
  // on a plan that was paused while this was live. `unoptimized` turns the
  // endpoint off (next start answers it with a 404). If next/image is ever
  // adopted, list the exact hosts it needs instead of a wildcard.
  images: { unoptimized: true },
  async redirects() {
    return [
      // NOTE: canonical host (www vs apex) is handled at the Vercel domain
      // level, NOT here. An app-level host redirect here fought a
      // platform-level redirect going the other way and produced an infinite
      // loop (ERR_TOO_MANY_REDIRECTS). Host canonicalization belongs in one
      // place — the Vercel dashboard — so this file must not do it.
      { source: "/posts", destination: "/blog", permanent: true },
      { source: "/articles", destination: "/blog", permanent: true },
      // The ten-row matrix page was superseded by the generated record
      // reference (one page per Health Connect record class); its unique
      // FAQs and traps moved to /matrix.
      { source: "/health-connect-records", destination: "/health-connect", permanent: true },
    ];
  },
  async rewrites() {
    // The llms.txt proposal asks for the markdown version of a page to live at
    // the page's own URL with `.md` appended, and for directory-style URLs to
    // use `index.md`. Our mirrors are generated under /md/*, so these rewrites
    // expose them at the conventional addresses without duplicating the
    // generator. /md/* stays working for anything already pointing at it.
    return [
      { source: "/index.md", destination: "/md/index" },
      // The blog is not in CLUSTERS (that list is asserted against the cluster
      // registry), so its mirrors are wired explicitly.
      { source: "/blog.md", destination: "/md/blog" },
      { source: "/blog/:slug.md", destination: "/md/blog/:slug" },
      ...CLUSTERS.map((c) => ({ source: `/${c}.md`, destination: `/md/${c}` })),
      ...CLUSTERS.map((c) => ({
        source: `/${c}/:slug.md`,
        destination: `/md/${c}/:slug`,
      })),
    ];
  },
  async headers() {
    // Same discovery relations as the <link> tags, for clients that read
    // headers instead of parsing HTML (curl, HEAD requests, fetchers).
    const describedBy = {
      key: "Link",
      value: `<${SITE}/llms.txt>; rel="describedby"; type="text/plain"`,
    };
    // Header rules match the path as requested, before any rewrite, and an
    // unconstrained `:slug` is "anything but a slash" — so `/fix/x.md`
    // matched `/fix/:slug` with slug "x.md", and every markdown mirror
    // advertised `/fix/x.md.md` as its alternate, a URL that 404s. Real slugs
    // are lowercase words joined by hyphens (every registry slug and post
    // filename was checked against this class), so the param refuses the dot.
    // `opengraph-image` is excluded for the same reason: it is each hub's OG
    // image route, matched by the same rule, and has no markdown twin.
    const SLUG = "(?!opengraph-image$)[a-z0-9-]+";
    return [
      // The markdown mirrors send their own single Link header (canonical +
      // describedby) from src/app/md/[...path]/route.ts. If this catch-all
      // also matched them, the response would carry a second, different Link
      // value. So it skips anything under /md/, and any path ending in `.md`
      // (/index.md, /blog.md, /fix.md, /fix/<slug>.md), which is how those
      // requests look when header rules see them. `.*` with an empty match
      // keeps `/` itself covered, as `/:path*` did.
      { source: "/:path((?!md(?:/|$))(?!.*\\.md$).*)", headers: [describedBy] },
      {
        source: `/blog/:slug(${SLUG})`,
        headers: [
          {
            key: "Link",
            value:
              `<${SITE}/blog/:slug.md>; rel="alternate"; type="text/markdown", ` +
              `<${SITE}/llms.txt>; rel="describedby"; type="text/plain"`,
          },
        ],
      },
      // Both relations in one value: a second header entry with the same key
      // replaces the first rather than adding to it, so the spoke rule has to
      // restate describedby or cluster pages would lose it.
      ...CLUSTERS.map((c) => ({
        source: `/${c}/:slug(${SLUG})`,
        headers: [
          {
            key: "Link",
            value:
              `<${SITE}/${c}/:slug.md>; rel="alternate"; type="text/markdown", ` +
              `<${SITE}/llms.txt>; rel="describedby"; type="text/plain"`,
          },
        ],
      })),
    ];
  },
};

export default nextConfig;
