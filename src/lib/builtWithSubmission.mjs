/**
 * "Built with": projects that use the APIs this site covers, submitted by
 * their makers in the open and listed on /awesome (and in AWESOME.md) once a
 * maintainer accepts them.
 *
 * The same pattern as the access reports (src/lib/accessReportSubmission.mjs),
 * on purpose: there is no backend. A maker opens a GitHub issue from the
 * template .github/ISSUE_TEMPLATE/built-with.md (the "Submit your project"
 * button on /awesome links it); a maintainer reads it and adds ACCEPT_LABEL;
 * scripts/import-built-with.mjs (run by hand, unauthenticated, no secrets)
 * turns accepted issues into src/data/builtWith.ts, which src/lib/awesomeList.mjs
 * renders. A visitor cannot set labels, so the importer selects by title
 * prefix and by the maintainer's label, never by a label the submitter set.
 *
 * One module, imported by the importer (to parse what came back), by
 * scripts/built-with.test.mjs and by the list (for the template link), so the
 * form asked and the form read cannot drift.
 *
 * A submission is copied as written or not at all: an unknown API id, a URL
 * that is not a plain https address, an over-long or multi-line text, markup,
 * or an unknown line makes the issue invalid, and the importer reports and
 * skips it rather than repairing it. Text that looks like a secret or a
 * person (redact() from the access-report module) makes the name or a URL
 * invalid, and is replaced by REDACTED in the description. Nothing is ranked
 * or reviewed: the line is the maker's own description, labelled as theirs.
 */
import { REDACTED, REPO, REPO_URL, NEW_ISSUE_URL, redact } from "./accessReportSubmission.mjs";

export { REDACTED, REPO, REPO_URL, NEW_ISSUE_URL };
export const TEMPLATE_FILE = "built-with.md";
export const TEMPLATE_URL = `${NEW_ISSUE_URL}?template=${TEMPLATE_FILE}`;
export const TITLE_PREFIX = "[built-with]";
/** The label the template sets on a new issue. */
export const SUBMIT_LABEL = "built-with";
/** Added by a maintainer after reading the issue; only these are imported. */
export const ACCEPT_LABEL = "built-with:accepted";
/** The fenced block's info string; the parser reads only this block. */
export const BLOCK_TAG = "built-with";
/** Length caps, in characters, after trimming. Longer is invalid, not cut. */
export const CAPS = { name: 60, url: 200, repo: 200, description: 140 };
export const MAX_APIS = 8;
/** Code hosts a repository link may point at. */
export const REPO_HOSTS = ["github.com", "gitlab.com", "codeberg.org", "bitbucket.org"];

/** The block's lines, in order: key in the issue, key in the record, required. */
export const FIELDS = [
  { key: "name", prop: "name", required: true, help: `the project's name, up to ${CAPS.name} characters` },
  { key: "url", prop: "url", required: true, help: "the project's public https address (its site or repository), with no query string" },
  { key: "repo", prop: "repoUrl", required: false, help: `optional: its source repository on ${REPO_HOSTS.join(", ")}` },
  {
    key: "apis",
    prop: "apis",
    required: true,
    help: `the APIs it uses, as directory ids separated by commas, up to ${MAX_APIS} (the last part of a product's address on https://aifitnessapi.com/apis, e.g. garmin, health-connect, mediapipe)`,
  },
  { key: "description", prop: "description", required: true, help: `what it does, one line, up to ${CAPS.description} characters` },
];

/** The issue body, the same in the template file and anywhere a link is built. */
export function issueBody(prefill = {}) {
  const value = (f) => {
    const v = prefill[f.prop] ?? prefill[f.key];
    if (v === undefined || v === null) return "";
    return Array.isArray(v) ? v.join(", ") : String(v);
  };
  return [
    "A project you made that uses one or more of the APIs aifitnessapi.com covers. Everything in this issue is public.",
    "",
    "Please do not post API keys, tokens, client secrets, emails, or the names of people.",
    "Text that looks like a key, token, email or @mention is removed before a project is listed.",
    "",
    "Fill in the block below, one line per field, after the colon:",
    "",
    ...FIELDS.map((f) => `- ${f.key}: ${f.help}`),
    "",
    "```" + BLOCK_TAG,
    ...FIELDS.map((f) => `${f.key}: ${value(f)}`.trimEnd()),
    "```",
    "",
    "A maintainer reads each submission and adds the `" + ACCEPT_LABEL + "` label; only those are",
    "listed on https://aifitnessapi.com/awesome and in AWESOME.md, with your description as you wrote it",
    "and a link back to this issue. Listing is not a review or an endorsement.",
    "",
  ].join("\n");
}

/**
 * A plain public https address, or an error string. No credentials, no
 * query string or fragment (where tokens and tracking live), a dotted host
 * that is not an IP literal or localhost, at most `cap` characters.
 */
export function checkUrl(raw, cap, hosts = null) {
  const v = String(raw ?? "");
  if (v.length > cap) return `is ${v.length} characters, over ${cap}`;
  if (/\s/.test(v)) return "contains a space";
  let u;
  try {
    u = new URL(v);
  } catch {
    return "is not a URL";
  }
  if (u.protocol !== "https:") return "is not https";
  if (u.username || u.password) return "carries credentials";
  if (u.search || u.hash || v.includes("?") || v.includes("#")) return "has a query string or fragment";
  const host = u.hostname.toLowerCase();
  if (!host.includes(".") || host === "localhost" || host.endsWith(".localhost") || /^[\d.]+$/.test(host) || host.startsWith("[")) {
    return "is not a public host name";
  }
  if (u.port) return "names a port";
  if (hosts) {
    const h = host.replace(/^www\./, "");
    if (!hosts.includes(h)) return `is not on ${hosts.join(", ")}`;
    if (u.pathname.split("/").filter(Boolean).length < 2) return "is not a repository address (owner and name)";
  }
  if (redact(v).removed > 0) return "looks like it holds a key or a person's address";
  return null;
}

/**
 * Read a submission back out of an issue body. `apiIds` is the directory's
 * id list (scripts/import-built-with.mjs reads it from src/data/costModel.ts).
 * Returns { ok, record, redacted } or { ok: false, errors }.
 */
export function parseIssueBody(body, { apiIds } = {}) {
  if (!Array.isArray(apiIds) || apiIds.length === 0) throw new Error("parseIssueBody: apiIds is required");
  if (typeof body !== "string") return { ok: false, errors: ["no body"] };
  const text = body.replace(/\r\n?/g, "\n");
  const fence = "```" + BLOCK_TAG + "\n";
  const start = text.indexOf(fence);
  if (start < 0) return { ok: false, errors: [`no \`\`\`${BLOCK_TAG} block`] };
  if (text.indexOf(fence, start + fence.length) >= 0) return { ok: false, errors: [`more than one \`\`\`${BLOCK_TAG} block`] };
  const end = text.indexOf("\n```", start + fence.length - 1);
  if (end < 0) return { ok: false, errors: ["the block is not closed"] };

  const errors = [];
  const raw = {};
  for (const line of text.slice(start + fence.length, end + 1).split("\n")) {
    if (!line.trim()) continue;
    const m = /^\s*([a-z_]+)\s*:(.*)$/.exec(line);
    const field = m && FIELDS.find((f) => f.key === m[1]);
    if (!field) {
      errors.push(`unknown line ${JSON.stringify(line.slice(0, 40))}`);
      continue;
    }
    if (field.prop in raw) errors.push(`${field.key} given twice`);
    raw[field.prop] = m[2].trim();
  }

  // Characters that would turn a line of AWESOME.md into markup or a link.
  const MARKUP = /[<>`[\]|\\]/;
  const words = (prop, required) => {
    const v = raw[prop] ?? "";
    if (!v) {
      if (required) errors.push(`${prop} is missing`);
      return null;
    }
    if (v.length > CAPS[prop]) errors.push(`${prop} is ${v.length} characters, over ${CAPS[prop]}`);
    if (MARKUP.test(v)) errors.push(`${prop} contains markup`);
    if (/:\/\/|\bwww\./i.test(v)) errors.push(`${prop} contains a link; put the address in url`);
    return v;
  };

  const name = words("name", true);
  if (name && redact(name).removed > 0) errors.push("name looks like it holds a key, an email or an @mention");

  let redacted = 0;
  let description = words("description", true);
  if (description) {
    const r = redact(description);
    redacted += r.removed;
    description = r.text;
  }

  const url = raw.url ?? "";
  if (!url) errors.push("url is missing");
  else {
    const e = checkUrl(url, CAPS.url);
    if (e) errors.push(`url ${e}`);
  }

  const repo = raw.repoUrl ?? "";
  if (repo) {
    const e = checkUrl(repo, CAPS.repo, REPO_HOSTS);
    if (e) errors.push(`repo ${e}`);
  }

  const apisRaw = raw.apis ?? "";
  const apis = apisRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!apisRaw) errors.push("apis is missing");
  else if (apis.length === 0) errors.push("apis names no id");
  else {
    if (apis.length > MAX_APIS) errors.push(`apis names ${apis.length} ids, over ${MAX_APIS}`);
    if (new Set(apis).size !== apis.length) errors.push("apis names an id twice");
    const unknown = apis.filter((a) => !apiIds.includes(a));
    if (unknown.length) errors.push(`apis ${unknown.map((u) => JSON.stringify(u.slice(0, 30))).join(", ")} not in the directory`);
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, redacted, record: { name, url, repoUrl: repo || null, apis, description } };
}

/** An issue URL this repository could have issued: https://github.com/<REPO>/issues/<n>. */
export const ISSUE_URL = new RegExp(`^${REPO_URL.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}/issues/\\d+$`);
