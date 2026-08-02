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
4. **Machine-clean access.** Three surfaces, all generated from the same data
   modules as the HTML so they cannot drift:
   - `/llms.txt` — the map: every page with its "best cited for" query.
   - `/llms-full.txt` — capsules + FAQs inline, for direct answering.
   - `/md/<cluster>/<slug>` — full-article markdown mirror with a citation
     header (canonical URL, review date, cite-as line). HTML stays canonical.
5. **Explicit crawler welcome.** `robots.ts` allows GPTBot, OAI-SearchBot,
   ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended,
   Applebot-Extended, CCBot and peers by name.
6. **Entity coherence.** One Organization `@id` referenced from every page's
   author/publisher; Article/FAQPage/HowTo/Dataset/DefinedTermSet JSON-LD by
   page type; BreadcrumbList exactly once per page.

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
  /md, prev/next and search).

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

## Current state (2026-08-02)

Shipped: llms.txt + llms-full.txt + 169 /md mirrors + explicit crawler
allows + capsules/FAQs/JSON-LD sitewide + 6 GEO gates in qa.mjs.
Deliberately not done: per-page `<link rel="alternate" type="text/markdown">`
tags (16 route files to touch for marginal gain — the consumers read
llms.txt, which announces the mirror convention); IndexNow for LLM crawlers
(no such mechanism exists — do not cargo-cult one).
