// Shared product sub-page renderer
// Each sub-page sets window.PRODUCT_SLUG = 'studio' | 'workflow' | 'superapp' | 'security' | 'framework' | 'horizontal'

const { useEffect } = React;

const PRODUCT_META = {
  studio:     { accent: 'var(--red)',   navKey: 'studio',     prev: { slug: 'horizontal', href: 'horizontal.html' }, next: { slug: 'workflow', href: 'workflow.html' } },
  workflow:   { accent: 'var(--red)',   navKey: 'workflow',   prev: { slug: 'studio', href: 'studio.html' },         next: { slug: 'superapp', href: 'superapp.html' } },
  superapp:   { accent: 'var(--red)',   navKey: 'superapp',   prev: { slug: 'workflow', href: 'workflow.html' },     next: { slug: 'security', href: 'security.html' } },
  security:   { accent: 'var(--red)',   navKey: 'security',   prev: { slug: 'superapp', href: 'superapp.html' },     next: { slug: 'framework', href: 'framework.html' } },
  framework:  { accent: 'var(--red)',   navKey: 'framework',  prev: { slug: 'security', href: 'security.html' },     next: { slug: 'horizontal', href: 'horizontal.html' } },
  horizontal: { accent: 'var(--red)',   navKey: 'horizontal', prev: { slug: 'framework', href: 'framework.html' },   next: { slug: 'studio', href: 'studio.html' } },
};

function ProductHero({ t, slug }) {
  const pd = t.pages[slug];
  const product = t.products[slug];
  return (
    <section className="p-hero">
      <div className="container">
        <a href="index.html" className="p-back mono">← {t.nav.back}</a>
        <div className="p-hero-grid">
          <div>
            <div className="product-tag reveal">{product.tag}</div>
            <h1 className="display reveal" style={{ fontSize: 'clamp(40px, 7vw, 96px)', transitionDelay: '.05s' }}>{product.name}</h1>
            <p className="p-hero-headline reveal" style={{ transitionDelay: '.1s' }}>{pd.hero}</p>
            <p className="lede reveal" style={{ marginTop: 20, transitionDelay: '.15s' }}>{pd.body}</p>
            <div className="hero-cta reveal" style={{ transitionDelay: '.2s' }}>
              <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">{t.nav.demo} <span className="arr">→</span></a>
            </div>
          </div>
          <div className="p-hero-visual reveal" style={{ transitionDelay: '.2s' }}>
            <ProductHeroVisual slug={slug} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductHeroVisual({ slug }) {
  if (slug === 'studio') return <StudioVisual />;
  if (slug === 'workflow') return <WorkflowVisual />;
  if (slug === 'superapp') return <SuperAppVisual />;
  if (slug === 'framework') return <FrameworkVisual />;
  if (slug === 'security') return (
    <div className="viz" style={{ aspectRatio: '1/1' }}>
      <div className="viz-window" style={{ height: '100%' }}>
        <div className="viz-titlebar"><span/><span/><span/><div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>plateau.security / layers</div></div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10, height: 'calc(100% - 37px)', justifyContent: 'center' }}>
          {[{n:'Edge',d:'API Gateway'},{n:'IAM',d:'Identity & Access'},{n:'Heimdallr',d:'Critical MFA'},{n:'ZOKA',d:'Email Awareness'}].map((l,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'24px 1fr auto', gap:14, alignItems:'center', padding:'14px 16px', background: i===1?'var(--red)':'var(--bg-2)', color: i===1?'white':'var(--text)', borderRadius:8 }}>
              <div className="mono" style={{fontSize:10, opacity:.6}}>{String(i+1).padStart(2,'0')}</div>
              <div style={{fontWeight:600, fontSize:14}}>{l.n}</div>
              <div className="mono" style={{fontSize:10, opacity:.7}}>{l.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  // horizontal
  return (
    <div className="viz" style={{ aspectRatio: '1/1' }}>
      <div className="viz-window" style={{ height: '100%' }}>
        <div className="viz-titlebar"><span/><span/><span/><div className="mono" style={{ marginLeft: 12, fontSize: 10, color: 'var(--text-3)' }}>horizontal / services</div></div>
        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, height: 'calc(100% - 37px)' }}>
          {['Docs','DevOps','Test','AI'].map((l,i)=>(
            <div key={i} style={{ background: i===0?'var(--navy)':'var(--bg-2)', color: i===0?'white':'var(--text)', borderRadius:8, padding:18, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div className="mono" style={{fontSize:9, opacity:.6}}>0{i+1}</div>
              <div style={{fontWeight:600, fontSize:16, letterSpacing:'-0.01em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features({ t, slug }) {
  const features = t.pages[slug].features;
  return (
    <section className="section">
      <div className="container">
        <div className="eyebrow reveal">Capabilities</div>
        <h2 className="section-title reveal" style={{ marginTop: 16, maxWidth: '22ch', transitionDelay: '.05s' }}>
          {slug === 'security' ? t.products.security.headline : t.products[slug].headline}
        </h2>
        <div className="p-features">
          {features.map((f, i) => (
            <div key={i} className="p-feature reveal" style={{ transitionDelay: `${.05 + i*.04}s` }}>
              <div className="p-feature-num mono">{String(i + 1).padStart(2, '0')}</div>
              <div className="p-feature-name">{f.name}</div>
              <p className="p-feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCTA({ t, slug }) {
  const meta = PRODUCT_META[slug];
  return (
    <section className="section p-cta">
      <div className="container">
        <div className="p-cta-inner">
          <h2 className="section-title" style={{ maxWidth: '16ch' }}>{t.cta.title}</h2>
          <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">{t.nav.demo} <span className="arr">→</span></a>
        </div>
        <div className="p-nav">
          <a href={meta.prev.href} className="p-nav-link">
            <div className="mono">← PREV</div>
            <div className="p-nav-name">{t.nav[meta.prev.slug]}</div>
          </a>
          <a href={meta.next.href} className="p-nav-link p-nav-next">
            <div className="mono">NEXT →</div>
            <div className="p-nav-name">{t.nav[meta.next.slug]}</div>
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductApp() {
  const { lang, setLang, t } = useI18n();
  useReveal();
  const slug = window.PRODUCT_SLUG;
  useEffect(() => {
    const prod = slug === 'horizontal' ? 'Horizontal Solutions' : t.products[slug].name;
    document.title = `${prod} — Plateau`;
  }, [slug, lang]);

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <ProductHero t={t} slug={slug} />
      <Features t={t} slug={slug} />
      <ProductCTA t={t} slug={slug} />
      <Footer t={t} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProductApp />);
