import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";
import { recommend, JOB_OPTIONS, PLATFORM_OPTIONS, PRIORITY_OPTIONS } from "@/lib/picker";
import type { Job, Platform, Priority } from "@/lib/picker";

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

function pickerAnswer(sp: Record<string, string | string[] | undefined>) {
  const j = one(sp.j);
  const p = one(sp.p);
  const pr = one(sp.pr);
  const okJ = JOB_OPTIONS.find((o) => o.value === j);
  const okP = PLATFORM_OPTIONS.find((o) => o.value === p);
  const okPr = PRIORITY_OPTIONS.find((o) => o.value === pr);
  if (!okJ || !okP || !okPr) return null;
  return {
    result: recommend(j as Job, p as Platform, pr as Priority),
    question: `${okJ.label} · ${okP.label} · ${okPr.label}`,
    query: `j=${j}&p=${p}&pr=${pr}`,
  };
}

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
  const og = new URLSearchParams({
    eyebrow: "API picker",
    title,
    ...(answer ? { line: answer.question } : {}),
  });
  return {
    title: { absolute: `${title} · ${site.name}` },
    description,
    robots: { index: false, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: `/api/og?${og.toString()}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?${og.toString()}`],
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
