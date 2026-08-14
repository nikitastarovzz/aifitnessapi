/**
 * Single source of truth for site-wide metadata. Update these values and the
 * whole site (metadata, sitemap, RSS, JSON-LD, footer) follows.
 */
export const site = {
  name: "AIFitnessAPI",
  // No trailing slash. Used to build absolute URLs for SEO + RSS.
  url: "https://aifitnessapi.com",
  title: "AIFitnessAPI — Fitness API & SDK Guides for Builders",
  description:
    "Verified guides, comparisons, pricing, and CI-tested code for fitness, wearable, nutrition, and AI motion APIs — pick the right stack and ship it.",
  tagline: "Pick the right fitness API. Ship without the surprises.",
  locale: "en_US",
  author: {
    name: "Nikita Starov",
    email: "nikita@kinestex.com",
  },
  // Optional social handles (leave blank to hide).
  social: {
    twitter: "",
    github: "https://github.com/nikitastarovzz/aifitnessapi",
    linkedin: "",
  },
  // Newsletter: for now a mailto subscribe. Swap for a provider endpoint later.
  newsletterMailto: "nikita@kinestex.com",
} as const;

export function absoluteUrl(path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${clean === "/" ? "" : clean}`;
}
