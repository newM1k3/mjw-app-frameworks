# Framework 01 — Business Ops

**For:** CRM dashboards, task managers, client portals, order management, internal tools.

**Your existing apps in this category:**
- MJW CRM Dashboard
- MJW Tasks Manager
- MJW Content Planner
- MJW Client Portal
- HFP Order Manager
- MJW Schema Verification

---

## When to use this framework

Use this when the app's primary job is to **display, filter, and manage records** — contacts, tasks, orders, content items, leads, bookings.

Ask yourself: "Is someone going to look at a list and take action on items?" If yes, this is your framework.

---

## Tier breakdown

### Tier 1 — Prototype
**What's included:**
- Dark theme (MJW palette)
- Top nav with logo placeholder and avatar
- Metric cards row (4 KPIs: big number + label)
- Filterable, sortable data table with status badges
- Slide-in detail panel (click a row to open)
- All data in localStorage via `db-stub.js`
- No auth, no backend

**Looks like:** A real dashboard. Fully functional for demos and internal use.
**Deploy time:** 20–30 minutes in Bolt.

---

### Tier 2 — Product
Everything in Tier 1, plus:
- Supabase auth (magic link login) via `auth-gate.jsx`
- Real database (Supabase) replacing localStorage
- Row-level security (users only see their own records)
- CSV export button
- Stripe payment hook (for paid portal access)
- Basic activity log

**Deploy time:** 2–4 hours including Supabase setup.

---

### Tier 3 — Scale
Everything in Tier 2, plus:
- Role system (admin / member / viewer)
- Admin panel (user management, data overview)
- Webhook support (trigger on record changes)
- Email notifications (new record, status change)
- Full audit trail
- Multi-tenant support (separate data per organization)

**Deploy time:** 1–3 days.

---

## File structure (what Bolt will generate)

```
src/
├── App.jsx
├── main.jsx
├── index.css              ← imports dark-theme.css
├── components/
│   ├── TopNav.jsx
│   ├── MetricCards.jsx
│   ├── DataTable.jsx
│   ├── DetailPanel.jsx
│   ├── StatusBadge.jsx
│   └── FilterBar.jsx
├── data/
│   └── sampleData.js      ← seed data for prototype
└── _shared/               ← copied from repo root
    ├── dark-theme.css
    ├── db-stub.js
    ├── auth-gate.jsx       ← add at Tier 2
    └── payment-hook.js     ← add at Tier 2
```

---

## Customization variables

Fill these in before pasting the Bolt prompt:

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | Name shown in nav | "Escape Maze CRM" |
| `RECORD_TYPE` | What the main records are | "Bookings", "Clients", "Orders" |
| `STATUS_VALUES` | Badge states | "Pending, Confirmed, Complete, Cancelled" |
| `METRIC_1..4` | The 4 KPI labels | "Total Bookings", "This Month", "Revenue", "Pending" |
| `COLUMNS` | Table columns | "Name, Date, Group Size, Status, Value" |
| `ACCENT_TAG` | Tag colour | `--tag-ops` (cyan) |

---

## See BOLT-PROMPT.md for the ready-to-paste Bolt prompt.
