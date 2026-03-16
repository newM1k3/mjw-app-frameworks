# Framework 04 — Lead Gen

**For:** Calculators, quizzes, assessments, tripwire tools, viral hooks, lead magnets.

**Your existing apps in this category:**
- Avoidance Cost Calculator (playbookportal.com + Netlify)
- Future: Small Business Communication Playbook tripwire

---

## When to use this framework

Use this when the app's job is to **give the user a personalized result and capture their email in exchange**.

The formula: compelling question → inputs → dramatic result → email capture → CTA.

Key signals:
- The output is a number, score, or label specific to the user
- There's a clear reason to share ("My score was X!")
- The result creates desire for a next step (the tripwire product, the call, the report)

---

## The conversion formula

```
Hook headline
    ↓
3–6 inputs (sliders, multiple choice, or short text)
    ↓
"Calculate" button
    ↓
Dramatic result reveal (big number + interpretation)
    ↓
Email capture ("Get your full report")
    ↓
CTA (buy the tripwire / book a call / join the list)
```

Every element exists to move the user to the next step. Nothing decorative.

---

## Tier breakdown

### Tier 1 — Prototype
**What's included:**
- Single-page calculator/quiz with inputs
- Result calculation (client-side JS)
- Dramatic result reveal with animation
- Email capture form (logs to console — no backend)
- CTA button (links to product page or placeholder)
- Mobile-first, centered layout
- Share result button (copies to clipboard)

**Deploy time:** 20–30 minutes in Bolt.

---

### Tier 2 — Product
Everything in Tier 1, plus:
- Email actually submits to ConvertKit / Mailchimp / Loops
- Tags subscriber based on their result segment
- Result + email stored in Supabase for follow-up
- Tripwire product gated behind email capture (Payhip / Gumroad link revealed after submit)
- A/B variant support (two versions of the headline or CTA)

**Deploy time:** 2–3 hours.

---

### Tier 3 — Scale
Everything in Tier 2, plus:
- Full CRM sync (tag + score + answers → your CRM)
- Shareable result URL (each result gets a unique URL)
- Admin dashboard (submissions, conversion rate, result distribution)
- PDF report generation (personalized, auto-emailed)
- Embed code (put the calculator on any website as an iframe)

**Deploy time:** 1–2 days.

---

## Result segmentation

Every lead gen tool should segment users into 3–4 buckets based on their result.
Each bucket gets different copy and a different CTA urgency level.

Example for Avoidance Cost Calculator:
| Score | Segment | Copy tone | CTA |
|-------|---------|-----------|-----|
| $0–$5k | Low cost | Validating | "Here's how to stay here" |
| $5k–$20k | Medium cost | Concerned | "This is fixable" |
| $20k–$50k | High cost | Urgent | "You need to act on this" |
| $50k+ | Critical | Alarm | "This is a crisis — let's talk" |

---

## File structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── HookScreen.jsx      ← headline + start button (optional)
│   ├── InputStep.jsx       ← one step of inputs
│   ├── ResultReveal.jsx    ← animated result display
│   ├── EmailCapture.jsx    ← from _shared
│   ├── CTABlock.jsx        ← post-capture CTA
│   └── ShareButton.jsx
├── logic/
│   └── calculate.js        ← pure calculation function
└── _shared/
    ├── dark-theme.css
    ├── email-capture.jsx
    └── payment-hook.js
```

---

## BOLT PROMPT — TIER 1 (Prototype)

```
VARIABLES:
APP_NAME        = [e.g. "The Avoidance Cost Calculator"]
HOOK_HEADLINE   = [e.g. "What Is Your Silence Costing You?"]
HOOK_SUBHEAD    = [e.g. "Find out the real cost of avoiding difficult conversations in your business."]
RESULT_LABEL    = [e.g. "Your annual avoidance cost" / "Your score" / "Your risk level"]
RESULT_FORMAT   = [dollar amount / score out of 100 / letter grade / label]
INPUTS          = [describe each input — see format below]
SEGMENT_LOW     = [label for low result, e.g. "Manageable"]
SEGMENT_MID     = [label for mid result, e.g. "Concerning"]
SEGMENT_HIGH    = [label for high result, e.g. "Critical"]
EMAIL_CTA       = [e.g. "Get your free Communication Playbook"]
PRODUCT_URL     = [e.g. "https://payhip.com/b/xxx" or "#" for prototype]
THEME           = [light / dark]
```

Input format (list each one):
```
INPUT_1: label="[label]", type=[slider/radio/number/text], range=[min-max] or options=[A,B,C]
INPUT_2: ...
```

```
Build a single-page React + Vite lead generation calculator called "[APP_NAME]".

DESIGN SYSTEM:
[If THEME=dark]:
- Background: #0f1117
- Card: #1a1f2e
- Border: #2d3748
- Accent: #6ee7f7
- Text: #e2e8f0

[If THEME=light]:
- Background: #f8fafc
- Card: #ffffff
- Border: #e2e8f0
- Accent: #0ea5e9
- Text: #0f172a
- Shadow on cards: 0 4px 24px rgba(0,0,0,0.08)

LAYOUT — single centered column, max-width 640px, padding 2rem:

SECTION 1 — HOOK:
- Large headline: "[HOOK_HEADLINE]"
  Style: gradient text (accent colour → secondary), 2.5rem, font-weight 700
- Subheadline: "[HOOK_SUBHEAD]"
  Style: muted, 1.1rem, max-width 500px
- Decorative element: a subtle icon or illustration (CSS only, no images)

SECTION 2 — INPUTS:
For each input:
[Generate appropriate input components based on INPUTS list]

Slider inputs:
- Full-width range slider
- Label above left, current value display above right (updates live)
- Accent-coloured track fill to current position
- Descriptive helper text below in muted colour

Radio/choice inputs:
- Pill button group — options laid out horizontally (wrap on mobile)
- Selected pill: accent background, dark text
- Unselected: transparent with border

Number inputs:
- Large centered input with prefix/suffix ($ or %)
- Increment/decrement buttons either side

Separate each input with generous spacing (2rem).

SECTION 3 — CALCULATE:
- "[Primary Action]" button — full width, large (56px height), accent colour
- On click: show loading animation (1 second) then scroll to result
- If any required field empty: shake the button and highlight empty fields

SECTION 4 — RESULT REVEAL (hidden until calculated):
- Animate in: fade up over 0.4s
- Large result display: the calculated [RESULT_LABEL]
  - [If dollar]: format as $X,XXX with large font (3rem), accent colour
  - [If score]: circular progress ring + number
  - [If label]: large coloured badge

- Segment-based interpretation copy (3 paragraphs based on result range):
  - Low result: [SEGMENT_LOW] tone — validating, practical
  - Mid result: [SEGMENT_MID] tone — concerned, motivating
  - High result: [SEGMENT_HIGH] tone — urgent, action-oriented

- Share button: "Share your result" — copies "[APP_NAME]: My [RESULT_LABEL] is [X]. [HOOK_HEADLINE] [URL]" to clipboard

SECTION 5 — EMAIL CAPTURE (appears 2 seconds after result):
- Animate in below the result
- Heading: "[EMAIL_CTA]"
- Fields: Name (text) + Email (email)
- Button: "Send me the report" (or equivalent)
- Tier 1: on submit, log to console + show success message: "Check your inbox!"
- Fine print: "No spam. Unsubscribe any time."

SECTION 6 — CTA BLOCK (appears after email submit):
- Product or next step offer
- Heading: clear value proposition
- Button linking to [PRODUCT_URL]
- If PRODUCT_URL is "#": show placeholder "Product link coming soon"

CALCULATION LOGIC:
Create a pure function in src/logic/calculate.js that:
- Takes all input values as an object
- Returns: { result, segment: 'low'|'mid'|'high', formattedResult }
- [Generate appropriate calculation logic based on the inputs and result format]

MOBILE:
- Everything stacks vertically
- Touch-friendly input sizes (min 44px tap targets)
- Pill buttons wrap naturally

NO backend. NO external APIs. All calculation client-side. Email capture logs to console.
```

---

## BOLT PROMPT — TIER 2 ADDITIONS

```
TIER 2 UPGRADES:

EMAIL DELIVERY:
- Submit handler POSTs to VITE_EMAIL_SUBMIT_URL
- Payload: { email, name, result, segment, answers, source: "[APP_NAME]" }
- Backend should tag subscriber in ConvertKit/Mailchimp based on segment
- Show real success/error states

RESULT STORAGE:
- Also POST result to Supabase (table: calculator_results)
- Fields: email, result_value, segment, answers (JSON), created_at
- No auth required — anonymous submissions

TRIPWIRE REVEAL:
- After email submit: reveal the product offer with the actual purchase link
- If segment = 'high': show urgency messaging + higher-tier offer
- Track which segment converts at what rate (store in Supabase)

A/B TESTING:
- On page load, randomly assign variant A or B (50/50)
- Variant A: current HOOK_HEADLINE
- Variant B: [alternative headline]
- Store variant in submission record
- View conversion by variant in Supabase

ENV VARS NEEDED:
VITE_EMAIL_SUBMIT_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Cowork instruction

> "I'm building a lead gen calculator called [name]. It calculates [what it calculates] from [what inputs]. The result is [what format]. Use the Lead Gen framework, Tier [1/2/3]. Fill in all the variables in 04-lead-gen/BOLT-PROMPT.md and give me the complete, ready-to-paste Bolt prompt."
