/**
 * OAuth 2.0 facts per wearable vendor, for /tools/oauth-playground.
 *
 * Hand-written from the vendors' own pages, read on 2026-11-05: Google's
 * directly from this environment, every other host through
 * .github/workflows/source-snapshot.yml (runs 42082467625, 42083448613 and
 * 42082840471) because those hosts are blocked here. Every value carries the
 * verbatim sentence it rests on (`quote`) and the source it came from; the
 * same rows are in ops/sources/evidence/tools-oauth-playground.json, and
 * scripts/oauth-playground.test.mjs fails if the two drift apart.
 *
 * Rules this file keeps:
 *   - A value the vendor's page does not state is null, with `text` saying
 *     so. PKCE is "not documented" for five vendors because their pages do
 *     not mention it, not because they are known to reject it.
 *   - No request parameter is invented. Where a vendor documents the token
 *     exchange but not the refresh call (Withings, Suunto), `refresh.curl`
 *     is false and the page prints the reason instead of a guessed command.
 *   - The Google Health API's scope list is not copied here: the page joins
 *     it from src/data/googleHealthApi.ts (GHAPI_DOCUMENTED_SCOPES), which is
 *     generated from Google's Scopes page with its own evidence.
 *
 * No imports, so scripts/oauth-playground.test.mjs can load it under Node's
 * type stripping.
 */

export const OAUTH_FETCHED_ON = "2026-11-05";

export type OAuthSourceId =
  | "ouraAuth"
  | "ouraSpec"
  | "whoopOauth"
  | "whoopApi"
  | "stravaAuth"
  | "polar"
  | "withingsAuthUrl"
  | "withingsTokens"
  | "wahooApi"
  | "wahooPortal"
  | "dexcomAuth"
  | "suuntoStart"
  | "suuntoFaq"
  | "googleWebServer"
  | "googleHealthSetup";

export type OAuthSource = { url: string; label: string; fetched: string; via: "snapshot" | "direct" };

export const OAUTH_SOURCES: Record<OAuthSourceId, OAuthSource> = {
  ouraAuth: { url: "https://cloud.ouraring.com/docs/authentication", label: "Oura API documentation, “Authentication”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  ouraSpec: { url: "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json", label: "Oura API v2 OpenAPI document (1.43)", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  whoopOauth: { url: "https://developer.whoop.com/docs/developing/oauth/", label: "WHOOP Developer Platform, “OAuth 2.0”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  whoopApi: { url: "https://developer.whoop.com/api/", label: "WHOOP API reference, “Authentication”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  stravaAuth: { url: "https://developers.strava.com/docs/authentication/", label: "Strava Developers, “Authentication”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  polar: { url: "https://www.polar.com/accesslink-api/", label: "Polar AccessLink API v3, “Authentication”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  withingsAuthUrl: {
    url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/oauth-authorization-url/",
    label: "Withings developer guide, “Authorization URL”",
    fetched: OAUTH_FETCHED_ON,
    via: "snapshot",
  },
  withingsTokens: {
    url: "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/get-access/access-and-refresh-tokens-no-recover/",
    label: "Withings developer guide, “Access and refresh tokens”",
    fetched: OAUTH_FETCHED_ON,
    via: "snapshot",
  },
  wahooApi: { url: "https://cloud-api.wahooligan.com/", label: "Wahoo Cloud API documentation, “Authentication”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  wahooPortal: { url: "https://developers.wahooligan.com/cloud", label: "Wahoo developer portal, “Cloud API”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  dexcomAuth: { url: "https://developer.dexcom.com/docs/dexcom/authentication", label: "Dexcom Developer Portal, “Authentication”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  suuntoStart: { url: "https://apizone.suunto.com/how-to-start", label: "Suunto API Zone, “How to start”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  suuntoFaq: { url: "https://apizone.suunto.com/faq", label: "Suunto API Zone, “FAQ”", fetched: OAUTH_FETCHED_ON, via: "snapshot" },
  googleWebServer: {
    url: "https://developers.google.com/identity/protocols/oauth2/web-server",
    label: "Google Identity, “Using OAuth 2.0 for Web Server Applications”",
    fetched: OAUTH_FETCHED_ON,
    via: "direct",
  },
  googleHealthSetup: { url: "https://developers.google.com/health/setup", label: "Google Health API, “Set up Google Cloud and OAuth”", fetched: OAUTH_FETCHED_ON, via: "direct" },
};

/** One stated fact: what the page says (`text`), the sentence it rests on, where it is. */
export type Fact = { text: string; quote: string; source: OAuthSourceId };

export type OAuthScope = { scope: string; grants: string; quote: string; source: OAuthSourceId };

export type OAuthVendor = {
  id: string;
  name: string;
  /** The site's guide for this vendor. */
  guide: string;
  authorizeUrl: string;
  authorize: Fact;
  /** Other documented authorization addresses (mobile, universal link, sandbox). */
  altAuthorize: (Fact & { url: string })[];
  tokenUrl: string;
  token: Fact;
  /** Scopes with what each grants. Empty for Google (joined from googleHealthApi.ts) and Suunto (none listed). */
  scopes: OAuthScope[];
  /** How the scope parameter is joined. */
  scopeSeparator: " " | ",";
  scopeNote: Fact | null;
  /** Fixed scopes the vendor requires; added whatever the reader ticks. */
  requiredScopes?: string[];
  pkce: { status: "recommended" | "supported" | "not-documented"; methods: ("S256" | "plain")[]; text: string; quote: string | null; source: OAuthSourceId | null };
  /** Where the token request puts the client credentials. */
  clientAuth: "basic" | "body" | "basic-or-body" | "query";
  /** Shape of the token request. "query": parameters in the URL of a POST, as Wahoo documents. */
  tokenStyle: "form" | "query" | "withings";
  /** Extra authorize parameters the vendor documents and this tool sets. */
  extraAuthorizeParams?: Record<string, string>;
  /** Extra header the vendor asks for on its requests. */
  extraHeaders?: Record<string, string>;
  refresh: Fact & { curl: boolean; rotates: boolean | null };
  lifetime: Fact;
  /** Further documented rules (code lifetime, state length, revocation…). */
  notes: Fact[];
};

export const OAUTH_VENDORS: OAuthVendor[] = [
  {
    id: "oura",
    name: "Oura",
    guide: "/integrate/oura-api",
    authorizeUrl: "https://cloud.ouraring.com/oauth/authorize",
    authorize: { text: "Authorization URL.", quote: "Authorize: https://cloud.ouraring.com/oauth/authorize", source: "ouraAuth" },
    altAuthorize: [
      {
        url: "https://developer.ouraring.com/authorize",
        text: "Universal-link authorization URL for new OAuth clients; on a phone with the Oura app it can open the consent page in the app.",
        quote: "An alternative authorization URL is now provided at https://developer.ouraring.com/authorize for new OAuth clients.",
        source: "ouraAuth",
      },
    ],
    tokenUrl: "https://api.ouraring.com/oauth/token",
    token: { text: "Token URL.", quote: "Access Token URL: https://api.ouraring.com/oauth/token", source: "ouraAuth" },
    scopes: [
      { scope: "email", grants: "Email address of the user", quote: "email Email address of the user", source: "ouraAuth" },
      { scope: "personal", grants: "Personal information (gender, age, height, weight)", quote: "personal Personal information (gender, age, height, weight)", source: "ouraAuth" },
      { scope: "daily", grants: "Daily summaries of sleep, activity and readiness", quote: "daily Daily summaries of sleep, activity and readiness", source: "ouraAuth" },
      { scope: "heartrate", grants: "Time series heart rate for Gen 3 users", quote: "heartrate Time series heart rate for Gen 3 users", source: "ouraAuth" },
      { scope: "workout", grants: "Summaries for auto-detected and user entered workouts", quote: "workout Summaries for auto-detected and user entered workouts", source: "ouraAuth" },
      { scope: "tag", grants: "User entered tags", quote: "tag User entered tags", source: "ouraAuth" },
      { scope: "session", grants: "Guided and unguided sessions in the Oura app", quote: "session Guided and unguided sessions in the Oura app", source: "ouraAuth" },
      { scope: "spo2", grants: "Daily SpO2 Average recorded during sleep", quote: "spo2 Daily SpO2 Average recorded during sleep", source: "ouraAuth" },
      {
        scope: "heart_health",
        grants: "Heart health data (listed in the OpenAPI document, not on the Authentication page)",
        quote: "\"heart_health\": \"Heart health data\"",
        source: "ouraSpec",
      },
    ],
    scopeSeparator: " ",
    scopeNote: { text: "Space-separated. Left blank, the app requests every scope; the user can switch scopes off at consent.", quote: "If left blank, the application will request all available scopes.", source: "ouraAuth" },
    pkce: {
      status: "recommended",
      methods: ["S256"],
      text: "Recommended. code_challenge_method must be S256; the verifier is 43 to 128 characters, hashed with SHA-256 and base64url-encoded without padding.",
      quote: "between 43 and 128 characters long (inclusive), then hash it with SHA256 and encode the digest in base64url format without padding",
      source: "ouraAuth",
    },
    clientAuth: "basic-or-body",
    tokenStyle: "form",
    extraHeaders: { "User-Agent": "YourApp/1.0" },
    refresh: {
      text: "grant_type=refresh_token at the token URL returns a new access token and a new refresh token; each refresh token works once.",
      quote: "The refresh token is single-use, meaning it is invalidated after being used.",
      source: "ouraAuth",
      curl: true,
      rotates: true,
    },
    lifetime: {
      text: "Returned in expires_in. The page states no fixed number for the server-side flow; the client-side flow's token is currently 30 days and has no refresh token.",
      quote: "Once a token expires (currently set to 30 days), the user will need to re-authenticate your app.",
      source: "ouraAuth",
    },
    notes: [
      {
        text: "Client credentials go in the form body or as HTTP Basic (client_id as user name, client_secret as password).",
        quote: "Instead of providing client_id and client_secret as parameters, they can be given using the HTTP Basic Authorization, with client_id as username and client_secret as password.",
        source: "ouraAuth",
      },
      {
        text: "Every request to the Oura API needs a non-empty User-Agent header, so the commands below send one.",
        quote: "All requests to the Oura API must include a non-empty User-Agent header.",
        source: "ouraAuth",
      },
      { text: "Revoke a token with GET https://api.ouraring.com/oauth/revoke?access_token=….", quote: "https://api.ouraring.com/oauth/revoke?access_token={access_token}", source: "ouraAuth" },
    ],
  },
  {
    id: "whoop",
    name: "WHOOP",
    guide: "/integrate/whoop-api",
    authorizeUrl: "https://api.prod.whoop.com/oauth/oauth2/auth",
    authorize: {
      text: "Authorization URL (the API reference's authorizationCode flow).",
      quote: "Authorization URL: https://api.prod.whoop.com/oauth/oauth2/auth",
      source: "whoopApi",
    },
    altAuthorize: [],
    tokenUrl: "https://api.prod.whoop.com/oauth/oauth2/token",
    token: { text: "Token URL, also used for refresh.", quote: "Token URL: https://api.prod.whoop.com/oauth/oauth2/token", source: "whoopApi" },
    scopes: [
      { scope: "read:recovery", grants: "Recovery data, including score, heart rate variability, and resting heart rate", quote: "read:recovery - Read Recovery data, including score, heart rate variability, and resting heart rate.", source: "whoopApi" },
      { scope: "read:cycles", grants: "Cycles data, including day Strain and average heart rate during a physiological cycle", quote: "read:cycles - Read cycles data, including day Strain and average heart rate during a physiological cycle.", source: "whoopApi" },
      { scope: "read:workout", grants: "Workout data, including activity Strain and average heart rate", quote: "read:workout - Read workout data, including activity Strain and average heart rate.", source: "whoopApi" },
      { scope: "read:sleep", grants: "Sleep data, including performance % and duration per sleep stage", quote: "read:sleep - Read sleep data, including performance % and duration per sleep stage.", source: "whoopApi" },
      { scope: "read:profile", grants: "Profile data, including name and email", quote: "read:profile - Read profile data, including name and email.", source: "whoopApi" },
      { scope: "read:body_measurement", grants: "Body measurements data, including height, weight, and max heart rate", quote: "read:body_measurement - Read body measurements data, including height, weight, and max heart rate.", source: "whoopApi" },
      { scope: "offline", grants: "A refresh token; without it WHOOP issues none", quote: "You must request the offline scope to receive a refresh token.", source: "whoopOauth" },
    ],
    scopeSeparator: " ",
    scopeNote: {
      text: "The pages read here do not state the separator for the authorize request. WHOOP's sample token response lists granted scopes separated by spaces, so this tool joins them with spaces.",
      quote: "\"scope\" : \"offline other-scopes-requested\"",
      source: "whoopOauth",
    },
    pkce: { status: "not-documented", methods: [], text: "Not mentioned on the WHOOP OAuth page or API reference read here.", quote: null, source: null },
    clientAuth: "body",
    tokenStyle: "form",
    refresh: {
      text: "Using the refresh token invalidates the existing access tokens; the refresh token in the response replaces the old one, and of two simultaneous refreshes only the first succeeds.",
      quote: "Existing access tokens are invalidated once your app uses the refresh token to generate a new access token.",
      source: "whoopOauth",
      curl: true,
      rotates: true,
    },
    lifetime: { text: "Returned in expires_in, in seconds; WHOOP's sample refresh response shows 3600.", quote: "WHOOP provides the token expiry in the expires_in parameter", source: "whoopOauth" },
    notes: [
      { text: "If you generate state yourself it must be eight characters long; this tool generates eight.", quote: "The state parameter must be eight characters long if you need to generate it yourself.", source: "whoopOauth" },
      { text: "The redirect URL must be registered in the WHOOP Developer Dashboard.", quote: "You must register the Redirect URL in the WHOOP Developer Dashboard.", source: "whoopOauth" },
      { text: "WHOOP's sample refresh payload sends client_id, client_secret and scope offline in the body.", quote: "\"scope\" : \"offline\"", source: "whoopOauth" },
    ],
  },
  {
    id: "strava",
    name: "Strava",
    guide: "/integrate/strava-api",
    authorizeUrl: "https://www.strava.com/oauth/authorize",
    authorize: { text: "Authorization URL for web apps.", quote: "Redirect the user to GET https://www.strava.com/oauth/authorize", source: "stravaAuth" },
    altAuthorize: [
      {
        url: "https://www.strava.com/oauth/mobile/authorize",
        text: "Mobile apps (Android intent or iOS) use the mobile authorize endpoint; the Strava app opens if installed.",
        quote: "GET https://www.strava.com/oauth/mobile/authorize endpoint",
        source: "stravaAuth",
      },
    ],
    tokenUrl: "https://www.strava.com/oauth/token",
    token: {
      text: "Token URL, with the client ID and secret, for both the code exchange and refresh. (Strava's own curl samples post to https://www.strava.com/api/v3/oauth/token.)",
      quote: "The application must now call the POST https://www.strava.com/oauth/token with its client ID and client secret",
      source: "stravaAuth",
    },
    scopes: [
      { scope: "read", grants: "Public segments, public routes, public profile data, public posts, public events, club feeds, and leaderboards", quote: "read public segments, public routes, public profile data, public posts, public events, club feeds, and leaderboards", source: "stravaAuth" },
      { scope: "read_all", grants: "Private routes, private segments, and private events for the user", quote: "read private routes, private segments, and private events for the user", source: "stravaAuth" },
      { scope: "profile:read_all", grants: "All profile information, even if the user set profile visibility to Followers or Only You", quote: "read all profile information even if the user has set their profile visibility to Followers or Only You", source: "stravaAuth" },
      { scope: "profile:write", grants: "Update the user's weight and Functional Threshold Power (FTP), and star or unstar segments", quote: "update the user's weight and Functional Threshold Power (FTP), and access to star or unstar segments on their behalf", source: "stravaAuth" },
      { scope: "activity:read", grants: "Activities visible to Everyone and Followers, excluding privacy zone data; required for activity webhooks", quote: "read the user's activity data for activities that are visible to Everyone and Followers, excluding privacy zone data", source: "stravaAuth" },
      { scope: "activity:read_all", grants: "As activity:read, plus privacy zone data and Only You activities", quote: "plus privacy zone data and access to read the user's activities with visibility set to Only You", source: "stravaAuth" },
      { scope: "activity:write", grants: "Create manual activities and uploads, and edit activities visible to the app", quote: "access to create manual activities and uploads, and access to edit any activities that are visible to the app", source: "stravaAuth" },
    ],
    scopeSeparator: ",",
    scopeNote: { text: "Required. Comma- or space-delimited; this tool uses commas. The athlete can untick any requested scope, so check the scope the redirect returns.", quote: "Requested scopes, as a comma- or URL-safe space-delimited string", source: "stravaAuth" },
    pkce: { status: "not-documented", methods: [], text: "Not mentioned on Strava's Authentication page.", quote: null, source: null },
    clientAuth: "body",
    tokenStyle: "form",
    extraAuthorizeParams: { approval_prompt: "auto" },
    refresh: {
      text: "Refresh with grant_type=refresh_token. If the current access token expires in more than an hour, the same one comes back; once a new refresh token is returned the old one stops working.",
      quote: "Once a new refresh token is returned, the older refresh token is invalidated immediately.",
      source: "stravaAuth",
      curl: true,
      rotates: true,
    },
    lifetime: { text: "Six hours from creation.", quote: "Access tokens expire six hours after they are created", source: "stravaAuth" },
    notes: [
      { text: "The authorization code is short-lived and single-use.", quote: "code is short lived and can only be used once.", source: "stravaAuth" },
      { text: "approval_prompt is auto by default; force always shows the prompt.", quote: "use force to always show the authorization prompt even if the user has already authorized the current application, default is auto", source: "stravaAuth" },
      { text: "localhost and 127.0.0.1 are allowed as redirect hosts.", quote: "localhost and 127.0.0.1 are white-listed.", source: "stravaAuth" },
      { text: "Deauthorize with POST https://www.strava.com/oauth/revoke (HTTP Basic, the token in the body), the only supported endpoint from June 1, 2027.", quote: "This is the recommended method for deauthorization and will be the only endpoint supported for deauthorization effective June 1, 2027.", source: "stravaAuth" },
    ],
  },
  {
    id: "polar",
    name: "Polar AccessLink",
    guide: "/integrate/polar-api",
    authorizeUrl: "https://flow.polar.com/oauth2/authorization",
    authorize: { text: "Authorization endpoint in Polar Flow.", quote: "GET https://flow.polar.com/oauth2/authorization", source: "polar" },
    altAuthorize: [],
    tokenUrl: "https://polarremote.com/v2/oauth2/token",
    token: { text: "Token endpoint in Polar Remote, authenticated with HTTP Basic.", quote: "POST https://polarremote.com/v2/oauth2/token", source: "polar" },
    scopes: [{ scope: "accesslink.read_all", grants: "Access to the user's data", quote: "Accesslink uses accesslink.read_all -scope, which allows access to user's data.", source: "polar" }],
    scopeSeparator: " ",
    scopeNote: { text: "Optional: without it the user is asked to grant every scope linked to your client.", quote: "If not provided, user will be asked to grant authorization for all scopes linked to client.", source: "polar" },
    pkce: { status: "not-documented", methods: [], text: "Not mentioned on the AccessLink reference.", quote: null, source: null },
    clientAuth: "basic",
    tokenStyle: "form",
    extraHeaders: { Accept: "application/json;charset=UTF-8" },
    refresh: {
      text: "No refresh flow is documented: the token response lists no refresh_token, and the reference says access tokens do not expire unless revoked.",
      quote: "Access tokens will not expire unless explicitly revoked by partners or users.",
      source: "polar",
      curl: false,
      rotates: null,
    },
    lifetime: { text: "expires_in is in seconds; Polar's example, 31535999, is about one year.", quote: "the value \"31535999\" denotes that the access token will expire about one year from the time the response was generated", source: "polar" },
    notes: [
      { text: "The code expires in 10 minutes and must be used once; reuse is denied and deletes every issued token.", quote: "Authorization code that expires in 10 minutes. This code must only be used once.", source: "polar" },
      { text: "redirect_uri goes to the token endpoint only if it was sent to the authorization endpoint.", quote: "Must be specified if redirect_uri was passed to authorization endpoint", source: "polar" },
      { text: "After the exchange, register the user before reading their data.", quote: "Register user using register user endpoint to be able to access user's data", source: "polar" },
      { text: "The token request sends Content-Type application/x-www-form-urlencoded and Accept application/json;charset=UTF-8.", quote: "Accept = application/json;charset=UTF-8", source: "polar" },
    ],
  },
  {
    id: "withings",
    name: "Withings",
    guide: "/integrate/withings-api",
    authorizeUrl: "https://account.withings.com/oauth2_user/authorize2",
    authorize: { text: "Authorization URL.", quote: "https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=YOUR_CLIENT_ID", source: "withingsAuthUrl" },
    altAuthorize: [],
    tokenUrl: "https://wbsapi.withings.net/v2/oauth2",
    token: {
      text: "Token exchange: POST action=requesttoken to https://wbsapi.withings.net/v2/oauth2, with a nonce and a signature computed from your client secret (Withings' “Request Signature” page).",
      quote: "await axios.post(API_ENDPOINT + '/v2/oauth2', params);",
      source: "withingsTokens",
    },
    scopes: [
      { scope: "user.info", grants: "Account information, linked devices, goals, and device linking; also needed to list and subscribe to user-related notifications", quote: "Access user account information, linked devices, goals, and manage device linking.", source: "withingsAuthUrl" },
      { scope: "user.metrics", grants: "Health measurements, heart recordings, stethoscope data and goals; also needed for notification management", quote: "Get data related to user health measurements, heart recordings, stethoscope data, and user goals.", source: "withingsAuthUrl" },
      { scope: "user.activity", grants: "Physical activity and sleep; also needed for notification management", quote: "Get data related to user physical activity and sleep activities.", source: "withingsAuthUrl" },
      { scope: "user.sleepevents", grants: "Notifications for sleep events (bed in, bed out, inflate done)", quote: "Scope used to receive notifications when sleep events happen (bed in, bed out, inflate done).", source: "withingsAuthUrl" },
    ],
    scopeSeparator: ",",
    scopeNote: { text: "Comma-separated, as in Withings' example URL.", quote: "scope=user.info,user.metrics,user.activity", source: "withingsAuthUrl" },
    pkce: { status: "not-documented", methods: [], text: "Not mentioned on the Withings authorization or token pages.", quote: null, source: null },
    clientAuth: "body",
    tokenStyle: "withings",
    refresh: {
      text: "Withings says to call the same requesttoken service with the refresh token and always keep the new refresh token, but its snippet shows only the code exchange, so this tool prints no refresh command rather than guess its parameters.",
      quote: "To request a new access_token using the refresh_token, call the requesttoken webservice",
      source: "withingsTokens",
      curl: false,
      rotates: true,
    },
    lifetime: { text: "Access token 3 hours; refresh token 1 year; the old refresh token lasts 8 hours after a new one is issued, or until the new access token is used.", quote: "access_token : Expires after 3 hours", source: "withingsTokens" },
    notes: [
      { text: "The authorization code is valid for 30 seconds.", quote: "Please note that the authorization code is only valid for 30 seconds.", source: "withingsAuthUrl" },
      { text: "Refresh tokens rotate: replace the stored one every time.", quote: "Always replace the previous refresh_token with the new one.", source: "withingsTokens" },
      { text: "mode=demo on the authorization URL logs in a demo user for testing.", quote: "you can use the optional parameter mode with the value demo", source: "withingsAuthUrl" },
      { text: "The token request is signed: Withings' snippet adds a signature computed with the client secret.", quote: "params.signature = sign(params, CLIENT_SECRET);", source: "withingsTokens" },
    ],
  },
  {
    id: "wahoo",
    name: "Wahoo",
    guide: "/integrate/wahoo-api",
    authorizeUrl: "https://api.wahooligan.com/oauth/authorize",
    authorize: {
      text: "Authorization URL (base_url is api.wahooligan.com).",
      quote: "https://api.wahooligan.com/oauth/authorize?client_id=<client_id>&redirect_uri=<redirect-uri>&scope=<scopes>&response_type=code",
      source: "wahooApi",
    },
    altAuthorize: [],
    tokenUrl: "https://api.wahooligan.com/oauth/token",
    token: {
      text: "Token URL. Wahoo documents the parameters in the query string of the POST.",
      quote: "https://<base_url>/oauth/token?client_secret=<client_secret>&code=<code>&redirect_uri=<redirect_uri>&grant_type=authorization_code&client_id=<client_id>",
      source: "wahooApi",
    },
    scopes: [
      { scope: "email", grants: "Access your email address", quote: "Access your email address", source: "wahooApi" },
      { scope: "user_read", grants: "Access your user data; without it the API returns 403", quote: "If the user_read scope is not included the API will return a 403 response.", source: "wahooApi" },
      { scope: "user_write", grants: "Update your user data", quote: "Update your user data", source: "wahooApi" },
      { scope: "workouts_read", grants: "Access your workout history", quote: "Access your workout history", source: "wahooApi" },
      { scope: "workouts_write", grants: "Update your workout history", quote: "Update your workout history", source: "wahooApi" },
      { scope: "offline_data", grants: "Receive data even when the app is closed; needed for webhooks", quote: "Receive data even when the app is closed", source: "wahooApi" },
      { scope: "power_zones_read", grants: "Listed on Wahoo's developer portal, without a description", quote: "email user_read user_write power_zones_read power_zones_write workouts_read workouts_write", source: "wahooPortal" },
      { scope: "power_zones_write", grants: "Listed on Wahoo's developer portal, without a description", quote: "email user_read user_write power_zones_read power_zones_write workouts_read workouts_write", source: "wahooPortal" },
      { scope: "plans_read", grants: "Listed on Wahoo's developer portal, without a description", quote: "plans_read plans_write routes_read routes_write offline_data", source: "wahooPortal" },
      { scope: "plans_write", grants: "Listed on Wahoo's developer portal, without a description", quote: "plans_read plans_write routes_read routes_write offline_data", source: "wahooPortal" },
      { scope: "routes_read", grants: "Listed on Wahoo's developer portal, without a description", quote: "plans_read plans_write routes_read routes_write offline_data", source: "wahooPortal" },
      { scope: "routes_write", grants: "Listed on Wahoo's developer portal, without a description", quote: "plans_read plans_write routes_read routes_write offline_data", source: "wahooPortal" },
    ],
    scopeSeparator: " ",
    scopeNote: { text: "Space-separated, or set the app's scopes in the developer portal instead.", quote: "you can append the requested scopes as a space separated list of values", source: "wahooApi" },
    pkce: {
      status: "supported",
      methods: ["S256", "plain"],
      text: "Supported once the app's Confidential field is set to No; S256 or plain. With PKCE the token and refresh calls send code_verifier instead of client_secret.",
      quote: "The Wahoo API does allow users to use the PKCE flow for authorization.",
      source: "wahooApi",
    },
    clientAuth: "query",
    tokenStyle: "query",
    refresh: {
      text: "Refresh returns a new access and refresh token. The previous pair is revoked only when an API call uses the new access token, so refresh just before a request: apps are limited to 10 unrevoked tokens per user.",
      quote: "Access tokens should only be refreshed immediately prior to making an API request.",
      source: "wahooApi",
      curl: true,
      rotates: true,
    },
    lifetime: { text: "Two hours.", quote: "When the access_token expires after 2 hours you can use the refresh_token to get a new access_token and a new refresh_token.", source: "wahooApi" },
    notes: [
      { text: "From January 1, 2026, 10 unrevoked access tokens per user; unrevoked tokens are deleted 60 days after creation.", quote: "applications will be limited to 10 unrevoked access tokens per user", source: "wahooApi" },
      { text: "Old tokens are revoked once an API call is made with the refreshed token.", quote: "Once an API call is made with the refreshed access token the previous access token and refresh tokens will be revoked.", source: "wahooApi" },
    ],
  },
  {
    id: "dexcom",
    name: "Dexcom",
    guide: "/integrate/dexcom-api",
    authorizeUrl: "https://api.dexcom.com/v3/oauth2/login",
    authorize: {
      text: "Login URL for the US production environment; the sandbox replaces the base URL with https://sandbox-api.dexcom.com.",
      quote: "https://api.dexcom.com/v3/oauth2/login?client_id={{your_client_id}}&redirect_uri={{your_redirect_uri}}&response_type=code&scope=offline_access",
      source: "dexcomAuth",
    },
    altAuthorize: [
      {
        url: "https://sandbox-api.dexcom.com/v3/oauth2/login",
        text: "Sandbox login (no password; a drop-down of sandbox users).",
        quote: "When targeting the sandbox environment, the base URL above should be replaced with https://sandbox-api.dexcom.com",
        source: "dexcomAuth",
      },
    ],
    tokenUrl: "https://api.dexcom.com/v3/oauth2/token",
    token: { text: "Token URL (US production), form-encoded, for the exchange and refresh.", quote: "The Content-Type field in the header should be set to application/x-www-form-urlencoded", source: "dexcomAuth" },
    scopes: [],
    requiredScopes: ["offline_access"],
    scopeSeparator: " ",
    scopeNote: { text: "One scope only: offline_access, always sent.", quote: "currently, offline_access is the only acceptable input", source: "dexcomAuth" },
    pkce: { status: "not-documented", methods: [], text: "Not mentioned. Dexcom also requires tokens and the client secret to live on your server, not on a phone.", quote: null, source: null },
    clientAuth: "body",
    tokenStyle: "form",
    refresh: {
      text: "Each refresh token works once and is replaced by a new one; each lasts at most a year. A 400 on refresh means it is no longer valid: send the user through login again.",
      quote: "Each refresh_token can be used only once.",
      source: "dexcomAuth",
      curl: true,
      rotates: true,
    },
    lifetime: { text: "expires_in is in seconds; Dexcom's sample response shows 7200 (two hours).", quote: "The expires_in value is expressed in seconds.", source: "dexcomAuth" },
    notes: [
      { text: "The authorization code is single-use and expires after one minute.", quote: "Note that the authorization_code is single-use and expires after one minute.", source: "dexcomAuth" },
      { text: "Tokens and the client secret must be stored on your servers, never on the mobile device.", quote: "Dexcom requires that partners store tokens (e.g., client secret, access tokens) on their servers.", source: "dexcomAuth" },
      { text: "A refresh token is valid for at most one year.", quote: "Each refresh_token is valid for a maximum of one year.", source: "dexcomAuth" },
    ],
  },
  {
    id: "suunto",
    name: "Suunto",
    guide: "/integrate/suunto-api",
    authorizeUrl: "https://cloudapi-oauth.suunto.com/oauth/authorize",
    authorize: {
      text: "Authorization URL.",
      quote: "https://cloudapi-oauth.suunto.com/oauth/authorize?response_type=code&client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>",
      source: "suuntoStart",
    },
    altAuthorize: [],
    tokenUrl: "https://cloudapi-oauth.suunto.com/oauth/token",
    token: { text: "Token URL, with HTTP Basic client credentials.", quote: "curl -v https://cloudapi-oauth.suunto.com/oauth/token --user <CLIENT_ID>:<CLIENT_SECRET> -d grant_type=authorization_code", source: "suuntoStart" },
    scopes: [],
    scopeSeparator: " ",
    scopeNote: {
      text: "No scope list is published on the pages read here and Suunto's authorization URL carries no scope parameter; its sample token response shows the scope workout.",
      quote: "\"expires_in\": 86400, \"scope\": \"workout\"",
      source: "suuntoStart",
    },
    pkce: { status: "not-documented", methods: [], text: "Not mentioned on Suunto's quick-start or FAQ.", quote: null, source: null },
    clientAuth: "basic",
    tokenStyle: "form",
    refresh: {
      text: "The token response includes a refresh_token, but the pages read here document no refresh request, so this tool prints none.",
      quote: "\"refresh_token\": \"<JWT_REFRESH_TOKEN>\"",
      source: "suuntoStart",
      curl: false,
      rotates: null,
    },
    lifetime: { text: "Suunto's sample response shows expires_in 86400 (24 hours). The access token is a JWT whose user claim is the Suunto app user name.", quote: "\"expires_in\": 86400", source: "suuntoStart" },
    notes: [
      { text: "The token endpoint uses HTTP Basic: Base64(clientid:clientsecret).", quote: "The endpoint is protected using Basic authentication scheme in the following format:", source: "suuntoFaq" },
      { text: "OAuth requests need no subscription key; Cloud API data calls do (Ocp-Apim-Subscription-Key).", quote: "Ocp-Apim-Subscription-Key parameter is required for Cloud API requests but not for OAuth related requests.", source: "suuntoFaq" },
    ],
  },
  {
    id: "google-health",
    name: "Google Health API",
    guide: "/google-health-api",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    authorize: { text: "Google's OAuth 2.0 authorization endpoint (HTTPS only).", quote: "Google's OAuth 2.0 endpoint is at https://accounts.google.com/o/oauth2/v2/auth", source: "googleWebServer" },
    altAuthorize: [],
    tokenUrl: "https://oauth2.googleapis.com/token",
    token: { text: "Token URL, for the exchange and refresh.", quote: "To exchange an authorization code for an access token, call the https://oauth2.googleapis.com/token endpoint", source: "googleWebServer" },
    scopes: [],
    scopeSeparator: " ",
    scopeNote: {
      text: "Space-separated full scope URLs. The Google Health API's scopes are listed with Google's consent wording; add prompt=consent when you change them.",
      quote: "Modify the scope parameter in the authorization URL to include the updated list of space-separated scope values.",
      source: "googleHealthSetup",
    },
    pkce: { status: "not-documented", methods: [], text: "Not described on Google's web-server OAuth page, which this tool follows.", quote: null, source: null },
    clientAuth: "body",
    tokenStyle: "form",
    extraAuthorizeParams: { access_type: "offline", include_granted_scopes: "true" },
    refresh: {
      text: "access_type=offline gets a refresh token on the first exchange only. Refresh tokens last until revoked or expired, and Google caps how many it issues per client and user.",
      quote: "Refresh tokens are valid until the user revokes access or the refresh token expires.",
      source: "googleWebServer",
      curl: true,
      rotates: false,
    },
    lifetime: { text: "expires_in gives the remaining lifetime in seconds; Google's sample shows 3920.", quote: "The remaining lifetime of the access token in seconds.", source: "googleWebServer" },
    notes: [
      { text: "access_type=offline is what makes Google return a refresh token.", quote: "This value instructs the Google authorization server to return a refresh token and an access token the first time that your application exchanges an authorization code for tokens.", source: "googleWebServer" },
      { text: "Google limits refresh tokens per client/user pair and per user.", quote: "Note that there are limits on the number of refresh tokens that will be issued; one limit per client/user combination, and another per user across all clients.", source: "googleWebServer" },
      { text: "A new OAuth client is unverified and capped at 100 users, each added as a test user.", quote: "By default, newly created OAuth clients are in an unverified state with a cap of 100 users for both testing and production purposes.", source: "googleHealthSetup" },
    ],
  },
];

/**
 * Oura's worked PKCE example, from its Authentication page: the verifier and
 * the challenge Oura derived from it. The playground's S256 code is tested
 * against this pair (scripts/oauth-playground.test.mjs).
 */
export const OURA_PKCE_VECTOR = {
  verifier: "QUW2bsoMYITWSSPUgCDEc4CXCBfcVyu8TkujreHe8CXP4K4d4463gRztuxfo96YP",
  challenge: "43Kb1gELSIjkvwzrPtAg0Lz2HqCG3BtS_SUMAQhjv7c",
  quote: "code_challenge=43Kb1gELSIjkvwzrPtAg0Lz2HqCG3BtS_SUMAQhjv7c&code_challenge_method=S256",
  verifierQuote: "QUW2bsoMYITWSSPUgCDEc4CXCBfcVyu8TkujreHe8CXP4K4d4463gRztuxfo96YP",
  source: "ouraAuth" as OAuthSourceId,
};

/** Vendors left out, and why: no public page this tool could read states the flow. */
export const OAUTH_OMITTED: { name: string; reason: string; guide: string }[] = [
  {
    name: "Garmin",
    guide: "/integrate/garmin-api",
    reason: "Garmin's program FAQ says its APIs use OAuth 2.0, but no public page this tool could read states the authorization and token endpoints or the scopes.",
  },
  {
    name: "COROS",
    guide: "/integrate/coros-api",
    reason: "COROS's help center says it uses standard OAuth 2.0 and that partners apply by email; no public page this tool could read states the URLs or scopes.",
  },
  {
    name: "Fitbit Web API",
    guide: "/fitbit-api-shutdown",
    reason: "Google's setup page, read 2026-11-05, says the legacy Fitbit Web API and Fitbit OAuth endpoints are turned off on November 2, 2026. Their successor, the Google Health API, is listed above.",
  },
  {
    name: "Terra",
    guide: "/integrate/terra-api",
    reason: "Terra connects users through its own widget session (see the Terra guide). This tool covers vendors whose OAuth endpoints your app calls itself.",
  },
];
