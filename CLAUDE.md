# CLAUDE.md — working rules for this repo

## Model split (standing preference, set 2026-08-03)

The owner wants planning and implementation on different model tiers:

- **Plan, decide, and review in the main session** (the owner keeps the
  session on the top tier — do not change it). This covers: what to build,
  research and source verification, adversarial review, interpreting GSC
  data, and the final check of any subagent's output.
- **Implement via subagents pinned to Opus**: when launching Agent-tool
  subagents for volume work — writing page bodies, mechanical/batch edits,
  running builds and tests — pass `model: "opus"` explicitly instead of
  letting them inherit the session model.
- The main session always verifies subagent output itself (writers' claims
  about their own compliance are not evidence) and owns the commit.

## Verification pipeline — the gate is the approval

`npx tsc --noEmit` → `npm run build` → `npm run qa` must all be green before
any commit. Never weaken `scripts/qa.mjs` to make a build pass.

Since 2026-10-04 a machine enforces this instead of memory.
`.github/workflows/ci.yml` runs the same three commands on every pull request
and every push to `main`, and **`main` is protected**: direct pushes are
rejected and the `gates` check must pass before a merge. So the flow is

```
git switch -c <branch> && git push -u origin HEAD
gh pr create --fill && gh pr merge --auto --squash --delete-branch
```

Auto-merge means green merges itself within a minute and deploys as before;
red parks as an open PR. The bots do the same — `sdk-releases.yml` and
`search-snapshot.yml` open PRs rather than pushing.

This exists because the gates were advisory. There is no `prebuild` script, so
Vercel runs a plain `next build`, and three things in early October would have
shipped on that basis: a 170-character description against a 155 cap, a route
silently swallowed by the June redirect list in `next.config.ts`, and a newly
added gate that did not render on `/gates`.

## Generated data — never hand-edit

These files are output. Editing them by hand works until the next regeneration
silently reverts it.

| File | Regenerate with |
|---|---|
| `src/data/healthkitIdentifiers.ts` | `node scripts/fetch-healthkit-identifiers.mjs` (reads Apple's docs JSON) |
| `src/data/healthkitWritability.ts` | `node scripts/extract-healthkit-writability.mjs` (reads the same cached corpus) |
| `src/data/healthConnectRecords.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-health-connect-records.mjs` (Google's data-types page + Jetpack record and permission references; `--offline` reparses `.cache/health-connect`) |
| `src/data/sdkReleases.ts` | CI only — `.github/workflows/sdk-releases.yml` |
| `src/data/libraries.ts` | `node scripts/fetch-libraries.mjs` (npm, pub.dev, PyPI, GitHub; weekly in `.github/workflows/libraries.yml`) |
| `src/data/errorCodes.ts` | `node scripts/fetch-error-codes.mjs` (Apple's HKError.Code docs JSON + Android's HealthConnectException and Jetpack HealthConnectClient references) |
| `src/data/hcReleases.ts` | `node scripts/fetch-hc-releases.mjs` (Google's androidx Health Connect release notes) |
| `src/data/healthkitMetadataKeys.ts` | `node scripts/fetch-healthkit-metadata-keys.mjs` (Apple's metadata-keys docs JSON + Workout Metadata Keys sub-collection + one JSON per key; `--offline` reparses `.cache/healthkit-metadata-keys`) |
| `src/data/healthServicesDataTypes.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-health-services-data-types.mjs` (Jetpack DataType Kotlin reference + Health Services permissions guide, `?hl=en`; `--offline` reparses `.cache/health-services`) |
| `src/data/poseKeypoints.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-pose-keypoints.mjs` (MediaPipe, TF.js, MMPose, Ultralytics and OpenPose source files on raw.githubusercontent.com, ML Kit's PoseLandmark reference, Apple's Vision docs JSON; `--offline` reparses `.cache/pose-keypoints`) |
| `src/data/googleHealthApi.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-google-health-api.mjs` (Google Health API discovery documents v4 + v4beta and 12 developers.google.com/health pages, `?hl=en`; `--offline` reparses `.cache/google-health-api`; a cached file is reused, so delete the cache to re-read; `.github/workflows/google-health-api.yml`, weekly once its schedule is uncommented) |
| `src/data/mcpHealthServers.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-mcp-health-servers.mjs` (every page of the official MCP Registry's v0.1 listing, plus npm and PyPI for the packages it names; `--offline` reparses `.cache/mcp-registry`; `.github/workflows/mcp-health-servers.yml`, schedule paused like `libraries.yml`) |
| `src/data/bluetoothGatt.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-bluetooth-gatt.mjs` (the Bluetooth SIG's public Bitbucket repository: head of `main` via the API, then one archive of that commit — assigned-number UUID lists, units, permitted-characteristics lists, `gss/` structures; `--offline` reparses `.cache/bluetooth-gatt`). Then `npm run datasets`. |
| `src/data/workoutTypes.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-workout-types.mjs` (Apple's HKWorkoutActivityType index and per-case docs JSON; Google's ExerciseSessionRecord, ExerciseSegment, ExerciseSessionType and Health Services ExerciseType references and the Health Connect data-types guide, `?hl=en`; the androidx source those references link as View Source, on `androidx-main`; and `src/data/healthkitIdentifiers.ts` and `src/data/googleHealthApi.ts`, so regenerate those first; `--offline` reparses `.cache/workout-types`). Then `npm run datasets`. |
| `src/data/formRules.ts` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-form-rules.mjs` (licensed open-source exercise trackers on raw.githubusercontent.com, every value captured from a quoted line; `--offline` reparses the cache). Then `npm run datasets`. |
| `src/data/poseBenchmarkResults.ts` | `node scripts/import-pose-benchmark-results.mjs` (issues titled `[pose-benchmark]` that a maintainer labelled `pose-benchmark:accepted`) |
| `src/data/exerciseTaxonomy.ts` + `ops/sources/evidence/tools-exercise-taxonomy-crosswalk.json` | `NODE_USE_ENV_PROXY=1 node scripts/fetch-exercise-taxonomy.mjs` (free-exercise-db's schema.json, exercises.json and LICENSE.md and wger's README on raw.githubusercontent.com; the wger REST API v2 category, equipment and muscle lists and the ExerciseDB v1 API's body-part, equipment and muscle lists, both blocked from the dev environment, so their cache is seeded from a source-snapshot run; and `src/data/workoutTypes.ts`; a cached file is reused, `--offline` reparses `.cache/exercise-taxonomy`). Then `npm run datasets`. |
| `src/data/unifiedSchema.ts`, `public/schema/v1/*` | `NODE_USE_ENV_PROXY=1 node scripts/build-unified-schema.mjs` (reads `src/data/healthkitIdentifiers.ts`, `healthConnectRecords.ts`, `googleHealthApi.ts`, `healthServicesDataTypes.ts` and `workoutTypes.ts`, so regenerate those first; plus Jetpack's HeartRateRecord.Sample and SleepSessionRecord.Stage pages and Apple's docs JSON for HKCategoryValueSleepAnalysis, HKUnit.percent() and a few HKSample/HKWorkout properties; `--offline` reparses `.cache/unified-schema`). Tests: `npm run test:schema-converter`. |
| `src/data/fitbitWebApi.ts`, `ops/sources/evidence/tools-fitbit-to-google-health.json` | `node scripts/build-fitbit-web-api.mjs` (dev.fitbit.com is blocked here: dispatch `source-snapshot.yml` for the reference index, its category pages and every endpoint page, save the job logs to `.cache/fitbit-web-api/*.txt`, then run; reads `src/data/googleHealthApi.ts` for Google's migration tables) |
| `ops/social/posts-<date>.md` | `npm run build && node scripts/social-posts.mjs --date <date>` (one X and one LinkedIn post per change of the last 30 days and per page published in the last 14, from the built pages' own titles and descriptions; not served; see ops/LAUNCH-KIT.md) |
| `src/data/published.ts` | `node scripts/backfill-published.mjs` |
| `src/data/apiDemand.ts` | `node scripts/build-api-demand.mjs` (reads the live pull: `NODE_USE_ENV_PROXY=1 node scripts/search-pull.mjs` in the aifitnessapi environment) |
| `src/data/indexDemand.ts` | `npm run build && node scripts/build-index-demand.mjs`, then build again (after every pull: reads `data/gsc/snapshots/*.json` and the build's page list; noindexes generated per-item pages with zero Google and Bing impressions across their pulls once 60 days old; its dates are a ledger, so never delete the file — see the script header) |
| `public/datasets/*.{json,csv}` + `manifest*.json` | `npm run datasets` (build + manifest) |
| `public/kit/*` | `node scripts/build-kit.mjs` |
| `public/atlas/*` | `npm run datasets && node scripts/build-atlas.mjs` (draws the poster from the directory and changes datasets and `src/data/graveyard.ts`; the PDF is printed by Playwright's Chromium; qa's ATLAS-STALE fails when a product or graveyard entry is missing from it) |
| `public/history/*` | `node scripts/build-history.mjs` (the /history timeline as a poster: `src/lib/historyCore.mjs` draws `src/data/graveyard.ts` and `src/data/changes.ts`, the PNG is rendered by Playwright's Chromium; rerun after either file changes, or qa's HISTORY-STALE fails because the SVG is no longer what the records draw) |
| `AWESOME.md` | `node scripts/build-awesome.mjs` (the directory in `src/data/costModel.ts`, `libraries.ts`, `mcpHealthServers.ts`, `src/lib/toolRegistry.ts` and `public/datasets`, through `src/lib/awesomeList.mjs`, which `/awesome` renders too; rerun after any of those changes; the libraries and MCP workflows run it; qa's AWESOME-STALE fails when stale; never submitted to an external awesome list without the owner) |
| `public/collections/*` | `node scripts/build-collections.mjs` (Postman v2.1 and Bruno collections from `src/data/oauthVendors.ts` and `src/data/webhookPayloads.ts` only, through `src/lib/apiCollections.mjs`; `--check` and `npm run test:collections`; qa's COLLECTIONS fails when stale) |
| `public/cheat-sheets/*` | `node scripts/build-cheat-sheets.mjs` (one-page PDF + PNG for HealthKit, Health Connect and pose keypoints from the generated modules, printed by Playwright's Chromium; a sheet is redrawn only when its data changed, `--force` redraws all; qa's CHEATSHEET fails when stale or a file passes 1.5 MB) |
| `public/webhooks/send-sample.mjs` | `node scripts/build-webhook-sender.mjs` (template `scripts/templates/send-sample.template.mjs` + the documented examples in `src/data/webhookPayloads.ts`; `--check` fails when stale, run by `npm run test:webhook-payloads`) |
| `public/favicon.ico`, `public/icon-192.png`, `public/icon-512.png`, `public/logo.png` | `node scripts/build-icons.mjs` (rasterizes `src/app/icon.svg` with Playwright's Chromium) |
| `mcp/data/`, `packages/health-data/data/` | `node scripts/bundle-package-data.mjs` |
| `packages/api-client/src/schema.ts` | `npm run build && node scripts/build-api-client.mjs` (renders the built `/api/v1/openapi.json`; qa's API-CLIENT-DRIFT fails when they differ, so rerun it after any dataset column change) |

Two rules the generators enforce and a change must not weaken:

- **A short parse fails the build.** Every generator declares how many rows it
  expects and exits non-zero rather than publishing a truncated dataset.
- **Derived fields keep their evidence.** Where a value is inferred from prose
  rather than copied from a field — HealthKit's aggregation style and unit
  family — the sentence it came from is stored beside it, and the value is
  null where the source does not state it. Never guess one.

## Freshness

The site's claim is that it tracks a moving ecosystem, so the age of a
verification stamp is a quality signal, not metadata.

- `npm run stale` ranks every entry by the age of its `updated` stamp. Use it
  to pick what to re-verify; do not pick by what comes to mind.
- `npm run qa` prints the median and oldest age every run.
- Pages render the elapsed time, and flag anything past 90 days.
- Bumping an `updated` stamp without actually re-checking the sources is
  falsifying the one number the reader is trusting. Re-verify or leave it.

### Translations (pt-BR)

Ten money pages have a Brazilian Portuguese edition at `/pt-br/<cluster>/<slug>`
(ops/SEO-10-2026-10-27.md item 10), one file each in
`content/translations/pt-BR/<cluster>/<slug>.md`, rendered by the same
`ClusterPage`. A translation is a rendering of the English page, never a
re-verification: it shows the English `updated` date labelled "(versão em
inglês)", and translating never moves an English stamp.

- **How stale works.** Each file records `sourceHash`, the hash of the English
  entry's translatable text when it was translated (`src/lib/translationStore.mjs`).
  Edit the English page and the hash moves: the translation turns stale on the
  next build by itself — noindex, out of the sitemap and hreflang, a notice in
  Portuguese linking the English page, other translations link English instead.
  English work never waits on a translation. `node scripts/translation-status.mjs`
  lists current and stale pages; `npm run qa` prints the count.
- **How to re-translate.** Translate the English page as it now stands, then
  set `sourceHash` from `node scripts/translation-status.mjs --hash <english path>`,
  `sourceUpdated` to the English `updated`, `translatedOn` to today. Pasting a
  new hash over old Portuguese is the same falsehood as bumping `updated`.
- **What qa holds (PTBR-\*).** Every number, internal link (localized),
  external source, code span and quoted source passage of the English page,
  and nothing added; quoted vendor, licence and agreement text stays in
  English with an optional `[gloss]`; first-party pages carry the translated
  disclosure and name KinesteX exactly as often as English does.
- **Removing an English page** that has a translation: delete the translation
  in the same change (PTBR-ORPHAN). **Translating a page in a new cluster:**
  add `languageAlternates` to that cluster's `[slug]/page.tsx` and a label to
  `HUB_LABELS_PT` in `src/lib/translations.ts`, or PTBR-HREFLANG fails.

## Binding documents

- `ops/GEO.md` — citation/GEO rules; binds every content change. First-party
  (KinesteX) pages must carry the disclosure; never crown our own product.
- `ops/DAILY-CONTENT.md` — the autonomous daily-content playbook, including
  the shared-working-tree preflight and anti-fabrication rules.
- `ops/content-log.jsonl` — append one line per content change so the daily
  routine can dedup against interactive work.

## Hard rules

- Facts need a primary source fetched this session; unverifiable → omit or
  say "could not verify". No prices, limits, versions, or benchmarks from
  memory.
- When a source host is blocked from the dev environment, dispatch
  `.github/workflows/source-snapshot.yml` with a list in `ops/sources/` and
  write from its artifact, citing the original URL and the snapshot's fetch
  date. Snapshots are research copies and are never committed.
- A page written from a snapshot ships with `ops/sources/evidence/<cluster>-<slug>.json`
  (claim, url, verbatim quote per fact); `.github/workflows/source-quotes.yml`
  must be green on the PR before it merges.
- Every change goes through a pull request into `main`; never force-push. The branch ruleset rejects direct pushes and requires the `gates` check, so this is enforced, not advisory. Use auto-merge (`gh pr merge --auto --squash --delete-branch`) to keep unattended runs autonomous.
- Secrets live only in `.env.local` (gitignored), GitHub Secrets, or Vercel
  env — the repo is public.

## Deployment costs

- Batch related, verified edits into one PR update; avoid pushing each generated file separately. Keep required CI and useful application previews enabled.
- `vercel.json` skips builds only for the explicit non-site paths in `scripts/vercel-ignore-build.sh`. Site content, public assets, code, dependencies, configuration, and unknown paths still build. Never put website assets under a skipped path.
- The comparison uses the last successful deployment. Missing history and same-commit redeployments build normally. Set `FORCE_VERCEL_BUILD=1` to force a build after environment or platform changes.
- Keep social production sources and exports outside `public/` unless the website actually serves them. Do not remove published assets or disable security/quality checks to save build minutes.
