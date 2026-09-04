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

## Generated data — never hand-edit

These files are output. Editing them by hand works until the next regeneration
silently reverts it.

| File | Regenerate with |
|---|---|
| `src/data/healthkitIdentifiers.ts` | `node scripts/fetch-healthkit-identifiers.mjs` (reads Apple's docs JSON) |
| `src/data/healthkitWritability.ts` | `node scripts/extract-healthkit-writability.mjs` (reads the same cached corpus) |
| `src/data/sdkReleases.ts` | CI only — `.github/workflows/sdk-releases.yml` |
| `public/datasets/*.{json,csv}` + `manifest*.json` | `npm run datasets` (build + manifest) |
| `public/kit/*` | `node scripts/build-kit.mjs` |
| `mcp/data/`, `packages/health-data/data/` | `node scripts/bundle-package-data.mjs` |

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
- Develop and push on `main` only; never force-push; no PRs unless asked.
- Secrets live only in `.env.local` (gitignored), GitHub Secrets, or Vercel
  env — the repo is public.
