# 50 changes — October 2026 (recovery, impressions, CTR)

Written 2026-10-02. Grounded in the only Search Console data the repo holds
(`data/gsc/latest.json`, 2026-07-06 → 08-02), three audits (technical,
freshness, hosting), a 311-page SERP sweep, and an adversarial critique of the
first draft. The critique's corrections are applied below; the items it killed
are listed at the end with the reason.

Markers: **[owner]** needs credentials, a dashboard or a decision only the
owner has · **[egress]** limited by this sandbox's network policy (only
developer.apple.com and developer.android.com were reachable on 2026-10-02) ·
status is filled in as items land.

## What the data says worked (July GSC, verified)

- **Vendor-named commercial-investigation pages took 26 of 32 clicks.**
  /pricing 9 clicks from 573 impressions (1.57% CTR vs 0.76% site-wide);
  /fix/garmin-api-approval 6 from 182; /fitness-apis/terra-vs-vital 6 from 53;
  /alternatives 1.71%; /compare 2.44%.
- **Titles that ask the free question earned 8 of 9 pricing clicks.**
- **Literal developer strings reach page one**: the Nutritionix endpoint (7),
  MediaPipe constants (8.7–10), and the site's own Oura sentence (8.3) — the
  last is a GEO citation proxy (ops/GEO.md), not a vendor string.
- **The largest query family is "fitbit error code 401"** (~345 impressions at
  ~9.6, eight spellings), all landing on the /fix hub with 0 clicks.
- **87% of impressions were on www URLs** while every canonical is the apex.
- **What did not work**: hubs, /blog (median position 191), /build, /learn
  definitions — SERPs owned by agencies, publishers and clinical sites.

The headline is not in the data: since 2026-09-27 the site has returned
**402 DEPLOYMENT_DISABLED** (a Vercel account pause). Google reads a sustained
4xx as removal. Nothing below matters until #1 is done.

## A. Recovery — owner only

1. **[owner] Restore availability.** Vercel → Usage: record the tripped metric
   and spike date in ops/README.md; upgrade or wait for the reset. Then trigger
   a **fresh production deploy of `main` HEAD** — re-enabling alone brings back
   the old deployment with past-dated copy. Verify the served build matches
   HEAD before #16's full IndexNow run.
2. **[owner] New `VERCEL_TOKEN`; turn on outage email** (`ALERT_EMAIL`
   variable, `RESEND_API_KEY` secret); dispatch uptime.yml once.
3. **[owner] Usage/spend notifications; firewall.** Rate-limit only the POST
   endpoints (feedback, signup, search-miss, vitals). Exempt
   /api/signup/health — the uptime probe calls it.
4. **[owner] One host.** Apex as production, www → apex 308 preserving path;
   GSC Domain property. #13 adds the probe that fails if it flips.
5. **[owner] Resubmit sitemap; request indexing** (Google and Bing) in order:
   /fix, /integrate/nutritionix-api, /fix/garmin-api-approval,
   /pricing/strava-api-pricing, /fitness-apis/terra-vs-vital,
   /pricing/fitbit-api-pricing, /alternatives/terra-alternatives,
   /pricing/exercise-database-api-pricing, /pricing/whoop-api-pricing,
   /motion/pose-estimation-models-compared, /fix/fitbit-error-code-401,
   /healthkit, /tools.
6. **[owner] Export GSC and first-ever Bing data** at recovery and day 28 —
   only after #22's baseline snapshot is committed.
7. **[owner][egress] Allowlist vendor doc hosts** (dev.fitbit.com,
   developers.google.com, cloud.ouraring.com, developers.strava.com,
   developer.garmin.com, developer.whoop.com, nutritionix.com, docs.tryterra.co,
   ai.google.dev) so the earning pages can be re-verified before their 90-day
   flags.
8. **[owner] Planned downtime serves 503 + Retry-After, never 4xx**; decide on
   a standby static host on a separate account.

## B. Hosting hardening — code

9. Close the open image proxy (`images.unoptimized`; next/image is unused) + qa gate.
10. `dynamicParams = false` on /blog/[slug] + qa gate: every dynamic route has `fallback: false`.
11. /api/og accepts only validated picker enums; 400 otherwise (no free text).
12. SDK tracker skips star/pushedAt-only commits (stars at most weekly).
13. Uptime probe: `--compressed`, answers.json fetched once, www→apex 308 check.
14. Health endpoint caches a 200 at the edge for 5 minutes.
15. Footer links stop prefetching; Web Vitals sample 10% → 2%.

## C. Re-indexing and technical SEO — code

16. IndexNow: explicit `--all` for the one recovery resubmission; otherwise
    diff mode, fired on successful production deploys; a non-200 sitemap fails
    the job.
17. Real `lastmod` on the 101 undated sitemap URLs (never build time); drop
    changefreq/priority.
18. Markdown mirrors send `rel=canonical`; fix the `.md.md` alternate header.
19. Root layout stops handing every route a homepage canonical; /s and the 404 fixed.
20. 8 pages stop inheriting the homepage og:url/title; qa gate og:url == canonical.
21. robots.txt: every agent group from one rule list; drop `Host:`; correct the mirror claim.
22. Commit the July GSC baseline snapshot before any new import.

## D. Internal linking — send demand to the page built for it

23. /fix hub: "Common fixes" block with literal query anchors (Fitbit error
    code 401 first); list every released fix; qa gate.
24. Link /fix/fitbit-error-code-401 from the 401 umbrella page and /integrate/fitbit-api.
25. HealthKit identifier rows → `/healthkit/<group>#id-<lowercased>`;
    prev/next between groups; contextual links from integrate/apis/matrix/data;
    qa gate that every linked fragment exists.
26. "MediaPipe vs MoveNet" links to its dedicated page.
27. Oura PAT searches → links to the fix page (the sentence stays).
28. Fitbit deprecation intent → /fitbit-api-shutdown (ships with #41).
29. Homepage and footer surface /healthkit, /tools, /questions, /accessibility;
    /gates and /newsletter get real inbound links.
30. Tool CTAs on the pages whose readers need them (per-slug map).
31. /learn definitions link their /data spokes (no retitles into owned intents).
32. /apis/<id> titled for "<Brand> API" navigational searches; vendor pages link it near the top.

## E. CTR — only where attributed queries exist

33. Nutritionix: brand first, endpoint and `x-app-id` added.
34. Strava pricing (161 impressions at 8.5, 1 click): lead with the cost/free question.
35. Garmin pricing: "Is it free?" (single-page test).
36. Web guide only: lead with MediaPipe Pose Landmarker.
37. Terra-led titles get a health-API qualifier.
38. Blog posts can carry a query-shaped meta title; used only where no cluster page owns the query.
39. Title years: a freshness-marker year must equal the year of `updated`; qa gate.
40. Attribution: retitles logged before/after in content-log; a control cohort
    left untouched; gsc-report flags queries that quote the site's own sentences.

## F. Freshness — the site's core claim

41. Past-dated Fitbit turndown copy rewritten outcome-proof; status stays "reported".
42. Google Fit: quote the migration guide's successor rows (re-fetched in-session).
43. HealthKit dataset regenerated to Apple's current count; HRV claims match the source.
44. Stale queue fixed (unstamped files), weighted by demand, 90-day threshold aligned.
45. Staleness shown on the event hubs, /changes and blog posts.
46. "Upcoming" deadlines decided in the browser, not at build time.
47. Re-verify the oldest entries whose sources are reachable, in `npm run stale` order.
48. A `sources` field on entries, filled for every entry re-verified.

## G. Structured data and content

49. One Article node per post; honest datePublished from a committed
    first-published map; HealthKit pages published 2026-09-04; tools as WebApplication.
50. On-device reference tables (HealthKit, Health Connect) from fetched Apple and
    Android docs, plus Node-runnable cookbook recipes linked from /architecture.

## Killed by the critique

- **HKError numeric codes** — Apple's docs JSON does not state raw values; inferring them from case order would be guessing.
- **Per-vendor pricing pages (Polar, Terra, Junction)** — duplicate the aggregator page; hosts blocked.
- **Approval-gate pages for WHOOP/Polar/Oura/Strava** — hosts blocked, and one page per vendor must own access intent first (GEO rule).
- **/s as 144 static pages** — rejected in GROWTH-RESEARCH-2026-08 item 19.
- **Retitling /learn and /build** — the SERPs are a different intent; /build stays frozen.
- **FAQ additions on pricing pages** — WHOOP and Strava already ask the question and did not convert.
- **Verbatim vendor error payloads, Fitbit Google-account angle** — Fitbit/Google hosts blocked; revisit after #7.
- **Platform-guide retitles beyond web** — no attributed queries.
