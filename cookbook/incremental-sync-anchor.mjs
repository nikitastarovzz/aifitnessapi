/**
 * incremental-sync-anchor.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   The bookkeeping around an opaque change cursor (a HealthKit query anchor,
 *   a Health Connect changes token, any provider's sync token) that the
 *   platform call itself does not do for you:
 *     1. The cursor is saved ONLY after the batch it covers has been durably
 *        applied. Per page: fetch, then apply (awaited), then save the
 *        cursor. A crash anywhere in that sequence replays at most one page.
 *     2. Applying is idempotent. Upserts are keyed on the platform's record id
 *        and gated on a version; a deletion leaves a tombstone that keeps the
 *        last version, so a replayed page, or the whole history after a lost
 *        cursor, changes nothing it has already changed.
 *     3. An expired or rejected cursor falls back to a bounded full re-read,
 *        deduped against what you hold by id, plus a set-difference that
 *        catches deletions made while the cursor was dead.
 *     4. What comes out is a list of civil days that are now wrong, never a
 *        running total to add to. A re-read of unchanged data dirties nothing.
 *     5. Anything unrecognised is rethrown with the cursor untouched.
 *
 * NATIVE APIs AN ADAPTER WRAPS (names checked against the vendors' docs)
 *   HealthKit: HKAnchoredObjectQuery, HKQueryAnchor, HKDeletedObject.
 *     https://developer.apple.com/documentation/healthkit/hkanchoredobjectquery
 *   Health Connect: getChangesToken, getChanges, and ChangesResponse's
 *   changes, hasMore, nextChangesToken and changesTokenExpired.
 *     https://developer.android.com/health-and-fitness/health-connect/sync-data
 *     https://developer.android.com/reference/kotlin/androidx/health/connect/client/response/ChangesResponse
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/architecture/incremental-sync
 *   https://aifitnessapi.com/cookbook/incremental-sync-anchor
 *
 * Node 20+. Zero runtime dependencies. The change source, both stores and the
 * clock are injected, so the suite runs with no device, no network and no
 * waiting.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

const MS_PER_DAY = 86_400_000;

/** On token expiry, Google's guide re-reads "for the last 30 days". */
const DEFAULT_RESYNC_LOOKBACK_MS = 30 * MS_PER_DAY;

export const SYNC_MODE = Object.freeze({
  /** No cursor yet. HealthKit: a nil anchor. Health Connect: no token. */
  INITIAL: "initial",
  /** Spent a stored cursor and saved the next one. */
  INCREMENTAL: "incremental",
  /** The stored cursor was expired or rejected; re-read and reconciled. */
  RESYNC: "resync",
});

export const RESYNC_REASON = Object.freeze({
  NO_CURSOR: "no_cursor",
  CURSOR_EXPIRED: "cursor_expired",
  CURSOR_INVALID: "cursor_invalid",
});

/**
 * Throw this from an adapter when a cursor is rejected outright: a stored
 * anchor that no longer unarchives, a sync token a server answers as invalid.
 * Health Connect reports expiry differently, as a flag on the response
 * (changesTokenExpired), which the adapter returns as `cursorExpired: true`.
 * Both routes lead to the same fallback.
 */
export class CursorInvalidError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "CursorInvalidError";
    this.cursorInvalid = true;
  }
}

export function isCursorRejected(err) {
  return Boolean(err && err.cursorInvalid === true);
}

// ---------------------------------------------------------------------------
// Idempotent apply
// ---------------------------------------------------------------------------

const CIVIL_DATE = /^\d{4}-\d{2}-\d{2}$/;

function assertRecord(r) {
  if (!r || typeof r.id !== "string" || r.id === "") {
    throw new TypeError("every record needs the platform's id; deletions are id-only and cannot be resolved without it");
  }
  if (!Number.isFinite(r.version)) throw new TypeError(`record ${r.id} needs a numeric version`);
  if (!Number.isFinite(r.start)) throw new TypeError(`record ${r.id} needs a start instant (epoch ms)`);
  if (typeof r.localDate !== "string" || !CIVIL_DATE.test(r.localDate)) {
    throw new TypeError(`record ${r.id} needs a civil localDate (YYYY-MM-DD) resolved where the offset is known`);
  }
}

/**
 * Apply one batch of changes in ONE store write. Safe to call twice with the
 * same batch: the second call changes nothing and dirties nothing.
 *
 * Changes are `{ type: "upsert", record }` or `{ type: "delete", id }`.
 * A record is `{ id, version, start, localDate, origin?, ...payload }`, where
 * `version` is whatever moves when the record changes (Health Connect's
 * metadata.lastModifiedTime as epoch ms; a constant for HealthKit, whose
 * objects are immutable) and `localDate` is the civil day it belongs to.
 *
 * @param {object} store  { read(id), writeBatch(rows) } — writeBatch is atomic
 * @param {Array} changes
 * @param {{ownOrigin?: string|null}} [opts]  skip upserts your own app wrote
 */
export async function applyChanges(store, changes, { ownOrigin = null } = {}) {
  const pending = new Map(); // id -> row, so a batch sees its own earlier changes
  const dirty = new Set();
  const counts = { upserted: 0, deleted: 0, unchanged: 0, ownWrites: 0, unknownDeletes: 0 };

  async function current(id) {
    return pending.has(id) ? pending.get(id) : await store.read(id);
  }

  for (const change of changes) {
    if (change.type === "upsert") {
      const r = change.record;
      assertRecord(r);
      if (ownOrigin !== null && r.origin === ownOrigin) {
        // Re-importing what you wrote turns write-then-read into a loop.
        counts.ownWrites += 1;
        continue;
      }
      const held = await current(r.id);
      if (held && held.version >= r.version) {
        // Already have this version (a replay) or a newer one (out of order),
        // and a tombstone keeps its version, so a replay cannot resurrect.
        counts.unchanged += 1;
        continue;
      }
      if (held && !held.deleted) dirty.add(held.localDate); // an edit can move a record between days
      dirty.add(r.localDate);
      pending.set(r.id, { id: r.id, version: r.version, start: r.start, localDate: r.localDate, deleted: false, record: r });
      counts.upserted += 1;
    } else if (change.type === "delete") {
      const held = await current(change.id);
      if (!held) {
        // Nothing to resolve the id against. Without an id index built at
        // ingest, this is where a deletion silently becomes unactionable.
        counts.unknownDeletes += 1;
        continue;
      }
      if (held.deleted) {
        counts.unchanged += 1;
        continue;
      }
      dirty.add(held.localDate);
      // Keep identity, version and day; drop the payload.
      pending.set(change.id, { ...held, deleted: true, record: null });
      counts.deleted += 1;
    } else {
      throw new TypeError(`unknown change type: ${change && change.type}`);
    }
  }

  if (pending.size > 0) await store.writeBatch([...pending.values()]);
  return { ...counts, dirtyDays: [...dirty].sort() };
}

// ---------------------------------------------------------------------------
// Full re-read helpers
// ---------------------------------------------------------------------------

/**
 * Where a fallback re-read starts. Google's most-ideal strategy is to
 * "re-read all data from the most recent timestamp or for the last 30 days"
 * and dedupe by identifier; this takes whichever reaches further back, so a
 * retro-edit inside the lookback is caught even when the last read was recent.
 */
export function resyncSince(state, nowMs, lookbackMs = DEFAULT_RESYNC_LOOKBACK_MS) {
  const floor = nowMs - lookbackMs;
  const last = state && state.lastReadAt;
  return Number.isFinite(last) ? Math.min(last, floor) : floor;
}

/**
 * Build a `fullRead` for a platform that issues cursors separately from reads
 * (Health Connect's getChangesToken). The cursor is taken FIRST: anything that
 * changes during the re-read is then replayed by the next incremental sync,
 * which the idempotent apply absorbs. Taken last, that change is lost.
 *
 * HealthKit does not need this: an anchored query run with a nil anchor hands
 * back its results and the anchor to continue from in the same handler call.
 */
export function cursorFirstFullRead({ getCursor, readSince }) {
  return async function fullRead({ since }) {
    const cursor = await getCursor();
    const records = await readSince({ since });
    return { cursor, records };
  };
}

// ---------------------------------------------------------------------------
// The sync run
// ---------------------------------------------------------------------------

/**
 * One sync for one cursor key, typically (user, provider, record type). Use
 * one cursor per record type: Health Connect deletions carry no type, and
 * Google recommends separate tokens per data type.
 *
 * @param {object} opts
 * @param {string} opts.key
 * @param {object} opts.source
 *   getChanges(cursor) -> { changes, nextCursor, hasMore?, cursorExpired? }
 *   fullRead({ since }) -> { cursor, records }   since is null on first sync
 * @param {object} opts.cursorStore   { load(key), save(key, state) }
 * @param {object} opts.recordStore   { read(id), writeBatch(rows), listLive({ since }) }
 * @param {string|null} [opts.ownOrigin]
 * @param {number} [opts.resyncLookbackMs]
 * @param {boolean} [opts.reconcileDeletions=true]  resync only; correct only
 *   when fullRead returns EVERY record in the window, under the same filter
 *   as the change feed
 * @param {number} [opts.maxPages=Infinity]  stop early (e.g. leaving the
 *   foreground); the saved cursor resumes exactly where this run stopped
 * @param {() => number} [opts.now]
 * @param {(event: object) => void} [opts.onEvent]
 */
export async function runSync({
  key,
  source,
  cursorStore,
  recordStore,
  ownOrigin = null,
  resyncLookbackMs = DEFAULT_RESYNC_LOOKBACK_MS,
  reconcileDeletions = true,
  maxPages = Infinity,
  now = Date.now,
  onEvent = () => {},
}) {
  if (!key) throw new TypeError("key is required");
  if (!cursorStore || typeof cursorStore.load !== "function" || typeof cursorStore.save !== "function") {
    throw new TypeError("cursorStore must implement load(key) and save(key, state)");
  }
  if (!recordStore || typeof recordStore.read !== "function" || typeof recordStore.writeBatch !== "function") {
    throw new TypeError("recordStore must implement read(id) and writeBatch(rows)");
  }

  const startedAt = now();
  const state = await cursorStore.load(key);
  const dirty = new Set();
  const totals = { upserted: 0, deleted: 0, unchanged: 0, ownWrites: 0, unknownDeletes: 0 };

  function absorb(result) {
    for (const k of Object.keys(totals)) totals[k] += result[k];
    for (const d of result.dirtyDays) dirty.add(d);
  }

  function summary(mode, extra) {
    return { key, mode, ...extra, ...totals, dirtyDays: [...dirty].sort() };
  }

  async function resync(reason) {
    const mode = reason === RESYNC_REASON.NO_CURSOR ? SYNC_MODE.INITIAL : SYNC_MODE.RESYNC;
    const since = mode === SYNC_MODE.INITIAL ? null : resyncSince(state, startedAt, resyncLookbackMs);
    onEvent({ type: "resync", key, reason, since });

    const { cursor, records } = await source.fullRead({ since });
    const changes = records.map((record) => ({ type: "upsert", record }));

    // Never on a first sync: if rows are already held (a reinstall, a lost
    // cursor store), an initial read that returns less may only mean the
    // platform's readable window moved, and absence there proves nothing.
    if (mode === SYNC_MODE.RESYNC && reconcileDeletions && typeof recordStore.listLive === "function") {
      // A deletion made while the cursor was dead never reaches the change
      // feed. Anything held in the window that the re-read did not return is
      // gone at the source.
      const returned = new Set(records.map((r) => r.id));
      for (const row of await recordStore.listLive({ since })) {
        if (!returned.has(row.id)) changes.push({ type: "delete", id: row.id });
      }
    }

    absorb(await applyChanges(recordStore, changes, { ownOrigin }));
    // Saved last, as always: the re-read is durable before the cursor moves.
    await cursorStore.save(key, { cursor, lastReadAt: startedAt, lastSyncedAt: now(), mode });
    return summary(mode, { reason, pages: 0, reread: records.length, hasMore: false, cursor });
  }

  if (!state || state.cursor === null || state.cursor === undefined) {
    return resync(RESYNC_REASON.NO_CURSOR);
  }

  let cursor = state.cursor;
  let pages = 0;
  for (;;) {
    let page;
    try {
      page = await source.getChanges(cursor);
    } catch (err) {
      if (isCursorRejected(err)) return resync(RESYNC_REASON.CURSOR_INVALID);
      // Not ours to interpret. The stored cursor is still the last good one.
      throw err;
    }
    // A flag, not a throw: a try/catch alone would read this as an empty sync.
    if (page.cursorExpired === true) return resync(RESYNC_REASON.CURSOR_EXPIRED);

    absorb(await applyChanges(recordStore, page.changes ?? [], { ownOrigin }));
    cursor = page.nextCursor;
    await cursorStore.save(key, {
      cursor,
      lastReadAt: startedAt,
      lastSyncedAt: now(),
      mode: SYNC_MODE.INCREMENTAL,
    });
    pages += 1;
    onEvent({ type: "page", key, pages });

    if (page.hasMore !== true) return summary(SYNC_MODE.INCREMENTAL, { pages, hasMore: false, cursor });
    if (pages >= maxPages) return summary(SYNC_MODE.INCREMENTAL, { pages, hasMore: true, cursor });
  }
}

// ---------------------------------------------------------------------------
// Reference stores
// ---------------------------------------------------------------------------

/**
 * Reference record store. In Postgres, writeBatch is one transaction of
 * upserts keyed on the platform id; listLive is the window query the
 * reconciliation diffs against. Tombstones must be purged with the user on
 * erasure, like everything else.
 */
export function createMemoryRecordStore() {
  const rows = new Map();
  let commits = 0;
  return {
    get commitCount() {
      return commits;
    },
    async read(id) {
      const row = rows.get(id);
      return row ? structuredClone(row) : null;
    },
    async writeBatch(batch) {
      for (const row of batch) rows.set(row.id, structuredClone(row));
      commits += 1;
    },
    async listLive({ since = null } = {}) {
      return [...rows.values()]
        .filter((r) => !r.deleted && (since === null || r.start >= since))
        .map((r) => structuredClone(r));
    },
    rows,
  };
}

/** Reference cursor store: one row per key, the whole state in one write. */
export function createMemoryCursorStore(seed = {}) {
  const data = new Map(Object.entries(seed));
  let saves = 0;
  return {
    get saveCount() {
      return saves;
    },
    async load(key) {
      const v = data.get(key);
      return v ? structuredClone(v) : null;
    },
    async save(key, state) {
      saves += 1;
      data.set(key, structuredClone(state));
    },
  };
}
