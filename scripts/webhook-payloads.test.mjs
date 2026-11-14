/**
 * /webhooks: the payload library, its JSON Schemas and the mock sender.
 *
 *   node --test scripts/webhook-payloads.test.mjs     (npm run test:webhook-payloads)
 *
 * - Every documented sample validates against the schema built from that
 *   vendor's documented fields, and a sample with one field's type changed
 *   does not.
 * - public/webhooks/send-sample.mjs is current with the data
 *   (scripts/build-webhook-sender.mjs --check), and every request it builds
 *   passes /tools/webhook-verifier's own check for that vendor
 *   (src/lib/webhookVerifier.mjs), so the sender and the verifier cannot
 *   disagree about a signing rule.
 * - One run of the sender CLI against a local HTTP server, to prove the
 *   bytes it signs are the bytes it sends.
 * - Every snapshot-sourced fact is in ops/sources/evidence/webhooks.json.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { WEBHOOK_VENDORS, WEBHOOK_SOURCES, SUUNTO_FIELDS } from "../src/data/webhookPayloads.ts";
import { payloadSchema, sampleValue, validate } from "../src/lib/webhookSchemas.ts";
import { buildRequest, SAMPLES, DEMO_SECRET } from "../public/webhooks/send-sample.mjs";
import { verifyWebhook } from "../src/lib/webhookVerifier.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");

test("every documented sample matches its schema", () => {
  let n = 0;
  for (const v of WEBHOOK_VENDORS) {
    for (const p of v.payloads) {
      const schema = payloadSchema(v, p, WEBHOOK_SOURCES[p.evidence.source].url);
      assert.equal(schema.$anchor, `${v.id}-${p.id}`.toLowerCase());
      assert.match(schema.$anchor, /^[A-Za-z][-A-Za-z0-9._:]*$/);
      const value = sampleValue(p);
      if (value == null) continue;
      assert.deepEqual(validate(schema, value), [], `${v.id}/${p.id}`);
      n++;
    }
  }
  assert.ok(n >= 25, `only ${n} samples checked`);
});

test("Wahoo's example, once its token placeholder is filled, matches its schema", () => {
  const v = WEBHOOK_VENDORS.find((x) => x.id === "wahoo");
  const p = v.payloads[0];
  const value = JSON.parse(p.example.replace("<webhook_token>", JSON.stringify("t0k3n")));
  assert.deepEqual(validate(payloadSchema(v, p, ""), value), []);
});

test("a changed field type fails validation", () => {
  const v = WEBHOOK_VENDORS.find((x) => x.id === "strava");
  const p = v.payloads[0];
  const schema = payloadSchema(v, p, "");
  assert.notDeepEqual(validate(schema, { ...p.sample, object_id: "1360128428" }), []);
  assert.notDeepEqual(validate(schema, { ...p.sample, aspect_type: "rename" }), []);
  const w = WEBHOOK_VENDORS.find((x) => x.id === "withings");
  const ws = payloadSchema(w, w.payloads[0], "");
  assert.notDeepEqual(validate(ws, { userid: "abc", appli: "1" }), []);
  const g = WEBHOOK_VENDORS.find((x) => x.id === "google-health");
  const gs = payloadSchema(g, g.payloads[0], "");
  assert.notDeepEqual(validate(gs, { data: { ...g.payloads[0].sample.data, operation: "MERGE" } }), []);
  // Batched Google notifications (an array of the same objects) also validate.
  assert.deepEqual(validate(gs, [g.payloads[0].sample, g.payloads[3].sample]), []);
});

test("the sender file is current with the data", () => {
  const r = spawnSync(process.execPath, [path.join(ROOT, "scripts/build-webhook-sender.mjs"), "--check"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr || r.stdout);
});

test("the sender only embeds published examples", () => {
  for (const v of WEBHOOK_VENDORS) {
    const s = SAMPLES[v.id];
    if (!v.sender) {
      assert.equal(s, undefined, v.id);
      continue;
    }
    for (const e of s.events) {
      const p = v.payloads.find((x) => x.id === e.id);
      assert.ok(p, `${v.id}/${e.id}`);
      assert.deepEqual(e.body, p.sample ?? p.example, `${v.id}/${e.id}`);
    }
  }
});

function toVerifierInput(req) {
  return {
    method: "POST",
    url: req.url,
    headers: Object.entries(req.headers)
      .map(([k, val]) => `${k}: ${val}`)
      .join("\n"),
    body: req.body,
    secret: req.vendor === "google-health" ? `Bearer ${DEMO_SECRET}` : DEMO_SECRET,
  };
}

test("every request the sender builds passes the webhook verifier's check", async () => {
  let n = 0;
  for (const [vendorId, v] of Object.entries(SAMPLES)) {
    for (const e of v.events) {
      const req = buildRequest(vendorId, e.id, { url: "http://localhost:3000/hook" });
      const res = await verifyWebhook(vendorId, toVerifierInput(req));
      const want = vendorId === "strava" ? "unsigned" : "valid";
      assert.equal(res.status, want, `${vendorId}/${e.id}: ${res.title} ${res.detail?.join(" ")}`);
      n++;
    }
  }
  assert.ok(n >= 25);
  // And a wrong secret fails for every signed or token vendor.
  for (const vendorId of ["oura", "whoop", "terra", "polar", "withings", "wahoo", "google-health"]) {
    const req = buildRequest(vendorId, undefined, { url: "http://localhost:3000/hook", secret: "another-secret" });
    const res = await verifyWebhook(vendorId, toVerifierInput(req));
    assert.equal(res.status, "invalid", vendorId);
  }
});

test("the CLI posts the signed bytes to a local server, and refuses a remote one", async () => {
  const got = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        res.writeHead(200, { "content-type": "text/plain" }).end("ok");
        server.close();
        resolve({ headers: req.headers, body, url: req.url });
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      const child = spawn(process.execPath, [path.join(ROOT, "public/webhooks/send-sample.mjs"), "terra", "--url", `http://127.0.0.1:${port}/terra`], { stdio: "pipe" });
      child.on("error", reject);
    });
  });
  assert.equal(got.url, "/terra");
  const res = await verifyWebhook("terra", { method: "POST", url: "", headers: { "x-terra-signature": got.headers["x-terra-signature"] }, body: got.body, secret: DEMO_SECRET });
  assert.equal(res.status, "valid", res.title);
  const r = spawnSync(process.execPath, [path.join(ROOT, "public/webhooks/send-sample.mjs"), "polar", "--url", "https://example.com/x"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Refusing/);
});

test("every snapshot-sourced fact is in the evidence file", () => {
  const evidence = JSON.parse(readFileSync(path.join(ROOT, "ops/sources/evidence/webhooks.json"), "utf8"));
  const have = new Set(evidence.map((r) => `${r.url}\n${r.quote}`));
  const facts = [SUUNTO_FIELDS];
  for (const v of WEBHOOK_VENDORS) facts.push(v.signature, v.respond, v.retries, ...v.notes, ...v.payloads.map((p) => p.evidence));
  for (const f of facts) {
    const src = WEBHOOK_SOURCES[f.source];
    assert.ok(src, f.source);
    assert.ok(f.quote.length >= 12, f.quote);
    if (src.via === "snapshot") assert.ok(have.has(`${src.url}\n${f.quote}`), `not in evidence: ${f.quote}`);
  }
});

test("Terra's retry wording is the current one", () => {
  const t = WEBHOOK_VENDORS.find((v) => v.id === "terra");
  assert.match(t.retries.quote, /exponential backoff for several hours/);
});
