/**
 * backfill-checkpointer.test.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   The test contract for backfill-checkpointer.mjs. A crash mid-run resumes
 *   from the checkpoint without re-fetching a committed window. A 429 retries
 *   the SAME window rather than skipping it. Exhausted retries record a gap and
 *   the walk continues. A permission wall is recorded once and never retried.
 *   And a completed run's gap list is exact, with every window in the requested
 *   range in a terminal state.
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/architecture/historical-backfill
 *   https://aifitnessapi.com/test/rate-limits-and-outages
 *   https://aifitnessapi.com/cookbook/backfill-checkpointer
 *
 * No network and no real waiting: the fetcher, the sleeper, the clock and the
 * checkpoint store are all injected. Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  GAP_REASON,
  classifyFailure,
  coverageReport,
  createMemoryCheckpointStore,
  exponentialBackoff,
  isRetryableStatus,
  planWindows,
  runBackfill,
} from "./backfill-checkpointer.mjs";

const JOB = "user-4821:fitbit:steps";

/** Deterministic backoff: 100ms, 200ms, 400ms. No real timers anywhere. */
function harness() {
  const sleeps = [];
  return {
    sleeps,
    sleep: async (ms) => {
      sleeps.push(ms);
    },
    backoff: exponentialBackoff({ baseMs: 100, factor: 2, jitter: 0 }),
    now: () => 1_760_000_000_000,
  };
}

/** A commit sink that is idempotent on provider record identity. */
function createSink() {
  const rows = new Map();
  const commits = [];
  return {
    rows,
    commits,
    async commit(window, records) {
      commits.push(window.id);
      for (const r of records) rows.set(`${r.provider}:${r.id}`, r);
    },
  };
}

/** Records a provider would return for one window. */
function recordsFor(window) {
  return [
    { provider: "fake", id: `${window.id}#a`, value: 1 },
    { provider: "fake", id: `${window.id}#b`, value: 2 },
  ];
}

function providerError(status, extra = {}) {
  return Object.assign(new Error(`provider responded ${status}`), { status, ...extra });
}

const SHORT_RANGE = { from: "2026-06-15", to: "2026-08-12", lookbackLadder: [7], thenEveryDays: 21 };

// ---------------------------------------------------------------------------
// Planning
// ---------------------------------------------------------------------------

test("windows are civil dates, newest first, widening backwards, covering the range once", () => {
  const windows = planWindows({ from: "2024-01-01", to: "2026-08-12" });

  assert.equal(windows[0].id, "2026-08-06..2026-08-12");
  assert.equal(windows[0].days, 7, "the last 7 days first, so the app is useful in seconds");
  assert.equal(windows[1].days, 23, "then the rest of the last 30");
  assert.equal(windows[2].days, 60, "then the rest of the last 90");
  assert.equal(windows[3].days, 365, "then a year at a time, going backwards");

  // Newest first, contiguous, no overlap, exact coverage down to `from`.
  for (let i = 1; i < windows.length; i++) {
    assert.ok(windows[i].end < windows[i - 1].start, "strictly older, no overlap");
    const gapDays =
      (Date.parse(`${windows[i - 1].start}T00:00:00Z`) - Date.parse(`${windows[i].end}T00:00:00Z`)) /
      86_400_000;
    assert.equal(gapDays, 1, "contiguous");
  }
  assert.equal(windows.at(-1).start, "2024-01-01");
  assert.deepEqual(
    windows.map((w) => w.priority),
    windows.map((_, i) => i),
  );

  const totalDays = windows.reduce((n, w) => n + w.days, 0);
  const rangeDays =
    (Date.parse("2026-08-12T00:00:00Z") - Date.parse("2024-01-01T00:00:00Z")) / 86_400_000 + 1;
  assert.equal(totalDays, rangeDays, "every day planned exactly once");
});

test("failure classification separates retry, wall and bug", () => {
  assert.equal(classifyFailure(providerError(429)), "retry");
  assert.equal(classifyFailure(providerError(503)), "retry");
  assert.equal(classifyFailure(providerError(504)), "retry");
  assert.equal(classifyFailure(providerError(403)), "permission");
  assert.equal(classifyFailure(providerError(401)), "permission");
  assert.equal(classifyFailure(Object.assign(new Error("cap"), { permanent: true, reason: "provider_cap" })), "provider_cap");
  assert.equal(classifyFailure(new TypeError("undefined is not a function")), "fatal");
  assert.ok(isRetryableStatus(429) && !isRetryableStatus(404));

  // Retry-After is a floor, never a ceiling.
  const b = exponentialBackoff({ baseMs: 100, factor: 2, jitter: 0 });
  assert.equal(b(1, providerError(429)), 100);
  assert.equal(b(1, providerError(429, { retryAfterSeconds: 5 })), 5000);
  assert.equal(b(4, providerError(429, { retryAfterMs: 50 })), 800, "our backoff already exceeds it");
});

// ---------------------------------------------------------------------------
// Retry and degrade
// ---------------------------------------------------------------------------

test("a 429 retries the SAME window rather than skipping it", async () => {
  const h = harness();
  const windows = planWindows(SHORT_RANGE);
  const sink = createSink();
  const store = createMemoryCheckpointStore();

  let failures = 2;
  const result = await runBackfill({
    jobId: JOB,
    windows,
    store,
    commit: sink.commit,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    maxAttempts: 4,
    async fetchWindow(window) {
      if (window.id === windows[0].id && failures-- > 0) {
        throw providerError(429, { retryAfterSeconds: 0 });
      }
      return recordsFor(window);
    },
  });

  assert.deepEqual(
    result.fetchedWindows.slice(0, 4),
    [windows[0].id, windows[0].id, windows[0].id, windows[1].id],
    "three attempts at window 0, then window 1 — never window 1 in place of window 0",
  );
  assert.deepEqual(h.sleeps, [100, 200], "exponential, and it slept between the retries");
  assert.equal(result.gaps.length, 0);
  assert.equal(result.committed.length, windows.length);
  assert.equal(coverageReport(windows, result).complete, true);
});

test("exhausted retries record a gap and the walk continues", async () => {
  const h = harness();
  const windows = planWindows(SHORT_RANGE);
  const sink = createSink();
  const store = createMemoryCheckpointStore();

  const result = await runBackfill({
    jobId: JOB,
    windows,
    store,
    commit: sink.commit,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    maxAttempts: 3,
    async fetchWindow(window) {
      if (window.id === windows[1].id) throw providerError(503);
      return recordsFor(window);
    },
  });

  assert.equal(result.gaps.length, 1);
  assert.deepEqual(
    { ...result.gaps[0], lastError: undefined, at: undefined },
    {
      window: windows[1].id,
      start: windows[1].start,
      end: windows[1].end,
      reason: GAP_REASON.RETRY_EXHAUSTED,
      attempts: 3,
      lastError: undefined,
      at: undefined,
    },
  );
  assert.equal(result.fetchedWindows.filter((id) => id === windows[1].id).length, 3);
  assert.ok(!result.committed.includes(windows[1].id), "a gap is not a done window");
  assert.ok(result.committed.includes(windows[2].id), "and the walk carried on past it");

  // Terminal, but honestly incomplete: the gap's days are counted separately.
  const cov = coverageReport(windows, result);
  assert.equal(cov.complete, true, "nothing vanished");
  assert.equal(cov.gapped, 1);
  assert.equal(cov.daysGapped, windows[1].days);
  assert.equal(cov.daysCovered + cov.daysGapped, windows.reduce((n, w) => n + w.days, 0));
});

test("a permission wall is recorded once and never retried", async () => {
  const h = harness();
  const windows = planWindows(SHORT_RANGE);
  const store = createMemoryCheckpointStore();
  const walled = windows.at(-1); // the oldest window, past the 30-day history wall

  const result = await runBackfill({
    jobId: JOB,
    windows,
    store,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    async fetchWindow(window) {
      if (window.id === walled.id) throw providerError(403, { message: "history permission" });
      return recordsFor(window);
    },
  });

  assert.equal(result.fetchedWindows.filter((id) => id === walled.id).length, 1, "asked once");
  assert.deepEqual(h.sleeps, [], "and did not back off against a wall");
  assert.equal(result.gaps[0].reason, GAP_REASON.BLOCKED_BY_PERMISSION);

  // A resumed run does not re-ask either.
  const second = await runBackfill({
    jobId: JOB,
    windows,
    store,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    async fetchWindow() {
      throw new Error("should not fetch anything on resume");
    },
  });
  assert.equal(second.requestCount, 0);
  assert.deepEqual(second.gaps.map((g) => g.window), [walled.id]);
});

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

test("a crash mid-run resumes from the checkpoint without re-fetching committed windows", async () => {
  const h = harness();
  const windows = planWindows(SHORT_RANGE);
  const sink = createSink();
  const store = createMemoryCheckpointStore();
  const crashOn = windows[2].id;

  await assert.rejects(
    runBackfill({
      jobId: JOB,
      windows,
      store,
      commit: sink.commit,
      sleep: h.sleep,
      backoff: h.backoff,
      now: h.now,
      async fetchWindow(window) {
        if (window.id === crashOn) throw new TypeError("pod OOM-killed mid-parse");
        return recordsFor(window);
      },
    }),
    /OOM-killed/,
    "an unclassified error crashes loudly instead of becoming a silent gap",
  );

  const saved = await store.load(JOB);
  assert.deepEqual(saved.completed, [windows[0].id, windows[1].id]);
  assert.deepEqual(saved.gaps, []);

  // Second run, fresh worker, same store.
  const resumed = await runBackfill({
    jobId: JOB,
    windows,
    store,
    commit: sink.commit,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    fetchWindow: async (window) => recordsFor(window),
  });

  assert.ok(
    !resumed.fetchedWindows.includes(windows[0].id) && !resumed.fetchedWindows.includes(windows[1].id),
    "zero requests for windows the first run had already committed",
  );
  assert.deepEqual(
    resumed.fetchedWindows,
    windows.slice(2).map((w) => w.id),
  );
  assert.equal(coverageReport(windows, resumed).complete, true);
  assert.equal(sink.rows.size, windows.length * 2, "every record landed exactly once");
});

test("a crash between commit and checkpoint re-does at most the in-flight window", async () => {
  const h = harness();
  const windows = planWindows(SHORT_RANGE);
  const sink = createSink();
  const inner = createMemoryCheckpointStore();

  // The nastiest ordering: the window committed, then the process died before
  // the checkpoint was durable. Resume must be safe, not merely likely to be.
  let saves = 0;
  const flakyStore = {
    load: (id) => inner.load(id),
    async save(id, state) {
      saves += 1;
      if (saves === 2) throw new Error("checkpoint write lost: pod terminated");
      return inner.save(id, state);
    },
  };

  const firstRunFetches = [];
  await assert.rejects(
    runBackfill({
      jobId: JOB,
      windows,
      store: flakyStore,
      commit: sink.commit,
      sleep: h.sleep,
      backoff: h.backoff,
      now: h.now,
      async fetchWindow(window) {
        firstRunFetches.push(window.id);
        return recordsFor(window);
      },
    }),
    /checkpoint write lost/,
  );

  assert.deepEqual((await inner.load(JOB)).completed, [windows[0].id], "only window 0 is durable");
  assert.deepEqual(sink.commits, [windows[0].id, windows[1].id], "but window 1 did commit");

  const secondRunFetches = [];
  const resumed = await runBackfill({
    jobId: JOB,
    windows,
    store: inner,
    commit: sink.commit,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    async fetchWindow(window) {
      secondRunFetches.push(window.id);
      return recordsFor(window);
    },
  });

  const redone = secondRunFetches.filter((id) => firstRunFetches.includes(id));
  assert.deepEqual(redone, [windows[1].id]);
  assert.equal(redone.length, 1, "at most the one window that was in flight");

  // Idempotent commit means the re-do is a no-op, not a doubling.
  assert.equal(sink.commits.filter((id) => id === windows[1].id).length, 2);
  assert.equal(sink.rows.size, windows.length * 2);
  assert.equal(coverageReport(windows, resumed).complete, true);
});

test("a completed run's gap list is exact", async () => {
  const h = harness();
  const windows = planWindows({ from: "2026-01-01", to: "2026-08-12", lookbackLadder: [7], thenEveryDays: 60 });
  const store = createMemoryCheckpointStore();
  const sink = createSink();

  const stormed = windows[1].id; // a 429 storm that outlasts the retry budget
  const walled = windows.at(-1).id; // older than the history permission allows

  const result = await runBackfill({
    jobId: JOB,
    windows,
    store,
    commit: sink.commit,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    maxAttempts: 2,
    async fetchWindow(window) {
      if (window.id === stormed) throw providerError(429);
      if (window.id === walled) throw providerError(403);
      return recordsFor(window);
    },
  });

  assert.deepEqual(
    result.gaps.map((g) => [g.window, g.reason, g.attempts]),
    [
      [stormed, GAP_REASON.RETRY_EXHAUSTED, 2],
      [walled, GAP_REASON.BLOCKED_BY_PERMISSION, 1],
    ],
  );
  assert.equal(result.gaps.length, 2, "exactly two — no invented gaps, no swallowed ones");

  const cov = coverageReport(windows, result);
  assert.deepEqual(cov.missing, [], "no window silently disappeared");
  assert.equal(cov.complete, true);
  assert.equal(cov.done + cov.gapped, windows.length);
  assert.equal(cov.daysGapped, windows[1].days + windows.at(-1).days);

  // The gap list survives a restart, and the restart re-fetches nothing.
  const persisted = await store.load(JOB);
  assert.deepEqual(
    persisted.gaps.map((g) => g.window),
    [stormed, walled],
  );
  const rerun = await runBackfill({
    jobId: JOB,
    windows,
    store,
    sleep: h.sleep,
    backoff: h.backoff,
    now: h.now,
    async fetchWindow() {
      throw new Error("nothing left to do");
    },
  });
  assert.equal(rerun.requestCount, 0);
});
