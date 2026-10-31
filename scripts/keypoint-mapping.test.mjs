/**
 * Tests for src/lib/keypointMapping.mjs, the core of /tools/keypoint-playground.
 *
 * Run: npm run test:keypoints   (node --test; Node strips the data module's types)
 *
 * It runs on the real generated dataset, so a regeneration that changes the
 * crosswalk is checked here as well as in the build: every pair the tool can
 * emit must be a crosswalk row of the dataset, and A -> B -> A must return
 * every point it started from.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const src = new URL("../src/", import.meta.url);
const data = await import(new URL("data/poseKeypoints.ts", src).href);
const lib = await import(new URL("lib/keypointMapping.mjs", src).href);
const layout = await import(new URL("lib/keypointLayout.mjs", src).href);

const SCHEMES = data.POSE_SCHEMES;
const XW = data.POSE_CROSSWALK;
const SLUGS = SCHEMES.map((s) => s.slug);
const META = { fetchedOn: data.POSE_KEYPOINTS_FETCHED_ON, url: "https://example.test/" };

const allPairs = () => {
  const out = [];
  for (const a of SLUGS) for (const b of SLUGS) if (a !== b) out.push([a, b]);
  return out;
};

test("keys are unique inside each scheme (the tool selects a joint by key)", () => {
  for (const s of SCHEMES) {
    const keys = s.points.map((p) => p.key);
    assert.equal(new Set(keys).size, keys.length, s.slug);
  }
});

test("a crosswalk row has at most one cell per scheme, and every cell is a real point", () => {
  for (const r of XW) {
    const seen = new Set();
    for (const c of r.cells) {
      assert.ok(!seen.has(c.scheme), `${r.key} has two ${c.scheme} cells`);
      seen.add(c.scheme);
      const s = SCHEMES.find((x) => x.slug === c.scheme);
      assert.ok(s, c.scheme);
      assert.ok(s.points.some((p) => p.key === r.key && p.name === c.name && p.index === c.index), `${r.key} ${c.scheme}`);
    }
  }
});

test("every emitted pair exists in the dataset's crosswalk", () => {
  let n = 0;
  for (const [a, b] of allPairs()) {
    const m = lib.mappingBetween(SCHEMES, XW, a, b);
    for (const x of m.pairs) {
      const row = XW.find((r) => r.key === x.key);
      assert.ok(row, `${a}->${b} ${x.key} has no crosswalk row`);
      assert.ok(row.cells.some((c) => c.scheme === a && c.name === x.from.name && c.index === x.from.index), `${a} cell ${x.key}`);
      assert.ok(row.cells.some((c) => c.scheme === b && c.name === x.to.name && c.index === x.to.index), `${b} cell ${x.key}`);
      n++;
    }
    // Nothing is both mapped and unmapped, and nothing is lost.
    assert.equal(m.pairs.length + m.unmappedFrom.length, m.from.points.length, `${a}->${b}`);
  }
  assert.ok(n > 0);
});

test("pairs are exactly the crosswalk rows both schemes appear in (none missed, none added)", () => {
  for (const [a, b] of allPairs()) {
    const expected = XW.filter((r) => r.cells.some((c) => c.scheme === a) && r.cells.some((c) => c.scheme === b)).map((r) => r.key).sort();
    const got = lib.mappingBetween(SCHEMES, XW, a, b).pairs.map((x) => x.key).sort();
    assert.deepEqual(got, expected, `${a}->${b}`);
  }
});

test("round trips are consistent: A -> B -> A returns the starting point, and B -> A is A -> B reversed", () => {
  for (const [a, b] of allPairs()) {
    const ab = lib.mappingBetween(SCHEMES, XW, a, b);
    const ba = lib.mappingBetween(SCHEMES, XW, b, a);
    assert.equal(ab.pairs.length, ba.pairs.length, `${a}<->${b}`);
    const back = new Map(ba.pairs.map((x) => [`${x.from.index}|${x.from.name}`, x.to]));
    for (const x of ab.pairs) {
      const r = back.get(`${x.to.index}|${x.to.name}`);
      assert.ok(r, `${a}->${b}->${a} lost ${x.from.name}`);
      assert.equal(r.index, x.from.index);
      assert.equal(r.name, x.from.name);
    }
    // Injective both ways: no two from-points land on one to-point.
    assert.equal(new Set(ab.pairs.map((x) => `${x.to.index}|${x.to.name}`)).size, ab.pairs.length);
    assert.deepEqual(ab.unmappedTo.map((p) => p.key).sort(), ba.unmappedFrom.map((p) => p.key).sort());
  }
});

test("a key without a crosswalk row is in no other scheme, and the dataset's own unmapped flag agrees", () => {
  for (const s of SCHEMES) {
    for (const p of s.points) {
      const j = lib.jointAcross(SCHEMES, XW, s.slug, p.key);
      const others = j.cells.filter((c) => c.scheme !== s.slug && c.point);
      assert.deepEqual(others.map((c) => c.scheme).sort(), [...p.sharedWith].sort(), `${s.slug} ${p.name}`);
    }
  }
});

test("same scheme or unknown scheme gives no mapping rather than an invented one", () => {
  assert.equal(lib.mappingBetween(SCHEMES, XW, "coco-17", "coco-17"), null);
  assert.equal(lib.mappingBetween(SCHEMES, XW, "coco-17", "nope"), null);
  assert.equal(lib.snippet(null, "ts", META), "");
});

test("TypeScript snippets evaluate to exactly the pairs (Node strips the types)", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kp-ts-"));
  try {
    for (const [a, b] of allPairs()) {
      const m = lib.mappingBetween(SCHEMES, XW, a, b);
      const code = lib.snippet(m, "ts", META);
      const file = path.join(dir, `${a}__${b}.ts`);
      fs.writeFileSync(file, code);
      const mod = await import(new URL(`file://${file}`).href);
      const obj = Object.values(mod)[0];
      const want = Object.fromEntries(m.pairs.map((x) => [x.from.index ?? x.from.name, x.to.index ?? x.to.name]));
      assert.deepEqual({ ...obj }, want, `${a}->${b}`);
      if (m.pairs.length === 0) assert.match(code, /no name equivalence/);
      for (const p of m.unmappedFrom) assert.ok(code.includes(lib.label(p)), `${a}->${b} omits unmapped ${p.name}`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("Python snippets evaluate to exactly the pairs", (t) => {
  let py = "python3";
  try {
    execFileSync(py, ["--version"]);
  } catch {
    t.skip("python3 not available");
    return;
  }
  const cases = allPairs().map(([a, b]) => {
    const m = lib.mappingBetween(SCHEMES, XW, a, b);
    return { id: `${a}->${b}`, code: lib.snippet(m, "py", META), want: m.pairs.map((x) => [x.from.index ?? x.from.name, x.to.index ?? x.to.name]) };
  });
  const runner = `
import json, sys
cases = json.load(sys.stdin)
bad = []
for c in cases:
    ns = {}
    exec(c["code"], ns)
    d = [v for k, v in ns.items() if not k.startswith("__")][0]
    if sorted(map(list, d.items()), key=str) != sorted(c["want"], key=str):
        bad.append(c["id"])
print(json.dumps(bad))
`;
  const out = execFileSync(py, ["-I", "-c", runner], { input: JSON.stringify(cases) }).toString();
  assert.deepEqual(JSON.parse(out), []);
});

test("URL state: only values the dataset holds are accepted", () => {
  const d = { from: "coco-17", to: "blazepose-33", joint: "leftknee" };
  assert.deepEqual(lib.parseState(SCHEMES, "?from=openpose-body-25&to=coco-17&joint=lshoulder", d), {
    from: "openpose-body-25",
    to: "coco-17",
    joint: "lshoulder",
  });
  assert.deepEqual(lib.parseState(SCHEMES, "?from=bogus&to=coco-17&joint=zzz", d).from, "coco-17");
  const same = lib.parseState(SCHEMES, "?from=coco-17&to=coco-17", d);
  assert.notEqual(same.to, same.from);
  // A joint the from-scheme lacks falls back to one it has.
  const s = lib.parseState(SCHEMES, "?from=openpose-coco-18&joint=leftknee", d);
  assert.ok(SCHEMES.find((x) => x.slug === "openpose-coco-18").points.some((p) => p.key === s.joint));
});

test("layout positions are drawn only for keys some scheme has", () => {
  const keys = new Set(SCHEMES.flatMap((s) => s.points.map((p) => p.key)));
  for (const k of Object.keys(layout.LAYOUT)) assert.ok(keys.has(k), `layout key ${k} is in no scheme`);
  // Every point outside COCO-WholeBody's face and hand blocks has a drawn position.
  for (const s of SCHEMES) {
    for (const p of s.points) {
      if (s.slug === "coco-wholebody-133" && /^(face|lefthand|righthand|left(thumb|forefinger|middlefinger|ringfinger|pinkyfinger)|right(thumb|forefinger|middlefinger|ringfinger|pinkyfinger))/.test(p.key) && !layout.LAYOUT[p.key]) continue;
      assert.ok(layout.LAYOUT[p.key], `${s.slug} ${p.name} has no drawn position`);
    }
  }
});

test("headline count of supported pairs", () => {
  const t = lib.totalPairs(SCHEMES, XW);
  assert.equal(t.ordered, t.unordered * 2);
  console.log(`  ${SCHEMES.length} schemes, ${XW.length} crosswalk rows, ${t.unordered} supported pairs over ${t.schemePairsWithAny} scheme pairs (${t.ordered} directed)`);
});
