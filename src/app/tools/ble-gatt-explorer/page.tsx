import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import GattExplorer from "@/components/tools/GattExplorer";
import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { BT_COMMIT_SHORT, BT_FETCHED } from "@/data/btPages";
import { EXPLORER_LAYOUTS_PATH, explorerCharacteristics, explorerLayouts, explorerServices, layoutOf } from "@/lib/bleTools";
import { BLE_BROWSER_SUPPORT, WEB_BLUETOOTH_SERVICES_RULE } from "@/lib/bleBrowserSupport";
import { BYTE_ORDER_SOURCE, encode, toHex } from "@/lib/gattDecode.mjs";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * A Web Bluetooth GATT explorer for any device.
 *
 * The reader picks any device in the browser's chooser (acceptAllDevices);
 * the page asks for every service in this site's Bluetooth dataset as an
 * optional service, plus any UUID the reader types, lists the services and
 * characteristics with the SIG's names, and reads or subscribes on request.
 * Values decode against the SIG's gss structure where the dataset has one and
 * show as hex otherwise. The layouts are served from a static JSON file
 * (./layouts.json/route.ts) built from src/data/bluetoothGatt.ts, so the page
 * stays light. Nothing is written to the device.
 */

const PATH = "/tools/ble-gatt-explorer";
const UPDATED = "2026-11-05";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "BLE GATT Explorer: Read and Decode Any Device";
const DESCRIPTION =
  "Connect any Bluetooth LE device in the browser, list its services and characteristics by SIG name, read or subscribe, and decode values the SIG defines.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description: "Web Bluetooth GATT explorer: services and characteristics by Bluetooth SIG name, values decoded against the SIG's structures, raw hex otherwise.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const SERVICES = explorerServices();
const CHARACTERISTICS = explorerCharacteristics();
const LAYOUTS = explorerLayouts();
const DECODABLE = LAYOUTS.map((l) => ({ uuid: l.uuid, name: l.name }));
const FULL = LAYOUTS.filter((l) => !l.unsupported);
const PARTIAL = LAYOUTS.filter((l) => l.unsupported);
const NO_STRUCTURE = CHARACTERISTICS.filter((c) => !LAYOUTS.some((l) => l.uuid === c.uuid));
// The default value in the paste box: a synthetic RSC Measurement, built by
// the decoder's own encoder from the SIG's field names.
const RSC = layoutOf("0x2A53");
const DEFAULT_PASTE = {
  uuid: RSC.uuid,
  hex: toHex(encode(RSC, { "Instantaneous Speed": 768, "Instantaneous Cadence": 172, "Total Distance": 52340 })),
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-sm";

export default function BleGattExplorerPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "Web Bluetooth GATT explorer with Bluetooth SIG structure decoding",
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
            { name: "BLE GATT explorer", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={7} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          BLE GATT explorer: see what any Bluetooth device exposes
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          A web page can use a Bluetooth LE device&rsquo;s services only if it named them before connecting. The Web
          Bluetooth specification puts it plainly: <q>{WEB_BLUETOOTH_SERVICES_RULE.quote}</q> This explorer asks for
          all {SERVICES.length}{" "}services in this site&rsquo;s Bluetooth dataset (plus any UUID you add),
          connects to any device you pick, lists its characteristics by their Bluetooth SIG names, and reads or
          subscribes on request. {FULL.length}{" "}characteristics decode field by field against the SIG&rsquo;s published
          structures, {PARTIAL.length}{" "}more up to the first field the structures cannot describe, and everything else
          shows as raw hex.
        </p>

        <section data-tool="ble-gatt-explorer" aria-label="Web Bluetooth GATT explorer">
          <GattExplorer services={SERVICES} characteristics={CHARACTERISTICS} decodable={DECODABLE} layoutsUrl={EXPLORER_LAYOUTS_PATH} defaultPaste={DEFAULT_PASTE} />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The services it asks for</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Every service in this site&rsquo;s Bluetooth dataset (from the SIG&rsquo;s assigned numbers at commit{" "}
            {BT_COMMIT_SHORT}, read {BT_FETCHED}) and Battery, read from the SIG&rsquo;s file for the{" "}
            <Link href="/tools/heart-rate-lab" className={linkCls}>
              heart-rate lab
            </Link>
            . A service outside this list (a vendor&rsquo;s own 128-bit service, or another SIG service) is invisible to
            the page unless you type its UUID in the box before connecting. The rule quoted above is from the{" "}
            <a href={WEB_BLUETOOTH_SERVICES_RULE.url} className={linkCls} rel="noopener">
              Web Bluetooth specification, Device Discovery
            </a>
            , read {WEB_BLUETOOTH_SERVICES_RULE.readOn}.
          </p>
          <ul className="mt-4 grid gap-x-6 gap-y-1 text-sm text-[var(--muted)] sm:grid-cols-2" data-gatt-services={SERVICES.length}>
            {SERVICES.map((s) => (
              <li key={s.uuid}>
                <span className="font-mono text-xs">{s.uuid}</span> {s.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What it can decode</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The decoder compiles each characteristic&rsquo;s structure from the SIG&rsquo;s GATT Specification Supplement
            file: field order and sizes, the Flags bit each optional field depends on, struct members, value tables,
            units, and the <q>Represented values</q>{" "}line that sets each field&rsquo;s resolution. It reads multi-octet
            fields little-endian, as the{" "}
            <a href={BYTE_ORDER_SOURCE.url} className={linkCls} rel="noopener">
              Web Bluetooth specification&rsquo;s heart-rate example
            </a>{" "}
            does (<code className={code}>{BYTE_ORDER_SOURCE.quote}</code>). It stops, and shows the rest as hex, at a{" "}
            <code className={code}>medfloat16</code> or <code className={code}>medfloat32</code>{" "}field (their encoding is
            not in the SIG&rsquo;s YAML files), at a condition that is not a Flags bit, and at a field whose length the
            value does not state.
          </p>
          <div className="mt-4 space-y-4" data-gatt-decodable={LAYOUTS.length}>
            <div>
              <h3 className="font-semibold text-[var(--fg)]">Decoded field by field ({FULL.length})</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                {FULL.map((l, i) => (
                  <span key={l.uuid}>
                    {i ? ", " : ""}
                    <Link href={l.hasPage ? `/bluetooth-fitness/${l.slug}` : l.slug === "battery-level" ? "/tools/heart-rate-lab" : `/bluetooth-fitness#char-${l.slug}`} className={linkCls}>
                      {l.name}
                    </Link>{" "}
                    <span className="font-mono text-xs">{l.uuid}</span>
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg)]">Decoded up to a field it cannot read ({PARTIAL.length})</h3>
              <ul className="mt-1 space-y-1 text-sm text-[var(--muted)]">
                {PARTIAL.map((l) => (
                  <li key={l.uuid}>
                    <Link href={l.hasPage ? `/bluetooth-fitness/${l.slug}` : `/bluetooth-fitness#char-${l.slug}`} className={linkCls}>
                      {l.name}
                    </Link>{" "}
                    <span className="font-mono text-xs">{l.uuid}</span>: {l.unsupported}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg)]">Named, but hex only ({NO_STRUCTURE.length})</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                The SIG&rsquo;s repository has no gss structure for these at this commit:{" "}
                {NO_STRUCTURE.map((c) => `${c.name} (${c.uuid})`).join(", ")}.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Which browsers can connect</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">{BLE_BROWSER_SUPPORT.sentence}</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Source:{" "}
            <a href={BLE_BROWSER_SUPPORT.url} className={linkCls} rel="noopener">
              MDN browser-compat-data, <code className={code}>api/Bluetooth.json</code>
            </a>
            , read {BLE_BROWSER_SUPPORT.readOn}. The paste box works in any browser.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the explorer cannot tell you</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              What a vendor&rsquo;s own characteristics mean. Their bytes show as hex; nothing on this site documents a
              private protocol.
            </li>
            <li>
              Whether a device is standard-conforming. A characteristic that decodes cleanly matches the SIG&rsquo;s
              layout; it does not prove the values are right.
            </li>
            <li>
              Anything the browser withholds. A service the page did not name, or one the browser refuses to expose,
              does not appear in the list.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            For the common fitness devices there are focused labs: the{" "}
            <Link href="/tools/heart-rate-lab" className={linkCls}>
              heart-rate lab
            </Link>
            , the{" "}
            <Link href="/tools/ftms-lab" className={linkCls}>
              FTMS lab
            </Link>{" "}
            for treadmills, bikes and rowers, and the{" "}
            <Link href="/tools/cycling-power-lab" className={linkCls}>
              cycling power and cadence lab
            </Link>
            . Every characteristic is documented in the{" "}
            <Link href="/bluetooth-fitness" className={linkCls}>
              Bluetooth GATT reference
            </Link>
            ; building against them is covered in{" "}
            <Link href="/devices/web-bluetooth-fitness" className={linkCls}>
              Web Bluetooth for fitness apps
            </Link>{" "}
            and{" "}
            <Link href="/devices/testing-ble-fitness-devices" className={linkCls}>
              testing BLE fitness devices
            </Link>
            .
          </p>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Nothing leaves your device. The browser&rsquo;s chooser lists nearby devices; the page can reach only the
              one you pick and only the services it named. It reads a characteristic or turns on its notifications only
              when you press the button, and it never writes a value. The decoders load from{" "}
              <a href={EXPLORER_LAYOUTS_PATH} className={linkCls}>
                a static JSON file
              </a>{" "}
              built with the site; no device data is sent anywhere, and nothing is stored.
            </p>
            <p>
              The value in the paste box when the page loads is synthetic: an RSC Measurement built by the decoder&rsquo;s
              own encoder from the SIG&rsquo;s field names, not recorded from a device.
            </p>
            <p>
              The names and structures come from the Bluetooth SIG&rsquo;s public repository ({BT_GATT_SOURCE.repository}),
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
