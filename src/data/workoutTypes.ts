/**
 * Workout and exercise types on four platforms — every constant as its own
 * source spells it — and the crosswalk between them.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-workout-types.mjs
 *
 * Sources (GitHub files on the branch shown; sha256 is of the bytes read):
 *   HKWorkoutActivityType: https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype — read 2026-10-18
 *   ExerciseSessionRecord (Jetpack reference): https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord — read 2026-10-18
 *   ExerciseSegment (Jetpack reference): https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSegment — read 2026-10-18
 *   ExerciseSessionType (Android platform reference): https://developer.android.com/reference/android/health/connect/datatypes/ExerciseSessionType — read 2026-10-18
 *   ExerciseSessionRecord.kt (androidx source): https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSessionRecord.kt (branch androidx-main) — read 2026-10-18
 *   ExerciseSegment.kt (androidx source): https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSegment.kt (branch androidx-main) — read 2026-10-18
 *   IntDefMappings.kt (androidx source): https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/records/IntDefMappings.kt (branch androidx-main) — read 2026-10-18
 *   ExerciseType (Jetpack reference, Java): https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType — read 2026-10-18
 *   ExerciseType (Jetpack reference, Kotlin): https://developer.android.com/reference/kotlin/androidx/health/services/client/data/ExerciseType — read 2026-10-18
 *   ExerciseType.kt (androidx source): https://github.com/androidx/androidx/blob/androidx-main/health/health-services-client/src/main/java/androidx/health/services/client/data/ExerciseType.kt (branch androidx-main) — read 2026-10-18
 *   Record an exercise with ExerciseClient: https://developer.android.com/health-and-fitness/health-services/active-data — read 2026-10-18
 *   Health Connect data types: https://developer.android.com/health-and-fitness/health-connect/data-types — read 2026-10-18
 *   Develop Workout Experiences with Health Connect: https://developer.android.com/health-and-fitness/health-connect/experiences/workouts — read 2026-10-18
 *   Add exercise routes (Health Connect): https://developer.android.com/health-and-fitness/health-connect/features/exercise-routes — read 2026-10-18
 *   Training plans (Health Connect): https://developer.android.com/health-and-fitness/health-connect/features/training-plans — read 2026-10-18
 *   Fit migration guide: https://developer.android.com/health-and-fitness/health-connect/migration/fit — read 2026-10-18
 *   Health Services on Wear OS: https://developer.android.com/health-and-fitness/health-services — read 2026-10-18
 *   Integrate a Wear OS module: https://developer.android.com/health-and-fitness/fitness/basic-app/integrate-wear-os — read 2026-10-18
 *   Develop Workout Experiences with Google Health API: https://developers.google.com/health/data-types/workouts — read 2026-10-18
 *   Apple's page for each HKWorkoutActivityType case (84 JSON documents): https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype — read 2026-10-18
 *   Apple's HealthKit documentation JSON, as read for this site's HealthKit identifier reference: https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype — read 2026-10-02
 *   Google Health API v4 discovery document (revision 20261014), as read for this site's Google Health API reference: https://developers.google.com/health/reference/rest — read 2026-10-17
 * Fetched: 2026-10-18
 *
 * Copied verbatim: names, values, ids, descriptions, Apple's abstracts,
 * groups, discussions, availability and deprecation notes, Google's API
 * levels, the Jetpack-to-platform mapping rows and the segment table rows.
 *
 * Derived, with the text kept beside it:
 *   key — the crosswalk key (WT_NORMALISATION). A row joins constants whose
 *     keys are identical and nothing else.
 *   segments — the segment types a Health Connect session type can contain,
 *     read from the table ExerciseSegment.isSegmentTypeCompatibleWithSessionType
 *     uses; the source line is in `evidence`.
 *   platform — the platform ExerciseSessionType constant the Jetpack library
 *     converts each constant to; the IntDefMappings.kt row is in `evidence`.
 *   intComparison — whether a Health Connect value and the Wear OS id of the
 *     same name are equal. A comparison of two printed numbers, not a claim
 *     that either platform accepts the other's.
 *   flags — where two sources disagree, published with both texts.
 */

/** The date the generator last read its sources (the latest fetch date). */
export const WT_FETCHED_ON = "2026-10-18";

/** The one normalisation the crosswalk applies, stated once. */
export const WT_NORMALISATION = "Two constants share a crosswalk row only when their names are identical after removing a leading EXERCISE_TYPE_ (Health Connect's prefix, which the Google Health API also uses on EXERCISE_TYPE_UNSPECIFIED), lowercasing, and removing every character that is not a letter or a digit.";

export type WtPlatformSlug = "healthkit" | "health-connect" | "wear-os" | "google-health-api";

export type WtSource = {
  id: string;
  title: string;
  platform: WtPlatformSlug | null;
  /** "list": a platform's constants or a cross-check of them; "fact": a statement the pages quote; "search": read while looking for a published mapping. */
  role: "list" | "fact" | "search";
  url: string | null;
  page: string;
  repo: string | null;
  branch: string | null;
  path: string | null;
  fetchedOn: string;
  sha256: string;
  /** Google's "Last updated" footer stamp, for developer.android.com and developers.google.com pages. */
  sourceUpdated: string | null;
};

export const WT_SOURCES: WtSource[] = [
  {
    "id": "hkIndex",
    "title": "HKWorkoutActivityType",
    "platform": "healthkit",
    "role": "list",
    "url": "https://developer.apple.com/tutorials/data/documentation/healthkit/hkworkoutactivitytype.json",
    "page": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "b3e6bf7bd9d51ca1ede9ad0dc75ba779383de6648329ac7882f6cb61aa200462",
    "sourceUpdated": null
  },
  {
    "id": "hcSessionRef",
    "title": "ExerciseSessionRecord (Jetpack reference)",
    "platform": "health-connect",
    "role": "list",
    "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord?hl=en",
    "page": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "21ca77ecf5820012d7b906524438682ea656f4a82ed176ff167fd4ddaa1ae681",
    "sourceUpdated": "2026-08-26"
  },
  {
    "id": "hcSegmentRef",
    "title": "ExerciseSegment (Jetpack reference)",
    "platform": "health-connect",
    "role": "fact",
    "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSegment?hl=en",
    "page": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSegment",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "355facabc40c522454d45e2ec969b5f48b3c1b14b7de1e36881f7515d0eb0bcc",
    "sourceUpdated": "2026-08-26"
  },
  {
    "id": "hcPlatformRef",
    "title": "ExerciseSessionType (Android platform reference)",
    "platform": "health-connect",
    "role": "list",
    "url": "https://developer.android.com/reference/android/health/connect/datatypes/ExerciseSessionType?hl=en",
    "page": "https://developer.android.com/reference/android/health/connect/datatypes/ExerciseSessionType",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "7dd4604a47794a4330066b9f92c723080d3e9cc0e406c182bb5e21e5075f0d04",
    "sourceUpdated": "2026-08-03"
  },
  {
    "id": "hcSessionSrc",
    "title": "ExerciseSessionRecord.kt (androidx source)",
    "platform": "health-connect",
    "role": "list",
    "url": "https://raw.githubusercontent.com/androidx/androidx/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSessionRecord.kt",
    "page": "https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSessionRecord.kt",
    "repo": "androidx/androidx",
    "branch": "androidx-main",
    "path": "health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSessionRecord.kt",
    "fetchedOn": "2026-10-18",
    "sha256": "0c1f0af3173485b9551b994245e782b72f40ec8c4c1e3856c85a4bceab340bcd",
    "sourceUpdated": null
  },
  {
    "id": "hcSegmentSrc",
    "title": "ExerciseSegment.kt (androidx source)",
    "platform": "health-connect",
    "role": "fact",
    "url": "https://raw.githubusercontent.com/androidx/androidx/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSegment.kt",
    "page": "https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSegment.kt",
    "repo": "androidx/androidx",
    "branch": "androidx-main",
    "path": "health/connect/connect-client/src/main/java/androidx/health/connect/client/records/ExerciseSegment.kt",
    "fetchedOn": "2026-10-18",
    "sha256": "60a01a3fdec0709166efcd0bfe1a49bd3776e6906ebda209e9da16bb774e6fd3",
    "sourceUpdated": null
  },
  {
    "id": "hcMappingSrc",
    "title": "IntDefMappings.kt (androidx source)",
    "platform": "health-connect",
    "role": "fact",
    "url": "https://raw.githubusercontent.com/androidx/androidx/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/records/IntDefMappings.kt",
    "page": "https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/records/IntDefMappings.kt",
    "repo": "androidx/androidx",
    "branch": "androidx-main",
    "path": "health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/records/IntDefMappings.kt",
    "fetchedOn": "2026-10-18",
    "sha256": "12aa0de76928415bc54ef937842d238d5dd193acdcab6dbcef0be3920b21f28f",
    "sourceUpdated": null
  },
  {
    "id": "hsJavaRef",
    "title": "ExerciseType (Jetpack reference, Java)",
    "platform": "wear-os",
    "role": "list",
    "url": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType?hl=en",
    "page": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "aecc422742e2d0465a46806f923f90d1a07663445269f08a1305e08a8a9ba5fd",
    "sourceUpdated": "2026-08-06"
  },
  {
    "id": "hsKotlinRef",
    "title": "ExerciseType (Jetpack reference, Kotlin)",
    "platform": "wear-os",
    "role": "list",
    "url": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/ExerciseType?hl=en",
    "page": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/ExerciseType",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "336edaebf601ccb666f0f6973d4dbdeb503b77fcafdc4e67607df3d3558ba429",
    "sourceUpdated": "2026-08-06"
  },
  {
    "id": "hsSrc",
    "title": "ExerciseType.kt (androidx source)",
    "platform": "wear-os",
    "role": "list",
    "url": "https://raw.githubusercontent.com/androidx/androidx/androidx-main/health/health-services-client/src/main/java/androidx/health/services/client/data/ExerciseType.kt",
    "page": "https://github.com/androidx/androidx/blob/androidx-main/health/health-services-client/src/main/java/androidx/health/services/client/data/ExerciseType.kt",
    "repo": "androidx/androidx",
    "branch": "androidx-main",
    "path": "health/health-services-client/src/main/java/androidx/health/services/client/data/ExerciseType.kt",
    "fetchedOn": "2026-10-18",
    "sha256": "4878a5203cdc62749fc84e0b35b551fb38a9bd09ee30d2682b6d3036a31c30ff",
    "sourceUpdated": null
  },
  {
    "id": "hsExerciseGuide",
    "title": "Record an exercise with ExerciseClient",
    "platform": "wear-os",
    "role": "fact",
    "url": "https://developer.android.com/health-and-fitness/health-services/active-data?hl=en",
    "page": "https://developer.android.com/health-and-fitness/health-services/active-data",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "cea0071de22741233d8e5344ef9b270a69492a48585304d2650c467aa6d5936f",
    "sourceUpdated": "2026-09-23"
  },
  {
    "id": "hcDataTypesGuide",
    "title": "Health Connect data types",
    "platform": "health-connect",
    "role": "list",
    "url": "https://developer.android.com/health-and-fitness/health-connect/data-types?hl=en",
    "page": "https://developer.android.com/health-and-fitness/health-connect/data-types",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "ce27cdcefeec844f3ded0c7755fe8f71f06fad3ee9751a2e0bc0da72ca542761",
    "sourceUpdated": "2026-09-23"
  },
  {
    "id": "searchHcWorkouts",
    "title": "Develop Workout Experiences with Health Connect",
    "platform": null,
    "role": "search",
    "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts?hl=en",
    "page": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "8e2b3b54b514747b17776cf5f4306f4112ab4e508c3de390cfe96e50a3ac90e0",
    "sourceUpdated": "2026-09-23"
  },
  {
    "id": "searchHcRoutes",
    "title": "Add exercise routes (Health Connect)",
    "platform": null,
    "role": "search",
    "url": "https://developer.android.com/health-and-fitness/health-connect/features/exercise-routes?hl=en",
    "page": "https://developer.android.com/health-and-fitness/health-connect/features/exercise-routes",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "1bfc55957da55cdf972295c096076b7c3019406c4bb49e260918d7ed9db29b8a",
    "sourceUpdated": "2026-09-23"
  },
  {
    "id": "searchHcPlans",
    "title": "Training plans (Health Connect)",
    "platform": null,
    "role": "search",
    "url": "https://developer.android.com/health-and-fitness/health-connect/features/training-plans?hl=en",
    "page": "https://developer.android.com/health-and-fitness/health-connect/features/training-plans",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "886cce594b9fd06aa7bb1f5992c7cdc23c331e5763e1561430d13871478b48e9",
    "sourceUpdated": "2026-09-23"
  },
  {
    "id": "searchFitMigration",
    "title": "Fit migration guide",
    "platform": null,
    "role": "search",
    "url": "https://developer.android.com/health-and-fitness/health-connect/migration/fit?hl=en",
    "page": "https://developer.android.com/health-and-fitness/health-connect/migration/fit",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "73fe00d608b6427cfc2361d8e9f8743333cbff4012c8e99ddaf4caddf40fcaec",
    "sourceUpdated": "2026-09-10"
  },
  {
    "id": "searchHsOverview",
    "title": "Health Services on Wear OS",
    "platform": null,
    "role": "search",
    "url": "https://developer.android.com/health-and-fitness/health-services?hl=en",
    "page": "https://developer.android.com/health-and-fitness/health-services",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "9c06426c82bc012bd0e97a2d36e5f5e4ea84a29121d20ea6c8e76d9bb80022b1",
    "sourceUpdated": "2026-09-22"
  },
  {
    "id": "searchWearModule",
    "title": "Integrate a Wear OS module",
    "platform": null,
    "role": "search",
    "url": "https://developer.android.com/health-and-fitness/fitness/basic-app/integrate-wear-os?hl=en",
    "page": "https://developer.android.com/health-and-fitness/fitness/basic-app/integrate-wear-os",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "a7ee84d17b6bc596d475ab2876dbcc4458a0b958eebd71dd8d2815de7fb2add2",
    "sourceUpdated": "2026-09-22"
  },
  {
    "id": "searchGhapiWorkouts",
    "title": "Develop Workout Experiences with Google Health API",
    "platform": null,
    "role": "search",
    "url": "https://developers.google.com/health/data-types/workouts?hl=en",
    "page": "https://developers.google.com/health/data-types/workouts",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "e2b2109251defc28a11ef4a527b5e368d6e15ea3d08892498a1db02d16e8f1e0",
    "sourceUpdated": "2026-10-09"
  },
  {
    "id": "hkCases",
    "title": "Apple's page for each HKWorkoutActivityType case (84 JSON documents)",
    "platform": "healthkit",
    "role": "list",
    "url": "https://developer.apple.com/tutorials/data/documentation/healthkit/hkworkoutactivitytype/<case>.json",
    "page": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype",
    "repo": null,
    "branch": null,
    "path": null,
    "fetchedOn": "2026-10-18",
    "sha256": "91c341579aeafdb6105b48dbb427b40d15dfe14a7ee8690bfc97f550a3fc3133",
    "sourceUpdated": null
  },
  {
    "id": "hkModule",
    "title": "Apple's HealthKit documentation JSON, as read for this site's HealthKit identifier reference",
    "platform": "healthkit",
    "role": "list",
    "url": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype",
    "page": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype",
    "repo": null,
    "branch": null,
    "path": "src/data/healthkitIdentifiers.ts",
    "fetchedOn": "2026-10-02",
    "sha256": "1713010fe143f8024a42977a1f4324d39d2980d8bd44de034bcee42f50810eb0",
    "sourceUpdated": null
  },
  {
    "id": "ghapiModule",
    "title": "Google Health API v4 discovery document (revision 20261014), as read for this site's Google Health API reference",
    "platform": "google-health-api",
    "role": "list",
    "url": "https://health.googleapis.com/$discovery/rest?version=v4",
    "page": "https://developers.google.com/health/reference/rest",
    "repo": null,
    "branch": null,
    "path": "src/data/googleHealthApi.ts",
    "fetchedOn": "2026-10-17",
    "sha256": "00201907bf42e5635ef1c505cbddea0978fdee77b5ee504a793e5e71a5e99538",
    "sourceUpdated": null
  }
];

export type WtPlatform = {
  slug: WtPlatformSlug;
  name: string;
  short: string;
  enumeration: string;
  kind: string;
  count: number;
  prefix: string | null;
  /** Where the platform's numbers come from, or why there are none. */
  valueNote: string;
  readOn: string;
  sourceIds: string[];
};

export const WT_PLATFORMS: WtPlatform[] = [
  {
    "slug": "healthkit",
    "name": "Apple HealthKit",
    "short": "HealthKit",
    "enumeration": "HKWorkoutActivityType",
    "kind": "declared as `enum HKWorkoutActivityType` in Swift and `enum HKWorkoutActivityType : NSUInteger;` in Objective-C",
    "count": 84,
    "prefix": null,
    "valueNote": "Apple's documentation prints no raw value for any case, so this reference carries none.",
    "readOn": "2026-10-18",
    "sourceIds": [
      "hkModule",
      "hkIndex",
      "hkCases"
    ]
  },
  {
    "slug": "health-connect",
    "name": "Android Health Connect",
    "short": "Health Connect",
    "enumeration": "ExerciseSessionRecord.EXERCISE_TYPE_*",
    "kind": "Int constants on the Jetpack ExerciseSessionRecord class",
    "count": 61,
    "prefix": "EXERCISE_TYPE_",
    "valueNote": "The Jetpack reference prints every value; the platform API (android.health.connect, API level 34) numbers the same types differently in ExerciseSessionType, and the library converts between the two.",
    "readOn": "2026-10-18",
    "sourceIds": [
      "hcSessionRef",
      "hcPlatformRef",
      "hcSessionSrc",
      "hcMappingSrc",
      "hcSegmentRef",
      "hcSegmentSrc"
    ]
  },
  {
    "slug": "wear-os",
    "name": "Wear OS Health Services",
    "short": "Wear OS",
    "enumeration": "ExerciseType",
    "kind": "ExerciseType objects, each with an int id and a name, on the Jetpack ExerciseType class",
    "count": 85,
    "prefix": null,
    "valueNote": "The reference does not print the ids; the androidx source it links as View Source does, and the ids here are read from it.",
    "readOn": "2026-10-18",
    "sourceIds": [
      "hsJavaRef",
      "hsKotlinRef",
      "hsSrc"
    ]
  },
  {
    "slug": "google-health-api",
    "name": "Google Health API",
    "short": "Google Health API",
    "enumeration": "Exercise.exerciseType",
    "kind": "string enum values on the exercise data type's exerciseType field",
    "count": 182,
    "prefix": "EXERCISE_TYPE_ (on EXERCISE_TYPE_UNSPECIFIED only)",
    "valueNote": "A REST enum: the value is the string itself.",
    "readOn": "2026-10-17",
    "sourceIds": [
      "ghapiModule"
    ]
  }
];

export type WtCounterpart = { platform: WtPlatformSlug; name: string };

export type WtHealthKitType = {
  case: string;
  objc: string;
  qualified: string;
  /** Apple's topic group. */
  group: string;
  /** Apple's abstract, verbatim. */
  abstract: string;
  /** Apple's discussion paragraphs, verbatim (symbol links as their names in backticks); empty when Apple gives none. */
  discussion: string[];
  platforms: { name: string; introducedAt: string | null; deprecatedAt: string | null }[];
  deprecated: boolean;
  /** Apple's deprecation note and the symbols it names; null when not deprecated. */
  deprecation: { message: string | null; replacements: string[] } | null;
  docUrl: string;
  /** DERIVED: the crosswalk key. */
  key: string;
  /** Constants of the other platforms with the same key. */
  counterparts: WtCounterpart[];
};

export const WT_HEALTHKIT: WtHealthKitType[] = [
  {
    "case": "americanFootball",
    "objc": "HKWorkoutActivityTypeAmericanFootball",
    "qualified": "HKWorkoutActivityType.americanFootball",
    "group": "Team sports",
    "abstract": "The constant for playing American football.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/americanfootball",
    "key": "americanfootball",
    "counterparts": []
  },
  {
    "case": "archery",
    "objc": "HKWorkoutActivityTypeArchery",
    "qualified": "HKWorkoutActivityType.archery",
    "group": "Individual sports",
    "abstract": "The constant for shooting archery.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/archery",
    "key": "archery",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "ARCHERY"
      }
    ]
  },
  {
    "case": "australianFootball",
    "objc": "HKWorkoutActivityTypeAustralianFootball",
    "qualified": "HKWorkoutActivityType.australianFootball",
    "group": "Team sports",
    "abstract": "The constant for playing Australian football.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/australianfootball",
    "key": "australianfootball",
    "counterparts": []
  },
  {
    "case": "badminton",
    "objc": "HKWorkoutActivityTypeBadminton",
    "qualified": "HKWorkoutActivityType.badminton",
    "group": "Racket sports",
    "abstract": "The constant for playing badminton.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/badminton",
    "key": "badminton",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BADMINTON"
      },
      {
        "platform": "wear-os",
        "name": "BADMINTON"
      },
      {
        "platform": "google-health-api",
        "name": "BADMINTON"
      }
    ]
  },
  {
    "case": "barre",
    "objc": "HKWorkoutActivityTypeBarre",
    "qualified": "HKWorkoutActivityType.barre",
    "group": "Studio activities",
    "abstract": "The constant for barre workout.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/barre",
    "key": "barre",
    "counterparts": []
  },
  {
    "case": "baseball",
    "objc": "HKWorkoutActivityTypeBaseball",
    "qualified": "HKWorkoutActivityType.baseball",
    "group": "Team sports",
    "abstract": "The constant for playing baseball.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/baseball",
    "key": "baseball",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASEBALL"
      },
      {
        "platform": "wear-os",
        "name": "BASEBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASEBALL"
      }
    ]
  },
  {
    "case": "basketball",
    "objc": "HKWorkoutActivityTypeBasketball",
    "qualified": "HKWorkoutActivityType.basketball",
    "group": "Team sports",
    "abstract": "The constant for playing basketball.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/basketball",
    "key": "basketball",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASKETBALL"
      },
      {
        "platform": "wear-os",
        "name": "BASKETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASKETBALL"
      }
    ]
  },
  {
    "case": "bowling",
    "objc": "HKWorkoutActivityTypeBowling",
    "qualified": "HKWorkoutActivityType.bowling",
    "group": "Individual sports",
    "abstract": "The constant for bowling.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/bowling",
    "key": "bowling",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "BOWLING"
      }
    ]
  },
  {
    "case": "boxing",
    "objc": "HKWorkoutActivityTypeBoxing",
    "qualified": "HKWorkoutActivityType.boxing",
    "group": "Martial arts",
    "abstract": "The constant for boxing.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/boxing",
    "key": "boxing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BOXING"
      },
      {
        "platform": "wear-os",
        "name": "BOXING"
      },
      {
        "platform": "google-health-api",
        "name": "BOXING"
      }
    ]
  },
  {
    "case": "cardioDance",
    "objc": "HKWorkoutActivityTypeCardioDance",
    "qualified": "HKWorkoutActivityType.cardioDance",
    "group": "Studio activities",
    "abstract": "The constant for cardiovascular dance workouts.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/cardiodance",
    "key": "cardiodance",
    "counterparts": []
  },
  {
    "case": "climbing",
    "objc": "HKWorkoutActivityTypeClimbing",
    "qualified": "HKWorkoutActivityType.climbing",
    "group": "Outdoor activities",
    "abstract": "The constant for climbing.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/climbing",
    "key": "climbing",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "CLIMBING"
      }
    ]
  },
  {
    "case": "cooldown",
    "objc": "HKWorkoutActivityTypeCooldown",
    "qualified": "HKWorkoutActivityType.cooldown",
    "group": "Exercise and fitness",
    "abstract": "The constant for low intensity stretching and mobility exercises following a more vigorous workout.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/cooldown",
    "key": "cooldown",
    "counterparts": []
  },
  {
    "case": "coreTraining",
    "objc": "HKWorkoutActivityTypeCoreTraining",
    "qualified": "HKWorkoutActivityType.coreTraining",
    "group": "Exercise and fitness",
    "abstract": "The constant for core training.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/coretraining",
    "key": "coretraining",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "CORE_TRAINING"
      }
    ]
  },
  {
    "case": "cricket",
    "objc": "HKWorkoutActivityTypeCricket",
    "qualified": "HKWorkoutActivityType.cricket",
    "group": "Team sports",
    "abstract": "The constant for playing cricket.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/cricket",
    "key": "cricket",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_CRICKET"
      },
      {
        "platform": "wear-os",
        "name": "CRICKET"
      },
      {
        "platform": "google-health-api",
        "name": "CRICKET"
      }
    ]
  },
  {
    "case": "crossCountrySkiing",
    "objc": "HKWorkoutActivityTypeCrossCountrySkiing",
    "qualified": "HKWorkoutActivityType.crossCountrySkiing",
    "group": "Snow and ice sports",
    "abstract": "The constant for cross country skiing.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/crosscountryskiing",
    "key": "crosscountryskiing",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "CROSS_COUNTRY_SKIING"
      }
    ]
  },
  {
    "case": "crossTraining",
    "objc": "HKWorkoutActivityTypeCrossTraining",
    "qualified": "HKWorkoutActivityType.crossTraining",
    "group": "Exercise and fitness",
    "abstract": "The constant for exercise that includes any mixture of cardio, strength, and/or flexibility training.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/crosstraining",
    "key": "crosstraining",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "CROSS_TRAINING"
      }
    ]
  },
  {
    "case": "curling",
    "objc": "HKWorkoutActivityTypeCurling",
    "qualified": "HKWorkoutActivityType.curling",
    "group": "Snow and ice sports",
    "abstract": "The constant for curling.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/curling",
    "key": "curling",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "CURLING"
      }
    ]
  },
  {
    "case": "cycling",
    "objc": "HKWorkoutActivityTypeCycling",
    "qualified": "HKWorkoutActivityType.cycling",
    "group": "Exercise and fitness",
    "abstract": "The constant for cycling.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/cycling",
    "key": "cycling",
    "counterparts": []
  },
  {
    "case": "dance",
    "objc": "HKWorkoutActivityTypeDance",
    "qualified": "HKWorkoutActivityType.dance",
    "group": "Deprecated activity types",
    "abstract": "The constant for dancing.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": "14.0"
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": "14.0"
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecatedAt": "14.0"
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": "1.0"
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": "7.0"
      }
    ],
    "deprecated": true,
    "deprecation": {
      "message": "Use HKWorkoutActivityType.cardioDance or HKWorkoutActivityType.socialDance instead.",
      "replacements": [
        "HKWorkoutActivityType.cardioDance",
        "HKWorkoutActivityType.socialDance"
      ]
    },
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/dance",
    "key": "dance",
    "counterparts": []
  },
  {
    "case": "danceInspiredTraining",
    "objc": "HKWorkoutActivityTypeDanceInspiredTraining",
    "qualified": "HKWorkoutActivityType.danceInspiredTraining",
    "group": "Deprecated activity types",
    "abstract": "The constant for workouts inspired by dance, including Pilates, Barre, and Feldenkrais.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": "10.0"
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": "10.0"
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecatedAt": "13.1"
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": "1.0"
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": "3.0"
      }
    ],
    "deprecated": true,
    "deprecation": {
      "message": "Use HKWorkoutActivityType.dance, HKWorkoutActivityType.barre, or HKWorkoutActivityType.pilates instead.",
      "replacements": [
        "HKWorkoutActivityType.dance",
        "HKWorkoutActivityType.barre",
        "HKWorkoutActivityType.pilates"
      ]
    },
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/danceinspiredtraining",
    "key": "danceinspiredtraining",
    "counterparts": []
  },
  {
    "case": "discSports",
    "objc": "HKWorkoutActivityTypeDiscSports",
    "qualified": "HKWorkoutActivityType.discSports",
    "group": "Team sports",
    "abstract": "The constant for playing disc sports such as Ultimate and Disc Golf.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/discsports",
    "key": "discsports",
    "counterparts": []
  },
  {
    "case": "downhillSkiing",
    "objc": "HKWorkoutActivityTypeDownhillSkiing",
    "qualified": "HKWorkoutActivityType.downhillSkiing",
    "group": "Snow and ice sports",
    "abstract": "The constant for downhill skiing.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/downhillskiing",
    "key": "downhillskiing",
    "counterparts": []
  },
  {
    "case": "elliptical",
    "objc": "HKWorkoutActivityTypeElliptical",
    "qualified": "HKWorkoutActivityType.elliptical",
    "group": "Exercise and fitness",
    "abstract": "The constant for workouts on an elliptical machine.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/elliptical",
    "key": "elliptical",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ELLIPTICAL"
      },
      {
        "platform": "wear-os",
        "name": "ELLIPTICAL"
      },
      {
        "platform": "google-health-api",
        "name": "ELLIPTICAL"
      }
    ]
  },
  {
    "case": "equestrianSports",
    "objc": "HKWorkoutActivityTypeEquestrianSports",
    "qualified": "HKWorkoutActivityType.equestrianSports",
    "group": "Outdoor activities",
    "abstract": "The constant for activities that involve riding a horse, including polo, horse racing, and horse riding.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/equestriansports",
    "key": "equestriansports",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "EQUESTRIAN_SPORTS"
      }
    ]
  },
  {
    "case": "fencing",
    "objc": "HKWorkoutActivityTypeFencing",
    "qualified": "HKWorkoutActivityType.fencing",
    "group": "Individual sports",
    "abstract": "The constant for fencing.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/fencing",
    "key": "fencing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FENCING"
      },
      {
        "platform": "wear-os",
        "name": "FENCING"
      },
      {
        "platform": "google-health-api",
        "name": "FENCING"
      }
    ]
  },
  {
    "case": "fishing",
    "objc": "HKWorkoutActivityTypeFishing",
    "qualified": "HKWorkoutActivityType.fishing",
    "group": "Outdoor activities",
    "abstract": "The constant for fishing.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/fishing",
    "key": "fishing",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "FISHING"
      }
    ]
  },
  {
    "case": "fitnessGaming",
    "objc": "HKWorkoutActivityTypeFitnessGaming",
    "qualified": "HKWorkoutActivityType.fitnessGaming",
    "group": "Exercise and fitness",
    "abstract": "The constant for playing fitness-based video games.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/fitnessgaming",
    "key": "fitnessgaming",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "FITNESS_GAMING"
      }
    ]
  },
  {
    "case": "flexibility",
    "objc": "HKWorkoutActivityTypeFlexibility",
    "qualified": "HKWorkoutActivityType.flexibility",
    "group": "Exercise and fitness",
    "abstract": "The constant for a flexibility workout.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/flexibility",
    "key": "flexibility",
    "counterparts": []
  },
  {
    "case": "functionalStrengthTraining",
    "objc": "HKWorkoutActivityTypeFunctionalStrengthTraining",
    "qualified": "HKWorkoutActivityType.functionalStrengthTraining",
    "group": "Exercise and fitness",
    "abstract": "The constant for strength training, primarily with free weights and body weight.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/functionalstrengthtraining",
    "key": "functionalstrengthtraining",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "FUNCTIONAL_STRENGTH_TRAINING"
      }
    ]
  },
  {
    "case": "golf",
    "objc": "HKWorkoutActivityTypeGolf",
    "qualified": "HKWorkoutActivityType.golf",
    "group": "Outdoor activities",
    "abstract": "The constant for playing golf.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/golf",
    "key": "golf",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GOLF"
      },
      {
        "platform": "wear-os",
        "name": "GOLF"
      },
      {
        "platform": "google-health-api",
        "name": "GOLF"
      }
    ]
  },
  {
    "case": "gymnastics",
    "objc": "HKWorkoutActivityTypeGymnastics",
    "qualified": "HKWorkoutActivityType.gymnastics",
    "group": "Individual sports",
    "abstract": "Performing gymnastics.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/gymnastics",
    "key": "gymnastics",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GYMNASTICS"
      },
      {
        "platform": "wear-os",
        "name": "GYMNASTICS"
      },
      {
        "platform": "google-health-api",
        "name": "GYMNASTICS"
      }
    ]
  },
  {
    "case": "handball",
    "objc": "HKWorkoutActivityTypeHandball",
    "qualified": "HKWorkoutActivityType.handball",
    "group": "Team sports",
    "abstract": "The constant for playing handball.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/handball",
    "key": "handball",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HANDBALL"
      },
      {
        "platform": "wear-os",
        "name": "HANDBALL"
      },
      {
        "platform": "google-health-api",
        "name": "HANDBALL"
      }
    ]
  },
  {
    "case": "handCycling",
    "objc": "HKWorkoutActivityTypeHandCycling",
    "qualified": "HKWorkoutActivityType.handCycling",
    "group": "Exercise and fitness",
    "abstract": "The constant for hand cycling.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/handcycling",
    "key": "handcycling",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "HAND_CYCLING"
      }
    ]
  },
  {
    "case": "highIntensityIntervalTraining",
    "objc": "HKWorkoutActivityTypeHighIntensityIntervalTraining",
    "qualified": "HKWorkoutActivityType.highIntensityIntervalTraining",
    "group": "Exercise and fitness",
    "abstract": "The constant for high intensity interval training.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/highintensityintervaltraining",
    "key": "highintensityintervaltraining",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
      },
      {
        "platform": "wear-os",
        "name": "HIGH_INTENSITY_INTERVAL_TRAINING"
      }
    ]
  },
  {
    "case": "hiking",
    "objc": "HKWorkoutActivityTypeHiking",
    "qualified": "HKWorkoutActivityType.hiking",
    "group": "Outdoor activities",
    "abstract": "The constant for hiking.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/hiking",
    "key": "hiking",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HIKING"
      },
      {
        "platform": "wear-os",
        "name": "HIKING"
      },
      {
        "platform": "google-health-api",
        "name": "HIKING"
      }
    ]
  },
  {
    "case": "hockey",
    "objc": "HKWorkoutActivityTypeHockey",
    "qualified": "HKWorkoutActivityType.hockey",
    "group": "Team sports",
    "abstract": "The constant for playing hockey, including ice hockey, field hockey, and related sports.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving. Calorie calculations differ between indoor and outdoor workouts for this activity."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/hockey",
    "key": "hockey",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "HOCKEY"
      }
    ]
  },
  {
    "case": "hunting",
    "objc": "HKWorkoutActivityTypeHunting",
    "qualified": "HKWorkoutActivityType.hunting",
    "group": "Outdoor activities",
    "abstract": "The constant for hunting.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/hunting",
    "key": "hunting",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "HUNTING"
      }
    ]
  },
  {
    "case": "jumpRope",
    "objc": "HKWorkoutActivityTypeJumpRope",
    "qualified": "HKWorkoutActivityType.jumpRope",
    "group": "Exercise and fitness",
    "abstract": "The constant for jumping rope.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/jumprope",
    "key": "jumprope",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "JUMP_ROPE"
      }
    ]
  },
  {
    "case": "kickboxing",
    "objc": "HKWorkoutActivityTypeKickboxing",
    "qualified": "HKWorkoutActivityType.kickboxing",
    "group": "Martial arts",
    "abstract": "The constant for kickboxing.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/kickboxing",
    "key": "kickboxing",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "KICKBOXING"
      }
    ]
  },
  {
    "case": "lacrosse",
    "objc": "HKWorkoutActivityTypeLacrosse",
    "qualified": "HKWorkoutActivityType.lacrosse",
    "group": "Team sports",
    "abstract": "The constant for playing lacrosse.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/lacrosse",
    "key": "lacrosse",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "LACROSSE"
      }
    ]
  },
  {
    "case": "martialArts",
    "objc": "HKWorkoutActivityTypeMartialArts",
    "qualified": "HKWorkoutActivityType.martialArts",
    "group": "Martial arts",
    "abstract": "The constant for practicing martial arts.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/martialarts",
    "key": "martialarts",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_MARTIAL_ARTS"
      },
      {
        "platform": "wear-os",
        "name": "MARTIAL_ARTS"
      },
      {
        "platform": "google-health-api",
        "name": "MARTIAL_ARTS"
      }
    ]
  },
  {
    "case": "mindAndBody",
    "objc": "HKWorkoutActivityTypeMindAndBody",
    "qualified": "HKWorkoutActivityType.mindAndBody",
    "group": "Studio activities",
    "abstract": "The constant for performing activities like walking meditation, Gyrotonic exercise, and Qigong.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/mindandbody",
    "key": "mindandbody",
    "counterparts": []
  },
  {
    "case": "mixedCardio",
    "objc": "HKWorkoutActivityTypeMixedCardio",
    "qualified": "HKWorkoutActivityType.mixedCardio",
    "group": "Exercise and fitness",
    "abstract": "The constant for workouts that mix a variety of cardio exercise machines or modalities.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/mixedcardio",
    "key": "mixedcardio",
    "counterparts": []
  },
  {
    "case": "mixedMetabolicCardioTraining",
    "objc": "HKWorkoutActivityTypeMixedMetabolicCardioTraining",
    "qualified": "HKWorkoutActivityType.mixedMetabolicCardioTraining",
    "group": "Deprecated activity types",
    "abstract": "The constant for performing any mix of cardio-focused exercises.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": "11.0"
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": "11.0"
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecatedAt": "13.1"
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": "1.0"
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": "4.0"
      }
    ],
    "deprecated": true,
    "deprecation": {
      "message": "Use HKWorkoutActivityType.mixedCardio or HKWorkoutActivityType.highIntensityIntervalTraining instead.",
      "replacements": [
        "HKWorkoutActivityType.mixedCardio",
        "HKWorkoutActivityType.highIntensityIntervalTraining"
      ]
    },
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/mixedmetaboliccardiotraining",
    "key": "mixedmetaboliccardiotraining",
    "counterparts": []
  },
  {
    "case": "other",
    "objc": "HKWorkoutActivityTypeOther",
    "qualified": "HKWorkoutActivityType.other",
    "group": "Other activities",
    "abstract": "The constant for a workout that does not match any of the other workout activity types.",
    "discussion": [
      "If your app uses the `HKWorkoutActivityType.swimming` or `HKWorkoutActivityType.other` activity type, you must explain how your app calculates workout data when sensor information is not available. For more information, see the `Human Interface Guidelines`."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/other",
    "key": "other",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "OTHER"
      }
    ]
  },
  {
    "case": "paddleSports",
    "objc": "HKWorkoutActivityTypePaddleSports",
    "qualified": "HKWorkoutActivityType.paddleSports",
    "group": "Water activities",
    "abstract": "The constant for canoeing, kayaking, paddling an outrigger, paddling a stand-up paddle board, and related sports.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/paddlesports",
    "key": "paddlesports",
    "counterparts": []
  },
  {
    "case": "pickleball",
    "objc": "HKWorkoutActivityTypePickleball",
    "qualified": "HKWorkoutActivityType.pickleball",
    "group": "Racket sports",
    "abstract": "The constant for playing pickleball.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/pickleball",
    "key": "pickleball",
    "counterparts": []
  },
  {
    "case": "pilates",
    "objc": "HKWorkoutActivityTypePilates",
    "qualified": "HKWorkoutActivityType.pilates",
    "group": "Studio activities",
    "abstract": "The constant for a pilates workout.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/pilates",
    "key": "pilates",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PILATES"
      },
      {
        "platform": "wear-os",
        "name": "PILATES"
      },
      {
        "platform": "google-health-api",
        "name": "PILATES"
      }
    ]
  },
  {
    "case": "play",
    "objc": "HKWorkoutActivityTypePlay",
    "qualified": "HKWorkoutActivityType.play",
    "group": "Outdoor activities",
    "abstract": "The constant for play-based activities like tag, dodgeball, hopscotch, tetherball, and playing on a jungle gym.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/play",
    "key": "play",
    "counterparts": []
  },
  {
    "case": "preparationAndRecovery",
    "objc": "HKWorkoutActivityTypePreparationAndRecovery",
    "qualified": "HKWorkoutActivityType.preparationAndRecovery",
    "group": "Exercise and fitness",
    "abstract": "The constant for warm-up and therapeutic activities like foam rolling and stretching.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/preparationandrecovery",
    "key": "preparationandrecovery",
    "counterparts": []
  },
  {
    "case": "racquetball",
    "objc": "HKWorkoutActivityTypeRacquetball",
    "qualified": "HKWorkoutActivityType.racquetball",
    "group": "Racket sports",
    "abstract": "The constant for playing racquetball.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/racquetball",
    "key": "racquetball",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RACQUETBALL"
      },
      {
        "platform": "wear-os",
        "name": "RACQUETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "RACQUETBALL"
      }
    ]
  },
  {
    "case": "rowing",
    "objc": "HKWorkoutActivityTypeRowing",
    "qualified": "HKWorkoutActivityType.rowing",
    "group": "Water activities",
    "abstract": "The constant for rowing.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors. Calorie calculations differ between indoor and outdoor workouts for this activity."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/rowing",
    "key": "rowing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROWING"
      },
      {
        "platform": "wear-os",
        "name": "ROWING"
      },
      {
        "platform": "google-health-api",
        "name": "ROWING"
      }
    ]
  },
  {
    "case": "rugby",
    "objc": "HKWorkoutActivityTypeRugby",
    "qualified": "HKWorkoutActivityType.rugby",
    "group": "Team sports",
    "abstract": "The constant for playing rugby.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/rugby",
    "key": "rugby",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUGBY"
      },
      {
        "platform": "wear-os",
        "name": "RUGBY"
      },
      {
        "platform": "google-health-api",
        "name": "RUGBY"
      }
    ]
  },
  {
    "case": "running",
    "objc": "HKWorkoutActivityTypeRunning",
    "qualified": "HKWorkoutActivityType.running",
    "group": "Exercise and fitness",
    "abstract": "The constant for running and jogging.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/running",
    "key": "running",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUNNING"
      },
      {
        "platform": "wear-os",
        "name": "RUNNING"
      },
      {
        "platform": "google-health-api",
        "name": "RUNNING"
      }
    ]
  },
  {
    "case": "sailing",
    "objc": "HKWorkoutActivityTypeSailing",
    "qualified": "HKWorkoutActivityType.sailing",
    "group": "Water activities",
    "abstract": "The constant for sailing.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/sailing",
    "key": "sailing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SAILING"
      },
      {
        "platform": "wear-os",
        "name": "SAILING"
      },
      {
        "platform": "google-health-api",
        "name": "SAILING"
      }
    ]
  },
  {
    "case": "skatingSports",
    "objc": "HKWorkoutActivityTypeSkatingSports",
    "qualified": "HKWorkoutActivityType.skatingSports",
    "group": "Snow and ice sports",
    "abstract": "The constant for skating activities, including ice skating, speed skating, inline skating, and skateboarding.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving. Calorie calculations differ between indoor and outdoor workouts for this activity."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/skatingsports",
    "key": "skatingsports",
    "counterparts": []
  },
  {
    "case": "snowboarding",
    "objc": "HKWorkoutActivityTypeSnowboarding",
    "qualified": "HKWorkoutActivityType.snowboarding",
    "group": "Snow and ice sports",
    "abstract": "The constant for snowboarding.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/snowboarding",
    "key": "snowboarding",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SNOWBOARDING"
      },
      {
        "platform": "wear-os",
        "name": "SNOWBOARDING"
      },
      {
        "platform": "google-health-api",
        "name": "SNOWBOARDING"
      }
    ]
  },
  {
    "case": "snowSports",
    "objc": "HKWorkoutActivityTypeSnowSports",
    "qualified": "HKWorkoutActivityType.snowSports",
    "group": "Snow and ice sports",
    "abstract": "The constant for a variety of snow sports, including sledding, snowmobiling, or building a snowman.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/snowsports",
    "key": "snowsports",
    "counterparts": []
  },
  {
    "case": "soccer",
    "objc": "HKWorkoutActivityTypeSoccer",
    "qualified": "HKWorkoutActivityType.soccer",
    "group": "Team sports",
    "abstract": "The constant for playing soccer.",
    "discussion": [
      "HealthKit estimates calories for this activity based on the data from Apple Watch’s sensors. This rate is never lower than the brisk walk burn rate when moving. Calorie calculations differ between indoor and outdoor workouts for this activity."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/soccer",
    "key": "soccer",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOCCER"
      },
      {
        "platform": "wear-os",
        "name": "SOCCER"
      },
      {
        "platform": "google-health-api",
        "name": "SOCCER"
      }
    ]
  },
  {
    "case": "socialDance",
    "objc": "HKWorkoutActivityTypeSocialDance",
    "qualified": "HKWorkoutActivityType.socialDance",
    "group": "Studio activities",
    "abstract": "The constant for dancing with a partner or partners, such as swing, salsa, or folk dances.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/socialdance",
    "key": "socialdance",
    "counterparts": []
  },
  {
    "case": "softball",
    "objc": "HKWorkoutActivityTypeSoftball",
    "qualified": "HKWorkoutActivityType.softball",
    "group": "Team sports",
    "abstract": "The constant for playing softball.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/softball",
    "key": "softball",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOFTBALL"
      },
      {
        "platform": "wear-os",
        "name": "SOFTBALL"
      },
      {
        "platform": "google-health-api",
        "name": "SOFTBALL"
      }
    ]
  },
  {
    "case": "squash",
    "objc": "HKWorkoutActivityTypeSquash",
    "qualified": "HKWorkoutActivityType.squash",
    "group": "Racket sports",
    "abstract": "The constant for playing squash.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/squash",
    "key": "squash",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SQUASH"
      },
      {
        "platform": "wear-os",
        "name": "SQUASH"
      },
      {
        "platform": "google-health-api",
        "name": "SQUASH"
      }
    ]
  },
  {
    "case": "stairClimbing",
    "objc": "HKWorkoutActivityTypeStairClimbing",
    "qualified": "HKWorkoutActivityType.stairClimbing",
    "group": "Exercise and fitness",
    "abstract": "The constant for workouts using a stair climbing machine.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/stairclimbing",
    "key": "stairclimbing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STAIR_CLIMBING"
      },
      {
        "platform": "wear-os",
        "name": "STAIR_CLIMBING"
      }
    ]
  },
  {
    "case": "stairs",
    "objc": "HKWorkoutActivityTypeStairs",
    "qualified": "HKWorkoutActivityType.stairs",
    "group": "Exercise and fitness",
    "abstract": "The constant for running, walking, or other drills using stairs (for example, in a stadium or inside a multilevel building).",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/stairs",
    "key": "stairs",
    "counterparts": []
  },
  {
    "case": "stepTraining",
    "objc": "HKWorkoutActivityTypeStepTraining",
    "qualified": "HKWorkoutActivityType.stepTraining",
    "group": "Exercise and fitness",
    "abstract": "The constant for training using a step bench.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/steptraining",
    "key": "steptraining",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "STEP_TRAINING"
      }
    ]
  },
  {
    "case": "surfingSports",
    "objc": "HKWorkoutActivityTypeSurfingSports",
    "qualified": "HKWorkoutActivityType.surfingSports",
    "group": "Water activities",
    "abstract": "The constant for a variety of surf sports, including surfing, kite surfing, and wind surfing.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/surfingsports",
    "key": "surfingsports",
    "counterparts": []
  },
  {
    "case": "swimBikeRun",
    "objc": "HKWorkoutActivityTypeSwimBikeRun",
    "qualified": "HKWorkoutActivityType.swimBikeRun",
    "group": "Multisport activities",
    "abstract": "The constant for multisport activities like triathlons.",
    "discussion": [
      "Use this constant to create workouts that contain the `HKWorkoutActivityType.swimming`, `HKWorkoutActivityType.cycling`, and `HKWorkoutActivityType.running` activities. These activities can happen in any order. For more information, see `HKWorkoutActivity`. HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/swimbikerun",
    "key": "swimbikerun",
    "counterparts": []
  },
  {
    "case": "swimming",
    "objc": "HKWorkoutActivityTypeSwimming",
    "qualified": "HKWorkoutActivityType.swimming",
    "group": "Water activities",
    "abstract": "The constant for swimming.",
    "discussion": [
      "If your app uses the `HKWorkoutActivityType.swimming` or `HKWorkoutActivityType.other` activity type, you must explain how your app calculates workout data when sensor information is not available. For more information, see the `Human Interface Guidelines`. HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/swimming",
    "key": "swimming",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "SWIMMING"
      }
    ]
  },
  {
    "case": "tableTennis",
    "objc": "HKWorkoutActivityTypeTableTennis",
    "qualified": "HKWorkoutActivityType.tableTennis",
    "group": "Racket sports",
    "abstract": "The constant for playing table tennis.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/tabletennis",
    "key": "tabletennis",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TABLE_TENNIS"
      },
      {
        "platform": "wear-os",
        "name": "TABLE_TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TABLE_TENNIS"
      }
    ]
  },
  {
    "case": "taiChi",
    "objc": "HKWorkoutActivityTypeTaiChi",
    "qualified": "HKWorkoutActivityType.taiChi",
    "group": "Martial arts",
    "abstract": "The constant for tai chi.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/taichi",
    "key": "taichi",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "TAI_CHI"
      }
    ]
  },
  {
    "case": "tennis",
    "objc": "HKWorkoutActivityTypeTennis",
    "qualified": "HKWorkoutActivityType.tennis",
    "group": "Racket sports",
    "abstract": "The constant for playing tennis.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/tennis",
    "key": "tennis",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TENNIS"
      },
      {
        "platform": "wear-os",
        "name": "TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TENNIS"
      }
    ]
  },
  {
    "case": "trackAndField",
    "objc": "HKWorkoutActivityTypeTrackAndField",
    "qualified": "HKWorkoutActivityType.trackAndField",
    "group": "Individual sports",
    "abstract": "Participating in track and field events, including shot put, javelin, pole vaulting, and related sports.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/trackandfield",
    "key": "trackandfield",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "TRACK_AND_FIELD"
      }
    ]
  },
  {
    "case": "traditionalStrengthTraining",
    "objc": "HKWorkoutActivityTypeTraditionalStrengthTraining",
    "qualified": "HKWorkoutActivityType.traditionalStrengthTraining",
    "group": "Exercise and fitness",
    "abstract": "The constant for strength training exercises primarily using machines or free weights.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/traditionalstrengthtraining",
    "key": "traditionalstrengthtraining",
    "counterparts": []
  },
  {
    "case": "transition",
    "objc": "HKWorkoutActivityTypeTransition",
    "qualified": "HKWorkoutActivityType.transition",
    "group": "Multisport activities",
    "abstract": "A constant for the transition time between activities in a multisport workout.",
    "discussion": [
      "Use this constant to create an `HKWorkoutActivity` instance that represents the transition between sports in a `HKWorkoutActivityType.swimBikeRun` workout."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/transition",
    "key": "transition",
    "counterparts": []
  },
  {
    "case": "underwaterDiving",
    "objc": "HKWorkoutActivityTypeUnderwaterDiving",
    "qualified": "HKWorkoutActivityType.underwaterDiving",
    "group": "Water activities",
    "abstract": "The constant for underwater diving.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/underwaterdiving",
    "key": "underwaterdiving",
    "counterparts": []
  },
  {
    "case": "volleyball",
    "objc": "HKWorkoutActivityTypeVolleyball",
    "qualified": "HKWorkoutActivityType.volleyball",
    "group": "Team sports",
    "abstract": "The constant for playing volleyball.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/volleyball",
    "key": "volleyball",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_VOLLEYBALL"
      },
      {
        "platform": "wear-os",
        "name": "VOLLEYBALL"
      },
      {
        "platform": "google-health-api",
        "name": "VOLLEYBALL"
      }
    ]
  },
  {
    "case": "walking",
    "objc": "HKWorkoutActivityTypeWalking",
    "qualified": "HKWorkoutActivityType.walking",
    "group": "Exercise and fitness",
    "abstract": "The constant for walking.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/walking",
    "key": "walking",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WALKING"
      },
      {
        "platform": "wear-os",
        "name": "WALKING"
      },
      {
        "platform": "google-health-api",
        "name": "WALKING"
      }
    ]
  },
  {
    "case": "waterFitness",
    "objc": "HKWorkoutActivityTypeWaterFitness",
    "qualified": "HKWorkoutActivityType.waterFitness",
    "group": "Water activities",
    "abstract": "The constant for aerobic exercise performed in shallow water.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/waterfitness",
    "key": "waterfitness",
    "counterparts": []
  },
  {
    "case": "waterPolo",
    "objc": "HKWorkoutActivityTypeWaterPolo",
    "qualified": "HKWorkoutActivityType.waterPolo",
    "group": "Water activities",
    "abstract": "The constant for playing water polo.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/waterpolo",
    "key": "waterpolo",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WATER_POLO"
      },
      {
        "platform": "wear-os",
        "name": "WATER_POLO"
      },
      {
        "platform": "google-health-api",
        "name": "WATER_POLO"
      }
    ]
  },
  {
    "case": "waterSports",
    "objc": "HKWorkoutActivityTypeWaterSports",
    "qualified": "HKWorkoutActivityType.waterSports",
    "group": "Water activities",
    "abstract": "The constant for a variety of water sports, including water skiing, wake boarding, and related activities.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/watersports",
    "key": "watersports",
    "counterparts": []
  },
  {
    "case": "wheelchairRunPace",
    "objc": "HKWorkoutActivityTypeWheelchairRunPace",
    "qualified": "HKWorkoutActivityType.wheelchairRunPace",
    "group": "Exercise and fitness",
    "abstract": "The constant for wheelchair workout at running pace.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/wheelchairrunpace",
    "key": "wheelchairrunpace",
    "counterparts": []
  },
  {
    "case": "wheelchairWalkPace",
    "objc": "HKWorkoutActivityTypeWheelchairWalkPace",
    "qualified": "HKWorkoutActivityType.wheelchairWalkPace",
    "group": "Exercise and fitness",
    "abstract": "The constant for a wheelchair workout at walking pace.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/wheelchairwalkpace",
    "key": "wheelchairwalkpace",
    "counterparts": []
  },
  {
    "case": "wrestling",
    "objc": "HKWorkoutActivityTypeWrestling",
    "qualified": "HKWorkoutActivityType.wrestling",
    "group": "Martial arts",
    "abstract": "The constant for wrestling.",
    "discussion": [],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/wrestling",
    "key": "wrestling",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "WRESTLING"
      }
    ]
  },
  {
    "case": "yoga",
    "objc": "HKWorkoutActivityTypeYoga",
    "qualified": "HKWorkoutActivityType.yoga",
    "group": "Studio activities",
    "abstract": "The constant for practicing yoga.",
    "discussion": [
      "HealthKit provides optimized calorie calculations for this activity based on the data from Apple Watch’s sensors."
    ],
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecatedAt": null
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecatedAt": null
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecatedAt": null
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecatedAt": null
      }
    ],
    "deprecated": false,
    "deprecation": null,
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/yoga",
    "key": "yoga",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_YOGA"
      },
      {
        "platform": "wear-os",
        "name": "YOGA"
      },
      {
        "platform": "google-health-api",
        "name": "YOGA"
      }
    ]
  }
];

export type WtHealthConnectType = {
  name: string;
  qualified: string;
  /** The Jetpack reference's value. */
  value: number;
  /** The Jetpack reference's description; null where it gives none. */
  description: string | null;
  deprecated: boolean;
  docUrl: string;
  /** The platform ExerciseSessionType constant the library converts to (IntDefMappings.kt), with that reference's value, description and API level. */
  platform: {
    name: string;
    value: number;
    description: string | null;
    apiLevel: number | null;
    extension: string | null;
    /** The API level the platform reference says the constant was deprecated in; null when it is not. */
    deprecatedIn: number | null;
    /** The platform reference's deprecation note, verbatim. */
    deprecationNote: string | null;
    evidence: string;
  } | null;
  /**
   * The segment types a session of this type can contain, from the table
   * behind ExerciseSegment.isSegmentTypeCompatibleWithSessionType:
   * "any" — the session type is in UNIVERSAL_SESSION_TYPES and accepts every
   * segment type; "listed" — the table names its segments (plus the
   * universal segments every session accepts); "universal-only" — the table
   * does not name it, so only the universal segments are accepted.
   */
  segments: { rule: "any" | "listed" | "universal-only"; segments: string[]; via: string | null; evidence: string | null };
  key: string;
  counterparts: WtCounterpart[];
};

export const WT_HEALTH_CONNECT: WtHealthConnectType[] = [
  {
    "name": "EXERCISE_TYPE_BADMINTON",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_BADMINTON",
    "value": 2,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_BADMINTON()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_BADMINTON",
      "value": 1,
      "description": "Use this type for the badminton playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BADMINTON to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_BADMINTON"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "badminton",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "badminton"
      },
      {
        "platform": "wear-os",
        "name": "BADMINTON"
      },
      {
        "platform": "google-health-api",
        "name": "BADMINTON"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_BASEBALL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_BASEBALL",
    "value": 4,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_BASEBALL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_BASEBALL",
      "value": 2,
      "description": "Use this type for the baseball playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BASEBALL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_BASEBALL"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "baseball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "baseball"
      },
      {
        "platform": "wear-os",
        "name": "BASEBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASEBALL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_BASKETBALL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_BASKETBALL",
    "value": 5,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_BASKETBALL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_BASKETBALL",
      "value": 3,
      "description": "Use this type for the basketball playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BASKETBALL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_BASKETBALL"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "basketball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "basketball"
      },
      {
        "platform": "wear-os",
        "name": "BASKETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASKETBALL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_BIKING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_BIKING",
    "value": 8,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_BIKING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_BIKING",
      "value": 4,
      "description": "Use this type for riding a bicycle session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BIKING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_BIKING"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_BIKING"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BIKING to setOf(EXERCISE_SEGMENT_TYPE_BIKING)"
    },
    "key": "biking",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "BIKING"
      },
      {
        "platform": "google-health-api",
        "name": "BIKING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_BIKING_STATIONARY",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_BIKING_STATIONARY",
    "value": 9,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_BIKING_STATIONARY()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_BIKING_STATIONARY",
      "value": 5,
      "description": "Use this type for riding a stationary bicycle session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BIKING_STATIONARY to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_BIKING_STATIONARY"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_BIKING_STATIONARY"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BIKING_STATIONARY to setOf(EXERCISE_SEGMENT_TYPE_BIKING_STATIONARY)"
    },
    "key": "bikingstationary",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "BIKING_STATIONARY"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_BOOT_CAMP",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_BOOT_CAMP",
    "value": 10,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_BOOT_CAMP()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_BOOT_CAMP",
      "value": 6,
      "description": "Use this type for the boot camp session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BOOT_CAMP to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_BOOT_CAMP"
    },
    "segments": {
      "rule": "any",
      "segments": [],
      "via": "UNIVERSAL_SESSION_TYPES",
      "evidence": "internal val UNIVERSAL_SESSION_TYPES = setOf( ExerciseSessionRecord.EXERCISE_TYPE_BOOT_CAMP, ExerciseSessionRecord.EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING, ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT, )"
    },
    "key": "bootcamp",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "BOOT_CAMP"
      },
      {
        "platform": "google-health-api",
        "name": "BOOTCAMP"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_BOXING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_BOXING",
    "value": 11,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_BOXING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_BOXING",
      "value": 7,
      "description": "Use this type for boxing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_BOXING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_BOXING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "boxing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "boxing"
      },
      {
        "platform": "wear-os",
        "name": "BOXING"
      },
      {
        "platform": "google-health-api",
        "name": "BOXING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_CALISTHENICS",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_CALISTHENICS",
    "value": 13,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_CALISTHENICS()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_CALISTHENICS",
      "value": 8,
      "description": "Use this type for calisthenics session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_CALISTHENICS to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_CALISTHENICS"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_ARM_CURL",
        "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_BALL_SLAM",
        "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_BURPEE",
        "EXERCISE_SEGMENT_TYPE_CRUNCH",
        "EXERCISE_SEGMENT_TYPE_DEADLIFT",
        "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
        "EXERCISE_SEGMENT_TYPE_FORWARD_TWIST",
        "EXERCISE_SEGMENT_TYPE_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_HIP_THRUST",
        "EXERCISE_SEGMENT_TYPE_HULA_HOOP",
        "EXERCISE_SEGMENT_TYPE_JUMP_ROPE",
        "EXERCISE_SEGMENT_TYPE_JUMPING_JACK",
        "EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING",
        "EXERCISE_SEGMENT_TYPE_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_LAT_PULL_DOWN",
        "EXERCISE_SEGMENT_TYPE_LEG_CURL",
        "EXERCISE_SEGMENT_TYPE_LEG_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_LEG_PRESS",
        "EXERCISE_SEGMENT_TYPE_LEG_RAISE",
        "EXERCISE_SEGMENT_TYPE_LUNGE",
        "EXERCISE_SEGMENT_TYPE_MOUNTAIN_CLIMBER",
        "EXERCISE_SEGMENT_TYPE_PLANK",
        "EXERCISE_SEGMENT_TYPE_PULL_UP",
        "EXERCISE_SEGMENT_TYPE_PUNCH",
        "EXERCISE_SEGMENT_TYPE_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_SQUAT",
        "EXERCISE_SEGMENT_TYPE_UPPER_TWIST",
        "EXERCISE_SEGMENT_TYPE_WEIGHTLIFTING"
      ],
      "via": "EXERCISE_SEGMENTS",
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_CALISTHENICS to EXERCISE_SEGMENTS"
    },
    "key": "calisthenics",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "CALISTHENICS"
      },
      {
        "platform": "google-health-api",
        "name": "CALISTHENICS"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_CRICKET",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_CRICKET",
    "value": 14,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_CRICKET()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_CRICKET",
      "value": 9,
      "description": "Use this type for the cricket playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_CRICKET to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_CRICKET"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "cricket",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "cricket"
      },
      {
        "platform": "wear-os",
        "name": "CRICKET"
      },
      {
        "platform": "google-health-api",
        "name": "CRICKET"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_DANCING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_DANCING",
    "value": 16,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_DANCING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_DANCING",
      "value": 10,
      "description": "Use this type for the dancing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_DANCING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_DANCING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "dancing",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "DANCING"
      },
      {
        "platform": "google-health-api",
        "name": "DANCING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_ELLIPTICAL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_ELLIPTICAL",
    "value": 25,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_ELLIPTICAL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_ELLIPTICAL",
      "value": 60,
      "description": "Use this type for elliptical workout.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ELLIPTICAL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_ELLIPTICAL"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_ELLIPTICAL"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ELLIPTICAL to setOf(EXERCISE_SEGMENT_TYPE_ELLIPTICAL)"
    },
    "key": "elliptical",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "elliptical"
      },
      {
        "platform": "wear-os",
        "name": "ELLIPTICAL"
      },
      {
        "platform": "google-health-api",
        "name": "ELLIPTICAL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_EXERCISE_CLASS",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_EXERCISE_CLASS",
    "value": 26,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_EXERCISE_CLASS()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_EXERCISE_CLASS",
      "value": 11,
      "description": "Use this type for the exercise class session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_EXERCISE_CLASS to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_EXERCISE_CLASS"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_YOGA",
        "EXERCISE_SEGMENT_TYPE_BIKING_STATIONARY",
        "EXERCISE_SEGMENT_TYPE_PILATES",
        "EXERCISE_SEGMENT_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_EXERCISE_CLASS to setOf( EXERCISE_SEGMENT_TYPE_YOGA, EXERCISE_SEGMENT_TYPE_BIKING_STATIONARY, EXERCISE_SEGMENT_TYPE_PILATES, EXERCISE_SEGMENT_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING, )"
    },
    "key": "exerciseclass",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "EXERCISE_CLASS"
      },
      {
        "platform": "google-health-api",
        "name": "EXERCISE_CLASS"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_FENCING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_FENCING",
    "value": 27,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_FENCING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_FENCING",
      "value": 12,
      "description": "Use this type for the fencing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_FENCING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_FENCING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "fencing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "fencing"
      },
      {
        "platform": "wear-os",
        "name": "FENCING"
      },
      {
        "platform": "google-health-api",
        "name": "FENCING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_FOOTBALL_AMERICAN",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_FOOTBALL_AMERICAN",
    "value": 28,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_FOOTBALL_AMERICAN()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_FOOTBALL_AMERICAN",
      "value": 13,
      "description": "Use this type for the American football playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_FOOTBALL_AMERICAN to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_FOOTBALL_AMERICAN"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "footballamerican",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "FOOTBALL_AMERICAN"
      },
      {
        "platform": "google-health-api",
        "name": "FOOTBALL_AMERICAN"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_FOOTBALL_AUSTRALIAN",
    "value": 29,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_FOOTBALL_AUSTRALIAN()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_FOOTBALL_AUSTRALIAN",
      "value": 14,
      "description": "Use this type for the Australian football playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_FOOTBALL_AUSTRALIAN to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_FOOTBALL_AUSTRALIAN"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "footballaustralian",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "FOOTBALL_AUSTRALIAN"
      },
      {
        "platform": "google-health-api",
        "name": "FOOTBALL_AUSTRALIAN"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_FRISBEE_DISC",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_FRISBEE_DISC",
    "value": 31,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_FRISBEE_DISC()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_FRISBEE_DISC",
      "value": 15,
      "description": "Use this type for the frisbee disc playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_FRISBEE_DISC to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_FRISBEE_DISC"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "frisbeedisc",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "FRISBEE_DISC"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_GOLF",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_GOLF",
    "value": 32,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_GOLF()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_GOLF",
      "value": 16,
      "description": "Use this type for the golf playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_GOLF to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_GOLF"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "golf",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "golf"
      },
      {
        "platform": "wear-os",
        "name": "GOLF"
      },
      {
        "platform": "google-health-api",
        "name": "GOLF"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_GUIDED_BREATHING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_GUIDED_BREATHING",
    "value": 33,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_GUIDED_BREATHING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_GUIDED_BREATHING",
      "value": 17,
      "description": "Use this type for the guided breathing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": 37,
      "deprecationNote": "This constant was deprecated in API level 37. Use `MindfulnessSessionRecord` of the corresponding type `MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_BREATHING`.",
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_GUIDED_BREATHING to @Suppress(\"DEPRECATION\") PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_GUIDED_BREATHING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "guidedbreathing",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "GUIDED_BREATHING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_GYMNASTICS",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_GYMNASTICS",
    "value": 34,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_GYMNASTICS()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_GYMNASTICS",
      "value": 18,
      "description": "Use this type for the gymnastics session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_GYMNASTICS to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_GYMNASTICS"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_ARM_CURL",
        "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_BALL_SLAM",
        "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_BURPEE",
        "EXERCISE_SEGMENT_TYPE_CRUNCH",
        "EXERCISE_SEGMENT_TYPE_DEADLIFT",
        "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
        "EXERCISE_SEGMENT_TYPE_FORWARD_TWIST",
        "EXERCISE_SEGMENT_TYPE_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_HIP_THRUST",
        "EXERCISE_SEGMENT_TYPE_HULA_HOOP",
        "EXERCISE_SEGMENT_TYPE_JUMP_ROPE",
        "EXERCISE_SEGMENT_TYPE_JUMPING_JACK",
        "EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING",
        "EXERCISE_SEGMENT_TYPE_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_LAT_PULL_DOWN",
        "EXERCISE_SEGMENT_TYPE_LEG_CURL",
        "EXERCISE_SEGMENT_TYPE_LEG_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_LEG_PRESS",
        "EXERCISE_SEGMENT_TYPE_LEG_RAISE",
        "EXERCISE_SEGMENT_TYPE_LUNGE",
        "EXERCISE_SEGMENT_TYPE_MOUNTAIN_CLIMBER",
        "EXERCISE_SEGMENT_TYPE_PLANK",
        "EXERCISE_SEGMENT_TYPE_PULL_UP",
        "EXERCISE_SEGMENT_TYPE_PUNCH",
        "EXERCISE_SEGMENT_TYPE_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_SQUAT",
        "EXERCISE_SEGMENT_TYPE_UPPER_TWIST",
        "EXERCISE_SEGMENT_TYPE_WEIGHTLIFTING"
      ],
      "via": "EXERCISE_SEGMENTS",
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_GYMNASTICS to EXERCISE_SEGMENTS"
    },
    "key": "gymnastics",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "gymnastics"
      },
      {
        "platform": "wear-os",
        "name": "GYMNASTICS"
      },
      {
        "platform": "google-health-api",
        "name": "GYMNASTICS"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_HANDBALL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_HANDBALL",
    "value": 35,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_HANDBALL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_HANDBALL",
      "value": 19,
      "description": "Use this type for the handball playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_HANDBALL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_HANDBALL"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "handball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "handball"
      },
      {
        "platform": "wear-os",
        "name": "HANDBALL"
      },
      {
        "platform": "google-health-api",
        "name": "HANDBALL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING",
    "value": 36,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING",
      "value": 20,
      "description": "Use this type for the high intensity interval training session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
    },
    "segments": {
      "rule": "any",
      "segments": [],
      "via": "UNIVERSAL_SESSION_TYPES",
      "evidence": "internal val UNIVERSAL_SESSION_TYPES = setOf( ExerciseSessionRecord.EXERCISE_TYPE_BOOT_CAMP, ExerciseSessionRecord.EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING, ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT, )"
    },
    "key": "highintensityintervaltraining",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "highIntensityIntervalTraining"
      },
      {
        "platform": "wear-os",
        "name": "HIGH_INTENSITY_INTERVAL_TRAINING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_HIKING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_HIKING",
    "value": 37,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_HIKING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_HIKING",
      "value": 21,
      "description": "Use this type for the hiking session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_HIKING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_HIKING"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_WALKING",
        "EXERCISE_SEGMENT_TYPE_WHEELCHAIR"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_HIKING to setOf(EXERCISE_SEGMENT_TYPE_WALKING, EXERCISE_SEGMENT_TYPE_WHEELCHAIR)"
    },
    "key": "hiking",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "hiking"
      },
      {
        "platform": "wear-os",
        "name": "HIKING"
      },
      {
        "platform": "google-health-api",
        "name": "HIKING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_ICE_HOCKEY",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_ICE_HOCKEY",
    "value": 38,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_ICE_HOCKEY()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_ICE_HOCKEY",
      "value": 22,
      "description": "Use this type for the ice hockey playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ICE_HOCKEY to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_ICE_HOCKEY"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "icehockey",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "ICE_HOCKEY"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_ICE_SKATING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_ICE_SKATING",
    "value": 39,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_ICE_SKATING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_ICE_SKATING",
      "value": 23,
      "description": "Use this type for the ice skating session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ICE_SKATING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_ICE_SKATING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "iceskating",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "ICE_SKATING"
      },
      {
        "platform": "google-health-api",
        "name": "ICE_SKATING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_MARTIAL_ARTS",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_MARTIAL_ARTS",
    "value": 44,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_MARTIAL_ARTS()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_MARTIAL_ARTS",
      "value": 24,
      "description": "Use this type for the martial arts training session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_MARTIAL_ARTS to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_MARTIAL_ARTS"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "martialarts",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "martialArts"
      },
      {
        "platform": "wear-os",
        "name": "MARTIAL_ARTS"
      },
      {
        "platform": "google-health-api",
        "name": "MARTIAL_ARTS"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_OTHER_WORKOUT",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT",
    "value": 0,
    "description": "Can be used to represent any generic workout that does not fall into a specific category. Any unknown new value definition will also fall automatically into `EXERCISE_TYPE_OTHER_WORKOUT`. Next Id: 84.",
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_OTHER_WORKOUT()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_OTHER_WORKOUT",
      "value": 58,
      "description": "Use this type for the other workout session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_OTHER_WORKOUT"
    },
    "segments": {
      "rule": "any",
      "segments": [],
      "via": "UNIVERSAL_SESSION_TYPES",
      "evidence": "internal val UNIVERSAL_SESSION_TYPES = setOf( ExerciseSessionRecord.EXERCISE_TYPE_BOOT_CAMP, ExerciseSessionRecord.EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING, ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT, )"
    },
    "key": "otherworkout",
    "counterparts": []
  },
  {
    "name": "EXERCISE_TYPE_PADDLING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_PADDLING",
    "value": 46,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_PADDLING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_PADDLING",
      "value": 25,
      "description": "Use this type for the paddling session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_PADDLING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_PADDLING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "paddling",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "PADDLING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_PARAGLIDING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_PARAGLIDING",
    "value": 47,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_PARAGLIDING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_PARAGLIDING",
      "value": 26,
      "description": "Use this type for the paragliding session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_PARAGLIDING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_PARAGLIDING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "paragliding",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "PARA_GLIDING"
      },
      {
        "platform": "google-health-api",
        "name": "PARAGLIDING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_PILATES",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_PILATES",
    "value": 48,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_PILATES()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_PILATES",
      "value": 27,
      "description": "Use this type for the pilates session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_PILATES to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_PILATES"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_PILATES"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_PILATES to setOf(EXERCISE_SEGMENT_TYPE_PILATES)"
    },
    "key": "pilates",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "pilates"
      },
      {
        "platform": "wear-os",
        "name": "PILATES"
      },
      {
        "platform": "google-health-api",
        "name": "PILATES"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_RACQUETBALL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_RACQUETBALL",
    "value": 50,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_RACQUETBALL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_RACQUETBALL",
      "value": 28,
      "description": "Use this type for the racquetball playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_RACQUETBALL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_RACQUETBALL"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "racquetball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "racquetball"
      },
      {
        "platform": "wear-os",
        "name": "RACQUETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "RACQUETBALL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_ROCK_CLIMBING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_ROCK_CLIMBING",
    "value": 51,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_ROCK_CLIMBING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_ROCK_CLIMBING",
      "value": 29,
      "description": "Use this type for the rock climbing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ROCK_CLIMBING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_ROCK_CLIMBING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "rockclimbing",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "ROCK_CLIMBING"
      },
      {
        "platform": "google-health-api",
        "name": "ROCK_CLIMBING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_ROLLER_HOCKEY",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_ROLLER_HOCKEY",
    "value": 52,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_ROLLER_HOCKEY()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_ROLLER_HOCKEY",
      "value": 30,
      "description": "Use this type for the roller hockey playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ROLLER_HOCKEY to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_ROLLER_HOCKEY"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "rollerhockey",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "ROLLER_HOCKEY"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_ROWING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_ROWING",
    "value": 53,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_ROWING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_ROWING",
      "value": 31,
      "description": "Use this type for the rowing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ROWING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_ROWING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "rowing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "rowing"
      },
      {
        "platform": "wear-os",
        "name": "ROWING"
      },
      {
        "platform": "google-health-api",
        "name": "ROWING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_ROWING_MACHINE",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_ROWING_MACHINE",
    "value": 54,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_ROWING_MACHINE()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_ROWING_MACHINE",
      "value": 61,
      "description": "Use this type for rowing machine.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ROWING_MACHINE to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_ROWING_MACHINE"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_ROWING_MACHINE"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_ROWING_MACHINE to setOf(EXERCISE_SEGMENT_TYPE_ROWING_MACHINE)"
    },
    "key": "rowingmachine",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "ROWING_MACHINE"
      },
      {
        "platform": "google-health-api",
        "name": "ROWING_MACHINE"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_RUGBY",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_RUGBY",
    "value": 55,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_RUGBY()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_RUGBY",
      "value": 32,
      "description": "Use this type for the rugby playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_RUGBY to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_RUGBY"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "rugby",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "rugby"
      },
      {
        "platform": "wear-os",
        "name": "RUGBY"
      },
      {
        "platform": "google-health-api",
        "name": "RUGBY"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_RUNNING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_RUNNING",
    "value": 56,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_RUNNING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_RUNNING",
      "value": 33,
      "description": "Use this type for the running session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_RUNNING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_RUNNING"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_RUNNING",
        "EXERCISE_SEGMENT_TYPE_WALKING"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_RUNNING to setOf(EXERCISE_SEGMENT_TYPE_RUNNING, EXERCISE_SEGMENT_TYPE_WALKING)"
    },
    "key": "running",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "running"
      },
      {
        "platform": "wear-os",
        "name": "RUNNING"
      },
      {
        "platform": "google-health-api",
        "name": "RUNNING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_RUNNING_TREADMILL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_RUNNING_TREADMILL",
    "value": 57,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_RUNNING_TREADMILL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_RUNNING_TREADMILL",
      "value": 34,
      "description": "Use this type for the treadmill running session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_RUNNING_TREADMILL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_RUNNING_TREADMILL"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_RUNNING_TREADMILL"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_RUNNING_TREADMILL to setOf(EXERCISE_SEGMENT_TYPE_RUNNING_TREADMILL)"
    },
    "key": "runningtreadmill",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "RUNNING_TREADMILL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SAILING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SAILING",
    "value": 58,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SAILING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SAILING",
      "value": 35,
      "description": "Use this type for the sailing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SAILING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SAILING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "sailing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "sailing"
      },
      {
        "platform": "wear-os",
        "name": "SAILING"
      },
      {
        "platform": "google-health-api",
        "name": "SAILING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SCUBA_DIVING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SCUBA_DIVING",
    "value": 59,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SCUBA_DIVING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SCUBA_DIVING",
      "value": 36,
      "description": "Use this type for the scuba diving session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SCUBA_DIVING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SCUBA_DIVING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "scubadiving",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "SCUBA_DIVING"
      },
      {
        "platform": "google-health-api",
        "name": "SCUBA_DIVING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SKATING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SKATING",
    "value": 60,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SKATING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SKATING",
      "value": 37,
      "description": "Use this type for the skating session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SKATING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SKATING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "skating",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "SKATING"
      },
      {
        "platform": "google-health-api",
        "name": "SKATING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SKIING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SKIING",
    "value": 61,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SKIING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SKIING",
      "value": 38,
      "description": "Use this type for the skiing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SKIING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SKIING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "skiing",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "SKIING"
      },
      {
        "platform": "google-health-api",
        "name": "SKIING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SNOWBOARDING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SNOWBOARDING",
    "value": 62,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SNOWBOARDING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SNOWBOARDING",
      "value": 39,
      "description": "Use this type for the snowboarding session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SNOWBOARDING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SNOWBOARDING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "snowboarding",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "snowboarding"
      },
      {
        "platform": "wear-os",
        "name": "SNOWBOARDING"
      },
      {
        "platform": "google-health-api",
        "name": "SNOWBOARDING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SNOWSHOEING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SNOWSHOEING",
    "value": 63,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SNOWSHOEING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SNOWSHOEING",
      "value": 40,
      "description": "Use this type for the snowshoeing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SNOWSHOEING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SNOWSHOEING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "snowshoeing",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "SNOWSHOEING"
      },
      {
        "platform": "google-health-api",
        "name": "SNOWSHOEING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SOCCER",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SOCCER",
    "value": 64,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SOCCER()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SOCCER",
      "value": 41,
      "description": "Use this type for the soccer playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SOCCER to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SOCCER"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "soccer",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "soccer"
      },
      {
        "platform": "wear-os",
        "name": "SOCCER"
      },
      {
        "platform": "google-health-api",
        "name": "SOCCER"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SOFTBALL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SOFTBALL",
    "value": 65,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SOFTBALL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SOFTBALL",
      "value": 42,
      "description": "Use this type for the softball playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SOFTBALL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SOFTBALL"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "softball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "softball"
      },
      {
        "platform": "wear-os",
        "name": "SOFTBALL"
      },
      {
        "platform": "google-health-api",
        "name": "SOFTBALL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SQUASH",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SQUASH",
    "value": 66,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SQUASH()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SQUASH",
      "value": 43,
      "description": "Use this type for the squash playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SQUASH to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SQUASH"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "squash",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "squash"
      },
      {
        "platform": "wear-os",
        "name": "SQUASH"
      },
      {
        "platform": "google-health-api",
        "name": "SQUASH"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_STAIR_CLIMBING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING",
    "value": 68,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_STAIR_CLIMBING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_STAIR_CLIMBING",
      "value": 44,
      "description": "Use this type for the stair climbing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_STAIR_CLIMBING"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_STAIR_CLIMBING"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING to setOf(EXERCISE_SEGMENT_TYPE_STAIR_CLIMBING)"
    },
    "key": "stairclimbing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "stairClimbing"
      },
      {
        "platform": "wear-os",
        "name": "STAIR_CLIMBING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING_MACHINE",
    "value": 69,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_STAIR_CLIMBING_MACHINE()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_STAIR_CLIMBING_MACHINE",
      "value": 59,
      "description": "Use this type for the stair climbing machine session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING_MACHINE to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_STAIR_CLIMBING_MACHINE"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_STAIR_CLIMBING_MACHINE"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_STAIR_CLIMBING_MACHINE to setOf(EXERCISE_SEGMENT_TYPE_STAIR_CLIMBING_MACHINE)"
    },
    "key": "stairclimbingmachine",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "STAIR_CLIMBING_MACHINE"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_STRENGTH_TRAINING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_STRENGTH_TRAINING",
    "value": 70,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_STRENGTH_TRAINING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_STRENGTH_TRAINING",
      "value": 45,
      "description": "Use this type for the strength training session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_STRENGTH_TRAINING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_STRENGTH_TRAINING"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_ARM_CURL",
        "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_BALL_SLAM",
        "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_BURPEE",
        "EXERCISE_SEGMENT_TYPE_CRUNCH",
        "EXERCISE_SEGMENT_TYPE_DEADLIFT",
        "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
        "EXERCISE_SEGMENT_TYPE_FORWARD_TWIST",
        "EXERCISE_SEGMENT_TYPE_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_HIP_THRUST",
        "EXERCISE_SEGMENT_TYPE_HULA_HOOP",
        "EXERCISE_SEGMENT_TYPE_JUMP_ROPE",
        "EXERCISE_SEGMENT_TYPE_JUMPING_JACK",
        "EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING",
        "EXERCISE_SEGMENT_TYPE_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_LAT_PULL_DOWN",
        "EXERCISE_SEGMENT_TYPE_LEG_CURL",
        "EXERCISE_SEGMENT_TYPE_LEG_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_LEG_PRESS",
        "EXERCISE_SEGMENT_TYPE_LEG_RAISE",
        "EXERCISE_SEGMENT_TYPE_LUNGE",
        "EXERCISE_SEGMENT_TYPE_MOUNTAIN_CLIMBER",
        "EXERCISE_SEGMENT_TYPE_PLANK",
        "EXERCISE_SEGMENT_TYPE_PULL_UP",
        "EXERCISE_SEGMENT_TYPE_PUNCH",
        "EXERCISE_SEGMENT_TYPE_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_SQUAT",
        "EXERCISE_SEGMENT_TYPE_UPPER_TWIST",
        "EXERCISE_SEGMENT_TYPE_WEIGHTLIFTING"
      ],
      "via": "EXERCISE_SEGMENTS",
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_STRENGTH_TRAINING to EXERCISE_SEGMENTS"
    },
    "key": "strengthtraining",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "STRENGTH_TRAINING"
      },
      {
        "platform": "google-health-api",
        "name": "STRENGTH_TRAINING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_STRETCHING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_STRETCHING",
    "value": 71,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_STRETCHING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_STRETCHING",
      "value": 46,
      "description": "Use this type for the stretching session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_STRETCHING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_STRETCHING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "stretching",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "STRETCHING"
      },
      {
        "platform": "google-health-api",
        "name": "STRETCHING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SURFING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SURFING",
    "value": 72,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SURFING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SURFING",
      "value": 47,
      "description": "Use this type for the surfing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SURFING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SURFING"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "surfing",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "SURFING"
      },
      {
        "platform": "google-health-api",
        "name": "SURFING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SWIMMING_OPEN_WATER",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_OPEN_WATER",
    "value": 73,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SWIMMING_OPEN_WATER()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SWIMMING_OPEN_WATER",
      "value": 48,
      "description": "Use this type for the swimming in the open water session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_OPEN_WATER to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SWIMMING_OPEN_WATER"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_SWIMMING_OPEN_WATER",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_BACKSTROKE",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_BREASTSTROKE",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_FREESTYLE",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_BUTTERFLY",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_MIXED",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_OTHER"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_OPEN_WATER to buildSet { add(EXERCISE_SEGMENT_TYPE_SWIMMING_OPEN_WATER) addAll(SWIMMING_SEGMENTS) }"
    },
    "key": "swimmingopenwater",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "SWIMMING_OPEN_WATER"
      },
      {
        "platform": "google-health-api",
        "name": "SWIMMING_OPEN_WATER"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_SWIMMING_POOL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_POOL",
    "value": 74,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_SWIMMING_POOL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_SWIMMING_POOL",
      "value": 49,
      "description": "Use this type for the swimming in the pool session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_POOL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_SWIMMING_POOL"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_SWIMMING_POOL",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_BACKSTROKE",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_BREASTSTROKE",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_FREESTYLE",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_BUTTERFLY",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_MIXED",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_OTHER"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_SWIMMING_POOL to buildSet { add(EXERCISE_SEGMENT_TYPE_SWIMMING_POOL) addAll(SWIMMING_SEGMENTS) }"
    },
    "key": "swimmingpool",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "SWIMMING_POOL"
      },
      {
        "platform": "google-health-api",
        "name": "SWIMMING_POOL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_TABLE_TENNIS",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_TABLE_TENNIS",
    "value": 75,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_TABLE_TENNIS()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_TABLE_TENNIS",
      "value": 50,
      "description": "Use this type for the table tennis playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_TABLE_TENNIS to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_TABLE_TENNIS"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "tabletennis",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "tableTennis"
      },
      {
        "platform": "wear-os",
        "name": "TABLE_TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TABLE_TENNIS"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_TENNIS",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_TENNIS",
    "value": 76,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_TENNIS()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_TENNIS",
      "value": 51,
      "description": "Use this type for the tennis playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_TENNIS to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_TENNIS"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "tennis",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "tennis"
      },
      {
        "platform": "wear-os",
        "name": "TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TENNIS"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_VOLLEYBALL",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_VOLLEYBALL",
    "value": 78,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_VOLLEYBALL()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_VOLLEYBALL",
      "value": 52,
      "description": "Use this type for the volleyball playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_VOLLEYBALL to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_VOLLEYBALL"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "volleyball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "volleyball"
      },
      {
        "platform": "wear-os",
        "name": "VOLLEYBALL"
      },
      {
        "platform": "google-health-api",
        "name": "VOLLEYBALL"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_WALKING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_WALKING",
    "value": 79,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_WALKING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_WALKING",
      "value": 53,
      "description": "Use this type for the walking session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_WALKING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_WALKING"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_WALKING"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_WALKING to setOf(EXERCISE_SEGMENT_TYPE_WALKING)"
    },
    "key": "walking",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "walking"
      },
      {
        "platform": "wear-os",
        "name": "WALKING"
      },
      {
        "platform": "google-health-api",
        "name": "WALKING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_WATER_POLO",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_WATER_POLO",
    "value": 80,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_WATER_POLO()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_WATER_POLO",
      "value": 54,
      "description": "Use this type for the water polo playing session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_WATER_POLO to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_WATER_POLO"
    },
    "segments": {
      "rule": "universal-only",
      "segments": [],
      "via": null,
      "evidence": null
    },
    "key": "waterpolo",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "waterPolo"
      },
      {
        "platform": "wear-os",
        "name": "WATER_POLO"
      },
      {
        "platform": "google-health-api",
        "name": "WATER_POLO"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_WEIGHTLIFTING",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_WEIGHTLIFTING",
    "value": 81,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_WEIGHTLIFTING()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_WEIGHTLIFTING",
      "value": 55,
      "description": "Use this type for the weightlifting session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_WEIGHTLIFTING to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_WEIGHTLIFTING"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_ARM_CURL",
        "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_BALL_SLAM",
        "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_BURPEE",
        "EXERCISE_SEGMENT_TYPE_CRUNCH",
        "EXERCISE_SEGMENT_TYPE_DEADLIFT",
        "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
        "EXERCISE_SEGMENT_TYPE_FORWARD_TWIST",
        "EXERCISE_SEGMENT_TYPE_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_HIP_THRUST",
        "EXERCISE_SEGMENT_TYPE_HULA_HOOP",
        "EXERCISE_SEGMENT_TYPE_JUMP_ROPE",
        "EXERCISE_SEGMENT_TYPE_JUMPING_JACK",
        "EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING",
        "EXERCISE_SEGMENT_TYPE_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_LAT_PULL_DOWN",
        "EXERCISE_SEGMENT_TYPE_LEG_CURL",
        "EXERCISE_SEGMENT_TYPE_LEG_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_LEG_PRESS",
        "EXERCISE_SEGMENT_TYPE_LEG_RAISE",
        "EXERCISE_SEGMENT_TYPE_LUNGE",
        "EXERCISE_SEGMENT_TYPE_MOUNTAIN_CLIMBER",
        "EXERCISE_SEGMENT_TYPE_PLANK",
        "EXERCISE_SEGMENT_TYPE_PULL_UP",
        "EXERCISE_SEGMENT_TYPE_PUNCH",
        "EXERCISE_SEGMENT_TYPE_SHOULDER_PRESS",
        "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_SIT_UP",
        "EXERCISE_SEGMENT_TYPE_SQUAT",
        "EXERCISE_SEGMENT_TYPE_UPPER_TWIST",
        "EXERCISE_SEGMENT_TYPE_WEIGHTLIFTING"
      ],
      "via": "EXERCISE_SEGMENTS",
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_WEIGHTLIFTING to EXERCISE_SEGMENTS"
    },
    "key": "weightlifting",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "WEIGHTLIFTING"
      },
      {
        "platform": "google-health-api",
        "name": "WEIGHTLIFTING"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_WHEELCHAIR",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_WHEELCHAIR",
    "value": 82,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_WHEELCHAIR()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_WHEELCHAIR",
      "value": 56,
      "description": "Use this type for the wheelchair session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_WHEELCHAIR to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_WHEELCHAIR"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_WHEELCHAIR"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_WHEELCHAIR to setOf(EXERCISE_SEGMENT_TYPE_WHEELCHAIR)"
    },
    "key": "wheelchair",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "WHEELCHAIR"
      }
    ]
  },
  {
    "name": "EXERCISE_TYPE_YOGA",
    "qualified": "ExerciseSessionRecord.EXERCISE_TYPE_YOGA",
    "value": 83,
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord#EXERCISE_TYPE_YOGA()",
    "platform": {
      "name": "EXERCISE_SESSION_TYPE_YOGA",
      "value": 57,
      "description": "Use this type for the yoga session.",
      "apiLevel": 34,
      "extension": "U Extensions 7",
      "deprecatedIn": null,
      "deprecationNote": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_YOGA to PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_YOGA"
    },
    "segments": {
      "rule": "listed",
      "segments": [
        "EXERCISE_SEGMENT_TYPE_YOGA"
      ],
      "via": null,
      "evidence": "ExerciseSessionRecord.EXERCISE_TYPE_YOGA to setOf(EXERCISE_SEGMENT_TYPE_YOGA)"
    },
    "key": "yoga",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "yoga"
      },
      {
        "platform": "wear-os",
        "name": "YOGA"
      },
      {
        "platform": "google-health-api",
        "name": "YOGA"
      }
    ]
  }
];

/** Every ExerciseSegment.EXERCISE_SEGMENT_TYPE_* constant on the Jetpack reference. */
export const WT_HC_SEGMENT_TYPES: { name: string; value: number; description: string | null }[] = [
  {
    "name": "EXERCISE_SEGMENT_TYPE_ARM_CURL",
    "value": 1,
    "description": "Use this type for arm curls."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION",
    "value": 2,
    "description": "Use this type for back extensions."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BALL_SLAM",
    "value": 3,
    "description": "Use this type for ball slams."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS",
    "value": 4,
    "description": "Use this type for barbel shoulder press."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BENCH_PRESS",
    "value": 5,
    "description": "Use this type for bench presses."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BENCH_SIT_UP",
    "value": 6,
    "description": "Use this type for bench sit up."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BIKING",
    "value": 7,
    "description": "Use this type for biking."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BIKING_STATIONARY",
    "value": 8,
    "description": "Use this type for stationary biking."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_BURPEE",
    "value": 9,
    "description": "Use this type for burpees."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_CRUNCH",
    "value": 10,
    "description": "Use this type for crunches."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DEADLIFT",
    "value": 11,
    "description": "Use this type for deadlifts."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
    "value": 12,
    "description": "Use this type for double arms triceps extensions."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
    "value": 13,
    "description": "Use this type for left arm dumbbell curl."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
    "value": 14,
    "description": null
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
    "value": 15,
    "description": "Use this type for right arm dumbbell curl."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
    "value": 16,
    "description": "Use this type for dumbbell lateral raises."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
    "value": 17,
    "description": "Use this type for dumbbells rows."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
    "value": 18,
    "description": "Use this type for left arm triceps extensions."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
    "value": 19,
    "description": "Use this type for right arm triceps extensions."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
    "value": 20,
    "description": "Use this type for two arms triceps extensions."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_ELLIPTICAL",
    "value": 21,
    "description": "Use this type for elliptical workout."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_FORWARD_TWIST",
    "value": 22,
    "description": "Use this type for forward twists."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_FRONT_RAISE",
    "value": 23,
    "description": "Use this type for front raises."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING",
    "value": 24,
    "description": "Use this type for high intensity training."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_HIP_THRUST",
    "value": 25,
    "description": "Use this type for hip thrusts."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_HULA_HOOP",
    "value": 26,
    "description": "Use this type for hula-hoops."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_JUMPING_JACK",
    "value": 27,
    "description": "Use this type for jumping jacks."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_JUMP_ROPE",
    "value": 28,
    "description": "Use this type for jump rope."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING",
    "value": 29,
    "description": "Use this type for kettlebell swings."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_LATERAL_RAISE",
    "value": 30,
    "description": "Use this type for lateral raises."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_LAT_PULL_DOWN",
    "value": 31,
    "description": "Use this type for lat pull-downs."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_LEG_CURL",
    "value": 32,
    "description": "Use this type for leg curls."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_LEG_EXTENSION",
    "value": 33,
    "description": "Use this type for leg extensions."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_LEG_PRESS",
    "value": 34,
    "description": "Use this type for leg presses."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_LEG_RAISE",
    "value": 35,
    "description": "Use this type for leg raises."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_LUNGE",
    "value": 36,
    "description": "Use this type for lunges."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_MOUNTAIN_CLIMBER",
    "value": 37,
    "description": "Use this type for mountain climber."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_OTHER_WORKOUT",
    "value": 38,
    "description": "Use this type for other workout."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_PAUSE",
    "value": 39,
    "description": "Use this type for the pause."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_PILATES",
    "value": 40,
    "description": "Use this type for pilates."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_PLANK",
    "value": 41,
    "description": "Use this type for plank."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_PULL_UP",
    "value": 42,
    "description": "Use this type for pull-ups."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_PUNCH",
    "value": 43,
    "description": "Use this type for punches."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_REST",
    "value": 44,
    "description": "Use this type for the rest."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_ROWING_MACHINE",
    "value": 45,
    "description": "Use this type for rowing machine workout."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_RUNNING",
    "value": 46,
    "description": "Use this type for running."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_RUNNING_TREADMILL",
    "value": 47,
    "description": "Use this type for treadmill running."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SHOULDER_PRESS",
    "value": 48,
    "description": null
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION",
    "value": 49,
    "description": "Use this type for shoulder press."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SIT_UP",
    "value": 50,
    "description": "Use this type for sit-ups."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SQUAT",
    "value": 51,
    "description": "Use this type for squats."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_STAIR_CLIMBING",
    "value": 52,
    "description": "Use this type for stair climbing."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_STAIR_CLIMBING_MACHINE",
    "value": 53,
    "description": "Use this type for stair climbing machine."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_STRETCHING",
    "value": 54,
    "description": "Use this type for stretching."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_BACKSTROKE",
    "value": 55,
    "description": "Use this type for backstroke swimming."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_BREASTSTROKE",
    "value": 56,
    "description": "Use this type for breaststroke swimming."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_BUTTERFLY",
    "value": 57,
    "description": "Use this type for butterfly swimming."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_FREESTYLE",
    "value": 58,
    "description": null
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_MIXED",
    "value": 59,
    "description": "Use this type for mixed swimming."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_OPEN_WATER",
    "value": 60,
    "description": "Use this type for swimming in open water."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_OTHER",
    "value": 61,
    "description": "Use this type if other swimming styles are not suitable."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_SWIMMING_POOL",
    "value": 62,
    "description": "Use this type for swimming in the pool."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_UNKNOWN",
    "value": 0,
    "description": "Use this type if the type of the exercise segment is not known."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_UPPER_TWIST",
    "value": 63,
    "description": "Use this type for upper twists."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_WALKING",
    "value": 64,
    "description": "Use this type for walking."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_WEIGHTLIFTING",
    "value": 65,
    "description": "Use this type for weightlifting."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_WHEELCHAIR",
    "value": 66,
    "description": "Use this type for wheelchair."
  },
  {
    "name": "EXERCISE_SEGMENT_TYPE_YOGA",
    "value": 67,
    "description": "Use this type for yoga."
  }
];

/** The segment types every Health Connect session accepts (UNIVERSAL_SEGMENTS), and the source line. */
export const WT_HC_UNIVERSAL_SEGMENTS: { segments: string[]; evidence: string } = {
  "segments": [
    "EXERCISE_SEGMENT_TYPE_OTHER_WORKOUT",
    "EXERCISE_SEGMENT_TYPE_PAUSE",
    "EXERCISE_SEGMENT_TYPE_REST",
    "EXERCISE_SEGMENT_TYPE_STRETCHING",
    "EXERCISE_SEGMENT_TYPE_UNKNOWN"
  ],
  "evidence": "internal val UNIVERSAL_SEGMENTS = setOf( EXERCISE_SEGMENT_TYPE_OTHER_WORKOUT, EXERCISE_SEGMENT_TYPE_PAUSE, EXERCISE_SEGMENT_TYPE_REST, EXERCISE_SEGMENT_TYPE_STRETCHING, EXERCISE_SEGMENT_TYPE_UNKNOWN, )"
};

/** What Google's reference and the library source say about segment compatibility, verbatim. */
export const WT_HC_SEGMENT_RULE: {
  functionDoc: string | null;
  addedIn: string | null;
  /** The constructor's check, verbatim (whitespace collapsed). */
  requireLine: string | null;
  /** The condition under which the constructor builds a platform record instead of running that check. */
  platformBranch: string | null;
} = {
  "functionDoc": "Is a segment type compatible with a session type.",
  "addedIn": "1.2.0-alpha06",
  "requireLine": "require( isSegmentTypeCompatibleWithSessionType(segment.segmentType, exerciseType) ) { \"segmentType and sessionType is not compatible.\" }",
  "platformBranch": "init { if ( Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE && isAtLeastSdkExtension21() ) { @Suppress(\"CheckReturnValue\") this.toPlatformRecord() } else {"
};

export type WtWearOsType = {
  name: string;
  qualified: string;
  /** The id ExerciseType.kt passes to the constructor; null where the source does not declare the constant. */
  id: number | null;
  /** The declaration the id was read from. */
  idEvidence: string | null;
  /** The reference's description; null where it gives none. */
  description: string | null;
  deprecated: boolean;
  docUrl: string;
  key: string;
  counterparts: WtCounterpart[];
};

export const WT_WEAR_OS: WtWearOsType[] = [
  {
    "name": "ALPINE_SKIING",
    "qualified": "ExerciseType.ALPINE_SKIING",
    "id": 92,
    "idEvidence": "@JvmField public val ALPINE_SKIING: ExerciseType = ExerciseType(92, \"ALPINE_SKIING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ALPINE_SKIING()",
    "key": "alpineskiing",
    "counterparts": []
  },
  {
    "name": "BACKPACKING",
    "qualified": "ExerciseType.BACKPACKING",
    "id": 84,
    "idEvidence": "@JvmField public val BACKPACKING: ExerciseType = ExerciseType(84, \"BACKPACKING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BACKPACKING()",
    "key": "backpacking",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "BACKPACKING"
      }
    ]
  },
  {
    "name": "BACK_EXTENSION",
    "qualified": "ExerciseType.BACK_EXTENSION",
    "id": 1,
    "idEvidence": "@JvmField public val BACK_EXTENSION: ExerciseType = ExerciseType(1, \"BACK_EXTENSION\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BACK_EXTENSION()",
    "key": "backextension",
    "counterparts": []
  },
  {
    "name": "BADMINTON",
    "qualified": "ExerciseType.BADMINTON",
    "id": 2,
    "idEvidence": "@JvmField public val BADMINTON: ExerciseType = ExerciseType(2, \"BADMINTON\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BADMINTON()",
    "key": "badminton",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "badminton"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BADMINTON"
      },
      {
        "platform": "google-health-api",
        "name": "BADMINTON"
      }
    ]
  },
  {
    "name": "BARBELL_SHOULDER_PRESS",
    "qualified": "ExerciseType.BARBELL_SHOULDER_PRESS",
    "id": 3,
    "idEvidence": "@JvmField public val BARBELL_SHOULDER_PRESS: ExerciseType = ExerciseType(3, \"BARBELL_SHOULDER_PRESS\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BARBELL_SHOULDER_PRESS()",
    "key": "barbellshoulderpress",
    "counterparts": []
  },
  {
    "name": "BASEBALL",
    "qualified": "ExerciseType.BASEBALL",
    "id": 4,
    "idEvidence": "@JvmField public val BASEBALL: ExerciseType = ExerciseType(4, \"BASEBALL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BASEBALL()",
    "key": "baseball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "baseball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASEBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASEBALL"
      }
    ]
  },
  {
    "name": "BASKETBALL",
    "qualified": "ExerciseType.BASKETBALL",
    "id": 5,
    "idEvidence": "@JvmField public val BASKETBALL: ExerciseType = ExerciseType(5, \"BASKETBALL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BASKETBALL()",
    "key": "basketball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "basketball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASKETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASKETBALL"
      }
    ]
  },
  {
    "name": "BENCH_PRESS",
    "qualified": "ExerciseType.BENCH_PRESS",
    "id": 6,
    "idEvidence": "@JvmField public val BENCH_PRESS: ExerciseType = ExerciseType(6, \"BENCH_PRESS\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BENCH_PRESS()",
    "key": "benchpress",
    "counterparts": []
  },
  {
    "name": "BIKING",
    "qualified": "ExerciseType.BIKING",
    "id": 8,
    "idEvidence": "@JvmField public val BIKING: ExerciseType = ExerciseType(8, \"BIKING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BIKING()",
    "key": "biking",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BIKING"
      },
      {
        "platform": "google-health-api",
        "name": "BIKING"
      }
    ]
  },
  {
    "name": "BIKING_STATIONARY",
    "qualified": "ExerciseType.BIKING_STATIONARY",
    "id": 9,
    "idEvidence": "@JvmField public val BIKING_STATIONARY: ExerciseType = ExerciseType(9, \"BIKING_STATIONARY\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BIKING_STATIONARY()",
    "key": "bikingstationary",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BIKING_STATIONARY"
      }
    ]
  },
  {
    "name": "BOOT_CAMP",
    "qualified": "ExerciseType.BOOT_CAMP",
    "id": 10,
    "idEvidence": "@JvmField public val BOOT_CAMP: ExerciseType = ExerciseType(10, \"BOOT_CAMP\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BOOT_CAMP()",
    "key": "bootcamp",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BOOT_CAMP"
      },
      {
        "platform": "google-health-api",
        "name": "BOOTCAMP"
      }
    ]
  },
  {
    "name": "BOXING",
    "qualified": "ExerciseType.BOXING",
    "id": 11,
    "idEvidence": "@JvmField public val BOXING: ExerciseType = ExerciseType(11, \"BOXING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BOXING()",
    "key": "boxing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "boxing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BOXING"
      },
      {
        "platform": "google-health-api",
        "name": "BOXING"
      }
    ]
  },
  {
    "name": "BURPEE",
    "qualified": "ExerciseType.BURPEE",
    "id": 12,
    "idEvidence": "@JvmField public val BURPEE: ExerciseType = ExerciseType(12, \"BURPEE\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#BURPEE()",
    "key": "burpee",
    "counterparts": []
  },
  {
    "name": "CALISTHENICS",
    "qualified": "ExerciseType.CALISTHENICS",
    "id": 13,
    "idEvidence": "@JvmField public val CALISTHENICS: ExerciseType = ExerciseType(13, \"CALISTHENICS\")",
    "description": "Calisthenics (E.g., push ups, sit ups, pull-ups, jumping jacks).",
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#CALISTHENICS()",
    "key": "calisthenics",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_CALISTHENICS"
      },
      {
        "platform": "google-health-api",
        "name": "CALISTHENICS"
      }
    ]
  },
  {
    "name": "CRICKET",
    "qualified": "ExerciseType.CRICKET",
    "id": 14,
    "idEvidence": "@JvmField public val CRICKET: ExerciseType = ExerciseType(14, \"CRICKET\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#CRICKET()",
    "key": "cricket",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "cricket"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_CRICKET"
      },
      {
        "platform": "google-health-api",
        "name": "CRICKET"
      }
    ]
  },
  {
    "name": "CROSS_COUNTRY_SKIING",
    "qualified": "ExerciseType.CROSS_COUNTRY_SKIING",
    "id": 91,
    "idEvidence": "@JvmField public val CROSS_COUNTRY_SKIING: ExerciseType = ExerciseType(91, \"CROSS_COUNTRY_SKIING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#CROSS_COUNTRY_SKIING()",
    "key": "crosscountryskiing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "crossCountrySkiing"
      }
    ]
  },
  {
    "name": "CRUNCH",
    "qualified": "ExerciseType.CRUNCH",
    "id": 15,
    "idEvidence": "@JvmField public val CRUNCH: ExerciseType = ExerciseType(15, \"CRUNCH\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#CRUNCH()",
    "key": "crunch",
    "counterparts": []
  },
  {
    "name": "DANCING",
    "qualified": "ExerciseType.DANCING",
    "id": 16,
    "idEvidence": "@JvmField public val DANCING: ExerciseType = ExerciseType(16, \"DANCING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#DANCING()",
    "key": "dancing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_DANCING"
      },
      {
        "platform": "google-health-api",
        "name": "DANCING"
      }
    ]
  },
  {
    "name": "DEADLIFT",
    "qualified": "ExerciseType.DEADLIFT",
    "id": 17,
    "idEvidence": "@JvmField public val DEADLIFT: ExerciseType = ExerciseType(17, \"DEADLIFT\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#DEADLIFT()",
    "key": "deadlift",
    "counterparts": []
  },
  {
    "name": "ELLIPTICAL",
    "qualified": "ExerciseType.ELLIPTICAL",
    "id": 25,
    "idEvidence": "@JvmField public val ELLIPTICAL: ExerciseType = ExerciseType(25, \"ELLIPTICAL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ELLIPTICAL()",
    "key": "elliptical",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "elliptical"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ELLIPTICAL"
      },
      {
        "platform": "google-health-api",
        "name": "ELLIPTICAL"
      }
    ]
  },
  {
    "name": "EXERCISE_CLASS",
    "qualified": "ExerciseType.EXERCISE_CLASS",
    "id": 26,
    "idEvidence": "@JvmField public val EXERCISE_CLASS: ExerciseType = ExerciseType(26, \"EXERCISE_CLASS\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#EXERCISE_CLASS()",
    "key": "exerciseclass",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_EXERCISE_CLASS"
      },
      {
        "platform": "google-health-api",
        "name": "EXERCISE_CLASS"
      }
    ]
  },
  {
    "name": "FENCING",
    "qualified": "ExerciseType.FENCING",
    "id": 27,
    "idEvidence": "@JvmField public val FENCING: ExerciseType = ExerciseType(27, \"FENCING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#FENCING()",
    "key": "fencing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "fencing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FENCING"
      },
      {
        "platform": "google-health-api",
        "name": "FENCING"
      }
    ]
  },
  {
    "name": "FOOTBALL_AMERICAN",
    "qualified": "ExerciseType.FOOTBALL_AMERICAN",
    "id": 29,
    "idEvidence": "@JvmField public val FOOTBALL_AMERICAN: ExerciseType = ExerciseType(29, \"FOOTBALL_AMERICAN\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#FOOTBALL_AMERICAN()",
    "key": "footballamerican",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FOOTBALL_AMERICAN"
      },
      {
        "platform": "google-health-api",
        "name": "FOOTBALL_AMERICAN"
      }
    ]
  },
  {
    "name": "FOOTBALL_AUSTRALIAN",
    "qualified": "ExerciseType.FOOTBALL_AUSTRALIAN",
    "id": 30,
    "idEvidence": "@JvmField public val FOOTBALL_AUSTRALIAN: ExerciseType = ExerciseType(30, \"FOOTBALL_AUSTRALIAN\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#FOOTBALL_AUSTRALIAN()",
    "key": "footballaustralian",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN"
      },
      {
        "platform": "google-health-api",
        "name": "FOOTBALL_AUSTRALIAN"
      }
    ]
  },
  {
    "name": "FORWARD_TWIST",
    "qualified": "ExerciseType.FORWARD_TWIST",
    "id": 31,
    "idEvidence": "@JvmField public val FORWARD_TWIST: ExerciseType = ExerciseType(31, \"FORWARD_TWIST\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#FORWARD_TWIST()",
    "key": "forwardtwist",
    "counterparts": []
  },
  {
    "name": "FRISBEE_DISC",
    "qualified": "ExerciseType.FRISBEE_DISC",
    "id": 28,
    "idEvidence": "@JvmField public val FRISBEE_DISC: ExerciseType = ExerciseType(28, \"FRISBEE_DISC\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#FRISBEE_DISC()",
    "key": "frisbeedisc",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FRISBEE_DISC"
      }
    ]
  },
  {
    "name": "GOLF",
    "qualified": "ExerciseType.GOLF",
    "id": 32,
    "idEvidence": "@JvmField public val GOLF: ExerciseType = ExerciseType(32, \"GOLF\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#GOLF()",
    "key": "golf",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "golf"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GOLF"
      },
      {
        "platform": "google-health-api",
        "name": "GOLF"
      }
    ]
  },
  {
    "name": "GUIDED_BREATHING",
    "qualified": "ExerciseType.GUIDED_BREATHING",
    "id": 33,
    "idEvidence": "@JvmField public val GUIDED_BREATHING: ExerciseType = ExerciseType(33, \"GUIDED_BREATHING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#GUIDED_BREATHING()",
    "key": "guidedbreathing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GUIDED_BREATHING"
      }
    ]
  },
  {
    "name": "GYMNASTICS",
    "qualified": "ExerciseType.GYMNASTICS",
    "id": 34,
    "idEvidence": "@JvmField public val GYMNASTICS: ExerciseType = ExerciseType(34, \"GYMNASTICS\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#GYMNASTICS()",
    "key": "gymnastics",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "gymnastics"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GYMNASTICS"
      },
      {
        "platform": "google-health-api",
        "name": "GYMNASTICS"
      }
    ]
  },
  {
    "name": "HANDBALL",
    "qualified": "ExerciseType.HANDBALL",
    "id": 35,
    "idEvidence": "@JvmField public val HANDBALL: ExerciseType = ExerciseType(35, \"HANDBALL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#HANDBALL()",
    "key": "handball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "handball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HANDBALL"
      },
      {
        "platform": "google-health-api",
        "name": "HANDBALL"
      }
    ]
  },
  {
    "name": "HIGH_INTENSITY_INTERVAL_TRAINING",
    "qualified": "ExerciseType.HIGH_INTENSITY_INTERVAL_TRAINING",
    "id": 36,
    "idEvidence": "@JvmField public val HIGH_INTENSITY_INTERVAL_TRAINING: ExerciseType = ExerciseType(36, \"HIGH_INTENSITY_INTERVAL_TRAINING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#HIGH_INTENSITY_INTERVAL_TRAINING()",
    "key": "highintensityintervaltraining",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "highIntensityIntervalTraining"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
      }
    ]
  },
  {
    "name": "HIKING",
    "qualified": "ExerciseType.HIKING",
    "id": 37,
    "idEvidence": "@JvmField public val HIKING: ExerciseType = ExerciseType(37, \"HIKING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#HIKING()",
    "key": "hiking",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "hiking"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HIKING"
      },
      {
        "platform": "google-health-api",
        "name": "HIKING"
      }
    ]
  },
  {
    "name": "HORSE_RIDING",
    "qualified": "ExerciseType.HORSE_RIDING",
    "id": 88,
    "idEvidence": "@JvmField public val HORSE_RIDING: ExerciseType = ExerciseType(88, \"HORSE_RIDING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#HORSE_RIDING()",
    "key": "horseriding",
    "counterparts": []
  },
  {
    "name": "ICE_HOCKEY",
    "qualified": "ExerciseType.ICE_HOCKEY",
    "id": 38,
    "idEvidence": "@JvmField public val ICE_HOCKEY: ExerciseType = ExerciseType(38, \"ICE_HOCKEY\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ICE_HOCKEY()",
    "key": "icehockey",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ICE_HOCKEY"
      }
    ]
  },
  {
    "name": "ICE_SKATING",
    "qualified": "ExerciseType.ICE_SKATING",
    "id": 39,
    "idEvidence": "@JvmField public val ICE_SKATING: ExerciseType = ExerciseType(39, \"ICE_SKATING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ICE_SKATING()",
    "key": "iceskating",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ICE_SKATING"
      },
      {
        "platform": "google-health-api",
        "name": "ICE_SKATING"
      }
    ]
  },
  {
    "name": "INLINE_SKATING",
    "qualified": "ExerciseType.INLINE_SKATING",
    "id": 87,
    "idEvidence": "@JvmField public val INLINE_SKATING: ExerciseType = ExerciseType(87, \"INLINE_SKATING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#INLINE_SKATING()",
    "key": "inlineskating",
    "counterparts": []
  },
  {
    "name": "JUMPING_JACK",
    "qualified": "ExerciseType.JUMPING_JACK",
    "id": 41,
    "idEvidence": "@JvmField public val JUMPING_JACK: ExerciseType = ExerciseType(41, \"JUMPING_JACK\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#JUMPING_JACK()",
    "key": "jumpingjack",
    "counterparts": []
  },
  {
    "name": "JUMP_ROPE",
    "qualified": "ExerciseType.JUMP_ROPE",
    "id": 40,
    "idEvidence": "@JvmField public val JUMP_ROPE: ExerciseType = ExerciseType(40, \"JUMP_ROPE\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#JUMP_ROPE()",
    "key": "jumprope",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "jumpRope"
      }
    ]
  },
  {
    "name": "LAT_PULL_DOWN",
    "qualified": "ExerciseType.LAT_PULL_DOWN",
    "id": 42,
    "idEvidence": "@JvmField public val LAT_PULL_DOWN: ExerciseType = ExerciseType(42, \"LAT_PULL_DOWN\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#LAT_PULL_DOWN()",
    "key": "latpulldown",
    "counterparts": []
  },
  {
    "name": "LUNGE",
    "qualified": "ExerciseType.LUNGE",
    "id": 43,
    "idEvidence": "@JvmField public val LUNGE: ExerciseType = ExerciseType(43, \"LUNGE\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#LUNGE()",
    "key": "lunge",
    "counterparts": []
  },
  {
    "name": "MARTIAL_ARTS",
    "qualified": "ExerciseType.MARTIAL_ARTS",
    "id": 44,
    "idEvidence": "@JvmField public val MARTIAL_ARTS: ExerciseType = ExerciseType(44, \"MARTIAL_ARTS\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#MARTIAL_ARTS()",
    "key": "martialarts",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "martialArts"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_MARTIAL_ARTS"
      },
      {
        "platform": "google-health-api",
        "name": "MARTIAL_ARTS"
      }
    ]
  },
  {
    "name": "MEDITATION",
    "qualified": "ExerciseType.MEDITATION",
    "id": 45,
    "idEvidence": "@JvmField public val MEDITATION: ExerciseType = ExerciseType(45, \"MEDITATION\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#MEDITATION()",
    "key": "meditation",
    "counterparts": []
  },
  {
    "name": "MOUNTAIN_BIKING",
    "qualified": "ExerciseType.MOUNTAIN_BIKING",
    "id": 85,
    "idEvidence": "@JvmField public val MOUNTAIN_BIKING: ExerciseType = ExerciseType(85, \"MOUNTAIN_BIKING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#MOUNTAIN_BIKING()",
    "key": "mountainbiking",
    "counterparts": []
  },
  {
    "name": "ORIENTEERING",
    "qualified": "ExerciseType.ORIENTEERING",
    "id": 86,
    "idEvidence": "@JvmField public val ORIENTEERING: ExerciseType = ExerciseType(86, \"ORIENTEERING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ORIENTEERING()",
    "key": "orienteering",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "ORIENTEERING"
      }
    ]
  },
  {
    "name": "PADDLING",
    "qualified": "ExerciseType.PADDLING",
    "id": 46,
    "idEvidence": "@JvmField public val PADDLING: ExerciseType = ExerciseType(46, \"PADDLING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#PADDLING()",
    "key": "paddling",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PADDLING"
      }
    ]
  },
  {
    "name": "PARA_GLIDING",
    "qualified": "ExerciseType.PARA_GLIDING",
    "id": 47,
    "idEvidence": "@JvmField public val PARA_GLIDING: ExerciseType = ExerciseType(47, \"PARA_GLIDING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#PARA_GLIDING()",
    "key": "paragliding",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PARAGLIDING"
      },
      {
        "platform": "google-health-api",
        "name": "PARAGLIDING"
      }
    ]
  },
  {
    "name": "PILATES",
    "qualified": "ExerciseType.PILATES",
    "id": 48,
    "idEvidence": "@JvmField public val PILATES: ExerciseType = ExerciseType(48, \"PILATES\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#PILATES()",
    "key": "pilates",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "pilates"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PILATES"
      },
      {
        "platform": "google-health-api",
        "name": "PILATES"
      }
    ]
  },
  {
    "name": "PLANK",
    "qualified": "ExerciseType.PLANK",
    "id": 49,
    "idEvidence": "@JvmField public val PLANK: ExerciseType = ExerciseType(49, \"PLANK\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#PLANK()",
    "key": "plank",
    "counterparts": []
  },
  {
    "name": "RACQUETBALL",
    "qualified": "ExerciseType.RACQUETBALL",
    "id": 50,
    "idEvidence": "@JvmField public val RACQUETBALL: ExerciseType = ExerciseType(50, \"RACQUETBALL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#RACQUETBALL()",
    "key": "racquetball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "racquetball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RACQUETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "RACQUETBALL"
      }
    ]
  },
  {
    "name": "ROCK_CLIMBING",
    "qualified": "ExerciseType.ROCK_CLIMBING",
    "id": 51,
    "idEvidence": "@JvmField public val ROCK_CLIMBING: ExerciseType = ExerciseType(51, \"ROCK_CLIMBING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ROCK_CLIMBING()",
    "key": "rockclimbing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROCK_CLIMBING"
      },
      {
        "platform": "google-health-api",
        "name": "ROCK_CLIMBING"
      }
    ]
  },
  {
    "name": "ROLLER_HOCKEY",
    "qualified": "ExerciseType.ROLLER_HOCKEY",
    "id": 52,
    "idEvidence": "@JvmField public val ROLLER_HOCKEY: ExerciseType = ExerciseType(52, \"ROLLER_HOCKEY\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ROLLER_HOCKEY()",
    "key": "rollerhockey",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROLLER_HOCKEY"
      }
    ]
  },
  {
    "name": "ROLLER_SKATING",
    "qualified": "ExerciseType.ROLLER_SKATING",
    "id": 89,
    "idEvidence": "@JvmField public val ROLLER_SKATING: ExerciseType = ExerciseType(89, \"ROLLER_SKATING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ROLLER_SKATING()",
    "key": "rollerskating",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "ROLLER_SKATING"
      }
    ]
  },
  {
    "name": "ROWING",
    "qualified": "ExerciseType.ROWING",
    "id": 53,
    "idEvidence": "@JvmField public val ROWING: ExerciseType = ExerciseType(53, \"ROWING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ROWING()",
    "key": "rowing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "rowing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROWING"
      },
      {
        "platform": "google-health-api",
        "name": "ROWING"
      }
    ]
  },
  {
    "name": "ROWING_MACHINE",
    "qualified": "ExerciseType.ROWING_MACHINE",
    "id": 54,
    "idEvidence": "@JvmField public val ROWING_MACHINE: ExerciseType = ExerciseType(54, \"ROWING_MACHINE\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#ROWING_MACHINE()",
    "key": "rowingmachine",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROWING_MACHINE"
      },
      {
        "platform": "google-health-api",
        "name": "ROWING_MACHINE"
      }
    ]
  },
  {
    "name": "RUGBY",
    "qualified": "ExerciseType.RUGBY",
    "id": 57,
    "idEvidence": "@JvmField public val RUGBY: ExerciseType = ExerciseType(57, \"RUGBY\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#RUGBY()",
    "key": "rugby",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "rugby"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUGBY"
      },
      {
        "platform": "google-health-api",
        "name": "RUGBY"
      }
    ]
  },
  {
    "name": "RUNNING",
    "qualified": "ExerciseType.RUNNING",
    "id": 55,
    "idEvidence": "@JvmField public val RUNNING: ExerciseType = ExerciseType(55, \"RUNNING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#RUNNING()",
    "key": "running",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "running"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUNNING"
      },
      {
        "platform": "google-health-api",
        "name": "RUNNING"
      }
    ]
  },
  {
    "name": "RUNNING_TREADMILL",
    "qualified": "ExerciseType.RUNNING_TREADMILL",
    "id": 56,
    "idEvidence": "@JvmField public val RUNNING_TREADMILL: ExerciseType = ExerciseType(56, \"RUNNING_TREADMILL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#RUNNING_TREADMILL()",
    "key": "runningtreadmill",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUNNING_TREADMILL"
      }
    ]
  },
  {
    "name": "SAILING",
    "qualified": "ExerciseType.SAILING",
    "id": 58,
    "idEvidence": "@JvmField public val SAILING: ExerciseType = ExerciseType(58, \"SAILING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SAILING()",
    "key": "sailing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "sailing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SAILING"
      },
      {
        "platform": "google-health-api",
        "name": "SAILING"
      }
    ]
  },
  {
    "name": "SCUBA_DIVING",
    "qualified": "ExerciseType.SCUBA_DIVING",
    "id": 59,
    "idEvidence": "@JvmField public val SCUBA_DIVING: ExerciseType = ExerciseType(59, \"SCUBA_DIVING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SCUBA_DIVING()",
    "key": "scubadiving",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SCUBA_DIVING"
      },
      {
        "platform": "google-health-api",
        "name": "SCUBA_DIVING"
      }
    ]
  },
  {
    "name": "SKATING",
    "qualified": "ExerciseType.SKATING",
    "id": 60,
    "idEvidence": "@JvmField public val SKATING: ExerciseType = ExerciseType(60, \"SKATING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SKATING()",
    "key": "skating",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SKATING"
      },
      {
        "platform": "google-health-api",
        "name": "SKATING"
      }
    ]
  },
  {
    "name": "SKIING",
    "qualified": "ExerciseType.SKIING",
    "id": 61,
    "idEvidence": "@JvmField public val SKIING: ExerciseType = ExerciseType(61, \"SKIING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SKIING()",
    "key": "skiing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SKIING"
      },
      {
        "platform": "google-health-api",
        "name": "SKIING"
      }
    ]
  },
  {
    "name": "SNOWBOARDING",
    "qualified": "ExerciseType.SNOWBOARDING",
    "id": 62,
    "idEvidence": "@JvmField public val SNOWBOARDING: ExerciseType = ExerciseType(62, \"SNOWBOARDING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SNOWBOARDING()",
    "key": "snowboarding",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "snowboarding"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SNOWBOARDING"
      },
      {
        "platform": "google-health-api",
        "name": "SNOWBOARDING"
      }
    ]
  },
  {
    "name": "SNOWSHOEING",
    "qualified": "ExerciseType.SNOWSHOEING",
    "id": 63,
    "idEvidence": "@JvmField public val SNOWSHOEING: ExerciseType = ExerciseType(63, \"SNOWSHOEING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SNOWSHOEING()",
    "key": "snowshoeing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SNOWSHOEING"
      },
      {
        "platform": "google-health-api",
        "name": "SNOWSHOEING"
      }
    ]
  },
  {
    "name": "SOCCER",
    "qualified": "ExerciseType.SOCCER",
    "id": 64,
    "idEvidence": "@JvmField public val SOCCER: ExerciseType = ExerciseType(64, \"SOCCER\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SOCCER()",
    "key": "soccer",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "soccer"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOCCER"
      },
      {
        "platform": "google-health-api",
        "name": "SOCCER"
      }
    ]
  },
  {
    "name": "SOFTBALL",
    "qualified": "ExerciseType.SOFTBALL",
    "id": 65,
    "idEvidence": "@JvmField public val SOFTBALL: ExerciseType = ExerciseType(65, \"SOFTBALL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SOFTBALL()",
    "key": "softball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "softball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOFTBALL"
      },
      {
        "platform": "google-health-api",
        "name": "SOFTBALL"
      }
    ]
  },
  {
    "name": "SQUASH",
    "qualified": "ExerciseType.SQUASH",
    "id": 66,
    "idEvidence": "@JvmField public val SQUASH: ExerciseType = ExerciseType(66, \"SQUASH\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SQUASH()",
    "key": "squash",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "squash"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SQUASH"
      },
      {
        "platform": "google-health-api",
        "name": "SQUASH"
      }
    ]
  },
  {
    "name": "SQUAT",
    "qualified": "ExerciseType.SQUAT",
    "id": 67,
    "idEvidence": "@JvmField public val SQUAT: ExerciseType = ExerciseType(67, \"SQUAT\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SQUAT()",
    "key": "squat",
    "counterparts": []
  },
  {
    "name": "STAIR_CLIMBING",
    "qualified": "ExerciseType.STAIR_CLIMBING",
    "id": 68,
    "idEvidence": "@JvmField public val STAIR_CLIMBING: ExerciseType = ExerciseType(68, \"STAIR_CLIMBING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#STAIR_CLIMBING()",
    "key": "stairclimbing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "stairClimbing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STAIR_CLIMBING"
      }
    ]
  },
  {
    "name": "STAIR_CLIMBING_MACHINE",
    "qualified": "ExerciseType.STAIR_CLIMBING_MACHINE",
    "id": 69,
    "idEvidence": "@JvmField public val STAIR_CLIMBING_MACHINE: ExerciseType = ExerciseType(69, \"STAIR_CLIMBING_MACHINE\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#STAIR_CLIMBING_MACHINE()",
    "key": "stairclimbingmachine",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE"
      }
    ]
  },
  {
    "name": "STRENGTH_TRAINING",
    "qualified": "ExerciseType.STRENGTH_TRAINING",
    "id": 70,
    "idEvidence": "@JvmField public val STRENGTH_TRAINING: ExerciseType = ExerciseType(70, \"STRENGTH_TRAINING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#STRENGTH_TRAINING()",
    "key": "strengthtraining",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STRENGTH_TRAINING"
      },
      {
        "platform": "google-health-api",
        "name": "STRENGTH_TRAINING"
      }
    ]
  },
  {
    "name": "STRETCHING",
    "qualified": "ExerciseType.STRETCHING",
    "id": 71,
    "idEvidence": "@JvmField public val STRETCHING: ExerciseType = ExerciseType(71, \"STRETCHING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#STRETCHING()",
    "key": "stretching",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STRETCHING"
      },
      {
        "platform": "google-health-api",
        "name": "STRETCHING"
      }
    ]
  },
  {
    "name": "SURFING",
    "qualified": "ExerciseType.SURFING",
    "id": 72,
    "idEvidence": "@JvmField public val SURFING: ExerciseType = ExerciseType(72, \"SURFING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SURFING()",
    "key": "surfing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SURFING"
      },
      {
        "platform": "google-health-api",
        "name": "SURFING"
      }
    ]
  },
  {
    "name": "SWIMMING_OPEN_WATER",
    "qualified": "ExerciseType.SWIMMING_OPEN_WATER",
    "id": 73,
    "idEvidence": "@JvmField public val SWIMMING_OPEN_WATER: ExerciseType = ExerciseType(73, \"SWIMMING_OPEN_WATER\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SWIMMING_OPEN_WATER()",
    "key": "swimmingopenwater",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SWIMMING_OPEN_WATER"
      },
      {
        "platform": "google-health-api",
        "name": "SWIMMING_OPEN_WATER"
      }
    ]
  },
  {
    "name": "SWIMMING_POOL",
    "qualified": "ExerciseType.SWIMMING_POOL",
    "id": 74,
    "idEvidence": "@JvmField public val SWIMMING_POOL: ExerciseType = ExerciseType(74, \"SWIMMING_POOL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#SWIMMING_POOL()",
    "key": "swimmingpool",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SWIMMING_POOL"
      },
      {
        "platform": "google-health-api",
        "name": "SWIMMING_POOL"
      }
    ]
  },
  {
    "name": "TABLE_TENNIS",
    "qualified": "ExerciseType.TABLE_TENNIS",
    "id": 75,
    "idEvidence": "@JvmField public val TABLE_TENNIS: ExerciseType = ExerciseType(75, \"TABLE_TENNIS\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#TABLE_TENNIS()",
    "key": "tabletennis",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "tableTennis"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TABLE_TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TABLE_TENNIS"
      }
    ]
  },
  {
    "name": "TENNIS",
    "qualified": "ExerciseType.TENNIS",
    "id": 76,
    "idEvidence": "@JvmField public val TENNIS: ExerciseType = ExerciseType(76, \"TENNIS\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#TENNIS()",
    "key": "tennis",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "tennis"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TENNIS"
      }
    ]
  },
  {
    "name": "UNKNOWN",
    "qualified": "ExerciseType.UNKNOWN",
    "id": 0,
    "idEvidence": "@JvmField public val UNKNOWN: ExerciseType = ExerciseType(0, \"UNKNOWN\")",
    "description": "The current exercise type of the user is unknown or not set.",
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#UNKNOWN()",
    "key": "unknown",
    "counterparts": []
  },
  {
    "name": "UPPER_TWIST",
    "qualified": "ExerciseType.UPPER_TWIST",
    "id": 77,
    "idEvidence": "@JvmField public val UPPER_TWIST: ExerciseType = ExerciseType(77, \"UPPER_TWIST\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#UPPER_TWIST()",
    "key": "uppertwist",
    "counterparts": []
  },
  {
    "name": "VOLLEYBALL",
    "qualified": "ExerciseType.VOLLEYBALL",
    "id": 78,
    "idEvidence": "@JvmField public val VOLLEYBALL: ExerciseType = ExerciseType(78, \"VOLLEYBALL\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#VOLLEYBALL()",
    "key": "volleyball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "volleyball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_VOLLEYBALL"
      },
      {
        "platform": "google-health-api",
        "name": "VOLLEYBALL"
      }
    ]
  },
  {
    "name": "WALKING",
    "qualified": "ExerciseType.WALKING",
    "id": 79,
    "idEvidence": "@JvmField public val WALKING: ExerciseType = ExerciseType(79, \"WALKING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#WALKING()",
    "key": "walking",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "walking"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WALKING"
      },
      {
        "platform": "google-health-api",
        "name": "WALKING"
      }
    ]
  },
  {
    "name": "WATER_POLO",
    "qualified": "ExerciseType.WATER_POLO",
    "id": 80,
    "idEvidence": "@JvmField public val WATER_POLO: ExerciseType = ExerciseType(80, \"WATER_POLO\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#WATER_POLO()",
    "key": "waterpolo",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "waterPolo"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WATER_POLO"
      },
      {
        "platform": "google-health-api",
        "name": "WATER_POLO"
      }
    ]
  },
  {
    "name": "WEIGHTLIFTING",
    "qualified": "ExerciseType.WEIGHTLIFTING",
    "id": 81,
    "idEvidence": "@JvmField public val WEIGHTLIFTING: ExerciseType = ExerciseType(81, \"WEIGHTLIFTING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#WEIGHTLIFTING()",
    "key": "weightlifting",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WEIGHTLIFTING"
      },
      {
        "platform": "google-health-api",
        "name": "WEIGHTLIFTING"
      }
    ]
  },
  {
    "name": "WORKOUT",
    "qualified": "ExerciseType.WORKOUT",
    "id": 82,
    "idEvidence": "@JvmField public val WORKOUT: ExerciseType = ExerciseType(82, \"WORKOUT\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#WORKOUT()",
    "key": "workout",
    "counterparts": [
      {
        "platform": "google-health-api",
        "name": "WORKOUT"
      }
    ]
  },
  {
    "name": "YACHTING",
    "qualified": "ExerciseType.YACHTING",
    "id": 90,
    "idEvidence": "@JvmField public val YACHTING: ExerciseType = ExerciseType(90, \"YACHTING\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#YACHTING()",
    "key": "yachting",
    "counterparts": []
  },
  {
    "name": "YOGA",
    "qualified": "ExerciseType.YOGA",
    "id": 83,
    "idEvidence": "@JvmField public val YOGA: ExerciseType = ExerciseType(83, \"YOGA\")",
    "description": null,
    "deprecated": false,
    "docUrl": "https://developer.android.com/reference/androidx/health/services/client/data/ExerciseType#YOGA()",
    "key": "yoga",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "yoga"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_YOGA"
      },
      {
        "platform": "google-health-api",
        "name": "YOGA"
      }
    ]
  }
];

/** ExerciseType constants the source declares internal: not on the reference, not usable from an app. */
export const WT_WEAR_OS_INTERNAL: { name: string; id: number; evidence: string }[] = [
  {
    "name": "BENCH_SIT_UP",
    "id": 7,
    "evidence": "@JvmField internal val BENCH_SIT_UP: ExerciseType = ExerciseType(7, \"BENCH_SIT_UP\")"
  },
  {
    "name": "DUMBBELL_CURL_RIGHT_ARM",
    "id": 18,
    "evidence": "@JvmField internal val DUMBBELL_CURL_RIGHT_ARM: ExerciseType = ExerciseType(18, \"DUMBBELL_CURL_RIGHT_ARM\")"
  },
  {
    "name": "DUMBBELL_CURL_LEFT_ARM",
    "id": 19,
    "evidence": "@JvmField internal val DUMBBELL_CURL_LEFT_ARM: ExerciseType = ExerciseType(19, \"DUMBBELL_CURL_LEFT_ARM\")"
  },
  {
    "name": "DUMBBELL_FRONT_RAISE",
    "id": 20,
    "evidence": "@JvmField internal val DUMBBELL_FRONT_RAISE: ExerciseType = ExerciseType(20, \"DUMBBELL_FRONT_RAISE\")"
  },
  {
    "name": "DUMBBELL_LATERAL_RAISE",
    "id": 21,
    "evidence": "@JvmField internal val DUMBBELL_LATERAL_RAISE: ExerciseType = ExerciseType(21, \"DUMBBELL_LATERAL_RAISE\")"
  },
  {
    "name": "DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
    "id": 22,
    "evidence": "@JvmField internal val DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM: ExerciseType = ExerciseType(22, \"DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM\")"
  },
  {
    "name": "DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
    "id": 23,
    "evidence": "@JvmField internal val DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM: ExerciseType = ExerciseType(23, \"DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM\")"
  },
  {
    "name": "DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
    "id": 24,
    "evidence": "@JvmField internal val DUMBBELL_TRICEPS_EXTENSION_TWO_ARM: ExerciseType = ExerciseType(24, \"DUMBBELL_TRICEPS_EXTENSION_TWO_ARM\")"
  }
];

/** The "Next ID" comment in ExerciseType.kt. */
export const WT_WEAR_OS_NEXT_ID = "93";

export type WtGoogleHealthApiType = {
  value: string;
  /** Google's description from the discovery document, verbatim. */
  description: string | null;
  key: string;
  counterparts: WtCounterpart[];
};

export const WT_GOOGLE_HEALTH_API: WtGoogleHealthApiType[] = [
  {
    "value": "EXERCISE_TYPE_UNSPECIFIED",
    "description": "Exercise type is unspecified.",
    "key": "unspecified",
    "counterparts": []
  },
  {
    "value": "AEROBIC_WORKOUT",
    "description": "Aerobic workout type.",
    "key": "aerobicworkout",
    "counterparts": []
  },
  {
    "value": "ARCHERY",
    "description": "Archery type.",
    "key": "archery",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "archery"
      }
    ]
  },
  {
    "value": "ASSAULT_BIKE",
    "description": "Assault bike type.",
    "key": "assaultbike",
    "counterparts": []
  },
  {
    "value": "BACKPACKING",
    "description": "Backpacking type.",
    "key": "backpacking",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "BACKPACKING"
      }
    ]
  },
  {
    "value": "BADMINTON",
    "description": "Badminton type.",
    "key": "badminton",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "badminton"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BADMINTON"
      },
      {
        "platform": "wear-os",
        "name": "BADMINTON"
      }
    ]
  },
  {
    "value": "BALLET",
    "description": "Ballet type.",
    "key": "ballet",
    "counterparts": []
  },
  {
    "value": "BALLROOM_DANCE",
    "description": "Ballroom dance type.",
    "key": "ballroomdance",
    "counterparts": []
  },
  {
    "value": "BARRE_CLASS",
    "description": "Barre class type.",
    "key": "barreclass",
    "counterparts": []
  },
  {
    "value": "BASEBALL",
    "description": "Baseball type.",
    "key": "baseball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "baseball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASEBALL"
      },
      {
        "platform": "wear-os",
        "name": "BASEBALL"
      }
    ]
  },
  {
    "value": "BASKETBALL",
    "description": "Basketball type.",
    "key": "basketball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "basketball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASKETBALL"
      },
      {
        "platform": "wear-os",
        "name": "BASKETBALL"
      }
    ]
  },
  {
    "value": "BIKING",
    "description": "Biking type.",
    "key": "biking",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BIKING"
      },
      {
        "platform": "wear-os",
        "name": "BIKING"
      }
    ]
  },
  {
    "value": "BILLIARDS",
    "description": "Billiards type.",
    "key": "billiards",
    "counterparts": []
  },
  {
    "value": "BODY_WEIGHT",
    "description": "Body weight type.",
    "key": "bodyweight",
    "counterparts": []
  },
  {
    "value": "BOOTCAMP",
    "description": "Bootcamp type.",
    "key": "bootcamp",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BOOT_CAMP"
      },
      {
        "platform": "wear-os",
        "name": "BOOT_CAMP"
      }
    ]
  },
  {
    "value": "BOWLING",
    "description": "Bowling type.",
    "key": "bowling",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "bowling"
      }
    ]
  },
  {
    "value": "BOXING",
    "description": "Boxing type.",
    "key": "boxing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "boxing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BOXING"
      },
      {
        "platform": "wear-os",
        "name": "BOXING"
      }
    ]
  },
  {
    "value": "BREAKDANCING",
    "description": "Breakdancing type.",
    "key": "breakdancing",
    "counterparts": []
  },
  {
    "value": "CALISTHENICS",
    "description": "Calisthenics type.",
    "key": "calisthenics",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_CALISTHENICS"
      },
      {
        "platform": "wear-os",
        "name": "CALISTHENICS"
      }
    ]
  },
  {
    "value": "CANOEING",
    "description": "Canoeing type.",
    "key": "canoeing",
    "counterparts": []
  },
  {
    "value": "CARDIO_SCULPT",
    "description": "Cardio sculpt type.",
    "key": "cardiosculpt",
    "counterparts": []
  },
  {
    "value": "CARDIO_WORKOUT",
    "description": "Cardio workout type.",
    "key": "cardioworkout",
    "counterparts": []
  },
  {
    "value": "CARPENTRY",
    "description": "Carpentry type.",
    "key": "carpentry",
    "counterparts": []
  },
  {
    "value": "CHEERLEADING",
    "description": "Cheerleading type.",
    "key": "cheerleading",
    "counterparts": []
  },
  {
    "value": "CIRCUIT_TRAINING",
    "description": "Circuit training type.",
    "key": "circuittraining",
    "counterparts": []
  },
  {
    "value": "CLEANING",
    "description": "Cleaning type.",
    "key": "cleaning",
    "counterparts": []
  },
  {
    "value": "CLIMBING",
    "description": "Climbing type.",
    "key": "climbing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "climbing"
      }
    ]
  },
  {
    "value": "CORE_TRAINING",
    "description": "Core training type.",
    "key": "coretraining",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "coreTraining"
      }
    ]
  },
  {
    "value": "CRICKET",
    "description": "Cricket type.",
    "key": "cricket",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "cricket"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_CRICKET"
      },
      {
        "platform": "wear-os",
        "name": "CRICKET"
      }
    ]
  },
  {
    "value": "CROQUET",
    "description": "Croquet type.",
    "key": "croquet",
    "counterparts": []
  },
  {
    "value": "CROSS_COUNTRY_SKI",
    "description": "Cross country ski type.",
    "key": "crosscountryski",
    "counterparts": []
  },
  {
    "value": "CROSS_TRAINING",
    "description": "Cross training type.",
    "key": "crosstraining",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "crossTraining"
      }
    ]
  },
  {
    "value": "CROSSFIT",
    "description": "Crossfit type.",
    "key": "crossfit",
    "counterparts": []
  },
  {
    "value": "CURLING",
    "description": "Curling type.",
    "key": "curling",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "curling"
      }
    ]
  },
  {
    "value": "DANCING",
    "description": "Dancing type.",
    "key": "dancing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_DANCING"
      },
      {
        "platform": "wear-os",
        "name": "DANCING"
      }
    ]
  },
  {
    "value": "DIVING",
    "description": "Diving type.",
    "key": "diving",
    "counterparts": []
  },
  {
    "value": "ELECTRIC_BIKE",
    "description": "Electric bike type.",
    "key": "electricbike",
    "counterparts": []
  },
  {
    "value": "ELECTRIC_SCOOTER",
    "description": "Electric scooter type.",
    "key": "electricscooter",
    "counterparts": []
  },
  {
    "value": "ELLIPTICAL",
    "description": "Elliptical type.",
    "key": "elliptical",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "elliptical"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ELLIPTICAL"
      },
      {
        "platform": "wear-os",
        "name": "ELLIPTICAL"
      }
    ]
  },
  {
    "value": "EQUESTRIAN_SPORTS",
    "description": "Equestrian sports type.",
    "key": "equestriansports",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "equestrianSports"
      }
    ]
  },
  {
    "value": "EXERCISE_CLASS",
    "description": "Exercise class type.",
    "key": "exerciseclass",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_EXERCISE_CLASS"
      },
      {
        "platform": "wear-os",
        "name": "EXERCISE_CLASS"
      }
    ]
  },
  {
    "value": "FENCING",
    "description": "Fencing type.",
    "key": "fencing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "fencing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FENCING"
      },
      {
        "platform": "wear-os",
        "name": "FENCING"
      }
    ]
  },
  {
    "value": "FIELD_HOCKEY",
    "description": "Field hockey type.",
    "key": "fieldhockey",
    "counterparts": []
  },
  {
    "value": "FISHING",
    "description": "Fishing type.",
    "key": "fishing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "fishing"
      }
    ]
  },
  {
    "value": "FITNESS_GAMING",
    "description": "Fitness gaming type.",
    "key": "fitnessgaming",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "fitnessGaming"
      }
    ]
  },
  {
    "value": "FOILING",
    "description": "Foiling type.",
    "key": "foiling",
    "counterparts": []
  },
  {
    "value": "FOOTBALL_AMERICAN",
    "description": "Football american type.",
    "key": "footballamerican",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FOOTBALL_AMERICAN"
      },
      {
        "platform": "wear-os",
        "name": "FOOTBALL_AMERICAN"
      }
    ]
  },
  {
    "value": "FOOTBALL_AUSTRALIAN",
    "description": "Football australian type.",
    "key": "footballaustralian",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN"
      },
      {
        "platform": "wear-os",
        "name": "FOOTBALL_AUSTRALIAN"
      }
    ]
  },
  {
    "value": "FREE_WEIGHTS",
    "description": "Free weights type.",
    "key": "freeweights",
    "counterparts": []
  },
  {
    "value": "FRISBEE_PLAYING_GENERAL",
    "description": "Frisbee playing general type.",
    "key": "frisbeeplayinggeneral",
    "counterparts": []
  },
  {
    "value": "FUNCTIONAL_STRENGTH_TRAINING",
    "description": "Functional strength training type.",
    "key": "functionalstrengthtraining",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "functionalStrengthTraining"
      }
    ]
  },
  {
    "value": "GARDENING",
    "description": "Gardening type.",
    "key": "gardening",
    "counterparts": []
  },
  {
    "value": "GOLF",
    "description": "Golf type.",
    "key": "golf",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "golf"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GOLF"
      },
      {
        "platform": "wear-os",
        "name": "GOLF"
      }
    ]
  },
  {
    "value": "GYMNASTICS",
    "description": "Gymnastics type.",
    "key": "gymnastics",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "gymnastics"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GYMNASTICS"
      },
      {
        "platform": "wear-os",
        "name": "GYMNASTICS"
      }
    ]
  },
  {
    "value": "HANDBALL",
    "description": "Handball type.",
    "key": "handball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "handball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HANDBALL"
      },
      {
        "platform": "wear-os",
        "name": "HANDBALL"
      }
    ]
  },
  {
    "value": "HAND_CYCLING",
    "description": "Hand cycling type.",
    "key": "handcycling",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "handCycling"
      }
    ]
  },
  {
    "value": "HIIT",
    "description": "Hiit type.",
    "key": "hiit",
    "counterparts": []
  },
  {
    "value": "HIKING",
    "description": "Hiking type.",
    "key": "hiking",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "hiking"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HIKING"
      },
      {
        "platform": "wear-os",
        "name": "HIKING"
      }
    ]
  },
  {
    "value": "HIP_HOP",
    "description": "Hip hop type.",
    "key": "hiphop",
    "counterparts": []
  },
  {
    "value": "HOCKEY",
    "description": "Hockey type.",
    "key": "hockey",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "hockey"
      }
    ]
  },
  {
    "value": "HOEING",
    "description": "Hoeing type.",
    "key": "hoeing",
    "counterparts": []
  },
  {
    "value": "HOUSEHOLD_CHORES",
    "description": "Household chores type.",
    "key": "householdchores",
    "counterparts": []
  },
  {
    "value": "HUNTING",
    "description": "Hunting type.",
    "key": "hunting",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "hunting"
      }
    ]
  },
  {
    "value": "ICE_SKATING",
    "description": "Ice skating type.",
    "key": "iceskating",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ICE_SKATING"
      },
      {
        "platform": "wear-os",
        "name": "ICE_SKATING"
      }
    ]
  },
  {
    "value": "INCLINE_RUN",
    "description": "Incline run type.",
    "key": "inclinerun",
    "counterparts": []
  },
  {
    "value": "INCLINE_WALK",
    "description": "Incline walk type.",
    "key": "inclinewalk",
    "counterparts": []
  },
  {
    "value": "INDOOR_CLIMBING",
    "description": "Indoor climbing type.",
    "key": "indoorclimbing",
    "counterparts": []
  },
  {
    "value": "INTERVAL_WORKOUT",
    "description": "Interval workout type.",
    "key": "intervalworkout",
    "counterparts": []
  },
  {
    "value": "JAZZ_DANCE",
    "description": "Jazz dance type.",
    "key": "jazzdance",
    "counterparts": []
  },
  {
    "value": "JIU_JITSU",
    "description": "Jiu jitsu type.",
    "key": "jiujitsu",
    "counterparts": []
  },
  {
    "value": "JUMPING_ROPE",
    "description": "Jumping rope type.",
    "key": "jumpingrope",
    "counterparts": []
  },
  {
    "value": "KARATE",
    "description": "Karate type.",
    "key": "karate",
    "counterparts": []
  },
  {
    "value": "KAYAKING",
    "description": "Kayaking type.",
    "key": "kayaking",
    "counterparts": []
  },
  {
    "value": "KICKBOXING",
    "description": "Kickboxing type.",
    "key": "kickboxing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "kickboxing"
      }
    ]
  },
  {
    "value": "KITESURFING",
    "description": "Kitesurfing type.",
    "key": "kitesurfing",
    "counterparts": []
  },
  {
    "value": "LACROSSE",
    "description": "Lacrosse type.",
    "key": "lacrosse",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "lacrosse"
      }
    ]
  },
  {
    "value": "MARTIAL_ARTS",
    "description": "Martial arts type.",
    "key": "martialarts",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "martialArts"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_MARTIAL_ARTS"
      },
      {
        "platform": "wear-os",
        "name": "MARTIAL_ARTS"
      }
    ]
  },
  {
    "value": "MEDITATE",
    "description": "Meditate type.",
    "key": "meditate",
    "counterparts": []
  },
  {
    "value": "MODERN_DANCE",
    "description": "Modern dance type.",
    "key": "moderndance",
    "counterparts": []
  },
  {
    "value": "MOTOCROSS",
    "description": "Motocross type.",
    "key": "motocross",
    "counterparts": []
  },
  {
    "value": "MOTORCYCLE",
    "description": "Motorcycle type.",
    "key": "motorcycle",
    "counterparts": []
  },
  {
    "value": "MOUNTAIN_BIKE",
    "description": "Mountain bike type.",
    "key": "mountainbike",
    "counterparts": []
  },
  {
    "value": "MOWING_LAWN",
    "description": "Mowing lawn type.",
    "key": "mowinglawn",
    "counterparts": []
  },
  {
    "value": "MUAY_THAI",
    "description": "Muay thai type.",
    "key": "muaythai",
    "counterparts": []
  },
  {
    "value": "MULTISPORT",
    "description": "Multisport type.",
    "key": "multisport",
    "counterparts": []
  },
  {
    "value": "MUSICAL_PERFORMANCE",
    "description": "Musical performance type.",
    "key": "musicalperformance",
    "counterparts": []
  },
  {
    "value": "NORDIC_WALKING",
    "description": "Nordic walking type.",
    "key": "nordicwalking",
    "counterparts": []
  },
  {
    "value": "ORIENTEERING",
    "description": "Orienteering type.",
    "key": "orienteering",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "ORIENTEERING"
      }
    ]
  },
  {
    "value": "OTHER",
    "description": "Other type.",
    "key": "other",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "other"
      }
    ]
  },
  {
    "value": "OUTDOOR_BIKE",
    "description": "Outdoor bike type.",
    "key": "outdoorbike",
    "counterparts": []
  },
  {
    "value": "OUTDOOR_WORKOUT",
    "description": "Outdoor workout type.",
    "key": "outdoorworkout",
    "counterparts": []
  },
  {
    "value": "PADDLEBOARDING",
    "description": "Paddleboarding type.",
    "key": "paddleboarding",
    "counterparts": []
  },
  {
    "value": "PADEL",
    "description": "Padel type.",
    "key": "padel",
    "counterparts": []
  },
  {
    "value": "PAINTING",
    "description": "Painting type.",
    "key": "painting",
    "counterparts": []
  },
  {
    "value": "PARAGLIDING",
    "description": "Paragliding type.",
    "key": "paragliding",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PARAGLIDING"
      },
      {
        "platform": "wear-os",
        "name": "PARA_GLIDING"
      }
    ]
  },
  {
    "value": "PARKOUR",
    "description": "Parkour type.",
    "key": "parkour",
    "counterparts": []
  },
  {
    "value": "PICKELBALL",
    "description": "Pickelball type.",
    "key": "pickelball",
    "counterparts": []
  },
  {
    "value": "PILATES",
    "description": "Pilates type.",
    "key": "pilates",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "pilates"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PILATES"
      },
      {
        "platform": "wear-os",
        "name": "PILATES"
      }
    ]
  },
  {
    "value": "POLO",
    "description": "Polo type.",
    "key": "polo",
    "counterparts": []
  },
  {
    "value": "POWERLIFTING",
    "description": "Powerlifting type.",
    "key": "powerlifting",
    "counterparts": []
  },
  {
    "value": "POWER_WALKING",
    "description": "Power walking type.",
    "key": "powerwalking",
    "counterparts": []
  },
  {
    "value": "RACKET_SPORTS",
    "description": "Racket sports type.",
    "key": "racketsports",
    "counterparts": []
  },
  {
    "value": "RACQUETBALL",
    "description": "Racquetball type.",
    "key": "racquetball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "racquetball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RACQUETBALL"
      },
      {
        "platform": "wear-os",
        "name": "RACQUETBALL"
      }
    ]
  },
  {
    "value": "RESISTANCE_BANDS",
    "description": "Resistance bands type.",
    "key": "resistancebands",
    "counterparts": []
  },
  {
    "value": "ROCK_CLIMBING",
    "description": "Rock climbing type.",
    "key": "rockclimbing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROCK_CLIMBING"
      },
      {
        "platform": "wear-os",
        "name": "ROCK_CLIMBING"
      }
    ]
  },
  {
    "value": "ROLLERBLADING",
    "description": "Rollerblading type.",
    "key": "rollerblading",
    "counterparts": []
  },
  {
    "value": "ROLLER_SKATING",
    "description": "Roller skating type.",
    "key": "rollerskating",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "ROLLER_SKATING"
      }
    ]
  },
  {
    "value": "ROWING",
    "description": "Rowing type.",
    "key": "rowing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "rowing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROWING"
      },
      {
        "platform": "wear-os",
        "name": "ROWING"
      }
    ]
  },
  {
    "value": "ROWING_MACHINE",
    "description": "Rowing machine type.",
    "key": "rowingmachine",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROWING_MACHINE"
      },
      {
        "platform": "wear-os",
        "name": "ROWING_MACHINE"
      }
    ]
  },
  {
    "value": "RUCKING",
    "description": "Rucking type.",
    "key": "rucking",
    "counterparts": []
  },
  {
    "value": "RUGBY",
    "description": "Rugby type.",
    "key": "rugby",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "rugby"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUGBY"
      },
      {
        "platform": "wear-os",
        "name": "RUGBY"
      }
    ]
  },
  {
    "value": "RUNNING",
    "description": "Running type.",
    "key": "running",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "running"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUNNING"
      },
      {
        "platform": "wear-os",
        "name": "RUNNING"
      }
    ]
  },
  {
    "value": "SAILING",
    "description": "Sailing type.",
    "key": "sailing",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "sailing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SAILING"
      },
      {
        "platform": "wear-os",
        "name": "SAILING"
      }
    ]
  },
  {
    "value": "SCOOTERING",
    "description": "Scootering type.",
    "key": "scootering",
    "counterparts": []
  },
  {
    "value": "SCUBA_DIVING",
    "description": "Scuba diving type.",
    "key": "scubadiving",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SCUBA_DIVING"
      },
      {
        "platform": "wear-os",
        "name": "SCUBA_DIVING"
      }
    ]
  },
  {
    "value": "SHOOTING",
    "description": "Shooting type.",
    "key": "shooting",
    "counterparts": []
  },
  {
    "value": "SHOVELING",
    "description": "Shoveling type.",
    "key": "shoveling",
    "counterparts": []
  },
  {
    "value": "SKATEBOARDING",
    "description": "Skateboarding type.",
    "key": "skateboarding",
    "counterparts": []
  },
  {
    "value": "SKATING",
    "description": "Skating type.",
    "key": "skating",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SKATING"
      },
      {
        "platform": "wear-os",
        "name": "SKATING"
      }
    ]
  },
  {
    "value": "SKIING",
    "description": "Skiing type.",
    "key": "skiing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SKIING"
      },
      {
        "platform": "wear-os",
        "name": "SKIING"
      }
    ]
  },
  {
    "value": "SKYDIVING",
    "description": "Skydiving type.",
    "key": "skydiving",
    "counterparts": []
  },
  {
    "value": "SNORKELING",
    "description": "Snorkeling type.",
    "key": "snorkeling",
    "counterparts": []
  },
  {
    "value": "SNOWBOARDING",
    "description": "Snowboarding type.",
    "key": "snowboarding",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "snowboarding"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SNOWBOARDING"
      },
      {
        "platform": "wear-os",
        "name": "SNOWBOARDING"
      }
    ]
  },
  {
    "value": "SNOWMOBILING",
    "description": "Snowmobiling type.",
    "key": "snowmobiling",
    "counterparts": []
  },
  {
    "value": "SNOWSHOEING",
    "description": "Snowshoeing type.",
    "key": "snowshoeing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SNOWSHOEING"
      },
      {
        "platform": "wear-os",
        "name": "SNOWSHOEING"
      }
    ]
  },
  {
    "value": "SNOW_SPORT",
    "description": "Snow sport type.",
    "key": "snowsport",
    "counterparts": []
  },
  {
    "value": "SOCCER",
    "description": "Soccer type.",
    "key": "soccer",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "soccer"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOCCER"
      },
      {
        "platform": "wear-os",
        "name": "SOCCER"
      }
    ]
  },
  {
    "value": "SOFTBALL",
    "description": "Softball type.",
    "key": "softball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "softball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOFTBALL"
      },
      {
        "platform": "wear-os",
        "name": "SOFTBALL"
      }
    ]
  },
  {
    "value": "SPEED_SKATING",
    "description": "Speed skating type.",
    "key": "speedskating",
    "counterparts": []
  },
  {
    "value": "SPINNING",
    "description": "Spinning type.",
    "key": "spinning",
    "counterparts": []
  },
  {
    "value": "SPORT",
    "description": "Sport type.",
    "key": "sport",
    "counterparts": []
  },
  {
    "value": "SQUASH",
    "description": "Squash type.",
    "key": "squash",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "squash"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SQUASH"
      },
      {
        "platform": "wear-os",
        "name": "SQUASH"
      }
    ]
  },
  {
    "value": "STAIRCLIMBER",
    "description": "Stairclimber type.",
    "key": "stairclimber",
    "counterparts": []
  },
  {
    "value": "STATIONARY_BIKE",
    "description": "Stationary bike type.",
    "key": "stationarybike",
    "counterparts": []
  },
  {
    "value": "STEP_TRAINING",
    "description": "Step training type.",
    "key": "steptraining",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "stepTraining"
      }
    ]
  },
  {
    "value": "STRENGTH_TRAINING",
    "description": "Strength training type.",
    "key": "strengthtraining",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STRENGTH_TRAINING"
      },
      {
        "platform": "wear-os",
        "name": "STRENGTH_TRAINING"
      }
    ]
  },
  {
    "value": "STRETCHING",
    "description": "Stretching type.",
    "key": "stretching",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STRETCHING"
      },
      {
        "platform": "wear-os",
        "name": "STRETCHING"
      }
    ]
  },
  {
    "value": "STROLLER_WALK",
    "description": "Stroller walk type.",
    "key": "strollerwalk",
    "counterparts": []
  },
  {
    "value": "SURFING",
    "description": "Surfing type.",
    "key": "surfing",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SURFING"
      },
      {
        "platform": "wear-os",
        "name": "SURFING"
      }
    ]
  },
  {
    "value": "SWIMMING",
    "description": "Swimming type.",
    "key": "swimming",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "swimming"
      }
    ]
  },
  {
    "value": "SWIMMING_OPEN_WATER",
    "description": "Swimming open water type.",
    "key": "swimmingopenwater",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SWIMMING_OPEN_WATER"
      },
      {
        "platform": "wear-os",
        "name": "SWIMMING_OPEN_WATER"
      }
    ]
  },
  {
    "value": "SWIMMING_POOL",
    "description": "Swimming pool type.",
    "key": "swimmingpool",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SWIMMING_POOL"
      },
      {
        "platform": "wear-os",
        "name": "SWIMMING_POOL"
      }
    ]
  },
  {
    "value": "SYNCHRONIZED_SWIMMING",
    "description": "Synchronized swimming type.",
    "key": "synchronizedswimming",
    "counterparts": []
  },
  {
    "value": "TABATA_WORKOUT",
    "description": "Tabata workout type.",
    "key": "tabataworkout",
    "counterparts": []
  },
  {
    "value": "TABLE_TENNIS",
    "description": "Table tennis type.",
    "key": "tabletennis",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "tableTennis"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TABLE_TENNIS"
      },
      {
        "platform": "wear-os",
        "name": "TABLE_TENNIS"
      }
    ]
  },
  {
    "value": "TAEKWONDO",
    "description": "Taekwondo type.",
    "key": "taekwondo",
    "counterparts": []
  },
  {
    "value": "TAI_CHI",
    "description": "Tai chi type.",
    "key": "taichi",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "taiChi"
      }
    ]
  },
  {
    "value": "TANGO",
    "description": "Tango type.",
    "key": "tango",
    "counterparts": []
  },
  {
    "value": "TENNIS",
    "description": "Tennis type.",
    "key": "tennis",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "tennis"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TENNIS"
      },
      {
        "platform": "wear-os",
        "name": "TENNIS"
      }
    ]
  },
  {
    "value": "TRACK_AND_FIELD",
    "description": "Track and field type.",
    "key": "trackandfield",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "trackAndField"
      }
    ]
  },
  {
    "value": "TRAIL_RUN",
    "description": "Trail run type.",
    "key": "trailrun",
    "counterparts": []
  },
  {
    "value": "TRAMPOLINE",
    "description": "Trampoline type.",
    "key": "trampoline",
    "counterparts": []
  },
  {
    "value": "TREADMILL",
    "description": "Treadmill type.",
    "key": "treadmill",
    "counterparts": []
  },
  {
    "value": "TREADMILL_WALK",
    "description": "Treadmill walk type.",
    "key": "treadmillwalk",
    "counterparts": []
  },
  {
    "value": "TRX",
    "description": "Trx type.",
    "key": "trx",
    "counterparts": []
  },
  {
    "value": "ULTIMATE_FRISBEE",
    "description": "Ultimate frisbee type.",
    "key": "ultimatefrisbee",
    "counterparts": []
  },
  {
    "value": "UNICYCLING",
    "description": "Unicycling type.",
    "key": "unicycling",
    "counterparts": []
  },
  {
    "value": "VOLLEYBALL",
    "description": "Volleyball type.",
    "key": "volleyball",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "volleyball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_VOLLEYBALL"
      },
      {
        "platform": "wear-os",
        "name": "VOLLEYBALL"
      }
    ]
  },
  {
    "value": "VOLLEYBALL_BEACH",
    "description": "Volleyball beach type.",
    "key": "volleyballbeach",
    "counterparts": []
  },
  {
    "value": "WAKEBOARDING",
    "description": "Wakeboarding type.",
    "key": "wakeboarding",
    "counterparts": []
  },
  {
    "value": "WALKING",
    "description": "Walking type.",
    "key": "walking",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "walking"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WALKING"
      },
      {
        "platform": "wear-os",
        "name": "WALKING"
      }
    ]
  },
  {
    "value": "WALK_WITH_WEIGHTS",
    "description": "Walk with weights type.",
    "key": "walkwithweights",
    "counterparts": []
  },
  {
    "value": "WATER_AEROBICS",
    "description": "Water aerobics type.",
    "key": "wateraerobics",
    "counterparts": []
  },
  {
    "value": "WATER_JOGGING",
    "description": "Water jogging type.",
    "key": "waterjogging",
    "counterparts": []
  },
  {
    "value": "WATER_POLO",
    "description": "Water polo type.",
    "key": "waterpolo",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "waterPolo"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WATER_POLO"
      },
      {
        "platform": "wear-os",
        "name": "WATER_POLO"
      }
    ]
  },
  {
    "value": "WATER_SKIING",
    "description": "Water skiing type.",
    "key": "waterskiing",
    "counterparts": []
  },
  {
    "value": "WATER_SPORT",
    "description": "Water sport type.",
    "key": "watersport",
    "counterparts": []
  },
  {
    "value": "WATER_VOLLEYBALL",
    "description": "Water volleyball type.",
    "key": "watervolleyball",
    "counterparts": []
  },
  {
    "value": "WEEDING",
    "description": "Weeding type.",
    "key": "weeding",
    "counterparts": []
  },
  {
    "value": "WEIGHTLIFTING",
    "description": "Weightlifting type.",
    "key": "weightlifting",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WEIGHTLIFTING"
      },
      {
        "platform": "wear-os",
        "name": "WEIGHTLIFTING"
      }
    ]
  },
  {
    "value": "WEIGHT_MACHINES",
    "description": "Weight machines type.",
    "key": "weightmachines",
    "counterparts": []
  },
  {
    "value": "WEIGHTS",
    "description": "Weights type.",
    "key": "weights",
    "counterparts": []
  },
  {
    "value": "WHEELCHAIR",
    "description": "Wheelchair type.",
    "key": "wheelchair",
    "counterparts": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WHEELCHAIR"
      }
    ]
  },
  {
    "value": "WINDSURFING",
    "description": "Windsurfing type.",
    "key": "windsurfing",
    "counterparts": []
  },
  {
    "value": "WORKOUT",
    "description": "Workout type.",
    "key": "workout",
    "counterparts": [
      {
        "platform": "wear-os",
        "name": "WORKOUT"
      }
    ]
  },
  {
    "value": "WRESTLING",
    "description": "Wrestling type.",
    "key": "wrestling",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "wrestling"
      }
    ]
  },
  {
    "value": "YOGA",
    "description": "Yoga type.",
    "key": "yoga",
    "counterparts": [
      {
        "platform": "healthkit",
        "name": "yoga"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_YOGA"
      },
      {
        "platform": "wear-os",
        "name": "YOGA"
      }
    ]
  },
  {
    "value": "YOGA_BIKRAM",
    "description": "Yoga bikram type.",
    "key": "yogabikram",
    "counterparts": []
  },
  {
    "value": "YOGA_HATHA",
    "description": "Yoga hatha type.",
    "key": "yogahatha",
    "counterparts": []
  },
  {
    "value": "YOGA_POWER",
    "description": "Yoga power type.",
    "key": "yogapower",
    "counterparts": []
  },
  {
    "value": "YOGA_VINYASA",
    "description": "Yoga vinyasa type.",
    "key": "yogavinyasa",
    "counterparts": []
  },
  {
    "value": "ZUMBA",
    "description": "Zumba type.",
    "key": "zumba",
    "counterparts": []
  }
];

/** The Exercise schema's exerciseType and displayName descriptions, verbatim. */
export const WT_GHAPI_FIELDS: { exerciseType: string | null; displayName: string | null } = {
  "exerciseType": "Required. The type of activity performed during an exercise.",
  "displayName": "Required. The localized, human-readable name of the exercise. For all exercise types other than `OTHER`, the system ignores client input and overrides this field with a generated name based on `exercise_type` (e.g., \"Walking\" for `WALKING`). If `exercise_type` is `OTHER`, this field can contain the user's custom, free-form display name."
};

export type WtCrosswalkRow = {
  /** The shared key. */
  key: string;
  /** URL slug: kebab-case of the label's spelling. */
  slug: string;
  /** Display label: the first spelling in the order Health Connect, Wear OS, Google Health API, HealthKit (prefix removed). */
  label: string;
  /** One cell per platform with a constant of this key, in platform order. */
  cells: WtCounterpart[];
};

/** Name-identity rows: keys shared by at least two platforms. */
export const WT_CROSSWALK: WtCrosswalkRow[] = [
  {
    "key": "badminton",
    "slug": "badminton",
    "label": "BADMINTON",
    "cells": [
      {
        "platform": "healthkit",
        "name": "badminton"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BADMINTON"
      },
      {
        "platform": "wear-os",
        "name": "BADMINTON"
      },
      {
        "platform": "google-health-api",
        "name": "BADMINTON"
      }
    ]
  },
  {
    "key": "baseball",
    "slug": "baseball",
    "label": "BASEBALL",
    "cells": [
      {
        "platform": "healthkit",
        "name": "baseball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASEBALL"
      },
      {
        "platform": "wear-os",
        "name": "BASEBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASEBALL"
      }
    ]
  },
  {
    "key": "basketball",
    "slug": "basketball",
    "label": "BASKETBALL",
    "cells": [
      {
        "platform": "healthkit",
        "name": "basketball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BASKETBALL"
      },
      {
        "platform": "wear-os",
        "name": "BASKETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "BASKETBALL"
      }
    ]
  },
  {
    "key": "boxing",
    "slug": "boxing",
    "label": "BOXING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "boxing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BOXING"
      },
      {
        "platform": "wear-os",
        "name": "BOXING"
      },
      {
        "platform": "google-health-api",
        "name": "BOXING"
      }
    ]
  },
  {
    "key": "cricket",
    "slug": "cricket",
    "label": "CRICKET",
    "cells": [
      {
        "platform": "healthkit",
        "name": "cricket"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_CRICKET"
      },
      {
        "platform": "wear-os",
        "name": "CRICKET"
      },
      {
        "platform": "google-health-api",
        "name": "CRICKET"
      }
    ]
  },
  {
    "key": "elliptical",
    "slug": "elliptical",
    "label": "ELLIPTICAL",
    "cells": [
      {
        "platform": "healthkit",
        "name": "elliptical"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ELLIPTICAL"
      },
      {
        "platform": "wear-os",
        "name": "ELLIPTICAL"
      },
      {
        "platform": "google-health-api",
        "name": "ELLIPTICAL"
      }
    ]
  },
  {
    "key": "fencing",
    "slug": "fencing",
    "label": "FENCING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "fencing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FENCING"
      },
      {
        "platform": "wear-os",
        "name": "FENCING"
      },
      {
        "platform": "google-health-api",
        "name": "FENCING"
      }
    ]
  },
  {
    "key": "golf",
    "slug": "golf",
    "label": "GOLF",
    "cells": [
      {
        "platform": "healthkit",
        "name": "golf"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GOLF"
      },
      {
        "platform": "wear-os",
        "name": "GOLF"
      },
      {
        "platform": "google-health-api",
        "name": "GOLF"
      }
    ]
  },
  {
    "key": "gymnastics",
    "slug": "gymnastics",
    "label": "GYMNASTICS",
    "cells": [
      {
        "platform": "healthkit",
        "name": "gymnastics"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GYMNASTICS"
      },
      {
        "platform": "wear-os",
        "name": "GYMNASTICS"
      },
      {
        "platform": "google-health-api",
        "name": "GYMNASTICS"
      }
    ]
  },
  {
    "key": "handball",
    "slug": "handball",
    "label": "HANDBALL",
    "cells": [
      {
        "platform": "healthkit",
        "name": "handball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HANDBALL"
      },
      {
        "platform": "wear-os",
        "name": "HANDBALL"
      },
      {
        "platform": "google-health-api",
        "name": "HANDBALL"
      }
    ]
  },
  {
    "key": "hiking",
    "slug": "hiking",
    "label": "HIKING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "hiking"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HIKING"
      },
      {
        "platform": "wear-os",
        "name": "HIKING"
      },
      {
        "platform": "google-health-api",
        "name": "HIKING"
      }
    ]
  },
  {
    "key": "martialarts",
    "slug": "martial-arts",
    "label": "MARTIAL_ARTS",
    "cells": [
      {
        "platform": "healthkit",
        "name": "martialArts"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_MARTIAL_ARTS"
      },
      {
        "platform": "wear-os",
        "name": "MARTIAL_ARTS"
      },
      {
        "platform": "google-health-api",
        "name": "MARTIAL_ARTS"
      }
    ]
  },
  {
    "key": "pilates",
    "slug": "pilates",
    "label": "PILATES",
    "cells": [
      {
        "platform": "healthkit",
        "name": "pilates"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PILATES"
      },
      {
        "platform": "wear-os",
        "name": "PILATES"
      },
      {
        "platform": "google-health-api",
        "name": "PILATES"
      }
    ]
  },
  {
    "key": "racquetball",
    "slug": "racquetball",
    "label": "RACQUETBALL",
    "cells": [
      {
        "platform": "healthkit",
        "name": "racquetball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RACQUETBALL"
      },
      {
        "platform": "wear-os",
        "name": "RACQUETBALL"
      },
      {
        "platform": "google-health-api",
        "name": "RACQUETBALL"
      }
    ]
  },
  {
    "key": "rowing",
    "slug": "rowing",
    "label": "ROWING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "rowing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROWING"
      },
      {
        "platform": "wear-os",
        "name": "ROWING"
      },
      {
        "platform": "google-health-api",
        "name": "ROWING"
      }
    ]
  },
  {
    "key": "rugby",
    "slug": "rugby",
    "label": "RUGBY",
    "cells": [
      {
        "platform": "healthkit",
        "name": "rugby"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUGBY"
      },
      {
        "platform": "wear-os",
        "name": "RUGBY"
      },
      {
        "platform": "google-health-api",
        "name": "RUGBY"
      }
    ]
  },
  {
    "key": "running",
    "slug": "running",
    "label": "RUNNING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "running"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUNNING"
      },
      {
        "platform": "wear-os",
        "name": "RUNNING"
      },
      {
        "platform": "google-health-api",
        "name": "RUNNING"
      }
    ]
  },
  {
    "key": "sailing",
    "slug": "sailing",
    "label": "SAILING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "sailing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SAILING"
      },
      {
        "platform": "wear-os",
        "name": "SAILING"
      },
      {
        "platform": "google-health-api",
        "name": "SAILING"
      }
    ]
  },
  {
    "key": "snowboarding",
    "slug": "snowboarding",
    "label": "SNOWBOARDING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "snowboarding"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SNOWBOARDING"
      },
      {
        "platform": "wear-os",
        "name": "SNOWBOARDING"
      },
      {
        "platform": "google-health-api",
        "name": "SNOWBOARDING"
      }
    ]
  },
  {
    "key": "soccer",
    "slug": "soccer",
    "label": "SOCCER",
    "cells": [
      {
        "platform": "healthkit",
        "name": "soccer"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOCCER"
      },
      {
        "platform": "wear-os",
        "name": "SOCCER"
      },
      {
        "platform": "google-health-api",
        "name": "SOCCER"
      }
    ]
  },
  {
    "key": "softball",
    "slug": "softball",
    "label": "SOFTBALL",
    "cells": [
      {
        "platform": "healthkit",
        "name": "softball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SOFTBALL"
      },
      {
        "platform": "wear-os",
        "name": "SOFTBALL"
      },
      {
        "platform": "google-health-api",
        "name": "SOFTBALL"
      }
    ]
  },
  {
    "key": "squash",
    "slug": "squash",
    "label": "SQUASH",
    "cells": [
      {
        "platform": "healthkit",
        "name": "squash"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SQUASH"
      },
      {
        "platform": "wear-os",
        "name": "SQUASH"
      },
      {
        "platform": "google-health-api",
        "name": "SQUASH"
      }
    ]
  },
  {
    "key": "tabletennis",
    "slug": "table-tennis",
    "label": "TABLE_TENNIS",
    "cells": [
      {
        "platform": "healthkit",
        "name": "tableTennis"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TABLE_TENNIS"
      },
      {
        "platform": "wear-os",
        "name": "TABLE_TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TABLE_TENNIS"
      }
    ]
  },
  {
    "key": "tennis",
    "slug": "tennis",
    "label": "TENNIS",
    "cells": [
      {
        "platform": "healthkit",
        "name": "tennis"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_TENNIS"
      },
      {
        "platform": "wear-os",
        "name": "TENNIS"
      },
      {
        "platform": "google-health-api",
        "name": "TENNIS"
      }
    ]
  },
  {
    "key": "volleyball",
    "slug": "volleyball",
    "label": "VOLLEYBALL",
    "cells": [
      {
        "platform": "healthkit",
        "name": "volleyball"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_VOLLEYBALL"
      },
      {
        "platform": "wear-os",
        "name": "VOLLEYBALL"
      },
      {
        "platform": "google-health-api",
        "name": "VOLLEYBALL"
      }
    ]
  },
  {
    "key": "walking",
    "slug": "walking",
    "label": "WALKING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "walking"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WALKING"
      },
      {
        "platform": "wear-os",
        "name": "WALKING"
      },
      {
        "platform": "google-health-api",
        "name": "WALKING"
      }
    ]
  },
  {
    "key": "waterpolo",
    "slug": "water-polo",
    "label": "WATER_POLO",
    "cells": [
      {
        "platform": "healthkit",
        "name": "waterPolo"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WATER_POLO"
      },
      {
        "platform": "wear-os",
        "name": "WATER_POLO"
      },
      {
        "platform": "google-health-api",
        "name": "WATER_POLO"
      }
    ]
  },
  {
    "key": "yoga",
    "slug": "yoga",
    "label": "YOGA",
    "cells": [
      {
        "platform": "healthkit",
        "name": "yoga"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_YOGA"
      },
      {
        "platform": "wear-os",
        "name": "YOGA"
      },
      {
        "platform": "google-health-api",
        "name": "YOGA"
      }
    ]
  },
  {
    "key": "biking",
    "slug": "biking",
    "label": "BIKING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BIKING"
      },
      {
        "platform": "wear-os",
        "name": "BIKING"
      },
      {
        "platform": "google-health-api",
        "name": "BIKING"
      }
    ]
  },
  {
    "key": "bootcamp",
    "slug": "boot-camp",
    "label": "BOOT_CAMP",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BOOT_CAMP"
      },
      {
        "platform": "wear-os",
        "name": "BOOT_CAMP"
      },
      {
        "platform": "google-health-api",
        "name": "BOOTCAMP"
      }
    ]
  },
  {
    "key": "calisthenics",
    "slug": "calisthenics",
    "label": "CALISTHENICS",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_CALISTHENICS"
      },
      {
        "platform": "wear-os",
        "name": "CALISTHENICS"
      },
      {
        "platform": "google-health-api",
        "name": "CALISTHENICS"
      }
    ]
  },
  {
    "key": "dancing",
    "slug": "dancing",
    "label": "DANCING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_DANCING"
      },
      {
        "platform": "wear-os",
        "name": "DANCING"
      },
      {
        "platform": "google-health-api",
        "name": "DANCING"
      }
    ]
  },
  {
    "key": "exerciseclass",
    "slug": "exercise-class",
    "label": "EXERCISE_CLASS",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_EXERCISE_CLASS"
      },
      {
        "platform": "wear-os",
        "name": "EXERCISE_CLASS"
      },
      {
        "platform": "google-health-api",
        "name": "EXERCISE_CLASS"
      }
    ]
  },
  {
    "key": "footballamerican",
    "slug": "football-american",
    "label": "FOOTBALL_AMERICAN",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FOOTBALL_AMERICAN"
      },
      {
        "platform": "wear-os",
        "name": "FOOTBALL_AMERICAN"
      },
      {
        "platform": "google-health-api",
        "name": "FOOTBALL_AMERICAN"
      }
    ]
  },
  {
    "key": "footballaustralian",
    "slug": "football-australian",
    "label": "FOOTBALL_AUSTRALIAN",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN"
      },
      {
        "platform": "wear-os",
        "name": "FOOTBALL_AUSTRALIAN"
      },
      {
        "platform": "google-health-api",
        "name": "FOOTBALL_AUSTRALIAN"
      }
    ]
  },
  {
    "key": "highintensityintervaltraining",
    "slug": "high-intensity-interval-training",
    "label": "HIGH_INTENSITY_INTERVAL_TRAINING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "highIntensityIntervalTraining"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
      },
      {
        "platform": "wear-os",
        "name": "HIGH_INTENSITY_INTERVAL_TRAINING"
      }
    ]
  },
  {
    "key": "iceskating",
    "slug": "ice-skating",
    "label": "ICE_SKATING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ICE_SKATING"
      },
      {
        "platform": "wear-os",
        "name": "ICE_SKATING"
      },
      {
        "platform": "google-health-api",
        "name": "ICE_SKATING"
      }
    ]
  },
  {
    "key": "paragliding",
    "slug": "paragliding",
    "label": "PARAGLIDING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PARAGLIDING"
      },
      {
        "platform": "wear-os",
        "name": "PARA_GLIDING"
      },
      {
        "platform": "google-health-api",
        "name": "PARAGLIDING"
      }
    ]
  },
  {
    "key": "rockclimbing",
    "slug": "rock-climbing",
    "label": "ROCK_CLIMBING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROCK_CLIMBING"
      },
      {
        "platform": "wear-os",
        "name": "ROCK_CLIMBING"
      },
      {
        "platform": "google-health-api",
        "name": "ROCK_CLIMBING"
      }
    ]
  },
  {
    "key": "rowingmachine",
    "slug": "rowing-machine",
    "label": "ROWING_MACHINE",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROWING_MACHINE"
      },
      {
        "platform": "wear-os",
        "name": "ROWING_MACHINE"
      },
      {
        "platform": "google-health-api",
        "name": "ROWING_MACHINE"
      }
    ]
  },
  {
    "key": "scubadiving",
    "slug": "scuba-diving",
    "label": "SCUBA_DIVING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SCUBA_DIVING"
      },
      {
        "platform": "wear-os",
        "name": "SCUBA_DIVING"
      },
      {
        "platform": "google-health-api",
        "name": "SCUBA_DIVING"
      }
    ]
  },
  {
    "key": "skating",
    "slug": "skating",
    "label": "SKATING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SKATING"
      },
      {
        "platform": "wear-os",
        "name": "SKATING"
      },
      {
        "platform": "google-health-api",
        "name": "SKATING"
      }
    ]
  },
  {
    "key": "skiing",
    "slug": "skiing",
    "label": "SKIING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SKIING"
      },
      {
        "platform": "wear-os",
        "name": "SKIING"
      },
      {
        "platform": "google-health-api",
        "name": "SKIING"
      }
    ]
  },
  {
    "key": "snowshoeing",
    "slug": "snowshoeing",
    "label": "SNOWSHOEING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SNOWSHOEING"
      },
      {
        "platform": "wear-os",
        "name": "SNOWSHOEING"
      },
      {
        "platform": "google-health-api",
        "name": "SNOWSHOEING"
      }
    ]
  },
  {
    "key": "stairclimbing",
    "slug": "stair-climbing",
    "label": "STAIR_CLIMBING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "stairClimbing"
      },
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STAIR_CLIMBING"
      },
      {
        "platform": "wear-os",
        "name": "STAIR_CLIMBING"
      }
    ]
  },
  {
    "key": "strengthtraining",
    "slug": "strength-training",
    "label": "STRENGTH_TRAINING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STRENGTH_TRAINING"
      },
      {
        "platform": "wear-os",
        "name": "STRENGTH_TRAINING"
      },
      {
        "platform": "google-health-api",
        "name": "STRENGTH_TRAINING"
      }
    ]
  },
  {
    "key": "stretching",
    "slug": "stretching",
    "label": "STRETCHING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STRETCHING"
      },
      {
        "platform": "wear-os",
        "name": "STRETCHING"
      },
      {
        "platform": "google-health-api",
        "name": "STRETCHING"
      }
    ]
  },
  {
    "key": "surfing",
    "slug": "surfing",
    "label": "SURFING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SURFING"
      },
      {
        "platform": "wear-os",
        "name": "SURFING"
      },
      {
        "platform": "google-health-api",
        "name": "SURFING"
      }
    ]
  },
  {
    "key": "swimmingopenwater",
    "slug": "swimming-open-water",
    "label": "SWIMMING_OPEN_WATER",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SWIMMING_OPEN_WATER"
      },
      {
        "platform": "wear-os",
        "name": "SWIMMING_OPEN_WATER"
      },
      {
        "platform": "google-health-api",
        "name": "SWIMMING_OPEN_WATER"
      }
    ]
  },
  {
    "key": "swimmingpool",
    "slug": "swimming-pool",
    "label": "SWIMMING_POOL",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_SWIMMING_POOL"
      },
      {
        "platform": "wear-os",
        "name": "SWIMMING_POOL"
      },
      {
        "platform": "google-health-api",
        "name": "SWIMMING_POOL"
      }
    ]
  },
  {
    "key": "weightlifting",
    "slug": "weightlifting",
    "label": "WEIGHTLIFTING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WEIGHTLIFTING"
      },
      {
        "platform": "wear-os",
        "name": "WEIGHTLIFTING"
      },
      {
        "platform": "google-health-api",
        "name": "WEIGHTLIFTING"
      }
    ]
  },
  {
    "key": "archery",
    "slug": "archery",
    "label": "ARCHERY",
    "cells": [
      {
        "platform": "healthkit",
        "name": "archery"
      },
      {
        "platform": "google-health-api",
        "name": "ARCHERY"
      }
    ]
  },
  {
    "key": "backpacking",
    "slug": "backpacking",
    "label": "BACKPACKING",
    "cells": [
      {
        "platform": "wear-os",
        "name": "BACKPACKING"
      },
      {
        "platform": "google-health-api",
        "name": "BACKPACKING"
      }
    ]
  },
  {
    "key": "bikingstationary",
    "slug": "biking-stationary",
    "label": "BIKING_STATIONARY",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_BIKING_STATIONARY"
      },
      {
        "platform": "wear-os",
        "name": "BIKING_STATIONARY"
      }
    ]
  },
  {
    "key": "bowling",
    "slug": "bowling",
    "label": "BOWLING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "bowling"
      },
      {
        "platform": "google-health-api",
        "name": "BOWLING"
      }
    ]
  },
  {
    "key": "climbing",
    "slug": "climbing",
    "label": "CLIMBING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "climbing"
      },
      {
        "platform": "google-health-api",
        "name": "CLIMBING"
      }
    ]
  },
  {
    "key": "coretraining",
    "slug": "core-training",
    "label": "CORE_TRAINING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "coreTraining"
      },
      {
        "platform": "google-health-api",
        "name": "CORE_TRAINING"
      }
    ]
  },
  {
    "key": "crosscountryskiing",
    "slug": "cross-country-skiing",
    "label": "CROSS_COUNTRY_SKIING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "crossCountrySkiing"
      },
      {
        "platform": "wear-os",
        "name": "CROSS_COUNTRY_SKIING"
      }
    ]
  },
  {
    "key": "crosstraining",
    "slug": "cross-training",
    "label": "CROSS_TRAINING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "crossTraining"
      },
      {
        "platform": "google-health-api",
        "name": "CROSS_TRAINING"
      }
    ]
  },
  {
    "key": "curling",
    "slug": "curling",
    "label": "CURLING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "curling"
      },
      {
        "platform": "google-health-api",
        "name": "CURLING"
      }
    ]
  },
  {
    "key": "equestriansports",
    "slug": "equestrian-sports",
    "label": "EQUESTRIAN_SPORTS",
    "cells": [
      {
        "platform": "healthkit",
        "name": "equestrianSports"
      },
      {
        "platform": "google-health-api",
        "name": "EQUESTRIAN_SPORTS"
      }
    ]
  },
  {
    "key": "fishing",
    "slug": "fishing",
    "label": "FISHING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "fishing"
      },
      {
        "platform": "google-health-api",
        "name": "FISHING"
      }
    ]
  },
  {
    "key": "fitnessgaming",
    "slug": "fitness-gaming",
    "label": "FITNESS_GAMING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "fitnessGaming"
      },
      {
        "platform": "google-health-api",
        "name": "FITNESS_GAMING"
      }
    ]
  },
  {
    "key": "frisbeedisc",
    "slug": "frisbee-disc",
    "label": "FRISBEE_DISC",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_FRISBEE_DISC"
      },
      {
        "platform": "wear-os",
        "name": "FRISBEE_DISC"
      }
    ]
  },
  {
    "key": "functionalstrengthtraining",
    "slug": "functional-strength-training",
    "label": "FUNCTIONAL_STRENGTH_TRAINING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "functionalStrengthTraining"
      },
      {
        "platform": "google-health-api",
        "name": "FUNCTIONAL_STRENGTH_TRAINING"
      }
    ]
  },
  {
    "key": "guidedbreathing",
    "slug": "guided-breathing",
    "label": "GUIDED_BREATHING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_GUIDED_BREATHING"
      },
      {
        "platform": "wear-os",
        "name": "GUIDED_BREATHING"
      }
    ]
  },
  {
    "key": "handcycling",
    "slug": "hand-cycling",
    "label": "HAND_CYCLING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "handCycling"
      },
      {
        "platform": "google-health-api",
        "name": "HAND_CYCLING"
      }
    ]
  },
  {
    "key": "hockey",
    "slug": "hockey",
    "label": "HOCKEY",
    "cells": [
      {
        "platform": "healthkit",
        "name": "hockey"
      },
      {
        "platform": "google-health-api",
        "name": "HOCKEY"
      }
    ]
  },
  {
    "key": "hunting",
    "slug": "hunting",
    "label": "HUNTING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "hunting"
      },
      {
        "platform": "google-health-api",
        "name": "HUNTING"
      }
    ]
  },
  {
    "key": "icehockey",
    "slug": "ice-hockey",
    "label": "ICE_HOCKEY",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ICE_HOCKEY"
      },
      {
        "platform": "wear-os",
        "name": "ICE_HOCKEY"
      }
    ]
  },
  {
    "key": "jumprope",
    "slug": "jump-rope",
    "label": "JUMP_ROPE",
    "cells": [
      {
        "platform": "healthkit",
        "name": "jumpRope"
      },
      {
        "platform": "wear-os",
        "name": "JUMP_ROPE"
      }
    ]
  },
  {
    "key": "kickboxing",
    "slug": "kickboxing",
    "label": "KICKBOXING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "kickboxing"
      },
      {
        "platform": "google-health-api",
        "name": "KICKBOXING"
      }
    ]
  },
  {
    "key": "lacrosse",
    "slug": "lacrosse",
    "label": "LACROSSE",
    "cells": [
      {
        "platform": "healthkit",
        "name": "lacrosse"
      },
      {
        "platform": "google-health-api",
        "name": "LACROSSE"
      }
    ]
  },
  {
    "key": "orienteering",
    "slug": "orienteering",
    "label": "ORIENTEERING",
    "cells": [
      {
        "platform": "wear-os",
        "name": "ORIENTEERING"
      },
      {
        "platform": "google-health-api",
        "name": "ORIENTEERING"
      }
    ]
  },
  {
    "key": "other",
    "slug": "other",
    "label": "OTHER",
    "cells": [
      {
        "platform": "healthkit",
        "name": "other"
      },
      {
        "platform": "google-health-api",
        "name": "OTHER"
      }
    ]
  },
  {
    "key": "paddling",
    "slug": "paddling",
    "label": "PADDLING",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_PADDLING"
      },
      {
        "platform": "wear-os",
        "name": "PADDLING"
      }
    ]
  },
  {
    "key": "rollerhockey",
    "slug": "roller-hockey",
    "label": "ROLLER_HOCKEY",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_ROLLER_HOCKEY"
      },
      {
        "platform": "wear-os",
        "name": "ROLLER_HOCKEY"
      }
    ]
  },
  {
    "key": "rollerskating",
    "slug": "roller-skating",
    "label": "ROLLER_SKATING",
    "cells": [
      {
        "platform": "wear-os",
        "name": "ROLLER_SKATING"
      },
      {
        "platform": "google-health-api",
        "name": "ROLLER_SKATING"
      }
    ]
  },
  {
    "key": "runningtreadmill",
    "slug": "running-treadmill",
    "label": "RUNNING_TREADMILL",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_RUNNING_TREADMILL"
      },
      {
        "platform": "wear-os",
        "name": "RUNNING_TREADMILL"
      }
    ]
  },
  {
    "key": "stairclimbingmachine",
    "slug": "stair-climbing-machine",
    "label": "STAIR_CLIMBING_MACHINE",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE"
      },
      {
        "platform": "wear-os",
        "name": "STAIR_CLIMBING_MACHINE"
      }
    ]
  },
  {
    "key": "steptraining",
    "slug": "step-training",
    "label": "STEP_TRAINING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "stepTraining"
      },
      {
        "platform": "google-health-api",
        "name": "STEP_TRAINING"
      }
    ]
  },
  {
    "key": "swimming",
    "slug": "swimming",
    "label": "SWIMMING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "swimming"
      },
      {
        "platform": "google-health-api",
        "name": "SWIMMING"
      }
    ]
  },
  {
    "key": "taichi",
    "slug": "tai-chi",
    "label": "TAI_CHI",
    "cells": [
      {
        "platform": "healthkit",
        "name": "taiChi"
      },
      {
        "platform": "google-health-api",
        "name": "TAI_CHI"
      }
    ]
  },
  {
    "key": "trackandfield",
    "slug": "track-and-field",
    "label": "TRACK_AND_FIELD",
    "cells": [
      {
        "platform": "healthkit",
        "name": "trackAndField"
      },
      {
        "platform": "google-health-api",
        "name": "TRACK_AND_FIELD"
      }
    ]
  },
  {
    "key": "wheelchair",
    "slug": "wheelchair",
    "label": "WHEELCHAIR",
    "cells": [
      {
        "platform": "health-connect",
        "name": "EXERCISE_TYPE_WHEELCHAIR"
      },
      {
        "platform": "google-health-api",
        "name": "WHEELCHAIR"
      }
    ]
  },
  {
    "key": "workout",
    "slug": "workout",
    "label": "WORKOUT",
    "cells": [
      {
        "platform": "wear-os",
        "name": "WORKOUT"
      },
      {
        "platform": "google-health-api",
        "name": "WORKOUT"
      }
    ]
  },
  {
    "key": "wrestling",
    "slug": "wrestling",
    "label": "WRESTLING",
    "cells": [
      {
        "platform": "healthkit",
        "name": "wrestling"
      },
      {
        "platform": "google-health-api",
        "name": "WRESTLING"
      }
    ]
  }
];

export type WtStatedMapping = { from: WtCounterpart; to: WtCounterpart; sourceId: string; url: string; evidence: string };

/** Mappings a fetched source states between two of the four enumerations. None of the pages read states one. */
export const WT_STATED_MAPPINGS: WtStatedMapping[] = [
];

/** Pages read while looking for a published mapping, with how often each names each enumeration's constants and how many table rows or list items name two (always 0: one stops the write). */
export const WT_MAPPING_SEARCH: { sourceId: string; mentions: Record<string, number>; mixedRows: number }[] = [
  {
    "sourceId": "hcDataTypesGuide",
    "mentions": {
      "healthkit": 0,
      "health-connect": 62,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "searchHcWorkouts",
    "mentions": {
      "healthkit": 0,
      "health-connect": 2,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "searchHcRoutes",
    "mentions": {
      "healthkit": 0,
      "health-connect": 2,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "searchHcPlans",
    "mentions": {
      "healthkit": 0,
      "health-connect": 3,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "searchFitMigration",
    "mentions": {
      "healthkit": 0,
      "health-connect": 0,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "searchHsOverview",
    "mentions": {
      "healthkit": 0,
      "health-connect": 0,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "searchWearModule",
    "mentions": {
      "healthkit": 0,
      "health-connect": 0,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "searchGhapiWorkouts",
    "mentions": {
      "healthkit": 0,
      "health-connect": 0,
      "wear-os": 0
    },
    "mixedRows": 0
  },
  {
    "sourceId": "hkIndex",
    "mentions": {
      "healthkit": 880,
      "health-connect": 0,
      "wear-os": 0
    },
    "mixedRows": 0
  }
];

/** The library-internal name table in ExerciseSessionRecord.kt, kept as evidence and joined by nothing. */
export const WT_HC_STRING_MAP: { restrictedToLibrary: boolean; comment: string | null; entries: { key: string; value: string }[] } = {
  "restrictedToLibrary": true,
  "comment": "\"para_gliding\" to EXERCISE_TYPE_PARAGLIDING, // Historic typo in whs with para_gliding",
  "entries": [
    {
      "key": "back_extension",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "badminton",
      "value": "EXERCISE_TYPE_BADMINTON"
    },
    {
      "key": "barbell_shoulder_press",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "baseball",
      "value": "EXERCISE_TYPE_BASEBALL"
    },
    {
      "key": "basketball",
      "value": "EXERCISE_TYPE_BASKETBALL"
    },
    {
      "key": "bench_press",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "bench_sit_up",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "biking",
      "value": "EXERCISE_TYPE_BIKING"
    },
    {
      "key": "biking_stationary",
      "value": "EXERCISE_TYPE_BIKING_STATIONARY"
    },
    {
      "key": "boot_camp",
      "value": "EXERCISE_TYPE_BOOT_CAMP"
    },
    {
      "key": "boxing",
      "value": "EXERCISE_TYPE_BOXING"
    },
    {
      "key": "burpee",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "cricket",
      "value": "EXERCISE_TYPE_CRICKET"
    },
    {
      "key": "crunch",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "dancing",
      "value": "EXERCISE_TYPE_DANCING"
    },
    {
      "key": "deadlift",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "dumbbell_curl_left_arm",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "dumbbell_curl_right_arm",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "dumbbell_front_raise",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "dumbbell_lateral_raise",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "dumbbell_triceps_extension_left_arm",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "dumbbell_triceps_extension_right_arm",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "dumbbell_triceps_extension_two_arm",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "elliptical",
      "value": "EXERCISE_TYPE_ELLIPTICAL"
    },
    {
      "key": "exercise_class",
      "value": "EXERCISE_TYPE_EXERCISE_CLASS"
    },
    {
      "key": "fencing",
      "value": "EXERCISE_TYPE_FENCING"
    },
    {
      "key": "football_american",
      "value": "EXERCISE_TYPE_FOOTBALL_AMERICAN"
    },
    {
      "key": "football_australian",
      "value": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN"
    },
    {
      "key": "forward_twist",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "frisbee_disc",
      "value": "EXERCISE_TYPE_FRISBEE_DISC"
    },
    {
      "key": "golf",
      "value": "EXERCISE_TYPE_GOLF"
    },
    {
      "key": "guided_breathing",
      "value": "EXERCISE_TYPE_GUIDED_BREATHING"
    },
    {
      "key": "gymnastics",
      "value": "EXERCISE_TYPE_GYMNASTICS"
    },
    {
      "key": "handball",
      "value": "EXERCISE_TYPE_HANDBALL"
    },
    {
      "key": "hiking",
      "value": "EXERCISE_TYPE_HIKING"
    },
    {
      "key": "ice_hockey",
      "value": "EXERCISE_TYPE_ICE_HOCKEY"
    },
    {
      "key": "ice_skating",
      "value": "EXERCISE_TYPE_ICE_SKATING"
    },
    {
      "key": "jumping_jack",
      "value": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
    },
    {
      "key": "jump_rope",
      "value": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
    },
    {
      "key": "lat_pull_down",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    },
    {
      "key": "lunge",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "martial_arts",
      "value": "EXERCISE_TYPE_MARTIAL_ARTS"
    },
    {
      "key": "paddling",
      "value": "EXERCISE_TYPE_PADDLING"
    },
    {
      "key": "para_gliding",
      "value": "EXERCISE_TYPE_PARAGLIDING"
    },
    {
      "key": "pilates",
      "value": "EXERCISE_TYPE_PILATES"
    },
    {
      "key": "plank",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "racquetball",
      "value": "EXERCISE_TYPE_RACQUETBALL"
    },
    {
      "key": "rock_climbing",
      "value": "EXERCISE_TYPE_ROCK_CLIMBING"
    },
    {
      "key": "roller_hockey",
      "value": "EXERCISE_TYPE_ROLLER_HOCKEY"
    },
    {
      "key": "rowing",
      "value": "EXERCISE_TYPE_ROWING"
    },
    {
      "key": "rowing_machine",
      "value": "EXERCISE_TYPE_ROWING_MACHINE"
    },
    {
      "key": "rugby",
      "value": "EXERCISE_TYPE_RUGBY"
    },
    {
      "key": "running",
      "value": "EXERCISE_TYPE_RUNNING"
    },
    {
      "key": "running_treadmill",
      "value": "EXERCISE_TYPE_RUNNING_TREADMILL"
    },
    {
      "key": "sailing",
      "value": "EXERCISE_TYPE_SAILING"
    },
    {
      "key": "scuba_diving",
      "value": "EXERCISE_TYPE_SCUBA_DIVING"
    },
    {
      "key": "skating",
      "value": "EXERCISE_TYPE_SKATING"
    },
    {
      "key": "skiing",
      "value": "EXERCISE_TYPE_SKIING"
    },
    {
      "key": "snowboarding",
      "value": "EXERCISE_TYPE_SNOWBOARDING"
    },
    {
      "key": "snowshoeing",
      "value": "EXERCISE_TYPE_SNOWSHOEING"
    },
    {
      "key": "soccer",
      "value": "EXERCISE_TYPE_SOCCER"
    },
    {
      "key": "softball",
      "value": "EXERCISE_TYPE_SOFTBALL"
    },
    {
      "key": "squash",
      "value": "EXERCISE_TYPE_SQUASH"
    },
    {
      "key": "squat",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "stair_climbing",
      "value": "EXERCISE_TYPE_STAIR_CLIMBING"
    },
    {
      "key": "stair_climbing_machine",
      "value": "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE"
    },
    {
      "key": "stretching",
      "value": "EXERCISE_TYPE_STRETCHING"
    },
    {
      "key": "surfing",
      "value": "EXERCISE_TYPE_SURFING"
    },
    {
      "key": "swimming_open_water",
      "value": "EXERCISE_TYPE_SWIMMING_OPEN_WATER"
    },
    {
      "key": "swimming_pool",
      "value": "EXERCISE_TYPE_SWIMMING_POOL"
    },
    {
      "key": "table_tennis",
      "value": "EXERCISE_TYPE_TABLE_TENNIS"
    },
    {
      "key": "tennis",
      "value": "EXERCISE_TYPE_TENNIS"
    },
    {
      "key": "upper_twist",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "volleyball",
      "value": "EXERCISE_TYPE_VOLLEYBALL"
    },
    {
      "key": "walking",
      "value": "EXERCISE_TYPE_WALKING"
    },
    {
      "key": "water_polo",
      "value": "EXERCISE_TYPE_WATER_POLO"
    },
    {
      "key": "weightlifting",
      "value": "EXERCISE_TYPE_WEIGHTLIFTING"
    },
    {
      "key": "wheelchair",
      "value": "EXERCISE_TYPE_WHEELCHAIR"
    },
    {
      "key": "workout",
      "value": "EXERCISE_TYPE_OTHER_WORKOUT"
    },
    {
      "key": "yoga",
      "value": "EXERCISE_TYPE_YOGA"
    },
    {
      "key": "calisthenics",
      "value": "EXERCISE_TYPE_CALISTHENICS"
    },
    {
      "key": "high_intensity_interval_training",
      "value": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING"
    },
    {
      "key": "strength_training",
      "value": "EXERCISE_TYPE_STRENGTH_TRAINING"
    }
  ]
};

export type WtIntComparison = { key: string; healthConnect: { name: string; value: number }; wearOs: { name: string; id: number | null }; same: boolean };

/** Rows with both a Health Connect and a Wear OS constant: do the printed integers match? */
export const WT_INT_COMPARISON: WtIntComparison[] = [
  {
    "key": "badminton",
    "healthConnect": {
      "name": "EXERCISE_TYPE_BADMINTON",
      "value": 2
    },
    "wearOs": {
      "name": "BADMINTON",
      "id": 2
    },
    "same": true
  },
  {
    "key": "baseball",
    "healthConnect": {
      "name": "EXERCISE_TYPE_BASEBALL",
      "value": 4
    },
    "wearOs": {
      "name": "BASEBALL",
      "id": 4
    },
    "same": true
  },
  {
    "key": "basketball",
    "healthConnect": {
      "name": "EXERCISE_TYPE_BASKETBALL",
      "value": 5
    },
    "wearOs": {
      "name": "BASKETBALL",
      "id": 5
    },
    "same": true
  },
  {
    "key": "boxing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_BOXING",
      "value": 11
    },
    "wearOs": {
      "name": "BOXING",
      "id": 11
    },
    "same": true
  },
  {
    "key": "cricket",
    "healthConnect": {
      "name": "EXERCISE_TYPE_CRICKET",
      "value": 14
    },
    "wearOs": {
      "name": "CRICKET",
      "id": 14
    },
    "same": true
  },
  {
    "key": "elliptical",
    "healthConnect": {
      "name": "EXERCISE_TYPE_ELLIPTICAL",
      "value": 25
    },
    "wearOs": {
      "name": "ELLIPTICAL",
      "id": 25
    },
    "same": true
  },
  {
    "key": "fencing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_FENCING",
      "value": 27
    },
    "wearOs": {
      "name": "FENCING",
      "id": 27
    },
    "same": true
  },
  {
    "key": "golf",
    "healthConnect": {
      "name": "EXERCISE_TYPE_GOLF",
      "value": 32
    },
    "wearOs": {
      "name": "GOLF",
      "id": 32
    },
    "same": true
  },
  {
    "key": "gymnastics",
    "healthConnect": {
      "name": "EXERCISE_TYPE_GYMNASTICS",
      "value": 34
    },
    "wearOs": {
      "name": "GYMNASTICS",
      "id": 34
    },
    "same": true
  },
  {
    "key": "handball",
    "healthConnect": {
      "name": "EXERCISE_TYPE_HANDBALL",
      "value": 35
    },
    "wearOs": {
      "name": "HANDBALL",
      "id": 35
    },
    "same": true
  },
  {
    "key": "hiking",
    "healthConnect": {
      "name": "EXERCISE_TYPE_HIKING",
      "value": 37
    },
    "wearOs": {
      "name": "HIKING",
      "id": 37
    },
    "same": true
  },
  {
    "key": "martialarts",
    "healthConnect": {
      "name": "EXERCISE_TYPE_MARTIAL_ARTS",
      "value": 44
    },
    "wearOs": {
      "name": "MARTIAL_ARTS",
      "id": 44
    },
    "same": true
  },
  {
    "key": "pilates",
    "healthConnect": {
      "name": "EXERCISE_TYPE_PILATES",
      "value": 48
    },
    "wearOs": {
      "name": "PILATES",
      "id": 48
    },
    "same": true
  },
  {
    "key": "racquetball",
    "healthConnect": {
      "name": "EXERCISE_TYPE_RACQUETBALL",
      "value": 50
    },
    "wearOs": {
      "name": "RACQUETBALL",
      "id": 50
    },
    "same": true
  },
  {
    "key": "rowing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_ROWING",
      "value": 53
    },
    "wearOs": {
      "name": "ROWING",
      "id": 53
    },
    "same": true
  },
  {
    "key": "rugby",
    "healthConnect": {
      "name": "EXERCISE_TYPE_RUGBY",
      "value": 55
    },
    "wearOs": {
      "name": "RUGBY",
      "id": 57
    },
    "same": false
  },
  {
    "key": "running",
    "healthConnect": {
      "name": "EXERCISE_TYPE_RUNNING",
      "value": 56
    },
    "wearOs": {
      "name": "RUNNING",
      "id": 55
    },
    "same": false
  },
  {
    "key": "sailing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SAILING",
      "value": 58
    },
    "wearOs": {
      "name": "SAILING",
      "id": 58
    },
    "same": true
  },
  {
    "key": "snowboarding",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SNOWBOARDING",
      "value": 62
    },
    "wearOs": {
      "name": "SNOWBOARDING",
      "id": 62
    },
    "same": true
  },
  {
    "key": "soccer",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SOCCER",
      "value": 64
    },
    "wearOs": {
      "name": "SOCCER",
      "id": 64
    },
    "same": true
  },
  {
    "key": "softball",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SOFTBALL",
      "value": 65
    },
    "wearOs": {
      "name": "SOFTBALL",
      "id": 65
    },
    "same": true
  },
  {
    "key": "squash",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SQUASH",
      "value": 66
    },
    "wearOs": {
      "name": "SQUASH",
      "id": 66
    },
    "same": true
  },
  {
    "key": "tabletennis",
    "healthConnect": {
      "name": "EXERCISE_TYPE_TABLE_TENNIS",
      "value": 75
    },
    "wearOs": {
      "name": "TABLE_TENNIS",
      "id": 75
    },
    "same": true
  },
  {
    "key": "tennis",
    "healthConnect": {
      "name": "EXERCISE_TYPE_TENNIS",
      "value": 76
    },
    "wearOs": {
      "name": "TENNIS",
      "id": 76
    },
    "same": true
  },
  {
    "key": "volleyball",
    "healthConnect": {
      "name": "EXERCISE_TYPE_VOLLEYBALL",
      "value": 78
    },
    "wearOs": {
      "name": "VOLLEYBALL",
      "id": 78
    },
    "same": true
  },
  {
    "key": "walking",
    "healthConnect": {
      "name": "EXERCISE_TYPE_WALKING",
      "value": 79
    },
    "wearOs": {
      "name": "WALKING",
      "id": 79
    },
    "same": true
  },
  {
    "key": "waterpolo",
    "healthConnect": {
      "name": "EXERCISE_TYPE_WATER_POLO",
      "value": 80
    },
    "wearOs": {
      "name": "WATER_POLO",
      "id": 80
    },
    "same": true
  },
  {
    "key": "yoga",
    "healthConnect": {
      "name": "EXERCISE_TYPE_YOGA",
      "value": 83
    },
    "wearOs": {
      "name": "YOGA",
      "id": 83
    },
    "same": true
  },
  {
    "key": "biking",
    "healthConnect": {
      "name": "EXERCISE_TYPE_BIKING",
      "value": 8
    },
    "wearOs": {
      "name": "BIKING",
      "id": 8
    },
    "same": true
  },
  {
    "key": "bootcamp",
    "healthConnect": {
      "name": "EXERCISE_TYPE_BOOT_CAMP",
      "value": 10
    },
    "wearOs": {
      "name": "BOOT_CAMP",
      "id": 10
    },
    "same": true
  },
  {
    "key": "calisthenics",
    "healthConnect": {
      "name": "EXERCISE_TYPE_CALISTHENICS",
      "value": 13
    },
    "wearOs": {
      "name": "CALISTHENICS",
      "id": 13
    },
    "same": true
  },
  {
    "key": "dancing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_DANCING",
      "value": 16
    },
    "wearOs": {
      "name": "DANCING",
      "id": 16
    },
    "same": true
  },
  {
    "key": "exerciseclass",
    "healthConnect": {
      "name": "EXERCISE_TYPE_EXERCISE_CLASS",
      "value": 26
    },
    "wearOs": {
      "name": "EXERCISE_CLASS",
      "id": 26
    },
    "same": true
  },
  {
    "key": "footballamerican",
    "healthConnect": {
      "name": "EXERCISE_TYPE_FOOTBALL_AMERICAN",
      "value": 28
    },
    "wearOs": {
      "name": "FOOTBALL_AMERICAN",
      "id": 29
    },
    "same": false
  },
  {
    "key": "footballaustralian",
    "healthConnect": {
      "name": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN",
      "value": 29
    },
    "wearOs": {
      "name": "FOOTBALL_AUSTRALIAN",
      "id": 30
    },
    "same": false
  },
  {
    "key": "highintensityintervaltraining",
    "healthConnect": {
      "name": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING",
      "value": 36
    },
    "wearOs": {
      "name": "HIGH_INTENSITY_INTERVAL_TRAINING",
      "id": 36
    },
    "same": true
  },
  {
    "key": "iceskating",
    "healthConnect": {
      "name": "EXERCISE_TYPE_ICE_SKATING",
      "value": 39
    },
    "wearOs": {
      "name": "ICE_SKATING",
      "id": 39
    },
    "same": true
  },
  {
    "key": "paragliding",
    "healthConnect": {
      "name": "EXERCISE_TYPE_PARAGLIDING",
      "value": 47
    },
    "wearOs": {
      "name": "PARA_GLIDING",
      "id": 47
    },
    "same": true
  },
  {
    "key": "rockclimbing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_ROCK_CLIMBING",
      "value": 51
    },
    "wearOs": {
      "name": "ROCK_CLIMBING",
      "id": 51
    },
    "same": true
  },
  {
    "key": "rowingmachine",
    "healthConnect": {
      "name": "EXERCISE_TYPE_ROWING_MACHINE",
      "value": 54
    },
    "wearOs": {
      "name": "ROWING_MACHINE",
      "id": 54
    },
    "same": true
  },
  {
    "key": "scubadiving",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SCUBA_DIVING",
      "value": 59
    },
    "wearOs": {
      "name": "SCUBA_DIVING",
      "id": 59
    },
    "same": true
  },
  {
    "key": "skating",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SKATING",
      "value": 60
    },
    "wearOs": {
      "name": "SKATING",
      "id": 60
    },
    "same": true
  },
  {
    "key": "skiing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SKIING",
      "value": 61
    },
    "wearOs": {
      "name": "SKIING",
      "id": 61
    },
    "same": true
  },
  {
    "key": "snowshoeing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SNOWSHOEING",
      "value": 63
    },
    "wearOs": {
      "name": "SNOWSHOEING",
      "id": 63
    },
    "same": true
  },
  {
    "key": "stairclimbing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_STAIR_CLIMBING",
      "value": 68
    },
    "wearOs": {
      "name": "STAIR_CLIMBING",
      "id": 68
    },
    "same": true
  },
  {
    "key": "strengthtraining",
    "healthConnect": {
      "name": "EXERCISE_TYPE_STRENGTH_TRAINING",
      "value": 70
    },
    "wearOs": {
      "name": "STRENGTH_TRAINING",
      "id": 70
    },
    "same": true
  },
  {
    "key": "stretching",
    "healthConnect": {
      "name": "EXERCISE_TYPE_STRETCHING",
      "value": 71
    },
    "wearOs": {
      "name": "STRETCHING",
      "id": 71
    },
    "same": true
  },
  {
    "key": "surfing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SURFING",
      "value": 72
    },
    "wearOs": {
      "name": "SURFING",
      "id": 72
    },
    "same": true
  },
  {
    "key": "swimmingopenwater",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SWIMMING_OPEN_WATER",
      "value": 73
    },
    "wearOs": {
      "name": "SWIMMING_OPEN_WATER",
      "id": 73
    },
    "same": true
  },
  {
    "key": "swimmingpool",
    "healthConnect": {
      "name": "EXERCISE_TYPE_SWIMMING_POOL",
      "value": 74
    },
    "wearOs": {
      "name": "SWIMMING_POOL",
      "id": 74
    },
    "same": true
  },
  {
    "key": "weightlifting",
    "healthConnect": {
      "name": "EXERCISE_TYPE_WEIGHTLIFTING",
      "value": 81
    },
    "wearOs": {
      "name": "WEIGHTLIFTING",
      "id": 81
    },
    "same": true
  },
  {
    "key": "bikingstationary",
    "healthConnect": {
      "name": "EXERCISE_TYPE_BIKING_STATIONARY",
      "value": 9
    },
    "wearOs": {
      "name": "BIKING_STATIONARY",
      "id": 9
    },
    "same": true
  },
  {
    "key": "frisbeedisc",
    "healthConnect": {
      "name": "EXERCISE_TYPE_FRISBEE_DISC",
      "value": 31
    },
    "wearOs": {
      "name": "FRISBEE_DISC",
      "id": 28
    },
    "same": false
  },
  {
    "key": "guidedbreathing",
    "healthConnect": {
      "name": "EXERCISE_TYPE_GUIDED_BREATHING",
      "value": 33
    },
    "wearOs": {
      "name": "GUIDED_BREATHING",
      "id": 33
    },
    "same": true
  },
  {
    "key": "icehockey",
    "healthConnect": {
      "name": "EXERCISE_TYPE_ICE_HOCKEY",
      "value": 38
    },
    "wearOs": {
      "name": "ICE_HOCKEY",
      "id": 38
    },
    "same": true
  },
  {
    "key": "paddling",
    "healthConnect": {
      "name": "EXERCISE_TYPE_PADDLING",
      "value": 46
    },
    "wearOs": {
      "name": "PADDLING",
      "id": 46
    },
    "same": true
  },
  {
    "key": "rollerhockey",
    "healthConnect": {
      "name": "EXERCISE_TYPE_ROLLER_HOCKEY",
      "value": 52
    },
    "wearOs": {
      "name": "ROLLER_HOCKEY",
      "id": 52
    },
    "same": true
  },
  {
    "key": "runningtreadmill",
    "healthConnect": {
      "name": "EXERCISE_TYPE_RUNNING_TREADMILL",
      "value": 57
    },
    "wearOs": {
      "name": "RUNNING_TREADMILL",
      "id": 56
    },
    "same": false
  },
  {
    "key": "stairclimbingmachine",
    "healthConnect": {
      "name": "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE",
      "value": 69
    },
    "wearOs": {
      "name": "STAIR_CLIMBING_MACHINE",
      "id": 69
    },
    "same": true
  }
];

export type WtFallback = { platform: WtPlatformSlug; constant: string; statements: { sourceId: string; text: string }[] };

/** Each platform's catch-all constant and what its sources say about it, verbatim. */
export const WT_FALLBACKS: WtFallback[] = [
  {
    "platform": "healthkit",
    "constant": "other",
    "statements": [
      {
        "sourceId": "hkCases",
        "text": "The constant for a workout that does not match any of the other workout activity types."
      },
      {
        "sourceId": "hkCases",
        "text": "If your app uses the `HKWorkoutActivityType.swimming` or `HKWorkoutActivityType.other` activity type, you must explain how your app calculates workout data when sensor information is not available. For more information, see the `Human Interface Guidelines`."
      }
    ]
  },
  {
    "platform": "health-connect",
    "constant": "EXERCISE_TYPE_OTHER_WORKOUT",
    "statements": [
      {
        "sourceId": "hcSessionRef",
        "text": "Can be used to represent any generic workout that does not fall into a specific category. Any unknown new value definition will also fall automatically into `EXERCISE_TYPE_OTHER_WORKOUT`. Next Id: 84."
      },
      {
        "sourceId": "hcMappingSrc",
        "text": "internal fun Int.toSdkExerciseSessionType(): Int { return PLATFORM_TO_SDK_EXERCISE_SESSION_TYPE[this] ?: ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT }"
      }
    ]
  },
  {
    "platform": "wear-os",
    "constant": "UNKNOWN",
    "statements": [
      {
        "sourceId": "hsJavaRef",
        "text": "UNKNOWN: The current exercise type of the user is unknown or not set."
      },
      {
        "sourceId": "hsJavaRef",
        "text": "fromId(id): Returns the `ExerciseType` based on its unique `id`. If the `id` doesn't map to an particular `ExerciseType`, then `ExerciseType.UNKNOWN` is returned by default."
      },
      {
        "sourceId": "hsExerciseGuide",
        "text": "Each ExerciseType supports certain data types for metrics and for exercise goals. Check these capabilities at startup, because they can vary depending on the device. A device might not support a certain exercise type, or it might not support a specific function, such as auto-pause."
      }
    ]
  },
  {
    "platform": "google-health-api",
    "constant": "OTHER",
    "statements": [
      {
        "sourceId": "ghapiModule",
        "text": "OTHER: Other type."
      },
      {
        "sourceId": "ghapiModule",
        "text": "displayName: Required. The localized, human-readable name of the exercise. For all exercise types other than `OTHER`, the system ignores client input and overrides this field with a generated name based on `exercise_type` (e.g., \"Walking\" for `WALKING`). If `exercise_type` is `OTHER`, this field can contain the user's custom, free-form display name."
      }
    ]
  }
];

export type WtFlag = { kind: string; platform: WtPlatformSlug; subject: string; summary: string; evidence: { sourceId: string; text: string }[] };

/** Where two sources disagree, published as found. */
export const WT_FLAGS: WtFlag[] = [
  {
    "kind": "guide-only",
    "platform": "health-connect",
    "subject": "EXERCISE_TYPE_UNKNOWN",
    "summary": "Google's Health Connect data-types guide (last updated 2026-09-23) lists EXERCISE_TYPE_UNKNOWN under \"Exercise types\" in its ExerciseSessionRecord row, one of 62 names there; the Jetpack ExerciseSessionRecord reference does not define it, and neither does the androidx source.",
    "evidence": [
      {
        "sourceId": "hcDataTypesGuide",
        "text": "EXERCISE_TYPE_UNKNOWN"
      }
    ]
  },
  {
    "kind": "description-mismatch",
    "platform": "health-connect",
    "subject": "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
    "summary": "Google's ExerciseSegment reference describes EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE (15) as \"Use this type for right arm dumbbell curl.\", the words of the constant before it, EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM (14), which it gives no description; the androidx source has the same comment above EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE.",
    "evidence": [
      {
        "sourceId": "hcSegmentRef",
        "text": "Use this type for right arm dumbbell curl."
      },
      {
        "sourceId": "hcSegmentSrc",
        "text": "/** Use this type for right arm dumbbell curl. */ public const val EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE: Int = 15"
      }
    ]
  },
  {
    "kind": "description-mismatch",
    "platform": "health-connect",
    "subject": "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION",
    "summary": "Google's ExerciseSegment reference describes EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION (49) as \"Use this type for shoulder press.\", the words of the constant before it, EXERCISE_SEGMENT_TYPE_SHOULDER_PRESS (48), which it gives no description; the androidx source has the same comment above EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION.",
    "evidence": [
      {
        "sourceId": "hcSegmentRef",
        "text": "Use this type for shoulder press."
      },
      {
        "sourceId": "hcSegmentSrc",
        "text": "/** Use this type for shoulder press. */ public const val EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION: Int = 49"
      }
    ]
  },
  {
    "kind": "deprecation-mismatch",
    "platform": "health-connect",
    "subject": "EXERCISE_TYPE_GUIDED_BREATHING",
    "summary": "The platform API deprecates EXERCISE_SESSION_TYPE_GUIDED_BREATHING in API level 37; the Jetpack reference does not mark EXERCISE_TYPE_GUIDED_BREATHING, which the library converts to it, deprecated.",
    "evidence": [
      {
        "sourceId": "hcPlatformRef",
        "text": "This constant was deprecated in API level 37. Use `MindfulnessSessionRecord` of the corresponding type `MindfulnessSessionRecord.MINDFULNESS_SESSION_TYPE_BREATHING`."
      },
      {
        "sourceId": "hcMappingSrc",
        "text": "ExerciseSessionRecord.EXERCISE_TYPE_GUIDED_BREATHING to @Suppress(\"DEPRECATION\") PlatformExerciseSessionType.EXERCISE_SESSION_TYPE_GUIDED_BREATHING"
      }
    ]
  },
  {
    "kind": "platform-only",
    "platform": "health-connect",
    "subject": "EXERCISE_SESSION_TYPE_UNKNOWN",
    "summary": "The platform ExerciseSessionType reference lists EXERCISE_SESSION_TYPE_UNKNOWN = 0; no Jetpack constant maps to it in IntDefMappings.kt, and the library's toSdkExerciseSessionType() turns an unmapped platform value into EXERCISE_TYPE_OTHER_WORKOUT.",
    "evidence": [
      {
        "sourceId": "hcPlatformRef",
        "text": "Use this type if the type of the exercise session is not known."
      },
      {
        "sourceId": "hcMappingSrc",
        "text": "internal fun Int.toSdkExerciseSessionType(): Int { return PLATFORM_TO_SDK_EXERCISE_SESSION_TYPE[this] ?: ExerciseSessionRecord.EXERCISE_TYPE_OTHER_WORKOUT }"
      }
    ]
  },
  {
    "kind": "sample-mismatch",
    "platform": "health-connect",
    "subject": "ExerciseSessionRecord.ExerciseType.RUNNING",
    "summary": "2 Health Connect guides' samples write exerciseType = ExerciseSessionRecord.ExerciseType.RUNNING; the ExerciseSessionRecord reference lists no ExerciseType member, and its constant is EXERCISE_TYPE_RUNNING = 56.",
    "evidence": [
      {
        "sourceId": "searchHcRoutes",
        "text": "exerciseType = ExerciseSessionRecord.ExerciseType.RUNNING"
      },
      {
        "sourceId": "searchHcPlans",
        "text": "exerciseType = ExerciseSessionRecord.ExerciseType.RUNNING"
      },
      {
        "sourceId": "hcSessionRef",
        "text": "const val EXERCISE_TYPE_RUNNING = 56: Int"
      }
    ]
  }
];
