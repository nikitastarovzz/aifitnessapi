import {
  HK_IDENTIFIERS,
  HK_FETCHED_ON,
  type HkFamily,
  type HkIdentifier,
} from "@/data/healthkitIdentifiers";
import { hkGroupLabel, hkGroupSlugOf, releasedHkGroups, HK_BASE } from "@/data/hkGroupPages";

/**
 * HealthKit identifiers grouped by the iOS MAJOR version that introduced
 * them — the data behind /healthkit-versions/ios-<major>.
 *
 * Everything here is computed from the generated identifier dataset at build
 * time. Which majors get a page, every count, and every sentence in the
 * capsule and FAQs are derived from it, so a dataset refresh moves the pages
 * without an edit — and a page can never say more than the dataset does.
 * Minor releases (14.2, 14.3, 14.5) fold into their major (ios-14).
 */

export const HK_VERSIONS_PATH = "/healthkit-versions";

/** A major gets its own page only when it introduced at least this many
 *  identifiers. Smaller releases stay on the hub's full list. */
export const HK_VERSION_MIN_MEMBERS = 3;

/** The child pages' own first-publish date (JSON-LD datePublished and
 *  dateModified; the sitemap must use the same). The data date is
 *  HK_FETCHED_ON and goes in lastReviewed, as on the hub. */
export const HK_VERSION_PAGES_PUBLISHED = "2026-10-03";

export { HK_FETCHED_ON };

export const FAMILY_ORDER: Record<HkFamily, number> = {
  quantity: 0,
  category: 1,
  characteristic: 2,
  workoutActivity: 3,
};

const FAMILY_NOUN: Record<HkFamily, [string, string]> = {
  quantity: ["quantity type", "quantity types"],
  category: ["category type", "category types"],
  characteristic: ["characteristic type", "characteristic types"],
  workoutActivity: ["workout activity type", "workout activity types"],
};

export function familyNoun(f: HkFamily, n: number): string {
  return FAMILY_NOUN[f][n === 1 ? 0 : 1];
}

export function iosIntroduced(r: HkIdentifier): string | null {
  return r.platforms.find((p) => p.name === "iOS")?.introducedAt ?? null;
}

export function iosDeprecatedAt(r: HkIdentifier): string | null {
  return r.platforms.find((p) => p.name === "iOS")?.deprecatedAt ?? null;
}

function parts(v: string): number[] {
  return v.split(".").map((n) => Number(n) || 0);
}

export function compareVersions(a: string, b: string): number {
  const pa = parts(a);
  const pb = parts(b);
  return (pa[0] ?? 0) - (pb[0] ?? 0) || (pa[1] ?? 0) - (pb[1] ?? 0) || (pa[2] ?? 0) - (pb[2] ?? 0);
}

/** The hub's per-release anchor for a full version string (same formula the
 *  hub's section ids use: `ios-14-3`). */
export function hubAnchor(version: string): string {
  return `${HK_VERSIONS_PATH}#ios-${version.replace(".", "-")}`;
}

export type Count = { key: string; label: string; count: number };

export type HkMajor = {
  major: number;
  /** URL segment, e.g. "ios-18". */
  slug: string;
  path: string;
  /** Sorted by family, then case. */
  members: HkIdentifier[];
  /** Full iOS versions within the major, ascending, with their counts. */
  minors: { version: string; count: number }[];
  families: { family: HkFamily; count: number }[];
  /** Apple's own topic groups, by count descending then name. */
  appleGroups: Count[];
  /** This site's group pages, by count descending then label. */
  sitePages: Count[];
  deprecated: HkIdentifier[];
  undocumented: HkIdentifier[];
  noAbstract: HkIdentifier[];
  beta: HkIdentifier[];
  quantity: { total: number; cumulative: number; discrete: number; unstated: HkIdentifier[] };
  units: Count[];
  categories: HkIdentifier[];
};

function tally(items: { key: string; label: string }[]): Count[] {
  const m = new Map<string, Count>();
  for (const it of items) {
    const c = m.get(it.key) ?? { key: it.key, label: it.label, count: 0 };
    c.count++;
    m.set(it.key, c);
  }
  return [...m.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function buildMajor(major: number, rows: HkIdentifier[]): HkMajor {
  const members = [...rows].sort(
    (a, b) => FAMILY_ORDER[a.family] - FAMILY_ORDER[b.family] || a.case.localeCompare(b.case),
  );
  const minorMap = new Map<string, number>();
  for (const r of members) {
    const v = iosIntroduced(r)!;
    minorMap.set(v, (minorMap.get(v) ?? 0) + 1);
  }
  const famMap = new Map<HkFamily, number>();
  for (const r of members) famMap.set(r.family, (famMap.get(r.family) ?? 0) + 1);
  const quantities = members.filter((r) => r.family === "quantity");
  return {
    major,
    slug: `ios-${major}`,
    path: `${HK_VERSIONS_PATH}/ios-${major}`,
    members,
    minors: [...minorMap.entries()]
      .sort((a, b) => compareVersions(a[0], b[0]))
      .map(([version, count]) => ({ version, count })),
    families: [...famMap.entries()]
      .sort((a, b) => b[1] - a[1] || FAMILY_ORDER[a[0]] - FAMILY_ORDER[b[0]])
      .map(([family, count]) => ({ family, count })),
    appleGroups: tally(members.map((r) => ({ key: r.group, label: r.group }))),
    sitePages: tally(
      members.map((r) => {
        const s = hkGroupSlugOf(r) ?? "";
        return { key: s, label: s ? hkGroupLabel(s) : "unmapped" };
      }),
    ),
    deprecated: members.filter((r) => r.deprecated),
    undocumented: members.filter((r) => r.undocumented),
    noAbstract: members.filter((r) => !r.abstract),
    beta: members.filter((r) => r.platforms.some((p) => p.beta)),
    quantity: {
      total: quantities.length,
      cumulative: quantities.filter((r) => r.aggregation === "cumulative").length,
      discrete: quantities.filter((r) => r.aggregation === "discrete").length,
      unstated: quantities.filter((r) => r.aggregation === null),
    },
    units: tally(
      quantities.map((r) => ({ key: r.unitFamily ?? "", label: r.unitFamily ?? "not stated" })),
    ),
    categories: members.filter((r) => r.family === "category"),
  };
}

/** Every iOS major in the dataset, ascending, page-worthy or not. */
export const HK_MAJORS: HkMajor[] = (() => {
  const m = new Map<number, HkIdentifier[]>();
  for (const r of HK_IDENTIFIERS) {
    const v = iosIntroduced(r);
    if (!v) continue;
    const major = parts(v)[0] ?? 0;
    const list = m.get(major) ?? [];
    list.push(r);
    m.set(major, list);
  }
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([major, rows]) => buildMajor(major, rows));
})();

/** The majors that get a page, ascending. */
export function hkVersionPages(): HkMajor[] {
  return HK_MAJORS.filter((g) => g.members.length >= HK_VERSION_MIN_MEMBERS);
}

export function getHkVersionPage(slug: string): HkMajor | undefined {
  return hkVersionPages().find((g) => g.slug === slug);
}

/** Majors between two paged majors that have no page of their own. */
export function skippedBetween(prev: number, next: number): HkMajor[] {
  return HK_MAJORS.filter(
    (g) => g.major > prev && g.major < next && g.members.length < HK_VERSION_MIN_MEMBERS,
  );
}

const RELEASED_GROUP_SLUGS = new Set(releasedHkGroups().map((e) => e.slug));

/** The identifier's row on its group page, or on the flagship table when the
 *  group page is not released. */
export function hkRowHref(r: HkIdentifier): string {
  const slug = hkGroupSlugOf(r);
  const anchor = `#id-${r.case.toLowerCase()}`;
  if (slug && RELEASED_GROUP_SLUGS.has(slug)) return `${HK_BASE}/${slug}${anchor}`;
  return `/healthkit-identifiers${anchor}`;
}

export function hkGroupHref(r: HkIdentifier): string | null {
  const slug = hkGroupSlugOf(r);
  return slug && RELEASED_GROUP_SLUGS.has(slug) ? `${HK_BASE}/${slug}` : null;
}

// ── Generated copy. Template strings over computed numbers only. ──────────

function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function n(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function familyText(g: HkMajor): string {
  if (g.families.length === 1) {
    const f = g.families[0];
    return f.count === 1 ? `1 ${familyNoun(f.family, 1)}` : `all of them ${familyNoun(f.family, f.count)}`;
  }
  return list(g.families.map((f) => `${f.count} ${familyNoun(f.family, f.count)}`));
}

export function minorsText(g: HkMajor): string {
  if (g.minors.length === 1) return `iOS ${g.minors[0].version}`;
  return list(g.minors.map((m) => `iOS ${m.version} (${m.count})`));
}

function isFirst(g: HkMajor): boolean {
  return HK_MAJORS[0]?.major === g.major;
}

export function versionTitle(g: HkMajor): string {
  const count = g.members.length;
  return isFirst(g)
    ? `HealthKit iOS ${g.major} Types: ${count} Identifiers`
    : `HealthKit iOS ${g.major} New Types: ${count} Identifiers`;
}

export function versionH1(g: HkMajor): string {
  return `HealthKit Types Introduced in iOS ${g.major}`;
}

export function versionPrimaryQuery(g: HkMajor): string {
  return isFirst(g) ? `healthkit ios ${g.major} types` : `healthkit ios ${g.major} new types`;
}

function statusClause(g: HkMajor): string {
  const bits: string[] = [];
  if (g.deprecated.length) bits.push(`${g.deprecated.length} deprecated`);
  if (g.noAbstract.length) bits.push(`${g.noAbstract.length} with no abstract`);
  if (g.beta.length) bits.push(`${g.beta.length} beta`);
  return bits.length ? `${list(bits)}.` : "None deprecated.";
}

/** Meta description, kept within qa's 155-character limit by dropping
 *  clauses rather than truncating mid-word. */
export function versionDescription(g: HkMajor): string {
  const count = g.members.length;
  const head = `${count} HealthKit type identifiers arrived in iOS ${g.major}`;
  const candidates = [
    `${head}: ${familyText(g)}. ${statusClause(g)} Group, aggregation and unit for each.`,
    `${head}: ${familyText(g)}. ${statusClause(g)}`,
    `${head}. ${statusClause(g)} Family, group, aggregation and unit for each.`,
    `${head}, with family, group, aggregation and unit for each.`,
  ];
  return candidates.find((c) => c.length <= 155) ?? candidates[candidates.length - 1];
}

export function versionCapsule(g: HkMajor): string {
  const count = g.members.length;
  const total = HK_IDENTIFIERS.length;
  const lead = g.appleGroups[0];
  const groups =
    g.appleGroups.length === 1
      ? `All of them sit in Apple's ${lead.label} topic group.`
      : `They sit in ${g.appleGroups.length} of Apple's topic groups, the largest being ${lead.label} with ${lead.count}.`;
  const status: string[] = [];
  if (g.deprecated.length) {
    status.push(
      `Apple's availability data marks ${list(g.deprecated.map((r) => r.case))} deprecated.`,
    );
  } else {
    status.push(`None is deprecated.`);
  }
  if (g.noAbstract.length) {
    status.push(
      `${n(g.noAbstract.length, "identifier is", "identifiers are")} listed with no abstract: ${list(g.noAbstract.map((r) => r.case))}.`,
    );
  } else {
    status.push(`Every one carries an abstract.`);
  }
  const versions = g.minors.length === 1 ? "the introduction version" : "the introduction versions";
  return `Apple's documentation, as read on ${HK_FETCHED_ON}, gives ${minorsText(g)} as ${versions} for ${count} of the ${total} HealthKit type identifiers in this dataset: ${familyText(g)}. ${groups} ${status.join(" ")}`;
}

export type GeneratedFaq = { q: string; a: string };

/** Every question embeds the major version, so qa's faqKey normalizer keeps
 *  them distinct from each other and from the hub's own questions. */
export function versionFaqs(g: HkMajor): GeneratedFaq[] {
  const N = g.major;
  const count = g.members.length;
  const faqs: GeneratedFaq[] = [];

  faqs.push({
    q: `Which HealthKit identifiers did iOS ${N} introduce?`,
    a:
      `${count}, according to Apple's documentation as read on ${HK_FETCHED_ON}: ${familyText(g)}.` +
      (count <= 20
        ? ` They are ${list(g.members.map((r) => r.case))}.`
        : ` The table on this page lists all ${count} with their group, aggregation style and unit family.`),
  });

  {
    const sentences: string[] = [];
    if (g.deprecated.length) {
      sentences.push(
        `Apple's availability data marks ${n(g.deprecated.length, "of them", "of them")} deprecated: ${list(
          g.deprecated.map((r) => {
            const at = iosDeprecatedAt(r);
            return at ? `${r.case} (deprecated in iOS ${at})` : r.case;
          }),
        )}.`,
      );
    } else {
      sentences.push(`None of the ${count} is deprecated in Apple's availability data.`);
    }
    if (g.undocumented.length) {
      sentences.push(
        `${n(g.undocumented.length, "is", "are")} listed with no abstract and no discussion: ${list(g.undocumented.map((r) => r.case))}.`,
      );
    } else if (g.noAbstract.length) {
      sentences.push(
        `${n(g.noAbstract.length, "has", "have")} no abstract: ${list(g.noAbstract.map((r) => r.case))}.`,
      );
    } else {
      sentences.push(`Every one carries an abstract.`);
    }
    if (g.beta.length) {
      sentences.push(`${n(g.beta.length, "is", "are")} marked beta: ${list(g.beta.map((r) => r.case))}.`);
    }
    faqs.push({
      q: `Are any of the HealthKit types from iOS ${N} deprecated or undocumented?`,
      a: sentences.join(" "),
    });
  }

  if (g.quantity.total > 0) {
    const q = g.quantity;
    const only = g.members.find((r) => r.family === "quantity")!;
    let a: string;
    if (q.total === 1) {
      a =
        only.aggregation === null
          ? `iOS ${N} introduced one quantity type, ${only.case}, and Apple's prose states no aggregation style for it, so this dataset leaves it null.`
          : `iOS ${N} introduced one quantity type, ${only.case}, which Apple's prose describes as ${only.aggregation} (${only.aggregation === "cumulative" ? ".cumulativeSum" : ".discreteAverage"}).`;
    } else {
      a = `Of the ${q.total} quantity types iOS ${N} introduced, Apple's prose describes ${q.cumulative} as cumulative (.cumulativeSum) and ${q.discrete} as discrete (.discreteAverage).`;
    }
    if (q.total > 1 && q.unstated.length) {
      a += ` For ${q.unstated.length === 1 ? "one" : q.unstated.length}, ${list(q.unstated.map((r) => r.case))}, it states neither, so this dataset leaves the aggregation style null.`;
    }
    faqs.push({ q: `Do HealthKit's iOS ${N} quantity types sum or average?`, a });
  } else if (g.categories.length > 0) {
    faqs.push({
      q: `Which value enums decode the iOS ${N} HealthKit category types?`,
      a: `${list(
        g.categories.map((r) => (r.valueEnum ? `${r.case} uses ${r.valueEnum}` : `${r.case} has no value enum resolved`)),
      )}, according to this site's read of Apple's documentation on ${HK_FETCHED_ON}.`,
    });
  }

  if (g.minors.length > 1) {
    faqs.push({
      q: `Which iOS ${N} point releases introduced HealthKit identifiers?`,
      a: `${g.minors.length} of them: ${list(g.minors.map((m) => `iOS ${m.version} with ${m.count}`))}. This page groups them all under iOS ${N}.`,
    });
  } else {
    faqs.push({
      q: `Which Apple topic groups hold the HealthKit types from iOS ${N}?`,
      a: `${list(g.appleGroups.map((c) => `${c.label} (${c.count})`))}. Every one of the ${count} was introduced in iOS ${g.minors[0].version}.`,
    });
  }

  return faqs;
}
