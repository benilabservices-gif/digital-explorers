'use client';

import { useEffect, useState } from 'react';

/** Compteur qui roule de 0 au total d'XP gagné.
 *  Rend toujours le texte final « +N XP » (contrat e2e), en sautant
 *  directement si l'utilisateur préfère réduire les animations. */
export default function XpCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setDisplay(value);
      return;
    }
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const DURATION = 1100;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className="font-bold text-lg tabular-nums">+{display} XP</span>;
}
