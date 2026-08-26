import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import PageSummary from "@/components/PageSummary";
import PageActions from "@/components/PageActions";
import { HK_ERRORS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * The HKError.Code reference.
 *
 * The reason this is worth a page of its own rather than a section on the
 * identifier reference: these are the strings a developer pastes into a
 * search box at the exact moment something has failed, which is a different
 * intent from browsing a type list, and it deserves its own address.
 *
 * The honest gap is stated rather than papered over. Apple publishes the
 * names and the behaviour but not the numeric raw values, so somebody holding
 * "Error Domain=com.apple.healthkit Code=5" cannot be matched to a name from
 * anything Apple states publicly. We say that instead of guessing a mapping.
 */

const PATH = "/healthkit-errors";
const documented = HK_ERRORS.filter((e) => !e.undocumented);
const undocumented = HK_ERRORS.filter((e) => e.undocumented);

export const metadata: Metadata = {
  title: { absolute: "Every HealthKit Error Code" },
  description:
    "All 17 HKError.Code cases from Apple's own docs, what each actually means, and why a denied HealthKit read never raises one at all.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: "Every HealthKit Error Code",
    description:
      "The full HKError.Code set with Apple's own description of each — plus the reason the error you are looking for may not exist.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const FAQS = [
  {
    q: "Which HealthKit error tells me the user denied a read?",
    a: "None of them, and that is the single most misunderstood thing about HealthKit permissions. Apple's own description of errorAuthorizationDenied says it occurs when the app attempts to save data. A denied read is not reported as an error at all — the query succeeds and returns only the data your own app previously wrote, which for most apps is nothing. So an empty result set is ambiguous by design: it means either the user has no such data or the user refused you access, and HealthKit deliberately will not tell you which. Never render 'no data' as a factual claim about the user; render it as 'we cannot see this'.",
  },
  {
    q: "What is HealthKit error code 5 — how do I map a number to a name?",
    a: `You cannot, from anything Apple publishes. Crash logs and NSError descriptions surface the numeric code — "Error Domain=com.apple.healthkit Code=5" — but Apple's documentation for HKError.Code lists the ${HK_ERRORS.length} cases without their raw integer values, and the order the documentation lists them in is not declaration order, so the position of a case in the list tells you nothing about its number. We could publish a guessed mapping and it would look authoritative; instead we publish the named set and this caveat. To identify an error in your own code, switch on HKError.Code rather than comparing integers.`,
  },
  {
    q: "Are there HealthKit errors Apple ships with no documentation?",
    a: `Yes — ${undocumented.length} of the ${HK_ERRORS.length} cases carry a declaration and nothing else as of our ${HK_FETCHED_ON} read: ${undocumented.map((e) => e.case).join(", ")}. They compile and they can be returned to you, but Apple's reference does not say what triggers them or what you should do about it. If you hit one, anything you conclude is inference from observed behaviour rather than documented contract.`,
  },
];

export default function HealthKitErrorsPage() {
  const url = absoluteUrl(PATH);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Every HealthKit error code",
    description: metadata.description,
    dateModified: HK_FETCHED_ON,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "HealthKit errors", path: PATH }]} />
        <ClusterHero label="Reference" seed={5} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Every HealthKit error code
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {HK_ERRORS.length} HKError.Code cases · read from Apple&rsquo;s documentation on {HK_FETCHED_ON}
        </p>

        <PageSummary path={PATH} name="Every HealthKit error code" updated={HK_FETCHED_ON}>
          The error most people come here looking for does not exist: a denied HealthKit{" "}
          <em>read</em> raises nothing at all. Apple reports refusal only on writes, so an empty
          result is deliberately ambiguous between “no data” and “no permission”.
        </PageSummary>

        <div id="answer" className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6">
          HealthKit reports failures through <code className="font-mono text-base">HKError.Code</code>,
          which has {HK_ERRORS.length} cases. Two things about that set surprise people. The first is
          that read denial is not one of them — Apple raises{" "}
          <code className="font-mono text-sm">errorAuthorizationDenied</code> when your app tries to{" "}
          <em>save</em>, and a refused read simply returns your own app&rsquo;s data and nothing else.
          The second is that Apple does not publish the numeric values, so the code in your crash log
          cannot be matched to a name from the documentation. Both are stated below rather than
          smoothed over.
        </div>

        <PageActions path={PATH} url={url} title="Every HealthKit error code" updated={HK_FETCHED_ON} markdown={false} />

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The silent failure</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Apple&rsquo;s description of{" "}
            <code className="font-mono text-sm">errorAuthorizationDenied</code> is{" "}
            <q>The user hasn&rsquo;t given the app permission to save data</q>, and its discussion adds
            that the error <q>occurs only when your app attempts to save data</q>. There is no
            equivalent for reading. If the user refuses read access, your query succeeds and returns
            only what your own app wrote into HealthKit — which for a new install is nothing.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            This is intentional: telling an app that a read was refused would itself leak that the
            user has something to hide. The consequence for your code is that an empty result can
            never be presented as a statement about the user. Design the empty case as{" "}
            <q>we can&rsquo;t see this</q>, never <q>you have no data</q>. Our{" "}
            <Link href="/fix/healthkit-no-data" className="font-medium text-brand-600 hover:text-brand-500">
              HealthKit returns no data
            </Link>{" "}
            and{" "}
            <Link href="/fix/healthkit-authorization-denied" className="font-medium text-brand-600 hover:text-brand-500">
              authorization denied
            </Link>{" "}
            pages work through the diagnosis.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The cases Apple documents</h2>
          <div className="mt-5 space-y-4">
            {documented.map((e) => (
              <div key={e.case} id={`err-${e.case.toLowerCase()}`} className="scroll-mt-24 rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-mono text-sm font-bold text-[var(--fg)]">{e.case}</h3>
                <p className="mt-1.5 text-sm text-[var(--fg)]">{e.abstract}</p>
                {e.discussion && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{e.discussion}</p>
                )}
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {e.platforms.find((p) => p.name === "iOS")?.introducedAt
                    ? `iOS ${e.platforms.find((p) => p.name === "iOS")?.introducedAt}+ · `
                    : ""}
                  <a href={e.docUrl} className="hover:text-[var(--fg)]" rel="nofollow">
                    Apple docs
                  </a>
                </p>
              </div>
            ))}
          </div>
        </section>

        {undocumented.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              The cases Apple ships undocumented
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              {undocumented.length} cases carry a declaration and nothing else — no description, no
              discussion — as of {HK_FETCHED_ON}. They can still be returned to your app.
            </p>
            <ul className="mt-4 space-y-2">
              {undocumented.map((e) => (
                <li key={e.case} id={`err-${e.case.toLowerCase()}`} className="scroll-mt-24 rounded-lg border border-[var(--border)] px-4 py-2">
                  <code className="font-mono text-sm text-[var(--fg)]">{e.case}</code>
                  <a href={e.docUrl} className="ml-2 text-xs text-[var(--muted)] hover:text-[var(--fg)]" rel="nofollow">
                    Apple docs
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <div className="mt-5 space-y-5">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-bold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          Every case, description and discussion above is read from Apple&rsquo;s published
          documentation on {HK_FETCHED_ON} by{" "}
          <code className="font-mono text-xs">scripts/fetch-healthkit-identifiers.mjs</code>. The
          type reference lives at{" "}
          <Link href="/healthkit-identifiers" className="font-medium text-brand-600 hover:text-brand-500">
            every HealthKit type identifier
          </Link>
          . Compiled by {site.name}; Apple&rsquo;s documentation remains the authority.
        </p>

        <ClusterCta
          pitch="We re-read Apple's documentation and re-publish when it changes — including when one of those undocumented error cases finally gets a description."
          source="pillar-inline"
          id="cta-hk-errors"
        />
      </div>
    </Container>
  );
}
