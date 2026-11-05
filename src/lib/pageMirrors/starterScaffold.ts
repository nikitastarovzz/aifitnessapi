import { SCAFFOLD_CHECKED_ON, SCAFFOLD_EXCLUDED, SCAFFOLD_STACKS, SCAFFOLD_VENDORS } from "@/lib/starterScaffold.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/starter-scaffold";
const UPDATED = "2026-11-05";

const KIND: Record<string, string> = {
  hmac: "HMAC signature",
  token: "Shared token in the body",
  handshake: "Validation handshake; events unsigned",
};

/** /tools/starter-scaffold.md — mirrors src/app/tools/starter-scaffold/page.tsx from the same template data. */
export function starterScaffoldMirror(): MirrorDoc {
  const names = SCAFFOLD_VENDORS.map((v) => v.name);
  const vendors = SCAFFOLD_VENDORS.flatMap((v) => [
    `### ${v.name}`,
    "",
    KIND[v.webhook.kind],
    "",
    `- ${v.webhook.summary}`,
    `- Authorize: \`${v.authorizeUrl}\``,
    `- Token: \`${v.tokenUrl}\` (${v.tokenAuth === "basic" ? "HTTP Basic" : "credentials in the form body"})`,
    `- Default scopes: \`${v.scopes.join(v.scopeSeparator)}\``,
    `- PKCE: ${v.pkce ? "S256, as the vendor documents" : "not sent: the guide does not document it"}`,
    ...v.tokenNotes.map((n) => `- ${n}`),
    "",
    `Sources: ${link(`${v.name} integration guide`, v.guide)} and ${link(`${v.name}'s webhook documentation`, v.webhook.source)}.`,
    "",
  ]);
  return {
    path: PATH,
    title: "A starter project for your fitness API integration",
    description:
      "Pick Express, Next.js or FastAPI and Oura, WHOOP, Polar, Strava or Wahoo: download a tested skeleton with OAuth, token storage and verified webhooks.",
    updated: UPDATED,
    type: "tool",
    capsule: `Pick a stack (${SCAFFOLD_STACKS.map((s) => s.name).join(", ").replace(/, ([^,]*)$/, " or $1")}) and the vendors you integrate (${names.join(", ").replace(/, ([^,]*)$/, " and $1")}), and download a project skeleton as a .zip built in your browser: an OAuth start and callback route per vendor with a state check and PKCE where the vendor documents it, a token-store interface with an in-memory stand-in, a webhook endpoint that answers each vendor’s handshake and checks its documented signature or token, a .env.example and a README. Every endpoint and header comes from a page this site already sources, and every combination is compiled and run in the site’s tests.`,
    body: [
      interactiveNote(PATH, "the generator and its download"),
      "",
      "## What each vendor gets",
      "",
      `As the site had them on ${SCAFFOLD_CHECKED_ON}. The OAuth details are from each vendor’s integration guide; the webhook rules are the ones the ${link("webhook verifier", "/tools/webhook-verifier")} quotes from the vendor’s own page.`,
      "",
      ...vendors,
      "## Not included, and why",
      "",
      ...SCAFFOLD_EXCLUDED.map((x) => `- **${x.name}.** ${x.reason}`),
      "",
      "## How the templates are tested",
      "",
      "`scripts/starter-scaffold.test.mjs` generates every stack with each vendor alone and with all five. The Express skeleton passes `node --check`, is started on a free port, and is driven over HTTP: the authorize redirect, the code exchange against a fake token endpoint, a single-use state, and each vendor’s webhook as the webhook verifier builds it from the vendor’s own example, accepted unchanged and refused when tampered with. The Next.js skeleton passes `tsc --noEmit` in strict mode against Next.js and Node types, and its webhook module runs the same cases. The FastAPI skeleton passes `python -m py_compile`, and its standard-library webhook module runs the same cases. The ZIP is read back by the site’s own ZIP reader and by Python’s zipfile.",
      "",
      `What it does not do: the stores keep tokens in memory, the start route takes the user id as a query parameter, and the event handler only logs. The README in each download says what to replace, and the ${link("cookbook", "/cookbook")} has tested code for each: token encryption at rest, refresh rotation and a replay-safe receiver.`,
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
