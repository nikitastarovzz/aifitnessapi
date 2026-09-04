import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import PageSummary from "@/components/PageSummary";

const UPDATED = "2026-07-31";

export const metadata: Metadata = {
  title: "How We Verify",
  description:
    "How AIFitnessAPI is researched: primary sources fetched at write time, unverifiable claims marked instead of guessed, adversarial review before publishing.",
  alternates: { canonical: "/methodology" },
};

/**
 * The methodology page IS the differentiator, stated plainly. Everything
 * here describes what the pipeline actually does — nothing aspirational.
 * If the process changes, this page changes.
 */
export default function MethodologyPage() {
  return (
    <Container className="py-14">
      <div className="prose prose-neutral mx-auto max-w-2xl dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
        <h1>How we verify what we publish</h1>
        <p className="text-sm text-[var(--muted)]">Last updated {UPDATED}</p>

        <PageSummary path="/methodology" name="How we verify what we publish" updated={UPDATED} className="">
          Most technical content about fitness APIs is written from memory and
          other people&rsquo;s blog posts. Ours is not, and this page explains
          the actual process — including what it catches and where its limits
          are.
        </PageSummary>

        <h2>Primary sources, fetched at write time</h2>
        <p>
          Factual claims — API behavior, deprecation dates, permission names,
          data-type semantics — come from vendor documentation fetched during
          research for that specific page, not recalled from training data or
          copied from secondary coverage. Where a page states something
          load-bearing, it says who documents it: &ldquo;Apple
          documents…&rdquo;, &ldquo;Google documents…&rdquo;, &ldquo;RFC 6585
          says…&rdquo;.
        </p>

        <h2>&ldquo;We could not verify this&rdquo; is a valid answer</h2>
        <p>
          When a primary source is unreachable or silent, we say so rather
          than filling the gap with a plausible guess. That is why you will
          find tables on this site with rows marked
          &ldquo;could not verify&rdquo;, pages stating that a rate limit is
          undocumented, and exactly zero invented statistics. A narrow page
          you can trust beats a complete-looking one you cannot.
        </p>

        <h2>Folklore gets checked, not repeated</h2>
        <p>
          Widely repeated developer claims are tested against the primary
          source before they appear here — and several well-known
          &ldquo;facts&rdquo; failed that test and are corrected on the
          relevant pages. Where a belief is common but unsourced, we label it
          as folklore rather than asserting either direction.
        </p>

        <h2>Adversarial review before publishing</h2>
        <p>
          Every content cluster is reviewed by adversarial passes whose
          explicit job is to find fabricated claims, unsourced numbers,
          internal contradictions, and broken code samples — including
          executing SQL and checking every API identifier against the sources.
          Reviews have rejected and corrected our own drafts many times; that
          is the point of them.
        </p>

        <h2>Automated gates on every build</h2>
        <p>
          Before any change ships, an automated gate checks every page for
          broken internal links, metadata problems, duplicate questions
          answered in two places, and malformed structured data. The gate has
          rejected our own work repeatedly. It is not allowed to be weakened
          to make a change pass. Every one of those refusals is published, with
          what it refuses to ship, at{" "}
          <Link href="/gates">the gates</Link>.
        </p>

        <h2>Judgement is labelled as judgement</h2>
        <p>
          Engineering recommendations — which architecture to pick, what to
          test first, when to buy instead of build — are opinions, and the
          pages say &ldquo;our recommendation&rdquo; or &ldquo;in our
          experience&rdquo; when giving them. We do not dress opinion up as
          documentation, and we do not cite studies that do not exist.
        </p>

        <h2>Dates on volatile claims</h2>
        <p>
          Pricing, rate limits, library versions and platform policies change.
          Pages carry a last-reviewed date, volatile specifics are hedged with
          &ldquo;as of&rdquo; dates, and we tell you to verify against the
          provider&rsquo;s current documentation before committing — because
          by the time you read a page, the vendor may have moved.
        </p>

        <h2>Who pays for this, and independence</h2>
        <p>
          {site.name} is run by the team behind{" "}
          <a href="https://kinestex.com" rel="noopener">KinesteX</a>, an AI
          motion-tracking SDK. That funds the site. It does not buy
          conclusions: comparisons include competitors, our
          build-vs-buy pages regularly recommend building or buying from
          others, and no vendor — including KinesteX — edits our copy.
          Where a topic touches camera-based motion tracking, you should know
          that context and weigh it; that is why it is stated here rather
          than discovered later.
        </p>

        <h2>Corrections</h2>
        <p>
          Found something wrong? Email{" "}
          <a href={`mailto:${site.newsletterMailto}`}>{site.newsletterMailto}</a>.
          Verified corrections ship with the same priority as new content, and
          material ones are noted on the page they fix.
        </p>

        <p>
          <Link href="/about">More about the site</Link> ·{" "}
          <Link href="/privacy">Privacy</Link>
        </p>
      </div>
    </Container>
  );
}
