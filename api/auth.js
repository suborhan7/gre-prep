// Accounts: sign up, log in, log out. GET reports whether sign-up is open and whether AI is on.
import {
  readJSON, writeJSON, hasAnyUser, USERNAME_RE, hashPassword, checkPassword,
  createSession, endSession, bearer, body, send,
} from "./_lib/store.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const code = !!process.env.SIGNUP_CODE;
      const open = !(await hasAnyUser());
      return send(res, 200, { signupOpen: open, inviteOnly: !open && code, ai: !!process.env.ANTHROPIC_API_KEY });
    }
    if (req.method !== "POST") return send(res, 405, { error: "Use POST." });

    const b = body(req);
    const action = String(b.action || "");

    if (action === "logout") {
      await endSession(bearer(req));
      return send(res, 200, { ok: true });
    }

    const username = String(b.username || "").trim().toLowerCase();
    const password = String(b.password || "");
    if (!USERNAME_RE.test(username)) {
      return send(res, 400, { error: "Username must be 3–24 characters: lowercase letters, numbers or _." });
    }
    if (password.length < 8 || password.length > 200) {
      return send(res, 400, { error: "Password must be at least 8 characters." });
    }

    if (action === "signup") {
      const anyUser = await hasAnyUser();
      const code = process.env.SIGNUP_CODE;
      if (anyUser && !(code && String(b.code || "") === code)) {
        return send(res, 403, {
          error: code
            ? "Sign-up needs the invite code set in this app's Vercel settings."
            : "Sign-up is closed: this app already has its owner account. Log in instead.",
        });
      }
      if (await readJSON(`users/${username}.json`)) {
        return send(res, 409, { error: "That username is taken. Log in instead, or pick another." });
      }
      const { salt, hash } = hashPassword(password);
      await writeJSON(`users/${username}.json`, { u: username, salt, hash, created: Date.now() });
      const token = await createSession(username);
      return send(res, 200, { token, username });
    }

    if (action === "login") {
      const user = await readJSON(`users/${username}.json`);
      if (!user || !checkPassword(password, user.salt, user.hash)) {
        return send(res, 401, { error: "Wrong username or password." });
      }
      const token = await createSession(username);
      return send(res, 200, { token, username });
    }

    return send(res, 400, { error: "Unknown action." });
  } catch (e) {
    console.error("auth error", e);
    return send(res, 500, { error: "Server error. If this is a new deployment, check that a private Blob store is connected." });
  }
}
