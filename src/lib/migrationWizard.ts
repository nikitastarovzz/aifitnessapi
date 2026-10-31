/**
 * Decision logic for the Google Fit / Fitbit Web API migration wizard
 * (src/components/MigrationWizard.tsx, on /google-fit-shutdown and
 * /fitbit-api-shutdown).
 *
 * Every rule below is copied from Google's own pages, read on FETCHED_ON, and
 * each result carries the sentence it rests on, verbatim. Where Google's pages
 * do not cover a combination (a backend running an Android-only Fit API, a
 * deadline for an existing Health Connect integration), the result says
 * "Google doesn't state this" instead of filling the gap.
 *
 * Self-contained on purpose — no imports — so `node --test` can load it with
 * Node's type stripping (scripts/migration-wizard.test.mjs) without the
 * bundler's path aliases. Keep it to erasable TypeScript: no enums, no
 * namespaces, no parameter properties.
 *
 * Re-verify by re-reading the four SOURCES and checking every `quote` still
 * appears on its page; then move FETCHED_ON. Never move it without that.
 */

export const FETCHED_ON = "2026-10-31";

export type SourceKey = "fit" | "about" | "migration" | "dataTypes";

export const SOURCES: Record<SourceKey, { title: string; url: string; lastUpdated: string }> = {
  fit: {
    title: "Google's Fit migration guide (developer.android.com)",
    url: "https://developer.android.com/health-and-fitness/health-connect/migration/fit",
    lastUpdated: "2026-09-10",
  },
  about: {
    title: "Google's Google Health API overview (developers.google.com/health/about)",
    url: "https://developers.google.com/health/about",
    lastUpdated: "2026-10-23",
  },
  migration: {
    title: "Google's Fitbit Web API to Google Health API migration guide",
    url: "https://developers.google.com/health/migration",
    lastUpdated: "2026-09-28",
  },
  dataTypes: {
    title: "Google's Google Health API data-types page",
    url: "https://developers.google.com/health/data-types",
    lastUpdated: "2026-10-06",
  },
};

export type Api =
  | "fit-recording"
  | "fit-history"
  | "fit-session"
  | "fit-sensor"
  | "fit-goals"
  | "fit-ble"
  | "fit-rest"
  | "fit-app"
  | "fitbit-web"
  | "health-connect";

export type Runtime = "phone" | "backend" | "watch";
export type DataKind = "steps" | "exercise" | "sleep" | "heart-rate" | "weight" | "other";
export type Mode = "read" | "write";

export const API_OPTIONS: { value: Api; label: string; hint: string }[] = [
  { value: "fit-recording", label: "Google Fit Recording API", hint: "Android subscriptions that record steps and other sensor data" },
  { value: "fit-history", label: "Google Fit History API", hint: "Android reads, inserts, updates and deletes in the Fit store" },
  { value: "fit-session", label: "Google Fit Session API", hint: "Android workout and activity sessions" },
  { value: "fit-sensor", label: "Google Fit Sensor API", hint: "Real-time raw sensor data" },
  { value: "fit-goals", label: "Google Fit Goals API", hint: "Users' step and Heart Points goals" },
  { value: "fit-ble", label: "Google Fit BLE API", hint: "Finding Bluetooth LE devices and inserting their data" },
  { value: "fit-rest", label: "Google Fit REST API", hint: "HTTP calls to the Fit store, usually from a server" },
  { value: "fit-app", label: "A “Connect to Google Fit” option in your app", hint: "Users link the Google Fit app; you appear in Works with Google Fit" },
  { value: "fitbit-web", label: "Fitbit Web API", hint: "api.fitbit.com with Fitbit OAuth tokens" },
  { value: "health-connect", label: "Health Connect (already)", hint: "You integrated Health Connect and want to know if you are done" },
];

export const RUNTIME_OPTIONS: { value: Runtime; label: string }[] = [
  { value: "phone", label: "An Android phone app" },
  { value: "backend", label: "A backend or web service" },
  { value: "watch", label: "A Wear OS watch app" },
];

export const DATA_OPTIONS: { value: DataKind; label: string }[] = [
  { value: "steps", label: "Steps" },
  { value: "exercise", label: "Workouts / sessions" },
  { value: "sleep", label: "Sleep" },
  { value: "heart-rate", label: "Heart rate" },
  { value: "weight", label: "Weight" },
  { value: "other", label: "Something else" },
];

export const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: "read", label: "Only read data" },
  { value: "write", label: "Write data too" },
];

export type Destination =
  | "health-connect"
  | "health-services"
  | "google-health-api"
  | "android-sensors"
  | "android-bluetooth"
  | "no-replacement"
  | "keep-health-connect"
  | "unstated";

export const DESTINATION_LABELS: Record<Destination, string> = {
  "health-connect": "Health Connect",
  "health-services": "Health Services on Wear OS",
  "google-health-api": "The Google Health API",
  "android-sensors": "Android Sensors framework or Fused Location Provider",
  "android-bluetooth": "Android Bluetooth APIs, directly",
  "no-replacement": "No replacement API",
  "keep-health-connect": "Keep Health Connect (optionally add the Google Health API)",
  unstated: "Google doesn't state this",
};

export type Quote = { source: SourceKey; text: string };
export type Link = { href: string; label: string };

export type WizardAnswers = { api: Api; runtime: Runtime; data: DataKind[]; mode: Mode };

export type WizardResult = {
  destinations: Destination[];
  /** One sentence in our words: what the quotes below say for this case. */
  summary: string;
  /** The rule's basis, verbatim from Google. */
  rule: Quote[];
  deadline: { label: string; detail: string; quote: Quote | null };
  steps: string[];
  notes: { text: string; quote?: Quote }[];
  reading: Link[];
  sources: SourceKey[];
};

/* ------------------------------------------------------------------ quotes */
// Each string is copied from the page named by its source key on FETCHED_ON.
// Table cells are joined with " — " and marked as table rows in `text`.

export const Q = {
  fitCaution: {
    source: "fit",
    text: "The Google Fit API (including the REST API) will only be supported until the end of 2026. We recommend migrating to the Google Health API for cloud-based integrations or Health Connect for step tracking and mobile-first apps.",
  },
  fitRowHistorySession: {
    source: "fit",
    text: "By current integration table: Fit History API and Fit Session API — Google Health API — Available",
  },
  fitRowRecording: {
    source: "fit",
    text: "By current integration table: Reading mobile steps (with Google Fit Recording API) — Health Connect — Available",
  },
  fitRowWear: { source: "fit", text: "By current integration table: Fit API on Wear OS — Health Services — Available" },
  fitRowFitbit: { source: "fit", text: "By current integration table: Fitbit Web API — Google Health API — Available" },
  fitRowHealthConnect: {
    source: "fit",
    text: "By current integration table: Health Connect — Keep existing integration or add the Google Health API — Available",
  },
  fitVsGha: {
    source: "fit",
    text: "Use this path if your app is a web-based platform or requires server-to-server (S2S) interactions.",
  },
  fitVsHc: { source: "fit", text: "Use this path for mobile-first Android applications reading local device metrics." },
  recordingPhoneTotal: {
    source: "fit",
    text: "To show a total step count, add Health Connect to your app. The total includes mobile steps (Android 14 or higher) and steps from other apps and devices.",
  },
  recordingPhoneWrite: {
    source: "fit",
    text: "To continue showing local steps data in your app, implement writing data using Health Connect's write API.",
  },
  recordingWear: { source: "fit", text: "Table 1, Wear: Use Health Services: PassiveMonitoringClient ExerciseClient" },
  historyPhone: { source: "fit", text: "Table 2, Phone: Transition to the Google Health API." },
  historyWear: { source: "fit", text: "Table 2, Wear: Not applicable. Use Health Connect from your mobile app and not the wearable." },
  sensorPhone: { source: "fit", text: "Table 3, Phone: Use Sensors, Fused Location Provider API" },
  sensorWear: {
    source: "fit",
    text: "Table 3, Wear: Use Health Services on Wear OS: PassiveMonitoringClient MeasureClient ExerciseClient Or use SensorManager, FusedLocationProvider",
  },
  sensorDeprecated: {
    source: "fit",
    text: "Sensor API: Use the Android Sensors framework or the Fused Location Provider API for real-time raw data.",
  },
  sessionPhone: {
    source: "fit",
    text: "Table 4, Phone: Start/stop: Not applicable. The application should track the state of ongoing sessions internally. Read/write: Transition to the Google Health API.",
  },
  sessionWear: {
    source: "fit",
    text: "Table 4, Wear: Start/stop: Use Health Services (ExerciseClient) Read/write: Use Health Connect with your mobile app.",
  },
  sessionInsert: {
    source: "fit",
    text: "Inserting a session: Developers should use Health Connect with their mobile app and either insert an ExerciseSessionRecord or a SleepSessionRecord accordingly.",
  },
  goals: { source: "fit", text: "Table 5, Phone and Wear: No replacement API available." },
  goalsDeprecated: {
    source: "fit",
    text: "Goals API: No replacement API available. Manage goal tracking and daily activity targets within your application logic.",
  },
  ble: { source: "fit", text: "Table 6, Phone and Wear: Use Android Bluetooth APIs directly." },
  bleDeprecated: {
    source: "fit",
    text: "Bluetooth Low Energy (BLE) API: Use the Android Bluetooth APIs directly to communicate with hardware.",
  },
  fitAppExisting: {
    source: "fit",
    text: "If your app UI includes a way for users to connect to Google Fit (or if your app is included on the list of Works with Google Fit apps), you can continue to maintain your Fit app integration for current users.",
  },
  fitAppNoDate: {
    source: "fit",
    text: "We will keep this section updated with information on when to deprecate your Fit app integration, and what your best options are for maintaining your user experience.",
  },
  fitAppNew: {
    source: "fit",
    text: "To offer a similar experience to new users of your app, we recommend building an integration with Health Connect or the Google Health API.",
  },
  fitAppDo: {
    source: "fit",
    text: "Table 7, Do this / Don't do this: Offer Health Connect or the Google Health API as a new option in your app. — Ask users to disconnect from Google Fit.",
  },
  hcRegistration: {
    source: "fit",
    text: "Fit API versus Health Connect table: Registration — Google Cloud Console — Play Store project and health apps declaration; Authentication — OAuth 2.0 required — No OAuth required (on-device permissions); Data storage — Cloud-centric — Device-centric (on-device)",
  },
  ghaSetup: {
    source: "fit",
    text: "Fit API versus Google Health API table: OAuth Configuration — Android or Web application type — Web application type; App Registration — Create Google Cloud project — Create Google Cloud project and enable the Google Health API",
  },
  fitbitEndOfSupport: {
    source: "about",
    text: "September 30, 2026 (End of support): Support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support.",
  },
  fitbitTurnOff: {
    source: "about",
    text: "November 2, 2026 (API turn-off): The Fitbit Web API and Fitbit OAuth endpoints will be turned off and will no longer function or sync data to or from Fitbit users. Requests to these endpoints will fail and return an HTTP 410 Gone status code.",
  },
  fitbitMustMigrate: {
    source: "about",
    text: "All current integrations utilizing the Fitbit Web API and Fitbit Authorization must migrate their applications and users to the Google Health API and Google OAuth 2.0 as soon as possible to ensure uninterrupted data continuity.",
  },
  ghaRestricted: {
    source: "about",
    text: "All Google Health API scopes are categorized as Restricted, necessitating a privacy and security review for access.",
  },
  ghaParity: {
    source: "about",
    text: "We'll be adding data types to reach parity with Health Connect. You can expect many more of the Health Connect data types to be added in Q4 2026 and Q1 2027.",
  },
  tokensNoTransfer: {
    source: "migration",
    text: "Because of the switch to a new OAuth library, existing access and refresh tokens cannot be transferred, requiring users to re-consent to your updated integration.",
  },
  oauthTypeFlag: {
    source: "migration",
    text: "Update your user database to include a flag (for example, oauth_type) to identify which login system they are using.",
  },
  noDualLinking: {
    source: "migration",
    text: "Never allow a single user to have both a legacy Fitbit Web API connection and a Google Health API connection active simultaneously (\"dual-linking\").",
  },
  getIdentity: {
    source: "migration",
    text: "To bridge this gap without losing user context, developers can query the getIdentity endpoint to get the Fitbit and Health user IDs.",
  },
  accountLinking: {
    source: "migration",
    text: "A user must sign in to the Google Health mobile app to link Google Health to their Google Account before your app can sync data through the Google Health API.",
  },
  backfillGap: {
    source: "migration",
    text: "If a user does not authenticate to the new Google Health API endpoints before the legacy endpoints are turned down, their data will still be available as long as they continue syncing their device to the Google Health app. However, you may have a gap in data for this user.",
  },
  reconsentTiming: {
    source: "migration",
    text: "Only make the re-consent mandatory after several weeks of warnings, coinciding with the official Fitbit Web API deprecation deadlines.",
  },
} satisfies Record<string, Quote>;

/** Operations Google's data-types table lists per type, as printed on FETCHED_ON. */
export const GHA_OPERATIONS: Record<Exclude<DataKind, "other">, { name: string; ops: string[] }> = {
  steps: { name: "Steps", ops: ["list", "reconcile", "rollup", "dailyRollup"] },
  exercise: { name: "Exercise", ops: ["list", "get", "reconcile", "create", "update", "batchDelete"] },
  sleep: { name: "Sleep", ops: ["list", "get", "reconcile", "create", "update", "batchDelete"] },
  "heart-rate": { name: "Heart Rate", ops: ["list", "reconcile", "rollup", "dailyRollup"] },
  weight: { name: "Weight", ops: ["list", "get", "reconcile", "rollup", "dailyRollup", "create", "update", "batchDelete"] },
};

/** The on-site pages a result may link to. The node test checks every link
 *  a result produces is in this list; the build/qa run checks the pages exist. */
export const READING: Record<string, Link> = {
  migrateFitHc: { href: "/migrate/google-fit-to-health-connect", label: "Google Fit to Health Connect: the migration playbook" },
  migrateFitbit: { href: "/migrate/fitbit-web-api-to-google-health", label: "Fitbit Web API to Google Health API: the migration playbook" },
  keepUsers: { href: "/migrate/keep-users-connected-during-migration", label: "Keep users connected during a migration" },
  deprecated: { href: "/migrate/migrate-off-a-deprecated-fitness-api", label: "Migrating off a deprecated fitness API" },
  integrateHc: { href: "/integrate/google-health-connect", label: "Health Connect integration guide" },
  hcRecords: { href: "/health-connect", label: "Health Connect record types" },
  hcApi: { href: "/health-connect-api", label: "Health Connect API reference" },
  hcHistory: { href: "/health-connect-api/read-health-data-history", label: "Reading Health Connect history" },
  matrix: { href: "/matrix", label: "HealthKit and Health Connect type matrix" },
  gha: { href: "/google-health-api", label: "Google Health API data types" },
  ghaScopes: { href: "/google-health-api/scopes", label: "Google Health API scopes" },
  ghaLimits: { href: "/google-health-api/access-and-limits", label: "Google Health API access and limits" },
  ghaMapping: { href: "/google-health-api/fitbit-web-api-mapping", label: "Fitbit Web API to Google Health API mapping" },
  ghaErrors: { href: "/google-health-api/errors", label: "Google Health API errors" },
  wear: { href: "/wear-os-data-types", label: "Wear OS Health Services data types" },
  sensors: { href: "/phone-sensors", label: "Phone sensors for fitness apps" },
  ble: { href: "/bluetooth-fitness", label: "Bluetooth fitness profiles" },
  fitShutdown: { href: "/google-fit-shutdown", label: "Google Fit shutdown: timeline and paths" },
  fitbitShutdown: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown: what's confirmed" },
};

const FIT_DEADLINE: WizardResult["deadline"] = {
  label: "End of 2026 (end of support)",
  detail:
    "Google says the Fit APIs are supported until the end of 2026. It publishes no day, month or switch-off date.",
  quote: Q.fitCaution,
};

const FITBIT_DEADLINE: WizardResult["deadline"] = {
  label: "November 2, 2026 (turn-off)",
  detail:
    "Support ended on September 30, 2026. On November 2, 2026 the Fitbit Web API and Fitbit OAuth endpoints turn off, and requests return HTTP 410 Gone.",
  quote: Q.fitbitTurnOff,
};

const UNSTATED = "Google doesn't state this.";

/* --------------------------------------------------------------- resolver */

function ghaDataNotes(data: DataKind[], mode: Mode): WizardResult["notes"] {
  const notes: WizardResult["notes"] = [];
  for (const d of data) {
    if (d === "other") {
      notes.push({ text: "Check your other types against the Google Health API data-types list before you commit; our reference lists every type Google prints." });
      continue;
    }
    const t = GHA_OPERATIONS[d];
    const canWrite = t.ops.includes("create");
    notes.push({
      text:
        `Google Health API, ${t.name}: Google's data-types page lists ${t.ops.join(", ")}.` +
        (mode === "write"
          ? canWrite
            ? " Create is listed, so writing is documented."
            : " Create is not listed, so writing this type through the Google Health API is not documented."
          : ""),
    });
  }
  notes.push({ text: "Coverage is still growing:", quote: Q.ghaParity });
  return notes;
}

function ghaFromFitNotes(): WizardResult["notes"] {
  return [
    { text: "Setup:", quote: Q.ghaSetup },
    { text: "Scope review:", quote: Q.ghaRestricted },
  ];
}

function hcDataNotes(data: DataKind[], mode: Mode, api: Api): WizardResult["notes"] {
  const notes: WizardResult["notes"] = [];
  if (data.includes("steps") && api === "fit-recording") {
    notes.push({ text: "Steps:", quote: Q.recordingPhoneTotal });
    if (mode === "write") notes.push({ text: "Writing local steps:", quote: Q.recordingPhoneWrite });
  }
  if (mode === "write" && (data.includes("exercise") || data.includes("sleep"))) {
    notes.push({ text: "Writing workouts or sleep:", quote: Q.sessionInsert });
  }
  notes.push({ text: "Setup:", quote: Q.hcRegistration });
  notes.push({
    text: "Google's Fit migration guide does not map Fit data types to Health Connect record types one by one. Google doesn't state this; check each type in our matrix and record pages.",
  });
  return notes;
}

const uniq = <T,>(xs: T[]): T[] => Array.from(new Set(xs));

function finish(r: Omit<WizardResult, "sources">): WizardResult {
  const keys = new Set<SourceKey>();
  for (const q of r.rule) keys.add(q.source);
  if (r.deadline.quote) keys.add(r.deadline.quote.source);
  for (const n of r.notes) if (n.quote) keys.add(n.quote.source);
  if (r.notes.some((n) => n.text.startsWith("Google Health API,"))) keys.add("dataTypes");
  const order: SourceKey[] = ["fit", "about", "migration", "dataTypes"];
  return { ...r, reading: uniq(r.reading), sources: order.filter((k) => keys.has(k)) };
}

const HC_STEPS = [
  "Register the Health Connect way: Google's comparison table lists a Play Store project and health apps declaration in place of the Google Cloud Console.",
  "Swap OAuth scopes for Android manifest permissions and request them in the app; Google lists Health Connect as having no OAuth (on-device permissions).",
  "Read (and, if you write, write) through the Health Connect client on the phone. Storage is on-device, so if your server needs the data, sync it up yourself.",
  "Run Fit and Health Connect side by side, compare the numbers, then move users over in waves before the end of 2026.",
];

const GHA_FROM_FIT_STEPS = [
  "Create a Google Cloud project and enable the Google Health API; Google's table lists a Web application OAuth type for it.",
  "Plan the scope review: Google says all Google Health API scopes are Restricted and need a privacy and security review.",
  "Map each Fit data type you use to a Google Health API data type, and confirm the operations you need (list, rollup, create…) are listed for it.",
  "Ship a consent flow that asks each user to grant the Google Health API scopes you need.",
  "Run both paths in parallel, reconcile, and cut over before Fit support ends at the end of 2026.",
];

const HS_STEPS = [
  "Move on-watch recording to Health Services: PassiveMonitoringClient for background data, ExerciseClient for active workouts (plus MeasureClient for live readings, where Google lists it).",
  "Check each data type you record against the Health Services data types for the watch.",
  "Decide how watch data reaches your phone app or backend; Google's Fit guide does not cover that step.",
  "Test on real hardware, then retire the Fit calls before Fit support ends at the end of 2026.",
];

export function resolve(a: WizardAnswers): WizardResult {
  const { api, runtime, data, mode } = a;

  // ---------------------------------------------------------- Fitbit Web API
  if (api === "fitbit-web") {
    const notes: WizardResult["notes"] = [
      { text: "Tokens:", quote: Q.tokensNoTransfer },
      { text: "Account linking:", quote: Q.accountLinking },
      { text: "One connection per user:", quote: Q.noDualLinking },
      { text: "Identity mapping:", quote: Q.getIdentity },
      { text: "Scope review:", quote: Q.ghaRestricted },
      { text: "If a user misses the turn-off:", quote: Q.backfillGap },
      { text: "Re-consent timing:", quote: Q.reconsentTiming },
      ...ghaDataNotes(data, mode),
    ];
    if (runtime === "watch") {
      notes.unshift({
        text: "Google's pages describe no watch-specific path for Fitbit Web API calls. Google doesn't state this; the turn-off covers the Fitbit Web API and Fitbit OAuth endpoints, whatever device calls them.",
      });
    }
    return finish({
      destinations: ["google-health-api"],
      summary: "Every Fitbit Web API integration moves to the Google Health API with Google OAuth 2.0; Google names no other successor.",
      rule: [Q.fitbitMustMigrate, Q.fitRowFitbit],
      deadline: FITBIT_DEADLINE,
      steps: [
        "Register a Google Cloud project, enable the Google Health API and set up Google OAuth 2.0; plan for the Restricted-scope privacy and security review.",
        "Add an oauth_type flag per user and a routing layer, so each user is on exactly one of Fitbit or Google Health, never both (Google calls that dual-linking).",
        "Ship re-consent: Fitbit tokens cannot be transferred. After Google OAuth, call users.getIdentity to map legacyUserId to healthUserId, then revoke the user's Fitbit tokens.",
        "Handle ACCOUNT_NOT_LINKED: a user must link Google Health to their Google Account in the Google Health app before you can sync them.",
        "Re-map endpoints to Google Health API data types, then backfill history for users who reconnect after November 2, 2026.",
      ],
      notes,
      reading: [
        READING.migrateFitbit,
        READING.ghaMapping,
        READING.ghaScopes,
        READING.ghaErrors,
        READING.keepUsers,
        READING.fitbitShutdown,
      ],
    });
  }

  // ------------------------------------------------- existing Health Connect
  if (api === "health-connect") {
    return finish({
      destinations: ["keep-health-connect"],
      summary: "Google's table says to keep an existing Health Connect integration, or add the Google Health API alongside it.",
      rule: [Q.fitRowHealthConnect],
      deadline: {
        label: "No deadline stated",
        detail: "Google's Fit migration guide sets no deadline for an existing Health Connect integration. " + UNSTATED,
        quote: null,
      },
      steps: [
        "Confirm nothing in your app still calls a Fit API (Recording, History, Session, Sensor, Goals, BLE or REST); those are what lose support at the end of 2026.",
        "If your backend needs the same data, decide between syncing up from Health Connect yourself and adding the Google Health API.",
        "If you add the Google Health API, budget for its Restricted-scope review and a separate Google OAuth consent.",
      ],
      notes: runtime === "backend"
        ? [{ text: "Health Connect itself has no server endpoint: Google lists its storage as on-device.", quote: Q.hcRegistration }]
        : [],
      reading: [READING.hcApi, READING.hcRecords, READING.gha, READING.ghaLimits],
    });
  }

  // ------------------------------------------------------------ Fit app link
  if (api === "fit-app") {
    return finish({
      destinations: ["health-connect", "google-health-api"],
      summary: "Keep the Google Fit app connection for current users, and offer Health Connect or the Google Health API to everyone, new users first.",
      rule: [Q.fitAppExisting, Q.fitAppNew, Q.fitAppDo],
      deadline: {
        label: "No date for Fit app integrations",
        detail:
          "Google gives no date for Fit app connections and says it will update the section. The Fit APIs themselves are supported until the end of 2026.",
        quote: Q.fitAppNoDate,
      },
      steps: [
        "Add Health Connect or the Google Health API to your setup flow for new users, instead of offering Google Fit.",
        "Offer the new connection to existing users as an option, leading with what they gain; Google says not to ask them to disconnect Google Fit.",
        "Keep the Fit app connection working for current users while Google keeps that section open.",
        "Watch Google's guide for the deprecation date it says it will add.",
      ],
      notes: [],
      reading: [READING.keepUsers, READING.integrateHc, READING.gha, READING.migrateFitHc],
    });
  }

  // ------------------------------------------------------------- Fit REST API
  if (api === "fit-rest") {
    if (runtime === "watch") {
      return finish({
        destinations: ["health-services"],
        summary: "Google's table sends the Fit API on Wear OS to Health Services. It does not single out REST calls made from a watch.",
        rule: [Q.fitRowWear],
        deadline: FIT_DEADLINE,
        steps: HS_STEPS,
        notes: [{ text: "Google's guide has no row for the Fit REST API on a watch specifically. Google doesn't state this; the Wear OS row is the closest it gives." }],
        reading: [READING.wear, READING.migrateFitHc, READING.fitShutdown],
      });
    }
    if (runtime === "phone") {
      return finish({
        destinations: ["health-connect", "google-health-api"],
        summary: "For a phone app, Google's guide recommends Health Connect for step tracking and mobile-first apps, and the Google Health API where the integration is cloud-based or server-to-server.",
        rule: [Q.fitCaution, Q.fitVsHc, Q.fitVsGha],
        deadline: FIT_DEADLINE,
        steps: [
          "Decide which reads must happen on a server. Those go to the Google Health API; on-device reads go to Health Connect.",
          ...HC_STEPS.slice(0, 2),
          "For the cloud half, create a Google Cloud project, enable the Google Health API and plan for its Restricted-scope review.",
          "Run Fit and the new path side by side, reconcile, and cut over before the end of 2026.",
        ],
        notes: [...hcDataNotes(data, mode, api), ...ghaDataNotes(data, mode)],
        reading: [READING.migrateFitHc, READING.integrateHc, READING.gha, READING.matrix, READING.keepUsers],
      });
    }
    return finish({
      destinations: ["google-health-api"],
      summary: "A server calling the Fit REST API is a cloud-based integration, which Google sends to the Google Health API. Health Connect has no server endpoint.",
      rule: [Q.fitCaution, Q.fitVsGha],
      deadline: FIT_DEADLINE,
      steps: GHA_FROM_FIT_STEPS,
      notes: [
        { text: "Why not Health Connect: Google lists its storage as on-device.", quote: Q.hcRegistration },
        ...ghaFromFitNotes(),
        ...ghaDataNotes(data, mode),
      ],
      reading: [READING.gha, READING.ghaScopes, READING.ghaLimits, READING.migrateFitHc, READING.keepUsers],
    });
  }

  // ------------------------------------- Android-only Fit APIs on a backend
  if (runtime === "backend") {
    return finish({
      destinations: ["unstated"],
      summary:
        "Google's per-API tables for this Fit API have Phone and Wear columns only, so a backend path is not given. Google doesn't state this. Its general rule sends cloud-based integrations to the Google Health API.",
      rule: [Q.fitCaution],
      deadline: FIT_DEADLINE,
      steps: [
        "Check where the call really runs: the Recording, History, Session, Sensor, Goals and BLE APIs are Android APIs, so a backend usually gets this data from an app or from the Fit REST API.",
        "If it is the Fit REST API, answer the first question again with that.",
        "If the data starts in your Android app, follow the Phone answer for this API and sync to your backend yourself.",
      ],
      notes: [],
      reading: [READING.fitShutdown, READING.migrateFitHc, READING.gha],
    });
  }

  const watch = runtime === "watch";

  switch (api) {
    case "fit-recording":
      if (watch) {
        return finish({
          destinations: ["health-services"],
          summary: "On a watch, Google replaces the Recording API with Health Services.",
          rule: [Q.recordingWear, Q.fitRowWear],
          deadline: FIT_DEADLINE,
          steps: HS_STEPS,
          notes: [],
          reading: [READING.wear, READING.fitShutdown],
        });
      }
      return finish({
        destinations: ["health-connect"],
        summary: "On a phone, reading steps recorded by the Fit Recording API moves to Health Connect.",
        rule: [Q.fitRowRecording, Q.recordingPhoneTotal, Q.recordingPhoneWrite],
        deadline: FIT_DEADLINE,
        steps: HC_STEPS,
        notes: hcDataNotes(data, mode, api),
        reading: [READING.migrateFitHc, READING.integrateHc, READING.hcRecords, READING.hcHistory, READING.matrix],
      });

    case "fit-history":
      if (watch) {
        return finish({
          destinations: ["health-connect"],
          summary: "Google says the History API has no watch replacement: use Health Connect from your phone app, not the wearable.",
          rule: [Q.historyWear],
          deadline: FIT_DEADLINE,
          steps: [
            "Move History reads and writes out of the watch app and into your Android phone app.",
            ...HC_STEPS.slice(0, 3),
            "Retire the History calls on the watch before Fit support ends at the end of 2026.",
          ],
          notes: hcDataNotes(data, mode, api),
          reading: [READING.migrateFitHc, READING.integrateHc, READING.hcApi, READING.wear],
        });
      }
      return finish({
        destinations: ["google-health-api"],
        summary: "On a phone, Google sends the Fit History API to the Google Health API.",
        rule: [Q.historyPhone, Q.fitRowHistorySession],
        deadline: FIT_DEADLINE,
        steps: GHA_FROM_FIT_STEPS,
        notes: [...ghaFromFitNotes(), ...ghaDataNotes(data, mode)],
        reading: [READING.gha, READING.ghaScopes, READING.ghaLimits, READING.keepUsers, READING.fitShutdown],
      });

    case "fit-session":
      if (watch) {
        return finish({
          destinations: ["health-services", "health-connect"],
          summary: "On a watch, start and stop sessions with Health Services (ExerciseClient), and read or write them through Health Connect in your phone app.",
          rule: [Q.sessionWear, Q.sessionInsert],
          deadline: FIT_DEADLINE,
          steps: [
            "Start and stop workouts on the watch with Health Services ExerciseClient.",
            "Move session reads and writes to your phone app, through Health Connect.",
            "Insert finished sessions as ExerciseSessionRecord or SleepSessionRecord in Health Connect.",
            "Retire the Session API calls before Fit support ends at the end of 2026.",
          ],
          notes: hcDataNotes(data, mode, api),
          reading: [READING.wear, READING.integrateHc, READING.hcRecords, READING.migrateFitHc],
        });
      }
      if (mode === "write") {
        return finish({
          destinations: ["google-health-api", "health-connect"],
          summary:
            "Google's table sends Session read/write to the Google Health API, and the same section advises inserting sessions through Health Connect. It gives both and does not say which wins.",
          rule: [Q.sessionPhone, Q.sessionInsert, Q.fitRowHistorySession],
          deadline: FIT_DEADLINE,
          steps: [
            "Track the state of ongoing sessions inside your app; Google says start/stop has no replacement on the phone.",
            "To insert sessions, use Health Connect from your mobile app with ExerciseSessionRecord or SleepSessionRecord.",
            "To read sessions from a server, use the Google Health API; check that Exercise and Sleep list the operations you need.",
            "Run both against Fit in parallel and cut over before the end of 2026.",
          ],
          notes: [
            { text: "Google's guide gives both destinations for phone session writes and doesn't state which to prefer when you need both." },
            ...ghaDataNotes(data, mode),
          ],
          reading: [READING.gha, READING.integrateHc, READING.hcRecords, READING.migrateFitHc, READING.keepUsers],
        });
      }
      return finish({
        destinations: ["google-health-api"],
        summary: "On a phone, Google sends Fit Session reads to the Google Health API; tracking whether a session is running becomes your app's job.",
        rule: [Q.sessionPhone, Q.fitRowHistorySession],
        deadline: FIT_DEADLINE,
        steps: [
          "Track the state of ongoing sessions inside your app; Google says start/stop has no replacement on the phone.",
          ...GHA_FROM_FIT_STEPS.slice(0, 4),
        ],
        notes: [...ghaFromFitNotes(), ...ghaDataNotes(data, mode)],
        reading: [READING.gha, READING.ghaScopes, READING.keepUsers, READING.fitShutdown],
      });

    case "fit-sensor":
      if (watch) {
        return finish({
          destinations: ["health-services", "android-sensors"],
          summary: "On a watch, Google lists Health Services (PassiveMonitoringClient, MeasureClient, ExerciseClient), or SensorManager and FusedLocationProvider.",
          rule: [Q.sensorWear],
          deadline: FIT_DEADLINE,
          steps: HS_STEPS,
          notes: [],
          reading: [READING.wear, READING.sensors],
        });
      }
      return finish({
        destinations: ["android-sensors"],
        summary: "Google lists the Sensor API as having no direct replacement: use the Android Sensors framework or the Fused Location Provider API.",
        rule: [Q.sensorPhone, Q.sensorDeprecated],
        deadline: FIT_DEADLINE,
        steps: [
          "Replace Fit sensor listeners with Android SensorManager listeners for the sensors you used.",
          "Replace Fit location data with the Fused Location Provider API.",
          "If your app listed Fit data sources, rebuild that list from the sensors SensorManager reports.",
          "Remove the Sensor API calls before Fit support ends at the end of 2026.",
        ],
        notes: [],
        reading: [READING.sensors, READING.deprecated],
      });

    case "fit-goals":
      return finish({
        destinations: ["no-replacement"],
        summary: "Google says there is no replacement API for Goals, on phone or watch. Goal tracking moves into your own app logic.",
        rule: [Q.goals, Q.goalsDeprecated],
        deadline: FIT_DEADLINE,
        steps: [
          "Store users' goals in your own app or backend.",
          "Compute progress against them from the activity data your new source returns (Health Connect, Health Services or the Google Health API).",
          "Copy users' current Fit goals into your store while the Goals API still answers, then remove the Goals calls before the end of 2026.",
        ],
        notes: [],
        reading: [READING.deprecated, READING.migrateFitHc, READING.fitShutdown],
      });

    case "fit-ble":
      return finish({
        destinations: ["android-bluetooth"],
        summary: "Google says to use the Android Bluetooth APIs directly, on phone and watch.",
        rule: [Q.ble, Q.bleDeprecated],
        deadline: FIT_DEADLINE,
        steps: [
          "Scan for and connect to devices with the Android Bluetooth LE APIs instead of the Fit BLE API.",
          "Parse the device's data yourself; there is no Fit store to insert it into.",
          "If other apps should see the data, write it to Health Connect from your phone app.",
          "Remove the BLE API calls before Fit support ends at the end of 2026.",
        ],
        notes: [
          { text: "Writing BLE readings to Health Connect is our suggestion for sharing them; Google's BLE row says only to use the Android Bluetooth APIs directly." },
        ],
        reading: [READING.ble, READING.integrateHc, READING.deprecated],
      });
  }

  throw new Error(`unhandled answer: ${JSON.stringify(a)}`);
}

/* ------------------------------------------------------- URL state helpers */

const API_SET = new Set<string>(API_OPTIONS.map((o) => o.value));
const RUNTIME_SET = new Set<string>(RUNTIME_OPTIONS.map((o) => o.value));
const DATA_SET = new Set<string>(DATA_OPTIONS.map((o) => o.value));
const MODE_SET = new Set<string>(MODE_OPTIONS.map((o) => o.value));

export type PartialAnswers = { api?: Api; runtime?: Runtime; data?: DataKind[]; mode?: Mode };

/** Short keys: the URL is meant to be pasted into a thread. */
export function toQuery(a: PartialAnswers): string {
  const q = new URLSearchParams();
  if (a.api) q.set("from", a.api);
  if (a.runtime) q.set("on", a.runtime);
  if (a.data && a.data.length) q.set("data", a.data.join(","));
  if (a.mode) q.set("op", a.mode);
  return q.toString();
}

export function fromQuery(search: string): PartialAnswers {
  const q = new URLSearchParams(search);
  const out: PartialAnswers = {};
  const api = q.get("from");
  const runtime = q.get("on");
  const mode = q.get("op");
  const data = (q.get("data") ?? "").split(",").filter((d) => DATA_SET.has(d)) as DataKind[];
  if (api && API_SET.has(api)) out.api = api as Api;
  if (runtime && RUNTIME_SET.has(runtime)) out.runtime = runtime as Runtime;
  if (data.length) out.data = uniq(data);
  if (mode && MODE_SET.has(mode)) out.mode = mode as Mode;
  return out;
}

export function isComplete(a: PartialAnswers): a is WizardAnswers {
  return Boolean(a.api && a.runtime && a.data && a.data.length && a.mode);
}
