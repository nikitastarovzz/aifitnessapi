/**
 * /tools/starter-scaffold: every template the page can produce compiles and
 * verifies. Tested through the module the page imports
 * (src/lib/starterScaffold.mjs) and the ZIP writer it downloads with.
 *
 *   node --test scripts/starter-scaffold.test.mjs      (npm run test:scaffold)
 *
 * For each stack, with each vendor alone and with all of them:
 *   - Express: `node --check` on every file; then the server is started on a
 *     free port and driven over HTTP: the OAuth start redirect, the callback
 *     against a fake token endpoint, and each vendor's webhook built by the
 *     site's /tools/webhook-verifier module from that vendor's documentation
 *     (accepted), tampered (refused), and every handshake.
 *   - Next.js: `tsc --noEmit --strict` over the generated project against the
 *     repository's own next and @types/node; then the webhook module is
 *     transpiled and run against the same examples.
 *   - FastAPI: `python -m py_compile` on every file, then the standard-library
 *     webhook module is run against the same examples (FastAPI itself is not
 *     needed for that, so the check runs wherever python3 does; it is skipped,
 *     loudly, where python3 is missing).
 * And the archive: the ZIP writer's output is read back by the site's own ZIP
 * reader and, where available, Python's zipfile, byte for byte.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

import { SCAFFOLD_STACKS, SCAFFOLD_VENDORS, generateScaffold, slugifyProject } from "../src/lib/starterScaffold.mjs";
import { crc32, zipFiles } from "../src/lib/zipWriter.mjs";
import { listZipEntries } from "../src/lib/appleHealthExport.mjs";
import { buildExample, parseHeaders } from "../src/lib/webhookVerifier.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ts = createRequire(import.meta.url)("typescript");
const PY = spawnSync("python3", ["--version"]).status === 0 ? "python3" : null;
const ALL = SCAFFOLD_VENDORS.map((v) => v.id);
const COMBOS = [...ALL.map((v) => [v]), ALL];

/** A scratch directory inside the repository, so `express` and `next` resolve from its node_modules. */
const WORK = fs.mkdtempSync(path.join(ROOT, ".scaffold-test-"));
test.after(() => fs.rmSync(WORK, { recursive: true, force: true }));

function writeOut(dir, files) {
  for (const f of files) {
    const p = path.join(dir, f.path);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, f.content);
  }
  return path.join(dir, files[0].path.split("/")[0]);
}

/** Every webhook example the site's verifier builds, as { vendor, method, url, headers, body, secret }. */
const EXAMPLES = Object.fromEntries(await Promise.all(ALL.map(async (id) => [id, await buildExample(id)])));
const SECRET = EXAMPLES.oura.secret;
const ENV = {
  OURA_CLIENT_SECRET: SECRET,
  OURA_VERIFICATION_TOKEN: "oura-verification-token",
  WHOOP_CLIENT_SECRET: SECRET,
  POLAR_WEBHOOK_SECRET: SECRET,
  STRAVA_VERIFY_TOKEN: SECRET,
  WAHOO_WEBHOOK_TOKEN: SECRET,
};

/** One request per case, with what the generated endpoint must answer. */
function webhookCases(vendors) {
  const out = [];
  for (const id of vendors) {
    const ex = EXAMPLES[id];
    const headers = parseHeaders(ex.headers);
    if (ex.method === "POST") {
      out.push({ id, name: "documented example", method: "POST", query: {}, headers, body: ex.body, status: 200 });
      const tampered = ex.body.replace(/"([a-z_]+)":\s*"/, '"$1": "x');
      out.push({ id, name: "tampered body", method: "POST", query: {}, headers, body: tampered, status: id === "strava" || id === "wahoo" ? 200 : 401 });
      // Strava signs nothing and Wahoo's token proves the sender, not the body: a changed body still passes.
    } else {
      const query = Object.fromEntries(new URL(ex.url).searchParams);
      out.push({ id, name: "handshake", method: "GET", query, headers: {}, body: "", status: 200, json: { "hub.challenge": query["hub.challenge"] } });
      out.push({ id, name: "handshake, wrong token", method: "GET", query: { ...query, "hub.verify_token": "nope" }, headers: {}, body: "", status: 403 });
      out.push({ id, name: "event (unsigned by Strava)", method: "POST", query: {}, headers: { "content-type": "application/json" }, body: '{"object_type":"activity","object_id":1,"aspect_type":"create","owner_id":2,"subscription_id":3}', status: 200 });
    }
    if (id === "oura") {
      out.push({ id, name: "handshake", method: "GET", query: { verification_token: ENV.OURA_VERIFICATION_TOKEN, challenge: "c-1" }, headers: {}, body: "", status: 200, json: { challenge: "c-1" } });
      out.push({ id, name: "handshake, wrong token", method: "GET", query: { verification_token: "nope", challenge: "c-1" }, headers: {}, body: "", status: 401 });
    }
    if (id === "polar") out.push({ id, name: "PING", method: "POST", query: {}, headers: {}, body: '{"event":"PING","timestamp":"2018-05-15T14:22:24Z"}', status: 200 });
    if (id === "wahoo") out.push({ id, name: "wrong token", method: "POST", query: {}, headers: {}, body: EXAMPLES.wahoo.body.replace(SECRET, "nope"), status: 401 });
  }
  return out;
}

test("every stack and vendor is offered, and project names are slugged", () => {
  assert.deepEqual(SCAFFOLD_STACKS.map((s) => s.id), ["express", "nextjs", "fastapi"]);
  assert.deepEqual(ALL, ["oura", "whoop", "polar", "strava", "wahoo"]);
  assert.equal(slugifyProject("My App!"), "my-app");
  assert.equal(slugifyProject(""), "fitness-integration");
  assert.throws(() => generateScaffold({ stack: "express", vendors: [] }), /at least one/);
  assert.throws(() => generateScaffold({ stack: "rails", vendors: ["oura"] }), /unknown stack/);
  assert.throws(() => generateScaffold({ stack: "express", vendors: ["garmin"] }), /unknown vendor/);
});

test("each vendor's webhook rule is the site verifier's", () => {
  for (const v of SCAFFOLD_VENDORS) {
    assert.ok(v.webhook.source.startsWith("https://"), v.id);
    assert.ok(["hmac", "handshake", "token"].includes(v.webhook.kind), v.id);
  }
});

test("the ZIP writer's archive reads back byte for byte", async () => {
  const { files } = generateScaffold({ stack: "nextjs", vendors: ALL, project: "zip-check" });
  const zip = zipFiles(files);
  assert.deepEqual(zipFiles(files), zip, "same input, same bytes");
  const entries = await listZipEntries(async (o, n) => zip.subarray(o, o + n), zip.length);
  assert.deepEqual(entries.map((e) => e.name), files.map((f) => f.path));
  for (const [i, e] of entries.entries()) {
    assert.equal(e.method, 0);
    const bytes = zip.subarray(e.dataOffset, e.dataOffset + e.size);
    assert.equal(new TextDecoder().decode(bytes), files[i].content);
  }
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926, "CRC-32 check value");
  assert.throws(() => zipFiles([{ path: "../x", content: "" }]), /unsafe/);
  if (PY) {
    const zp = path.join(WORK, "check.zip");
    fs.writeFileSync(zp, zip);
    const out = execFileSync(PY, ["-I", "-c", "import sys,zipfile,json; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print(json.dumps({n: z.read(n).decode() for n in z.namelist()}))", zp]);
    assert.deepEqual(JSON.parse(out), Object.fromEntries(files.map((f) => [f.path, f.content])));
  }
});

/* ───────────────────────────── Express ───────────────────────────── */

for (const vendors of COMBOS) {
  test(`express [${vendors.join(", ")}]: node --check, then OAuth and webhooks over HTTP`, async () => {
    const { files } = generateScaffold({ stack: "express", vendors, project: `express-${vendors.length === 1 ? vendors[0] : "all"}` });
    const dir = writeOut(path.join(WORK, `express-${vendors.join("-")}`), files);
    for (const f of files.filter((f) => f.path.endsWith(".mjs"))) execFileSync(process.execPath, ["--check", path.join(dir, f.path.split("/").slice(1).join("/"))]);
    assert.ok(files.some((f) => f.path.endsWith(".env.example")) && files.some((f) => f.path.endsWith("README.md")));

    Object.assign(process.env, ENV, { APP_BASE_URL: "http://localhost:3000" });
    for (const v of SCAFFOLD_VENDORS) process.env[`${v.env}_CLIENT_ID`] = `${v.id}-client`;
    process.env.POLAR_CLIENT_SECRET = "polar-secret";
    const { createApp } = await import(`${pathToFileURL(path.join(dir, "src/server.mjs")).href}?v=${vendors.join("-")}`);
    const tokenCalls = [];
    const saved = [];
    const tokens = { get: async () => null, save: async (...a) => void saved.push(a), delete: async () => {} };
    const fetchImpl = async (url, init) => {
      tokenCalls.push({ url, init });
      return { ok: true, status: 200, json: async () => ({ access_token: "at", refresh_token: "rt", expires_in: 3600 }) };
    };
    const server = createApp({ tokens, fetchImpl }).listen(0);
    await new Promise((r) => server.once("listening", r));
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      for (const id of vendors) {
        const v = SCAFFOLD_VENDORS.find((x) => x.id === id);
        const start = await fetch(`${base}/oauth/${id}/start?user=u1`, { redirect: "manual" });
        assert.equal(start.status, 302, id);
        const loc = new URL(start.headers.get("location"));
        assert.equal(`${loc.origin}${loc.pathname}`, v.authorizeUrl, id);
        assert.equal(loc.searchParams.get("redirect_uri"), `http://localhost:3000/oauth/${id}/callback`);
        assert.equal(loc.searchParams.get("scope"), v.scopes.join(v.scopeSeparator));
        assert.equal(loc.searchParams.has("code_challenge"), v.pkce, `${id} PKCE`);
        if (v.stateLength) assert.equal(loc.searchParams.get("state").length, v.stateLength);

        const cb = await fetch(`${base}/oauth/${id}/callback?code=c1&state=${loc.searchParams.get("state")}`);
        assert.equal(cb.status, 200, `${id} callback`);
        const call = tokenCalls.at(-1);
        assert.equal(call.url, v.tokenUrl);
        const form = new URLSearchParams(String(call.init.body));
        assert.equal(form.get("grant_type"), "authorization_code");
        if (v.tokenAuth === "basic") {
          assert.equal(call.init.headers.authorization, `Basic ${Buffer.from(`${id}-client:polar-secret`).toString("base64")}`);
          assert.equal(form.has("client_secret"), false);
        } else assert.equal(form.get("client_id"), `${id}-client`);
        assert.equal(form.has("code_verifier"), v.pkce);
        assert.deepEqual(saved.at(-1).slice(0, 2), ["u1", id]);
        assert.equal(saved.at(-1)[2].refreshToken, "rt");
        const replay = await fetch(`${base}/oauth/${id}/callback?code=c1&state=${loc.searchParams.get("state")}`);
        assert.equal(replay.status, 400, `${id}: a state is single-use`);
      }
      for (const c of webhookCases(vendors)) {
        const qs = new URLSearchParams(c.query).toString();
        const res = await fetch(`${base}/webhooks/${c.id}${qs ? `?${qs}` : ""}`, { method: c.method, headers: c.headers, body: c.method === "GET" ? undefined : c.body });
        assert.equal(res.status, c.status, `${c.id}: ${c.name}`);
        if (c.json) assert.deepEqual(await res.json(), c.json, `${c.id}: ${c.name}`);
      }
      assert.equal((await fetch(`${base}/webhooks/${vendors[0]}`, { method: "HEAD" })).status, 200);
      assert.equal((await fetch(`${base}/webhooks/garmin`, { method: "POST", body: "{}" })).status, 404);
    } finally {
      server.close();
    }
  });
}

/* ───────────────────────────── Next.js ───────────────────────────── */

async function runTsWebhooks(dir, vendors) {
  const out = path.join(dir, ".compiled");
  fs.mkdirSync(out, { recursive: true });
  for (const name of ["vendors", "oauth", "webhooks", "tokenStore"]) {
    const src = fs.readFileSync(path.join(dir, "lib", `${name}.ts`), "utf8");
    const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    fs.writeFileSync(path.join(out, `${name}.mjs`), js.replace(/from "\.\/(\w+)"/g, 'from "./$1.mjs"'));
  }
  const { checkWebhook } = await import(pathToFileURL(path.join(out, "webhooks.mjs")).href);
  for (const c of webhookCases(vendors)) {
    const r = checkWebhook(c.id, c.method, new Headers(c.headers), new URLSearchParams(c.query), Buffer.from(c.body));
    const status = "reply" in r ? r.reply.status : 200;
    assert.equal(status, c.status, `${c.id}: ${c.name}`);
    if (c.json) assert.deepEqual(r.reply.json, c.json);
  }
}

for (const vendors of COMBOS) {
  test(`nextjs [${vendors.join(", ")}]: tsc --strict, then the webhook checks`, async () => {
    const { files } = generateScaffold({ stack: "nextjs", vendors, project: `next-${vendors.length === 1 ? vendors[0] : "all"}` });
    const dir = writeOut(path.join(WORK, `next-${vendors.join("-")}`), files);
    const cfg = JSON.parse(files.find((f) => f.path.endsWith("tsconfig.json")).content);
    const parsed = ts.parseJsonConfigFileContent(cfg, ts.sys, dir);
    const program = ts.createProgram(parsed.fileNames, parsed.options);
    const diags = ts.getPreEmitDiagnostics(program).map((d) => `${d.file ? path.relative(dir, d.file.fileName) : ""}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`);
    assert.deepEqual(diags, []);
    assert.ok(parsed.fileNames.some((f) => f.endsWith("app/api/webhooks/[vendor]/route.ts")));
    Object.assign(process.env, ENV);
    await runTsWebhooks(dir, vendors);
  });
}

/* ───────────────────────────── FastAPI ───────────────────────────── */

for (const vendors of COMBOS) {
  test(`fastapi [${vendors.join(", ")}]: py_compile, then the webhook checks`, { skip: PY ? false : "python3 is not installed here" }, () => {
    const { files } = generateScaffold({ stack: "fastapi", vendors, project: `py-${vendors.length === 1 ? vendors[0] : "all"}` });
    const dir = writeOut(path.join(WORK, `py-${vendors.join("-")}`), files);
    const pyFiles = files.filter((f) => f.path.endsWith(".py")).map((f) => path.join(dir, f.path.split("/").slice(1).join("/")));
    execFileSync(PY, ["-I", "-m", "py_compile", ...pyFiles], { env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", PYTHONPYCACHEPREFIX: path.join(WORK, "pycache") } });
    const cases = webhookCases(vendors).map((c) => ({ ...c, headers: Object.fromEntries(Object.entries(c.headers).map(([k, v]) => [k.toLowerCase(), v])) }));
    const script = [
      "import sys, json",
      "sys.path.insert(0, sys.argv[1])",
      "from app.webhooks import check_webhook",
      "out = []",
      "for c in json.load(sys.stdin):",
      "    r = check_webhook(c['id'], c['method'], c['headers'], c['query'], c['body'].encode())",
      "    out.append(r['reply'] if 'reply' in r else {'status': 200})",
      "print(json.dumps(out))",
    ].join("\n");
    const res = execFileSync(PY, ["-I", "-c", script, dir], { input: JSON.stringify(cases), env: { ...process.env, ...ENV, PYTHONDONTWRITEBYTECODE: "1" } });
    const got = JSON.parse(res);
    cases.forEach((c, i) => {
      assert.equal(got[i].status, c.status, `${c.id}: ${c.name}`);
      if (c.json) assert.deepEqual(got[i].json, c.json);
    });
  });
}
