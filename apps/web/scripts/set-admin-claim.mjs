#!/usr/bin/env node
/**
 * LOCAL-ONLY SCRIPT — never deployed, never run in CI or in the browser.
 *
 * Grants the `admin: true` custom claim to a Firebase Auth user so they can
 * pass the `isAdmin()` check in firestore.rules and use /admin. Run this
 * once, locally, after creating the admin's account (e.g. via the Firebase
 * console or `firebase auth:import`).
 *
 * Usage:
 *   node scripts/set-admin-claim.mjs /path/to/service-account.json <uid>
 *
 * The service-account JSON is a Firebase Admin SDK credential downloaded
 * from Project Settings → Service Accounts. Do NOT commit it — keep it
 * outside the repo or in a gitignored location.
 */
import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [, , serviceAccountPath, uid] = process.argv;

if (!serviceAccountPath || !uid) {
  console.error('Usage: node scripts/set-admin-claim.mjs <path-to-service-account.json> <uid>');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({ credential: cert(serviceAccount) });

await getAuth().setCustomUserClaims(uid, { admin: true });

console.log(`Set { admin: true } custom claim for uid=${uid}`);
console.log('The user must sign out and back in (or refresh their ID token) for the claim to take effect.');
