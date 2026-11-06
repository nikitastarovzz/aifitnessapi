import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  CHEATSHEET_BLURBS,
  CHEATSHEETS_DESCRIPTION,
  CHEATSHEETS_H1,
  CHEATSHEETS_METHOD,
  CHEATSHEETS_PATH,
  CHEATSHEETS_TITLE,
  cheatSheets,
  cheatSheetsAsOf,
  cheatSheetsCapsule,
  kb,
} from "@/lib/kitPages";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * /cheat-sheets — printable one-page sheets (ops/VIRAL-20-2026-11-06.md item
 * 13). The files are drawn by scripts/build-cheat-sheets.mjs; this page lists
 * public/cheat-sheets/manifest.json, which that script writes.
 */

export const metadata: Metadata = {
  title: { absolute: CHEATSHEETS_TITLE },
  description: CHEATSHEETS_DESCRIPTION,
  alternates: pageMirrorAlternates(CHEATSHEETS_PATH),
  openGraph: { type: "website", title: CHEATSHEETS_TITLE, description: CHEATSHEETS_DESCRIPTION, url: CHEATSHEETS_PATH },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const H2 = "text-2xl font-bold tracking-tight text-[var(--fg)]";

export default function CheatSheetsPage() {
  const sheets = cheatSheets();
  const url = absoluteUrl(CHEATSHEETS_PATH);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: CHEATSHEETS_TITLE,
        description: CHEATSHEETS_DESCRIPTION,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: orgRef,
        dateModified: cheatSheetsAsOf(),
      },
      ...sheets.flatMap((s) => [
        {
          "@type": "DigitalDocument",
          name: `${s.title} (PDF, A4)`,
          url: absoluteUrl(s.pdf),
          encodingFormat: "application/pdf",
          license: "https://creativecommons.org/licenses/by/4.0/",
          dateModified: s.asOf,
        },
        {
          "@type": "ImageObject",
          name: s.title,
          contentUrl: absoluteUrl(s.png),
          encodingFormat: "image/png",
          width: s.pngWidth,
          height: s.pngHeight,
          license: "https://creativecommons.org/licenses/by/4.0/",
          creator: orgRef,
        },
      ]),
    ],
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Cheat sheets", path: CHEATSHEETS_PATH },
          ]}
        />
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{CHEATSHEETS_H1}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {cheatSheetsCapsule()}
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {sheets.map((s) => {
            const b = CHEATSHEET_BLURBS[s.slug];
            return (
              <section key={s.slug} id={s.slug} className="scroll-mt-24" data-cheat-sheet={s.slug}>
                <h2 className="text-xl font-bold tracking-tight text-[var(--fg)]">{s.title}</h2>
                <a href={s.png} className="mt-3 block overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.png} alt={`${s.title}, one A4 page, data as of ${s.asOf}`} width={s.pngWidth} height={s.pngHeight} loading="lazy" className="h-auto w-full" />
                </a>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <a href={s.pdf} download className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-500" data-cta={`cheat-sheet-pdf-${s.slug}`}>
                    PDF ({kb(s.pdfBytes)})
                  </a>
                  <a href={s.png} download className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--fg)] hover:border-brand-400" data-cta={`cheat-sheet-png-${s.slug}`}>
                    PNG ({kb(s.pngBytes)})
                  </a>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{b.what}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  From {b.from}; sources read {s.asOf}.{" "}
                  <Link href={b.page.href} className={linkCls}>
                    {b.page.label}
                  </Link>
                </p>
              </section>
            );
          })}
        </div>

        <section className="mt-14">
          <h2 className={H2}>How the sheets are made</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {CHEATSHEETS_METHOD.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Free to print, pin and share under CC BY 4.0: credit {site.name} and link {url}.
          </p>
        </section>
      </div>
    </Container>
  );
}
