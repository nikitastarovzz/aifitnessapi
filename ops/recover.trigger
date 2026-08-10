diagnose

# First line = mode for .github/workflows/vercel-recover.yml
#   diagnose  read-only: account, projects, domains
#   recover   build + deploy to production, then attach both domains
# Editing this file triggers the workflow (a session can do that; it cannot
# click in the Vercel dashboard, and api.vercel.com is blocked from the dev
# sandbox by the network policy).
#
# Run log:
# 2026-08-06 diagnose — outage day 3; apex+www both serving Vercel NOT_FOUND,
#   Redeploy available but Promote greyed in the dashboard, which points at
#   the domains being detached from the project rather than a missing build.
