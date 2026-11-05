import { fixEntries } from "@/data/fix.entries";
import { RELEASED_FIX } from "@/data/fix";

/**
 * Authored keyword -> troubleshooting page map.
 *
 * Phrases only, in the words that actually appear in an error string, a
 * status line, or a provider's error body. A slug missing from fixEntries or
 * not yet released is dropped rather than linked into a 404.
 */
export const FIX_KEYWORDS: Record<string, string[]> = {
  "fitness-api-401-unauthorized": [
    "401",
    "unauthorized",
    "invalid_token",
    "www-authenticate",
    "bearer",
    "expired token",
    "access token expired",
  ],
  "fitbit-error-code-401": ["fitbit", "expired_token", "errortype"],
  "fitbit-api-410-gone": ["410", "410 gone", "http 410"],
  "strava-api-401-unauthorized": ["strava", "authorization error", "access_token"],
  "oauth-redirect-uri-mismatch": [
    "redirect_uri",
    "redirect uri mismatch",
    "invalid redirect",
    "callback url mismatch",
    "redirect_uri_mismatch",
  ],
  "refresh-token-not-working": [
    "refresh token",
    "refresh_token",
    "invalid_grant",
    "token rotation",
    "grant_type",
  ],
  "fitbit-api-429-rate-limit": [
    "429",
    "rate limit",
    "too many requests",
    "quota exceeded",
    "retry-after",
  ],
  "healthkit-no-data": [
    "errornodata",
    "no data",
    "empty result",
    "hkstatisticsquery",
    "hksamplequery",
    "returns nothing",
  ],
  "health-connect-no-data": ["health connect", "healthconnectclient", "readrecords"],
  "strava-webhook-not-firing": [
    "webhook",
    "not firing",
    "subscription",
    "hub.challenge",
    "callback not firing",
    "push subscription",
  ],
  "wearable-data-delayed": ["delayed", "stale data", "out of date", "sync lag", "not syncing"],
  "garmin-api-approval": ["garmin", "partner program", "access approval", "api approval"],
  "google-fit-api-deprecated": ["google fit", "fitness api deprecated", "sunset", "shutting down"],
  "oura-personal-access-token-deprecated": ["oura", "personal access token"],
  "healthkit-authorization-denied": [
    "errorauthorizationdenied",
    "errorauthorizationnotdetermined",
    "errorrequiredauthorizationdenied",
    "authorization denied",
    "not determined",
    "requestauthorization",
    "com.apple.healthkit",
  ],
  "healthkit-background-delivery-not-working": [
    "background delivery",
    "hkobserverquery",
    "observer query",
    "enablebackgrounddelivery",
    "never fires",
  ],
};

/** The released troubleshooting guides the diagnoser indexes, in fixEntries
 *  order. Shared by the page and its markdown mirror, which states the count. */
export function diagnoserFixEntries() {
  return fixEntries.filter((e) => RELEASED_FIX.has(e.slug) && FIX_KEYWORDS[e.slug]);
}
