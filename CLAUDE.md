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
