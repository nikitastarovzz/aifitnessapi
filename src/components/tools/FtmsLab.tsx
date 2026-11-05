"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GattValueView, { ValueWithUnit } from "@/components/tools/GattValueView";
import { decode, parseHex, toHex, type GattLayout, type GattUnit } from "@/lib/gattDecode.mjs";
import {
  aliasMap,
  bluetooth,
  bytesOf,
  errorText,
  supportText,
  useBluetoothSupport,
  type BtDevice,
  type GattChar,
} from "@/lib/webBluetooth";

/**
 * The interactive half of /tools/ftms-lab.
 *
 * Live: the browser's chooser lists devices advertising the Fitness Machine
 * service; the lab lists every characteristic the service exposes, subscribes
 * to the ones that notify (never the Control Point), reads the ones that are
 * read once, and decodes each value against the layout the server compiled
 * from the SIG's gss structure. It writes nothing to the machine.
 *
 * Paste and replay need no hardware: a hex box decodes any one value, and
 * a synthetic session (made up, labeled so) streams through the same view.
 * Everything stays in this tab.
 */

type Sample = { label: string; uuid: string; hex: string; note: string };
type ReplayPacket = { tMs: number; uuid: string; hex: string };
type Replay = { id: string; label: string; packets: ReplayPacket[] };
type Row = { tMs: number; uuid: string; bytes: Uint8Array; source: "device" | "synthetic" };
type Found = { uuid: string; name: string; props: string; note: string };
type Mode = "idle" | "connecting" | "live" | "replay" | "ended";

const MAX_ROWS = 20000;
const btn =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
const btn2 =
  "rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 disabled:opacity-50";
const card = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5";
const CONTROL_POINT = 0x2ad9;

export default function FtmsLab({
  layouts,
  dataUuids,
  serviceUuid,
  samples,
  replays,
}: {
  layouts: GattLayout[];
  dataUuids: string[];
  serviceUuid: number;
  samples: Sample[];
  replays: Replay[];
}) {
  const support = useBluetoothSupport();
  const byUuid = useMemo(() => new Map(layouts.map((l) => [l.uuid, l])), [layouts]);
  const [mode, setMode] = useState<Mode>("idle");
  const [status, setStatus] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [found, setFound] = useState<Found[]>([]);
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [pasteUuid, setPasteUuid] = useState(samples[0]?.uuid ?? layouts[0].uuid);
  const [hexInput, setHexInput] = useState(samples[0]?.hex ?? "");
  const [sampleNote, setSampleNote] = useState<string | null>(samples[0]?.note ?? null);
  const [replayId, setReplayId] = useState(replays[0]?.id ?? "");

  const rows = useRef<Row[]>([]);
  const t0 = useRef(0);
  const device = useRef<BtDevice | null>(null);
  const subscribed = useRef<GattChar[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const push = useCallback((uuid: string, bytes: Uint8Array, source: Row["source"], tMs?: number) => {
    if (rows.current.length >= MAX_ROWS) rows.current.shift();
    rows.current.push({ tMs: tMs ?? Date.now() - t0.current, uuid, bytes, source });
    setVersion((v) => v + 1);
  }, []);

  const reset = useCallback(() => {
    rows.current = [];
    t0.current = Date.now();
    setSelected(null);
    setFound([]);
    setVersion((v) => v + 1);
  }, []);

  const stopReplay = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  useEffect(() => () => stopReplay(), [stopReplay]);

  const onDisconnect = useCallback(() => {
    setMode((m) => (m === "live" ? "ended" : m));
    setStatus("The machine disconnected. What it sent is kept below.");
  }, []);

  const connect = useCallback(async () => {
    const bt = bluetooth();
    if (!bt) return;
    stopReplay();
    setStatus(null);
    setMode("connecting");
    try {
      const dev = await bt.requestDevice({ filters: [{ services: [serviceUuid] }] });
      reset();
      device.current = dev;
      setDeviceName(dev.name || "unnamed fitness machine");
      dev.addEventListener("gattserverdisconnected", onDisconnect);
      if (!dev.gatt) throw new Error("This device exposes no GATT server.");
      const server = await dev.gatt.connect();
      const svc = await server.getPrimaryService(serviceUuid);
      const chars = await svc.getCharacteristics();
      const aliases = aliasMap(layouts.map((l) => l.uuidNumber));
      const list: Found[] = [];
      for (const ch of chars) {
        const alias = aliases.get(ch.uuid.toLowerCase());
        const layout = alias != null ? layouts.find((l) => l.uuidNumber === alias) : undefined;
        const p = ch.properties;
        const props = [p.read && "read", p.notify && "notify", p.indicate && "indicate", p.write && "write"].filter(Boolean).join(", ");
        const entry: Found = { uuid: layout?.uuid ?? ch.uuid, name: layout?.name ?? "not in this site's Bluetooth dataset", props, note: "" };
        if (alias === CONTROL_POINT) {
          entry.note = "not subscribed: the lab writes nothing to the machine";
        } else if (layout && (p.notify || p.indicate)) {
          const handler = (e: Event) => {
            const v = (e.target as GattChar).value;
            if (v) push(layout.uuid, bytesOf(v), "device");
          };
          ch.addEventListener("characteristicvaluechanged", handler);
          try {
            await ch.startNotifications();
            subscribed.current.push(ch);
            entry.note = "subscribed";
          } catch (err) {
            entry.note = `subscribe failed: ${err instanceof Error ? err.message : String(err)}`;
          }
        }
        if (layout && p.read && !dataUuids.includes(layout.uuid)) {
          try {
            push(layout.uuid, bytesOf(await ch.readValue()), "device");
            entry.note = entry.note ? `${entry.note}; read once` : "read once";
          } catch (err) {
            entry.note = `${entry.note ? `${entry.note}; ` : ""}read failed: ${err instanceof Error ? err.message : String(err)}`;
          }
        }
        list.push(entry);
      }
      setFound(list);
      setMode("live");
    } catch (err) {
      setMode((m) => (m === "connecting" ? "idle" : m));
      setStatus(errorText(err));
    }
  }, [dataUuids, layouts, onDisconnect, push, reset, serviceUuid, stopReplay]);

  const disconnect = useCallback(async () => {
    for (const ch of subscribed.current) {
      try {
        await ch.stopNotifications();
      } catch {
        /* already gone */
      }
    }
    subscribed.current = [];
    device.current?.gatt?.disconnect();
    setMode("ended");
  }, []);

  const replay = useCallback(() => {
    const r = replays.find((x) => x.id === replayId);
    if (!r) return;
    stopReplay();
    if (mode === "live") void disconnect();
    reset();
    setDeviceName(`synthetic ${r.label.toLowerCase()}`);
    setStatus(null);
    setMode("replay");
    let i = 0;
    const start = Date.now();
    timer.current = setInterval(() => {
      const elapsed = Date.now() - start;
      while (i < r.packets.length && r.packets[i].tMs <= elapsed) {
        const p = r.packets[i];
        const b = parseHex(p.hex);
        if (b) push(p.uuid, b, "synthetic", p.tMs);
        i++;
      }
      if (i >= r.packets.length) {
        stopReplay();
        setMode("ended");
      }
    }, 250);
  }, [disconnect, mode, push, replayId, replays, reset, stopReplay]);

  /* ── Derived ───────────────────────────────────────────────────────── */

  const snapshot = useMemo(() => {
    void version;
    const all = rows.current;
    // The latest present value of every field, per characteristic: machines
    // may split one record over several notifications (More Data), so the
    // newest value of each field is the reading, wherever it arrived.
    const latest = new Map<string, Map<string, { display: string; value: number | number[] | string | null; unit: GattUnit | null; at: number }>>();
    const counts = new Map<string, number>();
    all.forEach((r) => {
      counts.set(r.uuid, (counts.get(r.uuid) ?? 0) + 1);
      const l = byUuid.get(r.uuid);
      if (!l || !l.fields.length) return;
      const d = decode(r.bytes, l);
      const m = latest.get(r.uuid) ?? new Map();
      for (const f of d.fields) {
        if (f.status !== "present" || f.bits || f.display == null) continue;
        m.set(f.name, { display: f.display, value: f.valueLabel || f.children ? null : f.value, unit: f.unit, at: r.tMs });
      }
      latest.set(r.uuid, m);
    });
    return { all, latest, counts };
  }, [version, byUuid]);

  const idx = selected != null && selected < snapshot.all.length ? selected : snapshot.all.length - 1;
  const current = idx >= 0 ? snapshot.all[idx] : null;
  const currentLayout = current ? byUuid.get(current.uuid) : null;

  const pasteLayout = byUuid.get(pasteUuid) ?? layouts[0];
  const pasted = useMemo(() => parseHex(hexInput), [hexInput]);

  const running = mode === "live" || mode === "replay";
  const synthetic = snapshot.all.some((r) => r.source === "synthetic");

  return (
    <div className="mt-8 space-y-6">
      <div className={card}>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={connect} disabled={support !== "ok" || mode === "connecting"}>
            {mode === "connecting" ? "Connecting…" : "Connect a fitness machine"}
          </button>
          {mode === "live" ? (
            <button type="button" className={btn2} onClick={disconnect}>
              Disconnect
            </button>
          ) : null}
          <span className="text-sm text-[var(--muted)]">or replay a synthetic session:</span>
          <select
            aria-label="Synthetic session"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm"
            value={replayId}
            onChange={(e) => setReplayId(e.target.value)}
          >
            {replays.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <button type="button" className={btn2} onClick={replay}>
            {mode === "replay" ? "Restart replay" : "Replay"}
          </button>
          {mode === "replay" ? (
            <button type="button" className={btn2} onClick={() => (stopReplay(), setMode("ended"))}>
              Stop
            </button>
          ) : null}
        </div>
        {support !== "ok" && support !== "checking" ? <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">{supportText(support)}</p> : null}
        {status ? <p className="mt-3 text-sm text-[var(--muted)]">{status}</p> : null}
        {deviceName ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            {running ? "Receiving from" : "Last session:"} <strong className="text-[var(--fg)]">{deviceName}</strong> · {snapshot.all.length} value
            {snapshot.all.length === 1 ? "" : "s"}
            {synthetic ? " · SYNTHETIC: made-up numbers, not a device" : ""}
          </p>
        ) : null}
        {found.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="py-1 pr-3">Characteristic the machine exposes</th>
                  <th className="py-1 pr-3">Properties</th>
                  <th className="py-1">What the lab did</th>
                </tr>
              </thead>
              <tbody>
                {found.map((f) => (
                  <tr key={f.uuid} className="border-t border-[var(--border)]">
                    <td className="py-1 pr-3">
                      {f.name} <span className="font-mono text-xs text-[var(--muted)]">{f.uuid}</span>
                    </td>
                    <td className="py-1 pr-3 text-xs">{f.props || "—"}</td>
                    <td className="py-1 text-xs text-[var(--muted)]">{f.note || "listed only"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {snapshot.latest.size ? (
        <div className={card} aria-live="polite">
          <h3 className="text-lg font-semibold text-[var(--fg)]">Latest values</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {[...snapshot.latest].map(([uuid, m]) => (
              <div key={uuid}>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {byUuid.get(uuid)?.name} · {snapshot.counts.get(uuid)} value{snapshot.counts.get(uuid) === 1 ? "" : "s"}
                </p>
                <dl className="mt-2 space-y-1 text-sm">
                  {[...m].map(([name, v]) => (
                    <div key={name} className="flex justify-between gap-3 border-b border-[var(--border)] pb-1">
                      <dt className="text-[var(--muted)]">{name}</dt>
                      <dd className="text-right font-medium text-[var(--fg)]"><ValueWithUnit value={v.value} unit={v.unit} fallback={v.display} /></dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {current ? (
        <div className={card}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              Value {idx + 1} of {snapshot.all.length}
              {current.source === "synthetic" ? " (synthetic)" : ""}
            </h3>
            <div className="flex gap-2">
              <button type="button" className={btn2} onClick={() => setSelected(Math.max(0, idx - 1))} disabled={idx <= 0}>
                ← Previous
              </button>
              <button type="button" className={btn2} onClick={() => setSelected(idx + 1 >= snapshot.all.length - 1 ? null : idx + 1)} disabled={idx >= snapshot.all.length - 1}>
                Next →
              </button>
              <button type="button" className={btn2} onClick={() => setSelected(null)} disabled={selected == null}>
                Follow latest
              </button>
            </div>
          </div>
          <div className="mt-4">{currentLayout ? <GattValueView layout={currentLayout} bytes={current.bytes} compact /> : <p className="font-mono text-sm">{toHex(current.bytes)}</p>}</div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">Last 40 values as hex</summary>
            <ol className="mt-2 max-h-72 space-y-0.5 overflow-y-auto font-mono text-xs">
              {snapshot.all.slice(-40).map((r, k) => {
                const i = snapshot.all.length - Math.min(40, snapshot.all.length) + k;
                return (
                  <li key={i}>
                    <button type="button" className={`text-left hover:text-brand-600 ${i === idx ? "font-bold text-brand-600" : ""}`} onClick={() => setSelected(i)}>
                      {(r.tMs / 1000).toFixed(1)} s · {byUuid.get(r.uuid)?.name ?? r.uuid} · {toHex(r.bytes)}
                    </button>
                  </li>
                );
              })}
            </ol>
          </details>
        </div>
      ) : null}

      <div className={card}>
        <h3 className="text-lg font-semibold text-[var(--fg)]">Paste a value</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Bytes as hex, in the order they arrive (spaces, commas or 0x prefixes are fine). The samples are synthetic, built from the
          SIG&rsquo;s structure by the same module that decodes them.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {samples.map((s) => (
            <button
              key={s.label}
              type="button"
              className={btn2}
              onClick={() => {
                setPasteUuid(s.uuid);
                setHexInput(s.hex);
                setSampleNote(s.note);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr]">
          <label className="text-sm">
            <span className="block text-[var(--muted)]">Decode as</span>
            <select
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm"
              value={pasteUuid}
              onChange={(e) => (setPasteUuid(e.target.value), setSampleNote(null))}
            >
              {layouts.map((l) => (
                <option key={l.uuid} value={l.uuid}>
                  {l.name} ({l.uuid}){l.fields.length ? "" : " — raw"}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-[var(--muted)]">Hex</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm"
              value={hexInput}
              onChange={(e) => (setHexInput(e.target.value), setSampleNote(null))}
              spellCheck={false}
            />
          </label>
        </div>
        {sampleNote ? <p className="mt-2 text-sm text-[var(--muted)]">Sample: {sampleNote}</p> : null}
        <div className="mt-4">
          {pasted ? <GattValueView layout={pasteLayout} bytes={pasted} /> : <p className="text-sm text-amber-700 dark:text-amber-400">That is not hex: an even number of 0–9 / A–F digits.</p>}
        </div>
      </div>
    </div>
  );
}
