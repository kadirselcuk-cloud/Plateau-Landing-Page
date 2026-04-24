import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useI18n } from '../hooks/useI18n';
import { useReveal } from '../hooks/useReveal';
import { DEMO_URL } from '../i18n';
import ProductHeroVisual from '../components/visuals/ProductHeroVisual';
import {
  Layout, GitBranch, Sparkles, Plug,
  MousePointer2, Users, Zap, Server,
  LayoutGrid, Code, Wallet, PieChart,
  UserCheck, Shield, Fingerprint, ShieldAlert,
  Terminal, Network, Wand2, Gauge,
  DatabaseZap, BarChart3, Bell, FlaskConical,
} from 'lucide-react';

const FEATURE_ICONS = {
  studio:    [Layout,      GitBranch,  Sparkles,    Plug],
  workflow:  [MousePointer2, Users,    Zap,         Server],
  superapp:  [LayoutGrid,  Code,       Wallet,      PieChart],
  security:  [UserCheck,   Shield,     Fingerprint, ShieldAlert],
  framework: [Terminal,    Network,    Wand2,       Gauge],
  services:  [DatabaseZap, BarChart3,  Bell,        FlaskConical],
};

const PRODUCT_META = {
  studio:     { prev: { slug: 'services', to: '/services' }, next: { slug: 'workflow',   to: '/workflow'   } },
  workflow:   { prev: { slug: 'studio',     to: '/studio'     }, next: { slug: 'superapp',   to: '/superapp'   } },
  superapp:   { prev: { slug: 'workflow',   to: '/workflow'   }, next: { slug: 'security',   to: '/security'   } },
  security:   { prev: { slug: 'superapp',   to: '/superapp'   }, next: { slug: 'framework',  to: '/framework'  } },
  framework:  { prev: { slug: 'security',   to: '/security'   }, next: { slug: 'services', to: '/services' } },
  services: { prev: { slug: 'framework',  to: '/framework'  }, next: { slug: 'studio',     to: '/studio'     } },
};

function ProductHero({ t, slug, lang }) {
  const pd = t.pages[slug];
  const product = t.products[slug];
  return (
    <section className="p-hero">
      <div className="container">
        <Link to="/" className="p-back mono">← {t.nav.back}</Link>
        <div className="p-hero-grid" style={(slug === 'workflow' || slug === 'studio' || slug === 'security') ? { gridTemplateColumns: slug === 'workflow' ? '1fr 1.2fr' : '1.2fr 1fr', alignItems: 'start' } : {}}>
          <div>
            <div className="product-tag reveal">{product.tag}</div>
            <h1 className="display reveal" style={{ fontSize: slug === 'workflow' ? 'clamp(30px, 4.2vw, 62px)' : 'clamp(34px, 5vw, 72px)', transitionDelay: '.05s' }}>
              {product.name}
            </h1>
            <p className="p-hero-headline reveal" style={{ fontSize: slug === 'workflow' ? 'clamp(16px, 1.7vw, 21px)' : undefined, transitionDelay: '.1s' }}>{pd.hero}</p>
            <p className="lede reveal" style={{ marginTop: 20, fontSize: slug === 'workflow' ? '15px' : undefined, transitionDelay: '.15s' }}>{pd.body}</p>
            {pd.body2 && <p className="lede reveal" style={{ marginTop: 12, transitionDelay: '.18s' }}>{pd.body2}</p>}
            <div className="hero-cta reveal" style={{ transitionDelay: '.2s' }}>
              <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">
                {t.nav.demo} <span className="arr">→</span>
              </a>
              {slug === 'studio' && (
                <a href="https://studio.onplateau.com/" target="_blank" rel="noopener" className="btn btn-dark">
                  studio.onplateau.com <span className="arr">↗</span>
                </a>
              )}
            </div>
          </div>
          <div className="p-hero-visual reveal" style={{ transitionDelay: '.2s', marginTop: (slug === 'studio' || slug === 'workflow' || slug === 'security') ? 29 : undefined }}>
            <ProductHeroVisual slug={slug} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features({ t, slug }) {
  const features = t.pages[slug].features;
  const icons = FEATURE_ICONS[slug] || [];
  return (
    <section className="section">
      <div className="container">
        <div className="eyebrow reveal">Capabilities</div>
        <h2 className="section-title reveal" style={{ marginTop: 16, maxWidth: '22ch', transitionDelay: '.05s' }}>
          {slug === 'security' ? t.products.security.headline : t.products[slug].headline}
        </h2>
        <div className="p-features">
          {features.map((f, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="p-feature reveal" style={{ transitionDelay: `${.05 + i * .04}s` }}>
                {Icon
                  ? <Icon size={55} strokeWidth={1.2} color="var(--red)" className="p-feature-icon" />
                  : <div className="p-feature-num mono">{String(i + 1).padStart(2, '0')}</div>
                }
                <div className="p-feature-name">{f.name}</div>
                <p className="p-feature-body">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


export default function ProductPage({ slug }) {
  const { lang, setLang, t } = useI18n();
  useReveal();

  useEffect(() => {
    document.title = `${t.products[slug].name} — Plateau`;
  }, [slug, lang, t]);

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <ProductHero t={t} slug={slug} lang={lang} />
      <Features t={t} slug={slug} />
      <Footer t={t} lang={lang} />
    </>
  );
}
