# @aifitnessapi/mcp

The [aifitnessapi.com](https://aifitnessapi.com) reference data as MCP tools, so a
coding assistant can answer fitness and health API questions from verified data
instead of from memory.

## Why

The question "is HealthKit's step count summable?" now gets asked to an
assistant, not a search box. Answered from training data it is a coin flip, and
a wrong answer here does not throw — `HKStatisticsQuery` returns a plausible
number that happens to be wrong. This server answers it from Apple's own
documentation and says where the answer came from.

## Connect

### Hosted (no install)

The same tools run at `https://aifitnessapi.com/mcp` over the Streamable HTTP
transport, stateless, with no key. In Claude Code:

```bash
claude mcp add --transport http aifitnessapi https://aifitnessapi.com/mcp
```

or in a project's `.mcp.json`:

```json
{
  "mcpServers": {
    "aifitnessapi": { "type": "http", "url": "https://aifitnessapi.com/mcp" }
  }
}
```

### Local (stdio)

The package is not on npm yet. Until it is, run it from a clone:

```bash
git clone https://github.com/nikitastarovzz/aifitnessapi.git
cd aifitnessapi/mcp && npm ci
claude mcp add --transport stdio aifitnessapi -- node "$PWD/src/index.js"
```

Once it is published, `npx` replaces the clone:

```jsonc
// .mcp.json — or claude_desktop_config.json for the desktop app
{
  "mcpServers": {
    "aifitnessapi": {
      "command": "npx",
      "args": ["-y", "@aifitnessapi/mcp"]
    }
  }
}
```

## Tools

| Tool | Answers |
|---|---|
| `healthkit_type` | Any identifier in HealthKit's four families (`HKQuantityTypeIdentifier`, `HKCategoryTypeIdentifier`, `HKCharacteristicTypeIdentifier`, `HKWorkoutActivityType`): availability, and the detail that matters for the family — whether a quantity type is **cumulative** (`.cumulativeSum`) or **discrete** (`.discreteAverage`), or the `HKCategoryValue` enum that decodes a category sample |
| `health_data_cross_platform` | The HealthKit ↔ Health Connect mapping for a metric, plus the trap where one exists — Apple stores HRV as SDNN, Health Connect as RMSSD, and they are not interconvertible |
| `fitness_api_changes` | Dated deprecations and turndowns, each graded `confirmed` or `reported` |
| `fitness_api_glossary` | Domain terms — SDNN, RMSSD, aggregator, on-device store |

Every tool is read-only and annotated so (`readOnlyHint`). The tool code lives
in `src/tools.js`, which both this package and the hosted endpoint run, so the
two answer the same questions the same way.

## What it will not do

There is no model in this server and no network call. Every answer comes from
the bundled datasets, and when they do not contain one the tool says so rather
than producing something plausible. That is deliberate: the site's rule is that
an unverifiable claim gets omitted, and a tool that guessed would launder
exactly the claims the site refuses to publish.

Two fields are derived rather than copied — a type's aggregation style and its
unit family — because Apple states both in prose rather than as machine-readable
properties. Each was matched against Apple's own sentence and is left null where
Apple's wording does not state it. Apple's documentation remains the authority.

## Data

Bundled from the site's CC BY 4.0 datasets, regenerated with
`node scripts/bundle-package-data.mjs` after `node scripts/build-datasets.mjs`. Bundling
rather than fetching means the server works offline and a pinned version keeps
answering what that version said. The hosted endpoint reads the same files from
the site's `public/datasets`, and the same rows are served as JSON at
`https://aifitnessapi.com/api/v1` (see https://aifitnessapi.com/developers).

## Test

```bash
node mcp/test.mjs                                   # stdio, from the repository root or mcp/
node mcp/test.mjs --url http://localhost:3000/mcp   # the hosted endpoint under `next start`
node mcp/test.mjs --url https://aifitnessapi.com/mcp
```

## Publishing (needs the owner's credentials)

1. **npm.** From `mcp/`: `npm publish --access public` under the `@aifitnessapi`
   scope. `package.json` already carries `"mcpName": "com.aifitnessapi/mcp"`,
   which the MCP Registry checks against `server.json`, and its `files` list
   ships `data/`, which the server reads at start-up.
2. **Registry namespace.** `server.json` is named `com.aifitnessapi/mcp`, a
   domain namespace, so the registry needs proof of aifitnessapi.com: either an
   Ed25519 public key in a TXT record on the apex domain
   (`mcp-publisher login dns --domain aifitnessapi.com --private-key …`), or the
   same `v=MCPv1; k=ed25519; p=…` line served at
   `https://aifitnessapi.com/.well-known/mcp-registry-auth`
   (`mcp-publisher login http --domain aifitnessapi.com --private-key …`). To use
   GitHub login instead, rename the server to `io.github.<owner>/aifitnessapi`
   in both `server.json` and `mcpName`.
3. **Publish.** From `mcp/`: `mcp-publisher publish`, then check
   `https://registry.modelcontextprotocol.io/v0.1/servers?search=com.aifitnessapi/mcp`.
   Publishing the hosted endpoint alone works before npm: drop `packages` from
   `server.json`.

Keep `version` equal across `package.json`, `server.json` and `SERVER_INFO` in
`src/tools.js`; the site's qa gate (MCP-SERVER-JSON) fails the build otherwise.
`server.json` follows the registry schema dated 2025-12-11.

## Licence

CC BY 4.0. Apple's abstracts are reproduced to identify the API surface and
remain Apple's; the classification and analysis are this site's.
