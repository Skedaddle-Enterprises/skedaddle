const ITEMS = [
  'App launching soon',
  'Join the waitlist today',
  'AI-matched real-world experiences',
  'Now accepting early access signups',
  'Tribes · Family Pods · Community OS',
  'Launching in select cities soon',
  'Connection Graph™ — your social moat',
];

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker" role="marquee">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span className="ticker-item" key={i}>
            {item} <span className="ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
