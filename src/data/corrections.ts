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
    date: "2026-10-18",
    page: { href: "/fix/wearable-data-delayed", label: "Why Is Wearable Data Missing or Delayed?" },
    was: "The fix said to match the terra-reference header on your backfill request to the terra-signature on the eventual webhook.",
    now: "Terra's docs say the event it later sends to your webhook carries the same terra-reference as the initial request, and that is the value to match. terra-signature is the webhook's HMAC signature header, in the form t=timestamp,v1=signature.",
    how: "Found on 2026-10-17 while re-reading Terra's historical-data and webhook docs, fetched by a source-snapshot run, for the Terra integration guide.",
  },
  {
    date: "2026-10-18",
    page: { href: "/migrate/fitbit-web-api-to-google-health", label: "Migrating from the Fitbit Web API to the Google Health API" },
    was: "The guide named \"Thryve/Sahha\" as one vendor, in its section on aggregators as insulation and in an FAQ answer.",
    now: "Thryve and Sahha are separate companies. Thryve stays on the list of vendors reported to be preparing for the move, and Sahha has its own sentence: its integrations page says Fitbit data on Android reaches its SDK through Health Connect.",
    how: "Found on 2026-10-17 while writing the aggregator pages from both vendors' own sites, fetched by source-snapshot runs. Thryve's docs list Google Health as a data source and mark Fitbit as deprecating on October 29, 2026, which is why it stays on the list.",
  },
  {
    date: "2026-10-18",
    page: { href: "/fitbit-api-shutdown", label: "Fitbit API Shutdown: What's Confirmed for 2026" },
    was: "The page named \"Thryve/Sahha\" as one vendor, in its aggregator section and in an FAQ answer.",
    now: "Thryve and Sahha are separate companies. Thryve stays on the list of vendors reported to have been preparing, and Sahha has its own sentence: its integrations page says Fitbit data on Android reaches its SDK through Health Connect.",
    how: "Same finding as the Fitbit migration guide, found in a site-wide search for the same wording and corrected the same day.",
  },
  {
    date: "2026-10-18",
    page: { href: "/migrate/migrate-off-a-deprecated-fitness-api", label: "Migrate off a deprecated fitness API" },
    was: "The playbook listed \"Thryve/Sahha\" as one vendor among its aggregator examples.",
    now: "Thryve and Sahha are listed separately; they are different companies with their own sites and price sheets.",
    how: "Same finding as the Fitbit migration guide, corrected the same day.",
  },
  {
    date: "2026-10-17",
    page: { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
    was: "The report counted 12 of 25 items (48%) as approval-gated and recorded no gate for Terra, and its usage-billing finding said Terra carries no documented approval gate at all.",
    now: "13 of 25 (52%). Terra's docs say some providers \"require special processes before being able to start using them\" and name WHOOP, Dexcom, Huawei, Strava and Virtuagym, the same kind of own-credentials gate the report already recorded for Rook. A dated revision note at the top of the report lists every figure that moved, including Spike's move from contact-sales to usage-based, which it records as an update rather than a correction.",
    how: "Found on 2026-10-17 while re-verifying the aggregator pages against Terra's docs, fetched by a source-snapshot run. The gate was already on this site when the report went up: the 2026-08-02 versions of the aggregator comparison and of Terra vs Vital said some providers need your own developer credentials with Terra, so the dataset's empty field was wrong at publication.",
  },
  {
    date: "2026-10-17",
    page: { href: "/apis/terra", label: "Terra API: Access Requirements, Changes & Guides" },
    was: "The directory entry said: \"No approval gate is documented in the sources we checked, which is not the same as there being none.\"",
    now: "It records the gate as Terra's docs state it: some providers need a special setup process first, and the docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym.",
    how: "Same root cause as the State of Fitness APIs 2026 report: both read the same empty cost-model field. Found the same day.",
  },
  {
    date: "2026-10-17",
    page: { href: "/pricing/fitbit-api-pricing", label: "Fitbit API Pricing: What Does It Actually Cost?" },
    was: "The page said the consumer Google Health API's pricing and quota model was not clearly public, in its cost breakdown and in its FAQ on the migration.",
    now: "Google's Quotas and Rate Limits page publishes the default quotas: 86.4M requests a day and 120,000 a minute per project, and 300 a minute per user, with unverified apps capped at 100 users. The page now gives them and links the source. None of the Google Health API documentation pages we read states a price, so pricing stays could-not-verify.",
    how: "Found on 2026-10-17 while building the Google Health API reference from Google's documentation. The rate-limits page is marked last updated 2026-05-18, before the claim was published on 2026-07-23.",
  },
  {
    date: "2026-10-17",
    page: { href: "/fitbit-api-shutdown", label: "Fitbit Web API Retirement: Deadlines and the Migration Path" },
    was: "The confirmed-versus-reported table listed the Google Health API's pricing and quota model as could not verify, not clearly public.",
    now: "The row is split in two: the default quotas are confirmed from Google's Quotas and Rate Limits page, and pricing is still could not verify.",
    how: "Same finding as the Fitbit pricing page, on 2026-10-17. The row was published on 2026-08-11, after the rate-limits page's marked last update of 2026-05-18.",
  },
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
    page: { href: "/libraries/react-native-health", label: "Your HealthKit Bridge Last Shipped in 2024 (retired post; see the react-native-health page)" },
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
