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

export async function GET() {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json(cache.body, { headers: { "cache-control": "no-store" } });
  }

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

  // 503 when submissions would not be stored, so a probe can just read the
  // status code.
  return NextResponse.json(body, {
    status: configured && reachable ? 200 : 503,
    headers: { "cache-control": "no-store" },
  });
}
