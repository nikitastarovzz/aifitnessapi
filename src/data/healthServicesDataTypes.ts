/**
 * Wear OS Health Services data types (androidx.health.services.client.data.
 * DataType companion constants) and the permission each needs, read from
 * Google's own reference and guide.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-health-services-data-types.mjs
 *
 * Sources:
 *   https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType
 *   https://developer.android.com/health-and-fitness/health-services/permissions
 * Fetched: 2026-10-04
 *
 * dataTypeClass, valueType and dataPointClass are read from the declaration
 * printed in `kotlinType`. `permission` is set only where Google's
 * permissions table names the constant, and that row's text is stored in
 * `permissionEvidence`; both are null otherwise.
 */

/** The date the generator last read the sources (the DataType page's fetch date). */
export const HS_DATA_TYPES_FETCHED_ON = "2026-10-04";

/** The pages this file was read from. */
export const HS_DATA_TYPES_SOURCES = {
  "dataType": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType",
  "permissions": "https://developer.android.com/health-and-fitness/health-services/permissions"
} as const;

/** Google's "Last updated" footer stamp on each page at read time. */
export const HS_DATA_TYPES_SOURCE_UPDATED = {
  "dataType": "2026-08-06",
  "permissions": "2026-01-19"
};

/** The Jetpack artifact and the version DataType itself was added in, as printed. */
export const HS_DATA_TYPE_ARTIFACT: string | null = "androidx.health:health-services-client";
export const HS_DATA_TYPE_CLASS_ADDED_IN: string | null = "1.0.0";

/** Google's description of the DataType class, paragraph by paragraph, verbatim. */
export const HS_DATA_TYPE_CLASS_DESCRIPTION: string[] = [
  "A data type is a representation of health data managed by Health Services.",
  "A DataType specifies the type of the values inside of a DataPoint. Health Services defines data types for instantaneous observations (Samples / SampleDataPoint, e.g. heart rate) and data types for a change between readings (Intervals / IntervalDataPoint, e.g. distance).",
  "Health services also allows specifying aggregated versions of many data types, which will allow the developer to get e.g. a running total of intervals (CumulativeDataPoint) or statistics like min/max/average on samples (StatisticalDataPoint).",
  "Note: the data type defines only the representation and format of the data, and not how it's being collected, the sensor being used, or the parameters of the collection. As an example, DISTANCE may come from GPS location if available, or steps if not available."
];

/** DataType's "Known direct subclasses" table, verbatim. */
export const HS_DATA_TYPE_SUBCLASSES: { name: string; description: string }[] = [
  {
    "name": "AggregateDataType",
    "description": "DataType that represents aggregated data."
  },
  {
    "name": "DeltaDataType",
    "description": "DataType that represents a granular, non-aggregated point in time."
  }
];

export type HsDataType = {
  /** Companion constant name, e.g. "HEART_RATE_BPM". */
  name: string;
  /** The declared type exactly as printed, e.g. "DeltaDataType<Double, SampleDataPoint<Double>>". */
  kotlinType: string;
  /** "DeltaDataType" or "AggregateDataType" — the declaration's outer type. */
  dataTypeClass: string;
  /** The first type argument, e.g. "Double", "Long", "LocationData". */
  valueType: string;
  /** "SampleDataPoint", "IntervalDataPoint", "CumulativeDataPoint" or "StatisticalDataPoint". */
  dataPointClass: string;
  /** Google's first description paragraph, verbatim. */
  description: string | null;
  /** Google's further paragraphs, joined; null when none. */
  detail: string | null;
  /** The constant's own "Added in" version; null where its block prints none. */
  addedIn: string | null;
  deprecated: boolean;
  /** The permission Google's permissions table lists it under; null where the table does not name it. */
  permission: string | null;
  /** The table row `permission` was read from ("data types | permission"). */
  permissionEvidence: string | null;
  docUrl: string;
};

/** Every DataType companion constant, in the reference's (alphabetical) order. */
export const HS_DATA_TYPES: HsDataType[] = [
  {
    "name": "ABSOLUTE_ELEVATION",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Absolute elevation at a specific point in time expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACCESS_FINE_LOCATION",
    "permissionEvidence": "ABSOLUTE_ELEVATION LOCATION | ACCESS_FINE_LOCATION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ABSOLUTE_ELEVATION()"
  },
  {
    "name": "ABSOLUTE_ELEVATION_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistical information about the absolute elevation over the course of the active exercise expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ABSOLUTE_ELEVATION_STATS()"
  },
  {
    "name": "ACTIVE_EXERCISE_DURATION_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The total time the Exercise was ExerciseState.ACTIVE in seconds.",
    "detail": "Note: this DataType is only intended to be used in conjunction with exercise goals. DataPoints will not be delivered for this DataType. If you want to query the active duration, you should use ExerciseUpdate.activeDuration which is available in every ExerciseUpdate.",
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ACTIVE_EXERCISE_DURATION_TOTAL()"
  },
  {
    "name": "CALORIES",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "Number of calories burned (including basal rate and activity) since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#CALORIES()"
  },
  {
    "name": "CALORIES_DAILY",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "The total number of calories over a day (including both BMR and active calories), where the previous day ends and a new day begins at 12:00 AM local time. Each DataPoint of this type will cover the interval from the start of day to now. In the event of time-zone shifts, the interval might be greater than 24hrs.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#CALORIES_DAILY()"
  },
  {
    "name": "CALORIES_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total number of calories burned (including basal rate and activity) since the start of the current active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#CALORIES_TOTAL()"
  },
  {
    "name": "DECLINE_DISTANCE",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "Distance traveled over declining ground between each reading expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#DECLINE_DISTANCE()"
  },
  {
    "name": "DECLINE_DISTANCE_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The total distance traveled over declining ground between each reading since the start of the active exercise expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#DECLINE_DISTANCE_TOTAL()"
  },
  {
    "name": "DECLINE_DURATION",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "The amount of time the user spent traveling over declining ground since the last update, expressed in seconds.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#DECLINE_DURATION()"
  },
  {
    "name": "DECLINE_DURATION_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total duration the user spent traveling over declining ground since the start of the active exercise, expressed in seconds.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#DECLINE_DURATION_TOTAL()"
  },
  {
    "name": "DISTANCE",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "A distance delta between each reading expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#DISTANCE()"
  },
  {
    "name": "DISTANCE_DAILY",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "The total distance over a day, where the previous day ends and a new day begins at 12:00 AM local time. Each DataPoint of this type will cover the interval from the start of day to now. In the event of time-zone shifts, the interval may be greater than 24hrs.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#DISTANCE_DAILY()"
  },
  {
    "name": "DISTANCE_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total distance since the start of the active exercise expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#DISTANCE_TOTAL()"
  },
  {
    "name": "ELEVATION_GAIN",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "A measure of the gain in elevation since the last update expressed in meters. Elevation losses are not counted in this metric (so it will only be positive or 0).",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ELEVATION_GAIN()"
  },
  {
    "name": "ELEVATION_GAIN_DAILY",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "The total gain in elevation over a day expressed in meters in double format, where the previous day ends and a new day begins at 12:00 AM local time. Elevation losses are not counted in this metric (so it will only be positive or 0). Each DataPoint of this type will cover the interval from the start of day to now. In the event of time-zone shifts, the interval might be greater than 24hrs.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ELEVATION_GAIN_DAILY()"
  },
  {
    "name": "ELEVATION_GAIN_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "A measure of the total gain in elevation since the start of an active exercise expressed in meters. Elevation losses are not counted in this metric (so it will only be positive or 0).",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ELEVATION_GAIN_TOTAL()"
  },
  {
    "name": "ELEVATION_LOSS",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "A measure of the loss in elevation since the last update expressed in meters. Elevation gains are not counted in this metric (so it will only be positive or 0).",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ELEVATION_LOSS()"
  },
  {
    "name": "ELEVATION_LOSS_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "A measure of the total loss in elevation since the start of an active exercise expressed in meters. Elevation gains are not counted in this metric (so it will only be positive or 0).",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#ELEVATION_LOSS_TOTAL()"
  },
  {
    "name": "FLAT_GROUND_DISTANCE",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "The distance traveled over flat since the last update expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#FLAT_GROUND_DISTANCE()"
  },
  {
    "name": "FLAT_GROUND_DISTANCE_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The total distance traveled over flat ground since the start of the active exercise expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#FLAT_GROUND_DISTANCE_TOTAL()"
  },
  {
    "name": "FLAT_GROUND_DURATION",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "The amount of time the user spent traveling over flat ground since the last update, expressed in seconds.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#FLAT_GROUND_DURATION()"
  },
  {
    "name": "FLAT_GROUND_DURATION_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The total duration the user spent traveling over flat ground since the start of the active exercise, expressed in seconds.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#FLAT_GROUND_DURATION_TOTAL()"
  },
  {
    "name": "FLOORS",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "Number of floors climbed since the last update. Note that partial floors are supported, so this is represented as a Double.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#FLOORS()"
  },
  {
    "name": "FLOORS_DAILY",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "The total number floors climbed over a day, where the previous day ends and a new day begins at 12:00 AM local time. Each DataPoint of this type will cover the interval from the start of day to now. In the event of time-zone shifts, the interval may be greater than 24hrs.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#FLOORS_DAILY()"
  },
  {
    "name": "FLOORS_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total number of floors climbed since the start of the active exercise. Note that partial floors are supported, so this is represented as a Double.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#FLOORS_TOTAL()"
  },
  {
    "name": "GOLF_SHOT_COUNT",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "The number of golf shots taken since the last update, where a golf shot consists of swinging the club and hitting the ball.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#GOLF_SHOT_COUNT()"
  },
  {
    "name": "GOLF_SHOT_COUNT_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The total number of golf shots taken since the start of the current active exercise, where a golf shot consists swinging the club and hitting the ball.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#GOLF_SHOT_COUNT_TOTAL()"
  },
  {
    "name": "GROUND_CONTACT_TIME",
    "kotlinType": "DeltaDataType<Long, SampleDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "SampleDataPoint",
    "description": "The amount of time during a single step that the runner's foot was in contact with the ground in milliseconds in long format.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#GROUND_CONTACT_TIME()"
  },
  {
    "name": "GROUND_CONTACT_TIME_STATS",
    "kotlinType": "AggregateDataType<Long, StatisticalDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on the amount of time during a single step that the runner's foot was in contact with the ground in milliseconds in long format.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#GROUND_CONTACT_TIME_STATS()"
  },
  {
    "name": "HEART_RATE_BPM",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Current heart rate, in beats per minute.",
    "detail": "Accuracy for a DataPoint of type DataType.HEART_RATE_BPM is represented by HeartRateAccuracy.",
    "addedIn": null,
    "deprecated": false,
    "permission": "READ_HEART_RATE",
    "permissionEvidence": "HEART_RATE_BPM | READ_HEART_RATE",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#HEART_RATE_BPM()"
  },
  {
    "name": "HEART_RATE_BPM_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on heart rate since the start of the current exercise, expressed in beats per minute.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#HEART_RATE_BPM_STATS()"
  },
  {
    "name": "INCLINE_DISTANCE",
    "kotlinType": "DeltaDataType<Double, IntervalDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "IntervalDataPoint",
    "description": "The distance traveled over inclining ground since the last update expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#INCLINE_DISTANCE()"
  },
  {
    "name": "INCLINE_DISTANCE_TOTAL",
    "kotlinType": "AggregateDataType<Double, CumulativeDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The total distance traveled over inclining since the start of the active exercise expressed in meters.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#INCLINE_DISTANCE_TOTAL()"
  },
  {
    "name": "INCLINE_DURATION",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "The amount of time the user spent traveling over inclining ground since the last update, expressed in seconds.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#INCLINE_DURATION()"
  },
  {
    "name": "INCLINE_DURATION_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total amount of time the user spent traveling over inclining ground since the start of the active exercise, expressed in seconds.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#INCLINE_DURATION_TOTAL()"
  },
  {
    "name": "LOCATION",
    "kotlinType": "DeltaDataType<LocationData, SampleDataPoint<LocationData>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "LocationData",
    "dataPointClass": "SampleDataPoint",
    "description": "Latitude, longitude and optionally, altitude and bearing at a specific point in time.",
    "detail": "Accuracy for a DataPoint of type LOCATION is represented by LocationAccuracy.",
    "addedIn": null,
    "deprecated": false,
    "permission": "ACCESS_FINE_LOCATION",
    "permissionEvidence": "ABSOLUTE_ELEVATION LOCATION | ACCESS_FINE_LOCATION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#LOCATION()"
  },
  {
    "name": "PACE",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Pace at a specific point in time. Will be 0 if the user stops moving, otherwise the value will be in milliseconds/kilometer.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#PACE()"
  },
  {
    "name": "PACE_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on pace since the start of the current exercise. A value of 0 indicates the user stopped moving, otherwise the value will be in milliseconds/kilometer.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#PACE_STATS()"
  },
  {
    "name": "REP_COUNT",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "The number of repetitions of an exercise performed since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#REP_COUNT()"
  },
  {
    "name": "REP_COUNT_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The number of repetitions of an exercise performed since the start of the current active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#REP_COUNT_TOTAL()"
  },
  {
    "name": "RESTING_EXERCISE_DURATION",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "The number of seconds the user has been resting during an exercise since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#RESTING_EXERCISE_DURATION()"
  },
  {
    "name": "RESTING_EXERCISE_DURATION_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "The total number of seconds the user has been resting during the active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#RESTING_EXERCISE_DURATION_TOTAL()"
  },
  {
    "name": "RUNNING_STEPS",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "Number of steps taken while running since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#RUNNING_STEPS()"
  },
  {
    "name": "RUNNING_STEPS_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Number of steps taken while running since the start of the current active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#RUNNING_STEPS_TOTAL()"
  },
  {
    "name": "SPEED",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Speed at a specific point in time, expressed as meters/second.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#SPEED()"
  },
  {
    "name": "SPEED_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on speed since the start of the active exercise, expressed in meters/second.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#SPEED_STATS()"
  },
  {
    "name": "STEPS",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "Number of steps taken since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#STEPS()"
  },
  {
    "name": "STEPS_DAILY",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "The total step count over a day, where the previous day ends and a new day begins at 12:00 AM local time. Each DataPoint of this type will cover the interval from the start of day to now. In the event of time-zone shifts, the interval may be greater than 24hrs.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#STEPS_DAILY()"
  },
  {
    "name": "STEPS_PER_MINUTE",
    "kotlinType": "DeltaDataType<Long, SampleDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "SampleDataPoint",
    "description": "Step rate in steps/minute at a given point in time.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#STEPS_PER_MINUTE()"
  },
  {
    "name": "STEPS_PER_MINUTE_STATS",
    "kotlinType": "AggregateDataType<Long, StatisticalDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on step rate in steps/minute since the beginning of the current active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#STEPS_PER_MINUTE_STATS()"
  },
  {
    "name": "STEPS_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total steps taken since the start of the active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#STEPS_TOTAL()"
  },
  {
    "name": "STRIDE_LENGTH",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Distance covered by a single step in meters in double format.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#STRIDE_LENGTH()"
  },
  {
    "name": "STRIDE_LENGTH_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on distance covered by a single step in meters in double format.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#STRIDE_LENGTH_STATS()"
  },
  {
    "name": "SWIMMING_LAP_COUNT",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "Count of swimming laps since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#SWIMMING_LAP_COUNT()"
  },
  {
    "name": "SWIMMING_LAP_COUNT_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Count of swimming laps since the start of the current active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#SWIMMING_LAP_COUNT_TOTAL()"
  },
  {
    "name": "SWIMMING_STROKES",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "Number of swimming strokes taken since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#SWIMMING_STROKES()"
  },
  {
    "name": "SWIMMING_STROKES_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total number of swimming strokes taken since the start of the current active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#SWIMMING_STROKES_TOTAL()"
  },
  {
    "name": "VERTICAL_OSCILLATION",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Distance the center of mass moves up-and-down with each step in centimeters in double format.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#VERTICAL_OSCILLATION()"
  },
  {
    "name": "VERTICAL_OSCILLATION_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistic on distance the center of mass moves up-and-down with each step in centimeters in double format.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#VERTICAL_OSCILLATION_STATS()"
  },
  {
    "name": "VERTICAL_RATIO",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Vertical oscillation / stride length.",
    "detail": "For example, a vertical oscillation of 5.0cm and stride length .8m (80 cm) would have a vertical ratio of 0.625.",
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#VERTICAL_RATIO()"
  },
  {
    "name": "VERTICAL_RATIO_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on vertical oscillation / stride length.",
    "detail": "For example, a vertical oscillation of 5.0cm and stride length .8m (80 cm) would have a vertical ratio of 0.625.",
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#VERTICAL_RATIO_STATS()"
  },
  {
    "name": "VO2_MAX",
    "kotlinType": "DeltaDataType<Double, SampleDataPoint<Double>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Double",
    "dataPointClass": "SampleDataPoint",
    "description": "Maximum rate of oxygen consumption measured at a specific point in time. Valid range 0f - 100f.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#VO2_MAX()"
  },
  {
    "name": "VO2_MAX_STATS",
    "kotlinType": "AggregateDataType<Double, StatisticalDataPoint<Double>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Double",
    "dataPointClass": "StatisticalDataPoint",
    "description": "Statistics on maximum rate of oxygen consumption measured since the start of an exercise. Valid range 0f - 100f.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#VO2_MAX_STATS()"
  },
  {
    "name": "WALKING_STEPS",
    "kotlinType": "DeltaDataType<Long, IntervalDataPoint<Long>>",
    "dataTypeClass": "DeltaDataType",
    "valueType": "Long",
    "dataPointClass": "IntervalDataPoint",
    "description": "Number of steps taken while walking since the last update.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": "ACTIVITY_RECOGNITION",
    "permissionEvidence": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION",
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#WALKING_STEPS()"
  },
  {
    "name": "WALKING_STEPS_TOTAL",
    "kotlinType": "AggregateDataType<Long, CumulativeDataPoint<Long>>",
    "dataTypeClass": "AggregateDataType",
    "valueType": "Long",
    "dataPointClass": "CumulativeDataPoint",
    "description": "Total number of steps taken while walking since the start of the current active exercise.",
    "detail": null,
    "addedIn": null,
    "deprecated": false,
    "permission": null,
    "permissionEvidence": null,
    "docUrl": "https://developer.android.com/reference/kotlin/androidx/health/services/client/data/DataType#WALKING_STEPS_TOTAL()"
  }
];

/** Google's permissions table, row by row, names as printed. */
export const HS_PERMISSION_ROWS: { dataTypes: string[]; permission: string; text: string }[] = [
  {
    "dataTypes": [
      "CALORIES",
      "CALORIES_DAILY",
      "DISTANCE_DAILY",
      "DECLINE_DISTANCE",
      "DISTANCE",
      "ELEVATION_GAIN",
      "ELEVATION_LOSS",
      "FLAT_GROUND_DISTANCE",
      "FLOORS",
      "FLOORS_DAILY",
      "GOLF_SHOT_COUNT",
      "INCLINE_DISTANCE",
      "PACE",
      "REP_COUNT",
      "RUNNING_STEPS",
      "SPEED",
      "STEPS",
      "STEPS_DAILY",
      "STEPS_PER_MINUTE",
      "SWIMMING_LAP_COUNT",
      "SWIMMING_STROKES",
      "CALORIES_TOTAL",
      "WALKING_STEPS",
      "UserActivityInfo",
      "UserActivityState"
    ],
    "permission": "ACTIVITY_RECOGNITION",
    "text": "CALORIES CALORIES_DAILY DISTANCE_DAILY DECLINE_DISTANCE DISTANCE ELEVATION_GAIN ELEVATION_LOSS FLAT_GROUND_DISTANCE FLOORS FLOORS_DAILY GOLF_SHOT_COUNT INCLINE_DISTANCE PACE REP_COUNT RUNNING_STEPS SPEED STEPS STEPS_DAILY STEPS_PER_MINUTE SWIMMING_LAP_COUNT SWIMMING_STROKES CALORIES_TOTAL WALKING_STEPS UserActivityInfo UserActivityState | ACTIVITY_RECOGNITION"
  },
  {
    "dataTypes": [
      "HEART_RATE_BPM"
    ],
    "permission": "READ_HEART_RATE",
    "text": "HEART_RATE_BPM | READ_HEART_RATE"
  },
  {
    "dataTypes": [
      "ABSOLUTE_ELEVATION",
      "LOCATION"
    ],
    "permission": "ACCESS_FINE_LOCATION",
    "text": "ABSOLUTE_ELEVATION LOCATION | ACCESS_FINE_LOCATION"
  }
];

/** Names in the permissions table that are not DataType constants (classes such as UserActivityInfo). */
export const HS_PERMISSION_TABLE_NON_CONSTANTS: string[] = ["UserActivityInfo","UserActivityState"];

/** Table cells whose link target differs from the name shown (the name is what this file uses). */
export const HS_PERMISSION_TABLE_LINK_MISMATCHES: { shown: string; linksTo: string }[] = [{"shown":"CALORIES_DAILY","linksTo":"DISTANCE_DAILY"}];

/** The permission list above the table ("Health Services on Wear OS uses the following distinct permissions"), verbatim. */
export const HS_PERMISSION_LIST: string[] = [
  "READ_HEART_RATE for reading heart rate information.",
  "ACTIVITY_RECOGNITION",
  "ACCESS_FINE_LOCATION",
  "BODY_SENSORS on Wear OS 5.1 (API level 35) and lower",
  "BODY_SENSORS_BACKGROUND between Wear OS 4 (API level 33) and Wear OS 5.1 (API level 35), inclusive"
];
