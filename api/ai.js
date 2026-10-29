// AI tutor proxy. Uses ANTHROPIC_API_KEY when it is set in Vercel; otherwise the app hands questions to the Claude app.
import { readJSON, writeJSON, userFrom, body, send } from "./_lib/store.js";

const MODEL = process.env.AI_MODEL || "claude-sonnet-5-5";
const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 80);
const MAX_CHARS = 60000;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function cleanMessages(list) {
  if (!Array.isArray(list)) return null;
  const msgs = list
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 20000) }));
  // The conversation must start and end with the student.
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  // Merge consecutive turns from the same side.
  const out = [];
  for (const m of msgs) {
    if (out.length && out[out.length - 1].role === m.role) out[out.length - 1].content += "\n\n" + m.content;
    else out.push({ ...m });
  }
  return out;
}

function parseJSONLoose(text) {
  try {
    return JSON.parse(text);
  } catch {}
  const fence = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  if (fence) {
    try {
      return JSON.parse(fence[1]);
    } catch {}
  }
  const i = text.indexOf("{"), j = text.lastIndexOf("}");
  if (i >= 0 && j > i) {
    try {
      return JSON.parse(text.slice(i, j + 1));
    } catch {}
  }
  return null;
}

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === "GET") return send(res, 200, { enabled: !!key });
  if (req.method !== "POST") return send(res, 405, { error: "Use POST." });

  try {
    const u = await userFrom(req);
    if (!u) return send(res, 401, { error: "Please log in to use the AI tutor." });
    if (!key) return send(res, 501, { error: "ai_disabled" });

    const b = body(req);
    const messages = cleanMessages(b.messages);
    if (!messages) return send(res, 400, { error: "The message list must end with your question." });
    const system = typeof b.system === "string" ? b.system.slice(0, 8000) : undefined;
    const total = messages.reduce((n, m) => n + m.content.length, 0) + (system ? system.length : 0);
    if (total > MAX_CHARS) return send(res, 413, { error: "That's too long for one request. Shorten it and try again." });

    const usagePath = `ai-usage/${u}-${today()}.json`;
    const usage = (await readJSON(usagePath)) || { n: 0 };
    if (usage.n >= DAILY_LIMIT) return send(res, 429, { error: `Daily AI limit reached (${DAILY_LIMIT}). It resets tomorrow.` });
    await writeJSON(usagePath, { n: usage.n + 1 });

    const wantJSON = !!b.json;
    const payload = {
      model: MODEL,
      max_tokens: Math.min(Number(b.max_tokens) || 1200, 2000),
      messages,
      ...(system ? { system } : {}),
      ...(wantJSON ? {} : { stream: true }),
    };
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("anthropic error", r.status, detail.slice(0, 500));
      const msg = r.status === 401 ? "The AI key in Vercel is invalid." : r.status === 429 ? "The AI service is busy. Try again in a minute." : "The AI service returned an error.";
      return send(res, 502, { error: msg });
    }

    if (wantJSON) {
      const data = await r.json();
      const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
      const parsed = parseJSONLoose(text);
      if (!parsed) return send(res, 502, { error: "The AI reply wasn't in the expected format. Try again." });
      return send(res, 200, { result: parsed });
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line.startsWith("data:")) continue;
        const json = line.slice(5).trim();
        if (!json || json === "[DONE]") continue;
        try {
          const ev = JSON.parse(json);
          if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") res.write(ev.delta.text);
        } catch {}
      }
    }
    res.end();
  } catch (e) {
    console.error("ai error", e);
    if (!res.headersSent) return send(res, 500, { error: "Server error in the AI tutor." });
    res.end();
  }
}
