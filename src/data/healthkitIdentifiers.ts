/**
 * Every HKQuantityTypeIdentifier, read from Apple's own documentation JSON.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   node scripts/fetch-healthkit-identifiers.mjs
 *
 * Source: https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier
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

export type HkIdentifier = {
  /** Swift case name, e.g. "activeEnergyBurned". */
  case: string;
  /** Objective-C constant, e.g. "HKQuantityTypeIdentifierActiveEnergyBurned". */
  objc: string;
  /** Apple's own topic grouping. */
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Derived from Apple's prose; null when Apple does not state it. */
  aggregation: "cumulative" | "discrete" | null;
  /** The sentence `aggregation` was derived from. */
  aggregationEvidence: string | null;
  /** Derived from Apple's prose, e.g. "energy"; null when unstated. */
  unitFamily: string | null;
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of active energy the user has burned.",
    "aggregation": "cumulative",
    "aggregationEvidence": "Active energy samples use energy units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "energy",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the user spent exercising.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the user has spent performing activities that involve full-body movements during the specified day.",
    "aggregation": "cumulative",
    "aggregationEvidence": "For younger users, HealthKit’s activity summary can track move time instead of active energy burned: These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
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
    "group": "Mindfulness and Sleep",
    "abstract": "",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
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
    "group": "Body measurements",
    "abstract": "A quantity sample type that records the wrist temperature during sleep.",
    "aggregation": "discrete",
    "aggregationEvidence": "Sleeping wrist temperature samples use temperature units (described in ) and measure discrete values (described in ).",
    "unitFamily": "temperature",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the user has spent standing.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
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
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the steadiness of the user’s gait.",
    "aggregation": "discrete",
    "aggregationEvidence": "Samples that match the Walking Steadiness identifier use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
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
    "group": "Vital signs",
    "abstract": "A quantity type that measures an estimate of the percentage of time a person’s heart shows signs of atrial fibrillation (AFib) while wearing Apple Watch.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
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
    "group": "Reproductive health",
    "abstract": "A quantity sample type that records the user’s basal body temperature.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use temperature units (described in ) and measure discrete values (described in ).",
    "unitFamily": "temperature",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the resting energy burned by the user.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use energy units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "energy",
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
    "group": "Alcohol consumption",
    "abstract": "A quantity sample type that measures the user’s blood alcohol content.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the user’s blood glucose level.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use mass/volume units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s diastolic blood pressure.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use pressure units (described in ) and measure discrete values (described in ).",
    "unitFamily": "pressure",
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s systolic blood pressure.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use pressure units (described in ) and measure discrete values (described in ).",
    "unitFamily": "pressure",
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
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s body fat percentage.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
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
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s weight.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use mass units (described in ) and measure discrete values (described in ).",
    "unitFamily": "mass",
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
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s body mass index.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count units (described in ) and measure discrete values (described in ).",
    "unitFamily": "count",
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s body temperature.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use temperature units (described in ) and measure discrete values (described in ).",
    "unitFamily": "temperature",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures how fast you are traveling while cross country skiing.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
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
    "group": "Activity",
    "abstract": "A quantity sample type that represents the rate at which the user is pedaling.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use counts per minute units (described in ) and measure discrete values (described in ).",
    "unitFamily": "counts per minute",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the estimated maximum average power sustained while riding a bike for 60 minutes.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power units (described in ) and measure discrete values (described in ).",
    "unitFamily": "power",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the estimated power being used while riding a bike.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power units (described in ) and measure discrete values (described in ).",
    "unitFamily": "power",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures how fast you are traveling while riding a bike.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of biotin (vitamin B7) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of caffeine consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of calcium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of carbohydrates consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of chloride consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of cholesterol consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of chromium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of copper consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of energy consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use energy units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "energy",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of monounsaturated fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of polyunsaturated fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of saturated fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the total amount of fat consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of fiber consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of folate (folic acid) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of iodine consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of iron consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of magnesium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of manganese consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of molybdenum consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of niacin (vitamin B3) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of pantothenic acid (vitamin B5) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of phosphorus consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of potassium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of protein consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of riboflavin (vitamin B2) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of selenium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of sodium consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of sugar consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of thiamin (vitamin B1) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin A consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of cyanocobalamin (vitamin B12) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of pyridoxine (vitamin B6) consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin C consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin D consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin E consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of vitamin K consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of water consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use volume units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "volume",
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
    "group": "Nutrition",
    "abstract": "A quantity sample type that measures the amount of zinc consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use mass units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "mass",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by cross country skiing.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by cycling.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has traveled while skiing or snowboarding.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by paddling sports.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by rowing.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by skating.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved while swimming.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by walking or running.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved using a wheelchair.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use length units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "length",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures electrodermal activity.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use conductance units (described in ) and measure discrete values (described in ).",
    "unitFamily": "conductance",
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
    "group": "Hearing",
    "abstract": "A quantity sample type that measures audio exposure to sounds in the environment.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values of the equivalent continuous sound pressure level, described in .",
    "unitFamily": "sound pressure",
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
    "group": "Hearing",
    "abstract": "A quantity sample type that measures the difference in sound intensity when wearing headphones that lower environmental sound levels.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values of the equivalent continuous sound pressure level, described in .",
    "unitFamily": "sound pressure",
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
    "group": "Activity",
    "abstract": "",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number flights of stairs that the user has climbed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the amount of air that can be forcibly exhaled from the lungs during the first second of a forced exhalation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use volume units (described in ) and measure discrete values (described in ).",
    "unitFamily": "volume",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the amount of air that can be forcibly exhaled from the lungs after taking the deepest breath possible.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use volume units (described in ) and measure discrete values (described in ).",
    "unitFamily": "volume",
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
    "group": "Hearing",
    "abstract": "A quantity sample type that measures audio exposure from headphones.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values of the equivalent continuous sound pressure level, described in .",
    "unitFamily": "sound pressure",
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s heart rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Vital signs",
    "abstract": "A quantity sample that records the reduction in heart rate from the peak exercise rate to the rate one minute after exercising ended.",
    "aggregation": "discrete",
    "aggregationEvidence": "Heart rate recovery samples use count units (described in ) and measure discrete values (described in ).",
    "unitFamily": "count",
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the standard deviation of heartbeat intervals.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "time",
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
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s height.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the number of puffs the user takes from their inhaler.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample that measures the amount of insulin delivered.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use international units (IU) (described in ) and measure cumulative values (described in ).",
    "unitFamily": "international",
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
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s lean body mass.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use mass units (described in ) and measure discrete values (described in ).",
    "unitFamily": "mass",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of NikeFuel points the user has earned.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "Alcohol consumption",
    "abstract": "A quantity sample type that measures the number of standard alcoholic drinks that the user has consumed.",
    "aggregation": "cumulative",
    "aggregationEvidence": "The samples use count units (described in ) to measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the number of times the user fell.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s oxygen saturation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance the user has moved by paddling sports.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "distance per time",
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the user’s maximum flow rate generated during a forceful exhalation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use volume/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Lab and test results",
    "abstract": "A quantity sample type that measures the user’s peripheral perfusion index.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percent units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percent",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the estimated amount of energy being used to perform a task excluding other factors such as temperature, altitude, or heart rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power in Metabolic Equivalent of Task (METs) units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of pushes that the user has performed while using a wheelchair.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s respiratory rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s resting heart rate.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures how fast the rower is moving.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the amount of time the runner’s foot is in contact with the ground while running.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "time",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the rate of work required for the runner to maintain their speed.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use power units (described in ) and measure discrete values (described in ).",
    "unitFamily": "power",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the runner’s speed.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the distance covered by a single step while running.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
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
    "group": "Activity",
    "abstract": "A quantity sample type measuring pelvis vertical range of motion during a single running stride.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
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
    "group": "Mobility",
    "abstract": "A quantity sample type that stores the distance a user can walk during a six-minute walk test.",
    "aggregation": "discrete",
    "aggregationEvidence": "samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
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
    "group": "Mobility",
    "abstract": "A quantity sample type measuring the user’s speed while climbing a flight of stairs.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Mobility",
    "abstract": "A quantity sample type measuring the user’s speed while descending a flight of stairs.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of steps the user has taken.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "Activity",
    "abstract": "A quantity sample type that measures the number of strokes performed while swimming.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use count units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "count",
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
    "group": "UV exposure",
    "abstract": "A quantity sample type that measures amount of time the user spent in daylight.",
    "aggregation": "cumulative",
    "aggregationEvidence": "These samples use time units (described in ) and measure cumulative values (described in ).",
    "unitFamily": "time",
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
    "group": "Diving",
    "abstract": "A quantity sample that records a person’s depth underwater.",
    "aggregation": "discrete",
    "aggregationEvidence": "Underwater depth samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
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
    "group": "UV exposure",
    "abstract": "A quantity sample type that measures the user’s exposure to UV radiation.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count units (described in ) and measure discrete values (described in ).",
    "unitFamily": "count",
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
    "group": "Activity",
    "abstract": "A quantity sample that measures the maximal oxygen consumption during exercise.",
    "aggregation": "discrete",
    "aggregationEvidence": "They measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Body measurements",
    "abstract": "A quantity sample type that measures the user’s waist circumference.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use length units (described in ) and measure discrete values (described in ).",
    "unitFamily": "length",
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
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the percentage of steps in which one foot moves at a different speed than the other when walking on flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
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
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the percentage of time when both of the user’s feet touch the ground while walking steadily over flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use percentage units (described in ) and measure discrete values (described in ).",
    "unitFamily": "percentage",
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
    "group": "Vital signs",
    "abstract": "A quantity sample type that measures the user’s heart rate while walking.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use count/time units (described in ) and measure discrete values (described in ).",
    "unitFamily": null,
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
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the user’s average speed when walking steadily over flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance per time units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance per time",
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
    "group": "Mobility",
    "abstract": "A quantity sample type that measures the average length of the user’s step when walking steadily over flat ground.",
    "aggregation": "discrete",
    "aggregationEvidence": "These samples use distance units (described in ) and measure discrete values (described in ).",
    "unitFamily": "distance",
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
    "group": "Diving",
    "abstract": "A quantity sample that records the water temperature.",
    "aggregation": "discrete",
    "aggregationEvidence": "Water temperature samples use temperature units (see ) and measure discrete values (see ).",
    "unitFamily": "temperature",
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
    "group": "Activity",
    "abstract": "",
    "aggregation": null,
    "aggregationEvidence": null,
    "unitFamily": null,
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
  "Diving"
];
