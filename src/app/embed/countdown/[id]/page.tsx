import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmbedFrame from "@/components/EmbedFrame";
import CountdownWidget from "@/components/CountdownWidget";
import { site } from "@/lib/site";
import { countdownTargetById, countdownTargets, type CountdownTarget } from "@/lib/vendorDeadlines";
import { fmtStatedDate } from "@/lib/stackFeeds.mjs";

/**
 * A live countdown to one sourced deadline, as an iframe widget
 * (ops/AUDIENCE-30-2026-11-05.md item 26).
 *
 * Two kinds of address, one list (lib/vendorDeadlines.ts):
 *  - /embed/countdown/<graveyard id>: the end date of one stone in the
 *    Fitness API Graveyard, with the vendor's own sentence under the count;
 *  - /embed/countdown/<directory id>: the next dated item for one product,
 *    picked in the reader's browser from its tracker entries and stones.
 *
 * Dates come only from src/data/changes.ts and src/data/graveyard.ts, at the
 * source's precision. Not indexable, like every widget under /embed: noindex,
 * canonical and og:url to the page that covers the date, out of the sitemap,
 * with the visible backlink EmbedFrame renders. Routes exist only for listed
 * targets (dynamicParams = false).
 */
export const dynamicParams = false;

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return countdownTargets().map((t) => ({ id: t.id }));
}

const TITLE_MAX = 60;
const DESC_MAX = 155;

/** The first wording that fits; never a clamp. */
function fit(options: string[], max: number, what: string, id: string): string {
  const hit = options.find((o) => o.length <= max);
  if (!hit) throw new Error(`embed/countdown/${id}: no ${what} fits ${max} characters`);
  return hit;
}

function titleOf(t: CountdownTarget): string {
  return fit(
    [`${t.name} countdown (embed widget)`, `Countdown: ${t.name} (embed)`, `Countdown: ${t.id} (embed widget)`],
    TITLE_MAX,
    "title",
    t.id,
  );
}

function descriptionOf(t: CountdownTarget): string {
  if (t.kind === "vendor") {
    return fit(
      [
        `Embeddable live countdown to the next dated ${t.name} API change or deadline in the aifitnessapi.com tracker, with its source. Canonical: ${t.canonical}.`,
        `Embeddable live countdown to the next dated ${t.name} change or deadline tracked on aifitnessapi.com, with its source.`,
      ],
      DESC_MAX,
      "description",
      t.id,
    );
  }
  const when = fmtStatedDate(t.items[0].date);
  return fit(
    [
      `Embeddable live countdown to ${when}: ${t.name}, with the vendor's own words. Canonical: ${t.canonical}.`,
      `Embeddable live countdown to ${when} for ${t.name}, quoting the vendor.`,
      `Embeddable live countdown to ${when}, the date the vendor gives, with its own words. Canonical: ${t.canonical}.`,
    ],
    DESC_MAX,
    "description",
    t.id,
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const t = countdownTargetById(id);
  if (!t) return {};
  const title = titleOf(t);
  const description = descriptionOf(t);
  return {
    title: { absolute: title },
    description,
    robots: { index: false },
    alternates: { canonical: t.canonical },
    openGraph: { type: "website", title, description, url: t.canonical, images: ["/opengraph-image"] },
  };
}

export default async function EmbedCountdown({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const t = countdownTargetById(id);
  if (!t) notFound();
  const heading = t.kind === "vendor" ? `Next ${t.name} API deadline` : `${t.name}: countdown`;

  return (
    <EmbedFrame heading={heading} canonicalPath={t.canonical} ctaLabel={t.ctaLabel}>
      <div
        data-countdown={t.id}
        data-countdown-kind={t.kind}
        data-countdown-dates={t.items.map((i) => i.date).join(" ")}
      >
        <CountdownWidget name={t.name} kind={t.kind} items={t.items} origin={site.url} />
      </div>
      {t.firstParty && (
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          Disclosure: KinesteX funds this site. Its dates are sourced on the same terms as every other vendor&rsquo;s.
        </p>
      )}
    </EmbedFrame>
  );
}
