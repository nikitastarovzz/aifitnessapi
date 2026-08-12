# Health App Launch Checklist
From aifitnessapi.com/ai-fitness-app — the ship checklist, printable form.

## Data correctness
- [ ] Daily rollups group on a STORED civil local date; DST days in fixtures
- [ ] Absence stored as absence with a reason; no code path zero-fills
- [ ] Overlapping sources resolved interval-wise, not summed per source
- [ ] Fixtures include: overlaps, clock skew, retro-edits, gaps, denied reads

## Integrations
- [ ] 401 → exactly one refresh + one retry; rotated refresh token persisted FIRST
- [ ] Webhook ingest idempotent on delivery id; versioned replace writes
- [ ] Backfill resumable + checkpointed; rate-limit failures degrade, never skip
- [ ] Per-provider freshness monitoring (the dominant failure mode is silence)

## Camera pipeline (if any)
- [ ] Every frame enters through an injectable source; a clip drives CI
- [ ] Rep counting scored per clip (precision AND recall), never aggregate totals
- [ ] Thermal soak on physical device gates the build
- [ ] Keypoint drift scored per keypoint against a pinned model revision

## Compliance & stores
- [ ] Privacy policy in-app AND in the listing, accurate to actual behavior
- [ ] Deletion reaches rollups, caches, logs, AND the upstream OAuth grant
- [ ] Play Console health-data declaration filed (if Health Connect)
- [ ] Explicit disclosure + permission before health data reaches any LLM API
- [ ] Encrypted in transit and at rest; least-privilege access

## AI features (if any)
- [ ] Deterministic safety gate runs BEFORE the model, on whole conversation
- [ ] Every generated plan validates server-side against catalogue + user caps
- [ ] Golden evaluation set frozen before launch; grader runs unattended
- [ ] Per-user token arithmetic fits subscription margin

(C) aifitnessapi.com — CC BY 4.0
