export default function WorkflowVisual() {
  return (
    <div className="viz viz-workflow">
      <div className="viz-window">
        <div className="viz-titlebar">
          <span /><span /><span />
          <div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>
            workflow / approval.chain
          </div>
        </div>
        <div className="viz-wf-body">
          <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet">
            <path d="M60 60 L140 60" stroke="var(--navy)" strokeWidth="1" />
            <path d="M140 60 L220 60" stroke="var(--navy)" strokeWidth="1" />
            <path d="M220 60 L220 130 L140 130" stroke="var(--red)" strokeWidth="1.2" />
            <path d="M220 60 L300 60 L300 180 L220 180" stroke="var(--navy)" strokeWidth="1" />
            <g>
              <rect x="30" y="45" width="60" height="30" rx="4" fill="white" stroke="var(--navy)" />
              <text x="60" y="64" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--navy)">START</text>
            </g>
            <g>
              <rect x="110" y="45" width="60" height="30" rx="4" fill="white" stroke="var(--navy)" />
              <text x="140" y="64" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--navy)">FORM</text>
            </g>
            <g>
              <rect x="190" y="45" width="60" height="30" rx="4" fill="white" stroke="var(--red)" />
              <text x="220" y="64" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--red)">APPROVE?</text>
            </g>
            <g>
              <rect x="80" y="115" width="60" height="30" rx="4" fill="var(--red)" stroke="var(--red)" />
              <text x="110" y="134" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="white">REJECT</text>
            </g>
            <g>
              <rect x="190" y="165" width="60" height="30" rx="4" fill="var(--navy)" stroke="var(--navy)" />
              <text x="220" y="184" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="white">APPROVED</text>
            </g>
            <g>
              <rect x="270" y="165" width="90" height="30" rx="4" fill="white" stroke="var(--navy)" strokeDasharray="2 2" />
              <text x="315" y="184" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--navy)">NOTIFY</text>
            </g>
          </svg>
          <div className="viz-wf-meta">
            <span className="mono">12 nodes</span>
            <span className="mono">v4.2</span>
            <span className="mono"><span style={{ color: 'var(--red)' }}>●</span> live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
