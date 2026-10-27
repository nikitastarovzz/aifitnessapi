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
    date: "2026-10-27",
    page: { href: "/motion/apple-vision-body-pose", label: "VNDetectHumanBodyPoseRequest: Apple Vision Body Pose on iOS" },
    was: "The page said Apple's documentation does not state a person-count limit for either body pose request, in either direction, and that it contains no fitness positioning and no statement of intended use cases.",
    now: "Apple's 2D article says VNDetectHumanBodyPoseRequest returns a unique observation for each detected human body pose, and its 3D article says VNDetectHumanBodyPose3DRequest supports only the most prominent person in the frame. The 2D article lists example uses, among them a fitness app that tracks the exercise a user performs, and gives qualitative accuracy advice. It still publishes no model card, accuracy figures or distance guidance.",
    how: "Found on 2026-10-27 while writing the Apple Vision vs MediaPipe comparison from Apple's articles \"Detecting Human Body Poses in Images\" and \"Identifying 3D human body poses in images\". The page had been written from the API reference pages, which link both articles; Apple's articles carry no dates, so we cannot show they changed after 2026-08-02 and log it as a correction rather than a source change. The page's review date stays 2026-08-02 because only these sentences were re-checked.",
  },
  {
    date: "2026-10-22",
    page: { href: "/pricing/exercise-database-api-pricing", label: "Exercise Database API Pricing: What Does It Cost?" },
    was: "The page said the free way into exercisedb.dev was a v2 playground that is not for production, that exercisedb.dev points production use to paid plans, and, in an FAQ answer, that exercisedb.dev was not one of the free exercise database APIs.",
    now: "exercisedb.dev now presents itself as AscendAPI, previously ExerciseDB, and its documentation describes two free tiers: ExerciseDB V1 serves 1,500 exercises with 180p GIFs with no authentication at oss.exercisedb.dev, and ExerciseDB V2 has a free Basic plan on RapidAPI with 2,000 requests a month and 200 exercises, with watermarked media. The page now leads with both, and says that the paid prices and the terms of use could not be read.",
    how: "Found on 2026-10-22, when a source-snapshot run reached exercisedb.dev and AscendAPI's documentation from a GitHub runner for the first time; on 2026-10-12 the claim had been written from the GitHub README alone. The documentation pages that describe the free tiers carry last-modified dates in March 2026, before the claim was published.",
  },
  {
    date: "2026-10-22",
    page: { href: "/fitness-apis/exercise-database-apis", label: "The Best Exercise Database APIs for Developers" },
    was: "The roundup said API Ninjas Exercises returns no images, GIFs or video, that its Exercises endpoint is premium-only on the Business or Professional plans, and, in an FAQ answer, that API Ninjas offers no free exercise endpoint.",
    now: "API Ninjas documents an images field of start and finish photos on premium plans, and a free key calls the Exercises API on a free plan that is for evaluation and demo only, without commercial use. Commercial use starts at the Developer plan; only the full-list endpoint, /v1/allexercises, needs the Business tier or an annual plan. It still serves no GIFs or video.",
    how: "Found on 2026-10-22, when a source-snapshot run read API Ninjas' Exercises and pricing pages. We cannot tell whether API Ninjas added the images field and the evaluation plan after the page went up on 2026-07-08 or the page was wrong from the start; it is logged because the page stated it as fact.",
  },
  {
    date: "2026-10-22",
    page: { href: "/alternatives/exercisedb-alternatives", label: "The Best ExerciseDB Alternatives" },
    was: "The page called API Ninjas Exercises metadata-only, with no GIFs, video or images.",
    now: "API Ninjas returns start and finish photos in an images field on premium plans; it still serves no GIFs or video.",
    how: "Same finding as the exercise database APIs roundup, on 2026-10-22.",
  },
  {
    date: "2026-10-18",
    page: { href: "/pricing/fitness-api-free-tiers-compared", label: "Fitness API Free Tiers Compared: What Free Actually Includes" },
    was: "The page counted 12 of the 25 items in its source dataset (48%) as free to call, a count that left Garmin out because the dataset then classed it contact-sales, and listed Strava as one of five free tiers that run out, with Standard-tier developers said to need a paid Strava subscription.",
    now: "14 of 25 (56%). Garmin and Strava are in the free-to-call table, quoting the dataset's re-verified gate and user-side text: Garmin's program FAQ says there are no licensing or maintenance fees for access to its program, which is only for business use, and Strava's API Agreement says access is currently provided at no charge, with a Strava subscription a prerequisite for creating an app. The free-tier list has the dataset's four free-tier-then-paid items, and a dated note beside the figure records the change.",
    how: "Found on 2026-10-18 while checking the page, which quotes the fitness-apis-2026 dataset verbatim, against the dataset as regenerated from the Garmin and Strava pages re-verified on 2026-10-17. It carried the two misclassifications logged below for the State of Fitness APIs 2026 report, and the site already said otherwise when it went up on 2026-08-12: the wearable data APIs comparison had listed Garmin as free to approved partners since 2026-07-08, and the Strava pricing page had said the API had no per-call developer fee since 2026-07-23.",
  },
  {
    date: "2026-10-18",
    page: { href: "/cost-planner", label: "Fitness API Cost Planner" },
    was: "The planner said Garmin does not publish pricing for its developer APIs at all and settles its commercial terms privately with approved partners, named Garmin in an FAQ answer among the APIs that need a sales call, and said roughly half of the market is contact-sales.",
    now: "Garmin's program FAQ says there are no licensing or maintenance fees for access, though some metrics may require a licence fee or a minimum device order for commercial use, at amounts Garmin does not publish. Garmin is no longer in the planner's sales checklist, and the prose no longer gives a contact-sales share.",
    how: "Found on 2026-10-18 while checking the page against Garmin's program FAQ, re-verified on 2026-10-17 by a source-snapshot run. The planner reads the cost model that carried the Garmin error logged below for the State of Fitness APIs 2026 report, and the site already said otherwise when the planner went up on 2026-08-11: since 2026-07-08 the wearable data APIs comparison had listed Garmin as free to approved partners. The share was never roughly half: the dataset behind the planner counted 4 of 25 items (16%) as contact-sales that day.",
  },
  {
    date: "2026-10-18",
    page: { href: "/compare/apple-watch-vs-garmin", label: "Apple Watch vs Garmin: Which Should You Build On?" },
    was: "The comparison said no Garmin price was confirmed, with \"no confirmation the program is free either\", that Garmin's commercial terms are settled privately with approved partners, and, in its table, that Garmin's developer cost was not publicly listed and that third-party mentions of a setup fee and premium-metric licensing appeared on no Garmin-owned page.",
    now: "Garmin's program FAQ says there are no licensing or maintenance fees for access to the Garmin Connect Developer Program, which is only for business use, and that access to some metrics may require a licence fee or a minimum device order for commercial use; Garmin does not publish those amounts. The table, the note under it and an FAQ answer now say so.",
    how: "Found on 2026-10-18 while checking the page against Garmin's program FAQ, re-verified on 2026-10-17 by a source-snapshot run. The site already said otherwise when the page went up on 2026-08-12: since 2026-07-08 the wearable data APIs comparison had listed Garmin as free to approved partners, and Fitbit API vs Garmin API had said both APIs were documented as free to use with approval.",
  },
  {
    date: "2026-10-18",
    page: { href: "/compare/strava-vs-garmin-connect", label: "Strava vs Garmin: Which API for Your App?" },
    was: "The comparison said an aggregator that normalizes Strava and Garmin behind one integration can sidestep both Garmin's approval gate and Strava's per-source rules.",
    now: "An aggregator does not sidestep Strava's rules. Strava's API Policy, effective June 1, 2026, prohibits operating, offering or facilitating an intermediary or aggregator that re-exposes the Strava API Materials to third parties, and the page now says so.",
    how: "Found on 2026-10-18 while checking the page against Strava's API Policy, re-verified on 2026-10-17 by a source-snapshot run. The policy took effect before the page went up on 2026-07-23, and the site's guide to adapting to Strava's API changes, published on 2026-07-20, already warned that aggregator-mediated Strava paths may be disallowed.",
  },
  {
    date: "2026-10-18",
    page: { href: "/pricing/are-fitness-apis-free", label: "Are Fitness APIs Free? An Honest Overview" },
    was: "The page said Garmin breaks the free-to-call pattern of first-party wearable APIs and is partner-approval-only with terms not publicly listed, repeated third-party reports of a setup fee, and said in an FAQ answer: \"Do not label Garmin free.\" A section added on 2026-10-13 said Garmin was the one product rated high engineering effort that was not free, classed contact-sales.",
    now: "Free to call, with conditions. Garmin's program FAQ says there are no licensing or maintenance fees for access to the Garmin Connect Developer Program, which is only for business use, and that access to some metrics may require a licence fee or a minimum device order for commercial use; Garmin does not publish those amounts. The section's count of the API directory was redone on 2026-10-18: 14 of its 24 products are free, and all five rated high effort, Garmin included, are among them.",
    how: "Found on 2026-10-18 while checking the page against the Garmin pages re-verified on 2026-10-17 from Garmin's program FAQ, fetched by a source-snapshot run. The site already said otherwise when the page went up on 2026-07-23: since 2026-07-08 the wearable data APIs comparison had listed Garmin as free to approved partners and said Garmin publishes no per-call fee and is documented as free to use. The contact-sales sentence repeated the API directory's Garmin row, the error logged below for the State of Fitness APIs 2026 report.",
  },
  {
    date: "2026-10-18",
    page: { href: "/pricing/are-fitness-apis-free", label: "Are Fitness APIs Free? An Honest Overview" },
    was: "The page said Strava breaks the free-to-call pattern of first-party wearable APIs, answered \"not unconditionally\" in its table on whether Strava is free to call, and listed Strava among the APIs that are not free, on reports that Standard-tier developers must hold a paid Strava subscription, with a reported US price.",
    now: "Free to call, with a subscription gate. Strava's API Agreement, effective June 1, 2026, says access is currently provided at no charge; its getting-started guide calls a Strava subscription a prerequisite for creating an app, and its API Policy makes Standard Tier apps subject to subscription requirements for the developer or specified end users. The subscription price is not on the Strava pages we read, so the page no longer gives one.",
    how: "Found on 2026-10-18 while checking the page against the Strava pages re-verified on 2026-10-17 from Strava's API Agreement, API Policy and getting-started guide, fetched by a source-snapshot run. The site's Strava pricing page, published the same day as this page, already said the Strava API had no per-call developer fee, and the API Agreement gives its effective date as June 1, 2026, before the page went up.",
  },
  {
    date: "2026-10-18",
    page: { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
    was: "The report classed Garmin's Health and Activity API as contact-sales, one of 4 such items (16%), and called Garmin the single first-party wearable API whose commercial terms are settled privately with approved partners.",
    now: "Free to call. Garmin's program FAQ says there are no licensing or maintenance fees for access to the Garmin Connect Developer Program, which is only for business use, and that access to some metrics may require a licence fee or a minimum device order for commercial use. The report now counts 14 of 25 items (56%) as free to call, and a dated revision note at the top lists every figure that moved.",
    how: "Found on 2026-10-17 while re-verifying the Garmin pages against Garmin's program FAQ, fetched by a source-snapshot run. The fact was already on this site when the report went up: the 2026-07-08 versions of the wearable data APIs comparison and of Fitbit API vs Garmin API said Garmin was documented as free to use with approval. The report's row followed the Garmin pricing page instead, which said Garmin did not publish its terms.",
  },
  {
    date: "2026-10-18",
    page: { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
    was: "The report classed the Strava API as free-tier-then-paid, one of 5 such items, and its layer table listed Strava as the one wearable API billed that way.",
    now: "Free to call. Strava's API Agreement says access is currently provided at no charge, and its getting-started guide calls a Strava subscription a prerequisite for creating an app, so the subscription is recorded as an approval gate rather than a developer fee. The revision note at the top of the report lists every figure that moved.",
    how: "Found on 2026-10-17 while re-verifying the Strava pages against Strava's API Agreement, API Policy and getting-started guide, fetched by a source-snapshot run. The report's own source, the 2026-07-23 version of the Strava pricing page, already said the API had no per-call developer fee and that the subscription it reported gated Standard-tier access, so the classification was wrong at publication.",
  },
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
    page: { href: "/fitbit-api-shutdown", label: "Fitbit Web API Retirement: Deadlines and the Migration Path" },
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
    date: "2026-10-18",
    page: { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
    was: "The report counted 12 of 25 items (48%) as approval-gated and recorded no gate for Terra, and its usage-billing finding said Terra carries no documented approval gate at all.",
    now: "13 of 25 (52%). Terra's docs say some providers \"require special processes before being able to start using them\" and name WHOOP, Dexcom, Huawei, Strava and Virtuagym, the same kind of own-credentials gate the report already recorded for Rook. A dated revision note at the top of the report lists every figure that moved, including Spike's move from contact-sales to usage-based, which it records as an update rather than a correction.",
    how: "Found on 2026-10-17 while re-verifying the aggregator pages against Terra's docs, fetched by a source-snapshot run. The gate was already on this site when the report went up: the 2026-08-02 versions of the aggregator comparison and of Terra vs Vital said some providers need your own developer credentials with Terra, so the dataset's empty field was wrong at publication.",
  },
  {
    date: "2026-10-18",
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
