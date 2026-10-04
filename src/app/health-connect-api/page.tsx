import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import HubFreshness from "@/components/HubFreshness";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import {
  getHealthConnectApi,
  releasedHealthConnectApi,
  HCAPI_PATH,
  HCAPI_CONFIG,
} from "@/data/healthConnectApi";

const UPDATED = "2026-10-04";

/** Every FAQ answer in this cluster, counted from the same data the
 *  /questions index is built from so the two can never disagree. */
const QUESTION_COUNT = releasedHealthConnectApi().reduce((n, e) => n + e.faqs.length, 0);

const TITLE = "Health Connect Jetpack API, Method by Method";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "readRecords paging, aggregate and bucketed aggregates, getChanges sync, clientRecordId upserts, deleteRecords and PermissionController, one page per call.",
  alternates: { canonical: HCAPI_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "How each HealthConnectClient method works and where it bites, from Google's Jetpack reference: reads, aggregates, changes, upserts, deletes, permissions.",
    url: HCAPI_PATH,
  },
};

/**
 * Hub reading order. Lists every planned slug; only released ones render
 * (getHealthConnectApi filters by RELEASED_HCAPI), so a group whose pages
 * have not shipped yet simply does not appear.
 */
const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Reading records",
    blurb:
      "Raw records one page at a time, and the permissions that decide how far back and when your app may read.",
    slugs: ["readrecords-pagination", "read-health-data-history", "read-health-data-in-background"],
  },
  {
    title: "Totals and buckets",
    blurb:
      "Let Health Connect compute the sum, average or extreme, once for a window or once per minute, hour, day or month.",
    slugs: ["aggregate-request", "aggregategroupbyduration-vs-period"],
  },
  {
    title: "Keeping up with changes",
    blurb: "What was inserted, updated or deleted since your last sync, using a changes token.",
    slugs: ["getchanges-incremental-sync"],
  },
  {
    title: "Writing and deleting",
    blurb:
      "Upserts keyed on your own ids, the metadata every write must carry, and removing what your app wrote.",
    slugs: ["insertrecords-clientrecordid-upsert", "metadata-recording-method", "deleterecords"],
  },
  {
    title: "Permissions and availability",
    blurb:
      "Requesting, checking and revoking access, the permission screens Google expects, and checking a feature exists before you call it.",
    slugs: [
      "permissioncontroller-request-permissions",
      "permission-ui-guidelines",
      "getfeaturestatus-feature-availability",
    ],
  },
  {
    title: "Exercise data",
    blurb: "GPS routes and the consent they need, and planned sessions for training plans.",
    slugs: ["exercise-route-consent", "planned-exercise-session-training-plans"],
  },
  {
    title: "Coming from HealthKit",
    blurb: "Which Health Connect call does the job of each HealthKit query.",
    slugs: ["healthkit-vs-health-connect-api-equivalents"],
  },
];

const FAQS = [
  {
    q: "Which HealthConnectClient method should I use to read health data?",
    a: "It depends on the shape of the answer you want. For the records themselves, use readRecords with a ReadRecordsRequest and follow its pageToken. For a total, average, minimum or maximum over one window, use aggregate with an AggregateRequest; Google's read guide says to use it instead of readRecords for cumulative types such as steps, to avoid double counting from multiple sources. For one value per bucket, use aggregateGroupByDuration for fixed lengths of time or aggregateGroupByPeriod for calendar days, weeks or months. To read only what changed since your last sync, including deletions, use getChangesToken and getChanges.",
  },
  {
    q: "Are Health Connect writes and deletes transactional?",
    a: "Per call, yes. Google's HealthConnectClient reference says insertion of multiple records is executed in a transaction, so if one fails none is inserted; updateRecords is described the same way, and both deleteRecords forms say that if one deletion fails, none is deleted. The transaction covers a single call, so if you split a large batch into several calls, an earlier call that succeeded stays committed when a later one fails.",
  },
  {
    q: "Which exceptions can HealthConnectClient methods throw?",
    a: "Google's reference lists RemoteException for IPC transport failures, SecurityException for requests with unpermitted access and IOException for disk I/O issues on the read, aggregate, insert, update and delete methods. Google's read guide adds IllegalStateException, thrown when the Health Connect service is not available or the request is not a valid construction, such as a period-bucketed aggregate given an Instant time range. Its paging sample also catches IllegalStateException as a quota error and backs off.",
  },
];

export default function HealthConnectApiPillar() {
  const released = releasedHealthConnectApi();
  // A hub with nothing behind it is a thin page and a promise we have not
  // kept. Until the cluster has released pages, this route does not exist.
  if (released.length === 0) notFound();
  const url = absoluteUrl(HCAPI_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
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
    mainEntity: FAQS.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath={HCAPI_PATH} description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Health Connect API", path: HCAPI_PATH }]} />

        <ClusterHero label="Health Connect API" seed={heroSeed(HCAPI_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Health Connect API
        </h1>

        <HubFreshness entries={released} basePath={HCAPI_PATH} />

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Health Connect&rsquo;s Jetpack client, HealthConnectClient, does its work through a
          small set of suspend functions: readRecords for raw records, aggregate and its two
          bucketed variants for totals, getChangesToken and getChanges for incremental sync,
          insertRecords, updateRecords and deleteRecords for writes, and PermissionController
          for access. Each page here covers one method or class: what Google&rsquo;s reference
          documents, a short Kotlin sketch built from documented signatures, and the traps that
          return a wrong answer without an error. Every claim comes from Google&rsquo;s own
          Android developer documentation, and where Google is silent the page says so.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            These pages explain how each call behaves. Setting Health Connect up (the dependency,
            manifest permissions, checking the SDK is available and the first permission request)
            is covered in the{" "}
            <Link href="/integrate/google-health-connect">Google Health Connect integration guide</Link>.
            Specific failures, such as{" "}
            <Link href="/fix/health-connect-no-data">a read that returns nothing</Link> or{" "}
            <Link href="/fix/health-connect-securityexception">a SecurityException</Link>, have
            their own troubleshooting pages. The record types themselves, with their fields and
            permission strings, are listed in the{" "}
            <Link href="/health-connect">Health Connect record reference</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getHealthConnectApi(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug} className="min-w-0">
                    <Link
                      href={`${HCAPI_PATH}/${e!.slug}`}
                      className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)] [overflow-wrap:anywhere]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e!.metaDescription}</span>
                      <EntryBadge updated={e!.updated} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/questions/health-connect-api" className="text-brand-600 hover:text-brand-500">
              All {QUESTION_COUNT} questions in {HCAPI_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Health Connect's Jetpack API changes between releases: Metadata factory methods in 1.1.0-alpha12, mandatory recording method and device type in 1.1.0-rc01, new attribution for on-device steps in June 2026. We track the changes that alter code you have already shipped."
          source="pillar-inline"
          id="cta-health-connect-api"
        />
      </div>
    </Container>
  );
}
