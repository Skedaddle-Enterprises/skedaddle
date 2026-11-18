'use client';

import { useEffect, useState } from 'react';
import { saveToWaitlist } from '@/lib/waitlist';
import { TESTFLIGHT_URL, PLAY_BETA_URL } from '@/lib/beta';

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
            <div className="popup-badge">Beta now open</div>
            <h2>
              Try <em>Skedaddle</em> first.
            </h2>
            <p>
              The beta is live on iPhone and Android. Drop your email and we&apos;ll send you the
              download links right away.
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
                {status === 'saving' ? 'Saving...' : 'Send me the beta'}
              </button>
            </div>
            {status === 'error' && (
              <p style={{ color: '#B5482C', fontSize: 12, marginBottom: 8 }}>
                {email.includes('@') ? 'Something went wrong. Please try again.' : 'Enter a valid email.'}
              </p>
            )}
            <button className="popup-dismiss" onClick={() => setVisible(false)}>
              Maybe later
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>✅</div>
            <h2 style={{ marginBottom: 8 }}>Check your inbox!</h2>
            <p>We just emailed you the beta links. Or grab it now:</p>
            <p style={{ marginTop: 12, lineHeight: 2 }}>
              <a href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer">
                <strong>iPhone:</strong> Get it on TestFlight
              </a>
              <br />
              <a href={PLAY_BETA_URL} target="_blank" rel="noopener noreferrer">
                <strong>Android:</strong> Get it on Google Play
              </a>
            </p>
            <button className="btn-primary" style={{ marginTop: 18 }} onClick={() => setVisible(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
