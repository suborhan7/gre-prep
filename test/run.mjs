// Local checks: API handlers against an in-memory Blob store, merge logic, and a fake Anthropic API.
// Run with: npm test
import http from "node:http";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { __setStorage } from "../api/_lib/store.js";
import { mergeAll as serverMerge } from "../api/_lib/merge.js";
import auth from "../api/auth.js";
import progress from "../api/progress.js";
import ai from "../api/ai.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---- in-memory private Blob store ----
const blobs = new Map();
__setStorage({
  async put(p, body, opts) {
    assert.equal(opts.access, "private");
    if (blobs.has(p) && !opts.allowOverwrite) throw new Error("exists");
    blobs.set(p, String(body));
    return { pathname: p };
  },
  async get(p) {
    if (!blobs.has(p)) return null;
    return { statusCode: 200, stream: new Response(blobs.get(p)).body };
  },
  async list({ prefix, limit }) {
    return { blobs: [...blobs.keys()].filter((k) => k.startsWith(prefix)).slice(0, limit).map((pathname) => ({ pathname })) };
  },
  async del(p) {
    blobs.delete(p);
  },
});

// ---- fake Anthropic API ----
const realFetch = globalThis.fetch;
let lastAnthropicBody = null;
globalThis.fetch = async (url, opts) => {
  if (String(url).startsWith("https://api.anthropic.com/")) {
    const b = JSON.parse(opts.body);
    lastAnthropicBody = b;
    assert.equal(opts.headers["anthropic-version"], "2023-06-01");
    if (!b.stream) {
      return new Response(JSON.stringify({ content: [{ type: "text", text: 'Here you go: {"score": 4.5, "summary": "Good."}' }] }), { status: 200 });
    }
    const events = [
      { type: "message_start" },
      { type: "content_block_delta", delta: { type: "text_delta", text: "Hello " } },
      { type: "content_block_delta", delta: { type: "text_delta", text: "student" } },
      { type: "message_stop" },
    ].map((e) => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join("");
    return new Response(events, { status: 200 });
  }
  return realFetch(url, opts);
};

// ---- tiny local server (static files + /api routes) ----
const routes = { "/api/auth": auth, "/api/progress": progress, "/api/ai": ai };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (routes[url.pathname]) {
    let raw = "";
    for await (const c of req) raw += c;
    req.body = raw ? JSON.parse(raw) : {};
    return routes[url.pathname](req, res);
  }
  const file = path.join(root, url.pathname === "/" ? "index.html" : url.pathname);
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.statusCode = 404;
    return res.end("not found");
  }
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const call = async (p, { method = "GET", body, token } = {}) => {
  const r = await realFetch(base + p, {
    method,
    headers: { "content-type": "application/json", ...(token ? { authorization: "Bearer " + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: r.status, json, text };
};

let passed = 0;
const ok = (name) => {
  passed++;
  console.log("  ✓", name);
};

// ---- accounts ----
let r = await call("/api/auth");
assert.equal(r.json.signupOpen, true);
ok("sign-up open on a fresh deployment");
r = await call("/api/auth", { method: "POST", body: { action: "signup", username: "Ab", password: "longenough" } });
assert.equal(r.status, 400);
ok("rejects bad username");
r = await call("/api/auth", { method: "POST", body: { action: "signup", username: "suborhan", password: "short" } });
assert.equal(r.status, 400);
ok("rejects short password");
r = await call("/api/auth", { method: "POST", body: { action: "signup", username: "Suborhan", password: "correct horse 1" } });
assert.equal(r.status, 200);
const t1 = r.json.token;
assert.equal(r.json.username, "suborhan");
ok("owner account created (username lowercased)");
const stored = JSON.parse(blobs.get("users/suborhan.json"));
assert.ok(stored.hash && stored.salt && !JSON.stringify(stored).includes("correct horse"));
ok("password stored only as a salted hash");
r = await call("/api/auth", { method: "POST", body: { action: "signup", username: "stranger", password: "password123" } });
assert.equal(r.status, 403);
ok("second sign-up blocked without invite code");
process.env.SIGNUP_CODE = "let-me-in";
r = await call("/api/auth", { method: "POST", body: { action: "signup", username: "friend", password: "password123", code: "let-me-in" } });
assert.equal(r.status, 200);
delete process.env.SIGNUP_CODE;
ok("invite code lets a friend sign up");
r = await call("/api/auth", { method: "POST", body: { action: "login", username: "suborhan", password: "wrong password" } });
assert.equal(r.status, 401);
ok("wrong password rejected");
r = await call("/api/auth", { method: "POST", body: { action: "login", username: "suborhan", password: "correct horse 1" } });
assert.equal(r.status, 200);
const t2 = r.json.token;
ok("login works (second device)");

// ---- progress sync ----
r = await call("/api/progress");
assert.equal(r.status, 401);
ok("progress requires login");
r = await call("/api/progress", { token: t1 });
assert.equal(r.json.data, null);
ok("empty progress for new account");
const phone = {
  S: { start: "2026-10-29", done: { w1t0: 1000 }, lessons: { s1: 1000 }, att: { "q1-1": { n: 1, c: 1, ok: true, t: 1000 } }, vocab: { abate: { b: 1, d: "2026-10-30", t: 1000 } }, mocks: [], days: ["2026-10-29"], lang: "en", langT: 0 },
  errors: [{ src: "OG p.1", ts: 1 }],
  essays: [],
};
r = await call("/api/progress", { method: "PUT", token: t1, body: { data: phone } });
assert.equal(r.status, 200);
ok("phone pushes progress");
const laptop = {
  S: { start: "2026-10-30", done: { w1t0: -2000, w1t1: 2000 }, lessons: {}, att: { "q2-1": { n: 1, c: 0, ok: false, t: 2000 } }, vocab: { abate: { b: 2, d: "2026-11-02", t: 2000 } }, mocks: [{ d: "2026-10-30", sec: "quant", n: 12, c: 9, secs: 1200, t: 2000 }], days: ["2026-10-30"], lang: "bn", langT: 2000 },
  errors: [{ src: "PP1 #4", ts: 2 }],
  essays: [{ ts: 5, u: 5, text: "draft" }],
};
r = await call("/api/progress", { method: "PUT", token: t2, body: { data: laptop } });
const m = r.json.data;
assert.equal(m.S.start, "2026-10-29");
assert.equal(m.S.done.w1t0, -2000);
assert.equal(m.S.done.w1t1, 2000);
assert.ok(m.S.lessons.s1 > 0);
assert.ok(m.S.att["q1-1"] && m.S.att["q2-1"]);
assert.equal(m.S.vocab.abate.b, 2);
assert.equal(m.S.mocks.length, 1);
assert.deepEqual(m.S.days, ["2026-10-29", "2026-10-30"]);
assert.equal(m.S.lang, "bn");
assert.equal(m.errors.length, 2);
assert.equal(m.essays.length, 1);
ok("laptop push merges with phone data (nothing lost, latest change wins)");
r = await call("/api/progress", { token: t1 });
assert.deepEqual(r.json.data, m);
ok("phone pulls the merged copy");
r = await call("/api/progress", { method: "PUT", token: t1, body: { data: { essays: [{ ts: 5, u: 9, text: "final", feedback: { score: 4 } }] } } });
assert.equal(r.json.data.essays[0].text, "final");
ok("an edited essay replaces its older copy");

// ---- browser merge matches server merge ----
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "js/merge.js"), "utf8"), ctx);
assert.deepEqual(JSON.parse(JSON.stringify(ctx.window.GREMerge.mergeAll(phone, laptop))), JSON.parse(JSON.stringify(serverMerge(phone, laptop))));
ok("browser and server merge give identical results");

// ---- AI ----
r = await call("/api/ai");
assert.equal(r.json.enabled, false);
r = await call("/api/ai", { method: "POST", token: t1, body: { messages: [{ role: "user", content: "hi" }] } });
assert.equal(r.status, 501);
ok("AI reports off without a key");
process.env.ANTHROPIC_API_KEY = "test-key";
r = await call("/api/ai", { method: "POST", body: { messages: [{ role: "user", content: "hi" }] } });
assert.equal(r.status, 401);
ok("AI requires login");
r = await call("/api/ai", { method: "POST", token: t1, body: { system: "be a tutor", messages: [{ role: "assistant", content: "x" }, { role: "user", content: "Explain QC" }] } });
assert.equal(r.text, "Hello student");
assert.equal(lastAnthropicBody.messages[0].role, "user");
assert.equal(lastAnthropicBody.system, "be a tutor");
ok("AI streams text and the conversation starts with the student");
r = await call("/api/ai", { method: "POST", token: t1, body: { json: true, messages: [{ role: "user", content: "score" }] } });
assert.equal(r.json.result.score, 4.5);
ok("AI JSON mode parses a reply with extra words around it");
process.env.AI_DAILY_LIMIT = "0";
// limit is read at import; simulate by filling usage
blobs.set(`ai-usage/suborhan-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ n: 9999 }));
r = await call("/api/ai", { method: "POST", token: t1, body: { messages: [{ role: "user", content: "hi" }] } });
assert.equal(r.status, 429);
ok("daily AI limit enforced");

// ---- logout ----
r = await call("/api/auth", { method: "POST", token: t2, body: { action: "logout" } });
r = await call("/api/progress", { token: t2 });
assert.equal(r.status, 401);
ok("logout ends that device's session only");
r = await call("/api/progress", { token: t1 });
assert.equal(r.status, 200);

// ---- static files the app needs ----
for (const f of ["/", "/styles.css", "/js/app.js", "/js/merge.js", "/sw.js", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/maskable-512.png", "/icons/apple-touch-icon.png", "/icons/favicon-32.png"]) {
  r = await realFetch(base + f);
  assert.equal(r.status, 200, f);
}
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
for (const f of JSON.parse(sw.match(/const SHELL = (\[[\s\S]*?\]);/)[1].replace(/,\s*\]/, "]"))) {
  r = await realFetch(base + f);
  assert.equal(r.status, 200, "service worker shell file missing: " + f);
}
ok("every file the service worker caches exists");

server.close();
console.log(`\n${passed} checks passed`);
export { base };
