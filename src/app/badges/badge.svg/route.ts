/**
 * The "Listed on AIFitnessAPI" badge, served as SVG so it stays crisp at any
 * density and weighs under a kilobyte.
 *
 * Two rules this file exists to respect:
 * - No external font. An SVG that references a webfont renders with whatever
 *   the viewer happens to have, or nothing at all, because an <img>-embedded
 *   SVG cannot load resources. Generic families only.
 * - Because the actual font is therefore unknown, every text run carries
 *   `textLength` + `lengthAdjust="spacingAndGlyphs"`, which pins its width.
 *   The badge cannot overflow its box on a machine with different metrics.
 *
 * Colour is the site brand emerald (--color-brand-600 / -900 in globals.css).
 */
export const dynamic = "force-static";

const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" viewBox="0 0 200 40" role="img" aria-label="Listed on AIFitnessAPI">
  <title>Listed on AIFitnessAPI</title>
  <rect width="200" height="40" rx="10" fill="#059669"/>
  <rect x="10" y="10" width="20" height="20" rx="5" fill="#ffffff"/>
  <text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-size="11" font-weight="700" fill="#059669" textLength="13" lengthAdjust="spacingAndGlyphs">AF</text>
  <text x="40" y="17" font-family="${FONT}" font-size="9" font-weight="600" fill="#a7f3d0" textLength="52" lengthAdjust="spacingAndGlyphs">LISTED ON</text>
  <text x="40" y="31" font-family="${FONT}" font-size="14" font-weight="700" fill="#ffffff" textLength="128" lengthAdjust="spacingAndGlyphs">AIFitnessAPI</text>
</svg>
`;

export function GET(): Response {
  return new Response(SVG, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Immutable: the badge artwork is a fixed asset. If it ever changes,
      // change the URL rather than waiting out a cache.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
