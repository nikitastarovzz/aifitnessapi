# @aifitnessapi/exercise-adapter

One `Exercise` type over three free exercise sources, so an app can start on
one and move to another without rewriting its model: free-exercise-db (a
public-domain JSON file), wger (its public REST API v2) and ExerciseDB V1's
free tier (oss.exercisedb.dev). No API keys, no paid providers, no
dependencies, TypeScript with ESM output.

**Not published on npm.** Publishing is the site owner's call; until then, use
it from a clone of this repository.

## Providers

| Provider | Reads | Key | Paging | License of the data, as this site's sources state it |
|---|---|---|---|---|
| `freeExerciseDb()` | `dist/exercises.json`, passed in or fetched once from raw.githubusercontent.com at a `ref` | none | offset over the file | Unlicense: "released into the public domain", usable "for any purpose, commercial or non-commercial" ([LICENSE.md](https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md)) |
| `wger()` | `GET /api/v2/exerciseinfo/` and `/api/v2/exerciseinfo/{id}/` on wger.de or your own instance | none | `limit` and `offset` | Exercise data "Creative Commons (see individual entries)", code AGPL-3.0-or-later ([README](https://github.com/wger-project/wger/blob/master/README.md)); each record carries its own license and author |
| `exerciseDbV1()` | `GET /api/v1/exercises` and `/api/v1/exercises/{id}` on oss.exercisedb.dev | none | `after=<nextCursor>` | Not stated: AscendAPI's terms of use could not be read when this site checked, and its repository carries an AGPL-3.0 LICENSE file ([pricing page](https://aifitnessapi.com/pricing/exercise-database-api-pricing#can-i-ship-it)) |

Read the live terms before you ship any of them; the table is what the pages
this site read say, not legal advice.

## Use it from the repository

```sh
git clone https://github.com/nikitastarovzz/aifitnessapi.git
cd aifitnessapi/packages/exercise-adapter
npx -p typescript tsc -p tsconfig.build.json   # writes dist/ (ESM + .d.ts)
```

Then `npm install /path/to/aifitnessapi/packages/exercise-adapter`, or copy
`src/index.ts` into your codebase; it imports nothing.

```ts
import { freeExerciseDb, wger, exerciseDbV1, all, type Exercise } from "@aifitnessapi/exercise-adapter";

// Pin a commit: main moves, and image URLs resolve against the same ref.
const fedb = freeExerciseDb({ ref: "f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5" });
const page = await fedb.list({ limit: 20 });       // { items, next, total, skipped }
const more = await fedb.list({ limit: 20, cursor: page.next });

const w = wger();                                   // English names; wger({ language: 1 }) for German
const squat: Exercise | null = await w.get("12");

const edb = exerciseDbV1();
for await (const e of all(edb, { limit: 25 })) {
  // every exercise, page by page; mind the source's rate limits
}
```

A `get` for an id the source does not have returns `null` (both wger and the
free V1 host answer 404). Any other failed response throws a `ProviderError`
with the status and URL.

## The `Exercise` type and where each field comes from

| Field | free-exercise-db | wger exerciseinfo | ExerciseDB V1 (free) |
|---|---|---|---|
| `id` | `id` | `id` (as a string) | `exerciseId` |
| `name` | `name` | the translation's `name` in the requested language | `name` |
| `category` | `category` | `category.name` | null |
| `bodyParts` | [] | [] | `bodyParts` |
| `equipment` | `[equipment]`, or [] when null | `equipment[].name` | `equipments` |
| `primaryMuscles` | `primaryMuscles` | `muscles[].name_en`, else `name` | `targetMuscles` |
| `secondaryMuscles` | `secondaryMuscles` | `muscles_secondary[].name_en`, else `name` | `secondaryMuscles` |
| `instructions` | `instructions` | [] | `instructions` (verbatim, "Step:1 …") |
| `description` | null | the translation's `description` (HTML, verbatim) | null |
| `level` | `level` | null | null |
| `media` | `images[]` under `exercises/` at the ref, as images | `images[].image`, as images | `gifUrl`, as a GIF |
| `license` | Unlicense | `license.short_name`, `license.url`, `license_author` | null |
| `sourceUrl` | the exercise's JSON file on GitHub | `/api/v2/exerciseinfo/{id}/` | `/api/v1/exercises/{exerciseId}` |
| `raw` | the record | the record | the record |

Not mapped, and still in `raw`: free-exercise-db's `force` and `mechanic`;
wger's translations in other languages, aliases, notes, videos, and the license
and author of each translation and image (republishing wger text or images
needs those, per entry); ExerciseDB's paid-tier and V2 fields. A wger record
with no translation in the requested language is left out of `items` and
counted in `skipped`, never given a made-up name.

## How the mappings were checked

Every mapping was written from real responses read on 2026-11-24: free-exercise-db
directly from raw.githubusercontent.com at commit `f00c92c`, wger.de and
oss.exercisedb.dev through the repository's source-snapshot workflow (runs
45495879916, 45496377203 and 45498719063), because both hosts are blocked
where this package was written. Trimmed copies are in `test/fixtures`, with
each URL, date and run in `test/fixtures/sources.json`, and the quotes behind
the field names are in `ops/sources/evidence/packages-exercise-adapter.json`,
which the repository's source-quotes workflow re-reads against the live hosts.

```sh
npm run test:exercise-adapter   # from the repository root; also part of npm test
```

## Publishing (owner only)

To publish: drop `"private": true` from `package.json`, confirm the code
license (MIT here, like `@aifitnessapi/api-client`), build `dist/`, and
`npm publish --access public` from an npm account that owns the
`@aifitnessapi` scope. Nothing in the repository publishes it.
