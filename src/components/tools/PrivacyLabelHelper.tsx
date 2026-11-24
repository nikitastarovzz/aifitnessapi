"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ShareRow from "@/components/ShareRow";
import {
  ALWAYS,
  APPLE_URL,
  DEFAULT_ANSWER,
  FLAGS,
  GOOGLE_URL,
  PRIVACY_HEADING,
  PRIVACY_ITEMS,
  PRIVACY_MAP_HEADING,
  PURPOSES,
  WHERE,
  decodeSelection,
  encodeSelection,
  privacyAnswers,
} from "@/data/privacyLabels.mjs";

/**
 * The privacy label helper on /tools/store-submission-checklist. The reader
 * ticks the data the app handles and how; the answers name the Apple App
 * Privacy and Google Play Data safety data types to declare, each with the
 * platform's own sentence (src/data/privacyLabels.mjs, tested in
 * scripts/privacy-labels.test.mjs). Everything runs here: the ticks live in
 * this component and the address hash (#labels=…), which never reaches a
 * server.
 */

type Src = { url: string; quote: string };
type Answer = { where: string; linked: boolean; tracking: boolean; shared: boolean; optional: boolean };
type Selection = Record<string, Answer>;

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const HASH_KEY = "labels";

function Q({ src }: { src: Src }) {
  return <blockquote className="mt-1 border-l-2 border-brand-400 pl-3 text-xs text-[var(--muted)]">{src.quote}</blockquote>;
}

const typeName = (t: { category: string; type: string }) => (t.category === t.type ? t.type : `${t.category} › ${t.type}`);

function readHash(): Selection | null {
  const h = window.location.hash.replace(/^#/, "");
  if (!h.startsWith(`${HASH_KEY}=`)) return null;
  return decodeSelection(decodeURIComponent(h.slice(HASH_KEY.length + 1))) as Selection;
}

export default function PrivacyLabelHelper() {
  const [sel, setSel] = useState<Selection>({});
  const touched = useRef(false);

  const load = useCallback(() => {
    const s = readHash();
    if (s) setSel(s);
  }, []);
  useEffect(() => {
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, [load]);
  useEffect(() => {
    if (!touched.current) return;
    const enc = encodeSelection(sel);
    const next = enc ? `#${HASH_KEY}=${enc}` : "";
    if (window.location.hash !== next) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
  }, [sel]);

  const update = (id: string, patch: Partial<Answer> | null) => {
    touched.current = true;
    setSel((s) => {
      const next = { ...s };
      if (patch === null) delete next[id];
      else next[id] = { ...(s[id] ?? DEFAULT_ANSWER), ...patch };
      return next;
    });
  };

  const out = privacyAnswers(sel);
  const any = Object.keys(sel).length > 0;

  return (
    <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7" aria-labelledby="privacy-labels" id="privacy-labels-helper" data-privacy-labels>
      <h2 id="privacy-labels" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
        {PRIVACY_HEADING}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        Tick the data your app handles and say how. The answers name the data types to declare in Apple&apos;s App Privacy section in App Store Connect and in Google
        Play&apos;s Data safety form, each with the platform&apos;s own wording, from{" "}
        <a href={APPLE_URL} rel="noopener" className={linkCls}>
          Apple&apos;s App privacy details page
        </a>{" "}
        and{" "}
        <a href={GOOGLE_URL} rel="noopener" className={linkCls}>
          Google&apos;s Data safety help article
        </a>
        , both read on November 24, 2026. Nothing you tick leaves this browser; the share link carries your ticks in the address.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        This is a helper, not legal advice: the forms ask about your app and every SDK in it, and only you can answer for those. For the rules around the forms, see
        the{" "}
        <Link href="/compliance/health-app-privacy-policy" className={linkCls}>
          health app privacy policy guide
        </Link>
        ,{" "}
        <Link href="/compliance/app-store-health-data-rules" className={linkCls}>
          App Store health data rules
        </Link>
        ,{" "}
        <Link href="/compliance/google-play-health-data-policy" className={linkCls}>
          Google Play health data policy
        </Link>{" "}
        and the{" "}
        <Link href="/tools/compliance-wizard" className={linkCls}>
          compliance wizard
        </Link>
        .
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-[var(--fg)]">What data does the app handle?</legend>
        <ul className="mt-3 space-y-2">
          {PRIVACY_ITEMS.map((item) => {
            const a = sel[item.id];
            return (
              <li key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
                <label className="flex items-start gap-3 text-sm text-[var(--fg)]">
                  <input
                    type="checkbox"
                    checked={!!a}
                    onChange={(e) => update(item.id, e.target.checked ? {} : null)}
                    className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                  />
                  <span>
                    <span className="font-semibold">{item.label}</span> <span className="text-[var(--muted)]">({item.hint})</span>
                  </span>
                </label>
                {a ? (
                  <div className="mt-3 grid gap-3 pl-7 sm:grid-cols-2">
                    <label className="text-xs font-medium text-[var(--fg)]">
                      Where it goes
                      <select
                        value={a.where}
                        onChange={(e) => update(item.id, { where: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs text-[var(--fg)]"
                      >
                        {WHERE.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {a.where === "stored" ? (
                      <div className="space-y-1">
                        {FLAGS.map((f) => (
                          <label key={f.id} className="flex items-start gap-2 text-xs text-[var(--fg)]">
                            <input
                              type="checkbox"
                              checked={!!a[f.id as keyof Answer]}
                              onChange={(e) => update(item.id, { [f.id]: e.target.checked })}
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand-600"
                            />
                            {f.label}
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </fieldset>

      <ShareRow place="privacy-labels" text="The App Privacy and Data safety answers for my health app, each quoted from Apple and Google:" />

      <div className="mt-6 grid gap-6 lg:grid-cols-2" aria-live="polite">
        <div data-privacy-store="apple">
          <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">Apple App Privacy</h3>
          {!any ? <p className="mt-2 text-sm text-[var(--muted)]">Tick a kind of data above to see what to declare.</p> : null}
          {out.apple.declare.length ? <p className="mt-2 text-sm font-semibold text-[var(--fg)]">Declare</p> : null}
          <ul className="mt-2 space-y-3">
            {out.apple.declare.map((d) => (
              <li key={d.item.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm">
                <p className="font-semibold text-[var(--fg)]">{d.types.map(typeName).join("; ")}</p>
                <p className="text-xs text-[var(--muted)]">for {d.item.label.toLowerCase()}</p>
                {d.types.map((t) => (
                  <Q key={t.type} src={t.src} />
                ))}
                <p className="mt-2 text-xs font-medium text-[var(--fg)]">{d.flags.map((f) => f.label).join(" · ")}</p>
                {d.note ? (
                  <p className="mt-1 text-xs text-[var(--muted)]">{d.note.text}</p>
                ) : null}
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-[var(--muted)]">Apple&apos;s wording behind this</summary>
                  {[...d.flags.map((f) => f.src), ...d.rules].map((s) => (
                    <Q key={s.quote} src={s} />
                  ))}
                </details>
              </li>
            ))}
          </ul>
          {out.apple.gaps.map((x) => (
            <div key={x.item.id} className="mt-3 rounded-xl border border-dashed border-[var(--border)] p-3 text-sm">
              <p className="font-semibold text-[var(--fg)]">No type named: {x.item.label.toLowerCase()}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{x.gap.text}</p>
              <Q src={x.gap.src} />
            </div>
          ))}
          {out.apple.omit.length ? <p className="mt-4 text-sm font-semibold text-[var(--fg)]">Not collected, so not declared</p> : null}
          {out.apple.omit.map((o) => (
            <div key={o.item.id} className="mt-2 text-sm">
              <p className="text-[var(--fg)]">{o.item.label}</p>
              <Q src={o.why} />
            </div>
          ))}
        </div>

        <div data-privacy-store="google">
          <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">Google Play Data safety</h3>
          {!any ? <p className="mt-2 text-sm text-[var(--muted)]">Tick a kind of data above to see what to declare.</p> : null}
          {out.google.declare.length ? <p className="mt-2 text-sm font-semibold text-[var(--fg)]">Declare</p> : null}
          <ul className="mt-2 space-y-3">
            {out.google.declare.map((d) => (
              <li key={d.item.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm">
                <p className="font-semibold text-[var(--fg)]">{d.types.map(typeName).join("; ")}</p>
                <p className="text-xs text-[var(--muted)]">
                  for {d.item.label.toLowerCase()}
                  {d.ephemeral ? "; in the form, but not shown on the store listing if it meets Google's standard" : ""}
                </p>
                {d.types.map((t) => (
                  <Q key={t.type} src={t.src} />
                ))}
                <p className="mt-2 text-xs font-medium text-[var(--fg)]">{d.flags.map((f) => f.label).join(" · ")}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-[var(--muted)]">Google&apos;s wording behind this</summary>
                  {[...d.flags.map((f) => f.src), ...d.rules].map((s) => (
                    <Q key={s.quote} src={s} />
                  ))}
                </details>
              </li>
            ))}
          </ul>
          {out.google.gaps.map((x) => (
            <div key={x.item.id} className="mt-3 rounded-xl border border-dashed border-[var(--border)] p-3 text-sm">
              <p className="font-semibold text-[var(--fg)]">No type named: {x.item.label.toLowerCase()}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{x.gap.text}</p>
              <Q src={x.gap.src} />
            </div>
          ))}
          {out.google.omit.length ? <p className="mt-4 text-sm font-semibold text-[var(--fg)]">Not collected, so not declared</p> : null}
          {out.google.omit.map((o) => (
            <div key={o.item.id} className="mt-2 text-sm">
              <p className="text-[var(--fg)]">{o.item.label}</p>
              <Q src={o.why} />
            </div>
          ))}
        </div>
      </div>

      <details className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
        <summary className="cursor-pointer text-sm font-medium text-[var(--fg)]">Rules that apply whatever you tick</summary>
        <p className="mt-2 text-xs font-semibold text-[var(--fg)]">Apple</p>
        {ALWAYS.apple.map((s) => (
          <Q key={s.quote} src={s} />
        ))}
        <p className="mt-3 text-xs font-semibold text-[var(--fg)]">Google</p>
        {ALWAYS.google.map((s) => (
          <Q key={s.quote} src={s} />
        ))}
      </details>

      <details className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
        <summary className="cursor-pointer text-sm font-medium text-[var(--fg)]">The purposes each form asks for, per data type</summary>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          {(["apple", "google"] as const).map((k) => (
            <div key={k}>
              <p className="text-xs font-semibold text-[var(--fg)]">{k === "apple" ? "Apple" : "Google"}</p>
              <ul className="mt-1 space-y-2">
                {PURPOSES[k].map((p) => (
                  <li key={p.name} className="text-xs text-[var(--fg)]">
                    {p.name}
                    <Q src={p.src} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <h3 className="mt-8 text-lg font-bold tracking-tight text-[var(--fg)]">{PRIVACY_MAP_HEADING}</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm" data-privacy-map>
          <thead className="text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="py-2 pr-3">Your app handles</th>
              <th className="py-2 pr-3">Apple App Privacy</th>
              <th className="py-2">Google Play Data safety</th>
            </tr>
          </thead>
          <tbody>
            {PRIVACY_ITEMS.map((i) => (
              <tr key={i.id} className="border-t border-[var(--border)] align-top">
                <td className="py-2 pr-3 text-[var(--fg)]">{i.label}</td>
                <td className="py-2 pr-3 text-[var(--fg)]">{i.apple ? i.apple.map(typeName).join("; ") : "No type named"}</td>
                <td className="py-2 text-[var(--fg)]">{i.google ? i.google.map(typeName).join("; ") : "No type named"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
