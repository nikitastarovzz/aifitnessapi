import type { ReactNode } from "react";

/**
 * Layout for the iframe widgets.
 *
 * These routes render on other people's pages, so they must not carry the
 * site chrome. The App Router gives no way to opt a subtree out of the root
 * layout: a second root layout is only possible when `app/layout.tsx` does
 * not exist, and this one does (it owns <html>/<body>, the JSON-LD graph and
 * analytics). A nested layout renders *inside* the root layout's <main>, so
 * Header and Footer are already in the tree by the time we get here.
 *
 * So the chrome is suppressed with CSS rather than by editing the root layout:
 * the rules below hide the header, the footer and the skip link for this
 * subtree only, and they ship in the server HTML, so there is no flash of
 * chrome before hydration. The elements are still in the DOM (display:none
 * hides them from assistive tech too, which is what we want here) and the
 * root layout's analytics still load — removing those would mean editing
 * app/layout.tsx.
 */
const CHROMELESS = `
body > header,
body > footer,
body > a[href="#main"] { display: none !important; }
body { min-height: 0 !important; }
`;

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* dangerouslySetInnerHTML, not a text child: React escapes text, and an
          escaped ">" would break the child selectors above. */}
      <style dangerouslySetInnerHTML={{ __html: CHROMELESS }} />
      {children}
    </>
  );
}
