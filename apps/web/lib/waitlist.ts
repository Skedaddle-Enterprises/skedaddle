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
/** Returns null on success, or a short error code to show the visitor (and us) on failure. */
export async function saveToWaitlist(email: string, source: WaitlistSource): Promise<string | null> {
  try {
    const auth = getFirebaseAuth();
    // currentUser is null until Auth finishes restoring a saved session, so wait for that
    // instead of starting a second anonymous sign-in mid-restore.
    await auth.authStateReady();
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    // Make sure the ID token exists before Firestore's first request goes out.
    await auth.currentUser?.getIdToken();

    const db = getDb();
    const write = () =>
      addDoc(collection(db, 'waitlist'), {
        email,
        source,
        timestamp: serverTimestamp(),
        page: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : '',
      });
    // Retried because the first write after a fresh anonymous sign-in has been seen to fail
    // while a second click succeeds.
    for (let attempt = 1; ; attempt++) {
      try {
        await write();
        return null;
      } catch (err) {
        if (attempt >= 3) throw err;
        console.warn('Waitlist write failed, retrying:', err);
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  } catch (err) {
    console.error('Waitlist error:', err);
    return (err as { code?: string })?.code || 'unknown';
  }
}
