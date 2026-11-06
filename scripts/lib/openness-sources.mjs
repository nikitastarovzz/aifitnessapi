/**
 * Loads the modules the openness index is derived from, for
 * scripts/openness-index.test.mjs and qa's OPENNESS-* gates: the same
 * arguments src/lib/openness.ts passes to deriveOpenness at build time.
 * The .ts modules have no imports, so Node loads them with type stripping.
 */
export async function loadOpennessSources() {
  const at = (p) => new URL(`../../${p}`, import.meta.url);
  const [oauth, payloads, verifier, rl, ghapi] = await Promise.all([
    import(at("src/data/oauthVendors.ts")),
    import(at("src/data/webhookPayloads.ts")),
    import(at("src/lib/webhookVerifier.mjs")),
    import(at("src/lib/rateLimitCalc.mjs")),
    import(at("src/data/googleHealthApi.ts")),
  ]);
  return {
    oauth: oauth.OAUTH_VENDORS,
    oauthSources: oauth.OAUTH_SOURCES,
    webhooks: payloads.WEBHOOK_VENDORS,
    webhookSources: payloads.WEBHOOK_SOURCES,
    verifierKinds: Object.fromEntries(verifier.WEBHOOK_VENDORS.map((v) => [v.id, v.kind])),
    rateLimits: rl.RATE_LIMIT_VENDORS,
    rateNotDocumented: rl.NOT_DOCUMENTED,
    ghapi: { rateLimits: ghapi.GHAPI_RATE_LIMITS, sources: ghapi.GHAPI_SOURCES },
  };
}
