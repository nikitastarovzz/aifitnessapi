/**
 * "Built with": the issue form written by src/lib/builtWithSubmission.mjs,
 * read back by the same module, the file scripts/import-built-with.mjs
 * generates from accepted issues, and the /awesome section it feeds.
 *
 *   node --test scripts/built-with.test.mjs
 *
 * The projects below are synthetic test input, not anyone's submission.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  ACCEPT_LABEL,
  BLOCK_TAG,
  CAPS,
  ISSUE_URL,
  MAX_APIS,
  REDACTED,
  SUBMIT_LABEL,
  TEMPLATE_FILE,
  TEMPLATE_URL,
  TITLE_PREFIX,
  checkUrl,
  issueBody,
  parseIssueBody,
} from "../src/lib/builtWithSubmission.mjs";
import { redact } from "../src/lib/accessReportSubmission.mjs";
import { awesomeMarkdown, awesomeModel, entryLine } from "../src/lib/awesomeList.mjs";
import { excludedApiIds } from "./build-awesome.mjs";

const root = new URL("..", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");
const { COST_ITEMS } = await import(new URL("src/data/costModel.ts", root).href);
const API_IDS = COST_ITEMS.map((i) => i.id).filter((id) => !excludedApiIds().has(id));

const filled = {
  name: "Rep Pal",
  url: "https://reppal.example.com/",
  repoUrl: "https://github.com/example/rep-pal",
  apis: "mediapipe, health-connect",
  description: "Counts squats from the phone camera (offline) and writes the session to Health Connect.",
};
const parse = (o = {}) => parseIssueBody(issueBody({ ...filled, ...o }), { apiIds: API_IDS });

test("a filled submission round-trips through the issue body", () => {
  const r = parse();
  assert.ok(r.ok, r.errors?.join("; "));
  assert.deepEqual(r.record, {
    name: "Rep Pal",
    url: "https://reppal.example.com/",
    repoUrl: "https://github.com/example/rep-pal",
    apis: ["mediapipe", "health-connect"],
    description: "Counts squats from the phone camera (offline) and writes the session to Health Connect.",
  });
  assert.equal(r.redacted, 0);
  const noRepo = parse({ repoUrl: "" });
  assert.ok(noRepo.ok, noRepo.errors?.join("; "));
  assert.equal(noRepo.record.repoUrl, null);
  assert.deepEqual(parse({ apis: " Garmin ,OURA" }).record.apis, ["garmin", "oura"], "ids ignore case and padding");
  assert.ok(API_IDS.includes("garmin") && !API_IDS.includes("llm-apis"), "the directory's ids, less the excluded ones");
  assert.throws(() => parseIssueBody(issueBody(filled)), /apiIds/);
});

test("each invalid field is rejected, not repaired", () => {
  const bad = {
    "missing name": { name: "" },
    "over-long name": { name: "n".repeat(CAPS.name + 1) },
    "markup in name": { name: "<b>Rep</b>" },
    "markdown link in name": { name: "Rep](https://evil.example)" },
    "link in description": { description: "See https://evil.example for more" },
    "www in description": { description: "See www.evil.example" },
    "backtick in description": { description: "uses `eval`" },
    "pipe in description": { description: "a | b" },
    "over-long description": { description: "d".repeat(CAPS.description + 1) },
    "missing description": { description: "" },
    "email in name": { name: "jane@example.com" },
    "missing url": { url: "" },
    "http url": { url: "http://reppal.example.com/" },
    "javascript url": { url: "javascript:alert(1)" },
    "query string": { url: "https://reppal.example.com/?ref=x" },
    fragment: { url: "https://reppal.example.com/#top" },
    credentials: { url: "https://user:pass@reppal.example.com/" },
    "ip literal": { url: "https://127.0.0.1/" },
    localhost: { url: "https://localhost/" },
    port: { url: "https://reppal.example.com:8443/" },
    "space in url": { url: "https://reppal.example.com/a b" },
    "over-long url": { url: `https://reppal.example.com/${"p".repeat(CAPS.url)}` },
    "repo off the code hosts": { repoUrl: "https://example.com/example/rep-pal" },
    "repo with no name": { repoUrl: "https://github.com/example" },
    "missing apis": { apis: "" },
    "unknown api": { apis: "garmin, fitbod" },
    "api twice": { apis: "garmin, garmin" },
    "too many apis": { apis: API_IDS.slice(0, MAX_APIS + 1).join(", ") },
    "only commas": { apis: ", ," },
  };
  for (const [name, o] of Object.entries(bad)) {
    const r = parse(o);
    assert.equal(r.ok, false, name);
    assert.ok(r.errors.length > 0, name);
  }
  const body = issueBody(filled);
  const p = (b) => parseIssueBody(b, { apiIds: API_IDS });
  assert.equal(p(undefined).ok, false);
  assert.equal(p("no block here").ok, false);
  assert.equal(p(body.replace("\n```\n", "\n")).ok, false, "unclosed block");
  assert.equal(p(body.replace("\ndescription:", "\ncolour: blue\ndescription:")).ok, false, "unknown key");
  assert.equal(p(body.replace("name: Rep Pal", "name: Rep Pal\nname: Other")).ok, false, "a key given twice");
  assert.equal(p(body + "\n```" + BLOCK_TAG + "\nname: x\n```\n").ok, false, "two blocks");
  assert.equal(p(issueBody({})).ok, false, "the empty template is not a submission");
});

test("sensitive-looking text is removed from the description and refused elsewhere", () => {
  const r = parse({ description: "Ask ana@vendor.io or @someone-here about the beta" });
  assert.ok(r.ok, r.errors?.join("; "));
  assert.equal(r.redacted, 2);
  assert.equal(r.record.description, `Ask ${REDACTED} or ${REDACTED} about the beta`);
  assert.equal(parse({ url: "https://reppal.example.com/0123456789abcdef0123456789abcdef" }).ok, false, "a key-like URL is refused, not mangled");
  assert.equal(parse({ name: "Rep @pal" }).ok, false);
  assert.equal(checkUrl("https://github.com/example/rep-pal", 200, ["github.com"]), null);
  assert.equal(checkUrl("https://www.github.com/example/rep-pal", 200, ["github.com"]), null);
});

test("the issue template asks exactly what the module reads", () => {
  const tpl = read(`.github/ISSUE_TEMPLATE/${TEMPLATE_FILE}`);
  assert.ok(tpl.includes(`title: "${TITLE_PREFIX} "`));
  assert.ok(tpl.includes(`labels: ${SUBMIT_LABEL}\n`));
  assert.ok(tpl.includes(ACCEPT_LABEL));
  assert.ok(tpl.endsWith(issueBody({})), "template body drifted from issueBody(); regenerate it from the module");
  assert.ok(TEMPLATE_URL.endsWith(`/issues/new?template=${TEMPLATE_FILE}`));
  assert.ok(!TEMPLATE_URL.includes("labels="), "visitors cannot set labels, so the URL must not try");
});

const generated = () => {
  const src = read("src/data/builtWith.ts");
  const m = /export const BUILT_WITH: BuiltWithProject\[\] = (\[[\s\S]*\]);\s*$/.exec(src);
  assert.ok(m, "src/data/builtWith.ts has no BUILT_WITH array");
  return { src, rows: JSON.parse(m[1]) };
};

test("the generated file is empty, or every row is valid and links its issue", () => {
  const { src, rows } = generated();
  assert.ok(src.includes("GENERATED — do not hand-edit"));
  const seen = new Set();
  for (const r of rows) {
    assert.ok(Number.isInteger(r.issue) && r.issue > 0);
    assert.ok(!seen.has(r.issue), `#${r.issue} listed twice`);
    seen.add(r.issue);
    assert.match(r.issueUrl, ISSUE_URL);
    assert.ok(r.issueUrl.endsWith(`/issues/${r.issue}`));
    assert.equal(checkUrl(r.url, CAPS.url), null, `#${r.issue} url`);
    for (const a of r.apis) assert.ok(API_IDS.includes(a), `#${r.issue} api ${a}`);
    assert.equal(redact(r.description).removed, 0, `#${r.issue} description still holds sensitive-looking text`);
  }
  if (rows.length === 0) assert.ok(src.includes("BUILT_WITH_IMPORTED_ON: string | null = null;"));
});

test("the importer reproduces the empty file, and imports only accepted, valid, prefixed, new issues", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "built-with-"));
  const run = (issues) => {
    const from = path.join(dir, "issues.json");
    const out = path.join(dir, "out.ts");
    fs.writeFileSync(from, JSON.stringify(issues));
    execFileSync(process.execPath, ["--no-warnings", "scripts/import-built-with.mjs", "--from", from, "--out", out], {
      cwd: new URL(".", root),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return fs.readFileSync(out, "utf8");
  };
  try {
    const { rows } = generated();
    if (rows.length === 0) assert.equal(run([]), read("src/data/builtWith.ts"), "the committed empty file is not what the importer writes");
    const issue = (number, title, labels, body) => ({
      number,
      title,
      labels: labels.map((name) => ({ name })),
      body,
      html_url: `https://github.com/nikitastarovzz/aifitnessapi/issues/${number}`,
      created_at: "2026-11-24T10:00:00Z",
      user: { login: "someone" },
    });
    const good = issueBody({ ...filled, description: "Mail x@y.com for access" });
    const out = run([
      issue(7, `${TITLE_PREFIX} Rep Pal`, [ACCEPT_LABEL], good),
      issue(8, `${TITLE_PREFIX} Rep Pal`, [SUBMIT_LABEL], good),
      issue(9, "Rep Pal", [ACCEPT_LABEL], good),
      issue(10, `${TITLE_PREFIX} Bad`, [ACCEPT_LABEL], issueBody({ ...filled, apis: "fitbod" })),
      issue(11, `${TITLE_PREFIX} Rep Pal again`, [ACCEPT_LABEL], issueBody({ ...filled, url: "https://reppal.example.com" })),
      { ...issue(12, `${TITLE_PREFIX} PR`, [ACCEPT_LABEL], good), pull_request: {} },
    ]);
    const imported = JSON.parse(/= (\[[\s\S]*\]);\s*$/.exec(out)[1]);
    assert.deepEqual(imported.map((r) => r.issue), [7]);
    assert.equal(imported[0].description, `Mail ${REDACTED} for access`);
    assert.equal(imported[0].submittedOn, "2026-11-24");
    assert.ok(!JSON.stringify(imported).includes("someone"), "no GitHub login is copied into the site");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the /awesome section shows an empty state and a submit link, then the accepted projects", () => {
  const base = {
    siteUrl: "https://example.com/",
    apis: [
      { id: "mediapipe", label: "MediaPipe", category: "c", devCost: "free", approvalGate: null },
      { id: "garmin", label: "Garmin", category: "c", devCost: "free", approvalGate: null },
    ],
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
  };
  const empty = awesomeModel({ ...base, builtWith: { projects: [], submitUrl: TEMPLATE_URL } });
  const s = empty.sections.find((x) => x.key === "built-with");
  assert.ok(s.empty && s.action.label === "Submit your project");
  const md = awesomeMarkdown(empty);
  assert.ok(md.includes("## Built with these APIs"));
  assert.ok(md.includes(`[Submit your project](${TEMPLATE_URL})`));
  const one = awesomeModel({
    ...base,
    builtWith: {
      submitUrl: TEMPLATE_URL,
      projects: [{ issue: 7, issueUrl: "https://github.com/nikitastarovzz/aifitnessapi/issues/7", name: "Rep [Pal]", url: "https://reppal.example.com/", repoUrl: "https://github.com/example/rep-pal", apis: ["mediapipe", "garmin"], description: "Counts squats" }],
    },
  });
  const t = one.sections.find((x) => x.key === "built-with");
  assert.equal(t.empty, undefined);
  const line = entryLine(t.groups[0].entries[0]);
  assert.equal(
    line,
    "- [Rep \\[Pal\\]](https://reppal.example.com/) - Counts squats. Uses MediaPipe, Garmin. Source: https://github.com/example/rep-pal. Submitted in https://github.com/nikitastarovzz/aifitnessapi/issues/7.",
  );
  const page = read("src/app/awesome/page.tsx");
  assert.ok(page.includes("data-cta={`awesome-${s.key}-submit`}"), "the submit button is counted as a CTA");
  assert.ok(read("ops/MEASUREMENT.md").includes("awesome-built-with-submit"));
});
