# @aifitnessapi/api-client

A typed, zero-dependency TypeScript client for the read-only JSON API at
<https://aifitnessapi.com/api/v1>: HealthKit type identifiers and metadata
keys, Health Connect records and permissions, Wear OS and Google Health API
data types, the HealthKit to Health Connect matrix, Bluetooth GATT fields,
pose keypoints, health MCP servers, dated ecosystem changes, the glossary and
the API directory. No key, GET only, CC BY 4.0 data.

**Not published on npm.** Whether it is published is the site owner's call;
until then, use it from a clone of this repository.

## Use it from the repository

```sh
git clone https://github.com/nikitastarovzz/aifitnessapi.git
cd aifitnessapi/packages/api-client
npx -p typescript tsc -p tsconfig.build.json   # writes dist/ (ESM + .d.ts)
```

Then either install the folder into your project:

```sh
npm install /path/to/aifitnessapi/packages/api-client
```

or copy `src/index.ts` and `src/schema.ts` into your codebase. Both are plain
TypeScript with no imports beyond each other.

## Calls

```ts
import { createClient, ApiError, type HealthkitType } from "@aifitnessapi/api-client";

const api = createClient(); // defaults: https://aifitnessapi.com, globalThis.fetch

const index = await api.index();                          // every collection, count and verified date
const { items, verified } = await api.list("healthkit/types");
const first: HealthkitType = items[0];

const steps = await api.get("health-connect/records", "StepsRecord");
steps.item.readPermissions;   // string | null
steps.source;                 // the page carrying the sourced claim
steps.citeAs;                 // a ready-made citation (CC BY 4.0's one condition is attribution)

await api.find("healthkit/types", "notAType");            // null
await api.get("healthkit/types", "notAType");             // throws ApiError, status 404

api.keyOf("health-connect/records");                      // "className"
api.url("matrix");                                        // "https://aifitnessapi.com/api/v1/matrix"
```

`createClient({ baseUrl, fetch, signal })` takes another origin (for a local
`next start`), any fetch-compatible function, and an `AbortSignal`.

Ids are case-sensitive and `[A-Za-z0-9._-]`; `url()` refuses anything else
before a request is made, and `find()` returns `null` for it.

## What the types promise

`src/schema.ts` is **generated** from the site's OpenAPI document by
`scripts/build-api-client.mjs`. Never edit it by hand:

```sh
npm run build                          # at the repository root
node scripts/build-api-client.mjs      # rewrites src/schema.ts
node scripts/build-api-client.mjs --check
```

The site's `npm run qa` has an `API-CLIENT-DRIFT` gate that fails the build
when the two disagree, so a column that is added, removed or retyped in a
dataset cannot ship without the client changing with it.

- Envelope fields (`source`, `license`, `verified`, `citeAs`, `dataset`, …)
  are typed exactly.
- Row fields the API derives from the data are typed as their observed types
  `| null`, and `unknown` where every row is null. The API's rule is that
  `null` means the source does not state it, never zero and never a guess.
- Each collection's id field is `string`.
- Per-edition values (a collection's `count`, the list of valid ids) are not
  baked into the types; they change with every data refresh.
- Field descriptions are not copied into the types; read them in
  `/api/v1/openapi.json` or on <https://aifitnessapi.com/developers>.

## Tests

```sh
npm run build              # at the repository root: the tests read .next, not the network
npm run test:api-client
```

They check that `schema.ts` matches the built OpenAPI document, that the
package type-checks on its own (including the compile-time contract in
`test/types.ts`), and that the compiled client, fed by a fetch that serves the
files `next build` wrote under `.next/server/app/api/v1`, reads the index,
every collection and one item from each, with exactly the fields the
generated types declare.

## License

The client code is MIT. The data it fetches is CC BY 4.0: credit
aifitnessapi.com when you reuse it (every response carries `attribution` and
`citeAs`).
