import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import SignupForm from "@/components/SignupForm";
import { digests, monthLabel } from "@/data/digest";

/**
 * The newsletter's landing page — indexable, unlike /signup (a bare form with
 * nothing to rank for). The pitch is verifiable rather than aspirational:
 * the digest archive IS the sample issue, so a reader can see exactly what
 * they would get before handing over an address. No subscriber counts, no
 * "join thousands" — numbers this site cannot source do not appear on it.
 */

export const metadata: Metadata = {
  title: "The AIFitnessAPI Newsletter",
  description:
    "What changed in fitness and health APIs, verified before it is sent: deprecations with dates, new platform data types, and what got re-checked.",
  alternates: { canonical: "/newsletter" },
  openGraph: { images: ["/opengraph-image"] },
};

export default function NewsletterPage() {
  const issues = digests();
  return (
    <Container className="py-14">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Newsletter", path: "/newsletter" }]} />
      <div className="mx-auto max-w-2xl">
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--fg)]">
          The ecosystem moves. The newsletter is the diff.
        </h1>
        <p id="answer" className="mt-4 text-lg text-[var(--muted)]">
          One email when it matters: dated deprecations before they bite, new platform data types
          when they land, and which reference pages were re-verified. Assembled from the same
          tracked data as the site — if we could not verify it, it is not in your inbox either.
        </p>

        <div className="mt-8">
          <SignupForm source="newsletter-page" />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Read it before you subscribe
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Every issue is published openly. The archive is the sample.
          </p>
          <ul className="mt-4 space-y-2">
            {issues.map((d) => (
              <li key={d.month}>
                <Link
                  href={`/digest/${d.month}`}
                  className="font-medium text-brand-600 hover:text-brand-500"
                >
                  {monthLabel(d.month)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">The terms, plainly</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>No schedule theatre: it goes out when there is something verified to say.</li>
            <li>Unsubscribe is one click and actually works.</li>
            <li>
              Prefer feeds? Everything in the email is also in{" "}
              <Link href="/changes" className="font-medium text-brand-600 hover:text-brand-500">
                the changes tracker
              </Link>
              , its{" "}
              <Link href="/alerts" className="font-medium text-brand-600 hover:text-brand-500">
                per-API alerts
              </Link>{" "}
              and the{" "}
              <Link href="/digest" className="font-medium text-brand-600 hover:text-brand-500">
                digest archive
              </Link>
              .
            </li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
