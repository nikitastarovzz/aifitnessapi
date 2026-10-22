# Triple down on what earns clicks — 2026-10-22

The owner asked (2026-10-22) to "see what has worked and triple down on it".
This reads the live pull and turns it into the next waves. It binds like the
other plans: primary sources fetched in the writing session, gates green,
evidence files for snapshot-sourced pages.

## What the data says

Search Console, 2026-09-22 to 2026-10-19 (`data/gsc/snapshots/2026-10-22.json`),
against 2026-09-12 to 2026-10-09 (`2026-10-12.json`): 181 clicks and 16,944
page-level impressions, up from 166 and 15,347.

Clicks by section, previous window in brackets:

| Section | Clicks | Impressions | Pages | Clicks/page | Avg pos |
|---|---|---|---|---|---|
| /pricing | 27 (25) | 1,051 | 13 | 2.08 | 8.1 |
| /alternatives | 23 (29) | 843 | 11 | 2.09 | 8.9 |
| /motion | 18 (17) | 1,333 | 21 | 0.86 | 7.0 |
| /integrate | 17 (12) | 2,525 | 12 | 1.42 | 11.7 |
| /fitness-apis | 16 (14) | 1,186 | 10 | 1.60 | 10.9 |
| /fix | 11 (12) | 1,213 | 25 | 0.44 | 8.6 |
| /compare | 11 (11) | 1,131 | 15 | 0.73 | 8.6 |
| /libraries | 6 (2) | 600 | 23 | 0.26 | 8.1 |
| /data | 5 (3) | 249 | 21 | 0.24 | 13.3 |
| /compliance | 4 (4) | 631 | 21 | 0.19 | 9.2 |
| /health-connect | 4 (1) | 353 | 40 | 0.10 | 7.8 |

Three clusters carry the site:

1. **Exercise databases — 31 clicks, 17% of the site.**
   /pricing/exercise-database-api-pricing 11, /alternatives/exercisedb-alternatives
   11, /compare/exercisedb-vs-wger 5, /fitness-apis/exercise-database-apis 4.
2. **Garmin — 19 clicks.** /fix/garmin-api-approval 8, /pricing/garmin-api-pricing
   7, /integrate/garmin-api 4. The largest single visible query is "garmin
   connect python library garth unofficial api" (72 impressions, position 9).
3. **Pose models — 18 clicks.** /motion/mediapipe-pose-landmarker-models 8,
   /motion/pose-estimation-models-compared 7, /motion/apple-vision-body-pose 3.
   "movenet vs mediapipe" sits at position 3; "mediapipe vs yolo" at 10.

Plus the aggregators (Terra alternatives 6, Terra integration 5, two Terra
head-to-heads 4) and the vendor integration guides (Oura 5, Polar 3).

The pattern is the one EXPANSION-3 saw, now on a second window: **a named
product plus a buying question — price, alternative, X vs Y, "can I" — earns
the click; reference tables do not.** So the next waves add more of exactly
that, next to the pages already winning, where the query data shows demand
with no page of its own.

## Wave 1 (this PR) — new pages next to the winners

| Page | Demand it answers (impressions, position) | Next to |
|---|---|---|
| /compare/mediapipe-vs-movenet | movenet vs mediapipe 11 @3.5, mediapipe vs movenet 5 @2.8 | pose-estimation-models-compared |
| /compare/mediapipe-vs-yolo-pose | mediapipe vs yolo 9 @10.6, yolo pose vs mediapipe 6 @9.3, yolo pose vs blazepose (Bing) | pose-estimation-models-compared |
| /alternatives/openpose-alternatives | openpose alternatives 2 @38, openpose yolo alternative (Bing) | openpose-models |
| /alternatives/wger-alternatives | wger alternative 4 @10, wger alternatives 2 @10 | exercisedb-alternatives |
| /compare/exercisedb-vs-free-exercise-db | free-exercise-db 3 @11–14, free exercise db, Bing licence queries | exercisedb-vs-wger |
| /fitness-apis/exercise-video-apis | exercise video api 23 @34, workout video api 15 @19–43, exercise api with videos 6 @38 | exercise-database-apis |
| /fix/garmin-api-personal-use | garmin connect api private use alternative 2025 29 @5 (on wearable-data-apis), garmin api for personal use 3 @30 | garmin-api-approval |
| /pricing/polar-api-pricing | polar flow api, polar accesslink api, polar api (46 impressions over 24 Google and Bing queries) | integrate/polar-api |

Each new page is linked from the winning page beside it, so it inherits the
neighbour's standing rather than starting cold.

## Wave 2 — the same formats for the vendors with integration guides only

Polar, Withings, Samsung Health, Suunto, COROS, Wahoo and Dexcom each have an
/integrate guide and nothing else. Garmin, Oura, WHOOP, Strava and Fitbit
each have a guide plus pricing, alternatives and head-to-heads, and those
extra pages are where their clicks come from. Add pricing and alternatives
pages for each vendor whose own pages state enough to answer the question,
from snapshots, in that order of query volume.

## Wave 3 — more head-to-heads in the three winning clusters

- Pose: MoveNet vs YOLO pose, RTMPose vs MediaPipe, ML Kit vs MediaPipe,
  Apple Vision vs MediaPipe ("vndetecthumanbodyposerequest" is 18 @9 on the
  Apple Vision page).
- Exercise data: ExerciseDB vs API Ninjas, free-exercise-db alternatives,
  ExerciseDB on RapidAPI vs self-hosted.
- Aggregators: Spike alternatives ("spike api" 9 @13), Junction (Vital)
  alternatives ("what is the best vital api").

Each only where the next pull shows the query, and only from sources read
that session.

## Not doubling down on

Reference sections stay as they are (no new reference pages in these waves):
everything outside the commercial sections, the homepage, the shutdown pages,
/libraries, /migrate and /devices holds 32% of impressions and 15% of clicks. They keep their freshness
work under `npm run stale`.

## Measurement

Added to ops/gsc/tracked-queries.txt: movenet vs mediapipe, mediapipe vs yolo,
openpose alternatives, wger alternatives, free-exercise-db, exercise video
api, workout video api, garmin api for personal use, polar api pricing.
Re-pull on 2026-11-05 and compare section clicks/page against this file.

## Status

_2026-10-22: wave 1 shipped — all eight pages above, each linked from the
winning page beside it. The source snapshot for it showed two of the three
winning clusters had moved under us, so the same PR re-verifies them:_

- _**Garmin** restructured its developer program between 17 and 21 October:
  the program FAQ moved under /enterprise/ (the old address is a 404),
  access is now Personal (a self-serve API key for your own data), Starter and
  Enterprise, and the "business use only" line our pages quoted is gone.
  /pricing/garmin-api-pricing and /integrate/garmin-api were rewritten and
  re-stamped; the Garmin claims on some 20 other pages and every evidence row that
  cited the dead address were brought in line; a change event records it._
- _**ExerciseDB** (exercisedb.dev) is now AscendAPI, with a free keyless V1
  and a free watermarked V2 plan; API Ninjas' Exercises API now returns images
  on paid plans. The four exercise money pages were re-verified and re-stamped,
  four more corrected in part, and the corrections log records what was wrong._
- _Directory: Apple Vision and Junction now clear the demand bar and are
  indexed._
