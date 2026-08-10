recover

# First line = mode for .github/workflows/vercel-recover.yml
#   diagnose  read-only: account, projects, domains
#   probe     response headers + DNS + domain config + deployments (compact)
#   recover   repair build settings, deploy latest main, verify
#
# Run log:
# 2026-08-10 diagnose — account healthy; duplicate project aifitnessapi-nw4d.
# 2026-08-10 recover #1 — failed pre-deploy: CLI needs --scope with >1 team.
# 2026-08-10 recover #2 — deploy succeeded, Vercel reported "Aliased
#   https://aifitnessapi.com", apex still 404 on six polls.
# 2026-08-10 probe — THE ANSWER. aifitnessapi.vercel.app (Vercel's own URL,
#   no DNS in the path) also returns x-vercel-error: NOT_FOUND, while the
#   deployment list shows READY deployments and the domains are verified with
#   gitBranch cleared and www now 308-ing to apex. Healthy deployments that
#   serve nothing on every domain = the deployments contain no routable
#   output, the signature of a wrong Root/Output Directory. Corroborated by
#   recover #2's upload size: 5.6 KB for a 206-page site.
# 2026-08-10 recover #3 — print the project's build settings, reset
#   rootDirectory/outputDirectory/buildCommand/installCommand to defaults with
#   framework=nextjs, then deploy building ON Vercel (not --prebuilt).
