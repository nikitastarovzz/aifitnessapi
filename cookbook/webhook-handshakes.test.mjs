/**
 * webhook-handshakes.test.mjs
 *
 * The contract for webhook-handshakes.mjs: each vendor's validation request,
 * built the way the vendor's page describes it, gets the documented answer;
 * a wrong token gets a refusal; and an ordinary event is passed through
 * untouched so signature checks still run. Oura's and Strava's replies are
 * compared with the reply the site's /tools/webhook-verifier module builds.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import { answerHandshake } from "./webhook-handshakes.mjs";
import { buildExample, verifyWebhook } from "../src/lib/webhookVerifier.mjs";

test("Oura: a matching verification_token echoes the challenge as JSON", () => {
  const r = answerHandshake("oura", { method: "GET", url: "/oura?verification_token=tok&challenge=abc123" }, { verificationToken: "tok" });
  assert.equal(r.handled, true);
  assert.equal(r.status, 200);
  assert.equal(r.headers["content-type"], "application/json");
  assert.deepEqual(JSON.parse(r.body), { challenge: "abc123" });
});

test("Oura: a wrong token gets 401, as in Oura's sample", () => {
  const r = answerHandshake("oura", { method: "GET", url: "/oura?verification_token=bad&challenge=abc" }, { verificationToken: "tok" });
  assert.equal(r.status, 401);
  assert.equal(r.body, "");
});

test("Oura: the reply matches the one the site's verifier builds", async () => {
  const url = "https://your-server.com/oura-webhook?verification_token=tok&challenge=c-77";
  const site = await verifyWebhook("oura", { method: "GET", url, headers: "", body: "", secret: "tok" });
  const mine = answerHandshake("oura", { method: "GET", url }, { verificationToken: "tok" });
  assert.equal(mine.body, site.reply);
});

test("Strava: hub.challenge is echoed under its own key", () => {
  const url = "/strava?hub.verify_token=STRAVA&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.mode=subscribe";
  const r = answerHandshake("strava", { method: "get", url }, { verifyToken: "STRAVA" });
  assert.equal(r.status, 200);
  assert.deepEqual(JSON.parse(r.body), { "hub.challenge": "15f7d1a91c1f40f8a748fd134752feb3" });
});

test("Strava: the reply matches the site's verifier for its documented example", async () => {
  const ex = await buildExample("strava");
  const site = await verifyWebhook("strava", ex);
  const mine = answerHandshake("strava", { method: ex.method, url: ex.url }, { verifyToken: ex.secret });
  assert.equal(mine.body, site.reply);
});

test("Strava: a wrong verify_token is refused, and an event POST is passed through", () => {
  const url = "/strava?hub.verify_token=nope&hub.challenge=x&hub.mode=subscribe";
  assert.equal(answerHandshake("strava", { method: "GET", url }, { verifyToken: "STRAVA" }).status, 403);
  const event = { method: "POST", url: "/strava", body: '{"object_type":"activity","aspect_type":"create","object_id":1}' };
  assert.equal(answerHandshake("strava", event, { verifyToken: "STRAVA" }).handled, false);
});

test("Polar: a PING gets 200 with no body; an EXERCISE event is passed through", () => {
  const ping = answerHandshake("polar", { method: "POST", url: "/polar", body: '{"event":"PING","timestamp":"2018-05-15T14:22:24Z"}' });
  assert.deepEqual([ping.handled, ping.status, ping.body], [true, 200, ""]);
  const ex = answerHandshake("polar", { method: "POST", url: "/polar", body: '{"event":"EXERCISE","user_id":475}' });
  assert.equal(ex.handled, false);
});

test("Withings: HEAD answers 2xx; the form-encoded POST is passed through", () => {
  assert.equal(answerHandshake("withings", { method: "HEAD", url: "/withings?token=s" }).status, 200);
  const post = { method: "POST", url: "/withings?token=s", body: "userid=12345&appli=1&startdate=1530576000&enddate=1530698753" };
  assert.equal(answerHandshake("withings", post).handled, false);
});

test("Google Health API: the credentialed verification gets 200, the bare one 401", () => {
  const cfg = { authorization: "Bearer s3cret" };
  const body = '{"type":"verification"}';
  const withAuth = answerHandshake("google", { method: "POST", url: "/g", headers: { Authorization: "Bearer s3cret" }, body }, cfg);
  const without = answerHandshake("google", { method: "POST", url: "/g", headers: {}, body }, cfg);
  const wrong = answerHandshake("google", { method: "POST", url: "/g", headers: { authorization: "Bearer other" }, body }, cfg);
  assert.equal(withAuth.status, 200);
  assert.equal(without.status, 401);
  assert.equal(wrong.status, 401);
});

test("Google Health API: a data notification, single or batched, is passed through", () => {
  const cfg = { authorization: "Bearer s3cret" };
  const one = '{"data":{"version":"1","operation":"UPSERT","dataType":"steps"}}';
  const batch = `[${one},${one}]`;
  assert.equal(answerHandshake("google", { method: "POST", url: "/g", headers: { authorization: "Bearer s3cret" }, body: one }, cfg).handled, false);
  assert.equal(answerHandshake("google", { method: "POST", url: "/g", headers: { authorization: "Bearer s3cret" }, body: batch }, cfg).handled, false);
});

test("a body that is not JSON is passed through rather than thrown on", () => {
  assert.equal(answerHandshake("polar", { method: "POST", url: "/p", body: "garbage" }).handled, false);
  assert.equal(answerHandshake("google", { method: "POST", url: "/g", body: "garbage" }, { authorization: "x" }).handled, false);
});

test("an unknown vendor is a programming error", () => {
  assert.throws(() => answerHandshake("garmin", { method: "GET", url: "/" }), /no handshake rule/);
});
