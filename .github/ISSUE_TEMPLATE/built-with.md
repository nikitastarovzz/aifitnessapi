---
name: Built with these APIs
about: Your project that uses an API aifitnessapi.com covers, for the "Built with" list on aifitnessapi.com/awesome
title: "[built-with] "
labels: built-with
---

<!--
The "Submit your project" button on https://aifitnessapi.com/awesome opens
this form. A maintainer reads each submission and adds the built-with:accepted
label; scripts/import-built-with.mjs imports only those, and a submission
that does not fit the block below is skipped, not corrected.
-->

A project you made that uses one or more of the APIs aifitnessapi.com covers. Everything in this issue is public.

Please do not post API keys, tokens, client secrets, emails, or the names of people.
Text that looks like a key, token, email or @mention is removed before a project is listed.

Fill in the block below, one line per field, after the colon:

- name: the project's name, up to 60 characters
- url: the project's public https address (its site or repository), with no query string
- repo: optional: its source repository on github.com, gitlab.com, codeberg.org, bitbucket.org
- apis: the APIs it uses, as directory ids separated by commas, up to 8 (the last part of a product's address on https://aifitnessapi.com/apis, e.g. garmin, health-connect, mediapipe)
- description: what it does, one line, up to 140 characters

```built-with
name:
url:
repo:
apis:
description:
```

A maintainer reads each submission and adds the `built-with:accepted` label; only those are
listed on https://aifitnessapi.com/awesome and in AWESOME.md, with your description as you wrote it
and a link back to this issue. Listing is not a review or an endorsement.
