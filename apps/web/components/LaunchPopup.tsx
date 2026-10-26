'use client';

import { useEffect, useState } from 'react';
import { saveToWaitlist } from '@/lib/waitlist';

export default function LaunchPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit() {
    if (!email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('saving');
    const ok = await saveToWaitlist(email, 'popup');
    setStatus(ok ? 'done' : 'error');
  }

  return (
    <div
      className={`popup-overlay${visible ? ' visible' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setVisible(false);
      }}
    >
      <div className="popup-box">
        {status !== 'done' ? (
          <>
            <button className="popup-close" onClick={() => setVisible(false)} aria-label="Close">
              ✕
            </button>
            <div className="popup-icon">🚀</div>
            <div className="popup-badge">Coming soon</div>
            <h2>
              App <em>launching</em> soon.
            </h2>
            <p>
              Skedaddle is putting the finishing touches on the coordination engine. Drop your
              email and you&apos;ll be first through the door when we launch in your city.
            </p>
            <div className="popup-form">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={status === 'error' ? { borderColor: '#B5482C' } : undefined}
              />
              <button onClick={handleSubmit} disabled={status === 'saving'}>
                {status === 'saving' ? 'Saving...' : 'Notify me'}
              </button>
            </div>
            <button className="popup-dismiss" onClick={() => setVisible(false)}>
              No thanks, I&apos;ll wait
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>✅</div>
            <h2 style={{ marginBottom: 8 }}>You&apos;re on the list!</h2>
            <p>We&apos;ll reach out as soon as Skedaddle launches in your city.</p>
            <button className="btn-primary" style={{ marginTop: 18 }} onClick={() => setVisible(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
