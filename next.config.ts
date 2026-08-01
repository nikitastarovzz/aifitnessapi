import type { NextConfig } from "next";

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
};

export default nextConfig;
