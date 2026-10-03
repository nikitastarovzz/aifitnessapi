/**
 * The corrections log. Only entries that were PUBLISHED wrong belong in
 * CORRECTIONS — a mistake caught by a gate before deploy is a different
 * thing, recorded in NEAR_MISSES so the distinction stays honest. Padding
 * this list with near-misses would inflate the site's error rate; hiding
 * them would inflate its accuracy. Both lists are real.
 */
export type Correction = {
  date: string; // when corrected
  page: { href: string; label: string };
  was: string;
  now: string;
  how: string;
};

export const CORRECTIONS: Correction[] = [
  {
    date: "2026-10-03",
    page: { href: "/learn/what-is-rpe", label: "What Is RPE (Rating of Perceived Exertion)?" },
    was: "The page said no wearable or health-data API exposes perceived effort, in its answer capsule and in a section headed \"Nothing in a wearable API gives you this\".",
    now: "HealthKit has had workoutEffortScore and estimatedWorkoutEffortScore quantity types since iOS 18.0, with HKHealthStore methods to relate an effort sample to a workout. Apple documents no description, scale or unit for either type, so the page now says a storage field exists and that what it holds is undocumented. No sensor measures RPE, which the page still says.",
    how: "Found on 2026-10-03 while planning links from the page to the HealthKit reference, then checked against Apple's documentation for both types, HKWorkoutEffortRelationshipQuery and HKHealthStore.",
  },
  {
    date: "2026-10-02",
    page: { href: "/integrate/healthkit", label: "How to Integrate Apple HealthKit" },
    was: "The guide labelled HKQuantityType(.stepCount) — the type-safe initializer used in its code — as iOS 16 and later, in four places.",
    now: "iOS 15 and later, which is the version Apple's reference for HKQuantityType.init(_:) gives on iOS, iPadOS and Mac Catalyst.",
    how: "Found while re-verifying every claim on the page against developer.apple.com on 2026-10-02.",
  },
  {
    date: "2026-10-02",
    page: { href: "/fitness-apis/apple-healthkit-vs-google-health-connect", label: "Apple HealthKit vs Google Health Connect" },
    was: "The comparison said Health Connect is for Android 14 and up.",
    now: "Google's availability page says Health Connect requires Android 9 (API 28) or higher with Google Play services: it is part of the system from Android 14, and a Play Store app on Android 13 and lower.",
    how: "Found while re-verifying every claim on the page against developer.android.com on 2026-10-02.",
  },
  {
    date: "2026-10-02",
    page: { href: "/fix/healthkit-no-data", label: "HealthKit Returns No Data" },
    was: "The fix treated a write that succeeds followed by an empty read-back as a sign that read permission was denied.",
    now: "Apple's documentation says an app without read permission still receives the samples it saved itself, so an empty read-back of your own writes points at the query (predicate, type or date range), not at denial.",
    how: "Found while re-verifying the page against Apple's HKAuthorizationStatus, HKError.Code.errorAuthorizationDenied and authorization guide on 2026-10-02.",
  },
  {
    date: "2026-10-02",
    page: { href: "/healthkit-status", label: "HealthKit Deprecated and Beta Types" },
    was: "The page said none of the 240 HealthKit identifiers carried a deprecation on any platform, that membership of Apple's \"Deprecated activity types\" group was the only deprecation signal its three workout constants had, and that nothing in Apple's machine-readable availability data marked them.",
    now: "Four are deprecated in Apple's availability data: dance (iOS 14.0), danceInspiredTraining (10.0), mixedMetabolicCardioTraining (11.0) and audioExposureEvent (14.0), the last outside the deprecated group. Apple records a deprecation as a deprecatedAt version on each platform entry and leaves its separate deprecated flag false; the generator read only the flag. It now reads both, and the page lists each platform's version and Apple's own note.",
    how: "Found while re-checking the page against the 2026-10-02 re-read of Apple's documentation. The four deprecations date from iOS 10.0 to 14.0, so the claim was false when published.",
  },
  {
    date: "2026-10-02",
    page: { href: "/healthkit", label: "HealthKit, Mapped" },
    was: "The hub's link to the status page said what is deprecated in HealthKit is \"nothing, at the platform level\".",
    now: "The count is computed from the dataset, which now reads Apple's deprecatedAt versions: four identifiers.",
    how: "Same root cause as the status page, found the same day.",
  },
  {
    date: "2026-10-02",
    page: { href: "/blog/healthkit-240-types-ios-8", label: "HealthKit: 127 of 240 Types Are iOS 8.0" },
    was: "The post's description, an FAQ answer and a section headed \"Nothing is marked deprecated\" said none of the 240 identifiers carried a deprecation marker, and a later section built on \"zero deprecations\".",
    now: "Four did: dance, danceInspiredTraining, mixedMetabolicCardioTraining and audioExposureEvent, deprecated in iOS 10.0 to 14.0. All four places now say so under a dated correction note. None of the four has been removed, which is the point the section still makes.",
    how: "Found while re-checking HealthKit claims against the 2026-10-02 re-read, once the generator read Apple's deprecatedAt versions.",
  },
  {
    date: "2026-10-02",
    page: { href: "/blog/healthkit-newest-types-roadmap", label: "Apple's Newest HealthKit Types Are a Roadmap" },
    was: "The post said none of the 240 identifiers was marked deprecated, in its body and in an FAQ answer.",
    now: "Four are, each deprecated in iOS 14.0 or earlier. The body paragraph now says so under a dated correction note, and the FAQ answer no longer makes the claim.",
    how: "Found while re-checking HealthKit claims against the 2026-10-02 re-read, once the generator read Apple's deprecatedAt versions.",
  },
  {
    date: "2026-10-02",
    page: { href: "/datasets", label: "Open Datasets: Fitness & Health API Data" },
    was: "The HealthKit type identifiers dataset marked every identifier deprecated \"no\", and its appleDocs column linked all 120 category, characteristic and workout activity rows to a path under hkquantitytypeidentifier/, which Apple's site answers with a 404.",
    now: "Four rows read deprecated \"yes\", with new iosDeprecated, deprecationNote and renamedTo columns, and every appleDocs link uses its own family's path. The copies bundled in the MCP server and the data package were regenerated from it.",
    how: "Found on 2026-10-02 while regenerating the dataset. Every old and new appleDocs URL was requested from developer.apple.com: the 120 old category, characteristic and workout activity links returned 404, and all 241 new links returned 200.",
  },
  {
    date: "2026-10-02",
    page: { href: "/healthkit-identifiers", label: "Every HealthKit Type Identifier" },
    was: "The undocumented-types FAQ and section said the identifiers Apple ships with no abstract and no discussion were all quantity types introduced in iOS 18 (\"All three\"). From 2026-08-26, when category types joined the dataset, the list also held hypertensionEvent, a category type from iOS 26.2.",
    now: "Family and introducing version are computed from the dataset. As of the 2026-10-02 read: four quantity types and one category type — three from iOS 18.0, hypertensionEvent from iOS 26.2 and heartRateVariabilityRMSSD from iOS 27.0.",
    how: "Found while re-checking the page against the 2026-10-02 re-read of Apple's documentation.",
  },
  {
    date: "2026-10-02",
    page: { href: "/healthkit/nutrition", label: "HealthKit Nutrition: 39 Dietary Types" },
    was: "Nutrition was called the one group in the API where the sum-or-average question has a single answer for every member. Body measurements has one too: all seven of its types are discrete.",
    now: "Nutrition is the one group where every member is cumulative, which is what the sentence now says.",
    how: "Found while tabulating aggregation style per Apple group during the 2026-10-02 re-read.",
  },
  {
    date: "2026-10-02",
    page: { href: "/healthkit-versions", label: "HealthKit Types by iOS Version" },
    was: "The page said iOS 14.3 added three identifiers.",
    now: "It added four: contraceptive, lactation, lowCardioFitnessEvent and pregnancy.",
    how: "Found while re-checking every count on the page against the 2026-10-02 re-read.",
  },
  {
    date: "2026-10-02",
    page: { href: "/healthkit-units", label: "HKUnit Families by Quantity Type" },
    was: "The page said Apple names no unit for physicalEffort.",
    now: "Apple's page says its samples \"use power in Metabolic Equivalent of Task (METs) units\" — a unit named in a phrase, which the parser deliberately does not turn into a family. The unit-family field stays null; the prose now says why.",
    how: "Found by reading the evidence sentence stored beside the null during the 2026-10-02 re-check.",
  },
  {
    date: "2026-10-02",
    page: { href: "/blog/hrv-sdnn-vs-rmssd", label: "HRV: Apple Watch SDNN vs Health Connect RMSSD" },
    was: "The post said HealthKit and Health Connect both hand you an HRV summary and keep the beat-to-beat intervals, so deriving your own statistic is impossible from either.",
    now: "Each platform's HRV type is a summary, but HealthKit also documents HKHeartbeatSeriesSample (iOS 13.0), \"a sample that represents a series of heartbeats\", read with HKHeartbeatSeriesQuery. The post now says so.",
    how: "Found while re-checking the post's HRV claims against Apple's documentation on 2026-10-02.",
  },
  {
    date: "2026-09-01",
    page: { href: "/blog/react-native-health-stale", label: "Your HealthKit Bridge Last Shipped in 2024" },
    was: "The post stated the SDK release tracker's read date as 2026-08-31.",
    now: "The tracker re-ran on a schedule between writing and publish, moving its read date to 2026-09-01; the post now matches. No release fact changed.",
    how: "Caught while reconciling a push conflict against the CI commit that refreshed the tracker.",
  },
  {
    date: "2026-08-30",
    page: { href: "/healthkit-identifiers", label: "Every HealthKit Type Identifier" },
    was: "Ten published citation anchors pointed at row ids the table never rendered, so deep links landed at the top of the page.",
    now: "Every row renders its id; a build gate now fails if any published anchor stops resolving.",
    how: "Found by the FACTS-DEAD-ANCHOR gate when it was written — the defect predated the gate.",
  },
];

export type NearMiss = {
  date: string;
  what: string;
  caught: string;
};

export const NEAR_MISSES: NearMiss[] = [
  {
    date: "2026-08-28",
    what: "The first heuristic for matching a category type to its value enum resolved 29 of 30 and was wrong — a cross-linked symbol on the pregnancy page would have shipped the wrong enum.",
    caught: "Spot-checking the one type whose result looked too convenient, before publish. The shipped rule leaves 2 honest nulls instead.",
  },
  {
    date: "2026-08-28",
    what: "The unit regex excluded '/', so compound units like count/time resolved to nothing and heart rate would have rendered with no unit.",
    caught: "Reading the rendered table before publish; the widened rule takes resolved units to 116 of 120.",
  },
  {
    date: "2026-09-01",
    what: "An internal note claimed an intermediate enum-matching attempt resolved 17 of 30. A re-run could not reproduce 17 under four definitions of an exact match.",
    caught: "The writer assigned to cite it refused to, re-ran the heuristics, and the number was withdrawn before publish.",
  },
  {
    date: "2026-08-28",
    what: "Adding a second dataset to the same file inflated a row counter, which would have published an identifier count of 257 instead of 240.",
    caught: "The build's own row-count assertion failed the build.",
  },
];
