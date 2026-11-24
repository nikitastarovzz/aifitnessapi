---
applyTo: "**"
---

# HealthKit rules for AI coding assistants

> Generated 2026-11-24 by https://aifitnessapi.com from its HealthKit dataset, read from Apple's documentation on 2026-10-02 (https://aifitnessapi.com/healthkit-identifiers). Every name below is copied from the vendors' documentation or source; regenerate or re-download from https://aifitnessapi.com/kit/ai-rules/ (listed at https://aifitnessapi.com/developers#ai-rules). Quoted sentences are the vendors' own words.

Use these rules whenever you write or review code that reads or writes Apple HealthKit, in Swift, Objective-C, or a React Native, Flutter or Capacitor wrapper.

## Rules

- Use only the identifier names in the tables below, spelled exactly (Swift case, or the Objective-C constant `HKQuantityTypeIdentifierStepCount` style). If the type you need is not listed, say so; never build a name from a similar one.
- Decide sum vs average from the Aggregation column, which is copied from Apple's own sentence for each type: cumulative → `HKStatisticsOptions.cumulativeSum` and `sumQuantity()`; discrete → `.discreteAverage`, `.discreteMin`, `.discreteMax` and `averageQuantity()`, `minimumQuantity()`, `maximumQuantity()`. Never pass `.cumulativeSum` for a discrete type.
- Apple states no aggregation style for `appleSleepingBreathingDisturbances`, `estimatedWorkoutEffortScore`, `heartRateVariabilityRMSSD`, `workoutEffortScore`: do not assume one.
- Read a quantity with `quantity.doubleValue(for:)` in a unit of the type's unit family (column below). HealthKit's percent unit is a fraction; Apple: "Percent measures a value between 0.0 and 1.0."
- Decode a category sample's `value` with the value enum listed for its identifier; the raw integer means nothing on its own.
- On-device on iPhone and Apple Watch — there is no cloud or server endpoint to call.
- Authorization is per data type, requested with requestAuthorization(toShare:read:).
- Your app cannot tell whether a read permission was granted or denied — a denied read simply returns only the samples your own app wrote. Design for empty results.
- Gate availability on HKHealthStore.isHealthDataAvailable().
- HRV: The HRV Apple Watch records into HealthKit is SDNN, while Health Connect's record is RMSSD. They are different measures and are not interconvertible — do not normalize one into the other. iOS 27 added HKQuantityTypeIdentifier.heartRateVariabilityRMSSD, but as of October 2, 2026 Apple's documentation gives it no description, so it is not paired with Health Connect's record here: what it holds, how it is computed and whether Apple Watch writes it are not stated.

## Deprecated identifiers

Do not write new code against these; Apple's note is quoted.

- `audioExposureEvent`: Use environmentalAudioExposureEvent instead.

## Read-only types

Apple states apps cannot save these; only read them.

`appleSleepingWristTemperature` ("These samples are read-only."), `appleWalkingSteadiness` ("Walking Steadiness samples are read-only."), `appleWalkingSteadinessEvent` ("Walking Steadiness events are read-only."), `atrialFibrillationBurden` ("These samples are read-only."), `environmentalAudioExposureEvent` ("Environmental audio exposure event samples are read-only."), `highHeartRateEvent` ("The high heart rate samples are read-only."), `infrequentMenstrualCycles` ("These samples are read-only."), `irregularHeartRhythmEvent` ("The irregular rhythm samples are read-only."), `irregularMenstrualCycles` ("These samples are read-only."), `lowCardioFitnessEvent` ("Low-cardio fitness event samples are read-only."), `lowHeartRateEvent` ("The low heart rate samples are read-only."), `persistentIntermenstrualBleeding` ("These samples are read-only."), `prolongedMenstrualPeriods` ("These samples are read-only."), `walkingHeartRateAverage` ("You cannot save your own walking heart rate samples; however, you can query these samples.").

## HKError cases

What Apple says each case means, and the page on this site that covers handling it. Full reference: [HKError codes](https://aifitnessapi.com/healthkit-errors).

- `HKError.Code.noError`: No error occurred. [Reference](https://aifitnessapi.com/healthkit-errors#err-noerror)
- `HKError.Code.errorHealthDataUnavailable`: The user accessed HealthKit on an unsupported device. [Fix](https://aifitnessapi.com/fix/healthkit-health-data-unavailable)
- `HKError.Code.errorHealthDataRestricted`: A Mobile Device Management (MDM) profile restricts the use of HealthKit on this device. [Fix](https://aifitnessapi.com/fix/healthkit-data-restricted-mdm)
- `HKError.Code.errorInvalidArgument`: The app passed an invalid argument to the HealthKit API. [Fix](https://aifitnessapi.com/fix/healthkit-invalid-argument)
- `HKError.Code.errorAuthorizationDenied`: The user hasn’t given the app permission to save data. [Fix](https://aifitnessapi.com/fix/healthkit-authorization-denied)
- `HKError.Code.errorAuthorizationNotDetermined`: The app hasn’t yet asked the user for the authorization required to complete the task. [Fix](https://aifitnessapi.com/fix/healthkit-authorization-not-determined)
- `HKError.Code.errorRequiredAuthorizationDenied`: The user hasn’t granted the application authorization to access all the required clinical record types. [Fix](https://aifitnessapi.com/fix/healthkit-required-authorization-denied)
- `HKError.Code.errorDatabaseInaccessible`: The HealthKit data is unavailable because it’s protected and the device is locked. [Fix](https://aifitnessapi.com/fix/healthkit-database-inaccessible)
- `HKError.Code.errorUserCanceled`: The user canceled the operation. [Reference](https://aifitnessapi.com/healthkit-errors#err-errorusercanceled)
- `HKError.Code.errorAnotherWorkoutSessionStarted`: Another app started a workout session. [Fix](https://aifitnessapi.com/fix/healthkit-workout-session-errors)
- `HKError.Code.errorUserExitedWorkoutSession`: The user exited your application while a workout session was running. [Fix](https://aifitnessapi.com/fix/healthkit-workout-session-errors)
- `HKError.Code.errorNoData`: Data is unavailable for the requested query and predicate. [Fix](https://aifitnessapi.com/fix/healthkit-error-no-data)
- `HKError.Code.errorBackgroundWorkoutSessionNotAllowed`: Apple publishes no description: log the raw code, do not infer a meaning. [Fix](https://aifitnessapi.com/fix/healthkit-workout-session-errors)
- `HKError.Code.errorDataSizeExceeded`: Apple publishes no description: log the raw code, do not infer a meaning. [Fix](https://aifitnessapi.com/fix/healthkit-undocumented-errors)
- `HKError.Code.errorNotPermissibleForGuestUserMode`: The app attempted to write HealthKit data while in a Guest User session in visionOS. [Fix](https://aifitnessapi.com/fix/healthkit-guest-user-mode)
- `HKError.Code.errorWorkoutActivityNotAllowed`: Apple publishes no description: log the raw code, do not infer a meaning. [Fix](https://aifitnessapi.com/fix/healthkit-workout-session-errors)
- `HKError.Code.unknownError`: Apple publishes no description: log the raw code, do not infer a meaning. [Fix](https://aifitnessapi.com/fix/healthkit-undocumented-errors)

## Common mistakes this site documents

- [Why Is HealthKit Returning No Data?](https://aifitnessapi.com/fix/healthkit-no-data): A HealthKit query that returns an empty array with no error may be a denied read permission, but HealthKit hides read-authorization state by design, so a blocked read looks exactly like a type with no data — Apple says your app then sees only the samples it saved itself.
- [HealthKit Background Delivery Not Working: Why Your Observer Never Fires](https://aifitnessapi.com/fix/healthkit-background-delivery-not-working): If your HKObserverQuery never fires while your app is backgrounded, work down four documented gates before you suspect a bug.

## Cross-platform pairs this site has verified

Only these one-to-one pairs are verified (same row of the site's HealthKit ↔ Health Connect matrix, one type on each side or mapped field by field in its unified schema). Do not map any other type by its name.

- `HKQuantityTypeIdentifier.heartRate` ↔ `HeartRateRecord`.
- `HKQuantityTypeIdentifier.heartRateVariabilitySDNN` and `HeartRateVariabilityRmssdRecord` are **not** the same measurement (sdnn vs rmssd): HealthKit publishes SDNN; Health Connect and the Google Health API publish RMSSD. A pipeline that stores both in one column without the metric tag mixes two different numbers. Never convert one into the other.
- `HKQuantityTypeIdentifier.vo2Max` ↔ `Vo2MaxRecord`.
- `HKQuantityTypeIdentifier.oxygenSaturation` ↔ `OxygenSaturationRecord`. HealthKit's percent unit is a fraction (Apple: "Percent measures a value between 0.0 and 1.0.").
- `HKCategoryTypeIdentifier.sleepAnalysis` ↔ `SleepSessionRecord`.
- `HKQuantityTypeIdentifier.stepCount` ↔ `StepsRecord`.
- `HKQuantityTypeIdentifier.bodyMass` ↔ `WeightRecord`.
- `HKQuantityTypeIdentifier.bodyFatPercentage` ↔ `BodyFatRecord`. HealthKit's percent unit is a fraction (0.0–1.0); Health Connect and the Google Health API state 0–100. Mixing them is the classic 0.23-percent body-fat bug.

Translate a query between the two: [Swift ↔ Kotlin code translator](https://aifitnessapi.com/tools/identifier-translator#code).

## Quantity types (121)

Aggregation and unit family are copied from Apple's documentation; the last column is Apple's sentence they were read from.

| Identifier | Aggregation | Unit family | Apple's sentence |
|---|---|---|---|
| [`activeEnergyBurned`](https://aifitnessapi.com/healthkit-identifiers/active-energy-burned) | cumulative | energy | Active energy samples use energy units (described in ) and measure cumulative values (described in ). |
| [`appleExerciseTime`](https://aifitnessapi.com/healthkit-identifiers/apple-exercise-time) | cumulative | time | These samples use time units (described in ) and measure cumulative values (described in ). |
| [`appleMoveTime`](https://aifitnessapi.com/healthkit-identifiers/apple-move-time) | cumulative | time | For younger users, HealthKit’s activity summary can track move time instead of active energy burned: These samples use time units (described in ) and measure cumulative values (described in ). |
| [`appleSleepingBreathingDisturbances`](https://aifitnessapi.com/healthkit-identifiers#id-applesleepingbreathingdisturbances) | not stated | not stated | — |
| [`appleSleepingWristTemperature`](https://aifitnessapi.com/healthkit-identifiers/apple-sleeping-wrist-temperature) | discrete | temperature | Sleeping wrist temperature samples use temperature units (described in ) and measure discrete values (described in ). |
| [`appleStandTime`](https://aifitnessapi.com/healthkit-identifiers/apple-stand-time) | cumulative | time | These samples use time units (described in ) and measure cumulative values (described in ). |
| [`appleWalkingSteadiness`](https://aifitnessapi.com/healthkit-identifiers/apple-walking-steadiness) | discrete | percentage | Samples that match the Walking Steadiness identifier use percentage units (described in ) and measure discrete values (described in ). |
| [`atrialFibrillationBurden`](https://aifitnessapi.com/healthkit-identifiers/atrial-fibrillation-burden) | discrete | percentage | These samples use percentage units (described in ) and measure discrete values (described in ). |
| [`basalBodyTemperature`](https://aifitnessapi.com/healthkit-identifiers/basal-body-temperature) | discrete | temperature | These samples use temperature units (described in ) and measure discrete values (described in ). |
| [`basalEnergyBurned`](https://aifitnessapi.com/healthkit-identifiers/basal-energy-burned) | cumulative | energy | These samples use energy units (described in ) and measure cumulative values (described in ). |
| [`bloodAlcoholContent`](https://aifitnessapi.com/healthkit-identifiers/blood-alcohol-content) | discrete | percent | These samples use percent units (described in ) and measure discrete values (described in ). |
| [`bloodGlucose`](https://aifitnessapi.com/healthkit-identifiers/blood-glucose) | discrete | mass/volume | These samples use mass/volume units (described in ) and measure discrete values (described in ). |
| [`bloodPressureDiastolic`](https://aifitnessapi.com/healthkit-identifiers/blood-pressure-diastolic) | discrete | pressure | These samples use pressure units (described in ) and measure discrete values (described in ). |
| [`bloodPressureSystolic`](https://aifitnessapi.com/healthkit-identifiers/blood-pressure-systolic) | discrete | pressure | These samples use pressure units (described in ) and measure discrete values (described in ). |
| [`bodyFatPercentage`](https://aifitnessapi.com/healthkit-identifiers/body-fat-percentage) | discrete | percent | These samples use percent units (described in ) and measure discrete values (described in ). |
| [`bodyMass`](https://aifitnessapi.com/healthkit-identifiers/body-mass) | discrete | mass | These samples use mass units (described in ) and measure discrete values (described in ). |
| [`bodyMassIndex`](https://aifitnessapi.com/healthkit-identifiers/body-mass-index) | discrete | count | These samples use count units (described in ) and measure discrete values (described in ). |
| [`bodyTemperature`](https://aifitnessapi.com/healthkit-identifiers/body-temperature) | discrete | temperature | These samples use temperature units (described in ) and measure discrete values (described in ). |
| [`crossCountrySkiingSpeed`](https://aifitnessapi.com/healthkit-identifiers/cross-country-skiing-speed) | discrete | distance per time | These samples use distance per time units (described in ) and measure discrete values (described in ). |
| [`cyclingCadence`](https://aifitnessapi.com/healthkit-identifiers/cycling-cadence) | discrete | counts per minute | These samples use counts per minute units (described in ) and measure discrete values (described in ). |
| [`cyclingFunctionalThresholdPower`](https://aifitnessapi.com/healthkit-identifiers/cycling-functional-threshold-power) | discrete | power | These samples use power units (described in ) and measure discrete values (described in ). |
| [`cyclingPower`](https://aifitnessapi.com/healthkit-identifiers/cycling-power) | discrete | power | These samples use power units (described in ) and measure discrete values (described in ). |
| [`cyclingSpeed`](https://aifitnessapi.com/healthkit-identifiers/cycling-speed) | discrete | distance per time | These samples use distance per time units (described in ) and measure discrete values (described in ). |
| [`dietaryBiotin`](https://aifitnessapi.com/healthkit-identifiers/dietary-biotin) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryCaffeine`](https://aifitnessapi.com/healthkit-identifiers/dietary-caffeine) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryCalcium`](https://aifitnessapi.com/healthkit-identifiers/dietary-calcium) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryCarbohydrates`](https://aifitnessapi.com/healthkit-identifiers/dietary-carbohydrates) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryChloride`](https://aifitnessapi.com/healthkit-identifiers/dietary-chloride) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryCholesterol`](https://aifitnessapi.com/healthkit-identifiers/dietary-cholesterol) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryChromium`](https://aifitnessapi.com/healthkit-identifiers/dietary-chromium) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryCopper`](https://aifitnessapi.com/healthkit-identifiers/dietary-copper) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryEnergyConsumed`](https://aifitnessapi.com/healthkit-identifiers/dietary-energy-consumed) | cumulative | energy | These samples use energy units (described in ) and measure cumulative values (described in ). |
| [`dietaryFatMonounsaturated`](https://aifitnessapi.com/healthkit-identifiers/dietary-fat-monounsaturated) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryFatPolyunsaturated`](https://aifitnessapi.com/healthkit-identifiers/dietary-fat-polyunsaturated) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryFatSaturated`](https://aifitnessapi.com/healthkit-identifiers/dietary-fat-saturated) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryFatTotal`](https://aifitnessapi.com/healthkit-identifiers/dietary-fat-total) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryFiber`](https://aifitnessapi.com/healthkit-identifiers/dietary-fiber) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryFolate`](https://aifitnessapi.com/healthkit-identifiers/dietary-folate) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryIodine`](https://aifitnessapi.com/healthkit-identifiers/dietary-iodine) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryIron`](https://aifitnessapi.com/healthkit-identifiers/dietary-iron) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryMagnesium`](https://aifitnessapi.com/healthkit-identifiers/dietary-magnesium) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryManganese`](https://aifitnessapi.com/healthkit-identifiers/dietary-manganese) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryMolybdenum`](https://aifitnessapi.com/healthkit-identifiers/dietary-molybdenum) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryNiacin`](https://aifitnessapi.com/healthkit-identifiers/dietary-niacin) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryPantothenicAcid`](https://aifitnessapi.com/healthkit-identifiers/dietary-pantothenic-acid) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryPhosphorus`](https://aifitnessapi.com/healthkit-identifiers/dietary-phosphorus) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryPotassium`](https://aifitnessapi.com/healthkit-identifiers/dietary-potassium) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryProtein`](https://aifitnessapi.com/healthkit-identifiers/dietary-protein) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryRiboflavin`](https://aifitnessapi.com/healthkit-identifiers/dietary-riboflavin) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietarySelenium`](https://aifitnessapi.com/healthkit-identifiers/dietary-selenium) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietarySodium`](https://aifitnessapi.com/healthkit-identifiers/dietary-sodium) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietarySugar`](https://aifitnessapi.com/healthkit-identifiers/dietary-sugar) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryThiamin`](https://aifitnessapi.com/healthkit-identifiers/dietary-thiamin) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryVitaminA`](https://aifitnessapi.com/healthkit-identifiers/dietary-vitamin-a) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryVitaminB12`](https://aifitnessapi.com/healthkit-identifiers/dietary-vitamin-b12) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryVitaminB6`](https://aifitnessapi.com/healthkit-identifiers/dietary-vitamin-b6) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryVitaminC`](https://aifitnessapi.com/healthkit-identifiers/dietary-vitamin-c) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryVitaminD`](https://aifitnessapi.com/healthkit-identifiers/dietary-vitamin-d) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryVitaminE`](https://aifitnessapi.com/healthkit-identifiers/dietary-vitamin-e) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryVitaminK`](https://aifitnessapi.com/healthkit-identifiers/dietary-vitamin-k) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`dietaryWater`](https://aifitnessapi.com/healthkit-identifiers/dietary-water) | cumulative | volume | These samples use volume units (described in ) and measure cumulative values (described in ). |
| [`dietaryZinc`](https://aifitnessapi.com/healthkit-identifiers/dietary-zinc) | cumulative | mass | These samples use mass units (described in ) and measure cumulative values (described in ). |
| [`distanceCrossCountrySkiing`](https://aifitnessapi.com/healthkit-identifiers/distance-cross-country-skiing) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distanceCycling`](https://aifitnessapi.com/healthkit-identifiers/distance-cycling) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distanceDownhillSnowSports`](https://aifitnessapi.com/healthkit-identifiers/distance-downhill-snow-sports) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distancePaddleSports`](https://aifitnessapi.com/healthkit-identifiers/distance-paddle-sports) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distanceRowing`](https://aifitnessapi.com/healthkit-identifiers/distance-rowing) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distanceSkatingSports`](https://aifitnessapi.com/healthkit-identifiers/distance-skating-sports) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distanceSwimming`](https://aifitnessapi.com/healthkit-identifiers/distance-swimming) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distanceWalkingRunning`](https://aifitnessapi.com/healthkit-identifiers/distance-walking-running) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`distanceWheelchair`](https://aifitnessapi.com/healthkit-identifiers/distance-wheelchair) | cumulative | length | These samples use length units (described in ) and measure cumulative values (described in ). |
| [`electrodermalActivity`](https://aifitnessapi.com/healthkit-identifiers/electrodermal-activity) | discrete | conductance | These samples use conductance units (described in ) and measure discrete values (described in ). |
| [`environmentalAudioExposure`](https://aifitnessapi.com/healthkit-identifiers#id-environmentalaudioexposure) | discrete | sound pressure | They measure discrete values of the equivalent continuous sound pressure level, described in . |
| [`environmentalSoundReduction`](https://aifitnessapi.com/healthkit-identifiers#id-environmentalsoundreduction) | discrete | sound pressure | They measure discrete values of the equivalent continuous sound pressure level, described in . |
| [`estimatedWorkoutEffortScore`](https://aifitnessapi.com/healthkit-identifiers#id-estimatedworkouteffortscore) | not stated | not stated | — |
| [`flightsClimbed`](https://aifitnessapi.com/healthkit-identifiers/flights-climbed) | cumulative | count | These samples use count units (described in ) and measure cumulative values (described in ). |
| [`forcedExpiratoryVolume1`](https://aifitnessapi.com/healthkit-identifiers/forced-expiratory-volume1) | discrete | volume | These samples use volume units (described in ) and measure discrete values (described in ). |
| [`forcedVitalCapacity`](https://aifitnessapi.com/healthkit-identifiers/forced-vital-capacity) | discrete | volume | These samples use volume units (described in ) and measure discrete values (described in ). |
| [`headphoneAudioExposure`](https://aifitnessapi.com/healthkit-identifiers#id-headphoneaudioexposure) | discrete | sound pressure | They measure discrete values of the equivalent continuous sound pressure level, described in . |
| [`heartRate`](https://aifitnessapi.com/healthkit-identifiers/heart-rate) | discrete | count/time | These samples use count/time units (described in ) and measure discrete values (described in ). |
| [`heartRateRecoveryOneMinute`](https://aifitnessapi.com/healthkit-identifiers/heart-rate-recovery-one-minute) | discrete | count | Heart rate recovery samples use count units (described in ) and measure discrete values (described in ). |
| [`heartRateVariabilityRMSSD`](https://aifitnessapi.com/healthkit-identifiers#id-heartratevariabilityrmssd) | not stated | not stated | — |
| [`heartRateVariabilitySDNN`](https://aifitnessapi.com/healthkit-identifiers/heart-rate-variability-sdnn) | discrete | time | These samples use time units (described in ) and measure discrete values (described in ). |
| [`height`](https://aifitnessapi.com/healthkit-identifiers/height) | discrete | length | These samples use length units (described in ) and measure discrete values (described in ). |
| [`inhalerUsage`](https://aifitnessapi.com/healthkit-identifiers/inhaler-usage) | cumulative | count | These samples use count units (described in ) and measure cumulative values (described in ). |
| [`insulinDelivery`](https://aifitnessapi.com/healthkit-identifiers/insulin-delivery) | cumulative | international | These samples use international units (IU) (described in ) and measure cumulative values (described in ). |
| [`leanBodyMass`](https://aifitnessapi.com/healthkit-identifiers/lean-body-mass) | discrete | mass | These samples use mass units (described in ) and measure discrete values (described in ). |
| [`nikeFuel`](https://aifitnessapi.com/healthkit-identifiers/nike-fuel) | cumulative | count | These samples use count units (described in ) and measure cumulative values (described in ). |
| [`numberOfAlcoholicBeverages`](https://aifitnessapi.com/healthkit-identifiers/number-of-alcoholic-beverages) | cumulative | count | The samples use count units (described in ) to measure cumulative values (described in ). |
| [`numberOfTimesFallen`](https://aifitnessapi.com/healthkit-identifiers/number-of-times-fallen) | cumulative | count | These samples use count units (described in ) and measure cumulative values (described in ). |
| [`oxygenSaturation`](https://aifitnessapi.com/healthkit-identifiers/oxygen-saturation) | discrete | percent | These samples use percent units (described in ) and measure discrete values (described in ). |
| [`paddleSportsSpeed`](https://aifitnessapi.com/healthkit-identifiers/paddle-sports-speed) | cumulative | distance per time | These samples use distance per time units (described in ) and measure cumulative values (described in ). |
| [`peakExpiratoryFlowRate`](https://aifitnessapi.com/healthkit-identifiers/peak-expiratory-flow-rate) | discrete | volume/time | These samples use volume/time units (described in ) and measure discrete values (described in ). |
| [`peripheralPerfusionIndex`](https://aifitnessapi.com/healthkit-identifiers/peripheral-perfusion-index) | discrete | percent | These samples use percent units (described in ) and measure discrete values (described in ). |
| [`physicalEffort`](https://aifitnessapi.com/healthkit-identifiers#id-physicaleffort) | discrete | not stated | These samples use power in Metabolic Equivalent of Task (METs) units (described in ) and measure discrete values (described in ). |
| [`pushCount`](https://aifitnessapi.com/healthkit-identifiers/push-count) | cumulative | count | These samples use count units (described in ) and measure cumulative values (described in ). |
| [`respiratoryRate`](https://aifitnessapi.com/healthkit-identifiers/respiratory-rate) | discrete | count/time | These samples use count/time units (described in ) and measure discrete values (described in ). |
| [`restingHeartRate`](https://aifitnessapi.com/healthkit-identifiers/resting-heart-rate) | discrete | count/time | These samples use count/time units (described in ) and measure discrete values (described in ). |
| [`rowingSpeed`](https://aifitnessapi.com/healthkit-identifiers/rowing-speed) | discrete | distance per time | These samples use distance per time units (described in ) and measure discrete values (described in ). |
| [`runningGroundContactTime`](https://aifitnessapi.com/healthkit-identifiers/running-ground-contact-time) | discrete | time | These samples use time units (described in ) and measure discrete values (described in ). |
| [`runningPower`](https://aifitnessapi.com/healthkit-identifiers/running-power) | discrete | power | These samples use power units (described in ) and measure discrete values (described in ). |
| [`runningSpeed`](https://aifitnessapi.com/healthkit-identifiers/running-speed) | discrete | distance per time | These samples use distance per time units (described in ) and measure discrete values (described in ). |
| [`runningStrideLength`](https://aifitnessapi.com/healthkit-identifiers/running-stride-length) | discrete | length | These samples use length units (described in ) and measure discrete values (described in ). |
| [`runningVerticalOscillation`](https://aifitnessapi.com/healthkit-identifiers/running-vertical-oscillation) | discrete | length | These samples use length units (described in ) and measure discrete values (described in ). |
| [`sixMinuteWalkTestDistance`](https://aifitnessapi.com/healthkit-identifiers/six-minute-walk-test-distance) | discrete | length | samples use length units (described in ) and measure discrete values (described in ). |
| [`stairAscentSpeed`](https://aifitnessapi.com/healthkit-identifiers/stair-ascent-speed) | discrete | distance/time | These samples use distance/time units (described in ) and measure discrete values (described in ). |
| [`stairDescentSpeed`](https://aifitnessapi.com/healthkit-identifiers/stair-descent-speed) | discrete | distance/time | These samples use distance/time units (described in ) and measure discrete values (described in ). |
| [`stepCount`](https://aifitnessapi.com/healthkit-identifiers/step-count) | cumulative | count | These samples use count units (described in ) and measure cumulative values (described in ). |
| [`swimmingStrokeCount`](https://aifitnessapi.com/healthkit-identifiers/swimming-stroke-count) | cumulative | count | These samples use count units (described in ) and measure cumulative values (described in ). |
| [`timeInDaylight`](https://aifitnessapi.com/healthkit-identifiers/time-in-daylight) | cumulative | time | These samples use time units (described in ) and measure cumulative values (described in ). |
| [`underwaterDepth`](https://aifitnessapi.com/healthkit-identifiers/underwater-depth) | discrete | length | Underwater depth samples use length units (described in ) and measure discrete values (described in ). |
| [`uvExposure`](https://aifitnessapi.com/healthkit-identifiers/uv-exposure) | discrete | count | These samples use count units (described in ) and measure discrete values (described in ). |
| [`vo2Max`](https://aifitnessapi.com/healthkit-identifiers/vo2-max) | discrete | volume/mass/time | They measure discrete values (described in ). |
| [`waistCircumference`](https://aifitnessapi.com/healthkit-identifiers/waist-circumference) | discrete | length | These samples use length units (described in ) and measure discrete values (described in ). |
| [`walkingAsymmetryPercentage`](https://aifitnessapi.com/healthkit-identifiers/walking-asymmetry-percentage) | discrete | percentage | These samples use percentage units (described in ) and measure discrete values (described in ). |
| [`walkingDoubleSupportPercentage`](https://aifitnessapi.com/healthkit-identifiers/walking-double-support-percentage) | discrete | percentage | These samples use percentage units (described in ) and measure discrete values (described in ). |
| [`walkingHeartRateAverage`](https://aifitnessapi.com/healthkit-identifiers/walking-heart-rate-average) | discrete | count/time | These samples use count/time units (described in ) and measure discrete values (described in ). |
| [`walkingSpeed`](https://aifitnessapi.com/healthkit-identifiers/walking-speed) | discrete | distance per time | These samples use distance per time units (described in ) and measure discrete values (described in ). |
| [`walkingStepLength`](https://aifitnessapi.com/healthkit-identifiers/walking-step-length) | discrete | distance | These samples use distance units (described in ) and measure discrete values (described in ). |
| [`waterTemperature`](https://aifitnessapi.com/healthkit-identifiers/water-temperature) | discrete | temperature | Water temperature samples use temperature units (see ) and measure discrete values (see ). |
| [`workoutEffortScore`](https://aifitnessapi.com/healthkit-identifiers#id-workouteffortscore) | not stated | not stated | — |

## Category types (30)

| Identifier | Value enum |
|---|---|
| [`appleStandHour`](https://aifitnessapi.com/healthkit-identifiers#id-applestandhour) | `HKCategoryValueAppleStandHour` |
| [`appleWalkingSteadinessEvent`](https://aifitnessapi.com/healthkit-identifiers/apple-walking-steadiness-event) | `HKCategoryValueAppleWalkingSteadinessEvent` |
| [`audioExposureEvent`](https://aifitnessapi.com/healthkit-identifiers/audio-exposure-event) (deprecated) | `HKCategoryValueAudioExposureEvent` |
| [`bleedingAfterMenopause`](https://aifitnessapi.com/healthkit-identifiers#id-bleedingaftermenopause) | not stated |
| [`cervicalMucusQuality`](https://aifitnessapi.com/healthkit-identifiers#id-cervicalmucusquality) | `HKCategoryValueCervicalMucusQuality` |
| [`contraceptive`](https://aifitnessapi.com/healthkit-identifiers#id-contraceptive) | `HKCategoryValueContraceptive` |
| [`environmentalAudioExposureEvent`](https://aifitnessapi.com/healthkit-identifiers/environmental-audio-exposure-event) | `HKCategoryValueEnvironmentalAudioExposureEvent` |
| [`handwashingEvent`](https://aifitnessapi.com/healthkit-identifiers#id-handwashingevent) | `HKCategoryValue` |
| [`headphoneAudioExposureEvent`](https://aifitnessapi.com/healthkit-identifiers#id-headphoneaudioexposureevent) | `HKCategoryValueHeadphoneAudioExposureEvent` |
| [`highHeartRateEvent`](https://aifitnessapi.com/healthkit-identifiers/high-heart-rate-event) | `HKCategoryValue` |
| [`hypertensionEvent`](https://aifitnessapi.com/healthkit-identifiers#id-hypertensionevent) | not stated |
| [`infrequentMenstrualCycles`](https://aifitnessapi.com/healthkit-identifiers/infrequent-menstrual-cycles) | `HKCategoryValue` |
| [`intermenstrualBleeding`](https://aifitnessapi.com/healthkit-identifiers#id-intermenstrualbleeding) | `HKCategoryValue` |
| [`irregularHeartRhythmEvent`](https://aifitnessapi.com/healthkit-identifiers/irregular-heart-rhythm-event) | `HKCategoryValue` |
| [`irregularMenstrualCycles`](https://aifitnessapi.com/healthkit-identifiers/irregular-menstrual-cycles) | `HKCategoryValue` |
| [`lactation`](https://aifitnessapi.com/healthkit-identifiers#id-lactation) | `HKCategoryValue` |
| [`lowCardioFitnessEvent`](https://aifitnessapi.com/healthkit-identifiers/low-cardio-fitness-event) | `HKCategoryValueLowCardioFitnessEvent` |
| [`lowHeartRateEvent`](https://aifitnessapi.com/healthkit-identifiers/low-heart-rate-event) | `HKCategoryValue` |
| [`menopausalState`](https://aifitnessapi.com/healthkit-identifiers#id-menopausalstate) | `HKCategoryValueMenopausalState` |
| [`menstrualFlow`](https://aifitnessapi.com/healthkit-identifiers/menstrual-flow) | `HKCategoryValueMenstrualFlow` |
| [`mindfulSession`](https://aifitnessapi.com/healthkit-identifiers#id-mindfulsession) | `HKCategoryValue` |
| [`ovulationTestResult`](https://aifitnessapi.com/healthkit-identifiers#id-ovulationtestresult) | `HKCategoryValueOvulationTestResult` |
| [`persistentIntermenstrualBleeding`](https://aifitnessapi.com/healthkit-identifiers/persistent-intermenstrual-bleeding) | `HKCategoryValue` |
| [`pregnancy`](https://aifitnessapi.com/healthkit-identifiers#id-pregnancy) | `HKCategoryValue` |
| [`pregnancyTestResult`](https://aifitnessapi.com/healthkit-identifiers#id-pregnancytestresult) | `HKCategoryValuePregnancyTestResult` |
| [`progesteroneTestResult`](https://aifitnessapi.com/healthkit-identifiers#id-progesteronetestresult) | `HKCategoryValueProgesteroneTestResult` |
| [`prolongedMenstrualPeriods`](https://aifitnessapi.com/healthkit-identifiers/prolonged-menstrual-periods) | `HKCategoryValue` |
| [`sexualActivity`](https://aifitnessapi.com/healthkit-identifiers/sexual-activity) | `HKCategoryValue` |
| [`sleepAnalysis`](https://aifitnessapi.com/healthkit-identifiers/sleep-analysis) | `HKCategoryValueSleepAnalysis` |
| [`toothbrushingEvent`](https://aifitnessapi.com/healthkit-identifiers#id-toothbrushingevent) | `HKCategoryValue` |

## Characteristic types (6)

`activityMoveMode`, `biologicalSex`, `bloodType`, `dateOfBirth`, `fitzpatrickSkinType`, `wheelchairUse`.
