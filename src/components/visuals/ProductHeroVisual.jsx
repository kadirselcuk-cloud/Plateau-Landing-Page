import studioImg from '../../assets/studio-preview.png';
import heroVideo from '../../assets/plateau-hero.mp4';
import SuperAppPhones from './SuperAppPhones';
import SecurityHeroAnimation from './SecurityHeroAnimation';
import {
  DatabaseZap,
  BarChart3,
  FileText,
  Bell,
  GitBranch,
  FlaskConical,
  Sparkles,
  Calendar,
} from 'lucide-react';

const SERVICES = [
  { label: 'Eventstore',   Icon: DatabaseZap },
  { label: 'Reporting',    Icon: BarChart3 },
  { label: 'Document Mgmt',Icon: FileText },
  { label: 'Notification', Icon: Bell },
  { label: 'DevOps',       Icon: GitBranch },
  { label: 'Test Auto.',   Icon: FlaskConical },
  { label: 'AI Tooling',   Icon: Sparkles },
  { label: 'Scheduler',    Icon: Calendar },
];

function ServicesVisual() {
  return (
    <div className="viz" style={{ aspectRatio: '1/1' }}>
      <div className="viz-window" style={{ height: '100%' }}>
        <div className="viz-titlebar">
          <span /><span /><span />
          <div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>
            plateau / services
          </div>
        </div>
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, height: 'calc(100% - 37px)' }}>
          {SERVICES.map(({ label, Icon, accent }, i) => (
            <div key={i} style={{
              background: accent ? 'var(--navy)' : 'var(--bg-2)',
              color: accent ? 'white' : 'var(--text)',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 8,
            }}>
              <Icon size={26} strokeWidth={1.5} color={accent ? 'rgba(255,255,255,0.7)' : 'var(--red)'} />
              <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductHeroVisual({ slug }) {
  if (slug === 'studio') return (
    <img src={studioImg} alt="Plateau Studio" className="studio-screenshot" />
  );
  if (slug === 'superapp')  return <SuperAppPhones />;
  if (slug === 'workflow' || slug === 'framework') return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '16/9' }}>
      <video src={heroVideo} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
  if (slug === 'security')  return <SecurityHeroAnimation />;
  if (slug === 'services')  return <ServicesVisual />;

  return null;
}
