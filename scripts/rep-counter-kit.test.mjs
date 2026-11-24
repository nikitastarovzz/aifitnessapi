/**
 * public/kit/rep-counter.html, the one-file squat counter linked from
 * /tools/rep-counter-playground.
 *
 *   node --test scripts/rep-counter-kit.test.mjs
 *
 * - It is current: rendering the template from the site's modules gives the
 *   committed file byte for byte (node scripts/build-kit.mjs --only rep-counter).
 * - It parses: one doctype, html, head, body and title, every non-void tag
 *   closed in order, and the inline module compiles as JavaScript.
 * - Every URL it fetches is pinned (an exact npm version, the versioned model
 *   path), and every other URL in it is a citation on a known host.
 * - Its landmark indices are the BlazePose 33 names it says they are.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { KIT_FILE, TEMPLATE_FILE, kitValues, loadedUrls, renderRepCounter } from "../src/lib/repCounterKit.mjs";
import * as poseBenchmark from "../src/lib/poseBenchmark.ts";
import * as formRules from "../src/data/formRules.ts";
import { POSE_SCHEMES } from "../src/data/poseKeypoints.ts";
import { EXERCISES } from "../src/lib/repCounter.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = (f) => readFileSync(path.join(ROOT, f), "utf8");
const html = read(KIT_FILE);

function motionEntry(slug) {
  const src = read("src/data/motion.entries.ts");
  const m = /=\s*\[/.exec(src);
  return JSON.parse(src.slice(m.index + m[0].length - 1, src.lastIndexOf("]") + 1)).find((e) => e.slug === slug);
}

const values = () =>
  kitValues({
    poseBenchmark,
    formRules,
    squatEvidence: JSON.parse(read("ops/sources/evidence/motion-squat-detection-pose-estimation.json")),
    squatEntry: motionEntry("squat-detection-pose-estimation"),
    counter: EXERCISES.squat,
  });

test("the committed file is what the template renders", () => {
  assert.equal(html, renderRepCounter(read(TEMPLATE_FILE), values()), "stale: run node scripts/build-kit.mjs --only rep-counter");
});

test("it parses as an HTML document with a script that compiles", () => {
  assert.match(html, /^<!doctype html>\n<html lang="en">/);
  const body = html.replace(/<!--[\s\S]*?-->/g, "");
  const scripts = [...body.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.match(scripts[0][1], /type="module"/);
  assert.doesNotMatch(scripts[0][1], /\bsrc=/, "no external script tag");
  // Dynamic import() only, so the module body also compiles as a script.
  assert.doesNotMatch(scripts[0][2], /^\s*import\s/m);
  new vm.Script(`"use strict";\n${scripts[0][2]}`, { filename: "rep-counter.html#module" });

  const markup = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "");
  const VOID = new Set(["meta", "link", "input", "br", "img", "hr", "source"]);
  const stack = [];
  const counts = {};
  for (const m of markup.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g)) {
    const [, close, rawName, attrs] = m;
    const name = rawName.toLowerCase();
    if (!close) {
      counts[name] = (counts[name] ?? 0) + 1;
      assert.doesNotMatch(attrs.replace(/"[^"]*"/g, `""`), /=\s*[^"\s]/, `unquoted attribute on <${name}>`);
      if (!VOID.has(name)) stack.push(name);
    } else {
      assert.equal(stack.pop(), name, `</${name}> closes the wrong element`);
    }
  }
  assert.deepEqual(stack, [], "unclosed elements");
  for (const t of ["html", "head", "body", "title", "h1"]) assert.equal(counts[t], 1, `<${t}> count`);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /<meta charset="utf-8">/);
  // The header comment is one comment, so nothing in it can end it early.
  const header = html.slice(html.indexOf("<!--") + 4, html.indexOf("-->"));
  assert.doesNotMatch(header, /--/);
});

test("every URL it fetches is pinned, and every other URL is a citation", () => {
  const loaded = loadedUrls(html);
  assert.equal(loaded.length, 3);
  for (const u of loaded) {
    const url = new URL(u);
    if (url.host === "cdn.jsdelivr.net") assert.match(url.pathname, /^\/npm\/(@[^/]+\/)?[^/@]+@\d+\.\d+\.\d+\//, `${u} names no exact version`);
    else if (url.host === "storage.googleapis.com") assert.match(url.pathname, /\/float16\/\d+\//, `${u} is not a versioned model path`);
    else assert.fail(`${u} is fetched from an unexpected host`);
  }
  assert.deepEqual(loaded, [poseBenchmark.TASKS_VISION_BUNDLE, poseBenchmark.TASKS_VISION_WASM, poseBenchmark.BENCH_MODELS[0].url]);
  const CITATION_HOSTS = new Set(["aifitnessapi.com", "pmc.ncbi.nlm.nih.gov", "github.com", "odml.pa.googleapis.com"]);
  for (const m of html.matchAll(/https?:\/\/[^\s"'<>)\]]+/g)) {
    const u = m[0].replace(/[.,;:]+$/, "");
    if (loaded.includes(u)) continue;
    assert.ok(CITATION_HOSTS.has(new URL(u).host), `unexpected URL ${u}`);
  }
  // The only import is the pinned bundle; nothing else is fetched by hand.
  assert.deepEqual([...html.matchAll(/import\(([^)]*)\)/g)].map((m) => m[1].replace(/\/\*[\s\S]*?\*\//g, "").trim()), ["CONFIG.bundle"]);
  assert.doesNotMatch(html, /\bfetch\(|XMLHttpRequest|sendBeacon|<link\b/);
});

test("its landmark indices are the BlazePose 33 points they name", () => {
  const bp = POSE_SCHEMES.find((s) => s.slug === "blazepose-33");
  const m = /const L = (\{[^}]*\});/.exec(html);
  const L = Function(`return ${m[1]}`)();
  const want = { SHOULDER: "shoulder", HIP: "hip", KNEE: "knee", ANKLE: "ankle", FOOT: "footindex" };
  for (const [k, [left, right]] of Object.entries(L)) {
    assert.equal(bp.points[left].key, `left${want[k]}`);
    assert.equal(bp.points[right].key, `right${want[k]}`);
  }
});

test("its thresholds are the cited ones", () => {
  const v = values();
  assert.equal(v.TOP, EXERCISES.squat.rest.above);
  assert.equal(v.BOTTOM, EXERCISES.squat.active.below);
  const row = formRules.FORM_RULES.find((r) => r.id === "squat-stance-ratio-exercise-correction");
  assert.deepEqual([v.STANCE_MIN, v.STANCE_MAX], [row.value, row.value2]);
  assert.ok(html.includes(`"stanceMin": ${row.value}`) && html.includes(`"stanceMax": ${row.value2}`));
  assert.ok(html.includes(row.source) && html.includes(row.quote));
  assert.ok(html.includes("MIT License"));
});

test("its counter counts a full rep once and ignores jitter at the top", () => {
  const script = /<script type="module">([\s\S]*?)<\/script>/.exec(html)[1];
  const pick = (re, what) => {
    const m = re.exec(script);
    assert.ok(m, `no ${what} in the page script`);
    return m[0];
  };
  const src = [
    pick(/const CONFIG = \{[\s\S]*?\};/, "CONFIG"),
    pick(/const VIS = [^\n]*;/, "constants"),
    pick(/let state = [^\n]*;/, "state"),
    pick(/function step\(a, t\) \{[\s\S]*?\n\}/, "step()"),
    "({ step, get reps() { return reps; } })",
  ].join("\n");
  const run = (angles) => {
    const c = vm.runInNewContext(src, {});
    angles.forEach((a, i) => c.step(a, 1000 + i * 33));
    return c.reps;
  };
  const hold = (a, n) => Array(n).fill(a);
  const rep = [...hold(170, 10), ...hold(80, 10), ...hold(170, 10)];
  assert.equal(run(rep), 1);
  assert.equal(run([...rep, ...hold(80, 10), ...hold(170, 10)]), 2);
  // Hovering around the top threshold never reaches the bottom: no rep.
  assert.equal(run(Array.from({ length: 60 }, (_, i) => (i % 2 ? 155 : 165))), 0);
  // Starting at the bottom earns nothing until the person has stood up first.
  assert.equal(run([...hold(80, 10), ...hold(170, 10)]), 0);
});
