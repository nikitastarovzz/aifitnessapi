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
    "metaTitle": "How to Integrate the Strava API (2026): Rotating Tokens",
    "metaDescription": "Integrate the Strava API: OAuth 2.0 setup, token exchange, fetching athlete activities, rotating refresh tokens, and the Events API webhook handshake.",
    "updated": "2026-07-09",
    "answer": "The Strava API gives you an athlete's activities — runs, rides, and other workouts with GPS routes, distance, pace, time, elevation, and heart rate — plus profile and segment data. Authentication is OAuth 2.0 Authorization Code: you send the athlete to Strava to approve scopes, exchange the returned code for a short-lived access token, and call the v3 REST API with a Bearer token. Access tokens last about 6 hours and refresh tokens rotate on every refresh, so persist the newest one. Subscribe to the Events API webhook for near-real-time activity updates instead of polling.",
    "body": "Strava is the natural integration for a social running or cycling app, where athletes already record activities and expect them to sync. If you are building that kind of product, this pairs well with the wider [wearable data APIs](/fitness-apis/wearable-data-apis) layer and the app-shape decisions in [how to build a running app](/build/running-app). Strava's access requirements, and every page on this site that covers it, are collected in the [Strava API overview](/apis/strava).\n\n> **Verify before you ship.** Endpoints, scopes, token lifetimes, and rate limits below are accurate as of 2026, but Strava changes them. Confirm the current values in the official Strava developer docs (`developers.strava.com`) before you go to production, and treat the exact per-app rate quotas as defaults that can vary.\n\n## What you'll need\n\n- A Strava account, and a registered API application (this gives you a **Client ID** and **Client Secret**).\n- An **Authorization Callback Domain** registered on the app — Strava validates that your `redirect_uri` lives under this domain.\n- A server-side place to hold the Client Secret and to store each athlete's rotating refresh token. Never ship the secret in a mobile or browser client.\n- For webhooks: a publicly reachable HTTPS callback URL that can answer a validation handshake within 2 seconds.\n\n## Step 1: Register your Strava API application\n\nCreate an application at `https://www.strava.com/settings/api`. Strava issues a **Client ID** and **Client Secret**, and asks for an **Authorization Callback Domain**. Only the domain is registered — the full `redirect_uri` you pass at authorize time must be a URL under that domain (for example, registering `yourapp.example.com` allows `https://yourapp.example.com/exchange_token`).\n\nDecide your scopes up front. The ones most integrations need:\n\n| Scope | Grants |\n|---|---|\n| `read` | Public profile info |\n| `activity:read` | Activities visible to Everyone or Followers |\n| `activity:read_all` | All activities, including private \"Only You\" activities |\n| `activity:write` | Create or update activities |\n\nRequest the least you need. To read an athlete's full activity history including private activities — and to receive webhook events for those private activities — you need `activity:read_all`. Plain `activity:read` only ever sees activities the athlete has shared beyond \"Only You\".\n\n## Step 2: Send the athlete through the OAuth authorize screen\n\nRedirect the athlete to Strava's authorize endpoint. Multiple scopes are **comma-separated** (not space-separated as in most OAuth providers):\n\n```\nhttps://www.strava.com/oauth/authorize\n  ?client_id=CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/exchange_token\n  &response_type=code\n  &approval_prompt=auto\n  &scope=read,activity:read_all\n```\n\n`approval_prompt=auto` skips the consent screen if the athlete has already granted these scopes; use `force` to always show it. On approval, Strava redirects back to your `redirect_uri` with a one-time `code` and the scopes actually granted:\n\n```\nhttps://yourapp.example.com/exchange_token?code=AUTH_CODE&scope=read,activity:read_all&state=...\n```\n\nAlways read the returned `scope` parameter and confirm it contains what you need — the athlete can deselect scopes on the consent screen, so a granted set narrower than what you requested is normal and you must handle it.\n\n## Step 3: Exchange the code for tokens\n\nTrade the authorization code for an access token from your server, where the Client Secret is safe:\n\n```bash\ncurl -X POST \"https://www.strava.com/oauth/token\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"client_secret=CLIENT_SECRET\" \\\n  -d \"code=AUTH_CODE\" \\\n  -d \"grant_type=authorization_code\"\n```\n\nThe response carries the access token, a refresh token, and expiry:\n\n```json\n{\n  \"token_type\": \"Bearer\",\n  \"expires_at\": 1752091200,\n  \"expires_in\": 21600,\n  \"refresh_token\": \"e5n567...\",\n  \"access_token\": \"a4b945...\",\n  \"athlete\": { \"id\": 12345, \"username\": \"...\" }\n}\n```\n\nAccess tokens are short-lived: they expire **6 hours after creation** (`expires_in` of 21600 seconds, as of 2026 — verify the current value). Store `expires_at` alongside the tokens so you know when to refresh. Note that the OAuth token exchange and refresh calls do **not** count against your API rate limit.\n\n## Step 4: Fetch the athlete's activities\n\nCall the v3 REST API with the access token in an `Authorization: Bearer` header. To list the authenticated athlete's activities, newest first:\n\n```bash\ncurl -X GET \"https://www.strava.com/api/v3/athlete/activities?per_page=30&page=1\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nUseful query parameters: `before` and `after` (epoch seconds) to window the results, plus `page` and `per_page` (default 30, up to 200 per page) to paginate. To read the athlete's own profile:\n\n```bash\ncurl -X GET \"https://www.strava.com/api/v3/athlete\" \\\n  -H \"Authorization: Bearer ACCESS_TOKEN\"\n```\n\nRemember that without `activity:read_all`, this listing omits the athlete's private \"Only You\" activities.\n\n## Step 5: Refresh the rotating tokens\n\nWhen an access token is near or past `expires_at`, exchange the stored refresh token for a new access token:\n\n```bash\ncurl -X POST \"https://www.strava.com/oauth/token\" \\\n  -d \"client_id=CLIENT_ID\" \\\n  -d \"client_secret=CLIENT_SECRET\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=REFRESH_TOKEN\"\n```\n\nStrava uses **rotating refresh tokens**: each refresh returns a **new access token AND a new refresh token**. You must persist the newest refresh token and discard the old one — if you keep reusing a stale refresh token, subsequent refreshes will fail and you will have to send the athlete back through consent. Store the refresh token per athlete and update it on every refresh.\n\n## Step 6: Subscribe to the Events API webhook\n\nPolling burns your rate limit. Instead, subscribe once (only **one subscription is allowed per application**) so Strava pushes events when an athlete creates, updates, or deletes an activity:\n\n```bash\ncurl -X POST \"https://www.strava.com/api/v3/push_subscriptions\" \\\n  -F client_id=CLIENT_ID \\\n  -F client_secret=CLIENT_SECRET \\\n  -F callback_url=https://yourapp.example.com/webhook \\\n  -F verify_token=YOUR_VERIFY_TOKEN\n```\n\nImmediately after this POST, Strava sends a **GET** to your `callback_url` to validate it:\n\n```\nGET https://yourapp.example.com/webhook\n    ?hub.mode=subscribe\n    &hub.verify_token=YOUR_VERIFY_TOKEN\n    &hub.challenge=15f7d1a91c1f40f8a748fd134752feb3\n```\n\nYour endpoint must confirm `hub.verify_token` matches what you sent, then respond **within 2 seconds** with HTTP **200**, `Content-Type: application/json`, echoing the challenge back exactly:\n\n```json\n{\"hub.challenge\":\"15f7d1a91c1f40f8a748fd134752feb3\"}\n```\n\nIf the handshake times out or the echoed challenge does not match, the subscription is not created. Once it is live, Strava POSTs an event to the same URL whenever something changes:\n\n```json\n{\n  \"aspect_type\": \"create\",\n  \"event_time\": 1752091200,\n  \"object_id\": 987654321,\n  \"object_type\": \"activity\",\n  \"owner_id\": 12345,\n  \"subscription_id\": 1234,\n  \"updates\": {}\n}\n```\n\nThe payload is a pointer, not the data — take the `owner_id` and `object_id` and call `GET /activities/{id}` (or the athlete's activity list) with that athlete's token to fetch the full record. `object_type` is `activity` or `athlete`, and `aspect_type` is `create`, `update`, or `delete`. Watch for an `athlete` update carrying `updates.authorized: \"false\"`, which signals the athlete **deauthorized** your app — clean up their stored tokens when you see it. To receive events for private activities, that athlete's token must have `activity:read_all`. Acknowledge every event POST with HTTP 200 within 2 seconds and do the actual fetching and processing asynchronously.\n\n## Gotchas and production notes\n\n- **Rate limits.** The application default is **200 requests per 15 minutes and 2,000 requests per day** (non-upload), as of 2026. Usage is reported in the `X-RateLimit-Limit` and `X-RateLimit-Usage` response headers (each a \"15-minute, daily\" pair); exceeding a limit returns **HTTP 429**. Read those headers and back off rather than hammering. [The cookbook's rate-limit-aware fetch wrapper](/cookbook/rate-limit-fetcher) is one tested way to do that, with a list where you add a provider's own header names. Higher limits require requesting an increase from Strava, and per-app quotas can vary — verify against the current docs.\n- **Rotating refresh tokens are the number-one integration bug.** If a background refresh and a user-triggered refresh race, or you forget to persist the new refresh token, athletes silently drop off. Serialize refreshes per athlete and always write back the newest token.\n- **Private activities need `activity:read_all`.** Both the REST listings and webhook events hide \"Only You\" activities without it. If athletes report \"missing\" runs, this scope is usually why.\n- **Keep the Client Secret server-side.** The token exchange, refresh, and subscription calls all require it, so run them from your backend, never from a mobile or browser client.\n- **Webhooks are pointers, and one per app.** Every event needs a follow-up API call to fetch the data, and you get a single subscription for the whole application — fan out to individual athletes on your side using `owner_id`.\n\nFor where Strava fits among the broader wearable and device integrations — and when an aggregator that collapses many providers behind one API is a better fit than integrating each directly — see [wearable data APIs](/fitness-apis/wearable-data-apis). For the surrounding product build, see [how to build a running app](/build/running-app).",
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
    "metaTitle": "How to Integrate the Garmin API (2026): Approval First",
    "metaDescription": "Integrate Garmin: partner approval, OAuth 2.0 PKCE, the per-user userAccessToken, and the push/ping webhook model. Gated docs, hedged for 2026.",
    "updated": "2026-07-09",
    "answer": "The Garmin API delivers deep wearable data: all-day wellness metrics (heart rate, steps, sleep, stress, Pulse Ox) through the Health API and per-activity data across 100-plus sports through the Activity API. It uses OAuth 2.0 with PKCE to obtain a per-user userAccessToken, and it pushes data to callback URLs you register instead of letting you poll. The big catch is access: the Connect Developer Program is partner-approval-only, not self-serve, and new sign-ups are reportedly on hold as of 2026, so the first real step is to apply and wait. Because Garmin's docs are gated, treat every host, scope, and endpoint as verify-against-current-partner-docs.",
    "body": "## Read this before you plan a Garmin build\n\nGarmin is not a self-serve API. The **Garmin Connect Developer Program** is **partner-approval-only**: you apply, and Garmin's team must approve a partnership before you receive any API credentials. There is no sign-up-and-ship path. The [Garmin API overview](/apis/garmin) tracks that gate alongside every page on this site that covers Garmin. One naming trap: Connect IQ, Garmin's platform for apps that run on the watch itself, is a different product from the Health and Activity APIs covered here; [Connect IQ vs the Health and Activity APIs](/fitness-apis/garmin-connect-iq-vs-health-api) explains the split. If all you need is your own account's data rather than other users', the unofficial Python clients are compared in [garminconnect vs garth](/libraries/compare/garminconnect-vs-garth).\n\nMore important for 2026: **new sign-ups are reportedly on hold**. As of this writing, the public access-request form has been removed, community and issue-tracker reports describe the program as \"on hold\" for new applicants for several months, and there is no published re-open ETA. Existing approved partners are said to keep working, but you may not be able to onboard as a fresh developer right now.\n\n**Verify current status directly on developer.garmin.com before committing to Garmin.** This is a factual access constraint, not a knock on the product — Garmin has the broadest health-metric breadth of any wearable API, but you need to confirm you can actually get approved first. If approval is blocked, weigh the alternatives in [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) and the broader survey in [wearable data APIs](/fitness-apis/wearable-data-apis) — including aggregators that resell Garmin access under their own partnership.\n\nBecause Garmin's developer docs are gated (most primary pages return HTTP 403 to anonymous fetches), every host, path, scope name, summary-type name, and token lifetime below is marked **verify against the current partner docs**. Do not hard-code any of these values from this page — read them from the spec Garmin gives you after approval.\n\n## What you'll need\n\n- **An approved Garmin Connect Developer Program partnership.** This is the gating step and, as noted, may be paused — start here, because nothing else works without it.\n- **Your issued API credentials** (a consumer/client identifier and secret, exact names per the current spec — verify).\n- **A public HTTPS server** to host your OAuth redirect URI and your webhook callback endpoints.\n- **Somewhere to store a per-user `userAccessToken`** mapped to your internal user ID.\n\n## Step 1: Apply to the Connect Developer Program (and wait)\n\nStart the partnership application on developer.garmin.com. Historically this meant submitting an access-request form describing your company and use case; as of 2026 that public form is reportedly removed, so check the program overview page for the current path and status. Treat this as an \"apply and wait\" step, not a self-serve registration — approval is a manual, partner-level decision with no guaranteed timeline, and new applications may currently be paused. Do not build against Garmin on the assumption you will be approved; confirm access first.\n\n## Step 2: Register your app and get credentials\n\nOnce approved, you register your application in the developer portal and receive your API credentials. During registration you configure your **OAuth redirect URI** and your **webhook callback URLs** — Garmin's model has you register a callback endpoint per summary type you want to receive (see Step 4). Note which of Garmin's programs you have been granted: the **Health API** (all-day wellness), the **Activity API** (per-activity sport data), and possibly others such as a Training or Women's Health API — availability and exact scopes are per your partnership agreement, so verify what you actually have access to.\n\n## Step 3: Authenticate each user with OAuth 2.0 PKCE\n\nCurrent Garmin docs specify **`OAuth 2.0` with PKCE** (Proof Key for Code Exchange). The shape is the standard authorization-code-with-PKCE flow: generate a code verifier and challenge, send the user to Garmin's authorize endpoint, and exchange the returned authorization code (plus your verifier) for tokens at the token endpoint.\n\n```http\nGET https://<garmin-authorize-host>/oauth2/authorize\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/garmin/callback\n  &code_challenge=GENERATED_CHALLENGE\n  &code_challenge_method=S256\n  &state=RANDOM_STATE\n```\n\nThe exact authorize and token host names, parameter names, and required scopes are in the gated **Garmin Connect Developer Program OAuth 2.0 PKCE Specification** — the host above is a placeholder, so **verify every URL against that spec**. A historical caveat worth knowing: Garmin's Health API predates OAuth 2.0, and older integrations (and some lingering third-party references) used **OAuth 1.0a**. If you find OAuth 1.0a instructions, confirm whether they apply to your program before following them — new builds should use the current PKCE flow (verify).\n\nThe token exchange returns a per-user **`userAccessToken`** — Garmin's identifier for that connected user. Store it mapped to your internal user ID; you will use it to authenticate the callbacks you fetch later. Public secondary sources cite an access-token lifetime of roughly three months, refreshable via a refresh token — treat the exact lifetime and refresh mechanics as **verify against the current spec**.\n\n## Step 4: Register push/ping webhooks (the key difference)\n\nThis is where Garmin differs architecturally from most wearable APIs: **you do not poll**. You register HTTPS callback URLs per summary type in the developer portal, and Garmin **POSTs data to you** when a user's device syncs. There are two delivery modes:\n\n- **Ping Service** — Garmin POSTs a lightweight *notification* saying new data exists. The payload includes a **`callbackURL`** that you then GET (authenticated with that user's OAuth token) to pull the actual summary. This keeps Garmin's POST small and lets you fetch on your own schedule.\n- **Push Service** — Garmin POSTs the **full updated data inline as JSON**, so there is no follow-up GET. Same data, delivered directly.\n\nBoth modes retry on failed delivery, so your endpoint must return quickly and handle duplicates idempotently. Choose Ping when you want to control fetch timing and load; choose Push for the lowest latency and one fewer round trip. Which summary types exist (dailies, sleeps, epochs, stress, Pulse Ox, and so on) and their exact names come from the Health/Activity API spec — **verify the summary-type names against the current docs** rather than trusting any list here.\n\n## Step 5: Receive and process the callbacks\n\nA Ping notification wraps arrays keyed by summary type; each record identifies the user and gives you the URL to fetch. The illustrative shape below is from public secondary docs — **the exact host, path, and fields are gated, so verify against the partner spec**:\n\n```json\n{\n  \"dailies\": [\n    {\n      \"userId\": \"4aacafe82427c251df9c9592d0c06768\",\n      \"userAccessToken\": \"8f57a6f1-26ba-4b05-a7cd-c6b525a4c7a2\",\n      \"uploadStartTimeInSeconds\": 1444937651,\n      \"uploadEndTimeInSeconds\": 1444937902,\n      \"callbackURL\": \"https://<garmin-api-host>/<gated-summary-path>?uploadStartTimeInSeconds=1444937651&uploadEndTimeInSeconds=1444937902\"\n    }\n  ]\n}\n```\n\nFor a **Ping**, look up your stored `userAccessToken` by `userId`, then GET the `callbackURL` with that user's OAuth authorization to retrieve the summary. For a **Push**, the same top-level envelope (for example a `\"dailies\"` array) carries the full metric fields inline instead of a `callbackURL` — you process it directly, no fetch needed. In both cases, key incoming records to your internal user by the Garmin `userId`/`userAccessToken`, acknowledge fast, and deduplicate on the upload time window.\n\n## Gotchas and production notes\n\n- **Approval is the whole game.** Everything above is moot until you are an approved partner, and new sign-ups may be paused as of 2026 — verify on developer.garmin.com before you plan a roadmap around Garmin.\n- **Nothing here is a stable public contract.** Hosts, paths, scopes, summary-type names, and token lifetimes are behind the partner NDA/docs and can change. Read them from the spec Garmin issues you, and do not copy the placeholders on this page into production.\n- **Webhooks, not polling.** Design your ingestion around receiving POSTs, retries, and out-of-order deliveries. Your callback endpoints must be publicly reachable over HTTPS, fast, and idempotent.\n- **Store tokens per user and plan for refresh.** Persist each `userAccessToken` (and refresh token) mapped to your user, and handle the roughly three-month expiry (verify) before it bites you in production.\n- **Consider an aggregator if approval is blocked.** If you cannot get into the program, a wearable-data aggregator that already holds a Garmin partnership can resell access through one integration — compare that path in [wearable data APIs](/fitness-apis/wearable-data-apis) and see how Garmin stacks up against the self-serve alternatives in [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api).",
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
    "metaTitle": "How to Integrate the Oura API (2026): 8 Scopes",
    "metaDescription": "Integrate Oura API v2: the OAuth 2.0 flow, scopes, a real usercollection request, plus the PAT deprecation and 10-user cap you must plan around.",
    "updated": "2026-07-09",
    "answer": "The Oura API v2 gives you a connected user's sleep, activity, readiness, heart rate, workouts, and SpO2 as daily summaries and time series over a REST base at https://api.ouraring.com/v2/. Auth is OAuth 2.0 Authorization Code: you send the user to Oura's consent screen, exchange the returned code for an access token, then call usercollection endpoints with a Bearer token. Two constraints shape the build: Personal Access Tokens were deprecated in December 2025, so new integrations must use OAuth only, and a freshly registered app can connect at most 10 users until Oura approves it. Registration is otherwise self-serve, so you can start building immediately.",
    "body": "Two things to internalize before you write code, because they shape your whole plan:\n\n- **Personal Access Tokens are deprecated (December 2025).** New PATs can no longer be created, and new integrations must use **OAuth 2.0 only**. If a tutorial tells you to paste a personal token, it is out of date; [Oura personal access tokens deprecated](/fix/oura-personal-access-token-deprecated) covers the switch if you followed one. (Previously issued PATs may still function during a transition period — verify against the current docs.) Scripting in Python? [oura-ring vs oura (python-ouraring)](/libraries/compare/oura-ring-vs-oura-python) compares the two clients and which one documents the OAuth2 flow.\n- **There is a 10-user cap until Oura approves your app.** A freshly registered app can connect at most **10 Oura users**. To go beyond that you must submit the app for Oura's review; after approval the limit is lifted. Plan for that approval step before any public launch.\n\nIf you are still choosing a provider or comparing device coverage, see our overview of [wearable data APIs](/fitness-apis/wearable-data-apis). Oura is often evaluated alongside recovery-focused bands — our [WHOOP API guide](/integrate/whoop-api) covers that neighboring integration. Oura's access requirements, and every page on this site that covers Oura, are collected in the [Oura API overview](/apis/oura).\n\n## What you'll need\n\n- An **Oura account** and an Oura Ring with an active membership on the test user's side (some data requires an active subscription).\n- An app registered in the **Oura developer portal**, which gives you a **`client_id`** and **`client_secret`**.\n- A registered **redirect URI** (your OAuth callback), served over HTTPS in production.\n- A server-side place to store tokens — you exchange the authorization code and store the access and refresh tokens on your backend, never in the client.\n\n## Step 1: Register your app and get credentials\n\nIn the Oura developer portal, create a new application. Set a name and one or more **redirect URIs** (these must match exactly at authorization time). Oura issues a **`client_id`** and a **`client_secret`** — treat the secret like a password and keep it server-side only.\n\nNote your app starts under the **10-user cap**. That is enough to build and test; request approval later when you are ready for more users.\n\n## Step 2: Send the user to the authorization URL\n\nRedirect the user to Oura's authorize endpoint with the scopes you need. As of 2026 there are **8 scopes** (verify the current set in the docs):\n\n| Scope | Grants |\n|---|---|\n| `email` | User's email address |\n| `personal` | Personal info (gender, age, height, weight) |\n| `daily` | Daily summaries — sleep, activity, readiness |\n| `heartrate` | Time-series heart rate (Gen 3+) |\n| `workout` | Auto-detected and user-entered workouts |\n| `tag` | User-entered tags |\n| `session` | Guided and unguided sessions in the Oura app |\n| `spo2` | Daily SpO2 average recorded during sleep |\n\nRequest only the scopes you actually use — the user can toggle individual scopes at the consent screen. Build the authorize URL against `https://cloud.ouraring.com/oauth/authorize`:\n\n```http\nGET https://cloud.ouraring.com/oauth/authorize\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.com/oauth/oura/callback\n  &scope=daily heartrate workout spo2\n  &state=RANDOM_ANTI_CSRF_STRING\n```\n\nGenerate `state` per request and verify it on the callback to defend against CSRF. After the user consents, Oura redirects to your `redirect_uri` with `?code=...&state=...`.\n\n## Step 3: Exchange the code for tokens\n\nOn your callback, verify `state`, then POST the `code` to the token endpoint `https://api.ouraring.com/oauth/token` to receive an access token and a refresh token:\n\n```bash\ncurl -s -X POST \"https://api.ouraring.com/oauth/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=AUTHORIZATION_CODE\" \\\n  -d \"redirect_uri=https://yourapp.com/oauth/oura/callback\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\"\n```\n\nThe response contains an `access_token`, a `refresh_token`, and a `token_type` of `Bearer`. Store both tokens on your backend, mapped to your internal user ID.\n\nHere is the same exchange in TypeScript:\n\n```ts\nconst res = await fetch(\"https://api.ouraring.com/oauth/token\", {\n  method: \"POST\",\n  headers: { \"Content-Type\": \"application/x-www-form-urlencoded\" },\n  body: new URLSearchParams({\n    grant_type: \"authorization_code\",\n    code,\n    redirect_uri: \"https://yourapp.com/oauth/oura/callback\",\n    client_id: process.env.OURA_CLIENT_ID!,\n    client_secret: process.env.OURA_CLIENT_SECRET!,\n  }),\n});\nconst { access_token, refresh_token } = await res.json();\n// persist both, keyed to your user\n```\n\n## Step 4: Fetch data from the usercollection endpoints\n\nAll data lives under the base `https://api.ouraring.com/v2/` at `usercollection/*` paths. List endpoints accept `start_date` and `end_date` (ISO dates); you can also fetch a single document by its `document_id`. Send the access token as a Bearer header:\n\n```bash\ncurl -s \\\n  -H \"Authorization: Bearer ${OURA_ACCESS_TOKEN}\" \\\n  \"https://api.ouraring.com/v2/usercollection/daily_activity?start_date=2026-07-01&end_date=2026-07-09\"\n```\n\nThe response wraps records in a `data` array with a `next_token` for pagination:\n\n```json\n{\n  \"data\": [\n    {\n      \"id\": \"…\",\n      \"day\": \"2026-07-08\",\n      \"score\": 82,\n      \"active_calories\": 512,\n      \"steps\": 9231\n    }\n  ],\n  \"next_token\": null\n}\n```\n\nCommonly used `usercollection` endpoints (confirm the exact set for your scopes at `https://api.ouraring.com/v2/docs`):\n\n| Endpoint | What it returns |\n|---|---|\n| `daily_activity` | Daily activity score, steps, calories |\n| `daily_sleep` | Daily sleep score and contributors |\n| `daily_readiness` | Daily readiness score |\n| `heartrate` | Time-series heart rate (Gen 3+) |\n| `workout` | Auto-detected and entered workouts |\n| `daily_spo2` | Daily average SpO2 during sleep |\n\nA `403` here usually means the token is missing the required scope, or the user's Oura subscription has lapsed — not a bad token.\n\n## Step 5: Paginate and refresh tokens\n\nFor a date range that returns more rows than one page, follow `next_token`: when it is non-null, repeat the request passing it back to Oura until it comes back `null`. When an access token expires, exchange the stored refresh token for a new pair:\n\n```bash\ncurl -s -X POST \"https://api.ouraring.com/oauth/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=STORED_REFRESH_TOKEN\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\"\n```\n\nPersist the newly returned tokens and retry the original request. Refresh on a `401`, or proactively before expiry.\n\n## Step 6: Request app approval before you scale\n\nOnce you are past testing, submit your app for Oura's review to lift the **10-user cap**. Until approval clears, the eleventh user's authorization will fail, so gate any public rollout on it. Approval is also where Oura checks how you use and store health data, so have your privacy handling ready.\n\n## Gotchas and production notes\n\n- **OAuth only.** PATs are deprecated (Dec 2025) and cannot be created for new integrations — build the OAuth flow from day one.\n- **The 10-user cap is real.** It blocks scale, not testing. Submit for approval well before launch; do not discover the cap in production.\n- **Scopes gate data, and a 403 is usually a scope or membership problem**, not an auth bug. Request the minimum scopes, and remember users can disable individual scopes at consent.\n- **Some metrics need hardware or a subscription.** Time-series heart rate needs a Gen 3 ring or newer, and certain data requires an active Oura membership.\n- **Store tokens server-side.** Do the code exchange and all refreshes on your backend; never ship the `client_secret` to a client.\n- **Verify volatile details.** Treat the exact scope list, endpoint set, and any PAT transition behavior as things to confirm against the live docs at `https://api.ouraring.com/v2/docs`, since Oura updates them.\n\nFor where Oura fits among recovery and sleep-tracking sources, and how to avoid integrating a dozen wearables one at a time, see our [wearable data APIs](/fitness-apis/wearable-data-apis) overview.",
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
    "h1": "WHOOP API Developer Integration Guide (2026)",
    "metaTitle": "WHOOP API Developer Integration Guide (2026): OAuth",
    "metaDescription": "Integrate WHOOP recovery, sleep, and workout data via OAuth 2.0: app registration, scopes, token exchange, sample requests, webhooks, and the member cap.",
    "updated": "2026-07-09",
    "answer": "The WHOOP API exposes a member's recovery, strain, sleep, and workout data through OAuth 2.0 consent, then REST pulls and webhooks against the api.prod.whoop.com base URL. You register an app in the WHOOP Developer Dashboard, run the authorization-code flow to get an access token for the scopes you need, and call the /v2 data endpoints with a Bearer token. Two access facts matter first: every user needs a paid WHOOP membership, and a new app is capped at 10 members until WHOOP approves it for production.",
    "body": "## Two things to know before you start\n\n- **Every user needs a paid WHOOP membership.** The developer platform and API are free, but WHOOP is hardware plus a subscription (One/Peak/Life). There is no WHOOP data without a device and an active membership — for you and for every end user. If your audience does not already own WHOOP, this is a hard blocker, not a detail.\n- **A new app is capped at 10 WHOOP members until it is approved.** Your app works immediately after registration, but it can only connect up to 10 members. To exceed 10 or ship to production you must submit the app through WHOOP's App Approval flow. Plan for that review before you promise anyone general availability. (Source: developer.whoop.com/docs/developing/app-approval — verify the current cap and process.)\n\nNeither of these is a knock on WHOOP; they are access requirements, and the [WHOOP API overview](/apis/whoop) tracks both alongside every page on this site that covers WHOOP. If you want a broader wearable strategy or an aggregator that fronts WHOOP alongside others, see [wearable data APIs](/fitness-apis/wearable-data-apis). WHOOP's OAuth flow is close to [Oura's](/integrate/oura-api), so if you have integrated one the other will feel familiar.\n\n## What you'll need\n\n- A WHOOP account and a device with an active membership (to test end to end).\n- An app registered in the **WHOOP Developer Dashboard** (developer.whoop.com), which gives you a **client ID** and **client secret**. The secret also verifies webhook signatures — treat it as a server-side secret.\n- One or more **redirect URIs** registered on the app.\n- At least one **scope** selected (an app must request at least one).\n- A backend to hold the client secret and do the token exchange. Never run the token exchange or store secrets in a mobile or browser client.\n\n## Step 1: Register your app in the Developer Dashboard\n\nIn the WHOOP Developer Dashboard, create an app and set:\n\n- **Redirect URI(s)** — where WHOOP sends the user back with an authorization `code`.\n- **Scopes** — the data your app can read (see Step 2).\n- **Webhook URL** (optional but recommended) — where WHOOP POSTs update events.\n\nOn save you receive a **client ID** and **client secret**. The app is live immediately but bound by the 10-member cap until approved.\n\n## Step 2: Choose your scopes\n\nRequest only what you use. As of 2026 the documented scopes are (verify the current list in the docs):\n\n| Scope | Grants read access to |\n|---|---|\n| `read:recovery` | Recovery scores (HRV, resting heart rate) |\n| `read:cycles` | Physiological cycles / strain |\n| `read:sleep` | Sleep activities |\n| `read:workout` | Workout activities |\n| `read:profile` | Basic member profile |\n| `read:body_measurement` | Height, weight, max heart rate |\n| `offline` | Required to receive a **refresh token** |\n\nInclude `offline` if your backend needs to keep syncing after the user closes the app — without it you get no refresh token.\n\n## Step 3: Send the user through the OAuth authorize flow\n\nRedirect the user to the authorize endpoint with your client ID, redirect URI, requested scopes, and a `state` value you generate and later verify (CSRF protection). This is the standard authorization-code grant.\n\n```http\nGET https://api.prod.whoop.com/oauth/oauth2/auth\n  ?client_id=YOUR_CLIENT_ID\n  &redirect_uri=YOUR_REDIRECT_URI\n  &response_type=code\n  &scope=read:recovery%20read:sleep%20read:workout%20offline\n  &state=RANDOM_STATE\n```\n\nThe user signs in and consents. WHOOP redirects back to your redirect URI with `?code=...&state=...`. Verify `state`, then move to the token exchange.\n\n## Step 4: Exchange the code for an access token\n\nFrom your backend, POST the authorization code to the token endpoint to get an `access_token` (and a `refresh_token` if you requested `offline`).\n\n```bash\n# Token exchange\ncurl -X POST \"https://api.prod.whoop.com/oauth/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=THE_AUTH_CODE\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\" \\\n  -d \"redirect_uri=YOUR_REDIRECT_URI\"\n```\n\nStore the `access_token` and `refresh_token` server-side, per user. Access tokens are short-lived; the refresh token lets you mint new ones (see Step 6).\n\n## Step 5: Call the data endpoints\n\nWith the access token in an `Authorization: Bearer` header, hit the v2 data endpoints under the `https://api.prod.whoop.com` base URL. The main ones (verify exact pluralization in the current docs):\n\n- `GET /v2/recovery` — recoveries, paginated\n- `GET /v2/activity/sleep` — sleeps\n- `GET /v2/activity/workout` — workouts\n- `GET /v2/cycle` — physiological cycles\n\n```bash\n# Sample: latest 10 sleeps\ncurl -X GET \"https://api.prod.whoop.com/v2/activity/sleep?limit=10\" \\\n  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"\n```\n\nResults are paginated (follow the pagination token the response returns), and note that v2 payloads identify records with **UUIDs**, not integer IDs.\n\n## Step 6: Refresh tokens and (recommended) subscribe to webhooks\n\n**Refresh:** when an access token expires, exchange the refresh token for a new one. Keep the `offline` scope so refresh keeps working (verify the exact refresh parameters — whether `scope=offline` must be re-sent — in the current docs).\n\n```bash\ncurl -X POST \"https://api.prod.whoop.com/oauth/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=THE_REFRESH_TOKEN\" \\\n  -d \"client_id=YOUR_CLIENT_ID\" \\\n  -d \"client_secret=YOUR_CLIENT_SECRET\" \\\n  -d \"scope=offline\"\n```\n\n**Webhooks:** instead of polling, register a webhook URL on your app. WHOOP POSTs when data changes. As of 2026 the v2 event types are `recovery.updated`, `sleep.updated`, and `workout.updated` (payloads reference records by UUID). Verify each POST before trusting it:\n\n- WHOOP sends an `X-WHOOP-Signature` header plus a timestamp header.\n- Recompute `base64( HMAC-SHA256( timestamp_header + raw_request_body, client_secret ) )` and compare to the signature header. Drop the request on any mismatch.\n\nImplement signature verification on day one — an unverified webhook endpoint is an open door.\n\n## Gotchas and production notes\n\n- **Membership is mandatory.** No paid WHOOP membership means no data. Confirm your users own WHOOP before you build.\n- **10-member cap until approval.** You cannot exceed 10 connected members until your app clears WHOOP's App Approval flow. Budget review time before launch.\n- **Rate limits.** Roughly **100 requests per minute** and **10,000 requests per day** per client (verify current limits). Responses carry `X-RateLimit-*` headers — read them and back off. Increases are available on request via WHOOP support.\n- **`offline` scope for refresh.** Forget it and you get no refresh token, so your background sync dies when the first access token expires.\n- **v2 uses UUIDs.** If you are porting from v1 integer IDs, update your storage and webhook routing.\n- **Keep the client secret server-side.** It signs webhook verification and exchanges tokens; never ship it in a client app.\n\nTreat rate limits, scope names, and endpoint pluralization as volatile — confirm them in the current WHOOP docs before you go to production. For a wider comparison of recovery and wearable providers, see [wearable data APIs](/fitness-apis/wearable-data-apis); to integrate a similar OAuth-based ring, see the [Oura API guide](/integrate/oura-api).",
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
    "metaTitle": "Terra Health Data API: Integrate via One Webhook (2026)",
    "metaDescription": "Integrate Terra once to read Garmin, Fitbit, Oura, Whoop, and 500+ wearables via one normalized webhook. Widget session, payloads, and signature checks.",
    "updated": "2026-07-09",
    "answer": "Terra is a health-data aggregator: you integrate once and it returns normalized data from Garmin, Fitbit, Oura, Whoop, Strava, Apple Health, and hundreds of other sources behind a single schema. You authenticate to Terra with a dev-id and x-api-key header, then mint a hosted widget session from your backend so the user picks and authorizes their own provider through Terra's Connect flow. Terra runs each provider's OAuth for you and POSTs normalized data to one webhook, which you verify with an HMAC-SHA256 signature. The key caveat: for some providers (Garmin, Whoop, Strava, Oura) you must still register your own developer credentials and give them to Terra.",
    "body": "The whole reason to use an aggregator, and the thing to hold onto: **one integration, many providers, delivered over one webhook.** You never write provider-specific parsing. For a broader look at where Terra sits among aggregators, see [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and the head-to-head [Terra vs Vital](/fitness-apis/terra-vs-vital) comparison; the [Terra API overview](/apis/terra) collects how you get access and every page on this site that covers Terra. This guide is also one step on [the reading path for supporting every wearable through one aggregator](/paths), which puts the pages for that job in working order.\n\n## One important caveat before you start\n\nTerra shields you from writing each provider's OAuth flow — but not always from each provider's paperwork. For several popular providers (commonly **Garmin, Whoop, Strava, and Oura**), you must still register your **own developer credentials** with that provider and hand them to Terra (Dashboard, then Connections, then the provider, then Edit). So \"one integration\" is completely true for your code and your data schema; you may still complete N provider registrations before those providers light up. Budget for that onboarding time up front. Verify the exact list of providers that need your own credentials in the current Terra docs, since it changes.\n\n## What you'll need\n\n- A **Terra account** (tryterra.co) with a project — this gives you a `dev-id` and an `x-api-key`.\n- A **Destination** configured in the Terra dashboard: the HTTPS **webhook URL** where Terra will POST auth events and normalized data.\n- A **backend** to call Terra's `/auth` endpoints. The API key must never be exposed client-side.\n- For providers that require it (Garmin, Whoop, Strava, Oura, and others), **your own developer credentials** with those providers, entered into the Terra dashboard.\n- Base URL for all API calls: `https://api.tryterra.co/v2/`. As of 2026, verify current endpoints and field names against docs.tryterra.co.\n\n## Step 1: Get your credentials and set up a Destination\n\nCreate a project in the Terra dashboard and copy your `dev-id` and `x-api-key`. Every API call to Terra sends both as headers:\n\n```http\ndev-id: YOUR_DEV_ID\nx-api-key: YOUR_API_KEY\n```\n\nThen configure a **Destination** — the webhook URL Terra will deliver events to (for example, `https://yourapp.com/terra/webhook`). This single endpoint is where every provider's data will arrive, normalized. Because everything funnels through here, you build and test one receiver, not one per wearable.\n\n## Step 2: Register your own credentials for the providers that need them\n\nSkip this step for providers Terra fully brokers. For **Garmin, Whoop, Strava, Oura** and any others flagged in the docs, go to the Terra dashboard, then Connections, select the provider, choose Edit, and paste in the client ID/secret you obtained from that provider's own developer program. Until you do this, those providers will not appear as authorizable options in your widget. This is the \"N registrations\" part of the caveat above — it is dashboard configuration, not code.\n\n## Step 3: Generate a widget session from your backend\n\nTo connect a user, your backend calls Terra's Connect endpoint to mint a hosted **widget session**. You pass the list of providers to offer, plus your own `reference_id` (your internal user ID) so you can correlate Terra's user back to your account.\n\n```bash\ncurl -X POST \"https://api.tryterra.co/v2/auth/generateWidgetSession\" \\\n  -H \"dev-id: YOUR_DEV_ID\" \\\n  -H \"x-api-key: YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"reference_id\": \"user-1234\",\n    \"providers\": \"GARMIN,FITBIT,OURA,WHOOP,STRAVA\",\n    \"language\": \"en\",\n    \"auth_success_redirect_url\": \"https://yourapp.com/success\",\n    \"auth_failure_redirect_url\": \"https://yourapp.com/failure\"\n  }'\n```\n\nThe response includes a `session_id`, a `url`, a `status`, and `expires_in` (the session is short-lived, roughly 900 seconds). Note how `providers` is just a comma-separated list — adding a new wearable to your product is a one-line change here, not a new integration.\n\n## Step 4: Send the user to the widget and handle the auth webhook\n\nOpen the returned `url` for the user (redirect, in-app browser, or webview). Terra hosts the whole flow: the user **picks their provider and authorizes it**, and Terra runs that provider's OAuth for you. On success the user is sent to your `auth_success_redirect_url`.\n\nThe authoritative signal, though, is the webhook. Terra fires an **`auth`** event to your Destination containing the Terra `user_id` and your `reference_id`. Store that `user_id` against your account — it is the key you'll use for every future data pull and the routing key on every incoming payload.\n\n## Step 5: Receive normalized data on your webhook\n\nFrom then on, Terra **pushes normalized data to your one webhook** as events. Every payload carries a `type` (`activity`, `sleep`, `daily`, `body`, `nutrition`, `menstruation`, `athlete`, and `auth`) and a `user` block with the `user_id`, your `reference_id`, and which `provider` it came from. The `data` array is the same shape regardless of whether it originated from Garmin, Whoop, or Oura.\n\n```json\n{\n  \"type\": \"activity\",\n  \"user\": {\n    \"user_id\": \"9d5dc9eb-3e02-4b37-9a7b-b14b5a5a2b93\",\n    \"reference_id\": \"user-1234\",\n    \"provider\": \"WHOOP\",\n    \"active\": true,\n    \"last_webhook_update\": \"2026-07-09T11:13:43.360227+00:00\"\n  },\n  \"data\": [ { \"metadata\": {} } ]\n}\n```\n\nRoute on `type` and `user.user_id`. Because the schema is identical across providers, you write one handler for `activity`, one for `sleep`, and so on — never a Garmin parser and a separate Whoop parser.\n\n## Step 6: Verify the webhook signature\n\nTerra signs every webhook so you can confirm it genuinely came from Terra. The request carries a `terra-signature` header in the form `t=<timestamp>,v1=<signature>`. Terra signs with **HMAC-SHA256**: recompute the signature over the timestamp plus the **raw request body** using your signing secret, then compare it to the `v1` value. Reject the request on mismatch, and read the raw body before any JSON parsing so the bytes match exactly.\n\n```js\nconst crypto = require(\"crypto\");\n\nfunction verifyTerraSignature(rawBody, header, secret) {\n  // header example: \"t=1720523623,v1=abc123...\"\n  const parts = Object.fromEntries(\n    header.split(\",\").map((kv) => kv.split(\"=\", 2)) // split once: values never contain \"=\"\n  );\n  if (!parts.t || !parts.v1) return false;\n  const signedPayload = `${parts.t}.${rawBody}`; // verify exact layout in current docs\n  const expected = crypto\n    .createHmac(\"sha256\", secret)\n    .update(signedPayload)\n    .digest(\"hex\");\n  const provided = Buffer.from(parts.v1);\n  const expectedBuf = Buffer.from(expected);\n  // Length check first: timingSafeEqual throws if the buffers differ in length,\n  // so a forged signature of the wrong length would otherwise crash the handler.\n  return (\n    provided.length === expectedBuf.length &&\n    crypto.timingSafeEqual(expectedBuf, provided)\n  );\n}\n```\n\nTerra's official SDKs expose a helper (`verify_terra_webhook_signature(...)`) that does this for you — prefer it, and verify the exact signed-string construction in the current docs, since the precise layout can differ.\n\n## Step 7: Pull historical data via REST (optional)\n\nWebhooks give you new data as it arrives, but on first connect you'll usually want backfill. Terra exposes REST endpoints per datatype — `/v2/activity`, `/v2/sleep`, `/v2/daily`, `/v2/body`, `/v2/athlete`, `/v2/nutrition`, `/v2/menstruation` — all keyed by the Terra `user_id` plus a date range.\n\n```bash\ncurl -X GET \"https://api.tryterra.co/v2/activity?user_id=USER_ID&start_date=2026-07-01&end_date=2026-07-08&to_webhook=false&with_samples=true\" \\\n  -H \"dev-id: YOUR_DEV_ID\" \\\n  -H \"x-api-key: YOUR_API_KEY\"\n```\n\nSet `to_webhook=true` to have a large historical pull delivered asynchronously to your Destination instead of in the response, and `with_samples=true` for granular sample-level data. Same base URL, same headers, same normalized schema as the webhooks.\n\n## Gotchas and production notes\n\n- **Register provider credentials early.** The most common launch surprise is Garmin/Whoop/Strava/Oura not appearing in the widget because you haven't yet supplied your own developer credentials in the dashboard. Start those provider registrations before you need them.\n- **Never expose the API key.** Call `/auth` endpoints and any data pulls only from your backend. The widget `url` is the only thing that ever reaches the client.\n- **Verify signatures on day one.** Terra webhooks are HMAC-SHA256 signed; implement `terra-signature` verification from the start rather than retrofitting it.\n- **Widget sessions are short-lived.** Generate one per connection attempt (roughly 900 seconds); don't cache and reuse them.\n- **Pricing is usage/credit-based — model it.** As of 2026, Terra is a subscription plus credit-based usage model; entry tier is reported around $399/mo billed annually (about $499 monthly) including roughly 100,000 credits/mo, with credits scaling on active authentications and events. All figures are volatile — confirm on tryterra.co/pricing before you budget.\n- **Aggregator, not magic.** Terra removes per-provider OAuth code and per-provider parsing; it does not remove per-provider app approval where the provider requires it. That trade — a little dashboard paperwork for one codebase across [many wearables](/fitness-apis/wearable-data-apis) — is exactly what you're buying.",
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
    "answer": "ExerciseDB provides a searchable exercise library where each entry includes a name, target muscle, body part, equipment, and an animated gifUrl demo. Auth is a simple API key: you subscribe on RapidAPI, then send your key plus the required host header on every request. Note the name is ambiguous, referring to both the commercial RapidAPI listing (host exercisedb.p.rapidapi.com) and the separate exercisedb.dev API, which uses different endpoint shapes and, as of October 12, 2026, has no code in its repository to self-host. This guide covers the RapidAPI listing.",
    "body": "## Heads up: \"ExerciseDB\" is two different things\n\nBefore you write any code, know that the name **ExerciseDB** is ambiguous and points at two separate products that even share the same media CDN:\n\n1. **The commercial RapidAPI listing** — host `exercisedb.p.rapidapi.com`, accessed with a RapidAPI key. This is what most tutorials (and this one) mean, and it is the fastest way to get running.\n2. **The separate `exercisedb.dev` API** — a hosted service. Its repository, `github.com/ExerciseDB/exercisedb-api`, held only a README and an AGPL-3.0 LICENSE file when we read it on October 12, 2026, so there is nothing in it to self-host. It exposes its **own** endpoint shapes, which do **not** match the RapidAPI paths below.\n\nPick one and code strictly to its docs. Do not assume a path from one works on the other. This guide covers the RapidAPI listing; the section near the end explains what exercisedb.dev offers instead. For a wider comparison of options, see our [exercise database APIs](/fitness-apis/exercise-database-apis) roundup; every page on this site that covers ExerciseDB is listed in the [ExerciseDB API overview](/apis/exercisedb).\n\n## What you'll need\n\n- A **RapidAPI account** (free to create).\n- A **subscription to the ExerciseDB listing** on RapidAPI — even the free tier requires subscribing so your key is authorized for the API.\n- Your **RapidAPI key**, which RapidAPI issues per account and shows on the listing's endpoint page.\n\nThat is the whole checklist. No app-approval step, no partner program.\n\n## Step 1: Subscribe on RapidAPI and copy your key\n\nSign in to RapidAPI, open the ExerciseDB listing, and subscribe to a plan (a free tier exists but is small — see the pricing note below). Once subscribed, the listing's \"Endpoints\" tab shows your `X-RapidAPI-Key` value. Every request you make will carry two headers:\n\n- `X-RapidAPI-Key: YOUR_RAPIDAPI_KEY`\n- `X-RapidAPI-Host: exercisedb.p.rapidapi.com`\n\nThe host header is required by RapidAPI on every proxied call — omitting it returns an error even when the key is valid.\n\n## Step 2: Make your first request\n\nFetch exercises for a body part. The `bodyPart` path segment accepts values like `back`, `chest`, `legs`, and so on:\n\n```bash\ncurl -X GET 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back?limit=10&offset=0' \\\n  -H 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY' \\\n  -H 'X-RapidAPI-Host: exercisedb.p.rapidapi.com'\n```\n\nThe same in JavaScript with `fetch`:\n\n```js\nconst res = await fetch(\n  'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back?limit=10&offset=0',\n  {\n    method: 'GET',\n    headers: {\n      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,\n      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',\n    },\n  }\n);\nconst exercises = await res.json();\n```\n\nEach exercise object returns these fields:\n\n| Field | Description |\n|---|---|\n| `id` | Stable identifier for the exercise |\n| `name` | Exercise name |\n| `bodyPart` | Broad body region (e.g. `back`) |\n| `target` | Primary target muscle (e.g. `lats`) |\n| `equipment` | Required equipment (e.g. `cable`) |\n| `gifUrl` | Animated demo, e.g. `https://static.exercisedb.dev/media/EIeI8Vf.gif` |\n\nNewer versions of the listing may also include `secondaryMuscles` and `instructions` arrays — verify against the current listing before relying on them.\n\n## Step 3: Query by the axis your app needs\n\nThe listing exposes a small, predictable set of endpoints. The three you will use most:\n\n| Purpose | Method + path |\n|---|---|\n| All exercises | `GET /exercises` |\n| By body part | `GET /exercises/bodyPart/{bodyPart}` |\n| By target muscle | `GET /exercises/target/{target}` |\n\nFor example, pull every exercise that targets a specific muscle:\n\n```bash\ncurl -X GET 'https://exercisedb.p.rapidapi.com/exercises/target/biceps?limit=10&offset=0' \\\n  -H 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY' \\\n  -H 'X-RapidAPI-Host: exercisedb.p.rapidapi.com'\n```\n\n`GET /exercises` and the filtered endpoints accept `limit` and `offset` pagination params — verify the current defaults and maximums on the listing, since a bare `GET /exercises` can otherwise return a large payload. The listing also documents additional filter and list endpoints (by equipment, by name, by id, and list-of-values helpers like body parts and targets); confirm their exact paths on the current listing before wiring them in, as they have varied across versions.\n\n## Step 4: Cache the catalog and display the GIFs\n\nExerciseDB data is a reference catalog — it changes rarely — so treat it that way:\n\n- **Cache aggressively.** Fetch once, store the exercises in your own database, and refresh on a schedule rather than calling the API on every user request. This is the single biggest lever on both latency and your rate-limit budget.\n- **Serve `gifUrl` through your own layer** (proxy or re-host where the license allows) so a change to the upstream CDN does not break your UI.\n- **Key your local records on `id`** so you can map favorites, workout plans, and history to a stable reference.\n\nWith the catalog cached, wiring it into a workout builder is straightforward — see our guide to building a [strength-training app](/build/strength-training-app) for how the exercise catalog, sets/reps, and progression fit together.\n\n## The other ExerciseDB: exercisedb.dev\n\nIf the RapidAPI free tier is too small, exercisedb.dev is the other API carrying the ExerciseDB name, but it is not a self-hosting route:\n\n- Repo: [github.com/ExerciseDB/exercisedb-api](https://github.com/ExerciseDB/exercisedb-api). When we read it on October 12, 2026 it contained two files, a README and an **AGPL-3.0** LICENSE, in a history that starts on November 25, 2025. There is no API code to run.\n- Advertises 11,000+ exercises with videos, images, and GIFs — verify the current count.\n- The README presents a hosted API instead: it links pricing plans and separate terms of use (behind links our environment cannot reach) and labels its v2 playground \"for exploration only and not recommended for production integration\".\n- Its endpoint shapes differ from the RapidAPI paths above.\n\nThe trade-off: you rent the data on its plans, whose prices and limits we could not read, rather than hosting anything yourself. If self-hosting is the goal, wger is the open option; see [ExerciseDB alternatives](/alternatives/exercisedb-alternatives).\n\n## Gotchas and production notes\n\n- **Free tier is tiny.** The free RapidAPI plan has been reported at roughly ~10 requests/day — enough to prototype, not to run in production. Exact tier names, monthly caps, and per-second limits change on the listing, so verify against the current RapidAPI pricing page and plan around caching.\n- **Both headers are mandatory.** Missing or wrong `X-RapidAPI-Host` fails the request even with a valid key.\n- **Don't mix the two ExerciseDBs.** RapidAPI paths will not work against the `exercisedb.dev` API, and vice versa.\n- **Keep your key server-side.** Never ship `X-RapidAPI-Key` in client-side web code; proxy requests through your backend.\n- **Field list can drift.** Treat `secondaryMuscles`/`instructions` and the extra filter endpoints as \"verify against current docs\" rather than guaranteed.\n\nFor where ExerciseDB fits among other catalog and movement-data providers, see our [exercise database APIs](/fitness-apis/exercise-database-apis) comparison.",
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
        "a": "The name refers to two products: the commercial RapidAPI listing at host exercisedb.p.rapidapi.com, and the separate exercisedb.dev API, a hosted service with its own paid plans whose repository, as of October 12, 2026, holds only a README and an AGPL-3.0 license file. They share a media CDN but expose different endpoint shapes, so code to one set of docs and do not mix the paths."
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
        "name": "Know the other ExerciseDB",
        "text": "If the RapidAPI free tier is too small, the separate exercisedb.dev API is a hosted alternative on its own paid plans with different endpoint shapes; its repository has no code to self-host, so look at wger if you need to run it yourself."
      }
    ]
  },
  {
    "slug": "polar-api",
    "primaryQuery": "how to integrate the Polar API",
    "h1": "How to Integrate the Polar API (2026)",
    "metaTitle": "How to Integrate the Polar API (2026): AccessLink v3",
    "metaDescription": "Integrate Polar Open AccessLink v3: self-serve client setup, the OAuth code flow, the mandatory user registration, and the transaction pull model.",
    "updated": "2026-08-12",
    "answer": "Polar's cloud API is Open AccessLink v3, and registration is self-serve: you create an API client at the AccessLink admin portal with a Polar Flow account and receive a client ID and secret immediately, with no partner-approval gate. Authentication is an OAuth 2.0 authorization-code redirect through flow.polar.com, with the token exchange on a separate host authenticated by HTTP Basic; the authorization code is only valid for 10 minutes, and the response returns both an access token and a Polar user ID. One step is easy to miss: after authorization you must register the user with a POST to the users endpoint before any data is readable, and a 409 there simply means they are already registered. Exercises, activity summaries, and physical information are then pulled through transactions that discard the data once you commit them, and only data synced after linking is available, so poll regularly or lose history.",
    "faqs": [
      {
        "q": "Is the Polar AccessLink API self-serve or does it need partner approval?",
        "a": "Self-serve. Polar's official example repository documents creating an API client yourself at the AccessLink admin portal by signing in with a Polar Flow account, which issues a client ID and secret straight away. There is no application or partner-approval step in the documented flow, which makes Polar one of the lowest-friction wearable integrations to start. You do need to register at least one authorization redirect URL on the client, and the example warns that a mismatched callback URL is the most common reason integrations fail."
      },
      {
        "q": "What are the Polar AccessLink OAuth and API base URLs?",
        "a": "Three different hosts do three different jobs, per Polar's own example client. Users authorize at flow.polar.com/oauth2/authorization, the authorization code is exchanged for a token at polarremote.com/v2/oauth2/token, and data is served from www.polaraccesslink.com/v3. The token exchange authenticates with HTTP Basic using your client ID and secret rather than putting them in the form body, and it must happen quickly because the example states the authorization code is only valid for 10 minutes."
      },
      {
        "q": "What is a transaction in the Polar AccessLink API?",
        "a": "A transaction is a snapshot of newly available data that you open, read, and then commit. You POST to a per-user transaction endpoint for exercises, activity summaries, or physical information; a successful open returns a resource URI, and an empty response means nothing new is waiting. You then GET the transaction for a list of resource URLs, fetch each one, and finally PUT the transaction URL to commit. Committing matters because Polar's transactional endpoints discard the data once it has been fetched, so persist everything before you commit."
      },
      {
        "q": "Why can I only see recent Polar data and not a user's full history?",
        "a": "Because AccessLink exposes only recent data rather than a user's archive. Polar's example README describes the data flow as beginning once the user has linked their account and synchronized their device to Polar Flow, and a long-standing open issue on that same repository reports that only data synced after the authorization date can be retrieved. Plan for no backfill: sync on a regular schedule, store everything you pull, and tell users that connecting Polar starts their history rather than importing it."
      },
      {
        "q": "Does Polar AccessLink support webhooks or publish rate limits?",
        "a": "Neither is documented in the sources we could reach. Polar's official example integration is pull-only, built around a notifications endpoint, transactions, and commits, and it contains no webhook registration, no retry logic, and no 429 handling. Polar's hosted reference site was unreachable from our fetch environment, so treat push callbacks, rate limits, and token lifetimes as open questions to verify against the live documentation. Until you confirm otherwise, design for scheduled polling on a conservative interval."
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
      "pitch": "We read the primary sources for every wearable integration we cover — including the example code providers publish and the gaps their docs leave behind. Get the weekly rundown."
    },
    "steps": [
      {
        "name": "Create an API client",
        "text": "Sign in to the AccessLink admin portal with your Polar Flow account and create an API client. Register your authorization redirect URL exactly as your app will send it, then copy the issued client ID and secret into server-side configuration."
      },
      {
        "name": "Send the user through Polar Flow",
        "text": "Redirect the user to Polar's authorization endpoint on flow.polar.com with response_type=code, your client ID, and your redirect URI. Add your own random state value and verify it on the callback, because the official example omits it."
      },
      {
        "name": "Exchange the code for a token",
        "text": "POST the authorization code to the token host within 10 minutes, authenticating with HTTP Basic using your client ID and secret. Store the returned access token and the Polar user ID against your internal user record."
      },
      {
        "name": "Register the user with your client",
        "text": "POST to the users endpoint with the user's bearer token and your own member identifier. This step is mandatory before any data is readable, and a 409 Conflict simply means the user is already registered and can be ignored."
      },
      {
        "name": "Check notifications and open a transaction",
        "text": "Call the notifications endpoint with your client credentials to see which users have exercise, activity summary, or physical information data waiting. For each type, POST to the matching per-user transaction endpoint; an empty response means nothing new."
      },
      {
        "name": "Read the resources, then commit",
        "text": "GET the transaction for its list of resource URLs, fetch each summary and any sub-resources you need, and persist everything. Only then PUT the transaction URL to commit, because committing discards that data on Polar's side."
      }
    ],
    "body": "Polar's cloud API is called **Open AccessLink**, and the fastest way to learn it is to read the code Polar publishes. This page is built from Polar's official `accesslink-example-python` repository on GitHub — README, OAuth wrapper, endpoint modules — fetched and read directly. Every host, path, and payload field below appears in that source.\n\n> **Sourcing note.** Polar's hosted reference at polar.com/accesslink-api is unreachable from our fetch environment (blocked at the egress layer), so this page is limited to what the official example repository contains. Anything it does not cover — webhooks, rate limits, token lifetimes, retention windows — is marked **not documented in the sources we could reach**. Verify those against Polar's live docs.\n\nStill choosing a provider? That belongs to our [wearable data APIs](/fitness-apis/wearable-data-apis) roundup; this page assumes the decision is made. Every page on this site that covers Polar is collected in the [Polar API overview](/apis/polar).\n\n## What you'll need\n\n- A **Polar Flow account** — the same consumer account your users have. You sign into the developer portal with it.\n- An **API client** created at the AccessLink admin portal, which issues a client ID and a client secret.\n- At least one registered **authorization redirect URL**. The README warns that a wrong callback URL is the most common reason the examples fail, and notes you can add or edit redirect URLs later as long as the right one is the default.\n- A **server-side token store**. The example writes tokens to a local YAML file; in production, a database row keyed to your internal user.\n\nThere is no partner-approval gate in the documented flow — you create the client yourself and start immediately.\n\n## Three hosts, two data families\n\nAccessLink v3 has three constants, taken straight from the example's client class:\n\n```python\nAUTHORIZATION_URL = \"https://flow.polar.com/oauth2/authorization\"\nACCESS_TOKEN_URL  = \"https://polarremote.com/v2/oauth2/token\"\nACCESSLINK_URL    = \"https://www.polaraccesslink.com/v3\"\n```\n\nThree hosts for three jobs: the Flow domain authorizes, a separate host mints tokens, the AccessLink host serves data. Teams assuming one base URL trip on this immediately.\n\nThere are then **two families of data endpoint**, and the split drives your whole ingestion design. The README states it plainly: transactional endpoints \"discard the data after it has been fetched,\" while non-transactional endpoints \"do not discard the data after it has been fetched.\" Exercises appear in both. Sleep and Nightly Recharge are documented in the example only as non-transactional; activity summaries and physical information only as transactional.\n\n## Step 1: Create an API client\n\nSign in at the AccessLink admin portal with your Polar Flow credentials and create a client. Set your authorization redirect URL — the example uses a localhost callback on port 5000 at the path `/oauth2_callback`, and stresses that the value must match exactly. Copy the client ID and secret into server-side config; the secret must never ship to a client.\n\n## Step 2: Send the user through Polar Flow\n\nThe authorization request is an ordinary authorization-code redirect. Per the README it is as short as this:\n\n```http\nGET https://flow.polar.com/oauth2/authorization\n  ?response_type=code\n  &client_id=YOUR_CLIENT_ID\n  &redirect_uri=https://yourapp.example.com/oauth2_callback\n```\n\nThose three parameters are all the example's URL builder sends. Two absences matter:\n\n- **No scope parameter anywhere in the example.** Unlike the eight toggleable scopes on an [Oura integration](/integrate/oura-api), there is nothing here to narrow. Whether AccessLink supports scoping at all is not documented in the sources we could reach — verify.\n- **No `state` parameter either.** The official sample omits it. That is a sample-app simplification, not a recommendation: generate a random state per request and check it on the callback, as you would in any [OAuth flow for health data](/learn/what-is-oauth-for-health-data).\n\nIf the user is not signed in, Polar Flow shows a login page; on consent the browser returns to your callback with a code.\n\n## Step 3: Exchange the code for a token, fast\n\nTwo details catch people out.\n\nFirst, **the code is short-lived**. A comment in both sample apps states that \"the authorization code is only valid for 10 minutes, so the access token should be fetched immediately after the authorization step.\" Do not queue the exchange behind a background job.\n\nSecond, **the token request authenticates with HTTP Basic**, not with credentials in the form body. The wrapper attaches Basic auth from the client ID and secret whenever no user token is present:\n\n```bash\ncurl -s -X POST \"https://polarremote.com/v2/oauth2/token\" \\\n  -u \"YOUR_CLIENT_ID:YOUR_CLIENT_SECRET\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -H \"Accept: application/json;charset=UTF-8\" \\\n  -d \"grant_type=authorization_code\" \\\n  -d \"code=AUTHORIZATION_CODE\" \\\n  -d \"redirect_uri=https://yourapp.example.com/oauth2_callback\"\n```\n\nThe response carries two fields the example consumes: `access_token` and `x_user_id`, Polar's identifier for that user, needed in nearly every later path. Store both against your internal user ID.\n\nNote what the example does **not** do: it never reads an expiry, never stores a refresh token, and has no refresh logic. That is consistent with Polar's long-lived tokens, but the actual lifetime and whether a refresh grant exists are not documented in the sources we could reach — verify, and handle a 401 by re-running authorization.\n\n## Step 4: Register the user (the step everyone forgets)\n\nAuthorization alone does not give you data. The example's users resource is explicit: \"Once partner has been authorized by user, partner must register user before being able to access her data.\" POST to the users collection with **the user's** bearer token, carrying your own identifier for them:\n\n```bash\ncurl -s -X POST \"https://www.polaraccesslink.com/v3/users\" \\\n  -H \"Authorization: Bearer USER_ACCESS_TOKEN\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"member-id\": \"your-internal-user-id\"}'\n```\n\nThe field name is hyphenated — `member-id`. Both sample apps wrap this call with one specific carve-out: HTTP **409 Conflict means the user is already registered for this client** and can be ignored. Treat registration as idempotent, swallow the 409, and treat anything else as real.\n\nDe-registration is a DELETE on the user path; its docstring notes it \"will revoke the access token authorized by user,\" so it doubles as your disconnect action. Reading a user's basic profile is a GET on that same path.\n\n## Step 5: Ask what's available, then open a transaction\n\nFor transactional data you do not fetch a date range. You ask whether anything is waiting, then open a transaction that snapshots it.\n\nThe availability check is **client-level**: the example passes no user token, so it falls through to Basic auth and returns pending data across your users.\n\n```bash\ncurl -s \"https://www.polaraccesslink.com/v3/notifications\" \\\n  -u \"YOUR_CLIENT_ID:YOUR_CLIENT_SECRET\"\n```\n\nThe console app iterates the response's `available-user-data` array and branches on each item's `data-type`, handling three values:\n\n| Data type | Open a transaction with |\n|---|---|\n| `EXERCISE` | POST to the user's `exercise-transactions` path |\n| `ACTIVITY_SUMMARY` | POST to the user's `activity-transactions` path |\n| `PHYSICAL_INFORMATION` | POST to the user's `physical-information-transactions` path |\n\n```bash\ncurl -s -X POST \\\n  \"https://www.polaraccesslink.com/v3/users/USER_ID/exercise-transactions\" \\\n  -H \"Authorization: Bearer USER_ACCESS_TOKEN\"\n```\n\nA successful open returns a **`resource-uri`** — the transaction's own URL, used for everything that follows. An **empty response means nothing is new**: the example's HTTP layer turns a 204 into an empty object and the transaction factory returns nothing, which the console app prints as \"No new exercises available.\" Code that as a normal, frequent outcome, not an error.\n\n## Step 6: Read the resources, then commit\n\nGET the transaction URL for a list of resource URLs. The list key differs per type: exercises come back under `exercises`, daily activity under `activity-log`, physical information under `physical-informations`.\n\nThen GET each resource URL for its summary, plus any sub-resources. An exercise documents four: `/gpx` (Accept header `application/gpx+xml`), `/tcx` (Accept `application/vnd.garmin.tcx+xml` — that Garmin-flavoured media type is not a typo), `/heart-rate-zones`, and `/samples`, which returns one URL per sample type to fetch individually. Daily activity exposes `/step-samples` and `/zone-samples` the same way.\n\nFinally, **PUT the transaction URL to commit**. The docstring says this \"should be done after retrieving data from the transaction.\" Commit closes the loop — and because transactional endpoints discard data once fetched, it is the point of no return.\n\n## The non-transactional shortcut\n\nThree endpoints need no transaction, take only a bearer token, and leave the data in place:\n\n```bash\ncurl -s -H \"Authorization: Bearer USER_ACCESS_TOKEN\" \\\n  \"https://www.polaraccesslink.com/v3/exercises\"\ncurl -s -H \"Authorization: Bearer USER_ACCESS_TOKEN\" \\\n  \"https://www.polaraccesslink.com/v3/users/sleep/\"\ncurl -s -H \"Authorization: Bearer USER_ACCESS_TOKEN\" \\\n  \"https://www.polaraccesslink.com/v3/users/nightly-recharge/\"\n```\n\nThe example web app uses only these three plus the user profile, which is why the README calls it \"the easiest and fastest way to get started.\" If sleep and Nightly Recharge are what you need, you may never open a transaction. Whether these endpoints accept date parameters is not documented in the sources we could reach — verify.\n\n## Gotchas and production notes\n\n- **Commit destroys.** Committing discards that data on Polar's side. Persist everything you pulled, and confirm the write succeeded, *before* you PUT. Nothing in the example re-opens a committed transaction.\n- **Only what arrives after linking.** The README frames the data flow as beginning \"once user has linked their user account to client application and synchronizes data from Polar device to Polar Flow.\" A long-standing open issue on the same repository, filed by an outside developer and unresolved in the thread, reports that \"currently it is only possible to retrieve data that has been synced after the authorization date.\" Sync regularly or lose history — and set expectations that connecting Polar does not backfill a user's past.\n- **No webhooks in the documented example.** Polar's sample is pull-only: notifications, transaction, commit. Whether AccessLink offers a push callback is not documented in the sources we could reach — verify. Until then plan a scheduler, not a listener; [what are webhooks](/learn/what-are-webhooks) covers the shape you would migrate to.\n- **No published rate limits in reach.** The example has no retry, backoff, or 429 handling. Poll notifications on a conservative interval, not per-user in a tight loop.\n- **Two auth modes, not one.** Client-level calls (token exchange, notifications) use HTTP Basic with your client credentials; user-level calls use a bearer token. Mixing them up produces failures that look like bad tokens.\n- **AccessLink is not Polar's only surface.** Polar also publishes an official Bluetooth LE SDK for Android and iOS that streams real-time heart rate, ECG, accelerometer, and PPG from its sensors and watches — a different, on-device model for live signal during a session rather than summaries after a sync.\n\nThe rest of the cluster is at [how to integrate a fitness or health API](/integrate)."
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
  }
];
