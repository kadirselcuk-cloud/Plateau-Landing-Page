export default function StudioVisual() {
  return (
    <div className="viz viz-studio">
      <div className="viz-window">
        <div className="viz-titlebar">
          <span /><span /><span />
          <div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>
            plateau.studio / components
          </div>
        </div>
        <div className="viz-studio-body">
          <div className="viz-sidebar">
            {['Buttons', 'Inputs', 'Cards', 'Tables', 'Modal', 'Nav'].map((l, i) => (
              <div key={i} className={`viz-side-item ${i === 2 ? 'active' : ''}`}>{l}</div>
            ))}
          </div>
          <div className="viz-canvas">
            <div className="viz-card-sample">
              <div className="viz-pill" />
              <div className="viz-lines">
                <div /><div style={{ width: '60%' }} /><div style={{ width: '80%' }} />
              </div>
            </div>
            <div className="viz-card-sample small">
              <div className="viz-pill small" />
              <div className="viz-lines"><div /><div style={{ width: '50%' }} /></div>
            </div>
            <div className="viz-ai-hint mono">AI: generate card variant →</div>
          </div>
        </div>
      </div>
    </div>
  );
}
