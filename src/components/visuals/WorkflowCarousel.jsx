import { useState, useEffect, useCallback } from 'react';

import e1 from '../../assets/editors/1-workflowEditor.png';
import e2 from '../../assets/editors/2-functionEditor.png';
import e3 from '../../assets/editors/3-decisionTableEditor.png';
import e4 from '../../assets/editors/4-jobSchedulerEditor.png';
import e5 from '../../assets/editors/5-datatypeEditor.png';
import e6 from '../../assets/editors/6-constantEditor.png';
import e7 from '../../assets/editors/7-slaEditor.png';
import e8 from '../../assets/editors/8-restServiceEditor.png';
import e9 from '../../assets/editors/9-uiEditor.png';

const EDITORS = [
  { img: e1, tr: 'Workflow Editörü',      en: 'Workflow Editor' },
  { img: e2, tr: 'Fonksiyon Editörü',     en: 'Function Editor' },
  { img: e3, tr: 'Karar Tablosu Editörü', en: 'Decision Table Editor' },
  { img: e4, tr: 'Zamanlayıcı Editörü',   en: 'Job Scheduler Editor' },
  { img: e5, tr: 'Veri Tipi Editörü',     en: 'Data Type Editor' },
  { img: e6, tr: 'Sabit Editörü',         en: 'Constant Editor' },
  { img: e7, tr: 'HSA Editörü',           en: 'SLA Editor' },
  { img: e8, tr: 'REST Servis Editörü',   en: 'REST Service Editor' },
  { img: e9, tr: 'UI Editörü',            en: 'UI Editor' },
];

export default function WorkflowCarousel({ lang = 'tr' }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const n = EDITORS.length;
  const prev = (idx - 1 + n) % n;
  const next = (idx + 1) % n;

  const goPrev = useCallback(() => setIdx(prev), [prev]);
  const goNext = useCallback(() => setIdx(next), [next]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === 'Escape')      setLightbox(false);
      if (e.key === 'ArrowLeft')   setIdx(p => (p - 1 + n) % n);
      if (e.key === 'ArrowRight')  setIdx(p => (p + 1) % n);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, n]);

  return (
    <>
      <div className="wfc">
        <div className="wfc-stage">
          <button className="wfc-arrow wfc-arrow-prev" onClick={goPrev} aria-label="Previous">‹</button>
          <div className="wfc-img-wrap" onClick={() => setLightbox(true)}>
            <img src={EDITORS[idx].img} alt={EDITORS[idx][lang]} />
            <div className="wfc-zoom-hint">⤢</div>
          </div>
          <button className="wfc-arrow wfc-arrow-next" onClick={goNext} aria-label="Next">›</button>
        </div>
        <div className="wfc-footer">
          <span className="wfc-label mono">{EDITORS[idx][lang]}</span>
          <div className="wfc-dots">
            {EDITORS.map((_, i) => (
              <button key={i} className={`wfc-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} aria-label={EDITORS[i][lang]} />
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="wfc-lightbox" onClick={() => setLightbox(false)}>
          <button className="wfc-lb-nav wfc-lb-prev" onClick={e => { e.stopPropagation(); goPrev(); }}>‹</button>
          <img src={EDITORS[idx].img} alt={EDITORS[idx][lang]} onClick={e => e.stopPropagation()} />
          <button className="wfc-lb-nav wfc-lb-next" onClick={e => { e.stopPropagation(); goNext(); }}>›</button>
          <button className="wfc-lb-close" onClick={() => setLightbox(false)}>✕</button>
          <div className="wfc-lb-label mono">{EDITORS[idx][lang]}</div>
        </div>
      )}
    </>
  );
}
