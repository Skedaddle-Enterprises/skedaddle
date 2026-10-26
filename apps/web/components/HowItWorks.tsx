'use client';

import { useState } from 'react';

const STEPS = [
  {
    title: 'Profile & intake',
    body: 'Life stage, interests, schedule, social comfort level, and personality style — captured once, refined continuously through behavior.',
  },
  {
    title: 'Tribe assignment',
    body: 'The Assimilation Engine matches you to 5–7 compatible people nearby with overlapping availability and shared core interests.',
  },
  {
    title: 'AI proposes the experience',
    body: 'Weather check, venue selection, travel time fairness, RSVP flow — all handled automatically. You get a ready-to-confirm invite.',
  },
  {
    title: 'Show up and connect',
    body: 'Post-experience feedback feeds back into the Connection Graph, improving every future match for you and your tribe.',
  },
];

// Note: the legacy page auto-advanced this carousel on a timer with swipe
// support. Ported here as a simple, accessible click-through carousel —
// same content, simplified interaction.
export default function HowItWorks() {
  const [cur, setCur] = useState(0);

  return (
    <section className="how" id="how">
      <div className="how-inner">
        <div>
          <div className="section-header">
            <div className="sk-label">Experience flow</div>
            <h2>
              From sign-up
              <br />
              to real friendship.
            </h2>
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
            The coordination engine handles everything from intake to outcome. You just show up.
          </p>
        </div>
        <div className="steps-carousel">
          <div className="steps-track">
            <div className="step-slide active">
              <div className="step-circle">{cur + 1}</div>
              <div className="step-content">
                <h4>{STEPS[cur].title}</h4>
                <p>{STEPS[cur].body}</p>
              </div>
            </div>
          </div>
          <div className="steps-controls">
            <button
              className="steps-arrow"
              aria-label="Previous step"
              type="button"
              onClick={() => setCur((c) => (c - 1 + STEPS.length) % STEPS.length)}
            >
              ←
            </button>
            <div className="steps-dots">
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  className={`steps-dot${i === cur ? ' active' : ''}`}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  type="button"
                  onClick={() => setCur(i)}
                />
              ))}
            </div>
            <button
              className="steps-arrow"
              aria-label="Next step"
              type="button"
              onClick={() => setCur((c) => (c + 1) % STEPS.length)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
