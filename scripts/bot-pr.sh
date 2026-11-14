#!/usr/bin/env bash
# Open a tracker workflow's pull request, set it to merge itself, and start
# the required check. Shared by the tracker workflows (sdk-releases,
# libraries, mcp-health-servers, google-health-api, bluetooth-gatt) so the
# three things that have each gone wrong once live in one place.
#
#   bash scripts/bot-pr.sh "<branch>" "<title>" "<body>"
#
# The branch must already be pushed. GH_TOKEN must be set, and the workflow
# needs `pull-requests: write` and `actions: write`.
#
# 1. `gh pr create`. With the repository setting "Allow GitHub Actions to
#    create and approve pull requests" off (Settings -> Actions -> General),
#    GitHub refuses this with "not permitted to create or approve pull
#    requests". That refusal is not a failure of the tracker: the refreshed
#    data is on the pushed branch. So it ends the run green with a notice,
#    and the daily vendor-watch session (ops/VENDOR-WATCH.md, step 1) opens
#    the pull request for any bot/* branch that has none. Every tracker was
#    paused on 2026-10-06 because this refusal emailed a failure on every
#    run; ending green is what lets the schedules be on again.
#    Any other refusal still fails the run.
# 2. `gh pr merge --auto --squash --delete-branch`: green merges itself, red
#    parks as an open pull request.
# 3. `gh workflow run ci.yml --ref <branch>`: a pull request opened with
#    GITHUB_TOKEN does not start ci.yml (GitHub suppresses events from that
#    token), so without this dispatch the required `gates` check never
#    reports and auto-merge waits forever.
set -euo pipefail

branch="${1:?branch}"
title="${2:?title}"
body="${3:?body}"

if ! out=$(gh pr create --base main --head "$branch" --title "$title" --body "$body" 2>&1); then
  echo "$out"
  if printf '%s' "$out" | grep -q "not permitted to create or approve pull requests"; then
    echo "::notice title=Branch pushed, pull request not opened::The refresh is on ${branch}. This repository does not allow GitHub Actions to open pull requests, so the daily vendor-watch session opens it (ops/VENDOR-WATCH.md). To let this workflow open its own: Settings -> Actions -> General -> Workflow permissions -> Allow GitHub Actions to create and approve pull requests."
    exit 0
  fi
  exit 1
fi
echo "$out"
gh pr merge --auto --squash --delete-branch "$branch"
gh workflow run ci.yml --ref "$branch"
