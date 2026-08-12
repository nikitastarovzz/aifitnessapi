/**
 * rate-limit-fetcher.test.mjs — the contract for cookbook/rate-limit-fetcher.mjs.
 *
 * WHAT THIS IMPLEMENTS
 *   Fault injection at the HTTP boundary, against a fake clock: 429 in both
 *   Retry-After forms, a 429 with no header at all, per-user budget isolation,
 *   jitter bounds, breaker degradation, and the non-idempotent ambiguous case.
 *   The assertions are about observable state — what was called, what was
 *   waited, what was recorded — not about the wrapper's internal decisions.
 *
 * PATTERN DOCUMENTED AT
 *   https://aifitnessapi.com/fix/fitbit-api-429-rate-limit
 *   https://aifitnessapi.com/test/rate-limits-and-outages
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  createRateLimitedFetcher,
  parseRetryAfter,
  fullJitterDelay,
  IDEMPOTENT_METHODS,
} from "./rate-limit-fetcher.mjs";

const START = 1_785_024_000_000; // whole seconds, so HTTP-date round-trips exactly
const URL_A = "https://api.provider.test/1/user/-/activities/steps/date/2026-07-26/1d.json";

/** A clock you control. sleep() advances it; nothing here waits on real time. */
function fakeClock(start = START) {
  let t = start;
  const slept = [];
  return {
    now: () => t,
    sleep: async (ms) => {
      slept.push(ms);
      t += ms;
    },
    advance: (ms) => {
      t += ms;
    },
    slept,
    elapsed: () => t - start,
  };
}

function response(status, headers = {}) {
  return { status, ok: status >= 200 && status < 300, headers, json: async () => ({}) };
}

/** Scripted fetch: one entry per call, last entry repeats. Counts calls. */
function scriptedFetch(script) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url: String(url), init });
    const step = script[Math.min(calls.length - 1, script.length - 1)];
    if (typeof step === "function") return step(url, init);
    if (step instanceof Error) throw step;
    return step;
  };
  impl.calls = calls;
  return impl;
}

test("429 with Retry-After in seconds waits exactly that long, then retries", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(429, { "retry-after": "120" }), response(200)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    budget: { limit: 10, windowMs: 3_600_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A);

  assert.equal(result.outcome, "ok");
  assert.equal(result.attempts, 2);
  assert.deepEqual(clock.slept, [120_000], "waited the server's number, not a default");
  assert.equal(clock.elapsed(), 120_000, "not one millisecond less");
  assert.equal(result.waitedMs, 120_000);
  assert.equal(fetchImpl.calls.length, 2);
});

test("429 with an HTTP-date Retry-After is parsed, not ignored", async () => {
  const clock = fakeClock();
  const httpDate = new Date(START + 45_000).toUTCString();
  const fetchImpl = scriptedFetch([response(429, { "Retry-After": httpDate }), response(200)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    budget: { limit: 10, windowMs: 3_600_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A);

  assert.equal(result.outcome, "ok");
  assert.deepEqual(clock.slept, [45_000], "a parser that only calls parseInt fails this");
});

test("429 with NO Retry-After falls back to jittered backoff instead of busy-looping", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(429), response(429), response(200)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    random: () => 1, // pin jitter to its ceiling so the bound is exact
    baseDelayMs: 500,
    maxDelayMs: 60_000,
    budget: { limit: 10, windowMs: 3_600_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A);

  assert.equal(result.outcome, "ok");
  assert.deepEqual(clock.slept, [500, 1000], "exponential, and never zero-delay hot-looping");
  assert.equal(fetchImpl.calls.length, 3);
});

test("a 429 storm past the retry budget parks the window instead of spinning", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(429, { "retry-after": "60" })]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    maxAttempts: 3,
    budget: { limit: 50, windowMs: 3_600_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A);

  assert.equal(result.outcome, "rate-limited");
  assert.equal(result.attempts, 3, "bounded retry, not an infinite loop");
  assert.equal(result.retryAtMs, clock.now() + 60_000, "the caller knows when to re-park");
  assert.equal(client.gaps.at(-1).reason, "rate-limited");
  assert.equal(client.breakerState(URL_A).failures, 0, "a 429 is a healthy answer — it must not trip the breaker");
});

test("the per-user budget isolates users: A exhausted, B unaffected", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(200)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    budget: { limit: 2, windowMs: 3_600_000 },
  });

  assert.equal((await client.fetchForUser("user-a", URL_A)).outcome, "ok");
  assert.equal((await client.fetchForUser("user-a", URL_A)).outcome, "ok");

  const blocked = await client.fetchForUser("user-a", URL_A);
  assert.equal(blocked.outcome, "skipped");
  assert.equal(blocked.reason, "budget-exhausted");
  assert.equal(fetchImpl.calls.length, 2, "the third call is never made");
  assert.equal(blocked.retryAtMs, START + 3_600_000);

  const other = await client.fetchForUser("user-b", URL_A);
  assert.equal(other.outcome, "ok", "user B has their own bucket");
  assert.equal(fetchImpl.calls.length, 3);
  assert.equal(client.budgetFor("user-b").remaining, 1);
  assert.equal(client.gaps.filter((g) => g.reason === "budget-exhausted").length, 1);
});

test("the budget resets when its window rolls over", async () => {
  const clock = fakeClock();
  const client = createRateLimitedFetcher({
    fetch: scriptedFetch([response(200)]),
    now: clock.now,
    sleep: clock.sleep,
    budget: { limit: 1, windowMs: 3_600_000 },
  });

  await client.fetchForUser("user-a", URL_A);
  assert.equal((await client.fetchForUser("user-a", URL_A)).reason, "budget-exhausted");
  clock.advance(3_600_001);
  assert.equal((await client.fetchForUser("user-a", URL_A)).outcome, "ok");
});

test("the budget re-syncs from the provider's own rate-limit headers", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([
    response(200, { "fitbit-rate-limit-limit": "150", "fitbit-rate-limit-remaining": "0", "fitbit-rate-limit-reset": "1893" }),
    response(200),
  ]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    budget: { limit: 150, windowMs: 3_600_000 },
  });

  await client.fetchForUser("user-a", URL_A);
  assert.equal(client.budgetFor("user-a").remaining, 0, "believe the server, not the local counter");

  const blocked = await client.fetchForUser("user-a", URL_A);
  assert.equal(blocked.reason, "budget-exhausted");
  assert.equal(blocked.retryAtMs, START + 1_893_000, "reset comes off the header too");
  assert.equal(fetchImpl.calls.length, 1);
});

test("5xx backs off with full jitter, and every delay stays inside its bound", async () => {
  const clock = fakeClock();
  const draws = [0, 0.5, 0.999];
  let i = 0;
  const fetchImpl = scriptedFetch([response(503), response(503), response(503), response(200)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    random: () => draws[i++ % draws.length],
    baseDelayMs: 1000,
    maxDelayMs: 4000,
    maxAttempts: 5,
    breaker: { threshold: 99, cooldownMs: 60_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A);

  assert.equal(result.outcome, "ok");
  assert.equal(clock.slept.length, 3);
  const caps = [1000, 2000, 4000]; // base * 2^n, clamped at maxDelayMs
  clock.slept.forEach((delay, n) => {
    assert.ok(delay >= 0 && delay <= caps[n], `delay ${delay} outside [0, ${caps[n]}]`);
  });
  assert.equal(clock.slept[0], 0, "full jitter can legitimately draw zero");
  assert.ok(clock.slept[2] > 0, "and can legitimately draw near the cap");
});

test("fullJitterDelay is uniform in [0, min(cap, base*2^n)]", () => {
  const opts = { baseDelayMs: 500, maxDelayMs: 8000 };
  assert.equal(fullJitterDelay(1, { ...opts, random: () => 0 }), 0);
  assert.equal(fullJitterDelay(1, { ...opts, random: () => 0.999999 }), 499);
  assert.equal(fullJitterDelay(4, { ...opts, random: () => 0.999999 }), 3999);
  assert.equal(fullJitterDelay(9, { ...opts, random: () => 0.999999 }), 7999, "clamped at maxDelayMs");
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const cap = Math.min(8000, 500 * 2 ** (attempt - 1));
    for (let n = 0; n < 200; n += 1) {
      const d = fullJitterDelay(attempt, opts);
      assert.ok(d >= 0 && d <= cap, `attempt ${attempt} produced ${d}`);
    }
  }
});

test("the breaker opens after N consecutive failures and records the gap instead of calling", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(500)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    maxAttempts: 1, // one attempt per call, so failures are easy to count
    breaker: { threshold: 3, cooldownMs: 60_000 },
    budget: { limit: 100, windowMs: 3_600_000 },
  });

  for (let n = 0; n < 3; n += 1) {
    const r = await client.fetchForUser("user-a", URL_A);
    assert.equal(r.outcome, "failed");
  }
  assert.equal(fetchImpl.calls.length, 3);

  const degraded = await client.fetchForUser("user-a", URL_A);
  assert.equal(degraded.outcome, "skipped");
  assert.equal(degraded.reason, "circuit-open");
  assert.equal(degraded.retryAtMs, START + 60_000);
  assert.equal(fetchImpl.calls.length, 3, "the breaker skips — it does not hammer a provider that is down");

  const gap = client.gaps.at(-1);
  assert.equal(gap.reason, "circuit-open");
  assert.equal(gap.userId, "user-a");
  assert.equal(gap.url, URL_A);
  assert.equal(client.gaps.length, 4, "three failures and one skip, all recorded for the sweep");
});

test("the breaker half-opens after the cooldown and closes on a successful probe", async () => {
  const clock = fakeClock();
  let status = 500;
  const fetchImpl = scriptedFetch([() => response(status)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    maxAttempts: 1,
    breaker: { threshold: 2, cooldownMs: 30_000 },
    budget: { limit: 100, windowMs: 3_600_000 },
  });

  await client.fetchForUser("user-a", URL_A);
  await client.fetchForUser("user-a", URL_A);
  assert.equal((await client.fetchForUser("user-a", URL_A)).reason, "circuit-open");

  clock.advance(30_001);
  status = 200;
  const probe = await client.fetchForUser("user-a", URL_A);
  assert.equal(probe.outcome, "ok", "one probe is allowed through after the cooldown");
  assert.equal(client.breakerState(URL_A).openUntil, 0, "a good probe closes the circuit");
  assert.equal((await client.fetchForUser("user-a", URL_A)).outcome, "ok");
});

test("a breaker is per origin — one dead provider does not stop the others", async () => {
  const clock = fakeClock();
  const other = "https://api.second.test/v1/sleep";
  const fetchImpl = scriptedFetch([(url) => (String(url) === URL_A ? response(500) : response(200))]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    maxAttempts: 1,
    breaker: { threshold: 2, cooldownMs: 60_000 },
    budget: { limit: 100, windowMs: 3_600_000 },
  });

  await client.fetchForUser("user-a", URL_A);
  await client.fetchForUser("user-a", URL_A);
  assert.equal((await client.fetchForUser("user-a", URL_A)).reason, "circuit-open");
  assert.equal((await client.fetchForUser("user-a", other)).outcome, "ok");
});

test("a non-idempotent call is never retried on an ambiguous transport failure", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([new Error("ECONNRESET")]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    maxAttempts: 5,
    budget: { limit: 100, windowMs: 3_600_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A, { method: "POST", body: "{}" });

  assert.equal(result.outcome, "ambiguous");
  assert.equal(result.ambiguous, true);
  assert.equal(result.attempts, 1);
  assert.equal(fetchImpl.calls.length, 1, "we cannot know whether the write landed, so we do not repeat it");
  assert.equal(clock.slept.length, 0);
  assert.equal(client.gaps.at(-1).reason, "ambiguous-transport-error");
});

test("a non-idempotent call is never retried on a 5xx either", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(502)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    maxAttempts: 5,
    budget: { limit: 100, windowMs: 3_600_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A, { method: "PATCH" });

  assert.equal(result.outcome, "ambiguous");
  assert.equal(result.attempts, 1);
  assert.equal(fetchImpl.calls.length, 1);
});

test("an idempotent transport failure IS retried, and gives up in finite time", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([new Error("ECONNRESET")]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    random: () => 0,
    maxAttempts: 3,
    breaker: { threshold: 99, cooldownMs: 60_000 },
    budget: { limit: 100, windowMs: 3_600_000 },
  });

  const result = await client.fetchForUser("user-a", URL_A); // GET
  assert.equal(result.outcome, "failed");
  assert.equal(result.attempts, 3);
  assert.equal(fetchImpl.calls.length, 3);
  assert.equal(client.gaps.at(-1).reason, "transport-error");
});

test("4xx is final: a 404 is not retried and does not burn the retry budget", async () => {
  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(404)]);
  const client = createRateLimitedFetcher({ fetch: fetchImpl, now: clock.now, sleep: clock.sleep });

  const result = await client.fetchForUser("user-a", URL_A);
  assert.equal(result.outcome, "ok", "a response was received; interpreting it is the caller's job");
  assert.equal(result.status, 404);
  assert.equal(fetchImpl.calls.length, 1);
});

test("parseRetryAfter handles both RFC 9110 forms and refuses garbage", () => {
  assert.equal(parseRetryAfter("120", START), 120_000);
  assert.equal(parseRetryAfter("0", START), 0);
  assert.equal(parseRetryAfter(new Date(START + 30_000).toUTCString(), START), 30_000);
  assert.equal(parseRetryAfter(new Date(START - 30_000).toUTCString(), START), 0, "a past date clamps to zero");
  assert.equal(parseRetryAfter("soon", START), null);
  assert.equal(parseRetryAfter(null, START), null);
  assert.equal(parseRetryAfter(undefined, START), null);
});

test("method idempotency defaults are explicit and overridable", async () => {
  assert.equal(IDEMPOTENT_METHODS.has("GET"), true);
  assert.equal(IDEMPOTENT_METHODS.has("POST"), false);

  const clock = fakeClock();
  const fetchImpl = scriptedFetch([response(503), response(200)]);
  const client = createRateLimitedFetcher({
    fetch: fetchImpl,
    now: clock.now,
    sleep: clock.sleep,
    random: () => 0,
    maxAttempts: 3,
    breaker: { threshold: 99, cooldownMs: 60_000 },
  });

  // A POST the provider documents as idempotent can opt in explicitly.
  const result = await client.fetchForUser("user-a", URL_A, { method: "POST", idempotent: true });
  assert.equal(result.outcome, "ok");
  assert.equal(fetchImpl.calls.length, 2);
});
