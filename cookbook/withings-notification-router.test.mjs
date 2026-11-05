/**
 * withings-notification-router.test.mjs
 *
 * The contract for withings-notification-router.mjs: the secret on the
 * callback URL is required and compared exactly; the form body Withings
 * documents is parsed; every routed category names the same follow-up call
 * as the site's /tools/webhook-verifier module (src/lib/webhookVerifier.mjs);
 * an unknown category is surfaced, not dropped; and two copies of one
 * notification produce one job key.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import { APPLI_ROUTES, CALLS, jobFor, routeWithingsNotification } from "./withings-notification-router.mjs";
import { WEBHOOK_VENDORS, buildExample, verifyWebhook } from "../src/lib/webhookVerifier.mjs";

const SECRET = "s3cret-for-tests";
const URL_OK = `https://api.example.com/withings?token=${SECRET}`;
const WITHINGS = WEBHOOK_VENDORS.find((v) => v.id === "withings");

test("Withings' example notification routes to Getmeas with its date range", () => {
  const r = routeWithingsNotification({ url: URL_OK, body: "userid=12345&appli=1&startdate=1530576000&enddate=1530698753" }, { secret: SECRET });
  assert.equal(r.ok, true);
  assert.equal(r.call, CALLS.GETMEAS);
  assert.deepEqual(r.range, { startdate: 1530576000, enddate: 1530698753, date: null });
  assert.equal(r.userid, "12345");
});

test("every category in this table names the same call as the site's verifier", () => {
  for (const appli of Object.keys(APPLI_ROUTES)) {
    const site = WITHINGS.next({ appli: Number(appli) }).join(" ");
    const mine = APPLI_ROUTES[appli];
    if (mine === CALLS.NONE) assert.match(site, /notification-only/, `appli ${appli}`);
    else assert.ok(site.includes(mine.split(" or ")[0]), `appli ${appli}: "${mine}" vs "${site}"`);
  }
});

test("the categories the verifier documents in its appli field are all routed", () => {
  const listed = [...WITHINGS.fields.appli.matchAll(/(\d+) [A-Za-z]/g)].map((m) => Number(m[1]));
  assert.deepEqual(listed, [1, 2, 4, 16, 44, 54]);
  for (const a of listed) assert.ok(APPLI_ROUTES[a], `appli ${a}`);
});

test("the site's verifier accepts the same request this router accepts", async () => {
  const ex = await buildExample("withings");
  const site = await verifyWebhook("withings", ex);
  const mine = routeWithingsNotification({ url: ex.url, body: ex.body }, { secret: ex.secret });
  assert.equal(site.status, "valid");
  assert.equal(mine.ok, true);
});

test("a missing or wrong secret is a 403 before anything is parsed", () => {
  const body = "userid=1&appli=1";
  assert.equal(routeWithingsNotification({ url: "https://api.example.com/withings", body }, { secret: SECRET }).status, 403);
  assert.equal(routeWithingsNotification({ url: "https://api.example.com/withings?token=nope", body }, { secret: SECRET }).status, 403);
  assert.equal(routeWithingsNotification({ url: URL_OK, body }, { secret: "" }).status, 403, "an empty configured secret never matches");
});

test("a body without userid or appli is a 400", () => {
  assert.equal(routeWithingsNotification({ url: URL_OK, body: "appli=1" }, { secret: SECRET }).status, 400);
  assert.equal(routeWithingsNotification({ url: URL_OK, body: "userid=1&appli=x" }, { secret: SECRET }).status, 400);
});

test("an unknown category is acknowledged and surfaced with no call", () => {
  const r = routeWithingsNotification({ url: URL_OK, body: "userid=1&appli=999" }, { secret: SECRET });
  assert.equal(r.ok, true);
  assert.equal(r.call, null);
  assert.match(r.reason, /not in this routing table/);
  assert.equal(jobFor(r), null);
});

test("appli 55 is acknowledged with nothing to fetch", () => {
  const r = routeWithingsNotification({ url: URL_OK, body: "userid=1&appli=55&date=2026-11-05" }, { secret: SECRET });
  assert.equal(r.fetch, false);
  assert.equal(jobFor(r), null);
});

test("two copies of one notification collapse to one job key; another range does not", () => {
  const body = "userid=7&appli=44&startdate=100&enddate=200";
  const a = jobFor(routeWithingsNotification({ url: URL_OK, body }, { secret: SECRET }));
  const b = jobFor(routeWithingsNotification({ url: URL_OK, body: Buffer.from(body) }, { secret: SECRET }));
  const c = jobFor(routeWithingsNotification({ url: URL_OK, body: "userid=7&appli=44&startdate=200&enddate=300" }, { secret: SECRET }));
  assert.equal(a.key, b.key);
  assert.notEqual(a.key, c.key);
  assert.equal(a.call, CALLS.SLEEP);
});

test("a custom token parameter name works", () => {
  const r = routeWithingsNotification({ url: `https://x.example/w?k=${SECRET}`, body: "userid=1&appli=16" }, { secret: SECRET, tokenParam: "k" });
  assert.equal(r.call, CALLS.ACTIVITY);
});
