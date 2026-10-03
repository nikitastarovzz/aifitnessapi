/**
 * Editorial joins for the generated error-code references
 * (src/data/errorCodes.ts). Hand-maintained — NOT generated.
 *
 * Each row says "this /fix page is about this code". A code is mapped only
 * when the fix page's subject is that code (its primaryQuery or its body
 * works through that case by name), never because a page merely mentions it
 * in passing. Checked against src/data/fix.entries.ts on 2026-10-03.
 *
 * Links render only for slugs in RELEASED_FIX at build time, so a row may name
 * a fix page that is still being written: it stays dark until the slug ships.
 */
import { RELEASED_FIX } from "./fix";

/** HKError.Code case → /fix slug. */
export const HK_ERROR_FIX_SLUGS: Record<string, string> = {
  // fix/healthkit-authorization-denied works through errorAuthorizationDenied
  // as the write-side denial ("the user hasn't given the app permission to
  // save data").
  errorAuthorizationDenied: "healthkit-authorization-denied",
  errorAuthorizationNotDetermined: "healthkit-authorization-not-determined",
  errorRequiredAuthorizationDenied: "healthkit-required-authorization-denied",
  errorDatabaseInaccessible: "healthkit-database-inaccessible",
  errorHealthDataUnavailable: "healthkit-health-data-unavailable",
  errorHealthDataRestricted: "healthkit-data-restricted-mdm",
  errorInvalidArgument: "healthkit-invalid-argument",
  errorNoData: "healthkit-error-no-data",
  errorNotPermissibleForGuestUserMode: "healthkit-guest-user-mode",
  // fix/healthkit-workout-session-errors covers all four session-ending cases.
  errorAnotherWorkoutSessionStarted: "healthkit-workout-session-errors",
  errorUserExitedWorkoutSession: "healthkit-workout-session-errors",
  errorBackgroundWorkoutSessionNotAllowed: "healthkit-workout-session-errors",
  errorWorkoutActivityNotAllowed: "healthkit-workout-session-errors",
  // fix/healthkit-undocumented-errors names these two in its table (the two
  // workout cases above are linked to their more specific page instead).
  unknownError: "healthkit-undocumented-errors",
  errorDataSizeExceeded: "healthkit-undocumented-errors",
  // errorUserCanceled and noError: no fix page is about them.
};

/** HealthConnectException constant → /fix slug. */
export const HC_ERROR_FIX_SLUGS: Record<string, string> = {
  // Both pages shipped 2026-10-03; each is about that constant by name.
  ERROR_SECURITY: "health-connect-securityexception",
  ERROR_RATE_LIMIT_EXCEEDED: "health-connect-rate-limit",
};

/** Jetpack HealthConnectClient exception (simple name) → /fix slug. */
export const HC_CLIENT_FIX_SLUGS: Record<string, string> = {
  SecurityException: "health-connect-securityexception",
};

/** "/fix/<slug>" when the table maps `key` to a released fix page, else null. */
export function fixHref(table: Record<string, string>, key: string): string | null {
  const slug = table[key];
  return slug && RELEASED_FIX.has(slug) ? `/fix/${slug}` : null;
}
