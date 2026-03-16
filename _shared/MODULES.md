# Shared modules

Drop any of these into any framework at any tier.
Each module is self-contained — copy the file, import the component, done.

---

## Module index

| File | What it does | Tier needed |
|------|-------------|-------------|
| `dark-theme.css` | MJW signature palette + base styles | 1+ |
| `card-grid.jsx` | Searchable, filterable card grid | 1+ |
| `auth-gate.jsx` | Supabase auth wrapper (login wall) | 2+ |
| `payment-hook.js` | Stripe Checkout session stub | 2+ |
| `db-stub.js` | localStorage now, Supabase later | 1→2 migration |
| `email-capture.jsx` | Email + name capture with CTA | 1+ |

---

## dark-theme.css

Your signature palette. Import once at app root.

```css
:root {
  --bg-base:       #0f1117;
  --bg-card:       #1a1f2e;
  --bg-hover:      #252d3d;
  --border:        #2d3748;
  --border-hover:  #4a5568;
  --accent:        #6ee7f7;
  --accent-2:      #a78bfa;
  --accent-glow:   rgba(110,231,247,0.12);
  --text-primary:  #e2e8f0;
  --text-muted:    #64748b;
  --text-dim:      #4a5568;

  /* Tag colours */
  --tag-ops:     #6ee7f7;
  --tag-ai:      #34d399;
  --tag-exp:     #fbbf24;
  --tag-lead:    #f87171;
  --tag-content: #a78bfa;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}

/* Card base */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 8px 32px var(--accent-glow);
}

/* Tag badge */
.tag {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

/* Gradient headline */
.gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## card-grid.jsx

Searchable card grid. Works with any data shape — pass your items and a render function.

```jsx
// card-grid.jsx
import { useState } from 'react';

export default function CardGrid({ items, renderCard, searchKeys = ['title'] }) {
  const [query, setQuery] = useState('');

  const filtered = items.filter(item =>
    searchKeys.some(key =>
      String(item[key] ?? '').toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div>
      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className="card-grid">
        {filtered.length === 0
          ? <p className="no-results">No results found.</p>
          : filtered.map((item, i) => renderCard(item, i))
        }
      </div>
    </div>
  );
}

/* Add to your CSS:
.search-wrap { display:flex; justify-content:center; margin-bottom:2rem; }
.search-wrap input {
  width:100%; max-width:420px; padding:0.6rem 1.1rem;
  border-radius:999px; border:1px solid var(--border);
  background:var(--bg-card); color:var(--text-primary);
  font-size:0.9rem; outline:none;
}
.search-wrap input:focus { border-color:var(--accent); }
.card-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1.25rem; max-width:1100px; margin:0 auto;
}
@media(max-width:860px){ .card-grid{ grid-template-columns:repeat(2,1fr); } }
@media(max-width:540px){ .card-grid{ grid-template-columns:1fr; } }
.no-results { grid-column:1/-1; text-align:center; color:var(--text-dim); padding:3rem 0; }
*/
```

---

## auth-gate.jsx

Wraps any page in a Supabase login wall. Tier 2+.

```jsx
// auth-gate.jsx
// Requires: npm install @supabase/supabase-js
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({ email });
    setSent(true);
  };

  if (loading) return <div className="auth-loading">Loading…</div>;
  if (session) return children;

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2>Sign in</h2>
        {sent ? (
          <p>Check your email for a magic link.</p>
        ) : (
          <>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button onClick={handleLogin}>Send magic link</button>
          </>
        )}
      </div>
    </div>
  );
}

/* Swap to password auth or OAuth by changing signInWithOtp to
   signInWithPassword or signInWithOAuth({ provider: 'google' }) */
```

---

## payment-hook.js

Stripe Checkout stub. Replace the API URL with your actual backend endpoint at Tier 2.

```js
// payment-hook.js
// Tier 1: logs to console (prototype mode)
// Tier 2: replace CHECKOUT_URL with your Stripe backend

const CHECKOUT_URL = import.meta.env.VITE_STRIPE_CHECKOUT_URL || null;

export async function startCheckout({ priceId, email, metadata = {} }) {
  if (!CHECKOUT_URL) {
    // Prototype mode — no backend yet
    console.log('[payment-hook] Prototype mode. Would charge:', { priceId, email, metadata });
    alert('Payment coming soon! (prototype mode)');
    return;
  }

  const res = await fetch(CHECKOUT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, email, metadata }),
  });
  const { url } = await res.json();
  window.location.href = url;
}

// Usage:
// import { startCheckout } from '../_shared/payment-hook';
// startCheckout({ priceId: 'price_xxx', email: user.email });
```

---

## db-stub.js

localStorage now, Supabase later. The API is identical — swap the implementation when ready.

```js
// db-stub.js
// Tier 1: reads/writes localStorage
// Tier 2: swap body of each function to Supabase calls — callers don't change

const PREFIX = 'mjw_db_';

export const db = {
  async get(table, id) {
    const raw = localStorage.getItem(`${PREFIX}${table}_${id}`);
    return raw ? JSON.parse(raw) : null;
  },

  async list(table) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PREFIX}${table}_`));
    return keys.map(k => JSON.parse(localStorage.getItem(k)));
  },

  async set(table, id, data) {
    const record = { id, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(`${PREFIX}${table}_${id}`, JSON.stringify(record));
    return record;
  },

  async delete(table, id) {
    localStorage.removeItem(`${PREFIX}${table}_${id}`);
  },
};

// Tier 2 migration: replace body with Supabase:
// async get(table, id) {
//   const { data } = await supabase.from(table).select('*').eq('id', id).single();
//   return data;
// }
```

---

## email-capture.jsx

Lead capture form. Tier 1 logs to console. Wire to ConvertKit / Mailchimp / your CRM at Tier 2.

```jsx
// email-capture.jsx
import { useState } from 'react';

const SUBMIT_URL = import.meta.env.VITE_EMAIL_SUBMIT_URL || null;

export default function EmailCapture({ heading, cta = 'Get access', tag = '' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

  const handleSubmit = async () => {
    setStatus('loading');
    if (!SUBMIT_URL) {
      console.log('[email-capture] Prototype mode:', { email, name, tag });
      setTimeout(() => setStatus('done'), 800);
      return;
    }
    try {
      await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, tag }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') return <p className="capture-success">You're in. Check your email.</p>;

  return (
    <div className="email-capture">
      {heading && <h3>{heading}</h3>}
      <div className="capture-fields">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={!email || status === 'loading'}
        >
          {status === 'loading' ? 'Sending…' : cta}
        </button>
      </div>
      {status === 'error' && <p className="capture-error">Something went wrong. Try again.</p>}
    </div>
  );
}
```
