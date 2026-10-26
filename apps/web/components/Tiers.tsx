const TIERS = [
  {
    icon: '🧭',
    title: 'New to the city',
    sub: 'Individual · Tribes',
    body: 'Skip months of awkward coffee chats. Skedaddle places you in a matched Tribe within days and gets your calendar filled with real experiences alongside compatible people.',
  },
  {
    icon: '🏡',
    title: 'Families & parents',
    sub: 'Household · Family Pods',
    body: "Coordinate your own household and find like-minded families for your kids. Values alignment, kids' age bands, and shared activity preferences — all matched automatically.",
  },
  {
    icon: '🏛️',
    title: 'Churches & schools',
    sub: 'Institution · Community OS',
    body: 'Turn a passive welcome email into people who actually come back. Know exactly how each newcomer is settling in — and automate the follow-through that makes them stay.',
  },
];

export default function Tiers() {
  return (
    <section className="tiers">
      <div className="tiers-inner">
        <div className="section-header">
          <div className="sk-label">Who Skedaddle serves</div>
          <h2>
            Built for every
            <br />
            stage of life.
          </h2>
        </div>
        <div className="tiers-grid">
          {TIERS.map((t) => (
            <div className="tier-card" key={t.title}>
              <div className="tier-icon">{t.icon}</div>
              <h3>{t.title}</h3>
              <span className="tier-sub">{t.sub}</span>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
