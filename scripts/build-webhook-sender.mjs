#!/usr/bin/env node
/**
 * Writes public/webhooks/send-sample.mjs, the zero-dependency mock sender
 * documented on /webhooks, from scripts/templates/send-sample.template.mjs
 * and the documented examples in src/data/webhookPayloads.ts.
 *
 *   node scripts/build-webhook-sender.mjs           write the file
 *   node scripts/build-webhook-sender.mjs --check   exit 1 if it is stale
 *
 * Only examples a vendor printed are embedded: a payload whose `sample` is
 * null (Terra's type-name formats) is left out, except Wahoo's, whose only
 * placeholder is the token the sender fills in. scripts/webhook-payloads.test.mjs
 * runs --check, so editing the data without regenerating fails the tests.
 */
import fs from "node:fs";
import path from "node:path";
import { WEBHOOK_VENDORS } from "../src/data/webhookPayloads.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const TEMPLATE = path.join(ROOT, "scripts/templates/send-sample.template.mjs");
const OUT = path.join(ROOT, "public/webhooks/send-sample.mjs");

export function senderSamples() {
  const out = {};
  for (const v of WEBHOOK_VENDORS) {
    if (!v.sender) continue;
    const events = [];
    for (const p of v.payloads) {
      const contentType = p.encoding === "form" ? "application/x-www-form-urlencoded" : "application/json";
      if (p.sample != null) events.push({ id: p.id, title: p.title, contentType, body: p.sample });
      else if (v.id === "wahoo") events.push({ id: p.id, title: p.title, contentType, body: p.example });
    }
    if (events.length) out[v.id] = { name: v.name, scheme: v.sender, events };
  }
  return out;
}

export function render() {
  const tpl = fs.readFileSync(TEMPLATE, "utf8");
  const marker = "/*__SAMPLES__*/ null";
  if (!tpl.includes(marker)) throw new Error("template marker missing");
  return tpl.replace(marker, JSON.stringify(senderSamples(), null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const next = render();
  if (process.argv.includes("--check")) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
    if (cur !== next) {
      console.error("public/webhooks/send-sample.mjs is stale: run node scripts/build-webhook-sender.mjs");
      process.exit(1);
    }
    console.log("send-sample.mjs is current");
  } else {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, next);
    const s = senderSamples();
    console.log(`wrote ${path.relative(ROOT, OUT)}: ${Object.keys(s).length} vendors, ${Object.values(s).reduce((n, v) => n + v.events.length, 0)} events`);
  }
}
