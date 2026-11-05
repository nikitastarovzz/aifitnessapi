"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GattValueView from "@/components/tools/GattValueView";
import {
  decode,
  fieldOf,
  fmt,
  parseHex,
  revolutionRate,
  toHex,
  wheelDistanceM,
  wheelSpeedKmh,
  type GattDecoded,
  type GattLayout,
  type RevolutionRate,
} from "@/lib/gattDecode.mjs";
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
 * The interactive half of /tools/cycling-power-lab.
 *
 * Cycling Power Measurement and CSC Measurement carry cumulative counters,
 * not cadence or speed: a revolution count and the time of the last
 * revolution event. Cadence and speed are the difference between two
 * notifications, so every derived number here is computed from a pair, with
 * the wrap of each counter at its own width and the event-time tick its own
 * structure gives. Everything stays in this tab; nothing is written to a
 * sensor.
 */

type Pair = { label: string; uuid: string; prev: string; cur: string; note: string };
type ReplayPacket = { tMs: number; uuid: string; hex: string };
type Replay = { id: string; label: string; packets: ReplayPacket[] };
type Row = { tMs: number; uuid: string; bytes: Uint8Array; source: "device" | "synthetic" };
type Mode = "idle" | "connecting" | "live" | "replay" | "ended";

const MAX_ROWS = 20000;
const WHEEL = "Wheel Revolution Data";
const CRANK = "Crank Revolution Data";
const btn =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
const btn2 =
  "rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 disabled:opacity-50";
const card = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5";

function rates(prev: GattDecoded | null, cur: GattDecoded) {
  const get = (d: GattDecoded | null, n: string) => {
    const f = d ? fieldOf(d, n) : null;
    return f && f.status === "present" ? f : null;
  };
  return {
    crank: prev ? revolutionRate(get(prev, CRANK), get(cur, CRANK)) : null,
    wheel: prev ? revolutionRate(get(prev, WHEEL), get(cur, WHEEL)) : null,
  };
}

function RateCell({ r, unit }: { r: RevolutionRate | null; unit: (r: RevolutionRate) => string }) {
  if (!r) return <span className="text-[var(--muted)]">—</span>;
  return (
    <span>
      +{r.dRevs} rev / {r.dTicks} ticks ({fmt(r.dt)} s){" "}
      <strong className="text-[var(--fg)]">{r.rpm == null ? r.reason : unit(r)}</strong>
    </span>
  );
}

export default function CyclingPowerLab({
  layouts,
  measurementUuids,
  serviceUuids,
  pairs,
  replay: replayData,
  defaultCircumferenceMm,
}: {
  layouts: GattLayout[];
  measurementUuids: string[];
  serviceUuids: number[];
  pairs: Pair[];
  replay: Replay;
  defaultCircumferenceMm: number;
}) {
  const support = useBluetoothSupport();
  const byUuid = useMemo(() => new Map(layouts.map((l) => [l.uuid, l])), [layouts]);
  const [mode, setMode] = useState<Mode>("idle");
  const [status, setStatus] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [version, setVersion] = useState(0);
  const [circ, setCirc] = useState(defaultCircumferenceMm);
  const [pairIdx, setPairIdx] = useState(0);
  const [pasteUuid, setPasteUuid] = useState(pairs[0]?.uuid ?? measurementUuids[0]);
  const [prevHex, setPrevHex] = useState(pairs[0]?.prev ?? "");
  const [curHex, setCurHex] = useState(pairs[0]?.cur ?? "");

  const rows = useRef<Row[]>([]);
  const reads = useRef<{ uuid: string; bytes: Uint8Array }[]>([]);
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
    reads.current = [];
    t0.current = Date.now();
    setNotes([]);
    setVersion((v) => v + 1);
  }, []);

  const stopReplay = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  useEffect(() => () => stopReplay(), [stopReplay]);

  const connect = useCallback(async () => {
    const bt = bluetooth();
    if (!bt) return;
    stopReplay();
    setStatus(null);
    setMode("connecting");
    try {
      const dev = await bt.requestDevice({ filters: serviceUuids.map((s) => ({ services: [s] })) });
      reset();
      device.current = dev;
      setDeviceName(dev.name || "unnamed sensor");
      dev.addEventListener("gattserverdisconnected", () => {
        setMode((m) => (m === "live" ? "ended" : m));
        setStatus("The sensor disconnected. What it sent is kept below.");
      });
      if (!dev.gatt) throw new Error("This device exposes no GATT server.");
      const server = await dev.gatt.connect();
      const aliases = aliasMap(layouts.map((l) => l.uuidNumber));
      const log: string[] = [];
      for (const s of serviceUuids) {
        let svc;
        try {
          svc = await server.getPrimaryService(s);
        } catch {
          continue;
        }
        for (const ch of await svc.getCharacteristics()) {
          const alias = aliases.get(ch.uuid.toLowerCase());
          const layout = alias != null ? layouts.find((l) => l.uuidNumber === alias) : undefined;
          if (!layout) continue;
          if (measurementUuids.includes(layout.uuid) && (ch.properties.notify || ch.properties.indicate)) {
            ch.addEventListener("characteristicvaluechanged", (e: Event) => {
              const v = (e.target as GattChar).value;
              if (v) push(layout.uuid, bytesOf(v), "device");
            });
            try {
              await ch.startNotifications();
              subscribed.current.push(ch);
              log.push(`${layout.name}: subscribed`);
            } catch (err) {
              log.push(`${layout.name}: subscribe failed (${err instanceof Error ? err.message : String(err)})`);
            }
          } else if (ch.properties.read) {
            try {
              reads.current.push({ uuid: layout.uuid, bytes: bytesOf(await ch.readValue()) });
              log.push(`${layout.name}: read once`);
            } catch (err) {
              log.push(`${layout.name}: read failed (${err instanceof Error ? err.message : String(err)})`);
            }
          }
        }
      }
      setNotes(log.length ? log : ["Neither Cycling Power Measurement nor CSC Measurement was found on this device."]);
      setMode("live");
    } catch (err) {
      setMode((m) => (m === "connecting" ? "idle" : m));
      setStatus(errorText(err));
    }
  }, [layouts, measurementUuids, push, reset, serviceUuids, stopReplay]);

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
    stopReplay();
    if (mode === "live") void disconnect();
    reset();
    setDeviceName("synthetic ride (CSC sensor + power meter)");
    setStatus(null);
    setMode("replay");
    let i = 0;
    const start = Date.now();
    timer.current = setInterval(() => {
      const elapsed = (Date.now() - start) * 4; // four times real time
      while (i < replayData.packets.length && replayData.packets[i].tMs <= elapsed) {
        const p = replayData.packets[i];
        const b = parseHex(p.hex);
        if (b) push(p.uuid, b, "synthetic", p.tMs);
        i++;
      }
      if (i >= replayData.packets.length) {
        stopReplay();
        setMode("ended");
      }
    }, 100);
  }, [disconnect, mode, push, replayData, reset, stopReplay]);

  /* ── Derived ───────────────────────────────────────────────────────── */

  const snapshot = useMemo(() => {
    void version;
    const per = new Map<
      string,
      {
        n: number;
        last: GattDecoded | null;
        lastBytes: Uint8Array | null;
        power: number | null;
        cadence: { rpm: number | null; reason: string | null; lastRpm: number | null };
        speed: { kmh: number | null; reason: string | null; lastKmh: number | null };
        wheelRevs: number;
        table: { tMs: number; crank: RevolutionRate | null; wheel: RevolutionRate | null; power: number | null }[];
      }
    >();
    for (const r of rows.current) {
      const l = byUuid.get(r.uuid);
      if (!l) continue;
      const d = decode(r.bytes, l);
      const s = per.get(r.uuid) ?? {
        n: 0,
        last: null,
        lastBytes: null,
        power: null,
        cadence: { rpm: null, reason: null, lastRpm: null },
        speed: { kmh: null, reason: null, lastKmh: null },
        wheelRevs: 0,
        table: [],
      };
      const { crank, wheel } = rates(s.last, d);
      const p = fieldOf(d, "Instantaneous Power");
      const power = p && p.status === "present" && typeof p.value === "number" ? p.value : null;
      if (crank) s.cadence = { rpm: crank.rpm, reason: crank.reason, lastRpm: crank.rpm ?? s.cadence.lastRpm };
      if (wheel) {
        const kmh = wheelSpeedKmh(wheel, circ);
        s.speed = { kmh, reason: wheel.reason, lastKmh: kmh ?? s.speed.lastKmh };
        s.wheelRevs += wheel.dRevs;
      }
      if (power != null) s.power = power;
      s.n++;
      s.last = d;
      s.lastBytes = r.bytes;
      s.table.push({ tMs: r.tMs, crank, wheel, power });
      if (s.table.length > 15) s.table.shift();
      per.set(r.uuid, s);
    }
    return { per, total: rows.current.length, synthetic: rows.current.some((r) => r.source === "synthetic") };
  }, [version, byUuid, circ]);

  const pasteLayout = byUuid.get(pasteUuid) ?? layouts[0];
  const pasted = useMemo(() => {
    const a = parseHex(prevHex);
    const b = parseHex(curHex);
    if (!a || !b) return null;
    const da = decode(a, pasteLayout);
    const db = decode(b, pasteLayout);
    return { a, b, da, db, ...rates(da, db) };
  }, [prevHex, curHex, pasteLayout]);

  const loadPair = (i: number) => {
    const p = pairs[i];
    setPairIdx(i);
    setPasteUuid(p.uuid);
    setPrevHex(p.prev);
    setCurHex(p.cur);
  };

  const running = mode === "live" || mode === "replay";
  const kmhText = (r: RevolutionRate) => {
    const v = wheelSpeedKmh(r, circ);
    return v == null ? "—" : `${fmt(Number(v.toFixed(2)))} km/h (${fmt(Number(r.rpm!.toFixed(1)))} wheel rpm)`;
  };
  const rpmText = (r: RevolutionRate) => `${fmt(Number(r.rpm!.toFixed(1)))} rpm`;

  return (
    <div className="mt-8 space-y-6">
      <div className={card}>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={connect} disabled={support !== "ok" || mode === "connecting"}>
            {mode === "connecting" ? "Connecting…" : "Connect a power meter or CSC sensor"}
          </button>
          {mode === "live" ? (
            <button type="button" className={btn2} onClick={disconnect}>
              Disconnect
            </button>
          ) : null}
          <button type="button" className={btn2} onClick={replay}>
            {mode === "replay" ? "Restart synthetic ride" : "Replay a synthetic ride"}
          </button>
          {mode === "replay" ? (
            <button type="button" className={btn2} onClick={() => (stopReplay(), setMode("ended"))}>
              Stop
            </button>
          ) : null}
          <label className="ml-auto text-sm">
            <span className="text-[var(--muted)]">Wheel circumference (mm) </span>
            <input
              type="number"
              min={500}
              max={3500}
              step={1}
              value={circ}
              onChange={(e) => setCirc(Number(e.target.value) || defaultCircumferenceMm)}
              className="w-24 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 font-mono text-sm"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          {defaultCircumferenceMm} mm is an example, not your wheel: measure one full roll-out of your tire and enter it.
          Speed and distance scale with it; cadence does not use it.
        </p>
        {support !== "ok" && support !== "checking" ? <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">{supportText(support)}</p> : null}
        {status ? <p className="mt-3 text-sm text-[var(--muted)]">{status}</p> : null}
        {deviceName ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            {running ? "Receiving from" : "Last session:"} <strong className="text-[var(--fg)]">{deviceName}</strong> · {snapshot.total} value
            {snapshot.total === 1 ? "" : "s"}
            {snapshot.synthetic ? " · SYNTHETIC: made-up numbers, not a sensor" : ""}
          </p>
        ) : null}
        {notes.length ? (
          <ul className="mt-2 list-disc pl-5 text-xs text-[var(--muted)]">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {[...snapshot.per].map(([uuid, s]) => {
        const l = byUuid.get(uuid)!;
        return (
          <div key={uuid} className={card} aria-live="polite">
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              {l.name} <span className="font-mono text-sm font-normal text-[var(--muted)]">{l.uuid}</span>
              <span className="text-sm font-normal text-[var(--muted)]"> · {s.n} notifications</span>
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Power", s.power != null ? `${s.power} W` : l.fields.some((f) => f.name === "Instantaneous Power") ? "—" : "not in this characteristic"],
                ["Cadence", s.cadence.rpm != null ? `${s.cadence.rpm.toFixed(1)} rpm` : s.cadence.lastRpm != null ? `${s.cadence.lastRpm.toFixed(1)} rpm (no new crank event)` : "—"],
                ["Speed", s.speed.kmh != null ? `${s.speed.kmh.toFixed(2)} km/h` : s.speed.lastKmh != null ? `${s.speed.lastKmh.toFixed(2)} km/h (no new wheel event)` : "—"],
                ["Distance", `${fmt(Number(wheelDistanceM(s.wheelRevs, circ).toFixed(1)))} m`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-[var(--border)] p-3">
                  <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">{k}</dt>
                  <dd className="mt-1 font-semibold text-[var(--fg)]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[var(--muted)]">
                  <tr>
                    <th className="py-1 pr-3">t</th>
                    <th className="py-1 pr-3">Crank: since previous</th>
                    <th className="py-1">Wheel: since previous</th>
                  </tr>
                </thead>
                <tbody>
                  {s.table
                    .slice()
                    .reverse()
                    .map((t, i) => (
                      <tr key={`${t.tMs}-${i}`} className="border-t border-[var(--border)]">
                        <td className="py-1 pr-3 font-mono">{(t.tMs / 1000).toFixed(1)} s</td>
                        <td className="py-1 pr-3">
                          <RateCell r={t.crank} unit={rpmText} />
                        </td>
                        <td className="py-1">
                          <RateCell r={t.wheel} unit={kmhText} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {s.lastBytes ? (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">Latest value, byte by byte</summary>
                <div className="mt-3">
                  <GattValueView layout={l} bytes={s.lastBytes} compact />
                </div>
              </details>
            ) : null}
          </div>
        );
      })}

      {reads.current.length ? (
        <div className={card}>
          <h3 className="text-lg font-semibold text-[var(--fg)]">Read once on connect</h3>
          <div className="mt-3 space-y-5">
            {reads.current.map((r) => (
              <GattValueView key={r.uuid} layout={byUuid.get(r.uuid)!} bytes={r.bytes} compact />
            ))}
          </div>
        </div>
      ) : null}

      <div className={card}>
        <h3 className="text-lg font-semibold text-[var(--fg)]">Paste two values</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Cadence and speed need two consecutive notifications from the same sensor. Paste them as hex, in order. The
          samples are synthetic, built from the SIG&rsquo;s structure by the module that decodes them.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {pairs.map((p, i) => (
            <button key={p.label} type="button" className={`${btn2} ${i === pairIdx ? "border-brand-500" : ""}`} onClick={() => loadPair(i)}>
              {p.label}
            </button>
          ))}
        </div>
        {pairs[pairIdx] && prevHex === pairs[pairIdx].prev && curHex === pairs[pairIdx].cur ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Sample: {pairs[pairIdx].note}</p>
        ) : null}
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr_1fr]">
          <label className="text-sm">
            <span className="block text-[var(--muted)]">Decode as</span>
            <select
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm"
              value={pasteUuid}
              onChange={(e) => setPasteUuid(e.target.value)}
            >
              {layouts.map((l) => (
                <option key={l.uuid} value={l.uuid}>
                  {l.name} ({l.uuid})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-[var(--muted)]">Previous value</span>
            <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm" value={prevHex} onChange={(e) => setPrevHex(e.target.value)} spellCheck={false} />
          </label>
          <label className="text-sm">
            <span className="block text-[var(--muted)]">Next value</span>
            <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm" value={curHex} onChange={(e) => setCurHex(e.target.value)} spellCheck={false} />
          </label>
        </div>
        {pasted ? (
          <div className="mt-4 space-y-5">
            <div className="rounded-lg border border-[var(--border)] p-3 text-sm">
              <p>
                <strong className="text-[var(--fg)]">Crank:</strong> <RateCell r={pasted.crank} unit={rpmText} />
              </p>
              <p className="mt-1">
                <strong className="text-[var(--fg)]">Wheel:</strong> <RateCell r={pasted.wheel} unit={kmhText} />
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                rpm = Δrevolutions ÷ (Δticks × tick) × 60, with both counters wrapped at their own width; km/h = Δwheel
                revolutions × circumference ÷ Δt × 3.6.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--fg)]">Previous: {toHex(pasted.a)}</p>
              <div className="mt-2">
                <GattValueView layout={pasteLayout} bytes={pasted.a} decoded={pasted.da} compact />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--fg)]">Next: {toHex(pasted.b)}</p>
              <div className="mt-2">
                <GattValueView layout={pasteLayout} bytes={pasted.b} decoded={pasted.db} compact />
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-amber-700 dark:text-amber-400">Both boxes need hex: an even number of 0–9 / A–F digits.</p>
        )}
      </div>
    </div>
  );
}
