/**
 * multi-window-rate-pacer.test.mjs
 *
 * The contract for multi-window-rate-pacer.mjs on a fake clock: every
 * published window holds at once; Strava's fixed windows reset on the
 * quarter hour and at midnight UTC; sliding windows never let N+1 requests
 * into any W-long stretch; Wahoo's uncounted calls are not charged; WHOOP's
 * X-RateLimit-Limit example parses to its two windows; and a simulated day of
 * traffic through `run` never exceeds a limit.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  PRESETS,
  createPacer,
  fixedWindowStart,
  parseStravaUsage,
  parseWhoopLimitHeader,
  whoopPoliciesFromHeader,
} from "./multi-window-rate-pacer.mjs";

const MIN = 60_000;
const DAY = 86_400_000;

function clock(start) {
  let t = start;
  return { now: () => t, advance: (ms) => (t += ms), set: (v) => (t = v), sleep: async (ms) => void (t += ms) };
}

test("WHOOP's documented X-RateLimit-Limit example parses to 100/60 s and 10000/86400 s", () => {
  assert.deepEqual(parseWhoopLimitHeader("100, 100;window=60, 10000;window=86400"), [
    { limit: 100, windowMs: 60_000 },
    { limit: 10000, windowMs: 86_400_000 },
  ]);
  assert.deepEqual(parseWhoopLimitHeader(undefined), []);
  assert.equal(whoopPoliciesFromHeader("garbage"), PRESETS.WHOOP);
});

test("Strava: the non-upload 15-minute window fills at 100 even though overall allows 200", () => {
  const c = clock(Date.UTC(2026, 10, 5, 10, 0, 0));
  const pacer = createPacer({ policies: PRESETS.STRAVA, now: c.now });
  for (let i = 0; i < 100; i++) assert.equal(pacer.reserve({}).ok, true);
  const r = pacer.reserve({});
  assert.equal(r.ok, false);
  assert.equal(r.policy, "strava non-upload 15 min");
  assert.equal(r.waitMs, 15 * MIN);
  // An upload is not a non-upload request, so it still has overall room.
  assert.equal(pacer.reserve({ upload: true }).ok, true);
});

test("Strava: the 15-minute window resets on the quarter hour, not 15 minutes after the first call", () => {
  const c = clock(Date.UTC(2026, 10, 5, 10, 14, 0));
  const pacer = createPacer({ policies: PRESETS.STRAVA, now: c.now });
  for (let i = 0; i < 100; i++) pacer.reserve({});
  assert.equal(pacer.reserve({}).waitMs, 1 * MIN);
  c.set(Date.UTC(2026, 10, 5, 10, 15, 0));
  assert.equal(pacer.reserve({}).ok, true);
});

test("Strava: the daily window resets at midnight UTC", () => {
  assert.equal(fixedWindowStart(Date.UTC(2026, 10, 5, 23, 59), DAY), Date.UTC(2026, 10, 5));
  assert.equal(fixedWindowStart(Date.UTC(2026, 10, 6, 0, 0), DAY), Date.UTC(2026, 10, 6));
  assert.equal(fixedWindowStart(Date.UTC(2026, 10, 5, 10, 44), 15 * MIN), Date.UTC(2026, 10, 5, 10, 30));
});

test("Strava: adopting a higher server-reported usage closes the window early", () => {
  const c = clock(Date.UTC(2026, 10, 5, 10, 0, 0));
  const pacer = createPacer({ policies: PRESETS.STRAVA, now: c.now });
  const usage = parseStravaUsage("100, 450");
  assert.deepEqual(usage, { short: 100, daily: 450 });
  pacer.observeUsage("strava non-upload 15 min", usage.short);
  assert.equal(pacer.reserve({}).ok, false);
  assert.equal(parseStravaUsage("nope"), null);
});

test("sliding window: never more than N in any W-long stretch", () => {
  const c = clock(0);
  const pacer = createPacer({ policies: [{ name: "w", limit: 3, windowMs: 1000, kind: "sliding" }], now: c.now });
  const sent = [];
  for (let t = 0; t < 5000; t += 100) {
    c.set(t);
    if (pacer.reserve({}).ok) sent.push(t);
  }
  for (const start of sent) assert.ok(sent.filter((t) => t >= start && t < start + 1000).length <= 3);
  assert.deepEqual(sent.slice(0, 6), [0, 100, 200, 1000, 1100, 1200]);
});

test("Wahoo: auth, refresh and file downloads are not charged", () => {
  const c = clock(0);
  const pacer = createPacer({ policies: PRESETS.WAHOO_SANDBOX, now: c.now });
  for (let i = 0; i < 25; i++) assert.equal(pacer.reserve({}).ok, true);
  assert.equal(pacer.reserve({}).ok, false);
  for (const kind of ["auth", "refresh", "file"]) assert.equal(pacer.reserve({ kind }).ok, true);
});

test("Wahoo sandbox: the daily 250 binds before the hourly window would", () => {
  const c = clock(0);
  const pacer = createPacer({ policies: PRESETS.WAHOO_SANDBOX, now: c.now });
  let sent = 0;
  for (let t = 0; t < DAY; t += 5 * MIN) {
    c.set(t);
    while (pacer.reserve({}).ok) sent++;
  }
  assert.equal(sent, 250);
});

test("run(): a day of eager WHOOP traffic stays inside both windows", async () => {
  const c = clock(0);
  const pacer = createPacer({ policies: PRESETS.WHOOP, now: c.now, sleep: c.sleep });
  const times = [];
  for (let i = 0; i < 350; i++) await pacer.run({}, async () => times.push(c.now()));
  assert.equal(times.length, 350);
  for (let i = 100; i < times.length; i++) assert.ok(times[i] - times[i - 100] >= MIN, `request ${i} broke the minute window`);
  assert.equal(times[349] >= 3 * MIN, true);
});

test("remaining() reports each window", () => {
  const c = clock(Date.UTC(2026, 10, 5, 10, 0, 0));
  const pacer = createPacer({ policies: PRESETS.STRAVA, now: c.now });
  pacer.reserve({});
  pacer.reserve({ upload: true });
  assert.deepEqual(
    pacer.remaining().map((r) => r.remaining),
    [198, 1998, 99, 999],
  );
});

test("bad policies are refused at construction", () => {
  assert.throws(() => createPacer({ policies: [] }), TypeError);
  assert.throws(() => createPacer({ policies: [{ name: "x", limit: 0, windowMs: 1, kind: "fixed" }] }), TypeError);
  assert.throws(() => createPacer({ policies: [{ name: "x", limit: 1, windowMs: 1, kind: "token" }] }), TypeError);
});
