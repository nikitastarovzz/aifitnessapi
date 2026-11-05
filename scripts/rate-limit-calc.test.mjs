// Tests for src/lib/rateLimitCalc.mjs — the arithmetic behind
// /tools/rate-limit-calculator, and the sourcing of every limit it uses.
// Run: npm run test:rate-limits
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  RATE_LIMIT_VENDORS,
  NOT_DOCUMENTED,
  DEFAULT_INPUTS,
  parsePublishedLimit,
  capacity,
  demand,
  maxUsers,
  evaluateTier,
  evaluateAll,
  totals,
  windowLabel,
  parseCalcState,
  calcStateToSearch,
} from "../src/lib/rateLimitCalc.mjs";
import { checkAll, statesNumber } from "./lib/evidence-check.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendor = (id) => RATE_LIMIT_VENDORS.find((v) => v.id === id);
const inputs = (o = {}) => ({ ...DEFAULT_INPUTS, ...o });
const appLimit = (max, window, extra = {}) => ({ label: "t", max, window, scope: "app", src: null, ...extra });

test("every limit, scope note and mitigation quote is in its evidence file under the same URL", () => {
  assert.deepEqual(checkAll(ROOT, { RATE_LIMIT_VENDORS, NOT_DOCUMENTED }), []);
});

test("every limit's numbers are stated in its own quote", () => {
  for (const v of RATE_LIMIT_VENDORS)
    for (const t of v.tiers)
      for (const l of t.limits) {
        assert.ok(statesNumber(l.src.quote, l.max), `${v.id}/${t.id} ${l.label}: ${l.max} not in "${l.src.quote}"`);
        if (l.perUser) assert.ok(statesNumber(l.src.quote, l.perUser), `${v.id} ${l.label}: per-user ${l.perUser} not in quote`);
      }
});

test("every vendor links an integration guide that exists", () => {
  const released = fs.readFileSync(path.join(ROOT, "src/data/integrate.ts"), "utf8");
  for (const v of [...RATE_LIMIT_VENDORS, ...NOT_DOCUMENTED]) {
    const slug = v.guide.replace(/^\/integrate\//, "");
    assert.ok(released.includes(`"${slug}"`), `${v.id}: ${v.guide} is not a released integration guide`);
  }
});

test("WHOOP: 1,000 users syncing 3 endpoints hourly is 72,000 a day against 10,000", () => {
  const r = evaluateTier(vendor("whoop").tiers[0], inputs({ users: 1000, syncsPerDay: 24, endpointsPerSync: 3 }));
  const day = r.rows.find((x) => x.limit.window === 86400);
  assert.equal(day.demand, 72000);
  assert.equal(day.capacity, 10000);
  assert.equal(r.binding, day);
  assert.equal(day.maxUsers, 138); // floor(10000 / 72)
  assert.equal(r.over, true);
});

test("spread demand is the average share of the window, never less than one sync", () => {
  const l = appLimit(100, 60);
  assert.equal(demand(l, inputs({ users: 1440, syncsPerDay: 1, endpointsPerSync: 2 })), 2); // 1440×2 per day = 2 a minute
  assert.equal(demand(l, inputs({ users: 1, syncsPerDay: 1, endpointsPerSync: 5 })), 5); // one sync lands whole
});

test("aligned demand puts every user's sync in the same window", () => {
  const l = appLimit(100, 60);
  assert.equal(demand(l, inputs({ users: 50, syncsPerDay: 24, endpointsPerSync: 3, timing: "aligned" })), 150);
  assert.equal(maxUsers(l, inputs({ users: 50, syncsPerDay: 24, endpointsPerSync: 3, timing: "aligned" })), 33);
  // A day-long window holds every round either way.
  const day = appLimit(10000, 86400);
  assert.equal(demand(day, inputs({ users: 10, syncsPerDay: 24, endpointsPerSync: 3, timing: "aligned" })), 720);
});

test("per-user limits ignore the number of users", () => {
  const l = { ...appLimit(250, 60), scope: "user" };
  const a = demand(l, inputs({ users: 10, syncsPerDay: 1440, endpointsPerSync: 4 }));
  const b = demand(l, inputs({ users: 100000, syncsPerDay: 1440, endpointsPerSync: 4 }));
  assert.equal(a, 4);
  assert.equal(b, 4);
  assert.equal(maxUsers(l, inputs({ syncsPerDay: 1440, endpointsPerSync: 4 })), Infinity);
  assert.equal(maxUsers(l, inputs({ syncsPerDay: 1440, endpointsPerSync: 300 })), 0);
});

test("Polar's limit grows with users, so a light pattern never binds", () => {
  const day = vendor("polar").tiers[0].limits.find((l) => l.window === 86400);
  assert.equal(capacity(day, 1000), 5000 + 1000 * 100);
  assert.equal(maxUsers(day, inputs({ syncsPerDay: 24, endpointsPerSync: 3 })), Infinity); // 72 a user a day < 100
  // 48 syncs × 3 = 144 a user a day: 44 over the per-user allowance, so 5000 / 44 users.
  assert.equal(maxUsers(day, inputs({ syncsPerDay: 48, endpointsPerSync: 3 })), Math.floor(5000 / 44));
});

test("Terra counts requested days, per user", () => {
  const t = vendor("terra");
  const l = t.tiers[0].limits[0];
  assert.equal(l.unit, "days");
  assert.equal(demand(l, inputs({ syncsPerDay: 24, endpointsPerSync: 3, daysPerRequest: 30 })), 90);
  const [res] = evaluateAll([t], inputs({ daysPerRequest: 4000 }));
  assert.deepEqual(res.warnings, ["span"]);
});

test("Strava's non-upload daily limit binds before the overall one", () => {
  const r = evaluateTier(vendor("strava").tiers[0], inputs({ users: 10, syncsPerDay: 24, endpointsPerSync: 3 }));
  assert.equal(r.binding.limit.label, "non-upload, per day");
  assert.equal(r.binding.demand, 720);
});

test("ties go to the shorter window", () => {
  const tier = { id: "x", label: "x", limits: [appLimit(1440, 86400), appLimit(1, 60)] };
  const r = evaluateTier(tier, inputs({ users: 1, syncsPerDay: 1440, endpointsPerSync: 1 }));
  assert.equal(r.binding.limit.window, 60);
});

test("evaluateAll skips vendors with no limits and sorts the tightest first", () => {
  const all = evaluateAll(RATE_LIMIT_VENDORS, DEFAULT_INPUTS);
  assert.ok(!all.some((r) => r.vendor.id === "concept2"));
  for (let i = 1; i < all.length; i++) assert.ok(all[i - 1].binding.utilization >= all[i].binding.utilization);
});

test("parsePublishedLimit reads Google's table and refuses anything else", () => {
  assert.deepEqual(parsePublishedLimit("300 requests / minute"), { max: 300, window: 60 });
  assert.deepEqual(parsePublishedLimit("120,000 requests / minute"), { max: 120000, window: 60 });
  assert.deepEqual(parsePublishedLimit("86.4M requests / day"), { max: 86400000, window: 86400 });
  assert.throws(() => parsePublishedLimit("about 300 a minute"));
  assert.throws(() => parsePublishedLimit("300 requests / fortnight"));
});

test("totals and window labels", () => {
  assert.deepEqual(totals(inputs({ users: 100, syncsPerDay: 24, endpointsPerSync: 3 })), { perDay: 7200, perMinuteAverage: 5, perMinutePeak: 5 });
  assert.equal(totals(inputs({ users: 100, syncsPerDay: 24, endpointsPerSync: 3, timing: "aligned" })).perMinutePeak, 300);
  assert.equal(windowLabel(1), "second");
  assert.equal(windowLabel(60), "minute");
  assert.equal(windowLabel(900), "15 minutes");
  assert.equal(windowLabel(3600), "hour");
  assert.equal(windowLabel(86400), "day");
  assert.equal(windowLabel(2678400), "31 days");
});

test("URL state round-trips and clamps", () => {
  const state = { inputs: inputs({ users: 5000, syncsPerDay: 96, endpointsPerSync: 4, timing: "aligned", daysPerRequest: 7 }), tiers: { strava: "upgraded", wahoo: "production" } };
  const search = calcStateToSearch(state);
  assert.equal(search, "?u=5000&s=96&e=4&t=aligned&d=7&tier=strava:upgraded,wahoo:production");
  assert.deepEqual(parseCalcState(search, RATE_LIMIT_VENDORS), state);
  assert.equal(calcStateToSearch({ inputs: DEFAULT_INPUTS, tiers: {} }), "");
  const bad = parseCalcState("?u=-5&s=99999&e=abc&t=nope&tier=strava:gold,nobody:x", RATE_LIMIT_VENDORS);
  assert.equal(bad.inputs.users, 1);
  assert.equal(bad.inputs.syncsPerDay, 1440);
  assert.equal(bad.inputs.endpointsPerSync, DEFAULT_INPUTS.endpointsPerSync);
  assert.equal(bad.inputs.timing, "spread");
  assert.deepEqual(bad.tiers, {});
});
