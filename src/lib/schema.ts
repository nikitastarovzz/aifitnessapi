/**
 * Shared JSON-LD builders. One stable Organization @id is referenced from the
 * WebSite node and from every page's author/publisher, so search engines treat
 * the whole site as one entity (E-E-A-T / knowledge-graph signal).
 */
import { site, absoluteUrl } from "@/lib/site";

export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/** The canonical Organization node. Emit once (in the root layout). */
export function organizationNode() {
  const sameAs = [site.social.github, site.social.twitter, site.social.linkedin].filter(
    Boolean,
  );
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** A lightweight publisher/author reference to the Organization by @id. */
export function orgRef() {
  return { "@id": ORG_ID };
}

/** BreadcrumbList from an ordered list of {name, path}. path "" = home. */
export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
