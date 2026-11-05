/**
 * Exercise taxonomy crosswalk: the categories, equipment, muscles and body
 * parts of free-exercise-db, wger and ExerciseDB v1, set against HealthKit's
 * HKWorkoutActivityType and Health Connect's exercise and segment types.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-exercise-taxonomy.mjs
 *
 * Sources:
 *   free-exercise-db schema.json: https://github.com/yuhonas/free-exercise-db/blob/main/schema.json — read 2026-11-05
 *   free-exercise-db dist/exercises.json: https://github.com/yuhonas/free-exercise-db/blob/main/dist/exercises.json — read 2026-11-05
 *   free-exercise-db LICENSE.md: https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md — read 2026-11-05
 *   wger REST API: exercise categories: https://wger.de/api/v2/exercisecategory/ — read 2026-11-05 (source-snapshot run 42082560270)
 *   wger REST API: equipment: https://wger.de/api/v2/equipment/ — read 2026-11-05 (source-snapshot run 42082560270)
 *   wger REST API: muscles: https://wger.de/api/v2/muscle/ — read 2026-11-05 (source-snapshot run 42082560270)
 *   wger README (License section): https://github.com/wger-project/wger/blob/master/README.md — read 2026-11-05
 *   ExerciseDB v1 API: body parts: https://oss.exercisedb.dev/api/v1/bodyparts — read 2026-11-05 (source-snapshot run 42082560270)
 *   ExerciseDB v1 API: equipment: https://oss.exercisedb.dev/api/v1/equipments — read 2026-11-05 (source-snapshot run 42082560270)
 *   ExerciseDB v1 API: muscles: https://oss.exercisedb.dev/api/v1/muscles — read 2026-11-05 (source-snapshot run 42082560270)
 *   ExerciseDB/exercisedb-api LICENSE: https://github.com/ExerciseDB/exercisedb-api/blob/main/LICENSE — read 2026-11-05
 *   This site's workout-types crosswalk (src/data/workoutTypes.ts): /workout-types — read 2026-10-18
 *
 * Copied verbatim: every term, id and English alias as its database spells it,
 * every exercise name, and the license lines.
 * DERIVED, by the rule in ET_RULE: key, status, healthkit, healthConnect,
 * hcSegment. Nothing is joined by meaning.
 */

/** The latest date the generator read its sources. */
export const ET_FETCHED_ON = "2026-11-05";

export const ET_RULE = "A term is mapped only when it is a database category or an exercise name and its key equals a constant's key; key = the name lowercased with a leading EXERCISE_TYPE_ or EXERCISE_SEGMENT_TYPE_ removed and every character outside a-z0-9 removed. Equipment, muscle and body-part terms name no activity and are never mapped. nameContains lists constants whose words contain the term's words in order: a text coincidence shown for browsing, not a mapping.";

export type EtDatabaseId = "free-exercise-db" | "wger" | "exercisedb-v1";
export type EtFacet = "category" | "equipment" | "muscle" | "body-part";
export type EtTarget = "healthkit" | "health-connect" | "hc-segment";

export type EtDatabase = { id: EtDatabaseId; name: string; home: string; license: string; licenseQuote: string; licenseSourceId: string; read: string };
export const ET_DATABASES: EtDatabase[] = [
  {
    "id": "free-exercise-db",
    "name": "free-exercise-db",
    "home": "https://github.com/yuhonas/free-exercise-db",
    "license": "Unlicense (public domain)",
    "licenseQuote": "This is free and unencumbered software released into the public domain.",
    "licenseSourceId": "fedb-license",
    "read": "The category, equipment and primaryMuscles enums of its JSON Schema, and the name of every exercise in dist/exercises.json."
  },
  {
    "id": "wger",
    "name": "wger",
    "home": "https://wger.de",
    "license": "Exercise data under Creative Commons licenses set per entry; code AGPL-3.0-or-later",
    "licenseQuote": "Exercise/Ingredient Data: Creative Commons (see individual entries)",
    "licenseSourceId": "wger-readme",
    "read": "The exercise categories, equipment and muscles its REST API v2 lists. Its exercises are not read here."
  },
  {
    "id": "exercisedb-v1",
    "name": "ExerciseDB v1",
    "home": "https://oss.exercisedb.dev",
    "license": "Repository LICENSE is AGPL-3.0; no separate data license found",
    "licenseQuote": "GNU AFFERO GENERAL PUBLIC LICENSE",
    "licenseSourceId": "edb-license",
    "read": "The body parts, equipment and muscles of the free ExerciseDB V1 API at oss.exercisedb.dev, whose home page now carries the AscendAPI name (\"Previously ExerciseDB\") and says it needs no sign-up and no API key. Its exercises, and ExerciseDB v2, are not read here."
  }
];

export type EtSource = { id: string; database: EtDatabaseId | null; title: string; url: string | null; page: string; fetchedOn: string; sha256: string; via: string };
export const ET_SOURCES: EtSource[] = [
  {
    "id": "fedb-schema",
    "database": "free-exercise-db",
    "title": "free-exercise-db schema.json",
    "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/schema.json",
    "page": "https://github.com/yuhonas/free-exercise-db/blob/main/schema.json",
    "fetchedOn": "2026-11-05",
    "sha256": "9ec09dca20ed4dfe419df81ce4956b5d6ffd2723b266e0c9cdd9b627caa77fb6",
    "via": "direct"
  },
  {
    "id": "fedb-exercises",
    "database": "free-exercise-db",
    "title": "free-exercise-db dist/exercises.json",
    "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json",
    "page": "https://github.com/yuhonas/free-exercise-db/blob/main/dist/exercises.json",
    "fetchedOn": "2026-11-05",
    "sha256": "5bb747e3fc658f095a60dcbf6d53c96627acdcc6ffb6fffde86f7e26995d40bf",
    "via": "direct"
  },
  {
    "id": "fedb-license",
    "database": "free-exercise-db",
    "title": "free-exercise-db LICENSE.md",
    "url": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/LICENSE.md",
    "page": "https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md",
    "fetchedOn": "2026-11-05",
    "sha256": "6b0382b16279f26ff69014300541967a356a666eb0b91b422f6862f6b7dad17e",
    "via": "direct"
  },
  {
    "id": "wger-categories",
    "database": "wger",
    "title": "wger REST API: exercise categories",
    "url": "https://wger.de/api/v2/exercisecategory/?format=json",
    "page": "https://wger.de/api/v2/exercisecategory/",
    "fetchedOn": "2026-11-05",
    "sha256": "bf315789ca57f467d585d3472fbbb9cca22c686aae2861f0eb218f8eaf654e04",
    "via": "source-snapshot run 42082560270"
  },
  {
    "id": "wger-equipment",
    "database": "wger",
    "title": "wger REST API: equipment",
    "url": "https://wger.de/api/v2/equipment/?format=json",
    "page": "https://wger.de/api/v2/equipment/",
    "fetchedOn": "2026-11-05",
    "sha256": "cf6ca47ffdf47481b23db6730bf6523db74c0ec708a6f9e78f6b2275cbe248dc",
    "via": "source-snapshot run 42082560270"
  },
  {
    "id": "wger-muscles",
    "database": "wger",
    "title": "wger REST API: muscles",
    "url": "https://wger.de/api/v2/muscle/?format=json",
    "page": "https://wger.de/api/v2/muscle/",
    "fetchedOn": "2026-11-05",
    "sha256": "b4e414f2adb9a0d2ef8a89121810563ec889758d7dc46fea42edc7d4fdb1bf63",
    "via": "source-snapshot run 42082560270"
  },
  {
    "id": "wger-readme",
    "database": "wger",
    "title": "wger README (License section)",
    "url": "https://raw.githubusercontent.com/wger-project/wger/master/README.md",
    "page": "https://github.com/wger-project/wger/blob/master/README.md",
    "fetchedOn": "2026-11-05",
    "sha256": "11b4826a7357eabd8756a6a5d21099f5660122e87ef6c4ec688249b351b42f05",
    "via": "direct"
  },
  {
    "id": "edb-bodyparts",
    "database": "exercisedb-v1",
    "title": "ExerciseDB v1 API: body parts",
    "url": "https://oss.exercisedb.dev/api/v1/bodyparts",
    "page": "https://oss.exercisedb.dev/api/v1/bodyparts",
    "fetchedOn": "2026-11-05",
    "sha256": "3f32e150cdab71134a43eebd8cd944f250ec43e141e0f8d469cef4135971d4ad",
    "via": "source-snapshot run 42082560270"
  },
  {
    "id": "edb-equipments",
    "database": "exercisedb-v1",
    "title": "ExerciseDB v1 API: equipment",
    "url": "https://oss.exercisedb.dev/api/v1/equipments",
    "page": "https://oss.exercisedb.dev/api/v1/equipments",
    "fetchedOn": "2026-11-05",
    "sha256": "256028a8da0e5ba94f3493dc544a5543fd0ea3d937252a7605718b965ec8eca3",
    "via": "source-snapshot run 42082560270"
  },
  {
    "id": "edb-muscles",
    "database": "exercisedb-v1",
    "title": "ExerciseDB v1 API: muscles",
    "url": "https://oss.exercisedb.dev/api/v1/muscles",
    "page": "https://oss.exercisedb.dev/api/v1/muscles",
    "fetchedOn": "2026-11-05",
    "sha256": "58bd7bdf725c7ee6352bd071ca0b637457faf658288936e085ea6b23678655a8",
    "via": "source-snapshot run 42082560270"
  },
  {
    "id": "edb-license",
    "database": "exercisedb-v1",
    "title": "ExerciseDB/exercisedb-api LICENSE",
    "url": "https://raw.githubusercontent.com/ExerciseDB/exercisedb-api/main/LICENSE",
    "page": "https://github.com/ExerciseDB/exercisedb-api/blob/main/LICENSE",
    "fetchedOn": "2026-11-05",
    "sha256": "978dd2380c595175630bb3eed0f6c9771af7a36eb6a044a99e7bca0c64cf2f05",
    "via": "direct"
  },
  {
    "id": "workout-types",
    "database": null,
    "title": "This site's workout-types crosswalk (src/data/workoutTypes.ts)",
    "url": null,
    "page": "/workout-types",
    "fetchedOn": "2026-10-18",
    "sha256": "95de8d5b5187b7c0e3115335df3214aad2f0055bc16641b4e4ea4e45482dfa38",
    "via": "repository"
  }
];

export type EtMatch = { exact: string[]; nameContains: string[] };
export type EtTerm = {
  id: string;
  database: EtDatabaseId;
  facet: EtFacet;
  term: string;
  /** The database's own numeric id (wger); null where it gives none. */
  dbId: number | null;
  /** wger's English name for a muscle; null where it gives none. */
  alias: string | null;
  sourceId: string;
  key: string;
  /** Only categories can name an activity. */
  matchable: boolean;
  status: "mapped" | "unmapped";
  reason: string;
  healthkit: EtMatch;
  healthConnect: EtMatch;
  hcSegment: EtMatch;
};
export const ET_TERMS: EtTerm[] = [
  {
    "id": "free-exercise-db-category-powerlifting",
    "database": "free-exercise-db",
    "facet": "category",
    "term": "powerlifting",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "powerlifting",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-category-strength",
    "database": "free-exercise-db",
    "facet": "category",
    "term": "strength",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "strength",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": [
        "functionalStrengthTraining",
        "traditionalStrengthTraining"
      ]
    },
    "healthConnect": {
      "exact": [],
      "nameContains": [
        "EXERCISE_TYPE_STRENGTH_TRAINING"
      ]
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-category-stretching",
    "database": "free-exercise-db",
    "facet": "category",
    "term": "stretching",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "stretching",
    "matchable": true,
    "status": "mapped",
    "reason": "Same name after normalization.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [
        "EXERCISE_TYPE_STRETCHING"
      ],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [
        "EXERCISE_SEGMENT_TYPE_STRETCHING"
      ],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-category-cardio",
    "database": "free-exercise-db",
    "facet": "category",
    "term": "cardio",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "cardio",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": [
        "cardioDance",
        "mixedCardio",
        "mixedMetabolicCardioTraining"
      ]
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-category-olympic-weightlifting",
    "database": "free-exercise-db",
    "facet": "category",
    "term": "olympic weightlifting",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "olympicweightlifting",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-category-strongman",
    "database": "free-exercise-db",
    "facet": "category",
    "term": "strongman",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "strongman",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-category-plyometrics",
    "database": "free-exercise-db",
    "facet": "category",
    "term": "plyometrics",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "plyometrics",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-medicine-ball",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "medicine ball",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "medicineball",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-dumbbell",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "dumbbell",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "dumbbell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM"
      ]
    }
  },
  {
    "id": "free-exercise-db-equipment-body-only",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "body only",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "bodyonly",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-bands",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "bands",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "bands",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-kettlebells",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "kettlebells",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "kettlebells",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-foam-roll",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "foam roll",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "foamroll",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-cable",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "cable",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "cable",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-machine",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "machine",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "machine",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": [
        "EXERCISE_TYPE_ROWING_MACHINE",
        "EXERCISE_TYPE_STAIR_CLIMBING_MACHINE"
      ]
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_ROWING_MACHINE",
        "EXERCISE_SEGMENT_TYPE_STAIR_CLIMBING_MACHINE"
      ]
    }
  },
  {
    "id": "free-exercise-db-equipment-barbell",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "barbell",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "barbell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS"
      ]
    }
  },
  {
    "id": "free-exercise-db-equipment-exercise-ball",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "exercise ball",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "exerciseball",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-e-z-curl-bar",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "e-z curl bar",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "ezcurlbar",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-equipment-other",
    "database": "free-exercise-db",
    "facet": "equipment",
    "term": "other",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "other",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": [
        "other"
      ]
    },
    "healthConnect": {
      "exact": [],
      "nameContains": [
        "EXERCISE_TYPE_OTHER_WORKOUT"
      ]
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_OTHER_WORKOUT",
        "EXERCISE_SEGMENT_TYPE_SWIMMING_OTHER"
      ]
    }
  },
  {
    "id": "free-exercise-db-muscle-abdominals",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "abdominals",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "abdominals",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-abductors",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "abductors",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "abductors",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-adductors",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "adductors",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "adductors",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-biceps",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "biceps",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "biceps",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-calves",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "calves",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "calves",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-chest",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "chest",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "chest",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-forearms",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "forearms",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "forearms",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-glutes",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "glutes",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "glutes",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-hamstrings",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "hamstrings",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "hamstrings",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-lats",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "lats",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "lats",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-lower-back",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "lower back",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "lowerback",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-middle-back",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "middle back",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "middleback",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-neck",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "neck",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "neck",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-quadriceps",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "quadriceps",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "quadriceps",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-shoulders",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "shoulders",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "shoulders",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-traps",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "traps",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "traps",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "free-exercise-db-muscle-triceps",
    "database": "free-exercise-db",
    "facet": "muscle",
    "term": "triceps",
    "dbId": null,
    "alias": null,
    "sourceId": "fedb-schema",
    "key": "triceps",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
        "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION"
      ]
    }
  },
  {
    "id": "wger-category-abs",
    "database": "wger",
    "facet": "category",
    "term": "Abs",
    "dbId": 10,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "abs",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-category-arms",
    "database": "wger",
    "facet": "category",
    "term": "Arms",
    "dbId": 8,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "arms",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-category-back",
    "database": "wger",
    "facet": "category",
    "term": "Back",
    "dbId": 12,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "back",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION"
      ]
    }
  },
  {
    "id": "wger-category-calves",
    "database": "wger",
    "facet": "category",
    "term": "Calves",
    "dbId": 14,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "calves",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-category-cardio",
    "database": "wger",
    "facet": "category",
    "term": "Cardio",
    "dbId": 15,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "cardio",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": [
        "cardioDance",
        "mixedCardio",
        "mixedMetabolicCardioTraining"
      ]
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-category-chest",
    "database": "wger",
    "facet": "category",
    "term": "Chest",
    "dbId": 11,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "chest",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-category-legs",
    "database": "wger",
    "facet": "category",
    "term": "Legs",
    "dbId": 9,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "legs",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-category-shoulders",
    "database": "wger",
    "facet": "category",
    "term": "Shoulders",
    "dbId": 13,
    "alias": null,
    "sourceId": "wger-categories",
    "key": "shoulders",
    "matchable": true,
    "status": "unmapped",
    "reason": "No HealthKit or Health Connect constant has the same name after normalization; nothing is matched by meaning.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-barbell",
    "database": "wger",
    "facet": "equipment",
    "term": "Barbell",
    "dbId": 1,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "barbell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS"
      ]
    }
  },
  {
    "id": "wger-equipment-bench",
    "database": "wger",
    "facet": "equipment",
    "term": "Bench",
    "dbId": 8,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "bench",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_BENCH_PRESS",
        "EXERCISE_SEGMENT_TYPE_BENCH_SIT_UP"
      ]
    }
  },
  {
    "id": "wger-equipment-cable-machine",
    "database": "wger",
    "facet": "equipment",
    "term": "Cable machine",
    "dbId": 12,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "cablemachine",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-dumbbell",
    "database": "wger",
    "facet": "equipment",
    "term": "Dumbbell",
    "dbId": 3,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "dumbbell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM"
      ]
    }
  },
  {
    "id": "wger-equipment-gym-mat",
    "database": "wger",
    "facet": "equipment",
    "term": "Gym mat",
    "dbId": 4,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "gymmat",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-incline-bench",
    "database": "wger",
    "facet": "equipment",
    "term": "Incline bench",
    "dbId": 9,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "inclinebench",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-kettlebell",
    "database": "wger",
    "facet": "equipment",
    "term": "Kettlebell",
    "dbId": 10,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "kettlebell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING"
      ]
    }
  },
  {
    "id": "wger-equipment-pull-up-bar",
    "database": "wger",
    "facet": "equipment",
    "term": "Pull-up bar",
    "dbId": 6,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "pullupbar",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-resistance-band",
    "database": "wger",
    "facet": "equipment",
    "term": "Resistance band",
    "dbId": 11,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "resistanceband",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-sz-bar",
    "database": "wger",
    "facet": "equipment",
    "term": "SZ-Bar",
    "dbId": 2,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "szbar",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-swiss-ball",
    "database": "wger",
    "facet": "equipment",
    "term": "Swiss Ball",
    "dbId": 5,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "swissball",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-equipment-none-bodyweight-exercise",
    "database": "wger",
    "facet": "equipment",
    "term": "none (bodyweight exercise)",
    "dbId": 7,
    "alias": null,
    "sourceId": "wger-equipment",
    "key": "nonebodyweightexercise",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-anterior-deltoid",
    "database": "wger",
    "facet": "muscle",
    "term": "Anterior deltoid",
    "dbId": 2,
    "alias": "Shoulders",
    "sourceId": "wger-muscles",
    "key": "anteriordeltoid",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-biceps-brachii",
    "database": "wger",
    "facet": "muscle",
    "term": "Biceps brachii",
    "dbId": 1,
    "alias": "Biceps",
    "sourceId": "wger-muscles",
    "key": "bicepsbrachii",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-biceps-femoris",
    "database": "wger",
    "facet": "muscle",
    "term": "Biceps femoris",
    "dbId": 11,
    "alias": "Hamstrings",
    "sourceId": "wger-muscles",
    "key": "bicepsfemoris",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-brachialis",
    "database": "wger",
    "facet": "muscle",
    "term": "Brachialis",
    "dbId": 13,
    "alias": null,
    "sourceId": "wger-muscles",
    "key": "brachialis",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-gastrocnemius",
    "database": "wger",
    "facet": "muscle",
    "term": "Gastrocnemius",
    "dbId": 7,
    "alias": "Calves",
    "sourceId": "wger-muscles",
    "key": "gastrocnemius",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-gluteus-maximus",
    "database": "wger",
    "facet": "muscle",
    "term": "Gluteus maximus",
    "dbId": 8,
    "alias": "Glutes",
    "sourceId": "wger-muscles",
    "key": "gluteusmaximus",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-latissimus-dorsi",
    "database": "wger",
    "facet": "muscle",
    "term": "Latissimus dorsi",
    "dbId": 12,
    "alias": "Lats",
    "sourceId": "wger-muscles",
    "key": "latissimusdorsi",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-obliquus-externus-abdominis",
    "database": "wger",
    "facet": "muscle",
    "term": "Obliquus externus abdominis",
    "dbId": 14,
    "alias": null,
    "sourceId": "wger-muscles",
    "key": "obliquusexternusabdominis",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-pectoralis-major",
    "database": "wger",
    "facet": "muscle",
    "term": "Pectoralis major",
    "dbId": 4,
    "alias": "Chest",
    "sourceId": "wger-muscles",
    "key": "pectoralismajor",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-quadriceps-femoris",
    "database": "wger",
    "facet": "muscle",
    "term": "Quadriceps femoris",
    "dbId": 10,
    "alias": "Quads",
    "sourceId": "wger-muscles",
    "key": "quadricepsfemoris",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-rectus-abdominis",
    "database": "wger",
    "facet": "muscle",
    "term": "Rectus abdominis",
    "dbId": 6,
    "alias": "Abs",
    "sourceId": "wger-muscles",
    "key": "rectusabdominis",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-serratus-anterior",
    "database": "wger",
    "facet": "muscle",
    "term": "Serratus anterior",
    "dbId": 3,
    "alias": null,
    "sourceId": "wger-muscles",
    "key": "serratusanterior",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-soleus",
    "database": "wger",
    "facet": "muscle",
    "term": "Soleus",
    "dbId": 15,
    "alias": null,
    "sourceId": "wger-muscles",
    "key": "soleus",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-trapezius",
    "database": "wger",
    "facet": "muscle",
    "term": "Trapezius",
    "dbId": 9,
    "alias": null,
    "sourceId": "wger-muscles",
    "key": "trapezius",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "wger-muscle-triceps-brachii",
    "database": "wger",
    "facet": "muscle",
    "term": "Triceps brachii",
    "dbId": 5,
    "alias": "Triceps",
    "sourceId": "wger-muscles",
    "key": "tricepsbrachii",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
        "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION"
      ]
    }
  },
  {
    "id": "exercisedb-v1-body-part-neck",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "neck",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "neck",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-lower-arms",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "lower arms",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "lowerarms",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-shoulders",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "shoulders",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "shoulders",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-cardio",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "cardio",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "cardio",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": [
        "cardioDance",
        "mixedCardio",
        "mixedMetabolicCardioTraining"
      ]
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-upper-arms",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "upper arms",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "upperarms",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-chest",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "chest",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "chest",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-lower-legs",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "lower legs",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "lowerlegs",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-back",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "back",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "back",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION"
      ]
    }
  },
  {
    "id": "exercisedb-v1-body-part-upper-legs",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "upper legs",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "upperlegs",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-body-part-waist",
    "database": "exercisedb-v1",
    "facet": "body-part",
    "term": "waist",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-bodyparts",
    "key": "waist",
    "matchable": false,
    "status": "unmapped",
    "reason": "A body-part term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-stepmill-machine",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "stepmill machine",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "stepmillmachine",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-elliptical-machine",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "elliptical machine",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "ellipticalmachine",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-trap-bar",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "trap bar",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "trapbar",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-tire",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "tire",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "tire",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-stationary-bike",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "stationary bike",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "stationarybike",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-ab-wheel",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "ab wheel",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "abwheel",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-smith-machine",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "smith machine",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "smithmachine",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-hammer",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "hammer",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "hammer",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-ski-ergometer",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "ski ergometer",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "skiergometer",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-roller",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "roller",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "roller",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": [
        "EXERCISE_TYPE_ROLLER_HOCKEY"
      ]
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-resistance-band",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "resistance band",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "resistanceband",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-bosu-ball",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "bosu ball",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "bosuball",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-weighted",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "weighted",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "weighted",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-olympic-barbell",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "olympic barbell",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "olympicbarbell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-kettlebell",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "kettlebell",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "kettlebell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_KETTLEBELL_SWING"
      ]
    }
  },
  {
    "id": "exercisedb-v1-equipment-upper-body-ergometer",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "upper body ergometer",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "upperbodyergometer",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-sled-machine",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "sled machine",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "sledmachine",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-ez-bar",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "EZ bar",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "ezbar",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-dumbbell",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "dumbbell",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "dumbbell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_CURL_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_FRONT_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_LATERAL_RAISE",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_ROW",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM"
      ]
    }
  },
  {
    "id": "exercisedb-v1-equipment-rope",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "rope",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "rope",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": [
        "jumpRope"
      ]
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_JUMP_ROPE"
      ]
    }
  },
  {
    "id": "exercisedb-v1-equipment-barbell",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "barbell",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "barbell",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS"
      ]
    }
  },
  {
    "id": "exercisedb-v1-equipment-stability-ball",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "stability ball",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "stabilityball",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-medicine-ball",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "medicine ball",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "medicineball",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-assisted",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "assisted",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "assisted",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-leverage-machine",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "leverage machine",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "leveragemachine",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-cable",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "cable",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "cable",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-bodyweight",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "bodyweight",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "bodyweight",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-towel",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "towel",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "towel",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-tennis-ball",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "tennis ball",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "tennisball",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-equipment-suspension-trainer",
    "database": "exercisedb-v1",
    "facet": "equipment",
    "term": "suspension trainer",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-equipments",
    "key": "suspensiontrainer",
    "matchable": false,
    "status": "unmapped",
    "reason": "An equipment term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-tibialis-anterior",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "tibialis anterior",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "tibialisanterior",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-hands",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "hands",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "hands",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-sternocleidomastoid",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "sternocleidomastoid",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "sternocleidomastoid",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-soleus",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "soleus",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "soleus",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-adductors",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "adductors",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "adductors",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-abdominals",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "abdominals",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "abdominals",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-grip-muscles",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "grip muscles",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "gripmuscles",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-wrist-extensors",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "wrist extensors",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "wristextensors",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-wrist-flexors",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "wrist flexors",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "wristflexors",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-latissimus-dorsi",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "latissimus dorsi",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "latissimusdorsi",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-pectorals",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "pectorals",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "pectorals",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-rotator-cuff",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "rotator cuff",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "rotatorcuff",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-wrists",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "wrists",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "wrists",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-brachialis",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "brachialis",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "brachialis",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-deltoids",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "deltoids",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "deltoids",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-feet",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "feet",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "feet",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-ankles",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "ankles",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "ankles",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-trapezius",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "trapezius",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "trapezius",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-rear-deltoids",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "rear deltoids",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "reardeltoids",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-quadriceps",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "quadriceps",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "quadriceps",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-back",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "back",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "back",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_BACK_EXTENSION"
      ]
    }
  },
  {
    "id": "exercisedb-v1-muscle-core",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "core",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "core",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": [
        "coreTraining"
      ]
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-ankle-stabilizers",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "ankle stabilizers",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "anklestabilizers",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-rhomboids",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "rhomboids",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "rhomboids",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-obliques",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "obliques",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "obliques",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-erector-spinae",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "erector spinae",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "erectorspinae",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-hip-flexors",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "hip flexors",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "hipflexors",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-levator-scapulae",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "levator scapulae",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "levatorscapulae",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-abductors",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "abductors",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "abductors",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-serratus-anterior",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "serratus anterior",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "serratusanterior",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-forearms",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "forearms",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "forearms",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-biceps",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "biceps",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "biceps",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-upper-back",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "upper back",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "upperback",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-cardiovascular-system",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "cardiovascular system",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "cardiovascularsystem",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-triceps",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "triceps",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "triceps",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": [
        "EXERCISE_SEGMENT_TYPE_DOUBLE_ARM_TRICEPS_EXTENSION",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_LEFT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_RIGHT_ARM",
        "EXERCISE_SEGMENT_TYPE_DUMBBELL_TRICEPS_EXTENSION_TWO_ARM",
        "EXERCISE_SEGMENT_TYPE_SINGLE_ARM_TRICEPS_EXTENSION"
      ]
    }
  },
  {
    "id": "exercisedb-v1-muscle-hamstrings",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "hamstrings",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "hamstrings",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-glutes",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "glutes",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "glutes",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  },
  {
    "id": "exercisedb-v1-muscle-calves",
    "database": "exercisedb-v1",
    "facet": "muscle",
    "term": "calves",
    "dbId": null,
    "alias": null,
    "sourceId": "edb-muscles",
    "key": "calves",
    "matchable": false,
    "status": "unmapped",
    "reason": "A muscle term names no activity, so it is not mapped to a workout type.",
    "healthkit": {
      "exact": [],
      "nameContains": []
    },
    "healthConnect": {
      "exact": [],
      "nameContains": []
    },
    "hcSegment": {
      "exact": [],
      "nameContains": []
    }
  }
];

/** free-exercise-db exercises in dist/exercises.json, all of them read. */
export const ET_EXERCISE_COUNT = 876;

export type EtExerciseMatch = {
  database: EtDatabaseId;
  exerciseId: string;
  name: string;
  category: string | null;
  equipment: string | null;
  key: string;
  healthkit: string[];
  healthConnect: string[];
  hcSegment: string[];
};
/** The exercises whose name has the same key as a constant (exact only). */
export const ET_EXERCISE_MATCHES: EtExerciseMatch[] = [
  {
    "database": "free-exercise-db",
    "exerciseId": "Barbell_Shoulder_Press",
    "name": "Barbell Shoulder Press",
    "category": "strength",
    "equipment": "barbell",
    "key": "barbellshoulderpress",
    "healthkit": [],
    "healthConnect": [],
    "hcSegment": [
      "EXERCISE_SEGMENT_TYPE_BARBELL_SHOULDER_PRESS"
    ]
  },
  {
    "database": "free-exercise-db",
    "exerciseId": "Leg_Press",
    "name": "Leg Press",
    "category": "strength",
    "equipment": "machine",
    "key": "legpress",
    "healthkit": [],
    "healthConnect": [],
    "hcSegment": [
      "EXERCISE_SEGMENT_TYPE_LEG_PRESS"
    ]
  },
  {
    "database": "free-exercise-db",
    "exerciseId": "Plank",
    "name": "Plank",
    "category": "strength",
    "equipment": "body only",
    "key": "plank",
    "healthkit": [],
    "healthConnect": [],
    "hcSegment": [
      "EXERCISE_SEGMENT_TYPE_PLANK"
    ]
  },
  {
    "database": "free-exercise-db",
    "exerciseId": "Running_Treadmill",
    "name": "Running, Treadmill",
    "category": "cardio",
    "equipment": "machine",
    "key": "runningtreadmill",
    "healthkit": [],
    "healthConnect": [
      "EXERCISE_TYPE_RUNNING_TREADMILL"
    ],
    "hcSegment": [
      "EXERCISE_SEGMENT_TYPE_RUNNING_TREADMILL"
    ]
  },
  {
    "database": "free-exercise-db",
    "exerciseId": "Sit-Up",
    "name": "Sit-Up",
    "category": "strength",
    "equipment": "body only",
    "key": "situp",
    "healthkit": [],
    "healthConnect": [],
    "hcSegment": [
      "EXERCISE_SEGMENT_TYPE_SIT_UP"
    ]
  },
  {
    "database": "free-exercise-db",
    "exerciseId": "Skating",
    "name": "Skating",
    "category": "cardio",
    "equipment": "other",
    "key": "skating",
    "healthkit": [],
    "healthConnect": [
      "EXERCISE_TYPE_SKATING"
    ],
    "hcSegment": []
  }
];
