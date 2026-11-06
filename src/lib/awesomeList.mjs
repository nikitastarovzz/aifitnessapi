/**
 * The awesome-fitness-apis list (ops/VIRAL-20-2026-11-06.md item 11): one
 * model, rendered as AWESOME.md at the repository root by
 * scripts/build-awesome.mjs and as the /awesome page and its /awesome.md
 * mirror by Next. Pure and dependency-free, so the generator, the page and
 * scripts/awesome.test.mjs run the same code.
 *
 * Nothing here is a new claim. Every description is a sentence the site
 * already publishes from a sourced module:
 *   - APIs: the directory (src/data/costModel.ts via src/data/apis.ts): its
 *     category, its developer-billing label and whether it names an approval
 *     step before production.
 *   - Libraries: src/data/libraries.ts, generated from the registries; the
 *     description is the curated `why` line, the license is the registry's.
 *   - MCP servers: src/data/mcpHealthServers.ts, generated from the official
 *     MCP Registry; the description is the registry's own, verbatim.
 *   - Datasets: the published files in public/datasets.
 *   - Tools: src/lib/toolRegistry.ts, the same blurbs the site search uses.
 *
 * The list ranks nothing: entries keep their module's order (MCP servers by
 * name), and KinesteX, which funds this site, is listed the same way as every
 * other product, with the disclosure beside it.
 */

/** @typedef {{ id: string, label: string, category: string, devCost: string, approvalGate: string | null }} AwesomeApi */
/** @typedef {{ name: string, url: string, text: string, note?: string }} AwesomeEntry */
/** @typedef {{ key: string, id: string, title: string, intro: string, groups: { id: string, title: string, entries: AwesomeEntry[] }[] }} AwesomeSection */

export const AWESOME_TITLE = "Awesome Fitness APIs";
export const AWESOME_FIRST_PARTY = "kinestex";

/** One line of text: collapse whitespace and end with a period. */
export function sentence(s) {
  const t = String(s ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return /[.!?…)]$/.test(t) ? t : `${t}.`;
}

/**
 * The anchor GitHub gives a heading: lowercased, every character that is not
 * a letter, digit, space, hyphen or underscore removed, spaces turned into
 * hyphens. A repeated heading gets "-1", "-2"… in document order, which
 * `assignAnchors` applies, so the contents list works in AWESOME.md on GitHub
 * and on /awesome, which uses the same ids.
 */
export function githubSlug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /g, "-");
}

function assignAnchors(sections) {
  const seen = new Map();
  const take = (title) => {
    const base = githubSlug(title);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
  // Headings GitHub sees before the sections: the H1 and "Contents".
  take(AWESOME_TITLE);
  take("Contents");
  for (const s of sections) {
    s.id = take(s.title);
    for (const g of s.groups) g.id = g.title ? take(g.title) : s.id;
  }
  return sections;
}

/** Escape the characters that would break a markdown link label. */
function mdLabel(s) {
  return String(s).replace(/([\[\]\\])/g, "\\$1");
}

/**
 * @param {{
 *   siteUrl: string,
 *   apis: AwesomeApi[],
 *   categoryOrder: string[],
 *   categoryLabels: Record<string, string>,
 *   devCostLabels: Record<string, string>,
 *   libraries: any[],
 *   libraryGroups: { id: string, label: string }[],
 *   librariesFetchedOn: string,
 *   mcpServers: any[],
 *   mcpGroups: { key: string, label: string }[],
 *   mcpFetchedOn: string,
 *   datasets: { slug: string, name: string, license: string }[],
 *   tools: { path: string, name: string, blurb: string }[],
 * }} input
 */
export function awesomeModel(input) {
  const site = input.siteUrl.replace(/\/$/, "");
  const abs = (p) => `${site}${p}`;

  /** @type {AwesomeSection[]} */
  const sections = [];

  // ── APIs and platforms, by directory category ────────────────────────
  sections.push({
    key: "apis-and-platforms",
    id: "",
    title: "APIs and platforms",
    intro:
      "Every product in the site's API directory, by category, with how it bills developers (Free, Free tier, Usage-based or Contact sales) and whether its entry names a review, approval or declaration before production. Each link is the product's directory page, which cites the pages that verify it.",
    groups: input.categoryOrder
      .map((cat) => ({
        id: "",
        title: input.categoryLabels[cat] ?? cat,
        entries: input.apis
          .filter((a) => a.category === cat)
          .map((a) => {
            const gate = a.approvalGate ? " An approval, review or declaration stands before production." : "";
            const fp = a.id === AWESOME_FIRST_PARTY ? " KinesteX funds aifitnessapi.com; it is listed the same way as every other product." : "";
            return {
              name: a.label,
              url: abs(`/apis/${a.id}`),
              text: `Developer billing: ${input.devCostLabels[a.devCost] ?? a.devCost}.${gate}${fp}`,
            };
          }),
      }))
      .filter((g) => g.entries.length > 0),
  });

  // ── Libraries, by group ──────────────────────────────────────────────
  const eco = { npm: "npm", pub: "pub.dev", pypi: "PyPI" };
  sections.push({
    key: "libraries",
    id: "",
    title: "Libraries and SDK bridges",
    intro: `Open-source packages for HealthKit, Health Connect and vendor web APIs, read from their registries on ${input.librariesFetchedOn}. Each links its registry page; the license is the one the registry states.`,
    groups: input.libraryGroups
      .map((g) => ({
        id: "",
        title: g.label,
        entries: input.libraries
          .filter((l) => l.group === g.id)
          .map((l) => {
            const bits = [eco[l.ecosystem] ?? l.ecosystem];
            if (l.license) bits.push(`license ${l.license}`);
            const flags = [];
            if (l.deprecated) flags.push(`Deprecated on ${eco[l.ecosystem] ?? l.ecosystem}: ${sentence(l.deprecated.message)}`);
            if (l.repoStats?.archived) flags.push("Repository archived on GitHub.");
            return {
              name: l.name,
              url: l.registryUrl,
              text: `${sentence(l.why)} ${sentence(bits.join(", "))}${flags.length ? ` ${flags.join(" ")}` : ""}`.trim(),
            };
          }),
      }))
      .filter((g) => g.entries.length > 0),
  });

  // ── MCP servers, by group ────────────────────────────────────────────
  const live = input.mcpServers.filter((s) => s.status !== "deleted");
  const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  sections.push({
    key: "mcp-servers",
    id: "",
    title: "MCP servers for health data",
    intro: `Model Context Protocol servers whose official MCP Registry entry names a health or fitness source, read from the registry on ${input.mcpFetchedOn}. The description is the registry's, verbatim; none of these servers was reviewed or run for this list. Each links its repository, else its website, else its registry record.`,
    groups: [...input.mcpGroups, { key: "several", label: "Several sources" }, { key: "general", label: "General health and fitness" }]
      .filter((g, i, all) => all.findIndex((x) => x.key === g.key) === i)
      .map((g) => ({
        id: "",
        title: g.label,
        entries: live
          .filter((s) => s.group === g.key)
          .sort(byName)
          .map((s) => ({
            name: s.title ? `${s.title} (${s.name})` : s.name,
            url: s.repositoryUrl || s.websiteUrl || s.registryEntryUrl,
            text: `${sentence(s.description)}${s.status === "deprecated" ? " Marked deprecated in the registry." : ""}`,
          })),
      }))
      .filter((g) => g.entries.length > 0),
  });

  // ── Datasets ─────────────────────────────────────────────────────────
  sections.push({
    key: "open-datasets",
    id: "",
    title: "Open datasets",
    intro: "Datasets aifitnessapi.com publishes, each as JSON and CSV under the license it states, versioned rather than overwritten.",
    groups: [
      {
        id: "",
        title: "",
        entries: input.datasets.map((d) => ({
          name: d.name,
          url: abs(`/datasets#${d.slug}`),
          text: `JSON at ${abs(`/datasets/${d.slug}.json`)}, CSV beside it; ${d.license}.`,
        })),
      },
    ],
  });

  // ── Tools ────────────────────────────────────────────────────────────
  sections.push({
    key: "tools",
    id: "",
    title: "Free tools",
    intro: "Browser tools on aifitnessapi.com built on the same data. They run on your device and need no account.",
    groups: [
      {
        id: "",
        title: "",
        entries: input.tools.map((t) => ({ name: t.name, url: abs(t.path), text: sentence(t.blurb) })),
      },
    ],
  });

  assignAnchors(sections);
  const count = sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.entries.length, 0), 0);
  return { title: AWESOME_TITLE, siteUrl: site, sections, count };
}

/** Lead paragraph shared by AWESOME.md, the page capsule and the mirror. */
export function awesomeLead(model) {
  const n = (id) => model.sections.find((s) => s.key === id).groups.reduce((m, g) => m + g.entries.length, 0);
  return (
    `A list of ${n("apis-and-platforms")} fitness and health APIs and platforms, ${n("libraries")} open-source libraries, ${n("mcp-servers")} MCP servers, ` +
    `${n("open-datasets")} open datasets and ${n("tools")} free tools for developers building with wearable, health and workout data. ` +
    `Generated from aifitnessapi.com's sourced data by a script, so every line restates a published fact and nothing is ranked.`
  );
}

/** One entry as an awesome-list line. */
export function entryLine(e) {
  return `- [${mdLabel(e.name)}](${e.url}) - ${e.text}`;
}

/** The section headings and anchors, for the contents list. */
export function contents(model) {
  const out = [];
  for (const s of model.sections) {
    out.push({ depth: 0, title: s.title, anchor: s.id });
    for (const g of s.groups) if (g.title) out.push({ depth: 1, title: g.title, anchor: g.id });
  }
  return out;
}

/** The list body (everything under the lead), shared by AWESOME.md and /awesome.md. */
export function awesomeBody(model) {
  const lines = ["## Contents", ""];
  for (const c of contents(model)) lines.push(`${c.depth ? "  " : ""}- [${c.title}](#${c.anchor})`);
  lines.push("");
  for (const s of model.sections) {
    lines.push(`## ${s.title}`, "", s.intro, "");
    for (const g of s.groups) {
      if (g.title) lines.push(`### ${g.title}`, "");
      for (const e of g.entries) lines.push(entryLine(e));
      lines.push("");
    }
  }
  return lines;
}

/** AWESOME.md, the whole file. */
export function awesomeMarkdown(model) {
  const site = model.siteUrl;
  return [
    `# ${model.title}`,
    "",
    `> ${awesomeLead(model)}`,
    "",
    `The same list is served at [${site.replace(/^https?:\/\//, "")}/awesome](${site}/awesome), with a markdown copy at [/awesome.md](${site}/awesome.md).`,
    "",
    ...awesomeBody(model),
    "## About this list",
    "",
    "- Generated by `scripts/build-awesome.mjs` from the data modules behind aifitnessapi.com. Do not edit this file by hand: change the data and run `node scripts/build-awesome.mjs`; the site's qa gate fails when this file is stale.",
    "- Inclusion is mechanical: every product in the site's directory, every library on its libraries hub, every server its MCP Registry scan matched, every dataset and tool it publishes. A mistake is a mistake in the data, so report it on the source page: " + `${site}/corrections.`,
    "- KinesteX funds aifitnessapi.com. Its entry is drawn from the same directory as every other, and the list ranks nothing.",
    "",
    "## License",
    "",
    `This list is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit AIFitnessAPI and link ${site}/awesome. The libraries, servers and services it links keep their own licenses and terms.`,
    "",
  ].join("\n");
}
