# Search Console exports land here

`npm run gsc` reports on two sources:

1. **`data/gsc/latest.json`** — the Search Console API snapshot, read
   automatically. This is where the site's real data has been living. Until
   2026-10-02 the report never looked at it, so `npm run gsc` printed "no
   data" with 116 KB of it sitting in the repo.
2. **CSVs in this directory** — manual exports, merged on top.

## What to export

Google Search Console → Performance → Pages tab → Export → CSV, named
`google-YYYY-MM-DD.csv`.

Bing Webmaster Tools → Search Performance → Pages export → `bing-YYYY-MM-DD.csv`.

Bing is reported **separately**, not averaged in. Its click curve is not
Google's, and a blended CTR describes neither engine. There is currently no
Bing data of any kind for this site.

Expected columns: a page/URL column plus Clicks, Impressions, and — worth
including — Position. Headers match case-insensitively. Position is optional
but without it every page is scored as if it ranked first, which makes the
opportunity ranking meaningless.

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
