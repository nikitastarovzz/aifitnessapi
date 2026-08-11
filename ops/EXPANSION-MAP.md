# Expansion map — the doubling program (started 2026-08-12)

Goal: double the site's content at the standing quality bar. Two tracks:
~100 new pages that each own an unclaimed question, plus depth upgrades to
the ~30 highest-potential existing pages. Executed in waves (interactive
sessions) and singles (the daily routine), never in bulk dumps — bulk thin
content is a sitewide quality penalty, and one fabricated page costs more
than a hundred good ones earn (ops/GEO.md).

**Rules.** Every item below was checked against the full slug inventory for
cannibalization before listing. Before writing any item, re-confirm no
existing page owns its question. Verifiability tags decide sequencing:
- **A** — primary source reachable from the dev environment now
  (developer.apple.com JSON endpoints, developer.android.com, GitHub,
  registries). Write any time.
- **B** — fully sourceable from already-verified on-site pages (reuse).
  Write any time; no new facts beyond the corpus.
- **C** — needs vendor/regulator sites the proxy blocks. Hold until a
  session or runner has access, or write only with heavy could-not-verify
  framing. Never promote a C to publication by relaxing sourcing.

One tranche per session-wave; one item per daily-routine run (see
DAILY-CONTENT §2c). Mark items done with the date; the content log is the
ledger of record.

## Tier 1 — write next (54 items)

### /data — metric pages (8) — the platform-store pattern: HK + HC type
identifiers verified from Apple JSON + developer.android.com, per-vendor
availability from on-site pages only.
- [x] menstrual-cycle-api (A) 2026-08-12
- [x] blood-glucose-api (A) 2026-08-12
- [x] blood-pressure-api (A) 2026-08-12
- [x] respiratory-rate-api (A) 2026-08-12
- [ ] resting-heart-rate-api (A)
- [ ] skin-temperature-api (A)
- [ ] hydration-api (A)
- [ ] mindfulness-sessions-api (A)

### /fix — exact-error pages (5) — the proven GSC winner pattern.
- [x] strava-api-401-unauthorized (B) 2026-08-12
- [x] healthkit-background-delivery-not-working (A) 2026-08-12
- [ ] whoop-api-401-and-token-rotation (B)
- [ ] health-connect-securityexception (A/B — androidx quote already on /test)
- [ ] strava-api-429-rate-limit (B — only if limits are on-site; else C)

### /integrate (2)
- [x] polar-api (A — github.com/polarofficial AccessLink docs) 2026-08-12
- [ ] withings-api (A-check — confirm GitHub org carries API docs first)

### /compare (4) — all B, facts already on-site for both sides.
- [ ] apple-watch-vs-garmin
- [ ] polar-vs-garmin
- [ ] rook-vs-spike
- [ ] usda-fooddata-central-vs-open-food-facts

### /learn (5) — B; definitions + on-site synthesis, judgement labelled.
- [x] what-is-rpe (B — long-standing backlog item) 2026-08-12
- [ ] webhooks-vs-polling-for-fitness-data
- [ ] what-are-oauth-scopes
- [ ] what-is-rate-limiting-in-fitness-apis
- [ ] what-is-edge-processing

### /build (3) — B; the app-type playbook pattern.
- [ ] cycling-app
- [ ] hiit-interval-training-app
- [ ] sleep-coaching-app

### /ai (4) — B; the rules-engine-plus-language-layer doctrine extended.
- [ ] structured-output-for-workout-plans
- [ ] rag-vs-fine-tuning-for-fitness
- [ ] voice-ai-coaching
- [ ] prompt-injection-in-fitness-apps

### /architecture (4) — B.
- [ ] api-versioning-for-health-data
- [ ] multi-tenant-health-data
- [ ] caching-fitness-api-responses
- [ ] streaming-vs-batch-ingestion

### /test (3) — B.
- [ ] contract-testing-provider-apis
- [ ] load-testing-webhook-ingestion
- [ ] synthetic-health-data-generation

### /pricing (2)
- [ ] polar-api-pricing (B — sourced absence + self-serve facts on-site)
- [ ] fitness-api-free-tiers-compared (B — derived from the 2026 dataset)

### /motion (2)
- [ ] camera-ux-and-framing-for-pose (B)
- [ ] hand-and-gesture-tracking (A-check — MediaPipe hands docs on GitHub)

### /guides (3)
- [ ] watchos-workout-app (A — HealthKit/WorkoutKit JSON endpoints)
- [ ] wear-os-health-services (A — developer.android.com)
- [ ] health-data-export-features (B)

### /alternatives (3) — quickpose/sency pages are first-party-adjacent:
same disclosure bar as the kinestex pages.
- [ ] mediapipe-alternatives (B)
- [ ] quickpose-alternatives (B, firstParty treatment)
- [ ] sency-alternatives (B, firstParty treatment)

### /migrate (1)  /fitness-apis (1)
- [ ] healthkit-only-to-cross-platform (B)
- [ ] running-apis (B roundup: Strava/Garmin/Polar, facts on-site)

## Tier 2 — write when access or demand arrives (~45 items, sketch)
Vendor deep pages blocked by proxy today (C): suunto-api, rook-api,
spike-api, junction-api, coros; compliance expansions requiring regulator
text (ftc-health-breach-notification, eu-ai-act-for-fitness); stress/
body-battery metric page (vendor-proprietary definitions); additional
vs. pages and error pages as GSC surfaces demand. The daily routine
promotes Tier-2 items only with a fetched primary source or ≥20
impressions of query evidence.

## Depth-upgrade track (~30 items)
The 30 pages with the most impressions in each GSC pull get depth passes
(new sections answering surfaced near-miss queries, worked examples, one
new unique FAQ) — one per routine run when rung (a)/(b) has no candidate.
This is content-doubling without cannibalization; log as action:"section".

## Bookkeeping
- Interactive waves: mark [x] with date; append to ops/content-log.jsonl.
- The daily routine reads this file (DAILY-CONTENT §2c) and may take the
  top unchecked Tier-1 item as its piece when data rungs are empty.
- Re-verify this map monthly against the slug inventory; remove anything
  an existing page has grown to own.
