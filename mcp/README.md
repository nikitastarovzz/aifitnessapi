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

## Install

```jsonc
// Claude Code: .mcp.json — or claude_desktop_config.json for the desktop app
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
| `healthkit_quantity_type` | Any of the 120 `HKQuantityTypeIdentifier` cases: unit family, iOS/watchOS availability, and whether it is **cumulative** (`.cumulativeSum`) or **discrete** (`.discreteAverage`) |
| `health_data_cross_platform` | The HealthKit ↔ Health Connect mapping for a metric, plus the trap where one exists — Apple stores HRV as SDNN, Health Connect as RMSSD, and they are not interconvertible |
| `fitness_api_changes` | Dated deprecations and turndowns, each graded `confirmed` or `reported` |
| `fitness_api_glossary` | Domain terms — SDNN, RMSSD, aggregator, on-device store |

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
`node mcp/build-data.mjs` after `node scripts/build-datasets.mjs`. Bundling
rather than fetching means the server works offline and a pinned version keeps
answering what that version said.

## Licence

CC BY 4.0. Apple's abstracts are reproduced to identify the API surface and
remain Apple's; the classification and analysis are this site's.
