# 50 big updates — visibility, CTR, impressions, engagement

Advisory only; nothing here is implemented. Grounded in the site as of
2026-09-04 (361 content pages, 22 clusters, 23 posts, 5 datasets, 24-product
directory, 240-identifier HealthKit dataset, 10-metric verified matrix).

Markers: **[you]** needs credentials/decisions/data only the owner has ·
**[egress]** blocked or partly blocked by the sandbox's network policy ·
**[GSC]** only measurable/worth doing against a Search Console baseline.

## A. New URL surface from data we already hold (impressions)

1. **HealthKit group reference pages (~12).** Activity, Nutrition, Vital signs,
   Mobility, Body measurements, Lab & test, Hearing, Reproductive Health,
   category types, workout activities, characteristics, dietary. Each covers
   7–84 identifiers with real synthesis (sum/average split, unit families,
   Android counterparts, traps). Resolves "240 identifiers on one URL", the
   single biggest impression gap, with zero new facts needed.
2. **Workout-activity explorer.** The 84 HKWorkoutActivityType cases as a
   filterable reference with per-sport anchors; 84 exact-string queries that
   currently land nowhere.
3. **Per-cluster questions hubs (21 pages).** 1,188 existing FAQ pairs become
   addressable long-tail entry points with deep anchors. No new writing.
4. **HKCategoryValue enum reference.** The 28 resolved value enums (and 2
   honest nulls) as their own reference; developers paste these exact strings.
5. **Unit-family reference.** Every quantity type by unit family, the 4 with
   none stated, and HKUnit construction rules read from Apple's docs JSON.
6. **Per-iOS-release HealthKit pages.** One page per release from 8.0 to 27
   ("what HealthKit added in iOS 18"), straight from platforms.introducedAt.
7. **Deprecated & beta watch page.** The 3 deprecated activity types, 2 beta
   identifiers, 4 undocumented ones. Owns every "is X deprecated" query.
8. **Health Connect record reference.** Full parity page is **[egress]**
   (developer.android.com blocked); a partial covering the 10 matrix-verified
   records is possible today and honest about scope.
9. **Symptom-page expansion of /fix (15 → ~40).** Platform-side failures are
   verifiable from Apple docs now; vendor-side error strings are **[egress]**.
10. **/build wave 3 from the activity data.** Cycling, swimming,
    hiking/outdoor, racket-sports, kids fitness, training-log apps; each has a
    distinct AppStack spine in the 84 workout types.

## B. Tools: paste something, get an answer (usefulness + engagement)

11. **Error diagnoser.** Paste an error string; client-side match against
    HK_ERRORS + /fix; the highest-intent moment this audience has.
12. **Aggregation checker.** Paste identifiers, get the cumulative/discrete
    verdict and the correct HKStatisticsQuery options. We hold the only
    dataset that answers it.
13. **Permission-set builder.** Pick metrics, get the exact read/share set for
    both platforms with copy-paste Info.plist / manifest output.
14. **Identifier translator.** HealthKit ⇄ Health Connect from the matrix,
    with "not verified on both platforms" stated beyond the 10.
15. **Stack generator.** Four questions in, a complete recommended stack out,
    built on the AppStack + directory data; deep links throughout.
16. **Query code generator.** Type + window in, correct Swift snippet out,
    sum-vs-average handled; the silent-bug blog post as a tool.
17. **Sample-payload library.** Canonical record JSON for the 10 verified
    metrics on both platforms; partial **[egress]** beyond those 10.
18. **Day-boundary simulator.** Interactive version of the day-boundary
    cookbook: pick timezones, watch the rollup change.
19. **Shareable comparison states.** compare-apis with query-param state and
    a dynamic OG card per state (tool state, noindex; NOT permutation pages —
    that idea stays rejected).
20. **Read-vs-write capability tool.** Which types your app can write, not
    just read. Needs one new generator pass against Apple's docs JSON, which
    is reachable.

## C. CTR mechanics

21. **Title-width pass.** 79 titles under 40 chars; spend the width on a
    count, a date, or a format. **[GSC]** to prove it moved.
22. **HowTo schema** on the 65 pages that already carry `steps`.
23. **SoftwareSourceCode schema** on cookbook + kit pages.
24. **Dataset discoverability audit.** Verify Dataset schema on all 5 CC-BY
    datasets renders validly so Google Dataset Search picks them up.
25. **Finding-baked OG images.** Per-page OG cards that show the number or
    table, not just the title; pattern already exists on picker results.
26. **Capsule-as-snippet pass.** Align the answer capsule's first 160 chars
    with the meta description on the top 50 entry pages.
27. **Recency in titles where recency is the query** (shutdown/deadline pages
    only). **[GSC]**
28. **Jump-link TOCs on the group pages** so SERPs show section sitelinks.

## D. GEO / AI-answer visibility

29. **Publish the MCP server** + register it in MCP registries. **[you: npm
    credentials]** — the site becomes directly queryable by agents.
30. **Publish the typed npm data package.** **[you: npm credentials]**
31. **Stand up the CC-BY dataset repo** + the drafted awesome-list PRs.
    **[you: decision]**, PRs are **[egress]** from here.
32. **claims.json.** The 283 anchored citable facts as one machine-readable
    claims index with per-claim URLs.
33. **Quotable stat cards.** Key findings rendered as bordered stat blocks
    with a copy-citation button and stable anchor.
34. **Question/acceptedAnswer markup** on spokes whose primaryQuery is a
    literal question.
35. **Data-diff feed.** A JSON feed of what changed in the generated datasets
    each week; agents and humans both get "what moved".

## E. On-site engagement and retention

36. **Command-K palette search** with fuzzy identifier matching across the
    240 identifiers, 84 activities, 33 terms, and all pages.
37. **Copy-as-markdown on every table and stat** ("paste into your PR").
38. **Reading paths.** Curated sequences ("ship HealthKit in a week") with
    progress in localStorage.
39. **Freshness as UI on hubs.** "3 pages re-verified this week" per cluster,
    from the stamps we already track.
40. **Accuracy feedback widget** per page, writing to Firestore. **[you:
    Firebase env vars]**
41. **Bookmark list** (localStorage) with export.
42. **Architecture diagram set.** Hand-drawn SVGs for the 15 /architecture
    patterns; no facts required, high share value.
43. **Newsletter landing page** with archive, a sample issue, and one
    consistent CTA site-wide.

## F. Trust and authority surfaces

44. **Public gates page.** /methodology shows the live qa gate list and what
    each one refuses to ship. The system itself is the credibility asset.
45. **Site changelog page** generated from ops/content-log.jsonl.
46. **Entity hardening.** Organization schema with sameAs to the GitHub org
    and npm packages once published. **[you]** partly.
47. **Corrections log.** We now have real ones (the unreproducible "17",
    the mobility-group misfile). A visible corrections page is rare in this
    niche and converts directly to trust.

## G. Measurement (prerequisite for believing any of the above)

48. **GSC + Bing export pipeline.** **[you: access or monthly CSV]** — a
    `npm run gsc` report ranking pages by impressions × CTR gap. Without
    this, items 21–28 are guesses.
49. **Title experiments as cohorts** with 28-day windows. **[GSC]**
50. **Self-hosted web-vitals + engagement beacons** (no third-party SDK,
    consistent with the site's privacy posture) feeding an internal report,
    so engagement work is also measured, not vibes.

## Deliberately not on the list

Re-proposals that already failed measurement or policy review: 240 individual
identifier pages (median discussion 23 words → thin), pairwise comparison
permutation pages, invented social proof, buying or exchanging links, and any
tactic that needs a number we cannot source.

## If only five happen

1 (group pages) → 48 (measurement) → 11–13 (the three paste-tools) → 21
(title width) → 29/30 (publish the two packages). That order front-loads the
biggest impression surface, makes everything after it measurable, and ships
the two assets that are already built and waiting on credentials.
