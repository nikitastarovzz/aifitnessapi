import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import KinestexNote from "@/components/KinestexNote";
import ShareRow from "@/components/ShareRow";
import { routeLabel } from "@/lib/routeLabel";
import { absoluteUrl, site } from "@/lib/site";
import { QUIZ_PATH, quizOutcomePage, quizOutcomePages, resultPath, shareText } from "@/lib/wearableQuizPages";

/**
 * One quiz result (ops/VIRAL-20-2026-11-06.md item 6): a static page per
 * outcome with its own social card (opengraph-image.tsx beside this file), so
 * a shared result previews as itself. noindex, follow: a result is the quiz's
 * answer, and the roundups it links own the comparison queries (ops/GEO.md,
 * one question, one page). Out of the sitemap for the same reason.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return quizOutcomePages().map((p) => ({ result: p.slug }));
}

type Params = Promise<{ result: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { result } = await params;
  const p = quizOutcomePage(result);
  if (!p) return {};
  return {
    title: { absolute: `${p.title} · ${site.name}` },
    description: p.description,
    robots: { index: false, follow: true },
    alternates: { canonical: resultPath(p.slug) },
    openGraph: { type: "article", title: p.h1, description: p.description, url: resultPath(p.slug) },
    twitter: { card: "summary_large_image", title: p.h1, description: p.description },
  };
}

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default async function QuizResultPage({ params }: { params: Params }) {
  const { result } = await params;
  const p = quizOutcomePage(result);
  if (!p) notFound();
  const path = resultPath(p.slug);
  const others = quizOutcomePages();

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-3xl" data-quiz-outcome={p.slug}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Which wearable API quiz", path: QUIZ_PATH },
            { name: p.label, path },
          ]}
        />
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">Quiz result</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl">{p.h1}</h1>
        <p id="answer" className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          {p.verdict} It is a starting point from{" "}
          <Link href={QUIZ_PATH} className={linkCls}>
            the eight-question quiz
          </Link>
          , not a verdict on any product.
        </p>

        {p.firstParty && (
          <p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/5 p-3 text-sm text-[var(--fg)]">
            Disclosure: KinesteX, one of the products listed on this page, funds this site. It is listed alphabetically on
            the same terms as every other option, and nothing here ranks it.
          </p>
        )}

        <ShareRow place="quiz-result" url={absoluteUrl(path)} text={shareText(p)} label="Share your result" />

        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">When this fits (our judgment)</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[var(--muted)]">
            {p.fits.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <h2 className="mt-8 text-xl font-bold tracking-tight text-[var(--fg)]">What to check first (our judgment)</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[var(--muted)]">
            {p.watch.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">The options, and what this site&rsquo;s sources say</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{p.productsLead}</p>
          <ul className="mt-4 space-y-3">
            {p.products.map((x) => (
              <li key={x.name} className="rounded-xl border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--fg)]">
                  <Link href={x.href} className={linkCls}>
                    {x.name}
                  </Link>
                  {x.firstParty && <span className="ml-2 text-xs font-normal text-[var(--muted)]">(funds this site)</span>}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {x.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  From{" "}
                  <Link href={x.source.href} className={linkCls}>
                    {routeLabel(x.source.href.split("?")[0]) ?? x.source.label}
                  </Link>
                  , where each statement is sourced and dated.
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">Read next</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {p.readNext.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-xl border border-[var(--border)] p-3 text-sm font-medium text-[var(--fg)] hover:border-brand-400">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">If one answer were different</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {p.alternatives.map((slug) => {
              const o = others.find((x) => x.slug === slug)!;
              return (
                <li key={slug}>
                  <Link href={resultPath(slug)} className={linkCls}>
                    {o.label}
                  </Link>
                  <span className="text-[var(--muted)]"> — {o.verdict}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 flex flex-wrap gap-2">
            <Link href={QUIZ_PATH} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">
              Take the quiz
            </Link>
            <Link href="/picker" className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400">
              Other kinds of fitness API: the picker
            </Link>
          </p>
        </section>

        <KinestexNote path={path} />

        <p className="mt-8 text-xs text-[var(--muted)]">
          A free quiz from {site.name}. Nobody pays for placement here; the site is funded by KinesteX, and any page
          featuring it says so up front.
        </p>
      </div>
    </Container>
  );
}
