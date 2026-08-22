# Watch app pre-flight checklist

Before you ship a watchOS or Wear OS fitness app, these are the decisions the
platform makes for you and the ones it leaves to you. Each item is the
question one page on AIFitnessAPI owns, with that page's own opening answer
and a link to the full treatment.

There are no battery, performance or accuracy numbers anywhere in this file,
for the same reason there are none on the pages: battery is the defining
constraint of this platform, and a figure we cannot measure would be worse
than none.

Generated from the published pages by `scripts/build-kit.mjs`.

## Anatomy of a watchOS Workout App

**build apple watch workout app**

A watchOS workout app is two Apple objects plus a state machine you write yourself. HKWorkoutSession is the live half: Apple describes it as a session that tracks a person's workout, and documents that it fine-tunes Apple Watch's sensors for the activity you declare, with all workout sessions generating high-frequency heart rate samples. HKLiveWorkoutBuilder is the record-keeping half, described by Apple as a builder object that constructs a workout incrementally based on live data from an active workout session, and used to create the HKWorkout sample while the session is running. The work your app owns is the lifecycle around them: session state transitions, pause and resume, and the case where the session ends without you asking, because Apple documents that Apple Watch runs one workout session at a time and a second workout ending yours. Treat session state as the single source of truth and render every screen from it.

https://aifitnessapi.com/watch-apps/watchos-workout-app-anatomy

## HealthKit on Apple Watch: What Changes on the Wrist

**healthkit on apple watch**

HealthKit on Apple Watch is the same framework as on iPhone doing a different job. On the phone it is mostly a store you query for history; on the watch it is the store where a workout lands, while the live numbers during that workout come from an active workout session instead. Apple documents HKLiveWorkoutBuilder as the object that creates the HKWorkout sample during an active HKWorkoutSession, so the write is the end of the session rather than a separate sync step. Authorization still behaves the way it does everywhere else on Apple platforms, including the part that catches everybody: the system does not tell you whether read access was granted, so an empty query result means no data or no permission and the two are indistinguishable by design. Design the watch app to read live from the session and treat the store as history, not as a stream.

https://aifitnessapi.com/watch-apps/healthkit-on-apple-watch

## Background Execution on Apple Watch: Two Mechanisms

**apple watch background execution workout**

Apple Watch has two ways to keep your app running after somebody drops their wrist, and which one you get depends on what your app is. A training app uses an active HKWorkoutSession, which Apple documents as supporting background execution while the device is locked. Everything else uses WKExtendedRuntimeSession, described by Apple as a session that continues to run your app after the user has stopped interacting, with the app able to keep talking to Bluetooth devices, process data, or play sounds or haptics even after the screen turns off. Apple documents four extended runtime types — self care, mindfulness, physical therapy, and smart alarm — selected by enabling the matching Background Modes capability, and workout is deliberately not among them because workouts belong to HKWorkoutSession. That single fact is why a rehab or meditation app on watchOS takes a different architectural path than a training app.

https://aifitnessapi.com/watch-apps/apple-watch-background-execution

## WorkoutKit: Scheduling Workouts Into Apple's Workout App

**workoutkit scheduled workouts apple watch**

WorkoutKit is Apple's framework for creating, previewing, and syncing workout compositions to the Workout app. It gives you four composition types — CustomWorkout, SingleGoalWorkout, PacerWorkout and SwimBikeRunWorkout — wrapped in a WorkoutPlan that can be previewed or handed over with openInWorkoutApp(). With the user's permission, obtained through WorkoutScheduler.requestAuthorization() and applied with WorkoutScheduler.schedule(_:at:), scheduled compositions sync to Apple Watch and, as Apple documents, appear in a dedicated space in the Workout app carrying your app's icon and name. Apple lists WorkoutKit from iOS, iPadOS and Mac Catalyst 17.0 and watchOS 10.0. For a coaching product that changes the delivery question entirely: today's session can be waiting in Apple's own Workout app instead of requiring somebody to open yours.

https://aifitnessapi.com/watch-apps/workoutkit-scheduled-workouts

## Mirroring an Apple Watch Workout to iPhone

**mirror apple watch workout to iphone**

Apple documents that a workout session supports mirroring the workout to a companion iPhone, along with Live Activities on the Lock Screen and Siri control for starting, pausing, resuming and canceling. That turns a watch app into a multidevice product, and the architectural decision it forces is which device owns session state. Our recommendation is that the session on the watch is the single source of truth and everything else — the phone screen, the Live Activity, a Siri command — is either a view of it or a command sent to it. Two devices each keeping their own idea of whether a workout is paused is the failure mode, and it produces bugs that only reproduce with two devices, one user and bad timing.

https://aifitnessapi.com/watch-apps/mirroring-workouts-to-iphone

## Wear OS Fitness App Anatomy: Standalone or Not (2026)

**wear os fitness app standalone**

A Wear OS app declares whether it is standalone with a com.google.android.wearable.standalone meta-data value in its manifest. Google defines a standalone app as one that does not require a phone app for core features, where "Open on phone" prompts are acceptable only if the app also provides an alternative means — such as a shortlink or QR code — to complete the function without a tethered phone; a non-standalone app depends on a phone app for a core feature such as authentication. The value is not just documentation: Google validates its accuracy during app serving, it affects visibility in the Play Store on untethered devices, and non-standalone apps as well as apps incorrectly designated standalone are not available to users on those devices. Even when the value is false, the watch app can be installed before the phone app, so the watch has to behave sensibly on its own regardless. For a fitness app the deciding feature is almost always authentication, because everything else — the exercise session, local history, network calls — already runs on the wrist.

https://aifitnessapi.com/watch-apps/wear-os-app-anatomy

## Wear OS Exercise Tracking with Health Services (2026)

**wear os health services exercise tracking**

On Wear OS 3 and later, Health Services is the platform service a watch app uses to track exercise, sitting between the app and the device's sensors and algorithms. Google documents ExerciseClient as the API for managing workouts, setting exercise goals, listening for exercise state updates and receiving rapid data updates during active exercise, across metrics it lists as heart rate, distance, calories, elevation, floors, speed, pace and more. PassiveMonitoringClient handles the other half: receiving updates about a data type or an event, which Google says suits long-lived experiences where data updates are relatively infrequent. Google also states that Health Services conserves battery using sensor configurations optimized for power efficiency and verifies data consistency across all applications on the same device by using standardized platform computations. Build the app's state around the exercise state updates it receives rather than around a flag your own UI sets, and pair a Bluetooth sensor directly only when the signal comes from hardware the watch does not have.

https://aifitnessapi.com/watch-apps/wear-os-exercise-tracking

## Wear OS Tiles for a Fitness App (2026)

**wear os tile fitness app**

A Wear OS tile is a glanceable surface in a carousel that Google describes as revealed by a swipe on the watch face, with additional swipes switching between tiles. Google frames the purpose as showing a small amount of key information that users can read through after they glance at a tile for a few seconds. Tiles are built declaratively with Jetpack's protolayout and tiles libraries rather than with Compose or Views, and because they render in a separate, remote environment they need different approaches to load, display and update data. Two constraints drive the design: tiles themselves cannot be scrolled, and Google's guidance is not to fetch content frequently or start long-running asynchronous work in the tile service — schedule with WorkManager and cache locally instead. For a fitness app, our judgement is that a tile should start the workout the user actually does and show one figure for today's progress, with everything else a tap away.

https://aifitnessapi.com/watch-apps/wear-os-tiles

## Wear OS Phone Sync: The Data Layer and Its Limits (2026)

**wear os data layer sync phone**

The Wear OS Data Layer synchronizes data between a watch and a paired device: Google documents DataClient as the API for components to read or write a DataItem or an Asset, with assets automatically deduplicated so the same bytes are not transferred twice. Google is explicit that it is meant to synchronize data and not serve as a storage mechanism, and advises keeping your own copy — for example in a Room database. The constraint that should drive your architecture is that the Data Layer works only with phones running Android or with Wear OS watches: Google states that if a Wear OS device is paired with an iOS device the API will not work, and that for this reason you should not use it as the primary way to communicate with a network. The practical answer is to have the watch talk to your backend directly, with its own local queue and its own credentials, and to treat the phone link as an optimization that some users will never have.

https://aifitnessapi.com/watch-apps/wear-os-phone-sync

## watchOS vs Wear OS: Building the App That Runs on the Watch

**watchos vs wear os development fitness**

On watchOS the workout owns the app: Apple documents HKWorkoutSession as a session that tracks a person's workout, and it drives both the exercise lifecycle and the background execution that comes with it, while HKLiveWorkoutBuilder turns the live session into a stored workout sample. On Wear OS 3 and later the equivalent authority is Health Services, whose ExerciseClient manages the workout, exercise goals, state updates and rapid data updates, with PassiveMonitoringClient for long-lived experiences whose updates are infrequent. The glanceable surfaces are not equivalent either: Apple's WidgetKit builds complications for the watch face and the Smart Stack, while Wear OS tiles are built declaratively on Jetpack's protolayout and tiles libraries and, in Google's words, cannot be scrolled. Pairing is the sharpest difference, because an Apple Watch pairs with an iPhone but a Wear OS watch may be paired with an iOS phone, where Google documents that the Data Layer API will not work at all. Distribution differs too: a Wear OS app declares a standalone flag that Google validates during app serving and that affects Play Store visibility on untethered devices.

https://aifitnessapi.com/watch-apps/watch-platform-differences

## Watch App Battery: The Constraint That Decides Scope

**watch app battery drain fitness**

Battery is the constraint that decides what a watch app can be, and the levers that matter are documented rather than guessed. On watchOS, the activity type you declare on the workout session configures hardware: Apple states that the session fine-tunes Apple Watch's sensors for the specified activity, and that an outdoor cycling activity generates accurate location data while an indoor cycling activity does not. On Wear OS, Google documents that Health Services conserves battery by using sensor configurations optimized for power efficiency, and that PassiveMonitoringClient suits long-lived experiences whose data updates are relatively infrequent, so you are not holding an active exercise open all day. Glanceable surfaces are a recurring workload rather than a free one, and Google's tile guidance says not to fetch content frequently or start long-running asynchronous work in the tile service, using WorkManager and a local cache instead. We publish no battery figures, because the profile depends on your sensors, your screen behavior and the user's hardware, and the only way to know it is to measure a repeatable session on a real device.

https://aifitnessapi.com/watch-apps/watch-app-battery

## Testing Watch Apps Without a Watch on Every Desk

**test watch app without device**

A simulator or emulator cannot give you real sensors, a real Bluetooth link, real pairing or a real battery profile, so treat a physical device as the reliable target for those four and verify separately what your current tooling does support, with the version written down. Everything else can run in CI, but only if the sample stream enters your pipeline through an interface you can swap — the same seam argument as testing camera features without a device. Behind that interface, a watchOS workout session, Wear OS Health Services and a recorded file all look alike: a source of timestamped samples that eventually ends. Automate session assembly, derived metrics, goal progression, day boundaries and reconciliation against recorded sessions and fixtures. Reserve a written device pass for pairing, reconnection, background and lifecycle transitions, permission flows, and thermal and battery behavior.

https://aifitnessapi.com/watch-apps/testing-watch-apps

12 items. Full cluster: https://aifitnessapi.com/watch-apps
