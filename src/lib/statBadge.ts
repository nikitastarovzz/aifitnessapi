/**
 * Shields-style "label | value" badges carrying live numbers from this site's
 * own datasets, for embedding in a README.
 *
 * The two rules from badge.svg/route.ts apply here and matter more, because
 * this text is not fixed:
 *
 *  - No external font. An SVG loaded through <img> cannot fetch resources, so
 *    it renders in whatever generic family the viewer has.
 *  - Because the real font is therefore unknown, every run pins its width with
 *    textLength + lengthAdjust. For fixed copy you can measure once; here the
 *    value changes whenever the data does, so the width is ESTIMATED from the
 *    character mix and the box is sized from that same estimate. The estimate
 *    being imperfect is fine — it makes the badge slightly wide or narrow. It
 *    cannot make text overflow, because the glyphs are forced to the width the
 *    box was built around.
 *
 * The drawing itself is plain ESM (statBadgeSvg.mjs) so a Node script can
 * write the same SVG to public/ (scripts/import-access-reports.mjs writes
 * public/badges/access/*.svg with it).
 */

import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";

export { statBadge } from "./statBadgeSvg.mjs";

/**
 * The status and openness badges (/badges/api/*, /badges/openness/*) are
 * force-static files written at build, so they take the site's machine-file
 * policy (src/lib/machineHeaders.ts): a client may reuse a copy for an hour
 * and serve it for a day while it revalidates. Their countdown text names the
 * day it was computed, so a cached copy can be old but never claims to be new.
 */
export function machineBadgeResponse(svg: string): Response {
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": MACHINE_CACHE_CONTROL },
  });
}

export function badgeResponse(svg: string): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Not immutable: the value changes when the data does. An hour is short
      // enough to stay honest and long enough to survive a README's traffic.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
