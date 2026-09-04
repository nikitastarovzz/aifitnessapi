/**
 * Snapshot the published datasets into a manifest, rotating the previous one,
 * so /datasets/diff.json can state what changed between regenerations without
 * needing git. Run automatically after `npm run datasets`.
 *
 * The manifest is committed output: hand-editing it lies about the files.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DIR = "public/datasets";
const MANIFEST = path.join(DIR, "manifest.json");
const PREV = path.join(DIR, "manifest-prev.json");

const files = fs
  .readdirSync(DIR)
  .filter((f) => /\.(json|csv)$/.test(f) && !f.startsWith("manifest"))
  .sort();

if (files.length === 0) {
  console.error("build-dataset-manifest: no dataset files found — refusing to write an empty manifest.");
  process.exit(1);
}

const entries = files.map((f) => {
  const buf = fs.readFileSync(path.join(DIR, f));
  let rows = null;
  if (f.endsWith(".csv")) rows = buf.toString("utf8").trim().split("\n").length - 1;
  else {
    try {
      const j = JSON.parse(buf.toString("utf8"));
      const arr = Array.isArray(j) ? j : Array.isArray(j.rows) ? j.rows : Array.isArray(j.items) ? j.items : null;
      rows = arr ? arr.length : null;
    } catch {
      rows = null;
    }
  }
  return { file: f, bytes: buf.length, rows, sha256: crypto.createHash("sha256").update(buf).digest("hex") };
});

const next = { generated: new Date().toISOString().slice(0, 10), files: entries };

if (fs.existsSync(MANIFEST)) {
  const cur = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const changed = JSON.stringify(cur.files) !== JSON.stringify(next.files);
  if (!changed) {
    console.log("build-dataset-manifest: no content change; manifest untouched.");
    process.exit(0);
  }
  fs.writeFileSync(PREV, JSON.stringify(cur, null, 2));
}
fs.writeFileSync(MANIFEST, JSON.stringify(next, null, 2));
console.log(`build-dataset-manifest: wrote manifest for ${entries.length} files.`);
