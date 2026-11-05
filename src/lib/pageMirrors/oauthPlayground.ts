import { OAUTH_FETCHED_ON, OAUTH_OMITTED } from "@/data/oauthVendors";
import {
  HOW_IT_WORKS,
  PLAYGROUND_DESCRIPTION,
  PLAYGROUND_H1,
  PLAYGROUND_PATH,
  PLAYGROUND_VENDORS,
  playgroundCapsule,
  scopeSource,
  vendorRows,
} from "@/lib/oauthPlaygroundData";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

/** /tools/oauth-playground.md — mirrors src/app/tools/oauth-playground/page.tsx from the same rows. */
export function oauthPlaygroundMirror(): MirrorDoc {
  const vendors = PLAYGROUND_VENDORS.flatMap((v) => [
    `### ${v.name}`,
    "",
    ...vendorRows(v).map((r) => `- **${r.label}** ${r.text} ${link("Source", r.source.url)}`),
    "",
    ...(v.scopes.length
      ? [`#### Scopes (${v.scopes.length})`, "", ...v.scopes.map((s) => `- \`${s.scope}\`: ${s.grants} ${link("Source", scopeSource(v, s).url)}`), ""]
      : []),
    `Guide: ${link(v.guide === "/google-health-api" ? "Google Health API reference" : `${v.name} integration guide`, v.guide)}.`,
    "",
  ]);
  return {
    path: PLAYGROUND_PATH,
    title: PLAYGROUND_H1,
    description: PLAYGROUND_DESCRIPTION,
    updated: OAUTH_FETCHED_ON,
    type: "tool",
    capsule: playgroundCapsule(),
    body: [
      interactiveNote(PLAYGROUND_PATH, "the authorize-URL, PKCE and curl builder"),
      "",
      "## Each vendor’s OAuth facts, with sources",
      "",
      `The playground builds from exactly these rows. Each was read from the vendor’s own page on ${OAUTH_FETCHED_ON}; where a page leaves something out, the row says so instead of filling it in.`,
      "",
      ...vendors,
      "## Not included, and why",
      "",
      ...OAUTH_OMITTED.map(
        (o) => `- **${o.name}.** ${o.reason} ${link(o.guide === "/fitbit-api-shutdown" ? "Fitbit Web API retirement" : `${o.name} guide`, o.guide)}.`,
      ),
      "",
      "## How this works",
      "",
      ...HOW_IT_WORKS.flatMap((p) => [p, ""]),
      `A free tool from ${site.name}. Once tokens flow, the next thing a wearable sends you is a webhook: see the ${link("webhook payload library", "/webhooks")} and ${link("check a webhook’s signature", "/tools/webhook-verifier")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PLAYGROUND_PATH),
    ],
  };
}
