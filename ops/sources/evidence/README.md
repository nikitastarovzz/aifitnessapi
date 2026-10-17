# Evidence for pages written from snapshots

One JSON file per page written from a host the dev environment cannot reach,
named `<cluster>-<slug>.json`: an array of

```json
{ "claim": "the sentence on our page", "url": "https://source/page", "quote": "a verbatim passage from that page" }
```

`.github/workflows/source-quotes.yml` fetches every `url` from a GitHub runner
on each pull request that touches this folder, every Wednesday, and on demand,
and fails when a `quote` is not in its source (whitespace, quote marks, case,
table pipes and heading marks are normalised). It checks presence, not
meaning: a reviewer still reads each claim beside its quote. Quote running
text as it appears on the page, without list bullets.
