# Framework 03 — Experience

**For:** Quests, mystery games, immersive steppers, narrative experiences, interactive puzzles, escape room companion apps.

**Your existing apps in this category:**
- 1970s Retro Quest
- Butternut Mystery Club
- Side Hustle 12
- Future: Last Round of Christmas companion app
- Future: Murder at Dusk pre-game portal

---

## When to use this framework

Use this when the app moves a user through a **sequence of scenes or steps** with choices, reveals, or puzzles. The experience has a beginning, middle, and end.

Key signals:
- There's a "Begin" button on a title screen
- Users make choices or discover clues
- There's a sense of progress (step X of Y)
- The aesthetic is themed (era, genre, mood)

---

## Tier breakdown

### Tier 1 — Prototype
**What's included:**
- Themed title screen with Begin CTA
- Step-through scene engine (progress indicator + scene area + choice buttons)
- Clue / inventory panel (collapsible sidebar)
- Scene descriptions with atmospheric text
- Choice branching (simple linear or choose-your-own)
- Ending screen with result/debrief
- All state in React useState — no backend

**Deploy time:** 30–45 minutes in Bolt.

---

### Tier 2 — Product
Everything in Tier 1, plus:
- Shared leaderboard (Supabase — times, scores, team names)
- Save progress (resume where you left off)
- GM (Game Master) dashboard — see all active sessions, time each group
- Access code system (groups get a unique code to start)
- Stripe gate (pay to play, or promo codes)

**Deploy time:** 4–6 hours.

---

### Tier 3 — Scale
Everything in Tier 2, plus:
- Multi-experience hub (one app hosts many experiences)
- Team/corporate booking flow built in
- Analytics (completion rates, where people get stuck, average time)
- Content management (edit scenes without redeploying)
- Escape Maze brand integration (logo, booking link in debrief)

**Deploy time:** 2–4 days.

---

## Aesthetic themes

Each experience gets a theme token that overrides the base MJW palette:

| Theme | Accent | Bg tint | Font style | Your apps |
|-------|--------|---------|-----------|-----------|
| `western-1870s` | #fbbf24 gold | sepia tint | serif headers | Murder at Dusk, Time Travel |
| `retro-70s` | #f97316 orange | warm brown | slab serif | 1970s Retro Quest |
| `victorian-mystery` | #a78bfa purple | dark blue | gothic | Butternut Mystery |
| `christmas-noir` | #ef4444 red | near-black | condensed | Last Round of Christmas |
| `corporate-80s` | #6ee7f7 cyan | dark | monospace | Saturday Detention |
| `default-dark` | #6ee7f7 cyan | #0f1117 | system | any |

---

## File structure

```
src/
├── App.jsx
├── main.jsx
├── index.css              ← dark-theme.css + theme override
├── data/
│   ├── scenes.js          ← scene tree data
│   ├── clues.js           ← clue/inventory items
│   └── endings.js         ← ending variants
├── components/
│   ├── TitleScreen.jsx
│   ├── SceneEngine.jsx    ← core stepper
│   ├── ChoiceButtons.jsx
│   ├── CluePanel.jsx
│   ├── ProgressBar.jsx
│   └── EndingScreen.jsx
└── _shared/
    ├── dark-theme.css
    ├── db-stub.js
    └── auth-gate.jsx      ← add at Tier 2 (access codes)
```

---

## Scene data format

All scenes live in `src/data/scenes.js`. Structure:

```js
export const scenes = [
  {
    id: 'intro',
    title: 'Scene title',
    description: `Atmospheric scene text. Can be multiple paragraphs.
    Write in second person: "You enter the room..."`,
    image: null,              // optional image URL or null
    choices: [
      { label: 'Examine the desk', next: 'scene-desk' },
      { label: 'Check the window', next: 'scene-window' },
    ],
    clueUnlocked: 'matchbook', // optional — adds item to inventory
    isEnding: false,
  },
  // ...
];
```

Bolt will generate this file from your scenario description.
To add a new scene later: add an object to the array and redeploy.

---

## BOLT PROMPT — TIER 1 (Prototype)

Fill in variables, then paste into bolt.new:

```
VARIABLES:
APP_NAME      = [e.g. "The Butternut Mystery"]
THEME         = [western-1870s / retro-70s / victorian-mystery / christmas-noir / corporate-80s / default-dark]
ACCENT_COLOUR = [e.g. "#a78bfa" for victorian-mystery]
SETTING       = [e.g. "1873 Peterborough County, Ontario"]
PROTAGONIST   = [e.g. "a young detective" / "you, a corporate team"]
TOTAL_SCENES  = [e.g. 12]
INVENTORY_NAME = [e.g. "Clues" / "Evidence" / "Items"]
HAS_BRANCHING = [true / false — does the experience have multiple paths?]
ENDING_COUNT  = [e.g. 3 — how many different endings?]
```

```
Build a React + Vite immersive experience app called "[APP_NAME]".

DESIGN SYSTEM:
- Background: #0f1117 (with [THEME] tint — see below)
- Card/panel background: #1a1f2e
- Border: #2d3748
- Primary accent: [ACCENT_COLOUR]
- Text primary: #e2e8f0
- Text muted: #64748b

THEME OVERRIDES for [THEME]:
- western-1870s: add sepia overlay (#78350f at 8% opacity on body), use Georgia or serif for scene headings, gold (#fbbf24) as accent
- retro-70s: warm background tint (#431407 at 5%), orange (#f97316) accent, bold condensed headings
- victorian-mystery: dark blue tint (#1e1b4b at 8%), purple (#a78bfa) accent, gothic feel
- christmas-noir: near-black (#030712) background, red (#ef4444) accent, stark contrast
- corporate-80s: keep default dark, cyan accent, monospace font throughout
- default-dark: use base MJW palette, no overrides

SCREENS:

1. TITLE SCREEN (full height):
- Large atmospheric title "[APP_NAME]"
- Setting context: "[SETTING]"
- Brief teaser description (2-3 sentences, atmospheric)
- "Begin" button (large, accent colour)
- Decorative elements appropriate to [THEME] (no stock images — use CSS/SVG)

2. SCENE ENGINE:
- Progress indicator: "Scene X of [TOTAL_SCENES]" + thin progress bar
- Scene title (h2, themed font)
- Scene description area — generous line height, readable width (max 680px centered)
- [INVENTORY_NAME] panel: collapsible right sidebar showing collected items as cards
  - Each item has a name + short description + icon (emoji)
- Choice buttons: 2-3 per scene, styled as bordered cards that highlight on hover
- [If HAS_BRANCHING=true]: choices lead to different scene branches
- [If HAS_BRANCHING=false]: choices are flavour only — always advance to next scene

3. ENDING SCREEN:
- [ENDING_COUNT] possible endings — show the appropriate one based on choices made
- Dramatic heading (e.g. "Case Solved!" or "The Mystery Deepens…")
- Ending description (2-3 paragraphs)
- Score or result summary (time taken, clues found, choices made)
- "Play again" button (resets state)
- "Share your result" button (copies result text to clipboard)
- [If Escape Maze experience]: link back to booking page

SCENE DATA:
Generate 6 sample scenes set in [SETTING] featuring [PROTAGONIST].
Include 4 inventory items that get unlocked across the experience.
Create [ENDING_COUNT] endings.

Format all scene data in src/data/scenes.js as a JS array of objects:
{ id, title, description, choices: [{label, next}], clueUnlocked, isEnding }

STATE MANAGEMENT:
- currentSceneId (string)
- inventory (array of item objects)
- choiceHistory (array of choice labels)
- startTime (Date — for scoring)
- All in React useState, no localStorage needed for Tier 1

NO backend. NO auth. NO external APIs.
The aesthetic should feel like a premium interactive story, not a quiz app.
```

---

## BOLT PROMPT — TIER 2 ADDITIONS

```
TIER 2 UPGRADES:

ACCESS CODES:
- Title screen shows an "Enter your group code" field
- Codes stored in Supabase (table: access_codes) with status: active / used / expired
- Valid code unlocks the experience and creates a session record

LEADERBOARD:
- After ending screen: "Add your name to the leaderboard" form
- Stores: team_name, time_seconds, clues_found, ending_id, created_at
- Public leaderboard page (sortable by time, accessible via /leaderboard)
- Top 10 displayed with rank badges

GM DASHBOARD (route: /gm — password protected):
- Live view of all active sessions
- Each session: team name, current scene, time elapsed, clues found
- "Reset session" button per group
- Full leaderboard management (delete entries, add manual entries)

PAYMENT GATE:
- Before showing access code field: Stripe Checkout for the experience ($X)
- After payment: email access code to purchaser
- Promo code field (stored in Supabase, applies discount)

ENV VARS NEEDED:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_CHECKOUT_URL=
VITE_GM_PASSWORD=
```

---

## Cowork instruction

> "I'm building an immersive experience called [name]. It's set in [setting] and the player [describe the premise in 1-2 sentences]. Use the Experience framework, Tier [1/2/3], theme [theme name]. Fill in all the variables in 03-experience/BOLT-PROMPT.md and give me the complete, ready-to-paste Bolt prompt."
