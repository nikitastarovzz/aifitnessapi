"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sniff } from "@/lib/exerciseDbSniffer.mjs";
import type { SnifferData } from "@/lib/exerciseDbSnifferPage";

/**
 * "Which ExerciseDB is this?" on /pricing/exercise-database-api-pricing
 * (English only; rendered by ContentLicences there). The reader pastes a URL,
 * a curl command or a JSON response; src/lib/exerciseDbSniffer.mjs names the
 * variant from its host or field shapes, and this shows the evidence the rule
 * rests on, the variant's "Can I ship it?" row, the site's notes and pages.
 * Everything runs in the browser: nothing pasted is sent anywhere and nothing
 * is reported to analytics.
 */

const SAMPLES: { label: string; text: string }[] = [
  { label: "Free V1 URL", text: "https://oss.exercisedb.dev/api/v1/exercises?limit=10" },
  { label: "V2 curl", text: "curl -H 'X-RapidAPI-Host: edb-with-videos-and-images-by-ascendapi.p.rapidapi.com' https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/search?search=chest%20press" },
  { label: "Free V1 JSON", text: '{"success":true,"data":{"exerciseId":"01qpYSe","name":"upward facing dog","gifUrl":"https://static.exercisedb.dev/media/01qpYSe.gif","bodyParts":["back"]}}' },
];

const host = (u: string) => {
  try {
    return new URL(u).hostname;
  } catch {
    return u;
  }
};

function Refs({ urls }: { urls: string[] }) {
  return (
    <>
      {[...new Set(urls)].map((u) => (
        <a key={u} href={u} rel="nofollow noreferrer" className="ml-1 text-[10px] text-brand-600 hover:text-brand-500">
          {`[${host(u)}]`}
        </a>
      ))}
    </>
  );
}

export default function ExerciseDbSniffer({ data }: { data: SnifferData }) {
  const [text, setText] = useState("");
  const result = useMemo(() => sniff(text), [text]);
  const v = result?.variant ? data.variants[result.variant] : null;
  const ev = result?.ev ? data.evidence[`${result.ev[0]}#${result.ev[1]}`] : null;

  return (
    <div data-exercisedb-sniffer className="mt-5 rounded-xl border border-[var(--border)] p-4">
      <label htmlFor="exercisedb-sniffer-input" className="block text-sm font-medium text-[var(--fg)]">
        Paste an ExerciseDB URL, a curl command or a JSON response
      </label>
      <textarea
        id="exercisedb-sniffer-input"
        rows={4}
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://oss.exercisedb.dev/api/v1/exercises"
        className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-xs text-[var(--fg)]"
      />
      <p className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        <span>Try:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setText(s.text)}
            className="rounded border border-[var(--border)] px-2 py-0.5 hover:border-brand-400 hover:text-[var(--fg)]"
          >
            {s.label}
          </button>
        ))}
        <span>Nothing you paste leaves this page.</span>
      </p>

      {result && (
        <div className="mt-4 text-sm" aria-live="polite">
          {result.status === "recognized" && v ? (
            <>
              <p className="font-semibold text-[var(--fg)]">{v.label}</p>
              <p className="mt-1 text-[var(--muted)]">
                {`${result.by === "host" ? `By host (${result.host})` : "By field shape"}: ${result.why}`}
                {ev && (
                  <a href={ev.url} title={ev.quote} rel="nofollow noreferrer" className="ml-1 text-xs text-brand-600 hover:text-brand-500">
                    {`[source: ${host(ev.url)}]`}
                  </a>
                )}
              </p>
              {ev && <p className="mt-1 break-words font-mono text-[11px] text-[var(--muted)]">{`“${ev.quote}”`}</p>}

              {v.row ? (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {"Its row in Can I ship it?: "}
                    <Link href={v.row.page.href} className="normal-case tracking-normal text-brand-600 hover:text-brand-500">
                      {v.row.name}
                    </Link>
                  </p>
                  <dl className="mt-2 grid gap-x-4 gap-y-1.5 sm:grid-cols-[10rem_1fr]">
                    {v.row.cells.map((c) => (
                      <div key={c.label} className="contents">
                        <dt className="text-xs text-[var(--muted)]">{c.label}</dt>
                        <dd className="text-xs text-[var(--fg)]">
                          {c.value === data.notStated && !c.text ? "Not stated" : (c.text ?? c.value)}
                          {c.value === data.notStated && c.text ? " (not stated)" : ""}
                          <Refs urls={c.urls} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="mt-3 text-xs text-[var(--muted)]">{"This is not an API endpoint, so no row of the table applies; the notes below say which API is which."}</p>
              )}

              {v.notes.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-[var(--muted)]">
                  {v.notes.map((n) => (
                    <li key={n.text}>
                      {n.text}
                      <Refs urls={n.urls} />
                    </li>
                  ))}
                </ul>
              )}
              {v.migration.length > 0 && (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {v.isExerciseDb ? "Moving on or off it: " : "On this site: "}
                  {v.migration.map((m, i) => (
                    <span key={m.href}>
                      {i > 0 ? " · " : ""}
                      <Link href={m.href} className="text-brand-600 hover:text-brand-500">
                        {m.label}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-[var(--fg)]">Not recognized</p>
              <p className="mt-1 text-[var(--muted)]">{result.why}</p>
              {result.rapidapiNote !== undefined && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {data.rapidapiNote.text}
                  <Refs urls={data.rapidapiNote.urls} />
                </p>
              )}
              <p className="mt-2 text-xs text-[var(--muted)]">
                {"The rules know AscendAPI's hosts and documented fields, the free V1 host's responses, free-exercise-db and wger. Anything else is reported as not recognized rather than guessed."}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
