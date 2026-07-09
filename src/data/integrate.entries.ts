import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED per-provider integration guides (do not hand-edit; regenerate
 * via scratchpad/assemble4.mjs). Code uses only real, documented endpoints/APIs;
 * migration/access-approval status is flagged per provider.
 */
export const integrateEntries: ClusterEntry[] =
[
  {
    "slug": "healthkit",
    "primaryQuery": "how to integrate Apple HealthKit",
    "h1": "How to Integrate Apple HealthKit (2026)",
    "metaTitle": "How to Integrate Apple HealthKit (2026)",
    "metaDescription": "Integrate Apple HealthKit in Swift: add the capability and Info.plist keys, request authorization, read steps, and get background updates on-device.",
    "updated": "2026-07-09",
    "answer": "Apple HealthKit gives your iOS app read and write access to the user's on-device health and fitness data, including steps, workouts, and heart rate, through a local store called HKHealthStore. It is not an OAuth cloud API and has no tokens or server endpoints: the user grants access in a system permission sheet and your Swift code reads the data directly on the device. To integrate it you add the HealthKit capability plus Info.plist usage-description keys, call requestAuthorization(toShare:read:), then query data with classes like HKStatisticsQuery. One critical caveat is that HealthKit never tells you whether read access was granted, so you must run the query and treat an empty result as no data or no permission.",
    "body": "Apple HealthKit gives your iOS app read and write access to the user's on-device health and fitness data — steps, workouts, heart rate, sleep, and dozens of other types — through a local, OS-managed store called `HKHealthStore`. Crucially, it is **not** an OAuth cloud API: there are no client secrets, tokens, or server endpoints. The user grants access in a system permission sheet, and your Swift code reads or writes the data directly on the device. This tutorial walks through wiring up the HealthKit capability, requesting authorization, reading step data, and getting background updates.\n\nHealthKit is free (no API fees) and iOS/iPadOS/watchOS/visionOS only — there is no cross-platform endpoint. If you also need Android, you integrate [Google Health Connect](/integrate/google-health-connect) separately; the two are compared side by side in [Apple HealthKit vs. Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect). Everything below is native iOS/Swift.\n\n> **Version note.** API signatures below are long-stable public HealthKit API, but a few initializers are version-gated (for example `HKQuantityType(.stepCount)` is iOS 16+). As of 2026, verify exact signatures against the current Apple docs before shipping.\n\n## What you'll need\n\n- An **Apple Developer account** and Xcode. HealthKit requires a paid membership to enable the capability and ship to devices.\n- A **physical device or a simulator with the Health app.** HealthKit data is not available on every target (notably some iPad configurations), so you must guard against it at runtime.\n- The **HealthKit capability** added to your app target, plus two Info.plist usage-description strings (below). Missing these is the most common first-run crash.\n\nThere is no app-registration or partner-approval step like a cloud fitness API — authorization happens entirely on the user's device. The only external gate is App Review, which checks that your usage-description strings are honest and that you actually use the data you request.\n\n## Step 1: Add the HealthKit capability and Info.plist keys\n\nIn Xcode, select your target, open **Signing & Capabilities**, and add the **HealthKit** capability. This provisions the entitlement your app needs to talk to `HKHealthStore`.\n\nThen add usage-description strings to your Info.plist. These are the text the system shows the user in the permission sheet, and they are mandatory:\n\n- **`NSHealthShareUsageDescription`** — required if you **read** any health data.\n- **`NSHealthUpdateUsageDescription`** — required if you **write / share** any health data.\n\n```xml\n<!-- Info.plist -->\n<key>NSHealthShareUsageDescription</key>\n<string>We read your step count to show your daily activity progress.</string>\n<key>NSHealthUpdateUsageDescription</key>\n<string>We save completed workouts to your Health app.</string>\n```\n\nIf you call the authorization API without the matching key present, the app **crashes** rather than showing a sheet — so add both keys for whichever operations you support before writing any code.\n\n## Step 2: Check availability and request authorization\n\nEverything starts with a single `HKHealthStore` instance. Before touching it, guard with the static **`HKHealthStore.isHealthDataAvailable()`**, which returns false on unsupported devices. Then call **`requestAuthorization(toShare:read:)`** with the set of types you want to write (`Set` of `HKSampleType`) and the set you want to read (`Set` of `HKObjectType`).\n\n```swift\nimport HealthKit\n\nlet healthStore = HKHealthStore()\n\nfunc requestAuth() async throws {\n    guard HKHealthStore.isHealthDataAvailable() else { return }\n\n    let stepType = HKQuantityType(.stepCount)          // iOS 16+ initializer\n    let toRead: Set<HKObjectType> = [stepType]\n    let toShare: Set<HKSampleType> = [stepType]\n\n    // Presents the system permission sheet.\n    try await healthStore.requestAuthorization(toShare: toShare, read: toRead)\n}\n```\n\nThe `async` form shown here is iOS 15+. Older code uses the completion-handler variant `requestAuthorization(toShare:read:completion:)`; either is fine. On older OS versions you can also build the step type with `HKObjectType.quantityType(forIdentifier: .stepCount)` instead of the `HKQuantityType(.stepCount)` initializer.\n\n## Step 3: Understand the read-denial caveat (important)\n\nThis is the single most misunderstood part of HealthKit, so handle it deliberately. To avoid leaking whether a person has health data at all, **the system does not tell you whether the user granted or denied READ access.** `authorizationStatus(for:)` reliably reflects only **write / share** status; for read types it typically returns `.notDetermined` even after the user grants access.\n\nThe consequence: `requestAuthorization` succeeding means \"the sheet was shown,\" **not** \"read was granted.\" Never gate your UI on read-authorization status. The documented pattern is to **just run the query and treat an empty result as \"no data or no permission\"** — the two are indistinguishable, and that is by design. Build your UI to degrade gracefully when a query comes back empty.\n\n## Step 4: Read today's step count\n\nFor a running total like steps, use **`HKStatisticsQuery`** with the `.cumulativeSum` option (rather than summing raw samples yourself). Scope it with a date predicate so you only aggregate today's data:\n\n```swift\nfunc readTodaySteps() {\n    let stepType = HKQuantityType(.stepCount)\n    let startOfDay = Calendar.current.startOfDay(for: Date())\n    let predicate = HKQuery.predicateForSamples(\n        withStart: startOfDay, end: Date(), options: .strictStartDate)\n\n    let query = HKStatisticsQuery(\n        quantityType: stepType,\n        quantitySamplePredicate: predicate,\n        options: .cumulativeSum\n    ) { _, statistics, error in\n        guard let sum = statistics?.sumQuantity() else {\n            // Empty == no data OR read permission not granted (indistinguishable).\n            return\n        }\n        let steps = sum.doubleValue(for: HKUnit.count())\n        print(\"Steps today: \\(steps)\")\n    }\n    healthStore.execute(query)\n}\n```\n\nIf you need the individual raw samples instead of an aggregate — for example to inspect timestamps or the source app — use **`HKSampleQuery`** with the same predicate. For per-workout rep and form data that HealthKit does not capture, pair this with an on-device motion pipeline; the [AI workout tracking on iOS with Swift guide](/guides/ai-workout-tracking-ios-swift) walks through that side.\n\n## Step 5: Get background updates with HKObserverQuery\n\nPolling drains battery. To react when new data lands, register an **`HKObserverQuery`** and turn on **`enableBackgroundDelivery(for:frequency:withCompletion:)`**. The observer's completion handler **must** be called or the OS stops delivering updates.\n\n```swift\nfunc startObservingSteps() {\n    let stepType = HKQuantityType(.stepCount)\n\n    let observer = HKObserverQuery(sampleType: stepType, predicate: nil) {\n        _, completionHandler, error in\n        // Fetch new data here (e.g. an HKAnchoredObjectQuery), then:\n        completionHandler()   // MUST call, or the OS stops delivering updates.\n    }\n    healthStore.execute(observer)\n\n    healthStore.enableBackgroundDelivery(\n        for: stepType, frequency: .immediate) { success, error in\n        // .immediate / .hourly / .daily via HKUpdateFrequency; delivery is OS-throttled.\n    }\n}\n```\n\nFrequency is chosen from `HKUpdateFrequency` (`.immediate`, `.hourly`, `.daily`). Note that background delivery is **budgeted and throttled** by the OS — you will not get literal real-time firing, and the actual cadence depends on system conditions. Design around eventual delivery, not guaranteed timing.\n\n## Gotchas and production notes\n\n- **Read denial is invisible.** Repeating the Step 3 point because it bites everyone: never assume an empty query means \"no data.\" Always handle empty results as a valid, expected state.\n- **Both Info.plist keys or a crash.** Add `NSHealthShareUsageDescription` for reads and `NSHealthUpdateUsageDescription` for writes before your first authorization call.\n- **Availability first.** Guard every entry point with `HKHealthStore.isHealthDataAvailable()`; it is false on unsupported devices and your queries will otherwise fail silently.\n- **Aggregate, don't hand-sum, for cumulative types.** `HKStatisticsQuery` with `.cumulativeSum` avoids double-counting when multiple sources (phone plus watch) write steps.\n- **App Review scrutinizes health usage.** Your usage-description strings must accurately describe what you do with the data, and you should request only the types you genuinely use.\n- **Background delivery is throttled.** Treat `HKObserverQuery` plus `enableBackgroundDelivery` as best-effort, and always call the completion handler.\n- **Version-gate the volatile bits.** `HKQuantityType(.stepCount)` is iOS 16+; fall back to `HKObjectType.quantityType(forIdentifier:)` on older targets, and verify current signatures in Apple's docs before release.",
    "faqs": [
      {
        "q": "Does Apple HealthKit use OAuth or API keys?",
        "a": "No. HealthKit is an on-device, permission-based framework, not a cloud API. There are no client secrets, access tokens, refresh flows, or server endpoints. The user grants access in a native system permission sheet and your app reads or writes a local, OS-managed store directly. The only credential you need is a paid Apple Developer account to enable the capability and ship the app."
      },
      {
        "q": "Why can't I tell whether the user granted read permission?",
        "a": "This is intentional. To avoid leaking whether a person has any health data, HealthKit does not report read-authorization status. authorizationStatus(for:) reliably reflects only write/share access; for read types it typically returns notDetermined even after a grant. The documented pattern is to run your query and treat an empty result as no data or no permission, since the two are indistinguishable by design."
      },
      {
        "q": "Does HealthKit work on Android or on the web?",
        "a": "No. HealthKit is limited to Apple platforms (iOS, iPadOS, watchOS, visionOS) and there is no cross-platform server endpoint. For Android you integrate Google Health Connect, which is a separate on-device framework with its own SDK, permissions model, and quirks such as a default 30-day history window."
      },
      {
        "q": "Why does my app crash the first time I request authorization?",
        "a": "Almost always a missing Info.plist usage-description key. HealthKit requires NSHealthShareUsageDescription to read data and NSHealthUpdateUsageDescription to write data. If you call requestAuthorization without the key that matches your operation, the app crashes instead of showing the permission sheet, so add both keys for whatever you support before running the flow."
      },
      {
        "q": "How should I read step totals without double-counting?",
        "a": "Use HKStatisticsQuery with the cumulativeSum option rather than fetching raw samples and adding them yourself. When multiple sources such as an iPhone and an Apple Watch both write steps, aggregating through the statistics query avoids double-counting. Verify version-gated details like the HKQuantityType(.stepCount) initializer, which is iOS 16+, against current Apple docs."
      }
    ],
    "related": [
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/guides/ai-workout-tracking-ios-swift",
        "label": "AI workout tracking on iOS"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We break down on-device health frameworks and fitness APIs every week; join the newsletter to wire HealthKit and motion tracking into your iOS app the right way."
    },
    "steps": [
      {
        "name": "Add the HealthKit capability and Info.plist keys",
        "text": "In Xcode add the HealthKit capability under Signing and Capabilities, then add the NSHealthShareUsageDescription key for reading and NSHealthUpdateUsageDescription for writing. Missing the matching key crashes the app on the authorization call."
      },
      {
        "name": "Check availability and request authorization",
        "text": "Guard with HKHealthStore.isHealthDataAvailable(), then call requestAuthorization(toShare:read:) with the sets of types you want to write and read. Success means the sheet was shown, not that access was granted."
      },
      {
        "name": "Handle the read-denial caveat",
        "text": "For privacy, HealthKit does not report whether read access was granted, so authorizationStatus(for:) is reliable only for write types. Never gate UI on read status; run the query and treat an empty result as no data or no permission."
      },
      {
        "name": "Read today's step count",
        "text": "Use HKStatisticsQuery with the cumulativeSum option and a date predicate to aggregate the day's steps, or HKSampleQuery for individual raw samples. Read the total from the returned sum quantity in count units."
      },
      {
        "name": "Get background updates",
        "text": "Register an HKObserverQuery and call enableBackgroundDelivery(for:frequency:withCompletion:) to react to new data without polling. Always call the observer's completion handler or the OS stops delivering updates."
      }
    ]
  },
  {
    "slug": "google-health-connect",
    "primaryQuery": "how to integrate Google Health Connect",
    "h1": "How to Integrate Google Health Connect (2026)",
    "metaTitle": "How to Integrate Google Health Connect (2026)",
    "metaDescription": "Integrate Google Health Connect on Android: add the connect-client library, request on-device permissions, read steps, pass the Play Console review.",
    "updated": "2026-07-09",
    "answer": "Google Health Connect gives Android apps on-device access to health and fitness data (steps, heart rate, sleep, calories, and more) from a single OS-managed store. It is not an OAuth cloud API: the user grants access in a system permission sheet and your Kotlin code reads records locally through the androidx.health.connect:connect-client library. It is free and Android-only. The one hard requirement before shipping is a Play Console health-data declaration listing every data type you read or write.",
    "body": "Google Health Connect gives your Android app on-device access to the user's health and fitness data — steps, distance, heart rate, sleep, calories, and dozens of other record types — from a single OS-managed store that other apps (Fitbit, Samsung Health, Google Fit, and more) write into. It is **not** an OAuth cloud API: there is no client secret, no token exchange, and no server endpoint. The user grants access in a system permission sheet, and your Kotlin code reads records locally through the `androidx.health.connect:connect-client` library. It is free to use, Android-only, and the main friction is a mandatory Play Console data-type declaration before you can ship.\n\nIf you also need iOS, Health Connect is the Android half of a two-platform job — see [Apple HealthKit vs. Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect) for how the two compare, because you integrate each SDK natively and there is no shared endpoint between them.\n\n## What you'll need\n\n- **An Android app** targeting a reasonably recent SDK. On Android 14 and later Health Connect is part of the platform; on older versions it is a separate app the user installs from the Play Store.\n- **The Health Connect app present on the device.** Your code should check availability and route the user to install or update it if it is missing.\n- **The `connect-client` Jetpack dependency** (add it to your module's `build.gradle`).\n- **A Play Console health-data declaration** listing every data type you read or write. This is a publishing requirement — plan for it, because reviews can take time.\n\n> **Verify the library version.** The Jetpack library updates frequently. Pin whatever the current stable (or intended alpha) release is from the official docs rather than copying a version string from any tutorial, including this one.\n\n```groovy\n// build.gradle (module) — check the docs for the current version\ndependencies {\n    implementation \"androidx.health.connect:connect-client:<latest-version>\"\n}\n```\n\n## Step 1: Declare your permissions in the manifest\n\nEvery health data type you touch is its own permission. Declare each one in `AndroidManifest.xml`. If you need history older than the default window (covered in Step 5), declare that permission too.\n\n```xml\n<!-- AndroidManifest.xml -->\n<uses-permission android:name=\"android.permission.health.READ_STEPS\"/>\n<uses-permission android:name=\"android.permission.health.WRITE_STEPS\"/>\n<!-- Only if you need data older than ~30 days: -->\n<uses-permission android:name=\"android.permission.health.READ_HEALTH_DATA_HISTORY\"/>\n```\n\nAt runtime you refer to these same permissions as typed strings derived from the record class, not raw manifest names — for example `HealthPermission.getReadPermission(StepsRecord::class)`. Keep the manifest list and your runtime set in sync; a permission requested at runtime but missing from the manifest will not be grantable.\n\n## Step 2: Check availability and get the client\n\nNever assume Health Connect is installed. Call `HealthConnectClient.getSdkStatus(context)` and compare it against `HealthConnectClient.SDK_AVAILABLE`. Only then create the client with `HealthConnectClient.getOrCreate(context)`. If the SDK is unavailable, send the user to install or update the Health Connect app.\n\n```kotlin\nimport androidx.health.connect.client.HealthConnectClient\n\nval status = HealthConnectClient.getSdkStatus(context)\nval healthConnectClient =\n    if (status == HealthConnectClient.SDK_AVAILABLE) {\n        HealthConnectClient.getOrCreate(context)\n    } else {\n        // SDK_UNAVAILABLE or SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED —\n        // prompt the user to install or update Health Connect, then stop.\n        null\n    }\n```\n\n## Step 3: Request permissions at runtime\n\nBuild the set of permissions you need as typed strings, then request them through the Health Connect permission contract. Unlike a runtime dangerous-permission dialog, this uses `PermissionController.createRequestPermissionResultContract()` with an Activity Result launcher (or `rememberLauncherForActivityResult` in Compose). The callback hands you the set of **granted** permissions, so you check whether it contains everything you asked for.\n\n```kotlin\nimport androidx.health.connect.client.PermissionController\nimport androidx.health.connect.client.permission.HealthPermission\nimport androidx.health.connect.client.records.StepsRecord\n\nval permissions = setOf(\n    HealthPermission.getReadPermission(StepsRecord::class),\n    HealthPermission.getWritePermission(StepsRecord::class)\n)\n\n// Compose example\nval requestPermissions = rememberLauncherForActivityResult(\n    contract = PermissionController.createRequestPermissionResultContract()\n) { granted ->\n    if (granted.containsAll(permissions)) {\n        // Proceed — every requested permission was granted.\n    } else {\n        // User denied one or more. Degrade gracefully; do not re-prompt in a loop.\n    }\n}\n\n// Launch when the user taps \"Connect\":\n// requestPermissions.launch(permissions)\n```\n\nNote the difference from HealthKit here: Health Connect **does** tell you which permissions were granted, so you can branch on the actual result instead of guessing.\n\n## Step 4: Read the user's data\n\nWith permission granted, read records inside a coroutine using `readRecords(ReadRecordsRequest(...))`, scoped by a `TimeRangeFilter`. Every read returns a list of typed record objects.\n\n```kotlin\nimport androidx.health.connect.client.request.ReadRecordsRequest\nimport androidx.health.connect.client.time.TimeRangeFilter\nimport java.time.Instant\n\nsuspend fun readSteps(start: Instant, end: Instant): List<StepsRecord> {\n    val client = healthConnectClient ?: return emptyList()\n    val response = client.readRecords(\n        ReadRecordsRequest(\n            StepsRecord::class,\n            timeRangeFilter = TimeRangeFilter.between(start, end)\n        )\n    )\n    return response.records\n}\n```\n\nFor a **step total**, prefer `aggregate()` with `StepsRecord.COUNT_TOTAL` over summing raw records yourself. Multiple apps can write steps for the same window, and raw reads will double-count overlapping sources; the aggregate query de-duplicates for you.\n\n```kotlin\nimport androidx.health.connect.client.request.AggregateRequest\n\nsuspend fun readStepTotal(start: Instant, end: Instant): Long {\n    val client = healthConnectClient ?: return 0L\n    val response = client.aggregate(\n        AggregateRequest(\n            metrics = setOf(StepsRecord.COUNT_TOTAL),\n            timeRangeFilter = TimeRangeFilter.between(start, end)\n        )\n    )\n    return response[StepsRecord.COUNT_TOTAL] ?: 0L\n}\n```\n\n## Step 5: Handle the 30-day history limit\n\nBy default, a freshly granted app can read only data from **up to 30 days before** the first permission grant. Reads that reach further back will error out. To read older history you must request the dedicated history permission — as of 2026 the constant is `HealthPermission.PERMISSION_READ_HEALTH_DATA_HISTORY` (verify the exact name and its `READ_HEALTH_DATA_HISTORY` manifest string against current docs, as these have shifted). This is separate from the background-read permission, which controls whether you can read while your app is backgrounded.\n\nOne more sharp edge: reinstalling your app **resets** the 30-day window, so a returning user's deep history becomes unavailable again until they re-grant (and you hold the history permission). Design onboarding so a user without the history permission still gets a useful recent view.\n\n## Step 6: Complete the Play Console declaration and ship\n\nBefore your app can be published with Health Connect access, you must fill out the **health-data declaration** in the Play Console, listing every data type you read and write and justifying each. This is a policy gate, not a formality — omitting a type you actually read, or requesting types you cannot justify, causes rejections. Do this early so review time does not block your release.\n\nProduction notes to plan for:\n\n- **Availability drift.** Users can uninstall Health Connect or revoke a permission at any time. Re-check `getSdkStatus` and handle empty or error responses on every read, not just at first launch.\n- **Grant the minimum.** Request only the record types your feature needs. A shorter declaration is easier to justify in review and easier for users to trust.\n- **Data types are typed classes.** `StepsRecord` is one of dozens (`HeartRateRecord`, `SleepSessionRecord`, `TotalCaloriesBurnedRecord`, and more). Each read and write permission is per-class, so scope your request set deliberately.\n- **Backgrounded reads need their own permission.** If you sync in the background, add the background-read permission on top of your data-type permissions.\n\nOnce step and workout data is flowing, wiring it into a live tracking experience is the next step — [add AI workout tracking on Android with Kotlin](/guides/ai-workout-tracking-android-kotlin) walks through turning that data (plus on-device pose tracking) into rep counting and form feedback. For the broader landscape of device and health-data sources, see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview.",
    "faqs": [
      {
        "q": "Does Google Health Connect use OAuth or an API key?",
        "a": "No. Health Connect is on-device and permission-based, not a cloud API. There is no client secret, token exchange, or server endpoint. The user grants access in a system permission sheet and your app reads from a local, OS-managed store through the connect-client library."
      },
      {
        "q": "Do I need approval to use Health Connect?",
        "a": "There is no OAuth partner-approval step to read data during development. However, to publish an app that uses Health Connect you must complete the Play Console health-data declaration listing every data type you read or write, and requesting types you cannot justify can cause review rejections. Treat that declaration as a required gate before release."
      },
      {
        "q": "Why can I only read the last 30 days of data?",
        "a": "By default an app can read data from up to 30 days before the first permission grant, and reinstalling the app resets that window. To read older history you must request the dedicated read-health-data-history permission. As of 2026 verify the exact constant name and its manifest string against the current docs, since these have changed."
      },
      {
        "q": "Which library and version should I use?",
        "a": "Use the androidx.health.connect:connect-client Jetpack library. It updates frequently, so pin the current stable or intended release from the official Health Connect docs rather than copying a version from a tutorial. The class and method names such as HealthConnectClient.getOrCreate and readRecords are stable across recent versions."
      },
      {
        "q": "Is Health Connect available on all Android devices?",
        "a": "No. On Android 14 and later it is part of the platform, while on older versions it is a separate app the user installs from the Play Store. Always check HealthConnectClient.getSdkStatus and prompt the user to install or update Health Connect when it is unavailable, rather than assuming it is present."
      }
    ],
    "related": [
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/guides/ai-workout-tracking-android-kotlin",
        "label": "AI workout tracking on Android"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "Wiring Health Connect into an Android app and weighing how it fits with wearables and iOS? Get our practical fitness and health API breakdowns in your inbox."
    },
    "steps": [
      {
        "name": "Declare your permissions in the manifest",
        "text": "Add each health data type you read or write as its own permission in AndroidManifest.xml, plus the history permission if you need older data. Keep this list in sync with the typed permissions you request at runtime."
      },
      {
        "name": "Check availability and get the client",
        "text": "Call HealthConnectClient.getSdkStatus to confirm Health Connect is installed and available, then create the client with HealthConnectClient.getOrCreate. If it is unavailable, route the user to install or update the Health Connect app."
      },
      {
        "name": "Request permissions at runtime",
        "text": "Build a set of typed permissions and request them with PermissionController.createRequestPermissionResultContract via an Activity Result launcher. Check that the returned granted set contains everything you asked for before reading."
      },
      {
        "name": "Read the user's data",
        "text": "Read records in a coroutine using readRecords with a ReadRecordsRequest scoped by a TimeRangeFilter. For totals like steps, prefer aggregate with COUNT_TOTAL so overlapping data sources are not double-counted."
      },
      {
        "name": "Handle the 30-day history limit",
        "text": "By default an app can only read data from up to 30 days before the first grant, and reinstalling resets that window. To read older data, request the dedicated read-health-data-history permission and verify its current constant name in the docs."
      },
      {
        "name": "Complete the Play Console declaration and ship",
        "text": "Fill out the Play Console health-data declaration listing every data type you access, since it is a policy gate for publishing. Re-check availability on every read and request only the record types your feature needs."
      }
    ]
  },
  {
    "slug": "fitbit-api",
    "primaryQuery": "how to integrate the Fitbit API",
    "h1": "How to Integrate the Fitbit API (2026)",
    "metaTitle": "How to Integrate the Fitbit API (2026 Guide)",
    "metaDescription": "Integrate the Fitbit API with OAuth 2.0 and PKCE — plus the critical 2026 migration to Google Health you must plan for before you build. Verify docs.",
    "updated": "2026-07-09",
    "answer": "The Fitbit Web API returns a user's activity, steps, heart rate, sleep, and profile data after they authorize your app over OAuth 2.0 (authorization-code grant, PKCE recommended). You register an app, send the user through Fitbit's authorize page, exchange the code for a Bearer access token, and call the REST API with it. Critically, the legacy Fitbit Web API is being turned down around September 2026 (exact day TBD, verify) and replaced by the Google Health API using Google OAuth 2.0 — tokens do not transfer and users must re-consent, so new integrations should target Google Health directly.",
    "body": "The Fitbit Web API gives your app a user's Fitbit-account data — daily activity and steps, heart rate, sleep, and profile — after that user authorizes you over `OAuth 2.0` (authorization-code grant, PKCE recommended). The one-line \"how\": register an app, send the user through Fitbit's authorize page, exchange the returned code for a Bearer access token, and call the REST API with that token. Before you write a line of code, though, read the migration warning below — it changes what you should build.\n\n## Read this first: the legacy Fitbit Web API is being turned down\n\nGoogle, which owns Fitbit, has announced \"the next phase of the Fitbit Web API\": the legacy Fitbit Web API described on this page is being retired and replaced by the new **Google Health API**, which uses **Google `OAuth 2.0`** instead of Fitbit's own authorization server. The turndown is targeted for around **September 2026** — the exact day in that month is still to be confirmed by Google, so verify it against the current docs before you plan around it.\n\nThe critical detail for developers: existing Fitbit access tokens and refresh tokens **do not transfer** to the Google Health API and will not work there. Every user must actively re-consent through Google `OAuth 2.0`.\n\n> **Migration callout (verify against current docs).** If you are starting a NEW integration in 2026, target the **Google Health API** (`https://developers.google.com/health`) with Google `OAuth 2.0` directly — do not build fresh on the legacy Fitbit Web API, which is short-lived. The legacy turndown is targeted for around September 2026 (exact day TBD). Tokens do not migrate; users re-consent. Use the legacy flow below only for an existing integration you must keep running until turndown, and plan a phased re-consent path onto Google Health. Confirm the current timeline and GA date on the Google Health API pages.\n\nWith that context set, the rest of this guide covers the legacy Fitbit Web API `OAuth 2.0` flow — useful for maintaining an existing integration through the transition. For a broader look at how Fitbit compares in this space, see [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) and the [wearable data APIs](/fitness-apis/wearable-data-apis) overview.\n\n## What you'll need\n\n- A **Fitbit (or Google) account** to sign in to the developer portal.\n- A registered app at `https://dev.fitbit.com`, which gives you a **Client ID** and (for server apps) a **Client Secret**.\n- A **redirect/callback URL** under your control to receive the authorization code.\n- For minute- or second-level **intraday** data (heart rate, steps), a separate approval — see the last step.\n\n## Step 1: Register your app\n\nSign in at `https://dev.fitbit.com` and choose \"Register an App.\" The important field is the **OAuth 2.0 Application Type**, which governs how you authenticate:\n\n- **Client** — mobile apps or single-page apps that omit the Client Secret. These **must use PKCE**.\n- **Server** — confidential backends that authenticate with the Client Secret. PKCE is still recommended.\n- **Personal** — required to access **intraday** data for your own account without extra approval.\n\nSet your Callback URL and the default scopes you plan to request. You will receive a **Client ID**, and server/confidential apps also get a **Client Secret**. Note that Fitbit does not let you force users to grant every scope — the user chooses per data collection.\n\n## Step 2: Generate a PKCE pair and redirect the user to authorize\n\nFor public (Client) apps, create a PKCE pair first. The `code_verifier` is a cryptographically random string of 43 to 128 characters; the `code_challenge` is the BASE64URL-encoded SHA-256 hash of that verifier, sent with `code_challenge_method=S256`.\n\nThen send the user to Fitbit's authorize endpoint. The documented scopes include `activity`, `heartrate`, `sleep`, and `profile` (the full set also covers `location`, `nutrition`, `oxygen_saturation`, `respiratory_rate`, `settings`, `social`, `temperature`, and `weight` — verify the current list in the docs).\n\n```http\nGET https://www.fitbit.com/oauth2/authorize\n  ?client_id=CLIENT_ID\n  &response_type=code\n  &scope=activity%20heartrate%20sleep%20profile\n  &code_challenge=CODE_CHALLENGE\n  &code_challenge_method=S256\n  &state=RANDOM_STATE\n  &redirect_uri=https%3A%2F%2Fyourapp.example.com%2Fcallback\n```\n\nOn approval, Fitbit redirects back to your `redirect_uri` with `?code=AUTH_CODE&state=RANDOM_STATE`. Always check that the returned `state` matches the value you sent.\n\n## Step 3: Exchange the authorization code for tokens\n\nPOST the authorization code to Fitbit's token endpoint. Public (Client) apps authenticate with the `client_id` plus the PKCE `code_verifier` and no secret:\n\n```bash\ncurl -X POST \"https://api.fitbit.com/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=AUTH_CODE\" \\\n  -d \"code_verifier=CODE_VERIFIER\" \\\n  -d \"redirect_uri=https://yourapp.example.com/callback\"\n```\n\nConfidential (Server) apps additionally send an HTTP Basic auth header instead of relying only on PKCE:\n`-H \"Authorization: Basic BASE64(client_id:client_secret)\"`.\n\nA successful response returns JSON with the Bearer token you will use for all API calls:\n\n```json\n{\n  \"access_token\": \"eyJ...\",\n  \"expires_in\": 28800,\n  \"refresh_token\": \"c643...\",\n  \"scope\": \"activity heartrate sleep profile\",\n  \"token_type\": \"Bearer\",\n  \"user_id\": \"ABC123\"\n}\n```\n\nThe `expires_in` value of 28800 seconds (8 hours) is the commonly documented lifetime — verify the current value against the docs.\n\n## Step 4: Fetch data with the Bearer token\n\nCall the REST API with `Authorization: Bearer ACCESS_TOKEN`. In the path, `-` means \"the authenticated user\" (`user/-`) and the leading `1` is the API version. Here is a daily activity summary:\n\n```bash\ncurl -X GET \"https://api.fitbit.com/1/user/-/activities/date/2026-07-08.json\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nAnd a steps time series covering the 30 days ending on a date:\n\n```bash\ncurl -X GET \"https://api.fitbit.com/1/user/-/activities/steps/date/2026-07-08/30d.json\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nResponses are `application/json`. Sleep, heart rate, and profile follow the same `user/-` pattern under their own resource paths.\n\n## Step 5: Refresh tokens before they expire\n\nAccess tokens are short-lived, so refresh with the stored `refresh_token` to get a new access token without sending the user back through consent:\n\n```bash\ncurl -X POST \"https://api.fitbit.com/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=REFRESH_TOKEN\" \\\n  -d \"client_id=CLIENT_ID\"\n```\n\nConfidential apps include the same HTTP Basic auth header used in Step 3. Persist the returned tokens and refresh proactively (for example, shortly before expiry) rather than waiting for a 401.\n\n## Step 6: Handle rate limits and request intraday access\n\nTwo production limits matter most:\n\n- **Rate limit: 150 API requests per hour, per consented user.** The counter resets around the top of each hour and applies to all calls made with a given user's access token. Over the limit returns **HTTP 429** with a header indicating seconds until reset (commonly `Retry-After` or a `Fitbit-Rate-Limit-Reset` header — verify the exact name in the docs). Back off and retry after the reset rather than hammering the endpoint.\n- **Intraday data requires special approval.** Minute- or second-level series (for example steps or heart rate) are available by default only to **Personal** apps for their own data. Other app types must request intraday access from Fitbit/Google. Intraday requests are also limited to a 24-hour window per request; wider date ranges return summary data only.\n\nAn intraday steps request (1-minute detail, requires approval) looks like this:\n\n```bash\ncurl -X GET \"https://api.fitbit.com/1/user/-/activities/steps/date/2026-07-08/1d/1min.json\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\n## Gotchas and production notes\n\n- **Plan for the migration now.** The single biggest risk with any legacy Fitbit integration in 2026 is the targeted ~September turndown. Do not start new builds here; if you are maintaining an existing one, build a phased re-consent flow onto the Google Health API and Google `OAuth 2.0` before the deadline. Verify the exact turndown day and the Google Health GA date in the current docs.\n- **Tokens do not transfer.** Nothing you store today carries over to Google Health — every user re-authorizes.\n- **PKCE is mandatory for public clients.** Mobile and SPA apps that omit the Client Secret must use `S256`.\n- **Scopes are per-collection and user-controlled.** Verify the granted `scope` in the token response; users can decline individual collections.\n- **Volatile values change.** Token TTL, the rate-limit header name, and the turndown date are all flagged \"verify against current docs\" — confirm them on the primary developer pages before you ship.\n\nFor how Fitbit stacks up against another major wearable platform, see [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api); for the wider category, the [wearable data APIs](/fitness-apis/wearable-data-apis) guide covers the approval gates and rate limits across providers.",
    "faqs": [
      {
        "q": "Is the Fitbit Web API being shut down?",
        "a": "Yes. Google is retiring the legacy Fitbit Web API and replacing it with the Google Health API, which uses Google OAuth 2.0. The turndown is targeted for around September 2026, with the exact day still to be confirmed — verify it against the current docs before planning around it."
      },
      {
        "q": "Do my existing Fitbit OAuth tokens transfer to the Google Health API?",
        "a": "No. Existing Fitbit access and refresh tokens do not transfer to the Google Health API and will not work there. Every user must actively re-consent through Google OAuth 2.0, so build a phased re-consent flow before the turndown."
      },
      {
        "q": "Should I build a new integration on the Fitbit Web API or Google Health?",
        "a": "For a new integration in 2026, target the Google Health API with Google OAuth 2.0 directly, since the legacy Fitbit Web API is short-lived. Use the legacy flow only to maintain an existing integration through the transition. Verify the current GA date and timeline in the docs."
      },
      {
        "q": "What is the Fitbit API rate limit?",
        "a": "The documented limit is 150 API requests per hour per consented user, resetting around the top of each hour. Exceeding it returns HTTP 429 with a header indicating seconds until reset (commonly Retry-After — verify the exact header name in the docs)."
      },
      {
        "q": "Does Fitbit require approval for intraday data?",
        "a": "Yes. Minute- and second-level intraday data is available by default only to Personal apps for their own account. Other app types must request intraday access from Fitbit/Google, and each intraday request is limited to a 24-hour window."
      }
    ],
    "related": [
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We break down a new fitness and wearable API every week — OAuth quirks, migration deadlines, and rate-limit gotchas included. Subscribe to get the next one."
    },
    "steps": [
      {
        "name": "Register your app",
        "text": "Create an app at dev.fitbit.com and choose an OAuth 2.0 application type (Client, Server, or Personal). You receive a Client ID and, for server apps, a Client Secret."
      },
      {
        "name": "Generate a PKCE pair and redirect the user to authorize",
        "text": "Create a code_verifier and its S256 code_challenge, then send the user to the Fitbit authorize URL requesting scopes like activity, heartrate, sleep, and profile. Fitbit redirects back with an authorization code."
      },
      {
        "name": "Exchange the authorization code for tokens",
        "text": "POST the code to the Fitbit token endpoint with your client_id and PKCE code_verifier (server apps add HTTP Basic auth). You get back a Bearer access token, a refresh token, and the granted scope."
      },
      {
        "name": "Fetch data with the Bearer token",
        "text": "Call the REST API with an Authorization Bearer header, using user/- to mean the authenticated user. Example endpoints return daily activity summaries and steps time series as JSON."
      },
      {
        "name": "Refresh tokens before they expire",
        "text": "Access tokens are short-lived, so exchange the stored refresh token for a new access token to avoid sending the user back through consent. Persist the returned tokens and refresh proactively."
      },
      {
        "name": "Handle rate limits and request intraday access",
        "text": "Respect the limit of 150 requests per hour per consented user and back off on HTTP 429. Minute- or second-level intraday data requires separate approval and is capped to a 24-hour window per request."
      }
    ]
  },
  {
    "slug": "strava-api",
    "primaryQuery": "how to integrate the Strava API",
    "h1": "How to Integrate the Strava API (2026)",
    "metaTitle": "How to Integrate the Strava API (2026)",
    "metaDescription": "Integrate the Strava API: OAuth 2.0 setup, token exchange, fetching athlete activities, rotating refresh tokens, and the Events API webhook handshake.",
    "updated": "2026-07-09",
    "answer": "The Strava API gives you an athlete's activities — runs, rides, and other workouts with GPS routes, distance, pace, time, elevation, and heart rate — plus profile and segment data. Authentication is OAuth 2.0 Authorization Code: you send the athlete to Strava to approve scopes, exchange the returned code for a short-lived access token, and call the v3 REST API with a Bearer token. Access tokens last about 6 hours and refresh tokens rotate on every refresh, so persist the newest one. Subscribe to the Events API webhook for near-real-time activity updates instead of polling.",
    "body": "The Strava API gives you an athlete's activities — runs, rides, and other workouts with their GPS routes, distance, pace, time, elevation, and heart rate — plus profile, segment, and route data. Authentication is OAuth 2.0 Authorization Code: you send the athlete to Strava to approve scopes, exchange the returned code for a short-lived access token, and then call the v3 REST API with a `Bearer` token, refreshing as needed and subscribing to webhooks for near-real-time updates.\n\nStrava is the natural integration for a social running or cycling app, where athletes already record activities and expect them to sync. If you are building that kind of product, this pairs well with the wider [wearable data APIs](/fitness-apis/wearable-data-apis) layer and the app-shape decisions in [how to build a running app](/build/running-app).\n\n> **Verify before you ship.** Endpoints, scopes, token lifetimes, and rate limits below are accurate as of 2026, but Strava changes them. Confirm the current values in the official Strava developer docs (`developers.strava.com`) before you go to production, and treat the exact per-app rate quotas as defaults that can vary.\n\n## What you'll need\n\n- A Strava account, and a registered API application (this gives you a **Client ID** and **Client Secret**).\n- An **Authorization Callback Domain** registered on the app — Strava validates that your `redirect_uri` lives under this domain.\n- A server-side place to hold the Client Secret and to store each athlete's rotating refresh token. Never ship the secret in a mobile or browser client.\n- For webhooks: a publicly reachable HTTPS callback URL that can answer a validation handshake within 2 seconds.\n\n## Step 1: Register your Strava API application\n\nCreate an application at `https://www.strava.com/settings/api`. Strava issues a **Client ID** and **Client Secret**, and asks for an **Authorization Callback Domain**. Only the domain is registered — the full `redirect_uri` you pass at authorize time must be a URL under that domain (for example, registering `yourapp.example.com` allows `https://yourapp.example.com/exchange_token`).\n\nDecide your scopes up front. The ones most integrations need:\n\n| Scope | Grants |\n|---|---|\n| `read` | Public profile info |\n| `activity:read` | Activities visible to Everyone or Followers |\n| `activity:read_all` | All activities, including private \"Only You\" activities |\n| `activity:write` | Create or update activities |\n\nRequest the least you need. To read an athlete's full activity history including private activities — and to receive webhook events for those private activities — you need `activity:read_all`. Plain `activity:read` only ever sees activities the athlete has shared beyond \"Only You\".\n\n## Step 2: Send the athlete through the OAuth authorize screen\n\nRedirect the athlete to Strava's authorize endpoint. Multiple scopes are **comma-separated** (not space-separated as in most OAuth providers):\n\n```\nhttps://www.strava.com/oauth/authorize\n  ?client_id=CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/exchange_token\n  &response_type=code\n  &approval_prompt=auto\n  &scope=read,activity:read_all\n```\n\n`approval_prompt=auto` skips the consent screen if the athlete has already granted these scopes; use `force` to always show it. On approval, Strava redirects back to your `redirect_uri` with a one-time `code` and the scopes actually granted:\n\n```\nhttps://yourapp.example.com/exchange_token?code=AUTH_CODE&scope=read,activity:read_all&state=...\n```\n\nAlways read the returned `scope` parameter and confirm it contains what you need — the athlete can deselect scopes on the consent screen, so a granted set narrower than what you requested is normal and you must handle it.\n\n## Step 3: Exchange the code for tokens\n\nTrade the authorization code for an access token from your server, where the Client Secret is safe:\n\n```bash\ncurl -X POST \"https://www.strava.com/oauth/token\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"client_secret=CLIENT_SECRET\" \\\n  -d \"code=AUTH_CODE\" \\\n  -d \"grant_type=authorization_code\"\n```\n\nThe response carries the access token, a refresh token, and expiry:\n\n```json\n{\n  \"token_type\": \"Bearer\",\n  \"expires_at\": 1752091200,\n  \"expires_in\": 21600,\n  \"refresh_token\": \"e5n567...\",\n  \"access_token\": \"a4b945...\",\n  \"athlete\": { \"id\": 12345, \"username\": \"...\" }\n}\n```\n\nAccess tokens are short-lived: they expire **6 hours after creation** (`expires_in` of 21600 seconds, as of 2026 — verify the current value). Store `expires_at` alongside the tokens so you know when to refresh. Note that the OAuth token exchange and refresh calls do **not** count against your API rate limit.\n\n## Step 4: Fetch the athlete's activities\n\nCall the v3 REST API with the access token in an `Authorization: Bearer` header. To list the authenticated athlete's activities, newest first:\n\n```bash\ncurl -X GET \"https://www.strava.com/api/v3/athlete/activities?per_page=30&page=1\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nUseful query parameters: `before` and `after` (epoch seconds) to window the results, plus `page` and `per_page` (default 30, up to 200 per page) to paginate. To read the athlete's own profile:\n\n```bash\ncurl -X GET \"https://www.strava.com/api/v3/athlete\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nRemember that without `activity:read_all`, this listing omits the athlete's private \"Only You\" activities.\n\n## Step 5: Refresh the rotating tokens\n\nWhen an access token is near or past `expires_at`, exchange the stored refresh token for a new access token:\n\n```bash\ncurl -X POST \"https://www.strava.com/oauth/token\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"client_secret=CLIENT_SECRET\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=REFRESH_TOKEN\"\n```\n\nStrava uses **rotating refresh tokens**: each refresh returns a **new access token AND a new refresh token**. You must persist the newest refresh token and discard the old one — if you keep reusing a stale refresh token, subsequent refreshes will fail and you will have to send the athlete back through consent. Store the refresh token per athlete and update it on every refresh.\n\n## Step 6: Subscribe to the Events API webhook\n\nPolling burns your rate limit. Instead, subscribe once (only **one subscription is allowed per application**) so Strava pushes events when an athlete creates, updates, or deletes an activity:\n\n```bash\ncurl -X POST \"https://www.strava.com/api/v3/push_subscriptions\" \\\n  -F client_id=CLIENT_ID \\\n  -F client_secret=CLIENT_SECRET \\\n  -F callback_url=https://yourapp.example.com/webhook \\\n  -F verify_token=YOUR_VERIFY_TOKEN\n```\n\nImmediately after this POST, Strava sends a **GET** to your `callback_url` to validate it:\n\n```\nGET https://yourapp.example.com/webhook\n    ?hub.mode=subscribe\n    &hub.verify_token=YOUR_VERIFY_TOKEN\n    &hub.challenge=15f7d1a91c1f40f8a748fd134752feb3\n```\n\nYour endpoint must confirm `hub.verify_token` matches what you sent, then respond **within 2 seconds** with HTTP **200**, `Content-Type: application/json`, echoing the challenge back exactly:\n\n```json\n{\"hub.challenge\":\"15f7d1a91c1f40f8a748fd134752feb3\"}\n```\n\nIf the handshake times out or the echoed challenge does not match, the subscription is not created. Once it is live, Strava POSTs an event to the same URL whenever something changes:\n\n```json\n{\n  \"aspect_type\": \"create\",\n  \"event_time\": 1752091200,\n  \"object_id\": 987654321,\n  \"object_type\": \"activity\",\n  \"owner_id\": 12345,\n  \"subscription_id\": 1234,\n  \"updates\": {}\n}\n```\n\nThe payload is a pointer, not the data — take the `owner_id` and `object_id` and call `GET /activities/{id}` (or the athlete's activity list) with that athlete's token to fetch the full record. `object_type` is `activity` or `athlete`, and `aspect_type` is `create`, `update`, or `delete`. Watch for an `athlete` update carrying `updates.authorized: \"false\"`, which signals the athlete **deauthorized** your app — clean up their stored tokens when you see it. To receive events for private activities, that athlete's token must have `activity:read_all`. Acknowledge every event POST with HTTP 200 within 2 seconds and do the actual fetching and processing asynchronously.\n\n## Gotchas and production notes\n\n- **Rate limits.** The application default is **200 requests per 15 minutes and 2,000 requests per day** (non-upload), as of 2026. Usage is reported in the `X-RateLimit-Limit` and `X-RateLimit-Usage` response headers (each a \"15-minute, daily\" pair); exceeding a limit returns **HTTP 429**. Read those headers and back off rather than hammering. Higher limits require requesting an increase from Strava, and per-app quotas can vary — verify against the current docs.\n- **Rotating refresh tokens are the number-one integration bug.** If a background refresh and a user-triggered refresh race, or you forget to persist the new refresh token, athletes silently drop off. Serialize refreshes per athlete and always write back the newest token.\n- **Private activities need `activity:read_all`.** Both the REST listings and webhook events hide \"Only You\" activities without it. If athletes report \"missing\" runs, this scope is usually why.\n- **Keep the Client Secret server-side.** The token exchange, refresh, and subscription calls all require it, so run them from your backend, never from a mobile or browser client.\n- **Webhooks are pointers, and one per app.** Every event needs a follow-up API call to fetch the data, and you get a single subscription for the whole application — fan out to individual athletes on your side using `owner_id`.\n\nFor where Strava fits among the broader wearable and device integrations — and when an aggregator that collapses many providers behind one API is a better fit than integrating each directly — see [wearable data APIs](/fitness-apis/wearable-data-apis). For the surrounding product build, see [how to build a running app](/build/running-app).",
    "faqs": [
      {
        "q": "Does the Strava API require approval to use?",
        "a": "No formal partner-approval program is needed to start: you register an application at the Strava API settings page and immediately get a Client ID and Secret to build against. The main constraint is rate limits — the default is around 200 requests per 15 minutes and 2,000 per day as of 2026 — and raising those requires requesting an increase from Strava. Verify the current quotas and any program terms in the official docs before you scale."
      },
      {
        "q": "How long do Strava access tokens last?",
        "a": "Access tokens are short-lived and expire about 6 hours after they are created (an expires_in of 21600 seconds as of 2026). Store the expires_at value returned with the token so you know when to refresh, and confirm the current lifetime in the docs since Strava can change it."
      },
      {
        "q": "Why do my Strava refreshes keep failing?",
        "a": "Strava uses rotating refresh tokens: each refresh returns a new access token AND a new refresh token, and the old refresh token stops working. If you keep reusing a stale refresh token, or a background job and a user action race and one overwrites the other, refreshes fail and the athlete has to reconsent. Persist the newest refresh token per athlete and serialize refreshes."
      },
      {
        "q": "How do I get private activities from Strava?",
        "a": "You need the activity:read_all scope. Plain activity:read only returns activities the athlete has shared beyond 'Only You', and the same applies to webhook events. Request activity:read_all if your product needs the athlete's full history or real-time updates for private activities, and check the returned scope since the athlete can deselect it."
      },
      {
        "q": "Does the Strava webhook include the activity data?",
        "a": "No. The webhook payload is a pointer with fields like object_id, owner_id, object_type, and aspect_type, not the activity itself. When you receive an event you acknowledge it with HTTP 200 within 2 seconds, then make a follow-up API call with that athlete's token to fetch the full record. You also get only one subscription per application, so fan out to individual athletes on your side."
      }
    ],
    "related": [
      {
        "href": "/integrate/fitbit-api",
        "label": "Integrate the Fitbit API"
      },
      {
        "href": "/build/running-app",
        "label": "How to build a running app"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We break down fitness integrations every week — OAuth flows, rotating tokens, and webhook handshakes like Strava's — so you can wire up wearable and activity data without the guesswork."
    },
    "steps": [
      {
        "name": "Register your Strava API application",
        "text": "Create an app at the Strava API settings page to get a Client ID, Client Secret, and Authorization Callback Domain. Decide your scopes, using activity:read_all if you need private activities."
      },
      {
        "name": "Send the athlete through the OAuth authorize screen",
        "text": "Redirect the athlete to Strava's authorize endpoint with your comma-separated scopes. On approval Strava returns a one-time code and the scopes actually granted, which you must check."
      },
      {
        "name": "Exchange the code for tokens",
        "text": "From your server, POST the code with your Client ID and Secret to the token endpoint. You get back an access token that expires in about 6 hours plus a refresh token."
      },
      {
        "name": "Fetch the athlete's activities",
        "text": "Call the v3 REST API with the access token in an Authorization Bearer header to list activities or read the profile. Use before, after, page, and per_page to window and paginate."
      },
      {
        "name": "Refresh the rotating tokens",
        "text": "When a token nears expiry, exchange the stored refresh token for a new pair. Strava rotates refresh tokens, so persist the newest refresh token each time and discard the old one."
      },
      {
        "name": "Subscribe to the Events API webhook",
        "text": "Create a single push subscription and answer Strava's GET validation by echoing hub.challenge within 2 seconds. Strava then POSTs pointer events you follow up with an API call."
      }
    ]
  },
  {
    "slug": "garmin-api",
    "primaryQuery": "how to integrate the Garmin API",
    "h1": "How to Integrate the Garmin API (2026)",
    "metaTitle": "How to Integrate the Garmin API (2026)",
    "metaDescription": "Integrate Garmin: partner approval, OAuth 2.0 PKCE, the per-user userAccessToken, and the push/ping webhook model. Gated docs, hedged for 2026.",
    "updated": "2026-07-09",
    "answer": "The Garmin API delivers deep wearable data: all-day wellness metrics (heart rate, steps, sleep, stress, Pulse Ox) through the Health API and per-activity data across 100-plus sports through the Activity API. It uses OAuth 2.0 with PKCE to obtain a per-user userAccessToken, and it pushes data to callback URLs you register instead of letting you poll. The big catch is access: the Connect Developer Program is partner-approval-only, not self-serve, and new sign-ups are reportedly on hold as of 2026, so the first real step is to apply and wait. Because Garmin's docs are gated, treat every host, scope, and endpoint as verify-against-current-partner-docs.",
    "body": "The Garmin API gives your app deep wearable data — all-day wellness metrics like heart rate, steps, sleep, stress, respiration, and Pulse Ox through the Health API, plus detailed per-activity data across 100-plus sport types through the Activity API. Access uses `OAuth 2.0` with PKCE to obtain a per-user `userAccessToken`, and data is delivered by push/ping webhooks you register rather than by polling. The one-line \"how\": get approved for the Connect Developer Program, connect each user over OAuth, register callback URLs, and let Garmin POST the data to you.\n\n## Read this before you plan a Garmin build\n\nGarmin is not a self-serve API. The **Garmin Connect Developer Program** is **partner-approval-only**: you apply, and Garmin's team must approve a partnership before you receive any API credentials. There is no sign-up-and-ship path.\n\nMore important for 2026: **new sign-ups are reportedly on hold**. As of this writing, the public access-request form has been removed, community and issue-tracker reports describe the program as \"on hold\" for new applicants for several months, and there is no published re-open ETA. Existing approved partners are said to keep working, but you may not be able to onboard as a fresh developer right now.\n\n**Verify current status directly on developer.garmin.com before committing to Garmin.** This is a factual access constraint, not a knock on the product — Garmin has the broadest health-metric breadth of any wearable API, but you need to confirm you can actually get approved first. If approval is blocked, weigh the alternatives in [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) and the broader survey in [wearable data APIs](/fitness-apis/wearable-data-apis) — including aggregators that resell Garmin access under their own partnership.\n\nBecause Garmin's developer docs are gated (most primary pages return HTTP 403 to anonymous fetches), every host, path, scope name, summary-type name, and token lifetime below is marked **verify against the current partner docs**. Do not hard-code any of these values from this page — read them from the spec Garmin gives you after approval.\n\n## What you'll need\n\n- **An approved Garmin Connect Developer Program partnership.** This is the gating step and, as noted, may be paused — start here, because nothing else works without it.\n- **Your issued API credentials** (a consumer/client identifier and secret, exact names per the current spec — verify).\n- **A public HTTPS server** to host your OAuth redirect URI and your webhook callback endpoints.\n- **Somewhere to store a per-user `userAccessToken`** mapped to your internal user ID.\n\n## Step 1: Apply to the Connect Developer Program (and wait)\n\nStart the partnership application on developer.garmin.com. Historically this meant submitting an access-request form describing your company and use case; as of 2026 that public form is reportedly removed, so check the program overview page for the current path and status. Treat this as an \"apply and wait\" step, not a self-serve registration — approval is a manual, partner-level decision with no guaranteed timeline, and new applications may currently be paused. Do not build against Garmin on the assumption you will be approved; confirm access first.\n\n## Step 2: Register your app and get credentials\n\nOnce approved, you register your application in the developer portal and receive your API credentials. During registration you configure your **OAuth redirect URI** and your **webhook callback URLs** — Garmin's model has you register a callback endpoint per summary type you want to receive (see Step 4). Note which of Garmin's programs you have been granted: the **Health API** (all-day wellness), the **Activity API** (per-activity sport data), and possibly others such as a Training or Women's Health API — availability and exact scopes are per your partnership agreement, so verify what you actually have access to.\n\n## Step 3: Authenticate each user with OAuth 2.0 PKCE\n\nCurrent Garmin docs specify **`OAuth 2.0` with PKCE** (Proof Key for Code Exchange). The shape is the standard authorization-code-with-PKCE flow: generate a code verifier and challenge, send the user to Garmin's authorize endpoint, and exchange the returned authorization code (plus your verifier) for tokens at the token endpoint.\n\n```http\nGET https://<garmin-authorize-host>/oauth2/authorize\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/garmin/callback\n  &code_challenge=GENERATED_CHALLENGE\n  &code_challenge_method=S256\n  &state=RANDOM_STATE\n```\n\nThe exact authorize and token host names, parameter names, and required scopes are in the gated **Garmin Connect Developer Program OAuth 2.0 PKCE Specification** — the host above is a placeholder, so **verify every URL against that spec**. A historical caveat worth knowing: Garmin's Health API predates OAuth 2.0, and older integrations (and some lingering third-party references) used **OAuth 1.0a**. If you find OAuth 1.0a instructions, confirm whether they apply to your program before following them — new builds should use the current PKCE flow (verify).\n\nThe token exchange returns a per-user **`userAccessToken`** — Garmin's identifier for that connected user. Store it mapped to your internal user ID; you will use it to authenticate the callbacks you fetch later. Public secondary sources cite an access-token lifetime of roughly three months, refreshable via a refresh token — treat the exact lifetime and refresh mechanics as **verify against the current spec**.\n\n## Step 4: Register push/ping webhooks (the key difference)\n\nThis is where Garmin differs architecturally from most wearable APIs: **you do not poll**. You register HTTPS callback URLs per summary type in the developer portal, and Garmin **POSTs data to you** when a user's device syncs. There are two delivery modes:\n\n- **Ping Service** — Garmin POSTs a lightweight *notification* saying new data exists. The payload includes a **`callbackURL`** that you then GET (authenticated with that user's OAuth token) to pull the actual summary. This keeps Garmin's POST small and lets you fetch on your own schedule.\n- **Push Service** — Garmin POSTs the **full updated data inline as JSON**, so there is no follow-up GET. Same data, delivered directly.\n\nBoth modes retry on failed delivery, so your endpoint must return quickly and handle duplicates idempotently. Choose Ping when you want to control fetch timing and load; choose Push for the lowest latency and one fewer round trip. Which summary types exist (dailies, sleeps, epochs, stress, Pulse Ox, and so on) and their exact names come from the Health/Activity API spec — **verify the summary-type names against the current docs** rather than trusting any list here.\n\n## Step 5: Receive and process the callbacks\n\nA Ping notification wraps arrays keyed by summary type; each record identifies the user and gives you the URL to fetch. The illustrative shape below is from public secondary docs — **the exact host, path, and fields are gated, so verify against the partner spec**:\n\n```json\n{\n  \"dailies\": [\n    {\n      \"userId\": \"4aacafe82427c251df9c9592d0c06768\",\n      \"userAccessToken\": \"8f57a6f1-26ba-4b05-a7cd-c6b525a4c7a2\",\n      \"uploadStartTimeInSeconds\": 1444937651,\n      \"uploadEndTimeInSeconds\": 1444937902,\n      \"callbackURL\": \"https://<garmin-api-host>/wellness-api/rest/dailies?uploadStartTimeInSeconds=1444937651&uploadEndTimeInSeconds=1444937902\"\n    }\n  ]\n}\n```\n\nFor a **Ping**, look up your stored `userAccessToken` by `userId`, then GET the `callbackURL` with that user's OAuth authorization to retrieve the summary. For a **Push**, the same top-level envelope (for example a `\"dailies\"` array) carries the full metric fields inline instead of a `callbackURL` — you process it directly, no fetch needed. In both cases, key incoming records to your internal user by the Garmin `userId`/`userAccessToken`, acknowledge fast, and deduplicate on the upload time window.\n\n## Gotchas and production notes\n\n- **Approval is the whole game.** Everything above is moot until you are an approved partner, and new sign-ups may be paused as of 2026 — verify on developer.garmin.com before you plan a roadmap around Garmin.\n- **Nothing here is a stable public contract.** Hosts, paths, scopes, summary-type names, and token lifetimes are behind the partner NDA/docs and can change. Read them from the spec Garmin issues you, and do not copy the placeholders on this page into production.\n- **Webhooks, not polling.** Design your ingestion around receiving POSTs, retries, and out-of-order deliveries. Your callback endpoints must be publicly reachable over HTTPS, fast, and idempotent.\n- **Store tokens per user and plan for refresh.** Persist each `userAccessToken` (and refresh token) mapped to your user, and handle the roughly three-month expiry (verify) before it bites you in production.\n- **Consider an aggregator if approval is blocked.** If you cannot get into the program, a wearable-data aggregator that already holds a Garmin partnership can resell access through one integration — compare that path in [wearable data APIs](/fitness-apis/wearable-data-apis) and see how Garmin stacks up against the self-serve alternatives in [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api).",
    "faqs": [
      {
        "q": "Does Garmin require approval to use its API?",
        "a": "Yes. The Garmin Connect Developer Program is partner-approval-only and not self-serve, so you must apply and be approved before receiving any API credentials. As of 2026 new sign-ups are reportedly on hold with no published re-open date, so verify current status on developer.garmin.com before committing to a Garmin build."
      },
      {
        "q": "What authentication does the Garmin API use?",
        "a": "Current docs specify OAuth 2.0 with PKCE, producing a per-user userAccessToken you store and reuse. A historical caveat: Garmin's Health API predates OAuth 2.0 and older integrations used OAuth 1.0a, so if you find OAuth 1.0a instructions, confirm whether they apply to your program before following them. The exact authorize and token hosts are in Garmin's gated PKCE specification, so verify them there."
      },
      {
        "q": "How does Garmin deliver data — do I poll it?",
        "a": "You do not poll. You register HTTPS callback URLs per summary type, and Garmin POSTs data when a user's device syncs. Ping mode sends a lightweight notification containing a callbackURL you then GET with the user's token, while Push mode sends the full updated data inline as JSON with no follow-up request needed."
      },
      {
        "q": "Are the endpoint URLs and summary-type names on this page accurate?",
        "a": "Treat them as placeholders to verify, not production values. Garmin's developer docs are gated and most primary pages return errors to anonymous fetches, so specific hosts, paths, scopes, summary-type names, and token lifetimes should be read from the spec Garmin issues you after approval rather than copied from any public write-up, including this one."
      },
      {
        "q": "What if I cannot get into the Garmin developer program?",
        "a": "If approval is blocked or paused, a wearable-data aggregator that already holds a Garmin partnership can resell access through one integration, saving you the direct approval step. Compare that path against the self-serve alternatives such as Fitbit, Oura, and WHOOP before deciding whether direct Garmin access is worth the wait."
      }
    ],
    "related": [
      {
        "href": "/integrate/fitbit-api",
        "label": "Integrate the Fitbit API"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We track wearable API access changes every week — including whether Garmin's developer program has reopened and how the aggregator alternatives compare."
    },
    "steps": [
      {
        "name": "Apply to the Connect Developer Program (and wait)",
        "text": "Start a partnership application on developer.garmin.com and wait for manual approval, since this is not self-serve. New sign-ups may currently be paused, so confirm access is available before planning a build."
      },
      {
        "name": "Register your app and get credentials",
        "text": "Once approved, register your application to receive API credentials and configure your OAuth redirect URI and webhook callback URLs. Note which programs you were granted, such as the Health API and Activity API."
      },
      {
        "name": "Authenticate each user with OAuth 2.0 PKCE",
        "text": "Run the authorization-code-with-PKCE flow to connect each user and exchange the code for tokens. Store the returned per-user userAccessToken mapped to your internal user ID."
      },
      {
        "name": "Register push and ping webhooks",
        "text": "Register HTTPS callback URLs per summary type so Garmin POSTs data to you instead of you polling. Ping sends a lightweight notification with a callbackURL to fetch, while Push delivers the full JSON inline."
      },
      {
        "name": "Receive and process the callbacks",
        "text": "Key each incoming record to your user by the Garmin userId and userAccessToken, then either fetch the Ping callbackURL or process the inline Push payload. Acknowledge fast and deduplicate on the upload time window."
      }
    ]
  },
  {
    "slug": "oura-api",
    "primaryQuery": "how to integrate the Oura API",
    "h1": "How to Integrate the Oura API (2026)",
    "metaTitle": "How to Integrate the Oura API (2026)",
    "metaDescription": "Integrate Oura API v2: the OAuth 2.0 flow, scopes, a real usercollection request, plus the PAT deprecation and 10-user cap you must plan around.",
    "updated": "2026-07-09",
    "answer": "The Oura API v2 gives you a connected user's sleep, activity, readiness, heart rate, workouts, and SpO2 as daily summaries and time series over a REST base at https://api.ouraring.com/v2/. Auth is OAuth 2.0 Authorization Code: you send the user to Oura's consent screen, exchange the returned code for an access token, then call usercollection endpoints with a Bearer token. Two constraints shape the build: Personal Access Tokens were deprecated in December 2025, so new integrations must use OAuth only, and a freshly registered app can connect at most 10 users until Oura approves it. Registration is otherwise self-serve, so you can start building immediately.",
    "body": "The Oura API v2 gives you a connected user's sleep, activity, readiness, heart rate, workouts, and SpO2 as clean daily summaries and time series over a simple REST base at `https://api.ouraring.com/v2/`. Auth is OAuth 2.0 Authorization Code — you send the user to Oura's consent screen, exchange the returned code for an access token, then call `usercollection/*` endpoints with a Bearer token. Registration is self-serve, so you can start building in minutes.\n\nTwo things to internalize before you write code, because they shape your whole plan:\n\n- **Personal Access Tokens are deprecated (December 2025).** New PATs can no longer be created, and new integrations must use **OAuth 2.0 only**. If a tutorial tells you to paste a personal token, it is out of date. (Previously issued PATs may still function during a transition period — verify against the current docs.)\n- **There is a 10-user cap until Oura approves your app.** A freshly registered app can connect at most **10 Oura users**. To go beyond that you must submit the app for Oura's review; after approval the limit is lifted. Plan for that approval step before any public launch.\n\nIf you are still choosing a provider or comparing device coverage, see our overview of [wearable data APIs](/fitness-apis/wearable-data-apis). Oura is often evaluated alongside recovery-focused bands — our [WHOOP API guide](/integrate/whoop-api) covers that neighboring integration.\n\n## What you'll need\n\n- An **Oura account** and an Oura Ring with an active membership on the test user's side (some data requires an active subscription).\n- An app registered in the **Oura developer portal**, which gives you a **`client_id`** and **`client_secret`**.\n- A registered **redirect URI** (your OAuth callback), served over HTTPS in production.\n- A server-side place to store tokens — you exchange the authorization code and store the access and refresh tokens on your backend, never in the client.\n\n## Step 1: Register your app and get credentials\n\nIn the Oura developer portal, create a new application. Set a name and one or more **redirect URIs** (these must match exactly at authorization time). Oura issues a **`client_id`** and a **`client_secret`** — treat the secret like a password and keep it server-side only.\n\nNote your app starts under the **10-user cap**. That is enough to build and test; request approval later when you are ready for more users.\n\n## Step 2: Send the user to the authorization URL\n\nRedirect the user to Oura's authorize endpoint with the scopes you need. As of 2026 there are **8 scopes** (verify the current set in the docs):\n\n| Scope | Grants |\n|---|---|\n| `email` | User's email address |\n| `personal` | Personal info (gender, age, height, weight) |\n| `daily` | Daily summaries — sleep, activity, readiness |\n| `heartrate` | Time-series heart rate (Gen 3+) |\n| `workout` | Auto-detected and user-entered workouts |\n| `tag` | User-entered tags |\n| `session` | Guided and unguided sessions in the Oura app |\n| `spo2` | Daily SpO2 average recorded during sleep |\n\nRequest only the scopes you actually use — the user can toggle individual scopes at the consent screen. Build the authorize URL against `https://cloud.ouraring.com/oauth/authorize`:\n\n```http\nGET https://cloud.ouraring.com/oauth/authorize\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.com/oauth/oura/callback\n  &scope=daily heartrate workout spo2\n  &state=RANDOM_ANTI_CSRF_STRING\n```\n\nGenerate `state` per request and verify it on the callback to defend against CSRF. After the user consents, Oura redirects to your `redirect_uri` with `?code=...&state=...`.\n\n## Step 3: Exchange the code for tokens\n\nOn your callback, verify `state`, then POST the `code` to the token endpoint `https://api.ouraring.com/oauth/token` to receive an access token and a refresh token:\n\n```bash\ncurl -s -X POST \"https://api.ouraring.com/oauth/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=AUTHORIZATION_CODE\" \\\n  -d \"redirect_uri=https://yourapp.com/oauth/oura/callback\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\"\n```\n\nThe response contains an `access_token`, a `refresh_token`, and a `token_type` of `Bearer`. Store both tokens on your backend, mapped to your internal user ID.\n\nHere is the same exchange in TypeScript:\n\n```ts\nconst res = await fetch(\"https://api.ouraring.com/oauth/token\", {\n  method: \"POST\",\n  headers: { \"Content-Type\": \"application/x-www-form-urlencoded\" },\n  body: new URLSearchParams({\n    grant_type: \"authorization_code\",\n    code,\n    redirect_uri: \"https://yourapp.com/oauth/oura/callback\",\n    client_id: process.env.OURA_CLIENT_ID!,\n    client_secret: process.env.OURA_CLIENT_SECRET!,\n  }),\n});\nconst { access_token, refresh_token } = await res.json();\n// persist both, keyed to your user\n```\n\n## Step 4: Fetch data from the usercollection endpoints\n\nAll data lives under the base `https://api.ouraring.com/v2/` at `usercollection/*` paths. List endpoints accept `start_date` and `end_date` (ISO dates); you can also fetch a single document by its `document_id`. Send the access token as a Bearer header:\n\n```bash\ncurl -s \\\n  -H \"Authorization: Bearer ${OURA_ACCESS_TOKEN}\" \\\n  \"https://api.ouraring.com/v2/usercollection/daily_activity?start_date=2026-07-01&end_date=2026-07-09\"\n```\n\nThe response wraps records in a `data` array with a `next_token` for pagination:\n\n```json\n{\n  \"data\": [\n    {\n      \"id\": \"…\",\n      \"day\": \"2026-07-08\",\n      \"score\": 82,\n      \"active_calories\": 512,\n      \"steps\": 9231\n    }\n  ],\n  \"next_token\": null\n}\n```\n\nCommonly used `usercollection` endpoints (confirm the exact set for your scopes at `https://api.ouraring.com/v2/docs`):\n\n| Endpoint | What it returns |\n|---|---|\n| `daily_activity` | Daily activity score, steps, calories |\n| `daily_sleep` | Daily sleep score and contributors |\n| `daily_readiness` | Daily readiness score |\n| `heartrate` | Time-series heart rate (Gen 3+) |\n| `workout` | Auto-detected and entered workouts |\n| `daily_spo2` | Daily average SpO2 during sleep |\n\nA `403` here usually means the token is missing the required scope, or the user's Oura subscription has lapsed — not a bad token.\n\n## Step 5: Paginate and refresh tokens\n\nFor a date range that returns more rows than one page, follow `next_token`: when it is non-null, repeat the request passing it back to Oura until it comes back `null`. When an access token expires, exchange the stored refresh token for a new pair:\n\n```bash\ncurl -s -X POST \"https://api.ouraring.com/oauth/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=STORED_REFRESH_TOKEN\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\"\n```\n\nPersist the newly returned tokens and retry the original request. Refresh on a `401`, or proactively before expiry.\n\n## Step 6: Request app approval before you scale\n\nOnce you are past testing, submit your app for Oura's review to lift the **10-user cap**. Until approval clears, the eleventh user's authorization will fail, so gate any public rollout on it. Approval is also where Oura checks how you use and store health data, so have your privacy handling ready.\n\n## Gotchas and production notes\n\n- **OAuth only.** PATs are deprecated (Dec 2025) and cannot be created for new integrations — build the OAuth flow from day one.\n- **The 10-user cap is real.** It blocks scale, not testing. Submit for approval well before launch; do not discover the cap in production.\n- **Scopes gate data, and a 403 is usually a scope or membership problem**, not an auth bug. Request the minimum scopes, and remember users can disable individual scopes at consent.\n- **Some metrics need hardware or a subscription.** Time-series heart rate needs a Gen 3 ring or newer, and certain data requires an active Oura membership.\n- **Store tokens server-side.** Do the code exchange and all refreshes on your backend; never ship the `client_secret` to a client.\n- **Verify volatile details.** Treat the exact scope list, endpoint set, and any PAT transition behavior as things to confirm against the live docs at `https://api.ouraring.com/v2/docs`, since Oura updates them.\n\nFor where Oura fits among recovery and sleep-tracking sources, and how to avoid integrating a dozen wearables one at a time, see our [wearable data APIs](/fitness-apis/wearable-data-apis) overview.",
    "faqs": [
      {
        "q": "Does the Oura API still support Personal Access Tokens?",
        "a": "No for new integrations. Oura deprecated Personal Access Tokens in December 2025, so new PATs can no longer be created and new integrations must use OAuth 2.0 only. Previously issued PATs may still function during a transition period, but you should not build on them; verify the current status in Oura's docs."
      },
      {
        "q": "Does the Oura API require approval?",
        "a": "Registration is self-serve, but a freshly registered app can connect at most 10 Oura users until Oura approves it. You build and test freely under that cap, then submit the app for Oura's review to lift the limit before a public launch. Plan for that approval step in your timeline."
      },
      {
        "q": "What OAuth endpoints and scopes does Oura use?",
        "a": "Authorize at https://cloud.ouraring.com/oauth/authorize and exchange or refresh tokens at https://api.ouraring.com/oauth/token. As of 2026 there are eight scopes: email, personal, daily, heartrate, workout, tag, session, and spo2, and the user can toggle individual scopes at consent. Request only what you need and verify the current list in the docs."
      },
      {
        "q": "Why am I getting a 403 from a usercollection endpoint?",
        "a": "A 403 on an Oura v2 endpoint usually means the access token is missing the scope that endpoint requires, or the user's Oura subscription has lapsed. It is generally a scope or membership problem rather than an invalid token, so check the scopes you requested and the user's membership status before assuming an auth bug."
      },
      {
        "q": "What data can I read from the Oura API v2?",
        "a": "Under https://api.ouraring.com/v2/ the usercollection endpoints expose daily summaries and time series, including daily_activity, daily_sleep, daily_readiness, heartrate, workout, and daily_spo2, among others. List endpoints accept start_date and end_date, and you can fetch a single document by its id. Confirm the exact endpoint set for your scopes at https://api.ouraring.com/v2/docs."
      }
    ],
    "related": [
      {
        "href": "/integrate/whoop-api",
        "label": "Integrate the WHOOP API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We break down wearable integrations every week, from Oura's OAuth flow and approval cap to the token-refresh and scope traps that trip up production launches."
    },
    "steps": [
      {
        "name": "Register your app and get credentials",
        "text": "Create an app in the Oura developer portal and set your redirect URIs. Oura issues a client_id and client_secret; keep the secret server-side, and note your app starts under the 10-user cap."
      },
      {
        "name": "Send the user to the authorization URL",
        "text": "Redirect the user to Oura's authorize endpoint with response_type=code, your client_id, redirect_uri, a state value, and only the scopes you need from the eight available. The user consents and Oura redirects back with a code."
      },
      {
        "name": "Exchange the code for tokens",
        "text": "On your callback, verify state and POST the code to the token endpoint to receive an access token and refresh token. Store both on your backend, mapped to your internal user ID."
      },
      {
        "name": "Fetch data from the usercollection endpoints",
        "text": "Call usercollection paths like daily_activity under the v2 base with the access token as a Bearer header, using start_date and end_date for ranges. Records come back in a data array."
      },
      {
        "name": "Paginate and refresh tokens",
        "text": "Follow the next_token field to page through large date ranges until it is null. When an access token expires, exchange the stored refresh token for a new pair and retry."
      },
      {
        "name": "Request app approval before you scale",
        "text": "Submit your app for Oura's review to lift the 10-user cap before any public rollout. Approval is also where Oura reviews how you handle and store health data."
      }
    ]
  },
  {
    "slug": "whoop-api",
    "primaryQuery": "how to integrate the WHOOP API",
    "h1": "How to Integrate the WHOOP API (2026)",
    "metaTitle": "How to Integrate the WHOOP API (2026)",
    "metaDescription": "Integrate WHOOP recovery, sleep, and workout data via OAuth 2.0: app registration, scopes, token exchange, sample requests, webhooks, and the member cap.",
    "updated": "2026-07-09",
    "answer": "The WHOOP API exposes a member's recovery, strain, sleep, and workout data through OAuth 2.0 consent, then REST pulls and webhooks against the api.prod.whoop.com base URL. You register an app in the WHOOP Developer Dashboard, run the authorization-code flow to get an access token for the scopes you need, and call the /v2 data endpoints with a Bearer token. Two access facts matter first: every user needs a paid WHOOP membership, and a new app is capped at 10 members until WHOOP approves it for production.",
    "body": "The WHOOP API gives you a member's recovery, strain, sleep, and workout data — the HRV-driven recovery and cardiovascular strain scores WHOOP is known for — through `OAuth 2.0` authorization-code consent, then REST pulls and webhooks against the `https://api.prod.whoop.com` base URL. The one-line how: register an app in the WHOOP Developer Dashboard, run the OAuth flow to get an access token for the scopes you need, and call the `/v2/...` data endpoints with a Bearer token. Two access facts shape everything below, so read them first.\n\n## Two things to know before you start\n\n- **Every user needs a paid WHOOP membership.** The developer platform and API are free, but WHOOP is hardware plus a subscription (One/Peak/Life). There is no WHOOP data without a device and an active membership — for you and for every end user. If your audience does not already own WHOOP, this is a hard blocker, not a detail.\n- **A new app is capped at 10 WHOOP members until it is approved.** Your app works immediately after registration, but it can only connect up to 10 members. To exceed 10 or ship to production you must submit the app through WHOOP's App Approval flow. Plan for that review before you promise anyone general availability. (Source: developer.whoop.com/docs/developing/app-approval — verify the current cap and process.)\n\nNeither of these is a knock on WHOOP; they are access requirements. If you want a broader wearable strategy or an aggregator that fronts WHOOP alongside others, see [wearable data APIs](/fitness-apis/wearable-data-apis). WHOOP's OAuth flow is close to [Oura's](/integrate/oura-api), so if you have integrated one the other will feel familiar.\n\n## What you'll need\n\n- A WHOOP account and a device with an active membership (to test end to end).\n- An app registered in the **WHOOP Developer Dashboard** (developer.whoop.com), which gives you a **client ID** and **client secret**. The secret also verifies webhook signatures — treat it as a server-side secret.\n- One or more **redirect URIs** registered on the app.\n- At least one **scope** selected (an app must request at least one).\n- A backend to hold the client secret and do the token exchange. Never run the token exchange or store secrets in a mobile or browser client.\n\n## Step 1: Register your app in the Developer Dashboard\n\nIn the WHOOP Developer Dashboard, create an app and set:\n\n- **Redirect URI(s)** — where WHOOP sends the user back with an authorization `code`.\n- **Scopes** — the data your app can read (see Step 2).\n- **Webhook URL** (optional but recommended) — where WHOOP POSTs update events.\n\nOn save you receive a **client ID** and **client secret**. The app is live immediately but bound by the 10-member cap until approved.\n\n## Step 2: Choose your scopes\n\nRequest only what you use. As of 2026 the documented scopes are (verify the current list in the docs):\n\n| Scope | Grants read access to |\n|---|---|\n| `read:recovery` | Recovery scores (HRV, resting heart rate) |\n| `read:cycles` | Physiological cycles / strain |\n| `read:sleep` | Sleep activities |\n| `read:workout` | Workout activities |\n| `read:profile` | Basic member profile |\n| `read:body_measurement` | Height, weight, max heart rate |\n| `offline` | Required to receive a **refresh token** |\n\nInclude `offline` if your backend needs to keep syncing after the user closes the app — without it you get no refresh token.\n\n## Step 3: Send the user through the OAuth authorize flow\n\nRedirect the user to the authorize endpoint with your client ID, redirect URI, requested scopes, and a `state` value you generate and later verify (CSRF protection). This is the standard authorization-code grant.\n\n```http\nGET https://api.prod.whoop.com/oauth/oauth2/auth\n  ?client_id=YOUR_CLIENT_ID\n  &redirect_uri=YOUR_REDIRECT_URI\n  &response_type=code\n  &scope=read:recovery%20read:sleep%20read:workout%20offline\n  &state=RANDOM_STATE\n```\n\nThe user signs in and consents. WHOOP redirects back to your redirect URI with `?code=...&state=...`. Verify `state`, then move to the token exchange.\n\n## Step 4: Exchange the code for an access token\n\nFrom your backend, POST the authorization code to the token endpoint to get an `access_token` (and a `refresh_token` if you requested `offline`).\n\n```bash\n# Token exchange\ncurl -X POST \"https://api.prod.whoop.com/oauth/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=THE_AUTH_CODE\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\" \\\n  -d \"redirect_uri=YOUR_REDIRECT_URI\"\n```\n\nStore the `access_token` and `refresh_token` server-side, per user. Access tokens are short-lived; the refresh token lets you mint new ones (see Step 6).\n\n## Step 5: Call the data endpoints\n\nWith the access token in an `Authorization: Bearer` header, hit the v2 data endpoints under the `https://api.prod.whoop.com` base URL. The main ones (verify exact pluralization in the current docs):\n\n- `GET /v2/recovery` — recoveries, paginated\n- `GET /v2/activity/sleep` — sleeps\n- `GET /v2/activity/workout` — workouts\n- `GET /v2/cycle` — physiological cycles\n\n```bash\n# Sample: latest 10 sleeps\ncurl -X GET \"https://api.prod.whoop.com/v2/activity/sleep?limit=10\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```\n\nResults are paginated (follow the pagination token the response returns), and note that v2 payloads identify records with **UUIDs**, not integer IDs.\n\n## Step 6: Refresh tokens and (recommended) subscribe to webhooks\n\n**Refresh:** when an access token expires, exchange the refresh token for a new one. Keep the `offline` scope so refresh keeps working (verify the exact refresh parameters — whether `scope=offline` must be re-sent — in the current docs).\n\n```bash\ncurl -X POST \"https://api.prod.whoop.com/oauth/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=THE_REFRESH_TOKEN\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\" \\\n  -d \"scope=offline\"\n```\n\n**Webhooks:** instead of polling, register a webhook URL on your app. WHOOP POSTs when data changes. As of 2026 the v2 event types are `recovery.updated`, `sleep.updated`, and `workout.updated` (payloads reference records by UUID). Verify each POST before trusting it:\n\n- WHOOP sends an `X-WHOOP-Signature` header plus a timestamp header.\n- Recompute `base64( HMAC-SHA256( timestamp_header + raw_request_body, client_secret ) )` and compare to the signature header. Drop the request on any mismatch.\n\nImplement signature verification on day one — an unverified webhook endpoint is an open door.\n\n## Gotchas and production notes\n\n- **Membership is mandatory.** No paid WHOOP membership means no data. Confirm your users own WHOOP before you build.\n- **10-member cap until approval.** You cannot exceed 10 connected members until your app clears WHOOP's App Approval flow. Budget review time before launch.\n- **Rate limits.** Roughly **100 requests per minute** and **10,000 requests per day** per client (verify current limits). Responses carry `X-RateLimit-*` headers — read them and back off. Increases are available on request via WHOOP support.\n- **`offline` scope for refresh.** Forget it and you get no refresh token, so your background sync dies when the first access token expires.\n- **v2 uses UUIDs.** If you are porting from v1 integer IDs, update your storage and webhook routing.\n- **Keep the client secret server-side.** It signs webhook verification and exchanges tokens; never ship it in a client app.\n\nTreat rate limits, scope names, and endpoint pluralization as volatile — confirm them in the current WHOOP docs before you go to production. For a wider comparison of recovery and wearable providers, see [wearable data APIs](/fitness-apis/wearable-data-apis); to integrate a similar OAuth-based ring, see the [Oura API guide](/integrate/oura-api).",
    "faqs": [
      {
        "q": "Do I need a paid WHOOP membership to use the API?",
        "a": "Yes. The developer platform and API are free, but WHOOP is hardware plus an active membership (One, Peak, or Life). There is no data without a device and an active membership, for you and for every end user, so confirm your audience owns WHOOP before you build."
      },
      {
        "q": "Does the WHOOP API require approval?",
        "a": "A new app works immediately but is capped at 10 connected WHOOP members. To exceed 10 or ship to production you must submit the app through WHOOP's App Approval flow. Plan for that review before promising general availability, and verify the current cap and process in the docs."
      },
      {
        "q": "What are the WHOOP API rate limits?",
        "a": "As of 2026 the documented limits are roughly 100 requests per minute and 10,000 requests per day per client, with X-RateLimit headers on responses. Treat these as volatile and verify the current numbers in the docs; increases are available on request via WHOOP support."
      },
      {
        "q": "How do I get a refresh token from WHOOP?",
        "a": "Request the offline scope during the OAuth authorization step. Without offline, WHOOP does not return a refresh token, so your access token cannot be renewed and background sync stops when it expires. Verify the exact refresh-request parameters in the current docs."
      },
      {
        "q": "How do I verify WHOOP webhooks?",
        "a": "WHOOP sends an X-WHOOP-Signature header plus a timestamp header. Recompute base64 of HMAC-SHA256 over the timestamp header concatenated with the raw request body, keyed by your client secret, and compare it to the signature header, dropping the request on any mismatch. Do this on day one."
      }
    ],
    "related": [
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "Integrating wearables like WHOOP into a fitness product? Get our field notes on OAuth approval gates, token refresh, and webhook security in your inbox."
    },
    "steps": [
      {
        "name": "Register your app in the Developer Dashboard",
        "text": "Create an app in the WHOOP Developer Dashboard, set your redirect URIs, scopes, and an optional webhook URL, and receive a client ID and client secret. The app is live immediately but limited to 10 members until approved."
      },
      {
        "name": "Choose your scopes",
        "text": "Select only the scopes you use, such as read:recovery, read:sleep, and read:workout. Add the offline scope if your backend needs a refresh token to keep syncing."
      },
      {
        "name": "Send the user through the OAuth authorize flow",
        "text": "Redirect the user to the WHOOP authorize endpoint with your client ID, redirect URI, scopes, and a state value. After consent, WHOOP returns an authorization code to your redirect URI."
      },
      {
        "name": "Exchange the code for an access token",
        "text": "From your backend, POST the authorization code to the token endpoint to receive an access token and, if you requested offline, a refresh token. Store both server-side per user."
      },
      {
        "name": "Call the data endpoints",
        "text": "Use the access token as a Bearer token to call the v2 data endpoints under api.prod.whoop.com for recovery, sleep, workout, and cycle data. Results are paginated and identified by UUIDs."
      },
      {
        "name": "Refresh tokens and subscribe to webhooks",
        "text": "Exchange the refresh token for new access tokens as they expire, and register a webhook URL to receive update events instead of polling. Verify every webhook with its HMAC-SHA256 signature."
      }
    ]
  },
  {
    "slug": "terra-api",
    "primaryQuery": "how to integrate Terra",
    "h1": "How to Integrate Terra (Health-Data Aggregator) (2026)",
    "metaTitle": "How to Integrate the Terra API (2026)",
    "metaDescription": "Integrate Terra once to read Garmin, Fitbit, Oura, Whoop, and 500+ wearables via one normalized webhook. Widget session, payloads, and signature checks.",
    "updated": "2026-07-09",
    "answer": "Terra is a health-data aggregator: you integrate once and it returns normalized data from Garmin, Fitbit, Oura, Whoop, Strava, Apple Health, and hundreds of other sources behind a single schema. You authenticate to Terra with a dev-id and x-api-key header, then mint a hosted widget session from your backend so the user picks and authorizes their own provider through Terra's Connect flow. Terra runs each provider's OAuth for you and POSTs normalized data to one webhook, which you verify with an HMAC-SHA256 signature. The key caveat: for some providers (Garmin, Whoop, Strava, Oura) you must still register your own developer credentials and give them to Terra.",
    "body": "Terra is a health-data aggregator: instead of integrating Garmin, Fitbit, Oura, Whoop, Strava, Apple Health, and hundreds of other sources one at a time, you integrate Terra once and it returns all of them in a single normalized schema. Auth to Terra is a simple API-key model — every request carries a `dev-id` and an `x-api-key` header — while Terra brokers each provider's OAuth for you behind a hosted Connect widget. The one-line \"how\": your backend mints a widget session, the user picks and authorizes their device through Terra, and Terra POSTs normalized data to your webhook from then on.\n\nThat last point is the whole reason to use an aggregator, so hold onto it: **one integration, many providers, delivered over one webhook.** You never write provider-specific parsing. For a broader look at where Terra sits among aggregators, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and the head-to-head [Terra vs Vital](/fitness-apis/terra-vs-vital) comparison.\n\n## One important caveat before you start\n\nTerra shields you from writing each provider's OAuth flow — but not always from each provider's paperwork. For several popular providers (commonly **Garmin, Whoop, Strava, and Oura**), you must still register your **own developer credentials** with that provider and hand them to Terra (Dashboard, then Connections, then the provider, then Edit). So \"one integration\" is completely true for your code and your data schema; you may still complete N provider registrations before those providers light up. Budget for that onboarding time up front. Verify the exact list of providers that need your own credentials in the current Terra docs, since it changes.\n\n## What you'll need\n\n- A **Terra account** (tryterra.co) with a project — this gives you a `dev-id` and an `x-api-key`.\n- A **Destination** configured in the Terra dashboard: the HTTPS **webhook URL** where Terra will POST auth events and normalized data.\n- A **backend** to call Terra's `/auth` endpoints. The API key must never be exposed client-side.\n- For providers that require it (Garmin, Whoop, Strava, Oura, and others), **your own developer credentials** with those providers, entered into the Terra dashboard.\n- Base URL for all API calls: `https://api.tryterra.co/v2/`. As of 2026, verify current endpoints and field names against docs.tryterra.co.\n\n## Step 1: Get your credentials and set up a Destination\n\nCreate a project in the Terra dashboard and copy your `dev-id` and `x-api-key`. Every API call to Terra sends both as headers:\n\n```http\ndev-id: YOUR_DEV_ID\nx-api-key: YOUR_API_KEY\n```\n\nThen configure a **Destination** — the webhook URL Terra will deliver events to (for example, `https://yourapp.com/terra/webhook`). This single endpoint is where every provider's data will arrive, normalized. Because everything funnels through here, you build and test one receiver, not one per wearable.\n\n## Step 2: Register your own credentials for the providers that need them\n\nSkip this step for providers Terra fully brokers. For **Garmin, Whoop, Strava, Oura** and any others flagged in the docs, go to the Terra dashboard, then Connections, select the provider, choose Edit, and paste in the client ID/secret you obtained from that provider's own developer program. Until you do this, those providers will not appear as authorizable options in your widget. This is the \"N registrations\" part of the caveat above — it is dashboard configuration, not code.\n\n## Step 3: Generate a widget session from your backend\n\nTo connect a user, your backend calls Terra's Connect endpoint to mint a hosted **widget session**. You pass the list of providers to offer, plus your own `reference_id` (your internal user ID) so you can correlate Terra's user back to your account.\n\n```bash\ncurl -X POST \"https://api.tryterra.co/v2/auth/generateWidgetSession\" \\\n  -H \"dev-id: YOUR_DEV_ID\" \\\n  -H \"x-api-key: YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"reference_id\": \"user-1234\",\n    \"providers\": \"GARMIN,FITBIT,OURA,WHOOP,STRAVA\",\n    \"language\": \"en\",\n    \"auth_success_redirect_url\": \"https://yourapp.com/success\",\n    \"auth_failure_redirect_url\": \"https://yourapp.com/failure\"\n  }'\n```\n\nThe response includes a `session_id`, a `url`, a `status`, and `expires_in` (the session is short-lived, roughly 900 seconds). Note how `providers` is just a comma-separated list — adding a new wearable to your product is a one-line change here, not a new integration.\n\n## Step 4: Send the user to the widget and handle the auth webhook\n\nOpen the returned `url` for the user (redirect, in-app browser, or webview). Terra hosts the whole flow: the user **picks their provider and authorizes it**, and Terra runs that provider's OAuth for you. On success the user is sent to your `auth_success_redirect_url`.\n\nThe authoritative signal, though, is the webhook. Terra fires an **`auth`** event to your Destination containing the Terra `user_id` and your `reference_id`. Store that `user_id` against your account — it is the key you'll use for every future data pull and the routing key on every incoming payload.\n\n## Step 5: Receive normalized data on your webhook\n\nFrom then on, Terra **pushes normalized data to your one webhook** as events. Every payload carries a `type` (`activity`, `sleep`, `daily`, `body`, `nutrition`, `menstruation`, `athlete`, and `auth`) and a `user` block with the `user_id`, your `reference_id`, and which `provider` it came from. The `data` array is the same shape regardless of whether it originated from Garmin, Whoop, or Oura.\n\n```json\n{\n  \"type\": \"activity\",\n  \"user\": {\n    \"user_id\": \"9d5dc9eb-3e02-4b37-9a7b-b14b5a5a2b93\",\n    \"reference_id\": \"user-1234\",\n    \"provider\": \"WHOOP\",\n    \"active\": true,\n    \"last_webhook_update\": \"2026-07-09T11:13:43.360227+00:00\"\n  },\n  \"data\": [ { \"metadata\": {} } ]\n}\n```\n\nRoute on `type` and `user.user_id`. Because the schema is identical across providers, you write one handler for `activity`, one for `sleep`, and so on — never a Garmin parser and a separate Whoop parser.\n\n## Step 6: Verify the webhook signature\n\nTerra signs every webhook so you can confirm it genuinely came from Terra. The request carries a `terra-signature` header in the form `t=<timestamp>,v1=<signature>`. Terra signs with **HMAC-SHA256**: recompute the signature over the timestamp plus the **raw request body** using your signing secret, then compare it to the `v1` value. Reject the request on mismatch, and read the raw body before any JSON parsing so the bytes match exactly.\n\n```js\nconst crypto = require(\"crypto\");\n\nfunction verifyTerraSignature(rawBody, header, secret) {\n  // header example: \"t=1720523623,v1=abc123...\"\n  const parts = Object.fromEntries(\n    header.split(\",\").map((kv) => kv.split(\"=\"))\n  );\n  const signedPayload = `${parts.t}.${rawBody}`; // verify exact layout in current docs\n  const expected = crypto\n    .createHmac(\"sha256\", secret)\n    .update(signedPayload)\n    .digest(\"hex\");\n  return crypto.timingSafeEqual(\n    Buffer.from(expected),\n    Buffer.from(parts.v1)\n  );\n}\n```\n\nTerra's official SDKs expose a helper (`verify_terra_webhook_signature(...)`) that does this for you — prefer it, and verify the exact signed-string construction in the current docs, since the precise layout can differ.\n\n## Step 7: Pull historical data via REST (optional)\n\nWebhooks give you new data as it arrives, but on first connect you'll usually want backfill. Terra exposes REST endpoints per datatype — `/v2/activity`, `/v2/sleep`, `/v2/daily`, `/v2/body`, `/v2/athlete`, `/v2/nutrition`, `/v2/menstruation` — all keyed by the Terra `user_id` plus a date range.\n\n```bash\ncurl -X GET \"https://api.tryterra.co/v2/activity?user_id=USER_ID&start_date=2026-07-01&end_date=2026-07-08&to_webhook=false&with_samples=true\" \\\n  -H \"dev-id: YOUR_DEV_ID\" \\\n  -H \"x-api-key: YOUR_API_KEY\"\n```\n\nSet `to_webhook=true` to have a large historical pull delivered asynchronously to your Destination instead of in the response, and `with_samples=true` for granular sample-level data. Same base URL, same headers, same normalized schema as the webhooks.\n\n## Gotchas and production notes\n\n- **Register provider credentials early.** The most common launch surprise is Garmin/Whoop/Strava/Oura not appearing in the widget because you haven't yet supplied your own developer credentials in the dashboard. Start those provider registrations before you need them.\n- **Never expose the API key.** Call `/auth` endpoints and any data pulls only from your backend. The widget `url` is the only thing that ever reaches the client.\n- **Verify signatures on day one.** Terra webhooks are HMAC-SHA256 signed; implement `terra-signature` verification from the start rather than retrofitting it.\n- **Widget sessions are short-lived.** Generate one per connection attempt (roughly 900 seconds); don't cache and reuse them.\n- **Pricing is usage/credit-based — model it.** As of 2026, Terra is a subscription plus credit-based usage model; entry tier is reported around $399/mo billed annually (about $499 monthly) including roughly 100,000 credits/mo, with credits scaling on active authentications and events. All figures are volatile — confirm on tryterra.co/pricing before you budget.\n- **Aggregator, not magic.** Terra removes per-provider OAuth code and per-provider parsing; it does not remove per-provider app approval where the provider requires it. That trade — a little dashboard paperwork for one codebase across [many wearables](/fitness-apis/wearable-data-apis) — is exactly what you're buying.",
    "faqs": [
      {
        "q": "What makes Terra different from integrating each wearable directly?",
        "a": "Terra is an aggregator: you build one integration and receive Garmin, Fitbit, Oura, Whoop, Strava, Apple Health, and 500-plus other sources normalized into a single schema over one webhook. Instead of writing and maintaining separate OAuth flows and parsers per device, you write one receiver. The trade-off is usage-based pricing and, for some providers, still registering your own developer credentials."
      },
      {
        "q": "Do I still need my own developer credentials with each provider?",
        "a": "For most providers Terra brokers the auth entirely. But for several popular ones (commonly Garmin, Whoop, Strava, and Oura) you must register your own developer credentials with that provider and enter them in the Terra dashboard under Connections. Terra shields you from writing the OAuth code, not always from the provider's app-approval process. Verify the current list in Terra's docs, since it changes."
      },
      {
        "q": "How does a user connect their wearable through Terra?",
        "a": "Your backend calls POST /v2/auth/generateWidgetSession with a list of providers and your reference_id, and Terra returns a hosted widget url. You send the user to that url, where they pick their provider and authorize it while Terra runs that provider's OAuth. On success Terra fires an auth webhook with the Terra user_id you use for all subsequent data."
      },
      {
        "q": "How do I verify a Terra webhook is authentic?",
        "a": "Terra signs each webhook with HMAC-SHA256 and sends a terra-signature header in the form t=timestamp,v1=signature. Recompute the signature over the timestamp plus the raw request body using your signing secret and compare it to v1, rejecting on mismatch. Terra's SDKs expose a verify_terra_webhook_signature helper; confirm the exact signed-string layout in the current docs."
      },
      {
        "q": "How much does Terra cost?",
        "a": "As of 2026 Terra uses a subscription plus credit-based usage model. The entry tier is reported around $399/mo billed annually (about $499 monthly) including roughly 100,000 credits per month, with credits scaling on active authentications and events. All figures are volatile, so verify current numbers on tryterra.co/pricing before budgeting."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/health-data-aggregator-apis",
        "label": "Best health-data aggregator APIs"
      },
      {
        "href": "/fitness-apis/terra-vs-vital",
        "label": "Terra vs Vital (Junction)"
      },
      {
        "href": "/integrate/whoop-api",
        "label": "Integrate the WHOOP API"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We publish a new wearable and aggregator integration walkthrough every week, provider-credential gotchas and pricing traps included, so subscribe and connect the next device without the surprises."
    },
    "steps": [
      {
        "name": "Get your credentials and set up a Destination",
        "text": "Create a Terra project to obtain your dev-id and x-api-key, which you send as headers on every call. Configure a Destination, the single HTTPS webhook URL where Terra delivers auth events and normalized data for all providers."
      },
      {
        "name": "Register your own credentials for providers that need them",
        "text": "Terra brokers most provider auth, but for Garmin, Whoop, Strava, Oura and others you must paste your own developer client ID and secret into the Terra dashboard under Connections. Until you do, those providers will not appear as options in your widget."
      },
      {
        "name": "Generate a widget session from your backend",
        "text": "Call POST /v2/auth/generateWidgetSession with the list of providers to offer and your own reference_id. Terra returns a short-lived session_id and a hosted url for the user."
      },
      {
        "name": "Send the user to the widget and handle the auth webhook",
        "text": "Open the returned url so the user picks and authorizes their provider while Terra runs that provider's OAuth. Terra fires an auth webhook containing the Terra user_id, which you store against your account for all future calls."
      },
      {
        "name": "Receive normalized data on your webhook",
        "text": "Terra pushes activity, sleep, daily, body, and other events to your one webhook, each carrying a type and the user_id and provider. The data shape is identical across providers, so you write one handler per type, never per device."
      },
      {
        "name": "Verify the webhook signature",
        "text": "Every webhook includes a terra-signature header of the form t=timestamp,v1=signature. Recompute an HMAC-SHA256 over the timestamp plus the raw body with your signing secret and reject the request if it does not match v1."
      },
      {
        "name": "Pull historical data via REST",
        "text": "For backfill, call the per-datatype endpoints such as /v2/activity or /v2/sleep with the Terra user_id and a date range. Set to_webhook=true to deliver large pulls asynchronously to your Destination and with_samples=true for granular data."
      }
    ]
  },
  {
    "slug": "nutritionix-api",
    "primaryQuery": "how to integrate the Nutritionix API",
    "h1": "How to Integrate the Nutritionix API (2026)",
    "metaTitle": "How to Integrate the Nutritionix API (2026)",
    "metaDescription": "Integrate the Nutritionix API: get an App ID and App Key pair, send two headers, and call natural/nutrients, instant search, and barcode lookup.",
    "updated": "2026-07-09",
    "answer": "The Nutritionix API returns nutrition data for foods: calories and macros for natural-language meals, autocomplete search across common and branded foods, and lookup by item ID or UPC barcode. Auth is a simple API-key pair, not OAuth: you create an application, get an App ID and App Key, and send both as static headers on every request. There is no token exchange, no callback, and nothing to refresh. The base URL is https://trackapi.nutritionix.com/v2/ and the main endpoint is POST /natural/nutrients.",
    "body": "The Nutritionix API gives you nutrition data for foods — calories and macros for natural-language meals, autocomplete search across common and branded foods, and lookup by item ID or UPC barcode. Its auth model is about as simple as REST APIs get: no OAuth, no token exchange, no callback URLs. You create an application, get an App ID and App Key pair, and send both as static headers on every request.\n\nThat simplicity is the reason a lot of nutrition apps reach for it first. If you have integrated an OAuth wearable API before, this will feel trivial by comparison — there is no refresh flow to manage and nothing expires mid-session. This guide walks the account setup, the two required headers, and the four endpoints you will actually use, with a real request for each. For where Nutritionix fits against alternatives, see the [best nutrition APIs](/fitness-apis/nutrition-apis) roundup; for the wider product build, see [how to build a nutrition tracking app](/build/nutrition-tracking-app).\n\n## What you'll need\n\n- A Nutritionix developer account (sign up at `developer.nutritionix.com`).\n- An **application** created in that account — the App ID and App Key are issued per application, not per account.\n- The two credential values, ready to inject as headers:\n  - `x-app-id` — your application's App ID.\n  - `x-app-key` — your application's App Key.\n- An HTTP client. Everything below is plain REST, so `curl`, `fetch`, or any language's HTTP library works.\n\nThe base URL for all v2 calls is `https://trackapi.nutritionix.com/v2/`.\n\n> **Heads up on an older host.** The archived GitHub doc `nutritionix/api-documentation` still shows a legacy **beta** host (`apibeta.nutritionix.com`) with `Content-Type: text/plain` and header casing like `X-APP-ID`. The current production host is `trackapi.nutritionix.com/v2/`, requests use a JSON body, and header names are case-insensitive. If you copy a snippet off an old blog post and it fails, check the host first. Verify the current host and casing against the live docs before you ship.\n\n## Step 1: Create an application and get your key pair\n\nSign up at `developer.nutritionix.com`, then create an application inside your account dashboard. Nutritionix issues an **App ID** and **App Key** tied to that application. Treat the App Key like a secret — keep it on your server, not in a shipped mobile or web client, so it cannot be scraped and used against your quota.\n\nStore the pair as environment variables:\n\n```bash\nexport NUTRITIONIX_APP_ID=\"YOUR_APP_ID\"\nexport NUTRITIONIX_APP_KEY=\"YOUR_APP_KEY\"\n```\n\n## Step 2: Get nutrients from free-text food (the primary endpoint)\n\nThe endpoint most apps are here for is `POST /natural/nutrients`. You send a plain-English description of a meal and get back itemized nutrition for each food. This is what powers \"type what you ate\" logging.\n\nSend the two auth headers plus a JSON body with a `query` string:\n\n```bash\ncurl -X POST 'https://trackapi.nutritionix.com/v2/natural/nutrients' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"query\": \"for breakfast i ate 2 eggs, bacon, and french toast\"\n  }'\n```\n\nThe response is JSON with a `foods` array. Each entry typically includes `food_name`, `serving_qty`, `serving_unit`, `serving_weight_grams`, `nf_calories`, `nf_total_fat`, `nf_protein`, and `nf_total_carbohydrate`, plus a `full_nutrients` array mapping nutrient IDs to values. Optional documented body params include `timezone`, `aggregate`, and `use_raw_foods`. Confirm the exact field list and parameters against the current docs, since response shapes evolve.\n\nIn JavaScript the same call looks like this:\n\n```js\nconst res = await fetch(\"https://trackapi.nutritionix.com/v2/natural/nutrients\", {\n  method: \"POST\",\n  headers: {\n    \"x-app-id\": process.env.NUTRITIONIX_APP_ID,\n    \"x-app-key\": process.env.NUTRITIONIX_APP_KEY,\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify({ query: \"1 cup cooked quinoa and 4 oz grilled chicken\" }),\n});\nconst data = await res.json();\nfor (const food of data.foods) {\n  console.log(food.food_name, food.nf_calories, \"kcal\", food.nf_protein, \"g protein\");\n}\n```\n\n## Step 3: Add autocomplete with instant search\n\nFor a search-as-you-type UI, use `GET /search/instant`. It takes a `query` parameter and returns two arrays: `common` (generic foods) and `branded` (packaged products). Branded results carry a `nix_item_id` you can use for a precise follow-up lookup.\n\n```bash\ncurl -G 'https://trackapi.nutritionix.com/v2/search/instant' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  --data-urlencode 'query=hamburger'\n```\n\nTypical flow: show the user instant-search suggestions, and when they pick a common food, resolve it through `POST /natural/nutrients`; when they pick a branded food, resolve it through the item lookup in the next step.\n\n## Step 4: Look up a specific item by ID or barcode\n\n`GET /search/item` fetches one branded item. Pass `nix_item_id` for an item you already identified (for example, from instant search), or pass `upc` to resolve a scanned barcode — the path your barcode scanner should hit.\n\nBy item ID:\n\n```bash\ncurl -G 'https://trackapi.nutritionix.com/v2/search/item' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  --data-urlencode 'nix_item_id=YOUR_NIX_ITEM_ID'\n```\n\nBy UPC / barcode:\n\n```bash\ncurl -G 'https://trackapi.nutritionix.com/v2/search/item' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  --data-urlencode 'upc=49000000450'\n```\n\nBetween these four endpoints you have the full logging loop: free-text entry, autocomplete, ID lookup, and barcode resolution.\n\n## Endpoint reference\n\n| Purpose | Method and path | Key input |\n|---|---|---|\n| Natural-language nutrients | `POST /natural/nutrients` | JSON body with `query` |\n| Instant search (autocomplete) | `GET /search/instant` | `query=` |\n| Item lookup (branded) | `GET /search/item` | `nix_item_id=` |\n| UPC / barcode lookup | `GET /search/item` | `upc=` |\n\nAll paths are relative to `https://trackapi.nutritionix.com/v2/`, and every call carries the `x-app-id` and `x-app-key` headers.\n\n## Gotchas and production notes\n\n- **Keep the App Key server-side.** Because auth is just two static header values with no per-user token, anyone who extracts the pair from a client bundle can spend your quota. Proxy Nutritionix calls through your backend rather than calling it directly from a mobile or browser client.\n- **Free-tier limits are ambiguous — verify them.** Nutritionix has offered a free developer tier that was historically rate-limited (the docs have listed caps such as a per-day limit on the natural endpoints). The exact current tier name, request quotas, and per-endpoint limits change; confirm them against the current docs and your account dashboard before you build volume assumptions on them.\n- **Handle rate-limit and error responses.** Check for non-200 status codes and back off on 429s rather than retrying in a tight loop.\n- **Field shapes can change.** The nutrient field list and optional body params above reflect documented behavior at the time of writing; treat them as a starting point and validate against a live response.\n- **Pair it with an exercise source if you need both sides of the ledger.** Nutrition in, activity out — if you also need workout data, see [how to integrate ExerciseDB](/integrate/exercisedb-api).\n\nNutritionix is one of the lowest-friction integrations in the fitness and nutrition space: create an app, grab two keys, send two headers. The engineering effort goes almost entirely into the logging UX on top, not into the auth plumbing.",
    "faqs": [
      {
        "q": "Does Nutritionix use OAuth?",
        "a": "No. Nutritionix uses a simple API-key model: you create an application, get an App ID and App Key pair, and send them as the x-app-id and x-app-key headers on every request. There is no OAuth flow, no token exchange, and no refresh to manage."
      },
      {
        "q": "What is the base URL and which endpoint should I start with?",
        "a": "The base URL is https://trackapi.nutritionix.com/v2/. Most apps start with POST /natural/nutrients, which turns a plain-English food description into itemized calories and macros. Older docs reference a legacy beta host (apibeta.nutritionix.com); use the trackapi production host and verify against current docs."
      },
      {
        "q": "How do I look up a food by barcode?",
        "a": "Call GET /search/item with a upc query parameter set to the scanned barcode value, along with the two auth headers. It returns the matching branded item's nutrition data. The same endpoint also accepts nix_item_id to fetch an item you already identified from instant search."
      },
      {
        "q": "Is there a free tier and what are the limits?",
        "a": "Nutritionix has offered a free developer tier that was historically rate-limited, with caps such as a per-day limit on the natural endpoints. The exact current tier name and quotas are ambiguous and change over time, so verify them against the current docs and your account dashboard before relying on them."
      },
      {
        "q": "Can I call Nutritionix directly from a mobile or web app?",
        "a": "You can technically, but you should not. Because auth is just two static header values with no per-user token, anyone who extracts the pair from a client bundle can spend your quota. Proxy the calls through your own backend instead."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/nutrition-apis",
        "label": "Best nutrition APIs"
      },
      {
        "href": "/build/nutrition-tracking-app",
        "label": "How to build a nutrition tracking app"
      },
      {
        "href": "/integrate/exercisedb-api",
        "label": "Integrate ExerciseDB"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "Wiring up Nutritionix for a food-logging app and comparing it against other nutrition data sources? Get our practical fitness and nutrition API breakdowns in your inbox."
    },
    "steps": [
      {
        "name": "Create an application and get your key pair",
        "text": "Sign up at developer.nutritionix.com and create an application, which issues an App ID and App Key pair. Store both as environment variables and keep the App Key server-side so it cannot be scraped from a client."
      },
      {
        "name": "Get nutrients from free-text food",
        "text": "Call POST /natural/nutrients with the x-app-id and x-app-key headers and a JSON body containing a query string describing a meal. The response returns a foods array with per-item calories, macros, and a full nutrients breakdown."
      },
      {
        "name": "Add autocomplete with instant search",
        "text": "Use GET /search/instant with a query parameter to power search-as-you-type. It returns common and branded food arrays, and branded results include a nix_item_id for a precise follow-up lookup."
      },
      {
        "name": "Look up a specific item by ID or barcode",
        "text": "Use GET /search/item with nix_item_id to fetch a known branded item, or with upc to resolve a scanned barcode. This completes the logging loop alongside free-text entry and autocomplete."
      },
      {
        "name": "Harden for production",
        "text": "Proxy calls through your backend to protect the App Key, handle rate-limit and error responses, and verify the current free-tier quotas against the live docs and your dashboard before building on them."
      }
    ]
  },
  {
    "slug": "exercisedb-api",
    "primaryQuery": "how to integrate ExerciseDB",
    "h1": "How to Integrate ExerciseDB (2026)",
    "metaTitle": "How to Integrate ExerciseDB API (2026)",
    "metaDescription": "Integrate ExerciseDB via RapidAPI: subscribe, send X-RapidAPI-Key + Host headers, and query exercises by body part or target. With a self-host option.",
    "updated": "2026-07-09",
    "answer": "ExerciseDB provides a searchable exercise library where each entry includes a name, target muscle, body part, equipment, and an animated gifUrl demo. Auth is a simple API key: you subscribe on RapidAPI, then send your key plus the required host header on every request. Note the name is ambiguous, referring to both the commercial RapidAPI listing (host exercisedb.p.rapidapi.com) and the open-source, self-hostable exercisedb.dev project, which use different endpoint shapes. This guide covers the RapidAPI listing and points to the self-host option.",
    "body": "ExerciseDB gives you a searchable library of exercises — each with a name, target muscle, body part, required equipment, and an animated `gifUrl` demo — over a plain API-key REST interface. There is no OAuth, no token exchange, and no callback URL: you subscribe on RapidAPI, then send your key in two request headers. It is the simplest integration in the fitness-API stack, and this guide walks you from subscription to your first exercise query.\n\n## Heads up: \"ExerciseDB\" is two different things\n\nBefore you write any code, know that the name **ExerciseDB** is ambiguous and points at two separate products that even share the same media CDN:\n\n1. **The commercial RapidAPI listing** — host `exercisedb.p.rapidapi.com`, accessed with a RapidAPI key. This is what most tutorials (and this one) mean, and it is the fastest way to get running.\n2. **The open-source `exercisedb.dev` project** — `github.com/ExerciseDB/exercisedb-api`, AGPL-3.0 licensed and self-hostable. It exposes its **own** endpoint shapes (its own `/api/v1`-style routes), which do **not** match the RapidAPI paths below.\n\nPick one and code strictly to its docs. Do not assume a path from one works on the other. This guide covers the RapidAPI listing; see the self-host section near the end if you would rather avoid marketplace billing and rate limits. For a wider comparison of options, see our [exercise database APIs](/fitness-apis/exercise-database-apis) roundup.\n\n## What you'll need\n\n- A **RapidAPI account** (free to create).\n- A **subscription to the ExerciseDB listing** on RapidAPI — even the free tier requires subscribing so your key is authorized for the API.\n- Your **RapidAPI key**, which RapidAPI issues per account and shows on the listing's endpoint page.\n\nThat is the whole checklist. No app-approval step, no partner program.\n\n## Step 1: Subscribe on RapidAPI and copy your key\n\nSign in to RapidAPI, open the ExerciseDB listing, and subscribe to a plan (a free tier exists but is small — see the pricing note below). Once subscribed, the listing's \"Endpoints\" tab shows your `X-RapidAPI-Key` value. Every request you make will carry two headers:\n\n- `X-RapidAPI-Key: YOUR_RAPIDAPI_KEY`\n- `X-RapidAPI-Host: exercisedb.p.rapidapi.com`\n\nThe host header is required by RapidAPI on every proxied call — omitting it returns an error even when the key is valid.\n\n## Step 2: Make your first request\n\nFetch exercises for a body part. The `bodyPart` path segment accepts values like `back`, `chest`, `legs`, and so on:\n\n```bash\ncurl -X GET 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back?limit=10&offset=0' \\\n  -H 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY' \\\n  -H 'X-RapidAPI-Host: exercisedb.p.rapidapi.com'\n```\n\nThe same in JavaScript with `fetch`:\n\n```js\nconst res = await fetch(\n  'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back?limit=10&offset=0',\n  {\n    method: 'GET',\n    headers: {\n      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,\n      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',\n    },\n  }\n);\nconst exercises = await res.json();\n```\n\nEach exercise object returns these fields:\n\n| Field | Description |\n|---|---|\n| `id` | Stable identifier for the exercise |\n| `name` | Exercise name |\n| `bodyPart` | Broad body region (e.g. `back`) |\n| `target` | Primary target muscle (e.g. `lats`) |\n| `equipment` | Required equipment (e.g. `cable`) |\n| `gifUrl` | Animated demo, e.g. `https://static.exercisedb.dev/media/EIeI8Vf.gif` |\n\nNewer versions of the listing may also include `secondaryMuscles` and `instructions` arrays — verify against the current listing before relying on them.\n\n## Step 3: Query by the axis your app needs\n\nThe listing exposes a small, predictable set of endpoints. The three you will use most:\n\n| Purpose | Method + path |\n|---|---|\n| All exercises | `GET /exercises` |\n| By body part | `GET /exercises/bodyPart/{bodyPart}` |\n| By target muscle | `GET /exercises/target/{target}` |\n\nFor example, pull every exercise that targets a specific muscle:\n\n```bash\ncurl -X GET 'https://exercisedb.p.rapidapi.com/exercises/target/biceps?limit=10&offset=0' \\\n  -H 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY' \\\n  -H 'X-RapidAPI-Host: exercisedb.p.rapidapi.com'\n```\n\n`GET /exercises` and the filtered endpoints accept `limit` and `offset` pagination params — verify the current defaults and maximums on the listing, since a bare `GET /exercises` can otherwise return a large payload. The listing also documents additional filter and list endpoints (by equipment, by name, by id, and list-of-values helpers like body parts and targets); confirm their exact paths on the current listing before wiring them in, as they have varied across versions.\n\n## Step 4: Cache the catalog and display the GIFs\n\nExerciseDB data is a reference catalog — it changes rarely — so treat it that way:\n\n- **Cache aggressively.** Fetch once, store the exercises in your own database, and refresh on a schedule rather than calling the API on every user request. This is the single biggest lever on both latency and your rate-limit budget.\n- **Serve `gifUrl` through your own layer** (proxy or re-host where the license allows) so a change to the upstream CDN does not break your UI.\n- **Key your local records on `id`** so you can map favorites, workout plans, and history to a stable reference.\n\nWith the catalog cached, wiring it into a workout builder is straightforward — see our guide to building a [strength-training app](/build/strength-training-app) for how the exercise catalog, sets/reps, and progression fit together.\n\n## Self-hosting alternative: exercisedb.dev\n\nIf the RapidAPI free tier is too small or you want to avoid marketplace billing and rate limits entirely, the open-source project is a real alternative:\n\n- Repo: `github.com/ExerciseDB/exercisedb-api`, licensed **AGPL-3.0**.\n- Advertises 11,000+ exercises with videos, images, and GIFs — verify the current count.\n- Exposes its **own** route shapes (documented at `oss.exercisedb.dev/docs`), which differ from the RapidAPI paths above.\n\nThe trade-off: you host and maintain it yourself, and AGPL-3.0 has obligations you must comply with (notably, making source available for network-served modifications). Read the license before shipping.\n\n## Gotchas and production notes\n\n- **Free tier is tiny.** The free RapidAPI plan has been reported at roughly ~10 requests/day — enough to prototype, not to run in production. Exact tier names, monthly caps, and per-second limits change on the listing, so verify against the current RapidAPI pricing page and plan around caching.\n- **Both headers are mandatory.** Missing or wrong `X-RapidAPI-Host` fails the request even with a valid key.\n- **Don't mix the two ExerciseDBs.** RapidAPI paths will not work against a self-hosted `exercisedb.dev` instance, and vice versa.\n- **Keep your key server-side.** Never ship `X-RapidAPI-Key` in client-side web code; proxy requests through your backend.\n- **Field list can drift.** Treat `secondaryMuscles`/`instructions` and the extra filter endpoints as \"verify against current docs\" rather than guaranteed.\n\nFor where ExerciseDB fits among other catalog and movement-data providers, see our [exercise database APIs](/fitness-apis/exercise-database-apis) comparison.",
    "faqs": [
      {
        "q": "Does ExerciseDB require OAuth or an approval process?",
        "a": "No. The RapidAPI listing uses simple API-key auth with no OAuth flow and no partner-approval step. You just create a RapidAPI account, subscribe to the listing, and send your key in headers."
      },
      {
        "q": "What headers does the ExerciseDB RapidAPI listing require?",
        "a": "Every request needs two headers: X-RapidAPI-Key with your key, and X-RapidAPI-Host set to exercisedb.p.rapidapi.com. The host header is mandatory on RapidAPI-proxied calls, and requests fail without it even if the key is valid."
      },
      {
        "q": "Is ExerciseDB free?",
        "a": "There is a free RapidAPI tier, but it has been reported as very small (on the order of ~10 requests/day), with paid tiers for higher volume. Exact tier names and quotas change on the listing, so verify against the current RapidAPI pricing page and plan around caching."
      },
      {
        "q": "What is the difference between the RapidAPI ExerciseDB and exercisedb.dev?",
        "a": "The name refers to two products: the commercial RapidAPI listing at host exercisedb.p.rapidapi.com, and the open-source, self-hostable exercisedb.dev project (AGPL-3.0). They share a media CDN but expose different endpoint shapes, so code to one set of docs and do not mix the paths."
      },
      {
        "q": "What data does each ExerciseDB exercise return?",
        "a": "Each exercise object includes id, name, bodyPart, target, equipment, and an animated gifUrl. Newer listing versions may add secondaryMuscles and instructions arrays, but verify those against the current docs before relying on them."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/exercise-database-apis",
        "label": "Best exercise database APIs"
      },
      {
        "href": "/build/strength-training-app",
        "label": "How to build a strength training app"
      },
      {
        "href": "/integrate/nutritionix-api",
        "label": "Integrate the Nutritionix API"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "Want more integration playbooks like this one? Subscribe for practical fitness-API tutorials delivered as we publish them."
    },
    "steps": [
      {
        "name": "Subscribe on RapidAPI and copy your key",
        "text": "Create a RapidAPI account, subscribe to the ExerciseDB listing, and copy your RapidAPI key from the endpoints page. A free tier exists but requires subscribing so the key is authorized."
      },
      {
        "name": "Make your first request",
        "text": "Call an endpoint such as exercises by body part, sending both the X-RapidAPI-Key and X-RapidAPI-Host headers. Each exercise returns id, name, bodyPart, target, equipment, and gifUrl."
      },
      {
        "name": "Query by the axis your app needs",
        "text": "Use GET /exercises for the full list, or filter with /exercises/bodyPart/{part} and /exercises/target/{target}. Apply limit and offset pagination to avoid large payloads."
      },
      {
        "name": "Cache the catalog and display the GIFs",
        "text": "Fetch the reference data once, store it in your own database keyed on id, and refresh on a schedule instead of calling the API per request. Serve gifUrl through your own layer for resilience."
      },
      {
        "name": "Consider the self-hosting alternative",
        "text": "If the RapidAPI free tier is too small or you want to avoid marketplace billing, the open-source exercisedb.dev project is AGPL-3.0 and self-hostable, but uses different endpoint shapes and license obligations."
      }
    ]
  }
];
