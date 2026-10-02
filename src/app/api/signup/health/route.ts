import { NextResponse } from "next/server";
import { firestoreConfigured, getSignup, emailDocId } from "@/lib/firestore";
import { emailConfigured } from "@/lib/email";

/**
 * Signup storage health. Answers one question a human cannot answer by
 * looking at the site: are submissions actually being stored?
 *
 * A signup form is the only part of this site that can fail invisibly. The
 * page renders, the button works, the success screen appears — and if the
 * storage credentials are missing or wrong in production, the API returns 503
 * and the lead is gone. Nothing else notices. This endpoint is what the
 * uptime workflow probes so that failure is loud.
 *
 * It checks credentials by USING them: a read of a sentinel document that is
 * never written. A 404 from Firestore means the service-account JWT was
 * accepted and the project exists, which is the thing worth knowing — env
 * vars can be present and still be the wrong project or a malformed key.
 *
 * Discloses no secrets and no data: booleans and a status string only, never
 * a lead count, an email, or any part of a credential.
 */
// Rendered per request, never at build time — a prerendered answer would
// report the build machine's credentials, not production's. Caching is the
// CDN's job, driven by the Cache-Control on the response: Next passes a route
// handler's own header through untouched when the route is not ISR, so no
// `revalidate` here (that would make it ISR and cache a 503 as readily as a
// 200).
export const dynamic = "force-dynamic";

type Health = {
  storage: "firestore" | "none";
  storageReachable: boolean;
  email: boolean;
  detail: string;
  checkedAt: string;
};

// The probe runs on a schedule and the endpoint is public, so cache the
// round-trip briefly rather than letting anyone drive token exchanges.
let cache: { at: number; body: Health } | null = null;
const TTL_MS = 60_000;

// A healthy answer is shared at the edge for five minutes: a cold instance
// signs an RS256 JWT, exchanges it with Google OAuth and reads Firestore, and
// the uptime workflow calls this on every run. Failure is never cached
// outside this instance — the next request after a fix must see the fix, and
// a 503 must reach the probe on the run that hits it, not five minutes later.
const HEALTHY_CACHE = "public, s-maxage=300, stale-while-revalidate=60";

// 503 when submissions would not be stored, so a probe can just read the
// status code. Derived from the body on every path, including the in-memory
// cache: the cached path used to answer without a status, so for a minute
// after a failed check every caller on that instance got the failure body
// with a 200 — exactly what a probe that reads the status on a second call
// would wave through.
function respond(body: Health) {
  const healthy = body.storage === "firestore" && body.storageReachable;
  return NextResponse.json(body, {
    status: healthy ? 200 : 503,
    headers: { "cache-control": healthy ? HEALTHY_CACHE : "no-store" },
  });
}

export async function GET() {
  if (cache && Date.now() - cache.at < TTL_MS) return respond(cache.body);

  const configured = firestoreConfigured();
  let reachable = false;
  let detail: string;

  if (!configured) {
    detail =
      "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are not all set. Signups return 503 in production.";
  } else {
    try {
      // Never written by the signup route: emailDocId hashes an address, and
      // this one is not a valid address, so a hit is impossible.
      await getSignup(emailDocId("__healthcheck__@invalid"));
      reachable = true;
      detail = "Service account authenticated and the signups collection is readable.";
    } catch (err) {
      detail = `Credentials present but Firestore rejected them: ${
        err instanceof Error ? err.message : String(err)
      }`;
    }
  }

  const body: Health = {
    storage: configured ? "firestore" : "none",
    storageReachable: reachable,
    email: emailConfigured(),
    detail,
    checkedAt: new Date().toISOString(),
  };
  cache = { at: Date.now(), body };
  return respond(body);
}
