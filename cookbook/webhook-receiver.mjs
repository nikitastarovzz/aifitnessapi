/**
 * webhook-receiver.mjs — a health-webhook ingest endpoint that is safe to
 * deliver to twice.
 *
 * WHAT THIS IMPLEMENTS
 *   `ingest(rawBody, headers, deps)` — everything a fitness-provider webhook
 *   endpoint should do before it answers, and nothing it should not:
 *     1. Verify the HMAC signature over the RAW request bytes, BEFORE parsing.
 *        Parsing JSON and re-serializing it breaks signatures over whitespace.
 *        The signature header is a list, so key rotation works.
 *     2. Reject a signed timestamp outside the replay tolerance.
 *     3. Resolve the subject to one of your users. An unresolvable subject is
 *        acknowledged and dropped with NO row written anywhere — including the
 *        DLQ — because an erased user must not be resurrected by a late event.
 *     4. Dedupe the DELIVERY on (provider, delivery id).
 *     5. Treat the event as a thin POINTER. The job carries
 *        (user, provider, metric, window, version) and never a value read out
 *        of the payload; the worker re-fetches the window from the provider.
 *     6. Gate on a monotonic version so an out-of-order delivery is a no-op
 *        instead of a regression. Never resolve on arrival time.
 *     7. Route a handler exception to a DLQ carrying the window, and still ACK.
 *   The endpoint does no provider I/O: acknowledging in milliseconds is what
 *   stops you from manufacturing the retries you are defending against.
 *
 * PATTERN DOCUMENTED AT
 *   https://aifitnessapi.com/architecture/webhook-ingestion
 *   https://aifitnessapi.com/test/webhooks-locally
 *
 * Signature scheme follows the Standard Webhooks shape
 * (`msg_id.timestamp.payload`, a space-delimited `v1,<sig>` list). Real
 * providers differ — swap `hmac`, `headerNames` and `parsePointer` per provider
 * and write your fixtures from a captured delivery, not from a spec example.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const DEFAULT_HEADER_NAMES = {
  id: "webhook-id",
  timestamp: "webhook-timestamp",
  signature: "webhook-signature",
};

/** Standard Webhooks defines no replay window. Pick one; make it a parameter. */
const DEFAULT_TOLERANCE_MS = 5 * 60 * 1000;

function toBytes(raw) {
  if (Buffer.isBuffer(raw)) return raw;
  if (raw instanceof Uint8Array) return Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength);
  if (typeof raw === "string") return Buffer.from(raw, "utf8");
  throw new TypeError("rawBody must be Buffer, Uint8Array, or string");
}

/** Works with a plain object, a Map, or a WHATWG Headers instance. */
function headerReader(headers) {
  if (headers && typeof headers.get === "function") return (name) => headers.get(name);
  const lower = new Map(
    Object.entries(headers ?? {}).map(([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v[0] : v]),
  );
  return (name) => lower.get(name.toLowerCase()) ?? null;
}

/**
 * Default HMAC-SHA256, base64 out. Standard Webhooks secrets look like
 * `whsec_<base64>` and the KEY is the decoded base64, not the literal string.
 */
export function defaultHmacSha256(secret, messageBytes) {
  const material = String(secret).startsWith("whsec_") ? String(secret).slice(6) : String(secret);
  let key;
  try {
    key = Buffer.from(material, "base64");
    if (key.length === 0) key = Buffer.from(material, "utf8");
  } catch {
    key = Buffer.from(material, "utf8");
  }
  return createHmac("sha256", key).update(messageBytes).digest("base64");
}

function constantTimeEquals(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * Verify a signature over the exact bytes received.
 *
 * The header carries a space-delimited LIST so a producer can sign with the
 * old and the new secret during a rotation. Accepting only the first entry
 * passes the happy path for months and fails on rotation morning.
 */
export function verifySignature({ rawBody, id, timestamp, signatureHeader, secrets, hmac = defaultHmacSha256 }) {
  if (!signatureHeader || !Array.isArray(secrets) || secrets.length === 0) return false;
  const signed = Buffer.concat([Buffer.from(`${id}.${timestamp}.`, "utf8"), toBytes(rawBody)]);
  const presented = String(signatureHeader)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => (part.includes(",") ? part.slice(part.indexOf(",") + 1) : part));

  let matched = false;
  for (const secret of secrets) {
    const expected = hmac(secret, signed);
    for (const candidate of presented) {
      // No early return: keep the work constant across secrets and signatures.
      if (constantTimeEquals(expected, candidate)) matched = true;
    }
  }
  return matched;
}

/**
 * Turn a decoded event into the pointer the fetch worker needs. This is the
 * one function you rewrite per provider — the envelope below is a neutral
 * shape, not any real vendor's.
 */
export function defaultParsePointer(event) {
  const subjectId = event?.subject_id ?? event?.ownerId ?? event?.owner_id ?? event?.userId;
  if (subjectId === undefined || subjectId === null || subjectId === "") {
    throw new Error("event carries no subject id");
  }
  const metric = event?.metric ?? event?.collectionType ?? "unknown";
  const windowStart = event?.window_start ?? event?.date ?? null;
  if (!windowStart) throw new Error("event carries no window");
  const version = Number(event?.version ?? event?.modified_at ?? 0);
  if (!Number.isFinite(version)) throw new Error("event carries an unusable version");
  return {
    subjectId: String(subjectId),
    metric: String(metric),
    windowStart: String(windowStart),
    windowEnd: event?.window_end ? String(event.window_end) : String(windowStart),
    version,
  };
}

/** The debounce key. Eleven pings about the same Tuesday collapse into one job. */
export function jobKeyFor({ provider, userId, metric, windowStart }) {
  return `${provider}:${userId}:${metric}:${windowStart}`;
}

const REJECT = (outcome, detail) => ({ status: 400, ack: false, outcome, detail });
const ACK = (outcome, extra = {}) => ({ status: 200, ack: true, outcome, ...extra });

/**
 * @param {Buffer|Uint8Array|string} rawBody  EXACTLY the bytes the provider sent.
 * @param {object|Headers} headers
 * @param {object} deps
 * @param {string[]} deps.secrets            all currently-valid secrets (rotation)
 * @param {(subjectId: string) => Promise<string|null>} deps.resolveSubject
 *        Must be driven by a tombstone, not by "no user row" — an ingest path
 *        that reads a missing user as "create one" passes against an empty test
 *        database and resurrects an erased person against a real one.
 * @param {{insertIfAbsent: (key: string, row: object) => Promise<boolean>}} deps.seen
 * @param {{commitVersion: (key: string, version: number) => Promise<boolean>}} deps.pointers
 * @param {{enqueue: (job: object) => Promise<void>}} deps.queue
 * @param {{add: (entry: object) => Promise<void>}} deps.dlq
 * @param {string} [deps.provider]
 * @param {(secret: string, bytes: Buffer) => string} [deps.hmac]
 * @param {(bytes: Buffer) => object} [deps.parseBody]
 * @param {(event: object, headers: object) => object} [deps.parsePointer]
 * @param {() => number} [deps.now]
 * @param {number} [deps.toleranceMs]
 * @param {object} [deps.headerNames]
 */
export async function ingest(rawBody, headers, deps) {
  const {
    secrets,
    resolveSubject,
    seen,
    pointers,
    queue,
    dlq,
    provider = "unknown",
    hmac = defaultHmacSha256,
    parseBody = (bytes) => JSON.parse(bytes.toString("utf8")),
    parsePointer = defaultParsePointer,
    now = () => Date.now(),
    toleranceMs = DEFAULT_TOLERANCE_MS,
    headerNames = DEFAULT_HEADER_NAMES,
  } = deps ?? {};

  const bytes = toBytes(rawBody);
  const read = headerReader(headers);
  const deliveryId = read(headerNames.id);
  const timestamp = read(headerNames.timestamp);
  const signatureHeader = read(headerNames.signature);

  if (!deliveryId || !timestamp) return REJECT("missing-headers");

  // ---- 1. Signature, over the raw bytes, before anything parses them. ------
  if (!verifySignature({ rawBody: bytes, id: deliveryId, timestamp, signatureHeader, secrets, hmac })) {
    return REJECT("invalid-signature");
  }

  // ---- 2. Replay tolerance. A correctly signed delivery from last week is
  //         still a replay. Checked before dedupe so it costs no storage. ----
  const signedAtMs = Number(timestamp) * 1000;
  if (!Number.isFinite(signedAtMs) || Math.abs(now() - signedAtMs) > toleranceMs) {
    return REJECT("stale-timestamp");
  }

  let pointer = null;
  let userId = null;
  try {
    // ---- 3. Parse, then resolve the subject. ------------------------------
    const event = parseBody(bytes);
    pointer = parsePointer(event, headers);

    userId = await resolveSubject(pointer.subjectId);
    if (!userId) {
      // Acknowledge so the provider stops retrying, and write NOTHING — not a
      // delivery row, not a DLQ row. Then go revoke the subscription: the row
      // is not the problem, the live subscription is.
      return ACK("unresolved-subject", { revokeSubscription: true, subjectId: pointer.subjectId });
    }

    // ---- 4. Delivery-level dedupe. A duplicate is a SUCCESS: the provider
    //         delivered and we acknowledged. Answering non-2xx here converts
    //         one duplicate into an escalating retry storm. -----------------
    const deliveryKey = `${provider}:${deliveryId}`;
    const fresh = await seen.insertIfAbsent(deliveryKey, {
      provider,
      deliveryId,
      userId,
      metric: pointer.metric,
      windowStart: pointer.windowStart,
      signedAtMs,
      receivedAtMs: now(),
    });
    if (!fresh) return ACK("duplicate", { deliveryId });

    // ---- 5/6. Versioned gate on the pointer. A backlog flush delivers
    //           two-day-old events after fresh ones; ordering on arrival would
    //           overwrite a correct day with a stale one, silently. ---------
    const key = jobKeyFor({ provider, userId, metric: pointer.metric, windowStart: pointer.windowStart });
    const advanced = await pointers.commitVersion(key, pointer.version);
    if (!advanced) return ACK("stale-version", { deliveryId, key, version: pointer.version });

    // ---- 7. Enqueue a thin pointer. No value from the payload travels with
    //         it; the worker re-reads the window and does a versioned replace,
    //         which is idempotent by construction. ------------------------
    const job = {
      key,
      provider,
      userId,
      metric: pointer.metric,
      windowStart: pointer.windowStart,
      windowEnd: pointer.windowEnd,
      version: pointer.version,
      deliveryId,
    };
    await queue.enqueue(job);
    return ACK("enqueued", { deliveryId, job });
  } catch (error) {
    // ACK DECISION, DELIBERATE: a poisoned delivery is acknowledged (200), not
    // 500'd. The signature already proved the sender; replaying the same bytes
    // will hit the same defect, so a non-2xx only buys an escalating retry
    // storm and, on platforms with a disable policy, an endpoint the provider
    // eventually stops talking to. Recovery is a DLQ replay that RE-PULLS the
    // window against a fixed adapter — which is why the window, not just the
    // body, is what we store.
    await dlq.add({
      provider,
      deliveryId,
      userId,
      metric: pointer?.metric ?? null,
      windowStart: pointer?.windowStart ?? null,
      windowEnd: pointer?.windowEnd ?? null,
      rawBody: bytes,
      error: String(error?.message ?? error),
      failedAtMs: now(),
    });
    return ACK("dead-lettered", { deliveryId, error: String(error?.message ?? error) });
  }
}

/**
 * The write the fetch worker performs after re-reading the window. REPLACE,
 * never increment, gated on a monotonic version — the SQL equivalent is
 * `on conflict ... do update set value = excluded.value
 *  where excluded.version > daily_rollup.version`.
 *
 * @returns {Promise<boolean>} true when the row moved.
 */
export async function applyVersionedReplace(store, key, { value, version, ...rest }) {
  const current = await store.read(key);
  if (current && Number(current.version) >= Number(version)) return false;
  await store.write(key, { ...rest, value, version: Number(version) });
  return true;
}

/**
 * Reference seen-store. In Postgres this is
 * `insert into webhook_delivery ... on conflict do nothing` and the boolean is
 * the row count. Rows must live at least as long as the provider's retry
 * horizon — and must be purged with the user on erasure, or a late delivery
 * re-materializes somebody you deleted.
 */
export function createMemorySeenStore() {
  const rows = new Map();
  return {
    async insertIfAbsent(key, row) {
      if (rows.has(key)) return false;
      rows.set(key, row);
      return true;
    },
    get size() {
      return rows.size;
    },
    rows,
  };
}

/** Reference version gate. In Postgres: an upsert with a `where excluded.version > ...`. */
export function createMemoryVersionGate() {
  const versions = new Map();
  return {
    async commitVersion(key, version) {
      const current = versions.get(key);
      if (current !== undefined && current >= version) return false;
      versions.set(key, version);
      return true;
    },
    async readVersion(key) {
      return versions.get(key);
    },
    versions,
  };
}
