import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import DailyPuzzle from "@/components/DailyPuzzle";
import { FaqSection, faqGraph, JsonLd, type Faq } from "@/app/error-codes/_shared";
import { absoluteUrl, site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";
import { PAGE_H1 } from "@/data/pageTitles";
import { DAILY_CAPSULE, DAILY_PATH, DAILY_SOURCE_DATES, dailyBank, dailyDataDate, dailyFaqs } from "@/lib/dailyBank";
import { bankSizes } from "@/lib/dailyPuzzle";

/**
 * /daily — one developer puzzle a day, built only from the site's generated
 * datasets. The page is static: the bank is computed here at build time and
 * the browser picks the day's five questions from the UTC date
 * (src/lib/dailyPuzzle.ts), so every visitor on a date gets the same puzzle
 * with no server, no account and nothing stored except the reader's own
 * picks in their own browser.
 *
 * Declared dateModified is the newest read date among the datasets the bank
 * draws from (dailyDataDate), which the sitemap reads too.
 */

const PATH = DAILY_PATH;
const H1 = PAGE_H1[PATH];
const TITLE = "Daily Health-API Developer Puzzle";
const DESCRIPTION =
  "Five questions a day from our HealthKit, Health Connect, Google Health API and pose-keypoint datasets, with a spoiler-free grid to share.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: H1,
    description:
      "A new five-question puzzle every UTC day: which platform throws this error, which Health Connect record, sum or average, which keypoint.",
    url: PATH,
  },
};

export default function DailyPage() {
  const bank = dailyBank();
  const sizes = bankSizes(bank);
  const modified = dailyDataDate();
  const total = sizes.platform + sizes.translate + sizes.aggregation + sizes.keypoint;

  const FAQS: Faq[] = dailyFaqs();

  const graph = toolGraph({
    path: PATH,
    name: H1,
    description: DESCRIPTION,
    dateModified: modified,
    webPage: { lastReviewed: modified },
  });

  return (
    <Container className="py-14">
      <JsonLd data={graph} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Daily puzzle", path: PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          A new puzzle every day at 00:00 UTC · {total} questions in the bank · built from datasets read{" "}
          {DAILY_SOURCE_DATES.healthkitIdentifiers} to {modified}
        </p>

        <p id="answer" className="speakable mt-6 text-lg leading-relaxed text-[var(--muted)]">
          {DAILY_CAPSULE}
        </p>

        <section data-tool="daily" aria-label="Today's puzzle">
          <DailyPuzzle bank={bank} url={absoluteUrl(PATH)} />
          <noscript>
            <p className="mt-4 text-sm text-[var(--muted)]">
              The puzzle is picked in your browser from today&rsquo;s UTC date, so it needs JavaScript. The
              same facts are on the pages linked below.
            </p>
          </noscript>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How the puzzle is built</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">
            <p>
              Each day has all four kinds of question, led by a different kind each day, with the lead kind
              asked twice. The bank holds:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="font-semibold text-[var(--fg)]">Which platform throws this?</strong>{" "}
                {sizes.platform} error messages: {bank.errors.healthkit.length} from Apple&rsquo;s{" "}
                <Link href="/healthkit-errors" className="text-brand-600 hover:text-brand-500">HKError.Code reference</Link>,{" "}
                {bank.errors["health-connect"].length} from Google&rsquo;s{" "}
                <Link href="/error-codes/health-connect" className="text-brand-600 hover:text-brand-500">HealthConnectException constants</Link>{" "}
                (read {DAILY_SOURCE_DATES.errorCodes}) and {bank.errors["google-health-api"].length} from the{" "}
                <Link href="/google-health-api/errors" className="text-brand-600 hover:text-brand-500">Google Health API v4 error catalog</Link>{" "}
                (read {DAILY_SOURCE_DATES.googleHealthApi}). The platform is drawn first, so the larger catalog
                does not crowd out the other two. Messages that name their own platform, or that two platforms
                share word for word, are left out.
              </li>
              <li>
                <strong className="font-semibold text-[var(--fg)]">Translate it:</strong> {sizes.translate}{" "}
                HealthKit identifiers named in the{" "}
                <Link href="/matrix" className="text-brand-600 hover:text-brand-500">HealthKit ↔ Health Connect matrix</Link>,
                each checked against Apple&rsquo;s and Google&rsquo;s documentation. The four options are matrix
                rows, so an identifier is never paired with a record the matrix does not pair it with.
              </li>
              <li>
                <strong className="font-semibold text-[var(--fg)]">Sum or average?</strong> {sizes.aggregation}{" "}
                quantity types where Apple&rsquo;s documentation states the aggregation style, from the{" "}
                <Link href="/healthkit-identifiers" className="text-brand-600 hover:text-brand-500">HealthKit identifier dataset</Link>{" "}
                (read {DAILY_SOURCE_DATES.healthkitIdentifiers}). The same sentence drives the{" "}
                <Link href="/tools/aggregation-checker" className="text-brand-600 hover:text-brand-500">aggregation checker</Link>.
              </li>
              <li>
                <strong className="font-semibold text-[var(--fg)]">Name the keypoint:</strong> {sizes.keypoint}{" "}
                indexed points across {bank.keypoints.length} schemes in the{" "}
                <Link href="/pose-keypoints" className="text-brand-600 hover:text-brand-500">pose keypoint reference</Link>{" "}
                (read {DAILY_SOURCE_DATES.poseKeypoints}). COCO-WholeBody&rsquo;s face-0 to face-67 points are
                not asked, and when a point has a left or right twin in the same scheme, the twin is one of the
                options.
              </li>
            </ul>
            <p>
              The selection code is one pure module tested against every date from launch to the end of 2027:
              same date, same puzzle, every answer traced back to its dataset row. A dataset regeneration can
              change the bank, and so the draw for days that have not happened yet.
            </p>
          </div>
        </section>

        <FaqSection faqs={FAQS} />

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Related</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/tools", label: "Every free tool for health-app builders" },
              { href: "/error-codes", label: "HealthKit and Health Connect error codes" },
              { href: "/tools/identifier-translator", label: "Translate a HealthKit type to Health Connect" },
              { href: "/pose-keypoints", label: "Pose keypoint indices, every scheme" },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted)]">
          By {site.name}. Product and company names are trademarks of their respective owners; {site.name} is
          not affiliated with or endorsed by Apple, Google or the pose-model projects quoted here. Vendor
          wording is quoted as the datasets hold it on their read dates.
        </p>
      </div>
    </Container>
  );
}
