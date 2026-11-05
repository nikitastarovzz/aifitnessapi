/**
 * Reading a local Apple Health export (export.zip or export.xml) as a text
 * stream, chunk by chunk, for /tools/apple-health-explorer.
 *
 * Shared by the page's Web Worker and its main-thread fallback. Uses only
 * Blob.slice/stream, DecompressionStream("deflate-raw") and TextDecoder, all
 * built into current browsers (and Node, where the tests run it), so the
 * explorer adds no dependency and nothing leaves the machine.
 */
import { createScanner, listZipEntries, pickExportXml } from "./appleHealthExport.mjs";

/** True when the first bytes are a ZIP local-file header ("PK\x03\x04"). */
export async function isZip(blob) {
  const b = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
  return b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
}

/**
 * Locate the XML bytes inside a picked file. For a ZIP, finds export.xml
 * through the central directory; only that entry is ever read.
 * Returns { raw, total, method, entryName }: raw is the stream of file bytes
 * (deflated when method is 8), total its length for progress.
 */
export async function locateExportXml(blob) {
  if (!(await isZip(blob))) {
    return { raw: blob.stream(), total: blob.size, method: 0, entryName: blob.name ?? "export.xml" };
  }
  const readAt = async (offset, length) => new Uint8Array(await blob.slice(offset, offset + length).arrayBuffer());
  const entry = pickExportXml(await listZipEntries(readAt, blob.size));
  if (!entry) {
    throw new Error("This ZIP has no file named export.xml. Pick the export.zip the Health app made, or the export.xml inside it.");
  }
  if (entry.method !== 0 && entry.method !== 8) {
    throw new Error(`export.xml is stored with ZIP method ${entry.method}; this reader handles stored and deflate only. Unzip it and pick export.xml.`);
  }
  if (entry.method === 8 && typeof DecompressionStream === "undefined") {
    throw new Error("This browser cannot unzip in the page (no DecompressionStream). Unzip export.zip first and pick export.xml.");
  }
  const raw = blob.slice(entry.dataOffset, entry.dataOffset + entry.compressedSize).stream();
  return { raw, total: entry.compressedSize, method: entry.method, entryName: entry.name };
}

/**
 * Stream the export through consumers ({ add(name, attrs) }).
 * onProgress(fraction 0..1) follows the bytes read from the picked file.
 * Returns { elements, leftover, entryName }.
 */
export async function scanExport(blob, consumers, onProgress) {
  const { raw, total, method, entryName } = await locateExportXml(blob);
  let seen = 0;
  const counted = raw.pipeThrough(
    new TransformStream({
      transform(chunk, ctl) {
        seen += chunk.byteLength;
        onProgress?.(total ? Math.min(1, seen / total) : 0);
        ctl.enqueue(chunk);
      },
    }),
  );
  const bytes = method === 8 ? counted.pipeThrough(new DecompressionStream("deflate-raw")) : counted;
  const scanner = createScanner((name, attrs) => {
    for (const c of consumers) c.add(name, attrs);
  });
  const reader = bytes.getReader();
  const dec = new TextDecoder("utf-8");
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    scanner.push(dec.decode(value, { stream: true }));
  }
  scanner.push(dec.decode());
  const stats = scanner.end();
  onProgress?.(1);
  return { ...stats, entryName };
}
