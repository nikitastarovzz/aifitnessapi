#!/usr/bin/env node
/**
 * Bundle the published datasets into every package that ships them.
 *
 * The server could fetch these from aifitnessapi.com at runtime, but bundling
 * wins on three counts that matter more than freshness: the server works with
 * no network, an answer is reproducible for a pinned package version, and a
 * citation to 0.1.0 keeps meaning what 0.1.0 said. The site URL travels with
 * every record regardless, so a model answering from this data still points
 * the user at the page that carries the sourced claim.
 *
 * Two packages carry the same data for different audiences — the MCP server
 * answers questions, the data package is imported as a library — and both
 * must stay byte-identical to public/datasets. One script owns both copies so
 * they cannot drift apart, which they would within a release or two if each
 * package bundled its own.
 *
 * Run from the repo root after scripts/build-datasets.mjs:
 *   node scripts/bundle-package-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SRC = join(ROOT, "public", "datasets");
const OUTS = [join(ROOT, "mcp", "data"), join(ROOT, "packages", "health-data", "data")];

const WANTED = [
  "healthkit-type-identifiers-2026",
  "health-data-type-matrix-2026",
  "fitness-api-changes-2026",
  "fitness-api-glossary-2026",
];

for (const out of OUTS) mkdirSync(out, { recursive: true });

let total = 0;
for (const slug of WANTED) {
  const p = join(SRC, `${slug}.json`);
  if (!existsSync(p)) {
    console.error(`✗ missing ${p} — run scripts/build-datasets.mjs first`);
    process.exit(1);
  }
  const doc = JSON.parse(readFileSync(p, "utf8"));
  if (!Array.isArray(doc.items) || doc.items.length === 0) {
    console.error(`✗ ${slug} has no items`);
    process.exit(1);
  }
  const bytes = JSON.stringify(doc);
  for (const out of OUTS) writeFileSync(join(out, `${slug}.json`), bytes);
  total += doc.items.length;
  console.log(`  ${slug}: ${doc.items.length} rows`);
}
console.log(`✓ bundled ${WANTED.length} datasets (${total} rows) into ${OUTS.length} packages`);
