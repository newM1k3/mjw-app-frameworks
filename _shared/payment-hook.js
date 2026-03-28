// payment-hook.js
// MJW Design — Stripe Checkout stub
//
// Tier 1: logs to console (prototype mode — no backend required)
// Tier 2: calls your PocketBase-backed Netlify Function to create a Stripe session
//         The Netlify Function writes the resulting user_access record to PocketBase
//         after Stripe fires the invoice.paid webhook.
//
// Usage:
//   import { startCheckout } from '../_shared/payment-hook';
//   startCheckout({ priceId: 'price_xxx', userId: pb.authStore.model.id, appSlug: 'my-app' });

const CHECKOUT_URL = import.meta.env.VITE_CHECKOUT_URL || null;

/**
 * Start a Stripe Checkout session.
 * @param {object} params
 * @param {string} params.priceId       - Stripe Price ID (e.g. 'price_xxx')
 * @param {string} params.userId        - PocketBase user record ID
 * @param {string} params.appSlug       - App slug matching the apps collection in PocketBase
 * @param {string} [params.mode]        - 'subscription' (default) or 'payment'
 */
export async function startCheckout({ priceId, userId, appSlug, mode = 'subscription' }) {
  if (!CHECKOUT_URL) {
    // Prototype mode — no backend yet
    console.log('[payment-hook] Prototype mode. Would start checkout:', { priceId, userId, appSlug, mode });
    alert('Payment coming soon! (prototype mode)');
    return;
  }

  const res = await fetch(CHECKOUT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId, appSlug, mode }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Checkout error: ' + err);
  }

  const { url } = await res.json();
  window.location.href = url;
}

/**
 * Open the Stripe Customer Portal (manage billing, cancel, update card).
 * @param {string} stripeCustomerId - from PocketBase users.stripe_customer_id
 */
export async function openBillingPortal(stripeCustomerId) {
  const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || null;

  if (!PORTAL_URL) {
    console.log('[payment-hook] Prototype mode. Would open billing portal for:', stripeCustomerId);
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

// ─── ENV VARS NEEDED (Tier 2) ──────────────────────────────────────────────
// VITE_CHECKOUT_URL  = /.netlify/functions/create-checkout-session
// VITE_PORTAL_URL    = /.netlify/functions/create-portal-session
//
// Netlify Function (create-checkout-session) must:
//   1. Create a Stripe Checkout session with userId + appSlug in metadata
//   2. Return { url: session.url }
//
// Stripe webhook (stripe-webhook Netlify Function) must:
//   1. On invoice.paid: create/update user_access in PocketBase
//      { user: userId, app: appId, tier: 'pro', status: 'active' }
//   2. On customer.subscription.deleted: set status: 'cancelled'
//   3. On invoice.payment_failed: set status: 'past_due'
//
// See Platform Playbook Part 9 for complete Netlify Function reference code.
