/**
 * Raster icons from the one source mark, src/app/icon.svg.
 * ops/SERP-30-2026-10-12.md #7 and #8.
 *
 *   node scripts/build-icons.mjs
 *
 * Writes:
 *   public/favicon.ico     16, 32 and 48 px PNGs in one ICO container. Browsers
 *                          take the SVG from the <link rel="icon"> tag, but Bing,
 *                          many link-preview clients and older browsers ask for
 *                          /favicon.ico directly, and it answered 404.
 *   public/icon-192.png    the manifest's install icons, which a launcher wants
 *   public/icon-512.png    as raster PNGs at these two sizes
 *   public/logo.png        512 px, the Organization logo in the JSON-LD (Google
 *                          asks for at least 112 px, crawlable, raster or SVG;
 *                          a PNG is the safe choice)
 *
 * Rendering uses the Chromium that Playwright drives (pre-installed in the
 * cloud environment), so the mark is drawn by a real browser from the SVG
 * itself rather than redrawn by hand. Run it again whenever icon.svg changes.
 */
import fs from "node:fs";
import { chromium } from "playwright";

const SVG = fs.readFileSync("src/app/icon.svg", "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function render(px) {
  await page.setViewportSize({ width: px, height: px });
  const svg = SVG.replace(/width="\d+"/, `width="${px}"`).replace(/height="\d+"/, `height="${px}"`);
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`,
  );
  return page.locator("svg").screenshot({ omitBackground: true, type: "png" });
}

/** An ICO whose entries are PNG images (supported since Windows Vista and by
 *  every current browser): a 6-byte header, a 16-byte directory entry per
 *  image, then the PNG bytes. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ px, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(px >= 256 ? 0 : px, 0); // width (0 means 256)
    e.writeUInt8(px >= 256 ? 0 : px, 1); // height
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const small = [];
for (const px of [16, 32, 48]) small.push({ px, png: await render(px) });
fs.writeFileSync("public/favicon.ico", ico(small));
fs.writeFileSync("public/icon-192.png", await render(192));
const big = await render(512);
fs.writeFileSync("public/icon-512.png", big);
fs.writeFileSync("public/logo.png", big);
await browser.close();

for (const f of ["public/favicon.ico", "public/icon-192.png", "public/icon-512.png", "public/logo.png"]) {
  console.log(`build-icons: ${f} ${fs.statSync(f).size} bytes`);
}
