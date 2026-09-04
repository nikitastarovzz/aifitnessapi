import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CORRECTIONS, NEAR_MISSES } from "@/data/corrections";

/**
 * Public corrections log. The split matters: published corrections are the
 * site being wrong in front of readers; near-misses are the verification
 * system doing its job before publish. Conflating them in either direction
 * misstates the record.
 */

export const metadata: Metadata = {
  title: "Corrections",
  description:
    "Every published correction on this site, plus the errors the build gates caught before publish. Both lists are real and kept current.",
  alternates: { canonical: "/corrections" },
};

export default function CorrectionsPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Corrections", path: "/corrections" }]} />
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--fg)]">Corrections</h1>
      <p id="answer" className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
        {CORRECTIONS.length} published corrections to date, and {NEAR_MISSES.length} errors caught
        by the verification gates before they reached a reader. If you find an error we have not,{" "}
        <Link href="/about" className="font-medium text-brand-600 hover:text-brand-500">
          tell us
        </Link>{" "}
        — it will be logged here.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Published corrections</h2>
        <ul className="mt-4 space-y-4">
          {CORRECTIONS.map((c) => (
            <li key={c.date + c.page.href} className="rounded-2xl border border-[var(--border)] p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                <time dateTime={c.date}>{c.date}</time>
                <Link href={c.page.href} className="font-medium text-brand-600 hover:text-brand-500">
                  {c.page.label}
                </Link>
              </div>
              <p className="mt-2 text-sm text-[var(--fg)]">
                <strong>Was:</strong> {c.was}
              </p>
              <p className="mt-1 text-sm text-[var(--fg)]">
                <strong>Now:</strong> {c.now}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{c.how}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
          Caught before publish
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
          These never reached a reader. They are listed because a corrections page that only shows
          the misses that got through overstates how clean the process is — the gates exist because
          drafts are wrong all the time.
        </p>
        <ul className="mt-4 space-y-3">
          {NEAR_MISSES.map((n) => (
            <li key={n.date + n.what.slice(0, 20)} className="rounded-2xl border border-[var(--border)] p-4">
              <time dateTime={n.date} className="text-xs text-[var(--muted)]">
                {n.date}
              </time>
              <p className="mt-1 text-sm text-[var(--fg)]">{n.what}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Caught: {n.caught}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-[var(--muted)]">
        How verification works — the stamps, the gates, and what they refuse to ship — is documented
        in{" "}
        <Link href="/methodology" className="font-medium text-brand-600 hover:text-brand-500">
          methodology
        </Link>
        .
      </p>
    </Container>
  );
}
