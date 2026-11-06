#!/usr/bin/env node
/**
 * The poster of the visual history of fitness and health APIs (/history,
 * ops/VIRAL-20-2026-11-06.md item 10).
 *
 *   node scripts/build-history.mjs [--force]
 *
 * Writes:
 *   public/history/fitness-api-history.svg   the timeline with a title block and footer, drawn by
 *                                            src/lib/historyCore.mjs (the same drawing /history inlines)
 *   public/history/fitness-api-history.png   the same SVG rendered at 2x by Playwright's Chromium,
 *                                            as scripts/build-atlas.mjs prints the atlas
 *
 * Inputs: src/data/graveyard.ts and src/data/changes.ts, imported directly
 * (Node strips their types). Run it after either changes; qa's HISTORY-STALE
 * fails when a dated graveyard or tracker record is missing from the SVG, and
 * HISTORY-FILE when a file is missing or over 2 MB. The SVG is byte-identical
 * for identical inputs; the PNG is rewritten only when the SVG changed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { historyModel, historySvg } from "../src/lib/historyCore.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/history");
const SVG = path.join(OUT, "fitness-api-history.svg");
const PNG = path.join(OUT, "fitness-api-history.png");
const MAX = 2 * 1024 * 1024;

const { GRAVEYARD } = await import(new URL("../src/data/graveyard.ts", import.meta.url).href);
const { CHANGE_EVENTS } = await import(new URL("../src/data/changes.ts", import.meta.url).href);
const model = historyModel({ graveyard: GRAVEYARD, changes: CHANGE_EVENTS });
const svg = historySvg(model, { poster: true });

fs.mkdirSync(OUT, { recursive: true });
const before = fs.existsSync(SVG) ? fs.readFileSync(SVG, "utf8") : null;
if (before !== svg || !fs.existsSync(PNG) || process.argv.includes("--force")) {
  fs.writeFileSync(SVG, svg);
  const [, w, h] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg).map(Number);
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;padding:0;background:#fff}svg{display:block}</style></head><body>${svg}</body></html>`);
  const png = await page.locator("svg").screenshot({ type: "png" });
  await browser.close();
  fs.writeFileSync(PNG, png);
}

for (const f of [SVG, PNG]) {
  const n = fs.statSync(f).size;
  if (n > MAX) {
    console.error(`✗ build-history: ${path.relative(ROOT, f)} is ${n} bytes, over the 2 MB limit`);
    process.exit(1);
  }
  console.log(`build-history: ${path.relative(ROOT, f)} ${n} bytes`);
}
console.log(
  `build-history: ${model.marks.length} dated marks (${model.kinds.map((k) => `${k.count} ${k.id}`).join(", ")}), ${model.undated.length} undated, ${model.vendors.length} vendors; data as of ${model.asOf}${before === svg ? " (SVG unchanged)" : ""}`,
);
