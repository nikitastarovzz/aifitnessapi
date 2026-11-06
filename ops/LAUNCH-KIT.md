# Launch kit — the shareable wave (ops/VIRAL-30-2026-10-31.md item 9)

Copy written for the owner to post. Nothing here has been posted: posting is
outward-facing and needs the owner's accounts. Each draft names a page that
is live once the wave's PR merges; open it before posting and check the
numbers in the draft against the page, because pages regenerate.

**Read each community's rules first.** Hacker News's Show HN rules are at
https://news.ycombinator.com/showhn.html (quoted, as read on 2026-11-06, in
wave 2 below). Subreddits differ on self-promotion; read each one's
sidebar and rules page before posting, and post as yourself, saying you work
on the site.

**Disclosure goes in every post.** The site is funded by KinesteX. Say so in
the first comment on HN and in the body on Reddit and LinkedIn, the same
sentence the footer uses. A hidden sponsor discovered in the comments sinks a
launch faster than any other mistake.

**Order.** One artifact per post, about a week apart, so each gets its own
day: graveyard → heart-rate lab → daily puzzle → rep challenge → Ship It →
the 2026 story in December.

---

## 1. Fitness API Graveyard — `/graveyard`

**Show HN title:** Show HN: A graveyard of shut-down fitness and health APIs

**First comment (HN):**
> I keep a reference site for developers who integrate wearables and health
> platforms. The thing people ask most is "is this API still alive?", so this
> page lists every fitness/health developer API we could find a primary
> source for, with the shutdown date and the vendor's own words, plus the ones
> on a countdown. Each entry links its source. It's embeddable and there's a
> JSON file. Corrections welcome — if you have a vendor notice we're missing,
> I'll add it. Disclosure: the site is funded by KinesteX (AI motion
> tracking); it isn't on this list and has no say over it.

**Reddit (r/androiddev, r/iOSProgramming — check rules):** title "We tracked
down every shut-down fitness API and the vendor's own shutdown notice", body
= the comment above.

**LinkedIn / X:** "If your product syncs with a wearable, this is the list of
APIs that have already gone dark — and the ones on a countdown right now.
Every entry cites the vendor. aifitnessapi.com/graveyard"

## 2. Bluetooth heart-rate lab — `/tools/heart-rate-lab`

**Show HN title:** Show HN: Decode your heart-rate strap's Bluetooth packets in the browser

**First comment:**
> Connect a BLE chest strap or a watch in broadcast mode (Chrome/Edge/Opera;
> Web Bluetooth isn't in Safari or Firefox, so there's a replay mode). You get
> every byte of the Heart Rate Measurement characteristic decoded from the
> Bluetooth SIG's own structure definitions, and a verdict on whether your
> device sends RR intervals at all — without them, any "HRV" an app shows you
> wasn't computed from beat-to-beat data. Nothing leaves the browser.
> Disclosure: the site is funded by KinesteX (AI motion tracking).

**Reddit (r/QuantifiedSelf, r/webdev — check rules).**

**X:** "Does your heart-rate strap actually send beat-to-beat intervals? Connect it in your browser and see the raw bytes. aifitnessapi.com/tools/heart-rate-lab"

## 3. Daily puzzle — `/daily`

**Post the grid, not the link, on day one:** the copy button produces a
spoiler-free line; post yours with "Today's health-API puzzle — five
questions, one a day, answers from Apple's and Google's own docs."

**Show HN title (after a week of daily numbers):** Show HN: A daily puzzle for health-app developers

## 4. Webcam rep challenge — `/challenge`

**X / LinkedIn / TikTok caption:** "30 seconds, browser only, your webcam
counts the squats. My score: N. The counter is a few dozen lines of angle
rules — the page shows them. aifitnessapi.com/challenge"

Disclosure line on LinkedIn: "The site is funded by KinesteX, which builds
camera motion tracking; this demo is our own simple counter, not their SDK."

## 5. Ship It — `/play/ship-it`

**Show HN title:** Show HN: A game where your fitness app survives real API shutdowns

**First comment:**
> Every event in the game is a real, dated change — the Fitbit Web API
> turn-off, Google Fit's end of support, approval gates — quoted from the
> vendor and linked. The weeks and users you lose are game rules, not
> estimates. Disclosure: the site is funded by KinesteX.

## 6. Pose keypoint playground and step lab

Better as replies than as posts: answer "how do MediaPipe landmarks map to
COCO?" and "why do my two step counters disagree?" threads on Stack Overflow
and Reddit with the relevant tool link, once per thread, with disclosure.

## 7. The 2026 story — `/2026`

Hold until the first build in 2027 turns "so far" into the full year. Then:
LinkedIn carousel from the per-slide images; pitch to newsletters (TLDR,
Console, Bytes) with the three strongest slides and the page link.

## Tracking

Vercel Analytics referrers per path; note each post's URL and date in
`ops/content-log.jsonl` with `"action":"launch"` so the 2026-11-24 pull can be
read against it.

---

# Wave 2 — the VIRAL-20 tools (ops/VIRAL-20-2026-11-06.md items 19–20)

Refreshed 2026-11-06. Same rules as above: nothing here has been posted, the
owner posts by hand from their own accounts, disclosure goes in every post,
and each draft is checked against its live page before it goes out.

## Community rules, as read on 2026-11-06

**Hacker News (Show HN).** Read through the site's source-snapshot workflow
on 2026-11-06 (https://news.ycombinator.com/showhn.html). What binds these
drafts:

- "Show HN is for something you've made that other people can play with."
  The browser tools qualify; a study or a list does not: "Off topic: blog
  posts, sign-up pages, newsletters, lists, and other reading material. Those
  can't be tried out, so can't be Show HNs. Make a regular submission
  instead." So the research studies below are drafted as ordinary
  submissions, not Show HN.
- "Please make it easy for users to try your thing out, ideally without
  barriers such as signups or emails." Link the tool itself, never a signup
  or the newsletter.
- "The project must be something you've worked on personally and which
  you're around to discuss." Post when you can stay in the thread.
- "Please don't ask friends to upvote or comment. That's not ok on HN."
- "New features and upgrades ... generally aren't substantive enough to be
  Show HNs." A tool that already had its Show HN does not get a second one
  for an update.

**Reddit: r/androiddev, r/iOSProgramming, r/QuantifiedSelf,
r/computervision.** Each rules page (`/r/<name>/about/rules/`, on both
www.reddit.com and old.reddit.com) answered 403 to the snapshot workflow on
2026-11-06, so their rules could not be read or quoted here. **Check the
rules** in each sidebar before posting: self-promotion limits, required
flair, and whether a weekly self-promotion thread is the only allowed place.
Post as yourself, say in the body that you work on the site, and include the
disclosure sentence.

**Newsletters.** Submission routes were not checked for this kit. Check each
newsletter's own submission page before pitching; send one short email per
newsletter, never a mass mailing.

**Disclosure sentence (every post, every pitch):** "Independent reference,
funded by KinesteX (AI motion tracking for fitness apps)." It is the footer's
sentence. None of the tools below is a KinesteX product, and KinesteX has no
say over them.

## Order for wave 2

One post per artifact, about a week apart. The Fitbit Web API turn-off
(November 2, 2026, by Google's own pages) makes the Fitbit-related tools the
most time-sensitive, so they go first:

1. Fitbit → Google Health API map
2. Deprecation scanner (once merged)
3. Wearable OAuth playground
4. Webhook payload library + webhook verifier
5. Unified health data schema + schema converter
6. Own your data
7. BLE labs (heart rate, FTMS, cycling power, GATT explorer)
8. "Which wearable API should you use?" quiz (once merged)
9. The research studies (once merged), as regular submissions and newsletter pitches

Before each post, open the page and confirm the counts and vendor lists in
the draft still match it; the descriptions below are the pages' own as of
2026-11-06.

## 1. Fitbit → Google Health API map — `/tools/fitbit-to-google-health`

**Show HN title:** Show HN: Look up any Fitbit Web API endpoint's Google Health API replacement

**First comment:**
> Google's developer pages set November 2, 2026 as the day the legacy Fitbit
> Web API and Fitbit OAuth endpoints are turned off. If you still have code calling
> it, this page lets you search every Fitbit Web API endpoint and see its
> Google Health API data type, method and scopes, taken from Google's own
> migration tables, or that Google lists none. It runs in the browser, no
> signup. Corrections welcome. Disclosure: the site is funded by KinesteX
> (AI motion tracking); it has no say over this tool.

**Reddit (r/androiddev, r/iOSProgramming — check the rules):** title "The Fitbit
Web API turn-off: a lookup from each old endpoint to its Google Health API
replacement", body = the comment above.

## 2. Deprecation scanner (plan item 14, "Deprecation scanner"; not merged at this writing)

Describe it only by its plan name and purpose until it is live: paste code or
a manifest and see Fitbit Web API, Google Fit and other dead calls, each
mapped to its replacement. When it merges, write the Show HN from its page's
own description and the dead-API list it actually checks, and pair it with
the plan's companion GitHub Action (item 15) in the first comment.

## 3. Wearable OAuth playground — `/tools/oauth-playground`

**Show HN title:** Show HN: Build OAuth authorize URLs and PKCE pairs for nine wearable APIs

**First comment:**
> Pick Oura, WHOOP, Strava, Polar, Withings, Wahoo, Dexcom, Suunto or Google
> Health and you get the documented endpoints and scopes, an authorize URL, a
> PKCE pair and the token curl. It sends nothing; it's a page that writes the
> requests for you, each value from the vendor's own docs. Disclosure: the
> site is funded by KinesteX (AI motion tracking).

**Reddit (r/androiddev, r/iOSProgramming — check the rules).**

## 4. Webhook payload library — `/webhooks` (with `/tools/webhook-verifier`)

**Show HN title:** Show HN: Documented webhook payloads and JSON Schemas for eight wearable APIs

**First comment:**
> Documented webhook payloads from Oura, WHOOP, Strava, Polar, Withings,
> Wahoo, Terra and Google Health, with JSON Schemas, retries and a local mock
> sender. The companion verifier checks a delivery's signature in your
> browser the way each vendor documents it, including the Google Health
> API's Tink ECDSA P-256 signature against Google's published keyset. The
> secret never leaves the tab. Disclosure: the site is funded by KinesteX.

## 5. Unified health data schema — `/schema` (with `/tools/schema-converter`)

**Show HN title:** Show HN: One JSON Schema for HealthKit, Health Connect and Google Health data

**First comment:**
> JSON Schema and TypeScript types for heart rate, steps, sleep, workouts,
> weight, HRV and SpO2, each field mapped to HealthKit, Health Connect and
> Google's APIs with the evidence quoted. The converter takes a pasted
> HealthKit export row, Health Connect record or Google Health API data point
> and shows it in the unified shape, each field traced to its source. CC BY
> 4.0. Disclosure: the site is funded by KinesteX.

**Reddit (r/androiddev, r/iOSProgramming, r/QuantifiedSelf — check the rules).**

## 6. Own your data — `/own-your-data`

**Reddit (r/QuantifiedSelf — check the rules):** title "How to download your
own data from Apple Health, Health Connect, Samsung, Garmin, Fitbit, Oura,
Polar, Strava, Suunto and COROS", body: "One page per vendor, from each
vendor's own docs. The Apple Health export explorer opens your export.zip in
the browser; nothing is uploaded. I work on the site; it is funded by
KinesteX (AI motion tracking)."

This is reading material, so on HN it is a regular submission, not Show HN.

## 7. BLE labs — `/tools/heart-rate-lab`, `/tools/ftms-lab`, `/tools/cycling-power-lab`, `/tools/ble-gatt-explorer`

The heart-rate lab had its own draft in wave 1. Post the other three as one
Show HN:

**Show HN title:** Show HN: Decode Bluetooth fitness devices in the browser (FTMS, cycling power, any GATT)

**First comment:**
> Connect a treadmill, indoor bike, rower or cross trainer over Web Bluetooth,
> or paste hex, and every FTMS flag bit and field is decoded against the
> Bluetooth SIG's structure. The cycling lab decodes Cycling Power and CSC
> with cadence and speed computed from the cumulative counters; the GATT
> explorer connects any BLE device and names services and characteristics
> by their SIG names. Chrome, Edge and Opera (Web Bluetooth); paste mode
> elsewhere. Disclosure: the site is funded by KinesteX.

**Reddit:** r/androiddev for the FTMS decoding, r/QuantifiedSelf for "see
what your trainer actually sends" — check the rules.

## 8. Quiz (plan item 6, "Which wearable API should you use?" quiz; not merged at this writing)

Describe it by its plan name only until live. When it merges: post your own
result card on X and LinkedIn, not a link alone, with "Answers come from the
vendors' own docs; the quiz does not rank vendors." Not a Show HN.

## 9. Research studies (plan items 1–3: "Docs-drift study", "Shutdown-notice study", "Pricing-transparency report"; not merged at this writing)

Describe them by their plan names only until live, and write every number in
a pitch from the published page, never from the plan. They are reading
material, so on HN they are regular submissions with the study's own
headline, not Show HN.

**r/computervision:** none of the three is computer-vision work; post there
only something that is (the pose keypoint playground, the rep-counter
playground), answering a thread rather than starting one — check the rules.

**Newsletter pitch (short email, one per newsletter; check each one's
submission page first):**
> Subject: <study headline from the published page>
>
> We publish a free reference for developers who integrate wearables and
> health platforms. <One sentence with the study's main number, copied from
> the page.> Method and data are on the page: <URL>. Disclosure: the site is
> funded by KinesteX (AI motion tracking); KinesteX had no say over the study.

## Social post kit — `ops/social/posts-<date>.md`

For the day-to-day posts between launches:

```
npm run build && node scripts/social-posts.mjs --date 2026-11-06
```

It writes `ops/social/posts-<date>.md` with one X post (280 characters as X
counts them, URLs at 23) and one LinkedIn post for every
`src/data/changes.ts` entry dated in the last 30 days and every
`src/data/published.ts` page first published in the last 14 days (pt-BR
editions excluded). Links carry `utm_source=x` or `utm_source=linkedin`,
`utm_medium=social` and `utm_campaign=social-kit-<date>`, so Vercel Analytics
can attribute visits. Change posts are the entry's own title, date and
summary; page posts are the built page's own `<title>` and meta description;
the script adds nothing else except "New on the site:" and the disclosure.

It fails rather than writing a bad kit: a published page with no built HTML,
an X post over 280, a missing UTM link, or a hype word (best, ultimate,
revolutionary, game-changing, amazing, incredible, must-have, "!" and a few
more; "The Best X" titles lose the word) all exit non-zero. Tests:
`npm run test:social`. The file is ops-only: not served, not under
`public/`, and not generated in CI. Post at most one or two a day, and log
each posted URL in `ops/content-log.jsonl` with `"action":"launch"`.
