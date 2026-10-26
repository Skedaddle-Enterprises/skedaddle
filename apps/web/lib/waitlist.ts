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
    await addDoc(collection(db, 'waitlist'), {
      email,
      source,
      timestamp: serverTimestamp(),
      page: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : '',
    });
    return true;
  } catch (err) {
    console.error('Firestore error:', err);
    return false;
  }
}
