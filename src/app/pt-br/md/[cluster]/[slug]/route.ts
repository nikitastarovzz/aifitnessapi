import { absoluteUrl, site } from "@/lib/site";
import { markdownUrl } from "@/lib/schema";
import { ptPages, ptEntry } from "@/lib/translations";

/**
 * Markdown mirror of a translated spoke, served at /pt-br/<cluster>/<slug>.md
 * by a rewrite in next.config.ts (this path is the implementation address).
 * Kept apart from /md/* on purpose: that tree is the English site's mirror
 * set, and the GEO gates count it against the English spokes.
 *
 * Front matter says what the document is — a translation, of which English
 * page, translated when, and whether it is still current — so an agent that
 * reads only the header cannot take a stale translation for the current
 * text. The review date is the English page's, labelled so.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { cluster: string; slug: string }[] {
  return ptPages().map((p) => ({ cluster: p.basePath.slice(1), slug: p.slug }));
}

function y(v: string): string {
  return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ cluster: string; slug: string }> }) {
  const { cluster, slug } = await params;
  const p = ptPages().find((x) => x.basePath === `/${cluster}` && x.slug === slug);
  if (!p) return new Response("Not found", { status: 404 });
  const e = ptEntry(p);
  const canonical = absoluteUrl(p.t.path);
  const english = absoluteUrl(p.t.enPath);
  const out = [
    "---",
    `title: ${y(e.h1)}`,
    `canonical: ${y(canonical)}`,
    `lang: "pt-BR"`,
    `translation_of: ${y(english)}`,
    `translation_status: ${y(p.status)}`,
    `translated_on: ${y(p.t.translatedOn)}`,
    `last_reviewed: ${y(p.verifiedOn)}`,
    `last_reviewed_note: "Verificado na versão em inglês; a tradução não é uma nova verificação"`,
    `description: ${y(e.metaDescription)}`,
    `publisher: ${y(
      e.firstParty
        ? `${site.name} — financiado pela KinesteX, assunto desta página; aviso no corpo`
        : `${site.name} — independente, sem patrocínio`,
    )}`,
    `cite_as: ${y(`"${e.h1}", ${site.name}, ${canonical}`)}`,
    "---",
    "",
    `# ${e.h1}`,
    "",
    `> ${e.answer}`,
    "",
  ];
  if (p.status === "stale") {
    out.push(
      `**Tradução desatualizada.** A página em inglês mudou depois desta tradução, feita em ${p.t.translatedOn}. A versão atual é a original em inglês: ${english} (${markdownUrl(p.t.enPath)}).`,
      "",
    );
  }
  out.push(
    `- Canonical: ${canonical}`,
    `- Original em inglês: ${english}`,
    `- Verificado em: ${p.verifiedOn} (versão em inglês)`,
    `- Traduzido em: ${p.t.translatedOn}`,
    "",
    "---",
    "",
    e.body.replace(/\]\((\/[^)\s]*)\)/g, (_m, href: string) => `](${absoluteUrl(href)})`),
    "",
  );
  if (e.faqs.length) {
    out.push("## Perguntas frequentes", "");
    e.faqs.forEach((f, i) => out.push(`### ${f.q}`, "", f.a, "", `[Link permanente](${canonical}#faq-${i + 1})`, ""));
  }
  return new Response(out.join("\n"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-language": "pt-BR",
      link: `<${canonical}>; rel="canonical", <${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
