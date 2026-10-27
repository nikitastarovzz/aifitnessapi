import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED per-provider integration guides (originally auto-assembled;
 * since hand-edited — edit here). Code uses only real, documented endpoints/APIs;
 * migration/access-approval status is flagged per provider.
 */
export const integrateEntries: ClusterEntry[] =
[
  {
    "slug": "healthkit",
    "primaryQuery": "how to integrate Apple HealthKit",
    "h1": "How to Integrate Apple HealthKit (2026)",
    "metaTitle": "How to Integrate Apple HealthKit (2026): Read Denial",
    "metaDescription": "Integrate Apple HealthKit in Swift: add the capability and Info.plist keys, request authorization, read steps, and get background updates on-device.",
    "updated": "2026-10-02",
    "answer": "Apple HealthKit gives your iOS app read and write access to the user's on-device health and fitness data, including steps, workouts, and heart rate, through HKHealthStore, which Apple calls the access point for all data managed by HealthKit. It is not an OAuth cloud API: there are no tokens or server endpoints in Apple's setup, the user grants access in a system permission sheet, and your Swift code reads the data directly on the device. To integrate it you add the HealthKit capability plus Info.plist usage-description keys, call requestAuthorization(toShare:read:), then query data with classes like HKStatisticsQuery. One critical caveat is that HealthKit never tells you whether read access was granted, so you must run the query and treat an empty result as no data or no permission.",
    "body": "HealthKit data lives only on Apple devices — iPhone, Apple Watch, Vision Pro, and iPads on iPadOS 17 or later; Apple notes the framework also compiles for macOS and older iPadOS, but there `isHealthDataAvailable()` returns false — and there is no cross-platform endpoint. If you also need Android, you integrate [Google Health Connect](/integrate/google-health-connect) separately; the two are compared side by side in [Apple HealthKit vs. Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect). HealthKit's App Review gate, and every page on this site that covers HealthKit, are collected in the [HealthKit API overview](/apis/healthkit). Everything below is native iOS/Swift. If your app is React Native or Flutter instead, [react-native-health vs @kingstinct/react-native-healthkit](/libraries/compare/react-native-health-vs-kingstinct-react-native-healthkit) compares the two React Native bridges to HealthKit, and [`health_kit_reporter`](/libraries/health-kit-reporter) covers an iOS-only Flutter plugin.\n\n> **Version note.** API signatures below are long-stable public HealthKit API, but a few initializers are version-gated (for example `HKQuantityType(.stepCount)` is iOS 15+ and watchOS 8+). Signatures and availability were checked against Apple's documentation on October 2, 2026; re-check them before shipping.\n\n## What you'll need\n\n- An **Apple Developer account** and Xcode. Apple's capability table lists HealthKit for free Apple Developer accounts as well as paid memberships; distributing on the App Store needs the paid Apple Developer Program.\n- A **device with a HealthKit store** — iPhone, Apple Watch, Vision Pro, or an iPad on iPadOS 17 or later. HealthKit data isn't available on iPadOS 16 and earlier or on macOS, so guard against it at runtime, and test background delivery on a device: Apple says background queries aren't supported in the Simulator.\n- The **HealthKit capability** added to your app target, plus two Info.plist usage-description strings (below). Missing the one your request needs crashes the app at the authorization call.\n\nThere is no app-registration or partner-approval step like a cloud fitness API — authorization happens on the user's device. The external gate is App Review: Apple calls the purpose strings an App Store requirement for any HealthKit app, App Review Guideline 5.1.1 asks that they clearly and completely describe your use of the data and that you request only data your core features need, and Apple warns it may reject apps that enable the Clinical Health Records capability without actually using health records.\n\n## The strings you will paste\n\nEvery key and call in this table is copied from Apple's developer documentation, fetched on October 2, 2026. The quoted column is Apple's own wording, and the name in parentheses is the title Apple's documentation gives the item in Xcode.\n\n| String | Kind (Xcode name) | Apple's description, verbatim | Apple reference |\n|---|---|---|---|\n| `com.apple.developer.healthkit` | Entitlement (\"HealthKit\") | \"A Boolean value that indicates whether the app may request user authorization to access health and activity data that appears in the Health app.\" | [HealthKit Entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit) |\n| `NSHealthShareUsageDescription` | Info.plist key (\"Privacy - Health Share Usage Description\") | \"A message that explains to people why the app requests permission to read samples from the HealthKit store.\" | [NSHealthShareUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthshareusagedescription) |\n| `NSHealthUpdateUsageDescription` | Info.plist key (\"Privacy - Health Update Usage Description\") | \"A message to the user that explains why the app requested permission to save samples to the HealthKit store.\" | [NSHealthUpdateUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthupdateusagedescription) |\n| `com.apple.developer.healthkit.background-delivery` | Entitlement (\"HealthKit Observer Query Background Delivery\") | \"A Boolean value that indicates whether observer queries receive updates while running in the background.\" | [com.apple.developer.healthkit.background-delivery](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.background-delivery) |\n| `requestAuthorization(toShare:read:)` | `HKHealthStore` method, `async`, iOS 15+ | \"Asynchronously requests permission to save and read the specified data types.\" | [requestAuthorization(toShare:read:)](https://developer.apple.com/documentation/healthkit/hkhealthstore/requestauthorization%28toshare:read:%29) |\n| `requestAuthorization(toShare:read:completion:)` | `HKHealthStore` method, completion handler, iOS 8+ | \"Requests permission to save and read the specified data types.\" | [requestAuthorization(toShare:read:completion:)](https://developer.apple.com/documentation/healthkit/hkhealthstore/requestauthorization%28toshare:read:completion:%29) |\n\n## Step 1: Add the HealthKit capability and Info.plist keys\n\nIn Xcode, select your target, open **Signing & Capabilities**, and add the **HealthKit** capability. That is how the `com.apple.developer.healthkit` entitlement gets into your app; Apple's entitlement page says \"To add this entitlement to your app, enable the HealthKit capability in Xcode.\"\n\nThen add the two usage-description keys from the table: `NSHealthShareUsageDescription` if you **read** any health data, `NSHealthUpdateUsageDescription` if you **write / share** any. Their values are the text the system shows the user in the permission sheet. For projects created with Xcode 13 or later, Apple says to set these keys in the Target Properties list on the app's Info tab; projects created with Xcode 12 or earlier set them in the `Info.plist` file:\n\n```xml\n<!-- Info.plist -->\n<key>NSHealthShareUsageDescription</key>\n<string>We read your step count to show your daily activity progress.</string>\n<key>NSHealthUpdateUsageDescription</key>\n<string>We save completed workouts to your Health app.</string>\n```\n\nApple's `requestAuthorization` reference is blunt about skipping this step: \"You must set the usage keys, or your app will crash when you request authorization.\" Add the key for each operation you support before writing any code.\n\n## Step 2: Check availability and request authorization\n\nEverything starts with a single `HKHealthStore` instance. Before touching it, guard with the static **`HKHealthStore.isHealthDataAvailable()`**, which returns false on unsupported devices. Then call **`requestAuthorization(toShare:read:)`** with the set of types you want to write (`Set` of `HKSampleType`) and the set you want to read (`Set` of `HKObjectType`).\n\n```swift\nimport HealthKit\n\nlet healthStore = HKHealthStore()\n\nfunc requestAuth() async throws {\n    guard HKHealthStore.isHealthDataAvailable() else { return }\n\n    let stepType = HKQuantityType(.stepCount)          // iOS 15+ initializer\n    let toRead: Set<HKObjectType> = [stepType]\n    let toShare: Set<HKSampleType> = [stepType]\n\n    // Presents the system permission sheet.\n    try await healthStore.requestAuthorization(toShare: toShare, read: toRead)\n}\n```\n\nThe `async` form shown here is iOS 15+. Older code uses the completion-handler variant `requestAuthorization(toShare:read:completion:)`; either is fine. For targets older than iOS 15 you can build the step type with `HKObjectType.quantityType(forIdentifier: .stepCount)` instead of the `HKQuantityType(.stepCount)` initializer — but Apple's reference marks that class method for deprecation in iOS 27.2, so use it only where you have to.\n\n## Step 3: Understand the read-denial caveat (important)\n\nThis is the single most misunderstood part of HealthKit, so handle it deliberately. To avoid leaking whether a person has health data at all, **the system does not tell you whether the user granted or denied READ access.** `authorizationStatus(for:)` covers only the **share (write)** side — Apple: \"This method checks the authorization status for saving data\" — and tells you nothing about reads.\n\nThe consequence: `requestAuthorization` succeeding means the request was processed — Apple says the success value \"doesn't indicate whether the user actually granted permission\" — **not** that read was granted. Never gate your UI on read-authorization status. The documented behavior is that a denied read \"simply appears as if there is no data of the requested type\" (your own app's samples stay visible), so **run the query and treat an empty result as \"no data or no permission\"** — the two are indistinguishable by design. Build your UI to degrade gracefully when a query comes back empty.\n\nApple's authorization flow now adds a third case: a person can grant full access, access limited to a recent window of their history, or none. From iOS 27, `earliestAuthorizedSampleDate(for:)` returns the earliest readable date for each type under such a limit — the only authorization state Apple lets you identify — so start date-range queries no earlier than that date, and treat anything before it as unknown rather than empty.\n\n## Step 4: Read today's step count\n\nFor a running total like steps, use **`HKStatisticsQuery`** with the `.cumulativeSum` option (rather than summing raw samples yourself). Apple documents [`stepCount`](/healthkit/activity#id-stepcount) samples as using count units and measuring cumulative values, which is why the sum is the right statistic and the result is read in `HKUnit.count()`. Not every type is cumulative, so check a type's aggregation style in [HealthKit data types by group](/healthkit) before you pick an option. Scope the query with a date predicate so you only aggregate today's data:\n\n```swift\nfunc readTodaySteps() {\n    let stepType = HKQuantityType(.stepCount)\n    let startOfDay = Calendar.current.startOfDay(for: Date())\n    let predicate = HKQuery.predicateForSamples(\n        withStart: startOfDay, end: Date(), options: .strictStartDate)\n\n    let query = HKStatisticsQuery(\n        quantityType: stepType,\n        quantitySamplePredicate: predicate,\n        options: .cumulativeSum\n    ) { _, statistics, error in\n        guard let sum = statistics?.sumQuantity() else {\n            // Empty == no data OR read permission not granted (indistinguishable).\n            return\n        }\n        let steps = sum.doubleValue(for: HKUnit.count())\n        print(\"Steps today: \\(steps)\")\n    }\n    healthStore.execute(query)\n}\n```\n\nIf you need the individual raw samples instead of an aggregate — for example to inspect timestamps or the source app — use **`HKSampleQuery`** with the same predicate. For per-workout rep and form data that HealthKit does not capture, pair this with an on-device motion pipeline; the [AI workout tracking on iOS with Swift guide](/guides/ai-workout-tracking-ios-swift) walks through that side.\n\n## Step 5: Get background updates with HKObserverQuery\n\nPolling drains battery. To react when new data lands, register an **`HKObserverQuery`** and turn on **`enableBackgroundDelivery(for:frequency:withCompletion:)`**. Call the observer's completion handler when you finish processing: Apple says that if you don't, HealthKit keeps retrying with a backoff and, after your app fails to respond three times, stops sending background updates. Apple also says to set up observer queries in `application(_:didFinishLaunchingWithOptions:)`, so they exist before HealthKit delivers updates at launch.\n\n```swift\nfunc startObservingSteps() {\n    let stepType = HKQuantityType(.stepCount)\n\n    let observer = HKObserverQuery(sampleType: stepType, predicate: nil) {\n        _, completionHandler, error in\n        // Fetch new data here (e.g. an HKAnchoredObjectQuery), then:\n        completionHandler()   // Call it, or HealthKit backs off and eventually stops.\n    }\n    healthStore.execute(observer)\n\n    healthStore.enableBackgroundDelivery(\n        for: stepType, frequency: .immediate) { success, error in\n        // HKUpdateFrequency: .immediate, .hourly, .daily or .weekly — a maximum, not a schedule.\n    }\n}\n```\n\nFrequency is chosen from `HKUpdateFrequency` (`.immediate`, `.hourly`, `.daily`, `.weekly`), and it is a ceiling: Apple says the system wakes your app at most once per period, some sample types are capped at hourly, and on watchOS background updates share a budget with background app refresh tasks — four an hour, as long as the app has a complication on the active watch face. Design around eventual delivery, not guaranteed timing. If updates never arrive at all, work through [HealthKit background delivery not working](/fix/healthkit-background-delivery-not-working).\n\nTwo documented constraints sit on top of that. Apple's `enableBackgroundDelivery` reference says that for iOS 15 and watchOS 8 and later you must add the `com.apple.developer.healthkit.background-delivery` entitlement from the table above; without it, the call fails with an `HKError.Code.errorAuthorizationDenied` error. The same page notes that on iOS, `stepCount` samples have an hourly maximum frequency, so `.immediate` on steps still wakes your app at most once an hour.\n\n## Gotchas and production notes\n\n- **Read denial is invisible.** Repeating the Step 3 point because it bites everyone: never assume an empty query means \"no data.\" Always handle empty results as a valid, expected state.\n- **Both Info.plist keys or a crash.** Add `NSHealthShareUsageDescription` for reads and `NSHealthUpdateUsageDescription` for writes before your first authorization call.\n- **Availability first.** Guard every entry point with `HKHealthStore.isHealthDataAvailable()`; where it is false, Apple says other HealthKit methods fail with `errorHealthDataUnavailable` (or `errorHealthDataRestricted` where HealthKit is restricted, for example in an enterprise environment).\n- **Aggregate, don't hand-sum, for cumulative types.** Apple says statistics queries merge the data from all of your sources before calculating, unless you ask for `.separateBySource`; summing raw samples yourself counts overlapping iPhone and Apple Watch samples twice.\n- **App Review scrutinizes health usage.** Guideline 5.1.1 wants purpose strings that clearly and completely describe your use of the data, and access only to data relevant to your core functionality.\n- **Background delivery is throttled and entitled.** Treat `HKObserverQuery` plus `enableBackgroundDelivery` as best-effort, add the background-delivery entitlement, and always call the completion handler.\n- **Version-gate the volatile bits.** `HKQuantityType(.stepCount)` is iOS 15+; fall back to `HKObjectType.quantityType(forIdentifier:)` only on older targets (Apple marks it for deprecation in iOS 27.2), and verify current signatures in Apple's docs before release.",
    "faqs": [
      {
        "q": "Does Apple HealthKit use OAuth or API keys?",
        "a": "No. HealthKit is an on-device, permission-based framework, not a cloud API. There are no client secrets, access tokens, refresh flows, or server endpoints. The user grants access in a native system permission sheet and your app reads or writes a local, OS-managed store directly. What you need is an Apple Developer account to add the capability — Apple lists HealthKit for free accounts as well as paid ones — and the paid Apple Developer Program to distribute on the App Store."
      },
      {
        "q": "Why can't I tell whether the user granted read permission?",
        "a": "This is intentional. To avoid leaking whether a person has any health data, HealthKit does not report read-authorization status: authorizationStatus(for:) checks only whether your app may save a type, and a denied read simply looks like no data (apart from samples your own app wrote). Run your query and treat an empty result as no data or no permission. From iOS 27 the one read state you can detect is a limited history window, through earliestAuthorizedSampleDate(for:)."
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
        "a": "Use HKStatisticsQuery with the cumulativeSum option rather than fetching raw samples and adding them yourself. Apple says statistics queries merge the data from all of your sources before calculating, so an iPhone and an Apple Watch that both record steps are not simply added together. Verify version-gated details like the HKQuantityType(.stepCount) initializer, which is iOS 15+, against current Apple docs."
      }
    ],
    "related": [
      {
        "href": "/libraries/kingstinct-react-native-healthkit",
        "label": "@kingstinct/react-native-healthkit (library page)"
      },
      {
        "href": "/libraries/react-native-health",
        "label": "react-native-health (library page)"
      },
      {
        "href": "/healthkit-queries",
        "label": "HealthKit query classes explained"
      },
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
        "text": "Guard with HKHealthStore.isHealthDataAvailable(), then call requestAuthorization(toShare:read:) with the sets of types you want to write and read. Success means the request was processed, not that access was granted."
      },
      {
        "name": "Handle the read-denial caveat",
        "text": "For privacy, HealthKit does not report whether read access was granted, so authorizationStatus(for:) tells you only about saving. Never gate UI on read status; run the query, treat an empty result as no data or no permission, and from iOS 27 respect any limited history window."
      },
      {
        "name": "Read today's step count",
        "text": "Use HKStatisticsQuery with the cumulativeSum option and a date predicate to aggregate the day's steps, or HKSampleQuery for individual raw samples. Read the total from the returned sum quantity in count units."
      },
      {
        "name": "Get background updates",
        "text": "Register an HKObserverQuery and call enableBackgroundDelivery(for:frequency:withCompletion:) to react to new data without polling. Always call the observer's completion handler, or HealthKit backs off and, after three misses, stops delivering updates."
      }
    ],
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore",
        "checked": "2026-10-02",
        "note": "access point for HealthKit data; full, limited-window or no access"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/about-the-healthkit-framework",
        "checked": "2026-10-02",
        "note": "which devices have a HealthKit store; macOS and older iPadOS have none"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/setting-up-healthkit",
        "checked": "2026-10-02",
        "note": "capability, isHealthDataAvailable errors, Clinical Health Records review warning"
      },
      {
        "url": "https://developer.apple.com/documentation/xcode/configuring-healthkit-access",
        "checked": "2026-10-02",
        "note": "purpose strings as an App Store requirement; background-delivery capability"
      },
      {
        "url": "https://developer.apple.com/help/account/reference/supported-capabilities-ios",
        "checked": "2026-10-02",
        "note": "HealthKit capability for free and paid accounts; App Store distribution is paid-program only"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit",
        "checked": "2026-10-02",
        "note": "entitlement description, verbatim"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.background-delivery",
        "checked": "2026-10-02",
        "note": "background-delivery entitlement description, verbatim"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthshareusagedescription",
        "checked": "2026-10-02",
        "note": "read purpose-string key, verbatim"
      },
      {
        "url": "https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthupdateusagedescription",
        "checked": "2026-10-02",
        "note": "write purpose-string key, verbatim"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/requestauthorization(toshare:read:)",
        "checked": "2026-10-02",
        "note": "async form (iOS 15+), crash without usage keys"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/requestauthorization(toshare:read:completion:)",
        "checked": "2026-10-02",
        "note": "completion form (iOS 8+); success does not mean permission was granted"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/authorizationstatus(for:)",
        "checked": "2026-10-02",
        "note": "share-side status only; denied reads look like no data"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/earliestauthorizedsampledate(for:)",
        "checked": "2026-10-02",
        "note": "limited history window, iOS 27+"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkquantitytype/init(_:)",
        "checked": "2026-10-02",
        "note": "HKQuantityType(_:) is iOS 15+ and watchOS 8+"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkobjecttype/quantitytype(forIdentifier:)",
        "checked": "2026-10-02",
        "note": "deprecation marked at iOS 27.2"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/stepcount",
        "checked": "2026-10-02",
        "note": "count units, cumulative values"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkstatisticsquery/init(quantitytype:quantitysamplepredicate:options:completionhandler:)",
        "checked": "2026-10-02",
        "note": "statistics query initializer used in Step 4"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkstatistics",
        "checked": "2026-10-02",
        "note": "statistics merge data from all sources unless separateBySource"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkobserverquery/init(sampletype:predicate:updatehandler:)",
        "checked": "2026-10-02",
        "note": "observer query initializer and completion handler"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkobserverquerycompletionhandler",
        "checked": "2026-10-02",
        "note": "backoff and stop after three missed completions"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:)",
        "checked": "2026-10-02",
        "note": "entitlement requirement, hourly cap for stepCount, watchOS budget, no Simulator support, launch setup"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkupdatefrequency",
        "checked": "2026-10-02",
        "note": "immediate, hourly, daily and weekly"
      },
      {
        "url": "https://developer.apple.com/app-store/review/guidelines/",
        "checked": "2026-10-02",
        "note": "guideline 5.1.1 purpose strings and data minimization"
      }
    ]
  },
  {
    "slug": "google-health-connect",
    "primaryQuery": "how to integrate Google Health Connect",
    "h1": "How to Integrate Google Health Connect (2026)",
    "metaTitle": "How to Integrate Google Health Connect (2026)",
    "metaDescription": "Integrate Google Health Connect on Android: add the connect-client library, request on-device permissions, read steps, pass the Play Console review.",
    "updated": "2026-10-02",
    "answer": "Google Health Connect gives Android apps on-device access to health and fitness data (steps, heart rate, sleep, calories, and more) from a single OS-managed store. It is not an OAuth cloud API: the user grants access in a system permission sheet and your Kotlin code reads records locally through the androidx.health.connect:connect-client library. It needs no Google Cloud project or OAuth client — Google lists its registration as a Play Store project plus a health apps declaration — and it is Android-only. The one hard requirement before shipping is that Play Console Health apps declaration, listing every data type you read or write.",
    "body": "If you also need iOS, Health Connect is the Android half of a two-platform job — see [Apple HealthKit vs. Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect) for how the two compare, because you integrate each SDK natively and there is no shared endpoint between them. Health Connect's Play Console gate, and every page on this site that covers it, are collected in the [Health Connect API overview](/apis/health-connect). Coming from Google Fit? [The reading path for getting off Google Fit](/paths) orders this guide with the shutdown timeline, the migration plan and the empty-read fix.\n\n## What you'll need\n\n- **An Android app** targeting a reasonably recent SDK. Google's guide says the SDK supports Android 8 (API 26) and up, but Health Connect itself needs Android 9 (API 28) or later: on Android 14 and later it is part of the platform, and on Android 13 and lower it is a separate app the user installs from the Play Store.\n- **Health Connect available on the device.** Your code should check availability and route the user to install or update it if it is missing or out of date.\n- **The `connect-client` Jetpack dependency** (add it to your module's `build.gradle`).\n- **A Play Console Health apps declaration** listing every data type you read or write. This is a publishing requirement — plan for it, and note Google says the declaration may be reviewed again when you submit a new app version.\n\n> **Verify the library version.** The Jetpack library updates frequently. Pin whatever the current stable (or intended alpha) release is from the official docs rather than copying a version string from any tutorial, including this one. When this page was checked on October 2, 2026, Google announced 1.1.0 as the stable release and its get-started guide pinned `1.2.0-alpha06`.\n\n```groovy\n// build.gradle (module) — check the docs for the current version\ndependencies {\n    implementation \"androidx.health.connect:connect-client:<latest-version>\"\n}\n```\n\n## The strings you will paste\n\nThese are the manifest permissions for the data this guide reads and writes. Each description is copied verbatim from Android's [`HealthPermissions` reference](https://developer.android.com/reference/android/health/connect/HealthPermissions), and the pairing of record type to permission comes from Android's [Health Connect data types list](https://developer.android.com/health-and-fitness/health-connect/data-types); both were fetched on October 2, 2026.\n\n| Used for | Manifest string | Android's description, verbatim | Android reference |\n|---|---|---|---|\n| Reading `StepsRecord` | `android.permission.health.READ_STEPS` | \"Allows an application to read the user's steps data.\" | [READ_STEPS](https://developer.android.com/reference/android/health/connect/HealthPermissions#READ_STEPS) |\n| Writing `StepsRecord` | `android.permission.health.WRITE_STEPS` | \"Allows an application to write the user's steps data.\" | [WRITE_STEPS](https://developer.android.com/reference/android/health/connect/HealthPermissions#WRITE_STEPS) |\n| Read historical data (older than 30 days) | `android.permission.health.READ_HEALTH_DATA_HISTORY` | \"Allows an application to read the entire history of health data (of any type).\" | [READ_HEALTH_DATA_HISTORY](https://developer.android.com/reference/android/health/connect/HealthPermissions#READ_HEALTH_DATA_HISTORY) |\n| Read data in background | `android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND` | \"Allows an application to read health data (of any type) in background.\" | [READ_HEALTH_DATA_IN_BACKGROUND](https://developer.android.com/reference/android/health/connect/HealthPermissions#READ_HEALTH_DATA_IN_BACKGROUND) |\n\nIn Kotlin you request the same four as `HealthPermission.getReadPermission(StepsRecord::class)`, `HealthPermission.getWritePermission(StepsRecord::class)`, `HealthPermission.PERMISSION_READ_HEALTH_DATA_HISTORY` and `HealthPermission.PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND`. Android's [Jetpack `HealthPermission` reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission) adds that the history and background permissions depend on the version of Health Connect installed on the device, so check `getFeatureStatus` (on `healthConnectClient.features`) with `HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_HISTORY` or `HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_IN_BACKGROUND` before requesting either.\n\n## Step 1: Declare your permissions in the manifest\n\nEvery health data type you touch is its own permission. Declare each one in `AndroidManifest.xml`. If you need history older than the default window (covered in Step 5), declare that permission too.\n\n```xml\n<!-- AndroidManifest.xml -->\n<uses-permission android:name=\"android.permission.health.READ_STEPS\"/>\n<uses-permission android:name=\"android.permission.health.WRITE_STEPS\"/>\n<!-- Only if you need data older than ~30 days: -->\n<uses-permission android:name=\"android.permission.health.READ_HEALTH_DATA_HISTORY\"/>\n```\n\nAt runtime you refer to these same permissions as typed strings derived from the record class, not raw manifest names — for example `HealthPermission.getReadPermission(StepsRecord::class)`. Keep the manifest list and your runtime set in sync: Google's get-started guide says every permission in your request set must be declared in the manifest first, and that the manifest list should match the data types you declare in the Play Console.\n\n## Step 2: Check availability and get the client\n\nNever assume Health Connect is installed. Call `HealthConnectClient.getSdkStatus(context)` and compare it against `HealthConnectClient.SDK_AVAILABLE`. Only then create the client with `HealthConnectClient.getOrCreate(context)`. If the SDK is unavailable, send the user to install or update the Health Connect app.\n\n```kotlin\nimport androidx.health.connect.client.HealthConnectClient\n\nval status = HealthConnectClient.getSdkStatus(context)\nval healthConnectClient =\n    if (status == HealthConnectClient.SDK_AVAILABLE) {\n        HealthConnectClient.getOrCreate(context)\n    } else {\n        // SDK_UNAVAILABLE or SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED —\n        // prompt the user to install or update Health Connect, then stop.\n        null\n    }\n```\n\n## Step 3: Request permissions at runtime\n\nBuild the set of permissions you need as typed strings, then request them through the Health Connect permission contract. The health permissions carry Android's \"dangerous\" protection level, but you don't request them with the generic runtime-permission API: Google's guide uses `PermissionController.createRequestPermissionResultContract()` with an Activity Result launcher (or `rememberLauncherForActivityResult` in Compose), which displays the Health Connect permissions screen. The callback hands you the set of **granted** permissions, so you check whether it contains everything you asked for.\n\n```kotlin\nimport androidx.health.connect.client.PermissionController\nimport androidx.health.connect.client.permission.HealthPermission\nimport androidx.health.connect.client.records.StepsRecord\n\nval permissions = setOf(\n    HealthPermission.getReadPermission(StepsRecord::class),\n    HealthPermission.getWritePermission(StepsRecord::class)\n)\n\n// Compose example\nval requestPermissions = rememberLauncherForActivityResult(\n    contract = PermissionController.createRequestPermissionResultContract()\n) { granted ->\n    if (granted.containsAll(permissions)) {\n        // Proceed — every requested permission was granted.\n    } else {\n        // User denied one or more. Degrade gracefully; do not re-prompt in a loop.\n    }\n}\n\n// Launch when the user taps \"Connect\":\n// requestPermissions.launch(permissions)\n```\n\nNote the difference from HealthKit here: Health Connect **does** tell you which permissions were granted, so you can branch on the actual result instead of guessing.\n\n## Step 4: Read the user's data\n\nWith permission granted, read records inside a coroutine using `readRecords(ReadRecordsRequest(...))`, scoped by a `TimeRangeFilter`. Every read returns a list of typed record objects.\n\n```kotlin\nimport androidx.health.connect.client.request.ReadRecordsRequest\nimport androidx.health.connect.client.time.TimeRangeFilter\nimport java.time.Instant\n\nsuspend fun readSteps(start: Instant, end: Instant): List<StepsRecord> {\n    val client = healthConnectClient ?: return emptyList()\n    val response = client.readRecords(\n        ReadRecordsRequest(\n            StepsRecord::class,\n            timeRangeFilter = TimeRangeFilter.between(start, end)\n        )\n    )\n    return response.records\n}\n```\n\nFor a **step total**, prefer `aggregate()` with `StepsRecord.COUNT_TOTAL` over summing raw records yourself. Multiple apps can write steps for the same window, and summing raw reads counts overlapping sources twice; Google says the aggregation API \"contains logic to handle duplicate records.\"\n\n```kotlin\nimport androidx.health.connect.client.request.AggregateRequest\n\nsuspend fun readStepTotal(start: Instant, end: Instant): Long {\n    val client = healthConnectClient ?: return 0L\n    val response = client.aggregate(\n        AggregateRequest(\n            metrics = setOf(StepsRecord.COUNT_TOTAL),\n            timeRangeFilter = TimeRangeFilter.between(start, end)\n        )\n    )\n    return response[StepsRecord.COUNT_TOTAL] ?: 0L\n}\n```\n\n## Step 5: Handle the 30-day history limit\n\nBy default, a freshly granted app can read only data from **up to 30 days before** the first permission grant. Android's Jetpack reference spells out what happens past that line: reading a single older record by ID (`readRecord`) throws, while `readRecords`, `aggregate` and the other reads simply leave the older data points out. To read older history you must request the dedicated history permission: `HealthPermission.PERMISSION_READ_HEALTH_DATA_HISTORY` in Kotlin, `android.permission.health.READ_HEALTH_DATA_HISTORY` in the manifest (both from the table above, checked against Android's reference on October 2, 2026). This is separate from the background-read permission, which controls whether you can read while your app is backgrounded.\n\nOne more sharp edge: reinstalling your app **resets** the 30-day window, so a returning user's deep history becomes unavailable again until they re-grant (and you hold the history permission). Design onboarding so a user without the history permission still gets a useful recent view.\n\n## Step 6: Complete the Play Console declaration and ship\n\nBefore your app can be published with Health Connect access, you must fill out the **Health apps declaration** in the Play Console, listing every data type you read and write and justifying each. This is a policy gate, not a formality: Google says not to request types your user-facing features don't need, and an app published without declaring its types leaves users facing an error dialog when they try to connect it to Health Connect. Do this early — Google notes the declaration may be reviewed again when you submit a new app version, and must be refiled whenever your set of data types changes.\n\nProduction notes to plan for:\n\n- **Availability drift.** On Android 13 and lower users can uninstall the Health Connect app (on Android 14 and later it is part of the system and can't be uninstalled), and on any version they can revoke a permission at any time — Google's guide says to check permissions every time before using them. Re-check `getSdkStatus` and handle empty or error responses on every read, not just at first launch.\n- **Grant the minimum.** Request only the record types your feature needs; Google's publishing guide asks for the minimum data types and a valid use case for each.\n- **Data types are typed classes.** `StepsRecord` is one of [42 record types](/health-connect) in Google's data-types table (`HeartRateRecord`, `SleepSessionRecord`, `TotalCaloriesBurnedRecord`, and more). Each read and write permission is per-class, so scope your request set deliberately.\n- **Backgrounded reads need their own permission.** If you sync in the background, add `android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND` (in the table above) on top of your data-type permissions, and check the feature status before you request it.\n\nOnce step and workout data is flowing, wiring it into a live tracking experience is the next step — [add AI workout tracking on Android with Kotlin](/guides/ai-workout-tracking-android-kotlin) walks through turning that data (plus on-device pose tracking) into rep counting and form feedback. For the broader landscape of device and health-data sources, see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview.",
    "faqs": [
      {
        "q": "Does Google Health Connect use OAuth or an API key?",
        "a": "No. Health Connect is on-device and permission-based, not a cloud API. There is no client secret, token exchange, or server endpoint — Google's own comparison lists it as \"No OAuth required (on-device permissions)\". The user grants access in a system permission sheet and your app reads from a local, OS-managed store through the connect-client library."
      },
      {
        "q": "Do I need approval to use Health Connect?",
        "a": "There is no OAuth partner-approval step, and Google's data-types guide places the declaration at the point you prepare to publish. To publish an app that uses Health Connect you must complete the Play Console Health apps declaration listing every data type you read or write, justify each one, and refile it whenever the set changes. Google tells you not to request types your features don't need. Treat that declaration as a required gate before release."
      },
      {
        "q": "Do I need a separate permission to read Health Connect data in the background?",
        "a": "Yes. The per-record-type permissions you request cover reads while your app is in the foreground; reading after the app has been backgrounded needs the dedicated background-read permission on top of them, and that is separate again from the historical-read permission. Android's Jetpack reference says a background read without it may result in an error, and that availability depends on the Health Connect version on the device, so check FEATURE_READ_HEALTH_DATA_IN_BACKGROUND before requesting it. As of October 2026 the manifest string is android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND (see the strings table above); re-check it against Android's HealthPermissions reference when you upgrade."
      },
      {
        "q": "Which library and version should I use?",
        "a": "Use the androidx.health.connect:connect-client Jetpack library. It updates frequently, so pin the current stable or intended release from the official Health Connect docs rather than copying a version from a tutorial; on October 2, 2026 Google announced 1.1.0 as stable. The class and method names used here, such as HealthConnectClient.getOrCreate and readRecords, are part of that 1.1.0 API."
      },
      {
        "q": "Is Health Connect available on all Android devices?",
        "a": "No. Google says Health Connect needs Android 9 or later with Google Play services. On Android 14 and later it is part of the platform, while on Android 13 and lower it is a separate app the user installs from the Play Store. Always check HealthConnectClient.getSdkStatus and prompt the user to install or update Health Connect when it is unavailable, rather than assuming it is present."
      }
    ],
    "related": [
      {
        "href": "/health-connect",
        "label": "Health Connect record types"
      },
      {
        "href": "/libraries/flutter-health",
        "label": "Flutter health package (library page)"
      },
      {
        "href": "/libraries/react-native-health-connect",
        "label": "react-native-health-connect (library page)"
      },
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
      },
      {
        "href": "/health-connect-api",
        "label": "Health Connect Jetpack API, method by method"
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
        "text": "By default an app can only read data from up to 30 days before the first grant, and reinstalling resets that window. To read older data, request PERMISSION_READ_HEALTH_DATA_HISTORY (android.permission.health.READ_HEALTH_DATA_HISTORY in the manifest), after checking the feature is available on the device."
      },
      {
        "name": "Complete the Play Console declaration and ship",
        "text": "Fill out the Play Console Health apps declaration listing every data type you access, since it is a policy gate for publishing. Re-check availability and permissions on every read and request only the record types your feature needs."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/get-started",
        "checked": "2026-10-02",
        "note": "SDK vs app minimum Android versions, connect-client dependency, manifest-first permissions, getSdkStatus, permission contract, 30-day note"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/availability",
        "checked": "2026-10-02",
        "note": "Android 9+ with Play services; framework module that can't be uninstalled on Android 14"
      },
      {
        "url": "https://developer.android.com/reference/android/health/connect/HealthPermissions",
        "checked": "2026-10-02",
        "note": "verbatim descriptions of the four manifest permissions; dangerous protection level"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission",
        "checked": "2026-10-02",
        "note": "Kotlin permission constants, feature-status checks, history and background behavior"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient",
        "checked": "2026-10-02",
        "note": "getSdkStatus constants and getOrCreate"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/PermissionController",
        "checked": "2026-10-02",
        "note": "createRequestPermissionResultContract and getGrantedPermissions"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/read-data",
        "checked": "2026-10-02",
        "note": "readRecords, aggregation de-duplication, background reads, 30-day window and reinstall reset"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/data-types",
        "checked": "2026-10-02",
        "note": "record-type to permission pairing; 42 record types; declaration at publish time"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/publish",
        "checked": "2026-10-02",
        "note": "Health apps declaration: minimum types, justification, refiling, re-review, error dialog for undeclared types"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/migration/fit",
        "checked": "2026-10-02",
        "note": "registration and \"No OAuth required\" comparison"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/guides/health-connect",
        "checked": "2026-10-02",
        "note": "Jetpack library 1.1.0 stable"
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
    "answer": "The Fitbit Web API returns a user's activity, steps, heart rate, sleep, and profile data after they authorize your app over OAuth 2.0 (authorization-code grant, PKCE recommended). You register an app, send the user through Fitbit's authorize page, exchange the code for a Bearer access token, and call the REST API with it. Critically, Google's Google Health API page (read October 12, 2026) lists end of support for the legacy Fitbit Web API on September 30, 2026 and a full turn-off on October 30, 2026, with the Google Health API, which uses Google OAuth 2.0, as its successor. Google's Health API migration guide says existing tokens cannot be transferred, so every user must re-consent, and new integrations should target Google Health directly.",
    "body": "## Read this first: the Fitbit Web API's successor is the Google Health API\n\nGoogle, which owns Fitbit, announced \"the next phase of the Fitbit Web API\", retiring the legacy Fitbit Web API described on this page in favour of the new **Google Health API**, which uses **Google `OAuth 2.0`** instead of Fitbit's own authorization server.\n\n[Google's Google Health API page](https://developers.google.com/health/about) (read October 12, 2026) publishes the timeline. Support for the legacy Fitbit Web API ended on **September 30, 2026**, and the API keeps operating without bug fixes or API support until **October 30, 2026**, when Google turns it off and it stops functioning or syncing data. Google's [Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations. Our [Fitbit API deprecation status](/fitbit-api-shutdown) page separates what is confirmed from what is only reported.\n\nThe critical detail for developers: Google's [Health API migration guide](https://developers.google.com/health/migration) says existing Fitbit access tokens and refresh tokens **cannot be transferred** to the Google Health API. Every user must actively re-consent through Google `OAuth 2.0`. The same guide says each user must also sign in to the Google Health mobile app, linking Google Health to their Google Account, before your app can sync their data.\n\n> **Migration callout (verify against current docs).** If you are starting a NEW integration, target the **Google Health API** (`https://developers.google.com/health`) with Google `OAuth 2.0` directly — do not build fresh on the legacy Fitbit Web API, which Google turns off on October 30, 2026. Tokens do not migrate; users re-consent. Use the legacy flow below only for an existing integration that still answers, and plan a phased re-consent path onto Google Health. Confirm the current status on the Google Health API pages.\n\nThe successor's data types, scopes, methods and rate limits, read from Google's own documentation, are in [the Google Health API reference](/google-health-api).\n\nWith that context set, the rest of this guide covers the legacy Fitbit Web API `OAuth 2.0` flow — useful for maintaining an existing integration for as long as the legacy API answers. For a broader look at how Fitbit compares in this space, see [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) and the [wearable data APIs](/fitness-apis/wearable-data-apis) roundup; Fitbit's access requirements, and every page on this site that covers Fitbit, are collected in the [Fitbit API overview](/apis/fitbit).\n\n## What you'll need\n\n- A **Fitbit (or Google) account** to sign in to the developer portal.\n- A registered app at `https://dev.fitbit.com`, which gives you a **Client ID** and (for server apps) a **Client Secret**.\n- A **redirect/callback URL** under your control to receive the authorization code.\n- For minute- or second-level **intraday** data (heart rate, steps), a separate approval — see the last step.\n\n## Step 1: Register your app\n\nSign in at `https://dev.fitbit.com` and choose \"Register an App.\" The important field is the **OAuth 2.0 Application Type**, which governs how you authenticate:\n\n- **Client** — mobile apps or single-page apps that omit the Client Secret. These **must use PKCE**.\n- **Server** — confidential backends that authenticate with the Client Secret. PKCE is still recommended.\n- **Personal** — required to access **intraday** data for your own account without extra approval.\n\nSet your Callback URL and the default scopes you plan to request. You will receive a **Client ID**, and server/confidential apps also get a **Client Secret**. Note that Fitbit does not let you force users to grant every scope — the user chooses per data collection.\n\n## Step 2: Generate a PKCE pair and redirect the user to authorize\n\nFor public (Client) apps, create a PKCE pair first. The `code_verifier` is a cryptographically random string of 43 to 128 characters; the `code_challenge` is the BASE64URL-encoded SHA-256 hash of that verifier, sent with `code_challenge_method=S256`.\n\nThen send the user to Fitbit's authorize endpoint. The documented scopes include `activity`, `heartrate`, `sleep`, and `profile` (the full set also covers `location`, `nutrition`, `oxygen_saturation`, `respiratory_rate`, `settings`, `social`, `temperature`, and `weight` — verify the current list in the docs).\n\n```http\nGET https://www.fitbit.com/oauth2/authorize\n  ?client_id=CLIENT_ID\n  &response_type=code\n  &scope=activity%20heartrate%20sleep%20profile\n  &code_challenge=CODE_CHALLENGE\n  &code_challenge_method=S256\n  &state=RANDOM_STATE\n  &redirect_uri=https%3A%2F%2Fyourapp.example.com%2Fcallback\n```\n\nOn approval, Fitbit redirects back to your `redirect_uri` with `?code=AUTH_CODE&state=RANDOM_STATE`. Always check that the returned `state` matches the value you sent.\n\n## Step 3: Exchange the authorization code for tokens\n\nPOST the authorization code to Fitbit's token endpoint. Public (Client) apps authenticate with the `client_id` plus the PKCE `code_verifier` and no secret:\n\n```bash\ncurl -X POST \"https://api.fitbit.com/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=AUTH_CODE\" \\\n  -d \"code_verifier=CODE_VERIFIER\" \\\n  -d \"redirect_uri=https://yourapp.example.com/callback\"\n```\n\nConfidential (Server) apps additionally send an HTTP Basic auth header instead of relying only on PKCE:\n`-H \"Authorization: Basic BASE64(client_id:client_secret)\"`.\n\nA successful response returns JSON with the Bearer token you will use for all API calls:\n\n```json\n{\n  \"access_token\": \"eyJ...\",\n  \"expires_in\": 28800,\n  \"refresh_token\": \"c643...\",\n  \"scope\": \"activity heartrate sleep profile\",\n  \"token_type\": \"Bearer\",\n  \"user_id\": \"ABC123\"\n}\n```\n\nThe `expires_in` value of 28800 seconds (8 hours) is the commonly documented lifetime — verify the current value against the docs.\n\n## Step 4: Fetch data with the Bearer token\n\nCall the REST API with `Authorization: Bearer ACCESS_TOKEN`. In the path, `-` means \"the authenticated user\" (`user/-`) and the leading `1` is the API version. Here is a daily activity summary:\n\n```bash\ncurl -X GET \"https://api.fitbit.com/1/user/-/activities/date/2026-07-08.json\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nAnd a steps time series covering the 30 days ending on a date:\n\n```bash\ncurl -X GET \"https://api.fitbit.com/1/user/-/activities/steps/date/2026-07-08/30d.json\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nResponses are `application/json`. Sleep, heart rate, and profile follow the same `user/-` pattern under their own resource paths.\n\n## Step 5: Refresh tokens before they expire\n\nAccess tokens are short-lived, so refresh with the stored `refresh_token` to get a new access token without sending the user back through consent:\n\n```bash\ncurl -X POST \"https://api.fitbit.com/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=REFRESH_TOKEN\" \\\n  -d \"client_id=CLIENT_ID\"\n```\n\nConfidential apps include the same HTTP Basic auth header used in Step 3. Persist the returned tokens and refresh proactively (for example, shortly before expiry) rather than waiting for a 401. If a call does come back 401, [Fitbit error code 401](/fix/fitbit-error-code-401) shows how to read the `errorType` that separates an expired token from an invalid one.\n\n## Step 6: Handle rate limits and request intraday access\n\nTwo production limits matter most:\n\n- **Rate limit: 150 API requests per hour, per consented user.** The counter resets around the top of each hour and applies to all calls made with a given user's access token. Over the limit returns **HTTP 429** with a header indicating seconds until reset (commonly `Retry-After` or a `Fitbit-Rate-Limit-Reset` header — verify the exact name in the docs). Back off and retry after the reset rather than hammering the endpoint. [A tested, dependency-free rate-limit fetch wrapper](/cookbook/rate-limit-fetcher) implements that, with a per-user budget and `Retry-After` read in both of its forms.\n- **Intraday data requires special approval.** Minute- or second-level series (for example steps or heart rate) are available by default only to **Personal** apps for their own data. Other app types must request intraday access from Fitbit/Google. Intraday requests are also limited to a 24-hour window per request; wider date ranges return summary data only.\n\nAn intraday steps request (1-minute detail, requires approval) looks like this:\n\n```bash\ncurl -X GET \"https://api.fitbit.com/1/user/-/activities/steps/date/2026-07-08/1d/1min.json\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\n## Gotchas and production notes\n\n- **Plan for the migration now.** The single biggest risk with any legacy Fitbit integration is the October 30, 2026 turn-off listed on Google's Google Health API page, a month after support ended on September 30, 2026. Do not start new builds here; if you are maintaining an existing one, build a phased re-consent flow onto the Google Health API and Google `OAuth 2.0`. Google says every current integration must migrate its apps and users as soon as possible.\n- **Tokens do not transfer.** Google's Health API migration guide says existing access and refresh tokens cannot be transferred, so every user re-authorizes.\n- **PKCE is mandatory for public clients.** Mobile and SPA apps that omit the Client Secret must use `S256`.\n- **Scopes are per-collection and user-controlled.** Verify the granted `scope` in the token response; users can decline individual collections.\n- **Volatile values change.** Token TTL and the rate-limit header name are both flagged \"verify against current docs\" — confirm them on the primary developer pages before you ship.\n\nFor how Fitbit stacks up against another major wearable platform, see [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api); for the wider category, the [wearable data APIs](/fitness-apis/wearable-data-apis) guide covers the approval gates and rate limits across providers.",
    "faqs": [
      {
        "q": "Is the Fitbit Web API being shut down?",
        "a": "Yes. Google announced the retirement of the legacy Fitbit Web API in favour of the Google Health API, which uses Google OAuth 2.0. Google's Google Health API page (read October 12, 2026) lists end of support on September 30, 2026 and a full turn-off on October 30, 2026, after which the legacy API no longer functions or syncs data. Google's Fit migration guide, updated September 10, 2026, also lists the Google Health API as the recommended path for Fitbit Web API integrations."
      },
      {
        "q": "Do my existing Fitbit OAuth tokens transfer to the Google Health API?",
        "a": "No. Google's Health API migration guide says existing Fitbit access and refresh tokens cannot be transferred to the Google Health API. Every user must actively re-consent through Google OAuth 2.0, so build a phased re-consent flow that moves users across in cohorts."
      },
      {
        "q": "Should I build a new integration on the Fitbit Web API or Google Health?",
        "a": "For a new integration, target the Google Health API with Google OAuth 2.0 directly: Google's Fit migration guide lists it as the recommended path for Fitbit Web API integrations, and Google's Google Health API page lists the legacy API's turn-off for October 30, 2026. Use the legacy flow only to maintain an existing integration for as long as it still answers. Verify the current status in the official docs."
      },
      {
        "q": "Which OAuth scopes do I need to request from Fitbit?",
        "a": "Only the collections your features actually use. The documented scopes include activity, heartrate, sleep, and profile, with the full set also covering location, nutrition, oxygen_saturation, respiratory_rate, settings, social, temperature, and weight — verify the current list in the docs. Fitbit does not let you force a user to grant everything: consent is per data collection, so someone can approve activity and decline heart rate. Read the scope value returned with the token rather than assuming you got what you asked for, and degrade the UI when a collection is missing."
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
    "metaTitle": "Strava API (2026): Access Tiers, OAuth, Webhooks, Limits",
    "metaDescription": "Integrate the Strava API: single-player mode, the 10-athlete review, OAuth scopes, rotating tokens, the one-per-app webhook, rate limits and 2026 changes.",
    "updated": "2026-10-17",
    "answer": "The Strava API gives your app an athlete's activities, routes, gear and profile through OAuth 2.0: you send the athlete to Strava's consent screen, exchange the returned code for a six-hour access token and a refresh token that can change on every refresh, and call the v3 REST API with a Bearer token. Access is gated before any code runs: Strava says a subscription is a prerequisite for creating an app, every new app starts in single-player mode where only your own account can connect, a self-service upgrade raises that to 10 athletes, and more than 10 requires Strava's review. Use the single webhook subscription each app is allowed instead of polling, and read the overall and non-upload rate-limit headers on every response.",
    "body": "Strava is the natural integration for a social running or cycling app, where athletes already record activities and expect them to sync. If you are building that kind of product, this pairs well with the wider [wearable data APIs](/fitness-apis/wearable-data-apis) layer and the app-shape decisions in [how to build a running app](/build/running-app). Strava's access requirements, and every page on this site that covers it, are collected in the [Strava API overview](/apis/strava).\n\n> **Checked against Strava's own pages on October 17, 2026.** Every limit, scope and date below comes from developers.strava.com or Strava's legal pages as fetched that day. Strava changed its access model, rate limits and terms in 2026, so treat older tutorials (and older versions of this page) as out of date.\n\n## Access and approval: single-player mode first\n\nStrava's getting-started guide says a Strava subscription is a prerequisite for creating an app, and that \"All new applications start in single-player mode\", the default state in which only your own Strava account can authenticate with the app. That is enough to build and test against your own data, not to serve anyone else.\n\nFrom there access grows in two steps:\n\n| Stage | Who can connect | Rate limits Strava documents | How you get there |\n|---|---|---|---|\n| Single-player mode | Only you (athlete capacity 1) | Overall 200 requests / 15 min and 2,000 / day; non-upload 100 / 15 min and 1,000 / day | Create an app at `https://www.strava.com/settings/api` |\n| Self-service upgrade | Up to 10 athletes | Overall 400 / 15 min and 4,000 / day; read 200 / 15 min and 2,000 / day | Upgrade from the API Settings Dashboard once the app is configured |\n| Reviewed app | More than 10 athletes | Raised case by case | Submit the Developer Program form for review |\n\nThe review form asks for screenshots of every place Strava data appears and of the \"Connect with Strava\" button, and Strava says plainly that increased access is not a guarantee. Its API Policy, effective June 1, 2026, adds that admission to the Developer Program is at Strava's discretion with no fixed review-time commitment.\n\nThe same policy sorts apps into access tiers. The Standard Tier covers apps limited to 10 registered users and apps limited to 9,999, and is subject to subscription requirements, \"including a requirement that the developer or specified end users maintain an active Strava subscription\". The Extended Access Tier, generally for apps serving 10,000 users or more, is admitted case by case and is not subject to those subscription requirements unless Strava publishes otherwise. What the subscription costs is covered on [Strava API pricing](/pricing/strava-api-pricing).\n\n## What you'll need\n\n- A Strava account with a subscription, and an app registered at `https://www.strava.com/settings/api`, which gives you a **Client ID** and **Client Secret**.\n- An **Authorization Callback Domain** on the app. Strava requires your `redirect_uri` to be within that domain, and white-lists `localhost` and `127.0.0.1` for development.\n- A backend to hold the Client Secret and each athlete's refresh token. The token exchange, refresh, revoke and webhook-subscription calls all need the secret, so it never belongs in a mobile or browser client.\n- For webhooks: a public HTTPS callback that can answer Strava's validation request within two seconds.\n\n## Auth and scopes\n\nStrava uses OAuth 2.0 authorization code. Web apps send the athlete to `GET https://www.strava.com/oauth/authorize`; Android and iOS apps use `https://www.strava.com/oauth/mobile/authorize`, which opens the Strava app when it is installed (version 75.0 or later) and falls back to mobile web otherwise.\n\nRequest only the scopes you need. Strava documents seven:\n\n| Scope | What it grants, per Strava |\n|---|---|\n| `read` | Public segments, public routes, public profile data, public posts, public events, club feeds and leaderboards |\n| `read_all` | Private routes, private segments and private events |\n| `profile:read_all` | All profile information, even if visibility is Followers or Only You |\n| `profile:write` | Update weight and FTP, star or unstar segments |\n| `activity:read` | Activities visible to Everyone and Followers, excluding privacy zone data |\n| `activity:read_all` | The same as `activity:read`, plus privacy zone data and Only You activities |\n| `activity:write` | Create manual activities and uploads, and edit activities visible to the app |\n\nScopes go in the `scope` parameter \"as a comma- or URL-safe space-delimited string\", and `activity:read` is required for activity webhooks. The athlete can untick any scope on the consent screen, so read what comes back:\n\n```\nhttps://www.strava.com/oauth/authorize\n  ?client_id=CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/exchange_token\n  &response_type=code\n  &approval_prompt=auto\n  &scope=read,activity:read_all\n```\n\n`approval_prompt` is `auto` by default; `force` always shows the prompt. A denial comes back as `error=access_denied`; an approval as `code` plus the accepted `scope`. The code is short-lived and single-use, so exchange it straight away from your server:\n\n```bash\ncurl -X POST \"https://www.strava.com/oauth/token\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"client_secret=CLIENT_SECRET\" \\\n  -d \"code=AUTH_CODE\" \\\n  -d \"grant_type=authorization_code\"\n```\n\nThe response carries `access_token`, `refresh_token`, `expires_at`, `expires_in` and an athlete summary. Since April 23, 2026 it also returns a `scope` field: a space-delimited list of what was granted, which can be narrower than what you asked for.\n\n### Refresh, and why the refresh token changes\n\nStrava's access tokens expire six hours after they are created. Refresh with `grant_type=refresh_token` against the same token endpoint:\n\n```bash\ncurl -X POST \"https://www.strava.com/oauth/token\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"client_secret=CLIENT_SECRET\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=REFRESH_TOKEN\"\n```\n\nIf the athlete's current access token still has more than an hour to live, Strava returns that same token; within the last hour, it issues a new one. Every successful call can return a different refresh token, and Strava says that once a new refresh token is returned, the older one is invalidated immediately. Persist the newest refresh token per athlete, and serialize refreshes so a background job and a user action cannot race and strand the athlete.\n\n## Data: the activities endpoint\n\nThe v3 REST API covers athletes, activities, routes and gear. To list the authenticated athlete's activities:\n\n```bash\ncurl -X GET \"https://www.strava.com/api/v3/athlete/activities?per_page=30&page=1\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nStrava's Swagger spec documents `before` and `after` (epoch timestamps) to window the results, and its docs say lists are paginated to 30 items by default with `per_page` up to 200. A page can hold fewer items than requested even when it is not the last, so iterate until an empty page comes back. The endpoint requires `activity:read`, and Only You activities are filtered out unless the token carries `activity:read_all`. Strava publishes the full spec at `https://developers.strava.com/swagger/swagger.json`, which you can feed to Swagger Codegen 2.x to generate a client.\n\n## Webhooks: one subscription, pointer events\n\nStrava encourages every app to use its webhook events API, and its getting-started guide says that, per the API terms, you need webhooks to know when an athlete has deauthorized your app. Each application may have only one subscription, which receives events for every athlete who authorized it. Create it with your client credentials:\n\n```bash\ncurl -X POST \"https://www.strava.com/api/v3/push_subscriptions\" \\\n  -F client_id=CLIENT_ID \\\n  -F client_secret=CLIENT_SECRET \\\n  -F callback_url=https://yourapp.example.com/webhook \\\n  -F verify_token=YOUR_VERIFY_TOKEN\n```\n\nStrava then sends a `GET` to the callback with `hub.mode=subscribe`, `hub.verify_token` and `hub.challenge`. Within two seconds, respond with HTTP 200 and the challenge echoed back as JSON:\n\n```json\n{\"hub.challenge\":\"15f7d1a91c1f40f8a748fd134752feb3\"}\n```\n\nOnce live, Strava POSTs an event when an activity is created or deleted, when its title, type or privacy changes (privacy needs `activity:read_all`), and when an athlete revokes access, which arrives with `\"authorized\": \"false\"` in `updates`. The event is a pointer: `object_type`, `object_id`, `aspect_type`, `owner_id`, `subscription_id`, `event_time` and `updates`. Fetch the activity yourself with that athlete's token. Acknowledge every POST with 200 within two seconds; Strava retries a failed push up to three attempts in total, so process asynchronously and expect duplicates, because one save can produce several events.\n\nApps with `activity:read` but not `activity:read_all` get a `delete` event when an activity becomes Only You, and a `create` event when it becomes visible again. Treat those as the privacy changes they are, not as data loss.\n\n## Deauthorization: move to the revoke endpoint\n\nThe original endpoint, `POST https://www.strava.com/oauth/deauthorize`, invalidates all of the athlete's tokens for your app. Strava's authentication docs say that from June 1, 2026 apps can use `POST https://www.strava.com/oauth/revoke` instead, that it is the recommended method, and that it \"will be the only endpoint supported for deauthorization effective June 1, 2027\". It authenticates with HTTP Basic using your client ID and secret, takes the `token` to revoke (with an optional `token_type_hint`), and returns 200 whether or not the token was found:\n\n```bash\ncurl -X POST \"https://www.strava.com/oauth/revoke\" \\\n  -H \"Authorization: Basic BASE64_CLIENT_ID_COLON_SECRET\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"token=ACCESS_OR_REFRESH_TOKEN\"\n```\n\n## Rate limits and headers\n\nLimits are per application, over a 15-minute window that resets at 0, 15, 30 and 45 minutes past the hour and a daily window that resets at midnight UTC. Strava runs an overall limit and a separate one for \"non-upload\" endpoints, which is every endpoint except creating activities, uploads and media uploads. Requests that break the short-term limit still count toward the daily one, and an over-limit request returns 429 with a JSON error.\n\nEvery response reports usage in `X-RateLimit-Limit` and `X-RateLimit-Usage` (overall), plus `X-ReadRateLimit-Limit` and `X-ReadRateLimit-Usage` (non-upload), each a \"15-minute, daily\" pair. Read them and back off; [the cookbook's rate-limit-aware fetch wrapper](/cookbook/rate-limit-fetcher) is one tested way to do that, with a list where you add a provider's own header names. Strava's own advice for apps under 100 users that hit limits is to implement webhooks instead of polling activities, and to throttle backfills using the headers.\n\n## The rules that shape the product\n\nStrava's API Policy (2026) is short on ambiguity. The parts most likely to change a design:\n\n- **Display back to the same athlete only.** Strava Data from a user may be shown only to that user, even data that is public on Strava.\n- **No AI use.** The policy forbids using Strava API materials or data \"in connection with the development, training, evaluation, or operation of any AI Application\", including embeddings, retrieval-augmented generation and context windows.\n- **Short cache.** Strava Data may not sit in a cache for more than seven days, and data an athlete deletes must disappear from your app within 48 hours.\n- **No re-exposure.** Pass-through proxies, aggregators that re-expose the API, and MCP servers that expose Strava data are prohibited; Strava's own MCP is the only authorized agent interface.\n- **Garmin attribution.** If you display data that came from a Garmin device, you must attribute Garmin the way Garmin's brand guidelines require.\n\nIf your current integration predates these terms, [adapting to Strava's API changes](/migrate/adapt-to-strava-api-changes) covers the practical steps.\n\n## What changed recently\n\n| Date (Strava's changelog and docs) | Change |\n|---|---|\n| April 23, 2026 | Token responses include a space-delimited `scope` field |\n| May 21, 2026 | FIT set messages ingested for strength training; JSON uploads for weight training |\n| June 1, 2026 | New API Agreement and API Policy; revoke endpoint introduced; application tier shown in the dashboard; self-service expanded access for single-player developers |\n| September 1, 2026 | Club Activities, Club Members and Club Admins endpoints removed; Explore Segments restricted to approved Extended Access Tier developers |\n| January 4, 2027 | New base URL `https://api-v3.strava.com` becomes available, replacing `https://www.strava.com/api/v3` |\n| June 1, 2027 | `oauth/revoke` becomes the only supported deauthorization endpoint |\n\nPlan the base-URL move now: make the host a configuration value rather than a literal in every call.\n\n## Gotchas and production notes\n\n- **The subscription and the 10-athlete gate come before code.** A new app connects only you until you upgrade, and only 10 athletes until Strava reviews it. Put the review in the launch plan.\n- **Rotating refresh tokens are the number-one integration bug.** Persist the newest one on every refresh and never run two refreshes for one athlete at once.\n- **Private activities need `activity:read_all`.** Both the REST listings and webhook events hide Only You activities without it; if athletes report \"missing\" runs, this scope is usually why.\n- **Webhooks are pointers, and one per app.** Fan events out to athletes on your side using `owner_id`, and fetch the record before acting on it.\n- **Two limits, two headers.** The non-upload limit is the tighter one for read-heavy apps; watch `X-ReadRateLimit-Usage`, not only `X-RateLimit-Usage`.\n\nFor where Strava fits among device and aggregator options, see [wearable data APIs](/fitness-apis/wearable-data-apis), and for apps that need sleep or recovery data Strava does not model, the [Strava API alternatives](/alternatives/strava-api-alternatives).",
    "faqs": [
      {
        "q": "Does the Strava API require approval to use?",
        "a": "Not to start, but it does to scale. Strava's getting-started guide says a Strava subscription is a prerequisite for creating an app and that every new app starts in single-player mode, where only your own account can authenticate. A self-service upgrade in the API Settings Dashboard raises the athlete capacity to 10; beyond 10 you submit the Developer Program form for review, and Strava says increased access is not guaranteed."
      },
      {
        "q": "What are the Strava API rate limits in 2026?",
        "a": "As Strava documented on October 17, 2026, a new app gets an overall limit of 200 requests per 15 minutes and 2,000 per day, and a non-upload limit of 100 per 15 minutes and 1,000 per day. The self-service upgrade raises them to 400 and 4,000 overall and 200 and 2,000 for reads. The 15-minute window resets on the quarter hour, the daily one at midnight UTC, and an over-limit request returns 429."
      },
      {
        "q": "How long do Strava access tokens last?",
        "a": "Strava's access tokens expire six hours after they are created. Refreshing returns the existing token if it has more than an hour left, and a new one if it expires within the hour. The refresh token can also change on any refresh, and Strava says the older refresh token is invalidated as soon as a new one is returned, so always store the newest one."
      },
      {
        "q": "How do I get private Strava activities?",
        "a": "Request the activity:read_all scope. Plain activity:read covers activities visible to Everyone and Followers and excludes privacy zone data, while activity:read_all adds privacy zone data and activities set to Only You. The same split applies to webhooks: an app with only activity:read receives a delete event when an activity becomes Only You and a create event when it becomes visible again."
      },
      {
        "q": "Does the Strava webhook include the activity data?",
        "a": "No. Strava's events carry object_type, object_id, aspect_type, owner_id, subscription_id, event_time and an updates hash, not the activity itself, so you fetch the record with that athlete's token. Respond with HTTP 200 within two seconds, because Strava retries a failed push for up to three attempts in total, and remember that each application gets only one subscription."
      }
    ],
    "related": [
      {
        "href": "/pricing/strava-api-pricing",
        "label": "Strava API pricing"
      },
      {
        "href": "/alternatives/strava-api-alternatives",
        "label": "Strava API alternatives"
      },
      {
        "href": "/fix/strava-webhook-not-firing",
        "label": "Fix: Strava webhook not firing"
      },
      {
        "href": "/migrate/adapt-to-strava-api-changes",
        "label": "Adapt to Strava API changes"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We re-read Strava's developer docs and terms on a schedule, so you hear about tier, rate-limit and endpoint changes like the 2027 base-URL move before they break your sync."
    },
    "steps": [
      {
        "name": "Create the app and plan for the athlete cap",
        "text": "With a subscribed Strava account, create an app at the Strava API settings page to get a Client ID, Client Secret and callback domain. It starts in single-player mode, so plan the self-service upgrade to 10 athletes and the review beyond that."
      },
      {
        "name": "Send the athlete through OAuth with the scopes you need",
        "text": "Redirect to Strava's authorize endpoint with comma- or space-delimited scopes such as read and activity:read_all, and read the granted scope on the way back, since the athlete can untick scopes."
      },
      {
        "name": "Exchange the code and store both tokens",
        "text": "POST the single-use code with your client credentials to the token endpoint from your server. Store the six-hour access token, its expiry and the refresh token per athlete."
      },
      {
        "name": "Fetch activities with the Bearer token",
        "text": "Call the athlete activities endpoint with before, after, page and per_page, iterating until an empty page, and watch both the overall and the non-upload rate-limit headers."
      },
      {
        "name": "Refresh and persist the newest refresh token",
        "text": "Refresh before the access token expires and save whatever refresh token comes back, because Strava invalidates the older one as soon as a new one is issued. Serialize refreshes per athlete."
      },
      {
        "name": "Subscribe to webhooks and handle deauthorization",
        "text": "Create the app's single push subscription, answer the hub.challenge validation within two seconds, fetch each pointed-to record yourself, and move deauthorization to the oauth/revoke endpoint before June 1, 2027."
      }
    ],
    "sources": [
      {
        "url": "https://developers.strava.com/docs/getting-started/",
        "checked": "2026-10-17",
        "note": "subscription prerequisite, single-player mode, self-service upgrade to 10 athletes, webhooks required by the terms for deauthorization"
      },
      {
        "url": "https://developers.strava.com/docs/rate-limits/",
        "checked": "2026-10-17",
        "note": "overall and non-upload limits, reset windows, headers, athlete capacity, review form, API Agreement date"
      },
      {
        "url": "https://developers.strava.com/docs/authentication/",
        "checked": "2026-10-17",
        "note": "endpoints, seven scopes and delimiters, token lifetimes, refresh behaviour, deauthorize and revoke"
      },
      {
        "url": "https://developers.strava.com/docs/webhooks/",
        "checked": "2026-10-17",
        "note": "one subscription per app, validation, event fields, retries, visibility events"
      },
      {
        "url": "https://developers.strava.com/docs/changelog/",
        "checked": "2026-10-17",
        "note": "2026 changes, base URL move from January 4, 2027"
      },
      {
        "url": "https://developers.strava.com/docs/",
        "checked": "2026-10-17",
        "note": "pagination defaults and swagger spec"
      },
      {
        "url": "https://developers.strava.com/swagger/swagger.json",
        "checked": "2026-10-17",
        "note": "athlete activities parameters and scope requirement"
      },
      {
        "url": "https://www.strava.com/legal/api_policy",
        "checked": "2026-10-17",
        "note": "API Policy (2026): access tiers, subscription requirement, display, AI, cache, proxy and attribution rules"
      }
    ]
  },
  {
    "slug": "garmin-api",
    "primaryQuery": "how to integrate the Garmin API",
    "h1": "How to Integrate the Garmin API (2026)",
    "metaTitle": "How to Integrate the Garmin API (2026): Approval First",
    "metaDescription": "Integrate Garmin's Connect Developer Program: Starter or Enterprise Access, five APIs, OAuth 2.0, push or ping/pull delivery, and what Enterprise unlocks.",
    "updated": "2026-10-22",
    "answer": "Garmin's Connect Developer Program is a set of APIs (Health, Activity, Women's Health, Training and Courses) for organizations building apps on other people's Garmin data. You request access, start with Starter Access once Garmin approves you, and can move to Enterprise Access, which adds ping/pull delivery, historical data and other features; Garmin puts a typical integration at one to four weeks. All the APIs use OAuth 2.0, and data reaches you after users sync their devices. For your own data only, Garmin now offers a separate Personal API.",
    "body": "Garmin is not a sign-up-and-ship API. Everything below comes from Garmin's public Connect Developer Program pages as read on October 22, 2026, after Garmin reorganised them into Business and Personal sections; the detailed API reference is only available to approved developers, so where a value lives behind that login this guide says so instead of guessing. The [Garmin API overview](/apis/garmin) tracks the access gate alongside every page on this site that covers Garmin.\n\nTwo naming traps first. Connect IQ, Garmin's platform and free SDK for apps that run on the watch itself, is a different program from the cloud APIs covered here, and Garmin says one does not require the other; [Connect IQ vs the Health and Activity APIs](/fitness-apis/garmin-connect-iq-vs-health-api) explains the split. And if all you need is your own account's data rather than other users', Garmin now has a Personal API with a key you create yourself; see [Garmin API for personal use](/fix/garmin-api-personal-use).\n\n## Access and approval\n\nGarmin's FAQ says the program \"supports a broad range of organizations, from individual developers and startups to companies operating at significant scale\". Access comes in two levels:\n\n| Level | What Garmin says |\n|---|---|\n| Starter Access | \"Developers can gain immediate access and launch with Garmin, with access to core data and tools.\" The overview lists the Activity, Courses, Health, Training and Women's Health APIs, push delivery, no historical data and limited user capacity |\n| Enterprise Access | \"For companies operating at scale\", with expanded data access, reliability and enterprise-grade support. The overview adds a Golf API, push or ping/pull delivery, a month or more of history, unlimited user capacity and technical support, with \"commercial terms\" tailored to your requirements |\n\nThe path the FAQ describes is short: request access, and once your request has been approved you get the Garmin Developer Portal and \"can get started on your integration right away\". \"All detailed technical information and documentation is available within the Garmin Developer Portal.\" Garmin says \"A typical integration takes between 1 and 4 weeks.\" The overview says to create an app with Starter Access and request Enterprise Access through the Developer Portal as your needs grow. The Health API page adds an evaluation environment for testing after approval.\n\nGarmin no longer states how long the review takes. Until October 2026 its FAQ promised a decision within two business days and an integration call; neither is on the current pages.\n\n## The five APIs\n\nGarmin says you can use any or all of the program's APIs in a single application:\n\n| API | Direction | What Garmin's page says it covers |\n|---|---|---|\n| Health API | Garmin to you | All-day metrics: steps, intensity minutes, sleep, calories, heart rate, stress, Pulse Ox, Body Battery, body composition, respiration, blood pressure and enhanced beat-to-beat interval (Enterprise only) |\n| Activity API | Garmin to you | Detailed fitness data captured during an activity, with running, cycling, swimming, yoga and strength training named on the page, as JSON summaries or activity files in FIT, GPX and TCX formats |\n| Women's Health API | Garmin to you | Menstrual cycle tracking and pregnancy tracking, including schedules and pregnancy details |\n| Training API | You to Garmin | Workouts and training plans published to the Garmin Connect calendar for users to sync to compatible devices |\n| Courses API | You to Garmin | Courses and course points that users can follow from the standard Courses menu on a wearable or cycling computer |\n\nEnterprise Access adds a sixth, the Golf API, on the overview's plan card; it has no page of its own in the program menu. The Health API page positions the API for corporate wellness, population health and patient monitoring. Garmin says new devices are supported automatically and that it tries to add new data types as devices launch, but that \"it's not always possible to offer every metric\".\n\nGarmin's Activity API page no longer gives a count of activity types. Earlier versions of this guide quoted the overview's \"over 30 activity types\"; that sentence is not on the reorganised pages.\n\n## Auth and scopes\n\nGarmin's FAQ answers the auth question in one line: \"All APIs in the Developer Program use OAUTH 2.0.\" The authorization and token endpoints, scopes and token lifetimes are in the documentation approved developers receive, not on Garmin's public pages, so this guide does not reproduce them. Take those values from the Developer Portal once you have access.\n\n## Getting data: push or ping/pull\n\nGarmin's API pages describe the delivery model, and mark some of it with an asterisk that reads \"Supported with Enterprise Access only\":\n\n- **Push, or ping/pull on Enterprise.** The Health and Women's Health pages offer \"Push or *Ping/Pull Architecture\"; the overview lists Starter delivery as push only.\n- **Customized data feeds.** \"Only subscribe to the data you need.\"\n- **Multi-project support (Enterprise only).** Each app is created and configured independently.\n- **Developer web tools.** On-boarding, sample data, backfill of user data (Enterprise only) and auto-verification of your integration before production.\n\nData arrives on the user's schedule: after initial consent, users sync their device with Garmin Connect, \"at which point it is accessible via the API\". The Health API delivers JSON summaries of what the user uploaded, including detailed stress, Pulse Ox and epoch summaries for all-day activity. On Starter, plan an endpoint Garmin can push to and an ingestion path that tolerates data arriving whenever a user happens to sync, with no historical backfill to lean on.\n\nFor the reverse direction, the Training and Courses APIs publish to the user's Garmin Connect account after they consent, and Garmin Connect handles the device side: the user syncs and the workout or course lands on the watch or cycling computer.\n\n## Rate limits\n\nGarmin's public pages publish no request limits. The overview gives Starter a \"Limited\" user capacity and Enterprise an \"Unlimited\" one without saying what the Starter limit is; ask for it in writing.\n\n## Fees\n\nGarmin's pages, read on October 22, 2026, state no price for Starter Access and say Enterprise options and commercial terms \"are tailored based on business and technical requirements\". The FAQ sentence this guide used to quote, that there were no licensing or maintenance fees with licence fees for some metrics, is gone. If you plan to supply Garmin wearables to your users, the FAQ now says to request the program and use Garmin's inquiry form. The [Garmin API pricing](/pricing/garmin-api-pricing) page breaks this down.\n\n## What changed recently\n\nGarmin publishes no public changelog for the program. Comparing its pages on October 22, 2026 with this guide's October 17 version:\n\n- **Starter and Enterprise Access.** The program now has two levels, with ping/pull delivery, multi-project support, backfill, historical data and enhanced beat-to-beat interval on the Enterprise side.\n- **A Personal API.** Individuals can create their own key for their own data; the business FAQ sends personal-use questions there.\n- **New addresses.** The program FAQ and the five API pages moved under `/gc-developer-program/enterprise/`; the old addresses return 404.\n- **Gone from the pages:** the \"Stay tuned for more updates on the program\" banner, the business-use-only and no-licensing-fee sentence, the two-business-day decision, the integration call and the \"over 30 activity types\" line.\n- **OAuth 2.0 across the board,** still.\n\n## Gotchas and production notes\n\n- **Starter is push only, without history.** If you need ping/pull, backfill or more than limited user capacity, you are planning for Enterprise and its tailored terms.\n- **Personal API is not a shortcut for products.** Garmin says it is not intended for commercial applications serving multiple end users.\n- **Sync drives freshness.** Nothing reaches the API until the user syncs their device with Garmin Connect.\n- **Consider an aggregator if approval stalls.** A wearable-data aggregator that already holds Garmin access can cover it through one integration; compare that path in [wearable data APIs](/fitness-apis/wearable-data-apis) and see how Garmin stacks up against self-serve options in [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api).",
    "faqs": [
      {
        "q": "Does Garmin require approval to use its API?",
        "a": "For other users' data, yes. Garmin's FAQ says that after you request access to the Garmin Connect Developer Program and your request has been approved, you get the Garmin Developer Portal and can start right away, beginning with Starter Access. Garmin puts a typical integration at one to four weeks. Its own Personal API, for your own data, needs no application."
      },
      {
        "q": "Does Garmin charge for API access?",
        "a": "Garmin's pages, read on October 22, 2026, state no price for Starter Access and say Enterprise options and commercial terms are tailored to business and technical requirements. The earlier FAQ sentence that there were no licensing or maintenance fees, with licence fees for some metrics, is no longer on Garmin's site, so get terms in writing."
      },
      {
        "q": "What authentication does the Garmin API use?",
        "a": "OAuth 2.0: Garmin's FAQ says all APIs in the Developer Program use it. The authorization and token endpoints, scopes and token lifetimes are in the documentation approved developers receive in the Garmin Developer Portal rather than on Garmin's public pages, so take them from there instead of from third-party write-ups."
      },
      {
        "q": "How does Garmin deliver data, and do I poll it?",
        "a": "On Starter Access, Garmin pushes data to you; its overview lists Starter delivery as push only. Ping/pull delivery, multi-project support and backfill of user data are marked as supported with Enterprise Access only. Either way, data becomes available after the user syncs their device with Garmin Connect, and you can subscribe only to the feeds you need."
      },
      {
        "q": "Can I use the Garmin API for a personal project?",
        "a": "Yes, through Garmin's Personal API rather than the Connect Developer Program: Garmin's business FAQ now sends personal-use questions there, and you create the key yourself on Garmin Connect Web. Connect IQ, with its free SDK for watch faces, data fields, widgets and apps on the device, is a separate program that the Connect APIs do not require."
      }
    ],
    "related": [
      {
        "href": "/pricing/garmin-api-pricing",
        "label": "Garmin API pricing"
      },
      {
        "href": "/fix/garmin-api-personal-use",
        "label": "Garmin API for personal use"
      },
      {
        "href": "/libraries/garminconnect",
        "label": "garminconnect Python library"
      },
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
      "pitch": "We track wearable API access as vendors change it, including Garmin's Starter and Enterprise tiers, its Personal API, and how the aggregator alternatives compare."
    },
    "steps": [
      {
        "name": "Request the Connect Developer Program",
        "text": "Request access from Garmin's developer site. If you plan to offer Garmin wearables, Garmin's FAQ says to also contact it through its inquiry form with details of your project."
      },
      {
        "name": "Get portal access and create a Starter app",
        "text": "Once your request is approved, Garmin grants access to the Garmin Developer Portal, where the detailed documentation lives, and you create an app with Starter Access."
      },
      {
        "name": "Connect users with OAuth 2.0",
        "text": "Implement the OAuth 2.0 flow from Garmin's developer documentation to connect each user, and store their tokens against your own user ID."
      },
      {
        "name": "Receive pushed data and subscribe to feeds",
        "text": "On Starter, data is pushed to an endpoint you host; subscribe only to the feeds you need. Request Enterprise Access if you need ping/pull delivery, backfill or historical data."
      },
      {
        "name": "Verify the integration and go to production",
        "text": "Use Garmin's auto-verification of your integration before production. Garmin puts a typical integration at one to four weeks."
      }
    ],
    "sources": [
      {
        "url": "https://developer.garmin.com/gc-developer-program/overview/",
        "checked": "2026-10-22",
        "note": "Personal, Starter and Enterprise access and what each plan card lists"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/enterprise/program-faq/",
        "checked": "2026-10-22",
        "note": "who the program is for, Starter and Enterprise Access, approval and Developer Portal, 1 to 4 weeks, OAuth 2.0, new devices, Connect IQ, wearables inquiry form, personal use"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/enterprise/health-api/",
        "checked": "2026-10-22",
        "note": "Health API metrics, delivery and web tools, Enterprise-only features, evaluation environment"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/enterprise/activity-api/",
        "checked": "2026-10-22",
        "note": "Activity API data, named activities, FIT, GPX and TCX files, delivery model"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/enterprise/womens-health-api/",
        "checked": "2026-10-22",
        "note": "menstrual cycle and pregnancy tracking, delivery model"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/enterprise/training-api/",
        "checked": "2026-10-22",
        "note": "workouts and training plans published to the Garmin Connect calendar"
      },
      {
        "url": "https://developer.garmin.com/gc-developer-program/enterprise/courses-api/",
        "checked": "2026-10-22",
        "note": "courses and course points"
      },
      {
        "url": "https://web.archive.org/web/20261017191828id_/https://developer.garmin.com/gc-developer-program/program-faq",
        "checked": "2026-10-22",
        "note": "the former program FAQ as captured on October 17, 2026, for what changed"
      }
    ]
  },
  {
    "slug": "oura-api",
    "primaryQuery": "how to integrate the Oura API",
    "h1": "How to Integrate the Oura API (2026)",
    "metaTitle": "Oura API (2026): OAuth, PKCE, Webhooks, Rate Limits",
    "metaDescription": "Integrate Oura API V2: OAuth with PKCE, the scopes, usercollection endpoints, signed webhooks, two-layer rate limits and the 10-user approval gate.",
    "updated": "2026-10-17",
    "answer": "Oura API V2 is the only way to read Oura data: Oura's spec says the V1 API has been sunset and that personal access tokens, deprecated in December 2025, are no longer available, so every integration uses OAuth 2.0, with PKCE marked recommended. You register an API application, send each user through consent for the scopes you need, then read the usercollection endpoints or, as Oura prefers, subscribe to webhooks. A new app is limited to 10 users until Oura approves it, and a 403 often means the user's Oura subscription has expired.",
    "body": "Three things shape an Oura build before any code, all from Oura's own documentation as read on October 17, 2026:\n\n- **V2 and OAuth only.** Oura's spec describes API V2 as \"the only available integration point for Oura data\", says the V1 API has been sunset (its getting-started page dates the removal to January 22, 2024), and says personal access tokens \"were deprecated in December 2025 and are no longer available for use\". If a tutorial tells you to paste a personal token, it is out of date; [Oura personal access tokens deprecated](/fix/oura-personal-access-token-deprecated) covers the switch.\n- **A 10-user limit until Oura approves the app.** API applications are limited to 10 users before requiring approval from Oura, with no limit once approved, and you submit the app for review from its page in the developer portal.\n- **Consent is per data type, and membership matters.** Oura says users must consent to share each data type your app has access to, and its API returns 403 when a request needs more permissions \"or the user's Oura subscription has expired\".\n\nIf you are still choosing a provider, see [wearable data APIs](/fitness-apis/wearable-data-apis); the neighboring recovery-band integration is in the [WHOOP API guide](/integrate/whoop-api). Oura's access requirements, and every page on this site that covers Oura, are collected in the [Oura API overview](/apis/oura). Scripting in Python? [oura-ring vs oura (python-ouraring)](/libraries/compare/oura-ring-vs-oura-python) compares the two clients and which one documents the OAuth2 flow.\n\n## What you'll need\n\n- An **Oura account**, created in the Oura iOS or Android app, which you also use to sign in at `https://cloud.ouraring.com`.\n- An **API application** registered under API Applications, which gives you a **client ID** and **client secret**. Oura says the secret should not be shared, so keep it on your server.\n- At least one **redirect URI** on the application; Oura treats the list as a whitelist the `redirect_uri` parameter must match exactly.\n- A backend for the code exchange, token refresh and webhook endpoint.\n\n## Auth and scopes\n\nOura uses OAuth 2.0. Its authorization URL is `https://cloud.ouraring.com/oauth/authorize` and its token URL `https://api.ouraring.com/oauth/token`. Oura also now offers `https://developer.ouraring.com/authorize` as an alternative authorization URL for new OAuth clients; on mobile devices with the Oura app installed it can open the consent page inside the app.\n\nOura's authentication page lists eight scopes. Request only what you use, because the user can enable and disable scopes at consent:\n\n| Scope | What Oura says it covers |\n|---|---|\n| `email` | Email address of the user |\n| `personal` | Gender, age, height, weight |\n| `daily` | Daily summaries of sleep, activity and readiness |\n| `heartrate` | Time series heart rate for Gen 3 users |\n| `workout` | Auto-detected and user-entered workouts |\n| `tag` | User-entered tags |\n| `session` | Guided and unguided sessions in the Oura app |\n| `spo2` | Daily SpO2 average recorded during sleep |\n\nThe OpenAPI spec's own scope list adds a ninth, `heart_health` (\"Heart health data\"), which the authentication page does not mention yet; test it before you depend on it.\n\nThe `scope` parameter is space-separated, and leaving it blank requests every scope. Oura marks PKCE as recommended: generate a `code_verifier` of 43 to 128 characters, send its SHA-256 hash base64url-encoded as `code_challenge` with `code_challenge_method=S256`, and keep the verifier for the token exchange.\n\n```http\nGET https://cloud.ouraring.com/oauth/authorize\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https%3A%2F%2Fyourapp.example.com%2Fcallback\n  &scope=daily%20heartrate%20workout%20spo2\n  &state=RANDOM_ANTI_CSRF_STRING\n  &code_challenge=BASE64URL_SHA256_OF_VERIFIER\n  &code_challenge_method=S256\n```\n\nOn consent Oura redirects with `code` and your `state`; a refusal returns `error=access_denied`. Oura says the `scope` parameter on that redirect is deprecated and may be omitted, so do not rely on it. Exchange the code from your server; credentials can go in the form body or as HTTP Basic:\n\n```bash\ncurl -s -X POST \"https://api.ouraring.com/oauth/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=AUTHORIZATION_CODE\" \\\n  -d \"redirect_uri=https://yourapp.example.com/callback\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\" \\\n  -d \"code_verifier=YOUR_CODE_VERIFIER\"\n```\n\nThe response holds `access_token`, `expires_in` and `refresh_token`. Read `expires_in` rather than hard-coding a lifetime: Oura's spec says access tokens typically expire after 24 hours in one troubleshooting section and typically last 30 days in its FAQ. Oura's refresh token is single-use: it \"is invalidated after being used\", so store the new pair after every refresh, and its error docs say a reused refresh token comes back as \"Token already used or revoked\". Oura also documents a client-side flow (`response_type=token`) with no refresh token, where the token currently expires after 30 days and the user must re-authenticate; use it only where you have no backend. To revoke a token, for example when a user disconnects, call `https://api.ouraring.com/oauth/revoke?access_token=ACCESS_TOKEN`.\n\n```bash\ncurl -s -X POST \"https://api.ouraring.com/oauth/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=STORED_REFRESH_TOKEN\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\"\n```\n\n## Data: the usercollection endpoints\n\nAll data lives under `https://api.ouraring.com/v2/usercollection/`. Oura's V2 OpenAPI spec, as published on October 17, 2026, lists these data types, each as a list endpoint and, except `heartrate`, `personal_info` and `ring_battery_level`, a single-document endpoint by `document_id`:\n\n| Endpoint | What Oura's spec says it holds |\n|---|---|\n| `daily_activity`, `daily_sleep`, `daily_readiness` | Daily activity summaries and activity levels, daily sleep, and readiness |\n| `daily_spo2` | Daily SpO2 average, available only for users with a Gen 3 ring |\n| `daily_stress` | Minutes in high stress and high recovery each day |\n| `daily_resilience`, `daily_cardiovascular_age`, `vO2_max` | Resilience, cardiovascular age estimate, VO2 max |\n| `sleep` | Sleep periods; a user can have several per day |\n| `sleep_time` | Recommended bedtime window, calculated from sleep data |\n| `heartrate` | Time-series heart rate in 5-minute increments |\n| `workout`, `session` | Workouts, and guided or unguided sessions |\n| `enhanced_tag`, `tag` | User-entered tags; `tag` is deprecated in favor of `enhanced_tag` |\n| `rest_mode_period`, `ring_configuration`, `ring_battery_level`, `personal_info` | Rest mode periods, ring model, size and color, battery level, the user's profile |\n\n```bash\ncurl -s -H \"Authorization: Bearer ${OURA_ACCESS_TOKEN}\" \\\n  \"https://api.ouraring.com/v2/usercollection/daily_activity?start_date=2026-10-01&end_date=2026-10-16\"\n```\n\nList responses wrap records in a `data` array with a `next_token`; repeat the request with it until it comes back `null`. The same spec also has a sandbox endpoint for each data type under `/v2/sandbox/usercollection/`, serving fake data \"that you can access without an Oura account\", so you can build before you have connected users. Oura notes that sandbox calls share your rate limit with the real data endpoints.\n\nExpect data to arrive on the user's schedule, not yours: Oura notes that sleep data requires users to open the Oura app, while daily activity and stress may sync in the background.\n\n## Webhooks\n\nOura calls webhooks \"the preferred way to consume Oura data\" and says customers who implement them properly have not hit rate limits. Its recommended pattern is one request for historical data when a user first connects, then webhooks for everything after.\n\nCreate one subscription per combination of `event_type` (`create`, `update` or `delete`) and `data_type` by calling `POST /v2/webhook/subscription` with your app's `x-client-id` and `x-client-secret` headers and a JSON body with `callback_url`, `verification_token`, `event_type` and `data_type`. The data types you can subscribe to are `tag`, `enhanced_tag`, `workout`, `session`, `sleep`, `daily_sleep`, `daily_readiness`, `daily_activity`, `daily_spo2`, `sleep_time`, `rest_mode_period`, `ring_configuration`, `daily_stress`, `daily_cardiovascular_age`, `daily_resilience` and `vo2_max`.\n\nOura verifies the endpoint with a `GET` carrying `verification_token` and `challenge`; respond with `{\"challenge\": \"...\"}` to activate the subscription. After that, each event is a `POST` whose JSON body carries `event_type`, `data_type`, `object_id` and `user_id`, with `x-oura-signature` and `x-oura-timestamp` headers:\n\n```js\n// Oura's documented check: HMAC-SHA256 of timestamp + JSON body, keyed by the client secret, hex, upper-case\nconst crypto = require(\"crypto\");\nfunction verifyOuraSignature(headers, body, clientSecret) {\n  const hmac = crypto.createHmac(\"sha256\", clientSecret);\n  hmac.update(headers[\"x-oura-timestamp\"] + JSON.stringify(body));\n  return hmac.digest(\"hex\").toUpperCase() === headers[\"x-oura-signature\"];\n}\n```\n\nRespond with a 2xx in under 10 seconds and fetch the record by `object_id` afterwards. Oura retries failed deliveries (10 retries each for 4xx responses, 5xx responses and timeouts, for about an hour), and a 410 response cancels the subscription, as does `DELETE /v2/webhook/subscription/{id}`. Every subscription carries an `expiration_time`; renew it with `PUT /v2/webhook/subscription/renew/{id}` before it lapses. Notifications arrive about 30 seconds after data syncs from the app; for longer outages, run a reconciliation job.\n\n## Rate limits\n\nOura's V2 spec describes two layers: a per-access-token limit and a per-application limit across all of an app's user tokens. Either returns 429 with `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Window`, `X-RateLimit-Reset` and an `X-RateLimit-Tier` header naming the layer that fired, and Oura says to prefer those headers over fixed-interval backoff. That section names no figure; the FAQ in the same spec and Oura's error-handling page both give one, 5,000 requests per 5-minute period. Oura's FAQ also suggests fetching history in date ranges of about one to three months at a time and paging with `next_token`. Contact Oura at its API support address if you expect to need more, and use webhooks first.\n\n## What changed recently\n\n| Date | Change (Oura's documentation) |\n|---|---|\n| January 22, 2024 | V1 API removed |\n| December 2025 | Personal access tokens deprecated; the spec says they are no longer available for use |\n| Undated, seen October 17, 2026 | A universal-link authorization URL at `developer.ouraring.com/authorize` that Oura labels new; PKCE marked recommended; two-layer rate limits with an `X-RateLimit-Tier` header; a `heart_health` scope in the spec. None of these were in this guide's July 2026 version |\n\n## Gotchas and production notes\n\n- **OAuth only, PKCE recommended.** Personal tokens are gone; build the authorization-code flow with PKCE from day one.\n- **The 10-user limit blocks scale, not testing.** Submit the app for review from its page well before launch.\n- **A 403 is usually scope or subscription, not a bad token.** Oura's 403 means the resource needs more permissions or the user's Oura subscription has expired; a missing-scope error lists the scopes the token needs.\n- **Refresh tokens are single-use.** Store the new pair every time; reusing one fails as already used or revoked.\n- **Sleep arrives when the user opens the app.** Do not treat a missing night as an error until the user has synced.\n- **Some data needs newer hardware.** Oura's spec says daily SpO2 data is only available for users with a Gen 3 ring, and its authentication page describes the `heartrate` scope as time series for Gen 3 users.\n- **Dates are the user's local dates.** Oura says date parameters are interpreted in the user's local time zone, and timestamps come back in ISO 8601 with time zone information.\n\nFor where Oura fits among recovery and sleep sources, see [wearable data APIs](/fitness-apis/wearable-data-apis); for what the membership costs your users, see [Oura API pricing](/pricing/oura-api-pricing).",
    "faqs": [
      {
        "q": "Does the Oura API still support personal access tokens?",
        "a": "No. Oura's API spec says personal access tokens were deprecated in December 2025 and are no longer available for use, and that API V2 is the only available integration point. Build the OAuth 2.0 authorization-code flow instead, with PKCE, which Oura's authentication page marks as recommended."
      },
      {
        "q": "Does the Oura API require approval?",
        "a": "Only to grow past 10 users. Oura's spec says API applications are limited to 10 users before requiring approval from Oura and that there is no limit once an application is approved. When development is done, you submit the app for review from its page in the developer portal."
      },
      {
        "q": "What OAuth endpoints and scopes does Oura use?",
        "a": "Authorize at https://cloud.ouraring.com/oauth/authorize, or the newer universal link https://developer.ouraring.com/authorize, and exchange or refresh tokens at https://api.ouraring.com/oauth/token. The authentication page lists eight scopes: email, personal, daily, heartrate, workout, tag, session and spo2, and the OpenAPI spec also lists heart_health. Users can switch scopes off at consent."
      },
      {
        "q": "Why am I getting a 403 from a usercollection endpoint?",
        "a": "Oura's spec says a 403 means the requested resource requires additional permissions or the user's Oura subscription has expired. Check the scopes on the token first: a missing-scope error lists the scopes you need, and the fix is asking the user to re-authorize. If the scopes are right, the user's membership has probably lapsed."
      },
      {
        "q": "Does the Oura API have webhooks and rate limits?",
        "a": "Yes to both. Oura calls webhooks the preferred way to consume its data: you subscribe per event type and data type, answer a verification challenge, and check each event's HMAC signature. Rate limits apply per access token and per application, and Oura's FAQ and error-handling page give 5,000 requests per 5-minute period."
      }
    ],
    "related": [
      {
        "href": "/integrate/whoop-api",
        "label": "Integrate the WHOOP API"
      },
      {
        "href": "/pricing/oura-api-pricing",
        "label": "Oura API pricing"
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
      "pitch": "We track wearable integrations as vendors change them, from Oura's move to OAuth-only access and PKCE to its signed webhooks and the 10-user approval gate."
    },
    "steps": [
      {
        "name": "Register an API application",
        "text": "Sign in at cloud.ouraring.com with your Oura account, register an API application and add your redirect URIs. Oura issues a client ID and client secret; keep the secret on your server. A new app is limited to 10 users."
      },
      {
        "name": "Send the user to the authorization URL",
        "text": "Redirect to https://cloud.ouraring.com/oauth/authorize with response_type=code, your client_id, redirect_uri, a random state, only the scopes you need, and a PKCE code_challenge with code_challenge_method=S256."
      },
      {
        "name": "Exchange the code for tokens",
        "text": "On your callback, check state and POST the code, redirect_uri and code_verifier to https://api.ouraring.com/oauth/token. Store the access token, its expires_in and the single-use refresh token against your user."
      },
      {
        "name": "Backfill history, then subscribe to webhooks",
        "text": "Request historical data once per data type in date ranges of one to three months, paging with next_token. Then create a webhook subscription per event type and data type, answer Oura's verification challenge, and check x-oura-signature on every event."
      },
      {
        "name": "Refresh tokens and handle errors",
        "text": "Refresh with grant_type=refresh_token and store the new pair each time, because the old refresh token is invalidated. On a 429 honor Retry-After; on a 403 check scopes and the user's membership before assuming a bad token."
      },
      {
        "name": "Submit the app for review",
        "text": "Before you need more than 10 users, submit the app for review from its page in the developer portal. Oura's spec says there is no user limit once an application is approved."
      }
    ],
    "sources": [
      {
        "url": "https://cloud.ouraring.com/docs/",
        "checked": "2026-10-17",
        "note": "getting started: account, API application, ten-user default limit, review, V1 removal date"
      },
      {
        "url": "https://cloud.ouraring.com/docs/authentication",
        "checked": "2026-10-17",
        "note": "authorization and token URLs, universal link, scopes, PKCE, single-use refresh tokens, client-side flow, revocation"
      },
      {
        "url": "https://cloud.ouraring.com/docs/error-handling",
        "checked": "2026-10-17",
        "note": "error responses, reused refresh tokens, 5,000 requests per 5 minutes"
      },
      {
        "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.42.json",
        "checked": "2026-10-17",
        "note": "API V2 spec 1.42: personal access token status, user limit and approval, consent, 403 meaning, two-layer rate limits, data types, sandbox, webhooks, FAQ"
      }
    ]
  },
  {
    "slug": "whoop-api",
    "primaryQuery": "how to integrate the WHOOP API",
    "h1": "WHOOP API Developer Integration Guide (2026)",
    "metaTitle": "WHOOP API (2026): Member Tiers, OAuth, Webhooks, Limits",
    "metaDescription": "Integrate the WHOOP API: the membership you need, Sandbox-to-Production member tiers, OAuth scopes, v2 endpoints, signed webhooks and rate limits.",
    "updated": "2026-10-17",
    "answer": "The WHOOP API exposes a member's cycles (Strain), recovery, sleep, workouts, profile and body measurements through OAuth 2.0, at v2 endpoints under the base URL https://api.prod.whoop.com/developer. You need a WHOOP membership to build, you register an app in the WHOOP Developer Dashboard, request scopes such as read:recovery plus offline for a refresh token, and call the API with a Bearer token. A new app starts on the Sandbox tier with up to 10 members and climbs one tier at a time through Build, Growth and Scale to unlimited Production, with each step reviewed by WHOOP.",
    "body": "## Access and approval: membership, then member tiers\n\nTwo access facts come before any code.\n\n- **You need a WHOOP membership to build.** WHOOP's developer overview says \"You must have a WHOOP membership to develop an app on the Developer Platform\", and your WHOOP account doubles as your developer login. Your users connect their own WHOOP accounts, so your audience is limited to people who already wear WHOOP.\n- **Apps grow through member tiers.** Every new app starts on the Sandbox tier, which allows up to 10 WHOOP members to connect, and you can build and test there without asking. Beyond that you request the next tier from the Developer Dashboard.\n\n| Tier | Member limit |\n|---|---|\n| Sandbox | 10 |\n| Build | 100 |\n| Growth | 1,000 |\n| Scale | 5,000 |\n| Production | Unlimited |\n\nTiers are earned one at a time: you can only request the tier directly above your current one, and from Build onward, moving up requires at least 50% of your current tier's member limit to be connected. Requests are reviewed manually, in the order received, and WHOOP rejects requests without specific, detailed answers. Before you request, WHOOP asks that you have tested with at least one member, filled in your app name, contact emails and privacy policy URL, and followed its design and brand guidelines. It also warns that contacting WHOOP employees about a request outside the Dashboard may get your app disabled.\n\nNone of this is a knock on WHOOP; they are access requirements, and the [WHOOP API overview](/apis/whoop) tracks them alongside every page on this site that covers WHOOP. If you want an aggregator that fronts WHOOP alongside others, see [wearable data APIs](/fitness-apis/wearable-data-apis). WHOOP's OAuth flow is close to [Oura's](/integrate/oura-api), so if you have integrated one the other will feel familiar.\n\n## What you'll need\n\n- A WHOOP account with an active membership, and an app created in the **WHOOP Developer Dashboard**, which asks you to create a team first. You can create up to five apps, and request more from the Dashboard.\n- The app's **client ID** and **client secret**. WHOOP says the secret \"should only be used server side\"; it also keys webhook signatures.\n- At least one **redirect URI**, matched exactly at authorization time, and at least one **scope**, since an app cannot be created without one.\n- A backend for the token exchange, refresh and webhook endpoint.\n\n## Auth and scopes\n\nWHOOP uses the OAuth 2.0 authorization-code flow. The API reference lists the authorization URL `https://api.prod.whoop.com/oauth/oauth2/auth`, the token URL `https://api.prod.whoop.com/oauth/oauth2/token`, and six data scopes:\n\n| Scope | What WHOOP's reference says it reads |\n|---|---|\n| `read:recovery` | Recovery data, including score, heart rate variability and resting heart rate |\n| `read:cycles` | Cycles data, including day Strain and average heart rate during a physiological cycle |\n| `read:workout` | Workout data, including activity Strain and average heart rate |\n| `read:sleep` | Sleep data, including performance % and duration per sleep stage |\n| `read:profile` | Profile data, including name and email |\n| `read:body_measurement` | Body measurements, including height, weight and max heart rate |\n\nAdd `offline` to the request if you need a refresh token: WHOOP's OAuth guide says you must request it to receive one. Generate a `state` value for CSRF protection; WHOOP says it must be eight characters long if you generate it yourself.\n\n```http\nGET https://api.prod.whoop.com/oauth/oauth2/auth\n  ?client_id=YOUR_CLIENT_ID\n  &redirect_uri=YOUR_REDIRECT_URI\n  &response_type=code\n  &scope=read:recovery%20read:sleep%20read:workout%20offline\n  &state=8CHARSTR\n```\n\nThe member signs in, sees the scopes you asked for and must authorize them before WHOOP issues a token. Exchange the returned code from your backend:\n\n```bash\ncurl -X POST \"https://api.prod.whoop.com/oauth/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=THE_AUTH_CODE\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\" \\\n  -d \"redirect_uri=YOUR_REDIRECT_URI\"\n```\n\n### Refresh rotates both tokens\n\nAccess tokens are short-lived: WHOOP reports the lifetime in `expires_in` (its sample response shows 3600 seconds) and answers an expired token with 401. Refresh at the same token URL; WHOOP's sample payload includes `scope=offline`:\n\n```bash\ncurl -X POST \"https://api.prod.whoop.com/oauth/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=THE_REFRESH_TOKEN\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\" \\\n  -d \"scope=offline\"\n```\n\nWHOOP invalidates the existing access token once a refresh token is used, and the refresh token in the response replaces the one you sent. Two simultaneous refreshes for one member fail, because the first one invalidates the refresh token the second is carrying; WHOOP suggests refreshing on a schedule, for example a background job, to avoid that race. When a member disables your integration, revoke their access with the `revokeUserOAuthAccess` endpoint, which also stops their webhooks.\n\n## Data: the v2 endpoints\n\nThe data API's base URL is `https://api.prod.whoop.com/developer`, and every data path sits under it. Earlier versions of this guide left out the `/developer` segment; the paths below are relative to the full base URL.\n\n| Endpoint | Scope | What it returns |\n|---|---|---|\n| `GET /v2/cycle` and `/v2/cycle/{cycleId}` | `read:cycles` | Physiological cycles (Strain); since September 23, 2026 each cycle includes `step_count` |\n| `GET /v2/recovery` and `/v2/cycle/{cycleId}/recovery` | `read:recovery` | Recoveries |\n| `GET /v2/activity/sleep` and `/v2/activity/sleep/{sleepId}` | `read:sleep` | Sleeps, identified by UUID |\n| `GET /v2/activity/workout` and `/v2/activity/workout/{workoutId}` | `read:workout` | Workouts, identified by UUID |\n| `GET /v2/user/profile/basic` | `read:profile` | Name and email |\n| `GET /v2/user/measurement/body` | `read:body_measurement` | Height, weight, max heart rate |\n\n```bash\n# The 10 most recent sleeps (WHOOP's default page size; the maximum is 25)\ncurl -X GET \"https://api.prod.whoop.com/developer/v2/activity/sleep?limit=10\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```\n\nCollections are paginated: send the `next_token` from each response as `nextToken` on the next request, with the same `start` and `end`, until `next_token` comes back empty. WHOOP thinks in physiological cycles rather than calendar days, so a member's current cycle has a start time and no end yet. Sleep and workout IDs are UUIDs in v2; if you stored v1 integer IDs, the one-time `GET /v1/activity-mapping/{activityV1Id}` lookup returns the v2 UUID, and WHOOP says to use it for migration only.\n\n## Webhooks\n\nAdd an HTTPS URL in your app's Webhook URL setting and WHOOP POSTs whenever a connected member's data changes; with several apps you need a separate endpoint per app. The default model version is v2, which uses UUIDs, and v1 webhooks are no longer published. Each body carries `user_id`, `id`, `type` and `trace_id`. The event types are `workout.updated`, `workout.deleted`, `sleep.updated`, `sleep.deleted`, `recovery.updated` and `recovery.deleted`; creates arrive as updates, and a v2 recovery event carries the UUID of the sleep the recovery belongs to, not a cycle ID. There are no webhooks for day Strain, cycles or body measurements.\n\nVerify every request before trusting it. WHOOP sends `X-WHOOP-Signature` and `X-WHOOP-Signature-Timestamp`; compute `base64(HMAC-SHA256(timestamp_header + raw_http_request_body, client_secret))` and drop the request if it does not match the signature header.\n\nDelivery is not guaranteed. WHOOP retries a failed delivery five times over about an hour, counting anything but a 2XX, or no response before the timeout, as a failure, and recommends returning 2XX within a second and doing the work on a queue. Duplicates happen (deduplicate on `trace_id`), events can be missed, and WHOOP recommends a reconciliation job that occasionally fetches the data types you care about.\n\n## Rate limits\n\nBy default every client may send 100 requests per minute and 10,000 requests per day. Responses carry `X-RateLimit-Limit` (for example `100, 100;window=60, 10000;window=86400`), `X-RateLimit-Remaining` and `X-RateLimit-Reset`, and an over-limit request returns 429. WHOOP can raise the limits on request: open your app in the Developer Dashboard, choose Open Request, then Rate limit increase.\n\n## Terms that shape the product\n\nWHOOP's API Terms of Use, effective October 6, 2026, say access to the APIs \"is currently provided at no charge\" and that WHOOP will give notice before charging. They also prohibit using the API or WHOOP data to create, train, fine-tune or improve any machine-learning or AI model or system, and keeping cached copies longer than the cache header allows. Plan for both before you design features around WHOOP data.\n\n## What changed recently\n\n| Date | Change (WHOOP's changelog and docs) |\n|---|---|\n| July 1, 2025 | v2 API launched; developers encouraged to migrate from v1 |\n| August 1, 2025 | Docs clarified that v2 recovery webhooks use the associated sleep's UUID |\n| November 1, 2025 | v1 webhooks no longer published; v1-to-v2 activity ID mapping endpoint documented |\n| September 23, 2026 | Cycles include `step_count`, covered by `read:cycles` with no re-consent |\n| October 6, 2026 | Current API Terms of Use take effect |\n\nWHOOP's migration guide says the v1 API is no longer supported and new features go to v2 only. WHOOP also documents a separate Healthcare Partner API, a server-to-server integration for lab requisitions and diagnostic reports, which it says is available only to WHOOP-approved healthcare partners and not to general developers.\n\n## Gotchas and production notes\n\n- **Membership is mandatory on both sides.** You need a WHOOP membership to develop, and your users are WHOOP members by definition.\n- **Tiers are a ladder, not a switch.** From Build onward you need half of your current tier's member limit connected before you can ask for the next one, and reviews are manual.\n- **`/developer` is part of the base URL.** Every data call goes to `https://api.prod.whoop.com/developer/v2/...`.\n- **`offline` scope for refresh.** Without it there is no refresh token, and background sync stops when the first access token expires.\n- **Refresh tokens rotate.** Persist the new pair on every refresh and never refresh one member twice at once.\n- **Webhooks are notifications, not data.** Fetch the record after each event, deduplicate on `trace_id`, and run a reconciliation job for what you miss.\n\nFor a wider comparison of recovery and wearable providers, see [wearable data APIs](/fitness-apis/wearable-data-apis); what WHOOP costs you and your users is on [WHOOP API pricing](/pricing/whoop-api-pricing).",
    "faqs": [
      {
        "q": "Do I need a WHOOP membership to use the WHOOP API?",
        "a": "Yes. WHOOP's developer overview says you must have a WHOOP membership to develop an app on the Developer Platform, and your WHOOP account is also your developer login. The people who connect to your app are WHOOP members too, so the API only reaches users who already own WHOOP."
      },
      {
        "q": "How many users can a WHOOP API app have?",
        "a": "It depends on the app's tier. WHOOP documents five: Sandbox (10 members), Build (100), Growth (1,000), Scale (5,000) and Production (unlimited). Every new app starts on Sandbox, tiers are requested one at a time from the Developer Dashboard, and from Build onward you need at least half of your current tier's limit connected before you can request the next one."
      },
      {
        "q": "What are the WHOOP API rate limits?",
        "a": "By default WHOOP allows each client 100 requests per minute and 10,000 per day, reported in the X-RateLimit-Limit, X-RateLimit-Remaining and X-RateLimit-Reset headers, and answers an over-limit request with 429. You can ask for higher limits from the Developer Dashboard with an Open Request for a rate limit increase."
      },
      {
        "q": "How do I get a refresh token from WHOOP?",
        "a": "Include the offline scope in the authorization request: WHOOP's OAuth guide says you must request it to receive a refresh token. Each refresh invalidates the old access token and returns a new refresh token you must use next time, and two simultaneous refreshes for the same member fail, so refresh on a schedule rather than in parallel."
      },
      {
        "q": "Which WHOOP webhook events exist, and how do I verify them?",
        "a": "WHOOP sends workout.updated, workout.deleted, sleep.updated, sleep.deleted, recovery.updated and recovery.deleted, with creates delivered as updates. Verify each one by computing base64 of HMAC-SHA256 over the X-WHOOP-Signature-Timestamp value plus the raw body, keyed by your client secret, and comparing it with X-WHOOP-Signature. WHOOP retries failures five times over about an hour."
      }
    ],
    "related": [
      {
        "href": "/pricing/whoop-api-pricing",
        "label": "WHOOP API pricing"
      },
      {
        "href": "/alternatives/whoop-api-alternatives",
        "label": "WHOOP API alternatives"
      },
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API"
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
      "pitch": "Integrating wearables like WHOOP into a fitness product? Get our field notes on member tiers, token rotation and webhook security when the docs change."
    },
    "steps": [
      {
        "name": "Join WHOOP and create an app",
        "text": "With an active WHOOP membership, create a team and an app in the WHOOP Developer Dashboard, set redirect URIs and at least one scope, and keep the client secret on your server. The app starts on the Sandbox tier with up to 10 members."
      },
      {
        "name": "Send the member through OAuth",
        "text": "Redirect to the authorization URL with your client ID, redirect URI, scopes such as read:recovery and read:sleep, offline for a refresh token, and an eight-character state value."
      },
      {
        "name": "Exchange the code for tokens",
        "text": "From your backend, POST the authorization code to the token URL and store the access token, its expires_in and the refresh token per member."
      },
      {
        "name": "Call the v2 endpoints",
        "text": "Request cycles, recovery, sleep and workouts under https://api.prod.whoop.com/developer with a Bearer token, paging with next_token until it comes back empty and keeping to 100 requests a minute."
      },
      {
        "name": "Refresh on a schedule",
        "text": "Refresh with grant_type refresh_token and scope offline, replace both stored tokens with the response, and never run two refreshes for one member at once."
      },
      {
        "name": "Receive signed webhooks and climb the tiers",
        "text": "Register a webhook URL, verify X-WHOOP-Signature on every POST, fetch the record each event points to, run a reconciliation job, and request the next member tier from the Dashboard as your connected base grows."
      }
    ],
    "sources": [
      {
        "url": "https://developer.whoop.com/docs/developing/overview/",
        "checked": "2026-10-17",
        "note": "membership required to develop; five-app limit"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/getting-started/",
        "checked": "2026-10-17",
        "note": "teams, apps, scopes, redirect URIs, client secret handling"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/app-approval/",
        "checked": "2026-10-17",
        "note": "member tiers, request rules and review"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/oauth/",
        "checked": "2026-10-17",
        "note": "auth and token URLs, state length, offline scope, refresh rotation, revocation"
      },
      {
        "url": "https://developer.whoop.com/api/",
        "checked": "2026-10-17",
        "note": "API reference: scopes, base URL, endpoints, page sizes"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/pagination/",
        "checked": "2026-10-17",
        "note": "next_token pagination"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/webhooks/",
        "checked": "2026-10-17",
        "note": "event types, payload, signature, retries, limitations"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/rate-limiting/",
        "checked": "2026-10-17",
        "note": "default limits, headers, increases"
      },
      {
        "url": "https://developer.whoop.com/docs/developing/v1-v2-migration/",
        "checked": "2026-10-17",
        "note": "UUIDs, activity ID mapping, v1 no longer supported"
      },
      {
        "url": "https://developer.whoop.com/docs/api-changelog/",
        "checked": "2026-10-17",
        "note": "v2 launch, webhook changes, step_count on cycles"
      },
      {
        "url": "https://developer.whoop.com/docs/partner/overview/",
        "checked": "2026-10-17",
        "note": "Healthcare Partner API scope"
      },
      {
        "url": "https://developer.whoop.com/api-terms-of-use/",
        "checked": "2026-10-17",
        "note": "API Terms of Use effective October 6, 2026: no charge, AI and caching restrictions"
      }
    ]
  },
  {
    "slug": "terra-api",
    "primaryQuery": "how to integrate Terra",
    "h1": "How to Integrate Terra (Health-Data Aggregator) (2026)",
    "metaTitle": "Terra Health Data API: Integrate via One Webhook (2026)",
    "metaDescription": "Integrate Terra once to read Garmin, Oura, WHOOP and 500+ sources: the new widget session endpoint, webhook signature checks, backfills and pricing.",
    "updated": "2026-10-17",
    "answer": "Terra is a health-data aggregator: you integrate once and it returns normalized data from Garmin, Fitbit, Oura, WHOOP, Strava, Apple Health and, on its own count, 500+ providers behind one schema. Your backend authenticates with dev-id and x-api-key headers, creates a widget session at POST https://access.tryterra.co/api/widget/session so the user picks and authorizes their provider, and receives normalized events at a destination such as a webhook, verified with an HMAC-SHA256 terra-signature header. As of October 17, 2026, the older /v2/auth/generateWidgetSession endpoint is closed to accounts created after September 3, 2026 and planned for deprecation on November 3, 2026, and some providers, including WHOOP, Dexcom and Strava, still need your own developer app configured in Terra's dashboard.",
    "body": "The whole reason to use an aggregator, and the thing to hold onto: **one integration, many providers, delivered to one destination.** You never write provider-specific parsing. For where Terra sits among aggregators, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and the head-to-head [Terra vs Vital](/fitness-apis/terra-vs-vital) comparison; the [Terra API overview](/apis/terra) collects how you get access and every page on this site that covers Terra. This guide is also one step on [the reading path for supporting every wearable through one aggregator](/paths), which puts the pages for that job in working order.\n\nEvery endpoint, field and limit below is from Terra's docs, OpenAPI spec and pricing page as we read them on October 17, 2026.\n\n## What changed in this revision\n\n- **The widget endpoint.** Terra relaunched its connect widget. New sessions are created at `POST https://access.tryterra.co/api/widget/session`. The older `/v2/auth/generateWidgetSession`, which an earlier version of this guide used, \"keeps working today, with deprecation planned for 3 November 2026\", and \"Accounts created after 3 September 2026 cannot use it at all.\"\n- **Which providers need your own credentials.** An earlier version listed Garmin, Whoop, Strava and Oura. Terra's current docs name WHOOP, Dexcom, Huawei, Strava and Virtuagym; its integrations table also marks Garmin and Samsung as Required, and lists Oura as Managed. Step 2 has the detail.\n- **Pricing** is now published in full on tryterra.co/pricing; the numbers are under the gotchas below.\n\n## What you'll need\n\n- A **Terra account** with a plan; the dashboard gives you a `dev-id` and an `x-api-key`. Terra keeps separate credentials for testing, staging and production, and the testing and staging environments are capped at 50 users each.\n- A **destination** configured in the Terra dashboard: a webhook URL, or a database, cloud storage bucket or queue that Terra writes into.\n- A **backend** to call Terra's API. Terra's docs are blunt: \"Never share your x-api-key publicly or embed it directly in client-side code (e.g., mobile apps, frontend JavaScript).\"\n- For WHOOP, Dexcom, Strava and the other providers in step 2, **your own developer app** with that provider.\n- The API surface: Terra's OpenAPI spec (version 2026.10.21.1) describes \"The Terra API (v2 surface, served at access.tryterra.co/api/v2)\".\n\n## Step 1: Get your credentials and set up a destination\n\nCreate your account and copy the `dev-id` and `x-api-key` from the dashboard's API Keys page. Every API call sends both as headers:\n\n```http\ndev-id: YOUR_DEV_ID\nx-api-key: YOUR_API_KEY\n```\n\nThen choose where data goes. A webhook is the simplest destination; Terra can also deliver to \"SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore\". Because everything funnels through one destination, you build and test one receiver, not one per wearable.\n\n## Step 2: Register your own credentials for the providers that need them\n\nTerra's docs say it \"manages API Keys of data sources, meaning you can connect users without having to apply for each API Key\", but \"Some providers require special processes before being able to start using them\": WHOOP, Dexcom, Huawei, Strava and Virtuagym.\n\n- **WHOOP and Dexcom.** Each \"requires every company to connect users through its own app\" on its developer portal, with the redirect URL (and, for WHOOP, the webhook URL) \"on a domain that belongs to you\". In the dashboard, open Connections, choose the provider and follow the setup; it configures the custom domain and shows the URLs to paste into your app, and then you apply for production access with the provider.\n- **Strava.** Create an application at strava.com/settings/api, then enter its client ID and secret in the dashboard's Strava setup.\n- **Garmin and Samsung.** Terra's supported-integrations table marks both as Required for integration credentials, while its homepage FAQ says \"Garmin data flows through Terra today\" through Terra's long-standing partner integration. Check the Connections page for your account before promising Garmin support. For Samsung Health's direct route, Terra says to apply through Samsung's partnership portal and develop on the Health Connect route while you wait.\n\nPlan as if a provider that needs special setup cannot be connected until that setup is finished. This is dashboard and paperwork time, not code, so start it first.\n\n## Step 3: Create a widget session from your backend\n\nTo connect a user, your backend creates a hosted **widget session** and sends the user to the URL it returns. Pass your own `reference_id` (your internal user ID) so you can match Terra's user to yours.\n\n```bash\ncurl --request POST \"https://access.tryterra.co/api/widget/session\" \\\n  --header \"dev-id: YOUR_DEV_ID\" \\\n  --header \"x-api-key: YOUR_API_KEY\" \\\n  --header \"Content-Type: application/json\" \\\n  --data '{\n    \"reference_id\": \"user-1234\",\n    \"providers\": \"GARMIN,FITBIT,OURA,WHOOP,STRAVA\",\n    \"auth_success_redirect_url\": \"https://yourapp.com/success\",\n    \"auth_failure_redirect_url\": \"https://yourapp.com/failure\"\n  }'\n```\n\nEvery body field is optional. `providers` is a comma-separated list \"of providers to show, in the order given\"; leave it out and the widget shows the sources enabled in your dashboard. A successful call returns HTTP 201 with the widget `url`, valid for `expires_in` seconds, which Terra documents as 24 hours. Create a fresh session per connect attempt rather than storing URLs. There is no `language` field any more: \"The widget follows the end user's browser language automatically.\"\n\nMigrating from the legacy endpoint? It lived at `POST https://api.tryterra.co/v2/auth/generateWidgetSession`, returned sessions valid for 900 seconds and took `language`, `\"providers\": \"multi-auth\"` and `\"providers\": \"ALL\"`; the new endpoint uses `multi_auth: true` and an omitted `providers` instead. Otherwise the response shape (`session_id`, `url`, `status`, `expires_in`) is unchanged.\n\n## Step 4: Send the user to the widget and handle the auth event\n\nOpen the `url` in a new tab or an in-app browser. Terra's docs say: \"Do not use WebView or iFrame for the authentication flow\", because the user cannot see which domain they are typing a password into, and providers may block it. The user picks a provider and logs in with that provider's own login; afterwards they land on your success URL \"with their Terra user_id and your reference_id as query parameters\".\n\nThe authoritative signal is the **auth event** Terra sends to your destination, carrying the Terra `user_id`, your `reference_id` and the `provider`. Store that `user_id` against your account: it is the key for every later request and the routing key on every payload. If a user reconnects the same provider under the same `reference_id`, Terra \"will delete the previous user record for that account and yield a new user_id\", and \"Terra sends a user_reauth event containing both the old and new user_id\", so handle that event or new data will stop matching your records.\n\n## Step 5: Receive normalized data at your destination\n\nFrom then on, Terra **pushes normalized data events** as the provider syncs. Its event reference lists the data event types as `activity`, `athlete`, `body`, `daily`, `hormone`, `menstruation`, `nutrition` and `sleep`, alongside lifecycle events such as `auth`, `deauth`, `user_reauth` and `access_revoked`. Each payload names the user and provider; the `data` array has the same shape whichever wearable it came from. An abridged example:\n\n```json\n{\n  \"type\": \"activity\",\n  \"user\": {\n    \"user_id\": \"4735eac4-31a2-47ef-8b11-51e98d84c680\",\n    \"reference_id\": \"user-1234\",\n    \"provider\": \"GARMIN\"\n  },\n  \"data\": [ { \"metadata\": {} } ]\n}\n```\n\nRoute on `type` and `user.user_id`. Because the schema is identical across providers, you write one handler for `activity`, one for `sleep`, and so on, never a Garmin parser and a separate WHOOP parser. Terra's guidance for `daily` and `body` events is to overwrite the stored day with the latest payload, because those arrive several times a day as running totals.\n\n## Step 6: Verify the webhook signature\n\n\"Every webhook sent by Terra includes an HMAC-based signature header\", `terra-signature`, in the form `t=<timestamp>,v1=<signature>`. Terra signs with HMAC-SHA256: the signed payload is the timestamp, a `.`, then \"The actual JSON payload (that is, the request body)\", and the key is your endpoint's signing secret. Terra \"requires the raw, unaltered body of the request to perform signature verification\", so read the raw body before any JSON parsing. Ignore every scheme except `v1`, and compare in constant time.\n\n```js\nconst crypto = require(\"crypto\");\n\nfunction verifyTerraSignature(rawBody, header, secret) {\n  // header example: \"t=1723808700,v1=a5ee9dba...\"\n  let timestamp = null;\n  const signatures = [];\n  for (const part of header.split(\",\")) {\n    const [key, value] = part.split(\"=\", 2); // hex values never contain \"=\"\n    if (key === \"t\") timestamp = value;\n    else if (key === \"v1\") signatures.push(value); // ignore other schemes\n  }\n  if (!timestamp || signatures.length === 0) return false;\n  const expected = Buffer.from(\n    crypto.createHmac(\"sha256\", secret).update(`${timestamp}.${rawBody}`).digest(\"hex\")\n  );\n  return signatures.some((sig) => {\n    const provided = Buffer.from(sig);\n    // timingSafeEqual throws on a length mismatch, so check length first\n    return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);\n  });\n}\n```\n\nAlso check the timestamp against your own tolerance, as Terra's docs suggest, to reject replays. Terra recommends its official libraries over a manual check; its webhook docs show Python, JavaScript and Java SDK versions.\n\nRespond quickly: \"Terra waits 8 seconds for your server to respond before considering the request timed out.\" Failed deliveries are retried \"up to 10 times with exponential backoff\", over about eight hours, and then \"the event is dropped. There is no notification when this happens\", so return 200 at once, process asynchronously, and monitor your endpoint.\n\n## Step 7: Pull historical data via REST (optional)\n\nWebhooks give you new data as it arrives. For backfill on first connect, call the per-type endpoints, such as `/activity` (which \"Returns completed workout sessions\"), `/sleep`, `/daily`, `/body`, `/nutrition`, `/menstruation` and `/athlete`, keyed by the Terra `user_id`.\n\n```bash\ncurl --get \"https://access.tryterra.co/api/v2/activity\" \\\n  --header \"dev-id: YOUR_DEV_ID\" \\\n  --header \"x-api-key: YOUR_API_KEY\" \\\n  --data-urlencode \"user_id=USER_ID\" \\\n  --data-urlencode \"start_date=2026-10-01\" \\\n  --data-urlencode \"end_date=2026-10-08\" \\\n  --data-urlencode \"to_webhook=false\" \\\n  --data-urlencode \"with_samples=true\"\n```\n\nFour details from Terra's historical-data guide catch people out:\n\n- `user_id` and `start_date` are required, and `end_date` \"is exclusive on these endpoints\", so pass the day after the last day you want.\n- `to_webhook` \"will always be defaulted to true if not provided\", which sends the data to your destination instead of the response; set it to `false` for a synchronous reply.\n- \"For time ranges longer than 28 days, Terra will default to sending the data asynchronously\", in chunks of at most 10MB.\n- `with_samples` must be true to receive granular data.\n\n## Gotchas and production notes\n\n- **Start provider registrations early.** WHOOP and Dexcom need your own app on their portals and a domain you own, and production access is the provider's decision, not Terra's.\n- **Never expose the API key.** Create widget sessions and pull data only from your backend; calling the API from a browser also fails on CORS.\n- **Verify signatures on day one** and answer within 8 seconds, or events start retrying and, eventually, dropping.\n- **Rate limits.** Terra's overview says it \"has no rate limits of its own\", but its rate-limit reference says it \"applies rate limits on data-read endpoints\": no single request may span more than five years, and a user's requests may not total more than 6,000 requested days in an hour. Chunk backfills accordingly.\n- **Pricing is credit-based, so model it.** As of October 17, 2026, subscriptions \"start from $399 per month billed annually, or $499 per month billed monthly\", including 100,000 credits a month. Each connected data source costs 200 credits a month, the first 400 events per source are free, and extra credits start at $0.005. By our arithmetic, 100,000 credits cover 500 connected sources before events. Re-check tryterra.co/pricing before you budget.\n- **Aggregator, not magic.** Terra removes per-provider OAuth code and per-provider parsing; it does not remove per-provider app approval where the provider requires it. That trade, some dashboard paperwork for one codebase across [many wearables](/fitness-apis/wearable-data-apis), is what you are buying.",
    "faqs": [
      {
        "q": "What makes Terra different from integrating each wearable directly?",
        "a": "Terra is an aggregator: you build one integration and receive Garmin, Fitbit, Oura, WHOOP, Strava, Apple Health and other sources normalized into a single schema at one destination, from a webhook to a database or queue. Instead of separate OAuth flows and parsers per device, you write one receiver. The trade-offs are a credit-based bill, from $399 a month billed annually as of October 17, 2026, and your own developer app for some providers."
      },
      {
        "q": "Do I still need my own developer credentials with each provider?",
        "a": "For some. As of October 17, 2026, Terra's docs say it manages provider API keys in general but names WHOOP, Dexcom, Huawei, Strava and Virtuagym as needing special processes; WHOOP and Dexcom require your own app on their developer portals with URLs on a domain you own. Its integrations table also marks Garmin and Samsung as Required, while its homepage says Garmin data flows through Terra's partner integration, so check your dashboard's Connections page."
      },
      {
        "q": "How does a user connect their wearable through Terra?",
        "a": "Your backend calls POST https://access.tryterra.co/api/widget/session with your dev-id and x-api-key, optionally passing reference_id, a comma-separated providers list and redirect URLs. Terra answers with HTTP 201 and a widget url valid for 24 hours. The user opens it in a new tab or in-app browser, not a WebView or iframe, picks a provider and logs in, and Terra sends an auth event with the Terra user_id you store."
      },
      {
        "q": "How do I verify a Terra webhook is authentic?",
        "a": "Terra signs each webhook with HMAC-SHA256 and sends a terra-signature header in the form t=timestamp,v1=signature. Concatenate the timestamp, a period and the raw request body, compute the HMAC with your endpoint's signing secret, and compare it in constant time with each v1 value, ignoring other schemes. Read the raw body before parsing JSON, or use Terra's official Python, JavaScript or Java libraries."
      },
      {
        "q": "How much does Terra cost?",
        "a": "As of October 17, 2026, Terra's pricing page says subscriptions start from $399 a month billed annually or $499 billed monthly, including 100,000 credits a month. Each connected data source costs 200 credits a month, the first 400 events per source each month are free, extra events cost 0.5 credits, and extra credits start at $0.005, falling to $0.003 past 1,000,000. Add-ons such as streaming are priced separately."
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
        "href": "/alternatives/terra-alternatives",
        "label": "Terra alternatives"
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
      "pitch": "We publish wearable and aggregator integration walkthroughs and log endpoint changes like Terra's widget relaunch, so subscribe and connect the next device without the surprises."
    },
    "steps": [
      {
        "name": "Get your credentials and set up a destination",
        "text": "Create a Terra account to obtain your dev-id and x-api-key, which you send as headers on every call from your backend. Configure a destination, such as a webhook URL, a SQL database, cloud storage or a queue, where Terra delivers events for all providers."
      },
      {
        "name": "Register your own credentials for providers that need them",
        "text": "Terra manages most provider keys, but WHOOP and Dexcom require your own app on their developer portals with URLs on a domain you own, and Strava needs your own application keys. Its integrations table also marks Garmin and Samsung as Required, so check the Connections page in your dashboard."
      },
      {
        "name": "Create a widget session from your backend",
        "text": "Call POST https://access.tryterra.co/api/widget/session with your headers and optional reference_id, providers list and redirect URLs. Terra returns HTTP 201 with a widget url valid for 24 hours; the legacy generateWidgetSession endpoint is closed to accounts created after September 3, 2026."
      },
      {
        "name": "Send the user to the widget and handle the auth event",
        "text": "Open the url in a new tab or in-app browser, not a WebView or iframe, so the user picks and authorizes their provider. Store the Terra user_id from the auth event, and handle user_reauth events, which carry the old and new user_id when a user reconnects."
      },
      {
        "name": "Receive normalized data at your destination",
        "text": "Terra pushes activity, athlete, body, daily, hormone, menstruation, nutrition and sleep events, each naming the user and provider, in the same shape for every source. Write one handler per type, and overwrite daily and body records with the latest payload."
      },
      {
        "name": "Verify the webhook signature",
        "text": "Every webhook carries a terra-signature header of the form t=timestamp,v1=signature. Compute an HMAC-SHA256 over the timestamp, a period and the raw body with your signing secret, compare it in constant time to each v1 value, and respond within 8 seconds."
      },
      {
        "name": "Pull historical data via REST",
        "text": "For backfill, call per-type endpoints such as /activity with the Terra user_id and a start_date; end_date is exclusive. to_webhook defaults to true, so set it to false for a synchronous reply, and expect ranges over 28 days to arrive asynchronously in chunks."
      }
    ],
    "sources": [
      {
        "url": "https://docs.tryterra.co/unified-api/user-authentication/implementation-terra-widget",
        "checked": "2026-10-17",
        "note": "Terra widget session endpoint and legacy deprecation"
      },
      {
        "url": "https://github.com/tryterra/openapi/blob/master/dist/core/v2-bundled.yaml",
        "checked": "2026-10-17",
        "note": "Terra OpenAPI spec: base URL and legacy widget endpoint"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-sources",
        "checked": "2026-10-17",
        "note": "Terra data source count and providers with special setup"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/supported-integrations",
        "checked": "2026-10-17",
        "note": "Terra integration credential requirements"
      },
      {
        "url": "https://tryterra.co/pricing",
        "checked": "2026-10-17",
        "note": "Terra plans, credits, add-ons and Enterprise terms"
      },
      {
        "url": "https://docs.tryterra.co/introduction/account-setup-and-api-keys",
        "checked": "2026-10-17",
        "note": "Terra API key handling"
      },
      {
        "url": "https://docs.tryterra.co/introduction/core-concepts",
        "checked": "2026-10-17",
        "note": "Terra credentials"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/understanding-terra-environments",
        "checked": "2026-10-17",
        "note": "Terra environments and test user limit"
      },
      {
        "url": "https://tryterra.co/",
        "checked": "2026-10-17",
        "note": "Terra coverage, data types, destinations, labs, compliance and pricing FAQ"
      },
      {
        "url": "https://docs.tryterra.co/reference",
        "checked": "2026-10-17",
        "note": "Terra REST reference"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/dedicated-data-source-api-keys",
        "checked": "2026-10-17",
        "note": "Terra managed and dedicated provider keys"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/whoop",
        "checked": "2026-10-17",
        "note": "Terra WHOOP setup"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/dexcom",
        "checked": "2026-10-17",
        "note": "Terra Dexcom setup"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/quickstart",
        "checked": "2026-10-17",
        "note": "Terra quickstart"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/user-authentication/handling-authentication-events",
        "checked": "2026-10-17",
        "note": "Terra authentication and re-authentication events"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/event-types",
        "checked": "2026-10-17",
        "note": "Terra event types"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/integration-setup/setting-up-data-destinations/webhooks",
        "checked": "2026-10-17",
        "note": "Terra webhook signing, retries and timeout"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/managing-user-health-data/requesting-historical-data",
        "checked": "2026-10-17",
        "note": "Terra historical data requests"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/getting-started",
        "checked": "2026-10-17",
        "note": "Terra mobile-only sources, signed webhooks, rate limits"
      },
      {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/rate-limits",
        "checked": "2026-10-17",
        "note": "Terra data-read rate limits"
      },
      {
        "url": "https://docs.tryterra.co/unified-api/pricing",
        "checked": "2026-10-17",
        "note": "Terra credit tiers"
      }
    ]
  },
  {
    "slug": "nutritionix-api",
    "primaryQuery": "how to integrate the Nutritionix API",
    "h1": "How to Integrate the Nutritionix API (2026)",
    "metaTitle": "Nutritionix API Setup: /v2/search/instant & x-app-id",
    "metaDescription": "Nutritionix API: call /v2/search/instant and /v2/natural/nutrients with x-app-id and x-app-key headers, plus UPC barcode lookup and quota gotchas.",
    "updated": "2026-07-09",
    "answer": "The Nutritionix API returns nutrition data for foods: calories and macros for natural-language meals, autocomplete search across common and branded foods, and lookup by item ID or UPC barcode. Auth is a simple API-key pair, not OAuth: you create an application, get an App ID and App Key, and send both as static headers on every request. There is no token exchange, no callback, and nothing to refresh. The base URL is https://trackapi.nutritionix.com/v2/ and the main endpoint is POST /natural/nutrients.",
    "body": "Simplicity is the reason a lot of nutrition apps reach for it first. If you have integrated an OAuth wearable API before, this will feel trivial by comparison — there is no refresh flow to manage and nothing expires mid-session. This guide walks the account setup, the two required headers, and the four endpoints you will actually use, with a real request for each. For where Nutritionix fits against alternatives, see the [best nutrition APIs](/fitness-apis/nutrition-apis) roundup; for the wider product build, see [how to build a nutrition tracking app](/build/nutrition-tracking-app). How you get access, and every page on this site that covers Nutritionix, is collected in the [Nutritionix API overview](/apis/nutritionix).\n\n## What you'll need\n\n- A Nutritionix developer account (sign up at `developer.nutritionix.com`).\n- An **application** created in that account — the App ID and App Key are issued per application, not per account.\n- The two credential values, ready to inject as headers:\n  - `x-app-id` — your application's App ID.\n  - `x-app-key` — your application's App Key.\n- An HTTP client. Everything below is plain REST, so `curl`, `fetch`, or any language's HTTP library works.\n\nThe base URL for all v2 calls is `https://trackapi.nutritionix.com/v2/`.\n\n> **Heads up on an older host.** The archived GitHub doc `nutritionix/api-documentation` still shows a legacy **beta** host (`apibeta.nutritionix.com`) with `Content-Type: text/plain` and header casing like `X-APP-ID`. The current production host is `trackapi.nutritionix.com/v2/`, requests use a JSON body, and header names are case-insensitive. If you copy a snippet off an old blog post and it fails, check the host first. Verify the current host and casing against the live docs before you ship.\n\n## Step 1: Create an application and get your key pair\n\nSign up at `developer.nutritionix.com`, then create an application inside your account dashboard. Nutritionix issues an **App ID** and **App Key** tied to that application. Treat the App Key like a secret — keep it on your server, not in a shipped mobile or web client, so it cannot be scraped and used against your quota.\n\nStore the pair as environment variables:\n\n```bash\nexport NUTRITIONIX_APP_ID=\"YOUR_APP_ID\"\nexport NUTRITIONIX_APP_KEY=\"YOUR_APP_KEY\"\n```\n\n## Step 2: Get nutrients from free-text food (the primary endpoint)\n\nThe endpoint most apps are here for is `POST /natural/nutrients`. You send a plain-English description of a meal and get back itemized nutrition for each food. This is what powers \"type what you ate\" logging.\n\nSend the two auth headers plus a JSON body with a `query` string:\n\n```bash\ncurl -X POST 'https://trackapi.nutritionix.com/v2/natural/nutrients' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"query\": \"for breakfast i ate 2 eggs, bacon, and french toast\"\n  }'\n```\n\nThe response is JSON with a `foods` array. Each entry typically includes `food_name`, `serving_qty`, `serving_unit`, `serving_weight_grams`, `nf_calories`, `nf_total_fat`, `nf_protein`, and `nf_total_carbohydrate`, plus a `full_nutrients` array mapping nutrient IDs to values. Optional documented body params include `timezone`, `aggregate`, and `use_raw_foods`. Confirm the exact field list and parameters against the current docs, since response shapes evolve.\n\nIn JavaScript the same call looks like this:\n\n```js\nconst res = await fetch(\"https://trackapi.nutritionix.com/v2/natural/nutrients\", {\n  method: \"POST\",\n  headers: {\n    \"x-app-id\": process.env.NUTRITIONIX_APP_ID,\n    \"x-app-key\": process.env.NUTRITIONIX_APP_KEY,\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify({ query: \"1 cup cooked quinoa and 4 oz grilled chicken\" }),\n});\nconst data = await res.json();\nfor (const food of data.foods) {\n  console.log(food.food_name, food.nf_calories, \"kcal\", food.nf_protein, \"g protein\");\n}\n```\n\n## Step 3: Add autocomplete with instant search\n\nFor a search-as-you-type UI, use `GET /search/instant`. It takes a `query` parameter and returns two arrays: `common` (generic foods) and `branded` (packaged products). Branded results carry a `nix_item_id` you can use for a precise follow-up lookup.\n\n```bash\ncurl -G 'https://trackapi.nutritionix.com/v2/search/instant' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  --data-urlencode 'query=hamburger'\n```\n\nTypical flow: show the user instant-search suggestions, and when they pick a common food, resolve it through `POST /natural/nutrients`; when they pick a branded food, resolve it through the item lookup in the next step.\n\n## Step 4: Look up a specific item by ID or barcode\n\n`GET /search/item` fetches one branded item. Pass `nix_item_id` for an item you already identified (for example, from instant search), or pass `upc` to resolve a scanned barcode — the path your barcode scanner should hit.\n\nBy item ID:\n\n```bash\ncurl -G 'https://trackapi.nutritionix.com/v2/search/item' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  --data-urlencode 'nix_item_id=YOUR_NIX_ITEM_ID'\n```\n\nBy UPC / barcode:\n\n```bash\ncurl -G 'https://trackapi.nutritionix.com/v2/search/item' \\\n  -H \"x-app-id: $NUTRITIONIX_APP_ID\" \\\n  -H \"x-app-key: $NUTRITIONIX_APP_KEY\" \\\n  --data-urlencode 'upc=49000000450'\n```\n\nBetween these four endpoints you have the full logging loop: free-text entry, autocomplete, ID lookup, and barcode resolution.\n\n## Endpoint reference\n\n| Purpose | Method and path | Key input |\n|---|---|---|\n| Natural-language nutrients | `POST /natural/nutrients` | JSON body with `query` |\n| Instant search (autocomplete) | `GET /search/instant` | `query=` |\n| Item lookup (branded) | `GET /search/item` | `nix_item_id=` |\n| UPC / barcode lookup | `GET /search/item` | `upc=` |\n\nAll paths are relative to `https://trackapi.nutritionix.com/v2/`, and every call carries the `x-app-id` and `x-app-key` headers.\n\n## Gotchas and production notes\n\n- **Keep the App Key server-side.** Because auth is just two static header values with no per-user token, anyone who extracts the pair from a client bundle can spend your quota. Proxy Nutritionix calls through your backend rather than calling it directly from a mobile or browser client.\n- **Free-tier limits are ambiguous — verify them.** Nutritionix has offered a free developer tier that was historically rate-limited (the docs have listed caps such as a per-day limit on the natural endpoints). The exact current tier name, request quotas, and per-endpoint limits change; confirm them against the current docs and your account dashboard before you build volume assumptions on them.\n- **Handle rate-limit and error responses.** Check for non-200 status codes and back off on 429s rather than retrying in a tight loop.\n- **Field shapes can change.** The nutrient field list and optional body params above reflect documented behavior at the time of writing; treat them as a starting point and validate against a live response.\n- **Pair it with an exercise source if you need both sides of the ledger.** Nutrition in, activity out — if you also need workout data, see [how to integrate ExerciseDB](/integrate/exercisedb-api).\n\nNutritionix is one of the lowest-friction integrations in the fitness and nutrition space: create an app, grab two keys, send two headers. The engineering effort goes almost entirely into the logging UX on top, not into the auth plumbing.",
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
    "h1": "How to Integrate the ExerciseDB API (2026)",
    "metaTitle": "How to Integrate ExerciseDB API (2026): RapidAPI Setup",
    "metaDescription": "Integrate ExerciseDB via RapidAPI: subscribe, send X-RapidAPI-Key + Host headers, and query exercises by body part or target. Plus the other ExerciseDB.",
    "updated": "2026-07-09",
    "answer": "ExerciseDB provides a searchable exercise library where each entry includes a name, target muscle, body part, equipment, and an animated gifUrl demo. On the RapidAPI listing this guide was written for (host exercisedb.p.rapidapi.com), you subscribe on RapidAPI and send your key plus the required host header on every request. ExerciseDB is now also sold by AscendAPI, formerly exercisedb.dev, whose V1 is free with no key at oss.exercisedb.dev and whose V2 adds MP4 video through its own RapidAPI listing, with different hosts and field names; as of October 22, 2026 neither is self-hostable. The section near the end covers AscendAPI's endpoints.",
    "body": "## Heads up: \"ExerciseDB\" is two different things\n\nBefore you write any code, know that the name **ExerciseDB** is ambiguous and points at two separate products that even share the same media CDN:\n\n1. **The commercial RapidAPI listing** — host `exercisedb.p.rapidapi.com`, accessed with a RapidAPI key. This is what most tutorials (and this one) mean, and it is the fastest way to get running.\n2. **AscendAPI's ExerciseDB V1 and V2** — exercisedb.dev now presents itself as AscendAPI (\"Previously ExerciseDB\"). V1 has a free hosted tier at `oss.exercisedb.dev` that needs no key, and V1's paid tier and V2 run through AscendAPI's own RapidAPI listings, on different hosts. Their repository, `github.com/ExerciseDB/exercisedb-api`, held only a README and an AGPL-3.0 LICENSE file when we cloned it on October 22, 2026, so there is nothing in it to self-host. These APIs use their **own** endpoint shapes and field names, which do **not** match the RapidAPI paths below.\n\nPick one and code strictly to its docs. Do not assume a path from one works on the other. This guide covers the original RapidAPI listing; the section near the end shows AscendAPI's endpoints. We could not establish whether the two are the same publisher. For a wider comparison of options, see our [exercise database APIs](/fitness-apis/exercise-database-apis) roundup; every page on this site that covers ExerciseDB is listed in the [ExerciseDB API overview](/apis/exercisedb).\n\n## What you'll need\n\n- A **RapidAPI account** (free to create).\n- A **subscription to the ExerciseDB listing** on RapidAPI — even the free tier requires subscribing so your key is authorized for the API.\n- Your **RapidAPI key**, which RapidAPI issues per account and shows on the listing's endpoint page.\n\nThat is the whole checklist. No app-approval step, no partner program.\n\n## Step 1: Subscribe on RapidAPI and copy your key\n\nSign in to RapidAPI, open the ExerciseDB listing, and subscribe to a plan (a free tier exists but is small — see the pricing note below). Once subscribed, the listing's \"Endpoints\" tab shows your `X-RapidAPI-Key` value. Every request you make will carry two headers:\n\n- `X-RapidAPI-Key: YOUR_RAPIDAPI_KEY`\n- `X-RapidAPI-Host: exercisedb.p.rapidapi.com`\n\nThe host header is required by RapidAPI on every proxied call — omitting it returns an error even when the key is valid.\n\n## Step 2: Make your first request\n\nFetch exercises for a body part. The `bodyPart` path segment accepts values like `back`, `chest`, `legs`, and so on:\n\n```bash\ncurl -X GET 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back?limit=10&offset=0' \\\n  -H 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY' \\\n  -H 'X-RapidAPI-Host: exercisedb.p.rapidapi.com'\n```\n\nThe same in JavaScript with `fetch`:\n\n```js\nconst res = await fetch(\n  'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back?limit=10&offset=0',\n  {\n    method: 'GET',\n    headers: {\n      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,\n      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',\n    },\n  }\n);\nconst exercises = await res.json();\n```\n\nEach exercise object returns these fields:\n\n| Field | Description |\n|---|---|\n| `id` | Stable identifier for the exercise |\n| `name` | Exercise name |\n| `bodyPart` | Broad body region (e.g. `back`) |\n| `target` | Primary target muscle (e.g. `lats`) |\n| `equipment` | Required equipment (e.g. `cable`) |\n| `gifUrl` | Animated demo, e.g. `https://static.exercisedb.dev/media/EIeI8Vf.gif` |\n\nNewer versions of the listing may also include `secondaryMuscles` and `instructions` arrays — verify against the current listing before relying on them.\n\n## Step 3: Query by the axis your app needs\n\nThe listing exposes a small, predictable set of endpoints. The three you will use most:\n\n| Purpose | Method + path |\n|---|---|\n| All exercises | `GET /exercises` |\n| By body part | `GET /exercises/bodyPart/{bodyPart}` |\n| By target muscle | `GET /exercises/target/{target}` |\n\nFor example, pull every exercise that targets a specific muscle:\n\n```bash\ncurl -X GET 'https://exercisedb.p.rapidapi.com/exercises/target/biceps?limit=10&offset=0' \\\n  -H 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY' \\\n  -H 'X-RapidAPI-Host: exercisedb.p.rapidapi.com'\n```\n\n`GET /exercises` and the filtered endpoints accept `limit` and `offset` pagination params — verify the current defaults and maximums on the listing, since a bare `GET /exercises` can otherwise return a large payload. The listing also documents additional filter and list endpoints (by equipment, by name, by id, and list-of-values helpers like body parts and targets); confirm their exact paths on the current listing before wiring them in, as they have varied across versions.\n\n## Step 4: Cache the catalog and display the GIFs\n\nExerciseDB data is a reference catalog — it changes rarely — so treat it that way:\n\n- **Cache aggressively.** Fetch once, store the exercises in your own database, and refresh on a schedule rather than calling the API on every user request. This is the single biggest lever on both latency and your rate-limit budget.\n- **Serve `gifUrl` through your own layer** (proxy or re-host where the license allows) so a change to the upstream CDN does not break your UI.\n- **Key your local records on `id`** so you can map favorites, workout plans, and history to a stable reference.\n\nWith the catalog cached, wiring it into a workout builder is straightforward — see our guide to building a [strength-training app](/build/strength-training-app) for how the exercise catalog, sets/reps, and progression fit together.\n\n## AscendAPI's ExerciseDB V1 and V2 (formerly exercisedb.dev)\n\nAscendAPI's documentation, read on October 22, 2026, describes two exercise APIs under the ExerciseDB name.\n\n**ExerciseDB V1, free tier.** \"1,500 exercises with 180p GIFs. No authentication required, just call the hosted API directly\":\n\n```bash\ncurl 'https://oss.exercisedb.dev/api/v1/exercises'\n```\n\nThe response wraps records in `success`, `meta` and `data`. When our snapshot runner called it, `meta` reported a total of 1,500 with `hasNextPage` and a `nextCursor` for the next page, and each record carried `exerciseId`, `name`, `gifUrl`, `bodyParts`, `equipments`, `targetMuscles`, `secondaryMuscles` and `instructions`. Note the plural arrays, where the RapidAPI listing above returns single `bodyPart`, `target` and `equipment` values. A paid V1 tier on RapidAPI (host `edb-with-gifs-and-images-by-ascendapi.p.rapidapi.com`) adds 360p to 1080p images and GIFs, difficulty levels and exercise types.\n\n**ExerciseDB V2.** RapidAPI only, with an MP4 demonstration video per exercise in `videoUrl`. AscendAPI's quickstart subscribes to the free Basic plan (2,000 requests a month, 200 exercises, images and videos, no credit card) and makes this first request:\n\n```bash\ncurl 'https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/search?search=chest%20press' \\\n  -H 'x-rapidapi-host: edb-with-videos-and-images-by-ascendapi.p.rapidapi.com' \\\n  -H 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'\n```\n\nFree-tier V2 media is watermarked, AscendAPI's free plans are limited to 1,000 requests per hour per key, and paid prices are on its RapidAPI listings, which we could not read. Formats and resolutions are covered in [how ExerciseDB V2 serves MP4 video](/fitness-apis/exercise-video-apis).\n\nNeither is self-hostable: the repository has no API code. If you would rather own the data, compare the [public-domain alternative, free-exercise-db](/compare/exercisedb-vs-free-exercise-db), or see [ExerciseDB alternatives](/alternatives/exercisedb-alternatives) for wger.\n\n## Gotchas and production notes\n\n- **Free tier is tiny.** The free plan on the original RapidAPI listing has been reported at roughly ~10 requests/day — enough to prototype, not to run in production; we could not re-read that listing on October 22, 2026. AscendAPI documents its own free limits: 1,000 requests per hour per key on free plans, and 2,000 requests a month on the V2 Basic plan. Plan around caching either way.\n- **Both headers are mandatory.** Missing or wrong `X-RapidAPI-Host` fails the request even with a valid key.\n- **Don't mix the ExerciseDB hosts.** The RapidAPI listing's paths will not work against AscendAPI's endpoints, and vice versa.\n- **Keep your key server-side.** Never ship `X-RapidAPI-Key` in client-side web code; proxy requests through your backend.\n- **Field list can drift.** Treat `secondaryMuscles`/`instructions` and the extra filter endpoints as \"verify against current docs\" rather than guaranteed.\n\nFor where ExerciseDB fits among other catalog and movement-data providers, see our [exercise database APIs](/fitness-apis/exercise-database-apis) comparison.",
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
        "a": "Yes, to start. As of October 22, 2026, AscendAPI's ExerciseDB V1 is free with no key at oss.exercisedb.dev (1,500 exercises, 180p GIFs), and its ExerciseDB V2 has a free Basic plan on RapidAPI with 2,000 requests a month and 200 exercises, with watermarked media. The free tier on the original RapidAPI listing this guide covers has been reported as very small, and we could not re-read it, so verify its current quota on the listing."
      },
      {
        "q": "What is the difference between the RapidAPI ExerciseDB and exercisedb.dev?",
        "a": "exercisedb.dev now presents itself as AscendAPI, previously ExerciseDB. It serves ExerciseDB V1 free with no key at oss.exercisedb.dev and sells V1 and V2 through its own RapidAPI listings, on hosts such as edb-with-videos-and-images-by-ascendapi.p.rapidapi.com, with plural fields like bodyParts and targetMuscles. The original RapidAPI listing at exercisedb.p.rapidapi.com uses different paths and single bodyPart and target fields. We could not establish whether they share a publisher, so code to one set of docs and do not mix the paths."
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
        "name": "Know AscendAPI's ExerciseDB",
        "text": "If the RapidAPI free tier is too small, AscendAPI, formerly exercisedb.dev, serves ExerciseDB V1 free with no key at oss.exercisedb.dev and V2, with MP4 video, through its own RapidAPI listing. Its endpoint shapes differ, and its repository has no code to self-host, so look at wger or free-exercise-db if you need to own the data."
      }
    ]
  },
  {
    "slug": "polar-api",
    "primaryQuery": "how to integrate the Polar API",
    "h1": "How to Integrate the Polar API (2026)",
    "metaTitle": "Polar AccessLink API (2026): OAuth, Webhooks, Rate Limits",
    "metaDescription": "Integrate Polar AccessLink v3: self-serve clients, OAuth with one scope, user registration, non-transactional endpoints, webhooks and dynamic rate limits.",
    "updated": "2026-10-17",
    "answer": "Polar's cloud API is AccessLink v3, and it is self-serve: any registered Polar Flow user can create an API client at admin.polaraccesslink.com, and Polar's license agreement says the APIs are currently free of charge. Users authorize through OAuth 2.0 at flow.polar.com with the single accesslink.read_all scope, you exchange the code within 10 minutes at polarremote.com, and you must register each user with a POST to /v3/users before any data is readable. Polar has deprecated its transaction model in favor of plain GET endpoints, offers one signed webhook per client, and scales rate limits with your number of registered users.",
    "faqs": [
      {
        "q": "Is the Polar AccessLink API self-serve or does it need partner approval?",
        "a": "Self-serve. Polar's documentation says any registered Polar Flow user can create an API client by filling in application details at admin.polaraccesslink.com, then noting the OAuth2 client ID and secret. No review step is described. Polar's API license agreement says the use and activation of its APIs is currently free of charge, with the right to charge fees later."
      },
      {
        "q": "What are the Polar AccessLink OAuth and API base URLs?",
        "a": "Users authorize at https://flow.polar.com/oauth2/authorization, you exchange the code at https://polarremote.com/v2/oauth2/token with HTTP Basic client credentials, and data is served from https://www.polaraccesslink.com/v3. The authorization code expires in 10 minutes and is single-use: reusing it makes Polar delete all tokens it issued."
      },
      {
        "q": "Are Polar transactions still required?",
        "a": "No. Polar's changelog deprecated the transactional endpoints for exercises and daily activity on August 18, 2025, and for physical info on January 13, 2026, and added non-transactional GET endpoints in their place. Transactions still work for older integrations, but committing one deletes its data, so persist everything first."
      },
      {
        "q": "Why can I only see recent Polar data?",
        "a": "Because Polar's endpoints document short windows. Exercises cover only data uploaded to Flow in the last 30 days and after the user registered with your client. Sleep and Nightly Recharge cover the last 28 days. Daily activity can reach back up to 365 days, but each request spans at most 28 days."
      },
      {
        "q": "Does Polar AccessLink support webhooks and publish rate limits?",
        "a": "Yes to both. Each client can register one webhook, signed with HMAC SHA-256 using a secret returned only at creation, for events such as EXERCISE, SLEEP and ACTIVITY_SUMMARY. Rate limits scale with your registered users: 500 plus 20 per user per 15 minutes, and 5,000 plus 100 per user per 24 hours."
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
        "href": "/learn/what-is-oauth-for-health-data",
        "label": "What is OAuth for health data?"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We read the primary sources for every wearable integration we cover, down to the changelog entries that deprecate an endpoint. Get the weekly rundown."
    },
    "steps": [
      {
        "name": "Create an API client",
        "text": "Log in at admin.polaraccesslink.com with your Polar Flow account, fill in your application details and create a client. Register your redirect URLs, pick a default, and keep the client ID and secret on your server."
      },
      {
        "name": "Send the user through Polar Flow",
        "text": "Redirect the user to https://flow.polar.com/oauth2/authorization with response_type=code, your client_id, your redirect_uri and a random state, and check state on the callback."
      },
      {
        "name": "Exchange the code within 10 minutes",
        "text": "POST the code to https://polarremote.com/v2/oauth2/token with HTTP Basic client credentials. Use each code once, and store the access token and x_user_id against your user."
      },
      {
        "name": "Register the user",
        "text": "POST your member-id for the user to /v3/users with the user's bearer token. A 409 means the user is already registered or the member-id is taken; a 403 means mandatory consents are missing."
      },
      {
        "name": "Create the webhook and save its secret",
        "text": "Create your one webhook with POST /v3/webhooks using client credentials, answer Polar's ping with 200 OK, and store the signature_secret_key from the response. Verify Polar-Webhook-Signature on every event."
      },
      {
        "name": "Fetch data from the non-transactional endpoints",
        "text": "On each event, or on a schedule, read exercises, daily activity, sleep, Nightly Recharge and other data with GET requests, respecting each endpoint's window and the RateLimit headers."
      }
    ],
    "body": "Polar's cloud API is **AccessLink API v3**, and it is one of the few self-serve wearable APIs: Polar's documentation says any registered Polar Flow user can create an API client at `https://admin.polaraccesslink.com`. This guide is built from that documentation, its `swagger.yaml`, and Polar's API license agreement, all read on October 17, 2026. It replaces an earlier version written only from Polar's example repository, which described AccessLink as pull-only with no published rate limits; Polar's own reference documents both webhooks and rate limits.\n\nStill choosing a provider? That belongs to our [wearable data APIs](/fitness-apis/wearable-data-apis) roundup; this page assumes the decision is made. Every page on this site that covers Polar is collected in the [Polar API overview](/apis/polar).\n\n## Access and approval\n\n| Question | What Polar's documentation says |\n|---|---|\n| Who can get a client? | \"Any registered Polar Flow user\", by filling in application details at admin.polaraccesslink.com |\n| Is there a review? | None is described: you create the client and note its OAuth2 client ID and secret |\n| What does it cost? | The license agreement says Polar offers the use and activation of its APIs free of charge \"at the moment\", and reserves the right to charge fees; see [Polar API pricing](/pricing/polar-api-pricing) |\n| What must users do? | Each user must accept all mandatory consents; without them, user endpoints return 403 |\n\nPolar's getting-started list is short: create a Polar Flow account, log in at the admin site, create a client, get an authorization code for the user, exchange it for an access token, and **register the user** before you read anything. Users can change their consents at any time at `https://account.polar.com`.\n\n## Auth and scopes\n\nAccessLink uses OAuth 2.0 with the authorization-code flow only: Polar says \"code\" is the only response type supported.\n\n```http\nGET https://flow.polar.com/oauth2/authorization\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/oauth2_callback\n  &state=RANDOM_ANTI_CSRF_STRING\n```\n\n- **Scope.** There is one: AccessLink uses the `accesslink.read_all` scope. If you leave `scope` out, the user is asked to authorize every scope linked to your client.\n- **Redirect URIs.** `redirect_uri` must be identical to one registered for the client. You can register several and pick a default in the admin site; without the parameter, the only or default URL is used.\n- **State.** Optional in Polar's table, but use it: Polar says it can be used to prevent CSRF attacks.\n- **The code is fragile.** It expires in 10 minutes and must only be used once. If it is used more than once, Polar denies the request and deletes all tokens issued.\n\nExchange the code at the token endpoint, authenticating with HTTP Basic (your client ID and secret, base64-encoded):\n\n```bash\ncurl -s -X POST \"https://polarremote.com/v2/oauth2/token\" \\\n  -u \"YOUR_CLIENT_ID:YOUR_CLIENT_SECRET\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -H \"Accept: application/json;charset=UTF-8\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=AUTHORIZATION_CODE\" \\\n  -d \"redirect_uri=https://yourapp.example.com/oauth2_callback\"\n```\n\n`redirect_uri` is required here only if you sent it to the authorization endpoint. The response holds `access_token`, `token_type` (bearer), `expires_in` and `x_user_id`, the Polar user ID used in later paths. Polar's documentation is not consistent on lifetime: the token response describes `expires_in` with an example of 31535999 seconds, about one year, while the section on making requests says access tokens \"will not expire unless explicitly revoked by partners or users\". Store `expires_in` and handle a 401 by sending the user through authorization again.\n\nAccessLink then uses two kinds of authentication. Requests to `/v3/users` and its subresources use the user's bearer token; every other `/v3/` request, such as `/v3/notifications` and the webhook endpoints, uses your client credentials as HTTP Basic. Mixing them up produces failures that look like bad tokens.\n\n## Register the user before reading anything\n\nOnce a user has authorized you, Polar says you \"must register the user before being able to access its data\". POST your own identifier for them with the user's token:\n\n```bash\ncurl -s -X POST \"https://www.polaraccesslink.com/v3/users\" \\\n  -H \"Authorization: Bearer USER_ACCESS_TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Accept: application/json\" \\\n  -d '{\"member-id\": \"your-internal-user-id\"}'\n```\n\nA 409 means the user is already registered to you or the `member-id` is a duplicate; a 403 means the user has not accepted all mandatory consents. `GET /v3/users/{user-id}` returns the user's basic information, and `DELETE /v3/users/{user-id}` de-registers the user, which Polar says \"will revoke the access token authorized by user\". Use it as your disconnect action.\n\n## Data: the non-transactional endpoints\n\nPolar has been replacing its transaction model with plain GET endpoints that take the user's token and need no transaction. Read windows differ by type, so design your sync around them:\n\n| Data | Endpoint | Window Polar documents |\n|---|---|---|\n| Exercises | `GET /v3/exercises`, then `/v3/exercises/{exerciseId}` with `/fit`, `/tcx` and `/gpx` | Uploaded to Flow in the last 30 days, and only after the user registered with your client; `samples`, `zones` and `route` query flags add detail |\n| Daily activity | `GET /v3/users/activities`, `/activities/{date}`, `/activities/samples` | Last 28 days by default; `from` can go back up to 365 days, with at most 28 days between `from` and `to` |\n| Physical info | `GET /v3/users/physical-info` | The user's physical information |\n| Continuous heart rate | `GET /v3/users/continuous-heart-rate/{date}` or with `from` and `to` | Samples recorded in 5-minute intervals on supported devices; training-session samples are not included |\n| Cardio load | `GET /v3/users/cardio-load` and by date, range, days or months | Last 28 days by default, with one entry for every day in the range |\n| Sleep | `GET /v3/users/sleep`, `/sleep/{date}`, `/sleep/available` | Last 28 days |\n| Nightly Recharge | `GET /v3/users/nightly-recharge`, `/nightly-recharge/{date}` | Last 28 days |\n| SleepWise alertness and circadian bedtime | `GET /v3/users/sleepwise/alertness`, `/sleepwise/circadian-bedtime`, plus `/date` range variants | Last 28 days, or a date range; needs at least 5 days of sleep data on supported devices |\n| Elixir biosensing | `GET /v3/users/biosensing/bodytemperature`, `skintemperature`, `skincontacts`, `ecg`, `spo2` | Optional inclusive `from` and `to` dates |\n\n```bash\ncurl -s -H \"Authorization: Bearer USER_ACCESS_TOKEN\" -H \"Accept: application/json\" \\\n  \"https://www.polaraccesslink.com/v3/users/activities?from=2026-10-01&to=2026-10-16\"\n```\n\nUser endpoints answer 403 when the user has not accepted all mandatory consents, so treat that as a state to show the user, not a bug.\n\n## The deprecated transaction model\n\nOlder integrations, including Polar's own example repository, use transactions: you POST to a per-user `exercise-transactions`, `activity-transactions` or `physical-information-transactions` path, GET the list of resource URLs, fetch each one, then PUT the transaction to commit. Committing is destructive: Polar's response for a commit reads \"Transaction has been committed and data deleted.\" An exercise or activity transaction holds at most 50 items, and only data uploaded after the user registered with your client is available, within the last 28 or 30 days depending on which part of Polar's reference you read.\n\nPolar's changelog deprecated the transactional endpoints for exercises and daily activity on August 18, 2025, and for physical info on January 13, 2026. New builds should use the non-transactional endpoints above. If you still run transactions, persist everything before you commit.\n\n`GET /v3/notifications`, called with client credentials, still lists users with exercise or activity data waiting, each with a `data-type` and a URL; a 204 means nothing is available.\n\n## Webhooks\n\nAccessLink has webhooks, and they replace polling for most designs:\n\n- **One per client.** Polar says a client application can only have one webhook registered. Create it with `POST /v3/webhooks` using client credentials, naming the event types and target URL.\n- **A ping first.** On creation Polar sends a `PING` event to the URL, and the webhook is not created unless your endpoint answers 200 OK. Updating the URL with `PATCH /v3/webhooks/{webhook-id}` triggers a new ping.\n- **Save the secret at once.** The create response carries a `signature_secret_key` that is \"not available after create\". Polar signs every payload with HMAC SHA-256 using that key and sends the result in a `Polar-Webhook-Signature` header, with the event type in `Polar-Webhook-Event`.\n- **Events.** Payload schemas exist for `EXERCISE`, `SLEEP`, `CONTINUOUS_HEART_RATE`, `SLEEP_WISE_CIRCADIAN_BEDTIME`, `SLEEP_WISE_ALERTNESS`, `ACTIVITY_SUMMARY` and `PHYSICAL_INFORMATION`. Polar's exercise example carries `event`, `user_id`, `entity_id`, `timestamp` and a `url` to fetch.\n- **Failures.** Delivery expects a 200 response. A webhook that has not delivered successfully for seven days is deactivated automatically; `POST /v3/webhooks/activate` turns it back on if your URL answers the ping, and `POST /v3/webhooks/deactivate` pauses it on purpose.\n\n## Rate limits\n\nPolar uses a dynamic limit that scales with your number of registered users and is recalculated daily:\n\n| Window | Formula |\n|---|---|\n| Short term, 15 minutes | 500 + number of users × 20 |\n| Long term, 24 hours | 5,000 + number of users × 100 |\n\nEvery response carries `RateLimit-Usage`, `RateLimit-Limit` and `RateLimit-Reset`, each holding two comma-separated values, short term first. Requests over the limit get 429, and requests that break the short-term limit still count toward the long-term one. Polar's license agreement also treats load testing without Polar's prior approval as interfering with its service, so do not benchmark against production.\n\n## What changed recently\n\n| Date (Polar's changelog) | Change |\n|---|---|\n| January 13, 2026 | Non-transactional physical info endpoint and a `PHYSICAL_INFORMATION` webhook event added; transactional physical info deprecated |\n| August 18, 2025 | Non-transactional daily activity endpoints added; transactional daily activity and exercises deprecated |\n| March 21, 2024 | Route data added to exercises |\n| March 5, 2024 | Body temperature endpoint added to Elixir biosensing |\n| January 18, 2024 | An `active` property added to the webhook info |\n| December 19, 2023 | Elixir biosensing data released in beta |\n| June 28, 2023 | Mandatory consents checked on data requests, with 403 when missing; webhooks deactivated after 7 days of failed delivery; activate and deactivate endpoints added |\n\n## Gotchas and production notes\n\n- **Register, then read.** Authorization alone returns no data until you POST the user to `/v3/users`.\n- **No history before registration for exercises.** Exercise endpoints return only data uploaded after the user registered with your client, and only from the last 30 days. Tell users that connecting Polar starts their exercise history rather than importing it.\n- **Short windows.** The sleep, Nightly Recharge and SleepWise lists cover the last 28 days and exercises the last 30, so sync regularly or use the webhook.\n- **The code is single-use.** Reusing an authorization code deletes all issued tokens.\n- **Consents can be withdrawn.** A 403 after a working connection usually means the user changed consents at account.polar.com.\n- **Commit destroys, if you still use transactions.** Persist and confirm the write before the PUT.\n\nFor webhook patterns in general, see [what are webhooks](/learn/what-are-webhooks); for the OAuth basics, [what is OAuth for health data](/learn/what-is-oauth-for-health-data). Polar's single scope is far simpler than an [Oura integration](/integrate/oura-api), which lists eight scopes users can toggle at consent. The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "sources": [
      {
        "url": "https://www.polar.com/accesslink-api/",
        "checked": "2026-10-17",
        "note": "AccessLink v3 reference: getting started, OAuth endpoints, scope, token response, two auth modes, users, data endpoints, webhooks, rate limits, changelog"
      },
      {
        "url": "https://www.polar.com/accesslink-api/swagger.yaml",
        "checked": "2026-10-17",
        "note": "endpoint windows, deprecated transactions, commit deletes data, webhook endpoints"
      },
      {
        "url": "https://www.polar.com/en/legal/polar-api-agreement",
        "checked": "2026-10-17",
        "note": "free of charge at the moment, right to charge fees, load testing needs approval"
      }
    ]
  },
  {
    "slug": "mindbody-api",
    "primaryQuery": "how to integrate the Mindbody API",
    "h1": "How to Integrate the Mindbody API (2026)",
    "metaTitle": "Mindbody API Integration Guide (2026): Go-Live, Webhooks",
    "metaDescription": "Integrate the Mindbody Public and Webhooks APIs: developer account, go-live approval, studio activation, the API-Key header, signed webhooks and limits.",
    "updated": "2026-10-17",
    "answer": "Mindbody's developer program starts with a self-serve developer account, but going live is approval-gated: you request to go live, Mindbody approves you, and each business then activates your access with an activation link or code. Every request carries an API key in an API-Key header plus a User-Agent header, and Mindbody says requests must come from your back-end servers because keys cannot be stored safely on mobile devices or websites. For changes, the Webhooks API pushes events such as class bookings, new clients and sales, signed with HMAC-SHA-256 and resent every 15 minutes for up to 3 hours, and Mindbody recommends re-syncing cached data through the Public API every 24 hours.",
    "body": "Mindbody gives developers two APIs: the **Public API**, which reads and writes a business's schedule, clients, sales and staff, and the **Webhooks API**, which pushes an event to your server when that data changes. This guide is written from Mindbody's own developer pages as they stood on October 17, 2026: the developer FAQ, the endpoints overview, the Webhooks documentation, the API Terms of Use, the Security Policy and the API release notes.\n\n> **Sourcing note.** Mindbody's Public API V6 reference is a JavaScript application, and it returned no readable text to our fetch. Endpoint paths, request fields and any OAuth flow documented only there are not covered on this page. Check them in the reference itself before you build.\n\nStill choosing a platform? Our [gym and studio management software API comparison](/fitness-apis/gym-management-software-apis) puts Mindbody next to TeamUp, Mariana Tek, Wodify and ABC Glofox. What the API costs is on [Mindbody API pricing](/pricing/mindbody-api-pricing).\n\n## What the Mindbody API covers\n\nMindbody's FAQ says the API \"can be used to output live data from your Mindbody system to your main website\", and lists what it does with site data: show the class or appointment schedule, add clients into services, access and manage client data, complete sales for services and retail products, and add and retrieve staff profiles and permissions. The endpoints overview groups the data like this:\n\n| Service | What Mindbody lists |\n|---|---|\n| Appointment | Book appointments, update appointments, view a staff member's appointment schedule |\n| Class | Class registration, update a client's visit, enrollment registration, view the class schedule |\n| Client | Add or update basic client information; contact logs, relationships and indexes; purchases and account; visit history |\n| Sale | Complete service and product purchases; view pricing options, products and packages; update products |\n| Site | Site and location information, service categories, resources, session types, activation codes, relationship types |\n| Staff | Add or update staff information, view staff permissions, retrieve staff photos |\n\nThe same FAQ is candid about gaps. Asked whether the API can do everything, it answers \"Not yet\" and says the goal is to allow all Consumer and Business Mode functionality through the API. Card payments need the studio to hold an active Mindbody merchant account with one of the supported processors (TSYS, Bluefin, Elavon, Paysafe, Ezidebit and Adyen), which Mindbody says limits that access to the US, Canada (except Moneris clients), the UK, the EU, Australia, New Zealand and Hong Kong. ACH, Direct Debit and SEPA are not supported through the API.\n\nOn versions, Mindbody's documentation says a developer account created on or after February 19, 2020 can only access V6.0 of the Public API, and that the V5.0 and V5.1 documentation needs a login.\n\n## Access: sign up, go live, then activate each business\n\nMindbody's Webhooks getting-started steps spell out the access path:\n\n1. Create a developer account on Mindbody's developer portal.\n2. While logged in, request to go live with that account.\n3. Once Mindbody approves you for live access, activate the link between your developer account and at least one Mindbody business.\n\nThe FAQ describes the business side of step 3: once the developer has joined the program and the business has given access to its site data \"using an activation link or code\", the integration can begin. The endpoints overview lists generating activation codes under the Site service.\n\nIn our reading, that makes every studio an explicit opt-in. Mindbody's approval gets you live, but a business's data flows only after that business activates you. Mindbody's API Terms of Use point the same way: among the prohibited uses are accessing Mindbody Data without the authorization of the Subscriber, and requiring end users to give their login credentials to a third-party developer.\n\n## Authentication: an API key, from your server only\n\n- **Header.** Pass an API key in an `API-Key` header. A call without one gets HTTP 401 and the error type `missingAPIKeyHeader`.\n- **One set of keys.** Keys live on the API Credentials page of your developer account, and the Webhooks API accepts the same keys as the Public API.\n- **Server-side only.** Mindbody says that because API keys cannot be safely stored on mobile devices or websites, all requests to the API must come from your back-end servers.\n- **User-Agent.** Mindbody requires a `User-Agent` header on calls to its APIs.\n\nMindbody's Security Policy adds handling rules: store credentials securely at rest and in transit, share them with your team only on a need-to-know basis, never keep them in source control, and never let them be logged, even in development tools. It warns that a violation could cost you access to the Mindbody API permanently.\n\nMindbody's release notes also mention requests made with an OAuth consumer identity token and with business mode authentication. How to obtain those tokens is documented in the V6 reference we could not read.\n\n## Webhooks: subscriptions, signatures and retries\n\nThe Webhooks API lives at `https://mb-api.mindbodyonline.com/push/api/v1`, accepts and returns JSON, and must be called over HTTPS with TLS 1.2 or higher. You create a subscription for one or more events with a POST, activate it with a PATCH, and deactivate it with a DELETE.\n\nYour webhook URL has to:\n\n- accept HTTPS connections using TLS 1.2 or higher;\n- accept both POST requests, which deliver events, and HEAD requests, which Mindbody uses to check the URL when you create a subscription;\n- answer with a 2xx within 10 seconds. Otherwise Mindbody resends the event every 15 minutes and gives up after 3 hours.\n\nMindbody does not guarantee that an event arrives only once or in chronological order, so it recommends idempotent processing, and it suggests putting incoming events on a queue so you can respond quickly. If Mindbody stops getting 2xx responses, it may deactivate the subscription and email the developer portal account that created it. Events that happen while a subscription is inactive are not stored or delivered later.\n\n### Verify the signature\n\nEach delivery carries an `X-Mindbody-Signature` header. Mindbody's instructions: compute an HMAC-SHA-256 of the request body, keyed with the `messageSignatureKey` returned when you created the subscription, prepend `sha256=`, and compare the result with the header. Mindbody's C# sample Base64-encodes the hash before prepending the prefix. The same check in Node.js:\n\n```js\nimport crypto from \"node:crypto\";\n\n// rawBody: the exact bytes Mindbody posted.\n// key: the messageSignatureKey returned when the subscription was created.\nexport function isMindbodySignatureValid(rawBody, header, key) {\n  const expected =\n    \"sha256=\" + crypto.createHmac(\"sha256\", key).update(rawBody, \"utf8\").digest(\"base64\");\n  const a = Buffer.from(expected);\n  const b = Buffer.from(header ?? \"\");\n  return a.length === b.length && crypto.timingSafeEqual(a, b);\n}\n```\n\n### What you can subscribe to\n\nMindbody's event reference covers sites and business-day closures, locations, appointments and appointment add-ons, class schedules, single classes, class bookings and their status, class waitlists, class descriptions, clients (including profile merges), memberships, contracts, sales and staff. For example, `classRosterBooking.created` fires when a client is booked into a class, `client.created` when a new client is added to a business, and `clientSale.created` when a sale is made to a client. The June 2026 release notes added three Pick a Spot events: `pickASpotReservation.created`, `pickASpotReservation.updated` and `pickASpotReservation.deleted`.\n\nAn event carries only some fields, so Mindbody tells you to call the Public API for the rest and to re-sync your cached data through the Public API every 24 hours. To match events with your own writes, send the optional `Transaction-Key` header (up to 50 characters) on Public API calls. Events those calls trigger carry it back as `transactionKey`, provided the source name making the call is the one that created the webhook subscription.\n\n## Limits\n\nThe Webhooks documentation describes two kinds of rate limits: daily call limits, which are defined when you receive your API key, and system limits. To raise yours, you contact your account manager. The API Terms of Use say Mindbody sets call limits based on how your applications may be used and their anticipated volume, may charge for calls over the limit or terminate access, and never rolls unused calls over to the next day or month. Mindbody's FAQ puts a number on the daily allowance and the charge beyond it, which we cover on [Mindbody API pricing](/pricing/mindbody-api-pricing).\n\n## Terms that shape your architecture\n\nThree clauses in Mindbody's API Terms of Use, last updated September 30, 2023, affect design, not just legal review:\n\n- **Caching.** The prohibited uses include caching Mindbody Data in excess of 48 hours. Together with the Webhooks advice to re-sync every 24 hours, in our reading the intended pattern is a short-lived cache refreshed from Mindbody, not a long-term copy. Read the full clause with counsel before you design storage.\n- **Competition.** You may not use the API in a product or service that competes with Mindbody's own products or services.\n- **Termination.** Mindbody may suspend or terminate API access at any time. You can end the agreement with 90 days' written notice.\n\nThis is general information, not legal advice.\n\n## What changed in 2026\n\nFrom Mindbody's API release notes:\n\n- **July 2026.** Cancelling a class now requires credentials with both the Manage Class Schedules and Cancel Reservations permissions, in V5 and V6. Without the second permission the request returns a permission error and cancels nothing.\n- **June 2026.** Apple Pay became available to every Public API customer through the existing alternative-payments checkout flow (payment method ID 801), and Pick a Spot reservations gained webhook events.\n- **May 2026.** `AddAppointment` accepts multiple appointments in one request that either creates all of them or none, and `AddMultipleAppointments` was deprecated.\n\nFor the general patterns behind this page, see [what webhooks are](/learn/what-are-webhooks) and [ingesting webhooks reliably](/architecture/webhook-ingestion). The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Does the Mindbody API need approval before an integration goes live?",
        "a": "Yes. Mindbody's getting-started steps are to create a developer account, request to go live while logged in, and, once Mindbody approves you for live access, activate the link between your developer account and at least one Mindbody business. Mindbody's FAQ says a business gives a developer access to its site data with an activation link or code, so each studio opts in separately after Mindbody's approval."
      },
      {
        "q": "How are Mindbody API requests authenticated?",
        "a": "With an API key sent in an API-Key header, created on the API Credentials page of your Mindbody developer account. The same keys work for the Public API and the Webhooks API, a call without the header returns HTTP 401, and Mindbody requires a User-Agent header too. Mindbody says all requests must come from your back-end servers, because API keys cannot be safely stored on mobile devices or websites."
      },
      {
        "q": "How do I verify that a webhook really came from Mindbody?",
        "a": "Check the X-Mindbody-Signature header. Mindbody's instructions are to compute an HMAC-SHA-256 of the request body using the messageSignatureKey returned when you created the subscription, prepend sha256= to the encoded result, and compare it with the header; Mindbody's C# sample Base64-encodes the hash. If the strings match, Mindbody says the message came from its servers."
      },
      {
        "q": "What happens when my Mindbody webhook endpoint is down?",
        "a": "Mindbody resends an event every 15 minutes when it gets no 2xx response within 10 seconds, and stops after 3 hours. If it keeps failing, Mindbody may deactivate the subscription and email the developer portal account that created it, and events that occur while the subscription is inactive are not stored for later delivery. Reactivate the subscription with a PATCH once the endpoint is fixed, and run a manual sync through the Public API."
      },
      {
        "q": "Can I keep a copy of Mindbody data in my own database?",
        "a": "Only with care. Mindbody's API Terms of Use list caching Mindbody Data in excess of 48 hours among the prohibited uses, and its Webhooks documentation recommends re-syncing cached data through the Public API every 24 hours. In our reading that points to a short-lived cache refreshed from Mindbody rather than a permanent copy. Read the full clause with counsel; this is not legal advice."
      }
    ],
    "related": [
      {
        "href": "/pricing/mindbody-api-pricing",
        "label": "Mindbody API pricing"
      },
      {
        "href": "/fitness-apis/gym-management-software-apis",
        "label": "Gym and studio management software APIs"
      },
      {
        "href": "/architecture/webhook-ingestion",
        "label": "Ingesting webhooks reliably"
      },
      {
        "href": "/learn/what-are-webhooks",
        "label": "What are webhooks?"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We read Mindbody's developer pages, terms and release notes so you don't have to. Subscribe to hear when its access rules, limits or fees change."
    },
    "steps": [
      {
        "name": "Create a developer account",
        "text": "Sign up on Mindbody's developer portal. The account holds your API keys on its API Credentials page, and the same keys work for the Public API and the Webhooks API."
      },
      {
        "name": "Request to go live",
        "text": "While logged into the developer account, request to go live. Mindbody has to approve you for live access before you can work with a real business."
      },
      {
        "name": "Get each business to activate you",
        "text": "Once approved, activate the link between your developer account and each Mindbody business you serve. Mindbody's FAQ says the business gives you access to its site data with an activation link or code."
      },
      {
        "name": "Call the Public API from your server",
        "text": "Send your key in the API-Key header with a User-Agent header, from back-end servers only. Mindbody says keys cannot be safely stored on mobile devices or websites."
      },
      {
        "name": "Subscribe to webhooks and verify signatures",
        "text": "Create a subscription for the events you need with a POST, activate it with a PATCH, and accept both POST and HEAD requests over TLS 1.2 or higher. Check every delivery's X-Mindbody-Signature against an HMAC-SHA-256 of the body."
      },
      {
        "name": "Queue, deduplicate and re-sync",
        "text": "Respond with a 2xx within 10 seconds, process events idempotently because they can repeat or arrive out of order, and re-sync cached data through the Public API every 24 hours as Mindbody recommends."
      }
    ],
    "sources": [
      {
        "url": "https://developers.mindbodyonline.com/WebhooksDocumentation",
        "checked": "2026-10-17",
        "note": "Getting started (developer account, go-live request, business activation), API-Key and User-Agent headers, server-side requests, signature verification, webhook URL requirements, retries, rate limit kinds, re-sync advice, Transaction-Key, base URL and the event reference."
      },
      {
        "url": "https://developers.mindbodyonline.com/resources/faqs",
        "checked": "2026-10-17",
        "note": "What the API does, activation link or code, card-processing requirements, and what the API cannot do yet."
      },
      {
        "url": "https://developers.mindbodyonline.com/Resources/Endpoints",
        "checked": "2026-10-17",
        "note": "Appointment, Class, Client, Sale, Site and Staff data elements."
      },
      {
        "url": "https://developers.mindbodyonline.com/PublicDocumentation/GettingStarted",
        "checked": "2026-10-17",
        "note": "Accounts created on or after February 19, 2020 can only access V6.0 of the Public API."
      },
      {
        "url": "https://developers.mindbodyonline.com/Resources/DeveloperAgreement",
        "checked": "2026-10-17",
        "note": "API Terms of Use (last updated September 30, 2023): call limits, prohibited uses including the 48-hour caching limit, termination."
      },
      {
        "url": "https://www.mindbodyonline.com/company/legal/security-policy",
        "checked": "2026-10-17",
        "note": "API credential handling rules."
      },
      {
        "url": "https://developers.mindbodyonline.com/Resources/ApiReleaseNotes",
        "checked": "2026-10-17",
        "note": "May to July 2026 changes: AddAppointment, Apple Pay, Pick a Spot events, class cancellation permissions; OAuth consumer identity token and business mode references."
      }
    ]
  },
  {
    "slug": "teamup-api",
    "primaryQuery": "how to integrate the TeamUp API",
    "h1": "How to Integrate the TeamUp API (2026)",
    "metaTitle": "TeamUp API Integration Guide (2026): OAuth and M2M Tokens",
    "metaDescription": "Integrate the TeamUp API v2: create an API Application, pick OAuth, an M2M token or Direct Authentication, and stay under 250 requests a minute per caller.",
    "updated": "2026-10-17",
    "answer": "TeamUp's API is a single REST API at goteamup.com/api/v2, and access starts inside the business: a staff member with the super admin permission creates an API Application in the TeamUp dashboard, with no extra fee for API access and no paid plan required, since free trial accounts can create Applications too. Use OAuth when your app acts for a customer or staff member, an M2M token from the business dashboard for server-to-server work, and Direct Authentication only if TeamUp approves your use case; TeamUp does not support static API keys or the client_credentials grant. Unless an endpoint says otherwise, each caller gets 250 requests per minute, and there is no separate sandbox, so TeamUp suggests testing against a free trial business.",
    "body": "TeamUp sells management software for fitness studios, boxes and gyms, and publishes one REST API for the business data in it. This guide is written from TeamUp's developer documentation at docs.goteamup.com as it stood on October 17, 2026: the introduction, getting-started guide, authentication and errors pages, rate limits, FAQ and API Terms of Use.\n\nStill choosing a platform? Our [gym and studio management software API comparison](/fitness-apis/gym-management-software-apis) puts TeamUp next to Mindbody, Mariana Tek, Wodify and ABC Glofox.\n\n## What the API is\n\nTeamUp's introduction calls it \"a full-featured API to interact with your TeamUp business\" that can \"power custom websites or apps for your business, or allow automations for your business\". It is organized around REST, uses resource-oriented URLs, accepts and returns JSON, and uses standard HTTP response codes. Every endpoint is relative to one base URL:\n\n```text\nhttps://goteamup.com/api/v2\n```\n\nThe FAQ adds two warnings worth pinning to your config file. There is no `api.goteamup.com` subdomain, and URLs built on it \"have never existed\". And v2 replaced the older pair of APIs: TeamUp moved \"from two parallel APIs (Customer vs Business) to a single unified API\", where what you can see and do depends on who you are authenticated as, not which URL you call.\n\nThe FAQ also says the v2 API is the same API TeamUp's own web and mobile apps use, so external developers get the same functionality.\n\n## Access: the business creates an Application\n\nThe first step is to create an API Application, which TeamUp describes as representing the system you're integrating: a custom website, an app or a back-office automation. The Application sets limits on what the integration may do, can generate access tokens for your users, and leaves a reporting trail, because the business dashboard shows which registrations and other actions your Application performed.\n\nWho can do that, per TeamUp's FAQ:\n\n- **Staff with the super admin permission.** Applications are created and managed by staff members with the super admin permission at the business, typically the owner, directly in the business dashboard.\n- **No fee, no paid plan.** There is no extra fee for API access, and free trial accounts can create API Applications too.\n- **No sandbox.** There is no separate sandbox environment. TeamUp's advice is to sign up for a free trial and use it as a test business.\n\nIn our reading, that makes TeamUp the most open model among the studio platforms we checked: a business can switch the API on for itself, the same day, without a partner application. Our recommendation if you are an outside developer building for a TeamUp business: ask its super admin to create the Application, and agree up front which credential type you will use.\n\n## Authentication: three methods, three kinds of credential\n\nTeamUp supports three ways to authenticate, and it is emphatic that their credentials are not interchangeable:\n\n| Method | Acts as | Use it for | What you send |\n|---|---|---|---|\n| OAuth (recommended) | An end user, such as a trainer or a customer | Apps and websites where people log in | A short-lived OAuth access token, a JWT |\n| M2M token | The business itself | Server-to-server and background integrations | An opaque token created in the business dashboard |\n| Direct Authentication | An end user, through your own login screen | Fully branded logins | An access token from the Password Login endpoint, after TeamUp approves your use case |\n\nEvery authenticated request carries its credential in the HTTP `Authorization` header with the `Bearer` prefix:\n\n```bash\ncurl \"https://goteamup.com/api/v2/events?page_size=5\" \\\n  -H \"Authorization: Bearer YOUR_M2M_TOKEN\"\n```\n\nPoints from TeamUp's authentication page that save debugging time:\n\n- **No static API keys.** TeamUp does not support the OAuth `client_credentials` grant or static API keys; its token endpoint only accepts `grant_type=authorization_code`. If you want an \"API key\" for server-to-server access, an M2M token is the supported equivalent.\n- **The client secret never goes in the header.** The client ID and secret you see when you create the Application are only used as parameters in the OAuth flow. TeamUp says sending the wrong credential is \"the most common integration mistake we see\".\n- **Two different 401s.** A missing or malformed `Bearer` prefix makes the API treat the request as unauthenticated, which surfaces as `authentication_failed` (\"Incorrect authentication credentials.\"). A message that the token is expired or invalid usually means a client secret was pasted where a token belongs, or the token was revoked or expired.\n- **Direct Authentication is gated.** Because your app would handle user passwords, TeamUp only enables it after reviewing your use case, and then issues a secondary secret for the Password Login endpoint.\n\n### Request mode and provider headers\n\nWith an OAuth token, what your integration can do depends on the authenticated user's role and permissions. An M2M token always acts in provider (staff) mode with admin permissions. Two headers resolve ambiguity:\n\n- `TeamUp-Request-Mode` (`provider` or `customer`) is only needed when an OAuth identity is both a customer and a staff member.\n- `TeamUp-Provider-ID` names the business a request acts on when your credentials reach more than one, as with franchises and multi-location businesses.\n\nYour provider ID is the number at the start of the business's Customer Site URL. You can also call `GET /auth/application`, whose `scoped_providers` field lists the provider IDs your credentials can access.\n\n## Rate limits and errors\n\nUnless an endpoint says otherwise, TeamUp allows **250 requests per minute per caller**, where the caller is the authenticated user, or the IP address for unauthenticated endpoints. Exceed it and you get HTTP 429. TeamUp recommends retrying with exponential backoff and using the `expand` parameter to fetch related data in one request rather than several.\n\nErrors use conventional status codes and a JSON body with a `code`, a `message`, a `type` and, for validation problems, per-field `field_errors`. The `code` string is the one to branch on in your handler.\n\n## Webhooks\n\nTeamUp's getting-started guide lists receiving event notifications with webhooks as a next step, and its authentication page names \"a webhook processor that receives TeamUp event notifications\" as a typical use for an M2M token. The webhook pages themselves were not among the pages we read, so check event names and delivery behavior in TeamUp's webhooks guide before you build on them.\n\n## API terms in brief\n\nTeamUp's API Terms of Use were last updated July 11, 2025. They let TeamUp limit API calls in any period and, if you exceed the limits, charge fees or end your access. They also bar sharing access with competitors, using data for unauthorized purposes and publishing metrics about the API, and let either side end the arrangement, TeamUp at any time and you with 90 days' notice. This is general information, not legal advice.\n\nFor the patterns this API leans on, see [how OAuth works for health and fitness data](/learn/what-is-oauth-for-health-data) and [webhooks versus polling](/learn/webhooks-vs-polling-for-fitness-data). The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Does TeamUp give out static API keys?",
        "a": "No. TeamUp's authentication page says it does not support the OAuth client_credentials grant or static API keys, and its token endpoint only accepts the authorization_code grant. For server-to-server access, the supported equivalent of an API key is a machine-to-machine (M2M) token, which the business creates in its dashboard and which always acts in provider mode with admin permissions."
      },
      {
        "q": "What is the TeamUp API rate limit?",
        "a": "Unless an endpoint's description says otherwise, TeamUp allows 250 requests per minute for a caller, where the caller is the authenticated user or, for unauthenticated endpoints, the IP address. Over the limit you get HTTP 429. TeamUp recommends retrying on an exponential backoff schedule and using the expand parameter to fetch related data in fewer requests."
      },
      {
        "q": "Is there a TeamUp API sandbox for testing?",
        "a": "No. TeamUp's FAQ says there is no separate sandbox environment. Instead, sign up for a free trial account at goteamup.com and use it as a test business; trial accounts can create API Applications and use the API like any other account."
      },
      {
        "q": "Who can create a TeamUp API Application, and does it cost anything?",
        "a": "Staff members with the super admin permission at the business, typically the owner, create and manage API Applications in the business dashboard. TeamUp's FAQ says there is no extra fee for API access and no paid subscription is required, because free trial accounts can create Applications too."
      },
      {
        "q": "How do I find a business's TeamUp provider ID?",
        "a": "It is the number at the start of the business's Customer Site URL; for a site at goteamup.com/p/12345-your-business-name, the provider ID is 12345. You can also call GET /auth/application, whose scoped_providers field lists the provider IDs your credentials can access. Send it in the TeamUp-Provider-ID header when your credentials reach more than one business."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/gym-management-software-apis",
        "label": "Gym and studio management software APIs"
      },
      {
        "href": "/learn/what-is-oauth-for-health-data",
        "label": "What is OAuth for health data?"
      },
      {
        "href": "/learn/webhooks-vs-polling-for-fitness-data",
        "label": "Webhooks vs polling"
      },
      {
        "href": "/integrate/mindbody-api",
        "label": "Integrate the Mindbody API"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We follow the developer docs of the studio platforms your customers run, TeamUp included. Subscribe to hear when access rules, limits or terms change."
    },
    "steps": [
      {
        "name": "Create an API Application",
        "text": "A staff member with the super admin permission creates the Application in the TeamUp business dashboard. It sets what the integration may do, generates tokens and leaves a reporting trail in the dashboard."
      },
      {
        "name": "Pick the credential type",
        "text": "Use OAuth when your app acts for a logged-in customer or staff member, an M2M token from the dashboard for server-to-server work, and Direct Authentication only after TeamUp approves your use case."
      },
      {
        "name": "Find the provider ID",
        "text": "Read it from the start of the business's Customer Site URL, or call GET /auth/application and read scoped_providers. Send TeamUp-Provider-ID when your credentials can reach more than one business."
      },
      {
        "name": "Make a first request",
        "text": "Call GET /events on https://goteamup.com/api/v2 with your token in the Authorization header using the Bearer prefix, and expect a JSON list of event objects."
      },
      {
        "name": "Handle errors and the rate limit",
        "text": "Branch on the error code string in failed responses, and on HTTP 429 retry with exponential backoff. The default limit is 250 requests per minute per caller."
      },
      {
        "name": "Test on a free trial business",
        "text": "TeamUp has no separate sandbox, so create a free trial account, use it as a test business and build against it before you connect a live studio."
      }
    ],
    "sources": [
      {
        "url": "https://docs.goteamup.com/api-reference/introduction",
        "checked": "2026-10-17",
        "note": "What the API is for, REST and JSON, and what an API Application does."
      },
      {
        "url": "https://docs.goteamup.com/guides/getting-started",
        "checked": "2026-10-17",
        "note": "Base URL, creating an Application in the business dashboard, the three authentication methods, request headers and the webhooks next step."
      },
      {
        "url": "https://docs.goteamup.com/llms.txt",
        "checked": "2026-10-17",
        "note": "TeamUp's documentation export, read for the Authentication and Errors pages: OAuth, M2M tokens, Direct Authentication, credential types, 401 causes, request modes and the error format."
      },
      {
        "url": "https://docs.goteamup.com/api-reference/rate-limits",
        "checked": "2026-10-17",
        "note": "250 requests per minute per caller, 429 responses, backoff and the expand parameter."
      },
      {
        "url": "https://docs.goteamup.com/support/faq",
        "checked": "2026-10-17",
        "note": "No api.goteamup.com subdomain, provider ID, no sandbox, no API fee, who creates Applications, the unified v2 API."
      },
      {
        "url": "https://docs.goteamup.com/terms-of-service",
        "checked": "2026-10-17",
        "note": "API Terms of Use last updated July 11, 2025: call limits, restrictions, termination."
      },
      {
        "url": "https://goteamup.com/features/integrations-with-teamup",
        "checked": "2026-10-17",
        "note": "TeamUp's description of its software for fitness studios, boxes and gyms."
      }
    ]
  },
  {
    "slug": "mariana-tek-api",
    "primaryQuery": "how to integrate the Mariana Tek API",
    "h1": "How to Integrate the Mariana Tek API (2026)",
    "metaTitle": "Mariana Tek API Integration Guide (2026): OAuth, Review",
    "metaDescription": "Integrate Mariana Tek's Admin and Customer APIs: credentials from its Integrations team, OAuth with PKCE or API keys, sandbox tenants and technical review.",
    "updated": "2026-10-17",
    "answer": "Mariana Tek issues API credentials through its Integrations team rather than an open sign-up form: you contact integrations@marianatek.com to register an application, build against a sandbox tenant, and may need to pass a technical review that Mariana Tek says can take up to 1 to 3 weeks before you go live with a studio. Requests use bearer authentication, with either an OAuth 2.0 access token from the Authorization Code flow on the studio's own subdomain, adding PKCE for single-page and mobile apps, or an API key tied to your application's service account for server-side work. Webhooks are switched on by request, and production webhooks for a studio need the studio owner's approval by email.",
    "body": "Mariana Tek sells boutique fitness software to studios and franchises, and publishes a family of APIs for the developers who build around it. This guide is written from Mariana Tek's developer guides at guides.marianatek.com and its Customer API OpenAPI document as they stood on October 17, 2026.\n\nStill choosing a platform? Our [gym and studio management software API comparison](/fitness-apis/gym-management-software-apis) puts Mariana Tek next to Mindbody, TeamUp, Wodify and ABC Glofox.\n\n## Which Mariana Tek API you need\n\nMariana Tek's API overview lists seven surfaces:\n\n| API | What Mariana Tek says it is for |\n|---|---|\n| Admin API | Its primary API, the control arm for backend and business needs; tools for fitness business administration |\n| Customer API | Bespoke customer experiences, built from the customer's perspective |\n| Studio API | Endpoints to manage studio configurations |\n| MT Stripe API | A custom checkout flow on Mariana Tek's Stripe integration |\n| Documents API | Waivers, documents and contracts |\n| Pricing API | Pricing control |\n| Webhooks | Notifications about account events |\n\nIts \"ways to build\" page maps them to projects. Custom development for a studio's website uses the pre-built Web Integrations, the Customer API, or both. A studio app that helps owners run the business extends the Admin Application with the Admin API, and can use the Pricing Engine to change class prices dynamically. A customer app used by one or many studios combines the Customer API with Universal Authentication. A booking app that partners with many studios uses Bypass Bookings.\n\nThe Customer API is described in an OpenAPI document at `https://docs.marianatek.com/api/customer/v1/schema/`, which Mariana Tek introduces as giving you \"the power to build custom booking and buying experiences for fitness customers\". Generate a client from it rather than hand-writing request types.\n\n## Access: through Mariana Tek's Integrations team\n\nThere is no public sign-up form in the guides we read. To register an application and get OAuth credentials, the credentials guide says to contact `integrations@marianatek.com`, and the same address manages API keys. Mariana Tek's FAQ describes a Developer Portal for managing sandbox integrations, generating credentials and starting a technical review, but says it is in Beta and not uniformly available yet.\n\nYou build against a **sandbox**: a mock studio seeded with sample data, with its own tenant name, sandbox API and Web Integrations, almost identical to production. Every studio, live or sandbox, is addressed by its tenant name (the MT subdomain), and the sandbox API lives at `https://{tenant_name}.marianatek.com/api`. Sandbox tenant names often end in `.sandbox`. Integration partners get access to their sandbox Admin App during onboarding.\n\n## Credentials: OAuth or an API key\n\nMariana Tek accepts two kinds of credential, and both are sent with bearer authentication:\n\n- **OAuth 2.0 client credentials**, when requests should act for an end user: apps that need a studio owner or customer to log in, user-scoped views and profiles, or single sign-on. Single-page and mobile apps must use OAuth.\n- **An API key**, tied to a service account for your application, when you manipulate data for many users without any one user's login. You choose the service user's permissions when you register, and keys belong only on a server: Mariana Tek says never to commit them to version control or use them in client-side code.\n\n```bash\ncurl -H \"Authorization: Bearer YOUR_API_KEY_OR_ACCESS_TOKEN\" \\\n  \"https://YOUR_TENANT.marianatek.com/api/users/self\"\n```\n\n## The OAuth flow, on the studio's subdomain\n\nMariana Tek supports the Authorization Code flow for confidential clients, such as server-side web apps, and the Authorization Code flow with PKCE for public clients, such as single-page and mobile apps. Both run on the brand's own subdomain:\n\n```text\nGET  https://{SUBDOMAIN}.marianatek.com/o/authorize\n       ?response_type=code&client_id=...&redirect_uri=...&state=...\n       (PKCE adds code_challenge and code_challenge_method=S256)\n\nPOST https://{SUBDOMAIN}.marianatek.com/o/token/\n       grant_type=authorization_code, client_id, code, redirect_uri,\n       plus client_secret (Authorization Code) or code_verifier (PKCE)\n```\n\nDetails from the guide:\n\n- `state` is required, and Mariana Tek tells you to check it on the callback to prevent CSRF.\n- `prompt=True` forces a login even when the user already has a session. Without it, a user with an active session is sent straight back to your `redirect_uri`.\n- The example token response has `expires_in` of 604800 seconds, which is seven days, along with a `refresh_token`. Exchange it with `grant_type=refresh_token`; confidential clients also send their `client_secret`.\n- The redirect URL must match the registered one exactly. Mariana Tek's FAQ lists the usual causes of a mismatch error: no redirect URL registered yet, a typo, a trailing backslash on only one of the two URLs, URL encoding, or an old URL still registered.\n\nThe [OAuth explainer](/learn/what-is-oauth-for-health-data) covers why public clients need PKCE.\n\n## Webhooks are enabled on request\n\nMariana Tek can post events to your URL, for example when a customer creates an account, makes a reservation or checks in to class. There is no self-serve subscription in the guides: you ask Integrations, giving your HTTPS subscriber URL, the events you want and the environment. For a studio's production environment, Integrations needs the studio owner's approval by email.\n\nOne design rule matters if you plan to serve many studios. Mariana Tek calls an integration that can be switched on for a new studio from one bundle of credentials a one-click-install, and for webhooks that requires subscriber URLs that are identical across clients or differ only by the MT subdomain. Build the subdomain into your URL path from day one.\n\n## Technical review before going live\n\nBefore going live with a studio, you may have to pass a technical review; Mariana Tek says not every app needs one. The integration must be fully built and tested in the sandbox first. The submission covers how the integration works, the endpoints and webhooks it uses, credentialed access to a test environment, a screen recording, and the studios you work with or plan to. Mariana Tek says reviews \"can take up to 1-3 weeks to complete\".\n\nTwo consequences of approval to plan for:\n\n- **Scoped access.** Your account permissions are limited to the endpoints and use cases that were reviewed and approved, and using other endpoints you can reach is not permitted.\n- **Ongoing standing.** If a launched integration falls outside the approved guidelines, Mariana Tek discontinues its API access until you work through a consultation with your integration manager.\n\n## What we could not find\n\nNeither rate limits nor API pricing appear in the guides we read, and the Admin API reference was not among the pages we fetched. Ask Integrations about both before you size a production rollout.\n\nMariana Tek also lists its existing partners in a marketplace at partners.marianatek.com, including ClassPass, Wellhub and Spivi, which is a quick way to see which kinds of integrations it already approves. The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "How do I get Mariana Tek API credentials?",
        "a": "Contact Mariana Tek's Integrations team at integrations@marianatek.com to register your application and receive OAuth client credentials or an API key; its guides do not describe an open sign-up form. Mariana Tek's FAQ mentions a self-service Developer Portal for managing sandbox integrations and credentials, but says it is in Beta and not uniformly available yet."
      },
      {
        "q": "Should a Mariana Tek integration use OAuth or an API key?",
        "a": "Use OAuth when a studio owner or customer logs in, for user-scoped views and profiles, or for single sign-on; single-page and mobile apps must use OAuth. Use an API key, tied to your application's service account, for server-side data work across many users with no individual login. Both are sent as bearer tokens, and Mariana Tek says API keys must never be committed to version control or used client-side."
      },
      {
        "q": "How long does Mariana Tek's technical review take?",
        "a": "Mariana Tek says reviews can take up to 1-3 weeks to complete, and not every app needs one. Submit only a fully built integration tested in the sandbox, with a description, the endpoints and webhooks it uses, test-environment logins, a screen recording and the studios you work with. After approval, your permissions are scoped to the endpoints and use cases that were approved."
      },
      {
        "q": "How do I turn on Mariana Tek webhooks?",
        "a": "Ask Mariana Tek's Integrations team for a webhooks subscription, giving your HTTPS subscriber URL, the events you want and the environment, sandbox or production. For a studio's production environment, the studio owner must send approval to Integrations by email. To stay a one-click-install, keep subscriber URLs identical across studios or differing only by the MT subdomain."
      },
      {
        "q": "What is a Mariana Tek tenant name?",
        "a": "It is the MT subdomain that identifies a live studio or a sandbox, and you need it to call the API and set up Web Integrations; the sandbox API lives at your tenant name followed by .marianatek.com/api. Sandbox tenant names often end in .sandbox, and you receive yours once you are set up as a developer with Mariana Tek."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/gym-management-software-apis",
        "label": "Gym and studio management software APIs"
      },
      {
        "href": "/learn/what-is-oauth-for-health-data",
        "label": "What is OAuth for health data?"
      },
      {
        "href": "/architecture/webhook-ingestion",
        "label": "Ingesting webhooks reliably"
      },
      {
        "href": "/integrate/teamup-api",
        "label": "Integrate the TeamUp API"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We track how studio platforms like Mariana Tek grant API access, from credentials to technical review. Subscribe to hear when the process changes."
    },
    "steps": [
      {
        "name": "Contact Integrations",
        "text": "Email integrations@marianatek.com to register your application. Say whether you need OAuth client credentials, an API key with a service user's permissions, or both."
      },
      {
        "name": "Build against a sandbox tenant",
        "text": "Use the sandbox, a mock studio seeded with sample data, through its tenant name: the sandbox API is your tenant name followed by .marianatek.com/api."
      },
      {
        "name": "Run the OAuth flow on the studio's subdomain",
        "text": "Send users to /o/authorize on the brand's subdomain with response_type=code, client_id, redirect_uri and state, adding a code challenge for PKCE in single-page and mobile apps. Exchange the code at /o/token/ and refresh before the token expires."
      },
      {
        "name": "Call the APIs with bearer authentication",
        "text": "Send the OAuth access token or the API key in the Authorization header as a bearer token, from your server whenever an API key is involved."
      },
      {
        "name": "Request webhooks",
        "text": "Ask Integrations for a subscription with your HTTPS subscriber URL, the events and the environment. Production webhooks need the studio owner's approval by email."
      },
      {
        "name": "Submit for technical review",
        "text": "Once the integration is fully built and tested in the sandbox, submit the Technical Review Form. Mariana Tek says reviews can take up to 1-3 weeks, and approved access is scoped to the reviewed endpoints."
      }
    ],
    "sources": [
      {
        "url": "https://guides.marianatek.com/api-overview",
        "checked": "2026-10-17",
        "note": "The Admin, Customer, Studio, MT Stripe, Documents and Pricing APIs and Webhooks."
      },
      {
        "url": "https://guides.marianatek.com/ways-to-build",
        "checked": "2026-10-17",
        "note": "Which APIs fit studio websites, studio apps, customer apps and booking apps."
      },
      {
        "url": "https://docs.marianatek.com/api/customer/v1/schema/",
        "checked": "2026-10-17",
        "note": "Customer API OpenAPI document and its description."
      },
      {
        "url": "https://guides.marianatek.com/credentials",
        "checked": "2026-10-17",
        "note": "OAuth versus API keys, registering through Integrations, bearer authentication, key handling."
      },
      {
        "url": "https://guides.marianatek.com/auth",
        "checked": "2026-10-17",
        "note": "Authorization Code and PKCE flows, parameters, token response and refresh tokens."
      },
      {
        "url": "https://guides.marianatek.com/faqs",
        "checked": "2026-10-17",
        "note": "Sandbox, Developer Portal (Beta), tenant name, one-click-install, credential choice, redirect mismatch errors, webhook setup."
      },
      {
        "url": "https://guides.marianatek.com/webhooks",
        "checked": "2026-10-17",
        "note": "What webhooks deliver and that they start through Integrations."
      },
      {
        "url": "https://guides.marianatek.com/integration-review",
        "checked": "2026-10-17",
        "note": "Technical review requirements, 1-3 week timeframe, scoped permissions and loss of access."
      },
      {
        "url": "https://partners.marianatek.com/",
        "checked": "2026-10-17",
        "note": "Partner marketplace listings including ClassPass, Wellhub and Spivi."
      },
      {
        "url": "https://www.marianatek.com/",
        "checked": "2026-10-17",
        "note": "Mariana Tek's description of its boutique fitness software."
      }
    ]
  },
  {
    "slug": "wodify-api",
    "primaryQuery": "how to integrate the Wodify API",
    "h1": "How to Integrate the Wodify API (2026)",
    "metaTitle": "Wodify API Integration Guide (2026): x-api-key and Limits",
    "metaDescription": "Integrate the Wodify REST API: where gyms and partners get an API key, the x-api-key header, the base URL, endpoint groups, and 5 requests a second.",
    "updated": "2026-10-17",
    "answer": "Wodify's REST API lives at api.wodify.com/v1 and authenticates every request with an API key in an x-api-key header. A gym that uses Wodify's Workflows feature already has a key in Wodify Core under Digital Presence, Web Integrations, API Keys, while Wodify partners retrieve theirs from the Wodify Developer Portal. As of October 17, 2026, Wodify documents limits of 5 requests per second, bursts of 20 requests and 500,000 requests per month, answers HTTP 429 when you exceed them, and covers leads, clients, memberships, classes, appointments, communications, financials and workouts.",
    "body": "Wodify sells all-in-one gym management software, and its integrations page invites developers who are \"interested in building for studios\" to its API documentation at docs.wodify.com. This guide is written from that documentation as it stood on October 17, 2026: the getting-started, authentication and rate-limiting guides and the API reference.\n\nStill choosing a platform? Our [gym and studio management software API comparison](/fitness-apis/gym-management-software-apis) puts Wodify next to Mindbody, TeamUp, Mariana Tek and ABC Glofox.\n\n## What the API covers\n\nWodify describes \"a set of powerful APIs\" for its RESTful platform, organized by the business object each endpoint works on. Its getting-started guide lists the categories:\n\n| Category | What Wodify says you can do |\n|---|---|\n| Leads | Create, update, delete and convert leads to clients; search their appointment bookings and class reservations; manage groups, tags, sources and statuses |\n| Clients | Search, create, update, suspend, reinstate and deactivate clients; search bookings and reservations; manage roles, groups, tags and statuses |\n| Documents | Manage contract templates; get client and lead waiver information |\n| Communications | Send emails and SMS, and create tasks |\n| Financials | Manage discounts, tax rates, invoices and revenue categories |\n| Memberships | Memberships, including templates, billing, discounts, locations, programs, attendance types and hold reasons |\n| Customers and Locations | Employees and locations |\n| Programs and Classes | Search and retrieve programs and classes; get, search, create and delete class reservations and sign-ins for clients, leads and drop-ins |\n| Appointments | Appointments and bookings for clients and leads, and service information |\n| Workouts | Manage, create, edit and delete workouts |\n\nThe API reference also has a Progressions section (progressions, levels, criteria and client progressions) that the getting-started list does not mention.\n\nAll requests go to one base URL:\n\n```text\nhttps://api.wodify.com/v1\n```\n\nOne inconsistency to know about: the example request on Wodify's authentication page sends `Host: app-api.wodify.com`, while the getting-started guide gives the base URL above. We use the base URL from the getting-started guide; if a call fails, check which host your Wodify contact expects.\n\n## Access: where the API key comes from\n\nWodify authenticates every request with one API key, and its authentication guide describes two ways to get one:\n\n- **Wodify customers.** If the business uses the Wodify Workflows feature, it already has a key. It is in Wodify Core under Digital Presence, then Web Integrations, then API Keys: click EDIT and look for the key named \"Wodify API\". The API reference describes the same route, telling you to request a key through the Web Integrations screen if you don't have one.\n- **Wodify partners.** Partners retrieve their key from the Wodify Developer Portal, and Wodify support helps with access to the portal.\n\nIn our reading, a developer building for one gym works with that gym's key from Wodify Core, while a company building for many gyms goes through Wodify's partner route. The guides we read do not describe how to become a partner or whether there is a fee, so ask Wodify before you plan a multi-gym product.\n\n## Authentication: the x-api-key header\n\nSend the key in an `x-api-key` header on every request. Wodify's server checks that the key is valid and authorized for the resource, processes the request if it is, and otherwise returns an authentication or authorization error.\n\n```bash\ncurl \"https://api.wodify.com/v1/clients\" \\\n  -H \"x-api-key: YOUR_WODIFY_API_KEY\" \\\n  -H \"Accept: application/json\"\n```\n\nWodify's guides do not say where to keep the key. Our recommendation: treat it like any server credential, keep it out of browsers and mobile apps, and call Wodify from your own back end.\n\n## Rate limits\n\nWodify publishes three limits, and they apply together:\n\n| Limit | Value | What it means |\n|---|---|---|\n| Rate | 5 requests per second | Sustained throughput |\n| Burst | 20 requests | A short spike allowed above the rate before throttling |\n| Quota | 500,000 requests per month | The total for a calendar month |\n\nOver the limit, the API returns HTTP 429 Too Many Requests, and Wodify recommends exponential backoff. Its best practices are to batch requests rather than loop through single calls, to cache data you reference often, and to keep the monthly count in mind for high-volume automations.\n\nThe monthly quota is the one that bites a sync job. At a steady 5 requests per second, a job would use 500,000 requests in under 28 hours (500,000 divided by 5 is 100,000 seconds), so in our experience the design question is not how fast you can poll but how little.\n\n## Webhooks\n\nNeither Wodify's guide navigation (getting started, authentication, rate limiting and search) nor the section list of its API reference mentions webhooks, so we cannot say whether Wodify pushes events to your server. Wodify does integrate with Zapier, which it says connects an account to hundreds of other apps and platforms. For a custom integration, plan on polling within the quota above until Wodify documents a push mechanism. [Webhooks versus polling](/learn/webhooks-vs-polling-for-fitness-data) covers the trade-off, and [caching fitness API responses](/architecture/caching-fitness-api-responses) covers how to poll less.\n\n## Integrations that need no code\n\nBefore writing code, check whether a built-in integration already does the job. Wodify's integrations page lists QuickBooks, Slack, Facebook Leads, Google Analytics and MyZone among the tools it connects to, and says integrations with platforms like Slack and Facebook Leads come at no additional cost.\n\nThe rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Where do I find my Wodify API key?",
        "a": "If the gym uses Wodify's Workflows feature, the key already exists: in Wodify Core go to Digital Presence, then Web Integrations, then API Keys, click EDIT and find the key named Wodify API. Wodify partners retrieve their key from the Wodify Developer Portal instead. If you cannot locate a key, Wodify's guide says to contact Wodify support."
      },
      {
        "q": "What are the Wodify API rate limits?",
        "a": "As of October 17, 2026, Wodify documents a rate of 5 requests per second, a burst of 20 requests above that rate before throttling, and a quota of 500,000 requests per calendar month. Exceeding them returns HTTP 429 Too Many Requests, and Wodify recommends exponential backoff, batching requests and caching data you reference often."
      },
      {
        "q": "Does the Wodify API support webhooks?",
        "a": "As of October 17, 2026, neither Wodify's guide navigation nor the section list of its API reference mentions webhooks, so we could not confirm a push mechanism. Wodify does integrate with Zapier, and for a custom integration you should plan on polling within the 500,000-requests-a-month quota until Wodify documents one."
      },
      {
        "q": "What base URL and header does the Wodify API use?",
        "a": "Wodify's getting-started guide gives https://api.wodify.com/v1 as the base URL for all requests, and every request carries the API key in an x-api-key header. Note that the example on Wodify's authentication page sends Host: app-api.wodify.com, so if a call fails, confirm the host with Wodify."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/gym-management-software-apis",
        "label": "Gym and studio management software APIs"
      },
      {
        "href": "/learn/webhooks-vs-polling-for-fitness-data",
        "label": "Webhooks vs polling"
      },
      {
        "href": "/architecture/caching-fitness-api-responses",
        "label": "Caching fitness API responses"
      },
      {
        "href": "/integrate/teamup-api",
        "label": "Integrate the TeamUp API"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "Gym platforms change their API limits quietly. Subscribe and we will tell you when Wodify or the other studio platforms we track change theirs."
    },
    "steps": [
      {
        "name": "Get an API key",
        "text": "For a single gym, find the key in Wodify Core under Digital Presence, Web Integrations, API Keys (the one named Wodify API). Partners retrieve theirs from the Wodify Developer Portal."
      },
      {
        "name": "Keep the key on your server",
        "text": "Store the key in server-side configuration and call Wodify from your own back end, so it never reaches a browser or a mobile app."
      },
      {
        "name": "Call the base URL with x-api-key",
        "text": "Send requests to https://api.wodify.com/v1 with the key in the x-api-key header, for example GET /clients to list clients."
      },
      {
        "name": "Stay under the rate and burst limits",
        "text": "Keep sustained traffic under 5 requests per second with bursts of no more than 20, and batch work instead of looping through single calls."
      },
      {
        "name": "Budget the monthly quota",
        "text": "Count requests against the 500,000-per-month quota, cache data you read often, and poll on a schedule rather than continuously."
      },
      {
        "name": "Back off on 429",
        "text": "When the API returns HTTP 429, wait and retry with exponential backoff, increasing the wait on each retry."
      }
    ],
    "sources": [
      {
        "url": "https://docs.wodify.com/docs/getting-started",
        "checked": "2026-10-17",
        "note": "Overview, x-api-key authentication, base URL and API categories."
      },
      {
        "url": "https://docs.wodify.com/docs/authentication",
        "checked": "2026-10-17",
        "note": "Where customers and partners get API keys, the header, and the example request host."
      },
      {
        "url": "https://docs.wodify.com/docs/rate-limiting",
        "checked": "2026-10-17",
        "note": "Rate, burst and monthly quota, 429 handling and best practices."
      },
      {
        "url": "https://docs.wodify.com/reference/get_dropin",
        "checked": "2026-10-17",
        "note": "API reference sections including Progressions, and the Web Integrations note on the x-api-key header."
      },
      {
        "url": "https://www.wodify.com/integrations",
        "checked": "2026-10-17",
        "note": "Built-in integrations, no-cost integrations, Zapier, and the link to the API documentation."
      },
      {
        "url": "https://www.wodify.com/",
        "checked": "2026-10-17",
        "note": "Wodify's description of its all-in-one gym management software."
      }
    ]
  },
  {
    "slug": "glofox-api",
    "primaryQuery": "how to integrate the Glofox API",
    "h1": "How to Integrate the ABC Glofox API (2026)",
    "metaTitle": "Glofox API Integration Guide (2026): Keys, Branch ID",
    "metaDescription": "Integrate the ABC Glofox API: the x-api-key, x-glofox-api-token and branch-ID headers, server-side proxying, branches and namespaces, errors, webhooks.",
    "updated": "2026-10-17",
    "answer": "ABC Glofox publishes a REST API reference, version 2.3.0 on October 17, 2026, for managing members, memberships, credits, classes, bookings and payments, with JSON responses. Every call carries three headers, x-glofox-branch-id, x-api-key and x-glofox-api-token, and Glofox says to proxy them through a secure backend and never expose them in client-side applications. Plan for two quirks: some older endpoints return HTTP 200 with a success field set to false for a bad request, and the API answers 429 when you exceed its rate limit. Access is requested through Glofox's API portal, whose process we could not read.",
    "body": "ABC Glofox is the studio and gym platform in ABC Fitness's product family; ABC's own site lists it next to ABC Ignite, ABC Trainerize and ABC Evo. Glofox publishes an API reference on its API portal, and this guide is written from that reference (version 2.3.0) as it stood on October 17, 2026.\n\n> **Sourcing note.** The reference is a long static page; we read its navigation and its introductory sections (introduction, authentication, errors, branches and the first endpoints). The rest of the portal, including its \"Request access\" section, is a JavaScript application that returned no readable text to our fetch. How access is granted, and any rate-limit numbers or fees, are therefore not covered here.\n\nStill choosing a platform? Our [gym and studio management software API comparison](/fitness-apis/gym-management-software-apis) puts Glofox next to Mindbody, TeamUp, Mariana Tek and Wodify.\n\n## What the API covers\n\nGlofox introduces its API as \"a REST API that lets integrations manage members, memberships, credits, classes, bookings, and payments\", with JSON responses. The reference groups endpoints like this:\n\n| Group | Examples from the reference |\n|---|---|\n| Branches | Retrieve the locations allowed to your integration; get a branch |\n| Users | Create, update and get leads and clients; search members by email or phone; get staff; register a user |\n| Leads | Contact sources and marketing sources |\n| Memberships and credits | List memberships, purchase a membership, purchase with flexible payment, cancel a membership; a user's credit packs |\n| Classes and bookings | Classes, events and programs by branch; create, cancel and list bookings; mark a booking as attended; class availability and price |\n| Payments and cart | Payment methods for a branch, payment links for invoices, overdue subscription invoices; create, update and check out a cart |\n| Other | Access, reports, electronic agreements, price calculators, appointment availability, facilities, courses, products and push notifications |\n\nThe reference page offers a download of the underlying OpenAPI specification, which is the quickest way to generate a typed client.\n\n## Authentication: three headers on every call\n\nEvery request carries three headers:\n\n| Header | What it is |\n|---|---|\n| `x-glofox-branch-id` | The branch (studio or location) the request is for |\n| `x-api-key` | Your integration's API key |\n| `x-glofox-api-token` | Your integration's API token |\n\nGlofox's instruction is blunt: \"Always proxy API key and token requests through a secure backend. Never expose credentials in client-side applications.\" So a member-facing app calls your server, and your server calls Glofox.\n\nRequests go to the production server shown throughout the reference, `https://gf-api.aws.glofox.com/prod`, followed by a versioned path such as `/2.0/branches/{id}` or `/v3.0/locations/retrieve`:\n\n```bash\ncurl \"https://gf-api.aws.glofox.com/prod/2.0/branches/YOUR_BRANCH_ID\" \\\n  -H \"x-glofox-branch-id: YOUR_BRANCH_ID\" \\\n  -H \"x-api-key: YOUR_API_KEY\" \\\n  -H \"x-glofox-api-token: YOUR_API_TOKEN\"\n```\n\n## Branches and namespaces\n\nTwo words carry most of the data model:\n\n- **Branch.** Glofox defines a branch, also called a studio or location, as a physical location with its own set of members and staff.\n- **Namespace.** A group of branches assigned to your integration. `POST /v3.0/locations/retrieve` returns the branches in your integration's allowed namespaces, all of them if you pass no filter, and Glofox says it filters access by the integrator's configured permissions.\n\nMember search works across a whole namespace: the namespace is taken from the branch in your `x-glofox-branch-id` header, and the same email or phone can return more than one member when it exists at several locations. Phone search is an exact match on the member's normalized E.164 number and excludes staff. Plan your identity mapping for that before you merge members across locations.\n\n## Errors, including the 200 that is really a 400\n\nThe reference lists the status codes to handle: 400 for invalid input, 401 when the request is not authenticated, 403 when the client lacks permission, 404 for a missing resource, 429 when \"the API blocks the request when you exceed the rate limit\", and 500 for server-side problems. Error bodies carry a human-readable `message` and a `message_code` meant for client-side handling.\n\nOne quirk to code for: Glofox says older endpoints \"sometimes return a 200 status code with a success field set to false\", which indicates a bad request, and recommends middleware that maps those responses to 400. In our experience this is the bug that slips through testing, because the happy path never sees it. Check `success` on every response from the older `/2.0` endpoints, not just the status code.\n\nThe introductory sections we read do not state the rate limit itself. Treat 429 as the signal and retry with backoff.\n\n## Webhooks\n\nThe reference's navigation lists webhook events for access, bookings, course bookings, electronic agreements, events, invoices, members, memberships, services and push notifications. We did not read those sections in full, so check the reference and the portal for how to register an endpoint and what each payload carries. For processing webhooks safely, see [ingesting webhooks reliably](/architecture/webhook-ingestion).\n\n## Access and the wider ABC ecosystem\n\nThe portal's navigation has a \"Request access\" entry, but the process behind it sits in the part of the portal we could not read. If you plan to sell an integration across ABC's product family, ABC Fitness also runs a partner program for app partners and solution providers. Its requirements and tiers are summarized in our [gym and studio software API comparison](/fitness-apis/gym-management-software-apis).\n\nThe rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Which headers does every Glofox API call need?",
        "a": "Three: x-glofox-branch-id for the branch (studio or location) the request is for, x-api-key for your integration's API key, and x-glofox-api-token for its API token. Glofox's reference says to always proxy the key and token through a secure backend and never expose them in client-side applications."
      },
      {
        "q": "Why does the Glofox API return 200 when a request failed?",
        "a": "Glofox's reference says older endpoints sometimes return a 200 status code with a success field set to false, which indicates a bad request, and recommends middleware that maps those responses to 400. Check the success field on responses from the older endpoints rather than relying on the status code alone."
      },
      {
        "q": "What are branches and namespaces in the Glofox API?",
        "a": "A branch, also called a studio or location, is a physical location with its own members and staff. Branches are grouped into namespaces, and POST /v3.0/locations/retrieve returns the branches in your integration's allowed namespaces. Member search runs across the whole namespace of the branch in your x-glofox-branch-id header, so one email or phone can match members at several locations."
      },
      {
        "q": "Does the Glofox API send webhooks?",
        "a": "Yes. The navigation of Glofox's API reference lists webhook events for access, bookings, course bookings, electronic agreements, events, invoices, members, memberships, services and push notifications. We did not read those sections in full, so check the reference and Glofox's API portal for how to register an endpoint."
      }
    ],
    "related": [
      {
        "href": "/fitness-apis/gym-management-software-apis",
        "label": "Gym and studio management software APIs"
      },
      {
        "href": "/architecture/webhook-ingestion",
        "label": "Ingesting webhooks reliably"
      },
      {
        "href": "/architecture/identity-and-account-linking",
        "label": "Identity and account linking"
      },
      {
        "href": "/integrate/mindbody-api",
        "label": "Integrate the Mindbody API"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We follow the API references of the studio platforms your customers use, ABC Glofox included. Subscribe to hear when access, limits or versions change."
    },
    "steps": [
      {
        "name": "Request access",
        "text": "Start from the Request access entry in Glofox's API portal. The process behind it was not readable to our fetch, so confirm with Glofox how your integration's API key and API token are issued."
      },
      {
        "name": "Keep credentials on a backend",
        "text": "Store the key and token server-side and proxy every call through your backend, as Glofox's reference instructs; never ship them in a browser or mobile app."
      },
      {
        "name": "List your allowed branches",
        "text": "Call POST /v3.0/locations/retrieve on https://gf-api.aws.glofox.com/prod to get the branches in your integration's allowed namespaces."
      },
      {
        "name": "Send the three headers",
        "text": "Add x-glofox-branch-id, x-api-key and x-glofox-api-token to every request, then call the endpoints you need, such as bookings or memberships."
      },
      {
        "name": "Normalize errors",
        "text": "Handle 400, 401, 403, 404, 429 and 500, read message and message_code from error bodies, and map 200 responses with success set to false on older endpoints to 400."
      },
      {
        "name": "Wire up webhooks",
        "text": "Check the reference's webhook sections for the events you need, such as bookings, members and memberships, and register your endpoint through the API portal."
      }
    ],
    "sources": [
      {
        "url": "https://api-portal.glofox.com/api-portal/glofox/api/openapi-reference.html",
        "checked": "2026-10-17",
        "note": "Glofox API Reference 2.3.0: introduction, authentication headers, error handling, error structure, branches, namespaces, member search, production server, endpoint groups, webhook event list, Request access entry."
      },
      {
        "url": "https://abcfitness.com/",
        "checked": "2026-10-17",
        "note": "ABC Fitness lists ABC Ignite, ABC Trainerize, ABC Glofox and ABC Evo."
      },
      {
        "url": "https://abcfitness.com/partners/",
        "checked": "2026-10-17",
        "note": "ABC Fitness partner program for app partners and solution providers."
      }
    ]
  },
  {
    "slug": "withings-api",
    "primaryQuery": "withings api",
    "h1": "How to Integrate the Withings API (2026)",
    "metaTitle": "Withings API (2026): OAuth, Notifications and Plans",
    "metaDescription": "Integrate the Withings Public API: OAuth with signed requests, 3-hour tokens, getmeas and lastupdate sync, notifications, limits and the Withings+ rule.",
    "updated": "2026-10-17",
    "answer": "The Withings Public API gives your app the measurements from a user's Withings scales, blood pressure monitors, sleep sensors and trackers after they authorize you over OAuth 2.0. Setup is free with no prerequisites: create an application, send users to Withings' authorization URL, exchange the code within 30 seconds using a signed requesttoken call, then fetch data with getmeas and the other services, ideally after Withings notifies your callback URL. Access tokens last 3 hours, the standard API allows 120 requests per minute per application, and Withings announced that from October 12, 2026 newly created accounts would need Withings+ to share data with a free-plan app, a notice that was gone from its developer home page by October 22, 2026.",
    "body": "Withings makes scales, blood pressure monitors, sleep sensors, trackers and thermometers, and its cloud API returns what those devices measure. This guide covers the **Public API**, which Withings describes as \"designed for individuals and partners without a formal contract\", from Withings' developer site as read on October 17, 2026. Withings' other solutions (Cellular, Withings RPM and Logistics Services) are out of scope here.\n\nOne change dominates 2026 planning. Withings' developer home page, as the Internet Archive captured it on October 16, 2026, said Withings+ becomes required on the Start for Free API plan from October 12, 2026: Withings accounts created after that date need a membership to share health data with a free-plan app, including apps that are already live. Accounts created before that date are unaffected, and Withings said Enterprise lifts the requirement for specific use cases. That notice was no longer on the home page when we read it on October 22, 2026, and Withings' plans page did not render for us, so we could not confirm whether the requirement still stands; ask Withings before you plan around it. If you are still choosing a provider, start with [wearable data APIs](/fitness-apis/wearable-data-apis).\n\n## Access and approval\n\n| Question | What Withings' pages say |\n|---|---|\n| What does it cost to start? | \"There are no prerequisites, and free access is provided\" on the EU Medical Cloud |\n| Is there a review? | None is described for the Public API: you create an application and get a `client_id` and `client_secret` |\n| What do users need? | A Withings device set up in the Withings app; Withings announced that from October 12, 2026 new accounts need Withings+ to share with a free-plan app (see above) |\n| Any limits on a new app? | An app whose callback URL misses Withings' requirements stays in restricted mode, limited to 10 linked users |\n| Where does data live? | The EU Medical Cloud in France by default; a US Medical Cloud for HIPAA-covered entities, by request |\n\nWithings recommends creating the developer account with a shared professional email rather than a personal Withings account. Its developer dashboard has teams with three roles: Admin, Developer and Support Agent, and only an Admin can manage production applications. The cloud is fixed for good: Withings says your cloud is set when your access contract is created and cannot be switched afterwards.\n\n## Auth and scopes\n\nWithings uses OAuth 2.0 with the authorization-code flow. Send the user to its authorization URL:\n\n```http\nGET https://account.withings.com/oauth2_user/authorize2\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &scope=user.info,user.metrics,user.activity\n  &redirect_uri=https://yourapp.example.com/callback\n  &state=RANDOM_ANTI_CSRF_STRING\n```\n\nScopes are comma-separated:\n\n| Scope | What Withings says it allows |\n|---|---|\n| `user.activity` | Physical activity and sleep data; also required for notification management |\n| `user.metrics` | Health measurements, heart recordings, stethoscope data and goals; also required for notification management |\n| `user.info` | Account information, linked devices and goals, and device linking |\n| `user.sleepevents` | Notifications when sleep events happen: bed in, bed out, inflate done |\n\nTwo details are unusual. First, **the authorization code is only valid for 30 seconds**, so exchange it in the callback handler, not in a queue. Second, **Withings signs some requests**: you call `getnonce` on the signature service with an HMAC SHA-256 signature keyed by your client secret, then sign the token request with that nonce. The exchange itself is the `requesttoken` action on `https://wbsapi.withings.net/v2/oauth2`, sent with your `client_id`, `redirect_uri`, the `code`, `grant_type=authorization_code`, the nonce and the signature.\n\nToken lifetimes are short at the front and long at the back:\n\n| Token | Lifetime Withings documents |\n|---|---|\n| `access_token` | 3 hours |\n| `refresh_token` | 1 year |\n| The previous `refresh_token` | 8 hours after a new one is issued, or once the new access token is used |\n\nEvery refresh returns a new refresh token, and Withings warns that failing to store it can lose you access once the old one expires. For testing, add `mode=demo` to the authorization request to log in as Withings' demo user.\n\n## Data: measures, activity, sleep and heart\n\nWithings says that once a user authorizes your application, \"you will have access not only to new data but also to all historical health data collected by the devices\", so a new connection can backfill the user's history. Calls are `POST` requests to `https://wbsapi.withings.net` services with an `action` parameter:\n\n| Service and action | Returns |\n|---|---|\n| Measure `getmeas` | Measures by `meastype`, for example weight (1), fat ratio (6) and bone mass (88); blood pressure, SpO2, temperature, glucose and more |\n| Measure v2 `getactivity`, `getintradayactivity`, `getworkouts` | Daily activity, intraday activity and workouts |\n| Sleep v2 `get`, `getsummary` | Sleep data and nightly summaries |\n| Heart v2 `list`, `get` | ECG recordings |\n| User v2 `getdevice` | The user's linked devices |\n\n```bash\ncurl -s -X POST \"https://wbsapi.withings.net/measure\" \\\n  -H \"Authorization: Bearer USER_ACCESS_TOKEN\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"action=getmeas\" \\\n  -d \"meastypes=1,6,88\" \\\n  -d \"lastupdate=1760000000\"\n```\n\nUse `lastupdate` for ongoing sync: Withings says it returns everything created or modified since that timestamp, including updates you missed if a notification was lost. Withings' catalogue lists 96 biomarkers across 9 device families, and marks some as requiring the Advanced Biomarkers plan, so check the catalogue before you promise a metric.\n\n## Webhooks: data notifications\n\nWithings pushes notifications rather than data. Subscribe a callback URL to a category (`appli`) with the `subscribe` action on the notify service, using the user's access token. Categories include 1 (weight and body composition), 4 (blood pressure and heart rate), 16 (activity), 44 (sleep summary) and 54 (ECG); the notification carries `userid`, `appli` and a `startdate` and `enddate` window, and you fetch the data yourself.\n\nWithings' rules for the callback URL are strict:\n\n- HTTPS only, a domain name rather than an IP address or localhost, ports 80 or 443 only, and at most 255 characters.\n- It must answer HTTP `HEAD` with a 2xx, because Withings checks the URL before registering it.\n- A URL that misses these leaves the app in restricted mode, limited to 10 linked users, which Withings intends for development only.\n\nReliability is documented in detail. If your endpoint does not answer with a status below 400, Withings retries on a schedule of 10 seconds, 1 minute, 1 hour and 4 hours, two attempts per cycle and 10 in total. After 4 failed notifications in a row it sends a warning email for each, and after 20 days of unresolved failures it cancels the subscription. Missed notifications are not redelivered, so backfill with `lastupdate` once you are back. Typical delivery is under 2 minutes, with no real-time commitment on the standard plan.\n\nTo secure the endpoint, Withings publishes its notification IP ranges as DNS TXT records (`ipblock-notify.withings.net` for the EU cloud) and suggests adding a secret query parameter to the callback URL that you check on every request.\n\n## Rate limits\n\nWithings says the standard API enforces a limit of 120 requests per minute across your application, and that polling hits it quickly, which is why it points everyone to notifications. The Enterprise plan unlocks higher limits and dedicated support; Withings' plans page did not render for us, so this guide does not quote its prices.\n\n## What changed recently\n\n| When | Change (Withings' pages) |\n|---|---|\n| October 12, 2026 | Withings+ required on the Start for Free API plan for accounts created after that date, including for apps already live, per a home-page notice captured October 16, 2026 and gone by October 22, 2026 |\n| Standing policy | Major changes get one month's notice, up to three months for business-critical ones; emergency changes up to two weeks or none; normal changes without notice |\n\nWithings publishes breaking changes and deprecations on a developer updates portal and a mailing list, and adds the contact email of every developer application to that list automatically.\n\n## Gotchas and production notes\n\n- **The 30-second code.** Exchange the authorization code immediately; a slow callback fails silently from the user's point of view.\n- **Sign before you ask.** Token requests need a fresh nonce and an HMAC signature; every request needs a new nonce.\n- **Store the newest refresh token every time.** The previous one dies 8 hours after a new one is issued.\n- **Budget for Withings+.** Withings announced that users who create a Withings account after October 12, 2026 need a membership to share data with a free-plan app; confirm it still applies, since the notice had left the developer home page by October 22, 2026.\n- **Pick the cloud once.** EU or US is fixed when your access contract is created.\n- **Notifications are pointers.** Fetch the data after each notification, answer within a few seconds, and reconcile with `lastupdate` after any outage.\n\nThe `withings-api` Python package is reviewed at [withings-api](/libraries/withings-api). What the free plan and Withings' paid plans cost is on [Withings API pricing](/pricing/withings-api-pricing), and other routes to Withings data are on [Withings API alternatives](/alternatives/withings-api-alternatives). The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Is the Withings API free?",
        "a": "Getting started is. Withings' setup page says there are no prerequisites and free access is provided on its EU Medical Cloud. Withings also announced that accounts created after October 12, 2026 need a Withings+ membership to share data with an app on the Start for Free plan, with Enterprise lifting that requirement for specific use cases; that notice was no longer on its developer home page on October 22, 2026, so confirm it with Withings."
      },
      {
        "q": "How does Withings OAuth work?",
        "a": "Send the user to https://account.withings.com/oauth2_user/authorize2 with your client_id, scopes such as user.metrics and user.activity, a redirect_uri and a state value. The code that comes back is valid for only 30 seconds; exchange it with the requesttoken action, signed with HMAC SHA-256 and a fresh nonce from Withings' signature service."
      },
      {
        "q": "How long do Withings access tokens last?",
        "a": "Withings documents 3 hours for an access token and 1 year for a refresh token. Every refresh issues a new refresh token, and the previous one expires 8 hours later or as soon as the new access token is used, so store the newest pair every time or you can lose access."
      },
      {
        "q": "Does the Withings API have webhooks?",
        "a": "Yes, as data notifications. You subscribe an HTTPS callback URL per category, such as weight or sleep, and Withings POSTs the user ID, category and time window, typically within 2 minutes. It retries failed deliveries for about 5 hours, cancels a subscription after 20 days of failures, and never redelivers a missed notification."
      },
      {
        "q": "What is the Withings API rate limit?",
        "a": "Withings says the standard API enforces 120 requests per minute across your application, which is why it recommends notifications over polling. The Enterprise plan unlocks higher limits and dedicated support; Withings' plans page did not render when we read the site, so we do not quote its prices."
      }
    ],
    "related": [
      {
        "href": "/libraries/withings-api",
        "label": "withings-api Python library"
      },
      {
        "href": "/integrate/dexcom-api",
        "label": "Integrate the Dexcom API"
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
      "pitch": "We track device APIs as vendors change them, from Withings' Withings+ requirement to token lifetimes and notification rules, so your integration is not the last to know."
    },
    "steps": [
      {
        "name": "Create a Withings application",
        "text": "Create a developer account with a shared professional email, then create an application in the Withings developer dashboard to get a client_id and client_secret. Keep the secret on your server."
      },
      {
        "name": "Send the user to the authorization URL",
        "text": "Redirect the user to https://account.withings.com/oauth2_user/authorize2 with response_type=code, your client_id, the scopes you need, your redirect_uri and a random state. Use mode=demo to test with Withings' demo user."
      },
      {
        "name": "Exchange the code within 30 seconds",
        "text": "Get a fresh nonce from the signature service, sign the requesttoken call with HMAC SHA-256 and your client secret, and POST it to https://wbsapi.withings.net/v2/oauth2. Store the access token, refresh token and user ID."
      },
      {
        "name": "Subscribe to notifications",
        "text": "Subscribe an HTTPS callback URL on port 80 or 443 that answers HEAD requests to each category you need, such as appli=1 for weight or appli=44 for sleep, using the subscribe action on the notify service."
      },
      {
        "name": "Fetch data and keep it in sync",
        "text": "On each notification, refresh the token if it has expired and call the matching service, such as getmeas for weight. Use lastupdate with your last successful fetch time to catch anything a lost notification missed."
      }
    ],
    "sources": [
      {
        "url": "https://developer.withings.com/",
        "checked": "2026-10-17",
        "note": "Withings+ requirement from October 12, 2026, Public API scope, quickstart, EU and US clouds"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/developer-account/create-your-accesses-no-medical-cloud/",
        "checked": "2026-10-17",
        "note": "free access with no prerequisites, application credentials, team roles"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/oauth-web-flow/",
        "checked": "2026-10-17",
        "note": "access to historical data, 30-second code exchange"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/oauth-authorization-url/",
        "checked": "2026-10-17",
        "note": "authorization URL, state, scopes, demo user"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/sign-your-requests/",
        "checked": "2026-10-17",
        "note": "HMAC SHA-256 request signing with a nonce"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/access-and-refresh-tokens-no-recover/",
        "checked": "2026-10-17",
        "note": "token lifetimes and the requesttoken call"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-overview/",
        "checked": "2026-10-17",
        "note": "120 requests per minute, retries, escalation, delivery times, securing notifications"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-subscribe/",
        "checked": "2026-10-17",
        "note": "callback URL requirements and restricted mode"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-content/",
        "checked": "2026-10-17",
        "note": "notification categories and payload fields"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/fetch-data-example/",
        "checked": "2026-10-17",
        "note": "fetching after a notification, lastupdate"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/data-api/all-available-health-data/",
        "checked": "2026-10-17",
        "note": "biomarker catalogue and the Advanced Biomarkers plan"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/maintain-your-integration/understand-our-timeline-for-notice/",
        "checked": "2026-10-17",
        "note": "notice periods for changes"
      },
      {
        "url": "https://developer.withings.com/developer-guide/v3/maintain-your-integration/track-changes-on-our-services/",
        "checked": "2026-10-17",
        "note": "developer updates portal and mailing list"
      }
    ]
  },
  {
    "slug": "samsung-health-api",
    "primaryQuery": "samsung health api",
    "h1": "How to Integrate Samsung Health with the Data SDK (2026)",
    "metaTitle": "Samsung Health API (2026): Data SDK, Approval, Galaxy Ring",
    "metaDescription": "Read Samsung Health data on Android with the Samsung Health Data SDK: requirements, developer mode, partnership approval, permissions, data types, errors.",
    "updated": "2026-10-17",
    "answer": "To read Samsung Health data, including what a Galaxy Watch or Galaxy Ring syncs to the phone, you use the Samsung Health Data SDK, an Android library that reads the Samsung Health app's data store with the user's per-data-type permission. It needs Samsung Health 6.30.2 or later, Android 10 or later and a real device. During development it works in Samsung Health's developer mode; to release an app you submit a partnership request so Samsung registers your package name and SHA-256 signature, and writing data needs an access code issued after approval. Samsung deprecated its older Samsung Health SDK for Android on July 31, 2025.",
    "body": "On Samsung's developer site, the way to Samsung Health data is the **Samsung Health Data SDK**, an Android library that lets your app read, and with approval write, selected data in the Samsung Health app's data store on the user's phone. That store also holds data from connected devices: Samsung says a Galaxy Watch or Galaxy Ring automatically transfers its data to the paired phone's Samsung Health app, and lists Galaxy Fit, blood glucose monitors and weight scales among the accessories. Everything below is from Samsung's developer site as read on October 17, 2026. For the comparable Google platform, see [Google Health Connect](/integrate/google-health-connect).\n\nSamsung has two other health SDKs that this guide does not cover: the older **Samsung Health SDK for Android**, which Samsung deprecated as of July 31, 2025 in favor of the Data SDK, and the **Samsung Health Sensor SDK**, which runs on Galaxy Watch4 and later and exposes raw sensor signals such as accelerometer, ECG and PPG to watch apps.\n\n## Access and approval\n\n| Stage | What Samsung's pages say |\n|---|---|\n| Develop | Download the SDK and turn on developer mode in Samsung Health; developer mode is for testing and debugging only |\n| Read in a released app | Submit a partnership request before distribution; after approval, your app's package name and SHA-256 signature are registered in Samsung Health's system |\n| Write data | Request partnership; after approval you get an access code for writing, valid for one application |\n| Without approval | An app using the SDK works only with developer mode turned on |\n\nSamsung describes the partnership as \"an exclusive service for the Samsung Health Data SDK that allows users to discover engaging health and fitness apps\". Its pages do not mention fees.\n\n## Requirements\n\n- Samsung Health version 6.30.2 or later on the phone; the SDK needs Samsung Health installed.\n- Android 10 (API level 29) or later. Samsung Health runs on all Samsung smartphones and on non-Samsung Android phones.\n- Java 17 or later.\n- A real device: the SDK does not support emulators.\n- Samsung says data measured using the SDK is for fitness and wellness purposes only, not for diagnosing or treating any medical condition.\n\nThe version on Samsung's download page on October 17, 2026 was Samsung Health Data SDK v1.1.0, shipped as an `.aar` library you add to your module.\n\n## Permissions\n\nEach data type has its own permission, with read and write separate, and the user grants them in a Samsung Health pop-up. Check what is already granted when your app starts, and request the rest:\n\n```kotlin\n// Names from Samsung's Health Data SDK code lab\nval store = HealthDataService.getStore(applicationContext)\nval permissions = setOf(\n    Permission.of(DataTypes.STEPS, AccessType.READ),\n    Permission.of(DataTypes.STEPS_GOAL, AccessType.READ),\n)\nif (!store.getGrantedPermissions(permissions).containsAll(permissions)) {\n    store.requestPermissions(permissions, activity)\n}\n```\n\nSamsung's guidance is not to repeat a request the user keeps denying, and to explain in your settings screen how to allow it in Samsung Health instead.\n\n## Data: what you can read and write\n\n| Direction | Data types Samsung lists |\n|---|---|\n| Read | Activity summary, active calories burned goal, active time goal, blood glucose, blood oxygen, blood pressure, body composition, body temperature, energy score, exercise, exercise location, floors climbed, heart rate, irregular heart rhythm notification, nutrition, nutrition goal, skin temperature, sleep, sleep apnea, sleep goal, steps, step goal, water intake, water intake goal, user profile |\n| Write | Blood glucose, blood oxygen, blood pressure, body composition, body temperature, exercise, exercise location, floors climbed, heart rate, nutrition, sleep, water intake |\n\nQueries can filter and aggregate. Samsung's code lab totals today's steps with an `AggregateRequest` on `DataType.StepsType.TOTAL` and a `LocalTimeFilter`, and groups by hour with a `LocalTimeGroup`; groupings run from `MINUTELY` to `YEARLY`. The aggregate functions combine sources for you, for example total steps from several devices, and only periods with a non-zero step count come back.\n\n```kotlin\nval request = DataType.StepsType.TOTAL.requestBuilder\n    .setLocalTimeFilter(LocalTimeFilter.of(startOfDay, now))\n    .build()\nval total = store.aggregateData(request).dataList.firstOrNull()?.value ?: 0L\n```\n\nTwo other features matter for sync. `HealthDataStore.readChanges()` returns what changed for a data type and time filter: new, updated or deleted data, with the deleted data's ID or the new data point and the change time. And every data point carries its source device, so `DeviceManager.getDevice(deviceId)` tells you whether a value came from a Galaxy Watch, Galaxy Ring, Galaxy Fit, the phone or an accessory.\n\n## Errors you will meet\n\n| Error | Meaning and fix, per Samsung's FAQ |\n|---|---|\n| `2003: Permission not allowed due to SDK policy` | The app's package name or SHA-256 signature does not match what Samsung registered; submit a partner request with the right values, or use developer mode while developing |\n| `PLATFORM_NOT_INSTALLED`, `OLD_VERSION_PLATFORM` | Samsung Health is missing or too old; `ResolvablePlatformException.resolve(activityContext)` sends the user to the store page |\n| `ERR_NO_USER_PERMISSION` | The user has not granted the data permission; call `requestPermissions` |\n| `ERROR_ACCESS_CONTROL` | The data type is outside the scope available to your app; ask Samsung's developer support |\n\n## Webhooks and rate limits\n\nSamsung's pages describe no push notifications and no request limits for the Data SDK, which reads from the Samsung Health app on the same phone. To find what is new since your last read, use `readChanges()`.\n\n## What changed recently\n\n| When | Change (Samsung's pages) |\n|---|---|\n| July 31, 2025 | Samsung Health SDK for Android deprecated; Samsung points developers to the Samsung Health Data SDK |\n| Seen October 17, 2026 | Samsung Health Data SDK v1.1.0 on the download page, requiring Samsung Health 6.30.2 or later |\n\n## Gotchas and production notes\n\n- **Android, on the phone.** The Data SDK reads Samsung Health on the user's Android phone; the Samsung pages we read describe no iOS SDK or cloud API for this data.\n- **Partnership before release.** Without registration your app works only in developer mode, so plan the partner request into your launch.\n- **Writes need an access code.** Request it through the same partnership process.\n- **Galaxy Ring and Watch data arrive through the phone.** Your app reads them from Samsung Health once the wearable has synced.\n- **Wellness, not diagnosis.** Samsung's own limitation applies to anything you build.\n\nIf the partnership route does not fit, [Samsung Health API alternatives](/alternatives/samsung-health-api-alternatives) covers Health Connect, the watch SDKs and aggregators. The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Does Samsung Health have an API?",
        "a": "Samsung offers the Samsung Health Data SDK, an Android library that lets an app read selected health data from the Samsung Health app's data store on the user's phone and, with approval, write some types. The older Samsung Health SDK for Android was deprecated on July 31, 2025, and Samsung points developers to the Data SDK."
      },
      {
        "q": "Can I read Galaxy Ring data through Samsung Health?",
        "a": "Yes, through the phone. Samsung says a Galaxy Watch or Galaxy Ring automatically transfers its data to the paired phone's Samsung Health app, where the Data SDK can read it, and each data point names its source device, so you can tell ring data from watch or phone data with DeviceManager.getDevice."
      },
      {
        "q": "Do I need Samsung's approval to use the Samsung Health Data SDK?",
        "a": "To release an app, yes. During development the SDK works with Samsung Health's developer mode on. Before distribution you submit a partnership request, and after approval Samsung registers your app's package name and SHA-256 signature; without that, the SDK only works in developer mode. Writing data needs an access code issued after approval."
      },
      {
        "q": "What does error 2003 mean in the Samsung Health Data SDK?",
        "a": "Samsung's FAQ says 2003, Permission not allowed due to SDK policy, means your app's package name or SHA-256 signature does not match what is registered with Samsung. Submit a partner request with the correct values, or enable developer mode to keep developing without registration."
      },
      {
        "q": "Which devices does the Samsung Health Data SDK run on?",
        "a": "Android 10 (API level 29) or later with Samsung Health 6.30.2 or later installed. Samsung says Samsung Health runs on all Samsung smartphones and on non-Samsung Android phones. The SDK needs Java 17 or later and does not support emulators."
      }
    ],
    "related": [
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
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
      "pitch": "We track the platform health stores as they change, from Samsung's SDK deprecations to partnership rules, so your Android health integration keeps working."
    },
    "steps": [
      {
        "name": "Download the SDK",
        "text": "Download the Samsung Health Data SDK from Samsung's developer site and add its .aar library to your Android module. Target Android 10 or later and use Java 17 or later."
      },
      {
        "name": "Turn on developer mode",
        "text": "Enable developer mode in Samsung Health on a real test device; the SDK does not support emulators. Developer mode is for testing only and not for your users."
      },
      {
        "name": "Request permissions",
        "text": "Get a HealthDataStore with HealthDataService.getStore, check getGrantedPermissions, and call requestPermissions for each data type and access type you need."
      },
      {
        "name": "Read and aggregate data",
        "text": "Build requests such as DataType.StepsType.TOTAL with a LocalTimeFilter, call aggregateData, and use readChanges to pick up new, updated or deleted data."
      },
      {
        "name": "Submit a partnership request",
        "text": "Before distributing your app, submit Samsung's partnership request with your package name and SHA-256 signature. Request an access code too if your app writes data."
      }
    ],
    "sources": [
      {
        "url": "https://developer.samsung.com/health/data/overview.html",
        "checked": "2026-10-17",
        "note": "what the Data SDK is, Galaxy Watch and Ring data, read and write data types, limitations, SDK version"
      },
      {
        "url": "https://developer.samsung.com/health/data/process.html",
        "checked": "2026-10-17",
        "note": "developer mode, access code for writing, partnership request before distribution"
      },
      {
        "url": "https://developer.samsung.com/health/data/faq.html",
        "checked": "2026-10-17",
        "note": "devices, accessories, errors, permissions guidance, readChanges, source devices, writing data"
      },
      {
        "url": "https://developer.samsung.com/codelab/health/steps-data.html",
        "checked": "2026-10-17",
        "note": "permissions, aggregate requests, time filters and grouping"
      },
      {
        "url": "https://developer.samsung.com/health/android/overview.html",
        "checked": "2026-10-17",
        "note": "the older Samsung Health SDK for Android, deprecated July 31, 2025"
      },
      {
        "url": "https://developer.samsung.com/health/sensor/overview.html",
        "checked": "2026-10-17",
        "note": "the Samsung Health Sensor SDK for Galaxy Watch"
      }
    ]
  },
  {
    "slug": "suunto-api",
    "primaryQuery": "suunto api",
    "h1": "How to Integrate the Suunto API (2026)",
    "metaTitle": "Suunto API (2026): Partner Access, OAuth, Webhooks, FIT",
    "metaDescription": "Integrate the Suunto Cloud API: the partner application, OAuth with JWT tokens, subscription keys, workout webhooks, FIT files and what the API lacks.",
    "updated": "2026-10-17",
    "answer": "The Suunto Cloud API gives approved partners the workouts and daily steps and calories that Suunto watches sync to the Suunto App, and lets them push routes and workouts back. Access is through Suunto's partner program: companies and organizations apply, accept the API agreement and hear back within two weeks; Suunto does not offer access for personal use and does not charge for the API. Users authorize over OAuth 2.0, every data call carries the user's JWT access token plus your subscription key, and a webhook tells you when a new workout arrives. Sleep and personal data are not available yet.",
    "body": "Suunto's cloud API is the **Suunto Cloud API**, run from its developer site, the Suunto API Zone. It returns the workouts and daily activity that Suunto watches sync to the Suunto App, and lets you push routes and workouts back. Everything below is from Suunto's API Zone pages as read on October 17, 2026. If you are still choosing a provider, start with [wearable data APIs](/fitness-apis/wearable-data-apis).\n\n## Access and approval\n\n| Question | What Suunto's pages say |\n|---|---|\n| Who can get access? | Companies and organizations building tools, apps or services for a public audience; \"We currently don't offer the API access for personal use\" |\n| How do I apply? | Through the Suunto partner program application, which includes accepting the API agreement |\n| How long does review take? | Applications are reviewed weekly, with a maximum two-week wait |\n| What does it cost? | \"We do not charge from the use of the API.\" |\n| What is reviewed? | For example the fit to Suunto's brand, interest from Suunto's customers and how you illustrate an innovation mindset |\n\nAfter acceptance the path has three more steps. You subscribe to the **Development API**, which has every endpoint but smaller request limits; when you are ready you submit your app's information in your profile and subscribe to the **Production API**; then you submit your app's content, and Suunto grants production access and publishes the app on Suunto.com. One account holds one app, so a separate test app or a second brand needs another account and email address. If an agency builds the integration, Suunto asks the client company to apply and sign the API agreement, listing the agency's developers on the form.\n\n## Auth and keys\n\nThe Suunto Cloud API needs two credentials on every data call: the user's OAuth 2.0 access token and your **subscription key** (`Ocp-Apim-Subscription-Key`), which you find in your API Zone profile after subscribing. Suunto gives you a primary and a secondary key so you can rotate one without downtime. The OAuth endpoints do not take the subscription key.\n\nSet your app name, client secret and redirect URI in the OAuth settings of your profile; the client ID is generated for you. Then send the user to the authorization host:\n\n```http\nGET https://cloudapi-oauth.suunto.com/oauth/authorize\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/oauth-redirect\n```\n\nThe user signs in with their **Suunto App** account (Suunto notes that old Movescount credentials do not work) and comes back with a `code`. Exchange it with HTTP Basic client authentication:\n\n```bash\ncurl -s https://cloudapi-oauth.suunto.com/oauth/token \\\n  --user \"YOUR_CLIENT_ID:YOUR_CLIENT_SECRET\" \\\n  -d grant_type=authorization_code \\\n  -d redirect_uri=https://yourapp.example.com/oauth-redirect \\\n  -d code=AUTHORIZATION_CODE\n```\n\nSuunto's example response holds an `access_token`, a `refresh_token`, `expires_in` of 86400 seconds and the `workout` scope. The access token is a JWT, and its custom `user` claim is the user's Suunto App username, which you will need to match webhook notifications to users. Suunto has no mobile SDK; it says the authorization process is optimized for mobile use.\n\n## Data you can read and write\n\nData calls go to `https://cloudapi.suunto.com` with both headers:\n\n```bash\ncurl -s \"https://cloudapi.suunto.com/v2/workouts\" \\\n  -H \"Authorization: Bearer JWT_ACCESS_TOKEN\" \\\n  -H \"Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY\"\n```\n\n| Direction | What Suunto's FAQ lists |\n|---|---|\n| Read | Workouts, as a workout list, as JSON summaries or as FIT files with all samples, laps and GPS tracks; daily activity with steps and calories |\n| Write | Routes as GPX files with waypoints, which sync to Suunto watches for navigation; workouts as FIT files |\n| Not available yet | Sleep data, points of interest, and personal data such as weight or heart rate zones |\n\nUse the workout list for history and FIT files for full detail. Workout JSON gives `startTime` and `stopTime` in UNIX epoch milliseconds plus `timeOffsetInMinutes`, the user's offset from UTC when the exercise stopped. What a FIT file contains depends on the watch model and the sport mode the user chose, so a missing GPS track can be the device, not your parser.\n\n## Webhooks\n\nSuunto sends a webhook when a new workout syncs. Register the URL in your app's OAuth settings in the API Zone; it must be publicly reachable. Each notification is a `POST` with two parameters, `username` and `workoutid`: look up the access token by username, then fetch the workout's FIT file by its ID.\n\nThere is **no webhook for daily activity**. Suunto's advice is to fetch steps and calories whenever a workout notification arrives, since a synced workout means a synced watch, and otherwise to fetch daily activity about once a day for users who sync without working out. Suunto asks partners to avoid unnecessary polling.\n\n## Rate limits\n\nSuunto's pages say the Development API has the same capabilities as production but with rate-limited, smaller request limits. They do not publish the numbers for either API. Expect higher load at weekends and at the start of the year, which Suunto calls out as its busy periods.\n\n## What changed recently\n\nSuunto's API Zone publishes no dated changelog; partners hear about new capabilities through the partner newsletter Suunto adds them to on registration. Two standing notes matter for older integrations: the Movescount API is a completely separate system, and Suunto encourages everyone onto the Suunto App and the Cloud API; and apps for Suunto's China market use a separate API with different endpoints, which Suunto provides once your integration is ready.\n\n## Gotchas and production notes\n\n- **No personal projects.** Access is for companies and organizations; there is no individual tier.\n- **Two headers, always.** A data call needs both the user's JWT access token and your subscription key; the token exchange needs only Basic client credentials.\n- **Workout key format.** Suunto says a 500 error on the workout API usually means a bad workout key, which is a 12-byte hexadecimal string.\n- **401 with \"bad client credentials\".** Often a user trying Movescount credentials, or a malformed Basic header.\n- **Test on production data.** Development runs against the production system, so testers' real Suunto data works; Suunto also publishes example FIT files.\n- **SuuntoPlus fields.** Data from SuuntoPlus features sits in FIT files as developer fields.\n\nWhat Suunto's partner program costs you is on [Suunto API pricing](/pricing/suunto-api-pricing), and routes for teams it does not admit are on [Suunto API alternatives](/alternatives/suunto-api-alternatives). The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Is the Suunto API free?",
        "a": "Yes. Suunto's API Zone says \"We do not charge from the use of the API.\" Access is the gate instead: you apply through the Suunto partner program, accept the API agreement, and Suunto reviews applications weekly, with a maximum two-week wait. It does not offer API access for personal use."
      },
      {
        "q": "How do I get access to the Suunto Cloud API?",
        "a": "Apply to the Suunto partner program and select the Suunto Cloud API, which shows you the API agreement to sign, and list every developer who needs access. Once accepted, subscribe to the Development API, build, submit your app's information and subscribe to the Production API; Suunto then grants production access and lists your app on Suunto.com."
      },
      {
        "q": "What data does the Suunto API return?",
        "a": "Workouts, as a list, as JSON summaries or as FIT files with samples, laps and GPS tracks, and daily activity with steps and calories. You can also push GPX routes and FIT workouts to a user's account. Suunto says sleep data, points of interest and personal data such as weight or heart rate zones are not available yet."
      },
      {
        "q": "Does the Suunto API have webhooks?",
        "a": "For workouts only. Register a public URL in your app's OAuth settings and Suunto POSTs a username and workoutid whenever a new workout syncs; you then fetch it. There is no webhook for daily activity, so Suunto suggests fetching steps and calories with each workout and about once a day otherwise."
      },
      {
        "q": "What headers does the Suunto API need?",
        "a": "Two on every data call to https://cloudapi.suunto.com: Authorization with the user's JWT access token, and Ocp-Apim-Subscription-Key with a key from your API Zone profile. The OAuth token endpoint at cloudapi-oauth.suunto.com takes HTTP Basic client credentials instead and needs no subscription key."
      }
    ],
    "related": [
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/integrate/coros-api",
        "label": "Integrate the COROS API"
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
      "pitch": "We track sports-watch APIs as they change, from partner programs and review times to webhook coverage, so you know what you can build before you apply."
    },
    "steps": [
      {
        "name": "Apply to the Suunto partner program",
        "text": "Submit the partner program application, select the Suunto Cloud API, sign the API agreement and list your developers. Suunto reviews applications weekly, with a maximum two-week wait."
      },
      {
        "name": "Subscribe to the Development API",
        "text": "In the API Zone, subscribe to the Development API and copy a subscription key from your profile. Set your app name, client secret and redirect URI in your profile's OAuth settings."
      },
      {
        "name": "Authorize a Suunto App user",
        "text": "Send the user to https://cloudapi-oauth.suunto.com/oauth/authorize with response_type=code, your client_id and redirect_uri, then exchange the code at the token endpoint with HTTP Basic client credentials."
      },
      {
        "name": "Read workouts with both headers",
        "text": "Call https://cloudapi.suunto.com with the user's JWT access token and your Ocp-Apim-Subscription-Key, for example GET /v2/workouts, and fetch FIT files for full workout detail."
      },
      {
        "name": "Register the workout webhook",
        "text": "Add a public webhook URL in your app's OAuth settings. On each POST, find the user by username and fetch the workout by workoutid; fetch daily activity at the same time."
      },
      {
        "name": "Move to production",
        "text": "Submit your app's information and subscribe to the Production API, then send your app's content. Suunto grants production access and publishes your app on Suunto.com."
      }
    ],
    "sources": [
      {
        "url": "https://apizone.suunto.com/",
        "checked": "2026-10-17",
        "note": "who can get access, no charge, the application process and review times"
      },
      {
        "url": "https://apizone.suunto.com/how-to-start",
        "checked": "2026-10-17",
        "note": "subscription keys, OAuth settings, authorization and token endpoints, request headers"
      },
      {
        "url": "https://apizone.suunto.com/faq",
        "checked": "2026-10-17",
        "note": "data available and not available, webhooks, rate-limited development API, errors, publishing"
      },
      {
        "url": "https://apizone.suunto.com/apis",
        "checked": "2026-10-17",
        "note": "API reference access requires partner acceptance"
      }
    ]
  },
  {
    "slug": "coros-api",
    "primaryQuery": "coros api",
    "h1": "How to Integrate the COROS API (2026)",
    "metaTitle": "COROS API (2026): Self-Service MCP vs the Partner API",
    "metaDescription": "Integrate COROS watch data: the self-service OAuth 2.0 MCP endpoint, the Partner API's requirements, webhooks, data fields, limits and endpoint reference.",
    "updated": "2026-10-17",
    "answer": "COROS offers two ways to integrate its watch data. Any developer can connect to the COROS MCP endpoint over OAuth 2.0 with no application or approval, reading a single authorizing user's activities, health metrics and fitness data and writing workouts and training plans, but with no webhooks and FIT files capped at 50 requests a day. Established platforms can apply for the Partner API, which adds multi-user credentials, workout webhooks within about 5 minutes, two-way sync, GPX routes and a 1,000-calls-per-minute limit, under COROS's standard API Terms of Use.",
    "body": "COROS's help center, in articles published on September 2, 2026, describes two ways for an app to read COROS watch data: a **self-service MCP endpoint** that any developer can connect to over OAuth 2.0, one user at a time, and the **Partner API** for established platforms that need multi-user credentials, webhooks and two-way sync. Everything below is from COROS's help center articles on API access, read through the help center's public article API on October 17, 2026. If you are still choosing a provider, start with [wearable data APIs](/fitness-apis/wearable-data-apis).\n\nCOROS frames its approach around EU rules: it says it supports automated data sharing and API access for third-party platforms authorized by its users \"in alignment with EU data protection regulations (including GDPR and the EU Data Act)\", through a standardized, objective onboarding process rather than custom integrations or manual selection reviews.\n\n## Access: two paths\n\n| | Build on COROS MCP | Partner API |\n|---|---|---|\n| Who it is for | Developers building apps with COROS data | Established platforms needing multi-user access |\n| Application | None: \"No application or approval required\" | Company details, technical contacts and OAuth 2.0 redirect URIs, plus acceptance of COROS's API Terms of Use |\n| Users per authorization | One: access is scoped to the authorizing user only | Your whole user base, with multi-user OAuth 2.0 credentials |\n| Webhooks | No, your app polls the MCP | Workout summary push within about 5 minutes, with retry logic |\n| Two-way sync and routes | No two-way activity sync, no GPX routes | Two-way activity sync, structured workouts and training plans, GPX and KML routes up to 50MB |\n| Rate limit | Not stated; FIT file requests are capped at 50 per day | 1,000 calls per minute |\n\nThe Partner API's requirements are an established platform with a demonstrated user base, a registered company with an authorized technical representative, standard security and data privacy compliance, and agreement to COROS's API Terms of Use. To apply, an authorized technical representative submits the application form and emails api@coros.com with company details, technical contacts and OAuth 2.0 redirect URIs; once COROS verifies your identity and security specifications it issues an API client ID and secret. COROS says that terms are standard and non-discriminatory, and that platforms not yet at that scale can build on the MCP and apply later.\n\n## The MCP path\n\nCOROS's MCP server is at `https://mcp.coros.com/mcp`. You implement the OAuth 2.0 authorization flow pointing at it, add a \"Connect COROS\" button, and once the user logs in and authorizes your app you can read their training data and write workout plans through the MCP. COROS says any standard OAuth 2.0 client library will work and links full documentation in its COROS-MCP repository on GitHub.\n\nThe data available through the MCP, as COROS listed it in September 2026:\n\n| Area | What COROS lists |\n|---|---|\n| Activities | Activity records, lap and segment data, workout feedback and training notes, and FIT files with GPS tracks, capped at 50 file requests per day |\n| Health and daily data | Menstrual cycle data; daily steps, calories, workout duration and weekly Training Load; sleep; daily heart rate, HRV, stress, Wellness Checks and resting heart rate |\n| Fitness | Current training plan and calendar, VO2 Max, Running Fitness, race prediction times, recovery status, threshold pace and pace zones |\n| Profile | User profile and connected device information |\n| Writes | Road running, trail running and cycling workouts and training plans that sync to the user's COROS library |\n\nTwo limits matter for analysis apps. Cycling power data is not part of the standard query set, so a power curve or FTP estimate is not possible from a basic query, and detailed GPS or split-by-split analysis needs the FIT files, which count against the 50-per-day cap. Training plans must be 4 to 16 weeks long, a plan or workout can be scheduled from today to 14 days out, and deleting one has to be done in the COROS app.\n\n## The Partner API\n\nCOROS's Partner API reference groups its endpoints as follows:\n\n| Category | Functions |\n|---|---|\n| Auth | OAuth 2.0: authorize, access token, refresh, deauthorize, bind state |\n| User data | `getUserInfo`, `getWorkoutRecords` (30-day maximum range, 3-month lookback), `getDailyData` |\n| Workout detail | `getWorkoutDetailFit`, a FIT file download |\n| Push and webhooks | Workout summary push in about 5 minutes, with retry logic and your client ID and secret in the header |\n| Training plans | `tp/list/push`, `tp/workout/deleteById` |\n| Routes | `route/push`, GPX or KML up to 50MB |\n| Workout upload | `file/synchronous`, `file/upload` (asynchronous) and `file/upload/get` for status |\n\nThe `getWorkoutRecords` limits shape any backfill: a request covers at most 30 days and reaches back at most three months, so a new partner connection cannot import a user's whole history through the API.\n\n## What changed recently\n\n| When | Change (COROS's help center) |\n|---|---|\n| September 2, 2026 | \"Build on COROS MCP\" and \"Partner API Access\" articles published, describing the self-service MCP path and the Partner API's requirements |\n| September 21, 2026 | Workout and training plan creation through the MCP became available, per COROS |\n| October 12, 2026 | \"Partner API Access\" last updated |\n| October 20, 2026 | \"Submit an API Application\" last updated |\n\n## Gotchas and production notes\n\n- **Pick the path by user count.** The MCP is single-user per authorization and has no webhooks; serving many users with push and sync is what the Partner API is for.\n- **Poll gently on the MCP.** With no webhooks, polling is the only way to see new data, and FIT files are capped at 50 requests per day.\n- **No power data in standard queries.** Pull FIT files if you need cycling power.\n- **Short lookback on the Partner API.** Workout records go back three months, in 30-day windows.\n- **Deletions happen in the app.** Plans and workouts created through the MCP cannot be deleted through it.\n\nRoutes beyond COROS's own two are on [COROS API alternatives](/alternatives/coros-api-alternatives). The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Does the COROS API require approval?",
        "a": "Not for the MCP path: COROS says building on its MCP needs no application or approval, only an OAuth 2.0 flow to https://mcp.coros.com/mcp. The Partner API does: you need an established platform with a demonstrated user base, a registered company with an authorized technical representative, and agreement to COROS's API Terms of Use."
      },
      {
        "q": "What data can I get from COROS?",
        "a": "Through the MCP, COROS lists activity records, laps, workout feedback, FIT files with GPS tracks, daily steps, calories, Training Load, sleep, heart rate, HRV, stress, resting heart rate, menstrual cycle data, VO2 Max, race predictions, recovery status, pace zones and profile and device data. Cycling power is not in the standard query set."
      },
      {
        "q": "Does the COROS API have webhooks?",
        "a": "Only the Partner API. It pushes workout summaries to your endpoint within about 5 minutes, with retry logic and your client ID and secret in the header. The self-service MCP path has no webhook push notifications, so an app built on it has to poll the MCP."
      },
      {
        "q": "What are the COROS API limits?",
        "a": "The Partner API's rate limit is 1,000 calls per minute, and its workout records endpoint covers at most 30 days per request with a three-month lookback. On the MCP path, COROS caps FIT file requests at 50 per day; it publishes no general request limit for it."
      },
      {
        "q": "How do I apply for the COROS Partner API?",
        "a": "Have an authorized technical representative submit COROS's API application form and email api@coros.com with your company details, technical contacts and OAuth 2.0 redirect URIs, then accept COROS's standard API Terms of Use. Once COROS verifies your identity and security specifications, it issues your API client ID and secret."
      }
    ],
    "related": [
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/integrate/suunto-api",
        "label": "Integrate the Suunto API"
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
      "pitch": "We track how sports-watch makers open their data, from self-service OAuth endpoints to partner programs and their limits, so you can pick the right path before you build."
    },
    "steps": [
      {
        "name": "Choose your path",
        "text": "Use the COROS MCP for a self-service, single-user integration with no approval. Apply for the Partner API if you need many users, webhooks, two-way sync or GPX routes."
      },
      {
        "name": "Implement OAuth 2.0 against the MCP",
        "text": "Point a standard OAuth 2.0 client at https://mcp.coros.com/mcp and add a Connect COROS button; each user logs in and authorizes your app to access their own data."
      },
      {
        "name": "Read data and write plans",
        "text": "Read activities, health and fitness data through the MCP, and write running and cycling workouts and 4 to 16 week training plans. Request FIT files sparingly, at most 50 a day."
      },
      {
        "name": "Apply for the Partner API when you scale",
        "text": "Submit COROS's application form and email api@coros.com with company details, technical contacts and redirect URIs, then accept COROS's standard API Terms of Use."
      },
      {
        "name": "Receive credentials and webhooks",
        "text": "After verification, COROS issues your client ID and secret. Register for workout summary pushes, fetch FIT files with getWorkoutDetailFit, and keep within 1,000 calls per minute."
      }
    ],
    "sources": [
      {
        "url": "https://support.coros.com/hc/en-us/articles/53181619102996-Build-on-COROS-MCP",
        "checked": "2026-10-17",
        "note": "self-service MCP path, OAuth 2.0, single-user scope, limitations; read through the help center's article API"
      },
      {
        "url": "https://support.coros.com/hc/en-us/articles/53181766856724-Partner-API-Access",
        "checked": "2026-10-17",
        "note": "Partner API requirements, capabilities, rate limit, application process, endpoint reference; read through the help center's article API"
      },
      {
        "url": "https://support.coros.com/hc/en-us/articles/17085887816340-Submit-an-API-Application",
        "checked": "2026-10-17",
        "note": "EU data rules, standardized onboarding, how to apply; read through the help center's article API"
      },
      {
        "url": "https://support.coros.com/hc/en-us/articles/50841795180948-Connect-Your-COROS-to-AI",
        "checked": "2026-10-17",
        "note": "data fields available through the MCP, FIT file cap, training plan rules; read through the help center's article API"
      },
      {
        "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
        "checked": "2026-10-17",
        "note": "the same five articles with their publication and update dates, as JSON"
      }
    ]
  },
  {
    "slug": "wahoo-api",
    "primaryQuery": "wahoo api",
    "h1": "How to Integrate the Wahoo Cloud API (2026)",
    "metaTitle": "Wahoo Cloud API (2026): Approval, OAuth, Token Cap, Limits",
    "metaDescription": "Integrate the Wahoo Cloud API: request-based approval, OAuth with PKCE, the 10-token-per-user cap, workout summary webhooks, sandbox and production limits.",
    "updated": "2026-10-17",
    "answer": "Wahoo's Cloud API connects Wahoo users to your app over OAuth 2.0 for profile data, power zones, plans, routes and workouts. Wahoo limits it to developers who request it: you register at developers.wahooligan.com, submit an app for approval, and production apps go through a further review for a higher rate limit. Access is currently free under Wahoo's Public API Agreement. Access tokens last 2 hours, apps are capped at 10 unrevoked tokens per user from January 1, 2026, webhooks deliver workout summaries, and Wahoo does not share workouts recorded in third-party apps.",
    "body": "Wahoo's **Cloud API** connects Wahoo users to your app over OAuth 2.0 and covers profile data, heart rate and power zones, routes, plans and the upload and download of workouts. It is separate from Wahoo's iOS and Android APIs. Everything below is from Wahoo's developer portal, its live Cloud API documentation and its Public API Agreement, as read on October 17, 2026. If you are still choosing a provider, start with [wearable data APIs](/fitness-apis/wearable-data-apis).\n\n## Access and approval\n\n| Question | What Wahoo's pages say |\n|---|---|\n| Who can use it? | Those who request it: Wahoo is \"currently limiting use of the API to those who request it\" and asks about the scopes involved and your app's purpose |\n| How do I apply? | Register at developers.wahooligan.com and submit an application; it shows as pending approval in your portal |\n| Sandbox or production? | Separate applications: a Sandbox app cannot later be converted into a Production app, so submit two if you need both |\n| What does production need? | A review by Wahoo Fitness; approved apps get a higher rate limit |\n| What does it cost? | The Public API Agreement says access is \"currently provided at no charge\", and Wahoo reserves the right to charge in future |\n\nThe agreement adds terms worth reading before you build: you may not charge end users for access to Wahoo's API materials or anything included in them, though you can charge for functionality Wahoo does not provide, and you must attribute Wahoo using the links and logos it supplies.\n\n## Auth and scopes\n\nWahoo uses the OAuth 2.0 authorization-code flow, with PKCE available for public clients. Its base URL is `api.wahooligan.com`.\n\n```http\nGET https://api.wahooligan.com/oauth/authorize\n  ?client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/callback\n  &scope=user_read%20workouts_read%20offline_data\n  &response_type=code\n```\n\nExchange the returned `code` with a `POST` to `https://api.wahooligan.com/oauth/token` carrying your `client_id`, `client_secret`, the `code`, your `redirect_uri` and `grant_type=authorization_code`. For PKCE, set your app's \"Confidential?\" field to No in the portal, send a `code_challenge` (Wahoo accepts `plain` or `S256`) and pass the `code_verifier` on the token and refresh calls instead of the secret.\n\nThe developer portal lists twelve scopes: `email`, `user_read`, `user_write`, `power_zones_read`, `power_zones_write`, `workouts_read`, `workouts_write`, `plans_read`, `plans_write`, `routes_read`, `routes_write` and `offline_data`. Two rules matter. Without `user_read`, Wahoo says the API returns 403. And `offline_data`, described as receiving data even when the app is closed, is required for webhooks. Request only what you use; Wahoo says applications must only request permission for resources they intend to access or modify.\n\nTokens need care:\n\n- **Access tokens expire after 2 hours.** Refresh with `grant_type=refresh_token` to get a new access token and a new refresh token.\n- **Old tokens die on use, not on refresh.** The previous access and refresh tokens are revoked once an API call is made with the refreshed token. Refreshing alone does not revoke anything.\n- **A cap per user.** From January 1, 2026, an application is limited to 10 unrevoked access tokens per user, and unrevoked tokens are deleted automatically 60 days after creation. Wahoo's advice: refresh only immediately before an API request.\n- **File downloads do not count.** Downloading a FIT file from Wahoo's CDN is not an API request, so it does not revoke previous tokens.\n\nTo disconnect a user, call `DELETE https://api.wahooligan.com/v1/permissions`. Portal flags can make that call, or a user revoking access from their account settings, also delete incomplete future workouts and the plans available to the user through your app.\n\n## Data: workouts, summaries, plans, routes and zones\n\n| Resource | What it holds |\n|---|---|\n| Workouts | A single workout event; it becomes structured when it references a plan |\n| Workout summaries | The results of a completed workout, such as distance, duration and calories, with a link to its FIT file |\n| Workout file uploads | Upload a workout file and check its processing status |\n| Plans | Structured workout files with intervals and targets that play on Wahoo devices and apps |\n| Routes | Routes stored for the user |\n| Power zones | The user's power zones |\n| Users | The authenticated user's profile, readable and updatable |\n\nOne limitation shapes what you can promise: **Wahoo does not share completed workout data that originates from third-party applications**, a change its changelog dates to April 1, 2025. A workout's `fitness_app_id` tells you the source: below 1000 is a Wahoo application, above 1000 a third party. Plans follow a library model, so create the plan once, then reference its ID from workouts; to show a plan on an ELEMNT bike computer it must be attached to a workout scheduled from today to six days out. The API returns decimal values as strings.\n\n## Webhooks\n\nConfigure webhooks per app with three settings: `webhook_enabled`, `webhook_url` and a `webhook_token` that Wahoo sends with each call so you can ignore anything without it. The documented event is `workout_summary`, which arrives as a JSON `POST` with the summary, the user's ID, the workout and a FIT file URL, and it requires users to have granted `offline_data`.\n\nIf your endpoint does not return HTTP 200, Wahoo retries after 30 minutes, 4 hours, 24 hours and 72 hours. Duplicates are possible when files are updated or deleted, so make your handler idempotent.\n\n## Rate limits\n\nEvery response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`, each listing the day, hour and 5-minute windows. The published limits:\n\n| Window | Sandbox apps | Production apps |\n|---|---|---|\n| Every 5 minutes | 25 | 200 |\n| Per hour | 100 | 1,000 |\n| Per day | 250 | 5,000 |\n\nAuthentication, token refreshes and file downloads do not count against them. Wahoo asks you to contact support if you need more; a 429 means you are over.\n\n## What changed recently\n\n| Date (Wahoo's changelog) | Change |\n|---|---|\n| October 9, 2026 | Documentation notes that scopes and other app settings can be changed on the Applications page of the portal |\n| October 6, 2025 | Wahoo Plans section, a Get Plans for Workout endpoint and multiple plans per workout (`plan_ids`) |\n| July 22, 2025 | Deauthorization features documented |\n| June 11, 2025 | `manual`, `edited` and `name` fields on workout summaries |\n| April 1, 2025 | Wahoo stopped sharing workout summaries created by third-party apps |\n| March 4, 2025 | Routes endpoint documented |\n\nThe token cap of 10 unrevoked access tokens per user took effect on January 1, 2026.\n\n## Gotchas and production notes\n\n- **Plan two apps.** Sandbox and Production are separate applications and a sandbox app cannot be promoted.\n- **Refresh late.** Refresh right before a call and use the new token at once, or you will pile up unrevoked tokens against the per-user cap.\n- **No third-party workouts.** Users who record in other apps will not see those workouts through Wahoo.\n- **Ask for `user_read` and `offline_data`.** One is needed to avoid 403s, the other for webhooks.\n- **Error 422 can mean \"not approved\".** Wahoo lists 422 for missing or invalid parameters or an app that is not approved.\n\nWhat Wahoo's agreement costs you is on [Wahoo API pricing](/pricing/wahoo-api-pricing), and other routes to Wahoo users' data are on [Wahoo API alternatives](/alternatives/wahoo-api-alternatives). The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Is the Wahoo API free?",
        "a": "Yes, for now. Wahoo's Public API Agreement says access to and use of its API materials and platform are currently provided at no charge, and that Wahoo may charge in future. It also forbids charging your end users for access to Wahoo's API materials, though you can charge for functionality Wahoo does not provide."
      },
      {
        "q": "How do I get access to the Wahoo Cloud API?",
        "a": "Register at developers.wahooligan.com and submit an application with details about your app's purpose and scopes; it shows as pending until Wahoo approves it. Sandbox and Production are separate applications and a sandbox app cannot be converted, so submit both if you need both. Production apps go through Wahoo's review."
      },
      {
        "q": "What is the Wahoo token limit?",
        "a": "From January 1, 2026, an application can hold at most 10 unrevoked access tokens per user, and unrevoked tokens are deleted 60 days after creation. A refresh does not revoke the old token; only an API call with the new token does. So refresh immediately before a request, not on a timer."
      },
      {
        "q": "Does the Wahoo API have webhooks?",
        "a": "Yes. Enable webhook_enabled, set a webhook_url and a webhook_token in your app settings, and Wahoo POSTs workout_summary events as JSON for users who granted the offline_data scope. Without an HTTP 200 it retries after 30 minutes, 4 hours, 24 hours and 72 hours, and duplicates are possible."
      },
      {
        "q": "What are the Wahoo API rate limits?",
        "a": "Sandbox apps get 25 requests every 5 minutes, 100 an hour and 250 a day; production apps 200, 1,000 and 5,000. Authentication, token refreshes and file downloads do not count, every response reports usage in X-RateLimit headers, and Wahoo raises limits on request through support."
      }
    ],
    "related": [
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
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
      "pitch": "We track cycling and training APIs as they change, from approval rules to token caps and dropped data sources, so a Wahoo integration does not break quietly."
    },
    "steps": [
      {
        "name": "Register and request access",
        "text": "Create an account at developers.wahooligan.com and submit a Sandbox application with as much detail as you can about its purpose and scopes. It stays pending until Wahoo approves it."
      },
      {
        "name": "Send the user to the authorization URL",
        "text": "Redirect to https://api.wahooligan.com/oauth/authorize with your client_id, redirect_uri, a space-separated scope list that includes user_read, and response_type=code. Add a code_challenge if your app is not confidential."
      },
      {
        "name": "Exchange the code for tokens",
        "text": "POST the code to https://api.wahooligan.com/oauth/token with your client credentials, or your code_verifier for PKCE, and store the access token and refresh token."
      },
      {
        "name": "Enable the webhook",
        "text": "Set webhook_enabled, a webhook_url and a webhook_token in your app settings, request offline_data, and ignore any POST without your token. Handle duplicates idempotently."
      },
      {
        "name": "Fetch workout summaries and files",
        "text": "On each workout_summary event, read the summary and download its FIT file. Refresh tokens only right before an API call, and watch the X-RateLimit headers."
      },
      {
        "name": "Apply for production",
        "text": "Submit a separate Production application for Wahoo's review; an approved app gets 200 requests every 5 minutes, 1,000 an hour and 5,000 a day."
      }
    ],
    "sources": [
      {
        "url": "https://developers.wahooligan.com/cloud",
        "checked": "2026-10-17",
        "note": "API summary, request and approval, sandbox and production apps, scope list, agreement link"
      },
      {
        "url": "https://cloud-api.wahooligan.com/",
        "checked": "2026-10-17",
        "note": "registration, rate limits, OAuth and PKCE flows, token limits, deauthorization, resources, webhooks, errors, changelog"
      },
      {
        "url": "https://www.wahoofitness.com/wahoo-api-agreement",
        "checked": "2026-10-17",
        "note": "no charge currently, right to charge, no charging end users for API access, attribution"
      }
    ]
  },
  {
    "slug": "dexcom-api",
    "primaryQuery": "dexcom api",
    "h1": "How to Integrate the Dexcom API (2026)",
    "metaTitle": "Dexcom API (2026): Access Levels, OAuth, EGVs, Limits",
    "metaDescription": "Integrate the Dexcom CGM API: registration, Limited and Full Access reviews, OAuth with a one-minute code, v3 endpoints, the 30-day window and data delays.",
    "updated": "2026-10-17",
    "answer": "The Dexcom API gives authorized apps a user's continuous glucose monitor data, including estimated glucose values, events, calibrations, alerts and device details, over OAuth 2.0. Registration is free and comes with a sandbox of simulated users; real data needs Dexcom's approval, first Limited Access for up to 5 users under a Data Licensing Agreement, then Full Access after a technical and commercial review. Authorization codes expire after one minute, queries are limited to 30-day windows, app-uploaded data arrives one hour late in the US and three hours elsewhere, and apps may make 60,000 calls an hour.",
    "body": "Dexcom's API returns continuous glucose monitor (CGM) data, such as estimated glucose values and events, to apps that Dexcom users authorize. Access is staged: anyone can register and build against simulated data, but real users' data needs Dexcom's approval, first for a handful of test users and then for a commercial launch. Everything below is from Dexcom's developer documentation as read on October 17, 2026. For other connected health devices, see the [Withings API guide](/integrate/withings-api).\n\n## Access and approval\n\nDexcom describes three levels of access:\n\n| Level | What it allows | How you get it |\n|---|---|---|\n| Registered Developer | App credentials, the sandbox environment and support requests | Free registration at developer.dexcom.com, accepting the Registered Developer Agreement |\n| Limited Access | Up to 5 authorized users of real data, for testing | Apply for an upgrade from the app's profile; Dexcom's Strategic Partnerships team reviews it and, if it agrees, sends a standard, non-negotiable Data Licensing Agreement |\n| Full Access | A commercial app for any Dexcom user | Apply with the Full Access Questionnaire; Dexcom runs a technical and commercial review of the app |\n\nDexcom splits Limited Access requests by who you are. Individual developers apply from the app's profile; commercial app developers submit a request for a commercial partnership through Dexcom's partnership questionnaire; research use goes through a separate research portal. Dexcom says it values every company that applies but reserves the right to decline apps that do not meet certain commercial and technical standards. Each app is reviewed on its own, so a second app needs its own upgrade.\n\nOnce an app has Full Access and at least one active Dexcom user within 60 days of public availability, the developer can apply to become a Dexcom Digital Health Partner and appear in Dexcom's Partnerships Gallery, which Dexcom says is not an endorsement. Dexcom also reminds developers that complying with all applicable regulations is their responsibility, and points to the FDA's Digital Health site for US rules.\n\n## Auth and scopes\n\nDexcom uses OAuth 2.0 with the authorization-code flow, and requires partners to keep tokens and the client secret on their servers, never on a mobile device. Send the user to Dexcom's login:\n\n```http\nGET https://api.dexcom.com/v3/oauth2/login\n  ?client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/callback\n  &response_type=code\n  &scope=offline_access\n  &state=RANDOM_ANTI_CSRF_STRING\n```\n\n`code` is the only response type and `offline_access` the only scope you can request. Behind that scope, the HIPAA authorization the user signs lists four kinds of data: estimated blood glucose levels, calibration data, events entry data and device details. Neither you nor the user can pick a subset.\n\nThe user logs in with their Dexcom account, signs the HIPAA authorization, and comes back with a code that is **single-use and expires after one minute**. Exchange it at `https://api.dexcom.com/v3/oauth2/token`:\n\n```bash\ncurl -s -X POST \"https://api.dexcom.com/v3/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d grant_type=authorization_code \\\n  -d code=AUTHORIZATION_CODE \\\n  -d redirect_uri=https://yourapp.example.com/callback \\\n  -d client_id=YOUR_CLIENT_ID \\\n  -d client_secret=YOUR_CLIENT_SECRET\n```\n\nDexcom's example response has an access token with `expires_in` of 7200 seconds and a refresh token. Each refresh token works once: exchanging it issues a new one and invalidates the old, and a refresh token is valid for at most one year. A 401 on a data call means refresh; a 400 on a refresh means the token is dead, for example because the user revoked access or reset their Dexcom password, and the user must authorize again. Users revoke apps from Permissions in their Dexcom account, and Dexcom says data already provided to your app is not affected by the revocation.\n\n## Data: the v3 endpoints\n\n| Endpoint | Returns |\n|---|---|\n| `GET /v3/users/self/egvs` | Estimated glucose values |\n| `GET /v3/users/self/events` | User-entered events |\n| `GET /v3/users/self/calibrations` | Calibration entries |\n| `GET /v3/users/self/alerts` | Alerts |\n| `GET /v3/users/self/devices` | Device information |\n| `GET /v3/users/self/dataRange` | The time range the user has data for |\n\n```bash\ncurl -s \"https://api.dexcom.com/v3/users/self/egvs?startDate=2026-10-01T00:00:00&endDate=2026-10-02T00:00:00\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nThe base URL depends on the user's region: `https://api.dexcom.com` in the US, `https://api.dexcom.eu` for the EU and outside the US, and `https://api.dexcom.jp` for Japan. The v3 API covers data from Dexcom G6, G7, G7 15-day, Dexcom ONE and Dexcom ONE+ devices; Dexcom ONE and ONE+ are not sold in the United States.\n\nFour data rules shape every query:\n\n- **A 30-day window.** Every endpoint except `/dataRange` needs `startDate` and `endDate`, and a window over 30 days returns 400. The window includes `startDate` and excludes `endDate`, and it is matched against `systemTime`.\n- **Two clocks.** Records carry `systemTime`, the device's UTC time, and `displayTime`, what the user sees; Dexcom notes that `systemTime` is not true UTC because of drift and user changes.\n- **mg/dL only.** Glucose values come in mg/dL and trend rates in mg/dL/min; converting to mmol/L is your job.\n- **Delayed data.** Data uploaded from Dexcom's mobile apps reaches the API with a one-hour delay in the United States and three hours elsewhere, including Japan. Uploads from a receiver through Dexcom's uploader are available immediately.\n\n## Sandbox\n\nEvery Registered Developer can call `https://sandbox-api.dexcom.com` with simulated users, named for the G6, G7, Dexcom ONE and G7 15-day apps, through the same OAuth flow, choosing the user from a drop-down instead of entering a password. Dexcom warns that sandbox data is not guaranteed to match production or to be permanent, and should not be used for formal testing, validation or training algorithms.\n\n## Rate limits and transport\n\nDexcom limits requests to 60,000 calls per app per hour and returns 429 above that. The API requires TLS 1.3.\n\n## What changed recently\n\nDexcom's developer documentation publishes no dated changelog. The current documentation describes the v3 API, with support for the G7 15-day sensor alongside G6, G7, Dexcom ONE and Dexcom ONE+.\n\n## Gotchas and production notes\n\n- **The one-minute code.** Exchange the authorization code immediately.\n- **All or nothing.** The HIPAA authorization covers all four data scopes; there is no way to ask for less.\n- **Server-side only.** Dexcom requires tokens on your servers, not in the mobile app.\n- **Mind the delay.** A one-hour or three-hour delay is normal for app uploads, so do not treat a gap as missing data.\n- **Region-specific hosts.** Send each user's calls to the right regional base URL.\n- **Limited Access is for testing.** Five real users is the ceiling until Full Access.\n\nOther routes to CGM data, and which of them still lead back to Dexcom's approval, are on [Dexcom API alternatives](/alternatives/dexcom-api-alternatives). The rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Is the Dexcom API free?",
        "a": "Registration is: Dexcom calls it simple and free, and it gives you app credentials and sandbox data. Real users' data needs approval, and Dexcom sends approved Limited Access applicants a standard, non-negotiable Data Licensing Agreement. Dexcom's public documentation does not state fees, so read that agreement before you plan costs."
      },
      {
        "q": "What are Limited Access and Full Access?",
        "a": "Limited Access lets an app authenticate up to 5 Dexcom users for testing with real data, after Dexcom's Strategic Partnerships team reviews your request. Full Access is for a commercial launch: you complete a Full Access Questionnaire and Dexcom runs a technical and commercial review of the app. Each app is reviewed separately."
      },
      {
        "q": "How does Dexcom OAuth work?",
        "a": "Send the user to https://api.dexcom.com/v3/oauth2/login with response_type=code and scope=offline_access, the only values accepted. After login and a HIPAA authorization, exchange the single-use code within one minute at /v3/oauth2/token. Access tokens last 7,200 seconds and each refresh token works once, for up to a year."
      },
      {
        "q": "Why is Dexcom data delayed?",
        "a": "Dexcom says data uploaded from its mobile apps reaches the API with a one-hour delay in the United States and a three-hour delay elsewhere, including Japan. Data uploaded from a receiver through Dexcom's uploader is available immediately. Build your product around the delay rather than treating it as missing data."
      },
      {
        "q": "What are the Dexcom API rate limits?",
        "a": "Dexcom limits requests to 60,000 calls per app per hour and returns 429 when you exceed it. Each data query is also capped at a 30-day window between startDate and endDate; a longer window returns 400. The API requires TLS 1.3."
      }
    ],
    "related": [
      {
        "href": "/integrate/withings-api",
        "label": "Integrate the Withings API"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      }
    ],
    "cta": {
      "pitch": "We track health-device APIs as their access rules change, from Dexcom's review stages to data delays and regional hosts, so your launch plan matches what vendors actually allow."
    },
    "steps": [
      {
        "name": "Register and create an app",
        "text": "Register as a Dexcom developer at developer.dexcom.com, accept the Registered Developer Agreement and create an app to get a client ID and secret. Keep both on your server."
      },
      {
        "name": "Build against the sandbox",
        "text": "Point requests at https://sandbox-api.dexcom.com, run the OAuth flow and pick a simulated user from the drop-down. Use /dataRange to see each sandbox user's dates."
      },
      {
        "name": "Run the authorization-code flow",
        "text": "Send users to /v3/oauth2/login with response_type=code and scope=offline_access, then exchange the single-use code within one minute at /v3/oauth2/token. Store each new refresh token, since every one works only once."
      },
      {
        "name": "Query data in 30-day windows",
        "text": "Call /v3/users/self/egvs and the other endpoints with startDate and endDate no more than 30 days apart, on the user's regional base URL, and convert mg/dL yourself if users want mmol/L."
      },
      {
        "name": "Apply for Limited Access",
        "text": "When sandbox testing is done, apply for an upgrade from the app's profile. If Dexcom approves, sign its Data Licensing Agreement and test with up to 5 real users."
      },
      {
        "name": "Apply for Full Access",
        "text": "Submit the Full Access Questionnaire, pass Dexcom's technical and commercial review, and fix anything it flags before you launch publicly."
      }
    ],
    "sources": [
      {
        "url": "https://developer.dexcom.com/docs/",
        "checked": "2026-10-17",
        "note": "Developer Program, Digital Health Partners, right to decline"
      },
      {
        "url": "https://developer.dexcom.com/docs/dexcom/getting-started",
        "checked": "2026-10-17",
        "note": "registration, sandbox, Limited Access for up to 5 users, Full Access"
      },
      {
        "url": "https://developer.dexcom.com/docs/dexcom/scopes-access",
        "checked": "2026-10-17",
        "note": "free registration, data environments, scopes, Limited and Full Access processes, Digital Health Partner criteria"
      },
      {
        "url": "https://developer.dexcom.com/docs/dexcom/authentication",
        "checked": "2026-10-17",
        "note": "OAuth endpoints, one-minute code, token lifetimes, single-use refresh tokens, revocation, errors"
      },
      {
        "url": "https://developer.dexcom.com/docs/dexcomv3/endpoint-overview",
        "checked": "2026-10-17",
        "note": "v3 endpoints, regional base URLs, devices, TLS 1.3, rate limit, time windows, units, data delays"
      },
      {
        "url": "https://developer.dexcom.com/docs/dexcom/sandbox-data",
        "checked": "2026-10-17",
        "note": "sandbox base URL, simulated users and limitations"
      }
    ]
  },
  {
    "slug": "concept2-api",
    "primaryQuery": "concept2 api",
    "h1": "How to Integrate the Concept2 Logbook API (2026)",
    "metaTitle": "Concept2 Logbook API (2026): OAuth, Scopes, Results, Webhook",
    "metaDescription": "Integrate the Concept2 Logbook API: self-serve keys, OAuth scopes, reading and writing results, the dev server and approval for writes, and the webhook.",
    "updated": "2026-10-17",
    "answer": "The Concept2 Logbook API lets your app read and write a user's workout results in the Concept2 Logbook over OAuth 2.0. You create a client yourself on the API Keys page; if you only read data you can develop against production, while apps that write must be built against log-dev.concept2.com and approved by Concept2 before going live. Request scopes such as results:read explicitly, refresh the seven-day access token with a one-year refresh token, and register a webhook to hear when results are added, updated or deleted. Concept2 says the API is not currently rate limited.",
    "body": "The Concept2 Logbook API reads and writes workout results in the Concept2 Logbook. Results are typed by where they happened, from `rower`, `skierg` and `bike` to `dynamic`, `slides`, `paddle`, `water`, `snow`, `rollerski` and `multierg`. It is a small, practical OAuth 2.0 API with a webhook, and reading data needs no approval at all. Everything below is from Concept2's developer pages and Logbook API documentation as read on October 17, 2026. For indoor training data from other platforms, see the [Wahoo Cloud API guide](/integrate/wahoo-api).\n\n## Access and approval\n\n| Question | What Concept2's pages say |\n|---|---|\n| How do I get credentials? | Set up a client on the \"API Keys\" page, logged in with a Concept2 Logbook account; a registered application gets a client ID and client secret |\n| Can I read data straight away? | Yes: if you only read from the Logbook, you can develop against production |\n| What about writing? | Apps that write must first be developed against `https://log-dev.concept2.com`, then approved by Concept2 for the live API |\n| How do I go live? | Contact Concept2 at ranking@concept2.com for validation |\n| What does it cost? | Concept2's developer pages do not mention fees |\n\nThe development server's results and users may be reset from time to time, so do not rely on test data persisting there. For a personal script, Concept2 suggests generating a long-lived token from your own profile (Edit Profile, then Applications) instead of building the OAuth flow.\n\n## Auth and scopes\n\nConcept2 implements four OAuth 2.0 grants: authorization code, refresh, client credentials and password. Every application gets the authorization-code and refresh grants; client credentials and password are only for certain trusted applications. Send the user to the Logbook:\n\n```http\nGET https://log.concept2.com/oauth/authorize\n  ?client_id=YOUR_CLIENT_ID\n  &scope=user:read,results:read\n  &response_type=code\n  &redirect_uri=https://yourapp.example.com/logbook\n```\n\n| Scope | Grants |\n|---|---|\n| `user:read` | Read access to the user's profile |\n| `user:write` | Read and write access to the user's profile |\n| `results:read` | Read access to the user's results |\n| `results:write` | Read and write access to the user's results |\n\nScopes are comma-separated, and a write scope includes its read scope. **Always pass a scope**: without one, Concept2 currently defaults to `user:read,results:write` for backwards compatibility and warns that this may change. Pass the same scopes again when you exchange the code and when you refresh; you can ask for fewer later, never more.\n\n```bash\ncurl -s -X POST \"https://log.concept2.com/oauth/access_token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d client_id=YOUR_CLIENT_ID \\\n  -d client_secret=YOUR_CLIENT_SECRET \\\n  -d grant_type=authorization_code \\\n  -d code=AUTHORIZATION_CODE \\\n  -d redirect_uri=https://yourapp.example.com/logbook \\\n  -d scope=user:read,results:read\n```\n\nConcept2's example response has an access token with `expires_in` of 604800 seconds, seven days, and a refresh token. The refresh token currently lasts one year, and each refresh returns a new one, so a user who keeps using your app never has to log in again; one who stays away for over a year does.\n\n## Data: users and results\n\nThe API lives at `https://log.concept2.com/api`. Send `Accept: application/vnd.c2logbook.v1+json` to pin version 1, which Concept2 encourages.\n\n| Endpoint | What it does |\n|---|---|\n| `GET /api/users/me` | The authenticated user's profile |\n| `GET /api/users/me/results` | The user's workouts (results), filterable by `from`, `to`, `type` and `updated_after` |\n| `POST /api/users/me/results` | Add a result; `POST /api/users/me/results/bulk` adds several |\n| `GET`, `PATCH`, `DELETE /api/users/me/results/123` | Read, update or delete one result |\n| `GET /api/users/me/results/123/strokes` | A result's stroke data, which can also be deleted |\n| `GET /api/users/me/results/123/export/fit` | A file export of the result as `csv`, `fit` or `tcx` |\n\nFor incremental sync, filter with `updated_after`, which Concept2 interprets in GMT. When you add a result, `time` is in tenths of a second and `date` is the end of the workout as stored in the monitor, not the start. Lists are paginated with a `meta.pagination` block: 50 results per page by default, up to 250 with `number`, and 1-based `page` numbers. Errors come back with a status code and message; a 409 means a duplicate result, which the Logbook detects as a workout with the same date, time and distance as an existing one, and a 422 a well-formed request that failed validation. Optional headers such as `X-PM-Version`, `X-Device` and `X-Erg-Model-Type` let you report the performance monitor and device for debugging and analytics.\n\n## Webhook\n\nFrom the self-service developer portal you can register one webhook that fires when a result is added, updated or deleted for any user who authorized your client. Concept2 POSTs the event type, `result-added`, `result-updated` or `result-deleted`, with the result payload, which is the same data you would get by requesting the result, or just the result ID for a deletion.\n\n## Rate limits\n\nConcept2 says the API is not currently rate limited, may be in future, and that abuse will lead to rate limits or removal of access.\n\n## What changed recently\n\nConcept2's Logbook API documentation publishes no dated changelog. Two notes in it describe current behavior that may change: the default scope when none is passed, and the absence of rate limits.\n\n## Gotchas and production notes\n\n- **Writes need the dev server and approval.** Build any write path against log-dev.concept2.com and ask Concept2 to approve it before going live.\n- **Never rely on the default scope.** Pass scopes on every authorize, token and refresh call.\n- **Seven-day tokens.** Refresh weekly, and store the new refresh token each time.\n- **Duplicates return 409.** Treat it as \"already logged\" when you sync results in.\n- **No published fee and no rate limit today.** Both are statements about now, not promises, so do not hammer the API.\n\nThe rest of the cluster is at [how to integrate a fitness or health API](/integrate).",
    "faqs": [
      {
        "q": "Is the Concept2 API free?",
        "a": "Concept2's developer pages describe no fees: you set up a client on the API Keys page with a Concept2 Logbook account and get a client ID and secret. Reading data needs no approval. Apps that write results must be developed against Concept2's development server and approved by Concept2 before they use the live API."
      },
      {
        "q": "What scopes does the Concept2 Logbook API have?",
        "a": "Four: user:read, user:write, results:read and results:write, comma-separated, where a write scope includes its read scope. Always pass scopes on the authorize, token and refresh calls; without one, Concept2 currently defaults to user:read,results:write for backwards compatibility and says that may change."
      },
      {
        "q": "How long do Concept2 tokens last?",
        "a": "Concept2's example token response has an access token valid for 604,800 seconds, seven days. The refresh token currently lasts one year, and each refresh returns a new one, so an active user never has to log in again, while one who stays away for over a year must re-authorize."
      },
      {
        "q": "Does the Concept2 API have a webhook?",
        "a": "Yes. From the self-service developer portal you register one webhook that fires when a result is added, updated or deleted for any user who authorized your client. The POST carries result-added, result-updated or result-deleted with the result payload, or just the result ID for deletions."
      },
      {
        "q": "Does the Concept2 API have rate limits?",
        "a": "Not currently. Concept2's documentation says the API is not rate limited today, that this may change, and that abuse will result in rate limits or removal of access. Results lists are paginated at 50 per page by default and up to 250 per request."
      }
    ],
    "related": [
      {
        "href": "/integrate/wahoo-api",
        "label": "Integrate the Wahoo Cloud API"
      },
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
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
      "pitch": "We track the training-data APIs behind indoor and outdoor workouts, from scopes and token lifetimes to webhooks, so your sync keeps working as vendors change."
    },
    "steps": [
      {
        "name": "Create a client",
        "text": "Log in with a Concept2 Logbook account, open the API Keys page and set up a client with your redirect URI. Use log-dev.concept2.com instead if your app will write results."
      },
      {
        "name": "Send the user to the Logbook",
        "text": "Redirect to https://log.concept2.com/oauth/authorize with your client_id, explicit scopes such as user:read,results:read, response_type=code and your redirect_uri."
      },
      {
        "name": "Exchange the code for tokens",
        "text": "POST the code with your client ID, secret, redirect_uri and the same scopes to /oauth/access_token. Store the seven-day access token and the refresh token."
      },
      {
        "name": "Read results",
        "text": "Call GET /api/users/me/results with the Accept header for version 1, page through the meta.pagination block, and use updated_after for incremental syncs."
      },
      {
        "name": "Register the webhook",
        "text": "In the developer portal, register a webhook and handle result-added, result-updated and result-deleted events for users who authorized your client."
      },
      {
        "name": "Get write access approved",
        "text": "If your app writes results, finish it against log-dev.concept2.com and contact Concept2 at ranking@concept2.com for validation before using the live API."
      }
    ],
    "sources": [
      {
        "url": "https://log.concept2.com/developers/home",
        "checked": "2026-10-17",
        "note": "API keys, write apps on log-dev, validation before going live"
      },
      {
        "url": "https://log.concept2.com/developers/documentation/",
        "checked": "2026-10-17",
        "note": "URLs, versioning, rate limiting, pagination, errors, OAuth grants, scopes, tokens, users, results, webhook"
      }
    ]
  }
];
