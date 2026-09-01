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
];

const SITE = "https://aifitnessapi.com";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // NOTE: canonical host (www vs apex) is handled at the Vercel domain
      // level, NOT here. An app-level host redirect here fought a
      // platform-level redirect going the other way and produced an infinite
      // loop (ERR_TOO_MANY_REDIRECTS). Host canonicalization belongs in one
      // place — the Vercel dashboard — so this file must not do it.
      { source: "/posts", destination: "/blog", permanent: true },
      { source: "/articles", destination: "/blog", permanent: true },
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
    return [
      { source: "/:path*", headers: [describedBy] },
      {
        source: "/blog/:slug",
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
        source: `/${c}/:slug`,
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
