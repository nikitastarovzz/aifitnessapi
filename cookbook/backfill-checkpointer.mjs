/**
 * backfill-checkpointer.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   A resumable historical-backfill walker. Newest-first civil-date windows
 *   over a date range, widening as they go back; a checkpoint written to an
 *   injectable store AFTER each window commits; 429 and 5xx handled by
 *   retrying the SAME window with exponential backoff (honouring Retry-After)
 *   rather than skipping it; a degrade path that records `{ window, reason }`
 *   when the retry budget is exhausted instead of silently advancing; and a
 *   resume that re-does at most the one window that was in flight.
 *
 *   A permission wall is a distinct terminal state, not a retryable failure —
 *   collapsing the two is how you hammer a wall on a backoff schedule forever.
 *   Anything unrecognised is fatal and rethrown, because an unexpected bug
 *   should crash loudly, not be laundered into a gap.
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/architecture/historical-backfill
 *   https://aifitnessapi.com/test/rate-limits-and-outages
 *   https://aifitnessapi.com/cookbook/backfill-checkpointer
 *
 * Node 20+. Zero runtime dependencies. The clock, the sleeper, the jitter
 * source, the checkpoint store and the fetcher are all injected, so the whole
 * thing runs in microseconds with no network and no real waiting.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

const MS_PER_DAY = 86_400_000;

/** Why a window ended up as a gap. Each implies a different next action. */
export const GAP_REASON = Object.freeze({
  RETRY_EXHAUSTED: "retry_exhausted",
  BLOCKED_BY_PERMISSION: "blocked_by_permission",
  BLOCKED_BY_PROVIDER_CAP: "blocked_by_provider_cap",
});

// ---------------------------------------------------------------------------
// Window planning — civil dates, newest first, widening backwards
// ---------------------------------------------------------------------------

function parseCivilDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new TypeError(`not a YYYY-MM-DD civil date: ${s}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function formatCivilDate(ms) {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate(),
  ).padStart(2, "0")}`;
}

/**
 * Plan the windows for a backfill, newest first.
 *
 * `lookbackLadder` is a list of cumulative lookbacks in days: the default
 * [7, 30, 90] produces "the last 7 days", then "the 23 days before that", then
 * "the 60 days before that", after which windows are `thenEveryDays` long all
 * the way back to `from`.
 *
 * Recent windows are small so the first useful screen lands fast; old windows
 * are large because nobody is waiting on them and a bigger window costs fewer
 * round trips per day of history. Bounds are civil dates, inclusive, never
 * instants — a chunk is "the user's March".
 *
 * @param {{from: string, to: string, lookbackLadder?: number[], thenEveryDays?: number}} opts
 * @returns {Array<{id: string, start: string, end: string, days: number, priority: number}>}
 */
export function planWindows({ from, to, lookbackLadder = [7, 30, 90], thenEveryDays = 365 }) {
  const fromMs = parseCivilDate(from);
  const toMs = parseCivilDate(to);
  if (fromMs > toMs) throw new RangeError("`from` must not be after `to`");

  const windows = [];
  let cursorEnd = toMs; // inclusive end of the next (older) window
  let consumed = 0; // days already planned, counting back from `to`

  for (const lookback of lookbackLadder) {
    if (cursorEnd < fromMs) break;
    const size = lookback - consumed;
    if (size <= 0) continue;
    const start = Math.max(fromMs, cursorEnd - (size - 1) * MS_PER_DAY);
    windows.push({ start, end: cursorEnd });
    consumed = lookback;
    cursorEnd = start - MS_PER_DAY;
  }
  while (cursorEnd >= fromMs) {
    const start = Math.max(fromMs, cursorEnd - (thenEveryDays - 1) * MS_PER_DAY);
    windows.push({ start, end: cursorEnd });
    cursorEnd = start - MS_PER_DAY;
  }

  return windows.map((w, i) => ({
    id: `${formatCivilDate(w.start)}..${formatCivilDate(w.end)}`,
    start: formatCivilDate(w.start),
    end: formatCivilDate(w.end),
    days: Math.round((w.end - w.start) / MS_PER_DAY) + 1,
    priority: i, // lower runs first, and index 0 is the most recent window
  }));
}

// ---------------------------------------------------------------------------
// Failure classification
// ---------------------------------------------------------------------------

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const PERMISSION_STATUS = new Set([401, 403]);

export function isRetryableStatus(status) {
  return RETRYABLE_STATUS.has(status);
}

/**
 * `retry` | `permission` | `provider_cap` | `fatal`.
 *
 * An error is retryable if it says so or carries a retryable status. It is a
 * wall if it says so or carries 401/403. Everything else is a bug in your own
 * code and is rethrown — never turned into a gap, because a gap is a claim
 * about the provider.
 */
export function classifyFailure(err) {
  if (err && err.permanent === true) return err.reason ?? "permission";
  if (err && err.retryable === true) return "retry";
  const status = err && err.status;
  if (isRetryableStatus(status)) return "retry";
  if (PERMISSION_STATUS.has(status)) return "permission";
  return "fatal";
}

/** Retry-After in milliseconds, if the error carries one. RFC 6585 makes it a MAY. */
export function retryAfterMs(err) {
  if (!err) return null;
  if (Number.isFinite(err.retryAfterMs)) return err.retryAfterMs;
  if (Number.isFinite(err.retryAfterSeconds)) return err.retryAfterSeconds * 1000;
  return null;
}

/**
 * Exponential backoff with full jitter. `random` is injected so a test gets a
 * deterministic schedule; jitter is not optional in production, because fixed
 * backoff passes every single-user test and then synchronises every worker
 * onto the same second the moment the provider recovers.
 */
export function exponentialBackoff({
  baseMs = 1000,
  factor = 2,
  maxMs = 60_000,
  jitter = 1,
  random = Math.random,
} = {}) {
  return function delayFor(attempt, err) {
    const ceiling = Math.min(maxMs, baseMs * factor ** Math.max(0, attempt - 1));
    const jittered = ceiling * (1 - jitter) + ceiling * jitter * random();
    // Retry-After is a floor, not a suggestion. Never sleep less than it.
    return Math.max(jittered, retryAfterMs(err) ?? 0);
  };
}

// ---------------------------------------------------------------------------
// Checkpoint store
// ---------------------------------------------------------------------------

/**
 * The shape a checkpoint store must implement. Swap for a row in Postgres,
 * a KV entry, anything durable — the walker only calls load() and save().
 */
export function createMemoryCheckpointStore(seed = {}) {
  const data = new Map(Object.entries(seed));
  let saves = 0;
  return {
    get saveCount() {
      return saves;
    },
    async load(jobId) {
      const v = data.get(jobId);
      return v ? structuredClone(v) : null;
    },
    async save(jobId, state) {
      saves += 1;
      data.set(jobId, structuredClone(state));
    },
  };
}

function emptyCheckpoint() {
  return { completed: [], gaps: [] };
}

// ---------------------------------------------------------------------------
// The walker
// ---------------------------------------------------------------------------

const realSleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Walk the windows newest-first, committing and checkpointing as it goes.
 *
 * Ordering inside one window is load-bearing:
 *   fetch -> commit -> checkpoint.
 * The checkpoint is written last, so a crash anywhere in that sequence costs
 * you a re-run of that one window and nothing else. `commit` must therefore be
 * idempotent on the provider's own record identity; at-least-once is the only
 * delivery a resumable job can offer.
 *
 * @param {object} opts
 * @param {string}   opts.jobId
 * @param {Array}    opts.windows        from planWindows()
 * @param {Function} opts.fetchWindow    async (window) => records
 * @param {Function} [opts.commit]       async (window, records) => void; must be idempotent
 * @param {object}   opts.store          { load(jobId), save(jobId, state) }
 * @param {number}   [opts.maxAttempts=4]  attempts per window, including the first
 * @param {Function} [opts.backoff]      (attempt, err) => ms
 * @param {Function} [opts.sleep]        async (ms) => void
 * @param {Function} [opts.now]          () => epoch ms
 * @param {Function} [opts.onEvent]      (event) => void, for logging and tests
 */
export async function runBackfill({
  jobId,
  windows,
  fetchWindow,
  commit = async () => {},
  store,
  maxAttempts = 4,
  backoff = exponentialBackoff(),
  sleep = realSleep,
  now = Date.now,
  onEvent = () => {},
}) {
  if (!jobId) throw new TypeError("jobId is required");
  if (!store || typeof store.load !== "function" || typeof store.save !== "function") {
    throw new TypeError("store must implement load(jobId) and save(jobId, state)");
  }

  const checkpoint = (await store.load(jobId)) ?? emptyCheckpoint();
  const completed = new Set(checkpoint.completed);
  const gaps = checkpoint.gaps.slice();
  const gapped = new Set(gaps.map((g) => g.window));

  const fetched = [];
  let slept = 0;
  let redone = 0;

  for (const window of windows) {
    if (completed.has(window.id)) {
      onEvent({ type: "skip", window: window.id, reason: "already_committed" });
      continue;
    }
    if (gapped.has(window.id)) {
      onEvent({ type: "skip", window: window.id, reason: "already_gapped" });
      continue;
    }

    let attempt = 0;
    let outcome = null;

    // Retry loop. Every path out of it is terminal for this window: either it
    // commits, or it becomes a recorded gap, or it throws.
    for (;;) {
      attempt += 1;
      let records;
      try {
        fetched.push(window.id);
        records = await fetchWindow(window, { attempt });
      } catch (err) {
        const kind = classifyFailure(err);

        if (kind === "retry") {
          if (attempt >= maxAttempts) {
            // Never silently advance. Record what we could not read and why.
            outcome = {
              window: window.id,
              start: window.start,
              end: window.end,
              reason: GAP_REASON.RETRY_EXHAUSTED,
              attempts: attempt,
              lastError: String((err && err.message) || err),
              at: now(),
            };
            onEvent({ type: "gap", ...outcome });
            break;
          }
          const delay = backoff(attempt, err);
          slept += delay;
          onEvent({ type: "retry", window: window.id, attempt, delay });
          await sleep(delay);
          continue; // the SAME window, not the next one
        }

        if (kind === "permission" || kind === "provider_cap") {
          // A wall, not a failure. Retrying it on a backoff schedule forever is
          // the bug this branch exists to prevent.
          outcome = {
            window: window.id,
            start: window.start,
            end: window.end,
            reason:
              kind === "permission"
                ? GAP_REASON.BLOCKED_BY_PERMISSION
                : GAP_REASON.BLOCKED_BY_PROVIDER_CAP,
            attempts: attempt,
            lastError: String((err && err.message) || err),
            at: now(),
          };
          onEvent({ type: "gap", ...outcome });
          break;
        }

        // Unclassified: a bug on our side. Crash with the checkpoint intact.
        onEvent({ type: "fatal", window: window.id, attempt });
        throw err;
      }

      await commit(window, records);
      if (attempt > 1) redone += 1;
      completed.add(window.id);
      onEvent({ type: "commit", window: window.id, attempts: attempt, records: records?.length ?? 0 });
      outcome = null;
      break;
    }

    if (outcome) {
      gaps.push(outcome);
      gapped.add(window.id);
    }

    // Checkpoint AFTER the window is terminal, never before.
    await store.save(jobId, { completed: [...completed], gaps });
  }

  return {
    jobId,
    committed: [...completed],
    gaps,
    fetchedWindows: fetched,
    requestCount: fetched.length,
    retriedWithinWindow: redone,
    sleptMs: slept,
  };
}

/**
 * Invariant 1 from /test/rate-limits-and-outages: every window in the requested
 * range ends in a terminal state, and none silently disappeared.
 */
export function coverageReport(windows, result) {
  const done = new Set(result.committed);
  const gapped = new Set(result.gaps.map((g) => g.window));
  const missing = windows.filter((w) => !done.has(w.id) && !gapped.has(w.id)).map((w) => w.id);
  const daysCovered = windows.filter((w) => done.has(w.id)).reduce((n, w) => n + w.days, 0);
  const daysGapped = windows.filter((w) => gapped.has(w.id)).reduce((n, w) => n + w.days, 0);
  return {
    total: windows.length,
    done: windows.filter((w) => done.has(w.id)).length,
    gapped: windows.filter((w) => gapped.has(w.id)).length,
    missing,
    complete: missing.length === 0,
    daysCovered,
    daysGapped,
  };
}
