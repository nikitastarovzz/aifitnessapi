/**
 * Every HKQuantityTypeIdentifier, read from Apple's own documentation JSON.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   node scripts/fetch-healthkit-identifiers.mjs
 *
 * Source: https://developer.apple.com/documentation/healthkit (HKQuantityTypeIdentifier, HKCategoryTypeIdentifier, HKCharacteristicTypeIdentifier, HKWorkoutActivityType)
 * Fetched: 2026-08-26
 *
 * `aggregation` and `unitFamily` are the only derived fields. Apple states
 * both in prose rather than as machine-readable properties, and the sentence
 * each was derived from is kept in `aggregationEvidence` so the claim stays
 * auditable. Where Apple's wording does not state it, the value is null — it
 * is never guessed.
 *
 * Why aggregation matters enough to derive: it decides whether a developer
 * sums a type with .cumulativeSum or averages it with .discreteAverage. Pick
 * wrong and HKStatisticsQuery returns a plausible, wrong number rather than
 * an error.
 */

export type HkPlatform = {
  name: string;
  introducedAt: string | null;
  deprecated: boolean;
  beta: boolean;
};

/** The identifier families this dataset covers. */
export type HkFamily = "quantity" | "category" | "characteristic" | "workoutActivity";

export type HkIdentifier = {
  /** Swift case name, e.g. "activeEnergyBurned". */
  case: string;
  /** Objective-C constant, e.g. "HKQuantityTypeIdentifierActiveEnergyBurned". */
  objc: string;
  /** Which identifier family the case belongs to. */
  family: HkFamily;
  /** The Apple type it is a case of, e.g. "HKQuantityTypeIdentifier". */
  familyType: string;
  /** Apple's own topic grouping. */
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Derived from Apple's prose; null when Apple does not state it.
   *  Only quantity types have an aggregation style at all — for the other
   *  families this is null because the concept does not apply, not because
   *  Apple declined to say. Read it together with the family field. */
  aggregation: "cumulative" | "discrete" | null;
  /** The sentence `aggregation` was derived from. */
  aggregationEvidence: string | null;
  /** Derived from Apple's prose, e.g. "energy"; null when unstated.
   *  Only meaningful for quantity types. */
  unitFamily: string | null;
  /** For category types: the HKCategoryValue enum that decodes the sample.
   *  Reading a category sample without it is meaningless. Null elsewhere. */
  valueEnum: string | null;
  platforms: HkPlatform[];
  deprecated: boolean;
  /** Word count of Apple's discussion — how much depth the source offers. */
  discussionWords: number;
  /** True when Apple documents the type with no abstract and no discussion. */
  undocumented: boolean;
};

/** The date the generator last read Apple's documentation. */
export const HK_FETCHED_ON = "2026-08-26";

export const HK_IDENTIFIERS: HkIdentifier[] = [
  {
    "case": "activeEnergyBurned",
    "objc": "HKQuantityTypeIdentifierActiveEnergyBurned",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of active energy the user has burned.",
    "aggregation": "cumulative",
    "aggregationEvidence": "Active energy samples use energy units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "energy",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 96,
    "undocumented": false
  },
  {
    "case": "appleExerciseTime",
    "objc": "HKQuantityTypeIdentifierAppleExerciseTime",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the user spent exercising.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 86,
    "undocumented": false
  },
  {
    "case": "appleMoveTime",
    "objc": "HKQuantityTypeIdentifierAppleMoveTime",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the user has spent performing activities that involve full-body movements during the specified day.",
    "aggregation": "cumulative",
    "aggregationEvidence": "For younger users, HealthKit’s activity summary can track move time instead of active energy burned: These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.5",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.5",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.5",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.4",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 64,
    "undocumented": false
  },
  {
    "case": "appleSleepingBreathingDisturbances",
    "objc": "HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mindfulness and Sleep",
    "abstract": "",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": true
  },
  {
    "case": "appleSleepingWristTemperature",
    "objc": "HKQuantityTypeIdentifierAppleSleepingWristTemperature",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Body measurements",
    "abstract": "A quantity sample type that records the wrist temperature during sleep.",
    "aggregation": "discrete",
    "aggregationEvidence": "Sleeping wrist temperature samples use temperature units (described in ) and measure discrete values (described in ).",
    "unitFamily": "temperature",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 238,
    "undocumented": false
  },
  {
    "case": "appleStandTime",
    "objc": "HKQuantityTypeIdentifierAppleStandTime",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the user has spent standing.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "appleWalkingSteadiness",
    "objc": "HKQuantityTypeIdentifierAppleWalkingSteadiness",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the steadiness of the user’s gait.",
    "aggregation": "discrete",
    "aggregationEvidence": "Samples that match the Walking Steadiness identifier use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 178,
    "undocumented": false
  },
  {
    "case": "atrialFibrillationBurden",
    "objc": "HKQuantityTypeIdentifierAtrialFibrillationBurden",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity type that measures an estimate of the percentage of time a person’s heart shows signs of atrial fibrillation (AFib) while wearing Apple Watch.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 118,
    "undocumented": false
  },
  {
    "case": "basalBodyTemperature",
    "objc": "HKQuantityTypeIdentifierBasalBodyTemperature",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Reproductive health",
    "abstract": "A quantity sample type that records the user’s basal body temperature.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use temperature units (described in ) and measure discrete values (described in ).",
    "unitFamily": "temperature",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 33,
    "undocumented": false
  },
  {
    "case": "basalEnergyBurned",
    "objc": "HKQuantityTypeIdentifierBasalEnergyBurned",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the resting energy burned by the user.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use energy units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "energy",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 66,
    "undocumented": false
  },
  {
    "case": "bloodAlcoholContent",
    "objc": "HKQuantityTypeIdentifierBloodAlcoholContent",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Alcohol consumption",
    "abstract": "A quantity sample type that measures the user’s blood alcohol content.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "bloodGlucose",
    "objc": "HKQuantityTypeIdentifierBloodGlucose",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the user’s blood glucose level.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use mass/volume units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "bloodPressureDiastolic",
    "objc": "HKQuantityTypeIdentifierBloodPressureDiastolic",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s diastolic blood pressure.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use pressure units (described in ) and measure discrete values (described in ).",
    "unitFamily": "pressure",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 32,
    "undocumented": false
  },
  {
    "case": "bloodPressureSystolic",
    "objc": "HKQuantityTypeIdentifierBloodPressureSystolic",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s systolic blood pressure.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use pressure units (described in ) and measure discrete values (described in ).",
    "unitFamily": "pressure",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 44,
    "undocumented": false
  },
  {
    "case": "bodyFatPercentage",
    "objc": "HKQuantityTypeIdentifierBodyFatPercentage",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s body fat percentage.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "bodyMass",
    "objc": "HKQuantityTypeIdentifierBodyMass",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s weight.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use mass units (described in ) and measure discrete values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "bodyMassIndex",
    "objc": "HKQuantityTypeIdentifierBodyMassIndex",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s body mass index.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count units (described in ) and measure discrete values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "bodyTemperature",
    "objc": "HKQuantityTypeIdentifierBodyTemperature",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s body temperature.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use temperature units (described in ) and measure discrete values (described in ).",
    "unitFamily": "temperature",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "crossCountrySkiingSpeed",
    "objc": "HKQuantityTypeIdentifierCrossCountrySkiingSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures how fast you are traveling while cross country skiing.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 32,
    "undocumented": false
  },
  {
    "case": "cyclingCadence",
    "objc": "HKQuantityTypeIdentifierCyclingCadence",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that represents the rate at which the user is pedaling.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use counts per minute units (described in ) and measure discrete values (described in ).",
    "unitFamily": "counts per minute",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 71,
    "undocumented": false
  },
  {
    "case": "cyclingFunctionalThresholdPower",
    "objc": "HKQuantityTypeIdentifierCyclingFunctionalThresholdPower",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the estimated maximum average power sustained while riding a bike for 60 minutes.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power units (described in ) and measure discrete values (described in ).",
    "unitFamily": "power",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 51,
    "undocumented": false
  },
  {
    "case": "cyclingPower",
    "objc": "HKQuantityTypeIdentifierCyclingPower",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the estimated power being used while riding a bike.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power units (described in ) and measure discrete values (described in ).",
    "unitFamily": "power",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 45,
    "undocumented": false
  },
  {
    "case": "cyclingSpeed",
    "objc": "HKQuantityTypeIdentifierCyclingSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures how fast you are traveling while riding a bike.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 47,
    "undocumented": false
  },
  {
    "case": "dietaryBiotin",
    "objc": "HKQuantityTypeIdentifierDietaryBiotin",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of biotin (vitamin B7) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryCaffeine",
    "objc": "HKQuantityTypeIdentifierDietaryCaffeine",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of caffeine consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryCalcium",
    "objc": "HKQuantityTypeIdentifierDietaryCalcium",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of calcium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryCarbohydrates",
    "objc": "HKQuantityTypeIdentifierDietaryCarbohydrates",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of carbohydrates consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryChloride",
    "objc": "HKQuantityTypeIdentifierDietaryChloride",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of chloride consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryCholesterol",
    "objc": "HKQuantityTypeIdentifierDietaryCholesterol",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of cholesterol consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryChromium",
    "objc": "HKQuantityTypeIdentifierDietaryChromium",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of chromium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryCopper",
    "objc": "HKQuantityTypeIdentifierDietaryCopper",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of copper consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryEnergyConsumed",
    "objc": "HKQuantityTypeIdentifierDietaryEnergyConsumed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of energy consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use energy units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "energy",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryFatMonounsaturated",
    "objc": "HKQuantityTypeIdentifierDietaryFatMonounsaturated",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of monounsaturated fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryFatPolyunsaturated",
    "objc": "HKQuantityTypeIdentifierDietaryFatPolyunsaturated",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of polyunsaturated fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryFatSaturated",
    "objc": "HKQuantityTypeIdentifierDietaryFatSaturated",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of saturated fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryFatTotal",
    "objc": "HKQuantityTypeIdentifierDietaryFatTotal",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the total amount of fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 23,
    "undocumented": false
  },
  {
    "case": "dietaryFiber",
    "objc": "HKQuantityTypeIdentifierDietaryFiber",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of fiber consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryFolate",
    "objc": "HKQuantityTypeIdentifierDietaryFolate",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of folate (folic acid) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryIodine",
    "objc": "HKQuantityTypeIdentifierDietaryIodine",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of iodine consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryIron",
    "objc": "HKQuantityTypeIdentifierDietaryIron",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of iron consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryMagnesium",
    "objc": "HKQuantityTypeIdentifierDietaryMagnesium",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of magnesium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryManganese",
    "objc": "HKQuantityTypeIdentifierDietaryManganese",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of manganese consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryMolybdenum",
    "objc": "HKQuantityTypeIdentifierDietaryMolybdenum",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of molybdenum consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryNiacin",
    "objc": "HKQuantityTypeIdentifierDietaryNiacin",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of niacin (vitamin B3) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryPantothenicAcid",
    "objc": "HKQuantityTypeIdentifierDietaryPantothenicAcid",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of pantothenic acid (vitamin B5) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryPhosphorus",
    "objc": "HKQuantityTypeIdentifierDietaryPhosphorus",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of phosphorus consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryPotassium",
    "objc": "HKQuantityTypeIdentifierDietaryPotassium",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of potassium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryProtein",
    "objc": "HKQuantityTypeIdentifierDietaryProtein",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of protein consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryRiboflavin",
    "objc": "HKQuantityTypeIdentifierDietaryRiboflavin",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of riboflavin (vitamin B2) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietarySelenium",
    "objc": "HKQuantityTypeIdentifierDietarySelenium",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of selenium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietarySodium",
    "objc": "HKQuantityTypeIdentifierDietarySodium",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of sodium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietarySugar",
    "objc": "HKQuantityTypeIdentifierDietarySugar",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of sugar consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryThiamin",
    "objc": "HKQuantityTypeIdentifierDietaryThiamin",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of thiamin (vitamin B1) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryVitaminA",
    "objc": "HKQuantityTypeIdentifierDietaryVitaminA",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin A consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryVitaminB12",
    "objc": "HKQuantityTypeIdentifierDietaryVitaminB12",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of cyanocobalamin (vitamin B12) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryVitaminB6",
    "objc": "HKQuantityTypeIdentifierDietaryVitaminB6",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of pyridoxine (vitamin B6) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryVitaminC",
    "objc": "HKQuantityTypeIdentifierDietaryVitaminC",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin C consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryVitaminD",
    "objc": "HKQuantityTypeIdentifierDietaryVitaminD",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin D consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryVitaminE",
    "objc": "HKQuantityTypeIdentifierDietaryVitaminE",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin E consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryVitaminK",
    "objc": "HKQuantityTypeIdentifierDietaryVitaminK",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin K consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryWater",
    "objc": "HKQuantityTypeIdentifierDietaryWater",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of water consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use volume units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "volume",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "dietaryZinc",
    "objc": "HKQuantityTypeIdentifierDietaryZinc",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of zinc consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "distanceCrossCountrySkiing",
    "objc": "HKQuantityTypeIdentifierDistanceCrossCountrySkiing",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by cross country skiing.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 30,
    "undocumented": false
  },
  {
    "case": "distanceCycling",
    "objc": "HKQuantityTypeIdentifierDistanceCycling",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by cycling.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 64,
    "undocumented": false
  },
  {
    "case": "distanceDownhillSnowSports",
    "objc": "HKQuantityTypeIdentifierDistanceDownhillSnowSports",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has traveled while skiing or snowboarding.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 28,
    "undocumented": false
  },
  {
    "case": "distancePaddleSports",
    "objc": "HKQuantityTypeIdentifierDistancePaddleSports",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by paddling sports.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 29,
    "undocumented": false
  },
  {
    "case": "distanceRowing",
    "objc": "HKQuantityTypeIdentifierDistanceRowing",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by rowing.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 28,
    "undocumented": false
  },
  {
    "case": "distanceSkatingSports",
    "objc": "HKQuantityTypeIdentifierDistanceSkatingSports",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by skating.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 28,
    "undocumented": false
  },
  {
    "case": "distanceSwimming",
    "objc": "HKQuantityTypeIdentifierDistanceSwimming",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved while swimming.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "distanceWalkingRunning",
    "objc": "HKQuantityTypeIdentifierDistanceWalkingRunning",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by walking or running.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 40,
    "undocumented": false
  },
  {
    "case": "distanceWheelchair",
    "objc": "HKQuantityTypeIdentifierDistanceWheelchair",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved using a wheelchair.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 41,
    "undocumented": false
  },
  {
    "case": "electrodermalActivity",
    "objc": "HKQuantityTypeIdentifierElectrodermalActivity",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures electrodermal activity.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use conductance units (described in ) and measure discrete values (described in ).",
    "unitFamily": "conductance",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 35,
    "undocumented": false
  },
  {
    "case": "environmentalAudioExposure",
    "objc": "HKQuantityTypeIdentifierEnvironmentalAudioExposure",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Hearing",
    "abstract": "A quantity sample type that measures audio exposure to sounds in the environment.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values of the equivalent continuous sound pressure level, described in .",
    "unitFamily": "sound pressure",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 39,
    "undocumented": false
  },
  {
    "case": "environmentalSoundReduction",
    "objc": "HKQuantityTypeIdentifierEnvironmentalSoundReduction",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Hearing",
    "abstract": "A quantity sample type that measures the difference in sound intensity when wearing headphones that lower environmental sound levels.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values of the equivalent continuous sound pressure level, described in .",
    "unitFamily": "sound pressure",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 34,
    "undocumented": false
  },
  {
    "case": "estimatedWorkoutEffortScore",
    "objc": "HKQuantityTypeIdentifierEstimatedWorkoutEffortScore",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": true
  },
  {
    "case": "flightsClimbed",
    "objc": "HKQuantityTypeIdentifierFlightsClimbed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number flights of stairs that the user has climbed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 34,
    "undocumented": false
  },
  {
    "case": "forcedExpiratoryVolume1",
    "objc": "HKQuantityTypeIdentifierForcedExpiratoryVolume1",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the amount of air that can be forcibly exhaled from the lungs during the first second of a forced exhalation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use volume units (described in ) and measure discrete values (described in ).",
    "unitFamily": "volume",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "forcedVitalCapacity",
    "objc": "HKQuantityTypeIdentifierForcedVitalCapacity",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the amount of air that can be forcibly exhaled from the lungs after taking the deepest breath possible.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use volume units (described in ) and measure discrete values (described in ).",
    "unitFamily": "volume",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "headphoneAudioExposure",
    "objc": "HKQuantityTypeIdentifierHeadphoneAudioExposure",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Hearing",
    "abstract": "A quantity sample type that measures audio exposure from headphones.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values of the equivalent continuous sound pressure level, described in .",
    "unitFamily": "sound pressure",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 41,
    "undocumented": false
  },
  {
    "case": "heartRate",
    "objc": "HKQuantityTypeIdentifierHeartRate",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s heart rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 185,
    "undocumented": false
  },
  {
    "case": "heartRateRecoveryOneMinute",
    "objc": "HKQuantityTypeIdentifierHeartRateRecoveryOneMinute",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample that records the reduction in heart rate from the peak exercise rate to the rate one minute after exercising ended.",
    "aggregation": "discrete",
    "aggregationEvidence": "Heart rate recovery samples use count units (described in ) and measure discrete values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 24,
    "undocumented": false
  },
  {
    "case": "heartRateVariabilitySDNN",
    "objc": "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the standard deviation of heartbeat intervals.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 68,
    "undocumented": false
  },
  {
    "case": "height",
    "objc": "HKQuantityTypeIdentifierHeight",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s height.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "inhalerUsage",
    "objc": "HKQuantityTypeIdentifierInhalerUsage",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the number of puffs the user takes from their inhaler.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "insulinDelivery",
    "objc": "HKQuantityTypeIdentifierInsulinDelivery",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample that measures the amount of insulin delivered.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use international units (IU) (described in ) and measure cumulative values (described in ).",
    "unitFamily": "international",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "leanBodyMass",
    "objc": "HKQuantityTypeIdentifierLeanBodyMass",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s lean body mass.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use mass units (described in ) and measure discrete values (described in ).",
    "unitFamily": "mass",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "nikeFuel",
    "objc": "HKQuantityTypeIdentifierNikeFuel",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of NikeFuel points the user has earned.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "numberOfAlcoholicBeverages",
    "objc": "HKQuantityTypeIdentifierNumberOfAlcoholicBeverages",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Alcohol consumption",
    "abstract": "A quantity sample type that measures the number of standard alcoholic drinks that the user has consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "The samples use count units (described in ) to measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 58,
    "undocumented": false
  },
  {
    "case": "numberOfTimesFallen",
    "objc": "HKQuantityTypeIdentifierNumberOfTimesFallen",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the number of times the user fell.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 142,
    "undocumented": false
  },
  {
    "case": "oxygenSaturation",
    "objc": "HKQuantityTypeIdentifierOxygenSaturation",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s oxygen saturation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 26,
    "undocumented": false
  },
  {
    "case": "paddleSportsSpeed",
    "objc": "HKQuantityTypeIdentifierPaddleSportsSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by paddling sports.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "distance per time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 31,
    "undocumented": false
  },
  {
    "case": "peakExpiratoryFlowRate",
    "objc": "HKQuantityTypeIdentifierPeakExpiratoryFlowRate",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the user’s maximum flow rate generated during a forceful exhalation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use volume/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "peripheralPerfusionIndex",
    "objc": "HKQuantityTypeIdentifierPeripheralPerfusionIndex",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the user’s peripheral perfusion index.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "physicalEffort",
    "objc": "HKQuantityTypeIdentifierPhysicalEffort",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the estimated amount of energy being used to perform a task excluding other factors such as temperature, altitude, or heart rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power in Metabolic Equivalent of Task (METs) units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 31,
    "undocumented": false
  },
  {
    "case": "pushCount",
    "objc": "HKQuantityTypeIdentifierPushCount",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of pushes that the user has performed while using a wheelchair.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "respiratoryRate",
    "objc": "HKQuantityTypeIdentifierRespiratoryRate",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s respiratory rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 23,
    "undocumented": false
  },
  {
    "case": "restingHeartRate",
    "objc": "HKQuantityTypeIdentifierRestingHeartRate",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s resting heart rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 176,
    "undocumented": false
  },
  {
    "case": "rowingSpeed",
    "objc": "HKQuantityTypeIdentifierRowingSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures how fast the rower is moving.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 31,
    "undocumented": false
  },
  {
    "case": "runningGroundContactTime",
    "objc": "HKQuantityTypeIdentifierRunningGroundContactTime",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the runner’s foot is in contact with the ground while running.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 49,
    "undocumented": false
  },
  {
    "case": "runningPower",
    "objc": "HKQuantityTypeIdentifierRunningPower",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the rate of work required for the runner to maintain their speed.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power units (described in ) and measure discrete values (described in ).",
    "unitFamily": "power",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 49,
    "undocumented": false
  },
  {
    "case": "runningSpeed",
    "objc": "HKQuantityTypeIdentifierRunningSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the runner’s speed.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 45,
    "undocumented": false
  },
  {
    "case": "runningStrideLength",
    "objc": "HKQuantityTypeIdentifierRunningStrideLength",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance covered by a single step while running.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 49,
    "undocumented": false
  },
  {
    "case": "runningVerticalOscillation",
    "objc": "HKQuantityTypeIdentifierRunningVerticalOscillation",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type measuring pelvis vertical range of motion during a single running stride.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 48,
    "undocumented": false
  },
  {
    "case": "sixMinuteWalkTestDistance",
    "objc": "HKQuantityTypeIdentifierSixMinuteWalkTestDistance",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type that stores the distance a user can walk during a six-minute walk test.",
    "aggregation": "discrete",
    "aggregationEvidence": "samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 278,
    "undocumented": false
  },
  {
    "case": "stairAscentSpeed",
    "objc": "HKQuantityTypeIdentifierStairAscentSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type measuring the user’s speed while climbing a flight of stairs.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 137,
    "undocumented": false
  },
  {
    "case": "stairDescentSpeed",
    "objc": "HKQuantityTypeIdentifierStairDescentSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type measuring the user’s speed while descending a flight of stairs.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 138,
    "undocumented": false
  },
  {
    "case": "stepCount",
    "objc": "HKQuantityTypeIdentifierStepCount",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of steps the user has taken.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 39,
    "undocumented": false
  },
  {
    "case": "swimmingStrokeCount",
    "objc": "HKQuantityTypeIdentifierSwimmingStrokeCount",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of strokes performed while swimming.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "timeInDaylight",
    "objc": "HKQuantityTypeIdentifierTimeInDaylight",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "UV exposure",
    "abstract": "A quantity sample type that measures amount of time the user spent in daylight.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "underwaterDepth",
    "objc": "HKQuantityTypeIdentifierUnderwaterDepth",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Diving",
    "abstract": "A quantity sample that records a person’s depth underwater.",
    "aggregation": "discrete",
    "aggregationEvidence": "Underwater depth samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 40,
    "undocumented": false
  },
  {
    "case": "uvExposure",
    "objc": "HKQuantityTypeIdentifierUVExposure",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "UV exposure",
    "abstract": "A quantity sample type that measures the user’s exposure to UV radiation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count units (described in ) and measure discrete values (described in ).",
    "unitFamily": "count",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 32,
    "undocumented": false
  },
  {
    "case": "vo2Max",
    "objc": "HKQuantityTypeIdentifierVO2Max",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "A quantity sample that measures the maximal oxygen consumption during exercise.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 323,
    "undocumented": false
  },
  {
    "case": "waistCircumference",
    "objc": "HKQuantityTypeIdentifierWaistCircumference",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s waist circumference.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 15,
    "undocumented": false
  },
  {
    "case": "walkingAsymmetryPercentage",
    "objc": "HKQuantityTypeIdentifierWalkingAsymmetryPercentage",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the percentage of steps in which one foot moves at a different speed than the other when walking on flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 126,
    "undocumented": false
  },
  {
    "case": "walkingDoubleSupportPercentage",
    "objc": "HKQuantityTypeIdentifierWalkingDoubleSupportPercentage",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the percentage of time when both of the user’s feet touch the ground while walking steadily over flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 166,
    "undocumented": false
  },
  {
    "case": "walkingHeartRateAverage",
    "objc": "HKQuantityTypeIdentifierWalkingHeartRateAverage",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s heart rate while walking.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 107,
    "undocumented": false
  },
  {
    "case": "walkingSpeed",
    "objc": "HKQuantityTypeIdentifierWalkingSpeed",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the user’s average speed when walking steadily over flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 137,
    "undocumented": false
  },
  {
    "case": "walkingStepLength",
    "objc": "HKQuantityTypeIdentifierWalkingStepLength",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the average length of the user’s step when walking steadily over flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 123,
    "undocumented": false
  },
  {
    "case": "waterTemperature",
    "objc": "HKQuantityTypeIdentifierWaterTemperature",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Diving",
    "abstract": "A quantity sample that records the water temperature.",
    "aggregation": "discrete",
    "aggregationEvidence": "Water temperature samples use temperature units (see ) and measure discrete values (see ).",
    "unitFamily": "temperature",
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 41,
    "undocumented": false
  },
  {
    "case": "workoutEffortScore",
    "objc": "HKQuantityTypeIdentifierWorkoutEffortScore",
    "family": "quantity",
    "familyType": "HKQuantityTypeIdentifier",
    "group": "Activity",
    "abstract": "",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": true
  },
  {
    "case": "appleStandHour",
    "objc": "HKCategoryTypeIdentifierAppleStandHour",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Activity",
    "abstract": "A category sample type that counts the number of hours in the day during which the user has stood and moved for at least one minute per hour.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueAppleStandHour",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 73,
    "undocumented": false
  },
  {
    "case": "appleWalkingSteadinessEvent",
    "objc": "HKCategoryTypeIdentifierAppleWalkingSteadinessEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Mobility",
    "abstract": "A category sample type that records an incident where the user showed a reduced score for their gait’s steadiness.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueAppleWalkingSteadinessEvent",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 69,
    "undocumented": false
  },
  {
    "case": "audioExposureEvent",
    "objc": "HKCategoryTypeIdentifierAudioExposureEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Hearing",
    "abstract": "A category sample type for audio exposure events.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueAudioExposureEvent",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": null,
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 6,
    "undocumented": false
  },
  {
    "case": "bleedingAfterMenopause",
    "objc": "HKCategoryTypeIdentifierBleedingAfterMenopause",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "An identifier for samples that record bleeding after menopause.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "iPadOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "macOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "visionOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "watchOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      }
    ],
    "deprecated": false,
    "discussionWords": 50,
    "undocumented": false
  },
  {
    "case": "cervicalMucusQuality",
    "objc": "HKCategoryTypeIdentifierCervicalMucusQuality",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample type that records the quality of the user’s cervical mucus.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueCervicalMucusQuality",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 7,
    "undocumented": false
  },
  {
    "case": "contraceptive",
    "objc": "HKCategoryTypeIdentifierContraceptive",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample type that records the use of contraceptives.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueContraceptive",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 9,
    "undocumented": false
  },
  {
    "case": "environmentalAudioExposureEvent",
    "objc": "HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Hearing",
    "abstract": "A category sample type that records exposure to potentially damaging sounds from the environment.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueEnvironmentalAudioExposureEvent",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 120,
    "undocumented": false
  },
  {
    "case": "handwashingEvent",
    "objc": "HKCategoryTypeIdentifierHandwashingEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Self Care",
    "abstract": "A category sample type for handwashing events.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 60,
    "undocumented": false
  },
  {
    "case": "headphoneAudioExposureEvent",
    "objc": "HKCategoryTypeIdentifierHeadphoneAudioExposureEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Hearing",
    "abstract": "A category sample type that records exposure to potentially damaging sounds from headphones.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueHeadphoneAudioExposureEvent",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.1",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 68,
    "undocumented": false
  },
  {
    "case": "highHeartRateEvent",
    "objc": "HKCategoryTypeIdentifierHighHeartRateEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Vital Signs",
    "abstract": "A category sample type for high heart rate events.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "12.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "12.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "5.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 91,
    "undocumented": false
  },
  {
    "case": "hypertensionEvent",
    "objc": "HKCategoryTypeIdentifierHypertensionEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Type Properties - generated",
    "abstract": "",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "26.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "26.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "26.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "26.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "26.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "26.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": true
  },
  {
    "case": "infrequentMenstrualCycles",
    "objc": "HKCategoryTypeIdentifierInfrequentMenstrualCycles",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample that indicates an infrequent menstrual cycle.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 73,
    "undocumented": false
  },
  {
    "case": "intermenstrualBleeding",
    "objc": "HKCategoryTypeIdentifierIntermenstrualBleeding",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample type that records spotting outside the normal menstruation period.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 6,
    "undocumented": false
  },
  {
    "case": "irregularHeartRhythmEvent",
    "objc": "HKCategoryTypeIdentifierIrregularHeartRhythmEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Vital Signs",
    "abstract": "A category sample type for irregular heart rhythm events.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "12.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "12.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "5.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 85,
    "undocumented": false
  },
  {
    "case": "irregularMenstrualCycles",
    "objc": "HKCategoryTypeIdentifierIrregularMenstrualCycles",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample that indicates an irregular menstrual cycle.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 73,
    "undocumented": false
  },
  {
    "case": "lactation",
    "objc": "HKCategoryTypeIdentifierLactation",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category type that records lactation.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 8,
    "undocumented": false
  },
  {
    "case": "lowCardioFitnessEvent",
    "objc": "HKCategoryTypeIdentifierLowCardioFitnessEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Activity",
    "abstract": "An event that indicates the user’s VO2 max values consistently fall below a particular aerobic fitness threshold.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueLowCardioFitnessEvent",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 159,
    "undocumented": false
  },
  {
    "case": "lowHeartRateEvent",
    "objc": "HKCategoryTypeIdentifierLowHeartRateEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Vital Signs",
    "abstract": "A category sample type for low heart rate events.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "12.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "12.2",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "5.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 91,
    "undocumented": false
  },
  {
    "case": "menopausalState",
    "objc": "HKCategoryTypeIdentifierMenopausalState",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "An identifier for samples that record a person’s menopausal state.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueMenopausalState",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "iPadOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "macOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "visionOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      },
      {
        "name": "watchOS",
        "introducedAt": "27.0",
        "deprecated": false,
        "beta": true
      }
    ],
    "deprecated": false,
    "discussionWords": 93,
    "undocumented": false
  },
  {
    "case": "menstrualFlow",
    "objc": "HKCategoryTypeIdentifierMenstrualFlow",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample type that records menstrual cycles.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueMenstrualFlow",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 128,
    "undocumented": false
  },
  {
    "case": "mindfulSession",
    "objc": "HKCategoryTypeIdentifierMindfulSession",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Mindfulness and Sleep",
    "abstract": "A category sample type for recording a mindful session.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 6,
    "undocumented": false
  },
  {
    "case": "ovulationTestResult",
    "objc": "HKCategoryTypeIdentifierOvulationTestResult",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample type that records the result of an ovulation home test.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueOvulationTestResult",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 7,
    "undocumented": false
  },
  {
    "case": "persistentIntermenstrualBleeding",
    "objc": "HKCategoryTypeIdentifierPersistentIntermenstrualBleeding",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample that indicates persistent intermenstrual bleeding.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 73,
    "undocumented": false
  },
  {
    "case": "pregnancy",
    "objc": "HKCategoryTypeIdentifierPregnancy",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category type that records pregnancy.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.3",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.2",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 8,
    "undocumented": false
  },
  {
    "case": "pregnancyTestResult",
    "objc": "HKCategoryTypeIdentifierPregnancyTestResult",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category type that represents the results from a home pregnancy test.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValuePregnancyTestResult",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 34,
    "undocumented": false
  },
  {
    "case": "progesteroneTestResult",
    "objc": "HKCategoryTypeIdentifierProgesteroneTestResult",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category type that represents the results from a home progesterone test.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueProgesteroneTestResult",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "15.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 35,
    "undocumented": false
  },
  {
    "case": "prolongedMenstrualPeriods",
    "objc": "HKCategoryTypeIdentifierProlongedMenstrualPeriods",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample that indicates a prolonged menstrual cycle.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 73,
    "undocumented": false
  },
  {
    "case": "sexualActivity",
    "objc": "HKCategoryTypeIdentifierSexualActivity",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Reproductive Health",
    "abstract": "A category sample type that records sexual activity.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 11,
    "undocumented": false
  },
  {
    "case": "sleepAnalysis",
    "objc": "HKCategoryTypeIdentifierSleepAnalysis",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Mindfulness and Sleep",
    "abstract": "A category sample type for sleep analysis information.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValueSleepAnalysis",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 29,
    "undocumented": false
  },
  {
    "case": "toothbrushingEvent",
    "objc": "HKCategoryTypeIdentifierToothbrushingEvent",
    "family": "category",
    "familyType": "HKCategoryTypeIdentifier",
    "group": "Self Care",
    "abstract": "A category sample type for toothbrushing events.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": "HKCategoryValue",
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 7,
    "undocumented": false
  },
  {
    "case": "activityMoveMode",
    "objc": "HKCharacteristicTypeIdentifierActivityMoveMode",
    "family": "characteristic",
    "familyType": "HKCharacteristicTypeIdentifier",
    "group": "Characteristic Types",
    "abstract": "A characteristic identifier for the user’s activity mode.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "biologicalSex",
    "objc": "HKCharacteristicTypeIdentifierBiologicalSex",
    "family": "characteristic",
    "familyType": "HKCharacteristicTypeIdentifier",
    "group": "Characteristic Types",
    "abstract": "A characteristic type identifier for the user’s sex.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 7,
    "undocumented": false
  },
  {
    "case": "bloodType",
    "objc": "HKCharacteristicTypeIdentifierBloodType",
    "family": "characteristic",
    "familyType": "HKCharacteristicTypeIdentifier",
    "group": "Characteristic Types",
    "abstract": "A characteristic type identifier for the user’s blood type.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 7,
    "undocumented": false
  },
  {
    "case": "dateOfBirth",
    "objc": "HKCharacteristicTypeIdentifierDateOfBirth",
    "family": "characteristic",
    "familyType": "HKCharacteristicTypeIdentifier",
    "group": "Characteristic Types",
    "abstract": "A characteristic type identifier for the user’s date of birth.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "fitzpatrickSkinType",
    "objc": "HKCharacteristicTypeIdentifierFitzpatrickSkinType",
    "family": "characteristic",
    "familyType": "HKCharacteristicTypeIdentifier",
    "group": "Characteristic Types",
    "abstract": "A characteristic type identifier for the user’s skin type.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 7,
    "undocumented": false
  },
  {
    "case": "wheelchairUse",
    "objc": "HKCharacteristicTypeIdentifierWheelchairUse",
    "family": "characteristic",
    "familyType": "HKCharacteristicTypeIdentifier",
    "group": "Characteristic Types",
    "abstract": "A characteristic identifier for the user’s use of a wheelchair.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "americanFootball",
    "objc": "HKWorkoutActivityTypeAmericanFootball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing American football.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "archery",
    "objc": "HKWorkoutActivityTypeArchery",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Individual sports",
    "abstract": "The constant for shooting archery.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "australianFootball",
    "objc": "HKWorkoutActivityTypeAustralianFootball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing Australian football.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "badminton",
    "objc": "HKWorkoutActivityTypeBadminton",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Racket sports",
    "abstract": "The constant for playing badminton.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "barre",
    "objc": "HKWorkoutActivityTypeBarre",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Studio activities",
    "abstract": "The constant for barre workout.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "baseball",
    "objc": "HKWorkoutActivityTypeBaseball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing baseball.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "basketball",
    "objc": "HKWorkoutActivityTypeBasketball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing basketball.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "bowling",
    "objc": "HKWorkoutActivityTypeBowling",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Individual sports",
    "abstract": "The constant for bowling.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "boxing",
    "objc": "HKWorkoutActivityTypeBoxing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Martial arts",
    "abstract": "The constant for boxing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "cardioDance",
    "objc": "HKWorkoutActivityTypeCardioDance",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Studio activities",
    "abstract": "The constant for cardiovascular dance workouts.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "climbing",
    "objc": "HKWorkoutActivityTypeClimbing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Outdoor activities",
    "abstract": "The constant for climbing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "cooldown",
    "objc": "HKWorkoutActivityTypeCooldown",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for low intensity stretching and mobility exercises following a more vigorous workout.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "coreTraining",
    "objc": "HKWorkoutActivityTypeCoreTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for core training.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "cricket",
    "objc": "HKWorkoutActivityTypeCricket",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing cricket.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "crossCountrySkiing",
    "objc": "HKWorkoutActivityTypeCrossCountrySkiing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Snow and ice sports",
    "abstract": "The constant for cross country skiing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "crossTraining",
    "objc": "HKWorkoutActivityTypeCrossTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for exercise that includes any mixture of cardio, strength, and/or flexibility training.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "curling",
    "objc": "HKWorkoutActivityTypeCurling",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Snow and ice sports",
    "abstract": "The constant for curling.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "cycling",
    "objc": "HKWorkoutActivityTypeCycling",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for cycling.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "dance",
    "objc": "HKWorkoutActivityTypeDance",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Deprecated activity types",
    "abstract": "The constant for dancing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "danceInspiredTraining",
    "objc": "HKWorkoutActivityTypeDanceInspiredTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Deprecated activity types",
    "abstract": "The constant for workouts inspired by dance, including Pilates, Barre, and Feldenkrais.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "discSports",
    "objc": "HKWorkoutActivityTypeDiscSports",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing disc sports such as Ultimate and Disc Golf.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "downhillSkiing",
    "objc": "HKWorkoutActivityTypeDownhillSkiing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Snow and ice sports",
    "abstract": "The constant for downhill skiing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "elliptical",
    "objc": "HKWorkoutActivityTypeElliptical",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for workouts on an elliptical machine.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "equestrianSports",
    "objc": "HKWorkoutActivityTypeEquestrianSports",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Outdoor activities",
    "abstract": "The constant for activities that involve riding a horse, including polo, horse racing, and horse riding.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "fencing",
    "objc": "HKWorkoutActivityTypeFencing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Individual sports",
    "abstract": "The constant for fencing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "fishing",
    "objc": "HKWorkoutActivityTypeFishing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Outdoor activities",
    "abstract": "The constant for fishing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "fitnessGaming",
    "objc": "HKWorkoutActivityTypeFitnessGaming",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for playing fitness-based video games.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "6.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "flexibility",
    "objc": "HKWorkoutActivityTypeFlexibility",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for a flexibility workout.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "functionalStrengthTraining",
    "objc": "HKWorkoutActivityTypeFunctionalStrengthTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for strength training, primarily with free weights and body weight.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "golf",
    "objc": "HKWorkoutActivityTypeGolf",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Outdoor activities",
    "abstract": "The constant for playing golf.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "gymnastics",
    "objc": "HKWorkoutActivityTypeGymnastics",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Individual sports",
    "abstract": "Performing gymnastics.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "handball",
    "objc": "HKWorkoutActivityTypeHandball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing handball.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "handCycling",
    "objc": "HKWorkoutActivityTypeHandCycling",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for hand cycling.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "highIntensityIntervalTraining",
    "objc": "HKWorkoutActivityTypeHighIntensityIntervalTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for high intensity interval training.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "hiking",
    "objc": "HKWorkoutActivityTypeHiking",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Outdoor activities",
    "abstract": "The constant for hiking.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "hockey",
    "objc": "HKWorkoutActivityTypeHockey",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing hockey, including ice hockey, field hockey, and related sports.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 38,
    "undocumented": false
  },
  {
    "case": "hunting",
    "objc": "HKWorkoutActivityTypeHunting",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Outdoor activities",
    "abstract": "The constant for hunting.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "jumpRope",
    "objc": "HKWorkoutActivityTypeJumpRope",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for jumping rope.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "kickboxing",
    "objc": "HKWorkoutActivityTypeKickboxing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Martial arts",
    "abstract": "The constant for kickboxing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "lacrosse",
    "objc": "HKWorkoutActivityTypeLacrosse",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing lacrosse.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "martialArts",
    "objc": "HKWorkoutActivityTypeMartialArts",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Martial arts",
    "abstract": "The constant for practicing martial arts.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "mindAndBody",
    "objc": "HKWorkoutActivityTypeMindAndBody",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Studio activities",
    "abstract": "The constant for performing activities like walking meditation, Gyrotonic exercise, and Qigong.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "mixedCardio",
    "objc": "HKWorkoutActivityTypeMixedCardio",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for workouts that mix a variety of cardio exercise machines or modalities.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "mixedMetabolicCardioTraining",
    "objc": "HKWorkoutActivityTypeMixedMetabolicCardioTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Deprecated activity types",
    "abstract": "The constant for performing any mix of cardio-focused exercises.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "other",
    "objc": "HKWorkoutActivityTypeOther",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Other activities",
    "abstract": "The constant for a workout that does not match any of the other workout activity types.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 29,
    "undocumented": false
  },
  {
    "case": "paddleSports",
    "objc": "HKWorkoutActivityTypePaddleSports",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for canoeing, kayaking, paddling an outrigger, paddling a stand-up paddle board, and related sports.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "pickleball",
    "objc": "HKWorkoutActivityTypePickleball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Racket sports",
    "abstract": "The constant for playing pickleball.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "pilates",
    "objc": "HKWorkoutActivityTypePilates",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Studio activities",
    "abstract": "The constant for a pilates workout.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "play",
    "objc": "HKWorkoutActivityTypePlay",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Outdoor activities",
    "abstract": "The constant for play-based activities like tag, dodgeball, hopscotch, tetherball, and playing on a jungle gym.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "preparationAndRecovery",
    "objc": "HKWorkoutActivityTypePreparationAndRecovery",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for warm-up and therapeutic activities like foam rolling and stretching.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "racquetball",
    "objc": "HKWorkoutActivityTypeRacquetball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Racket sports",
    "abstract": "The constant for playing racquetball.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "rowing",
    "objc": "HKWorkoutActivityTypeRowing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for rowing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "rugby",
    "objc": "HKWorkoutActivityTypeRugby",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing rugby.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "running",
    "objc": "HKWorkoutActivityTypeRunning",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for running and jogging.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "sailing",
    "objc": "HKWorkoutActivityTypeSailing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for sailing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "skatingSports",
    "objc": "HKWorkoutActivityTypeSkatingSports",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Snow and ice sports",
    "abstract": "The constant for skating activities, including ice skating, speed skating, inline skating, and skateboarding.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 38,
    "undocumented": false
  },
  {
    "case": "snowboarding",
    "objc": "HKWorkoutActivityTypeSnowboarding",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Snow and ice sports",
    "abstract": "The constant for snowboarding.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 27,
    "undocumented": false
  },
  {
    "case": "snowSports",
    "objc": "HKWorkoutActivityTypeSnowSports",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Snow and ice sports",
    "abstract": "The constant for a variety of snow sports, including sledding, snowmobiling, or building a snowman.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "soccer",
    "objc": "HKWorkoutActivityTypeSoccer",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing soccer.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 38,
    "undocumented": false
  },
  {
    "case": "socialDance",
    "objc": "HKWorkoutActivityTypeSocialDance",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Studio activities",
    "abstract": "The constant for dancing with a partner or partners, such as swing, salsa, or folk dances.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "softball",
    "objc": "HKWorkoutActivityTypeSoftball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing softball.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "squash",
    "objc": "HKWorkoutActivityTypeSquash",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Racket sports",
    "abstract": "The constant for playing squash.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "stairClimbing",
    "objc": "HKWorkoutActivityTypeStairClimbing",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for workouts using a stair climbing machine.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "stairs",
    "objc": "HKWorkoutActivityTypeStairs",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for running, walking, or other drills using stairs (for example, in a stadium or inside a multilevel building).",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "stepTraining",
    "objc": "HKWorkoutActivityTypeStepTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for training using a step bench.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "surfingSports",
    "objc": "HKWorkoutActivityTypeSurfingSports",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for a variety of surf sports, including surfing, kite surfing, and wind surfing.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "swimBikeRun",
    "objc": "HKWorkoutActivityTypeSwimBikeRun",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Multisport activities",
    "abstract": "The constant for multisport activities like triathlons.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 41,
    "undocumented": false
  },
  {
    "case": "swimming",
    "objc": "HKWorkoutActivityTypeSwimming",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for swimming.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 45,
    "undocumented": false
  },
  {
    "case": "tableTennis",
    "objc": "HKWorkoutActivityTypeTableTennis",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Racket sports",
    "abstract": "The constant for playing table tennis.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "taiChi",
    "objc": "HKWorkoutActivityTypeTaiChi",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Martial arts",
    "abstract": "The constant for tai chi.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "4.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "tennis",
    "objc": "HKWorkoutActivityTypeTennis",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Racket sports",
    "abstract": "The constant for playing tennis.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "trackAndField",
    "objc": "HKWorkoutActivityTypeTrackAndField",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Individual sports",
    "abstract": "Participating in track and field events, including shot put, javelin, pole vaulting, and related sports.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "traditionalStrengthTraining",
    "objc": "HKWorkoutActivityTypeTraditionalStrengthTraining",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for strength training exercises primarily using machines or free weights.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "transition",
    "objc": "HKWorkoutActivityTypeTransition",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Multisport activities",
    "abstract": "A constant for the transition time between activities in a multisport workout.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "16.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "underwaterDiving",
    "objc": "HKWorkoutActivityTypeUnderwaterDiving",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for underwater diving.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "volleyball",
    "objc": "HKWorkoutActivityTypeVolleyball",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Team sports",
    "abstract": "The constant for playing volleyball.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "walking",
    "objc": "HKWorkoutActivityTypeWalking",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for walking.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "waterFitness",
    "objc": "HKWorkoutActivityTypeWaterFitness",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for aerobic exercise performed in shallow water.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "waterPolo",
    "objc": "HKWorkoutActivityTypeWaterPolo",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for playing water polo.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "waterSports",
    "objc": "HKWorkoutActivityTypeWaterSports",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Water activities",
    "abstract": "The constant for a variety of water sports, including water skiing, wake boarding, and related activities.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "wheelchairRunPace",
    "objc": "HKWorkoutActivityTypeWheelchairRunPace",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for wheelchair workout at running pace.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "wheelchairWalkPace",
    "objc": "HKWorkoutActivityTypeWheelchairWalkPace",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Exercise and fitness",
    "abstract": "The constant for a wheelchair workout at walking pace.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "3.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  },
  {
    "case": "wrestling",
    "objc": "HKWorkoutActivityTypeWrestling",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Martial arts",
    "abstract": "The constant for wrestling.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 0,
    "undocumented": false
  },
  {
    "case": "yoga",
    "objc": "HKWorkoutActivityTypeYoga",
    "family": "workoutActivity",
    "familyType": "HKWorkoutActivityType",
    "group": "Studio activities",
    "abstract": "The constant for practicing yoga.",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
    "valueEnum": null,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "deprecated": false,
    "discussionWords": 16,
    "undocumented": false
  }
];

/** Apple's grouping, in Apple's order, with our merges applied downstream. */
export const HK_GROUPS: string[] = [
  "Activity",
  "Mindfulness and Sleep",
  "Body measurements",
  "Mobility",
  "Vital signs",
  "Reproductive health",
  "Alcohol consumption",
  "Lab and test results",
  "Nutrition",
  "Hearing",
  "UV exposure",
  "Diving",
  "Reproductive Health",
  "Self Care",
  "Vital Signs",
  "Type Properties - generated",
  "Characteristic Types",
  "Team sports",
  "Individual sports",
  "Racket sports",
  "Studio activities",
  "Martial arts",
  "Outdoor activities",
  "Exercise and fitness",
  "Snow and ice sports",
  "Deprecated activity types",
  "Other activities",
  "Water activities",
  "Multisport activities"
];

export type HkError = {
  /** Swift case on HKError.Code, e.g. "errorAuthorizationDenied". */
  case: string;
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Apple's discussion, where it offers one. */
  discussion: string | null;
  /** True when Apple ships the case with a declaration and nothing else. */
  undocumented: boolean;
  platforms: HkPlatform[];
  docUrl: string;
};

/**
 * Every HKError.Code case Apple documents.
 *
 * Apple does NOT publish the numeric raw values in its documentation, and the
 * order cases are listed in is not declaration order — so this deliberately
 * carries no numbers. A developer holding "Code=5" cannot be matched to a
 * name from anything Apple states publicly, and guessing would be worse than
 * saying so.
 */
export const HK_ERRORS: HkError[] = [
  {
    "case": "noError",
    "group": "Accessing errors",
    "abstract": "No error occurred.",
    "discussion": null,
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.1",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/noerror"
  },
  {
    "case": "errorHealthDataUnavailable",
    "group": "Accessing errors",
    "abstract": "The user accessed HealthKit on an unsupported device.",
    "discussion": "Because iOS apps can run on devices that don’t support HealthKit (for example, on an iPad), always verify that the current device supports HealthKit by calling  before calling any other HealthKit methods. If HealthKit isn’t available on the device, other HealthKit methods fail with an  error.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorhealthdataunavailable"
  },
  {
    "case": "errorHealthDataRestricted",
    "group": "Accessing errors",
    "abstract": "A Mobile Device Management (MDM) profile restricts the use of HealthKit on this device.",
    "discussion": "Because an MDM profile can disable HealthKit on a managed device, always verify that the current device supports HealthKit by calling  before calling any other HealthKit methods. If HealthKit is restricted (for example, in an enterprise environment), the methods fail with an  error.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorhealthdatarestricted"
  },
  {
    "case": "errorInvalidArgument",
    "group": "Accessing errors",
    "abstract": "The app passed an invalid argument to the HealthKit API.",
    "discussion": null,
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorinvalidargument"
  },
  {
    "case": "errorAuthorizationDenied",
    "group": "Accessing errors",
    "abstract": "The user hasn’t given the app permission to save data.",
    "discussion": "This error occurs only when your app attempts to save data. If your app isn’t authorized to query data, it receives only the data that the app has saved into HealthKit. For more information, see .",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorauthorizationdenied"
  },
  {
    "case": "errorAuthorizationNotDetermined",
    "group": "Accessing errors",
    "abstract": "The app hasn’t yet asked the user for the authorization required to complete the task.",
    "discussion": "This error occurs when your app doesn’t request proper authorization before calling any other HealthKit methods. For more information on setting up HealthKit, see `HealthKit`.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorauthorizationnotdetermined"
  },
  {
    "case": "errorRequiredAuthorizationDenied",
    "group": "Accessing errors",
    "abstract": "The user hasn’t granted the application authorization to access all the required clinical record types.",
    "discussion": "You can specify required clinical record types using the  `Info.plist` key.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "12.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "12.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "5.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorrequiredauthorizationdenied"
  },
  {
    "case": "errorDatabaseInaccessible",
    "group": "Accessing errors",
    "abstract": "The HealthKit data is unavailable because it’s protected and the device is locked.",
    "discussion": "This error occurs when your app queries for HealthKit data while the device is locked. You can, however, still save data. This data is saved into a temporary file, which is merged with HealthKit’s data when the user unlocks their device.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errordatabaseinaccessible"
  },
  {
    "case": "errorUserCanceled",
    "group": "Accessing errors",
    "abstract": "The user canceled the operation.",
    "discussion": null,
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorusercanceled"
  },
  {
    "case": "errorAnotherWorkoutSessionStarted",
    "group": "Accessing errors",
    "abstract": "Another app started a workout session.",
    "discussion": "This error occurs whenever a second workout session is started. Apple Watch only runs one workout session at a time. If the user begins a second workout session in a different app, the original session receives this error message and then ends. The second session then starts.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/erroranotherworkoutsessionstarted"
  },
  {
    "case": "errorUserExitedWorkoutSession",
    "group": "Accessing errors",
    "abstract": "The user exited your application while a workout session was running.",
    "discussion": "Workout sessions end when the app goes into the background.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "9.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/erroruserexitedworkoutsession"
  },
  {
    "case": "errorNoData",
    "group": "Accessing errors",
    "abstract": "Data is unavailable for the requested query and predicate.",
    "discussion": "This error indicates that no data exists that corresponds to a particular query, so the system can’t calculate the query’s result.  queries return this error when HealthKit can’t return the data needed to calculate the statistics.",
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "7.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errornodata"
  },
  {
    "case": "errorBackgroundWorkoutSessionNotAllowed",
    "group": "Type Properties",
    "abstract": "",
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorbackgroundworkoutsessionnotallowed"
  },
  {
    "case": "errorDataSizeExceeded",
    "group": "Type Properties",
    "abstract": "",
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errordatasizeexceeded"
  },
  {
    "case": "errorNotPermissibleForGuestUserMode",
    "group": "Type Properties",
    "abstract": "The app attempted to write HealthKit data while in a Guest User session in visionOS.",
    "discussion": null,
    "undocumented": false,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "18.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "11.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errornotpermissibleforguestusermode"
  },
  {
    "case": "errorWorkoutActivityNotAllowed",
    "group": "Type Properties",
    "abstract": "",
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "17.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "14.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "10.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/errorworkoutactivitynotallowed"
  },
  {
    "case": "unknownError",
    "group": "Type Properties",
    "abstract": "",
    "discussion": null,
    "undocumented": true,
    "platforms": [
      {
        "name": "iOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "iPadOS",
        "introducedAt": "8.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "Mac Catalyst",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "macOS",
        "introducedAt": "13.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "visionOS",
        "introducedAt": "1.0",
        "deprecated": false,
        "beta": false
      },
      {
        "name": "watchOS",
        "introducedAt": "2.0",
        "deprecated": false,
        "beta": false
      }
    ],
    "docUrl": "https://developer.apple.com/documentation/healthkit/hkerror/unknownerror"
  }
];

/** Family key → the Apple type name, in the order the generator crawls them. */
export const HK_FAMILIES: { key: HkFamily; label: string; count: number }[] = [
  {
    "key": "quantity",
    "label": "HKQuantityTypeIdentifier",
    "count": 120
  },
  {
    "key": "category",
    "label": "HKCategoryTypeIdentifier",
    "count": 30
  },
  {
    "key": "characteristic",
    "label": "HKCharacteristicTypeIdentifier",
    "count": 6
  },
  {
    "key": "workoutActivity",
    "label": "HKWorkoutActivityType",
    "count": 84
  }
];
