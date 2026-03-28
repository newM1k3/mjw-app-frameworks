// db-stub.js
// MJW Design — localStorage (Tier 1) → PocketBase (Tier 2) migration shim
//
// The API is identical between tiers — swap the implementation when ready.
// Callers never need to change.
//
// Dependencies (Tier 2): pocketbase
// Install: npm install pocketbase

// ─── TIER 1: localStorage ──────────────────────────────────────────────────
// Use this in Prototype mode. No backend required.

const PREFIX = 'mjw_db_';

export const db = {
  async get(table, id) {
    const raw = localStorage.getItem(`${PREFIX}${table}_${id}`);
    return raw ? JSON.parse(raw) : null;
  },

  async list(table, filter = '') {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PREFIX}${table}_`));
    const records = keys.map(k => JSON.parse(localStorage.getItem(k)));
    if (!filter) return records;
    // Simple client-side filter: pass a function or skip for Tier 1
    return records;
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

// ─── TIER 2: PocketBase ────────────────────────────────────────────────────
// When ready to migrate, replace the body of each function below and
// export `db` from this block instead. Callers don't change.
//
// import PocketBase from 'pocketbase';
// const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
//
// export const db = {
//   async get(table, id) {
//     return await pb.collection(table).getOne(id);
//   },
//
//   async list(table, filter = '') {
//     return (await pb.collection(table).getFullList({ filter }));
//   },
//
//   async set(table, id, data) {
//     if (id) {
//       return await pb.collection(table).update(id, data);
//     } else {
//       return await pb.collection(table).create(data);
//     }
//   },
//
//   async delete(table, id) {
//     await pb.collection(table).delete(id);
//   },
// };
//
// PocketBase filter syntax examples:
//   filter: 'status = "active"'
//   filter: 'owner = "' + pb.authStore.model.id + '"'
//   filter: 'created >= "2024-01-01 00:00:00"'
