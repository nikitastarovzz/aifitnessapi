// "Ship It" (/play/ship-it): the source check plus every playthrough.
//
//   node --test scripts/ship-it.test.mjs
//
// Loads src/lib/shipIt.ts through Node's type stripping (Node 22.18+).
import test from "node:test";
import assert from "node:assert/strict";
import { checkShipIt, loadShipIt } from "./ship-it-check.mjs";

const G = await loadShipIt();
const CHOICES = ["act", "hedge", "ignore"];

function* stackSets() {
  const ids = G.STACKS.map((s) => s.id);
  for (let m = 1; m < 1 << ids.length; m++) {
    const set = ids.filter((_, i) => m & (1 << i));
    if (set.length <= G.MAX_STACKS) yield set;
  }
}

test("every event and stack traces to a sourced page on this site", async () => {
  const { problems, events } = await checkShipIt();
  assert.deepEqual(problems, []);
  assert.ok(events >= 10, `only ${events} events`);
});

test("every stack is hit by at least one event for every product", () => {
  for (const p of G.PRODUCTS)
    for (const s of G.STACKS) assert.ok(G.timeline(p.id, [s.id]).length > 0, `${p.id} on ${s.id} meets no event`);
});

test("every path terminates, and events only touch the stacks they affect", () => {
  let paths = 0;
  const endings = new Set();
  for (const p of G.PRODUCTS) {
    for (const stacks of stackSets()) {
      let start = G.reduce(G.reduce(G.INITIAL, { type: "product", id: p.id }), { type: "stacks", ids: stacks });
      assert.deepEqual(start.stacks, stacks);
      for (const id of start.queue) {
        const e = G.eventById(id);
        assert.ok(e, `queued unknown event ${id}`);
        assert.ok(e.stacks.some((s) => stacks.includes(s)), `${id} queued for ${stacks} but affects ${e.stacks}`);
        assert.ok(!e.products || e.products.includes(p.id), `${id} queued for product ${p.id}`);
      }
      const limit = start.queue.length + 1;
      const walk = (s, depth) => {
        assert.ok(depth <= limit, `${p.id}/${stacks}: no end after ${depth} choices`);
        if (s.phase === "end") {
          assert.ok(s.ending && G.ENDINGS[s.ending], "end without an ending");
          assert.ok(s.weeks >= 0 && G.totalUsers(s) >= 0 && G.totalUsers(s) <= G.START_USERS);
          if (s.ending === "shipped") assert.ok(G.keptShare(s) >= G.SURVIVE_SHARE && s.weeks <= G.RUNWAY_WEEKS);
          endings.add(s.ending);
          paths++;
          return;
        }
        assert.equal(s.phase, "event");
        const e = G.currentEvent(s);
        assert.ok(e);
        for (const c of CHOICES) {
          const n = G.reduce(s, { type: "choose", choice: c });
          assert.ok(n.index > s.index, "a choice did not advance the timeline");
          const entry = n.log[s.log.length];
          assert.equal(entry.eventId, e.id);
          for (const st of Object.keys(entry.lost)) assert.ok(e.stacks.includes(st), `${e.id} took users from ${st}`);
          for (const st of stacks)
            if (!e.stacks.includes(st)) assert.equal(n.users[st], s.users[st], `${e.id} changed ${st}`);
          walk(n, depth + 1);
        }
      };
      walk(start, 0);
    }
  }
  assert.ok(paths > 1000, `only ${paths} paths`);
  for (const id of Object.keys(G.ENDINGS)) assert.ok(endings.has(id), `no path reaches ${id}`);
});

test("a handled event is skipped and costs nothing", () => {
  let s = G.reduce(G.reduce(G.INITIAL, { type: "product", id: "sleep" }), { type: "stacks", ids: ["fitbit"] });
  assert.equal(G.currentEvent(s).id, "fitbit-eos");
  s = G.reduce(s, { type: "choose", choice: "hedge" });
  assert.equal(s.phase, "end");
  assert.equal(s.log.at(-1).eventId, "fitbit-turn-off");
  assert.equal(s.log.at(-1).choice, "handled");
  assert.equal(s.ending, "shipped");
});

test("invalid actions leave the state alone", () => {
  const s = G.reduce(G.INITIAL, { type: "product", id: "running" });
  assert.equal(G.reduce(s, { type: "stacks", ids: [] }), s);
  assert.equal(G.reduce(s, { type: "stacks", ids: ["strava", "garmin", "oura", "terra"] }), s);
  assert.equal(G.reduce(s, { type: "choose", choice: "act" }), s);
  assert.equal(G.reduce(G.INITIAL, { type: "product", id: "nope" }), G.INITIAL);
});

test("the share text is spoiler-free", () => {
  let s = G.reduce(G.reduce(G.INITIAL, { type: "product", id: "wellness" }), { type: "stacks", ids: ["strava", "healthkit"] });
  while (s.phase === "event") s = G.reduce(s, { type: "choose", choice: "ignore" });
  const text = G.shareText(s);
  for (const e of G.EVENTS) assert.ok(!text.includes(e.title), `share text names "${e.title}"`);
  assert.match(text, /aifitnessapi\.com\/play\/ship-it/);
  assert.equal([...G.squares(s)].length, s.log.length);
});
