# Bing

Written 2026-10-03, after the five-day 402 outage, for a site that has **no
Bing presence or data of any kind**: no claimed Bing Webmaster Tools property,
no `bing-*.csv` in `ops/gsc/`, and nothing Bing-specific in the build beyond
IndexNow. Google work has a feedback loop here (`data/gsc/latest.json`,
`npm run gsc`); Bing work has none until the property is claimed, which is the
one step in this file that cannot be done from the repo.

Bing matters beyond Bing: its index is what its own assistant answers from, and
IndexNow is the only push-notification channel this site has to any engine —
Google does not use it.

## What is already wired, and where

| Thing | Where it lives | State |
|---|---|---|
| `bingbot` explicitly allowed | `src/app/robots.txt/route.ts` | Named group, same shared `RULES` as every other group (`Allow: /`). Was already allowed via `User-agent: *`; now it is legible and inside the "a Disallow reaches every named agent" rule. No `Crawl-delay` — see below. |
| Sitemap advertised to every crawler | same file, `Sitemap:` line, outside the groups | `https://aifitnessapi.com/sitemap.xml`. Necessary, not sufficient — Bing still wants it submitted in the console. |
| `lastmod` accuracy | `src/app/sitemap.ts` | Every row is dated from the page's own declared `dateModified`, or carries no `lastmod` at all. Never build time. Re-audited 2026-10-03; `npm run qa` gates it per row (`SITEMAP-LASTMOD`). |
| IndexNow key file | `public/7ab02ba01079101c36facfcb28908c50.txt` | Public by design. IndexNow 403s if it stops being reachable. |
| IndexNow on every push to `main` | `.github/workflows/indexnow.yml` | Automatic, diff mode. No one has to remember `npm run indexnow`. |
| IndexNow `--all` after an outage | `.github/workflows/uptime.yml`, the recovery branch | Fires once when the probes go from failing to passing with a site-down issue open. |
| Bing performance data | `ops/gsc/README.md`, `scripts/gsc-report.mjs` | Reads `ops/gsc/bing-YYYY-MM-DD.csv` and reports Bing **separately** from Google. No file exists yet. |

## Owner actions — nothing in the repo can do these

### 1. Claim the Bing Webmaster Tools property

Two routes, and the first is much faster if the Google property is already
verified:

- **Import from Google Search Console.** BWT → Add a site → *Import from GSC*.
  This also brings the sitemaps across, and it needs no code change at all. If
  you take this route, steps 2 and 3 are unnecessary.
- **Verify directly** with the meta tag wired below.

### 2. Set `BING_SITE_VERIFICATION` (only if verifying directly)

BWT → Add your site manually → the **"Add a meta tag to your home page"**
option shows a code. Copy the `content` value only — not the whole tag.

1. Vercel → the `aifitnessapi` project → Settings → Environment Variables.
2. Add `BING_SITE_VERIFICATION` = that value, for **Production**.
3. **Redeploy.** `metadata` is evaluated at build time, so the tag is baked
   into the static HTML — setting the variable alone changes nothing on the
   live site.
4. Confirm it is live, then click Verify in BWT:

   ```
   curl -s https://aifitnessapi.com/ | grep msvalidate
   ```

The code is not a secret — it is served in the HTML of every page — so a plain
environment variable is right and a GitHub Secret is not. It is read in
`src/app/layout.tsx`; while the variable is unset, no tag is emitted, and
there is deliberately **no placeholder code anywhere in this public repo**.

The alternative BWT proofs are a `BingSiteAuth.xml` at the site root or a DNS
record. The meta tag was chosen over the XML file for exactly one reason: a
file in `public/` would have to ship a fake code until the owner replaced it,
and a committed placeholder is the kind of thing that survives for months. If
you would rather use the file, it goes in `public/BingSiteAuth.xml` and the
env var becomes dead — remove it.

### 3. Submit the sitemap and ask for the recovery crawl

In BWT, once verified:

- Sitemaps → Submit `https://aifitnessapi.com/sitemap.xml`.
- URL Inspection → submit the pages in `ops/GROWTH-OCT-2026.md` §A.5, in that
  order. They are the ones with measured Google impressions, which is the best
  available guess at what Bing will also rank; there is no Bing data to order
  them by.
- Crawl information: check for 402s left over from 2026-09-27 → 10-02. The
  site served 402 to bingbot for five days and a sustained 4xx is a removal
  signal, not a retry signal.

### 4. Export the first Bing data

BWT → Search Performance → Pages → Export, saved as
`ops/gsc/bing-YYYY-MM-DD.csv`. Then `npm run gsc` reports it. Take the first
export as soon as the property has any data at all, so there is a baseline to
compare the next one against — the Google side went months without one.

## Decisions worth not re-litigating

**No `Crawl-delay` for bingbot.** Bing honours it, and this site is trying to
be crawled *more*. If Bing ever needs throttling, it has a crawl-control
setting in its own console, which can be changed without a deploy.

**IndexNow stays diff mode by default.** Resubmitting all ~430 URLs on every
deploy asks for hundreds of crawls that find nothing and buries the few pages
that did change. `--all` is for one thing: an outage, where every URL needs
re-announcing because every URL was served an error. That case is now wired to
fire by itself (`uptime.yml` → `indexnow.yml` with `mode=all`); the Actions →
indexnow → Run workflow → `mode: all` button remains for a manual one-off.

**Bing is reported separately from Google, never blended.** `ops/gsc/README.md`
has the reasoning: the two click curves are different and an average describes
neither engine.
