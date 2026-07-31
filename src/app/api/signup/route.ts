import { NextResponse } from "next/server";
import { appendFile } from "node:fs/promises";
import {
  firestoreConfigured,
  emailDocId,
  getSignup,
  putSignup,
} from "@/lib/firestore";

/**
 * Signup collection endpoint. One document per email (hash as doc ID), so a
 * repeat submission is an update, not a duplicate — createdAt is preserved
 * and interests are merged. The same idempotency-by-natural-key shape our
 * /architecture pages tell readers to build.
 *
 * Spam posture: honeypot field + minimum-fill-time check + server-side
 * validation. No client-side Firestore, so there is nothing to abuse without
 * getting past this route.
 *
 * Without Firebase env vars: production returns 503 (visible, not silent);
 * anywhere else (or SIGNUPS_DEV_FALLBACK=1) appends to .dev-signups.jsonl so
 * the form is testable before credentials exist.
 */

export const dynamic = "force-dynamic";

const INTERESTS = new Set([
  "motion-tracking",
  "wearable-data",
  "ai-coaching",
  "compliance",
  "choosing-an-api",
  "building-an-app",
  "pricing",
]);
const FIELDS_OF_WORK = new Set([
  "engineering",
  "product",
  "founder-exec",
  "design",
  "data-ml",
  "fitness-professional",
  "healthcare",
  "marketing",
  "student",
  "other",
]);

const MAX = 200; // per-field length cap
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Body = {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  city?: string;
  fieldOfWork?: string;
  position?: string;
  interests?: string[];
  interestNote?: string;
  source?: string;
  // spam guards
  website?: string; // honeypot — humans never see it
  startedAt?: number; // ms timestamp when the form rendered
};

const clean = (s: unknown): string =>
  typeof s === "string" ? s.trim().slice(0, MAX) : "";

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  // Honeypot filled or form submitted implausibly fast → pretend success.
  // Telling a bot it was caught just trains it.
  const tooFast =
    typeof body.startedAt === "number" && Date.now() - body.startedAt < 3000;
  if (clean(body.website) !== "" || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const email = clean(body.email).toLowerCase();
  const firstName = clean(body.firstName);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }
  if (!firstName) {
    return NextResponse.json({ error: "first name required" }, { status: 400 });
  }

  const interests = Array.isArray(body.interests)
    ? body.interests.filter((i) => INTERESTS.has(i)).slice(0, INTERESTS.size)
    : [];
  const fieldOfWork = FIELDS_OF_WORK.has(clean(body.fieldOfWork))
    ? clean(body.fieldOfWork)
    : "";

  const now = new Date();
  const record = {
    email,
    firstName,
    lastName: clean(body.lastName),
    country: clean(body.country),
    city: clean(body.city),
    fieldOfWork,
    position: clean(body.position),
    interests,
    interestNote: clean(body.interestNote),
    source: clean(body.source) || "unknown",
    updatedAt: now,
    createdAt: now,
  };

  try {
    if (firestoreConfigured()) {
      const id = emailDocId(email);
      const existing = await getSignup(id);
      if (existing) {
        // Preserve first-signup time; union interests across submissions.
        if (typeof existing.createdAt === "string") {
          record.createdAt = new Date(existing.createdAt);
        }
        const prev = Array.isArray(existing.interests) ? existing.interests : [];
        record.interests = [...new Set([...prev, ...interests])];
        // A resubmission that omits a field must not erase what the person
        // told us before — empty incoming loses to non-empty existing.
        for (const k of [
          "lastName", "country", "city", "fieldOfWork", "position",
          "interestNote",
        ] as const) {
          const prior = existing[k];
          if (record[k] === "" && typeof prior === "string" && prior !== "") {
            record[k] = prior;
          }
        }
      }
      await putSignup(id, record);
      return NextResponse.json({ ok: true });
    }

    if (
      process.env.NODE_ENV !== "production" ||
      process.env.SIGNUPS_DEV_FALLBACK === "1"
    ) {
      await appendFile(
        ".dev-signups.jsonl",
        JSON.stringify({ ...record, _devFallback: true }) + "\n",
      );
      return NextResponse.json({ ok: true, devFallback: true });
    }

    // Configured for neither Firestore nor fallback: fail loudly. A signup
    // form that silently drops submissions is the worst version of this.
    return NextResponse.json(
      { error: "signup storage not configured" },
      { status: 503 },
    );
  } catch (err) {
    console.error("signup write failed:", err);
    return NextResponse.json({ error: "storage error" }, { status: 502 });
  }
}
