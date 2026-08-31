# Impressions, CTR, usefulness, conversion

Written 2026-08-31 against the live repo. Every number here is measured from
the build unless marked otherwise.

## The blind spot, stated first

**I have no Google Search Console or Bing Webmaster data.** Everything below
reasons from the supply side — what the site could rank for — not from what it
currently does rank for. That is enough to find structural gaps and it is not
enough to prioritise precisely.

One GSC export (Queries + Pages, 12 months, CSV) changes the quality of this
plan more than anything else in it. With it, the "which pages are printing
impressions at position 8–20" question becomes answerable, and that cohort is
almost always where the fastest wins are.

## 1. Ten-times the impressions

Impressions are roughly `Σ (queries you appear for × times each is searched)`.
So 10× comes from more ranking URLs, more queries per URL, or higher-volume
queries. Ranked by measured upside against risk:

### A. 240 identifiers sit on one URL — the biggest single gap

| Surface | Items | URLs today |
|---|---|---|
| HealthKit identifiers | **240** | 1 |
| HKError cases | **17** | 1 |
| FAQ pairs | **1,148** | 0 addressable |
| Glossary terms | 33 | 1 |
| Directory products | 24 | 24 ✓ |
| Spoke guides | 252 | 252 ✓ |

Every identifier is a literal string a developer pastes into a search box —
`HKQuantityTypeIdentifier.stepCount`, `HKCategoryValueSleepAnalysis`. A single
page can realistically rank for a handful of them, not 240.

I rejected 240 individual pages earlier and that rejection stands: Apple's
median discussion is 23 words, so they would be thin. **Group pages are the
resolution.** Apple's own topic sections give the split, and each is
substantial:

Activity 35 · Nutrition 39 · Vital signs 11 · Mobility 8 · Lab and test
results 9 · Body measurements 7 · plus category types 30 and workout
activities 84.

That is ~10–12 pages, each covering 7–84 identifiers with real synthesis (the
cumulative/discrete split within the group, the unit families, the Android
counterparts, the traps). Each page becomes a plausible landing target for
dozens of exact-string queries. **This is the highest-yield work available and
it does not require a single unverified fact** — the data is already generated.

### B. 1,148 FAQs are invisible as query targets

They render inside pages and sit in FAQPage schema, which makes them eligible
for "People also ask" — genuinely valuable — but there is no index, no hub,
and no way for a long-tail query to land on the answer rather than the page.
A per-cluster questions index (21 pages) plus deep anchors turns an existing
asset into an entry surface. No new claims, no new writing.

### C. The error/symptom surface is 15 pages

Error strings are the highest-volume developer long-tail there is, and they
convert to trust instantly because the reader arrived mid-failure. `/fix` has
15 entries; `/healthkit-errors` adds 17 named cases. The vendor-side errors
(Fitbit, Strava, Oura, Garmin rate limits and OAuth failures) are blocked on
documentation this environment cannot reach — see the egress note in
`ops/GROWTH-RESEARCH-2026-08.md`.

### D. Bing is already mechanically handled

`scripts/indexnow.mjs` runs from `.github/workflows/indexnow.yml`, so Bing and
Yandex get pinged on change. Bing's index is smaller and its ranking leans
harder on exact-match titles and clean structure than Google's — which means
lever A helps Bing disproportionately, because identifier strings are exact
matches. Google ignores IndexNow; for Google the sitemap plus internal links
plus the group pages are the path.

### E. Sitemap hygiene

327 URLs, 279 with `lastmod`. The 48 without are mostly tool and utility
routes. Low value, cheap to fix.

## 2. CTR

Descriptions are already in good shape. Titles are not, and the gap is
measurable.

| Title length | Pages |
|---|---|
| under 40 chars | **79** |
| 40–49 | 170 |
| 50–55 | 62 |
| 56–60 | 20 |
| over 60 | 2 |

Mean is **44 characters** against roughly 60 usable. Nearly a quarter of pages
throw away a third of the width they are given. Descriptions by contrast: mean
147, with 226 of 332 in the 146–155 band — that work is done.

Three levers, in order:

1. **Spend the unused title width on a differentiator.** Not keyword padding —
   a reason to click. A count, a date, a format: "Every HealthKit Error Code"
   (26 chars) has room for "— all 17, with Apple's wording". Numbers and
   recency are the two things that reliably lift CTR on developer queries.
2. **Rich results.** FAQPage and Dataset schema are already emitted. The
   missing one is `HowTo` on the integration guides and `SoftwareSourceCode`
   on the cookbook, both of which widen the SERP entry.
3. **Visible recency.** `dateModified` is emitted; pages now render elapsed
   time. For "current" queries — which is most of this niche — a fresh date in
   the snippet is worth more than another keyword.

Caveat worth stating: CTR work is measurable only against a GSC baseline. Do
lever 1 on the 79 short titles, then compare cohort CTR before and after.

## 3. Making it extremely useful

The site currently *tells* you things. It barely *does* anything. Two tools
(`/picker`, `/cost-planner`) against 331 pages of prose.

The three built-but-unpublished assets are the biggest usefulness upgrade
available and they need credentials, not code — see `ops/DISTRIBUTION.md`:
the MCP server, the typed data package, and the CC-BY dataset repo.

Beyond those, the highest-value additions are all "paste something, get an
answer":

- **Paste an error, get the diagnosis.** The single highest-intent moment in
  this audience's life.
- **Paste a HealthKit query, get told whether the aggregation is right.** We
  hold the only dataset that can answer it: 64 cumulative, 53 discrete.
- **Pick your metrics, get the exact permission set** for both platforms —
  a real, annoying, repeated task.

Each is a tool, not an article, and each is answerable from data already in
the repo.

## 4. Converting readers to KinesteX

### What exists today

Nothing. The only call to action on all 252 spoke pages is the newsletter.
Until this session there were **zero crawlable links to kinestex.com** — the
332 occurrences were the JSON-LD `funder` node, which is structured data, not
an anchor. There are now 13 disclosed editorial links on the pages that
already discuss the product.

### The constraint that makes this work

Most readers are not KinesteX prospects. The audience is "developers
integrating health data"; KinesteX serves the subset who need camera-based
motion coaching. Any mechanism that pushes the product at someone who came for
Fitbit OAuth burns the exact asset that makes the site worth reading — and
`ops/GEO.md` already forbids crowning our own product.

So the mechanism is **qualification, not funnelling**.

### The mechanism, in four steps

**1. Let the reader self-identify.** `/picker` already asks what they are
building. When the answer is "AI motion / camera tracking", that is the
qualifying signal, and today it returns links. It should return a next step:
the neutral comparison, the evaluation protocol, and — disclosed — the managed
option.

**2. Convert on an artifact, not a pitch.** This audience converts on
`npm install` and a working sandbox, never on "book a demo". The single
highest-leverage thing KinesteX could offer through this site is a quickstart
that produces a working rep counter in ten minutes with a self-serve key. That
is a product decision, not a site change, and it is worth more than every
other item here.

**3. Segment at signup.** One field — "what are you building?" — splits the
list into motion-SDK intent and everything else. The motion segment is a
qualified audience; the rest get the newsletter they signed up for.

**4. Attribute it.** `CtaSource` already exists. Extend it so a click carries
the cluster and the picker answer, and the question "which content produces
qualified developers" becomes answerable instead of guessed.

### What not to do

Sitewide banners, exit intent, gating the reference behind an email, or
ranking KinesteX above better-fitting options. Each would lift a short-term
number and destroy the thing that makes any of this work. The site converts
*because* it is trusted; a reader who catches it selling is gone permanently,
and so is the LLM citation traffic that depends on it being neutral.

## 5. Dizzout — a different answer

Dizzout is a consumer motion-sickness app (sound therapy, iOS and Android,
subscription). It has nothing to do with fitness APIs, wearables, health-data
integration or developer tooling.

**A blog post on aifitnessapi.com written to host links to it is the textbook
definition of what search engines classify as a link scheme**, and it would be
read that way: an off-topic promotional post on a specialist developer
reference. The cost is not hypothetical — the site's entire value, including
the LLM citations it is starting to earn, rests on being a neutral verified
reference. One unrelated promo post is visible to every reader and every
crawler.

Two further blockers specific to this environment:

- **dizzout.com is unreachable from here** (egress-blocked), so I cannot
  verify a single claim about it.
- Its marketing claims are **health-efficacy claims** — resolving nausea in
  about 90 seconds, resetting the inner ear. Republishing those unverified on
  a site whose one rule is that facts need a fetched primary source would be
  the worst thing this site could publish.

There is also a plain SEO point: links between sites under the same ownership
pass very little authority. Even done perfectly, this would not move Dizzout.

### What would actually work

1. **Content on dizzout.com itself.** That is where the ranking accrues.
2. **A genuinely relevant page here, if one is wanted.** There is a real
   adjacency: **motion sickness and vestibular comfort in VR and camera-based
   fitness apps.** The `/accessibility` cluster already covers Reduce Motion,
   and VR fitness genuinely causes sickness. A page on designing for
   vestibular sensitivity would serve this audience, and a disclosed mention
   of a consumer tool in that context would be honest. It needs Dizzout's
   claims to be verifiable first.
3. **App Store optimisation and independent coverage** — for a consumer app,
   worth more than any backlink from a developer reference site.

I have not written the post. Say the word on option 2 and I will build the
accessibility page properly, with the mention disclosed and only claims I can
source.
