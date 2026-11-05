import { NextResponse, type NextRequest } from "next/server";

/**
 * Upper-case paths redirect to their lower-case form (308).
 *
 * Every page on this site lives at a lower-case path, and routing is
 * case-sensitive, so /Fitness-APIs — a capital typed into a link, a citation
 * or an assistant's answer — was a 404 (ops/MORE-30-2026-11-05.md item 25).
 * next.config.ts redirects cannot express this: a redirect's destination can
 * reuse what the source matched, but not change its case, and those sources
 * match case-insensitively unless experimental.caseSensitiveRoutes is on.
 *
 * Kept as small as a middleware can be: no imports beyond next/server, no
 * I/O, one comparison. The matcher keeps it off everything that is not a
 * page path — /_next, /api, and any path whose last segment has a dot (static
 * files, .md/.txt/.json/.xml surfaces) — and, in Next's own router (next
 * start), off every path without an upper-case letter, because Next compiles
 * the matcher to a case-sensitive RegExp. A host whose route table matches
 * case-insensitively still sends only page paths here, and for a lower-case
 * one this returns NextResponse.next() after one string comparison.
 *
 * The query string is kept; /api stays case-sensitive on purpose (its ids,
 * e.g. Bluetooth UUIDs like 0x2A37, are not page paths).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();
  if (lower === pathname) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = lower;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // An upper-case letter somewhere in the path, not under /_next or /api,
  // and no dot after the last slash.
  matcher: ["/((?!_next/|api/)(?=[^?]*[A-Z])(?:[^/]*/)*[^/.]*)"],
};
