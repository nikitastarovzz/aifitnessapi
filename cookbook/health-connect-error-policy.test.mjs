/**
 * health-connect-error-policy.test.mjs
 *
 * The contract for health-connect-error-policy.mjs, held against the site's
 * generated copy of Google's references (src/data/errorCodes.ts): every
 * HealthConnectException constant there has a policy with the same value;
 * every evidence sentence is quoted verbatim from that file; and the retry
 * wrapper retries only what Google says may succeed later.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { ACTION, CODE_POLICY, EXCEPTION_POLICY, ID_SENSITIVE_METHODS, policyFor, withHealthConnectPolicy } from "./health-connect-error-policy.mjs";

const SRC = readFileSync(new URL("../src/data/errorCodes.ts", import.meta.url), "utf8");
const HC_BLOCK = SRC.slice(SRC.indexOf("export const HC_ERROR_CONSTANTS"), SRC.indexOf("export type HcClientException"));
const CLIENT_BLOCK = SRC.slice(SRC.indexOf("export const HC_CLIENT_EXCEPTIONS"));

/** [name, value] for every ERROR_* constant in the generated file. */
const GENERATED = [...HC_BLOCK.matchAll(/"name": "(ERROR_[A-Z_]+)",\s*"value": (\d+)/g)].map((m) => [m[1], Number(m[2])]);

test("the generated reference lists HealthConnectException constants", () => {
  assert.ok(GENERATED.length >= 9, `found ${GENERATED.length}`);
});

test("every generated constant has a policy, with the same value", () => {
  for (const [name, value] of GENERATED) {
    assert.ok(CODE_POLICY[name], `${name} has no policy: Google added a code, decide what it means`);
    assert.equal(CODE_POLICY[name].value, value, name);
  }
  assert.equal(Object.keys(CODE_POLICY).length, GENERATED.length, "policy lists a code the reference no longer has");
});

test("every code's evidence is Google's sentence, verbatim", () => {
  for (const [name, p] of Object.entries(CODE_POLICY)) assert.ok(HC_BLOCK.includes(p.evidence), `${name}: ${p.evidence}`);
});

test("every exception's and method's evidence is in the HealthConnectClient Throws tables", () => {
  for (const [name, p] of Object.entries(EXCEPTION_POLICY)) {
    assert.ok(CLIENT_BLOCK.includes(`"exception": "${name}"`), name);
    assert.ok(CLIENT_BLOCK.includes(p.evidence), `${name}: ${p.evidence}`);
  }
  for (const s of Object.values(ID_SENSITIVE_METHODS)) assert.ok(CLIENT_BLOCK.includes(s), s);
});

test("only codes Google says may succeed later are retryable", () => {
  const retryable = Object.keys(CODE_POLICY).filter((n) => policyFor(n).retryable).sort();
  assert.deepEqual(retryable, ["ERROR_DATA_SYNC_IN_PROGRESS", "ERROR_IO", "ERROR_RATE_LIMIT_EXCEEDED", "ERROR_REMOTE"]);
  assert.equal(policyFor("ERROR_SECURITY").action, ACTION.ASK_USER);
  assert.equal(policyFor("ERROR_INVALID_ARGUMENT").action, ACTION.FIX_REQUEST);
  assert.equal(policyFor("ERROR_UNKNOWN").action, ACTION.REPORT);
});

test("codes resolve by value and from an error carrying errorCode", () => {
  assert.equal(policyFor(7).name, "ERROR_RATE_LIMIT_EXCEEDED");
  assert.equal(policyFor({ errorCode: 5 }).action, ACTION.ASK_USER);
  assert.equal(policyFor(99).action, ACTION.REPORT);
  assert.match(policyFor(99).reason, /unknown HealthConnectException code 99/);
});

test("Jetpack exceptions resolve by simple or qualified class name", () => {
  const err = Object.assign(new Error("denied"), { name: "SecurityException" });
  assert.equal(policyFor(err).action, ACTION.ASK_USER);
  assert.equal(policyFor({ name: "android.os.RemoteException" }).action, ACTION.RETRY_LATER);
  assert.equal(policyFor({ name: "java.io.IOException" }).retryable, true);
  assert.equal(policyFor({ name: "TypeError" }).kind, "unknown");
});

test("a RemoteException from deleteRecords or updateRecords is treated as a bad id", () => {
  for (const method of ["deleteRecords", "updateRecords", "readRecord"]) {
    const p = policyFor({ name: "RemoteException" }, { method });
    assert.equal(p.action, ACTION.FIX_REQUEST, method);
    assert.equal(p.retryable, false);
  }
  assert.equal(policyFor({ name: "RemoteException" }, { method: "readRecords" }).retryable, true);
});

test("the wrapper retries rate limits with backoff, then succeeds", async () => {
  const sleeps = [];
  let calls = 0;
  const out = await withHealthConnectPolicy(
    async () => {
      calls++;
      if (calls < 3) throw Object.assign(new Error("slow down"), { errorCode: 7 });
      return "ok";
    },
    { sleep: async (ms) => sleeps.push(ms) },
  );
  assert.equal(out, "ok");
  assert.deepEqual(sleeps, [1000, 2000]);
});

test("the wrapper does not retry a permission error and attaches the policy", async () => {
  let calls = 0;
  await assert.rejects(
    withHealthConnectPolicy(async () => {
      calls++;
      throw Object.assign(new Error("no"), { name: "SecurityException" });
    }, { sleep: async () => {} }),
    (err) => err.policy.action === ACTION.ASK_USER,
  );
  assert.equal(calls, 1);
});

test("the wrapper gives up after its attempt budget", async () => {
  let calls = 0;
  await assert.rejects(
    withHealthConnectPolicy(async () => {
      calls++;
      throw Object.assign(new Error("io"), { name: "IOException" });
    }, { attempts: 3, sleep: async () => {} }),
    (err) => err.policy.retryable === true,
  );
  assert.equal(calls, 3);
});
