# Bolt prompt — AI Tool framework

---

## VARIABLES (fill these in)

```
APP_NAME        = [e.g. "Walling Studios"]
APP_TAGLINE     = [e.g. "AI-powered image restoration"]
AI_PROVIDER     = [e.g. "Gemini 2.5 Flash"]
INPUT_TYPE      = [text prompt / uploaded photo / both]
OUTPUT_TYPE     = [image / text / transformed image]
STYLE_PRESETS   = [e.g. "Photography, Digital Art, Watercolour, Vintage, 3D Render"]
TAB_NAMES       = [e.g. "Generator, Editor, Film Lab, History"]
PRIMARY_ACTION  = [e.g. "Generate" / "Transform" / "Restore"]
VERSION         = [e.g. "v1.0-BETA"]
TIER            = [1 / 2 / 3]
```

---

## BOLT PROMPT — TIER 1 (Prototype)

```
Build a React + Vite single-page AI tool app called "[APP_NAME]".
Tagline: "[APP_TAGLINE]"

DESIGN SYSTEM (use exactly):
- Background: #0f1117
- Card background: #1a1f2e
- Border: #2d3748
- Accent: #6ee7f7 (cyan)
- Secondary accent: #a78bfa (purple)
- Text primary: #e2e8f0
- Text muted: #64748b
- Font: Segoe UI, system-ui, sans-serif
- Monospace details (version badges, status lines): use monospace font
- Aesthetic: dark digital lab — think professional darkroom software

HEADER:
- Left: App name "[APP_NAME]" in gradient text (cyan→purple)
- Right: Version badge "[VERSION]" in monospace + user avatar placeholder
- Subtitle line in muted text: "[APP_TAGLINE]"

API KEY SETUP (shown before first use):
- Centered card with logo
- Input field: "Enter your [AI_PROVIDER] API key"
- Helper text: "Get a free key at [appropriate URL]"
- Key stored in localStorage under key "APP_NAME_api_key"
- Once set, show a small green "Connected" indicator in the header
- Link to "Clear key" in settings

MAIN INTERFACE — tabbed layout:
Tabs: [TAB_NAMES]

TAB 1 — Generator (or first tab name):
- [If INPUT_TYPE includes "text prompt"]: Large textarea (min 4 rows) with placeholder "Describe what you want to create…"
- [If INPUT_TYPE includes "uploaded photo"]: Drag-and-drop upload zone with dashed border + click to browse
- Style presets: pill buttons in a scrollable row — [STYLE_PRESETS]
- Aspect ratio selector (if image output): Square / Portrait / Landscape / Wide
- "[PRIMARY_ACTION]" button — full width, accent colour, with spinner during generation
- Progress indicator during generation: animated status line e.g. "Analysing prompt… Generating… Complete"
- Output area: shows the result (image or text) with:
  - Download button (PNG/JPG for images, TXT for text)
  - Copy button (for text output)
  - Share button (copies URL or shows placeholder)
  - Regenerate button (reuses same prompt)

TAB 2 (if applicable — e.g. Editor, Film Lab):
- If image output: show the generated image with basic adjustment controls (brightness, contrast sliders — client-side CSS filters only)
- Filter presets as pill buttons: Sepia, Black & White, Vintage, Vivid, Cool, Warm
- Apply filter button updates the displayed image

HISTORY PANEL (right sidebar, collapsible):
- Shows last 20 generations in the current session
- Each entry: small thumbnail or text preview + timestamp + prompt excerpt
- Click to reload into the main workspace
- "Clear history" button at bottom
- History stored in localStorage

SETTINGS TAB:
- API key management (show masked key, clear button)
- Default style preset selector
- Output quality selector (Standard / High)
- Clear all history button

ERROR HANDLING:
- If API key missing: prompt to add key (don't show error, show the setup card)
- If generation fails: show friendly error in the output area with a retry button
- If API key invalid: show "Check your API key" message with link to settings

AI INTEGRATION ([AI_PROVIDER]):
- Use the Gemini API via fetch to https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
- Pass the user's API key as a query param: ?key=API_KEY
- For image generation use the correct Gemini image gen endpoint
- For text: standard content generation
- Handle the response structure correctly (candidates[0].content.parts[0])

NO backend. User supplies their own API key. All history in localStorage.
The app should feel like professional creative software, not a demo.
```

---

## BOLT PROMPT — TIER 2 ADDITIONS

```
TIER 2 UPGRADES:

AUTH:
- Supabase magic link auth
- Login card on dark background before access
- Show user email in header avatar

QUOTA SYSTEM:
- Each user gets 20 free generations
- Track count in Supabase (table: generation_log)
- Show remaining count in header: "14 generations remaining"
- When quota reached: show upgrade modal

PAYMENT:
- Stripe Checkout for quota top-ups
- Product: "50 more generations" — $4.99
- After payment: add 50 to user's quota in Supabase

CLOUD HISTORY:
- Save each generation to Supabase Storage (images) + generations table (metadata)
- History panel now loads from Supabase — persists across devices
- Each entry has a permanent shareable URL

API KEY:
- Move to backend — users no longer need their own key
- Use Supabase Edge Function as proxy to AI provider
- Your API key in Edge Function env vars only

ENV VARS NEEDED:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_CHECKOUT_URL=
```

---

## Escape Maze virtual costume sub-template

Add this to any Tier 1 AI Tool prompt for the virtual costume workflow:

```
ESCAPE MAZE COSTUME MODE:

Add a "Virtual Dress Up" workflow section to the Generator tab:

Step 1 — Upload Photo: drag-and-drop zone for customer photo
Step 2 — Select Costume:
  - "Rugged fur-lined coat" (Men)
  - "Red bandana & leather vest" (Men)
  - "Victorian skirt & cape" (Women)
  - "Fur stole & black dress" (Women)
Step 3 — Apply Vintage Filter: Sepia / Wet Plate / Daguerreotype
Step 4 — Generate Caption: one-click AI caption for social media
Step 5 — Share: copy caption + image to clipboard

Show steps as a numbered progress indicator.
Style with an 1870s Western aesthetic — use gold (#fbbf24) as the accent colour for this mode.
```

---

## Cowork instruction

> "I'm building an AI tool that [describe what it does]. Use the AI Tool framework, Tier [1/2/3]. Fill in all the variables in 02-ai-tool/BOLT-PROMPT.md and give me the complete, ready-to-paste Bolt prompt."
