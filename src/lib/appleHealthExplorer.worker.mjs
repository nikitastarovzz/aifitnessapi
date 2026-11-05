/**
 * Web Worker for /tools/apple-health-explorer. Receives the File the user
 * picked (a structured clone of the local file handle, not an upload) and
 * runs the streaming scan off the main thread so a large export does not
 * freeze the page.
 *
 *   { id, cmd: "scan", file }              → progress…, then { id, ok, summary }
 *   { id, cmd: "csv", file, type, kind }   → progress…, then { id, ok, rows, blob }
 */
import { createAggregator, createCsvCollector } from "./appleHealthExport.mjs";
import { scanExport } from "./appleHealthRead.mjs";

self.onmessage = async (ev) => {
  const { id, cmd, file } = ev.data;
  const progress = (fraction) => self.postMessage({ id, progress: fraction });
  try {
    if (cmd === "scan") {
      const agg = createAggregator();
      const stats = await scanExport(file, [agg], progress);
      self.postMessage({ id, ok: true, summary: { ...agg.result(), ...stats } });
    } else if (cmd === "csv") {
      const col = createCsvCollector(ev.data.type, ev.data.kind);
      await scanExport(file, [col], progress);
      const { rows, chunks } = col.result();
      self.postMessage({ id, ok: true, rows, blob: new Blob(chunks, { type: "text/csv" }) });
    }
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err?.message ?? err) });
  }
};
