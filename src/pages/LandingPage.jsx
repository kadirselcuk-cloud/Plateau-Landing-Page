import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useI18n } from '../hooks/useI18n';
import { useReveal } from '../hooks/useReveal';
import { useCounter } from '../hooks/useCounter';
import { DEMO_URL } from '../i18n';
import studioImg from '../assets/studio-preview.png';
import SuperAppPhones from '../components/visuals/SuperAppPhones';
import refIsbank      from '../assets/refs/isbank.svg';
import refZiraat      from '../assets/refs/ziraat.gif';
import refMaximum     from '../assets/refs/maximum.svg';
import refIsfaktoring from '../assets/refs/isfaktoring.svg';
import refFigopara    from '../assets/refs/figopara.svg';
import refProemtia    from '../assets/refs/proemtia.svg';
import refProsevkiyat from '../assets/refs/prosevkiyat.svg';
import refIsyatirim   from '../assets/refs/isyatirim.svg';
import refIsportfoy   from '../assets/refs/isportfoy.gif';
import refPazarama    from '../assets/refs/pazarama.jpg';
import refNays        from '../assets/refs/nays.webp';
import refIserisim    from '../assets/refs/iserisim.jpg';
import { Shield, KeyRound, Fingerprint, ShieldAlert, MousePointer2, Users, Zap, Server, Terminal, Network, Wand2, Gauge, DatabaseZap, BarChart3, FileText, Bell, GitBranch, FlaskConical, Sparkles, Calendar } from 'lucide-react';

// ----- TWEAKS (editable defaults) -----
const TWEAKS = {
  accentIntensity: 100,
  heroVariant: 'editorial',
  productsLayout: 'vertical',
};

function useTweaks() {
  const [v, setV] = useState(TWEAKS);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const update = (patch) => {
    const next = { ...v, ...patch };
    setV(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };
  return { v, update, open };
}

function TweaksPanel({ v, update, open }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, zIndex: 9999,
      background: 'white', border: '1px solid var(--line-2)',
      borderRadius: 16, padding: 18, width: 300,
      boxShadow: '0 20px 60px rgba(21,18,51,0.15)',
      fontFamily: 'var(--sans)',
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>Tweaks</div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: 'var(--text-2)' }}>Accent intensity: {v.accentIntensity}%</label>
        <input type="range" min="40" max="120" value={v.accentIntensity}
          onChange={e => update({ accentIntensity: +e.target.value })}
          style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Hero variant</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['editorial', 'constellation'].map(x => (
            <button key={x} onClick={() => update({ heroVariant: x })} style={{
              flex: 1, padding: '8px', fontSize: 12,
              border: '1px solid var(--line-2)',
              background: v.heroVariant === x ? 'var(--navy)' : 'white',
              color: v.heroVariant === x ? 'white' : 'var(--text)',
              borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            }}>{x}</button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Products layout</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['vertical', 'grid'].map(x => (
            <button key={x} onClick={() => update({ productsLayout: x })} style={{
              flex: 1, padding: '8px', fontSize: 12,
              border: '1px solid var(--line-2)',
              background: v.productsLayout === x ? 'var(--navy)' : 'white',
              color: v.productsLayout === x ? 'white' : 'var(--text)',
              borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            }}>{x}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----- Hero -----
function HeroGeometry() {
  return (
    <div className="hero-geo" aria-hidden>
      <iframe
        src="https://www.youtube.com/embed/aDyymQMdJYI?autoplay=1&mute=1&loop=1&playlist=aDyymQMdJYI&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
    </div>
  );
}

function HeroEditorial({ t }) {
  return (
    <section className="hero hero-editorial">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow reveal">{t.hero.eyebrow}</div>
            <h1 className="display reveal" style={{ transitionDelay: '.05s' }}>
              {t.hero.title_a}<br />
              <span className="red italic-serif">{t.hero.title_b}</span><br />
              {t.hero.title_c}
            </h1>
            <p className="lede reveal" style={{ transitionDelay: '.15s', marginTop: 28 }}>{t.hero.lede}</p>
            <div className="hero-cta reveal" style={{ transitionDelay: '.22s' }}>
              <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">
                {t.hero.cta_primary} <span className="arr">→</span>
              </a>
              <Link to="/#platform" className="btn btn-ghost">{t.hero.cta_secondary}</Link>
            </div>
            <div className="hero-meta reveal" style={{ transitionDelay: '.3s' }}>
              <div><span className="dot"></span>{t.hero.meta_1}</div>
              <div><span className="dot"></span>{t.hero.meta_2}</div>
              <div><span className="dot"></span>{t.hero.meta_3}</div>
            </div>
          </div>
          <div className="hero-right reveal" style={{ transitionDelay: '.3s' }}>
            <HeroGeometry />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroConstellation({ t }) {
  const nodes = [
    { x: 50, y: 50, label: 'CORE', main: true },
    { x: 18, y: 20, label: 'Studio' },
    { x: 82, y: 20, label: 'Workflow' },
    { x: 10, y: 60, label: 'SuperApp' },
    { x: 90, y: 60, label: 'Security' },
    { x: 30, y: 88, label: 'Framework' },
    { x: 70, y: 88, label: t.intro.platform_horizontal },
  ];
  return (
    <section className="hero hero-constellation">
      <div className="container">
        <div className="eyebrow reveal">{t.hero.eyebrow}</div>
        <h1 className="display reveal" style={{ marginTop: 18, transitionDelay: '.05s' }}>
          {t.hero.title_a} <span className="red italic-serif">{t.hero.title_b}</span> {t.hero.title_c}
        </h1>
        <div className="constellation reveal" style={{ transitionDelay: '.2s' }}>
          {nodes.map((n, i) => (
            <div key={i} className={`con-node ${n.main ? 'main' : ''}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <div className="con-dot" />
              <div className="con-label">{n.label}</div>
            </div>
          ))}
          <svg className="con-lines" preserveAspectRatio="none" viewBox="0 0 100 100">
            {nodes.filter(n => !n.main).map((n, i) => (
              <line key={i} x1="50" y1="50" x2={n.x} y2={n.y} stroke="var(--line-2)" strokeWidth="0.15" />
            ))}
          </svg>
        </div>
        <p className="lede reveal" style={{ transitionDelay: '.3s', margin: '40px auto 0', textAlign: 'center' }}>{t.hero.lede}</p>
        <div className="hero-cta reveal" style={{ transitionDelay: '.35s', justifyContent: 'center' }}>
          <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">{t.hero.cta_primary} <span className="arr">→</span></a>
          <Link to="/#platform" className="btn btn-ghost">{t.hero.cta_secondary}</Link>
        </div>
      </div>
    </section>
  );
}

// ----- Intro / Platform -----
function PlatformDiagram({ t }) {
  const layers = [
    { name: 'Plateau Studio',           role: 'Design',              kind: 'design',     anchor: 'studio'    },
    { name: 'Plateau Workflow',          role: 'Automation',          kind: 'design',     anchor: 'workflow'  },
    { name: 'Plateau SuperApp',          role: 'Ecosystem',           kind: 'design',     anchor: 'superapp'  },
    { name: 'Plateau Security Suite',    role: 'Defense · 4 modules', kind: 'security',   anchor: 'security'  },
    { name: 'Plateau Framework',         role: 'Java · .NET',         kind: 'core',       anchor: 'framework' },
    { name: t.intro.platform_horizontal, role: 'Docs · DevOps · Test', kind: 'horizontal', anchor: 'services'  },
  ];
  return (
    <div className="platform-diagram reveal" style={{ transitionDelay: '.2s' }}>
      <div className="pd-header">
        <span className="mono">PLATEAU / STACK</span>
        <span className="mono">v2026.4</span>
      </div>
      <div className="pd-layers">
        {layers.map((l, i) => (
          <Link key={i} to={`/#${l.anchor}`} className={`pd-layer pd-${l.kind}`}>
            <div className="pd-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="pd-name">{l.name}</div>
            <div className="pd-role">{l.role}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Intro({ t }) {
  return (
    <section className="section" id="platform">
      <div className="container">
        <div className="intro-grid">
          <div>
            <div className="eyebrow reveal">{t.intro.eyebrow}</div>
            <h2 className="section-title reveal" style={{ marginTop: 16, transitionDelay: '.05s' }}>{t.intro.title}</h2>
          </div>
          <div>
            <p className="lede reveal" style={{ transitionDelay: '.1s' }}>{t.intro.body}</p>
            <div className="pills reveal" style={{ transitionDelay: '.15s' }}>
              {t.intro.pills.map((p, i) => <span key={i} className="pill">{p}</span>)}
            </div>
          </div>
        </div>
        <PlatformDiagram t={t} />
      </div>
    </section>
  );
}

// ----- Products (Vertical storytelling) -----
function ProductRow({ data, to, learn, children, side = 'left', id }) {
  return (
    <div className="container" id={id}>
      <div className={`product-row ${side}`}>
        <div className="product-copy reveal">
          <div className="product-tag">{data.tag}</div>
          <h3 className="product-name">{data.name}</h3>
          <p className="product-headline">{data.headline}</p>
          <p className="product-body">{data.body}</p>
          {data.bullets && (
            <ul className="product-bullets">
              {data.bullets.map((b, i) => <li key={i}><span className="bullet-dot" />{b}</li>)}
            </ul>
          )}
          <Link to={to} className="product-cta">{learn} <span>→</span></Link>
        </div>
        <div className="product-visual reveal">{children}</div>
      </div>
    </div>
  );
}

function SecurityBlock({ t, learn }) {
  const d = t.products.security;
  const sub = d.subproducts;
  const items = [sub.edge, sub.iam, sub.heimdallr, sub.zoka];
  const icons = [Shield, KeyRound, Fingerprint, ShieldAlert];
  return (
    <div className="container" id="security">
      <div className="product-row security-row">
        <div className="product-copy reveal">
          <div className="product-tag">{d.tag}</div>
          <h3 className="product-name">{d.name}</h3>
          <p className="product-headline">{d.headline}</p>
          <p className="product-body">{d.body}</p>
          <Link to="/security" className="product-cta">{learn} <span>→</span></Link>
        </div>
        <div className="security-grid reveal">
          {items.map((it, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="security-card">
                <div className="security-num">0{i + 1}</div>
                <div className="security-name">{it.name}</div>
                <div className="security-role">{it.role}</div>
                <p className="security-body">{it.body}</p>
                <div className="security-icon" aria-hidden>
                  <Icon size={36} strokeWidth={1.3} color="var(--red)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkflowBlock({ t, learn }) {
  const d = t.products.workflow;
  const features = t.pages.workflow.features;
  const icons = [MousePointer2, Users, Zap, Server];
  return (
    <div className="container" id="workflow">
      <div className="product-row security-row">
        <div className="product-copy reveal">
          <div className="product-tag">{d.tag}</div>
          <h3 className="product-name">{d.name}</h3>
          <p className="product-headline">{d.headline}</p>
          <p className="product-body">{d.body}</p>
          <Link to="/workflow" className="product-cta">{learn} <span>→</span></Link>
        </div>
        <div className="security-grid reveal">
          {features.map((f, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="security-card">
                <div className="security-num">0{i + 1}</div>
                <div className="security-name">{f.name}</div>
                <p className="security-body">{f.body}</p>
                <div className="security-icon" aria-hidden>
                  <Icon size={36} strokeWidth={1.3} color="var(--red)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FrameworkBlock({ t, learn }) {
  const d = t.products.framework;
  const features = t.pages.framework.features;
  const icons = [Terminal, Network, Wand2, Gauge];
  return (
    <div className="container" id="framework">
      <div className="product-row security-row">
        <div className="product-copy reveal">
          <div className="product-tag">{d.tag}</div>
          <h3 className="product-name">{d.name}</h3>
          <p className="product-headline">{d.headline}</p>
          <p className="product-body">{d.body}</p>
          <Link to="/framework" className="product-cta">{learn} <span>→</span></Link>
        </div>
        <div className="security-grid reveal">
          {features.map((f, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="security-card">
                <div className="security-num">0{i + 1}</div>
                <div className="security-name">{f.name}</div>
                <p className="security-body">{f.body}</p>
                <div className="security-icon" aria-hidden>
                  <Icon size={36} strokeWidth={1.3} color="var(--red)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SERVICES_MINI = [
  { label: 'Eventstore',       Icon: DatabaseZap  },
  { label: 'Raporlama',        Icon: BarChart3     },
  { label: 'Doküman Yönetimi', Icon: FileText      },
  { label: 'Bildirim',         Icon: Bell          },
  { label: 'DevOps',           Icon: GitBranch     },
  { label: 'Test Otomasyonu',  Icon: FlaskConical  },
  { label: 'AI Araçları',      Icon: Sparkles      },
  { label: 'Zamanlayıcı',      Icon: Calendar      },
];

function HorizontalBlock({ t, learn }) {
  const d = t.products.services;
  return (
    <div className="container" id="services">
      <div className="product-row horizontal-row">
        <div className="product-copy reveal">
          <div className="product-tag">{d.tag}</div>
          <h3 className="product-name">{d.name}</h3>
          <p className="product-headline">{d.headline}</p>
          <p className="product-body">{d.body}</p>
          <Link to="/services" className="product-cta">{learn} <span>→</span></Link>
        </div>
        <div className="services-mini-grid reveal">
          {SERVICES_MINI.map(({ label, Icon }) => (
            <div key={label} className="services-mini-card">
              <Icon size={22} strokeWidth={1.4} color="var(--red)" />
              <div className="services-mini-name">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsVertical({ t }) {
  const learn = t.products.learn_more;
  return (
    <section className="section section-alt" id="products">
      <ProductRow data={t.products.studio}   to="/studio"   learn={learn} id="studio"><img src={studioImg} alt="Plateau Studio" className="studio-screenshot" /></ProductRow>
      <WorkflowBlock t={t} learn={learn} />
      <ProductRow data={t.products.superapp}  to="/superapp"  learn={learn} id="superapp"><SuperAppPhones /></ProductRow>
      <SecurityBlock t={t} learn={learn} />
      <FrameworkBlock t={t} learn={learn} />
      <HorizontalBlock t={t} learn={learn} />
    </section>
  );
}

// ----- Products (Grid alternative) -----
function ProductsGrid({ t }) {
  const cards = [
    { ...t.products.studio, to: '/studio' },
    { ...t.products.workflow, to: '/workflow' },
    { ...t.products.superapp, to: '/superapp' },
    { ...t.products.security, to: '/security' },
    { ...t.products.framework, to: '/framework' },
    { ...t.products.services, to: '/services' },
  ];
  return (
    <section className="section section-alt" id="products">
      <div className="container">
        <div className="products-head">
          <div className="eyebrow reveal">{t.products.eyebrow}</div>
          <h2 className="section-title reveal" style={{ marginTop: 16, maxWidth: '18ch', transitionDelay: '.05s' }}>{t.products.title}</h2>
          <p className="lede reveal" style={{ marginTop: 18, transitionDelay: '.1s' }}>{t.products.subtitle}</p>
        </div>
        <div className="products-grid">
          {cards.map((c, i) => (
            <Link key={i} to={c.to} className="product-card reveal" style={{ transitionDelay: `${i * .05}s` }}>
              <div className="product-tag">{c.tag}</div>
              <h3 className="pc-name">{c.name}</h3>
              <p className="pc-headline">{c.headline}</p>
              <div className="pc-cta">{t.products.learn_more} →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- Numbers -----
function Stat({ s }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const check = () => {
      const r = ref.current.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.1 && r.bottom > 0) { setVisible(true); return true; }
      return false;
    };
    if (check()) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    io.observe(ref.current);
    const onScroll = () => check() && window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
  const display = useCounter(s.value, visible);
  return (
    <div ref={ref} className="stat">
      <div className="stat-value">{display}</div>
      <div className="stat-label">{s.label}</div>
      <div className="stat-note mono">{s.note}</div>
    </div>
  );
}

function Numbers({ t }) {
  return (
    <section className="section numbers-section" id="numbers">
      <div className="container">
        <div className="numbers-head">
          <div className="eyebrow reveal">{t.numbers.eyebrow}</div>
          <h2 className="section-title reveal" style={{ marginTop: 16, maxWidth: '20ch', transitionDelay: '.05s' }}>{t.numbers.title}</h2>
        </div>
        <div className="stats-grid">
          {t.numbers.stats.map((s, i) => <Stat key={i} s={s} />)}
        </div>
      </div>
    </section>
  );
}

const REFS_LOGOS = [
  { name: 'Türkiye İş Bankası', img: refIsbank },
  { name: 'Ziraat Bankası',     img: refZiraat },
  { name: 'Maximum Mobil',      img: refMaximum },
  { name: 'İş Faktöring',       img: refIsfaktoring },
  { name: 'Figopara',           img: refFigopara },
  { name: 'ProEmtia',           img: refProemtia },
  { name: 'ProSevkiyat',        img: refProsevkiyat },
  { name: 'İş Yatırım',         img: refIsyatirim },
  { name: 'İş Portföy',         img: refIsportfoy },
  { name: 'Pazarama',           img: refPazarama },
  { name: 'NAYS',               img: refNays,        large: true },
  { name: 'İş Erişim',          img: refIserisim },
];

// ----- References -----
function References({ t }) {
  return (
    <section className="section references-section">
      <div className="container">
        <div className="refs-head">
          <div className="eyebrow reveal">{t.refs.eyebrow}</div>
          <h3 className="section-title reveal" style={{ marginTop: 16, fontSize: 'clamp(24px, 3vw, 40px)', transitionDelay: '.05s' }}>{t.refs.title}</h3>
        </div>
        <div className="refs-grid reveal" style={{ transitionDelay: '.1s' }}>
          {REFS_LOGOS.map((r) => (
            <div key={r.name} className={`ref-slot ref-slot--logo${r.dark ? ' ref-slot--dark' : ''}`}>
              <img src={r.img} alt={r.name} style={r.large ? { maxHeight: 60 } : undefined} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- Testimonials -----
function Testimonials({ t }) {
  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="eyebrow reveal">{t.testimonials.eyebrow}</div>
        <h2 className="section-title reveal" style={{ marginTop: 16, maxWidth: '16ch', transitionDelay: '.05s' }}>{t.testimonials.title}</h2>
        <div className="testimonials-grid">
          {t.testimonials.items.map((q, i) => (
            <figure key={i} className="testimonial reveal" style={{ transitionDelay: `${.1 + i * .06}s` }}>
              <div className="tm-quote">"{q.quote}"</div>
              <figcaption>
                <div className="tm-author">{q.author}</div>
                <div className="tm-role mono">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- Page -----
export default function LandingPage() {
  const { lang, setLang, t } = useI18n();
  const { v, update, open } = useTweaks();
  useReveal();

  useEffect(() => {
    document.title = 'Plateau — AI-native software development platform';
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-scale', `${v.accentIntensity / 100}`);
  }, [v.accentIntensity]);

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      {v.heroVariant === 'constellation' ? <HeroConstellation t={t} /> : <HeroEditorial t={t} />}
      <Intro t={t} />
      {v.productsLayout === 'grid' ? <ProductsGrid t={t} /> : <ProductsVertical t={t} />}
      <Numbers t={t} />
      <References t={t} />
      <Testimonials t={t} />
      <Footer t={t} />
      <TweaksPanel v={v} update={update} open={open} />
    </>
  );
}
