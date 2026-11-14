# Automation — the four loops

Set up 2026-11-14 at the owner's request ("5 big automations ... go ahead and
do the first 4"). The goal they set: ten times the search impressions and a
higher click-through rate within three months. This file is the map: what
runs, when, what each run is allowed to do, and what only the owner can do.
Each loop's own playbook binds its runs; CLAUDE.md and ops/GEO.md bind all of
them.

## Where it started

Google, 28 days to 2026-11-11, read live 2026-11-14: 24,763 impressions,
293 clicks, 1.18% CTR, average position 9.9. Bing, same window: 1,566
impressions, 32 clicks.

Three findings shaped the loops:

1. **Google stopped showing new pages.** Of the 219 pages published from
   2026-10-02 to 2026-10-18, 166 drew a first impression within a week. Of
   the 62 published from 2026-10-22 to 2026-11-05, 5 did (`ops/INDEX.md` has
   the table, regenerated daily). The ten pt-BR pages of
   2026-10-27 have no impression at all. So a loop that adds pages every day
   would mostly add pages nobody is shown.
2. **The clicks at stake are on pages that already rank.** 18,842 of the
   impressions sat at positions 4-10 and earned 234 clicks. `ops/QUEUE.md`
   ranks the pages by what a better snippet or a re-verification is worth.
3. **Nothing had been distributed.** Both npm packages answered "Not found"
   on the registry, the dataset repository did not exist, and nothing in the
   launch kit had been posted. Ranking for head terms ("fitness api" at 27,
   "whoop api" at 24) takes links, and no on-site schedule earns those.

## The loops

| # | Loop | Runs | Playbook | Ships |
|---|---|---|---|---|
| 1 | **Daily search loop**: up to three changes from the search data, at most one of them a new page | scheduled task, daily 03:11 UTC | ops/DAILY-CONTENT.md | one self-merging pull request |
| 2 | **Index governor**: measures whether Google is showing new pages, sets loop 1's new-page allowance, lists URLs for the owner to request indexing | first step of loop 1 | `scripts/index-governor.mjs` (header), ops/DAILY-CONTENT.md §1 | `ops/INDEX.md`, `data/gsc/index-state.json`, `data/gsc/first-seen.json` in loop 1's pull request |
| 3 | **Vendor watch**: trackers on GitHub's runners, a daily source-drift feed, and a daily session that corrects what moved and re-verifies the stalest page | trackers on their own schedules (below); `source-quotes.yml` daily 06:17 UTC; scheduled task daily 07:43 UTC | ops/VENDOR-WATCH.md | one self-merging pull request, plus the trackers' own |
| 4 | **Weekly distribution**: packages and datasets publish on change; a Monday session picks the week's posts and drafts vendor notes | `publish-packages.yml` and `dataset-mirror.yml` on push; scheduled task Mondays 05:26 UTC | ops/WEEKLY-DISTRIBUTION.md | an `ops/`-only pull request; Gmail drafts |

Loop 5 of the proposal (a monthly data report from `/research`) was not
asked for and is not built. `node scripts/build-research.mjs` still stops on
commit 69969e2 (ops/GSC-10-2026-11-13.md, "Not done").

### Tracker schedules (loop 3)

Paused 2026-10-06 because their pull-request step was refused ("GitHub
Actions is not permitted to create or approve pull requests") and every run
emailed a failure. On again 2026-11-14, shipping through `scripts/bot-pr.sh`:
a refused pull request ends the run green and leaves the `bot/` branch for
the vendor-watch session to open; an allowed one also dispatches `ci.yml`,
which a pull request opened with `GITHUB_TOKEN` never starts by itself.

| Workflow | Schedule (UTC) |
|---|---|
| `sdk-releases.yml` | daily 06:20 |
| `libraries.yml` | Tuesday 04:37 |
| `mcp-health-servers.yml` | Wednesday 05:13 |
| `bluetooth-gatt.yml` | Wednesday 05:33 |
| `google-health-api.yml` | Wednesday 05:52 |
| `source-quotes.yml` | daily 06:17; the scheduled run reports and ends green, a pull request or manual run still fails on a missing quote |

Left off, each for a reason that is the owner's to settle:

- `uptime.yml`: every run fails on its signup-storage probe.
  `/api/signup/health` answered 503 on 2026-11-14 because the three
  `FIREBASE_*` variables are not set in production. Set them in Vercel, or
  decide the probe should go; then uncomment the schedule.
- `external-links.yml`: its 2026-11-14 manual run found dead links, which
  another session is fixing. A schedule today would fail until that lands.
- `search-snapshot.yml` stays scheduled and keeps skipping for want of
  `GSC_SERVICE_ACCOUNT_JSON`. Loop 1 does the weekly pull from the cloud
  environment instead, so the secret is no longer needed for that.

## Rules every run shares

- **Pause switch.** A file named `ops/AUTOMATION-PAUSED` on `main` stops
  every scheduled session at its preflight. Create it from the GitHub web
  UI with one line saying why; delete it to resume. The tracker workflows
  are paused by commenting out their `schedule:` blocks, as before.
- **One pull request per run**, auto-merge (squash), gates green. Red parks
  as an open pull request; the next run reports it and does not pile a
  second one on the same files.
- **Facts come from a primary source fetched in that run.** No price, limit,
  version or benchmark from memory; unverifiable means omitted.
- **Nothing outward-facing without the owner.** No post, no sent email, no
  issue or pull request on another repository, no new repository.
- **Never touched by a scheduled run:** `/api/*`, `src/lib/firestore.ts`,
  the signup form, CI workflows, dependencies, `scripts/qa.mjs`, the
  governor's thresholds. A run that thinks one of these is wrong says so in
  its report.
- **Build cost.** Loops 1 and 3 each merge one site-changing pull request a
  day at most, so at most two production builds a day from automation;
  loop 4 touches only `ops/`, which Vercel skips.

## What only the owner can do

In order of what it unlocks:

1. **Request indexing.** Each run of loop 1 rewrites the list at the top of
   `ops/INDEX.md`: up to ten URLs, most valuable first, for Search Console's
   URL Inspection → Request indexing (Search Console caps how many it
   accepts a day). The environment's credential cannot reach URL
   Inspection, so the governor infers "shown" from impressions and cannot
   tell "crawled, not indexed" from "not discovered"; a look at two or three
   of the listed URLs in URL Inspection would say which it is.
2. **npm.** Create the `@aifitnessapi` organization on npmjs.com, make a
   granular access token with read and write on it, and add it as the
   repository secret `NPM_TOKEN`. `publish-packages.yml` does the rest.
3. **Dataset repository.** Create an empty public repository, set the
   repository variable `DATASET_MIRROR_REPO` to `owner/name`, and add a
   fine-grained token with Contents read and write on it as the secret
   `DATASET_MIRROR_TOKEN`. `dataset-mirror.yml` fills it and keeps it in
   step.
4. **Post and send.** Mondays: five posts in `ops/social/week-<date>.md`,
   vendor notes waiting as Gmail drafts.
5. **Optional.** Settings → Actions → General → "Allow GitHub Actions to
   create and approve pull requests" lets the trackers open their own pull
   requests instead of waiting for the vendor-watch session.

## How it is judged

Re-read on 2026-12-12 (the first full 28-day window that starts after the
loops did), 2027-01-09 and 2027-02-13, live from Search Console:

- **Loop 1**: `node scripts/judge-changes.mjs` gives a verdict per change
  once it has had a full window: better, worse, flat, or too few impressions
  to say. The share of `better` among judged retitles is the number; a
  `worse` retitle is reverted by the next run.
- **Loop 2**: the governor's own share, the fraction of pages published 7 to
  21 days earlier that were shown within a week. Recovery is that number
  back above one half.
- **Loop 3**: `npm run stale`'s count of pages past 90 days (173 of 496 on
  2026-11-14) and the number of `✗` lines in the daily source-quotes run.
- **Loop 4**: package downloads and the mirror's stars once they exist, and
  the `launch` lines in `ops/content-log.jsonl`. Links earned show up in
  Search Console's Links report, which has no API: the owner reads it.
- **The goal itself**: 28-day Google impressions and CTR against the
  baseline above. Ten times the impressions is 250,000; no on-site loop can
  promise that, and this file does not.
