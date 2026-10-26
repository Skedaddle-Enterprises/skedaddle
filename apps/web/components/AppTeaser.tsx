export default function AppTeaser() {
  return (
    <section className="app-section">
      <div className="app-inner">
        <div className="app-text">
          <div className="sk-label" style={{ marginBottom: 8 }}>
            Available on mobile
          </div>
          <h3>
            Skedaddle,
            <br />
            <em>in your pocket.</em>
          </h3>
          <p>
            The full Skedaddle experience — Tribe proposals, planned experiences, your Connection
            Graph — coming soon to iOS and Android. Designed for the moment you need it, wherever
            you are.
          </p>
        </div>
        <div className="app-badges">
          <a href="#waitlist" className="app-badge">
            <span className="app-badge-icon" aria-hidden="true">
              <svg viewBox="0 0 384 512" width="22" height="22" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '.05em' }}>COMING SOON TO</div>
              <div>App Store</div>
            </div>
          </a>
          <a href="#waitlist" className="app-badge">
            <span className="app-badge-icon" aria-hidden="true">
              <svg viewBox="0 0 512 512" width="20" height="20">
                <path fill="#00d3ff" d="M47.6 33.2C42 39 38.7 47.9 38.7 59.5v393c0 11.6 3.3 20.5 9 26.3l1.3 1.2 220.2-220.2v-5.2L48.9 32z" />
                <path fill="#00f076" d="M342.4 333.3 269 259.8v-5.2l73.5-73.5 1.6 1L431 232.4c25 14.2 25 37.5 0 51.8l-87 49.1z" />
                <path fill="#ff3a44" d="M344 332.3 269 257.2 47.6 478.6c8.2 8.7 21.8 9.8 37.1 1.1z" />
                <path fill="#ffc900" d="M344 182.1 84.7 34.5c-15.3-8.7-28.9-7.6-37.1 1.1l221.4 221.3z" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '.05em' }}>COMING SOON TO</div>
              <div>Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
