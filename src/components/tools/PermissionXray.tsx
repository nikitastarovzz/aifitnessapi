"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/tools/PermissionBuilder";
import {
  quoteLead,
  toMarkdown,
  valueText,
  xray,
  type AndroidReference,
  type AndroidRow,
  type IosRow,
  type XrayFinding,
  type XrayLink,
  type XrayReport,
} from "@/lib/permissionXray.mjs";
import { site } from "@/lib/site";

/**
 * Permission X-ray: the paste mode of /tools/permission-builder.
 *
 * The pasted manifest or plist is read in this tab by src/lib/permissionXray.mjs
 * against a lookup the page builds on the server from the generated Health
 * Connect module, plus the iOS key table in the same file, whose every
 * sentence is quoted from a page on this site. Nothing is fetched, uploaded
 * or stored.
 */

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const LEVEL = {
  warn: { label: "Check", cls: "bg-amber-500/15 text-amber-800 dark:text-amber-300" },
  note: { label: "Note", cls: "bg-[var(--bg)] text-[var(--muted)] border border-[var(--border)]" },
};

/** Synthetic examples, written for this page. */
const SAMPLES: { label: string; text: string }[] = [
  {
    label: "AndroidManifest.xml",
    text: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.health.READ_STEPS" />
  <uses-permission android:name="android.permission.health.READ_HEART_RATE" />
  <uses-permission android:name="android.permission.health.WRITE_EXERCISE" />
  <uses-permission android:name="android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND" />
  <uses-permission android:name="android.permission.INTERNET" />

  <application android:label="Demo">
    <activity android:name=".PermissionsRationaleActivity" android:exported="true">
      <intent-filter>
        <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
      </intent-filter>
    </activity>
  </application>
</manifest>`,
  },
  {
    label: "Info.plist + entitlements",
    text: `<!-- Info.plist -->
<key>NSHealthShareUsageDescription</key>
<string>We read your step count to show your daily activity progress.</string>
<key>NSHealthUpdateUsageDescription</key>
<string></string>

<!-- App.entitlements -->
<key>com.apple.developer.healthkit</key>
<true/>
<key>com.apple.developer.healthkit.access</key>
<array>
  <string>health-records</string>
</array>
<key>com.apple.developer.healthkit.background-delivery</key>
<true/>`,
  },
];

/** A browser-side well-formedness check, only to say how the paste was read.
 *  Fragments are wrapped in a root that declares the usual prefixes. */
function xmlProblem(text: string): boolean {
  const t = text.trim();
  if (!t.startsWith("<") || typeof DOMParser === "undefined") return false;
  const body = t.replace(/^<\?xml[^>]*\?>/, "").replace(/<!DOCTYPE[^>]*>/i, "");
  const wrapped = `<x-root xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools" xmlns:app="http://schemas.android.com/apk/res-auto">${body}</x-root>`;
  try {
    const doc = new DOMParser().parseFromString(wrapped, "application/xml");
    return doc.getElementsByTagName("parsererror").length > 0;
  } catch {
    return true;
  }
}

function SiteLink({ link }: { link: XrayLink }) {
  return link.href.startsWith("/") ? (
    <Link href={link.href} className={linkCls}>
      {link.label}
    </Link>
  ) : (
    <a href={link.href} className={linkCls} rel="noopener">
      {link.label}
    </a>
  );
}

function Links({ links }: { links: XrayLink[] }) {
  if (!links.length) return <span className="text-xs text-[var(--muted)]">—</span>;
  return (
    <span className="flex flex-col gap-0.5">
      {links.map((l) => (
        <span key={`${l.label}${l.href}`} className="text-xs">
          <SiteLink link={l} />
        </span>
      ))}
    </span>
  );
}

function AndroidGrants({ r }: { r: AndroidRow }) {
  if (r.status === "unresolved") {
    return (
      <span className="text-[var(--muted)]">
        Printed in Google&rsquo;s data-types table for {r.classNames?.join(", ")}, but defined by neither Google
        permission reference.
        {r.frameworkNear ? (
          <>
            {" "}
            The framework reference defines <code className="font-mono text-[12px]">{r.frameworkNear}</code>.
          </>
        ) : null}
      </span>
    );
  }
  if (r.status === "unknown") {
    return (
      <span className="text-[var(--muted)]">
        <strong className="text-[var(--fg)]">Not in Health Connect&rsquo;s published reference.</strong> Nothing is
        inferred from the name.
      </span>
    );
  }
  return (
    <span className="text-[var(--muted)]">
      {r.grants ? <q className="italic">{r.grants}</q> : null}
      {r.records.length > 0 ? (
        <span className="mt-1 block text-xs">
          Record:{" "}
          {r.records.map((x, i) => (
            <span key={`${x.className}${x.access}`}>
              {i > 0 ? "; " : ""}
              <span className="font-mono text-[12px] text-[var(--fg)]">{x.className}</span> ({x.label}, {x.access})
            </span>
          ))}
        </span>
      ) : r.label ? (
        <span className="mt-1 block text-xs">Google&rsquo;s label: {r.label}</span>
      ) : r.group ? (
        <span className="mt-1 block text-xs">{r.group}</span>
      ) : null}
      {(r.added || (r.protectionLevel && r.protectionLevel !== "dangerous")) && (
        <span className="mt-1 block text-xs">
          {r.added}
          {r.added && r.protectionLevel && r.protectionLevel !== "dangerous" ? " · " : ""}
          {r.protectionLevel && r.protectionLevel !== "dangerous" ? `protection level: ${r.protectionLevel}` : ""}
        </span>
      )}
    </span>
  );
}

function IosGrants({ r }: { r: IosRow }) {
  if (r.status === "unknown") {
    return (
      <span className="text-[var(--muted)]">
        <strong className="text-[var(--fg)]">Not documented on this site</strong>, so it is listed without an
        explanation.
      </span>
    );
  }
  return (
    <span className="text-[var(--muted)]">
      {r.grants ? (
        <>
          Apple: <q className="italic">{r.grants}</q>
        </>
      ) : null}
      {r.note ? <span className={r.grants ? "mt-1 block text-xs" : ""}>{r.note}</span> : null}
      {r.xcodeName ? <span className="mt-1 block text-xs">Xcode name: {r.xcodeName}</span> : null}
    </span>
  );
}

function FindingItem({ f }: { f: XrayFinding }) {
  const lvl = LEVEL[f.level];
  return (
    <li className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm leading-relaxed text-[var(--muted)]">
      <span className={`mr-2 rounded-full px-2 py-0.5 text-xs font-semibold ${lvl.cls}`}>{lvl.label}</span>
      <span className="text-[var(--fg)]">{f.text}</span>
      {f.quote ? (
        <>
          {" "}
          {quoteLead(f.quote.by)} <q className="italic">{f.quote.text}</q>
        </>
      ) : null}
      {f.source ? (
        <>
          {" "}
          (<SiteLink link={f.source} />)
        </>
      ) : null}
    </li>
  );
}

function Summary({ report }: { report: XrayReport }) {
  const c = report.counts;
  const parts: string[] = [];
  if (report.androidRows.length) {
    parts.push(
      `${c.androidRequested} Health Connect permission${c.androidRequested === 1 ? "" : "s"} requested (${c.androidRead} READ_*, ${c.androidWrite} WRITE_*${c.androidOther ? `, ${c.androidOther} other` : ""}), ${c.androidKnown} in Google's reference, ${c.androidRecords} record class${c.androidRecords === 1 ? "" : "es"}`,
    );
    if (c.androidReferencedOnly) parts.push(`${c.androidReferencedOnly} more named but not requested`);
  }
  if (report.iosRows.length) parts.push(`${c.iosKeys} HealthKit key${c.iosKeys === 1 ? "" : "s"} or value${c.iosKeys === 1 ? "" : "s"}, ${c.iosKnown} documented here`);
  parts.push(`${c.warnings} to check, ${c.notes} note${c.notes === 1 ? "" : "s"}`);
  return <p className="text-sm font-medium text-[var(--fg)]">{parts.join(" · ")}.</p>;
}

export default function PermissionXray({ androidRef }: { androidRef: AndroidReference }) {
  const [text, setText] = useState("");
  const [report, setReport] = useState<XrayReport | null>(null);
  const [malformed, setMalformed] = useState(false);

  function run(t: string) {
    setReport(xray(t, androidRef));
    setMalformed(xmlProblem(t));
  }

  const markdown = report && !report.empty ? toMarkdown(report, { siteUrl: site.url }) : "";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <label htmlFor="xray-input" className="block text-sm font-semibold text-[var(--fg)]">
        Paste an AndroidManifest.xml, Info.plist or entitlements snippet
      </label>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Read in this tab only: nothing you paste is uploaded or stored.
      </p>
      <textarea
        id="xray-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        spellCheck={false}
        autoComplete="off"
        placeholder={'<uses-permission android:name="android.permission.health.READ_STEPS" />\n<key>NSHealthShareUsageDescription</key>'}
        className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[13px] text-[var(--fg)] outline-none focus:border-brand-400"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => run(text)}
          className="min-h-11 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
        >
          X-ray it
        </button>
        <button
          type="button"
          onClick={() => {
            setText("");
            setReport(null);
            setMalformed(false);
          }}
          className="min-h-11 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--fg)]"
        >
          Clear
        </button>
        <span className="text-xs text-[var(--muted)]">
          Samples (synthetic):{" "}
          {SAMPLES.map((s, i) => (
            <span key={s.label}>
              {i > 0 ? " · " : ""}
              <button
                type="button"
                className={`${linkCls} min-h-6 py-1`}
                onClick={() => {
                  setText(s.text);
                  run(s.text);
                }}
              >
                {s.label}
              </button>
            </span>
          ))}
        </span>
      </div>

      <div aria-live="polite" className="mt-6">
        {report && report.empty && (
          <p className="rounded-xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
            No <code className="font-mono text-[12px]">android.permission.health.*</code> string, NSHealth key or
            HealthKit entitlement found in that paste.
            {report.otherPermissions.length > 0
              ? ` ${report.otherPermissions.length} other permission${report.otherPermissions.length === 1 ? " was" : "s were"} declared; this mode explains only Health Connect and HealthKit access.`
              : ""}
          </p>
        )}

        {report && !report.empty && (
          <>
            <div className="flex items-start justify-between gap-3">
              <Summary report={report} />
              <CopyButton text={markdown} label="X-ray as markdown" />
            </div>
            {malformed && (
              <p className="mt-2 text-xs text-[var(--muted)]">
                This does not parse as XML, so it was read as plain text with a pattern scan. Check anything that
                looks off against the file itself.
              </p>
            )}
            {report.truncated && (
              <p className="mt-2 text-xs text-[var(--muted)]">Only the first 400,000 characters were read.</p>
            )}

            {report.androidRows.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-bold tracking-tight text-[var(--fg)]">Android: Health Connect</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  Descriptions are Google&rsquo;s, from the HealthPermissions reference as read on{" "}
                  {androidRef.fetchedOn}; record classes from Google&rsquo;s data-types table.
                </p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                    <caption className="sr-only">Health Connect permissions found in the paste</caption>
                    <thead>
                      <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                        <th scope="col" className="py-2 pr-4 font-semibold">Permission</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">How it appears</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">What it grants</th>
                        <th scope="col" className="py-2 font-semibold">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.androidRows.map((r) => (
                        <tr key={`${r.item}|${r.how}`} className="border-b border-[var(--border)] align-top">
                          <td className="py-2 pr-4">
                            <code className="break-all font-mono text-[13px] text-[var(--fg)]">{r.item}</code>
                            <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                              line {r.lines.join(", ")}
                            </span>
                          </td>
                          <td className="py-2 pr-4 font-mono text-[12px] text-[var(--muted)]">{r.how}</td>
                          <td className="py-2 pr-4">
                            <AndroidGrants r={r} />
                          </td>
                          <td className="py-2">
                            <Links links={r.links} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {report.iosRows.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-bold tracking-tight text-[var(--fg)]">iOS: HealthKit</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  Apple&rsquo;s descriptions as the linked page on this site quotes them.
                </p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                    <caption className="sr-only">HealthKit keys and entitlements found in the paste</caption>
                    <thead>
                      <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                        <th scope="col" className="py-2 pr-4 font-semibold">Key</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">Value</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">What it is</th>
                        <th scope="col" className="py-2 font-semibold">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.iosRows.map((r) => (
                        <tr key={r.item} className="border-b border-[var(--border)] align-top">
                          <td className="py-2 pr-4">
                            <code className="break-all font-mono text-[13px] text-[var(--fg)]">{r.item}</code>
                            <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                              {r.kind} · line {r.value.line}
                            </span>
                          </td>
                          <td className="max-w-[14rem] break-words py-2 pr-4 text-xs text-[var(--muted)]">
                            {valueText(r.value)}
                          </td>
                          <td className="py-2 pr-4">
                            <IosGrants r={r} />
                          </td>
                          <td className="py-2">
                            <Links links={r.links} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {report.findings.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-bold tracking-tight text-[var(--fg)]">
                  Findings ({report.findings.length})
                </h3>
                <ul className="mt-2 grid gap-2">
                  {report.findings.map((f) => (
                    <FindingItem key={f.id} f={f} />
                  ))}
                </ul>
              </section>
            )}

            {report.otherPermissions.length > 0 && (
              <p className="mt-4 text-xs text-[var(--muted)]">
                {report.otherPermissions.length} other permission{report.otherPermissions.length === 1 ? "" : "s"}{" "}
                declared ({report.otherPermissions.join(", ")}); this mode explains only Health Connect and HealthKit
                access.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
