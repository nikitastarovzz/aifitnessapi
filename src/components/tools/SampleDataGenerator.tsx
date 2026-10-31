"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SampleOutput, SamplePlatform, SampleSpec, SampleSpecCore } from "@/lib/sampleData.mjs";

/**
 * The client half of /tools/sample-data.
 *
 * The specs arrive as props, already trimmed on the server from the generated
 * datasets (see buildSampleSpecs). The generator itself is loaded on the first
 * click, so the page ships a form and nothing else until someone asks for data.
 * Nothing is sent anywhere: the files are built in the browser and handed to
 * the download as a Blob.
 */

/** What the client needs of a spec: the reference tables render on the server. */
export type ClientSpec = SampleSpecCore & { [k: string]: unknown };

const PLATFORMS: { id: SamplePlatform; label: string; offsetsLabel: string; offsetsNote: string }[] = [
  {
    id: "healthkit",
    label: "Apple HealthKit",
    offsetsLabel: "Attach HKMetadataKeyTimeZone",
    offsetsNote:
      "HealthKit samples carry absolute dates; the zone travels only as optional metadata. Untick to get samples with no zone at all — the case your code has to survive.",
  },
  {
    id: "health-connect",
    label: "Android Health Connect",
    offsetsLabel: "Write zone offsets",
    offsetsNote:
      "Every Health Connect time field has a nullable ZoneOffset beside it. Untick to write null offsets, as a record from an app that did not set them would have.",
  },
  {
    id: "google-health-api",
    label: "Google Health API",
    offsetsLabel: "UTC offsets (required)",
    offsetsNote:
      "The discovery document marks every utcOffset field Required, so offsets are always written here.",
  },
];

const ZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
];

type Generator = typeof import("@/lib/sampleData.mjs");

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={() =>
        navigator.clipboard.writeText(text).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          },
          () => setCopied(false),
        )
      }
      className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const input =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-brand-400";
const btn =
  "rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--bg)]";

function firstRecord(r: unknown[] | { dataPoints: unknown[] }): unknown {
  return Array.isArray(r) ? r[0] : r.dataPoints[0];
}

export default function SampleDataGenerator({ specs, maxDays }: { specs: ClientSpec[]; maxDays: number }) {
  const [platform, setPlatform] = useState<SamplePlatform>("health-connect");
  const [picked, setPicked] = useState<Record<SamplePlatform, string[]>>({
    healthkit: ["steps", "heartRate"],
    "health-connect": ["steps", "sleep"],
    "google-health-api": ["steps", "sleep"],
  });
  const [start, setStart] = useState("2026-10-31");
  const [end, setEnd] = useState("2026-11-02");
  const [zone, setZone] = useState("America/New_York");
  const [seed, setSeed] = useState("aifitnessapi");
  const [offsets, setOffsets] = useState(true);
  const [out, setOut] = useState<SampleOutput | null>(null);
  const [lib, setLib] = useState<Generator | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const zones = useMemo(() => {
    let local: string | null = null;
    try {
      local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      local = null;
    }
    return local && !ZONES.includes(local) ? [...ZONES, local] : ZONES;
  }, []);

  const mine = specs.filter((s) => s.platform === platform);
  const chosen = picked[platform];
  const pinfo = PLATFORMS.find((p) => p.id === platform)!;

  async function generate() {
    setError(null);
    setBusy(true);
    try {
      const g = lib ?? (await import("@/lib/sampleData.mjs"));
      if (!lib) setLib(g);
      if (chosen.length === 0) throw new Error("Pick at least one type.");
      setOut(
        g.generateSampleData({
          specs: specs as unknown as SampleSpec[],
          platform,
          metrics: chosen,
          start,
          end,
          timeZone: zone,
          seed: seed || "0",
          offsets: platform === "google-health-api" ? true : offsets,
        }),
      );
    } catch (e) {
      setOut(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const base = `synthetic-${platform}-${(seed || "0").replace(/[^A-Za-z0-9_-]+/g, "_")}-${start}_${end}`;
  const outSpecs = out ? specs.filter((s) => s.platform === out._synthetic.platform && s.typeName in out.records) : [];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-[var(--fg)]">
        Synthetic test data. Every value is generated from your seed — not real, not physiologically
        validated, and the ranges are illustrative.
      </p>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Platform</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-platform={p.id}
              aria-pressed={platform === p.id}
              onClick={() => {
                setPlatform(p.id);
                setOut(null);
              }}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                platform === p.id
                  ? "border-brand-400 bg-brand-500/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Types</legend>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {mine.map((s) => (
            <li key={s.typeName}>
              <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  data-metric={s.metric}
                  className="mt-1"
                  checked={chosen.includes(s.metric)}
                  onChange={(e) => {
                    const next = e.target.checked ? [...chosen, s.metric] : chosen.filter((m) => m !== s.metric);
                    setPicked({ ...picked, [platform]: next });
                  }}
                />
                <span>
                  <span className="block font-medium text-[var(--fg)]">{s.label}</span>
                  <span className="block break-all font-mono text-[11px] text-[var(--muted)]">{s.typeName}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-[var(--fg)]">
          First day
          <input type="date" id="sd-start" className={input} value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="text-sm text-[var(--fg)]">
          Last day (at most {maxDays} days)
          <input type="date" id="sd-end" className={input} value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <label className="text-sm text-[var(--fg)]">
          Time zone
          <select id="sd-zone" className={input} value={zone} onChange={(e) => setZone(e.target.value)}>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[var(--fg)]">
          Seed
          <input id="sd-seed" className={input} value={seed} onChange={(e) => setSeed(e.target.value)} />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-2 text-sm text-[var(--fg)]">
        <input
          type="checkbox"
          className="mt-1"
          checked={platform === "google-health-api" ? true : offsets}
          disabled={platform === "google-health-api"}
          onChange={(e) => setOffsets(e.target.checked)}
        />
        <span>
          {pinfo.offsetsLabel}
          <span className="block text-xs text-[var(--muted)]">{pinfo.offsetsNote}</span>
        </span>
      </label>

      <button
        type="button"
        data-action="generate"
        onClick={generate}
        disabled={busy}
        className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
      >
        {busy ? "Generating…" : "Generate synthetic data"}
      </button>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      {out ? (
        <div data-result className="mt-6 border-t border-[var(--border)] pt-5">
          <p className="text-sm text-[var(--fg)]">
            <strong>{Object.values(out._synthetic.counts).reduce((a, b) => a + b, 0)}</strong>{" "}synthetic
            records, {out._synthetic.timeZone}, seed <code className="font-mono">{out._synthetic.seed}</code>.
          </p>
          {out._synthetic.offsetTransitions.length > 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">
              The offset changes inside this range:{" "}
              {out._synthetic.offsetTransitions.map((t) => `${t.from} → ${t.to} at ${t.at}`).join("; ")}. Records
              on either side carry different offsets, and a record that spans the change carries both — the
              case{" "}
              <Link href="/day-boundaries" className="font-medium text-brand-600 hover:text-brand-500">
                the day-boundary demo
              </Link>{" "}
              is about.
            </p>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted)]">
              No offset change in this range. Pick dates around a daylight-saving change to get records whose
              start and end offsets differ.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              data-download="json"
              className={btn}
              onClick={() => download(`${base}.json`, JSON.stringify(out, null, 2) + "\n", "application/json")}
            >
              Download JSON (all types)
            </button>
            {outSpecs
              .filter((s) => s.tabular)
              .map((s) =>
                lib ? (
                  <button
                    key={s.typeName}
                    type="button"
                    data-download="csv"
                    data-type={s.typeName}
                    className={btn}
                    onClick={() => download(`${base}-${s.typeName}.csv`, lib.toCsv(out.records[s.typeName]), "text/csv")}
                  >
                    CSV: {s.typeName}
                  </button>
                ) : null,
              )}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            The JSON opens with a <code className="font-mono">_synthetic</code> block (notice, seed, zone, counts,
            encoding); every CSV row starts with a <code className="font-mono">SYNTHETIC TEST DATA</code> column.
            Same seed, same settings, same file — on any machine whose browser has the same time-zone rules.
          </p>

          {outSpecs.map((s) => {
            const rec = out.records[s.typeName];
            const count = out._synthetic.counts[s.typeName];
            const sample = count > 0 ? JSON.stringify(firstRecord(rec), null, 2) : "(no records in range)";
            const text = `// SYNTHETIC TEST DATA — aifitnessapi.com/tools/sample-data\n${s.snippet}\n\n// First generated record:\n${sample}\n`;
            return (
              <section key={s.typeName} className="mt-6" data-type-result={s.typeName}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-[var(--fg)]">
                    {s.label} · <span className="font-mono">{s.typeName}</span> · {count} records
                  </h3>
                  <CopyButton text={text} label={`the ${s.typeName} mapping`} />
                </div>
                <pre className="mt-2 max-h-96 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-[12px] leading-relaxed text-[var(--fg)]">
                  <code className="font-mono">{text}</code>
                </pre>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
