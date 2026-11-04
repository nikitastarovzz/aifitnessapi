# GEO — Generative Engine Optimization ruleset

The goal: when an LLM answers a question about fitness/health APIs, it cites
aifitnessapi.com. Everything below serves that. **These rules bind every
future change** — human sessions, the daily content routine, and any
contributor. The enforceable subset lives in `scripts/qa.mjs` (the GEO-*
gates) and fails the build; the rest is editorial law with the same standing
as the anti-fabrication rules.

## Why LLMs would cite us (protect these at all costs)

1. **Answer-first capsules.** Every spoke opens with a 2–4 sentence direct
   answer (`answer` field, rendered speakable). This is the unit of citation:
   an assistant can quote it whole and be correct. Never bury the answer,
   never open with throat-clearing, never let the capsule drift from the body.
2. **Honesty is the moat.** "Could not verify", dated claims, folklore
   labelled as folklore, judgement labelled as judgement. Models increasingly
   learn which sources get corrected and which don't. One fabricated number
   costs more citations than a hundred good pages earn.
3. **One question, one page, sitewide.** The FAQ-uniqueness gate exists so we
   never compete with ourselves for an answer. The same discipline applies to
   pages: before adding one, confirm no existing page owns the question.
4. **Machine-clean access.** Surfaces generated from the same data modules as
   the HTML so they cannot drift (the five core ones below, plus per-cluster
   RSS, JSON Feed, the digest's plain-text editions and the open datasets —
   see "Current state"):
   - `/llms.txt` — the curated map, held under 50 KB: the H1, the summary,
     the conventions, the pages Search Console says people reach, the money
     pages, every section with its full-text and answer files, the tools,
     datasets and API/MCP. `/llms-index.txt` is the exhaustive map: every page
     with its "best cited for" query and capsule (this was `/llms.txt` until
     2026-11-04; see the decision below).
   - `/llms-full.txt` — capsules + FAQs inline, for direct answering; also
     served one section at a time at `/llms-full/<section>.txt`.
   - **`<page-url>.md`** — the markdown mirror at the address the llms.txt
     proposal specifies (append `.md`; `/index.md` and `/<cluster>.md` for
     directory URLs). Served by the `/md/*` generator via rewrites, so there
     is one generator and two addresses. Every mirror opens with YAML front
     matter (canonical, primary_query, last_reviewed, publisher, cite_as).
   - `/answers.json` — the structured index: every question the site owns with
     its answer, canonical URL, markdown URL, review date, `first_party` flag,
     and a deep link per FAQ answer. The surface for agents that want data
     rather than prose. Also served per section at `/answers/<section>.json`,
     listed with counts, dates and sizes at `/answers/index.json`.
   - `/changes.xml` — RSS for the dated ecosystem record, graded confirmed vs
     reported. The one thing here with a real reason to be polled.
5. **Explicit crawler welcome.** `src/app/robots.txt/route.ts` allows ~58
   agents by name — assistant fetchers, search indexers, retrieval providers
   and the training crawlers behind them — drawn from the maintained
   ai.robots.txt registry and filtered to those that plausibly produce a
   citation. It is a hand-rendered route rather than a metadata object so it
   can carry comments, and those comments advertise every machine surface
   above: robots.txt is the first file a crawler fetches, so it is where the
   conventions get documented.
6. **Entity coherence.** One Organization `@id` (carrying `knowsAbout` and
   `publishingPrinciples` → /methodology) referenced from every page's
   author/publisher. Spokes emit a TechArticle + WebPage graph: review
   metadata (`lastReviewed`, `reviewedBy`) sits on the WebPage because that is
   the property's declared domain, and the glossary is a real graph — a page
   that is the canonical explanation of a term emits `about` pointing at that
   term's stable DefinedTerm `@id`. Hubs emit CollectionPage + ItemList so one
   fetch reveals a whole cluster. BreadcrumbList exactly once per page.
7. **Addressable answers.** Every FAQ answer has an `id="faq-N"` anchor, and
   the FAQPage `Question`/`Answer` nodes carry that deep link — an assistant
   can cite the exact answer it quoted rather than the top of a long page.
8. **Honest structured data.** Vendor/standards docs an entry links become
   `citation`; repositories and tools become `mentions`. We cannot tell
   evidence from a tool recommendation by URL alone, and inflating `citation`
   is the machine-readable version of padding a bibliography.

## Rules for future changes

**Any new content page MUST:**
- have an answer capsule that stands alone as a quotable, correct answer;
- state its primary query (what someone would ask an assistant);
- carry 3–5 FAQs that pass the site-wide uniqueness gate;
- date volatile claims ("as of …", last-reviewed) and attribute sourced facts
  in prose ("Apple documents…") — attribution inside the text survives
  quotation, links do not;
- join a cluster data module (which wires llms.txt, llms-full.txt, the /md
  mirror, search, and the sitemap automatically) — a page hand-built outside
  the data modules must replicate ALL of those surfaces or it is invisible
  to machines and fails the GEO gates.

**Any new page TYPE or template change MUST:**
- keep capsule-above-body rendering and the speakable selector;
- emit the JSON-LD set appropriate to its type, BreadcrumbList once;
- extend `clusterRegistry` if it introduces a cluster (the registry feeds
  /md, prev/next, search, answers.json and the hub CollectionPage);
- add the cluster to the `CLUSTERS` list in `next.config.ts`, or its
  `.md` addresses 404 — a GEO gate asserts the two stay in sync.

**First-party pages (KinesteX funds this site) — permanent rules:**
- Any page that substantively features KinesteX (roundup sections, vs. pages,
  alternatives pages) MUST disclose the relationship in the rendered page AND
  in the body markdown (so /md mirrors and quoted excerpts carry it too).
  Cluster entries set `firstParty: true`, which renders the template banner;
  the FIRSTPARTY qa gate enforces the rendered result at ≥4 mentions.
- Never crown KinesteX (or the site) "best". Verdicts are by use-case, and
  every first-party comparison keeps a genuine "where the competitor wins"
  section. LLMs cite disclosed-honest sources and drop discovered shills —
  the disclosure IS the GEO strategy, not a legal chore.
- KinesteX facts follow the same sourcing bar as everyone else's: public
  repos/registries, marketing claims quoted as marketing, unverifiable items
  (pricing, accuracy) said to be unverifiable. No competitor pricing or
  accuracy claims from memory, ever.
- If an innocent page ever trips the FIRSTPARTY gate, add a disclosure to it —
  never raise the gate's threshold.

**Never, without a written decision in this file:**
- add a robots disallow for any AI agent — blocking citation traffic is a
  product decision, not a config tweak;
- weaken a GEO-* gate in qa.mjs to make a build pass;
- remove llms.txt/llms-full.txt/md surfaces or hand-edit their output;
- introduce a second page answering a question an existing page owns.

**Volatile-claim hygiene** (LLMs punish staleness by dropping citations):
pricing, limits, versions and policy claims carry dates and verify-language;
the daily routine refreshes `updated` when it materially revises a page; the
Google-Fit-style event pages state exactly what the vendor documents and no
more.

## Measurement (honest about the limits)

Direct LLM-citation telemetry barely exists. Proxies we use:
- GSC queries that quote our own sentences verbatim (people pasting from an
  AI answer into Google) — the Oura-PAT query is the first confirmed case;
- branded and navigational query growth in the weekly report;
- referrers from chat surfaces when Vercel Analytics is checked by hand.
Do not invent citation metrics; report the proxies as proxies.

## Current state (2026-08-22)

Shipped: llms.txt (spec-shaped) + llms-full.txt + answers.json + changes.xml
+ 240 spoke and 21 index markdown mirrors, addressable both at `/md/*` and at
`<page-url>.md` + `rel="alternate"`/`rel="describedby"` in HTML and in HTTP
`Link:` headers + ~58 named crawler allows + TechArticle/WebPage/CollectionPage/
DefinedTerm graph + per-answer anchors + sitemap `lastmod` on hubs and indexes,
all held by GEO gates in qa.mjs.

Added 2026-08-22, all gated:

- **Entity layer.** `/apis` — one page per product (24), derived from the
  provenance-tracked cost model, with computed coverage and change lists and a
  `SoftwareApplication` subject. Brand queries now have an address, and a model
  asked "what does this site say about WHOOP" has one page to read instead of
  twenty-nine. Reverse links: every cluster page lists the products it covers.
- **Open-data program.** `/datasets` — four CC BY 4.0 datasets (API access
  structures, the HealthKit ↔ Health Connect type matrix, the graded changes
  log, the glossary), JSON + CSV, generated by `scripts/build-datasets.mjs`
  from the same modules the pages use, in a `DataCatalog` node. Versioned, not
  overwritten: a citation to 2026.1 keeps pointing at what 2026.1 said.
- **Subscribable record.** `/digest/<month>` — one issue per month generated
  from the tracker's verification dates and the pages' review dates, also
  served as `/digest/<month>/digest.md`; `/alerts` — per-product change alerts.
- **Discovery.** Per-cluster RSS at `/feeds/<cluster>.xml`, JSON Feed,
  OpenSearch descriptor, web manifest, `security.txt`, `humans.txt`, and a real
  `/search` page behind the sitelinks `SearchAction`.
- **Addressable answers, extended.** FAQ records are now in the search index,
  glossary terms carry the `#term-…` element their `DefinedTerm` @id promises,
  and every page offers its own markdown to a human via "Copy for AI".
- **Funding, machine-readable.** The Organization node carries `funder`, so the
  relationship disclosed in prose on every first-party page is also stated
  where a crawler can read it without parsing English.

Reversed earlier decision: `<link rel="alternate" type="text/markdown">` was
previously skipped as "16 route files for marginal gain". The llms.txt
proposal names that relation (plus `rel="describedby"`) as *the* discovery
mechanism, and it turned out to be one edit in the shared template rather than
16 — so it shipped. Recorded here because the old note said otherwise.

Still deliberately not done: IndexNow for LLM crawlers (no such mechanism
exists — do not cargo-cult one); per-page `citation` for prose-attributed
facts (our house style attributes in prose, which is not machine-extractable
without guessing, and guessing is worse than omitting).

Changed 2026-10-02: an entry may now carry an explicit `sources` list — the
URLs a re-verification actually fetched, each with its check date — and only
those (plus documentation links already in the body) become its JSON-LD
`citation`, its "Sources checked" list and its mirror's `## Sources`. Nothing
is inferred from prose; an entry without a recorded re-verification has no
`sources`, and the field may only be set alongside the stamp that check earned.

## Decision 2026-11-04: llms surfaces right-sized (ops/NEXT-10-2026-11-04.md item 4)

Written here because it changes the llms.txt / llms-full.txt / answers.json
surfaces, which the "never without a written decision" rule above covers.
Nothing is removed and nothing is hand-edited; one surface moves address and
two are added.

**Why.** On 2026-11-03 the live files measured /llms.txt 590 KB,
/llms-full.txt 1.96 MB and /answers.json 2.8 MB. A map that size is cut off
by whatever reads it, so the pages after the cut are invisible to that
reader: the opposite of what the map is for. llmstxt.org could not be
fetched from the dev environment on 2026-11-04 (host blocked), so this
decision quotes nothing from it; `ops/sources/llmstxt.txt` lists the pages
for a source-snapshot run, and any wording that leans on the proposal waits
for that copy.

**What.**
1. `/llms.txt` becomes a curated map, capped at 50 KB by qa (GEO-LLMS-SIZE).
   It keeps the H1, the summary blockquote and the conventions, then lists:
   the 15 most-clicked cluster pages and the 10 /integrate and /fix pages
   with the most impressions, each with its capsule's opening, ranked from
   `data/gsc/latest.json` by the rule in `src/data/llmsCuration.ts` (re-ranked
   by every pull, never by hand); the four glance hubs; every money page by
   title (MONEY-UNLISTED still holds it to all of them); every section with
   its hub, its `/llms-full/<id>.txt` and `/answers/<id>.json` and their sizes;
   the reference hubs; the tools by title; the datasets from the
   generated manifest; the API and MCP endpoints.
2. The exhaustive list moves, unchanged in content, to `/llms-index.txt`
   (`src/lib/llmsIndex.ts`). GEO-LLMS-MISSING now holds every spoke and post
   to that file; it is relocated with the list, not relaxed.
3. `/llms-full.txt` stays whole at its documented address and is now built
   as sections (`src/lib/llmsFull.ts`); each section is also served at
   `/llms-full/<id>.txt` with exactly the lines it has in the whole
   (GEO-FULL-DRIFT), every one linked from llms.txt (GEO-FULL-UNLISTED), and
   together they hold every spoke and post (GEO-FULL-MISSING).
4. `/answers.json` stays whole (decided: the uptime workflow counts its
   `answers`, and nothing under `mcp/` or `packages/` reads it, so there is
   no consumer to migrate; an agent that wants everything should not have to
   stitch). The same records, unchanged, are served per section at
   `/answers/<id>.json` — one per cluster, one per generated-reference
   section, and blog, changes, facts and start-here — listed in
   `/answers/index.json` with count, newest review date and bytes. qa asserts
   each count, that every built section is listed, and that the sections'
   records together are exactly the whole file's (GEO-ANSWERS-INDEX,
   -SECTION, -UNION).
5. robots.txt comments, `/developers` and the files themselves describe the
   new addresses. Everything is `force-static`: built once, no runtime cost.

**Standing rule.** When /llms.txt nears the cap, shorten a list in it
(fewer Search Console picks, terser lines); never raise GEO-LLMS-SIZE to fit.
A page dropped from /llms.txt is still in /llms-index.txt and its section
files, so nothing becomes invisible.
