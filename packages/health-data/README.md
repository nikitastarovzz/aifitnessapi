# @aifitnessapi/health-data

Typed reference data for health and fitness APIs, as plain JSON. No network,
no runtime, no model.

```bash
npm i @aifitnessapi/health-data
```

```js
import { aggregationFor, healthkitIdentifier, crossPlatform } from "@aifitnessapi/health-data";

aggregationFor("stepCount");     // "cumulativeSum"
aggregationFor("heartRate");     // "discrete"
aggregationFor("sleepAnalysis"); // null — a category type has no aggregation
aggregationFor("nope");          // null

healthkitIdentifier("HKQuantityTypeIdentifierStepCount").unitFamily;  // "count"
crossPlatform("hrv").watchOut;   // the SDNN-vs-RMSSD warning
```

## What's in it

| Export | Rows | What |
|---|---|---|
| `healthkitIdentifiers` | 240 | Every HealthKit identifier across all four families, read from Apple's documentation JSON |
| `crossPlatformTypes` | 10 | Verified HealthKit ↔ Health Connect metric mappings, with the traps |
| `apiChanges` | 13 | Dated ecosystem changes, each graded `confirmed` or `reported` |
| `glossary` | 33 | Domain terms |

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

## Licence

CC BY 4.0. Apple's abstracts are reproduced to identify the API surface and
remain Apple's; the classification and analysis are
[aifitnessapi.com](https://aifitnessapi.com)'s.
