#!/usr/bin/env node
/**
 * The printable Fitness API Atlas (/atlas, ops/AUDIENCE-30-2026-11-05.md item 30).
 *
 *   npm run datasets && node scripts/build-atlas.mjs
 *
 * Writes:
 *   public/atlas/fitness-api-atlas.svg   the poster, drawn from the data by scripts/lib/atlas.mjs
 *   public/atlas/fitness-api-atlas.pdf   the same SVG printed to an A2 page by Playwright's Chromium,
 *                                        as scripts/build-icons.mjs does for the icons
 *
 * Inputs: public/datasets/fitness-apis-2026.json (the directory),
 * public/datasets/fitness-api-changes-2026.json (the changes tracker), and
 * src/data/graveyard.ts (imported directly; Node strips its types). Run it
 * after either dataset or the graveyard changes; qa's ATLAS gate fails when a
 * directory product or graveyard entry is missing from the SVG, or a file is
 * over 2 MB. The SVG is byte-identical for identical inputs; the PDF is
 * rewritten only when the SVG changed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { atlasModel, atlasSvg } from "./lib/atlas.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/atlas");
const SVG = path.join(OUT, "fitness-api-atlas.svg");
const PDF = path.join(OUT, "fitness-api-atlas.pdf");
const MAX = 2 * 1024 * 1024;

const { GRAVEYARD } = await import(new URL("../src/data/graveyard.ts", import.meta.url).href);
const model = atlasModel({ root: ROOT, graveyard: GRAVEYARD });
const svg = atlasSvg(model);

fs.mkdirSync(OUT, { recursive: true });
const before = fs.existsSync(SVG) ? fs.readFileSync(SVG, "utf8") : null;
if (before !== svg || !fs.existsSync(PDF) || process.argv.includes("--force")) {
  fs.writeFileSync(SVG, svg);
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html><head><style>@page{size:420mm 594mm;margin:0}html,body{margin:0;padding:0}svg{display:block;width:420mm;height:594mm}</style></head><body>${svg}</body></html>`,
  );
  const pdf = await page.pdf({ width: "420mm", height: "594mm", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  fs.writeFileSync(PDF, pdf);
}

for (const f of [SVG, PDF]) {
  const n = fs.statSync(f).size;
  if (n > MAX) {
    console.error(`✗ build-atlas: ${path.relative(ROOT, f)} is ${n} bytes, over the 2 MB limit`);
    process.exit(1);
  }
  console.log(`build-atlas: ${path.relative(ROOT, f)} ${n} bytes`);
}
console.log(
  `build-atlas: ${model.total} products in ${model.categories.length} categories, ${model.shutdowns.length} graveyard entries, ${model.recent.length} confirmed changes; data as of ${model.asOf}${before === svg ? " (SVG unchanged)" : ""}`,
);
