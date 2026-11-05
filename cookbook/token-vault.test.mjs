/**
 * token-vault.test.mjs
 *
 * The contract for token-vault.mjs: a sealed token opens with the same key
 * and context; a different context (another user's row), a flipped byte, a
 * cut tag or a deleted key all fail closed with a reason; two seals of the
 * same token never share an IV or a ciphertext; and a key rotation rewraps a
 * row under the new key without ever writing plaintext.
 *
 * Run with `node --test cookbook/`.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import test from "node:test";
import assert from "node:assert/strict";

import { TokenVaultError, createTokenVault, generateKey } from "./token-vault.mjs";

const K1 = Buffer.alloc(32, 1);
const K2 = Buffer.alloc(32, 2);
const CTX = { userId: "u-42", vendor: "whoop", field: "refresh_token" };
const TOKEN = "rt_example_value_not_a_real_token";

function reasonOf(fn) {
  try {
    fn();
  } catch (e) {
    assert.ok(e instanceof TokenVaultError, `expected TokenVaultError, got ${e}`);
    return e.reason;
  }
  assert.fail("expected a throw");
}

test("seal then open returns the token", () => {
  const v = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  const sealed = v.seal(TOKEN, CTX);
  assert.match(sealed, /^tv1\.k1\.[A-Za-z0-9_-]{16}\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]+$/);
  assert.equal(sealed.includes(TOKEN), false);
  assert.equal(v.open(sealed, CTX), TOKEN);
});

test("the same token sealed twice never repeats an IV or a ciphertext", () => {
  const v = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  const a = v.seal(TOKEN, CTX).split(".");
  const b = v.seal(TOKEN, CTX).split(".");
  assert.notEqual(a[2], b[2]);
  assert.notEqual(a[4], b[4]);
});

test("a ciphertext moved to another user's row fails authentication", () => {
  const v = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  const sealed = v.seal(TOKEN, CTX);
  assert.equal(reasonOf(() => v.open(sealed, { ...CTX, userId: "u-43" })), "auth-failed");
  assert.equal(reasonOf(() => v.open(sealed, { ...CTX, field: "access_token" })), "auth-failed");
});

test("a flipped ciphertext byte or a swapped tag fails authentication", () => {
  const v = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  const parts = v.seal(TOKEN, CTX).split(".");
  const ct = Buffer.from(parts[4], "base64url");
  ct[0] ^= 1;
  const flipped = [...parts.slice(0, 4), ct.toString("base64url")].join(".");
  assert.equal(reasonOf(() => v.open(flipped, CTX)), "auth-failed");
  const otherTag = v.seal(TOKEN, CTX).split(".")[3];
  assert.equal(reasonOf(() => v.open([parts[0], parts[1], parts[2], otherTag, parts[4]].join("."), CTX)), "auth-failed");
});

test("the wrong key under the right id fails authentication", () => {
  const sealed = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" }).seal(TOKEN, CTX);
  const impostor = createTokenVault({ keys: { k1: K2 }, activeKeyId: "k1" });
  assert.equal(reasonOf(() => impostor.open(sealed, CTX)), "auth-failed");
});

test("a truncated tag or a foreign format is malformed, not a crash", () => {
  const v = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  const parts = v.seal(TOKEN, CTX).split(".");
  const short = [parts[0], parts[1], parts[2], parts[3].slice(0, 10), parts[4]].join(".");
  assert.equal(reasonOf(() => v.open(short, CTX)), "malformed");
  assert.equal(reasonOf(() => v.open("plaintext-token", CTX)), "malformed");
  assert.equal(reasonOf(() => v.open(null, CTX)), "malformed");
});

test("rotation: rows sealed under k1 rewrap to k2, and k1 can then be dropped", () => {
  const before = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  const row = before.seal(TOKEN, CTX);
  const during = createTokenVault({ keys: { k1: K1, k2: K2 }, activeKeyId: "k2" });
  assert.equal(during.open(row, CTX), TOKEN, "old rows still open during rotation");
  assert.equal(during.needsRewrap(row), true);
  const rewrapped = during.rewrap(row, CTX);
  assert.equal(rewrapped.split(".")[1], "k2");
  assert.equal(during.needsRewrap(rewrapped), false);
  assert.equal(during.rewrap(rewrapped, CTX), rewrapped, "rewrap is a no-op under the active key");
  const after = createTokenVault({ keys: { k2: K2 }, activeKeyId: "k2" });
  assert.equal(after.open(rewrapped, CTX), TOKEN);
  assert.equal(reasonOf(() => after.open(row, CTX)), "unknown-key");
});

test("sealGrant seals each secret field under its own context and leaves the rest readable", () => {
  const v = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  const grant = { access_token: "at", refresh_token: "rt", expires_in: 3600, scope: "offline read:sleep" };
  const ctx = { userId: "u-42", vendor: "whoop" };
  const row = v.sealGrant(grant, ctx);
  assert.equal(row.expires_in, 3600);
  assert.equal(row.scope, "offline read:sleep");
  assert.ok(row.access_token.startsWith("tv1."));
  assert.deepEqual(v.openGrant(row, ctx), grant);
  // Swapping the two sealed fields is caught: each is bound to its field name.
  const swapped = { ...row, access_token: row.refresh_token, refresh_token: row.access_token };
  assert.equal(reasonOf(() => v.openGrant(swapped, ctx)), "auth-failed");
});

test("bad configuration is refused at construction; a context is mandatory", () => {
  assert.throws(() => createTokenVault({ keys: { k1: Buffer.alloc(16) }, activeKeyId: "k1" }), /32 bytes/);
  assert.throws(() => createTokenVault({ keys: { k1: K1 }, activeKeyId: "k2" }), /not in keys/);
  assert.throws(() => createTokenVault({ keys: { "bad id": K1 }, activeKeyId: "bad id" }), /key id/);
  const v = createTokenVault({ keys: { k1: K1 }, activeKeyId: "k1" });
  assert.throws(() => v.seal(TOKEN), /context is required/);
  assert.equal(generateKey().length, 32);
});
