/**
 * refresh-rotation.test.mjs — the contract for cookbook/refresh-rotation.mjs.
 *
 * WHAT THIS IMPLEMENTS
 *   Executable assertions that the rotation client behaves the way the source
 *   pages say it must: one token-endpoint call per refresh storm, the rotated
 *   refresh token durable before the promise resolves, exactly one refresh and
 *   retry on 401, and a dead grant on `invalid_grant`. No network: fetch, the
 *   clock, and the store are all injected.
 *
 * PATTERN DOCUMENTED AT
 *   https://aifitnessapi.com/fix/refresh-token-not-working
 *   https://aifitnessapi.com/fix/strava-api-401-unauthorized
 *   https://aifitnessapi.com/learn/what-are-oauth-scopes
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  createRotatingTokenClient,
  DeadGrantError,
  RefreshFailedError,
  UnauthorizedAfterRefreshError,
  parseScope,
} from "./refresh-rotation.mjs";

const TOKEN_URL = "https://provider.test/oauth/token";
const API_URL = "https://provider.test/v3/athlete/activities";

/** A store that counts writes and commits on a later tick, so a caller that
 *  forgets to `await store.save(...)` observes stale data and fails. */
function slowStore(initial) {
  const rows = new Map(Object.entries(initial));
  const saves = [];
  return {
    saves,
    async load(userId) {
      const row = rows.get(userId);
      return row ? { ...row } : null;
    },
    async save(userId, record) {
      await new Promise((resolve) => setImmediate(resolve));
      rows.set(userId, { ...record });
      saves.push({ userId, record: { ...record } });
    },
    peek(userId) {
      const row = rows.get(userId);
      return row ? { ...row } : null;
    },
  };
}

function jsonResponse(status, body) {
  return { status, ok: status >= 200 && status < 300, json: async () => body };
}

/** Records every call and dispatches on URL so token vs API calls are countable. */
function recordingFetch(handlers) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    const handler = String(url).startsWith(TOKEN_URL) ? handlers.token : handlers.api;
    if (!handler) throw new Error(`no handler for ${url}`);
    return handler(String(url), init, calls);
  };
  fetchImpl.calls = calls;
  fetchImpl.countTo = (prefix) => calls.filter((c) => c.url.startsWith(prefix)).length;
  return fetchImpl;
}

const CLOCK = 1_800_000_000_000; // fixed epoch ms; nothing here needs real time

test("a concurrent refresh storm makes exactly one token-endpoint call", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK - 1, status: "active" },
  });
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const fetchImpl = recordingFetch({
    token: async () => {
      await gate; // hold the refresh open so every caller piles onto it
      return jsonResponse(200, { access_token: "a2", refresh_token: "r2", expires_in: 21600 });
    },
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  const waiters = Array.from({ length: 25 }, () => client.getAccessToken("u1"));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(client.pendingRefreshCount(), 1, "all 25 callers share one in-flight refresh");
  release();
  const tokens = await Promise.all(waiters);

  assert.equal(fetchImpl.countTo(TOKEN_URL), 1, "exactly one token-endpoint call");
  assert.equal(store.saves.length, 1, "exactly one atomic write");
  assert.deepEqual(new Set(tokens), new Set(["a2"]), "every caller got the same new token");
  assert.equal(client.pendingRefreshCount(), 0, "the per-user lock is released");
});

test("a refresh storm for two users refreshes each user once, not once globally", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK - 1, status: "active" },
    u2: { accessToken: "b1", refreshToken: "s1", expiresAt: CLOCK - 1, status: "active" },
  });
  const fetchImpl = recordingFetch({
    token: async (_url, init) => {
      const sent = new URLSearchParams(init.body).get("refresh_token");
      return jsonResponse(200, {
        access_token: sent === "r1" ? "a2" : "b2",
        refresh_token: sent === "r1" ? "r2" : "s2",
        expires_in: 3600,
      });
    },
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  const tokens = await Promise.all([
    client.getAccessToken("u1"),
    client.getAccessToken("u1"),
    client.getAccessToken("u2"),
    client.getAccessToken("u2"),
  ]);

  assert.equal(fetchImpl.countTo(TOKEN_URL), 2, "one call per user, not one per caller");
  assert.deepEqual(tokens, ["a2", "a2", "b2", "b2"]);
});

test("rotation persists the NEW refresh token atomically, before resolving", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK - 1, status: "active", scope: ["read"] },
  });
  const fetchImpl = recordingFetch({
    token: async () =>
      jsonResponse(200, {
        access_token: "a2",
        refresh_token: "r2",
        expires_at: Math.floor(CLOCK / 1000) + 21600,
        scope: "read,activity:read_all",
      }),
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  const returned = await client.refresh("u1");

  // The store commits on a later tick, so a missing `await` would show up here.
  const persisted = store.peek("u1");
  assert.equal(persisted.refreshToken, "r2", "the rotated refresh token is durable");
  assert.equal(persisted.accessToken, "a2");
  assert.equal(persisted.expiresAt, CLOCK + 21600 * 1000, "epoch-seconds expires_at normalized to ms");
  assert.equal(store.saves.length, 1, "both tokens land in ONE write, not two");
  assert.equal(store.saves[0].record.accessToken, "a2");
  assert.equal(store.saves[0].record.refreshToken, "r2");
  assert.equal(returned.refreshToken, "r2");
  assert.deepEqual(persisted.scope, ["read", "activity:read_all"], "granted scope is stored, comma form parsed");
});

test("a provider that returns no refresh_token keeps the existing one", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK - 1, status: "active" },
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: recordingFetch({ token: async () => jsonResponse(200, { access_token: "a2", expires_in: 3600 }) }),
    now: () => CLOCK,
  });

  await client.refresh("u1");
  assert.equal(store.peek("u1").refreshToken, "r1");
});

test("a 401 triggers exactly one refresh + retry, and a second 401 does not loop", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK + 3_600_000, status: "active" },
  });
  const fetchImpl = recordingFetch({
    token: async () => jsonResponse(200, { access_token: "a2", refresh_token: "r2", expires_in: 3600 }),
    api: async () => jsonResponse(401, { message: "Authorization Error" }),
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  await assert.rejects(() => client.fetchWithAuth("u1", API_URL), UnauthorizedAfterRefreshError);

  assert.equal(fetchImpl.countTo(API_URL), 2, "original call + exactly one retry");
  assert.equal(fetchImpl.countTo(TOKEN_URL), 1, "exactly one refresh");
  assert.equal(fetchImpl.calls[1].url, TOKEN_URL, "the refresh sits between the two API calls");
  assert.equal(fetchImpl.calls[2].init.headers.authorization, "Bearer a2", "the retry uses the new token");
});

test("a 401 that a refresh fixes returns the retried response", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK + 3_600_000, status: "active" },
  });
  const fetchImpl = recordingFetch({
    token: async () => jsonResponse(200, { access_token: "a2", refresh_token: "r2", expires_in: 3600 }),
    api: async (_url, init) =>
      init.headers.authorization === "Bearer a2"
        ? jsonResponse(200, { ok: true })
        : jsonResponse(401, { message: "Authorization Error" }),
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  const res = await client.fetchWithAuth("u1", API_URL);
  assert.equal(res.status, 200);
  assert.equal(fetchImpl.countTo(API_URL), 2);
});

test("a 403 is never refreshed — insufficient_scope survives a refresh", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK + 3_600_000, status: "active" },
  });
  const fetchImpl = recordingFetch({
    token: async () => {
      throw new Error("must not refresh on 403");
    },
    api: async () => jsonResponse(403, { error: "insufficient_scope" }),
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  const res = await client.fetchWithAuth("u1", API_URL);
  assert.equal(res.status, 403, "the 403 is returned to the caller untouched");
  assert.equal(fetchImpl.countTo(TOKEN_URL), 0);
});

test("invalid_grant marks the grant dead and stops all further traffic", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK - 1, status: "active" },
  });
  const fetchImpl = recordingFetch({
    token: async () =>
      jsonResponse(400, { error: "invalid_grant", error_description: "Bad Request" }),
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  const err = await client.getAccessToken("u1").then(
    () => null,
    (e) => e,
  );
  assert.ok(err instanceof DeadGrantError);
  assert.equal(err.reason, "invalid_grant");
  assert.equal(err.requiresReauth, true);

  const dead = store.peek("u1");
  assert.equal(dead.status, "dead");
  assert.equal(dead.refreshToken, null, "the dead refresh token is cleared in the same write");
  assert.equal(dead.accessToken, null);

  // A dead grant short-circuits: no further token-endpoint traffic at all.
  await assert.rejects(() => client.getAccessToken("u1"), DeadGrantError);
  await assert.rejects(() => client.fetchWithAuth("u1", API_URL), DeadGrantError);
  assert.equal(fetchImpl.countTo(TOKEN_URL), 1, "the dead grant is never retried");
  assert.equal(fetchImpl.countTo(API_URL), 0);
});

test("a transient refresh failure leaves the stored refresh token intact and retryable", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK - 1, status: "active" },
  });
  let calls = 0;
  const fetchImpl = recordingFetch({
    token: async () => {
      calls += 1;
      return calls === 1
        ? jsonResponse(503, { error: "temporarily_unavailable" })
        : jsonResponse(200, { access_token: "a2", refresh_token: "r2", expires_in: 3600 });
    },
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  await assert.rejects(() => client.refresh("u1"), RefreshFailedError);
  assert.equal(store.peek("u1").refreshToken, "r1", "a 503 must not destroy a good refresh token");
  assert.equal(store.peek("u1").status, "active");
  assert.equal(client.pendingRefreshCount(), 0, "the lock is released after a failure");

  // The very next attempt succeeds — the failure was not sticky.
  assert.equal(await client.getAccessToken("u1"), "a2");
});

test("a still-valid token is served from the store without a refresh", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK + 3_600_000, status: "active" },
  });
  const fetchImpl = recordingFetch({
    token: async () => {
      throw new Error("must not refresh a live token");
    },
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
  });

  assert.equal(await client.getAccessToken("u1"), "a1");
  assert.equal(fetchImpl.countTo(TOKEN_URL), 0);
});

test("a token inside the proactive buffer is refreshed before it expires", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK + 60_000, status: "active" },
  });
  const fetchImpl = recordingFetch({
    token: async () => jsonResponse(200, { access_token: "a2", refresh_token: "r2", expires_in: 3600 }),
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: fetchImpl,
    now: () => CLOCK,
    refreshSkewMs: 5 * 60 * 1000,
  });

  assert.equal(await client.getAccessToken("u1"), "a2", "60s of life left is inside the 5m buffer");
});

test("markRevoked kills a grant from an out-of-band deauthorization event", async () => {
  const store = slowStore({
    u1: { accessToken: "a1", refreshToken: "r1", expiresAt: CLOCK + 3_600_000, status: "active" },
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: recordingFetch({}),
    now: () => CLOCK,
  });

  await client.markRevoked("u1", "athlete_deauthorized");
  assert.equal(store.peek("u1").status, "dead");
  assert.equal(store.peek("u1").deadReason, "athlete_deauthorized");
  await assert.rejects(() => client.getAccessToken("u1"), DeadGrantError);
});

test("hasScope reads the granted set, not the requested one", async () => {
  const store = slowStore({
    u1: {
      accessToken: "a1",
      refreshToken: "r1",
      expiresAt: CLOCK + 3_600_000,
      status: "active",
      scope: ["activity", "sleep"],
    },
  });
  const client = createRotatingTokenClient({
    store,
    tokenEndpoint: TOKEN_URL,
    fetch: recordingFetch({}),
    now: () => CLOCK,
  });

  assert.equal(await client.hasScope("u1", "sleep"), true);
  assert.equal(await client.hasScope("u1", "heartrate"), false, "a declined scope reads as absent");
});

test("parseScope accepts both the space- and comma-delimited forms", () => {
  assert.deepEqual(parseScope("activity heartrate sleep"), ["activity", "heartrate", "sleep"]);
  assert.deepEqual(parseScope("read,activity:read_all"), ["read", "activity:read_all"]);
  assert.deepEqual(parseScope(undefined), []);
});
