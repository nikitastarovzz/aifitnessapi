/**
 * The templates behind /tools/starter-scaffold (ops/AUDIENCE-30-2026-11-05.md
 * item 8): pick a stack and the vendors, get the files of a project skeleton
 * with an OAuth start and callback route, a token-store interface, a webhook
 * endpoint that checks each vendor's documented signature, handshake or
 * token, a .env.example and a README.
 *
 * One plain-ESM module, imported by the page's client component and by
 * scripts/starter-scaffold.test.mjs, which generates every stack with every
 * vendor and then runs `node --check`, `tsc` and `python -m py_compile` over
 * the output, starts the Express skeleton and sends it signed requests, and
 * checks each language's webhook verifier against the examples the site's
 * /tools/webhook-verifier module builds. So a template that does not compile
 * or verify cannot ship.
 *
 * Facts, and where they come from (nothing here is from memory):
 *   - authorize and token URLs, scope separators, client authentication,
 *     PKCE, WHOOP's 8-character state and `offline` scope: the site's
 *     integration guides (src/data/integrate.entries.ts), each sourced to the
 *     vendor's documentation with a read date;
 *   - every webhook rule: src/lib/webhookVerifier.mjs (`WEBHOOK_VENDORS`),
 *     quoted from each vendor's page on 2026-10-31.
 * Vendors whose OAuth exchange the skeleton cannot do honestly are left out
 * and the page says why (Withings signs its token request with a nonce;
 * Terra and the Google Health API do not use a per-vendor OAuth app here).
 */
import { WEBHOOK_VENDORS } from "./webhookVerifier.mjs";

export const SCAFFOLD_CHECKED_ON = "2026-11-05";

const rule = (id) => {
  const v = WEBHOOK_VENDORS.find((w) => w.id === id);
  if (!v) throw new Error(`no webhook rule for ${id}`);
  return v;
};

/**
 * @typedef {{ id: string, name: string, env: string, guide: string,
 *   authorizeUrl: string, tokenUrl: string, tokenAuth: "body" | "basic",
 *   scopeSeparator: string, scopes: string[], pkce: boolean, stateLength: number | null,
 *   tokenNotes: string[], webhook: { kind: "hmac" | "handshake" | "token", summary: string,
 *   source: string, respond: string[] } }} ScaffoldVendor
 */

/** @type {ScaffoldVendor[]} */
export const SCAFFOLD_VENDORS = [
  {
    id: "oura",
    name: "Oura",
    env: "OURA",
    guide: "/integrate/oura-api",
    authorizeUrl: "https://cloud.ouraring.com/oauth/authorize",
    tokenUrl: "https://api.ouraring.com/oauth/token",
    tokenAuth: "body",
    scopeSeparator: " ",
    scopes: ["daily", "heartrate", "workout", "spo2"],
    pkce: true,
    stateLength: null,
    tokenNotes: [
      "Oura marks PKCE as recommended; the skeleton sends an S256 code_challenge and the code_verifier on the exchange.",
      "Oura's refresh token is single-use: store the new pair after every refresh.",
    ],
  },
  {
    id: "whoop",
    name: "WHOOP",
    env: "WHOOP",
    guide: "/integrate/whoop-api",
    authorizeUrl: "https://api.prod.whoop.com/oauth/oauth2/auth",
    tokenUrl: "https://api.prod.whoop.com/oauth/oauth2/token",
    tokenAuth: "body",
    scopeSeparator: " ",
    scopes: ["read:recovery", "read:sleep", "read:workout", "offline"],
    pkce: false,
    stateLength: 8,
    tokenNotes: [
      "WHOOP issues a refresh token only when you request the offline scope.",
      "WHOOP says a state you generate must be eight characters long.",
      "A refresh invalidates the previous tokens, and two simultaneous refreshes for one member fail: refresh on a schedule, one at a time.",
    ],
  },
  {
    id: "polar",
    name: "Polar AccessLink",
    env: "POLAR",
    guide: "/integrate/polar-api",
    authorizeUrl: "https://flow.polar.com/oauth2/authorization",
    tokenUrl: "https://polarremote.com/v2/oauth2/token",
    tokenAuth: "basic",
    scopeSeparator: " ",
    scopes: ["accesslink.read_all"],
    pkce: false,
    stateLength: null,
    tokenNotes: [
      "Polar's token endpoint takes HTTP Basic client credentials.",
      "The authorization code expires in 10 minutes and must be used once: a second use makes Polar delete every token issued.",
      "The response carries x_user_id, the Polar user id later paths use.",
    ],
  },
  {
    id: "strava",
    name: "Strava",
    env: "STRAVA",
    guide: "/integrate/strava-api",
    authorizeUrl: "https://www.strava.com/oauth/authorize",
    tokenUrl: "https://www.strava.com/oauth/token",
    tokenAuth: "body",
    scopeSeparator: ",",
    scopes: ["read", "activity:read_all"],
    pkce: false,
    stateLength: null,
    tokenNotes: [
      "Strava scopes are comma-separated, and activity:read (or activity:read_all) is required for activity webhooks.",
      "Access tokens expire six hours after creation; once a new refresh token is returned the old one is invalidated immediately.",
    ],
  },
  {
    id: "wahoo",
    name: "Wahoo",
    env: "WAHOO",
    guide: "/integrate/wahoo-api",
    authorizeUrl: "https://api.wahooligan.com/oauth/authorize",
    tokenUrl: "https://api.wahooligan.com/oauth/token",
    tokenAuth: "body",
    scopeSeparator: " ",
    scopes: ["user_read", "workouts_read", "offline_data"],
    pkce: false,
    stateLength: null,
    tokenNotes: [
      "Without user_read Wahoo returns 403, and offline_data is required for webhooks.",
      "Access tokens expire after 2 hours; an app may hold 10 unrevoked access tokens per user, so refresh only right before a call.",
    ],
  },
].map((v) => {
  const r = rule(v.id);
  return { ...v, webhook: { kind: r.kind, summary: r.summary, source: r.source.url, respond: r.respond } };
});

export const SCAFFOLD_EXCLUDED = [
  { name: "Withings", reason: "Its token exchange is a requesttoken call signed with a nonce from its signature service, which a generic skeleton cannot do without guessing; see the Withings guide and the Withings notification router recipe." },
  { name: "Terra", reason: "Terra connects users through its own widget rather than a per-vendor OAuth app you register, so there is no callback to scaffold; its webhook signature is in the webhook verifier." },
  { name: "Google Health API", reason: "It uses Google's OAuth, not a vendor-specific endpoint the site documents here; its webhook rule is in the webhook verifier." },
  { name: "Garmin", reason: "Garmin's public pages state no request format or signing rule for its webhooks." },
];

export const SCAFFOLD_STACKS = [
  { id: "express", name: "Node.js + Express", language: "JavaScript (ESM)", check: "node --check, and the test starts the server" },
  { id: "nextjs", name: "Next.js route handlers", language: "TypeScript", check: "tsc --noEmit --strict" },
  { id: "fastapi", name: "Python + FastAPI", language: "Python 3", check: "python -m py_compile" },
];

/* ───────────────────────────── helpers ───────────────────────────── */

const J = (v) => JSON.stringify(v);
const pyStr = (v) => JSON.stringify(v); // a JSON string literal is a valid Python str literal for these ASCII values

export function slugifyProject(name) {
  const s = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || "fitness-integration";
}

function pick(vendorIds) {
  const set = new Set(vendorIds);
  for (const id of set) if (!SCAFFOLD_VENDORS.some((v) => v.id === id)) throw new Error(`unknown vendor ${id}`);
  const vs = SCAFFOLD_VENDORS.filter((v) => set.has(v.id));
  if (!vs.length) throw new Error("pick at least one vendor");
  return vs;
}

function envExample(vendors, stack) {
  const lines = [
    `# ${stack === "nextjs" ? "Copy to .env.local" : "Copy to .env"} and fill in. Never commit the filled-in file.`,
    "# Public origin of this app; the OAuth redirect URIs below are built from it.",
    `APP_BASE_URL=http://localhost:${stack === "fastapi" ? 8000 : 3000}`,
    "",
  ];
  for (const v of vendors) {
    lines.push(`# ${v.name}: register ${"<APP_BASE_URL>"}/${stack === "fastapi" ? "oauth" : stack === "nextjs" ? "api/oauth" : "oauth"}/${v.id}/callback as the redirect URI.`);
    lines.push(`${v.env}_CLIENT_ID=`, `${v.env}_CLIENT_SECRET=`);
    lines.push(`# Space-separated here; the code joins them with "${v.scopeSeparator}" as ${v.name} expects.`);
    lines.push(`${v.env}_SCOPES=${v.scopes.join(" ")}`);
    if (v.id === "oura") lines.push("# The verification_token you set when creating the Oura webhook subscription.", "OURA_VERIFICATION_TOKEN=");
    if (v.id === "polar") lines.push("# signature_secret_key, returned once when you create the webhook.", "POLAR_WEBHOOK_SECRET=");
    if (v.id === "strava") lines.push("# The verify_token you pass when creating the push subscription, and the subscription id it returns.", "STRAVA_VERIFY_TOKEN=", "STRAVA_SUBSCRIPTION_ID=");
    if (v.id === "wahoo") lines.push("# The webhook_token configured in Wahoo's app settings.", "WAHOO_WEBHOOK_TOKEN=");
    lines.push("");
  }
  return lines.join("\n");
}

function readme(project, stack, vendors) {
  const s = SCAFFOLD_STACKS.find((x) => x.id === stack);
  const run =
    stack === "express"
      ? ["npm install", "cp .env.example .env   # fill it in", "npm start   # http://localhost:3000"]
      : stack === "nextjs"
        ? ["npm install", "cp .env.example .env.local   # fill it in", "npm run dev   # http://localhost:3000"]
        : ["python -m venv .venv && . .venv/bin/activate", "pip install -r requirements.txt", "cp .env.example .env   # fill it in", "uvicorn app.main:app --reload   # http://localhost:8000"];
  const base = stack === "nextjs" ? "/api" : "";
  const out = [
    `# ${project}`,
    "",
    `A ${s.name} skeleton for ${vendors.map((v) => v.name).join(", ")}, generated by https://aifitnessapi.com/tools/starter-scaffold on the facts the site had verified as of ${SCAFFOLD_CHECKED_ON}. Every endpoint, header and signing rule below links the page that sources it; re-check them before you ship, because vendors change.`,
    "",
    "## Run it",
    "",
    "```sh",
    ...run,
    "```",
    "",
    "## Routes",
    "",
    "| Route | What it does |",
    "|---|---|",
    `| \`GET ${base}/oauth/{vendor}/start?user=<your user id>\` | Redirects to the vendor's authorize URL with a state (and a PKCE challenge where the vendor documents PKCE) |`,
    `| \`GET ${base}/oauth/{vendor}/callback\` | Checks state, exchanges the code, saves the grant through the token store |`,
    `| \`GET/HEAD/POST ${base}/webhooks/{vendor}\` | Answers the vendor's handshake, checks its signature or token, acknowledges fast and hands the event to \`handleEvent\` |`,
    "",
    "## Per vendor",
    "",
  ];
  for (const v of vendors) {
    out.push(`### ${v.name}`, "");
    out.push(`- Authorize: \`${v.authorizeUrl}\`; token: \`${v.tokenUrl}\` (client credentials ${v.tokenAuth === "basic" ? "as HTTP Basic" : "in the form body"}).`);
    for (const n of v.tokenNotes) out.push(`- ${n}`);
    out.push(`- Webhooks: ${v.webhook.summary}`);
    for (const r of v.webhook.respond) out.push(`- ${r}`);
    out.push(`- Sources: https://aifitnessapi.com${v.guide} and ${v.webhook.source}`, "");
  }
  out.push(
    "## Before production",
    "",
    "- **Replace the in-memory stores.** `TokenStore` and the OAuth state store keep data in process memory so the skeleton runs with no database. Implement the interface against your database, and encrypt tokens at rest: https://aifitnessapi.com/cookbook/token-vault.",
    "- **Wire `user` to your own auth.** The start route takes the user id as a query parameter only so the skeleton is self-contained.",
    "- **Make `handleEvent` enqueue, not fetch.** Acknowledge first; fetch the record the event points to from a worker: https://aifitnessapi.com/cookbook/webhook-receiver.",
    "- **Refresh tokens one at a time per user**, and store every rotated refresh token: https://aifitnessapi.com/cookbook/refresh-rotation.",
    "",
    `Checked by: ${s.check}.`,
    "",
  );
  return out.join("\n");
}

/* ───────────────────────────── Express ───────────────────────────── */

function expressVendors(vendors) {
  const rows = vendors.map((v) => `  ${v.id}: {
    name: ${J(v.name)},
    authorizeUrl: ${J(v.authorizeUrl)},
    tokenUrl: ${J(v.tokenUrl)},
    tokenAuth: ${J(v.tokenAuth)},
    scopeSeparator: ${J(v.scopeSeparator)},
    pkce: ${v.pkce},
    stateLength: ${v.stateLength ?? "null"},
    clientId: process.env.${v.env}_CLIENT_ID ?? "",
    clientSecret: process.env.${v.env}_CLIENT_SECRET ?? "",
    scopes: (process.env.${v.env}_SCOPES ?? ${J(v.scopes.join(" "))}).split(/\\s+/).filter(Boolean),
  },`);
  return `// Vendor OAuth settings. Each value is from the site's integration guide for
// that vendor (see README.md for the links); check them against the vendor's
// current documentation before you ship.
export const VENDORS = {
${rows.join("\n")}
};

export function vendor(id) {
  const v = Object.hasOwn(VENDORS, id) ? VENDORS[id] : null;
  if (!v) throw Object.assign(new Error(\`unknown vendor \${id}\`), { status: 404 });
  return v;
}
`;
}

const JS_TOKEN_STORE = `/**
 * Where grants live. The interface is what the routes use; MemoryTokenStore
 * keeps them in process memory so the skeleton runs without a database.
 * Replace it, and encrypt the tokens at rest
 * (https://aifitnessapi.com/cookbook/token-vault).
 *
 * @typedef {{ accessToken: string, refreshToken: string | null, expiresAt: number | null,
 *             scope: string | null, raw: Record<string, unknown> }} Grant
 * @typedef {{ get(userId: string, vendor: string): Promise<Grant | null>,
 *             save(userId: string, vendor: string, grant: Grant): Promise<void>,
 *             delete(userId: string, vendor: string): Promise<void> }} TokenStore
 */

/** @returns {TokenStore} */
export function createMemoryTokenStore() {
  const rows = new Map();
  const key = (u, v) => \`\${v}:\${u}\`;
  return {
    async get(userId, vendor) {
      return rows.get(key(userId, vendor)) ?? null;
    },
    async save(userId, vendor, grant) {
      rows.set(key(userId, vendor), grant);
    },
    async delete(userId, vendor) {
      rows.delete(key(userId, vendor));
    },
  };
}

/** Pending authorizations, keyed by state. Ten minutes is this skeleton's choice. */
export function createMemoryStateStore(ttlMs = 10 * 60 * 1000, now = Date.now) {
  const rows = new Map();
  return {
    put(state, value) {
      rows.set(state, { ...value, at: now() });
    },
    take(state) {
      const row = rows.get(state);
      rows.delete(state);
      return row && now() - row.at <= ttlMs ? row : null;
    },
  };
}
`;

const JS_OAUTH = `import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { vendor } from "./vendors.mjs";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomState(length = 32) {
  let out = "";
  while (out.length < length) for (const b of randomBytes(length * 2)) if (b < 248 && out.length < length) out += ALPHABET[b % 62];
  return out;
}

/** RFC 7636: 32 random octets base64url-encoded, and S256 of that. */
export function pkcePair() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier, "ascii").digest("base64url");
  return { verifier, challenge };
}

export function redirectUri(vendorId) {
  return \`\${(process.env.APP_BASE_URL ?? "http://localhost:3000").replace(/\\/+$/, "")}/oauth/\${vendorId}/callback\`;
}

export function authorizeUrl(vendorId, { state, challenge }) {
  const v = vendor(vendorId);
  const p = new URLSearchParams({ response_type: "code", client_id: v.clientId, redirect_uri: redirectUri(vendorId), state });
  if (v.scopes.length) p.set("scope", v.scopes.join(v.scopeSeparator));
  if (v.pkce && challenge) {
    p.set("code_challenge", challenge);
    p.set("code_challenge_method", "S256");
  }
  return \`\${v.authorizeUrl}?\${p.toString().replace(/\\+/g, "%20")}\`;
}

export function sameString(a, b) {
  const x = Buffer.from(String(a ?? ""));
  const y = Buffer.from(String(b ?? ""));
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

/** Exchange an authorization code. Returns the vendor's token response as JSON. */
export async function exchangeCode(vendorId, { code, verifier }, fetchImpl = fetch) {
  const v = vendor(vendorId);
  const form = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri(vendorId) });
  const headers = { "content-type": "application/x-www-form-urlencoded", accept: "application/json" };
  if (v.tokenAuth === "basic") headers.authorization = \`Basic \${Buffer.from(\`\${v.clientId}:\${v.clientSecret}\`).toString("base64")}\`;
  else {
    form.set("client_id", v.clientId);
    form.set("client_secret", v.clientSecret);
  }
  if (v.pkce && verifier) form.set("code_verifier", verifier);
  const res = await fetchImpl(v.tokenUrl, { method: "POST", headers, body: form });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(\`\${v.name} token exchange failed with \${res.status}\`), { status: 502, body });
  return body;
}

/** The fields every vendor here returns, normalized; the raw response is kept. */
export function toGrant(body, now = Date.now()) {
  return {
    accessToken: String(body.access_token ?? ""),
    refreshToken: body.refresh_token ? String(body.refresh_token) : null,
    expiresAt: typeof body.expires_in === "number" ? now + body.expires_in * 1000 : typeof body.expires_at === "number" ? body.expires_at * 1000 : null,
    scope: typeof body.scope === "string" ? body.scope : null,
    raw: body,
  };
}
`;

function jsWebhooks(vendors) {
  const ids = new Set(vendors.map((v) => v.id));
  const parts = [`/**
 * Webhook checks, one per vendor, each as the vendor's own page states it
 * (quoted on https://aifitnessapi.com/tools/webhook-verifier, read 2026-10-31).
 * \`checkWebhook\` returns either { reply } (send it and stop) or { event }
 * (verified: acknowledge, then process). Every secret comparison is constant-time.
 */
import { createHmac } from "node:crypto";
import { sameString } from "./oauth.mjs";

const hmac = (secret, ...parts) => {
  const h = createHmac("sha256", secret);
  for (const p of parts) h.update(p);
  return h.digest();
};
const header = (headers, name) => {
  const v = headers[name.toLowerCase()];
  return Array.isArray(v) ? v[0] : v;
};
const deny = (status) => ({ reply: { status, body: "" } });
const parse = (raw) => {
  try {
    return JSON.parse(raw.toString("utf8"));
  } catch {
    return null;
  }
};
`];
  const cases = [];
  if (ids.has("oura"))
    cases.push(`    case "oura": {
      // Validation: GET ?verification_token=…&challenge=… → {"challenge": …}.
      if (method === "GET") {
        if (!sameString(query.verification_token, process.env.OURA_VERIFICATION_TOKEN)) return deny(401);
        return { reply: { status: 200, json: { challenge: String(query.challenge ?? "") } } };
      }
      // HMAC-SHA256(client secret, x-oura-timestamp + JSON.stringify(body)), upper-case hex.
      const body = parse(raw);
      const ts = header(headers, "x-oura-timestamp");
      const sig = header(headers, "x-oura-signature");
      if (!body || !ts || !sig) return deny(401);
      const want = hmac(process.env.OURA_CLIENT_SECRET ?? "", ts, JSON.stringify(body)).toString("hex").toUpperCase();
      return sameString(want, sig.trim()) ? { event: body } : deny(401);
    }`);
  if (ids.has("whoop"))
    cases.push(`    case "whoop": {
      // base64(HMAC-SHA256(client secret, X-WHOOP-Signature-Timestamp + raw body)).
      const ts = header(headers, "x-whoop-signature-timestamp");
      const sig = header(headers, "x-whoop-signature");
      if (!ts || !sig) return deny(401);
      const want = hmac(process.env.WHOOP_CLIENT_SECRET ?? "", ts, raw).toString("base64");
      if (!sameString(want, sig.trim())) return deny(401);
      // WHOOP: duplicates are possible; use trace_id to detect them.
      return { event: parse(raw) };
    }`);
  if (ids.has("polar"))
    cases.push(`    case "polar": {
      const body = parse(raw);
      // A PING must get 200 OK or the webhook is not created or modified.
      if (body?.event === "PING") return { reply: { status: 200, body: "" } };
      // hex(HMAC-SHA256(signature_secret_key, raw body)); case is not stated, so compare lower-case.
      const sig = header(headers, "polar-webhook-signature");
      if (!sig) return deny(401);
      const want = hmac(process.env.POLAR_WEBHOOK_SECRET ?? "", raw).toString("hex");
      return sameString(want, sig.trim().toLowerCase()) ? { event: body } : deny(401);
    }`);
  if (ids.has("strava"))
    cases.push(`    case "strava": {
      // Validation: GET with hub.mode, hub.challenge, hub.verify_token → echo hub.challenge as JSON within two seconds.
      if (method === "GET") {
        if (query["hub.mode"] !== "subscribe" || !sameString(query["hub.verify_token"], process.env.STRAVA_VERIFY_TOKEN)) return deny(403);
        return { reply: { status: 200, json: { "hub.challenge": String(query["hub.challenge"] ?? "") } } };
      }
      // Strava documents no signature on event POSTs. The subscription_id check is this skeleton's own.
      const body = parse(raw);
      if (!body) return deny(400);
      const expected = process.env.STRAVA_SUBSCRIPTION_ID;
      if (expected && String(body.subscription_id) !== expected) return deny(403);
      return { event: body };
    }`);
  if (ids.has("wahoo"))
    cases.push(`    case "wahoo": {
      // No signature: Wahoo sends the webhook_token you configured in the JSON body.
      const body = parse(raw);
      if (!body || !sameString(body.webhook_token, process.env.WAHOO_WEBHOOK_TOKEN)) return deny(401);
      return { event: body };
    }`);
  parts.push(`/**
 * @param {string} vendorId
 * @param {{ method: string, headers: Record<string, string | string[] | undefined>, query: Record<string, any>, raw: Buffer }} req
 */
export function checkWebhook(vendorId, { method, headers, query, raw }) {
  switch (vendorId) {
${cases.join("\n")}
    default:
      return deny(404);
  }
}

/** Replace with a queue write. Acknowledge first, fetch later. */
export async function handleEvent(vendorId, event) {
  console.log(\`[\${vendorId}] event\`, JSON.stringify(event).slice(0, 200));
}
`);
  return parts.join("\n");
}

const JS_SERVER = `import express from "express";
import { authorizeUrl, exchangeCode, pkcePair, randomState, toGrant } from "./oauth.mjs";
import { checkWebhook, handleEvent } from "./webhooks.mjs";
import { createMemoryStateStore, createMemoryTokenStore } from "./tokenStore.mjs";
import { vendor } from "./vendors.mjs";

export function createApp({ tokens = createMemoryTokenStore(), states = createMemoryStateStore(), fetchImpl = fetch } = {}) {
  const app = express();

  app.get("/oauth/:vendor/start", (req, res) => {
    const v = vendor(req.params.vendor);
    const user = String(req.query.user ?? "");
    if (!user) return res.status(400).send("pass ?user=<your user id>");
    const state = randomState(v.stateLength ?? 32);
    const pkce = v.pkce ? pkcePair() : null;
    states.put(state, { user, vendor: req.params.vendor, verifier: pkce?.verifier ?? null });
    res.redirect(302, authorizeUrl(req.params.vendor, { state, challenge: pkce?.challenge }));
  });

  app.get("/oauth/:vendor/callback", async (req, res, next) => {
    try {
      const pending = states.take(String(req.query.state ?? ""));
      if (!pending || pending.vendor !== req.params.vendor) return res.status(400).send("unknown or expired state");
      if (req.query.error) return res.status(400).send(\`authorization refused: \${req.query.error}\`);
      const code = String(req.query.code ?? "");
      if (!code) return res.status(400).send("no code");
      const body = await exchangeCode(req.params.vendor, { code, verifier: pending.verifier }, fetchImpl);
      await tokens.save(pending.user, req.params.vendor, toGrant(body));
      res.send(\`Connected \${vendor(req.params.vendor).name}.\`);
    } catch (err) {
      next(err);
    }
  });

  // Raw bytes: WHOOP and Polar sign the body exactly as sent, so no JSON parser runs first.
  app.all("/webhooks/:vendor", express.raw({ type: "*/*", limit: "1mb" }), (req, res) => {
    vendor(req.params.vendor);
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    if (req.method === "HEAD") return res.sendStatus(200);
    const out = checkWebhook(req.params.vendor, { method: req.method, headers: req.headers, query: req.query, raw });
    if (out.reply) return out.reply.json ? res.status(out.reply.status).json(out.reply.json) : res.status(out.reply.status).send(out.reply.body ?? "");
    res.sendStatus(200);
    handleEvent(req.params.vendor, out.event).catch((e) => console.error(e));
  });

  app.use((err, _req, res, _next) => {
    res.status(err.status ?? 500).send(err.status === 404 ? "not found" : "error");
  });
  return app;
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], "file://").href) {
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, () => console.log(\`listening on http://localhost:\${port}\`));
}
`;

function expressFiles(project, vendors) {
  return [
    {
      path: "package.json",
      content: `${JSON.stringify(
        {
          name: project,
          private: true,
          type: "module",
          scripts: { start: "node --env-file=.env src/server.mjs" },
          engines: { node: ">=20.6" },
          dependencies: { express: "^5.2.1" },
        },
        null,
        2,
      )}\n`,
    },
    { path: "src/vendors.mjs", content: expressVendors(vendors) },
    { path: "src/oauth.mjs", content: JS_OAUTH },
    { path: "src/tokenStore.mjs", content: JS_TOKEN_STORE },
    { path: "src/webhooks.mjs", content: jsWebhooks(vendors) },
    { path: "src/server.mjs", content: JS_SERVER },
  ];
}

/* ───────────────────────────── Next.js ───────────────────────────── */

function tsVendors(vendors) {
  const rows = vendors.map((v) => `  ${v.id}: {
    name: ${J(v.name)},
    authorizeUrl: ${J(v.authorizeUrl)},
    tokenUrl: ${J(v.tokenUrl)},
    tokenAuth: ${J(v.tokenAuth)},
    scopeSeparator: ${J(v.scopeSeparator)},
    pkce: ${v.pkce},
    stateLength: ${v.stateLength ?? "null"},
    env: ${J(v.env)},
    defaultScopes: ${J(v.scopes.join(" "))},
  },`);
  return `// Vendor OAuth settings, from the site's integration guide for each vendor
// (links in README.md). Check them against the vendor's current docs.
export type VendorConfig = {
  name: string;
  authorizeUrl: string;
  tokenUrl: string;
  tokenAuth: "body" | "basic";
  scopeSeparator: string;
  pkce: boolean;
  stateLength: number | null;
  env: string;
  defaultScopes: string;
};

export const VENDORS = {
${rows.join("\n")}
} satisfies Record<string, VendorConfig>;

export type VendorId = keyof typeof VENDORS;

export function vendorConfig(id: string): (VendorConfig & { id: VendorId }) | null {
  return Object.hasOwn(VENDORS, id) ? { ...(VENDORS as Record<string, VendorConfig>)[id], id: id as VendorId } : null;
}

export function credentials(v: VendorConfig) {
  return {
    clientId: process.env[\`\${v.env}_CLIENT_ID\`] ?? "",
    clientSecret: process.env[\`\${v.env}_CLIENT_SECRET\`] ?? "",
    scopes: (process.env[\`\${v.env}_SCOPES\`] ?? v.defaultScopes).split(/\\s+/).filter(Boolean),
  };
}
`;
}

const TS_TOKEN_STORE = `/**
 * Where grants live. Routes use the TokenStore interface; the memory version
 * lets the skeleton run without a database and loses everything on restart
 * (and between serverless instances). Replace it, and encrypt tokens at rest:
 * https://aifitnessapi.com/cookbook/token-vault
 */
export type Grant = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
  scope: string | null;
  raw: Record<string, unknown>;
};

export interface TokenStore {
  get(userId: string, vendor: string): Promise<Grant | null>;
  save(userId: string, vendor: string, grant: Grant): Promise<void>;
  delete(userId: string, vendor: string): Promise<void>;
}

const grants = new Map<string, Grant>();

export const tokenStore: TokenStore = {
  async get(userId, vendor) {
    return grants.get(\`\${vendor}:\${userId}\`) ?? null;
  },
  async save(userId, vendor, grant) {
    grants.set(\`\${vendor}:\${userId}\`, grant);
  },
  async delete(userId, vendor) {
    grants.delete(\`\${vendor}:\${userId}\`);
  },
};

type Pending = { user: string; vendor: string; verifier: string | null; at: number };
const pending = new Map<string, Pending>();
const TTL_MS = 10 * 60 * 1000; // this skeleton's choice

export const stateStore = {
  put(state: string, value: Omit<Pending, "at">): void {
    pending.set(state, { ...value, at: Date.now() });
  },
  take(state: string): Pending | null {
    const row = pending.get(state);
    pending.delete(state);
    return row && Date.now() - row.at <= TTL_MS ? row : null;
  },
};
`;

const TS_OAUTH = `import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { credentials, type VendorConfig, type VendorId } from "./vendors";
import type { Grant } from "./tokenStore";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomState(length = 32): string {
  let out = "";
  while (out.length < length) for (const b of randomBytes(length * 2)) if (b < 248 && out.length < length) out += ALPHABET[b % 62];
  return out;
}

/** RFC 7636: 32 random octets base64url-encoded, and S256 of that. */
export function pkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString("base64url");
  return { verifier, challenge: createHash("sha256").update(verifier, "ascii").digest("base64url") };
}

export function redirectUri(id: VendorId): string {
  return \`\${(process.env.APP_BASE_URL ?? "http://localhost:3000").replace(/\\/+$/, "")}/api/oauth/\${id}/callback\`;
}

export function authorizeUrl(v: VendorConfig & { id: VendorId }, state: string, challenge?: string): string {
  const c = credentials(v);
  const p = new URLSearchParams({ response_type: "code", client_id: c.clientId, redirect_uri: redirectUri(v.id), state });
  if (c.scopes.length) p.set("scope", c.scopes.join(v.scopeSeparator));
  if (v.pkce && challenge) {
    p.set("code_challenge", challenge);
    p.set("code_challenge_method", "S256");
  }
  return \`\${v.authorizeUrl}?\${p.toString().replace(/\\+/g, "%20")}\`;
}

export function sameString(a: unknown, b: unknown): boolean {
  const x = Buffer.from(String(a ?? ""));
  const y = Buffer.from(String(b ?? ""));
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

export async function exchangeCode(v: VendorConfig & { id: VendorId }, code: string, verifier: string | null): Promise<Record<string, unknown>> {
  const c = credentials(v);
  const form = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri(v.id) });
  const headers: Record<string, string> = { "content-type": "application/x-www-form-urlencoded", accept: "application/json" };
  if (v.tokenAuth === "basic") headers.authorization = \`Basic \${Buffer.from(\`\${c.clientId}:\${c.clientSecret}\`).toString("base64")}\`;
  else {
    form.set("client_id", c.clientId);
    form.set("client_secret", c.clientSecret);
  }
  if (v.pkce && verifier) form.set("code_verifier", verifier);
  const res = await fetch(v.tokenUrl, { method: "POST", headers, body: form });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error(\`\${v.name} token exchange failed with \${res.status}\`);
  return body;
}

export function toGrant(body: Record<string, unknown>, now = Date.now()): Grant {
  return {
    accessToken: String(body.access_token ?? ""),
    refreshToken: typeof body.refresh_token === "string" ? body.refresh_token : null,
    expiresAt: typeof body.expires_in === "number" ? now + body.expires_in * 1000 : typeof body.expires_at === "number" ? body.expires_at * 1000 : null,
    scope: typeof body.scope === "string" ? body.scope : null,
    raw: body,
  };
}
`;

function tsWebhooks(vendors) {
  const ids = new Set(vendors.map((v) => v.id));
  const cases = [];
  if (ids.has("oura"))
    cases.push(`    case "oura": {
      if (method === "GET") {
        if (!sameString(query.get("verification_token"), process.env.OURA_VERIFICATION_TOKEN)) return deny(401);
        return { reply: { status: 200, json: { challenge: query.get("challenge") ?? "" } } };
      }
      // HMAC-SHA256(client secret, x-oura-timestamp + JSON.stringify(body)), upper-case hex.
      const body = parse(raw);
      const ts = headers.get("x-oura-timestamp");
      const sig = headers.get("x-oura-signature");
      if (!body || !ts || !sig) return deny(401);
      const want = hmac(process.env.OURA_CLIENT_SECRET ?? "", ts, JSON.stringify(body)).toString("hex").toUpperCase();
      return sameString(want, sig.trim()) ? { event: body } : deny(401);
    }`);
  if (ids.has("whoop"))
    cases.push(`    case "whoop": {
      // base64(HMAC-SHA256(client secret, X-WHOOP-Signature-Timestamp + raw body)).
      const ts = headers.get("x-whoop-signature-timestamp");
      const sig = headers.get("x-whoop-signature");
      if (!ts || !sig) return deny(401);
      const want = hmac(process.env.WHOOP_CLIENT_SECRET ?? "", ts, raw).toString("base64");
      return sameString(want, sig.trim()) ? { event: parse(raw) } : deny(401);
    }`);
  if (ids.has("polar"))
    cases.push(`    case "polar": {
      const body = parse(raw) as { event?: unknown } | null;
      if (body?.event === "PING") return { reply: { status: 200 } };
      // hex(HMAC-SHA256(signature_secret_key, raw body)), compared lower-case.
      const sig = headers.get("polar-webhook-signature");
      if (!sig) return deny(401);
      const want = hmac(process.env.POLAR_WEBHOOK_SECRET ?? "", raw).toString("hex");
      return sameString(want, sig.trim().toLowerCase()) ? { event: body } : deny(401);
    }`);
  if (ids.has("strava"))
    cases.push(`    case "strava": {
      if (method === "GET") {
        if (query.get("hub.mode") !== "subscribe" || !sameString(query.get("hub.verify_token"), process.env.STRAVA_VERIFY_TOKEN)) return deny(403);
        return { reply: { status: 200, json: { "hub.challenge": query.get("hub.challenge") ?? "" } } };
      }
      // Strava documents no signature on event POSTs; the subscription_id check is this skeleton's own.
      const body = parse(raw) as { subscription_id?: unknown } | null;
      if (!body) return deny(400);
      const expected = process.env.STRAVA_SUBSCRIPTION_ID;
      if (expected && String(body.subscription_id) !== expected) return deny(403);
      return { event: body };
    }`);
  if (ids.has("wahoo"))
    cases.push(`    case "wahoo": {
      // No signature: the webhook_token you configured arrives in the JSON body.
      const body = parse(raw) as { webhook_token?: unknown } | null;
      if (!body || !sameString(body.webhook_token, process.env.WAHOO_WEBHOOK_TOKEN)) return deny(401);
      return { event: body };
    }`);
  return `/**
 * Webhook checks, one per vendor, as each vendor's page states it (quoted on
 * https://aifitnessapi.com/tools/webhook-verifier, read 2026-10-31).
 */
import { createHmac } from "node:crypto";
import { sameString } from "./oauth";

export type WebhookOutcome = { reply: { status: number; json?: unknown } } | { event: unknown };

const hmac = (secret: string, ...parts: (string | Buffer)[]): Buffer => {
  const h = createHmac("sha256", secret);
  for (const p of parts) h.update(p);
  return h.digest();
};
const deny = (status: number): WebhookOutcome => ({ reply: { status } });
const parse = (raw: Buffer): unknown => {
  try {
    return JSON.parse(raw.toString("utf8"));
  } catch {
    return null;
  }
};

export function checkWebhook(vendorId: string, method: string, headers: Headers, query: URLSearchParams, raw: Buffer): WebhookOutcome {
  switch (vendorId) {
${cases.join("\n")}
    default:
      return deny(404);
  }
}

/** Replace with a queue write. Acknowledge first, fetch later. */
export async function handleEvent(vendorId: string, event: unknown): Promise<void> {
  console.log(\`[\${vendorId}] event\`, JSON.stringify(event).slice(0, 200));
}
`;
}

const TS_START = `import { NextResponse, type NextRequest } from "next/server";
import { vendorConfig } from "@/lib/vendors";
import { authorizeUrl, pkcePair, randomState } from "@/lib/oauth";
import { stateStore } from "@/lib/tokenStore";

export async function GET(req: NextRequest, { params }: { params: Promise<{ vendor: string }> }) {
  const v = vendorConfig((await params).vendor);
  if (!v) return new NextResponse("not found", { status: 404 });
  const user = req.nextUrl.searchParams.get("user");
  if (!user) return new NextResponse("pass ?user=<your user id>", { status: 400 });
  const state = randomState(v.stateLength ?? 32);
  const pkce = v.pkce ? pkcePair() : null;
  stateStore.put(state, { user, vendor: v.id, verifier: pkce?.verifier ?? null });
  return NextResponse.redirect(authorizeUrl(v, state, pkce?.challenge), 302);
}
`;

const TS_CALLBACK = `import { NextResponse, type NextRequest } from "next/server";
import { vendorConfig } from "@/lib/vendors";
import { exchangeCode, toGrant } from "@/lib/oauth";
import { stateStore, tokenStore } from "@/lib/tokenStore";

export async function GET(req: NextRequest, { params }: { params: Promise<{ vendor: string }> }) {
  const v = vendorConfig((await params).vendor);
  if (!v) return new NextResponse("not found", { status: 404 });
  const q = req.nextUrl.searchParams;
  const pending = stateStore.take(q.get("state") ?? "");
  if (!pending || pending.vendor !== v.id) return new NextResponse("unknown or expired state", { status: 400 });
  const error = q.get("error");
  if (error) return new NextResponse(\`authorization refused: \${error}\`, { status: 400 });
  const code = q.get("code");
  if (!code) return new NextResponse("no code", { status: 400 });
  const body = await exchangeCode(v, code, pending.verifier);
  await tokenStore.save(pending.user, v.id, toGrant(body));
  return new NextResponse(\`Connected \${v.name}.\`);
}
`;

const TS_WEBHOOK_ROUTE = `import { NextResponse, type NextRequest } from "next/server";
import { vendorConfig } from "@/lib/vendors";
import { checkWebhook, handleEvent } from "@/lib/webhooks";

// Node runtime: the checks use node:crypto, and the raw body is read before any parsing.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: NextRequest, vendor: string): Promise<Response> {
  if (!vendorConfig(vendor)) return new NextResponse("not found", { status: 404 });
  const raw = Buffer.from(await req.arrayBuffer());
  const out = checkWebhook(vendor, req.method, req.headers, req.nextUrl.searchParams, raw);
  if ("reply" in out) return out.reply.json !== undefined ? NextResponse.json(out.reply.json, { status: out.reply.status }) : new NextResponse(null, { status: out.reply.status });
  void handleEvent(vendor, out.event).catch((e) => console.error(e));
  return new NextResponse(null, { status: 200 });
}

type Ctx = { params: Promise<{ vendor: string }> };
export async function GET(req: NextRequest, ctx: Ctx) {
  return handle(req, (await ctx.params).vendor);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return handle(req, (await ctx.params).vendor);
}
export async function HEAD(_req: NextRequest, ctx: Ctx) {
  return new NextResponse(null, { status: vendorConfig((await ctx.params).vendor) ? 200 : 404 });
}
`;

function nextFiles(project, vendors) {
  return [
    {
      path: "package.json",
      content: `${JSON.stringify(
        {
          name: project,
          private: true,
          scripts: { dev: "next dev", build: "next build", start: "next start", typecheck: "tsc --noEmit" },
          dependencies: { next: "^16.1.1", react: "19.2.3", "react-dom": "19.2.3" },
          devDependencies: { typescript: "^5", "@types/node": "^20", "@types/react": "^19" },
        },
        null,
        2,
      )}\n`,
    },
    {
      path: "tsconfig.json",
      content: `${JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            lib: ["dom", "dom.iterable", "esnext"],
            strict: true,
            noEmit: true,
            module: "esnext",
            moduleResolution: "bundler",
            esModuleInterop: true,
            skipLibCheck: true,
            isolatedModules: true,
            jsx: "react-jsx",
            types: ["node"],
            paths: { "@/*": ["./*"] },
          },
          include: ["**/*.ts", "**/*.tsx"],
          exclude: ["node_modules"],
        },
        null,
        2,
      )}\n`,
    },
    { path: "app/layout.tsx", content: `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n` },
    { path: "app/page.tsx", content: `export default function Home() {\n  return <p>${project}: see README.md for the OAuth and webhook routes.</p>;\n}\n` },
    { path: "lib/vendors.ts", content: tsVendors(vendors) },
    { path: "lib/oauth.ts", content: TS_OAUTH },
    { path: "lib/tokenStore.ts", content: TS_TOKEN_STORE },
    { path: "lib/webhooks.ts", content: tsWebhooks(vendors) },
    { path: "app/api/oauth/[vendor]/start/route.ts", content: TS_START },
    { path: "app/api/oauth/[vendor]/callback/route.ts", content: TS_CALLBACK },
    { path: "app/api/webhooks/[vendor]/route.ts", content: TS_WEBHOOK_ROUTE },
  ];
}

/* ───────────────────────────── FastAPI ───────────────────────────── */

function pyVendors(vendors) {
  const rows = vendors.map((v) => `    ${pyStr(v.id)}: {
        "name": ${pyStr(v.name)},
        "authorize_url": ${pyStr(v.authorizeUrl)},
        "token_url": ${pyStr(v.tokenUrl)},
        "token_auth": ${pyStr(v.tokenAuth)},
        "scope_separator": ${pyStr(v.scopeSeparator)},
        "pkce": ${v.pkce ? "True" : "False"},
        "state_length": ${v.stateLength ?? "None"},
        "env": ${pyStr(v.env)},
        "default_scopes": ${pyStr(v.scopes.join(" "))},
    },`);
  return `"""Vendor OAuth settings, from the site's integration guide for each vendor
(links in README.md). Check them against the vendor's current docs."""
import os

VENDORS = {
${rows.join("\n")}
}


def vendor(vendor_id: str) -> dict:
    v = VENDORS.get(vendor_id)
    if v is None:
        raise KeyError(vendor_id)
    return {**v, "id": vendor_id}


def credentials(v: dict) -> dict:
    scopes = os.environ.get(f"{v['env']}_SCOPES", v["default_scopes"]).split()
    return {
        "client_id": os.environ.get(f"{v['env']}_CLIENT_ID", ""),
        "client_secret": os.environ.get(f"{v['env']}_CLIENT_SECRET", ""),
        "scopes": scopes,
    }
`;
}

const PY_TOKEN_STORE = `"""Where grants live. Routes use the TokenStore protocol; MemoryTokenStore
keeps them in process memory so the skeleton runs without a database.
Replace it, and encrypt tokens at rest:
https://aifitnessapi.com/cookbook/token-vault"""
import time
from typing import Optional, Protocol


class TokenStore(Protocol):
    def get(self, user_id: str, vendor: str) -> Optional[dict]: ...
    def save(self, user_id: str, vendor: str, grant: dict) -> None: ...
    def delete(self, user_id: str, vendor: str) -> None: ...


class MemoryTokenStore:
    def __init__(self) -> None:
        self._rows: dict = {}

    def get(self, user_id: str, vendor: str) -> Optional[dict]:
        return self._rows.get((vendor, user_id))

    def save(self, user_id: str, vendor: str, grant: dict) -> None:
        self._rows[(vendor, user_id)] = grant

    def delete(self, user_id: str, vendor: str) -> None:
        self._rows.pop((vendor, user_id), None)


class MemoryStateStore:
    """Pending authorizations keyed by state; ten minutes is this skeleton's choice."""

    def __init__(self, ttl_seconds: float = 600) -> None:
        self._rows: dict = {}
        self._ttl = ttl_seconds

    def put(self, state: str, value: dict) -> None:
        self._rows[state] = {**value, "at": time.time()}

    def take(self, state: str) -> Optional[dict]:
        row = self._rows.pop(state, None)
        if row is None or time.time() - row["at"] > self._ttl:
            return None
        return row
`;

const PY_OAUTH = `"""Authorize URLs, PKCE (RFC 7636) and the code exchange. Standard library
plus httpx for the one outbound call."""
import base64
import hashlib
import hmac
import os
import secrets
import string
import time
from typing import Optional
from urllib.parse import urlencode, quote

from .vendors import credentials

ALPHABET = string.ascii_uppercase + string.ascii_lowercase + string.digits


def random_state(length: int = 32) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def pkce_pair() -> dict:
    verifier = b64url(secrets.token_bytes(32))
    challenge = b64url(hashlib.sha256(verifier.encode("ascii")).digest())
    return {"verifier": verifier, "challenge": challenge}


def redirect_uri(vendor_id: str) -> str:
    base = os.environ.get("APP_BASE_URL", "http://localhost:8000").rstrip("/")
    return f"{base}/oauth/{vendor_id}/callback"


def authorize_url(v: dict, state: str, challenge: Optional[str] = None) -> str:
    c = credentials(v)
    params = {"response_type": "code", "client_id": c["client_id"], "redirect_uri": redirect_uri(v["id"]), "state": state}
    if c["scopes"]:
        params["scope"] = v["scope_separator"].join(c["scopes"])
    if v["pkce"] and challenge:
        params["code_challenge"] = challenge
        params["code_challenge_method"] = "S256"
    return f"{v['authorize_url']}?{urlencode(params, quote_via=quote)}"


def same_string(a, b) -> bool:
    x = str(a if a is not None else "").encode()
    y = str(b if b is not None else "").encode()
    return len(x) > 0 and hmac.compare_digest(x, y)


async def exchange_code(v: dict, code: str, verifier: Optional[str]) -> dict:
    import httpx

    c = credentials(v)
    form = {"grant_type": "authorization_code", "code": code, "redirect_uri": redirect_uri(v["id"])}
    headers = {"accept": "application/json"}
    auth = None
    if v["token_auth"] == "basic":
        auth = (c["client_id"], c["client_secret"])
    else:
        form["client_id"] = c["client_id"]
        form["client_secret"] = c["client_secret"]
    if v["pkce"] and verifier:
        form["code_verifier"] = verifier
    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.post(v["token_url"], data=form, headers=headers, auth=auth)
    if res.status_code >= 400:
        raise RuntimeError(f"{v['name']} token exchange failed with {res.status_code}")
    return res.json()


def to_grant(body: dict, now: Optional[float] = None) -> dict:
    now = time.time() if now is None else now
    expires_in = body.get("expires_in")
    expires_at = body.get("expires_at")
    return {
        "access_token": str(body.get("access_token", "")),
        "refresh_token": body.get("refresh_token"),
        "expires_at": now + expires_in if isinstance(expires_in, (int, float)) else expires_at,
        "scope": body.get("scope"),
        "raw": body,
    }
`;

function pyWebhooks(vendors) {
  const ids = new Set(vendors.map((v) => v.id));
  const cases = [];
  if (ids.has("oura"))
    cases.push(`    if vendor_id == "oura":
        if method == "GET":
            if not same_string(query.get("verification_token"), os.environ.get("OURA_VERIFICATION_TOKEN")):
                return deny(401)
            return {"reply": {"status": 200, "json": {"challenge": query.get("challenge", "")}}}
        # HMAC-SHA256(client secret, x-oura-timestamp + JSON.stringify(body)), upper-case hex.
        # Oura's sample re-serializes the parsed body; compact separators and ensure_ascii=False
        # match JavaScript's JSON.stringify for ordinary payloads (floats like 1.0 differ).
        body = parse(raw)
        ts = headers.get("x-oura-timestamp")
        sig = headers.get("x-oura-signature")
        if body is None or not ts or not sig:
            return deny(401)
        signed = ts + json.dumps(body, separators=(",", ":"), ensure_ascii=False)
        want = mac(os.environ.get("OURA_CLIENT_SECRET", ""), signed.encode()).hex().upper()
        return {"event": body} if same_string(want, sig.strip()) else deny(401)`);
  if (ids.has("whoop"))
    cases.push(`    if vendor_id == "whoop":
        # base64(HMAC-SHA256(client secret, X-WHOOP-Signature-Timestamp + raw body)).
        ts = headers.get("x-whoop-signature-timestamp")
        sig = headers.get("x-whoop-signature")
        if not ts or not sig:
            return deny(401)
        want = base64.b64encode(mac(os.environ.get("WHOOP_CLIENT_SECRET", ""), ts.encode() + raw)).decode()
        return {"event": parse(raw)} if same_string(want, sig.strip()) else deny(401)`);
  if (ids.has("polar"))
    cases.push(`    if vendor_id == "polar":
        body = parse(raw)
        if isinstance(body, dict) and body.get("event") == "PING":
            return {"reply": {"status": 200}}
        # hex(HMAC-SHA256(signature_secret_key, raw body)), compared lower-case.
        sig = headers.get("polar-webhook-signature")
        if not sig:
            return deny(401)
        want = mac(os.environ.get("POLAR_WEBHOOK_SECRET", ""), raw).hex()
        return {"event": body} if same_string(want, sig.strip().lower()) else deny(401)`);
  if (ids.has("strava"))
    cases.push(`    if vendor_id == "strava":
        if method == "GET":
            if query.get("hub.mode") != "subscribe" or not same_string(query.get("hub.verify_token"), os.environ.get("STRAVA_VERIFY_TOKEN")):
                return deny(403)
            return {"reply": {"status": 200, "json": {"hub.challenge": query.get("hub.challenge", "")}}}
        # Strava documents no signature on event POSTs; the subscription_id check is this skeleton's own.
        body = parse(raw)
        if not isinstance(body, dict):
            return deny(400)
        expected = os.environ.get("STRAVA_SUBSCRIPTION_ID")
        if expected and str(body.get("subscription_id")) != expected:
            return deny(403)
        return {"event": body}`);
  if (ids.has("wahoo"))
    cases.push(`    if vendor_id == "wahoo":
        # No signature: the webhook_token you configured arrives in the JSON body.
        body = parse(raw)
        if not isinstance(body, dict) or not same_string(body.get("webhook_token"), os.environ.get("WAHOO_WEBHOOK_TOKEN")):
            return deny(401)
        return {"event": body}`);
  return `"""Webhook checks, one per vendor, as each vendor's page states it (quoted
on https://aifitnessapi.com/tools/webhook-verifier, read 2026-10-31).
Standard library only, so it can be tested without FastAPI installed."""
import base64
import hashlib
import hmac
import json
import os

from .oauth import same_string


def mac(secret: str, message: bytes) -> bytes:
    return hmac.new(secret.encode(), message, hashlib.sha256).digest()


def deny(status: int) -> dict:
    return {"reply": {"status": status}}


def parse(raw: bytes):
    try:
        return json.loads(raw.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return None


def check_webhook(vendor_id: str, method: str, headers: dict, query: dict, raw: bytes) -> dict:
    """headers: lower-cased names. Returns {"reply": …} to send and stop, or {"event": …}."""
${cases.join("\n")}
    return deny(404)


async def handle_event(vendor_id: str, event) -> None:
    """Replace with a queue write. Acknowledge first, fetch later."""
    print(f"[{vendor_id}] event", json.dumps(event)[:200])
`;
}

const PY_MAIN = `"""FastAPI routes: OAuth start and callback, and one webhook endpoint per vendor."""
from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, PlainTextResponse, RedirectResponse, Response

from .oauth import authorize_url, exchange_code, pkce_pair, random_state, to_grant
from .token_store import MemoryStateStore, MemoryTokenStore
from .vendors import vendor
from .webhooks import check_webhook, handle_event

app = FastAPI()
tokens = MemoryTokenStore()
states = MemoryStateStore()


def known(vendor_id: str) -> dict:
    try:
        return vendor(vendor_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="not found")


@app.get("/oauth/{vendor_id}/start")
async def start(vendor_id: str, user: str = ""):
    v = known(vendor_id)
    if not user:
        raise HTTPException(status_code=400, detail="pass ?user=<your user id>")
    state = random_state(v["state_length"] or 32)
    pkce = pkce_pair() if v["pkce"] else None
    states.put(state, {"user": user, "vendor": vendor_id, "verifier": pkce["verifier"] if pkce else None})
    return RedirectResponse(authorize_url(v, state, pkce["challenge"] if pkce else None), status_code=302)


@app.get("/oauth/{vendor_id}/callback")
async def callback(vendor_id: str, request: Request):
    v = known(vendor_id)
    q = request.query_params
    pending = states.take(q.get("state", ""))
    if not pending or pending["vendor"] != vendor_id:
        raise HTTPException(status_code=400, detail="unknown or expired state")
    if q.get("error"):
        raise HTTPException(status_code=400, detail=f"authorization refused: {q.get('error')}")
    code = q.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="no code")
    body = await exchange_code(v, code, pending["verifier"])
    tokens.save(pending["user"], vendor_id, to_grant(body))
    return PlainTextResponse(f"Connected {v['name']}.")


@app.api_route("/webhooks/{vendor_id}", methods=["GET", "POST", "HEAD"])
async def webhook(vendor_id: str, request: Request, background: BackgroundTasks):
    known(vendor_id)
    if request.method == "HEAD":
        return Response(status_code=200)
    raw = await request.body()  # raw bytes: WHOOP and Polar sign the body exactly as sent
    headers = {k.lower(): v for k, v in request.headers.items()}
    out = check_webhook(vendor_id, request.method, headers, dict(request.query_params), raw)
    if "reply" in out:
        reply = out["reply"]
        if "json" in reply:
            return JSONResponse(reply["json"], status_code=reply["status"])
        return Response(status_code=reply["status"])
    background.add_task(handle_event, vendor_id, out["event"])
    return Response(status_code=200)
`;

function fastapiFiles(vendors) {
  return [
    { path: "requirements.txt", content: "# Pin the versions you test against.\nfastapi\nuvicorn\nhttpx\npython-dotenv\n" },
    { path: "app/__init__.py", content: '"""Load .env when python-dotenv is installed."""\ntry:\n    from dotenv import load_dotenv\n\n    load_dotenv()\nexcept ImportError:  # pragma: no cover\n    pass\n' },
    { path: "app/vendors.py", content: pyVendors(vendors) },
    { path: "app/oauth.py", content: PY_OAUTH },
    { path: "app/token_store.py", content: PY_TOKEN_STORE },
    { path: "app/webhooks.py", content: pyWebhooks(vendors) },
    { path: "app/main.py", content: PY_MAIN },
  ];
}

/* ───────────────────────────── entry point ───────────────────────────── */

/**
 * @param {{ stack: "express" | "nextjs" | "fastapi", vendors: string[], project?: string }} opts
 * @returns {{ project: string, files: { path: string, content: string }[] }}
 */
export function generateScaffold({ stack, vendors: vendorIds, project: name }) {
  const project = slugifyProject(name);
  const vendors = pick(vendorIds);
  let files;
  if (stack === "express") files = expressFiles(project, vendors);
  else if (stack === "nextjs") files = nextFiles(project, vendors);
  else if (stack === "fastapi") files = fastapiFiles(vendors);
  else throw new Error(`unknown stack ${stack}`);
  files = [
    ...files,
    { path: ".env.example", content: envExample(vendors, stack) },
    { path: ".gitignore", content: stack === "fastapi" ? ".env\n.venv/\n__pycache__/\n" : stack === "nextjs" ? "node_modules/\n.next/\n.env*.local\n" : "node_modules/\n.env\n" },
    { path: "README.md", content: readme(project, stack, vendors) },
  ];
  return { project, files: files.map((f) => ({ path: `${project}/${f.path}`, content: f.content })) };
}
