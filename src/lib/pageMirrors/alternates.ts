import { markdownUrl } from "@/lib/schema";

/**
 * `metadata.alternates` for a page with a markdown mirror: its canonical plus
 * the `text/markdown` alternate the cluster pages carry. Kept apart from the
 * registry so a page's metadata does not import every mirror module.
 */
export function pageMirrorAlternates(path: string) {
  return { canonical: path, types: { "text/markdown": markdownUrl(path) } };
}
