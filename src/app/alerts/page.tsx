import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import WatchForm from "@/components/WatchForm";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { API_ENTRIES, CATEGORY_LABELS } from "@/data/apis";
import { CHANGE_EVENTS } from "@/data/changes";

const PATH = "/alerts";
const UPDATED = "2026-08-22";

export const metadata: Metadata = {
  title: { absolute: "API change alerts — watch the APIs you depend on" },
  description:
    "Pick the fitness and health APIs your product depends on and get an email when a dated deprecation, deadline or terms change lands for one of them.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: "API change alerts",
    description:
      "Watch Fitbit, Garmin, Strava, HealthKit or any other API we track, and hear about dated changes when they land.",
    url: PATH,
  },
};

/**
 * The alerts product. It is the changes tracker turned into a subscription:
 * the tracker already records dated ecosystem events, graded confirmed vs
 * reported, each traced to a page here. This lets somebody say which
 * products they depend on and receive only the entries that name one.
 *
 * The promise is narrow on purpose. We do not promise "everything about
 * Fitbit" — we promise the entries the tracker gains, and the tracker only
 * gains what we could verify. That is a smaller promise than most alert
 * products make and it is one we can keep.
 */
export default function AlertsPage() {
  const url = absoluteUrl(PATH);
  const options = API_ENTRIES.map((a) => ({
    id: a.id,
    label: a.short,
    category: CATEGORY_LABELS[a.category],
  }));
  const tracked = CHANGE_EVENTS.length;
  const confirmed = CHANGE_EVENTS.filter((c) => c.status === "confirmed").length;

  const graph = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "API change alerts",
    description: String(metadata.description),
    isPartOf: { "@id": WEBSITE_ID },
    lastReviewed: UPDATED,
    reviewedBy: orgRef(),
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Change alerts", path: PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          Watch the APIs you depend on
        </h1>

        <AnswerCapsule>
          Deprecations arrive quietly. An API you integrated eighteen months ago announces a
          turndown on a developer blog you do not read, and you find out from a support
          ticket. Pick the products your app depends on and we will email you when the{" "}
          changes tracker gains a dated entry naming one of them — {tracked} entries so far,{" "}
          {confirmed} of them confirmed in a vendor&rsquo;s own words and the rest labelled
          reported. Nothing else: no sequence, no digest you did not ask for, no sharing your
          address.
        </AnswerCapsule>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            Everything we would send you is already public on the{" "}
            <Link href="/changes">changes tracker</Link> and in its{" "}
            <Link href="/digest">monthly digest</Link>; the alert is the part that reaches you
            without you checking. Each product also has a{" "}
            <Link href="/apis">directory entry</Link> stating how it bills you, what your users
            must own and what gates your launch.
          </p>
        </div>

        <div className="mt-10">
          <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading the list…</p>}>
            <WatchForm options={options} />
          </Suspense>
        </div>

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted)]">
          We store your email, first name and the list you picked, and nothing else — see the{" "}
          <Link href="/privacy" className="text-brand-600 hover:text-brand-500">
            privacy page
          </Link>
          . An alert is only as good as the tracker behind it: it covers what we verified, on
          the date we verified it, and it will miss anything a vendor announced somewhere we
          did not look. It is a second pair of eyes, not a compliance guarantee.
        </p>
      </div>
    </Container>
  );
}
