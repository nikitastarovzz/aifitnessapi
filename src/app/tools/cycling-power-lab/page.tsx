import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import CyclingPowerLab from "@/components/tools/CyclingPowerLab";
import GattLayoutTable from "@/components/tools/GattLayoutTable";
import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED } from "@/data/btPages";
import {
  CYCLING_MEASUREMENT_UUIDS,
  CYCLING_READ_UUIDS,
  CYCLING_SERVICES,
  cyclingLayouts,
  cyclingReplay,
  cyclingSamplePairs,
  layoutOf,
} from "@/lib/bleTools";
import { BLE_BROWSER_SUPPORT } from "@/lib/bleBrowserSupport";
import { BYTE_ORDER_SOURCE, fmt, type GattLayout } from "@/lib/gattDecode.mjs";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * A Web Bluetooth lab for cycling power meters and speed/cadence sensors.
 *
 * Cycling Power Measurement (0x2A63) and CSC Measurement (0x2A5B) carry
 * cumulative revolution counts and the time of the last revolution event,
 * not cadence or speed. The lab decodes each notification against the
 * Bluetooth SIG's gss structure and derives cadence and speed from
 * consecutive pairs, with the counters' wraps and each structure's own
 * event-time tick. Paste mode takes two hex values; a synthetic ride replays
 * without hardware.
 *
 * Decoder: src/lib/gattDecode.mjs (tested by scripts/gatt-decode.test.mjs).
 * Layouts compiled here from src/data/bluetoothGatt.ts. Writes nothing.
 */

const PATH = "/tools/cycling-power-lab";
const UPDATED = "2026-11-05";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Cycling Power and Cadence Lab (0x2A63, CSC)";
const DESCRIPTION =
  "Decode Bluetooth Cycling Power (0x2A63) and CSC (0x2A5B) in the browser, and turn wheel and crank revolution counts into cadence and speed, live or pasted.";
const EXAMPLE_CIRCUMFERENCE_MM = 2100;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: "Connect a power meter or speed/cadence sensor and see cadence and speed computed from cumulative revolutions and event times, byte by byte.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const LAYOUTS = cyclingLayouts();
const PAIRS = cyclingSamplePairs();
const REPLAY = cyclingReplay(180, EXAMPLE_CIRCUMFERENCE_MM);
const CP = layoutOf("0x2A63");
const CSC = layoutOf("0x2A5B");

function revData(l: GattLayout, name: string) {
  const f = l.fields.find((x) => x.name === name);
  const revs = f?.children?.find((c) => /^Cumulative .* Revolutions$/.test(c.name));
  const time = f?.children?.find((c) => /^Last .* Event Time$/.test(c.name));
  if (!f?.presence || !revs || !time?.scale) throw new Error(`cycling-power-lab: ${l.name} ${name} lost its structure`);
  return { field: f, presence: f.presence, revs, time, scale: time.scale };
}
const CSC_WHEEL = revData(CSC, "Wheel Revolution Data");
const CSC_CRANK = revData(CSC, "Crank Revolution Data");
const CP_WHEEL = revData(CP, "Wheel Revolution Data");
const CP_CRANK = revData(CP, "Crank Revolution Data");
const tick = (f: number) => `1/${Math.round(1 / f)} s`;
const wrapSeconds = (bits: number, f: number) => fmt(Number((2 ** bits * f).toFixed(3)));
const bitsOf = (type: string) => Number(/(\d+)$/.exec(type)?.[1]);

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-sm";

export default function CyclingPowerLabPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "Web Bluetooth cycling power and speed/cadence decoder: cadence and speed from cumulative revolutions",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Cycling power lab", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={6} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Cycling power and cadence lab: from revolution counts to rpm
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Neither {CP.name} ({CP.uuid}) nor {CSC.name} ({CSC.uuid}) sends cadence or speed. Each sends a cumulative
          revolution count and the time of the last revolution event, so cadence is the change in crank revolutions
          divided by the change in event time between two notifications, and speed is the change in wheel revolutions
          times your wheel&rsquo;s circumference over the same interval. The Bluetooth SIG&rsquo;s structures give the
          tick: {tick(CSC_CRANK.scale.factor)}{" "}for both CSC event times, but {tick(CP_WHEEL.scale.factor)}{" "}for the
          Cycling Power wheel and {tick(CP_CRANK.scale.factor)}{" "}for its crank. This lab connects a power meter or
          speed/cadence sensor over Web Bluetooth and does that arithmetic in the open, or on two hex values you paste.
        </p>

        <section data-tool="cycling-power-lab" aria-label="Web Bluetooth cycling power and cadence lab">
          <CyclingPowerLab
            layouts={LAYOUTS}
            measurementUuids={CYCLING_MEASUREMENT_UUIDS}
            serviceUuids={CYCLING_SERVICES.map((s) => parseInt(s.uuid, 16))}
            pairs={PAIRS}
            replay={REPLAY}
            defaultCircumferenceMm={EXAMPLE_CIRCUMFERENCE_MM}
          />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The structures it decodes against</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Compiled from the Bluetooth SIG&rsquo;s GATT Specification Supplement files at commit {BT_COMMIT_SHORT}{" "}of
            the SIG&rsquo;s public repository (read {BT_FETCHED}), through this site&rsquo;s generated copy. The two
            measurements, then the characteristics the lab reads once after connecting:
          </p>
          <div className="mt-4 space-y-3">
            {[...CYCLING_MEASUREMENT_UUIDS, ...CYCLING_READ_UUIDS].map((u, i) => (
              <GattLayoutTable key={u} layout={LAYOUTS.find((l) => l.uuid === u)!} open={i < 2} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The arithmetic, step by step</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Find the struct.</strong> In CSC Measurement, Wheel Revolution Data is
              present when bit {CSC_WHEEL.presence.bit}{" "}of Flags is {CSC_WHEEL.presence.value}{" "}and Crank Revolution
              Data when bit {CSC_CRANK.presence.bit}{" "}is {CSC_CRANK.presence.value}. In Cycling Power Measurement they
              hang on bits {CP_WHEEL.presence.bit}{" "}and {CP_CRANK.presence.bit}{" "}of a two-octet Flags field, after
              Instantaneous Power, which is always there.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Difference two readings, with the wrap.</strong> {CSC_CRANK.revs.name}{" "}is
              a <code className={code}>{CSC_CRANK.revs.type}</code>{" "}and every event time a{" "}
              <code className={code}>{CSC_CRANK.time.type}</code>, so they roll over: a later reading smaller than the
              earlier one means the counter wrapped, and the step is the difference modulo 2<sup>{bitsOf(CSC_CRANK.time.type)}</sup>.
              At {tick(CSC_CRANK.scale.factor)}{" "}the event time wraps every {wrapSeconds(bitsOf(CSC_CRANK.time.type), CSC_CRANK.scale.factor)}{" "}s; the
              Cycling Power wheel&rsquo;s, at {tick(CP_WHEEL.scale.factor)}, every{" "}
              {wrapSeconds(bitsOf(CP_WHEEL.time.type), CP_WHEEL.scale.factor)} s. The synthetic ride wraps both.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Scale the time.</strong> CSC&rsquo;s wheel event time: <q>{CSC_WHEEL.scale.evidence}</q>, beside{" "}
              <q>{CSC_WHEEL.scale.unitIs}</q>. Cycling Power&rsquo;s: <q>{CP_WHEEL.scale.evidence}</q>, beside <q>{CP_WHEEL.scale.unitIs}</q>.
              The lab multiplies by M × 10<sup>d</sup> × 2<sup>b</sup>; a parser that assumes one tick for both reads
              Cycling Power wheel speed at half or double its value.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Divide.</strong> Cadence in rpm is Δcrank revolutions ÷ Δt × 60. Wheel
              speed is Δwheel revolutions × circumference ÷ Δt; the lab shows km/h (× 3.6 from m/s). The circumference is
              not in either characteristic, which is why the lab asks for it.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Treat an unchanged event time as no new event.</strong>{" "}Two
              notifications with the same event time mean no revolution finished between them (coasting, or a
              notification interval shorter than one revolution). The lab reports &ldquo;no new event&rdquo; and keeps
              the last cadence on screen labeled as such, rather than dividing by zero or showing 0 rpm.
            </li>
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where the decoder reads past the SIG&rsquo;s file</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Byte order.</strong> Little-endian, as the{" "}
              <a href={BYTE_ORDER_SOURCE.url} className={linkCls} rel="noopener">
                Web Bluetooth specification&rsquo;s heart-rate example
              </a>{" "}
              reads every multi-octet field (<code className={code}>{BYTE_ORDER_SOURCE.quote}</code>, read{" "}
              {BYTE_ORDER_SOURCE.fetchedOn}); the YAML gives sizes only.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Extreme Angles.</strong>{" "}Two 12-bit members packed into three octets.
              The SIG&rsquo;s file gives the example itself (Maximum Angle 0xABC and Minimum Angle 0x123 make 0x123ABC),
              and the test suite decodes exactly that example.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Control points.</strong> Cycling Power Control Point and SC Control
              Point have no member layout for their Parameter in the files this site reads, so the lab neither decodes
              nor writes them. It writes nothing to a sensor.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Which browsers can connect</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">{BLE_BROWSER_SUPPORT.sentence}</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Source:{" "}
            <a href={BLE_BROWSER_SUPPORT.url} className={linkCls} rel="noopener">
              MDN browser-compat-data, <code className={code}>api/Bluetooth.json</code>
            </a>
            , read {BLE_BROWSER_SUPPORT.readOn}. Elsewhere the paste boxes and the replay still work.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the lab cannot tell you</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>Accuracy. Nothing here compares a power meter or sensor with a reference.</li>
            <li>
              Which source to trust when a trainer, a power meter and a cadence sensor all report the same pedal stroke.
              The lab shows each characteristic separately and never merges them; picking one source per metric is
              covered in{" "}
              <Link href="/devices/cycling-sensors-power-cadence" className={linkCls}>
                reading cycling power, cadence and speed sensors
              </Link>
              .
            </li>
            <li>
              Smart-trainer data that arrives as FTMS Indoor Bike Data instead: that has its own{" "}
              <Link href="/tools/ftms-lab" className={linkCls}>
                FTMS lab
              </Link>
              , and the trainer side is in{" "}
              <Link href="/devices/indoor-bike-trainer-integration" className={linkCls}>
                indoor bike trainer integration
              </Link>
              .
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The radio choice is in{" "}
            <Link href="/devices/ant-plus-vs-bluetooth" className={linkCls}>
              ANT+ vs Bluetooth
            </Link>
            , CI without a sensor in{" "}
            <Link href="/devices/testing-ble-fitness-devices" className={linkCls}>
              testing BLE fitness devices
            </Link>
            , and any other characteristic in the{" "}
            <Link href="/tools/ble-gatt-explorer" className={linkCls}>
              BLE GATT explorer
            </Link>
            .
          </p>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Nothing leaves your device. The browser&rsquo;s own chooser lists devices advertising the Cycling Power or
              Cycling Speed and Cadence service; the page can reach only the one you pick and only those services. It
              subscribes to the two measurements, reads Cycling Power Feature, CSC Feature and Sensor Location once where
              present, and writes nothing. Values stay in this tab&rsquo;s memory; this site has no server code behind
              the page and stores nothing.
            </p>
            <p>
              The synthetic ride and the sample pairs are generated, not recorded from a sensor: the numbers are made
              up, encoded by the same module that decodes them, with a coasting stretch where the crank event time stops.
            </p>
            <p>
              The structures come from the Bluetooth SIG&rsquo;s public repository ({BT_GATT_SOURCE.repository}), read
              by this site&rsquo;s generator on {BT_FETCHED}. The SIG&rsquo;s text is quoted with attribution: Copyright ©
              Bluetooth SIG, Inc., which describes these files as proprietary to it. This site is not affiliated with
              Bluetooth SIG.
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
