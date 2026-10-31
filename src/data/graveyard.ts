/**
 * The Fitness API Graveyard (/graveyard): fitness and health developer APIs,
 * SDKs and endpoints that a vendor has shut down, scheduled to shut down, or
 * deprecated — each with the vendor's own words.
 *
 * Hand-maintained. SOURCING RULE (CLAUDE.md, ops/GEO.md; held by qa's
 * GRAVEYARD-* gates):
 * - Every entry quotes the vendor's own notice: `source.url` is the vendor's
 *   page (or an Internet Archive capture of that page, with `capturedOn` the
 *   capture date), `source.checkedOn` the day we read it, and `source.quote` a
 *   verbatim passage from it. No quote, no entry. An event we know of but
 *   could not read on a vendor page this session is left out, not paraphrased
 *   from memory or press coverage.
 * - `end` keeps the precision of the source: "2026-11-02", "2025-12", "2026"
 *   or null where the vendor gives no date. Never sharpen it. "End of 2026" is
 *   "2026"; a countdown to it is labelled as counting to the end of the year.
 * - `status` is the vendor's state as the quote states it: "dead" when the
 *   vendor says it was removed, turned off or is no longer usable; "dying"
 *   when the vendor names a future date for the end (qa fails the build once
 *   that date is no longer in the future, so a passed date forces a re-read);
 *   "deprecated" when the vendor says deprecated or unsupported but names no
 *   end, or the thing still runs as-is.
 * - `launched` only when a primary record dates it (a registry's first-publish
 *   time counts, labelled as such). Otherwise null — "not sourced" on the page.
 * - `via: "snapshot"` marks a source read through
 *   .github/workflows/source-snapshot.yml because its host is blocked from
 *   the writing environment; each such entry has a row in
 *   ops/sources/evidence/graveyard.json whose quote is a substring of
 *   `source.quote` (GRAVEYARD-EVIDENCE), and source-quotes.yml re-reads it.
 * - `summary` is our sentence and states nothing the quoted page does not.
 *
 * Changing an entry means re-reading its source. Bumping `checkedOn` without
 * that read falsifies the date the reader is trusting (CLAUDE.md, Freshness).
 */

export type GraveStatus = "dead" | "dying" | "deprecated";

export type GraveSource = {
  url: string;
  /** Who published the page, as a reader would name them. */
  publisher: string;
  /** The day this session read the page (YYYY-MM-DD). */
  checkedOn: string;
  /** Verbatim from the page. */
  quote: string;
  via: "direct" | "snapshot";
  /** For an Internet Archive capture: the capture's own date. */
  capturedOn?: string;
};

export type GraveEntry = {
  /** Stable anchor: /graveyard#<id>. */
  id: string;
  name: string;
  vendor: string;
  kind: "API" | "SDK" | "Endpoints" | "Auth method" | "Platform" | "Model package";
  status: GraveStatus;
  /** The end date, at the source's precision, or null when undated. */
  end: string | null;
  /** What happens on `end`, in the vendor's terms: "Turned off", "Removed"… */
  endLabel: string;
  launched: { date: string; label: string; url: string; evidence: string } | null;
  /** What the vendor names as the way forward. Empty: the vendor names none. */
  replacedBy: { label: string; href?: string }[];
  summary: string;
  source: GraveSource;
  /** Earlier dated steps on the way to `end`, each quoted from its own page. */
  milestones?: { date: string; label: string; url: string; quote: string }[];
  /** The page on this site that covers it in depth. */
  page?: { href: string; label: string };
};

const CHECKED = "2026-10-31";

export const GRAVEYARD: GraveEntry[] = [
  {
    id: "fitbit-web-api",
    name: "Fitbit Web API",
    vendor: "Google (Fitbit)",
    kind: "API",
    status: "dying",
    end: "2026-11-02",
    endLabel: "Turned off",
    launched: null,
    replacedBy: [{ label: "Google Health API", href: "/google-health-api" }],
    summary:
      "The legacy Fitbit Web API and the Fitbit OAuth endpoints. Google says requests fail with HTTP 410 Gone after the turn-off, and that integrations must move their users to the Google Health API and Google OAuth 2.0.",
    source: {
      url: "https://developers.google.com/health/about",
      publisher: "Google for Developers",
      checkedOn: CHECKED,
      quote:
        "The Fitbit Web API and Fitbit OAuth endpoints will be turned off and will no longer function or sync data to or from Fitbit users. Requests to these endpoints will fail and return an HTTP 410 Gone status code.",
      via: "direct",
    },
    milestones: [
      {
        date: "2026-09-30",
        label: "End of support",
        url: "https://developers.google.com/health/about",
        quote:
          "Support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support.",
      },
    ],
    page: { href: "/fitbit-api-shutdown", label: "Fitbit API shutdown center" },
  },
  {
    id: "terra-legacy-widget-session",
    name: "Terra legacy widget session endpoint",
    vendor: "Terra",
    kind: "Endpoints",
    status: "dying",
    end: "2026-11-03",
    endLabel: "Deprecation planned",
    launched: null,
    replacedBy: [{ label: "POST access.tryterra.co/api/widget/session", href: "/integrate/terra-api" }],
    summary:
      "POST /auth/generateWidgetSession, the older way to open Terra's connect widget. Terra's documentation says existing integrations keep working until the planned deprecation, and that newer accounts cannot use it at all.",
    source: {
      url: "https://docs.tryterra.co/unified-api/user-authentication/implementation-terra-widget",
      publisher: "Terra documentation",
      checkedOn: CHECKED,
      quote:
        "Existing integrations keep working today, and the legacy endpoint is planned for deprecation on 3 November 2026. Accounts created after 3 September 2026 cannot use it at all.",
      via: "snapshot",
    },
    page: { href: "/integrate/terra-api", label: "How to integrate Terra" },
  },
  {
    id: "google-fit-apis",
    name: "Google Fit APIs (Android and REST)",
    vendor: "Google",
    kind: "API",
    status: "dying",
    end: "2026",
    endLabel: "End of support",
    launched: null,
    replacedBy: [
      { label: "Google Health API (cloud)", href: "/google-health-api" },
      { label: "Health Connect (Android)", href: "/health-connect" },
    ],
    summary:
      "Google's Fit platform APIs, including the REST API. Google gives an end of support, not a switch-off day, and recommends the Google Health API for cloud integrations and Health Connect for step tracking and mobile-first apps.",
    source: {
      url: "https://developer.android.com/health-and-fitness/health-connect/migration/fit",
      publisher: "Android Developers",
      checkedOn: CHECKED,
      quote:
        "The Google Fit API (including the REST API) will only be supported until the end of 2026. We recommend migrating to the Google Health API for cloud-based integrations or Health Connect for step tracking and mobile-first apps.",
      via: "direct",
    },
    milestones: [
      {
        date: "2024-05-01",
        label: "New developer sign-ups closed",
        url: "https://developers.google.com/fit",
        quote: "As of May 1, 2024, developers cannot sign up to use these APIs.",
      },
    ],
    page: { href: "/google-fit-shutdown", label: "Google Fit shutdown hub" },
  },
  {
    id: "google-fit-goals-api",
    name: "Google Fit Goals API",
    vendor: "Google",
    kind: "API",
    status: "dying",
    end: "2026",
    endLabel: "End of support",
    launched: null,
    replacedBy: [],
    summary:
      "The Fit API for the step and heart-point goals users set in the Google Fit app. Google's migration guide lists it among the features with no direct replacement, so goal tracking moves into your own app's logic.",
    source: {
      url: "https://developer.android.com/health-and-fitness/health-connect/migration/fit",
      publisher: "Android Developers",
      checkedOn: CHECKED,
      quote:
        "No replacement API available. Manage goal tracking and daily activity targets within your application logic.",
      via: "direct",
    },
    page: { href: "/google-fit-shutdown", label: "Google Fit shutdown hub" },
  },
  {
    id: "google-fit-sensors-ble-apis",
    name: "Google Fit Sensors API and BLE API",
    vendor: "Google",
    kind: "API",
    status: "dying",
    end: "2026",
    endLabel: "End of support",
    launched: null,
    replacedBy: [
      { label: "Android Sensors framework or Fused Location Provider (Sensors API)" },
      { label: "Android Bluetooth APIs (BLE API)" },
    ],
    summary:
      "Fit's real-time raw sensor API and its Bluetooth Low Energy sensor API. Google lists both as deprecated features with no direct API replacement and points to the standard Android APIs instead.",
    source: {
      url: "https://developer.android.com/health-and-fitness/health-connect/migration/fit",
      publisher: "Android Developers",
      checkedOn: CHECKED,
      quote:
        "The following features don't have a direct API replacement. Use the recommended Android standard APIs:",
      via: "direct",
    },
    page: { href: "/google-fit-shutdown", label: "Google Fit shutdown hub" },
  },
  {
    id: "strava-club-endpoints",
    name: "Strava Club Activities, Club Members and Club Admins endpoints",
    vendor: "Strava",
    kind: "Endpoints",
    status: "dead",
    end: "2026-09-01",
    endLabel: "Removed",
    launched: null,
    replacedBy: [],
    summary:
      "Three club endpoints of Strava's V3 API. Strava's changelog announced the removal on June 1, 2026 and records it under September 1, 2026, without naming a replacement.",
    source: {
      url: "https://developers.strava.com/docs/changelog/",
      publisher: "Strava V3 API changelog",
      checkedOn: CHECKED,
      quote: "Club Activities, Club Members, and Club Admins endpoints removed",
      via: "snapshot",
    },
    milestones: [
      {
        date: "2026-06-01",
        label: "Removal announced",
        url: "https://developers.strava.com/docs/changelog/",
        quote: "Club Activities, Club Members, and Club Admins endpoints will be removed on September 1, 2026",
      },
    ],
    page: { href: "/integrate/strava-api", label: "How to integrate the Strava API" },
  },
  {
    id: "samsung-health-sdk-android",
    name: "Samsung Health SDK for Android",
    vendor: "Samsung",
    kind: "SDK",
    status: "deprecated",
    end: "2025-07-31",
    endLabel: "Deprecated",
    launched: null,
    replacedBy: [{ label: "Samsung Health Data SDK", href: "/integrate/samsung-health-api" }],
    summary:
      "The partner SDK for sharing data between Samsung Health on Android phones and third-party apps. Samsung's overview page says it is deprecated and points to the Samsung Health Data SDK. The misspelling in the quote is Samsung's.",
    source: {
      url: "https://developer.samsung.com/health/android/overview.html",
      publisher: "Samsung Developer",
      checkedOn: CHECKED,
      quote:
        "Samsung Health SDK for Android has been depricated as of 31 July, 2025. Please use Samsung Health Data SDK to access Samsung Health data to integrate with Samsung Health.",
      via: "snapshot",
    },
    page: { href: "/integrate/samsung-health-api", label: "How to integrate Samsung Health" },
  },
  {
    id: "oura-api-v1",
    name: "Oura API V1",
    vendor: "Oura",
    kind: "API",
    status: "dead",
    end: "2024-01-22",
    endLabel: "Removed",
    launched: null,
    replacedBy: [{ label: "Oura API V2", href: "/integrate/oura-api" }],
    summary: "The first version of Oura's cloud API. Oura's getting-started page dates its removal and links the V2 documentation.",
    source: {
      url: "https://cloud.ouraring.com/docs/",
      publisher: "Oura API documentation",
      checkedOn: CHECKED,
      quote: "The V1 API was removed on January 22nd, 2024.",
      via: "snapshot",
    },
    page: { href: "/integrate/oura-api", label: "How to integrate the Oura API" },
  },
  {
    id: "oura-personal-access-tokens",
    name: "Oura personal access tokens",
    vendor: "Oura",
    kind: "Auth method",
    status: "dead",
    end: "2025-12",
    endLabel: "Deprecated, no longer available",
    launched: null,
    replacedBy: [{ label: "OAuth 2.0 API applications", href: "/fix/oura-personal-access-token-deprecated" }],
    summary:
      "Single-account tokens for reading your own Oura data from a script. Oura's API specification says they can no longer be used, which leaves the OAuth 2.0 flow for every integration.",
    source: {
      url: "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
      publisher: "Oura API V2 specification",
      checkedOn: CHECKED,
      quote: "Please note that personal access tokens were deprecated in December 2025 and are no longer available for use.",
      via: "snapshot",
    },
    page: { href: "/fix/oura-personal-access-token-deprecated", label: "Oura personal access token deprecated" },
  },
  {
    id: "whoop-api-v1",
    name: "WHOOP API v1",
    vendor: "WHOOP",
    kind: "API",
    status: "deprecated",
    end: null,
    endLabel: "No longer supported",
    launched: null,
    replacedBy: [{ label: "WHOOP API v2", href: "/integrate/whoop-api" }],
    summary:
      "Version 1 of the WHOOP Developer API and its integer-ID webhooks. WHOOP's migration guide says v1 is no longer supported and gives no date for switching it off.",
    source: {
      url: "https://developer.whoop.com/docs/developing/v1-v2-migration/",
      publisher: "WHOOP Developer Platform",
      checkedOn: CHECKED,
      quote:
        "The v1 API is no longer supported and any new features or functionality will be added to v2 only.",
      via: "snapshot",
    },
    page: { href: "/integrate/whoop-api", label: "How to integrate the WHOOP API" },
  },
  {
    id: "mediapipe-legacy-pose",
    name: "MediaPipe Pose (Legacy Solution)",
    vendor: "Google",
    kind: "SDK",
    status: "deprecated",
    end: "2023-05-10",
    endLabel: "Upgraded to a new solution",
    launched: {
      date: "2020-11-10",
      label: "@mediapipe/pose first published to npm",
      url: "https://registry.npmjs.org/@mediapipe/pose",
      evidence: '"created": "2020-11-10T20:41:53.840Z"',
    },
    replacedBy: [{ label: "MediaPipe Pose Landmarker (Tasks API)", href: "/motion/mediapipe-pose-landmarker-models" }],
    summary:
      "The original MediaPipe Pose solution (mp.solutions.pose and the @mediapipe/pose web package). Google upgraded it to Pose Landmarker; its legacy-solutions guide says the code and prebuilt binaries stay available on an as-is basis.",
    source: {
      url: "https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/docs/solutions/pose.md",
      publisher: "MediaPipe repository (Google)",
      checkedOn: CHECKED,
      quote: "As of May 10, 2023, this solution was upgraded to a new MediaPipe Solution.",
      via: "direct",
    },
    milestones: [
      {
        date: "2023-03-01",
        label: "Support ended for the listed legacy solutions",
        url: "https://developers.google.com/edge/mediapipe/solutions/guide",
        quote: "We have ended support for the MediaPipe Legacy Solutions listed here as of March 1, 2023.",
      },
    ],
    page: { href: "/motion/mediapipe-pose-landmarker-models", label: "MediaPipe Pose Landmarker models" },
  },
  {
    id: "tfjs-posenet",
    name: "PoseNet for TensorFlow.js (@tensorflow-models/posenet)",
    vendor: "Google (TensorFlow.js)",
    kind: "Model package",
    status: "deprecated",
    end: null,
    endLabel: "Deprecated",
    launched: {
      date: "2018-05-07",
      label: "@tensorflow-models/posenet first published to npm",
      url: "https://registry.npmjs.org/@tensorflow-models/posenet",
      evidence: '"created": "2018-05-07T15:56:50.457Z"',
    },
    replacedBy: [{ label: "@tensorflow-models/pose-detection", href: "/motion/movenet-models" }],
    summary:
      "The PoseNet browser pose model package. Its README says it is deprecated in favour of the pose-detection package and gives no date; the last version on npm, 2.2.2, was published on March 10, 2021.",
    source: {
      url: "https://raw.githubusercontent.com/tensorflow/tfjs-models/master/posenet/README.md",
      publisher: "tfjs-models repository (TensorFlow)",
      checkedOn: CHECKED,
      quote: "This package is deprecated in favor of the new pose-detection package.",
      via: "direct",
    },
  },
  {
    id: "strava-running-races",
    name: "Strava Running Races endpoints",
    vendor: "Strava",
    kind: "Endpoints",
    status: "dead",
    end: "2021-11-01",
    endLabel: "Removed",
    launched: null,
    replacedBy: [],
    summary:
      "The get running race and list races endpoints of Strava's V3 API. The changelog entry of October 1, 2021 set the empty-response and removal dates and named no replacement.",
    source: {
      url: "https://developers.strava.com/docs/changelog/",
      publisher: "Strava V3 API changelog",
      checkedOn: CHECKED,
      quote:
        "The get running race and list races endpoints will start to return empty values starting October 15th, 2021, and will be removed completely by November 1st, 2021.",
      via: "snapshot",
    },
    page: { href: "/integrate/strava-api", label: "How to integrate the Strava API" },
  },
  {
    id: "moves-api",
    name: "Moves app and developer API",
    vendor: "Moves",
    kind: "API",
    status: "dead",
    end: "2018-07-31",
    endLabel: "Shut down",
    launched: null,
    replacedBy: [],
    summary:
      "The Moves activity-tracking app and its developer site, dev.moves-app.com. By December 31, 2018 the Internet Archive's capture of the developer site shows only this notice.",
    source: {
      url: "https://web.archive.org/web/20181231164810/https://dev.moves-app.com/",
      publisher: "Moves (Internet Archive capture)",
      checkedOn: CHECKED,
      quote: "As of July 31, 2018, you can no longer log in or use the Moves app.",
      via: "snapshot",
      capturedOn: "2018-12-31",
    },
  },
  {
    id: "google-health-2008",
    name: "Google Health (personal health record service)",
    vendor: "Google",
    kind: "Platform",
    status: "dead",
    end: "2012-01-01",
    endLabel: "Retired",
    launched: null,
    replacedBy: [],
    summary:
      "Google's earlier personal health record service, not the Google Health API that replaces the Fitbit Web API. Google's blog post of June 24, 2011 gave the retirement date and a year of data downloads; its help page later said the data was being deleted from January 2, 2013.",
    source: {
      url: "https://web.archive.org/web/20120107124413/http://googleblog.blogspot.com/2011/06/update-on-google-health-and-google.html",
      publisher: "Official Google Blog (Internet Archive capture)",
      checkedOn: CHECKED,
      quote: "Google Health (retiring January 1, 2012; data available for download through January 1, 2013)",
      via: "snapshot",
      capturedOn: "2012-01-07",
    },
    milestones: [
      {
        date: "2013-01-02",
        label: "Remaining data deleted",
        url: "https://web.archive.org/web/20130111034326/http://www.google.com/intl/en_us/health/about/",
        quote:
          "All Google Health user accounts have been deactivated, and all data stored in them is being systematically deleted from Google’s systems starting on January 2, 2013.",
      },
    ],
  },
];

export const GRAVEYARD_PATH = "/graveyard";
export const GRAVEYARD_EMBED_PATH = "/embed/graveyard";
export const GRAVEYARD_JSON_PATH = "/graveyard/data.json";

export const STATUS_LABEL: Record<GraveStatus, string> = {
  dead: "Dead",
  dying: "Dying",
  deprecated: "Deprecated",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Keeps the precision of the source date — never sharpens "2026" to a day. */
export function fmtGraveDate(d: string | null): string {
  if (!d) return "no date given";
  if (/^\d{4}$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  const mn = MONTHS[parseInt(m, 10) - 1];
  return day ? `${mn} ${parseInt(day, 10)}, ${y}` : `${mn} ${y}`;
}

/** The last day a fuzzy date can mean: "2026" → 2026-12-31, "2025-12" →
 *  2025-12-31. Used where a comparison must not claim an end is past before
 *  the source's whole period is: the dying gate and the countdown. */
export function endOfPeriod(d: string): string {
  if (/^\d{4}$/.test(d)) return `${d}-12-31`;
  if (/^\d{4}-\d{2}$/.test(d)) {
    const [y, m] = d.split("-").map(Number);
    const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return `${d}-${String(last).padStart(2, "0")}`;
  }
  return d;
}

/** True when `end` is a day, not a month or a year. */
export function isExactDay(d: string | null): boolean {
  return !!d && /^\d{4}-\d{2}-\d{2}$/.test(d);
}

export function graveYear(e: GraveEntry): string | null {
  return e.end ? e.end.slice(0, 4) : null;
}

/** Newest first by end; undated entries last, in source order. */
export function graveyardSorted(): GraveEntry[] {
  return [...GRAVEYARD].sort((a, b) => {
    if (!a.end && !b.end) return 0;
    if (!a.end) return 1;
    if (!b.end) return -1;
    return endOfPeriod(a.end) < endOfPeriod(b.end) ? 1 : -1;
  });
}

/** The newest day any entry was read: the page's dateModified. */
export function graveyardCheckedOn(): string {
  return GRAVEYARD.map((e) => e.source.checkedOn).sort().at(-1) ?? CHECKED;
}

export function graveyardVendors(): string[] {
  return [...new Set(GRAVEYARD.map((e) => e.vendor))].sort((a, b) => a.localeCompare(b));
}

/** Share text for one entry, the same in the copy button and the PNG card. */
export function graveShareText(e: GraveEntry, url: string): string {
  const when = e.end ? `${e.endLabel}: ${fmtGraveDate(e.end)}` : e.endLabel;
  const next = e.replacedBy.length ? `Replaced by: ${e.replacedBy.map((r) => r.label).join("; ")}` : "No replacement named by the vendor";
  return `🪦 ${e.name} (${e.vendor}) — ${STATUS_LABEL[e.status].toLowerCase()}. ${when}. ${next}.\n“${e.source.quote}” — ${e.source.publisher}\n${url}`;
}
