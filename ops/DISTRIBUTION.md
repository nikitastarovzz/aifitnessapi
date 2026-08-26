# Distribution — what is built, what needs a human

Off-site distribution is idea 11–15 of `ops/GROWTH-RESEARCH-2026-08.md`. The
research finding behind all of it: the sites that reach millions in a
developer niche are not out-writing anyone. `github.com/public-apis` has
471,000 stars because it *is* the artifact people link to, and caniuse's
support data became infrastructure once it lived on GitHub under CC-BY.

Everything below is built and tested. None of it is published, because
publishing is outward-facing and needs your credentials or your say-so.

## 1. npm packages

Two, sharing one data bundler (`scripts/bundle-package-data.mjs`).

| Package | What it is | Tests |
|---|---|---|
| `mcp/` → `@aifitnessapi/mcp` | MCP server, 4 tools | 21 assertions over real stdio framing |
| `packages/health-data/` → `@aifitnessapi/health-data` | Typed data library | 14 contract assertions |

To publish:

```bash
node scripts/build-datasets.mjs && node scripts/bundle-package-data.mjs
cd mcp && npm test 2>/dev/null; node test.mjs && npm publish --access public
cd ../packages/health-data && node test.mjs && npm publish --access public
```

Both declare `"license": "CC-BY-4.0"`. The `@aifitnessapi` scope must exist on
npm and your account must own it — create it once with
`npm org create aifitnessapi` or publish under a scope you already hold.

**Why the MCP server matters more than its download count.** It puts verified
answers inside the coding assistants where this audience now asks their
questions. "Is HealthKit step count summable?" answered from training data is
a coin flip whose wrong answer does not throw.

## 2. The standalone CC-BY dataset repo — needs your go-ahead

The caniuse move. `public/datasets/` is already CC-BY and already published on
the site, but a dataset that lives only on a marketing domain does not get
depended on. A repo does.

Not created, because making a public repo under your account is outward-facing
and you have not asked for it. If you want it:

- Name: `aifitnessapi/health-data` or `nikitastarovzz/health-api-datasets`
- Contents: `public/datasets/*.{json,csv}`, the two generator scripts, the
  methodology, CC-BY-4.0 licence
- Sync: a workflow mirroring on every change, same pattern as
  `.github/workflows/sdk-releases.yml`

Say the word and I will build it.

## 3. Awesome-list submissions — drafted, not sent

I cannot open pull requests against repositories outside this one, so these
are ready to paste. Check each list's contribution rules before submitting;
several require the entry to have existed for a minimum period.

**Candidate lists** (verify each still accepts entries — I could not open them
from this environment):

- `awesome-health` / `awesome-digital-health`
- `awesome-quantified-self`
- `awesome-public-datasets` — for the CC-BY datasets, strongest fit
- `awesome-mcp-servers` — for the MCP server, once published

**Entry for a datasets list:**

```markdown
- [HealthKit & Health Connect Reference Datasets](https://aifitnessapi.com/datasets) —
  Every Apple HealthKit type identifier (240, all four families) with unit
  family and cumulative-vs-discrete classification, the verified HealthKit ↔
  Health Connect mapping, and a dated log of fitness-API deprecations. JSON +
  CSV, CC BY 4.0, regenerated from Apple's own documentation.
```

**Entry for an MCP list:**

```markdown
- [aifitnessapi](https://github.com/nikitastarovzz/aifitnessapi/tree/main/mcp) —
  Health and fitness API reference: HealthKit type lookup with the correct
  HKStatisticsQuery aggregation, HealthKit ↔ Health Connect mapping, and dated
  API deprecations. Answers only from verified data; says so when it has none.
```

Lead with the dataset, not the site. Lists reject marketing and accept
artifacts.

## 4. Embeddable badges — live

`/badges` serves three badges generated from the site's own data, so a README
embedding one shows the current number:

```markdown
[![HealthKit types tracked](https://aifitnessapi.com/badges/healthkit-types.svg)](https://aifitnessapi.com/healthkit-identifiers)
[![API changes tracked](https://aifitnessapi.com/badges/tracked-changes.svg)](https://aifitnessapi.com/changes)
[![Last verified](https://aifitnessapi.com/badges/last-verified.svg)](https://aifitnessapi.com/methodology)
```

`last-verified` shows the newest real verification date, not today's. A
freshness badge that always reads "today" is decoration.

## Order of impact

1. **Publish the MCP server.** Nothing else reaches the place the questions
   have moved to.
2. **Create the dataset repo.** It is the only item that compounds — stars and
   forks accumulate, and dependents link back forever.
3. **Submit to `awesome-public-datasets`.** High-authority, and the datasets
   genuinely qualify.
4. Badges and the data library are worth having; neither moves the number on
   its own.
