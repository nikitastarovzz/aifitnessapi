import type { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";
import type { Library } from "@/data/libraries";
import { LIBRARIES_FETCHED_ON } from "@/data/libraries";
import { ECOSYSTEM_LABEL, daysBetween, type Command, type SourcedNote } from "@/data/librariesEditorial";

/**
 * Render helpers shared by the /libraries routes. A private module (the
 * leading underscore keeps it out of the route tree).
 *
 * Notes are plain strings rather than MDX: the README quotes are full of
 * braces, angle brackets and backticks, and a compile step that can choke on
 * a quoted `<uses-permission>` is a liability for text we did not write.
 * Backticks become inline code; nothing else is interpreted.
 */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-[var(--surface)] px-1 py-0.5 font-mono text-[0.85em]">
            {p}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function NoteItem({ note }: { note: SourcedNote }) {
  return (
    <li className="border-t border-[var(--border)] py-4 first:border-t-0">
      <p className="text-[var(--fg)]">
        <Inline text={note.text} />
      </p>
      {note.quote && (
        <blockquote className="mt-2 border-l-2 border-brand-400/60 pl-3 text-sm italic text-[var(--muted)]">
          &ldquo;
          <Inline text={note.quote} />
          &rdquo;
        </blockquote>
      )}
      <p className="mt-2 text-xs text-[var(--muted)]">
        Source:{" "}
        <a href={note.source} className="text-brand-600 hover:text-brand-500" rel="nofollow noreferrer" target="_blank">
          {note.sourceLabel}
        </a>
      </p>
    </li>
  );
}

export function CommandItem({ c }: { c: Command }) {
  return (
    <div className="mt-4">
      <p className="text-sm text-[var(--muted)]">{c.label}</p>
      <div className="prose prose-neutral mt-1 max-w-none dark:prose-invert prose-pre:my-0 prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
        <CodeBlock raw={c.command}>
          <pre className="overflow-x-auto">
            <code>{c.command}</code>
          </pre>
        </CodeBlock>
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        From the{" "}
        <a href={c.source} className="text-brand-600 hover:text-brand-500" rel="nofollow noreferrer" target="_blank">
          {c.sourceLabel}
        </a>
      </p>
    </div>
  );
}

/** "MIT (package.json license)" style: value plus where it came from. */
function Evidenced({ value, evidence }: { value: ReactNode; evidence: string | null }) {
  return (
    <>
      {value}
      {evidence && <span className="block text-xs text-[var(--muted)]">{evidence}</span>}
    </>
  );
}

const PLATFORM_LABEL: Record<string, string> = { ios: "iOS", android: "Android", web: "Web" };

/** Days between a registry date and our read — a fixed number, unlike an
 *  age computed at build time, which would freeze and go wrong. */
export function sinceRead(date: string | null): string {
  if (!date) return "";
  const d = daysBetween(date, LIBRARIES_FETCHED_ON);
  if (d <= 0) return "on the day of our read";
  return `${d.toLocaleString("en-US")} day${d === 1 ? "" : "s"} before our ${LIBRARIES_FETCHED_ON} read`;
}

export function githubUrl(l: Library): string | null {
  const r = l.repoFullName ?? l.repo;
  return r ? `https://github.com/${r}` : null;
}

export type FactRow = { label: string; value: ReactNode };

/** Every registry and repository fact for one package, each with its date or
 *  its evidence, and "not stated" where the source is silent. */
export function factRows(l: Library): FactRow[] {
  const gh = githubUrl(l);
  const rows: FactRow[] = [
    {
      label: "Registry",
      value: (
        <a href={l.registryUrl} className="text-brand-600 hover:text-brand-500" rel="nofollow noreferrer" target="_blank">
          {ECOSYSTEM_LABEL[l.ecosystem]}: <span className="font-mono">{l.name}</span>
        </a>
      ),
    },
    {
      label: "Latest version",
      value: (
        <>
          <span className="font-mono">{l.latestVersion}</span>, published {l.latestPublished}
          <span className="block text-xs text-[var(--muted)]">{sinceRead(l.latestPublished)}</span>
        </>
      ),
    },
    { label: "First published", value: `${l.firstPublished} · ${l.versionCount} versions published` },
    { label: "Licence", value: <Evidenced value={l.license ?? "not stated"} evidence={l.licenseEvidence} /> },
    {
      label: "Platforms",
      value: (
        <Evidenced
          value={l.platforms ? l.platforms.map((p) => PLATFORM_LABEL[p] ?? p).join(", ") : "not stated in registry metadata"}
          evidence={l.platformsEvidence}
        />
      ),
    },
    {
      label: "Requires",
      value: l.requires ? (
        <Evidenced
          value={
            <span className="font-mono text-xs">
              {Object.entries(l.requires)
                .map(([k, v]) => `${k} ${v}`)
                .join(" · ")}
            </span>
          }
          evidence={l.requiresSource}
        />
      ) : (
        "not stated"
      ),
    },
  ];
  if (l.deprecated) {
    rows.push({ label: "Deprecated", value: <Evidenced value={l.deprecated.message} evidence={l.deprecated.source} /> });
  }
  if (l.registryStatus) rows.push({ label: "Status classifier", value: <span className="font-mono text-xs">{l.registryStatus}</span> });
  rows.push({
    label: "Repository",
    value: gh ? (
      <a href={gh} className="font-mono text-xs text-brand-600 hover:text-brand-500" rel="nofollow noreferrer" target="_blank">
        {l.repoFullName ?? l.repo}
      </a>
    ) : (
      "not stated"
    ),
  });
  rows.push({
    label: "Last commit, default branch",
    value: l.lastCommitOnDefaultBranch?.date ? (
      <>
        {l.lastCommitOnDefaultBranch.date}
        <span className="block text-xs text-[var(--muted)]">
          {sinceRead(l.lastCommitOnDefaultBranch.date)} · read by git on {l.lastCommitOnDefaultBranch.checkedOn}
        </span>
      </>
    ) : (
      "could not read"
    ),
  });
  rows.push({
    label: "GitHub signals",
    value: l.repoStats ? (
      <>
        {l.repoStats.stars !== null ? `${l.repoStats.stars.toLocaleString("en-US")} stars` : "stars not reported"}
        {l.repoStats.openIssues !== null ? ` · ${l.repoStats.openIssues.toLocaleString("en-US")} open issues and PRs` : ""}
        {l.repoStats.archived ? " · archived" : " · not archived"}
        {l.repoStats.pushedAt ? ` · last push to any branch ${l.repoStats.pushedAt}` : ""}
        <span className="block text-xs text-[var(--muted)]">GitHub API, read {l.repoStats.checkedOn}</span>
      </>
    ) : (
      <span className="text-[var(--muted)]">
        Not yet read — the GitHub API was not reachable from the run that wrote this data. The weekly refresh fills it in;
        nothing here is estimated.
      </span>
    ),
  });
  return rows;
}

export function FactList({ rows }: { rows: FactRow[] }) {
  return (
    <dl className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-semibold text-[var(--fg)]">{r.label}</dt>
          <dd className="min-w-0 break-words text-sm text-[var(--muted)] sm:col-span-2">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** SPDX licence URL for a single plain identifier; null for anything else
 *  ("Apache 2.0", "MIT License"), which is emitted nowhere rather than guessed. */
export function spdxUrl(license: string | null): string | null {
  const known = new Set(["MIT", "Apache-2.0", "MPL-2.0", "ISC", "BSD-3-Clause", "BSD-2-Clause"]);
  return license && known.has(license) ? `https://spdx.org/licenses/${license}.html` : null;
}

export const LANGUAGE: Record<Library["ecosystem"], string> = { npm: "JavaScript", pub: "Dart", pypi: "Python" };
