'use client';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { getDb, getFirebaseAuth } from './firebase';

export type WaitlistSource = 'popup' | 'landing_page_cta';

/**
 * Writes an email to the `waitlist` collection. firestore.rules now requires
 * `request.auth != null` for waitlist creates, so we sign the visitor in
 * anonymously first (no credentials, no UI) before writing.
 */
export async function saveToWaitlist(email: string, source: WaitlistSource): Promise<boolean> {
  try {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }

    const db = getDb();
    const write = () =>
      addDoc(collection(db, 'waitlist'), {
        email,
        source,
        timestamp: serverTimestamp(),
        page: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : '',
      });
    try {
      await write();
    } catch {
      // Right after the first anonymous sign-in, Firestore can still be sending the request
      // without the new auth token, so the rules reject it (the "first click does nothing,
      // second click works" bug). One retry once the token has landed fixes it.
      await new Promise((r) => setTimeout(r, 800));
      await write();
    }
    return true;
  } catch (err) {
    console.error('Firestore error:', err);
    return false;
  }
}
