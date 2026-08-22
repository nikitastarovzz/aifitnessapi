import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import PageActions from "@/components/PageActions";
import Newsletter from "@/components/Newsletter";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { clampDescription } from "@/lib/cluster";
import { digests, getDigest, digestSummary, DIGEST_PATH } from "@/data/digest";

export const dynamicParams = false;

type Params = { month: string };

export function generateStaticParams(): Params[] {
  return digests().map((d) => ({ month: d.month }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { month } = await params;
  const d = getDigest(month);
  if (!d) return {};
  const title = `Fitness API digest — ${d.label}`;
  const description = clampDescription(digestSummary(d));
  const canonical = `${DIGEST_PATH}/${d.month}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { type: "article", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DigestIssue({ params }: { params: Promise<Params> }) {
  const { month } = await params;
  const d = getDigest(month);
  if (!d) notFound();

  const path = `${DIGEST_PATH}/${d.month}`;
  const url = absoluteUrl(path);
  const all = digests();
  const i = all.findIndex((x) => x.month === d.month);
  const newer = all[i - 1];
  const older = all[i + 1];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `Fitness API digest — ${d.label}`,
        description: digestSummary(d),
        datePublished: `${d.month}-01`,
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        url,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
    ],
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <link rel="alternate" type="text/markdown" href={`${url}/digest.md`} />
      <article className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Digest", path: DIGEST_PATH },
            { name: d.label, path },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          {d.label}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          The digest, generated from the record — not written from memory
        </p>

        <AnswerCapsule>{digestSummary(d)}</AnswerCapsule>

        <PageActions path={`${path}/digest`} url={url} title={`Fitness API digest — ${d.label}`} updated={`${d.month}-01`} />

        {d.changes.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              What changed in the ecosystem
            </h2>
            <ul className="mt-5 space-y-3">
              {d.changes.map((c) => (
                <li key={c.title}>
                  <Link
                    href={c.page.href}
                    className="block rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      {c.date} · {c.status}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-[var(--fg)]">{c.title}</span>
                    <span className="mt-1 block text-sm text-[var(--muted)]">{c.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {d.bySection.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Published or re-verified
            </h2>
            <div className="mt-5 space-y-8">
              {d.bySection.map((s) => (
                <div key={s.basePath}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                    <Link href={s.basePath} className="hover:text-[var(--fg)]">
                      {s.clusterLabel}
                    </Link>{" "}
                    ({s.pages.length})
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {s.pages.map((p) => (
                      <li key={p.href}>
                        <Link href={p.href} className="text-sm text-brand-600 hover:text-brand-500">
                          {p.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <nav aria-label="Other issues" className="mt-12 grid gap-3 sm:grid-cols-2">
          {older ? (
            <Link
              href={`${DIGEST_PATH}/${older.month}`}
              className="rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400"
            >
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Earlier</span>
              <span className="mt-1 block text-sm font-medium text-[var(--fg)]">{older.label}</span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {newer && (
            <Link
              href={`${DIGEST_PATH}/${newer.month}`}
              className="rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400"
            >
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Later →</span>
              <span className="mt-1 block text-sm font-medium text-[var(--fg)]">{newer.label}</span>
            </Link>
          )}
        </nav>

        <div className="mt-14">
          <Newsletter />
        </div>
      </article>
    </Container>
  );
}
