# Bolt prompt — Business Ops framework

Copy the block below and paste into bolt.new.
Fill in the VARIABLES section before pasting.

---

## VARIABLES (fill these in)

```
APP_NAME       = [e.g. "Escape Maze CRM"]
RECORD_TYPE    = [e.g. "Bookings"]
STATUS_VALUES  = [e.g. "Pending, Confirmed, Complete, Cancelled"]
METRIC_1       = [e.g. "Total Bookings"]
METRIC_2       = [e.g. "This Month"]
METRIC_3       = [e.g. "Revenue"]
METRIC_4       = [e.g. "Pending Review"]
COLUMNS        = [e.g. "Name, Date, Group Size, Status, Value"]
TIER           = [1 / 2 / 3]
```

---

## BOLT PROMPT — TIER 1 (Prototype)

```
Build a React + Vite single-page app called "[APP_NAME]".

DESIGN SYSTEM (use exactly):
- Background: #0f1117
- Card background: #1a1f2e
- Border: #2d3748
- Accent / hover: #6ee7f7
- Secondary accent: #a78bfa
- Text primary: #e2e8f0
- Text muted: #64748b
- Font: Segoe UI, system-ui, sans-serif
- Card hover: translateY(-4px) + border-color accent + box-shadow rgba(110,231,247,0.12)

LAYOUT:
1. Top nav — logo "[APP_NAME]" in gradient text (cyan→purple), right side has avatar circle + "Settings" link
2. Metric cards row — 4 cards in a grid: "[METRIC_1]", "[METRIC_2]", "[METRIC_3]", "[METRIC_4]" — each shows a large number and a trend indicator (up/down arrow + percentage)
3. Filter bar — text search input + status dropdown filter + "Add [RECORD_TYPE]" button (opens modal)
4. Data table — columns: [COLUMNS] — rows have status badges, a checkbox, and a "View" action
5. Detail panel — slides in from the right when a row is clicked — shows all record fields + edit button + status change dropdown
6. Add record modal — form fields matching the columns, Cancel + Save buttons

DATA:
- All state in React useState
- Seed with 12 sample [RECORD_TYPE] records with realistic data
- Status values: [STATUS_VALUES]
- Status badge colours: first status = cyan, second = green, third = purple, fourth = red (adjust to fit)

STATUS BADGES:
Each status gets its own colour pill — background at 12% opacity, text at full colour.

INTERACTIONS:
- Search filters the table live
- Status dropdown filters the table
- Clicking a row opens the detail panel
- Detail panel has a close button (×) top right
- "Add [RECORD_TYPE]" opens a modal form
- Metric card numbers update when records change

NO backend. NO auth. NO external APIs. All data lives in component state.
Make it look production-ready, not a prototype.
```

---

## BOLT PROMPT — TIER 2 ADDITIONS

Add this block after the Tier 1 prompt to upgrade:

```
TIER 2 UPGRADES — add to the existing app:

AUTH:
- Wrap the entire app in a login gate
- Use Supabase magic link auth (email only, no password)
- Show a centered login card on #0f1117 background before auth
- After login, show the user's email in the top nav avatar tooltip
- Add a "Sign out" option in the nav

DATABASE:
- Replace all useState data with Supabase queries
- Table name: [RECORD_TYPE lowercase, e.g. "bookings"]
- Include created_at, updated_at timestamps
- Row-level security: users only see records they created (or all, for admin — use a role column)

EXPORT:
- Add "Export CSV" button to the filter bar
- Exports the currently filtered records

ENV VARS NEEDED:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## BOLT PROMPT — TIER 3 ADDITIONS

Add this block after Tier 2:

```
TIER 3 UPGRADES:

ROLES:
- Add a `role` field to the users table: admin | member | viewer
- Admins see all records and have a User Management tab
- Members can create and edit their own records
- Viewers can only read

ADMIN PANEL:
- Add an "Admin" tab in the nav (visible to admins only)
- Shows: total users, total records, records by status (bar chart), recent activity feed

WEBHOOKS:
- On record status change, POST to VITE_WEBHOOK_URL (if set) with { record, oldStatus, newStatus, changedBy, timestamp }
- Graceful fail if webhook URL not set

NOTIFICATIONS:
- Email user when a record assigned to them changes status
- Use Supabase Edge Functions + Resend for email delivery
```

---

## Cowork instruction

If using Cowork to generate a filled prompt automatically:

> "I'm building a [describe the app in 2 sentences]. Use the Business Ops framework, Tier [1/2/3]. Fill in all the variables in 01-business-ops/BOLT-PROMPT.md and give me the complete, ready-to-paste Bolt prompt."
