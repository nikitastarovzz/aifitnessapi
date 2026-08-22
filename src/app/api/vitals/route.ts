import { NextResponse } from "next/server";
import { firestoreConfigured, createDoc } from "@/lib/firestore";

/**
 * Field web-vitals collection: one sampled row per visit. Stores the path,
 * three numbers and a coarse connection type — no IP, no user agent, no
 * identifier of any kind, so there is nothing here to re-identify and nothing
 * that needs a consent banner.
 *
 * Values are range-checked before they are written: this endpoint is public,
 * and a metrics table that anyone can fill with arbitrary numbers is worse
 * than no metrics table.
 */
export const dynamic = "force-dynamic";

const num = (v: unknown, max: number): number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= max ? v : -1;

export async function POST(req: Request) {
  let body: { path?: string; lcp?: number; cls?: number; ttfb?: number; conn?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "";
  const lcp = num(body.lcp, 120_000);
  const cls = num(body.cls, 100);
  const ttfb = num(body.ttfb, 120_000);
  if (!path.startsWith("/") || lcp < 0 || cls < 0 || ttfb < 0) {
    return NextResponse.json({ error: "invalid metrics" }, { status: 400 });
  }
  if (!firestoreConfigured()) return NextResponse.json({ ok: true, stored: false });
  try {
    await createDoc("vitals", {
      path,
      lcp: String(Math.round(lcp)),
      cls: String(cls),
      ttfb: String(Math.round(ttfb)),
      conn: typeof body.conn === "string" ? body.conn.slice(0, 12) : "",
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
