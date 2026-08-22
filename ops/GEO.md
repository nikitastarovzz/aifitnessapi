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
   - `/llms.txt` — the map: every page with its "best cited for" query, its
     markdown mirror, and the site's conventions.
   - `/llms-full.txt` — capsules + FAQs inline, for direct answering.
   - **`<page-url>.md`** — the markdown mirror at the address the llms.txt
     proposal specifies (append `.md`; `/index.md` and `/<cluster>.md` for
     directory URLs). Served by the `/md/*` generator via rewrites, so there
     is one generator and two addresses. Every mirror opens with YAML front
     matter (canonical, primary_query, last_reviewed, publisher, cite_as).
   - `/answers.json` — the structured index: every question the site owns with
     its answer, canonical URL, markdown URL, review date, `first_party` flag,
     and a deep link per FAQ answer. The surface for agents that want data
     rather than prose.
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
