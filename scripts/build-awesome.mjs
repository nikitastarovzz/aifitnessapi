#!/usr/bin/env node
/**
 * AWESOME.md, the awesome-fitness-apis list (ops/VIRAL-20-2026-11-06.md item 11).
 *
 *   node scripts/build-awesome.mjs           write AWESOME.md
 *   node scripts/build-awesome.mjs --check   exit 1 if AWESOME.md is stale
 *
 * Reads the same modules the /awesome page reads, through Node's type
 * stripping (each has no imports): src/data/costModel.ts (the directory,
 * minus the EXCLUDED ids src/data/apis.ts declares), src/data/libraries.ts,
 * src/data/mcpHealthServers.ts and src/lib/toolRegistry.ts; plus the
 * dataset files in public/datasets and the library group labels in
 * src/data/librariesEditorial.ts (read as text: that module imports through
 * the "@/" alias, which plain Node cannot resolve). src/lib/awesomeList.mjs
 * turns them into the list, so the page and this file cannot disagree; qa's
 * AWESOME-STALE gate runs the same render and compares, and AWESOME-PAGE
 * checks the built /awesome.md carries every line.
 *
 * Run it after any of those inputs changes (the libraries and MCP workflows
 * run it after regenerating their modules).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { awesomeMarkdown, awesomeModel } from "../src/lib/awesomeList.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "AWESOME.md");
export const SITE_URL = "https://aifitnessapi.com";

const imp = (rel) => import(new URL(`../${rel}`, import.meta.url).href);

/** The ids src/data/apis.ts keeps out of the directory. */
export function excludedApiIds(root = ROOT) {
  const src = fs.readFileSync(path.join(root, "src/data/apis.ts"), "utf8");
  const m = /const EXCLUDED = new Set\(\[([^\]]*)\]\)/.exec(src);
  if (!m) throw new Error("build-awesome: could not read EXCLUDED from src/data/apis.ts");
  return new Set([...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
}

/** LIBRARY_GROUPS' ids and labels, in order. */
export function libraryGroups(root = ROOT) {
  const src = fs.readFileSync(path.join(root, "src/data/librariesEditorial.ts"), "utf8");
  const start = src.indexOf("export const LIBRARY_GROUPS");
  const end = src.indexOf("];", start);
  if (start < 0 || end < 0) throw new Error("build-awesome: could not find LIBRARY_GROUPS");
  const groups = [...src.slice(start, end).matchAll(/id: "([^"]+)",\s*label: "([^"]+)"/g)].map((m) => ({ id: m[1], label: m[2] }));
  if (groups.length < 4) throw new Error(`build-awesome: read ${groups.length} library groups, expected at least 4`);
  return groups;
}

/** The published datasets: every <slug>.json in public/datasets with an `items` array. */
export function datasets(root = ROOT) {
  const dir = path.join(root, "public/datasets");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("manifest"))
    .sort()
    .map((f) => {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      return Array.isArray(d.items) && d.name ? { slug: f.replace(/\.json$/, ""), name: d.name, license: d.license ?? "CC BY 4.0" } : null;
    })
    .filter(Boolean);
}

export async function model() {
  const [{ COST_ITEMS, CATEGORY_ORDER, CATEGORY_LABELS, DEV_COST_LABELS }, { LIBRARIES, LIBRARIES_FETCHED_ON }, mcp, { ALL_TOOLS }] = await Promise.all([
    imp("src/data/costModel.ts"),
    imp("src/data/libraries.ts"),
    imp("src/data/mcpHealthServers.ts"),
    imp("src/lib/toolRegistry.ts"),
  ]);
  const excluded = excludedApiIds();
  return awesomeModel({
    siteUrl: SITE_URL,
    apis: COST_ITEMS.filter((i) => !excluded.has(i.id)),
    categoryOrder: CATEGORY_ORDER,
    categoryLabels: CATEGORY_LABELS,
    devCostLabels: DEV_COST_LABELS,
    libraries: LIBRARIES,
    libraryGroups: libraryGroups(),
    librariesFetchedOn: LIBRARIES_FETCHED_ON,
    mcpServers: mcp.MCP_HEALTH_SERVERS,
    mcpGroups: mcp.MCP_SERVER_GROUPS,
    mcpFetchedOn: mcp.MCP_SERVERS_FETCHED_ON,
    datasets: datasets(),
    tools: ALL_TOOLS,
  });
}

export async function render() {
  return awesomeMarkdown(await model());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const next = await render();
  if (process.argv.includes("--check")) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
    if (cur !== next) {
      console.error("✗ AWESOME.md is stale: run node scripts/build-awesome.mjs");
      process.exit(1);
    }
    console.log("AWESOME.md is current");
  } else {
    fs.writeFileSync(OUT, next);
    const m = await model();
    console.log(`build-awesome: wrote AWESOME.md, ${m.count} entries in ${m.sections.length} sections (${Buffer.byteLength(next)} bytes)`);
  }
}
