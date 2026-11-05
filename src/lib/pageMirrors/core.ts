import { absoluteUrl, site } from "@/lib/site";
import { markdownUrl } from "@/lib/schema";
import { MACHINE_CACHE_CONTROL } from "@/lib/machineHeaders";
import { otherLookups } from "@/lib/toolRegistry";
import { routeLabel } from "@/lib/routeLabel";
import { TOOL_NEXT_STEPS } from "@/data/toolNextSteps";

/**
 * Markdown mirrors for pages that are not cluster spokes — the tools, the
 * records (/graveyard, /changes, /fitness-api-index, /2026, /market-map),
 * /datasets and the games (ops/MORE-30-2026-11-05.md item 20).
 *
 * The cluster mirrors (src/app/md) are generated from entry data, because a
 * spoke IS its data. These pages are JSX, so a mirror is assembled here from
 * two things only:
 *
 *  - the data modules the page renders (tables, lists, FAQs, counts), called
 *    the same way the page calls them, so a data change moves both at once;
 *  - the page's static explanatory prose, copied as markdown.
 *
 * The interactive UI is not reproduced: a mirror says where it is, once, with
 * INTERACTIVE_NOTE, and carries what the page explains around it.
 *
 * Copying prose is how a mirror could drift, so qa holds it to the page
 * (GEO-PAGE-MD-TEXT): every line of a mirror's body after the header must
 * appear in the built HTML of its page, and every visible section heading of
 * the page and every FAQ question it declares must appear in the mirror
 * (GEO-PAGE-MD-COVER). Edit a page's words and qa names the mirror line that
 * no longer matches. The address is the page's URL with `.md` appended, the
 * same convention the cluster mirrors follow; each is a route folder named
 * `<page>.md` beside the page.
 */

export type MirrorDoc = {
  /** The HTML page this mirrors, e.g. "/tools/step-lab". */
  path: string;
  /** The page's H1. */
  title: string;
  /** The page's meta description. */
  description: string;
  /** The date the page itself states as its review / data date. */
  updated: string;
  /**
   * What `updated` is. "last_reviewed" (the default) where the page declares
   * a review or modified date; "data_read" where it declares none and states
   * only when its inputs were read (/market-map), so the mirror does not
   * claim a check the page does not.
   */
  dateKind?: "last_reviewed" | "data_read";
  /** What kind of page: front matter `type`. */
  type: "tool" | "tools-index" | "record" | "dataset-index" | "game";
  /** The page's own opening paragraph (its #answer capsule), verbatim. */
  capsule: string;
  /** Markdown body, already assembled. */
  body: string[];
};

/** The single line a mirror uses where the page has its interactive tool. */
export function interactiveNote(path: string, what: string): string {
  return `*[Interactive: ${what}, in the browser at ${absoluteUrl(path)}; not reproduced in this mirror.]*`;
}

/** Markdown link with an absolute URL for a site path; external URLs pass through.
 *  Parentheses are escaped, as in the cluster mirrors' source lists. */
export function link(text: string, href: string): string {
  const abs = href.startsWith("/") ? absoluteUrl(href) : href;
  return `[${text}](${abs.replace(/\(/g, "%28").replace(/\)/g, "%29")})`;
}

/** A markdown table. Cells are single-line; pipes are escaped. */
export function table(head: string[], rows: (string | number | null | undefined)[][]): string[] {
  const cell = (v: string | number | null | undefined) =>
    String(v ?? "").replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
  return [
    `| ${head.map(cell).join(" | ")} |`,
    `|${head.map(() => "---").join("|")}|`,
    ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`),
    "",
  ];
}

/** An FAQ section, numbered like the page's #faq-N anchors. */
export function faqSection(path: string, faqs: { q: string; a: string }[], heading = "Frequently asked questions"): string[] {
  if (!faqs.length) return [];
  const out = [`## ${heading}`, ""];
  faqs.forEach((f, i) => {
    out.push(`### ${f.q}`, "", f.a, "", `[Permalink](${absoluteUrl(path)}#faq-${i + 1})`, "");
  });
  return out;
}

/** YAML-escape a scalar: quote it and escape embedded quotes/backslashes. */
function y(v: string): string {
  return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** The whole document: front matter, citation header, then the body. */
export function renderMirror(doc: MirrorDoc): string {
  const canonical = absoluteUrl(doc.path);
  const fm: [string, string][] = [
    ["title", doc.title],
    ["canonical", canonical],
    ["markdown", markdownUrl(doc.path)],
    ["type", doc.type],
    [doc.dateKind ?? "last_reviewed", doc.updated],
    ["description", doc.description],
    ["publisher", `${site.name} — funded by KinesteX; first-party pages disclose it`],
    ["cite_as", `"${doc.title}", ${site.name}, ${canonical}`],
  ];
  const out = ["---", ...fm.map(([k, v]) => `${k}: ${y(v)}`), "---", ""];
  out.push(`# ${doc.title}`, "", `> ${doc.capsule}`, "");
  out.push(
    `- Canonical: ${canonical}`,
    `- ${doc.dateKind === "data_read" ? "Data read" : "Last reviewed"}: ${doc.updated}`,
    `- Publisher: ${site.name} (${site.url})`,
    `- Cite as: "${doc.title}", ${site.name}, ${canonical}`,
    "",
    "---",
    "",
  );
  out.push(...doc.body);
  // A page that ends with ToolNextStep ends its mirror with the same block,
  // from the same list, so no mirror has to remember to add it.
  out.push("", ...nextStepSection(doc.path));
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

/**
 * The response. One Link header carrying canonical + describedby, exactly the
 * shape the cluster mirrors send (GEO-MD-LINK-CANONICAL reads it the same
 * way), and the machine-surface cache policy.
 */
export function mirrorResponse(doc: MirrorDoc): Response {
  const canonical = absoluteUrl(doc.path);
  return new Response(renderMirror(doc), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": MACHINE_CACHE_CONTROL,
      link:
        `<${new URL(canonical).href}>; rel="canonical", ` +
        `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}

/** The sibling list at the foot of a lookup tool (src/components/tools/MoreTools.tsx). */
export function moreToolsSection(path: string): string[] {
  const tools = otherLookups(path);
  if (tools.length === 0) return [];
  return [
    `## The other ${tools.length} tools`,
    "",
    ...tools.map((t) => `- ${link(t.name, t.path)}: ${t.blurb}`),
    "",
    `The planners and demos — the API picker, the cost planner, the side-by-side comparison, the day-boundary demo, the pose-model benchmark, the Bluetooth heart-rate lab and the step lab — are listed with these on ${link("free tools for health-app builders", "/tools")}.`,
    "",
  ];
}

/**
 * The "Next step" block a page ends with (src/components/ToolNextStep.tsx),
 * from the same list in src/data/toolNextSteps.ts and with the same link text
 * (each target's own H1, via routeLabel). Empty for a page with no entry.
 * renderMirror appends it, so every mirror whose page carries the block
 * carries it too.
 */
export function nextStepSection(path: string): string[] {
  const targets = TOOL_NEXT_STEPS[path];
  if (!targets) return [];
  const links = targets.map((href) => {
    const label = routeLabel(href);
    if (!label) throw new Error(`nextStepSection: ${path} lists ${href}, which routeLabel does not know`);
    return `- ${link(label, href)}`;
  });
  return ["## Next step", "", "Turning this into a choice of API:", "", ...links, ""];
}
