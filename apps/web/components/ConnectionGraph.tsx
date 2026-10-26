const NODE_ROWS = [
  ['individuals', 'households', 'organizations'],
  ['locations', 'experiences', 'outcomes'],
  ['trust signals', 'satisfaction scores'],
  ['retention effects', 'repeat contact'],
];

export default function ConnectionGraph() {
  return (
    <section className="graph-section" id="graph">
      <div className="graph-inner">
        <div className="graph-card">
          <div>
            <div className="graph-label">Connection Graph™</div>
            <h2>
              The part you never see, <br />
              but always <br />
              feel.
            </h2>
            <p>
              Every attended experience, satisfaction signal, and retained relationship feeds a
              proprietary graph that makes Skedaddle smarter and harder to copy over time. The
              data advantage compounds with every user.
            </p>
            <div className="graph-insight">
              <p>
                &quot;Families matched via outdoor activities show 3× retention vs. dining-only
                events.&quot; — the graph learns this and shifts future coordination accordingly.
              </p>
            </div>
          </div>
          <div className="graph-nodes">
            <p className="graph-nodes-label">Graph nodes &amp; edges</p>
            {NODE_ROWS.map((row, i) => (
              <div className="graph-node-row" key={i}>
                {row.map((n) => (
                  <span className="graph-node" key={n}>
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
