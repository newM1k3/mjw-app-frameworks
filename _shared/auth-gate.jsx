// auth-gate.jsx
// MJW Design — PocketBase auth wrapper
// Tier 1: no auth (renders children directly)
// Tier 2: wraps children in PocketBase email/password auth gate
//
// Dependencies: pocketbase
// Install: npm install pocketbase
//
// Usage:
//   import AuthGate from '../_shared/auth-gate';
//   <AuthGate><YourApp /></AuthGate>

import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

export default function AuthGate({ children }) {
  const [isValid, setIsValid] = useState(pb.authStore.isValid);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Keep auth state in sync across tabs / token refresh
    const unsub = pb.authStore.onChange(() => {
      setIsValid(pb.authStore.isValid);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await pb.collection('users').authWithPassword(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (isValid) return children;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
    }}>
      <div style={{
        background: '#1a1f2e',
        border: '1px solid #2d3748',
        borderRadius: '12px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h2 style={{ color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Sign in</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Enter your credentials to continue.
        </p>

        <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />

        <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', marginTop: '1rem' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          style={{
            ...buttonStyle,
            opacity: (!email || !password || loading) ? 0.5 : 1,
            cursor: (!email || !password || loading) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: '#0f1117',
  border: '1px solid #2d3748',
  borderRadius: '6px',
  padding: '0.65rem 0.75rem',
  color: '#e2e8f0',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  marginTop: '1.5rem',
  background: '#6ee7f7',
  color: '#0f1117',
  border: 'none',
  borderRadius: '6px',
  padding: '0.75rem',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'opacity 0.2s',
};

// ─── Utility: get the current logged-in user ───────────────────────────────
export function getCurrentUser() {
  return pb.authStore.model;
}

// ─── Utility: sign out ─────────────────────────────────────────────────────
export function signOut() {
  pb.authStore.clear();
}

// ─── Utility: expose pb instance for use in other modules ──────────────────
export { pb };

/* Swap to OAuth (e.g. Google) by replacing authWithPassword with:
   await pb.collection('users').authWithOAuth2({ provider: 'google' });
*/
