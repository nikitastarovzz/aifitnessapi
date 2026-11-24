---
applyTo: "**"
---

# Health Connect rules for AI coding assistants

> Generated 2026-11-24 by https://aifitnessapi.com from its Health Connect dataset, read from Google's data-types page and Jetpack reference on 2026-10-03 (https://aifitnessapi.com/health-connect). Every name below is copied from the vendors' documentation or source; regenerate or re-download from https://aifitnessapi.com/kit/ai-rules/ (listed at https://aifitnessapi.com/developers#ai-rules). Quoted sentences are the vendors' own words.

Use these rules whenever you write or review code that reads or writes Android Health Connect (androidx.health.connect.client), in Kotlin, Java, or a React Native, Flutter or Capacitor wrapper.

## Rules

- Use only the record classes in the table below, spelled exactly. If the type you need is not listed, say so; never build a name from a similar one.
- Declare and request the exact permission string in the table for every record you read or write; each record has its own READ_ and WRITE_ permission.
- Read data in background: `android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND`, declared and requested separately from the data-type permissions.
- Read historical data: `android.permission.health.READ_HEALTH_DATA_HISTORY`, declared and requested separately from the data-type permissions.
- Aggregate only with the metrics listed for a record (`StepsRecord.COUNT_TOTAL` style). A metric's description says whether it is a total, an average, a minimum or a maximum; do not sum a record that only offers averages.
- These records list no aggregate metric, so read them with `readRecords` and compute yourself: `BasalBodyTemperatureRecord`, `BloodGlucoseRecord`, `BodyFatRecord`, `BodyTemperatureRecord`, `BodyWaterMassRecord`, `BoneMassRecord`, `CervicalMucusRecord`, `HeartRateVariabilityRmssdRecord`, `IntermenstrualBleedingRecord`, `LeanBodyMassRecord`, `MenstruationFlowRecord`, `MenstruationPeriodRecord`, `OvulationTestRecord`, `OxygenSaturationRecord`, `PlannedExerciseSessionRecord`, `RespiratoryRateRecord`, `SexualActivityRecord`, `Vo2MaxRecord`.
- On-device too — the client library talks to the Health Connect APK over IPC, not to a server.
- Read windows are limited: Android 14+ allows 30 days of other apps' data (unlimited for your own); Android 13 and lower caps all reads at 30 days.
- From the June 2026 update, on-device steps carry a device-specific Synthetic Package Name instead of the generic "android" origin. Filter for both to catch historical and new records.
- This table is for the Health Connect SDK version 1.0.0-alpha10 and higher. If you're using a lower version of the SDK, see Health Connect data types for SDK 1.0.0-alpha09 and lower.

## Permission strings Google's pages disagree on

- Google's data-types table prints `android.permission.health.READ_EXERCISE_ROUTE` for `ExerciseSessionRecord`, and neither the framework HealthPermissions reference nor the Jetpack HealthPermission constants define it. Check the live reference before you put it in a manifest.

## HealthConnectException error codes

Google's description of each constant ([reference](https://aifitnessapi.com/error-codes/health-connect)).

- `ERROR_UNKNOWN` (1): An unknown error occurred while processing the call.
- `ERROR_INTERNAL` (2): An internal error occurred which the caller cannot address.
- `ERROR_INVALID_ARGUMENT` (3): The caller supplied invalid arguments to the call.
- `ERROR_IO` (4): An issue occurred reading or writing to storage. The call might succeed if repeated.
- `ERROR_SECURITY` (5): The caller doesn't have the correct permissions for this call. [Fix](https://aifitnessapi.com/fix/health-connect-securityexception)
- `ERROR_REMOTE` (6): An IPC related error occurred.
- `ERROR_RATE_LIMIT_EXCEEDED` (7): The caller exhausted the allotted rate limit. [Fix](https://aifitnessapi.com/fix/health-connect-rate-limit)
- `ERROR_DATA_SYNC_IN_PROGRESS` (8): Data sync is in progress. Data read and writes are blocked.
- `ERROR_UNSUPPORTED_OPERATION` (9): This operation is currently not supported by the platform.

## Common mistakes this site documents

- [Why Is Google Health Connect Returning No Data?](https://aifitnessapi.com/fix/health-connect-no-data): The first thing to check when Google Health Connect returns no data is whether anything writes that record type: Health Connect is an on-device store, not a data source, so another app — or, for steps, distance and active calories, Health Connect's own on-device tracking — must populate it first.
- [Health Connect SDK_UNAVAILABLE and SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED: What Each Status Means](https://aifitnessapi.com/fix/health-connect-not-available): HealthConnectClient.getSdkStatus returns one of three constants.
- [Health Connect changesTokenExpired: How to Resync Without Losing Data](https://aifitnessapi.com/fix/health-connect-changes-token-expired): changesTokenExpired is a Boolean on ChangesResponse, not an exception.

## Cross-platform pairs this site has verified

Only these one-to-one pairs are verified (same row of the site's HealthKit ↔ Health Connect matrix, one type on each side or mapped field by field in its unified schema). Do not map any other type by its name.

- `HeartRateRecord` ↔ `HKQuantityTypeIdentifier.heartRate`.
- `HKQuantityTypeIdentifier.heartRateVariabilitySDNN` and `HeartRateVariabilityRmssdRecord` are **not** the same measurement (sdnn vs rmssd): HealthKit publishes SDNN; Health Connect and the Google Health API publish RMSSD. A pipeline that stores both in one column without the metric tag mixes two different numbers. Never convert one into the other.
- `Vo2MaxRecord` ↔ `HKQuantityTypeIdentifier.vo2Max`.
- `OxygenSaturationRecord` ↔ `HKQuantityTypeIdentifier.oxygenSaturation`. HealthKit's percent unit is a fraction (Apple: "Percent measures a value between 0.0 and 1.0.").
- `SleepSessionRecord` ↔ `HKCategoryTypeIdentifier.sleepAnalysis`.
- `StepsRecord` ↔ `HKQuantityTypeIdentifier.stepCount`.
- `WeightRecord` ↔ `HKQuantityTypeIdentifier.bodyMass`.
- `BodyFatRecord` ↔ `HKQuantityTypeIdentifier.bodyFatPercentage`. HealthKit's percent unit is a fraction (0.0–1.0); Health Connect and the Google Health API state 0–100. Mixing them is the classic 0.23-percent body-fat bug.

Translate a query between the two: [Swift ↔ Kotlin code translator](https://aifitnessapi.com/tools/identifier-translator#code).

## Record classes (42)

| Record | Shape | Unit class | Read permission | Write permission | Aggregate metrics |
|---|---|---|---|---|---|
| [`ActiveCaloriesBurnedRecord`](https://aifitnessapi.com/health-connect/active-calories-burned-record) | Interval | Energy | `android.permission.health.READ_ACTIVE_CALORIES_BURNED` | `android.permission.health.WRITE_ACTIVE_CALORIES_BURNED` | `ACTIVE_CALORIES_TOTAL` (Energy) |
| [`ActivityIntensityRecord`](https://aifitnessapi.com/health-connect/activity-intensity-record) | Interval | — | `android.permission.health.READ_ACTIVITY_INTENSITY` | `android.permission.health.WRITE_ACTIVITY_INTENSITY` | `DURATION_TOTAL` (Duration), `INTENSITY_MINUTES_TOTAL` (Long), `MODERATE_DURATION_TOTAL` (Duration), `VIGOROUS_DURATION_TOTAL` (Duration) |
| [`BasalBodyTemperatureRecord`](https://aifitnessapi.com/health-connect/basal-body-temperature-record) | Instantaneous | Temperature | `android.permission.health.READ_BASAL_BODY_TEMPERATURE` | `android.permission.health.WRITE_BASAL_BODY_TEMPERATURE` | none |
| [`BasalMetabolicRateRecord`](https://aifitnessapi.com/health-connect/basal-metabolic-rate-record) | Instantaneous | Power | `android.permission.health.READ_BASAL_METABOLIC_RATE` | `android.permission.health.WRITE_BASAL_METABOLIC_RATE` | `BASAL_CALORIES_TOTAL` (Energy) |
| [`BloodGlucoseRecord`](https://aifitnessapi.com/health-connect/blood-glucose-record) | Instantaneous | — | `android.permission.health.READ_BLOOD_GLUCOSE` | `android.permission.health.WRITE_BLOOD_GLUCOSE` | none |
| [`BloodPressureRecord`](https://aifitnessapi.com/health-connect/blood-pressure-record) | Instantaneous | Pressure | `android.permission.health.READ_BLOOD_PRESSURE` | `android.permission.health.WRITE_BLOOD_PRESSURE` | `DIASTOLIC_AVG` (Pressure), `DIASTOLIC_MAX` (Pressure), `DIASTOLIC_MIN` (Pressure), `SYSTOLIC_AVG` (Pressure), `SYSTOLIC_MAX` (Pressure), `SYSTOLIC_MIN` (Pressure) |
| [`BodyFatRecord`](https://aifitnessapi.com/health-connect/body-fat-record) | Instantaneous | — | `android.permission.health.READ_BODY_FAT` | `android.permission.health.WRITE_BODY_FAT` | none |
| [`BodyTemperatureRecord`](https://aifitnessapi.com/health-connect/body-temperature-record) | Instantaneous | Temperature | `android.permission.health.READ_BODY_TEMPERATURE` | `android.permission.health.WRITE_BODY_TEMPERATURE` | none |
| [`BodyWaterMassRecord`](https://aifitnessapi.com/health-connect/body-water-mass-record) | Instantaneous | Mass | `android.permission.health.READ_BODY_WATER_MASS` | `android.permission.health.WRITE_BODY_WATER_MASS` | none |
| [`BoneMassRecord`](https://aifitnessapi.com/health-connect/bone-mass-record) | Instantaneous | Mass | `android.permission.health.READ_BONE_MASS` | `android.permission.health.WRITE_BONE_MASS` | none |
| [`CervicalMucusRecord`](https://aifitnessapi.com/health-connect/cervical-mucus-record) | Instantaneous | — | `android.permission.health.READ_CERVICAL_MUCUS` | `android.permission.health.WRITE_CERVICAL_MUCUS` | none |
| [`CyclingPedalingCadenceRecord`](https://aifitnessapi.com/health-connect/cycling-pedaling-cadence-record) | Series | — | `android.permission.health.READ_EXERCISE` | `android.permission.health.WRITE_EXERCISE` | `RPM_AVG` (Double), `RPM_MAX` (Double), `RPM_MIN` (Double) |
| [`DistanceRecord`](https://aifitnessapi.com/health-connect/distance-record) | Interval | Length | `android.permission.health.READ_DISTANCE` | `android.permission.health.WRITE_DISTANCE` | `DISTANCE_TOTAL` (Length) |
| [`ElevationGainedRecord`](https://aifitnessapi.com/health-connect/elevation-gained-record) | Interval | Length | `android.permission.health.READ_ELEVATION_GAINED` | `android.permission.health.WRITE_ELEVATION_GAINED` | `ELEVATION_GAINED_TOTAL` (Length) |
| [`ExerciseSessionRecord`](https://aifitnessapi.com/health-connect/exercise-session-record) | Interval | — | `android.permission.health.READ_EXERCISE`, `android.permission.health.READ_EXERCISE_ROUTE` | `android.permission.health.WRITE_EXERCISE`, `android.permission.health.WRITE_EXERCISE_ROUTE` | `EXERCISE_DURATION_TOTAL` (Duration) |
| [`FloorsClimbedRecord`](https://aifitnessapi.com/health-connect/floors-climbed-record) | Interval | — | `android.permission.health.READ_FLOORS_CLIMBED` | `android.permission.health.WRITE_FLOORS_CLIMBED` | `FLOORS_CLIMBED_TOTAL` (Double) |
| [`HeartRateRecord`](https://aifitnessapi.com/health-connect/heart-rate-record) | Series | — | `android.permission.health.READ_HEART_RATE` | `android.permission.health.WRITE_HEART_RATE` | `BPM_AVG` (Long), `BPM_MAX` (Long), `BPM_MIN` (Long), `MEASUREMENTS_COUNT` (Long) |
| [`HeartRateVariabilityRmssdRecord`](https://aifitnessapi.com/health-connect/heart-rate-variability-rmssd-record) | Instantaneous | — | `android.permission.health.READ_HEART_RATE_VARIABILITY` | `android.permission.health.WRITE_HEART_RATE_VARIABILITY` | none |
| [`HeightRecord`](https://aifitnessapi.com/health-connect/height-record) | Instantaneous | Length | `android.permission.health.READ_HEIGHT` | `android.permission.health.WRITE_HEIGHT` | `HEIGHT_AVG` (Length), `HEIGHT_MAX` (Length), `HEIGHT_MIN` (Length) |
| [`HydrationRecord`](https://aifitnessapi.com/health-connect/hydration-record) | Interval | Volume | `android.permission.health.READ_HYDRATION` | `android.permission.health.WRITE_HYDRATION` | `VOLUME_TOTAL` (Volume) |
| [`IntermenstrualBleedingRecord`](https://aifitnessapi.com/health-connect/intermenstrual-bleeding-record) | Instantaneous | — | `android.permission.health.READ_INTERMENSTRUAL_BLEEDING` | `android.permission.health.WRITE_INTERMENSTRUAL_BLEEDING` | none |
| [`LeanBodyMassRecord`](https://aifitnessapi.com/health-connect/lean-body-mass-record) | Instantaneous | Mass | `android.permission.health.READ_LEAN_BODY_MASS` | `android.permission.health.WRITE_LEAN_BODY_MASS` | none |
| [`MenstruationFlowRecord`](https://aifitnessapi.com/health-connect/menstruation-flow-record) | Instantaneous | — | `android.permission.health.READ_MENSTRUATION` | `android.permission.health.WRITE_MENSTRUATION` | none |
| [`MenstruationPeriodRecord`](https://aifitnessapi.com/health-connect/menstruation-period-record) | Interval | — | `android.permission.health.READ_MENSTRUATION` | `android.permission.health.WRITE_MENSTRUATION` | none |
| [`MindfulnessSessionRecord`](https://aifitnessapi.com/health-connect/mindfulness-session-record) | Interval | — | `android.permission.health.READ_MINDFULNESS` | `android.permission.health.WRITE_MINDFULNESS` | `MINDFULNESS_DURATION_TOTAL` (Duration) |
| [`NutritionRecord`](https://aifitnessapi.com/health-connect/nutrition-record) | Interval | Mass | `android.permission.health.READ_NUTRITION` | `android.permission.health.WRITE_NUTRITION` | `BIOTIN_TOTAL` (Mass), `CAFFEINE_TOTAL` (Mass), `CALCIUM_TOTAL` (Mass), `CHLORIDE_TOTAL` (Mass), `CHOLESTEROL_TOTAL` (Mass), `CHROMIUM_TOTAL` (Mass), `COPPER_TOTAL` (Mass), `DIETARY_FIBER_TOTAL` (Mass), `ENERGY_FROM_FAT_TOTAL` (Energy), `ENERGY_TOTAL` (Energy), `FOLATE_TOTAL` (Mass), `FOLIC_ACID_TOTAL` (Mass), `IODINE_TOTAL` (Mass), `IRON_TOTAL` (Mass), `MAGNESIUM_TOTAL` (Mass), `MANGANESE_TOTAL` (Mass), `MOLYBDENUM_TOTAL` (Mass), `MONOUNSATURATED_FAT_TOTAL` (Mass), `NIACIN_TOTAL` (Mass), `PANTOTHENIC_ACID_TOTAL` (Mass), `PHOSPHORUS_TOTAL` (Mass), `POLYUNSATURATED_FAT_TOTAL` (Mass), `POTASSIUM_TOTAL` (Mass), `PROTEIN_TOTAL` (Mass), `RIBOFLAVIN_TOTAL` (Mass), `SATURATED_FAT_TOTAL` (Mass), `SELENIUM_TOTAL` (Mass), `SODIUM_TOTAL` (Mass), `SUGAR_TOTAL` (Mass), `THIAMIN_TOTAL` (Mass), `TOTAL_CARBOHYDRATE_TOTAL` (Mass), `TOTAL_FAT_TOTAL` (Mass), `TRANS_FAT_TOTAL` (Mass), `UNSATURATED_FAT_TOTAL` (Mass), `VITAMIN_A_TOTAL` (Mass), `VITAMIN_B12_TOTAL` (Mass), `VITAMIN_B6_TOTAL` (Mass), `VITAMIN_C_TOTAL` (Mass), `VITAMIN_D_TOTAL` (Mass), `VITAMIN_E_TOTAL` (Mass), `VITAMIN_K_TOTAL` (Mass), `ZINC_TOTAL` (Mass) |
| [`OvulationTestRecord`](https://aifitnessapi.com/health-connect/ovulation-test-record) | Instantaneous | — | `android.permission.health.READ_OVULATION_TEST` | `android.permission.health.WRITE_OVULATION_TEST` | none |
| [`OxygenSaturationRecord`](https://aifitnessapi.com/health-connect/oxygen-saturation-record) | Instantaneous | — | `android.permission.health.READ_OXYGEN_SATURATION` | `android.permission.health.WRITE_OXYGEN_SATURATION` | none |
| [`PlannedExerciseSessionRecord`](https://aifitnessapi.com/health-connect/planned-exercise-session-record) | Interval | — | `android.permission.health.READ_PLANNED_EXERCISE` | `android.permission.health.WRITE_PLANNED_EXERCISE` | none |
| [`PowerRecord`](https://aifitnessapi.com/health-connect/power-record) | Series | — | `android.permission.health.READ_POWER` | `android.permission.health.WRITE_POWER` | `POWER_AVG` (Power), `POWER_MAX` (Power), `POWER_MIN` (Power) |
| [`RespiratoryRateRecord`](https://aifitnessapi.com/health-connect/respiratory-rate-record) | Instantaneous | — | `android.permission.health.READ_RESPIRATORY_RATE` | `android.permission.health.WRITE_RESPIRATORY_RATE` | none |
| [`RestingHeartRateRecord`](https://aifitnessapi.com/health-connect/resting-heart-rate-record) | Instantaneous | — | `android.permission.health.READ_RESTING_HEART_RATE` | `android.permission.health.WRITE_RESTING_HEART_RATE` | `BPM_AVG` (Long), `BPM_MAX` (Long), `BPM_MIN` (Long) |
| [`SexualActivityRecord`](https://aifitnessapi.com/health-connect/sexual-activity-record) | Instantaneous | — | `android.permission.health.READ_SEXUAL_ACTIVITY` | `android.permission.health.WRITE_SEXUAL_ACTIVITY` | none |
| [`SkinTemperatureRecord`](https://aifitnessapi.com/health-connect/skin-temperature-record) | Series | Temperature | `android.permission.health.READ_SKIN_TEMPERATURE` | `android.permission.health.WRITE_SKIN_TEMPERATURE` | `TEMPERATURE_DELTA_AVG` (TemperatureDelta), `TEMPERATURE_DELTA_MAX` (TemperatureDelta), `TEMPERATURE_DELTA_MIN` (TemperatureDelta) |
| [`SleepSessionRecord`](https://aifitnessapi.com/health-connect/sleep-session-record) | Interval | — | `android.permission.health.READ_SLEEP` | `android.permission.health.WRITE_SLEEP` | `SLEEP_DURATION_TOTAL` (Duration) |
| [`SpeedRecord`](https://aifitnessapi.com/health-connect/speed-record) | Series | — | `android.permission.health.READ_SPEED` | `android.permission.health.WRITE_SPEED` | `SPEED_AVG` (Velocity), `SPEED_MAX` (Velocity), `SPEED_MIN` (Velocity) |
| [`StepsRecord`](https://aifitnessapi.com/health-connect/steps-record) | Interval | — | `android.permission.health.READ_STEPS` | `android.permission.health.WRITE_STEPS` | `COUNT_TOTAL` (Long) |
| [`StepsCadenceRecord`](https://aifitnessapi.com/health-connect/steps-cadence-record) | Series | — | `android.permission.health.READ_STEPS` | `android.permission.health.WRITE_STEPS` | `RATE_AVG` (Double), `RATE_MAX` (Double), `RATE_MIN` (Double) |
| [`TotalCaloriesBurnedRecord`](https://aifitnessapi.com/health-connect/total-calories-burned-record) | Interval | Energy | `android.permission.health.READ_TOTAL_CALORIES_BURNED` | `android.permission.health.WRITE_TOTAL_CALORIES_BURNED` | `ENERGY_TOTAL` (Energy) |
| [`Vo2MaxRecord`](https://aifitnessapi.com/health-connect/vo2-max-record) | Instantaneous | — | `android.permission.health.READ_VO2_MAX` | `android.permission.health.WRITE_VO2_MAX` | none |
| [`WeightRecord`](https://aifitnessapi.com/health-connect/weight-record) | Instantaneous | — | `android.permission.health.READ_WEIGHT` | `android.permission.health.WRITE_WEIGHT` | `WEIGHT_AVG` (Mass), `WEIGHT_MAX` (Mass), `WEIGHT_MIN` (Mass) |
| [`WheelchairPushesRecord`](https://aifitnessapi.com/health-connect/wheelchair-pushes-record) | Interval | — | `android.permission.health.READ_WHEELCHAIR_PUSHES` | `android.permission.health.WRITE_WHEELCHAIR_PUSHES` | `COUNT_TOTAL` (Long) |
