// The built sitemap, read the way a crawler reads it: /sitemap.xml is an
// index (ops/MORE-30-2026-11-05.md item 26), and the rows live in the child
// sitemaps it lists. qa.mjs and gsc-report.mjs read the build through this,
// so neither can quietly go back to judging an index that holds no <url>.
import fs from "node:fs";
import path from "node:path";

export const SITE = "https://aifitnessapi.com";

/** <loc> + <lastmod> of each <sitemap> in an index. */
export function parseIndex(xml) {
  return [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)].map(([, s]) => ({
    loc: (/<loc>([^<]*)<\/loc>/.exec(s)?.[1] ?? "").trim(),
    lastmod: /<lastmod>([^<]*)<\/lastmod>/.exec(s)?.[1]?.trim() ?? null,
  }));
}

/**
 * Read the index and every child it lists from a build's server/app folder.
 *
 * Returns { index, children, xml, problems }:
 *   index     the index XML, or null when the build has none
 *   children  [{ loc, lastmod, file, xml }] in index order (xml null when the
 *             child the index lists was not built)
 *   xml       every child's XML concatenated — what the <url>-level gates
 *             read, exactly as they once read the single file
 *   problems  SITEMAP-INDEX lines for an index that is not one, a listed
 *             child that is missing, or a child that lives off-site
 */
export function readBuiltSitemap(appDir = ".next/server/app") {
  const problems = [];
  const indexFile = path.join(appDir, "sitemap.xml.body");
  if (!fs.existsSync(indexFile)) return { index: null, children: [], xml: "", problems };
  const index = fs.readFileSync(indexFile, "utf8");
  if (!/<sitemapindex\b/.test(index) || /<url>/.test(index)) {
    problems.push("SITEMAP-INDEX  /sitemap.xml is not a sitemap index (or carries <url> rows itself)");
  }
  const children = parseIndex(index).map((c) => {
    if (!c.loc.startsWith(`${SITE}/`)) {
      problems.push(`SITEMAP-INDEX  child ${c.loc} is not on ${SITE}`);
      return { ...c, file: null, xml: null };
    }
    const file = path.join(appDir, `${c.loc.slice(SITE.length + 1)}.body`);
    const xml = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    if (xml === null) problems.push(`SITEMAP-INDEX  ${c.loc} is listed in the index but not built`);
    return { ...c, file, xml };
  });
  return { index, children, xml: children.map((c) => c.xml ?? "").join("\n"), problems };
}
