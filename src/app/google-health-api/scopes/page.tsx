import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import PageActions from "@/components/PageActions";
import {
  GHAPI_DISCOVERY_SCOPES,
  GHAPI_DOCUMENTED_SCOPES,
  GHAPI_FETCHED_ON,
  GHAPI_FLAGS,
  GHAPI_METHODS,
  GHAPI_RELEASE_NOTES,
  GHAPI_SCOPE_PREFIX,
  GHAPI_SCOPE_PREFIX_EVIDENCE,
} from "@/data/googleHealthApi";
import { GHAPI_BASE, GHAPI_PATHS, fitDescription, fitTitle, joinList, source, typePath, typesForScope } from "@/data/ghapiPages";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, JsonLd, faqGraph, type Faq } from "../../error-codes/_shared";
import { Blocks, CAPSULE, Code, FetchedLine, FlagList, GoogleSection, H2, Inline, LINK, SourcesChecked, TH, TopicNav, ghapiGraph } from "../_shared";

/**
 * Every Google Health API scope: the ones Google's Scopes page documents,
 * with the consent text and the data types each covers (from the data-types
 * table), the ones only the discovery document defines, and the release
 * notes that added or renamed scopes. The Fitbit-scope mapping is owned by
 * the mapping page and linked from here.
 */

const PATH = GHAPI_PATHS.scopes;
const DOC = GHAPI_DOCUMENTED_SCOPES;
const DISC = GHAPI_DISCOVERY_SCOPES.filter((s) => s.googleHealth);
const DISC_ONLY = DISC.filter((s) => !s.onScopesPage);
const DOC_ONLY = DOC.filter((s) => !s.inDiscoveryV4);
const FAMILIES = [...new Set(DOC.map((s) => s.family))];
const OTHER = GHAPI_DISCOVERY_SCOPES.filter((s) => !s.googleHealth);
const SCOPE_FLAGS = GHAPI_FLAGS.filter((f) => f.kind.startsWith("scope-") || f.kind === "restricted-scope-wording");
const TYPE_SCOPE_FLAGS = SCOPE_FLAGS.filter((f) => f.dataType);
const SECTION_SCOPE_FLAGS = SCOPE_FLAGS.filter((f) => !f.dataType);
const SCOPE_RELEASES = GHAPI_RELEASE_NOTES.flatMap((r) =>
  r.sections.filter((s) => /scope/i.test(s.heading ?? "")).map((s) => ({ date: r.date, dateText: r.dateText, ...s })),
);

const TITLE = fitTitle([`Google Health API Scopes: All ${DOC.length} and What Each Covers`, `Google Health API Scopes (${DOC.length})`]);
const H1 = "Google Health API scopes: every scope and the data it covers";
const DESCRIPTION = fitDescription([
  `Every Google Health API OAuth scope Google documents (${DOC.length}), its consent text, the data types each covers, and the scopes only the discovery document defines.`,
  `Every Google Health API OAuth scope (${DOC.length}) with Google's consent text, the data types it covers and discovery-only scopes.`,
]);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const scopeId = (shorthand: string) => `scope-${shorthand.replace(/^\./, "").replace(/[._]/g, "-")}`;
const activity = DOC.find((s) => s.shorthand === ".activity_and_fitness.readonly");

const FAQS: Faq[] = [
  {
    q: "What prefix do Google Health API OAuth scopes start with?",
    a: `${GHAPI_SCOPE_PREFIX}. Google's Scopes page: "${GHAPI_SCOPE_PREFIX_EVIDENCE}" Google's tables print each scope as the suffix after it, such as .sleep.readonly, so the full scope is ${GHAPI_SCOPE_PREFIX}.sleep.readonly.`,
  },
  ...(activity
    ? [
        {
          q: `What does the googlehealth${activity.shorthand} scope cover?`,
          a: `Google's Scopes page: "${activity.permission}" Google's data-types table lists it for ${typesForScope(activity.url).length} data types: ${joinList(
            typesForScope(activity.url).map((t) => t.dataType),
          )}.`,
        },
      ]
    : []),
  ...(DOC_ONLY.length
    ? [
        {
          q: `Is googlehealth${DOC_ONLY[0].shorthand} a valid Google Health API scope?`,
          a: `Google's pages disagree. The Scopes page documents ${DOC_ONLY[0].shorthand} ("${DOC_ONLY[0].permission}"), and the data-types table lists it for ${joinList(
            typesForScope(DOC_ONLY[0].url).map((t) => t.dataType),
          )}, but the v4 discovery document (read ${source("discoveryV4").fetchedOn}) does not define ${DOC_ONLY[0].url}, and none of its methods lists it among accepted scopes. Test a consent request with it before shipping.`,
        },
      ]
    : []),
  ...(DISC_ONLY.length
    ? [
        {
          q: "Which Google Health API scopes are missing from Google's Scopes page?",
          a: `${DISC_ONLY.length} that the v4 discovery document defines: ${joinList(DISC_ONLY.map((s) => `${s.shorthand} ("${s.description}")`))}. Google's Scopes page, last updated ${source("scopes").lastUpdated}, lists ${DOC.length} scopes without them.`,
        },
      ]
    : []),
];

export default function GhapiScopesPage() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd data={ghapiGraph({ path: PATH, title: TITLE, headline: H1, description: DESCRIPTION, sources: ["scopes", "dataTypes", "discoveryV4", "releaseNotes"] })} />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Google Health API", path: GHAPI_BASE },
            { name: "Scopes", path: PATH },
          ]}
        />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{H1}</h1>
        <FetchedLine extra={<> · Google’s Scopes page last updated {source("scopes").lastUpdated}</>} />

        <p id="answer" className={CAPSULE}>
          Google’s Scopes page documents {DOC.length} scopes across {FAMILIES.length} families, every one beginning{" "}
          {GHAPI_SCOPE_PREFIX}. The v4 discovery document defines {DISC.length} googlehealth scopes
          {DISC_ONLY.length ? `; ${DISC_ONLY.length} of them (${joinList(DISC_ONLY.map((s) => s.shorthand ?? s.url))}) are not on the Scopes page` : ""}
          {DOC_ONLY.length ? `, and the page’s ${joinList(DOC_ONLY.map((s) => s.shorthand))} is not in the discovery document` : ""}. The table
          below gives each documented scope with the data types whose row in Google’s data-types table lists it.
        </p>

        <PageActions path={PATH} url={url} title={H1} updated={GHAPI_FETCHED_ON} markdown={false} />
        <TopicNav current={PATH} />

        <section id="documented" className="mt-12 scroll-mt-24">
          <h2 className={H2}>The {DOC.length} documented scopes</h2>
          <p className="mt-2 text-[var(--muted)]">
            In the Scopes page’s order, with its consent text verbatim. “Data types” are the types whose row in Google’s
            data-types table lists the scope.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={TH}>
                    Scope
                  </th>
                  <th scope="col" className={TH}>
                    Google’s permission text
                  </th>
                  <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                    Data types
                  </th>
                </tr>
              </thead>
              <tbody>
                {DOC.map((s) => {
                  const types = typesForScope(s.url);
                  return (
                    <tr key={s.url} id={scopeId(s.shorthand)} data-ghapi-scope={s.url} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4">
                        <Code>{s.shorthand}</Code>
                        <span className="mt-0.5 block break-all font-mono text-[11px] text-[var(--muted)]">{s.url}</span>
                        {!s.inDiscoveryV4 && <span className="mt-1 block text-xs text-amber-700 dark:text-amber-400">not in the v4 discovery document</span>}
                      </td>
                      <td className="py-2 pr-4 text-[var(--muted)]">{s.permission}</td>
                      <td className="py-2 text-[var(--muted)]">
                        {types.length
                          ? types.map((t, i) => (
                              <span key={t.dataType}>
                                {i > 0 ? ", " : ""}
                                <Link href={typePath(t)} className="font-mono text-[12px] text-brand-600 hover:text-brand-500">
                                  {t.dataType}
                                </Link>
                              </span>
                            ))
                          : "none in the data-types table"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Google’s Scopes page: “<Inline text={GHAPI_SCOPE_PREFIX_EVIDENCE ?? ""} />”
          </p>
        </section>

        {DISC_ONLY.length > 0 && (
          <section id="discovery-only" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Scopes only the discovery document defines</h2>
            <p className="mt-2 text-[var(--muted)]">
              The v4 discovery document (read {source("discoveryV4").fetchedOn}) defines these, with its own consent text;
              Google’s Scopes page does not list them.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className={TH}>
                      Scope
                    </th>
                    <th scope="col" className="py-2 font-semibold text-[var(--fg)]">
                      Discovery document description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DISC_ONLY.map((s) => (
                    <tr key={s.url} data-ghapi-scope={s.url} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4">
                        <Code>{s.shorthand ?? s.url}</Code>
                        <span className="mt-0.5 block break-all font-mono text-[11px] text-[var(--muted)]">{s.url}</span>
                      </td>
                      <td className="py-2 text-[var(--muted)]">{s.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {OTHER.map((o) => {
              const users = GHAPI_METHODS.filter((m) => m.scopes.includes(o.url)).map((m) => `${m.resource}.${m.name}`);
              return (
                <p key={o.url} className="mt-3 text-sm text-[var(--muted)]">
                  The discovery document also defines <Code>{o.url}</Code>
                  {o.description ? ` (“${o.description}”)` : ""}, which it lists on {users.length} method
                  {users.length === 1 ? "" : "s"}
                  {users.length ? `: ${joinList(users)}` : ""}.
                </p>
              );
            })}
          </section>
        )}

        {SECTION_SCOPE_FLAGS.length + TYPE_SCOPE_FLAGS.length > 0 && (
          <section id="flags" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Where Google’s pages disagree about scopes</h2>
            <FlagList flags={SECTION_SCOPE_FLAGS} />
            {TYPE_SCOPE_FLAGS.length > 0 && (
              <p className="mt-4 text-sm text-[var(--muted)]">
                The same disagreement shows on the data types whose rows list the scope:{" "}
                {[...new Set(TYPE_SCOPE_FLAGS.map((f) => f.dataType as string))].map((id, i) => (
                  <span key={id}>
                    {i > 0 ? ", " : ""}
                    <Link href={`${typePath({ dataType: id })}#flags`} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                      {id}
                    </Link>
                  </span>
                ))}
                .
              </p>
            )}
          </section>
        )}

        <section id="implementation" className="mt-14 scroll-mt-24">
          <h2 className={H2}>How Google says to request scopes</h2>
          <GoogleSection page="scopes" id="implementation" heading="Implementation" />
        </section>

        {SCOPE_RELEASES.length > 0 && (
          <section id="history" className="mt-14 scroll-mt-24">
            <h2 className={H2}>Scope changes in Google’s release notes</h2>
            {SCOPE_RELEASES.map((r) => (
              <div key={`${r.date}-${r.id}`} className="mt-6">
                <h3 className="text-lg font-bold tracking-tight text-[var(--fg)]">
                  {r.dateText} — {r.heading}
                </h3>
                <div className="text-[var(--muted)]">
                  <Blocks blocks={r.blocks} />
                </div>
              </div>
            ))}
            <p className="mt-3 text-xs text-[var(--muted)]">
              Quoted from{" "}
              <a href={source("releaseNotes").url} className={LINK} rel="noopener">
                Google’s release notes
              </a>
              , last updated {source("releaseNotes").lastUpdated}, read {source("releaseNotes").fetchedOn}.
            </p>
          </section>
        )}

        <p className="mt-10 text-[var(--muted)]">
          Which Fitbit Web API scope maps to which of these:{" "}
          <Link href={`${GHAPI_PATHS.mapping}#scope-mapping`} className={LINK}>
            Google’s scope-mapping table
          </Link>
          . What a restricted scope means for launch:{" "}
          <Link href={GHAPI_PATHS.access} className={LINK}>
            verification and rate limits
          </Link>
          .
        </p>

        <FaqSection faqs={FAQS} />

        <ClusterCta
          pitch="Generated from Google's Scopes page and discovery document by a script. Subscribe to hear when Google adds, renames or retires a Google Health API scope."
          source="spoke-inline"
          id="cta-ghapi-scopes"
        />

        <SourcesChecked keys={["scopes", "dataTypes", "discoveryV4", "releaseNotes"]} />
      </div>
    </Container>
  );
}
