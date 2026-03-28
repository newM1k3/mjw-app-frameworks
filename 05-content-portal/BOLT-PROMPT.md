# Framework 05 — Content Portal

**For:** Playbooks, beta guides, documentation hubs, membership portals, gated content libraries.

**Your existing apps in this category:**
- Playbook Portal (flagship — playbookportal.com / .app)
- Walling Studios Beta Guide
- Butternut Mystery Club (portal layer)
- Future: Escape Maze operator education platform
- Future: Your AI Handled resource hub

---

## When to use this framework

Use this when the app's job is to **deliver structured content to a specific audience** — and optionally gate it behind a login or payment.

Key signals:
- The content has sections, chapters, or modules
- There's a clear audience (beta testers, clients, members, operators)
- The experience is "come back and reference this"
- Access might be earned (beta invite, purchase, subscription)

---

## Tier breakdown

### Tier 1 — Prototype
**What's included:**
- Sticky anchored top nav
- Hero section with headline, subheadline, and 2 CTAs
- Feature grid or module cards (3–6 items)
- Numbered setup steps section
- Content sections with tabs or accordion
- Feedback / contact section
- Footer
- No auth — fully public

**Deploy time:** 30–45 minutes in Bolt.

---

### Tier 2 — Product
Everything in Tier 1, plus:
- Login gate (PocketBase email/password auth)
- Gated content sections (some sections visible only after login)
- Member-only resources section (downloadable files, links)
- Progress tracking (mark sections as complete)
- Stripe payment gate for premium access tiers

**Deploy time:** 3–5 hours.

---

### Tier 3 — Scale
Everything in Tier 2, plus:
- Multiple membership tiers (Free / Pro / VIP)
- Content management (edit content without redeploying)
- Member directory (optional — for community portals)
- Discussion/comments per section
- Email drip sequence trigger (new member → welcome series)
- Analytics (which sections get read, completion rates)

**Deploy time:** 2–4 days.

---

## Content types

| Type | Description | Example |
|------|-------------|---------|
| `guide` | Step-by-step setup or how-to | Walling Studios Beta Guide |
| `playbook` | Strategies and frameworks | Playbook Portal |
| `hub` | Collection of resources, links, tools | App Links page |
| `course` | Ordered modules with progress tracking | Escape Room Operator Academy |
| `reference` | Look-up content, checklists, SOPs | Schema Verification Checklist |

---

## File structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── TopNav.jsx           ← sticky, anchor links
│   ├── HeroSection.jsx
│   ├── FeatureGrid.jsx      ← module/feature cards
│   ├── SetupSteps.jsx       ← numbered steps
│   ├── ContentSection.jsx   ← tabbed or accordion content
│   ├── ResourceList.jsx     ← gated downloads/links
│   ├── FeedbackSection.jsx
│   └── Footer.jsx
├── data/
│   ├── sections.js          ← nav sections + content
│   ├── features.js          ← feature/module cards
│   └── steps.js             ← setup steps
└── _shared/
    ├── dark-theme.css
    ├── auth-gate.jsx
    ├── email-capture.jsx
    └── payment-hook.js
```

---

## BOLT PROMPT — TIER 1 (Prototype)

```
VARIABLES:
APP_NAME          = [e.g. "Escape Room Operator Academy"]
APP_TAGLINE       = [e.g. "Everything you need to run a world-class escape room"]
AUDIENCE          = [e.g. "escape room operators" / "beta testers" / "MJW clients"]
NAV_SECTIONS      = [e.g. "Overview, Modules, Resources, Community, FAQ"]
HERO_HEADLINE     = [e.g. "The Operating System for Escape Room Businesses"]
HERO_SUBHEAD      = [e.g. "Frameworks, playbooks, and tools built from 4,000+ guest experiences."]
CTA_PRIMARY       = [label + destination, e.g. "Start Learning → #modules"]
CTA_SECONDARY     = [label + destination, e.g. "View Resources → #resources"]
FEATURES          = [list 4-6 module/feature names + 1-line descriptions]
SETUP_STEPS       = [list 3 steps to get started]
CONTENT_SECTIONS  = [list 3-5 main content sections with their content type]
THEME             = [dark / light]
VERSION           = [e.g. "v1.0 — Beta" or blank]
```

```
Build a React + Vite multi-section content portal called "[APP_NAME]".

DESIGN SYSTEM:
[If THEME=dark]:
- Background: #0f1117
- Card: #1a1f2e
- Border: #2d3748
- Accent: #6ee7f7
- Secondary: #a78bfa
- Text: #e2e8f0, muted: #64748b

[If THEME=light]:
- Background: #f8fafc
- Card: #ffffff
- Border: #e2e8f0
- Accent: #0ea5e9
- Secondary: #8b5cf6
- Text: #0f172a, muted: #64748b

COMPONENTS:

1. TOP NAV (sticky, z-index 100):
- Left: "[APP_NAME]" logo in gradient text (accent→secondary)
- [If VERSION set]: small version badge next to logo in monospace
- Center or right: anchor links to [NAV_SECTIONS]
- Mobile: hamburger menu → slide-down link list
- On scroll past hero: nav gets subtle backdrop blur + border-bottom

2. HERO SECTION (full viewport height, centered):
- Pre-headline badge: "[AUDIENCE] portal" in accent colour pill
- Main headline: "[HERO_HEADLINE]" — large (3rem desktop, 2rem mobile), gradient text
- Subheadline: "[HERO_SUBHEAD]" — muted, max-width 580px, centered
- Two CTA buttons: Primary (solid accent) + Secondary (outlined)
- Decorative: subtle grid or dot pattern background (CSS only)
- [If VERSION]: "Current version: [VERSION]" in small monospace below CTAs

3. FEATURE / MODULE GRID (id="[first NAV_SECTION]"):
- Section heading + muted subheading
- Grid: 3 columns desktop, 2 tablet, 1 mobile — gap 1.25rem
- Each card:
  - Icon (emoji, 1.5rem)
  - Module name (bold)
  - One-line description
  - Category tag badge (colour-coded)
  - Hover: translateY(-4px) + accent border glow

For features: [generate cards based on FEATURES list]

4. SETUP STEPS SECTION:
- Section heading: "Get started in 3 steps" (or equivalent)
- 3 steps from [SETUP_STEPS], each showing:
  - Large step number (01, 02, 03) in accent colour
  - Step title (bold)
  - Step description (2-3 sentences)
  - Action link or button if applicable
- Horizontal layout desktop, stacked mobile

5. CONTENT SECTIONS:
For each section in [CONTENT_SECTIONS]:

[If type=tabs]: tabbed panel — tab row at top, content below
[If type=accordion]: accordion — click header to expand content, one open at a time
[If type=list]: card grid of items with title + description + optional link
[If type=checklist]: interactive checklist (checkbox state in React useState)

Generate placeholder content appropriate for [AUDIENCE] and the section topic.

6. FEEDBACK / CONTACT SECTION:
- Section heading: "Your Feedback Matters" (or equivalent)
- 2-3 sentence description
- Two buttons: "Email Feedback" (mailto link) + "Launch App" (if there's a companion app)
- [If no companion app]: just the feedback email button

7. FOOTER:
- App name + tagline
- Version and build date (if applicable)
- Navigation links (repeat nav items)
- Copyright line

RESPONSIVE:
- Mobile-first
- All grids collapse to single column below 540px
- Touch-friendly tap targets (44px minimum)
- Nav collapses to hamburger on mobile

NO backend. NO auth. All content hardcoded in component data files.
Should feel like premium product documentation, not a template.
```

---

## BOLT PROMPT — TIER 2 ADDITIONS

```
TIER 2 UPGRADES:

AUTH GATE:
- Install pocketbase: npm install pocketbase
- Wrap the entire app (or specific sections) in PocketBase email/password auth
- PocketBase URL from env: import.meta.env.VITE_POCKETBASE_URL
- Public sections: Hero, Feature Grid, Setup Steps
- Gated sections: [specify which sections] — show "Sign in to access" placeholder
- After login: full content unlocks
- Sign out: pb.authStore.clear()

GATED RESOURCES SECTION:
- Add a "Resources" section (id="resources") after auth check
- Shows downloadable files, tool links, template downloads
- Each resource: icon + title + description + download/open button
- Resources stored in PocketBase Storage or as hardcoded URLs
- Load files with: pb.files.getUrl(record, filename)

PROGRESS TRACKING:
- Sidebar or top progress bar showing sections completed
- Checkbox or "Mark complete" button on each content section
- Progress stored in PocketBase collection: member_progress
  Fields: user (Relation→users), section_id (Text), completed (Bool), created (auto)
- Completion percentage shown in member profile
- Save with: pb.collection('member_progress').create({ user: pb.authStore.model.id, section_id, completed: true })

PAYMENT TIER:
- Free tier: access to Tier 1 public content
- Pro tier ($X/month via Stripe): unlocks all gated sections + resources
- Check access: read user_access record from PocketBase for this user + app
- Pro badge shown in member nav
- Upgrade prompt when free members try to access pro content
- startCheckout({ priceId: 'price_xxx', userId: pb.authStore.model.id, appSlug: '[APP_NAME_SLUG]' })

ENV VARS NEEDED:
VITE_POCKETBASE_URL=https://api.yourdomain.com
VITE_CHECKOUT_URL=/.netlify/functions/create-checkout-session
```

---

## Playbook Portal sub-template

For apps that are specifically playbook/framework portals (like playbookportal.com):

Add this to the Tier 1 prompt:

```
PLAYBOOK MODE:
This is a frameworks and playbooks portal. Add:
- A "Playbooks" section with cards for each playbook/framework
  Each card: title, category badge, "difficulty" indicator, estimated read time, "Open" button
- A search bar that filters playbooks by title or category
- Category filter pills (All / Strategy / Operations / Marketing / etc.)
- A "Featured" playbook highlighted at the top of the grid
- Playbook detail view: clicking "Open" expands an inline reading panel (or navigates to a sub-route)
```

---

## Cowork instruction

> "I'm building a content portal called [name] for [audience]. It contains [describe the main content in 1-2 sentences]. Use the Content Portal framework, Tier [1/2/3]. Fill in all the variables in 05-content-portal/BOLT-PROMPT.md and give me the complete, ready-to-paste Bolt prompt."
