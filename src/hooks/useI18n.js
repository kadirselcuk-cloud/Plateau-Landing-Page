import { useState, useEffect } from 'react';
import { PLATEAU_I18N, getLang, persistLang } from '../i18n';

export function useI18n() {
  const [lang, setL] = useState(getLang());
  useEffect(() => {
    document.documentElement.lang = lang;
    persistLang(lang);
    window.dispatchEvent(new CustomEvent('plateau-lang', { detail: lang }));
  }, [lang]);
  const t = PLATEAU_I18N[lang];
  return { lang, setLang: setL, t };
}
