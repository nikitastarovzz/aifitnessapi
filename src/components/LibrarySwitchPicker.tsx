"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { lineUrl, switchDiff, type SwitchEntry, type SwitchLib, type SwitchTypes } from "@/lib/librarySwitch.mjs";

/**
 * "Switching libraries?" on /libraries/react-native, /flutter and
 * /capacitor-cordova: pick the library you use and the one you are moving
 * to, and see the HealthKit identifiers and Health Connect records you keep,
 * lose and gain. Data comes from the server, compacted from the generated
 * src/data/healthLibrarySupport.ts (src/lib/librarySwitch.mjs); every row
 * links this site's page for the type and the source line on GitHub it was
 * read from. Nothing is sent anywhere.
 */

const STORE_LABEL = { healthkit: "HealthKit", healthConnect: "Health Connect" } as const;
const EXT = { rel: "nofollow noreferrer", target: "_blank" } as const;

function Entries({
  entries,
  types,
  from,
  to,
}: {
  entries: SwitchEntry[];
  types: SwitchTypes;
  from: SwitchLib;
  to: SwitchLib;
}) {
  if (entries.length === 0) return <p className="mt-2 text-sm text-[var(--muted)]">None.</p>;
  return (
    <ul className="mt-2 max-h-80 space-y-1 overflow-auto pr-1 text-sm">
      {entries.map((e) => {
        const t = types[e.id];
        return (
          <li key={e.id} className="flex flex-wrap items-baseline gap-x-2">
            <Link href={t.p} className="font-mono text-[12px] text-brand-600 hover:text-brand-500">
              {t.n}
            </Link>
            {e.from && (
              <a href={lineUrl(from, e.from)} className="text-[11px] text-[var(--muted)] hover:text-brand-600" {...EXT}>
                {from.name} line {e.from[2]}
              </a>
            )}
            {e.to && (
              <a href={lineUrl(to, e.to)} className="text-[11px] text-[var(--muted)] hover:text-brand-600" {...EXT}>
                {to.name} line {e.to[2]}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function LibrarySwitchPicker({ libs, types }: { libs: SwitchLib[]; types: SwitchTypes }) {
  const [fromSlug, setFrom] = useState(libs[0].slug);
  const [toSlug, setTo] = useState(libs[1].slug);
  const from = libs.find((l) => l.slug === fromSlug) ?? libs[0];
  const to = libs.find((l) => l.slug === toSlug) ?? libs[1];
  const diff = useMemo(() => (from.slug === to.slug ? [] : switchDiff(from, to)), [from, to]);
  const select = "ml-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 font-mono text-sm text-[var(--fg)]";

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm font-semibold text-[var(--fg)]">
          From
          <select value={from.slug} onChange={(e) => setFrom(e.target.value)} className={select}>
            {libs.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-[var(--fg)]">
          To
          <select value={to.slug} onChange={(e) => setTo(e.target.value)} className={select}>
            {libs.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        {from.name}: {from.ref}, read {from.readOn}. {to.name}: {to.ref}, read {to.readOn}.
      </p>

      <div aria-live="polite">
        {from.slug === to.slug ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Pick two different libraries.</p>
        ) : (
          diff.map((d) => (
            <div key={d.store} className="mt-6">
              <h3 className="text-base font-semibold text-[var(--fg)]">{STORE_LABEL[d.store]}</h3>
              {!d.toReads && (
                <p className="mt-1 text-sm text-[var(--fg)]">
                  The files read for <span className="font-mono">{to.name}</span> map no {STORE_LABEL[d.store]} types, so every{" "}
                  {STORE_LABEL[d.store]} type below is one you lose.
                </p>
              )}
              {!d.fromReads && (
                <p className="mt-1 text-sm text-[var(--fg)]">
                  The files read for <span className="font-mono">{from.name}</span> map no {STORE_LABEL[d.store]} types, so every{" "}
                  {STORE_LABEL[d.store]} type below is new.
                </p>
              )}
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {(
                  [
                    ["Lose", d.lose],
                    ["Gain", d.gain],
                    ["Keep", d.keep],
                  ] as const
                ).map(([label, entries]) => (
                  <details key={label} open={label !== "Keep"} className="rounded-xl border border-[var(--border)] p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
                      {label}: {entries.length}
                    </summary>
                    <Entries entries={entries} types={types} from={from} to={to} />
                  </details>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
