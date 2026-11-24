import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";
import { shareAnswer } from "@/lib/picker";
import PickerSeen from "@/components/PickerSeen";
import ShareRow from "@/components/ShareRow";
import { factCard, type FactCard } from "@/lib/factCards";
import { longDate } from "@/lib/factCardCore.mjs";

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
 *
 * `t=fact&id=<fact id>` (ops/content-log.jsonl 2026-11-24) is the second
 * type: one "Key facts" line from a cluster page, with its verbatim quote,
 * source, check date and the page that uses it. The id is checked against
 * src/lib/factCardCore.mjs FACT_ID and then looked up among the facts the
 * site renders today (src/lib/factCards.ts); nothing from the URL is printed,
 * and the card is the static /og/fact/<id>.png. Any other `t` (or none) is
 * the picker, as before.
 */
export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? (v[0] ?? "") : (v ?? "");

const pickerAnswer = (sp: Record<string, string | string[] | undefined>) =>
  shareAnswer(one(sp.j), one(sp.p), one(sp.pr));

/** The fact for `t=fact`, or null. `sp.id` goes to factCard() as it came, so a
 *  repeated `id` (an array) is refused rather than narrowed to its first value. */
const factOf = (sp: Record<string, string | string[] | undefined>): FactCard | null =>
  one(sp.t) === "fact" ? factCard(sp.id) : null;

const isFact = (sp: Record<string, string | string[] | undefined>) => one(sp.t) === "fact";

function factMetadata(f: FactCard | null): Metadata {
  const title = f ? f.text.title : "Shared fact";
  const description = f ? f.text.description : "A sourced fact shared from AIFitnessAPI.";
  const image = f ? f.image : "/opengraph-image";
  return {
    title: { absolute: `${title} · ${site.name}` },
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: null },
    openGraph: { type: "article", title, description, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (isFact(sp)) return factMetadata(factOf(sp));
  const answer = pickerAnswer(sp);
  const title = answer ? answer.result.title : "Shared result";
  const description = answer
    ? `${answer.question} — a recommendation from the AIFitnessAPI picker, with the comparisons and integration guides to read next.`
    : "A shared result from an AIFitnessAPI tool.";
  // The card is a file the build wrote for this answer (src/app/og/picker),
  // drawn from the same shareAnswer() call as this title — it takes no text
  // from the URL. A link that resolves to no answer gets the site's default
  // card instead: there is no file for it, the card path 404s, and a share
  // preview with a broken image is worse than a generic one.
  const image = answer ? answer.card : "/opengraph-image";
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
  if (isFact(sp)) return <FactShare fact={factOf(sp)} />;
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
        <PickerSeen job={one(sp.j)} platform={one(sp.p)} priority={one(sp.pr)} />
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

const factLink = "font-medium text-brand-600 hover:text-brand-500";

function FactShare({ fact }: { fact: FactCard | null }) {
  if (!fact) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">Fact not found</h1>
          <p className="mt-3 text-[var(--muted)]">
            This link names no fact the site shows today. A fact&rsquo;s link changes when its quoted words or its
            source change, so an old link can stop working. The current facts are in the &ldquo;Key facts&rdquo; box
            under the answer at the top of the guide pages.
          </p>
          <Link
            href="/fitness-apis"
            className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Browse the guides
          </Link>
        </div>
      </Container>
    );
  }
  return (
    <Container className="py-14">
      <article data-fact-card={fact.id} className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          A sourced fact from {site.name}
        </p>
        <blockquote cite={fact.url} className="mt-4 border-l-4 border-brand-500 pl-5">
          <p lang="en" className="text-2xl font-semibold leading-snug tracking-tight text-[var(--fg)]">
            &ldquo;{fact.quote}&rdquo;
          </p>
        </blockquote>
        <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-[9rem_1fr]">
          <dt className="font-semibold text-[var(--fg)]">Source</dt>
          <dd className="break-words text-[var(--muted)]">
            <a href={fact.url} rel="nofollow" className={factLink}>
              {fact.url}
            </a>
          </dd>
          <dt className="font-semibold text-[var(--fg)]">Checked</dt>
          <dd className="text-[var(--muted)]">
            {fact.checked
              ? `${longDate(fact.checked)}, when the page below was last re-verified against this source`
              : "Not recorded"}
          </dd>
          {fact.claim ? (
            <>
              <dt className="font-semibold text-[var(--fg)]">What it supports</dt>
              <dd className="text-[var(--muted)]">{fact.claim}</dd>
            </>
          ) : null}
          <dt className="font-semibold text-[var(--fg)]">Used on</dt>
          <dd className="text-[var(--muted)]">
            <Link href={fact.pagePath} className={factLink}>
              {fact.pageTitle}
            </Link>
          </dd>
        </dl>
        {fact.firstParty ? (
          <p data-fact-disclosure className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
            Disclosure: the page this fact comes from features KinesteX, which funds {site.name}. The fact itself is
            quoted from the source above, not from KinesteX.
          </p>
        ) : null}
        <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
          The quote is the source&rsquo;s own words, copied when the page was checked; the source may have changed
          since. Open it to see what it says today.
        </p>
        <ShareRow place="fact" url={absoluteUrl(fact.sharePath)} text={fact.text.shareText} label="Share this fact" />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={fact.pagePath}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Read the full page
          </Link>
          <a
            href={absoluteUrl("/methodology")}
            className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
          >
            How facts are checked
          </a>
        </div>
      </article>
    </Container>
  );
}
