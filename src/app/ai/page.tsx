import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getAi, releasedAi, AI_PATH } from "@/data/ai";

const UPDATED = "2026-07-27";

export const metadata: Metadata = {
  title: "AI & LLM Features for Fitness Apps",
  description:
    "How to build LLM features into a fitness app: plan generation, food logging, coaching prompts, grounding, safety guardrails, model choice, evals, and cost.",
  alternates: { canonical: AI_PATH },
  openGraph: {
    type: "website",
    title: "AI & LLM Features for Fitness Apps",
    description:
      "Workout plan generation, natural-language food logging, conversational coaching — the engineering patterns, safety guardrails, and real costs behind LLM features in fitness apps.",
    url: AI_PATH,
    images: ["/opengraph-image"],
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "The features",
    blurb: "What teams actually ship, and how each one is wired.",
    slugs: [
      "ai-workout-plan-generation",
      "ai-nutrition-logging",
      "personalize-with-wearable-data",
      "ground-llm-in-exercise-database",
    ],
  },
  {
    title: "Making it good",
    blurb: "Prompting, architecture, and knowing whether it works.",
    slugs: [
      "ai-fitness-coach-prompts",
      "ai-vs-rules-based-coaching",
      "evaluating-ai-fitness-features",
    ],
  },
  {
    title: "Safety, model choice & cost",
    blurb: "The three things that decide whether it ships.",
    slugs: [
      "llm-safety-fitness-advice",
      "choosing-an-llm-for-fitness-apps",
      "ai-fitness-app-cost",
    ],
  },
];

const FAQS = [
  {
    q: "Can an LLM safely give workout and nutrition advice?",
    a: "Not on its own. A language model will produce a confident, specific, plausible-sounding training plan or calorie target with no idea whether it's appropriate for the person reading it — and it has no way to notice a symptom that should stop the conversation. The shipping pattern is to constrain rather than trust: generate from a vetted exercise or food catalogue instead of free text, validate the output against your own rules server-side, escalate or refuse on risk signals (chest pain, fainting, pregnancy, disordered-eating language, minors), and keep a clear not-medical-advice framing. Whatever your app says is your responsibility, not the model vendor's.",
  },
  {
    q: "Should I use an LLM or ordinary rules for workout programming?",
    a: "Use rules for anything that has a correct answer — progression schemes, set and rep math, deload timing, substitution when equipment is missing. Those are deterministic, testable, cheap, and never hallucinate. Use a language model for the parts that are genuinely open-ended: understanding what a user typed, explaining why the plan looks the way it does, and adapting tone. Most good AI fitness features are a rules engine wearing a language interface, not a model improvising a program.",
  },
  {
    q: "What does an AI fitness feature cost to run?",
    a: "Cost is driven by tokens, not by which model you pick: the system prompt plus any retrieved context you send, multiplied by how often you call it, plus the output you generate. A once-a-week plan generation is nearly free per user; an always-on chat coach with a long history is not. The levers that matter are trimming retrieved context, capping output length, caching a large repeated system prompt, batching anything that doesn't need to be interactive, and routing mechanical calls to a smaller model. Work the arithmetic for your own traffic before you commit to a design.",
  },
];

export default function AiPillar() {
  const url = absoluteUrl(AI_PATH);
  const released = releasedAi();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AI & LLM Features for Fitness Apps",
    description: metadata.description,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: released.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.h1,
      url: absoluteUrl(`${AI_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "AI Features", path: AI_PATH }]} />

        <ClusterHero label="AI Features" seed={heroSeed(AI_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          AI &amp; LLM Features for Fitness Apps
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Language models are good at the parts of a fitness app that were previously impossible —
          understanding &ldquo;I tweaked my shoulder, swap today&rsquo;s session&rdquo;, logging a meal
          from a sentence, explaining a plan in the user&rsquo;s own terms. They are bad at the parts you
          already had covered: arithmetic, progression rules, and knowing when advice is unsafe. This hub
          is how to build the first kind while refusing to trust the model with the second — features,
          prompting, grounding, guardrails, model choice, evaluation, and cost.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            This is the <em>language-model</em> layer. The computer-vision side — pose estimation, rep
            counting, form scoring from a camera — lives in{" "}
            <Link href="/motion">AI motion &amp; pose estimation</Link>. If you&rsquo;re scoping the
            product rather than the feature, start with{" "}
            <Link href="/build/ai-fitness-coaching-app">building an AI fitness coaching app</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getAi(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${AI_PATH}/${e!.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e!.metaDescription}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="Model behaviour, pricing, and platform AI policies change faster than any other part of this stack. We track what actually changes for people shipping AI health features. Get the updates."
          source="pillar-inline"
          id="cta-ai-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} variant="health-ai" />
      </div>
    </Container>
  );
}
