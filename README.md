# ChemPrep — JEE Chemistry prep planner

An interactive study planner for Class 11–12 JEE aspirants. Built by a chemistry teacher who watched too many good students drown in backlogs. Every AI response runs through a senior-mentor system prompt — Indian-English, direct, no fluff, focused on traps and practice.

**Stack:** Vite + React 18, Tailwind CSS 3, Recharts, lucide-react, jsPDF + html2canvas. localStorage state. Dark / light / system theme. Mobile-first.

## Features

- **Syllabus tracker** — 32 JEE Chemistry topics (physical / organic / inorganic) with weightage, subtopics, and a mentor "trap" warning per topic.
- **Smart planner** — weekly grid + daily logs for studied minutes and screen time. AI-drafted week based on your pending topics and backlogs.
- **Flashcards** — AI-generated, SM-2 spaced-repetition scheduling. Due-now counter on the dashboard.
- **Quiz (active recall)** — AI-generated JEE Main / Advanced MCQs per topic with explanations; history stored.
- **Formulas + PYQs** — curated formula sheet and previous-year-style questions for top chapters.
- **Study groups** — shareable invite code, weekly leaderboard (local demo).
- **AI tutor** — chat with context, **image-doubt solving** via Gemini vision.
- **Reports** — weekly PDF export (charts + mentor note).
- **Settings** — profile, AI provider (Gemini / Groq / Anthropic), theme, export/import/reset.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:5173
```

For a production build:

```bash
npm run build
npm run preview
```

## AI setup (free!)

Google slashed Gemini's free tier by ~70% in December 2025 (Flash = 500/day, Pro = 100/day). So the recommended setup is now a **two-key split**:

1. **Groq** (primary — text) → <https://console.groq.com> → Create API key → paste into Settings.
   Llama 3.3 70B is excellent for JEE chemistry reasoning, very fast, generous free tier.
2. **Gemini** (optional — for image-doubt solving only) → <https://aistudio.google.com/apikey>.
   Vision is Gemini-exclusive in this app. You won't hit 500/day on photos alone.

### Alternative: OpenRouter (best reasoning, free)

One API key, access to 29 free models. **DeepSeek R1** on OpenRouter is the strongest free reasoning model available — arguably sharper than Gemini Flash for chemistry derivations.

1. Get a key at <https://openrouter.ai/keys>.
2. Settings → OpenRouter → paste key → pick `deepseek/deepseek-r1:free`.
3. Free tier: 20 req/min, 50 req/day. Top up $10 → 1,000 req/day across all free models.

### Paid fallback

- **Anthropic Claude** (highest quality, paid): <https://console.anthropic.com>.

## Deploy to Vercel (GitHub + Vercel)

The repo is already Vercel-ready. The four API routes in `/api` are serverless functions that keep your keys off the browser. Zero config needed beyond the env vars.

**1. Push to GitHub**

```bash
cd "Chemprep planner"
git init
git add .
git commit -m "Initial ChemPrep commit"
git branch -M main
git remote add origin https://github.com/<your-username>/chemprep.git
git push -u origin main
```

**2. Import on Vercel**

- Go to <https://vercel.com/new> → pick the repo → **Import**.
- Framework preset: **Vite** (auto-detected from `vercel.json`).
- Build command: `npm run build` (default). Output: `dist` (default).

**3. Add environment variables**

In Vercel → Project → **Settings → Environment Variables**, add any subset of:

| Key                  | Value                   | Required for                 |
|----------------------|-------------------------|------------------------------|
| `GROQ_API_KEY`       | `gsk_...`               | Groq text (primary)          |
| `OPENROUTER_API_KEY` | `sk-or-...`             | OpenRouter (DeepSeek R1)     |
| `GEMINI_API_KEY`     | `AIza...`               | Image doubts (vision)        |
| `ANTHROPIC_API_KEY`  | `sk-ant-...`            | Claude (paid, optional)      |

Apply them to Production, Preview, and Development. Redeploy after adding.

**4. Enable proxy mode in the deployed app**

Open the live URL → **Settings → Use backend proxy** (checkbox). The client will now call `/api/groq`, `/api/openrouter`, `/api/gemini`, `/api/anthropic` — keys never touch the browser.

### Local dev of the serverless functions

```bash
npm i -g vercel
vercel dev     # runs Vite + the /api functions together on http://localhost:3000
```

Or use the legacy Node proxy at `server/server.js` with `npm run start` — same endpoints, just runs on :8787 locally.

## Data & privacy

Everything is stored in `localStorage` under the key `chemprep:state:v2`. Use **Settings → Export / Import JSON** to back up or move between browsers. **Reset all data** wipes everything.

## File tree

```
chemprep/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ src/
│  ├─ main.jsx, App.jsx, index.css
│  ├─ components/ (Shell, Onboarding, UI)
│  ├─ views/ (Dashboard, Syllabus, Planner, Flashcards, Quiz, Formulas, Groups, Tutor, Reports, Settings)
│  ├─ lib/ (storage, theme, srs, ai)
│  └─ data/ (syllabus, formulas)
└─ server/ (optional proxy)
```

## Mentor voice

All AI prompts route through a system instruction that gives the model this persona:

> A senior JEE Chemistry mentor with 20 years at a top coaching institute. Indian-English. Direct. No fluff. Treats the student as capable. Gives the concept, then the trap, then a practice pointer. Addresses stress, phone addiction, and sleep before chemistry when the student raises them.

This is why every response ends with a practice pointer and watches for common JEE traps. The mentor has no name on purpose — the persona is what matters, not branding.

## Roadmap

- Real-time multi-device groups (Firebase / Supabase)
- Offline PWA with service worker
- Per-topic DPP (daily practice problem) sheets
- Parent / mentor dashboard with weekly email

## License

Personal & educational use. Not affiliated with Anthropic, Google, or any coaching institute.
