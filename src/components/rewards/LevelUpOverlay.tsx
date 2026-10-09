'use client';

import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { celebrate } from '@/lib/celebrate';

/** Moment « passage de niveau » : bannière dorée qui tombe du haut de
 *  l'écran puis s'efface d'elle-même. Volontairement PAS en fixed.inset-0 :
 *  un simple bandeau role=status qui ne recouvre pas l'overlay de
 *  récompenses (testid `adventure.rewardsOverlay`). */
export default function LevelUpOverlay({ level }: { level: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Après la fanfare de complétion (~0,9 s) : le moment niveau arrive en
    // second, sans écraser les confettis de l'overlay.
    const timer0 = setTimeout(() => celebrate('levelup'), 900);
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setVisible(false), reduce ? 1600 : 2800);
    return () => {
      clearTimeout(timer0);
      clearTimeout(timer);
    };
  }, [level]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[60] flex justify-center pointer-events-none px-6 pt-8" role="status">
      <div className="levelup-banner rounded-2xl border border-gold-400/50 bg-gold-400/15 backdrop-blur px-6 py-4 flex items-center gap-3 shadow-glow-gold">
        <Crown className="w-8 h-8 text-gold-300 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold text-gold-300 text-lg leading-tight">Niveau {level} atteint !</p>
          <p className="text-xs text-gold-300/70">Tu deviens de plus en plus fort·e, exploratrice ou explorateur.</p>
        </div>
      </div>
    </div>
  );
}
