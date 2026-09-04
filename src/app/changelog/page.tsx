import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";

/**
 * The site's own changelog, generated from ops/content-log.jsonl — the same
 * append-only log the daily-content routine dedups against. Nothing here is
 * written for the page; the page is a view over the operational record, which
 * is the point: a changelog maintained separately from the work drifts, and
 * one generated from the work cannot.
 */

type LogLine = {
  date: string;
  action?: string;
  kind?: string;
  cluster?: string;
  path?: string;
  slug?: string;
  signal?: string;
  summary?: string;
  notes?: string;
  by?: string;
};

function readLog(): LogLine[] {
  const p = path.join(process.cwd(), "ops", "content-log.jsonl");
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l) as LogLine;
      } catch {
        return null;
      }
    })
    .filter((l): l is LogLine => l !== null)
    .reverse();
}

export const metadata: Metadata = {
  title: "Site Changelog",
  description:
    "Every content change on this site, straight from the operational log it is generated from: what shipped, when, and what prompted it.",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  const lines = readLog();
  const byMonth = new Map<string, LogLine[]>();
  for (const l of lines) {
    const m = l.date?.slice(0, 7) ?? "unknown";
    (byMonth.get(m) ?? byMonth.set(m, []).get(m)!).push(l);
  }

  return (
    <Container className="py-14">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Changelog", path: "/changelog" }]} />
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--fg)]">Site changelog</h1>
      <p id="answer" className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
        {lines.length} logged changes, rendered from the append-only operational log this
        site&rsquo;s daily routine writes to. Not curated for appearance — this is the record.
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Log lines below sometimes name KinesteX, the AI motion SDK that funds this site — the log
        records that relationship the same way the affected pages disclose it.
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        For changes in the <em>ecosystem</em> rather than on this site, see{" "}
        <Link href="/changes" className="font-medium text-brand-600 hover:text-brand-500">
          API changes &amp; deadlines
        </Link>
        . For how entries get verified, see{" "}
        <Link href="/methodology" className="font-medium text-brand-600 hover:text-brand-500">
          methodology
        </Link>
        .
      </p>

      {[...byMonth.entries()].map(([month, items]) => (
        <section key={month} className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{month}</h2>
          <ul className="mt-4 space-y-4">
            {items.map((l, i) => (
              <li key={i} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <time dateTime={l.date}>{l.date}</time>
                  {(l.action ?? l.kind) && (
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5">
                      {l.action ?? l.kind}
                    </span>
                  )}
                  {(l.cluster ?? l.path) && <span className="font-mono">{l.cluster ?? l.path}</span>}
                </div>
                {l.slug && <p className="mt-1 break-words font-medium text-[var(--fg)]">{l.slug}</p>}
                <p className="mt-1 text-sm text-[var(--muted)]">{l.summary ?? l.signal}</p>
                {l.notes && <p className="mt-1 text-sm text-[var(--muted)]">{l.notes}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
