import { CHANGE_EVENTS, type ChangeEvent } from "./changes";
import { allSpokes, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { site } from "@/lib/site";

/**
 * Monthly digests — the newsletter's archive, generated from what actually
 * happened rather than written after the fact.
 *
 * Two things happen here in a month and both are already recorded with dates:
 * the changes tracker records ecosystem events we verified, and every page
 * carries the date its facts were last checked. A digest is those two
 * records for one month, nothing more. That means the archive cannot claim
 * an issue that did not happen, cannot drift from the site, and exists the
 * moment the work does.
 *
 * The same builder renders the page and the plain-text email, so what
 * subscribers receive and what search engines index are the same document.
 */

export const DIGEST_PATH = "/digest";

export type DigestPage = {
  href: string;
  h1: string;
  clusterLabel: string;
  metaDescription: string;
  updated: string;
};

export type Digest = {
  /** "2026-08" */
  month: string;
  /** "August 2026" */
  label: string;
  changes: ChangeEvent[];
  pages: DigestPage[];
  /** Pages grouped by section, biggest section first. */
  bySection: { clusterLabel: string; basePath: string; pages: DigestPage[] }[];
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  return `${MONTHS[Number(m) - 1] ?? m} ${y}`;
}

let CACHE: Digest[] | null = null;

function build(): Digest[] {
  const byMonth = new Map<string, Digest>();
  const get = (month: string): Digest => {
    let d = byMonth.get(month);
    if (!d) {
      d = { month, label: monthLabel(month), changes: [], pages: [], bySection: [] };
      byMonth.set(month, d);
    }
    return d;
  };

  for (const e of CHANGE_EVENTS) {
    if (!/^\d{4}-\d{2}/.test(e.verifiedOn)) continue;
    get(e.verifiedOn.slice(0, 7)).changes.push(e);
  }

  for (const { basePath, entry } of allSpokes()) {
    if (!/^\d{4}-\d{2}/.test(entry.updated)) continue;
    get(entry.updated.slice(0, 7)).pages.push({
      href: `${basePath}/${entry.slug}`,
      h1: entry.h1,
      clusterLabel: CLUSTER_LABELS[basePath] ?? basePath,
      metaDescription: entry.metaDescription,
      updated: entry.updated,
    });
  }

  for (const d of byMonth.values()) {
    d.changes.sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
    d.pages.sort((a, b) => (a.updated < b.updated ? 1 : -1));
    const groups = new Map<string, { clusterLabel: string; basePath: string; pages: DigestPage[] }>();
    for (const p of d.pages) {
      const basePath = `/${p.href.split("/")[1]}`;
      const g = groups.get(basePath) ?? { clusterLabel: p.clusterLabel, basePath, pages: [] };
      g.pages.push(p);
      groups.set(basePath, g);
    }
    d.bySection = [...groups.values()].sort((a, b) => b.pages.length - a.pages.length);
  }

  // A month with one page and no tracked change is not an issue; publishing
  // it would be padding the archive.
  return [...byMonth.values()]
    .filter((d) => d.changes.length > 0 || d.pages.length >= 3)
    .sort((a, b) => (a.month < b.month ? 1 : -1));
}

export function digests(): Digest[] {
  CACHE ??= build();
  return CACHE;
}

export function getDigest(month: string): Digest | undefined {
  return digests().find((d) => d.month === month);
}

/** One-line summary used as the page description and the email preview. */
export function digestSummary(d: Digest): string {
  const parts: string[] = [];
  if (d.changes.length)
    parts.push(`${d.changes.length} tracked change${d.changes.length === 1 ? "" : "s"}`);
  if (d.pages.length)
    parts.push(`${d.pages.length} page${d.pages.length === 1 ? "" : "s"} verified`);
  return `Fitness and health API news for ${d.label}: ${parts.join(" and ")}, across ${d.bySection.length} sections.`;
}

/** The plain-text edition — what subscribers actually receive. */
export function digestMarkdown(d: Digest): string {
  const url = (p: string) => `${site.url}${p}`;
  const out: string[] = [
    `# ${site.name} — ${d.label}`,
    "",
    digestSummary(d),
    "",
  ];

  if (d.changes.length) {
    out.push("## What changed in the ecosystem", "");
    for (const c of d.changes) {
      out.push(`### ${c.title}`, "", `${c.date} · ${c.status}`, "", c.summary, "", `${url(c.page.href)}`, "");
    }
  }

  if (d.bySection.length) {
    out.push("## Pages published or re-verified", "");
    for (const s of d.bySection) {
      out.push(`**${s.clusterLabel}** (${s.pages.length})`, "");
      for (const p of s.pages) out.push(`- [${p.h1}](${url(p.href)})`);
      out.push("");
    }
  }

  out.push(
    "---",
    "",
    `Every claim traces to a primary source checked on the review date. How we verify: ${url("/methodology")}`,
    `This digest is generated from the changes tracker and the pages themselves, so it cannot describe work that did not happen.`,
    "",
  );
  return out.join("\n");
}
