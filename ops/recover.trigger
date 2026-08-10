recover

# First line = mode for .github/workflows/vercel-recover.yml
#   diagnose  read-only: account, projects, domains
#   recover   deploy latest main to production, then attach both domains
#
# Run log:
# 2026-08-10 diagnose — account healthy, TWO projects exist: "aifitnessapi"
#   and a duplicate "aifitnessapi-nw4d", both with production URLs.
#   aifitnessapi.com is registered in the account (third-party registrar) but
#   was serving Vercel NOT_FOUND, i.e. attached to no serving project.
# 2026-08-10 recover — deploy latest main to "aifitnessapi", detach the
#   domains from the duplicate, attach apex + www (308 to apex) to it.
