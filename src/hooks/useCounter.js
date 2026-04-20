import { useState, useEffect } from 'react';

export function useCounter(target, trigger) {
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
