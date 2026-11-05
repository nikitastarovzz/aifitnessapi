/**
 * health-connect-error-policy.mjs — decide what to do with a Health Connect
 * failure: retry later, ask the user, fix the code, or stop and report.
 *
 * WHAT THIS IMPLEMENTS
 *   Android's platform API reports failures as HealthConnectException error
 *   codes; the Jetpack HealthConnectClient throws ordinary exceptions. This
 *   file maps both to one of four actions, and keeps beside each mapping the
 *   sentence in Google's reference that justifies it:
 *     RETRY_LATER   Google says the call might succeed if repeated, or that
 *                   the caller should (or may) try again later
 *     ASK_USER      a permission is missing: only the user can fix that
 *     FIX_REQUEST   the caller sent something invalid; retrying sends it again
 *     REPORT        Google gives no recovery the caller can perform
 *   The mapping is this site's reading of those sentences, not a table
 *   Google publishes. Where the reference is silent (ERROR_UNKNOWN), the
 *   action is REPORT, the one that does not pretend to know.
 *
 *   One rule depends on the method. HealthConnectClient documents that
 *   deleting by invalid identifiers, and updating with invalid identifiers,
 *   "will result in IPC failure": so a RemoteException from deleteRecords,
 *   updateRecords or readRecord can be your bad id, not a transport hiccup,
 *   and it is not retried blindly.
 *
 *   `policyFor(error, { method })` accepts an error code name ("ERROR_IO"),
 *   its value (4), or a thrown error whose name is the exception class. It
 *   returns `{ action, retryable, reason, evidence }`.
 *
 * WHERE THE SENTENCES COME FROM
 *   https://aifitnessapi.com/error-codes/health-connect — the site's
 *   generated copy (src/data/errorCodes.ts) of Android's HealthConnectException
 *   reference and Jetpack's HealthConnectClient Throws tables, read
 *   2026-10-03. The test checks every sentence below against that file and
 *   fails if Google adds an error code this policy does not cover.
 *
 * No dependencies. Node 20+ (the policy table is plain data, so it ports to
 * Kotlin line for line).
 *
 * MIT — from aifitnessapi.com/cookbook
 */

export const ACTION = Object.freeze({
  RETRY_LATER: "retry-later",
  ASK_USER: "ask-user",
  FIX_REQUEST: "fix-request",
  REPORT: "report",
});

/** HealthConnectException codes (android.health.connect, API level 34+). */
export const CODE_POLICY = Object.freeze({
  ERROR_UNKNOWN: { value: 1, action: ACTION.REPORT, evidence: "An unknown error occurred while processing the call." },
  ERROR_INTERNAL: { value: 2, action: ACTION.REPORT, evidence: "An internal error occurred which the caller cannot address." },
  ERROR_INVALID_ARGUMENT: { value: 3, action: ACTION.FIX_REQUEST, evidence: "The caller supplied invalid arguments to the call." },
  ERROR_IO: { value: 4, action: ACTION.RETRY_LATER, evidence: "An issue occurred reading or writing to storage. The call might succeed if repeated." },
  ERROR_SECURITY: { value: 5, action: ACTION.ASK_USER, evidence: "The caller doesn't have the correct permissions for this call." },
  ERROR_REMOTE: { value: 6, action: ACTION.RETRY_LATER, evidence: "An IPC related error occurred." },
  ERROR_RATE_LIMIT_EXCEEDED: { value: 7, action: ACTION.RETRY_LATER, evidence: "Caller should try this api call again later." },
  ERROR_DATA_SYNC_IN_PROGRESS: { value: 8, action: ACTION.RETRY_LATER, evidence: "Caller may try this api call again later." },
  ERROR_UNSUPPORTED_OPERATION: { value: 9, action: ACTION.REPORT, evidence: "This operation is currently not supported by the platform." },
});

/** Jetpack HealthConnectClient exceptions, by simple class name. */
export const EXCEPTION_POLICY = Object.freeze({
  SecurityException: { action: ACTION.ASK_USER, evidence: "For requests with unpermitted access." },
  RemoteException: { action: ACTION.RETRY_LATER, evidence: "For any IPC transportation failures." },
  IOException: { action: ACTION.RETRY_LATER, evidence: "For any disk I/O issues." },
  IllegalArgumentException: { action: ACTION.FIX_REQUEST, evidence: "if the size of ids is too large or any ID is deemed as invalid." },
  IllegalStateException: { action: ACTION.REPORT, evidence: "If service is not available." },
  UnsupportedOperationException: { action: ACTION.REPORT, evidence: "if the feature is not available." },
});

/** Methods where Google says invalid identifiers surface as an IPC failure. */
export const ID_SENSITIVE_METHODS = Object.freeze({
  deleteRecords: "Deleting by invalid identifiers such as a non-existing identifier or deleting the same record multiple times will result in IPC failure.",
  updateRecords: "Update with invalid identifiers will result in IPC failure.",
  readRecord: "Update with invalid identifiers will result in IPC failure.",
});

const BY_VALUE = new Map(Object.entries(CODE_POLICY).map(([name, p]) => [p.value, name]));

function shape(kind, name, p, extra = {}) {
  return { kind, name, action: p.action, retryable: p.action === ACTION.RETRY_LATER, evidence: p.evidence, ...extra };
}

/**
 * @param {string|number|{ name?: string, errorCode?: number }} error
 * @param {{ method?: string }} [ctx]
 */
export function policyFor(error, { method } = {}) {
  if (typeof error === "number" || (error && typeof error.errorCode === "number")) {
    const value = typeof error === "number" ? error : error.errorCode;
    const name = BY_VALUE.get(value);
    if (!name) return { kind: "code", name: null, action: ACTION.REPORT, retryable: false, evidence: null, reason: `unknown HealthConnectException code ${value}` };
    return policyFor(name, { method });
  }
  const name = typeof error === "string" ? error : error?.name;
  if (name && CODE_POLICY[name]) return shape("code", name, CODE_POLICY[name]);
  const simple = name?.split(".").pop();
  if (simple && EXCEPTION_POLICY[simple]) {
    const p = EXCEPTION_POLICY[simple];
    if (simple === "RemoteException" && method && ID_SENSITIVE_METHODS[method]) {
      return shape("exception", simple, { action: ACTION.FIX_REQUEST, evidence: ID_SENSITIVE_METHODS[method] }, { reason: `${method} reports invalid ids as an IPC failure: check the ids before retrying` });
    }
    return shape("exception", simple, p);
  }
  return { kind: "unknown", name: name ?? null, action: ACTION.REPORT, retryable: false, evidence: null, reason: "not a Health Connect error this policy knows" };
}

/**
 * Run `fn`, retrying only what the policy calls retryable, with capped
 * exponential backoff. Everything else is rethrown with `.policy` attached so
 * the caller can route ASK_USER to a permission screen.
 */
export async function withHealthConnectPolicy(fn, { method, attempts = 4, baseMs = 1000, maxMs = 60_000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const policy = policyFor(err, { method });
      if (!policy.retryable || attempt + 1 >= attempts) {
        if (err && typeof err === "object") err.policy = policy;
        throw err;
      }
      await sleep(Math.min(maxMs, baseMs * 2 ** attempt));
    }
  }
}
