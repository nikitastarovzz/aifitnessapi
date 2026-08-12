/**
 * rate-limit-fetcher.mjs — a fetch wrapper that survives a per-user quota.
 *
 * WHAT THIS IMPLEMENTS
 *   Fitness providers meter reads PER CONSENTED USER, not per app, so one
 *   runaway backfill starves that user and nobody else — and adding workers
 *   makes it worse, not better. This wrapper:
 *     1. Tracks a per-user request budget in a rolling window, and re-syncs it
 *        from the provider's own rate-limit headers rather than trusting a
 *        hard-coded number.
 *     2. Honours `Retry-After` on 429 in BOTH forms RFC 9110 §10.2.3 permits:
 *        delay-seconds and HTTP-date. RFC 6585 §4 only says a 429 MAY carry
 *        the header, so a missing header falls back to jittered backoff.
 *     3. Backs off 5xx with exponential backoff and FULL JITTER, so every
 *        worker does not resynchronize onto the same second when a provider
 *        recovers.
 *     4. Opens a circuit after N consecutive failures per origin and then
 *        DEGRADES — skips the call and records the gap for a later sweep —
 *        instead of hammering a provider that is already down.
 *     5. Never retries a non-idempotent call on an ambiguous failure. A POST
 *        that died in transit, or answered 5xx, may or may not have landed.
 *   Nothing throws for an HTTP outcome: every call returns an envelope, so a
 *   caller parks the window and moves on rather than crashing a worker.
 *
 * PATTERN DOCUMENTED AT
 *   https://aifitnessapi.com/fix/fitbit-api-429-rate-limit
 *   https://aifitnessapi.com/test/rate-limits-and-outages
 *
 * Clock, sleep, jitter source and fetch are all injected, so the tests below
 * run in microseconds against a fake clock and never touch a network.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

/** Methods safe to replay when we cannot tell whether the call landed. */
export const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "OPTIONS", "PUT", "DELETE"]);

/** Headers providers use to report the remaining allowance, in priority order. */
const REMAINING_HEADERS = [
  "fitbit-rate-limit-remaining",
  "x-ratelimit-remaining",
  "ratelimit-remaining",
];
/** Headers reporting seconds until the window resets. */
const RESET_HEADERS = ["fitbit-rate-limit-reset", "x-ratelimit-reset", "ratelimit-reset"];

export function headerOf(res, name) {
  const h = res?.headers;
  if (!h) return null;
  if (typeof h.get === "function") return h.get(name);
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(h)) {
    if (k.toLowerCase() === lower) return Array.isArray(v) ? v[0] : v;
  }
  return null;
}

/**
 * Parse `Retry-After` into milliseconds. RFC 9110 §10.2.3 allows delay-seconds
 * OR an HTTP-date; a parser that only calls parseInt is non-compliant and will
 * silently fall through to a default on any provider that sends the date form.
 *
 * @returns {number|null} ms to wait, clamped at 0, or null if unparseable.
 */
export function parseRetryAfter(value, nowMs) {
  if (value === null || value === undefined || value === "") return null;
  const raw = String(value).trim();
  if (/^\d+$/.test(raw)) return Number(raw) * 1000;
  const at = Date.parse(raw);
  if (Number.isNaN(at)) return null;
  return Math.max(0, at - nowMs);
}

/**
 * Exponential backoff with FULL jitter: uniform in [0, min(cap, base * 2^n)].
 * Fixed backoff passes every single-user test and then synchronizes your whole
 * fleet onto one second the moment the provider comes back.
 */
export function fullJitterDelay(attempt, { baseDelayMs = 500, maxDelayMs = 60_000, random = Math.random } = {}) {
  const exponential = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt - 1));
  return Math.floor(random() * exponential);
}

/** Per-user rolling request budget. Reset is a wall-clock window, not a tick. */
function createBudgetTracker({ limit, windowMs, now }) {
  const users = new Map();
  function stateFor(userId) {
    let s = users.get(userId);
    if (!s || now() >= s.resetAt) {
      s = { remaining: limit, resetAt: now() + windowMs, limit };
      users.set(userId, s);
    }
    return s;
  }
  return {
    take(userId) {
      const s = stateFor(userId);
      if (s.remaining <= 0) return { ok: false, resetAt: s.resetAt };
      s.remaining -= 1;
      return { ok: true, resetAt: s.resetAt };
    },
    /** Trust the provider's count over ours when it tells us one. */
    syncFromResponse(userId, res) {
      const s = stateFor(userId);
      for (const name of REMAINING_HEADERS) {
        const v = headerOf(res, name);
        if (v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v))) {
          s.remaining = Number(v);
          break;
        }
      }
      for (const name of RESET_HEADERS) {
        const v = headerOf(res, name);
        if (v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v))) {
          s.resetAt = now() + Number(v) * 1000;
          break;
        }
      }
    },
    peek: (userId) => ({ ...stateFor(userId) }),
  };
}

/**
 * Per-origin circuit breaker with a half-open probe.
 * 429 deliberately does NOT count as a failure: a provider answering 429 is
 * healthy and telling you the truth. Only 5xx and transport errors trip it.
 */
function createBreaker({ threshold, cooldownMs, now }) {
  const keys = new Map();
  const stateFor = (key) => {
    let s = keys.get(key);
    if (!s) {
      s = { failures: 0, openUntil: 0, halfOpen: false };
      keys.set(key, s);
    }
    return s;
  };
  return {
    /** @returns {{blocked: boolean, retryAtMs?: number}} */
    check(key) {
      const s = stateFor(key);
      if (s.openUntil === 0) return { blocked: false };
      if (now() < s.openUntil) return { blocked: true, retryAtMs: s.openUntil };
      s.halfOpen = true; // one probe allowed through
      return { blocked: false };
    },
    recordSuccess(key) {
      const s = stateFor(key);
      s.failures = 0;
      s.openUntil = 0;
      s.halfOpen = false;
    },
    recordFailure(key) {
      const s = stateFor(key);
      s.failures += 1;
      if (s.halfOpen || s.failures >= threshold) {
        s.openUntil = now() + cooldownMs;
        s.halfOpen = false;
      }
    },
    peek: (key) => ({ ...stateFor(key) }),
  };
}

/**
 * @param {object} options
 * @param {typeof globalThis.fetch} [options.fetch]
 * @param {() => number} [options.now]              epoch ms
 * @param {(ms: number) => Promise<void>} [options.sleep]
 * @param {() => number} [options.random]           jitter source
 * @param {{limit: number, windowMs: number}} [options.budget]
 * @param {{threshold: number, cooldownMs: number}} [options.breaker]
 * @param {number} [options.maxAttempts]
 * @param {number} [options.baseDelayMs]
 * @param {number} [options.maxDelayMs]
 * @param {number} [options.maxWaitMs]  refuse to sit on a Retry-After longer
 *                                      than this; park the window instead
 * @param {(gap: object) => void} [options.onGap]
 * @param {(url: string) => string} [options.scopeOf]  breaker key
 */
export function createRateLimitedFetcher({
  fetch: fetchImpl = globalThis.fetch,
  now = () => Date.now(),
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  random = Math.random,
  budget: budgetOpts = { limit: 150, windowMs: 3_600_000 },
  breaker: breakerOpts = { threshold: 5, cooldownMs: 60_000 },
  maxAttempts = 4,
  baseDelayMs = 500,
  maxDelayMs = 60_000,
  maxWaitMs = 15 * 60_000,
  onGap = () => {},
  scopeOf = (url) => {
    try {
      return new URL(String(url)).origin;
    } catch {
      return String(url);
    }
  },
} = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetch is required");

  const budget = createBudgetTracker({ ...budgetOpts, now });
  const breaker = createBreaker({ ...breakerOpts, now });
  /** Every window we did not read. A reconciliation sweep drains this. */
  const gaps = [];

  function recordGap(entry) {
    const gap = { at: now(), ...entry };
    gaps.push(gap);
    onGap(gap);
    return gap;
  }

  /**
   * @returns {Promise<{
   *   outcome: "ok"|"rate-limited"|"failed"|"ambiguous"|"skipped",
   *   response?: object, error?: Error, status: number|null,
   *   attempts: number, waitedMs: number, reason?: string,
   *   retryAtMs?: number, ambiguous?: boolean
   * }>}
   */
  async function fetchForUser(userId, url, init = {}) {
    const key = scopeOf(url);
    const method = String(init.method ?? "GET").toUpperCase();
    const idempotent = init.idempotent ?? IDEMPOTENT_METHODS.has(method);
    let attempts = 0;
    let waitedMs = 0;

    for (;;) {
      // --- Circuit first: a degrade is cheaper than a doomed request. -------
      const circuit = breaker.check(key);
      if (circuit.blocked) {
        recordGap({ userId, url: String(url), reason: "circuit-open", retryAtMs: circuit.retryAtMs });
        return {
          outcome: "skipped",
          reason: "circuit-open",
          status: null,
          attempts,
          waitedMs,
          retryAtMs: circuit.retryAtMs,
        };
      }

      // --- Then the per-user budget. One user's exhaustion is one user's. ---
      const allowance = budget.take(userId);
      if (!allowance.ok) {
        recordGap({ userId, url: String(url), reason: "budget-exhausted", retryAtMs: allowance.resetAt });
        return {
          outcome: "skipped",
          reason: "budget-exhausted",
          status: null,
          attempts,
          waitedMs,
          retryAtMs: allowance.resetAt,
        };
      }

      attempts += 1;
      let res;
      try {
        res = await fetchImpl(url, init);
      } catch (error) {
        // Transport died. We do not know whether the server saw the request.
        breaker.recordFailure(key);
        if (!idempotent) {
          recordGap({ userId, url: String(url), reason: "ambiguous-transport-error", method });
          return { outcome: "ambiguous", ambiguous: true, error, status: null, attempts, waitedMs, reason: "non-idempotent" };
        }
        if (attempts >= maxAttempts) {
          recordGap({ userId, url: String(url), reason: "transport-error" });
          return { outcome: "failed", error, status: null, attempts, waitedMs, reason: "transport-error" };
        }
        const delay = fullJitterDelay(attempts, { baseDelayMs, maxDelayMs, random });
        await sleep(delay);
        waitedMs += delay;
        continue;
      }

      budget.syncFromResponse(userId, res);

      if (res.status === 429) {
        // A 429 is a healthy answer, so it does not trip the breaker — it
        // consumes the retry budget and then parks the window.
        const retryAfter =
          parseRetryAfter(headerOf(res, "retry-after"), now()) ??
          resetHeaderMs(res) ??
          fullJitterDelay(attempts, { baseDelayMs, maxDelayMs, random });

        if (attempts >= maxAttempts || waitedMs + retryAfter > maxWaitMs) {
          recordGap({ userId, url: String(url), reason: "rate-limited", retryAtMs: now() + retryAfter });
          return {
            outcome: "rate-limited",
            response: res,
            status: 429,
            attempts,
            waitedMs,
            reason: "rate-limited",
            retryAtMs: now() + retryAfter,
          };
        }
        await sleep(retryAfter);
        waitedMs += retryAfter;
        continue;
      }

      if (res.status >= 500) {
        breaker.recordFailure(key);
        if (!idempotent) {
          // The server may have applied it before failing. Replaying a POST
          // here is how one workout becomes two.
          recordGap({ userId, url: String(url), reason: "ambiguous-5xx", method });
          return { outcome: "ambiguous", ambiguous: true, response: res, status: res.status, attempts, waitedMs, reason: "non-idempotent" };
        }
        if (attempts >= maxAttempts) {
          recordGap({ userId, url: String(url), reason: "server-error", status: res.status });
          return { outcome: "failed", response: res, status: res.status, attempts, waitedMs, reason: "server-error" };
        }
        const delay = fullJitterDelay(attempts, { baseDelayMs, maxDelayMs, random });
        await sleep(delay);
        waitedMs += delay;
        continue;
      }

      // 2xx, 3xx and 4xx are all final. A 404 or a 401 is the caller's problem
      // to interpret; retrying it just burns the user's quota.
      breaker.recordSuccess(key);
      return { outcome: "ok", response: res, status: res.status, attempts, waitedMs };
    }
  }

  function resetHeaderMs(res) {
    for (const name of RESET_HEADERS) {
      const v = headerOf(res, name);
      if (v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v))) {
        return Number(v) * 1000;
      }
    }
    return null;
  }

  return {
    fetchForUser,
    /** Windows we skipped. Feed these to the reconciliation sweep. */
    gaps,
    budgetFor: (userId) => budget.peek(userId),
    breakerState: (urlOrKey) => breaker.peek(scopeOf(urlOrKey)),
  };
}
