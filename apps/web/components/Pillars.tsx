const PILLARS = [
  {
    num: '01',
    title: 'Tribes',
    sub: 'Your people, found for you.',
    body: 'A small group of five to seven people, matched on the things that actually make friendships stick. Skedaddle proposes a shared experience each week and learns what brings your group closer.',
    tag: 'Your crew, picked for you',
  },
  {
    num: '02',
    title: 'Family Tribe',
    sub: 'Bring your own crew closer.',
    body: 'Your family is a team with competing calendars and not enough shared time. Skedaddle coordinates experiences built around your household — the right activity, the right moment, the logistics handled.',
    tag: 'Your nucleus, in sync',
  },
  {
    num: '03',
    title: 'Family Pods',
    sub: 'Find your village.',
    body: "Once your family's in rhythm, Skedaddle widens the circle — matching you with like-minded families nearby on your kids' ages, your values, and the activities you all love.",
    tag: 'Families who fit',
  },
  {
    num: '04',
    title: 'Community OS',
    sub: 'Turn newcomers into members who stay.',
    body: "Infrastructure for churches, schools, and community organizations. Welcome every newcomer, understand who they are, and connect them to the small groups, roles, and activities where they'll belong.",
    tag: 'For institutions',
  },
  {
    num: '05',
    title: 'Connection Graph™',
    sub: 'Gets smarter every time you show up.',
    body: 'Every shared experience teaches Skedaddle something. That understanding flows into every future match — so the platform grows sharper the more people it brings together.',
    tag: 'Smarter with every connection',
  },
];

export default function Pillars() {
  return (
    <section className="pillars" id="tiers">
      <div className="pillars-inner">
        <div className="section-header">
          <div className="sk-label">The platform</div>
          <h2>
            Five layers.
            <br />
            One place that does the work.
          </h2>
        </div>
        <div className="pillars-grid">
          {PILLARS.map((p) => (
            <div className="pillar" key={p.num}>
              <div className="pillar-num">{p.num}</div>
              <div className="pillar-body">
                <h3>
                  {p.title} <em>{p.sub}</em>
                </h3>
                <p>{p.body}</p>
                <span className="pillar-tag">{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
