"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import GattValueView from "@/components/tools/GattValueView";
import { parseHex, toHex, type GattLayout } from "@/lib/gattDecode.mjs";
import {
  aliasMap,
  bluetooth,
  bytesOf,
  errorText,
  hex4,
  supportText,
  useBluetoothSupport,
  type BtDevice,
  type GattChar,
} from "@/lib/webBluetooth";

/**
 * The interactive half of /tools/ble-gatt-explorer.
 *
 * Any device: the chooser lists everything in range (acceptAllDevices), and
 * the page asks for every service in this site's Bluetooth dataset plus any
 * the reader adds, because Web Bluetooth only lets a page use services it
 * named up front. Services and characteristics are listed with the SIG's
 * names where the dataset has them; Read and Notify show each value decoded
 * against the SIG's structure where there is one, and as hex otherwise.
 * Layouts load from a static JSON file built from the same data. Nothing is
 * written to the device; nothing leaves the tab.
 */

type Named = { uuid: string; uuidNumber: number; name: string; id: string; href: string | null };
type CharEntry = {
  key: string;
  uuid: string;
  alias: number | null;
  name: string | null;
  href: string | null;
  props: string[];
  ch: GattChar;
};
type ServiceEntry = { uuid: string; alias: number | null; name: string | null; chars: CharEntry[] };
type Value = { bytes: Uint8Array; at: number; count: number };

const btn =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
const btn2 =
  "rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--fg)] transition-colors hover:border-brand-400 disabled:opacity-50";
const card = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5";
const UUID128 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseExtras(s: string): { ok: (string | number)[]; bad: string[] } {
  const ok: (string | number)[] = [];
  const bad: string[] = [];
  for (const t of s.split(/[\s,;]+/).filter(Boolean)) {
    if (/^(0x)?[0-9a-f]{4}$/i.test(t)) ok.push(parseInt(t.replace(/^0x/i, ""), 16));
    else if (UUID128.test(t)) ok.push(t.toLowerCase());
    else bad.push(t);
  }
  return { ok, bad };
}

const printable = (b: Uint8Array) => b.length > 0 && Array.from(b).every((x) => x >= 0x20 && x <= 0x7e);

export default function GattExplorer({
  services,
  characteristics,
  decodable,
  layoutsUrl,
  defaultPaste,
}: {
  services: Named[];
  characteristics: Named[];
  decodable: { uuid: string; name: string }[];
  layoutsUrl: string;
  defaultPaste: { uuid: string; hex: string };
}) {
  const support = useBluetoothSupport();
  const [layouts, setLayouts] = useState<Map<string, GattLayout> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [extras, setExtras] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [tree, setTree] = useState<ServiceEntry[]>([]);
  const [values, setValues] = useState<Record<string, Value>>({});
  const [notifying, setNotifying] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [pasteUuid, setPasteUuid] = useState(defaultPaste.uuid);
  const [hexInput, setHexInput] = useState(defaultPaste.hex);
  const device = useRef<BtDevice | null>(null);
  const handlers = useRef(new Map<string, (e: Event) => void>());

  useEffect(() => {
    let live = true;
    fetch(layoutsUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j: { layouts: GattLayout[] }) => {
        if (live) setLayouts(new Map(j.layouts.map((l) => [l.uuid, l])));
      })
      .catch((e) => live && setLoadError(e instanceof Error ? e.message : String(e)));
    return () => {
      live = false;
    };
  }, [layoutsUrl]);

  const svcName = useMemo(() => new Map(services.map((s) => [s.uuidNumber, s])), [services]);
  const charName = useMemo(() => new Map(characteristics.map((c) => [c.uuidNumber, c])), [characteristics]);
  const extraParsed = useMemo(() => parseExtras(extras), [extras]);

  const layoutFor = (alias: number | null) => {
    if (alias == null || !layouts) return null;
    return layouts.get(`0x${alias.toString(16).toUpperCase().padStart(4, "0")}`) ?? null;
  };

  const connect = useCallback(async () => {
    const bt = bluetooth();
    if (!bt) return;
    setStatus(null);
    setConnecting(true);
    try {
      const dev = await bt.requestDevice({ acceptAllDevices: true, optionalServices: [...services.map((s) => s.uuidNumber), ...extraParsed.ok] });
      device.current = dev;
      setDeviceName(dev.name || "unnamed device");
      setTree([]);
      setValues({});
      setNotifying({});
      setErrors({});
      dev.addEventListener("gattserverdisconnected", () => {
        setConnected(false);
        setNotifying({});
        setStatus("The device disconnected. The values read so far are kept below.");
      });
      if (!dev.gatt) throw new Error("This device exposes no GATT server.");
      const server = await dev.gatt.connect();
      setConnected(true);
      const svcAliases = aliasMap(services.map((s) => s.uuidNumber));
      const charAliases = aliasMap(characteristics.map((c) => c.uuidNumber));
      const out: ServiceEntry[] = [];
      let primaries: Awaited<ReturnType<NonNullable<BtDevice["gatt"]>["getPrimaryServices"]>> = [];
      try {
        primaries = await server.getPrimaryServices();
      } catch (err) {
        setStatus(`Connected, but no service this page asked for is on the device (${err instanceof Error ? err.message : String(err)}). Add its UUID above and connect again.`);
      }
      for (const svc of primaries) {
        const alias = svcAliases.get(svc.uuid.toLowerCase()) ?? null;
        const entry: ServiceEntry = { uuid: svc.uuid, alias, name: alias != null ? (svcName.get(alias)?.name ?? null) : null, chars: [] };
        let chars: GattChar[] = [];
        try {
          chars = await svc.getCharacteristics();
        } catch {
          /* a service with no characteristics, or one the browser blocks */
        }
        for (const ch of chars) {
          const a = charAliases.get(ch.uuid.toLowerCase()) ?? null;
          const known = a != null ? charName.get(a) : undefined;
          const p = ch.properties;
          entry.chars.push({
            key: `${svc.uuid}/${ch.uuid}`,
            uuid: ch.uuid,
            alias: a,
            name: known?.name ?? null,
            href: known?.href ?? null,
            props: [p.read && "read", p.notify && "notify", p.indicate && "indicate", p.write && "write", p.writeWithoutResponse && "write without response"].filter(Boolean) as string[],
            ch,
          });
        }
        out.push(entry);
      }
      setTree(out);
    } catch (err) {
      setStatus(errorText(err));
    } finally {
      setConnecting(false);
    }
  }, [characteristics, charName, extraParsed.ok, services, svcName]);

  const disconnect = useCallback(() => {
    device.current?.gatt?.disconnect();
    setConnected(false);
  }, []);

  const store = (key: string, bytes: Uint8Array) =>
    setValues((v) => ({ ...v, [key]: { bytes, at: Date.now(), count: (v[key]?.count ?? 0) + 1 } }));

  const read = async (c: CharEntry) => {
    try {
      store(c.key, bytesOf(await c.ch.readValue()));
      setErrors((e) => ({ ...e, [c.key]: "" }));
      setOpen(c.key);
    } catch (err) {
      setErrors((e) => ({ ...e, [c.key]: `read failed: ${err instanceof Error ? err.message : String(err)}` }));
    }
  };

  const toggleNotify = async (c: CharEntry) => {
    try {
      if (notifying[c.key]) {
        await c.ch.stopNotifications();
        const h = handlers.current.get(c.key);
        if (h) c.ch.removeEventListener("characteristicvaluechanged", h);
        setNotifying((n) => ({ ...n, [c.key]: false }));
      } else {
        const h = (e: Event) => {
          const v = (e.target as GattChar).value;
          if (v) store(c.key, bytesOf(v));
        };
        handlers.current.set(c.key, h);
        c.ch.addEventListener("characteristicvaluechanged", h);
        await c.ch.startNotifications();
        setNotifying((n) => ({ ...n, [c.key]: true }));
        setOpen(c.key);
      }
      setErrors((e) => ({ ...e, [c.key]: "" }));
    } catch (err) {
      setErrors((e) => ({ ...e, [c.key]: `notifications failed: ${err instanceof Error ? err.message : String(err)}` }));
    }
  };

  const pasteLayout = layouts?.get(pasteUuid) ?? null;
  const pasted = useMemo(() => parseHex(hexInput), [hexInput]);
  const label = (alias: number | null, uuid: string) => (alias != null ? hex4(alias) : uuid);

  return (
    <div className="mt-8 space-y-6">
      <div className={card}>
        <label className="block text-sm">
          <span className="text-[var(--muted)]">
            Extra service UUIDs to ask for (optional; 16-bit like <code className="font-mono">0x1234</code> or full 128-bit), comma-separated
          </span>
          <input
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm"
            value={extras}
            onChange={(e) => setExtras(e.target.value)}
            placeholder="0x1234, 12345678-1234-5678-1234-56789abcdef0"
            spellCheck={false}
          />
        </label>
        {extraParsed.bad.length ? <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">Not a UUID, ignored: {extraParsed.bad.join(", ")}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={connect} disabled={support !== "ok" || connecting}>
            {connecting ? "Connecting…" : "Connect any Bluetooth device"}
          </button>
          {connected ? (
            <button type="button" className={btn2} onClick={disconnect}>
              Disconnect
            </button>
          ) : null}
          <span className="text-xs text-[var(--muted)]">
            Asks for {services.length} services by name{extraParsed.ok.length ? ` plus ${extraParsed.ok.length} of yours` : ""}.
          </span>
        </div>
        {support !== "ok" && support !== "checking" ? <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">{supportText(support)}</p> : null}
        {status ? <p className="mt-3 text-sm text-[var(--muted)]">{status}</p> : null}
        {loadError ? <p className="mt-3 text-sm text-amber-700">Decoders did not load ({loadError}); values will show as hex.</p> : null}
        {deviceName ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            {connected ? "Connected to" : "Last device:"} <strong className="text-[var(--fg)]">{deviceName}</strong>
            {tree.length ? ` · ${tree.length} service${tree.length === 1 ? "" : "s"} the page may use` : ""}
          </p>
        ) : null}
      </div>

      {tree.map((s) => (
        <div key={s.uuid} className={card}>
          <h3 className="text-lg font-semibold text-[var(--fg)]">
            {s.name ?? "Service not in this site's dataset"}{" "}
            <span className="font-mono text-sm font-normal text-[var(--muted)]">{label(s.alias, s.uuid)}</span>
          </h3>
          {s.chars.length === 0 ? <p className="mt-2 text-sm text-[var(--muted)]">No characteristics returned.</p> : null}
          <ul className="mt-3 space-y-3">
            {s.chars.map((c) => {
              const v = values[c.key];
              const layout = layoutFor(c.alias);
              return (
                <li key={c.key} className="rounded-xl border border-[var(--border)] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-[var(--fg)]">
                      {c.href ? (
                        <Link href={c.href} className="text-brand-600 hover:text-brand-500">
                          {c.name}
                        </Link>
                      ) : (
                        (c.name ?? "Unknown characteristic")
                      )}
                    </span>
                    <span className="font-mono text-xs text-[var(--muted)]">{label(c.alias, c.uuid)}</span>
                    <span className="text-xs text-[var(--muted)]">{c.props.join(", ") || "no properties"}</span>
                    <span className="text-xs text-[var(--muted)]">
                      · {layout ? (layout.fields.length ? "structure known" : "no structure: hex") : "no structure: hex"}
                    </span>
                    <span className="ml-auto flex gap-2">
                      {c.props.includes("read") ? (
                        <button type="button" className={btn2} onClick={() => read(c)} disabled={!connected}>
                          Read
                        </button>
                      ) : null}
                      {c.props.includes("notify") || c.props.includes("indicate") ? (
                        <button type="button" className={btn2} onClick={() => toggleNotify(c)} disabled={!connected}>
                          {notifying[c.key] ? "Stop notifications" : "Notify"}
                        </button>
                      ) : null}
                      {v ? (
                        <button type="button" className={btn2} onClick={() => setOpen(open === c.key ? null : c.key)}>
                          {open === c.key ? "Hide" : "Show"}
                        </button>
                      ) : null}
                    </span>
                  </div>
                  {errors[c.key] ? <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">{errors[c.key]}</p> : null}
                  {v ? (
                    <p className="mt-2 font-mono text-xs text-[var(--muted)]">
                      {toHex(v.bytes) || "(empty)"} · {v.count} value{v.count === 1 ? "" : "s"}
                      {printable(v.bytes) ? <> · as text: {JSON.stringify(new TextDecoder().decode(v.bytes))}</> : null}
                    </p>
                  ) : null}
                  {v && open === c.key && layout ? (
                    <div className="mt-3">
                      <GattValueView layout={layout} bytes={v.bytes} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className={card}>
        <h3 className="text-lg font-semibold text-[var(--fg)]">Decode a value without a device</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Pick any of the {decodable.length} characteristics this site has a SIG structure for and paste a value as hex.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,18rem)_1fr]">
          <label className="text-sm">
            <span className="block text-[var(--muted)]">Characteristic</span>
            <select
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm"
              value={pasteUuid}
              onChange={(e) => setPasteUuid(e.target.value)}
            >
              {decodable.map((d) => (
                <option key={d.uuid} value={d.uuid}>
                  {d.name} ({d.uuid})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-[var(--muted)]">Hex</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              spellCheck={false}
            />
          </label>
        </div>
        <div className="mt-4">
          {!layouts ? (
            <p className="text-sm text-[var(--muted)]">{loadError ? "Decoders did not load." : "Loading decoders…"}</p>
          ) : !pasted ? (
            <p className="text-sm text-amber-700 dark:text-amber-400">That is not hex: an even number of 0–9 / A–F digits.</p>
          ) : pasteLayout ? (
            <GattValueView layout={pasteLayout} bytes={pasted} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
