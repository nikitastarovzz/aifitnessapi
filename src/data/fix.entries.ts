import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED troubleshooting guides (originally auto-assembled; since
 * hand-edited — edit here). Symptom -> cause -> fix, grounded in correct
 * HTTP/OAuth semantics and per-provider specifics.
 */
export const fixEntries: ClusterEntry[] =
[
  {
    "slug": "fitness-api-401-unauthorized",
    "primaryQuery": "fitness api 401 unauthorized",
    "h1": "Why Is My Fitness API Returning 401 Unauthorized?",
    "metaTitle": "Fitness API 401 Unauthorized: The Ranked Fixes",
    "metaDescription": "A 401 from any fitness API means the credential was rejected: expired, malformed, or revoked. The ranked causes and fixes, provider by provider.",
    "updated": "2026-07-09",
    "answer": "A 401 Unauthorized from a fitness API means the server rejected your credential, not your permissions: the access token is missing, malformed, expired, or revoked. The most common cause is an expired access token, so refresh it and retry. Do not confuse 401 with 403 (Forbidden) — a 403 means the token is valid but lacks the required scope, and refreshing will not fix it; you must re-authorize with the missing scope instead.",
    "body": "Your fitness API call is coming back `401 Unauthorized`, which means the server rejected your **credential**, not your permissions — the access token is missing, malformed, expired, or revoked. The fix for the most common case is simple: your access token expired, so refresh it and retry. Before you do anything, though, confirm you are actually looking at a `401` and not a `403`, because they have completely different fixes.\n\n## 401 vs 403: read this before you touch anything\n\nThese two get confused constantly, and treating one like the other will waste your afternoon.\n\n- **`401 Unauthorized` means \"who are you? your credential is bad.\"** Authentication failed or was not supplied. The token is missing, malformed, expired, revoked, or the wrong type. Per RFC 6750, a spec-compliant server maps this to the Bearer error `invalid_token`.\n- **`403 Forbidden` means \"we know who you are, but you may not do this.\"** The token is authentic and active, but it **lacks the required scope**, or your app/user is not approved for that data. This maps to the Bearer error `insufficient_scope`.\n\nThe load-bearing consequence: **refreshing your token will NOT fix a `403`.** A refresh mints a new token with the *same* scopes the user already granted, so a scope problem survives the refresh untouched. If you are getting `403`, stop refreshing and re-authorize the user with the missing scope instead. The rest of this guide is about `401` only.\n\nA well-behaved server also tells you exactly what is wrong in a `WWW-Authenticate` response header:\n\n```http\nHTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer realm=\"...\", error=\"invalid_token\",\n                  error_description=\"The access token expired\"\n```\n\nRead that header (and the JSON body) first — providers put the specific reason in `error_description`.\n\n## Reproduce it with curl and read the response\n\nMake the failing call by hand so you can see the raw status line and headers. The `-i` flag prints the response headers, which is where the diagnosis lives:\n\n```bash\ncurl -i \"https://api.example-fitness.com/v1/user/-/activities/date/2026-07-08\" \\\n  -H \"Authorization: Bearer $ACCESS_TOKEN\"\n```\n\nThen read it top to bottom:\n\n- **Status line** — confirm it says `401`, not `403`. If it is `403`, go re-authorize with the right scope, not refresh.\n- **`WWW-Authenticate` header** — look for `error=\"invalid_token\"` (a `401` signal) versus `error=\"insufficient_scope\"` (a `403` signal).\n- **Response body** — each provider names the cause differently. Fitbit returns an `errors[]` array with `errorType` values like `expired_token` or `invalid_token` (the Fitbit-specific walkthrough is [Fitbit error code 401](/fix/fitbit-error-code-401)). Strava returns `{\"message\":\"Authorization Error\",\"errors\":[{\"field\":\"access_token\",\"code\":\"invalid\"}]}`. Garmin returns body text like `\"OAuthToken is invalid\"`. Oura and WHOOP return `401` on a bad or expired token.\n\n## Most likely causes, ranked\n\nIn rough order of how often they bite, from most common to least:\n\n1. **Expired access token.** Access tokens are short-lived by design (often an hour to a few hours; some providers longer — verify against the provider's docs). This is the number-one cause of a sudden `401` on a call that worked earlier. The fix is to refresh, not to re-authorize the user.\n2. **Missing or malformed `Authorization` header.** The header must be exactly `Authorization: Bearer <token>`. Classic breakers: no `Bearer ` prefix, a lowercase `bearer` on a strict server, leading/trailing whitespace or a stray newline in the token, sending the **refresh token** where the **access token** belongs, or double-encoding the token.\n3. **Revoked token.** The user disconnected your app, changed their password, or you called the revoke endpoint. A refresh will also fail here — the user must re-authorize from scratch.\n4. **Wrong token or wrong grant.** A token minted for a different app or environment (staging token against prod), or an ID token used where an access token is expected. The token is valid *somewhere*, just not here.\n\n## How to fix it\n\n### Step 1 — Confirm it is really a 401 (not a 403)\n\nRerun the `curl -i` above and check the status line and the `WWW-Authenticate` error code. `invalid_token` (or a `401`) means keep reading. `insufficient_scope` (or a `403`) means the token is fine and you have a scope problem — re-authorize with the missing scope and stop here.\n\n### Step 2 — Check the Authorization header format\n\nPrint the exact header your client sends and eyeball it against `Authorization: Bearer <access_token>`. Verify: the `Bearer ` prefix is present with correct casing, there is exactly one space, and there is no trailing newline or whitespace. Confirm you are sending the **access token**, not the refresh token or client secret. A quick way to catch a malformed local variable is to reproduce the exact same call in curl — if curl works and your app does not, the bug is in how your app builds the header.\n\n### Step 3 — Refresh the access token\n\nIf the header is correct and the token is simply old, exchange your stored refresh token for a new access token, then retry the original call:\n\n```bash\ncurl -s -X POST \"https://api.example-fitness.com/oauth/token\" \\\n  -d client_id=$CID -d client_secret=$SECRET \\\n  -d grant_type=refresh_token \\\n  -d refresh_token=$STORED_REFRESH_TOKEN\n```\n\nPersist the new access token and retry. **Refresh proactively** — refresh when the token has only a few minutes of life left, rather than waiting for a burst of `401`s in production. Note that several providers (Strava, WHOOP, Oura, Garmin) *rotate* the refresh token and return a new one in this response that you must save; if your refresh \"works once then fails,\" that is the rotation trap, covered in [refresh token not working](/fix/refresh-token-not-working).\n\n### Step 4 — If the refresh also fails, treat the grant as dead\n\nIf the refresh call returns `400 invalid_grant` (or the refresh itself `401`s), the credential is gone — the user revoked access, the grant expired, or you lost the rotated refresh token. Retrying will not help. Send the user back through the full authorization flow to mint a fresh grant. See the happy-path OAuth setup in the [integration guides](/integrate).\n\n### Step 5 — Rule out the wrong-token and clock-skew traps\n\nConfirm the token was issued by the same app credentials and environment you are calling (a staging token against production will `401`). If token exchanges intermittently fail as \"expired\" the moment they are issued, check that your server clock is NTP-synced — large clock skew makes fresh tokens look already-expired. And if the *token exchange* itself is failing with `redirect_uri` errors rather than your API calls, that is a different bug: see [OAuth redirect URI mismatch](/fix/oauth-redirect-uri-mismatch).\n\n## Still stuck? Quick diagnostic checklist\n\nRun these in order:\n\n1. `curl -i` the failing endpoint — is it truly `401`, or is it `403` (scope problem, do not refresh)?\n2. Read the `WWW-Authenticate` header and JSON body — `invalid_token` vs `insufficient_scope`.\n3. Diff your `Authorization` header against `Bearer <access_token>` — prefix, casing, whitespace, right token.\n4. Refresh the access token and retry the exact call.\n5. If refresh returns `invalid_grant`, the grant is dead — re-authorize the user.\n6. Confirm token environment matches (staging vs prod) and server clock is NTP-synced.\n\nIf all six pass and you still see `401`, capture the full request and response (headers included, token redacted) and check the provider's error-handling docs for that specific `errorType`.",
    "faqs": [
      {
        "q": "What is the difference between a 401 and a 403 from a fitness API?",
        "a": "A 401 Unauthorized means authentication failed: the token is missing, malformed, expired, revoked, or the wrong type. A 403 Forbidden means the token is authentic but lacks the required scope or approval. The distinction matters because refreshing a token fixes many 401s but never fixes a 403 — for a 403 you must re-authorize the user with the missing scope."
      },
      {
        "q": "Will refreshing my token fix a 401?",
        "a": "Usually yes, if the cause is an expired access token, which is the most common reason for a sudden 401. Refresh the token and retry. It will not help, though, if the token was revoked or the grant is dead — in those cases the refresh itself fails and the user must re-authorize."
      },
      {
        "q": "Why does my Authorization header cause a 401 even with a valid token?",
        "a": "The header must be exactly the word Bearer, a space, then the access token (for example, Authorization: Bearer eyJhbGci...). Common breakers are a missing Bearer prefix, lowercase bearer on strict servers, leading or trailing whitespace or a newline in the token, sending the refresh token instead of the access token, or double-encoding the token. Reproduce the call with curl to isolate a client-side formatting bug."
      },
      {
        "q": "How do I know which specific cause triggered my 401?",
        "a": "Read the WWW-Authenticate response header, which spec-compliant servers use to report an error like invalid_token, plus the JSON body. Providers name causes differently — Fitbit uses errorType values such as expired_token, Strava returns an Authorization Error with code invalid, and Garmin returns text like OAuthToken is invalid. Check the provider's error-handling docs for the exact string."
      },
      {
        "q": "My refresh worked once and now returns invalid_grant — is that a 401 problem?",
        "a": "No, that is a refresh-token rotation problem. Providers such as Strava, WHOOP, Oura, and Garmin return a new refresh token on refresh and invalidate the old one immediately. If you keep reusing the original, the first refresh succeeds and later ones fail with invalid_grant. Persist the returned refresh token on every refresh."
      }
    ],
    "related": [
      {
        "href": "/fix/oauth-redirect-uri-mismatch",
        "label": "Fix: OAuth redirect_uri mismatch"
      },
      {
        "href": "/fix/refresh-token-not-working",
        "label": "Fix: refresh token not working"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "We unpack a fitness or wearable API's OAuth quirks and error codes every week — subscribe to get the next breakdown before it bites you in production."
    },
    "steps": [
      {
        "name": "Confirm it is a 401, not a 403",
        "text": "Rerun the call and check the status line and the WWW-Authenticate error code. An invalid_token or 401 means an authentication problem you can fix; insufficient_scope or 403 means the token is valid but missing a scope, which a refresh will not fix."
      },
      {
        "name": "Check the Authorization header format",
        "text": "The header must be exactly Authorization: Bearer followed by the access token. Verify the Bearer prefix, correct casing, no stray whitespace or newline, and that you are sending the access token rather than the refresh token or client secret."
      },
      {
        "name": "Refresh the access token",
        "text": "If the header is correct and the token is simply old, exchange your stored refresh token for a new access token and retry the call. Refresh proactively when little token life remains rather than waiting for 401s in production."
      },
      {
        "name": "If the refresh fails, re-authorize the user",
        "text": "A refresh that returns invalid_grant or 401 means the grant is dead because the user revoked access, it expired, or you lost a rotated refresh token. Retrying will not help, so send the user through the full authorization flow again."
      },
      {
        "name": "Rule out wrong-token and clock-skew traps",
        "text": "Confirm the token was issued by the same app and environment you are calling, since a staging token against production returns 401. If fresh tokens look already expired, make sure your server clock is NTP-synced."
      },
      {
        "name": "Run the diagnostic checklist",
        "text": "In order: confirm 401 vs 403, read the WWW-Authenticate header and body, diff the Authorization header, refresh and retry, re-authorize if the grant is dead, and verify environment and clock. If all pass, capture the full request and response and check the provider's error docs."
      }
    ]
  },
  {
    "slug": "oauth-redirect-uri-mismatch",
    "primaryQuery": "oauth redirect_uri mismatch",
    "h1": "How to Fix the OAuth redirect_uri Mismatch Error",
    "metaTitle": "Fix the OAuth redirect_uri Mismatch Error",
    "metaDescription": "The redirect_uri you send must match your registered callback byte-for-byte. Diff scheme, host, port, path, slash, and encoding to fix the mismatch fast.",
    "updated": "2026-07-09",
    "answer": "The OAuth redirect_uri_mismatch error means the redirect_uri your app sends is not byte-for-byte identical to a callback URL registered in the provider's developer console. OAuth servers do an exact string comparison, so http vs https, localhost vs 127.0.0.1, a trailing slash, a port, path case, or encoding differences all break it. Copy the registered value and the value your code actually sends, diff them character by character, and make them match. The same mismatch caught at the token step can surface as invalid_grant instead, so read the error_description.",
    "body": "You clicked through the OAuth consent screen (or you POSTed the authorization code) and the provider threw back `redirect_uri_mismatch` — or, at the token step, an unhelpful `invalid_grant`. The cause is almost always the same: the `redirect_uri` your code sent is not **byte-for-byte identical** to a callback URL registered in the provider's developer console. Fix it by copying the registered value and the sent value side by side and diffing them character for character — scheme, host, port, path, trailing slash, query, and encoding all count.\n\nOAuth servers do an **exact string comparison** on the redirect URI, not a semantic one. `https://app.example.com/callback` and `https://app.example.com/callback/` are two different strings to the server, even though a browser treats them the same. That single rule explains nearly every mismatch on this page.\n\n## Most likely causes (ranked)\n\nFrom most to least common in fitness/health API integrations (Fitbit, Strava, Oura, WHOOP, Garmin):\n\n1. **`http` vs `https`.** You registered `https://...` but your local dev server sends `http://localhost...` (or the reverse). The schemes must match exactly.\n2. **`localhost` vs `127.0.0.1`.** These are **not** equal to the string matcher, even though they resolve to the same machine. Pick one and register that exact host. The same applies to `example.com` vs `www.example.com`.\n3. **Trailing slash.** `/callback` and `/callback/` are different. This is the sneakiest one because frameworks and proxies sometimes add or strip the slash for you.\n4. **Port present vs absent.** `http://localhost:3000/callback` is not `http://localhost/callback`, and `https://app.example.com:443/callback` is not `https://app.example.com/callback` (443 is implicit for https). Register the port exactly as your code emits it.\n5. **Path differences (including case).** `/callback` vs `/oauth/callback` vs `/Callback`. Paths are case-sensitive to the matcher.\n6. **URL-encoding differences.** `%2F` vs `/`, or uppercase vs lowercase in a percent-encoded segment. Encode the `redirect_uri` query parameter once and consistently; do not double-encode it.\n7. **The two steps disagree.** The `redirect_uri` sent to the **authorize** step and the one sent to the **token** step must be the same string. If they differ, you may pass the authorize step and then get rejected at the token exchange — where it can surface as `invalid_grant` rather than `redirect_uri_mismatch`.\n\n> **Why you sometimes see `invalid_grant` instead.** Per RFC 6749, the token endpoint returns `invalid_grant` when the grant \"does not match the redirection URI used in the authorization request.\" So a redirect mismatch caught at the **authorize** step reads as `redirect_uri_mismatch`, but the same mismatch caught at the **token** step can read as `400 invalid_grant`. Always log the `error_description` — providers put the specific reason there.\n\n## How to fix it\n\n### Step 1: Print the exact URI your code sends\n\nBefore anything else, log the literal `redirect_uri` string your app puts on the wire, at both the authorize step and the token step. Do not read it from a config variable you assume is correct — log the actual outgoing value.\n\n```bash\n# Whatever your code builds, echo the exact string it sends:\necho \"$REDIRECT_URI\"\n# e.g. http://localhost:3000/callback\n```\n\n### Step 2: Copy the registered URI from the developer console\n\nOpen the provider's app settings (Fitbit `dev.fitbit.com`, Strava's API settings, Oura, WHOOP, or the Garmin developer portal) and copy the registered **Callback / Redirect URI** verbatim. Paste both values into a plain-text editor, one above the other.\n\n### Step 3: Diff them character by character\n\nWalk the two strings left to right and check each component. A quick way to catch invisible differences (trailing slash, whitespace, encoding) is to compare them programmatically rather than by eye:\n\n```bash\n# Prints \"MATCH\" only if the two strings are byte-for-byte identical.\nREGISTERED=\"https://app.example.com/callback\"\nSENT=\"https://app.example.com/callback/\"\n[ \"$REGISTERED\" = \"$SENT\" ] && echo \"MATCH\" || echo \"MISMATCH\"\n# MISMATCH  <- the trailing slash on $SENT is the bug\n```\n\nUse this checklist as you compare:\n\n- scheme — `http` vs `https`\n- host — `localhost` vs `127.0.0.1`, apex vs `www`\n- port — present vs absent, explicit `:443` vs implicit\n- path — spelling and case, `/callback` vs `/oauth/callback`\n- trailing slash — `/callback` vs `/callback/`\n- query string — any extra or reordered params\n- percent-encoding — `%2F` vs `/`, and the case of encoded characters\n\n### Step 4: Make the two OAuth steps use the identical string\n\nKeep the `redirect_uri` in one constant and pass that same constant to both the authorize URL and the token exchange. If they diverge, the token step rejects you.\n\n```bash\n# Authorization-code exchange (Strava shown). The redirect_uri here MUST equal\n# the one used to build the authorize URL earlier — same string, character for character.\ncurl -X POST https://www.strava.com/oauth/token \\\n  -d client_id=$CID -d client_secret=$SECRET \\\n  -d code=$AUTH_CODE \\\n  -d grant_type=authorization_code \\\n  -d redirect_uri=https://app.example.com/callback\n# A 400 invalid_grant here is often the redirect_uri differing from the authorize step\n# (or a reused/expired code) — read error_description to disambiguate.\n```\n\n### Step 5: Register every environment explicitly\n\nLocal dev, staging, and production each need their own registered callback (for example `http://localhost:3000/callback`, `https://staging.example.com/callback`, and `https://app.example.com/callback`). Add each one to the console rather than trying to make one entry cover all environments.\n\n### Step 6: Never append dynamic data to the redirect URI\n\nDo not tack per-request query parameters onto `redirect_uri` — an unregistered or reordered query string will fail the exact-match check. Put per-request data in the `state` parameter instead, which is designed for exactly this and also protects against CSRF.\n\n## Still stuck? Quick triage\n\nRun this short checklist:\n\n- Log the **literal** sent `redirect_uri` at both steps and diff each against the console value with a string-equality check, not your eyes.\n- Confirm scheme, host, port, path, trailing slash, query, and encoding all match — this covers essentially every case.\n- Confirm the authorize step and token step send the **same** string.\n- If you only see `invalid_grant` (not `redirect_uri_mismatch`), read `error_description`; it may be a reused or expired authorization code rather than the URI — codes are single-use and short-lived.\n- If your app sits behind a proxy or framework that rewrites the path, verify what actually leaves your process, since the proxy may add or strip a trailing slash after your code builds the URL.\n\nOnce the callback matches, you're back on the happy path. For the full authorization flow per provider, see the [integration guides](/integrate) — for example [Fitbit](/integrate/fitbit-api), [Strava](/integrate/strava-api), or [Garmin](/integrate/garmin-api). And if your calls start returning `401` after auth succeeds, that's a different problem — head to [Fix a fitness API 401 Unauthorized error](/fix/fitness-api-401-unauthorized).",
    "faqs": [
      {
        "q": "Why do localhost and 127.0.0.1 count as a mismatch?",
        "a": "OAuth servers compare the redirect_uri as an exact string, not by what it resolves to. localhost and 127.0.0.1 are different strings even though they point to the same machine, so you must register and send whichever one your code actually uses."
      },
      {
        "q": "Does a trailing slash really matter?",
        "a": "Yes. /callback and /callback/ are different strings to the matcher, so one will fail if the other is registered. Frameworks and proxies sometimes add or strip the slash after your code builds the URL, so verify what actually leaves your process."
      },
      {
        "q": "Why do I get invalid_grant instead of redirect_uri_mismatch?",
        "a": "A redirect mismatch caught at the authorize step reads as redirect_uri_mismatch, but the same mismatch caught at the token step can read as 400 invalid_grant because the grant no longer matches the redirect used in the authorization request. Read the error_description field, since invalid_grant can also mean a reused or expired authorization code."
      },
      {
        "q": "Do the authorize and token steps need the same redirect_uri?",
        "a": "Yes. The redirect_uri sent when you build the authorize URL and the one sent when you exchange the code must be the identical string. If they differ you may pass the authorize step and then be rejected at the token exchange."
      },
      {
        "q": "How do I support local, staging, and production callbacks?",
        "a": "Register each environment's exact callback URL separately in the developer console, for example an http localhost URL for dev and https URLs for staging and production. Do not try to make a single entry cover multiple environments."
      }
    ],
    "related": [
      {
        "href": "/fix/fitness-api-401-unauthorized",
        "label": "Fix: fitness API 401 Unauthorized"
      },
      {
        "href": "/integrate",
        "label": "How to integrate a fitness or health API"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "We publish a new fitness and wearable API teardown every week, OAuth footguns and redirect-URI gotchas included. Subscribe to catch the next one."
    },
    "steps": [
      {
        "name": "Print the exact URI your code sends",
        "text": "Log the literal redirect_uri string your app puts on the wire at both the authorize step and the token step. Do not trust a config variable you assume is correct; capture the actual outgoing value."
      },
      {
        "name": "Copy the registered URI from the developer console",
        "text": "Open your app settings in the provider's portal and copy the registered callback URI verbatim. Paste it and the sent value into a plain-text editor, one above the other."
      },
      {
        "name": "Diff them character by character",
        "text": "Compare the two strings with an exact equality check rather than by eye. Verify scheme, host, port, path and its case, trailing slash, query string, and percent-encoding all match."
      },
      {
        "name": "Make both OAuth steps use the identical string",
        "text": "Store the redirect_uri in one constant and pass that same value to both the authorize URL and the token exchange. If the two steps disagree, the token exchange rejects you, sometimes as invalid_grant."
      },
      {
        "name": "Register every environment explicitly",
        "text": "Add a separate registered callback for local dev, staging, and production rather than trying to cover them with one entry. Each exact URL must exist in the console."
      },
      {
        "name": "Never append dynamic data to the redirect URI",
        "text": "Do not add per-request query parameters to redirect_uri, since an unregistered or reordered query string fails the exact-match check. Put per-request data in the state parameter instead."
      }
    ]
  },
  {
    "slug": "refresh-token-not-working",
    "primaryQuery": "fitness api refresh token not working",
    "h1": "Why Is My Fitness API Refresh Token Not Working?",
    "metaTitle": "Fitness API Refresh Token Not Working? Fix invalid_grant",
    "metaDescription": "Your fitness API refresh token works once then returns invalid_grant? You're not saving the rotated refresh token. Here's the correct refresh flow.",
    "updated": "2026-07-09",
    "answer": "If your refresh works once and then every later attempt returns 400 invalid_grant, you almost certainly failed to persist a rotated refresh token. Strava, WHOOP, Oura, Garmin, and Fitbit return a NEW refresh token in the refresh response and invalidate the old one immediately. The fix is to read the refresh_token out of every refresh response and save it, overwriting the stored value. Other causes: an expired or revoked token, a missing offline scope, wrong client credentials, or clock skew.",
    "body": "Your refresh works exactly once, then every later refresh returns `400 invalid_grant`. In the fitness-API world this is almost always one cause: the provider rotated your refresh token and you didn't save the new one. Strava, WHOOP, Oura, and Garmin all hand back a *new* refresh token in the refresh response and invalidate the old one immediately — so if you keep sending the original, the first call succeeds and the next one fails.\n\nThis page ranks the causes from most to least common and shows the correct refresh flow, including the one line most broken integrations are missing: persist the returned `refresh_token` every single time, overwriting the old value.\n\n## Most likely causes, ranked\n\n1. **You're not persisting the rotated refresh token** (by far the most common). The provider returned a new `refresh_token` in the last refresh response; you ignored it and kept the original. Symptom: refresh succeeds once, then `400 invalid_grant` on the next attempt.\n2. **The refresh token is expired or revoked.** The user disconnected your app, changed their password, or the token simply aged out. No amount of retrying helps — the user must re-authorize.\n3. **You never got a real refresh token because a scope was missing.** WHOOP, for example, only issues a refresh token when you request the `offline` scope. Without the right scope you get an access token but nothing to refresh with.\n4. **Wrong client credentials.** You're sending a `client_id` / `client_secret` that doesn't match the app that minted the token, or using the wrong client-auth method. This surfaces as `invalid_client` (400 or 401), not `invalid_grant`.\n5. **Clock skew.** Your server clock is far enough off that freshly issued tokens look already-expired or not-yet-valid. Keep servers NTP-synced.\n6. **You're confusing the single-use auth code with the refresh token.** The authorization code from the redirect is single-use and very short-lived. Reusing it (or a double POST) throws `invalid_grant` at initial exchange — that's a code problem, not a refresh problem.\n\nIf you're getting a `401` on your *API calls* (not the token endpoint), that's a different problem — see [Fixing fitness API 401 Unauthorized](/fix/fitness-api-401-unauthorized).\n\n## How to fix it\n\n### 1. Confirm which provider rotates (most do)\n\nStrava's own docs say it plainly: *\"the refresh token may or may not be the same refresh token used to make the request. Applications should persist the refresh token contained in the response and always use the most recent refresh token.\"* Once a new one is issued, the old one dies immediately.\n\nAs of 2026 (verify against live docs), the rotation picture looks like this:\n\n| Provider | Rotates refresh token? | Note |\n|---|---|---|\n| Strava | Yes | May return the same or a new token — always take the returned one |\n| WHOOP | Yes | Requires `offline` scope to get a refresh token at all |\n| Oura | Yes | Single-use rotating refresh token |\n| Garmin | Yes | New refresh token on every access-token refresh |\n| Fitbit | Yes | Old refresh token invalidated after each successful refresh |\n\nThe safe rule that works for all of them: **treat every refresh token as single-use and always save the one you just received.**\n\n### 2. Run the refresh call and read the response body\n\nReproduce the refresh directly so you can see exactly what comes back. This is Strava; the shape is the same for the others (swap the token endpoint).\n\n```bash\ncurl -s -X POST https://www.strava.com/oauth/token \\\n  -d client_id=$CID -d client_secret=$SECRET \\\n  -d grant_type=refresh_token \\\n  -d refresh_token=$STORED_REFRESH_TOKEN\n```\n\nA successful response contains a fresh access token AND a refresh token that may differ from the one you sent:\n\n```json\n{\n  \"access_token\": \"...\",\n  \"expires_at\": 1720540800,\n  \"expires_in\": 21600,\n  \"refresh_token\": \"NEW_VALUE_MAYBE_DIFFERENT\"\n}\n```\n\nThat last field is the whole ballgame. Persist it, overwriting the old stored value.\n\n### 3. Persist the returned token every time — atomically\n\nThe fix is one discipline: after every refresh, write back BOTH the new access token and the returned refresh token, even if the refresh token looks unchanged.\n\n```python\n# Correct pattern: overwrite BOTH tokens after every refresh.\nresp = post_token_refresh(stored_refresh_token)   # may 400 invalid_grant if stale\nstore.save(\n    access_token  = resp[\"access_token\"],\n    refresh_token = resp[\"refresh_token\"],  # ALWAYS take the returned one\n    expires_at    = resp.get(\"expires_at\") or now() + resp[\"expires_in\"],\n)\n```\n\nWrite both fields in a single atomic update. If your code saves the access token but the refresh-token write is skipped, conditional, or lost to a crash, you've recreated the original bug.\n\n### 4. Serialize refreshes per user to avoid a rotation race\n\nTwo concurrent refresh calls for the same user will fight: the first rotates the token, and the second then sends the now-invalid one and gets `invalid_grant`. Wrap refreshes in a per-user lock (single-flight) so only one runs at a time. This is a common cause of intermittent `invalid_grant` in high-traffic backends where the token was actually saved correctly.\n\n### 5. Refresh proactively, not reactively\n\nDon't wait for a `401` to trigger a refresh — refresh on a buffer, for example when fewer than 5 minutes of access-token life remain. This avoids a burst of in-flight failures and reduces the window where a race can happen. (Note: Strava only mints a *new* access token when the current one has roughly an hour or less left — verify.)\n\n### 6. Check scope and credentials if you never had a refresh token\n\nIf the token response never contained a `refresh_token` in the first place, you're missing the scope that unlocks offline access (WHOOP needs `offline`; others require you to request refresh-capable consent). Re-run the authorization flow with the correct scope. If instead you see `invalid_client`, your `client_id` / `client_secret` or client-auth method is wrong — fix the credentials before touching anything else.\n\n## Still stuck? Diagnostic checklist\n\n- Log `error_description` from the token endpoint — `invalid_grant` is overloaded and the provider puts the real reason there.\n- Diff the refresh token you're sending against the one from the *last* successful response. If they differ, you're not persisting the rotation.\n- Confirm the token write actually committed (no swallowed exception, no rolled-back transaction).\n- Check for concurrent refreshes on the same user — add a per-user lock if you find any.\n- Verify server time is NTP-synced.\n- If refresh returns `invalid_grant` and the token was definitely current, the grant is dead (revoked or expired) — route the user back through authorization. Retrying won't help.\n\nFor the full happy-path OAuth setup on the provider most people hit this with, see the [Strava API integration guide](/integrate/strava-api). The same rotation discipline applies to [WHOOP](/integrate/whoop-api) and [Oura](/integrate/oura-api).",
    "faqs": [
      {
        "q": "Why does my refresh token work the first time but fail after that?",
        "a": "Because the provider rotated it. Strava, WHOOP, Oura, Garmin, and Fitbit return a new refresh token in the refresh response and invalidate the old one. If you keep sending the original, the first refresh succeeds and the next returns 400 invalid_grant. Save the returned token every time."
      },
      {
        "q": "What does invalid_grant mean on the token endpoint?",
        "a": "It is an overloaded OAuth 2.0 error meaning the grant you sent is invalid, expired, revoked, or does not match. For refreshes it usually means a stale or already-rotated refresh token. Always log error_description, since providers put the specific reason there."
      },
      {
        "q": "Do I need to save the refresh token even when it looks unchanged?",
        "a": "Yes. Providers that usually return the same token can still rotate without warning. The safe rule is to always overwrite your stored refresh token with the exact value from the latest response."
      },
      {
        "q": "My refresh keeps failing but I am saving the token. What else could it be?",
        "a": "Check for concurrent refreshes on the same user, which race and invalidate each other, and verify your server clock is NTP-synced. If the token was genuinely current and still fails, the grant is likely revoked or expired and the user must re-authorize."
      },
      {
        "q": "Why did I never receive a refresh token at all?",
        "a": "You probably did not request the scope that grants offline access. WHOOP requires the offline scope, and other providers need refresh-capable consent. Re-run the authorization flow with the correct scope."
      }
    ],
    "related": [
      {
        "href": "/fix/fitness-api-401-unauthorized",
        "label": "Fix: fitness API 401 Unauthorized"
      },
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Want the OAuth gotchas that break fitness integrations sent to you before they break yours? Join the newsletter."
    },
    "steps": [
      {
        "name": "Confirm your provider rotates refresh tokens",
        "text": "Strava, WHOOP, Oura, Garmin, and Fitbit all issue a new refresh token on refresh and invalidate the old one. Treat every refresh token as single-use regardless of provider."
      },
      {
        "name": "Run the refresh call and inspect the response body",
        "text": "Reproduce the refresh with curl against the token endpoint and look at the response. A successful response contains a refresh_token field that may differ from the one you sent."
      },
      {
        "name": "Persist the returned refresh token every time",
        "text": "After each refresh, atomically write back both the new access token and the returned refresh token, overwriting the stored values. Skipping this write recreates the bug."
      },
      {
        "name": "Serialize refreshes per user",
        "text": "Two concurrent refreshes for the same user race, so one rotates the token and the other sends the now-invalid one. Wrap refreshes in a per-user lock to prevent intermittent invalid_grant errors."
      },
      {
        "name": "Refresh proactively before expiry",
        "text": "Trigger refresh on a buffer, such as when under five minutes of access-token life remains, instead of waiting for a 401. This reduces in-flight failures and race windows."
      },
      {
        "name": "Check scope and credentials if you never had a refresh token",
        "text": "If the token response never included a refresh_token, you are missing the offline or refresh-capable scope. If you see invalid_client, your client_id, client_secret, or auth method is wrong."
      }
    ]
  },
  {
    "slug": "fitbit-api-429-rate-limit",
    "primaryQuery": "fitbit api 429 rate limit",
    "h1": "How to Fix Fitbit API 429 (Rate Limit) Errors",
    "metaTitle": "Fix Fitbit API 429 Rate Limit Errors: The Per-User Quota",
    "metaDescription": "Fitbit API returning 429 Too Many Requests? Read the per-user hourly limit, the reset headers, and how to fix it with backoff, caching, and webhooks.",
    "updated": "2026-07-09",
    "answer": "A Fitbit API 429 means you exceeded Fitbit's per-user hourly quota, roughly 150 requests per hour per consented user (as of 2026, verify), and every call past that is rejected until the window resets. The limit is counted per consented user, so one runaway loop on a single user trips it. To fix it, read the Fitbit-Rate-Limit-Reset or Retry-After header, wait that long, then retry with exponential backoff plus jitter. Longer term, cache responses, reduce and stagger calls, and replace polling with Fitbit subscriptions.",
    "body": "Your Fitbit API call just came back `429 Too Many Requests`. The cause is almost always simple: you exceeded Fitbit's per-user hourly quota (roughly 150 requests per hour per consented user, as of 2026 — verify against current docs), and every request past that returns 429 until the window resets. The quick fix is to stop hammering, read the `Fitbit-Rate-Limit-Reset` (or `Retry-After`) header, wait that long, and then retry with exponential backoff.\n\nThe critical thing to understand up front: **Fitbit's rate limit is counted per consented user, not per app.** So a single runaway loop or a tight polling job on one user's data will trip 429 for that user without touching anyone else's quota. That also means the fix is usually local to how you call one user's endpoints, not a global throttle across your whole app.\n\n## Most likely causes (ranked)\n\n1. **A polling loop that re-fetches the same user too often.** Cron jobs or refresh loops that pull intraday/activity data every few seconds or minutes burn through ~150 calls/hour fast. This is the number-one cause.\n2. **A retry storm on errors.** Code that retries failed calls immediately (no backoff) turns one blip into dozens of calls, which itself triggers 429 — then keeps retrying into the wall.\n3. **Fan-out per screen load.** Rendering a dashboard that makes many separate Fitbit calls (steps, heart rate, sleep, activities...) on every page view, uncached, multiplies requests per user.\n4. **No caching / no reset-header awareness.** Re-requesting data that hasn't changed, and blindly retrying without reading `Fitbit-Rate-Limit-Reset`, keeps you pinned at the limit.\n5. **Concurrent workers hitting one user.** Two jobs refreshing the same user in parallel double that user's request rate against a shared per-user bucket.\n\n## How to fix it\n\n### Step 1 — Confirm it's a rate limit and read the headers\n\nA Fitbit 429 returns a JSON error body and, importantly, rate-limit headers. Check them before doing anything else.\n\n```bash\ncurl -i -H \"Authorization: Bearer $ACCESS_TOKEN\" \\\n  \"https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json\"\n```\n\nLook at the response headers:\n\n```http\nHTTP/1.1 429 Too Many Requests\nFitbit-Rate-Limit-Limit: 150\nFitbit-Rate-Limit-Remaining: 0\nFitbit-Rate-Limit-Reset: 1893\nRetry-After: 1893\n```\n\n`Fitbit-Rate-Limit-Limit` is the quota for this user/window, `Fitbit-Rate-Limit-Remaining` is how many calls are left, and `Fitbit-Rate-Limit-Reset` is the number of seconds until the window resets (Fitbit resets roughly at the top of the hour). If `Retry-After` is present, honor it. The exact limit value can change, so read `Fitbit-Rate-Limit-Limit` from the response rather than hard-coding 150.\n\n### Step 2 — Wait for the reset, then back off with jitter\n\nWhen you get a 429, do NOT retry immediately. Wait at least `Fitbit-Rate-Limit-Reset` / `Retry-After` seconds. If those headers are missing, fall back to exponential backoff with full jitter so many users/workers don't all retry on the same tick (a thundering herd).\n\n```python\nimport random, time\n\ndef call_with_backoff(do_request, max_tries=6, cap=3600):\n    for attempt in range(max_tries):\n        r = do_request()\n        if r.status_code != 429:\n            return r\n        reset = r.headers.get(\"Fitbit-Rate-Limit-Reset\") or r.headers.get(\"Retry-After\")\n        if reset and str(reset).isdigit():\n            delay = int(reset)                                  # honor Fitbit first\n        else:\n            delay = random.uniform(0, min(cap, 2 ** attempt))   # full jitter fallback\n        time.sleep(delay)\n    raise RuntimeError(\"Fitbit rate limited: retries exhausted\")\n```\n\nTwo rules of thumb: honor the server's reset value first, and always add jitter to any computed backoff so retries spread out instead of synchronizing.\n\n### Step 3 — Cache responses and stop re-fetching unchanged data\n\nMost Fitbit data (yesterday's steps, last night's sleep, a completed activity) does not change. Cache it and serve from cache instead of re-calling. Practical moves:\n\n- Cache historical/daily summaries; only re-request the current day.\n- Store `Fitbit-Rate-Limit-Remaining` per user and short-circuit calls when it's near zero until the reset time passes.\n- De-duplicate identical in-flight requests for the same user so a page that needs steps twice makes one call.\n\n### Step 4 — Reduce and batch calls per user\n\nCut the number of requests each user requires:\n\n- Use endpoints that return a range in one call (e.g. a date-range time series) instead of one call per day.\n- Combine what you need per render; avoid a separate call per widget.\n- Spread background syncs out over time instead of refreshing every user on the same schedule — stagger jobs so no single user (or your overall traffic) spikes.\n- Serialize refreshes per user so two workers never double the rate on one user's bucket.\n\n### Step 5 — Replace polling with subscriptions (webhooks)\n\nThe biggest structural fix is to stop polling. Fitbit offers a subscription API that notifies your server when a user's data changes, so you fetch only when there's something new instead of asking on a timer. This collapses steady-state request volume dramatically and is the recommended way to stay under the per-user limit. Poll only as a fallback/reconciliation path.\n\n## Still stuck? Quick diagnostic checklist\n\n- Is it actually 429? Confirm the status code and read `Fitbit-Rate-Limit-Remaining` / `Fitbit-Rate-Limit-Reset` from the response headers.\n- Which user tripped it? Because the limit is per consented user, isolate the specific user and look at what's calling their endpoints in the last hour.\n- Do you retry without backoff anywhere? Grep for immediate retries and add the backoff-with-jitter wrapper.\n- Are you polling on a timer? Move the hot paths to subscriptions/webhooks.\n- Are you caching? If every request hits Fitbit live, add a cache for anything older than \"today.\"\n- Any parallel workers on the same user? Add a per-user lock.\n\n## Related\n\n- Happy-path setup: [Fitbit API integration guide](/integrate/fitbit-api)\n- Bigger picture: [Wearable data APIs](/fitness-apis/wearable-data-apis) and [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api)\n- If you're also seeing auth failures: [Fitness API 401 Unauthorized](/fix/fitness-api-401-unauthorized)\n\n> Heads up on a migration: a turndown of the legacy Fitbit Web API was reported for around September 2026. As of October 2, 2026 we could not confirm on an official page whether it has happened; Google's Fit migration guide (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations and gives no date. Where it stands is tracked on [Fitbit API deprecation status](/fitbit-api-shutdown). Rate limits on the Google Health API may not match the figures on this page, so check its current docs before relying on exact numbers.",
    "faqs": [
      {
        "q": "What is the Fitbit API rate limit?",
        "a": "As of 2026, Fitbit allows roughly 150 requests per hour per consented user, resetting near the top of each hour (verify against current Fitbit docs, as these numbers change). Read the Fitbit-Rate-Limit-Limit and Fitbit-Rate-Limit-Reset response headers for the live values."
      },
      {
        "q": "Is the Fitbit rate limit per app or per user?",
        "a": "It is counted per consented user, not per application. That means a single bad loop or aggressive polling job on one user's data can trigger 429 for that user without affecting your other users' quotas."
      },
      {
        "q": "How do I know when I can retry after a Fitbit 429?",
        "a": "Read the Fitbit-Rate-Limit-Reset header, which gives the number of seconds until the window resets, or the Retry-After header when present. Wait at least that long before retrying, and add jitter to any computed backoff."
      },
      {
        "q": "How do I stop hitting the Fitbit rate limit?",
        "a": "Cache data that does not change, reduce and batch calls, stagger background syncs so users are not all refreshed at once, and replace timer-based polling with Fitbit subscriptions so you fetch only when data actually changes."
      },
      {
        "q": "Is the Fitbit API being deprecated or migrated?",
        "a": "A turndown of the legacy Fitbit Web API was reported for around September 2026, but as of October 2, 2026 we could not confirm on an official page whether it has happened. Google's Fit migration guide, updated September 10, 2026, lists the Google Health API as the recommended path for Fitbit Web API integrations and gives no date. Rate limits on the Google Health API may differ from the legacy figures on this page, so check its current docs."
      }
    ],
    "related": [
      {
        "href": "/fix/refresh-token-not-working",
        "label": "Fix: refresh token not working"
      },
      {
        "href": "/integrate/fitbit-api",
        "label": "Integrate the Fitbit API"
      },
      {
        "href": "/fix/fitness-api-401-unauthorized",
        "label": "Fix: fitness API 401 Unauthorized"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Get practical fitness and wearable API integration tips, including rate-limit and OAuth gotchas, delivered to your inbox."
    },
    "steps": [
      {
        "name": "Confirm the 429 and read the rate-limit headers",
        "text": "Verify the status is 429 and read Fitbit-Rate-Limit-Limit, Fitbit-Rate-Limit-Remaining, and Fitbit-Rate-Limit-Reset from the response. Reset is the seconds until the window clears; read the limit from the header rather than hard-coding a number."
      },
      {
        "name": "Wait for the reset, then back off with jitter",
        "text": "Do not retry immediately. Wait at least the Fitbit-Rate-Limit-Reset or Retry-After seconds, and if those are missing use exponential backoff with full jitter so many workers do not retry on the same tick."
      },
      {
        "name": "Cache responses and stop re-fetching unchanged data",
        "text": "Most Fitbit data does not change once recorded, so cache historical and daily summaries and only re-request the current day. Track remaining quota per user and skip calls when it is near zero."
      },
      {
        "name": "Reduce and stagger calls per user",
        "text": "Use date-range endpoints instead of one call per day, combine what each screen needs, and spread background syncs over time so no single user or your overall traffic spikes. Serialize refreshes per user to avoid doubling the rate."
      },
      {
        "name": "Replace polling with subscriptions",
        "text": "Switch from timer-based polling to Fitbit's subscription API so your server is notified when a user's data changes and fetches only when there is something new. This is the recommended way to stay under the per-user limit."
      },
      {
        "name": "Run the diagnostic checklist if still stuck",
        "text": "Isolate which consented user tripped the limit since it is counted per user, grep for retries that lack backoff, confirm caching is in place, and check for parallel workers hitting the same user without a lock."
      }
    ]
  },
  {
    "slug": "healthkit-no-data",
    "primaryQuery": "healthkit returns no data",
    "h1": "Why Is HealthKit Returning No Data?",
    "metaTitle": "HealthKit Returning No Data? Fix Empty Reads",
    "metaDescription": "A HealthKit query returning empty can't tell a denied read from no data. Isolate the cause with a write-then-read test and these fixes.",
    "updated": "2026-10-02",
    "answer": "A HealthKit query that returns an empty array with no error may be a denied read permission, but HealthKit hides read-authorization state by design, so a blocked read looks exactly like a type with no data — Apple says your app then sees only the samples it saved itself. You cannot check read status directly, but write status is observable through authorizationStatus(for:), so run a write-then-read test: save a throwaway sample of the target type and read it back. If it round-trips, your plumbing is fine and the empty read is a denied read, a limited history window or genuinely no data; if the write fails, its error points at authorization, your Info.plist keys or the HealthKit capability.",
    "body": "Your HealthKit query runs, throws no error, and returns an empty array. Here is the single most important thing to know: **HealthKit cannot tell you that a read was denied — a blocked read returns the exact same empty result as a type that genuinely has no samples** (apart from samples your own app saved). Apple hides read-authorization state on purpose, so \"permission denied\" and \"no data\" are indistinguishable from your code. The fastest way forward is to stop trusting the empty result and isolate the cause with a write-then-read test, because write status *is* observable.\n\n## Why an empty read is ambiguous by design\n\nApple deliberately withholds read-permission status to avoid leaking that sensitive health data exists. From Apple's authorization docs: to help prevent leaks of sensitive health information, your app cannot determine whether the user granted permission to read data. The practical consequence:\n\n- `authorizationStatus(for:)` reports the **share (write)** side truthfully — `.notDetermined`, `.sharingDenied`, or `.sharingAuthorized`.\n- It tells you **nothing about read** access. A query against a type the user blocked returns the same empty array as a type with zero samples.\n- One asymmetry matters for debugging: without read permission, Apple says \"your app will receive only the data that it has written to HealthKit.\" Your own samples always come back.\n\nSo the empty result is not your bug report. You have to infer the cause by ruling out plumbing and then using the write side (which you *can* observe) as a proxy.\n\n## Most likely causes (ranked)\n\n1. **Read permission was denied** — the hardest cause to see, because it is invisible by design. Isolate it with the write-then-read test below.\n2. **Missing Info.plist usage-description keys** — reading requires `NSHealthShareUsageDescription`; writing requires `NSHealthUpdateUsageDescription`. Apple says a missing key crashes the app at the authorization request, so data never flows.\n3. **HealthKit capability not enabled** — Apple: \"To enable your app to access the user's HealthKit store, you must add the HealthKit capability\" (which adds the `com.apple.developer.healthkit` entitlement).\n4. **No store, or no data, where you are testing** — HealthKit data isn't available on iPadOS 16 and earlier or on macOS, where `isHealthDataAvailable()` returns false; and an empty Simulator or test-device store says nothing about a real user's data. Apple also says background queries aren't supported in the Simulator.\n5. **The user genuinely has no data for that type** — no source app or device ever wrote that quantity or category type (e.g., no VO2 max, no blood glucose).\n6. **A limited history window** — Apple's authorization flow lets a person grant access to only a recent window of their history; older samples then don't come back. From iOS 27, `earliestAuthorizedSampleDate(for:)` tells you where that window starts.\n7. **Background delivery not set up** — for live updates you need `enableBackgroundDelivery(for:frequency:)`, an `HKObserverQuery`, and the background-delivery entitlement; without them data looks stale or empty.\n8. **Wrong date range or predicate** — a query predicate whose `startDate…endDate` misses the samples (time-zone bugs, `Date()` boundaries, `.strictStartDate`) returns empty even though data exists.\n\n## How to fix it\n\n### Step 1 — Confirm the plumbing is alive\n\nBefore anything else, verify HealthKit can run at all:\n\n```swift\nguard HKHealthStore.isHealthDataAvailable() else {\n    // No HealthKit store on this device (e.g. iPadOS 16 or earlier, or macOS)\n    return\n}\n```\n\nIf this returns `false`, stop — Apple says other HealthKit methods then fail with `errorHealthDataUnavailable` (or `errorHealthDataRestricted` where HealthKit is restricted, for example in an enterprise environment), so no query will work. Also confirm the **HealthKit capability** is added in Signing & Capabilities and the entitlement is present in the signed build.\n\n### Step 2 — Verify both Info.plist keys exist\n\nReads need `NSHealthShareUsageDescription`; writes need `NSHealthUpdateUsageDescription` (Xcode labels these \"Privacy - Health Share Usage Description\" and \"Privacy - Health Update Usage Description\"). Apple's `requestAuthorization` reference is blunt: \"You must set the usage keys, or your app will crash when you request authorization.\" Grep the built app's `Info.plist` for both strings; if the key you need is absent, no data ever arrives.\n\n### Step 3 — Check the WRITE status (the observable half)\n\nYou cannot query read status, but if you asked to *share* (write) the type, the share side shows whether the user has answered:\n\n```swift\nlet type = HKQuantityType(.stepCount)\nswitch healthStore.authorizationStatus(for: type) {\ncase .notDetermined:\n    // Share access was never requested for this type — request it first\n    break\ncase .sharingDenied:\n    // Write is denied. This says NOTHING about read: read and write authorization\n    // are independent, and read state is invisible by design (see below).\n    break\ncase .sharingAuthorized:\n    // Write allowed — proceed to the write-then-read test\n    break\n@unknown default:\n    break\n}\n```\n\n`.notDetermined` means you have never requested share permission for this type. That is expected if you only asked to read it — include the type in `toShare` when you call `requestAuthorization(toShare:read:)` if you want this check, and the write-then-read test below, to work.\n\n### Step 4 — Isolate read-denial with a write-then-read test\n\nThis is the core diagnostic. Because write status is observable, writing a throwaway sample and immediately reading it back tells you exactly where the failure is. Write a sample of the target type with `HKHealthStore.save(_:)`, then run an `HKSampleQuery` for that same type:\n\n- **The sample round-trips back** — your auth, capability, and query are all correctly wired. The original emptiness is a **denied read** on the real data, a **limited history window**, or the **user genuinely has no data**. Ask the user to check your app's access in the Settings app or the Health app — Apple says a person can change your app's permissions at any time in either.\n- **The write succeeds but reading that same sample back returns empty** — this is *not* read denial: Apple says an app without read permission still receives the data it saved itself. Suspect the query (predicate, date range, or anchor) and move to Step 5.\n- **The write itself fails** — read the error: Apple documents `errorAuthorizationNotDetermined` when you never requested share permission for the type and `errorAuthorizationDenied` when the user denied it; otherwise go back over the capability and Info.plist (Steps 1–3).\n\n### Step 5 — Widen the predicate to rule out a query bug\n\nTemporarily remove the filter to see whether the data exists at all:\n\n```swift\nlet query = HKSampleQuery(\n    sampleType: HKQuantityType(.stepCount),\n    predicate: nil,               // no date filter at all\n    limit: HKObjectQueryNoLimit,\n    sortDescriptors: nil\n) { _, samples, error in\n    // If samples appear here but not with your real predicate,\n    // the date range / options were the bug.\n}\n```\n\nIf data appears with `predicate: nil` but not with your real predicate, the bug is your `startDate…endDate`, `HKQueryOptions` (e.g. `.strictStartDate`), or an anchored-query anchor — not permissions. On iOS 27 and later, also compare your start date with `earliestAuthorizedSampleDate(for:)`: Apple says to treat data before a limited window's start as unknown, not absent.\n\n### Step 6 — Test on a real device with real data\n\nIf you are still empty on a **Simulator** or a fresh test device, treat it as inconclusive — an empty store there says nothing about a real user's data. Install the app on a physical device that has samples for that type (Apple notes people can view and manage all of their data in the Health app, so confirm the type has data there), then re-run Steps 4–5. Test background delivery on a device too: Apple says background queries aren't supported in the Simulator.\n\n### Step 7 — For live updates, wire background delivery\n\nIf the initial read works but data never refreshes while backgrounded, you are missing the update path: call `enableBackgroundDelivery(for:frequency:)`, register an `HKObserverQuery`, and add the `com.apple.developer.healthkit.background-delivery` entitlement. Verify `enableBackgroundDelivery` completed without error — on iOS 15 and later Apple says it fails with `errorAuthorizationDenied` when the entitlement is missing — and that the observer's completion handler is actually being called.\n\n## Still stuck? Quick triage checklist\n\n- `HKHealthStore.isHealthDataAvailable()` returns `true`?\n- HealthKit capability + entitlement in the signed build?\n- Both `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` in `Info.plist`?\n- `authorizationStatus(for:)` on the share side is `.sharingAuthorized` (proves you requested share access and the user allowed it)?\n- Write-then-read round-trips? If yes, the remaining empty read is a denied read, a limited history window, or genuinely no data — have the user check your app's access in Settings or the Health app.\n- On iOS 27 and later, does `earliestAuthorizedSampleDate(for:)` return a date after the samples you expect?\n- Data visible for that exact type in the Health app on a **real device**?\n- Predicate widened to `nil` still empty? Then it is permission, a limited window, or no data — not the query.\n\nRemember the load-bearing rule: an empty HealthKit read is never proof of anything by itself. Use the write side and a widened predicate to turn \"empty\" into an answer.\n\nFor the correct end-to-end setup, see the [HealthKit integration guide](/integrate/healthkit). If you are still deciding between platforms or need to support Android too, compare [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect). Health Connect has a different failure mode — see [Health Connect no data](/fix/health-connect-no-data).",
    "faqs": [
      {
        "q": "Can I detect whether the user denied read access in HealthKit?",
        "a": "No. Apple deliberately hides read-authorization state to avoid leaking that health data exists, so authorizationStatus(for:) only reports the share/write side. A denied read returns the same empty result as a type with no data — except for samples your own app saved, which stay readable. Infer it with a write-then-read test."
      },
      {
        "q": "Why does authorizationStatus(for:) say authorized but my read is still empty?",
        "a": "That status reflects write/share permission, not read. The user can allow writing while blocking reading, and HealthKit will not tell you. Confirm real data exists in the Health app and use a widened predicate to rule out a query bug."
      },
      {
        "q": "Does HealthKit work on the iOS Simulator?",
        "a": "Apple documents one hard limit: background queries aren't supported in the Simulator, so background delivery has to be tested on a device. For reads, an empty result in the Simulator cannot tell a bug from an empty store. Confirm on a real device that has samples for the type before concluding your code is wrong."
      },
      {
        "q": "My app crashes when I request HealthKit authorization. Why?",
        "a": "The most common cause is a missing Info.plist usage-description key: NSHealthShareUsageDescription for reads or NSHealthUpdateUsageDescription for writes. Add the relevant key and the crash at requestAuthorization goes away."
      },
      {
        "q": "How do I send the user to fix HealthKit read permissions?",
        "a": "You cannot toggle read access from code. Apple says a person can change your app's permissions at any time in the Settings app or the Health app, so point the user there; your app appears in the Health app's Sources list once it has requested authorization, even if the user allowed nothing."
      }
    ],
    "related": [
      {
        "href": "/fix/health-connect-no-data",
        "label": "Fix: Health Connect returns no data"
      },
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Get more field-tested HealthKit and wearable-data debugging playbooks delivered as we publish them."
    },
    "steps": [
      {
        "name": "Confirm HealthKit can run",
        "text": "Check that HKHealthStore.isHealthDataAvailable() returns true and that the HealthKit capability and its entitlement are in the signed build. If it returns false, no query will ever work."
      },
      {
        "name": "Verify both Info.plist usage-description keys",
        "text": "Reads require NSHealthShareUsageDescription and writes require NSHealthUpdateUsageDescription. A missing key crashes the app at the authorization request, so data never flows."
      },
      {
        "name": "Check the observable write status",
        "text": "If you requested share access for the type, call authorizationStatus(for:) on it. It reports write status truthfully and shows whether the user has answered, even though it tells you nothing about read access."
      },
      {
        "name": "Run a write-then-read test",
        "text": "Save a throwaway sample of the target type, then query it back. If it round-trips, the empty read is a denied read, a limited history window or genuinely no data; if the write succeeds but the read-back is empty, fix the query, since your own samples stay readable; if the write fails, read its error."
      },
      {
        "name": "Widen the predicate",
        "text": "Re-run the query with predicate set to nil to remove the date filter. If data appears, the bug is your date range or query options, not permissions."
      },
      {
        "name": "Test on a real device",
        "text": "Treat empty results on a Simulator or fresh test device as inconclusive and run on a physical device that has samples for that type. Test background delivery on a device too, since Apple says the Simulator doesn't support background queries."
      },
      {
        "name": "Wire background delivery for live updates",
        "text": "If the first read works but data never refreshes, add the background-delivery entitlement, call enableBackgroundDelivery(for:frequency:), and register an HKObserverQuery."
      }
    ],
    "sources": [
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/authorizationstatus(for:)",
        "checked": "2026-10-02",
        "note": "read permission hidden; denied reads look empty; share permission without read shows only your own data"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkauthorizationstatus",
        "checked": "2026-10-02",
        "note": "notDetermined, sharingDenied, sharingAuthorized; \"only the data that it has written\" quote"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data",
        "checked": "2026-10-02",
        "note": "limited history window; permissions changeable in Settings or Health; Sources tab"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/earliestauthorizedsampledate(for:)",
        "checked": "2026-10-02",
        "note": "iOS 27+ limited-window date; treat earlier data as unknown"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/setting-up-healthkit",
        "checked": "2026-10-02",
        "note": "isHealthDataAvailable and the errors other methods return"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/ishealthdataavailable()",
        "checked": "2026-10-02",
        "note": "no HealthKit data on iPadOS 16 and earlier or macOS"
      },
      {
        "url": "https://developer.apple.com/documentation/xcode/configuring-healthkit-access",
        "checked": "2026-10-02",
        "note": "capability requirement; Xcode names of the purpose-string keys"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/requestauthorization(toshare:read:)",
        "checked": "2026-10-02",
        "note": "crash without usage keys"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/save(_:withcompletion:)-6fmtg",
        "checked": "2026-10-02",
        "note": "save errors: errorAuthorizationNotDetermined, errorAuthorizationDenied"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkerror/code/errorauthorizationdenied",
        "checked": "2026-10-02",
        "note": "save-only error; unauthorized apps still receive their own data"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hksamplequery/init(sampletype:predicate:limit:sortdescriptors:resultshandler:)",
        "checked": "2026-10-02",
        "note": "nil predicate returns all samples; HKObjectQueryNoLimit"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkqueryoptions",
        "checked": "2026-10-02",
        "note": "strictStartDate and strictEndDate"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:)",
        "checked": "2026-10-02",
        "note": "entitlement requirement; no background queries in the Simulator"
      },
      {
        "url": "https://developer.apple.com/documentation/healthkit",
        "checked": "2026-10-02",
        "note": "users view and manage all their data in the Health app"
      }
    ]
  },
  {
    "slug": "health-connect-no-data",
    "primaryQuery": "health connect returns no data",
    "h1": "Why Is Google Health Connect Returning No Data?",
    "metaTitle": "Health Connect Returns No Data? Causes & Fixes",
    "metaDescription": "Health Connect readRecords returns empty? Check for a writer app, per-type read permission, getSdkStatus, the 30-day history cap, and Play declarations.",
    "updated": "2026-10-02",
    "answer": "The first thing to check when Google Health Connect returns no data is whether anything writes that record type: Health Connect is an on-device store, not a data source, so another app — or, for steps, distance and active calories, Health Connect's own on-device tracking — must populate it first. Open Health Connect's Data and access screen and confirm the exact type you read has entries. If it does, check that your per-type read permission was actually granted (a SecurityException means it was not), that getSdkStatus returns SDK_AVAILABLE, and that the rows you want are not older than the default window of 30 days before your first grant, which needs PERMISSION_READ_HEALTH_DATA_HISTORY.",
    "body": "Your Android app calls `HealthConnectClient.readRecords(...)`, gets no error worth acting on, and the list comes back empty. The first suspect is not your code at all: **no source app is writing that record type into Health Connect**, so there is genuinely nothing to read. Health Connect is an on-device *store*, not a data source — something has to populate it first: another app, or for steps, distance and active calories burned, Health Connect's own on-device tracking. The quick check: open Health Connect, go to **Data and access**, and confirm the exact type you are reading has entries; **App permissions** shows which apps are connected.\n\nIf a writer exists and reads are still empty, work down the ranked causes below. The other frequent culprits are a per-type read permission you never actually got granted (which can surface as a `SecurityException`), Health Connect not being available on the device (`getSdkStatus` is not `SDK_AVAILABLE`), and the default 30-day history window hiding older data. For the iOS equivalent of this problem, see [HealthKit returns no data](/fix/healthkit-no-data); to re-check your setup end to end, use the [Google Health Connect integration guide](/integrate/google-health-connect).\n\n> **Version note.** API names below (`HealthConnectClient`, `getSdkStatus`, `getGrantedPermissions`, `TimeRangeFilter`, `PERMISSION_READ_HEALTH_DATA_HISTORY`) match Android's Health Connect Jetpack reference as checked on October 2, 2026; Google announces the 1.1.0 library as stable. Play Console policy specifics change more often than the API — re-check them against Google's publishing guide before you ship.\n\n## Most likely causes (ranked)\n\n1. **No source/provider app is writing that record type.** Health Connect is empty until an app writes into it. Perfect code plus perfect permissions still returns nothing if no writer exists for that type.\n2. **The per-type read permission was never granted.** Permissions are granular per record type and per direction (read vs write). Google lists `SecurityException` as the exception for a request that needs a permission you were not granted — easy to miss if a broad `catch` swallows it.\n3. **Health Connect is not available (`getSdkStatus` is not `SDK_AVAILABLE`).** If the SDK reports unavailable or \"provider update required,\" you cannot read anything.\n4. **The default history window.** Without `PERMISSION_READ_HEALTH_DATA_HISTORY` you see data from up to 30 days *before your first permission grant* onward — not a rolling last 30 days — so older records simply do not come back.\n5. **A missing Play Console Health apps declaration.** Google says a Play-published app that never declared its Health Connect data types can't get access: its users see an error dialog when they try to link it with Health Connect.\n6. **A work profile.** Google says Health Connect is not supported in work profiles: permissions may appear grantable, but the APIs are not usable and no data is written there.\n\n## Step 1: Confirm an app is actually writing that record type\n\nBefore debugging code, rule out the boring answer. On the device, open **Health Connect**. On Android 14 and later it is part of the system and opens from Settings (under Security & privacy; searching Settings for \"Health Connect\" is the reliable route, since the menu path varies); on Android 13 and lower it is Settings → Apps → Health Connect. Then choose **Data and access**, the category (steps, heart rate, sleep, etc.), the data type, and **See all entries**. If no entries appear there, no reader can ever return data.\n\nFix: install or enable an app that writes that type, and confirm data lands in the Health Connect data browser before you touch your app again. Health Connect generates steps, distance and active calories burned itself from device sensors — but Google says it starts tracking a type only once some app has been granted read permission for it, and users can switch built-in tracking off per type in Health Connect settings. Native step counting needs Android 14 with SDK extension 20 or later, and Google says those steps are batched to the database no more often than once a minute. Since the June 2026 Health Connect update, those on-device steps are attributed to a device-specific synthetic package name rather than `android`, so a `dataOriginFilter` on `android` alone misses recent ones; Google's read-data guide shows how to get the current device's name with `getCurrentDeviceDataSource()`. This is the same class of bug as an empty HealthKit store on iOS ([HealthKit no data](/fix/healthkit-no-data)): the platform is a store first, and its built-in tracking covers only steps, distance and active calories.\n\n## Step 2: Verify Health Connect is available with getSdkStatus\n\nEvery Health Connect call assumes the platform is present and usable. Call `HealthConnectClient.getSdkStatus(context)` first and branch on the result — anything other than `SDK_AVAILABLE` means you cannot read.\n\n```kotlin\nwhen (HealthConnectClient.getSdkStatus(context)) {\n    HealthConnectClient.SDK_AVAILABLE -> {\n        val client = HealthConnectClient.getOrCreate(context)\n        // proceed with reads\n    }\n    HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> {\n        // send the user to update Health Connect\n    }\n    else -> {\n        // SDK_UNAVAILABLE — Health Connect not usable on this device\n    }\n}\n```\n\nIf you skip this check you may be calling into a client that will never return data. On Android 13 and lower Health Connect is a Google Play app rather than part of the system, and Google says it needs Android 9 or later with Google Play services, so treat \"not available\" as a real, common state and route the user to install or update it.\n\n## Step 3: Check the read permission is granted (not just declared)\n\nDeclaring a permission in the manifest is not the same as having it granted at runtime. Read the currently granted set and confirm the exact per-type read permission is present.\n\n```kotlin\nval granted = client.permissionController.getGrantedPermissions()\nval stepsRead = HealthPermission.getReadPermission(StepsRecord::class)\n\nif (stepsRead !in granted) {\n    // permission not granted — launch your permission request flow.\n    // Reading now would throw SecurityException.\n}\n```\n\nIf `getGrantedPermissions()` does not contain `HealthPermission.getReadPermission(<Record>::class)` for the type you are reading, request it. A `SecurityException` on the read is the tell that the permission is either declared-but-not-granted or not declared at all. Remember: **uninstalling your app revokes all its Health Connect permissions**, so a fresh install starts from zero.\n\n## Step 4: Widen the TimeRangeFilter and rule out the 30-day history cap\n\nIf recent data appears but older data is empty (or errors), you are hitting the history window. By default an app can read data from up to 30 days before any permission was first granted. On Android 14+ there is no historical limit reading your *own* app's data, but a 30-day limit reading *other apps'* data; on Android 13 and lower the 30-day limit applies to reading any data.\n\nFirst widen the filter to prove the query itself is not the problem:\n\n```kotlin\nval response = client.readRecords(\n    ReadRecordsRequest(\n        recordType = StepsRecord::class,\n        timeRangeFilter = TimeRangeFilter.between(\n            Instant.now().minus(365, ChronoUnit.DAYS), // wide window: does ANY data appear?\n            Instant.now()\n        )\n    )\n)\n```\n\nIf recent records come back but nothing from earlier than 30 days before your first grant ever does, that is the history window, not a bug. Without `PERMISSION_READ_HEALTH_DATA_HISTORY`, Android's Jetpack reference says reading a single older record by ID (`readRecord`) throws, while `readRecords`, `aggregate` and the other reads just leave the older data points out — so a wide `readRecords` query returns the recent data and silently stops at the window instead of failing. Declare and request the permission to read further back. Note the window **resets from the reinstall date** if the user reinstalls your app.\n\n## Step 5: Confirm the Play Console health-data declaration for production\n\nGoogle's publishing guide describes one failure that only shows up in production: if your app is published on Google Play and released to the public without declaring its Health Connect data types, its users get an error dialog when they try to link it with Health Connect. Every app that uses Health Connect fills in the **Health apps declaration** in the Play Console, justifying each data type, and files it again whenever the set of types changes — listing every type still in use, not just the new ones.\n\nConfirm the declaration covers every type your release reads. If a type works in a local build but users of the Play release can't connect, suspect the declaration rather than your code. *(Checked against Google's publishing guide, last revised March 10, 2026 — Play policy changes, so re-check before you ship.)*\n\n## Still stuck? Diagnostic checklist\n\nRun these in order — each rules out one ranked cause:\n\n1. **Is anything writing the type?** Health Connect UI → Data and access → the specific category shows samples. If empty, install a writer (Step 1).\n2. **Is Health Connect available?** `getSdkStatus(context)` returns `SDK_AVAILABLE`, and the app is not running in a work profile (Step 2).\n3. **Is the read permission granted?** `getGrantedPermissions()` contains `HealthPermission.getReadPermission(<Record>::class)`; no `SecurityException` on read (Step 3).\n4. **Is it just old data?** Records stop at 30 days before your first grant, however wide the `TimeRangeFilter` → request `PERMISSION_READ_HEALTH_DATA_HISTORY` (Step 4).\n5. **Is production gated?** The type works in a local build but Play users can't connect → check the Health apps declaration (Step 5).\n\nIf all five pass and reads are still empty, capture the exact record type, the `TimeRangeFilter` bounds, the granted-permission set, and any `SecurityException` stack trace before escalating. For a clean-slate re-check of the whole flow, walk back through the [Google Health Connect integration guide](/integrate/google-health-connect); if you also ship on iOS, the [HealthKit no-data guide](/fix/healthkit-no-data) covers the Apple-side equivalents.",
    "faqs": [
      {
        "q": "Why is Health Connect empty when my code has no errors?",
        "a": "Because Health Connect is an on-device store, not a data source. If no app has written the record type you are reading, a correct query with correct permissions still returns an empty list. Open the Health Connect UI, go to Data and access, and confirm at least one app is writing that exact type before you keep debugging your code."
      },
      {
        "q": "What causes a SecurityException when reading from Health Connect?",
        "a": "A SecurityException on a read almost always means the per-type read permission is either declared in the manifest but not granted at runtime, or not declared at all. Call getGrantedPermissions and confirm it contains HealthPermission.getReadPermission for the record class you are reading, then run your permission request flow. Note that uninstalling your app revokes all its Health Connect permissions."
      },
      {
        "q": "Why can I only read the last 30 days of data?",
        "a": "Because by default an app sees Health Connect data from up to 30 days before its first permission grant — which on a fresh install looks like \"the last 30 days\". On Android 14 and later there is no limit reading your own app's data but the 30-day limit applies to other apps' data; on Android 13 and lower it applies to any data. To read older records, declare and request PERMISSION_READ_HEALTH_DATA_HISTORY. Without it, Android's Jetpack reference says reading a single older record by ID errors, while other reads quietly leave the older data points out."
      },
      {
        "q": "What does getSdkStatus tell me?",
        "a": "getSdkStatus reports whether Health Connect is usable on the device. SDK_AVAILABLE means you can proceed; SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED means the user must update Health Connect; and SDK_UNAVAILABLE means it is not usable on that device. On Android 13 and lower Health Connect is a separate Google Play app rather than part of the system, so treat unavailable as a common, real state and prompt install or update."
      },
      {
        "q": "Does a production build behave differently from my dev build?",
        "a": "It can. Google's publishing guide says that if an app is published on Google Play without declaring its Health Connect data types in the Play Console Health apps declaration, its users get an error dialog when they try to link it with Health Connect. If a type reads fine in a local build but Play users cannot connect, check that declaration before your code — and remember to refile it whenever the set of data types you use changes."
      }
    ],
    "related": [
      {
        "href": "/error-codes/health-connect",
        "label": "Health Connect error codes"
      },
      {
        "href": "/fix/healthkit-no-data",
        "label": "Fix: HealthKit returns no data"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/fix/health-connect-securityexception",
        "label": "Fix: Health Connect SecurityException"
      },
      {
        "href": "/fix/health-connect-not-available",
        "label": "Fix: SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED"
      },
      {
        "href": "/fix/health-connect-changes-token-expired",
        "label": "Fix: Health Connect changesTokenExpired"
      },
      {
        "href": "/fix/health-connect-rate-limit",
        "label": "Fix: Health Connect ERROR_RATE_LIMIT_EXCEEDED"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "We break down on-device health stores and wearable APIs every week; join the newsletter to wire Health Connect and motion tracking into your Android app without the empty-data surprises."
    },
    "steps": [
      {
        "name": "Confirm an app is writing that record type",
        "text": "Health Connect is a store, not a sensor hub: apart from its own tracking of steps, distance and active calories, it stays empty until a source app writes into it. Open Health Connect, choose Data and access, and confirm the exact type you are reading has entries before debugging code."
      },
      {
        "name": "Verify availability with getSdkStatus",
        "text": "Call getSdkStatus before any read and branch on the result. Anything other than SDK_AVAILABLE, such as provider update required or unavailable, means you cannot read and should route the user to install or update Health Connect."
      },
      {
        "name": "Check the read permission is granted, not just declared",
        "text": "Declaring a permission in the manifest is not the same as it being granted. Call getGrantedPermissions and confirm the per-type read permission is present, since a missing grant returns empty or throws a SecurityException on the read."
      },
      {
        "name": "Widen the TimeRangeFilter and rule out the 30-day cap",
        "text": "If recent data appears but nothing from more than 30 days before your first grant does, you are hitting the default history window. Widen the TimeRangeFilter to test, then request PERMISSION_READ_HEALTH_DATA_HISTORY to read further back."
      },
      {
        "name": "Confirm the Play Console Health apps declaration",
        "text": "A Play-published app that never declared its Health Connect data types cannot connect: its users see an error dialog when linking. If a type reads in a local build but Play users cannot connect, check the declaration for that release rather than your code."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/get-started",
        "checked": "2026-10-02",
        "note": "Health Connect's location by Android version, getSdkStatus and permission-request samples"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/availability",
        "checked": "2026-10-02",
        "note": "Android 9+ with Google Play services; not supported in work profiles"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/test/test-cases",
        "checked": "2026-10-02",
        "note": "Data and access and App permissions screens, See all entries"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/read-data",
        "checked": "2026-10-02",
        "note": "on-device step counting, its READ_STEPS trigger and per-minute batching, June 2026 attribution change, 30-day rules, reinstall reset, exceptions table"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/native-tracking",
        "checked": "2026-10-02",
        "note": "built-in tracking of steps, distance and active calories; starts only after a read grant; user can disable it"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission",
        "checked": "2026-10-02",
        "note": "readRecord errors vs other reads omitting data without the history permission"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient",
        "checked": "2026-10-02",
        "note": "SDK_AVAILABLE, SDK_UNAVAILABLE and SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/PermissionController",
        "checked": "2026-10-02",
        "note": "getGrantedPermissions"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/publish",
        "checked": "2026-10-02",
        "note": "Health apps declaration, refiling, the error dialog for undeclared types"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/guides/health-connect",
        "checked": "2026-10-02",
        "note": "Jetpack library 1.1.0 stable"
      }
    ]
  },
  {
    "slug": "strava-webhook-not-firing",
    "primaryQuery": "strava webhook not firing",
    "h1": "Why Is My Strava Webhook Not Firing?",
    "metaTitle": "Fix: Strava Webhook Not Firing (5 Ranked Causes)",
    "metaDescription": "Strava webhook not firing? Usually the subscription was never created because the validation handshake failed. How to verify it exists and fix it.",
    "updated": "2026-07-09",
    "answer": "The most common reason a Strava webhook never fires is that the subscription was never created: creating one is a two-step handshake, and if your callback fails to echo the hub.challenge as JSON with HTTP 200 within about two seconds, Strava silently abandons it. First confirm a subscription actually exists by calling GET push_subscriptions with your client_id and client_secret; an empty array means nothing will ever fire. Then make sure your callback is a public HTTPS URL that answers the validation GET correctly, and remember only one subscription is allowed per application.",
    "body": "Your Strava webhook isn't firing, and the most likely reason is the one that's easiest to miss: the subscription was never created in the first place. Creating a subscription is a two-step handshake, and if the validation step failed, Strava silently gave up and no events will ever arrive. The fastest fix is to confirm a subscription actually exists, and if it doesn't, get your callback endpoint answering Strava's validation `GET` correctly.\n\nBelow are the causes ranked from most to least common, each with the concrete check and fix. If your problem is really that data shows up late rather than never, see [Wearable data delayed or missing](/fix/wearable-data-delayed). For the full happy-path setup, see the [Strava API integration guide](/integrate/strava-api).\n\n## Most likely causes, ranked\n\n1. **The subscription was never created** because the validation `GET` handshake failed — your callback didn't echo `hub.challenge` as JSON with HTTP 200 within ~2 seconds.\n2. **Your callback isn't a public HTTPS URL.** `localhost`, private IPs, and self-signed certs won't validate.\n3. **A stale subscription owns the only slot.** Strava allows exactly one subscription per application, so a second create silently fails.\n4. **Events *are* firing** — but they're lightweight pointers, and your handler crashes trying to read activity fields that aren't in the payload.\n5. **Private activities are invisible** because the athlete granted `activity:read` instead of `activity:read_all`.\n\n## Step 1: Confirm a subscription actually exists\n\nBefore debugging anything else, ask Strava whether your app even has a subscription. View the current one for your application:\n\n```bash\ncurl -G https://www.strava.com/api/v3/push_subscriptions \\\n  -d client_id=YOUR_CLIENT_ID \\\n  -d client_secret=YOUR_CLIENT_SECRET\n```\n\nAn empty array (`[]`) means no subscription exists, so nothing will ever fire — go to Step 2. If a subscription is returned, note its `id` and `callback_url`; if that URL is stale or wrong, jump to Step 4 to delete and recreate it.\n\n## Step 2: Answer the validation handshake correctly\n\nCreating a subscription is a **two-step handshake**. You `POST` to request it, and Strava then immediately issues a `GET` to your `callback_url` to validate it. If that `GET` isn't answered correctly, the subscription is never created.\n\nStep 2a — request the subscription:\n\n```bash\ncurl -X POST https://www.strava.com/api/v3/push_subscriptions \\\n  -F client_id=YOUR_CLIENT_ID \\\n  -F client_secret=YOUR_CLIENT_SECRET \\\n  -F callback_url=https://example.com/webhook \\\n  -F verify_token=STRAVA\n```\n\nStep 2b — Strava calls your callback with a validation `GET`, for example:\n\n```http\nGET https://example.com/webhook?hub.verify_token=STRAVA&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.mode=subscribe\n```\n\nYour endpoint must, within **two seconds**, return HTTP **200** and echo `hub.challenge` back as `application/json`:\n\n```json\n{ \"hub.challenge\": \"15f7d1a91c1f40f8a748fd134752feb3\" }\n```\n\nPer Strava's docs, the most common reason a subscription fails to be created is a failure to respond to this validation `GET` in a timely manner, or failing to echo the `hub.challenge` field correctly. A minimal handler looks like this:\n\n```ts\n// GET /webhook — Strava's subscription validation\napp.get(\"/webhook\", (req, res) => {\n  const mode = req.query[\"hub.mode\"];\n  const token = req.query[\"hub.verify_token\"];\n  const challenge = req.query[\"hub.challenge\"];\n\n  // Optional but recommended: verify the token you sent on create\n  if (mode === \"subscribe\" && token === \"STRAVA\") {\n    // Echo the challenge back as JSON, status 200, fast — no heavy work here\n    return res.status(200).json({ \"hub.challenge\": challenge });\n  }\n  return res.sendStatus(403);\n});\n```\n\nHandshake checklist:\n\n- Endpoint returns **200** — not a `301`/`302` redirect, and not `401` behind auth middleware.\n- Body is exactly `{\"hub.challenge\": \"<value>\"}` with `Content-Type: application/json`.\n- The `hub.verify_token` matches the `verify_token` you sent on create.\n- The handler is **fast** (under 2 seconds) — do no database or network work in the validation path.\n\n## Step 3: Make sure the callback is public HTTPS\n\nThe callback URL must be **publicly reachable over HTTPS**. `localhost`, private/internal IPs, and untrusted or self-signed certificates will not validate, so the handshake in Step 2 fails before your code ever runs. During development, expose a public HTTPS URL with a tunnel such as ngrok — this is exactly what Strava's own webhook example uses. Also confirm no WAF or auth middleware is silently blocking Strava's request.\n\n## Step 4: Free the single subscription slot\n\nEach application may have **only one subscription**, and that single subscription receives events for *all* athletes who authorized your app. A very common \"not firing\" story is: you spun up a new callback URL, tried to create a fresh subscription, and it failed because the old one still owns the slot. Delete the stale subscription (using its `id` from Step 1) to free the slot, then recreate with Step 2:\n\n```bash\ncurl -X DELETE \\\n  \"https://www.strava.com/api/v3/push_subscriptions/SUBSCRIPTION_ID?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET\"\n```\n\n## Step 5: Handle the event as a pointer, not the activity\n\nIf the subscription exists and validates but you still see \"nothing,\" the events may be arriving and your handler may be quietly crashing. Webhook payloads are small **notifications**, not the activity data. A `POST` to your callback looks like this:\n\n```json\n{\n  \"aspect_type\": \"create\",\n  \"event_time\": 1549560669,\n  \"object_id\": 1360128428,\n  \"object_type\": \"activity\",\n  \"owner_id\": 134815,\n  \"subscription_id\": 120475,\n  \"updates\": {}\n}\n```\n\nReturn **200 to Strava immediately**, then process asynchronously. To get the actual activity, call the REST API with that athlete's access token, for example `GET /activities/{object_id}` using `object_id` from the event. A handler that tries to read activity fields (distance, name, etc.) straight off the pointer, or whose follow-up fetch fails on an expired token, looks exactly like \"the webhook is broken.\" Add logging as close to the network edge as possible — an unhandled exception in payload processing is a frequent cause of \"missing updates.\"\n\n## Step 6: Grant `activity:read_all` for private activities\n\nIf a webhook fires but the follow-up fetch returns nothing (or 404s) specifically for private or hidden activities, the athlete most likely authorized only `activity:read`. **Private activities require the `activity:read_all` scope**, granted at OAuth time. Request it in your authorization URL and have affected athletes re-consent. (Verify current scope naming on the [Strava authentication docs](https://developers.strava.com/docs/authentication/).)\n\n## Still stuck? Diagnostic checklist\n\nRun these in order:\n\n- **Does a subscription exist?** `GET /push_subscriptions` (Step 1). Empty array = nothing will ever fire.\n- **Is the callback public HTTPS?** No `localhost`, no self-signed cert, no auth/WAF in front of it.\n- **Test reachability yourself.** Hit your callback with a `GET` carrying a fake `hub.challenge` — it should echo it. Then `POST` a sample event body — it should return 200. Strava's own advice is to `POST` to your callback manually and confirm a 200.\n- **Only one slot.** If create fails, delete the stale subscription first (Step 4).\n- **Log at the edge.** Confirm events aren't arriving and silently erroring in your handler.\n- **Check the scope.** Missing private activities usually means `activity:read` instead of `activity:read_all`.\n\nIf events are arriving but appear late rather than never, that's a different problem — see [Wearable data delayed or missing](/fix/wearable-data-delayed). For end-to-end setup including OAuth and scopes, see the [Strava API integration guide](/integrate/strava-api).",
    "faqs": [
      {
        "q": "How do I check whether my Strava webhook subscription actually exists?",
        "a": "Send a GET request to https://www.strava.com/api/v3/push_subscriptions with your client_id and client_secret. If it returns an empty array, no subscription exists and no events will ever fire, so you need to create one and pass the validation handshake."
      },
      {
        "q": "Why does creating my Strava subscription fail even though my server is running?",
        "a": "When you POST to create a subscription, Strava immediately issues a validation GET to your callback_url. If your endpoint does not return HTTP 200 and echo hub.challenge back as application/json within about two seconds, the subscription is never created. Localhost, self-signed certs, redirects, and auth middleware in front of the callback all cause this to fail."
      },
      {
        "q": "Can I have more than one Strava webhook subscription per app?",
        "a": "No. Each application may have only one subscription, and it receives events for all athletes who authorized the app. If you try to create a second one while a stale subscription still owns the slot, the create fails. Delete the old subscription first with DELETE push_subscriptions."
      },
      {
        "q": "The webhook fires but my code errors. Is the webhook broken?",
        "a": "Usually not. Strava events are lightweight pointers containing fields like object_id and owner_id, not the full activity. Return 200 immediately, then fetch the activity from the REST API using object_id and the athlete's token. A handler that crashes reading missing fields, or whose follow-up fetch fails on an expired token, looks like a webhook that isn't firing."
      },
      {
        "q": "Why can't I see private activities from the webhook?",
        "a": "Private and hidden activities require the activity:read_all scope, granted at OAuth time. If the athlete authorized only activity:read, your follow-up fetch returns nothing for those activities. Request activity:read_all and have the athlete re-consent. Verify current scope naming on the Strava authentication docs."
      }
    ],
    "related": [
      {
        "href": "/fix/wearable-data-delayed",
        "label": "Fix: wearable data missing or delayed"
      },
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Debugging wearable and activity webhooks all day? Get our field notes on Strava, Terra, and health-API integrations in your inbox."
    },
    "steps": [
      {
        "name": "Confirm a subscription exists",
        "text": "Call GET push_subscriptions with your client_id and client_secret. An empty array means no subscription exists and no events will ever fire, so you need to create one."
      },
      {
        "name": "Answer the validation handshake correctly",
        "text": "Creating a subscription triggers a validation GET to your callback. Your endpoint must return HTTP 200 and echo hub.challenge back as application/json within about two seconds, doing no heavy work in that path."
      },
      {
        "name": "Use a public HTTPS callback",
        "text": "The callback must be publicly reachable over HTTPS. Localhost, private IPs, and self-signed certificates fail validation, so expose a public HTTPS URL with a tunnel like ngrok during development."
      },
      {
        "name": "Free the single subscription slot",
        "text": "Each application may have only one subscription, so a stale one blocks a new create. Delete the old subscription with DELETE push_subscriptions using its id, then recreate it against your current callback."
      },
      {
        "name": "Handle events as pointers, not activities",
        "text": "Webhook payloads are lightweight notifications, not the activity data. Return 200 immediately, then fetch the activity from the REST API using object_id, so a crashing handler does not look like a webhook that never fired."
      },
      {
        "name": "Grant activity:read_all for private activities",
        "text": "If events fire but private activities return nothing, the athlete likely granted only activity:read. Request the activity:read_all scope at OAuth time and have affected athletes re-consent."
      }
    ]
  },
  {
    "slug": "wearable-data-delayed",
    "primaryQuery": "wearable data missing or delayed",
    "h1": "Why Is Wearable Data Missing or Delayed?",
    "metaTitle": "Why Is Wearable Data Missing or Delayed?",
    "metaDescription": "Wearable data is near-real-time, not instant. The usual cause: it hasn't synced device to phone to cloud yet, so no webhook can fire. Diagnose it fast.",
    "updated": "2026-07-09",
    "answer": "Wearable data is near-real-time, not instant. The most common reason it looks missing is that it hasn't finished syncing device to phone app to the provider cloud yet, and a webhook fires only after the cloud has the data. Have the user force a sync in the vendor app and confirm the reading shows in the vendor's own dashboard first. If you expected history, remember a new connection only yields data from connection-time forward unless you make an explicit backfill request.",
    "body": "Your webhook is quiet, or a workout the user just finished isn't in your API yet — and nothing is technically broken. The single most common cause: **the data hasn't finished syncing yet.** A reading has to travel device to phone app to the provider's cloud before any webhook can fire, and each hop runs on its own schedule. Wearable pipelines are **near-real-time, not instant** — set that expectation first, then work down the causes below.\n\n## Set expectations: the sync chain\n\nNew data does not appear the instant a rep, a heartbeat, or a run happens. It moves through four stages, and a webhook to you fires only at the very end:\n\n```\ndevice (watch/ring)  →  phone app (vendor)  →  provider cloud  →  webhook  →  you\n```\n\n- **Device to phone:** the watch or ring syncs over Bluetooth on its own schedule — often every few minutes to hourly, and sometimes only when the vendor app is opened.\n- **Phone to cloud:** the vendor app uploads to the provider's cloud, again on its own cadence.\n- **Cloud to you:** only once the provider's cloud has the data does it push a webhook (or make it available to poll).\n\nSo a gap of minutes — occasionally longer — between \"the user did the thing\" and \"it's in my API\" is normal, not a bug. Rule that out before deep debugging. For the bigger picture of how these pipelines work, see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview.\n\n## Most likely causes (ranked)\n\n1. **The data hasn't synced device → phone → cloud yet.** The wearable syncs on its own schedule, and webhooks fire only *after* the provider's cloud has the data. This is the number-one cause of \"missing\" data.\n2. **You expected history but only get data from connection-time forward.** A new connection yields data only from that point onward unless you make an explicit historical/backfill request — and some providers only expose recent data.\n3. **A webhook delivery failed and was retried or dropped.** If your endpoint returned a non-2xx status or timed out, the event never landed. Make your handler idempotent and return 200 fast.\n4. **For an aggregator like Terra: the user connected but hasn't synced, or you never requested history.** \"Connected\" is not \"has data\" — the user still has to open the vendor app and sync, and prior history still needs a backfill call.\n\n## How to fix it\n\n### Step 1: Force a sync and confirm in the vendor's own dashboard\n\nHave the user open the vendor app (Garmin Connect, Fitbit, Oura, etc.) and force a sync — usually \"pull down to refresh.\" Then confirm the reading actually appears in the **vendor's own web dashboard or app** before blaming the API layer. If it isn't even in Garmin Connect, no API can have it yet.\n\nTerra states this plainly: *\"If the wearable hasn't synced to the respective app on the end user's phone, or if the app has not synced to the cloud, Terra will be unable to retrieve that data.\"* The same logic applies to every provider.\n\n### Step 2: Wait out normal latency before deep debugging\n\nIf the data is in the vendor dashboard but not yet in your API, give the pipeline a few minutes. Near-real-time means the cloud-to-you push has its own small delay. Rule this out first — a surprising share of \"missing data\" reports are just impatience with a normal source-side lag.\n\n### Step 3: Request historical data explicitly (don't assume backfill)\n\nBy default a **new connection only yields data from the connection point forward.** To build a historical profile you must make an explicit backfill request, and how far back you can go is provider-dependent. With Terra, request a date range on the REST endpoint:\n\n```bash\ncurl --request GET \\\n  --url 'https://api.tryterra.co/v2/activity?user_id=USER_ID&start_date=2026-05-01&end_date=2026-06-30&to_webhook=true' \\\n  --header 'dev-id: YOUR_DEV_ID' \\\n  --header 'x-api-key: YOUR_API_KEY'\n```\n\nNote Terra's **28-day async rule**: for ranges longer than 28 days it sends the data asynchronously over your webhook even if `to_webhook` is false, because a large payload would otherwise hang the request. Match the `terra-reference` header on your request to the `terra-signature` on the eventual webhook to know the transfer completed. Verify the exact endpoint and params against the current Terra docs. See the [Terra integration guide](/integrate/terra-api) for the full setup.\n\n### Step 4: Make sure your webhook actually accepted the delivery\n\nIf your endpoint returns a non-2xx status or times out, the provider counts it as a delivery failure — some retry with backoff, some drop the event. In Terra these show up as **400 or 500 errors in Dashboard, then Payload History**. The fix is structural:\n\n- **Return 200 (or any 2xx) immediately,** then process asynchronously. A slow or erroring handler looks exactly like \"webhooks aren't firing.\"\n- **Make the handler idempotent** so retried deliveries don't double-insert.\n- Check that no auth middleware, WAF, or redirect (301/302) sits in front of the webhook path.\n\nThis is the same failure pattern behind Strava webhooks — see [Strava webhook not firing](/fix/strava-webhook-not-firing) for the handshake-and-handler details.\n\n### Step 5: For aggregators, isolate the connection from the delivery path\n\nIf a user is \"connected\" through an aggregator but you see no data, walk this Terra checklist to find where the break is:\n\n- **Not synced yet** — force a sync; confirm data in the vendor's own dashboard (Step 1).\n- **Wrong account** — the user may have authenticated a different or empty vendor account.\n- **Destination misconfigured** — missing dedicated credentials surface as 400/500 in Payload History.\n- **Force a backfill to isolate the fault** — in Terra, go to Dashboard, then Tools, then Debug, then Users, and request a backfill for that `user_id`. If data *does* come through this way, the connection is fine and your realtime webhook path is the problem. (Verify the menu path; this requires a recent Terra SDK.)\n\n## Still stuck? Quick triage\n\n- [ ] Is the reading in the **vendor's own app/dashboard**? If not, it's a sync issue, not an API issue.\n- [ ] Is the data **after** the user's connection date? Data before it needs an explicit backfill request.\n- [ ] Does your webhook return **2xx within a couple of seconds**, before doing any heavy work?\n- [ ] Is your handler **idempotent** so retries are safe?\n- [ ] Have you checked the provider's **payload/delivery history** for 4xx/5xx on your endpoint?\n- [ ] Have you simply **waited a few minutes** to rule out normal near-real-time latency?\n\nIf data flows on a manual backfill but never arrives in realtime, the connection is healthy and the problem is on the delivery path — focus there. For choosing between aggregators and direct integrations, see the [wearable data APIs](/fitness-apis/wearable-data-apis) guide.",
    "faqs": [
      {
        "q": "How long should wearable data take to appear?",
        "a": "There is no fixed guarantee, but it is near-real-time rather than instant. The device syncs to its phone app on its own schedule (often every few minutes to hourly, sometimes only when the app is opened), the app uploads to the vendor cloud, and only then does a webhook fire. A gap of minutes, occasionally longer, is normal."
      },
      {
        "q": "Why do I only get new data and none of the user's history?",
        "a": "By default a new connection only delivers data from the moment the user connected forward. Historical data before that point requires a separate, explicit backfill or historical-data request, and some providers limit how far back you can go, so check the provider's docs for the exact window."
      },
      {
        "q": "The user is connected in Terra but no data arrives. What's wrong?",
        "a": "Connected is not the same as has synced. Common causes are that the wearable hasn't synced yet, the user authenticated a different or empty vendor account, or your Destination is misconfigured (which shows as 400 or 500 in Terra's Payload History). Force a backfill for that user to isolate whether the connection or the realtime delivery is the problem."
      },
      {
        "q": "Could my webhook be dropping data?",
        "a": "Yes. If your endpoint returns a non-2xx status or times out, the provider treats it as a delivery failure and may retry with backoff or drop the event entirely. Return a 2xx quickly and process asynchronously, keep the handler idempotent for retries, and make sure no auth middleware, WAF, or redirect blocks the provider's requests."
      },
      {
        "q": "How do I tell a sync delay apart from a real webhook bug?",
        "a": "Check the vendor's own app or dashboard first. If the reading isn't even there, it's a sync issue and no API can have it yet. If it is there but not in your system after a few minutes, then look at delivery: check the provider's payload history for errors on your endpoint and confirm your handler returns 2xx fast."
      }
    ],
    "related": [
      {
        "href": "/fix/strava-webhook-not-firing",
        "label": "Fix: Strava webhook not firing"
      },
      {
        "href": "/integrate/terra-api",
        "label": "Integrate Terra"
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "label": "Best wearable data APIs"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Want the field-tested playbook for wearable sync, backfills, and idempotent webhooks? Get our developer newsletter."
    },
    "steps": [
      {
        "name": "Force a sync and confirm in the vendor dashboard",
        "text": "Have the user open the vendor app and force a sync, usually by pulling down to refresh. Confirm the reading appears in the vendor's own web dashboard before blaming the API layer, because if it isn't there yet, no API can have it."
      },
      {
        "name": "Wait out normal near-real-time latency",
        "text": "If the data is in the vendor dashboard but not yet in your API, give the pipeline a few minutes. The cloud-to-you push has its own small delay, and much reported missing data is just normal source-side lag."
      },
      {
        "name": "Request historical data explicitly",
        "text": "A new connection only yields data from the connection point forward. To get prior history you must make an explicit backfill request, and how far back you can go depends on the provider."
      },
      {
        "name": "Verify your webhook accepted the delivery",
        "text": "If your endpoint returns a non-2xx status or times out, the event is a delivery failure that providers may retry or drop. Return 200 immediately, process asynchronously, and check the provider's payload history for 4xx or 5xx on your endpoint."
      },
      {
        "name": "Make your handler idempotent",
        "text": "Providers retry failed deliveries, so a retried event can arrive more than once. Write your webhook handler so processing the same event twice does not double-insert or corrupt data."
      },
      {
        "name": "For aggregators, isolate connection from delivery",
        "text": "If a user is connected through an aggregator like Terra but no data arrives, force a manual backfill for that user. If data comes through that way, the connection is healthy and the realtime webhook path is the problem to focus on."
      }
    ]
  },
  {
    "slug": "garmin-api-approval",
    "primaryQuery": "garmin api access approval",
    "h1": "Can't Get Garmin API Access? Here's What's Going On",
    "metaTitle": "Can't Get Garmin API Access? What's Going On",
    "metaDescription": "Garmin's API is partner-approval-only, not self-serve, and new sign-ups are reportedly on hold in 2026. Apply, use an aggregator, or pick alternatives.",
    "updated": "2026-07-09",
    "answer": "If you can't find a way to sign up for Garmin API keys, you're not doing anything wrong. Garmin's Connect Developer Program is partner-approval-only, not self-serve, and as of 2026 new sign-ups are reportedly on hold, with the public request form removed and no published re-open date. Verify the live status on developer.garmin.com, and in the meantime pull Garmin data through an aggregator like Terra that already holds its own Garmin partner access.",
    "body": "If you filled out a form, emailed Garmin, or went looking for a \"sign up for API keys\" button and got nowhere, you are not doing anything wrong. Garmin's developer program is **partner-approval-only** (there is no self-serve key), and as of 2026 new sign-ups are **reportedly on hold** — the public access-request form appears to have been removed with no published re-open date. The quick unblock is to register your interest and, in the meantime, pull Garmin data through an aggregator that already holds Garmin partner access.\n\n## What's actually going on\n\nTwo separate things make Garmin access hard, and it helps to name both.\n\n**1. It was never self-serve.** Unlike Strava or Fitbit, where you register an app in a portal and immediately get a client ID and secret, Garmin's Health and Activity APIs require you to **apply and be approved as a Garmin partner**. Even in normal times there is no instant key — approval is a manual, business-level review that can take weeks.\n\n**2. New onboarding is reportedly paused as of 2026.** Multiple developer reports (Garmin's own forums and a public GitHub issue opened around mid-2026) describe the **access-request form being removed or \"under revision,\"** meaning new requests cannot be submitted at all, with **no published ETA**. Some describe the program as effectively offline for months, with support replying only \"wait until the form is back online.\" Existing approved partners are said to be unaffected — this looks like a pause on *new* onboarding, not a revocation of current access.\n\nBecause this status changes over time, **treat it as \"verify,\" not gospel.** Before you give up or tell a stakeholder Garmin is closed, load `https://developer.garmin.com/gc-developer-program/` and look for the access/request form yourself. If the form is present and accepting submissions, the pause has lifted.\n\n## Most likely reasons you're stuck\n\nRanked from most to least common:\n\n1. **You expected a self-serve key.** There isn't one, and there never was. You must apply for a partnership.\n2. **The request form is currently removed / paused.** You literally cannot submit right now, so no amount of retrying will work. This is on Garmin's side, not yours.\n3. **You applied and are waiting.** Manual partner review can take weeks; silence is normal, not a rejection.\n4. **You tried an unofficial/self-host route that still needs your own Garmin credentials** — which you can't obtain while the program is paused (the chicken-and-egg problem below).\n\n## How to unblock yourself\n\n### Step 1: Confirm the live status before anything else\n\nOpen `https://developer.garmin.com/gc-developer-program/` in a browser and check whether the access-request form is present and accepting submissions. Community reports go stale fast, so your own check is the source of truth. If the form is back, skip to Step 2. If it's gone or says \"under revision,\" the pause is real and you should plan around it (Steps 3-4).\n\n### Step 2: Apply / register interest and wait (the official path)\n\nIf the form is live, submit it — expect to describe your company, your app, and your intended use of the Health and/or Activity APIs. Then **wait for manual review**; there is no self-serve fallback and no guaranteed timeline, so budget weeks, not hours. If the form is currently removed, monitor the developer portal and the Garmin Forums for its return, and register interest through whatever contact channel is offered so you're in the queue when onboarding reopens.\n\n**Do not build against Garmin on the assumption you'll be approved.** Confirm access first.\n\n### Step 3: Consider an aggregator that already holds Garmin partner access\n\nThe standard unblock while direct access is gated is to go through a wearable-data aggregator that already has a Garmin partnership. Providers like **Terra** (and others such as Rook, Validic, Spike, or Vital) let the user link their Garmin account through the aggregator's auth widget; the aggregator handles OAuth and pushes normalized Garmin data to your webhook. Terra, for example, advertises Garmin connectivity described as **not requiring your own Garmin Developer Program approval** — verify each provider's current Garmin support and terms, since these change.\n\n**Watch for the chicken-and-egg trap.** Some open-source or self-host integrations still require **you** to supply your own Garmin API credentials — which you can't get while the program is paused. That path doesn't actually unblock you. Prefer an aggregator that uses its **own** approved Garmin credentials, so you never need Garmin's direct approval at all.\n\nFor the integration mechanics once you have access (direct or via aggregator), see the [Garmin API integration guide](/integrate/garmin-api).\n\n### Step 4: Consider alternative devices or ingestion routes for now\n\nIf you can't wait, you have honest fallbacks that don't depend on Garmin's cloud API:\n\n- **Read Garmin data from the phone's health store.** If a user's Garmin data lands in **Apple HealthKit** or **Google Health Connect**, you can read it on-device without Garmin's API. See the [Apple HealthKit integration guide](/integrate/healthkit) and the [Google Health Connect integration guide](/integrate/google-health-connect).\n- **Reach Garmin activities through Strava.** Once a user connects Garmin to Strava, many Garmin-originated activities re-sync into Strava, giving you that data through the Strava API you can actually get today.\n- **Accept `.fit` file uploads.** For one-off imports, let users upload Garmin `.fit` files (Garmin's open FIT SDK parses them) when live API access isn't available.\n- **Pick a self-serve ecosystem for launch.** Fitbit, Oura, and WHOOP are self-serve; compare Garmin against them in [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) before committing to the wait.\n\nDo **not** rely on unofficial or scraping Garmin Connect clients for production — Garmin has deployed TLS-fingerprinting that blocks third-party clients, and it violates their terms of service.\n\n## Still stuck? Quick triage\n\n- Loaded `developer.garmin.com/gc-developer-program/` and confirmed whether the request form exists right now? (This decides everything else.)\n- If the form is live: submitted it and set a realistic multi-week expectation for review?\n- If the form is gone: switched to an aggregator that supplies its **own** Garmin credentials (not one that asks you for keys you can't get)?\n- If you connected data but nothing arrives, the problem may be sync latency rather than access — see [wearable data delayed or missing](/fix/wearable-data-delayed).\n\nThe honest summary: \"I can't get Garmin access\" is frequently **not your fault** in 2026. Verify the live program status, apply if you can, bridge through an aggregator that holds its own Garmin partnership, and lean on HealthKit / Health Connect / Strava / FIT files in the meantime.",
    "faqs": [
      {
        "q": "Why can't I sign up for Garmin API keys?",
        "a": "Because Garmin's Connect Developer Program has never been self-serve, and as of 2026 new sign-ups are reportedly paused. The Health and Activity APIs require you to apply and be approved as a partner, and multiple developer reports say the public access-request form was removed with no published ETA. Verify the current status on developer.garmin.com before assuming it is closed."
      },
      {
        "q": "Is the Garmin developer program really closed to new applicants?",
        "a": "Reportedly yes for new onboarding as of 2026, but treat this as verify rather than certain. Developer forum posts and a public GitHub issue describe the request form being removed or under revision so new requests cannot be submitted. Existing approved partners are said to be unaffected. Load developer.garmin.com yourself, since the status can change."
      },
      {
        "q": "Can I use an aggregator like Terra to get Garmin data without approval?",
        "a": "Often yes. Aggregators such as Terra hold their own Garmin partnership and let users connect their Garmin account through the aggregator's flow, then push normalized data to your webhook. Terra advertises Garmin connectivity described as not requiring your own Garmin Developer Program approval. Watch out for open or self-host routes that still require you to supply your own Garmin credentials, which you cannot get while the program is paused. Verify each provider's current Garmin terms."
      },
      {
        "q": "What are my alternatives while Garmin access is blocked?",
        "a": "Read Garmin data from Apple HealthKit or Google Health Connect on the phone, pull Garmin activities that re-sync into Strava once a user connects Garmin to Strava, or accept user-uploaded FIT files via Garmin's open FIT SDK. For a launch that does not wait on Garmin, self-serve ecosystems like Fitbit, Oura, and WHOOP are available today."
      },
      {
        "q": "How long does Garmin approval take once the form is open?",
        "a": "Plan for weeks, not hours. Approval is a manual, partner-level business review with no guaranteed timeline, and there is no self-serve shortcut. Do not build against Garmin on the assumption you will be approved; confirm access first."
      }
    ],
    "related": [
      {
        "href": "/fix/wearable-data-delayed",
        "label": "Fix: wearable data missing or delayed"
      },
      {
        "href": "/integrate/garmin-api",
        "label": "Integrate the Garmin API"
      },
      {
        "href": "/fitness-apis/fitbit-api-vs-garmin-api",
        "label": "Fitbit API vs Garmin API"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "We track wearable API access changes every week, including whether Garmin's developer program has reopened and how the aggregator workarounds compare."
    },
    "steps": [
      {
        "name": "Confirm the live program status first",
        "text": "Open developer.garmin.com and check whether the access-request form is present and accepting submissions. Community reports go stale fast, so your own check decides everything else."
      },
      {
        "name": "Apply or register interest and wait",
        "text": "If the form is live, submit it and expect a manual partner review that can take weeks, since there is no self-serve fallback. If the form is currently removed, monitor the portal and forums for its return and register interest so you are in the queue."
      },
      {
        "name": "Use an aggregator that already holds Garmin access",
        "text": "An aggregator like Terra can broker Garmin data so users link their Garmin account through its widget. Prefer one that supplies its own approved Garmin credentials, not one that asks you for keys you cannot get while the program is paused."
      },
      {
        "name": "Consider alternative devices or ingestion routes",
        "text": "Read Garmin data from HealthKit or Google Health Connect on the phone, pull Garmin activities that re-sync into Strava, or accept user-uploaded FIT files. These avoid Garmin's gated cloud API entirely."
      },
      {
        "name": "Avoid unofficial clients and re-check periodically",
        "text": "Do not use scraping or unofficial Garmin Connect clients in production, since Garmin blocks them and it breaks their terms. Re-check the developer portal over time, because the pause on new onboarding may lift."
      }
    ]
  },
  {
    "slug": "google-fit-api-deprecated",
    "primaryQuery": "google fit api deprecated",
    "h1": "Google Fit API Is Deprecated — What to Use Instead",
    "metaTitle": "Google Fit API Deprecated: What to Use Instead",
    "metaDescription": "Google Fit APIs (including REST) lose support at the end of 2026. Here is what to migrate to: Health Connect, the Google Health API, or Health Services.",
    "updated": "2026-07-09",
    "answer": "The Google Fit API is deprecated: Google's Fit migration guide says the Fit APIs, including the REST API, will only be supported until the end of 2026, and no new developers have been able to sign up since May 1, 2024. There is no drop-in replacement, so you must migrate based on how you used Fit. On-device step reads move to Google Health Connect, cloud, account, and OAuth reads (the History and Session APIs) move to the Google Health API, Wear OS moves to Health Services, and the Goals API has no replacement. The guide describes end of support and gives no switch-off date, but new projects cannot onboard to Fit at all, so plan the move now.",
    "body": "You hit a deprecation notice on the Google Fit API — and it is real: **all Google Fit APIs, including the REST API, are supported only until the end of 2026**, and no new developers can even sign up (that door closed May 1, 2024). There is no drop-in replacement, so the fix is not a config change — it is a migration, and which target you move to depends entirely on how you were using Fit. The short version: **on-device reads go to Health Connect, cloud/account and OAuth reads go to the new Google Health API, and Wear OS goes to Health Services.**\n\n## The deprecation, stated plainly\n\nGoogle's [Fit migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) (updated September 10, 2026) puts it in one caution: *\"The Google Fit API (including the REST API) will only be supported until the end of 2026. We recommend migrating to the Google Health API for cloud-based integrations or Health Connect for step tracking and mobile-first apps.\"*\n\nThree facts you need to plan around:\n\n- **No new signups since May 1, 2024.** If you have an existing Fit project it keeps working for now, but you cannot onboard a *new* project to Fit at all. New apps must start on a successor.\n- **Support ends at the end of 2026.** That covers every Fit API surface, the Android SDK, the REST API, and the BLE APIs included. The guide describes end of support and states no switch-off date, so plan to be off Fit by then rather than betting on calls failing, or still working, on any particular day.\n- **There is no drop-in REST replacement.** The guide's own comparison shows the Google Health API using its own unified data types in place of Fit's com.google-prefixed types, with a Web application OAuth client. You will re-architect, not swap a base URL.\n\nBecause there is no shortcut, the useful move is to identify your usage pattern and start the correct migration now.\n\n## Most likely \"which path is mine?\" — ranked by how apps actually use Fit\n\nFigure out your bucket first; the rest of the guide follows from it.\n\n1. **On-device reads on Android** — you read steps, calories, or aggregated activity from the phone using the Fit Recording API or the on-device Android SDK. This is the most common case for mobile apps. **Move to Health Connect** (or the Recording API on mobile for plain step counts).\n2. **Cloud / account reads over OAuth** — you call the Fit REST API server-to-server, or use the History API / Sessions API to pull a user's cross-device history through their Google account. **Move to the Google Health API.**\n3. **Fitbit Web API integrations** — separate product, same destination: Google's guide lists the **Google Health API** as the recommended path for Fitbit Web API integrations.\n4. **Wear OS** — you read sensors or activity on the watch itself. **Move to Health Services on Wear OS**, not Health Connect.\n\n## If you were using Google Fit for X, move to Y\n\n| If you used Google Fit for… | Migrate to | Notes |\n|---|---|---|\n| Reading mobile steps (Fit **Recording API**) and other on-device aggregated data | **Google Health Connect** | Listed as Available in Google's guide. Device-centric, on-device storage; the step total includes mobile steps on Android 14 or higher plus steps from other apps and devices. See [the Health Connect integration guide](/integrate/google-health-connect). |\n| Fit **History API** and **Session API** (cloud, account, OAuth) | **Google Health API** | Listed as Available. Web/account-centric successor for Fit's cloud surface. |\n| The **Fit REST API** (server-to-server) | **Google Health API** | The guide's caution names it for cloud-based integrations. No 1:1 REST mapping; expect to re-architect. **(verify)** |\n| **Fitbit Web API** integrations | **Google Health API** | Listed as Available. |\n| Fit on **Wear OS** | **Health Services** on Wear OS | Listed as Available. On-watch sensors and activity, not Health Connect. |\n| Fit **Goals API** | No replacement | The guide says \"No replacement API available\" on phone and Wear; keep goal tracking in your own app logic. |\n| Battery-friendly step counts without a Google account or API scopes | **Recording API on mobile** | Provides step counts with no account and no OAuth scopes. |\n\nA hedge worth stating clearly: Google's guide lists the Health Connect, Google Health API, and Health Services paths as Available as of its September 10, 2026 update, but scopes and endpoints are the part most likely to move. Confirm them in the current Google Health API docs before you commit an architecture to it.\n\n## How to migrate\n\n### Step 1 — Classify your usage as on-device or cloud/account\n\nBefore touching code, sort every Fit call you make into one of two buckets: **on-device** (steps and aggregates read from the phone, no server, no Google account round-trip) or **cloud/account** (server-to-server REST, OAuth, or cross-device history via the History/Sessions APIs). Wear OS code is a third, separate bucket. This single distinction determines your entire migration target, so do it first and do it per-feature — a single app can have features in more than one bucket.\n\n### Step 2 — Move on-device reads to Health Connect\n\nIf your usage is on-device, migrate to **Health Connect**: the device-centric successor that stores health data on-device under user control and gives you a single integration across the Android health ecosystem. Replace Fit's OAuth-and-scopes model with Health Connect's per-record-type on-device permissions, and complete the **Play Console health-data declaration** for the data types you read — it is a publishing gate. For plain step counts, the more battery-efficient **Recording API on mobile** returns steps without a Google account or API scopes. Walk the full setup in [the Health Connect integration guide](/integrate/google-health-connect), and if reads come back empty after you switch, see [Health Connect returns no data](/fix/health-connect-no-data).\n\n### Step 3 — Move cloud/account and Fitbit Web API reads to the Google Health API\n\nIf your usage is server-side, OAuth-based, or pulls cross-device history, the destination is the **Google Health API** — the account-centric successor to Fit's cloud APIs, and also the stated home for **Fitbit Web API** integrations. Do not expect the Fit REST endpoints to map across; there is no 1:1 replacement, so budget for a genuine re-architecture of your server integration. Google's guide lists this path as Available, but still treat scopes and endpoints as **subject to change — verify against the current Google Health API docs** before you build.\n\n### Step 4 — Move Wear OS code to Health Services\n\nIf you read sensors or activity on the watch, migrate that code to **Health Services on Wear OS** — not Health Connect. Health Services is the on-watch successor for the sensor and activity APIs Fit provided on Wear OS; keep it separate from your phone-side Health Connect work.\n\n### Step 5 — Finish before the end of 2026\n\nGoogle supports the Fit APIs only until the end of 2026 and new projects cannot onboard to Fit at all, so schedule the cutover with margin rather than aiming for the last weeks of support. Do the Health Connect Play Console declaration early (review takes time), keep any Fit and successor paths running in parallel during the transition so users are not cut off, and only remove Fit code once the replacement is verified in production.\n\n## Still stuck? Quick migration checklist\n\nRun these in order:\n\n1. List every Fit API you call and label each **on-device**, **cloud/account**, or **Wear OS**.\n2. On-device ⇒ [Health Connect](/integrate/google-health-connect) (plus Recording API for steps).\n3. Cloud/account or Fitbit Web API ⇒ **Google Health API** (verify current availability and scopes).\n4. Wear OS ⇒ **Health Services**.\n5. Goals API ⇒ no replacement; move goal tracking into your own app logic.\n6. Submit the Play Console health-data declaration for your Health Connect data types.\n7. Confirm the successor works end-to-end in production, then decommission Fit before the end of 2026.\n\nDeciding between the Android and iOS sides of this while you re-architect? See [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect). And re-check Google's Fit migration guide before locking in any cloud design — Google revises it (the version cited here is dated September 10, 2026), and the details are the volatile part of this plan.",
    "faqs": [
      {
        "q": "When exactly is the Google Fit API being shut down?",
        "a": "Google's Fit migration guide, updated September 10, 2026, gives no switch-off date. It says the Google Fit APIs, including the REST API, will only be supported until the end of 2026, which is end of support rather than a named shutdown day. New signups have been closed since May 1, 2024, so no new project can onboard to Fit. Plan to finish migrating before the end of 2026."
      },
      {
        "q": "Is there a drop-in replacement for the Fit REST API?",
        "a": "No. Google states there is no alternative that maps one-to-one onto the Fit REST API, so you cannot simply swap a base URL. Cloud and account usage moves to the new Google Health API, but expect to re-architect your server integration rather than port it directly."
      },
      {
        "q": "Should I migrate to Health Connect or the Google Health API?",
        "a": "It depends on how you used Fit. On-device reads of steps and aggregates on Android move to Health Connect, while cloud, account, and OAuth reads move to the Google Health API. If your app does both, migrate each feature to the target that matches its usage pattern."
      },
      {
        "q": "Where do Fitbit Web API integrations go?",
        "a": "To the Google Health API, the same destination as Fit's cloud APIs: Google's Fit migration guide, updated September 10, 2026, lists it as the recommended path for Fitbit Web API integrations and marks it Available. A turndown of the legacy Fitbit Web API was reported for around September 2026; as of October 2, 2026 we could not confirm on an official page whether it has happened, and the guide gives no date. Verify scopes and endpoints against Google's current docs before you build."
      },
      {
        "q": "What about Google Fit on Wear OS?",
        "a": "Fit's Wear OS sensor and activity APIs move to Health Services on Wear OS, not to Health Connect. Health Connect is the phone-side on-device store, while Health Services handles on-watch sensors and activity, so keep the two migrations separate."
      }
    ],
    "related": [
      {
        "href": "/google-fit-shutdown",
        "label": "Google Fit shutdown: timeline & paths"
      },
      {
        "href": "/fix/health-connect-no-data",
        "label": "Fix: Health Connect returns no data"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Re-architecting off Google Fit and weighing Health Connect against the new Google Health API? Get our practical fitness and health API migration breakdowns in your inbox."
    },
    "steps": [
      {
        "name": "Classify each Fit call as on-device or cloud/account",
        "text": "Sort every Google Fit call into on-device reads (steps and aggregates from the phone) versus cloud or account reads (server-to-server REST, OAuth, or cross-device history). Treat Wear OS code as a separate third bucket. This distinction decides your entire migration target, so do it per feature first."
      },
      {
        "name": "Move on-device reads to Health Connect",
        "text": "For on-device usage, migrate to Google Health Connect, which stores data on-device and uses per-record-type permissions instead of OAuth scopes. Use the more battery-efficient Recording API for plain step counts, and complete the Play Console health-data declaration for the data types you read."
      },
      {
        "name": "Move cloud, account, and Fitbit Web API reads to the Google Health API",
        "text": "For server-side, OAuth-based, or cross-device history reads, migrate to the Google Health API, which is also the stated destination for Fitbit Web API integrations. There is no 1:1 REST mapping, so budget for a real re-architecture and verify current scopes and availability against Google's docs."
      },
      {
        "name": "Move Wear OS code to Health Services",
        "text": "If you read sensors or activity on the watch, migrate that code to Health Services on Wear OS rather than Health Connect. Keep it separate from your phone-side Health Connect work."
      },
      {
        "name": "Finish before the end of 2026",
        "text": "Google supports the Fit APIs only until the end of 2026 and new projects cannot onboard to Fit at all, so schedule the cutover with margin. Run Fit and its successor in parallel during the transition and only remove Fit code once the replacement is verified in production."
      }
    ]
  },
  {
    "slug": "oura-personal-access-token-deprecated",
    "primaryQuery": "oura personal access tokens deprecated",
    "h1": "Oura Personal Access Tokens Are Deprecated — Here's the Fix",
    "metaTitle": "Oura Personal Access Tokens Deprecated: What to Do",
    "metaDescription": "Oura deprecated Personal Access Tokens in December 2025 — new PATs can't be created. The fix is OAuth 2.0 Authorization Code. Step-by-step migration.",
    "updated": "2026-08-02",
    "answer": "Oura deprecated Personal Access Tokens around December 2025: new PATs can no longer be created, and new integrations must use OAuth 2.0 Authorization Code with scoped Bearer tokens. If a tutorial tells you to paste a personal token, it predates the change. The fix is to register an OAuth application, send users through Oura's consent screen, and exchange the code for tokens — your API calls to api.ouraring.com/v2/ stay the same, only the credential changes.",
    "body": "You followed a tutorial, went looking for the Personal Access Token page in the Oura dashboard, and either could not find it or found you cannot create a new one. Nothing is broken on your side: **Oura deprecated Personal Access Tokens around December 2025**, and new integrations must use OAuth 2.0. Every tutorial that says \"paste your personal token\" predates the change.\n\n## What changed, and what did not\n\n- **Gone:** creating new PATs. The simple paste-a-token path for personal scripts and quick prototypes is closed to new users.\n- **Unchanged:** the API itself. The v2 REST base (`https://api.ouraring.com/v2/`), the `usercollection` endpoints, and the data — sleep, activity, readiness, heart rate, workouts, SpO2 — are the same. Only the credential in the `Authorization` header changes: a scoped OAuth Bearer token instead of a personal one.\n- **If you hold an old PAT:** deprecation announcements typically wind down existing tokens on their own schedule — treat any still-working PAT as living on borrowed time and migrate now rather than after it stops. Verify current status in Oura's developer documentation, since wind-down timelines are the kind of detail that changes.\n\n## The fix: move to OAuth 2.0 Authorization Code\n\nThe full wiring — redirect URI setup, the consent screen, code exchange, token refresh — is covered step by step in [the Oura API integration guide](/integrate/oura-api); the short version is below. If OAuth is new territory, [OAuth for health data](/learn/what-is-oauth-for-health-data) explains the moving parts in plain English first.\n\nFor a personal project, the OAuth dance feels like overkill for one user — you still register an app and authorize yourself through your own consent screen once, then store and refresh the tokens like any integration. Budget an hour, not a weekend.\n\n## While you're here\n\nTwo adjacent traps worth knowing about. Refresh tokens are where OAuth integrations actually die in production — [refresh token not working](/fix/refresh-token-not-working) covers the rotation gotchas before they cost you a user. And if your goal was several wearables rather than Oura specifically, [a health-data aggregator](/learn/what-is-a-health-data-aggregator) gives you Oura plus the rest behind one credential flow instead of one OAuth app per provider.",
    "steps": [
      {
        "name": "Confirm you're hitting the deprecation",
        "text": "If the Oura dashboard offers no way to create a new Personal Access Token, or a fresh PAT-based call fails while the API status page shows no incident, you are on the post-December-2025 path: OAuth is required for new integrations."
      },
      {
        "name": "Register an OAuth application with Oura",
        "text": "Create an application in Oura's developer portal to get a client ID and client secret, and register the redirect URI your app (or local script) will receive the authorization code on."
      },
      {
        "name": "Send the user through the consent screen",
        "text": "Redirect to Oura's authorization URL with your client ID, redirect URI, and the scopes you need. For a personal tool, that user is you — you authorize once against your own ring's data."
      },
      {
        "name": "Exchange the code for tokens",
        "text": "Your redirect URI receives a short-lived authorization code; exchange it server-side for an access token and refresh token. Send the access token as an Authorization: Bearer header on api.ouraring.com/v2/ calls."
      },
      {
        "name": "Store and refresh like a real integration",
        "text": "Persist both tokens and refresh before expiry. Treat the refresh flow as production code even in a hobby project — expired-and-unrefreshed tokens are the number one way migrated integrations quietly stop syncing."
      }
    ],
    "faqs": [
      {
        "q": "Can I still create an Oura Personal Access Token?",
        "a": "No — as of the December 2025 deprecation, new Personal Access Tokens can no longer be created, and new integrations must use OAuth 2.0 Authorization Code with scoped Bearer tokens. Existing tokens created before the change are a separate question: treat any that still work as temporary and migrate to OAuth now. Verify the current wind-down status in Oura's own developer documentation, as of 2026."
      },
      {
        "q": "Do my Oura API endpoints change when I move from a PAT to OAuth?",
        "a": "No. The v2 REST base at api.ouraring.com/v2/ and the usercollection endpoints are unchanged, and the responses are the same. What changes is the credential: instead of a personal token you send a scoped OAuth Bearer access token, which expires and is renewed via a refresh token. Migration is an auth change, not a rewrite."
      },
      {
        "q": "Is there a simpler path than OAuth for a personal Oura project?",
        "a": "Not from Oura directly anymore — OAuth is the supported route for new integrations, even single-user ones, so you register an app and authorize yourself once through your own consent screen. If the ceremony is a dealbreaker and you want several wearables anyway, a health-data aggregator gives you Oura and other providers behind one integration, at the cost of a third party in the loop."
      }
    ],
    "related": [
      {
        "href": "/libraries/oura-ring",
        "label": "oura-ring Python library"
      },
      {
        "href": "/integrate/oura-api",
        "label": "Integrate the Oura API (OAuth walkthrough)"
      },
      {
        "href": "/fix/refresh-token-not-working",
        "label": "Fix: refresh token not working"
      },
      {
        "href": "/learn/what-is-oauth-for-health-data",
        "label": "OAuth for health data, explained"
      },
      {
        "href": "/fix",
        "label": "All troubleshooting guides"
      }
    ],
    "cta": {
      "pitch": "Auth deprecations like this one land quietly and break tutorials overnight. We track fitness API changes that actually affect builders — get the heads-up before your integration is the one that stops."
    }
  },
  {
    "slug": "fitbit-error-code-401",
    "primaryQuery": "fitbit error code 401",
    "h1": "Fitbit Error Code 401: What It Means and How to Fix It",
    "metaTitle": "Fitbit Error Code 401: Causes and the Fix",
    "metaDescription": "A Fitbit 401 rejects your credential, not your permissions. Read errorType in the errors array, refresh the 8-hour access token, and know when it is a 403.",
    "updated": "2026-08-11",
    "answer": "Error code 401 from the Fitbit API means Fitbit rejected your credential, not your permissions: the access token is missing, malformed, expired, or no longer recognised. The usual cause is simple ageing, because a Fitbit token response carries expires_in of 28800 seconds (eight hours, verify against current docs), so refresh the token and retry. Read the errorType field inside the errors array in the response body to tell the cases apart: expired_token means refresh, while invalid_token points at a malformed header, a revoked grant, or a token minted by a different registered app. If the refresh itself fails with invalid_grant, the grant is dead and the user must authorize again.",
    "steps": [
      {
        "name": "Confirm it is a 401 and not a 403",
        "text": "Re-run the failing request with curl -i and read the status line. A 403 means the token is valid but lacks the scope or approval for that data, and refreshing will never fix it. Only continue if the status is genuinely 401."
      },
      {
        "name": "Read errorType in the response body",
        "text": "A Fitbit rejection returns an errors array. Read the errorType field: expired_token means the credential aged out and a refresh will fix it, while invalid_token means Fitbit does not recognise the credential as live."
      },
      {
        "name": "Check the Authorization header you actually sent",
        "text": "The header must be the word Bearer, one space, then the access token. Rule out a missing Bearer prefix, stray whitespace or a newline inside the token, and sending the refresh token where the access token belongs. Reproduce the same call in curl to isolate a client-side bug."
      },
      {
        "name": "Refresh the access token",
        "text": "POST to the Fitbit token endpoint with grant_type=refresh_token, your stored refresh token, and your client_id. Confidential Server apps also send an HTTP Basic authorization header built from the client ID and client secret. Persist what comes back and retry the original call."
      },
      {
        "name": "Treat invalid_grant on refresh as a dead grant",
        "text": "If the refresh call fails with invalid_grant, the user revoked access or the grant expired. Retrying will not help. Send the user through the Fitbit authorization flow again to mint a fresh grant."
      },
      {
        "name": "Rule out a token from a different registered app",
        "text": "Each Fitbit app registration has its own Client ID, and a token minted under one is not valid for another. Confirm the token you are sending was issued by the same registration you are calling with, especially if you keep a Personal app for intraday testing alongside a Server app for production."
      }
    ],
    "faqs": [
      {
        "q": "How long does a Fitbit access token last before it expires?",
        "a": "A Fitbit token response includes expires_in with a value of 28800 seconds, which is eight hours. That is the commonly documented lifetime, so verify the current value against Fitbit's docs before hard-coding it. Practically, it means a long-running integration must refresh at least three times a day, and it explains why a call that worked this morning fails this evening."
      },
      {
        "q": "Does refreshing a Fitbit token require HTTP Basic auth?",
        "a": "It depends on the OAuth 2.0 application type you registered. Public Client apps, such as mobile and single-page apps that ship no secret, send grant_type, the refresh token, and the client_id, relying on PKCE. Confidential Server apps additionally send an HTTP Basic authorization header built from the client ID and client secret. Sending the wrong combination for your app type makes the refresh fail even though the refresh token is good."
      },
      {
        "q": "What does Fitbit put in the response body when it rejects a call?",
        "a": "Fitbit returns an errors array, and the field to read is errorType. The two values you will see most on a rejected credential are expired_token, meaning the access token aged out and a refresh will fix it, and invalid_token, meaning Fitbit does not recognise the credential as live. Log errorType on every failure rather than logging the status code alone."
      },
      {
        "q": "Why does a Fitbit token that works in one of my apps fail in another?",
        "a": "Every Fitbit app registration gets its own Client ID, and a token minted under one registration is not valid for another. The token is genuinely live, just not for the app making the call. This bites teams that keep a Personal app for intraday testing next to a Server app for production and let the two credentials mix in a shared config or environment file."
      },
      {
        "q": "Does a Fitbit 401 mean the user disconnected my app?",
        "a": "Sometimes, and the refresh call is what tells you. If the refresh succeeds, the original failure was ordinary token ageing and the connection is intact. If the refresh fails with invalid_grant, the grant itself is gone because the user revoked access or it expired, and no retry will bring it back. At that point the only path forward is sending the user through the authorization flow again."
      }
    ],
    "related": [
      {
        "href": "/fitbit-api-shutdown",
        "label": "Fitbit API deprecation status"
      },
      {
        "href": "/fix/fitness-api-401-unauthorized",
        "label": "401 unauthorized — every fitness API"
      },
      {
        "href": "/fix/refresh-token-not-working",
        "label": "Refresh token not working"
      },
      {
        "href": "/integrate/fitbit-api",
        "label": "Fitbit API integration guide"
      }
    ],
    "cta": {
      "pitch": "A turndown of the legacy Fitbit Web API was reported for around September 2026, and Google's migration guide points Fitbit integrations at the Google Health API. We track what is confirmed versus reported, plus the error codes and quiet breaking changes across wearable APIs — subscribe and find out before your logs do."
    },
    "body": "You made a Fitbit call that worked an hour ago, and now the same code, the same user, and the same endpoint come back rejected:\n\n```bash\ncurl -i \"https://api.fitbit.com/1/user/-/activities/date/2026-08-10.json\" \\\n  -H \"Authorization: Bearer $ACCESS_TOKEN\"\n```\n\nBefore you touch your OAuth code, check the clock. A Fitbit token response carries `\"expires_in\": 28800` — 28,800 seconds, or eight hours (the commonly documented lifetime; verify the current value in Fitbit's docs). If the token you are sending was minted this morning and it is now this evening, you have found your bug and the fix is a refresh, not a re-auth.\n\n## Read the body, not just the status line\n\nFitbit does not make you guess. A rejected call returns an `errors[]` array, and the field that decides what you do next is `errorType`. Reduced to the part you act on:\n\n```json\n{\n  \"errors\": [\n    { \"errorType\": \"expired_token\" }\n  ]\n}\n```\n\nTwo values matter here:\n\n- **`expired_token`** — the credential was valid and aged out. Refresh it.\n- **`invalid_token`** — the credential is not one Fitbit recognises as live: malformed, revoked, or issued by a different app. A refresh may or may not save you; see the decision path below.\n\nLog `errorType` on every 401 rather than logging \"401\" and moving on. It is the difference between a one-line retry and an afternoon.\n\n## Ranked causes of a Fitbit 401\n\nIn rough order of how often they actually bite:\n\n1. **The eight-hour access token expired.** This is the overwhelming majority of Fitbit 401s, and it is the one that shows up as \"it worked this morning.\" Refresh with the stored `refresh_token` and retry the original call.\n2. **A malformed or missing `Authorization` header.** The header must be exactly the word `Bearer`, one space, then the access token. The classic breakers are a missing `Bearer ` prefix, stray whitespace or a trailing newline inside the token string, and sending the refresh token where the access token belongs.\n3. **The user revoked consent.** Someone disconnected your app or reset their credentials. The tell is that the *refresh* fails too, with `invalid_grant` — at which point the grant is dead and no amount of retrying resurrects it. The user has to re-authorize from scratch.\n4. **A token minted by a different registered app.** Every Fitbit app registration gets its own Client ID, and a token issued under one is not valid for another. Teams that keep a **Personal** app for intraday testing alongside a **Server** app for production hit this constantly: the token is genuinely valid, just not here.\n\n## The decision path\n\nWork it top to bottom and stop at the first branch that fires.\n\n| What you see | What it means | What to do |\n| --- | --- | --- |\n| `401` with `errorType: expired_token` | Ordinary token ageing | Refresh, persist the new token, retry |\n| `401` with `errorType: invalid_token`, and the header is clean | Revoked, or wrong app's token | Try one refresh; if it fails, re-authorize |\n| Refresh returns `invalid_grant` | The grant itself is gone | Send the user through the authorize flow again |\n| `401` on the very first call after connecting | Header construction, or the wrong app's credentials | Reproduce the exact call in curl before blaming Fitbit |\n| `403`, not `401` | Missing scope or unapproved data | Do not refresh — see below |\n\n## Refreshing correctly (public vs confidential apps)\n\nThe refresh call differs by the OAuth 2.0 application type you chose at registration, and getting it wrong produces its own failures. Public **Client** apps — mobile and single-page apps that ship no secret — send the `client_id` and rely on PKCE:\n\n```bash\ncurl -X POST \"https://api.fitbit.com/oauth2/token\" \\\n  -H \"Content-Type: application/x-www-form-urlencoded\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=REFRESH_TOKEN\" \\\n  -d \"client_id=CLIENT_ID\"\n```\n\nConfidential **Server** apps add HTTP Basic authentication with their client credentials on top of the same request:\n\n```\nAuthorization: Basic BASE64(client_id:client_secret)\n```\n\nPersist whatever comes back, and refresh *before* expiry rather than waiting for production to hand you a burst of 401s at the eight-hour mark. The full registration and token-exchange walkthrough lives in the [Fitbit API integration guide](/integrate/fitbit-api); if your refresh is the thing that keeps failing, [refresh token not working](/fix/refresh-token-not-working) covers the rotation traps that make a refresh succeed once and never again.\n\n## When it is really a 403\n\nA `403 Forbidden` is a different animal with a different fix: the credential is fine, but it does not carry the permission for what you asked. Refreshing mints a new token with the *same* scopes the user already granted, so a scope gap survives the refresh untouched.\n\nIt bites on Fitbit specifically because consent is per data collection: the user chooses which collections to grant, and Fitbit does not let you force them to grant every scope. Someone can approve `activity` and decline `heartrate`, and your heart-rate calls will keep failing no matter how many times you refresh. Read the `scope` value returned with the token instead of assuming you got what you asked for, and re-authorize with the missing collection when you did not.\n\n## The general case, and the migration in the background\n\nEverything above is the Fitbit-flavoured version of a failure mode every OAuth fitness provider shares. For the cross-provider version — the `WWW-Authenticate` header, how Strava, Garmin, Oura, and WHOOP each name the same conditions, and the generic 401-versus-403 triage — see [fitness API 401 unauthorized](/fix/fitness-api-401-unauthorized). If your 401s arrive in bursts rather than one at a time, check whether you are actually looking at throttling: [Fitbit API 429 rate limit](/fix/fitbit-api-429-rate-limit).\n\nOne piece of context worth holding while you debug: a turndown of the legacy Fitbit Web API was reported for around September 2026. As of October 2, 2026 we could not confirm on an official page whether it has happened; Google's Fit migration guide (updated September 10, 2026) lists the Google Health API as the recommended path for Fitbit Web API integrations and gives no date. Existing Fitbit access and refresh tokens are reported not to transfer, so moving to the Google Health API means every user re-consents through Google OAuth 2.0. Token ageing is still the usual cause of a 401, but if calls start failing for every user at once, even straight after a fresh authorization, check the [Fitbit API deprecation status](/fitbit-api-shutdown) before you debug your token code. The re-consent path is mapped out in [migrating from the Fitbit Web API to Google Health](/migrate/fitbit-web-api-to-google-health)."
  },
  {
    "slug": "healthkit-authorization-denied",
    "primaryQuery": "healthkit authorization denied",
    "h1": "HealthKit Authorization Denied: What It Means and What It Hides",
    "metaTitle": "HealthKit Authorization Denied: What It Means",
    "metaDescription": "sharingDenied covers writes only — Apple never reveals a denied read. What HealthKit confirms, what it hides by design, and how to route users to fix it.",
    "updated": "2026-08-11",
    "answer": "In HealthKit, a denied authorization is only visible on the write side. The status returned by authorizationStatus(for:) — notDetermined, sharingDenied, or sharingAuthorized — describes permission to save data, and Apple documents that your app cannot determine whether a user granted permission to read data, because a denied read simply looks like an empty store. If your app has share permission but not read permission, Apple states you see only the samples your own app wrote, and data from other sources stays hidden. The single exception is limited authorization: when someone grants a recent window of history instead of their full history, getEarliestAuthorizedSampleDate reveals that date, and Apple calls it the only authorization state your app can positively identify.",
    "steps": [
      {
        "name": "Read the status as a write status",
        "text": "Apple documents authorizationStatus(for:) as checking the authorization status for saving data to the HealthKit store. A result of sharingDenied means writes for that type are denied and says nothing about reads, so disable saving for that type only and keep querying."
      },
      {
        "name": "Stop trying to detect read denial",
        "text": "Apple states that to help prevent leaks of sensitive health information, your app cannot determine whether a user granted permission to read data, and that a denial simply appears as if there is no data of that type. Remove any UI gated on read-authorization status."
      },
      {
        "name": "Check for limited authorization",
        "text": "After requesting authorization, call getEarliestAuthorizedSampleDate(for:completion:) to learn the earliest date the person permits your app to read for each type, and pass that start date into your query predicate. Types with no entry in the result are either fully granted or denied — Apple prevents you from telling those apart."
      },
      {
        "name": "Distinguish your own writes from other sources",
        "text": "Apple documents that with share permission but no read permission you see only the samples your app saved to the store. If your own data reads back but nothing from other apps or devices appears, that pattern is a denied read rather than an empty store."
      },
      {
        "name": "Verify the usage-description keys",
        "text": "Set NSHealthShareUsageDescription for reading and NSHealthUpdateUsageDescription for writing. Apple states you must set the usage keys or your app will crash when you request authorization, so rule this out before treating a crash as a permission problem."
      },
      {
        "name": "Route the user to the system UI instead of re-prompting",
        "text": "Apple documents that HealthKit returns the request without prompting if the user already chose to grant or prohibit access to all the specified types. Tell the user to change permissions in Settings or the Health app, where your app appears under the Sources tab even if nothing was granted."
      }
    ],
    "faqs": [
      {
        "q": "Does sharingDenied mean my HealthKit reads will fail too?",
        "a": "No. Apple documents authorizationStatus(for:) as checking the status for saving data to the HealthKit store, and the enum describes whether the user authorized your app to save data of the given type. Read and share are separate permissions on every type, so a user can deny writes while allowing reads. Disable saving for that type and keep running your queries."
      },
      {
        "q": "What does getRequestStatusForAuthorization actually tell me?",
        "a": "Apple describes it as indicating whether the system presents a permission sheet if your app requests authorization for the provided types. Its results are shouldRequest, meaning you have not yet requested all the specified types, unnecessary, meaning you already have, and unknown, meaning an error occurred. Unnecessary means asking again would show nothing — it is not confirmation that access was granted."
      },
      {
        "q": "Why does calling requestAuthorization again show no permission sheet?",
        "a": "Apple documents that if the user has already chosen to grant or prohibit access to all of the types specified, HealthKit returns the request without prompting. A second call is a no-op once every requested type has been decided, so a grant-access button that re-requests will silently do nothing. Point the user at Settings or the Health app instead."
      },
      {
        "q": "How do I know if a user granted only a limited window of health history?",
        "a": "Apple's authorization sheet includes a second screen where people choose between a recent limited window and their full history. Call getEarliestAuthorizedSampleDate(for:completion:) to get the earliest date you may read for each type and pass it into your query. Apple calls limited authorization the only authorization state your app can positively identify, and warns against treating the absence of older samples as proof they do not exist."
      },
      {
        "q": "Why do HealthKit writes fail on Vision Pro when my status check says authorized?",
        "a": "In a Guest User session, Apple documents that an app's permissions do not change, so authorizationStatus(for:) still reports the owner's grant while any attempt to save fails with errorNotPermissibleForGuestUserMode, or errorHealthDataRestricted on apps running in iOS 17. The authorization sheet is not displayed either, so requests during a guest session fail silently. Apple suggests ignoring the error for passive or periodic saves and only alerting when the guest took an action that obviously implies saving."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-no-data",
        "label": "HealthKit returning no data"
      },
      {
        "href": "/integrate/healthkit",
        "label": "HealthKit integration guide"
      },
      {
        "href": "/test/healthkit-integration",
        "label": "Testing a HealthKit integration"
      },
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "label": "HealthKit vs Health Connect"
      }
    ],
    "cta": {
      "pitch": "Apple's privacy design decides what your app is allowed to know, and it changes quietly between releases. We read the docs so your integration does not find out the hard way — subscribe for the next breakdown."
    },
    "body": "There are two ways people arrive at \"HealthKit authorization denied,\" and they are opposite mistakes about the same API. One developer calls `authorizationStatus(for:)`, gets `.sharingDenied`, and disables the whole feature — including the reads, which that status never described. The other gets an empty array back, concludes the user denied them, and shows a \"permission required\" screen to someone who simply has no samples of that type. Untangling this starts with reading Apple's own description of what the status call covers.\n\n## What authorizationStatus(for:) actually reports\n\nApple documents the method plainly: \"This method checks the authorization status for saving data to the HealthKit store.\" Saving. Not reading. The three values it can return are all about the share side:\n\n| Case | Apple's description |\n| --- | --- |\n| `.notDetermined` | \"The user has not yet chosen to authorize access to the specified data type.\" |\n| `.sharingDenied` | \"The user has explicitly denied your app permission to save data of the specified type.\" |\n| `.sharingAuthorized` | \"The user has explicitly authorized your app to save data of the specified type.\" |\n\nEven the enum name carries the warning: `sharing`, not `access`. Apple's overview for `HKAuthorizationStatus` says the same thing from the other direction — \"This status indicates whether the user has authorized your app to save data of the given type.\"\n\nSo `.sharingDenied` is a complete answer to one question (\"can I write this type?\") and no answer at all to the other. Your reads may be fully granted alongside it. Read and share are separate permissions per type; Apple notes that \"each data type has two separate permissions, one to read it and one to share it,\" and the permission sheet lets people toggle them independently within each category.\n\n## Read denial is invisible, and Apple says so explicitly\n\nThis is the part that makes the symptom so confusing, and it is deliberate. Apple documents on `authorizationStatus(for:)`:\n\n> To help prevent possible leaks of sensitive health information, your app cannot determine whether or not a user has granted permission to read data. If you are not given permission, it simply appears as if there is no data of the requested type in the HealthKit store. If your app is given share permission but not read permission, you see only the data that your app has written to the store. Data from other sources remains hidden.\n\nThe authorization article repeats it: \"your app doesn't know whether someone granted or denied permission to read data. If they denied permission, attempts to read data from HealthKit return only samples that your app successfully saved to the HealthKit store.\"\n\nThat last clause is the detail people miss. A denied read is not an empty store — it is a store filtered down to *your own writes*. An app that saves workouts and reads them back will see its own data flowing perfectly while every other source stays invisible, which looks exactly like a working integration until a user with an Apple Watch complains.\n\n## The one authorization state you can positively identify\n\nThere is a single exception, and it is newer than most HealthKit code. Apple documents that after the data-type screen, \"a second screen prompts them to choose how much historical data to grant your app, either a recent limited window or their full history.\" When someone picks the limited window, your app is in a limited authorization state for those types, and that state *is* observable.\n\nCall `getEarliestAuthorizedSampleDate(for:completion:)` after requesting authorization — Apple describes it as returning \"the earliest date that the person permits your app to read samples for the given data types.\" The framing in Apple's article is worth quoting because it settles the whole question:\n\n> HealthKit intentionally prevents your app from distinguishing between full access and denied access to specific types; both cases return no entry in the result dictionary. Limited authorization is the only authorization state your app can positively identify.\n\nNo entry in the dictionary means either full access or denial. You still cannot tell those apart. What you gain is the ability to stop treating a short history as a data gap: Apple warns against \"interpreting the absence of older samples as evidence they don't exist; the person's history may extend before the date the method returns,\" and shows passing the returned `startDate` into your query predicate rather than reaching for `.distantPast`.\n\n```swift\nlet types: Set<HKObjectType> = [HKQuantityType(.stepCount)]\nlet authorizationDates = try await store.earliestAuthorizedSampleDate(for: types)\nlet queryStartDate = authorizationDates[HKQuantityType(.stepCount)] ?? .distantPast\n```\n\nApple also suggests that if your app makes inferences on partial data, you consider telling people that granting full access improves the experience.\n\n## What getRequestStatusForAuthorization does and does not tell you\n\nThis is the other method people reach for when they want a grant check, and it answers a different question again. Apple's abstract: it \"indicates whether the system presents the user with a permission sheet if your app requests authorization for the provided types.\" Its three results are about the *prompt*, not the *outcome*:\n\n- `.shouldRequest` — \"The application has not yet requested authorization for all the specified data types.\"\n- `.unnecessary` — \"The application has already requested authorization for all the specified data types.\"\n- `.unknown` — \"The authorization request status could not be determined because an error occurred.\"\n\n`.unnecessary` means \"asking again would show nothing,\" which is emphatically not \"you were granted access.\" Treat it as a UI hint for whether to show your own pre-permission explainer, and nothing more.\n\nIt also explains a bug report you will eventually receive: calling `requestAuthorization(toShare:read:)` a second time appears to do nothing. Apple documents exactly that behaviour — \"if the user has already chosen to grant or prohibit access to all of the types specified, HealthKit returns the request without prompting the user.\" You cannot re-prompt your way out of a denial.\n\n## Symptom to cause\n\n| Symptom | What it actually means | What to do |\n| --- | --- | --- |\n| `authorizationStatus(for:)` returns `.sharingDenied` | Writes for that type are denied. Reads are unaffected and unknown. | Disable saving for that type only; keep reading |\n| `authorizationStatus(for:)` returns `.notDetermined` | You never requested authorization, or never for this type | Call `requestAuthorization(toShare:read:)` |\n| Query returns empty, but your own saved samples come back | Read permission is denied for that type | Route the user to Settings or the Health app |\n| Query returns empty including your own writes | No data of that type exists, or plumbing is broken | Isolate with a write-then-read test |\n| Samples appear, but history starts recently | Limited authorization, not a gap | Use the date from `getEarliestAuthorizedSampleDate` |\n| `requestAuthorization` shows no sheet | Every requested type is already decided | Send the user to Settings; do not re-prompt |\n| Save fails with `errorAuthorizationDenied` | The user explicitly denied write for that type | Stop saving; surface it in your UI honestly |\n| Save fails with `errorAuthorizationNotDetermined` | You never asked | Request authorization before saving |\n\n## Denied writes, unlike denied reads, have real error codes\n\nBecause the share side is observable, it also fails loudly. Apple's guidance is to check `authorizationStatus(for:)` before attempting a save, and documents the two failures you get if you skip that check: `errorAuthorizationNotDetermined` (\"the app hasn't yet asked the user for the authorization required to complete the task\") and `errorAuthorizationDenied` (\"the user hasn't given the app permission to save data\").\n\nIf your product treats \"denied\" as a single state, this asymmetry is the thing to encode instead: writes give you a status and an error code, reads give you neither.\n\n## The Info.plist keys that turn a permission bug into a crash\n\nTwo usage-description keys govern the two sides, and Apple is unambiguous about what happens without them: \"You must set the usage keys, or your app will crash when you request authorization.\"\n\n- `NSHealthShareUsageDescription` — Apple describes it as \"a message that explains to people why the app requests permission to read samples from the HealthKit store.\" Required for reading.\n- `NSHealthUpdateUsageDescription` — \"a message to the user that explains why the app requested permission to save samples to the HealthKit store.\" Required for writing.\n\nFor projects created with Xcode 13 or later, Apple says to set these in the Target Properties list on the app's Info tab; older projects set them in the information property list. If your \"authorization denied\" report is really a crash at the request call, this is where to look first, and the [HealthKit integration guide](/integrate/healthkit) covers the surrounding setup.\n\n## The correct UX pattern: you cannot fix this in code\n\nThere is no API to toggle a permission on a user's behalf, so every honest recovery path ends in the system UI. Apple: \"a person can change the permissions for your app at any time using either the Settings or Health app. After prompting for HealthKit authorization, your app appears in the Health app's Sources tab, even if the person didn't allow permission to read and share data.\"\n\nThat last clause is the useful one to put in your copy. Your app is listed under Sources whether or not anything was granted, so \"open the Health app, find this app under Sources, and turn on the types you want shared\" is instructions a user can actually follow. Two rules that follow from everything above:\n\n- **Never gate your UI on read-authorization status**, because there isn't one. Run the query, render what comes back, and treat empty as a legitimate state rather than an error — the same discipline that makes an empty read a first-class [HealthKit test case](/test/healthkit-integration).\n- **Do not nag.** Re-calling `requestAuthorization` after a decision shows no sheet at all, so a \"grant access\" button that silently does nothing is worse than a line of text pointing at the Health app.\n\n## Edge cases that look like denial but are not\n\n- **Apple Vision Pro Guest User sessions.** Apple documents that in a guest session the guest can read data the owner already authorized but cannot authorize additional types, the authorization sheet is not displayed so \"any attempt to request authorization for HealthKit data types during a Guest User session fails silently,\" and writes fail with `errorNotPermissibleForGuestUserMode` (or `errorHealthDataRestricted` on apps running in iOS 17). Critically, `authorizationStatus(for:)` still reports the owner's grant, so your status check and your save disagree. Apple's advice is to silently ignore the error for passive or periodic saves, and only surface an alert when the guest took an action that obviously implies saving.\n- **Managed devices.** `errorHealthDataRestricted` also signals that \"a Mobile Device Management (MDM) profile restricts the use of HealthKit on this device\" — an organisational policy, not a user choice.\n- **Required clinical record types.** If you declare types under the `NSHealthRequiredReadAuthorizationTypeIdentifiers` key, Apple says to specify three or more, and that denying any of them fails authorization with `errorRequiredAuthorizationDenied` — \"the system doesn't tell your app which record types the person denied access to.\"\n\n## Where to go next\n\nIf your immediate problem is an empty query rather than the authorization model itself, the write-then-read isolation sequence is laid out in [HealthKit returning no data](/fix/healthkit-no-data). If you are designing a pipeline that has to survive this ambiguity at scale — distinguishing gaps from denials across many users — see [handling missing data and gaps](/architecture/missing-data-and-gaps). And if you are shipping the same feature on Android, Health Connect makes the opposite trade: granted read permissions are queryable, and a missing one surfaces as an exception on the read rather than as silence. The two models are set side by side in [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect)."
  },
  {
    "slug": "strava-api-401-unauthorized",
    "primaryQuery": "strava api 401 unauthorized",
    "h1": "Strava API 401 Unauthorized: What It Means and How to Fix It",
    "metaTitle": "Strava API 401 Unauthorized: The Rotating-Token Fix",
    "metaDescription": "A Strava 401 rejects your credential. Read the Authorization Error body, check the six-hour expires_at, and persist the rotating refresh token every time.",
    "updated": "2026-08-12",
    "answer": "A 401 from the Strava API means Strava rejected the credential itself, not your permissions, and on Strava the top-ranked cause is the rotating refresh token rather than the access token. Strava returns a new refresh token on every refresh and the old one stops working, so an integration that persists only the access token refreshes once and then can never mint another, and every subsequent call fails. Read the response body first, because Strava reports a rejected credential as an Authorization Error naming the access_token field with code invalid. Then check expires_at, since access tokens expire roughly six hours after creation (an expires_in of 21600 seconds as of 2026 — verify against the current docs). If the refresh call itself returns invalid_grant, the grant is dead and the athlete has to authorize again.",
    "steps": [
      {
        "name": "Read Strava's error body, not just the status line",
        "text": "Re-run the failing call and capture the response body. A rejected Strava credential comes back as a message of Authorization Error with an errors array naming the access_token field and the code invalid. Log that body on every failure so you are diagnosing the credential rather than guessing at the status code."
      },
      {
        "name": "Compare expires_at against the clock",
        "text": "Strava returns expires_at and expires_in with every token response, and access tokens expire about six hours after creation. If the token you are sending was minted this morning and it is now this afternoon, the credential simply aged out and the fix is a refresh, not a re-authorization."
      },
      {
        "name": "Check which token you actually put in the header",
        "text": "The header must be the word Bearer, one space, then the access token. Rule out a missing Bearer prefix, stray whitespace or a newline inside the token, and the common mistake of sending the refresh token or the client secret where the access token belongs. Reproduce the identical call with curl to isolate a client-side bug."
      },
      {
        "name": "Refresh, then persist the returned refresh token",
        "text": "POST to the Strava token endpoint with grant_type=refresh_token, your client_id, your client_secret, and the stored refresh token. Strava rotates refresh tokens, so write back both the new access token and the returned refresh token in one atomic update, overwriting the old value even when it looks unchanged."
      },
      {
        "name": "Serialize refreshes per athlete",
        "text": "Two concurrent refreshes for the same athlete race: the first rotates the token and the second sends the now-dead one. Wrap refreshes in a per-athlete lock so only one runs at a time, which removes the intermittent failures that survive a correct persistence layer."
      },
      {
        "name": "Treat invalid_grant and deauthorization as a dead grant",
        "text": "If the refresh returns invalid_grant, retrying will not help. The athlete revoked access, the grant expired, or you lost the rotated token. Clean up the stored tokens and send the athlete through the authorize screen again to mint a fresh grant."
      },
      {
        "name": "Rule out the wrong environment and clock skew",
        "text": "Confirm the token was issued by the same registered application and environment you are calling, since a staging credential will be rejected in production. If freshly issued tokens look already expired, check that your server clock is NTP-synced before touching the OAuth code."
      }
    ],
    "faqs": [
      {
        "q": "What does Strava's Authorization Error response body tell me?",
        "a": "It tells you Strava rejected the credential rather than the request. Our corpus records the shape as a message of Authorization Error alongside an errors array whose single entry names the access_token field with the code invalid. That is a credential-level rejection, so the next question is always whether the token aged out, was never rotated correctly, or belongs to a different registered application. Log the body rather than the bare status code, because the field name is what tells you the access token specifically is the thing Strava refused."
      },
      {
        "q": "Does a missing activity:read_all scope make Strava return 401?",
        "a": "No, and this is the Strava-specific trap. On Strava a scope shortfall usually shows up as missing data rather than an error status. Plain activity:read only ever returns activities the athlete shared beyond Only You, and the same filtering applies to webhook events, so private runs simply vanish from your listings while every call keeps succeeding. If athletes report missing activities, check the scope value returned with the token instead of hunting for a rejected credential."
      },
      {
        "q": "Do Strava token refresh calls count against my rate limit?",
        "a": "No. Our Strava integration guide records that the OAuth token exchange and refresh calls do not count against your API rate limit. That matters when you are fixing a 401 storm, because the instinct to batch refreshes carefully is misplaced here — the thing you must actually protect is your per-application request budget, documented as roughly 200 requests per 15 minutes and 2,000 per day as of 2026, which returns 429 rather than 401 when you exceed it. Verify the current quotas before you build around them."
      },
      {
        "q": "How do I tell a deauthorized athlete from an expired Strava token?",
        "a": "The refresh call is the test. If the refresh succeeds, the original rejection was ordinary ageing and the connection is intact. If it comes back invalid_grant, the grant itself is gone and no retry recovers it. Strava also gives you an advance signal: the Events API sends an athlete update carrying updates.authorized set to false when someone disconnects your app, which is your cue to clean up that athlete's stored tokens before your next call fails."
      },
      {
        "q": "Could Strava's developer subscription requirement be causing my 401s?",
        "a": "Treat that as unproven rather than as a cause. Strava's developer program has tightened since 2024 with formal Standard and Extended Access tiers, display and branding rules including the Connect with Strava button, athlete-consent requirements, and a reported paid subscription now gating Standard tier access. Those are real constraints on whether your application keeps access at all, but our corpus does not document any of them producing a 401 status code specifically, so do not skip the token diagnosis in favour of a compliance theory. Verify the current terms against Strava's live developer agreement and API Policy."
      }
    ],
    "related": [
      {
        "href": "/fix/fitness-api-401-unauthorized",
        "label": "401 unauthorized — every fitness API"
      },
      {
        "href": "/fix/refresh-token-not-working",
        "label": "Refresh token not working"
      },
      {
        "href": "/integrate/strava-api",
        "label": "Integrate the Strava API"
      },
      {
        "href": "/migrate/adapt-to-strava-api-changes",
        "label": "Adapt to Strava's API changes"
      }
    ],
    "cta": {
      "pitch": "Strava rotates its refresh tokens, moves its tier rules, and changes what you are allowed to display — usually without breaking anything until it breaks everything. We take apart one fitness API's auth and terms each week so your logs are not the first to know."
    },
    "body": "There is a version of this bug that looks like an outage and is not one. Every Strava call for every athlete starts failing at once, your error rate goes vertical, and Strava's status page says everything is fine. It usually is fine. What happened is that your refresh loop ran, Strava handed back a new refresh token, your code kept the old one, and from that moment on nothing could mint a working access token for anybody.\n\nThat is the shape of a Strava 401. Start by making the failing call by hand so you can see the raw response:\n\n```bash\ncurl -i \"https://www.strava.com/api/v3/athlete/activities?per_page=1\" \\\n  -H \"Authorization: Bearer $ACCESS_TOKEN\"\n```\n\n## Read the body Strava sends back\n\nStrava does not leave the reason in the status line alone. A rejected credential comes back in a documented shape:\n\n```json\n{\n  \"message\": \"Authorization Error\",\n  \"errors\": [\n    { \"field\": \"access_token\", \"code\": \"invalid\" }\n  ]\n}\n```\n\nThe load-bearing part is `\"field\": \"access_token\"`. Strava is telling you the credential you presented is the thing it refused — not the endpoint, not the athlete, not the scope. Log that body on every failure. A team that logs only the status code spends an afternoon on a problem the body names in one line.\n\n## Ranked causes, Strava-specific\n\nThe general cross-provider ranking puts an expired access token first. On Strava the order is different, because Strava rotates refresh tokens and that rotation is the single most common way an integration breaks.\n\n1. **You did not persist the rotated refresh token.** Strava's own documentation says it plainly: *\"the refresh token may or may not be the same refresh token used to make the request. Applications should persist the refresh token contained in the response and always use the most recent refresh token.\"* Once a new one is issued, the old one is dead. Symptom: refresh succeeds exactly once, then returns `invalid_grant`, and every API call afterwards is a 401 because you can no longer produce a live access token.\n2. **The access token simply expired.** Strava access tokens expire about six hours after creation — an `expires_in` of 21600 seconds as of 2026, so verify the current value. Every token response also carries `expires_at`, which is the field to store and compare against. Symptom: it worked this morning, it does not work this evening, and a single refresh fixes it.\n3. **A malformed header, or the wrong token in it.** The header must be exactly the word `Bearer`, one space, then the access token. The classic breakers are a missing prefix, a trailing newline inside the token string, and sending the refresh token or the client secret where the access token belongs.\n4. **The athlete deauthorized your app.** Strava gives you a signal for this before your calls fail. The Events API sends an `athlete` update carrying `updates.authorized` set to `\"false\"` when someone disconnects you, and that is your cue to clean up their stored tokens. If you are not consuming that event, the first you hear about it is a refresh that returns `invalid_grant`.\n5. **A token from the wrong application or environment.** A credential minted by a different registration, or a staging token pointed at production, is genuinely valid somewhere — just not here.\n6. **Clock skew.** If freshly issued tokens look already expired, your server clock is far enough off that expiry maths goes wrong. Keep servers NTP-synced before you touch the OAuth code.\n\n## The decision path\n\nWork it top to bottom and stop at the first row that fires.\n\n| What you see | What it means | What to do |\n| --- | --- | --- |\n| 401 with an `access_token` / `invalid` error body, token minted hours ago | Ordinary six-hour ageing | Refresh, persist both tokens, retry |\n| Refresh worked once, later refreshes return `invalid_grant` | You are reusing a rotated refresh token | Persist the returned `refresh_token` on every refresh |\n| Intermittent `invalid_grant` even though you do persist it | Two refreshes raced for the same athlete | Serialize refreshes behind a per-athlete lock |\n| Refresh returns `invalid_grant` and the token was definitely current | The grant is dead — revoked or expired | Clear the tokens, send the athlete back through authorize |\n| A webhook `athlete` event with `updates.authorized` set to `\"false\"` | The athlete disconnected you | Delete their tokens now, do not retry |\n| 401 on the very first call after connecting | Header construction, or the wrong app's credentials | Reproduce the exact call in curl before blaming Strava |\n| 429, not 401 | You blew the request budget, not the credential | Read the rate-limit headers and back off |\n| Calls succeed but private activities are missing | Scope shortfall, not a credential problem | Re-authorize with `activity:read_all` |\n\n## Fixing the rotation properly\n\nThe refresh call itself is unremarkable, and the token exchange and refresh do not count against your API rate limit, so there is no reason to be shy about refreshing on a buffer:\n\n```bash\ncurl -s -X POST \"https://www.strava.com/oauth/token\" \\\n  -d \"client_id=$CID\" \\\n  -d \"client_secret=$SECRET\" \\\n  -d \"grant_type=refresh_token\" \\\n  -d \"refresh_token=$STORED_REFRESH_TOKEN\"\n```\n\nWhat comes back is a fresh access token, a new `expires_at`, and a `refresh_token` field that may differ from the one you sent. That last field is the whole ballgame. Write both tokens back in a single atomic update, overwriting the stored refresh token even when the value looks identical, and store `expires_at` alongside them. If your code persists the access token and the refresh-token write is conditional, skipped, or lost to a crash between two statements, you have recreated the bug you came here to fix.\n\nTwo disciplines go on top of that write. Serialize refreshes per athlete, because a background job and a user-triggered refresh firing together will rotate the token out from under each other and produce `invalid_grant` on a codebase whose persistence is otherwise correct. And refresh proactively rather than waiting for a burst of rejections in production — note that Strava only mints a genuinely new access token when the current one has roughly an hour or less left, so verify that behaviour against the current docs before tuning your buffer. The cross-provider version of this failure, including the providers that rotate the same way, lives in [refresh token not working](/fix/refresh-token-not-working), and the happy-path setup is in the [Strava API integration guide](/integrate/strava-api).\n\n## When Strava is not returning 401 at all\n\nTwo near misses are worth ruling out explicitly.\n\nA **scope shortfall on Strava does not usually surface as an error.** Plain `activity:read` returns only activities the athlete has shared beyond \"Only You\", and the same filtering applies to webhook events. The athlete's private runs quietly do not appear while every call returns 200. Read the `scope` value Strava returns with the token instead of assuming you got what you asked for — athletes can deselect scopes on the consent screen — and re-authorize with `activity:read_all` if you need the full history.\n\nA **failing token exchange is a different bug from a failing API call.** If the rejection happens when you swap the authorization code for tokens, and you are seeing `invalid_grant` or a redirect complaint rather than an `access_token` error body, the usual cause is that the `redirect_uri` does not exactly match what is registered under your Authorization Callback Domain. That triage is in [OAuth redirect URI mismatch](/fix/oauth-redirect-uri-mismatch).\n\n## The program context, and what it does not explain\n\nStrava's developer program has tightened since 2024: formal Standard and Extended Access tiers with Standard serving a limited number of athletes, a program review with display and branding rules covering the \"Connect with Strava\" button and screenshots of every surface where Strava data appears, athlete-consent requirements that must be visible in your UI, restrictions on routing data through intermediary platforms, and a reported paid Strava subscription now gating Standard tier access. Those are real constraints on whether your application keeps access, and the audit they imply is laid out in [adapting to Strava's API changes](/migrate/adapt-to-strava-api-changes).\n\nWhat our sources do not establish is any link between those program rules and a 401 status code. So do not let a compliance theory displace the token diagnosis: check the body, check `expires_at`, check the rotation, and only then go read the current agreement. For the cross-provider triage — how 401 differs from 403, what the `WWW-Authenticate` header adds, and how Fitbit, Garmin, Oura and WHOOP each name the same conditions — start at [fitness API 401 unauthorized](/fix/fitness-api-401-unauthorized)."
  },
  {
    "slug": "healthkit-background-delivery-not-working",
    "primaryQuery": "healthkit background delivery not working",
    "h1": "HealthKit Background Delivery Not Working: Why Your Observer Never Fires",
    "metaTitle": "Fix HealthKit Background Delivery That Never Fires",
    "metaDescription": "Your HKObserverQuery never wakes? Check the entitlement, where the query is registered, the completion handler, and Apple's documented frequency ceiling.",
    "updated": "2026-08-12",
    "answer": "If your HKObserverQuery never fires while your app is backgrounded, work down four documented gates before you suspect a bug. Since iOS 15 and watchOS 8 you must add the com.apple.developer.healthkit.background-delivery entitlement, which defaults to false; without it Apple documents that enableBackgroundDelivery(for:frequency:withCompletion:) fails with an HKError.Code.errorAuthorizationDenied error. Apple states on two separate pages that background server queries are not supported on the Simulator, so a Simulator test proves nothing. Observer queries must be set up in the app delegate's application(_:didFinishLaunchingWithOptions:) method so they exist before HealthKit delivers to a freshly launched process. And you must call the update's completion handler: if your app fails to respond three times, Apple documents that HealthKit assumes it cannot receive data and stops sending background updates.",
    "steps": [
      {
        "name": "Read the success flag and error from enableBackgroundDelivery",
        "text": "Apple's completion block passes a Boolean success value and an error object. Most apps discard both. Log them. An HKError.Code.errorAuthorizationDenied here means the entitlement is missing, not that the user denied anything, and no observer query will ever wake until you fix it."
      },
      {
        "name": "Add the background-delivery entitlement",
        "text": "Apple documents com.apple.developer.healthkit.background-delivery as a Boolean that indicates whether observer queries receive updates while running in the background, available from iOS 15, iPadOS 15, watchOS 8, and visionOS 1. The default value is false, so add the key explicitly and set it to true in the signed build you are actually testing."
      },
      {
        "name": "Register observer queries at launch, not lazily",
        "text": "Apple states that as soon as your app launches, HealthKit calls the update handler for any observer queries that match the newly saved data, and that if you plan on supporting background delivery you should set up all your observer queries in the app delegate's application with didFinishLaunchingWithOptions method. A query created later in a view controller does not exist when the wake arrives."
      },
      {
        "name": "Call the update completion handler on every code path",
        "text": "Apple documents that you must call the block as soon as you are done processing the incoming data, and that if you do not, HealthKit retries using a backoff algorithm and stops sending background updates after three failures. Put the call in a defer so an early return, a thrown error, or a timed-out network call cannot skip it."
      },
      {
        "name": "Fetch the actual data with a second query",
        "text": "Apple notes that the observer query's update handler does not receive any information about the change, just that a change occurred, and that you must execute another query such as an HKSampleQuery or HKAnchoredObjectQuery to access it. An observer that fires and finds nothing is usually an observer nobody asked for data."
      },
      {
        "name": "Check the frequency ceiling for your data type",
        "text": "Apple defines frequency as the maximum frequency of the updates, waking your app at most once per period. Some sample types have a maximum of hourly and Apple says the system enforces this frequency transparently, naming step count on iOS. Requesting immediate for such a type is inert rather than an error."
      },
      {
        "name": "Verify on a physical device",
        "text": "Apple prints the same sentence on both the enableBackgroundDelivery and HKObserverQuery pages: background server queries are not supported on the Simulator, and you should test your background queries on a device. Move the test to real hardware before you conclude anything about your implementation."
      }
    ],
    "faqs": [
      {
        "q": "Why does enableBackgroundDelivery fail with errorAuthorizationDenied when the user already granted access?",
        "a": "Because that error is about your entitlement, not the person's choice. Apple documents that for iOS 15 and watchOS 8 and later you must enable HealthKit Background Delivery by adding the com.apple.developer.healthkit.background-delivery entitlement to your app, and that if your app does not have it, the method fails with an HKError.Code.errorAuthorizationDenied error. The entitlement is a Boolean whose default value is false, so it has to be added explicitly and present in the signed build you are testing. The fastest way to see this is to stop discarding the completion block's error argument."
      },
      {
        "q": "My observer query fires but finds nothing new. What is wrong?",
        "a": "Probably nothing, because an observer query is not designed to carry data. Apple states that the update handler does not receive any information about the change, just that a change occurred, and that you must execute another query, for example an HKSampleQuery or HKAnchoredObjectQuery, to access the changes. If you are already running a second query, the other documented explanation is a locked device: Apple notes the system encrypts the HealthKit store when the user locks the device, so your app may not be able to read from the store while it runs in the background, and our architecture guide records that surfacing as errorDatabaseInaccessible. Treat that as retryable rather than as an absence of data."
      },
      {
        "q": "Which HealthKit types can be registered for background delivery?",
        "a": "Apple documents the type parameter as accepting an HKCharacteristicType, HKQuantityType, HKCategoryType, or HKWorkoutType, and states outright that HKCorrelationType is not a supported type for background delivery. That asymmetry catches people, because the matching disableBackgroundDelivery method does list HKCorrelationType among the classes it accepts. If you are trying to observe a correlation such as a blood pressure reading, register the underlying quantity types instead."
      },
      {
        "q": "Why does my observer query never fire in the iOS Simulator?",
        "a": "Because Apple does not support it there. The sentence appears on both the enableBackgroundDelivery reference and the HKObserverQuery reference: background server queries are not supported on the Simulator, and you should be sure to test your background queries on a device. There is no flag or workaround, which means Simulator-based CI cannot cover this path at all and a green Simulator run is not evidence your background delivery works. Move the test to real hardware before changing any code."
      },
      {
        "q": "How many background updates can a watchOS app receive in an hour?",
        "a": "Apple documents that in watchOS, background updates share a budget with WKApplicationRefreshBackgroundTask tasks, and that your app can receive four updates or background app refresh tasks an hour as long as it has a complication on the active watch face. Read the whole sentence, because the complication is the condition on the budget rather than a suggestion. Apple also documents that in watchOS most data types have an hourly maximum frequency, with a named exception list that can reach immediate, including high heart rate, low heart rate, and irregular heart rhythm events, VO2 max, and number of times fallen."
      }
    ],
    "related": [
      {
        "href": "/healthkit-queries/hkobserverquery-background-delivery",
        "label": "HKObserverQuery and enableBackgroundDelivery"
      },
      {
        "href": "/fix/healthkit-no-data",
        "label": "HealthKit returning no data"
      },
      {
        "href": "/fix/healthkit-authorization-denied",
        "label": "HealthKit authorization denied"
      },
      {
        "href": "/architecture/background-sync",
        "label": "Designing background sync that survives missed wakes"
      },
      {
        "href": "/test/healthkit-integration",
        "label": "Testing a HealthKit integration"
      }
    ],
    "cta": {
      "pitch": "Half of what developers repeat about HealthKit background delivery is folklore and the other half is one sentence buried in a reference page. We read the primary sources and publish the difference — subscribe for the next teardown."
    },
    "body": "The code looks right. There is an `HKObserverQuery`, there is a call to `enableBackgroundDelivery`, the app reads steps perfectly when it is open, and the update handler has never once run while the phone was in a pocket. Almost every instance of this is one of a small set of documented gates, and four of them are stated in a single paragraph of Apple's reference page that most people skim past on the way to the code sample.\n\nWork them in order. Each one is cheap to check and each one, on its own, is sufficient to produce total silence.\n\n## Gate 1: the entitlement you probably do not have\n\nApple's requirement is unambiguous. For iOS 15 and watchOS 8 and later, you must enable HealthKit Background Delivery by adding the `com.apple.developer.healthkit.background-delivery` entitlement to your app, and if your app does not have it, `enableBackgroundDelivery(for:frequency:withCompletion:)` fails with an `HKError.Code.errorAuthorizationDenied` error.\n\nTwo things make this the number-one cause. First, the entitlement is documented as a Boolean whose default value is false — it is available from iOS 15, iPadOS 15, watchOS 8 and visionOS 1, but you get nothing unless you add the key deliberately. Second, the error is easy to miss, because Apple hands it to you through a completion block whose arguments almost everybody throws away:\n\n```swift\nhealthStore.enableBackgroundDelivery(for: stepType, frequency: .hourly) { success, error in\n    // Both of these are load-bearing. Log them.\n    if let error {\n        // errorAuthorizationDenied here means the ENTITLEMENT is missing,\n        // not that the user denied anything.\n        log.error(\"background delivery not enabled: \\(error)\")\n        return\n    }\n    log.info(\"background delivery enabled: \\(success)\")\n}\n```\n\nNote the wording trap in the error name. `errorAuthorizationDenied` reads like a permission refusal, and permission refusal in HealthKit is a topic with its own long list of surprises — covered in [HealthKit authorization denied](/fix/healthkit-authorization-denied). Here it means nothing of the kind. The user is not involved.\n\n## Gate 2: the Simulator will never do this\n\nApple prints the same sentence twice, once on the `enableBackgroundDelivery` reference and again on the `HKObserverQuery` reference: background server queries are not supported on the Simulator, and you should be sure to test your background queries on a device.\n\nThere is no flag and no partial credit. If your only evidence that background delivery does not work is a Simulator session, you have no evidence at all. This also means a Simulator-based CI pipeline covers none of this path, which is the honest boundary drawn in [testing a HealthKit integration](/test/healthkit-integration). Move to real hardware before you change a line.\n\n## Gate 3: the query does not exist when the wake arrives\n\nThis one produces the most confusing symptom, because everything looks correct in the foreground.\n\nApple documents the launch sequence directly: as soon as your app launches, HealthKit calls the update handler for any observer queries that match the newly saved data, and if you plan on supporting background delivery, you should set up all your observer queries in your app delegate's `application(_:didFinishLaunchingWithOptions:)` method. Apple's own explanation for why is the part to internalise — registering there ensures the queries are instantiated and ready to use before HealthKit delivers the updates.\n\nA background wake launches your process. If your observer is created inside a view controller's setup, or behind a feature flag that resolves after a network call, or on first navigation to a screen, then at the moment HealthKit tries to deliver there is no matching query in the process and the delivery goes nowhere. In the foreground you always happen to have visited that screen, so it always works.\n\n## Gate 4: three missed acknowledgements and you are switched off\n\nApple's completion-handler documentation contains the single most consequential sentence in this whole area. You must call the block as soon as you are done processing the incoming data; if you do not, HealthKit continues to attempt to launch your app using a backoff algorithm, and if your app fails to respond three times, HealthKit assumes your app cannot receive data and stops sending you background updates.\n\nRead that as a strike count, not as a retry policy. The handler is the heartbeat that keeps the channel alive, and the place people forget it is the error path — a thrown error, an early return on a nil unwrap, an upload that times out before the line is reached. Three of those and the install is done receiving background deliveries, which is exactly the \"it worked last week\" report you will get from QA.\n\n```swift\nlet observer = HKObserverQuery(sampleType: stepType, predicate: nil) { _, completionHandler, error in\n    // Acknowledge on EVERY path, including the failure branch.\n    defer { completionHandler() }\n\n    if error != nil { return }\n    // Persist locally first, then acknowledge, then upload asynchronously.\n    ingestFromPersistedAnchor()\n}\nhealthStore.execute(observer)\n```\n\n## Symptom to cause\n\n| Symptom | What it means | What to do |\n| --- | --- | --- |\n| `enableBackgroundDelivery` reports an error you never logged | Missing entitlement, surfacing as `errorAuthorizationDenied` | Add the entitlement, set it true, re-sign |\n| Nothing fires, ever, on a Simulator | Unsupported by design | Test on a device |\n| Works in the foreground, silent in the background | Observer registered too late in the launch path | Register in the app delegate's launch method |\n| Fired a few times, then stopped permanently | Three unacknowledged deliveries | Call the completion handler in a `defer` |\n| Fires, but you see no new samples | The observer carries no payload | Run an anchored object query from inside the handler |\n| Fires far less often than requested | `frequency` is a documented ceiling | Design for eventual delivery, not a cadence |\n| Requested `.immediate` for steps on iOS, still hourly | Hourly maximum, enforced transparently | Expect hourly at best for that type |\n| Wake happens but the read fails or is empty | Store encrypted while the device is locked | Retry after unlock; still acknowledge |\n| A correlation type is silently never delivered | `HKCorrelationType` is unsupported here | Register the underlying quantity types |\n\n## The four things that look like failures and are not\n\n**The observer is a doorbell, not a parcel.** Apple is explicit that the update handler does not receive any information about the change, just that a change occurred, and that you must execute another query — an `HKSampleQuery` or an `HKAnchoredObjectQuery` — to access the changes. An anchored object query is usually the right second query, because Apple describes it as combining a snapshot of what is currently stored with a long-running query that responds to updates, returning an anchor corresponding to the last sample or deleted object it saw so subsequent runs return only newer objects.\n\n**`frequency` is a maximum, not a schedule.** Apple defines it as the maximum frequency of the updates, waking your app from the background at most once per time period specified. `HKUpdateFrequency` offers `immediate`, `hourly`, `daily` and `weekly`, described respectively as launching your app every time a change is detected, at most once an hour, at most once a day, and at most once per week. Nothing in that documentation promises a minimum rate.\n\n**Some types are capped no matter what you ask for.** Apple states that some sample types have a maximum frequency of hourly and that the system enforces this frequency transparently, giving step count on iOS as the example. In watchOS most data types are hourly-capped too, with a named exception list that can reach `immediate` — high heart rate, low heart rate and irregular heart rhythm events, environmental and headphone audio exposure events, low cardio fitness events, number of times fallen, VO2 max, handwashing and toothbrushing events. On watchOS there is also a budget: background updates share an allowance with `WKApplicationRefreshBackgroundTask`, four an hour, conditioned on the app having a complication on the active watch face.\n\n**A locked phone can turn a successful wake into an empty read.** Apple documents that the device encrypts the HealthKit store when the user locks it, so your app may not be able to read data from the store when it runs in the background. Writes still work and are cached until unlock. So a wake that produces nothing is not proof the user did nothing — and if your query comes back empty in the foreground too, that is a different investigation entirely, laid out in [HealthKit returning no data](/fix/healthkit-no-data).\n\n## After the gates\n\nOnce delivery is genuinely working, the remaining problem is that no amount of correct code makes a wake happen. Apple publishes a ceiling and a shutdown rule; it publishes no minimum rate, no latency figure and no delivery guarantee. That means a pipeline whose correctness depends on being woken is a pipeline that will eventually be wrong. Pair every wake with a foreground reconciliation and a server-side staleness check, so a missed delivery costs latency rather than a wrong number — the design is worked through in [background sync that does not depend on the phone waking up](/architecture/background-sync)."
  },
  {
    "slug": "healthkit-database-inaccessible",
    "primaryQuery": "healthkit errordatabaseinaccessible",
    "h1": "HealthKit errorDatabaseInaccessible: Reads Fail While the Device Is Locked",
    "metaTitle": "HealthKit errorDatabaseInaccessible: The Fix",
    "metaDescription": "Apple states reads fail while the device is locked but saves still work. Why this is a background-only failure, and how to retry it without losing data.",
    "updated": "2026-09-04",
    "answer": "HealthKit returns errorDatabaseInaccessible when your app queries the store while the device is locked. Apple's documentation states that reads fail in this state but saves still work: the data goes into a temporary file that is merged when the user unlocks the device. That makes this a background problem, because a foregrounded app is running on an unlocked device. Treat it as transient rather than terminal, resume the read after the device is unlocked, and never record the failed read as a gap in the user's history.",
    "body": "Your app wakes in the background, runs a HealthKit query, and the completion handler hands back `errorDatabaseInaccessible`. The same query works every single time you test it with the phone unlocked in your hand. Your predicate is fine, your authorization is fine, your entitlements are fine. The store was protected at the moment you asked, and that is the entire bug.\n\n## What Apple documents\n\nApple's documentation states the abstract for this case as: \"The HealthKit data is unavailable because it's protected and the device is locked.\" The discussion is unusually specific for a case in this enum, and it is worth reading whole:\n\n> This error occurs when your app queries for HealthKit data while the device is locked. You can, however, still save data. This data is saved into a temporary file, which is merged with HealthKit's data when the user unlocks their device.\n\nTwo facts fall out of that paragraph, and every design decision below rests on them. Queries fail while the device is locked. Saves do not — Apple states the data goes into a temporary file and is merged once the user unlocks. Everything else on this page is engineering practice, and is labelled as such rather than dressed up as documented behaviour. The case is listed on every platform in Apple's [HKError reference](/healthkit-errors), including watchOS.\n\n## The asymmetry is the whole design constraint\n\n| While the device is locked | What Apple's discussion states |\n| --- | --- |\n| Query for existing samples | Fails — this is the error you are holding |\n| Save new samples | Still permitted |\n| Where a save goes | Into a temporary file |\n| When it reaches HealthKit | When the user unlocks the device |\n\nMost sync code is written as read-then-reconcile-then-write, and that shape breaks in exactly one place under lock: the read. If your background job pulls the last day of samples, diffs them, and writes a derived summary back, the pull fails and the whole job aborts — even though the write half would have gone through. A job that can emit its writes independently of its reads keeps working on a locked phone. A job that cannot, stalls until the user picks up the device.\n\n## Why this only ever shows up in the background\n\nIn the foreground the error is nearly unreachable: if your UI is on screen, the device is unlocked. The paths that run with the screen off are the ones that meet a protected store — background delivery wake-ups, background refresh work, and anything you deliberately schedule overnight. Teams often move heavy syncing to quiet hours to spare the battery and the network, which is precisely when the phone is locked for the longest stretch. That is an optimisation straight into the failure mode.\n\nSo treat this error as a property of *when* your code runs, not of what it asks for. The surrounding mechanics — registering for wake-ups, finishing the work before the system suspends you — are covered in [background sync](/architecture/background-sync); if your wake path never fires at all, that is a different fault, and it starts at [HealthKit background delivery not working](/fix/healthkit-background-delivery-not-working).\n\n## Diagnosis order\n\n1. **Read the actual code, not the symptom.** Log the error domain and code and confirm you have `errorDatabaseInaccessible` rather than an empty result. An empty result is not an error and means something else entirely — see [HealthKit errorNoData](/fix/healthkit-error-no-data).\n2. **Reproduce on purpose.** Lock the device, trigger the wake path, and watch the failure appear. If you cannot reproduce it that way, the lock state is probably not your cause.\n3. **Check whether your saves fail too.** Per Apple's discussion, saving should still work while locked. If writes are failing as well, stop chasing lock state and start with the authorization state machine: [errorAuthorizationNotDetermined](/fix/healthkit-authorization-not-determined) covers the never-asked case.\n4. **Check what your job did with the failure.** Many teams discover the error was being caught, counted as \"zero new samples\", and written into a summary table as a gap. That is a data-quality bug wearing an error's clothes.\n\n## Retry design, as practice\n\nNone of the following is Apple's documented behaviour; it is how we would build around what Apple documents.\n\n- **Classify it as transient, in its own bucket.** Terminal conditions such as an unsupported device or an [MDM restriction](/fix/healthkit-data-restricted-mdm) will never succeed on retry. This one will succeed the moment the user unlocks. Same failure shape, opposite handling.\n- **Do not spin.** A tight retry loop inside a background wake-up burns your execution window against a device that may stay locked for hours, and buys nothing.\n- **Resume on unlock, not on a timer.** The condition you are waiting for is a user action. Re-run the work when the app next becomes active, or on the next wake-up after the device has been unlocked, rather than scheduling blind retries through the night.\n- **Keep a durable cursor.** If the read never happened, the cursor must not move. Checkpointing so an interrupted run resumes cleanly is the pattern in [incremental sync](/architecture/incremental-sync).\n- **Never record it as absence.** A locked store means \"we could not look\", which is not the same as \"there was nothing there\". Anything that feeds charts, streaks, or coaching logic should carry that distinction — [missing data and gaps](/architecture/missing-data-and-gaps) is the wider version of this argument.\n- **Say nothing to the user.** There is no in-app remedy to offer, and no dialog that helps. Fail quietly, retry later, and let the next successful sync fill in.\n\n## On the watch\n\nApple lists this case for watchOS along with the other platforms, so a workout or complication refresh that reads history can hit it too. Wrist-off and locked states on a watch are ordinary, not exceptional, so the same rule applies: buffer, resume, and never treat the failure as a gap. The execution model that decides when your watch code runs at all is set out in [Apple Watch background execution](/watch-apps/apple-watch-background-execution).\n\n## Symptom to action\n\n| What you observe | What it means | What to do |\n| --- | --- | --- |\n| Background read fails, foreground read works | The store was protected while locked | Retry after unlock; keep the cursor |\n| Reads and writes both fail | Not a lock problem | Check authorization and setup |\n| Query returns empty with no error | Not this error at all | Read [errorNoData](/fix/healthkit-error-no-data) |\n| Failure repeats forever on the same device | Terminal, not transient | Check unavailable or restricted cases |\n\n## Where to go next\n\nIf you are still deciding which HealthKit failures deserve a retry policy at all, the full enum with Apple's own wording is at [the HKError reference](/healthkit-errors), and the honest limits of that reference — cases Apple ships with no description whatsoever — are covered in [undocumented HealthKit errors](/fix/healthkit-undocumented-errors). For the end-to-end setup this error assumes you already have, see the [HealthKit integration guide](/integrate/healthkit).",
    "faqs": [
      {
        "q": "Why does my background HealthKit read fail when the same query works in the app?",
        "a": "Because the device was locked when the background job ran. Apple's documentation states this error occurs when your app queries HealthKit data while the device is locked. In the foreground the device is unlocked by definition, so the identical query succeeds. The difference is timing and lock state, not your predicate, entitlements, or authorization setup."
      },
      {
        "q": "Can my app still save HealthKit data while the device is locked?",
        "a": "Apple's discussion states that you can still save data while the device is locked. It says the data is written into a temporary file, which is merged with HealthKit's data when the user unlocks their device. So a job that only reads will fail, while a job that only writes keeps working, which is a useful thing to design around."
      },
      {
        "q": "Should I retry immediately after errorDatabaseInaccessible?",
        "a": "As a practice, no. A tight retry loop burns your background execution window against a device that may stay locked for hours. Classify the failure as transient, leave your sync cursor where it was, and re-run the work when the app next becomes active or on a wake-up after the device has been unlocked."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-background-delivery-not-working",
        "label": "HealthKit background delivery not working"
      },
      {
        "href": "/architecture/background-sync",
        "label": "Background sync architecture"
      },
      {
        "href": "/healthkit-errors",
        "label": "Every HKError case, in Apple's words"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "We read Apple's HealthKit documentation line by line so your background sync does not learn these rules from a production incident. Subscribe for the next breakdown."
    },
    "steps": [
      {
        "name": "Log the raw error code",
        "text": "Record the error domain and code rather than a generic message, and confirm you are holding errorDatabaseInaccessible rather than an empty result or a different failure. The two need opposite handling."
      },
      {
        "name": "Reproduce with the device locked",
        "text": "Lock the device, trigger the background path, and watch the failure appear. If it will not reproduce that way, lock state is probably not your cause."
      },
      {
        "name": "Confirm your saves still succeed",
        "text": "Apple's discussion states saving still works while locked. If your writes are failing too, stop chasing lock state and check the authorization and setup path instead."
      },
      {
        "name": "Classify it as transient, not terminal",
        "text": "Put it in a separate bucket from unsupported-device and restricted errors, which will never succeed on retry. This one succeeds as soon as the user unlocks."
      },
      {
        "name": "Resume on unlock rather than on a timer",
        "text": "Re-run the work when the app becomes active or on the next wake-up after an unlock, instead of scheduling blind retries through the night."
      },
      {
        "name": "Keep the cursor and never write a gap",
        "text": "If the read never happened, the sync cursor must not advance and nothing should be recorded as zero or missing. A locked store means you could not look, not that there was nothing there."
      }
    ]
  },
  {
    "slug": "healthkit-health-data-unavailable",
    "primaryQuery": "healthkit errorhealthdataunavailable",
    "h1": "HealthKit errorHealthDataUnavailable: The Device Does Not Support HealthKit",
    "metaTitle": "HealthKit errorHealthDataUnavailable: What to Do",
    "metaDescription": "Apple says to verify HealthKit support before calling any other method. Why the check belongs at every entry point, and how to degrade instead of erroring.",
    "updated": "2026-09-04",
    "answer": "Apple's documentation states that errorHealthDataUnavailable means the user accessed HealthKit on an unsupported device. Apple's discussion tells you to verify that the current device supports HealthKit before calling any other HealthKit method, because iOS apps can run on devices that do not support it. There is nothing to retry and nothing the user can change, so the only useful response is to detect the condition and hide the feature rather than showing an error. In practice the bug is usually coverage: the availability check exists in your launch path but not in the widget, extension, or background wake-up that actually made the call.",
    "body": "Every HealthKit call in your app is failing on one tester's device with `errorHealthDataUnavailable`, and working perfectly on yours. This is not a permissions problem, a signing problem, or a race. Apple's abstract for the case is a single sentence: \"The user accessed HealthKit on an unsupported device.\" The device cannot do HealthKit at all, and no amount of retrying, re-requesting, or reinstalling will change that.\n\n## What Apple documents\n\nApple's documentation states the abstract above, and the discussion tells you both the cause and the required defence:\n\n> Because iOS apps can run on devices that don't support HealthKit (for example, on an iPad), always verify that the current device supports HealthKit by calling [the availability check] before calling any other HealthKit methods. If HealthKit isn't available on the device, other HealthKit methods fail with an [errorHealthDataUnavailable] error.\n\nThe bracketed names are ours: Apple's page links two symbols inline, and those link labels do not survive extraction into plain text. The availability check Apple means is the store's `HKHealthStore.isHealthDataAvailable()`, which is the same guard used in our [HealthKit no data](/fix/healthkit-no-data) walkthrough.\n\nNote precisely what Apple's instruction says, because it is stronger than most teams implement: verify **before calling any other HealthKit methods**. Not before your first query. Not once at launch. Before any of them.\n\nOn the iPad point, keep to what the text supports. Apple's example is that iOS apps can run on devices that don't support HealthKit, and iPad is the example given. That is a statement about your app running somewhere HealthKit isn't, not a rule about any particular iPad model or release. Apple's platform list for the error case itself includes iPadOS — but that describes where the symbol exists, not where HealthKit works. Check availability at runtime and you never have to reason about which hardware is on the other end.\n\n## Why the check belongs at every entry point\n\nA modern app is not one process with one launch path. HealthKit code gets reached from places that never run your launch-time warm-up:\n\n| Entry point | Runs your launch-time check? |\n| --- | --- |\n| Cold app launch into your main UI | Yes |\n| Widget or complication timeline reload | No |\n| Background delivery wake-up | Not necessarily |\n| A watch app launched on its own | No |\n| A deep link straight into a detail screen | Sometimes |\n| A share or intent extension | No |\n\nAny of those can be the first HealthKit call in the process. If the guard lives only in your launch sequence, the guard is not protecting the calls that matter. Practice: put the check behind one accessor that every HealthKit path goes through, and make the unavailable result a first-class value your feature code has to handle — not an optional early return someone can forget.\n\n## Diagnosis order\n\n1. **Confirm the code.** Log domain and code. `errorHealthDataUnavailable` is device capability. If you are actually seeing a restriction imposed by a management profile, that is a different case with different messaging — see [HealthKit restricted by an MDM profile](/fix/healthkit-data-restricted-mdm).\n2. **Check where the failing call came from.** If your app works but your widget or watch extension fails, you have a coverage problem, not a device problem.\n3. **Check the target.** A Mac or a simulator target you did not intend to support will produce this class of failure long before a user ever does. Testing strategy for exactly this is in [testing a HealthKit integration](/test/healthkit-integration).\n4. **Only then, believe the device.** Once the guard is genuinely universal and still reports unavailable, the answer is that this device does not do HealthKit, and your job shifts from fixing to degrading.\n\n## Degrade, do not error\n\nThere is nothing for the user to fix here, so an error dialog is a dead end. What works, as practice:\n\n- **Hide, don't disable.** A greyed-out Health toggle invites a support ticket. On an unsupported device, the Health integration is not a feature that is off; it is a feature that does not exist.\n- **Keep the rest of the app whole.** Anything that does not depend on the store — logging a session by hand, browsing plans, camera-based tracking — should still work. An app that refuses to launch because HealthKit is missing is a self-inflicted outage.\n- **Have an alternative input path.** If your product's core loop needs body or activity data, manual entry or a connected device is the fallback. Cross-platform teams usually solve this at the source layer instead, which is the shape argued in [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect).\n- **Log it once, quietly.** It is useful telemetry — how many of your installs cannot use the feature at all — and useless as an alert.\n\n## Do not confuse it with the other silent failures\n\n| What you see | Case | Fixable in code? |\n| --- | --- | --- |\n| Every HealthKit call fails on one device | `errorHealthDataUnavailable` | No — degrade the feature |\n| Every call fails on a managed corporate device | `errorHealthDataRestricted` | No — explain the policy |\n| Calls work, queries return empty | Not an error at all | Sometimes — check the query |\n| Save fails after the user was asked | `errorAuthorizationDenied` | No — route to system settings |\n| Query fails before you ever asked | `errorAuthorizationNotDetermined` | Yes — [request first](/fix/healthkit-authorization-not-determined) |\n\nThe first two of those are the pair Apple's own discussions treat as a set: both tell you to run the same availability check before calling anything else. Everything below the line is a state machine problem inside a device that supports HealthKit perfectly well.\n\n## The watch case\n\nApple lists the case for watchOS too. A watch app is its own process with its own launch, so it needs its own guard rather than inheriting a conclusion the phone reached. The division of labour between the two is set out in [HealthKit on Apple Watch](/watch-apps/healthkit-on-apple-watch).\n\n## Where to go next\n\nThe complete enum, with Apple's wording for each case and an honest marker on the cases Apple never described, is the [HealthKit error reference](/healthkit-errors). For the types you can request once you know the device supports them, use the [HealthKit identifier reference](/healthkit-identifiers). And for the setup this error assumes — capability, usage descriptions, request flow — see the [HealthKit integration guide](/integrate/healthkit).",
    "faqs": [
      {
        "q": "What does errorHealthDataUnavailable actually mean?",
        "a": "Apple's abstract states that the user accessed HealthKit on an unsupported device. It is a capability fact about the hardware or platform, not a permission decision by the person using it. No retry, reinstall, or new authorization request will change the answer, so your app should treat the Health integration as absent rather than broken on that device."
      },
      {
        "q": "Where should the HealthKit availability check go?",
        "a": "Apple's discussion says to verify support before calling any other HealthKit method. In practice that means every entry point, not just app launch: widgets, complications, extensions, background wake-ups, deep links, and a watch app all start HealthKit work without running your onboarding. Put the check behind a single accessor that every HealthKit path has to pass through."
      },
      {
        "q": "Does this error mean HealthKit never works on iPad?",
        "a": "Apple's discussion gives iPad as an example of a device an iOS app can run on that does not support HealthKit. That is an example, not a rule about any particular model or release, so do not hard-code assumptions about hardware. Check availability at runtime and the question never has to be answered in your code."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-data-restricted-mdm",
        "label": "HealthKit restricted by an MDM profile"
      },
      {
        "href": "/test/healthkit-integration",
        "label": "Testing a HealthKit integration"
      },
      {
        "href": "/healthkit-errors",
        "label": "Every HKError case, in Apple's words"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Capability checks, silent failures, and the parts of HealthKit Apple documents in one sentence — we take them apart as we verify them. Subscribe for the next one."
    },
    "steps": [
      {
        "name": "Confirm which case you have",
        "text": "Log the error domain and code. An unsupported device and a management-profile restriction arrive in the same catch block and need completely different messages."
      },
      {
        "name": "Find the calling process",
        "text": "Note whether the failure came from the main app, a widget, an extension, a background wake-up, or the watch app. A failure only outside the main app means missing coverage, not an unsupported device."
      },
      {
        "name": "Route every path through one availability gate",
        "text": "Put the check behind a single accessor that all HealthKit work goes through, and make the unavailable result a value feature code must handle rather than an early return someone can forget."
      },
      {
        "name": "Hide the feature instead of disabling it",
        "text": "On an unsupported device the Health integration does not exist. A greyed-out toggle produces support tickets; an absent section does not."
      },
      {
        "name": "Keep the rest of the app working",
        "text": "Manual logging, plan browsing, and camera-based tracking do not need the store. An app that refuses to function without HealthKit turns a device limitation into an outage."
      },
      {
        "name": "Log it once as telemetry",
        "text": "Count how many installs cannot use the feature at all, separately from restricted devices and denied permissions. It is useful product data and a useless alert."
      }
    ]
  },
  {
    "slug": "healthkit-data-restricted-mdm",
    "primaryQuery": "healthkit errorhealthdatarestricted mdm",
    "h1": "HealthKit errorHealthDataRestricted: An MDM Profile Turned HealthKit Off",
    "metaTitle": "HealthKit Restricted by MDM: Detect and Explain",
    "metaDescription": "Apple states an MDM profile can disable HealthKit on a managed device. You cannot fix that in code — here is how to detect it and what to tell the user.",
    "updated": "2026-09-04",
    "answer": "Apple's documentation states that errorHealthDataRestricted means a Mobile Device Management profile restricts the use of HealthKit on this device. Apple's discussion adds that you should verify the device supports HealthKit before calling any other HealthKit method, because a managed profile can disable it entirely. No code change, permission request, or retry will lift the restriction: only whoever administers the device can. The engineering work is therefore detection and honest messaging — model it as a distinct state, point the user at their administrator rather than at Settings, and keep a manual path so the rest of the app still works.",
    "body": "Your app works on every device in the office and fails on every device at the customer. The calls come back with `errorHealthDataRestricted`, the user swears they granted permission, and the Health app looks normal to them. Nothing in your code caused this and nothing in your code will undo it: an administrator turned HealthKit off on that device.\n\n## What Apple documents\n\nApple's documentation states the abstract as: \"A Mobile Device Management (MDM) profile restricts the use of HealthKit on this device.\" The discussion adds the mechanism and the defence:\n\n> Because an MDM profile can disable HealthKit on a managed device, always verify that the current device supports HealthKit by calling [the availability check] before calling any other HealthKit methods. If HealthKit is restricted (for example, in an enterprise environment), the methods fail with an [errorHealthDataRestricted] error.\n\nThe bracketed labels are ours — Apple links those symbols inline and the link text does not survive as plain text. The important word in the quote is *methods*, plural: the restriction is not scoped to one type or one operation, it is the framework being switched off underneath you.\n\nNote also that Apple gives this case the same instruction it gives [errorHealthDataUnavailable](/fix/healthkit-health-data-unavailable): check before calling anything else. Two different causes, one guard. That is convenient for your code and misleading for your copy, because the two conditions call for completely different things to say to the person holding the device.\n\n## You detect it; you do not fix it\n\n| Question | Answer |\n| --- | --- |\n| Can the user fix it in Settings? | No |\n| Can the user fix it in the Health app? | No |\n| Can your app request an exception? | No |\n| Who can change it? | Whoever manages the device |\n| Is it worth retrying? | No — it is terminal until policy changes |\n\nThis is the honest frame for the whole page. Everything you can do lives in two places: detect the condition before you build UI on top of it, and tell the truth about it afterwards.\n\n## Where it actually bites\n\nCorporate wellness is the obvious case, and the one where it is most expensive to discover late. You ship a step-challenge or benefits-linked app, the employer distributes it through their management system to managed handsets, and the same profile that pushed your app has HealthKit disabled. Every automatic data path in your product is dead on arrival for that population, while working flawlessly in your own testing. If that is your market, read this alongside [building a corporate wellness app](/build/corporate-wellness-app) before you design the onboarding.\n\nTwo adjacent situations to keep separate in your head:\n\n- **Managed devices in healthcare, education, and finance.** Restriction may be a blanket policy rather than a decision about your app specifically.\n- **Shared or borrowed devices.** A device someone else administers is not a device your user controls, whatever the login says.\n\nAnd one genuinely different failure that produces the same case name: on Apple Vision Pro, our [HealthKit authorization denied](/fix/healthkit-authorization-denied) guide records Apple's statement that a write attempted during a Guest User session fails with `errorNotPermissibleForGuestUserMode`, or with `errorHealthDataRestricted` on apps running in iOS 17. So a restricted error on that platform may be a guest session rather than a management profile — the details are in [Guest User mode](/fix/healthkit-guest-user-mode).\n\n## Diagnosis order\n\n1. **Log the exact code.** `errorHealthDataRestricted` and `errorHealthDataUnavailable` arrive at the same catch block and mean different things. If you collapse them into one \"HealthKit unavailable\" branch, your support team can never tell a corporate policy from an unsupported device.\n2. **Ask one question in your support flow.** \"Is this device managed by your employer or school?\" resolves most of these tickets in a single reply, and no log line does it faster.\n3. **Check the population, not the device.** If failures cluster by employer, domain, or enrolment cohort, you are looking at policy. If they are scattered across consumer installs, look at capability and setup instead.\n4. **Stop retrying.** A restriction does not lift because you asked again in an hour. Retry logic here just consumes background execution time you could spend on the users who can actually sync — see [background sync](/architecture/background-sync) for where that budget goes.\n\n## What to build instead, as practice\n\n- **A distinct state, not an error toast.** Model \"HealthKit restricted on this device\" as a real state in your app alongside \"not connected\" and \"connected\", and render it as an explanation rather than a failure.\n- **Copy that points at the right person.** Something like: this device's management profile has Health access turned off, so automatic tracking is unavailable; your IT administrator controls this setting. Do not send the user to Settings for a switch that is not there, and do not imply they did something wrong.\n- **A manual path that keeps the product usable.** Manual logging, a connected sensor, or camera-based tracking keeps the core loop alive without the store. Losing automation should not mean losing the app.\n- **Admin-facing documentation.** If you sell to employers, the buyer is the person who can change the policy. A short page telling their administrator which capability your app needs is worth more than any in-app message.\n- **Honest analytics.** Count restricted devices separately from unavailable ones and from denied permissions. Three causes, three numbers; blending them hides a fixable commercial problem inside an unfixable technical one.\n\n## Symptom to action\n\n| What you observe | Likely case | Who can change it |\n| --- | --- | --- |\n| All HealthKit calls fail on managed devices only | `errorHealthDataRestricted` | The device administrator |\n| All calls fail on one personal device | `errorHealthDataUnavailable` | Nobody — unsupported device |\n| Writes fail on Vision Pro, status says authorized | Guest session | The device owner |\n| Save fails after the permission sheet | `errorAuthorizationDenied` | The user, in system settings |\n| Query fails and you never requested | `errorAuthorizationNotDetermined` | You — [ask first](/fix/healthkit-authorization-not-determined) |\n\n## Where to go next\n\nApple's full wording for every case in the enum is collected in the [HealthKit error reference](/healthkit-errors), and the cases Apple ships with no description at all are handled in [undocumented HealthKit errors](/fix/healthkit-undocumented-errors). If you are still wiring the happy path, the [HealthKit integration guide](/integrate/healthkit) covers the setup this error interrupts.",
    "faqs": [
      {
        "q": "Can my app do anything about a HealthKit MDM restriction?",
        "a": "No. Apple's abstract describes it as a Mobile Device Management profile restricting the use of HealthKit on the device. There is no API to request an exception, no toggle in Settings or the Health app for the user, and nothing that changes on retry. Only the administrator who manages the device can change the policy."
      },
      {
        "q": "How do I tell a restricted device from an unsupported one?",
        "a": "By the error case, which is why they need separate log lines. Apple describes errorHealthDataRestricted as a management-profile restriction and errorHealthDataUnavailable as an unsupported device. Both fail every call and both tell you to run the same availability check first, but only one of them has a human on the other end who can change the answer."
      },
      {
        "q": "What should I show a user on a managed device?",
        "a": "As a practice, an explanation rather than an error. Say that this device's management profile has Health access turned off, that automatic tracking is unavailable, and that their IT administrator controls the setting. Do not send them to Settings for a switch that is not there, and offer a manual path so the app stays usable."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-health-data-unavailable",
        "label": "HealthKit unavailable on this device"
      },
      {
        "href": "/build/corporate-wellness-app",
        "label": "Building a corporate wellness app"
      },
      {
        "href": "/healthkit-errors",
        "label": "Every HKError case, in Apple's words"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Managed devices, guest sessions, and the other environments where your integration is switched off before it starts — we document them as we verify them. Subscribe for the next breakdown."
    },
    "steps": [
      {
        "name": "Log the exact error case",
        "text": "Keep errorHealthDataRestricted and errorHealthDataUnavailable in separate branches and separate counters. Collapsing them hides a commercial problem inside a technical one."
      },
      {
        "name": "Ask one question in support",
        "text": "Adding is this device managed by your employer or school to your support flow resolves most of these tickets faster than any log line."
      },
      {
        "name": "Look at the population, not the device",
        "text": "If failures cluster by employer, domain, or enrolment cohort, it is policy. If they are scattered across consumer installs, look at device capability and app setup instead."
      },
      {
        "name": "Stop retrying",
        "text": "A restriction does not lift because you asked again later. Retry logic here spends background execution budget that users who can sync would otherwise get."
      },
      {
        "name": "Model restricted as a real app state",
        "text": "Render it alongside not connected and connected, with copy that points at the administrator rather than blaming the user or their settings."
      },
      {
        "name": "Keep a manual path and brief the buyer",
        "text": "Manual logging or a connected sensor keeps the core loop alive, and a short admin-facing note tells the person who can actually change the policy what your app needs."
      }
    ]
  },
  {
    "slug": "healthkit-error-no-data",
    "primaryQuery": "healthkit errornodata",
    "h1": "HealthKit errorNoData: The Query Ran and Found Nothing",
    "metaTitle": "HealthKit errorNoData: Empty Is Not Broken",
    "metaDescription": "Apple returns errorNoData when a query has nothing to compute over. How it differs from a silent empty read, and why it usually is not a bug at all.",
    "updated": "2026-09-04",
    "answer": "Apple's documentation states that errorNoData means data is unavailable for the requested query and predicate, and that the system therefore cannot calculate the query's result. It is an explicit answer, not a silent one: HealthKit is telling you the window you asked about had nothing to compute from. That makes it different from an empty sample query, which returns no error and cannot distinguish a denied read from a type nobody has ever written to. In most cases the right handling is an empty state rather than an error, with no retry and no permission prompt.",
    "body": "Your statistics query does not come back empty. It comes back with an error — `errorNoData` — and the instinct is to treat that as a failure, log it loudly, and show the user something apologetic. Usually it is none of those things. In most cases it is HealthKit telling you, correctly, that there is nothing in the window you asked about.\n\n## What Apple documents\n\nApple's documentation states the abstract as: \"Data is unavailable for the requested query and predicate.\" The discussion is where the useful precision lives:\n\n> This error indicates that no data exists that corresponds to a particular query, so the system can't calculate the query's result. [Statistics] queries return this error when HealthKit can't return the data needed to calculate the statistics.\n\nThe bracket is ours: Apple links a query class inline there and the link label is lost in plain-text extraction, but the sentence's own words tell you the shape — this is the error you get when a query has to *compute* something and has nothing to compute from. A sum of zero samples is not zero; it is undefined, and Apple returns an error instead of inventing a number.\n\nTwo more facts worth keeping straight. Apple's abstract names the *query and predicate* together, so the error is scoped to what you asked for, not to the type in general. And this case is newer than most of the enum: Apple's platform list introduces it at iOS 14.0 and watchOS 7.0, which is why older codebases handle every query failure as one undifferentiated blob.\n\n## The distinction that matters: an error is not silence\n\nThis page owns one half of a pair, so let us be exact about the split.\n\n| What you get back | What it tells you |\n| --- | --- |\n| `errorNoData` from a statistics-style query | The query had nothing to compute over |\n| An empty array, no error, from a sample query | Nothing at all — see below |\n| A partial series with a recent start date | Possibly a limited-history grant |\n| A genuine failure code | A capability, lock, or authorization problem |\n\nThe second row is the trap. A sample query that returns empty is genuinely ambiguous — a denied read looks identical to a type nobody has ever written to. Our [HealthKit returning no data](/fix/healthkit-no-data) guide is the isolation procedure for that silence, and [what \"no data\" actually means](/blog/no-data-means-four-things) separates the distinct conditions that all render as nothing on screen. Neither of those is this page. Here, HealthKit told you something.\n\nThe other side of the pair is the state machine: if you never requested authorization at all, you get a different case entirely, covered in [errorAuthorizationNotDetermined](/fix/healthkit-authorization-not-determined).\n\n## Diagnosis order\n\n1. **Confirm the code is really `errorNoData`.** A single `catch` that logs \"query failed\" makes every case on this page indistinguishable. Log the raw domain and code before anything else; the argument for that discipline generalises in [undocumented HealthKit errors](/fix/healthkit-undocumented-errors).\n2. **Widen the predicate.** Re-run the same query over a much larger window. If results appear, the error was accurate and your window was empty — that is a UI question, not a bug. If it still errors with everything open, keep going.\n3. **Check the type, not the query.** Many identifiers are simply never populated on most devices: nothing writes them unless a specific sensor or app is present. Check the type against the [HealthKit identifier reference](/healthkit-identifiers) and ask whether any source on that device would plausibly produce it.\n4. **Check your day boundaries.** A window computed in UTC against samples recorded in local time can land squarely between the data. This is the most common self-inflicted version of \"no data\", and the failure mode is laid out in [timezones and day boundaries](/architecture/timezones-and-day-boundaries).\n5. **Check whether the store was even readable.** If the device was locked when the background job ran, you would see `errorDatabaseInaccessible` instead — a different failure with a retry policy attached, covered in [HealthKit database inaccessible](/fix/healthkit-database-inaccessible).\n6. **Consider that the read may be granted and the history short.** A grant limited to recent history returns a real result set that simply starts later than you expected; that behaviour and the one authorization state you can positively identify are documented in [HealthKit authorization denied](/fix/healthkit-authorization-denied).\n\n## Handling it, as practice\n\n- **Emptiness is a state, not an exception.** Render \"no data for this period\" as an ordinary result of the screen. An error dialog for a day the user did not wear their watch is a bug in your product, not in theirs.\n- **Do not coerce it to zero.** Writing a zero into your own store because a statistics query had nothing to average is how a rest day becomes a data point. That distinction has to survive all the way into your storage layer — the argument is in [missing data and gaps](/architecture/missing-data-and-gaps).\n- **Do not retry.** Nothing about the store changes between one attempt and the next. A retry loop against an empty window is pure battery cost.\n- **Do not treat it as a permissions signal.** It is tempting to show a \"grant access\" prompt when a query errors, and it is wrong: this error can arrive with perfect permissions, and re-prompting after a decision does nothing anyway.\n- **Separate it in telemetry.** Count `errorNoData` apart from real faults. If it is the top \"error\" in your dashboard, your dashboard is measuring user behaviour rather than reliability. Related reading: [the HealthKit error that never fires](/blog/healthkit-error-that-never-fires).\n\n## Symptom to action\n\n| What you observe | What it means | What to do |\n| --- | --- | --- |\n| Error on a narrow window, results on a wide one | Genuinely empty period | Render an empty state |\n| Error on every window for one type | Nothing writes that type on that device | Check the identifier and sources |\n| Error only in a background run | Possibly a locked store | Check for the database-inaccessible case |\n| Empty array with no error | Ambiguous by design | Run the write-then-read isolation |\n| Results start unexpectedly recently | Possibly a limited-history grant | Use the authorized start date |\n\n## Where to go next\n\nThe complete enum with Apple's own wording sits in the [HealthKit error reference](/healthkit-errors). If your problem is the ambiguous, silent version rather than this explicit one, start from [HealthKit returning no data](/fix/healthkit-no-data). And if you are building the pipeline that has to survive both across thousands of users, the [HealthKit integration guide](/integrate/healthkit) covers the plumbing underneath.",
    "faqs": [
      {
        "q": "Is errorNoData a bug in my query?",
        "a": "Usually not. Apple's abstract states that data is unavailable for the requested query and predicate, and the discussion says no data exists that corresponds to the query, so the system cannot calculate a result. Widen the window and re-run: if results appear, the original window was genuinely empty and your app should render an empty state."
      },
      {
        "q": "How is this different from a HealthKit query that returns an empty array?",
        "a": "An empty array carries no error and no information: a denied read looks exactly like a type with no samples, because Apple hides read authorization by design. errorNoData is an explicit statement that a computation had nothing to work from. One is ambiguous silence you have to isolate; the other is an answer you can act on directly."
      },
      {
        "q": "Should I ask the user for permission when I get errorNoData?",
        "a": "No. The error can arrive with permissions in perfect order, and re-requesting authorization after the user has already decided does not present the sheet again anyway. Treat it as a data question instead: check the window, the day boundaries, and whether anything on that device ever writes the type you asked for."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-no-data",
        "label": "HealthKit returning no data"
      },
      {
        "href": "/blog/no-data-means-four-things",
        "label": "What no data actually means"
      },
      {
        "href": "/architecture/missing-data-and-gaps",
        "label": "Handling missing data and gaps"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Empty, denied, unasked, and unavailable all look the same on screen and mean different things. We separate them as we verify them — subscribe for the next breakdown."
    },
    "steps": [
      {
        "name": "Confirm the code is really errorNoData",
        "text": "Log the raw domain and code. A single catch block that reports query failed makes an empty period indistinguishable from a locked store or a rejected argument."
      },
      {
        "name": "Widen the predicate",
        "text": "Re-run the same query over a much larger window. Results appearing means the error was accurate and your window was empty, which is a UI question rather than a bug."
      },
      {
        "name": "Check whether anything writes that type",
        "text": "Many identifiers are never populated unless a specific sensor or source app is present. Check the type in the identifier reference before assuming the query is at fault."
      },
      {
        "name": "Check your day boundaries",
        "text": "A window computed in one time zone against samples recorded in another can land between the data. This is the most common self-inflicted version of no data."
      },
      {
        "name": "Rule out a locked store",
        "text": "If the failure only happens in background runs, look for the database-inaccessible case instead, which is transient and deserves a retry after unlock."
      },
      {
        "name": "Render emptiness, do not coerce it",
        "text": "Show no data for this period as an ordinary result, and never write a zero into your own store because a statistic had nothing to average. A rest day is not a data point."
      }
    ]
  },
  {
    "slug": "healthkit-invalid-argument",
    "primaryQuery": "healthkit errorinvalidargument",
    "h1": "HealthKit errorInvalidArgument: Finding the Argument HealthKit Rejected",
    "metaTitle": "HealthKit errorInvalidArgument: What to Check",
    "metaDescription": "Apple documents one sentence and no discussion here. What that sentence supports, plus the argument surfaces worth checking, kept clearly apart.",
    "updated": "2026-09-04",
    "answer": "Apple's documentation states one sentence for errorInvalidArgument — the app passed an invalid argument to the HealthKit API — and publishes no discussion paragraph. So Apple tells you an argument was rejected, and nothing about which one or why. In practice the constraint usually lives in the type rather than the call: an aggregation the type does not support, a unit from the wrong family, a predicate filtering on something the type does not have, or a reversed date range. Treat it as a programming error rather than an environmental one, log the arguments you passed, and reduce the call until the failure disappears.",
    "body": "`errorInvalidArgument` is the bluntest case in the enum. Apple's documentation states one sentence — \"The app passed an invalid argument to the HealthKit API.\" — and stops. There is no discussion paragraph, no list of offending arguments, and no hint about which of the several things you handed the framework it disliked. So this page does two separate jobs: it says exactly what Apple documents, and then, clearly separated from that, it walks the argument surfaces worth checking in practice.\n\n## What Apple documents\n\nThe abstract quoted above is the entire published description of the case. Apple's platform list carries it back to the earliest HealthKit releases — iOS 8.0 and watchOS 2.0 — which fits a general-purpose validation failure rather than a feature-specific one. It is grouped with the other accessing errors in the [HKError reference](/healthkit-errors).\n\nWhat Apple does *not* say is which argument, why, or whether the same call would succeed with different inputs. Any page that tells you \"this error means your unit was wrong\" is filling that gap with inference. The rest of this one is inference too, and labelled as such — a checklist of what to inspect, not a claim about what the framework decided.\n\n## Read the error like a compiler diagnostic you cannot see\n\nThe mental model that works: something you passed did not satisfy a constraint that lives in the *type*, not in the call. HealthKit types carry their own rules about how they may be aggregated, what units they accept, and what may be attached to them, and a call that violates one of those rules is invalid regardless of how well-formed your code looks.\n\nThat reframes debugging. Instead of re-reading the call site, go and read the definition of the type you passed to it. The full set, with each identifier's own characteristics, is in the [HealthKit identifier reference](/healthkit-identifiers).\n\n## The argument surfaces worth checking, in order\n\n| Surface | What to verify |\n| --- | --- |\n| Type and aggregation option | The option you asked for is one the type supports |\n| Unit | The unit belongs to the type's unit family |\n| Predicate | It filters on something the type actually has |\n| Date range | Start precedes end, and both are real dates |\n| Statistics options | Compatible with each other, not just with the type |\n| Sample construction | Value, unit, and interval agree with the type's shape |\n\n### 1. Cumulative versus discrete\n\nThis is the classic, and it is worth understanding rather than memorising. Some quantity types accumulate across an interval, so the sensible aggregation is a sum. Others are point measurements sampled repeatedly, so the sensible aggregation is an average, a minimum, or a maximum. Ask a running total from a type that is a series of independent readings, or an average from a counter, and you are asking for something the type has no definition for.\n\nThe split runs through the whole identifier catalogue, and getting it wrong is the single most common source of both invalid arguments and quietly nonsensical numbers. [Sum or average](/blog/healthkit-sum-or-average) works through which types fall on which side and why it matters for the figure you put on screen.\n\n### 2. Units from the wrong family\n\nEach quantity type belongs to a unit family — a length, a mass, an energy, a count, a duration. Converting within the family is fine; presenting a value in a unit from another family is not a conversion at all. Check the unit family the identifier declares before you construct a quantity or format a result, especially in code paths that build units from user preferences or from a string.\n\n### 3. Predicates that do not apply\n\nA predicate filtering on a property the type does not carry is an invalid argument even though it compiles. This bites most often in generic query layers where one builder serves every type: the code path that adds a workout-specific filter runs against a quantity type, and the framework rejects it.\n\n### 4. Dates and intervals\n\nVerify start precedes end, that neither is a placeholder left over from an initialiser, and that an interval you supply for a bucketed query is positive. Day-boundary code that produces reversed or zero-width windows around daylight-saving changes is a real source of this — [timezones and day boundaries](/architecture/timezones-and-day-boundaries) covers why those calculations go wrong.\n\n### 5. Anything constructed from configuration\n\nTypes, units, and options assembled from a server response, a feature flag, or a saved preference are the arguments least likely to have been exercised by your tests. If the failure only happens for some users, look here first.\n\n## A diagnosis procedure\n\n1. **Log the full error, including the domain and code.** Then log the arguments you passed — type identifier, unit, options, predicate description, and window — as a single structured line. Most invalid-argument bugs are solved by reading that line, not by stepping through the code.\n2. **Reduce to the smallest call that still fails.** Strip the predicate, then the options, then narrow to one type. The argument you remove that makes the error disappear is your answer.\n3. **Rebuild from a known-good call.** Take a query you know works for a type of the same shape and swap one thing at a time.\n4. **Check the type's own documentation last.** By this point you know which argument is implicated, so you are looking up one fact rather than reading everything.\n5. **Add a test at the boundary.** Every generic query builder should have coverage for each family of type it can be handed; [testing a HealthKit integration](/test/healthkit-integration) is where that harness belongs.\n\n## Do not paper over it\n\n`errorInvalidArgument` is a programming error, not an environmental one, and it deserves the opposite handling from the runtime cases elsewhere in this cluster. A locked store is worth retrying and an unsupported device is worth degrading around, but a rejected argument will be rejected identically forever. Catching it and returning an empty result is how a permanent bug turns into a mysterious data gap that nobody can reproduce — and how it ends up misdiagnosed later as [no data](/fix/healthkit-error-no-data). Fail loudly in development, report it in production, and never silence it.\n\nBecause Apple publishes so little here, be careful about what you write in your own logs as well. \"Invalid argument — probably the unit\" is a guess that the next engineer will read as a finding. Record the arguments and let them draw the conclusion; the case for keeping raw codes and inferences apart is made in [undocumented HealthKit errors](/fix/healthkit-undocumented-errors).\n\n## Where to go next\n\nApple's wording for every case sits in the [HealthKit error reference](/healthkit-errors), the type catalogue is at [HealthKit identifiers](/healthkit-identifiers), and the surrounding setup is in the [HealthKit integration guide](/integrate/healthkit).",
    "faqs": [
      {
        "q": "What does Apple say causes errorInvalidArgument?",
        "a": "Only that the app passed an invalid argument to the HealthKit API. That abstract is the entire published description; there is no discussion paragraph naming which arguments qualify. Any source that tells you the case specifically means a unit problem or an options problem is inferring. Useful inference, but it should be labelled as inference rather than documentation."
      },
      {
        "q": "Why do cumulative and discrete types cause invalid arguments?",
        "a": "Because the aggregation you ask for has to be one the type can define. A type that accumulates over an interval supports a running total; a type that is a series of independent readings supports averages, minimums, and maximums. Asking a counter for an average, or a set of point readings for a sum, is asking for something undefined."
      },
      {
        "q": "Should I catch errorInvalidArgument and return an empty result?",
        "a": "No. Unlike a locked store or an unsupported device, a rejected argument will be rejected the same way forever, so catching it silently converts a permanent bug into a mysterious data gap nobody can reproduce. Fail loudly in development, report it in production, and log the arguments you passed alongside the code."
      }
    ],
    "related": [
      {
        "href": "/healthkit-identifiers",
        "label": "Every HealthKit type identifier"
      },
      {
        "href": "/blog/healthkit-sum-or-average",
        "label": "Sum or average: cumulative vs discrete"
      },
      {
        "href": "/healthkit-errors",
        "label": "Every HKError case, in Apple's words"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "We keep a verified map of every HealthKit type, its aggregation style, and its unit family, and we show the sentence each value came from. Subscribe as we extend it."
    },
    "steps": [
      {
        "name": "Log the arguments, not just the error",
        "text": "Record the type identifier, unit, options, predicate description, and window as one structured line beside the raw error code. Most of these bugs are solved by reading that line."
      },
      {
        "name": "Check the aggregation against the type",
        "text": "Confirm the option you asked for is one the type can define. Cumulative and discrete types support different aggregations, and mixing them up is the classic cause."
      },
      {
        "name": "Check the unit family",
        "text": "Each quantity type belongs to a unit family. Converting inside the family is fine; presenting a value in a unit from another family is not a conversion at all."
      },
      {
        "name": "Check the predicate and the dates",
        "text": "Verify the predicate filters on something the type actually has, that start precedes end, and that no placeholder date survived from an initialiser."
      },
      {
        "name": "Reduce to the smallest failing call",
        "text": "Strip the predicate, then the options, then narrow to one type. The argument whose removal makes the error disappear is your answer."
      },
      {
        "name": "Add a test at the boundary",
        "text": "Any generic query builder should be covered for each family of type it can be handed, especially where types or units are assembled from configuration rather than written in code."
      }
    ]
  },
  {
    "slug": "healthkit-authorization-not-determined",
    "primaryQuery": "healthkit errorauthorizationnotdetermined",
    "h1": "HealthKit errorAuthorizationNotDetermined: You Called Before You Asked",
    "metaTitle": "Fix HealthKit errorAuthorizationNotDetermined",
    "metaDescription": "Not determined means nobody has been asked yet, not that the user said no. The ordering rule Apple documents, and the entry points that keep breaking it.",
    "updated": "2026-09-04",
    "answer": "Apple's documentation states that errorAuthorizationNotDetermined means the app has not yet asked the user for the authorization required to complete the task, and that it occurs when your app does not request proper authorization before calling any other HealthKit method. It is not a refusal: nobody has been asked. That distinguishes it from a denied write, which Apple describes as the user not having given the app permission to save data. The fix is ordering, and the usual cause is coverage — a widget, extension, background wake-up, watch app, or newly added type that reaches the store without passing through the request you wrote for your onboarding flow.",
    "body": "`errorAuthorizationNotDetermined` is the one HealthKit error that is unambiguously your fault, and that is good news: it is also the one you can fix outright. It does not mean the user said no. It means nobody has been asked yet, and your code went ahead anyway.\n\n## What Apple documents\n\nApple's documentation states the abstract as: \"The app hasn't yet asked the user for the authorization required to complete the task.\" The discussion names the cause directly:\n\n> This error occurs when your app doesn't request proper authorization before calling any other HealthKit methods. For more information on setting up HealthKit, see HealthKit.\n\nNote the phrasing \"before calling any other HealthKit methods\" — the same ordering instruction Apple attaches to the device-capability cases. HealthKit's setup contract is sequential, and this error is what the framework returns when you break the sequence.\n\nCompare the abstract with the neighbouring case. Apple describes `errorAuthorizationDenied` as \"the user hasn't given the app permission to save data\", and its discussion states that the error \"occurs only when your app attempts to save data\". The two cases sit at different points of the same state machine, and conflating them produces the two worst UX outcomes in this whole area: nagging someone who already decided, and silently giving up on someone who was never asked.\n\n## The state machine, stated plainly\n\n| State | How you got here | The right move |\n| --- | --- | --- |\n| Never asked | Your code called before requesting | Request authorization |\n| Asked, user allowed the write | The sheet was shown and accepted | Proceed |\n| Asked, user refused the write | The sheet was shown and refused | Stop saving; route to system settings |\n| Asked, read outcome unknown | Always, for reads | Query and handle whatever comes back |\n\nThe last row is the asymmetry that makes HealthKit unlike every OAuth-shaped permission model your team has built before: the read side never reports its outcome. That is deliberate, and the reasoning plus the one exception are set out in [HealthKit authorization denied](/fix/healthkit-authorization-denied). The consequence for this page is narrow but important — \"not determined\" is a statement about *your request*, not about the user's answer.\n\n## Why perfectly correct code still hits it\n\nNobody writes a query before a request on purpose. It happens because a modern app has several front doors, and only one of them runs your onboarding.\n\n- **A widget or complication reload** wakes an extension that never saw your first-run flow.\n- **A background delivery wake-up** runs your sync path in a process that started from nothing; if the wake-up path calls the store before the request, this is the error you get. The wiring is covered in [HealthKit background delivery not working](/fix/healthkit-background-delivery-not-working).\n- **A watch app launched from the wrist** is its own process with its own lifecycle, described in [HealthKit on Apple Watch](/watch-apps/healthkit-on-apple-watch).\n- **A deep link into a detail screen** skips the onboarding stack the user would otherwise have walked through.\n- **A newly added type.** This is the subtle one: authorization is per type, so shipping a feature that reads a type you never included in the original request puts that type — and only that type — back in the never-asked state for every existing install.\n- **A race at launch.** A request in flight while a query fires from a different task is, from HealthKit's point of view, a query before a request.\n\n## Diagnosis order\n\n1. **Log which type failed.** If a subset of types fails and the rest work, you are almost certainly in the newly-added-type case, and the fix is to include it in your request set rather than to touch anything else.\n2. **Log which process failed.** Main app, extension, watch app, background wake-up. If it is never the main app, your request lives in the wrong place.\n3. **Check the ordering, not the outcome.** The question is whether a request completed before the call, not whether it was granted. A request that was fired but not awaited has not completed.\n4. **Do not re-prompt as a workaround.** Our [authorization denied](/fix/healthkit-authorization-denied) guide records Apple's documented behaviour that if the user has already decided every requested type, the request returns without prompting. A \"grant access\" button that re-requests will do nothing visible and leave the user stuck.\n5. **Separate this from empty results.** If your query *runs* and returns nothing, you are not in this case at all; that is the ambiguity handled in [HealthKit returning no data](/fix/healthkit-no-data), and the distinct conditions that all look like nothing are enumerated in [what \"no data\" actually means](/blog/no-data-means-four-things). The explicit, computed version of emptiness has its own case in [errorNoData](/fix/healthkit-error-no-data).\n\n## Fixing it, as practice\n\n- **Put the request behind one gate.** Every path that touches the store — app, widget, watch, background task — goes through a single accessor that guarantees a completed request first. Repeating the request logic per entry point guarantees one gets forgotten.\n- **Request the full set once, not type by type.** Declaring everything the feature needs up front avoids a second sheet later and keeps the never-asked state from reappearing per feature.\n- **Treat a type addition as a migration.** When you add a type in a release, existing users need a fresh request for it. Plan the moment you will ask, rather than discovering it in crash-free-but-empty telemetry.\n- **Await the request before the first call.** In background paths especially, make the ordering structural rather than incidental.\n- **Never assume the request means yes.** A completed request moves you out of not-determined; it says nothing about what the user chose on the read side.\n- **Never gate reads on an authorization check.** Run the query, render what comes back, and accept empty as a legitimate answer.\n\n## Symptom to action\n\n| What you observe | Case | Fix |\n| --- | --- | --- |\n| Save fails, you never requested | `errorAuthorizationNotDetermined` | Request first, then save |\n| Save fails after the sheet | `errorAuthorizationDenied` | Route the user to system settings |\n| One new type fails, others work | Not requested for that type | Add it to the request set |\n| Only the extension fails | Request missing on that path | Gate every entry point |\n| Query returns empty, no error | Not this case | Isolate with a write-then-read test |\n\n## Where to go next\n\nApple's wording for every case in the enum is collected in the [HealthKit error reference](/healthkit-errors); the types you can put in a request set are listed in the [HealthKit identifier reference](/healthkit-identifiers); and if the types you need are clinical records, the request is a different class of authorization with an all-or-nothing failure, covered in [required authorization denied](/fix/healthkit-required-authorization-denied). The setup around all of it is in the [HealthKit integration guide](/integrate/healthkit).",
    "faqs": [
      {
        "q": "Does not determined mean the user denied my app?",
        "a": "No. Apple's abstract states the app has not yet asked the user for the authorization required to complete the task. Nobody has made a decision. A refused write is a different case, which Apple describes as the user not having given permission to save data, and its discussion notes it occurs only when your app attempts to save."
      },
      {
        "q": "Why does this happen when my onboarding already requests authorization?",
        "a": "Because your onboarding is not the only way into HealthKit code. Widgets, extensions, background delivery wake-ups, a watch app launched from the wrist, and deep links can all make the first call in a process. Authorization is also per type, so a feature that reads a type missing from your original request set is back in the never-asked state."
      },
      {
        "q": "Can I just request authorization again to clear it?",
        "a": "Requesting is exactly right when the state really is not determined. It is the wrong reflex once decisions have been made: Apple documents that if the user has already chosen for all the specified types, HealthKit returns the request without prompting. A grant access button that re-requests then does nothing visible and leaves the user stuck."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-authorization-denied",
        "label": "HealthKit authorization denied"
      },
      {
        "href": "/blog/no-data-means-four-things",
        "label": "What no data actually means"
      },
      {
        "href": "/integrate/healthkit",
        "label": "Integrate Apple HealthKit"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "HealthKit's permission model punishes ordering mistakes quietly, in the paths you test least. We take the documentation apart as we verify it — subscribe for the next breakdown."
    },
    "steps": [
      {
        "name": "Log which type failed",
        "text": "If a subset of types fails while the rest work, you are in the newly-added-type case and the fix is to include it in your request set, not to change anything else."
      },
      {
        "name": "Log which process failed",
        "text": "Main app, extension, widget, watch app, or background wake-up. If the main app never fails, your request lives in the wrong place."
      },
      {
        "name": "Check ordering, not outcome",
        "text": "The question is whether a request completed before the call, not whether it was granted. A request that was fired but never awaited has not completed."
      },
      {
        "name": "Put the request behind one gate",
        "text": "Route every path that touches the store through a single accessor that guarantees a completed request first, instead of repeating the logic per entry point."
      },
      {
        "name": "Treat adding a type as a migration",
        "text": "Existing installs need a fresh request when you add a type in a release. Plan when you will ask rather than discovering it in empty-but-crash-free telemetry."
      },
      {
        "name": "Never gate reads on an authorization check",
        "text": "A completed request tells you nothing about the read side. Run the query, render what comes back, and accept an empty result as a legitimate answer."
      }
    ]
  },
  {
    "slug": "healthkit-required-authorization-denied",
    "primaryQuery": "healthkit errorrequiredauthorizationdenied",
    "h1": "HealthKit errorRequiredAuthorizationDenied: Clinical Records Are a Separate Class",
    "metaTitle": "HealthKit Required Authorization Denied: Fix",
    "metaDescription": "Required clinical record types fail as a block, and Apple does not say which one was refused. How to scope the requirement and degrade around a refusal.",
    "updated": "2026-09-04",
    "answer": "Apple's documentation states that errorRequiredAuthorizationDenied means the user has not granted the application authorization to access all the required clinical record types. The load-bearing word is all: this is not one refused permission but an incomplete set. Apple's discussion adds that you specify those required clinical record types with an Info.plist key, so the requirement lives in your app's configuration rather than in the request itself. Because Apple states the system does not tell your app which record types were denied, the only real lever you have is declaring fewer required types and designing a path that still works without them.",
    "body": "Authorization succeeded in testing and fails for real users with `errorRequiredAuthorizationDenied`, and nothing you change in your request set seems to help. This case does not behave like the rest of HealthKit's permission model: it belongs to clinical record types, it is declared in your app's configuration rather than in the request itself, and it fails as a block rather than per type.\n\n## What Apple documents\n\nApple's documentation states the abstract as: \"The user hasn't granted the application authorization to access all the required clinical record types.\" The discussion is a single sentence:\n\n> You can specify required clinical record types using the [required-read-authorization] Info.plist key.\n\nThe bracket is ours — Apple links the key by name and that label does not survive extraction to plain text. Apple's platform list introduces the case at iOS 12.0 and watchOS 5.0, later than the original accessing errors, which matches its scope: it exists for the clinical-records feature specifically.\n\nRead the abstract closely, because the load-bearing word is **all**. This is not a report that a permission was refused. It is a report that the set you declared as required was not granted in full.\n\nTwo further points are documented by Apple and quoted in our [HealthKit authorization denied](/fix/healthkit-authorization-denied) guide: Apple says to specify three or more types under that key, and that when authorization fails this way, \"the system doesn't tell your app which record types the person denied access to\". So you learn that the requirement was not met, and nothing about which part of it failed.\n\n## Why this is a separate authorization class\n\nOrdinary HealthKit permissions are granular and independent. Each type has its own read and share decision, a refusal on one has no effect on another, and — as covered in the authorization guide — refusals on the read side are invisible by design. Required clinical types invert several of those properties at once.\n\n| Property | Ordinary types | Required clinical types |\n| --- | --- | --- |\n| Where declared | In the authorization request | In the app's Info.plist |\n| Granularity of failure | Per type | The whole declared set |\n| What you learn on refusal | Nothing, on the read side | That the set was incomplete |\n| Which type was refused | Not applicable | Apple states the system does not tell you |\n| Recovery inside your app | None | None |\n\nThe practical consequence: this key is a hard product requirement expressed in configuration. Whatever you list there, you are declaring that your app cannot function without all of it, and the system enforces that literally.\n\n## Diagnosis order\n\n1. **Confirm the case.** `errorRequiredAuthorizationDenied` is not `errorAuthorizationDenied` and not `errorAuthorizationNotDetermined`. The first means a required set was incomplete; the second is a refused write; the third means you never asked, and is covered in [errorAuthorizationNotDetermined](/fix/healthkit-authorization-not-determined). If your logging collapses them, split it before anything else.\n2. **Read your own declaration.** Open the built app's property list and read the required-types entry as shipped, not as you remember writing it. A list assembled during the build, or inherited from a template, is the usual surprise.\n3. **Ask whether every entry is genuinely required.** This is the real question. Each type you list is another chance for a single refusal to fail the entire authorization for that user.\n4. **Check Apple's minimum for the key.** Per the guidance quoted above, Apple says to specify three or more types.\n5. **Segment your failures.** If the error is concentrated among users of one health system or record source, you are looking at record availability rather than at a code defect.\n\n## Scope the requirement, then degrade around it\n\nThe only real lever you have is what you declare. As practice:\n\n- **Declare the minimum that makes the app impossible without.** If a feature is enhanced by clinical records but not defined by them, those types do not belong in the required set. Requesting them normally means a refusal costs you one feature instead of the whole session.\n- **Design a non-clinical path.** Activity, workout, and body-measurement data flow through the ordinary model, so an app whose core loop rests on those keeps working when the clinical request fails. The types available to you are catalogued in the [HealthKit identifier reference](/healthkit-identifiers).\n- **Explain, then stop.** There is no API to change a permission on someone's behalf, and Apple states you are not told which type was refused, so your message can only be general: the app needs access to all of the requested health records, and that choice is made in the system permission flow. Do not name a specific record type you cannot know was the problem.\n- **Do not re-prompt in a loop.** Once decisions have been made, re-requesting does not re-present the sheet — the documented behaviour is quoted in the [authorization denied](/fix/healthkit-authorization-denied) guide. A button that appears to do nothing is worse than a sentence of explanation.\n- **Do not infer content from the failure.** The error tells you a permission set was incomplete. It tells you nothing about what any record contains, and nothing about the person. Treat the outcome as an access-control fact, full stop.\n\n## Handling the data you do get\n\nClinical records raise handling questions that ordinary step counts do not. Before you ship, be clear on whether your handling of this data falls under health-privacy rules in your jurisdiction and what your obligations are — the starting points are [is fitness data PHI?](/compliance/is-fitness-data-phi) and [HIPAA compliance for a fitness app](/compliance/hipaa-compliance-fitness-app), and the store-review dimension is in [App Store health data rules](/compliance/app-store-health-data-rules). Those are engineering and policy questions, not clinical ones; nothing on this page is medical or legal advice.\n\n## Symptom to action\n\n| What you observe | Case | What to do |\n| --- | --- | --- |\n| Authorization fails for the whole clinical set | `errorRequiredAuthorizationDenied` | Narrow the required list; degrade |\n| A save is refused | `errorAuthorizationDenied` | Stop saving that type |\n| A call fails and you never requested | `errorAuthorizationNotDetermined` | Request first |\n| Reads return only your own writes | Denied read, invisible by design | See the authorization guide |\n| Every call fails on a managed device | `errorHealthDataRestricted` | See [MDM restriction](/fix/healthkit-data-restricted-mdm) |\n\n## Where to go next\n\nThe full enum with Apple's own wording is in the [HealthKit error reference](/healthkit-errors), the permission model this case departs from is in [HealthKit authorization denied](/fix/healthkit-authorization-denied), and the surrounding setup is in the [HealthKit integration guide](/integrate/healthkit).",
    "faqs": [
      {
        "q": "Why does authorization fail even though the user allowed most types?",
        "a": "Because the required set is all or nothing. Apple's abstract states the user has not granted authorization to access all the required clinical record types, so a single refusal inside the declared set fails the whole authorization. Anything you list under that key is a hard requirement, and the system enforces it exactly as written."
      },
      {
        "q": "Can I find out which clinical record type the user refused?",
        "a": "No. Apple states that the system does not tell your app which record types the person denied access to, which is quoted in our HealthKit authorization denied guide. That constrains your messaging: you can say the app needs access to all of the requested records, but you cannot name a specific one without guessing on the user's behalf."
      },
      {
        "q": "How is this different from ordinary HealthKit authorization?",
        "a": "Ordinary types are declared in the request, decided independently, and refusals on the read side are invisible by design. Required clinical types are declared in the app's property list, fail as a set, and produce this error case when the set is incomplete. Same framework, a different authorization class with different failure behaviour."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-authorization-denied",
        "label": "HealthKit authorization denied"
      },
      {
        "href": "/fix/healthkit-authorization-not-determined",
        "label": "HealthKit authorization not determined"
      },
      {
        "href": "/compliance/is-fitness-data-phi",
        "label": "Is fitness data PHI?"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Clinical records, limited history grants, and the other corners of HealthKit authorization behave nothing like the rest of it. We document them as we verify them — subscribe for the next breakdown."
    },
    "steps": [
      {
        "name": "Confirm which case you have",
        "text": "Separate errorRequiredAuthorizationDenied from a refused write and from the never-asked case. They describe different points in the permission model and need different handling."
      },
      {
        "name": "Read the shipped declaration",
        "text": "Open the built app's property list and read the required-types entry as shipped, not as you remember writing it. Lists assembled at build time or inherited from a template are the usual surprise."
      },
      {
        "name": "Cut the list to what is genuinely required",
        "text": "Every entry is another chance for one refusal to fail authorization for that user. Types that enhance a feature rather than define it should be requested normally instead."
      },
      {
        "name": "Check Apple's minimum for the key",
        "text": "Apple's guidance, quoted in our authorization guide, is to specify three or more types under the required-read-authorization key."
      },
      {
        "name": "Build a path that works without records",
        "text": "Activity, workout, and body-measurement data flow through the ordinary model, so a core loop resting on those survives a refusal of the clinical set."
      },
      {
        "name": "Explain generally, then stop",
        "text": "Say the app needs access to all of the requested health records and that the choice is made in the system flow. Do not name a type you cannot know was refused, and do not re-prompt in a loop."
      }
    ]
  },
  {
    "slug": "healthkit-workout-session-errors",
    "primaryQuery": "healthkit workout session errors",
    "h1": "HealthKit Workout Session Errors: Four Cases, Two of Them Undocumented",
    "metaTitle": "HealthKit Workout Session Errors: All Four",
    "metaDescription": "Another app took the session, the app left the foreground, or an undocumented case fired. What Apple documents for each, plus one recovery path.",
    "updated": "2026-09-04",
    "answer": "Four HKError cases end a workout session, and Apple describes only two of them. Apple's documentation states that errorAnotherWorkoutSessionStarted means another app started a session, and that Apple Watch runs one workout session at a time, so your session receives the error and then ends while the second one starts. Apple states that errorUserExitedWorkoutSession means the user exited your application while a session was running, and that workout sessions end when the app goes into the background. The remaining two, errorBackgroundWorkoutSessionNotAllowed and errorWorkoutActivityNotAllowed, are published with no abstract at all, so treat them as unknown codes rather than inferring behaviour. In every case the session is already gone, which makes continuous persistence the only real defence.",
    "body": "A workout session ending on its own is the most disruptive failure a fitness app can ship, because the user is mid-effort and the data is mid-flight. Four HKError cases cover the ways a session can be taken away from you. Two of them Apple describes; two of them Apple names and nothing more. Knowing which is which is the difference between handling a documented lifecycle and guessing.\n\n## The four cases, and what Apple says about each\n\n| Case | Apple's abstract | Documented? |\n| --- | --- | --- |\n| `errorAnotherWorkoutSessionStarted` | \"Another app started a workout session.\" | Yes, with discussion |\n| `errorUserExitedWorkoutSession` | \"The user exited your application while a workout session was running.\" | Yes, with discussion |\n| `errorBackgroundWorkoutSessionNotAllowed` | None published | No |\n| `errorWorkoutActivityNotAllowed` | None published | No |\n\nThe split is visible in Apple's own structure. The first two sit in the accessing-errors group with abstracts and discussion paragraphs. The other two appear as type properties carrying no abstract at all — the name is the entire published content. Apple's platform list introduces that pair at iOS 17.0 and watchOS 10.0, which is the only other fact available about them. Everything on this page about those two is inference, and marked as such.\n\n## errorAnotherWorkoutSessionStarted: you were displaced\n\nApple's discussion is precise about the mechanism and the ordering:\n\n> This error occurs whenever a second workout session is started. Apple Watch only runs one workout session at a time. If the user begins a second workout session in a different app, the original session receives this error message and then ends. The second session then starts.\n\nThree consequences follow from Apple's own sentences. One session at a time is a platform rule, not a race you can win. Your session receives the error *and then ends* — the error is a notification of a decision, not a request you can refuse. And the other app's session starts regardless, so the user has made a choice, even if they made it by accident.\n\nThe design conclusion, as practice: never restart automatically. Grabbing the session back would take it from whichever app the user just chose, and if that app is written the same way you get two apps fighting over the wrist. Save what you have, tell the user their session ended because another app started one, and let them decide.\n\n## errorUserExitedWorkoutSession: the app left the foreground\n\nApple's abstract states the trigger — \"the user exited your application while a workout session was running\" — and the discussion is one sentence: \"Workout sessions end when the app goes into the background.\"\n\nThat is all Apple publishes here, and it is worth resisting the urge to elaborate. The behaviour of background execution on the watch changes across releases and configurations, and the honest position is that this error is what you receive when the session ends this way. What the sentence tells you to design for is clear enough: session state must be durable before you need it, because the moment you find out is the moment it is over.\n\n## The two undocumented cases\n\n`errorBackgroundWorkoutSessionNotAllowed` and `errorWorkoutActivityNotAllowed` are published with no abstract and no discussion. Apple documents nothing about when either is returned, and this page will not pretend otherwise.\n\nWhat you may legitimately take from a name is a hint about where to look, never a claim about behaviour:\n\n| Case | What the name suggests you inspect | What Apple confirms |\n| --- | --- | --- |\n| `errorBackgroundWorkoutSessionNotAllowed` | Something about starting or running a session from the background | Nothing |\n| `errorWorkoutActivityNotAllowed` | Something about a workout activity being rejected | Nothing |\n\nHandle both the way you would handle any unnamed failure: log the raw domain and code, keep the session data you already have, surface a neutral message, and do not encode a guess into your control flow. The general procedure is on [undocumented HealthKit errors](/fix/healthkit-undocumented-errors).\n\n## A lifecycle that survives all four\n\nNone of the following is Apple's documented behaviour; it is how to build so that any of these four cases costs the user as little as possible.\n\n- **Persist continuously, not at the end.** If your workout is only written when the user taps stop, every case on this page loses the session. Checkpoint the accumulating data as you go so an involuntary end becomes a shortened workout rather than a deleted one.\n- **Treat every ending as terminal.** All four cases end with you not owning a session. Collapse them into one recovery path, and vary only the message.\n- **Never auto-restart.** For the displaced case Apple's discussion makes the reason explicit; for the others, restarting a session the system just refused is a loop.\n- **Tell the truth in the message.** \"Another app started a workout\" is checkable by the user and does not blame them. A generic \"something went wrong\" invites the support ticket.\n- **Offer to save, always.** Give the user an explicit way to keep the partial session. Deciding whether a partial workout is worth keeping is their call.\n- **Log the case name, not a category.** Four codes into one \"workout error\" counter and you can never tell a displaced session from an undocumented refusal in the field.\n\n## Symptom to action\n\n| What you observe | Case | Recovery |\n| --- | --- | --- |\n| Session ends when the user starts another app's workout | `errorAnotherWorkoutSessionStarted` | Save, explain, do not restart |\n| Session ends as the app leaves the foreground | `errorUserExitedWorkoutSession` | Save, explain, offer to resume manually |\n| A start or activity is refused with an undocumented case | The two unnamed cases | Log raw, fail soft, keep the data |\n| Reads fail but the session is fine | Not a session error | Check the lock and authorization cases |\n\n## Where to go next\n\nThe structural side of this — how a watch workout app is put together, and what runs when — is in [the anatomy of a watchOS workout app](/watch-apps/watchos-workout-app-anatomy) and [Apple Watch background execution](/watch-apps/apple-watch-background-execution). If your session data has to reach the phone, see [mirroring workouts to iPhone](/watch-apps/mirroring-workouts-to-iphone). The complete enum with Apple's wording and honest gaps is the [HealthKit error reference](/healthkit-errors), and if a read is failing rather than a session, start with [HealthKit database inaccessible](/fix/healthkit-database-inaccessible).",
    "faqs": [
      {
        "q": "Can two apps run a workout session at the same time?",
        "a": "Apple's discussion states that Apple Watch only runs one workout session at a time. If the user begins a second session in a different app, Apple says the original session receives errorAnotherWorkoutSessionStarted and then ends, and the second session then starts. Your session is not being asked to yield; it is being told that it already has."
      },
      {
        "q": "Should my app restart the session automatically after this error?",
        "a": "As a practice, no. Restarting takes the session back from whichever app the user just chose, and if that app is written the same way the two will fight over the wrist. Save what you have, say plainly that another app started a workout, and let the person decide what happens next."
      },
      {
        "q": "What do the two undocumented workout errors mean?",
        "a": "Apple publishes no abstract and no discussion for errorBackgroundWorkoutSessionNotAllowed or errorWorkoutActivityNotAllowed, so the honest answer is that Apple documents nothing. Their names suggest where to look in your own app, which is a hypothesis to test, not a fact about the framework. Log the raw code, keep the session data, and avoid encoding a guess."
      }
    ],
    "related": [
      {
        "href": "/watch-apps/watchos-workout-app-anatomy",
        "label": "Anatomy of a watchOS workout app"
      },
      {
        "href": "/watch-apps/apple-watch-background-execution",
        "label": "Apple Watch background execution"
      },
      {
        "href": "/fix/healthkit-undocumented-errors",
        "label": "Undocumented HealthKit errors"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Workout sessions fail in ways Apple half-documents, and the half that is missing is the half that ends a user's run. Subscribe as we verify and publish the rest."
    },
    "steps": [
      {
        "name": "Log the case name, not a category",
        "text": "Four codes folded into one workout error counter means you can never tell a displaced session from an undocumented refusal in the field."
      },
      {
        "name": "Persist continuously, not at the end",
        "text": "If the workout is only written when the user taps stop, every one of these cases loses it. Checkpoint as you go so an involuntary end becomes a shortened workout."
      },
      {
        "name": "Treat every ending as terminal",
        "text": "All four leave you without a session. Collapse them into one recovery path and vary only the message you show."
      },
      {
        "name": "Never auto-restart",
        "text": "For the displaced case Apple's discussion makes the reason explicit, and for the undocumented pair, restarting something the system just refused is a loop."
      },
      {
        "name": "Say what happened, in checkable words",
        "text": "Another app started a workout is verifiable by the user and blames nobody. Something went wrong produces a support ticket instead."
      },
      {
        "name": "Always offer to save the partial session",
        "text": "Give an explicit way to keep what was recorded. Whether a shortened workout is worth keeping is the user's decision, not your error handler's."
      }
    ]
  },
  {
    "slug": "healthkit-guest-user-mode",
    "primaryQuery": "healthkit errornotpermissibleforguestusermode",
    "h1": "HealthKit errorNotPermissibleForGuestUserMode: Writes Blocked in a Guest Session",
    "metaTitle": "HealthKit Guest User Mode Error on visionOS",
    "metaDescription": "Your status check says authorized and the save still fails: that status belongs to the owner, not the guest. How to detect it and degrade quietly.",
    "updated": "2026-09-04",
    "answer": "Apple's documentation states that errorNotPermissibleForGuestUserMode means the app attempted to write HealthKit data while in a Guest User session in visionOS, and publishes no discussion beyond that abstract. Apple's guest-session guidance, quoted in our authorization guide, adds that permissions do not change during a guest session, so your status check still reports the owner's grant while the save fails. Apple also states the authorization sheet is not displayed, so requests during a guest session fail silently, and suggests silently ignoring the write error for passive or periodic saves. The practical handling is to buffer the data, stay quiet unless the guest explicitly asked to save, and never treat the failure as a denial.",
    "body": "Your Vision Pro app checks its authorization status, gets a positive answer, saves a sample, and the save fails with `errorNotPermissibleForGuestUserMode`. Nothing is inconsistent about that: the status you read belongs to the device's owner, and the person wearing the headset right now is a guest. This is the newest platform-specific failure in the HealthKit error set, and it is one your status checks are structurally unable to predict.\n\n## What Apple documents\n\nApple's documentation states the abstract as: \"The app attempted to write HealthKit data while in a Guest User session in visionOS.\" There is no discussion paragraph — the abstract is the whole published description of the case. Apple's platform list introduces it at visionOS 2.0 and iOS 18.0.\n\nAdditional documented behaviour for guest sessions is quoted in our [HealthKit authorization denied](/fix/healthkit-authorization-denied) guide. Apple states that in a Guest User session an app's permissions do not change, that the guest can read data the owner already authorized but cannot authorize additional types, and that the authorization sheet is not displayed, so any attempt to request authorization for HealthKit data types during a guest session fails silently. Apple also notes that writes fail with this case, or with `errorHealthDataRestricted` on apps running in iOS 17. And Apple's own suggestion for handling it is to silently ignore the error for passive or periodic saves, and alert only when the guest took an action that obviously implies saving.\n\nThat last sentence is unusual and worth taking seriously: Apple is telling you the correct handling is often to do nothing.\n\n## What changes in a guest session\n\n| Behaviour | In a guest session |\n| --- | --- |\n| Reported authorization status | Still the owner's, per Apple |\n| Reads of already-authorized types | Permitted, per Apple |\n| Authorizing additional types | Not possible |\n| The authorization sheet | Not displayed; requests fail silently |\n| Writes | Fail with `errorNotPermissibleForGuestUserMode` |\n\nThe row that breaks most code is the first. Every guard your app has that reads a status and concludes \"we may save\" is now wrong, and it is wrong in a way no amount of checking can repair, because the status is not lying — it is answering a question about a different person.\n\n## Why your existing error handling gets this wrong\n\nMost apps sort HealthKit failures into two buckets: things the user can fix in settings, and things that are broken. This case is neither. There is no setting for the guest to change, nothing is broken, and the condition disappears by itself when the session ends. Handling it as a permission problem produces an alert telling the guest to visit permissions they cannot reach; handling it as a crash-worthy failure turns a normal state into an incident.\n\nIt is also easy to misfile. On the same platform, `errorHealthDataRestricted` may be a management profile rather than a guest session — the distinction and the corporate-device version are on [HealthKit restricted by an MDM profile](/fix/healthkit-data-restricted-mdm).\n\n## Diagnosis order\n\n1. **Log the exact case.** `errorNotPermissibleForGuestUserMode` is self-identifying and needs its own branch. If it lands in a generic write-failure handler, you cannot distinguish it from a genuine denial.\n2. **Check the platform.** Apple's abstract scopes the case to a Guest User session in visionOS.\n3. **Check what the failing operation was.** Apple's abstract says this is about writing. A read that fails is a different problem — start with [errorNoData](/fix/healthkit-error-no-data) if the query ran, or the lock case in [HealthKit database inaccessible](/fix/healthkit-database-inaccessible) if it did not.\n4. **Check whether you were requesting authorization.** Per the documented behaviour above, a request during a guest session fails silently rather than erroring, so a request that appears to have done nothing is consistent with a guest session.\n5. **Do not conclude a denial.** Nothing in this case tells you what the owner granted or refused.\n\n## Detect and degrade, as practice\n\n- **Follow Apple's own advice first.** For background, periodic, or passive saves, swallowing the error is the recommended handling. The guest did not ask you to save anything.\n- **Speak only when the guest asked for it.** If someone taps \"save this workout\" and the save cannot happen, say so plainly: this device is in a guest session, so health data cannot be saved right now.\n- **Buffer rather than discard.** Keep the data in your own storage so nothing is lost when the session ends and a normal one resumes. This is ordinary offline-first work — the general pattern is [offline-first conflict resolution](/architecture/offline-first-conflict-resolution).\n- **Do not queue writes to fire later blindly.** A queue that replays into the store when the owner returns is attributing a guest's activity to the owner. That is a data-quality and consent question before it is an engineering one; think about it under [health data user consent](/compliance/health-data-user-consent).\n- **Never disable reads.** The documented behaviour is that reads of already-authorized types continue, so a guest can still see content that depends on them.\n- **Add it to your test matrix.** A guest session is reproducible and cheap to test; a bug that only appears when someone else borrows the headset is expensive to hear about from a review.\n\n## Symptom to action\n\n| What you observe | Case | What to do |\n| --- | --- | --- |\n| Save fails, status reports authorized, on visionOS | `errorNotPermissibleForGuestUserMode` | Buffer, stay quiet unless asked |\n| Save fails on an app running in iOS 17 during a guest session | `errorHealthDataRestricted` | Same handling; different code |\n| Authorization request shows no sheet and returns nothing | Guest session, per Apple | Do not retry the request |\n| Save refused after the user saw the sheet | `errorAuthorizationDenied` | Stop saving that type |\n| Everything fails on a managed device | `errorHealthDataRestricted` | See the MDM page |\n\n## Where to go next\n\nThe permission model this case sidesteps — what the status call really reports, and why read denial is invisible — is in [HealthKit authorization denied](/fix/healthkit-authorization-denied). The full enum with Apple's own wording, including the cases with no description at all, is the [HealthKit error reference](/healthkit-errors) and its companion [undocumented HealthKit errors](/fix/healthkit-undocumented-errors). For the setup underneath, see the [HealthKit integration guide](/integrate/healthkit).",
    "faqs": [
      {
        "q": "Why does my authorization status say authorized when the save fails?",
        "a": "Because the status belongs to the device owner. Apple states that in a Guest User session an app's permissions do not change, so the value you read is a true answer about the owner and an irrelevant one about the guest wearing the headset. No status check can predict this failure, which is why the error itself has to be handled."
      },
      {
        "q": "Should I show the guest an error when a HealthKit write fails?",
        "a": "Usually not. Apple suggests silently ignoring the error for passive or periodic saves, and alerting only when the guest took an action that obviously implies saving. A background sync failing is not worth a dialog; a tap on save this workout is, and it should say the device is in a guest session rather than blaming permissions."
      },
      {
        "q": "Can a guest still read HealthKit data?",
        "a": "Apple states that a guest can read data the owner already authorized, but cannot authorize additional types, and that the authorization sheet is not displayed so requests fail silently. So keep read-driven content working during a guest session, and expect writes to fail with this case, or with errorHealthDataRestricted on apps running in iOS 17."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-authorization-denied",
        "label": "HealthKit authorization denied"
      },
      {
        "href": "/fix/healthkit-data-restricted-mdm",
        "label": "HealthKit restricted by an MDM profile"
      },
      {
        "href": "/healthkit-errors",
        "label": "Every HKError case, in Apple's words"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "New platforms bring new ways for a write to fail, and they arrive faster than the guides do. We track HealthKit's error set as Apple changes it — subscribe for the next update."
    },
    "steps": [
      {
        "name": "Give the case its own branch",
        "text": "errorNotPermissibleForGuestUserMode is self-identifying. In a generic write-failure handler it becomes indistinguishable from a genuine denial and gets the wrong message."
      },
      {
        "name": "Check what the failing operation was",
        "text": "Apple's abstract scopes this to writing. A read that fails is a different problem and belongs with the empty-result or locked-store cases."
      },
      {
        "name": "Follow Apple's advice for passive saves",
        "text": "For background, periodic, or automatic writes, swallowing the error is the recommended handling. The guest never asked your app to save anything."
      },
      {
        "name": "Speak only when the guest asked",
        "text": "If someone taps save, say plainly that the device is in a guest session so health data cannot be saved right now. Otherwise say nothing."
      },
      {
        "name": "Buffer instead of discarding",
        "text": "Keep the data in your own storage so nothing is lost when the guest session ends, but do not blindly replay it into the store later under the owner's identity."
      },
      {
        "name": "Add a guest session to your test matrix",
        "text": "It is reproducible and cheap to test. A bug that only appears when someone borrows the headset is expensive to hear about from a review."
      }
    ]
  },
  {
    "slug": "healthkit-undocumented-errors",
    "primaryQuery": "undocumented healthkit error codes",
    "h1": "Undocumented HealthKit Errors: Handling a Case Apple Never Described",
    "metaTitle": "Undocumented HealthKit Errors: How to Handle",
    "metaDescription": "Some HKError cases ship with no abstract at all. Which ones, what a name honestly lets you infer, and a handling strategy that does not invent behaviour.",
    "updated": "2026-09-04",
    "answer": "Several HKError cases are published with no description whatsoever: unknownError, errorDataSizeExceeded, errorBackgroundWorkoutSessionNotAllowed, and errorWorkoutActivityNotAllowed all appear as type properties with no abstract and no discussion. Apple documents nothing about when any of them is returned, and the oldest of them has been present since the earliest HealthKit releases without ever acquiring one. A name can legitimately point you at where to look in your own app; it cannot tell you what the framework decided. The workable strategy is to log the raw domain and code, fail soft without discarding the user's data, bound your retries, and keep your inferences labelled as inferences.",
    "body": "Some HealthKit errors have no documentation. Not thin documentation, not documentation in a different place — no published description at all. Apple lists the case, the platforms it exists on, and nothing else. If you have landed here holding a code you cannot look up, the goal of this page is to get you to a safe handling strategy without either of you inventing behaviour that Apple never described.\n\n## Which cases have no description\n\n| Case | Where Apple lists it | Published abstract | First listed on |\n| --- | --- | --- | --- |\n| `unknownError` | Type properties | None | iOS 8.0, watchOS 2.0 |\n| `errorDataSizeExceeded` | Type properties | None | iOS 17.0, watchOS 10.0 |\n| `errorBackgroundWorkoutSessionNotAllowed` | Type properties | None | iOS 17.0, watchOS 10.0 |\n| `errorWorkoutActivityNotAllowed` | Type properties | None | iOS 17.0, watchOS 10.0 |\n\nTwo things stand out. One of the oldest cases in the enum is an undescribed one — `unknownError` goes back to the earliest listed releases and has still never acquired an abstract. And the grouping matters: most of the described cases sit in Apple's accessing-errors listing with abstracts and, often, discussion paragraphs, while these four appear as type properties with the name as the entire published content. Our [HealthKit error reference](/healthkit-errors) marks this distinction on every case rather than hiding it behind plausible-sounding prose.\n\n## What a name lets you infer, and what it does not\n\nIt is reasonable to let a name direct your investigation. It is not reasonable to let it write your error messages, your retry policy, or your documentation. The honest form of the inference looks like this:\n\n| Case | A name-led place to look | What Apple confirms |\n| --- | --- | --- |\n| `errorDataSizeExceeded` | Whatever your app just tried to write, and how large it was | Nothing |\n| `errorBackgroundWorkoutSessionNotAllowed` | Session starts happening off the foreground | Nothing |\n| `errorWorkoutActivityNotAllowed` | A workout activity being refused | Nothing |\n| `unknownError` | Anything; it is the catch-all by name | Nothing |\n\nEvery cell in the middle column is a hypothesis for you to test in your own app, on your own data, on a device you control. None of them is a fact about the framework. The two workout cases are handled alongside their documented siblings in [workout session errors](/fix/healthkit-workout-session-errors), where the contrast between a case with a discussion paragraph and a case with nothing at all is easiest to see.\n\n## The handling strategy: log raw, fail soft\n\n- **Log the domain and the numeric code, always.** Not a mapped label, not a friendly string — the raw values, alongside the operation, the type identifier, and the size or shape of whatever you passed. When Apple documents the case later, or when the pattern becomes obvious across your install base, those logs are the only thing that will let you go back and interpret past failures.\n- **Never map an unknown code to a confident message.** \"Your workout was too large to save\" is a claim about the framework you cannot support. \"This didn't save — we've logged the details\" costs you nothing and is true.\n- **Fail soft and keep the payload.** Whatever you were trying to write still exists in your app. Hold it, mark it unsynced, and let a later attempt or a support export recover it. Discarding user data on the strength of an undocumented code is the one genuinely unrecoverable mistake available here.\n- **Bound your retries.** Allow a small, bounded number of attempts in case the cause was transient, then stop and record the outcome. Cases that are structural rather than environmental will fail identically forever — the transient/terminal split is worked through in [HealthKit database inaccessible](/fix/healthkit-database-inaccessible).\n- **Reduce the payload as an experiment, not a fix.** If you suspect size, try a smaller write and see. Write down what you observed and label it as your observation.\n- **Alert on the shape, not the instance.** One unknown code is noise. A sudden cluster on one OS version, one device family, or one code path is a signal worth a person's attention, and it is why the raw code matters more than the friendly message.\n\n## Do not confuse \"undocumented\" with \"unclassified\"\n\nThere is a second, larger category worth separating: cases Apple *does* document, which teams treat as mysterious because their logging collapsed everything into one branch. `errorInvalidArgument` has a one-line abstract and no discussion, but that one line tells you it is a programming error rather than an environmental one, and the diagnosis has a real procedure — see [invalid argument](/fix/healthkit-invalid-argument). Before concluding that Apple documented nothing, check whether you simply never read the abstract.\n\n| Situation | What it is | First move |\n| --- | --- | --- |\n| Code has no abstract anywhere | Genuinely undocumented | Log raw, fail soft |\n| Code has an abstract but no discussion | Thinly documented | Read the abstract; it constrains a lot |\n| Your logs say \"HealthKit error\" | An observability problem | Log domain and code |\n| Behaviour differs by OS version | Possibly version-specific | Segment your telemetry by version |\n\n## Writing about it honestly\n\nIf your team keeps an internal runbook, hold it to the same rule this site uses: state what the vendor documents, attribute it, and mark your own inferences as inferences. A runbook that says \"`errorDataSizeExceeded` occurs when a sample exceeds the limit\" invents both a mechanism and a limit; a runbook that says \"no published description; observed in our app when writing large batches, unconfirmed\" stays useful and stays true. How we apply that standard across the site is set out in [our methodology](/methodology), and the field-level version of the same argument is in [the HealthKit error that never fires](/blog/healthkit-error-that-never-fires).\n\n## Where to go next\n\nEvery case in the enum, with Apple's own wording where it exists and an explicit gap where it does not, is in the [HealthKit error reference](/healthkit-errors). If your undocumented code arrived from a workout session, go to [workout session errors](/fix/healthkit-workout-session-errors); if it arrived from a query that returned nothing, [errorNoData](/fix/healthkit-error-no-data) covers the documented version of emptiness. And for the setup underneath all of them, see the [HealthKit integration guide](/integrate/healthkit).",
    "faqs": [
      {
        "q": "Which HealthKit error cases has Apple not documented?",
        "a": "unknownError, errorDataSizeExceeded, errorBackgroundWorkoutSessionNotAllowed, and errorWorkoutActivityNotAllowed are published as type properties with no abstract and no discussion. Apple lists their names and the platforms they exist on, and nothing more. Most of the described cases, by contrast, appear in Apple's accessing-errors listing with an abstract and often a discussion paragraph."
      },
      {
        "q": "Can I infer what errorDataSizeExceeded means from its name?",
        "a": "You can use the name to decide where to look, and no further. A sensible investigation is to examine what your app just tried to write and how large it was. Turning that into a user-facing message about a size limit invents both a mechanism and a threshold that Apple has never published."
      },
      {
        "q": "How should my app handle an unknown HealthKit error code?",
        "a": "Log the raw domain and numeric code together with the operation and type identifier, keep the data you were trying to write and mark it unsynced, allow a small bounded number of retries, then stop. Alert on clusters rather than single occurrences, and never map an undocumented code to a confident explanation in your UI."
      }
    ],
    "related": [
      {
        "href": "/healthkit-errors",
        "label": "Every HKError case, in Apple's words"
      },
      {
        "href": "/fix/healthkit-workout-session-errors",
        "label": "HealthKit workout session errors"
      },
      {
        "href": "/methodology",
        "label": "How this site verifies"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "When Apple documents nothing, the honest move is to say so and show your evidence. That is how we build every reference here — subscribe as we extend them."
    },
    "steps": [
      {
        "name": "Log the raw domain and code",
        "text": "Not a mapped label or a friendly string. Record the numeric code alongside the operation, the type identifier, and the shape of whatever you passed."
      },
      {
        "name": "Check whether it is genuinely undocumented",
        "text": "Some cases have a one-line abstract and no discussion, which is thin rather than absent. A one-line abstract still constrains the diagnosis considerably."
      },
      {
        "name": "Fail soft and keep the payload",
        "text": "Hold the data in your own storage and mark it unsynced. Discarding user data because of a code nobody can look up is the one unrecoverable mistake here."
      },
      {
        "name": "Bound the retries",
        "text": "Allow a small number of attempts in case the cause was transient, then stop and record. Structural failures will fail identically forever."
      },
      {
        "name": "Alert on clusters, not instances",
        "text": "One unknown code is noise. A sudden concentration on one OS version, device family, or code path is worth a person's attention."
      },
      {
        "name": "Label inferences as inferences",
        "text": "In runbooks and log messages, keep what the vendor documents separate from what you observed. Observed while writing large batches, unconfirmed is useful; a stated mechanism you cannot cite is not."
      }
    ]
  },
  {
    "slug": "health-connect-securityexception",
    "primaryQuery": "health connect securityexception",
    "h1": "Health Connect SecurityException: The Permission Was Not Granted",
    "metaTitle": "Health Connect SecurityException: Permission Not Granted",
    "metaDescription": "Google says Health Connect throws SecurityException when a request needs a permission that isn't granted. The causes, ranked, and the documented fix.",
    "updated": "2026-10-03",
    "answer": "Health Connect throws SecurityException when a call needs a permission your app does not currently hold. Google's exception table describes it as issues \"when the requests require permissions that aren't granted\". The usual causes are a permission that was declared but never granted, one the user has since revoked, or one missing from the manifest. The fix is to call getGrantedPermissions before every read or write, request anything missing with PermissionController.createRequestPermissionResultContract, and treat the exception as \"not allowed to look\", never as \"no data\".",
    "body": "Your Android app calls `readRecords`, `insertRecords`, `aggregate` or `getChanges`, and instead of data you get `java.lang.SecurityException`. Health Connect is not telling you the data is missing. It is telling you the call needed a permission your app does not hold at that moment. Google documents exactly one meaning for it, and almost every fix comes down to checking the granted set before you call.\n\n## What Google documents\n\nGoogle's read-data and write-data guides carry the same exception table. The `SecurityException` row reads, verbatim:\n\n> There are issues encountered when the requests require permissions that aren't granted.\n\nThe recommended best practice in the same row: \"make sure that you've declared use of Health Connect data types for your published app. Also, you must declare Health Connect permissions in the manifest file and in your activity.\" (Both guides fetched October 3, 2026: [read data](https://developer.android.com/health-and-fitness/health-connect/read-data), [write data](https://developer.android.com/health-and-fitness/health-connect/write-data).)\n\nAndroid's Jetpack [`HealthConnectClient` reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient) lists `SecurityException` under Throws for `readRecords`, `readRecord`, `insertRecords`, `aggregate`, `deleteRecords`, `getChanges` and `getChangesToken`, each time with the same gloss: \"For requests with unpermitted access.\" The one place it names a specific permission is the medical-records API: \"Caller must hold PERMISSION_WRITE_MEDICAL_DATA in order to call this API, otherwise a SecurityException will be thrown.\"\n\n## Where the HealthConnectException in your stack trace comes from\n\nOn Android 14 and later Health Connect is part of the system, and the platform API reports failures as `android.health.connect.HealthConnectException` with an error code. Android's [platform reference](https://developer.android.com/reference/android/health/connect/HealthConnectException) describes `ERROR_SECURITY` as \"The caller doesn't have the correct permissions for this call. This error may be considered similar to SecurityException.\" The Jetpack library's own source ([`ExceptionConverter.kt`](https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/ExceptionConverter.kt), read October 3, 2026) converts that code into `SecurityException(this)` in its platform code path, which requires API 34. So on those devices the `SecurityException` you catch carries the platform exception as its cause. That is internal library code, not a documented contract, so read the cause for logging and never branch on its message text.\n\n## Most likely causes (ranked)\n\nThe ranking is our judgement. Each cause is tied to what Google documents.\n\n1. **Declared, never granted, or since revoked.** The manifest entry makes a permission requestable. It does not grant it. Google's get-started guide says \"users can grant or revoke permissions at any time\", so a read that worked yesterday can throw today. Google's read guide adds that if a user deletes your app, \"all permissions, including the history permission, are revoked\", so a reinstall starts from zero.\n2. **Not declared in the manifest.** Google's get-started guide says the permissions in your request set must be \"declared in your Android manifest first\". Health Connect uses standard `uses-permission` tags, one per type and direction. A typo or a missing write entry fails here.\n3. **A changes token that spans a revoked type.** Google's sync guide recommends \"getting separate tokens per data type instead of getting them in bulk to avoid having an Exception in case one of the permissions is revoked.\" One token over five types fails as a whole when the user revokes any one of them.\n4. **A background read without the background permission.** Android's [`HealthPermission` reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission) says \"An attempt to read data in background without this permission may result in an error\" for `PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND`. It does not name the exception type, so confirm with your own logs whether this is what you are seeing.\n5. **A published app without its Play Console declaration.** Google's table row tells you to declare your Health Connect data types for your published app. If a type works in a local build and fails only for Play users, see the production section of [Health Connect returns no data](/fix/health-connect-no-data).\n\n## The fix: check the granted set, then call\n\nGoogle's get-started guide is explicit that \"your app needs to check for permissions every time before using them and handle scenarios where permission is lost.\" Ask `permissionController.getGrantedPermissions()` first, and keep a `catch` for the gap between your check and the call.\n\n```kotlin\nval stepsRead = HealthPermission.getReadPermission(StepsRecord::class)\n\nsuspend fun readStepsOrNull(\n    client: HealthConnectClient,\n    start: Instant,\n    end: Instant\n): List<StepsRecord>? {\n    val granted = client.permissionController.getGrantedPermissions()\n    if (stepsRead !in granted) return null // not granted: ask, don't call\n    return try {\n        client.readRecords(\n            ReadRecordsRequest(\n                StepsRecord::class,\n                timeRangeFilter = TimeRangeFilter.between(start, end)\n            )\n        ).records\n    } catch (e: SecurityException) {\n        null // revoked between the check and the call\n    }\n}\n```\n\nA `null` here means \"we may not look\", which is different from an empty list. Keep the two apart in anything that draws charts or streaks.\n\nWhen the permission is missing, request it with the Health Connect contract, which Google's get-started guide says displays the Health Connect permissions screen. Android's [`PermissionController` reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/PermissionController) documents `createRequestPermissionResultContract()`, and the callback returns the set the user actually granted:\n\n```kotlin\nval requestPermissions = registerForActivityResult(\n    PermissionController.createRequestPermissionResultContract()\n) { granted ->\n    if (stepsRead in granted) {\n        // safe to read\n    } else {\n        // denied: degrade, don't re-prompt in a loop\n    }\n}\n\nrequestPermissions.launch(setOf(stepsRead))\n```\n\nAnd the manifest side, in the format Google's get-started guide shows:\n\n```xml\n<uses-permission android:name=\"android.permission.health.READ_STEPS\"/>\n<uses-permission android:name=\"android.permission.health.WRITE_STEPS\"/>\n```\n\n## Symptom to cause\n\n| What you observe | Likely cause | What to do |\n| --- | --- | --- |\n| Throws on first use after install | Never granted | Check, then request through the contract |\n| Worked, now throws on every call | User revoked it | Re-check every session; offer reconnect |\n| `getChanges` throws after a settings change | One token covers a revoked type | One changes token per record type |\n| Throws only in a background worker | Background permission missing | Request `PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND` |\n| No exception, just an empty list | Not this error | Read [Health Connect returns no data](/fix/health-connect-no-data) |\n\n## Where to go next\n\nThe full setup, including the manifest and permission flow this page assumes, is in the [Google Health Connect integration guide](/integrate/google-health-connect). Every `android.permission.health.*` string by record type is in the [Health Connect records reference](/health-connect/permissions). For an availability failure rather than a permission one, see [SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED](/fix/health-connect-not-available).",
    "faqs": [
      {
        "q": "Is a Health Connect SecurityException the same as an empty result?",
        "a": "No. An empty list means the call was allowed and found nothing. A SecurityException means the call was not allowed at all. Google's exception table ties it to requests that need permissions that aren't granted. Keep the two apart in your code: an empty list can be shown as zero, but a SecurityException should lead to a permission check and a reconnect prompt, never a zero."
      },
      {
        "q": "Why does getChanges throw SecurityException after the user changes permissions?",
        "a": "Most likely because one changes token covers several record types and the user revoked one of them. Google's sync guide recommends getting separate tokens per data type instead of getting them in bulk, to avoid an Exception if one of the permissions is revoked. With one token per type, losing one permission stops only that type's sync."
      },
      {
        "q": "Is declaring a Health Connect permission in the manifest enough?",
        "a": "No. The manifest entry is what makes a permission requestable, and Google's get-started guide says every permission in your request set must be declared there first. Granting happens at runtime through the Health Connect permissions screen, which you open with PermissionController.createRequestPermissionResultContract. The user can also revoke a grant at any time, so check getGrantedPermissions before each use."
      },
      {
        "q": "What is the HealthConnectException in my SecurityException stack trace?",
        "a": "On Android 14 and later the platform reports the failure as android.health.connect.HealthConnectException with the code ERROR_SECURITY, which Android describes as the caller lacking the correct permissions. The Jetpack library's source wraps that in a SecurityException, so the platform exception shows up as the cause. That wrapping is internal library code, so log the cause but do not branch on its message."
      }
    ],
    "related": [
      {
        "href": "/fix/health-connect-no-data",
        "label": "Fix: Health Connect returns no data"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/health-connect/permissions",
        "label": "Health Connect records and permissions"
      },
      {
        "href": "/fix/health-connect-not-available",
        "label": "Fix: SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "We read Google's Health Connect reference line by line so your Android sync code does not learn these rules from a production incident. Subscribe for the next breakdown."
    },
    "steps": [
      {
        "name": "Confirm it is a SecurityException, not an empty list",
        "text": "Log the exception class and its cause. An empty result means the call was allowed and found nothing; a SecurityException means the call needed a permission your app does not hold."
      },
      {
        "name": "Check the manifest declaration",
        "text": "Every permission you request must first be declared with a uses-permission tag, one per record type and direction. A missing write entry or a typo fails here."
      },
      {
        "name": "Call getGrantedPermissions before every use",
        "text": "Users can revoke permissions at any time, and uninstalling revokes all of them. Ask the permission controller for the granted set before each read or write instead of trusting an earlier grant."
      },
      {
        "name": "Request what is missing through the Health Connect contract",
        "text": "Launch PermissionController.createRequestPermissionResultContract with the missing permissions and branch on the set the callback returns. If the user denies, degrade the feature instead of re-prompting in a loop."
      },
      {
        "name": "Split changes tokens per record type",
        "text": "If getChanges is the call that throws, give each record type its own changes token, as Google's sync guide recommends, so one revoked permission does not stop every type's sync."
      },
      {
        "name": "Check background and Play Console paths",
        "text": "If it fails only in a background worker, check PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND. If it fails only for users of the Play release, check that the release declares its Health Connect data types."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/read-data",
        "checked": "2026-10-03",
        "note": "exception table: SecurityException description and best practice; permissions revoked on app deletion"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/write-data",
        "checked": "2026-10-03",
        "note": "same exception table on the write side"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/get-started",
        "checked": "2026-10-03",
        "note": "manifest declaration, getGrantedPermissions, createRequestPermissionResultContract, check permissions every time"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/sync-data",
        "checked": "2026-10-03",
        "note": "separate changes tokens per data type to avoid an Exception when one permission is revoked"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient",
        "checked": "2026-10-03",
        "note": "SecurityException under Throws for reads, writes, aggregate, getChanges; PERMISSION_WRITE_MEDICAL_DATA note"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/PermissionController",
        "checked": "2026-10-03",
        "note": "getGrantedPermissions and createRequestPermissionResultContract"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission",
        "checked": "2026-10-03",
        "note": "PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND: reading in background without it may result in an error"
      },
      {
        "url": "https://developer.android.com/reference/android/health/connect/HealthConnectException",
        "checked": "2026-10-03",
        "note": "ERROR_SECURITY description"
      },
      {
        "url": "https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/ExceptionConverter.kt",
        "checked": "2026-10-03",
        "note": "Jetpack converts ERROR_SECURITY to SecurityException(this)"
      }
    ]
  },
  {
    "slug": "health-connect-not-available",
    "primaryQuery": "health connect sdk_unavailable_provider_update_required",
    "h1": "Health Connect SDK_UNAVAILABLE and SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED: What Each Status Means",
    "metaTitle": "Health Connect SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED",
    "metaDescription": "getSdkStatus returned SDK_UNAVAILABLE or SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED? What Google says each status means, and the fix for each.",
    "updated": "2026-10-03",
    "answer": "HealthConnectClient.getSdkStatus returns one of three constants. Google documents SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED (value 2) as \"the provider is either not installed or needs to be updated\", so send the user to the Health Connect listing on the Play Store. SDK_UNAVAILABLE (value 1) means the SDK is unavailable on the device, for example because the Android version is too low, and Google says to hide every Health Connect entry point. Only SDK_AVAILABLE (value 3) means you can call getOrCreate.",
    "body": "`HealthConnectClient.getSdkStatus(context)` came back with something other than `SDK_AVAILABLE`, or your log shows a bare `1` or `2` where you expected a client. Those numbers are the status constants. Android's Jetpack [`HealthConnectClient` reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient) (fetched October 3, 2026) defines exactly three, and each one asks for a different response.\n\n## The three statuses, in Google's words\n\n| Constant | Value | Google's description | What Google says to do |\n| --- | --- | --- | --- |\n| `SDK_UNAVAILABLE` | 1 | \"The Health Connect SDK is unavailable on this device at the time. This can be due to the device running a lower than required Android Version.\" | \"Apps should hide any integration points to Health Connect in this case.\" |\n| `SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED` | 2 | \"The Health Connect SDK APIs are currently unavailable, the provider is either not installed or needs to be updated.\" | \"Apps may choose to redirect to package installers to find a suitable APK.\" |\n| `SDK_AVAILABLE` | 3 | \"The Health Connect SDK APIs are available.\" | \"Apps can subsequently call getOrCreate to get an instance of HealthConnectClient.\" |\n\nAll three are marked \"Added in 1.1.0\" in the reference. If you log the raw integer, `2` means \"install or update Health Connect\", not \"unsupported\".\n\n## Why the device is unavailable\n\nGoogle's [availability page](https://developer.android.com/health-and-fitness/health-connect/availability) sets the floor: \"Health Connect requires a mobile device running Android 9 (API 28) or higher with Google Play services installed.\" On Android 14 and higher, Health Connect is part of the system and is accessible in Settings. On Android 13 and lower, it is a publicly available app on the Google Play Store, and that is where \"not installed or needs to be updated\" comes from.\n\nTwo further rules from Google that produce an unavailable device:\n\n- **Android 8.** Google's get-started guide notes that \"the Health Connect SDK supports Android 8 (API level 26) or higher, while the Health Connect app is only compatible with Android 9 (API level 28) or higher.\" Your app can install on Android 8. Health Connect cannot run there.\n- **Work profiles.** Google says \"Health Connect is not supported on devices with work profiles. While users might be able to grant permissions in the work profile, the Health Connect APIs won't be usable, and no data will be written.\"\n\n## Why getOrCreate crashes when you skip the check\n\nThe reference lists what `getOrCreate` throws if you call it on a device that is not ready: `UnsupportedOperationException` \"if service not available due to SDK version too low or running in a profile\", and `IllegalStateException` \"if the SDK is not available\". Calling `getSdkStatus` first turns a crash into a branch.\n\n## The fix, per status\n\nGoogle's get-started guide also asks you to declare the Health Connect package in your manifest before you get a client, so check this first:\n\n```xml\n<queries>\n    <package android:name=\"com.google.android.apps.healthdata\" />\n</queries>\n```\n\nThen branch on the status. The update-required branch below follows the sample in Google's reference, which sends the user to the Play Store's Health Connect listing with an onboarding hand-off:\n\n```kotlin\nval providerPackageName = \"com.google.android.apps.healthdata\"\n\nwhen (HealthConnectClient.getSdkStatus(context, providerPackageName)) {\n    HealthConnectClient.SDK_AVAILABLE -> {\n        val client = HealthConnectClient.getOrCreate(context)\n        // proceed: check permissions, then read\n    }\n    HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> {\n        val uriString =\n            \"market://details?id=$providerPackageName&url=healthconnect%3A%2F%2Fonboarding\"\n        context.startActivity(\n            Intent(Intent.ACTION_VIEW).apply {\n                setPackage(\"com.android.vending\")\n                data = Uri.parse(uriString)\n                putExtra(\"overlay\", true)\n                putExtra(\"callerId\", context.packageName)\n            }\n        )\n    }\n    else -> {\n        // SDK_UNAVAILABLE: hide every Health Connect entry point\n    }\n}\n```\n\nOne inconsistency to know about: the user-facing text in Google's get-started sample for `SDK_UNAVAILABLE` asks the user to \"ensure it is installed and updated\", while the reference says to hide integration points for that status. We follow the reference. An install prompt belongs to the update-required status, and on an unavailable device it only sends the user looking for an app their phone cannot run.\n\n## SDK_AVAILABLE is not the same as every feature available\n\nA device can report `SDK_AVAILABLE` and still lack newer capabilities. Google's [feature availability guide](https://developer.android.com/health-and-fitness/health-connect/features/availability) says \"When new features are added to Health Connect, users may not always update their version of Health Connect,\" and gives `getFeatureStatus` on `healthConnectClient.features`, which returns `FEATURE_STATUS_AVAILABLE` or `FEATURE_STATUS_UNAVAILABLE`. Check it for features such as `FEATURE_READ_HEALTH_DATA_IN_BACKGROUND` and `FEATURE_READ_HEALTH_DATA_HISTORY` before requesting their permissions.\n\n## Treat status as something that changes\n\nOur recommendation: call `getSdkStatus` each time the user reaches a Health Connect feature, not once at install. On Android 13 and lower, Health Connect is a separate Play Store app, so its state can change after your app checked it. On Android 14 Google says it is part of the system and cannot be uninstalled. A user who updates Health Connect from the Play Store should find your feature working the next time they open it, without reinstalling your app.\n\n## Where to go next\n\nOnce the status is `SDK_AVAILABLE` and reads are still empty, work through [Health Connect returns no data](/fix/health-connect-no-data). If calls throw after the client exists, see [Health Connect SecurityException](/fix/health-connect-securityexception). The end-to-end setup is in the [Google Health Connect integration guide](/integrate/google-health-connect).",
    "faqs": [
      {
        "q": "What do the numbers 1, 2 and 3 from getSdkStatus mean?",
        "a": "They are the three status constants in Android's Jetpack HealthConnectClient reference. 1 is SDK_UNAVAILABLE, meaning Health Connect is unavailable on the device. 2 is SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED, meaning the provider is not installed or needs an update. 3 is SDK_AVAILABLE, meaning you can call getOrCreate. Compare against the named constants rather than the integers."
      },
      {
        "q": "Why does HealthConnectClient.getOrCreate crash instead of returning a client?",
        "a": "Because the device is not ready and nothing checked first. Android's reference says getOrCreate throws UnsupportedOperationException if the service is not available due to an SDK version that is too low or running in a profile, and IllegalStateException if the SDK is not available. Call getSdkStatus first and only call getOrCreate on SDK_AVAILABLE."
      },
      {
        "q": "Can Health Connect work inside an Android work profile?",
        "a": "No. Google's availability page says Health Connect is not supported on devices with work profiles. Users may be able to grant permissions in the work profile, but the APIs won't be usable and no data will be written, because the work profile is never considered to be in the foreground. Plan for this if your users are on managed Google Workspace devices."
      },
      {
        "q": "Does SDK_AVAILABLE mean every Health Connect feature works?",
        "a": "No. SDK_AVAILABLE means the core APIs are usable. Google's feature availability guide notes that users may not always update Health Connect, so newer capabilities such as background reads or reading history need their own getFeatureStatus check, which returns FEATURE_STATUS_AVAILABLE or FEATURE_STATUS_UNAVAILABLE, before you request their permissions."
      }
    ],
    "related": [
      {
        "href": "/fix/health-connect-no-data",
        "label": "Fix: Health Connect returns no data"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/fix/health-connect-securityexception",
        "label": "Fix: Health Connect SecurityException"
      },
      {
        "href": "/apis/health-connect",
        "label": "Health Connect API overview"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Availability checks, install prompts and the statuses Google documents in one line each: we verify them against the reference so you do not ship a crash. Subscribe for the next one."
    },
    "steps": [
      {
        "name": "Log the status by name",
        "text": "Map the integer from getSdkStatus to its constant: 1 is SDK_UNAVAILABLE, 2 is SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED, 3 is SDK_AVAILABLE. The fix depends on which one you have."
      },
      {
        "name": "Declare the Health Connect package in the manifest",
        "text": "Google's get-started guide asks you to declare com.google.android.apps.healthdata in a queries element before getting a client. Add it if it is missing."
      },
      {
        "name": "Route update-required users to the Play Store",
        "text": "For SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED, open the Health Connect listing on the Play Store, as the sample in Google's reference does, so the user can install or update it."
      },
      {
        "name": "Hide the feature when the SDK is unavailable",
        "text": "For SDK_UNAVAILABLE, Google says to hide every Health Connect integration point. Common causes are Android 8, which Health Connect does not run on, and work profiles, where Health Connect is not supported."
      },
      {
        "name": "Only call getOrCreate on SDK_AVAILABLE",
        "text": "getOrCreate throws UnsupportedOperationException or IllegalStateException on a device that is not ready. Gate it behind the status check."
      },
      {
        "name": "Check feature status for newer capabilities",
        "text": "Even on SDK_AVAILABLE, call getFeatureStatus before requesting background-read or history permissions, because the installed Health Connect version may not support them."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient",
        "checked": "2026-10-03",
        "note": "SDK_UNAVAILABLE, SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED, SDK_AVAILABLE values and descriptions; getOrCreate throws; Play Store redirect sample"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/get-started",
        "checked": "2026-10-03",
        "note": "queries package declaration, getSdkStatus sample and its SDK_UNAVAILABLE text, Android 8 SDK vs Android 9 app"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/availability",
        "checked": "2026-10-03",
        "note": "Android 9 with Google Play services; system on 14+, Play app on 13 and lower; work profiles; cannot uninstall on 14"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/features/availability",
        "checked": "2026-10-03",
        "note": "getFeatureStatus, FEATURE_STATUS_AVAILABLE/UNAVAILABLE, feature flags"
      }
    ]
  },
  {
    "slug": "health-connect-changes-token-expired",
    "primaryQuery": "health connect changestokenexpired",
    "h1": "Health Connect changesTokenExpired: How to Resync Without Losing Data",
    "metaTitle": "Health Connect changesTokenExpired: Resync Without Loss",
    "metaDescription": "Google says Health Connect changes tokens are only valid for 30 days. What changesTokenExpired means, and Google's ranked recovery strategies.",
    "updated": "2026-10-03",
    "answer": "changesTokenExpired is a Boolean on ChangesResponse, not an exception. It is true when the token you passed to getChanges has expired, and Google documents that changes tokens \"are only valid for 30 days after they're generated\". When you see it, request a new token with getChangesToken, then re-read records from your last read timestamp or the last 30 days and dedupe them against what you already hold by record id. Google ranks that strategy as the most ideal.",
    "body": "Your incremental sync calls `getChanges(token)` and the response has `changesTokenExpired` set to true. Nothing threw. There are no changes in the list, and the token you stored can no longer tell you what happened since it was issued. Google documents this case and a recovery for it. The one serious mistake is treating the flag as \"nothing changed\".\n\n## What Google documents\n\nAndroid's Jetpack [`ChangesResponse` reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/response/ChangesResponse) defines the field as \"Whether requested Changes-Token has expired.\" and says at class level: \"If changesTokenExpired is true, clients need to generate a new one. This typically happens when clients have not synced changelog for extended period of time.\"\n\nThe [`HealthConnectClient` reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient) says the same thing from both ends:\n\n- On `getChanges`: \"Provided changesToken may have expired if clients have not synced for extended period of time (such as a month). In this case ChangesResponse.changesTokenExpired will be set, and clients should generate a new changes-token via getChangesToken.\"\n- On `getChangesToken`: \"Changes-tokens are only valid for 30 days after they're generated. Calls to getChanges with an expired changes-token will lead to ChangesResponse.changesTokenExpired\"\n\nGoogle's [sync guide](https://developer.android.com/health-and-fitness/health-connect/sync-data) puts it as \"an unused Changes token expires within 30 days\". The two wordings differ, \"unused\" against \"after they're generated\", but they lead to the same design. Every `getChanges` call hands you a `nextChangesToken`, so an app that syncs regularly always holds a recent one. An expired token means a user went about a month without a successful sync. (All fetched October 3, 2026.)\n\n## Why this is a data-loss bug if you ignore it\n\n`changesTokenExpired` is a Boolean on a normal response. If your loop only processes `response.changes` and saves `nextChangesToken`, an expired token looks exactly like a quiet month. Upserts and deletions from that window never reach your datastore. Deletions are the worst case: a record the user removed in Health Connect stays in your app indefinitely. Google's `DeletionChange` reference says only the `Metadata.id` of a deleted record is returned, \"For privacy\", so you cannot recover deletions by reading records again. A record that no longer exists simply does not come back.\n\n## Google's recovery ladder\n\nThe sync guide's token-expiration advice is to \"use a sync strategy that avoids losing information in such a case\", and it lists three building blocks: search your datastore for the most recently consumed record that has a Health Connect id, request records from Health Connect starting at a specific timestamp and upsert them, and request a new Changes token to reserve for next time.\n\nIt then ranks four strategies, from most to least ideal:\n\n1. **Read and dedupe all data**, \"the most ideal strategy\". Store the timestamp of your last read. \"On token expiry, re-read all data from the most recent timestamp or for the last 30 days. Then, dedupe it against the previously read data using identifiers.\"\n2. **Read only since the last read timestamp.** Google warns this \"results in some data discrepancies around the time of Changes token expiry\".\n3. **Delete, then read the last 30 days**, which Google says \"aligns more closely with what happens on the first integration\".\n4. **Read the last 30 days without deduping**, \"the least ideal strategy\", which \"results in having duplicate data displayed to users\".\n\n## A resync that follows rung one\n\nThe sketch below uses only documented APIs: `getChanges`, `changesTokenExpired`, `nextChangesToken`, `hasMore`, `UpsertionChange.record`, `DeletionChange.recordId`, `getChangesToken` with `ChangesTokenRequest`, and a paged `readRecords`. `SyncStore` stands for your own persistence.\n\n```kotlin\nsuspend fun syncWeight(client: HealthConnectClient, store: SyncStore, ownPackage: String) {\n    val stored = store.changesToken(\"weight\") ?: return resyncWeight(client, store)\n    var next = stored\n    do {\n        val response = client.getChanges(next)\n        if (response.changesTokenExpired) return resyncWeight(client, store)\n        response.changes.forEach { change ->\n            when (change) {\n                is UpsertionChange ->\n                    if (change.record.metadata.dataOrigin.packageName != ownPackage) {\n                        store.upsert(change.record) // keyed on metadata.id\n                    }\n                is DeletionChange -> store.delete(change.recordId)\n            }\n        }\n        next = response.nextChangesToken\n    } while (response.hasMore)\n    store.saveChangesToken(\"weight\", next) // only after the batch is applied\n}\n\nsuspend fun resyncWeight(client: HealthConnectClient, store: SyncStore) {\n    // Take the new token BEFORE re-reading, so writes made during the\n    // re-read show up in the next getChanges instead of falling in a gap.\n    val fresh = client.getChangesToken(ChangesTokenRequest(recordTypes = setOf(WeightRecord::class)))\n    val thirtyDaysAgo = Instant.now().minus(Duration.ofDays(30))\n    val since = minOf(store.lastReadTime(\"weight\") ?: thirtyDaysAgo, thirtyDaysAgo)\n    var pageToken: String? = null\n    do {\n        val page = client.readRecords(\n            ReadRecordsRequest(\n                recordType = WeightRecord::class,\n                timeRangeFilter = TimeRangeFilter.between(since, Instant.now()),\n                pageToken = pageToken\n            )\n        )\n        page.records.forEach { store.upsert(it) } // dedupe on metadata.id\n        pageToken = page.pageToken\n    } while (!pageToken.isNullOrEmpty())\n    store.saveChangesToken(\"weight\", fresh)\n}\n```\n\nThree choices in there are ours, not Google's. We read from whichever is further back, the last read or 30 days ago, so a user whose last read was yesterday still gets a full 30-day re-read. We take the fresh token before the re-read: Google lists getting a new token as part of the strategy but does not fix the order, and taking it first trades a possible gap for an overlap that the dedupe absorbs. And we test `pageToken.isNullOrEmpty()`, because Google's read guide warns that `pageToken` \"can return an empty string \\\"\\\" instead of null when pagination is complete\" on some versions. The same bookkeeping, written for any cursor-based source, is the [incremental sync anchor recipe](/cookbook/incremental-sync-anchor).\n\nThe re-read cannot recover deletions, as noted above. For records the user deleted during the expired window, rung three (delete what you imported for the last 30 days, then read again) is the only one of Google's strategies that converges. Whether that cost is worth paying depends on whether a stale record that was deleted upstream is harmful in your product.\n\n## Keep it from happening\n\n- **One token per type.** The sync guide: \"If your app consumes more than one data type independently, use separate Changes Tokens for each data type.\"\n- **Sync on foreground.** Google's sync guide says that because your app \"can't get notified of new data\", it should check for new data each time it becomes active in the foreground. A user who opens your app at least once a month keeps a live token.\n- **Background reads need permission.** Google's sync guide says apps can only read while in the foreground unless the user grants the Background Read permission. Without it, a user who never opens your app will outlive the token.\n- **Mind the history permission.** Android's `HealthPermission` reference lists `getChanges` among the calls that `PERMISSION_READ_HEALTH_DATA_HISTORY` applies to. The default read window is covered in [Health Connect returns no data](/fix/health-connect-no-data).\n\n## Where to go next\n\nThe design reasoning behind cursor-based sync on both platforms, including how this compares with HealthKit's anchors, is in [incremental sync](/architecture/incremental-sync). The setup this page assumes is in the [Google Health Connect integration guide](/integrate/google-health-connect).",
    "faqs": [
      {
        "q": "Does getChanges throw an exception when the changes token has expired?",
        "a": "No. Android's reference says that in this case ChangesResponse.changesTokenExpired will be set, and clients should generate a new changes-token via getChangesToken. The call returns normally, so a loop that only reads the changes list and saves the next token will treat an expired token as a quiet period and silently skip everything that happened."
      },
      {
        "q": "How long is a Health Connect changes token valid?",
        "a": "Android's getChangesToken reference says changes tokens are only valid for 30 days after they're generated, and Google's sync guide says an unused Changes token expires within 30 days. Each getChanges call returns a nextChangesToken, so an app that syncs at least every few weeks always holds a recent token."
      },
      {
        "q": "How do I avoid duplicates when resyncing after token expiry?",
        "a": "Dedupe on identifiers. Google's most ideal strategy is to re-read from your last read timestamp or the last 30 days and dedupe against previously read data using identifiers. Key your datastore on each record's metadata id, so re-reading the same record updates it instead of inserting a second copy. Google also recommends setting a client record id on records your app writes."
      },
      {
        "q": "Can a resync after changesTokenExpired recover deleted records?",
        "a": "Not by reading. Health Connect reports deletions only as a DeletionChange carrying the deleted record's id, and a deleted record does not come back from a fresh read. If deletions in the expired window matter for your product, use Google's delete-then-read strategy: remove what you imported for the last 30 days and read it again."
      }
    ],
    "related": [
      {
        "href": "/cookbook/incremental-sync-anchor",
        "label": "Recipe: incremental sync with a stored cursor"
      },
      {
        "href": "/architecture/incremental-sync",
        "label": "Incremental sync architecture"
      },
      {
        "href": "/fix/health-connect-no-data",
        "label": "Fix: Health Connect returns no data"
      },
      {
        "href": "/integrate/google-health-connect",
        "label": "Integrate Google Health Connect"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Sync cursors, expiry and deletions are where health data quietly goes wrong. We take Google's sync rules apart as we verify them; subscribe for the next breakdown."
    },
    "steps": [
      {
        "name": "Check changesTokenExpired on every getChanges response",
        "text": "It is a Boolean on a normal response, not an exception. Test it before processing changes, and never save the next token from a response where it is true."
      },
      {
        "name": "Request a fresh token first",
        "text": "Call getChangesToken with a ChangesTokenRequest for the same record type before re-reading, so writes made during the re-read appear in the next getChanges instead of falling in a gap."
      },
      {
        "name": "Re-read from the last read or 30 days back",
        "text": "Read records with a paged readRecords from whichever is further back, your stored last-read timestamp or 30 days ago. Loop until the page token is null or empty."
      },
      {
        "name": "Dedupe on record ids",
        "text": "Upsert each record keyed on its metadata id so the overlap updates rows rather than duplicating them. Google ranks read-and-dedupe as the most ideal recovery strategy."
      },
      {
        "name": "Decide how to handle deletions",
        "text": "A re-read cannot surface records deleted during the expired window. If stale deleted data is harmful, use Google's delete-then-read strategy for the last 30 days."
      },
      {
        "name": "Keep tokens per type and sync on foreground",
        "text": "Use one changes token per record type and run a sync each time the app becomes active, so a user who opens the app monthly never lets a token expire."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/response/ChangesResponse",
        "checked": "2026-10-03",
        "note": "changesTokenExpired: Whether requested Changes-Token has expired; class-level note"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient",
        "checked": "2026-10-03",
        "note": "getChanges expiry note (such as a month); getChangesToken: only valid for 30 days after they're generated"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/sync-data",
        "checked": "2026-10-03",
        "note": "unused token expires within 30 days; token-expiration approaches; ranked recovery strategies; per-type tokens; import timings"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/changes/DeletionChange",
        "checked": "2026-10-03",
        "note": "DeletionChange returns only Metadata.id, for privacy; recordId"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/response/ReadRecordsResponse",
        "checked": "2026-10-03",
        "note": "pageToken null when no more pages"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/read-data",
        "checked": "2026-10-03",
        "note": "pageToken may be an empty string when pagination completes; background read permission"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/permission/HealthPermission",
        "checked": "2026-10-03",
        "note": "PERMISSION_READ_HEALTH_DATA_HISTORY applies to getChanges"
      }
    ]
  },
  {
    "slug": "health-connect-rate-limit",
    "primaryQuery": "health connect rate limit exceeded",
    "h1": "Health Connect ERROR_RATE_LIMIT_EXCEEDED: Quota Errors and How to Back Off",
    "metaTitle": "Health Connect ERROR_RATE_LIMIT_EXCEEDED: Quota Errors",
    "metaDescription": "Android defines ERROR_RATE_LIMIT_EXCEEDED as the caller exhausting its rate limit. How it reaches Jetpack code, what Google documents, how to back off.",
    "updated": "2026-10-03",
    "answer": "ERROR_RATE_LIMIT_EXCEEDED is a Health Connect platform error code (value 7), which Android describes as \"The caller exhausted the allotted rate limit.\" Through the Jetpack library on Android 14 and later it reaches your code as an IllegalStateException with the platform HealthConnectException as its cause, and Google's own read sample catches IllegalStateException as a quota error and backs off. Google documents periodic and daily limits on reads and writes, with stricter limits in the background, but publishes no numbers. Retry the failed page or batch after a delay rather than restarting, and use aggregation and the changelog to make fewer calls.",
    "body": "A large Health Connect read or a bulk insert starts failing partway through with `java.lang.IllegalStateException`, and when you dig into the cause you find `android.health.connect.HealthConnectException` with error code 7. That code is `ERROR_RATE_LIMIT_EXCEEDED`. Google documents that the limits exist and how to stay under them. It does not publish the numbers.\n\n## What Google documents\n\nAndroid's [platform `HealthConnectException` reference](https://developer.android.com/reference/android/health/connect/HealthConnectException) (fetched October 3, 2026) defines `ERROR_RATE_LIMIT_EXCEEDED`, constant value 7, added in API level 34, as \"The caller exhausted the allotted rate limit.\"\n\nGoogle's [rate-limiting guide](https://developer.android.com/health-and-fitness/health-connect/rate-limiting) describes how the limits are structured:\n\n- **Reads and changelog:** \"A periodic limit on the number of API calls your app can make to the API\" and \"A daily limit on the number of API calls your app can make.\"\n- **Insert, update and delete:** a periodic limit, a daily limit, \"A memory limit for bulk insertions\" and \"A memory limit for single record insertions.\"\n- **Background:** \"background rate limiting is stricter than foreground rate limiting.\"\n\nThe guide says limits \"are variable based on the type of operation your app is performing, and whether that operation occurs in the foreground or background.\" It gives no figures. If a blog post quotes a number of calls per minute, that number does not come from this guide.\n\n## What your code actually catches\n\nThrough the Jetpack library you will not see `HealthConnectException` as the thrown type. The library's source ([`ExceptionConverter.kt`](https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/ExceptionConverter.kt), read October 3, 2026) maps four platform codes to standard exceptions: I/O to `IOException`, remote to `RemoteException`, security to `SecurityException`, invalid argument to `IllegalArgumentException`. Every other code, rate limiting included, becomes `IllegalStateException(this)` with the platform exception as its cause. That file only covers the platform path, which needs API 34 or higher. We did not verify how the Android 13 and lower app path reports a rate limit, and the mapping is internal code that can change.\n\nGoogle's own read sample agrees on the type. Its paging example in the [read-data guide](https://developer.android.com/health-and-fitness/health-connect/read-data) ends in `catch (quotaError: IllegalStateException)` with the comment `// Backoff`.\n\n`IllegalStateException` is not only a quota signal. Google's exception table lists two other meanings: \"The Health Connect service isn't available\" and \"The request isn't a valid construction.\" A request that is badly built fails the same way on every retry, so check the cause before you back off:\n\n```kotlin\n@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)\nfun platformErrorCode(e: IllegalStateException): Int? =\n    (e.cause as? HealthConnectException)?.errorCode\n\nfun isWorthRetrying(e: IllegalStateException): Boolean {\n    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return true // cause not inspectable here\n    return when (platformErrorCode(e)) {\n        HealthConnectException.ERROR_RATE_LIMIT_EXCEEDED,\n        HealthConnectException.ERROR_DATA_SYNC_IN_PROGRESS -> true\n        else -> false\n    }\n}\n```\n\n`ERROR_DATA_SYNC_IN_PROGRESS` (code 8) also belongs in the retry bucket. Android describes it as \"Data sync is in progress. Data read and writes are blocked. Caller should try this api call again later.\"\n\n## Back off and resume from the same page\n\nGoogle's read guide notes that `ReadRecordsRequest` has \"a default pageSize value of 1000\" and warns, when paging, to \"be careful to avoid rate-limiting concerns.\" When a page fails, retry that page with the same `pageToken`. Do not start the whole read again.\n\n```kotlin\nsuspend fun readAllHeartRate(\n    client: HealthConnectClient,\n    start: Instant,\n    end: Instant,\n    sink: suspend (List<HeartRateRecord>) -> Unit\n) {\n    var pageToken: String? = null\n    var waitMs = 1_000L // illustrative, not a Google figure\n    do {\n        try {\n            val page = client.readRecords(\n                ReadRecordsRequest(\n                    recordType = HeartRateRecord::class,\n                    timeRangeFilter = TimeRangeFilter.between(start, end),\n                    pageToken = pageToken\n                )\n            )\n            sink(page.records)\n            pageToken = page.pageToken\n            waitMs = 1_000L\n        } catch (e: IllegalStateException) {\n            if (!isWorthRetrying(e) || waitMs > 64_000L) throw e\n            delay(waitMs) // same pageToken: resume, don't restart\n            waitMs *= 2\n        }\n    } while (!pageToken.isNullOrEmpty())\n}\n```\n\nThe delays are ours. Google publishes no retry interval, so treat them as a starting point to tune against your own logs. For a sync job that must give up and continue later, persist `pageToken` along with the records you have stored, and pick up from it next run. That pattern is covered in [historical backfill](/architecture/historical-backfill).\n\n## Writes: retry from the failure, not from zero\n\nGoogle's rate-limiting guide is direct about write failures: \"we recommend retrying from where the exception occurred. Don't delete all the data in question and retry the entire write request. This approach eats into your insert quota, reduces performance, and has a negative impact on battery life.\"\n\nBatch size sets how much you redo. Android's reference says `insertRecords` runs \"in a transaction - if one fails, none is inserted\", so a failed batch is all-or-nothing and the retry unit is the batch. Our recommendation is to write in moderate batches and record which batches have committed, so a retry resends one batch instead of the whole export. The memory limits on bulk and single insertions are a further reason to avoid one huge `insertRecords` call.\n\n## Spend fewer calls in the first place\n\nGoogle names three habits that lower the risk:\n\n1. **Aggregate instead of summing raw reads.** The read guide says the aggregation API \"lessens the chances of rate limiting\" and handles duplicate records.\n2. **Use the changelog for sync.** The rate-limiting guide: \"you should utilize changelog handling to synchronize your database with data from Health Connect, rather than over-relying on raw read requests.\" Changes tokens expire, which is covered in [changesTokenExpired](/fix/health-connect-changes-token-expired).\n3. **Do less in the background.** Background limits are stricter, so leave heavy backfills for foreground sessions where you can. The scheduling trade-offs are in [background sync](/architecture/background-sync).\n\n## Where to go next\n\nIf the failing call threw `SecurityException` rather than `IllegalStateException`, see [Health Connect SecurityException](/fix/health-connect-securityexception). For a cloud API's HTTP 429 rather than an on-device quota, the [Fitbit 429 guide](/fix/fitbit-api-429-rate-limit) covers the server-side version of this problem.",
    "faqs": [
      {
        "q": "What are Health Connect's actual rate limit numbers?",
        "a": "Google does not publish them. Its rate-limiting guide, checked October 3, 2026, describes periodic and daily limits on reads and changelog calls, periodic, daily and memory limits on inserts, updates and deletes, and stricter limits in the background, but gives no figures. Build a loop that backs off when it is limited instead of tuning to a number found elsewhere."
      },
      {
        "q": "Which exception does the Jetpack client throw when Health Connect rate-limits my app?",
        "a": "IllegalStateException. On Android 14 and later the Jetpack library's source converts every platform error code it does not map to IOException, RemoteException, SecurityException or IllegalArgumentException into IllegalStateException, with the platform HealthConnectException as the cause. Google's read sample catches IllegalStateException as a quota error. Check the cause's error code before retrying, because an invalid request throws the same type."
      },
      {
        "q": "Why does my Health Connect background sync get rate-limited before foreground reads do?",
        "a": "Google's rate-limiting guide says background rate limiting is stricter than foreground rate limiting, because background work costs battery and raises privacy questions. Move heavy backfills to foreground sessions where you can, keep background jobs small, and use changes tokens instead of repeated raw reads."
      },
      {
        "q": "Should I retry a failed Health Connect batch insert from the beginning?",
        "a": "No. Google's guide recommends retrying from where the exception occurred, and warns that deleting the data and retrying the entire write eats into your insert quota. Since insertRecords is a transaction where one failure means nothing in that call is inserted, record which batches committed and resend only the failed one."
      }
    ],
    "related": [
      {
        "href": "/architecture/historical-backfill",
        "label": "Backfilling years of data without hitting limits"
      },
      {
        "href": "/architecture/background-sync",
        "label": "Background sync architecture"
      },
      {
        "href": "/fix/health-connect-changes-token-expired",
        "label": "Fix: Health Connect changesTokenExpired"
      },
      {
        "href": "/fix/health-connect-no-data",
        "label": "Fix: Health Connect returns no data"
      },
      {
        "href": "/fix",
        "label": "Fitness & health API troubleshooting"
      }
    ],
    "cta": {
      "pitch": "Quotas Google describes but never numbers deserve code that backs off instead of guessing. We cover the on-device and cloud versions of this problem; subscribe for the next one."
    },
    "steps": [
      {
        "name": "Read the cause of the IllegalStateException",
        "text": "On Android 14 and later, check whether the cause is a HealthConnectException with error code ERROR_RATE_LIMIT_EXCEEDED. The same exception type also means an unavailable service or an invalid request, which a retry will not fix."
      },
      {
        "name": "Back off and retry the same page",
        "text": "Wait, then retry with the same pageToken so the read resumes where it stopped. Double the wait on each failure and give up after a bound you choose; Google publishes no interval."
      },
      {
        "name": "Retry writes from the failed batch",
        "text": "insertRecords is a transaction, so a failed call inserted nothing. Resend only that batch, never the whole export, which Google warns eats into your insert quota."
      },
      {
        "name": "Aggregate instead of reading raw records",
        "text": "For totals and averages, use aggregate. Google says it lessens the chances of rate limiting and handles duplicate records."
      },
      {
        "name": "Sync through the changelog",
        "text": "Use changes tokens to pick up new and deleted data instead of re-reading time ranges. Google's rate-limiting guide recommends changelog handling over raw reads."
      },
      {
        "name": "Move heavy work to the foreground",
        "text": "Background limits are stricter than foreground ones. Keep background jobs small and resumable, and run large backfills while the app is open."
      }
    ],
    "sources": [
      {
        "url": "https://developer.android.com/reference/android/health/connect/HealthConnectException",
        "checked": "2026-10-03",
        "note": "ERROR_RATE_LIMIT_EXCEEDED (7), ERROR_DATA_SYNC_IN_PROGRESS (8), ERROR_SECURITY and related codes"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/rate-limiting",
        "checked": "2026-10-03",
        "note": "periodic, daily and memory limits; background stricter; retry from where the exception occurred; changelog over raw reads; no figures published"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/read-data",
        "checked": "2026-10-03",
        "note": "quotaError: IllegalStateException sample; default pageSize 1000; aggregation lessens rate limiting; IllegalStateException table row"
      },
      {
        "url": "https://developer.android.com/health-and-fitness/health-connect/write-data",
        "checked": "2026-10-03",
        "note": "same exception table on the write side"
      },
      {
        "url": "https://developer.android.com/reference/kotlin/androidx/health/connect/client/HealthConnectClient",
        "checked": "2026-10-03",
        "note": "insertRecords runs in a transaction: if one fails, none is inserted"
      },
      {
        "url": "https://github.com/androidx/androidx/blob/androidx-main/health/connect/connect-client/src/main/java/androidx/health/connect/client/impl/platform/ExceptionConverter.kt",
        "checked": "2026-10-03",
        "note": "Jetpack maps unmapped platform codes, including rate limiting, to IllegalStateException(this)"
      }
    ]
  }
];
