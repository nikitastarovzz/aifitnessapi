/**
 * Compile-time contract for the client's types. Nothing here runs: the file
 * passes the type checker or the test fails (test/run.mjs compiles it with the
 * package, and the site's `npx tsc --noEmit` includes it too).
 */
import { createClient, type CollectionPath, type Collections, type HealthkitType, type VendorDetail } from "../src/index.js";

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
function expectType<T extends true>(_: T): void {}

const client = createClient({ fetch: async () => ({ ok: true, status: 200, json: async () => ({}) }) });

export async function contract(): Promise<void> {
  // list() returns the collection envelope, whose items are the row type.
  const types = await client.list("healthkit/types");
  expectType<Equal<(typeof types.items)[number], HealthkitType>>(true);
  // The id field is a string, never null.
  expectType<Equal<HealthkitType["identifier"], string>>(true);

  // get() returns the item envelope; vendors add detail fields.
  const vendor = await client.get("vendors", "oura");
  expectType<Equal<typeof vendor.item, VendorDetail>>(true);

  // find() can return null.
  const maybe = await client.find("glossary", "rmssd");
  expectType<Equal<typeof maybe, Collections["glossary"]["response"] | null>>(true);

  // keyOf() is the literal key.
  expectType<Equal<ReturnType<typeof client.keyOf<"health-connect/records">>, "className">>(true);

  // An unknown collection is a type error.
  // @ts-expect-error "healthkit/typo" is not a collection
  await client.list("healthkit/typo");

  const p: CollectionPath = "matrix";
  void p;
}
