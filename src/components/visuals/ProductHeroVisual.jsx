import studioImg from '../../assets/studio-preview.png';
import SuperAppPhones from './SuperAppPhones';
import WorkflowVisual from './WorkflowVisual';
import FrameworkVisual from './FrameworkVisual';
import SecurityHeroAnimation from './SecurityHeroAnimation';

export default function ProductHeroVisual({ slug }) {
  if (slug === 'studio') return (
    <img
      src={studioImg}
      alt="Plateau Studio"
      className="studio-screenshot"
    />
  );
  if (slug === 'superapp') return <SuperAppPhones />;
  if (slug === 'workflow')  return <WorkflowVisual />;
  if (slug === 'superapp')  return <SuperAppVisual />;
  if (slug === 'framework') return <FrameworkVisual />;
  if (slug === 'security')  return <SecurityHeroAnimation />;

  // horizontal
  return (
    <div className="viz" style={{ aspectRatio: '1/1' }}>
      <div className="viz-window" style={{ height: '100%' }}>
        <div className="viz-titlebar">
          <span /><span /><span />
          <div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>
            horizontal / services
          </div>
        </div>
        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, height: 'calc(100% - 37px)' }}>
          {['Docs', 'DevOps', 'Test', 'AI'].map((l, i) => (
            <div key={i} style={{
              background: i === 0 ? 'var(--navy)' : 'var(--bg-2)',
              color: i === 0 ? 'white' : 'var(--text)',
              borderRadius: 8, padding: 18,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div className="mono" style={{ fontSize: 9, opacity: .6 }}>0{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
