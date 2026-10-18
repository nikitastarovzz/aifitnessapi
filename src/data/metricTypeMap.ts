/**
 * One metric across platforms (ops/EXPANSION-3-2026-10-17.md 1.8): for each
 * /data guide, the type that carries its metric on each platform this site
 * has a reference page for — the Google Health API data type, the HealthKit
 * identifier, the Health Connect record, the Wear OS Health Services data
 * type and the Bluetooth GATT characteristic.
 *
 * HAND-MAINTAINED, and the only place these pairings live. The guide's
 * "By platform" block (components/MetricPlatforms) and the link back to the
 * guide on every mapped type page are both rendered from this list, so the
 * two directions cannot disagree.
 *
 * The rule for adding a row:
 *   - A type is listed only where evidence supports it: the platform's own
 *     description of the type, as the generated module holds it, names the
 *     guide's metric. `quote` is that sentence, copied verbatim from the
 *     generated file (googleHealthApi.ts, healthkitIdentifiers.ts,
 *     healthConnectRecords.ts, healthServicesDataTypes.ts, bluetoothGatt.ts).
 *     Where the verified matrix (matrix.ts) lists the type in the guide's own
 *     row, `matrixRow` names that row too and the matrix is the evidence;
 *     the quote then identifies the type.
 *   - Never by name alone. DataType.FLOORS and FloorsClimbedRecord sit in
 *     one guide because Google describes both as floors climbed, not because
 *     the names look alike.
 *   - Only types with a reference page on this site, so every row is a link.
 *     A type the thin-page rule holds back (Wear OS VO2_MAX, HealthKit
 *     heartRateVariabilityRMSSD) or one with no page (Bluetooth Resting Heart
 *     Rate) is left out, and the guide's prose may still name it.
 *   - A type may sit in more than one guide when its description names both
 *     metrics: SpeedRecord is described as "e.g. during running or cycling".
 *   - Workout and exercise types (HKWorkout, ExerciseSessionRecord, the
 *     Google Health API `exercise` type and the activity-type enums) are out
 *     of scope here: the workout-type crosswalk covers them.
 *
 * scripts/qa.mjs re-reads this list and the generated modules and fails the
 * build (METRIC-MAP-EVIDENCE, METRIC-MAP-NO-PAGE, METRIC-MAP-LINK) when a
 * quote is no longer present in the type's own generated text — so a
 * regenerated source cannot silently leave a pairing standing on a sentence
 * Google or Apple no longer prints — when a mapped type has no built page,
 * when a row lacks its quote, or when a guide and a type page stop linking
 * each other.
 *
 * The array below is strict JSON (qa.mjs parses it as text, like the
 * generated modules), so it carries no comments: this header is the place
 * for them.
 */
import { getDataPage, DATA_PATH } from "./healthData";

/** The reference sets a type can come from, in the order the guide block lists them. */
export type MetricFamily = "google-health-api" | "healthkit" | "health-connect" | "wear-os" | "bluetooth";

export type MetricTypeMapping = {
  family: MetricFamily;
  /**
   * The type's key in its generated module: the Google Health API dataType
   * id ("heart-rate"), the HealthKit Swift case ("heartRate"), the Health
   * Connect class name ("HeartRateRecord"), the Health Services constant
   * ("HEART_RATE_BPM") or the Bluetooth characteristic id
   * ("org.bluetooth.characteristic.heart_rate_measurement").
   */
  id: string;
  /** The platform's own words for the type, verbatim from the generated module. */
  quote: string;
  /** The verified matrix row (matrix.ts id) that lists this type for this guide, when one does. */
  matrixRow?: string;
};

export type MetricGuideMap = {
  /** The /data guide's slug. */
  guide: string;
  /** The metric as the block's heading names it. */
  metric: string;
  types: MetricTypeMapping[];
};

export const METRIC_FAMILIES: { family: MetricFamily; label: string }[] = [
  { family: "google-health-api", label: "Google Health API" },
  { family: "healthkit", label: "Apple HealthKit" },
  { family: "health-connect", label: "Android Health Connect" },
  { family: "wear-os", label: "Wear OS Health Services" },
  { family: "bluetooth", label: "Bluetooth GATT" },
];

export const METRIC_TYPE_MAP: MetricGuideMap[] = [
  {
    "guide": "heart-rate-api",
    "metric": "Heart rate",
    "types": [
      {
        "family": "google-health-api",
        "id": "heart-rate",
        "quote": "A heart rate measurement."
      },
      {
        "family": "healthkit",
        "id": "heartRate",
        "quote": "A quantity sample type that measures the user’s heart rate.",
        "matrixRow": "heart-rate"
      },
      {
        "family": "healthkit",
        "id": "walkingHeartRateAverage",
        "quote": "A quantity sample type that measures the user’s heart rate while walking."
      },
      {
        "family": "healthkit",
        "id": "heartRateRecoveryOneMinute",
        "quote": "A quantity sample that records the reduction in heart rate from the peak exercise rate to the rate one minute after exercising ended."
      },
      {
        "family": "healthkit",
        "id": "highHeartRateEvent",
        "quote": "A category sample type for high heart rate events."
      },
      {
        "family": "healthkit",
        "id": "lowHeartRateEvent",
        "quote": "A category sample type for low heart rate events."
      },
      {
        "family": "health-connect",
        "id": "HeartRateRecord",
        "quote": "Captures the user's heart rate.",
        "matrixRow": "heart-rate"
      },
      {
        "family": "wear-os",
        "id": "HEART_RATE_BPM",
        "quote": "Current heart rate, in beats per minute."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.heart_rate_measurement",
        "quote": "The Heart Rate Measurement characteristic is used to represent data related to a heart rate measurement."
      }
    ]
  },
  {
    "guide": "resting-heart-rate-api",
    "metric": "Resting heart rate",
    "types": [
      {
        "family": "google-health-api",
        "id": "daily-resting-heart-rate",
        "quote": "Measures the daily resting heart rate for a user, calculated using the all day heart rate measurements."
      },
      {
        "family": "healthkit",
        "id": "restingHeartRate",
        "quote": "A quantity sample type that measures the user’s resting heart rate."
      },
      {
        "family": "health-connect",
        "id": "RestingHeartRateRecord",
        "quote": "Captures the user's resting heart rate."
      }
    ]
  },
  {
    "guide": "hrv-api",
    "metric": "Heart rate variability",
    "types": [
      {
        "family": "google-health-api",
        "id": "heart-rate-variability",
        "quote": "Captures user's heart rate variability (HRV) as measured by the root mean square of successive differences (RMSSD) between normal heartbeats or by standard deviation of the inter-beat intervals (SDNN)."
      },
      {
        "family": "google-health-api",
        "id": "daily-heart-rate-variability",
        "quote": "Represents the daily heart rate variability data type."
      },
      {
        "family": "healthkit",
        "id": "heartRateVariabilitySDNN",
        "quote": "A quantity sample type that measures the standard deviation of heartbeat intervals.",
        "matrixRow": "hrv"
      },
      {
        "family": "health-connect",
        "id": "HeartRateVariabilityRmssdRecord",
        "quote": "Captures user's heart rate variability (HRV) as measured by the root mean square of successive differences (RMSSD) between normal heartbeats.",
        "matrixRow": "hrv"
      }
    ]
  },
  {
    "guide": "vo2-max-api",
    "metric": "VO2 max",
    "types": [
      {
        "family": "google-health-api",
        "id": "vo2-max",
        "quote": "VO2 max measurement."
      },
      {
        "family": "google-health-api",
        "id": "run-vo2-max",
        "quote": "VO2 max value calculated based on the user's running activity."
      },
      {
        "family": "google-health-api",
        "id": "daily-vo2-max",
        "quote": "Contains a daily summary of the user's VO2 max (cardio fitness score), which is the maximum rate of oxygen the body can use during exercise."
      },
      {
        "family": "healthkit",
        "id": "vo2Max",
        "quote": "A quantity sample that measures the maximal oxygen consumption during exercise.",
        "matrixRow": "vo2-max"
      },
      {
        "family": "healthkit",
        "id": "lowCardioFitnessEvent",
        "quote": "An event that indicates the user’s VO2 max values consistently fall below a particular aerobic fitness threshold."
      },
      {
        "family": "health-connect",
        "id": "Vo2MaxRecord",
        "quote": "Capture user's VO2 max score and optionally the measurement method.",
        "matrixRow": "vo2-max"
      }
    ]
  },
  {
    "guide": "blood-oxygen-api",
    "metric": "Blood oxygen (SpO2)",
    "types": [
      {
        "family": "google-health-api",
        "id": "oxygen-saturation",
        "quote": "Captures the user's instantaneous oxygen saturation percentage (SpO2)."
      },
      {
        "family": "google-health-api",
        "id": "daily-oxygen-saturation",
        "quote": "A daily oxygen saturation (SpO2) record."
      },
      {
        "family": "healthkit",
        "id": "oxygenSaturation",
        "quote": "A quantity sample type that measures the user’s oxygen saturation.",
        "matrixRow": "blood-oxygen"
      },
      {
        "family": "health-connect",
        "id": "OxygenSaturationRecord",
        "quote": "Captures the amount of oxygen circulating in the blood, measured as a percentage of oxygen-saturated hemoglobin.",
        "matrixRow": "blood-oxygen"
      }
    ]
  },
  {
    "guide": "sleep-tracking-api",
    "metric": "Sleep",
    "types": [
      {
        "family": "google-health-api",
        "id": "sleep",
        "quote": "A sleep session possibly including stages."
      },
      {
        "family": "healthkit",
        "id": "sleepAnalysis",
        "quote": "A category sample type for sleep analysis information.",
        "matrixRow": "sleep"
      },
      {
        "family": "health-connect",
        "id": "SleepSessionRecord",
        "quote": "Captures the user's sleep length and its stages.",
        "matrixRow": "sleep"
      }
    ]
  },
  {
    "guide": "step-counting-api",
    "metric": "Steps",
    "types": [
      {
        "family": "google-health-api",
        "id": "steps",
        "quote": "Step count over the time interval."
      },
      {
        "family": "healthkit",
        "id": "stepCount",
        "quote": "A quantity sample type that measures the number of steps the user has taken.",
        "matrixRow": "steps"
      },
      {
        "family": "health-connect",
        "id": "StepsRecord",
        "quote": "Captures the number of steps taken since the last reading.",
        "matrixRow": "steps"
      },
      {
        "family": "health-connect",
        "id": "StepsCadenceRecord",
        "quote": "Captures the user's steps cadence.",
        "matrixRow": "steps"
      },
      {
        "family": "wear-os",
        "id": "STEPS",
        "quote": "Number of steps taken since the last update."
      },
      {
        "family": "wear-os",
        "id": "STEPS_PER_MINUTE",
        "quote": "Step rate in steps/minute at a given point in time."
      },
      {
        "family": "wear-os",
        "id": "WALKING_STEPS",
        "quote": "Number of steps taken while walking since the last update."
      },
      {
        "family": "wear-os",
        "id": "RUNNING_STEPS",
        "quote": "Number of steps taken while running since the last update."
      }
    ]
  },
  {
    "guide": "gps-activity-api",
    "metric": "GPS location",
    "types": [
      {
        "family": "wear-os",
        "id": "LOCATION",
        "quote": "Latitude, longitude and optionally, altitude and bearing at a specific point in time."
      }
    ]
  },
  {
    "guide": "calorie-tracking-api",
    "metric": "Calories burned",
    "types": [
      {
        "family": "google-health-api",
        "id": "active-energy-burned",
        "quote": "Energy burned as part of an activity, excluding the basal energy burn."
      },
      {
        "family": "google-health-api",
        "id": "total-calories",
        "quote": "The complete number of calories burned by a user over a period of time, inclusive of basal metabolic rate and active energy burned."
      },
      {
        "family": "healthkit",
        "id": "activeEnergyBurned",
        "quote": "A quantity sample type that measures the amount of active energy the user has burned.",
        "matrixRow": "calories"
      },
      {
        "family": "healthkit",
        "id": "basalEnergyBurned",
        "quote": "A quantity sample type that measures the resting energy burned by the user.",
        "matrixRow": "calories"
      },
      {
        "family": "health-connect",
        "id": "ActiveCaloriesBurnedRecord",
        "quote": "Captures the estimated active energy burned by the user (in kilocalories), excluding basal metabolic rate (BMR).",
        "matrixRow": "calories"
      },
      {
        "family": "health-connect",
        "id": "TotalCaloriesBurnedRecord",
        "quote": "Total energy burned by the user (in kilocalories), including active & basal energy burned (BMR).",
        "matrixRow": "calories"
      },
      {
        "family": "wear-os",
        "id": "CALORIES",
        "quote": "Number of calories burned (including basal rate and activity) since the last update."
      },
      {
        "family": "wear-os",
        "id": "CALORIES_DAILY",
        "quote": "The total number of calories over a day (including both BMR and active calories), where the previous day ends and a new day begins at 12:00 AM local time."
      },
      {
        "family": "wear-os",
        "id": "CALORIES_TOTAL",
        "quote": "Total number of calories burned (including basal rate and activity) since the start of the current active exercise."
      }
    ]
  },
  {
    "guide": "body-composition-api",
    "metric": "Body composition",
    "types": [
      {
        "family": "google-health-api",
        "id": "weight",
        "quote": "Body weight measurement."
      },
      {
        "family": "google-health-api",
        "id": "body-fat",
        "quote": "Body fat measurement."
      },
      {
        "family": "google-health-api",
        "id": "height",
        "quote": "Body height measurement."
      },
      {
        "family": "healthkit",
        "id": "bodyMass",
        "quote": "A quantity sample type that measures the user’s weight.",
        "matrixRow": "body-composition"
      },
      {
        "family": "healthkit",
        "id": "bodyFatPercentage",
        "quote": "A quantity sample type that measures the user’s body fat percentage.",
        "matrixRow": "body-composition"
      },
      {
        "family": "healthkit",
        "id": "leanBodyMass",
        "quote": "A quantity sample type that measures the user’s lean body mass.",
        "matrixRow": "body-composition"
      },
      {
        "family": "healthkit",
        "id": "bodyMassIndex",
        "quote": "A quantity sample type that measures the user’s body mass index.",
        "matrixRow": "body-composition"
      },
      {
        "family": "healthkit",
        "id": "height",
        "quote": "A quantity sample type that measures the user’s height."
      },
      {
        "family": "healthkit",
        "id": "waistCircumference",
        "quote": "A quantity sample type that measures the user’s waist circumference."
      },
      {
        "family": "health-connect",
        "id": "WeightRecord",
        "quote": "Captures the user's weight.",
        "matrixRow": "body-composition"
      },
      {
        "family": "health-connect",
        "id": "BodyFatRecord",
        "quote": "Captures the body fat percentage of a user.",
        "matrixRow": "body-composition"
      },
      {
        "family": "health-connect",
        "id": "LeanBodyMassRecord",
        "quote": "Captures the user's lean body mass.",
        "matrixRow": "body-composition"
      },
      {
        "family": "health-connect",
        "id": "BoneMassRecord",
        "quote": "Captures the user's bone mass.",
        "matrixRow": "body-composition"
      },
      {
        "family": "health-connect",
        "id": "BodyWaterMassRecord",
        "quote": "Captures the user's body water mass.",
        "matrixRow": "body-composition"
      },
      {
        "family": "health-connect",
        "id": "BasalMetabolicRateRecord",
        "quote": "Captures the BMR of a user.",
        "matrixRow": "body-composition"
      },
      {
        "family": "health-connect",
        "id": "HeightRecord",
        "quote": "Captures the user's height."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.weight_measurement",
        "quote": "The Weight Measurement characteristic is used to represent data related to a weight measurement."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.body_composition_measurement",
        "quote": "The Body Composition Measurement characteristic is used to represent data related to a body composition measurement."
      }
    ]
  },
  {
    "guide": "menstrual-cycle-api",
    "metric": "Menstrual cycle",
    "types": [
      {
        "family": "google-health-api",
        "id": "menstrual-period",
        "quote": "Menstrual period record."
      },
      {
        "family": "google-health-api",
        "id": "ovulation-test",
        "quote": "Ovulation test record."
      },
      {
        "family": "healthkit",
        "id": "menstrualFlow",
        "quote": "A category sample type that records menstrual cycles."
      },
      {
        "family": "healthkit",
        "id": "infrequentMenstrualCycles",
        "quote": "A category sample that indicates an infrequent menstrual cycle."
      },
      {
        "family": "healthkit",
        "id": "irregularMenstrualCycles",
        "quote": "A category sample that indicates an irregular menstrual cycle."
      },
      {
        "family": "healthkit",
        "id": "prolongedMenstrualPeriods",
        "quote": "A category sample that indicates a prolonged menstrual cycle."
      },
      {
        "family": "healthkit",
        "id": "persistentIntermenstrualBleeding",
        "quote": "A category sample that indicates persistent intermenstrual bleeding."
      },
      {
        "family": "healthkit",
        "id": "sexualActivity",
        "quote": "A category sample type that records sexual activity."
      },
      {
        "family": "healthkit",
        "id": "basalBodyTemperature",
        "quote": "A quantity sample type that records the user’s basal body temperature."
      },
      {
        "family": "health-connect",
        "id": "MenstruationFlowRecord",
        "quote": "Captures a description of how heavy a user's menstrual flow was (light, medium, or heavy)."
      },
      {
        "family": "health-connect",
        "id": "MenstruationPeriodRecord",
        "quote": "Captures user's menstruation periods."
      },
      {
        "family": "health-connect",
        "id": "IntermenstrualBleedingRecord",
        "quote": "Captures an instance of user's intermenstrual bleeding, also known as spotting."
      },
      {
        "family": "health-connect",
        "id": "CervicalMucusRecord",
        "quote": "Captures the description of cervical mucus."
      },
      {
        "family": "health-connect",
        "id": "OvulationTestRecord",
        "quote": "Each record represents the result of an ovulation test."
      },
      {
        "family": "health-connect",
        "id": "SexualActivityRecord",
        "quote": "Captures an occurrence of sexual activity."
      },
      {
        "family": "health-connect",
        "id": "BasalBodyTemperatureRecord",
        "quote": "Can be used for checking the fertility window."
      }
    ]
  },
  {
    "guide": "blood-glucose-api",
    "metric": "Blood glucose",
    "types": [
      {
        "family": "google-health-api",
        "id": "blood-glucose",
        "quote": "Represents a blood glucose level measurement."
      },
      {
        "family": "healthkit",
        "id": "bloodGlucose",
        "quote": "A quantity sample type that measures the user’s blood glucose level."
      },
      {
        "family": "health-connect",
        "id": "BloodGlucoseRecord",
        "quote": "Captures the concentration of glucose in the blood."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.glucose_measurement",
        "quote": "The Glucose Measurement characteristic is used to represent data related to a glucose measurement record."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.glucose_measurement_context",
        "quote": "The Glucose Measurement Context characteristic is used to represent context information associated with a glucose measurement record."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.cgm_measurement",
        "quote": "Glucose concentration."
      }
    ]
  },
  {
    "guide": "blood-pressure-api",
    "metric": "Blood pressure",
    "types": [
      {
        "family": "healthkit",
        "id": "bloodPressureSystolic",
        "quote": "A quantity sample type that measures the user’s systolic blood pressure."
      },
      {
        "family": "healthkit",
        "id": "bloodPressureDiastolic",
        "quote": "A quantity sample type that measures the user’s diastolic blood pressure."
      },
      {
        "family": "health-connect",
        "id": "BloodPressureRecord",
        "quote": "Captures the blood pressure of a user."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.blood_pressure_measurement",
        "quote": "The Blood Pressure Measurement characteristic is used to represent blood pressure measurement data."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.enhanced_blood_pressure_measurement",
        "quote": "The Enhanced Blood Pressure Measurement characteristic is used to represent data related to a blood pressure measurement that includes a UTC time stamp and a user facing time."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.blood_pressure_record",
        "quote": "The Blood Pressure Record characteristic is a container that represents a stored value of a blood pressure measurement or of any other characteristic as specified by the service using the characteristic."
      }
    ]
  },
  {
    "guide": "respiratory-rate-api",
    "metric": "Respiratory rate",
    "types": [
      {
        "family": "google-health-api",
        "id": "daily-respiratory-rate",
        "quote": "A daily average respiratory rate (breaths per minute) for a day of the year."
      },
      {
        "family": "google-health-api",
        "id": "respiratory-rate-sleep-summary",
        "quote": "Records respiratory rate details during sleep."
      },
      {
        "family": "healthkit",
        "id": "respiratoryRate",
        "quote": "A quantity sample type that measures the user’s respiratory rate."
      },
      {
        "family": "health-connect",
        "id": "RespiratoryRateRecord",
        "quote": "Captures the user's respiratory rate."
      }
    ]
  },
  {
    "guide": "state-of-mind-api",
    "metric": "Mood",
    "types": [
      {
        "family": "google-health-api",
        "id": "moods",
        "quote": "The moods logged."
      }
    ]
  },
  {
    "guide": "body-temperature-api",
    "metric": "Body temperature",
    "types": [
      {
        "family": "google-health-api",
        "id": "core-body-temperature",
        "quote": "Core body temperature measurement, distinct from peripheral body temperature, reflects the temperature of the body's internal organs."
      },
      {
        "family": "google-health-api",
        "id": "daily-sleep-temperature-derivations",
        "quote": "Provides derived sleep temperature values, calculated from skin or internal device temperature readings during sleep."
      },
      {
        "family": "google-health-api",
        "id": "skin-temperature-sensors",
        "quote": "Skin temperature sensor data containing multi-sensor readings."
      },
      {
        "family": "healthkit",
        "id": "bodyTemperature",
        "quote": "A quantity sample type that measures the user’s body temperature."
      },
      {
        "family": "healthkit",
        "id": "appleSleepingWristTemperature",
        "quote": "A quantity sample type that records the wrist temperature during sleep."
      },
      {
        "family": "healthkit",
        "id": "basalBodyTemperature",
        "quote": "A quantity sample type that records the user’s basal body temperature."
      },
      {
        "family": "health-connect",
        "id": "BodyTemperatureRecord",
        "quote": "Captures the body temperature of a user."
      },
      {
        "family": "health-connect",
        "id": "SkinTemperatureRecord",
        "quote": "Captures the skin temperature of a user."
      },
      {
        "family": "health-connect",
        "id": "BasalBodyTemperatureRecord",
        "quote": "Captures the body temperature of a user when at rest (for example, immediately after waking up)."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.temperature_measurement",
        "quote": "The Temperature Measurement characteristic is used to represent data related to a temperature measurement."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.intermediate_temperature",
        "quote": "The Intermediate Temperature characteristic is used to send intermediate temperature values to a device for display purposes while a measurement is in progress. The Intermediate Temperature characteristic has the same format as the Temperature Measurement characteristic in \\autoref{sec:org.bluetooth.characteristic.temperature_measurement} except that, due to a different context, the Measurement Value field is referred to as the Intermediate Temperature field."
      }
    ]
  },
  {
    "guide": "ecg-api",
    "metric": "ECG and irregular rhythm",
    "types": [
      {
        "family": "google-health-api",
        "id": "electrocardiogram",
        "quote": "Represents an Electrocardiogram (ECG) measurement session."
      },
      {
        "family": "google-health-api",
        "id": "irregular-rhythm-notification",
        "quote": "Represents an Irregular Rhythm Notification alert, indicating a potential sign of atrial fibrillation (AFib)."
      },
      {
        "family": "healthkit",
        "id": "irregularHeartRhythmEvent",
        "quote": "A category sample type for irregular heart rhythm events."
      },
      {
        "family": "healthkit",
        "id": "atrialFibrillationBurden",
        "quote": "A quantity type that measures an estimate of the percentage of time a person’s heart shows signs of atrial fibrillation (AFib) while wearing Apple Watch."
      }
    ]
  },
  {
    "guide": "distance-tracking-api",
    "metric": "Distance",
    "types": [
      {
        "family": "google-health-api",
        "id": "distance",
        "quote": "Distance traveled over an interval of time."
      },
      {
        "family": "healthkit",
        "id": "distanceWalkingRunning",
        "quote": "A quantity sample type that measures the distance the user has moved by walking or running."
      },
      {
        "family": "healthkit",
        "id": "distanceCycling",
        "quote": "A quantity sample type that measures the distance the user has moved by cycling."
      },
      {
        "family": "healthkit",
        "id": "distanceSwimming",
        "quote": "A quantity sample type that measures the distance the user has moved while swimming."
      },
      {
        "family": "healthkit",
        "id": "distanceWheelchair",
        "quote": "A quantity sample type that measures the distance the user has moved using a wheelchair."
      },
      {
        "family": "healthkit",
        "id": "distanceDownhillSnowSports",
        "quote": "A quantity sample type that measures the distance the user has traveled while skiing or snowboarding."
      },
      {
        "family": "healthkit",
        "id": "distanceCrossCountrySkiing",
        "quote": "A quantity sample type that measures the distance the user has moved by cross country skiing."
      },
      {
        "family": "healthkit",
        "id": "distancePaddleSports",
        "quote": "A quantity sample type that measures the distance the user has moved by paddling sports."
      },
      {
        "family": "healthkit",
        "id": "distanceRowing",
        "quote": "A quantity sample type that measures the distance the user has moved by rowing."
      },
      {
        "family": "healthkit",
        "id": "distanceSkatingSports",
        "quote": "A quantity sample type that measures the distance the user has moved by skating."
      },
      {
        "family": "health-connect",
        "id": "DistanceRecord",
        "quote": "Captures distance travelled by the user since the last reading."
      },
      {
        "family": "wear-os",
        "id": "DISTANCE",
        "quote": "A distance delta between each reading expressed in meters."
      },
      {
        "family": "wear-os",
        "id": "FLAT_GROUND_DISTANCE",
        "quote": "The distance traveled over flat since the last update expressed in meters."
      },
      {
        "family": "wear-os",
        "id": "INCLINE_DISTANCE",
        "quote": "The distance traveled over inclining ground since the last update expressed in meters."
      },
      {
        "family": "wear-os",
        "id": "DECLINE_DISTANCE",
        "quote": "Distance traveled over declining ground between each reading expressed in meters."
      }
    ]
  },
  {
    "guide": "floors-elevation-api",
    "metric": "Floors and elevation",
    "types": [
      {
        "family": "google-health-api",
        "id": "floors",
        "quote": "Gained elevation measured in floors over the time interval"
      },
      {
        "family": "google-health-api",
        "id": "altitude",
        "quote": "Captures the altitude gain (i.e. deltas), and not level above sea, for a user in millimeters."
      },
      {
        "family": "healthkit",
        "id": "flightsClimbed",
        "quote": "A quantity sample type that measures the number flights of stairs that the user has climbed."
      },
      {
        "family": "health-connect",
        "id": "FloorsClimbedRecord",
        "quote": "Captures the number of floors climbed by the user since the last reading."
      },
      {
        "family": "health-connect",
        "id": "ElevationGainedRecord",
        "quote": "Captures the elevation gained by the user since the last reading."
      },
      {
        "family": "wear-os",
        "id": "FLOORS",
        "quote": "Number of floors climbed since the last update."
      },
      {
        "family": "wear-os",
        "id": "ELEVATION_GAIN",
        "quote": "A measure of the gain in elevation since the last update expressed in meters."
      },
      {
        "family": "wear-os",
        "id": "ELEVATION_LOSS",
        "quote": "A measure of the loss in elevation since the last update expressed in meters."
      },
      {
        "family": "wear-os",
        "id": "ABSOLUTE_ELEVATION",
        "quote": "Absolute elevation at a specific point in time expressed in meters."
      }
    ]
  },
  {
    "guide": "active-minutes-api",
    "metric": "Active minutes",
    "types": [
      {
        "family": "google-health-api",
        "id": "active-minutes",
        "quote": "Record of active minutes in a given time interval."
      },
      {
        "family": "google-health-api",
        "id": "active-zone-minutes",
        "quote": "Record of active zone minutes in a given time interval."
      },
      {
        "family": "google-health-api",
        "id": "activity-level",
        "quote": "Internal type to capture activity level during a certain time interval."
      },
      {
        "family": "google-health-api",
        "id": "sedentary-period",
        "quote": "SedentaryPeriod SedentaryPeriod data represents the periods of time that the user was sedentary (i.e. not moving while wearing the device)."
      },
      {
        "family": "healthkit",
        "id": "appleExerciseTime",
        "quote": "A quantity sample type that measures the amount of time the user spent exercising."
      },
      {
        "family": "healthkit",
        "id": "appleMoveTime",
        "quote": "A quantity sample type that measures the amount of time the user has spent performing activities that involve full-body movements during the specified day."
      },
      {
        "family": "health-connect",
        "id": "ActivityIntensityRecord",
        "quote": "Metric identifier to retrieve the number of weighted intensity minutes from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ]
  },
  {
    "guide": "heart-rate-zones-api",
    "metric": "Heart rate zones",
    "types": [
      {
        "family": "google-health-api",
        "id": "daily-heart-rate-zones",
        "quote": "User's heart rate zone thresholds based on the Karvonen algorithm for a specific day."
      },
      {
        "family": "google-health-api",
        "id": "time-in-heart-rate-zone",
        "quote": "It's an interval spent in specific heart rate zone."
      },
      {
        "family": "google-health-api",
        "id": "active-zone-minutes",
        "quote": "Heart rate zone in which the active zone minutes have been earned, in the given time interval."
      },
      {
        "family": "google-health-api",
        "id": "calories-in-heart-rate-zone",
        "quote": "Represents the amount of kilocalories burned in a specific heart rate zone."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.three_zone_heart_rate_limits",
        "quote": "The Three Zone Heart Rate Limits characteristic is used to represent the limits between the heart rate zones for the three-zone heart rate definition (Hard, Moderate, and Light) of a user."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.four_zone_heart_rate_limits",
        "quote": "The Four Zone Heart Rate Limits characteristic is used to represent the limits between the heart rate zones for the four-zone heart rate definition (Maximum, Hard, Moderate, and Light) of a user."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.five_zone_heart_rate_limits",
        "quote": "The Five Zone Heart Rate Limits characteristic is used to represent the limits between the heart rate zones for the five-zone heart rate definition (Maximum, Hard, Moderate, Light, and Very Light) of a user."
      }
    ]
  },
  {
    "guide": "cycling-power-api",
    "metric": "Cycling power, cadence and speed",
    "types": [
      {
        "family": "healthkit",
        "id": "cyclingPower",
        "quote": "A quantity sample type that measures the estimated power being used while riding a bike."
      },
      {
        "family": "healthkit",
        "id": "cyclingCadence",
        "quote": "A quantity sample type that represents the rate at which the user is pedaling."
      },
      {
        "family": "healthkit",
        "id": "cyclingSpeed",
        "quote": "A quantity sample type that measures how fast you are traveling while riding a bike."
      },
      {
        "family": "healthkit",
        "id": "cyclingFunctionalThresholdPower",
        "quote": "A quantity sample type that measures the estimated maximum average power sustained while riding a bike for 60 minutes."
      },
      {
        "family": "health-connect",
        "id": "PowerRecord",
        "quote": "Captures the power generated by the user, e.g. during cycling or rowing with a power meter."
      },
      {
        "family": "health-connect",
        "id": "CyclingPedalingCadenceRecord",
        "quote": "Captures the user's cycling pedaling cadence."
      },
      {
        "family": "health-connect",
        "id": "SpeedRecord",
        "quote": "Captures the user's speed, e.g. during running or cycling."
      },
      {
        "family": "wear-os",
        "id": "SPEED",
        "quote": "Speed at a specific point in time, expressed as meters/second."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.cycling_power_measurement",
        "quote": "The Cycling Power Measurement characteristic is used to represent data related to a cycling power sensor."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.cycling_power_vector",
        "quote": "The Cycling Power Vector characteristic is used to represent power vector data related to a cycling power sensor."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.csc_measurement",
        "quote": "The CSC Measurement characteristic is used to represent data related to a cycling speed and cadence (CSC) sensor."
      }
    ]
  },
  {
    "guide": "running-metrics-api",
    "metric": "Running speed, power and form",
    "types": [
      {
        "family": "healthkit",
        "id": "runningSpeed",
        "quote": "A quantity sample type that measures the runner’s speed."
      },
      {
        "family": "healthkit",
        "id": "runningPower",
        "quote": "A quantity sample type that measures the rate of work required for the runner to maintain their speed."
      },
      {
        "family": "healthkit",
        "id": "runningStrideLength",
        "quote": "A quantity sample type that measures the distance covered by a single step while running."
      },
      {
        "family": "healthkit",
        "id": "runningVerticalOscillation",
        "quote": "A quantity sample type measuring pelvis vertical range of motion during a single running stride."
      },
      {
        "family": "healthkit",
        "id": "runningGroundContactTime",
        "quote": "A quantity sample type that measures the amount of time the runner’s foot is in contact with the ground while running."
      },
      {
        "family": "health-connect",
        "id": "SpeedRecord",
        "quote": "Captures the user's speed, e.g. during running or cycling."
      },
      {
        "family": "wear-os",
        "id": "SPEED",
        "quote": "Speed at a specific point in time, expressed as meters/second."
      },
      {
        "family": "wear-os",
        "id": "PACE",
        "quote": "Pace at a specific point in time."
      },
      {
        "family": "wear-os",
        "id": "VERTICAL_RATIO",
        "quote": "Vertical oscillation / stride length."
      },
      {
        "family": "wear-os",
        "id": "VERTICAL_RATIO_STATS",
        "quote": "Statistics on vertical oscillation / stride length."
      },
      {
        "family": "bluetooth",
        "id": "org.bluetooth.characteristic.rsc_measurement",
        "quote": "The RSC Measurement characteristic is used to represent data related to a running speed and cadence (RSC) measurement."
      }
    ]
  },
  {
    "guide": "swimming-data-api",
    "metric": "Swimming strokes and lengths",
    "types": [
      {
        "family": "google-health-api",
        "id": "swim-lengths-data",
        "quote": "Swim lengths data over the time interval."
      },
      {
        "family": "healthkit",
        "id": "swimmingStrokeCount",
        "quote": "A quantity sample type that measures the number of strokes performed while swimming."
      },
      {
        "family": "healthkit",
        "id": "distanceSwimming",
        "quote": "A quantity sample type that measures the distance the user has moved while swimming."
      },
      {
        "family": "wear-os",
        "id": "SWIMMING_STROKES",
        "quote": "Number of swimming strokes taken since the last update."
      },
      {
        "family": "wear-os",
        "id": "SWIMMING_LAP_COUNT",
        "quote": "Count of swimming laps since the last update."
      }
    ]
  }
];

/** The mapping for one /data guide, when the guide is released and has one. */
export function metricMapForGuide(slug: string): MetricGuideMap | undefined {
  return getDataPage(slug) ? METRIC_TYPE_MAP.find((m) => m.guide === slug) : undefined;
}

export type MetricGuideLink = { slug: string; href: string; h1: string; metric: string };

/**
 * The released /data guides that list this type, in the list's order — the
 * link every type page renders back to its guide (marked data-metric-guide,
 * which qa.mjs checks against this list).
 */
export function metricGuidesForType(family: MetricFamily, id: string): MetricGuideLink[] {
  const out: MetricGuideLink[] = [];
  for (const m of METRIC_TYPE_MAP) {
    if (!m.types.some((t) => t.family === family && t.id === id)) continue;
    const e = getDataPage(m.guide);
    if (e && !out.some((o) => o.slug === m.guide)) {
      out.push({ slug: m.guide, href: `${DATA_PATH}/${m.guide}`, h1: e.h1, metric: m.metric });
    }
  }
  return out;
}
