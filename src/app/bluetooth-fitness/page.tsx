import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import { BT_GATT_SOURCE, BT_GATT_TERMS, BT_GATT_TOTALS, BT_SERVICES } from "@/data/bluetoothGatt";
import {
  ANDROID_BLE_OVERVIEW,
  BT_ALL,
  BT_BASE,
  BT_COMMIT_SHORT,
  BT_FETCHED,
  BT_HUB_H1,
  BT_HUB_TITLE,
  BT_PAGES,
  BT_SCOPE_DEVICES,
  btById,
  btFaqGraph,
  btGraph,
  btHubAnchor,
  btHubDescription,
  btHubFaqs,
  btOptionalStats,
  btPath,
  btTotals,
  listOf,
  presenceText,
  sigCommitUrl,
  sigFileUrl,
} from "@/data/btPages";
import { releasedDevices } from "@/data/devices";
import { absoluteUrl, site } from "@/lib/site";
import { Code, Definition, GssText, LINK, TH } from "./_render";

/**
 * The hub of the Bluetooth GATT reference: the in-scope services with their
 * UUIDs, every in-scope characteristic in UUID order (a page link where it
 * passes the thin-page rule, the structure inline where it does not), how a
 * Flags field makes fields optional — told from the SIG's own lines — and the
 * source and its notice.
 *
 * Generated from src/data/bluetoothGatt.ts (scripts/fetch-bluetooth-gatt.mjs);
 * every number is computed from the data. Characteristics are not grouped
 * under services, because the SIG's files do not say which a service
 * contains outside the permitted-characteristics lists.
 *
 * No markdown mirror exists for this section, so no text/markdown alternate.
 */

const TITLE = BT_HUB_TITLE;
const DESCRIPTION = btHubDescription();
const T = btTotals();
const O = btOptionalStats();
const FAQS = btHubFaqs();
const HRM = btById("org.bluetooth.characteristic.heart_rate_measurement");
const HRM_FLAGS = HRM?.gss?.definitions.find((d) => d.kind === "bits" && d.name === "Flags") ?? null;
const ON_ZERO = BT_ALL.flatMap((c) => (c.gss?.structure ?? []).filter((f) => f.presence?.value === 0).map((f) => ({ c, f })));
const NONE = BT_ALL.filter((c) => !c.gss);
const UDS = BT_SERVICES.find((s) => s.id === "org.bluetooth.service.user_data");
/** HRM's two heart-rate values, when the file still ties them to the two values of bit 0. */
const HRM_BIT0 = (HRM?.gss?.structure ?? []).filter((f) => f.presence?.bit === 0 && f.presence.field === "Flags");
const HRM_PAIR = HRM_BIT0.length === 2 && HRM_BIT0[0].presence!.value !== HRM_BIT0[1].presence!.value ? HRM_BIT0 : null;
/** The SIG's own words for "sizes are octets", where the file still says them. */
const OCTETS_QUOTE =
  /are concatenated into a uint24 value \(3 octets\)/.exec(
    btById("org.bluetooth.characteristic.cycling_power_measurement")?.gss?.definitions.find((d) => d.name === "Extreme Angles")?.description ?? "",
  )?.[0] ?? null;
/** One unit id the gss text writes that units.yaml does not have, as an example. */
const UNKNOWN_UNIT = BT_ALL.flatMap((c) => c.gss?.structure ?? []).flatMap((f) => f.units).find((u) => !u.name)?.id ?? null;
const DEVICE_GUIDES = releasedDevices().filter((e) =>
  ["bluetooth-heart-rate-monitor", "cycling-sensors-power-cadence", "ftms-fitness-machine-service", "web-bluetooth-fitness", "ios-ble-fitness-devices", "testing-ble-fitness-devices"].includes(e.slug),
);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: BT_BASE },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: BT_BASE },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function BluetoothFitnessHub() {
  const url = absoluteUrl(BT_BASE);
  const terms = BT_GATT_TERMS.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim());

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            btGraph({
              path: BT_BASE,
              title: TITLE,
              headline: BT_HUB_H1,
              description: DESCRIPTION,
              pageType: "CollectionPage",
              parts: BT_PAGES.map((c) => ({ name: `${c.name} (${c.uuid})`, path: btPath(c) })),
              citations: [
                { name: `Bluetooth SIG — ${BT_GATT_SOURCE.files.serviceUuids}`, url: sigFileUrl(BT_GATT_SOURCE.files.serviceUuids) },
                { name: `Bluetooth SIG — ${BT_GATT_SOURCE.files.characteristicUuids}`, url: sigFileUrl(BT_GATT_SOURCE.files.characteristicUuids) },
                { name: `Google — ${ANDROID_BLE_OVERVIEW.title}`, url: ANDROID_BLE_OVERVIEW.url },
              ],
            }),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(btFaqGraph(BT_BASE, FAQS)) }} />

      <div className="mx-auto max-w-5xl" data-bt-hub>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Connected Devices", path: "/devices" },
            { name: "Bluetooth GATT reference", path: BT_BASE },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{BT_HUB_H1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {T.characteristics} characteristics · {T.pages} byte-layout pages · {T.services} services · read from the
          Bluetooth SIG’s repository on {BT_FETCHED}
          <ContentAge date={BT_FETCHED} /> · commit{" "}
          <a href={sigCommitUrl} rel="nofollow" className={LINK}>
            {BT_COMMIT_SHORT}
          </a>{" "}
          ({BT_GATT_SOURCE.commitDate})
        </p>

        <p id="answer" className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6">
          The Bluetooth SIG publishes GATT characteristic structures as YAML files in its public repository —{" "}
          {BT_GATT_TOTALS.gssFiles} files alongside the {BT_GATT_TOTALS.characteristicUuids} characteristic UUIDs it
          lists. This reference reads that repository for {T.characteristics} characteristics chosen for fitness and health
          devices: {T.withStructure} have a published structure, the {T.pages} with at least two fields or a flags field
          get a page laying out every field’s type and size, its offset where every earlier size is fixed, and its unit
          and the Flags bit that makes it present where the SIG’s text states them, and {T.withoutStructure} have no
          structure file at all. The SIG’s files tie characteristics to a service only in
          permitted-characteristics lists, which here means the {UDS?.permittedCharacteristics?.length ?? 0} User Data
          characteristics.
        </p>

        <PageActions path={BT_BASE} url={url} title={TITLE} updated={BT_FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          This is the wire-format companion to the{" "}
          <Link href="/devices" className={LINK}>
            connected-devices guides
          </Link>
          , which cover pairing, subscribing and testing:{" "}
          {DEVICE_GUIDES.map((e, i) => (
            <span key={e.slug}>
              {i > 0 ? (i === DEVICE_GUIDES.length - 1 ? " and " : ", ") : ""}
              <Link href={`/devices/${e.slug}`} className={LINK}>
                {e.h1.replace(/\s*\(\d{4}\)$/, "")}
              </Link>
            </span>
          ))}
          .
        </p>

        <section id="gatt" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What a GATT service and characteristic are</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Google’s Android documentation (“{ANDROID_BLE_OVERVIEW.title}”, last updated {ANDROID_BLE_OVERVIEW.updated},
            read {ANDROID_BLE_OVERVIEW.read}) defines the terms this way:
          </p>
          <dl className="mt-4 space-y-3">
            {ANDROID_BLE_OVERVIEW.terms.map((t) => (
              <div key={t.term} className="rounded-xl border border-[var(--border)] p-4">
                <dt className="font-semibold text-[var(--fg)]">{t.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[var(--muted)]">“{t.text}”</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            Source:{" "}
            <a href={ANDROID_BLE_OVERVIEW.url} rel="nofollow" className={LINK}>
              developer.android.com
            </a>
            . The Bluetooth SIG’s repository keeps the two kinds of identifier in separate lists —{" "}
            {BT_GATT_TOTALS.serviceUuids} service UUIDs in <Code>{BT_GATT_SOURCE.files.serviceUuids}</Code> and{" "}
            {BT_GATT_TOTALS.characteristicUuids} characteristic UUIDs in <Code>{BT_GATT_SOURCE.files.characteristicUuids}</Code>{" "}
            — and publishes GATT Specification Supplement files, one per characteristic it describes:{" "}
            {BT_GATT_TOTALS.gssFiles} of them in <Code>{BT_GATT_SOURCE.files.gssFolder}</Code>, each listing the fields of
            that characteristic’s value. Those files are what the pages here are built from.
          </p>
        </section>

        <section id="services" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The services in scope ({BT_SERVICES.length})</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            Chosen for {BT_SCOPE_DEVICES}, plus User Data. Names and UUIDs as{" "}
            <Code>{BT_GATT_SOURCE.files.serviceUuids}</Code> lists them. Only a permitted-characteristics file says which
            characteristics belong to a service, and only User Data has one among these.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>UUID</th>
                  <th scope="col" className={TH}>Service</th>
                  <th scope="col" className={TH}>Identifier</th>
                  <th scope="col" className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Characteristics the SIG lists for it
                  </th>
                </tr>
              </thead>
              <tbody>
                {BT_SERVICES.map((s) => (
                  <tr key={s.id} id={`service-${s.id.replace("org.bluetooth.service.", "").replace(/_/g, "-")}`} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4 font-mono text-xs font-semibold text-[var(--fg)]">{s.uuid}</td>
                    <td className="py-2 pr-4 text-[var(--fg)]">{s.name}</td>
                    <td className="py-2 pr-4">
                      <code className="break-all font-mono text-[12px] text-[var(--muted)]">{s.id}</code>
                    </td>
                    <td className="py-2 text-xs text-[var(--muted)]">
                      {s.permittedCharacteristics ? (
                        <>
                          {s.permittedCharacteristics.length}, in{" "}
                          <a href={sigFileUrl(s.permittedSource!)} rel="nofollow" className={LINK}>
                            {s.permittedSource!.split("/").at(-1)}
                          </a>{" "}
                          (marked below)
                        </>
                      ) : (
                        "Not listed in the repository"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="characteristics" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Every characteristic in scope ({BT_ALL.length})</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            In UUID order, the order of <Code>{BT_GATT_SOURCE.files.characteristicUuids}</Code>. A name links to its
            byte-layout page where the structure has at least two fields or a flags field; a structure with one field
            opens in place. The last column shows a service only where a permitted-characteristics file names one.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm" data-bt-characteristics>
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>UUID</th>
                  <th scope="col" className={TH}>Characteristic</th>
                  <th scope="col" className={TH}>Structure</th>
                  <th scope="col" className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    Service per the SIG’s lists
                  </th>
                </tr>
              </thead>
              <tbody>
                {BT_ALL.map((c) => {
                  const n = c.gss?.structure.length ?? 0;
                  const prefix = `${c.slug}--`;
                  return (
                    <tr key={c.id} id={btHubAnchor(c)} data-bt-row={c.id} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4 font-mono text-xs font-semibold text-[var(--fg)]">{c.uuid}</td>
                      <td className="py-2 pr-4">
                        {c.hasPage ? (
                          <Link href={btPath(c)} className={LINK}>
                            {c.name}
                          </Link>
                        ) : (
                          <span className="text-[var(--fg)]">{c.name}</span>
                        )}
                        <code className="mt-0.5 block break-all font-mono text-[11px] text-[var(--muted)]">{c.id}</code>
                        {!c.hasPage && c.gss && (
                          <details className="mt-2 text-xs text-[var(--muted)]">
                            <summary className="cursor-pointer font-medium text-brand-600 hover:text-brand-500">Structure</summary>
                            <p className="mt-2">
                              <GssText text={c.gss.description} self={c} idPrefix={prefix} />
                            </p>
                            {c.gss.structure.map((f) => (
                              <div key={f.anchor} className="mt-2 rounded-lg border border-[var(--border)] p-3" data-bt-field={f.name}>
                                <p className="font-semibold text-[var(--fg)]">
                                  {f.name} <span className="font-mono font-normal">{f.type} · {f.size}</span>
                                </p>
                                <p className="mt-1">Present when: {presenceText(f)}</p>
                                {f.units.map((u) => (
                                  <p key={u.id} className="mt-1">
                                    Unit: {u.name ?? "not an id in units.yaml"} <span className="break-all font-mono">{u.id}</span>
                                  </p>
                                ))}
                                {f.description && (
                                  <p className="mt-1">
                                    <GssText text={f.description} self={c} idPrefix={prefix} />
                                  </p>
                                )}
                              </div>
                            ))}
                            {c.gss.definitions.map((d) => (
                              <Definition key={d.anchor} c={c} def={d} idPrefix={prefix} compact />
                            ))}
                            <p className="mt-2">
                              Source:{" "}
                              <a href={sigFileUrl(c.gss.file)} rel="nofollow" className={LINK}>
                                {c.gss.file}
                              </a>
                            </p>
                          </details>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">
                        {c.gss ? (
                          <>
                            {n} {n === 1 ? "field" : "fields"}
                            {c.gss.flagsFields.length ? " · Flags" : ""}
                          </>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400">No gss file</span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-[var(--muted)]">
                        {c.services.length ? c.services.map((s) => `${s.name} (${s.uuid})`).join(", ") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {HRM?.gss && HRM_FLAGS && (
          <section id="flags" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How a Flags field makes fields optional</h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              In the SIG’s files a field that is not always there is published with a size such as “0 or 2” and a line
              that says when it is present. Heart Rate Measurement ({HRM.uuid}) shows the pattern. Its first field is{" "}
              {HRM.gss.structure[0].name}, a <Code>{HRM.gss.structure[0].type}</Code> of size {HRM.gss.structure[0].size},
              whose bits the file defines (“{HRM_FLAGS.description ?? ""}”), and each later field states its own condition:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className={TH}>Field</th>
                    <th scope="col" className={TH}>Size</th>
                    <th scope="col" className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">The SIG’s line</th>
                  </tr>
                </thead>
                <tbody>
                  {HRM.gss.structure.map((f) => (
                    <tr key={f.anchor} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4 text-[var(--fg)]">{f.name}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{f.size}</td>
                      <td className="py-2 font-mono text-xs text-[var(--muted)]">{f.presenceText ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">Bit 0 of that Flags field is defined in the file as:</p>
            <blockquote className="mt-2 border-l-4 border-brand-400/60 pl-4 font-mono text-xs leading-relaxed text-[var(--fg)]">
              <GssText text={HRM_FLAGS.rows.find((r) => r.bit === "0")?.description ?? ""} self={HRM} />
            </blockquote>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              {HRM_PAIR
                ? `So ${HRM_PAIR[0].name} is present when bit 0 is ${HRM_PAIR[0].presence!.value}, and ${HRM_PAIR[1].name} when it is ${HRM_PAIR[1].presence!.value}.`
                : ""}{" "}
              The same shape runs through the scope: of the{" "}
              {O.fields} structure fields, {O.optional} have a “0 or N” size and {O.optionalWithCondition} of those carry a
              “Present if bit N of … field is set to …” line. {O.conditionOnZero} of the conditions are met by a bit that is
              0 rather than 1, among them{" "}
              {listOf(
                ON_ZERO.slice(0, 4).map(({ c, f }) => `${c.name}’s ${f.name}`),
              )}
              {ON_ZERO.length > 4 ? ` and ${ON_ZERO.length - 4} more` : ""}. Because any of these may be absent, a field’s
              position depends on the fields before it, which is why the layout tables print an offset only where every
              earlier field has a fixed size.
            </p>
          </section>
        )}

        <section id="missing" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">In scope, with no structure in the repository ({NONE.length})</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            These have a UUID in <Code>{BT_GATT_SOURCE.files.characteristicUuids}</Code> but no file in{" "}
            <Code>{BT_GATT_SOURCE.files.gssFolder}</Code> at commit {BT_COMMIT_SHORT}, so this reference prints no byte
            layout for them:
          </p>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {NONE.map((c) => (
              <li key={c.id}>
                <a href={`#${btHubAnchor(c)}`} className={LINK}>
                  {c.name}
                </a>{" "}
                <span className="font-mono text-xs text-[var(--muted)]">{c.uuid}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="conventions" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Reading these pages</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">
            <li>
              Names, types, sizes and text are copied from the SIG’s files. Sizes count octets, except in a struct the file
              marks as sized in bits
              {OCTETS_QUOTE
                ? `: Cycling Power Measurement’s Extreme Angles, whose two 12-bit values, its text says, “${OCTETS_QUOTE}”.`
                : "."}
            </li>
            <li>
              An offset is a sum of the sizes before a field and is printed only where all of them are plain numbers.
              “Present when” is the field’s own “Present if bit N of … field is set to …” line, parsed; any other wording is
              shown as written.
            </li>
            <li>
              A unit is every <Code>org.bluetooth.unit…</Code> id in a field’s text, named from{" "}
              <Code>{BT_GATT_SOURCE.files.units}</Code> where that file has exactly that id. Where it does not
              {UNKNOWN_UNIT ? (
                <>
                  {" "}
                  (the text writes <Code>{UNKNOWN_UNIT}</Code>, for instance)
                </>
              ) : null}
              , the id is shown as written and flagged.
            </li>
            <li>
              Cross-references in the SIG’s text become links where they point at a characteristic or definition here. One
              to a section the YAML files do not include is shown as “§ label”, and a bibliography key as “[key]”.
            </li>
            <li>
              The {T.characteristics} were chosen by this site: {BT_ALL.filter((c) => c.scopeReason === "device").length}{" "}
              for the device categories above, the {BT_ALL.filter((c) => c.scopeReason === "user-data").length} on the SIG’s
              User Data list, and the {BT_ALL.filter((c) => c.scopeReason === "referenced").length} those structures refer
              to. The list is in <Code>scripts/fetch-bluetooth-gatt.mjs</Code>.
            </li>
          </ul>
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <div className="mt-5 space-y-5">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 rounded-xl border border-[var(--border)] p-5">
                <h3 className="font-bold text-[var(--fg)]">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="terms" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Source and terms</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Read on {BT_FETCHED} from the Bluetooth SIG’s public repository,{" "}
            <a href={BT_GATT_SOURCE.repository} rel="nofollow" className={LINK}>
              bitbucket.org/bluetooth-SIG/public
            </a>{" "}
            (“{BT_GATT_SOURCE.description}”), branch {BT_GATT_SOURCE.branch} at commit{" "}
            <a href={sigCommitUrl} rel="nofollow" className={LINK}>
              {BT_COMMIT_SHORT}
            </a>
            , committed {BT_GATT_SOURCE.commitDate}, as one archive of that commit, by{" "}
            <Code>scripts/fetch-bluetooth-gatt.mjs</Code>. {BT_GATT_TOTALS.filesRead} files were read. The repository has no
            README or licence file; every one of those files opens with the same notice, reproduced below. The SIG’s text
            is quoted on these pages with that attribution and is not relicensed by this site, and the open dataset built
            from this reference carries the structural facts, not the SIG’s descriptions. {site.name} is not affiliated
            with Bluetooth SIG, Inc., which owns the Bluetooth word mark and logos; the SIG’s files remain the authority.
          </p>
          <details className="mt-4 rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            <summary className="cursor-pointer font-semibold text-[var(--fg)]">The notice in every file, verbatim</summary>
            <div className="mt-3 space-y-3">
              {terms.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </details>
          <p className="mt-4 text-sm text-[var(--muted)]">
            The structural facts are also published as an open dataset:{" "}
            <Link href="/datasets#bluetooth-fitness-gatt-2026" className={LINK}>
              Bluetooth fitness GATT characteristics
            </Link>
            .
          </p>
        </section>
      </div>
    </Container>
  );
}
