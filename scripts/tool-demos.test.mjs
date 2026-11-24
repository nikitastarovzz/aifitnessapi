/**
 * scripts/record-tool-demos.mjs (ops/TOOL-DEMOS.md): the demo list points at
 * pages that exist, the formats are the posting sizes, and clips can only be
 * written under .cache/. Recording itself is owner-run and not done here.
 *
 *   node --test scripts/tool-demos.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { DEMOS, FORMATS, MAX_SECONDS, MIN_SECONDS, mp4Args } from "./record-tool-demos.mjs";

const root = new URL("..", import.meta.url);

test("every demo opens a page that exists and has steps", () => {
  assert.ok(DEMOS.length >= 6 && DEMOS.length <= 8);
  const ids = new Set();
  for (const d of DEMOS) {
    assert.ok(!ids.has(d.id), d.id);
    ids.add(d.id);
    const pathname = new URL(d.path, "https://x.example").pathname;
    assert.ok(fs.existsSync(new URL(`src/app${pathname}/page.tsx`, root)), `${d.path} has a page`);
    assert.ok(d.steps.length > 0 && d.steps.every(([name, fn]) => typeof name === "string" && typeof fn === "function"), d.id);
    assert.ok(d.title.length > 20 && d.title.length < 200, d.id);
  }
});

test("formats are the posting sizes, scaled from a phone and a laptop viewport", () => {
  assert.deepEqual(FORMATS.portrait.size, { width: 1080, height: 1920 });
  assert.deepEqual(FORMATS.landscape.size, { width: 1920, height: 1080 });
  for (const f of Object.values(FORMATS)) assert.equal(f.size.width / f.viewport.width, f.size.height / f.viewport.height, "scaled without distortion");
  assert.equal(MIN_SECONDS, 20);
  assert.equal(MAX_SECONDS, 30);
  const args = mp4Args("a.webm", "a.mp4", FORMATS.portrait.size);
  assert.ok(args.includes("scale=1080:1920:flags=lanczos") && args.includes("libx264") && args.includes("yuv420p"));
});

test("clips can only go under .cache/, which git ignores", () => {
  const out = () =>
    execFileSync(process.execPath, ["scripts/record-tool-demos.mjs", "--out", "public/clips", "--only", "daily"], {
      cwd: new URL(".", root),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  assert.throws(out, /must be under \.cache/);
  assert.ok(fs.readFileSync(new URL(".gitignore", root), "utf8").split("\n").includes(".cache/"));
});
