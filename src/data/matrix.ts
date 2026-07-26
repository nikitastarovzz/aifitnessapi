/**
 * HealthKit ↔ Health Connect data-type reference.
 *
 * Every row here was confirmed against Apple's and Google's own developer
 * documentation (see `source` per row). We deliberately scope this to the two
 * on-device platform stores rather than publishing a wider provider matrix:
 * the cloud vendors' docs could not be reached to verify them at time of
 * writing, and a reference table is only worth publishing if its cells are
 * actually verified.
 */

export type MetricId =
  | "heart-rate"
  | "hrv"
  | "vo2-max"
  | "blood-oxygen"
  | "sleep"
  | "steps"
  | "workouts"
  | "gps-route"
  | "calories"
  | "body-composition";

export type Row = {
  id: MetricId;
  label: string;
  /** Our per-metric guide. */
  href: string;
  /** Apple HealthKit type(s). */
  apple: string;
  /** Android Health Connect record type(s). */
  android: string;
  /** The cross-platform gotcha, where one exists. */
  watchOut?: string;
};

export const ROWS: Row[] = [
  {
    id: "heart-rate",
    label: "Heart rate",
    href: "/data/heart-rate-api",
    apple: "HKQuantityTypeIdentifier.heartRate, .restingHeartRate",
    android: "HeartRateRecord, RestingHeartRateRecord",
    watchOut: "Both expose samples plus a separate resting value — don't derive resting yourself.",
  },
  {
    id: "hrv",
    label: "HRV",
    href: "/data/hrv-api",
    apple: "HKQuantityTypeIdentifier.heartRateVariabilitySDNN",
    android: "HeartRateVariabilityRmssdRecord",
    watchOut:
      "The big one: Apple stores SDNN, Health Connect stores RMSSD. They are different measures and are not interconvertible — do not normalize one into the other.",
  },
  {
    id: "vo2-max",
    label: "VO2 max",
    href: "/data/vo2-max-api",
    apple: "HKQuantityTypeIdentifier.vo2Max",
    android: "Vo2MaxRecord",
    watchOut: "An estimate on both platforms, not a lab measurement. Health Connect tags a measurement method.",
  },
  {
    id: "blood-oxygen",
    label: "Blood oxygen",
    href: "/data/blood-oxygen-api",
    apple: "HKQuantityTypeIdentifier.oxygenSaturation",
    android: "OxygenSaturationRecord",
    watchOut:
      "The type existing doesn't mean data exists — SpO2 is device-gated, and Apple Watch availability in the US has been subject to litigation. Verify current status.",
  },
  {
    id: "sleep",
    label: "Sleep",
    href: "/data/sleep-tracking-api",
    apple:
      "HKCategoryTypeIdentifier.sleepAnalysis (values: inBed, awake, asleepCore, asleepDeep, asleepREM, asleepUnspecified)",
    android: "SleepSessionRecord (carries stages)",
    watchOut:
      "Stage vocabularies differ and stages are estimated, not measured. Apple's .asleep is deprecated in favour of the specific stages.",
  },
  {
    id: "steps",
    label: "Steps",
    href: "/data/step-counting-api",
    apple: "HKQuantityTypeIdentifier.stepCount (CMPedometer for live counts)",
    android: "StepsRecord, StepsCadenceRecord",
    watchOut:
      "De-duplicate: phone and watch both write steps. On Android, from the June 2026 update on-device steps are attributed to a per-device Synthetic Package Name — read it via getCurrentDeviceDataSource(), never hardcode it.",
  },
  {
    id: "workouts",
    label: "Workouts",
    href: "/data/workout-detection-api",
    apple: "HKWorkout (HKWorkoutBuilder)",
    android: "ExerciseSessionRecord, PlannedExerciseSessionRecord",
    watchOut: "Activity-type taxonomies differ between platforms — map them explicitly rather than by name.",
  },
  {
    id: "gps-route",
    label: "GPS route",
    href: "/data/gps-activity-api",
    apple: "HKWorkoutRoute (array of CLLocation), HKWorkoutRouteQuery",
    android: "ExerciseRoute with ExerciseRoute.Location",
    watchOut:
      "Health Connect gates routes behind their own permission (READ_EXERCISE_ROUTES) and restricts background reads of other apps' routes.",
  },
  {
    id: "calories",
    label: "Calories",
    href: "/data/calorie-tracking-api",
    apple: "HKQuantityTypeIdentifier.activeEnergyBurned, .basalEnergyBurned",
    android: "ActiveCaloriesBurnedRecord, TotalCaloriesBurnedRecord",
    watchOut:
      "Modelled estimates, not measurements. Note the asymmetry: Apple splits active/basal, Android offers active and total — don't add active to total.",
  },
  {
    id: "body-composition",
    label: "Body composition",
    href: "/data/body-composition-api",
    apple:
      "HKQuantityTypeIdentifier.bodyMass, .bodyFatPercentage, .leanBodyMass, .bodyMassIndex",
    android:
      "WeightRecord, BodyFatRecord, LeanBodyMassRecord, BoneMassRecord, BodyWaterMassRecord, BasalMetabolicRateRecord",
    watchOut:
      "The store holds it, but something has to write it — usually a smart scale or manual entry. Body fat is a bioimpedance estimate.",
  },
];

/** Structural facts that apply to the whole table. */
export const PLATFORM_NOTES: { platform: string; points: string[] }[] = [
  {
    platform: "Apple HealthKit",
    points: [
      "On-device on iPhone and Apple Watch — there is no cloud or server endpoint to call.",
      "Authorization is per data type, requested with requestAuthorization(toShare:read:).",
      "Your app cannot tell whether a read permission was granted or denied — a denied read simply returns only the samples your own app wrote. Design for empty results.",
      "Gate availability on HKHealthStore.isHealthDataAvailable().",
    ],
  },
  {
    platform: "Android Health Connect",
    points: [
      "On-device too — the client library talks to the Health Connect APK over IPC, not to a server.",
      "Read windows are limited: Android 14+ allows 30 days of other apps' data (unlimited for your own); Android 13 and lower caps all reads at 30 days.",
      "From the June 2026 update, on-device steps carry a device-specific Synthetic Package Name instead of the generic \"android\" origin. Filter for both to catch historical and new records.",
    ],
  },
];

export const SOURCES = [
  { label: "Apple — HKQuantityTypeIdentifier", href: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier" },
  { label: "Apple — HKCategoryTypeIdentifier", href: "https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier" },
  { label: "Apple — Authorizing access to health data", href: "https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data" },
  { label: "Google — Health Connect data types", href: "https://developer.android.com/health-and-fitness/guides/health-connect/plan/data-types" },
  { label: "Google — Exercise routes", href: "https://developer.android.com/health-and-fitness/guides/health-connect/develop/exercise-routes" },
  { label: "Google — Health Connect architecture", href: "https://developer.android.com/health-and-fitness/health-connect/architecture" },
];
