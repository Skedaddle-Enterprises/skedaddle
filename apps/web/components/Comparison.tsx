const OTHERS = [
  'Browse events and hope someone shows up',
  'Random crowds with zero curation',
  'One-off events — no continuity or follow-through',
  'You handle all the planning and logistics',
  'No learning loop, same experience every time',
];

const SKEDADDLE = [
  'A matched Tribe built around your actual life',
  'Five to seven people built to click with you',
  'Recurring experiences that build real friendship',
  'Logistics, venue, and timing all handled',
  'Every match gets sharper as you use it',
];

export default function Comparison() {
  return (
    <section className="comparison">
      <div className="comp-inner">
        <div className="comp-header">
          <div className="sk-label">The gap in the market</div>
          <h2>
            Why existing apps
            <br />
            aren&apos;t solving this.
          </h2>
        </div>
        <div className="comp-grid">
          <div className="comp-col">
            {/* Legacy markup omitted this heading; added for clarity/parity with the "Skedaddle" column. */}
            <h3>Other apps</h3>
            <ul>
              {OTHERS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="comp-divider">
            <div className="comp-dot" />
            <div className="comp-line" />
            <div className="comp-dot" />
          </div>
          <div className="comp-col sk">
            <h3>Skedaddle</h3>
            <ul>
              {SKEDADDLE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
