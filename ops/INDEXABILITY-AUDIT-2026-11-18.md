# Indexability audit, 2026-11-18

Question (ops/INDEX.md, 2026-11-17): Google showed 3 of 59 pages published
Oct 26 to Nov 9 within 7 days, against 57% of 447 before; 102 published pages
have never drawn an impression and the ten pt-BR pages almost none. Is a
technical defect on the site the cause, or do the new pages differ technically
from the ones Google shows?

**Answer: no technical defect explains it.** Every one of the 102 never-shown
pages answers 200, carries exactly one self-referencing canonical, says
`index, follow` with no X-Robots-Tag, is in the sitemap exactly once with a
lastmod, sits two or three clicks from the homepage, is linked from its
cluster hub, has a unique title and description and parses as valid JSON-LD
with the same node types as the shown pages. Production matches the build on
every one of those signals. No layout, metadata, sitemap, robots, proxy or
next.config change between 2026-10-18 and 2026-10-28 touches indexability for
English pages. The one measurable difference is that newer pages have fewer
internal links (median 12 against 17 to 22), which they will gain over time
and which does not separate them sharply: never-shown pages published before
Oct 3 have a median of 56. What changed is Google's appetite for new URLs on
this site, not the URLs. Only URL Inspection can say whether those pages are
"Discovered" or "Crawled — currently not indexed", and that is owner-only
(below).

## Method

- Built this worktree (`npm run build`, commit `0a0010b` plus this branch) and
  served it with `npx next start -p 3201`.
- Crawled the build breadth-first from `/` following every internal `<a href>`
  (1,292 HTML pages, no page unreachable; every sitemap URL was reached by the
  crawl, so click depth is exact). For each page: HTTP status (redirects not
  followed, recorded), `<link rel=canonical>`, `<meta name=robots|googlebot>`,
  `X-Robots-Tag`, hreflang links, `<html lang>`, title, description, every
  `application/ld+json` block through `JSON.parse`, words inside `<main>`
  (scripts and styles stripped), internal outlinks; inlinks are distinct
  source pages linking the URL.
- Read the sitemap index and its eight children (`/sitemaps/<id>.xml`) for
  section, lastmod and `xhtml:link` alternates per URL.
- Never-shown set: sitemap URLs with a date in `src/data/published.ts`,
  published at least 7 days before 2026-11-16 (the ledger's asOf), that appear
  neither in `data/gsc/first-seen.json` nor in `data/gsc/latest.json`'s
  `byPage`. That gives **102**, the same count as ops/INDEX.md, and contains
  its 10-URL request list. (Read literally, `latest.json` alone gives 171:
  its window starts 2026-10-15, so it misses pages shown only before then.
  The ledger is the right base.)
- Shown sample: 40 shown pages from the never-shown pages' clusters, in
  proportion, newest first. The statistics are also given for all 445 shown
  eligible pages.
- Then the same checks against production (`https://aifitnessapi.com`, with a
  Googlebot user agent) for the 102 + 40, and the live sitemap index and
  children against the build's.

The scripts were throwaway (scratchpad), not committed.

## Never-shown against shown

| Signal | Never shown (102) | Shown sample (40) | All shown (445) |
|---|---|---|---|
| HTTP 200, no redirect | 102 | 40 | 445 |
| Exactly one canonical, self-referencing | 102 | 40 | 445 |
| `index, follow` meta, no noindex anywhere | 102 | 40 | 445 |
| X-Robots-Tag header | 0 | 0 | 0 |
| In the sitemap exactly once | 102 | 40 | 445 |
| Sitemap row has lastmod | 102 | 40 | 445 |
| lastmod earlier than published.ts date | 5 | 12 | 71 |
| Linked from its cluster hub | 90 (see note) | 38 | 440 |
| Internal inlinks, median | 15 | 21 | 20 |
| Pages with fewer than 3 inlinks | 2 | 1 | 1 |
| Click depth from `/`, median / max | 2 / 3 | 2 / 3 | 2 / 3 |
| Words in `<main>`, median | 2,197 | 2,451 | 2,084 |
| Pages under 600 words | 0 | 0 | 0 |
| Title unique site-wide | 102 | 40 | 445 |
| Description unique site-wide | 102 | 40 | 445 |
| Title over 60 characters | 0 | 0 | 0 |
| Every JSON-LD block parses | 102 | 40 | 445 |
| `<html lang>` en / pt-BR | 93 / 9 | 39 / 1 | 444 / 1 |

Hub note: the 12 "not linked from the hub" are the nine pt-BR pages (there is
no per-cluster Portuguese hub; `/pt-br` links all ten) and three pages that
are themselves hubs (`/workout-types`, `/healthkit-status`,
`/healthkit-category-values`). Every English spoke in the never-shown set is
linked from its hub.

The "lastmod earlier than published" rows are pages whose `updated` stamp is
the day before the release commit (written Oct 17, merged Oct 18, +04:00).
Their JSON-LD agrees with the sitemap (datePublished = dateModified = the
stamp), and shown pages have it more often than never-shown ones, so it is not
the cause.

JSON-LD node types are the same templates in both groups: Organization,
WebSite, TechArticle, WebPage (CollectionPage on hubs), FAQPage,
BreadcrumbList, plus HowTo or SoftwareSourceCode where the page has steps or
code.

### By publication window (inlinks are the one gap)

| Published | Group | Pages | Median inlinks | Median words |
|---|---|---|---|---|
| before Oct 3 | never shown | 10 | 56 | 2,113 |
| before Oct 3 | shown | 253 | 22 | 2,305 |
| Oct 3 to Oct 18 | never shown | 34 | 14 | 1,998 |
| Oct 3 to Oct 18 | shown | 183 | 17 | 1,846 |
| Oct 22 to Nov 9 | never shown | 58 | 12 | 2,559 |
| Oct 22 to Nov 9 | shown | 9 | 18 | 1,937 |

The oldest never-shown pages (the HKError fix pages of 2026-09-04,
`/guides/camera-pose-tracking`) are among the best-linked on the site and
still have no impression, so being linked is not sufficient either. They
answer error-code and API-symbol searches with little volume.

## Production matches the build

- 142 of 142 checked URLs (102 never-shown + 40 sample) answer 200 to a
  Googlebot user agent, with no X-Robots-Tag, a self canonical and the same
  canonical and robots meta as the local build.
- The live sitemap index lists the same eight children; together they hold
  959 URLs, the same 959 as the build, with identical lastmod on every row.
  All 102 never-shown URLs are in it.
- robots.txt: `User-agent: * / Allow: /`, Sitemap line points at the index.
  Googlebot is not named in any group, so it takes `*`.
- Markdown mirrors (`<page>.md`) answer with `Link: <page>; rel="canonical"`,
  so they cannot compete with the HTML. No .md, .txt or .json URL has ever
  drawn a Google impression (ledger and latest pull); `/opensearch.xml` is the
  only non-HTML URL in either, and it now carries `X-Robots-Tag: noindex`.

## Site-wide crawl hygiene

- 1,291 of 1,292 crawled HTML URLs answer 200; the one other is `/mcp`
  (405 to GET, linked from `/developers`; it is the MCP endpoint and takes
  POST). No internal link reaches a redirect or a 404.
- 328 pages are noindex (214 `/embed/*`, 27 `/questions/*`, 23 `/apis/*`, 8
  `/weekly/*`, 8 `/quiz/*`, the rest the 2026-10-27 hygiene list). None is in
  the sitemap; no indexable HTML page is missing from it.
- Median 97 internal links per page (p90 116); HTML about 230 KB, of which
  about 140 KB is the inline RSC payload. Normal for this stack and the same
  for old and new pages.

## Template and config changes, 2026-10-18 to 2026-10-28

`git diff bc33df1 b0186a5` over `src/app/layout.tsx`, robots, sitemap,
`src/proxy.ts`, `src/lib/sitemap.ts`, `src/lib/site.ts`, `next.config.ts`,
`ClusterPage.tsx`, `clusterRoute.ts` and `vercel.json`:

- `layout.tsx` (#42, Oct 28): `<html lang>` moved into the client component
  `HtmlRoot`, so pt-BR pages say `lang="pt-BR"`. The prerendered HTML carries
  the right value (checked on all 1,292 pages: `pt-BR` under `/pt-br`, `en`
  elsewhere).
- `next.config.ts` (#38, #41, #42): `/motion/mediapipe-vs-movenet` redirects
  to the new `/compare/mediapipe-vs-movenet`; `/blog/welcome-to-aifitnessapi`
  308 to `/about`; pt-BR markdown rewrites and `Content-Language: pt-BR`;
  `X-Robots-Tag: noindex` on `/opensearch.xml` only. None touches an English
  HTML page's indexability.
- `ClusterPage.tsx`: snippet, routing and hub-answer changes; no change to
  canonical or robots output.
- `vercel.json` (#40, Oct 28): `ignoreCommand` skipping documentation-only
  deploys. Production holds every page and the same sitemap as the build, so
  no content deploy was skipped.
- The 40 noindexed old pages of #41 (item 4b) and the sitemap index split of
  2026-11-05 (#52) are deliberate and correct: the index URL is unchanged and
  Search Console read it on Nov 10 (ops/GSC-10-2026-11-13.md).

## What the timeline shows instead

Google's first impressions came in two waves, each after a large publication
week, and stopped after the second:

| Week (Mon) | Pages published | Paths first shown that week |
|---|---|---|
| Sep 28 | 99 | 3 |
| Oct 5 | 0 | 189 |
| Oct 12 | 120 | 50 |
| Oct 19 | 8 | 190 |
| Oct 26 | 22 | 45 |
| Nov 2 | 32 | 19 |
| Nov 9 | 11 | 18 |

(First-shown counts include hubs and generated pages without a published.ts
date.) Meanwhile Google impressions over 28-day windows kept rising: 16,944
(to Oct 19), 19,450 (to Oct 24), 23,899 (to Oct 31), 26,909 (to Nov 11). The
pages Google already shows are shown more; new URLs are no longer being taken
up. That is consistent with Google slowing indexing of new URLs from a
four-month-old site that published about 240 pages in the first three weeks of
October, and not with a defect: a site-wide defect (noindex, canonical,
robots, sitemap, rendering) would have cut the existing impressions too.

Which part of the pipeline has stopped cannot be read from Search Analytics.
URL Inspection for a handful of the never-shown URLs is the test: "Discovered
— currently not indexed" means Google has not fetched them (crawl demand),
"Crawled — currently not indexed" means it fetched and declined them
(quality or duplication). The environment's read-only credential cannot reach
that API (ops/INDEX.md, "The limit of this signal").

## pt-BR (the ten translations)

All ten are current translations and all ten check out:

| Check | Result |
|---|---|
| Status | 200 on all ten, and on `/pt-br` |
| Canonical | self, absolute, on all ten |
| Robots | `index, follow` (plus googlebot `max-image-preview:large`) |
| `<html lang>` / `Content-Language` | `pt-BR` / `pt-BR` |
| hreflang on the pt-BR page | `en` = English page, `pt-BR` = itself, `x-default` = English page |
| hreflang on the English page | the same three, so the pair is reciprocal on all ten |
| Sitemap | all ten in `/sitemaps/pt-br.xml` with lastmod and the same three `xhtml:link` alternates; the English pages carry them in their own child |
| Language switch | each English page links its translation ("Leia em português", `hreflang="pt-BR" lang="pt-BR"`); each translation links back ("Read in English") and to `/pt-br` |
| Inlinks | 2 to 6 each: the English page, `/pt-br`, and other translations |

One of the ten (`/pt-br/fix/garmin-api-approval`) has an impression; the nine
others are in the never-shown list. No defect to fix. The likely reason is
demand: these pages answer Portuguese searches for developer API terms, which
are rare, and for most of them Google can serve the English page. The only
discovery path from the English site is the language switch on the ten
English pages; `/pt-br` itself is linked only from the translations. That is
the normal shape for a translation and was left as it is.

## Fixes in this change

1. **`/tools/permission-builder` gets `id="xray"` on the tool section**
   (`src/app/tools/permission-builder/page.tsx`). PR #73 made
   `/tools/permission-builder#xray` open the paste mode by reading the hash,
   but no element had that id, so any link using the fragment would fail qa's
   FRAGMENT-DEAD and would not scroll to the tool. The id is on the section
   that holds both modes, with the site's usual `scroll-mt-24` under the
   sticky header.
2. **Contextual links to the Permission X-ray** from the pages where a reader
   debugs health permissions, each saying only what the tool does:
   - `/health-connect/permissions` (`src/app/health-connect/permissions/page.tsx`)
   - `/health-connect-api/permissioncontroller-request-permissions`
     (`src/data/healthConnectApi.entries.ts`, after the rationale-activity
     manifest)
   - `/fix/healthkit-authorization-denied` (`src/data/fix.entries.ts`, in the
     Info.plist keys section)
   - `/fix/health-connect-securityexception` (`src/data/fix.entries.ts`, at
     cause 2, "Not declared in the manifest")
   No `updated` stamp moved; none of these pages has a translation.
   `/fix/healthkit-required-authorization-denied` was left alone: its key
   (the required-read-authorization Info.plist key) is not one the X-ray
   documents.
3. **Two unused imports removed** (`src/app/fitness-apis/page.tsx`,
   `src/app/google-health-api/errors/page.tsx`), from the lint run below.

No new qa check: the audit found no defect a check could hold.

## Owner actions

- URL Inspection on three or four of the never-shown URLs from different
  clusters (for example `/compare/ml-kit-vs-mediapipe`,
  `/alternatives/rook-alternatives`, `/cookbook/token-vault`,
  `/pt-br/integrate/garmin-api`) to learn whether Google has fetched them,
  then Request indexing for the list in ops/INDEX.md.
- The index governor already holds new pages to the weekly probe; the audit
  gives no reason to loosen it.

## ESLint

`eslint.config.mjs`, the `lint` script and both ESLint packages were removed
on purpose in #77 (2026-11-16, "`npx eslint` crashed on the FlatCompat
config. Nothing ran either."). The config the brief describes no longer
exists, and ESLint is not in `package.json` or the lockfile: `npx eslint` only
starts in this checkout because the shared `node_modules` predates #77 and
still holds eslint 9.39.4 and eslint-config-next 16.2.10. Restoring a config
would mean re-adding those dependencies or committing a config that a fresh
`npm ci` cannot load, so none is committed.

The crash itself is FlatCompat (`@eslint/eslintrc`) wrapping
eslint-config-next 16, which already exports flat configs
(`eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`).
Spreading those two directly works. Run outside the repository with:

```js
// eslint.config.mjs (not committed)
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default [...nextVitals, ...nextTs, { ignores: [".next/**", "node_modules/**"] }];
```

`npx eslint -c <that file> src`: 909 files, **134 errors, 31 warnings**,
before the two import fixes above (now 134 and 29).

| Rule | Count | Kind |
|---|---|---|
| react-hooks/refs | 85 | error |
| react-hooks/set-state-in-effect | 38 | error |
| @typescript-eslint/no-unused-vars | 13 | warning (2 fixed) |
| @next/next/no-img-element | 11 | warning |
| react-hooks/purity | 6 | error |
| react-hooks/exhaustive-deps | 5 | warning |
| react-hooks/immutability | 2 | error |
| @typescript-eslint/no-unused-expressions | 2 | warning |
| @next/next/no-html-link-for-pages | 1 | error |
| @typescript-eslint/no-explicit-any | 1 | error |
| react-hooks/rules-of-hooks | 1 | error |

Not fixed, because none is trivially safe:

- **react-hooks/refs and set-state-in-effect** (React Compiler rules new in
  eslint-plugin-react-hooks 6/7) in 39 files, mostly the browser tools under
  `src/components/tools/`. Each needs the component restructured and tested in
  a browser:
  - `src/components/ApiIndexTable.tsx`: set-state-in-effect 1
  - `src/components/ApiPicker.tsx`: set-state-in-effect 1
  - `src/components/ApiTerminal.tsx`: set-state-in-effect 1
  - `src/components/ContentAge.tsx`: set-state-in-effect 1
  - `src/components/CostPlanner.tsx`: set-state-in-effect 1
  - `src/components/Countdown.tsx`: set-state-in-effect 1
  - `src/components/CountdownWidget.tsx`: set-state-in-effect 1
  - `src/components/DailyPuzzle.tsx`: set-state-in-effect 1
  - `src/components/Graveyard.tsx`: set-state-in-effect 1
  - `src/components/HistoryFilter.tsx`: set-state-in-effect 2
  - `src/components/MigrationWizard.tsx`: set-state-in-effect 1
  - `src/components/MobileNav.tsx`: set-state-in-effect 1
  - `src/components/PathProgress.tsx`: set-state-in-effect 1
  - `src/components/PathResume.tsx`: set-state-in-effect 1
  - `src/components/SearchResults.tsx`: set-state-in-effect 1
  - `src/components/ShareRow.tsx`: set-state-in-effect 1
  - `src/components/SiteInstrumentation.tsx`: set-state-in-effect 1
  - `src/components/SiteSearch.tsx`: set-state-in-effect 1
  - `src/components/UpcomingDeadlines.tsx`: set-state-in-effect 1
  - `src/components/WatchForm.tsx`: set-state-in-effect 1
  - `src/components/WearableQuiz.tsx`: set-state-in-effect 1
  - `src/components/YearStoryShare.tsx`: set-state-in-effect 1
  - `src/components/tools/AnswerSearch.tsx`: set-state-in-effect 1, refs 1
  - `src/components/tools/CoverageMatrix.tsx`: set-state-in-effect 1
  - `src/components/tools/CyclingPowerLab.tsx`: refs 14
  - `src/components/tools/FtmsLab.tsx`: refs 17
  - `src/components/tools/HeartRateLab.tsx`: set-state-in-effect 1, refs 51
  - `src/components/tools/KeypointPlayground.tsx`: set-state-in-effect 1
  - `src/components/tools/MyStack.tsx`: set-state-in-effect 1
  - `src/components/tools/OAuthPlayground.tsx`: set-state-in-effect 2
  - `src/components/tools/PoseBenchmark.tsx`: set-state-in-effect 1
  - `src/components/tools/RateLimitCalculator.tsx`: set-state-in-effect 1
  - `src/components/tools/RepCounterPlayground.tsx`: refs 1, set-state-in-effect 1
  - `src/components/tools/SchemaConverter.tsx`: set-state-in-effect 1
  - `src/components/tools/StepLab.tsx`: refs 1
  - `src/components/tools/StoreChecklistTool.tsx`: set-state-in-effect 1
  - `src/components/tools/WebhookVerifier.tsx`: set-state-in-effect 1
  - `src/components/tools/plannerUi.tsx`: set-state-in-effect 1
  - `src/lib/webBluetooth.ts`: set-state-in-effect 1
- **react-hooks/purity** (`Date.now()` / `performance.now()` during render):
  `src/app/page.tsx:171`, `src/components/EntryBadge.tsx:16`,
  `src/components/HubFreshness.tsx:38`, `src/components/SignupForm.tsx:40`,
  `src/components/WatchForm.tsx:27`,
  `src/components/tools/RepCounterPlayground.tsx:590`. The server-rendered age
  labels depend on render-time dates by design.
- **react-hooks/immutability**: `src/components/tools/AppleHealthExplorer.tsx:256`
  (`choose` used before declared), `src/components/tools/StepLab.tsx:224`
  (`loop`).
- **react-hooks/rules-of-hooks**: `src/lib/pageMirrors/aggregatorChooser.ts:34`
  calls `useCases()`, which is a plain data function in
  `src/lib/aggregatorChooserView.ts` named like a hook. A rename across three
  files would clear it.
- **no-html-link-for-pages**: `src/app/global-error.tsx:67`, a plain `<a href="/">`
  in the global error boundary, where a full reload is the point.
- **no-explicit-any**: `src/components/mdx.tsx:162` (`rehypePlugins as any`,
  commented as deliberate).
- **exhaustive-deps**: `SearchPalette.tsx:251`, `ShareCard.tsx:55`,
  `AppleHealthExplorer.tsx:262`, `SchemaConverter.tsx:54`, `plannerUi.tsx:133`.
- **no-unused-vars** left: `TITLE` in `src/app/blog/page.tsx:17` and
  `src/app/glossary/page.tsx:17` (each file's comment says TITLE feeds the H1
  and structured data, so the unused constant may mark a regression; worth a
  look), `url` in `google-health-api/[dataType]/page.tsx:198`, `PROSE` in
  `health-connect/[record]/page.tsx:73`, `MAPPED` in
  `healthkit-identifiers/page.tsx:150`, `title` in
  `pose-keypoints/[scheme]/page.tsx:95`, `scopeFamilyPhrase` in
  `src/data/ghapiPages.ts:386`, and the underscore-named `_f`, `_o`, `_rule`.
- **no-unused-expressions**: `src/lib/appleHealthExport.mjs:484-485`.
- **no-img-element**: 11 `<img>` tags (atlas, badges, blog post, cheat
  sheets, openness index, ShareCard, HeartRateLab, StepLab), mostly SVG
  badges and generated posters where `next/image` adds nothing.

Lint stays out of CI, as the brief asks.

## Appendix A: the 102 never-shown pages

Inlinks are distinct internal pages linking the URL; depth is clicks from `/`;
lastmod is the sitemap row's.

| Page | Published | Status | Canonical | Robots | Sitemap child, lastmod | Inlinks | Depth | Words | Hub links it | JSON-LD |
|---|---|---|---|---|---|---|---|---|---|---|
| `/guides/camera-pose-tracking` | 2026-07-08 | 200 | self | index,follow | guides 2026-07-08 | 56 | 2 | 2576 | yes | valid |
| `/fix/healthkit-data-restricted-mdm` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 56 | 2 | 2081 | yes | valid |
| `/fix/healthkit-database-inaccessible` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 58 | 2 | 2183 | yes | valid |
| `/fix/healthkit-guest-user-mode` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 55 | 2 | 2054 | yes | valid |
| `/fix/healthkit-health-data-unavailable` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 57 | 2 | 2067 | yes | valid |
| `/fix/healthkit-invalid-argument` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 56 | 2 | 2197 | yes | valid |
| `/fix/healthkit-required-authorization-denied` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 55 | 2 | 2113 | yes | valid |
| `/healthkit-category-values` | 2026-09-04 | 200 | self | index,follow | healthkit 2026-10-12 | 71 | 2 | 1911 | no | valid |
| `/healthkit-status` | 2026-09-04 | 200 | self | index,follow | healthkit 2026-10-02 | 65 | 2 | 2076 | no | valid |
| `/healthkit/workout-activities` | 2026-09-04 | 200 | self | index,follow | healthkit 2026-10-02 | 16 | 2 | 2203 | yes | valid |
| `/fix/health-connect-not-available` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 40 | 2 | 1844 | yes | valid |
| `/fix/health-connect-rate-limit` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 50 | 2 | 2038 | yes | valid |
| `/healthkit-queries/healthkit-query-predicates` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 11 | 2 | 1998 | yes | valid |
| `/healthkit-queries/hkactivitysummaryquery` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 12 | 2 | 1810 | yes | valid |
| `/healthkit-queries/hkobserverquery-background-delivery` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 11 | 2 | 2004 | yes | valid |
| `/healthkit-queries/hksamplequery` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 14 | 2 | 1779 | yes | valid |
| `/healthkit-queries/hkstatisticscollectionquery` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 12 | 2 | 1892 | yes | valid |
| `/healthkit-queries/hkstatisticsquery` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 14 | 2 | 1870 | yes | valid |
| `/phone-sensors/android-16-body-sensors-health-permissions` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 8 | 2 | 1446 | yes | valid |
| `/phone-sensors/android-activity-recognition-transition-api` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 9 | 2 | 1427 | yes | valid |
| `/phone-sensors/android-recording-api` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 11 | 2 | 1491 | yes | valid |
| `/phone-sensors/android-step-counter-sensor` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 13 | 2 | 1739 | yes | valid |
| `/phone-sensors/cmaltimeter` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 10 | 2 | 1415 | yes | valid |
| `/phone-sensors/cmbatchedsensormanager` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 8 | 2 | 1389 | yes | valid |
| `/phone-sensors/cmheadphonemotionmanager` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 9 | 2 | 1472 | yes | valid |
| `/phone-sensors/cmmotionactivitymanager` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 9 | 2 | 1616 | yes | valid |
| `/phone-sensors/cmpedometer` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 11 | 2 | 1844 | yes | valid |
| `/phone-sensors/foreground-service-type-health` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 8 | 2 | 1537 | yes | valid |
| `/compliance/apple-health-icon-works-with-apple-health` | 2026-10-04 | 200 | self | index,follow | guides 2026-10-04 | 12 | 2 | 2470 | yes | valid |
| `/data/clinical-records-api` | 2026-10-04 | 200 | self | index,follow | guides 2026-10-04 | 62 | 2 | 2549 | yes | valid |
| `/fitness-apis/corporate-wellness-wearable-apis` | 2026-10-12 | 200 | self | index,follow | guides 2026-10-12 | 33 | 2 | 2784 | yes | valid |
| `/google-health-api/activity-level` | 2026-10-17 | 200 | self | index,follow | reference 2026-10-31 | 22 | 2 | 1246 | yes | valid |
| `/alternatives/mediapipe-alternatives` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 24 | 2 | 2730 | yes | valid |
| `/alternatives/quickpose-alternatives` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 16 | 2 | 2782 | yes | valid |
| `/data/body-temperature-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 21 | 2 | 2614 | yes | valid |
| `/data/distance-tracking-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 32 | 2 | 2198 | yes | valid |
| `/data/running-metrics-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 30 | 2 | 2133 | yes | valid |
| `/data/swimming-data-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 17 | 2 | 1988 | yes | valid |
| `/fitness-apis/smart-ring-apis` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 17 | 2 | 2052 | yes | valid |
| `/integrate/mindbody-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 13 | 2 | 3070 | yes | valid |
| `/integrate/samsung-health-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 21 | 2 | 2715 | yes | valid |
| `/integrate/suunto-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 18 | 2 | 2289 | yes | valid |
| `/integrate/withings-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 28 | 2 | 3250 | yes | valid |
| `/workout-types` | 2026-10-18 | 200 | self | index,follow | reference 2026-10-18 | 1286 | 1 | 2992 | no | valid |
| `/alternatives/openpose-alternatives` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 18 | 2 | 2559 | yes | valid |
| `/alternatives/wger-alternatives` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 23 | 2 | 3461 | yes | valid |
| `/compare/exercisedb-vs-free-exercise-db` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 25 | 2 | 2569 | yes | valid |
| `/compare/mediapipe-vs-movenet` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 20 | 2 | 2886 | yes | valid |
| `/compare/mediapipe-vs-yolo-pose` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 16 | 2 | 2690 | yes | valid |
| `/fix/garmin-api-personal-use` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 31 | 2 | 2348 | yes | valid |
| `/alternatives/dexcom-api-alternatives` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 20 | 2 | 1949 | yes | valid |
| `/alternatives/samsung-health-api-alternatives` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 29 | 2 | 1894 | yes | valid |
| `/alternatives/suunto-api-alternatives` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 21 | 2 | 1745 | yes | valid |
| `/compare/apple-vision-vs-mediapipe` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 15 | 2 | 3017 | yes | valid |
| `/compare/exercisedb-vs-api-ninjas` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 21 | 2 | 2355 | yes | valid |
| `/compare/ml-kit-vs-mediapipe` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 16 | 2 | 2763 | yes | valid |
| `/pricing/suunto-api-pricing` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 15 | 2 | 1572 | yes | valid |
| `/pricing/wahoo-api-pricing` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 13 | 2 | 2017 | yes | valid |
| `/pt-br/alternatives/exercisedb-alternatives` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-11 | 3 | 3 | 3167 | no | valid |
| `/pt-br/alternatives/terra-alternatives` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-14 | 3 | 3 | 3080 | no | valid |
| `/pt-br/fitness-apis/ai-workout-tracking-apis` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-14 | 2 | 2 | 4096 | no | valid |
| `/pt-br/fitness-apis/wearable-data-apis` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-14 | 6 | 3 | 4107 | no | valid |
| `/pt-br/integrate/garmin-api` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-10-27 | 4 | 2 | 2649 | no | valid |
| `/pt-br/integrate/oura-api` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-10-27 | 3 | 2 | 3027 | no | valid |
| `/pt-br/integrate/strava-api` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-04 | 2 | 2 | 3580 | no | valid |
| `/pt-br/integrate/terra-api` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-14 | 4 | 2 | 4239 | no | valid |
| `/pt-br/pricing/exercise-database-api-pricing` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-11 | 3 | 2 | 5019 | no | valid |
| `/alternatives/rook-alternatives` | 2026-11-02 | 200 | self | index,follow | guides 2026-11-02 | 30 | 2 | 3209 | yes | valid |
| `/alternatives/sahha-alternatives` | 2026-11-02 | 200 | self | index,follow | guides 2026-11-02 | 25 | 2 | 3005 | yes | valid |
| `/fix/fitbit-api-410-gone` | 2026-11-02 | 200 | self | index,follow | guides 2026-11-14 | 21 | 2 | 3223 | yes | valid |
| `/alternatives/polar-api-alternatives` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 21 | 2 | 2760 | yes | valid |
| `/alternatives/spike-api-alternatives` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 20 | 2 | 2886 | yes | valid |
| `/compliance/gym-gdpr-compliance` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 10 | 2 | 3178 | yes | valid |
| `/pricing/junction-api-pricing` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 17 | 2 | 2188 | yes | valid |
| `/pricing/nutritionix-api-pricing` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 16 | 2 | 1917 | yes | valid |
| `/pricing/rook-api-pricing` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 22 | 2 | 2442 | yes | valid |
| `/pricing/terra-api-pricing` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 26 | 2 | 2808 | yes | valid |
| `/compliance/cms-medicare-app-library` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 15 | 1 | 2507 | yes | valid |
| `/cookbook/ble-heart-rate-parser` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 7 | 2 | 1882 | yes | valid |
| `/cookbook/cursor-pagination` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 9 | 2 | 2019 | yes | valid |
| `/cookbook/health-connect-error-policy` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 12 | 2 | 2283 | yes | valid |
| `/cookbook/multi-window-rate-pacer` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 10 | 2 | 2452 | yes | valid |
| `/cookbook/pkce-authorize-url` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 12 | 2 | 2110 | yes | valid |
| `/cookbook/token-vault` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 8 | 2 | 2241 | yes | valid |
| `/cookbook/vendor-webhook-signatures` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 11 | 2 | 2573 | yes | valid |
| `/cookbook/webhook-handshakes` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 13 | 2 | 2020 | yes | valid |
| `/cookbook/withings-notification-router` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 7 | 2 | 2017 | yes | valid |
| `/cookbook/workout-type-crosswalk` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 26 | 2 | 1946 | yes | valid |
| `/own-your-data/apple-health-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 8 | 2 | 1240 | yes | valid |
| `/own-your-data/coros-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 6 | 2 | 934 | yes | valid |
| `/own-your-data/fitbit-google-health-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 9 | 2 | 1204 | yes | valid |
| `/own-your-data/garmin-connect-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 9 | 2 | 1053 | yes | valid |
| `/own-your-data/health-connect-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 8 | 2 | 1061 | yes | valid |
| `/own-your-data/oura-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 8 | 2 | 1035 | yes | valid |
| `/own-your-data/polar-flow-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 8 | 2 | 1051 | yes | valid |
| `/own-your-data/samsung-health-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 8 | 2 | 875 | yes | valid |
| `/own-your-data/strava-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 9 | 2 | 1087 | yes | valid |
| `/compare/kinestex-vs-asensei` | 2026-11-09 | 200 | self | index,follow | guides 2026-11-09 | 11 | 2 | 3618 | yes | valid |
| `/compare/kinestex-vs-competitors` | 2026-11-09 | 200 | self | index,follow | guides 2026-11-09 | 17 | 2 | 4186 | yes | valid |
| `/compare/kinestex-vs-exer-ai` | 2026-11-09 | 200 | self | index,follow | guides 2026-11-09 | 11 | 2 | 3673 | yes | valid |
| `/compare/kinestex-vs-kemtai` | 2026-11-09 | 200 | self | index,follow | guides 2026-11-09 | 10 | 2 | 3727 | yes | valid |
| `/compare/kinestex-vs-posetracker` | 2026-11-09 | 200 | self | index,follow | guides 2026-11-09 | 13 | 2 | 3380 | yes | valid |

## Appendix B: the 40 shown pages compared

| Page | Published | Status | Canonical | Robots | Sitemap child, lastmod | Inlinks | Depth | Words | Hub links it | JSON-LD |
|---|---|---|---|---|---|---|---|---|---|---|
| `/compliance/ftc-health-breach-notification-rule` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 14 | 2 | 3071 | yes | valid |
| `/workout-types/health-connect` | 2026-10-18 | 200 | self | index,follow | reference 2026-10-18 | 15 | 2 | 3046 | yes | valid |
| `/pricing/withings-api-pricing` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 11 | 2 | 1814 | yes | valid |
| `/pricing/polar-api-pricing` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 21 | 2 | 2186 | yes | valid |
| `/fitness-apis/exercise-video-apis` | 2026-10-22 | 200 | self | index,follow | guides 2026-10-22 | 30 | 1 | 3116 | yes | valid |
| `/pt-br/fix/garmin-api-approval` | 2026-10-27 | 200 | self | index,follow | pt-br 2026-11-02 | 2 | 3 | 3393 | no | valid |
| `/compare/cliniko-vs-healthkit` | 2026-11-04 | 200 | self | index,follow | guides 2026-11-04 | 67 | 2 | 3331 | yes | valid |
| `/compare/terra-vs-open-wearables` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 30 | 2 | 2922 | yes | valid |
| `/compare/terra-vs-thryve` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 27 | 2 | 2825 | yes | valid |
| `/compare/terra-vs-sahha` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 27 | 2 | 2649 | yes | valid |
| `/alternatives/coros-api-alternatives` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 18 | 2 | 1667 | yes | valid |
| `/alternatives/withings-api-alternatives` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 25 | 2 | 1937 | yes | valid |
| `/alternatives/wahoo-api-alternatives` | 2026-10-27 | 200 | self | index,follow | guides 2026-10-27 | 17 | 2 | 1822 | yes | valid |
| `/alternatives/human-api-alternatives` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 12 | 2 | 2873 | yes | valid |
| `/fix/health-connect-securityexception` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 51 | 2 | 2068 | yes | valid |
| `/fix/health-connect-changes-token-expired` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 47 | 2 | 2131 | yes | valid |
| `/fix/healthkit-authorization-not-determined` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 56 | 2 | 2167 | yes | valid |
| `/fix/healthkit-undocumented-errors` | 2026-09-04 | 200 | self | index,follow | guides 2026-09-04 | 56 | 2 | 2042 | yes | valid |
| `/healthkit/vital-signs` | 2026-09-04 | 200 | self | index,follow | healthkit 2026-10-02 | 29 | 2 | 1866 | yes | valid |
| `/data/ecg-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 15 | 2 | 2221 | yes | valid |
| `/data/floors-elevation-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 18 | 2 | 2025 | yes | valid |
| `/integrate/glofox-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 12 | 2 | 2094 | yes | valid |
| `/integrate/teamup-api` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 11 | 2 | 2451 | yes | valid |
| `/own-your-data/suunto-export` | 2026-11-05 | 200 | self | index,follow | guides 2026-11-05 | 8 | 2 | 944 | yes | valid |
| `/cookbook/dedupe-health-samples` | 2026-10-02 | 200 | self | index,follow | guides 2026-10-02 | 28 | 2 | 4057 | yes | valid |
| `/cookbook/incremental-sync-anchor` | 2026-10-02 | 200 | self | index,follow | guides 2026-10-02 | 16 | 2 | 4450 | yes | valid |
| `/cookbook/refresh-rotation` | 2026-08-12 | 200 | self | index,follow | guides 2026-08-12 | 26 | 2 | 3324 | yes | valid |
| `/cookbook/day-boundary-rollup` | 2026-08-12 | 200 | self | index,follow | guides 2026-08-12 | 12 | 2 | 3438 | yes | valid |
| `/healthkit-queries/hkanchoredobjectquery` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 14 | 2 | 1919 | yes | valid |
| `/healthkit-queries/healthkit-async-query-descriptors` | 2026-10-03 | 200 | self | index,follow | guides 2026-10-03 | 14 | 2 | 1630 | yes | valid |
| `/guides/evaluate-motion-sdks` | 2026-08-11 | 200 | self | index,follow | guides 2026-10-18 | 23 | 2 | 3578 | yes | valid |
| `/google-health-api` | 2026-10-17 | 200 | self | index,follow | reference 2026-10-31 | 1286 | 1 | 3238 | no | valid |
| `/fitness-apis/gym-management-software-apis` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 27 | 1 | 3508 | yes | valid |
| `/pricing/thryve-api-pricing` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 31 | 1 | 2332 | yes | valid |
| `/pricing/mindbody-api-pricing` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 11 | 2 | 2049 | yes | valid |
| `/pricing/sency-pricing` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 21 | 2 | 2148 | yes | valid |
| `/pricing/sahha-api-pricing` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-22 | 30 | 2 | 2369 | yes | valid |
| `/pricing/quickpose-pricing` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-18 | 21 | 2 | 2875 | yes | valid |
| `/fitness-apis/wearable-research-data-platforms` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 14 | 2 | 2820 | yes | valid |
| `/fitness-apis/wearable-data-to-ehr-fhir` | 2026-10-18 | 200 | self | index,follow | guides 2026-10-17 | 14 | 2 | 2548 | yes | valid |
