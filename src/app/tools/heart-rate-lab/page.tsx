import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import HeartRateLab from "@/components/tools/HeartRateLab";
import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED, btById, sigFileUrl } from "@/data/btPages";
import {
  BATTERY_LEVEL,
  BYTE_ORDER_SOURCE,
  compileBodySensorLocation,
  compileHrmLayout,
} from "@/lib/hrMeasurement.mjs";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * A Web Bluetooth heart-rate lab.
 *
 * Connect a strap or a broadcasting watch, and every Heart Rate Measurement
 * notification is shown as bytes, each byte coloured by the field it belongs
 * to, with the flags decoded and a running answer to the one question the
 * bytes settle and a spec sheet does not: does this device send RR intervals,
 * which is the only thing HRV can be computed from.
 *
 * The decoder (src/lib/hrMeasurement.mjs, tested by
 * scripts/hr-measurement.test.mjs) knows no layout of its own. This server
 * component compiles the layout from the Bluetooth SIG's gss structure in
 * src/data/bluetoothGatt.ts and passes it down as JSON, so the 600 KB data
 * module never reaches the browser and a change in the SIG's file changes
 * the tool. Byte order and Battery Level, which that data does not carry,
 * are stated with their sources in the module.
 *
 * No server code, no storage: the tool works entirely in the tab.
 */

const PATH = "/tools/heart-rate-lab";
const UPDATED = "2026-10-31";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Bluetooth Heart-Rate Lab: Every Byte Decoded";
const DESCRIPTION =
  "Connect a BLE heart-rate strap in the browser: live BPM, every 0x2A37 byte decoded, and whether it sends the RR intervals HRV needs. Nothing is uploaded.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Web Bluetooth heart-rate lab: see each Heart Rate Measurement notification as bytes, decoded against the Bluetooth SIG structure, and find out if your strap sends RR intervals.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const HRM = btById("org.bluetooth.characteristic.heart_rate_measurement");
const BSL = btById("org.bluetooth.characteristic.body_sensor_location");
if (!HRM || !BSL) throw new Error("heart-rate-lab: 0x2A37 or 0x2A38 is missing from src/data/bluetoothGatt.ts");
const LAYOUT = compileHrmLayout(HRM);
const BSL_LAYOUT = compileBodySensorLocation(BSL);
const RR = LAYOUT.fields.find((f) => f.kind === "rr");
const ENERGY = LAYOUT.fields.find((f) => f.kind === "energy");
const RR_DEF = HRM.gss?.definitions.find((d) => d.name.toLowerCase() === RR?.name.toLowerCase());
const RR_FIRST = RR_DEF?.description?.split(/(?<=\.)\s+/)[0] ?? null;

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-sm";

export default function HeartRateLabPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "Web Bluetooth heart rate monitor and RR-interval decoder",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Heart-rate lab", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={4} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Bluetooth heart-rate lab: see every byte your strap sends
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Whether a Bluetooth heart-rate device can give you HRV is written in its bytes: each Heart Rate
          Measurement ({LAYOUT.uuid}) notification carries RR intervals only when bit {RR?.presence.bit}{" "}of its
          Flags octet is set, and without RR intervals there is no beat-to-beat timing to compute HRV from. This page
          connects a strap or a broadcasting watch over Web Bluetooth, decodes every notification against the
          Bluetooth SIG&rsquo;s published structure, and tells you which kind your device is. Browsers without Web
          Bluetooth can replay a synthetic stream instead. The bytes never leave the tab.
        </p>

        <section data-tool="heart-rate-lab" aria-label="Web Bluetooth heart-rate lab">
          <HeartRateLab layout={LAYOUT} bsl={BSL_LAYOUT} />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The structure it decodes against</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The decoder has no packet layout of its own. It reads the Bluetooth SIG&rsquo;s GATT Specification
            Supplement file for Heart Rate Measurement,{" "}
            <a href={sigFileUrl(LAYOUT.file)} className={linkCls} rel="noopener">
              <code className={code}>{LAYOUT.file}</code>
            </a>{" "}
            at commit {BT_COMMIT_SHORT}{" "}of the SIG&rsquo;s public repository (read {BT_FETCHED}), from this
            site&rsquo;s generated copy, and builds the decoder from it. Every field after Flags is conditional:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-3">Field</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Size</th>
                  <th className="py-2 pr-3">Condition</th>
                  <th className="py-2">Unit</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-t border-[var(--border)] align-top">
                  <td className="py-2 pr-3 text-[var(--fg)]">{LAYOUT.flagsName}</td>
                  <td className="py-2 pr-3 font-mono text-xs">boolean[8]</td>
                  <td className="py-2 pr-3">1</td>
                  <td className="py-2 pr-3">always</td>
                  <td className="py-2">—</td>
                </tr>
                {LAYOUT.fields.map((f) => (
                  <tr key={f.name} className="border-t border-[var(--border)] align-top">
                    <td className="py-2 pr-3 text-[var(--fg)]">{f.name}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{f.type}</td>
                    <td className="py-2 pr-3">{f.size}</td>
                    <td className="py-2 pr-3">{f.presence.evidence}</td>
                    <td className="py-2">{f.scale ? f.scale.label : (f.unit?.name ?? "—")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The Flags bits, as the SIG lists them:{" "}
            {LAYOUT.bits.map((b, i) => (
              <span key={b.label}>
                {i > 0 ? "; " : ""}bit {b.label}, <q>{b.description.split("\n")[0]}</q>
              </span>
            ))}
            . Bits {LAYOUT.contactSupportedBit}{" "}and {LAYOUT.contactDetectedBit}{" "}carry no field of their own: the
            lab reads them as &ldquo;contact not supported&rdquo; when bit {LAYOUT.contactSupportedBit}{" "}is clear,
            and otherwise as detected or not detected. The full page for the characteristic, with the SIG&rsquo;s
            notice, is{" "}
            <Link href="/bluetooth-fitness/heart-rate-measurement" className={linkCls}>
              Heart Rate Measurement (0x2A37)
            </Link>
            ; Body Sensor Location ({BSL_LAYOUT.uuid}), which the lab reads once after connecting, is on the{" "}
            <Link href="/bluetooth-fitness#char-body-sensor-location" className={linkCls}>
              Bluetooth GATT reference
            </Link>
            .
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Why RR intervals decide HRV</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            {RR_FIRST ? (
              <>
                The SIG defines the field plainly: <q>{RR_FIRST}</q>{" "}
              </>
            ) : null}
            {RR?.scale ? (
              <>
                and <q>{RR.scale.evidence}</q>{" "}
              </>
            ) : null}
            HRV is a statistic over exactly those beat-to-beat times. A heart-rate value is one number in beats
            per minute per notification; the timing of the individual beats is not in it, and no amount of processing
            on the app side puts it back. That is why the verdict above is a yes or a no: a
            device that never sets bit {RR?.presence.bit}{" "}gives you heart rate, and only heart rate.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            A notification can carry several RR values or none.{" "}
            {RR?.countRule ? (
              <>
                The SIG: <q>{RR.countRule}</q>{" "}
              </>
            ) : null}
            The lab therefore counts the octets left after the fields the flags announce, two per value, and reports
            an odd one left over instead of guessing at it.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The RMSSD the lab shows is the root mean square of successive differences between RR intervals, computed
            only within runs of notifications that all carried RR values. It is there so you can see the arithmetic
            work on your own data, labelled a demo, and it is not a medical or training measurement: there is no
            artefact or ectopic-beat correction, no minimum recording length and no baseline. What HRV is, and how the
            platforms store it, is covered in{" "}
            <Link href="/learn/what-is-hrv" className={linkCls}>
              what is HRV
            </Link>
            ,{" "}
            <Link href="/data/hrv-api" className={linkCls}>
              how to get HRV data from an API
            </Link>{" "}
            and Health Connect&rsquo;s{" "}
            <Link href="/health-connect/heart-rate-variability-rmssd-record" className={linkCls}>
              HeartRateVariabilityRmssdRecord
            </Link>
            .
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where the decoder reads past the SIG&rsquo;s file</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Byte order.</strong> The structure gives sizes, not byte order.
              The lab reads multi-octet fields little-endian, as the{" "}
              <a href={BYTE_ORDER_SOURCE.url} className={linkCls} rel="noopener">
                Web Bluetooth specification&rsquo;s heart-rate example
              </a>{" "}
              does (<code className={code}>{BYTE_ORDER_SOURCE.quote}</code>, read {BYTE_ORDER_SOURCE.fetchedOn}). The
              default value in the paste box, <code className={code}>1E 46 EE 02 7A 03 66 03</code>, decodes to that
              example&rsquo;s published result: 70 bpm, contact detected, Energy Expended 750, RR values 890 and 870.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Energy Expended&rsquo;s unit.</strong> The SIG&rsquo;s file gives{" "}
              <code className={code}>{ENERGY?.unit?.id ?? "no unit"}</code>
              {ENERGY?.unit?.name ? <> ({ENERGY.unit.name})</> : null}, and the lab shows that. The same Web Bluetooth
              example comments the value as <code className={code}>{BYTE_ORDER_SOURCE.energyComment.trim()}</code>.
              The two sources disagree by a factor of a thousand; we report the disagreement rather than pick one.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Battery Level ({`0x${BATTERY_LEVEL.uuid.toString(16).toUpperCase()}`}).</strong>{" "}
              Outside this site&rsquo;s Bluetooth dataset, so it was read on {BATTERY_LEVEL.fetchedOn}{" "}from the
              SIG&rsquo;s own{" "}
              <a href={sigFileUrl(BATTERY_LEVEL.file)} className={linkCls} rel="noopener">
                <code className={code}>{BATTERY_LEVEL.file}</code>
              </a>{" "}
              at the same commit: one <code className={code}>{BATTERY_LEVEL.type}</code>, <q>{BATTERY_LEVEL.lines[1]}</q>{" "}
              The lab asks for the Battery service (0x{BATTERY_LEVEL.serviceUuid.toString(16).toUpperCase()}) as an
              optional service and says so when a device does not expose it.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the lab cannot tell you</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              Whether the RR values are measured. The bytes say a device sent values in the RR field, not how it got
              them; the lab shows how many distinct values arrived so a suspiciously uniform stream is visible, and
              leaves the judgement to you.
            </li>
            <li>
              Accuracy. Nothing here compares a device with a reference; we publish no accuracy figure for any strap
              or watch.
            </li>
            <li>
              Anything in a browser without Web Bluetooth. The page detects the API and, where it is missing, offers
              the synthetic replay and the paste box. Which browsers ship it is set out in{" "}
              <Link href="/devices/web-bluetooth-fitness" className={linkCls}>
                Web Bluetooth for fitness devices
              </Link>
              . Real Bluetooth cannot be exercised in an automated test either, which is why the decoder is tested
              on synthetic packets built from the SIG structure (all 32 combinations of the five defined Flags bits).
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Building this into an app is the subject of{" "}
            <Link href="/devices/bluetooth-heart-rate-monitor" className={linkCls}>
              connecting a Bluetooth heart rate monitor
            </Link>
            , with the radio choice in{" "}
            <Link href="/devices/ant-plus-vs-bluetooth" className={linkCls}>
              ANT+ vs Bluetooth
            </Link>
            , the watch case in{" "}
            <Link href="/devices/apple-watch-live-heart-rate" className={linkCls}>
              Apple Watch live heart rate
            </Link>
            , and CI without a strap in{" "}
            <Link href="/devices/testing-ble-fitness-devices" className={linkCls}>
              testing BLE fitness devices
            </Link>
            . Every characteristic the SIG defines for fitness devices is in the{" "}
            <Link href="/bluetooth-fitness" className={linkCls}>
              Bluetooth GATT reference
            </Link>
            .
          </p>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Nothing leaves your device. The browser shows its own device chooser; the page can talk only to the
              device you pick, and only to the Heart Rate service and, if present, the Battery service. Notifications
              are decoded in this tab and held in memory until you close it. This site has no server code behind the
              page, stores nothing, and logs no event from it beyond its ordinary page view. The CSV and the share
              card are made in the tab and go wherever you paste or save them, and nowhere else.
            </p>
            <p>
              The synthetic replay is generated by the page, not recorded from a device: its heart rate and RR values
              are made up, and it switches between the uint8 and uint16 heart-rate formats, the three contact states,
              Energy Expended and a stretch with no RR intervals so that every part of the decoder runs.
            </p>
            <p>
              The structure comes from the Bluetooth SIG&rsquo;s public repository ({BT_GATT_SOURCE.repository}),
              read by this site&rsquo;s generator on {BT_FETCHED}. The SIG&rsquo;s text is quoted with attribution:
              Copyright © Bluetooth SIG, Inc., which describes these files as proprietary to it. This site is not
              affiliated with Bluetooth SIG.
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
