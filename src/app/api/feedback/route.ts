import { NextResponse } from "next/server";
import { firestoreConfigured, createDoc } from "@/lib/firestore";

/**
 * Page feedback: one append-only row per vote. Anonymous by construction —
 * we store the path, the verdict, an optional note and a timestamp, and
 * nothing that identifies who sent it.
 *
 * Unlike /api/signup, an unconfigured store here is not an error the reader
 * should see: losing a thumbs-up costs nothing, and a red banner on 240 pages
 * because a credential is missing costs a lot. The response says whether it
 * was stored so the health probe can tell the difference.
 */
export const dynamic = "force-dynamic";

const VERDICTS = new Set(["up", "down"]);

export async function POST(req: Request) {
  let body: { path?: string; verdict?: string; note?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "";
  const verdict = typeof body.verdict === "string" ? body.verdict : "";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 300) : "";

  if (!path.startsWith("/") || !VERDICTS.has(verdict)) {
    return NextResponse.json({ error: "invalid feedback" }, { status: 400 });
  }
  if (!firestoreConfigured()) {
    return NextResponse.json({ ok: true, stored: false });
  }
  try {
    await createDoc("feedback", {
      path,
      verdict,
      ...(note ? { note } : {}),
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ ok: true, stored: false }, { status: 200 });
  }
}
