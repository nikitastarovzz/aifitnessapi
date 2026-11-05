/**
 * The webhook payload library behind /webhooks: each vendor's documented
 * notification examples, the fields its documentation describes, its
 * signature scheme, response rule and retry behavior.
 *
 * Hand-written from the vendors' own pages, read on 2026-11-05: Google's
 * directly, the rest through .github/workflows/source-snapshot.yml (runs
 * 42082473757, 42082830391, 42082835603, 42082840471, 42083099437,
 * 42083448613 and 42083466915) because those hosts are blocked here. Each
 * stated fact keeps its verbatim sentence; the rows are in
 * ops/sources/evidence/webhooks.json, held in step by
 * scripts/webhook-payloads.test.mjs.
 *
 * Rules:
 *   - A payload is here only if the vendor's page shows it. `example` is the
 *     vendor's example as published (placeholders such as Wahoo's
 *     <webhook_token> and Terra's type names kept), `sample` is the same
 *     example as data where it is valid as published, and null where it is
 *     not, so the mock sender only ever sends what a vendor printed.
 *   - Field types come from the vendor's field table where it has one
 *     (`typeFrom: "documented"`) and from its example otherwise
 *     (`typeFrom: "example"`); src/lib/webhookSchemas.ts turns them into JSON
 *     Schemas and marks which is which. A field is `required` only where the
 *     vendor says so.
 *   - Retry behavior is the vendor's current wording, not a summary of an
 *     older page.
 *
 * No imports, so the tests can load it under Node's type stripping.
 */

export const WEBHOOKS_FETCHED_ON = "2026-11-05";

export type WebhookSourceId =
  | "ouraSpec"
  | "whoopWebhooks"
  | "stravaWebhooks"
  | "polar"
  | "withingsNotify"
  | "withingsContent"
  | "wahooApi"
  | "terraWebhooks"
  | "terraEvents"
  | "googleWebhooks"
  | "suuntoFaq";

export type WebhookSource = { url: string; label: string; via: "snapshot" | "direct" };

export const WEBHOOK_SOURCES: Record<WebhookSourceId, WebhookSource> = {
  ouraSpec: { url: "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json", label: "Oura API v2 OpenAPI document (1.43), “Webhooks for Real-Time Data Updates”", via: "snapshot" },
  whoopWebhooks: { url: "https://developer.whoop.com/docs/developing/webhooks/", label: "WHOOP Developer Platform, “Webhooks”", via: "snapshot" },
  stravaWebhooks: { url: "https://developers.strava.com/docs/webhooks/", label: "Strava Developers, “Webhook Events API”", via: "snapshot" },
  polar: { url: "https://www.polar.com/accesslink-api/", label: "Polar AccessLink API v3, “Accesslink webhooks” and data models", via: "snapshot" },
  withingsNotify: {
    url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-overview/",
    label: "Withings developer guide, “Notifications overview”",
    via: "snapshot",
  },
  withingsContent: {
    url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
    label: "Withings developer guide, “Notification categories”",
    via: "snapshot",
  },
  wahooApi: { url: "https://cloud-api.wahooligan.com/", label: "Wahoo Cloud API documentation, “Webhooks”", via: "snapshot" },
  terraWebhooks: { url: "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks", label: "Terra docs, “Webhooks”", via: "snapshot" },
  terraEvents: { url: "https://docs.tryterra.co/reference/health-and-fitness-api/event-types.md", label: "Terra API reference, “Event Types”", via: "snapshot" },
  googleWebhooks: { url: "https://developers.google.com/health/webhooks", label: "Google Health API, “Webhook subscriptions”", via: "direct" },
  suuntoFaq: { url: "https://apizone.suunto.com/faq", label: "Suunto API Zone, “FAQ”", via: "snapshot" },
};

export type WFact = { text: string; quote: string; source: WebhookSourceId };

export type FieldType = "string" | "integer" | "number" | "boolean" | "object" | "array";

export type PayloadField = {
  name: string;
  /** One type, or several where the vendor documents a union (WHOOP's id). */
  type: FieldType | FieldType[];
  typeFrom: "documented" | "example";
  description: string | null;
  enum?: string[];
  format?: "date-time" | "uri" | "date";
  /** Form-encoded payloads: the wire value is text; this is the type the vendor documents. */
  formType?: string;
  required?: boolean;
  properties?: PayloadField[];
  items?: PayloadField;
};

export type DocumentedPayload = {
  id: string;
  title: string;
  /** What triggers it, in the vendor's terms. */
  trigger: string;
  /** The vendor's example as published. */
  example: string;
  /** The example as data, where it is valid as published; otherwise null and the reason. */
  sample: unknown | null;
  sampleNote?: string;
  /** Request headers the vendor's example shows. */
  headers?: Record<string, string>;
  encoding: "json" | "form";
  /** Is the top level one object or an array of them (Google batches). */
  topLevel: "object" | "array";
  fields: PayloadField[];
  evidence: WFact;
};

export type WebhookVendorDoc = {
  id: string;
  name: string;
  guide: string;
  /** Anchor on /tools/webhook-verifier, where that tool covers this vendor. */
  verifier: string | null;
  signature: WFact;
  respond: WFact;
  retries: WFact;
  notes: WFact[];
  payloads: DocumentedPayload[];
  /** How public/webhooks/send-sample.mjs signs this vendor's requests; null where it cannot. */
  sender: "oura" | "whoop" | "terra" | "polar" | "strava" | "withings" | "wahoo" | "google-health" | null;
};

const str = (name: string, description: string | null, typeFrom: PayloadField["typeFrom"], extra: Partial<PayloadField> = {}): PayloadField => ({
  name,
  type: "string",
  typeFrom,
  description,
  ...extra,
});

/* ---------------------------------------------------------------------- *
 * Shared field lists
 * ---------------------------------------------------------------------- */

const OURA_DATA_TYPES = [
  "tag", "enhanced_tag", "workout", "session", "sleep", "daily_sleep", "daily_readiness", "daily_activity", "daily_spo2",
  "sleep_time", "rest_mode_period", "ring_configuration", "daily_stress", "daily_cardiovascular_age", "daily_resilience", "vo2_max",
];

const POLAR_COMMON: PayloadField[] = [
  { name: "event", type: "string", typeFrom: "documented", description: "Type of available data." },
  { name: "user_id", type: "integer", typeFrom: "documented", description: "Id of the user who has new data." },
];
const POLAR_TAIL: PayloadField[] = [
  { name: "timestamp", type: "string", format: "date-time", typeFrom: "documented", description: "Time when webhook notification is sent." },
  { name: "url", type: "string", format: "uri", typeFrom: "documented", description: "Url to the new available data." },
];

const WITHINGS_FIELDS: Record<string, PayloadField> = {
  userid: { name: "userid", type: "string", formType: "int", typeFrom: "documented", description: "The user this notification concerns." },
  appli: { name: "appli", type: "string", formType: "int", typeFrom: "documented", description: "The notification category." },
  startdate: { name: "startdate", type: "string", formType: "int (unix epoch)", typeFrom: "documented", description: "Start of the data range." },
  enddate: { name: "enddate", type: "string", formType: "int (unix epoch)", typeFrom: "documented", description: "End of the data range." },
  date: { name: "date", type: "string", formType: "string (YYYY-MM-DD) or int (unix epoch)", typeFrom: "documented", description: "Single date for event-based notifications." },
  deviceid: { name: "deviceid", type: "string", formType: "string", typeFrom: "documented", description: "Source device, when applicable." },
  action: { name: "action", type: "string", formType: "string", typeFrom: "documented", description: "For profile-change events: delete, unlink, or update.", enum: ["delete", "unlink", "update"] },
};

function withingsPayload(appli: number, title: string, trigger: string, lines: string[], quote: string): DocumentedPayload {
  const example = lines.join("\n");
  const sample = Object.fromEntries(lines.map((l) => l.split("=") as [string, string]));
  return {
    id: `appli-${appli}`,
    title: `appli ${appli}: ${title}`,
    trigger,
    example,
    sample: lines.join("&"),
    encoding: "form",
    topLevel: "object",
    fields: Object.keys(sample).map((k) => WITHINGS_FIELDS[k]),
    evidence: { text: `Withings' example for appli ${appli}.`, quote, source: "withingsContent" },
  };
}

const GOOGLE_INTERVAL: PayloadField = {
  name: "intervals[]",
  type: "object",
  typeFrom: "documented",
  description: "One time interval of the modified data.",
  properties: [
    {
      name: "physicalTimeInterval",
      type: "object",
      typeFrom: "documented",
      description: "The UTC physical time interval of the modified data. Populated for intraday metrics; omitted for daily rollups and full-day activities.",
      required: false,
      properties: [str("startTime", null, "example"), str("endTime", null, "example")],
    },
    {
      name: "civilDateTimeInterval",
      type: "object",
      typeFrom: "documented",
      description:
        "The civil (local) calendar date and time interval of the modified data, without UTC or timezone offsets. Google's field table marks it required, but its own delete examples omit it, so this schema does not require it.",
      properties: [
        { name: "startDateTime", type: "object", typeFrom: "example", description: null },
        { name: "endDateTime", type: "object", typeFrom: "example", description: null },
      ],
    },
    {
      name: "civilIso8601TimeInterval",
      type: "object",
      typeFrom: "documented",
      description: "The civil (local) time interval represented as an ISO 8601 string without UTC or timezone offsets.",
      required: true,
      properties: [str("startTime", null, "example"), str("endTime", null, "example")],
    },
  ],
};

function googleData(extra: PayloadField[] = []): PayloadField[] {
  return [
    {
      name: "data",
      type: "object",
      typeFrom: "example",
      description: "One notification.",
      properties: [
        str("version", null, "example"),
        str("clientProvidedSubscriptionName", "Your manual subscription's name, or auto-<project-number>-<subscriber-id>-<WEBHOOK_DATA_TYPE_TOKEN> for automatic subscriptions.", "documented"),
        str("healthUserId", "The Google Health API identifier for the user whose data has changed.", "documented"),
        str("operation", "UPSERT for any data addition or modification; DELETE when a user explicitly deletes data.", "documented", { enum: ["UPSERT", "DELETE"] }),
        str("dataType", null, "example"),
        { name: "intervals", type: "array", typeFrom: "documented", description: "One or more time intervals of the modified data.", items: GOOGLE_INTERVAL },
        ...extra,
      ],
    },
  ];
}

const googleCivil = (y: number, m: number, d: number, h: number, min: number) => ({ date: { year: y, month: m, day: d }, time: { hours: h, minutes: min } });

const GOOGLE_UPSERT = {
  data: {
    version: "1",
    clientProvidedSubscriptionName: "subscription-name",
    healthUserId: "health-user-id",
    operation: "UPSERT",
    dataType: "steps",
    intervals: [
      {
        physicalTimeInterval: { startTime: "2026-03-08T01:29:00Z", endTime: "2026-03-08T01:34:00Z" },
        civilDateTimeInterval: { startDateTime: googleCivil(2026, 3, 7, 17, 29), endDateTime: googleCivil(2026, 3, 7, 17, 34) },
        civilIso8601TimeInterval: { startTime: "2026-03-07T17:29:00", endTime: "2026-03-07T17:34:00" },
      },
    ],
  },
};
const GOOGLE_DELETE_SERIES = [
  {
    data: {
      version: "1",
      clientProvidedSubscriptionName: "subscription-name",
      healthUserId: "health-user-id",
      operation: "DELETE",
      dataType: "steps",
      intervals: [
        {
          physicalTimeInterval: { startTime: "2026-08-12T12:00:00Z", endTime: "2026-08-12T12:30:00Z" },
          civilIso8601TimeInterval: { startTime: "2026-08-12T12:00:00", endTime: "2026-08-12T12:30:00" },
        },
      ],
    },
  },
];
const GOOGLE_DELETE_RECORD = {
  data: {
    version: "1",
    clientProvidedSubscriptionName: "subscription-name",
    healthUserId: "health-user-id",
    operation: "DELETE",
    dataType: "sleep",
    intervals: [
      {
        physicalTimeInterval: { startTime: "2026-08-12T22:00:00Z", endTime: "2026-08-13T06:00:00Z" },
        civilIso8601TimeInterval: { startTime: "2026-08-12T22:00:00", endTime: "2026-08-13T06:00:00" },
      },
    ],
    recordId: "9875412",
  },
};
const GOOGLE_FULL_DAY = {
  data: {
    version: "1",
    clientProvidedSubscriptionName: "auto-503461148219-lindasubscriber-WEBHOOK_DATA_TYPE_STEPS",
    healthUserId: "343864966078399341",
    operation: "UPSERT",
    dataType: "steps",
    intervals: [
      {
        civilDateTimeInterval: { startDateTime: { date: { year: 2026, month: 7, day: 14 }, time: {} }, endDateTime: { date: { year: 2026, month: 7, day: 15 }, time: {} } },
        civilIso8601TimeInterval: { startTime: "2026-07-14T00:00:00", endTime: "2026-07-15T00:00:00" },
      },
    ],
  },
};

const json = (v: unknown) => JSON.stringify(v, null, 2);

/* ---------------------------------------------------------------------- *
 * Vendors
 * ---------------------------------------------------------------------- */

const OURA_SAMPLE = { event_type: "update", data_type: "sleep", object_id: "12345abc", event_time: "2023-01-01T08:00:00+00:00", user_id: "user123" };
const WHOOP_V2 = { user_id: 456, id: "550e8400-e29b-41d4-a716-446655440000", type: "sleep.updated", trace_id: "e369c784-5100-49e8-8098-75d35c47b31b" };
const WHOOP_SPEC = { user_id: 10129, id: 10235, type: "workout.updated", trace_id: "d3709ee7-104e-4f70-a928-2932964b017b" };
const WHOOP_TYPES = ["workout.updated", "workout.deleted", "sleep.updated", "sleep.deleted", "recovery.updated", "recovery.deleted"];
const WHOOP_FIELDS: PayloadField[] = [
  { name: "user_id", type: "integer", typeFrom: "documented", description: "The WHOOP User for the event" },
  {
    name: "id",
    type: ["integer", "string"],
    typeFrom: "documented",
    description: "Identifier of the object that triggered this webhook. For v2 webhooks a UUID; for v2 recovery events, the UUID of the sleep the recovery belongs to.",
  },
  { name: "type", type: "string", typeFrom: "documented", description: "The type of event that triggered this webhook", enum: WHOOP_TYPES },
  { name: "trace_id", type: "string", typeFrom: "documented", description: "Trace ID for the event that triggered this webhook" },
];
const STRAVA_SAMPLE = { aspect_type: "update", event_time: 1516126040, object_id: 1360128428, object_type: "activity", owner_id: 134815, subscription_id: 120475, updates: { title: "Messy" } };

const polarSample = (o: Record<string, unknown>) => o;
const POLAR_PAYLOADS: [string, string, string, Record<string, unknown>, PayloadField[]][] = [
  ["EXERCISE", "Exercise", "This event is sent when new exercise data is available for the user.", { event: "EXERCISE", user_id: 475, entity_id: "aQlC83", timestamp: "2018-05-15T14:22:24Z", url: "https://www.polaraccesslink.com/v3/exercises/aQlC83" }, [{ name: "entity_id", type: "string", typeFrom: "documented", description: "Id of the available data." }]],
  ["SLEEP", "Sleep", "This event is sent when new sleep data is available for the user.", { event: "SLEEP", user_id: 475, date: "2019-12-31", timestamp: "2018-05-15T14:22:24Z", url: "https://www.polaraccesslink.com/v3/users/sleep/2019-12-31" }, [{ name: "date", type: "string", typeFrom: "documented", description: "Date of the available sleep data." }]],
  ["CONTINUOUS_HEART_RATE", "Continuous heart rate", "This event is sent when new continuous heart rate data is available for the user.", { event: "CONTINUOUS_HEART_RATE", user_id: 475, date: "2022-09-30", timestamp: "2018-05-15T14:22:24Z", url: "https://www.polaraccesslink.com/v3/users/continuous-heart-rate/2022-09-30" }, [{ name: "date", type: "string", typeFrom: "documented", description: "Date of the available continuous hr data." }]],
  ["SLEEP_WISE_CIRCADIAN_BEDTIME", "SleepWise circadian bedtime", "This event is sent when new circadian bedtime data is available for the user.", { event: "SLEEP_WISE_CIRCADIAN_BEDTIME", user_id: 475, from: "2022-09-30", to: "2022-10-02", timestamp: "2022-10-02T14:22:24Z", url: "https://www.polaraccesslink.com/v3/users/sleepwise/circadian-bedtime/date?from=2022-09-30&to=2022-10-02" }, [{ name: "from", type: "string", typeFrom: "documented", description: "Start date of the available circadian bedtime data." }, { name: "to", type: "string", typeFrom: "documented", description: "End date of the available circadian bedtime data." }]],
  ["SLEEP_WISE_ALERTNESS", "SleepWise alertness", "This event is sent when new alertness data is available for the user.", { event: "SLEEP_WISE_ALERTNESS", user_id: 475, from: "2022-09-30", to: "2022-10-02", timestamp: "2022-10-02T14:22:24Z", url: "https://www.polaraccesslink.com/v3/users/sleepwise/alertness/date?from=2022-09-30&to=2022-10-02" }, [{ name: "from", type: "string", typeFrom: "documented", description: "Start date of the available alertness data." }, { name: "to", type: "string", typeFrom: "documented", description: "End date of the available alertness data." }]],
  ["ACTIVITY_SUMMARY", "Activity summary", "This event is sent when new activity summary data is available for the user.", { event: "ACTIVITY_SUMMARY", user_id: 475, date: "2022-09-30", timestamp: "2022-10-02T14:22:24Z", url: "https://www.polaraccesslink.com/v3/users/activities/2022-09-30" }, [{ name: "date", type: "string", typeFrom: "documented", description: "Date of the available activity summary data." }]],
  ["PHYSICAL_INFORMATION", "Physical information", "This event is sent when new physical information data is available for the user.", { event: "PHYSICAL_INFORMATION", user_id: 475, timestamp: "2025-12-31T14:22:24Z", url: "https://www.polaraccesslink.com/v3/users/physical-info" }, []],
];

const WAHOO_EXAMPLE = `{
"event_type" : "workout_summary" ,
"webhook_token" : <webhook_token> ,
"user" : {
"id" : 60462
},
"workout_summary" : {
"id" : 8297 ,
"ascent_accum" : "450.00" ,
"cadence_avg" : "52.00" ,
"calories_accum" : "1500.00" ,
"distance_accum" : "24909.71" ,
"duration_active_accum" : "179.00" ,
"duration_paused_accum" : "85.00" ,
"duration_total_accum" : "275.20" ,
"heart_rate_avg" : "124.23" ,
"power_bike_np_last" : "150.01" ,
"power_bike_tss_last" : "304.90" ,
"power_avg" : "94.59" ,
"speed_avg" : "10.75" ,
"work_accum" : "104148000.01" ,
"created_at" : "2018-10-23T20:43:50.000Z" ,
"updated_at" : "2018-10-23T20:43:50.000Z" ,
"file" : {
"url" : "https://server.com/4_Mile_Segment_.fit"
},
"workout" : {
"id" : 56519 ,
"starts" : "2015-08-12T09:00:00.000Z" ,
"minutes" : 12 ,
"name" : "Friday Fun" ,
"created_at" : "2018-10-23T20:41:55.000Z" ,
"updated_at" : "2018-10-23T20:41:55.000Z" ,
"plan_id" : null ,
"workout_token" : "123" ,
"workout_type_id" : 40
}
}
}`;

const WAHOO_SUMMARY_KEYS = [
  "ascent_accum", "cadence_avg", "calories_accum", "distance_accum", "duration_active_accum", "duration_paused_accum", "duration_total_accum",
  "heart_rate_avg", "power_bike_np_last", "power_bike_tss_last", "power_avg", "speed_avg", "work_accum", "created_at", "updated_at",
];

const TERRA_USER: PayloadField = { name: "user", type: "object", typeFrom: "documented", description: "The Terra user (Terra's User model)." };

function terraSketch(id: string, title: string, trigger: string, example: string, fields: PayloadField[], quote: string): DocumentedPayload {
  return {
    id,
    title,
    trigger,
    example,
    sample: null,
    sampleNote: "Terra documents this event as a format with type names (String, Number, User) rather than values, so there is no sample to send.",
    encoding: "json",
    topLevel: "object",
    fields,
    evidence: { text: `Terra's format for the ${id} event.`, quote, source: "terraEvents" },
  };
}

export const WEBHOOK_VENDORS: WebhookVendorDoc[] = [
  {
    id: "oura",
    name: "Oura",
    guide: "/integrate/oura-api",
    verifier: "oura",
    signature: {
      text: "HMAC-SHA256 keyed by your client secret over the x-oura-timestamp value followed by JSON.stringify(body), hex, upper-case, in x-oura-signature.",
      quote: "hmac.update(timestamp + JSON.stringify(body));",
      source: "ouraSpec",
    },
    respond: { text: "Respond with a 2xx in under 10 seconds and process the event asynchronously. Before events flow, Oura verifies the callback with a GET carrying verification_token and challenge; echo the challenge as JSON.", quote: "Respond quickly (under 10 seconds) with a 2xx status", source: "ouraSpec" },
    retries: { text: "10 retries each for 4xx responses, 5xx responses and timeouts, for about an hour; a 410 response cancels the subscription.", quote: "Oura will retry webhook deliveries for about an hour if your server doesn't respond properly.", source: "ouraSpec" },
    notes: [
      { text: "4xx responses are retried too.", quote: "For 4xx responses: 10 retries", source: "ouraSpec" },
      { text: "One subscription per event_type and data_type pair; the event carries the object_id to fetch.", quote: "Use the object_id to fetch the complete data via the API", source: "ouraSpec" },
    ],
    payloads: [
      {
        id: "event",
        title: "Data event",
        trigger: "Oura sends a POST to your callback URL when subscribed data changes (the example: a user syncs new sleep data).",
        example: json(OURA_SAMPLE),
        sample: OURA_SAMPLE,
        headers: { "x-oura-signature": "HMAC_SIGNATURE", "x-oura-timestamp": "1234567890" },
        encoding: "json",
        topLevel: "object",
        fields: [
          str("event_type", "create, update or delete (Oura's WebhookOperation).", "documented", { enum: ["create", "update", "delete"] }),
          str("data_type", "One of the data types partners can subscribe to (Oura's ExtApiV2DataType).", "documented", { enum: OURA_DATA_TYPES }),
          str("object_id", "Use it to fetch the complete record from the API.", "example"),
          str("event_time", null, "example"),
          str("user_id", null, "example"),
        ],
        evidence: { text: "Oura's example event is a POST with x-oura-signature and x-oura-timestamp headers.", quote: "x-oura-timestamp: 1234567890", source: "ouraSpec" },
      },
    ],
    sender: "oura",
  },
  {
    id: "whoop",
    name: "WHOOP",
    guide: "/integrate/whoop-api",
    verifier: "whoop",
    signature: {
      text: "Base64 of HMAC-SHA256, keyed by your client secret, over the X-WHOOP-Signature-Timestamp value (milliseconds since epoch) followed by the raw body, in X-WHOOP-Signature.",
      quote: "calculated_signature_string = base64Encode(HMACSHA256(timestamp_header + raw_http_request_body, client_secret))",
      source: "whoopWebhooks",
    },
    respond: { text: "Return a 2XX, ideally within a second, and process on a queue. Every event type goes to every configured URL; answer 2XX to the ones you ignore.", quote: "We recommend designing your webhook API to return a successful 2XX status code within a second", source: "whoopWebhooks" },
    retries: { text: "Five retries over about one hour; anything but a 2XX, or no response before the timeout, counts as a failure.", quote: "WHOOP will retry webhook delivery for failed webhook requests five times over the course of about one hour", source: "whoopWebhooks" },
    notes: [
      { text: "Duplicates happen: deduplicate on trace_id.", quote: "You can make use of the trace_id field in the webhook to detect duplicate webhooks.", source: "whoopWebhooks" },
      { text: "Creates arrive as update events.", quote: "When workouts, sleeps, or recoveries are created those events are published as an \"update\" event.", source: "whoopWebhooks" },
      { text: "v1 webhooks are no longer published; v2 uses UUIDs.", quote: "v1 webhooks are no longer published.", source: "whoopWebhooks" },
    ],
    payloads: [
      {
        id: "v2-sleep-updated",
        title: "v2 example: sleep.updated",
        trigger: "User 456 records a sleep and WHOOP posts to your v2 webhook endpoint; you then GET v2/activity/sleep/{id}.",
        example: json(WHOOP_V2),
        sample: WHOOP_V2,
        encoding: "json",
        topLevel: "object",
        fields: WHOOP_FIELDS,
        evidence: { text: "WHOOP's v2 example request flow.", quote: "WHOOP assigns UUID 550e8400-e29b-41d4-a716-446655440000 to this sleep.", source: "whoopWebhooks" },
      },
      {
        id: "spec-workout-updated",
        title: "Field-table example: workout.updated",
        trigger: "The example beside WHOOP's field table, with integer ids (the table documents id as int64 or string).",
        example: json(WHOOP_SPEC),
        sample: WHOOP_SPEC,
        encoding: "json",
        topLevel: "object",
        fields: WHOOP_FIELDS,
        evidence: { text: "WHOOP documents id as an integer (v1) or a UUID (v2).", quote: "For v1 webhooks: integer ID. For v2 webhooks: UUID.", source: "whoopWebhooks" },
      },
    ],
    sender: "whoop",
  },
  {
    id: "strava",
    name: "Strava",
    guide: "/integrate/strava-api",
    verifier: "strava",
    signature: {
      text: "No signature is documented for event POSTs. Subscription validation is a GET with hub.mode, hub.challenge and hub.verify_token; echo hub.challenge as JSON.",
      quote: "The query string of this GET request will contain a \"hub.challenge\" field that you must use to validate your callback address.",
      source: "stravaWebhooks",
    },
    respond: { text: "Acknowledge each POST with 200 OK within two seconds; do further work asynchronously.", quote: "The subscription callback endpoint must acknowledge the POST of each new event with a status code of 200 OK within two seconds.", source: "stravaWebhooks" },
    retries: { text: "Retried up to a total of three attempts if a 200 is not returned.", quote: "Event pushes are retried (up to a total of three attempts) if a 200 is not returned.", source: "stravaWebhooks" },
    notes: [
      { text: "One subscription per application, covering every athlete who authorized it.", quote: "Each application may only have one subscription", source: "stravaWebhooks" },
      { text: "One save can produce several events.", quote: "action by the athlete can result in multiple webhook events.", source: "stravaWebhooks" },
    ],
    payloads: [
      {
        id: "activity-update",
        title: "Activity update",
        trigger: "Sent when an activity is created or deleted, when its title, type or privacy changes, and when an athlete revokes access (updates then holds \"authorized\": \"false\").",
        example: json(STRAVA_SAMPLE),
        sample: STRAVA_SAMPLE,
        encoding: "json",
        topLevel: "object",
        fields: [
          str("object_type", "Always either \"activity\" or \"athlete.\"", "documented", { enum: ["activity", "athlete"] }),
          { name: "object_id", type: "integer", typeFrom: "documented", description: "For activity events, the activity's ID. For athlete events, the athlete's ID." },
          str("aspect_type", "Always \"create,\" \"update,\" or \"delete.\"", "documented", { enum: ["create", "update", "delete"] }),
          { name: "updates", type: "object", typeFrom: "documented", description: "For activity updates: title, type and private. For app deauthorization events: always \"authorized\": \"false\"." },
          { name: "owner_id", type: "integer", typeFrom: "documented", description: "The athlete's ID." },
          { name: "subscription_id", type: "integer", typeFrom: "documented", description: "The push subscription ID that is receiving this event." },
          { name: "event_time", type: "integer", typeFrom: "documented", description: "The time that the event occurred." },
        ],
        evidence: { text: "Strava's example event (Example Request).", quote: "For activity events, the activity's ID. For athlete events, the athlete's ID.", source: "stravaWebhooks" },
      },
    ],
    sender: "strava",
  },
  {
    id: "polar",
    name: "Polar AccessLink",
    guide: "/integrate/polar-api",
    verifier: "polar",
    signature: {
      text: "HMAC-SHA256 of the payload, keyed by the signature_secret_key returned once when you create the webhook, hex, in Polar-Webhook-Signature; the event type is in Polar-Webhook-Event.",
      quote: "Hash-based message authentication code (HMAC SHA-256) is used to sign every webhook payload Accesslink sends.",
      source: "polar",
    },
    respond: { text: "Answer with 200. The PING sent when a webhook is created or its URL changes must get 200 OK, or the change is not made.", quote: "Webhook delivery expects response 200 from remote endpoint.", source: "polar" },
    retries: {
      text: "No retry schedule is documented. A webhook whose deliveries fail for seven days is deactivated; re-enable it with the activate endpoint, which pings the URL again.",
      quote: "Webhook will be automatically deactivated if push notifications have not been successful for a period of seven (7) days.",
      source: "polar",
    },
    notes: [{ text: "A client application can have only one webhook.", quote: "Client application can only have one webhook registered.", source: "polar" }],
    payloads: [
      {
        id: "PING",
        title: "PING",
        trigger: "Sent as an HTTP POST when a webhook is created or modified, to verify the URL.",
        example: json({ timestamp: "2018-05-15T14:22:24Z", event: "PING" }),
        sample: { timestamp: "2018-05-15T14:22:24Z", event: "PING" },
        headers: { "Polar-Webhook-Event": "PING" },
        encoding: "json",
        topLevel: "object",
        fields: [{ name: "timestamp", type: "string", format: "date-time", typeFrom: "example", description: null }, { name: "event", type: "string", typeFrom: "example", description: null }],
        evidence: { text: "Polar's ping message.", quote: "AccessLink sends ping message as HTTP POST to callback URL being registered when creating new or modifying webhook.", source: "polar" },
      },
      ...POLAR_PAYLOADS.map(([event, title, trigger, sample, extra]): DocumentedPayload => ({
        id: event,
        title,
        trigger,
        example: json(sample),
        sample: polarSample(sample),
        headers: { "Polar-Webhook-Event": event },
        encoding: "json",
        topLevel: "object",
        fields: [...POLAR_COMMON, ...extra, ...POLAR_TAIL],
        evidence: { text: `Polar's payload example for ${event}.`, quote: `Payload example for webhook payload for event type ${event}.`, source: "polar" },
      })),
    ],
    sender: "polar",
  },
  {
    id: "withings",
    name: "Withings",
    guide: "/integrate/withings-api",
    verifier: "withings",
    signature: {
      text: "No body signature. Append a secret query parameter to the callback URL (Withings' example: ?token=<random-secret>) and check it, plus an allowlist of the IP ranges Withings publishes as DNS TXT records.",
      quote: "Your handler reads token from the incoming request and rejects any value that doesn't match the secret you configured.",
      source: "withingsNotify",
    },
    respond: { text: "An application/x-www-form-urlencoded POST; return HTTP 2xx within a few seconds, then fetch the data from the Data API.", quote: "Your endpoint returns HTTP 2xx within a few seconds.", source: "withingsNotify" },
    retries: {
      text: "If your endpoint does not return HTTP < 400: 5 retry cycles over about 5 hours (+10 s, +1 min, +1 h, +4 h), 2 HTTP attempts each. After 20 days of unresolved failures the subscription is canceled; missed notifications are not redelivered.",
      quote: "Each cycle does 2 HTTP attempts (10 attempts total).",
      source: "withingsNotify",
    },
    notes: [
      { text: "Missed notifications are not redelivered: backfill with lastupdate.", quote: "Missed notifications are not redelivered.", source: "withingsNotify" },
      { text: "Typical delay is under 2 minutes, with no real-time SLA on the standard plan.", quote: "Withings does not commit to a real-time SLA on the standard plan.", source: "withingsNotify" },
    ],
    payloads: [
      withingsPayload(1, "Weight & body composition", "A new weight or body composition measurement was recorded by a Withings scale.", ["userid=12345", "appli=1", "startdate=1530576000", "enddate=1530698753"], "userid=12345 appli=1 startdate=1530576000 enddate=1530698753"),
      withingsPayload(4, "Blood pressure & heart rate", "A new blood pressure measurement (and heart rate, when supported) was recorded.", ["userid=12345", "appli=4", "startdate=1530576000", "enddate=1530576120"], "userid=12345 appli=4 startdate=1530576000 enddate=1530576120"),
      withingsPayload(16, "Activity", "New activity data is available — steps, distance, calories, intensity, or workouts.", ["userid=12345", "appli=16", "date=2018-07-02"], "userid=12345 appli=16 date=2018-07-02"),
      withingsPayload(44, "Sleep summary", "New sleep data is available — duration, sleep state, deep/light state duration (no REM), and wakeup counts.", ["userid=12345", "appli=44", "startdate=1530576000", "enddate=1530604800"], "userid=12345 appli=44 startdate=1530576000 enddate=1530604800"),
      withingsPayload(54, "ECG measurement", "A new ECG recording was completed.", ["userid=12345", "appli=54", "startdate=1530576000", "enddate=1530576030"], "userid=12345 appli=54 startdate=1530576000 enddate=1530576030"),
      withingsPayload(55, "ECG measurement failed", "An ECG recording was attempted but failed; notification only.", ["userid=12345", "appli=55", "date=1530576000", "deviceid=abc123"], "userid=12345 appli=55 date=1530576000 deviceid=abc123"),
      withingsPayload(50, "Bed in", "The user lay down on the bed (Withings Sleep sensor); notification only.", ["userid=12345", "appli=50", "date=1530576000", "deviceid=abc123"], "userid=12345 appli=50 date=1530576000 deviceid=abc123"),
      withingsPayload(46, "User profile change", "The user account was deleted, unlinked from your app, or updated; notification only.", ["userid=12345", "appli=46", "action=update"], "userid=12345 appli=46 action=update"),
    ],
    sender: "withings",
  },
  {
    id: "wahoo",
    name: "Wahoo",
    guide: "/integrate/wahoo-api",
    verifier: "wahoo",
    signature: {
      text: "No signature. Wahoo sends the webhook_token you set in the app's webhook settings inside the JSON body; ignore any request without it.",
      quote: "Specify a token that you would like us to send. Any request that doesn't include this token should be ignored.",
      source: "wahooApi",
    },
    respond: { text: "An HTTP POST with Content-Type application/json; return HTTP 200. The users need the offline_data scope.", quote: "API Calls will be sent via HTTP POST with the HTTP header Content-Type: application/json", source: "wahooApi" },
    retries: { text: "Without an HTTP 200, retried after 30 minutes, 4 hours, 24 hours and 72 hours.", quote: "If we do not receive an HTTP 200 response code we will retry the api call on the following retry schedule:", source: "wahooApi" },
    notes: [{ text: "Duplicates are possible when files are updated or deleted.", quote: "It is possible for duplicate webhooks to be made when files are updated or deleted.", source: "wahooApi" }],
    payloads: [
      {
        id: "workout_summary",
        title: "Workout summary",
        trigger: "Sent when a workout summary is available for a user whose token has the offline_data scope.",
        example: WAHOO_EXAMPLE,
        sample: null,
        sampleNote: "Wahoo's example has the placeholder <webhook_token> where the token goes; the mock sender puts your token there and sends the rest unchanged.",
        encoding: "json",
        topLevel: "object",
        fields: [
          str("event_type", null, "example"),
          str("webhook_token", "The token you configured; any request without it should be ignored.", "documented"),
          { name: "user", type: "object", typeFrom: "example", description: null, properties: [{ name: "id", type: "integer", typeFrom: "example", description: null }] },
          {
            name: "workout_summary",
            type: "object",
            typeFrom: "example",
            description: null,
            properties: [
              { name: "id", type: "integer", typeFrom: "example", description: null },
              ...WAHOO_SUMMARY_KEYS.map((k) => str(k, null, "example")),
              { name: "file", type: "object", typeFrom: "example", description: null, properties: [str("url", null, "example")] },
              {
                name: "workout",
                type: "object",
                typeFrom: "example",
                description: null,
                properties: [
                  { name: "id", type: "integer", typeFrom: "example", description: null },
                  str("starts", null, "example"),
                  { name: "minutes", type: "integer", typeFrom: "example", description: null },
                  str("name", null, "example"),
                  str("created_at", null, "example"),
                  str("updated_at", null, "example"),
                  str("workout_token", null, "example"),
                  { name: "workout_type_id", type: "integer", typeFrom: "example", description: null },
                ],
              },
            ],
          },
        ],
        evidence: { text: "Wahoo's sample workout summary webhook message.", quote: "Sample Workout Summary Webhook Message", source: "wahooApi" },
      },
    ],
    sender: "wahoo",
  },
  {
    id: "terra",
    name: "Terra",
    guide: "/integrate/terra-api",
    verifier: "terra",
    signature: {
      text: "terra-signature: t=<timestamp>,v1=<signature>; HMAC-SHA256 keyed by the webhook's signing secret over the timestamp, a \".\" and the raw body. Ignore schemes other than v1.",
      quote: "Compute an HMAC with the SHA256 hash function. Use the endpoint’s signing secret as the key, and use the signed_payload string as the message.",
      source: "terraWebhooks",
    },
    respond: { text: "Respond within 8 seconds; accept immediately (return 200) and process asynchronously. Sustained timeouts, 5xx and repeated 4xx can trip a per-destination circuit breaker.", quote: "Terra waits 8 seconds for your server to respond before considering the request timed out.", source: "terraWebhooks" },
    retries: {
      text: "Retried automatically with exponential backoff for several hours; Terra says the number and timing of retries may change without notice. After the retry budget is spent the event is dropped, with no notification.",
      quote: "Terra retries the delivery automatically with exponential backoff for several hours.",
      source: "terraWebhooks",
    },
    notes: [
      { text: "Do not depend on a specific retry schedule.", quote: "The exact number and timing of retries may change without notice, so don't depend on a specific schedule.", source: "terraWebhooks" },
      { text: "Each webhook has its own signing secret; rotating one re-signs its retries with the new secret.", quote: "Each webhook has its own signing secret.", source: "terraWebhooks" },
      { text: "Every event carries a terra-reference header tying it to the request that caused it.", quote: "every event sent from Terra will contain a `terra-reference` header", source: "terraEvents" },
    ],
    payloads: [
      {
        id: "s3_payload",
        title: "S3 payload (ping mode)",
        trigger: "New data records are available and the destination uses ping mode: download url before it expires and process it as a normal data event.",
        example: json({ status: "success", type: "s3_payload", url: "https://example.com", expires_in: 300, user_id: "0d09d3a4-f6e8-4f1c-9a3e-2b6c1d5e7f80", reference_id: "your-user-ref-123" }),
        sample: { status: "success", type: "s3_payload", url: "https://example.com", expires_in: 300, user_id: "0d09d3a4-f6e8-4f1c-9a3e-2b6c1d5e7f80", reference_id: "your-user-ref-123" },
        encoding: "json",
        topLevel: "object",
        fields: [
          str("status", null, "example"),
          str("type", null, "example"),
          str("url", "A pre-signed link to the full data payload. Download it with a GET request.", "documented", { format: "uri" }),
          { name: "expires_in", type: "integer", typeFrom: "documented", description: "URL validity in seconds (300 = 5 minutes)." },
          str("user_id", "The Terra user the payload belongs to.", "documented"),
          str("reference_id", "The reference_id you set when connecting that user (empty if none was set).", "documented"),
        ],
        evidence: { text: "Terra's S3 upload event format.", quote: "`user_id` is the Terra user the payload belongs to and `reference_id` is the `reference_id` you set when connecting that user (empty if none was set).", source: "terraEvents" },
      },
      terraSketch(
        "healthcheck",
        "Healthcheck",
        "Sent periodically to your destination to confirm its health status.",
        `{\n  "type": "healthcheck",\n  "status": String,\n  "creation_timestamp": String,\n  "trend_percentage": Number,\n  "sent_webhooks_last_hour": Number\n}`,
        [str("type", null, "documented", { enum: ["healthcheck"] }), str("status", null, "documented"), str("creation_timestamp", null, "documented"), { name: "trend_percentage", type: "number", typeFrom: "documented", description: null }, { name: "sent_webhooks_last_hour", type: "number", typeFrom: "documented", description: null }],
        "This will periodically be sent to your",
      ),
      terraSketch(
        "auth",
        "Device account connection success",
        "A user just finished connecting a device account to your app; save the user and link it with reference_id.",
        `{\n  "type": "auth",\n  "user": User,\n  "status": "success",\n  "reference_id": String,\n  "widget_session_id": String\n}`,
        [str("type", null, "documented", { enum: ["auth"] }), TERRA_USER, str("status", null, "documented"), str("reference_id", null, "documented"), str("widget_session_id", null, "documented")],
        "A user just finished going through connecting a device account to your app",
      ),
      terraSketch(
        "deauth",
        "Device account disconnection",
        "A user just disconnected their device account from your app.",
        `{\n  "type": "deauth",\n  "user": User,\n  "status": "success",\n  "message": "User has deauthenticated"\n}`,
        [str("type", null, "documented", { enum: ["deauth"] }), TERRA_USER, str("status", null, "documented"), str("message", null, "documented")],
        "A user just disconnected their device account from your app",
      ),
      terraSketch(
        "activity",
        "Activity data event",
        "New activity records are available for the user; overwrite earlier records by metadata.summary_id.",
        `{\n  "data": [Activity],\n  "user": User,\n  "type": "activity",\n  "version": String\n}`,
        [{ name: "data", type: "array", typeFrom: "documented", description: "Activity records (Terra's Activity model)." }, TERRA_USER, str("type", null, "documented", { enum: ["activity"] }), str("version", null, "documented")],
        "New activity records are available for the",
      ),
    ],
    sender: "terra",
  },
  {
    id: "google-health",
    name: "Google Health API",
    guide: "/google-health-api",
    verifier: "google-health",
    signature: {
      text: "Google sends the endpointAuthorization secret you configured in the Authorization header. It also signs the raw JSON with Tink (ECDSA P-256, SHA-256), base64 in GOOGLE-HEALTH-API-SIGNATURE, keys rotated every 30 days and published as a JSON keyset.",
      quote: "the raw JSON payload of every outgoing webhook notification is signed with a private key using Tink's PublicKeySign",
      source: "googleWebhooks",
    },
    respond: {
      text: "Validate the Authorization header and respond 204 No Content immediately; process asynchronously. On subscriber create or endpoint change, two POSTs with {\"type\": \"verification\"}: answer the authorized one with 200 or 201 and the unauthenticated one with 401 or 403.",
      quote: "respond to data change notifications with an HTTP 204 No Content status code immediately",
      source: "googleWebhooks",
    },
    retries: {
      text: "Anything other than 204, or a timeout, is retried later. Pending notifications are stored for up to 7 days and retried with exponential backoff; older ones are discarded.",
      quote: "the Google Health API stores pending notifications for up to 7 days and retries delivery with exponential backoff",
      source: "googleWebhooks",
    },
    notes: [
      { text: "Updates are batched as a JSON array, up to 99 messages per batch, possibly across users and data types.", quote: "The system is configured to send out a maximum of 99 messages per batch", source: "googleWebhooks" },
      { text: "Retries can duplicate notifications: make handling idempotent.", quote: "We recommend making your notification handling logic idempotent", source: "googleWebhooks" },
      { text: "No notification is sent for revoked permissions or deleted accounts.", quote: "Webhook notifications are not sent for system-level deletion events", source: "googleWebhooks" },
    ],
    payloads: [
      {
        id: "upsert",
        title: "Upsert (time-series data)",
        trigger: "Sent for any data addition or modification.",
        example: json(GOOGLE_UPSERT),
        sample: GOOGLE_UPSERT,
        headers: { Authorization: "Bearer example-secret-token", "GOOGLE-HEALTH-API-SIGNATURE": "signature-value", "Content-Type": "application/json" },
        encoding: "json",
        topLevel: "object",
        fields: googleData(),
        evidence: { text: "Google's notification format.", quote: "When a webhook notification is triggered, the Google Health API sends an HTTPS POST request to your subscriber endpoint with the following format:", source: "googleWebhooks" },
      },
      {
        id: "delete-time-series",
        title: "Delete (time-series data)",
        trigger: "Sent when a user explicitly deletes data. Google's example arrives as an array.",
        example: json(GOOGLE_DELETE_SERIES),
        sample: GOOGLE_DELETE_SERIES,
        encoding: "json",
        topLevel: "array",
        fields: googleData(),
        evidence: { text: "DELETE is sent when a user explicitly deletes data.", quote: "Sent when a user explicitly deletes data", source: "googleWebhooks" },
      },
      {
        id: "delete-identifiable",
        title: "Delete (identifiable data)",
        trigger: "A delete of identifiable data such as a sleep carries the deleted record's recordId.",
        example: json(GOOGLE_DELETE_RECORD),
        sample: GOOGLE_DELETE_RECORD,
        encoding: "json",
        topLevel: "object",
        fields: googleData([str("recordId", null, "example")]),
        evidence: { text: "Google's identifiable-data delete example.", quote: "Delete (identifiable data)", source: "googleWebhooks" },
      },
      {
        id: "full-day",
        title: "Full-day activity",
        trigger: "Full-day activities and daily aggregates omit physicalTimeInterval; rely on the civil fields.",
        example: json(GOOGLE_FULL_DAY),
        sample: GOOGLE_FULL_DAY,
        encoding: "json",
        topLevel: "object",
        fields: googleData(),
        evidence: { text: "Google's full-day example omits physicalTimeInterval.", quote: "For full-day activities and daily aggregates, the physicalTimeInterval field is intentionally omitted from the notification payload.", source: "googleWebhooks" },
      },
      {
        id: "verification",
        title: "Endpoint verification",
        trigger: "Two POSTs when you create a subscriber or change its endpoint: one with your Authorization header, one without.",
        example: json({ type: "verification" }),
        sample: { type: "verification" },
        encoding: "json",
        topLevel: "object",
        fields: [str("type", null, "documented", { enum: ["verification"] })],
        evidence: { text: "The verification handshake body.", quote: "The service sends two automated POST requests to your endpoint URI", source: "googleWebhooks" },
      },
    ],
    sender: "google-health",
  },
  {
    id: "suunto",
    name: "Suunto",
    guide: "/integrate/suunto-api",
    verifier: null,
    signature: {
      text: "Not documented on Suunto's FAQ. The webhook address is set in your app's OAuth settings in Suunto API Zone and must be publicly reachable.",
      quote: "You can setup the webhook in your app oauth settings under your profile in Suunto Apizone",
      source: "suuntoFaq",
    },
    respond: { text: "Fetch the workout as soon as the notification arrives; the FAQ states no response code or time limit.", quote: "Based on this information you should then fetch the workout immediately to keep your system up to date.", source: "suuntoFaq" },
    retries: { text: "Not documented on the pages read here.", quote: "Use the webhook method to get a notification about new workouts.", source: "suuntoFaq" },
    notes: [{ text: "Workouts only: there is no notification for daily activity.", quote: "There is no webhook / notification model in place for activity data.", source: "suuntoFaq" }],
    payloads: [],
    sender: null,
  },
];

/** Suunto documents its notification's fields but shows no example payload. */
export const SUUNTO_FIELDS: WFact = {
  text: "Two parameters in the POST: username (find the user's token by the JWT's user claim) and workoutid (fetch the workout's FIT file). No example, encoding or signature is shown, so there is no schema or sample here.",
  quote: "Suunto partner notification has two parameters passed in the POST request username and workoutid.",
  source: "suuntoFaq",
};

/** Vendors without a section, and why. */
export const WEBHOOKS_NOT_COVERED: { name: string; reason: string; guide: string }[] = [
  { name: "Garmin", guide: "/integrate/garmin-api", reason: "No public Garmin page read for this library shows a push payload." },
  { name: "COROS", guide: "/integrate/coros-api", reason: "COROS's help center lists webhook push as part of its Partner API but shows no payload." },
  { name: "Dexcom", guide: "/integrate/dexcom-api", reason: "Dexcom's webhook documentation was not read for this library, so nothing is reproduced." },
  { name: "Fitbit Web API", guide: "/fitbit-api-shutdown", reason: "Google says the legacy Fitbit Web API is turned off on November 2, 2026; its successor's notifications are under the Google Health API above." },
];

export function webhookVendor(id: string): WebhookVendorDoc | undefined {
  return WEBHOOK_VENDORS.find((v) => v.id === id);
}
