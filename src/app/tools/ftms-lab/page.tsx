import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import FtmsLab from "@/components/tools/FtmsLab";
import GattLayoutTable from "@/components/tools/GattLayoutTable";
import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED } from "@/data/btPages";
import { FTMS_DATA_UUIDS, FTMS_RANGE_UUIDS, FTMS_RAW_UUIDS, FTMS_SERVICE, ftmsLayouts, ftmsReplays, ftmsSamples, layoutOf, scaleCheck } from "@/lib/bleTools";
import { BLE_BROWSER_SUPPORT } from "@/lib/bleBrowserSupport";
import { BYTE_ORDER_SOURCE } from "@/lib/gattDecode.mjs";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * A Web Bluetooth lab for the Fitness Machine Service (FTMS, 0x1826).
 *
 * Connect a treadmill, indoor bike, rower or cross trainer, and every value it
 * sends is decoded against the Bluetooth SIG's gss structure for that
 * characteristic: the Flags bits, which fields they make present, each
 * field's octets, unit and resolution. A paste box and synthetic replays make
 * it work with no machine and in browsers without Web Bluetooth.
 *
 * The decoder (src/lib/gattDecode.mjs, tested by scripts/gatt-decode.test.mjs)
 * knows no layout of its own: the layouts are compiled here, on the server,
 * from src/data/bluetoothGatt.ts and passed down as JSON. It writes nothing
 * to the machine.
 */

const PATH = "/tools/ftms-lab";
const UPDATED = "2026-11-05";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "FTMS Decoder: Treadmill, Bike, Rower Data";
const DESCRIPTION =
  "Decode Bluetooth FTMS Treadmill, Indoor Bike, Rower and Cross Trainer Data in the browser: each flag bit and field, live from a machine or from pasted hex.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: "Web Bluetooth FTMS lab: connect a treadmill, bike or rower and see each value decoded against the Bluetooth SIG structure, or paste hex bytes.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const LAYOUTS = ftmsLayouts();
const SAMPLES = ftmsSamples();
const REPLAYS = ftmsReplays();
const TREADMILL = layoutOf("0x2ACD");
const BIKE = layoutOf("0x2AD2");
function must<T>(v: T | null | undefined, what: string): T {
  if (v == null) throw new Error(`ftms-lab: the SIG structure no longer has ${what}, which this page explains`);
  return v;
}
const MORE_DATA = must(TREADMILL.fields[0].bits?.find((b) => b.bits.length === 1 && b.bits[0] === 0), "Treadmill Data Flags bit 0");
const SPEED_FIELD = must(TREADMILL.fields.find((f) => f.name === "Instantaneous Speed"), "Treadmill Instantaneous Speed");
const SPEED = { presence: must(SPEED_FIELD.presence, "a speed condition"), scale: must(SPEED_FIELD.scale, "a speed scale") };
const RESISTANCE = { scale: must(BIKE.fields.find((f) => f.name === "Resistance Level")?.scale, "Indoor Bike Resistance Level") };
const CADENCE = { scale: must(BIKE.fields.find((f) => f.name === "Instantaneous Cadence")?.scale, "Indoor Bike Instantaneous Cadence") };
const SCALES = scaleCheck();
const RESISTANCE_CONFLICTS = SCALES.conflicts.filter((c) => /Resistance Level|^Minimum Increment$/.test(c.name) && /^0x2A(CE|D1|D2|D6)$/.test(c.uuid)).length;
const rawNames =FTMS_RAW_UUIDS.map((u) => LAYOUTS.find((l) => l.uuid === u)!).map((l) => `${l.name} (${l.uuid})`);

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-sm";

export default function FtmsLabPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "Web Bluetooth Fitness Machine Service (FTMS) decoder with paste and replay modes",
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
            { name: "FTMS lab", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={5} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          FTMS lab: decode treadmill, bike and rower Bluetooth data
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          An FTMS machine data value is a Flags field followed only by the fields its bits announce, so the same
          characteristic arrives in different lengths and you cannot read it at fixed offsets. In Treadmill Data (
          {TREADMILL.uuid}), Instantaneous Speed is present when bit {SPEED.presence.bit} (&ldquo;{MORE_DATA.description}&rdquo;) is{" "}
          {SPEED.presence.value}, every other field when its own bit is 1, and the Bluetooth SIG&rsquo;s structure gives
          each field&rsquo;s size and resolution: speed in 1/100 km/h, Indoor Bike cadence in 1/2 rpm. This lab connects
          a treadmill, indoor bike, rower or cross trainer over Web Bluetooth and decodes every value against that
          structure, or decodes hex you paste, with no machine at all.
        </p>

        <section data-tool="ftms-lab" aria-label="Web Bluetooth FTMS lab">
          <FtmsLab layouts={LAYOUTS} dataUuids={FTMS_DATA_UUIDS} serviceUuid={parseInt(FTMS_SERVICE.uuid, 16)} samples={SAMPLES} replays={REPLAYS} />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The structures it decodes against</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Each table is the layout the lab compiled from the Bluetooth SIG&rsquo;s GATT Specification Supplement files
            at commit {BT_COMMIT_SHORT}{" "}of the SIG&rsquo;s public repository (read {BT_FETCHED}), through this
            site&rsquo;s generated copy. The machine data characteristics, then the Supported Range characteristics the
            lab reads once after connecting:
          </p>
          <div className="mt-4 space-y-3">
            {[...FTMS_DATA_UUIDS, ...FTMS_RANGE_UUIDS, ...FTMS_RAW_UUIDS].map((u, i) => (
              <GattLayoutTable key={u} layout={LAYOUTS.find((l) => l.uuid === u)!} open={i === 0} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How to read an FTMS value</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Flags first.</strong> Treadmill, Indoor Bike and Rower Data open with
              a two-octet Flags field (<code className={code}>boolean[16]</code>); Cross Trainer Data&rsquo;s is three
              octets (<code className={code}>boolean[24]</code>). Read it as a little-endian number.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Walk the fields in order.</strong>{" "}For each field, its &ldquo;Present
              if&rdquo; line names one bit and the value that makes it present. Present: read its size and move on.
              Absent: it takes no octets. Several fields can share one bit (Total Energy, Energy Per Hour and Energy Per
              Minute all hang on one), and bit 0 is the odd one out: <q>{SPEED.presence.evidence}</q>.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Scale each value.</strong> The SIG gives a{" "}
              <q>Represented values: M = …, d = …, b = …</q> line where the raw number is not the unit, and the lab
              multiplies by M × 10<sup>d</sup> × 2<sup>b</sup>. Instantaneous Speed: <q>{SPEED.scale.evidence}</q>, beside{" "}
              <q>{SPEED.scale.unitIs}</q>. Instantaneous Cadence: <q>{CADENCE.scale.evidence}</q>, beside <q>{CADENCE.scale.unitIs}</q>.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Merge across notifications.</strong>{" "}A machine with more to say than
              fits in one value can set bit 0 (&ldquo;{MORE_DATA.description}&rdquo;), which drops Instantaneous Speed
              from that value. The lab&rsquo;s &ldquo;Latest values&rdquo; panel keeps the newest reading of each field
              from whichever notification carried it; the treadmill replay sends such a split packet every fifth
              second.
            </li>
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where the decoder reads past the SIG&rsquo;s file</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Byte order.</strong> The YAML gives sizes, not byte order. The lab
              reads little-endian, as the{" "}
              <a href={BYTE_ORDER_SOURCE.url} className={linkCls} rel="noopener">
                Web Bluetooth specification&rsquo;s heart-rate example
              </a>{" "}
              does (<code className={code}>{BYTE_ORDER_SOURCE.quote}</code>, read {BYTE_ORDER_SOURCE.fetchedOn}).
            </li>
            <li>
              <strong className="text-[var(--fg)]">The scale formula.</strong> The files do not spell out how M, d and b
              combine. The lab uses M × 10<sup>d</sup> × 2<sup>b</sup>, and its test suite checks that product against
              every &ldquo;Unit is&rdquo; sentence in the dataset it can parse (b = −10 beside &ldquo;1/1024
              second&rdquo;, M = 5 and d = −3 beside &ldquo;0.005 kilogram&rdquo;, and so on): {SCALES.checked}{" "}lines,
              all agreeing except {SCALES.conflicts.length}.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Resistance Level.</strong> {RESISTANCE_CONFLICTS}{" "}of those{" "}
              {SCALES.conflicts.length}{" "}are FTMS resistance fields, where the SIG&rsquo;s own lines disagree:{" "}
              <q>{RESISTANCE.scale.evidence}</q> (a factor of{" "}
              {RESISTANCE.scale.factor}) sits beside <q>{RESISTANCE.scale.unitIs}</q>. The lab shows the value both ways
              and picks neither.
            </li>
            <li>
              <strong className="text-[var(--fg)]">No structure, no decoding.</strong>{" "}At this commit the SIG&rsquo;s
              repository has no gss file for {rawNames.join(", ")}. The lab shows their bytes as hex and does not decode
              them from memory. That is also why it has no control panel: setting a target speed or power means writing
              op codes to the Control Point, and the layout of those op codes is not in the files this site reads. The
              lab never writes to the machine.
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
            , read {BLE_BROWSER_SUPPORT.readOn}. Elsewhere the paste box and replays still work.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the lab cannot tell you</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>Accuracy. The bytes say what the machine reports, not whether its belt speed or power reading is right.</li>
            <li>
              Which fields a model supports before it sends them. Fitness Machine Feature declares that, and it is one
              of the characteristics shown raw here.
            </li>
            <li>
              Anything about a machine that does not advertise the Fitness Machine service: the browser&rsquo;s chooser
              only lists devices that do. For any other device, use the{" "}
              <Link href="/tools/ble-gatt-explorer" className={linkCls}>
                BLE GATT explorer
              </Link>
              .
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The integration side is in{" "}
            <Link href="/devices/ftms-fitness-machine-service" className={linkCls}>
              what FTMS is
            </Link>
            ,{" "}
            <Link href="/devices/treadmill-app-integration" className={linkCls}>
              treadmill app integration
            </Link>
            ,{" "}
            <Link href="/devices/indoor-bike-trainer-integration" className={linkCls}>
              indoor bike trainer integration
            </Link>{" "}
            and{" "}
            <Link href="/devices/rowing-machine-data" className={linkCls}>
              rowing machine data
            </Link>
            ; the radio question in{" "}
            <Link href="/devices/ant-plus-vs-bluetooth" className={linkCls}>
              ANT+ vs Bluetooth
            </Link>
            . Power meters and cadence sensors have their own{" "}
            <Link href="/tools/cycling-power-lab" className={linkCls}>
              cycling power and cadence lab
            </Link>
            .
          </p>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Nothing leaves your device. The browser shows its own device chooser, and the page can reach only the
              machine you pick and only its Fitness Machine service. It subscribes to the characteristics that notify
              (except the Control Point), reads the Supported Range and Feature characteristics once, and writes
              nothing. Values are decoded in this tab and held in memory until you close it; this site has no server
              code behind the page and stores nothing.
            </p>
            <p>
              The samples and replays are generated, not recorded from a machine: their numbers are made up, and they
              are built by the same module that decodes them, from the field names in the SIG&rsquo;s structure.
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
