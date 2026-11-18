export default function TribeCard() {
  return (
    <section className="tribe-section">
      <div className="tribe-inner">
        <div className="tribe-card">
          <div className="tribe-card-top">
            <div>
              <div className="tribe-proposal-label">New Proposal</div>
              <div className="tribe-card-title">
                Dawn
                <br />
                Runners
                <br />
                Tribe
              </div>
            </div>
            <div className="tribe-match-badge">
              <span className="pct">91%</span>
              <span className="lbl">Match</span>
            </div>
          </div>
          <div className="tribe-ai-quote">
            <span className="sparkle">✦</span>
            <p>
              &quot;You share a love of early mornings, trail runs, and the kind of brunch that
              earns it.&quot;
            </p>
          </div>
          <div className="tribe-members-label">Proposed Members</div>
          <div className="tribe-avatars">
            <div className="tribe-avatar" style={{ background: '#C8784A' }}>
              M
            </div>
            <div className="tribe-avatar" style={{ background: '#5A7D55' }}>
              P
            </div>
            <div className="tribe-avatar" style={{ background: '#94A37E' }}>
              J
            </div>
            <div className="tribe-avatar" style={{ background: '#E8A07F' }}>
              S
            </div>
            <div className="tribe-avatar-more">+1</div>
          </div>
          <div className="tribe-tags">
            <span className="sk-tag amber">🌅 Early Riser</span>
            <span className="sk-tag green">🏃 Trail Running</span>
            <span className="sk-tag violet">🥑 Avocado Toast</span>
          </div>
          {/* A sample tribe: both lead to the beta signup form. */}
          <a href="#waitlist" className="tribe-cta">
            Join This Tribe
          </a>
          <a href="#waitlist" className="tribe-see-another">
            See Another Option
          </a>
        </div>
        <div className="tribe-text">
          <div className="sk-label" style={{ marginBottom: 8 }}>
            Tribes in action
          </div>
          <h2>
            Your perfect crew,
            <br />
            <em>proposed by AI.</em>
          </h2>
          <p>
            Skedaddle&apos;s Assimilation Engine analyzes your profile, schedule, and interests to
            propose a Tribe — a small cohort of 5–7 compatible people nearby. You see the match
            score, the AI&apos;s reasoning, and proposed members before you commit.
          </p>
          <p>
            No awkward introductions. No cold group chats. Just a ready-made crew and a first
            experience already planned.
          </p>
          <ul className="tribe-features">
            <li>
              <span className="feat-icon">✦</span> AI-written match explanation for every Tribe
              proposal
            </li>
            <li>
              <span className="feat-icon">✦</span> Compatibility score based on 5 behavioral
              dimensions
            </li>
            <li>
              <span className="feat-icon">✦</span> Don&apos;t like it? Request a new Tribe
              instantly
            </li>
            <li>
              <span className="feat-icon">✦</span> First experience proposed and coordinated
              automatically
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
