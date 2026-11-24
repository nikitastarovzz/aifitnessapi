// Tests for src/lib/aggregatorBill.mjs — the bill calculator on
// /tools/aggregator-chooser: every vendor's formula on the sourced numbers,
// and the sourcing of every number it uses.
// Run: node --test scripts/aggregator-bill.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BILL_SOURCES,
  BILL_VENDORS,
  DEFAULT_INPUTS,
  PRICES,
  billAll,
  billHash,
  billMethods,
  parseBillHash,
  readStated,
} from "../src/lib/aggregatorBill.mjs";
import { checkAll } from "./lib/evidence-check.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (o = {}) => Object.fromEntries(billAll({ ...DEFAULT_INPUTS, ...o }).map((r) => [r.vendor.id, r]));
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test("every quote the calculator shows is a row of its evidence file under the same URL", () => {
  assert.deepEqual(checkAll(ROOT, { BILL_SOURCES, PRICES }), []);
});

test("every price is stated in its own quote, and reads as its value", () => {
  for (const [k, p] of Object.entries(PRICES)) {
    assert.ok(p.src.quote.includes(p.as), `${k}: "${p.as}" not in "${p.src.quote}"`);
    assert.equal(readStated(p.as), p.value, `${k}: "${p.as}" does not read as ${p.value}`);
  }
});

test("the eight vendors, in a fixed order", () => {
  assert.deepEqual(
    BILL_VENDORS.map((v) => v.id),
    ["terra", "rook", "junction", "spike", "sahha", "thryve", "open-wearables", "validic"],
  );
});

test("Terra: plan fee plus credits past 100,000, matching /pricing/terra-api-pricing's table", () => {
  // Annual billing, one source per user: 500 → $399, 1,000 → $899, 5,000 → $4,899, 10,000 → $7,899.
  close(run({ users: 500 }).terra.monthly, 399);
  close(run({ users: 1000 }).terra.monthly, 899);
  close(run({ users: 5000 }).terra.monthly, 4899);
  close(run({ users: 10000 }).terra.monthly, 7899);
  // Monthly billing adds $100: 1,000 → $999, 5,000 → $4,999, 10,000 → $7,999.
  close(run({ users: 1000, billing: "monthly" }).terra.monthly, 999);
  close(run({ users: 5000, billing: "monthly" }).terra.monthly, 4999);
  close(run({ users: 10000, billing: "monthly" }).terra.monthly, 7999);
  // Two sources each is the same bill as twice the users.
  close(run({ users: 500, sources: 2 }).terra.monthly, run({ users: 1000 }).terra.monthly);
  // Under the allowance only the plan fee is billed.
  close(run({ users: 10 }).terra.monthly, 399);
});

test("ROOK: the smallest plan whose ceiling covers the active users; custom past 15,000", () => {
  assert.equal(run({ users: 750 }).rook.pick.plan, "Core");
  close(run({ users: 750 }).rook.monthly, 399);
  assert.equal(run({ users: 751 }).rook.pick.plan, "Core+");
  close(run({ users: 1000 }).rook.monthly, 999);
  close(run({ users: 5000 }).rook.monthly, 999);
  close(run({ users: 5001 }).rook.monthly, 1999);
  close(run({ users: 15000 }).rook.monthly, 1999);
  assert.equal(run({ users: 15001 }).rook.computable, false);
  // Sources per user and billing period do not change it.
  close(run({ users: 1000, sources: 3, billing: "monthly" }).rook.monthly, 999);
});

test("Junction: a flat $300 up to 500 connected users, then custom", () => {
  close(run({ users: 1 }).junction.monthly, 300);
  close(run({ users: 500 }).junction.monthly, 300);
  assert.equal(run({ users: 501 }).junction.computable, false);
  assert.match(run({ users: 501 }).junction.reason, /Enterprise/);
});

test("Spike: never computable, with its published floor in the reason", () => {
  for (const users of [1, 1000, 100000]) {
    const s = run({ users }).spike;
    assert.equal(s.computable, false);
    assert.match(s.reason, /\$450/);
    assert.ok(s.sources.length >= 2);
  }
});

test("Sahha: the cheaper of Starter and Pro on annual billing, matching /pricing/sahha-api-pricing's table", () => {
  // 1,000 → Starter $299; 4,000 → $1,499 either way; 10,000 → Pro $1,499 (Starter $3,899); 20,000 → Pro $3,499 (Starter $7,899).
  const at = (users) => run({ users }).sahha;
  close(at(1000).monthly, 299);
  assert.equal(at(1000).pick.plan, "Starter");
  close(at(4000).monthly, 1499);
  close(at(10000).monthly, 1499);
  assert.equal(at(10000).pick.plan, "Pro");
  close(at(10000).options.find((o) => o.plan === "Starter").monthly, 3899);
  close(at(20000).monthly, 3499);
  close(at(20000).options.find((o) => o.plan === "Starter").monthly, 7899);
  // Monthly billing is not published.
  assert.equal(run({ billing: "monthly" }).sahha.computable, false);
});

test("Thryve: Start Up with 0.50 euros per extra user, and Scale Up as a conditional option, matching /pricing/thryve-api-pricing", () => {
  const at = (users) => run({ users }).thryve;
  close(at(500).monthly, 499);
  close(at(1000).monthly, 749);
  close(at(2000).monthly, 1249);
  close(at(5000).monthly, 2749);
  assert.equal(at(5000).pick.plan, "Start Up");
  const scale = (users) => at(users).options.find((o) => o.plan === "Scale Up");
  assert.ok(scale(5000).conditional);
  close(scale(5000).monthly, 1000);
  // 15,000 users: one further block of 10,000 → about 1,999 euros.
  close(scale(15000).monthly, 1999);
  close(scale(15001).monthly, 2998);
  assert.equal(at(1000).vendor.currency, "EUR");
});

test("Open Wearables: a $0 Core license; Validic: free up to 5 users, then negotiated", () => {
  close(run({ users: 100000 })["open-wearables"].monthly, 0);
  close(run({ users: 5 }).validic.monthly, 0);
  assert.equal(run({ users: 6 }).validic.computable, false);
});

test("annual is twelve months and the total is months × monthly", () => {
  const r = run({ users: 1000, months: 7 }).terra;
  close(r.annual, 899 * 12);
  close(r.total, 899 * 7);
});

test("the hash round-trips, clamps, and ignores other anchors", () => {
  const s = { users: 2500, sources: 2, months: 18, billing: "monthly" };
  assert.equal(billHash(s), "#users=2500&sources=2&months=18&billing=monthly");
  assert.deepEqual(parseBillHash(billHash(s)), s);
  assert.equal(parseBillHash("#faq-2"), null);
  assert.equal(parseBillHash(""), null);
  assert.deepEqual(parseBillHash("#users=0&sources=99&months=-4&billing=weekly"), { users: 1, sources: 10, months: 1, billing: "annual" });
  assert.deepEqual(parseBillHash("#users=300"), { ...DEFAULT_INPUTS, users: 300 });
});

test("every vendor has a method sentence, and Spike's says it is not computable", () => {
  const m = billMethods();
  for (const v of BILL_VENDORS) assert.ok(m[v.id]?.length > 40, `${v.id} has no method sentence`);
  assert.match(m.spike, /Not computable/);
});
