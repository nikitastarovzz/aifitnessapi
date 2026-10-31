# Launch kit — the shareable wave (ops/VIRAL-30-2026-10-31.md item 9)

Copy written for the owner to post. Nothing here has been posted: posting is
outward-facing and needs the owner's accounts. Each draft names a page that
is live once the wave's PR merges; open it before posting and check the
numbers in the draft against the page, because pages regenerate.

**Read each community's rules first.** Hacker News's Show HN rules are at
https://news.ycombinator.com/showhn.html (this environment could not reach
the host to quote them). Subreddits differ on self-promotion; read each one's
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
