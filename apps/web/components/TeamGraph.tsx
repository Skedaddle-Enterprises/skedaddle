'use client';

import { useEffect, useRef, useState } from 'react';

type Member = {
  name: string;
  role: string;
  ini: string;
  color: string;
  photo: string;
  bio: string;
};

const TEAM: Member[] = [
  {
    name: 'Raynard Mack',
    role: 'Founder',
    ini: 'RM',
    color: '#C8784A',
    photo: '/RayMac.png',
    bio: "Raynard is the originating force behind Skedaddle. He saw a world where people were more digitally connected than ever — and lonelier than ever — and decided to build the fix. A visionary with the conviction to turn a big idea into a real product, Raynard laid the foundation for an entirely new category: AI-powered real-world belonging. He's not just building an app. He's building the infrastructure for human connection.",
  },
  {
    name: 'Swetha Guruju',
    role: 'Co-Founder',
    ini: 'SG',
    color: '#B5482C',
    photo: '/swetha.jpg',
    bio: "Swetha is the heart behind Skedaddle's vision. With a background in software engineering and a builder's instinct for solving real human problems, she co-founded Skedaddle on a simple but powerful belief — that technology should bring people together, not keep them scrolling. She leads with empathy, moves with urgency, and refuses to ship anything that doesn't genuinely make people's lives more connected.",
  },
  {
    name: 'Harshathabhinav Anusuya Suresh',
    role: 'CTO',
    ini: 'HA',
    color: '#4A6B8A',
    photo: '/harshathabhinav.jpg',
    bio: "Harshathabhinav leads Skedaddle's technology across cloud, iOS and Android. He architected the serverless backend on Firebase and Google Cloud that powers both apps: tribe matching, student verification, and Scout, the AI planner. He also drives engineering on the native iOS (SwiftUI) and Android (Kotlin) apps. As CTO, he owns the technical roadmap, security and release quality, keeping Skedaddle fast, private and ready to scale city by city.",
  },
  {
    name: 'Taraka Mutyala',
    role: 'Head of Trust, Safety & Security',
    ini: 'TM',
    color: '#94A37E',
    photo: '/Taraka.jpg',
    bio: 'Taraka ensures that Skedaddle is a space where real people feel genuinely safe. With a background spanning cybersecurity analysis and systems engineering, he architects the trust layer that makes verified, in-person connection possible at scale. In a world full of anonymous apps, Taraka is the reason Skedaddle can promise: everyone here is real.',
  },
  {
    name: 'Shruti Akella',
    role: 'Lead Test Engineer',
    ini: 'SA',
    color: '#B08968',
    photo: '/shruti.jpg',
    bio: "Shruti is the reason bugs don't make it to the people we're trying to bring together. She leads testing across Skedaddle's web and app surfaces, building out the test strategy, catching regressions before they ship, and holding every release to the same bar: it has to actually work for real people, in real conditions, every time.",
  },
  {
    name: 'Pilla Kusuma Pravallika',
    role: 'Co-Founder',
    ini: 'PP',
    color: '#5A7D55',
    photo: '/pilla.jpg',
    bio: "Pravallika is one of the first hands that shaped Skedaddle's foundation. A full-stack developer and cloud-native builder with experience in AI-driven applications, she brings both depth and speed to everything she touches. From scalable backend systems to seamless user experiences, Pravallika's fingerprints are on the architecture that makes the Assimilation Engine actually work.",
  },
];

export default function TeamGraph() {
  const graphRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    const graph = graphRef.current;
    const svg = svgRef.current;
    if (!graph || !svg) return;

    function layout() {
      if (!graph || !svg) return;
      const w = graph.clientWidth;
      const h = graph.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const nodes = nodeRefs.current;
      const nodeR = (nodes[0]?.offsetWidth || 74) / 2;
      const R = Math.min(w, h) / 2 - nodeR - 6;
      const pts: { x: number; y: number }[] = [];

      nodes.forEach((node, i) => {
        if (!node) return;
        const ang = ((-90 + i * (360 / nodes.length)) * Math.PI) / 180;
        const x = cx + R * Math.cos(ang);
        const y = cy + R * Math.sin(ang);
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        pts.push({ x, y });
      });

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      let s = '';
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % pts.length];
        s += `<line class="tedge tedge-ring" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
      });
      pts.forEach((p, i) => {
        s += `<line class="tedge tspoke" data-i="${i}" x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}"/>`;
      });
      svg.innerHTML = s;
      svg.querySelectorAll('.tspoke').forEach((e) => {
        e.classList.toggle('lit', Number((e as HTMLElement).dataset.i) === active);
      });
    }

    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    return () => {
      window.removeEventListener('resize', layout);
      window.removeEventListener('load', layout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll('.tspoke').forEach((e) => {
      e.classList.toggle('lit', Number((e as HTMLElement).dataset.i) === active);
    });
  }, [active]);

  function selectMember(i: number) {
    if (i === active) return;
    setActive(i);
    setHintVisible(false);
    setSwap(false);
    requestAnimationFrame(() => setSwap(true));
  }

  const current = TEAM[active];

  return (
    <>
      <section className="team-hero">
        <div className="hero-label">
          <span>Meet the team</span>
        </div>
        <h1>
          The people building <em>belonging.</em>
        </h1>
        <p>
          Skedaddle isn&apos;t a feature — it&apos;s an infrastructure for human connection.
          Explore the graph below: each of us is a node. Hover or tap to meet the person behind
          it.
        </p>
      </section>

      <section className="tstage-section">
        <div className="tstage">
          <div className="tstage-inner">
            <div>
              <div className="tgraph" ref={graphRef}>
                <svg
                  className="tgraph-edges"
                  ref={svgRef}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                />
                <div className="tpulse" />
                <div className="tpulse" />
                <div className="tpulse" />
                <div className="tnucleus">
                  <img src="/logo-mark.svg" alt="Skedaddle" />
                  <span>
                    Connection
                    <br />
                    Graph™
                  </span>
                </div>
                {TEAM.map((m, i) => (
                  <button
                    key={m.name}
                    type="button"
                    className={`tnode${i === active ? ' active' : ''}`}
                    aria-label={`${m.name}, ${m.role}`}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    onClick={() => selectMember(i)}
                    onMouseEnter={() => {
                      if (window.matchMedia('(hover:hover)').matches) selectMember(i);
                    }}
                  >
                    <span
                      className="tnode-av"
                      style={{ ['--c' as string]: m.color, animationDelay: `${(i * 0.5).toFixed(2)}s` }}
                    >
                      <span className="tnode-ini">{m.ini}</span>
                      <img src={m.photo} alt="" onError={(e) => e.currentTarget.remove()} />
                    </span>
                    <span className="tnode-tag">{m.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              <div className="tgraph-hint" style={{ opacity: hintVisible ? 1 : 0 }}>
                Hover or tap a node to meet them →
              </div>
            </div>

            <div className={`tdetail${swap ? ' swap' : ''}`}>
              <div className="tdetail-idx">
                {String(active + 1).padStart(2, '0')} / {String(TEAM.length).padStart(2, '0')}
              </div>
              <div className="tdetail-head">
                <div className="tdetail-av" style={{ ['--c' as string]: current.color }}>
                  <span className="tnode-ini">{current.ini}</span>
                  <img src={current.photo} alt="" onError={(e) => e.currentTarget.remove()} />
                </div>
                <div>
                  <div className="tdetail-name">{current.name}</div>
                  <div className="tdetail-role">{current.role}</div>
                </div>
              </div>
              <p className="tdetail-bio">{current.bio}</p>
              <div className="tdetail-dots">
                {TEAM.map((m, i) => (
                  <button
                    key={m.name}
                    type="button"
                    className={`tdetail-dot${i === active ? ' active' : ''}`}
                    aria-label={m.name}
                    onClick={() => selectMember(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tvalues">
        <h2>
          We&apos;re building the fix for a <em>lonelier</em> world.
        </h2>
        <p>
          More digitally connected than ever, and lonelier than ever. We decided to build the
          thing that turns aligned people into real-world belonging. Want in?
        </p>
        <a href="/#waitlist">Get the beta</a>
      </section>
    </>
  );
}
