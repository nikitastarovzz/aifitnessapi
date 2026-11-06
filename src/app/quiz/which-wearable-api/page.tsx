import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ToolNextStep from "@/components/ToolNextStep";
import WearableQuiz from "@/components/WearableQuiz";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { site, absoluteUrl } from "@/lib/site";
import { toolGraph } from "@/lib/schema";
import { SCORES } from "@/lib/wearableQuiz.mjs";
import {
  QUESTIONS,
  QUIZ_DESCRIPTION,
  QUIZ_FAQS,
  QUIZ_H1,
  QUIZ_PATH,
  QUIZ_TITLE,
  QUIZ_UPDATED,
  quizCapsule,
  quizOutcomePages,
  resultPath,
  shareText,
} from "@/lib/wearableQuizPages";

/**
 * /quiz/which-wearable-api (ops/VIRAL-20-2026-11-06.md item 6). The quiz runs
 * in the browser (components/WearableQuiz, logic in lib/wearableQuiz.mjs); the
 * eight results are static pages with their own social cards. Its question is
 * narrower than /picker's: how an app should get wearable data, not which
 * category of fitness API to read about. The two link to each other.
 */

export const metadata: Metadata = {
  title: { absolute: QUIZ_TITLE },
  description: QUIZ_DESCRIPTION,
  alternates: pageMirrorAlternates(QUIZ_PATH),
  openGraph: {
    type: "website",
    title: QUIZ_TITLE,
    description: "Eight questions decide how your app should get wearable data: platform stores, direct APIs, an aggregator, Bluetooth, a research platform or the camera.",
    url: QUIZ_PATH,
  },
};

// The sitemap reads this stamp (lib/sitemap.ts pageStamp); it must equal QUIZ_UPDATED.
const UPDATED = "2026-11-06";
const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const APPROACH_LABEL: Record<string, string> = { store: "platform stores", direct: "direct APIs", aggregator: "aggregator" };

export default function QuizPage() {
  if (UPDATED !== QUIZ_UPDATED) throw new Error("quiz page: UPDATED and QUIZ_UPDATED disagree");
  const outcomes = quizOutcomePages();
  const url = absoluteUrl(QUIZ_PATH);
  const jsonLd = toolGraph({
    path: QUIZ_PATH,
    name: QUIZ_H1,
    alternativeHeadline: "a quiz that decides how your app should get wearable and health data",
    description: QUIZ_DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUIZ_FAQS.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Which wearable API quiz", path: QUIZ_PATH },
          ]}
        />
        <ClusterHero label="Quiz" seed={12} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{QUIZ_H1}</h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {quizCapsule()}
        </p>

        <section data-tool="wearable-quiz" aria-label="Which wearable API quiz" className="mt-8">
          <WearableQuiz
            origin={site.url}
            outcomes={outcomes.map((o) => ({ slug: o.slug, label: o.label, verdict: o.verdict, share: shareText(o) }))}
          />
        </section>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Building something other than a wearable-data integration (exercise content, nutrition, motion)?{" "}
          <Link href="/picker" className={linkCls}>
            The three-question fitness API picker
          </Link>{" "}
          covers every category and routes you to the roundup to read.
        </p>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The eight results</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Each result is an approach, not a product. Its page lists the products of that approach alphabetically, with
            what this site&rsquo;s pages source about each.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {outcomes.map((o) => (
              <li key={o.slug}>
                <Link
                  href={resultPath(o.slug)}
                  className="block h-full rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="block font-semibold text-[var(--fg)]">{o.label} →</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{o.verdict}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How the quiz decides</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The rules are this site&rsquo;s judgment, printed in full so you can disagree with a specific one. Three
            answers decide on their own, in this order: needing movement itself, or users with no wearable, gives{" "}
            <Link href={resultPath("camera-motion")} className={linkCls}>camera pose tracking</Link>; a study under an
            IRB or ethics board gives{" "}
            <Link href={resultPath("research-platform")} className={linkCls}>a research platform</Link>; Bluetooth sensors
            or gym equipment give{" "}
            <Link href={resultPath("bluetooth-direct")} className={linkCls}>reading the sensors directly</Link>. Otherwise
            each answer adds or removes points for three approaches, the highest total wins and a tie goes to the platform
            stores, then direct APIs. The platform-store approach becomes HealthKit, Health Connect or both from your
            platform answer.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface)] text-xs uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2">Answer</th>
                  <th className="px-3 py-2">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {QUESTIONS.flatMap((q) =>
                  q.options
                    .filter(([v]) => SCORES[q.id]?.[v]?.length)
                    .map(([v, label]) => (
                      <tr key={`${q.id}-${v}`}>
                        <td className="px-3 py-2 align-top text-[var(--fg)]">{label}</td>
                        <td className="px-3 py-2 align-top text-[var(--muted)]">
                          {SCORES[q.id][v].map(([ap, pts]) => `${APPROACH_LABEL[ap]} ${pts > 0 ? "+" : ""}${pts}`).join(", ")}
                        </td>
                      </tr>
                    )),
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-[var(--border)]">
            {QUIZ_FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <ToolNextStep path={QUIZ_PATH} />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Nobody pays for placement here; the site is funded by KinesteX, which appears only
          among the camera results, disclosed. More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
