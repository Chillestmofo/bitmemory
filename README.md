# DSA Recall 🧠

> Spaced repetition tracker for competitive programmers.  
> Log problems, upload your approach, get reminded on day **3 → 7 → 15 → 30**.

## Stack

- **React 18** + Vite
- **date-fns** for date math
- **localStorage** for persistence (no backend needed)
- CSS Modules for styling
- Pixel / cyan aesthetic

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click Deploy ✓

The `vercel.json` handles SPA routing automatically.

## Features

- ✅ Log any DSA problem with name, link, platform, difficulty
- ✅ Tag problems by pattern (Sliding Window, DP, Graph, etc.)
- ✅ Upload screenshots of your approach/solution
- ✅ Write approach notes & key insights
- ✅ Auto-scheduled spaced repetition: day 3, 7, 15, 30
- ✅ Queue view with overdue / due-today / upcoming filters
- ✅ 14-day calendar strip showing review density
- ✅ Problem detail modal with image gallery
- ✅ Stats dashboard — difficulty split, tag frequency, revision funnel
- ✅ Search & filter across all problems
- ✅ Fully persistent (localStorage, no signup needed)
- ✅ Pixel-art cyan theme, fully responsive

## Science

Based on **Hermann Ebbinghaus's Forgetting Curve** — reviewing material at spaced intervals (3, 7, 15, 30 days) prevents memory decay and moves knowledge into long-term memory. This is the same technique used by Anki and other proven spaced repetition systems.
