import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getDevice, releasedDevices, DEVICES_PATH } from "@/data/devices";

const UPDATED = "2026-08-14";

export const metadata: Metadata = {
  title: "Connected Fitness Devices: BLE & FTMS",
  description:
    "Pair straps, machines, and watches with your app: the BLE heart rate profile, FTMS for treadmills and trainers, live watch data, and how to test it all.",
  alternates: { canonical: DEVICES_PATH },
  openGraph: {
    type: "website",
    title: "Connected Fitness Devices: BLE, FTMS & Watch Data",
    description:
      "The live-hardware layer of a fitness app: standard Bluetooth profiles for heart rate, machines, and cycling sensors — plus the watch as a sensor, and the testing story.",
    url: DEVICES_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Straps and sensors",
    blurb: "The standard GATT profiles that make one integration work across vendors.",
    slugs: ["bluetooth-heart-rate-monitor", "cycling-sensors-power-cadence"],
  },
  {
    title: "Machines: FTMS",
    blurb: "One Bluetooth service covers treadmills, bikes, rowers, and more — data in, and sometimes control out.",
    slugs: [
      "ftms-fitness-machine-service",
      "treadmill-app-integration",
      "indoor-bike-trainer-integration",
      "rowing-machine-data",
    ],
  },
  {
    title: "The watch as a sensor",
    blurb: "Live workout data from the wrist — a session on watchOS, a platform service on Wear OS.",
    slugs: ["apple-watch-live-heart-rate", "wear-os-health-services"],
  },
  {
    title: "Protocols, platforms, and proof",
    blurb: "Radio choices, browser reach, iOS specifics, and how to test hardware you cannot script.",
    slugs: ["ant-plus-vs-bluetooth", "web-bluetooth-fitness", "ios-ble-fitness-devices", "testing-ble-fitness-devices"],
  },
];

const FAQS = [
  {
    q: "Why do standard Bluetooth GATT profiles matter for a fitness app?",
    a: "Because they turn a per-vendor integration problem into a per-profile one. A heart-rate strap that implements the standard Heart Rate service looks the same to your app whether it costs twenty dollars or two hundred, and a treadmill that implements the Fitness Machine Service exposes the same characteristics as a rower from a different brand. You write the subscription flow once per profile — scan, connect, subscribe to notifications — and inherit every compliant device. The catch is that compliance varies at the edges, which is why this cluster treats capability discovery and per-model testing as first-class topics rather than afterthoughts.",
  },
  {
    q: "Should my app read live device data over Bluetooth or pull it from HealthKit and Health Connect?",
    a: "Both, for different jobs. The on-device health stores are records of what already happened — samples and summaries written after the fact — and they are the right source for history, trends, and data from apps you do not control. Live coaching needs a live source: a BLE subscription to a strap or machine, a workout session on watchOS, or Health Services on Wear OS. The practical architecture is a live path for the in-session experience and the store as the durable system of record, with deduplication rules so the same workout counted once.",
  },
  {
    q: "What changed with ANT+ and does it affect a new fitness app?",
    a: "Per widely-quoted announcements from the ANT+ organization — which we grade as reported, since we could not fetch the official page directly — the ANT+ membership and certification programs were discontinued at the end of June 2025, with device profiles and documentation reportedly remaining available and existing devices unaffected. For a new app in 2026 the practical reading is straightforward: Bluetooth Low Energy is the default radio for fitness sensors, phone-side BLE APIs are first-class on both platforms, and ANT+ matters mainly where an existing hardware ecosystem carries it. The deadline tracker follows this one as it evolves.",
  },
];

export default function DevicesPillar() {
  const url = absoluteUrl(DEVICES_PATH);
  const released = releasedDevices();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Connected Fitness Devices: BLE, FTMS & Watch Data",
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

  return (
    <Container className="py-14">
      <HubJsonLd basePath="/devices" description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Connected Devices", path: DEVICES_PATH }]} />

        <ClusterHero label="Connected Devices" seed={heroSeed(DEVICES_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Connected Fitness Devices
        </h1>

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          The live-hardware layer of a fitness app: heart-rate straps, treadmills, trainers, rowers,
          cycling sensors, and the watch itself, speaking the protocols they actually use. Most of it
          is standard Bluetooth — one Heart Rate profile covers straps from every vendor, and one
          Fitness Machine Service covers six categories of gym equipment — which means one
          well-built integration inherits an entire device ecosystem. This cluster documents the
          standard services and their verified identifiers, the platform layers on iOS, Android,
          watchOS, Wear OS, and the browser, where control features honestly get murky, and how to
          test hardware that CI cannot script.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            This cluster covers the live path. The stored path — history, trends, and everything
            after the workout — lives in <Link href="/integrate">Integration guides</Link> and{" "}
            <Link href="/architecture">Architecture</Link>; the camera as a sensor lives in{" "}
            <Link href="/motion">AI Motion</Link>. Spec identifiers here are verified against the
            Bluetooth SIG&rsquo;s published assigned numbers; wire formats belong to the specs
            themselves, which each page links by name.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getDevice(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${DEVICES_PATH}/${e!.slug}`}
                      className="flex h-full flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)]">{e!.h1}</span>
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
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Device ecosystems shift under apps — a protocol program winds down, a platform API supersedes a sensor call. Subscribe and hear about it with the source, before it breaks your pairing screen."
          source="pillar-inline"
          id="cta-devices"
        />
      </div>
    </Container>
  );
}
