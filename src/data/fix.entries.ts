import type { ClusterEntry } from "@/lib/cluster";

/**
 * AUTO-ASSEMBLED troubleshooting guides (do not hand-edit; regenerate via
 * scratchpad/assemble5.mjs). Symptom -> cause -> fix, grounded in correct
 * HTTP/OAuth semantics and per-provider specifics.
 */
export const fixEntries: ClusterEntry[] =
[
  {
    "slug": "fitness-api-401-unauthorized",
    "primaryQuery": "fitness api 401 unauthorized",
    "h1": "Why Is My Fitness API Returning 401 Unauthorized?",
    "metaTitle": "Fix Fitness API 401 Unauthorized Errors",
    "metaDescription": "A 401 from a fitness API means your access token is bad, missing, expired, or revoked. Learn the ranked causes, the 401-vs-403 distinction, and the fix.",
    "updated": "2026-07-09",
    "answer": "A 401 Unauthorized from a fitness API means the server rejected your credential, not your permissions: the access token is missing, malformed, expired, or revoked. The most common cause is an expired access token, so refresh it and retry. Do not confuse 401 with 403 (Forbidden) — a 403 means the token is valid but lacks the required scope, and refreshing will not fix it; you must re-authorize with the missing scope instead.",
    "body": "Your fitness API call is coming back `401 Unauthorized`, which means the server rejected your **credential**, not your permissions — the access token is missing, malformed, expired, or revoked. The fix for the most common case is simple: your access token expired, so refresh it and retry. Before you do anything, though, confirm you are actually looking at a `401` and not a `403`, because they have completely different fixes.\n\n## 401 vs 403: read this before you touch anything\n\nThese two get confused constantly, and treating one like the other will waste your afternoon.\n\n- **`401 Unauthorized` means \"who are you? your credential is bad.\"** Authentication failed or was not supplied. The token is missing, malformed, expired, revoked, or the wrong type. Per RFC 6750, a spec-compliant server maps this to the Bearer error `invalid_token`.\n- **`403 Forbidden` means \"we know who you are, but you may not do this.\"** The token is authentic and active, but it **lacks the required scope**, or your app/user is not approved for that data. This maps to the Bearer error `insufficient_scope`.\n\nThe load-bearing consequence: **refreshing your token will NOT fix a `403`.** A refresh mints a new token with the *same* scopes the user already granted, so a scope problem survives the refresh untouched. If you are getting `403`, stop refreshing and re-authorize the user with the missing scope instead. The rest of this guide is about `401` only.\n\nA well-behaved server also tells you exactly what is wrong in a `WWW-Authenticate` response header:\n\n```http\nHTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer realm=\"...\", error=\"invalid_token\",\n                  error_description=\"The access token expired\"\n```\n\nRead that header (and the JSON body) first — providers put the specific reason in `error_description`.\n\n## Reproduce it with curl and read the response\n\nMake the failing call by hand so you can see the raw status line and headers. The `-i` flag prints the response headers, which is where the diagnosis lives:\n\n```bash\ncurl -i \"https://api.example-fitness.com/v1/user/-/activities/date/2026-07-08\" \\\n  -H \"Authorization: Bearer $ACCESS_TOKEN\"\n```\n\nThen read it top to bottom:\n\n- **Status line** — confirm it says `401`, not `403`. If it is `403`, go re-authorize with the right scope, not refresh.\n- **`WWW-Authenticate` header** — look for `error=\"invalid_token\"` (a `401` signal) versus `error=\"insufficient_scope\"` (a `403` signal).\n- **Response body** — each provider names the cause differently. Fitbit returns an `errors[]` array with `errorType` values like `expired_token` or `invalid_token`. Strava returns `{\"message\":\"Authorization Error\",\"errors\":[{\"field\":\"access_token\",\"code\":\"invalid\"}]}`. Garmin returns body text like `\"OAuthToken is invalid\"`. Oura and WHOOP return `401` on a bad or expired token.\n\n## Most likely causes, ranked\n\nIn rough order of how often they bite, from most common to least:\n\n1. **Expired access token.** Access tokens are short-lived by design (often an hour to a few hours; some providers longer — verify against the provider's docs). This is the number-one cause of a sudden `401` on a call that worked earlier. The fix is to refresh, not to re-authorize the user.\n2. **Missing or malformed `Authorization` header.** The header must be exactly `Authorization: Bearer <token>`. Classic breakers: no `Bearer ` prefix, a lowercase `bearer` on a strict server, leading/trailing whitespace or a stray newline in the token, sending the **refresh token** where the **access token** belongs, or double-encoding the token.\n3. **Revoked token.** The user disconnected your app, changed their password, or you called the revoke endpoint. A refresh will also fail here — the user must re-authorize from scratch.\n4. **Wrong token or wrong grant.** A token minted for a different app or environment (staging token against prod), or an ID token used where an access token is expected. The token is valid *somewhere*, just not here.\n\n## How to fix it\n\n### Step 1 — Confirm it is really a 401 (not a 403)\n\nRerun the `curl -i` above and check the status line and the `WWW-Authenticate` error code. `invalid_token` (or a `401`) means keep reading. `insufficient_scope` (or a `403`) means the token is fine and you have a scope problem — re-authorize with the missing scope and stop here.\n\n### Step 2 — Check the Authorization header format\n\nPrint the exact header your client sends and eyeball it against `Authorization: Bearer <access_token>`. Verify: the `Bearer ` prefix is present with correct casing, there is exactly one space, and there is no trailing newline or whitespace. Confirm you are sending the **access token**, not the refresh token or client secret. A quick way to catch a malformed local variable is to reproduce the exact same call in curl — if curl works and your app does not, the bug is in how your app builds the header.\n\n### Step 3 — Refresh the access token\n\nIf the header is correct and the token is simply old, exchange your stored refresh token for a new access token, then retry the original call:\n\n```bash\ncurl -s -X POST \"https://api.example-fitness.com/oauth/token\" \\\n  -d client_id=$CID -d client_secret=$SECRET \\\n  -d grant_type=refresh_token \\\n  -d refresh_token=$STORED_REFRESH_TOKEN\n```\n\nPersist the new access token and retry. **Refresh proactively** — refresh when the token has only a few minutes of life left, rather than waiting for a burst of `401`s in production. Note that several providers (Strava, WHOOP, Oura, Garmin) *rotate* the refresh token and return a new one in this response that you must save; if your refresh \"works once then fails,\" that is the rotation trap, covered in [refresh token not working](/fix/refresh-token-not-working).\n\n### Step 4 — If the refresh also fails, treat the grant as dead\n\nIf the refresh call returns `400 invalid_grant` (or the refresh itself `401`s), the credential is gone — the user revoked access, the grant expired, or you lost the rotated refresh token. Retrying will not help. Send the user back through the full authorization flow to mint a fresh grant. See the happy-path OAuth setup in the [integration guides](/integrate).\n\n### Step 5 — Rule out the wrong-token and clock-skew traps\n\nConfirm the token was issued by the same app credentials and environment you are calling (a staging token against production will `401`). If token exchanges intermittently fail as \"expired\" the moment they are issued, check that your server clock is NTP-synced — large clock skew makes fresh tokens look already-expired. And if the *token exchange* itself is failing with `redirect_uri` errors rather than your API calls, that is a different bug: see [OAuth redirect URI mismatch](/fix/oauth-redirect-uri-mismatch).\n\n## Still stuck? Quick diagnostic checklist\n\nRun these in order:\n\n1. `curl -i` the failing endpoint — is it truly `401`, or is it `403` (scope problem, do not refresh)?\n2. Read the `WWW-Authenticate` header and JSON body — `invalid_token` vs `insufficient_scope`.\n3. Diff your `Authorization` header against `Bearer <access_token>` — prefix, casing, whitespace, right token.\n4. Refresh the access token and retry the exact call.\n5. If refresh returns `invalid_grant`, the grant is dead — re-authorize the user.\n6. Confirm token environment matches (staging vs prod) and server clock is NTP-synced.\n\nIf all six pass and you still see `401`, capture the full request and response (headers included, token redacted) and check the provider's error-handling docs for that specific `errorType`.",
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
        "a": "The header must be exactly 'Authorization: Bearer <token>'. Common breakers are a missing Bearer prefix, lowercase bearer on strict servers, leading or trailing whitespace or a newline in the token, sending the refresh token instead of the access token, or double-encoding the token. Reproduce the call with curl to isolate a client-side formatting bug."
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
    "metaTitle": "Fix Fitbit API 429 Rate Limit Errors",
    "metaDescription": "Fitbit API returning 429 Too Many Requests? Read the per-user hourly limit, the reset headers, and how to fix it with backoff, caching, and webhooks.",
    "updated": "2026-07-09",
    "answer": "A Fitbit API 429 means you exceeded Fitbit's per-user hourly quota, roughly 150 requests per hour per consented user (as of 2026, verify), and every call past that is rejected until the window resets. The limit is counted per consented user, so one runaway loop on a single user trips it. To fix it, read the Fitbit-Rate-Limit-Reset or Retry-After header, wait that long, then retry with exponential backoff plus jitter. Longer term, cache responses, reduce and stagger calls, and replace polling with Fitbit subscriptions.",
    "body": "Your Fitbit API call just came back `429 Too Many Requests`. The cause is almost always simple: you exceeded Fitbit's per-user hourly quota (roughly 150 requests per hour per consented user, as of 2026 — verify against current docs), and every request past that returns 429 until the window resets. The quick fix is to stop hammering, read the `Fitbit-Rate-Limit-Reset` (or `Retry-After`) header, wait that long, and then retry with exponential backoff.\n\nThe critical thing to understand up front: **Fitbit's rate limit is counted per consented user, not per app.** So a single runaway loop or a tight polling job on one user's data will trip 429 for that user without touching anyone else's quota. That also means the fix is usually local to how you call one user's endpoints, not a global throttle across your whole app.\n\n## Most likely causes (ranked)\n\n1. **A polling loop that re-fetches the same user too often.** Cron jobs or refresh loops that pull intraday/activity data every few seconds or minutes burn through ~150 calls/hour fast. This is the number-one cause.\n2. **A retry storm on errors.** Code that retries failed calls immediately (no backoff) turns one blip into dozens of calls, which itself triggers 429 — then keeps retrying into the wall.\n3. **Fan-out per screen load.** Rendering a dashboard that makes many separate Fitbit calls (steps, heart rate, sleep, activities...) on every page view, uncached, multiplies requests per user.\n4. **No caching / no reset-header awareness.** Re-requesting data that hasn't changed, and blindly retrying without reading `Fitbit-Rate-Limit-Reset`, keeps you pinned at the limit.\n5. **Concurrent workers hitting one user.** Two jobs refreshing the same user in parallel double that user's request rate against a shared per-user bucket.\n\n## How to fix it\n\n### Step 1 — Confirm it's a rate limit and read the headers\n\nA Fitbit 429 returns a JSON error body and, importantly, rate-limit headers. Check them before doing anything else.\n\n```bash\ncurl -i -H \"Authorization: Bearer $ACCESS_TOKEN\" \\\n  \"https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json\"\n```\n\nLook at the response headers:\n\n```http\nHTTP/1.1 429 Too Many Requests\nFitbit-Rate-Limit-Limit: 150\nFitbit-Rate-Limit-Remaining: 0\nFitbit-Rate-Limit-Reset: 1893\nRetry-After: 1893\n```\n\n`Fitbit-Rate-Limit-Limit` is the quota for this user/window, `Fitbit-Rate-Limit-Remaining` is how many calls are left, and `Fitbit-Rate-Limit-Reset` is the number of seconds until the window resets (Fitbit resets roughly at the top of the hour). If `Retry-After` is present, honor it. The exact limit value can change, so read `Fitbit-Rate-Limit-Limit` from the response rather than hard-coding 150.\n\n### Step 2 — Wait for the reset, then back off with jitter\n\nWhen you get a 429, do NOT retry immediately. Wait at least `Fitbit-Rate-Limit-Reset` / `Retry-After` seconds. If those headers are missing, fall back to exponential backoff with full jitter so many users/workers don't all retry on the same tick (a thundering herd).\n\n```python\nimport random, time\n\ndef call_with_backoff(do_request, max_tries=6, cap=3600):\n    for attempt in range(max_tries):\n        r = do_request()\n        if r.status_code != 429:\n            return r\n        reset = r.headers.get(\"Fitbit-Rate-Limit-Reset\") or r.headers.get(\"Retry-After\")\n        if reset and str(reset).isdigit():\n            delay = int(reset)                                  # honor Fitbit first\n        else:\n            delay = random.uniform(0, min(cap, 2 ** attempt))   # full jitter fallback\n        time.sleep(delay)\n    raise RuntimeError(\"Fitbit rate limited: retries exhausted\")\n```\n\nTwo rules of thumb: honor the server's reset value first, and always add jitter to any computed backoff so retries spread out instead of synchronizing.\n\n### Step 3 — Cache responses and stop re-fetching unchanged data\n\nMost Fitbit data (yesterday's steps, last night's sleep, a completed activity) does not change. Cache it and serve from cache instead of re-calling. Practical moves:\n\n- Cache historical/daily summaries; only re-request the current day.\n- Store `Fitbit-Rate-Limit-Remaining` per user and short-circuit calls when it's near zero until the reset time passes.\n- De-duplicate identical in-flight requests for the same user so a page that needs steps twice makes one call.\n\n### Step 4 — Reduce and batch calls per user\n\nCut the number of requests each user requires:\n\n- Use endpoints that return a range in one call (e.g. a date-range time series) instead of one call per day.\n- Combine what you need per render; avoid a separate call per widget.\n- Spread background syncs out over time instead of refreshing every user on the same schedule — stagger jobs so no single user (or your overall traffic) spikes.\n- Serialize refreshes per user so two workers never double the rate on one user's bucket.\n\n### Step 5 — Replace polling with subscriptions (webhooks)\n\nThe biggest structural fix is to stop polling. Fitbit offers a subscription API that notifies your server when a user's data changes, so you fetch only when there's something new instead of asking on a timer. This collapses steady-state request volume dramatically and is the recommended way to stay under the per-user limit. Poll only as a fallback/reconciliation path.\n\n## Still stuck? Quick diagnostic checklist\n\n- Is it actually 429? Confirm the status code and read `Fitbit-Rate-Limit-Remaining` / `Fitbit-Rate-Limit-Reset` from the response headers.\n- Which user tripped it? Because the limit is per consented user, isolate the specific user and look at what's calling their endpoints in the last hour.\n- Do you retry without backoff anywhere? Grep for immediate retries and add the backoff-with-jitter wrapper.\n- Are you polling on a timer? Move the hot paths to subscriptions/webhooks.\n- Are you caching? If every request hits Fitbit live, add a cache for anything older than \"today.\"\n- Any parallel workers on the same user? Add a per-user lock.\n\n## Related\n\n- Happy-path setup: [Fitbit API integration guide](/integrate/fitbit-api)\n- Bigger picture: [Wearable data APIs](/fitness-apis/wearable-data-apis) and [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api)\n- If you're also seeing auth failures: [Fitness API 401 Unauthorized](/fix/fitness-api-401-unauthorized)\n\n> Heads up on a migration: Fitbit's developer platform is moving toward Google's Health ecosystem, with the Fitbit Web API expected to be folded into Google Health APIs around September 2026 (as of 2026, verify against Google/Fitbit announcements). Rate-limit semantics may change with that transition, so check the current docs before relying on exact numbers.",
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
        "a": "Fitbit's developer platform is moving toward Google's Health ecosystem, with the Fitbit Web API expected to fold into Google Health APIs around September 2026 (as of 2026, verify against official announcements). Rate-limit details may change with that transition."
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
    "updated": "2026-07-09",
    "answer": "A HealthKit query that returns an empty array with no error is usually a denied read permission, but HealthKit hides read-authorization state by design, so a blocked read is indistinguishable from a type that genuinely has no data. You cannot check read status directly. Because write status IS observable via authorizationStatus(for:), the fix is a write-then-read test: save a throwaway sample of the target type and read it back. If it round-trips, your plumbing is fine and the empty read is denied-read or truly no data; if the write fails, the problem is your Info.plist keys, HealthKit capability, or entitlement.",
    "body": "Your HealthKit query runs, throws no error, and returns an empty array. Here is the single most important thing to know: **HealthKit cannot tell you that a read was denied — a blocked read returns the exact same empty result as a type that genuinely has no samples.** Apple hides read-authorization state on purpose, so \"permission denied\" and \"no data\" are indistinguishable from your code. The fastest way forward is to stop trusting the empty result and isolate the cause with a write-then-read test, because write status *is* observable.\n\n## Why an empty read is ambiguous by design\n\nApple deliberately withholds read-permission status to avoid leaking that sensitive health data exists. From Apple's authorization docs: to help prevent leaks of sensitive health information, your app cannot determine whether the user granted permission to read data. The practical consequence:\n\n- `authorizationStatus(for:)` reports the **share (write)** side truthfully — `.notDetermined`, `.sharingDenied`, or `.sharingAuthorized`.\n- It tells you **nothing reliable about read** access. A query against a type the user blocked returns the same empty array as a type with zero samples.\n\nSo the empty result is not your bug report. You have to infer the cause by ruling out plumbing and then using the write side (which you *can* observe) as a proxy.\n\n## Most likely causes (ranked)\n\n1. **Read permission was denied** — the most common and the hardest to see, because it is invisible by design. Isolate it with the write-then-read test below.\n2. **Missing Info.plist usage-description keys** — reading requires `NSHealthShareUsageDescription`; writing requires `NSHealthUpdateUsageDescription`. Missing the relevant key crashes the app at the authorization request, so data never flows.\n3. **HealthKit capability not enabled** — without the HealthKit capability (and its `com.apple.developer.healthkit` entitlement), `HKHealthStore` calls fail.\n4. **Running on the iOS Simulator** — the Simulator has little or no Health data and inconsistent HealthKit behavior; queries commonly return empty even with correct code.\n5. **The user genuinely has no data for that type** — no source app or device ever wrote that quantity or category type (e.g., no VO2 max, no blood glucose).\n6. **Background delivery not set up** — for live updates you need `enableBackgroundDelivery(for:frequency:)`, an `HKObserverQuery`, and the background-delivery entitlement; without them data looks stale or empty.\n7. **Wrong date range or predicate** — a query predicate whose `startDate…endDate` misses the samples (time-zone bugs, `Date()` boundaries, `.strictStartDate`) returns empty even though data exists.\n\n## How to fix it\n\n### Step 1 — Confirm the plumbing is alive\n\nBefore anything else, verify HealthKit can run at all:\n\n```swift\nguard HKHealthStore.isHealthDataAvailable() else {\n    // HealthKit unavailable on this device (e.g. iPad without Health, or Simulator quirks)\n    return\n}\n```\n\nIf this returns `false`, stop — no query will work until it is `true`. Also confirm the **HealthKit capability** is added in Signing & Capabilities and the entitlement is present in the signed build.\n\n### Step 2 — Verify both Info.plist keys exist\n\nReads need `NSHealthShareUsageDescription`; writes need `NSHealthUpdateUsageDescription` (Xcode labels these \"Privacy – Health Share Usage Description\" and \"…Update Usage Description\"). A missing key produces a crash log at `requestAuthorization`. Grep the built app's `Info.plist` for both strings; if the key you need is absent, the request silently fails or crashes and no data ever arrives.\n\n### Step 3 — Check the WRITE status (the observable half)\n\nYou cannot query read status, but you can confirm the permission sheet was actually presented by checking the share side:\n\n```swift\nlet type = HKQuantityType(.stepCount)\nswitch healthStore.authorizationStatus(for: type) {\ncase .notDetermined:\n    // The permission sheet was never shown — call requestAuthorization first\ncase .sharingDenied:\n    // Write is denied; read is likely denied too, but you can't confirm read directly\ncase .sharingAuthorized:\n    // Sheet was shown and write allowed — proceed to the write-then-read test\n@unknown default:\n    break\n}\n```\n\n`.notDetermined` means you never requested authorization — fix that first with `requestAuthorization(toShare:read:)`.\n\n### Step 4 — Isolate read-denial with a write-then-read test\n\nThis is the core diagnostic. Because write status is observable, writing a throwaway sample and immediately reading it back tells you exactly where the failure is. Write a sample of the target type with `HKHealthStore.save(_:)`, then run an `HKSampleQuery` for that same type:\n\n- **The sample round-trips back** — your auth, capability, and query are all correctly wired. The original emptiness is either a **denied read** on the real data or the **user genuinely has no data**. Send the user to Settings → Privacy & Security → Health → *[your app]* to inspect and toggle read access.\n- **The write succeeds but the read still returns empty** — the read side is denied (invisible) or your predicate is wrong. Move to Step 5.\n- **The write itself fails** — the problem is upstream: capability, entitlement, or Info.plist (Steps 1–3).\n\n### Step 5 — Widen the predicate to rule out a query bug\n\nTemporarily remove the filter to see whether the data exists at all:\n\n```swift\nlet query = HKSampleQuery(\n    sampleType: HKQuantityType(.stepCount),\n    predicate: nil,               // no date filter at all\n    limit: HKObjectQueryNoLimit,\n    sortDescriptors: nil\n) { _, samples, error in\n    // If samples appear here but not with your real predicate,\n    // the date range / options were the bug.\n}\n```\n\nIf data appears with `predicate: nil` but not with your real predicate, the bug is your `startDate…endDate`, `HKQueryOptions` (e.g. `.strictStartDate`), or an anchored-query anchor — not permissions.\n\n### Step 6 — Test on a real device with real data\n\nIf you are still empty on the **Simulator**, treat it as inconclusive. Install the app on a physical device that has samples for that type (open **Health app → Browse** and confirm the type has data under \"Data Sources & Access\"), then re-run Steps 4–5.\n\n### Step 7 — For live updates, wire background delivery\n\nIf the initial read works but data never refreshes while backgrounded, you are missing the update path: call `enableBackgroundDelivery(for:frequency:)`, register an `HKObserverQuery`, and add the `com.apple.developer.healthkit.background-delivery` entitlement. Verify `enableBackgroundDelivery` completed without error and the observer's completion handler is actually being called.\n\n## Still stuck? Quick triage checklist\n\n- `HKHealthStore.isHealthDataAvailable()` returns `true`?\n- HealthKit capability + entitlement in the signed build?\n- Both `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` in `Info.plist`?\n- `authorizationStatus(for:)` on the share side is `.sharingAuthorized` (proves the sheet was shown)?\n- Write-then-read round-trips? If yes, the remaining empty read is denied-read or genuinely-no-data — check Settings → Privacy & Security → Health.\n- Data visible for that exact type in the Health app on a **real device**?\n- Predicate widened to `nil` still empty? Then it is permission or no-data, not the query.\n\nRemember the load-bearing rule: an empty HealthKit read is never proof of anything by itself. Use the write side and a widened predicate to turn \"empty\" into an answer.\n\nFor the correct end-to-end setup, see the [HealthKit integration guide](/integrate/healthkit). If you are still deciding between platforms or need to support Android too, compare [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect). Health Connect has a different failure mode — see [Health Connect no data](/fix/health-connect-no-data).",
    "faqs": [
      {
        "q": "Can I detect whether the user denied read access in HealthKit?",
        "a": "No. Apple deliberately hides read-authorization state to avoid leaking that health data exists, so authorizationStatus(for:) only reports the share/write side. A denied read returns the same empty result as a type with no data. Infer it with a write-then-read test."
      },
      {
        "q": "Why does authorizationStatus(for:) say authorized but my read is still empty?",
        "a": "That status reflects write/share permission, not read. The user can allow writing while blocking reading, and HealthKit will not tell you. Confirm real data exists in the Health app and use a widened predicate to rule out a query bug."
      },
      {
        "q": "Does HealthKit work on the iOS Simulator?",
        "a": "Partly, but the Simulator has little or no Health data and inconsistent behavior, so queries often return empty even with correct code. Always confirm on a real device with data before concluding your code is wrong."
      },
      {
        "q": "My app crashes when I request HealthKit authorization. Why?",
        "a": "The most common cause is a missing Info.plist usage-description key: NSHealthShareUsageDescription for reads or NSHealthUpdateUsageDescription for writes. Add the relevant key and the crash at requestAuthorization goes away."
      },
      {
        "q": "How do I send the user to fix HealthKit read permissions?",
        "a": "You cannot toggle read access from code. Direct the user to Settings, then Privacy & Security, then Health, then your app, where they can inspect and enable the specific read types you requested."
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
        "text": "Call authorizationStatus(for:) on the share side. This reports write status truthfully and confirms the permission sheet was shown, even though it tells you nothing reliable about read access."
      },
      {
        "name": "Run a write-then-read test",
        "text": "Save a throwaway sample of the target type, then query it back. If it round-trips your auth and query are wired and the empty read is a denied read or genuinely no data; if the write fails, fix capability, entitlement, or Info.plist."
      },
      {
        "name": "Widen the predicate",
        "text": "Re-run the query with predicate set to nil to remove the date filter. If data appears, the bug is your date range or query options, not permissions."
      },
      {
        "name": "Test on a real device",
        "text": "The iOS Simulator has little or no Health data, so treat Simulator empties as inconclusive. Run on a physical device that has samples for that type in the Health app."
      },
      {
        "name": "Wire background delivery for live updates",
        "text": "If the first read works but data never refreshes, add the background-delivery entitlement, call enableBackgroundDelivery(for:frequency:), and register an HKObserverQuery."
      }
    ]
  },
  {
    "slug": "health-connect-no-data",
    "primaryQuery": "health connect returns no data",
    "h1": "Why Is Google Health Connect Returning No Data?",
    "metaTitle": "Health Connect Returns No Data? Causes & Fixes",
    "metaDescription": "Health Connect readRecords returns empty? Check for a writer app, per-type read permission, getSdkStatus, the 30-day history cap, and Play declarations.",
    "updated": "2026-07-09",
    "answer": "The most common reason Google Health Connect returns no data is that no source app is writing that record type: Health Connect is an on-device store, not a data source, so something like Fitbit, Samsung Health, or the phone step recorder must populate it first. Open the Health Connect UI and confirm at least one app is writing the exact type you read. If a writer exists, check that your per-type read permission was actually granted (a SecurityException means it was not), that getSdkStatus returns SDK_AVAILABLE, and that you are not just hitting the default 30-day history window, which needs PERMISSION_READ_HEALTH_DATA_HISTORY for older data.",
    "body": "Your Android app calls `HealthConnectClient.readRecords(...)`, gets no error worth acting on, and the list comes back empty. The single most common reason is not your code at all: **no source app is writing that record type into Health Connect**, so there is genuinely nothing to read. Health Connect is an on-device *store*, not a data source — something (Fitbit, Samsung Health, the phone's step recorder) has to populate it first. The quick check: open the Health Connect UI, go to **App permissions / Data and access**, and confirm at least one app is *writing* the exact type you are reading.\n\nIf a writer exists and reads are still empty, work down the ranked causes below. The other frequent culprits are a per-type read permission you never actually got granted (which can surface as a `SecurityException`), Health Connect not being available on the device (`getSdkStatus` is not `SDK_AVAILABLE`), and the default 30-day history window hiding older data. For the iOS equivalent of this problem, see [HealthKit returns no data](/fix/healthkit-no-data); to re-check your setup end to end, use the [Google Health Connect integration guide](/integrate/google-health-connect).\n\n> **Version note.** API names below (`HealthConnectClient`, `getSdkStatus`, `getGrantedPermissions`, `TimeRangeFilter`, `PERMISSION_READ_HEALTH_DATA_HISTORY`) are current stable Health Connect Jetpack API as of 2026. Play Console health-data *policy* specifics change often — verify those against current Google documentation before you ship.\n\n## Most likely causes (ranked)\n\n1. **No source/provider app is writing that record type.** Health Connect is empty until an app writes into it. Perfect code plus perfect permissions still returns nothing if no writer exists for that type.\n2. **The per-type read permission was never granted.** Permissions are granular per record type and per direction (read vs write). Reading a type you were not granted yields an empty result or a `SecurityException`.\n3. **Health Connect is not available (`getSdkStatus` is not `SDK_AVAILABLE`).** If the SDK reports unavailable or \"provider update required,\" you cannot read anything.\n4. **The default ~30-day history cap.** You only see roughly the last 30 days unless you request and are granted `PERMISSION_READ_HEALTH_DATA_HISTORY`.\n5. **Play Console health-data declaration gating production.** Certain data types can be blocked in production builds until your health apps declaration is submitted and approved.\n\n## Step 1: Confirm an app is actually writing that record type\n\nBefore debugging code, rule out the boring answer. On the device, open **Health Connect** (Settings → Apps → special access, or the Health Connect app on older devices), then **Data and access** and browse the specific category (steps, heart rate, sleep, etc.). If no samples appear there, no reader can ever return data.\n\nFix: install or enable a writer for that type — for example Fitbit, Samsung Health, or the phone's built-in step recorder — and confirm data lands in the Health Connect data browser before you touch your app again. This is the same class of bug as an empty HealthKit store on iOS ([HealthKit no data](/fix/healthkit-no-data)): the platform is a store, not a sensor.\n\n## Step 2: Verify Health Connect is available with getSdkStatus\n\nEvery Health Connect call assumes the platform is present and usable. Call `HealthConnectClient.getSdkStatus(context)` first and branch on the result — anything other than `SDK_AVAILABLE` means you cannot read.\n\n```kotlin\nwhen (HealthConnectClient.getSdkStatus(context)) {\n    HealthConnectClient.SDK_AVAILABLE -> {\n        val client = HealthConnectClient.getOrCreate(context)\n        // proceed with reads\n    }\n    HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> {\n        // send the user to update Health Connect\n    }\n    else -> {\n        // SDK_UNAVAILABLE — Health Connect not usable on this device\n    }\n}\n```\n\nIf you skip this check you may be calling into a client that will never return data. On older devices Health Connect can be an installable app rather than a bundled system module, so treat \"not available\" as a real, common state and route the user to install or update it.\n\n## Step 3: Check the read permission is granted (not just declared)\n\nDeclaring a permission in the manifest is not the same as having it granted at runtime. Read the currently granted set and confirm the exact per-type read permission is present.\n\n```kotlin\nval granted = client.permissionController.getGrantedPermissions()\nval stepsRead = HealthPermission.getReadPermission(StepsRecord::class)\n\nif (stepsRead !in granted) {\n    // permission not granted — launch your permission request flow.\n    // Reading now would return empty or throw SecurityException.\n}\n```\n\nIf `getGrantedPermissions()` does not contain `HealthPermission.getReadPermission(<Record>::class)` for the type you are reading, request it. A `SecurityException` on the read is the tell that the permission is either declared-but-not-granted or not declared at all. Remember: **uninstalling your app revokes all its Health Connect permissions**, so a fresh install starts from zero.\n\n## Step 4: Widen the TimeRangeFilter and rule out the 30-day history cap\n\nIf recent data appears but older data is empty (or errors), you are hitting the history window. By default an app can read data from up to ~30 days before any permission was first granted. On Android 14+ there is no historical limit reading your *own* app's data, but a 30-day limit reading *other apps'* data; on Android 13 and lower the 30-day limit applies to reading any data.\n\nFirst widen the filter to prove the query itself is not the problem:\n\n```kotlin\nval response = client.readRecords(\n    ReadRecordsRequest(\n        recordType = StepsRecord::class,\n        timeRangeFilter = TimeRangeFilter.between(\n            Instant.now().minus(7, ChronoUnit.DAYS),\n            Instant.now()\n        )\n    )\n)\n```\n\nIf seven days returns data but ninety days does not, that is the history cap, not a bug. To read records older than ~30 days, declare and request `PERMISSION_READ_HEALTH_DATA_HISTORY`; without it, an attempt to read records older than 30 days results in an error. Note the window **resets from the reinstall date** if the user reinstalls your app.\n\n## Step 5: Confirm the Play Console health-data declaration for production\n\nSideloaded and debug builds behave differently from Play-distributed ones. Apps that request Health Connect data types must complete the Play Console **health apps declaration** and pass review, and production access to certain data types can be gated until that is approved.\n\nConfirm the declaration is submitted and approved for the release track you are testing. If a type reads fine in a local/dev build but returns nothing from a production install, suspect this gating rather than your code. *(As of 2026, verify the exact policy and gated-type list against current Play Console documentation — these change.)*\n\n## Still stuck? Diagnostic checklist\n\nRun these in order — each rules out one ranked cause:\n\n1. **Is anything writing the type?** Health Connect UI → Data and access → the specific category shows samples. If empty, install a writer (Step 1).\n2. **Is Health Connect available?** `getSdkStatus(context)` returns `SDK_AVAILABLE` (Step 2).\n3. **Is the read permission granted?** `getGrantedPermissions()` contains `HealthPermission.getReadPermission(<Record>::class)`; no `SecurityException` on read (Step 3).\n4. **Is it just old data?** A short `TimeRangeFilter` returns data but a long one does not → grant `PERMISSION_READ_HEALTH_DATA_HISTORY` (Step 4).\n5. **Is production gated?** The type works in a dev build but not a Play install → check the health apps declaration (Step 5).\n\nIf all five pass and reads are still empty, capture the exact record type, the `TimeRangeFilter` bounds, the granted-permission set, and any `SecurityException` stack trace before escalating. For a clean-slate re-check of the whole flow, walk back through the [Google Health Connect integration guide](/integrate/google-health-connect); if you also ship on iOS, the [HealthKit no-data guide](/fix/healthkit-no-data) covers the Apple-side equivalents.",
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
        "a": "By default an app can read Health Connect data from up to about 30 days before any permission was first granted. On Android 14 and later there is no limit reading your own app's data but a 30-day limit reading other apps' data; on Android 13 and lower the limit applies to any data. To read older records, declare and request PERMISSION_READ_HEALTH_DATA_HISTORY, otherwise reads older than 30 days error out."
      },
      {
        "q": "What does getSdkStatus tell me?",
        "a": "getSdkStatus reports whether Health Connect is usable on the device. SDK_AVAILABLE means you can proceed; SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED means the user must update Health Connect; and SDK_UNAVAILABLE means it is not usable on that device. On older devices Health Connect can be an installable app rather than a bundled system module, so treat unavailable as a common, real state and prompt install or update."
      },
      {
        "q": "Does a production build behave differently from my dev build?",
        "a": "It can. Apps requesting Health Connect data types must complete the Play Console health apps declaration and pass review, and production access to certain types can be gated until that is approved. If a type reads fine in a sideloaded or debug build but returns nothing from a Play install, suspect this gating. As of 2026, verify the exact policy against current Play Console documentation, since these specifics change."
      }
    ],
    "related": [
      {
        "href": "/fix/healthkit-no-data",
        "label": "Fix: HealthKit returns no data"
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
      "pitch": "We break down on-device health stores and wearable APIs every week; join the newsletter to wire Health Connect and motion tracking into your Android app without the empty-data surprises."
    },
    "steps": [
      {
        "name": "Confirm an app is writing that record type",
        "text": "Health Connect is a store, not a sensor, so it stays empty until a source app writes into it. Open the Health Connect UI under Data and access and confirm at least one app is writing the exact type you are reading before debugging code."
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
        "text": "If recent data appears but older data does not, you are hitting the default 30-day history window. Widen the TimeRangeFilter to test, then request PERMISSION_READ_HEALTH_DATA_HISTORY to read records older than about 30 days."
      },
      {
        "name": "Confirm the Play Console health-data declaration",
        "text": "Production access to some data types can be gated until your Play Console health apps declaration is submitted and approved. If a type reads in a dev build but not a Play install, check the declaration for that release track rather than your code."
      }
    ]
  },
  {
    "slug": "strava-webhook-not-firing",
    "primaryQuery": "strava webhook not firing",
    "h1": "Why Is My Strava Webhook Not Firing?",
    "metaTitle": "Fix: Strava Webhook Not Firing",
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
    "body": "Your webhook is quiet, or a workout the user just finished isn't in your API yet — and nothing is technically broken. The single most common cause: **the data hasn't finished syncing yet.** A reading has to travel device to phone app to the provider's cloud before any webhook can fire, and each hop runs on its own schedule. Wearable pipelines are **near-real-time, not instant** — set that expectation first, then work down the causes below.\n\n## Set expectations: the sync chain\n\nNew data does not appear the instant a rep, a heartbeat, or a run happens. It moves through four stages, and a webhook to you fires only at the very end:\n\n```\ndevice (watch/ring)  →  phone app (vendor)  →  provider cloud  →  webhook  →  you\n```\n\n- **Device to phone:** the watch or ring syncs over Bluetooth on its own schedule — often every few minutes, sometimes only when the vendor app is opened.\n- **Phone to cloud:** the vendor app uploads to the provider's cloud, again on its own cadence.\n- **Cloud to you:** only once the provider's cloud has the data does it push a webhook (or make it available to poll).\n\nSo a gap of minutes — occasionally longer — between \"the user did the thing\" and \"it's in my API\" is normal, not a bug. Rule that out before deep debugging. For the bigger picture of how these pipelines work, see the [wearable data APIs](/fitness-apis/wearable-data-apis) overview.\n\n## Most likely causes (ranked)\n\n1. **The data hasn't synced device → phone → cloud yet.** The wearable syncs on its own schedule, and webhooks fire only *after* the provider's cloud has the data. This is the number-one cause of \"missing\" data.\n2. **You expected history but only get data from connection-time forward.** A new connection yields data only from that point onward unless you make an explicit historical/backfill request — and some providers only expose recent data.\n3. **A webhook delivery failed and was retried or dropped.** If your endpoint returned a non-2xx status or timed out, the event never landed. Make your handler idempotent and return 200 fast.\n4. **For an aggregator like Terra: the user connected but hasn't synced, or you never requested history.** \"Connected\" is not \"has data\" — the user still has to open the vendor app and sync, and prior history still needs a backfill call.\n\n## How to fix it\n\n### Step 1: Force a sync and confirm in the vendor's own dashboard\n\nHave the user open the vendor app (Garmin Connect, Fitbit, Oura, etc.) and force a sync — usually \"pull down to refresh.\" Then confirm the reading actually appears in the **vendor's own web dashboard or app** before blaming the API layer. If it isn't even in Garmin Connect, no API can have it yet.\n\nTerra states this plainly: *\"If the wearable hasn't synced to the respective app on the end user's phone, or if the app has not synced to the cloud, Terra will be unable to retrieve that data.\"* The same logic applies to every provider.\n\n### Step 2: Wait out normal latency before deep debugging\n\nIf the data is in the vendor dashboard but not yet in your API, give the pipeline a few minutes. Near-real-time means the cloud-to-you push has its own small delay. Rule this out first — a surprising share of \"missing data\" reports are just impatience with a normal source-side lag.\n\n### Step 3: Request historical data explicitly (don't assume backfill)\n\nBy default a **new connection only yields data from the connection point forward.** To build a historical profile you must make an explicit backfill request, and how far back you can go is provider-dependent. With Terra, request a date range on the REST endpoint:\n\n```bash\ncurl --request GET \\\n  --url 'https://api.tryterra.co/v2/activity?user_id=USER_ID&start_date=2026-05-01&end_date=2026-06-30&to_webhook=true' \\\n  --header 'dev-id: YOUR_DEV_ID' \\\n  --header 'x-api-key: YOUR_API_KEY'\n```\n\nNote Terra's **28-day async rule**: for ranges longer than 28 days it sends the data asynchronously over your webhook even if `to_webhook` is false, because a large payload would otherwise hang the request. Match the `terra-reference` header on your request to the `terra-signature` on the eventual webhook to know the transfer completed. Verify the exact endpoint and params against the current Terra docs. See the [Terra integration guide](/integrate/terra-api) for the full setup.\n\n### Step 4: Make sure your webhook actually accepted the delivery\n\nIf your endpoint returns a non-2xx status or times out, the provider counts it as a delivery failure — some retry with backoff, some drop the event. In Terra these show up as **400 or 500 errors in Dashboard, then Payload History**. The fix is structural:\n\n- **Return 200 (or any 2xx) immediately,** then process asynchronously. A slow or erroring handler looks exactly like \"webhooks aren't firing.\"\n- **Make the handler idempotent** so retried deliveries don't double-insert.\n- Check that no auth middleware, WAF, or redirect (301/302) sits in front of the webhook path.\n\nThis is the same failure pattern behind Strava webhooks — see [Strava webhook not firing](/fix/strava-webhook-not-firing) for the handshake-and-handler details.\n\n### Step 5: For aggregators, isolate the connection from the delivery path\n\nIf a user is \"connected\" through an aggregator but you see no data, walk this Terra checklist to find where the break is:\n\n- **Not synced yet** — force a sync; confirm data in the vendor's own dashboard (Step 1).\n- **Wrong account** — the user may have authenticated a different or empty vendor account.\n- **Destination misconfigured** — missing dedicated credentials surface as 400/500 in Payload History.\n- **Force a backfill to isolate the fault** — in Terra, go to Dashboard, then Tools, then Debug, then Users, and request a backfill for that `user_id`. If data *does* come through this way, the connection is fine and your realtime webhook path is the problem. (Verify the menu path; this requires a recent Terra SDK.)\n\n## Still stuck? Quick triage\n\n- [ ] Is the reading in the **vendor's own app/dashboard**? If not, it's a sync issue, not an API issue.\n- [ ] Is the data **after** the user's connection date? Data before it needs an explicit backfill request.\n- [ ] Does your webhook return **2xx within a couple of seconds**, before doing any heavy work?\n- [ ] Is your handler **idempotent** so retries are safe?\n- [ ] Have you checked the provider's **payload/delivery history** for 4xx/5xx on your endpoint?\n- [ ] Have you simply **waited a few minutes** to rule out normal near-real-time latency?\n\nIf data flows on a manual backfill but never arrives in realtime, the connection is healthy and the problem is on the delivery path — focus there. For choosing between aggregators and direct integrations, see the [wearable data APIs](/fitness-apis/wearable-data-apis) guide.",
    "faqs": [
      {
        "q": "How long should wearable data take to appear?",
        "a": "There is no fixed guarantee, but it is near-real-time rather than instant. The device syncs to its phone app on its own schedule (often every few minutes, sometimes only when the app is opened), the app uploads to the vendor cloud, and only then does a webhook fire. A gap of minutes, occasionally longer, is normal."
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
    "body": "If you filled out a form, emailed Garmin, or went looking for a \"sign up for API keys\" button and got nowhere, you are not doing anything wrong. Garmin's developer program is **partner-approval-only** (there is no self-serve key), and as of 2026 new sign-ups are **reportedly on hold** — the public access-request form appears to have been removed with no published re-open date. The quick unblock is to register your interest and, in the meantime, pull Garmin data through an aggregator that already holds Garmin partner access.\n\n## What's actually going on\n\nTwo separate things make Garmin access hard, and it helps to name both.\n\n**1. It was never self-serve.** Unlike Strava or Fitbit, where you register an app in a portal and immediately get a client ID and secret, Garmin's Health and Activity APIs require you to **apply and be approved as a Garmin partner**. Even in normal times there is no instant key — approval is a manual, business-level review that can take weeks.\n\n**2. New onboarding is reportedly paused as of 2026.** Multiple developer reports (Garmin's own forums and a public GitHub issue opened around mid-2026) describe the **access-request form being removed or \"under revision,\"** meaning new requests cannot be submitted at all, with **no published ETA**. Some describe the program as effectively offline for months, with support replying only \"wait until the form is back online.\" Existing approved partners are said to be unaffected — this looks like a pause on *new* onboarding, not a revocation of current access.\n\nBecause this status changes over time, **treat it as \"verify,\" not gospel.** Before you give up or tell a stakeholder Garmin is closed, load `https://developer.garmin.com/gc-developer-program/` and look for the access/request form yourself. If the form is present and accepting submissions, the pause has lifted.\n\n## Most likely reasons you're stuck\n\nRanked from most to least common:\n\n1. **You expected a self-serve key.** There isn't one, and there never was. You must apply for a partnership.\n2. **The request form is currently removed / paused.** You literally cannot submit right now, so no amount of retrying will work. This is on Garmin's side, not yours.\n3. **You applied and are waiting.** Manual partner review can take weeks; silence is normal, not a rejection.\n4. **You tried an unofficial/self-host route that still needs your own Garmin credentials** — which you can't obtain while the program is paused (the chicken-and-egg problem below).\n\n## How to unblock yourself\n\n### Step 1: Confirm the live status before anything else\n\nOpen `https://developer.garmin.com/gc-developer-program/` in a browser and check whether the access-request form is present and accepting submissions. Community reports go stale fast, so your own check is the source of truth. If the form is back, skip to Step 2. If it's gone or says \"under revision,\" the pause is real and you should plan around it (Steps 3-4).\n\n### Step 2: Apply / register interest and wait (the official path)\n\nIf the form is live, submit it — expect to describe your company, your app, and your intended use of the Health and/or Activity APIs. Then **wait for manual review**; there is no self-serve fallback and no guaranteed timeline, so budget weeks, not hours. If the form is currently removed, monitor the developer portal and the Garmin Forums for its return, and register interest through whatever contact channel is offered so you're in the queue when onboarding reopens.\n\n**Do not build against Garmin on the assumption you'll be approved.** Confirm access first.\n\n### Step 3: Consider an aggregator that already holds Garmin partner access\n\nThe standard unblock while direct access is gated is to go through a wearable-data aggregator that already has a Garmin partnership. Providers like **Terra** (and others such as Rook, Validic, Spike, or Vital) let the user link their Garmin account through the aggregator's auth widget; the aggregator handles OAuth and pushes normalized Garmin data to your webhook. Terra, for example, advertises Garmin connectivity described as **not requiring your own Garmin Developer Program approval** — verify each provider's current Garmin support and terms, since these change.\n\n**Watch for the chicken-and-egg trap.** Some open-source or self-host integrations still require **you** to supply your own Garmin API credentials — which you can't get while the program is paused. That path doesn't actually unblock you. Prefer an aggregator that uses its **own** approved Garmin credentials, so you never need Garmin's direct approval at all.\n\nFor the integration mechanics once you have access (direct or via aggregator), see the [Garmin API integration guide](/integrate/garmin-api).\n\n### Step 4: Consider alternative devices or ingestion routes for now\n\nIf you can't wait, you have honest fallbacks that don't depend on Garmin's cloud API:\n\n- **Read Garmin data from the phone's health store.** If a user's Garmin data lands in **Apple HealthKit** or **Google Health Connect**, you can read it on-device without Garmin's API. See [/integrate/healthkit](/integrate/healthkit) and [/integrate/google-health-connect](/integrate/google-health-connect).\n- **Reach Garmin activities through Strava.** Once a user connects Garmin to Strava, many Garmin-originated activities re-sync into Strava, giving you that data through the Strava API you can actually get today.\n- **Accept `.fit` file uploads.** For one-off imports, let users upload Garmin `.fit` files (Garmin's open FIT SDK parses them) when live API access isn't available.\n- **Pick a self-serve ecosystem for launch.** Fitbit, Oura, and WHOOP are self-serve; compare Garmin against them in [Fitbit API vs Garmin API](/fitness-apis/fitbit-api-vs-garmin-api) before committing to the wait.\n\nDo **not** rely on unofficial or scraping Garmin Connect clients for production — Garmin has deployed TLS-fingerprinting that blocks third-party clients, and it violates their terms of service.\n\n## Still stuck? Quick triage\n\n- Loaded `developer.garmin.com/gc-developer-program/` and confirmed whether the request form exists right now? (This decides everything else.)\n- If the form is live: submitted it and set a realistic multi-week expectation for review?\n- If the form is gone: switched to an aggregator that supplies its **own** Garmin credentials (not one that asks you for keys you can't get)?\n- If you connected data but nothing arrives, the problem may be sync latency rather than access — see [wearable data delayed or missing](/fix/wearable-data-delayed).\n\nThe honest summary: \"I can't get Garmin access\" is frequently **not your fault** in 2026. Verify the live program status, apply if you can, bridge through an aggregator that holds its own Garmin partnership, and lean on HealthKit / Health Connect / Strava / FIT files in the meantime.",
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
    "answer": "The Google Fit API is deprecated: all Fit APIs, including the REST API, are supported only until the end of 2026, and no new developers have been able to sign up since May 1, 2024. There is no 1:1 replacement, so you must migrate based on how you used Fit. On-device reads move to Google Health Connect (plus the Recording API for steps), cloud, account, and OAuth reads move to the new Google Health API, and Wear OS moves to Health Services. Start now, because the end-of-2026 sunset is firm and new projects cannot onboard to Fit at all.",
    "body": "You hit a deprecation notice on the Google Fit API — and it is real: **all Google Fit APIs, including the REST API, are supported only until the end of 2026**, and no new developers can even sign up (that door closed May 1, 2024). There is no drop-in replacement, so the fix is not a config change — it is a migration, and which target you move to depends entirely on how you were using Fit. The short version: **on-device reads go to Health Connect, cloud/account and OAuth reads go to the new Google Health API, and Wear OS goes to Health Services.**\n\n## The deprecation, stated plainly\n\nThree facts you need to plan around:\n\n- **No new signups since May 1, 2024.** If you have an existing Fit project it keeps working for now, but you cannot onboard a *new* project to Fit at all. New apps must start on a successor.\n- **End of support is the end of 2026.** Every Fit API surface — the Android SDK, the REST API, and the BLE APIs — sunsets by the end of 2026. Treat that as a hard deadline, not a soft one.\n- **There is no 1:1 REST replacement.** Google's own guidance is blunt: there is no alternative that maps one-to-one onto the Fit REST API. You will re-architect, not swap a base URL.\n\nBecause the deadline is fixed and there is no shortcut, the urgent move is to identify your usage pattern and start the correct migration now.\n\n## Most likely \"which path is mine?\" — ranked by how apps actually use Fit\n\nFigure out your bucket first; the rest of the guide follows from it.\n\n1. **On-device reads on Android** — you read steps, calories, or aggregated activity from the phone using the Fit Recording API or the on-device Android SDK. This is the most common case for mobile apps. **Move to Health Connect** (plus the Recording API for steps).\n2. **Cloud / account reads over OAuth** — you call the Fit REST API server-to-server, or use the History API / Sessions API to pull a user's cross-device history through their Google account. **Move to the Google Health API.**\n3. **Fitbit Web API integrations** — separate product, same destination: the Fitbit cloud surface is folding into the **Google Health API**.\n4. **Wear OS** — you read sensors or activity on the watch itself. **Move to Health Services on Wear OS**, not Health Connect.\n\n## If you were using Google Fit for X, move to Y\n\n| If you used Google Fit for… | Migrate to | Notes |\n|---|---|---|\n| On-device reading of steps and aggregated activity (Recording API / on-device SDK) | **Google Health Connect** | Device-centric, on-device storage, one connection to the Android health ecosystem. See [the Health Connect integration guide](/integrate/google-health-connect). |\n| Fit **History API** / **Sessions API** (cloud, account, OAuth) | **Google Health API** | Web/account-centric successor for Fit's cloud surface. **(verify — still rolling out)** |\n| The **Fit REST API** (server-to-server) | **Google Health API** | No 1:1 REST mapping; expect to re-architect. **(verify)** |\n| **Fitbit Web API** integrations | **Google Health API** | The Fitbit cloud surface is consolidating into Google Health API. **(verify — timeline still rolling out)** |\n| Fit on **Wear OS** | **Health Services** on Wear OS | On-watch sensors and activity, not Health Connect. |\n| Battery-friendly step counts without a Google account or API scopes | **Recording API on mobile** | Provides step counts with no account and no OAuth scopes. |\n\nA hedge worth stating clearly: the **Google Health API is still rolling out** as of 2026 — its availability, scopes, and the exact Fitbit consolidation timeline are not final. Confirm the current status in Google's Health API and Fit migration docs before you commit an architecture to it.\n\n## How to migrate\n\n### Step 1 — Classify your usage as on-device or cloud/account\n\nBefore touching code, sort every Fit call you make into one of two buckets: **on-device** (steps and aggregates read from the phone, no server, no Google account round-trip) or **cloud/account** (server-to-server REST, OAuth, or cross-device history via the History/Sessions APIs). Wear OS code is a third, separate bucket. This single distinction determines your entire migration target, so do it first and do it per-feature — a single app can have features in more than one bucket.\n\n### Step 2 — Move on-device reads to Health Connect\n\nIf your usage is on-device, migrate to **Health Connect**: the device-centric successor that stores health data on-device under user control and gives you a single integration across the Android health ecosystem. Replace Fit's OAuth-and-scopes model with Health Connect's per-record-type on-device permissions, and complete the **Play Console health-data declaration** for the data types you read — it is a publishing gate. For plain step counts, the more battery-efficient **Recording API on mobile** returns steps without a Google account or API scopes. Walk the full setup in [the Health Connect integration guide](/integrate/google-health-connect), and if reads come back empty after you switch, see [Health Connect returns no data](/fix/health-connect-no-data).\n\n### Step 3 — Move cloud/account and Fitbit Web API reads to the Google Health API\n\nIf your usage is server-side, OAuth-based, or pulls cross-device history, the destination is the **Google Health API** — the account-centric successor to Fit's cloud APIs, and also the stated home for **Fitbit Web API** integrations. Do not expect the Fit REST endpoints to map across; there is no 1:1 replacement, so budget for a genuine re-architecture of your server integration. Because this API is still rolling out, treat scopes, endpoints, and availability as **subject to change — verify against the current Google Health API docs** before you build.\n\n### Step 4 — Move Wear OS code to Health Services\n\nIf you read sensors or activity on the watch, migrate that code to **Health Services on Wear OS** — not Health Connect. Health Services is the on-watch successor for the sensor and activity APIs Fit provided on Wear OS; keep it separate from your phone-side Health Connect work.\n\n### Step 5 — Finish before the end of 2026\n\nThe end-of-2026 sunset is firm and new projects cannot onboard to Fit at all, so schedule the cutover with margin rather than aiming for the deadline. Do the Health Connect Play Console declaration early (review takes time), keep any Fit and successor paths running in parallel during the transition so users are not cut off, and only remove Fit code once the replacement is verified in production.\n\n## Still stuck? Quick migration checklist\n\nRun these in order:\n\n1. List every Fit API you call and label each **on-device**, **cloud/account**, or **Wear OS**.\n2. On-device ⇒ [Health Connect](/integrate/google-health-connect) (plus Recording API for steps).\n3. Cloud/account or Fitbit Web API ⇒ **Google Health API** (verify current availability and scopes).\n4. Wear OS ⇒ **Health Services**.\n5. Submit the Play Console health-data declaration for your Health Connect data types.\n6. Confirm the successor works end-to-end in production, then decommission Fit before the end of 2026.\n\nDeciding between the Android and iOS sides of this while you re-architect? See [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect). And because the Google Health API is still rolling out, re-check Google's Fit migration guide before locking in any cloud design — the details are the volatile part of this plan.",
    "faqs": [
      {
        "q": "When exactly is the Google Fit API being shut down?",
        "a": "All Google Fit APIs, including the REST API, the Android SDK, and the BLE APIs, are supported only until the end of 2026. New signups have already been closed since May 1, 2024, so no new project can onboard to Fit. Treat the end of 2026 as a hard deadline and migrate well before it."
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
        "a": "The Fitbit cloud surface is folding into the Google Health API, which is the same destination as Fit's cloud APIs. As of 2026 the Google Health API and the Fitbit consolidation timeline are still rolling out, so verify current availability, scopes, and endpoints against Google's official docs before you build."
      },
      {
        "q": "What about Google Fit on Wear OS?",
        "a": "Fit's Wear OS sensor and activity APIs move to Health Services on Wear OS, not to Health Connect. Health Connect is the phone-side on-device store, while Health Services handles on-watch sensors and activity, so keep the two migrations separate."
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
        "text": "The end-of-2026 sunset is firm and new projects cannot onboard to Fit at all, so schedule the cutover with margin. Run Fit and its successor in parallel during the transition and only remove Fit code once the replacement is verified in production."
      }
    ]
  }
];
