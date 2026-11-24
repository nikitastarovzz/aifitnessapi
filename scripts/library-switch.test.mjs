/**
 * Tests for src/lib/librarySwitch.mjs, the "Switching libraries?" picker on
 * the /libraries framework hubs.
 *
 * Run: node --test scripts/library-switch.test.mjs   (also part of npm test)
 *
 * Runs on the real generated dataset, src/data/healthLibrarySupport.ts:
 * every ordered pair of libraries in the same group must split into keep,
 * lose and gain exactly as the dataset's own lists do, and every source
 * link the compact form rebuilds must be the dataset's `url`, byte for byte.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const src = new URL("../src/", import.meta.url);
const data = await import(new URL("data/healthLibrarySupport.ts", src).href);
const lib = await import(new URL("lib/librarySwitch.mjs", src).href);

const LIBS = data.HEALTH_LIBRARY_SUPPORT;
const groups = [...new Set(LIBS.map((l) => l.group))];
const { libs: COMPACT, types } = lib.compactLibraries(LIBS, (i) => `/page/${i.store}/${i.id}`);
const bySlug = new Map(COMPACT.map((l) => [l.slug, l]));
const rawBySlug = new Map(LIBS.map((l) => [l.slug, l]));

test("every group the hubs show has at least two libraries", () => {
  for (const g of ["react-native", "flutter", "capacitor-cordova"]) {
    assert.ok(LIBS.filter((l) => l.group === g).length >= 2, `${g} has fewer than two covered libraries`);
  }
});

test("lineUrl rebuilds every item's GitHub url exactly", () => {
  for (const l of COMPACT) {
    const raw = rawBySlug.get(l.slug);
    for (const store of ["healthkit", "healthConnect"]) {
      l.items[store].forEach((item, i) => assert.equal(lib.lineUrl(l, item), raw[store][i].url));
    }
  }
});

test("each type keeps its own name and store in the shared dictionary", () => {
  for (const raw of LIBS) {
    for (const store of ["healthkit", "healthConnect"]) {
      for (const it of raw[store]) {
        assert.equal(types[it.id].n, it.name);
        assert.equal(types[it.id].s, store);
      }
    }
  }
});

test("keep/lose/gain partition both libraries' lists, for every ordered pair in a group", () => {
  let pairs = 0;
  for (const g of groups) {
    const members = LIBS.filter((l) => l.group === g);
    for (const a of members) {
      for (const b of members) {
        if (a.slug === b.slug) continue;
        pairs++;
        const diff = lib.switchDiff(bySlug.get(a.slug), bySlug.get(b.slug));
        for (const store of ["healthkit", "healthConnect"]) {
          const d = diff.find((x) => x.store === store);
          const aIds = new Set(a.stores.includes(store) ? a[store].map((i) => i.id) : []);
          const bIds = new Set(b.stores.includes(store) ? b[store].map((i) => i.id) : []);
          if (!aIds.size && !bIds.size && !a.stores.includes(store) && !b.stores.includes(store)) {
            assert.equal(d, undefined, `${a.slug} → ${b.slug}: ${store} shown though neither reads it`);
            continue;
          }
          const keep = new Set(d.keep.map((e) => e.id));
          const lose = new Set(d.lose.map((e) => e.id));
          const gain = new Set(d.gain.map((e) => e.id));
          assert.deepEqual(keep, new Set([...aIds].filter((x) => bIds.has(x))));
          assert.deepEqual(lose, new Set([...aIds].filter((x) => !bIds.has(x))));
          assert.deepEqual(gain, new Set([...bIds].filter((x) => !aIds.has(x))));
          assert.equal(d.fromReads, a.stores.includes(store));
          assert.equal(d.toReads, b.stores.includes(store));
          for (const e of d.keep) assert.ok(e.from && e.to, "a kept type links both libraries' lines");
        }
      }
    }
  }
  assert.ok(pairs >= 20, `only ${pairs} ordered pairs`);
});

test("a move to a HealthKit-only library loses every Health Connect type", () => {
  const from = bySlug.get("capgo-capacitor-health");
  const to = bySlug.get("perfood-capacitor-healthkit");
  assert.ok(from && to);
  const hc = lib.switchDiff(from, to).find((d) => d.store === "healthConnect");
  assert.equal(hc.toReads, false);
  assert.equal(hc.lose.length, from.items.healthConnect.length);
  assert.equal(hc.keep.length + hc.gain.length, 0);
});
