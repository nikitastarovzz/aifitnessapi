import { NextResponse } from "next/server";
import { firestoreConfigured, createDoc } from "@/lib/firestore";

/**
 * Searches that found nothing. A miss is the most specific content request a
 * reader can make — they told us exactly what they came for, in their words,
 * and we did not have it. Storing the query (and only the query) turns the
 * search box into the editorial backlog.
 *
 * Nothing identifying is written: no IP, no user agent, no session. As with
 * /api/feedback, an unconfigured store is not an error worth showing anyone.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { q?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const q = typeof body.q === "string" ? body.q.trim().slice(0, 120) : "";
  if (q.length < 3) return NextResponse.json({ ok: true, stored: false });
  if (!firestoreConfigured()) return NextResponse.json({ ok: true, stored: false });
  try {
    await createDoc("search_misses", { q, createdAt: new Date() });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
