# Weekly distribution — playbook

You are running the Monday distribution run for AIFitnessAPI (loop 4 of
ops/AUTOMATION.md). The site has built far more than it has shown anyone:
on 2026-11-14 neither npm package was on the registry, the launch kit said
nothing had been posted, and `ops/content-log.jsonl` held no `launch` line.
Search ranks pages that other sites link to, and nothing here has been put
where someone could link to it. This run makes the owner's part of that a
fifteen-minute job once a week.

**You prepare; the owner sends.** Nothing in this run posts to a social
network, a forum or a list, sends an email, opens an issue or a pull request
on another repository, or contacts anyone. Its outputs are files in `ops/`
and Gmail drafts in the owner's own mailbox. That line does not move because
a draft looks ready.

## 0. Preflight

1. If `ops/AUTOMATION-PAUSED` exists on `main`, stop: report that the
   automation is paused and what the file says. Change nothing.
2. `git rev-parse --is-shallow-repository`; if `true`, `git fetch --unshallow origin`.
   Then `npm ci`.
3. `node scripts/backfill-published.mjs`, then `npm run build` (the post kit
   reads the built pages' own titles and descriptions).

## 1. Packages and the dataset mirror — are they going out?

Two workflows publish by themselves when their credentials exist:
`publish-packages.yml` (the MCP server and the data library to npm, on every
change to their bundled data) and `dataset-mirror.yml` (the CC BY datasets to
a standalone repository). Read the newest run of each.

- Published, or unchanged since the last publish: one line in the report,
  with the version.
- Skipped for a missing secret or variable: one line in the report naming
  exactly what is missing (the SETUP comment at the top of each workflow
  says how). Say it once per run, never more.
- Failed: quote the error line. Do not try to publish by another route.

## 2. The post pack

1. `node scripts/social-posts.mjs --date <today>` writes
   `ops/social/posts-<today>.md`: one X and one LinkedIn post per dated
   change of the last 30 days and per page published in the last 14. It adds
   no facts and fails rather than emit a post with a hype word.
2. Write `ops/social/week-<today>.md`: **the five posts worth the owner's
   time this week**, each copied verbatim from the kit (both variants), with
   one line above it saying why this one. Choose in this order:
   - a dated change that affects developers now (a shutdown, a deadline, a
     price change), newest first;
   - a new figure from `/research`, or a new tool or dataset;
   - a page that `data/gsc/latest.json` shows is earning clicks, when its
     subject is in the news that week.
   Skip anything `ops/social/week-*.md` of the last four weeks already
   carried. Fewer than five is fine; padding is not.
3. At most one community post a week (Show HN, a subreddit, a newsletter
   pitch), and only for a tool, a dataset or a study: take the draft from
   ops/LAUNCH-KIT.md, or write one in its form when the kit has none for
   that page, including the disclosure sentence and the reminder to read the
   community's rules first. Check every number in it against the built page.
4. Never rewrite a kit post to add a claim, a superlative or a number. If a
   post reads badly, the page's title or description is what needs fixing,
   and that is the daily search loop's job: note it in the report.

## 3. Vendor notes — Gmail drafts, never sent

A vendor whose page we just re-read is the one audience guaranteed to care
that it is right. The Your Move pages (2026-11-11) started with the vendor
writing to us. This step offers the same to others: here is what we state
about you, here is where we read it, tell us if it is wrong.

- Candidates: pages about one named vendor that `ops/content-log.jsonl`
  shows were corrected or re-verified in the last seven days (`drift-fix`,
  `reverify`, or an `update` naming the vendor).
- Skip a vendor that `ops/outreach-log.jsonl` shows was drafted for in the
  last 90 days, and skip KinesteX.
- At most five drafts a run.
- **Recipient.** Only an address the vendor itself publishes for developer
  relations, partnerships, press or support, on a page you fetched in this
  run. Record that page's URL in the log. No address found: create the draft
  with no recipient and say so; the owner may know someone. Never guess an
  address, never use a personal address, never look one up in a contact
  database.
- **Create the draft with the Gmail connector's draft tool. Never call a
  send, reply or forward tool.** If the connector is not attached to this
  session, write the drafts into `ops/social/week-<today>.md` under
  "Vendor notes" instead and say so.
- **Body**, plain text, under 150 words, in this shape and no warmer:

  ```text
  Subject: Your entry on aifitnessapi.com, re-checked <date>

  Hello,

  aifitnessapi.com is an independent reference for developers who integrate
  fitness and health APIs. We re-read your documentation on <date> and
  updated our page about <product>: <page URL>

  What we state, and where we read it:
  - <fact 1> (<source URL>)
  - <fact 2> (<source URL>)
  - <fact 3> (<source URL>)

  If any of it is wrong or out of date, reply to this email or use the
  correction link on the page, and we will fix it and say so on
  https://aifitnessapi.com/corrections.

  Disclosure: the site is funded by KinesteX (AI motion tracking for
  fitness apps). <One sentence, only if true: KinesteX competes with you /
  does not compete with you in <area>.> It has no say over your entry.

  <owner's name is left for the owner to add>
  ```

  The facts are the page's own sentences and their evidence rows' URLs,
  nothing new. No request for a link, no pitch, no follow-up draft, no
  tracking link.
- Append one line per draft to `ops/outreach-log.jsonl`:
  `{"date","vendor","page","contactSource","draft":"gmail|file","facts":[...]}`.
  Never write the recipient's address into the repository (it is public):
  `contactSource` is the URL of the page that publishes it.

## 4. Ship and log

Everything this run writes is under `ops/`, which the site does not serve
and Vercel does not build (`scripts/vercel-ignore-build.sh`). One commit on
a new branch, one pull request into `main`, auto-merge (squash); the gates
still run. One line in `ops/content-log.jsonl`:
`{"date","action":"distribution","cluster":"ops","slug":"week-<today>","signal":"weekly distribution run","notes":"<posts picked, drafts created, package and mirror status>"}`.

If `src/data/published.ts` changed in step 0, commit it too: it is generated
data and this is its regeneration.

## 5. Report

At most ten lines, the owner's to-do first: where the five posts are, which
one to post where, how many drafts are waiting in Gmail and for which
vendors, and whether the packages and the mirror went out. Ask for one thing
back: the URL of anything they posted, so the next run can log it as
`"action":"launch"` and stop offering it.
