// Study data sync. GET returns the saved copy; PUT merges the device's copy into it and returns the result.
import { readJSON, writeJSON, userFrom, body, send } from "./_lib/store.js";
import { mergeAll } from "./_lib/merge.js";

const MAX_BYTES = 900 * 1024;

export default async function handler(req, res) {
  try {
    const u = await userFrom(req);
    if (!u) return send(res, 401, { error: "Please log in again." });
    const path = `data/${u}.json`;

    if (req.method === "GET") {
      const doc = await readJSON(path);
      return send(res, 200, { data: doc ? doc.data : null, updated: doc ? doc.updated : 0 });
    }

    if (req.method === "PUT") {
      const b = body(req);
      if (!b.data || typeof b.data !== "object") return send(res, 400, { error: "Missing data." });
      if (JSON.stringify(b.data).length > MAX_BYTES) return send(res, 413, { error: "Data too large. Delete some old essays." });
      const cur = await readJSON(path);
      const merged = mergeAll(cur ? cur.data : null, b.data);
      const updated = Date.now();
      await writeJSON(path, { data: merged, updated });
      return send(res, 200, { data: merged, updated });
    }

    return send(res, 405, { error: "Use GET or PUT." });
  } catch (e) {
    console.error("progress error", e);
    return send(res, 500, { error: "Server error while syncing." });
  }
}
