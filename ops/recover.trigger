recover

# First line = mode for .github/workflows/vercel-recover.yml
#   diagnose  read-only: account, projects, domains
#   recover   repoint domains at production, then deploy latest main
#
# Run log:
# 2026-08-10 diagnose — account healthy. Two projects: "aifitnessapi" and a
#   duplicate "aifitnessapi-nw4d". Domain aifitnessapi.com registered to the
#   account, apex+www both serving Vercel NOT_FOUND.
# 2026-08-10 recover #1 — FAILED before deploying: the CLI refuses to pick a
#   team without a TTY when the account has several ("Multiple teams found"),
#   so every vercel command now passes --scope. Its diagnostic output was the
#   real prize: BOTH domains are attached to the right project and verified,
#   and apex was configured to redirect to www — so the 404 comes from the
#   domain config itself, not a missing deployment.
# 2026-08-10 recover #2 — clear gitBranch on both domains (a domain pinned to
#   a deleted branch serves DEPLOYMENT_NOT_FOUND), make apex serve production,
#   make www 308 to apex (matches our canonicals), then deploy latest main.
