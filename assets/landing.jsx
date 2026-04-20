// Landing page — Plateau
const { useState, useEffect, useRef } = React;

// ----- TWEAKS (editable defaults) -----
const TWEAKS = /*EDITMODE-BEGIN*/{
  "accentIntensity": 100,
  "heroVariant": "editorial",
  "productsLayout": "vertical"
}/*EDITMODE-END*/;

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
      fontFamily: 'var(--sans)'
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
            <button key={x}
              onClick={() => update({ heroVariant: x })}
              style={{
                flex: 1, padding: '8px', fontSize: 12,
                border: '1px solid var(--line-2)',
                background: v.heroVariant === x ? 'var(--navy)' : 'white',
                color: v.heroVariant === x ? 'white' : 'var(--text)',
                borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit'
              }}>{x}</button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Products layout</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['vertical', 'grid'].map(x => (
            <button key={x}
              onClick={() => update({ productsLayout: x })}
              style={{
                flex: 1, padding: '8px', fontSize: 12,
                border: '1px solid var(--line-2)',
                background: v.productsLayout === x ? 'var(--navy)' : 'white',
                color: v.productsLayout === x ? 'white' : 'var(--text)',
                borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit'
              }}>{x}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----- Hero -----
function HeroEditorial({ t }) {
  return (
    <section className="hero hero-editorial">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow reveal">{t.hero.eyebrow}</div>
            <h1 className="display reveal" style={{ transitionDelay: '.05s' }}>
              {t.hero.title_a}<br/>
              <span className="red italic-serif">{t.hero.title_b}</span><br/>
              {t.hero.title_c}
            </h1>
            <p className="lede reveal" style={{ transitionDelay: '.15s', marginTop: 28 }}>{t.hero.lede}</p>
            <div className="hero-cta reveal" style={{ transitionDelay: '.22s' }}>
              <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">
                {t.hero.cta_primary} <span className="arr">→</span>
              </a>
              <a href="#platform" className="btn btn-ghost">{t.hero.cta_secondary}</a>
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
        <div className="hero-tagline reveal" style={{ transitionDelay: '.4s' }}>
          <span>{t.hero.tagline}</span>
          <span className="mono hero-tagline-meta">PLATEAU · SOFTTECH · 2026</span>
        </div>
      </div>
    </section>
  );
}

function HeroGeometry() {
  return (
    <div className="hero-geo" aria-hidden>
      <div className="hero-geo-grid">
        {Array.from({ length: 60 }).map((_, i) => <div key={i} className="hero-geo-cell" />)}
      </div>
      <div className="hero-geo-arc" />
      <div className="hero-geo-dot" />
      <div className="hero-geo-label top">PLATFORM.CORE</div>
      <div className="hero-geo-label mid">STUDIO · WORKFLOW · SUPERAPP</div>
      <div className="hero-geo-label bot">SECURITY · FRAMEWORK · HORIZONTAL</div>
      <div className="hero-geo-red" />
    </div>
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
    { x: 70, y: 88, label: 'Horizontal' },
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
          <a href="#platform" className="btn btn-ghost">{t.hero.cta_secondary}</a>
        </div>
      </div>
    </section>
  );
}

// ----- Intro / Platform -----
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

function PlatformDiagram({ t }) {
  const layers = [
    { name: 'Plateau Studio', role: 'Design', kind: 'design' },
    { name: 'Plateau Workflow', role: 'Automation', kind: 'design' },
    { name: 'Plateau SuperApp', role: 'Ecosystem', kind: 'design' },
    { name: 'Plateau Security Suite', role: 'Defense · 4 modules', kind: 'security' },
    { name: 'Plateau Framework', role: 'Java · .NET', kind: 'core' },
    { name: t.intro.platform_horizontal, role: 'Docs · DevOps · Test', kind: 'horizontal' },
  ];
  return (
    <div className="platform-diagram reveal" style={{ transitionDelay: '.2s' }}>
      <div className="pd-header">
        <span className="mono">PLATEAU / STACK</span>
        <span className="mono">v2026.4</span>
      </div>
      <div className="pd-layers">
        {layers.map((l, i) => (
          <div key={i} className={`pd-layer pd-${l.kind}`}>
            <div className="pd-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="pd-name">{l.name}</div>
            <div className="pd-role">{l.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----- Products (Vertical storytelling) -----
function ProductsVertical({ t }) {
  return (
    <section className="section section-alt" id="products">
      <div className="container">
        <div className="products-head">
          <div className="eyebrow reveal">{t.products.eyebrow}</div>
          <h2 className="section-title reveal" style={{ marginTop: 16, maxWidth: '18ch', transitionDelay: '.05s' }}>{t.products.title}</h2>
          <p className="lede reveal" style={{ marginTop: 18, transitionDelay: '.1s' }}>{t.products.subtitle}</p>
        </div>
      </div>

      <ProductRow t={t} data={t.products.studio} side="left" href="studio.html" slug="studio" learn={t.products.learn_more}>
        <StudioVisual />
      </ProductRow>
      <ProductRow t={t} data={t.products.workflow} side="right" href="workflow.html" slug="workflow" learn={t.products.learn_more}>
        <WorkflowVisual />
      </ProductRow>
      <ProductRow t={t} data={t.products.superapp} side="left" href="superapp.html" slug="superapp" learn={t.products.learn_more}>
        <SuperAppVisual />
      </ProductRow>
      <SecurityBlock t={t} learn={t.products.learn_more} />
      <ProductRow t={t} data={t.products.framework} side="right" href="framework.html" slug="framework" learn={t.products.learn_more}>
        <FrameworkVisual />
      </ProductRow>
      <HorizontalBlock t={t} learn={t.products.learn_more} />
    </section>
  );
}

function ProductRow({ data, side, href, learn, children, slug }) {
  return (
    <div className="container">
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
          <a href={href} className="product-cta">{learn} <span>→</span></a>
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
  return (
    <div className="container">
      <div className="product-row security-row">
        <div className="product-copy reveal">
          <div className="product-tag">{d.tag}</div>
          <h3 className="product-name">{d.name}</h3>
          <p className="product-headline">{d.headline}</p>
          <p className="product-body">{d.body}</p>
          <a href="security.html" className="product-cta">{learn} <span>→</span></a>
        </div>
        <div className="security-grid reveal">
          {items.map((it, i) => (
            <div key={i} className="security-card">
              <div className="security-num">0{i + 1}</div>
              <div className="security-name">{it.name}</div>
              <div className="security-role">{it.role}</div>
              <p className="security-body">{it.body}</p>
              <div className="security-diagram" aria-hidden>
                {i === 0 && <EdgeDiagram/>}
                {i === 1 && <IAMDiagram/>}
                {i === 2 && <HeimdallrDiagram/>}
                {i === 3 && <ZOKADiagram/>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HorizontalBlock({ t, learn }) {
  const d = t.products.horizontal;
  return (
    <div className="container">
      <div className="product-row horizontal-row">
        <div className="product-copy reveal">
          <div className="product-tag">{d.tag}</div>
          <h3 className="product-name">{d.name}</h3>
          <p className="product-headline">{d.headline}</p>
          <p className="product-body">{d.body}</p>
          <a href="horizontal.html" className="product-cta">{learn} <span>→</span></a>
        </div>
        <div className="horizontal-grid reveal">
          {d.items.map((it, i) => (
            <div key={i} className="hz-card">
              <div className="hz-name">{it.name}</div>
              <p className="hz-body">{it.body}</p>
              <div className="hz-chip">AI-assisted</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----- Products (Grid alternative) -----
function ProductsGrid({ t }) {
  const cards = [
    { ...t.products.studio, href: 'studio.html' },
    { ...t.products.workflow, href: 'workflow.html' },
    { ...t.products.superapp, href: 'superapp.html' },
    { ...t.products.security, href: 'security.html' },
    { ...t.products.framework, href: 'framework.html' },
    { ...t.products.horizontal, href: 'horizontal.html' },
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
            <a key={i} href={c.href} className="product-card reveal" style={{ transitionDelay: `${i * .05}s` }}>
              <div className="product-tag">{c.tag}</div>
              <h3 className="pc-name">{c.name}</h3>
              <p className="pc-headline">{c.headline}</p>
              <div className="pc-cta">{t.products.learn_more} →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- Numbers -----
function useCounter(target, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const num = parseFloat(String(target).replace(/[^\d.]/g, '')) || 0;
    let raf;
    const start = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(num * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target]);
  const suffix = String(target).replace(/[\d.]/g, '');
  if (target.includes('.')) return val.toFixed(2) + suffix;
  return Math.round(val).toLocaleString() + suffix;
}

function Stat({ s }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    // Trigger immediately if already in viewport, otherwise observe
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
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="ref-slot">
              <span className="mono">CLIENT.{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
        <div className="refs-note mono">{t.refs.note}</div>
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
              <div className="tm-quote">“{q.quote}”</div>
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

// ----- CTA -----
function CTA({ t }) {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-inner">
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.cta.eyebrow}</div>
            <h2 className="section-title reveal" style={{ color: 'white', marginTop: 18, maxWidth: '18ch' }}>{t.cta.title}</h2>
            <p className="lede reveal" style={{ marginTop: 20, color: 'rgba(255,255,255,0.72)', transitionDelay: '.05s' }}>{t.cta.body}</p>
          </div>
          <div className="cta-actions reveal" style={{ transitionDelay: '.1s' }}>
            <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">{t.cta.primary} <span className="arr">→</span></a>
            <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-ghost btn-ghost-dark">{t.cta.secondary} <span className="arr">↗</span></a>
          </div>
        </div>
        <div className="cta-tagline">Be on the rise.</div>
      </div>
    </section>
  );
}

// ----- Product visuals (abstract compositions) -----
function StudioVisual() {
  return (
    <div className="viz viz-studio">
      <div className="viz-window">
        <div className="viz-titlebar"><span/><span/><span/><div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>plateau.studio / components</div></div>
        <div className="viz-studio-body">
          <div className="viz-sidebar">
            {['Buttons','Inputs','Cards','Tables','Modal','Nav'].map((l,i)=>(
              <div key={i} className={`viz-side-item ${i===2?'active':''}`}>{l}</div>
            ))}
          </div>
          <div className="viz-canvas">
            <div className="viz-card-sample">
              <div className="viz-pill" />
              <div className="viz-lines">
                <div/><div style={{width:'60%'}}/><div style={{width:'80%'}}/>
              </div>
            </div>
            <div className="viz-card-sample small">
              <div className="viz-pill small" />
              <div className="viz-lines"><div/><div style={{width:'50%'}}/></div>
            </div>
            <div className="viz-ai-hint mono">AI: generate card variant →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowVisual() {
  return (
    <div className="viz viz-workflow">
      <div className="viz-window">
        <div className="viz-titlebar"><span/><span/><span/><div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>workflow / approval.chain</div></div>
        <div className="viz-wf-body">
          <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet">
            <path d="M60 60 L140 60" stroke="var(--navy)" strokeWidth="1" />
            <path d="M140 60 L220 60" stroke="var(--navy)" strokeWidth="1" />
            <path d="M220 60 L220 130 L140 130" stroke="var(--red)" strokeWidth="1.2" />
            <path d="M220 60 L300 60 L300 180 L220 180" stroke="var(--navy)" strokeWidth="1" />

            <g><rect x="30" y="45" width="60" height="30" rx="4" fill="white" stroke="var(--navy)" />
               <text x="60" y="64" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--navy)">START</text></g>
            <g><rect x="110" y="45" width="60" height="30" rx="4" fill="white" stroke="var(--navy)" />
               <text x="140" y="64" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--navy)">FORM</text></g>
            <g><rect x="190" y="45" width="60" height="30" rx="4" fill="white" stroke="var(--red)" />
               <text x="220" y="64" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--red)">APPROVE?</text></g>
            <g><rect x="80" y="115" width="60" height="30" rx="4" fill="var(--red)" stroke="var(--red)" />
               <text x="110" y="134" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="white">REJECT</text></g>
            <g><rect x="190" y="165" width="60" height="30" rx="4" fill="var(--navy)" stroke="var(--navy)" />
               <text x="220" y="184" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="white">APPROVED</text></g>
            <g><rect x="270" y="165" width="90" height="30" rx="4" fill="white" stroke="var(--navy)" strokeDasharray="2 2" />
               <text x="315" y="184" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--navy)">NOTIFY</text></g>
          </svg>
          <div className="viz-wf-meta">
            <span className="mono">12 nodes</span>
            <span className="mono">v4.2</span>
            <span className="mono"><span style={{color:'var(--red)'}}>●</span> live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuperAppVisual() {
  const tiles = ['Bank', 'Grocery', 'Fuel', 'Health', 'Travel', 'Fitness', 'Parking', 'Dining'];
  return (
    <div className="viz viz-superapp">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-head">
            <div className="ph-logo"><span className="brand-mark" style={{ width: 14, height: 14 }} /></div>
            <div className="ph-title">SuperApp</div>
            <div className="ph-avatar" />
          </div>
          <div className="phone-card">
            <div className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,.7)' }}>TOTAL BALANCE</div>
            <div className="phone-balance">₺ 48.240<span>,00</span></div>
          </div>
          <div className="phone-tiles">
            {tiles.map((tl, i) => (
              <div key={i} className="phone-tile">
                <div className="pt-icon" />
                <div>{tl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="superapp-side">
        <div className="mono label-caps">PARTNERS</div>
        <div className="sa-list">
          {['Partner · 01','Partner · 02','Partner · 03','Partner · 04'].map((p, i) => (
            <div key={i} className="sa-row">
              <div className="sa-sq" />
              <div>{p}</div>
              <div className="mono sa-ok">active</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FrameworkVisual() {
  const layers = ['MONITORING', 'TRACING', 'LOGGING', 'CACHING'];
  return (
    <div className="viz viz-framework">
      <div className="fw-stack">
        {layers.map((l, i) => (
          <div key={i} className="fw-layer">
            <span className="mono">{l}</span>
            <div className="fw-bars">{Array.from({length: 20}).map((_, j) => <span key={j} style={{ height: `${30 + ((i*7+j*11)%60)}%` }} />)}</div>
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

function EdgeDiagram() {
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
function IAMDiagram() {
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
function HeimdallrDiagram() {
  return (
    <svg viewBox="0 0 120 60">
      <path d="M60 8 L100 22 L100 40 Q100 52 60 58 Q20 52 20 40 L20 22 Z" fill="none" stroke="var(--navy)" strokeWidth="1.2" />
      <circle cx="60" cy="32" r="6" fill="var(--red)" />
      <line x1="60" y1="32" x2="60" y2="40" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}
function ZOKADiagram() {
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

// ----- App -----
function App() {
  const { lang, setLang, t } = useI18n();
  const { v, update, open } = useTweaks();
  useReveal();

  // Apply tweak CSS vars
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
      <CTA t={t} />
      <Footer t={t} />
      <TweaksPanel v={v} update={update} open={open} />
    </>
  );
}

// Export visuals for sub-pages
Object.assign(window, { StudioVisual, WorkflowVisual, SuperAppVisual, FrameworkVisual, App });

if (!window.PLATEAU_NO_RENDER) {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
