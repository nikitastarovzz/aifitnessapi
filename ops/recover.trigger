probe

# First line = mode for .github/workflows/vercel-recover.yml
#   diagnose  read-only: account, projects, domains
#   probe     response headers + DNS + domain config + deployments (compact)
#   recover   repoint domains at production, then deploy latest main
#
# Run log:
# 2026-08-10 diagnose — account healthy. Two projects: "aifitnessapi" and a
#   duplicate "aifitnessapi-nw4d". Domain registered, apex+www both 404.
# 2026-08-10 recover #1 — failed pre-deploy: CLI needs --scope when the
#   account has several teams. Printed the key fact: both domains attached
#   and verified on the right project, apex configured to redirect to www.
# 2026-08-10 recover #2 — deploy SUCCEEDED and Vercel reported
#   "Aliased https://aifitnessapi.com", yet the apex still returned 404 on
#   six polls. So: healthy project, healthy production build, domain
#   attached and verified, alias applied — and still NOT_FOUND. The build
#   log cannot explain that; the response headers can.
# 2026-08-10 probe — capture x-vercel-error / x-vercel-id, DNS resolution,
#   the *.vercel.app control URL, and the deployment list, to separate a DNS
#   problem (stale apex A record) from a routing/alias problem.
