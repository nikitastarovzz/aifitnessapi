import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ToolNextStep from "@/components/ToolNextStep";
import MyStack from "@/components/tools/MyStack";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { stackData } from "@/lib/myStack";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * /my-stack — the products your app depends on, with their tracked changes,
 * deadlines, pages and page dates (ops/AUDIENCE-30-2026-11-05.md item 24).
 *
 * The page adds no facts: lib/myStack.ts assembles, at build, what the
 * changes tracker, the graveyard, the vendor menus and the pages' own dates
 * already say. The reader's choice stays in their browser (localStorage and
 * the ?v= address); the downloads are built in the tab. No server code runs
 * per request.
 */

const PATH = "/my-stack";
const UPDATED = "2026-11-05";
// Within 45 characters: the layout appends the site suffix.
const TITLE = "My Fitness API Stack: Deadlines & Changes";
const DESCRIPTION =
  "Pick the fitness and health APIs you use: their tracked changes, deadlines and pages here, plus a calendar and feed list to save. Stays in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "One page for the APIs your product depends on: dated changes, deadlines, every page here about them and how old each one is.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function MyStackPage() {
  const data = stackData();
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "a dashboard of the fitness APIs you depend on",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });
  const withDates = data.vendors.filter((v) => v.deadlines.length).length;

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "My stack", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={11} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">My stack</h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Pick the fitness and health APIs your product depends on, from the {data.vendors.length}{" "}products in this
          site&rsquo;s directory, and this page gathers what the site tracks about them: every dated change and
          deadline, graded confirmed or reported; any of their APIs in the Fitness API Graveyard; every page here about
          each one with the date that page declares; and a calendar, a feed list and a share link for the stack. The
          choice is kept in your browser and in the page address, and nothing is sent anywhere.
        </p>

        <section data-tool="my-stack" aria-label="My stack dashboard">
          <MyStack data={data} origin={site.url} />
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where the dashboard&rsquo;s data comes from</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              Changes and deadlines are the entries of{" "}
              <Link href="/changes" className={linkCls}>
                the changes tracker
              </Link>{" "}
              whose title or summary names the product as a whole word, the rule its{" "}
              <Link href="/apis" className={linkCls}>
                directory entry
              </Link>{" "}
              uses. Each keeps the date at the precision its source gives and the day it was last checked.
            </li>
            <li>
              Stones come from{" "}
              <Link href="/graveyard" className={linkCls}>
                the Fitness API Graveyard
              </Link>
              , matched by the same rule over each stone&rsquo;s name, vendor and summary, each with the vendor&rsquo;s
              own sentence on its page. Where a stone and a tracker entry are the same event on the same date, the
              tracker entry is shown.
            </li>
            <li>
              Pages are the product&rsquo;s menu on this site where it has one, otherwise the pages that cover it most.
              The date beside each is the one the page declares as its last review, and a page past 90 days is
              flagged: the age of a check is the number to watch on a site that tracks a moving ecosystem.
            </li>
            <li>
              {withDates} of the {data.vendors.length} products have at least one dated item, and each of those has an
              embeddable countdown to its next one (
              <Link href="/badges#countdowns" className={linkCls}>
                every countdown widget
              </Link>
              ).
            </li>
          </ul>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What stays in your browser</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Your stack is saved in this browser&rsquo;s local storage under one key and nowhere else. A share link
            carries it in the address, as ?v= and the product ids, so whoever opens it sees the same products without
            anything being stored on a server. The calendar (.ics), the OPML feed list and the RSS snapshot are built
            in the tab from data already in the page. The calendar and the snapshot are copies and do not update; the
            OPML file subscribes a feed reader to each product&rsquo;s live feed, and{" "}
            <a href="/changes/calendar.ics" className={linkCls}>
              the full deadline calendar
            </a>{" "}
            can be subscribed to directly. For email, use{" "}
            <Link href="/alerts" className={linkCls}>
              change alerts
            </Link>
            .
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            KinesteX, which funds this site, is in the list because it is in the directory, on the same terms as every
            other product.
          </p>
        </section>

        <ToolNextStep path={PATH} />

        <p className="mt-8 max-w-3xl text-sm text-[var(--muted)]">
          A free tool from {site.name}. More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
