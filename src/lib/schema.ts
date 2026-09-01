/**
 * Shared JSON-LD builders. One stable Organization @id is referenced from the
 * WebSite node and from every page's author/publisher, so search engines treat
 * the whole site as one entity (E-E-A-T / knowledge-graph signal).
 *
 * Vocabulary discipline: every type and property emitted from this file was
 * checked against the published schema.org vocabulary (schemaorg release
 * 29.1) — including its declared domain, which is why `lastReviewed` and
 * `reviewedBy` are attached to a WebPage node and never to the Article.
 */
import { site, absoluteUrl } from "@/lib/site";
import { termsDefining, termId } from "@/data/glossary";
import type { ClusterEntry } from "@/lib/cluster";

export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/** Markdown mirror URL for a page path, per the llms.txt convention of
 *  serving the same URL with `.md` appended. */
export function markdownUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return absoluteUrl(clean === "/" ? "/index.md" : `${clean}.md`);
}

/** Subject areas the site claims expertise in — an entity signal, and a
 *  compact statement of scope for models building a topic profile. */
const KNOWS_ABOUT = [
  "Fitness APIs",
  "Wearable and health data integration",
  "Apple HealthKit",
  "Google Health Connect",
  "Health data aggregators",
  "AI motion tracking and pose estimation",
  "Nutrition APIs",
  "Health data compliance and privacy",
  "Bluetooth fitness devices",
  "Fitness app architecture",
];

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
    knowsAbout: KNOWS_ABOUT,
    // Our sourcing and correction rules, published — the page a model should
    // read to decide how much to trust everything else here.
    publishingPrinciples: absoluteUrl("/methodology"),
    // Who pays for the site, in machine-readable form. The disclosure is
    // already in prose on /methodology and on every first-party page; this
    // states the same relationship where a crawler can read it without
    // parsing English (ops/GEO.md: never let the funding relationship be
    // something a reader has to infer).
    funder: {
      "@type": "Organization",
      name: "KinesteX",
      url: "https://kinestex.com",
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/**
 * The WebSite node's search action. Google's sitelinks-searchbox feature
 * needs a real results page behind it — /search is that page, and it works
 * without JavaScript's help from the URL alone, so the action is honest
 * rather than decorative.
 */
export function searchActionNode() {
  return {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${site.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
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

/**
 * Vendor and standards documentation: when an entry links one of these, the
 * link is evidence for a claim, so it is emitted as `citation`.
 */
const DOC_DOMAINS = [
  "developer.apple.com",
  "developers.google.com",
  "developer.android.com",
  "developers.strava.com",
  "dev.fitbit.com",
  "developer.garmin.com",
  "cloud.ouraring.com",
  "developer.whoop.com",
  "docs.tryterra.co",
  "bluetooth.com",
  "www.bluetooth.com",
  "w3.org",
  "www.w3.org",
  "developer.mozilla.org",
];

/**
 * Everything else we link on purpose — repositories, projects, tools — is
 * emitted as `mentions`, not `citation`.
 *
 * The distinction is deliberate and it matters: a page that recommends
 * WireMock is not *citing* WireMock, and a page whose repo links are the
 * evidence behind a claim cannot be told apart from one that merely name-drops
 * a tool by URL pattern alone. `mentions` is true in both cases; `citation`
 * would be a claim about evidentiary role we cannot make programmatically.
 * Inflating `citation` is the machine-readable version of padding a
 * bibliography, and this site does not do that in prose either.
 */
const MENTION_DOMAINS = ["github.com", "gitlab.com", "pypi.org", "www.npmjs.com", "npmjs.com"];

function externalLinks(body: string): string[] {
  const urls = new Set<string>();
  for (const m of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(m[1]);
  return [...urls];
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null; // malformed URL in body — ignore rather than crash the build
  }
}

/** Vendor/standards documentation an entry links, as cited works. */
export function citationsFromBody(body: string): { "@type": string; url: string }[] {
  return externalLinks(body)
    .filter((u) => {
      const h = hostOf(u);
      return h !== null && DOC_DOMAINS.includes(h);
    })
    .map((url) => ({ "@type": "WebPage", url }));
}

/** Projects, repositories and tools an entry links — mentioned, not cited. */
export function mentionsFromBody(body: string): { "@type": string; url: string }[] {
  return externalLinks(body)
    .filter((u) => {
      const h = hostOf(u);
      return h !== null && MENTION_DOMAINS.includes(h);
    })
    .map((url) => ({ "@type": "CreativeWork", url }));
}

/** Rough word count of an entry body, for `wordCount`. */
function wordCount(body: string): number {
  return body.split(/\s+/).filter(Boolean).length;
}

/**
 * The full JSON-LD graph for a cluster spoke: a TechArticle (the content),
 * a WebPage (the document, carrying review metadata), and — when the page is
 * the site's canonical explanation of a glossary concept — `about` links to
 * that concept's stable DefinedTerm @id.
 */
export function spokeGraph({
  entry,
  basePath,
  hubLabel,
  capsuleId = "answer",
}: {
  entry: ClusterEntry;
  basePath: string;
  hubLabel: string;
  capsuleId?: string;
}) {
  const path = `${basePath}/${entry.slug}`;
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;

  const defines = termsDefining(path);
  const about = defines.map((t) => ({
    "@type": "DefinedTerm",
    "@id": termId(t.term),
    name: t.term,
    description: t.def,
    inDefinedTermSet: absoluteUrl("/glossary"),
  }));
  const citation = citationsFromBody(entry.body);
  const mentions = mentionsFromBody(entry.body);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": articleId,
        headline: entry.h1,
        alternativeHeadline: entry.primaryQuery,
        description: entry.metaDescription,
        abstract: entry.answer,
        datePublished: entry.updated,
        dateModified: entry.updated,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: hubLabel,
        wordCount: wordCount(entry.body),
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [`#${capsuleId}`],
        },
        ...(about.length ? { about } : {}),
        ...(citation.length ? { citation } : {}),
        ...(mentions.length ? { mentions } : {}),
      },
      {
        // `lastReviewed` and `reviewedBy` are WebPage properties in the
        // schema.org vocabulary, so they live here rather than on the article.
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: entry.h1,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: entry.updated,
        reviewedBy: orgRef(),
        primaryImageOfPage: { "@type": "ImageObject", url: `${url}/opengraph-image` },
        // The markdown mirror of this page, for clients that prefer it.
        encoding: {
          "@type": "MediaObject",
          encodingFormat: "text/markdown",
          contentUrl: markdownUrl(path),
        },
      },
    ],
  };
}

/**
 * The JSON-LD graph for a blog post.
 *
 * A post is a TechArticle in the same sense a spoke is — it is technical
 * reference writing, not a diary — so it carries the same furniture: the
 * speakable capsule, the review date, and a pointer to its markdown mirror.
 * BlogPosting stays on the page alongside this for the article-specific
 * properties (publish date, tags, author), because the two say different
 * things and dropping either loses information.
 */
export function postGraph({
  slug,
  title,
  description,
  published,
  updated,
  author,
  tags,
  words,
  capsuleId = "answer",
}: {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  author: string;
  tags: string[];
  words: number;
  capsuleId?: string;
}) {
  const path = `/blog/${slug}`;
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: title,
        description,
        datePublished: published,
        dateModified: updated,
        author:
          author === "AIFitnessAPI"
            ? orgRef()
            : { "@type": "Person", name: author },
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "Blog",
        wordCount: words,
        keywords: tags.join(", "),
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [`#${capsuleId}`],
        },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: title,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: updated,
        reviewedBy: orgRef(),
        encoding: {
          "@type": "MediaObject",
          encodingFormat: "text/markdown",
          contentUrl: markdownUrl(path),
        },
      },
    ],
  };
}

/**
 * CollectionPage + ItemList for a cluster hub: states that this URL is a
 * curated collection and enumerates its members in order, so a model reading
 * one hub learns the whole cluster without crawling it.
 */
export function hubGraph({
  basePath,
  name,
  description,
  updated,
  entries,
  capsuleId = "answer",
}: {
  basePath: string;
  name: string;
  description: string;
  updated: string;
  entries: { slug: string; h1: string; metaDescription: string }[];
  capsuleId?: string;
}) {
  const url = absoluteUrl(basePath);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    lastReviewed: updated,
    reviewedBy: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: [`#${capsuleId}`] },
    encoding: {
      "@type": "MediaObject",
      encodingFormat: "text/markdown",
      contentUrl: markdownUrl(basePath),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: entries.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: entries.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: e.h1,
        description: e.metaDescription,
        url: absoluteUrl(`${basePath}/${e.slug}`),
      })),
    },
  };
}
