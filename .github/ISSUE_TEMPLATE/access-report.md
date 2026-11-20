---
name: API access report
about: How your application for a wearable vendor API went (approved, rejected, no answer, pending), for aifitnessapi.com
title: "[access-report] "
labels: access-report
---

<!--
The quickest way to report is the "Report your application" button on the
vendor's integration guide on aifitnessapi.com (or on
https://aifitnessapi.com/fix/garmin-api-approval): it opens this issue with
the vendor filled in.

A maintainer reads each report and adds the access-report:accepted label;
scripts/import-access-reports.mjs imports only those, and a report that does
not fit the block below is skipped, not corrected. Nothing is filled in for
you and no number is added that you did not write.
-->

One application, as it happened to you. Everything in this issue is public.

Please do not post API keys, tokens, client secrets, emails, or the names of people
(your own or the vendor's staff). Text that looks like a key, token, email or @mention
is removed before a report is listed on aifitnessapi.com.

Fill in the block below, one line per field, after the colon. Allowed values:

- vendor: garmin | whoop | oura | strava | polar | coros | suunto | withings | fitbit | samsung-health | dexcom | wahoo
- program: the program or tier you applied to, up to 80 characters
- use: personal | commercial | research
- applied: the month you applied, YYYY-MM
- outcome: approved | rejected | no-answer | pending
- days_to_first_answer: optional: a whole number of days, 0 to 730; leave blank for no-answer
- asked_for: optional: what the vendor asked you for, up to 200 characters
- notes: optional: anything else, one line, up to 500 characters

```access-report
vendor:
program:
use:
applied:
outcome:
days_to_first_answer:
asked_for:
notes:
```

A maintainer reads each report and adds the `access-report:accepted` label; only those are
listed, each with a link back to this issue. Edit the issue if your outcome changes.
