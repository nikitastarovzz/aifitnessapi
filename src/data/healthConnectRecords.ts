/**
 * Every Health Connect record class on Google's data-types page, joined with
 * each class's Jetpack reference page.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-health-connect-records.mjs
 *
 * Sources:
 *   https://developer.android.com/health-and-fitness/health-connect/data-types (Last updated 2026-09-23)
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/<Class>
 *   https://developer.android.com/reference/android/health/connect/HealthPermissions (Last updated 2026-08-03)
 *   https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission
 * Fetched: 2026-10-03
 *
 * Copied verbatim: descriptions, property/constant/metric descriptions,
 * types, signatures, permission strings, categories, record shapes, units,
 * mandatory fields, "Added in" and "Last updated".
 *
 * Derived, with the text kept beside it:
 *   readPermissions / writePermissions — split by the literal READ_/WRITE_
 *     prefix; the table cell is in permissionEvidence.
 *   property range — copied from an @IntRange/@FloatRange annotation in
 *     Google's signature (the annotation itself is kept); null when the
 *     signature carries none. Null does not mean unvalidated.
 *   permissionCheck — whether each string the data-types table prints is
 *     defined by the framework HealthPermissions reference or a Jetpack
 *     HealthPermission constant. A false/false pair is a disagreement between
 *     Google's own pages, published as such, never corrected by us.
 */

export type HcRange = { annotation: string; from: string | null; to: string | null };

export type HcProperty = {
  name: string;
  /** Kotlin type as Google prints it, annotations removed. */
  type: string;
  /** From an @IntRange/@FloatRange annotation; null when none is printed. */
  range: HcRange | null;
  /** The sentence of Google's description that states a range, verbatim
   *  ("Valid range: 1-1000000."). Null when the description states none. */
  rangeStatement: string | null;
  /** Google's description, verbatim. Null where Google gives none. */
  description: string | null;
  inConstructor: boolean;
  /** Default value in Google's constructor signature, verbatim. */
  constructorDefault: string | null;
  addedIn: string | null;
  deprecated: boolean;
};

export type HcAggregateMetric = {
  /** Companion constant name, e.g. "COUNT_TOTAL". */
  name: string;
  /** T in Google's AggregateMetric<T> signature, e.g. "Long", "Energy". */
  valueType: string;
  /** T fully qualified, from the link on T in Google's signature, e.g.
   *  "androidx.health.connect.client.units.Energy", "java.time.Duration",
   *  "kotlin.Long". Null when Google's signature does not link T. */
  valueTypeQualified: string | null;
  description: string | null;
};

export type HcConstant = {
  name: string;
  value: string | null;
  type: string | null;
  description: string | null;
};

export type HcPermissionCheck = {
  permission: string;
  inFrameworkReference: boolean;
  /** The framework reference's availability line, e.g. "Added in API level 34 Also in U Extensions 7". */
  frameworkAdded: string | null;
  inJetpackConstants: boolean;
};

export type HcRecord = {
  className: string;
  /** kebab-case of the full class name: StepsRecord → "steps-record". */
  slug: string;
  qualifiedName: string;
  /** The data type's name in Google's table, e.g. "Steps". */
  dataTypeLabel: string;
  /** One of Google's seven categories, as Google names it. */
  category: string | null;
  /** "Interval" | "Instantaneous" | "Series", per Google's table. */
  recordShape: string | null;
  /** Unit class Google's table names (androidx…units.<Unit>); null when none. */
  unitClass: string | null;
  mandatoryFields: string[];
  /** Google's description paragraphs, verbatim. */
  description: string[];
  /** A code sample Google embeds in the class description, verbatim. */
  googleExample: string | null;
  signature: string | null;
  addedIn: string | null;
  addedInEvidence: string | null;
  deprecated: boolean;
  experimentalAnnotations: string[];
  featureFlag: string | null;
  readPermissions: string[];
  writePermissions: string[];
  permissionEvidence: string;
  permissionCheck: HcPermissionCheck[];
  /** Other classes Google lists in the same table row (Steps + StepsCadence). */
  sharedRowWith: string[];
  properties: HcProperty[];
  constructors: string[];
  aggregateMetrics: HcAggregateMetric[];
  constants: HcConstant[];
  nestedTypes: { name: string; kind: string | null; description: string | null }[];
  otherCompanionProperties: { name: string | null; signature: string | null; description: string | null }[];
  guides: { title: string; url: string }[];
  sourceUrl: string;
  /** The reference page's "Last updated" date. */
  sourceUpdated: string | null;
};

export type HcFrameworkPermission = {
  /** Constant on android.health.connect.HealthPermissions. */
  constant: string;
  /** The manifest string, e.g. "android.permission.health.READ_STEPS". */
  value: string;
  description: string | null;
  protectionLevel: string | null;
  /** Availability line as Google prints it. */
  added: string | null;
};

/** The date the generator fetched Google's data-types page. */
export const HC_FETCHED_ON = "2026-10-03";
/** "Last updated" on Google's data-types page at that fetch. */
export const HC_DATA_TYPES_UPDATED = "2026-09-23";
export const HC_DATA_TYPES_URL = "https://developer.android.com/health-and-fitness/health-connect/data-types";
export const HC_FW_PERMISSIONS_URL = "https://developer.android.com/reference/android/health/connect/HealthPermissions";
export const HC_FW_PERMISSIONS_UPDATED = "2026-08-03";
export const HC_JETPACK_PERMISSION_URL = "https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission";
/** The SDK-version note above Google's table, verbatim. */
export const HC_SDK_NOTE = "This table is for the Health Connect SDK version 1.0.0-alpha10 and higher. If you're using a lower version of the SDK, see Health Connect data types for SDK 1.0.0-alpha09 and lower.";

/** Google's seven data type categories, in Google's order and words. */
export const HC_CATEGORIES: { name: string; description: string }[] = [
  {
    "name": "Activity",
    "description": "This captures any activity that a user does. It can include health and fitness activities like running and swimming."
  },
  {
    "name": "Body Measurement",
    "description": "This captures common data related to the body, such as a user's weight and their basal metabolic rate."
  },
  {
    "name": "Cycle Tracking",
    "description": "This captures menstrual cycles and related data points, such as the binary result of an ovulation test."
  },
  {
    "name": "Nutrition",
    "description": "This captures hydration and nutrition data types. The former represents how much water a user consume in a single drink. The latter includes optional fields such as calories, sugar, and magnesium."
  },
  {
    "name": "Sleep",
    "description": "This captures interval data related to a user's length and type of sleep."
  },
  {
    "name": "Vitals",
    "description": "This captures essential information about the user's general health. It includes data such as body temperature, blood glucose, blood pressure, and blood oxygen saturation."
  },
  {
    "name": "Wellness",
    "description": "This captures data related to a user's mental health and well-being."
  }
];

/** The extra read permissions Google's data-types page lists separately. */
export const HC_ADDITIONAL_READ_PERMISSIONS: { permission: string; label: string }[] = [
  {
    "permission": "android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND",
    "label": "Read data in background"
  },
  {
    "permission": "android.permission.health.READ_HEALTH_DATA_HISTORY",
    "label": "Read historical data"
  }
];

export const HC_RECORDS: HcRecord[] = [
  {
    "className": "ActiveCaloriesBurnedRecord",
    "slug": "active-calories-burned-record",
    "qualifiedName": "androidx.health.connect.client.records.ActiveCaloriesBurnedRecord",
    "dataTypeLabel": "Active calories burned",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": "Energy",
    "mandatoryFields": [
      "endTime",
      "energy",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the estimated active energy burned by the user (in kilocalories), excluding basal metabolic rate (BMR). Each record represents the total kilocalories burned over a time interval, so both the start and end times should be set."
    ],
    "googleExample": null,
    "signature": "class ActiveCaloriesBurnedRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_ACTIVE_CALORIES_BURNED"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_ACTIVE_CALORIES_BURNED"
    ],
    "permissionEvidence": "Google's data-types table, row \"Active calories burned\" (ActiveCaloriesBurnedRecord): android.permission.health.READ_ACTIVE_CALORIES_BURNED, android.permission.health.WRITE_ACTIVE_CALORIES_BURNED",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_ACTIVE_CALORIES_BURNED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_ACTIVE_CALORIES_BURNED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "energy",
        "type": "Energy",
        "range": null,
        "rangeStatement": "Valid range: 0-1000000 kcal.",
        "description": "Energy in Energy unit. Required field. Valid range: 0-1000000 kcal.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "ActiveCaloriesBurnedRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    energy: Energy,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "ACTIVE_CALORIES_TOTAL",
        "valueType": "Energy",
        "valueTypeQualified": "androidx.health.connect.client.units.Energy",
        "description": "Metric identifier to retrieve total active calories burned from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      },
      {
        "title": "Native tracking guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/native-tracking"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ActiveCaloriesBurnedRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "ActivityIntensityRecord",
    "slug": "activity-intensity-record",
    "qualifiedName": "androidx.health.connect.client.records.ActivityIntensityRecord",
    "dataTypeLabel": "Activity intensity",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "activityIntensityType",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Represents intensity of an activity.",
      "Intensity can be either moderate or vigorous.",
      "Each record requires the start time, the end time and the activity intensity type.",
      "The ability to insert or read this record type is dependent on the version of Health Connect installed on the device. To check if available: call androidx.health.connect.client.HealthConnectFeatures.getFeatureStatus and pass androidx.health.connect.client.HealthConnectFeatures.FEATURE_ACTIVITY_INTENSITY as an argument."
    ],
    "googleExample": null,
    "signature": "class ActivityIntensityRecord : Record",
    "addedIn": "1.2.0-alpha06",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.2.0-alpha06\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": "FEATURE_ACTIVITY_INTENSITY",
    "readPermissions": [
      "android.permission.health.READ_ACTIVITY_INTENSITY"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_ACTIVITY_INTENSITY"
    ],
    "permissionEvidence": "Google's data-types table, row \"Activity intensity\" (ActivityIntensityRecord): android.permission.health.READ_ACTIVITY_INTENSITY, android.permission.health.WRITE_ACTIVITY_INTENSITY",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_ACTIVITY_INTENSITY",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 36 Also in U Extensions 16",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_ACTIVITY_INTENSITY",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 36 Also in U Extensions 16",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "activityIntensityType",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Type of activity intensity (moderate or vigorous).",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.2.0-alpha06",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.2.0-alpha06",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.2.0-alpha06",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.2.0-alpha06",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.2.0-alpha06",
        "deprecated": false
      }
    ],
    "constructors": [
      "ActivityIntensityRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    activityIntensityType: Int\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "DURATION_TOTAL",
        "valueType": "Duration",
        "valueTypeQualified": "java.time.Duration",
        "description": "Metric identifier to retrieve the total duration of activity intensity regardless of the type from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use androidx.health.connect.client.HealthConnectFeatures.getFeatureStatus with androidx.health.connect.client.HealthConnectFeatures.FEATURE_ACTIVITY_INTENSITY as the argument."
      },
      {
        "name": "INTENSITY_MINUTES_TOTAL",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the number of weighted intensity minutes from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use androidx.health.connect.client.HealthConnectFeatures.getFeatureStatus with androidx.health.connect.client.HealthConnectFeatures.FEATURE_ACTIVITY_INTENSITY as the argument."
      },
      {
        "name": "MODERATE_DURATION_TOTAL",
        "valueType": "Duration",
        "valueTypeQualified": "java.time.Duration",
        "description": "Metric identifier to retrieve the total duration of moderate activity intensity from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use androidx.health.connect.client.HealthConnectFeatures.getFeatureStatus with androidx.health.connect.client.HealthConnectFeatures.FEATURE_ACTIVITY_INTENSITY as the argument."
      },
      {
        "name": "VIGOROUS_DURATION_TOTAL",
        "valueType": "Duration",
        "valueTypeQualified": "java.time.Duration",
        "description": "Metric identifier to retrieve the total duration of vigorous activity intensity from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use androidx.health.connect.client.HealthConnectFeatures.getFeatureStatus with androidx.health.connect.client.HealthConnectFeatures.FEATURE_ACTIVITY_INTENSITY as the argument."
      }
    ],
    "constants": [
      {
        "name": "ACTIVITY_INTENSITY_TYPE_MODERATE",
        "value": "0",
        "type": "Int",
        "description": "Moderate intensity activity"
      },
      {
        "name": "ACTIVITY_INTENSITY_TYPE_VIGOROUS",
        "value": "1",
        "type": "Int",
        "description": "Vigorous intensity activity."
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ActivityIntensityRecord",
    "sourceUpdated": "2026-08-26"
  },
  {
    "className": "BasalBodyTemperatureRecord",
    "slug": "basal-body-temperature-record",
    "qualifiedName": "androidx.health.connect.client.records.BasalBodyTemperatureRecord",
    "dataTypeLabel": "Basal body temperature",
    "category": "Cycle Tracking",
    "recordShape": "Instantaneous",
    "unitClass": "Temperature",
    "mandatoryFields": [
      "temperature",
      "measurementLocation",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the body temperature of a user when at rest (for example, immediately after waking up). Can be used for checking the fertility window. Each data point represents a single instantaneous body temperature measurement."
    ],
    "googleExample": null,
    "signature": "class BasalBodyTemperatureRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BASAL_BODY_TEMPERATURE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BASAL_BODY_TEMPERATURE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Basal body temperature\" (BasalBodyTemperatureRecord): android.permission.health.READ_BASAL_BODY_TEMPERATURE, android.permission.health.WRITE_BASAL_BODY_TEMPERATURE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BASAL_BODY_TEMPERATURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BASAL_BODY_TEMPERATURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "measurementLocation",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Where on the user's basal body the temperature measurement was taken from. Optional field. Allowed values: BodyTemperatureMeasurementLocation.",
        "inConstructor": true,
        "constructorDefault": "BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "temperature",
        "type": "Temperature",
        "range": null,
        "rangeStatement": "Valid range: 0-100 Celsius degrees.",
        "description": "Temperature in Temperature unit. Required field. Valid range: 0-100 Celsius degrees.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BasalBodyTemperatureRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    temperature: Temperature,\n    measurementLocation: Int = BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BasalBodyTemperatureRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "BasalMetabolicRateRecord",
    "slug": "basal-metabolic-rate-record",
    "qualifiedName": "androidx.health.connect.client.records.BasalMetabolicRateRecord",
    "dataTypeLabel": "Basal metabolic rate",
    "category": "Body Measurement",
    "recordShape": "Instantaneous",
    "unitClass": "Power",
    "mandatoryFields": [
      "basalMetabolicRate",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the BMR of a user. Each record represents the energy a user would burn if at rest all day, based on their height and weight."
    ],
    "googleExample": null,
    "signature": "class BasalMetabolicRateRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BASAL_METABOLIC_RATE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BASAL_METABOLIC_RATE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Basal metabolic rate\" (BasalMetabolicRateRecord): android.permission.health.READ_BASAL_METABOLIC_RATE, android.permission.health.WRITE_BASAL_METABOLIC_RATE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BASAL_METABOLIC_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BASAL_METABOLIC_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "basalMetabolicRate",
        "type": "Power",
        "range": null,
        "rangeStatement": "Valid range: 0-10000 kcal/day.",
        "description": "Basal metabolic rate, in Power unit. Required field. Valid range: 0-10000 kcal/day.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BasalMetabolicRateRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    basalMetabolicRate: Power,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "BASAL_CALORIES_TOTAL",
        "valueType": "Energy",
        "valueTypeQualified": "androidx.health.connect.client.units.Energy",
        "description": "Metric identifier to retrieve the total basal calories burned from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BasalMetabolicRateRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "BloodGlucoseRecord",
    "slug": "blood-glucose-record",
    "qualifiedName": "androidx.health.connect.client.records.BloodGlucoseRecord",
    "dataTypeLabel": "Blood glucose",
    "category": "Vitals",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "level",
      "specimenSource",
      "mealType",
      "relationToMeal",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the concentration of glucose in the blood. Each record represents a single instantaneous blood glucose reading."
    ],
    "googleExample": null,
    "signature": "class BloodGlucoseRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BLOOD_GLUCOSE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BLOOD_GLUCOSE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Blood glucose\" (BloodGlucoseRecord): android.permission.health.READ_BLOOD_GLUCOSE, android.permission.health.WRITE_BLOOD_GLUCOSE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BLOOD_GLUCOSE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BLOOD_GLUCOSE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "level",
        "type": "BloodGlucose",
        "range": null,
        "rangeStatement": "Valid range: 0-50 mmol/L.",
        "description": "Blood glucose level or concentration. Required field. Valid range: 0-50 mmol/L.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "mealType",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Type of meal related to the blood glucose measurement. Optional, enum field. Allowed values: MealType.",
        "inConstructor": true,
        "constructorDefault": "MealType.MEAL_TYPE_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "relationToMeal",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Relationship of the meal to the blood glucose measurement. Optional, enum field. Allowed values: RelationToMeal.",
        "inConstructor": true,
        "constructorDefault": "RELATION_TO_MEAL_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "specimenSource",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Type of body fluid used to measure the blood glucose. Optional, enum field. Allowed values: SpecimenSource.",
        "inConstructor": true,
        "constructorDefault": "SPECIMEN_SOURCE_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BloodGlucoseRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    level: BloodGlucose,\n    specimenSource: Int = SPECIMEN_SOURCE_UNKNOWN,\n    mealType: Int = MealType.MEAL_TYPE_UNKNOWN,\n    relationToMeal: Int = RELATION_TO_MEAL_UNKNOWN\n)"
    ],
    "aggregateMetrics": [],
    "constants": [
      {
        "name": "RELATION_TO_MEAL_AFTER_MEAL",
        "value": "4",
        "type": "Int",
        "description": null
      },
      {
        "name": "RELATION_TO_MEAL_BEFORE_MEAL",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "RELATION_TO_MEAL_FASTING",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "RELATION_TO_MEAL_GENERAL",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "RELATION_TO_MEAL_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      },
      {
        "name": "SPECIMEN_SOURCE_CAPILLARY_BLOOD",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "SPECIMEN_SOURCE_INTERSTITIAL_FLUID",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "SPECIMEN_SOURCE_PLASMA",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "SPECIMEN_SOURCE_SERUM",
        "value": "4",
        "type": "Int",
        "description": null
      },
      {
        "name": "SPECIMEN_SOURCE_TEARS",
        "value": "5",
        "type": "Int",
        "description": null
      },
      {
        "name": "SPECIMEN_SOURCE_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      },
      {
        "name": "SPECIMEN_SOURCE_WHOLE_BLOOD",
        "value": "6",
        "type": "Int",
        "description": null
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BloodGlucoseRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "BloodPressureRecord",
    "slug": "blood-pressure-record",
    "qualifiedName": "androidx.health.connect.client.records.BloodPressureRecord",
    "dataTypeLabel": "Blood pressure",
    "category": "Vitals",
    "recordShape": "Instantaneous",
    "unitClass": "Pressure",
    "mandatoryFields": [
      "systolic",
      "diastolic",
      "bodyPosition",
      "measurementLocation",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the blood pressure of a user. Each record represents a single instantaneous blood pressure reading."
    ],
    "googleExample": null,
    "signature": "class BloodPressureRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BLOOD_PRESSURE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BLOOD_PRESSURE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Blood pressure\" (BloodPressureRecord): android.permission.health.READ_BLOOD_PRESSURE, android.permission.health.WRITE_BLOOD_PRESSURE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BLOOD_PRESSURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BLOOD_PRESSURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "bodyPosition",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "The user's body position when the measurement was taken. Optional field. Allowed values: BodyPosition.",
        "inConstructor": true,
        "constructorDefault": "BODY_POSITION_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "diastolic",
        "type": "Pressure",
        "range": null,
        "rangeStatement": "Valid range: 10-180mmHg.",
        "description": "Diastolic blood pressure measurement, in Pressure unit. Required field. Valid range: 10-180mmHg. For SDK extension 17 or higher, Valid range: 10-300mmHg.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "measurementLocation",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "The arm and part of the arm where the measurement was taken. Optional field. Allowed values: MeasurementLocation.",
        "inConstructor": true,
        "constructorDefault": "MEASUREMENT_LOCATION_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "systolic",
        "type": "Pressure",
        "range": null,
        "rangeStatement": "Valid range: 20-200mmHg.",
        "description": "Systolic blood pressure measurement, in Pressure unit. Required field. Valid range: 20-200mmHg. For SDK extension 17 or higher, Valid range: 20-300mmHg.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BloodPressureRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    systolic: Pressure,\n    diastolic: Pressure,\n    bodyPosition: Int = BODY_POSITION_UNKNOWN,\n    measurementLocation: Int = MEASUREMENT_LOCATION_UNKNOWN\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "DIASTOLIC_AVG",
        "valueType": "Pressure",
        "valueTypeQualified": "androidx.health.connect.client.units.Pressure",
        "description": "Metric identifier to retrieve average diastolic from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "DIASTOLIC_MAX",
        "valueType": "Pressure",
        "valueTypeQualified": "androidx.health.connect.client.units.Pressure",
        "description": "Metric identifier to retrieve maximum diastolic from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "DIASTOLIC_MIN",
        "valueType": "Pressure",
        "valueTypeQualified": "androidx.health.connect.client.units.Pressure",
        "description": "Metric identifier to retrieve minimum diastolic from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SYSTOLIC_AVG",
        "valueType": "Pressure",
        "valueTypeQualified": "androidx.health.connect.client.units.Pressure",
        "description": "Metric identifier to retrieve average systolic from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SYSTOLIC_MAX",
        "valueType": "Pressure",
        "valueTypeQualified": "androidx.health.connect.client.units.Pressure",
        "description": "Metric identifier to retrieve maximum systolic from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SYSTOLIC_MIN",
        "valueType": "Pressure",
        "valueTypeQualified": "androidx.health.connect.client.units.Pressure",
        "description": "Metric identifier to retrieve minimum systolic from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [
      {
        "name": "BODY_POSITION_LYING_DOWN",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "BODY_POSITION_RECLINING",
        "value": "4",
        "type": "Int",
        "description": null
      },
      {
        "name": "BODY_POSITION_SITTING_DOWN",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "BODY_POSITION_STANDING_UP",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "BODY_POSITION_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_LOCATION_LEFT_UPPER_ARM",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_LOCATION_LEFT_WRIST",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_LOCATION_RIGHT_UPPER_ARM",
        "value": "4",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_LOCATION_RIGHT_WRIST",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_LOCATION_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BloodPressureRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "BodyFatRecord",
    "slug": "body-fat-record",
    "qualifiedName": "androidx.health.connect.client.records.BodyFatRecord",
    "dataTypeLabel": "Body fat",
    "category": "Body Measurement",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "percentage",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the body fat percentage of a user. Each record represents a person's total body fat as a percentage of their total body mass."
    ],
    "googleExample": null,
    "signature": "class BodyFatRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BODY_FAT"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BODY_FAT"
    ],
    "permissionEvidence": "Google's data-types table, row \"Body fat\" (BodyFatRecord): android.permission.health.READ_BODY_FAT, android.permission.health.WRITE_BODY_FAT",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BODY_FAT",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BODY_FAT",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "percentage",
        "type": "Percentage",
        "range": null,
        "rangeStatement": "Valid range: 0-100.",
        "description": "Percentage. Required field. Valid range: 0-100.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BodyFatRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    percentage: Percentage,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BodyFatRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "BodyTemperatureRecord",
    "slug": "body-temperature-record",
    "qualifiedName": "androidx.health.connect.client.records.BodyTemperatureRecord",
    "dataTypeLabel": "Body temperature",
    "category": "Vitals",
    "recordShape": "Instantaneous",
    "unitClass": "Temperature",
    "mandatoryFields": [
      "temperature",
      "measurementLocation",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the body temperature of a user. Each record represents a single instantaneous body temperature measurement."
    ],
    "googleExample": null,
    "signature": "class BodyTemperatureRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BODY_TEMPERATURE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BODY_TEMPERATURE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Body temperature\" (BodyTemperatureRecord): android.permission.health.READ_BODY_TEMPERATURE, android.permission.health.WRITE_BODY_TEMPERATURE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BODY_TEMPERATURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BODY_TEMPERATURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "measurementLocation",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Where on the user's body the temperature measurement was taken from. Optional field. Allowed values: BodyTemperatureMeasurementLocation.",
        "inConstructor": true,
        "constructorDefault": "BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "temperature",
        "type": "Temperature",
        "range": null,
        "rangeStatement": "Valid range: 0-100 Celsius degrees.",
        "description": "Temperature in Temperature unit. Required field. Valid range: 0-100 Celsius degrees.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BodyTemperatureRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    temperature: Temperature,\n    measurementLocation: Int = BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BodyTemperatureRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "BodyWaterMassRecord",
    "slug": "body-water-mass-record",
    "qualifiedName": "androidx.health.connect.client.records.BodyWaterMassRecord",
    "dataTypeLabel": "Body water mass",
    "category": "Body Measurement",
    "recordShape": "Instantaneous",
    "unitClass": "Mass",
    "mandatoryFields": [
      "mass",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the user's body water mass. Each record represents a single instantaneous measurement."
    ],
    "googleExample": null,
    "signature": "class BodyWaterMassRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BODY_WATER_MASS"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BODY_WATER_MASS"
    ],
    "permissionEvidence": "Google's data-types table, row \"Body water mass\" (BodyWaterMassRecord): android.permission.health.READ_BODY_WATER_MASS, android.permission.health.WRITE_BODY_WATER_MASS",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BODY_WATER_MASS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BODY_WATER_MASS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "mass",
        "type": "Mass",
        "range": null,
        "rangeStatement": "Valid range: 0-1000 kilograms.",
        "description": "Mass in Mass unit. Required field. Valid range: 0-1000 kilograms.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BodyWaterMassRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    mass: Mass,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BodyWaterMassRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "BoneMassRecord",
    "slug": "bone-mass-record",
    "qualifiedName": "androidx.health.connect.client.records.BoneMassRecord",
    "dataTypeLabel": "Bone mass",
    "category": "Body Measurement",
    "recordShape": "Instantaneous",
    "unitClass": "Mass",
    "mandatoryFields": [
      "mass",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the user's bone mass. Each record represents a single instantaneous measurement."
    ],
    "googleExample": null,
    "signature": "class BoneMassRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_BONE_MASS"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_BONE_MASS"
    ],
    "permissionEvidence": "Google's data-types table, row \"Bone mass\" (BoneMassRecord): android.permission.health.READ_BONE_MASS, android.permission.health.WRITE_BONE_MASS",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_BONE_MASS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_BONE_MASS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "mass",
        "type": "Mass",
        "range": null,
        "rangeStatement": "Valid range: 0-1000 kilograms.",
        "description": "Mass in Mass unit. Required field. Valid range: 0-1000 kilograms.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "BoneMassRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    mass: Mass,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/BoneMassRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "CervicalMucusRecord",
    "slug": "cervical-mucus-record",
    "qualifiedName": "androidx.health.connect.client.records.CervicalMucusRecord",
    "dataTypeLabel": "Cervical mucus",
    "category": "Cycle Tracking",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "appearance",
      "sensation",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the description of cervical mucus. Each record represents a self-assessed description of cervical mucus for a user. All fields are optional and can be used to describe the look and feel of cervical mucus."
    ],
    "googleExample": null,
    "signature": "class CervicalMucusRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_CERVICAL_MUCUS"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_CERVICAL_MUCUS"
    ],
    "permissionEvidence": "Google's data-types table, row \"Cervical mucus\" (CervicalMucusRecord): android.permission.health.READ_CERVICAL_MUCUS, android.permission.health.WRITE_CERVICAL_MUCUS",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_CERVICAL_MUCUS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_CERVICAL_MUCUS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "appearance",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "The consistency of the user's cervical mucus.",
        "inConstructor": true,
        "constructorDefault": "APPEARANCE_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "sensation",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "The feel of the user's cervical mucus.",
        "inConstructor": true,
        "constructorDefault": "SENSATION_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "CervicalMucusRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    appearance: Int = APPEARANCE_UNKNOWN,\n    sensation: Int = SENSATION_UNKNOWN\n)"
    ],
    "aggregateMetrics": [],
    "constants": [
      {
        "name": "APPEARANCE_CREAMY",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "APPEARANCE_DRY",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "APPEARANCE_EGG_WHITE",
        "value": "5",
        "type": "Int",
        "description": "A constant describing clear or egg white like looking cervical mucus."
      },
      {
        "name": "APPEARANCE_STICKY",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "APPEARANCE_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      },
      {
        "name": "APPEARANCE_UNUSUAL",
        "value": "6",
        "type": "Int",
        "description": "A constant describing an unusual (worth attention) kind of cervical mucus."
      },
      {
        "name": "APPEARANCE_WATERY",
        "value": "4",
        "type": "Int",
        "description": null
      },
      {
        "name": "SENSATION_HEAVY",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "SENSATION_LIGHT",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "SENSATION_MEDIUM",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "SENSATION_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/CervicalMucusRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "CyclingPedalingCadenceRecord",
    "slug": "cycling-pedaling-cadence-record",
    "qualifiedName": "androidx.health.connect.client.records.CyclingPedalingCadenceRecord",
    "dataTypeLabel": "Cycling pedaling cadence",
    "category": "Activity",
    "recordShape": "Series",
    "unitClass": null,
    "mandatoryFields": [
      "samples",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the user's cycling pedaling cadence. Each record represents a series of measurements."
    ],
    "googleExample": null,
    "signature": "class CyclingPedalingCadenceRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_EXERCISE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_EXERCISE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Cycling pedaling cadence\" (CyclingPedalingCadenceRecord): android.permission.health.READ_EXERCISE, android.permission.health.WRITE_EXERCISE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_EXERCISE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_EXERCISE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "samples",
        "type": "List<CyclingPedalingCadenceRecord.Sample>",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "CyclingPedalingCadenceRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    samples: List<CyclingPedalingCadenceRecord.Sample>,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "RPM_AVG",
        "valueType": "Double",
        "valueTypeQualified": "kotlin.Double",
        "description": "Metric identifier to retrieve average cycling pedaling cadence from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "RPM_MAX",
        "valueType": "Double",
        "valueTypeQualified": "kotlin.Double",
        "description": "Metric identifier to retrieve maximum cycling pedaling cadence from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "RPM_MIN",
        "valueType": "Double",
        "valueTypeQualified": "kotlin.Double",
        "description": "Metric identifier to retrieve minimum cycling pedaling cadence from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [
      {
        "name": "CyclingPedalingCadenceRecord.Sample",
        "kind": "class",
        "description": "Represents a single measurement of the cycling pedaling cadence."
      }
    ],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/CyclingPedalingCadenceRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "DistanceRecord",
    "slug": "distance-record",
    "qualifiedName": "androidx.health.connect.client.records.DistanceRecord",
    "dataTypeLabel": "Distance",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": "Length",
    "mandatoryFields": [
      "distance",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures distance travelled by the user since the last reading. The total distance over an interval can be calculated by adding together all the values during the interval. The start time of each record should represent the start of the interval in which the distance was covered.",
      "If break downs are preferred in scenario of a long workout, consider writing multiple distance records. The start time of each record should be equal to or greater than the end time of the previous record."
    ],
    "googleExample": null,
    "signature": "class DistanceRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_DISTANCE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_DISTANCE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Distance\" (DistanceRecord): android.permission.health.READ_DISTANCE, android.permission.health.WRITE_DISTANCE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_DISTANCE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_DISTANCE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "distance",
        "type": "Length",
        "range": null,
        "rangeStatement": "Valid range: 0-1000000 meters.",
        "description": "Distance in Length unit. Required field. Valid range: 0-1000000 meters.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "DistanceRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    distance: Length,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "DISTANCE_TOTAL",
        "valueType": "Length",
        "valueTypeQualified": "androidx.health.connect.client.units.Length",
        "description": "Metric identifier to retrieve the total distance from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      },
      {
        "title": "Native tracking guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/native-tracking"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/DistanceRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "ElevationGainedRecord",
    "slug": "elevation-gained-record",
    "qualifiedName": "androidx.health.connect.client.records.ElevationGainedRecord",
    "dataTypeLabel": "Elevation gained",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": "Length",
    "mandatoryFields": [
      "elevation",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the elevation gained by the user since the last reading."
    ],
    "googleExample": null,
    "signature": "class ElevationGainedRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_ELEVATION_GAINED"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_ELEVATION_GAINED"
    ],
    "permissionEvidence": "Google's data-types table, row \"Elevation gained\" (ElevationGainedRecord): android.permission.health.READ_ELEVATION_GAINED, android.permission.health.WRITE_ELEVATION_GAINED",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_ELEVATION_GAINED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_ELEVATION_GAINED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "elevation",
        "type": "Length",
        "range": null,
        "rangeStatement": "Valid range: -1000000-1000000 meters.",
        "description": "Elevation in Length units. Required field. Valid range: -1000000-1000000 meters.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "ElevationGainedRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    elevation: Length,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "ELEVATION_GAINED_TOTAL",
        "valueType": "Length",
        "valueTypeQualified": "androidx.health.connect.client.units.Length",
        "description": "Metric identifier to retrieve the total elevation gained from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ElevationGainedRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "ExerciseSessionRecord",
    "slug": "exercise-session-record",
    "qualifiedName": "androidx.health.connect.client.records.ExerciseSessionRecord",
    "dataTypeLabel": "Exercise",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "exerciseType",
      "endTime",
      "laps",
      "metadata",
      "segments",
      "startTime"
    ],
    "description": [
      "Captures any exercise a user does. This can be common fitness exercise like running or different sports.",
      "Each record needs a start time and end time. Records don't need to be back-to-back or directly after each other, there can be gaps in between.",
      "Example code demonstrate how to read exercise session:"
    ],
    "googleExample": "import androidx.health.connect.client.readRecord\nimport androidx.health.connect.client.records.ExerciseSessionRecord\nimport androidx.health.connect.client.records.HeartRateRecord\nimport androidx.health.connect.client.request.ReadRecordsRequest\nimport androidx.health.connect.client.time.TimeRangeFilter\n\nval response =\n    healthConnectClient.readRecords(\n        ReadRecordsRequest<ExerciseSessionRecord>(\n            timeRangeFilter = TimeRangeFilter.between(startTime, endTime)\n        )\n    )\nfor (exerciseRecord in response.records) {\n    // Process each exercise record\n    // Optionally pull in with other data sources of the same time range.\n    val heartRateRecords =\n        healthConnectClient\n            .readRecords(\n                ReadRecordsRequest<HeartRateRecord>(\n                    timeRangeFilter =\n                        TimeRangeFilter.between(\n                            exerciseRecord.startTime,\n                            exerciseRecord.endTime,\n                        )\n                )\n            )\n            .records\n}",
    "signature": "class ExerciseSessionRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_EXERCISE",
      "android.permission.health.READ_EXERCISE_ROUTE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_EXERCISE",
      "android.permission.health.WRITE_EXERCISE_ROUTE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Exercise\" (ExerciseSessionRecord): android.permission.health.READ_EXERCISE, android.permission.health.READ_EXERCISE_ROUTE, android.permission.health.WRITE_EXERCISE, android.permission.health.WRITE_EXERCISE_ROUTE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_EXERCISE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.READ_EXERCISE_ROUTE",
        "inFrameworkReference": false,
        "frameworkAdded": null,
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_EXERCISE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_EXERCISE_ROUTE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "exerciseRouteResult",
        "type": "ExerciseRouteResult",
        "range": null,
        "rangeStatement": null,
        "description": "ExerciseRouteResult of the session. Location data points of ExerciseRoute should be within the parent session, and should be before the end time of the session.",
        "inConstructor": false,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "exerciseType",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Type of exercise (e.g. walking, swimming). Required field.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "laps",
        "type": "List<ExerciseLap>",
        "range": null,
        "rangeStatement": null,
        "description": "ExerciseLaps of the session. Optional field. Time in laps should be within the parent session, and should not overlap with each other.",
        "inConstructor": true,
        "constructorDefault": "emptyList()",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "notes",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Additional notes for the session. Optional field.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "plannedExerciseSessionId",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "rateOfPerceivedExertion",
        "type": "Float?",
        "range": {
          "annotation": "@FloatRange(from = 0.0, to = 10.0)",
          "from": "0.0",
          "to": "10.0"
        },
        "rangeStatement": null,
        "description": "Rate of perceived exertion (RPE) for the session. Must be between 0 and 10. See ExerciseSegment.rateOfPerceivedExertion",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.2.0-alpha06",
        "deprecated": false
      },
      {
        "name": "segments",
        "type": "List<ExerciseSegment>",
        "range": null,
        "rangeStatement": null,
        "description": "ExerciseSegments of the session. Optional field. Time in segments should be within the parent session, and should not overlap with each other.",
        "inConstructor": true,
        "constructorDefault": "emptyList()",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "title",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Title of the session. Optional field.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "ExerciseSessionRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    exerciseType: Int,\n    title: String? = null,\n    notes: String? = null,\n    segments: List<ExerciseSegment> = emptyList(),\n    laps: List<ExerciseLap> = emptyList(),\n    exerciseRoute: ExerciseRoute? = null,\n    plannedExerciseSessionId: String? = null,\n    rateOfPerceivedExertion: @FloatRange(from = 0.0, to = 10.0) Float? = null\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "EXERCISE_DURATION_TOTAL",
        "valueType": "Duration",
        "valueTypeQualified": "java.time.Duration",
        "description": "Metric identifier to retrieve the total exercise time from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [
      {
        "name": "EXERCISE_TYPE_BADMINTON",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_BASEBALL",
        "value": "4",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_BASKETBALL",
        "value": "5",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_BIKING",
        "value": "8",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_BIKING_STATIONARY",
        "value": "9",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_BOOT_CAMP",
        "value": "10",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_BOXING",
        "value": "11",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_CALISTHENICS",
        "value": "13",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_CRICKET",
        "value": "14",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_DANCING",
        "value": "16",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_ELLIPTICAL",
        "value": "25",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_EXERCISE_CLASS",
        "value": "26",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_FENCING",
        "value": "27",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_FOOTBALL_AMERICAN",
        "value": "28",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_FOOTBALL_AUSTRALIAN",
        "value": "29",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_FRISBEE_DISC",
        "value": "31",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_GOLF",
        "value": "32",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_GUIDED_BREATHING",
        "value": "33",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_GYMNASTICS",
        "value": "34",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_HANDBALL",
        "value": "35",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING",
        "value": "36",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_HIKING",
        "value": "37",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_ICE_HOCKEY",
        "value": "38",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_ICE_SKATING",
        "value": "39",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_MARTIAL_ARTS",
        "value": "44",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_OTHER_WORKOUT",
        "value": "0",
        "type": "Int",
        "description": "Can be used to represent any generic workout that does not fall into a specific category. Any unknown new value definition will also fall automatically into EXERCISE_TYPE_OTHER_WORKOUT. Next Id: 84."
      },
      {
        "name": "EXERCISE_TYPE_PADDLING",
        "value": "46",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_PARAGLIDING",
        "value": "47",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_PILATES",
        "value": "48",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_RACQUETBALL",
        "value": "50",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_ROCK_CLIMBING",
        "value": "51",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_ROLLER_HOCKEY",
        "value": "52",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_ROWING",
        "value": "53",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_ROWING_MACHINE",
        "value": "54",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_RUGBY",
        "value": "55",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_RUNNING",
        "value": "56",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_RUNNING_TREADMILL",
        "value": "57",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SAILING",
        "value": "58",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SCUBA_DIVING",
        "value": "59",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SKATING",
        "value": "60",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SKIING",
        "value": "61",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SNOWBOARDING",
        "value": "62",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SNOWSHOEING",
        "value": "63",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SOCCER",
        "value": "64",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SOFTBALL",
        "value": "65",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SQUASH",
        "value": "66",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_STAIR_CLIMBING",
        "value": "68",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE",
        "value": "69",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_STRENGTH_TRAINING",
        "value": "70",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_STRETCHING",
        "value": "71",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SURFING",
        "value": "72",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SWIMMING_OPEN_WATER",
        "value": "73",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_SWIMMING_POOL",
        "value": "74",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_TABLE_TENNIS",
        "value": "75",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_TENNIS",
        "value": "76",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_VOLLEYBALL",
        "value": "78",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_WALKING",
        "value": "79",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_WATER_POLO",
        "value": "80",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_WEIGHTLIFTING",
        "value": "81",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_WHEELCHAIR",
        "value": "82",
        "type": "Int",
        "description": null
      },
      {
        "name": "EXERCISE_TYPE_YOGA",
        "value": "83",
        "type": "Int",
        "description": null
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      },
      {
        "title": "Add exercise routes guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/exercise-routes"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/ExerciseSessionRecord",
    "sourceUpdated": "2026-08-26"
  },
  {
    "className": "FloorsClimbedRecord",
    "slug": "floors-climbed-record",
    "qualifiedName": "androidx.health.connect.client.records.FloorsClimbedRecord",
    "dataTypeLabel": "Floors climbed",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "floors",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the number of floors climbed by the user since the last reading."
    ],
    "googleExample": null,
    "signature": "class FloorsClimbedRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_FLOORS_CLIMBED"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_FLOORS_CLIMBED"
    ],
    "permissionEvidence": "Google's data-types table, row \"Floors climbed\" (FloorsClimbedRecord): android.permission.health.READ_FLOORS_CLIMBED, android.permission.health.WRITE_FLOORS_CLIMBED",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_FLOORS_CLIMBED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_FLOORS_CLIMBED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "floors",
        "type": "Double",
        "range": null,
        "rangeStatement": "Valid range: 0-1000000.",
        "description": "Number of floors. Required field. Valid range: 0-1000000.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "FloorsClimbedRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    floors: Double,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "FLOORS_CLIMBED_TOTAL",
        "valueType": "Double",
        "valueTypeQualified": "kotlin.Double",
        "description": "Metric identifier to retrieve the total floors climbed from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/FloorsClimbedRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "HeartRateRecord",
    "slug": "heart-rate-record",
    "qualifiedName": "androidx.health.connect.client.records.HeartRateRecord",
    "dataTypeLabel": "Heart rate",
    "category": "Vitals",
    "recordShape": "Series",
    "unitClass": null,
    "mandatoryFields": [
      "samples",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the user's heart rate. Each record represents a series of measurements."
    ],
    "googleExample": null,
    "signature": "class HeartRateRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_HEART_RATE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_HEART_RATE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Heart rate\" (HeartRateRecord): android.permission.health.READ_HEART_RATE, android.permission.health.WRITE_HEART_RATE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_HEART_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_HEART_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "samples",
        "type": "List<HeartRateRecord.Sample>",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "HeartRateRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    samples: List<HeartRateRecord.Sample>,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "BPM_AVG",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the average heart rate from AggregationResult."
      },
      {
        "name": "BPM_MAX",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the maximum heart rate from AggregationResult."
      },
      {
        "name": "BPM_MIN",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the minimum heart rate from AggregationResult."
      },
      {
        "name": "MEASUREMENTS_COUNT",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the number of heart rate measurements from AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [
      {
        "name": "HeartRateRecord.Sample",
        "kind": "class",
        "description": "Represents a single measurement of the heart rate."
      }
    ],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/HeartRateRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "HeartRateVariabilityRmssdRecord",
    "slug": "heart-rate-variability-rmssd-record",
    "qualifiedName": "androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord",
    "dataTypeLabel": "Heart rate variability",
    "category": "Vitals",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "heartRateVariabilityMillis",
      "metadata",
      "time"
    ],
    "description": [
      "Captures user's heart rate variability (HRV) as measured by the root mean square of successive differences (RMSSD) between normal heartbeats."
    ],
    "googleExample": null,
    "signature": "class HeartRateVariabilityRmssdRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_HEART_RATE_VARIABILITY"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_HEART_RATE_VARIABILITY"
    ],
    "permissionEvidence": "Google's data-types table, row \"Heart rate variability\" (HeartRateVariabilityRmssdRecord): android.permission.health.READ_HEART_RATE_VARIABILITY, android.permission.health.WRITE_HEART_RATE_VARIABILITY",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_HEART_RATE_VARIABILITY",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_HEART_RATE_VARIABILITY",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "heartRateVariabilityMillis",
        "type": "Double",
        "range": null,
        "rangeStatement": "Valid Range: 1-200.",
        "description": "Heart rate variability in milliseconds. Required field. Valid Range: 1-200.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "HeartRateVariabilityRmssdRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    heartRateVariabilityMillis: Double,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/HeartRateVariabilityRmssdRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "HeightRecord",
    "slug": "height-record",
    "qualifiedName": "androidx.health.connect.client.records.HeightRecord",
    "dataTypeLabel": "Height",
    "category": "Body Measurement",
    "recordShape": "Instantaneous",
    "unitClass": "Length",
    "mandatoryFields": [
      "height",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the user's height."
    ],
    "googleExample": null,
    "signature": "class HeightRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_HEIGHT"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_HEIGHT"
    ],
    "permissionEvidence": "Google's data-types table, row \"Height\" (HeightRecord): android.permission.health.READ_HEIGHT, android.permission.health.WRITE_HEIGHT",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_HEIGHT",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_HEIGHT",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "height",
        "type": "Length",
        "range": null,
        "rangeStatement": "Valid range: 0-3 meters.",
        "description": "Height in Length unit. Required field. Valid range: 0-3 meters.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "HeightRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    height: Length,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "HEIGHT_AVG",
        "valueType": "Length",
        "valueTypeQualified": "androidx.health.connect.client.units.Length",
        "description": "Metric identifier to retrieve the average height from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "HEIGHT_MAX",
        "valueType": "Length",
        "valueTypeQualified": "androidx.health.connect.client.units.Length",
        "description": "Metric identifier to retrieve the maximum height from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "HEIGHT_MIN",
        "valueType": "Length",
        "valueTypeQualified": "androidx.health.connect.client.units.Length",
        "description": "Metric identifier to retrieve minimum height from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/HeightRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "HydrationRecord",
    "slug": "hydration-record",
    "qualifiedName": "androidx.health.connect.client.records.HydrationRecord",
    "dataTypeLabel": "Hydration",
    "category": "Nutrition",
    "recordShape": "Interval",
    "unitClass": "Volume",
    "mandatoryFields": [
      "endTime",
      "metadata",
      "startTime",
      "volume"
    ],
    "description": [
      "Captures how much water a user drank in a single drink."
    ],
    "googleExample": null,
    "signature": "class HydrationRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_HYDRATION"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_HYDRATION"
    ],
    "permissionEvidence": "Google's data-types table, row \"Hydration\" (HydrationRecord): android.permission.health.READ_HYDRATION, android.permission.health.WRITE_HYDRATION",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_HYDRATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_HYDRATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "volume",
        "type": "Volume",
        "range": null,
        "rangeStatement": "Valid range: 0-100 liters.",
        "description": "Volume of water in Volume unit. Required field. Valid range: 0-100 liters.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "HydrationRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    volume: Volume,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "VOLUME_TOTAL",
        "valueType": "Volume",
        "valueTypeQualified": "androidx.health.connect.client.units.Volume",
        "description": "Metric identifier to retrieve total hydration from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/HydrationRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "IntermenstrualBleedingRecord",
    "slug": "intermenstrual-bleeding-record",
    "qualifiedName": "androidx.health.connect.client.records.IntermenstrualBleedingRecord",
    "dataTypeLabel": "Intermenstrual bleeding",
    "category": "Cycle Tracking",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "metadata",
      "time"
    ],
    "description": [
      "Captures an instance of user's intermenstrual bleeding, also known as spotting."
    ],
    "googleExample": null,
    "signature": "class IntermenstrualBleedingRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_INTERMENSTRUAL_BLEEDING"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_INTERMENSTRUAL_BLEEDING"
    ],
    "permissionEvidence": "Google's data-types table, row \"Intermenstrual bleeding\" (IntermenstrualBleedingRecord): android.permission.health.READ_INTERMENSTRUAL_BLEEDING, android.permission.health.WRITE_INTERMENSTRUAL_BLEEDING",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_INTERMENSTRUAL_BLEEDING",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_INTERMENSTRUAL_BLEEDING",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "IntermenstrualBleedingRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/IntermenstrualBleedingRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "LeanBodyMassRecord",
    "slug": "lean-body-mass-record",
    "qualifiedName": "androidx.health.connect.client.records.LeanBodyMassRecord",
    "dataTypeLabel": "Lean body mass",
    "category": "Body Measurement",
    "recordShape": "Instantaneous",
    "unitClass": "Mass",
    "mandatoryFields": [
      "mass",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the user's lean body mass. Each record represents a single instantaneous measurement."
    ],
    "googleExample": null,
    "signature": "class LeanBodyMassRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_LEAN_BODY_MASS"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_LEAN_BODY_MASS"
    ],
    "permissionEvidence": "Google's data-types table, row \"Lean body mass\" (LeanBodyMassRecord): android.permission.health.READ_LEAN_BODY_MASS, android.permission.health.WRITE_LEAN_BODY_MASS",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_LEAN_BODY_MASS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_LEAN_BODY_MASS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "mass",
        "type": "Mass",
        "range": null,
        "rangeStatement": "Valid range: 0-1000 kilograms.",
        "description": "Mass in Mass unit. Required field. Valid range: 0-1000 kilograms.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "LeanBodyMassRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    mass: Mass,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/LeanBodyMassRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "MenstruationFlowRecord",
    "slug": "menstruation-flow-record",
    "qualifiedName": "androidx.health.connect.client.records.MenstruationFlowRecord",
    "dataTypeLabel": "Menstruation",
    "category": "Cycle Tracking",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "flow",
      "metadata",
      "time"
    ],
    "description": [
      "Captures a description of how heavy a user's menstrual flow was (light, medium, or heavy). Each record represents a description of how heavy the user's menstrual bleeding was."
    ],
    "googleExample": null,
    "signature": "class MenstruationFlowRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_MENSTRUATION"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_MENSTRUATION"
    ],
    "permissionEvidence": "Google's data-types table, row \"Menstruation\" (MenstruationFlowRecord, MenstruationPeriodRecord): android.permission.health.READ_MENSTRUATION, android.permission.health.WRITE_MENSTRUATION",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_MENSTRUATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_MENSTRUATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [
      "MenstruationPeriodRecord"
    ],
    "properties": [
      {
        "name": "flow",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "How heavy the user's menstrual flow was. Optional field.",
        "inConstructor": true,
        "constructorDefault": "FLOW_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "MenstruationFlowRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    flow: Int = FLOW_UNKNOWN\n)"
    ],
    "aggregateMetrics": [],
    "constants": [
      {
        "name": "FLOW_HEAVY",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "FLOW_LIGHT",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "FLOW_MEDIUM",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "FLOW_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/MenstruationFlowRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "MenstruationPeriodRecord",
    "slug": "menstruation-period-record",
    "qualifiedName": "androidx.health.connect.client.records.MenstruationPeriodRecord",
    "dataTypeLabel": "Menstruation",
    "category": "Cycle Tracking",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures user's menstruation periods."
    ],
    "googleExample": null,
    "signature": "class MenstruationPeriodRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_MENSTRUATION"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_MENSTRUATION"
    ],
    "permissionEvidence": "Google's data-types table, row \"Menstruation\" (MenstruationFlowRecord, MenstruationPeriodRecord): android.permission.health.READ_MENSTRUATION, android.permission.health.WRITE_MENSTRUATION",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_MENSTRUATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_MENSTRUATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [
      "MenstruationFlowRecord"
    ],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "MenstruationPeriodRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/MenstruationPeriodRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "MindfulnessSessionRecord",
    "slug": "mindfulness-session-record",
    "qualifiedName": "androidx.health.connect.client.records.MindfulnessSessionRecord",
    "dataTypeLabel": "Mindfulness",
    "category": "Wellness",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "endTime",
      "metadata",
      "mindfulnessSessionType",
      "startTime"
    ],
    "description": [
      "Captures any mindfulness session a user does. This can be mindfulness sessions like meditation, breathing.",
      "Each record needs a start time and end time. Records don't need to be back-to-back or directly after each other, there can be gaps in between.",
      "The ability to insert or read this record type is dependent on the version of HealthConnect installed on the device. To check if available: call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_MINDFULNESS_SESSION as an argument."
    ],
    "googleExample": null,
    "signature": "class MindfulnessSessionRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": "FEATURE_MINDFULNESS_SESSION",
    "readPermissions": [
      "android.permission.health.READ_MINDFULNESS"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_MINDFULNESS"
    ],
    "permissionEvidence": "Google's data-types table, row \"Mindfulness\" (MindfulnessSessionRecord): android.permission.health.READ_MINDFULNESS, android.permission.health.WRITE_MINDFULNESS",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_MINDFULNESS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 36 Also in U Extensions 15",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_MINDFULNESS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 36 Also in U Extensions 15",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "mindfulnessSessionType",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Type of mindfulness session (e.g. meditation, breathing, including unknown type).",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "notes",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Additional notes for the session.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "title",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Title of the session.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "MindfulnessSessionRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    mindfulnessSessionType: Int,\n    title: String? = null,\n    notes: String? = null\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "MINDFULNESS_DURATION_TOTAL",
        "valueType": "Duration",
        "valueTypeQualified": "java.time.Duration",
        "description": "Metric identifier to retrieve the total mindfulness session duration from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use HealthConnectFeatures.getFeatureStatus with HealthConnectFeatures.FEATURE_MINDFULNESS_SESSION as the argument."
      }
    ],
    "constants": [
      {
        "name": "MINDFULNESS_SESSION_TYPE_BREATHING",
        "value": "2",
        "type": "Int",
        "description": "Guided breathing mindfulness session."
      },
      {
        "name": "MINDFULNESS_SESSION_TYPE_MEDITATION",
        "value": "1",
        "type": "Int",
        "description": "Meditation mindfulness session."
      },
      {
        "name": "MINDFULNESS_SESSION_TYPE_MOVEMENT",
        "value": "4",
        "type": "Int",
        "description": "Stretches/movement mindfulness session."
      },
      {
        "name": "MINDFULNESS_SESSION_TYPE_MUSIC",
        "value": "3",
        "type": "Int",
        "description": "Music/soundscapes mindfulness session."
      },
      {
        "name": "MINDFULNESS_SESSION_TYPE_UNGUIDED",
        "value": "5",
        "type": "Int",
        "description": "Unguided mindfulness session."
      },
      {
        "name": "MINDFULNESS_SESSION_TYPE_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": "Can be used to represent any generic mindfulness session that does not fall into a specific category. Any unknown new value definition will also fall automatically into MINDFULNESS_SESSION_TYPE_UNKNOWN. Use this type if the mindfulness session type is unknown."
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Track mindfulness guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/mindfulness"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/MindfulnessSessionRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "NutritionRecord",
    "slug": "nutrition-record",
    "qualifiedName": "androidx.health.connect.client.records.NutritionRecord",
    "dataTypeLabel": "Nutrition",
    "category": "Nutrition",
    "recordShape": "Interval",
    "unitClass": "Mass",
    "mandatoryFields": [
      "endTime",
      "mealType",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures what nutrients were consumed as part of a meal or a food item."
    ],
    "googleExample": null,
    "signature": "class NutritionRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_NUTRITION"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_NUTRITION"
    ],
    "permissionEvidence": "Google's data-types table, row \"Nutrition\" (NutritionRecord): android.permission.health.READ_NUTRITION, android.permission.health.WRITE_NUTRITION",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_NUTRITION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_NUTRITION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "biotin",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Biotin in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "caffeine",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Caffeine in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "calcium",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Calcium in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "chloride",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Chloride in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "cholesterol",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Cholesterol in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "chromium",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Chromium in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "copper",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Copper in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "dietaryFiber",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Dietary fiber in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "energy",
        "type": "Energy?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 kcal.",
        "description": "Energy in Energy unit. Optional field. Valid range: 0-100000 kcal.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "energyFromFat",
        "type": "Energy?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 kcal.",
        "description": "Energy from fat in Energy unit. Optional field. Valid range: 0-100000 kcal.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "folate",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Folate in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "folicAcid",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Folic acid in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "iodine",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Iodine in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "iron",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Iron in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "magnesium",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Magnesium in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "manganese",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Manganese in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "mealType",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Type of meal related to the nutrients consumed. Optional, enum field. Allowed values: MealType.",
        "inConstructor": true,
        "constructorDefault": "MealType.MEAL_TYPE_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "molybdenum",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Molybdenum in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "monounsaturatedFat",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Monounsaturated fat in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "name",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Name for food or drink, provided by the user. Optional field.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "niacin",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Niacin in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "pantothenicAcid",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Pantothenic acid in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "phosphorus",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Phosphorus in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "polyunsaturatedFat",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Polyunsaturated fat in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "potassium",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Potassium in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "protein",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Protein in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "riboflavin",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Riboflavin in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "saturatedFat",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Saturated fat in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "selenium",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Selenium in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "sodium",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Sodium in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "sugar",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Sugar in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "thiamin",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Thiamin in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "totalCarbohydrate",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Total carbohydrate in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "totalFat",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Total fat in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "transFat",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Trans fat in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "unsaturatedFat",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100000 grams.",
        "description": "Unsaturated fat in Mass unit. Optional field. Valid range: 0-100000 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vitaminA",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Vitamin A in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vitaminB12",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Vitamin B12 in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vitaminB6",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Vitamin B6 in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vitaminC",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Vitamin C in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vitaminD",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Vitamin D in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vitaminE",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Vitamin E in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vitaminK",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Vitamin K in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zinc",
        "type": "Mass?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 grams.",
        "description": "Zinc in Mass unit. Optional field. Valid range: 0-100 grams.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "NutritionRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    biotin: Mass? = null,\n    caffeine: Mass? = null,\n    calcium: Mass? = null,\n    energy: Energy? = null,\n    energyFromFat: Energy? = null,\n    chloride: Mass? = null,\n    cholesterol: Mass? = null,\n    chromium: Mass? = null,\n    copper: Mass? = null,\n    dietaryFiber: Mass? = null,\n    folate: Mass? = null,\n    folicAcid: Mass? = null,\n    iodine: Mass? = null,\n    iron: Mass? = null,\n    magnesium: Mass? = null,\n    manganese: Mass? = null,\n    molybdenum: Mass? = null,\n    monounsaturatedFat: Mass? = null,\n    niacin: Mass? = null,\n    pantothenicAcid: Mass? = null,\n    phosphorus: Mass? = null,\n    polyunsaturatedFat: Mass? = null,\n    potassium: Mass? = null,\n    protein: Mass? = null,\n    riboflavin: Mass? = null,\n    saturatedFat: Mass? = null,\n    selenium: Mass? = null,\n    sodium: Mass? = null,\n    sugar: Mass? = null,\n    thiamin: Mass? = null,\n    totalCarbohydrate: Mass? = null,\n    totalFat: Mass? = null,\n    transFat: Mass? = null,\n    unsaturatedFat: Mass? = null,\n    vitaminA: Mass? = null,\n    vitaminB12: Mass? = null,\n    vitaminB6: Mass? = null,\n    vitaminC: Mass? = null,\n    vitaminD: Mass? = null,\n    vitaminE: Mass? = null,\n    vitaminK: Mass? = null,\n    zinc: Mass? = null,\n    name: String? = null,\n    mealType: Int = MealType.MEAL_TYPE_UNKNOWN\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "BIOTIN_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total biotin from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "CAFFEINE_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total caffeine from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "CALCIUM_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total calcium from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "CHLORIDE_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total chloride from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "CHOLESTEROL_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total cholesterol from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "CHROMIUM_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total chromium from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "COPPER_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total copper from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "DIETARY_FIBER_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total dietary fiber from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "ENERGY_FROM_FAT_TOTAL",
        "valueType": "Energy",
        "valueTypeQualified": "androidx.health.connect.client.units.Energy",
        "description": "Metric identifier to retrieve the total energy from fat from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "ENERGY_TOTAL",
        "valueType": "Energy",
        "valueTypeQualified": "androidx.health.connect.client.units.Energy",
        "description": "Metric identifier to retrieve the total energy from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "FOLATE_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total folate from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "FOLIC_ACID_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total folic acid from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "IODINE_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total iodine from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "IRON_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total iron from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "MAGNESIUM_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total magnesium from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "MANGANESE_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total manganese from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "MOLYBDENUM_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total molybdenum from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "MONOUNSATURATED_FAT_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total monounsaturated fat from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "NIACIN_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total niacin from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "PANTOTHENIC_ACID_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total pantothenic acid from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "PHOSPHORUS_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total phosphorus from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "POLYUNSATURATED_FAT_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total polyunsaturated fat from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "POTASSIUM_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total potassium from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "PROTEIN_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total protein from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "RIBOFLAVIN_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total riboflavin from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SATURATED_FAT_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total saturated fat from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SELENIUM_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total selenium from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SODIUM_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total sodium from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SUGAR_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total sugar from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "THIAMIN_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total thiamin from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "TOTAL_CARBOHYDRATE_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total total carbohydrate from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "TOTAL_FAT_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total total fat from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "TRANS_FAT_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total trans fat from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "UNSATURATED_FAT_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total unsaturated fat from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "VITAMIN_A_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total vitamin a from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "VITAMIN_B12_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total vitamin b12 from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "VITAMIN_B6_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total vitamin b6 from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "VITAMIN_C_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total vitamin c from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "VITAMIN_D_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total vitamin d from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "VITAMIN_E_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total vitamin e from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "VITAMIN_K_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total vitamin k from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "ZINC_TOTAL",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the total zinc from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/NutritionRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "OvulationTestRecord",
    "slug": "ovulation-test-record",
    "qualifiedName": "androidx.health.connect.client.records.OvulationTestRecord",
    "dataTypeLabel": "Ovulation test",
    "category": "Cycle Tracking",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "metadata",
      "result",
      "time"
    ],
    "description": [
      "Each record represents the result of an ovulation test."
    ],
    "googleExample": null,
    "signature": "class OvulationTestRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_OVULATION_TEST"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_OVULATION_TEST"
    ],
    "permissionEvidence": "Google's data-types table, row \"Ovulation test\" (OvulationTestRecord): android.permission.health.READ_OVULATION_TEST, android.permission.health.WRITE_OVULATION_TEST",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_OVULATION_TEST",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_OVULATION_TEST",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "result",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "The result of a user's ovulation test, which shows if they're ovulating or not. Required field.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "OvulationTestRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    result: Int,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [
      {
        "name": "RESULT_HIGH",
        "value": "2",
        "type": "Int",
        "description": "High fertility. Refers to a rise in estrogen or luteinizing hormone that may signal the fertile window (time in the menstrual cycle when conception is likely to occur)."
      },
      {
        "name": "RESULT_INCONCLUSIVE",
        "value": "0",
        "type": "Int",
        "description": "Inconclusive result. Refers to ovulation test results that are indeterminate (e.g. may be testing malfunction, user error, etc.). \". Any unknown value will also be returned as RESULT_INCONCLUSIVE."
      },
      {
        "name": "RESULT_NEGATIVE",
        "value": "3",
        "type": "Int",
        "description": "Negative fertility (may also be referred as \"low\" fertility). Refers to the time in the cycle where fertility/conception is expected to be low."
      },
      {
        "name": "RESULT_POSITIVE",
        "value": "1",
        "type": "Int",
        "description": "Positive fertility (may also be referred as \"peak\" fertility). Refers to the peak of the luteinizing hormone (LH) surge and ovulation is expected to occur in 10-36 hours."
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/OvulationTestRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "OxygenSaturationRecord",
    "slug": "oxygen-saturation-record",
    "qualifiedName": "androidx.health.connect.client.records.OxygenSaturationRecord",
    "dataTypeLabel": "Oxygen saturation",
    "category": "Vitals",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "metadata",
      "percentage",
      "time"
    ],
    "description": [
      "Captures the amount of oxygen circulating in the blood, measured as a percentage of oxygen-saturated hemoglobin. Each record represents a single blood oxygen saturation reading at the time of measurement."
    ],
    "googleExample": null,
    "signature": "class OxygenSaturationRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_OXYGEN_SATURATION"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_OXYGEN_SATURATION"
    ],
    "permissionEvidence": "Google's data-types table, row \"Oxygen saturation\" (OxygenSaturationRecord): android.permission.health.READ_OXYGEN_SATURATION, android.permission.health.WRITE_OXYGEN_SATURATION",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_OXYGEN_SATURATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_OXYGEN_SATURATION",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "percentage",
        "type": "Percentage",
        "range": null,
        "rangeStatement": "Valid range: 0-100.",
        "description": "Percentage. Required field. Valid range: 0-100.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "OxygenSaturationRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    percentage: Percentage,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/OxygenSaturationRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "PlannedExerciseSessionRecord",
    "slug": "planned-exercise-session-record",
    "qualifiedName": "androidx.health.connect.client.records.PlannedExerciseSessionRecord",
    "dataTypeLabel": "Planned exercise",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "block",
      "endTime",
      "exerciseType",
      "hasExplicitTime",
      "metadata"
    ],
    "description": [
      "Captures a planned exercise session, also commonly referred to as a training plan.",
      "Each record contains a start time, end time, an exercise type and a list of [PlannedExerciseBlock] which describe the details of the planned session. The start and end times may be in the future. Requires androidx.health.connect.client.HealthConnectFeatures.FEATURE_PLANNED_EXERCISE."
    ],
    "googleExample": null,
    "signature": "class PlannedExerciseSessionRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": "FEATURE_PLANNED_EXERCISE",
    "readPermissions": [
      "android.permission.health.READ_PLANNED_EXERCISE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_PLANNED_EXERCISE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Planned exercise\" (PlannedExerciseSessionRecord): android.permission.health.READ_PLANNED_EXERCISE, android.permission.health.WRITE_PLANNED_EXERCISE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_PLANNED_EXERCISE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 35 Also in U Extensions 13",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_PLANNED_EXERCISE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 35 Also in U Extensions 13",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "blocks",
        "type": "List<PlannedExerciseBlock>",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "completedExerciseSessionId",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "The exercise session that completed this planned session.",
        "inConstructor": false,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "exerciseType",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Type of exercise (e.g. walking, swimming). Required field.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "hasExplicitTime",
        "type": "Boolean",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": false,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "notes",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Additional notes for the session. Optional field.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "title",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Title of the session. Optional field.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "PlannedExerciseSessionRecord(\n    metadata: Metadata,\n    startDate: LocalDate,\n    duration: Duration,\n    blocks: List<PlannedExerciseBlock>,\n    exerciseType: Int,\n    title: String? = null,\n    notes: String? = null\n)",
      "PlannedExerciseSessionRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    blocks: List<PlannedExerciseBlock>,\n    exerciseType: Int,\n    title: String? = null,\n    notes: String? = null\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      },
      {
        "title": "Training plans guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/training-plans"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/PlannedExerciseSessionRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "PowerRecord",
    "slug": "power-record",
    "qualifiedName": "androidx.health.connect.client.records.PowerRecord",
    "dataTypeLabel": "Power",
    "category": "Activity",
    "recordShape": "Series",
    "unitClass": null,
    "mandatoryFields": [
      "endTime",
      "samples",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the power generated by the user, e.g. during cycling or rowing with a power meter. Each record represents a series of measurements."
    ],
    "googleExample": null,
    "signature": "class PowerRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_POWER"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_POWER"
    ],
    "permissionEvidence": "Google's data-types table, row \"Power\" (PowerRecord): android.permission.health.READ_POWER, android.permission.health.WRITE_POWER",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_POWER",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_POWER",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "samples",
        "type": "List<PowerRecord.Sample>",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "PowerRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    samples: List<PowerRecord.Sample>,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "POWER_AVG",
        "valueType": "Power",
        "valueTypeQualified": "androidx.health.connect.client.units.Power",
        "description": "Metric identifier to retrieve average power from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "POWER_MAX",
        "valueType": "Power",
        "valueTypeQualified": "androidx.health.connect.client.units.Power",
        "description": "Metric identifier to retrieve maximum power from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "POWER_MIN",
        "valueType": "Power",
        "valueTypeQualified": "androidx.health.connect.client.units.Power",
        "description": "Metric identifier to retrieve minimum power from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [
      {
        "name": "PowerRecord.Sample",
        "kind": "class",
        "description": "Represents a single measurement of power."
      }
    ],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/PowerRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "RespiratoryRateRecord",
    "slug": "respiratory-rate-record",
    "qualifiedName": "androidx.health.connect.client.records.RespiratoryRateRecord",
    "dataTypeLabel": "Respiratory rate",
    "category": "Vitals",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "metadata",
      "rate",
      "time"
    ],
    "description": [
      "Captures the user's respiratory rate. Each record represents a single instantaneous measurement."
    ],
    "googleExample": null,
    "signature": "class RespiratoryRateRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_RESPIRATORY_RATE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_RESPIRATORY_RATE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Respiratory rate\" (RespiratoryRateRecord): android.permission.health.READ_RESPIRATORY_RATE, android.permission.health.WRITE_RESPIRATORY_RATE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_RESPIRATORY_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_RESPIRATORY_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "rate",
        "type": "Double",
        "range": null,
        "rangeStatement": "Valid range: 0-1000.",
        "description": "Respiratory rate in breaths per minute. Required field. Valid range: 0-1000.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "RespiratoryRateRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    rate: Double,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/RespiratoryRateRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "RestingHeartRateRecord",
    "slug": "resting-heart-rate-record",
    "qualifiedName": "androidx.health.connect.client.records.RestingHeartRateRecord",
    "dataTypeLabel": "Resting heart rate",
    "category": "Vitals",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "beatsPerMinute",
      "metadata",
      "time"
    ],
    "description": [
      "Captures the user's resting heart rate. Each record represents a single instantaneous measurement."
    ],
    "googleExample": null,
    "signature": "class RestingHeartRateRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_RESTING_HEART_RATE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_RESTING_HEART_RATE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Resting heart rate\" (RestingHeartRateRecord): android.permission.health.READ_RESTING_HEART_RATE, android.permission.health.WRITE_RESTING_HEART_RATE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_RESTING_HEART_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_RESTING_HEART_RATE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "beatsPerMinute",
        "type": "Long",
        "range": null,
        "rangeStatement": "Validation range: 1-300.",
        "description": "Heart beats per minute. Required field. Validation range: 1-300.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "RestingHeartRateRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    beatsPerMinute: Long,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "BPM_AVG",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the average resting heart rate from AggregationResult."
      },
      {
        "name": "BPM_MAX",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the maximum resting heart rate from AggregationResult."
      },
      {
        "name": "BPM_MIN",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the minimum resting heart rate from AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/RestingHeartRateRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "SexualActivityRecord",
    "slug": "sexual-activity-record",
    "qualifiedName": "androidx.health.connect.client.records.SexualActivityRecord",
    "dataTypeLabel": "Sexual activity",
    "category": "Cycle Tracking",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "metadata",
      "protectionUsed",
      "time"
    ],
    "description": [
      "Captures an occurrence of sexual activity. Each record is a single occurrence. ProtectionUsed field is optional."
    ],
    "googleExample": null,
    "signature": "class SexualActivityRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_SEXUAL_ACTIVITY"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_SEXUAL_ACTIVITY"
    ],
    "permissionEvidence": "Google's data-types table, row \"Sexual activity\" (SexualActivityRecord): android.permission.health.READ_SEXUAL_ACTIVITY, android.permission.health.WRITE_SEXUAL_ACTIVITY",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_SEXUAL_ACTIVITY",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_SEXUAL_ACTIVITY",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "protectionUsed",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "Whether protection was used during sexual activity. Optional field, null if unknown. Allowed values: Protection.",
        "inConstructor": true,
        "constructorDefault": "PROTECTION_USED_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "SexualActivityRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    protectionUsed: Int = PROTECTION_USED_UNKNOWN\n)"
    ],
    "aggregateMetrics": [],
    "constants": [
      {
        "name": "PROTECTION_USED_PROTECTED",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "PROTECTION_USED_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": null
      },
      {
        "name": "PROTECTION_USED_UNPROTECTED",
        "value": "2",
        "type": "Int",
        "description": null
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/SexualActivityRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "SkinTemperatureRecord",
    "slug": "skin-temperature-record",
    "qualifiedName": "androidx.health.connect.client.records.SkinTemperatureRecord",
    "dataTypeLabel": "Skin temperature",
    "category": "Vitals",
    "recordShape": "Series",
    "unitClass": "Temperature",
    "mandatoryFields": [
      "deltas",
      "endTime",
      "measurementLocation",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the skin temperature of a user. Each record can represent a series of measurements of temperature differences.",
      "The ability to insert or read this record type is dependent on the version of HealthConnect installed on the device. To check if available: call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_SKIN_TEMPERATURE as an argument. See further down for an example on how to read skin temperature."
    ],
    "googleExample": "import androidx.health.connect.client.HealthConnectFeatures\nimport androidx.health.connect.client.permission.HealthPermission\nimport androidx.health.connect.client.readRecord\nimport androidx.health.connect.client.records.SkinTemperatureRecord\nimport androidx.health.connect.client.request.ReadRecordsRequest\nimport androidx.health.connect.client.time.TimeRangeFilter\n\nif (\n    healthConnectClient.features.getFeatureStatus(\n        HealthConnectFeatures.FEATURE_SKIN_TEMPERATURE\n    ) == HealthConnectFeatures.FEATURE_STATUS_AVAILABLE\n) {\n    if (\n        healthConnectClient.permissionController\n            .getGrantedPermissions()\n            .contains(HealthPermission.getReadPermission(SkinTemperatureRecord::class))\n    ) {\n        val response =\n            healthConnectClient.readRecords(\n                ReadRecordsRequest<SkinTemperatureRecord>(\n                    timeRangeFilter = TimeRangeFilter.between(startTime, endTime)\n                )\n            )\n        for (skinTemperatureRecord in response.records) {\n            // Process each skin temperature record\n        }\n    } else {\n        // Permission hasn't been granted. Request permission to read skin temperature.\n    }\n} else {\n    // Feature is not available. It is not possible to read skin temperature.\n}",
    "signature": "class SkinTemperatureRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": "FEATURE_SKIN_TEMPERATURE",
    "readPermissions": [
      "android.permission.health.READ_SKIN_TEMPERATURE"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_SKIN_TEMPERATURE"
    ],
    "permissionEvidence": "Google's data-types table, row \"Skin temperature\" (SkinTemperatureRecord): android.permission.health.READ_SKIN_TEMPERATURE, android.permission.health.WRITE_SKIN_TEMPERATURE",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_SKIN_TEMPERATURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 35 Also in U Extensions 13",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_SKIN_TEMPERATURE",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 35 Also in U Extensions 13",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "baseline",
        "type": "Temperature?",
        "range": null,
        "rangeStatement": "Valid range: 0-100 Celsius degrees.",
        "description": "Temperature in Temperature unit. Optional field, null by default. Valid range: 0-100 Celsius degrees.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "deltas",
        "type": "List<SkinTemperatureRecord.Delta>",
        "range": null,
        "rangeStatement": null,
        "description": "a list of skin temperature Delta. If baseline is set, these values are expected to be relative to it. Otherwise, they are deltas against an unspecified starting baseline.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "measurementLocation",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "indicates the location on the body from which the temperature reading was taken. Optional field, MEASUREMENT_LOCATION_UNKNOWN by default. Allowed values: SkinTemperatureMeasurementLocation.",
        "inConstructor": true,
        "constructorDefault": "MEASUREMENT_LOCATION_UNKNOWN",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "SkinTemperatureRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    deltas: List<SkinTemperatureRecord.Delta>,\n    baseline: Temperature? = null,\n    measurementLocation: Int = MEASUREMENT_LOCATION_UNKNOWN\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "TEMPERATURE_DELTA_AVG",
        "valueType": "TemperatureDelta",
        "valueTypeQualified": "androidx.health.connect.client.units.TemperatureDelta",
        "description": "Metric identifier for retrieving the average skin temperature delta from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use HealthConnectFeatures.getFeatureStatus with HealthConnectFeatures.FEATURE_SKIN_TEMPERATURE as the argument."
      },
      {
        "name": "TEMPERATURE_DELTA_MAX",
        "valueType": "TemperatureDelta",
        "valueTypeQualified": "androidx.health.connect.client.units.TemperatureDelta",
        "description": "Metric identifier for retrieving the maximum skin temperature delta from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use HealthConnectFeatures.getFeatureStatus with HealthConnectFeatures.FEATURE_SKIN_TEMPERATURE as the argument."
      },
      {
        "name": "TEMPERATURE_DELTA_MIN",
        "valueType": "TemperatureDelta",
        "valueTypeQualified": "androidx.health.connect.client.units.TemperatureDelta",
        "description": "Metric identifier for retrieving the minimum skin temperature delta from androidx.health.connect.client.aggregate.AggregationResult. To check if this metric is available, use HealthConnectFeatures.getFeatureStatus with HealthConnectFeatures.FEATURE_SKIN_TEMPERATURE as the argument."
      }
    ],
    "constants": [
      {
        "name": "MEASUREMENT_LOCATION_FINGER",
        "value": "1",
        "type": "Int",
        "description": "Skin temperature measurement was taken from finger."
      },
      {
        "name": "MEASUREMENT_LOCATION_TOE",
        "value": "2",
        "type": "Int",
        "description": "Skin temperature measurement was taken from toe."
      },
      {
        "name": "MEASUREMENT_LOCATION_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": "Use this if the location is unknown."
      },
      {
        "name": "MEASUREMENT_LOCATION_WRIST",
        "value": "3",
        "type": "Int",
        "description": "Skin temperature measurement was taken from wrist."
      }
    ],
    "nestedTypes": [
      {
        "name": "SkinTemperatureRecord.Delta",
        "kind": "class",
        "description": "Represents a skin temperature delta entry of SkinTemperatureRecord."
      }
    ],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Vitals guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/vitals"
      },
      {
        "title": "Measure skin temperature guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/skin-temperature"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/SkinTemperatureRecord",
    "sourceUpdated": "2026-08-06"
  },
  {
    "className": "SleepSessionRecord",
    "slug": "sleep-session-record",
    "qualifiedName": "androidx.health.connect.client.records.SleepSessionRecord",
    "dataTypeLabel": "Sleep session",
    "category": "Sleep",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "endTime",
      "metadata",
      "stages",
      "startTime"
    ],
    "description": [
      "Captures the user's sleep length and its stages. Each record represents a time interval for a full sleep session.",
      "All sleep stage time intervals should fall within the sleep session interval. Time intervals for stages don't need to be continuous but shouldn't overlap.",
      "Example code demonstrate how to read sleep session:"
    ],
    "googleExample": "import androidx.health.connect.client.readRecord\nimport androidx.health.connect.client.records.SleepSessionRecord\nimport androidx.health.connect.client.request.ReadRecordsRequest\nimport androidx.health.connect.client.time.TimeRangeFilter\n\nval response =\n    healthConnectClient.readRecords(\n        ReadRecordsRequest<SleepSessionRecord>(\n            timeRangeFilter = TimeRangeFilter.between(startTime, endTime)\n        )\n    )\nfor (sleepRecord in response.records) {\n    // Process each sleep record\n}",
    "signature": "class SleepSessionRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_SLEEP"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_SLEEP"
    ],
    "permissionEvidence": "Google's data-types table, row \"Sleep session\" (SleepSessionRecord): android.permission.health.READ_SLEEP, android.permission.health.WRITE_SLEEP",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_SLEEP",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_SLEEP",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "notes",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Additional notes for the session. Optional field.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "stages",
        "type": "List<SleepSessionRecord.Stage>",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": "emptyList()",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "title",
        "type": "String?",
        "range": null,
        "rangeStatement": null,
        "description": "Title of the session. Optional field.",
        "inConstructor": true,
        "constructorDefault": "null",
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "SleepSessionRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    title: String? = null,\n    notes: String? = null,\n    stages: List<SleepSessionRecord.Stage> = emptyList()\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "SLEEP_DURATION_TOTAL",
        "valueType": "Duration",
        "valueTypeQualified": "java.time.Duration",
        "description": "Metric identifier to retrieve the total sleep session duration from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [
      {
        "name": "STAGE_TYPE_AWAKE",
        "value": "1",
        "type": "Int",
        "description": "The user is awake and either known to be in bed, or it is unknown whether they are in bed or not."
      },
      {
        "name": "STAGE_TYPE_AWAKE_IN_BED",
        "value": "7",
        "type": "Int",
        "description": "The user is awake and in bed."
      },
      {
        "name": "STAGE_TYPE_DEEP",
        "value": "5",
        "type": "Int",
        "description": "The user is in a deep sleep stage."
      },
      {
        "name": "STAGE_TYPE_LIGHT",
        "value": "4",
        "type": "Int",
        "description": "The user is in a light sleep stage."
      },
      {
        "name": "STAGE_TYPE_OUT_OF_BED",
        "value": "3",
        "type": "Int",
        "description": "The user is out of bed and assumed to be awake."
      },
      {
        "name": "STAGE_TYPE_REM",
        "value": "6",
        "type": "Int",
        "description": "The user is in a REM sleep stage."
      },
      {
        "name": "STAGE_TYPE_SLEEPING",
        "value": "2",
        "type": "Int",
        "description": "The user is asleep but the particular stage of sleep (light, deep or REM) is unknown."
      },
      {
        "name": "STAGE_TYPE_UNKNOWN",
        "value": "0",
        "type": "Int",
        "description": "Use this type if the stage of sleep is unknown."
      }
    ],
    "nestedTypes": [
      {
        "name": "SleepSessionRecord.Stage",
        "kind": "class",
        "description": "Captures the sleep stage the user entered during a sleep session."
      }
    ],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Sleep guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/sleep"
      },
      {
        "title": "Track sleep sessions guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/sleep-sessions"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/SleepSessionRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "SpeedRecord",
    "slug": "speed-record",
    "qualifiedName": "androidx.health.connect.client.records.SpeedRecord",
    "dataTypeLabel": "Speed",
    "category": "Activity",
    "recordShape": "Series",
    "unitClass": null,
    "mandatoryFields": [
      "endTime",
      "metadata",
      "samples",
      "startTime"
    ],
    "description": [
      "Captures the user's speed, e.g. during running or cycling. Each record represents a series of measurements."
    ],
    "googleExample": null,
    "signature": "class SpeedRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_SPEED"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_SPEED"
    ],
    "permissionEvidence": "Google's data-types table, row \"Speed\" (SpeedRecord): android.permission.health.READ_SPEED, android.permission.health.WRITE_SPEED",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_SPEED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_SPEED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "samples",
        "type": "List<SpeedRecord.Sample>",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "SpeedRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    samples: List<SpeedRecord.Sample>,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "SPEED_AVG",
        "valueType": "Velocity",
        "valueTypeQualified": "androidx.health.connect.client.units.Velocity",
        "description": "Metric identifier to retrieve average speed from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SPEED_MAX",
        "valueType": "Velocity",
        "valueTypeQualified": "androidx.health.connect.client.units.Velocity",
        "description": "Metric identifier to retrieve maximum speed from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "SPEED_MIN",
        "valueType": "Velocity",
        "valueTypeQualified": "androidx.health.connect.client.units.Velocity",
        "description": "Metric identifier to retrieve minimum speed from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [
      {
        "name": "SpeedRecord.Sample",
        "kind": "class",
        "description": "Represents a single measurement of the speed, a scalar magnitude."
      }
    ],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/SpeedRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "StepsRecord",
    "slug": "steps-record",
    "qualifiedName": "androidx.health.connect.client.records.StepsRecord",
    "dataTypeLabel": "Steps",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "count",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the number of steps taken since the last reading. Each step is only reported once so records shouldn't have overlapping time. The start time of each record should represent the start of the interval in which steps were taken.",
      "The start time must be equal to or greater than the end time of the previous record. Adding all of the values together for a period of time calculates the total number of steps during that period."
    ],
    "googleExample": null,
    "signature": "class StepsRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_STEPS"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_STEPS"
    ],
    "permissionEvidence": "Google's data-types table, row \"Steps\" (StepsRecord, StepsCadenceRecord): android.permission.health.READ_STEPS, android.permission.health.WRITE_STEPS",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_STEPS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_STEPS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [
      "StepsCadenceRecord"
    ],
    "properties": [
      {
        "name": "count",
        "type": "Long",
        "range": {
          "annotation": "@IntRange(from = 1, to = 1000000)",
          "from": "1",
          "to": "1000000"
        },
        "rangeStatement": "Valid range: 1-1000000.",
        "description": "Count. Required field. Valid range: 1-1000000.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "StepsRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    count: @IntRange(from = 1, to = 1000000) Long,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "COUNT_TOTAL",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the total steps count from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      },
      {
        "title": "Native tracking guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/native-tracking"
      },
      {
        "title": "Track steps guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/steps"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/StepsRecord",
    "sourceUpdated": "2026-08-06"
  },
  {
    "className": "StepsCadenceRecord",
    "slug": "steps-cadence-record",
    "qualifiedName": "androidx.health.connect.client.records.StepsCadenceRecord",
    "dataTypeLabel": "Steps",
    "category": "Activity",
    "recordShape": "Series",
    "unitClass": null,
    "mandatoryFields": [
      "endTime",
      "samples",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the user's steps cadence. Each record represents a series of measurements."
    ],
    "googleExample": null,
    "signature": "class StepsCadenceRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_STEPS"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_STEPS"
    ],
    "permissionEvidence": "Google's data-types table, row \"Steps\" (StepsRecord, StepsCadenceRecord): android.permission.health.READ_STEPS, android.permission.health.WRITE_STEPS",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_STEPS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_STEPS",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [
      "StepsRecord"
    ],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "samples",
        "type": "List<StepsCadenceRecord.Sample>",
        "range": null,
        "rangeStatement": null,
        "description": null,
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "StepsCadenceRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    samples: List<StepsCadenceRecord.Sample>,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "RATE_AVG",
        "valueType": "Double",
        "valueTypeQualified": "kotlin.Double",
        "description": "Metric identifier to retrieve average steps cadence from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "RATE_MAX",
        "valueType": "Double",
        "valueTypeQualified": "kotlin.Double",
        "description": "Metric identifier to retrieve maximum steps cadence from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "RATE_MIN",
        "valueType": "Double",
        "valueTypeQualified": "kotlin.Double",
        "description": "Metric identifier to retrieve minimum steps cadence from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [
      {
        "name": "StepsCadenceRecord.Sample",
        "kind": "class",
        "description": "Represents a single measurement of the steps cadence."
      }
    ],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      },
      {
        "title": "Native tracking guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/native-tracking"
      },
      {
        "title": "Track steps guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/steps"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/StepsCadenceRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "TotalCaloriesBurnedRecord",
    "slug": "total-calories-burned-record",
    "qualifiedName": "androidx.health.connect.client.records.TotalCaloriesBurnedRecord",
    "dataTypeLabel": "Total calories burned",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": "Energy",
    "mandatoryFields": [
      "endTime",
      "energy",
      "metadata",
      "startTime"
    ],
    "description": [
      "Total energy burned by the user (in kilocalories), including active & basal energy burned (BMR). Each record represents the total kilocalories burned over a time interval."
    ],
    "googleExample": null,
    "signature": "class TotalCaloriesBurnedRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_TOTAL_CALORIES_BURNED"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_TOTAL_CALORIES_BURNED"
    ],
    "permissionEvidence": "Google's data-types table, row \"Total calories burned\" (TotalCaloriesBurnedRecord): android.permission.health.READ_TOTAL_CALORIES_BURNED, android.permission.health.WRITE_TOTAL_CALORIES_BURNED",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_TOTAL_CALORIES_BURNED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_TOTAL_CALORIES_BURNED",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "energy",
        "type": "Energy",
        "range": null,
        "rangeStatement": "Valid range: 0-1000000 kcal.",
        "description": "Energy in Energy unit. Required field. Valid range: 0-1000000 kcal.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "TotalCaloriesBurnedRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    energy: Energy,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "ENERGY_TOTAL",
        "valueType": "Energy",
        "valueTypeQualified": "androidx.health.connect.client.units.Energy",
        "description": "Metric identifier to retrieve total energy from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/TotalCaloriesBurnedRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "Vo2MaxRecord",
    "slug": "vo2-max-record",
    "qualifiedName": "androidx.health.connect.client.records.Vo2MaxRecord",
    "dataTypeLabel": "VO2 max",
    "category": "Activity",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "measurementMethod",
      "metadata",
      "time",
      "vo2MillilitersPerMinuteKilogram"
    ],
    "description": [
      "Capture user's VO2 max score and optionally the measurement method."
    ],
    "googleExample": null,
    "signature": "class Vo2MaxRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_VO2_MAX"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_VO2_MAX"
    ],
    "permissionEvidence": "Google's data-types table, row \"VO2 max\" (Vo2MaxRecord): android.permission.health.READ_VO2_MAX, android.permission.health.WRITE_VO2_MAX",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_VO2_MAX",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_VO2_MAX",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "measurementMethod",
        "type": "Int",
        "range": null,
        "rangeStatement": null,
        "description": "VO2 max measurement method. Optional field. Allowed values: MeasurementMethod.",
        "inConstructor": true,
        "constructorDefault": "MEASUREMENT_METHOD_OTHER",
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "vo2MillilitersPerMinuteKilogram",
        "type": "Double",
        "range": null,
        "rangeStatement": "Valid range: 0-100.",
        "description": "Maximal aerobic capacity (VO2 max) in milliliters. Required field. Valid range: 0-100.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "Vo2MaxRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    metadata: Metadata,\n    vo2MillilitersPerMinuteKilogram: Double,\n    measurementMethod: Int = MEASUREMENT_METHOD_OTHER\n)"
    ],
    "aggregateMetrics": [],
    "constants": [
      {
        "name": "MEASUREMENT_METHOD_COOPER_TEST",
        "value": "3",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_METHOD_HEART_RATE_RATIO",
        "value": "2",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_METHOD_METABOLIC_CART",
        "value": "1",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_METHOD_MULTISTAGE_FITNESS_TEST",
        "value": "4",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_METHOD_OTHER",
        "value": "0",
        "type": "Int",
        "description": null
      },
      {
        "name": "MEASUREMENT_METHOD_ROCKPORT_FITNESS_TEST",
        "value": "5",
        "type": "Int",
        "description": null
      }
    ],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/Vo2MaxRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "WeightRecord",
    "slug": "weight-record",
    "qualifiedName": "androidx.health.connect.client.records.WeightRecord",
    "dataTypeLabel": "Weight",
    "category": "Body Measurement",
    "recordShape": "Instantaneous",
    "unitClass": null,
    "mandatoryFields": [
      "metadata",
      "time",
      "weight"
    ],
    "description": [
      "Captures the user's weight.",
      "See Mass for supported units."
    ],
    "googleExample": null,
    "signature": "class WeightRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_WEIGHT"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_WEIGHT"
    ],
    "permissionEvidence": "Google's data-types table, row \"Weight\" (WeightRecord): android.permission.health.READ_WEIGHT, android.permission.health.WRITE_WEIGHT",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_WEIGHT",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_WEIGHT",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "time",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Time the record happened.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "weight",
        "type": "Mass",
        "range": null,
        "rangeStatement": "Valid range: 0-1000 kilograms.",
        "description": "User's weight in kilograms. Required field. Valid range: 0-1000 kilograms.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "zoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at time, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "WeightRecord(\n    time: Instant,\n    zoneOffset: ZoneOffset?,\n    weight: Mass,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "WEIGHT_AVG",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the average weight from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "WEIGHT_MAX",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the maximum weight from androidx.health.connect.client.aggregate.AggregationResult."
      },
      {
        "name": "WEIGHT_MIN",
        "valueType": "Mass",
        "valueTypeQualified": "androidx.health.connect.client.units.Mass",
        "description": "Metric identifier to retrieve the minimum weight from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/WeightRecord",
    "sourceUpdated": "2026-06-24"
  },
  {
    "className": "WheelchairPushesRecord",
    "slug": "wheelchair-pushes-record",
    "qualifiedName": "androidx.health.connect.client.records.WheelchairPushesRecord",
    "dataTypeLabel": "Wheelchair pushes",
    "category": "Activity",
    "recordShape": "Interval",
    "unitClass": null,
    "mandatoryFields": [
      "count",
      "endTime",
      "metadata",
      "startTime"
    ],
    "description": [
      "Captures the number of wheelchair pushes done since the last reading. Each push is only reported once so records shouldn't have overlapping time. The start time of each record should represent the start of the interval in which pushes were made."
    ],
    "googleExample": null,
    "signature": "class WheelchairPushesRecord : Record",
    "addedIn": "1.1.0",
    "addedInEvidence": "Jetpack reference header: \"Added in 1.1.0\"",
    "deprecated": false,
    "experimentalAnnotations": [],
    "featureFlag": null,
    "readPermissions": [
      "android.permission.health.READ_WHEELCHAIR_PUSHES"
    ],
    "writePermissions": [
      "android.permission.health.WRITE_WHEELCHAIR_PUSHES"
    ],
    "permissionEvidence": "Google's data-types table, row \"Wheelchair pushes\" (WheelchairPushesRecord): android.permission.health.READ_WHEELCHAIR_PUSHES, android.permission.health.WRITE_WHEELCHAIR_PUSHES",
    "permissionCheck": [
      {
        "permission": "android.permission.health.READ_WHEELCHAIR_PUSHES",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      },
      {
        "permission": "android.permission.health.WRITE_WHEELCHAIR_PUSHES",
        "inFrameworkReference": true,
        "frameworkAdded": "Added in API level 34 Also in U Extensions 7",
        "inJetpackConstants": false
      }
    ],
    "sharedRowWith": [],
    "properties": [
      {
        "name": "count",
        "type": "Long",
        "range": null,
        "rangeStatement": "Valid range: 1-1000000.",
        "description": "Count. Required field. Valid range: 1-1000000.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "End time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "endZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at endTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "metadata",
        "type": "Metadata",
        "range": null,
        "rangeStatement": null,
        "description": "Set of common metadata associated with the written record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": null,
        "deprecated": false
      },
      {
        "name": "startTime",
        "type": "Instant",
        "range": null,
        "rangeStatement": null,
        "description": "Start time of the record.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      },
      {
        "name": "startZoneOffset",
        "type": "ZoneOffset?",
        "range": null,
        "rangeStatement": null,
        "description": "User experienced zone offset at startTime, or null if unknown. Providing these will help history aggregations results stay consistent should user travel. Queries with user experienced time filters will assume system current zone offset if the information is absent.",
        "inConstructor": true,
        "constructorDefault": null,
        "addedIn": "1.1.0",
        "deprecated": false
      }
    ],
    "constructors": [
      "WheelchairPushesRecord(\n    startTime: Instant,\n    startZoneOffset: ZoneOffset?,\n    endTime: Instant,\n    endZoneOffset: ZoneOffset?,\n    count: Long,\n    metadata: Metadata\n)"
    ],
    "aggregateMetrics": [
      {
        "name": "COUNT_TOTAL",
        "valueType": "Long",
        "valueTypeQualified": "kotlin.Long",
        "description": "Metric identifier to retrieve the total wheelchair push count from androidx.health.connect.client.aggregate.AggregationResult."
      }
    ],
    "constants": [],
    "nestedTypes": [],
    "otherCompanionProperties": [],
    "guides": [
      {
        "title": "Workouts guide",
        "url": "https://developer.android.com/health-and-fitness/health-connect/experiences/workouts"
      }
    ],
    "sourceUrl": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/WheelchairPushesRecord",
    "sourceUpdated": "2026-06-24"
  }
];

/** Every constant on the framework HealthPermissions reference. */
export const HC_FRAMEWORK_PERMISSIONS: HcFrameworkPermission[] = [
  {
    "constant": "READ_ACTIVE_CALORIES_BURNED",
    "value": "android.permission.health.READ_ACTIVE_CALORIES_BURNED",
    "description": "Allows an application to read the user's active calories burned data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_ACTIVITY_INTENSITY",
    "value": "android.permission.health.READ_ACTIVITY_INTENSITY",
    "description": "Allows an application to read the user's activity intensity data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_ALCOHOL_CONSUMPTION",
    "value": "android.permission.health.READ_ALCOHOL_CONSUMPTION",
    "description": "Allows an application to write user's alcohol consumption data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_BASAL_BODY_TEMPERATURE",
    "value": "android.permission.health.READ_BASAL_BODY_TEMPERATURE",
    "description": "Allows an application to read the user's body temperature data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_BASAL_METABOLIC_RATE",
    "value": "android.permission.health.READ_BASAL_METABOLIC_RATE",
    "description": "Allows an application to read the user's basal metabolic rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_BLOOD_GLUCOSE",
    "value": "android.permission.health.READ_BLOOD_GLUCOSE",
    "description": "Allows an application to read the user's blood glucose data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_BLOOD_PRESSURE",
    "value": "android.permission.health.READ_BLOOD_PRESSURE",
    "description": "Allows an application to read the user's blood pressure data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_BODY_FAT",
    "value": "android.permission.health.READ_BODY_FAT",
    "description": "Allows an application to read the user's body fat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_BODY_TEMPERATURE",
    "value": "android.permission.health.READ_BODY_TEMPERATURE",
    "description": "Allows an application to read the user's body temperature data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_BODY_WATER_MASS",
    "value": "android.permission.health.READ_BODY_WATER_MASS",
    "description": "Allows an application to read the user's body water mass data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_BONE_MASS",
    "value": "android.permission.health.READ_BONE_MASS",
    "description": "Allows an application to read the user's bone mass data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_CERVICAL_MUCUS",
    "value": "android.permission.health.READ_CERVICAL_MUCUS",
    "description": "Allows an application to read the user's cervical mucus data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_DISTANCE",
    "value": "android.permission.health.READ_DISTANCE",
    "description": "Allows an application to read the user's distance data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_ELEVATION_GAINED",
    "value": "android.permission.health.READ_ELEVATION_GAINED",
    "description": "Allows an application to read the user's elevation gained data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_EXERCISE",
    "value": "android.permission.health.READ_EXERCISE",
    "description": "Allows an application to read the user's exercise data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_EXERCISE_ROUTES",
    "value": "android.permission.health.READ_EXERCISE_ROUTES",
    "description": "Allows an application to read ExerciseRoute. This permission can only be granted manually by a user in Health Connect settings or in the route request activity which can be launched using ERROR(/ACTION_REQUEST_EXERCISE_ROUTE). Attempts to request the permission by applications will be ignored. Applications should check if the permission has been granted before reading ExerciseRoute.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 35 Also in U Extensions 12"
  },
  {
    "constant": "READ_FLOORS_CLIMBED",
    "value": "android.permission.health.READ_FLOORS_CLIMBED",
    "description": "Allows an application to read the user's floors climbed data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_HEALTH_DATA_HISTORY",
    "value": "android.permission.health.READ_HEALTH_DATA_HISTORY",
    "description": "Allows an application to read the entire history of health data (of any type).",
    "protectionLevel": "dangerous",
    "added": "Added in API level 35 Also in U Extensions 13"
  },
  {
    "constant": "READ_HEALTH_DATA_IN_BACKGROUND",
    "value": "android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND",
    "description": "Allows an application to read health data (of any type) in background.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 35 Also in U Extensions 13"
  },
  {
    "constant": "READ_HEART_RATE",
    "value": "android.permission.health.READ_HEART_RATE",
    "description": "Allows an application to read the user's heart rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_HEART_RATE_VARIABILITY",
    "value": "android.permission.health.READ_HEART_RATE_VARIABILITY",
    "description": "Allows an application to read the user's heart rate variability data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_HEIGHT",
    "value": "android.permission.health.READ_HEIGHT",
    "description": "Allows an application to read the user's height data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_HYDRATION",
    "value": "android.permission.health.READ_HYDRATION",
    "description": "Allows an application to read the user's hydration data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_INTERMENSTRUAL_BLEEDING",
    "value": "android.permission.health.READ_INTERMENSTRUAL_BLEEDING",
    "description": "Allows an application to read the user's intermenstrual bleeding data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_LEAN_BODY_MASS",
    "value": "android.permission.health.READ_LEAN_BODY_MASS",
    "description": "Allows an application to read the user's lean body mass data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_MEDICAL_DATA_ALLERGIES_INTOLERANCES",
    "value": "android.permission.health.READ_MEDICAL_DATA_ALLERGIES_INTOLERANCES",
    "description": "Allows an application to read the user's data about allergies and intolerances.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_CONDITIONS",
    "value": "android.permission.health.READ_MEDICAL_DATA_CONDITIONS",
    "description": "Allows an application to read the user's data about medical conditions.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_LABORATORY_RESULTS",
    "value": "android.permission.health.READ_MEDICAL_DATA_LABORATORY_RESULTS",
    "description": "Allows an application to read the user's laboratory result data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_MEDICATIONS",
    "value": "android.permission.health.READ_MEDICAL_DATA_MEDICATIONS",
    "description": "Allows an application to read the user's medication data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_PERSONAL_DETAILS",
    "value": "android.permission.health.READ_MEDICAL_DATA_PERSONAL_DETAILS",
    "description": "Allows an application to read the user's personal details. This is demographic information such as name, date of birth, contact details like address or telephone number and so on. For more examples see the FHIR Patient resource.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_PRACTITIONER_DETAILS",
    "value": "android.permission.health.READ_MEDICAL_DATA_PRACTITIONER_DETAILS",
    "description": "Allows an application to read the user's data about the practitioners who have interacted with them in their medical record. This is the information about the clinicians (doctors, nurses, etc) but also other practitioners (masseurs, physiotherapists, etc) who have been involved with the patient.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_PREGNANCY",
    "value": "android.permission.health.READ_MEDICAL_DATA_PREGNANCY",
    "description": "Allows an application to read the user's pregnancy data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_PROCEDURES",
    "value": "android.permission.health.READ_MEDICAL_DATA_PROCEDURES",
    "description": "Allows an application to read the user's data about medical procedures.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_SOCIAL_HISTORY",
    "value": "android.permission.health.READ_MEDICAL_DATA_SOCIAL_HISTORY",
    "description": "Allows an application to read the user's social history data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_VACCINES",
    "value": "android.permission.health.READ_MEDICAL_DATA_VACCINES",
    "description": "Allows an application to read the user's data about immunizations and vaccinations.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_VISITS",
    "value": "android.permission.health.READ_MEDICAL_DATA_VISITS",
    "description": "Allows an application to read the user's information about their encounters with health care practitioners, including things like location, time of appointment, and name of organization the visit was with. Despite the name visit it covers remote encounters such as telephone or videoconference appointments.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MEDICAL_DATA_VITAL_SIGNS",
    "value": "android.permission.health.READ_MEDICAL_DATA_VITAL_SIGNS",
    "description": "Allows an application to read the user's vital signs data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "READ_MENSTRUAL_CYCLE_PHASE",
    "value": "android.permission.health.READ_MENSTRUAL_CYCLE_PHASE",
    "description": "Allows an application to read the user's cycle phases data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 22"
  },
  {
    "constant": "READ_MENSTRUATION",
    "value": "android.permission.health.READ_MENSTRUATION",
    "description": "Allows an application to read the user's menstruation data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_MINDFULNESS",
    "value": "android.permission.health.READ_MINDFULNESS",
    "description": "Allows an application to read user's mindfulness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 15"
  },
  {
    "constant": "READ_NUTRITION",
    "value": "android.permission.health.READ_NUTRITION",
    "description": "Allows an application to read the user's nutrition data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_OVULATION_TEST",
    "value": "android.permission.health.READ_OVULATION_TEST",
    "description": "Allows an application to read the user's ovulation test data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_OXYGEN_SATURATION",
    "value": "android.permission.health.READ_OXYGEN_SATURATION",
    "description": "Allows an application to read the user's oxygen saturation data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_PLANNED_EXERCISE",
    "value": "android.permission.health.READ_PLANNED_EXERCISE",
    "description": "Allows an application to read the user's training plan data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 35 Also in U Extensions 13"
  },
  {
    "constant": "READ_POWER",
    "value": "android.permission.health.READ_POWER",
    "description": "Allows an application to read the user's power data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_RESPIRATORY_RATE",
    "value": "android.permission.health.READ_RESPIRATORY_RATE",
    "description": "Allows an application to read the user's respiratory rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_RESTING_HEART_RATE",
    "value": "android.permission.health.READ_RESTING_HEART_RATE",
    "description": "Allows an application to read the user's resting heart rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_SEXUAL_ACTIVITY",
    "value": "android.permission.health.READ_SEXUAL_ACTIVITY",
    "description": "Allows an application to read the user's sexual activity data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_SKIN_TEMPERATURE",
    "value": "android.permission.health.READ_SKIN_TEMPERATURE",
    "description": "Allows an application to read the user's skin temperature data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 35 Also in U Extensions 13"
  },
  {
    "constant": "READ_SLEEP",
    "value": "android.permission.health.READ_SLEEP",
    "description": "Allows an application to read the user's sleep data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_SPEED",
    "value": "android.permission.health.READ_SPEED",
    "description": "Allows an application to read the user's speed data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_STEPS",
    "value": "android.permission.health.READ_STEPS",
    "description": "Allows an application to read the user's steps data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_SYMPTOM_ABDOMINAL_PAIN",
    "value": "android.permission.health.READ_SYMPTOM_ABDOMINAL_PAIN",
    "description": "Allows an application to read the user's abdominal pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_ACNE",
    "value": "android.permission.health.READ_SYMPTOM_ACNE",
    "description": "Allows an application to read the user's acne data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_BACK_PAIN",
    "value": "android.permission.health.READ_SYMPTOM_BACK_PAIN",
    "description": "Allows an application to read the user's back pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_BLOATING",
    "value": "android.permission.health.READ_SYMPTOM_BLOATING",
    "description": "Allows an application to read the user's bloating data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_BRAIN_FOG",
    "value": "android.permission.health.READ_SYMPTOM_BRAIN_FOG",
    "description": "Allows an application to read the user's brain fog data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_BREAST_TENDERNESS",
    "value": "android.permission.health.READ_SYMPTOM_BREAST_TENDERNESS",
    "description": "Allows an application to read the user's breast tenderness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_BRITTLE_NAILS",
    "value": "android.permission.health.READ_SYMPTOM_BRITTLE_NAILS",
    "description": "Allows an application to read the user's brittle nails data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_BURNING_MOUTH",
    "value": "android.permission.health.READ_SYMPTOM_BURNING_MOUTH",
    "description": "Allows an application to read the user's burning mouth data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_CHEST_PAIN",
    "value": "android.permission.health.READ_SYMPTOM_CHEST_PAIN",
    "description": "Allows an application to read the user's chest pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_CHEST_TIGHTNESS",
    "value": "android.permission.health.READ_SYMPTOM_CHEST_TIGHTNESS",
    "description": "Allows an application to read the user's chest tightness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_CHILLS",
    "value": "android.permission.health.READ_SYMPTOM_CHILLS",
    "description": "Allows an application to read the user's chills data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_CONSTIPATION",
    "value": "android.permission.health.READ_SYMPTOM_CONSTIPATION",
    "description": "Allows an application to read the user's constipation data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_COUGH",
    "value": "android.permission.health.READ_SYMPTOM_COUGH",
    "description": "Allows an application to read the user's cough symptom data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_CRAMPS",
    "value": "android.permission.health.READ_SYMPTOM_CRAMPS",
    "description": "Allows an application to read the user's cramps data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_CRAVINGS",
    "value": "android.permission.health.READ_SYMPTOM_CRAVINGS",
    "description": "Allows an application to read the user's cravings data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_DEHYDRATION",
    "value": "android.permission.health.READ_SYMPTOM_DEHYDRATION",
    "description": "Allows an application to read the user's dehydration data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_DIARRHEA",
    "value": "android.permission.health.READ_SYMPTOM_DIARRHEA",
    "description": "Allows an application to read the user's diarrhea data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_DIFFICULTY_SWALLOWING",
    "value": "android.permission.health.READ_SYMPTOM_DIFFICULTY_SWALLOWING",
    "description": "Allows an application to read the user's difficulty swallowing data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_DIZZINESS",
    "value": "android.permission.health.READ_SYMPTOM_DIZZINESS",
    "description": "Allows an application to read the user's dizziness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_DRY_SKIN",
    "value": "android.permission.health.READ_SYMPTOM_DRY_SKIN",
    "description": "Allows an application to read the user's dry skin data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_EARACHES",
    "value": "android.permission.health.READ_SYMPTOM_EARACHES",
    "description": "Allows an application to read the user's earaches data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_FATIGUE",
    "value": "android.permission.health.READ_SYMPTOM_FATIGUE",
    "description": "Allows an application to read the user's fatigue data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_FEVER",
    "value": "android.permission.health.READ_SYMPTOM_FEVER",
    "description": "Allows an application to read the user's fever data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_GENERALIZED_BODY_ACHE",
    "value": "android.permission.health.READ_SYMPTOM_GENERALIZED_BODY_ACHE",
    "description": "Allows an application to read the user's generalized body ache data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_HAIR_LOSS",
    "value": "android.permission.health.READ_SYMPTOM_HAIR_LOSS",
    "description": "Allows an application to read the user's hair loss data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_HEADACHE",
    "value": "android.permission.health.READ_SYMPTOM_HEADACHE",
    "description": "Allows an application to read the user's headache data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_HEARTBURN",
    "value": "android.permission.health.READ_SYMPTOM_HEARTBURN",
    "description": "Allows an application to read the user's heartburn data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_HEART_PALPITATIONS",
    "value": "android.permission.health.READ_SYMPTOM_HEART_PALPITATIONS",
    "description": "Allows an application to read the user's heart palpitations data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_HOT_FLASHES",
    "value": "android.permission.health.READ_SYMPTOM_HOT_FLASHES",
    "description": "Allows an application to read the user's hot flashes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_INSOMNIA",
    "value": "android.permission.health.READ_SYMPTOM_INSOMNIA",
    "description": "Allows an application to read the user's insomnia data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_JOINT_PAIN",
    "value": "android.permission.health.READ_SYMPTOM_JOINT_PAIN",
    "description": "Allows an application to read the user's joint pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_JOINT_STIFFNESS",
    "value": "android.permission.health.READ_SYMPTOM_JOINT_STIFFNESS",
    "description": "Allows an application to read the user's joint stiffness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_LOSS_OF_APPETITE",
    "value": "android.permission.health.READ_SYMPTOM_LOSS_OF_APPETITE",
    "description": "Allows an application to read the user's loss of appetite data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_LOSS_OF_CONSCIOUSNESS",
    "value": "android.permission.health.READ_SYMPTOM_LOSS_OF_CONSCIOUSNESS",
    "description": "Allows an application to read the user's loss of consciousness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_LOWER_BACK_PAIN",
    "value": "android.permission.health.READ_SYMPTOM_LOWER_BACK_PAIN",
    "description": "Allows an application to read the user's lower back pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_MEMORY_LAPSE",
    "value": "android.permission.health.READ_SYMPTOM_MEMORY_LAPSE",
    "description": "Allows an application to read the user's memory lapse data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_MOOD_CHANGE",
    "value": "android.permission.health.READ_SYMPTOM_MOOD_CHANGE",
    "description": "Allows an application to read the user's mood change data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_MUSCLE_PAIN",
    "value": "android.permission.health.READ_SYMPTOM_MUSCLE_PAIN",
    "description": "Allows an application to read the user's muscle pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_NAUSEA",
    "value": "android.permission.health.READ_SYMPTOM_NAUSEA",
    "description": "Allows an application to read the user's nausea data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_NIGHT_SWEATS",
    "value": "android.permission.health.READ_SYMPTOM_NIGHT_SWEATS",
    "description": "Allows an application to read the user's night sweats data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_PELVIC_PAIN",
    "value": "android.permission.health.READ_SYMPTOM_PELVIC_PAIN",
    "description": "Allows an application to read the user's pelvic pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_RAPID_POUNDING_OR_FLUTTERING_HEARTBEAT",
    "value": "android.permission.health.READ_SYMPTOM_RAPID_POUNDING_OR_FLUTTERING_HEARTBEAT",
    "description": "Allows an application to read the user's rapid, pounding, or fluttering heartbeat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_REDUCED_CAPACITY_FOR_EXERCISE",
    "value": "android.permission.health.READ_SYMPTOM_REDUCED_CAPACITY_FOR_EXERCISE",
    "description": "Allows an application to read the user's reduced capacity for exercise data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_RUNNY_NOSE",
    "value": "android.permission.health.READ_SYMPTOM_RUNNY_NOSE",
    "description": "Allows an application to read the user's runny nose data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_SHORTNESS_OF_BREATH",
    "value": "android.permission.health.READ_SYMPTOM_SHORTNESS_OF_BREATH",
    "description": "Allows an application to read the user's shortness of breath data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_SKIPPED_HEARTBEAT",
    "value": "android.permission.health.READ_SYMPTOM_SKIPPED_HEARTBEAT",
    "description": "Allows an application to read the user's skipped heartbeat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_SLEEPINESS",
    "value": "android.permission.health.READ_SYMPTOM_SLEEPINESS",
    "description": "Allows an application to read the user's sleepiness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_SLEEP_CHANGES",
    "value": "android.permission.health.READ_SYMPTOM_SLEEP_CHANGES",
    "description": "Allows an application to read the user's sleep changes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_SNEEZING",
    "value": "android.permission.health.READ_SYMPTOM_SNEEZING",
    "description": "Allows an application to read the user's sneezing data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_SNORE",
    "value": "android.permission.health.READ_SYMPTOM_SNORE",
    "description": "Allows an application to read the user's snore data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_SORE_THROAT",
    "value": "android.permission.health.READ_SYMPTOM_SORE_THROAT",
    "description": "Allows an application to read the user's sore throat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_STOMACH_ACHE",
    "value": "android.permission.health.READ_SYMPTOM_STOMACH_ACHE",
    "description": "Allows an application to read the user's stomach ache data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_STUFFY_NOSE",
    "value": "android.permission.health.READ_SYMPTOM_STUFFY_NOSE",
    "description": "Allows an application to read the user's stuffy nose data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_UNEXPLAINED_WEIGHT_CHANGES",
    "value": "android.permission.health.READ_SYMPTOM_UNEXPLAINED_WEIGHT_CHANGES",
    "description": "Allows an application to read the user's unexplained weight changes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_VAGINAL_DRYNESS",
    "value": "android.permission.health.READ_SYMPTOM_VAGINAL_DRYNESS",
    "description": "Allows an application to read the user's vaginal dryness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_VAGINAL_ITCHINESS",
    "value": "android.permission.health.READ_SYMPTOM_VAGINAL_ITCHINESS",
    "description": "Allows an application to read the user's vaginal itchiness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_VOMITING",
    "value": "android.permission.health.READ_SYMPTOM_VOMITING",
    "description": "Allows an application to read the user's vomiting data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_WATER_RETENTION",
    "value": "android.permission.health.READ_SYMPTOM_WATER_RETENTION",
    "description": "Allows an application to read the user's water retention data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_SYMPTOM_WHEEZING",
    "value": "android.permission.health.READ_SYMPTOM_WHEEZING",
    "description": "Allows an application to read the user's wheezing data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "READ_TOTAL_CALORIES_BURNED",
    "value": "android.permission.health.READ_TOTAL_CALORIES_BURNED",
    "description": "Allows an application to read the user's total calories burned data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_VO2_MAX",
    "value": "android.permission.health.READ_VO2_MAX",
    "description": "Allows an application to read the user's vo2 maximum data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_WEIGHT",
    "value": "android.permission.health.READ_WEIGHT",
    "description": "Allows an application to read the user's weight data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "READ_WHEELCHAIR_PUSHES",
    "value": "android.permission.health.READ_WHEELCHAIR_PUSHES",
    "description": "Allows an application to read the user's wheelchair pushes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "START_ONBOARDING",
    "value": "android.permission.health.START_ONBOARDING",
    "description": "Allows an application to launch client onboarding activities responsible for connecting to Health Connect. This permission can only be held by the system. Client apps that choose to export an onboarding activity must guard it with this permission so that only the system can launch it. See HealthConnectManager.ACTION_SHOW_ONBOARDING for the corresponding intent used by the system to launch onboarding activities.",
    "protectionLevel": "signature",
    "added": "Added in version 36.1 Also in U Extensions 19"
  },
  {
    "constant": "WRITE_ACTIVE_CALORIES_BURNED",
    "value": "android.permission.health.WRITE_ACTIVE_CALORIES_BURNED",
    "description": "Allows an application to write the user's calories burned data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_ACTIVITY_INTENSITY",
    "value": "android.permission.health.WRITE_ACTIVITY_INTENSITY",
    "description": "Allows an application to write the user's activity intensity data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "WRITE_ALCOHOL_CONSUMPTION",
    "value": "android.permission.health.WRITE_ALCOHOL_CONSUMPTION",
    "description": "Allows an application to write user's alcohol consumption data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_BASAL_BODY_TEMPERATURE",
    "value": "android.permission.health.WRITE_BASAL_BODY_TEMPERATURE",
    "description": "Allows an application to write the user's basal body temperature data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_BASAL_METABOLIC_RATE",
    "value": "android.permission.health.WRITE_BASAL_METABOLIC_RATE",
    "description": "Allows an application to write the user's basal metabolic rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_BLOOD_GLUCOSE",
    "value": "android.permission.health.WRITE_BLOOD_GLUCOSE",
    "description": "Allows an application to write the user's blood glucose data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_BLOOD_PRESSURE",
    "value": "android.permission.health.WRITE_BLOOD_PRESSURE",
    "description": "Allows an application to write the user's blood pressure data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_BODY_FAT",
    "value": "android.permission.health.WRITE_BODY_FAT",
    "description": "Allows an application to write the user's body fat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_BODY_TEMPERATURE",
    "value": "android.permission.health.WRITE_BODY_TEMPERATURE",
    "description": "Allows an application to write the user's body temperature data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_BODY_WATER_MASS",
    "value": "android.permission.health.WRITE_BODY_WATER_MASS",
    "description": "Allows an application to write the user's body water mass data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_BONE_MASS",
    "value": "android.permission.health.WRITE_BONE_MASS",
    "description": "Allows an application to write the user's bone mass data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_CERVICAL_MUCUS",
    "value": "android.permission.health.WRITE_CERVICAL_MUCUS",
    "description": "Allows an application to write the user's cervical mucus data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_DEVICE_UDI",
    "value": "android.permission.health.WRITE_DEVICE_UDI",
    "description": "Allows an application to write the device's unique device identifier (UDI).",
    "protectionLevel": "normal",
    "added": "Added in version 37.1 Also in U Extensions 23"
  },
  {
    "constant": "WRITE_DISTANCE",
    "value": "android.permission.health.WRITE_DISTANCE",
    "description": "Allows an application to write the user's distance data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_ELEVATION_GAINED",
    "value": "android.permission.health.WRITE_ELEVATION_GAINED",
    "description": "Allows an application to write the user's elevation gained data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_EXERCISE",
    "value": "android.permission.health.WRITE_EXERCISE",
    "description": "Allows an application to write the user's exercise data. Additional permission HealthPermissions.WRITE_EXERCISE_ROUTE is required to write user's exercise route.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_EXERCISE_ROUTE",
    "value": "android.permission.health.WRITE_EXERCISE_ROUTE",
    "description": "Allows an application to write the user's exercise route.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_FLOORS_CLIMBED",
    "value": "android.permission.health.WRITE_FLOORS_CLIMBED",
    "description": "Allows an application to write the user's floors climbed data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_HEART_RATE",
    "value": "android.permission.health.WRITE_HEART_RATE",
    "description": "Allows an application to write the user's heart rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_HEART_RATE_VARIABILITY",
    "value": "android.permission.health.WRITE_HEART_RATE_VARIABILITY",
    "description": "Allows an application to write the user's heart rate variability data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_HEIGHT",
    "value": "android.permission.health.WRITE_HEIGHT",
    "description": "Allows an application to write the user's height data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_HYDRATION",
    "value": "android.permission.health.WRITE_HYDRATION",
    "description": "Allows an application to write the user's hydration data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_INTERMENSTRUAL_BLEEDING",
    "value": "android.permission.health.WRITE_INTERMENSTRUAL_BLEEDING",
    "description": "Allows an application to write the user's intermenstrual bleeding data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_LEAN_BODY_MASS",
    "value": "android.permission.health.WRITE_LEAN_BODY_MASS",
    "description": "Allows an application to write the user's lean body mass data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_MEDICAL_DATA",
    "value": "android.permission.health.WRITE_MEDICAL_DATA",
    "description": "Allows an application to write the user's medical data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 16"
  },
  {
    "constant": "WRITE_MENSTRUAL_CYCLE_PHASE",
    "value": "android.permission.health.WRITE_MENSTRUAL_CYCLE_PHASE",
    "description": "Allows an application to write the user's cycle phases data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 22"
  },
  {
    "constant": "WRITE_MENSTRUATION",
    "value": "android.permission.health.WRITE_MENSTRUATION",
    "description": "Allows an application to write the user's menstruation data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_MINDFULNESS",
    "value": "android.permission.health.WRITE_MINDFULNESS",
    "description": "Allows an application to write user's mindfulness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 36 Also in U Extensions 15"
  },
  {
    "constant": "WRITE_NUTRITION",
    "value": "android.permission.health.WRITE_NUTRITION",
    "description": "Allows an application to write the user's nutrition data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_OVULATION_TEST",
    "value": "android.permission.health.WRITE_OVULATION_TEST",
    "description": "Allows an application to write the user's ovulation test data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_OXYGEN_SATURATION",
    "value": "android.permission.health.WRITE_OXYGEN_SATURATION",
    "description": "Allows an application to write the user's oxygen saturation data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_PLANNED_EXERCISE",
    "value": "android.permission.health.WRITE_PLANNED_EXERCISE",
    "description": "Allows an application to write the user's training plan data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 35 Also in U Extensions 13"
  },
  {
    "constant": "WRITE_POWER",
    "value": "android.permission.health.WRITE_POWER",
    "description": "Allows an application to write the user's power data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_RESPIRATORY_RATE",
    "value": "android.permission.health.WRITE_RESPIRATORY_RATE",
    "description": "Allows an application to write the user's respiratory rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_RESTING_HEART_RATE",
    "value": "android.permission.health.WRITE_RESTING_HEART_RATE",
    "description": "Allows an application to write the user's resting heart rate data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_SEXUAL_ACTIVITY",
    "value": "android.permission.health.WRITE_SEXUAL_ACTIVITY",
    "description": "Allows an application to write the user's sexual activity data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_SKIN_TEMPERATURE",
    "value": "android.permission.health.WRITE_SKIN_TEMPERATURE",
    "description": "Allows an application to write the user's skin temperature data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 35 Also in U Extensions 13"
  },
  {
    "constant": "WRITE_SLEEP",
    "value": "android.permission.health.WRITE_SLEEP",
    "description": "Allows an application to write the user's sleep data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_SPEED",
    "value": "android.permission.health.WRITE_SPEED",
    "description": "Allows an application to write the user's speed data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_STEPS",
    "value": "android.permission.health.WRITE_STEPS",
    "description": "Allows an application to write the user's steps data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_SYMPTOM_ABDOMINAL_PAIN",
    "value": "android.permission.health.WRITE_SYMPTOM_ABDOMINAL_PAIN",
    "description": "Allows an application to write the user's abdominal pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_ACNE",
    "value": "android.permission.health.WRITE_SYMPTOM_ACNE",
    "description": "Allows an application to write the user's acne data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_BACK_PAIN",
    "value": "android.permission.health.WRITE_SYMPTOM_BACK_PAIN",
    "description": "Allows an application to write the user's back pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_BLOATING",
    "value": "android.permission.health.WRITE_SYMPTOM_BLOATING",
    "description": "Allows an application to write the user's bloating data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_BRAIN_FOG",
    "value": "android.permission.health.WRITE_SYMPTOM_BRAIN_FOG",
    "description": "Allows an application to write the user's brain fog data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_BREAST_TENDERNESS",
    "value": "android.permission.health.WRITE_SYMPTOM_BREAST_TENDERNESS",
    "description": "Allows an application to write the user's breast tenderness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_BRITTLE_NAILS",
    "value": "android.permission.health.WRITE_SYMPTOM_BRITTLE_NAILS",
    "description": "Allows an application to write the user's brittle nails data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_BURNING_MOUTH",
    "value": "android.permission.health.WRITE_SYMPTOM_BURNING_MOUTH",
    "description": "Allows an application to write the user's burning mouth data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_CHEST_PAIN",
    "value": "android.permission.health.WRITE_SYMPTOM_CHEST_PAIN",
    "description": "Allows an application to write the user's chest pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_CHEST_TIGHTNESS",
    "value": "android.permission.health.WRITE_SYMPTOM_CHEST_TIGHTNESS",
    "description": "Allows an application to write the user's chest tightness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_CHILLS",
    "value": "android.permission.health.WRITE_SYMPTOM_CHILLS",
    "description": "Allows an application to write the user's chills data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_CONSTIPATION",
    "value": "android.permission.health.WRITE_SYMPTOM_CONSTIPATION",
    "description": "Allows an application to write the user's constipation data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_COUGH",
    "value": "android.permission.health.WRITE_SYMPTOM_COUGH",
    "description": "Allows an application to write the user's cough symptom data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_CRAMPS",
    "value": "android.permission.health.WRITE_SYMPTOM_CRAMPS",
    "description": "Allows an application to write the user's cramps data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_CRAVINGS",
    "value": "android.permission.health.WRITE_SYMPTOM_CRAVINGS",
    "description": "Allows an application to write the user's cravings data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_DEHYDRATION",
    "value": "android.permission.health.WRITE_SYMPTOM_DEHYDRATION",
    "description": "Allows an application to write the user's dehydration data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_DIARRHEA",
    "value": "android.permission.health.WRITE_SYMPTOM_DIARRHEA",
    "description": "Allows an application to write the user's diarrhea data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_DIFFICULTY_SWALLOWING",
    "value": "android.permission.health.WRITE_SYMPTOM_DIFFICULTY_SWALLOWING",
    "description": "Allows an application to write the user's difficulty swallowing data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_DIZZINESS",
    "value": "android.permission.health.WRITE_SYMPTOM_DIZZINESS",
    "description": "Allows an application to write the user's dizziness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_DRY_SKIN",
    "value": "android.permission.health.WRITE_SYMPTOM_DRY_SKIN",
    "description": "Allows an application to write the user's dry skin data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_EARACHES",
    "value": "android.permission.health.WRITE_SYMPTOM_EARACHES",
    "description": "Allows an application to write the user's earaches data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_FATIGUE",
    "value": "android.permission.health.WRITE_SYMPTOM_FATIGUE",
    "description": "Allows an application to write the user's fatigue data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_FEVER",
    "value": "android.permission.health.WRITE_SYMPTOM_FEVER",
    "description": "Allows an application to write the user's fever data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_GENERALIZED_BODY_ACHE",
    "value": "android.permission.health.WRITE_SYMPTOM_GENERALIZED_BODY_ACHE",
    "description": "Allows an application to write the user's generalized body ache data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_HAIR_LOSS",
    "value": "android.permission.health.WRITE_SYMPTOM_HAIR_LOSS",
    "description": "Allows an application to write the user's hair loss data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_HEADACHE",
    "value": "android.permission.health.WRITE_SYMPTOM_HEADACHE",
    "description": "Allows an application to write the user's headache data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_HEARTBURN",
    "value": "android.permission.health.WRITE_SYMPTOM_HEARTBURN",
    "description": "Allows an application to write the user's heartburn data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_HEART_PALPITATIONS",
    "value": "android.permission.health.WRITE_SYMPTOM_HEART_PALPITATIONS",
    "description": "Allows an application to write the user's heart palpitations data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_HOT_FLASHES",
    "value": "android.permission.health.WRITE_SYMPTOM_HOT_FLASHES",
    "description": "Allows an application to write the user's hot flashes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_INSOMNIA",
    "value": "android.permission.health.WRITE_SYMPTOM_INSOMNIA",
    "description": "Allows an application to write the user's insomnia data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_JOINT_PAIN",
    "value": "android.permission.health.WRITE_SYMPTOM_JOINT_PAIN",
    "description": "Allows an application to write the user's joint pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_JOINT_STIFFNESS",
    "value": "android.permission.health.WRITE_SYMPTOM_JOINT_STIFFNESS",
    "description": "Allows an application to write the user's joint stiffness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_LOSS_OF_APPETITE",
    "value": "android.permission.health.WRITE_SYMPTOM_LOSS_OF_APPETITE",
    "description": "Allows an application to write the user's loss of appetite data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_LOSS_OF_CONSCIOUSNESS",
    "value": "android.permission.health.WRITE_SYMPTOM_LOSS_OF_CONSCIOUSNESS",
    "description": "Allows an application to write the user's loss of consciousness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_LOWER_BACK_PAIN",
    "value": "android.permission.health.WRITE_SYMPTOM_LOWER_BACK_PAIN",
    "description": "Allows an application to write the user's lower back pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_MEMORY_LAPSE",
    "value": "android.permission.health.WRITE_SYMPTOM_MEMORY_LAPSE",
    "description": "Allows an application to write the user's memory lapse data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_MOOD_CHANGE",
    "value": "android.permission.health.WRITE_SYMPTOM_MOOD_CHANGE",
    "description": "Allows an application to write the user's mood change data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_MUSCLE_PAIN",
    "value": "android.permission.health.WRITE_SYMPTOM_MUSCLE_PAIN",
    "description": "Allows an application to write the user's muscle pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_NAUSEA",
    "value": "android.permission.health.WRITE_SYMPTOM_NAUSEA",
    "description": "Allows an application to write the user's nausea data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_NIGHT_SWEATS",
    "value": "android.permission.health.WRITE_SYMPTOM_NIGHT_SWEATS",
    "description": "Allows an application to write the user's night sweats data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_PELVIC_PAIN",
    "value": "android.permission.health.WRITE_SYMPTOM_PELVIC_PAIN",
    "description": "Allows an application to write the user's pelvic pain data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_RAPID_POUNDING_OR_FLUTTERING_HEARTBEAT",
    "value": "android.permission.health.WRITE_SYMPTOM_RAPID_POUNDING_OR_FLUTTERING_HEARTBEAT",
    "description": "Allows an application to write the user's rapid, pounding, or fluttering heartbeat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_REDUCED_CAPACITY_FOR_EXERCISE",
    "value": "android.permission.health.WRITE_SYMPTOM_REDUCED_CAPACITY_FOR_EXERCISE",
    "description": "Allows an application to write the user's reduced capacity for exercise data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_RUNNY_NOSE",
    "value": "android.permission.health.WRITE_SYMPTOM_RUNNY_NOSE",
    "description": "Allows an application to write the user's runny nose data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_SHORTNESS_OF_BREATH",
    "value": "android.permission.health.WRITE_SYMPTOM_SHORTNESS_OF_BREATH",
    "description": "Allows an application to write the user's shortness of breath data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_SKIPPED_HEARTBEAT",
    "value": "android.permission.health.WRITE_SYMPTOM_SKIPPED_HEARTBEAT",
    "description": "Allows an application to write the user's skipped heartbeat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_SLEEPINESS",
    "value": "android.permission.health.WRITE_SYMPTOM_SLEEPINESS",
    "description": "Allows an application to write the user's sleepiness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_SLEEP_CHANGES",
    "value": "android.permission.health.WRITE_SYMPTOM_SLEEP_CHANGES",
    "description": "Allows an application to write the user's sleep changes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_SNEEZING",
    "value": "android.permission.health.WRITE_SYMPTOM_SNEEZING",
    "description": "Allows an application to write the user's sneezing data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_SNORE",
    "value": "android.permission.health.WRITE_SYMPTOM_SNORE",
    "description": "Allows an application to write the user's snore data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_SORE_THROAT",
    "value": "android.permission.health.WRITE_SYMPTOM_SORE_THROAT",
    "description": "Allows an application to write the user's sore throat data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_STOMACH_ACHE",
    "value": "android.permission.health.WRITE_SYMPTOM_STOMACH_ACHE",
    "description": "Allows an application to write the user's stomach ache data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_STUFFY_NOSE",
    "value": "android.permission.health.WRITE_SYMPTOM_STUFFY_NOSE",
    "description": "Allows an application to write the user's stuffy nose data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_UNEXPLAINED_WEIGHT_CHANGES",
    "value": "android.permission.health.WRITE_SYMPTOM_UNEXPLAINED_WEIGHT_CHANGES",
    "description": "Allows an application to write the user's unexplained weight changes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_VAGINAL_DRYNESS",
    "value": "android.permission.health.WRITE_SYMPTOM_VAGINAL_DRYNESS",
    "description": "Allows an application to write the user's vaginal dryness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_VAGINAL_ITCHINESS",
    "value": "android.permission.health.WRITE_SYMPTOM_VAGINAL_ITCHINESS",
    "description": "Allows an application to write the user's vaginal itchiness data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_VOMITING",
    "value": "android.permission.health.WRITE_SYMPTOM_VOMITING",
    "description": "Allows an application to write the user's vomiting data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_WATER_RETENTION",
    "value": "android.permission.health.WRITE_SYMPTOM_WATER_RETENTION",
    "description": "Allows an application to write the user's water retention data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_SYMPTOM_WHEEZING",
    "value": "android.permission.health.WRITE_SYMPTOM_WHEEZING",
    "description": "Allows an application to write the user's wheezing data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 37 Also in U Extensions 21"
  },
  {
    "constant": "WRITE_TOTAL_CALORIES_BURNED",
    "value": "android.permission.health.WRITE_TOTAL_CALORIES_BURNED",
    "description": "Allows an application to write the user's total calories burned data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_VO2_MAX",
    "value": "android.permission.health.WRITE_VO2_MAX",
    "description": "Allows an application to write the user's vo2 maximum data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_WEIGHT",
    "value": "android.permission.health.WRITE_WEIGHT",
    "description": "Allows an application to write the user's weight data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  },
  {
    "constant": "WRITE_WHEELCHAIR_PUSHES",
    "value": "android.permission.health.WRITE_WHEELCHAIR_PUSHES",
    "description": "Allows an application to write the user's wheelchair pushes data.",
    "protectionLevel": "dangerous",
    "added": "Added in API level 34 Also in U Extensions 7"
  }
];

/** The Jetpack HealthPermission class's string constants. `value` is set
 *  only where Google's description states the string; the Jetpack page
 *  otherwise prints the constant without its value. */
export const HC_JETPACK_PERMISSION_CONSTANTS: { constant: string | null; value: string | null; annotations: string[]; description: string | null }[] = [
  {
    "constant": "PERMISSION_READ_EXERCISE_ROUTES",
    "value": "android.permission.health.READ_EXERCISE_ROUTES",
    "annotations": [],
    "description": "A permission to read exercise routes. The string value for this permission is android.permission.health.READ_EXERCISE_ROUTES. This permission can't be granted via the standard permission request mechanism, and can only be granted by a user in Settings, or via the dialog launched by androidx.health.connect.client.contracts.ExerciseRouteRequestContract. When this permission is granted, the app can read exercise routes without user interaction, however reading apps must be in the foreground unless android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND is also granted. When this permission is revoked, exercise routes can only be obtained by launching the androidx.health.connect.client.contracts.ExerciseRouteRequestContract intent."
  },
  {
    "constant": "PERMISSION_READ_HEALTH_DATA_HISTORY",
    "value": null,
    "annotations": [],
    "description": "A permission that allows to read the entire history of health data (of any type). Without this permission: Any attempt to read a single data point, via HealthConnectClient.readRecord, older than 30 days from before the first HealthConnect permission was granted to the calling app, will result in an error. Any other read attempts will not return data points older than 30 days from before the first HealthConnect permission was granted to the calling app. This permission applies for the following api methods: HealthConnectClient.readRecord, HealthConnectClient.readRecords, HealthConnectClient.aggregate, HealthConnectClient.aggregateGroupByPeriod, HealthConnectClient.aggregateGroupByDuration and HealthConnectClient.getChanges. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_HISTORY as an argument."
  },
  {
    "constant": "PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND",
    "value": null,
    "annotations": [],
    "description": "A permission to read data in background. An attempt to read data in background without this permission may result in an error. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_IN_BACKGROUND as an argument."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_ALLERGIES_INTOLERANCES",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's data about allergies and intolerances. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_CONDITIONS",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's data about medical conditions. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_LABORATORY_RESULTS",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's laboratory result data. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_MEDICATIONS",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's medication data. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_PERSONAL_DETAILS",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's personal details. This is demographic information such as name, date of birth, contact details like address or telephone number and so on. For more examples see the FHIR Patient resource at https://www.hl7.org/fhir/patient.html. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_PRACTITIONER_DETAILS",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's data about the practitioners who have interacted with them in their medical record. This is the information about the clinicians (doctors, nurses, etc) but also other practitioners (masseurs, physiotherapists, etc) who have been involved with the patient. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_PREGNANCY",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's pregnancy data. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_PROCEDURES",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's data about medical procedures. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_SOCIAL_HISTORY",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's social history data. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_VACCINES",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's data about immunizations and vaccinations. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_VISITS",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's information about their encounters with health care practitioners, including things like location, time of appointment, and name of organization the visit was with. Despite the name visit it covers remote encounters such as telephone or videoconference appointments. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_READ_MEDICAL_DATA_VITAL_SIGNS",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Allows an application to read the user's vital signs data. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  },
  {
    "constant": "PERMISSION_WRITE_EXERCISE_ROUTE",
    "value": null,
    "annotations": [],
    "description": "A permission to write exercise routes. This permission must be granted to successfully insert a route as a field of the corresponding androidx.health.connect.client.records.ExerciseSessionRecord. An attempt to insert/update a session with a set route without the permission granted will result in a failed call and the session insertion/update will be rejected. If the permission is not granted the previously written route will not be deleted if the session gets updated with no route set."
  },
  {
    "constant": "PERMISSION_WRITE_MEDICAL_DATA",
    "value": null,
    "annotations": [
      "ExperimentalPersonalHealthRecordApi"
    ],
    "description": "Permission to write medical data records. This permission allows for the write of medical data of any type. Note that read permissions are specified per-type. This feature is dependent on the version of HealthConnect installed on the device. To check if it's available call HealthConnectFeatures.getFeatureStatus and pass HealthConnectFeatures.FEATURE_PERSONAL_HEALTH_RECORD as an argument. If not available, this permission will not be granted if requested."
  }
];

/** Strings Google's data-types table prints that neither permission
 *  reference defines — a disagreement between Google's own pages. */
export const HC_UNRESOLVED_PERMISSIONS: { className: string; permission: string }[] = [
  {
    "className": "ExerciseSessionRecord",
    "permission": "android.permission.health.READ_EXERCISE_ROUTE"
  }
];
