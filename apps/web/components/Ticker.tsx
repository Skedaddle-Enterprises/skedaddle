const ITEMS = [
  'Beta now open',
  'Now on iPhone and Android',
  'AI-matched real-world experiences',
  'Get the beta today',
  'Tribes · Family Pods · Community OS',
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
