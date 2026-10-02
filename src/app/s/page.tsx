import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";
import { shareAnswer } from "@/lib/picker";

/**
 * The share target for a tool result.
 *
 * A picker answer has no page of its own — it is derived from three choices
 * in a URL — so a link to /picker?j=…&p=…&pr=… shares fine with a human and
 * badly with everything else: the social card says "API picker" and the
 * preview text is the generic page description. This route exists to give
 * that result a card and a title of its own, and nothing else: it is
 * noindex, it renders the same answer, and every button on it leads back to
 * the tool.
 *
 * It is the only dynamically rendered page on the site, which is the cost of
 * having per-result metadata at all. It is deliberately not linked from any
 * server-rendered page — the share buttons build the URL in the browser.
 */
export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? (v[0] ?? "") : (v ?? "");

const pickerAnswer = (sp: Record<string, string | string[] | undefined>) =>
  shareAnswer(one(sp.j), one(sp.p), one(sp.pr));

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const sp = await searchParams;
  const answer = pickerAnswer(sp);
  const title = answer ? answer.result.title : "Shared result";
  const description = answer
    ? `${answer.question} — a recommendation from the AIFitnessAPI picker, with the comparisons and integration guides to read next.`
    : "A shared result from an AIFitnessAPI tool.";
  // The card endpoint takes the three choices and nothing else, and draws its
  // text from them itself — it no longer accepts a title to print. A link
  // that resolves to no answer gets the site's default card instead: /api/og
  // would answer it with a 400, and a share preview with a broken image is
  // worse than a generic one.
  const image = answer ? `/api/og?${answer.query}` : "/opengraph-image";
  return {
    title: { absolute: `${title} · ${site.name}` },
    description,
    robots: { index: false, follow: true },
    // Stated outright rather than left to inheritance. A canonical on a
    // noindex page that names another URL (the homepage, if the layout ever
    // regains one) tells Google two different things; this page has no
    // canonical of its own, so it emits none. Replacing `alternates` also
    // drops the layout's feed links here, which a noindex share target does
    // not need.
    alternates: { canonical: null },
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SharePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const answer = pickerAnswer(sp);

  if (!answer) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">
            Nothing to show
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            This link is missing the choices that produce a result. Run the picker and share
            the link it gives you.
          </p>
          <Link
            href="/picker"
            className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Open the picker
          </Link>
        </div>
      </Container>
    );
  }

  const { result, question, query } = answer;
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Shared from the API picker
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--fg)]">
          {result.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{question}</p>
        <p className="mt-4 text-lg text-[var(--muted)]">{result.body}</p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {result.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex h-full items-center rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={`/picker?${query}`}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Change the answers
          </a>
          <a
            href={absoluteUrl("/apis")}
            className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
          >
            Browse the API directory
          </a>
        </div>

        <p className="mt-8 text-xs text-[var(--muted)]">
          A starting point, not a verdict. Nobody pays for placement here; the site is funded
          by KinesteX, and any page featuring it says so up front.
        </p>
      </div>
    </Container>
  );
}
