#!/usr/bin/env bash
# Vercel: exit 0 skips; exit 1 builds. Compare to the last successful
# deployment, never HEAD^ (which can miss earlier unbuilt application changes).
set -u
if [ "${FORCE_VERCEL_BUILD:-}" = "1" ]; then
  echo "Build explicitly requested."
  exit 1
fi
base="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$base" ] || ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  echo "No usable previous deployment; build."
  exit 1
fi
# No changes can be a manual redeploy after environment settings changed.
if git diff --quiet "$base" HEAD --; then
  echo "Same commit redeployment; build."
  exit 1
fi
if git diff --quiet --no-renames "$base" HEAD -- . ':(exclude)README.md' ':(exclude)CLAUDE.md' ':(exclude)AGENTS.md' ':(exclude)ops/**/*.md' ':(exclude)ops/*.md' ':(exclude)ops/content-log.jsonl' ':(exclude)ops/sources/**'; then
  echo "Only non-site documentation or source assets changed; skip."
  exit 0
fi
echo "Site changes or unavailable diff; build."
exit 1
