/**
 * incremental-sync-anchor.test.mjs
 *
 * WHAT THIS IMPLEMENTS
 *   The test contract for incremental-sync-anchor.mjs. The cursor is saved
 *   only after the page it covers is durably applied, so a crash on either
 *   side of that write replays at most one page, and the replay changes
 *   nothing. An expired token, which arrives as a flag rather than an
 *   exception, and a rejected cursor both fall back to a bounded re-read that
 *   is deduped by id and catches deletions made while the cursor was dead.
 *   An unrecognised error is rethrown with the cursor untouched. And the
 *   fallback takes its new cursor before re-reading, so a change made during
 *   the re-read is replayed instead of lost.
 *
 * WHICH aifitnessapi.com PAGES DOCUMENT THE PATTERN
 *   https://aifitnessapi.com/architecture/incremental-sync
 *   https://aifitnessapi.com/cookbook/incremental-sync-anchor
 *
 * The fake platform below is shaped like Health Connect's change log: tokens
 * are positions in it, pages are bounded, and an expired token is reported on
 * the response. No device, no network, no real clock. Run with
 * `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  CursorInvalidError,
  RESYNC_REASON,
  SYNC_MODE,
  applyChanges,
  createMemoryCursorStore,
  createMemoryRecordStore,
  cursorFirstFullRead,
  isCursorRejected,
  resyncSince,
  runSync,
} from "./incremental-sync-anchor.mjs";

const DAY = 86_400_000;
const KEY = "user-4821:health-connect:steps";
const NOW = Date.UTC(2026, 9, 2, 12, 0);
const OWN_APP = "com.example.ourapp";

/** A record as an adapter would hand it over: platform id, version, civil day. */
function rec(id, localDate, { version = 1, hour = 9, origin = "com.example.watch", value = 1000 } = {}) {
  const [y, m, d] = localDate.split("-").map(Number);
  return { id, version, start: Date.UTC(y, m - 1, d, hour), localDate, origin, value };
}

/**
 * A change log with Health Connect's shape: getChanges(token) returns one
 * bounded page after the token's position plus the next token, and an expired
 * token comes back as a flag on the response, not as a throw.
 */
function createFakePlatform({ pageSize = 2 } = {}) {
  const log = [];
  const live = new Map();
  const expired = new Set();
  const rejected = new Set();
  const calls = [];
  let duringRead = null;

  const getCursor = async () => {
    calls.push(["getCursor"]);
    return `tok:${log.length}`;
  };
  const readSince = async ({ since }) => {
    calls.push(["readSince", since]);
    const snapshot = [...live.values()]
      .filter((r) => since === null || r.start >= since)
      .map((r) => structuredClone(r));
    // Simulates a write landing after the read has passed it.
    if (duringRead) {
      const fn = duringRead;
      duringRead = null;
      await fn();
    }
    return snapshot;
  };

  return {
    calls,
    getCursor,
    readSince,
    upsert(record) {
      live.set(record.id, record);
      log.push({ type: "upsert", record: structuredClone(record) });
    },
    remove(id) {
      live.delete(id);
      log.push({ type: "delete", id });
    },
    expire(token) {
      expired.add(token);
    },
    reject(token) {
      rejected.add(token);
    },
    whileReading(fn) {
      duringRead = fn;
    },
    has(id) {
      return live.has(id);
    },
    source: {
      async getChanges(cursor) {
        calls.push(["getChanges", cursor]);
        if (rejected.has(cursor)) throw new CursorInvalidError(`cursor ${cursor} no longer decodes`);
        if (expired.has(cursor)) return { changes: [], nextCursor: cursor, hasMore: false, cursorExpired: true };
        const pos = Number(String(cursor).slice(4));
        const page = log.slice(pos, pos + pageSize).map((c) => structuredClone(c));
        const next = pos + page.length;
        return { changes: page, nextCursor: `tok:${next}`, hasMore: next < log.length, cursorExpired: false };
      },
      fullRead: cursorFirstFullRead({ getCursor, readSince }),
    },
  };
}

function stores(seedCursor) {
  return {
    cursorStore: createMemoryCursorStore(seedCursor ? { [KEY]: seedCursor } : {}),
    recordStore: createMemoryRecordStore(),
  };
}

function liveIds(recordStore) {
  return [...recordStore.rows.values()].filter((r) => !r.deleted).map((r) => r.id).sort();
}

// ---------------------------------------------------------------------------
// First sync and the ordering rule
// ---------------------------------------------------------------------------

test("first sync re-reads everything, takes the cursor first, and saves it after the apply", async () => {
  const platform = createFakePlatform();
  platform.upsert(rec("a", "2026-09-30"));
  platform.upsert(rec("b", "2026-10-01"));
  platform.upsert(rec("c", "2026-10-01", { hour: 14 }));
  const { cursorStore, recordStore } = stores();

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => NOW });

  assert.equal(result.mode, SYNC_MODE.INITIAL);
  assert.equal(result.reason, RESYNC_REASON.NO_CURSOR);
  assert.deepEqual(platform.calls, [["getCursor"], ["readSince", null]], "cursor before read; no lookback on a first sync");
  assert.deepEqual(liveIds(recordStore), ["a", "b", "c"]);
  assert.deepEqual(result.dirtyDays, ["2026-09-30", "2026-10-01"], "days to recompute, not values to add");
  const saved = await cursorStore.load(KEY);
  assert.equal(saved.cursor, "tok:3");
  assert.equal(saved.lastReadAt, NOW);
  assert.equal(saved.mode, SYNC_MODE.INITIAL);
});

test("a first sync with rows already held never reads their absence as deletion", async () => {
  // The cursor store was lost (or the app reinstalled), but the server still
  // holds history the platform's readable window no longer returns.
  const platform = createFakePlatform();
  platform.upsert(rec("recent", "2026-10-01"));
  const { cursorStore, recordStore } = stores();
  await applyChanges(recordStore, [{ type: "upsert", record: rec("old", "2026-03-14") }]);

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => NOW });

  assert.equal(result.mode, SYNC_MODE.INITIAL);
  assert.equal(result.deleted, 0);
  assert.deepEqual(liveIds(recordStore), ["old", "recent"]);
});

test("the cursor is saved only after each page is durably applied", async () => {
  const platform = createFakePlatform({ pageSize: 2 });
  for (const id of ["a", "b", "c"]) platform.upsert(rec(id, "2026-10-01"));
  const order = [];
  const inner = createMemoryRecordStore();
  const recordStore = {
    read: inner.read,
    listLive: inner.listLive,
    async writeBatch(batch) {
      order.push("apply:start");
      await new Promise((resolve) => setImmediate(resolve)); // the commit lands on a later tick
      await inner.writeBatch(batch);
      order.push("apply:committed");
    },
  };
  const innerCursor = createMemoryCursorStore({ [KEY]: { cursor: "tok:0", lastReadAt: NOW - DAY } });
  const cursorStore = {
    load: innerCursor.load,
    async save(key, state) {
      order.push(`cursor:${state.cursor}`);
      await innerCursor.save(key, state);
    },
  };

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => NOW });

  assert.deepEqual(order, [
    "apply:start",
    "apply:committed",
    "cursor:tok:2",
    "apply:start",
    "apply:committed",
    "cursor:tok:3",
  ]);
  assert.equal(result.mode, SYNC_MODE.INCREMENTAL);
  assert.equal(result.pages, 2);
  assert.equal(result.hasMore, false);
});

// ---------------------------------------------------------------------------
// Crashes on either side of the cursor write
// ---------------------------------------------------------------------------

test("a crash while applying leaves the old cursor, and the rerun applies the page exactly once", async () => {
  const platform = createFakePlatform();
  platform.upsert(rec("a", "2026-09-30"));
  platform.upsert(rec("b", "2026-10-01"));
  const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });

  let failNext = true;
  const flaky = {
    read: recordStore.read,
    listLive: recordStore.listLive,
    async writeBatch(batch) {
      if (failNext) {
        failNext = false;
        throw new Error("database connection reset");
      }
      return recordStore.writeBatch(batch);
    },
  };

  await assert.rejects(
    runSync({ key: KEY, source: platform.source, cursorStore, recordStore: flaky, now: () => NOW }),
    /connection reset/,
  );
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:0", "the cursor did not move past unapplied data");
  assert.equal(cursorStore.saveCount, 0);
  assert.equal(recordStore.rows.size, 0);

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore: flaky, now: () => NOW });
  assert.equal(result.upserted, 2);
  assert.deepEqual(liveIds(recordStore), ["a", "b"]);
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:2");
});

test("a crash between apply and cursor save replays one page, and the replay changes nothing", async () => {
  const platform = createFakePlatform();
  platform.upsert(rec("a", "2026-09-30"));
  platform.upsert(rec("b", "2026-10-01"));
  const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });

  let failNext = true;
  const flakyCursor = {
    load: cursorStore.load,
    async save(key, state) {
      if (failNext) {
        failNext = false;
        throw new Error("process killed");
      }
      return cursorStore.save(key, state);
    },
  };

  await assert.rejects(
    runSync({ key: KEY, source: platform.source, cursorStore: flakyCursor, recordStore, now: () => NOW }),
    /process killed/,
  );
  assert.deepEqual(liveIds(recordStore), ["a", "b"], "the page was applied");
  assert.equal(recordStore.commitCount, 1);
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:0", "but the cursor was not saved");

  const replay = await runSync({ key: KEY, source: platform.source, cursorStore: flakyCursor, recordStore, now: () => NOW });
  assert.equal(replay.upserted, 0);
  assert.equal(replay.unchanged, 2, "both records recognised by id and version");
  assert.deepEqual(replay.dirtyDays, [], "a replay dirties nothing");
  assert.equal(recordStore.commitCount, 1, "and writes nothing");
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:2");
});

// ---------------------------------------------------------------------------
// Paging
// ---------------------------------------------------------------------------

test("pages are followed until hasMore is false, with the cursor saved after each", async () => {
  const platform = createFakePlatform({ pageSize: 2 });
  for (const id of ["a", "b", "c", "d", "e"]) platform.upsert(rec(id, "2026-10-01"));
  const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => NOW });

  assert.equal(result.pages, 3);
  assert.equal(cursorStore.saveCount, 3);
  assert.deepEqual(
    platform.calls.map((c) => c[1]),
    ["tok:0", "tok:2", "tok:4"],
  );
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:5");
  assert.equal(result.upserted, 5);
});

test("stopping early at maxPages loses nothing: the next run resumes from the saved cursor", async () => {
  const platform = createFakePlatform({ pageSize: 2 });
  for (const id of ["a", "b", "c"]) platform.upsert(rec(id, "2026-10-01"));
  const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });

  const first = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, maxPages: 1, now: () => NOW });
  assert.equal(first.hasMore, true);
  assert.deepEqual(liveIds(recordStore), ["a", "b"]);

  const second = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => NOW });
  assert.equal(second.hasMore, false);
  assert.deepEqual(platform.calls.map((c) => c[1]), ["tok:0", "tok:2"], "page 1 was not fetched again");
  assert.deepEqual(liveIds(recordStore), ["a", "b", "c"]);
});

// ---------------------------------------------------------------------------
// Expired and rejected cursors
// ---------------------------------------------------------------------------

test("an expired token is a flag; the fallback re-reads, dedupes by id, and catches deletions", async () => {
  const lastRead = Date.UTC(2026, 7, 20, 12, 0); // 43 days before NOW
  const platform = createFakePlatform({ pageSize: 10 });
  platform.upsert(rec("a", "2026-08-25"));
  platform.upsert(rec("b", "2026-08-26"));
  platform.upsert(rec("d", "2026-08-27"));
  const { cursorStore, recordStore } = stores();
  await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => lastRead });
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:3");

  // The app sits unopened. Meanwhile: a deleted, b edited, c added, d untouched.
  platform.remove("a");
  platform.upsert(rec("b", "2026-08-26", { version: 2, value: 1400 }));
  platform.upsert(rec("c", "2026-09-28"));
  platform.expire("tok:3");
  platform.calls.length = 0;

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => NOW });

  assert.equal(result.mode, SYNC_MODE.RESYNC);
  assert.equal(result.reason, RESYNC_REASON.CURSOR_EXPIRED);
  assert.deepEqual(
    platform.calls,
    [["getChanges", "tok:3"], ["getCursor"], ["readSince", lastRead]],
    "the expired token is spent once, then the new cursor is taken before the re-read",
  );
  assert.deepEqual(liveIds(recordStore), ["b", "c", "d"]);
  assert.equal(recordStore.rows.get("a").deleted, true, "deleted while the token was dead, caught by set-difference");
  assert.equal(recordStore.rows.get("a").record, null, "the tombstone keeps identity, not payload");
  assert.equal(recordStore.rows.get("b").version, 2);
  assert.equal(result.unchanged, 1, "d was re-read and recognised");
  assert.deepEqual(result.dirtyDays, ["2026-08-25", "2026-08-26", "2026-09-28"], "d's unchanged day is not dirtied");
  const saved = await cursorStore.load(KEY);
  assert.equal(saved.cursor, "tok:6");
  assert.equal(saved.mode, SYNC_MODE.RESYNC);
  assert.equal(saved.lastReadAt, NOW);
});

test("the re-read window reaches back to the last read or 30 days, whichever is further", () => {
  assert.equal(resyncSince({ lastReadAt: NOW - 2 * DAY }, NOW), NOW - 30 * DAY, "a recent read still gets the lookback");
  assert.equal(resyncSince({ lastReadAt: NOW - 43 * DAY }, NOW), NOW - 43 * DAY);
  assert.equal(resyncSince(null, NOW), NOW - 30 * DAY);
  assert.equal(resyncSince({ lastReadAt: NOW - 2 * DAY }, NOW, 7 * DAY), NOW - 7 * DAY);
});

test("a rejected cursor takes the same fallback", async () => {
  const platform = createFakePlatform();
  platform.upsert(rec("a", "2026-10-01"));
  platform.reject("tok:0");
  const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, now: () => NOW });

  assert.equal(result.mode, SYNC_MODE.RESYNC);
  assert.equal(result.reason, RESYNC_REASON.CURSOR_INVALID);
  assert.deepEqual(liveIds(recordStore), ["a"]);
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:1");
  assert.ok(isCursorRejected(new CursorInvalidError("x")));
  assert.ok(!isCursorRejected(new Error("x")));
});

test("an unrecognised error is rethrown with the cursor untouched, never turned into a resync", async () => {
  const platform = createFakePlatform();
  platform.upsert(rec("a", "2026-10-01"));
  const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });
  let fullReads = 0;
  const source = {
    async getChanges() {
      throw new TypeError("cannot read properties of undefined");
    },
    async fullRead() {
      fullReads += 1;
      return { cursor: "tok:9", records: [] };
    },
  };

  await assert.rejects(runSync({ key: KEY, source, cursorStore, recordStore, now: () => NOW }), TypeError);
  assert.equal(fullReads, 0, "a bug is not a reason to re-read the user's history");
  assert.equal(cursorStore.saveCount, 0);
  assert.equal((await cursorStore.load(KEY)).cursor, "tok:0");
});

test("taking the cursor before the re-read replays a mid-read change; taking it after loses it", async () => {
  async function scenario(fullReadFor) {
    const platform = createFakePlatform({ pageSize: 10 });
    platform.upsert(rec("a", "2026-10-01"));
    platform.reject("tok:0");
    const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });
    platform.whileReading(() => platform.upsert(rec("late", "2026-10-02")));
    const source = { getChanges: platform.source.getChanges, fullRead: fullReadFor(platform) };

    await runSync({ key: KEY, source, cursorStore, recordStore, now: () => NOW });
    assert.ok(!recordStore.rows.has("late"), "the re-read snapshot did not include it");
    await runSync({ key: KEY, source, cursorStore, recordStore, now: () => NOW + 60_000 });
    return { platform, recordStore };
  }

  const right = await scenario((p) => cursorFirstFullRead({ getCursor: p.getCursor, readSince: p.readSince }));
  assert.ok(right.recordStore.rows.has("late"), "replayed by the next incremental sync");

  const wrong = await scenario((p) => async ({ since }) => {
    const records = await p.readSince({ since });
    const cursor = await p.getCursor();
    return { cursor, records };
  });
  assert.ok(wrong.platform.has("late"));
  assert.ok(!wrong.recordStore.rows.has("late"), "cursor taken after the read: the change is gone for good");
});

test("upserts written by your own app are not re-imported", async () => {
  const platform = createFakePlatform();
  platform.upsert(rec("theirs", "2026-10-01"));
  platform.upsert(rec("ours", "2026-10-01", { origin: OWN_APP }));
  const { cursorStore, recordStore } = stores({ cursor: "tok:0", lastReadAt: NOW - DAY });

  const result = await runSync({ key: KEY, source: platform.source, cursorStore, recordStore, ownOrigin: OWN_APP, now: () => NOW });
  assert.equal(result.ownWrites, 1);
  assert.deepEqual(liveIds(recordStore), ["theirs"]);
});

// ---------------------------------------------------------------------------
// applyChanges on its own
// ---------------------------------------------------------------------------

test("applying the same batch twice changes nothing the second time", async () => {
  const store = createMemoryRecordStore();
  const batch = [
    { type: "upsert", record: rec("a", "2026-09-30") },
    { type: "upsert", record: rec("b", "2026-10-01") },
    { type: "delete", id: "a" },
  ];
  const first = await applyChanges(store, batch);
  assert.equal(store.commitCount, 1, "one atomic write per batch");
  assert.equal(store.rows.get("a").deleted, true, "the batch sees its own earlier upsert");
  assert.deepEqual(first.dirtyDays, ["2026-09-30", "2026-10-01"]);

  const second = await applyChanges(store, batch);
  assert.equal(second.upserted + second.deleted, 0);
  assert.deepEqual(second.dirtyDays, []);
  assert.equal(store.commitCount, 1);
  assert.equal(store.rows.get("a").deleted, true, "the replayed upsert did not resurrect it");
});

test("versions gate every write: stale is ignored, and an edit dirties the day it left", async () => {
  const store = createMemoryRecordStore();
  await applyChanges(store, [{ type: "upsert", record: rec("s", "2026-09-30", { version: 5 }) }]);

  const stale = await applyChanges(store, [{ type: "upsert", record: rec("s", "2026-09-30", { version: 4, value: 1 }) }]);
  assert.equal(stale.unchanged, 1);
  assert.equal(store.rows.get("s").version, 5);

  const moved = await applyChanges(store, [{ type: "upsert", record: rec("s", "2026-10-01", { version: 6 }) }]);
  assert.deepEqual(moved.dirtyDays, ["2026-09-30", "2026-10-01"], "both the old and the new day are now wrong");
});

test("a deletion for an id you never stored is a counted no-op, and bad records write nothing", async () => {
  const store = createMemoryRecordStore();
  const result = await applyChanges(store, [{ type: "delete", id: "never-seen" }]);
  assert.equal(result.unknownDeletes, 1);
  assert.deepEqual(result.dirtyDays, []);
  assert.equal(store.commitCount, 0);

  const noDay = { id: "x", version: 1, start: NOW };
  await assert.rejects(
    applyChanges(store, [{ type: "upsert", record: rec("ok", "2026-10-01") }, { type: "upsert", record: noDay }]),
    TypeError,
  );
  assert.equal(store.commitCount, 0, "the valid record in the same batch was not half-written");
  await assert.rejects(applyChanges(store, [{ type: "move", id: "x" }]), TypeError);
});
