import { NextResponse, type NextRequest } from "next/server";

/**
 * Postel's law for addresses: accept the URL a person or a link actually
 * sent, and answer with the one the site serves (2026-11-12).
 *
 * Every page here lives at a lowercase path with no extension, and before
 * this file a capitalised path (/HealthKit, a link copied from a slide) or an
 * ".html" one (/pricing/fitbit-api-pricing.html, what some link checkers and
 * old bookmarks add) was a 404. Both now get a permanent redirect to the page
 * they plainly meant. The matcher keeps this off every other request: it runs
 * only for a path that has a capital letter or ends in .html, so normal
 * traffic never reaches it.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  let path = url.pathname;
  if (path.toLowerCase().endsWith(".html")) path = path.slice(0, -5) || "/";
  if (path.endsWith("/index")) path = path.slice(0, -6) || "/";
  path = path.toLowerCase();
  if (path === url.pathname) return NextResponse.next();
  url.pathname = path;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/|api/)[^.]*[A-Z][^.]*)", "/((?!_next/|api/).*\\.[hH][tT][mM][lL])"],
};
