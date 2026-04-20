import { useEffect } from 'react';

export function useReveal() {
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
