# Daily content routine — playbook

You are running the daily autonomous content addition for AIFitnessAPI. You have
standing authorization to push ONE data-driven improvement to `main` per run,
without human approval. That authorization is conditional on following this
playbook exactly — the site's entire value is that it does not fabricate, and a
single confidently-wrong page costs more than a month of good ones.

**Output contract: ONE piece per day, done to cluster quality. "No piece today,
here is why" is an acceptable and sometimes correct outcome. Sixteen mediocre
pieces is never the assignment.**

## 1. Get the data

In order of preference:
1. **Live GSC** — if `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and
   `FIREBASE_PRIVATE_KEY` exist in the environment, query the Search Console API
   directly (service account JWT → `webmasters` scope; see
   `scripts/export-signups.mjs` for the token pattern; property is
   `sc-domain:aifitnessapi.com`). Pull 28 days: by query, by page, by
   query+page. Then REFRESH `data/gsc/latest.json` with what you pulled and
   include it in your commit.
2. **Committed snapshot** — otherwise use `data/gsc/latest.json` and note its
   `exportedAt` age in your log entry. If it is older than 21 days, prefer
   backlog work (§3c) over data work, because you would be optimizing against
   stale signals.
3. **Bing** — only if a `BING_WEBMASTER_API_KEY` env var exists. Do not block on
   its absence.
Vercel Analytics has no API; it is not part of this loop.

## 2. Decide the ONE piece — priority order

Log candidates before choosing. Work down this list; take the first rung with a
qualifying candidate:

a. **Fix a leak.** A page with ≥30 impressions and CTR under 1% over 28 days →
   rewrite its metaTitle/metaDescription to match the queries it actually
   surfaces for (check `byQueryPage` pairs). Cheapest, highest-certainty win.
b. **Answer a near-miss query.** A query with ≥10 impressions where the ranking
   page does not directly answer it → add ONE FAQ (or a short section) to that
   page answering it in the page's voice. Check the FAQ against the site-wide
   uniqueness gate FIRST (the qa script's normalizer).
c. **Fill a proven gap.** A query theme with ≥20 combined impressions and no
   matching page → add ONE new spoke to the owning cluster. This is the most
   expensive option; only take it when (a) and (b) have no candidates, and never
   add a second spoke to the same cluster within 7 days (check
   `ops/content-log.jsonl`).
d. **Backlog.** No qualifying data candidates → take the top unchecked item from
   `ops/BACKLOG.md` if it can be done to full quality within this session;
   otherwise improve internal linking into the 5 pages with the most impressions
   (log which), or refresh `data/gsc/latest.json` alone.

Never choose: anything touching `/api/*`, `src/lib/firestore.ts`, the signup
form, CI workflows, or dependencies. Content only.

## 3. Research before writing — non-negotiable

- New factual claims need a reachable primary source, fetched THIS run.
  `developer.apple.com` (use the `/tutorials/data/documentation/<path>.json`
  endpoint — the HTML is JS-rendered and comes back empty), `developer.android.com`,
  and GitHub are reachable through the proxy; most other hosts 403. Do not route
  around the proxy or disable TLS.
- Something you cannot verify: omit it, or state plainly that it is
  undocumented. NEVER write from memory: prices, rate limits, quotas, versions,
  benchmark numbers, statistics, API symbols, regulatory claims (FDA / EU AI
  Act / store rule numbers). If your draft contains a number and you cannot name
  the source you fetched today, delete the number.
- Voice: "Apple documents… / Google documents…" for sourced facts; "in our
  experience / our recommendation" for judgement, said explicitly.
- Read the target cluster's data file header and 2–3 sibling entries first;
  match register. Respect each cluster's boundary rule (stated in its
  `src/data/*.ts` header comment).

## 4. Mechanics

- Spoke pages live as JSON-in-TS arrays in `src/data/<cluster>.entries.ts`
  (edit directly; headers say whether hand-editing is expected — for all
  clusters it now is) plus a release-gate Set in `src/data/<cluster>.ts` for
  new slugs. Sitemap, llms.txt and llms-full.txt generate from the release
  sets automatically — no manual wiring.
- New spoke checklist: entry object with slug, primaryQuery, h1,
  metaTitle ≤60 chars, metaDescription ≤155 (count them), updated = today,
  answer capsule (2–4 plain sentences; do NOT restate it as the body's first
  paragraph — the template renders the capsule directly above the body), body
  (GFM; no raw `<`,`>`,`{`,`}` in prose; no `#` H1; balanced fences), 3–5 FAQs
  unique site-wide, related links, cta. Add slug to the release gate. Add a
  per-slug case to the cluster's `[slug]/opengraph-image.tsx`? No — it is
  generated from the release set automatically. 3–5 body links from existing
  pages only (verify each path exists in `src/data/` or `src/app/`), with
  descriptive anchor text, never a bare URL path.

## 5. Verify — the gate is the approval

1. `npx tsc --noEmit` — clean.
2. `npm run build` — green.
3. `npm run qa` — ZERO issues. This gate (phantom links, meta lengths,
   duplicate titles/descriptions, duplicate FAQs site-wide, JSON-LD) is the
   thing standing in for human review. Never weaken `scripts/qa.mjs` to make
   it pass.
4. Self-review your diff adversarially before committing: every number has a
   source fetched today; every API symbol appears in a source; no claim
   contradicts an existing page (grep for the topic across `src/data/`).
   If you used a subagent to write, verify its output yourself — writers'
   claims about their own compliance are not evidence.

## 6. Ship and log

- ONE commit, pushed to `main` with `git push -u origin main` (retry up to 4
  times with 2s/4s/8s/16s backoff on network failure). Never force-push, never
  touch other branches, never open a PR.
- Commit message: what changed and WHICH DATA SIGNAL motivated it (query,
  impressions, CTR). Follow the environment's commit-trailer instructions.
- Append one line to `ops/content-log.jsonl` in the same commit:
  `{"date","action":"meta-fix|faq|section|spoke|backlog|none","cluster","slug","signal","notes"}`
  Read this log BEFORE deciding (§2) — do not repeat recent work, and if the
  last 3 runs were all (c)-rungs, prefer (a)/(b) today.
- If the gate cannot be made to pass within this session: push NOTHING except
  the log entry recording the failure. A skipped day is fine; a broken deploy
  or a fabricated fact is not.

## 7. Hard limits

- Max ONE new spoke per run; max ~3 files touched for a meta-fix/FAQ run.
- Never delete or rename existing pages or slugs.
- Never edit pricing/model/regulatory specifics on existing pages unless you
  fetched the primary source this run and the commit message links it.
- If anything in the repo looks unexpectedly broken (failing build BEFORE your
  change, merge conflicts), stop, push only a log entry, and say so in your
  summary — do not "fix" pre-existing state autonomously.
