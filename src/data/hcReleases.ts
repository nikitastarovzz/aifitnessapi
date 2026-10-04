/**
 * Every androidx.health.connect:connect-client release, read from Google's Jetpack release notes.
 *
 * GENERATED — do not hand-edit; regenerate with node scripts/fetch-hc-releases.mjs
 *
 * Source: https://developer.android.com/jetpack/androidx/releases/health-connect
 * Fetched: 2026-10-04
 *
 * Copied from the page: version, date, Google's release sentence, the bold
 * section labels and the first bullet. Derived: `stage`, from the version
 * string's pre-release suffix (none = stable) — the version is beside it.
 * connect-testing releases on the same page are excluded; a release counts
 * only when its own paragraph names androidx.health.connect:connect-client:<version>.
 */

/** The date the generator last read the release notes. */
export const HC_RELEASES_FETCHED_ON = "2026-10-04";

export const HC_RELEASES_SOURCE = "https://developer.android.com/jetpack/androidx/releases/health-connect";

/** Google's "Last updated" footer stamp on the page at read time. */
export const HC_RELEASES_SOURCE_UPDATED: string | null = "2026-08-26";

export type HcReleaseStage = "alpha" | "beta" | "rc" | "stable";

export type HcRelease = {
  /** e.g. "1.1.0-rc03". */
  version: string;
  /** ISO date parsed from `dateText`. */
  date: string | null;
  /** The date line as Google prints it, e.g. "July 16, 2025". */
  dateText: string | null;
  /** Derived from the suffix of `version`. */
  stage: HcReleaseStage;
  /** Major.minor, e.g. "1.1". */
  series: string;
  /** The h2 the release sits under on Google's page, e.g. "Version 1.1". */
  section: string | null;
  /** Google's release paragraph, verbatim (date line removed). */
  releaseSentence: string | null;
  /** Google's bold section labels in order, e.g. ["API Changes", "Bug Fixes"]. */
  headings: string[];
  /** The first bullet of the notes, verbatim; null when none. */
  firstNote: string | null;
  /** How many bullets the notes carry. */
  noteCount: number;
  /** Deep link to the release on Google's page. */
  url: string;
};

/** Newest first, as Google lists them. */
export const HC_RELEASES: HcRelease[] = [
  {
    "version": "1.2.0-alpha06",
    "date": "2026-08-26",
    "dateText": "August 26, 2026",
    "stage": "alpha",
    "series": "1.2",
    "section": "Version 1.2",
    "releaseSentence": "androidx.health.connect:connect-client:1.2.0-alpha06, androidx.health.connect:connect-client-external-protobuf:1.2.0-alpha06, and androidx.health.connect:connect-client-proto:1.2.0-alpha06 are released. Version 1.2.0-alpha06 contains these commits.",
    "headings": [
      "Bug Fixes"
    ],
    "firstNote": "Updated Health Connect release and dev signing certificates.",
    "noteCount": 1,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.2.0-alpha06"
  },
  {
    "version": "1.2.0-alpha05",
    "date": "2026-08-12",
    "dateText": "August 12, 2026",
    "stage": "alpha",
    "series": "1.2",
    "section": "Version 1.2",
    "releaseSentence": "androidx.health.connect:connect-client:1.2.0-alpha05, androidx.health.connect:connect-client-external-protobuf:1.2.0-alpha05, and androidx.health.connect:connect-client-proto:1.2.0-alpha05 are released. Version 1.2.0-alpha05 contains these commits.",
    "headings": [
      "New Features",
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "The minimum SDK requirement for this library is now API 24 (minSdk 24). (07cc6ea)",
    "noteCount": 4,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.2.0-alpha05"
  },
  {
    "version": "1.2.0-alpha04",
    "date": "2026-04-22",
    "dateText": "April 22, 2026",
    "stage": "alpha",
    "series": "1.2",
    "section": "Version 1.2",
    "releaseSentence": "androidx.health.connect:connect-client:1.2.0-alpha04, androidx.health.connect:connect-client-external-protobuf:1.2.0-alpha04, and androidx.health.connect:connect-client-proto:1.2.0-alpha04 are released. Version 1.2.0-alpha04 contains these commits.",
    "headings": [
      "API Changes"
    ],
    "firstNote": "Matchmaking APIs: Introduced new methods to help users discover and connect compatible data sources that can provide the health data your app needs. checkIfMatchmakingIsPossible: A suspend function to verify if there are any matching applications or devices available to show before launching the flow.",
    "noteCount": 2,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.2.0-alpha04"
  },
  {
    "version": "1.2.0-alpha03",
    "date": "2026-03-25",
    "dateText": "March 25, 2026",
    "stage": "alpha",
    "series": "1.2",
    "section": "Version 1.2",
    "releaseSentence": "androidx.health.connect:connect-client:1.2.0-alpha03, androidx.health.connect:connect-client-external-protobuf:1.2.0-alpha03, and androidx.health.connect:connect-client-proto:1.2.0-alpha03 are released. Version 1.2.0-alpha03 contains these commits.",
    "headings": [
      "New Features",
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Introduce new fields to ExerciseSessionRecord and ExerciseSegment to support richer exercise tracking (I3c176)",
    "noteCount": 5,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.2.0-alpha03"
  },
  {
    "version": "1.2.0-alpha02",
    "date": "2025-10-08",
    "dateText": "October 08, 2025",
    "stage": "alpha",
    "series": "1.2",
    "section": "Version 1.2",
    "releaseSentence": "androidx.health.connect:connect-client:1.2.0-alpha02, androidx.health.connect:connect-client-external-protobuf:1.2.0-alpha02, and androidx.health.connect:connect-client-proto:1.2.0-alpha02 are released. Version 1.2.0-alpha02 contains these commits.",
    "headings": [
      "API Changes"
    ],
    "firstNote": "Adds new Device Type enums (I86ce3)",
    "noteCount": 1,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.2.0-alpha02"
  },
  {
    "version": "1.2.0-alpha01",
    "date": "2025-07-30",
    "dateText": "July 30, 2025",
    "stage": "alpha",
    "series": "1.2",
    "section": "Version 1.2",
    "releaseSentence": "androidx.health.connect:connect-client:1.2.0-alpha01, androidx.health.connect:connect-client-external-protobuf:1.2.0-alpha01, and androidx.health.connect:connect-client-proto:1.2.0-alpha01 are released. Version 1.2.0-alpha01 contains these commits.",
    "headings": [
      "New Features"
    ],
    "firstNote": "Add backwards compatibility support for Skin Temperature (d04b1df)",
    "noteCount": 3,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.2.0-alpha01"
  },
  {
    "version": "1.1.0",
    "date": "2025-10-08",
    "dateText": "October 08, 2025",
    "stage": "stable",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0, androidx.health.connect:connect-client-external-protobuf:1.1.0, and androidx.health.connect:connect-client-proto:1.1.0 have been promoted to its first stable release with no changes since its previous RC release.",
    "headings": [],
    "firstNote": null,
    "noteCount": 0,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0"
  },
  {
    "version": "1.1.0-rc03",
    "date": "2025-07-16",
    "dateText": "July 16, 2025",
    "stage": "rc",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-rc03, androidx.health.connect:connect-client-external-protobuf:1.1.0-rc03, and androidx.health.connect:connect-client-proto:1.1.0-rc03 are released. Version 1.1.0-rc03 contains these commits.",
    "headings": [
      "Bug Fixes"
    ],
    "firstNote": "Fixed IllegalArgumentException for aggregations over a DST boundary. (Ic9e4f)",
    "noteCount": 1,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-rc03"
  },
  {
    "version": "1.1.0-rc02",
    "date": "2025-06-04",
    "dateText": "June 4, 2025",
    "stage": "rc",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-rc02, androidx.health.connect:connect-client-external-protobuf:1.1.0-rc02, and androidx.health.connect:connect-client-proto:1.1.0-rc02 are released. Version 1.1.0-rc02 contains these commits.",
    "headings": [
      "Bug Fixes"
    ],
    "firstNote": "Added support for missing device types (Ied486)",
    "noteCount": 2,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-rc02"
  },
  {
    "version": "1.1.0-rc01",
    "date": "2025-04-23",
    "dateText": "April 23, 2025",
    "stage": "rc",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-rc01, androidx.health.connect:connect-client-external-protobuf:1.1.0-rc01, and androidx.health.connect:connect-client-proto:1.1.0-rc01 are released. Version 1.1.0-rc01 contains these commits.",
    "headings": [
      "API Changes"
    ],
    "firstNote": "Added mindfulness feature availability flag for developers. (I936a8)",
    "noteCount": 1,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-rc01"
  },
  {
    "version": "1.1.0-beta02",
    "date": "2025-04-09",
    "dateText": "April 9, 2025",
    "stage": "beta",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-beta02, androidx.health.connect:connect-client-external-protobuf:1.1.0-beta02, and androidx.health.connect:connect-client-proto:1.1.0-beta02 are released. Version 1.1.0-beta02 contains these commits.",
    "headings": [
      "New Features",
      "Bug Fixes"
    ],
    "firstNote": "Added experimental Personal Health Record (PHR) APIs for reading and writing medical data, based on the Fast Healthcare Interoperability Resources (FHIR®) format. PHR APIs include: A FEATURE_PERSONAL_HEALTH_RECORD constant to check if PHR is available through the feature availability API.",
    "noteCount": 6,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-beta02"
  },
  {
    "version": "1.1.0-beta01",
    "date": "2025-03-12",
    "dateText": "March 12, 2025",
    "stage": "beta",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-beta01, androidx.health.connect:connect-client-external-protobuf:1.1.0-beta01, and androidx.health.connect:connect-client-proto:1.1.0-beta01 are released. Version 1.1.0-beta01 contains these commits.",
    "headings": [
      "Bug Fixes"
    ],
    "firstNote": "Enable calculation for all aggregation types across all android versions. (I8edf)",
    "noteCount": 1,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-beta01"
  },
  {
    "version": "1.1.0-alpha12",
    "date": "2025-02-26",
    "dateText": "February 26, 2025",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha12, androidx.health.connect:connect-client-external-protobuf:1.1.0-alpha12, and androidx.health.connect:connect-client-proto:1.1.0-alpha12 are released. Version 1.1.0-alpha12 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Make Metadata constructor internal (I1fb8f",
    "noteCount": 9,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha12"
  },
  {
    "version": "1.1.0-alpha11",
    "date": "2025-01-15",
    "dateText": "January 15, 2025",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha11, androidx.health.connect:connect-client-external-protobuf:1.1.0-alpha11, and androidx.health.connect:connect-client-proto:1.1.0-alpha11 are released. Version 1.1.0-alpha11 contains these commits.",
    "headings": [
      "New Features",
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Updated background and history read permissions to support Android 13 and below.",
    "noteCount": 5,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha11"
  },
  {
    "version": "1.1.0-alpha10",
    "date": "2024-10-16",
    "dateText": "October 16, 2024",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha10, androidx.health.connect:connect-client-external-protobuf:1.1.0-alpha10, and androidx.health.connect:connect-client-proto:1.1.0-alpha10 are released. Version 1.1.0-alpha10 contains these commits.",
    "headings": [
      "New Features",
      "Security Fixes"
    ],
    "firstNote": "Added SkinTemperature aggregation types. (Ibe123)",
    "noteCount": 6,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha10"
  },
  {
    "version": "1.1.0-alpha09",
    "date": "2024-09-18",
    "dateText": "September 18, 2024",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha09, androidx.health.connect:connect-client-external-protobuf:1.1.0-alpha09, and androidx.health.connect:connect-client-proto:1.1.0-alpha09 are released. Version 1.1.0-alpha09 contains these commits.",
    "headings": [
      "New Features"
    ],
    "firstNote": "Add background reads permission, guarded by feature availability. (I01036, I44db9)",
    "noteCount": 1,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha09"
  },
  {
    "version": "1.1.0-alpha08",
    "date": "2024-09-04",
    "dateText": "September 4, 2024",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha08, androidx.health.connect:connect-client-external-protobuf:1.1.0-alpha08, and androidx.health.connect:connect-client-proto:1.1.0-alpha08 are released. Version 1.1.0-alpha08 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Set default value for features variable in HealthConnectClient. (I788dc)",
    "noteCount": 5,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha08"
  },
  {
    "version": "1.1.0-alpha07",
    "date": "2024-01-10",
    "dateText": "January 10, 2024",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha07 is released. Version 1.1.0-alpha07 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Return SDK_UNAVAILABLE when #getSdkStatus is called from a profile user context. (I91df3)",
    "noteCount": 3,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha07"
  },
  {
    "version": "1.1.0-alpha06",
    "date": "2023-10-18",
    "dateText": "October 18, 2023",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha06 is released. Version 1.1.0-alpha06 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Makes recordingMethod definitions public. (I401fb)",
    "noteCount": 2,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha06"
  },
  {
    "version": "1.1.0-alpha05",
    "date": "2023-10-04",
    "dateText": "October 4, 2023",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha05 is released. Version 1.1.0-alpha05 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Added intent that navigates to health connect data management screen. (Ibf591)",
    "noteCount": 5,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha05"
  },
  {
    "version": "1.1.0-alpha04",
    "date": "2023-09-06",
    "dateText": "September 6, 2023",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha04 is released. Version 1.1.0-alpha04 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Java only: rename the getHasMore() field on ChangesResponse to hasMore(). (I80695)",
    "noteCount": 4,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha04"
  },
  {
    "version": "1.1.0-alpha03",
    "date": "2023-07-26",
    "dateText": "July 26, 2023",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha03 is released. Version 1.1.0-alpha03 contains these commits.",
    "headings": [
      "New Features",
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "API for reading and writing Exercise routes: Added ExerciseRouteResult to ExerciseSessionRecord",
    "noteCount": 7,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha03"
  },
  {
    "version": "1.1.0-alpha02",
    "date": "2023-06-21",
    "dateText": "June 21, 2023",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha02 is released. Version 1.1.0-alpha02 contains these commits.",
    "headings": [
      "Bug Fixes"
    ],
    "firstNote": "Fixed HealthDataSdkService leak (Ia3ba5)",
    "noteCount": 2,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha02"
  },
  {
    "version": "1.1.0-alpha01",
    "date": "2023-06-07",
    "dateText": "June 7, 2023",
    "stage": "alpha",
    "series": "1.1",
    "section": "Version 1.1",
    "releaseSentence": "androidx.health.connect:connect-client:1.1.0-alpha01 is released. This version is developed in an internal branch.",
    "headings": [
      "New Features",
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Support for the Android 14 framework version of Health Connect. This SDK is a prerequisite for Android 14. Apps will not be able to integrate with Health Connect on Android 14 without it.",
    "noteCount": 9,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.1.0-alpha01"
  },
  {
    "version": "1.0.0-alpha11",
    "date": "2023-02-22",
    "dateText": "February 22, 2023",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha11 is released. Version 1.0.0-alpha11 contains these commits.",
    "headings": [
      "API Changes"
    ],
    "firstNote": "Adding an intent to use for opening Health Connect. (Ic8055)",
    "noteCount": 4,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha11"
  },
  {
    "version": "1.0.0-alpha10",
    "date": "2023-01-25",
    "dateText": "January 25, 2023",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha10 is released. Version 1.0.0-alpha10 contains these commits.",
    "headings": [
      "API Changes"
    ],
    "firstNote": "ExerciseEventRecord, ExerciseLapRecord,ExerciseRepititionRecord and SwimmingStrokesRecord are no longer supported as RecordTypes. They can no longer be written or read from HealthConnect. Remove any reference to these data types from the HealthConnect integration. (If7ca2)",
    "noteCount": 2,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha10"
  },
  {
    "version": "1.0.0-alpha09",
    "date": "2023-01-11",
    "dateText": "January 11, 2023",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha09 is released. Version 1.0.0-alpha09 contains these commits.",
    "headings": [
      "New Features",
      "API Changes"
    ],
    "firstNote": "Added 2 new female health datatypes for Health Connect: IntermenstrualBleedingRecord, and MenstruationPeriodRecord. MenstruationFlow.ENUMs are Light, Medium, Heavy, and Unknown.",
    "noteCount": 3,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha09"
  },
  {
    "version": "1.0.0-alpha08",
    "date": "2022-12-07",
    "dateText": "December 7, 2022",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha08 is released. Version 1.0.0-alpha08 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Adds BodyWaterMass, HeartRateVariabilityRmssdRecord as new supported Record Types. (Ifd58f)",
    "noteCount": 11,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha08"
  },
  {
    "version": "1.0.0-alpha07",
    "date": "2022-10-24",
    "dateText": "October 24, 2022",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha07 is released. Version 1.0.0-alpha07 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Record arguments without default values are placed before arguments with default values. For consistency, Instant and ZoneOffset arguments are always placed at the very beginning. (Id618c)",
    "noteCount": 4,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha07"
  },
  {
    "version": "1.0.0-alpha06",
    "date": "2022-10-05",
    "dateText": "October 5, 2022",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha06 is released. Version 1.0.0-alpha06 contains these commits.",
    "headings": [
      "Bug Fixes"
    ],
    "firstNote": "Improves service connection lifecycle. (If2bd5)",
    "noteCount": 2,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha06"
  },
  {
    "version": "1.0.0-alpha05",
    "date": "2022-09-21",
    "dateText": "September 21, 2022",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha05 is released. Version 1.0.0-alpha05 contains these commits.",
    "headings": [
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Renamed Metadata.uid -> Metadata.id and used the terminology recordId consistently throughout related CRUD APIs. (I3d1d2)",
    "noteCount": 5,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha05"
  },
  {
    "version": "1.0.0-alpha04",
    "date": "2022-08-24",
    "dateText": "August 24, 2022",
    "stage": "alpha",
    "series": "1.0",
    "section": "Version 1.0",
    "releaseSentence": "androidx.health.connect:connect-client:1.0.0-alpha04 is released. Version 1.0.0-alpha04 contains these commits.",
    "headings": [
      "Migration to `androidx.health.connect",
      "New Features",
      "API Changes",
      "Bug Fixes"
    ],
    "firstNote": "Included optional debug logs builtin for API calls (link)",
    "noteCount": 8,
    "url": "https://developer.android.com/jetpack/androidx/releases/health-connect#1.0.0-alpha04"
  }
];
