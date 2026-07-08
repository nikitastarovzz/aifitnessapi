import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // Common guesses land on the blog index rather than a 404.
      { source: "/posts", destination: "/blog", permanent: true },
      { source: "/articles", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
