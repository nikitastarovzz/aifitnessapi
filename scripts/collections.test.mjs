// Tests for the Postman and Bruno collections (src/lib/apiCollections.mjs, scripts/build-collections.mjs).
//
// Postman's v2.1.0 JSON Schema (https://schema.getpostman.com/json/collection/v2.1.0/collection.json)
// was read on 2026-11-06 through source-snapshot.yml and every generated file validated against it
// with ajv. The schema is Postman's, so it is not committed; the structural checks below encode the
// parts of it these files use. If a copy is placed at .cache/postman/collection-v2.1.json (gitignored)
// and ajv is installed, the last test validates against it in full.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { brunoFiles, bruRequest, postmanCollection, POSTMAN_SCHEMA } from "../src/lib/apiCollections.mjs";
import { refreshCurl, tokenCurl } from "../src/lib/oauthPlayground.ts";
import { collections } from "./build-collections.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const all = await collections();
const { OAUTH_VENDORS } = await import("../src/data/oauthVendors.ts");
const { WEBHOOK_VENDORS } = await import("../src/data/webhookPayloads.ts");

test("public/collections is current", () => {
  execFileSync(process.execPath, ["--no-warnings", path.join(ROOT, "scripts/build-collections.mjs"), "--check"], { cwd: ROOT, stdio: "pipe" });
});

test("one collection per vendor in the OAuth or webhook data", () => {
  const ids = new Set([...OAUTH_VENDORS.map((v) => v.id), ...WEBHOOK_VENDORS.filter((w) => w.payloads.some((p) => p.sample != null || w.id === "wahoo")).map((w) => w.id)]);
  assert.deepEqual(new Set(all.map((c) => c.id)), ids);
});

const METHODS = new Set(["GET", "PUT", "POST", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS", "LINK", "UNLINK", "PURGE", "LOCK", "UNLOCK", "PROPFIND", "VIEW"]);

test("Postman files have the v2.1.0 shape (info, item, request, url, body, auth, variable)", () => {
  for (const c of all) {
    const p = postmanCollection(c);
    assert.equal(p.info.schema, POSTMAN_SCHEMA);
    assert.equal(typeof p.info.name, "string");
    assert.ok(Array.isArray(p.item) && p.item.length);
    for (const folder of p.item) {
      assert.ok(Array.isArray(folder.item) && folder.item.length, `${c.id}/${folder.name} has items`);
      for (const it of folder.item) {
        const r = it.request;
        assert.ok(METHODS.has(r.method), `${c.id}: method ${r.method}`);
        assert.ok(typeof r.url === "string" || typeof r.url.raw === "string");
        for (const h of r.header) assert.ok(typeof h.key === "string" && typeof h.value === "string");
        if (r.body) {
          assert.ok(["raw", "urlencoded"].includes(r.body.mode));
          if (r.body.mode === "raw") JSON.parse(r.body.raw.replace(/\{\{\w+\}\}/g, "x"));
          if (r.body.mode === "urlencoded") for (const f of r.body.urlencoded) assert.ok(typeof f.key === "string" && typeof f.value === "string" && f.type === "text");
        }
        if (r.auth) {
          assert.equal(r.auth.type, "basic");
          assert.deepEqual(r.auth.basic.map((a) => a.key), ["username", "password"]);
        }
      }
    }
    for (const v of p.variable) assert.ok(typeof v.key === "string" && typeof v.value === "string" && v.type === "string");
  }
});

test("no secret ships: client_secret, codes, tokens and PKCE values are empty", () => {
  for (const c of all) {
    for (const v of c.variables) if (!["scope", "local_url"].includes(v.key)) assert.equal(v.value, "", `${c.id}: ${v.key}`);
    const text = JSON.stringify(postmanCollection(c));
    assert.doesNotMatch(text, /"client_secret","value":"[^{"]/);
  }
});

/** The fields a curl command posts: --data-urlencode pairs, or the query string of a query-style POST. */
function curlFields(cmd) {
  const form = [...cmd.matchAll(/--data-urlencode ['"]([^=]+)=/g)].map((m) => m[1]);
  if (form.length) return form;
  const q = /curl -X POST "[^?]+\?([^"]+)"/.exec(cmd);
  return q ? q[1].split("&").map((kv) => kv.split("=")[0]) : [];
}

test("token and refresh requests carry exactly the OAuth playground's fields", () => {
  for (const v of OAUTH_VENDORS) {
    const c = all.find((x) => x.id === v.id);
    const reqs = c.folders.find((f) => f.name === "OAuth 2.0").requests;
    const fields = (r) => (r.body?.mode === "urlencoded" ? r.body.fields.filter((f) => !f.disabled).map((f) => f.key) : r.query.map((q) => q.key));
    const input = { clientId: "id", redirectUri: "https://example.com/cb" };
    assert.deepEqual(fields(reqs.find((r) => r.name.startsWith("2. "))), curlFields(tokenCurl(v, input)), `${v.id} token fields`);
    const refresh = reqs.find((r) => r.name.startsWith("3. "));
    const rc = refreshCurl(v, input);
    if (rc === null) assert.equal(refresh, undefined, `${v.id} documents no refresh call`);
    else assert.deepEqual(fields(refresh), curlFields(rc), `${v.id} refresh fields`);
    const basic = v.clientAuth === "basic";
    assert.equal(reqs.find((r) => r.name.startsWith("2. ")).basicAuth, basic, `${v.id} basic auth`);
    if (v.pkce.status !== "not-documented" && v.tokenStyle === "query") {
      const pk = reqs.find((r) => r.name.startsWith("2b. "));
      assert.deepEqual(fields(pk), curlFields(tokenCurl(v, { ...input, verifier: "v" })), `${v.id} PKCE token fields`);
    }
  }
});

test("webhook samples are the vendors' printed examples", () => {
  for (const w of WEBHOOK_VENDORS) {
    const c = all.find((x) => x.id === w.id);
    const folder = c?.folders.find((f) => f.name === "Webhook samples");
    const printable = w.payloads.filter((p) => p.sample != null || w.id === "wahoo");
    assert.equal(folder?.requests.length ?? 0, printable.length, `${w.id} sample count`);
    for (const r of folder?.requests ?? []) {
      assert.equal(r.url, "{{local_url}}");
      const p = printable.find((x) => x.title === r.name);
      if (p.sample != null && p.encoding === "json") assert.deepEqual(JSON.parse(r.body.raw), p.sample);
      if (p.sample != null && p.encoding === "form") assert.deepEqual(Object.fromEntries(r.body.fields.map((f) => [f.key, f.value])), Object.fromEntries(new URLSearchParams(p.sample)));
    }
  }
});

/** Bru files: balanced top-level blocks, the blocks Bruno requires, names Bruno parses. */
function checkBru(text, where) {
  const blocks = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = /^([a-z:-]+) (\{|\[)$/.exec(lines[i]);
    if (!m) continue;
    const close = m[2] === "{" ? "}" : "]";
    const end = lines.indexOf(close, i + 1);
    assert.ok(end > i, `${where}: block ${m[1]} is not closed`);
    blocks.push(m[1]);
    i = end;
  }
  return blocks;
}

test("Bruno folders: bruno.json, a .bru per request with meta and a method block, a Local environment", () => {
  for (const c of all) {
    const files = brunoFiles(c);
    assert.deepEqual(JSON.parse(files["bruno.json"]), { version: "1", name: `${c.name} (aifitnessapi.com)`, type: "collection" });
    const env = checkBru(files["environments/Local.bru"], `${c.id} env`);
    assert.equal(env[0], "vars");
    let n = 0;
    for (const [f, text] of Object.entries(files)) {
      if (!f.endsWith(".bru") || f.startsWith("environments/") || f === "collection.bru" || f.endsWith("folder.bru")) continue;
      const blocks = checkBru(text, `${c.id}/${f}`);
      assert.equal(blocks[0], "meta", `${c.id}/${f}`);
      assert.ok(blocks.includes("get") || blocks.includes("post"), `${c.id}/${f} method block`);
      assert.match(text, /^  body: (none|json|formUrlEncoded)$/m);
      n++;
    }
    assert.equal(n, c.folders.reduce((s, fo) => s + fo.requests.length, 0));
  }
});

test("bruRequest quotes keys Bru would misread and marks disabled fields", () => {
  const t = bruRequest(
    { name: "x", method: "POST", url: "https://a.example/t", query: [], headers: [{ key: "a b", value: "1" }], body: { mode: "urlencoded", fields: [{ key: "k", value: "v", disabled: true }] }, basicAuth: false, description: "" },
    1,
  );
  assert.match(t, /^  "a b": 1$/m);
  assert.match(t, /^  ~k: v$/m);
});

test("full v2.1.0 schema validation when a local copy of Postman's schema is present", async (t) => {
  const schemaFile = path.join(ROOT, ".cache/postman/collection-v2.1.json");
  if (!fs.existsSync(schemaFile)) return t.skip("no .cache/postman/collection-v2.1.json");
  let Ajv;
  try {
    Ajv = (await import("ajv")).default;
  } catch {
    return t.skip("ajv is not installed");
  }
  const ajv = new Ajv({ schemaId: "id", allErrors: true, unknownFormats: "ignore" });
  ajv.addMetaSchema(JSON.parse(fs.readFileSync(path.join(ROOT, "node_modules/ajv/lib/refs/json-schema-draft-04.json"), "utf8")));
  const validate = ajv.compile(JSON.parse(fs.readFileSync(schemaFile, "utf8")));
  for (const c of all) assert.ok(validate(postmanCollection(c)), `${c.id}: ${JSON.stringify(validate.errors?.slice(0, 2))}`);
});
