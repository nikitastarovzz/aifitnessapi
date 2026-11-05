import { absoluteUrl, site } from "@/lib/site";

/**
 * The copy-paste iframe for a countdown widget. Kept free of data imports so
 * the /my-stack client component can build the same snippet in the browser.
 */
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const COUNTDOWN_HEIGHT = 300;

export function countdownSnippet(t: { id: string; name: string; kind: "vendor" | "entry"; canonical: string }): string {
  const src = absoluteUrl(`/embed/countdown/${t.id}`);
  const title = escapeHtml(t.kind === "vendor" ? `Next ${t.name} API deadline` : `${t.name}: countdown`);
  return `<iframe src="${src}"
        title="${title}"
        width="100%" height="${COUNTDOWN_HEIGHT}" loading="lazy" style="border:0"></iframe>
<p><a href="${absoluteUrl(t.canonical)}">${title}</a> via ${site.name}</p>`;
}
