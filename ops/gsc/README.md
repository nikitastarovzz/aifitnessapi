# Search Console exports land here

`npm run gsc` reports on these sources:

1. **`data/gsc/latest.json`** — the Search Console API snapshot, read
   automatically. This is where the site's real data has been living. Until
   2026-10-02 the report never looked at it, so `npm run gsc` printed "no
   data" with 116 KB of it sitting in the repo.
2. **`data/gsc/bing-latest.json`** — Bing's query report for the same window
   (`byQuery`), read as Bing's own query list.
3. **CSVs in this directory** — exports, merged on top. Only the newest CSV
   per engine is read: each file is a full 28-day report, so reading a week's
   file and the next one together would count the overlap twice.

## The live pull (since 2026-10-12)

Inside the aifitnessapi cloud environment:

```
NODE_USE_ENV_PROXY=1 node scripts/search-pull.mjs   # Google + Bing, last 28 days of final data
node scripts/build-api-demand.mjs                   # regenerates src/data/apiDemand.ts
npm run gsc
```

`scripts/search-pull.mjs` reads Search Console through the environment
proxy's read-only credential (send no Authorization header; never request
Firebase keys for it) and Bing through `BING_WEBMASTER_API_KEY`, which it never
prints. It writes `data/gsc/latest.json` (with a country × device breakdown,
which the report uses for the CTR line without US desktop), a dated snapshot
in `data/gsc/snapshots/` that `--compare` reads, `data/gsc/bing-latest.json`
and `bing-YYYY-MM-DD.csv` here. Bing's query → page pairs come from one call
per query and are partial (Bing names a page for few queries); absent pairs
mean Bing did not say. A short or failed read writes nothing. Outside that
environment Search Console answers 401/403 and the committed files are the
fallback. A weekly routine runs it and opens a pull request.

## What to export

Google Search Console → Performance → Pages tab → Export → CSV, named
`google-YYYY-MM-DD.csv`.

Bing Webmaster Tools → Search Performance → Pages export → `bing-YYYY-MM-DD.csv`.

Bing is reported **separately**, not averaged in. Its click curve is not
Google's, and a blended CTR describes neither engine.

Expected columns: a page/URL column plus Clicks, Impressions, and — worth
including — Position. Headers match case-insensitively. Position is optional
but without it every page is scored as if it ranked first, which makes the
opportunity ranking meaningless.

## Tracked queries

`ops/gsc/tracked-queries.txt` holds the brand and the 30 "fitness api" queries
from the search-results study (ops/SERP-30-2026-10-12.md). Every `npm run gsc`
prints them with Google's and Bing's numbers side by side; a dash on Google
means the query was not disclosed, not that we were not shown. The Google
section also prints how many `www.` URLs Google still reports, which should
fall as the apex redirect consolidates.

## How a page gets ranked

Opportunity is `impressions × (expected CTR for its position − actual CTR)`:
the clicks the position should be paying that the page is not collecting.

The previous version benchmarked against the **site average** instead. On a
site averaging 0.76%, that scores a page sitting at position 5 with 2% CTR as
having negative opportunity — it beats the average — when it should be earning
about 6%. Every genuine page-one problem was invisible. The curve is a public
composite, approximate by nature, and is used only to order pages against each
other; it is never a target.

## Flags

```
npm run gsc                      # opportunity ranking, per engine
npm run gsc -- --snapshot        # archive today's read to data/gsc/snapshots/
npm run gsc -- --compare 2026-10-02   # page-by-page change since that snapshot
npm run gsc -- --cohorts         # title-length buckets (needs npm run build)
```

`--snapshot` is the one that matters over time. A single overwritten
`latest.json` cannot answer "did the work help", which is why the 34 changes
shipped on 2026-09-04 have never been measured: the only export predates them.
Take a snapshot before a content wave and compare after it.

## Retitled vs control (`--compare`)

A recovery lifts every page at once, so "the retitled pages gained" proves
nothing alone. `retitled.txt` in this directory lists the pages a title wave
touched — one path per line, `#` comments, a trailing `*` for a prefix
(`/apis/*` = every page under `/apis/`, not the hub). When it exists,
`--compare` prints, after the page table, impressions / clicks / CTR /
position before → now for the **retitled** group and for every other page as
the **untouched (control)** group, then the retitled-minus-control
difference. Only movement beyond the control is attributable to the titles.
It is a crude difference-in-differences with no significance test, and it
warns when the two windows differ in length or are the same export. Lines that
match no page in either snapshot are listed, which catches typos.

Current cohort: the October 2026 wave (`ops/GROWTH-OCT-2026.md`). A later wave
needs its own snapshot and its own list. Mixing two waves in one file makes the
treated group mean nothing.

## GEO citation proxy (always on)

`ops/GEO.md` counts a query that reproduces one of our own sentences as the
best available sign that someone pasted our text, usually out of an AI answer,
into Google. The first confirmed case, `"personal access tokens were
deprecated in december 2025" oura`, was once misread as a vendor developer
string. The report now checks this every run:

- **Candidates:** queries (by query and by query+page) with ≥5 words or a
  quoted segment. The phrase tested is each quoted segment of ≥4 words, or
  the whole query when there is none.
- **Match:** lowercase, punctuation and whitespace collapsed, whole words,
  inside a single string of the site's prose. That means the string values of
  `src/data/*.entries.ts` (parsed as JSON) and `content/posts/*.mdx` bodies
  with their front-matter description and FAQ answers.
- **Left out of the corpus:** slug, primaryQuery, h1, metaTitle, and FAQ
  questions. They are written in searcher phrasing on purpose: `is the strava
  api free` matches two FAQ questions, and that is SEO working, not a
  citation.
- **Skipped, but still listed:** queries containing a domain, path, or
  dotted/snake_case identifier (the Nutritionix endpoint, a MediaPipe model
  path). Our code samples quote these, so they match, but they are vendor
  strings and nobody is pasting our prose.

Each hit prints the query, its landing pages with impressions and position,
and the file and entry slug it matched. It is a proxy, not citation telemetry.
Report it that way.
