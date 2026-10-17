# Source lists for the snapshot workflow

Each `<name>.txt` lists public pages, one https URL per line (`#` starts a
comment), for `.github/workflows/source-snapshot.yml` to fetch from a GitHub
runner. The first pass of a list is usually the vendor's home, pricing and
documentation roots; the artifact's `index.json` lists each page's same-host
links, and the follow-up pass names the exact pages a writer needs.

Snapshots are research copies retained for 14 days and are never committed.
A page on the site cites the original URL and the fetch date the snapshot
records. ops/EXPANSION-3-2026-10-17.md item 4.8.
