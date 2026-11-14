#!/usr/bin/env node
/**
 * Fills a checkout of the standalone dataset repository from this one
 * (ops/DISTRIBUTION.md section 2). Run by .github/workflows/dataset-mirror.yml
 * on every change to public/datasets/.
 *
 * Why a separate repository at all. public/datasets/ is already CC BY 4.0
 * and served by the site, but a dataset that lives inside a website's source
 * tree is hard to depend on: a project that wants the HealthKit identifiers
 * would have to clone the whole site to pin them. A repository that holds
 * only the data can be pinned by commit, linked file by file, and cited.
 *
 * What it writes into <dir>, and nothing else:
 *
 *   data/         every file of public/datasets/, byte for byte; files under
 *                 data/ that no longer exist in the source are removed
 *   README.md     scripts/templates/dataset-repo-README.md, with the dataset
 *                 table and every number read from public/datasets/manifest.json
 *                 and the files themselves, never typed
 *   LICENSE       the CC BY 4.0 statement and the canonical legal-code URL
 *                 (the licence text itself is not pasted from memory)
 *   CITATION.cff  copied from the repository root, where build-datasets.mjs
 *                 generates it
 *
 * Everything else in <dir> is left alone, .git above all, so the same command
 * works on a fresh empty directory and on an existing checkout.
 *
 * Deterministic: same input, byte-identical output. No timestamps; the only
 * date in the README is the manifest's own `generated` field.
 *
 * Short reads fail. A dataset is a manifest entry with a .json file (a CSV
 * beside it shares its stem); the run exits non-zero, writing nothing, when
 * the manifest lists fewer than MIN_DATASETS of them, when a listed file is
 * missing or does not match its manifest size and SHA-256, when a dataset has
 * no CSV or card, or when its JSON and CSV row counts disagree. A stale
 * manifest would put wrong numbers in the README, so it is treated the same
 * as a missing file: run `npm run datasets` in this repository first.
 *
 * Usage:
 *   node scripts/mirror-datasets.mjs --out <dir>
 *   node scripts/mirror-datasets.mjs --out <dir> --src <repo root>   # tests
 *
 * Prints one line per file added, changed or removed, then a count.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const MIN_DATASETS = 15;
export const TEMPLATE = path.join(ROOT, "scripts/templates/dataset-repo-README.md");
const LEGALCODE = "https://creativecommons.org/licenses/by/4.0/legalcode";
const SITE = "https://aifitnessapi.com/datasets";
const SOURCE_REPO = "https://github.com/nikitastarovzz/aifitnessapi";

function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, base));
    else if (e.isFile()) out.push(path.relative(base, p).split(path.sep).join("/"));
  }
  return out.sort();
}

/** Top-level `key: value` scalars of a CFF file; enough for title/version/url. */
function cffField(text, key) {
  const m = new RegExp(`^${key}:\\s*(.+)$`, "m").exec(text);
  if (!m) return null;
  const v = m[1].trim();
  return v.startsWith('"') ? JSON.parse(v) : v;
}

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

/**
 * Reads and checks the source. Returns the full set of files to write as
 * { relativePath: Buffer }. Throws on any short read.
 */
export function plan({ srcRoot = ROOT, templatePath = TEMPLATE } = {}) {
  const dsDir = path.join(srcRoot, "public/datasets");
  const manifestPath = path.join(dsDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`no manifest at ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.files)) throw new Error("manifest.json has no files list");

  const problems = [];
  const byFile = new Map();
  for (const f of manifest.files) {
    const p = path.join(dsDir, f.file);
    if (!fs.existsSync(p)) {
      problems.push(`${f.file} is listed in the manifest but missing`);
      continue;
    }
    const buf = fs.readFileSync(p);
    if (buf.length !== f.bytes || sha256(buf) !== f.sha256) problems.push(`${f.file} does not match its manifest entry (stale manifest?)`);
    byFile.set(f.file, f);
  }

  const datasets = [];
  for (const f of [...manifest.files].sort((a, b) => a.file.localeCompare(b.file))) {
    if (!f.file.endsWith(".json")) continue;
    const stem = f.file.slice(0, -".json".length);
    const csv = manifest.files.find((x) => x.file === `${stem}.csv`);
    const card = `${stem}.md`;
    if (!csv) problems.push(`${f.file} has no ${stem}.csv in the manifest`);
    else if (csv.rows !== f.rows) problems.push(`${stem}: JSON has ${f.rows} rows, CSV has ${csv.rows}`);
    if (!fs.existsSync(path.join(dsDir, card))) problems.push(`${stem} has no card ${card}`);
    if (!Number.isInteger(f.rows) || f.rows <= 0) problems.push(`${f.file}: manifest row count ${f.rows} is not a positive integer`);
    let name = stem;
    if (byFile.has(f.file)) {
      try {
        const doc = JSON.parse(fs.readFileSync(path.join(dsDir, f.file), "utf8"));
        if (typeof doc.name === "string" && doc.name.trim()) name = doc.name.trim();
        else problems.push(`${f.file} has no name field`);
        if (Array.isArray(doc.items) && doc.items.length !== f.rows) problems.push(`${f.file}: ${doc.items.length} items, manifest says ${f.rows}`);
      } catch (e) {
        problems.push(`${f.file} does not parse: ${e.message}`);
      }
    }
    datasets.push({ stem, name, rows: f.rows, csv: Boolean(csv), card });
  }
  if (datasets.length < MIN_DATASETS) problems.push(`the manifest lists ${datasets.length} datasets, fewer than ${MIN_DATASETS}`);

  const citationPath = path.join(srcRoot, "CITATION.cff");
  if (!fs.existsSync(citationPath)) problems.push("CITATION.cff is missing");
  if (problems.length) throw new Error(`short read, nothing written:\n  ${problems.join("\n  ")}`);

  const citation = fs.readFileSync(citationPath);
  const cff = citation.toString("utf8");
  const title = cffField(cff, "title");
  const version = cffField(cff, "version");
  const url = cffField(cff, "url") ?? SITE;
  if (!title || !version) throw new Error("CITATION.cff has no top-level title or version");

  const md = (s) => s.replace(/\|/g, "\\|");
  const table = datasets
    .map((d) => `| ${md(d.name)} | ${d.rows} | [JSON](data/${d.stem}.json), [CSV](data/${d.stem}.csv), [card](data/${d.card}) |`)
    .join("\n");
  const others = manifest.files
    .filter((f) => !f.file.endsWith(".json") && !datasets.some((d) => f.file === `${d.stem}.csv`))
    .sort((a, b) => a.file.localeCompare(b.file));
  const otherText = others.length
    ? `\nAlso in \`data/\`, outside the table because it is not one of the generated datasets: ${others
        .map((f) => `[\`${f.file}\`](data/${f.file}) (${f.rows} rows)`)
        .join(", ")}.\n`
    : "";

  const template = fs.readFileSync(templatePath, "utf8");
  const values = {
    TITLE: title,
    DATASET_COUNT: String(datasets.length),
    MANIFEST_GENERATED: String(manifest.generated ?? "on an unrecorded date"),
    DATASET_TABLE: table,
    OTHER_FILES: otherText,
    CITATION_LINE: `AIFitnessAPI. *${title}*, version ${version}. ${url}. Licensed CC BY 4.0.`,
  };
  const readme = template.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => {
    if (!(k in values)) throw new Error(`template placeholder ${m} has no value`);
    return values[k];
  });

  const license = [
    `${title}`,
    "",
    "The datasets in data/ are licensed under the Creative Commons Attribution",
    "4.0 International License (CC BY 4.0).",
    "",
    `Legal code: ${LEGALCODE}`,
    "",
    `Attribution: AIFitnessAPI, ${SITE}`,
    `Source: ${SOURCE_REPO} (public/datasets)`,
    "",
  ].join("\n");

  const files = {};
  for (const rel of walk(dsDir)) files[`data/${rel}`] = fs.readFileSync(path.join(dsDir, rel));
  files["README.md"] = Buffer.from(readme);
  files["LICENSE"] = Buffer.from(license);
  files["CITATION.cff"] = citation;
  return files;
}

/** Writes the plan into outDir. Returns { added, changed, removed } path lists. */
export function mirror({ outDir, srcRoot = ROOT, templatePath = TEMPLATE }) {
  const files = plan({ srcRoot, templatePath });
  const added = [];
  const changed = [];
  const removed = [];
  fs.mkdirSync(outDir, { recursive: true });

  // Removal is confined to data/: nothing outside it is ever deleted.
  const dataDir = path.join(outDir, "data");
  for (const rel of walk(dataDir)) {
    const key = `data/${rel}`;
    if (!(key in files)) {
      fs.rmSync(path.join(dataDir, rel));
      removed.push(key);
    }
  }
  // Prune directories under data/ that the removals left empty.
  const prune = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(dir, e.name));
    if (dir !== dataDir && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  };
  prune(dataDir);

  for (const key of Object.keys(files).sort()) {
    const dest = path.join(outDir, key);
    const exists = fs.existsSync(dest);
    if (exists && fs.readFileSync(dest).equals(files[key])) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, files[key]);
    (exists ? changed : added).push(key);
  }
  return { added, changed, removed };
}

function main() {
  const args = process.argv.slice(2);
  const opt = (name) => {
    const i = args.indexOf(name);
    return i === -1 ? null : args[i + 1];
  };
  const out = opt("--out");
  if (!out) {
    console.error("usage: node scripts/mirror-datasets.mjs --out <dir> [--src <repo root>]");
    process.exit(2);
  }
  const src = opt("--src");
  const r = mirror({ outDir: path.resolve(out), srcRoot: src ? path.resolve(src) : ROOT });
  for (const p of r.added) console.log(`added    ${p}`);
  for (const p of r.changed) console.log(`changed  ${p}`);
  for (const p of r.removed) console.log(`removed  ${p}`);
  console.log(`${r.added.length} added, ${r.changed.length} changed, ${r.removed.length} removed`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    console.error(`mirror-datasets: ${e.message}`);
    process.exit(1);
  }
}
