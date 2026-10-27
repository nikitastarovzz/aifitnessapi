import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { ptPages, ptIndexIndexable, formatDatePt, PT, PT_PREFIX, PT_INDEX_MIN_CURRENT } from "@/lib/translations";

/**
 * /pt-br — the index of the Brazilian Portuguese edition.
 *
 * Lists every built translation, current or stale, because a stale page is
 * still reachable and must say what it is. The index asks to be indexed only
 * once PT_INDEX_MIN_CURRENT translations are current: an index of one or two
 * pages is a thin page, and stale ones are not offered to search at all.
 *
 * Its date is the newest translation date it lists, declared as dateModified
 * so the sitemap row (when there is one) carries the same day.
 */
const TITLE = "AIFitnessAPI em português: guias de APIs de fitness";
const DESCRIPTION =
  "Traduções em português do Brasil dos guias mais lidos do AIFitnessAPI: integração com Garmin, Oura, Strava e Terra, preços e alternativas ao ExerciseDB.";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: PT_PREFIX },
    ...(ptIndexIndexable() ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: PT.ogLocale,
      title: TITLE,
      description: DESCRIPTION,
      url: PT_PREFIX,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }],
    },
  };
}

export default function PtIndex() {
  const pages = ptPages();
  const current = pages.filter((p) => p.status === "current");
  const newest = pages.map((p) => p.t.translatedOn).sort().at(-1);
  const url = absoluteUrl(PT_PREFIX);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: PT.lang,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    ...(newest ? { dateModified: newest } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pages.length,
      itemListElement: pages.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(p.t.path),
        name: p.t.h1,
      })),
    },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Em português", path: PT_PREFIX },
          ]}
        />
        <ClusterHero label="Em português" seed={3} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          AIFitnessAPI em português
        </h1>
        <div
          id="answer"
          className="mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Traduções para o português do Brasil de {pages.length} páginas do {site.name}. A versão em
          inglês é a referência: cada tradução mostra a data em que a página em inglês foi verificada e a
          data em que foi traduzida. Quando a página em inglês muda, a tradução é marcada como
          desatualizada e passa a apontar para o original até ser traduzida de novo.
        </div>

        <p className="mt-6 text-sm text-[var(--muted)]">
          {current.length} de {pages.length} traduções em dia
          {pages.length - current.length > 0 && <>; {pages.length - current.length} desatualizada(s)</>}.
          {current.length < PT_INDEX_MIN_CURRENT && (
            <> Este índice não pede indexação enquanto tiver menos de {PT_INDEX_MIN_CURRENT} traduções em dia.</>
          )}
        </p>

        <ul className="mt-8 space-y-4">
          {pages.map((p) => (
            <li
              key={p.t.path}
              data-ptbr-index-row={p.status}
              className="rounded-xl border border-[var(--border)] p-5"
            >
              <Link href={p.t.path} className="text-lg font-semibold text-[var(--fg)] hover:text-brand-600">
                {p.t.h1}
              </Link>
              <p className="mt-2 text-sm text-[var(--muted)]">{p.t.metaDescription}</p>
              <p className="mt-3 text-xs text-[var(--muted)]">
                {p.status === "current" ? (
                  <>
                    Verificado em {formatDatePt(p.verifiedOn)} (versão em inglês) · traduzido em{" "}
                    {formatDatePt(p.t.translatedOn)}
                  </>
                ) : (
                  <span className="rounded-full border border-amber-400/50 bg-amber-500/10 px-2 py-0.5 font-medium text-[var(--fg)]">
                    Desatualizada: a página em inglês mudou depois de {formatDatePt(p.t.translatedOn)}
                  </span>
                )}{" "}
                ·{" "}
                <Link href={p.t.enPath} hrefLang="en" lang="en" className="text-brand-600 hover:text-brand-500">
                  Original in English
                </Link>
              </p>
            </li>
          ))}
        </ul>

        <p className="not-prose mt-12 border-t border-[var(--border)] pt-6 text-xs leading-relaxed text-[var(--muted)]">
          Uma tradução não é uma nova verificação: os fatos foram conferidos na versão em inglês, na data
          indicada em cada página. Citações de fornecedores, licenças e contratos ficam no original em
          inglês, às vezes seguidas de uma tradução entre colchetes. Em caso de divergência, vale a
          página em inglês.
        </p>
      </div>
    </Container>
  );
}
