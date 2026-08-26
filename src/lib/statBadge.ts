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
 */

const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Rough advance widths at font-size 1, for a bold humanist sans. */
function textWidth(s: string, size: number): number {
  let w = 0;
  for (const ch of s) {
    if (/[ilj|.,:!']/.test(ch)) w += 0.28;
    else if (/[ftIr()[\]-]/.test(ch)) w += 0.36;
    else if (/[A-Z0-9]/.test(ch)) w += 0.62;
    else if (/[mwMW]/.test(ch)) w += 0.88;
    else w += 0.55;
  }
  return Math.ceil(w * size);
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function statBadge(label: string, value: string): string {
  const SIZE = 11;
  const PAD = 8;
  const H = 20;
  const lw = textWidth(label, SIZE) + PAD * 2;
  const vw = textWidth(value, SIZE) + PAD * 2;
  const total = lw + vw;
  const alt = `${label}: ${value}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${H}" viewBox="0 0 ${total} ${H}" role="img" aria-label="${escape(alt)}">
  <title>${escape(alt)}</title>
  <clipPath id="r"><rect width="${total}" height="${H}" rx="4"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${lw}" height="${H}" fill="#334155"/>
    <rect x="${lw}" width="${vw}" height="${H}" fill="#059669"/>
  </g>
  <g font-family="${FONT}" font-size="${SIZE}" font-weight="600" fill="#ffffff">
    <text x="${PAD}" y="${H / 2}" dominant-baseline="central" textLength="${lw - PAD * 2}" lengthAdjust="spacingAndGlyphs">${escape(label)}</text>
    <text x="${lw + PAD}" y="${H / 2}" dominant-baseline="central" font-weight="700" textLength="${vw - PAD * 2}" lengthAdjust="spacingAndGlyphs">${escape(value)}</text>
  </g>
</svg>
`;
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
