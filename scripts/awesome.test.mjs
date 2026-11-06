// Tests for the awesome-fitness-apis list (src/lib/awesomeList.mjs, scripts/build-awesome.mjs).
import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { awesomeMarkdown, awesomeModel, contents, entryLine, githubSlug, sentence } from "../src/lib/awesomeList.mjs";
import { libraryGroups, model, render } from "./build-awesome.mjs";

const ROOT = new URL("..", import.meta.url);

test("AWESOME.md is current", async () => {
  const have = fs.readFileSync(new URL("AWESOME.md", ROOT), "utf8");
  assert.equal(have, await render(), "AWESOME.md is stale: run node scripts/build-awesome.mjs");
});

test("githubSlug matches GitHub's heading anchors", () => {
  assert.equal(githubSlug("Nutrition & food data"), "nutrition--food-data");
  assert.equal(githubSlug("AI motion / coaching SDKs"), "ai-motion--coaching-sdks");
  assert.equal(githubSlug("Junction (formerly Vital)"), "junction-formerly-vital");
  assert.equal(githubSlug("Apple Health (HealthKit)"), "apple-health-healthkit");
});

test("every contents anchor is a heading in the file, and anchors are unique", async () => {
  const m = await model();
  const md = awesomeMarkdown(m);
  const headings = [...md.matchAll(/^#{1,3} (.+)$/gm)].map((x) => x[1]);
  const seen = new Map();
  const anchors = headings.map((h) => {
    const b = githubSlug(h);
    const n = seen.get(b) ?? 0;
    seen.set(b, n + 1);
    return n ? `${b}-${n}` : b;
  });
  for (const c of contents(m)) assert.ok(anchors.includes(c.anchor), `contents anchor #${c.anchor} has no heading`);
  assert.equal(new Set(contents(m).map((c) => c.anchor)).size, contents(m).length);
});

test("lines follow the awesome-list form and every link is absolute", async () => {
  const m = await model();
  for (const s of m.sections)
    for (const g of s.groups)
      for (const e of g.entries) {
        const line = entryLine(e);
        assert.match(line, /^- \[[^\n]+\]\(https:\/\/[^\s)]+\) - \S.*[.!?…)]$/, line);
      }
});

test("inputs are complete: every directory product, library, live MCP server, dataset and tool", async () => {
  const m = await model();
  const count = (key) => m.sections.find((s) => s.key === key).groups.reduce((n, g) => n + g.entries.length, 0);
  const { COST_ITEMS } = await import("../src/data/costModel.ts");
  const { LIBRARIES } = await import("../src/data/libraries.ts");
  const { MCP_HEALTH_SERVERS } = await import("../src/data/mcpHealthServers.ts");
  const { ALL_TOOLS } = await import("../src/lib/toolRegistry.ts");
  assert.equal(count("apis-and-platforms"), COST_ITEMS.length - 1, "every product but the llm-apis category");
  assert.equal(count("libraries"), LIBRARIES.length);
  assert.equal(count("mcp-servers"), MCP_HEALTH_SERVERS.filter((s) => s.status !== "deleted").length);
  assert.equal(count("tools"), ALL_TOOLS.length);
  assert.ok(count("open-datasets") >= 10);
});

test("library groups are read from librariesEditorial in order", () => {
  assert.deepEqual(
    libraryGroups().map((g) => g.id),
    ["react-native", "capacitor-cordova", "flutter", "python"],
  );
});

test("KinesteX carries the funding disclosure and nothing is ranked", async () => {
  const md = await render();
  const line = md.split("\n").find((l) => l.startsWith("- [KinesteX]"));
  assert.ok(line && /funds aifitnessapi\.com/.test(line));
  assert.doesNotMatch(md, /\bbest\b/i);
  assert.match(md, /CC BY 4\.0/);
});

test("sentence() ends lines with a period and collapses whitespace", () => {
  assert.equal(sentence("a\n  b"), "a b.");
  assert.equal(sentence("done."), "done.");
  assert.equal(sentence(""), "");
});

test("a model with one product renders its section", () => {
  const m = awesomeModel({
    siteUrl: "https://example.com/",
    apis: [{ id: "x", label: "X API", category: "c", devCost: "free", approvalGate: null }],
    categoryOrder: ["c"],
    categoryLabels: { c: "Cat" },
    devCostLabels: { free: "Free" },
    libraries: [],
    libraryGroups: [],
    librariesFetchedOn: "2026-01-01",
    mcpServers: [],
    mcpGroups: [],
    mcpFetchedOn: "2026-01-01",
    datasets: [],
    tools: [],
  });
  assert.match(awesomeMarkdown(m), /- \[X API\]\(https:\/\/example\.com\/apis\/x\) - Developer billing: Free\./);
});
