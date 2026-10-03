import type { ClusterEntry } from "@/lib/cluster";

/**
 * Cluster entries — fitness features from the phone's own motion sensors.
 *
 * Written against Apple's Core Motion documentation JSON and Google's Android
 * developer pages, all fetched 2026-10-03, and checked by script before
 * assembly: every quoted span matched against the fetched source text, every
 * internal link resolved against the released route set, FAQ keys unique
 * across the site, meta lengths inside the qa limits.
 *
 * Two sources could not be reached from the research environment and nothing
 * here depends on them: the developers.google.com reference pages for
 * ActivityTransition / ActivityRecognitionClient and for LocalRecordingClient.
 *
 * Order is the hub's reading order (Apple, then Android sensors and APIs, then
 * Android permission rules), so prev/next walks the cluster as intended.
 */
export const phoneSensorsEntries: ClusterEntry[] =
[
  {
    "slug": "cmpedometer",
    "primaryQuery": "CMPedometer",
    "h1": "CMPedometer: steps, distance, floors and cadence from the phone itself",
    "metaTitle": "CMPedometer: Steps, Floors, Cadence and the 7-Day Window",
    "metaDescription": "What CMPedometer returns, when fields are nil, why startUpdates totals are cumulative, the seven-day history limit and the NSMotionUsageDescription crash.",
    "updated": "2026-10-03",
    "answer": "CMPedometer is Core Motion's class for what Apple calls system-generated live walking data: step counts, estimated distance, floors ascended and descended, pace and cadence, available from iOS 8.0 and watchOS 2.0. It has two ways in: queryPedometerData(from:to:withHandler:) reads history, and Apple says only the past seven days worth of data is stored, while startUpdates(from:withHandler:) streams running totals from a start date you choose. Your Info.plist must carry NSMotionUsageDescription, because Apple states that without it your app crashes when you call this API. authorizationStatus(), added in iOS 11.0, tells you whether the user allowed motion access.",
    "body": "An iPhone app that wants steps without asking for HealthKit and without a watch reaches for this class. Apple's overview describes it plainly: \"The pedometer object manages a cache of historic data that you can query or you can ask for live updates as the data is processed.\" Which store you should read steps from across HealthKit, Health Connect and wearable clouds is a separate decision, and it is made on [the step counting API page](/data/step-counting-api). This page covers the class itself, from Apple's [CMPedometer documentation](https://developer.apple.com/documentation/coremotion/cmpedometer) as read on 2026-10-03.\n\n## What one CMPedometerData carries\n\nEvery handler receives a `CMPedometerData`. Apple says you never create one yourself; the pedometer packages each answer into one. The fields, their units in Apple's words, and when they are missing:\n\n| Property | Unit (Apple) | When it is nil | Since (iOS / watchOS) |\n| --- | --- | --- | --- |\n| `numberOfSteps` | steps | Declared non-optional `NSNumber` | 8.0 / 2.0 |\n| `distance` | meters, \"estimated\" | \"may be nil if distance estimation is not supported on the current device\" | 8.0 / 2.0 |\n| `floorsAscended`, `floorsDescended` | approximate floors | When floor counting is not supported on the device | 8.0 / 2.0 (`floorsAscended`) |\n| `currentPace` | seconds per meter | In historical queries, before it is available, or on unsupported devices | 9.0 / 2.0 |\n| `currentCadence` | steps per second | In historical queries, before it is available, or on unsupported devices | 9.0 / 2.0 |\n| `averageActivePace` | seconds per meter, active periods only | In a historical query with no movement, or on unsupported devices | 10.0 / 3.0 |\n\nTwo of those deserve a second look. Pace is seconds per meter, the inverse of a speed, so a UI showing minutes per kilometre has to convert. And Apple defines a floor loosely: \"A single floor has a height of approximately three meters,\" counted \"only the floors ascended while the user was walking or running up stairs\".\n\n## Availability is per capability\n\nThere is no single availability check for the whole class. The class exposes `isStepCountingAvailable()`, `isDistanceAvailable()`, `isFloorCountingAvailable()`, `isPaceAvailable()`, `isCadenceAvailable()` and `isPedometerEventTrackingAvailable()`. For floor counting and cadence Apple adds the same sentence: \"This capability is not supported on all devices.\" Check the capability the feature needs, not just steps.\n\n## Live updates are cumulative\n\n`startUpdates(from:withHandler:)` is the call most people get wrong. Apple: \"The data passed to your handler block represents the cumulative data starting at the specified start date and ending at the current time.\" Each callback is a running total from your start date, not the steps since the last callback. The start date can be in the past (\"You can specify a date in the past to retrieve the data from that time until now\"), which is how you show today's total the moment a screen opens.\n\nThe handler \"is called repeatedly on a background thread as new data arrives\", on a serial queue. Suspension pauses delivery: \"When the app is suspended, the delivery of updates stops temporarily. Upon returning to foreground or background execution, the pedometer object begins updates again.\"\n\n```swift\nimport CoreMotion\n\nlet pedometer = CMPedometer()\n\nfunc startTodayCounter(update: @escaping (Int, Double?) -> Void) {\n    guard CMPedometer.isStepCountingAvailable() else { return }\n    if CMPedometer.authorizationStatus() == .denied { return }  // explain, link to Settings\n\n    let midnight = Calendar.current.startOfDay(for: Date())\n    pedometer.startUpdates(from: midnight) { data, error in\n        guard let data, error == nil else { return }\n        let steps = data.numberOfSteps.intValue       // running total since midnight\n        let metres = data.distance?.doubleValue       // nil where distance is unsupported\n        DispatchQueue.main.async { update(steps, metres) }  // handler is off the main thread\n    }\n}\n// later: pedometer.stopUpdates()\n```\n\n## History: seven days, then nothing\n\n`queryPedometerData(from:to:withHandler:)` returns one aggregate for the range, and its handler \"is called once\". The limit is in the discussion: \"Only the past seven days worth of data is stored and available for you to retrieve. Specifying a start date that is more than seven days in the past returns only the available data.\" Apple also says it is safe to query while live updates are running. A weekly chart works. A monthly one needs your own storage, or HealthKit.\n\n## Pause and resume events\n\nFrom iOS 10.0 and watchOS 3.0, `startEventUpdates(handler:)` delivers `CMPedometerEvent` objects whose type is `.pause` (\"The user's pedestrian activity stopped.\") or `.resume` (\"The user's pedestrian activity resumed.\"). That is the documented hook for auto-pausing a walking session. Whether it fires quickly enough for your UI is something to measure on a device; Apple publishes no latency.\n\n## Permission\n\nApple's warning on the class page: \"To use this API, you must include the NSMotionUsageDescription key in your app's Info.plist file and provide a usage description string for this key.\" The string \"appears in the prompt that the user must accept the first time the system asks the user to access motion data for your app.\" The class page lists no method that requests permission on its own; the prompt arrives with first use. `authorizationStatus()` returns a `CMAuthorizationStatus`: `.notDetermined` (\"The status has not yet been determined.\"), `.restricted` (\"Access is denied due to system-wide restrictions.\"), `.denied` (\"Access was denied by the user.\") or `.authorized`.\n\n## Pitfalls\n\n- **Summing live callbacks.** Each one is cumulative from your start date. Adding them inflates the count on every update.\n- **Updating UI inside the handler.** It runs on a background thread. Hop to the main queue.\n- **Planning for a month of history.** The store holds seven days. Persist what you need before it ages out.\n- **Treating nil as zero.** A nil `distance` or `floorsAscended` means the device cannot measure it, not that the user stood still.\n- **Expecting cadence from a query.** `currentPace` and `currentCadence` are nil in historical queries by Apple's definition. Use `averageActivePace` there.\n- **Assuming lifts count.** Floors exclude \"floors ascended by elevator or other assisted means\".\n- **Expecting a merged phone and watch total.** Apple's CMPedometer pages say nothing about combining devices. A de-duplicated daily total across sources is what HealthKit statistics queries are for; see the [HealthKit integration guide](/integrate/healthkit).\n\nThe rest of the phone's motion stack is on [CMMotionActivityManager](/phone-sensors/cmmotionactivitymanager) for walking versus driving and [CMAltimeter](/phone-sensors/cmaltimeter) for elevation. The Android counterpart is the [step counter sensor](/phone-sensors/android-step-counter-sensor).",
    "faqs": [
      {
        "q": "How far back can CMPedometer queryPedometerData return steps?",
        "a": "Seven days. Apple's documentation for queryPedometerData(from:to:withHandler:) says only the past seven days worth of data is stored and available for you to retrieve, and that a start date more than seven days in the past returns only the available data. It does not fail; it quietly gives you less than you asked for. If your product shows monthly step history from Core Motion alone, you have to save each day's total yourself before it ages out, or read from HealthKit instead."
      },
      {
        "q": "Why does my app crash the first time it calls CMPedometer?",
        "a": "Almost always a missing NSMotionUsageDescription key. Apple's CMPedometer page says you must include that key in Info.plist with a usage description string, and that if you don't, your app crashes when you call this API. The same string is what the user sees in the motion permission prompt the first time the system asks for access, so write it as an explanation of the feature rather than a placeholder."
      },
      {
        "q": "Is CMPedometer startUpdates data cumulative or per interval?",
        "a": "Cumulative. Apple states that the data passed to your handler represents the cumulative data starting at the specified start date and ending at the current time. Every callback is a running total from the date you passed in, so display the latest value rather than adding callbacks together. Passing midnight as the start date gives you today's total immediately, including steps taken before your app launched."
      },
      {
        "q": "Why is currentCadence nil in a CMPedometer historical query?",
        "a": "Because Apple defines it that way. The documentation for currentCadence and currentPace says the value is nil when you are performing a query for historical pedometer data, when the information is not yet available, or on devices that do not support it. Cadence and current pace only arrive during live updates. For a past range, averageActivePace is the field Apple sets, and it averages pace only over periods of activity."
      }
    ],
    "related": [
      {
        "href": "/data/step-counting-api",
        "label": "Which API should give you steps"
      },
      {
        "href": "/integrate/healthkit",
        "label": "HealthKit integration guide"
      },
      {
        "href": "/phone-sensors/cmmotionactivitymanager",
        "label": "CMMotionActivityManager"
      },
      {
        "href": "/phone-sensors/android-step-counter-sensor",
        "label": "The Android step counter sensor"
      },
      {
        "href": "/build/step-challenge-app",
        "label": "Building a step challenge app"
      }
    ],
    "cta": {
      "pitch": "Core Motion adds fields and moves availability between OS releases, and a pedometer feature built on last year's assumptions breaks quietly. Our newsletter flags the platform changes that reach on-device step and activity data."
    }
  },
  {
    "slug": "cmmotionactivitymanager",
    "primaryQuery": "CMMotionActivityManager",
    "h1": "CMMotionActivityManager: walking, running, driving or still",
    "metaTitle": "CMMotionActivityManager and CMMotionActivity Explained",
    "metaDescription": "How CMMotionActivityManager reports walking, running, cycling, driving and stationary, why the flags overlap, what confidence means, and the 7-day limit.",
    "updated": "2026-10-03",
    "answer": "CMMotionActivityManager is the Core Motion class that tells your app whether the device is on someone walking, running, cycling, in a vehicle or stationary, delivered as CMMotionActivity objects with a confidence of low, medium or high. It is available from iOS 7.0 and watchOS 2.0, with the cycling flag from iOS 8.0. Live changes come from startActivityUpdates(to:withHandler:), which reports the current state and then only changes, and history comes from queryActivityStarting(from:to:to:withHandler:), which Apple limits to the last seven days and warns can lag by up to several minutes. Apple also says the motion flags are not mutually exclusive, so a single update can be both automotive and stationary.",
    "body": "Activity classification is the cheapest context signal a fitness app can get: no GPS, no camera, no wearable. Core Motion keeps the classification running on its own; your app reads it. Everything below comes from Apple's [CMMotionActivityManager](https://developer.apple.com/documentation/coremotion/cmmotionactivitymanager) and [CMMotionActivity](https://developer.apple.com/documentation/coremotion/cmmotionactivity) documentation, read 2026-10-03.\n\n## What an update contains\n\nEach `CMMotionActivity` carries a `startDate` (\"The time at which the change in motion occurred\"), a `confidence`, and six Booleans:\n\n| Property | Apple's description | Since (iOS / watchOS) |\n| --- | --- | --- |\n| `stationary` | whether the device is stationary | 7.0 / 2.0 |\n| `walking` | whether the device is on a walking person | 7.0 / 2.0 |\n| `running` | whether the device is on a running person | 7.0 / 2.0 |\n| `automotive` | whether the device is in an automobile | 7.0 / 2.0 |\n| `cycling` | whether the device is in a bicycle | 8.0 / 2.0 |\n| `unknown` | whether the type of motion is unknown | 7.0 / 2.0 |\n\n## The flags overlap, and can all be false\n\nThis is the line that breaks naive switch statements. Apple: \"The motion-related properties of this class aren't mutually exclusive. In other words, it's possible for more than one of the motion-related properties to contain the value true.\" The example is a car at a red light, which reports both `automotive` and `stationary`. The reverse also happens: \"It's also possible for all of the properties to be set to false when the device is in motion but the movement doesn't correlate to walking, running, cycling, or automotive travel.\" And `unknown` has its own meaning: it is `true` \"when there is no way to estimate the current type of motion\", for example when \"the device was turned on recently and not enough motion data had been gathered\".\n\nSo model the result as a set, not an enum, and decide your own precedence. Ours, as judgement: for a fitness app, `running` beats `walking`, any of the three beats `stationary`, and `automotive` overrides everything because a phone in a car should never log a workout.\n\n## Confidence has three levels and no numbers\n\n`CMMotionActivityConfidence` is `.low` (\"Confidence is low.\"), `.medium` (\"Confidence is good.\") or `.high` (\"Confidence is high.\"). Apple publishes no threshold, no accuracy figure and no definition of what moves a reading between levels. Treat it as an ordering you can filter on, not a probability.\n\n## Live updates: current state, then changes\n\n`startActivityUpdates(to:withHandler:)` first reports \"the current motion in effect for the device\", then runs the handler \"only when the motion data changes\". Delivery is best effort and stops while you are suspended: \"If updates arrived while your app was suspended, the last update is delivered to your app when it resumes execution. To get all of the updates that occurred while your app was suspended, use the queryActivityStarting(from:to:to:withHandler:) method.\" Calling it again with a new block replaces the old one, and \"Updates stop altogether when the motion activity manager object itself is deallocated\", so keep a strong reference.\n\n## History: seven days, delayed\n\n`queryActivityStarting(from:to:to:withHandler:)` returns an array ordered by time. Two sentences from Apple matter: \"A delay of up to several minutes in reported activities is expected,\" and \"The system stores only the last seven days worth of activity data at most.\" An empty range is not an empty array: \"If there are no samples for the specified range of time, an error object with the code CMErrorUnknown is passed to the handler block.\"\n\n```swift\nimport CoreMotion\n\nlet activityManager = CMMotionActivityManager()   // keep a strong reference\n\nfunc minutesOnFoot(since start: Date, completion: @escaping (TimeInterval) -> Void) {\n    guard CMMotionActivityManager.isActivityAvailable() else { return completion(0) }\n    activityManager.queryActivityStarting(from: start, to: Date(), to: .main) { activities, error in\n        guard let activities, error == nil else { return completion(0) }  // CMErrorUnknown = no samples\n        var total: TimeInterval = 0\n        for (current, next) in zip(activities, activities.dropFirst()) {\n            let onFoot = (current.walking || current.running) && !current.automotive\n            if onFoot && current.confidence != .low {\n                total += next.startDate.timeIntervalSince(current.startDate)\n            }\n        }\n        completion(total)\n    }\n}\n```\n\nEach activity marks a change, so a segment lasts until the next one's `startDate`; that is how the loop measures duration.\n\n## Permission and availability\n\nThe same rule as the pedometer: \"To use this API, you must include the NSMotionUsageDescription key in your app's Info.plist file\", and \"If you don't include a usage description string, your app crashes when you call this API.\" Check `isActivityAvailable()` first; Apple notes \"Motion data is not available on all iOS devices.\" `authorizationStatus()` arrived in iOS 11.0 and watchOS 4.0.\n\n## Pitfalls\n\n- **Switching on a single flag.** Several can be true at once, and all can be false.\n- **Reading an error as \"no data\".** `CMErrorUnknown` is what an empty range returns.\n- **Scoring a workout the moment it ends.** History can lag by several minutes. Query a little later, or re-query.\n- **Letting the manager deallocate.** Updates stop with it.\n- **Expecting macOS.** `CMMotionActivity` lists macOS 15.0, but Apple's `CMMotionActivityManager` page lists no macOS version. On macOS the documented source is the headphone activity manager (macOS 15.0), covered on the [CMHeadphoneMotionManager page](/phone-sensors/cmheadphonemotionmanager).\n\nThe Android equivalent is the [Activity Recognition Transition API](/phone-sensors/android-activity-recognition-transition-api). For steps rather than activity type, see [CMPedometer](/phone-sensors/cmpedometer).",
    "faqs": [
      {
        "q": "Can a CMMotionActivity have more than one activity flag set?",
        "a": "Yes. Apple's CMMotionActivity documentation says the motion-related properties aren't mutually exclusive, and gives the example of a car stopped at a red light, which reports both automotive and stationary as true. Apple also says all of them can be false when the device is moving in a way that doesn't match walking, running, cycling or driving. Model the result as a set of flags and choose your own precedence; a switch over one value will misread real updates."
      },
      {
        "q": "Why does queryActivityStarting return an error instead of an empty array?",
        "a": "Because that is how Apple reports an empty range. The documentation for queryActivityStarting(from:to:to:withHandler:) says that if there are no samples for the specified range of time, an error object with the code CMErrorUnknown is passed to the handler. Treat that code as no activity recorded. Remember the other two limits on the same page: the system keeps at most the last seven days of activity, and reported activities can lag by up to several minutes."
      },
      {
        "q": "Does CMMotionActivityManager deliver activity changes while my app is suspended?",
        "a": "No. Apple says the handler passed to startActivityUpdates(to:withHandler:) runs on a best-effort basis and updates are not delivered while your app is suspended. When the app resumes, only the last update that arrived meanwhile is delivered. To recover everything that happened in between, Apple points you to queryActivityStarting(from:to:to:withHandler:), which returns the full ordered list for a time range within the last seven days."
      },
      {
        "q": "What do the CMMotionActivityConfidence levels actually mean?",
        "a": "Apple documents three values and very little else: low is described as confidence is low, medium as confidence is good, and high as confidence is high. There is no published threshold, probability or accuracy figure behind them. Use confidence as an ordering, for example ignoring low-confidence segments when you total active minutes, and validate the filter against your own recorded sessions rather than assuming a number."
      }
    ],
    "related": [
      {
        "href": "/phone-sensors/cmpedometer",
        "label": "CMPedometer"
      },
      {
        "href": "/phone-sensors/android-activity-recognition-transition-api",
        "label": "Activity Recognition Transition API on Android"
      },
      {
        "href": "/guides/track-workouts-without-wearables",
        "label": "Tracking workouts without a wearable"
      },
      {
        "href": "/build/running-app",
        "label": "Building a running app"
      }
    ],
    "cta": {
      "pitch": "Activity classification is one of the platform features that changes shape quietly between releases. Our newsletter tracks the Core Motion and Android changes that alter what a phone can tell you about movement."
    }
  },
  {
    "slug": "cmaltimeter",
    "primaryQuery": "CMAltimeter",
    "h1": "CMAltimeter: relative and absolute altitude on iPhone and Apple Watch",
    "metaTitle": "CMAltimeter: Relative vs Absolute Altitude, Which Devices",
    "metaDescription": "CMAltimeter's relative altitude restarts at zero on each start call; absolute altitude needs iOS 15 and, per Apple, iPhone 12 or Apple Watch 6 or SE.",
    "updated": "2026-10-03",
    "answer": "CMAltimeter is Core Motion's class for altitude changes, and it reports two different things. Relative altitude, from iOS 8.0 and watchOS 2.0, is the change in meters since the first event your app received, alongside barometric pressure in kilopascals. Absolute altitude, from iOS 15.0 and watchOS 8.0, is the device's height relative to sea level with an accuracy estimate, and Apple states it is only available on iPhone 12 and later and Apple Watch 6 or SE and later. Both need NSMotionUsageDescription in Info.plist, and Apple tells you to check isRelativeAltitudeAvailable() or isAbsoluteAltitudeAvailable() before starting either stream.",
    "body": "Hiking, stair workouts and trail runs all want elevation, and the phone has a barometer for it. Apple's [CMAltimeter documentation](https://developer.apple.com/documentation/coremotion/cmaltimeter), read 2026-10-03, splits the job into two streams that answer different questions.\n\n## Two streams, two questions\n\n| | Relative altitude | Absolute altitude |\n| --- | --- | --- |\n| Start call | `startRelativeAltitudeUpdates(to:withHandler:)` | `startAbsoluteAltitudeUpdates(to:withHandler:)` |\n| Data class | `CMAltitudeData` | `CMAbsoluteAltitudeData` |\n| What you get | `relativeAltitude` in meters since the first event; `pressure` in kilopascals | `altitude` in meters relative to sea level; `accuracy` and `precision` in meters |\n| Availability check | `isRelativeAltitudeAvailable()` | `isAbsoluteAltitudeAvailable()` |\n| Since (iOS / watchOS) | 8.0 / 2.0 | 15.0 / 8.0 |\n\nApple's own example covers both: a hiking app \"could use this object to track the user's elevation change over the course of a hike, or to report their current absolute altitude during the hike.\"\n\n## Relative altitude is relative to your first event\n\nApple: \"For the first altitude event delivered to your altimeter object, the value of this property is 0. Subsequent events contain a number that reflects the relative change in altitude with respect to the first reported event.\" Each time you start the stream, zero moves to wherever the user is standing. If a session can stop and restart, store the last value before stopping and add it back, or the climb resets mid-hike.\n\nCalling the start method again replaces the handler: \"Only the last installed handler receives events.\" And on a device without the hardware it fails silently: \"If altitude data isn't available on the current device, this method does nothing.\" Hence the availability check.\n\n## Absolute altitude: which devices\n\nApple repeats one sentence on the availability check, the start method and the data class: \"Absolute altitude is only available on iPhone 12 and later and Apple Watch 6 or SE and later.\" `CMAbsoluteAltitudeData` adds `accuracy` (\"The estimated uncertainty of the altimeter in meters, based on one standard deviation\") and `precision` (\"The recommended resolution for the altitude, in meters\"). Use `precision` to decide how many digits to display; showing centimetres when Apple recommends a coarser resolution is false precision. Apple notes the altitude \"can be positive or negative.\"\n\n## Events arrive on a schedule, not on change\n\n\"Core Motion generates events at regular intervals (regardless of whether the data has changed)\". Apple does not state the interval. Expect a steady stream of nearly identical values while the user stands still, and do not treat each event as movement.\n\n```swift\nimport CoreMotion\n\nlet altimeter = CMAltimeter()\nvar climbed = 0.0\nvar last: Double?\n\nfunc startClimbTracking() {\n    guard CMAltimeter.isRelativeAltitudeAvailable() else { return }\n    altimeter.startRelativeAltitudeUpdates(to: .main) { data, error in\n        guard let metres = data?.relativeAltitude.doubleValue, error == nil else { return }\n        if let previous = last, metres - previous > 0 {\n            climbed += metres - previous           // gain only; tune a threshold on real data\n        }\n        last = metres\n    }\n}\n\nfunc stopClimbTracking() { altimeter.stopRelativeAltitudeUpdates() }\n```\n\nThe gain arithmetic is ours, not Apple's. Summing every small upward wiggle from a barometer will overstate a climb; most apps add a minimum step before counting. Apple publishes no noise figure for relative altitude, so the threshold is something to tune against recorded sessions.\n\n## Permission\n\nThe class page carries the usual Core Motion warning: include `NSMotionUsageDescription`, because \"If you don't include a usage description string, your app crashes when you call this API.\" `authorizationStatus()` arrived in iOS 11.0 and watchOS 4.0. Apple's CMAltimeter page lists no macOS version.\n\n## Pitfalls\n\n- **Expecting zero to mean sea level.** In the relative stream it means the point where this stream started.\n- **Restarting mid-session.** The baseline resets. Carry the previous total across.\n- **Skipping the availability check.** The start method does nothing on unsupported hardware, with no error.\n- **Promising absolute altitude on older phones.** Apple names iPhone 12 and Apple Watch 6 or SE as the floor.\n- **Counting every event as movement.** Events are periodic whether or not anything changed.\n- **Looking for history.** The CMAltimeter page lists start and stop methods only, with no query for past altitude.\n\nFor stair counting without your own arithmetic, [CMPedometer](/phone-sensors/cmpedometer) reports `floorsAscended`, which Apple sizes at approximately three meters per floor and limits to walking or running up stairs. Why hiking apps disagree on elevation gain is covered in [building a hiking app](/build/hiking-app).",
    "faqs": [
      {
        "q": "Which iPhones support CMAltimeter absolute altitude?",
        "a": "Apple's documentation says absolute altitude is only available on iPhone 12 and later and Apple Watch 6 or SE and later. The API itself needs iOS 15.0 or watchOS 8.0. Call isAbsoluteAltitudeAvailable() before startAbsoluteAltitudeUpdates(to:withHandler:) rather than checking model names yourself, and fall back to relative altitude, which has been available since iOS 8.0 on devices that support it."
      },
      {
        "q": "Why does CMAltimeter relativeAltitude start at zero?",
        "a": "Because it measures change since your stream began. Apple says the first altitude event delivered to your altimeter object has a relativeAltitude of 0, and later events reflect the change with respect to that first event. Every call to startRelativeAltitudeUpdates(to:withHandler:) sets a new zero. If a hike can pause and resume, keep the last value before stopping and add it to the new stream's readings."
      },
      {
        "q": "What unit is CMAltitudeData pressure reported in?",
        "a": "Kilopascals. Apple documents the pressure property of CMAltitudeData as the recorded pressure, in kilopascals, delivered alongside relativeAltitude in meters. Weather services often quote hectopascals or millibars, which are ten times larger numbers for the same pressure, so convert before comparing a phone reading with a forecast."
      },
      {
        "q": "Should I use CMAltimeter or CMPedometer floorsAscended to count stairs?",
        "a": "For a simple floors figure, CMPedometer is less work. Apple documents floorsAscended as counting only floors climbed while walking or running up stairs, excluding elevators, with a floor of approximately three meters. CMAltimeter gives you continuous relative altitude in meters, which suits a stair workout that needs height per minute or a hike's elevation profile, but turning it into gain is your own arithmetic. Check isFloorCountingAvailable() or isRelativeAltitudeAvailable() first."
      }
    ],
    "related": [
      {
        "href": "/phone-sensors/cmpedometer",
        "label": "CMPedometer floors and steps"
      },
      {
        "href": "/build/hiking-app",
        "label": "Building a hiking app"
      },
      {
        "href": "/data/gps-activity-api",
        "label": "GPS and route data APIs"
      },
      {
        "href": "/watch-apps/watchos-workout-app-anatomy",
        "label": "Anatomy of a watchOS workout app"
      }
    ],
    "cta": {
      "pitch": "Device support for sensors like the absolute altimeter moves with each hardware generation. Our newsletter flags the Core Motion changes that decide which of your users get a feature."
    }
  },
  {
    "slug": "cmheadphonemotionmanager",
    "primaryQuery": "CMHeadphoneMotionManager",
    "h1": "CMHeadphoneMotionManager: head motion from AirPods",
    "metaTitle": "CMHeadphoneMotionManager: AirPods Head Motion in Core Motion",
    "metaDescription": "How CMHeadphoneMotionManager streams head attitude from motion-capable Apple headphones, what Apple says about models, and connect and disconnect events.",
    "updated": "2026-10-03",
    "answer": "CMHeadphoneMotionManager is the Core Motion class that streams device motion from motion-capable Apple headphones, meaning head attitude, rotation rate, gravity and user acceleration as CMDeviceMotion, from iOS 14.0, macOS 14.0 and watchOS 7.0 according to its documentation page. Apple's class page does not list headphone models; it refers to motion-capable Apple headphones, and Apple's headphone activity sample names AirPods Pro 2 or AirPods 4 as examples of headphones that support motion updates. Check isDeviceMotionAvailable, adopt CMHeadphoneMotionManagerDelegate to learn when headphones connect and disconnect, and include NSMotionUsageDescription, because Apple says the system crashes your app on iOS and macOS when you start updates without it.",
    "body": "A person doing a plank, a neck mobility routine or a run with AirPods in is wearing a motion sensor on their head. This class reads it. Sources are Apple's [CMHeadphoneMotionManager documentation](https://developer.apple.com/documentation/coremotion/cmheadphonemotionmanager) and the [Core Motion updates](https://developer.apple.com/documentation/updates/coremotion) page, read 2026-10-03.\n\n## What you get\n\nUpdates arrive as `CMDeviceMotion`, the same type the phone's own device-motion service uses. Apple's article on processed device motion lists what that service provides: attitude, unbiased rotation rate, the gravity vector, user acceleration without gravity, and the magnetic field vector, and names `CMHeadphoneMotionManager` as one of three classes that offer it. Two ways to receive it:\n\n- `startDeviceMotionUpdates(to:withHandler:)` pushes each update to a handler on the queue you pass.\n- `startDeviceMotionUpdates()` starts the service and leaves you to read `deviceMotion`, which Apple says \"is nil when there is no device-motion data.\"\n\nThe axes are the headphones', not the phone's. Apple's class page includes a diagram of \"the positive x-axis, positive y-axis, and positive z-axis for motion-capable Apple headphones\", and you need it before interpreting pitch or roll.\n\n## Which headphones\n\nThis is what Apple's pages say, and no more:\n\n- The class page refers to \"motion-capable Apple headphones\" and lists no models.\n- The sample for the separate headphone activity manager requires \"Headphones that support motion updates, such as AirPods Pro 2 or AirPods 4\", plus a device on iOS 18 or later.\n\n\"Such as\" is an example, not a compatibility list. Gate the feature on the API rather than on a model name.\n\n## Availability is not connection\n\n`isDeviceMotionAvailable` is documented as \"A Boolean value that indicates whether the current device supports the headphone motion manager.\" That is the phone, Mac or watch running your code. It does not say headphones are in the user's ears. For that, adopt `CMHeadphoneMotionManagerDelegate`: `headphoneMotionManagerDidConnect(_:)` \"Performs a callback to the delegate after you connect headphones\", with a matching disconnect callback. Apple's June 2024 update note adds: \"Enable connect or disconnect monitoring outside of a motion session with the CMHeadphoneMotionManager class.\" The methods behind that, `startConnectionStatusUpdates()` and `isConnectionStatusActive`, carry no description on Apple's pages.\n\n```swift\nimport CoreMotion\n\nfinal class HeadTracker: NSObject, CMHeadphoneMotionManagerDelegate {\n    private let manager = CMHeadphoneMotionManager()\n\n    func start(onPitch: @escaping (Double) -> Void) {\n        guard manager.isDeviceMotionAvailable else { return }   // this device, not the AirPods\n        manager.delegate = self\n        manager.startDeviceMotionUpdates(to: .main) { [weak self] motion, error in\n            if error != nil { self?.manager.stopDeviceMotionUpdates(); return }\n            guard let motion else { return }\n            onPitch(motion.attitude.pitch)                   // radians, headphone axes\n        }\n    }\n\n    func headphoneMotionManagerDidConnect(_ manager: CMHeadphoneMotionManager) { /* show live state */ }\n    func headphoneMotionManagerDidDisconnect(_ manager: CMHeadphoneMotionManager) { /* pause the set */ }\n}\n```\n\nStopping on error follows Apple's handler documentation, which says \"If an error occurs, you should stop gyroscope updates and inform the user of the problem.\" The word gyroscope is Apple's, on a headphone-motion page.\n\n## Apple Watch: two answers\n\nThe class page stamps watchOS 7.0. Apple's Core Motion updates page lists under June 2024: \"You can also use CMHeadphoneMotionManager to support AirPods device motion data on watchOS.\" We could not reconcile the two from Apple's pages alone. If watch support matters, test on the oldest watchOS you ship.\n\n## Activity from the headphones\n\n`CMHeadphoneActivityManager`, from iOS 18.0 and watchOS 11.0, is a different class. Apple: it \"provides similar information to CMMotionActivityManager, except the activity information comes from headphone motion, rather than from device motion.\" It delivers the same `CMMotionActivity` objects covered on the [CMMotionActivityManager page](/phone-sensors/cmmotionactivitymanager), and Apple says to check `isActivityAvailable` and `isStatusAvailable` before using it.\n\n## Permission\n\nApple: \"In iOS and macOS, include the NSMotionUsageDescription key in your app's Info.plist file. If this key is absent, the system crashes your app when you start device-motion updates.\" `authorizationStatus()` returns the same `CMAuthorizationStatus` as the rest of Core Motion.\n\n## Pitfalls\n\n- **Reading `isDeviceMotionAvailable` as a connection signal.** It describes the host device. Use the delegate.\n- **Hard-coding model names.** Apple publishes examples, not a list.\n- **Using phone axes.** The headphones have their own coordinate frame.\n- **Leaving updates running.** Apple's processed device-motion article tells you to stop the service when you no longer need it, because the hardware \"consumes additional power\"; it is written for `CMMotionManager`, and the same discipline applies here.\n- **Promising rep counting from head motion.** Apple documents the data, not any exercise algorithm. How rep counters are built is on [how rep counting works](/motion/how-rep-counting-works).\n\nThe camera-based alternative, which sees the whole body rather than the head, is the subject of [tracking workouts without a wearable](/guides/track-workouts-without-wearables).",
    "faqs": [
      {
        "q": "Which AirPods work with CMHeadphoneMotionManager?",
        "a": "Apple does not publish a list on the class page. CMHeadphoneMotionManager's documentation refers only to motion-capable Apple headphones. Apple's sample for the related CMHeadphoneActivityManager requires headphones that support motion updates, such as AirPods Pro 2 or AirPods 4, which is an example rather than a full list. Gate the feature on isDeviceMotionAvailable and on the delegate's connect callback instead of checking model names."
      },
      {
        "q": "Does CMHeadphoneMotionManager work on Apple Watch?",
        "a": "Apple's pages give two signals. The class documentation lists watchOS 7.0 as its introduction. Apple's Core Motion updates page, under June 2024, says you can also use CMHeadphoneMotionManager to support AirPods device motion data on watchOS, which reads as watch support arriving later. We could not reconcile the two from Apple's documentation, so test on the oldest watchOS version you intend to support before promising the feature."
      },
      {
        "q": "How do I know when AirPods connect for head tracking?",
        "a": "Adopt CMHeadphoneMotionManagerDelegate and set it as the manager's delegate. Apple documents headphoneMotionManagerDidConnect(_:) as a callback after you connect headphones, with a matching disconnect callback. Do not rely on isDeviceMotionAvailable for this: Apple defines it as whether the current device supports the headphone motion manager, which says nothing about whether headphones are in the user's ears."
      },
      {
        "q": "What is the difference between CMHeadphoneMotionManager and CMHeadphoneActivityManager?",
        "a": "CMHeadphoneMotionManager streams raw head motion as CMDeviceMotion: attitude, rotation rate, gravity and user acceleration, from iOS 14.0. CMHeadphoneActivityManager, from iOS 18.0 and watchOS 11.0, classifies activity instead; Apple says it provides similar information to CMMotionActivityManager, except the activity information comes from headphone motion rather than device motion. Use the first for posture or head-movement features, the second for knowing whether the wearer is walking or running."
      }
    ],
    "related": [
      {
        "href": "/phone-sensors/cmmotionactivitymanager",
        "label": "CMMotionActivityManager"
      },
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/guides/track-workouts-without-wearables",
        "label": "Tracking workouts without a wearable"
      },
      {
        "href": "/accessibility/haptics-when-audio-is-busy",
        "label": "Haptics when the audio channel is busy"
      }
    ],
    "cta": {
      "pitch": "Headphone motion has gained new classes and platforms in recent Core Motion releases. Our newsletter flags the changes that decide which devices your feature reaches."
    }
  },
  {
    "slug": "cmbatchedsensormanager",
    "primaryQuery": "CMBatchedSensorManager",
    "h1": "CMBatchedSensorManager: high-frequency motion batches during workouts",
    "metaTitle": "CMBatchedSensorManager: High-Rate Motion on Apple Watch",
    "metaDescription": "What Apple documents about CMBatchedSensorManager: batched accelerometer and device motion during workouts, watchOS 10.0, and what it leaves out.",
    "updated": "2026-10-03",
    "answer": "CMBatchedSensorManager is the Core Motion class Apple introduced, per its June 2023 update notes, to access batches of high-frequency accelerometer and device motion data during workouts, such as a golf swing or a baseball bat swing. It delivers arrays of CMAccelerometerData or CMDeviceMotion samples through start methods with handlers, plus async sequences that Apple lists for watchOS 10.0 only. The class page carries no overview text, no documented sample rate and no statement about whether a workout session must be running, so those details could not be verified from Apple's documentation. Its class-level iOS stamp of 4.0 is the same number Apple gives the Core Motion framework itself, so do not read it as an iPhone introduction date.",
    "body": "This is the class for swing analysis, punch detection and other movements that happen faster than ordinary motion updates capture. It is also one of the thinnest pages in Apple's Core Motion documentation. Here is what Apple says, read on 2026-10-03, and where it stops.\n\n## What Apple says it is for\n\nThe [CMBatchedSensorManager page](https://developer.apple.com/documentation/coremotion/cmbatchedsensormanager) has no overview. The purpose is stated on the [Core Motion updates](https://developer.apple.com/documentation/updates/coremotion) page, under June 2023: \"Use the CMBatchedSensorManager class to access batches of high-frequency accelerometer and device motion data during workouts, such as a golf swing or a baseball bat swing.\" Apple's processed device-motion article also lists it as one of three device-motion providers, next to `CMMotionManager` and `CMHeadphoneMotionManager`. On the Core Motion index the class sits alone under a topic named \"Historical data\".\n\n## The API surface\n\nApple's member list, none of which carries a description:\n\n| Group | Members |\n| --- | --- |\n| Authorization and support | `authorizationStatus`, `isAccelerometerSupported`, `isDeviceMotionSupported` (class properties) |\n| Frequency | `accelerometerDataFrequency`, `deviceMotionDataFrequency` (read-only `Int`) |\n| Accelerometer | `startAccelerometerUpdates()`, `startAccelerometerUpdates(handler:)`, `stopAccelerometerUpdates()`, `accelerometerBatch`, `accelerometerUpdates()`, `isAccelerometerActive` |\n| Device motion | `startDeviceMotionUpdates()`, `startDeviceMotionUpdates(handler:)`, `stopDeviceMotionUpdates()`, `deviceMotionBatch`, `deviceMotionUpdates()`, `isDeviceMotionActive` |\n\nThe handler forms take arrays: `([CMAccelerometerData]?, (any Error)?) -> Void` and `([CMDeviceMotion]?, (any Error)?) -> Void`. A batch is many samples per callback, which is the point of the class.\n\n## Platforms, and a misleading number\n\nApple's page lists watchOS 10.0. It also lists iOS and iPadOS 4.0, Mac Catalyst 13.0 and visionOS 1.0. The iOS figure is the same 4.0 Apple gives the whole Core Motion framework, while Apple's update notes announce the class in June 2023. We read that stamp as inherited from the framework rather than as the class's history, and we could not find an Apple page that states an iPhone introduction version. The async-sequence accessors `accelerometerUpdates()` and `deviceMotionUpdates()` list watchOS 10.0 and nothing else.\n\n## A minimal sketch\n\n```swift\nimport CoreMotion\n\nlet batched = CMBatchedSensorManager()\n\nfunc startSwingCapture(onBatch: @escaping ([CMAccelerometerData]) -> Void) {\n    guard CMBatchedSensorManager.isAccelerometerSupported else { return }\n    // accelerometerDataFrequency reports the rate; Apple does not document its value.\n    batched.startAccelerometerUpdates { samples, error in\n        guard let samples, error == nil else { return }\n        onBatch(samples)            // many samples per callback; each carries a timestamp\n    }\n}\n\nfunc stopSwingCapture() { batched.stopAccelerometerUpdates() }\n```\n\nEach `CMAccelerometerData` inherits a `timestamp` from `CMLogItem`, which Apple describes as recording \"when the acceleration measurement was taken\". Order and window your analysis on those timestamps, not on callback arrival.\n\nWe do not show the async-sequence form. Apple documents that `AccelerometerUpdates` conforms to `AsyncSequence`, but its element type and iterator carry no description we could read, and a sketch that guesses the element type is a sketch that may not compile.\n\n## What we could not verify\n\n- **The sample rate.** `accelerometerDataFrequency` and `deviceMotionDataFrequency` exist; their values are not documented. Read them at runtime.\n- **Whether a workout session is required.** Apple's note says \"during workouts\". The class page does not say whether an `HKWorkoutSession` must be active, and we will not claim it either way. How a watch workout session works is on [the anatomy of a watchOS workout app](/watch-apps/watchos-workout-app-anatomy).\n- **Battery cost and batch size.** Not documented.\n- **Permission specifics.** `authorizationStatus` returns a `CMAuthorizationStatus`. Apple's Core Motion overview says an iOS app needs `NSMotionUsageDescription` \"To access motion and fitness data\"; the batched page itself says nothing about permissions.\n\n## Pitfalls\n\n- **Treating the iOS 4.0 stamp as the class's history.** It matches the framework's number.\n- **Expecting one sample per callback.** Handlers receive arrays.\n- **Hard-coding a frequency.** Read the frequency properties; no value is published.\n- **Leaving capture running.** Start for the swing window, stop after. The power cost of high-rate motion is real even where Apple does not quantify it; see [watch app battery](/watch-apps/watch-app-battery).\n- **Assuming the class counts anything.** It hands you samples. Turning them into swings or reps is your model; [how rep counting works](/motion/how-rep-counting-works) covers the patterns.",
    "faqs": [
      {
        "q": "Is CMBatchedSensorManager available on iPhone?",
        "a": "Apple's documentation does not say clearly. The class page lists watchOS 10.0, and also lists iOS and iPadOS 4.0, which is the same version Apple gives the entire Core Motion framework; the class itself was announced in Apple's June 2023 Core Motion update notes, so we do not read the 4.0 figure as its iPhone introduction. The async-sequence accessors are listed for watchOS 10.0 only. Check isAccelerometerSupported and isDeviceMotionSupported at runtime rather than trusting the platform stamp."
      },
      {
        "q": "What sampling rate does CMBatchedSensorManager deliver?",
        "a": "Apple does not publish one. The class exposes accelerometerDataFrequency and deviceMotionDataFrequency as read-only integers, but their documentation pages have no description and no value. Apple's update note says only that the class provides high-frequency accelerometer and device motion data. Read the frequency properties on the device at runtime, and use each sample's timestamp rather than an assumed rate when you window the data."
      },
      {
        "q": "Does CMBatchedSensorManager need an active workout session?",
        "a": "Could not verify. Apple's Core Motion update note describes the class as giving access to high-frequency data during workouts, with a golf swing or baseball bat swing as examples, but the CMBatchedSensorManager page itself contains no discussion and does not state whether a workout session has to be running. Test the behaviour on a device with and without your workout session active before building a feature that depends on either answer."
      },
      {
        "q": "Why does CMBatchedSensorManager deliver arrays instead of single samples?",
        "a": "Because batching is its job. The handler for startAccelerometerUpdates(handler:) receives an optional array of CMAccelerometerData, and the device-motion handler an optional array of CMDeviceMotion. Apple's update note calls them batches of high-frequency data. Process each callback as a block of samples ordered by their timestamps, rather than treating the callback as one reading."
      }
    ],
    "related": [
      {
        "href": "/watch-apps/watchos-workout-app-anatomy",
        "label": "Anatomy of a watchOS workout app"
      },
      {
        "href": "/watch-apps/watch-app-battery",
        "label": "Watch app battery"
      },
      {
        "href": "/motion/how-rep-counting-works",
        "label": "How rep counting works"
      },
      {
        "href": "/phone-sensors/cmheadphonemotionmanager",
        "label": "CMHeadphoneMotionManager"
      }
    ],
    "cta": {
      "pitch": "Thinly documented classes are the ones whose behaviour shifts without a release note. Our newsletter tracks the Core Motion changes that matter to workout apps."
    }
  },
  {
    "slug": "android-step-counter-sensor",
    "primaryQuery": "Sensor.TYPE_STEP_COUNTER",
    "h1": "Sensor.TYPE_STEP_COUNTER vs TYPE_STEP_DETECTOR on Android",
    "metaTitle": "TYPE_STEP_COUNTER vs TYPE_STEP_DETECTOR on Android",
    "metaDescription": "Android's step counter returns steps since the last reboot with up to 10 s latency; the step detector fires once per step. Permissions, batching, pitfalls.",
    "updated": "2026-10-03",
    "answer": "Sensor.TYPE_STEP_COUNTER returns the number of steps taken since the last reboot while the sensor was activated, as a float that resets to zero only on a reboot, and Android defines it as an on-change sensor with up to 10 seconds of latency but more accuracy than the detector. Sensor.TYPE_STEP_DETECTOR instead fires one event with the value 1.0 for every step, as a special-trigger sensor with latency expected below 2 seconds. Both arrived in API level 19, and both require the ACTIVITY_RECOGNITION runtime permission on Android 10 (API level 29) and higher. Google also warns that the counter does not count steps unless some app keeps it registered, so unregistering stops the count.",
    "body": "These two constants are the lowest-level way an Android phone gives you steps: no Google Play services, no Health Connect, no account. Everything here is from Google's [Sensor reference](https://developer.android.com/reference/android/hardware/Sensor), the [motion sensors guide](https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion) and the [SensorManager reference](https://developer.android.com/reference/android/hardware/SensorManager), read 2026-10-03. Which step source a product should use across platforms is answered on [the step counting API page](/data/step-counting-api).\n\n## Side by side\n\n| | `TYPE_STEP_COUNTER` | `TYPE_STEP_DETECTOR` |\n| --- | --- | --- |\n| Constant value | 19 | 18 |\n| Added | API level 19 | API level 19 |\n| What `values[0]` holds | Steps since the last reboot while activated | Always 1.0, one event per step |\n| Reporting mode | `REPORTING_MODE_ON_CHANGE` | `REPORTING_MODE_SPECIAL_TRIGGER` |\n| Latency (motion guide) | \"up to 10 seconds\" | \"expected to be below 2 seconds\" |\n| Event timestamp | When the last step for that event was taken | When the foot hit the ground |\n| Permission | `android.permission.ACTIVITY_RECOGNITION` | `android.permission.ACTIVITY_RECOGNITION` |\n\nGoogle's own split: the detector \"is only for detecting every individual step as soon as it is taken, for example to perform dead reckoning. If you only need aggregate number of steps taken over a period of time, register for TYPE_STEP_COUNTER instead.\" The counter \"is ideal for fitness tracking applications.\"\n\n## The counter is a since-boot odometer\n\nThe reference text is precise: the counter \"returns the number of steps taken by the user since the last reboot while activated. The value is returned as a float (with the fractional part set to zero) and is reset to zero only on a system reboot.\" Your first reading after install might be a five- or six-digit number. It is not today's steps. It is an odometer, and your app computes deltas.\n\nThe baseline logic is ours, not Google's: store the first value you see with its timestamp, subtract it from later values, and treat a reading lower than your stored baseline as a reboot, after which the new value is the steps since boot.\n\n## It only counts while registered\n\nThe paragraph people skip: \"If you want to continuously track the number of steps over a long period of time, do NOT unregister for this sensor, so that it keeps counting steps in the background even when the AP is in suspend mode and report the aggregate count when the AP is awake. Application needs to stay registered for this sensor because step counter does not count steps if it is not activated.\"\n\nUnregistering in `onPause()` is therefore a product decision, not a battery optimisation. The steps walked while nothing was registered are not recorded anywhere you can read.\n\n## Batching\n\nBoth sensors may be backed by hardware FIFOs. `registerListener(listener, sensor, samplingPeriodUs, maxReportLatencyUs)` \"allows events to stay temporarily in the hardware FIFO (queue) before being delivered\", and Google says a positive latency reduces the interrupts the application processor receives, \"hence reducing power consumption\". `getFifoMaxEventCount()` tells you whether a sensor batches at all: \"If this value is zero it indicates that batch mode is not supported for this sensor.\" For the counter, the motion guide adds a battery recommendation: \"you should use the JobScheduler class to retrieve the current value from the step counter sensor at a specific interval\", keeping that interval \"as long as possible unless your app requires real-time data\".\n\nFor the detector, rate hints may be ignored: special-trigger events \"are reported as described in the description of the sensor. The rate passed to registerListener might not have an impact on the rate of event delivery.\"\n\n```kotlin\nclass StepCounterReader(context: Context) : SensorEventListener {\n    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager\n    private val counter: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)\n\n    /** Call only after ACTIVITY_RECOGNITION is granted (Android 10+). */\n    fun start(): Boolean {\n        val sensor = counter ?: return false            // no step counter on this device\n        return sensorManager.registerListener(\n            this, sensor,\n            SensorManager.SENSOR_DELAY_NORMAL,\n            60_000_000                                   // maxReportLatencyUs: allow 60 s of batching\n        )\n    }\n\n    override fun onSensorChanged(event: SensorEvent) {\n        val sinceBoot = event.values[0].toLong()         // since last reboot, not \"today\"\n        // persist (sinceBoot, event.timestamp) and diff against your stored baseline\n    }\n\n    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) = Unit\n}\n```\n\n## Hardware or software\n\nGoogle's motion guide says the step counter and step detector \"are either hardware-based or software-based\", and adds that \"The availability of the software-based sensors is more variable because they often rely on one or more hardware sensors to derive their data.\" `getDefaultSensor()` can return `null`; the sketch handles that by returning `false`.\n\n## Pitfalls\n\n- **Showing the raw value as today's steps.** It counts from the last reboot.\n- **Unregistering to save battery.** The counter stops counting. Use batching or periodic reads instead.\n- **Forgetting the runtime permission.** On Android 10 and higher both sensors need `ACTIVITY_RECOGNITION` granted, and Android 10's privacy notes say these two are \"The only built-in sensors on the device that require you to declare this permission\".\n- **Using the detector for totals.** Missed events are missed steps. Google points totals at the counter.\n- **Expecting the rate parameter to pace the detector.** Special-trigger sensors report when a step happens.\n- **Assuming history.** A sensor has no past. For stored, multi-day step data without Health Connect, see the [Recording API on mobile](/phone-sensors/android-recording-api); with it, the [Health Connect integration guide](/integrate/google-health-connect).\n\nThe iPhone counterpart, which does keep seven days of history, is [CMPedometer](/phone-sensors/cmpedometer).",
    "faqs": [
      {
        "q": "Why does TYPE_STEP_COUNTER return a huge number on the first reading?",
        "a": "Because it counts from the last reboot, not from when your app started. Google's Sensor reference says the step counter returns the number of steps taken since the last reboot while activated, and is reset to zero only on a system reboot. A phone that has been on for weeks can report tens of thousands on your first event. Store that first value as a baseline and display the difference, treating any lower reading as a sign the device rebooted."
      },
      {
        "q": "Does TYPE_STEP_COUNTER keep counting after my app unregisters the listener?",
        "a": "Not on the strength of your registration. Google's reference says an application needs to stay registered for this sensor because the step counter does not count steps if it is not activated, and tells apps that want long-term tracking not to unregister. Another app holding a registration may keep it running, but you cannot rely on that. If battery is the concern, register with a reporting latency so the hardware batches events, rather than unregistering."
      },
      {
        "q": "Which Android permission does the step counter sensor need?",
        "a": "android.permission.ACTIVITY_RECOGNITION, a dangerous permission added in API level 29. Google's motion sensors guide says you must declare it to use the step counter or step detector on devices running Android 10 (API level 29) or higher, and the Sensor reference states that both sensor types require it. Because it is a runtime permission, declaring it in the manifest is not enough: request it from the user before registering the listener."
      },
      {
        "q": "How long can the Android step counter take to report a step?",
        "a": "Up to 10 seconds, according to Google's motion sensors guide, which says the step counter has more latency (up to 10 seconds) but more accuracy than the step detector. The step detector's latency is expected to be below 2 seconds, but it reports single steps rather than a running total. If you also register with a positive maxReportLatencyUs, events can wait in the hardware FIFO for up to that long before delivery, by design."
      }
    ],
    "related": [
      {
        "href": "/data/step-counting-api",
        "label": "Which API should give you steps"
      },
      {
        "href": "/phone-sensors/android-recording-api",
        "label": "The Recording API on mobile"
      },
      {
        "href": "/phone-sensors/cmpedometer",
        "label": "CMPedometer on iPhone"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Google Health Connect integration guide"
      },
      {
        "href": "/build/step-challenge-app",
        "label": "Building a step challenge app"
      }
    ],
    "cta": {
      "pitch": "Android's sensor and permission rules shift with each API level, and step features are among the first to break. Our newsletter flags the platform changes that reach on-device step counting."
    }
  },
  {
    "slug": "android-activity-recognition-transition-api",
    "primaryQuery": "Activity Recognition Transition API",
    "h1": "The Activity Recognition Transition API and the ACTIVITY_RECOGNITION permission",
    "metaTitle": "Activity Recognition Transition API: Setup and Permissions",
    "metaDescription": "Subscribing to walking, running, cycling, driving and still transitions on Android, the two ACTIVITY_RECOGNITION permissions, and silent failures.",
    "updated": "2026-10-03",
    "answer": "The Activity Recognition Transition API, part of Google Play services location, notifies your app when the user enters or exits one of five activities: IN_VEHICLE, ON_BICYCLE, RUNNING, STILL or WALKING. You build ActivityTransition objects with ACTIVITY_TRANSITION_ENTER or ACTIVITY_TRANSITION_EXIT, register them with requestActivityTransitionUpdates() and a PendingIntent, and read an ActivityTransitionResult from the Intent you receive. Google's setup page asks for play-services-location 12.0.0 or higher and the com.google.android.gms.permission.ACTIVITY_RECOGNITION permission, while Android 10's privacy changes add the android.permission.ACTIVITY_RECOGNITION runtime permission and say the Activity Recognition API doesn't provide results unless the user has granted it.",
    "body": "A walking app that starts a session when someone starts walking, or a commute tracker that stops when they get in a car, wants transitions rather than a stream. This page uses Google's [transitions guide](https://developer.android.com/develop/sensors-and-location/location/transitions) and [Android 10 privacy changes](https://developer.android.com/about/versions/10/privacy/changes), read 2026-10-03. The `ActivityTransition` and `ActivityRecognitionClient` reference pages live on developers.google.com, which our research environment could not reach, so nothing here depends on them.\n\n## What you can subscribe to\n\nGoogle lists the supported activities as `DetectedActivity` constants: `IN_VEHICLE`, `ON_BICYCLE`, `RUNNING`, `STILL` and `WALKING`. Each subscription pairs one of them with `ACTIVITY_TRANSITION_ENTER` or `ACTIVITY_TRANSITION_EXIT`. Google's description of the design: \"Your app subscribes to a transition in activities of interest and the API notifies your app only when needed.\"\n\n## Two permissions with the same name\n\nThis is the confusing part, and the two Google pages describe it from different ends.\n\n| Permission | Where Google documents it | What it does |\n| --- | --- | --- |\n| `com.google.android.gms.permission.ACTIVITY_RECOGNITION` | Transitions guide, \"Set up your project\" | Declared in the manifest as the guide's setup step |\n| `android.permission.ACTIVITY_RECOGNITION` | Android 10 privacy changes; `Manifest.permission` (API level 29, dangerous) | Runtime permission \"for apps that need to detect the user's step count or classify the user's physical activity\" |\n\nThe Android 10 page connects them: \"Some libraries within Google Play services, such as the Activity Recognition API and the Google Fit API, don't provide results unless the user has granted your app this permission.\" For older targets there is an auto-grant: if your app targets Android 9 (API level 28) or lower, the system grants the platform permission \"as needed\" when the manifest includes the Play services permission and does not include the platform one. The transitions guide itself mentions only the Play services permission. On a current target, declare the platform permission and request it at runtime; that is the one the results depend on.\n\n## Register\n\n```kotlin\nval transitions = listOf(\n    ActivityTransition.Builder()\n        .setActivityType(DetectedActivity.WALKING)\n        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)\n        .build(),\n    ActivityTransition.Builder()\n        .setActivityType(DetectedActivity.WALKING)\n        .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)\n        .build(),\n)\nval request = ActivityTransitionRequest(transitions)\n\n// Android 12+ requires FLAG_MUTABLE or FLAG_IMMUTABLE to be set explicitly here.\n// Google's transitions guide does not say which one this API needs.\nval pendingIntent = PendingIntent.getBroadcast(context, 0, Intent(context, TransitionReceiver::class.java), mutabilityFlag)\n\nActivityRecognition.getClient(context)\n    .requestActivityTransitionUpdates(request, pendingIntent)\n    .addOnFailureListener { e -> /* most often: runtime permission not granted */ }\n```\n\nOn the mutability flag: the `PendingIntent` reference says that from Android 12 \"it will be required to explicitly specify the mutability of PendingIntents on creation with either FLAG_IMMUTABLE or FLAG_MUTABLE\", recommends `FLAG_IMMUTABLE`, and reserves `FLAG_MUTABLE` for cases where \"some functionality relies on modifying the underlying intent\". The transitions guide is silent on which applies. Our judgement: results arrive by being extracted from the Intent you supplied, so test a delivered transition with whichever flag you choose before shipping.\n\n## Receive\n\n```kotlin\nclass TransitionReceiver : BroadcastReceiver() {\n    override fun onReceive(context: Context, intent: Intent) {\n        if (ActivityTransitionResult.hasResult(intent)) {\n            val result = ActivityTransitionResult.extractResult(intent) ?: return\n            for (event in result.transitionEvents) {\n                // chronological, per Google's guide\n            }\n        }\n    }\n}\n```\n\nGoogle says the events \"are ordered in chronological order\" and gives the example that subscribing to enter and exit for `IN_VEHICLE` yields one event \"when the user starts driving, and another one when the user transitions to any other activity.\" On timing, the whole of Google's statement is: \"The latency of event detection might vary by device.\"\n\n## Deregister\n\n`removeActivityTransitionUpdates(pendingIntent)` stops delivery; Google's sample cancels the `PendingIntent` in the success listener.\n\n## Pitfalls\n\n- **Declaring only the Play services permission on a modern target.** The Android 10 page says results are withheld until the user grants `android.permission.ACTIVITY_RECOGNITION`.\n- **Expecting a fixed latency.** Google publishes none and says it varies by device.\n- **Leaving the PendingIntent mutability to chance.** It is mandatory from Android 12, and the guide does not choose for you.\n- **Ending a session the instant STILL arrives.** A walker at a crossing is still. Debounce exits before ending a session; this is judgement, not Google guidance.\n- **Expecting confidence values.** The transitions guide describes enter and exit events only. iOS exposes a confidence on each update; see [CMMotionActivityManager](/phone-sensors/cmmotionactivitymanager).\n\nFor counting steps rather than classifying activity, see the [step counter sensor](/phone-sensors/android-step-counter-sensor). For running a session in the background once a transition starts it, see [foregroundServiceType=\"health\"](/phone-sensors/foreground-service-type-health).",
    "faqs": [
      {
        "q": "Which activities can the Activity Recognition Transition API detect?",
        "a": "Five, according to Google's transitions guide: IN_VEHICLE, ON_BICYCLE, RUNNING, STILL and WALKING, all expressed as DetectedActivity constants. For each you can subscribe to ACTIVITY_TRANSITION_ENTER, ACTIVITY_TRANSITION_EXIT or both. The guide does not list other activity types as supported for transitions, so a subscription to anything else should be treated as unsupported unless Google's reference documentation says otherwise."
      },
      {
        "q": "Do I need both ACTIVITY_RECOGNITION permissions for the Transition API?",
        "a": "On a current target, the one that matters is android.permission.ACTIVITY_RECOGNITION, granted at runtime. Google's Android 10 privacy page says the Activity Recognition API doesn't provide results unless the user has granted that permission. The transitions guide's setup step names com.google.android.gms.permission.ACTIVITY_RECOGNITION; Android 10's page explains that apps targeting Android 9 or lower that declare only that Play services permission are auto-granted the platform permission as needed."
      },
      {
        "q": "Why does requestActivityTransitionUpdates succeed but no transitions ever arrive?",
        "a": "The documented cause to check first is the runtime permission: Google's Android 10 privacy page says Play services activity recognition doesn't provide results unless the user has granted android.permission.ACTIVITY_RECOGNITION. Next, the PendingIntent: from Android 12 its mutability must be set explicitly, and the transitions guide doesn't say which flag the API needs, so test delivery with your choice. Finally, Google says only that detection latency might vary by device, so wait for a real transition before concluding it is broken."
      },
      {
        "q": "How do I stop activity transition updates on Android?",
        "a": "Call removeActivityTransitionUpdates() on the ActivityRecognitionClient, passing the same PendingIntent you registered with. Google's transitions guide shows the call returning a Task and cancels the PendingIntent in the success listener, logging the error in the failure listener. Stopping updates when a feature is switched off also keeps your app's behaviour aligned with what the user agreed to when they granted the permission."
      }
    ],
    "related": [
      {
        "href": "/phone-sensors/cmmotionactivitymanager",
        "label": "CMMotionActivityManager on iOS"
      },
      {
        "href": "/phone-sensors/android-step-counter-sensor",
        "label": "Android step counter sensor"
      },
      {
        "href": "/phone-sensors/foreground-service-type-health",
        "label": "The health foreground service type"
      },
      {
        "href": "/build/running-app",
        "label": "Building a running app"
      }
    ],
    "cta": {
      "pitch": "Google Play services APIs and Android permissions change on different schedules, which is how transition features break without a code change. Our newsletter flags the changes that matter."
    }
  },
  {
    "slug": "android-recording-api",
    "primaryQuery": "Recording API on mobile",
    "h1": "The Recording API on mobile: steps without Health Connect",
    "metaTitle": "Recording API on Mobile: On-Device Steps Without an Account",
    "metaDescription": "Google's Recording API on mobile records steps, distance and calories on-device with no Google Account, keeps 10 days, and replaces Google Fit on Android.",
    "updated": "2026-10-03",
    "answer": "The Recording API on mobile is a Google Play services API that records fitness data from the phone in a battery-efficient way, with no Google Account, storing the data on the device. It records three data types, TYPE_STEP_COUNT_DELTA, TYPE_DISTANCE_DELTA and TYPE_CALORIES_EXPENDED, once your app subscribes, needs the android.permission.ACTIVITY_RECOGNITION permission, and makes up to 10 days of data since the latest subscription available. Google describes it as a replacement for the Google Fit Android API, and points apps that need health data from many sources to Health Connect instead.",
    "body": "For an Android app that wants a week of steps without asking users to install or configure anything, and without reading raw sensors itself, this is Google's answer. Everything here is from Google's [Recording API guide](https://developer.android.com/health-and-fitness/recording-api), read 2026-10-03. The `LocalRecordingClient` reference is hosted on developers.google.com, which our research environment could not reach, so claims below come from the guide only.\n\n## What it is, in Google's words\n\n\"The Recording API on mobile allows your app to record fitness data from a mobile device in a battery-efficient way. For example, use this API to record steps, similar to a pedometer retrieving step count data. This API is accountless, meaning it does not require a Google Account to use the service, and data is stored on-device.\"\n\nAnd its relationship to the old API: \"The Recording API on mobile is a replacement for the Google Fit Android API, which is being deprecated.\" The page also carries a banner: \"Google Fit APIs will be supported until the end of 2026.\" The wider shutdown is tracked on [the Google Fit shutdown page](/google-fit-shutdown).\n\n## The rules that shape your design\n\n| Rule | Google's wording |\n| --- | --- |\n| Data types | `TYPE_STEP_COUNT_DELTA`, `TYPE_DISTANCE_DELTA`, `TYPE_CALORIES_EXPENDED` |\n| Retention | \"data since the latest subscription - for up to 10 days - is accessible\" |\n| Subscription | \"Data is only available when there is an active subscription\" |\n| Unsubscribe | \"If a subscription is removed by calling unsubscribe, collected data won't be accessible.\" |\n| Permission | `android.permission.ACTIVITY_RECOGNITION` |\n| Play services | Must be at least `LOCAL_RECORDING_CLIENT_MIN_VERSION_CODE` |\n\nTen days is a rolling buffer, not storage. Google's advice: \"To reduce the risk of losing data, you can use WorkManager to periodically collect the data in the background.\"\n\n## Subscribe, then read\n\nGoogle's guide shows the dependency as `com.google.android.gms:play-services-fitness:21.2.0`; check for a newer version when you add it. The flow, trimmed from Google's samples:\n\n```kotlin\n// 1. Play services must be new enough (Google's guide calls this unqualified).\nval ok = isGooglePlayServicesAvailable(context, LocalRecordingClient.LOCAL_RECORDING_CLIENT_MIN_VERSION_CODE)\nif (ok != ConnectionResult.SUCCESS) return  // prompt the user to update Google Play services\n\n// 2. Subscribe once; recording continues in the background.\nval client = FitnessLocal.getLocalRecordingClient(context)\nclient.subscribe(LocalDataType.TYPE_STEP_COUNT_DELTA)\n\n// 3. Read daily totals for the past week.\nval end = LocalDateTime.now().atZone(ZoneId.systemDefault())\nval request = LocalDataReadRequest.Builder()\n    .aggregate(LocalDataType.TYPE_STEP_COUNT_DELTA)\n    .bucketByTime(1, TimeUnit.DAYS)\n    .setTimeRange(end.minusWeeks(1).toEpochSecond(), end.toEpochSecond(), TimeUnit.SECONDS)\n    .build()\nclient.readData(request).addOnSuccessListener { response ->\n    for (dataSet in response.buckets.flatMap { it.dataSets }) {\n        for (point in dataSet.dataPoints) { /* one bucket's steps */ }\n    }\n}\n```\n\nTwo details from the guide. On an old Play services version, Google says \"the system throws a ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED exception\", which is how the guide words a status code, so check the result before calling anything else. And \"The LocalRecordingClient continuously updates its collection of data. You can use readData to pull the latest numbers at any time.\"\n\n## Recording API or Health Connect\n\nThis page does not answer that across the board; [the step counting API page](/data/step-counting-api) does. The Recording API guide's own position: \"If your app needs to read other health and fitness data from various sources in addition to on-device steps, integrating with Health Connect is a better option. Health Connect also provides access to on-device steps natively on Android 14 (API level 34) and higher.\" Moving an existing Google Fit integration is covered in the [Google Fit to Health Connect migration guide](/migrate/google-fit-to-health-connect).\n\n## Pitfalls\n\n- **Unsubscribing as cleanup.** Google says collected data won't be accessible after you unsubscribe. Unsubscribe only when the feature is genuinely off.\n- **Reading once a fortnight.** Data older than 10 days since the latest subscription is gone. Schedule periodic reads.\n- **Skipping the version check.** Old Play services fail the calls.\n- **Forgetting the runtime permission.** `ACTIVITY_RECOGNITION` is a dangerous permission on Android 10 and higher.\n- **Expecting server sync.** The data is on-device and accountless. Your backend sees it only if your app uploads it.\n- **Expecting other metrics.** The guide lists three data types. Heart rate and workouts are Health Connect's territory.\n\nIf you would rather own the counting yourself, the raw sensor is covered on [Sensor.TYPE_STEP_COUNTER](/phone-sensors/android-step-counter-sensor).",
    "faqs": [
      {
        "q": "Does the Recording API on mobile need a Google Account?",
        "a": "No. Google's Recording API guide describes it as accountless, meaning it does not require a Google Account to use the service, and says the data is stored on-device. That is a deliberate difference from the Google Fit APIs it replaces. The trade-off is that nothing syncs to the cloud on its own; if your service needs the numbers server-side, your app has to read them and upload them itself."
      },
      {
        "q": "How many days of step data does the Recording API keep?",
        "a": "Up to 10 days. Google's guide says that once the recording subscription starts or is renewed, data since the latest subscription, for up to 10 days, is accessible, and that the LocalRecordingClient stores up to 10 days of data. Google suggests using WorkManager to collect the data periodically in the background to reduce the risk of losing it, which in practice means reading and persisting daily totals well inside that window."
      },
      {
        "q": "What happens to recorded steps if I unsubscribe from the Recording API?",
        "a": "You lose access to them. Google's guide says data is only available when there is an active subscription, and that if a subscription is removed by calling unsubscribe, collected data won't be accessible. Read and store anything you want to keep before unsubscribing, and do not unsubscribe as routine cleanup on logout or screen exit if you expect to show history later."
      },
      {
        "q": "Should I use the Recording API or Health Connect for Android steps?",
        "a": "Google's Recording API guide frames it this way: if your app needs other health and fitness data from various sources in addition to on-device steps, Health Connect is the better option, and Health Connect also provides on-device steps natively on Android 14 and higher. The Recording API suits an app that only needs recent on-device steps, distance or calories without an account. The cross-provider decision is covered on our step counting API page."
      }
    ],
    "related": [
      {
        "href": "/health-connect/permissions",
        "label": "Every Health Connect permission string"
      },
      {
        "href": "/data/step-counting-api",
        "label": "Which API should give you steps"
      },
      {
        "href": "/migrate/google-fit-to-health-connect",
        "label": "Google Fit to Health Connect"
      },
      {
        "href": "/google-fit-shutdown",
        "label": "The Google Fit shutdown"
      },
      {
        "href": "/phone-sensors/android-step-counter-sensor",
        "label": "Sensor.TYPE_STEP_COUNTER"
      }
    ],
    "cta": {
      "pitch": "Google is moving Android fitness data off the Google Fit APIs on a published timeline. Our newsletter tracks every dated step of that change and what it means for step features."
    }
  },
  {
    "slug": "foreground-service-type-health",
    "primaryQuery": "foregroundServiceType=\"health\"",
    "h1": "foregroundServiceType=\"health\": permissions, prerequisites and exceptions",
    "metaTitle": "foregroundServiceType=\"health\" and FOREGROUND_SERVICE_HEALTH",
    "metaDescription": "Declaring a health foreground service on Android 14+: the manifest type, FOREGROUND_SERVICE_HEALTH, runtime prerequisites, and each exception it can throw.",
    "updated": "2026-10-03",
    "answer": "From Android 14 (API level 34), a foreground service that tracks a workout declares android:foregroundServiceType=\"health\" in the manifest, holds the FOREGROUND_SERVICE_HEALTH permission, and passes FOREGROUND_SERVICE_TYPE_HEALTH to startForeground(). Google's runtime prerequisite is that the app either declares HIGH_SAMPLING_RATE_SENSORS or has been granted at least one of BODY_SENSORS (API 35 and lower), READ_HEART_RATE, READ_SKIN_TEMPERATURE, READ_OXYGEN_SATURATION or ACTIVITY_RECOGNITION. Google documents what happens otherwise: a missing manifest type raises MissingForegroundServiceTypeException, a missing type permission or unmet runtime prerequisite throws SecurityException, and passing a type the manifest does not declare throws IllegalArgumentException.",
    "body": "A phone app that tracks a walk or run with the screen off needs a foreground service, and from Android 14 that service needs a type. For fitness the type is `health`. Sources: Google's [foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types) page, the [Android 14 type requirement](https://developer.android.com/about/versions/14/changes/fgs-types-required), the [launch](https://developer.android.com/develop/background-work/services/fgs/launch) and [declare](https://developer.android.com/develop/background-work/services/fgs/declare) guides, the [background start restrictions](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start), and the `ServiceInfo` and `Manifest.permission` references, all read 2026-10-03.\n\n## The three names\n\n| Where | Value |\n| --- | --- |\n| Manifest attribute | `android:foregroundServiceType=\"health\"` |\n| Manifest permission | `android.permission.FOREGROUND_SERVICE_HEALTH` (API level 34, protection level normal) |\n| Constant for `startForeground()` | `ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH` (value 256) |\n\nGoogle's description of the type: \"Any long-running use cases to support apps in the fitness category such as exercise trackers.\" The Android 14 page says `health` is one of the types that \"are new in Android 14\", and that the per-type permissions \"are defined as normal permissions and are granted by default. Users cannot revoke these permissions.\" You still need the base `FOREGROUND_SERVICE` permission as well.\n\n## The runtime prerequisite\n\nThe service types page says at least one of these must be true:\n\n- Declare the `HIGH_SAMPLING_RATE_SENSORS` permission in your manifest.\n- Request and be granted at least one of: `BODY_SENSORS` on API 35 and lower, `READ_HEART_RATE`, `READ_SKIN_TEMPERATURE`, `READ_OXYGEN_SATURATION`, `ACTIVITY_RECOGNITION`.\n\nThe `ServiceInfo` reference for `FOREGROUND_SERVICE_TYPE_HEALTH` gives a different list: `ACTIVITY_RECOGNITION`, `HIGH_SAMPLING_RATE_SENSORS`, `READ_HEART_RATE`, `READ_SKIN_TEMPERATURE`, `READ_OXYGEN_SATURATION`, `READ_BLOOD_PRESSURE`, `READ_HEART_RATE_VARIABILITY`, `READ_RESPIRATORY_RATE` and `READ_VO2_MAX`, without `BODY_SENSORS`. The overlap is what both pages agree on, and for a phone step or walk tracker the obvious member is `ACTIVITY_RECOGNITION`. The `BODY_SENSORS` line changes on Android 16; see [the Android 16 health permissions page](/phone-sensors/android-16-body-sensors-health-permissions).\n\n## What Android throws\n\n| Situation | Documented result | Source |\n| --- | --- | --- |\n| Service has no type in the manifest, and none passed | `MissingForegroundServiceTypeException` on `startForeground()` | Android 14 change page; declare guide |\n| `FOREGROUND_SERVICE_HEALTH` not declared | `SecurityException` | Android 14 change page |\n| Runtime prerequisite not met | `SecurityException` after `startForeground()` | Android 14 change page; launch guide |\n| Type passed that the manifest does not declare | `IllegalArgumentException` | Launch guide |\n| Starting from the background on Android 12+ without an exemption | Not allowed; Google's sample catches `ForegroundServiceStartNotAllowedException` | Launch guide |\n\nOn the runtime-prerequisite case Google adds that the exception \"prevents the foreground service from starting, might cause a running foreground service to be removed from the foreground process state, and might cause your app to crash.\" Order matters: \"Permissions must be requested and granted before the app attempts to call startForeground().\"\n\n## Manifest and start\n\n```xml\n<uses-permission android:name=\"android.permission.FOREGROUND_SERVICE\" />\n<uses-permission android:name=\"android.permission.FOREGROUND_SERVICE_HEALTH\" />\n<uses-permission android:name=\"android.permission.ACTIVITY_RECOGNITION\" />\n\n<application>\n    <service\n        android:name=\".WalkTrackingService\"\n        android:foregroundServiceType=\"health\"\n        android:exported=\"false\" />\n</application>\n```\n\n```kotlin\n// Inside WalkTrackingService.onStartCommand(), after ACTIVITY_RECOGNITION was granted in the UI:\nServiceCompat.startForeground(\n    this,\n    NOTIFICATION_ID,\n    notification,\n    ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH\n)\n```\n\nGoogle recommends the `ServiceCompat` form of `startForeground()`, \"available in androidx-core 1.12 and higher\". If a session later needs GPS, call `startForeground()` again with both types, which Google's Android 14 page describes with a running-tracker example; the service must then meet the requirements \"of all types\".\n\n## Starting from the background\n\nTwo rules stack. Apps targeting Android 12 or higher \"are not allowed to start a foreground service while the app is in the background, with a few specific exceptions.\" And `BODY_SENSORS`-based health services are subject to while-in-use limits: Google says you cannot create one \"that uses body sensors while your app is in the background\" unless granted `BODY_SENSORS_BACKGROUND` (API levels 33 to 35) or `READ_HEALTH_DATA_IN_BACKGROUND` (API level 36). The restrictions page adds that this \"doesn't apply if it's a health service that needs different permissions, like ACTIVITY_RECOGNITION\", and warns that `checkSelfPermission()` is no guide here, because for a while-in-use permission it \"returns PERMISSION_GRANTED even if the app is in the background.\"\n\n## Play Console\n\n\"If your app targets Android 14 or higher, you'll need to declare your app's foreground service types in the Play Console's app content page (Policy > App content).\" The policy itself is out of scope here; the [compliance section](/compliance) covers store rules.\n\n## Pitfalls\n\n- **Declaring the type but not the permission.** Two separate manifest entries, two separate failures.\n- **Requesting the runtime permission after `startForeground()`.** Ask first; the system checks at start.\n- **Trusting `checkSelfPermission()` from the background.** For while-in-use permissions it reports what the app has while in use.\n- **Passing a type the manifest lacks.** `IllegalArgumentException`.\n- **Reading one list of prerequisites as complete.** The guide and the `ServiceInfo` reference differ; design for the overlap.\n\nOn Wear OS, Google's Health Services guide declares `android:foregroundServiceType=\"health|location\"` for exercise recording; that side is on [Wear OS exercise tracking](/watch-apps/wear-os-exercise-tracking).",
    "faqs": [
      {
        "q": "What exception does Android throw when a health foreground service has no type in the manifest?",
        "a": "MissingForegroundServiceTypeException. Google's Android 14 foreground service page says that if an app targeting Android 14 doesn't define types for a service in the manifest, the system raises it when startForeground() is called, and that if no type is passed at runtime the type defaults to the manifest's. Declare android:foregroundServiceType=\"health\" on the service element. A missing FOREGROUND_SERVICE_HEALTH permission is a different failure, a SecurityException."
      },
      {
        "q": "Is FOREGROUND_SERVICE_HEALTH a runtime permission?",
        "a": "No. The Manifest.permission reference lists FOREGROUND_SERVICE_HEALTH with protection level normal, added in API level 34, and Google's Android 14 page says the per-type foreground service permissions are normal permissions, granted by default, that users cannot revoke. You only declare it. What does need a runtime grant is the type's prerequisite, such as ACTIVITY_RECOGNITION, unless you rely on declaring HIGH_SAMPLING_RATE_SENSORS instead."
      },
      {
        "q": "Can a step-tracking app run a health foreground service with only ACTIVITY_RECOGNITION?",
        "a": "Google's documentation says yes. ACTIVITY_RECOGNITION appears both in the foreground service types page's list of runtime prerequisites for the health type and in the ServiceInfo reference's list for FOREGROUND_SERVICE_TYPE_HEALTH. Google's background-start restrictions page also notes that the while-in-use problem affecting BODY_SENSORS does not apply to a health service that needs different permissions, like ACTIVITY_RECOGNITION. The general Android 12 rule against starting foreground services from the background still applies."
      },
      {
        "q": "Can I start a health foreground service while my app is in the background?",
        "a": "Usually not. Google's launch guide says apps targeting Android 12 or higher are not allowed to start a foreground service from the background, with a few specific exceptions, and its sample catches ForegroundServiceStartNotAllowedException. For a health service that relies on body sensors there is a second limit: Google says it cannot be created in the background unless the app holds BODY_SENSORS_BACKGROUND on API 33 to 35 or READ_HEALTH_DATA_IN_BACKGROUND on API 36. Start the service while the user is in your app."
      }
    ],
    "related": [
      {
        "href": "/phone-sensors/android-16-body-sensors-health-permissions",
        "label": "Android 16 health permissions"
      },
      {
        "href": "/phone-sensors/android-activity-recognition-transition-api",
        "label": "Activity Recognition Transition API"
      },
      {
        "href": "/watch-apps/wear-os-exercise-tracking",
        "label": "Wear OS exercise tracking"
      },
      {
        "href": "/devices/wear-os-health-services",
        "label": "Wear OS Health Services"
      }
    ],
    "cta": {
      "pitch": "Foreground service rules have changed in Android 12, 14 and 16, and each change broke fitness apps that had not moved. Our newsletter flags the next one before your users find it."
    }
  },
  {
    "slug": "android-16-body-sensors-health-permissions",
    "primaryQuery": "Android 16 BODY_SENSORS",
    "h1": "Android 16: BODY_SENSORS gives way to android.permission.health",
    "metaTitle": "Android 16 BODY_SENSORS Change: READ_HEART_RATE and More",
    "metaDescription": "For apps targeting Android 16, APIs that needed BODY_SENSORS now need android.permission.health permissions such as READ_HEART_RATE. What changed and why.",
    "updated": "2026-10-03",
    "answer": "For apps targeting Android 16 (API level 36) or higher, Google's behaviour-changes page says any API that previously required BODY_SENSORS or BODY_SENSORS_BACKGROUND now requires the corresponding granular health permission, the same permissions that guard Health Connect. The affected surfaces Google lists are HEART_RATE_BPM in Health Services on Wear OS, Sensor.TYPE_HEART_RATE, heartRateAccuracy and heartRateBpm in Wear OS ProtoLayout, and FOREGROUND_SERVICE_TYPE_HEALTH. Request READ_HEART_RATE (or the matching permission for SpO2 or skin temperature) instead of BODY_SENSORS for while-in-use access, and READ_HEALTH_DATA_IN_BACKGROUND instead of BODY_SENSORS_BACKGROUND. Phone apps that migrate must also declare an activity showing their privacy policy, and Google warns the permission is revoked if they do not.",
    "body": "This is a narrow change with a wide blast radius: one permission that heart-rate features relied on since API level 20 is replaced by a family of Health Connect permissions. This page states only what Google's [Android 16 behaviour changes](https://developer.android.com/about/versions/16/behavior-changes-16), the [HealthPermissions reference](https://developer.android.com/reference/android/health/connect/HealthPermissions), the Health Connect [get-started guide](https://developer.android.com/health-and-fitness/health-connect/get-started), the Health Services [active data guide](https://developer.android.com/health-and-fitness/health-services/active-data) and the [foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types) page say, as read on 2026-10-03.\n\n## What Google says changed\n\n\"For apps targeting Android 16 (API level 36) or higher, BODY_SENSORS permissions use more granular permissions under android.permissions.health, which Health Connect also uses. As of Android 16, any API previously requiring BODY_SENSORS or BODY_SENSORS_BACKGROUND requires the corresponding android.permissions.health permission instead.\"\n\nNote the spelling: the behaviour-changes page writes `android.permissions.health`. The permission strings in the `HealthPermissions` reference begin `android.permission.health.`, singular. Use the reference's strings in your manifest.\n\n## What it affects, per Google\n\n- `HEART_RATE_BPM` from Health Services on Wear OS\n- `Sensor.TYPE_HEART_RATE` from Android Sensor Manager\n- `heartRateAccuracy` and `heartRateBpm` from ProtoLayout on Wear OS\n- `FOREGROUND_SERVICE_TYPE_HEALTH`, \"where the respective android.permission.health permission is needed in place of BODY_SENSORS\"\n\n## The replacements\n\n| Before | From API level 36 | Constant string (HealthPermissions reference) | Added |\n| --- | --- | --- | --- |\n| `BODY_SENSORS` for heart rate | `READ_HEART_RATE` | `android.permission.health.READ_HEART_RATE` | API level 34 |\n| `BODY_SENSORS` for SpO2 | `READ_OXYGEN_SATURATION` | `android.permission.health.READ_OXYGEN_SATURATION` | API level 34 |\n| `BODY_SENSORS` for skin temperature | `READ_SKIN_TEMPERATURE` | `android.permission.health.READ_SKIN_TEMPERATURE` | API level 35 |\n| `BODY_SENSORS_BACKGROUND` | `READ_HEALTH_DATA_IN_BACKGROUND` | `android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND` | API level 35 |\n\nGoogle's guidance in its own words: \"For while-in-use monitoring of Heart Rate, SpO2, or Skin Temperature: request the granular permission under android.permissions.health, such as READ_HEART_RATE instead of BODY_SENSORS,\" and \"For background sensor access: request READ_HEALTH_DATA_IN_BACKGROUND instead of BODY_SENSORS_BACKGROUND.\" The reference marks each of these as protection level dangerous, so they are runtime grants.\n\n## The privacy policy requirement on phones\n\n\"Mobile apps migrating to use the READ_HEART_RATE and other granular permissions must also declare an activity to display the app's privacy policy. This is the same requirement as Health Connect.\" Then: \"Failure to provide the rationale for mobile apps will result in the permission being revoked.\"\n\nHealth Connect's get-started guide shows the shape: an activity handling `androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE` for Android 13 and lower, plus, from Android 14, an `activity-alias` guarded by `android.permission.START_VIEW_PERMISSION_USAGE` that handles `android.intent.action.VIEW_PERMISSION_USAGE` with the category `android.intent.category.HEALTH_PERMISSIONS`. The guide adds: \"The activity must display the same privacy policy you provide for your app in the Google Play Console.\" Wiring Health Connect itself is covered in the [Health Connect integration guide](/integrate/google-health-connect).\n\n## Choosing the permission at runtime\n\nThe foreground service types page now lists the prerequisite as \"BODY_SENSORS on API 35 and lower\", and the Health Services guide tells Wear OS apps to confirm \"runtime permissions for body sensors (API level 35 or lower) or heart rate (API level 36+)\". A sketch of that split:\n\n```kotlin\nval heartRatePermission =\n    if (Build.VERSION.SDK_INT >= 36) HealthPermissions.READ_HEART_RATE  // android.permission.health.READ_HEART_RATE\n    else Manifest.permission.BODY_SENSORS\n\n// request heartRatePermission at runtime with your existing permission flow\n```\n\nGoogle's behaviour-changes page frames the change by target SDK and the guides frame it by API level. Test both an Android 16 device and an older one before shipping, with your real target.\n\n## What is not on Google's list\n\nStep sensors. `Sensor.TYPE_STEP_COUNTER` and `TYPE_STEP_DETECTOR` were documented under `ACTIVITY_RECOGNITION`, not `BODY_SENSORS`, and Google's Android 16 list names neither; see the [step counter page](/phone-sensors/android-step-counter-sensor). The `Manifest.permission` reference entry for `BODY_SENSORS`, as we read it, still describes the permission without mentioning Android 16.\n\n## Pitfalls\n\n- **Copying the behaviour-changes spelling.** Use `android.permission.health.*` from the reference.\n- **Migrating the permission and not the privacy policy activity.** Google says the permission is revoked.\n- **Dropping BODY_SENSORS for older devices.** The prerequisite lists still name it for API 35 and lower.\n- **Forgetting background access.** `READ_HEART_RATE` does not cover background reads; `READ_HEALTH_DATA_IN_BACKGROUND` is the replacement for `BODY_SENSORS_BACKGROUND`.\n- **Leaving a health foreground service on the old permission.** `FOREGROUND_SERVICE_TYPE_HEALTH` is on Google's affected list; see [foregroundServiceType=\"health\"](/phone-sensors/foreground-service-type-health).\n\nWatch apps feel this first; the Wear OS side is on [Wear OS Health Services](/devices/wear-os-health-services) and [Wear OS exercise tracking](/watch-apps/wear-os-exercise-tracking).",
    "faqs": [
      {
        "q": "What replaces BODY_SENSORS_BACKGROUND on Android 16?",
        "a": "READ_HEALTH_DATA_IN_BACKGROUND, whose constant string is android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND. Google's Android 16 behaviour-changes page tells apps that need background sensor access to request it instead of BODY_SENSORS_BACKGROUND, and the HealthPermissions reference describes it as allowing an application to read health data of any type in the background, with protection level dangerous. Older API levels still use the old pair."
      },
      {
        "q": "Does the Android 16 health permission change affect the step counter sensor?",
        "a": "Google's list does not name it. The Android 16 behaviour-changes page lists Health Services HEART_RATE_BPM, Sensor.TYPE_HEART_RATE, two ProtoLayout heart-rate sources and FOREGROUND_SERVICE_TYPE_HEALTH as affected. The step counter and step detector sensors are documented as requiring android.permission.ACTIVITY_RECOGNITION, not BODY_SENSORS, so the replacement of BODY_SENSORS does not touch the permission they were documented under."
      },
      {
        "q": "Why was my app's READ_HEART_RATE permission revoked on Android 16?",
        "a": "The documented cause is a missing privacy policy activity. Google's Android 16 page says mobile apps migrating to READ_HEART_RATE and the other granular permissions must declare an activity that displays the app's privacy policy, the same requirement as Health Connect, and that failure to provide the rationale will result in the permission being revoked. Health Connect's get-started guide shows the intent filters to declare and says the activity must show the same policy you give Google Play."
      },
      {
        "q": "Which permission does Sensor.TYPE_HEART_RATE need on Android 16?",
        "a": "For apps targeting Android 16 (API level 36) or higher, Google lists Sensor.TYPE_HEART_RATE among the APIs that now require the corresponding health permission instead of BODY_SENSORS. For while-in-use heart rate that is READ_HEART_RATE, android.permission.health.READ_HEART_RATE; for background access, READ_HEALTH_DATA_IN_BACKGROUND. On API 35 and lower, Google's foreground service guidance still names BODY_SENSORS."
      }
    ],
    "related": [
      {
        "href": "/watch-apps/wear-os-exerciseclient-kotlin",
        "label": "ExerciseClient in Kotlin on Wear OS"
      },
      {
        "href": "/health-connect/permissions",
        "label": "Every Health Connect permission string"
      },
      {
        "href": "/phone-sensors/foreground-service-type-health",
        "label": "foregroundServiceType=\"health\""
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Google Health Connect integration guide"
      },
      {
        "href": "/devices/wear-os-health-services",
        "label": "Wear OS Health Services"
      },
      {
        "href": "/watch-apps/wear-os-exercise-tracking",
        "label": "Wear OS exercise tracking"
      }
    ],
    "cta": {
      "pitch": "Health permissions on Android changed shape in API level 36, and the next release will move them again. Our newsletter flags the permission changes that break heart-rate and workout features."
    }
  }
];
