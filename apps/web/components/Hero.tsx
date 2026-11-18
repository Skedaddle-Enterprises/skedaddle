export default function Hero() {
  return (
    <section>
      <div className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-label">
              <span>An operating system for belonging</span>
            </div>
            <h1>
              Real people.
              <br />
              <em>Real places.</em>
              <br />
              Real <em>belonging.</em>
            </h1>
            <p className="hero-sub">
              Skedaddle takes the guesswork out of community. Bring the friends, family, and
              tribe you already have — or get matched with new people who genuinely fit your
              life. Real places, real moments, all already planned.
            </p>
            <div className="hero-btns">
              <a href="#waitlist" className="btn-primary">
                Get the beta
              </a>
              <a href="#how" className="btn-secondary">
                See how it works
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <p className="hero-visual-label">What Skedaddle handles for you</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">
                  4<span>×</span>
                </div>
                <div className="hero-stat-lbl">Faster social integration than traditional methods</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">5–7</div>
                <div className="hero-stat-lbl">AI-matched Tribe size for optimal bonding</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">
                  3<span>×</span>
                </div>
                <div className="hero-stat-lbl">Higher retention via activity-matched groups</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">4</div>
                <div className="hero-stat-lbl">Tiers: Individuals, Families, Orgs & Enterprise</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
