"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/**
 * HealthKit permission builder.
 *
 * Pick the identifiers your app touches, say whether you read or write each
 * one, and get the three artefacts a first HealthKit integration needs: the
 * Info.plist usage-description keys, the toShare/toRead sets for
 * requestAuthorization, and the Android record names for the types this site
 * has verified on both platforms.
 *
 * The differentiator is the refusal. Apple documents, in prose, that some
 * sample types cannot be saved by an app; those identifiers are carried in
 * healthkitWritability.ts with the sentence they came from, and this tool
 * disables their write toggle and shows the evidence rather than letting you
 * generate a toShare set that will never work. Characteristic types get the
 * same treatment for a different reason: they are stored answers about a
 * person, not samples an app writes.
 *
 * Nothing here is invented. Every Swift symbol emitted appears in this site's
 * own verified HealthKit integration guide; where an initializer is NOT
 * established there (category and characteristic types), the generator emits a
 * comment pointing at the guide instead of guessing a constructor. Android
 * output is record names only — no permission strings, no Kotlin.
 */

export type PermFamily = "quantity" | "category" | "characteristic" | "workoutActivity";

export type PermOption = {
  /** Swift case name, e.g. "stepCount". */
  case: string;
  family: PermFamily;
  /** Apple's topic grouping, shown to disambiguate similar names. */
  group: string;
  /** Apple's one-line abstract, verbatim. */
  abstract: string;
  /** Apple's sentence stating the samples are read-only; null when unstated. */
  readOnlyEvidence: string | null;
  /** Health Connect record names, only where verified on both platforms. */
  android: string | null;
};

type Intent = "read" | "write" | "readwrite";

type Pick = { case: string; intent: Intent };

const TOOL_PATH = "/tools/permission-builder";
const GEN_LINE =
  "Generated from aifitnessapi.com/tools/permission-builder — verify against current Apple docs before shipping.";
const GUIDE_URL = "https://aifitnessapi.com/integrate/healthkit";

const FAMILY_LABEL: Record<PermFamily, string> = {
  quantity: "quantity",
  category: "category",
  characteristic: "characteristic",
  workoutActivity: "workout activity",
};

/** Types whose write toggle is off, and the reason it is off. */
function writeBlockedReason(o: PermOption): string | null {
  if (o.readOnlyEvidence) return "apple-read-only";
  if (o.family === "characteristic") return "characteristic";
  if (o.family === "workoutActivity") return "workout-constant";
  return null;
}

function indentList(lines: string[]): string {
  return lines.map((l) => `        ${l}`).join("\n");
}

type PickedRow = { pick: Pick; option: PermOption };

/** Pane 1 — the usage-description keys the picked intents actually require. */
function buildPlist(reads: PickedRow[], writes: PickedRow[]): string {
  const lines: string[] = ["<!-- Info.plist -->"];
  if (reads.length > 0) {
    lines.push("<key>NSHealthShareUsageDescription</key>");
    lines.push("<string>REPLACE ME — say plainly what you read and what you do with it.</string>");
  }
  if (writes.length > 0) {
    lines.push("<key>NSHealthUpdateUsageDescription</key>");
    lines.push("<string>REPLACE ME — say plainly what you save back to Health and why.</string>");
  }
  if (reads.length === 0 && writes.length === 0) {
    lines.push(
      "<!-- Nothing you picked is an authorization type, so neither usage-description key is required yet. -->",
    );
  }
  lines.push(`<!-- ${GEN_LINE} -->`);
  return lines.join("\n");
}

/**
 * Pane 2 — the authorization call.
 *
 * Quantity types get HKQuantityType(.case), which the integration guide
 * establishes. Category and characteristic initializers are NOT established
 * there, so those picks are named in a comment that points at the guide rather
 * than emitted through an invented constructor.
 */
function buildSwift(picked: PickedRow[], reads: PickedRow[], writes: PickedRow[]): string {
  const quantityRead = reads.filter((r) => r.option.family === "quantity");
  const quantityWrite = writes.filter((r) => r.option.family === "quantity");

  const otherFamilies = (rows: PickedRow[], families: PermFamily[]) =>
    families
      .map((f) => ({
        family: f,
        names: rows.filter((r) => r.option.family === f).map((r) => r.option.case),
      }))
      .filter((g) => g.names.length > 0);

  const readOther = otherFamilies(reads, ["category", "characteristic"]);
  const writeOther = otherFamilies(writes, ["category"]);
  const constants = picked.filter((r) => r.option.family === "workoutActivity");

  const setLines = (rows: PickedRow[]) =>
    rows.length > 0 ? indentList(rows.map((r) => `HKQuantityType(.${r.option.case}),`)) : null;

  const commentLines = (groups: { family: PermFamily; names: string[] }[], verb: string) =>
    groups.flatMap((g) => [
      `    // ${g.names.join(", ")} — ${verb} as ${FAMILY_LABEL[g.family]} type${g.names.length > 1 ? "s" : ""}.`,
      `    // see the HealthKit integration guide for the ${FAMILY_LABEL[g.family]} type initializer:`,
      `    // ${GUIDE_URL}`,
    ]);

  const out: string[] = [
    "import HealthKit",
    "",
    "let healthStore = HKHealthStore()",
    "",
    "// HKQuantityType(.case) is the iOS 16+ initializer. On older targets build the",
    "// same type with HKObjectType.quantityType(forIdentifier: .case) instead.",
    "func requestHealthAuthorization() async throws {",
    "    guard HKHealthStore.isHealthDataAvailable() else { return }",
    "",
  ];

  const readSet = setLines(quantityRead);
  out.push(
    readSet
      ? `    let toRead: Set<HKObjectType> = [\n${readSet}\n    ]`
      : "    let toRead: Set<HKObjectType> = []",
  );
  out.push(...commentLines(readOther, "requested for read"));
  out.push("");

  const writeSet = setLines(quantityWrite);
  out.push(
    writeSet
      ? `    let toShare: Set<HKSampleType> = [\n${writeSet}\n    ]`
      : "    let toShare: Set<HKSampleType> = []",
  );
  out.push(...commentLines(writeOther, "requested for write"));

  if (constants.length > 0) {
    out.push("");
    out.push(
      `    // ${constants.map((r) => r.option.case).join(", ")} — workout activity constant${constants.length > 1 ? "s" : ""}.`,
    );
    out.push(
      "    // A constant is a label you attach to a workout session, not a sample type,",
      "    // so it is not part of an authorization request. See /healthkit/exercise-and-fitness.",
    );
  }

  out.push(
    "",
    "    // Presents the system permission sheet. The async form is iOS 15+;",
    "    // the completion-handler variant requestAuthorization(toShare:read:completion:) also works.",
    "    try await healthStore.requestAuthorization(toShare: toShare, read: toRead)",
    "}",
    `// ${GEN_LINE}`,
  );
  return out.join("\n");
}

/**
 * Pane 3 — Health Connect record names, and nothing else.
 *
 * The names come from the cross-platform matrix, which only carries metrics
 * confirmed against both platforms' documentation. No Android permission
 * string and no Kotlin is emitted, because this site has not verified them.
 */
function buildAndroid(picked: PickedRow[]): string {
  const mapped = picked.filter((r) => r.option.android);
  const unmapped = picked.filter((r) => !r.option.android);
  const lines: string[] = [
    "// Android — Health Connect record names from the cross-platform matrix row",
    "// covering each pick. Row-level, not a one-to-one type mapping: the row names",
    "// the records Health Connect uses for that metric, verified on both platforms.",
  ];
  if (mapped.length > 0) {
    lines.push("");
    for (const r of mapped) lines.push(`${r.option.case} -> ${r.option.android}`);
  }
  if (unmapped.length > 0) {
    lines.push("");
    for (const r of unmapped) {
      lines.push(`// ${r.option.case} — no counterpart verified on both platforms; not emitted.`);
    }
  }
  lines.push(
    "",
    "// Permission string format and client code: verify against Google's Health Connect",
    "// documentation — this site emits only the record names it has verified.",
    `// ${GEN_LINE}`,
  );
  return lines.join("\n");
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

function Pane({
  title,
  note,
  code,
}: {
  title: string;
  note?: string;
  code: string;
}) {
  return (
    <section className="mt-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold tracking-tight text-[var(--fg)]">{title}</h3>
        <CopyButton text={code} label={title} />
      </div>
      {note ? <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{note}</p> : null}
      <pre className="mt-2 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-[12.5px] leading-relaxed text-[var(--fg)]">
        <code className="font-mono">{code}</code>
      </pre>
    </section>
  );
}

export default function PermissionBuilder({ options }: { options: PermOption[] }) {
  const [query, setQuery] = useState("");
  const [picks, setPicks] = useState<Pick[]>([]);

  const byCase = useMemo(() => new Map(options.map((o) => [o.case, o])), [options]);

  const picked = useMemo(
    () =>
      picks
        .map((p) => ({ pick: p, option: byCase.get(p.case) }))
        .filter((r): r is { pick: Pick; option: PermOption } => Boolean(r.option)),
    [picks, byCase],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const chosen = new Set(picks.map((p) => p.case));
    const starts: PermOption[] = [];
    const contains: PermOption[] = [];
    for (const o of options) {
      if (chosen.has(o.case)) continue;
      const name = o.case.toLowerCase();
      if (name.startsWith(q)) starts.push(o);
      else if (name.includes(q) || o.abstract.toLowerCase().includes(q)) contains.push(o);
    }
    return [...starts, ...contains].slice(0, 10);
  }, [query, options, picks]);

  function add(o: PermOption) {
    setPicks((prev) =>
      prev.some((p) => p.case === o.case) ? prev : [...prev, { case: o.case, intent: "read" }],
    );
    setQuery("");
  }

  function remove(caseName: string) {
    setPicks((prev) => prev.filter((p) => p.case !== caseName));
  }

  function setIntent(caseName: string, intent: Intent) {
    setPicks((prev) => prev.map((p) => (p.case === caseName ? { ...p, intent } : p)));
  }

  // Workout activity constants are labels attached to a session, not sample
  // types, so they never reach an authorization request or a usage-description
  // key. They stay in `picked` so the tool can say why.
  const authorizable = picked.filter((r) => r.option.family !== "workoutActivity");
  const reads = authorizable.filter((r) => r.pick.intent !== "write");
  const writes = authorizable.filter((r) => r.pick.intent !== "read");

  const plist = useMemo(() => buildPlist(reads, writes), [reads, writes]);
  const swift = useMemo(() => buildSwift(picked, reads, writes), [picked, reads, writes]);
  const android = useMemo(() => buildAndroid(picked), [picked]);

  const readOnlyPicks = picked.filter((r) => r.option.readOnlyEvidence);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <label htmlFor="perm-search" className="block text-sm font-semibold text-[var(--fg)]">
        Which HealthKit types does your app touch?
      </label>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Type to search all {options.length} identifiers Apple documents — quantity, category,
        characteristic and workout activity.
      </p>

      <input
        id="perm-search"
        type="text"
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls="perm-suggestions"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && suggestions.length > 0) {
            e.preventDefault();
            add(suggestions[0]);
          }
        }}
        placeholder="stepCount, heart rate, sleep…"
        className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-brand-400"
      />

      {suggestions.length > 0 && (
        <ul
          id="perm-suggestions"
          className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)]"
        >
          {suggestions.map((o) => (
            <li key={o.case} className="border-b border-[var(--border)] last:border-b-0">
              <button
                type="button"
                onClick={() => add(o)}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-[var(--surface)]"
              >
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-[13px] font-semibold text-brand-600 dark:text-brand-300">
                    {o.case}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
                    {FAMILY_LABEL[o.family]} · {o.group}
                  </span>
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {o.abstract || "Apple publishes no abstract for this type."}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {picked.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
          Nothing picked yet. Add a type and the Info.plist keys, the Swift authorization call and
          the Health Connect record names appear below.
        </p>
      ) : (
        <>
          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            {picked.length} type{picked.length === 1 ? "" : "s"} picked
          </h3>
          <ul className="mt-2 grid gap-2">
            {picked.map(({ pick, option }) => {
              const blocked = writeBlockedReason(option);
              return (
                <li
                  key={option.case}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-[13px] font-semibold text-[var(--fg)]">
                        {option.case}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
                        {FAMILY_LABEL[option.family]}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="inline-flex overflow-hidden rounded-lg border border-[var(--border)]">
                        {(["read", "write", "readwrite"] as Intent[]).map((intent) => {
                          const disabled =
                            blocked === "workout-constant" ||
                            (blocked !== null && intent !== "read");
                          const active = pick.intent === intent;
                          return (
                            <button
                              key={intent}
                              type="button"
                              disabled={disabled}
                              onClick={() => setIntent(option.case, intent)}
                              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                                active
                                  ? "bg-brand-500/15 text-[var(--fg)]"
                                  : "text-[var(--muted)] hover:text-[var(--fg)]"
                              } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                            >
                              {intent === "readwrite" ? "Read + write" : intent === "read" ? "Read" : "Write"}
                            </button>
                          );
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(option.case)}
                        aria-label={`Remove ${option.case}`}
                        className="rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] hover:text-[var(--fg)]"
                      >
                        ✕
                      </button>
                    </span>
                  </div>

                  {blocked === "apple-read-only" && (
                    <p className="mt-2 border-l-2 border-brand-400 pl-3 text-xs leading-relaxed text-[var(--muted)]">
                      <strong className="text-[var(--fg)]">Write disabled — Apple states these samples are read-only.</strong>{" "}
                      Apple&rsquo;s words:{" "}
                      <q className="italic">{option.readOnlyEvidence}</q> Putting this type in
                      a <code className="font-mono">toShare</code> set asks for something the
                      framework will not grant.
                    </p>
                  )}
                  {blocked === "characteristic" && (
                    <p className="mt-2 border-l-2 border-[var(--border)] pl-3 text-xs leading-relaxed text-[var(--muted)]">
                      <strong className="text-[var(--fg)]">Read-only by nature.</strong> A
                      characteristic is a stored answer about the person rather than a sample your
                      app produces — one value, no date range, nothing to write back. See{" "}
                      <Link
                        href="/healthkit/characteristics"
                        className="font-medium text-brand-600 hover:text-brand-500"
                      >
                        HealthKit characteristic types
                      </Link>
                      .
                    </p>
                  )}
                  {blocked === "workout-constant" && (
                    <p className="mt-2 border-l-2 border-[var(--border)] pl-3 text-xs leading-relaxed text-[var(--muted)]">
                      <strong className="text-[var(--fg)]">Not an authorization type.</strong> A
                      workout activity constant is a label you attach to a session, not a sample
                      type — it does not appear in a{" "}
                      <code className="font-mono">requestAuthorization</code> set at all. See{" "}
                      <Link
                        href="/healthkit/exercise-and-fitness"
                        className="font-medium text-brand-600 hover:text-brand-500"
                      >
                        the workout constants
                      </Link>
                      .
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          {readOnlyPicks.length > 0 && (
            <p className="mt-4 rounded-xl border border-brand-400/30 bg-brand-500/5 p-4 text-xs leading-relaxed text-[var(--muted)]">
              {readOnlyPicks.length} of your picks{" "}
              {readOnlyPicks.length === 1 ? "is" : "are"} among the types Apple explicitly documents
              as read-only. An identifier absent from that list is <em>unknown</em>, not writable:
              Apple states writability in prose, and silence is not a statement.
            </p>
          )}

          <Pane
            title="1 · Info.plist"
            note={
              reads.length > 0 && writes.length > 0
                ? "Both keys, because you picked both reads and writes. Call requestAuthorization without the key that matches your operation and the app crashes instead of showing a sheet."
                : reads.length > 0
                  ? "Read-only picks, so only the share key. Add NSHealthUpdateUsageDescription the moment you write anything."
                  : writes.length > 0
                    ? "Write-only picks, so only the update key. Add NSHealthShareUsageDescription the moment you read anything."
                    : "Nothing picked is an authorization type yet, so no usage-description key is required."
            }
            code={plist}
          />

          <Pane
            title="2 · Swift authorization"
            note="Quantity types are emitted with the iOS 16+ HKQuantityType(.case) initializer. Category and characteristic initializers are not established on this site, so they are named in a comment rather than guessed."
            code={swift}
          />

          <Pane
            title="3 · Android — Health Connect record names"
            note="Permission string format and client code: verify against Google's Health Connect documentation — this site emits only the record names it has verified."
            code={android}
          />
        </>
      )}

      <p className="mt-6 border-t border-[var(--border)] pt-5 text-xs leading-relaxed text-[var(--muted)]">
        The usage-description strings are placeholders on purpose. App Review reads them, and a
        generated sentence that does not describe what your app actually does with the data is the
        version that gets rejected. Copy the keys; write the strings yourself.{" "}
        <Link href={TOOL_PATH} className="font-medium text-brand-600 hover:text-brand-500">
          {TOOL_PATH}
        </Link>
      </p>
    </div>
  );
}
