/**
 * Small text helpers shared by the source generators. Only helpers whose
 * copies were identical in every generator live here; variants that decode
 * more entities or normalise differently stay in their own scripts.
 */

/** Cut a devsite page down to its <article> through the content footer;
 *  the whole page when either marker is missing. */
export function trimPage(html) {
  const a = html.indexOf("<article");
  const footEnd = html.indexOf("</devsite-content-footer>");
  if (a < 0 || footEnd < 0) return html;
  return html.slice(a, footEnd + "</devsite-content-footer>".length);
}

/** Decode &nbsp;, numeric references and the five XML entities. */
export function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** HTML fragment → text: tags dropped, entities decoded, whitespace collapsed. */
export const textOf = (html) => decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

/** The "Last updated YYYY-MM-DD UTC." stamp Google prints in the page footer. */
export const googleLastUpdated = (html) => /Last updated (\d{4}-\d{2}-\d{2}) UTC/.exec(html)?.[1] ?? null;

/** Apple inline content → text, resolving symbol links to their titles. */
export function linkedText(nodes, refs) {
  let out = "";
  for (const n of nodes || []) {
    if (!n || typeof n !== "object") continue;
    if (n.type === "text") out += n.text ?? "";
    else if (n.type === "codeVoice") out += n.code ?? "";
    else if (n.type === "reference") out += refs?.[n.identifier]?.title ?? String(n.identifier).split("/").pop();
    else if (n.inlineContent) out += linkedText(n.inlineContent, refs);
  }
  return out;
}
