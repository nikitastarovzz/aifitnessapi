import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { site } from "@/lib/site";
import { GATES } from "@/data/gates";
import PageSummary from "@/components/PageSummary";

const TITLE = "About";
const DESCRIPTION = `About ${site.name} — who writes these fitness, wearable and health API guides, how they are verified against primary sources, and who funds the site.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)]">
          About {site.name}
        </h1>
        <PageSummary path="/about" name={`About ${site.name}`} className="mt-6 text-lg text-[var(--muted)]">
          {site.name} is a home for people building — or looking for — products
          in health, wellness, and fitness technology. Founders, engineers,
          designers, and operators all pass through the same hard problems: how
          to model workouts, keep users engaged, ship AI-powered coaching, and
          integrate the right APIs without reinventing the wheel.
        </PageSummary>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-a:text-brand-600">
          <p>
            We publish product breakdowns, API deep-dives, and practical
            playbooks so you can spend less time on undifferentiated plumbing
            and more time on the experience that makes your product worth using.
          </p>
          {/* The description promises "how they are verified" and "who funds the
              site"; both are restated from /methodology and /gates, not new claims. */}
          <h2>How the pages are checked</h2>
          <p>
            Factual claims come from vendor documentation fetched while researching that page, and
            a claim we could not verify is labelled as such rather than filled in. Before anything
            deploys, the build runs {GATES.length} automated refusals over the rendered site —
            broken anchors, truncated titles, undisclosed first-party links, and more — and every
            one is listed, with what it refuses to ship, at{" "}
            <Link href="/gates">the gates</Link>. The rest of the process is in{" "}
            <Link href="/methodology">how we verify</Link>, and what got through anyway is in{" "}
            <Link href="/corrections">corrections</Link>.
          </p>
          <p>
            KinesteX, an AI motion-tracking SDK, funds this site. It does not buy conclusions: pages
            that feature it carry a disclosure, and comparisons say where its competitors win.
          </p>
          <p>
            Have something to share, or want to be featured? Reach out at{" "}
            <a href={`mailto:${site.author.email}`}>{site.author.email}</a>.
          </p>
        </div>

        <div className="mt-14">
          <Newsletter source="about-subscribe" />
        </div>
      </div>
    </Container>
  );
}
