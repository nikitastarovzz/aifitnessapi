/**
 * The verification core behind /tools/webhook-verifier.
 *
 * One module, imported by the page's client component and by
 * scripts/webhook-verifier.test.mjs, so the test exercises exactly the code a
 * reader runs. It is plain ESM with no dependencies: the only crypto is
 * WebCrypto (`globalThis.crypto.subtle`), which every current browser and
 * Node 20+ provide. Nothing here makes a network call. A secret typed into the
 * page is handed to `crypto.subtle.importKey` in that tab and goes nowhere
 * else.
 *
 * Every vendor below is here because its signing or token rule was read from
 * the vendor's own page on the date in `source.fetched`, and the sentence that
 * states the rule is kept in `source.quote` and rendered beside the block. A
 * vendor whose rule could not be read from its own documentation is not
 * listed (see the page's "Not included" section) — this file never encodes a
 * scheme from memory.
 *
 * Kinds of check:
 *   hmac       — recompute the vendor's documented HMAC and compare it, in
 *                constant time, with the signature header.
 *   token      — the vendor sends back a secret you chose (in the body, the
 *                URL or a header); compare it in constant time. This proves
 *                the sender knows the secret, not that the body is untouched,
 *                and the page says so.
 *   handshake  — a subscription-validation request (GET with a challenge);
 *                check the token and build the exact response body.
 */

/* ---------------------------------------------------------------------- *
 * Encoding and crypto helpers
 * ---------------------------------------------------------------------- */

const enc = new TextEncoder();

function subtle() {
  const s = globalThis.crypto?.subtle;
  if (!s) throw new Error("WebCrypto (crypto.subtle) is not available in this environment.");
  return s;
}

/** HMAC-SHA256 of `message` keyed by `secret`, both UTF-8 strings. */
export async function hmacSha256(secret, message) {
  const key = await subtle().importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await subtle().sign("HMAC", key, enc.encode(message)));
}

export function toHex(bytes) {
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s;
}

export function toBase64(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/**
 * Constant-time string comparison. Length is not secret (both sides are
 * public-format digests or tokens), so a length mismatch returns early; the
 * character loop itself never short-circuits.
 */
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** "Name: value" lines → lower-cased header map. Also accepts a plain object. */
export function parseHeaders(input) {
  const out = {};
  if (!input) return out;
  if (typeof input === "object") {
    for (const [k, v] of Object.entries(input)) out[k.toLowerCase()] = String(v);
    return out;
  }
  for (const raw of String(input).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i <= 0) continue;
    out[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  return out;
}

/** Query parameters of a full URL, a path with a query, or a bare query string. */
export function parseQuery(input) {
  const s = String(input ?? "").trim();
  const q = s.includes("?") ? s.slice(s.indexOf("?") + 1) : s.includes("=") ? s : "";
  const out = {};
  for (const [k, v] of new URLSearchParams(q.split("#")[0])) out[k] = v;
  return out;
}

function tryJson(body) {
  try {
    return { ok: true, value: JSON.parse(body) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Shorten long strings for display without hiding where they differ. */
function preview(s, n = 160) {
  return s.length > n ? `${s.slice(0, n)}… (${s.length} chars)` : s;
}

/* ---------------------------------------------------------------------- *
 * Vendor definitions
 * ---------------------------------------------------------------------- */

const FETCHED = "2026-10-31";

/**
 * @typedef {{ method: "POST" | "GET", url: string, headers: string, body: string, secret: string }} WebhookInput
 * @typedef {{ status: "valid" | "invalid" | "unsigned" | "error", title: string, detail: string[],
 *             computed?: string, received?: string, signedString?: string, reply?: string }} VerifyResult
 */

export const WEBHOOK_VENDORS = [
  {
    id: "oura",
    name: "Oura",
    integrate: "/integrate/oura-api",
    kind: "hmac",
    secretLabel: "Client secret (or, for the GET verification request, your verification_token)",
    summary:
      "HMAC-SHA256, keyed by your client secret, over the x-oura-timestamp value followed by JSON.stringify(body); hex, upper-case, in x-oura-signature.",
    headers: ["x-oura-signature", "x-oura-timestamp"],
    source: {
      url: "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
      label: "Oura API v2 OpenAPI document (1.43), “Webhooks for Real-Time Data Updates”",
      fetched: FETCHED,
      via: "snapshot",
      quote: [
        "hmac.update(timestamp + JSON.stringify(body));",
        "const calculatedSignature = hmac.digest('hex').toUpperCase();",
      ],
    },
    caveat:
      "Oura's sample signs JSON.stringify of the parsed body, not the raw bytes, so this tool re-serializes the body you paste the same way. If Oura's serializer and JavaScript's ever differ (key order, spacing, escaped characters), a genuine request can fail this check; the page says when the raw body would have matched instead.",
    respond: [
      "Respond quickly (under 10 seconds) with a 2xx status, and process the event asynchronously.",
      "Oura retries failed deliveries 10 times each for 4xx responses, 5xx responses and timeouts, for about an hour.",
      "A 410 response cancels the subscription.",
    ],
    handshake:
      "When you create a subscription Oura sends GET <callback>?verification_token=…&challenge=…; check the token and reply with JSON {\"challenge\": \"…\"}.",
    fields: {
      event_type: "The type of event: create, update or delete (one subscription per event_type and data_type).",
      data_type: "The type of data the event concerns, e.g. sleep.",
      object_id: "Use the object_id to fetch the complete data via the API.",
      event_time: "When the event occurred (Oura's example: 2023-01-01T08:00:00+00:00).",
      user_id: "The Oura user the event belongs to.",
    },
    next: (body) => {
      const dt = typeof body?.data_type === "string" ? body.data_type : "{data_type}";
      const id = body?.object_id != null ? String(body.object_id) : "{object_id}";
      return [
        `GET https://api.ouraring.com/v2/usercollection/${dt}/${id} with the user's OAuth token — the single-document route the OpenAPI document lists for collections such as sleep, workout, session and tag.`,
      ];
    },
  },
  {
    id: "whoop",
    name: "WHOOP",
    integrate: "/integrate/whoop-api",
    kind: "hmac",
    secretLabel: "Client secret",
    summary:
      "HMAC-SHA256, keyed by your app's client secret, over the X-WHOOP-Signature-Timestamp value followed by the raw body; base64, in X-WHOOP-Signature.",
    headers: ["x-whoop-signature", "x-whoop-signature-timestamp"],
    source: {
      url: "https://developer.whoop.com/docs/developing/webhooks/",
      label: "WHOOP Developer Platform, “Webhooks”",
      fetched: FETCHED,
      via: "snapshot",
      quote: [
        "To verify the signature, first prepend the timestamp header value to the raw http request body. Then, generate a SHA256 HMAC signature of that string using the secret key for your app, which can be found in the WHOOP Developer Dashboard. Finally, base64 encode the result, and compare it to the signature header.",
      ],
    },
    respond: [
      "Return a successful 2XX; WHOOP recommends doing so within a second and processing asynchronously.",
      "WHOOP retries failed deliveries five times over about one hour; anything other than a 2XX, or no response before timing out, counts as failed.",
      "Duplicates are possible: use trace_id to detect them.",
    ],
    fields: {
      user_id: "The WHOOP User for the event.",
      id: "Identifier of the object that triggered this webhook. For v2 webhooks a UUID; for recovery events in v2, the UUID of the sleep that the recovery is associated with.",
      type: "The type of event: workout.updated, workout.deleted, sleep.updated, sleep.deleted, recovery.updated or recovery.deleted.",
      trace_id: "Trace ID for the event that triggered this webhook — use it to detect duplicate deliveries.",
    },
    next: (body) => {
      const type = typeof body?.type === "string" ? body.type : "";
      const id = body?.id != null ? String(body.id) : "{id}";
      if (type.endsWith(".deleted")) return ["A delete event: remove the record you hold for this id; there is nothing to fetch."];
      if (type.startsWith("sleep."))
        return [`GET v2/activity/sleep/${id} with the access token for user ${body?.user_id ?? "{user_id}"} — WHOOP's own example request flow.`];
      if (type.startsWith("recovery."))
        return [
          `In v2 the id (${id}) is the sleep the recovery belongs to. WHOOP's page gives only the sleep request (GET v2/activity/sleep/{id}); take the recovery route from WHOOP's API reference.`,
        ];
      return [
        "Fetch the record this id points to from the matching v2 endpoint. WHOOP's webhook page spells out only the sleep request (GET v2/activity/sleep/{id}); take the workout route from WHOOP's API reference.",
      ];
    },
  },
  {
    id: "terra",
    name: "Terra",
    integrate: "/integrate/terra-api",
    kind: "hmac",
    secretLabel: "Destination signing secret",
    summary:
      "terra-signature: t=<timestamp>,v1=<signature>. HMAC-SHA256, keyed by the endpoint's signing secret, over timestamp + \".\" + raw body; compare with every v1 value, ignore other schemes.",
    headers: ["terra-signature"],
    source: {
      url: "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks",
      label: "Terra docs, “Webhooks” (data destinations)",
      fetched: FETCHED,
      via: "snapshot",
      quote: [
        "The signed_payload string is created by concatenating:",
        "Compute an HMAC with the SHA256 hash function. Use the endpoint’s signing secret as the key, and use the signed_payload string as the message.",
        "Terra generates signatures using a hash-based message authentication code (HMAC) with SHA-256. To prevent downgrade attacks, ignore all schemes that aren’t v1",
      ],
    },
    respond: [
      "Respond with a 2XX within 8 seconds — Terra's own advice is to accept immediately (return 200) and process asynchronously.",
      "Otherwise Terra retries up to 10 times with exponential backoff, starting at 30 seconds and roughly doubling, across about 8 hours; after that the event is dropped with no notification.",
      "Terra requires the raw, unaltered body for verification: read it before any JSON parsing.",
    ],
    fields: {
      type: "The event type, e.g. auth, deauth, activity, sleep, daily, healthcheck or s3_payload (ping mode).",
      status: "On a healthcheck event: the destination's health status.",
      creation_timestamp: "On a healthcheck event: when it was created.",
      trend_percentage: "On a healthcheck event: a number Terra reports alongside sent_webhooks_last_hour.",
      sent_webhooks_last_hour: "On a healthcheck event: how many webhooks Terra sent in the last hour.",
      url: "In ping mode (type s3_payload): a pre-signed link to the full data payload. Download it with a GET request.",
      expires_in: "In ping mode: URL validity in seconds (300 = 5 minutes).",
      user: "The Terra user the event belongs to.",
      data: "The normalised records for data events.",
    },
    next: (body) => {
      if (body?.type === "s3_payload")
        return [`GET ${typeof body.url === "string" ? body.url : "{url}"} before it expires (expires_in seconds), then process that JSON as a normal webhook payload.`];
      if (body?.type === "healthcheck") return ["Nothing to fetch: a healthcheck is sent periodically to confirm the destination is healthy."];
      return ["Data events carry the normalised data in the body itself, so there is usually nothing to fetch; in ping mode (type s3_payload) download the url instead."];
    },
  },
  {
    id: "polar",
    name: "Polar AccessLink",
    integrate: "/integrate/polar-api",
    kind: "hmac",
    secretLabel: "signature_secret_key (returned once, when the webhook was created)",
    summary:
      "HMAC-SHA256 of the payload, keyed by the signature_secret_key returned when you created the webhook; hex, in Polar-Webhook-Signature. Event type in Polar-Webhook-Event.",
    headers: ["polar-webhook-signature", "polar-webhook-event"],
    source: {
      url: "https://www.polar.com/accesslink-api/",
      label: "Polar AccessLink API v3 reference, “Accesslink webhooks”",
      fetched: FETCHED,
      via: "snapshot",
      quote: [
        "Hash-based message authentication code (HMAC SHA-256) is used to sign every webhook payload Accesslink sends. The secret key for calculating signature is given to client when they create the webhook.",
        "To verify sender client should calculate HMAC and compare it to the signature in payload header.",
      ],
    },
    caveat:
      "Polar's sample returns toHexString(mac.doFinal(data.getBytes())) without saying upper or lower case; its example header is lower-case, and this tool compares hex case-insensitively.",
    respond: [
      "Webhook delivery expects response 200 from the remote endpoint — including the PING sent when the webhook is created or its URL changes, or it is not created/modified.",
      "A webhook is automatically deactivated if push notifications have not been successful for seven days; re-enable it with the activate webhook endpoint.",
    ],
    fields: {
      event: "The event type, e.g. PING, EXERCISE, SLEEP, CONTINUOUS_HEART_RATE, SLEEP_WISE_CIRCADIAN_BEDTIME, SLEEP_WISE_ALERTNESS, ACTIVITY_SUMMARY or PHYSICAL_INFORMATION.",
      user_id: "The AccessLink user the event concerns.",
      entity_id: "Id of the entity the event is about (for EXERCISE, the exercise).",
      timestamp: "Time when webhook notification is sent.",
      url: "A URL related to the event — fetch it with the user's token.",
    },
    next: (body) => {
      if (body?.event === "PING") return ["Nothing to fetch: answer the PING with 200 OK so the webhook is created."];
      return [`GET ${typeof body?.url === "string" ? body.url : "{url}"} with the user's access token — the payload carries the URL of the data it announces.`];
    },
  },
  {
    id: "strava",
    name: "Strava",
    integrate: "/integrate/strava-api",
    kind: "handshake",
    secretLabel: "Your verify_token (the string you passed when creating the subscription)",
    summary:
      "No signature is documented for event POSTs. Subscription validation is a GET with hub.mode, hub.challenge and hub.verify_token; echo hub.challenge as JSON within two seconds.",
    headers: [],
    source: {
      url: "https://developers.strava.com/docs/webhooks/",
      label: "Strava Developers, “Webhook Events API”",
      fetched: FETCHED,
      via: "snapshot",
      quote: [
        "The query string of this GET request will contain a \"hub.challenge\" field that you must use to validate your callback address.",
        "Your callback address must respond within two seconds to the GET request from Strava’s subscription service.",
      ],
    },
    respond: [
      "Validation GET: respond within two seconds with status 200 and the hub.challenge echoed in the body as application/json.",
      "Event POST: acknowledge with 200 OK within two seconds; pushes are retried up to a total of three attempts if a 200 is not returned.",
      "Strava's webhook page documents no signature header for event POSTs, so an event cannot be authenticated from the request alone.",
    ],
    fields: {
      object_type: "Always either \"activity\" or \"athlete.\"",
      object_id: "For activity events, the activity's ID. For athlete events, the athlete's ID.",
      aspect_type: "Always \"create,\" \"update,\" or \"delete.\"",
      updates: "For activity update events, keys can contain title, type and private; for app deauthorization events there is always an \"authorized\": \"false\" pair.",
      owner_id: "The athlete's ID.",
      subscription_id: "The push subscription ID that is receiving this event.",
      event_time: "The time that the event occurred.",
      "hub.mode": "Always will be \"subscribe\".",
      "hub.challenge": "Random string the callback address must echo back to verify its existence.",
      "hub.verify_token": "Whatever verify_token you passed with the subscription request.",
    },
    next: (body) => {
      if (body?.updates && body.updates.authorized === "false") return ["The athlete deauthorized your app: stop syncing and delete their tokens. There is nothing to fetch."];
      if (body?.object_type === "activity" && body?.aspect_type !== "delete")
        return [`GET https://www.strava.com/api/v3/activities/${body.object_id ?? "{object_id}"} with the owner's access token (getActivityById in Strava's API reference).`];
      if (body?.aspect_type === "delete") return ["A delete event: remove the activity you stored for this object_id."];
      return ["Validation request: reply with the JSON shown above. Events arrive later as POSTs to the same URL."];
    },
  },
  {
    id: "withings",
    name: "Withings",
    integrate: "/integrate/withings-api",
    kind: "token",
    secretLabel: "The secret you appended to your callback URL",
    summary:
      "No signature. Withings suggests a secret query parameter on the callback URL you subscribe (its example: ?token=<random-secret>) plus an allowlist of its notification IPs. The body is form-encoded.",
    headers: [],
    source: {
      url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-overview/",
      label: "Withings developer guide, “Notifications overview”",
      fetched: FETCHED,
      via: "snapshot",
      quote: [
        "When you set the callback URL on your subscription, append a query parameter only you and Withings know. Withings POSTs to this exact URL, so the parameter is delivered with every notification:",
        "Your handler reads token from the incoming request and rejects any value that doesn't match the secret you configured. Combine this with the IP allowlist for defense in depth.",
      ],
    },
    respond: [
      "Your endpoint returns HTTP 2xx within a few seconds.",
      "If it does not return HTTP < 400, Withings retries the same notification in 5 cycles over about 5 hours (+10 s, +1 min, +1 h, +4 h), 2 HTTP attempts each.",
      "After 20 days of unresolved failures the subscription is auto-cancelled; missed notifications are not redelivered — backfill via the Data API using lastupdate.",
    ],
    tokenParam: "token",
    fields: {
      userid: "The user this notification concerns.",
      appli: "The notification category (1 weight & body composition, 2 temperature, 4 blood pressure & heart rate, 16 activity, 44 sleep summary, 54 ECG, among others).",
      startdate: "Start of the data range (unix epoch).",
      enddate: "End of the data range (unix epoch).",
      date: "Single date for event-based notifications (YYYY-MM-DD or unix epoch).",
      deviceid: "Source device, when applicable.",
      action: "For profile-change events: delete, unlink, or update.",
    },
    next: (body) => {
      const appli = Number(body?.appli);
      if ([1, 2, 4, 58, 61, 62, 63].includes(appli)) return ["Call Measure - Getmeas for the startdate–enddate range."];
      if (appli === 16) return ["Call Measure v2 - Getactivity, Getintradayactivity or Getworkouts."];
      if (appli === 44) return ["Call Sleep v2 - Get or Sleep v2 - Getsummary."];
      if (appli === 54) return ["Call Heart v2 - List."];
      if (appli === 55) return ["A notification-only event — no follow-up API call needed."];
      return ["Look up the appli value on Withings' “Payload and Categories” page for the call that fetches it."];
    },
  },
  {
    id: "wahoo",
    name: "Wahoo",
    integrate: "/integrate/wahoo-api",
    kind: "token",
    secretLabel: "Your webhook_token (from the app's webhook settings)",
    summary:
      "No signature. Wahoo sends the webhook_token you configured inside the JSON body; ignore any request without it.",
    headers: [],
    source: {
      url: "https://cloud-api.wahooligan.com/",
      label: "Wahoo Cloud API documentation, “Webhooks”",
      fetched: FETCHED,
      via: "snapshot",
      quote: ["Specify a token that you would like us to send. Any request that doesn't include this token should be ignored."],
    },
    respond: [
      "Return HTTP 200. Without it Wahoo retries after 30 minutes, 4 hours, 24 hours and 72 hours.",
      "Wahoo's page states no response time limit.",
      "Duplicate webhooks are possible when files are updated or deleted, and the user's token needs the offline_data scope.",
    ],
    fields: {
      event_type: "The event, e.g. workout_summary.",
      webhook_token: "The token you configured; any request that doesn't include it should be ignored.",
      user: "The Wahoo user (user.id).",
      workout_summary: "The workout summary itself — accumulated distance, duration, calories, averages and the file link.",
      "workout_summary.file": "file.url is the workout's FIT file.",
      "workout_summary.workout": "The workout the summary belongs to (id, starts, name, workout_type_id).",
    },
    next: (body) => {
      const wid = body?.workout_summary?.workout?.id ?? "{workout_id}";
      return [
        "The summary is in the body; download workout_summary.file.url for the FIT file.",
        `To re-read it later: GET https://api.wahooligan.com/v1/workouts/${wid}/workout_summary (needs the workouts_read scope).`,
      ];
    },
  },
  {
    id: "google-health",
    name: "Google Health API",
    integrate: "/google-health-api",
    kind: "token",
    secretLabel: "The endpointAuthorization secret you configured (e.g. “Bearer …”)",
    summary:
      "The documented check is the Authorization header: Google sends the endpointAuthorization secret you configured with every notification. A GOOGLE-HEALTH-API-SIGNATURE header appears in Google's examples, but the page does not say how it is computed, so this tool does not check it.",
    headers: ["authorization"],
    source: {
      url: "https://developers.google.com/health/webhooks",
      label: "Google Health API, “Webhook subscriptions”",
      fetched: FETCHED,
      via: "direct",
      quote: [
        "The value of secret is sent in the Authorization header with each notification message. You can use this token to verify that incoming requests are from the Google Health API.",
      ],
    },
    respond: [
      "Validate the Authorization header and respond to data change notifications with HTTP 204 No Content immediately; process the payload asynchronously.",
      "Any other status code, or a timeout, and the Google Health API retries later — so make handling idempotent.",
      "Verification handshake (on subscriber create or endpoint update): two POSTs with body {\"type\": \"verification\"}; answer the one carrying your Authorization header with 200 or 201, and the one without credentials with 401 or 403.",
    ],
    fields: {
      type: "\"verification\" on the endpoint-verification handshake.",
      data: "One notification. Batches arrive as a JSON array of these (up to 99 messages per batch).",
      "data.version": "Notification format version (\"1\" in Google's examples).",
      "data.clientProvidedSubscriptionName": "Your manual subscription's name, or auto-<project-number>-<subscriber-id>-<WEBHOOK_DATA_TYPE_TOKEN> for automatic subscriptions.",
      "data.healthUserId": "The Google Health API identifier of the user whose data changed; map it to their OAuth credentials via getIdentity.",
      "data.operation": "UPSERT for any addition or modification; DELETE when a user explicitly deletes data.",
      "data.dataType": "The data type that changed, e.g. steps or sleep.",
      "data.intervals": "The time intervals of the modified data (physicalTimeInterval in UTC, omitted for full-day data; civil intervals always present).",
      "data.recordId": "On deletes of identifiable data (e.g. sleep), the deleted record.",
    },
    next: (body) => {
      const first = Array.isArray(body) ? body[0] : body;
      if (first?.type === "verification") return ["Handshake only — nothing to fetch."];
      const d = first?.data ?? {};
      return [
        `GET https://health.googleapis.com/v4/users/${d.healthUserId ?? "{healthUserId}"}/dataTypes/${d.dataType ?? "{dataType}"}/dataPoints:reconcile with a filter for each interval's time range, using that user's OAuth token.`,
      ];
    },
  },
];

export function vendorById(id) {
  return WEBHOOK_VENDORS.find((v) => v.id === id);
}

/* ---------------------------------------------------------------------- *
 * Verification
 * ---------------------------------------------------------------------- */

function missing(name) {
  return { status: "error", title: `Missing ${name}`, detail: [`Paste the ${name} as it arrived.`] };
}

/** @returns {Promise<VerifyResult>} */
export async function verifyWebhook(vendorId, /** @type {WebhookInput} */ input) {
  const v = vendorById(vendorId);
  if (!v) return { status: "error", title: "Unknown vendor", detail: [String(vendorId)] };
  const method = (input.method || "POST").toUpperCase();
  const h = parseHeaders(input.headers);
  const body = input.body ?? "";
  const secret = input.secret ?? "";

  switch (v.id) {
    case "oura": {
      if (method === "GET") {
        const q = parseQuery(input.url);
        if (!("verification_token" in q) || !("challenge" in q)) return missing("verification URL (with verification_token and challenge)");
        if (!secret) return missing("verification token");
        const ok = safeEqual(q.verification_token, secret);
        return {
          status: ok ? "valid" : "invalid",
          title: ok ? "verification_token matches" : "verification_token does not match",
          detail: ok ? ["Reply with this JSON body:"] : ["Oura's sample answers a mismatch with 401."],
          reply: ok ? JSON.stringify({ challenge: q.challenge }) : undefined,
        };
      }
      const sig = h["x-oura-signature"];
      const ts = h["x-oura-timestamp"];
      if (!sig) return missing("x-oura-signature header");
      if (!ts) return missing("x-oura-timestamp header");
      if (!secret) return missing("client secret");
      const parsed = tryJson(body);
      if (!parsed.ok) return { status: "error", title: "Body is not JSON", detail: [`Oura's construction needs JSON.stringify(body): ${parsed.error}`] };
      const signed = ts + JSON.stringify(parsed.value);
      const computed = toHex(await hmacSha256(secret, signed)).toUpperCase();
      const ok = safeEqual(computed, sig.trim());
      const detail = [];
      if (!ok) {
        const rawComputed = toHex(await hmacSha256(secret, ts + body)).toUpperCase();
        if (safeEqual(rawComputed, sig.trim()))
          detail.push("The raw body (not re-serialized) does match: the sender signed the bytes as sent, which differs from Oura's sample. Check how your body was captured.");
        else detail.push("Neither the re-serialized nor the raw body matches. Check the secret, the timestamp header and that the body is exactly what arrived.");
      }
      return { status: ok ? "valid" : "invalid", title: ok ? "Signature matches" : "Signature does not match", detail, computed, received: sig.trim(), signedString: preview(signed) };
    }

    case "whoop": {
      const sig = h["x-whoop-signature"];
      const ts = h["x-whoop-signature-timestamp"];
      if (!sig) return missing("X-WHOOP-Signature header");
      if (!ts) return missing("X-WHOOP-Signature-Timestamp header");
      if (!secret) return missing("client secret");
      const signed = ts + body;
      const computed = toBase64(await hmacSha256(secret, signed));
      const ok = safeEqual(computed, sig.trim());
      const detail = [];
      const age = Date.now() - Number(ts);
      if (Number.isFinite(age)) detail.push(`Timestamp is ${Math.round(age / 1000)} s old (WHOOP sends milliseconds since epoch).`);
      if (!ok) detail.push("Sign the raw body exactly as received — a framework that parsed and re-serialized it will break the match.");
      return { status: ok ? "valid" : "invalid", title: ok ? "Signature matches" : "Signature does not match", detail, computed, received: sig.trim(), signedString: preview(signed) };
    }

    case "terra": {
      const header = h["terra-signature"];
      if (!header) return missing("terra-signature header");
      if (!secret) return missing("signing secret");
      let t = null;
      const v1 = [];
      for (const part of header.split(",")) {
        const i = part.indexOf("=");
        if (i < 0) continue;
        const k = part.slice(0, i).trim();
        const val = part.slice(i + 1).trim();
        if (k === "t") t = val;
        else if (k === "v1") v1.push(val);
      }
      if (!t || !v1.length) return { status: "error", title: "terra-signature is malformed", detail: ["Expected t=<timestamp>,v1=<signature>."] };
      const signed = `${t}.${body}`;
      const computed = toHex(await hmacSha256(secret, signed));
      let ok = false;
      for (const s of v1) if (safeEqual(computed, s.toLowerCase())) ok = true;
      const detail = [];
      const age = Date.now() / 1000 - Number(t);
      if (Number.isFinite(age)) detail.push(`Timestamp is ${Math.round(age)} s old. Terra leaves the tolerance to you: reject anything older than your window to block replays.`);
      if (!ok) detail.push("Terra requires the raw, unaltered body — make sure your framework did not re-serialize it.");
      return { status: ok ? "valid" : "invalid", title: ok ? "Signature matches" : "Signature does not match", detail, computed, received: v1.join(", "), signedString: preview(signed) };
    }

    case "polar": {
      const sig = h["polar-webhook-signature"];
      if (!sig) return missing("Polar-Webhook-Signature header");
      if (!secret) return missing("signature_secret_key");
      const computed = toHex(await hmacSha256(secret, body));
      const ok = safeEqual(computed, sig.trim().toLowerCase());
      const detail = [];
      const evH = h["polar-webhook-event"];
      const parsed = tryJson(body);
      if (evH && parsed.ok && parsed.value?.event && parsed.value.event !== evH)
        detail.push(`Polar-Webhook-Event header (${evH}) and the body's event (${parsed.value.event}) differ.`);
      if (!ok) detail.push("Polar signs the payload itself: hash the raw body exactly as received.");
      return { status: ok ? "valid" : "invalid", title: ok ? "Signature matches" : "Signature does not match", detail, computed, received: sig.trim(), signedString: preview(body) };
    }

    case "strava": {
      if (method === "GET") {
        const q = parseQuery(input.url);
        if (!("hub.challenge" in q)) return missing("validation URL (with hub.challenge)");
        if (!secret) return missing("verify_token");
        const ok = safeEqual(q["hub.verify_token"] ?? "", secret);
        const detail = [];
        if (q["hub.mode"] !== "subscribe") detail.push(`hub.mode is "${q["hub.mode"] ?? ""}"; Strava documents it as always "subscribe".`);
        if (ok) detail.push("Reply within two seconds, status 200, Content-Type application/json, with this body:");
        else detail.push("This request did not carry the verify_token you set, so it did not come from your subscription request.");
        return { status: ok ? "valid" : "invalid", title: ok ? "verify_token matches" : "verify_token does not match", detail, reply: ok ? JSON.stringify({ "hub.challenge": q["hub.challenge"] }) : undefined };
      }
      return {
        status: "unsigned",
        title: "Strava does not sign event POSTs",
        detail: [
          "Strava's webhook page documents no signature for events, so this request cannot be authenticated from its contents. Treat it as a pointer: fetch the object from the API with the owner's token, which only succeeds for data you are authorized to read.",
        ],
      };
    }

    case "withings": {
      if (!secret) return missing("callback secret");
      const q = parseQuery(input.url);
      const name = v.tokenParam;
      if (!(name in q)) return { status: "invalid", title: `No ${name} parameter on the request URL`, detail: [`Paste the full URL the notification was POSTed to (Withings delivers to the exact callback URL you subscribed, including ?${name}=…).`] };
      const ok = safeEqual(q[name], secret);
      return {
        status: ok ? "valid" : "invalid",
        title: ok ? "Callback secret matches" : "Callback secret does not match",
        detail: [
          ok
            ? "This proves the sender knew your callback URL's secret. Withings does not sign the body, so pair it with the IP allowlist it publishes (dig +short TXT ipblock-notify.withings.net)."
            : "Reject the request: the secret on the URL is not the one you configured.",
        ],
        received: q[name],
      };
    }

    case "wahoo": {
      if (!secret) return missing("webhook_token");
      const parsed = tryJson(body);
      if (!parsed.ok) return { status: "error", title: "Body is not JSON", detail: [parsed.error] };
      const tok = parsed.value?.webhook_token;
      if (tok == null) return { status: "invalid", title: "No webhook_token in the body", detail: ["Wahoo: any request that doesn't include this token should be ignored."] };
      const ok = safeEqual(String(tok), secret);
      return {
        status: ok ? "valid" : "invalid",
        title: ok ? "webhook_token matches" : "webhook_token does not match",
        detail: [ok ? "The token proves the sender knew it; Wahoo does not sign the body, so the rest of the payload is not integrity-protected." : "Ignore this request."],
        received: String(tok),
      };
    }

    case "google-health": {
      if (!secret) return missing("endpointAuthorization secret");
      const auth = h["authorization"];
      const parsed = tryJson(body);
      const isVerification = parsed.ok && parsed.value && !Array.isArray(parsed.value) && parsed.value.type === "verification";
      if (!auth) {
        return {
          status: "invalid",
          title: "No Authorization header",
          detail: [
            isVerification
              ? "This is the unauthenticated half of Google's verification handshake: respond 401 Unauthorized or 403 Forbidden."
              : "Reject it with 401 — Google sends your configured secret with every notification.",
          ],
        };
      }
      const ok = safeEqual(auth.trim(), secret.trim());
      const detail = [];
      if (ok && isVerification) detail.push("Authorized verification request: respond 200 OK or 201 Created.");
      else if (ok) detail.push("Respond 204 No Content immediately, then process asynchronously.");
      else detail.push("The Authorization value must equal the full secret string you configured, scheme included (e.g. “Bearer …”).");
      if (h["google-health-api-signature"]) detail.push("A GOOGLE-HEALTH-API-SIGNATURE header is present; Google's page does not document how it is computed, so it is not checked here.");
      return { status: ok ? "valid" : "invalid", title: ok ? "Authorization matches" : "Authorization does not match", detail, received: auth.trim() };
    }
  }
  return { status: "error", title: "No verifier", detail: [] };
}

/* ---------------------------------------------------------------------- *
 * Payload explanation
 * ---------------------------------------------------------------------- */

/**
 * Field-by-field meanings for a pasted body, using only the descriptions in
 * the vendor block (themselves taken from the cited page). Fields the page
 * does not describe are listed as such rather than guessed at.
 */
export function explainPayload(vendorId, body, url = "") {
  const v = vendorById(vendorId);
  if (!v) return { parsed: null, rows: [] };
  let parsed = null;
  if (v.id === "withings") {
    parsed = Object.fromEntries(new URLSearchParams(body.trim()));
  } else if (body.trim()) {
    const j = tryJson(body);
    parsed = j.ok ? j.value : null;
  }
  if (!parsed && (v.id === "strava" || v.id === "oura") && url) parsed = parseQuery(url);
  const rows = [];
  const visit = (obj, prefix) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
    for (const [k, val] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      const meaning = v.fields[path] ?? (prefix ? undefined : v.fields[k]);
      const shown = val !== null && typeof val === "object" ? (Array.isArray(val) ? `[${val.length} item(s)]` : "{…}") : String(val);
      rows.push({ path, value: shown, meaning: meaning ?? null });
      if (val && typeof val === "object" && !Array.isArray(val) && prefix.split(".").length < 2) visit(val, path);
    }
  };
  const root = Array.isArray(parsed) ? parsed[0] : parsed;
  visit(root, "");
  return { parsed: root, rows };
}

/* ---------------------------------------------------------------------- *
 * Self-consistent examples
 * ---------------------------------------------------------------------- */

export const DEMO_SECRET = "demo-secret-not-a-real-key";

/**
 * A request that verifies under DEMO_SECRET. Bodies follow each vendor's own
 * example (values are demo data); signatures are computed here, now, so the
 * example is internally consistent rather than copied.
 *
 * @returns {Promise<WebhookInput & { tamperField: "body" | "url" | "headers" }>}
 */
export async function buildExample(vendorId, now = Date.now()) {
  const secret = DEMO_SECRET;
  switch (vendorId) {
    case "oura": {
      const body = JSON.stringify(
        { event_type: "update", data_type: "sleep", object_id: "12345abc", event_time: "2023-01-01T08:00:00+00:00", user_id: "user123" },
        null,
        2,
      );
      const ts = String(Math.floor(now / 1000));
      const sig = toHex(await hmacSha256(secret, ts + JSON.stringify(JSON.parse(body)))).toUpperCase();
      return { method: "POST", url: "https://your-server.com/oura-webhook", headers: `x-oura-signature: ${sig}\nx-oura-timestamp: ${ts}\nContent-Type: application/json`, body, secret, tamperField: "body" };
    }
    case "whoop": {
      const body = JSON.stringify({ user_id: 456, id: "550e8400-e29b-41d4-a716-446655440000", type: "sleep.updated", trace_id: "e369c784-5100-49e8-8098-75d35c47b31b" });
      const ts = String(now);
      const sig = toBase64(await hmacSha256(secret, ts + body));
      return { method: "POST", url: "", headers: `X-WHOOP-Signature: ${sig}\nX-WHOOP-Signature-Timestamp: ${ts}\nContent-Type: application/json`, body, secret, tamperField: "body" };
    }
    case "terra": {
      const body = JSON.stringify({
        type: "healthcheck",
        status: "healthy",
        creation_timestamp: new Date(now).toISOString(),
        trend_percentage: 0,
        sent_webhooks_last_hour: 12,
      });
      const t = String(Math.floor(now / 1000));
      const sig = toHex(await hmacSha256(secret, `${t}.${body}`));
      return { method: "POST", url: "", headers: `terra-signature: t=${t},v1=${sig}\nContent-Type: application/json`, body, secret, tamperField: "body" };
    }
    case "polar": {
      const body = JSON.stringify({ event: "EXERCISE", user_id: 475, entity_id: "aQlC83", timestamp: "2018-05-15T14:22:24Z", url: "https://www.polaraccesslink.com/v3/exercises/aQlC83" });
      const sig = toHex(await hmacSha256(secret, body));
      return { method: "POST", url: "", headers: `Content-Type: application/json\nPolar-Webhook-Signature: ${sig}\nPolar-Webhook-Event: EXERCISE`, body, secret, tamperField: "body" };
    }
    case "strava": {
      return {
        method: "GET",
        url: `https://mycallbackurl.com?hub.verify_token=${encodeURIComponent(secret)}&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.mode=subscribe`,
        headers: "",
        body: "",
        secret,
        tamperField: "url",
      };
    }
    case "withings": {
      return {
        method: "POST",
        url: `https://api.example.com/withings?token=${encodeURIComponent(secret)}`,
        headers: "Content-Type: application/x-www-form-urlencoded",
        body: "userid=12345&appli=1&startdate=1530576000&enddate=1530698753",
        secret,
        tamperField: "url",
      };
    }
    case "wahoo": {
      const body = JSON.stringify(
        {
          event_type: "workout_summary",
          webhook_token: secret,
          user: { id: 60462 },
          workout_summary: {
            id: 8297,
            distance_accum: "24909.71",
            duration_total_accum: "275.20",
            heart_rate_avg: "124.23",
            file: { url: "https://server.com/4_Mile_Segment_.fit" },
            workout: { id: 56519, name: "Friday Fun", workout_type_id: 40 },
          },
        },
        null,
        2,
      );
      return { method: "POST", url: "", headers: "Content-Type: application/json", body, secret, tamperField: "body" };
    }
    case "google-health": {
      const s = `Bearer ${secret}`;
      const body = JSON.stringify(
        {
          data: {
            version: "1",
            clientProvidedSubscriptionName: "subscription-name",
            healthUserId: "health-user-id",
            operation: "UPSERT",
            dataType: "steps",
            intervals: [
              {
                physicalTimeInterval: { startTime: "2026-03-08T01:29:00Z", endTime: "2026-03-08T01:34:00Z" },
                civilIso8601TimeInterval: { startTime: "2026-03-07T17:29:00", endTime: "2026-03-07T17:34:00" },
              },
            ],
          },
        },
        null,
        2,
      );
      return { method: "POST", url: "https://your-endpoint-uri", headers: `Authorization: ${s}\nContent-Type: application/json`, body, secret: s, tamperField: "headers" };
    }
  }
  throw new Error(`No example for ${vendorId}`);
}
