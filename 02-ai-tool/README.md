# Framework 02 — AI Tool

**For:** AI image generators, text generators, AI chat interfaces, photo transformation tools, AI-powered creative apps.

**Your existing apps in this category:**
- Walling Studios (Gemini image gen + editor)
- Pin-Up Generator
- Time Travel – MJW Design (AI photo transformation)
- Camera Shop

---

## When to use this framework

Use this when the app's core loop is: **user provides input → AI generates output**.

The input might be a text prompt, an uploaded image, or a selection from presets.
The output might be an image, text, audio, or a transformed file.

Key signal: the app needs an API key (either user-supplied or backend-held).

---

## Tier breakdown

### Tier 1 — Prototype
**What's included:**
- Dark theme (MJW palette)
- App header with logo and version badge
- API key input (stored in localStorage) — user-supplied key model
- Tabbed interface (Generator / History / Settings)
- Prompt textarea with style presets (dropdown or pill buttons)
- Generate button with loading spinner + progress indicator
- Output display area with download button
- Session history panel (right sidebar) — recent generations, click to reload
- All state in localStorage

**API:** Gemini 2.5 Flash by default (user supplies key from Google AI Studio)
**Deploy time:** 30–60 minutes in Bolt.

---

### Tier 2 — Product
Everything in Tier 1, plus:
- Supabase auth (users have accounts)
- Backend API key (your key, not user's) — key moves server-side
- Generation quota system (X free generations, then paywall)
- Stripe payment for quota top-ups or subscription
- Cloud image storage (Supabase Storage) — history persists across devices
- Shareable image URLs

**Deploy time:** 4–8 hours.

---

### Tier 3 — Scale
Everything in Tier 2, plus:
- Multiple AI model options (Gemini, Stable Diffusion, DALL-E)
- Admin dashboard (usage stats, cost tracking, top users)
- Team/organization accounts
- API access for power users (your app becomes someone else's API)
- Watermarking and branding options

**Deploy time:** 2–5 days.

---

## File structure (what Bolt will generate)

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── AppHeader.jsx
│   ├── ApiKeyInput.jsx
│   ├── GeneratorTab.jsx
│   ├── HistoryPanel.jsx
│   ├── SettingsTab.jsx
│   ├── OutputDisplay.jsx
│   ├── PromptBuilder.jsx    ← textarea + style presets
│   └── DownloadButton.jsx
├── hooks/
│   ├── useGenerator.js      ← AI API call logic
│   └── useHistory.js        ← localStorage history management
└── _shared/
    ├── dark-theme.css
    ├── db-stub.js
    ├── auth-gate.jsx
    └── payment-hook.js
```

---

## Customization variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | App name | "Walling Studios" |
| `APP_TAGLINE` | One-line description | "AI-powered image restoration" |
| `AI_PROVIDER` | Which AI service | "Gemini 2.5 Flash" |
| `INPUT_TYPE` | What user provides | "text prompt" / "uploaded photo" / "both" |
| `OUTPUT_TYPE` | What AI returns | "image" / "text" / "transformed image" |
| `STYLE_PRESETS` | Preset options | "Photography, Digital Art, Watercolour, Vintage" |
| `TAB_NAMES` | Custom tab labels | "Generator, Film Lab, Restorer, History" |
| `PRIMARY_ACTION` | Generate button label | "Generate", "Transform", "Restore" |
| `ESCAPE_MAZE_MODE` | Virtual costume workflow | true / false |

---

## Escape Maze virtual costume workflow

If `ESCAPE_MAZE_MODE = true`, add this workflow to the Generator tab:

1. Upload customer photo
2. Select costume preset (Rugged fur-lined coat / Victorian skirt & cape / etc.)
3. Apply vintage filter (Sepia / Wet Plate)
4. Generate share caption
5. One-click social share

This is a sub-template inside the AI Tool framework.

---

## See BOLT-PROMPT.md for the ready-to-paste Bolt prompt.
