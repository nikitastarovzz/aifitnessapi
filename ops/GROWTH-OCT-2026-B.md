# Wave B — new clusters and 30 changes for more visitors (October 2026)

Written 2026-10-03. Follows ops/GROWTH-OCT-2026.md (all 42 code items shipped).

## The rule this plan is built on

The only Search Console data (July) says one thing loudly: **exact developer
strings reach page one** — an endpoint path, a constant, an identifier, an
error string — while generic head terms sit at positions 40-90 behind
agencies and publishers. The HealthKit identifier reference is the site's
strongest asset for exactly that reason. So every new surface below is built
around strings developers paste into a search box, and only from sources this
sandbox can fetch.

Reachable on 2026-10-03 (probed): developer.apple.com (docs JSON, HIG, App
Store Review Guidelines), developer.android.com (guides and Jetpack
reference), registry.npmjs.org, pub.dev, pypi.org, raw.githubusercontent.com,
the GitHub API through `gh api`. Still blocked: framework docs (React Native,
Expo, Flutter, Capacitor), USDA/Open Food Facts, GPX/FIT specs, w3.org, vendor
API docs, support.google.com, api.npmjs.org (download counts).

## New clusters

1. **/health-connect — the Health Connect record reference.** The Android
   twin of the HealthKit reference: one page per record type (StepsRecord,
   HeartRateRecord, SleepSessionRecord…), each with Google's own description,
   fields and units, the exact read/write permission strings, aggregate
   metrics, and the HealthKit counterpart. Generated from the Jetpack
   reference by a script (row guard, evidence kept), never hand-typed.
   Plus a permissions page and an aggregate-metrics page.
2. **/libraries — open-source health and fitness SDKs.** One page per
   package (react-native-health, react-native-health-connect, Flutter
   `health`, Capacitor plugins, Python clients…), facts generated from the
   registries and the repo (latest version, publish date, licence, platforms,
   repo activity), plus editorial notes from each README. Comparison pages for
   the pairs people actually choose between. Refreshed weekly in CI with the
   same hold-back rule as the SDK tracker.
3. **/audio-coaching — audio cues, speech and ducking during a workout.**
   Cluster 22 as recorded in ops/BACKLOG.md: AVAudioSession categories and
   ducking, interruptions, AVSpeechSynthesizer, background audio, Android
   audio focus and TextToSpeech — the "my cue cuts the user's music" problem.

## 30 changes

### Health Connect (cluster 1)
1. Generator `scripts/fetch-health-connect-records.mjs` → `src/data/healthConnectRecords.ts` (expected-row guard, evidence sentences, nulls where Google says nothing).
2. `/health-connect/permissions` — every `android.permission.health.*` string, what it unlocks, its record.
3. `/health-connect/aggregate-metrics` — every aggregate metric constant (e.g. `StepsRecord.COUNT_TOTAL`) with its unit.
4. Two-way links: HealthKit group rows ↔ Health Connect record pages, from the verified matrix pairs only.
5. Health Connect records dataset (CSV/JSON, CC BY) in /datasets, the MCP server and the data package.
6. `/fix/health-connect-securityexception` — from Google's read/write exception tables.
7. `/fix/health-connect-not-available` — the SDK status values a device can return.
8. `/fix/health-connect-changes-token-expired` — expiry and the documented recovery.
9. One more Health Connect /fix page if (and only if) another documented failure string exists.

### Libraries (cluster 2)
10. Generator `scripts/fetch-libraries.mjs` → `src/data/libraries.ts` + weekly CI refresh with hold-back.
11. Package pages under `/libraries/<slug>`.
12. Comparison pages for the real choices (e.g. react-native-health vs @kingstinct/react-native-healthkit).
13. Link /libraries from the integrate, guides and /sdk-releases pages that name these packages.

### Audio coaching (cluster 3)
14. ~10 cluster pages from Apple and Android audio documentation.
15. Links in from /accessibility, /watch-apps and /engagement where audio is already discussed.

### Existing clusters
16. /compliance: one page per App Store Review Guideline a health or fitness app trips (quoted verbatim, revision date), the general page stays the overview.
17. /compliance: what Google requires to publish a Health Connect app (developer.android.com).
18. /watch-apps: WorkoutKit (custom workouts, scheduling) from Apple's docs.
19. /watch-apps: HKWorkoutSession and HKLiveWorkoutBuilder, including the iPhone workout session.
20. /watch-apps: Wear OS Health Services clients (exercise, passive monitoring, measure).
21. /engagement: Live Activities for an ongoing workout (ActivityKit) and starting a workout from Shortcuts/Siri (App Intents).
22. /data/menstrual-cycle-api already exists (shipped 2026-08-12): link its HealthKit and Health Connect mentions to the exact rows and the new record pages (links only, no stamp move).
23. /learn/what-is-rpe already exists, and says no health API exposes perceived effort — false: HealthKit has workoutEffortScore and estimatedWorkoutEffortScore (and HKWorkoutEffortRelationship) since iOS 18, with no abstract, scale or unit documented. Correct it and log the correction.
24. Glossary terms for the new concepts.

### Surfacing and plumbing
25. Homepage, header and footer surface the three clusters.
26. llms.txt, llms-full.txt, answers.json and the search index include them.
27. /questions indexes for the new FAQ sets.
28. Prerendered OG cards for every new route.
29. qa gates: Health Connect partition and row count, libraries row guard and freshness, cluster parity; uptime and responsive probes for the new surfaces.
30. Records: cluster selection in ops/BACKLOG.md, content-log lines, status here.

## Status

Shipped 2026-10-03 in one commit after tsc → build → qa (140 gates) went green.

**Wave B (items 1–30):**
- 1–5: /health-connect: 42 generated record pages, the permissions page (219 framework strings) and aggregate metrics; HK↔HC links limited to verified matrix rows; two CC BY datasets bundled into MCP and the package. Google's data-types page lists 42 classes, not 41, and its READ_EXERCISE_ROUTE disagrees with HealthPermissions' READ_EXERCISE_ROUTES; both are shown. /health-connect-records now redirects (308) to /health-connect.
- 6–9: four Health Connect /fix pages (SecurityException, SDK status, changes token expired, rate limit).
- 10–13: /libraries: 20 package pages and 5 comparisons, weekly CI with hold-back. GitHub signals stay null until libraries.yml first runs in CI.
- 14–15: /audio-coaching (cluster 22): a hub plus 12 spokes, with links in.
- 16–17: five App Store guideline pages and Google Play's Health Connect publishing requirements.
- 18–20: five code-level /watch-apps pages. The HKWorkoutSession vs ExerciseClient comparison was skipped because watch-platform-differences owns it.
- 21: three /engagement pages (ActivityKit, App Intents, Android Live Updates).
- 22–23: links on the menstrual-cycle page; the RPE correction is logged in /corrections.
- 24: 12 glossary terms.
- 25–30: wired site-wide, with gates and probes added.

**Wave C (items 1–30):**
- 1–10: /healthkit-queries, 9 spokes and a hub.
- 11–21: /phone-sensors, 10 spokes and a hub.
- 22: /error-codes/healthkit was NOT shipped because it duplicated /healthkit-errors. That page gained fix-guide links instead.
- 23: /error-codes/health-connect.
- 24: 12 /healthkit-versions/ios-N pages.
- 25: /health-connect-releases.
- 26–28: compliance pages for guidelines 3.1.3(d), 2.5.4 and 2.5.11.
- 29–30: wired site-wide, with gates ERROR-CODES-ROWS and HC-RELEASES-ROWS.

**After deploy:** run node scripts/backfill-published.mjs, run libraries.yml (workflow_dispatch), and do an IndexNow paths run for the new URLs.

## Wave C — 30 more additions (planned 2026-10-03)

Same rule: exact developer strings, only sources fetched this session. Probed
reachable on 2026-10-03: Apple docs JSON for every HealthKit query class,
HKError.Code and Core Motion; developer.android.com's Sensor reference, the
foreground-service-types page, Android 16 behaviour changes, the Recording API
guide and the androidx Health Connect release notes; the App Store Review
Guidelines (3.1.3(d) names "fitness training"; 2.5.4; 2.5.11 uses starting a
workout as its example).

### New cluster: /healthkit-queries — HealthKit query classes, one per page
1. Hub + cluster wiring (registry, seed, next.config CLUSTERS, header/footer/homepage).
2. HKSampleQuery.
3. HKStatisticsQuery.
4. HKStatisticsCollectionQuery (daily totals, anchor date, interval components).
5. HKAnchoredObjectQuery (anchors, deleted objects).
6. HKObserverQuery and enableBackgroundDelivery.
7. Swift async query descriptors (HKSampleQueryDescriptor, HKAnchoredObjectQueryDescriptor, HKStatisticsCollectionQueryDescriptor).
8. HKWorkoutRouteQuery (reading a workout's route).
9. HKActivitySummaryQuery (activity rings).
10. Predicates: predicateForSamples(withStart:end:options:) and HKSamplePredicate.

### New cluster: /phone-sensors — fitness from the phone's own sensors
11. Hub + cluster wiring.
12. CMPedometer.
13. CMMotionActivityManager.
14. CMAltimeter.
15. CMHeadphoneMotionManager.
16. CMBatchedSensorManager.
17. Android TYPE_STEP_COUNTER vs TYPE_STEP_DETECTOR.
18. Activity Recognition (transition API) and the ACTIVITY_RECOGNITION permission.
19. The Recording API on mobile.
20. foregroundServiceType="health" and FOREGROUND_SERVICE_HEALTH.
21. Android 16: body sensors move to Health Connect permissions (only what the behaviour-changes page states).

### Generated references
22. HKError.Code reference — generator from Apple's docs JSON, row guard, each code linked to its /fix page where one exists.
23. HealthConnectException error-code reference — same generator, from the platform reference.
24. HealthKit types by iOS version, one page per major release, computed from the existing identifier dataset (no new facts).
25. Health Connect Jetpack release tracker — generator from the androidx release notes, row guard.

### Store policy
26. App Store Guideline 3.1.3(d): person-to-person fitness training and in-app purchase.
27. App Store Guideline 2.5.4: background services for workout apps.
28. App Store Guideline 2.5.11: SiriKit and Shortcuts (the workout-intent example).

### Surfacing and records
29. Glossary terms; links in from existing pages (data/step-counting-api, integrate/healthkit, fix, guides/track-workouts-without-wearables, testing); homepage/header/footer, llms, search index, OG, /questions, sitemap; qa gates for the generators and cluster parity; uptime and responsive probes.
30. Records (BACKLOG, content-log, status here) and an IndexNow paths run for every new URL after deploy.
