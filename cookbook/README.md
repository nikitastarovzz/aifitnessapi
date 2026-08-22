# AIFitnessAPI Cookbook

Six dependency-free Node modules for the parts of a fitness or health-data
integration that are easy to get subtly wrong, each with a test suite that runs
in CI on every change.

Every recipe on <https://aifitnessapi.com/cookbook> is a byte-verbatim copy of
the file beside it here. That is the contract: if the page and the file ever
disagree, the build is broken, not the documentation. The `cookbook-ci`
workflow is what makes the "CI-tested" claim on those pages true.

| File | What it solves | The page |
|---|---|---|
| `refresh-rotation.mjs` | OAuth refresh-token rotation, where losing the newly issued token disconnects the user permanently | [refresh-rotation](https://aifitnessapi.com/cookbook/refresh-rotation) |
| `rate-limit-fetcher.mjs` | Backing off a 429 when `Retry-After` is absent — RFC 6585 makes that header optional | [rate-limit-fetcher](https://aifitnessapi.com/cookbook/rate-limit-fetcher) |
| `webhook-receiver.mjs` | Treating a fitness webhook as a change pointer rather than trusting its payload | [webhook-receiver](https://aifitnessapi.com/cookbook/webhook-receiver) |
| `day-boundary-rollup.mjs` | Daily totals that survive daylight saving, where a civil day is not always 24 hours | [day-boundary-rollup](https://aifitnessapi.com/cookbook/day-boundary-rollup) |
| `backfill-checkpointer.mjs` | Resumable historical backfill that does not restart from zero after a failure | [backfill-checkpointer](https://aifitnessapi.com/cookbook/backfill-checkpointer) |
| `rep-counter.mjs` | Turning a keypoint stream into a rep count, tested as the classification problem it is | [rep-counter](https://aifitnessapi.com/cookbook/rep-counter) |

## Running the tests

```sh
node --test "cookbook/**/*.test.mjs"
```

Node 22 or newer. No dependencies, no build step, no network access — the tests
are the reason to trust the code, so they must run anywhere in one command.

## Using a recipe

Copy the file. These are reference implementations meant to be read, adapted and
owned by your codebase, not installed. There is no package, deliberately: a
dependency you cannot read is the opposite of what this is for.

## Licence and provenance

Same repository, same licence as the site. Every behaviour these modules encode
traces to a primary source quoted on the corresponding page — the pages are the
citations, the code is the demonstration. See
<https://aifitnessapi.com/methodology> for how that verification works, and note
that AIFitnessAPI is funded by KinesteX, which is disclosed on every page that
covers it.

Corrections are welcome as issues or pull requests. A failing test that
demonstrates the bug is the fastest possible bug report.
