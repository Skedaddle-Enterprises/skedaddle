'use client';

import { useState } from 'react';
import { saveToWaitlist } from '@/lib/waitlist';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('No spam. Unsubscribe anytime. Early access users help shape the product.');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const ok = await saveToWaitlist(email, 'landing_page_cta');
    setEmail('');
    if (ok) {
      setMsg("✓ You're on the list! We'll be in touch soon.");
      setStatus('done');
    } else {
      setMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <section className="cta" id="waitlist">
      <div className="cta-inner">
        <h2>
          Ready to <em>skip</em>
          <br />
          the awkward phase?
        </h2>
        <p>
          Join the Skedaddle waitlist and be among the first to experience social coordination
          that actually works. Launching in select cities soon.
        </p>
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving...' : 'Join waitlist'}
          </button>
        </form>
        <p
          className="cta-note"
          style={
            status === 'done'
              ? { color: '#5A7D55', fontWeight: 600 }
              : status === 'error'
                ? { color: '#B5482C' }
                : undefined
          }
        >
          {msg}
        </p>
      </div>
    </section>
  );
}
