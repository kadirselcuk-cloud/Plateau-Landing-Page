import { Link } from 'react-router-dom';
import Brand from './Brand';

const SOFTTECH_LOGO = 'https://www.softtech.com.tr/dosyalar/header/companyLogo.svg';
const SOFTTECH_URL  = 'https://www.softtech.com.tr';
const PRODUCT_SLUGS = ['studio', 'workflow', 'superapp', 'security', 'framework', 'horizontal'];

export default function Footer({ t }) {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">
        <div className="footer-top">

          <div className="footer-about">
            <Brand />
            <p>{t.footer.about}</p>
          </div>

          <div className="footer-col">
            <h4>{t.footer.col_products}</h4>
            <ul>
              {PRODUCT_SLUGS.map(slug => (
                <li key={slug}><Link to={`/${slug}`}>{t.nav[slug]}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <a href={SOFTTECH_URL} target="_blank" rel="noopener" className="footer-softtech-logo">
              <img src={SOFTTECH_LOGO} alt="Softtech" />
            </a>
            <h4>{t.footer.col_contact}</h4>
            <address>
              <span>{t.footer.contact_address}</span>
              <a href={`tel:${t.footer.contact_phone.replace(/\s/g, '')}`}>{t.footer.contact_phone}</a>
              <a href={SOFTTECH_URL} target="_blank" rel="noopener">{t.footer.contact_web}</a>
            </address>
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
