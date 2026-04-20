export default function FrameworkVisual() {
  const layers = ['MONITORING', 'TRACING', 'LOGGING', 'CACHING'];
  return (
    <div className="viz viz-framework">
      <div className="fw-stack">
        {layers.map((l, i) => (
          <div key={i} className="fw-layer">
            <span className="mono">{l}</span>
            <div className="fw-bars">
              {Array.from({ length: 20 }).map((_, j) => (
                <span key={j} style={{ height: `${30 + ((i * 7 + j * 11) % 60)}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="fw-core">
        <div className="fw-core-label mono">PLATEAU FRAMEWORK CORE</div>
        <div className="fw-core-runtimes">
          <div className="fw-core-chip">JAVA</div>
          <div className="fw-core-chip">.NET</div>
        </div>
      </div>
    </div>
  );
}
