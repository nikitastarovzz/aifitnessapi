import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import {
  BT_BASE,
  BT_COMMIT_SHORT,
  BT_FETCHED,
  BT_PAGES,
  btById,
  btBySlug,
  btCapsule,
  btDescription,
  btFaqGraph,
  btFaqs,
  btGraph,
  btH1,
  btHref,
  btPath,
  btTitle,
  relatedGuides,
  sigCommitUrl,
  sigFileUrl,
} from "@/data/btPages";
import { site } from "@/lib/site";
import { Code, Definition, FieldNotes, GssText, LINK, LayoutTable } from "../_render";

/**
 * One page per in-scope Bluetooth GATT characteristic that passes the
 * thin-page rule (a gss structure of at least two fields, or a flags field).
 * The query is the characteristic's name or UUID, so both lead the title, the
 * H1 and the capsule.
 *
 * Every table is src/data/bluetoothGatt.ts rendered as read: the SIG's names,
 * types, sizes and text verbatim, with three computed columns — the offset
 * (only where every earlier size is a plain number), "present when" (from the
 * field's own "Present if" line, which the field notes also print), and, on a
 * flags table, the fields each bit's parsed condition names. The related
 * guides are the /devices pages that print this characteristic's UUID.
 *
 * No markdown mirror exists for this section, so no text/markdown alternate.
 */

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BT_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = btBySlug(slug);
  if (!c) return {};
  const canonical = btPath(c);
  const title = btTitle(c);
  const description = btDescription(c);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { type: "article", title, description, url: canonical, modifiedTime: BT_FETCHED },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BtCharacteristicPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = btBySlug(slug);
  if (!c || !c.gss) notFound();
  const g = c.gss;

  const path = btPath(c);
  const title = btTitle(c);
  const h1 = btH1(c);
  const description = btDescription(c);
  const faqs = btFaqs(c);
  const guides = relatedGuides(c);
  const at = BT_PAGES.findIndex((x) => x.id === c.id);
  const prev = at > 0 ? BT_PAGES[at - 1] : null;
  const next = BT_PAGES[at + 1] ?? null;
  const fileUrl = sigFileUrl(g.file);
  const uuidListUrl = sigFileUrl(BT_GATT_SOURCE.files.characteristicUuids);

  const toc: [string, string][] = [
    ["#layout", "Byte layout"],
    ["#fields", "Field notes"],
    ...(g.definitions.length ? ([["#definitions", "Flags and value tables"]] as [string, string][]) : []),
    ["#guides", "Guides"],
    ["#faq", "Questions"],
    ["#source", "Source"],
  ];

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            btGraph({
              path,
              title,
              headline: h1,
              description,
              about: { name: `${c.name} (${c.id})`, url: fileUrl },
              citations: [
                { name: `Bluetooth SIG — ${g.file}`, url: fileUrl },
                { name: `Bluetooth SIG — ${BT_GATT_SOURCE.files.characteristicUuids}`, url: uuidListUrl },
              ],
            }),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(btFaqGraph(path, faqs)) }} />

      <div className="mx-auto max-w-5xl" data-bt-characteristic={c.id}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Connected Devices", path: "/devices" },
            { name: "Bluetooth GATT reference", path: BT_BASE },
            { name: c.name, path },
          ]}
        />

        <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{h1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          GATT characteristic · <Code>{c.id}</Code> · read from the Bluetooth SIG’s repository on {BT_FETCHED}
          <ContentAge date={BT_FETCHED} /> · commit{" "}
          <a href={sigCommitUrl} rel="nofollow" className={LINK}>
            {BT_COMMIT_SHORT}
          </a>{" "}
          ({BT_GATT_SOURCE.commitDate})
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {btCapsule(c)}
        </p>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2 text-sm">
          {toc.map(([href, text]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {text}
            </a>
          ))}
        </nav>

        <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-[var(--border)] p-5 text-sm sm:grid-cols-[13rem_minmax(0,1fr)]">
          <dt className="min-w-0 font-semibold text-[var(--fg)]">UUID</dt>
          <dd className="min-w-0 font-mono text-[var(--fg)]">{c.uuid}</dd>
          <dt className="min-w-0 font-semibold text-[var(--fg)]">Identifier</dt>
          <dd className="min-w-0">
            <Code>{c.id}</Code>
          </dd>
          <dt className="min-w-0 font-semibold text-[var(--fg)]">The SIG’s description</dt>
          <dd className="min-w-0 text-[var(--muted)]">
            <GssText text={g.description} self={c} />
          </dd>
          <dt className="min-w-0 font-semibold text-[var(--fg)]">Service the SIG’s files tie it to</dt>
          <dd className="min-w-0 text-[var(--muted)]">
            {c.services.length ? (
              c.services.map((s) => (
                <span key={s.id} className="block">
                  {s.name} ({s.uuid}) — listed in{" "}
                  <a href={sigFileUrl(s.source)} rel="nofollow" className={LINK}>
                    {s.source.split("/").at(-1)}
                  </a>
                </span>
              ))
            ) : (
              <>None: no file in the repository lists this characteristic under a service.</>
            )}
          </dd>
          {c.referencedBy.length > 0 && (
            <>
              <dt className="min-w-0 font-semibold text-[var(--fg)]">Referenced by</dt>
              <dd className="min-w-0 text-[var(--muted)]">
                {c.referencedBy.map((id, i) => {
                  const r = btById(id);
                  return (
                    <span key={id}>
                      {i > 0 ? ", " : ""}
                      {r ? (
                        <Link href={btHref(r)} className={LINK}>
                          {r.name}
                        </Link>
                      ) : (
                        id
                      )}
                    </span>
                  );
                })}
              </dd>
            </>
          )}
          <dt className="min-w-0 font-semibold text-[var(--fg)]">Source file</dt>
          <dd className="min-w-0">
            <a href={fileUrl} rel="nofollow" className={`${LINK} break-all font-mono text-[13px]`}>
              {g.file}
            </a>
          </dd>
        </dl>

        <section id="layout" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Byte layout: {g.structure.length} {g.structure.length === 1 ? "field" : "fields"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            In the order the SIG’s structure lists them. Type and size are as published; sizes count octets except
            where a struct is marked as sized in bits. The offset is printed only where every earlier field has a
            fixed size; where an earlier field can be absent or vary, the cell names what it depends on. “Present
            when” is read from the field’s own “Present if” line, shown in full in the field notes below.
            {g.unresolvedRefs.length > 0 &&
              ` One cross-reference in this file names a section its fields do not define (${g.unresolvedRefs.join(", ")}); it is shown as text.`}
          </p>
          <LayoutTable c={c} />
        </section>

        <section id="fields" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Field notes</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Each field’s text in the SIG’s file, line by line.</p>
          <FieldNotes c={c} />
        </section>

        {g.definitions.length > 0 && (
          <section id="definitions" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Flags and value tables</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              The definitions the SIG’s file gives for its fields, every row as published. On a flags table the last
              column lists the fields whose “Present if” line names that bit.
            </p>
            {g.definitions.map((d) => (
              <Definition key={d.anchor} c={c} def={d} />
            ))}
          </section>
        )}

        <section id="guides" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Guides on this site</h2>
          {guides.length > 0 ? (
            <>
              <p className="mt-2 text-sm text-[var(--muted)]">The connected-device guides that name {c.uuid}:</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {guides.map((x) => (
                  <li key={x.href}>
                    <Link
                      href={x.href}
                      className="block h-full rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      {x.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted)]">
              No guide on this site names {c.uuid} yet. The{" "}
              <Link href="/devices" className={LINK}>
                connected-devices guides
              </Link>{" "}
              cover pairing, subscribing and testing for the device types they do name.
            </p>
          )}
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {faqs.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="source" className="mt-12 scroll-mt-24">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Source</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Read on {BT_FETCHED} from{" "}
            <a href={fileUrl} rel="nofollow" className={LINK}>
              {g.file}
            </a>{" "}
            and{" "}
            <a href={uuidListUrl} rel="nofollow" className={LINK}>
              {BT_GATT_SOURCE.files.characteristicUuids}
            </a>{" "}
            in the Bluetooth SIG’s public repository (branch {BT_GATT_SOURCE.branch}, commit {BT_COMMIT_SHORT}, committed{" "}
            {BT_GATT_SOURCE.commitDate}), by <Code>scripts/fetch-bluetooth-gatt.mjs</Code>. The file’s notice says it is
            proprietary to Bluetooth SIG, that furnishing it grants no licence, and that it is subject to change without
            notice; it is © Bluetooth SIG, Inc., and its text is quoted here for identification. Generated by {site.name},
            which is not affiliated with Bluetooth SIG; the SIG’s file remains the authority. The full notice and the
            conventions used on these pages are on the{" "}
            <Link href={`${BT_BASE}#terms`} className={LINK}>
              reference hub
            </Link>
            .
          </p>
        </section>

        {(prev || next) && (
          <nav aria-label="More Bluetooth characteristics" className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={btPath(prev)}
                className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← {prev.uuid}</span>
                <span className="mt-1 block text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">{prev.name}</span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={btPath(next)}
                className="group rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-xs uppercase tracking-wider text-[var(--muted)]">{next.uuid} →</span>
                <span className="mt-1 block text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">{next.name}</span>
              </Link>
            )}
          </nav>
        )}

        <p className="mt-8 text-sm">
          <Link href={BT_BASE} className={LINK}>
            ← All Bluetooth GATT characteristics
          </Link>
        </p>
      </div>
    </Container>
  );
}
