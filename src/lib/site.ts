/**
 * Single source of truth for site-wide metadata. Update these values and the
 * whole site (metadata, sitemap, RSS, JSON-LD, footer) follows.
 */
export const site = {
  name: "AIFitnessAPI",
  // No trailing slash. Used to build absolute URLs for SEO + RSS.
  url: "https://aifitnessapi.com",
  title: "AIFitnessAPI — Building in health, wellness & fitness tech",
  description:
    "Ideas, playbooks, and product breakdowns for people building — or looking for — products in health, wellness, and fitness tech.",
  tagline: "The hub for builders in health, wellness & fitness tech.",
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
