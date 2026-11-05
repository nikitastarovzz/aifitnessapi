import { PAGE_H1 } from "@/data/pageTitles";
import { SUUNTO_FIELDS, WEBHOOK_SOURCES, WEBHOOK_VENDORS, WEBHOOKS_FETCHED_ON, WEBHOOKS_NOT_COVERED } from "@/data/webhookPayloads";
import {
  RELATED,
  SCHEMAS_PATH,
  SENDER_PATH,
  SENDER_TEXT,
  SENDER_USAGE,
  WEBHOOKS_DESCRIPTION,
  WEBHOOKS_PATH,
  headerLines,
  schemaFor,
  verifierHref,
  webhooksCapsule,
} from "@/lib/webhooksPage";
import { link, table, type MirrorDoc } from "./core";

/** /webhooks.md — mirrors src/app/webhooks/page.tsx from the same data, examples and schemas included. */
export function webhooksMirror(): MirrorDoc {
  const fence = (lang: string, body: string) => ["```" + lang, body, "```", ""];
  const vendors = WEBHOOK_VENDORS.flatMap((v) => {
    const verifier = verifierHref(v);
    const guide = link(v.guide === "/google-health-api" ? "Google Health API reference" : `${v.name} integration guide`, v.guide);
    return [
      `## ${v.name}`,
      "",
      `- **Signature** ${v.signature.text} ${link("Source", WEBHOOK_SOURCES[v.signature.source].url)}`,
      `- **Respond** ${v.respond.text} ${link("Source", WEBHOOK_SOURCES[v.respond.source].url)}`,
      `- **Retries** ${v.retries.text} ${link("Source", WEBHOOK_SOURCES[v.retries.source].url)}`,
      ...v.notes.map((n) => `- **Note** ${n.text} ${link("Source", WEBHOOK_SOURCES[n.source].url)}`),
      "",
      verifier ? `${link(`Verify a ${v.name} delivery`, verifier)} · ${guide}` : guide,
      "",
      ...(v.id === "suunto" ? [`${SUUNTO_FIELDS.text} ${link("Source", WEBHOOK_SOURCES[SUUNTO_FIELDS.source].url)}`, ""] : []),
      ...v.payloads.flatMap((p) => {
        const src = WEBHOOK_SOURCES[p.evidence.source];
        const headers = headerLines(p);
        return [
          `### ${p.title}`,
          "",
          p.trigger,
          "",
          ...(headers ? ["#### Headers in the example", "", ...fence("http", headers)] : []),
          `#### ${p.encoding === "form" ? "Example body (form-encoded fields)" : "Example body"}`,
          "",
          ...fence(p.encoding === "form" ? "text" : "json", p.example),
          ...(p.sampleNote ? [p.sampleNote, ""] : []),
          "#### JSON Schema",
          "",
          ...fence("json", schemaFor(v, p)),
          `From ${link(src.label, src.url)}, read ${WEBHOOKS_FETCHED_ON}${src.via === "snapshot" ? " (via the site's source-snapshot workflow)" : ""}.`,
          "",
        ];
      }),
    ];
  });

  return {
    path: WEBHOOKS_PATH,
    title: PAGE_H1["/webhooks"],
    description: WEBHOOKS_DESCRIPTION,
    updated: WEBHOOKS_FETCHED_ON,
    type: "record",
    capsule: webhooksCapsule(),
    body: [
      "## At a glance",
      "",
      ...table(
        ["Vendor", "Payloads", "Signature", "Retries"],
        WEBHOOK_VENDORS.map((v) => [v.name, v.payloads.length, v.signature.text, v.retries.text]),
      ),
      ...vendors,
      "## Send a signed sample to your own handler",
      "",
      `${link("send-sample.mjs", SENDER_PATH)} posts any example above to a URL on your machine, signed the way its vendor documents.`,
      "",
      ...fence("sh", SENDER_USAGE.join("\n")),
      ...SENDER_TEXT.flatMap((t) => [t, ""]),
      "## Download every schema",
      "",
      `${link("schemas.json", SCHEMAS_PATH)} is one JSON Schema (draft 2020-12) bundle with each payload under $defs; reference one as schemas.json#<vendor>-<payload>, the id on its section above. Each property says in x-type-from whether its type comes from the vendor’s field table or only from its example, and only fields a vendor calls required are required.`,
      "",
      "## Not covered, and why",
      "",
      ...WEBHOOKS_NOT_COVERED.map(
        (o) => `- **${o.name}.** ${o.reason} ${link(o.guide === "/fitbit-api-shutdown" ? "Fitbit Web API retirement" : `${o.name} guide`, o.guide)}.`,
      ),
      "",
      "## Related pages",
      "",
      ...RELATED.map((r) => `- ${link(r.text, r.href)}`),
      "",
    ],
  };
}
