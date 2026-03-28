# MJW Framework System — Cowork Context

This file tells Claude Cowork everything it needs to operate the MJW App Frameworks system.
Place this file in the root of your frameworks working folder.

---

## What this folder is

This is Mike Walling's (MJW Design) master framework library for building web apps in Bolt.new.
It contains 5 framework types, each with 3 tiers of complexity, and a set of shared modules.

**The goal:** Never build from scratch. Every new app starts as a fork of the appropriate framework.

---

## Canonical tech stack (use this for every app)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React + Vite + TypeScript | All frameworks use this |
| Styling | TailwindCSS or inline styles | MJW palette (see design system below) |
| Backend / Auth / DB | **PocketBase on Hostinger** | Single shared instance for all apps |
| PocketBase SDK | `pocketbase` npm package | `npm install pocketbase` |
| PocketBase URL env var | `VITE_POCKETBASE_URL` | Set in Netlify env vars per app |
| Deployment | Netlify | Connect GitHub repo → auto-deploy |
| Payments | Stripe Checkout | Via Netlify Functions (see Playbook Part 9) |
| Email | Resend | Via Netlify Functions |
| AI | OpenAI / Gemini | Via Netlify Functions (key never in frontend) |

**Never use Supabase.** PocketBase on Hostinger is the single source of truth for auth, data, and file storage across all MJW apps.

**Core PocketBase collections (shared across all apps):**

| Collection | Purpose |
|------------|---------|
| `users` | Built-in auth — all apps share one user pool |
| `apps` | One record per app (`name`, `slug`, `url`, `is_active`) |
| `user_access` | Tier/status per user per app (`user`, `app`, `tier`, `status`, `stripe_subscription_id`) |
| `leads` | Email capture from any lead gen form |

---

## Mike's job

When choosing a framework or writing copy, understand the context:

- **Escape Maze Inc.** — 129-acre destination entertainment venue near Peterborough, Ontario. Escape rooms, adventure trails, laser tag, disc golf, camping. 4,000+ visitors/year, 20+ corporate groups. Owners: Jacqueline (Jake) Walling, Fred Preddy, Wilma Preddy and Michael Preddy.

## Mike's businesses

When choosing a framework or writing copy, understand the context:

- **MJW Design** — SEO and website optimization for home service contractors in the Kawartha region.
- **Your AI Handled** — AI automation and chat services for contractors. Website: youraihandled.com.
- **Playbook Portal** — flagship content/playbook product. playbookportal.com + playbookportal.app.

---

## Framework selection guide

When Mike describes a new project, use this decision tree:

| If the app is about... | Use framework |
|------------------------|---------------|
| Managing records, clients, tasks, orders, bookings | 01-business-ops |
| AI image generation, photo transformation, text generation | 02-ai-tool |
| A game, quest, mystery, narrative experience | 03-experience |
| A calculator, quiz, lead magnet, tripwire tool | 04-lead-gen |
| A guide, playbook, documentation hub, gated content | 05-content-portal |

**When in doubt:** ask "what does the user DO in this app?"
- Look at a list and manage things → Business Ops
- Type a prompt and get output → AI Tool
- Click through a story → Experience
- Answer questions and get a result → Lead Gen
- Read structured content → Content Portal

---

## Tier selection guide

| If the app needs... | Use tier |
|--------------------|---------|
| No login, no database, just works | 1 — Prototype |
| Real user accounts, persistent data, payment | 2 — Product |
| Multiple user roles, admin, webhooks, scale | 3 — Scale |

**Default to Tier 1** unless Mike explicitly says he needs auth or payments.
A Tier 1 app deployed and working beats a Tier 2 app still being planned.

---

## How to generate a Bolt prompt

When Mike says "I want to build [description]":

1. Read this file to understand the context
2. Read the appropriate framework's README.md
3. Read the framework's BOLT-PROMPT.md
4. Fill in all VARIABLES based on Mike's description
5. Select the appropriate tier
6. Output the complete, filled-in, ready-to-paste Bolt prompt

If any variable is unclear, make a reasonable default based on:
- MJW design system (dark theme, cyan accent, MJW palette)
- The business context above
- What makes sense for the app type

Do NOT ask Mike to fill in variables himself — that defeats the purpose.
Make smart defaults. Flag any decisions you made at the end.

---

## MJW design system (apply to all apps)

```
Primary background:    #0f1117
Card background:       #1a1f2e
Hover state:           #252d3d
Border default:        #2d3748
Border hover:          #4a5568
Accent (cyan):         #6ee7f7
Accent 2 (purple):     #a78bfa
Text primary:          #e2e8f0
Text muted:            #64748b
Text dim:              #4a5568
```

Tag colours by framework:
- Business Ops: cyan (#6ee7f7)
- AI Tool: green (#34d399)
- Experience: gold (#fbbf24)
- Lead Gen: soft red (#f87171)
- Content Portal: purple (#a78bfa)

---

## Repo maintenance tasks (for Cowork)

When Mike says "update the frameworks" or "add this to all future apps":

1. Identify which file(s) need updating
2. Make the change in the master repo files
3. Report what changed and why
4. Note which existing forked projects might benefit from the update

When Mike says "create a new project":

1. Identify the framework and tier
2. Generate the filled Bolt prompt
3. Create a new folder: `../projects/[project-name]/` with:
   - `PROJECT.md` — project name, framework used, tier, date started, Bolt URL
   - `PROMPT-USED.md` — the exact prompt that was pasted into Bolt
   - `NOTES.md` — any decisions made, variables filled, things to remember

---

## Active projects (update as projects are created)

| Project | Framework | Tier | Status | Bolt URL |
|---------|-----------|------|--------|----------|
| (none yet) | | | | |

---

## Improvements backlog (add to this as you discover them)

Things to add to the master framework on next update:
- [ ] (empty — add ideas here)

---

*Maintained by MJW Design. Last updated: March 2026. Backend migrated from Supabase → PocketBase on Hostinger.*
