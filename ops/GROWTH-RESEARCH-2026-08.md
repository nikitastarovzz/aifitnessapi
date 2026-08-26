# Competitor research → 20 programmatic growth ideas

Researched 2026-08-26. Method and limits are in the last section — read them
before treating any number here as verified.

## The five competitors

### Direct — same niche, same shape

| Site | What it is | The move worth stealing |
|---|---|---|
| **sahha.ai** | Vendor with a content arm; `/compare/{vendor}-alternatives/` pages plus explainer posts | Owns "alternatives to X" as a URL template, not as one-off posts. Also ranks for HealthKit-vs-Health-Connect, which is our home turf |
| **openwearables.io** | Vendor + comparison directory; `/compare` hub and `/compare/{vendor}` per rival | Every rival page goes deep on one axis set — pricing, data ownership, provider support, migration. Consistent template, differentiated cells |
| **tryrook.io/competitors** | Vendor-owned head-to-head hub vs Terra, Spike, Thryve | Publishes its own price list against rivals'. Concrete numbers are what gets quoted |
| **healthapiguy.substack.com** | Brendan Keeler (HTD Health; ex-Flexpa, Zus, Redox, Epic). Tens of thousands of subscribers | Authority + cadence: daily short posts, monthly long roundup. He is the person LLMs quote on wearable interop. This is an audience moat, not an SEO moat |
| **promptloop.com/directory** | Machine-generated company directory ranking for "what does {company} do" | Pure entity pages at scale with no human editing — proof the entity-page template ranks even when thin. We can beat it on the same query with verified data |

Note: `aifitnessapi.com/alternatives/terra-alternatives` already surfaces
alongside sahha and openwearables on that query. We are in the set.

### Scale analogues — where "millions" actually comes from

| Site | Scale (third-party estimates) | Mechanism |
|---|---|---|
| **Zapier app directory** | 5.8–9M monthly organic visits from 50,000–70,000 integration pages | Pairwise combinatorics: `{app A} + {app B}`. 5,000 apps = 25M theoretical pairs; they ship the fraction that has real data |
| **RapidAPI Hub** | 40,000+ APIs, 4M+ developers, ~1.67M monthly visits | One entity page per API + marketplace transaction |
| **caniuse.com** | The reference for "can I use X" | A support **matrix** as the product. Data is CC-BY on GitHub and got merged with MDN's — the dataset became infrastructure |
| **github.com/public-apis** | 471,000 stars | Distribution *is* the product. A repo people star, fork and link forever |

## What actually drives it — five mechanisms

1. **Combinatorial entity pages.** Not "more articles" — a grid of
   `{entity} × {entity}` where each cell is a distinct database record.
2. **A dataset nobody else has.** Zapier, Wise and TripAdvisor scale because
   each page surfaces data competitors don't hold. caniuse's moat is the
   support table itself.
3. **Freshness as a ranking and citation signal.** Perplexity in particular
   prefers recent, dated content.
4. **Off-site distribution.** Package registries, awesome-lists, embeddable
   badges and starred repos generate backlinks that content alone never will.
5. **Citation-shaped writing.** A measured optimization study reports
   +41% from quotations, +32% from statistics, +30% from citations.

### The quality gate that decides whether this works or backfires

Reported thresholds for programmatic pages that survive: **≥500 unique words,
≤40% template share, one distinct dataset record per URL.** The test to apply
per page: *could a reader assemble this in thirty seconds from a search?* If
no at scale, the whole page set is at risk.

This is the standard I previously lacked when I declined to build 276
comparison pages and shipped `/compare-apis` as a tool instead. That call was
right for undifferentiated pages. It is worth revisiting per-cell, not
wholesale.

## Our entity pools

24 products (cost model) · 10 metrics (matrix) · ~8 client frameworks ·
~40 glossary terms · dated changes in the tracker · 21 clusters / 252 spokes today.

## The 20 ideas

### A. Combinatorial page sets

| # | Idea | Math | Data it stands on |
|---|---|---|---|
| 1 | **"Does {product} give you {metric}?"** — the caniuse model for health data | 24 × 10 = **240** | matrix.ts + apiCoverage.ts already hold it. Each page: supported/partial/no, exact field name, permission scope, sampling rate, known gaps, snippet, changes touching it |
| 2 | **{product} × {framework} integration pages** — the Zapier move | 24 × 8 = **192** candidates | Ship only cells with a verified working snippet. The gate *is* the differentiator |
| 3 | **Complete the pairwise grid** | 276 candidates, ship the **~120** that clear the gate | Requires differentiated verified data on ≥6 axes for both sides |
| 4 | **Error & symptom database** | `/fix` has 15 → target **300+** | Every product × documented failure: 401, 403, 429, scope denied, empty payload, webhook silence, token expiry, sandbox-vs-prod. Developers paste exact error strings into search *and* into LLMs |
| 5 | **Platform identifier reference** — one page per HealthKit type identifier and Health Connect record type | ~**150** | Each identifier is a literally-searched string. We cover 10 metrics; this is 15× |
| 6 | **"How to read {metric} in {framework}"** | 10 × 8 = **80** | Runnable snippet per cell |

### B. Living data — freshness is the citation signal

| # | Idea | Why |
|---|---|---|
| 7 | **Status/uptime aggregator** per product, polling public status pages | "Is Fitbit API down" is recurring, high-volume, and nobody owns it in this niche |
| 8 | **Sunset & deadline calendar** — per-product deprecation entities, live countdowns, ICS feed | We already own the Fitbit and Google Fit shutdown pages; systematize it |
| 9 | **SDK version tracker** from GitHub releases / npm / pub.dev | "What changed in {sdk} {version}" — auto-generated,always fresh, and GitHub is machine-readable |
| 10 | **Pricing history tracker** — monthly snapshots, published diffs | Pricing keywords are the money terms in the directory model, and history is data no competitor keeps |

### C. Off-site distribution — the actual millions lever

| # | Idea | Precedent |
|---|---|---|
| 11 | **Publish the datasets as a standalone CC-BY GitHub repo** | caniuse's data on GitHub got merged into MDN; public-apis has 471k stars |
| 12 | **npm package** shipping matrix/glossary/changes as typed JSON | Registries rank and backlink; makes us a dependency, not a destination |
| 13 | **An MCP server** answering "which API gives me HRV on Android" | Terra and Spike already ship MCP layers. This puts us *inside* the AI coding tools where the audience now works |
| 14 | **Awesome-list placement** (awesome-health, awesome-quantified-self, awesome-api) | High-authority in-GitHub backlinks |
| 15 | **Provider-embeddable verified-compatibility badge** | `/badges` and `/embed` exist; each embed is a backlink from the vendor's own site |

### D. AI search / GEO

| # | Idea | Why |
|---|---|---|
| 16 | **Quarterly measured benchmark** — latency, field coverage, auth-flow step counts, run programmatically | Original statistics are the single most citation-boosting content feature (+32%). It is the one thing we cannot get from anyone's docs |
| 17 | **Question-mined pages** from real developer questions in public GitHub issues across the SDK repos | A reachable, dateable corpus of genuine long-tail intent — not keyword guesses |
| 18 | **Public answers API + per-fact citation anchors** | `/answers.json` exists; give every factual cell a stable anchor and a "cite this" permalink so a model quoting us has an address |

### E. Depth and moat

| # | Idea | Why |
|---|---|---|
| 19 | **Indexable canonical result pages** for the top N picker / cost-planner combinations | `/s` is dynamic and noindex; the popular presets deserve static, indexable, linkable pages |
| 20 | **Verified-integration signal** — a lightweight count or confirmation of who shipped with each product | G2 and AlternativeTo's moat is votes. Even a thin UGC signal is a data field no rival has |

### Sequencing

Ideas **1, 4 and 5** are the highest ratio of new indexed pages to new risk:
the data already exists in the repo, each page carries a distinct record, and
the query intent is unambiguous. **11, 12 and 13** are the ones that change
the traffic ceiling rather than the traffic slope. **3 and 20** are the ones
most likely to go wrong and should go last.

## Method and limits

- Network egress this session allowed only `github.com` /
  `raw.githubusercontent.com` for direct fetching, plus web search. Every
  competitor site above was read through **search-engine summaries, not
  fetched directly** — I could not open caniuse.com, zapier.com, rapidapi.com,
  sahha.ai, openwearables.io or tryrook.io.
- **All traffic figures are third-party estimates** and sources disagree with
  each other (Zapier is variously reported at 2.6M, 5.8M, 6.3M and 9M monthly
  visits). Treat them as order-of-magnitude, not measurements.
- The 471,000-star figure for public-apis and its table schema were fetched
  directly from GitHub and are firsthand.
- The pSEO quality thresholds and the GEO uplift percentages come from
  secondary write-ups of studies, not from the studies themselves. They are
  directionally useful; they are not verified primary sources and must not be
  published on the site as facts without fetching the originals.
- Entity counts (24 products, 10 metrics, 21 clusters, 252 spokes) were read
  from this repo and are exact.
