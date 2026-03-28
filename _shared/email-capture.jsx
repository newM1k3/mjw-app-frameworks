// email-capture.jsx
// MJW Design — Lead capture form
//
// Tier 1: logs to console (prototype mode)
// Tier 2: saves lead to PocketBase 'leads' collection
//         (create this collection in PocketBase with: email, name, tag, source fields)
//
// Usage:
//   import EmailCapture from '../_shared/email-capture';
//   <EmailCapture heading="Get early access" cta="Join the list" tag="homepage" />

import { useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');
const PROTOTYPE_MODE = !import.meta.env.VITE_POCKETBASE_URL;

export default function EmailCapture({ heading, cta = 'Get access', tag = '' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

  const handleSubmit = async () => {
    if (!email) return;
    setStatus('loading');

    if (PROTOTYPE_MODE) {
      // Prototype mode — no backend yet
      console.log('[email-capture] Prototype mode:', { email, name, tag });
      setTimeout(() => setStatus('done'), 800);
      return;
    }

    try {
      await pb.collection('leads').create({
        email,
        name,
        tag,
        source: window.location.pathname,
      });
      setStatus('done');
    } catch (err) {
      console.error('[email-capture] Error saving lead:', err);
      setStatus('error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (status === 'done') {
    return (
      <p style={{ color: '#6ee7f7', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
        You're in. We'll be in touch.
      </p>
    );
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      {heading && (
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>{heading}</h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <button
          onClick={handleSubmit}
          disabled={!email || status === 'loading'}
          style={{
            ...buttonStyle,
            opacity: (!email || status === 'loading') ? 0.5 : 1,
            cursor: (!email || status === 'loading') ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? 'Sending…' : cta}
        </button>
        {status === 'error' && (
          <p style={{ color: '#f87171', fontSize: '0.85rem' }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  background: '#1a1f2e',
  border: '1px solid #2d3748',
  borderRadius: '6px',
  padding: '0.65rem 0.75rem',
  color: '#e2e8f0',
  fontSize: '0.95rem',
  outline: 'none',
};

const buttonStyle = {
  background: '#6ee7f7',
  color: '#0f1117',
  border: 'none',
  borderRadius: '6px',
  padding: '0.75rem',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'opacity 0.2s',
};

// ─── PocketBase 'leads' collection schema ──────────────────────────────────
// Create in PocketBase Admin → Collections → New Base Collection → leads
// Fields:
//   email   (Email, required)
//   name    (Text)
//   tag     (Text)   — identifies which form/campaign captured this lead
//   source  (Text)   — URL path where the form was shown
//
// API Rule (List/View): leave empty for admin-only, or set for self-service
