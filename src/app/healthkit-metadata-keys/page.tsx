import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import {
  HK_METADATA_KEYS,
  HK_METADATA_KEYS_FETCHED_ON,
  HK_METADATA_KEYS_SOURCE,
  HK_METADATA_KEY_GROUPS,
  HK_METADATA_OTHER_SYMBOLS,
  type HkMetadataKey,
} from "@/data/healthkitMetadataKeys";
import { absoluteUrl } from "@/lib/site";
import { CAPSULE, FaqSection, JsonLd, LINK, TH, articleGraph, count, faqGraph, listOf, site, type Faq } from "../error-codes/_shared";

/**
 * Every HKMetadataKey constant, grouped by Apple's own topic groups.
 *
 * Generated from src/data/healthkitMetadataKeys.ts
 * (scripts/fetch-healthkit-metadata-keys.mjs). Every number in the copy is
 * computed from the data; the value type is shown only where Apple's own
 * sentence states it, and that sentence is shown with it.
 */

const PATH = "/healthkit-metadata-keys";
const TITLE = "HealthKit Metadata Keys";
const FETCHED = HK_METADATA_KEYS_FETCHED_ON;

const KEYS = HK_METADATA_KEYS;
const GROUPS = HK_METADATA_KEY_GROUPS.map((g) => ({ name: g, keys: KEYS.filter((k) => k.group === g) }));
const LARGEST = [...GROUPS].sort((a, b) => b.keys.length - a.keys.length)[0];
const NO_ABSTRACT = KEYS.filter((k) => !k.abstract);
const UNDOCUMENTED = NO_ABSTRACT.filter((k) => !k.discussion);
const TYPED = KEYS.filter((k) => k.valueType);
const DEPRECATED = KEYS.filter((k) => k.deprecated);
const SAME_NAME = KEYS.filter((k) => k.objcName === k.swiftName);

/** Value-type counts, largest first. */
const TYPE_COUNTS = [...new Set(TYPED.map((k) => k.valueType as string))]
  .map((t) => ({ type: t, n: TYPED.filter((k) => k.valueType === t).length }))
  .sort((a, b) => b.n - a.n || a.type.localeCompare(b.type));

const groupId = (g: string) => `group-${g.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
const keyId = (k: HkMetadataKey) => `key-${k.swiftName.toLowerCase()}`;

/** Compare dotted versions numerically ("16.4" < "17.0"). */
function cmpVersion(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}
const iosOf = (k: HkMetadataKey) => k.platforms.find((p) => p.name === "iOS")?.introducedAt ?? null;
const IOS_VERSIONS = [...new Set(KEYS.map(iosOf).filter((v): v is string => v !== null))].sort(cmpVersion);
const NEWEST_IOS = IOS_VERSIONS.at(-1) ?? null;
const OLDEST_IOS = IOS_VERSIONS[0] ?? null;
const NEWEST = KEYS.filter((k) => NEWEST_IOS && iosOf(k) === NEWEST_IOS);
const ORIGINAL = KEYS.filter((k) => OLDEST_IOS && iosOf(k) === OLDEST_IOS);

/** "iOS 8.0 · watchOS 2.0 · …" in Apple's platform order. */
const platformLine = (k: HkMetadataKey) =>
  k.platforms
    .filter((p) => p.introducedAt)
    .map((p) => `${p.name} ${p.introducedAt}${p.deprecatedAt ? ` (deprecated ${p.deprecatedAt})` : ""}${p.beta ? " beta" : ""}`)
    .join(" · ");

const typeSummary = listOf(TYPE_COUNTS.map((t) => `${t.n} ${t.type}`));

/** A worked example for the FAQ: the first key whose sentence names both a
 *  wrapper and what it contains, else the first typed key. */
const TYPE_EXAMPLE = TYPED.find((k) => /\bcontain/.test(k.valueTypeEvidence ?? "")) ?? TYPED[0];

/** How Apple declares the keys themselves, read from the declarations. */
const declOf = (k: HkMetadataKey, lang: string) => k.declarations.find((d) => d.language === lang)?.text ?? "";
const SWIFT_STRING = KEYS.filter((k) => new RegExp(`^let ${k.swiftName}: String$`).test(declOf(k, "swift"))).length;
const OBJC_NSSTRING = KEYS.filter((k) => /^extern NSString \* const \w+;$/.test(declOf(k, "occ"))).length;

const DESCRIPTION = `All ${KEYS.length} HKMetadataKey constants from Apple's docs in ${GROUPS.length} topic groups, with Apple's wording, the value type where Apple states it, and OS versions.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS: Faq[] = [
  {
    q: "How many metadata keys does HealthKit define?",
    a: `${KEYS.length} HKMetadataKey constants, as read from Apple's Metadata Keys collection on ${FETCHED}. Apple files them under ${GROUPS.length} topic groups; the largest is ${LARGEST.name} with ${LARGEST.keys.length}. The same pages also list ${count(HK_METADATA_OTHER_SYMBOLS.length, "symbol")} that are not metadata keys (${listOf(HK_METADATA_OTHER_SYMBOLS.map((s) => s.name))}), which this count leaves out.`,
  },
  {
    q: "What kind of value does each HealthKit metadata key expect?",
    a: `Apple's own wording states the value for ${TYPED.length} of the ${KEYS.length} keys: ${typeSummary}.${
      TYPE_EXAMPLE ? ` For example, Apple's page for ${TYPE_EXAMPLE.swiftName} says: “${TYPE_EXAMPLE.valueTypeEvidence}”` : ""
    } For the other ${KEYS.length - TYPED.length}, Apple's page does not say, and this reference leaves the type blank rather than guessing.`,
  },
  {
    q: "Which HealthKit metadata keys have no description from Apple?",
    a: NO_ABSTRACT.length
      ? `${count(NO_ABSTRACT.length, "key")} had no abstract on Apple's pages in the ${FETCHED} read${UNDOCUMENTED.length === NO_ABSTRACT.length ? ", and no discussion either" : ""}: ${listOf(NO_ABSTRACT.map((k) => k.swiftName))}. Apple's declaration and OS availability are still published for each, so they are real constants; only the prose is missing.`
      : `None. In the ${FETCHED} read every one of the ${KEYS.length} keys carried an abstract.`,
  },
  {
    q: "Do HealthKit metadata keys use the same name in Swift and Objective-C?",
    a:
      SAME_NAME.length === KEYS.length
        ? `Yes. For all ${KEYS.length} keys Apple's Swift and Objective-C pages give the same constant name, so ${KEYS[0]?.swiftName} is spelled the same in both.${
            SWIFT_STRING === KEYS.length && OBJC_NSSTRING === KEYS.length
              ? ` Every key is declared as a String constant in Swift (“let … : String”) and an NSString constant in Objective-C (“extern NSString * const …”).`
              : ""
          }`
        : `For ${SAME_NAME.length} of the ${KEYS.length} keys, yes. The ${KEYS.length - SAME_NAME.length} that differ are ${listOf(KEYS.filter((k) => k.objcName !== k.swiftName).map((k) => `${k.swiftName} (Objective-C ${k.objcName})`))}.`,
  },
  {
    q: "Which HealthKit metadata keys need the newest iOS version?",
    a: NEWEST_IOS
      ? `${listOf(NEWEST.map((k) => k.swiftName))} ${NEWEST.length === 1 ? "was" : "were"} introduced in iOS ${NEWEST_IOS}, the newest version any key requires in the ${FETCHED} read. ${count(ORIGINAL.length, "key")} date back to iOS ${OLDEST_IOS}, the earliest version any key lists.${DEPRECATED.length ? ` ${count(DEPRECATED.length, "key")} carry a deprecation version.` : " None carries a deprecation version."}`
      : `Apple's pages gave no iOS availability for these keys in the ${FETCHED} read.`,
  },
];

export default function HealthKitMetadataKeysPage() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd data={articleGraph({ path: PATH, title: TITLE, description: DESCRIPTION, modified: FETCHED, section: "HealthKit" })} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "HealthKit", path: "/healthkit" },
            { name: "Metadata keys", path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Every HealthKit metadata key
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {count(KEYS.length, "key")} · {count(GROUPS.length, "topic group")} · last fetched from Apple&rsquo;s
          documentation on {FETCHED}
          <ContentAge date={FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          HealthKit defines {KEYS.length} <code className="font-mono text-base">HKMetadataKey</code> constants, which Apple
          files under {GROUPS.length} topic groups; the largest is {LARGEST.name} ({LARGEST.keys.length}). Apple&rsquo;s
          pages state what value a key takes for {TYPED.length} of them ({typeSummary}).{" "}
          {NO_ABSTRACT.length > 0 && `${count(NO_ABSTRACT.length, "key")} ship with no abstract. `}
          {NEWEST_IOS && `The newest need iOS ${NEWEST_IOS}.`}
        </p>

        <PageActions path={PATH} url={url} title={TITLE} updated={FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          Metadata rides on a sample, so the sample&rsquo;s type comes first:{" "}
          <Link href="/healthkit-identifiers" className={LINK}>
            every HealthKit type identifier
          </Link>{" "}
          lists those. The <code className="font-mono text-xs">HKQuantity</code> values several keys take need a unit
          from{" "}
          <Link href="/healthkit-units" className={LINK}>
            HealthKit units
          </Link>
          , and matching samples on a metadata value is a query predicate, covered in{" "}
          <Link href="/healthkit-queries" className={LINK}>
            HealthKit queries
          </Link>
          . The end-to-end setup is in{" "}
          <Link href="/integrate/healthkit" className={LINK}>
            integrating HealthKit
          </Link>
          .
        </p>

        <nav aria-label="Topic groups" className="mt-8">
          <ul className="flex flex-wrap gap-2 text-sm">
            {GROUPS.map((g) => (
              <li key={g.name}>
                <a
                  href={`#${groupId(g.name)}`}
                  className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] hover:text-brand-600"
                >
                  {g.name} ({g.keys.length})
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {GROUPS.map((g) => (
          <section key={g.name} id={groupId(g.name)} className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              {g.name} ({g.keys.length})
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className={TH}>Key</th>
                    <th className={TH}>Apple&rsquo;s description</th>
                    <th className={TH}>Value</th>
                    <th className="py-2 font-semibold text-[var(--fg)]">Introduced</th>
                  </tr>
                </thead>
                <tbody>
                  {g.keys.map((k, i) => {
                    const showSub = k.subgroup && k.subgroup !== g.keys[i - 1]?.subgroup;
                    return [
                      showSub ? (
                        <tr key={`sub-${k.subgroup}`} className="border-b border-[var(--border)]">
                          <td colSpan={4} className="pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                            {k.subgroup}
                          </td>
                        </tr>
                      ) : null,
                      <tr key={k.swiftName} id={keyId(k)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                        <td className="py-3 pr-4">
                          <a href={k.docUrl} rel="nofollow" className="break-all font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                            {k.swiftName}
                          </a>
                          {k.objcName && k.objcName !== k.swiftName && (
                            <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">ObjC {k.objcName}</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-[var(--muted)]">
                          <span className="text-[var(--fg)]">{k.abstract ?? <em>No abstract from Apple.</em>}</span>
                          {k.discussion && <span className="mt-1 block text-xs leading-relaxed">{k.discussion}</span>}
                          {k.deprecated && (
                            <span className="mt-1 block text-xs text-amber-700 dark:text-amber-400">
                              Deprecated{k.deprecation?.message ? `: ${k.deprecation.message}` : ""}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs text-[var(--muted)]">
                          {k.valueType ? (
                            <span className="font-mono font-semibold text-[var(--fg)]" title={k.valueTypeEvidence ?? undefined}>
                              {k.valueType}
                            </span>
                          ) : (
                            <span>Not stated</span>
                          )}
                        </td>
                        <td className="py-3 text-xs leading-relaxed text-[var(--muted)]">{platformLine(k)}</td>
                      </tr>,
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section id="value-types" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where the value type comes from</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The key itself is always a string constant. What you store under it is stated only in Apple&rsquo;s prose,
            so the Value column is filled only where a sentence on the key&rsquo;s page names it — {TYPED.length} of{" "}
            {KEYS.length} keys. A key whose page tells you to set the value to <code className="font-mono text-sm">true</code>{" "}
            or <code className="font-mono text-sm">false</code> is shown as Boolean. The sentence each type comes from is
            in that row&rsquo;s description, and the generated data file stores it beside the type.
          </p>
        </section>

        {NO_ABSTRACT.length > 0 && (
          <section id="no-abstract" className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Keys Apple ships without an abstract ({NO_ABSTRACT.length})
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              These constants have a declaration and OS availability on Apple&rsquo;s pages but no one-line description
              {UNDOCUMENTED.length === NO_ABSTRACT.length ? " and no discussion" : ""}. What they mean has to come from the
              name, the group Apple files them under, or Apple&rsquo;s other documentation — not from the reference entry.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-[var(--muted)]">
              {NO_ABSTRACT.map((k) => (
                <li key={k.swiftName}>
                  <a href={`#${keyId(k)}`} className="font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                    {k.swiftName}
                  </a>{" "}
                  — {k.subgroup ? `${k.group} › ${k.subgroup}` : k.group}
                  {iosOf(k) ? `, iOS ${iosOf(k)}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        <FaqSection faqs={FAQS} />

        <p className="mt-12 text-sm text-[var(--muted)]">
          Read on {FETCHED} from Apple&rsquo;s{" "}
          <a href={HK_METADATA_KEYS_SOURCE} rel="nofollow" className={LINK}>
            Metadata Keys
          </a>{" "}
          collection, its Workout Metadata Keys sub-collection and each key&rsquo;s own page by{" "}
          <code className="font-mono text-xs">scripts/fetch-healthkit-metadata-keys.mjs</code>. Apple also files{" "}
          {listOf(HK_METADATA_OTHER_SYMBOLS.map((s) => s.name))} on those pages; they are not metadata keys and are not
          rows here. Compiled by {site.name}; Apple&rsquo;s documentation remains the authority.
        </p>
      </div>
    </Container>
  );
}
