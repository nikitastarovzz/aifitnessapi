/**
 * The hand-sourced half of the deprecation scanner's rules
 * (/tools/deprecation-scanner and actions/fitness-api-deprecation-check,
 * ops/VIRAL-20-2026-11-06.md items 14 and 15).
 *
 * The other half is generated: every Fitbit Web API endpoint comes from
 * src/data/fitbitWebApi.ts and its replacement from src/lib/fitbitGoogleMap.ts,
 * and package names from src/data/libraries.ts. What happened to each API
 * (status, date, the vendor's words) always comes from src/data/graveyard.ts.
 * scripts/build-deprecation-rules.mjs joins them into the bundle the page and
 * the Action both run.
 *
 * SOURCING RULE (held by the generator, which exits non-zero on a break):
 * - `literal` is a string copied from `source.quote`, and `example` is a line
 *   the pattern must match, with the match containing `literal`. A pattern is
 *   only ever a written form of something a vendor page prints.
 * - `source.quote` is verbatim from `source.url`, read on `checkedOn`.
 *   `evidenceQuote`, where present, is the same passage in the form
 *   scripts/check-source-quotes.mjs sees it (tags become spaces, so code
 *   reads "Fitness . getHistoryClient ("); every source is written to
 *   ops/sources/evidence/tools-deprecation-scanner.json, which
 *   source-quotes.yml re-reads.
 * - `entry` names a GRAVEYARD id. A pattern for an API the graveyard does not
 *   hold is not added here: the graveyard entry, with its quote, comes first.
 * - `replacement` is what the vendor names for this specific API, with the
 *   sentence in `replacementQuotes`; left out, the entry's `replacedBy` is used.
 *
 * Re-verify by re-reading each URL; then move its checkedOn. Never move it
 * without that read.
 *
 * Self-contained (no imports) so the generator loads it with Node's type
 * stripping.
 */

export type SignatureContext = "code" | "npm-manifest" | "pypi-manifest" | "gradle" | "podfile" | "pubspec";

export type SignatureSource = {
  url: string;
  publisher: string;
  checkedOn: string;
  quote: string;
  /** The quote as check-source-quotes.mjs normalises the page, where it differs. */
  evidenceQuote?: string;
  via: "direct" | "snapshot";
  /** For an Internet Archive capture: the capture's own date. */
  capturedOn?: string;
};

export type DeprecationSignature = {
  id: string;
  /** A GRAVEYARD id (src/data/graveyard.ts). */
  entry: string;
  kind: "host" | "endpoint" | "package" | "symbol";
  /** What the code is using, in our words. */
  label: string;
  literal: string;
  /** A RegExp source, applied to one line at a time. */
  pattern: string;
  flags?: "i";
  example: string;
  contexts?: SignatureContext[];
  /** True for a broad pattern (a bare host) that steps aside when a specific rule of the same entry hits the line. */
  fallback?: boolean;
  replacement?: { label: string; href?: string }[];
  replacementQuotes?: { url: string; quote: string; evidenceQuote?: string }[];
  source: SignatureSource;
  /** More pages the pattern rests on (a host from one page, a path from another). */
  extraSources?: (SignatureSource & { literal: string })[];
};

const READ = "2026-11-06";

/**
 * The Google Fit pages, re-read 2026-11-14. Without a language parameter both
 * hosts answer some requests with a machine-translated edition (a redirect to
 * ?hl=de, ?hl=fr, ?hl=zh-cn…), so an English quote fails at random in
 * source-quotes.yml; every Google URL here carries ?hl=en.
 */
const READ_FIT = "2026-11-14";
const FIT_MIGRATION = "https://developer.android.com/health-and-fitness/health-connect/migration/fit?hl=en";
const FIT_CAUTION =
  "The Google Fit API (including the REST API) will only be supported until the end of 2026. We recommend migrating to the Google Health API for cloud-based integrations or Health Connect for step tracking and mobile-first apps.";
const ANDROID: SignatureSource["publisher"] = "Google for Developers (Google Fit)";

/** Where to send a reader who found a reference, per graveyard entry; falls back to the entry's own page. */
export const MIGRATION_PAGES: Record<string, { href: string; label: string }> = {
  "fitbit-web-api": { href: "/migrate/fitbit-web-api-to-google-health", label: "Fitbit Web API to Google Health API migration" },
  "google-fit-apis": { href: "/migrate/google-fit-to-health-connect", label: "Google Fit migration" },
  "google-fit-goals-api": { href: "/migrate/google-fit-to-health-connect", label: "Google Fit migration" },
  "google-fit-sensors-ble-apis": { href: "/migrate/google-fit-to-health-connect", label: "Google Fit migration" },
  "strava-club-endpoints": { href: "/migrate/adapt-to-strava-api-changes", label: "Adapting to Strava API changes" },
  "strava-running-races": { href: "/migrate/adapt-to-strava-api-changes", label: "Adapting to Strava API changes" },
};

/**
 * A package in src/data/libraries.ts becomes a rule when its `wraps` (read
 * from its registry description, with the evidence kept there) names one of
 * these APIs. The pairing of the API's name with a graveyard entry is ours.
 */
export const LIBRARY_WRAPS_ENTRY: Record<string, string> = {
  "Fitbit Web API": "fitbit-web-api",
  "Google Fit": "google-fit-apis",
};

/** Graveyard entries with no pattern here, and why (printed on the page). */
export const NOT_SCANNED: Record<string, string> = {
  "oura-personal-access-tokens":
    "A personal access token is sent like any other bearer token, so nothing in code tells it apart from an OAuth token.",
  "google-fit-sensors-ble-apis#ble":
    "Google's BLE API page names no client class or method this site could quote, so only the Sensors API half is scanned.",
};

export const DEPRECATION_SIGNATURES: DeprecationSignature[] = [
  // ------------------------------------------------------------ Google Fit
  {
    id: "google-fit-rest",
    entry: "google-fit-apis",
    kind: "host",
    label: "Google Fit REST API (www.googleapis.com/fitness/v1)",
    literal: "www.googleapis.com/fitness/v1",
    pattern: "googleapis\\.com/fitness/v1\\b",
    example: 'const url = "https://www.googleapis.com/fitness/v1/users/me/dataSources";',
    replacement: [{ label: "Google Health API (cloud integrations)", href: "/google-health-api" }],
    replacementQuotes: [{ url: FIT_MIGRATION, quote: FIT_CAUTION }],
    source: {
      url: "https://developers.google.com/fit/rest/v1/reference?hl=en",
      publisher: ANDROID,
      checkedOn: READ_FIT,
      quote: "URIs relative to https://www.googleapis.com/fitness/v1/users, unless otherwise noted",
      via: "direct",
    },
  },
  {
    id: "google-fit-android-sdk",
    entry: "google-fit-apis",
    kind: "package",
    label: "Google Fit Android SDK (com.google.android.gms:play-services-fitness)",
    literal: "com.google.android.gms:play-services-fitness",
    pattern: "com\\.google\\.android\\.gms:play-services-fitness\\b",
    example: '    implementation("com.google.android.gms:play-services-fitness:21.3.0")',
    source: {
      url: "https://developers.google.com/fit/android/get-started?hl=en",
      publisher: ANDROID,
      checkedOn: READ_FIT,
      quote: 'implementation("com.google.android.gms:play-services-fitness:21.3.0")',
      evidenceQuote: "com.google.android.gms:play-services-fitness:21.3.0",
      via: "direct",
    },
  },
  {
    id: "google-fit-history-client",
    entry: "google-fit-apis",
    kind: "symbol",
    label: "Google Fit History API (Fitness.getHistoryClient)",
    literal: "Fitness.getHistoryClient",
    pattern: "\\bFitness\\s*\\.\\s*getHistoryClient\\b",
    example: "Fitness.getHistoryClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))",
    replacement: [{ label: "Google Health API", href: "/google-health-api" }],
    replacementQuotes: [{ url: FIT_MIGRATION, quote: "Fit History API and Fit Session API | Google Health API | Available" }],
    source: {
      url: "https://developers.google.com/fit/android/history?hl=en",
      publisher: ANDROID,
      checkedOn: READ_FIT,
      quote: "Fitness.getHistoryClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))",
      evidenceQuote: "Fitness . getHistoryClient ( this , GoogleSignIn . getAccountForExtension ( this , fitnessOptions",
      via: "direct",
    },
  },
  {
    id: "google-fit-sessions-client",
    entry: "google-fit-apis",
    kind: "symbol",
    label: "Google Fit Session API (Fitness.getSessionsClient)",
    literal: "Fitness.getSessionsClient",
    pattern: "\\bFitness\\s*\\.\\s*getSessionsClient\\b",
    example: "Fitness.getSessionsClient(this, googleSigninAccount)",
    replacement: [
      { label: "Google Health API (phone: read and write sessions)", href: "/google-health-api" },
      { label: "Health Services ExerciseClient (Wear OS: start and stop)", href: "/wear-os-data-types" },
    ],
    replacementQuotes: [
      { url: FIT_MIGRATION, quote: "Start/stop: Not applicable. The application should track the state of ongoing sessions internally. Read/write: Transition to the Google Health API.",
        evidenceQuote: "Start/stop: Not applicable. The application should track the state of ongoing sessions internally. Read/write: Transition to the Google Health API",
      },
      { url: FIT_MIGRATION, quote: "Start/stop: Use Health Services (ExerciseClient) Read/write: Use Health Connect with your mobile app." },
    ],
    source: {
      url: "https://developers.google.com/fit/android/using-sessions?hl=en",
      publisher: ANDROID,
      checkedOn: READ_FIT,
      quote: "Fitness.getSessionsClient(this, googleSigninAccount)",
      evidenceQuote: "Fitness . getSessionsClient ( this , googleSigninAccount )",
      via: "direct",
    },
  },
  {
    id: "google-fit-recording-client",
    entry: "google-fit-apis",
    kind: "symbol",
    label: "Google Fit Recording API (Fitness.getRecordingClient)",
    literal: "Fitness.getRecordingClient",
    pattern: "\\bFitness\\s*\\.\\s*getRecordingClient\\b",
    example: "Fitness.getRecordingClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))",
    replacement: [
      { label: "Health Connect (phone)", href: "/health-connect" },
      { label: "Health Services PassiveMonitoringClient or ExerciseClient (Wear OS)", href: "/wear-os-data-types" },
    ],
    replacementQuotes: [
      { url: FIT_MIGRATION, quote: "Reading mobile steps (with Google Fit Recording API) | Health Connect | Available" },
      { url: FIT_MIGRATION, quote: "Use Health Services: PassiveMonitoringClient ExerciseClient" },
    ],
    source: {
      url: "https://developers.google.com/fit/android/record?hl=en",
      publisher: ANDROID,
      checkedOn: READ_FIT,
      quote: "Fitness.getRecordingClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))",
      evidenceQuote: "Fitness . getRecordingClient ( this , GoogleSignIn . getAccountForExtension ( this , fitnessOptions",
      via: "direct",
    },
  },
  {
    id: "google-fit-sensors-client",
    entry: "google-fit-sensors-ble-apis",
    kind: "symbol",
    label: "Google Fit Sensors API (Fitness.getSensorsClient)",
    literal: "Fitness.getSensorsClient",
    pattern: "\\bFitness\\s*\\.\\s*getSensorsClient\\b",
    example: "Fitness.getSensorsClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))",
    replacement: [{ label: "Android Sensors framework or the Fused Location Provider API" }],
    replacementQuotes: [{ url: FIT_MIGRATION, quote: "Sensor API: Use the Android Sensors framework or the Fused Location Provider API for real-time raw data.",
        evidenceQuote: "Use the Android Sensors framework or the Fused Location Provider API for real-time raw data.",
      }],
    source: {
      url: "https://developers.google.com/fit/android/sensors?hl=en",
      publisher: ANDROID,
      checkedOn: READ_FIT,
      quote: "Fitness.getSensorsClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))",
      evidenceQuote: "Fitness . getSensorsClient ( this , GoogleSignIn . getAccountForExtension ( this , fitnessOptions",
      via: "direct",
    },
  },
  {
    id: "google-fit-goals-client",
    entry: "google-fit-goals-api",
    kind: "symbol",
    label: "Google Fit Goals API (Fitness.getGoalsClient)",
    literal: "Fitness.getGoalsClient",
    pattern: "\\bFitness\\s*\\.\\s*getGoalsClient\\b",
    example: "Fitness.getGoalsClient(requireContext(), getGoogleAccount())",
    source: {
      url: "https://developers.google.com/fit/android/using-goals?hl=en",
      publisher: ANDROID,
      checkedOn: READ_FIT,
      quote: "Fitness.getGoalsClient(requireContext(), getGoogleAccount())",
      evidenceQuote: "Fitness . getGoalsClient ( requireContext (), getGoogleAccount ())",
      via: "direct",
    },
  },

  // ------------------------------------------------------------ Terra
  {
    id: "terra-generate-widget-session",
    entry: "terra-legacy-widget-session",
    kind: "endpoint",
    label: "Terra legacy widget session (POST /v2/auth/generateWidgetSession)",
    literal: "/v2/auth/generateWidgetSession",
    pattern: "/auth/generateWidgetSession\\b",
    example: 'await fetch("https://api.tryterra.co/v2/auth/generateWidgetSession", { method: "POST" })',
    replacement: [{ label: "POST https://access.tryterra.co/api/widget/session", href: "/integrate/terra-api" }],
    replacementQuotes: [{ url: "https://docs.tryterra.co/unified-api/user-authentication/implementation-terra-widget", quote: "POST https://access.tryterra.co/api/widget/session" }],
    source: {
      url: "https://docs.tryterra.co/unified-api/user-authentication/implementation-terra-widget",
      publisher: "Terra documentation",
      checkedOn: READ,
      quote: "POST https://api.tryterra.co/v2/auth/generateWidgetSession",
      via: "snapshot",
    },
  },

  // ------------------------------------------------------------ WHOOP v1
  ...(
    [
      ["sleep", "activity/sleep"],
      ["workout", "activity/workout"],
      ["cycle", "cycle"],
      ["recovery", "recovery"],
    ] as const
  ).map(
    ([key, path]): DeprecationSignature => ({
      id: `whoop-v1-${key}`,
      entry: "whoop-api-v1",
      kind: "endpoint",
      label: `WHOOP API v1 (/developer/v1/${path})`,
      literal: `v1/${path}`,
      pattern: `/developer/v1/${path}\\b`,
      example: `GET https://api.prod.whoop.com/developer/v1/${path}`,
      replacement: [{ label: `GET /developer/v2/${path}`, href: "/integrate/whoop-api" }],
      replacementQuotes: [{ url: "https://developer.whoop.com/docs/developing/v1-v2-migration/", quote: `v1/${path} | v2/${path}` }],
      source: {
        url: "https://developer.whoop.com/docs/developing/v1-v2-migration/",
        publisher: "WHOOP Developer Platform",
        checkedOn: READ,
        quote: `v1/${path} | v2/${path}`,
        via: "snapshot",
      },
      extraSources: [
        {
          literal: "api.prod.whoop.com/developer",
          url: "https://developer.whoop.com/api/",
          publisher: "WHOOP API reference",
          checkedOn: READ,
          quote: "Token URL: https://api.prod.whoop.com/developer/v2/partner/token",
          via: "snapshot",
        },
      ],
    }),
  ),

  // ------------------------------------------------------------ Strava
  ...(["activities", "members", "admins"] as const).map(
    (sub): DeprecationSignature => ({
      id: `strava-club-${sub}`,
      entry: "strava-club-endpoints",
      kind: "endpoint",
      label: `Strava club ${sub} endpoint (/api/v3/clubs/{id}/${sub})`,
      literal: `/clubs/{id}/${sub}`,
      pattern: `/api/v3/clubs/(?:\\{[^}\\s]*\\}|\\$\\{[^}\\s]*\\}|[^/\\s"'\`?#]+)/${sub}\\b`,
      example: `curl "https://www.strava.com/api/v3/clubs/12345/${sub}?page=1"`,
      source: {
        url: "https://web.archive.org/web/20211103231613id_/https://developers.strava.com/swagger/swagger.json",
        publisher: "Strava API specification (Internet Archive capture)",
        checkedOn: READ,
        quote: `"/clubs/{id}/${sub}"`,
        via: "snapshot",
        capturedOn: "2021-11-03",
      },
      extraSources: [
        {
          literal: "/api/v3",
          url: "https://web.archive.org/web/20260513030150id_/https://developers.strava.com/swagger/swagger.json",
          publisher: "Strava API specification (Internet Archive capture)",
          checkedOn: READ,
          quote: '"basePath": "/api/v3"',
          via: "snapshot",
          capturedOn: "2026-05-13",
        },
      ],
    }),
  ),
  {
    id: "strava-running-races",
    entry: "strava-running-races",
    kind: "endpoint",
    label: "Strava running races endpoints (/api/v3/running_races)",
    literal: "/running_races",
    pattern: "/api/v3/running_races\\b",
    example: 'requests.get("https://www.strava.com/api/v3/running_races", params={"year": 2021})',
    source: {
      url: "https://web.archive.org/web/20211103231613id_/https://developers.strava.com/swagger/swagger.json",
      publisher: "Strava API specification (Internet Archive capture)",
      checkedOn: READ,
      quote: '"/running_races"',
      via: "snapshot",
      capturedOn: "2021-11-03",
    },
    extraSources: [
      {
        literal: "/api/v3",
        url: "https://web.archive.org/web/20260513030150id_/https://developers.strava.com/swagger/swagger.json",
        publisher: "Strava API specification (Internet Archive capture)",
        checkedOn: READ,
        quote: '"basePath": "/api/v3"',
        via: "snapshot",
        capturedOn: "2026-05-13",
      },
    ],
  },

  // ------------------------------------------------------------ Samsung
  {
    id: "samsung-health-sdk-android",
    entry: "samsung-health-sdk-android",
    kind: "package",
    label: "Samsung Health SDK for Android (package com.samsung.android.sdk.healthdata)",
    literal: "com.samsung.android.sdk.healthdata",
    pattern: "\\bcom\\.samsung\\.android\\.sdk\\.healthdata\\b",
    example: "import com.samsung.android.sdk.healthdata.HealthDataStore;",
    source: {
      url: "https://developer.samsung.com/health/android/data/api-reference/com/samsung/android/sdk/healthdata/HealthConstants.html",
      publisher: "Samsung Developer (Samsung Health SDK for Android API reference)",
      checkedOn: READ,
      quote: "com.samsung.android.sdk.healthdata.HealthConstants",
      via: "snapshot",
    },
  },

  // ------------------------------------------------------------ Oura V1
  {
    id: "oura-api-v1",
    entry: "oura-api-v1",
    kind: "host",
    label: "Oura API V1 (api.ouraring.com/v1/)",
    literal: "api.ouraring.com/v1/",
    pattern: "\\bapi\\.ouraring\\.com/v1/",
    example: "r = requests.get('https://api.ouraring.com/v1/sleep', headers=h)",
    source: {
      url: "https://web.archive.org/web/20230528195054/https://cloud.ouraring.com/docs/authentication",
      publisher: "Oura API V1 documentation (Internet Archive capture)",
      checkedOn: READ,
      quote: "https://api.ouraring.com/v1/userinfo",
      via: "snapshot",
      capturedOn: "2023-05-28",
    },
  },

  // ------------------------------------------------------------ Pose models
  {
    id: "mediapipe-legacy-pose-python",
    entry: "mediapipe-legacy-pose",
    kind: "symbol",
    label: "MediaPipe Pose legacy solution (mp.solutions.pose)",
    literal: "mp.solutions.pose",
    pattern: "\\bmp\\.solutions\\.pose(?![\\w])",
    example: "mp_pose = mp.solutions.pose",
    source: {
      // docs/ was deleted from the repository on 2026-11-09: the guide at its last commit, read 2026-11-14.
      url: "https://raw.githubusercontent.com/google-ai-edge/mediapipe/3eb8983cde1517fdff4abbfb33586316af6d45be/docs/solutions/pose.md",
      publisher: "MediaPipe repository (Google)",
      checkedOn: "2026-11-14",
      quote: "mp_pose = mp.solutions.pose",
      via: "direct",
    },
  },
  {
    id: "mediapipe-legacy-pose-npm",
    entry: "mediapipe-legacy-pose",
    kind: "package",
    label: "MediaPipe Pose legacy web package (@mediapipe/pose)",
    literal: "@mediapipe/pose",
    pattern: "(?<![\\w@-])@mediapipe/pose(?![\\w-])",
    example: '<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>',
    source: {
      url: "https://registry.npmjs.org/@mediapipe/pose",
      publisher: "npm registry",
      checkedOn: READ,
      quote: '"name":"@mediapipe/pose"',
      via: "direct",
    },
  },
  {
    id: "tfjs-posenet",
    entry: "tfjs-posenet",
    kind: "package",
    label: "PoseNet for TensorFlow.js (@tensorflow-models/posenet)",
    literal: "@tensorflow-models/posenet",
    pattern: "(?<![\\w@-])@tensorflow-models/posenet(?![\\w-])",
    example: 'import * as posenet from "@tensorflow-models/posenet";',
    source: {
      url: "https://registry.npmjs.org/@tensorflow-models/posenet",
      publisher: "npm registry",
      checkedOn: READ,
      quote: '"name":"@tensorflow-models/posenet"',
      via: "direct",
    },
  },

  // ------------------------------------------------------------ Long gone
  {
    id: "moves-api",
    entry: "moves-api",
    kind: "host",
    label: "Moves API (api.moves-app.com)",
    literal: "api.moves-app.com",
    pattern: "\\bapi\\.moves-app\\.com\\b",
    example: "BASE = 'https://api.moves-app.com/api/1.1'",
    source: {
      url: "https://web.archive.org/web/20180703063554/https://dev.moves-app.com/docs/api",
      publisher: "Moves for Developers (Internet Archive capture)",
      checkedOn: READ,
      quote: "The base url to the API is: https://api.moves-app.com/api/1.1",
      via: "snapshot",
      capturedOn: "2018-07-03",
    },
  },
  {
    id: "google-health-feeds",
    entry: "google-health-2008",
    kind: "host",
    label: "Google Health data feeds (www.google.com/health/feeds)",
    literal: "https://www.google.com/health/feeds/",
    pattern: "\\bgoogle\\.com/health/feeds\\b",
    example: "GET https://www.google.com/health/feeds/profile/default",
    source: {
      url: "https://web.archive.org/web/20110617235942/http://code.google.com/apis/health/docs/2.0/developers_guide_protocol.html",
      publisher: "Google Health Data API developer's guide (Internet Archive capture)",
      checkedOn: READ,
      quote: "For Google Health, this parameter should be set to https://www.google.com/health/feeds/",
      via: "snapshot",
      capturedOn: "2011-06-17",
    },
  },
];
