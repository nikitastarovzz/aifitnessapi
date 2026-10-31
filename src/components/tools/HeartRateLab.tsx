"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BATTERY_LEVEL,
  decodeBatteryLevel,
  decodeBodySensorLocation,
  decodeHrm,
  parseHex,
  rmssd,
  sessionCsv,
  syntheticSession,
  toHex,
  type BslLayout,
  type HrmDecoded,
  type HrmLayout,
  type SpanKind,
} from "@/lib/hrMeasurement.mjs";

/**
 * The interactive half of /tools/heart-rate-lab.
 *
 * Everything runs in this tab. Notifications arrive from the browser's
 * Bluetooth stack, are decoded by src/lib/hrMeasurement.mjs against the
 * layout the server compiled from the Bluetooth SIG structure, and are kept
 * in memory until the tab closes. No fetch, no storage, no analytics event
 * carries a byte of it; the CSV and the share card are made in the tab and
 * only leave it if the reader copies or saves them.
 *
 * Web Bluetooth has no TypeScript types in lib.dom, so the few members used
 * here are declared locally.
 */

type GattChar = EventTarget & {
  value?: DataView;
  readValue(): Promise<DataView>;
  startNotifications(): Promise<GattChar>;
  stopNotifications(): Promise<GattChar>;
};
type GattService = { getCharacteristic(uuid: number | string): Promise<GattChar> };
type GattServer = {
  connected: boolean;
  connect(): Promise<GattServer>;
  disconnect(): void;
  getPrimaryService(uuid: number | string): Promise<GattService>;
};
type BtDevice = EventTarget & { name?: string; gatt?: GattServer };
type WebBluetooth = {
  getAvailability?: () => Promise<boolean>;
  requestDevice(opts: { filters: { services: (string | number)[] }[]; optionalServices?: (string | number)[] }): Promise<BtDevice>;
};

type Support = "checking" | "ok" | "no-api" | "insecure" | "unavailable";
type Mode = "idle" | "connecting" | "live" | "replay" | "ended";
type Row = { tMs: number; at: string; source: "device" | "synthetic"; bytes: Uint8Array };

const MAX_ROWS = 36000; // ten hours at one notification a second
const CHART_SECONDS = 120;

const btn =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50";
const btn2 =
  "rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 disabled:opacity-50";
const card = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5";

const KIND_STYLE: Record<SpanKind, string> = {
  flags: "bg-slate-500/15 border-slate-500/60",
  hr: "bg-rose-500/15 border-rose-500/60",
  energy: "bg-amber-500/15 border-amber-500/60",
  rr: "bg-sky-500/15 border-sky-500/60",
  other: "bg-violet-500/15 border-violet-500/60",
  trailing: "bg-red-500/10 border-red-500 border-dashed",
};

export default function HeartRateLab({ layout, bsl }: { layout: HrmLayout; bsl: BslLayout }) {
  const [support, setSupport] = useState<Support>("checking");
  const [mode, setMode] = useState<Mode>("idle");
  const [source, setSource] = useState<"device" | "synthetic" | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [battery, setBattery] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1);
  const [hexInput, setHexInput] = useState("1E 46 EE 02 7A 03 66 03");
  const [copied, setCopied] = useState<string | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const rows = useRef<Row[]>([]);
  const runs = useRef<number[][]>([[]]);
  const t0 = useRef(0);
  const device = useRef<BtDevice | null>(null);
  const measurement = useRef<GattChar | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? (navigator as unknown as { bluetooth?: WebBluetooth }) : null;
    if (!nav?.bluetooth) {
      setSupport(typeof window !== "undefined" && !window.isSecureContext ? "insecure" : "no-api");
      return;
    }
    if (!nav.bluetooth.getAvailability) {
      setSupport("ok");
      return;
    }
    nav.bluetooth
      .getAvailability()
      .then((ok) => setSupport(ok ? "ok" : "unavailable"))
      .catch(() => setSupport("ok"));
  }, []);

  const push = useCallback(
    (bytes: Uint8Array, src: "device" | "synthetic", tMs?: number) => {
      const now = Date.now();
      const row: Row = { tMs: tMs ?? now - t0.current, at: new Date(now).toISOString(), source: src, bytes: bytes.slice() };
      if (rows.current.length >= MAX_ROWS) rows.current.shift();
      rows.current.push(row);
      const d = decodeHrm(row.bytes, layout);
      // Successive differences are only taken inside a run of notifications
      // that all carried RR values.
      if (d.rrMs.length > 0) runs.current[runs.current.length - 1].push(...d.rrMs);
      else if (runs.current[runs.current.length - 1].length > 0) runs.current.push([]);
      setVersion((v) => v + 1);
    },
    [layout],
  );

  const reset = useCallback(() => {
    rows.current = [];
    runs.current = [[]];
    t0.current = Date.now();
    setSelected(null);
    setLocation(null);
    setBattery(null);
    setCardUrl(null);
    setVersion((v) => v + 1);
  }, []);

  const stopReplay = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const onValue = useCallback(
    (e: Event) => {
      const v = (e.target as GattChar).value;
      if (v) push(new Uint8Array(v.buffer, v.byteOffset, v.byteLength), "device");
    },
    [push],
  );

  const onDisconnect = useCallback(() => {
    runs.current.push([]);
    setMode((m) => (m === "live" ? "ended" : m));
    setStatus("The device disconnected. Data received so far is kept below.");
  }, []);

  const connect = useCallback(async () => {
    const bt = (navigator as unknown as { bluetooth?: WebBluetooth }).bluetooth;
    if (!bt) return;
    stopReplay();
    setStatus(null);
    setMode("connecting");
    try {
      const dev = await bt.requestDevice({
        filters: [{ services: ["heart_rate"] }],
        optionalServices: [BATTERY_LEVEL.serviceUuid],
      });
      reset();
      setSource("device");
      device.current = dev;
      setDeviceName(dev.name || "unnamed heart-rate device");
      dev.addEventListener("gattserverdisconnected", onDisconnect);
      if (!dev.gatt) throw new Error("This device exposes no GATT server.");
      const server = await dev.gatt.connect();
      const hrs = await server.getPrimaryService("heart_rate");
      const m = await hrs.getCharacteristic(layout.uuidNumber);
      measurement.current = m;
      m.addEventListener("characteristicvaluechanged", onValue);
      await m.startNotifications();
      setMode("live");
      try {
        const c = await hrs.getCharacteristic(bsl.uuidNumber);
        const r = decodeBodySensorLocation(await c.readValue(), bsl);
        setLocation(r.description ? `${r.description} (0x${(r.value ?? 0).toString(16).padStart(2, "0")})` : `0x${(r.value ?? 0).toString(16)} — ${r.error}`);
      } catch {
        setLocation("not present on this device");
      }
      try {
        const bs = await server.getPrimaryService(BATTERY_LEVEL.serviceUuid);
        const c = await bs.getCharacteristic(BATTERY_LEVEL.uuid);
        const r = decodeBatteryLevel(await c.readValue());
        setBattery(r.inRange ? `${r.value}%` : `${r.value} — ${r.error}`);
      } catch {
        setBattery("not present, or not readable");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMode((m) => (m === "connecting" ? "idle" : m));
      setStatus(/cancel/i.test(msg) || (err as { name?: string })?.name === "NotFoundError" ? "No device chosen." : `Could not connect: ${msg}`);
    }
  }, [bsl, layout.uuidNumber, onDisconnect, onValue, reset, stopReplay]);

  const disconnect = useCallback(async () => {
    try {
      measurement.current?.removeEventListener("characteristicvaluechanged", onValue);
      await measurement.current?.stopNotifications();
    } catch {
      /* already gone */
    }
    device.current?.gatt?.disconnect();
    setMode("ended");
  }, [onValue]);

  const replay = useCallback(() => {
    stopReplay();
    if (mode === "live") void disconnect();
    reset();
    setSource("synthetic");
    setDeviceName("synthetic sample");
    setStatus(null);
    setLocation("not part of the synthetic sample");
    setBattery("not part of the synthetic sample");
    setMode("replay");
    const packets = syntheticSession(layout);
    let i = 0;
    timer.current = setInterval(() => {
      if (i >= packets.length) {
        stopReplay();
        setMode("ended");
        return;
      }
      push(packets[i].bytes, "synthetic", packets[i].tMs);
      i++;
    }, 1000 / speed);
  }, [disconnect, layout, mode, push, reset, speed, stopReplay]);

  useEffect(() => () => stopReplay(), [stopReplay]);

  /* ── Derived ───────────────────────────────────────────────────────── */

  const snapshot = useMemo(() => {
    void version;
    const all = rows.current;
    const decoded = all.map((r) => decodeHrm(r.bytes, layout));
    const withRr = decoded.filter((d) => d.rrPresent && d.rr.length > 0).length;
    const rrCount = decoded.reduce((n, d) => n + d.rr.length, 0);
    const hrv = rmssd(runs.current);
    const lastT = all.length ? all[all.length - 1].tMs : 0;
    const points = all
      .map((r, i) => ({ t: r.tMs, hr: decoded[i].heartRate, i }))
      .filter((p) => p.hr != null && p.t >= lastT - CHART_SECONDS * 1000) as { t: number; hr: number; i: number }[];
    const distinctRr = new Set(decoded.flatMap((d) => d.rr)).size;
    return { all, decoded, withRr, rrCount, hrv, points, lastT, distinctRr };
  }, [version, layout]);

  const idx = selected != null && selected < snapshot.all.length ? selected : snapshot.all.length - 1;
  const current = idx >= 0 ? snapshot.decoded[idx] : null;
  const currentBytes = idx >= 0 ? snapshot.all[idx].bytes : null;

  const manual = useMemo(() => {
    const b = parseHex(hexInput);
    return b ? { bytes: b, d: decodeHrm(b, layout) } : null;
  }, [hexInput, layout]);

  const total = snapshot.all.length;
  const verdict: { tone: "yes" | "no" | "wait"; text: string } =
    total === 0
      ? { tone: "wait", text: "Waiting for the first notification." }
      : snapshot.withRr > 0
        ? {
            tone: "yes",
            text: `Yes. ${snapshot.withRr} of ${total} notifications carried RR-intervals (${snapshot.rrCount} values). Beat-to-beat data is there, so HRV can be computed from it.`,
          }
        : total < 10
          ? { tone: "wait", text: `None so far in ${total} notification${total > 1 ? "s" : ""}. Give it a few more seconds with the sensor on skin.` }
          : {
              tone: "no",
              text: `No. None of ${total} notifications set bit 4 (“RR-Interval present”). This device sends heart rate only, so HRV cannot be computed from its data: an average BPM does not contain the beat-to-beat timing HRV is made of.`,
            };

  /* ── Output ───────────────────────────────────────────────────────── */

  const flash = (s: string) => {
    setCopied(s);
    setTimeout(() => setCopied(null), 2000);
  };

  const download = (blob: Blob, name: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const copyCsv = async () => {
    const csv = sessionCsv(snapshot.all, layout);
    try {
      await navigator.clipboard.writeText(csv);
      flash("CSV copied");
    } catch {
      download(new Blob([csv], { type: "text/csv" }), "heart-rate-session.csv");
      flash("CSV downloaded");
    }
  };

  const yesNo = snapshot.withRr > 0 ? "yes" : verdict.tone === "no" ? "no" : "not yet known";
  const shareText = `My ${deviceName ?? "device"} sends RR intervals: ${yesNo} (${snapshot.withRr}/${total} notifications${
    snapshot.hrv ? `, demo RMSSD ${snapshot.hrv.value.toFixed(0)} ms` : ""
  }${source === "synthetic" ? ", SYNTHETIC replay" : ""}). Decoded byte by byte at aifitnessapi.com/tools/heart-rate-lab`;

  const drawCard = () => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 630;
    const g = c.getContext("2d");
    if (!g) return;
    g.fillStyle = "#0a0b0d";
    g.fillRect(0, 0, 1200, 630);
    g.fillStyle = "#10b981";
    g.fillRect(0, 0, 1200, 10);
    g.fillStyle = "#9ca3af";
    g.font = "600 30px system-ui, sans-serif";
    g.fillText("BLUETOOTH HEART-RATE LAB", 70, 100);
    g.fillStyle = "#ededed";
    g.font = "700 60px system-ui, sans-serif";
    const name = (deviceName ?? "device").slice(0, 28);
    g.fillText(`My ${name}`, 70, 210);
    g.fillText("sends RR intervals:", 70, 290);
    g.fillStyle = yesNo === "yes" ? "#34d399" : yesNo === "no" ? "#fb7185" : "#fbbf24";
    g.font = "800 120px system-ui, sans-serif";
    g.fillText(yesNo.toUpperCase(), 70, 430);
    g.fillStyle = "#9ca3af";
    g.font = "400 30px system-ui, sans-serif";
    const facts = [`${snapshot.withRr} of ${total} notifications carried RR-intervals`];
    if (snapshot.hrv) facts.push(`demo RMSSD ${snapshot.hrv.value.toFixed(0)} ms (not medical)`);
    g.fillText(facts.join(" · "), 70, 500);
    if (source === "synthetic") {
      g.fillStyle = "#fbbf24";
      g.font = "700 30px system-ui, sans-serif";
      g.fillText("SYNTHETIC REPLAY — not a real device", 70, 550);
    }
    g.fillStyle = "#ededed";
    g.font = "600 30px system-ui, sans-serif";
    g.fillText("aifitnessapi.com/tools/heart-rate-lab", 70, 595);
    setCardUrl(c.toDataURL("image/png"));
  };

  /* ── Chart ────────────────────────────────────────────────────────── */

  const W = 640;
  const H = 200;
  const pad = { l: 36, r: 10, t: 10, b: 22 };
  const pts = snapshot.points;
  const yMin = pts.length ? Math.floor((Math.min(...pts.map((p) => p.hr)) - 5) / 5) * 5 : 40;
  const yMax = pts.length ? Math.ceil((Math.max(...pts.map((p) => p.hr)) + 5) / 5) * 5 : 120;
  const xMax = Math.max(snapshot.lastT, CHART_SECONDS * 1000);
  const xMin = xMax - CHART_SECONDS * 1000;
  const x = (t: number) => pad.l + ((t - xMin) / (xMax - xMin)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - pad.t - pad.b);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.hr).toFixed(1)}`).join("");
  const hovered = hover != null ? pts[hover] : null;

  const onChartMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pts.length) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    for (let i = 1; i < pts.length; i++) if (Math.abs(x(pts[i].t) - px) < Math.abs(x(pts[best].t) - px)) best = i;
    setHover(best);
  };

  /* ── Render ───────────────────────────────────────────────────────── */

  const live = mode === "live" || mode === "connecting";

  return (
    <div className="mt-8 space-y-6">
      <div className={card}>
        {support === "checking" ? (
          <p className="text-sm text-[var(--muted)]">Checking whether this browser exposes Web Bluetooth…</p>
        ) : support === "ok" ? (
          <p className="text-sm text-[var(--muted)]">
            This browser exposes Web Bluetooth. Press Connect, pick a heart-rate device in the browser&rsquo;s chooser
            (a chest strap, or a watch broadcasting heart rate), and every notification it sends appears below.
          </p>
        ) : (
          <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm leading-relaxed text-[var(--fg)]">
            <strong>
              {support === "insecure"
                ? "Web Bluetooth needs a secure (https) page."
                : support === "unavailable"
                  ? "This browser has Web Bluetooth, but reports no usable Bluetooth adapter (or it is blocked)."
                  : "This browser does not expose Web Bluetooth (navigator.bluetooth is missing)."}
            </strong>{" "}
            You cannot connect a device from here, but the decoder works the same on a recorded stream: press{" "}
            <em>Replay a synthetic sample</em> to watch it decode a byte stream this page generates, or paste your own
            bytes further down.
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className={btn} onClick={connect} disabled={support !== "ok" || live}>
            {mode === "connecting" ? "Connecting…" : "Connect a heart-rate device"}
          </button>
          {mode === "live" ? (
            <button type="button" className={btn2} onClick={disconnect}>
              Disconnect
            </button>
          ) : null}
          <button type="button" className={btn2} onClick={replay} data-action="replay">
            Replay a synthetic sample
          </button>
          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            speed
            <select
              className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[var(--fg)]"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={1}>1×</option>
              <option value={4}>4×</option>
              <option value={10}>10×</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Nothing leaves your device: the bytes are decoded in this tab, held in memory, and gone when you close it. The
          page makes no request with them.
        </p>
        {status ? <p className="mt-3 text-sm text-[var(--fg)]">{status}</p> : null}
      </div>

      {source === "synthetic" ? (
        <p className="rounded-xl border-2 border-amber-500 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-[var(--fg)]" data-synthetic="true">
          SYNTHETIC — these bytes are generated by this page to exercise the decoder. They were not recorded from any
          device, and the heart rate and RR values in them are made up.
        </p>
      ) : null}

      {total > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className={card}>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Heart rate</p>
              <p className="mt-1 text-4xl font-bold text-[var(--fg)]" data-bpm>
                {snapshot.decoded[total - 1].heartRate ?? "—"}
                <span className="ml-1 text-base font-medium text-[var(--muted)]">bpm</span>
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {deviceName} · {total} notifications
              </p>
            </div>
            <div className={card}>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Body Sensor Location ({bsl.uuid})</p>
              <p className="mt-1 text-sm text-[var(--fg)]">{location ?? "—"}</p>
              <p className="mt-3 text-xs uppercase tracking-wider text-[var(--muted)]">
                Battery Level (0x{BATTERY_LEVEL.uuid.toString(16).toUpperCase()})
              </p>
              <p className="mt-1 text-sm text-[var(--fg)]">{battery ?? "—"}</p>
            </div>
            <div
              className={`${card} ${
                verdict.tone === "yes" ? "border-emerald-500/60" : verdict.tone === "no" ? "border-rose-500/60" : ""
              }`}
              data-verdict={verdict.tone}
            >
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Does it send RR intervals?</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--fg)]">{verdict.text}</p>
            </div>
          </div>

          <figure className={card}>
            <figcaption className="text-sm font-semibold text-[var(--fg)]">
              Heart rate, last {CHART_SECONDS} seconds (bpm)
            </figcaption>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-3 w-full"
              role="img"
              aria-label={`Heart rate over the last ${CHART_SECONDS} seconds`}
              onMouseMove={onChartMove}
              onMouseLeave={() => setHover(null)}
            >
              {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
                <g key={v}>
                  <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth={1} />
                  <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted)">
                    {Math.round(v)}
                  </text>
                </g>
              ))}
              <text x={W - pad.r} y={H - 4} textAnchor="end" fontSize={11} fill="var(--muted)">
                now
              </text>
              <text x={pad.l} y={H - 4} fontSize={11} fill="var(--muted)">
                −{CHART_SECONDS}s
              </text>
              <path d={path} fill="none" stroke="var(--color-brand-500)" strokeWidth={2} strokeLinejoin="round" />
              {hovered ? (
                <g>
                  <line x1={x(hovered.t)} x2={x(hovered.t)} y1={pad.t} y2={H - pad.b} stroke="var(--muted)" strokeDasharray="3 3" />
                  <circle cx={x(hovered.t)} cy={y(hovered.hr)} r={4} fill="var(--color-brand-500)" stroke="var(--bg)" strokeWidth={2} />
                  <text
                    x={Math.min(x(hovered.t) + 8, W - 90)}
                    y={pad.t + 14}
                    fontSize={12}
                    fill="var(--fg)"
                  >
                    {hovered.hr} bpm · {(hovered.t / 1000).toFixed(0)}s
                  </text>
                </g>
              ) : null}
            </svg>
          </figure>

          {current && currentBytes ? (
            <div className={card} data-packet>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-bold text-[var(--fg)]">
                  Notification {idx + 1} of {total}
                  {selected == null ? " (latest)" : ""}
                </h3>
                <div className="flex gap-2">
                  <button type="button" className={btn2} disabled={idx <= 0} onClick={() => setSelected(Math.max(0, idx - 1))}>
                    ← older
                  </button>
                  <button
                    type="button"
                    className={btn2}
                    disabled={selected == null}
                    onClick={() => setSelected(idx + 1 >= total - 1 ? null : idx + 1)}
                  >
                    newer →
                  </button>
                </div>
              </div>
              <PacketView d={current} bytes={currentBytes} layout={layout} />
            </div>
          ) : null}

          <div className={card}>
            <h3 className="text-base font-bold text-[var(--fg)]">RMSSD over the RR intervals received</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-600">
              Demo only — not a medical or training measurement
            </p>
            {snapshot.hrv ? (
              <p className="mt-2 text-3xl font-bold text-[var(--fg)]" data-rmssd>
                {snapshot.hrv.value.toFixed(1)}
                <span className="ml-1 text-base font-medium text-[var(--muted)]">ms</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-[var(--fg)]">
                {snapshot.withRr > 0
                  ? "Needs at least two consecutive RR intervals."
                  : "No RR intervals received, so there is nothing to compute it from."}
              </p>
            )}
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              {snapshot.hrv ? `${snapshot.hrv.differences} successive differences, ` : ""}
              {snapshot.rrCount} RR values, {snapshot.distinctRr} distinct. Root mean square of the differences between
              consecutive RR intervals, never taken across a notification without RR values or a reconnect. No artefact
              or ectopic-beat correction, no minimum duration, no baseline: a number to see the arithmetic with, not one to
              judge recovery by.
            </p>
          </div>

          <div className={card}>
            <h3 className="text-base font-bold text-[var(--fg)]">Take it with you</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className={btn2} onClick={copyCsv}>
                Copy session as CSV
              </button>
              <button type="button" className={btn2} onClick={drawCard}>
                Make a share card
              </button>
              <button
                type="button"
                className={btn2}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareText);
                    flash("Result copied");
                  } catch {
                    flash("Copy failed");
                  }
                }}
              >
                Copy result text
              </button>
              {copied ? <span className="self-center text-sm text-emerald-600">{copied}</span> : null}
            </div>
            <p className="mt-2 font-mono text-xs text-[var(--muted)]">{shareText}</p>
            {cardUrl ? (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cardUrl} alt={`Share card: my ${deviceName} sends RR intervals: ${yesNo}`} className="w-full rounded-xl border border-[var(--border)]" />
                <a href={cardUrl} download="rr-intervals-card.png" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-500">
                  Save the PNG
                </a>
              </div>
            ) : null}
          </div>

          <details className={card}>
            <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
              Last {Math.min(30, total)} notifications, raw
            </summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="text-[var(--muted)]">
                  <tr>
                    <th className="py-1 pr-3">#</th>
                    <th className="py-1 pr-3">t (s)</th>
                    <th className="py-1 pr-3">bytes</th>
                    <th className="py-1 pr-3">bpm</th>
                    <th className="py-1">RR (1/1024 s)</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.all
                    .map((r, i) => ({ r, i }))
                    .slice(-30)
                    .reverse()
                    .map(({ r, i }) => (
                      <tr key={i} className="cursor-pointer border-t border-[var(--border)] hover:bg-[var(--bg)]" onClick={() => setSelected(i)}>
                        <td className="py-1 pr-3">{i + 1}</td>
                        <td className="py-1 pr-3">{(r.tMs / 1000).toFixed(1)}</td>
                        <td className="py-1 pr-3">{toHex(r.bytes)}</td>
                        <td className="py-1 pr-3">{snapshot.decoded[i].heartRate ?? "—"}</td>
                        <td className="py-1">{snapshot.decoded[i].rr.join(" ") || "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : null}

      <div className={card}>
        <h3 className="text-base font-bold text-[var(--fg)]">Decode any 0x2A37 value</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Paste the bytes of one notification in hex, from nRF Connect, a log or a capture. The default is the value
          behind the Web Bluetooth specification&rsquo;s own example.
        </p>
        <input
          className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--fg)]"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          spellCheck={false}
          aria-label="Heart Rate Measurement value in hex"
        />
        {manual ? (
          <PacketView d={manual.d} bytes={manual.bytes} layout={layout} />
        ) : (
          <p className="mt-3 text-sm text-rose-600">Not hex: use pairs of 0–9 and A–F, e.g. 16 48 1A 04.</p>
        )}
      </div>
    </div>
  );
}

function rrText(values: number[], divisor: number | null, unit: string) {
  const raw = `${values.join(", ")}${unit ? ` × ${unit}` : ""}`;
  return divisor ? `${raw} = ${values.map((v) => ((v * 1000) / divisor).toFixed(1)).join(", ")} ms` : raw;
}

function PacketView({ d, bytes, layout }: { d: HrmDecoded; bytes: Uint8Array; layout: HrmLayout }) {
  const kindOf = (i: number) => d.spans.find((s) => i >= s.start && i < s.end);
  const fieldUnit = (f: HrmDecoded["fields"][number]) => {
    const lf = layout.fields.find((x) => x.name === f.name);
    if (f.kind === "rr" && lf?.scale) return lf.scale.label;
    return f.unit?.name ?? f.unit?.id ?? "";
  };
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-1.5" aria-label="Bytes, coloured by field">
        {Array.from(bytes).map((b, i) => {
          const s = kindOf(i);
          return (
            <span
              key={i}
              title={s ? `${s.label} · offset ${i}` : `offset ${i}`}
              className={`inline-flex flex-col items-center rounded-md border px-2 py-1 font-mono text-sm text-[var(--fg)] ${KIND_STYLE[s?.kind ?? "trailing"]}`}
            >
              {b.toString(16).toUpperCase().padStart(2, "0")}
              <span className="text-[9px] text-[var(--muted)]">{i}</span>
            </span>
          );
        })}
      </div>
      <p className="mt-2 flex flex-wrap gap-3 text-[11px] text-[var(--muted)]">
        {(["flags", "hr", "energy", "rr", "trailing"] as SpanKind[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1">
            <span className={`inline-block h-3 w-3 rounded-sm border ${KIND_STYLE[k]}`} />
            {k === "flags" ? layout.flagsName : k === "hr" ? "Heart rate value" : k === "energy" ? "Energy Expended" : k === "rr" ? "RR-interval" : "not described"}
          </span>
        ))}
      </p>

      {d.flags != null ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="mb-1 text-left text-xs font-semibold text-[var(--fg)]">
              {layout.flagsName} = 0x{d.flags.toString(16).toUpperCase().padStart(2, "0")} = {d.flags.toString(2).padStart(8, "0")}b
            </caption>
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-1 pr-3">bit</th>
                <th className="py-1 pr-3">value</th>
                <th className="py-1">the SIG&rsquo;s description</th>
              </tr>
            </thead>
            <tbody>
              {d.bits.map((b) => (
                <tr key={b.label} className="border-t border-[var(--border)] align-top">
                  <td className="py-1 pr-3 font-mono">{b.label}</td>
                  <td className="py-1 pr-3 font-mono">{b.values.join("")}</td>
                  <td className="whitespace-pre-line py-1 text-[var(--muted)]">{b.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[var(--muted)]">
            <tr>
              <th className="py-1 pr-3">field</th>
              <th className="py-1 pr-3">type</th>
              <th className="py-1 pr-3">why</th>
              <th className="py-1 pr-3">offset</th>
              <th className="py-1 pr-3">bytes</th>
              <th className="py-1">value</th>
            </tr>
          </thead>
          <tbody>
            {d.fields.map((f) => (
              <tr key={f.name} className={`border-t border-[var(--border)] align-top ${f.present ? "" : "opacity-50"}`}>
                <td className="py-1 pr-3 text-[var(--fg)]">{f.name}</td>
                <td className="py-1 pr-3 font-mono">{f.type}</td>
                <td className="py-1 pr-3 text-[var(--muted)]">
                  {f.present ? "present" : "absent"}: {f.presence.evidence}
                </td>
                <td className="py-1 pr-3 font-mono">{f.present && f.offset != null ? f.offset : "—"}</td>
                <td className="py-1 pr-3 font-mono">
                  {f.present && f.offset != null && f.length ? toHex(bytes.slice(f.offset, f.offset + f.length)) : "—"}
                </td>
                <td className="py-1 font-mono text-[var(--fg)]">
                  {!f.present
                    ? "—"
                    : f.values
                      ? f.values.length
                        ? rrText(f.values, layout.fields.find((x) => x.name === f.name)?.scale?.divisor ?? null, fieldUnit(f))
                        : "none"
                      : `${f.value ?? "—"} ${fieldUnit(f)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Sensor contact: <span className="text-[var(--fg)]">{d.sensorContact}</span>
        {d.reservedSet.length ? ` · reserved bit${d.reservedSet.length > 1 ? "s" : ""} ${d.reservedSet.join(", ")} set` : ""}
      </p>
      {d.errors.length ? (
        <ul className="mt-2 list-disc pl-5 text-xs text-rose-600">
          {d.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
