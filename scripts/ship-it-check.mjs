// The source check for "Ship It" (/play/ship-it, src/lib/shipIt.ts).
//
// Shared by `npm run qa` (gate SHIP-IT) and `npm run test:ship-it`, so the
// same rules hold in CI and on a laptop. It proves, from the source files
// alone, that the game invents no vendor event:
//
//   - every event cites a page on this site that is released (or an app
//     route that exists), and every stack's page exists;
//   - the event's `quote` and `dateEvidence` appear verbatim in that page's
//     sourced text — the cluster entry's answer, body, FAQs and steps, or the
//     /changes entry's summary for an app route;
//   - a quote attributed to the vendor sits inside quotation marks there;
//   - an event that names a /changes entry matches that entry's date and page;
//   - stacks, products, kinds and resolvedBy links are well-formed; an
//     event's title names exactly the stacks it lists as affected, and its
//     source page names each of them.
//
// Loads the .ts modules through Node's type stripping (Node 22.18+).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

/** Cluster prefix → [entries module, export name, data module with the release set]. */
const CLUSTERS = {
  fix: ["fix.entries.ts", "fixEntries", "fix.ts"],
  integrate: ["integrate.entries.ts", "integrateEntries", "integrate.ts"],
  compliance: ["compliance.entries.ts", "complianceEntries", "compliance.ts"],
  migrate: ["migrate.entries.ts", "migrateEntries", "migrate.ts"],
  pricing: ["pricing.entries.ts", "pricingEntries", "pricing.ts"],
};

function entryText(e) {
  return [
    e.answer ?? "",
    e.body ?? "",
    ...(e.faqs ?? []).flatMap((f) => [f.q, f.a]),
    ...(e.steps ?? []).flatMap((s) => [s.name, s.text]),
  ].join("\n");
}

/** True when `quote` starts inside a "…" span of `text` (straight or curly
 *  quotes), or on a markdown blockquote line, which is how the pages set out
 *  a vendor's text at length. */
function insideQuotes(text, quote) {
  let i = text.indexOf(quote);
  while (i >= 0) {
    const before = text.slice(0, i);
    if (/^>/.test(before.slice(before.lastIndexOf("\n") + 1))) return true;
    const straight = (before.match(/"/g) ?? []).length;
    const open = (before.match(/“/g) ?? []).length;
    const close = (before.match(/”/g) ?? []).length;
    if (straight % 2 === 1 || open > close) return true;
    i = text.indexOf(quote, i + 1);
  }
  return false;
}

export async function loadShipIt() {
  return import(new URL("../src/lib/shipIt.ts", import.meta.url));
}

export async function checkShipIt() {
  const problems = [];
  const game = await loadShipIt();
  const { CHANGE_EVENTS } = await import(new URL("../src/data/changes.ts", import.meta.url));
  const costModel = fs.readFileSync(path.join(ROOT, "src/data/costModel.ts"), "utf8");
  const modules = {};

  async function clusterEntry(cluster, slug) {
    const spec = CLUSTERS[cluster];
    if (!spec) return { error: `cluster /${cluster} is not one this check knows how to read` };
    if (!modules[cluster]) {
      const mod = await import(new URL(`../src/data/${spec[0]}`, import.meta.url));
      modules[cluster] = mod[spec[1]] ?? [];
    }
    const e = modules[cluster].find((x) => x.slug === slug);
    if (!e) return { error: `no entry ${slug} in src/data/${spec[0]}` };
    const data = fs.readFileSync(path.join(ROOT, "src/data", spec[2]), "utf8");
    if (!data.includes(`"${slug}",`)) return { error: `${slug} is not in the release set in src/data/${spec[2]}` };
    return { entry: e };
  }

  /** Whether an on-site href resolves to a built page, from the source tree alone. */
  async function routeExists(href) {
    const clean = href.split("#")[0];
    if (fs.existsSync(path.join(ROOT, "src/app", clean, "page.tsx"))) return true;
    const seg = clean.split("/").filter(Boolean);
    if (seg.length === 2 && seg[0] === "apis") return new RegExp(`^\\s{4}id: "${seg[1]}",$`, "m").test(costModel);
    if (seg.length === 2 && CLUSTERS[seg[0]]) return !(await clusterEntry(seg[0], seg[1])).error;
    return false;
  }

  const stackIds = new Set(game.STACKS.map((s) => s.id));
  const productIds = new Set(game.PRODUCTS.map((p) => p.id));
  const kinds = new Set(Object.keys(game.RULES));
  const eventIds = new Set();

  for (const s of game.STACKS) {
    if (!(await routeExists(s.href))) problems.push(`stack ${s.id}: ${s.href} is not a page on this site`);
  }
  for (const p of game.PRODUCTS) {
    for (const s of p.suggested) if (!stackIds.has(s)) problems.push(`product ${p.id}: suggests unknown stack ${s}`);
  }

  const seen = [];
  for (const e of game.EVENTS) {
    const at = `event ${e.id}`;
    if (eventIds.has(e.id)) problems.push(`${at}: duplicate id`);
    eventIds.add(e.id);
    if (!kinds.has(e.kind)) problems.push(`${at}: kind ${e.kind} has no row in RULES`);
    if (!e.stacks.length) problems.push(`${at}: affects no stack`);
    for (const s of e.stacks) if (!stackIds.has(s)) problems.push(`${at}: unknown stack ${s}`);
    for (const p of e.products ?? []) if (!productIds.has(p)) problems.push(`${at}: unknown product ${p}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.sortDate)) problems.push(`${at}: sortDate ${e.sortDate} is not an ISO date`);
    if (!e.sortDate.startsWith(e.date)) problems.push(`${at}: sortDate ${e.sortDate} does not fall within date ${e.date}`);
    for (const c of ["act", "hedge", "ignore"]) if (!e.choices?.[c]?.trim()) problems.push(`${at}: no label for ${c}`);
    for (const r of e.resolvedBy ?? []) {
      const prior = game.EVENTS.find((x) => x.id === r);
      if (!prior) problems.push(`${at}: resolvedBy ${r} is not an event`);
      else if (!seen.includes(r) && prior.sortDate >= e.sortDate) problems.push(`${at}: resolvedBy ${r} does not come before it`);
      else if (!prior.stacks.some((s) => e.stacks.includes(s))) problems.push(`${at}: resolvedBy ${r} shares no stack with it`);
    }
    // An event's title names every stack it hits and no other, so the card a
    // player sees can never pin an event on a stack it does not affect.
    const term = (st) => st.name.replace(/ Web API$/, "");
    for (const st of game.STACKS) {
      const named = new RegExp(`\\b${term(st)}\\b`).test(`${e.title} ${e.speaker}`);
      if (named && !e.stacks.includes(st.id)) problems.push(`${at}: names ${st.name} in its title or attribution but does not list it as affected`);
      if (!named && e.stacks.includes(st.id)) problems.push(`${at}: lists ${st.name} as affected but its title does not name it`);
    }
    seen.push(e.id);

    // The source text the quote and the date must come from.
    const href = e.source.href;
    const seg = href.split("/").filter(Boolean);
    let text = "";
    if (seg.length === 2 && CLUSTERS[seg[0]]) {
      const got = await clusterEntry(seg[0], seg[1]);
      if (got.error) problems.push(`${at}: source ${href} — ${got.error}`);
      else text = entryText(got.entry);
    } else if (fs.existsSync(path.join(ROOT, "src/app", href, "page.tsx"))) {
      if (!e.change) problems.push(`${at}: source ${href} is an app route, so the event must name the /changes entry whose summary it quotes`);
    } else {
      problems.push(`${at}: source ${href} is not a page on this site`);
    }

    if (e.change) {
      const c = CHANGE_EVENTS.find((x) => x.title === e.change);
      if (!c) problems.push(`${at}: names /changes entry "${e.change}", which does not exist`);
      else {
        if (c.date !== e.date) problems.push(`${at}: date ${e.date} differs from the /changes entry's ${c.date}`);
        if (c.page.href !== href) problems.push(`${at}: cites ${href} but the /changes entry links ${c.page.href}`);
        // A change summary is sourced text for the same claim, so it counts.
        text = `${text}\n${c.summary}`;
      }
    }

    if (text) {
      const t = text;
      if (!t.includes(e.quote)) problems.push(`${at}: quote not found verbatim in ${href}: "${e.quote.slice(0, 70)}…"`);
      else if (e.quoteBy === "vendor" && !insideQuotes(t, e.quote))
        problems.push(`${at}: quote is attributed to the vendor but is not inside quotation marks on ${href}`);
      if (!t.includes(e.dateEvidence)) problems.push(`${at}: dateEvidence "${e.dateEvidence}" not found in ${href}`);
      for (const id of e.stacks) {
        const st = game.STACKS.find((x) => x.id === id);
        if (st && !t.includes(term(st))) problems.push(`${at}: lists ${st.name} as affected but ${href} never names it`);
      }
    }
  }

  return { problems, events: game.EVENTS.length, stacks: game.STACKS.length, products: game.PRODUCTS.length };
}
