import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { getCompliance, releasedCompliance, COMPLIANCE_PATH } from "@/data/compliance";

const UPDATED = "2026-07-14";

export const metadata: Metadata = {
  title: { absolute: "Health-Data Compliance & Privacy for Fitness Apps" },
  description:
    "Which rules apply to your fitness app — HIPAA, GDPR, FDA — what counts as health data, and how to build for consent, storage, retention, and deletion.",
  alternates: { canonical: COMPLIANCE_PATH },
  openGraph: {
    type: "website",
    title: "Health-Data Compliance & Privacy for Fitness Apps",
    description:
      "A developer's map of health-data compliance: which regulations apply, what counts as health data, and how to build for consent, storage, retention, and platform policy.",
    url: COMPLIANCE_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Which rules apply to you",
    blurb: "Figure out your obligations before you write a line of code.",
    slugs: [
      "hipaa-compliance-fitness-app",
      "gdpr-fitness-app",
      "fda-fitness-app-regulation",
      "is-fitness-data-phi",
    ],
  },
  {
    title: "Platform requirements",
    blurb: "What Apple and Google require to ship a health app.",
    slugs: ["app-store-health-data-rules", "google-play-health-data-policy"],
  },
  {
    title: "Building it right",
    blurb: "Consent, storage, retention, and the policy users actually read.",
    slugs: [
      "store-health-data-securely",
      "health-data-user-consent",
      "health-app-privacy-policy",
      "health-data-retention-deletion",
    ],
  },
];

const FAQS = [
  {
    q: "Does my fitness app have to be HIPAA-compliant?",
    a: "Not automatically. HIPAA applies when you're a covered entity (a healthcare provider, health plan, or clearinghouse) or a business associate handling protected health information on one's behalf. A direct-to-consumer fitness app that a user installs themselves is usually not covered by HIPAA — but it is still subject to other rules (GDPR, state privacy laws, the FTC Health Breach Notification Rule, and app-store policy). Where you sit determines everything else, so start with the HIPAA and 'is this data PHI' pages.",
  },
  {
    q: "Is heart rate or step data considered sensitive?",
    a: "Often, yes. Under GDPR, data 'concerning health' is a special category needing a stronger legal basis, and regulators have treated fitness and wearable data as health data in many contexts. Under HIPAA the label 'PHI' depends on who holds it and why, not just what it is. The practical takeaway: treat wearable and workout data as sensitive by default, and read the 'is fitness data PHI or PII' page for the distinctions.",
  },
  {
    q: "What's the minimum I need before launch?",
    a: "At a minimum, most health apps need: a clear, accurate privacy policy; a lawful basis and genuine consent for collecting health data; secure storage (encryption in transit and at rest, access controls); a way for users to export and delete their data; and compliance with Apple's and Google's health-data rules if you ship on their stores. Each is covered in its own page below. This is general guidance, not legal advice — confirm specifics for your jurisdiction and product.",
  },
];

export default function CompliancePillar() {
  const url = absoluteUrl(COMPLIANCE_PATH);
  const released = releasedCompliance();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Health-Data Compliance & Privacy for Fitness Apps",
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
      url: absoluteUrl(`${COMPLIANCE_PATH}/${e.slug}`),
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Compliance", path: COMPLIANCE_PATH }]} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health-Data Compliance &amp; Privacy for Fitness Apps
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Most consumer fitness apps are not covered by HIPAA, but they still have
          real obligations: GDPR and state privacy laws treat fitness and wearable
          data as sensitive, app stores impose their own health-data rules, and the
          FDA regulates a narrow slice of apps that make medical claims. This hub
          maps which rules apply to you, what counts as health data, and how to
          build for consent, secure storage, retention, and deletion. It is general
          engineering guidance, not legal advice.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Start with the rules that apply to your situation, then move to the
            build practices. If you&rsquo;re still choosing infrastructure, an{" "}
            <Link href="/fitness-apis/health-data-aggregator-apis">aggregator</Link>{" "}
            or an <Link href="/learn/on-device-vs-cloud-health-data">on-device approach</Link>{" "}
            can change how much regulated data you touch in the first place. For the
            consent mechanics, see{" "}
            <Link href="/learn/what-is-oauth-for-health-data">OAuth for health data</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getCompliance(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${COMPLIANCE_PATH}/${e!.slug}`}
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
          pitch="Health-data rules and platform policies shift constantly. We track the changes that affect fitness and wellness builders — get the ones that matter, in plain English."
          source="pillar-inline"
          id="cta-compliance-pillar"
        />

        <ClusterDisclaimer updated={UPDATED} variant="legal" />
      </div>
    </Container>
  );
}
