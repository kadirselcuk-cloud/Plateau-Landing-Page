export function EdgeDiagram() {
  return (
    <svg viewBox="0 0 120 60">
      <line x1="0" y1="30" x2="50" y2="30" stroke="var(--text-3)" strokeWidth="0.8" />
      <rect x="50" y="20" width="20" height="20" fill="var(--red)" />
      <line x1="70" y1="30" x2="120" y2="30" stroke="var(--text-3)" strokeWidth="0.8" />
      <circle cx="95" cy="15" r="3" fill="var(--navy)" />
      <circle cx="95" cy="45" r="3" fill="var(--navy)" />
      <circle cx="110" cy="30" r="3" fill="var(--navy)" />
    </svg>
  );
}

export function IAMDiagram() {
  return (
    <svg viewBox="0 0 120 60">
      <circle cx="20" cy="30" r="6" fill="none" stroke="var(--navy)" strokeWidth="1" />
      <rect x="50" y="22" width="20" height="16" fill="var(--navy)" />
      <path d="M70 30 L100 14 M70 30 L100 30 M70 30 L100 46" stroke="var(--red)" strokeWidth="0.8" />
      <circle cx="103" cy="14" r="2.5" fill="var(--red)" />
      <circle cx="103" cy="30" r="2.5" fill="var(--red)" />
      <circle cx="103" cy="46" r="2.5" fill="var(--red)" />
    </svg>
  );
}

export function HeimdallrDiagram() {
  return (
    <svg viewBox="0 0 120 60">
      <path d="M60 8 L100 22 L100 40 Q100 52 60 58 Q20 52 20 40 L20 22 Z" fill="none" stroke="var(--navy)" strokeWidth="1.2" />
      <circle cx="60" cy="32" r="6" fill="var(--red)" />
      <line x1="60" y1="32" x2="60" y2="40" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

export function ZOKADiagram() {
  return (
    <svg viewBox="0 0 120 60">
      <rect x="15" y="18" width="40" height="24" fill="none" stroke="var(--navy)" strokeWidth="1" />
      <path d="M15 18 L35 34 L55 18" stroke="var(--navy)" strokeWidth="1" fill="none" />
      <rect x="65" y="18" width="40" height="24" fill="var(--red)" />
      <path d="M65 18 L85 34 L105 18" stroke="white" strokeWidth="1" fill="none" />
      <line x1="58" y1="30" x2="63" y2="30" stroke="var(--red)" strokeWidth="1.5" />
    </svg>
  );
}
