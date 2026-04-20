// Shared Plateau chrome (Nav + Footer + Language toggle)
// Depends on window.PLATEAU_I18N (from i18n.js), window.getLang/setLang

const { useState, useEffect, useCallback } = React;

const DEMO_URL = "https://softtech.com.tr/urun/plateau";

function useI18n() {
  const [lang, setL] = useState(window.getLang());
  useEffect(() => {
    document.documentElement.lang = lang;
    window.setLang(lang);
    // notify any listeners (for cross-tab sync)
    window.dispatchEvent(new CustomEvent('plateau-lang', { detail: lang }));
  }, [lang]);
  const t = window.PLATEAU_I18N[lang];
  return { lang, setLang: setL, t };
}

function BrandMark({ size = 22 }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden />
  );
}

function Brand() {
  return (
    <a href="index.html" className="brand" aria-label="Plateau">
      <BrandMark />
      <span>Plateau</span>
    </a>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button className={lang === 'tr' ? 'active' : ''} onClick={() => setLang('tr')}>TR</button>
      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
    </div>
  );
}

function Nav({ lang, setLang, t }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Brand />
        <div className="nav-links">
          <a href="index.html#platform">{t.nav.platform}</a>
          <a href="index.html#products">{t.nav.products}</a>
          <a href="index.html#numbers">{t.nav.solutions}</a>
          <a href="index.html#testimonials">{t.nav.resources}</a>
          <a href="index.html#footer">{t.nav.company}</a>
        </div>
        <div className="nav-right">
          <LangToggle lang={lang} setLang={setLang} />
          <a href={DEMO_URL} target="_blank" rel="noopener" className="btn btn-primary">
            {t.nav.demo} <span className="arr">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer({ t }) {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-about">
            <Brand />
            <div className="footer-tagline">{t.footer.tagline}</div>
            <p>{t.footer.about}</p>
          </div>
          <div className="footer-col">
            <h4>{t.footer.col_products}</h4>
            <ul>
              <li><a href="studio.html">{t.nav.studio}</a></li>
              <li><a href="workflow.html">{t.nav.workflow}</a></li>
              <li><a href="superapp.html">{t.nav.superapp}</a></li>
              <li><a href="security.html">{t.nav.security}</a></li>
              <li><a href="framework.html">{t.nav.framework}</a></li>
              <li><a href="horizontal.html">{t.nav.horizontal}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.col_platform}</h4>
            <ul>{t.footer.platform_links.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.col_company}</h4>
            <ul>{t.footer.company_links.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.col_resources}</h4>
            <ul>{t.footer.resource_links.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}</ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.footer.legal}</div>
          <div>{t.footer.parent}</div>
        </div>
      </div>
    </footer>
  );
}

// Reveal-on-scroll utility
function useReveal() {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll('.reveal:not(.in)');
      const vh = window.innerHeight;
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) el.classList.add('in');
      });
    };
    run();
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    window.addEventListener('scroll', run, { passive: true });
    const t = setTimeout(run, 50);
    return () => { io.disconnect(); window.removeEventListener('scroll', run); clearTimeout(t); };
  });
}

Object.assign(window, { useI18n, Nav, Footer, Brand, BrandMark, LangToggle, useReveal, DEMO_URL });
