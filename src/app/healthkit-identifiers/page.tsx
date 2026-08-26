import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import PageSummary from "@/components/PageSummary";
import PageActions from "@/components/PageActions";
import HkIdentifierTable, { type HkRow } from "@/components/HkIdentifierTable";
import { HK_IDENTIFIERS, HK_GROUPS, HK_FAMILIES, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * The complete HKQuantityTypeIdentifier reference.
 *
 * Deliberately ONE page, not 120. Apple's median discussion for a quantity
 * type is 23 words — a page per identifier would be 120 pages of restated
 * one-liners, which is the thin-content trap that gets whole page sets
 * demoted. What Apple does not offer anywhere is the set viewed as a set:
 * which types are cumulative and which are discrete, what the unit families
 * are, and which ones have an Android counterpart. That is what this adds.
 */

const PATH = "/healthkit-identifiers";

const QUANTITY = HK_IDENTIFIERS.filter((r) => r.family === "quantity");
const cumulative = QUANTITY.filter((r) => r.aggregation === "cumulative");
const discrete = QUANTITY.filter((r) => r.aggregation === "discrete");
const unstated = QUANTITY.filter((r) => !r.aggregation);
const CATEGORY = HK_IDENTIFIERS.filter((r) => r.family === "category");
const undocumented = HK_IDENTIFIERS.filter((r) => r.undocumented);

/** Identifiers our HealthKit ↔ Health Connect matrix already maps to Android. */
const MAPPED = new Set(
  MATRIX_ROWS.flatMap((r) =>
    (r.apple.match(/HKQuantityTypeIdentifier\.(\w+)/g) ?? []).map((m) => m.split(".")[1]),
  ),
);

export const metadata: Metadata = {
  title: { absolute: "Every HealthKit Type Identifier" },
  description:
    "All 240 HealthKit identifiers from Apple's own docs — quantity, category, characteristic and workout types, with units, availability and aggregation.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: "Every HealthKit Type Identifier",
    description:
      "All four HealthKit identifier families in one filterable table: units, value enums, iOS availability, and the cumulative-vs-discrete split.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const FAQS = [
  {
    q: "How do I know whether a HealthKit type is cumulative or discrete?",
    a: `Apple states it in the type's discussion rather than exposing it as a property, which is why it is easy to miss. Of the ${QUANTITY.length} quantity types, ${cumulative.length} are described as measuring cumulative values and ${discrete.length} as discrete; Apple's wording does not state it for the remaining ${unstated.length}. The distinction decides which HKStatisticsQuery option is correct: cumulative types are summed with .cumulativeSum, discrete types are averaged or reduced with options such as .discreteAverage, .discreteMin and .discreteMax. Choosing the wrong one does not raise an error — it returns a plausible number that is wrong, which is the worst possible failure mode.`,
  },
  {
    q: "Why does summing heart rate give a nonsense number?",
    a: "Because heart rate is a discrete type, not a cumulative one. Cumulative types like step count and active energy accumulate over an interval, so summing the samples in that interval is meaningful. Discrete types like heart rate, body mass and VO2 max are point-in-time measurements; adding them together produces a figure with no physical meaning. Use .discreteAverage for a representative value over a window, and .discreteMin or .discreteMax when you want the extremes.",
  },
  {
    q: "Are there HealthKit types Apple ships without any documentation?",
    a: `Yes. As of our ${HK_FETCHED_ON} read of Apple's documentation, ${undocumented.length} quantity types carry neither an abstract nor a discussion: ${undocumented.map((r) => r.case).join(", ")}. All three were introduced in iOS 18. The identifiers are real and usable, but Apple's own reference says nothing about what they contain or how they are calculated, so treat any behaviour you observe as unverified until Apple documents it.`,
  },
];

export default function HealthKitIdentifiersPage() {
  const url = absoluteUrl(PATH);

  const rows: HkRow[] = HK_IDENTIFIERS.map((r) => ({
    c: r.case,
    o: r.objc,
    f: r.family,
    ft: r.familyType,
    g: r.group,
    a: r.abstract,
    agg: r.aggregation,
    u: r.unitFamily,
    ve: r.valueEnum,
    ios: r.platforms.find((p) => p.name === "iOS")?.introducedAt ?? null,
  }));

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "HealthKit type identifiers",
    description: `All ${HK_IDENTIFIERS.length} HealthKit identifiers across ${HK_FAMILIES.length} families — quantity, category, characteristic and workout activity — with unit family, aggregation style, value enums and iOS availability, read from Apple's documentation on ${HK_FETCHED_ON}.`,
    url,
    creator: orgRef(),
    license: "https://creativecommons.org/licenses/by/4.0/",
    isBasedOn: "https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier",
    dateModified: HK_FETCHED_ON,
    variableMeasured: ["identifier", "unit family", "aggregation style", "iOS availability"],
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

  const topUnits = Object.entries(
    QUANTITY.reduce<Record<string, number>>((acc, r) => {
      if (r.unitFamily) acc[r.unitFamily] = (acc[r.unitFamily] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "HealthKit identifiers", path: PATH }]} />
        <ClusterHero label="Reference" seed={11} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Every HealthKit type identifier
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {HK_IDENTIFIERS.length} identifiers across {HK_FAMILIES.length} families · read from Apple&rsquo;s
          documentation on {HK_FETCHED_ON}
        </p>

        <PageSummary path={PATH} name="Every HealthKit type identifier" updated={HK_FETCHED_ON}>
          {cumulative.length} of the {QUANTITY.length} quantity types are cumulative and{" "}
          {discrete.length} are discrete — the split that decides which HKStatisticsQuery option
          returns a correct number. Apple states it in prose, not as a property, so it cannot be read
          off the type at compile time.
        </PageSummary>

        <div id="answer" className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6">
          HealthKit names data with {HK_IDENTIFIERS.length} identifiers across four families —{" "}
          {QUANTITY.length} quantity types, {CATEGORY.length} category types,{" "}
          {HK_FAMILIES.find((f) => f.key === "characteristic")?.count} characteristics and{" "}
          {HK_FAMILIES.find((f) => f.key === "workoutActivity")?.count} workout activities. Apple
          documents each one on its own page, but never as a set —
          so the questions you actually hit when you build are the ones the reference cannot answer:
          which of these can I sum, what unit does this come back in, and does this exist on Android?
          This table answers all three at once. Every field is read from Apple&rsquo;s own
          documentation JSON; the two fields Apple states only in prose are marked as derived, and
          where Apple&rsquo;s wording does not state a value we leave it blank rather than guess.
        </div>

        <PageActions path={PATH} url={url} title="Every HealthKit type identifier" updated={HK_FETCHED_ON} markdown={false} />

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Four families, four sets of rules</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            HealthKit does not have one identifier type, it has four, and they behave differently
            enough that treating them alike is a common source of bugs. Only quantity types are
            numeric samples you can aggregate. Category types carry a value drawn from a fixed enum,
            and reading one without knowing which enum decodes it is meaningless — so that enum is a
            column here. Characteristics are read-only facts about the user that your app can never
            write. Workout activity types are labels for what a workout was, not data in their own
            right.
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {HK_FAMILIES.map((f) => (
              <div key={f.key} className="rounded-xl border border-[var(--border)] p-4">
                <dt className="font-mono text-sm font-semibold text-[var(--fg)]">{f.label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-[var(--fg)]">{f.count}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The one distinction that changes your query
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A quantity type is either <strong className="text-[var(--fg)]">cumulative</strong> — it
            accumulates over an interval, like {" "}
            <code className="font-mono text-sm">stepCount</code> or{" "}
            <code className="font-mono text-sm">activeEnergyBurned</code> — or{" "}
            <strong className="text-[var(--fg)]">discrete</strong>, a point-in-time reading like{" "}
            <code className="font-mono text-sm">heartRate</code> or{" "}
            <code className="font-mono text-sm">bodyMass</code>. Cumulative types are summed with{" "}
            <code className="font-mono text-sm">.cumulativeSum</code>. Discrete types are reduced with{" "}
            <code className="font-mono text-sm">.discreteAverage</code>,{" "}
            <code className="font-mono text-sm">.discreteMin</code> or{" "}
            <code className="font-mono text-sm">.discreteMax</code>.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Apply the wrong one and nothing throws. You get a number, it renders in your UI, and it is
            wrong — a summed heart rate for a week reads in the tens of thousands and looks like a bug
            in someone else&rsquo;s code. Apple states which is which inside each type&rsquo;s
            discussion prose rather than exposing it as a property, so the compiler cannot help you.
            That is why it is a column here.
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Cumulative", cumulative.length, "sum them"],
              ["Discrete", discrete.length, "average them"],
              ["Not stated", unstated.length, "check the docs"],
            ].map(([label, n, hint]) => (
              <div key={String(label)} className="rounded-xl border border-[var(--border)] p-4">
                <dt className="text-sm font-semibold text-[var(--fg)]">{label}</dt>
                <dd className="mt-1 text-3xl font-bold tabular-nums text-[var(--fg)]">{n}</dd>
                <dd className="mt-0.5 text-xs text-[var(--muted)]">{hint}</dd>
              </div>
            ))}
          </dl>
        </section>

        <HkIdentifierTable rows={rows} groups={HK_GROUPS} families={HK_FAMILIES} />

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the unit families tell you</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Apple names a unit family for {QUANTITY.filter((r) => r.unitFamily).length} of the{" "}
            {QUANTITY.length} quantity types — the only family that carries units at all. It matters because{" "}
            <code className="font-mono text-sm">HKQuantity</code> will happily convert between any two
            compatible units and throw only when they are incompatible — so a distance read in metres
            and rendered as miles is a silent bug, not a crash.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {topUnits.map(([unit, n]) => (
              <li key={unit} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)]">
                {unit} <span className="font-semibold tabular-nums text-[var(--fg)]">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        {undocumented.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              The types Apple ships undocumented
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              {undocumented.length} of these identifiers carry neither an abstract nor a discussion in
              Apple&rsquo;s reference as of {HK_FETCHED_ON}:{" "}
              {undocumented.map((r, i) => (
                <span key={r.case}>
                  <code className="font-mono text-sm text-[var(--fg)]">{r.case}</code>
                  {i < undocumented.length - 1 ? ", " : ""}
                </span>
              ))}
              . All were introduced in iOS 18. The identifiers compile and the types exist; what they
              contain and how Apple derives them is simply not stated. Treat anything you infer from
              observed values as unverified.
            </p>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Going cross-platform</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            An identifier existing on iOS says nothing about Android. Our{" "}
            <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
              HealthKit ↔ Health Connect reference
            </Link>{" "}
            maps the metrics we could verify on both platforms, including the ones that look
            equivalent and are not — Apple stores HRV as SDNN while Health Connect stores RMSSD, and
            those are different calculations that must not be normalised into one field.
          </p>
        </section>

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

        <ClusterCta
          pitch="We re-read Apple's documentation and re-publish this table when it changes. Subscribe and you'll hear when a type is added, deprecated, or finally documented."
          source="pillar-inline"
          id="cta-hk-identifiers"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Compiled by {site.name} from Apple&rsquo;s published documentation, read {HK_FETCHED_ON}.
          Apple&rsquo;s abstracts are quoted for identification; the analysis, the aggregation split
          and the cross-platform mapping are ours. Regenerate with{" "}
          <code className="font-mono text-xs">scripts/fetch-healthkit-identifiers.mjs</code>.
        </p>
      </div>
    </Container>
  );
}
