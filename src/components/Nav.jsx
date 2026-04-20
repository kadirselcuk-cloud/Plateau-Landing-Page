import { useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand';
import LangToggle from './LangToggle';
import { DEMO_URL } from '../i18n';

const PRODUCT_SLUGS = ['studio', 'workflow', 'superapp', 'security', 'framework', 'services'];

export default function Nav({ lang, setLang, t }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const close = () => { setMobileOpen(false); setProductsOpen(false); };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Brand />

        <div className="nav-links">
          <Link to="/#platform">{t.nav.platform}</Link>

          <div className="nav-dropdown">
            <button className="nav-dropdown__btn">
              {t.nav.products}<span className="nav-dropdown__caret">▾</span>
            </button>
            <div className="nav-dropdown__panel">
              {PRODUCT_SLUGS.map(slug => (
                <Link key={slug} to={`/${slug}`}>{t.nav[slug]}</Link>
              ))}
            </div>
          </div>

          <Link to="/#numbers">{t.nav.resources}</Link>
          <Link to="/#footer">{t.nav.company}</Link>
        </div>

        <div className="nav-right">
          <LangToggle lang={lang} setLang={setLang} />
          <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">
            {t.nav.demo} <span className="arr">→</span>
          </a>
          <button
            className="nav-burger"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile${mobileOpen ? ' nav-mobile--open' : ''}`} aria-hidden={!mobileOpen}>
        <Link to="/#platform" onClick={close}>{t.nav.platform}</Link>

        <div className="nav-mobile__group">
          <button
            className="nav-mobile__expand-btn"
            aria-expanded={productsOpen}
            onClick={() => setProductsOpen(o => !o)}
          >
            {t.nav.products}
            <span className={`nav-mobile__expand-caret${productsOpen ? ' open' : ''}`}>›</span>
          </button>
          {productsOpen && (
            <div className="nav-mobile__sub-list">
              {PRODUCT_SLUGS.map(slug => (
                <Link key={slug} to={`/${slug}`} onClick={close} className="nav-mobile__sub">
                  {t.nav[slug]}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/#numbers" onClick={close}>{t.nav.resources}</Link>
        <Link to="/#footer" onClick={close}>{t.nav.company}</Link>

        <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary nav-mobile__cta" onClick={close}>
          {t.nav.demo} <span className="arr">→</span>
        </a>
      </div>
    </nav>
  );
}
