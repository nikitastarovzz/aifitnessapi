/**
 * webhook-receiver.test.mjs — the contract for cookbook/webhook-receiver.mjs.
 *
 * WHAT THIS IMPLEMENTS
 *   The replay suite the testing page argues for: assertions on enqueued jobs
 *   and stored state, never on a status code alone. Fixtures are signed as RAW
 *   BYTES on disk-equivalent buffers so the parse-then-reserialize bug can
 *   actually surface. No network, no tunnel, no provider.
 *
 * PATTERN DOCUMENTED AT
 *   https://aifitnessapi.com/test/webhooks-locally
 *   https://aifitnessapi.com/architecture/webhook-ingestion
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  ingest,
  verifySignature,
  defaultHmacSha256,
  applyVersionedReplace,
  createMemorySeenStore,
  createMemoryVersionGate,
  jobKeyFor,
} from "./webhook-receiver.mjs";

const SECRET = "whsec_c2VjcmV0LWtleS1mb3ItdGVzdHM=";
const ROTATED = "whsec_bmV3LXNlY3JldC1rZXktZm9yLXRlc3Rz";
const NOW = 1_785_024_000_000; // fixed epoch ms
const TS = String(Math.floor(NOW / 1000));

/** Build the exact bytes a provider would POST, then sign those bytes. */
function delivery({ id = "msg_01", ts = TS, body, secrets = [SECRET], corruptSignature = false } = {}) {
  const raw = Buffer.from(typeof body === "string" ? body : JSON.stringify(body), "utf8");
  const signed = Buffer.concat([Buffer.from(`${id}.${ts}.`, "utf8"), raw]);
  const sigs = secrets.map((s) => `v1,${defaultHmacSha256(s, signed)}`);
  return {
    raw,
    headers: {
      "webhook-id": id,
      "webhook-timestamp": ts,
      "webhook-signature": corruptSignature ? "v1,YWJjZGVm" : sigs.join(" "),
      "content-type": "application/json",
    },
  };
}

const POINTER_EVENT = {
  subject_id: "provider-7481",
  metric: "steps",
  date: "2026-07-26",
  version: 5,
  // A payload "value" the handler must never trust or propagate.
  value: 999999,
};

function harness(overrides = {}) {
  const enqueued = [];
  const dead = [];
  const seen = createMemorySeenStore();
  const pointers = createMemoryVersionGate();
  const parseCalls = { count: 0 };
  const deps = {
    provider: "acme",
    secrets: [SECRET],
    now: () => NOW,
    seen,
    pointers,
    queue: { enqueue: async (job) => void enqueued.push(job) },
    dlq: { add: async (entry) => void dead.push(entry) },
    resolveSubject: async (subjectId) => (subjectId === "provider-7481" ? "user-1" : null),
    parseBody: (bytes) => {
      parseCalls.count += 1;
      return JSON.parse(bytes.toString("utf8"));
    },
    ...overrides,
  };
  return { deps, enqueued, dead, seen, pointers, parseCalls };
}

test("a bad signature is rejected before the body is parsed", async () => {
  const { deps, enqueued, dead, seen, parseCalls } = harness();
  // Bytes that would throw if anything tried to parse them.
  const { raw, headers } = delivery({ body: "{ this is not json", corruptSignature: true });

  const result = await ingest(raw, headers, deps);

  assert.equal(result.status, 400);
  assert.equal(result.ack, false);
  assert.equal(result.outcome, "invalid-signature");
  assert.equal(parseCalls.count, 0, "the body was never parsed");
  assert.equal(enqueued.length, 0);
  assert.equal(dead.length, 0, "a forged delivery is not our dead letter to keep");
  assert.equal(seen.size, 0, "a forged delivery id never enters the dedupe table");
});

test("the signature is verified over the raw bytes, so re-serialization breaks it", async () => {
  const { deps } = harness();
  const { raw, headers } = delivery({ body: POINTER_EVENT });
  // What a handler does when it parses first and signs the object it got back.
  const reserialized = Buffer.from(JSON.stringify(JSON.parse(raw.toString("utf8"))) + " ", "utf8");

  assert.equal((await ingest(raw, headers, deps)).outcome, "enqueued");
  assert.equal(
    verifySignature({
      rawBody: reserialized,
      id: headers["webhook-id"],
      timestamp: headers["webhook-timestamp"],
      signatureHeader: headers["webhook-signature"],
      secrets: [SECRET],
    }),
    false,
    "a stray byte invalidates the signature — which is the point",
  );
});

test("key rotation: both signatures accepted, then the old secret is dropped", async () => {
  const { raw, headers } = delivery({ body: POINTER_EVENT, secrets: [SECRET, ROTATED] });

  const during = harness({ secrets: [SECRET, ROTATED] });
  assert.equal((await ingest(raw, headers, during.deps)).outcome, "enqueued");

  const after = harness({ secrets: [ROTATED] });
  const onlyOld = delivery({ body: POINTER_EVENT, secrets: [SECRET] });
  assert.equal((await ingest(onlyOld.raw, onlyOld.headers, after.deps)).outcome, "invalid-signature");
});

test("a correctly signed but stale delivery is rejected on the tolerance", async () => {
  const { deps, seen } = harness();
  const oldTs = String(Math.floor(NOW / 1000) - 3 * 24 * 3600);
  const { raw, headers } = delivery({ body: POINTER_EVENT, ts: oldTs });

  const result = await ingest(raw, headers, deps);
  assert.equal(result.outcome, "stale-timestamp");
  assert.equal(result.status, 400);
  assert.equal(seen.size, 0, "rejected before it costs a dedupe row");
});

test("a duplicate delivery id is acked but not re-enqueued", async () => {
  const { deps, enqueued } = harness();
  const { raw, headers } = delivery({ body: POINTER_EVENT });

  const first = await ingest(raw, headers, deps);
  const second = await ingest(raw, headers, deps); // byte-identical replay

  assert.equal(first.outcome, "enqueued");
  assert.equal(second.outcome, "duplicate");
  assert.equal(second.status, 200, "a duplicate is a success from the provider's side");
  assert.equal(second.ack, true);
  assert.equal(enqueued.length, 1, "one job, not two");
});

test("the enqueued job is a thin pointer and carries no payload value", async () => {
  const { deps, enqueued } = harness();
  const { raw, headers } = delivery({ body: POINTER_EVENT });

  await ingest(raw, headers, deps);

  assert.equal(enqueued.length, 1);
  assert.deepEqual(enqueued[0], {
    key: jobKeyFor({ provider: "acme", userId: "user-1", metric: "steps", windowStart: "2026-07-26" }),
    provider: "acme",
    userId: "user-1",
    metric: "steps",
    windowStart: "2026-07-26",
    windowEnd: "2026-07-26",
    version: 5,
    deliveryId: "msg_01",
  });
  assert.equal("value" in enqueued[0], false, "the payload's own number never travels");
});

test("out-of-order: an older version delivered after a newer one does not regress", async () => {
  const { deps, enqueued, pointers } = harness();
  const newer = delivery({ id: "msg_new", body: { ...POINTER_EVENT, version: 9 } });
  const older = delivery({ id: "msg_old", body: { ...POINTER_EVENT, version: 3 } });

  assert.equal((await ingest(newer.raw, newer.headers, deps)).outcome, "enqueued");
  const result = await ingest(older.raw, older.headers, deps);

  assert.equal(result.outcome, "stale-version");
  assert.equal(result.status, 200, "acked — the provider did nothing wrong");
  assert.equal(enqueued.length, 1, "the backlog flush enqueues nothing");
  assert.equal(
    await pointers.readVersion(jobKeyFor({ provider: "acme", userId: "user-1", metric: "steps", windowStart: "2026-07-26" })),
    9,
    "the stored version never moves backwards",
  );
});

test("a genuine re-notification for the same day advances the version and re-enqueues", async () => {
  const { deps, enqueued } = harness();
  const morning = delivery({ id: "msg_am", body: { ...POINTER_EVENT, version: 1 } });
  const evening = delivery({ id: "msg_pm", body: { ...POINTER_EVENT, version: 2 } });

  await ingest(morning.raw, morning.headers, deps);
  await ingest(evening.raw, evening.headers, deps);

  assert.equal(enqueued.length, 2, "a day that fills in is a real update, not a duplicate");
  assert.deepEqual(
    enqueued.map((j) => j.version),
    [1, 2],
  );
});

test("an unresolvable subject is acked and dropped with no row written anywhere", async () => {
  const { deps, enqueued, dead, seen } = harness();
  const { raw, headers } = delivery({ body: { ...POINTER_EVENT, subject_id: "provider-deleted" } });

  const result = await ingest(raw, headers, deps);

  assert.equal(result.outcome, "unresolved-subject");
  assert.equal(result.ack, true);
  assert.equal(result.revokeSubscription, true, "fix the subscription, not the row");
  assert.equal(enqueued.length, 0);
  assert.equal(dead.length, 0, "the DLQ is a store like any other — an erased user goes in none of them");
  assert.equal(seen.size, 0);
});

test("a handler exception is dead-lettered with the window attached, and still acked", async () => {
  const boom = new Error("queue unavailable");
  const { deps, dead, enqueued } = harness({
    queue: {
      enqueue: async () => {
        throw boom;
      },
    },
  });
  const { raw, headers } = delivery({ body: POINTER_EVENT });

  const result = await ingest(raw, headers, deps);

  // ACK on a poisoned delivery is deliberate; the reasoning is in the catch
  // block of webhook-receiver.mjs. Replaying the bytes hits the same defect,
  // so a 500 buys only a retry storm.
  assert.equal(result.status, 200);
  assert.equal(result.ack, true);
  assert.equal(result.outcome, "dead-lettered");
  assert.equal(enqueued.length, 0);
  assert.equal(dead.length, 1);
  assert.equal(dead[0].userId, "user-1");
  assert.equal(dead[0].metric, "steps");
  assert.equal(dead[0].windowStart, "2026-07-26", "replay means re-pull this window");
  assert.equal(dead[0].windowEnd, "2026-07-26");
  assert.equal(dead[0].error, "queue unavailable");
  assert.ok(Buffer.isBuffer(dead[0].rawBody), "the verified bytes are kept for forensics");
});

test("a malformed body with a valid signature is dead-lettered, not 500'd", async () => {
  const { deps, dead, enqueued } = harness();
  const { raw, headers } = delivery({ body: '{"subject_id":"provider-7481",' });

  const result = await ingest(raw, headers, deps);

  assert.equal(result.outcome, "dead-lettered");
  assert.equal(result.ack, true);
  assert.equal(enqueued.length, 0, "no partial write");
  assert.equal(dead.length, 1);
  assert.equal(dead[0].windowStart, null, "we could not parse a window, and we say so");
});

test("missing signature headers are rejected outright", async () => {
  const { deps } = harness();
  const { raw } = delivery({ body: POINTER_EVENT });
  const result = await ingest(raw, { "content-type": "application/json" }, deps);
  assert.equal(result.outcome, "missing-headers");
  assert.equal(result.status, 400);
});

test("applyVersionedReplace replaces, never increments, and ignores stale versions", async () => {
  const rows = new Map();
  const store = {
    read: async (k) => rows.get(k),
    write: async (k, v) => void rows.set(k, v),
  };
  const key = "acme:user-1:steps:2026-07-26";

  assert.equal(await applyVersionedReplace(store, key, { value: 2100, version: 1 }), true);
  assert.equal(await applyVersionedReplace(store, key, { value: 8431, version: 2 }), true);
  assert.equal(rows.get(key).value, 8431, "replace: the day is not 2100 + 8431");

  assert.equal(await applyVersionedReplace(store, key, { value: 2100, version: 1 }), false);
  assert.equal(rows.get(key).value, 8431, "a stale replay cannot regress the day");

  assert.equal(await applyVersionedReplace(store, key, { value: 8431, version: 2 }), false);
  assert.equal(rows.get(key).value, 8431, "an equal-version replay is a no-op, not a double");
});
