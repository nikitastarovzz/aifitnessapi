import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { contents } from "@/lib/awesomeList.mjs";
import {
  AWESOME_DESCRIPTION,
  AWESOME_GITHUB,
  AWESOME_H1,
  AWESOME_METHOD,
  AWESOME_PAGE_TITLE,
  AWESOME_PATH,
  awesomeAsOf,
  awesomeCapsule,
  awesomePageModel,
} from "@/lib/awesomeView";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * /awesome — the awesome-fitness-apis list (ops/VIRAL-20-2026-11-06.md item
 * 11). The same model scripts/build-awesome.mjs writes to AWESOME.md.
 */

export const metadata: Metadata = {
  title: { absolute: AWESOME_PAGE_TITLE },
  description: AWESOME_DESCRIPTION,
  alternates: pageMirrorAlternates(AWESOME_PATH),
  openGraph: { type: "website", title: AWESOME_PAGE_TITLE, description: AWESOME_DESCRIPTION, url: AWESOME_PATH },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";

export default function AwesomePage() {
  const model = awesomePageModel();
  const url = absoluteUrl(AWESOME_PATH);
  const items = model.sections.flatMap((s) => s.groups.flatMap((g) => g.entries));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: AWESOME_PAGE_TITLE,
        description: AWESOME_DESCRIPTION,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: orgRef,
        dateModified: awesomeAsOf(),
        license: "https://creativecommons.org/licenses/by/4.0/",
        mainEntity: { "@id": `${url}#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#list`,
        name: model.title,
        numberOfItems: items.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
      },
    ],
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Awesome Fitness APIs", path: AWESOME_PATH },
          ]}
        />
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{AWESOME_H1}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {awesomeCapsule()}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href={AWESOME_GITHUB} className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-500" data-cta="awesome-github">
            AWESOME.md on GitHub
          </a>
          <a href={`${AWESOME_PATH}.md`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            Markdown copy
          </a>
          <Link href="/datasets" className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400">
            The datasets behind it
          </Link>
        </div>

        <nav aria-label="Contents" className="mt-10 rounded-xl border border-[var(--border)] p-5">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Contents</h2>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {contents(model).map((c) => (
              <li key={c.anchor} className={c.depth ? "pl-4" : "font-semibold"}>
                <a href={`#${c.anchor}`} className={linkCls}>
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {model.sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-14 scroll-mt-24">
            <h2 className={H2}>{s.title}</h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">{s.intro}</p>
            {s.groups.map((g) => (
              <div key={g.id} id={g.title ? g.id : undefined} className="mt-6 scroll-mt-24">
                {g.title ? <h3 className="text-lg font-semibold text-[var(--fg)]">{g.title}</h3> : null}
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                  {g.entries.map((e) => (
                    <li key={`${e.url}|${e.name}`} className="break-words">
                      <a href={e.url} className={linkCls}>
                        {e.name}
                      </a>{" "}
                      &mdash; {e.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        <section className="mt-14">
          <h2 className={H2}>How the list is made</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {AWESOME_METHOD.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Free to copy and share under CC BY 4.0: credit {site.name} and link {url}. Found a wrong line? It is wrong in the data, so{" "}
            <Link href="/corrections" className={linkCls}>
              report it
            </Link>{" "}
            and the list regenerates.
          </p>
        </section>
      </div>
    </Container>
  );
}
