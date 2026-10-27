import type { Metadata } from "next";
import type { ClusterEntry, ClusterConfig } from "./cluster";
import { clusterMap, CLUSTER_LABELS } from "./clusterRegistry";
import { absoluteUrl } from "./site";
import {
  loadTranslations,
  translationStatus,
  LOCALES,
  type StoredTranslation,
} from "./translationStore.mjs";

/**
 * The Brazilian Portuguese edition (ops/SEO-10-2026-10-27.md item 10).
 *
 * A translation is a rendering of an English page, never a re-verification
 * of it. So the translated page shows the English page's verification date
 * labelled as such, reads its sources list from the English entry, and the
 * moment the English text changes (its hash stops matching the translation's
 * `sourceHash`) the translation stops presenting itself as current:
 *
 *   current  indexable, in the sitemap, hreflang both ways, linked from the
 *            English page's language switch, linked to from other
 *            translations;
 *   stale    noindex, follow; out of the sitemap and hreflang; a notice in
 *            Portuguese naming the English page as the current version;
 *            other translations link the English page instead.
 *
 * The translation store and the hash live in ./translationStore.mjs so qa
 * and scripts/translation-status.mjs compute the same status the build does.
 */

export const PT_PREFIX = "/pt-br";
export const PT = LOCALES["pt-br"];

/** Labels for the five clusters translated pages come from. */
const HUB_LABELS_PT: Record<string, string> = {
  "/alternatives": "Alternativas",
  "/pricing": "Preços",
  "/fix": "Solução de problemas",
  "/integrate": "Guias de integração",
  "/fitness-apis": "APIs de fitness",
};

export type PtPage = {
  t: StoredTranslation;
  en: ClusterEntry;
  basePath: string;
  slug: string;
  status: "current" | "stale";
  currentHash: string;
  /** The verification date that applies to the translated text. */
  verifiedOn: string;
  hubLabelPt: string;
};

let cache: { pages: PtPage[]; orphans: StoredTranslation[] } | null = null;

function build() {
  if (cache) return cache;
  const map = clusterMap();
  const pages: PtPage[] = [];
  const orphans: StoredTranslation[] = [];
  for (const t of loadTranslations("pt-br")) {
    const [, cluster, slug] = t.enPath.split("/");
    const basePath = `/${cluster}`;
    const en = map[basePath]?.find((e) => e.slug === slug);
    const { status, currentHash } = translationStatus(t, en);
    // An English page that no longer exists leaves nothing to translate or
    // link to; the page is not built and qa's PTBR-ORPHAN names the file.
    if (status === "orphan" || !en || !currentHash) {
      orphans.push(t);
      continue;
    }
    pages.push({
      t,
      en,
      basePath,
      slug,
      status,
      currentHash,
      // While current, the English text has not changed since translation,
      // so the English page's latest verification covers these words too.
      // Once stale, only the date the translated text was checked holds.
      verifiedOn: status === "current" ? en.updated : t.sourceUpdated,
      hubLabelPt: HUB_LABELS_PT[basePath] ?? CLUSTER_LABELS[basePath] ?? basePath,
    });
  }
  cache = { pages, orphans };
  return cache;
}

/** Every built translation, current and stale, in English-path order. */
export function ptPages(): PtPage[] {
  return build().pages;
}

export function ptPageByPath(enPath: string): PtPage | undefined {
  return build().pages.find((p) => p.t.enPath === enPath);
}

/** The translated path for an English path, only while that translation is current. */
export function currentPtPath(enPath: string): string | null {
  const p = ptPageByPath(enPath);
  return p && p.status === "current" ? p.t.path : null;
}

/** The index lists its pages but is noindex until three are current. */
export const PT_INDEX_MIN_CURRENT = 3;
export function ptIndexIndexable(): boolean {
  return ptPages().filter((p) => p.status === "current").length >= PT_INDEX_MIN_CURRENT;
}

/**
 * A link on a translated page. It goes to the translation when one exists
 * and is current, otherwise to the English page. A fragment survives only
 * when it names an anchor both editions share (an FAQ answer or the
 * capsule): heading ids are slugs of the heading text, which a translation
 * changes, so a heading fragment keeps pointing at the English page.
 */
export function localizeHref(href: string): string {
  if (!href.startsWith("/")) return href;
  const hash = href.indexOf("#");
  const p = hash === -1 ? href : href.slice(0, hash);
  const frag = hash === -1 ? "" : href.slice(hash + 1);
  if (frag && !/^(faq-\d+|answer)$/.test(frag)) return href;
  const pt = currentPtPath(p);
  return pt ? `${pt}${hash === -1 ? "" : `#${frag}`}` : href;
}

/** Rewrites every inline markdown link target in a translated body. */
export function localizeBody(md: string): string {
  return md.replace(/\]\((\/[^)\s]*)\)/g, (_m, href: string) => `](${localizeHref(href)})`);
}

/**
 * hreflang for one English page: en ↔ pt-BR, x-default → en. Returns
 * nothing unless the translation is current, so a stale translation is
 * never offered to a searcher as an equivalent of the English page.
 */
export function hreflangFor(enPath: string): NonNullable<Metadata["alternates"]>["languages"] | undefined {
  const pt = currentPtPath(enPath);
  if (!pt) return undefined;
  return { en: enPath, "pt-BR": pt, "x-default": enPath };
}

/** Spread into an English page's `alternates`: `languages` while a current
 *  translation exists, nothing otherwise. */
export function languageAlternates(enPath: string): { languages?: ReturnType<typeof hreflangFor> } {
  const languages = hreflangFor(enPath);
  return languages ? { languages } : {};
}

export { formatDatePt } from "./datePt";

/** The translated page as the entry shape the shared template renders. */
export function ptEntry(p: PtPage): ClusterEntry {
  const { t, en } = p;
  return {
    slug: en.slug,
    primaryQuery: en.primaryQuery,
    h1: t.h1,
    metaTitle: t.metaTitle,
    metaDescription: t.metaDescription,
    updated: p.verifiedOn,
    answer: t.answer,
    body: localizeBody(t.body),
    faqs: t.faqs,
    related: t.related.map((r) => ({ href: localizeHref(r.href), label: r.label })),
    cta: { pitch: t.cta },
    ...(t.steps.length ? { steps: t.steps } : {}),
    // The sources list belongs to the English page's latest verification.
    // While current it covers this text; once stale it may not, so it goes.
    ...(p.status === "current" && en.sources?.length ? { sources: en.sources } : {}),
    ...(en.firstParty ? { firstParty: true } : {}),
  };
}

/** What the shared template needs to render a page as a translation. */
export type TranslationView = {
  lang: "pt-BR";
  enPath: string;
  enH1: string;
  path: string;
  status: "current" | "stale";
  translatedOn: string;
  sourceHash: string;
  hubLabel: string;
};

export function ptView(p: PtPage): TranslationView {
  return {
    lang: "pt-BR",
    enPath: p.t.enPath,
    enH1: p.en.h1,
    path: p.t.path,
    status: p.status,
    translatedOn: p.t.translatedOn,
    sourceHash: p.t.sourceHash,
    hubLabel: p.hubLabelPt,
  };
}

export function ptConfig(p: PtPage): ClusterConfig {
  return { basePath: `${PT_PREFIX}${p.basePath}`, hubLabel: p.hubLabelPt };
}

/** The English page's share card, which the translation reuses. */
export function ptOgImage(p: PtPage): string {
  return absoluteUrl(`${p.t.enPath}/opengraph-image`);
}
