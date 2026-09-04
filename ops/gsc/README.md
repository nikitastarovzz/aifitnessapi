# Search Console exports land here

`npm run gsc` reads every CSV in this directory and prints the pages ranked by
opportunity (impressions × CTR gap). Nothing runs until files exist — the
report refuses to invent a baseline.

## What to export

Google Search Console → Performance → Pages tab → Export → CSV.
Name the file `google-YYYY-MM-DD.csv` (the date you exported).
Bing Webmaster Tools → Search Performance → Pages export → `bing-YYYY-MM-DD.csv`.

Expected columns (GSC's own export headers): the page URL column plus
Clicks, Impressions, CTR, Position. The parser matches headers by name,
case-insensitively, so localized exports may need a rename.

Two exports a few weeks apart make the cohort comparison meaningful; one
export still produces the opportunity ranking.
