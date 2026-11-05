/**
 * Tests for @aifitnessapi/api-client, run against the site's build output,
 * never the network:
 *
 *   npm run build && node --test packages/api-client/test/run.mjs   (npm run test:api-client)
 *
 * 1. The generated src/schema.ts matches what scripts/build-api-client.mjs
 *    renders from the built /api/v1/openapi.json (the same check as qa's
 *    API-CLIENT-DRIFT gate).
 * 2. The package type-checks on its own with tsconfig.build.json, including
 *    test/types.ts, the compile-time contract.
 * 3. The compiled client, given a fetch that serves the files the build wrote
 *    under .next/server/app/api/v1, reads the index, every collection and one
 *    item per collection, and each response has exactly the fields its
 *    generated type names; an unknown id is ApiError 404 from get() and null
 *    from find().
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

import { BUILT_OPENAPI, OUT, renderSchemaModule } from "../../../scripts/build-api-client.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const PKG = path.join(ROOT, "packages/api-client");
const BUILT = path.join(ROOT, ".next/server/app");
const ts = createRequire(import.meta.url)("typescript");

if (!fs.existsSync(path.join(ROOT, BUILT_OPENAPI))) {
  console.error("No build output: run `npm run build` first. These tests read the built /api/v1, not the network.");
  process.exit(1);
}
const openapi = JSON.parse(fs.readFileSync(path.join(ROOT, BUILT_OPENAPI), "utf8"));

test("schema.ts is what the generator renders from the built OpenAPI document", () => {
  const want = renderSchemaModule(openapi);
  const have = fs.readFileSync(path.join(ROOT, OUT), "utf8");
  assert.equal(have, want, "run: node scripts/build-api-client.mjs");
});

/** Compile src + the type contract into a temp dir; return the compiled index URL. */
function compile() {
  const cfg = ts.readConfigFile(path.join(PKG, "tsconfig.build.json"), ts.sys.readFile).config;
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "api-client-"));
  const parsed = ts.parseJsonConfigFileContent({ ...cfg, include: ["src/**/*.ts", "test/types.ts"] }, ts.sys, PKG);
  const program = ts.createProgram(parsed.fileNames, { ...parsed.options, rootDir: PKG, outDir, declaration: false });
  const emit = program.emit();
  const diags = ts.getPreEmitDiagnostics(program).concat(emit.diagnostics);
  const text = diags.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n");
  fs.writeFileSync(path.join(outDir, "package.json"), '{"type":"module"}');
  return { diags: text, index: pathToFileURL(path.join(outDir, "src/index.js")).href, outDir };
}

const compiled = compile();

test("the package type-checks on its own, including the type contract", () => {
  assert.equal(compiled.diags, "");
});

/** A fetch that answers from the files `next build` wrote. */
function builtFetch(calls) {
  return async (url) => {
    calls.push(url);
    const u = new URL(url);
    assert.equal(u.origin, "https://aifitnessapi.com");
    const file = path.join(BUILT, `${u.pathname}.body`);
    const inside = path.resolve(file).startsWith(BUILT + path.sep);
    if (!inside || !fs.existsSync(file)) return { ok: false, status: 404, json: async () => ({ error: "not found" }) };
    const body = fs.readFileSync(file, "utf8");
    return { ok: true, status: 200, json: async () => JSON.parse(body) };
  };
}

const { createClient, ApiError, COLLECTION_KEYS } = await import(compiled.index);
const calls = [];
const client = createClient({ fetch: builtFetch(calls) });

/** Field names a generated interface declares, read back from the OpenAPI schema it came from. */
function declaredFields(schemaName) {
  return Object.keys(openapi.components.schemas[schemaName].properties).sort();
}

test("the index lists exactly the collections the client knows", async () => {
  const idx = await client.index();
  assert.equal(idx.apiVersion, "v1");
  const paths = idx.collections.map((c) => new URL(c.url).pathname.replace(/^\/api\/v1\//, "")).sort();
  assert.deepEqual(paths, Object.keys(COLLECTION_KEYS).sort());
  for (const c of idx.collections) {
    const p = new URL(c.url).pathname.replace(/^\/api\/v1\//, "");
    assert.equal(c.key, COLLECTION_KEYS[p], p);
  }
});

test("openapi() returns the document the types were generated from", async () => {
  const doc = await client.openapi();
  assert.equal(doc.openapi, "3.1.0");
  assert.equal(renderSchemaModule(doc), fs.readFileSync(path.join(ROOT, OUT), "utf8"));
});

for (const p of Object.keys(COLLECTION_KEYS)) {
  test(`${p}: list, then get the first item by its key`, async () => {
    const list = await client.list(p);
    assert.equal(list.count, list.items.length);
    assert.equal(list.key, COLLECTION_KEYS[p]);
    assert.ok(list.items.length > 0);
    const op = openapi.paths[`/api/v1/${p}`].get.responses["200"].content["application/json"].schema.$ref.split("/").pop();
    const rowName = openapi.components.schemas[op].properties.items.items.$ref.split("/").pop();
    const want = declaredFields(rowName);
    for (const row of list.items) assert.deepEqual(Object.keys(row).sort(), want, `${p} row fields`);

    const first = list.items[0];
    const id = first[client.keyOf(p)];
    const one = await client.get(p, id);
    assert.equal(one.id, id);
    assert.equal(one.key, COLLECTION_KEYS[p]);
    for (const [k, v] of Object.entries(first)) assert.deepEqual(one.item[k], v, `${p}/${id} ${k}`);
    const itemRef = openapi.paths[`/api/v1/${p}/{${COLLECTION_KEYS[p]}}`].get.responses["200"].content["application/json"].schema.$ref.split("/").pop();
    const itemSchema = openapi.components.schemas[itemRef].properties.item.$ref.split("/").pop();
    assert.deepEqual(Object.keys(one.item).sort(), declaredFields(itemSchema), `${p} item fields`);
    assert.equal(client.url(p, id), `https://aifitnessapi.com/api/v1/${p}/${id}`);
  });
}

test("an unknown id is ApiError 404 from get() and null from find()", async () => {
  await assert.rejects(client.get("healthkit/types", "notAType"), (e) => e instanceof ApiError && e.status === 404);
  assert.equal(await client.find("healthkit/types", "notAType"), null);
  assert.equal(await client.find("healthkit/types", "../../etc"), null, "an id outside [A-Za-z0-9._-] is never fetched");
});

test("ids are case-sensitive, as the API documents", async () => {
  const list = await client.list("healthkit/types");
  const id = list.items.find((r) => /[A-Z]/.test(r.identifier))?.identifier ?? list.items[0].identifier;
  const flipped = id === id.toLowerCase() ? id.toUpperCase() : id.toLowerCase();
  assert.equal(await client.find("healthkit/types", flipped), null);
});

test("bad arguments fail before any request", () => {
  const before = calls.length;
  assert.throws(() => client.url("healthkit/typo"), RangeError);
  assert.throws(() => client.url("healthkit/types", "a/b"), RangeError);
  assert.equal(calls.length, before);
});

test("a custom baseUrl is used, with any trailing slash removed", () => {
  const c = createClient({ baseUrl: "http://localhost:3000/", fetch: async () => ({ ok: true, status: 200, json: async () => ({}) }) });
  assert.equal(c.url("matrix"), "http://localhost:3000/api/v1/matrix");
});

test.after(() => fs.rmSync(compiled.outDir, { recursive: true, force: true }));
