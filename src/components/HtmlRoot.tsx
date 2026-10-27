"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The document's <html> element, with the language of the page it holds.
 *
 * The root layout renders one <html> for every route, and a server layout
 * cannot see which route it is rendering. A client component can: during the
 * static prerender usePathname() is the route being written, so each page's
 * HTML file carries its own lang, and on a client-side navigation between
 * an English page and a translated one React updates the attribute.
 *
 * The alternative, a second root layout for the translated routes, means
 * moving every existing route into a route group, which rewrites the path of
 * every page.tsx — and the git history several generators date pages from.
 * qa's PTBR-LANG holds the result: lang="pt-BR" under /pt-br, "en" elsewhere.
 */
export default function HtmlRoot({ children }: { children: ReactNode }) {
  const p = usePathname() ?? "";
  const lang = p === "/pt-br" || p.startsWith("/pt-br/") ? "pt-BR" : "en";
  return <html lang={lang}>{children}</html>;
}
