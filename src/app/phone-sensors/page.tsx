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
  getPhoneSensor,
  releasedPhoneSensors,
  SENSORS_PATH,
  SENSORS_CONFIG,
} from "@/data/phoneSensors";

const UPDATED = "2026-10-03";

/** Every FAQ answer in this cluster, counted from the same data the
 *  /questions index is built from so the two can never disagree. */
const QUESTION_COUNT = releasedPhoneSensors().reduce((n, e) => n + e.faqs.length, 0);

const TITLE = "Phone Motion Sensors for Fitness Apps";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "CMPedometer, CMMotionActivityManager, CMAltimeter, AirPods head motion, Android step sensors, activity transitions, the Recording API, health permissions.",
  alternates: { canonical: SENSORS_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Steps, activity, altitude and head motion from the phone a user already carries, one platform API per page, from Apple's and Google's own documentation.",
    url: SENSORS_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "iPhone, AirPods and Apple Watch: Core Motion",
    blurb:
      "Steps with a seven-day memory, walking versus driving, a barometer for climbs, head motion from headphones, and high-rate batches for a swing.",
    slugs: [
      "cmpedometer",
      "cmmotionactivitymanager",
      "cmaltimeter",
      "cmheadphonemotionmanager",
      "cmbatchedsensormanager",
    ],
  },
  {
    title: "Android: sensors and Play services",
    blurb:
      "A since-boot step odometer that stops when you unregister, activity transitions delivered to a PendingIntent, and an accountless ten-day step recorder.",
    slugs: [
      "android-step-counter-sensor",
      "android-activity-recognition-transition-api",
      "android-recording-api",
    ],
  },
  {
    title: "Android: the permission and background rules around them",
    blurb:
      "Keeping a workout alive with the screen off, and the Android 16 change that moved heart-rate access onto Health Connect's permissions.",
    slugs: ["foreground-service-type-health", "android-16-body-sensors-health-permissions"],
  },
];

/** The same job on both platforms. Each cell is a released slug in this cluster. */
const BOTH: { job: string; apple: string; android: string }[] = [
  { job: "Count steps", apple: "cmpedometer", android: "android-step-counter-sensor" },
  {
    job: "Know whether the user is walking, running, cycling or driving",
    apple: "cmmotionactivitymanager",
    android: "android-activity-recognition-transition-api",
  },
  { job: "Read recent step history", apple: "cmpedometer", android: "android-recording-api" },
];

const FAQS = [
  {
    q: "Which motion APIs can a fitness app use on a phone with no wearable paired?",
    a: "On iPhone, Core Motion offers CMPedometer for steps, distance, floors, pace and cadence; CMMotionActivityManager for walking, running, cycling, driving or stationary; CMAltimeter for relative altitude, plus absolute altitude on the devices Apple names; and CMHeadphoneMotionManager for head motion from motion-capable Apple headphones. On Android, the platform has the TYPE_STEP_COUNTER and TYPE_STEP_DETECTOR sensors, and Google Play services adds the Activity Recognition Transition API and the Recording API on mobile. Which of these should supply a product's daily step total is a different question, answered on the step counting API page.",
  },
  {
    q: "What permission gates phone motion data on iOS and on Android?",
    a: "On iOS it is the NSMotionUsageDescription key in Info.plist; Apple says apps that call CMPedometer, CMMotionActivityManager or CMAltimeter without it crash, and each class reports the user's choice through authorizationStatus(). On Android it is android.permission.ACTIVITY_RECOGNITION, a dangerous runtime permission since API level 29, which Google documents for the step counter and step detector sensors, the Recording API on mobile and Play services activity recognition. Heart-rate sensors are a separate family, moving from BODY_SENSORS to android.permission.health permissions for apps targeting Android 16.",
  },
  {
    q: "How much motion history does each phone platform keep for an app to read?",
    a: "Apple says CMPedometer and CMMotionActivityManager keep seven days. Android's step counter sensor keeps none: it is a running total since the last reboot that only counts while something is registered. Google's Recording API on mobile keeps up to 10 days since the latest subscription, and the data becomes inaccessible if you unsubscribe. Apple's CMAltimeter page lists no history query at all. Anything older than those windows has to be stored by your own app or read from HealthKit or Health Connect.",
  },
];

export default function PhoneSensorsPillar() {
  const released = releasedPhoneSensors();
  // A hub with nothing behind it is a thin page and a promise we have not
  // kept. Until the cluster has released pages, this route does not exist.
  if (released.length === 0) notFound();
  const url = absoluteUrl(SENSORS_PATH);

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

  const both = BOTH.map((row) => ({
    job: row.job,
    apple: getPhoneSensor(row.apple),
    android: getPhoneSensor(row.android),
  })).filter((row) => row.apple && row.android);

  return (
    <Container className="py-14">
      <HubJsonLd basePath={SENSORS_PATH} description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: SENSORS_CONFIG.hubLabel, path: SENSORS_PATH }]} />

        <ClusterHero label={SENSORS_CONFIG.hubLabel} seed={heroSeed(SENSORS_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Phone sensors
        </h1>

        <HubFreshness entries={released} basePath={SENSORS_PATH} />

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The phone a user already carries can count steps, tell walking from driving, measure a
          climb and, with AirPods in, follow their head, without a wearable. On iPhone that is Core
          Motion: CMPedometer, CMMotionActivityManager, CMAltimeter, CMHeadphoneMotionManager and
          CMBatchedSensorManager. On Android it is the step counter and step detector sensors, the
          Activity Recognition Transition API and the Recording API on mobile, wrapped in rules
          about runtime permissions and foreground services. Each page here covers one of those
          APIs by its exact name, with the documented limits that catch people out, such as
          Apple&rsquo;s seven-day history window and Android&rsquo;s since-reboot step total.
          Every claim comes from Apple&rsquo;s or Google&rsquo;s own documentation.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            These pages are API references with the traps written in, not a buying guide. Which
            source should give a product its step count across HealthKit, Health Connect and
            wearable clouds is answered on{" "}
            <Link href="/data/step-counting-api">the step counting API page</Link>. Tracking
            exercise with the camera instead of motion sensors is{" "}
            <Link href="/guides/track-workouts-without-wearables">
              tracking workouts without a wearable
            </Link>
            , and building the app that runs on the wrist is{" "}
            <Link href="/watch-apps">watch apps</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getPhoneSensor(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${SENSORS_PATH}/${e!.slug}`}
                      className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="break-words font-semibold text-[var(--fg)]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)]">{e!.metaDescription}</span>
                      <EntryBadge updated={e!.updated} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {both.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Same job, both platforms
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              The closest documented counterpart on each side. They are not equivalents: history
              windows, permissions and delivery differ, and each page says how.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                    <th className="py-2 pr-4 font-medium">Job</th>
                    <th className="py-2 pr-4 font-medium">Apple</th>
                    <th className="py-2 font-medium">Android</th>
                  </tr>
                </thead>
                <tbody>
                  {both.map((row) => (
                    <tr key={row.job} className="border-b border-[var(--border)] align-top">
                      <td className="py-3 pr-4 text-[var(--fg)]">{row.job}</td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`${SENSORS_PATH}/${row.apple!.slug}`}
                          className="break-words text-brand-600 hover:text-brand-500"
                        >
                          {row.apple!.primaryQuery}
                        </Link>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`${SENSORS_PATH}/${row.android!.slug}`}
                          className="break-words text-brand-600 hover:text-brand-500"
                        >
                          {row.android!.primaryQuery}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

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
            <Link href="/questions/phone-sensors" className="text-brand-600 hover:text-brand-500">
              All {QUESTION_COUNT} questions in {SENSORS_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Core Motion and Android's sensor and permission rules change with every OS release, and phone-sensor features break quietly when they do. We track the changes that alter what you have to build."
          source="pillar-inline"
          id="cta-phone-sensors"
        />
      </div>
    </Container>
  );
}
