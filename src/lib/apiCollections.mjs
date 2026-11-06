/**
 * Postman and Bruno collections for the vendor OAuth flows and webhook
 * samples this site documents (ops/VIRAL-20-2026-11-06.md item 12).
 *
 * Built only from src/data/oauthVendors.ts (via src/lib/oauthPlaygroundData.ts,
 * which joins the Google Health API scopes) and src/data/webhookPayloads.ts.
 * Pure and dependency-free: scripts/build-collections.mjs writes the files,
 * the /collections page lists them, and scripts/collections.test.mjs checks
 * them, all through this module.
 *
 * Rules it keeps, the same as the OAuth playground's:
 *   - No secret ships. client_secret, the code, tokens and PKCE values are
 *     empty variables the reader fills in a Postman environment or Bruno
 *     environment of their own.
 *   - No parameter is invented. Each request carries exactly the fields
 *     src/lib/oauthPlayground.ts puts in its curl command for that vendor
 *     (scripts/collections.test.mjs compares the two), and where a vendor
 *     documents no refresh call there is no refresh request.
 *   - A webhook sample is a vendor's printed example. Payloads whose example
 *     is not valid as published are left out, as public/webhooks/send-sample.mjs
 *     leaves them out; Wahoo's is kept with "{{webhook_token}}" where Wahoo
 *     prints <webhook_token>. Signature headers are the vendor's placeholder
 *     values: a request that a verifier accepts needs the mock sender.
 *
 * Postman: Collection Format v2.1.0, the schema at
 * https://schema.getpostman.com/json/collection/v2.1.0/collection.json (read
 * 2026-11-06 through .github/workflows/source-snapshot.yml).
 * Bruno: one folder per vendor, with bruno.json ({"version":"1","name",
 * "type":"collection"}, as Bruno's own example collections ship it), one
 * .bru file per request in Bru markup, and environments/Local.bru.
 */

export const POSTMAN_SCHEMA = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";
export const COLLECTIONS_BASE = "/collections";
export const SITE = "https://aifitnessapi.com";

/** Placeholder text for a value the reader supplies. Never a real value. */
const FILL = "";

/* ---------------------------------------------------------------------- *
 * The requests, as a neutral model both formats are rendered from
 * ---------------------------------------------------------------------- */

/**
 * @typedef {{ key: string, value: string, disabled?: boolean, description?: string }} KV
 * @typedef {{
 *   name: string, method: "GET" | "POST", url: string, query: KV[], headers: KV[],
 *   body: null | { mode: "urlencoded", fields: KV[] } | { mode: "json", raw: string },
 *   basicAuth: boolean, description: string,
 * }} Req
 * @typedef {{ name: string, description: string, requests: Req[] }} Folder
 * @typedef {{ key: string, value: string, description: string }} Variable
 * @typedef {{ id: string, name: string, description: string, folders: Folder[], variables: Variable[] }} VendorCollection
 */

const v = (name) => `{{${name}}}`;

function sourceLine(src) {
  return src ? `Source: ${src.label}, ${src.url}` : "";
}

function para(...lines) {
  return lines.filter(Boolean).join("\n\n");
}

/** Body credential fields, as oauthPlayground's bodyCreds. */
function bodyCreds(vendor, withSecret) {
  if (vendor.clientAuth === "basic") return [];
  const f = [{ key: "client_id", value: v("client_id") }];
  if (withSecret) f.push({ key: "client_secret", value: v("client_secret") });
  return f;
}

function extraHeaders(vendor) {
  return Object.entries(vendor.extraHeaders ?? {}).map(([key, value]) => ({ key, value }));
}

const FORM = { key: "Content-Type", value: "application/x-www-form-urlencoded" };

function hasPkce(vendor) {
  return vendor.pkce.status !== "not-documented";
}

/**
 * The OAuth folder for one vendor.
 * @param {any} vendor an OAuthVendor with its scope list filled in
 * @param {Record<string, {url: string, label: string}>} sources OAUTH_SOURCES
 * @param {any} [scopeSource] where the scope list came from, when not the vendor's own page (Google)
 */
export function oauthFolder(vendor, sources, scopeSource) {
  const src = (id) => sources[id];
  const pkce = hasPkce(vendor);
  /** @type {Req[]} */
  const requests = [];

  // 1. Authorize: a URL to open in a browser.
  const query = [
    { key: "response_type", value: "code" },
    { key: "client_id", value: v("client_id") },
    { key: "redirect_uri", value: v("redirect_uri") },
    { key: "scope", value: v("scope") },
    { key: "state", value: v("state") },
  ];
  if (pkce) {
    query.push({ key: "code_challenge", value: v("code_challenge") });
    query.push({ key: "code_challenge_method", value: vendor.pkce.methods[0] ?? "S256" });
  }
  for (const [key, value] of Object.entries(vendor.extraAuthorizeParams ?? {})) query.push({ key, value });
  const scopes = vendor.scopes.map((s) => `- ${s.scope}: ${s.grants}`).join("\n");
  requests.push({
    name: "1. Authorization URL (open in a browser)",
    method: "GET",
    url: vendor.authorizeUrl,
    query,
    headers: [],
    body: null,
    basicAuth: false,
    description: para(
      `${vendor.authorizeUrl}. ${vendor.authorize.text} Open this URL in a browser (in Postman: copy it from the request bar); the user signs in and ${vendor.name} redirects to {{redirect_uri}} with ?code=… Put that value in the auth_code variable.`,
      sourceLine(src(vendor.authorize.source)),
      vendor.scopeNote ? `Scope: ${vendor.scopeNote.text} ${sourceLine(src(vendor.scopeNote.source))}` : "",
      scopes ? `Documented scopes (joined with ${vendor.scopeSeparator === "," ? "commas" : "spaces"}):\n${scopes}${scopeSource ? `\n\n${sourceLine(scopeSource)}` : ""}` : "",
      vendor.requiredScopes?.length ? `Required scope: ${vendor.requiredScopes.join(", ")} (the scope variable starts with it).` : "",
      `PKCE: ${vendor.pkce.text}${pkce ? " Generate a verifier and challenge in your browser at " + SITE + "/tools/oauth-playground and put them in code_verifier and code_challenge." : ""} ${vendor.pkce.source ? sourceLine(src(vendor.pkce.source)) : ""}`.trim(),
      ...vendor.altAuthorize.map((a) => `Also documented: ${a.url}. ${a.text} ${sourceLine(src(a.source))}`),
    ),
  });

  // 2. Code for tokens.
  const tokenDesc = (extra) =>
    para(
      `${vendor.tokenUrl}. ${vendor.token.text}`,
      sourceLine(src(vendor.token.source)),
      extra,
      `Token lifetime: ${vendor.lifetime.text} ${sourceLine(src(vendor.lifetime.source))}`,
      ...vendor.notes.map((n) => `Note: ${n.text} ${sourceLine(src(n.source))}`),
    );

  if (vendor.tokenStyle === "query") {
    requests.push({
      name: "2. Exchange the code for tokens",
      method: "POST",
      url: vendor.tokenUrl,
      query: [
        { key: "client_secret", value: v("client_secret") },
        { key: "code", value: v("auth_code") },
        { key: "redirect_uri", value: v("redirect_uri") },
        { key: "grant_type", value: "authorization_code" },
        { key: "client_id", value: v("client_id") },
      ],
      headers: extraHeaders(vendor),
      body: null,
      basicAuth: false,
      description: tokenDesc(`${vendor.name} documents the parameters in the query string of the POST.`),
    });
    if (pkce) {
      requests.push({
        name: "2b. Exchange the code for tokens (PKCE app)",
        method: "POST",
        url: vendor.tokenUrl,
        query: [
          { key: "client_id", value: v("client_id") },
          { key: "code", value: v("auth_code") },
          { key: "redirect_uri", value: v("redirect_uri") },
          { key: "grant_type", value: "authorization_code" },
          { key: "code_verifier", value: v("code_verifier") },
        ],
        headers: extraHeaders(vendor),
        body: null,
        basicAuth: false,
        description: tokenDesc(`A PKCE app sends code_verifier instead of client_secret. ${vendor.pkce.text}`),
      });
    }
  } else if (vendor.tokenStyle === "withings") {
    requests.push({
      name: "2. Exchange the code for tokens",
      method: "POST",
      url: vendor.tokenUrl,
      query: [],
      headers: [FORM, ...extraHeaders(vendor)],
      body: {
        mode: "urlencoded",
        fields: [
          { key: "action", value: "requesttoken" },
          { key: "client_id", value: v("client_id") },
          { key: "grant_type", value: "authorization_code" },
          { key: "code", value: v("auth_code") },
          { key: "redirect_uri", value: v("redirect_uri") },
          { key: "nonce", value: v("nonce") },
          { key: "signature", value: v("signature") },
        ],
      },
      basicAuth: false,
      description: tokenDesc(
        "Withings signs this request: get a nonce from its signature service and compute the signature with your client secret as its “Request Signature” page describes, then put both in the nonce and signature variables. This collection does not compute them.",
      ),
    });
  } else {
    const fields = [
      { key: "grant_type", value: "authorization_code" },
      { key: "code", value: v("auth_code") },
      { key: "redirect_uri", value: v("redirect_uri") },
      ...bodyCreds(vendor, true),
    ];
    if (pkce) fields.push({ key: "code_verifier", value: v("code_verifier"), disabled: true, description: "Enable when the authorization request carried a code_challenge." });
    const auth = vendor.clientAuth === "basic";
    requests.push({
      name: "2. Exchange the code for tokens",
      method: "POST",
      url: vendor.tokenUrl,
      query: [],
      headers: [FORM, ...extraHeaders(vendor)],
      body: { mode: "urlencoded", fields },
      basicAuth: auth,
      description: tokenDesc(
        auth
          ? "Client credentials go as HTTP Basic: {{client_id}} as the user name, {{client_secret}} as the password."
          : vendor.clientAuth === "basic-or-body"
            ? "Client credentials go in the form body here; the vendor also accepts HTTP Basic."
            : "Client credentials go in the form body.",
      ),
    });
  }

  // 3. Refresh, only where the vendor documents the call.
  const refreshDesc = para(`Refresh: ${vendor.refresh.text}`, sourceLine(src(vendor.refresh.source)));
  if (vendor.refresh.curl) {
    if (vendor.tokenStyle === "query") {
      requests.push({
        name: "3. Refresh the access token",
        method: "POST",
        url: vendor.tokenUrl,
        query: [
          { key: "client_secret", value: v("client_secret") },
          { key: "client_id", value: v("client_id") },
          { key: "grant_type", value: "refresh_token" },
          { key: "refresh_token", value: v("refresh_token") },
        ],
        headers: extraHeaders(vendor),
        body: null,
        basicAuth: false,
        description: refreshDesc,
      });
      if (pkce) {
        requests.push({
          name: "3b. Refresh the access token (PKCE app)",
          method: "POST",
          url: vendor.tokenUrl,
          query: [
            { key: "client_id", value: v("client_id") },
            { key: "grant_type", value: "refresh_token" },
            { key: "refresh_token", value: v("refresh_token") },
            { key: "code_verifier", value: v("code_verifier") },
          ],
          headers: extraHeaders(vendor),
          body: null,
          basicAuth: false,
          description: refreshDesc,
        });
      }
    } else {
      const fields = [{ key: "grant_type", value: "refresh_token" }, { key: "refresh_token", value: v("refresh_token") }, ...bodyCreds(vendor, true)];
      if (vendor.id === "whoop") fields.push({ key: "scope", value: "offline", description: "WHOOP's sample refresh payload carries scope=offline." });
      requests.push({
        name: "3. Refresh the access token",
        method: "POST",
        url: vendor.tokenUrl,
        query: [],
        headers: [FORM, ...extraHeaders(vendor)],
        body: { mode: "urlencoded", fields },
        basicAuth: vendor.clientAuth === "basic",
        description: refreshDesc,
      });
    }
  }

  return {
    name: "OAuth 2.0",
    description: para(
      `${vendor.name}'s authorization-code flow as its documentation describes it, read ${sources[vendor.authorize.source]?.fetched ?? ""}. Fill client_id, redirect_uri and scope in an environment of your own and keep client_secret there, never in a shared collection.${vendor.refresh.curl ? "" : ` No refresh request: ${vendor.refresh.text}`}`,
      `The same facts, with each source sentence, at ${SITE}${vendor.guide} and ${SITE}/tools/oauth-playground.`,
    ),
    requests,
  };
}

/**
 * The webhook-samples folder for one vendor: every documented example that is
 * valid as published, POSTed to {{local_url}}.
 */
export function webhookFolder(wv, sources) {
  const src = (id) => sources[id];
  /** @type {Req[]} */
  const requests = [];
  for (const p of wv.payloads) {
    let body = null;
    if (p.sample != null) {
      body =
        p.encoding === "form"
          ? {
              mode: "urlencoded",
              fields: (typeof p.sample === "string" ? [...new URLSearchParams(p.sample)] : Object.entries(p.sample)).map(([key, value]) => ({ key, value: String(value) })),
            }
          : { mode: "json", raw: JSON.stringify(p.sample, null, 2) };
    } else if (wv.id === "wahoo") {
      // As the mock sender does (JSON.stringify of your token): a JSON string where Wahoo prints <webhook_token>.
      body = { mode: "json", raw: p.example.replace(/<webhook_token>/g, `"${v("webhook_token")}"`) };
    } else continue;
    const headers = [
      { key: "Content-Type", value: p.encoding === "form" ? "application/x-www-form-urlencoded" : "application/json" },
      ...Object.entries(p.headers ?? {}).map(([key, value]) => ({ key, value, description: `As in ${wv.name}'s example.` })),
    ];
    requests.push({
      name: p.title,
      method: "POST",
      url: v("local_url"),
      query: [],
      headers,
      body,
      basicAuth: false,
      description: para(
        `${p.trigger}`,
        `${p.evidence.text} ${sourceLine(src(p.evidence.source))}`,
        p.sampleNote ?? "",
      ),
    });
  }
  if (!requests.length) return null;
  return {
    name: "Webhook samples",
    description: para(
      `${wv.name}'s documented example notifications, sent to {{local_url}} (your local handler) unchanged. Signature: ${wv.signature.text} ${sourceLine(src(wv.signature.source))}`,
      `Headers that carry a signature hold the placeholder ${wv.name} prints, so a handler that verifies signatures will reject these: to send correctly signed requests, use ${SITE}/webhooks/send-sample.mjs. Respond: ${wv.respond.text}`,
      `Payload library with JSON Schemas: ${SITE}/webhooks#${wv.id}.`,
    ),
    requests,
  };
}

const VAR_DOCS = {
  client_id: "Your app's client ID, from the vendor's developer console.",
  client_secret: "Keep it in a Postman or Bruno environment marked secret. This collection ships it empty.",
  redirect_uri: "The redirect URI registered with the vendor.",
  scope: "Scopes to request, joined as the vendor documents (see the authorization request).",
  state: "A random value you check on the redirect.",
  code_verifier: "PKCE verifier (generate one at /tools/oauth-playground).",
  code_challenge: "PKCE challenge for that verifier.",
  auth_code: "The ?code= value from the redirect.",
  refresh_token: "The refresh_token from the token response.",
  nonce: "Withings: the nonce from its signature service.",
  signature: "Withings: the signature computed with your client secret.",
  local_url: "Where your webhook handler listens.",
  webhook_token: "Wahoo: the webhook token you set in the app's webhook settings.",
};

/** Every {{name}} a folder uses, in VAR_DOCS order. */
function usedVariables(folders) {
  const text = JSON.stringify(folders);
  return Object.keys(VAR_DOCS).filter((k) => text.includes(`{{${k}}}`));
}

/**
 * @param {{ oauthVendors: any[], oauthSources: any, googleScopeSource: any, webhookVendors: any[], webhookSources: any }} data
 * @returns {VendorCollection[]}
 */
export function vendorCollections(data) {
  const ids = [...new Set([...data.oauthVendors.map((o) => o.id), ...data.webhookVendors.map((w) => w.id)])];
  const out = [];
  for (const id of ids) {
    const o = data.oauthVendors.find((x) => x.id === id);
    const w = data.webhookVendors.find((x) => x.id === id);
    const folders = [];
    if (o) folders.push(oauthFolder(o, data.oauthSources, id === "google-health" ? data.googleScopeSource : null));
    const wf = w ? webhookFolder(w, data.webhookSources) : null;
    if (wf) folders.push(wf);
    if (!folders.length) continue;
    const name = o?.name ?? w.name;
    const variables = usedVariables(folders).map((key) => ({
      key,
      value: key === "scope" ? (o?.requiredScopes ?? []).join(o?.scopeSeparator ?? " ") : key === "local_url" ? `http://localhost:3000/webhooks/${id}` : FILL,
      description: VAR_DOCS[key],
    }));
    out.push({
      id,
      name,
      description: `${name}: ${folders.map((f) => f.name).join(" and ")} requests built from the vendor documentation aifitnessapi.com quotes. Generated by scripts/build-collections.mjs; no secrets included. ${SITE}${COLLECTIONS_BASE}`,
      folders,
      variables,
    });
  }
  return out;
}

/* ---------------------------------------------------------------------- *
 * Postman Collection v2.1.0
 * ---------------------------------------------------------------------- */

function postmanUrl(raw, query) {
  if (raw.startsWith("{{")) return { raw, host: [raw] };
  const u = new URL(raw);
  const qs = query.filter((q) => !q.disabled).map((q) => `${q.key}=${q.value}`).join("&");
  const url = {
    raw: `${raw}${qs ? `?${qs}` : ""}`,
    protocol: u.protocol.replace(":", ""),
    host: u.hostname.split("."),
    path: u.pathname.split("/").filter(Boolean),
  };
  if (query.length) url.query = query.map((q) => ({ key: q.key, value: q.value, ...(q.disabled ? { disabled: true } : {}) }));
  return url;
}

function postmanRequest(r) {
  const request = {
    method: r.method,
    header: r.headers.map((h) => ({ key: h.key, value: h.value, type: "text", ...(h.description ? { description: h.description } : {}) })),
    url: postmanUrl(r.url, r.query),
    description: r.description,
  };
  if (r.basicAuth) {
    request.auth = {
      type: "basic",
      basic: [
        { key: "username", value: v("client_id"), type: "string" },
        { key: "password", value: v("client_secret"), type: "string" },
      ],
    };
  }
  if (r.body?.mode === "urlencoded") {
    request.body = {
      mode: "urlencoded",
      urlencoded: r.body.fields.map((f) => ({ key: f.key, value: f.value, type: "text", ...(f.disabled ? { disabled: true } : {}), ...(f.description ? { description: f.description } : {}) })),
    };
  } else if (r.body?.mode === "json") {
    request.body = { mode: "raw", raw: r.body.raw, options: { raw: { language: "json" } } };
  }
  return { name: r.name, request, response: [] };
}

/** One vendor's collection as a Postman v2.1.0 object. */
export function postmanCollection(c) {
  return {
    info: {
      _postman_id: `aifitnessapi-${c.id}`,
      name: `${c.name} (aifitnessapi.com)`,
      description: c.description,
      schema: POSTMAN_SCHEMA,
    },
    item: c.folders.map((f) => ({ name: f.name, description: f.description, item: f.requests.map(postmanRequest) })),
    variable: c.variables.map((x) => ({ key: x.key, value: x.value, type: "string", description: x.description })),
  };
}

/* ---------------------------------------------------------------------- *
 * Bruno (Bru markup)
 * ---------------------------------------------------------------------- */

/** A dictionary key, quoted when Bru needs it (spaces, colons, braces, quotes). */
function bruKey(k) {
  return /^[A-Za-z0-9_.\-]+$/.test(k) ? k : `"${k.replace(/(["\\])/g, "\\$1")}"`;
}

/** A single-line dictionary value. */
function bruValue(s) {
  return String(s).replace(/\r?\n/g, " ");
}

function bruDict(tag, pairs) {
  if (!pairs.length) return "";
  const lines = pairs.map((p) => `  ${p.disabled ? "~" : ""}${bruKey(p.key)}: ${bruValue(p.value)}`);
  return `${tag} {\n${lines.join("\n")}\n}\n`;
}

function indent(text) {
  return text
    .split("\n")
    .map((l) => (l ? `  ${l}` : ""))
    .join("\n");
}

/** File-system-safe name for a request file. */
export function bruFileName(name) {
  return `${name.replace(/[^A-Za-z0-9 ()&.,'-]+/g, " ").replace(/\s+/g, " ").trim()}.bru`;
}

export function bruRequest(r, seq) {
  const qs = r.query.filter((q) => !q.disabled).map((q) => `${q.key}=${q.value}`).join("&");
  const bodyMode = r.body?.mode === "urlencoded" ? "formUrlEncoded" : r.body?.mode === "json" ? "json" : "none";
  const parts = [
    `meta {\n  name: ${bruValue(r.name)}\n  type: http\n  seq: ${seq}\n}\n`,
    `${r.method.toLowerCase()} {\n  url: ${r.url}${qs ? `?${qs}` : ""}\n  body: ${bodyMode}\n  auth: ${r.basicAuth ? "basic" : "none"}\n}\n`,
    bruDict("params:query", r.query),
    bruDict("headers", r.headers),
    r.basicAuth ? `auth:basic {\n  username: ${v("client_id")}\n  password: ${v("client_secret")}\n}\n` : "",
    r.body?.mode === "urlencoded" ? bruDict("body:form-urlencoded", r.body.fields) : "",
    r.body?.mode === "json" ? `body:json {\n${indent(r.body.raw)}\n}\n` : "",
    r.description ? `docs {\n${indent(r.description)}\n}\n` : "",
  ];
  return parts.filter(Boolean).join("\n");
}

/**
 * One vendor's Bruno collection folder: { "<path>": content }. Paths are
 * relative to the collection root.
 */
export function brunoFiles(c) {
  const files = {};
  files["bruno.json"] = `${JSON.stringify({ version: "1", name: `${c.name} (aifitnessapi.com)`, type: "collection" }, null, 2)}\n`;
  files["collection.bru"] = `docs {\n${indent(c.description)}\n}\n`;
  for (const f of c.folders) {
    files[`${f.name}/folder.bru`] = `meta {\n  name: ${f.name}\n}\n\ndocs {\n${indent(f.description)}\n}\n`;
    f.requests.forEach((r, i) => {
      files[`${f.name}/${bruFileName(r.name)}`] = bruRequest(r, i + 1);
    });
  }
  const secret = c.variables.filter((x) => x.key === "client_secret").map((x) => x.key);
  const plain = c.variables.filter((x) => x.key !== "client_secret");
  files["environments/Local.bru"] =
    `vars {\n${plain.map((x) => `  ${x.key}: ${x.value}`).join("\n")}\n}\n` + (secret.length ? `vars:secret [\n${secret.map((s) => `  ${s}`).join(",\n")}\n]\n` : "");
  return files;
}

/** Published paths for one vendor. */
export function collectionPaths(id) {
  return {
    postman: `${COLLECTIONS_BASE}/${id}.postman_collection.json`,
    brunoZip: `${COLLECTIONS_BASE}/${id}.bruno.zip`,
  };
}
