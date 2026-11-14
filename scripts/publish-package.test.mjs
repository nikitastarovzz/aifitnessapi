/**
 * Tests for the pure parts of scripts/publish-package.mjs: the content hash,
 * the publish decision and the patch bump. No npm, no network.
 *
 *   node --test scripts/publish-package.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { contentHash, decide, nextPatch } from "./publish-package.mjs";

const pkg = (version, extra = {}) =>
  JSON.stringify({ name: "@x/y", version, files: ["src"], ...extra }, null, 2);
const server = (version) =>
  JSON.stringify({ name: "x/y", version, packages: [{ identifier: "@x/y", version }] });

function tree(overrides = {}) {
  const files = {
    "package.json": pkg("0.1.0"),
    "server.json": server("0.1.0"),
    "src/index.js": "export const a = 1;\n",
    "README.md": "# y\n",
    ...overrides,
  };
  return [Object.keys(files), (p) => Buffer.from(files[p])];
}

test("hash is stable across a version change", () => {
  const a = contentHash(...tree());
  const b = contentHash(...tree({ "package.json": pkg("0.4.7"), "server.json": server("0.4.7") }));
  assert.equal(a, b);
});

test("hash ignores the recorded content hash and package.json formatting", () => {
  const a = contentHash(...tree());
  const b = contentHash(...tree({ "package.json": JSON.stringify({ name: "@x/y", version: "0.2.0", files: ["src"], aifitnessapi: { contentHash: "sha256:abc" } }) }));
  assert.equal(a, b);
});

test("hash does not depend on the order the file list arrives in", () => {
  const [files, read] = tree();
  assert.equal(contentHash(files, read), contentHash([...files].reverse(), read));
});

test("hash changes when any packed file's bytes change", () => {
  const base = contentHash(...tree());
  assert.notEqual(base, contentHash(...tree({ "src/index.js": "export const a = 2;\n" })));
  assert.notEqual(base, contentHash(...tree({ "README.md": "# y \n" })));
  assert.notEqual(base, contentHash(...tree({ "package.json": pkg("0.1.0", { description: "new" }) })));
  assert.notEqual(base, contentHash(...tree({ "server.json": JSON.stringify({ name: "x/z", version: "0.1.0" }) })));
});

test("hash changes when a file is added or renamed", () => {
  const base = contentHash(...tree());
  assert.notEqual(base, contentHash(...tree({ "src/extra.js": "" })));
  const [files, read] = tree();
  const renamed = files.map((f) => (f === "README.md" ? "README.markdown" : f));
  assert.notEqual(base, contentHash(renamed, (p) => read(p === "README.markdown" ? "README.md" : p)));
});

test("never published: publish the version package.json carries", () => {
  const d = decide({ localVersion: "0.1.0", localHash: "sha256:a", registry: null });
  assert.deepEqual([d.action, d.version], ["publish", "0.1.0"]);
});

test("published with the same hash: nothing to do", () => {
  const d = decide({ localVersion: "0.1.0", localHash: "sha256:a", registry: { version: "0.1.3", contentHash: "sha256:a" } });
  assert.deepEqual([d.action, d.version], ["unchanged", "0.1.3"]);
});

test("published with a different hash: next patch after the registry's latest", () => {
  const d = decide({ localVersion: "0.1.0", localHash: "sha256:b", registry: { version: "0.1.3", contentHash: "sha256:a" } });
  assert.deepEqual([d.action, d.version], ["publish", "0.1.4"]);
});

test("published with no recorded hash counts as different", () => {
  const d = decide({ localVersion: "0.1.0", localHash: "sha256:b", registry: { version: "0.1.0", contentHash: null } });
  assert.deepEqual([d.action, d.version], ["publish", "0.1.1"]);
});

test("a deliberate bump in package.json past the registry is kept", () => {
  const d = decide({ localVersion: "0.2.0", localHash: "sha256:b", registry: { version: "0.1.3", contentHash: "sha256:a" } });
  assert.deepEqual([d.action, d.version], ["publish", "0.2.0"]);
});

test("patch bump is numeric, not lexical", () => {
  assert.equal(nextPatch("0.1.9"), "0.1.10");
  assert.equal(nextPatch("1.0.0"), "1.0.1");
});

test("a non-semver registry version is refused", () => {
  assert.throws(() => nextPatch("0.1"), /not a plain x\.y\.z/);
  assert.throws(() => nextPatch("0.1.0-beta.1"), /not a plain x\.y\.z/);
  assert.throws(
    () => decide({ localVersion: "0.1.0", localHash: "sha256:b", registry: { version: "latest", contentHash: "sha256:a" } }),
    /not a plain x\.y\.z/,
  );
});
