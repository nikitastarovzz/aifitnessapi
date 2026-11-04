import { absoluteUrl, site } from "@/lib/site";

/**
 * URL and snippet helpers for the table embeds (see src/lib/embedTables.ts).
 * Kept apart from that module so the MDX renderer can use them without
 * pulling in the cluster registry.
 */
export const embedTablePath = (basePath: string, slug: string, n: number) =>
  `/embed/table${basePath}/${slug}/${n}`;

/** The id the page puts on the n-th table's wrapper, for deep links. */
export const tableAnchor = (n: number) => `tbl-${n}`;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * A starting height for the iframe, from the row count. Cells wrap, so this
 * is a guess the snippet labels as one, never a measurement.
 */
export const suggestedHeight = (rows: number) => Math.min(900, 200 + rows * 50);

/** The copy-paste snippets shown under a table. */
export function embedSnippets({
  basePath,
  slug,
  title,
  n,
  rows,
  section,
}: {
  basePath: string;
  slug: string;
  title: string;
  n: number;
  rows: number;
  section: string | null;
}) {
  const pageUrl = absoluteUrl(`${basePath}/${slug}`);
  const src = absoluteUrl(embedTablePath(basePath, slug, n));
  const label = escapeHtml(section ? `${section} — ${title}` : title);
  const iframe = `<iframe src="${src}"
        title="${label}"
        width="100%" height="${suggestedHeight(rows)}" loading="lazy" style="border:0"></iframe>
<p><a href="${pageUrl}">${escapeHtml(title)}</a> via ${site.name}</p>`;
  const link = `<a href="${pageUrl}#${tableAnchor(n)}">${escapeHtml(title)}</a> — ${site.name}`;
  return { iframe, link };
}
