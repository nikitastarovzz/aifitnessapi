"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { compileRules, describeHits, fileContext, guessContext, scanText, summarize, todayUtc, type DescribedHit, type ScanContext } from "@/lib/deprecationScan.mjs";
import { DS_BUNDLE } from "@/lib/deprecationScannerText";

/**
 * The interactive half of /tools/deprecation-scanner. Pasted text and opened
 * files are read and scanned in this tab with src/lib/deprecationScan.mjs and
 * the generated rule bundle — the same two files the GitHub Action runs.
 * Nothing is fetched or uploaded, and nothing is stored.
 */

const CONTEXT_OPTIONS: { value: "auto" | ScanContext; label: string }[] = [
  { value: "auto", label: "Detect" },
  { value: "code", label: "Code or a list of URLs" },
  { value: "npm-manifest", label: "package.json" },
  { value: "pypi-manifest", label: "requirements.txt / pyproject.toml" },
  { value: "gradle", label: "build.gradle(.kts)" },
  { value: "podfile", label: "Podfile" },
  { value: "pubspec", label: "pubspec.yaml" },
];

/** Synthetic examples, written for this page; each line is one the rules know. */
const SAMPLES: { label: string; name: string; text: string }[] = [
  {
    label: "Python (Fitbit, Oura V1)",
    name: "sync.py",
    text: [
      "import requests",
      'FITBIT = "https://api.fitbit.com"',
      'steps = requests.get(f"{FITBIT}/1/user/-/activities/steps/date/{day}/7d.json", headers=h)',
      'hr = requests.get(f"{FITBIT}/1/user/-/activities/heart/date/{day}/1d/1min.json", headers=h)',
      'token = requests.post("https://api.fitbit.com/oauth2/token", data=form)',
      "sleep_v1 = requests.get('https://api.ouraring.com/v1/sleep', headers=h)",
    ].join("\n"),
  },
  {
    label: "Android (Google Fit)",
    name: "build.gradle.kts + Reader.kt",
    text: [
      'implementation("com.google.android.gms:play-services-fitness:21.3.0")',
      "Fitness.getHistoryClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))",
      "Fitness.getSessionsClient(this, account)",
      "Fitness.getGoalsClient(requireContext(), getGoogleAccount())",
      "import com.samsung.android.sdk.healthdata.HealthDataStore",
    ].join("\n"),
  },
  {
    label: "package.json",
    name: "package.json",
    text: JSON.stringify({ dependencies: { "@mediapipe/pose": "0.5.1675469404", "@tensorflow-models/posenet": "2.2.2", "react-native-google-fit": "0.19.1", "@mediapipe/tasks-vision": "0.10.14" } }, null, 2),
  },
  {
    label: "requirements.txt",
    name: "requirements.txt",
    text: ["requests==2.32.3", "fitbit==0.3.1", "stravalib>=2.0"].join("\n"),
  },
  {
    label: "A list of URLs",
    name: "urls.txt",
    text: [
      "https://www.googleapis.com/fitness/v1/users/me/dataSources",
      "https://api.tryterra.co/v2/auth/generateWidgetSession",
      "https://api.prod.whoop.com/developer/v1/recovery",
      "https://www.strava.com/api/v3/clubs/123/members",
      "https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints",
    ].join("\n"),
  },
];

type Source = { name: string; text: string; context: ScanContext };
type Result = { name: string; context: ScanContext; hits: DescribedHit[] };

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-[0.85em]";
const LEVEL = {
  error: { label: "Gone or past its date", cls: "bg-red-500/15 text-red-700 dark:text-red-300" },
  warning: { label: "Deprecated or dying", cls: "bg-amber-500/15 text-amber-800 dark:text-amber-300" },
};

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return href.startsWith("/") ? (
    <Link href={href} className={linkCls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={linkCls} rel="noopener">
      {children}
    </a>
  );
}

function LineView({ h }: { h: DescribedHit }) {
  const start = h.column - 1;
  const end = start + h.match.length;
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg bg-[var(--bg)] p-2 text-xs leading-relaxed text-[var(--fg)]">
      <code>
        <span className="select-none text-[var(--muted)]">{String(h.line).padStart(4, " ")}  </span>
        {h.lineText.slice(0, start)}
        <mark className="rounded bg-amber-300/40 text-inherit dark:bg-amber-400/30">{h.lineText.slice(start, end)}</mark>
        {h.lineText.slice(end)}
      </code>
    </pre>
  );
}

function HitCard({ h, file }: { h: DescribedHit; file: string }) {
  const e = h.entry;
  const r = h.rule;
  const lvl = LEVEL[h.severity.level];
  const when = e.end ? `${e.endLabel}: ${e.endText}` : e.endLabel;
  return (
    <li className="rounded-2xl border border-[var(--border)] p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-semibold ${lvl.cls}`}>{lvl.label}</span>
        <span className="font-mono text-[var(--muted)]">
          {file}:{h.line}:{h.column}
        </span>
      </div>
      <p className="mt-2 font-semibold text-[var(--fg)]">{r.label}</p>
      <LineView h={h} />
      <dl className="mt-3 grid gap-2 text-sm leading-relaxed text-[var(--muted)]">
        <div>
          <dt className="inline font-semibold text-[var(--fg)]">What happened: </dt>
          <dd className="inline">
            <Link href={e.graveyard} className={linkCls}>
              {e.name}
            </Link>{" "}
            ({e.vendor}) is {e.statusLabel.toLowerCase()}. {when}
            {h.severity.passed && e.status !== "dead" ? " (that date has passed)" : ""}.{" "}
            <q className="italic">{e.quote}</q> —{" "}
            <ExtLink href={e.url}>{e.publisher}</ExtLink>, read {e.checkedOn}.
          </dd>
        </div>
        <div>
          <dt className="inline font-semibold text-[var(--fg)]">Replacement: </dt>
          <dd className="inline">
            {r.replacement.length ? (
              r.replacement.map((x, i) => (
                <span key={x.label}>
                  {i > 0 ? "; " : ""}
                  {x.href ? <ExtLink href={x.href}>{x.label}</ExtLink> : x.label}
                </span>
              ))
            ) : (
              <span>{r.replacementNote ?? "The vendor names none."}</span>
            )}
            {r.replacementQuotes.length > 0 && (
              <span className="block text-xs">
                {r.replacementQuotes.map((q) => (
                  <span key={q.quote} className="block">
                    <q>{q.quote}</q> — <ExtLink href={q.url}>source</ExtLink>
                  </span>
                ))}
              </span>
            )}
          </dd>
        </div>
        {(e.migrate || r.more) && (
          <div>
            <dt className="inline font-semibold text-[var(--fg)]">Next: </dt>
            <dd className="inline">
              {e.migrate && <ExtLink href={e.migrate.href}>{e.migrate.label}</ExtLink>}
              {e.migrate && r.more ? " · " : ""}
              {r.more && <ExtLink href={r.more.href}>{r.more.label}</ExtLink>}
            </dd>
          </div>
        )}
      </dl>
      <details className="mt-2 text-xs text-[var(--muted)]">
        <summary className="cursor-pointer">Why this pattern</summary>
        <ul className="mt-2 space-y-1">
          {r.basis.map((b) => (
            <li key={`${b.url}${b.literal}`}>
              <code className={code}>{b.literal}</code> from <q>{b.quote}</q> — <ExtLink href={b.url}>{b.publisher}</ExtLink>, read {b.checkedOn}
              {b.capturedOn ? ` (capture of ${b.capturedOn})` : ""}
              {b.via === "snapshot" ? " through a source snapshot" : ""}.
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

export default function DeprecationScanner() {
  const compiled = useMemo(() => compileRules(DS_BUNDLE), []);
  const [text, setText] = useState("");
  const [name, setName] = useState("pasted text");
  const [ctx, setCtx] = useState<"auto" | ScanContext>("auto");
  const [files, setFiles] = useState<Source[]>([]);
  const [results, setResults] = useState<Result[] | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function run(sources: Source[]) {
    const today = todayUtc();
    setResults(sources.map((s) => ({ name: s.name, context: s.context, hits: describeHits(scanText(s.text, { compiled, context: s.context }), DS_BUNDLE, today) })));
  }

  function scanPasted() {
    const sources: Source[] = [];
    if (text.trim()) sources.push({ name, text, context: ctx === "auto" ? guessContext(text) : ctx });
    run([...sources, ...files]);
  }

  async function openFiles(list: FileList | null) {
    if (!list) return;
    const read: Source[] = [];
    for (const f of Array.from(list)) {
      if (f.size > 5 * 1024 * 1024) continue;
      const t = await f.text();
      if (t.slice(0, 8000).includes("\u0000")) continue;
      read.push({ name: f.name, text: t, context: fileContext(f.name) });
    }
    setFiles(read);
    run([...(text.trim() ? [{ name, text, context: ctx === "auto" ? guessContext(text) : ctx }] : []), ...read]);
  }

  const all = results?.flatMap((r) => r.hits) ?? [];
  const sum = summarize(all);

  return (
    <div className="mt-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="ds-input">
          Paste code, a manifest or URLs
        </label>
        <textarea
          id="ds-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setName("pasted text");
          }}
          rows={10}
          spellCheck={false}
          placeholder={'https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json\nimplementation("com.google.android.gms:play-services-fitness:21.3.0")'}
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--fg)]"
        />
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium text-[var(--fg)]">
            What it is
            <select value={ctx} onChange={(e) => setCtx(e.target.value as "auto" | ScanContext)} className="mt-1.5 block rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]">
              {CONTEXT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={scanPasted} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">
            Scan
          </button>
          <button type="button" onClick={() => fileInput.current?.click()} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--fg)]">
            Open files…
          </button>
          <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => openFiles(e.target.files)} aria-label="Open files to scan" />
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Samples (synthetic):{" "}
          {SAMPLES.map((s, i) => (
            <span key={s.label}>
              {i > 0 ? " · " : ""}
              <button
                type="button"
                className={linkCls}
                onClick={() => {
                  setText(s.text);
                  setName(s.name);
                  setCtx("auto");
                  setFiles([]);
                  run([{ name: s.name, text: s.text, context: guessContext(s.text) }]);
                }}
              >
                {s.label}
              </button>
            </span>
          ))}
        </p>
        {files.length > 0 && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Opened in this tab: {files.map((f) => f.name).join(", ")}
          </p>
        )}
      </div>

      <div aria-live="polite">
        {results && (
          <div className="mt-6">
            <p className="text-sm text-[var(--fg)]">
              {sum.total === 0
                ? `No references found in ${results.length === 1 ? results[0].name : `${results.length} inputs`}. The scanner only knows the APIs listed below, so a clean result is not a clean bill of health.`
                : `${sum.total} reference${sum.total === 1 ? "" : "s"} found: ${sum.errors} to APIs that are gone or past the date their vendor gave, ${sum.warnings} to deprecated or dying ones.`}
            </p>
            {results
              .filter((r) => r.hits.length)
              .map((r) => (
                <section key={r.name} className="mt-4">
                  <h3 className="text-base font-semibold text-[var(--fg)]">
                    {r.name} <span className="text-xs font-normal text-[var(--muted)]">(read as {CONTEXT_OPTIONS.find((o) => o.value === r.context)?.label ?? r.context})</span>
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {r.hits.map((h) => (
                      <HitCard key={`${h.line}:${h.column}:${h.ruleId}`} h={h} file={r.name} />
                    ))}
                  </ul>
                </section>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
