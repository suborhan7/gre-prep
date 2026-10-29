// Private Vercel Blob storage for accounts, sessions and study data.
import { put, get, list, del } from "@vercel/blob";
import crypto from "node:crypto";

let impl = { put, get, list, del };
export function __setStorage(x) {
  impl = x; // used by tests to swap in an in-memory store
}

const ACCESS = "private";

export async function readJSON(pathname) {
  let r;
  try {
    r = await impl.get(pathname, { access: ACCESS, useCache: false });
  } catch (e) {
    if (/not.?found/i.test(String(e && (e.name || e.message)))) return null;
    throw e;
  }
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  const text = await new Response(r.stream).text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function writeJSON(pathname, obj) {
  await impl.put(pathname, JSON.stringify(obj), {
    access: ACCESS,
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function remove(pathname) {
  try {
    await impl.del(pathname);
  } catch {
    /* already gone */
  }
}

export async function hasAnyUser() {
  const r = await impl.list({ prefix: "users/", limit: 1 });
  return (r.blobs || []).length > 0;
}

export const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function checkPassword(password, salt, hash) {
  const h = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === h.length && crypto.timingSafeEqual(h, expected);
}

const sha = (t) => crypto.createHash("sha256").update(t).digest("hex");

export async function createSession(username) {
  const token = crypto.randomBytes(32).toString("base64url");
  await writeJSON(`sessions/${sha(token)}.json`, { u: username, created: Date.now() });
  return token;
}

export async function endSession(token) {
  if (token) await remove(`sessions/${sha(token)}.json`);
}

export function bearer(req) {
  const h = req.headers.authorization || req.headers.Authorization || "";
  const m = /^Bearer\s+([A-Za-z0-9_-]{20,100})$/.exec(h);
  return m ? m[1] : null;
}

// Returns the signed-in username, or null.
export async function userFrom(req) {
  const token = bearer(req);
  if (!token) return null;
  const s = await readJSON(`sessions/${sha(token)}.json`);
  if (!s || !USERNAME_RE.test(s.u || "")) return null;
  if (Date.now() - (s.created || 0) > 1000 * 60 * 60 * 24 * 365) return null;
  return s.u;
}

export function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

export function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
