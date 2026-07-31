import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // Search Console shows both hosts indexed and splitting impressions —
      // one canonical host, permanently.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aifitnessapi.com" }],
        destination: "https://aifitnessapi.com/:path*",
        permanent: true,
      },
      // Common guesses land on the blog index rather than a 404.
      { source: "/posts", destination: "/blog", permanent: true },
      { source: "/articles", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
