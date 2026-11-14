# Vendor watch — playbook

You are running the daily vendor watch for AIFitnessAPI (loop 3 of
ops/AUTOMATION.md). The site's claim is that it tracks a moving ecosystem.
This run is what keeps that claim true without a person noticing first: a
vendor changes a price, a limit, an SDK version or a shutdown date, and the
page that states it is corrected the same day, with the source re-read.

You have standing authorization to ship through ONE pull request per run that
merges itself when the gates are green. That authorization is conditional on
this playbook, CLAUDE.md and ops/GEO.md. The rule that outranks every other:
**a fact is corrected only from its primary source, fetched in this run.** A
changed quote tells you that a page moved, never what it now says.

**Output contract: up to TWO pages per run, drift first, then the stalest
page with the most search impressions. "Nothing moved and nothing was due" is
a correct outcome.**

## 0. Preflight

1. If `ops/AUTOMATION-PAUSED` exists on `main`, stop: report that the
   automation is paused and what the file says. Change nothing.
2. `git rev-parse --is-shallow-repository`; if `true`, `git fetch --unshallow origin`.
   Then `npm ci`.
3. A dirty tree or a build that fails before your change: stop, report, and
   push nothing (ops/DAILY-CONTENT.md §0 and §7 apply here unchanged).

## 1. Open the trackers' pull requests

The tracker workflows (SDK releases daily; libraries, MCP servers, Google
Health API and Bluetooth GATT weekly) refresh generated data on GitHub's
runners and push a `bot/<name>-<run id>` branch. While the repository does
not allow GitHub Actions to open pull requests, `scripts/bot-pr.sh` ends
those runs green and leaves the branch for this step.

- List the branches whose name starts with `bot/` and the open pull requests.
- For each `bot/` branch with no pull request whose newest commit is by
  `github-actions[bot]` and under seven days old: open a pull request into
  `main` with the commit's subject as the title, and enable auto-merge
  (squash). A pull request opened here starts CI by itself.
- A `bot/` branch older than seven days, or with any commit not by the bot:
  do not open it. Name it in the report.
- Never edit a bot branch. Generated data is regenerated, not corrected
  (CLAUDE.md, "Generated data").

## 2. Source drift — what moved since yesterday

`source-quotes.yml` runs daily at 06:17 UTC and checks every quoted passage
in `ops/sources/evidence/*.json` against its live source. The scheduled run
ends green and lists what moved.

- Read the newest `schedule` run of `source-quotes.yml` and its job log.
  Each line starting `✗` is one evidence row:
  `ops/sources/evidence/<cluster>-<slug>.json[<row>]: quote not found at <url>`
  or `... answered <status>`.
- Skip rows that an open pull request already fixes, and rows
  `ops/content-log.jsonl` shows were handled in the last three days (the
  source may be mid-change; note it and look again tomorrow).
- Group the rest by evidence file, which is one page. Order the pages by
  Google impressions in `data/gsc/latest.json`, pricing and shutdown pages
  first on a tie.

For each page, within the run's budget:

1. Fetch the source now. Directly when the host is reachable; otherwise
   dispatch `.github/workflows/source-snapshot.yml` with a list in
   `ops/sources/` and read its job log (CLAUDE.md, hard rules). Snapshots are
   never committed.
2. Decide what happened, and do only what the source supports:
   - **Reworded, same fact**: replace the row's `quote` with the passage as
     it now reads. The page text stays.
   - **The fact changed** (a price, a limit, a version, a date, a policy):
     correct the page text, the capsule and any FAQ that states it, and the
     row. Grep `src/data/` for the old value: other pages quote the same
     fact, and each needs the same correction and its own row.
   - **The source is gone** (404, 410, a host that no longer resolves): find
     where the vendor now states it and re-source the row. If the vendor no
     longer states it anywhere you can fetch, remove the claim from the page
     and the row from the file. A claim never outlives its source.
3. A dated change to the ecosystem (a deprecation, a deadline, a price
   change with an effective date, a terms change) also gets a `ChangeEvent`
   in `src/data/changes.ts`, graded by that file's rules and never sharper
   than the source. Then the regenerations ops/DAILY-CONTENT.md §2d lists
   (`npm run datasets`, the atlas and history posters, the deprecation
   rules for a graveyard entry).
4. The `updated` stamp moves only when every claim on the page was re-read
   this run. Fixing three rows of forty is a correction, not a
   re-verification: leave the stamp.

## 3. Stale pages — what has gone longest unchecked

When drift left budget:

- `node scripts/stale-report.mjs --over 90 --weight` ranks pages past 90
  days, most search impressions first within each age band. `ops/QUEUE.md`
  carries the same pages as "Stale" rows with the clicks at stake.
- Take the top page that `ops/content-log.jsonl` does not show as touched in
  the last seven days and that no open pull request edits.
- Re-verify every claim against its primary source, fetched this run, the
  same three outcomes as §2.2 for each. Then, and only then, move `updated`
  to today, and the year marker with it if the year changed
  (ops/DAILY-CONTENT.md §4).
- A page whose sources cannot be reached even through a snapshot run is not
  re-verified. Leave its stamp, name it in the report, take the next page.
- A page with a pt-BR translation: editing the English text turns the
  translation stale by itself (CLAUDE.md, "Translations"). That is by
  design; do not re-translate in this run.

## 4. Budget and limits

- Two pages per run. One when the first page's sources took more than half
  the session. Zero is fine.
- Content only: never `/api/*`, `src/lib/firestore.ts`, the signup form, CI
  workflows, dependencies, `scripts/qa.mjs`, or the index governor's files.
- Never delete or rename a page or a slug. Never add a new page: this loop
  corrects what exists (new pages belong to the daily search loop and its
  governor).
- Never write a number from memory, and never keep one whose source you
  could not fetch today.
- KinesteX pages keep their disclosure and are never crowned (ops/GEO.md).

## 5. Verify, ship, log

1. `npx tsc --noEmit`, `npm run build`, `npm run qa`: all green. An evidence
   change also has to pass `node scripts/check-source-quotes.mjs <the files
   you changed>`; that script runs on GitHub's runners for hosts blocked
   here, so the `source-quotes` check on the pull request is the proof. Do
   not enable auto-merge until you have read that check as green.
2. Read your own diff as a hostile reviewer would: every changed number has
   a row with a quote you fetched today; no page now contradicts another.
3. One commit on a new branch, one pull request into `main`, auto-merge
   (squash). The body lists, per page: what the source said before, what it
   says now, the URL, and whether the stamp moved.
4. One line per page in `ops/content-log.jsonl`:
   `{"date","action":"drift-fix|reverify|none","cluster","slug","signal","notes","measure"}`
   with `"measure": {"path", "kind": "reverify", "before": ...}` from
   `node scripts/judge-changes.mjs --before <path>`.
5. When a `ChangeEvent` was added: `node scripts/social-posts.mjs --date <today>`
   after the build, so the post for it is waiting in `ops/social/` for the
   owner the same day. The kit adds no facts; do not edit its output.

## 6. Report

At most twelve lines: bot pull requests opened; what moved (vendor, fact,
old value, new value, source URL); which pages were re-verified and whether
anything on them had changed; what could not be reached; anything the owner
has to decide. If a vendor changed a price or announced a shutdown, say so
in the first line.
