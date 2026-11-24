/**
 * "Weather" for the Python clients of vendor cloud APIs in
 * src/data/libraries.ts: issues opened on each GitHub repository in the last
 * 14 and 90 days, how many have a title matching LIBRARY_WEATHER_KEYWORDS,
 * the newest such issue, and the latest release. Rendered as the "Weather"
 * box on /libraries/<slug>.
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/fetch-library-weather.mjs
 * (weekly in .github/workflows/library-weather.yml; --offline reparses
 * .cache/library-weather).
 *
 * A count of issue titles is a signal that people are reporting breakage,
 * not proof the library is broken.
 */

export type LibraryWeather = {
  slug: string;
  name: string;
  repo: string;
  /** The repository's issue list, filtered to the long window. */
  issuesUrl: string;
  /** The day the issues were read (UTC); both windows end on it. */
  asOf: string;
  /** First day of each window: asOf minus 14 and 90 days. */
  since: { short: string; long: string };
  /** Issues (no pull requests) opened on or after since.short / since.long. */
  opened: { short: number; long: number };
  /** Of those, the ones whose title matches LIBRARY_WEATHER_KEYWORDS. */
  authRelated: { short: number; long: number };
  /** The newest matching issue in the long window; the title is cut at 140 characters. */
  newestAuthRelated: { number: number; title: string; url: string; createdOn: string; matched: string[] } | null;
  /** GitHub's releases/latest; null when the repository has published no release. */
  latestRelease: { tag: string; publishedOn: string; url: string } | null;
  releaseCheckedOn: string;
};

/** The earliest day any row's issues were read. */
export const LIBRARY_WEATHER_FETCHED_ON = "2026-11-24";

/** Rows the generator expects; it refuses to write fewer. */
export const LIBRARY_WEATHER_EXPECTED_ROWS = 7;

export const LIBRARY_WEATHER_WINDOWS = {"short":14,"long":90};

/** Matched case-insensitively against issue titles, at the start of a word (src/lib/libraryWeather.mjs). */
export const LIBRARY_WEATHER_KEYWORDS: string[] = ["login","log in","auth","oauth","403","429","broken","MFA"];

export const LIBRARY_WEATHER: LibraryWeather[] = [
  {
    "slug": "garminconnect",
    "name": "garminconnect",
    "repo": "cyberjunky/python-garminconnect",
    "issuesUrl": "https://github.com/cyberjunky/python-garminconnect/issues?q=is%3Aissue%20created%3A%3E%3D2026-08-26",
    "asOf": "2026-11-24",
    "since": {
      "short": "2026-11-10",
      "long": "2026-08-26"
    },
    "opened": {
      "short": 0,
      "long": 12
    },
    "authRelated": {
      "short": 0,
      "long": 3
    },
    "newestAuthRelated": {
      "number": 453,
      "title": "0.3.17 mobile+requests: first SSO request returns 429 without Retry-After",
      "url": "https://github.com/cyberjunky/python-garminconnect/issues/453",
      "createdOn": "2026-10-07",
      "matched": [
        "429"
      ]
    },
    "latestRelease": {
      "tag": "0.3.20",
      "publishedOn": "2026-10-23",
      "url": "https://github.com/cyberjunky/python-garminconnect/releases/tag/0.3.20"
    },
    "releaseCheckedOn": "2026-11-24"
  },
  {
    "slug": "garth",
    "name": "garth",
    "repo": "matin/garth",
    "issuesUrl": "https://github.com/matin/garth/issues?q=is%3Aissue%20created%3A%3E%3D2026-08-26",
    "asOf": "2026-11-24",
    "since": {
      "short": "2026-11-10",
      "long": "2026-08-26"
    },
    "opened": {
      "short": 0,
      "long": 1
    },
    "authRelated": {
      "short": 0,
      "long": 0
    },
    "newestAuthRelated": null,
    "latestRelease": {
      "tag": "v0.8.0",
      "publishedOn": "2026-03-28",
      "url": "https://github.com/matin/garth/releases/tag/v0.8.0"
    },
    "releaseCheckedOn": "2026-11-24"
  },
  {
    "slug": "stravalib",
    "name": "stravalib",
    "repo": "stravalib/stravalib",
    "issuesUrl": "https://github.com/stravalib/stravalib/issues?q=is%3Aissue%20created%3A%3E%3D2026-08-26",
    "asOf": "2026-11-24",
    "since": {
      "short": "2026-11-10",
      "long": "2026-08-26"
    },
    "opened": {
      "short": 3,
      "long": 8
    },
    "authRelated": {
      "short": 0,
      "long": 1
    },
    "newestAuthRelated": {
      "number": 740,
      "title": "The OAuth token request sends the client secret in the URL query string",
      "url": "https://github.com/stravalib/stravalib/issues/740",
      "createdOn": "2026-08-26",
      "matched": [
        "oauth"
      ]
    },
    "latestRelease": {
      "tag": "v2.6.0",
      "publishedOn": "2026-08-27",
      "url": "https://github.com/stravalib/stravalib/releases/tag/v2.6.0"
    },
    "releaseCheckedOn": "2026-11-24"
  },
  {
    "slug": "oura-ring",
    "name": "oura-ring",
    "repo": "hedgertronic/oura-ring",
    "issuesUrl": "https://github.com/hedgertronic/oura-ring/issues?q=is%3Aissue%20created%3A%3E%3D2026-08-26",
    "asOf": "2026-11-24",
    "since": {
      "short": "2026-11-10",
      "long": "2026-08-26"
    },
    "opened": {
      "short": 0,
      "long": 0
    },
    "authRelated": {
      "short": 0,
      "long": 0
    },
    "newestAuthRelated": null,
    "latestRelease": {
      "tag": "v1.0.2",
      "publishedOn": "2026-11-09",
      "url": "https://github.com/hedgertronic/oura-ring/releases/tag/v1.0.2"
    },
    "releaseCheckedOn": "2026-11-24"
  },
  {
    "slug": "oura-python",
    "name": "oura",
    "repo": "turing-complet/python-ouraring",
    "issuesUrl": "https://github.com/turing-complet/python-ouraring/issues?q=is%3Aissue%20created%3A%3E%3D2026-08-26",
    "asOf": "2026-11-24",
    "since": {
      "short": "2026-11-10",
      "long": "2026-08-26"
    },
    "opened": {
      "short": 0,
      "long": 0
    },
    "authRelated": {
      "short": 0,
      "long": 0
    },
    "newestAuthRelated": null,
    "latestRelease": {
      "tag": "v1.3.0",
      "publishedOn": "2024-04-23",
      "url": "https://github.com/turing-complet/python-ouraring/releases/tag/v1.3.0"
    },
    "releaseCheckedOn": "2026-11-24"
  },
  {
    "slug": "python-fitbit",
    "name": "fitbit",
    "repo": "orcasgit/python-fitbit",
    "issuesUrl": "https://github.com/orcasgit/python-fitbit/issues?q=is%3Aissue%20created%3A%3E%3D2026-08-26",
    "asOf": "2026-11-24",
    "since": {
      "short": "2026-11-10",
      "long": "2026-08-26"
    },
    "opened": {
      "short": 0,
      "long": 0
    },
    "authRelated": {
      "short": 0,
      "long": 0
    },
    "newestAuthRelated": null,
    "latestRelease": {
      "tag": "0.2.3",
      "publishedOn": "2016-09-06",
      "url": "https://github.com/orcasgit/python-fitbit/releases/tag/0.2.3"
    },
    "releaseCheckedOn": "2026-11-24"
  },
  {
    "slug": "withings-api",
    "name": "withings-api",
    "repo": "vangorra/python_withings_api",
    "issuesUrl": "https://github.com/vangorra/python_withings_api/issues?q=is%3Aissue%20created%3A%3E%3D2026-08-26",
    "asOf": "2026-11-24",
    "since": {
      "short": "2026-11-10",
      "long": "2026-08-26"
    },
    "opened": {
      "short": 0,
      "long": 0
    },
    "authRelated": {
      "short": 0,
      "long": 0
    },
    "newestAuthRelated": null,
    "latestRelease": {
      "tag": "2.4.0",
      "publishedOn": "2022-02-08",
      "url": "https://github.com/vangorra/python_withings_api/releases/tag/2.4.0"
    },
    "releaseCheckedOn": "2026-11-24"
  }
];
