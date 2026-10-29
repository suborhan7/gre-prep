# GRE Prep Hub

A 12-week GRE course as an installable web app: 18 lessons, 155 practice questions (32 hard Quant), 600-word spaced-repetition vocabulary, timed sections, Issue essay practice, a mistakes log and an AI tutor. Tuned for a CS background: Quant 166+, Verbal 155+.

## How it works

- **Frontend:** plain HTML, CSS and JavaScript (`index.html`, `styles.css`, `js/`). No build step.
- **Installable (PWA):** `manifest.webmanifest` + `sw.js`. Lessons, vocab and practice work offline.
- **Backend:** Vercel Functions in `api/`.
  - `api/auth.js` — accounts (username + password, salted scrypt hash), session tokens
  - `api/progress.js` — syncs progress between devices; merges phone and laptop changes so nothing is lost
  - `api/ai.js` — AI tutor proxy to the Anthropic API, with a per-user daily limit
- **Storage:** a private Vercel Blob store (accounts, sessions, study data).

## Setup on Vercel

1. Import this repo as a Vercel project (framework preset: Other, no build command).
2. Storage → create a **Blob** store with **Private** access and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.
3. Redeploy. Open the site → Account → create your account. The first account becomes the owner and sign-up then closes.

### Optional environment variables

| Variable | What it does |
| --- | --- |
| `ANTHROPIC_API_KEY` | Turns on the in-app AI tutor, "Explain it another way" and essay scoring. Without it, those buttons open the Claude app with the question filled in. API usage is billed by Anthropic. |
| `AI_MODEL` | Model for the tutor. Default `claude-sonnet-5-5`. `claude-haiku-5-5` is cheaper. |
| `AI_DAILY_LIMIT` | AI requests per user per day. Default 80. |
| `SIGNUP_CODE` | Lets other people create accounts if they enter this code. |

## Install on your devices

- **Android (Chrome):** open the site → Account → Install, or menu ⋮ → Install app.
- **iPhone (Safari):** Share → Add to Home Screen.
- **Laptop (Chrome/Edge):** install icon in the address bar.

## Develop

```bash
npm install
npm test   # API, sync merge and AI checks against an in-memory store
```

When you change app files, bump `VERSION` in `sw.js` so installed copies update.
