# AIFitnessAPI Cookbook

Eighteen dependency-free Node modules for the parts of a fitness or health-data
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
| `dedupe-health-samples.mjs` | Merging overlapping samples from several sources without double counting, by source priority | [dedupe-health-samples](https://aifitnessapi.com/cookbook/dedupe-health-samples) |
| `incremental-sync-anchor.mjs` | Anchor and changes-token bookkeeping: save the cursor only after a batch lands, resync on expiry | [incremental-sync-anchor](https://aifitnessapi.com/cookbook/incremental-sync-anchor) |
| `vendor-webhook-signatures.mjs` | Oura, WHOOP, Terra and Polar webhook signatures, each checked the way the vendor documents it | [vendor-webhook-signatures](https://aifitnessapi.com/cookbook/vendor-webhook-signatures) |
| `webhook-handshakes.mjs` | The subscription-validation answers Oura, Strava, Polar, Withings and the Google Health API expect | [webhook-handshakes](https://aifitnessapi.com/cookbook/webhook-handshakes) |
| `withings-notification-router.mjs` | A Withings notification's callback secret, form body and the Data API call its category needs | [withings-notification-router](https://aifitnessapi.com/cookbook/withings-notification-router) |
| `cursor-pagination.mjs` | Walking Oura and WHOOP next_token pages without loops, gaps or a drifting query | [cursor-pagination](https://aifitnessapi.com/cookbook/cursor-pagination) |
| `multi-window-rate-pacer.mjs` | Pacing requests under every published window at once: Strava's, WHOOP's and Wahoo's | [multi-window-rate-pacer](https://aifitnessapi.com/cookbook/multi-window-rate-pacer) |
| `pkce-authorize-url.mjs` | RFC 7636 PKCE, state and the authorize URL for six fitness APIs, tested against the RFC example | [pkce-authorize-url](https://aifitnessapi.com/cookbook/pkce-authorize-url) |
| `token-vault.mjs` | OAuth tokens sealed with AES-256-GCM, bound to their row, with key rotation | [token-vault](https://aifitnessapi.com/cookbook/token-vault) |
| `workout-type-crosswalk.mjs` | Workout types across HealthKit, Health Connect, Wear OS and the Google Health API, with each platform's catch-all | [workout-type-crosswalk](https://aifitnessapi.com/cookbook/workout-type-crosswalk) |
| `health-connect-error-policy.mjs` | Every Health Connect error code and exception mapped to retry, ask the user, fix or report | [health-connect-error-policy](https://aifitnessapi.com/cookbook/health-connect-error-policy) |
| `ble-heart-rate-parser.mjs` | The Bluetooth Heart Rate Measurement (0x2A37) packet, decoded per the SIG structure | [ble-heart-rate-parser](https://aifitnessapi.com/cookbook/ble-heart-rate-parser) |

## Running the tests

```sh
node --test "cookbook/**/*.test.mjs"
```

Node 22 or newer. No dependencies, no build step, no network access — the tests
are the reason to trust the code, so they must run anywhere in one command.
Some suites also read the site's own sourced data (the webhook verifier module,
the generated Bluetooth and Health Connect references, the workout-types
dataset) so a recipe cannot drift from the page that quotes the vendor.

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
