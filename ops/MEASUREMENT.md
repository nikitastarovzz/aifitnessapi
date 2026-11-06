# Measurement — what the site sends and how to read it

Added 2026-11-04 (ops/NEXT-10-2026-11-04.md item 2). Before this, no AI
referral was measured, CTA clicks went only to Plausible or a GTM dataLayer
that the site never loads (so they were counted nowhere), and links to
kinestex.com carried no UTM.

Everything is client-side, through `trackEvent` in `src/lib/track.ts`, into
the Vercel Web Analytics the site already mounts (`SiteInstrumentation.tsx`).
No API route, no middleware, no new dependency. None of it runs under
`/embed/`. The rules live in one tested module, `src/lib/measure.mjs`
(`npm run test:measure`).

## Events

| Event | When | Properties |
|---|---|---|
| `landing` | first page view of a browser session (a `sessionStorage` flag, `aifa_landed`) | `source_class`, `source`, `landing_path` |
| `cta_click` | a click on any `[data-cta]` element (CtaLink and the delegated backstop) | `id`, `source` (the CtaSource placement), `page` |
| `funder_click` | a click on any link to kinestex.com or a subdomain | `placement`, `page` |

`source_class` is one of:

- `ai_assistant` — `source` is `chatgpt`, `perplexity`, `claude`, `copilot`,
  `gemini`, `you`, `phind`, `kagi_assistant`, `duckduckgo_ai`, `deepseek`,
  `grok`, `meta_ai` or `mistral`. Matched on the referrer host (path or query
  where the host is shared with a search product: bing.com/chat,
  kagi.com/assistant, duckduckgo.com/?ia=chat) or on `utm_source`
  (ChatGPT appends `utm_source=chatgpt.com`). An AI match from either signal
  wins over everything else.
- `search` — `google` (any `google.<tld>`), `bing`, `duckduckgo`, `kagi`,
  `yahoo`, `ecosia`, `brave`, `yandex`, `baidu`.
- `other` — `source` is the referrer's host without `www.`, or `utm` for an
  unrecognised utm_source with no referrer.
- `internal` — same-site referrer on a new session (a link opened in a new tab).
- `direct` — no referrer, no utm_source.

Known undercount: browsers trim cross-site referrers to the origin by
default, so Bing chat, Kagi Assistant and DuckDuckGo's AI chat usually arrive
as plain `bing.com` / `kagi.com` / `duckduckgo.com` and count as `search`.
Assistants that open links with `noreferrer` and no utm tag count as
`direct`. Treat `ai_assistant` as a floor.

`placement` on `funder_click` is `kinestex_note` (the contextual
KinestexNote), `footer_funding` (the sitewide credit), `methodology`, or
`citation` for a "Sources checked" link to a kinestex.com page.

## CTA ids (`cta_click` → `id`)

Added 2026-11-05 (ops/MORE-30-2026-11-05.md items 27–29). Each is a plain
element with `data-cta` and `data-cta-source`, counted by the delegated
listener in `CtaTracker`; none adds a click handler of its own. `page` on the
event says which page the click came from.

| id | source | Where | What the click is |
|---|---|---|---|
| `next-step-<target path, slashes as dashes>`, e.g. `next-step-fitness-apis-health-data-aggregator-apis`, `next-step-integrate` | `tool-next-step` | The "Next step" block at the foot of every tool page: the twelve `/tools/*` tools, `/challenge`, `/daily`, `/play/ship-it`, `/graveyard`, `/market-map`, `/fitness-api-index` (`components/ToolNextStep`, targets in `data/toolNextSteps.ts`) | a link to a money page |
| `newsletter-pricing`, `newsletter-alternatives`, `newsletter-compare`, `newsletter-integrate` | `money-newsletter` | The "Get the newsletter" button on every English page in those four sections (`components/InlineSignup`), in place of the `cta-<slug>` link those pages carried before | opening (or closing) the inline signup form; it is a `<details>` summary, not a navigation |
| `kit-checklist`, `kit-scorecard`, `kit-zip` | `money-kit` | The decision-kit block on every English `/pricing` and `/alternatives` page (`components/DecisionKitCta`); `kit-scorecard` only on motion-SDK pages | a direct download of `/kit/api-selection-checklist.md`, `/kit/motion-sdk-scorecard.csv` or `/kit/fitness-api-decision-kit.zip`, ungated |

Added 2026-11-05 (ops/AUDIENCE-30-2026-11-05.md items 24–26):

| id | source | Where | What the click is |
|---|---|---|---|
| `search-to-answers-search` | `search-results` | The result count line on `/search` (`components/SearchResults`) | a link to `/answers-search?q=<the same query>` |
| `embed_countdown_copy` | the page path | The copy button in every "Embed a countdown" control (`components/CountdownEmbed`): `/badges`, `/graveyard`, `/changes/<vendor>`, `/fitbit-api-shutdown`, `/google-fit-shutdown` | a successful copy of a countdown widget's iframe code (fired by `CopySnippet`, not a navigation) |

Added 2026-11-06 (ops/VIRAL-20-2026-11-06.md items 6–8). Share rows
(`components/ShareRow`) build plain compose URLs (`lib/shareIntents.mjs`); the
id is fixed in code, so no event carries a reader's answers, inputs or stack.
`<target>` is `copy`, `x`, `linkedin`, `bluesky` or `reddit`.

| id | source | Where | What the click is |
|---|---|---|---|
| `share-quiz-<target>` | `share-row` | The result box of `/quiz/which-wearable-api` | copying, or opening a compose page for, the static result page's URL |
| `share-quiz-result-<target>` | `share-row` | Every `/quiz/which-wearable-api/<result>` page | the same, from the result page |
| `quiz-result-page` | `quiz` | The result box of the quiz | a link to the full static result page |
| `share-picker-<target>` | `share-row` | The `/picker` result | the `/s?t=picker&…` share address, which has the answer's own card |
| `share-rate-limit-calculator-<target>` | `share-row` | `/tools/rate-limit-calculator`, under the inputs | the page's current address, read at the moment of the click |
| `share-build-plan-<target>` | `share-row` | `/tools/build-plan`, under the download buttons | the same |
| `share-compliance-wizard-<target>` | `share-row` | `/tools/compliance-wizard`, under the download button | the same |
| `share-api-coverage-matrix-<target>` | `share-row` | `/tools/api-coverage-matrix`, under the filters | the same |

`/my-stack` and `/answers-search` send no events of their own: the stack and
the query stay in the browser. The `/my-stack` share card (drawn on a canvas
in the tab) and its share row carry no `data-cta`, so they send nothing
either.

A completed signup from the inline form also fires `cta_click` with id
`signup-complete` and source `money-<section>` (the form's own event), and the
stored signup record carries `source: money-<section>`. Before 2026-11-05 the
same pages sent `cta-<slug>` / `spoke-inline` from a link to `/#subscribe`;
compare the two ids across the change date, not within one range.

## UTM on links to the funder

Every placement link to kinestex.com is built by `funderHref(placement, path)`
in `src/lib/measure.mjs`:

```
https://kinestex.com/?utm_source=aifitnessapi&utm_medium=referral&utm_campaign=<placement>&utm_content=<page path>
```

`utm_campaign` is the placement above, `utm_content` the linking page's
pathname (no query, no fragment). In KinesteX's own analytics, filter
acquisition by source `aifitnessapi`; campaign splits note vs footer, content
gives the page. Add a new placement to `FUNDER_PLACEMENTS`, never a hand-built
URL; `rel="sponsored"` stays on the footer credit.

Deliberately untagged: the "Sources checked" citations to kinestex.com pages
(the URL shown is the URL that was read, and evidence files quote it), the
JSON-LD `url` in `src/lib/schema.ts`, and `mailto:` addresses. Citation clicks
still fire `funder_click` with `placement: citation`.

## Reading it in Vercel Analytics

Project → Analytics → Events panel. Click an event name to break it down by a
property:

- **AI share of landings**: `landing` → `source_class`; then filter
  `source_class = ai_assistant` and break down by `source`, and by
  `landing_path` to see which pages assistants cite.
- **Funder clicks by page**: `funder_click` → `page`, or `placement` to
  compare the note against the footer. Divide by page views of the same path
  (Pages panel) for a click rate.
- **CTA clicks**: `cta_click` → `id`, `source` or `page`.

Use the panel's date range for before/after reads against the Nov 10 and
Nov 24 search pulls. Could not verify from the dev environment (vercel.com is
blocked by the proxy): which Vercel plan custom events need, and how custom
events count toward the project's analytics event allowance. Check both in
the Vercel dashboard before reading a zero as "no traffic".

## Privacy

`/privacy` states all three events in plain language. The classifier returns
labels from fixed lists and a bare host; the full referrer URL, its query and
free-text utm values never reach an event. Change the privacy page in the
same PR as any new event or property.
