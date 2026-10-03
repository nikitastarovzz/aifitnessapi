# Content backlog — for days when the search data has no qualifying candidate

Institutional memory from the cluster-era gap analyses. Work top-down; check
items off in the same commit that ships them. Each item must still pass the
full DAILY-CONTENT.md pipeline (research, gate, review).

## Cluster selection record (2026-08-22) — how cluster 21 was chosen

Candidates were filtered by source availability BEFORE market appeal, because
that is what has decided the last three clusters. Probed this session:

| Candidate | Verdict | Why |
|---|---|---|
| Accessibility for fitness apps | **BUILT (cluster 21)** | Apple HIG + UIKit + Accessibility JSON and developer.android.com all reachable and deep; nothing on the site covered it; existing web content is generic or legal, none of it developer-grade and fitness-specific |
| Nutrition & food data | Blocked, again | fdc.nal.usda.gov and world.openfoodfacts.org both unreachable |
| Workout file formats (GPX/TCX/FIT) | Blocked | topografix and Garmin FIT unreachable |
| Cross-platform frameworks (React Native, Flutter, Expo) | Blocked | reactnative.dev, docs.expo.dev, docs.flutter.dev, capacitorjs.com all unreachable; pub.dev alone is not enough |
| Store distribution for health apps | Half-blocked | App Store Review Guidelines reachable, Play policy pages are not — and /compliance already owns store policy |
| Audio-guided coaching (sessions, ducking, TTS) | **BUILT (cluster 22, 2026-10-03)** | Apple audio docs reachable; forum threads show real "I am stuck" demand; held as cluster 22, built as /audio-coaching |

Note for whoever picks cluster 22: w3.org is unreachable from this
environment, which is why cluster 21 cites no WCAG criteria at all. If a
future session has access, the accessibility cluster gains a standards layer —
but do not add one from memory.

## Cluster selection record (2026-10-03) — clusters 22 to 24

Re-probed this session before choosing. Reachable: developer.apple.com (docs
JSON, HIG, App Store Review Guidelines), developer.android.com (guides and
Jetpack/platform reference), registry.npmjs.org, pub.dev, pypi.org,
raw.githubusercontent.com, and the GitHub API via `gh api`. Still blocked:
React Native, Expo, Flutter and Capacitor docs, USDA and Open Food Facts,
GPX/FIT specs, w3.org, vendor API docs, support.google.com, api.npmjs.org.

| Candidate | Verdict | Why |
|---|---|---|
| Audio coaching (ducking, interruptions, TTS, audio focus) | **BUILT (cluster 22, /audio-coaching)** | AVFAudio docs JSON, the HIG Playing audio page and Android's audio-focus guide, AudioManager, AudioAttributes and TextToSpeech reference all reachable; 12 spokes organised around exact API strings (duckOthers, AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK, AUDIOFOCUS_REQUEST_FAILED); no cross-platform plugin claims because framework docs stay blocked |
| Health Connect record reference | **Chosen** | Jetpack reference is reachable and record-shaped, so it can be generated with a row guard like the HealthKit reference |
| Open-source health libraries | **Chosen** | Registries (npm, pub.dev, PyPI) and GitHub reachable, so package facts can be generated and refreshed in CI; READMEs stand in for the blocked framework docs |

## Candidate cluster 17: /algorithms — fitness math for developers
Runner-up in two gap analyses. Lost on SERP shape (consumer calculators own
these queries) and correction risk on contested formulas. Revisit ONLY when
GSC shows developer-intent algorithm queries reaching our existing pages. If
built: developer framing (implementation, error bars, what to store), never
"the right formula". Spokes sketched: 1RM estimation formulas compared · HR
zone models · MET vs HR calorie estimation · training load (TRIMP/TSS) ·
readiness scores · progressive overload rules · grade-adjusted pace · streak
and adherence math.

## Single-page additions (cheaper, any day)
- [x] /learn/what-is-rpe (shipped 2026-08-12; corrected 2026-10-03 for HealthKit's iOS 18 workout-effort types) — RPE/RIR explainer; /learn is the thinnest cluster
      relative to its query surface.
- [ ] /fix/healthkit-authorization-denied — the denied-vs-empty opacity gets
      /fix-style symptom traffic; page must link down from the /test and
      /architecture treatments rather than repeat them.
- [x] /data/menstrual-cycle-api (shipped 2026-08-12) — most-requested metric absent from /data;
      YMYL-sensitive, needs primary-source discipline and the health-ai level
      of care on claims.
- [ ] /integrate/polar-api and /integrate/suunto-api — provider long-tail;
      verify docs reachability first (most provider hosts 403 from the proxy;
      if unreachable, do NOT write from memory — skip).
- [ ] /compare/apple-watch-vs-whoop — high-volume comparison missing from
      /compare's grid.
- [ ] Picker follow-up: add /test and /architecture aware recommendations to
      the /picker result panels (currently cluster-era, pre-15/16).

## Standing improvements (rung d)
- [ ] Internal links INTO the top-impression pages from their query-adjacent
      siblings (check byQueryPage pairs for which pages Google already pairs).
- [ ] OG-image spot check on newest cluster (screenshot 2–3 pages).
