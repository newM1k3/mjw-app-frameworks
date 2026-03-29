# MJW Shared Modules

Drop-in modules that work across all five frameworks.
Each module is self-contained — copy the file, import the component, done.
All modules are Tier 1 ready (no backend) and Tier 2 upgradeable (PocketBase on Hostinger).

---

## Module index

| File | What it does | Tier needed |
|------|-------------|-------------|
| `dark-theme.css` | MJW signature palette + base styles | 1+ |
| `card-grid.jsx` | Searchable, filterable card grid | 1+ |
| `auth-gate.jsx` | PocketBase auth wrapper (login wall) | 2+ |
| `payment-hook.js` | Stripe Checkout + Billing Portal stub | 2+ |
| `db-stub.js` | localStorage now, PocketBase later | 1→2 migration |
| `email-capture.jsx` | Email + name capture → PocketBase leads | 1+ |
| `lib/faceDetection.ts` | Client-side face detection via face-api.js (TensorFlow.js) | 1+ |
| `lib/imageCompression.ts` | Client-side image compression via Canvas API | 1+ |

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

Wraps any page in a PocketBase login wall. Tier 2+.

```jsx
// auth-gate.jsx
// Requires: npm install pocketbase
// Set VITE_POCKETBASE_URL in .env

import PocketBase from 'pocketbase';
import { useState, useEffect } from 'react';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

export default function AuthGate({ children }) {
  const [isValid, setIsValid] = useState(pb.authStore.isValid);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => setIsValid(pb.authStore.isValid));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await pb.collection('users').authWithPassword(email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  if (isValid) return children;

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2>Sign in</h2>
        <input type="email" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="••••••••"
          value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="auth-error">{error}</p>}
        <button onClick={handleLogin} disabled={!email || !password || loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}

export function getCurrentUser() { return pb.authStore.model; }
export function signOut() { pb.authStore.clear(); }
export { pb };

/* Swap to OAuth (e.g. Google):
   await pb.collection('users').authWithOAuth2({ provider: 'google' }); */
```

**ENV VAR required:**
```
VITE_POCKETBASE_URL = https://api.yourdomain.com
```

---

## payment-hook.js

Stripe Checkout stub. Tier 1 logs to console. Tier 2 calls a Netlify Function that writes to PocketBase.

```js
// payment-hook.js
// Tier 1: logs to console (prototype mode)
// Tier 2: calls Netlify Function → Stripe → PocketBase user_access

const CHECKOUT_URL = import.meta.env.VITE_CHECKOUT_URL || null;
const PORTAL_URL   = import.meta.env.VITE_PORTAL_URL   || null;

export async function startCheckout({ priceId, userId, appSlug, mode = 'subscription' }) {
  if (!CHECKOUT_URL) {
    console.log('[payment-hook] Prototype mode:', { priceId, userId, appSlug });
    alert('Payment coming soon! (prototype mode)');
    return;
  }
  const res = await fetch(CHECKOUT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId, appSlug, mode }),
  });
  const { url } = await res.json();
  window.location.href = url;
}

export async function openBillingPortal(stripeCustomerId) {
  if (!PORTAL_URL) {
    console.log('[payment-hook] Prototype mode. Portal for:', stripeCustomerId);
    alert('Billing portal coming soon! (prototype mode)');
    return;
  }
  const res = await fetch(PORTAL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stripeCustomerId }),
  });
  const { url } = await res.json();
  window.location.href = url;
}
```

**ENV VARS required (Tier 2):**
```
VITE_CHECKOUT_URL = /.netlify/functions/create-checkout-session
VITE_PORTAL_URL   = /.netlify/functions/create-portal-session
```

**PocketBase collections required:**
- `apps` — `name`, `slug`, `url`, `is_active`
- `user_access` — `user` (→users), `app` (→apps), `tier`, `status`, `trial_ends_at`, `stripe_subscription_id`

See Platform Playbook Part 9 for complete Netlify Function reference code.

---

## db-stub.js

localStorage now, PocketBase later. The API is identical — swap the implementation when ready.

```js
// db-stub.js
// Tier 1: reads/writes localStorage
// Tier 2: swap body of each function to PocketBase calls — callers don't change

const PREFIX = 'mjw_db_';

export const db = {
  async get(table, id) {
    const raw = localStorage.getItem(`${PREFIX}${table}_${id}`);
    return raw ? JSON.parse(raw) : null;
  },
  async list(table, filter = '') {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PREFIX}${table}_`));
    return keys.map(k => JSON.parse(localStorage.getItem(k)));
  },
  async set(table, id, data) {
    const record = { id, ...data, updated: new Date().toISOString() };
    localStorage.setItem(`${PREFIX}${table}_${id}`, JSON.stringify(record));
    return record;
  },
  async delete(table, id) {
    localStorage.removeItem(`${PREFIX}${table}_${id}`);
  },
};

// Tier 2 migration — replace body with PocketBase:
// import PocketBase from 'pocketbase';
// const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
// export const db = {
//   async get(table, id)          { return await pb.collection(table).getOne(id); },
//   async list(table, filter='')  { return await pb.collection(table).getFullList({ filter }); },
//   async set(table, id, data)    { return id
//     ? await pb.collection(table).update(id, data)
//     : await pb.collection(table).create(data); },
//   async delete(table, id)       { await pb.collection(table).delete(id); },
// };
```

---

## email-capture.jsx

Lead capture form. Tier 1 logs to console. Tier 2 saves to PocketBase `leads` collection.

```jsx
// email-capture.jsx
// Requires: npm install pocketbase
// PocketBase 'leads' collection: email (Email), name (Text), tag (Text), source (Text)

import { useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');
const PROTOTYPE_MODE = !import.meta.env.VITE_POCKETBASE_URL;

export default function EmailCapture({ heading, cta = 'Get access', tag = '' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async () => {
    setStatus('loading');
    if (PROTOTYPE_MODE) {
      console.log('[email-capture] Prototype mode:', { email, name, tag });
      setTimeout(() => setStatus('done'), 800);
      return;
    }
    try {
      await pb.collection('leads').create({ email, name, tag, source: window.location.pathname });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') return <p className="capture-success">You're in. We'll be in touch.</p>;

  return (
    <div className="email-capture">
      {heading && <h3>{heading}</h3>}
      <div className="capture-fields">
        <input type="text" placeholder="Your name"
          value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Your email"
          value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={handleSubmit} disabled={!email || status === 'loading'}>
          {status === 'loading' ? 'Sending…' : cta}
        </button>
      </div>
      {status === 'error' && <p className="capture-error">Something went wrong. Try again.</p>}
    </div>
  );
}
```

---

## PocketBase quick reference

**Core platform collections:**

| Collection | Purpose |
|------------|---------|
| `users` | Auth — built-in PocketBase users collection |
| `apps` | One record per app on the platform |
| `user_access` | Tier/status per user per app |
| `leads` | Email capture leads |

**Accessing PocketBase in any component:**
```js
import PocketBase from 'pocketbase';
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
```

**ENV VAR required in every Tier 2+ app:**
```
VITE_POCKETBASE_URL = https://api.yourdomain.com
```

---

---

## lib/faceDetection.ts

Client-side face detection using `face-api.js` (TensorFlow.js). Detects all faces in an `<img>` element and returns bounding boxes, 68-point landmarks, and confidence scores. No server required. Includes a `drawFaceDetections()` canvas helper for rendering overlays.

**Dependency:** `pnpm add @vladmandic/face-api`

```ts
import { detectFaces, drawFaceDetections } from '../_shared/lib/faceDetection';

const imgEl = document.getElementById('photo') as HTMLImageElement;
const faces = await detectFaces(imgEl);
// faces[0].boundingBox, faces[0].confidence, faces[0].landmarks

// Optional: draw bounding boxes on a canvas overlay
drawFaceDetections(canvasEl, imgEl, faces);
```

**Notes:**
- Models load lazily on first call and are cached — no repeated CDN fetches.
- Detection threshold auto-adjusts for dark images (brightness < 0.3 → threshold 0.3).
- `drawFaceDetections()` accepts an optional `DrawOptions` param to customise box colour and fonts.

---

## lib/imageCompression.ts

Client-side image compression using the Canvas API. Resizes images to fit within a `maxWidth × maxHeight` envelope while preserving aspect ratio, then re-encodes at a configurable quality level. Returns both a `dataUrl` (for display) and a `Blob` (for upload).

**Dependency:** none (pure browser Canvas API — no install required)

```ts
import { compressImage, formatFileSize } from '../_shared/lib/imageCompression';

const result = await compressImage(file, {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
});
console.log(`${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)}`);
// Upload result.blob via FormData, or pass result.dataUrl as a base64 string
```

**Notes:**
- Default settings (1920×1920, 85% JPEG) are tuned for AI image generation reference uploads.
- For thumbnails or avatars, use `{ maxWidth: 400, maxHeight: 400, quality: 0.80 }`.
- `compressionRatio` in the result is the percentage reduction in file size (0–100).

---

*MJW Design — Last updated: March 2026*
