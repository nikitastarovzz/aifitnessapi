/**
 * token-vault.mjs — encrypt OAuth grants at rest with AES-256-GCM, bind each
 * ciphertext to the row it belongs to, and rotate the key without a
 * migration window.
 *
 * WHY
 *   A fitness grant is long-lived: the site's guides quote Withings refresh
 *   tokens lasting a year and Polar access tokens that, in one section of
 *   Polar's documentation, "will not expire unless explicitly revoked". A
 *   database dump of plaintext tokens is a dump of every user's health data
 *   for that long. This file keeps the tokens sealed and the key elsewhere.
 *
 * WHAT THIS IMPLEMENTS
 *   `createTokenVault({ keys, activeKeyId })` returns
 *     seal(plaintext, context)   → "tv1.<keyId>.<iv>.<tag>.<ciphertext>"
 *                                  (base64url parts), sealed under the active
 *                                  key with a fresh random 12-byte IV
 *     open(sealed, context)      → plaintext, or throws TokenVaultError
 *     needsRewrap(sealed)        → true when sealed under a non-active key
 *     rewrap(sealed, context)    → the same plaintext under the active key
 *     sealGrant / openGrant      → the same for a whole grant object
 *   `context` (for example user id + vendor + field) is fed to GCM as
 *   additional authenticated data. It is not stored; it must be supplied
 *   again to open, so a ciphertext copied onto another user's row fails
 *   authentication instead of decrypting into the wrong account.
 *
 *   Node's documentation, as read 2026-11-05: setAAD() "must be called
 *   before cipher.update()"; getAuthTag() "should only be called after
 *   encryption has been completed using the cipher.final() method"; and on
 *   decrypt, "if the cipher text has been tampered with, decipher.final()
 *   will throw". The tag is always 16 bytes and passed as authTagLength,
 *   because Node 26 refuses other GCM tag lengths without it.
 *
 *   Rotation: add the new key to `keys`, make it active, and call rewrap on
 *   each row as it is read (or in a sweep). Old keys stay in `keys` until
 *   needsRewrap is false everywhere; then delete them.
 *
 * PAGES THIS SUPPORTS
 *   https://aifitnessapi.com/cookbook/refresh-rotation (what goes in the vault)
 *   https://aifitnessapi.com/integrate/withings-api
 *   https://aifitnessapi.com/integrate/polar-api
 *
 * Keys come from your secret store, never from this repository. No
 * dependencies. Node 20+.
 *
 * MIT — from aifitnessapi.com/cookbook
 */
import { createCipheriv, createDecipheriv, randomBytes as nodeRandomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const VERSION = "tv1";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;
const KEY_ID = /^[A-Za-z0-9_-]{1,32}$/;

export class TokenVaultError extends Error {
  constructor(reason, message) {
    super(message ?? reason);
    this.name = "TokenVaultError";
    /** "malformed" | "unknown-key" | "auth-failed" */
    this.reason = reason;
  }
}

const b64u = (buf) => Buffer.from(buf).toString("base64url");
const unb64u = (s) => Buffer.from(s, "base64url");

function contextBytes(context) {
  if (context == null) throw new TypeError("a context is required: pass what identifies the row (e.g. user id, vendor, field)");
  return Buffer.from(typeof context === "string" ? context : JSON.stringify(context), "utf8");
}

/**
 * @param {{ keys: Record<string, Buffer|Uint8Array>, activeKeyId: string, randomBytes?: (n: number) => Buffer }} opts
 */
export function createTokenVault({ keys, activeKeyId, randomBytes = nodeRandomBytes }) {
  const table = new Map();
  for (const [id, key] of Object.entries(keys ?? {})) {
    if (!KEY_ID.test(id)) throw new TypeError(`key id "${id}" must be 1-32 characters of A-Z a-z 0-9 _ -`);
    if (!key || key.length !== KEY_BYTES) throw new TypeError(`key "${id}" must be ${KEY_BYTES} bytes for ${ALGORITHM}`);
    table.set(id, Buffer.from(key));
  }
  if (!table.has(activeKeyId)) throw new TypeError(`activeKeyId "${activeKeyId}" is not in keys`);

  function seal(plaintext, context) {
    if (typeof plaintext !== "string") throw new TypeError("plaintext must be a string");
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, table.get(activeKeyId), iv, { authTagLength: TAG_BYTES });
    cipher.setAAD(contextBytes(context));
    const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [VERSION, activeKeyId, b64u(iv), b64u(tag), b64u(ct)].join(".");
  }

  function parse(sealed) {
    const parts = typeof sealed === "string" ? sealed.split(".") : [];
    if (parts.length !== 5 || parts[0] !== VERSION) throw new TokenVaultError("malformed", "not a tv1 sealed value");
    const [, keyId, iv, tag, ct] = parts;
    const ivBuf = unb64u(iv);
    const tagBuf = unb64u(tag);
    if (ivBuf.length !== IV_BYTES || tagBuf.length !== TAG_BYTES) throw new TokenVaultError("malformed", "bad IV or tag length");
    return { keyId, iv: ivBuf, tag: tagBuf, ct: unb64u(ct) };
  }

  function open(sealed, context) {
    const { keyId, iv, tag, ct } = parse(sealed);
    const key = table.get(keyId);
    if (!key) throw new TokenVaultError("unknown-key", `no key "${keyId}": was it deleted before every row was rewrapped?`);
    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_BYTES });
    decipher.setAAD(contextBytes(context));
    decipher.setAuthTag(tag);
    try {
      return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
    } catch {
      throw new TokenVaultError("auth-failed", "authentication failed: wrong key, wrong context, or tampered ciphertext");
    }
  }

  function needsRewrap(sealed) {
    return parse(sealed).keyId !== activeKeyId;
  }

  function rewrap(sealed, context) {
    return needsRewrap(sealed) ? seal(open(sealed, context), context) : sealed;
  }

  /** Seal every token field of a grant; non-secret fields stay readable. */
  function sealGrant(grant, context, secretFields = ["access_token", "refresh_token"]) {
    const out = { ...grant };
    for (const f of secretFields) if (typeof grant[f] === "string") out[f] = seal(grant[f], { ...ctxObject(context), field: f });
    return out;
  }

  function openGrant(row, context, secretFields = ["access_token", "refresh_token"]) {
    const out = { ...row };
    for (const f of secretFields) if (typeof row[f] === "string") out[f] = open(row[f], { ...ctxObject(context), field: f });
    return out;
  }

  return { seal, open, needsRewrap, rewrap, sealGrant, openGrant, activeKeyId };
}

function ctxObject(context) {
  return typeof context === "string" ? { context } : { ...context };
}

/** A fresh 32-byte key, for your secret store's setup script. */
export function generateKey(randomBytes = nodeRandomBytes) {
  return randomBytes(KEY_BYTES);
}
