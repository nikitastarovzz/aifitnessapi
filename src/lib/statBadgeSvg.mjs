/**
 * The "label | value" badge drawing behind every README badge on this site
 * (src/lib/statBadge.ts re-exports it for the /badges routes). Plain ESM with
 * no imports, so a Node script can write the same SVG to a file:
 * scripts/import-access-reports.mjs writes public/badges/access/<vendor>.svg
 * with it. The rules it keeps are documented in statBadge.ts: no external
 * font, and every text run pinned to the width its box was built around.
 */

const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Rough advance widths at font-size 1, for a bold humanist sans.
 * @param {string} s
 * @param {number} size
 * @returns {number}
 */
function textWidth(s, size) {
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

/** @param {string} s */
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * @param {string} label
 * @param {string} value
 * @param {string} [color]
 * @returns {string}
 */
export function statBadge(label, value, color = "#059669") {
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
    <rect x="${lw}" width="${vw}" height="${H}" fill="${color}"/>
  </g>
  <g font-family="${FONT}" font-size="${SIZE}" font-weight="600" fill="#ffffff">
    <text x="${PAD}" y="${H / 2}" dominant-baseline="central" textLength="${lw - PAD * 2}" lengthAdjust="spacingAndGlyphs">${escape(label)}</text>
    <text x="${lw + PAD}" y="${H / 2}" dominant-baseline="central" font-weight="700" textLength="${vw - PAD * 2}" lengthAdjust="spacingAndGlyphs">${escape(value)}</text>
  </g>
</svg>
`;
}
