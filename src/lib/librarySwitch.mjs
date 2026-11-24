/**
 * "Switching libraries?" on the /libraries framework hubs: what a move from
 * one wrapper library to another keeps, loses and gains, per store, from the
 * generated src/data/healthLibrarySupport.ts. Pure functions, shared by the
 * server (which compacts the data) and the client picker
 * (src/components/LibrarySwitchPicker.tsx); tests in
 * scripts/library-switch.test.mjs.
 *
 * Nothing is added to the dataset. A type counts for a library exactly when
 * the generator found it in that library's read files, so "lose" means "the
 * files read for the other library do not name it", which is how the
 * per-library pages and /libraries/compare word it too.
 */

/** @typedef {"healthkit" | "healthConnect"} Store */

/**
 * Compact the libraries for the client: per library its files and, per
 * store, [type id, file index, line]; one shared dictionary of types.
 *
 * @param {any[]} libraries  rows of HEALTH_LIBRARY_SUPPORT
 * @param {(item: { store: Store, id: string, name: string }) => string} pathFor  this site's page for a type
 */
export function compactLibraries(libraries, pathFor) {
  const types = {};
  const libs = libraries.map((l) => {
    const files = [];
    const fileIndex = (p) => {
      let i = files.indexOf(p);
      if (i < 0) {
        files.push(p);
        i = files.length - 1;
      }
      return i;
    };
    const items = {};
    for (const store of ["healthkit", "healthConnect"]) {
      items[store] = l[store].map((it) => {
        if (!types[it.id]) types[it.id] = { s: store, n: it.name, p: pathFor(it) };
        return [it.id, fileIndex(it.path), it.line];
      });
    }
    return {
      slug: l.slug,
      name: l.name,
      group: l.group,
      stores: l.stores,
      ref: l.ref.kind === "tag" ? `tag ${l.ref.tag}` : `default-branch head ${l.ref.sha.slice(0, 12)}`,
      readOn: l.ref.readOn,
      blob: `${l.repoUrl}/blob/${l.ref.sha}/`,
      files,
      items,
    };
  });
  return { libs, types };
}

/** The GitHub URL of an item's source line, as the dataset's own `url` field writes it. */
export function lineUrl(lib, item) {
  return `${lib.blob}${lib.files[item[1]]}#L${item[2]}`;
}

/**
 * Keep / lose / gain per store, moving from `from` to `to`.
 * A store only one of the two reads is all loss or all gain, and says so.
 */
export function switchDiff(from, to) {
  const out = [];
  for (const store of ["healthkit", "healthConnect"]) {
    const a = from.stores.includes(store);
    const b = to.stores.includes(store);
    if (!a && !b) continue;
    const inTo = new Map((b ? to.items[store] : []).map((i) => [i[0], i]));
    const inFrom = new Set((a ? from.items[store] : []).map((i) => i[0]));
    const fromItems = a ? from.items[store] : [];
    const toItems = b ? to.items[store] : [];
    out.push({
      store,
      fromReads: a,
      toReads: b,
      keep: fromItems.filter((i) => inTo.has(i[0])).map((i) => ({ id: i[0], from: i, to: inTo.get(i[0]) })),
      lose: fromItems.filter((i) => !inTo.has(i[0])).map((i) => ({ id: i[0], from: i, to: null })),
      gain: toItems.filter((i) => !inFrom.has(i[0])).map((i) => ({ id: i[0], from: null, to: i })),
    });
  }
  return out;
}
