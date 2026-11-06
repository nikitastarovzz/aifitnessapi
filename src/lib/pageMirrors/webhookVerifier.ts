import { WEBHOOK_VENDORS } from "@/lib/webhookVerifier.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/webhook-verifier";
const UPDATED = "2026-10-31";

const KIND_LABEL: Record<string, string> = {
  hmac: "HMAC signature",
  token: "Shared token, no signature",
  handshake: "Validation handshake, events unsigned",
  "token+ecdsa": "Shared token plus ECDSA signature",
};

/** /tools/webhook-verifier.md — mirrors src/app/tools/webhook-verifier/page.tsx,
 *  with every vendor's rule, quotes and response requirements from the
 *  verifier's own data. */
export function webhookVerifierMirror(): MirrorDoc {
  const signed = WEBHOOK_VENDORS.filter((v) => v.kind === "hmac");
  const vendors = WEBHOOK_VENDORS.flatMap((v) => [
    `### ${v.name}`,
    "",
    KIND_LABEL[v.kind],
    "",
    v.summary,
    "",
    ...v.source.quote.map((q: string) => `> ${q}`),
    "",
    ...("caveat" in v && v.caveat ? [v.caveat as string, ""] : []),
    "#### What to send back",
    "",
    ...v.respond.map((r: string) => `- ${r}`),
    "",
    ...("handshake" in v && v.handshake ? [`**Handshake:** ${v.handshake}`, ""] : []),
    `Source: ${link(v.source.label, v.source.url)} — read ${v.source.fetched}${v.source.via === "snapshot" ? " (via the site's source-snapshot workflow)" : ""}. Guide: ${link(v.integrate === "/google-health-api" ? "Google Health API reference" : `${v.name} integration guide`, v.integrate)}.`,
    "",
  ]);

  return {
    path: PATH,
    title: "Is this webhook real?",
    description:
      "Paste a webhook from Oura, WHOOP, Terra, Polar, Strava, Withings, Wahoo or Google Health: check its signature in your browser and see what to send back.",
    updated: UPDATED,
    type: "tool",
    capsule: `Pick the vendor, paste the request you received and your secret, and this checks it the way that vendor documents. ${signed
      .map((v) => v.name)
      .join(", ")
      .replace(/, ([^,]*)$/, " and $1")} sign each delivery with HMAC-SHA256, each over a different string; Strava, Withings and Wahoo instead rely on a validation handshake or a secret you chose; and the Google Health API sends a secret you chose plus a Tink ECDSA P-256 signature, checked here against Google's published keyset. It then explains each field, states the response and time limit the vendor expects, and names the API call that fetches the data. Each rule was read from the vendor’s own page on ${UPDATED}. It all runs in your browser: the secret never leaves the tab.`,
    body: [
      interactiveNote(PATH, "the signature checker"),
      "",
      "## Each vendor’s rule, in its own words",
      "",
      "The verifier encodes exactly these sentences. Where a vendor’s page leaves something unstated, the block says so rather than filling it in.",
      "",
      ...vendors,
      "## Not included, and why",
      "",
      `- **Garmin.** Garmin’s public Health API page offers “Push or *Ping/Pull Architecture” but states no request format or signing rule, so there is no public rule to verify against. See the ${link("Garmin integration guide", "/integrate/garmin-api")}.`,
      `- **Fitbit Web API.** Google’s Google Health API pages, read ${UPDATED}, say the legacy Fitbit Web API and Fitbit OAuth endpoints will be turned off on November 2, 2026; its successor, the Google Health API, is covered above.`,
      "- **Suunto, COROS, Dexcom and others.** Their webhook documentation was not read for this tool, so they are not listed. A vendor is added only once its own page states the rule.",
      "",
      "## How this works",
      "",
      "The page makes no network request with what you paste. Signatures are recomputed with the browser’s WebCrypto API (`crypto.subtle`: HMAC with SHA-256, and ECDSA P-256 for the Google Health API) and compared in constant time; the secret field is a password input with autocomplete off, and nothing is written to storage. The only request the page can make is a GET of Google’s public keyset from gstatic.com, when you press the button.",
      "",
      "Paste the body exactly as it arrived. Every signed scheme here except Oura’s signs the raw bytes, and a framework that parses and re-serializes JSON before your handler sees it is the most common reason a genuine request fails verification.",
      "",
      "“Load an example” builds a request from the vendor’s own example payload, signed now with a demo secret, so it verifies; change one character of the body or signature and it stops verifying. The same verifier code is tested that way for every vendor on each change.",
      "",
      `A free tool from ${site.name}. Choosing between these APIs in the first place: ${link("integration guides for every major fitness API", "/integrate")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
