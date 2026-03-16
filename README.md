# MJW App Frameworks

A library of opinionated Bolt.new starter frameworks for rapid web app development.
Each framework is pre-wired for its category with three tiers of complexity.
Fork this repo to start a new project — never build from scratch again.

---

## How to use this repo

### Starting a new project

1. **Fork this repo** on GitHub — give it the project name (e.g. `escape-maze-booking`)
2. **Open Bolt.new** → Import from GitHub → select your fork
3. **Pick your framework folder** (see below) and follow its `BOLT-PROMPT.md`
4. **Choose your tier** — start at Tier 1 unless you already know you need auth or payments
5. Build. When you discover improvements, open a pull request back to this master repo.

### Repo structure

```
mjw-app-frameworks/
├── README.md                  ← you are here
├── _shared/                   ← modules that work in any framework
│   ├── MODULES.md             ← module reference
│   ├── dark-theme.css         ← your signature palette
│   ├── card-grid.jsx          ← searchable card grid component
│   ├── auth-gate.jsx          ← Supabase auth wrapper
│   ├── payment-hook.js        ← Stripe checkout stub
│   ├── db-stub.js             ← localStorage → Supabase migration shim
│   └── email-capture.jsx      ← lead capture form
│
├── 01-business-ops/           ← CRM, dashboards, task managers, portals
├── 02-ai-tool/                ← AI generators, image tools, chat interfaces
├── 03-experience/             ← quests, mystery games, immersive steppers
├── 04-lead-gen/               ← calculators, quizzes, tripwire tools
└── 05-content-portal/         ← playbooks, beta guides, gated hubs
```

---

## The three tiers

| Tier | Name | Auth | Database | Payments | Use when |
|------|------|------|----------|----------|----------|
| 1 | Prototype | None | localStorage | None | Proving the idea |
| 2 | Product | Supabase Auth | Supabase DB | Stripe Checkout | Launching to real users |
| 3 | Scale | Supabase + RLS | Full schema | Stripe Billing | Growing a real business |

**Rule:** Always start at Tier 1. Promote when the idea proves out.
Tier 1 apps are fully deployable — not broken stubs.

---

## Design system

All frameworks share the MJW signature palette and component style.

```css
--bg-base:    #0f1117;   /* page background */
--bg-card:    #1a1f2e;   /* card / panel background */
--bg-hover:   #252d3d;   /* hover state */
--border:     #2d3748;   /* default border */
--accent:     #6ee7f7;   /* cyan — primary accent */
--accent-2:   #a78bfa;   /* purple — secondary accent */
--text-primary:   #e2e8f0;
--text-muted:     #64748b;
--text-dim:       #4a5568;
```

Tag colour palette (for category badges):

```css
--tag-ops:      cyan    #6ee7f7
--tag-ai:       green   #34d399
--tag-exp:      gold    #fbbf24
--tag-lead:     red     #f87171  (soft)
--tag-content:  purple  #a78bfa
```

---

## Platform routing

| Platform | Use for |
|----------|---------|
| Bolt.new | All public-facing apps — experiences, lead gen, portals |
| Manus | Auth-gated internal tools, order management |
| Playbook Portal | Flagship brand property — custom domain only |

---

## Cowork instructions

If using Claude Cowork to generate a Bolt prompt for a new project:

> "I have a new project: [describe it in 2-3 sentences]. Look at the mjw-app-frameworks folder, pick the right framework and tier, fill in the BOLT-PROMPT.md variables, and give me a ready-to-paste Bolt.new prompt."

---

*Last updated: March 2026 — MJW Design*
