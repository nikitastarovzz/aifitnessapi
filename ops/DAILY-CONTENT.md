# Daily search loop — playbook

You are running the daily search loop for AIFitnessAPI (loop 1 of
ops/AUTOMATION.md; the index governor, loop 2, is its first step). You have
standing authorization to ship data-driven improvements through ONE pull
request per run that merges itself when the gates are green, without human
approval. That authorization is conditional on following this playbook
exactly — the site's entire value is that it does not fabricate, and a
single confidently-wrong page costs more than a month of good ones.

**Output contract (since 2026-11-14, owner's request): up to THREE changes per
run, each done to cluster quality, in one pull request. At most one of the
three is a new page, and only when the index governor allows it (§1). The
other two are fixes to pages that already exist: that is where the measured
clicks are (ops/QUEUE.md). "Nothing today, here is why" is an acceptable and
sometimes correct outcome. Sixteen mediocre pieces is never the assignment.**

Why new pages are rationed. Of the 219 pages published from 2026-10-02 to
2026-10-18, Google showed 166 within a week of publication. Of the 62
published from 2026-10-22 to 2026-11-05, it showed 5 (measured 2026-11-14;
`ops/INDEX.md` has today's table). A page Google does not
show earns nothing however good it is, and publishing into that state is the
likeliest way to keep it going. The governor measures this every run and
sets the day's allowance; you do not override it.

## 0. Preflight — you may share this working tree with another session

**Pause switch.** If the file `ops/AUTOMATION-PAUSED` exists on `main`, stop
here: report that the automation is paused and what the file says. Change
nothing.

**History.** A cloud session starts from a shallow clone, and
`scripts/backfill-published.mjs` reads first-published dates from the whole
commit history. Run `git rev-parse --is-shallow-repository`; if it prints
`true`, run `git fetch --unshallow origin` before anything else. Then `npm ci`.

This routine can fire into a shared environment; an interactive session (or a
previous run) may have left the tree dirty. Before doing anything:

1. `git fetch origin main` then `git status --porcelain`.
2. If the tree is CLEAN: `git merge --ff-only origin/main` and proceed.
3. If the tree is DIRTY: do NOT `git reset --hard` or `git clean` — that would
   destroy another session's in-progress work. Instead move the stray files
   aside without deleting them: `mkdir -p .parked && git stash push -u -m
   "daily-routine parked $(cat /dev/urandom | head -c 4 | od -An -tx1 | tr -d ' ')"`
   is acceptable ONLY if you first confirm nothing there is mid-edit by a live
   session — when in doubt, push only a log entry noting "tree dirty, skipped"
   and stop. A skipped day is free; clobbering a teammate's work is not.
4. Never `git push --force`. Only ever fast-forward or add new commits.

## 1. Get the data

In order of preference:
1. **Live pull (since 2026-10-12)** — in the aifitnessapi cloud environment, run
   `NODE_USE_ENV_PROXY=1 node scripts/search-pull.mjs`. It reads Search Console
   through the environment proxy's read-only credential (send no Authorization
   header; never request Firebase keys for this) and Bing through
   `BING_WEBMASTER_API_KEY`, for the last 28 days of final data, and writes
   `data/gsc/latest.json` (with a country × device breakdown),
   `data/gsc/snapshots/<date>.json`, `data/gsc/bing-latest.json` and
   `ops/gsc/bing-<date>.csv`. Include those files in your commit.
2. **Committed snapshot** — if the pull fails (outside that environment the
   Search Console call answers 401/403), use `data/gsc/latest.json` and note its
   `exportedAt` age in your log entry. If it is older than 21 days, prefer
   backlog work (§3c) over data work, because you would be optimizing against
   stale signals.
**Cadence (since 2026-11-14).** The windows are 28 days long, so a pull a
day apart says the same thing twice and would add a snapshot file a day.
Run the pull only when the newest file in `data/gsc/snapshots/` is seven or
more days old; on the other days work from the committed pull. This run is
what replaces the Monday workflow (`search-snapshot.yml` skips for want of a
repository secret). After a pull, in this order: `npm run build`,
`node scripts/build-index-demand.mjs`, `node scripts/build-api-demand.mjs`,
and commit what they change with the pull (CLAUDE.md, generated data).

Then, every run:

1. `node scripts/backfill-published.mjs` — the governor judges pages by their
   first-published date, and a page added since the last regeneration is
   missing from `src/data/published.ts` until this runs.
2. **The index governor** (loop 2):
   `NODE_USE_ENV_PROXY=1 node scripts/index-governor.mjs --sitemap-url https://aifitnessapi.com/sitemap.xml`.
   It reads Search Console for the day each page was first shown, and writes
   `data/gsc/first-seen.json` (a ledger), `data/gsc/index-state.json` and
   `ops/INDEX.md`. Commit all three. Read `newPagesToday` in the state file:
   **0 means this run adds no new page, whatever the queries say.** The
   verdicts: `open` (half or more of the pages published 7 to 21 days ago
   were shown within a week: up to seven new pages a week, one per run),
   `throttled` (a fifth to a half: two a week), `closed` (under a fifth: one
   a week, kept as the probe that lets the governor see a recovery). Pages
   published by interactive sessions count against the same weekly
   allowance, so the loop yields to them. If the governor exits non-zero (a
   refused credential or a short read), treat the day as `newPagesToday: 0`
   and say so in the report; never guess a verdict.
3. `node scripts/build-ops-queue.mjs` when the build exists (it reads the
   built sitemap), so `ops/QUEUE.md` matches the data you are about to act on.
4. `node scripts/judge-changes.mjs` — the changes of earlier runs that have
   now had a full 28-day window (§6 "measure"). A `worse` retitle with
   `action: revert` is today's first change: restore the title and
   description recorded in its `measure.previous`, and log it. Run it again
   with `--record` before committing so each judged entry is marked.
5. `npm run gsc`. It reports Google and Bing separately; never average
   them. Vercel Analytics has no API; it is not part of this loop.

## 2. Decide the day's changes — priority order

Log candidates before choosing. Up to three changes: work down this list
and take candidates in rung order until you have three, or the list is
exhausted, or the session's research budget is. Rungs (a) and (b) can each
supply more than one change, on different pages. Rung (c), and a new page
from §2c, supplies at most one, and none when the governor's
`newPagesToday` is 0. `ops/QUEUE.md` ranks rung (a)'s candidates by clicks
at stake: start from its top, skip its "Held" list, and skip any page
`ops/content-log.jsonl` shows was changed in the last 28 days (a second
change inside the window makes the first unjudgeable).

a. **Fix a leak.** A page in `npm run gsc`'s "earning under half what their
   position should pay" list (≥20 impressions, CTR below half the CTR its
   position pays) → rewrite its metaTitle/metaDescription to match the queries it
   actually surfaces for (check `byQueryPage` pairs). Cheapest, highest-certainty
   win. Judge it against clicks lost for its position, never against raw CTR:
   US desktop was 42% of Google impressions at 0.26% CTR in the 28 days to
   2026-10-09, so raw page CTR mostly measures how much US desktop a page gets.
   Before acting, read the report's property CTR line with and without US
   desktop; page-level rows cannot be split by country without losing the
   withheld queries, so that property line is the honest check.
b. **Answer a near-miss query.** A query with ≥10 Google impressions, or ≥5 Bing
   impressions, where the ranking page does not directly answer it → add ONE FAQ
   (or a short section) to that page answering it in the page's voice. Bing
   names the query behind nearly every click while Google withholds most, so
   read `data/gsc/bing-latest.json` (`byQuery`) as first-class evidence, kept
   separate from Google's numbers — never add the two engines' counts together.
   Check the FAQ against the site-wide uniqueness gate FIRST (the qa script's
   normalizer).
c. **Fill a proven gap.** A query theme with ≥20 Google impressions, or ≥10 Bing
   impressions, and no matching page → add ONE new spoke to the owning cluster.
   Bing's long, six-word-plus queries often state the developer's task exactly;
   use them to shape the page. This is the most
   expensive option; only take it when (a) and (b) have no candidates, and never
   add a second spoke to the same cluster within 7 days (check
   `ops/content-log.jsonl`).
d. **Backlog.** No qualifying data candidates → take the top unchecked item from
   `ops/BACKLOG.md` if it can be done to full quality within this session;
   otherwise improve internal linking into the 5 pages with the most impressions
   (log which), or refresh `data/gsc/latest.json` alone.

**Format default (decided 2026-10-12, ops/GROWTH-30-2026-10-12.md #1):** new
pages are commercial-investigation formats for vendors with query demand —
/alternatives, /pricing, and head-to-head comparisons (/compare, vendor-named
/fitness-apis pages). Clicks per page over the 28 days to 2026-10-10:
/alternatives 2.50, /pricing 2.08, /motion 1.29, /fitness-apis 1.27,
/integrate 1.00; /build, /blog, /apis, /tools, /questions,
/health-connect-api, /healthkit-queries and /phone-sensors 0 to 0.04 across
146 pages. **No new reference cluster starts before the October clusters'
day-28 review on 2026-10-31** (GROWTH-30 #30); until then rung (c) adds
spokes to existing clusters only, commercial formats first.

**Proven patterns (from live GSC, updated 2026-08-02) — when candidates tie,
prefer these; the data says they work for us:** pricing-intent pages (the
/pricing cluster earns clicks at the highest rate), aggregator comparisons
(terra-vs-vital converts ~10% CTR), exact-error-string /fix pages (garmin
approval, fitbit 401), and pose-model comparisons (/motion is rising, and it
is the most strategically valuable cluster). Conversely, do not invest in
queries below position ~30 expecting CTR fixes to help — position work is
content depth, not metadata.

Never choose: anything touching `/api/*`, `src/lib/firestore.ts`, the signup
form, CI workflows, or dependencies. Content only.

## 2b. GEO is binding

Read `ops/GEO.md` once per run. Every page you add or edit must satisfy its
rules — quotable capsule, unique FAQs, dated volatile claims, in-prose source
attribution, and membership in a cluster data module so the machine surfaces
(llms.txt, /md mirrors, search) wire automatically. The GEO-* gates in qa.mjs
enforce the mechanical half; never weaken them.

## 2c. The expansion map

`ops/EXPANSION-MAP.md` is the vetted backlog of the doubling program. When
rungs (a) and (b) have no qualifying data candidate, take the TOP UNCHECKED
Tier-1 item from the map instead of free-form rung (c) work: its
cannibalization check is already done and its verifiability tag tells you
whether the sources are reachable. Mark it [x] with the date in the same
commit. Tier-2 items need a fetched primary source or ≥20 impressions of
query evidence before writing. A map item is a new page: it needs the
governor's `newPagesToday: 1` like any other, and counts as the run's one.

## 2d. The changes tracker

`src/data/changes.ts` is the public record behind the subscribe promise.
Whenever a run verifies a DATED ecosystem change (a deprecation date, a
terms change, a model release/freeze, a deadline firming up or moving),
append a ChangeEvent in the same commit — status graded by the file's
rules, never sharper than the source page. Updating an existing entry's
status from reported to confirmed (with the new source) is a first-class
piece for rung (a).

Two posters are drawn from this file and `src/data/graveyard.ts`, and qa
fails when they lag (HISTORY-STALE, ATLAS-STALE). After any edit to either
file — a new entry, a status change, even a `verifiedOn` bump — run
`npm run datasets && node scripts/build-atlas.mjs && node scripts/build-history.mjs`
before the gates, and commit the regenerated `public/atlas/*` and
`public/history/*` with the change. A new graveyard entry also needs a
scanner rule or a `NOT_SCANNED` reason in `src/data/deprecationSignatures.ts`,
then `node scripts/build-deprecation-rules.mjs` (qa's DEPRECATION-RULES-STALE);
a new tool, dataset, library or MCP server needs `node scripts/build-awesome.mjs`
(AWESOME-STALE).

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
- Year markers follow the stamp. A year in parentheses in a metaTitle, title
  or h1 ("(2026)", "(2026 Guide)") claims the page is current as of that
  year, so qa's YEAR-MARKER gate holds it to the year of the page's newest
  dateModified (for a spoke, its `updated` stamp). When a re-verification
  moves a stamp into a new year, move the marker to that year in the same
  commit, or drop the marker. Never change the year alone, and never move a
  stamp to satisfy the gate without re-checking every claim on the page: an
  un-re-verified page keeps the year it was verified in. A year outside
  parentheses ("Since 2024", "State of Fitness APIs 2026") is the subject and
  is not judged.

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

- ONE commit on a new branch, pushed with `git push -u origin HEAD` (retry up
  to 4 times with 2s/4s/8s/16s backoff on network failure), then a pull
  request into `main` with auto-merge (squash), as CLAUDE.md sets out: `main`
  is protected, rejects direct pushes and merges only when the `gates` check
  passes. Never force-push, never touch other branches.
- Commit message: what changed and WHICH DATA SIGNAL motivated it (query,
  impressions, CTR). Follow the environment's commit-trailer instructions.
- Append one line per change to `ops/content-log.jsonl` in the same commit:
  `{"date","action":"meta-fix|faq|section|spoke|backlog|revert|none","cluster","slug","signal","notes","measure"}`
  Read this log BEFORE deciding (§2) — do not repeat recent work, and if the
  last 3 runs were all (c)-rungs, prefer (a)/(b) today.
- **`measure` is what makes the loop learn.** Every change to a page carries
  `"measure": {"path": "/cluster/slug", "kind": "retitle|faq|section|new-page", "before": {...}}`
  where `before` is exactly what `node scripts/judge-changes.mjs --before /cluster/slug`
  prints (the page's impressions, clicks and position in the current pull;
  zeros for a new page). A retitle also records
  `"previous": {"metaTitle": "...", "metaDescription": "..."}`, the strings
  it replaced, so a later run can put them back. A retitle also goes into
  `ops/gsc/retitled.txt` under a dated comment line, which is what holds the
  page out of the queue until it has had a full window.
- One pull request for the whole run: the governor's three files, the pull
  when there was one, the changes and the log lines. Title it with the date
  and what changed; the body lists each change with its data signal and the
  governor's verdict line.
- If the gate cannot be made to pass within this session: push NOTHING except
  the log entry recording the failure. A skipped day is fine; a broken deploy
  or a fabricated fact is not.

## 7. Hard limits

- Max THREE changes per run; max ONE new page per run, and zero when the
  governor's `newPagesToday` is 0; max ~3 files touched per meta-fix or FAQ.
- Never edit `scripts/index-governor.mjs`, its thresholds, `ops/INDEX.md`
  or the two files under `data/gsc/` it writes to get a different verdict.
  A verdict you think is wrong goes in the report for the owner.
- Never delete or rename existing pages or slugs.
- Never edit pricing/model/regulatory specifics on existing pages unless you
  fetched the primary source this run and the commit message links it.
- If anything in the repo looks unexpectedly broken (failing build BEFORE your
  change, merge conflicts), stop, push only a log entry, and say so in your
  summary — do not "fix" pre-existing state autonomously.
