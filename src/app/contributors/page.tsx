import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CORRECTIONS } from "@/data/corrections";
import { CONTRIBUTORS_PATH, CREDIT_LINE, TEMPLATE_URL, contributorsFrom, correctionIssueUrl } from "@/lib/correctionReport.mjs";

/**
 * /contributors — ops/VIRAL-20-2026-11-06.md item 17. The people whose
 * correction issues changed a page, credited only where their issue asked for
 * it (src/lib/correctionReport.mjs). Built from src/data/corrections.ts
 * alone: a correction without `reportedBy` credits nobody, and no name comes
 * from anywhere but the reporter's own answer. While nobody is credited the
 * page says so, stays out of the sitemap and is noindex, follow: an empty
 * wall is honest, but it is not a page worth asking a search engine to index.
 */

const CONTRIBUTORS = contributorsFrom(CORRECTIONS);
const TITLE = "Contributors: Readers Credited for Corrections";
const DESCRIPTION =
  "Readers whose correction reports changed a page on this site, credited by name when they asked, with the page and the issue. How to report a stale fact.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: CONTRIBUTORS_PATH },
  ...(CONTRIBUTORS.length === 0 ? { robots: { index: false, follow: true } } : {}),
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: CONTRIBUTORS_PATH, images: ["/opengraph-image"] },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const btn =
  "inline-block rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400";

export default function ContributorsPage() {
  const reportUrl = correctionIssueUrl({ path: "", title: "", origin: "" });
  const credited = CORRECTIONS.filter((c) => c.reportedBy).length;

  return (
    <Container className="py-14">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Contributors", path: CONTRIBUTORS_PATH }]} />
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--fg)]">Contributors</h1>
      <p id="answer" className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
        {CONTRIBUTORS.length === 0
          ? `Nobody is listed yet: none of the ${CORRECTIONS.length} published corrections so far names a reader who reported it, so there is no one to credit. When a stale or wrong fact you report changes a page, and your report asks for credit, your name goes here with the page it fixed and a link to your issue.`
          : `${CONTRIBUTORS.length} ${CONTRIBUTORS.length === 1 ? "reader has" : "readers have"} reported a stale or wrong fact that changed a page here (${credited} of the ${CORRECTIONS.length} published corrections), and asked to be credited.`}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a className={btn} href={reportUrl} target="_blank" rel="noreferrer" data-report-stale-fact>
          Report a stale fact
        </a>
        <Link className={btn} href="/corrections">
          The corrections log
        </Link>
      </div>

      {CONTRIBUTORS.length > 0 ? (
        <section className="mt-10" aria-labelledby="credited">
          <h2 id="credited" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Credited
          </h2>
          <ul className="mt-4 space-y-4">
            {CONTRIBUTORS.map((p) => (
              <li key={p.name} className="rounded-2xl border border-[var(--border)] p-5" data-contributor={p.name}>
                <p className="text-base font-semibold text-[var(--fg)]">
                  {p.url ? (
                    <a href={p.url} rel="noopener nofollow" className={linkCls}>
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {p.corrections.map((c) => (
                    <li key={`${c.date}-${c.page.href}`}>
                      <time dateTime={c.date}>{c.date}</time>:{" "}
                      <Link href={c.page.href} className={linkCls}>
                        {c.page.label}
                      </Link>{" "}
                      (
                      <a href={c.issue} rel="noopener" className={linkCls}>
                        the report
                      </a>
                      )
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How credit works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
          <li>
            Use &ldquo;Suggest a correction&rdquo; at the bottom of any page, or{" "}
            <a href={TEMPLATE_URL} target="_blank" rel="noreferrer" className={linkCls}>
              the correction issue template
            </a>
            . Both open a public GitHub issue with the same questions: the page, what is wrong, and a source that shows it.
          </li>
          <li>
            The last line reads &ldquo;{CREDIT_LINE}:&rdquo;. Write the name or GitHub handle you want shown, or &ldquo;no&rdquo;. A blank answer
            means no credit.
          </li>
          <li>
            A fix is made only against a primary source, re-read in the session that makes it, and logged on{" "}
            <Link href="/corrections" className={linkCls}>
              the corrections page
            </Link>
            .
          </li>
          <li>When your report changes a page and you asked for credit, the correction names you and links your issue, and you appear here.</li>
        </ol>
        <p className="mt-4 text-sm text-[var(--muted)]">
          How facts are checked in the first place is on{" "}
          <Link href="/methodology" className={linkCls}>
            how we verify
          </Link>
          , and what the build refuses to ship is on{" "}
          <Link href="/gates" className={linkCls}>
            the gates
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
