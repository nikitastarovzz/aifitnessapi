# @aifitnessapi/health-data

Typed reference data for health and fitness APIs, as plain JSON. No network,
no runtime, no model.

```bash
npm i @aifitnessapi/health-data
```

```js
import { aggregationFor, healthkitIdentifier, crossPlatform, healthConnectRecord, healthConnectPermission } from "@aifitnessapi/health-data";

aggregationFor("stepCount");     // "cumulativeSum"
aggregationFor("heartRate");     // "discrete"
aggregationFor("sleepAnalysis"); // null — a category type has no aggregation
aggregationFor("nope");          // null

healthkitIdentifier("HKQuantityTypeIdentifierStepCount").unitFamily;  // "count"
crossPlatform("hrv").watchOut;   // the SDNN-vs-RMSSD warning

healthConnectRecord("StepsRecord").readPermissions;  // "android.permission.health.READ_STEPS"
healthConnectPermission("READ_STEPS").records;       // "StepsRecord; StepsCadenceRecord"
```

## What's in it

| Export | Rows | What |
|---|---|---|
| `healthkitIdentifiers` | 241 | Every HealthKit identifier across all four families, read from Apple's documentation JSON |
| `crossPlatformTypes` | 10 | Verified HealthKit ↔ Health Connect metric mappings, with the traps |
| `apiChanges` | 13 | Dated ecosystem changes, each graded `confirmed` or `reported` |
| `glossary` | 33 | Domain terms |
| `healthConnectRecords` | 42 | Every Health Connect record class in Google's data-types table, with permission strings and aggregate metrics |
| `healthConnectPermissions` | 219 | Every `android.permission.health` string on Google's HealthPermissions reference |

`meta` carries the provenance for each set, including the date its source was
last read.

## Why `null` matters here

Nothing in this package guesses. `aggregationFor` returns `null` when the name
is unknown, when the type is not a quantity type, or when Apple's own
documentation does not state an aggregation style — and a lookup for an
unrecognised identifier returns `undefined` rather than a nearest match.

That is the whole value. `aggregation` decides whether you sum a HealthKit
type with `.cumulativeSum` or average it with `.discreteAverage`, and getting
it wrong throws nothing: `HKStatisticsQuery` returns a plausible number that
happens to be wrong. Code branching on this needs to distinguish "Apple says
discrete" from "nobody knows", so the package never collapses the two.

Two fields are derived rather than copied, because Apple states them in prose
rather than as machine-readable properties: `aggregation` and `unitFamily`.
Both apply only to quantity types. Apple's documentation remains the authority.

Deprecation is read from Apple's availability data, not from its `deprecated`
flag, which Apple leaves false even on deprecated symbols. `deprecated` is
`"yes"` when any platform entry carries a `deprecatedAt` version,
`iosDeprecated` is the iOS one, and `deprecationNote` and `renamedTo` are
Apple's own words, null where Apple says nothing:

```js
healthkitIdentifier("dance").iosDeprecated;   // "14.0"
healthkitIdentifier("dance").deprecationNote; // "Use HKWorkoutActivityType.cardioDance or HKWorkoutActivityType.socialDance instead."
healthkitIdentifier("audioExposureEvent").renamedTo; // "HKCategoryTypeIdentifier.environmentalAudioExposureEvent"
```

`appleDocs` links each identifier to the page it was read from, under its own
family's path on developer.apple.com.

## Licence

CC BY 4.0. Apple's abstracts are reproduced to identify the API surface and
remain Apple's; the classification and analysis are
[aifitnessapi.com](https://aifitnessapi.com)'s.
