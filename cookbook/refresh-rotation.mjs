/**
 * refresh-rotation.mjs — a rotation-safe OAuth token client for fitness APIs.
 *
 * WHAT THIS IMPLEMENTS
 *   Providers that rotate refresh tokens (Strava, WHOOP, Oura, Garmin, Fitbit)
 *   invalidate the old refresh token the moment they hand you a new one. Four
 *   disciplines keep that from breaking every user at once:
 *     1. Refresh is single-flight PER USER — concurrent callers await one
 *        token-endpoint call instead of racing each other into `invalid_grant`.
 *     2. The returned refresh token is persisted ATOMICALLY with the access
 *        token, and the write is awaited before the refresh promise resolves.
 *     3. A 401 on an API call triggers exactly one refresh + retry. A second
 *        401 raises instead of looping.
 *     4. A refresh that fails with `invalid_grant` marks the grant DEAD
 *        (re-authorization required) rather than retrying forever. Every other
 *        refresh failure is transient and leaves the stored grant untouched.
 *   A 403 is never refreshed: it means the token is authentic but the scope is
 *   missing, and a refresh mints the same scopes the user already granted.
 *
 * PATTERN DOCUMENTED AT
 *   https://aifitnessapi.com/fix/refresh-token-not-working
 *   https://aifitnessapi.com/fix/strava-api-401-unauthorized
 *   https://aifitnessapi.com/learn/what-are-oauth-scopes
 *
 * Everything is injectable (store, fetch, clock) so this file is testable
 * without a network or a real provider. No runtime dependencies. Node 20+.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

/** HTTP methods aside, this is the only content type OAuth token endpoints take. */
const FORM_URLENCODED = "application/x-www-form-urlencoded";

/** Default proactive-refresh buffer: refresh when < 5 minutes of life remain. */
const DEFAULT_REFRESH_SKEW_MS = 5 * 60 * 1000;

/**
 * The grant is gone: revoked, expired, or rotated out from under us. Retrying
 * cannot fix this — the user has to authorize again.
 */
export class DeadGrantError extends Error {
  constructor(userId, reason, detail) {
    super(`grant for user ${userId} is dead (${reason}) — re-authorization required`);
    this.name = "DeadGrantError";
    this.userId = userId;
    this.reason = reason;
    this.detail = detail;
    /** Callers branch on this to route the user back through authorize. */
    this.requiresReauth = true;
  }
}

/** The token endpoint failed in a way that may succeed later. Grant untouched. */
export class RefreshFailedError extends Error {
  constructor(userId, status, payload) {
    super(`refresh for user ${userId} failed with status ${status}`);
    this.name = "RefreshFailedError";
    this.userId = userId;
    this.status = status;
    this.payload = payload;
    this.retryable = true;
  }
}

/** Refreshed once, retried once, still 401. Something else is wrong — stop. */
export class UnauthorizedAfterRefreshError extends Error {
  constructor(userId, url) {
    super(`user ${userId} still 401 after one refresh+retry of ${url}`);
    this.name = "UnauthorizedAfterRefreshError";
    this.userId = userId;
    this.url = url;
    this.status = 401;
  }
}

/**
 * Granted scope comes back space-delimited from most providers and
 * comma-delimited from Strava. Accept both rather than shipping two parsers.
 */
export function parseScope(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.slice();
  return String(value)
    .split(/[\s,]+/)
    .filter(Boolean);
}

function isOk(res) {
  if (typeof res?.ok === "boolean") return res.ok;
  return res?.status >= 200 && res?.status < 300;
}

async function readJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Providers disagree on how they express expiry. Strava sends `expires_at` in
 * epoch SECONDS; most others send `expires_in` in seconds. Normalize to epoch ms.
 */
function expiryFromPayload(payload, nowMs, defaultTtlSec) {
  const at = payload?.expires_at;
  if (typeof at === "number" && Number.isFinite(at)) {
    // Below ~1e11 the value cannot be milliseconds this century, so it is seconds.
    return at < 1e11 ? at * 1000 : at;
  }
  const inSec = Number(payload?.expires_in);
  if (Number.isFinite(inSec) && inSec > 0) return nowMs + inSec * 1000;
  return nowMs + defaultTtlSec * 1000;
}

/**
 * @typedef {object} GrantRecord
 * @property {string|null} accessToken
 * @property {string|null} refreshToken
 * @property {number} expiresAt        epoch ms
 * @property {string[]} [scope]        granted scope, as returned by the provider
 * @property {"active"|"dead"} status
 * @property {string|null} [deadReason]
 */

/**
 * @typedef {object} GrantStore
 * @property {(userId: string) => Promise<GrantRecord|null>} load
 * @property {(userId: string, record: GrantRecord) => Promise<void>} save
 *   MUST write the whole record in one atomic operation. A store that writes
 *   the access token and the refresh token in two statements recreates the bug
 *   this file exists to prevent.
 */

/**
 * @param {object} options
 * @param {GrantStore} options.store
 * @param {string} options.tokenEndpoint
 * @param {string} [options.clientId]
 * @param {string} [options.clientSecret]
 * @param {typeof globalThis.fetch} [options.fetch]
 * @param {() => number} [options.now]  epoch ms; injected in tests
 * @param {number} [options.refreshSkewMs]
 * @param {number} [options.defaultTtlSec]
 */
export function createRotatingTokenClient({
  store,
  tokenEndpoint,
  clientId,
  clientSecret,
  fetch: fetchImpl = globalThis.fetch,
  now = () => Date.now(),
  refreshSkewMs = DEFAULT_REFRESH_SKEW_MS,
  defaultTtlSec = 3600,
} = {}) {
  if (!store || typeof store.load !== "function" || typeof store.save !== "function") {
    throw new TypeError("store with load()/save() is required");
  }
  if (!tokenEndpoint) throw new TypeError("tokenEndpoint is required");
  if (typeof fetchImpl !== "function") throw new TypeError("fetch is required");

  /** userId -> in-flight refresh promise. This map IS the per-user lock. */
  const inFlight = new Map();

  async function requireLiveGrant(userId) {
    const record = await store.load(userId);
    if (!record) throw new DeadGrantError(userId, "no_grant");
    if (record.status === "dead") {
      throw new DeadGrantError(userId, record.deadReason || "revoked");
    }
    return record;
  }

  async function performRefresh(userId) {
    const record = await requireLiveGrant(userId);
    if (!record.refreshToken) {
      // No refresh token was ever issued — usually a missing offline-access
      // scope (WHOOP's `offline`). Re-authorize; there is nothing to refresh.
      throw new DeadGrantError(userId, "no_refresh_token");
    }

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: record.refreshToken,
    });
    if (clientId) body.set("client_id", clientId);
    if (clientSecret) body.set("client_secret", clientSecret);

    const res = await fetchImpl(tokenEndpoint, {
      method: "POST",
      headers: { "content-type": FORM_URLENCODED, accept: "application/json" },
      body: body.toString(),
    });
    const payload = await readJson(res);

    if (!isOk(res)) {
      if (payload?.error === "invalid_grant") {
        // The grant is dead. Clear the tokens in the SAME atomic write that
        // sets the dead flag, so a crash cannot leave a half-dead record that
        // some other worker will keep retrying.
        await store.save(userId, {
          ...record,
          accessToken: null,
          refreshToken: null,
          expiresAt: 0,
          status: "dead",
          deadReason: "invalid_grant",
          deadAt: now(),
        });
        throw new DeadGrantError(userId, "invalid_grant", payload?.error_description);
      }
      // Anything else (5xx, invalid_client, a proxy hiccup) is transient from
      // the grant's point of view. Do NOT touch the stored refresh token:
      // deleting a good token on a 503 turns an outage into a re-auth campaign.
      throw new RefreshFailedError(userId, res?.status ?? 0, payload);
    }

    if (!payload?.access_token) {
      throw new RefreshFailedError(userId, res?.status ?? 200, payload);
    }

    const next = {
      ...record,
      accessToken: payload.access_token,
      // ALWAYS take the returned refresh token. Strava's docs: "the refresh
      // token may or may not be the same refresh token used to make the
      // request... always use the most recent refresh token."
      refreshToken: payload.refresh_token ?? record.refreshToken,
      expiresAt: expiryFromPayload(payload, now(), defaultTtlSec),
      scope: payload.scope ? parseScope(payload.scope) : record.scope,
      status: "active",
      deadReason: null,
      rotatedAt: now(),
    };

    // One atomic write, awaited. The refresh promise does not resolve until the
    // new refresh token is durable — otherwise a caller could use the new
    // access token, crash, and come back holding a refresh token the provider
    // has already invalidated.
    await store.save(userId, next);
    return next;
  }

  /**
   * Single-flight refresh, keyed by user. Twenty workers that all notice an
   * expired token at the same instant produce exactly one token-endpoint call.
   */
  function refresh(userId) {
    const existing = inFlight.get(userId);
    if (existing) return existing;

    const promise = (async () => {
      try {
        return await performRefresh(userId);
      } finally {
        if (inFlight.get(userId) === promise) inFlight.delete(userId);
      }
    })();
    inFlight.set(userId, promise);
    return promise;
  }

  /**
   * Returns a usable access token, refreshing proactively when less than
   * `minTtlMs` of life remains. Never waits for a 401 to find out.
   */
  async function getAccessToken(userId, { minTtlMs = refreshSkewMs } = {}) {
    const record = await requireLiveGrant(userId);
    const ttl = (record.expiresAt ?? 0) - now();
    if (record.accessToken && ttl > minTtlMs) return record.accessToken;
    const next = await refresh(userId);
    return next.accessToken;
  }

  async function callOnce(userId, url, init) {
    const token = await getAccessToken(userId);
    const res = await fetchImpl(url, {
      ...init,
      headers: { ...(init?.headers ?? {}), authorization: `Bearer ${token}` },
    });
    return { res, token };
  }

  /**
   * If another worker already rotated while our request was in flight, use the
   * token it stored instead of burning a second rotation. This is what keeps a
   * burst of 401s from turning into a burst of refreshes.
   */
  async function refreshAfterUnauthorized(userId, usedToken) {
    const current = await store.load(userId);
    if (current && current.status !== "dead" && current.accessToken && current.accessToken !== usedToken) {
      return current;
    }
    return refresh(userId);
  }

  /**
   * Authenticated fetch with exactly one refresh + retry on 401.
   *
   * 403 is deliberately NOT retried: it means `insufficient_scope`, and a
   * refresh returns the same scopes the user already granted, so retrying is
   * an infinite loop against a server that is answering correctly.
   */
  async function fetchWithAuth(userId, url, init = {}) {
    const first = await callOnce(userId, url, init);
    if (first.res.status !== 401) return first.res;

    await refreshAfterUnauthorized(userId, first.token);

    const second = await callOnce(userId, url, init);
    if (second.res.status === 401) {
      // One refresh, one retry, done. Looping here is how a bad credential
      // becomes a self-inflicted denial of service against the provider.
      throw new UnauthorizedAfterRefreshError(userId, String(url));
    }
    return second.res;
  }

  /**
   * Kill a grant on an out-of-band signal — e.g. a Strava `athlete` webhook
   * with `updates.authorized === "false"`. Cheaper than learning from a 401.
   */
  async function markRevoked(userId, reason = "revoked") {
    const record = (await store.load(userId)) ?? {};
    await store.save(userId, {
      ...record,
      accessToken: null,
      refreshToken: null,
      expiresAt: 0,
      status: "dead",
      deadReason: reason,
      deadAt: now(),
    });
  }

  /** Read the GRANTED scope, not the requested one. Users deselect scopes. */
  async function hasScope(userId, scope) {
    const record = await store.load(userId);
    return parseScope(record?.scope).includes(scope);
  }

  return {
    getAccessToken,
    refresh,
    fetchWithAuth,
    markRevoked,
    hasScope,
    /** Observability: how many users currently have a refresh in flight. */
    pendingRefreshCount: () => inFlight.size,
  };
}

/**
 * Reference in-memory GrantStore. Real deployments swap this for a single
 * UPDATE ... SET access_token = $1, refresh_token = $2, expires_at = $3
 * statement — one row, one write, one transaction.
 */
export function createMemoryGrantStore(initial = {}) {
  const rows = new Map(Object.entries(initial));
  return {
    async load(userId) {
      const row = rows.get(userId);
      return row ? { ...row } : null;
    },
    async save(userId, record) {
      rows.set(userId, { ...record });
    },
    /** Test/debug affordance only. */
    _rows: rows,
  };
}
