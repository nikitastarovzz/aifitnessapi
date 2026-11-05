/**
 * Cache policy for the machine surfaces: markdown mirrors, llms*.txt, the
 * answers files, claims.json, the feeds and /api/v1
 * (ops/MORE-30-2026-11-05.md item 23).
 *
 * Every one of them is `force-static`: written once per deploy, the same
 * bytes for every reader, no cookies read, nothing personal in them. So a
 * client may reuse a copy for an hour and keep serving it for a day while it
 * revalidates. This is the value /api/v1 already sends and /developers
 * documents; src/lib/publicApi.ts now imports it from here, so the site has
 * one machine-file policy rather than one per route.
 *
 * Only for static GET handlers. The dynamic routes (/api/signup, /api/feedback,
 * /api/vitals, /api/search-miss, /mcp) keep their own headers; qa's
 * MACHINE-CACHE gate fails if a dynamic route imports this, and checks every
 * built machine file carries it. HTML pages are untouched: Next sets their
 * caching, and nothing here matches a page.
 */
export const MACHINE_CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";
