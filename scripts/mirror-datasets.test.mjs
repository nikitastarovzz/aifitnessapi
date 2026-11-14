/**
 * Tests for scripts/mirror-datasets.mjs, on a small fixture source tree in a
 * temporary directory (the real template, fixture datasets).
 *
 *   node --test scripts/mirror-datasets.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { mirror, MIN_DATASETS } from "./mirror-datasets.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "mirror-datasets-"));
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");

/** A source repo root with `n` datasets, each JSON + CSV + card. */
function fixture(n = MIN_DATASETS) {
  const root = tmp();
  const ds = path.join(root, "public/datasets");
  fs.mkdirSync(ds, { recursive: true });
  const files = [];
  const put = (name, text, rows) => {
    fs.writeFileSync(path.join(ds, name), text);
    if (rows !== undefined) files.push({ file: name, bytes: Buffer.byteLength(text), rows, sha256: sha(Buffer.from(text)) });
  };
  for (let i = 0; i < n; i++) {
    const stem = `set-${String(i).padStart(2, "0")}`;
    const rows = i + 1;
    const items = Array.from({ length: rows }, (_, k) => ({ k }));
    put(`${stem}.json`, JSON.stringify({ name: `Set ${i}`, items }), rows);
    put(`${stem}.csv`, `k\n${items.map((x) => x.k).join("\n")}\n`, rows);
    put(`${stem}.md`, `# Set ${i}\n`);
  }
  fs.writeFileSync(path.join(ds, "manifest.json"), JSON.stringify({ generated: "2026-01-01", files }, null, 2));
  fs.writeFileSync(path.join(root, "CITATION.cff"), 'cff-version: 1.2.0\ntitle: "Fixture Datasets"\nversion: "2026.1"\nurl: "https://example.org/datasets"\n');
  return root;
}

function snapshot(dir) {
  const out = {};
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out[path.relative(dir, p)] = fs.readFileSync(p).toString("base64");
    }
  };
  walk(dir);
  return out;
}

test("output is deterministic: a second run changes nothing, a fresh run is byte-identical", () => {
  const src = fixture();
  const a = tmp();
  const b = tmp();
  const first = mirror({ outDir: a, srcRoot: src });
  assert.ok(first.added.includes("README.md") && first.added.includes("LICENSE") && first.added.includes("CITATION.cff"));
  assert.ok(first.added.includes("data/manifest.json"));
  const again = mirror({ outDir: a, srcRoot: src });
  assert.deepEqual(again, { added: [], changed: [], removed: [] });
  mirror({ outDir: b, srcRoot: src });
  assert.deepEqual(snapshot(a), snapshot(b));
});

test("README numbers come from the manifest", () => {
  const src = fixture();
  const out = tmp();
  mirror({ outDir: out, srcRoot: src });
  const readme = fs.readFileSync(path.join(out, "README.md"), "utf8");
  assert.match(readme, new RegExp(`only the data, ${MIN_DATASETS} datasets`));
  assert.match(readme, /\| Set 14 \| 15 \|/);
  assert.match(readme, /generated 2026-01-01/);
  assert.doesNotMatch(readme, /\{\{/);
  assert.match(fs.readFileSync(path.join(out, "LICENSE"), "utf8"), /https:\/\/creativecommons\.org\/licenses\/by\/4\.0\/legalcode/);
});

test("stale files are removed from data/ only; .git and unrelated files are untouched", () => {
  const src = fixture();
  const out = tmp();
  fs.mkdirSync(path.join(out, ".git/objects"), { recursive: true });
  fs.writeFileSync(path.join(out, ".git/HEAD"), "ref: refs/heads/main\n");
  fs.writeFileSync(path.join(out, ".git/objects/old.json"), "{}");
  fs.writeFileSync(path.join(out, "NOTES.md"), "keep me\n");
  fs.mkdirSync(path.join(out, "data/nested"), { recursive: true });
  fs.writeFileSync(path.join(out, "data/gone-2025.json"), "{}");
  fs.writeFileSync(path.join(out, "data/nested/gone.csv"), "x\n");
  fs.mkdirSync(path.join(out, "other"), { recursive: true });
  fs.writeFileSync(path.join(out, "other/gone-2025.json"), "{}");

  const r = mirror({ outDir: out, srcRoot: src });
  assert.deepEqual(r.removed.sort(), ["data/gone-2025.json", "data/nested/gone.csv"]);
  assert.equal(fs.existsSync(path.join(out, "data/gone-2025.json")), false);
  assert.equal(fs.existsSync(path.join(out, "data/nested")), false);
  assert.equal(fs.readFileSync(path.join(out, ".git/HEAD"), "utf8"), "ref: refs/heads/main\n");
  assert.equal(fs.readFileSync(path.join(out, ".git/objects/old.json"), "utf8"), "{}");
  assert.equal(fs.readFileSync(path.join(out, "NOTES.md"), "utf8"), "keep me\n");
  assert.equal(fs.readFileSync(path.join(out, "other/gone-2025.json"), "utf8"), "{}");
});

test("a changed source file is reported as changed and copied byte for byte", () => {
  const src = fixture();
  const out = tmp();
  mirror({ outDir: out, srcRoot: src });
  fs.writeFileSync(path.join(src, "public/datasets/set-00.md"), "# Set 0, revised\n");
  const r = mirror({ outDir: out, srcRoot: src });
  assert.deepEqual(r, { added: [], changed: ["data/set-00.md"], removed: [] });
  assert.equal(fs.readFileSync(path.join(out, "data/set-00.md"), "utf8"), "# Set 0, revised\n");
});

test("short read: fewer datasets than the minimum fails and writes nothing", () => {
  const src = fixture(MIN_DATASETS - 1);
  const out = tmp();
  assert.throws(() => mirror({ outDir: out, srcRoot: src }), /fewer than 15/);
  assert.deepEqual(fs.readdirSync(out), []);
});

test("short read: a file the manifest lists but the source lacks fails and writes nothing", () => {
  const src = fixture();
  fs.rmSync(path.join(src, "public/datasets/set-03.csv"));
  const out = tmp();
  fs.writeFileSync(path.join(out, "README.md"), "old\n");
  assert.throws(() => mirror({ outDir: out, srcRoot: src }), /set-03\.csv is listed in the manifest but missing/);
  assert.deepEqual(fs.readdirSync(out), ["README.md"]);
  assert.equal(fs.readFileSync(path.join(out, "README.md"), "utf8"), "old\n");
});

test("a file that no longer matches its manifest entry fails as a stale manifest", () => {
  const src = fixture();
  fs.appendFileSync(path.join(src, "public/datasets/set-05.json"), " ");
  assert.throws(() => mirror({ outDir: tmp(), srcRoot: src }), /set-05\.json does not match its manifest entry/);
});
